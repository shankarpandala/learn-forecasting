import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

const basicCatBoostCode = `# pip install catboost
from catboost import CatBoostRegressor, Pool
import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

# ── Feature engineering ──────────────────────────────────────────────────────
np.random.seed(7)
n = 700
dates = pd.date_range('2021-01-01', periods=n, freq='D')
y_raw = (200
         + np.linspace(0, 25, n)
         + 20 * np.sin(2 * np.pi * np.arange(n) / 365.25)
         + np.random.randn(n) * 6)

df = pd.DataFrame({'ds': dates, 'y': y_raw})
for lag in [1, 2, 3, 7, 14, 28]:
    df[f'lag_{lag}'] = df['y'].shift(lag)
for w in [7, 14, 28]:
    s = df['y'].shift(1)
    df[f'rmean_{w}'] = s.rolling(w).mean()
    df[f'rstd_{w}']  = s.rolling(w).std()
df['dow']   = df['ds'].dt.dayofweek.astype(str)   # string = categorical
df['month'] = df['ds'].dt.month.astype(str)
df['dow_sin'] = np.sin(2 * np.pi * df['ds'].dt.dayofweek / 7)
df['dow_cos'] = np.cos(2 * np.pi * df['ds'].dt.dayofweek / 7)
df = df.dropna()

features  = [c for c in df.columns if c not in ['ds', 'y']]
cat_cols  = ['dow', 'month']
num_cols  = [c for c in features if c not in cat_cols]
X = df[features]
y = df['y'].values

# ── CatBoost with TimeSeriesSplit ──────────────────────────────────────────────
tscv = TimeSeriesSplit(n_splits=5, test_size=28)
maes = []

for fold, (tr, va) in enumerate(tscv.split(X)):
    X_tr, X_va = X.iloc[tr], X.iloc[va]
    y_tr, y_va = y[tr], y[va]

    # CatBoost Pool: wraps X + y + categorical feature indices
    train_pool = Pool(X_tr, y_tr, cat_features=cat_cols)
    val_pool   = Pool(X_va, y_va, cat_features=cat_cols)

    model = CatBoostRegressor(
        iterations=1000,
        learning_rate=0.05,
        depth=6,                    # max tree depth
        l2_leaf_reg=3.0,            # L2 regularisation
        rsm=0.8,                    # random subspace method (feature fraction)
        subsample=0.8,              # row sub-sampling
        eval_metric='MAE',
        early_stopping_rounds=50,
        random_seed=42,
        verbose=False,
    )
    model.fit(train_pool, eval_set=val_pool)

    preds = model.predict(val_pool)
    mae   = mean_absolute_error(y_va, preds)
    maes.append(mae)
    print(f"Fold {fold+1}: best_iter={model.best_iteration_}, MAE={mae:.3f}")

print(f"\\nMean CV MAE: {np.mean(maes):.3f} ± {np.std(maes):.3f}")
`;

const orderedBoostingCode = `# CatBoost's "Ordered Boosting" is its core differentiator.
# Standard gradient boosting computes pseudo-residuals using the full
# training set, which causes overfitting on categorical target statistics.
#
# Ordered boosting fixes this:
# 1. Assign each training example a random order (permutation)
# 2. When computing the gradient for example i, use only examples
#    that appear BEFORE i in the random order
# 3. For categorical features, compute target statistics using only
#    the "past" examples in the permutation
#
# This eliminates target leakage in categorical encoding, which is
# particularly impactful when many high-cardinality categoricals exist.
#
# In practice: set boosting_type='Ordered' (default for small datasets)
# For large datasets (>50K rows), 'Plain' is faster with minimal accuracy loss.

from catboost import CatBoostRegressor

model_ordered = CatBoostRegressor(
    iterations=500,
    learning_rate=0.05,
    boosting_type='Ordered',      # default for small/medium datasets
    verbose=False,
)

model_plain = CatBoostRegressor(
    iterations=500,
    learning_rate=0.05,
    boosting_type='Plain',        # faster, use for >50K rows
    verbose=False,
)
print("Ordered and Plain boosting models configured.")
`;

const demandForecastCode = `from catboost import CatBoostRegressor, Pool
import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

# Multi-series demand forecasting with CatBoost
# High-cardinality store + product categoricals — where CatBoost excels

np.random.seed(0)
n_stores   = 20
n_products = 50
dates      = pd.date_range('2022-01-01', periods=365, freq='D')

records = []
for store in range(n_stores):
    for prod in range(n_products):
        base = 50 + store * 5 + prod * 2
        sales = (base
                 + 5 * np.sin(2 * np.pi * np.arange(365) / 7)
                 + np.random.randn(365) * 3)
        for i, d in enumerate(dates):
            records.append({
                'ds':       d,
                'store_id': f'store_{store:02d}',
                'product':  f'prod_{prod:03d}',
                'y':        max(0, sales[i]),
            })

df = pd.DataFrame(records)
df = df.sort_values(['store_id', 'product', 'ds'])

# Lag features within each series
for lag in [1, 7, 14]:
    df[f'lag_{lag}'] = df.groupby(['store_id', 'product'])['y'].shift(lag)
df['roll_mean_7'] = (
    df.groupby(['store_id', 'product'])['y']
      .transform(lambda x: x.shift(1).rolling(7).mean())
)
df['dow']   = df['ds'].dt.dayofweek.astype(str)
df['month'] = df['ds'].dt.month.astype(str)
df = df.dropna()

features = ['store_id', 'product', 'dow', 'month', 'lag_1', 'lag_7', 'lag_14', 'roll_mean_7']
cat_cols  = ['store_id', 'product', 'dow', 'month']
X = df[features]
y = df['y'].values

# Time-based split (last 28 days as test)
split_date = pd.Timestamp('2022-12-04')
tr_mask = df['ds'] < split_date
va_mask = df['ds'] >= split_date

train_pool = Pool(X[tr_mask], y[tr_mask], cat_features=cat_cols)
val_pool   = Pool(X[va_mask], y[va_mask], cat_features=cat_cols)

model = CatBoostRegressor(
    iterations=500,
    learning_rate=0.05,
    depth=6,
    l2_leaf_reg=3.0,
    eval_metric='MAE',
    early_stopping_rounds=50,
    random_seed=42,
    verbose=False,
)
model.fit(train_pool, eval_set=val_pool)

preds = model.predict(val_pool)
print(f"Test MAE: {mean_absolute_error(y[va_mask], preds):.3f}")
print(f"Best iteration: {model.best_iteration_}")
`;

const featureImportanceCode = `from catboost import CatBoostRegressor
import pandas as pd
import numpy as np

# CatBoost provides multiple feature importance measures

# 1. PredictionValuesChange (default): similar to MDI in random forests
# 2. LossFunctionChange: how much loss increases if feature is removed
# 3. ShapValues: SHAP values (most reliable, most expensive)

model.fit(train_pool, eval_set=val_pool, verbose=False)

# Default importance
imp_default = pd.Series(
    model.get_feature_importance(),
    index=features
).sort_values(ascending=False)
print("PredictionValuesChange importance:")
print(imp_default)

# SHAP values
shap_vals = model.get_feature_importance(
    data=val_pool,
    type='ShapValues',
)  # shape (n_samples, n_features + 1)

shap_mean = pd.Series(
    np.abs(shap_vals[:, :-1]).mean(axis=0),
    index=features
).sort_values(ascending=False)
print("\\nSHAP importance:")
print(shap_mean)
`;

const references = [
  { title: 'CatBoost: unbiased boosting with categorical features', author: 'Prokhorenkova et al.', year: 2018, url: 'https://arxiv.org/abs/1706.09516' },
  { title: 'CatBoost documentation', author: 'Yandex', year: 2024, url: 'https://catboost.ai/docs/' },
  { title: 'Ordered Boosting in CatBoost', author: 'Dorogush, A. et al.', year: 2017, url: 'https://arxiv.org/abs/1706.09516' },
  { title: 'Benchmarking gradient boosting algorithms for tabular data', author: 'Grinsztajn et al.', year: 2022, url: 'https://arxiv.org/abs/2207.08815' },
];

export default function CatBoostForecasting() {
  return (
    <SectionLayout title="CatBoost for Forecasting" difficulty="intermediate" readingTime={10}>
      <p className="text-zinc-300 leading-relaxed">
        CatBoost, developed by Yandex in 2017, introduces ordered boosting — a technique
        that eliminates target leakage in categorical feature encoding. For time series
        forecasting problems with many categorical identifiers (store, product, region,
        customer segment), CatBoost often outperforms XGBoost and LightGBM with
        significantly less preprocessing.
      </p>

      <DefinitionBlock term="Ordered Boosting">
        A variant of gradient boosting that computes pseudo-residuals for each training
        example using only the subset of data that comes before it in a random
        permutation. This prevents the target leakage problem that arises when
        gradient statistics for categorical feature encoding are computed from the
        full training set.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Why Ordered Boosting Matters</h2>
      <p className="text-zinc-300 leading-relaxed">
        Standard gradient boosting with target-encoded categoricals has a subtle
        leakage issue: the target encoding of a category is computed using all rows
        of that category, including the row being predicted. This causes overfitting
        on high-cardinality categorical features. CatBoost solves this with its
        ordered approach:
      </p>

      <PythonCode code={orderedBoostingCode} title="Ordered vs. Plain Boosting in CatBoost" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
        {[
          { title: 'No manual encoding', desc: 'Pass string/integer categorical columns directly — no one-hot or target encoding required' },
          { title: 'Ordered statistics', desc: 'Target statistics computed without leakage, crucial for high-cardinality IDs' },
          { title: 'Symmetric trees', desc: 'All nodes at the same depth use the same split — faster GPU inference, better generalisation' },
          { title: 'Robust to defaults', desc: 'Default hyperparameters work well out-of-the-box; less tuning needed than XGBoost/LGB' },
          { title: 'Built-in SHAP', desc: 'Fast SHAP value computation via get_feature_importance(type="ShapValues")' },
          { title: 'Missing values', desc: 'Native handling of NaN without imputation' },
        ].map(i => (
          <div key={i.title} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
            <p className="text-sky-400 text-sm font-semibold">{i.title}</p>
            <p className="text-zinc-400 text-xs mt-1">{i.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Basic Forecasting Pipeline</h2>

      <PythonCode code={basicCatBoostCode} title="CatBoost Forecasting with TimeSeriesSplit" />

      <NoteBlock title="Passing Categoricals to CatBoost">
        CatBoost requires categorical features to be either string type or integer type
        — not pandas Categorical. Pass the column names (or indices) via
        <code>cat_features</code> in the <code>Pool</code> constructor. String columns
        are automatically handled; integer columns designated as categorical are treated
        as unordered categories rather than numeric values.
      </NoteBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Multi-Series Demand Forecasting</h2>
      <p className="text-zinc-300 leading-relaxed">
        CatBoost's native categorical support is most valuable when forecasting hundreds
        or thousands of series with categorical identifiers (store, product, SKU, region).
        A global model can learn cross-series patterns without any manual encoding.
      </p>

      <PythonCode code={demandForecastCode} title="Demand Forecasting with Store + Product Categoricals" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Feature Importance and SHAP</h2>

      <PythonCode code={featureImportanceCode} title="Feature Importance Methods in CatBoost" />

      <div className="overflow-x-auto my-4">
        <table className="text-sm text-zinc-300 border-collapse w-full">
          <thead><tr className="bg-zinc-800">
            {['Parameter', 'Default', 'Role'].map(h => (
              <th key={h} className="border border-zinc-700 px-3 py-2 text-left text-xs">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              ['iterations', '1000', 'number of trees (use with early stopping)'],
              ['learning_rate', '0.03', 'shrinkage (lower than XGBoost default)'],
              ['depth', '6', 'symmetric tree depth (4–10 for TS)'],
              ['l2_leaf_reg', '3.0', 'L2 regularisation on leaf values'],
              ['rsm', '1.0', 'random subspace method (feature fraction)'],
              ['subsample', '1.0 (Bernoulli)', 'row sub-sampling (bootstrap=Bernoulli)'],
              ['boosting_type', 'Ordered/Plain', 'Ordered for <50K rows; Plain otherwise'],
              ['border_count', '254', 'histogram bucket count (like num_leaves in LGB)'],
            ].map(r => (
              <tr key={r[0]} className="hover:bg-zinc-800">
                {r.map((v, i) => <td key={i} className="border border-zinc-700 px-3 py-1 font-mono text-xs">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WarningBlock title="Training Speed vs. XGBoost/LightGBM">
        CatBoost's ordered boosting with symmetric trees is slower to train than
        LightGBM on pure numerical data. For datasets with many numerical features
        and few categoricals, LightGBM is usually preferred. CatBoost's speed
        advantage emerges with GPU training and many high-cardinality categoricals,
        where its native encoding avoids the preprocessing overhead.
      </WarningBlock>

      <TheoremBlock title="CatBoost vs. XGBoost/LightGBM — When to Choose">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Choose CatBoost</strong> when: many high-cardinality categoricals (store/product IDs), limited time for feature preprocessing, need robust out-of-box defaults</li>
          <li><strong>Choose LightGBM</strong> when: large dataset (&gt;500K rows), need fastest training, primarily numerical features</li>
          <li><strong>Choose XGBoost</strong> when: small dataset, maximum sklearn ecosystem compatibility, extensive community resources needed</li>
          <li><strong>In practice</strong>: ensemble all three for maximum accuracy (a common pattern in top forecasting competition solutions)</li>
        </ul>
      </TheoremBlock>

      <ExampleBlock title="E-commerce Demand Forecasting with CatBoost">
        <p className="text-zinc-300 text-sm">
          An e-commerce retailer with 10,000 SKUs across 50 warehouses uses CatBoost
          for 7-day-ahead demand forecasting:
        </p>
        <ul className="list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2">
          <li>Categorical features: sku_id, warehouse_id, category, brand (all high-cardinality)</li>
          <li>No manual encoding — passed directly as string columns</li>
          <li>Numerical features: lags [1,7,14,28], rolling [7,28], price, is_promotion</li>
          <li>Model trained globally on all series: 1 model, 500K rows</li>
          <li>Result: 12% lower MAPE vs. per-SKU ARIMA baseline, 3x faster to retrain</li>
        </ul>
      </ExampleBlock>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
