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

const basicLGBCode = `# pip install lightgbm
import lightgbm as lgb
import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

# ── Feature engineering ──────────────────────────────────────────────────────
np.random.seed(1)
n = 900
dates = pd.date_range('2021-01-01', periods=n, freq='D')
y_raw = (150
         + np.linspace(0, 40, n)
         + 15 * np.sin(2 * np.pi * np.arange(n) / 365.25)
         + 5  * np.sin(2 * np.pi * np.arange(n) / 7)
         + np.random.randn(n) * 5)

df = pd.DataFrame({'ds': dates, 'y': y_raw})
for lag in [1, 2, 3, 7, 14, 28]:
    df[f'lag_{lag}'] = df['y'].shift(lag)
for w in [7, 14, 28]:
    s = df['y'].shift(1)
    df[f'rmean_{w}'] = s.rolling(w).mean()
    df[f'rstd_{w}']  = s.rolling(w).std()
df['dow']   = df['ds'].dt.dayofweek     # categorical: 0–6
df['month'] = df['ds'].dt.month         # categorical: 1–12
df['dow_sin'] = np.sin(2 * np.pi * df['dow'] / 7)
df['dow_cos'] = np.cos(2 * np.pi * df['dow'] / 7)
df = df.dropna()

features  = [c for c in df.columns if c not in ['ds', 'y']]
cat_feats = ['dow', 'month']    # will use LightGBM's native categorical support
X = df[features]
y = df['y'].values

# ── LightGBM dataset and training ─────────────────────────────────────────────
tscv = TimeSeriesSplit(n_splits=5, test_size=28)
maes = []

for fold, (tr, va) in enumerate(tscv.split(X)):
    dtrain = lgb.Dataset(X.iloc[tr], label=y[tr], categorical_feature=cat_feats, free_raw_data=False)
    dval   = lgb.Dataset(X.iloc[va], label=y[va], reference=dtrain, free_raw_data=False)

    params = {
        'objective':       'regression',
        'metric':          'mae',
        'learning_rate':   0.05,
        'num_leaves':      63,           # primary complexity parameter
        'min_data_in_leaf': 20,
        'feature_fraction': 0.8,         # colsample equivalent
        'bagging_fraction': 0.8,         # subsample equivalent
        'bagging_freq':    1,
        'reg_alpha':       0.1,
        'reg_lambda':      1.0,
        'verbose':         -1,
        'seed':            42,
    }
    model = lgb.train(
        params,
        dtrain,
        num_boost_round=1000,
        valid_sets=[dval],
        callbacks=[
            lgb.early_stopping(stopping_rounds=50, verbose=False),
            lgb.log_evaluation(period=-1),
        ],
    )
    preds = model.predict(X.iloc[va])
    mae   = mean_absolute_error(y[va], preds)
    maes.append(mae)
    print(f"Fold {fold+1}: best_iter={model.best_iteration}, MAE={mae:.3f}")

print(f"\\nMean CV MAE: {np.mean(maes):.3f} ± {np.std(maes):.3f}")
`;

const categoricalCode = `import lightgbm as lgb
import pandas as pd
import numpy as np

# LightGBM handles categorical features natively using
# an optimal many-vs-many grouping strategy (Fisher 1958).
# This is superior to one-hot encoding for high-cardinality categoricals.

# Create a multi-store dataset
np.random.seed(0)
n = 2000
df = pd.DataFrame({
    'ds':       pd.date_range('2022-01-01', periods=n, freq='D').repeat(1),
    'store_id': np.random.choice(['A', 'B', 'C', 'D', 'E'], size=n),
    'product':  np.random.choice(range(50), size=n),
})
df['y'] = (df['store_id'].map({'A':100,'B':150,'C':200,'D':80,'E':120})
           + df['product'] * 2
           + np.random.randn(n) * 10)

# Convert to pandas Categorical — LightGBM detects these automatically
df['store_id'] = df['store_id'].astype('category')
df['product']  = df['product'].astype('category')

# Lag features (within each store/product group)
df = df.sort_values(['store_id', 'product', 'ds'])
df['lag_1'] = df.groupby(['store_id', 'product'])['y'].shift(1)
df = df.dropna()

X = df[['store_id', 'product', 'lag_1']]
y = df['y'].values

# LightGBM automatically treats pandas Categorical columns as categoricals
dtrain = lgb.Dataset(X, label=y)
params = {
    'objective': 'regression_l1',
    'num_leaves': 31,
    'learning_rate': 0.05,
    'verbose': -1,
}
model = lgb.train(params, dtrain, num_boost_round=200)
print("Model trained with native categorical features.")
print(f"Feature importance: {dict(zip(X.columns, model.feature_importance()))}")
`;

const hyperparamCode = `import lightgbm as lgb
import optuna
from sklearn.model_selection import TimeSeriesSplit, cross_val_score
import numpy as np

# Optuna is the recommended hyperparameter tuner for LightGBM
# pip install optuna

def objective(trial):
    params = {
        'objective':         'regression',
        'metric':            'mae',
        'verbosity':         -1,
        'num_leaves':        trial.suggest_int('num_leaves', 20, 300),
        'learning_rate':     trial.suggest_float('lr', 0.01, 0.2, log=True),
        'min_data_in_leaf':  trial.suggest_int('min_data', 5, 100),
        'feature_fraction':  trial.suggest_float('feature_fraction', 0.4, 1.0),
        'bagging_fraction':  trial.suggest_float('bagging_fraction', 0.4, 1.0),
        'bagging_freq':      trial.suggest_int('bagging_freq', 1, 7),
        'reg_alpha':         trial.suggest_float('alpha', 0.0, 5.0),
        'reg_lambda':        trial.suggest_float('lambda', 0.0, 5.0),
        'seed': 42,
    }
    tscv = TimeSeriesSplit(n_splits=5, test_size=28)
    maes = []
    for tr, va in tscv.split(X):
        dtrain = lgb.Dataset(X[tr], label=y[tr])
        dval   = lgb.Dataset(X[va], label=y[va], reference=dtrain)
        m = lgb.train(params, dtrain, num_boost_round=300,
                      valid_sets=[dval],
                      callbacks=[lgb.early_stopping(30, verbose=False),
                                 lgb.log_evaluation(-1)])
        maes.append(np.mean(np.abs(y[va] - m.predict(X[va]))))
    return np.mean(maes)

# study = optuna.create_study(direction='minimize')
# study.optimize(objective, n_trials=50, show_progress_bar=True)
# print("Best params:", study.best_params)
# print("Best MAE:", study.best_value)
print("Optuna objective function defined. Call study.optimize() to run.")
`;

const gpuCode = `import lightgbm as lgb
import numpy as np

# GPU training with LightGBM
# Requirements: LightGBM compiled with GPU support
# pip install lightgbm --install-option=--gpu   (or use pre-built wheels)

params_gpu = {
    'objective':     'regression',
    'metric':        'mae',
    'device':        'gpu',          # or 'cuda' for CUDA-based GPU
    'gpu_platform_id': 0,
    'gpu_device_id': 0,
    'num_leaves':    255,            # can afford deeper trees with GPU speed
    'learning_rate': 0.05,
    'feature_fraction': 0.8,
    'verbose': -1,
}

# For CPU: histogram-based training is already very fast
params_cpu = {
    'objective':     'regression',
    'metric':        'mae',
    'device':        'cpu',
    'num_threads':   8,              # parallelism
    'num_leaves':    63,
    'learning_rate': 0.05,
    'verbose': -1,
}

# LightGBM CPU is already faster than XGBoost for large datasets
# GPU provides 10-100x speedup on very large datasets (>1M rows)
print("GPU and CPU configurations defined.")
`;

const sklearnCode = `import lightgbm as lgb
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import numpy as np

# sklearn-compatible LGBMRegressor
model = lgb.LGBMRegressor(
    n_estimators=1000,
    learning_rate=0.05,
    num_leaves=63,
    min_child_samples=20,          # min_data_in_leaf equivalent
    subsample=0.8,
    subsample_freq=1,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=1.0,
    random_state=42,
    n_jobs=-1,
    verbose=-1,
)

# LightGBM does NOT need feature scaling — tree splits are scale-invariant.
# But if embedding in a pipeline with a linear model:
pipe = Pipeline([
    # ('scaler', StandardScaler()),   # NOT needed for LightGBM
    ('lgb', model),
])

# Fit with early stopping via callbacks
from sklearn.model_selection import TimeSeriesSplit
tscv = TimeSeriesSplit(n_splits=5, test_size=28)
tr, va = list(tscv.split(X))[-1]

model.fit(
    X[tr], y[tr],
    eval_set=[(X[va], y[va])],
    callbacks=[lgb.early_stopping(50), lgb.log_evaluation(-1)],
)
print(f"Best iteration: {model.best_iteration_}")
`;

const references = [
  { title: 'LightGBM: A Highly Efficient Gradient Boosting Decision Tree', author: 'Ke et al.', year: 2017, url: 'https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html' },
  { title: 'LightGBM documentation', author: 'Microsoft', year: 2024, url: 'https://lightgbm.readthedocs.io/' },
  { title: 'Optuna: A Next-generation Hyperparameter Optimization Framework', author: 'Akiba et al.', year: 2019, url: 'https://arxiv.org/abs/1907.10902' },
  { title: 'M5 Forecasting Competition — Methods overview', author: 'Makridakis et al.', year: 2022, url: 'https://doi.org/10.1016/j.ijforecast.2021.11.013' },
];

export default function LightGBMForecasting() {
  return (
    <SectionLayout title="LightGBM for Forecasting" difficulty="intermediate" readingTime={13}>
      <p className="text-zinc-300 leading-relaxed">
        LightGBM (Light Gradient Boosting Machine) was developed by Microsoft to
        address XGBoost's speed limitations on large datasets. It introduced two
        key innovations — histogram-based splitting and leaf-wise tree growth — that
        make it significantly faster and often more accurate than XGBoost, especially
        on high-dimensional feature sets common in ML forecasting pipelines.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Key Architectural Innovations</h2>

      <DefinitionBlock term="Histogram-Based Splitting">
        Instead of sorting all feature values to find split points (O(n log n)),
        LightGBM bins continuous features into <InlineMath math="K" /> discrete
        histogram buckets (default K=255). Split finding then requires scanning only
        K buckets rather than all n values — reducing the per-tree cost from
        <InlineMath math="O(np)" /> to <InlineMath math="O(Kp)" />, where{' '}
        <InlineMath math="K \ll n" />.
      </DefinitionBlock>

      <DefinitionBlock term="Leaf-Wise (Best-First) Tree Growth">
        XGBoost grows trees level-by-level (depth-first). LightGBM grows the leaf
        with the largest loss reduction at each step, regardless of depth. This
        produces asymmetric trees that reduce loss faster per split, but requires the{' '}
        <code>max_depth</code> or <code>num_leaves</code> constraint to prevent
        overfitting.
        <BlockMath math={String.raw`\text{next leaf} = \arg\max_{\ell} \Delta L_\ell`} />
        The result: with the same <code>num_leaves</code>, leaf-wise trees achieve
        lower loss than depth-wise trees.
      </DefinitionBlock>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-5">
        {[
          { title: 'Speed', val: '5–20x faster than XGBoost on large datasets' },
          { title: 'num_leaves', val: 'Primary complexity knob (replaces max_depth)' },
          { title: 'GOSS', val: 'Gradient-based One-Side Sampling: focus on high-gradient rows' },
          { title: 'EFB', val: 'Exclusive Feature Bundling: compresses sparse features' },
          { title: 'Native categoricals', val: 'Optimal split finding for categorical features' },
          { title: 'GPU training', val: 'Full GPU support with histogram method' },
        ].map(i => (
          <div key={i.title} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
            <p className="text-sky-400 text-sm font-semibold">{i.title}</p>
            <p className="text-zinc-400 text-xs mt-1">{i.val}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Full Forecasting Pipeline</h2>

      <PythonCode code={basicLGBCode} title="LightGBM Forecasting — Full Pipeline" />

      <WarningBlock title="num_leaves is the Primary Regularisation Knob">
        Unlike XGBoost where <code>max_depth</code> is primary, LightGBM's main
        complexity control is <code>num_leaves</code>. A model with
        <code>num_leaves=127</code> and <code>max_depth=7</code> is very different
        from a model with only <code>max_depth=7</code>. Always tune
        <code>num_leaves</code> first, then <code>min_data_in_leaf</code> for regularisation.
      </WarningBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Native Categorical Features</h2>
      <p className="text-zinc-300 leading-relaxed">
        LightGBM's categorical feature support uses an optimal Fisher grouping
        algorithm that finds the best many-vs-many partition of categories, avoiding
        the cardinality explosion of one-hot encoding. For time series forecasting with
        many store/product IDs, this is a significant advantage.
      </p>

      <PythonCode code={categoricalCode} title="Native Categorical Features in LightGBM" />

      <NoteBlock title="When to Use Native Categoricals">
        LightGBM's native categorical handling outperforms one-hot encoding when
        cardinality is high (&gt;10 categories) and the relationship between category
        and target is non-linear. For low-cardinality features (e.g., day_of_week with
        7 values), cyclical encoding may still be preferred for linear model
        interpretability.
      </NoteBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Hyperparameter Tuning with Optuna</h2>

      <PythonCode code={hyperparamCode} title="Optuna Hyperparameter Search for LightGBM" />

      <div className="overflow-x-auto my-4">
        <table className="text-sm text-zinc-300 border-collapse w-full">
          <thead><tr className="bg-zinc-800">
            {['Parameter', 'Default', 'Effect', 'Typical range'].map(h => (
              <th key={h} className="border border-zinc-700 px-3 py-2 text-left text-xs">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              ['num_leaves', '31', 'model complexity', '20–300 (start at 63)'],
              ['learning_rate', '0.1', 'shrinkage', '0.01–0.1'],
              ['min_data_in_leaf', '20', 'regularisation', '10–100 for TS'],
              ['feature_fraction', '1.0', 'column sub-sampling', '0.6–1.0'],
              ['bagging_fraction', '1.0', 'row sub-sampling', '0.6–0.9'],
              ['bagging_freq', '0', 'sub-sampling frequency', '1–5'],
              ['reg_alpha', '0', 'L1 penalty', '0–2.0'],
              ['reg_lambda', '0', 'L2 penalty', '0–5.0'],
            ].map(r => (
              <tr key={r[0]} className="hover:bg-zinc-800">
                {r.map((v, i) => <td key={i} className="border border-zinc-700 px-3 py-1 font-mono text-xs">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">GPU Training</h2>

      <PythonCode code={gpuCode} title="GPU Training Configuration" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Sklearn API</h2>

      <PythonCode code={sklearnCode} title="LGBMRegressor (sklearn API)" />

      <TheoremBlock title="LightGBM vs. XGBoost for Forecasting">
        Empirically, LightGBM trains 5–20x faster than XGBoost on large datasets
        (&gt;100K rows) due to histogram-based splitting. Accuracy is similar —
        neither consistently dominates, though LightGBM often wins on high-cardinality
        categorical features. For the M5 competition (30K series, millions of rows),
        LightGBM was the workhorse of most top solutions due to its training speed,
        enabling more extensive hyperparameter search and more complex feature engineering.
      </TheoremBlock>

      <ExampleBlock title="Electricity Demand Forecasting — LightGBM Config">
        <p className="text-zinc-300 text-sm">
          For a national-level hourly electricity demand forecasting problem
          (8760 historical observations per year, 24-hour horizon):
        </p>
        <ul className="list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2">
          <li>objective: regression_l1 (MAE — robust to demand spikes)</li>
          <li>num_leaves: 127, min_data_in_leaf: 50</li>
          <li>learning_rate: 0.05, n_estimators: 800 with early stopping</li>
          <li>feature_fraction: 0.7, bagging_fraction: 0.8, bagging_freq: 1</li>
          <li>Native categoricals: hour, day_of_week, month, is_holiday</li>
          <li>Exogenous: temperature (lag_1, lag_24, rolling_mean_24)</li>
          <li>Training time on CPU (8 cores): ~45 seconds vs ~8 min for XGBoost</li>
        </ul>
      </ExampleBlock>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
