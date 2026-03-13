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

const tabularizationCode = `import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# ── 1. Generate synthetic daily series ────────────────────────────────────────
np.random.seed(42)
n = 700
dates = pd.date_range('2021-01-01', periods=n, freq='D')
trend    = np.linspace(0, 20, n)
seasonal = 10 * np.sin(2 * np.pi * np.arange(n) / 365.25)
noise    = np.random.randn(n) * 3
y_raw    = 100 + trend + seasonal + noise

df = pd.DataFrame({'ds': dates, 'y': y_raw})

# ── 2. Tabularize: lags + rolling + calendar ──────────────────────────────────
for lag in [1, 2, 3, 7, 14, 28]:
    df[f'lag_{lag}'] = df['y'].shift(lag)
for w in [7, 14, 28]:
    s = df['y'].shift(1)
    df[f'rmean_{w}'] = s.rolling(w).mean()
    df[f'rstd_{w}']  = s.rolling(w).std()
df['dow']   = df['ds'].dt.dayofweek
df['month'] = df['ds'].dt.month
df['dow_sin'] = np.sin(2 * np.pi * df['dow'] / 7)
df['dow_cos'] = np.cos(2 * np.pi * df['dow'] / 7)
df = df.dropna()

features = [c for c in df.columns if c not in ['ds', 'y']]
X, y = df[features].values, df['y'].values

# ── 3. Time-series cross-validation ──────────────────────────────────────────
tscv = TimeSeriesSplit(n_splits=5, test_size=28)
maes = []
for train_idx, val_idx in tscv.split(X):
    rf = RandomForestRegressor(
        n_estimators=300,
        max_features='sqrt',    # m = sqrt(p) features per split
        min_samples_leaf=5,
        random_state=42,
        n_jobs=-1,
    )
    rf.fit(X[train_idx], y[train_idx])
    preds = rf.predict(X[val_idx])
    maes.append(mean_absolute_error(y[val_idx], preds))
    print(f"  Fold MAE: {maes[-1]:.3f}")

print(f"Mean CV MAE: {np.mean(maes):.3f} ± {np.std(maes):.3f}")
`;

const oobCode = `from sklearn.ensemble import RandomForestRegressor
import numpy as np
import pandas as pd

# OOB (out-of-bag) estimation uses the ~37% of bootstrap samples
# not seen by each tree to estimate generalisation error for FREE —
# no separate validation set needed.

np.random.seed(42)
X_train = np.random.randn(500, 10)
y_train = X_train[:, 0] * 3 + np.random.randn(500)

rf = RandomForestRegressor(
    n_estimators=500,
    oob_score=True,       # enable OOB scoring
    random_state=42,
    n_jobs=-1,
)
rf.fit(X_train, y_train)

print(f"OOB R²: {rf.oob_score_:.4f}")
# rf.oob_prediction_ gives per-sample OOB predictions
residuals = y_train - rf.oob_prediction_
print(f"OOB MAE: {np.abs(residuals).mean():.4f}")

# Note: OOB score is a biased estimate for time series because
# bootstrap samples violate temporal ordering. Prefer TimeSeriesSplit
# for proper backtesting, but OOB is useful for quick hyperparameter tuning.
`;

const hyperparamCode = `from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import TimeSeriesSplit, RandomizedSearchCV
import numpy as np

# Parameter grid for Random Forest forecasting
param_dist = {
    'n_estimators':    [100, 200, 500, 1000],
    'max_depth':       [None, 10, 20, 30],     # None = grow until leaves pure
    'max_features':    ['sqrt', 'log2', 0.3, 0.5],
    'min_samples_leaf':[1, 2, 5, 10],          # larger = more regularisation
    'max_samples':     [0.5, 0.7, 0.9, None],  # row sub-sampling per tree
    'bootstrap':       [True],                 # always True for OOB to work
}

rf = RandomForestRegressor(random_state=42, n_jobs=-1)
search = RandomizedSearchCV(
    rf,
    param_distributions=param_dist,
    n_iter=30,
    cv=TimeSeriesSplit(n_splits=5, test_size=28),
    scoring='neg_mean_absolute_error',
    random_state=42,
    n_jobs=-1,
    verbose=1,
)
# search.fit(X, y)  # fit with your feature matrix
# print("Best params:", search.best_params_)
# print("Best CV MAE:", -search.best_score_)

# Key hyperparameters for time series:
# n_estimators: more trees = lower variance, diminishing returns past ~500
# max_depth:    None often works; limit to prevent overfitting on small datasets
# min_samples_leaf: primary regularisation knob; increase for noisy series
# max_features: 'sqrt' is a strong default; tune for high-dimensional feature sets
print("Hyperparameter search configured. Call search.fit(X, y) to run.")
`;

const featureImportanceCode = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor

# Fit RF on the full training set
rf = RandomForestRegressor(n_estimators=500, min_samples_leaf=5,
                           random_state=42, n_jobs=-1)
rf.fit(X, y)

# MDI (mean decrease in impurity) importance — built-in to sklearn
mdi_importance = pd.Series(rf.feature_importances_, index=features)
mdi_importance = mdi_importance.sort_values(ascending=False)

print("Top 10 features (MDI):")
print(mdi_importance.head(10))

# MDI tends to favour high-cardinality features and can be biased;
# combine with permutation importance for a robust view.
from sklearn.inspection import permutation_importance

perm = permutation_importance(
    rf, X, y, n_repeats=15, scoring='neg_mean_absolute_error', random_state=42
)
perm_imp = pd.Series(perm.importances_mean, index=features).sort_values(ascending=False)
print("\\nTop 10 features (Permutation):")
print(perm_imp.head(10))
`;

const multistepCode = `import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# Recursive multi-step forecasting with a single Random Forest model
# At each step, predict one period ahead and feed back into features.

def recursive_forecast(model, last_known: np.ndarray, lags: list,
                        calendar_fn, horizon: int) -> np.ndarray:
    """
    last_known: array of the most recent max(lags) values
    lags: list of lag offsets (e.g. [1, 7, 14])
    calendar_fn: function(step) -> dict of calendar features for step t+step
    """
    history = list(last_known)
    preds = []
    for h in range(horizon):
        lag_feats = [history[-(lag)] for lag in lags]
        cal_feats = list(calendar_fn(h).values())
        x = np.array(lag_feats + cal_feats).reshape(1, -1)
        pred = model.predict(x)[0]
        preds.append(pred)
        history.append(pred)   # feed prediction back as "known" history
    return np.array(preds)

# Note: error accumulates with horizon in recursive forecasting.
# For long horizons (>14 steps), consider direct multi-output models
# or ensemble of direct models at each horizon.
print("Recursive forecast helper defined.")
`;

const references = [
  { title: 'Random Forests', author: 'Breiman, L.', year: 2001, url: 'https://link.springer.com/article/10.1023/A:1010933404324' },
  { title: 'Forecasting: Principles and Practice (3rd ed.) — ML', author: 'Hyndman & Athanasopoulos', year: 2021, url: 'https://otexts.com/fpp3/nnetar.html' },
  { title: 'A review of feature selection methods for machine learning-based disease risk prediction', author: 'Liu et al.', year: 2021, url: 'https://doi.org/10.3389/fgene.2020.617277' },
  { title: 'scikit-learn RandomForestRegressor', author: 'Pedregosa et al.', year: 2011, url: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html' },
];

export default function RandomForestTS() {
  return (
    <SectionLayout title="Random Forests for Forecasting" difficulty="intermediate" readingTime={12}>
      <p className="text-zinc-300 leading-relaxed">
        Random forests bring ensemble averaging and built-in feature importance to
        time series forecasting. By converting the forecasting problem into a tabular
        supervised regression, any ML model — including random forests — can be applied.
        The result is a robust, largely hyperparameter-insensitive baseline that often
        outperforms classical statistical methods on complex, multi-seasonal data.
      </p>

      <DefinitionBlock term="Random Forest">
        An ensemble of <InlineMath math="B" /> decision trees, each trained on a
        bootstrap sample of the data with a random subset of{' '}
        <InlineMath math="m = \lfloor\sqrt{p}\rfloor" /> features considered at each
        split. Predictions are averaged:
        <BlockMath math={String.raw`\hat{y} = \frac{1}{B}\sum_{b=1}^{B} T_b(\mathbf{x})`} />
        The double randomisation (bootstrap + feature subsampling) de-correlates the
        trees, reducing ensemble variance without increasing bias.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Time Series as a Tabular Problem</h2>
      <p className="text-zinc-300 leading-relaxed">
        The key transformation is <em>tabularisation</em>: the time series is converted
        into a feature matrix where each row represents one time step with lagged values,
        rolling statistics, and calendar features as columns. The model then solves a
        standard supervised regression problem.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
        {[
          { step: '1. Engineer features', desc: 'lags, rolling stats, calendar, exogenous variables' },
          { step: '2. Create (X, y) pairs', desc: 'each row: features at time t, target = y_t' },
          { step: '3. Train RF', desc: 'on chronologically ordered training split' },
          { step: '4. Predict', desc: 'for future rows by populating features with known/predicted lags' },
          { step: '5. Evaluate', desc: 'using TimeSeriesSplit CV to respect temporal order' },
          { step: '6. Tune', desc: 'hyperparameters with RandomizedSearchCV + TimeSeriesSplit' },
        ].map(s => (
          <div key={s.step} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
            <p className="text-sky-400 text-sm font-semibold">{s.step}</p>
            <p className="text-zinc-400 text-xs mt-1">{s.desc}</p>
          </div>
        ))}
      </div>

      <PythonCode code={tabularizationCode} title="Random Forest Forecasting — Full Tabularisation Pipeline" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Out-of-Bag Error</h2>
      <p className="text-zinc-300 leading-relaxed">
        Each bootstrap sample leaves out approximately{' '}
        <InlineMath math="1/e \approx 36.8\%" /> of training rows. These
        out-of-bag (OOB) samples are used to estimate prediction error without a
        separate validation set — making OOB a convenient free diagnostic during
        hyperparameter tuning.
      </p>

      <PythonCode code={oobCode} title="Out-of-Bag Error Estimation" />

      <WarningBlock title="OOB Is Biased for Time Series">
        OOB estimation is valid for i.i.d. data. For time series, bootstrap samples
        are drawn from across the entire series, so OOB folds can contain future
        observations relative to training rows. Use <code>TimeSeriesSplit</code> for
        true backtesting; OOB is useful only as a cheap hyperparameter guide.
      </WarningBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Key Hyperparameters</h2>

      <div className="overflow-x-auto my-4">
        <table className="text-sm text-zinc-300 border-collapse w-full">
          <thead><tr className="bg-zinc-800">
            {['Parameter', 'Default', 'Effect', 'Tuning tip'].map(h => (
              <th key={h} className="border border-zinc-700 px-3 py-2 text-left">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              ['n_estimators', '100', 'more trees → lower variance', 'set 300–1000; plateau early'],
              ['max_features', 'sqrt(p)', 'fewer features → less correlation', "'sqrt' almost always best"],
              ['min_samples_leaf', '1', 'larger → stronger regularisation', '5–20 for noisy TS'],
              ['max_depth', 'None', 'shallower → lower variance', 'rarely needed if leaf size set'],
              ['max_samples', 'None', 'row sub-sampling per tree', '0.7–0.9 for large datasets'],
            ].map(r => (
              <tr key={r[0]} className="hover:bg-zinc-800">
                {r.map((v, i) => <td key={i} className="border border-zinc-700 px-3 py-2 font-mono text-xs">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PythonCode code={hyperparamCode} title="Hyperparameter Tuning with RandomizedSearchCV" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Feature Importance</h2>
      <p className="text-zinc-300 leading-relaxed">
        Random forests provide two importance measures. Mean Decrease in Impurity (MDI)
        counts the weighted impurity reduction from all splits on a feature. Permutation
        importance measures the MAE increase when a feature is shuffled. MDI is fast but
        biased toward high-cardinality features; permutation importance is model-agnostic
        and more reliable.
      </p>

      <PythonCode code={featureImportanceCode} title="MDI and Permutation Feature Importance" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Multi-Step Forecasting</h2>
      <p className="text-zinc-300 leading-relaxed">
        For forecasting beyond one step ahead, the two main approaches are:
      </p>
      <ul className="list-disc list-inside text-zinc-300 space-y-1 ml-2 mb-4">
        <li><strong>Recursive</strong>: feed predictions back as lag features at each step. Simple but errors accumulate.</li>
        <li><strong>Direct</strong>: train a separate model for each horizon <InlineMath math="h" />. More models, but no error propagation.</li>
      </ul>

      <PythonCode code={multistepCode} title="Recursive Multi-Step Forecasting Helper" />

      <TheoremBlock title="Advantages and Limitations for Time Series">
        <p className="mb-2 font-semibold text-emerald-400">Advantages</p>
        <ul className="list-disc list-inside space-y-1 text-sm mb-3">
          <li>Robust to outliers and non-stationarity via tree splits</li>
          <li>Natural feature importance diagnostics</li>
          <li>Minimal preprocessing: no scaling required</li>
          <li>Handles mixed-type features (lags + calendar + exogenous)</li>
          <li>OOB provides free error estimate for model selection</li>
        </ul>
        <p className="mb-2 font-semibold text-red-400">Limitations</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Extrapolation beyond training range is poor (trees predict training max)</li>
          <li>Slower than gradient boosting for large datasets</li>
          <li>No native support for temporal structure or auto-covariance</li>
          <li>Memory-intensive for large n_estimators</li>
        </ul>
      </TheoremBlock>

      <ExampleBlock title="Energy Demand Forecasting">
        <p className="text-zinc-300 text-sm">
          A RandomForestRegressor trained on 3 years of hourly electricity demand data
          with lags [1, 24, 48, 168], rolling means [24, 168], and calendar features
          (hour_sin/cos, day_of_week_sin/cos, is_holiday, temperature_lag_1) achieves:
        </p>
        <ul className="list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2">
          <li>MAPE ≈ 2.8% (vs. 4.5% for seasonal naïve)</li>
          <li>Top features: lag_24, lag_168, temperature_lag_1, hour_sin</li>
          <li>Best hyperparameters: n_estimators=500, min_samples_leaf=10</li>
          <li>Prediction intervals: quantile regression forests (sklearn QuantileRegressor)</li>
        </ul>
      </ExampleBlock>

      <NoteBlock title="When to Use Random Forest vs. Gradient Boosting">
        Random forests are preferable when training speed and robustness matter more
        than maximum accuracy. Gradient boosting (XGBoost, LightGBM) typically
        achieves 5–15% lower error on the same feature set but requires more careful
        hyperparameter tuning and is prone to overfitting on small datasets.
        Start with RF as a validated baseline, then upgrade to gradient boosting.
      </NoteBlock>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
