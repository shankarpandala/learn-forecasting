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

export const metadata = {
  title: 'MLForecast Feature Engineering',
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Master MLForecast advanced feature engineering: lag_transforms, rolling statistics, multiple models, target transformations, and exogenous variables.',
};

export default function MLForecastFeatures() {
  return (
    <SectionLayout title="MLForecast Feature Engineering" metadata={metadata}>
      <p>
        MLForecast's power comes from its flexible feature engineering pipeline. Beyond simple lags,
        it supports window-based transforms, exponential moving averages, custom functions, target
        transformations, and exogenous variables — all computed efficiently in parallel across
        thousands of series.
      </p>

      <h2>lag_transforms: Window-Based Features</h2>
      <p>
        The <code>lag_transforms</code> parameter applies functions to lagged values using a sliding
        window. The syntax is a dictionary mapping lag offsets to a list of (function, window_size) tuples.
        The <code>window_ops</code> library provides optimized rolling functions:
      </p>

      <DefinitionBlock title="lag_transforms Syntax">
        <code>lag_transforms = {'{'} lag: [(fn, window), ...], ... {'}'}</code>
        <br />
        For each (lag, fn, window) combination, MLForecast computes the function over the window
        of values ending at the lag position. For <code>lag=1, window=7</code>, the feature
        value at time <InlineMath math="t" /> is <InlineMath math="fn(y_{t-1}, y_{t-2}, \ldots, y_{t-7})" />.
      </DefinitionBlock>

      <h2>Rolling Statistics Available</h2>
      <p>
        The <code>window_ops</code> library (a dependency of MLForecast) provides Numba-optimized
        rolling functions:
      </p>
      <ul>
        <li><code>rolling_mean</code> — moving average</li>
        <li><code>rolling_std</code> — moving standard deviation (volatility)</li>
        <li><code>rolling_min</code>, <code>rolling_max</code> — range features</li>
        <li><code>rolling_quantile(q)</code> — moving quantile (e.g., 0.9 for ceiling)</li>
        <li><code>expanding_mean</code> — cumulative average (no window cutoff)</li>
        <li><code>ewm_mean(alpha)</code> — exponentially weighted moving average</li>
      </ul>

      <h2>Target Transformations</h2>
      <p>
        Target transforms pre-process the target variable before model fitting, improving numerical
        stability and enabling the model to learn in a transformed space:
      </p>
      <ul>
        <li><strong>LocalStandardScaler:</strong> Per-series standardization to zero mean, unit variance. Useful when series have very different scales.</li>
        <li><strong>Differences:</strong> First or seasonal differencing. Removes trend and seasonality, making the target stationary.</li>
        <li><strong>LocalBoxCox:</strong> Box-Cox transform with per-series lambda estimation. Stabilizes variance in count or skewed data.</li>
        <li><strong>LocalMinMaxScaler:</strong> Per-series min-max normalization to [0, 1].</li>
      </ul>

      <WarningBlock title="Target Transforms and Prediction">
        MLForecast automatically inverts target transformations when producing predictions, so output
        forecasts are always in the original scale. However, residuals and loss metrics during training
        operate in the transformed space. Use caution when comparing loss values across runs with
        different transforms.
      </WarningBlock>

      <h2>Exogenous Variables</h2>
      <p>
        MLForecast supports two types of exogenous variables:
      </p>
      <ul>
        <li>
          <strong>Past exogenous (known at training time):</strong> Variables observed alongside the
          target during training but whose future values are unknown. Pass via <code>X_df</code> in
          <code>fit()</code>; MLForecast automatically creates lagged versions.
        </li>
        <li>
          <strong>Future exogenous (known for forecast horizon):</strong> Variables known in advance
          (holidays, promotions, weather forecasts). Pass via <code>X_df</code> in <code>predict()</code>.
        </li>
      </ul>

      <h2>Multiple Models in One Pipeline</h2>
      <p>
        MLForecast can train multiple models simultaneously on the same feature set, with each model
        contributing a separate column in the output. This is more efficient than training models
        separately because feature engineering runs only once.
      </p>

      <ExampleBlock title="Feature Engineering Hierarchy">
        A well-designed MLForecast feature set typically includes:
        <ol>
          <li><strong>Short lags (1-3):</strong> Recent levels and changes</li>
          <li><strong>Seasonal lags (7, 30, 52/365):</strong> Same period last week/month/year</li>
          <li><strong>Rolling statistics (7, 28, 90 days):</strong> Trend and volatility context</li>
          <li><strong>Date features (weekday, month, year):</strong> Calendar effects</li>
          <li><strong>Static features (category, region):</strong> Series-level attributes</li>
          <li><strong>Future exogenous (promotions, holidays):</strong> Known future events</li>
        </ol>
      </ExampleBlock>

      <PythonCode code={`import numpy as np
import pandas as pd
from mlforecast import MLForecast
from mlforecast.target_transforms import (
    LocalStandardScaler, Differences, LocalBoxCox
)
from window_ops.rolling import rolling_mean, rolling_std, rolling_min, rolling_max
from window_ops.ewm import ewm_mean
import lightgbm as lgb
from sklearn.linear_model import Ridge

# ── Generate synthetic panel data with promotions ─────────────────────────────
np.random.seed(42)
N = 50
T = 365

records = []
promos = {}
for sid in range(N):
    t = np.arange(T)
    level = np.random.uniform(100, 1000)
    # Random promotion flags (10% of days)
    promo = np.random.binomial(1, 0.1, T)
    promo_effect = promo * level * np.random.uniform(0.1, 0.4)
    y = (level
         + 0.1 * t
         + level * 0.15 * np.sin(2 * np.pi * t / 7)  # weekly
         + promo_effect
         + np.random.randn(T) * level * 0.05)
    dates = pd.date_range('2023-01-01', periods=T, freq='D')
    uid = f'S{sid:03d}'
    promos[uid] = promo
    for d, v, p in zip(dates, y, promo):
        records.append({'unique_id': uid, 'ds': d, 'y': max(0, v), 'promo': p})

df = pd.DataFrame(records)

# ── Build MLForecast with rich features ──────────────────────────────────────
lgbm_params = {
    'n_estimators': 300, 'learning_rate': 0.05,
    'num_leaves': 63, 'min_child_samples': 20, 'verbose': -1
}

mlf = MLForecast(
    models={
        'lgbm': lgb.LGBMRegressor(**lgbm_params),
        'ridge': Ridge(alpha=100),
    },
    freq='D',
    lags=[1, 2, 3, 7, 14, 28, 365],  # short + seasonal lags
    lag_transforms={
        1: [
            (rolling_mean, 7),       # 7-day MA of lag-1
            (rolling_mean, 28),      # 28-day MA
            (rolling_std, 7),        # 7-day volatility
            (rolling_min, 7),        # 7-day min
            (rolling_max, 7),        # 7-day max
            (ewm_mean, 0.3),         # exponentially weighted MA (alpha=0.3)
        ],
        7: [
            (rolling_mean, 4),       # 4-week moving average of weekly lag
        ],
    },
    date_features=['dayofweek', 'month', 'quarter', 'is_month_start', 'is_month_end'],
    target_transforms=[LocalStandardScaler()],  # normalize each series
    num_threads=4,
)

# Separate past exogenous into future (promo) and historical
h = 14
df_train = df.groupby('unique_id').apply(lambda x: x.iloc[:-h]).reset_index(drop=True)
df_test  = df.groupby('unique_id').apply(lambda x: x.iloc[-h:]).reset_index(drop=True)

# Exogenous variables for training (past promotions)
X_train = df_train[['unique_id', 'ds', 'promo']]
# Future exogenous for forecasting (assume promotions are planned in advance)
X_test  = df_test[['unique_id', 'ds', 'promo']]

mlf.fit(df_train, X_df=X_train)
forecasts = mlf.predict(h=h, X_df=X_test)
print("Forecast columns:", forecasts.columns.tolist())
print(forecasts.head())

# ── Differences transform for non-stationary data ────────────────────────────
mlf_diff = MLForecast(
    models={'lgbm': lgb.LGBMRegressor(**lgbm_params)},
    freq='D',
    lags=[1, 7, 14, 28],
    lag_transforms={1: [(rolling_mean, 7), (rolling_std, 7)]},
    date_features=['dayofweek', 'month'],
    target_transforms=[Differences([1])],  # first difference
)
mlf_diff.fit(df_train)
fc_diff = mlf_diff.predict(h=h)

# ── Cross-validation with exogenous variables ─────────────────────────────────
mlf_cv = MLForecast(
    models={'lgbm': lgb.LGBMRegressor(**lgbm_params)},
    freq='D',
    lags=[1, 7, 28],
    lag_transforms={1: [(rolling_mean, 7)]},
    date_features=['dayofweek', 'month'],
)
cv_result = mlf_cv.cross_validation(
    df=df_train,
    h=7,
    n_windows=3,
    step_size=14,
    refit=True,
)

from sklearn.metrics import mean_absolute_error
mae_lgbm = mean_absolute_error(cv_result['y'], cv_result['lgbm'])
print(f"\\nCV MAE (LightGBM): {mae_lgbm:.2f}")

# ── Feature importance analysis ───────────────────────────────────────────────
fitted_lgbm = mlf_cv.models_['lgbm']
feature_names = mlf_cv.ts.features_order_
importance = pd.Series(
    fitted_lgbm.feature_importances_, index=feature_names
).sort_values(ascending=False)

print("\\nTop 10 features by importance:")
for feat, imp in importance.head(10).items():
    print(f"  {feat}: {imp:.0f}")

# ── BoxCox transform for count data ──────────────────────────────────────────
# For demand data with zeros and right skew
mlf_bc = MLForecast(
    models={'lgbm': lgb.LGBMRegressor(**lgbm_params)},
    freq='D',
    lags=[1, 7, 28],
    lag_transforms={1: [(rolling_mean, 7)]},
    target_transforms=[LocalBoxCox()],  # auto-estimate lambda per series
)
mlf_bc.fit(df_train)
fc_bc = mlf_bc.predict(h=h)  # predictions are automatically back-transformed
print("\\nBoxCox forecast sample:")
print(fc_bc.head())
`} />

      <NoteBlock title="window_ops vs pandas rolling">
        MLForecast uses <code>window_ops</code> rather than pandas rolling for feature computation.
        This is significantly faster (Numba JIT-compiled) and avoids the pandas overhead of aligning
        windows across groups. The functions operate on NumPy arrays, so custom functions must also
        accept NumPy arrays.
      </NoteBlock>

      <ReferenceList references={[
        {
          title: 'mlforecast: Scalable machine learning for time series forecasting',
          authors: 'Olivares, K.G., Garza, A. et al.',
          year: 2023,
          journal: 'Nixtla Technical Report',
        },
        {
          title: 'Recursive vs. Direct Forecasting',
          authors: 'Taieb, S.B. & Hyndman, R.J.',
          year: 2012,
          journal: 'International Journal of Forecasting',
        },
      ]} />
    </SectionLayout>
  );
}
