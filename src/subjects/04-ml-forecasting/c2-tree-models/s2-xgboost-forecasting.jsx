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

const basicXGBCode = `# pip install xgboost
import xgboost as xgb
import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

# ── Feature engineering ──────────────────────────────────────────────────────
np.random.seed(0)
n = 800
dates = pd.date_range('2021-01-01', periods=n, freq='D')
y_raw = (100 + np.linspace(0, 30, n)
         + 12 * np.sin(2 * np.pi * np.arange(n) / 365.25)
         + np.random.randn(n) * 4)

df = pd.DataFrame({'ds': dates, 'y': y_raw})
for lag in [1, 2, 3, 7, 14, 28]:
    df[f'lag_{lag}'] = df['y'].shift(lag)
for w in [7, 14, 28]:
    s = df['y'].shift(1)
    df[f'rmean_{w}'] = s.rolling(w).mean()
    df[f'rstd_{w}']  = s.rolling(w).std()
df['dow_sin'] = np.sin(2 * np.pi * df['ds'].dt.dayofweek / 7)
df['dow_cos'] = np.cos(2 * np.pi * df['ds'].dt.dayofweek / 7)
df['month']   = df['ds'].dt.month
df = df.dropna()

features = [c for c in df.columns if c not in ['ds', 'y']]
X, y = df[features].values, df['y'].values

# ── XGBoost with early stopping ───────────────────────────────────────────────
tscv = TimeSeriesSplit(n_splits=5, test_size=28)
maes = []

for fold, (train_idx, val_idx) in enumerate(tscv.split(X)):
    dtrain = xgb.DMatrix(X[train_idx], label=y[train_idx], feature_names=features)
    dval   = xgb.DMatrix(X[val_idx],   label=y[val_idx],   feature_names=features)

    params = {
        'objective':        'reg:squarederror',
        'learning_rate':    0.05,
        'max_depth':        6,
        'min_child_weight': 5,
        'subsample':        0.8,
        'colsample_bytree': 0.8,
        'reg_alpha':        0.1,    # L1 regularisation
        'reg_lambda':       1.0,    # L2 regularisation
        'seed':             42,
    }
    model = xgb.train(
        params,
        dtrain,
        num_boost_round=1000,
        evals=[(dval, 'val')],
        early_stopping_rounds=50,
        verbose_eval=False,
    )
    preds = model.predict(dval)
    mae   = mean_absolute_error(y[val_idx], preds)
    maes.append(mae)
    print(f"Fold {fold+1}: best_iter={model.best_iteration}, MAE={mae:.3f}")

print(f"\\nMean CV MAE: {np.mean(maes):.3f} ± {np.std(maes):.3f}")
`;

const sklearnAPICode = `# sklearn-compatible XGBoost API
import xgboost as xgb
from sklearn.pipeline import Pipeline
from sklearn.model_selection import TimeSeriesSplit, RandomizedSearchCV
import numpy as np

# XGBRegressor wraps XGBoost in sklearn interface
model = xgb.XGBRegressor(
    n_estimators=1000,
    learning_rate=0.05,
    max_depth=6,
    min_child_weight=5,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=1.0,
    early_stopping_rounds=50,   # works with eval_set in .fit()
    random_state=42,
    n_jobs=-1,
    tree_method='hist',         # faster training, similar to LightGBM histogram
)

# Fit with eval set for early stopping
tscv   = TimeSeriesSplit(n_splits=5, test_size=28)
folds  = list(tscv.split(X))
tr_idx, va_idx = folds[-1]

model.fit(
    X[tr_idx], y[tr_idx],
    eval_set=[(X[va_idx], y[va_idx])],
    verbose=False,
)
print(f"Best n_estimators: {model.best_iteration}")

# ── Hyperparameter search ─────────────────────────────────────────────────────
param_dist = {
    'max_depth':        [4, 6, 8, 10],
    'learning_rate':    [0.01, 0.03, 0.05, 0.1],
    'min_child_weight': [1, 3, 5, 10],
    'subsample':        [0.6, 0.8, 1.0],
    'colsample_bytree': [0.6, 0.8, 1.0],
    'reg_alpha':        [0, 0.1, 0.5, 1.0],
    'reg_lambda':       [0.5, 1.0, 2.0],
    'gamma':            [0, 0.1, 0.5],       # min loss reduction to split
}
search = RandomizedSearchCV(
    xgb.XGBRegressor(n_estimators=300, tree_method='hist', random_state=42),
    param_distributions=param_dist,
    n_iter=30,
    cv=TimeSeriesSplit(n_splits=5, test_size=28),
    scoring='neg_mean_absolute_error',
    n_jobs=-1,
    random_state=42,
)
# search.fit(X, y)
print("Hyperparameter search configured.")
`;

const shapXGBCode = `import xgboost as xgb
import shap
import pandas as pd
import numpy as np

# Train final model
dtrain = xgb.DMatrix(X, label=y, feature_names=features)
params = {'objective': 'reg:squarederror', 'learning_rate': 0.05,
          'max_depth': 6, 'seed': 42, 'verbosity': 0}
model  = xgb.train(params, dtrain, num_boost_round=300)

# ── SHAP analysis ─────────────────────────────────────────────────────────────
explainer  = shap.TreeExplainer(model)
shap_vals  = explainer.shap_values(X)       # shape (n_samples, n_features)

# Global importance: mean |SHAP|
global_imp = pd.Series(
    np.abs(shap_vals).mean(axis=0), index=features
).sort_values(ascending=False)

print("Global SHAP importance (top 10):")
print(global_imp.head(10))

# SHAP summary plot (requires matplotlib)
# shap.summary_plot(shap_vals, features=X, feature_names=features)

# SHAP dependence: how lag_7 interacts with dow_sin
# shap.dependence_plot('lag_7', shap_vals, X, feature_names=features,
#                      interaction_index='dow_sin')
`;

const customObjectiveCode = `import xgboost as xgb
import numpy as np

# Custom MAPE-like objective for XGBoost
# XGBoost requires (gradient, hessian) of the loss w.r.t. predictions

def mape_objective(y_pred: np.ndarray, dtrain: xgb.DMatrix):
    """Approximate MAPE gradient/hessian (for positive targets)."""
    y_true  = dtrain.get_label()
    eps     = 1.0                      # smoothing to avoid div-by-zero
    grad    = np.sign(y_pred - y_true) / (np.abs(y_true) + eps)
    hess    = np.ones_like(grad) / (np.abs(y_true) + eps)
    return grad, hess

def mape_eval(y_pred, dtrain):
    """Custom MAPE evaluation metric."""
    y_true = dtrain.get_label()
    mape   = np.mean(np.abs((y_true - y_pred) / (np.abs(y_true) + 1e-8))) * 100
    return 'mape', mape

# Usage: pass to xgb.train
# model = xgb.train(
#     {'seed': 42},
#     dtrain,
#     num_boost_round=500,
#     obj=mape_objective,
#     feval=mape_eval,
#     evals=[(dval, 'val')],
#     early_stopping_rounds=50,
#     verbose_eval=10,
# )
print("Custom MAPE objective defined.")
`;

const references = [
  { title: 'XGBoost: A Scalable Tree Boosting System', author: 'Chen, T. & Guestrin, C.', year: 2016, url: 'https://arxiv.org/abs/1603.02754' },
  { title: 'XGBoost Python documentation', author: 'XGBoost contributors', year: 2024, url: 'https://xgboost.readthedocs.io/' },
  { title: 'A Unified Approach to Interpreting Model Predictions (SHAP)', author: 'Lundberg, S. & Lee, S.-I.', year: 2017, url: 'https://arxiv.org/abs/1705.07874' },
  { title: 'M5 Accuracy Competition — Winning solutions (XGBoost/LGB dominant)', author: 'Makridakis et al.', year: 2022, url: 'https://doi.org/10.1016/j.ijforecast.2021.11.013' },
];

export default function XGBoostForecasting() {
  return (
    <SectionLayout title="XGBoost for Time Series" difficulty="intermediate" readingTime={13}>
      <p className="text-zinc-300 leading-relaxed">
        XGBoost (eXtreme Gradient Boosting) became the dominant algorithm in
        tabular ML competitions after its 2016 release. In time series forecasting,
        it consistently outperforms random forests by 5–20% on standard benchmarks and
        was a cornerstone of winning solutions in the M5 competition. This section
        covers the gradient boosting framework, XGBoost-specific architecture, and
        practical patterns for time series use.
      </p>

      <DefinitionBlock term="Gradient Boosting">
        An ensemble method that builds trees sequentially, each new tree fitting the
        negative gradient (pseudo-residuals) of the loss function:
        <BlockMath math={String.raw`F_m(\mathbf{x}) = F_{m-1}(\mathbf{x}) + \eta \cdot T_m(\mathbf{x})`} />
        where <InlineMath math="\eta" /> is the learning rate (shrinkage) and{' '}
        <InlineMath math="T_m" /> is the <InlineMath math="m" />-th tree fit to the
        current residuals. The regularised objective minimised by XGBoost is:
        <BlockMath math={String.raw`\mathcal{L} = \sum_{i} \ell(y_i, \hat{y}_i) + \sum_{m}\left[\gamma T + \tfrac{1}{2}\lambda \|\mathbf{w}\|^2 + \alpha \|\mathbf{w}\|_1\right]`} />
        where <InlineMath math="T" /> is the number of leaves and{' '}
        <InlineMath math="\mathbf{w}" /> are leaf weights.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">XGBoost Architecture Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        {[
          { title: 'Regularised objective', desc: 'L1 + L2 penalties on leaf weights prevent overfitting, especially on small datasets' },
          { title: 'Weighted quantile sketch', desc: 'Efficient approximate split finding for large datasets' },
          { title: 'Column subsampling', desc: 'colsample_bytree and colsample_bylevel reduce feature correlation, speed up training' },
          { title: 'Sparsity-aware splits', desc: 'Handles missing values natively — missing values are routed to the default direction' },
          { title: 'hist tree method', desc: 'Histogram-based training (same idea as LightGBM) — much faster on large datasets' },
          { title: 'GPU support', desc: 'tree_method="gpu_hist" for multi-GPU training, critical for large feature matrices' },
        ].map(i => (
          <div key={i.title} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
            <p className="text-sky-400 text-sm font-semibold">{i.title}</p>
            <p className="text-zinc-400 text-xs mt-1">{i.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Full Training Pipeline</h2>
      <p className="text-zinc-300 leading-relaxed">
        The recommended workflow: build features, use <code>xgb.DMatrix</code> for
        efficient data storage, and enable early stopping on a time-series validation fold.
      </p>

      <PythonCode code={basicXGBCode} title="XGBoost Forecasting with Early Stopping and TimeSeriesSplit" />

      <WarningBlock title="Early Stopping with Time Series CV">
        XGBoost's early stopping monitors the last evaluation set. When using
        <code>TimeSeriesSplit</code>, always use the <em>most recent</em> fold as the
        evaluation set (not a random split), so early stopping reflects performance on
        data the model has never seen in temporal order.
      </WarningBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Sklearn API and Hyperparameter Search</h2>
      <p className="text-zinc-300 leading-relaxed">
        <code>XGBRegressor</code> provides a sklearn-compatible interface for integration
        into pipelines and <code>RandomizedSearchCV</code>.
      </p>

      <PythonCode code={sklearnAPICode} title="XGBRegressor + RandomizedSearchCV" />

      <div className="overflow-x-auto my-4">
        <table className="text-sm text-zinc-300 border-collapse w-full">
          <thead><tr className="bg-zinc-800">
            {['Parameter', 'Default', 'Role', 'Typical range'].map(h => (
              <th key={h} className="border border-zinc-700 px-3 py-2 text-left text-xs">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              ['learning_rate', '0.3', 'shrinkage per tree', '0.01–0.1'],
              ['max_depth', '6', 'tree depth cap', '4–10'],
              ['min_child_weight', '1', 'min hessian in leaf', '1–20'],
              ['subsample', '1.0', 'row sub-sampling', '0.6–1.0'],
              ['colsample_bytree', '1.0', 'column sub-sampling', '0.6–1.0'],
              ['reg_alpha', '0', 'L1 regularisation', '0–1.0'],
              ['reg_lambda', '1', 'L2 regularisation', '0.5–5.0'],
              ['gamma', '0', 'min gain to split', '0–0.5'],
            ].map(r => (
              <tr key={r[0]} className="hover:bg-zinc-800">
                {r.map((v, i) => <td key={i} className="border border-zinc-700 px-3 py-1 font-mono text-xs">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoteBlock title="Learning Rate and n_estimators Trade-off">
        Lower learning rates require more trees but generalize better. A common practice
        is to set <code>learning_rate=0.05</code> with <code>n_estimators=1000</code>
        and use early stopping to find the optimal number of rounds. Avoid high learning
        rates (&gt;0.2) with many rounds — they tend to overfit.
      </NoteBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">SHAP Analysis</h2>
      <p className="text-zinc-300 leading-relaxed">
        SHAP analysis on XGBoost models produces consistent, theoretically grounded
        feature attributions. The <code>TreeExplainer</code> runs in <InlineMath math="O(TLD)" />{' '}
        time (T trees, L leaves, D features), making it practical even for large ensembles.
      </p>

      <PythonCode code={shapXGBCode} title="SHAP Feature Importance and Interaction Analysis" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Custom Loss Functions</h2>
      <p className="text-zinc-300 leading-relaxed">
        XGBoost accepts custom objectives via a Python function returning the gradient
        and hessian of the loss. This enables training directly on business metrics like
        MAPE, asymmetric MAE, or pinball loss for quantile forecasting.
      </p>

      <PythonCode code={customObjectiveCode} title="Custom MAPE Objective for XGBoost" />

      <TheoremBlock title="XGBoost in M5 Competition">
        In the M5 forecasting competition (30,490 retail series, 28-day horizon),
        XGBoost and LightGBM-based solutions dominated the top positions. Key patterns
        used by winners: (1) global models across all series, (2) recursive feature
        engineering with lags [7, 14, 28], (3) TWEEDIE loss for sparse intermittent
        demand, (4) ensembling XGBoost with LightGBM and feed-forward networks.
      </TheoremBlock>

      <ExampleBlock title="Retail Demand Forecasting — XGBoost Configuration">
        <p className="text-zinc-300 text-sm">
          Typical XGBoost configuration for a daily retail demand forecasting model:
        </p>
        <ul className="list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2">
          <li>objective: <code>reg:tweedie</code> (handles zero-inflated demand)</li>
          <li>learning_rate: 0.05, n_estimators: 1000 with early stopping at 50</li>
          <li>max_depth: 6, min_child_weight: 10 (robust to demand sparsity)</li>
          <li>colsample_bytree: 0.8, subsample: 0.8</li>
          <li>Features: lags [1,7,14,28], rolling [7,28], calendar, store/product encoding</li>
          <li>CV: TimeSeriesSplit with 5 folds, test_size=28 (matches horizon)</li>
        </ul>
      </ExampleBlock>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
