import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const featureImportanceData = [
  { feature: 'lag_1', importance: 0.28 },
  { feature: 'lag_7', importance: 0.19 },
  { feature: 'rolling_mean_7', importance: 0.15 },
  { feature: 'lag_28', importance: 0.12 },
  { feature: 'rolling_mean_28', importance: 0.10 },
  { feature: 'day_of_week', importance: 0.08 },
  { feature: 'week_of_year', importance: 0.05 },
  { feature: 'is_holiday', importance: 0.03 },
];

const forecastData = [
  { t: 'W1', actual: 245, lgbm: 240 },
  { t: 'W2', actual: 267, lgbm: 260 },
  { t: 'W3', actual: 231, lgbm: 238 },
  { t: 'W4', actual: 289, lgbm: 280 },
  { t: 'W5', actual: 312, lgbm: 305 },
  { t: 'W6', actual: null, lgbm: 318 },
  { t: 'W7', actual: null, lgbm: 325 },
  { t: 'W8', actual: null, lgbm: 330 },
];

const cvData = [
  { window: 'Win 1', mae: 14.2, smape: 0.052 },
  { window: 'Win 2', mae: 16.8, smape: 0.061 },
  { window: 'Win 3', mae: 12.9, smape: 0.047 },
  { window: 'Win 4', mae: 18.1, smape: 0.066 },
];

export default function MLForecastIntro() {
  const [activeTab, setActiveTab] = useState('architecture');

  return (
    <SectionLayout
      title="mlforecast Quickstart"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['Gradient Boosting', 'Feature Engineering', 'statsforecast Basics']}
    >
      <p>
        Nixtla's <strong>mlforecast</strong> library applies global machine learning models to
        multiple time series simultaneously. Instead of fitting one model per series (local
        models), mlforecast trains a single model on all series together, capturing cross-series
        patterns while using lag features and rolling statistics as inputs.
      </p>

      <h2>Global vs. Local Models</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Local Models (statsforecast)</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
            <li>One ARIMA/ETS per series</li>
            <li>Captures series-specific patterns</li>
            <li>Works well with few series</li>
            <li>Cannot share information across series</li>
            <li>Cold-start: must wait for history</li>
          </ul>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Global Models (mlforecast)</h3>
          <ul className="text-sm text-green-700 space-y-1 list-disc pl-4">
            <li>One LightGBM/XGBoost for all series</li>
            <li>Shares patterns across thousands of series</li>
            <li>Scales to millions of series</li>
            <li>Leverages cross-series information</li>
            <li>Cold-start: use series features/attributes</li>
          </ul>
        </div>
      </div>

      <DefinitionBlock title="mlforecast Architecture">
        mlforecast operates as a <strong>feature engineering + tabular ML</strong> pipeline.
        For each series at each timestep, it creates a row of features: lag values, rolling
        statistics, date features, and static covariates. It then trains any scikit-learn
        compatible model on this tabular dataset. Prediction is iterative: to forecast h steps
        ahead, the model recursively predicts one step at a time, using previous predictions
        as new lag inputs.
      </DefinitionBlock>

      <h2>Installation</h2>
      <PythonCode code={`pip install mlforecast lightgbm`} />

      <h2>Core API: MLForecast Class</h2>
      <p>The <code>MLForecast</code> constructor takes:</p>
      <ul className="list-disc pl-6 my-3 space-y-1">
        <li><code>models</code>: list of sklearn-compatible estimators</li>
        <li><code>freq</code>: pandas frequency string</li>
        <li><code>lags</code>: list of lag periods (e.g., <code>[1, 7, 28]</code>)</li>
        <li><code>lag_transforms</code>: dict mapping lag to transform functions</li>
        <li><code>date_features</code>: list of date component names</li>
        <li><code>num_threads</code>: parallelism for feature computation</li>
      </ul>

      <h2>Complete Pipeline: Retail Demand Forecasting</h2>

      <PythonCode code={`import pandas as pd
import numpy as np
from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
from window_ops.rolling import rolling_mean, rolling_std
import lightgbm as lgb

# ── 1. Long-format data (same convention as statsforecast) ─────────────────
np.random.seed(0)
n_periods = 365  # daily data, ~1 year
n_series = 100   # 100 SKUs

records = []
for i in range(n_series):
    uid = f'SKU_{i:04d}'
    dates = pd.date_range('2023-01-01', periods=n_periods, freq='D')
    base = np.random.uniform(50, 500)
    trend = np.linspace(0, base * 0.2, n_periods)
    day_of_week_effect = np.array([1.0, 0.9, 0.95, 1.0, 1.1, 1.3, 1.2])
    seasonal = np.array([day_of_week_effect[d.weekday()] for d in dates]) * base * 0.15
    noise = np.random.normal(0, base * 0.05, n_periods)
    sales = np.maximum(0, base + trend + seasonal + noise).round(0)
    for date, value in zip(dates, sales):
        records.append({'unique_id': uid, 'ds': date, 'y': value})

df = pd.DataFrame(records)
print(f"Rows: {len(df):,}, Series: {df['unique_id'].nunique()}")`} />

      <PythonCode code={`# ── 2. Define LightGBM model ───────────────────────────────────────────────
lgbm_params = {
    'n_estimators': 500,
    'learning_rate': 0.05,
    'num_leaves': 63,
    'min_child_samples': 20,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'random_state': 42,
    'verbosity': -1,
}

# ── 3. Instantiate MLForecast ──────────────────────────────────────────────
mlf = MLForecast(
    models=[lgb.LGBMRegressor(**lgbm_params)],
    freq='D',
    lags=[1, 2, 3, 7, 14, 28],           # lag features
    lag_transforms={
        1: [(rolling_mean, 7), (rolling_std, 7)],   # 7-day rolling mean/std of lag-1
        7: [(rolling_mean, 28)],                     # 28-day rolling mean of lag-7
    },
    date_features=['dayofweek', 'week', 'month', 'year'],
    num_threads=4,
)

print("Features will include:")
print("  Lags:", [1, 2, 3, 7, 14, 28])
print("  Rolling: 7d mean, 7d std, 28d mean")
print("  Calendar: dayofweek, week, month, year")`} />

      <PythonCode code={`# ── 4. Fit and forecast ───────────────────────────────────────────────────
horizon = 14  # 14 days ahead

mlf.fit(df)
forecasts = mlf.predict(h=horizon)

print(forecasts.head(10))
#    unique_id         ds  LGBMRegressor
# 0  SKU_0000  2024-01-01        187.0
# 1  SKU_0000  2024-01-02        192.0
# ...

# ── 5. Add static features (SKU attributes) ───────────────────────────────
# Create SKU-level attributes to improve cold-start and cross-series learning
sku_features = pd.DataFrame({
    'unique_id': [f'SKU_{i:04d}' for i in range(n_series)],
    'category': np.random.choice(['Electronics', 'Apparel', 'Food'], n_series),
    'price_tier': np.random.choice(['budget', 'mid', 'premium'], n_series),
    'weight_kg': np.random.uniform(0.1, 10.0, n_series).round(2),
})

mlf_with_features = MLForecast(
    models=[lgb.LGBMRegressor(**lgbm_params)],
    freq='D',
    lags=[1, 7, 28],
    lag_transforms={1: [(rolling_mean, 7)]},
    date_features=['dayofweek', 'month'],
)
mlf_with_features.fit(df, static_features=['category', 'price_tier', 'weight_kg'],
                      id_col='unique_id', time_col='ds', target_col='y',
                      X_df=sku_features)`} />

      <PythonCode code={`# ── 6. Cross-validation / backtesting ────────────────────────────────────
cv_df = mlf.cross_validation(
    df=df,
    h=horizon,
    n_windows=4,      # 4 backtesting windows
    step_size=7,      # move cutoff forward 7 days each window
    refit=False,      # don't refit model at each window (faster)
)
print(cv_df.head())
#    unique_id         ds    cutoff   y  LGBMRegressor

# Compute MAE per window
cv_df['ae'] = (cv_df['y'] - cv_df['LGBMRegressor']).abs()
print(cv_df.groupby('cutoff')['ae'].mean().round(2))`} />

      <PythonCode code={`# ── 7. Feature importance ─────────────────────────────────────────────────
import matplotlib.pyplot as plt

model = mlf.models_['LGBMRegressor']
feature_names = mlf.ts.features_order_
importance = pd.Series(
    model.feature_importances_, index=feature_names
).sort_values(ascending=False)

print("Top 10 features:")
print(importance.head(10))

# lag_1              0.28
# lag_7              0.19
# rolling_mean_7     0.15
# lag_28             0.12
# rolling_mean_28    0.10
# dayofweek          0.08
# week               0.05
# is_holiday         0.03`} />

      <h2>Feature Importance</h2>
      <div className="my-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={featureImportanceData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
            <YAxis type="category" dataKey="feature" width={120} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
            <Bar dataKey="importance" fill="#6366f1" name="Importance" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-center text-gray-500 mt-1">
          LightGBM feature importance (gain) from a typical retail demand model.
          Short-lag features dominate; day-of-week captures weekly patterns.
        </p>
      </div>

      <h2>Forecast Sample</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={forecastData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" />
          <YAxis domain={[200, 360]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="#374151" strokeWidth={2} dot={{ r: 4 }} name="Actual" connectNulls={false} />
          <Line type="monotone" dataKey="lgbm" stroke="#6366f1" strokeWidth={2} strokeDasharray="6 3" dot={false} name="LightGBM Forecast" />
        </LineChart>
      </ResponsiveContainer>

      <h2>Recursive vs. Direct Forecasting</h2>
      <p>
        mlforecast uses <strong>recursive (MIMO) forecasting</strong> by default: the model
        predicts one step ahead, then uses that prediction as a lag feature to predict the
        next step. The error accumulates over the horizon.
      </p>
      <BlockMath math="\hat{y}_{t+h} = f\left(\hat{y}_{t+h-1}, \hat{y}_{t+h-2}, \ldots, y_t, \mathbf{x}_t\right)" />
      <p>
        For short horizons (h &le; 7), recursive forecasting is usually fine. For longer
        horizons, consider using <strong>direct forecasting</strong> where a separate model
        is trained for each step h:
      </p>

      <PythonCode code={`# Direct multi-step forecasting: train separate model per horizon step
from mlforecast.target_transforms import LocalStandardScaler

# One model per horizon step avoids error accumulation
mlf_direct = MLForecast(
    models={f'h{h}': lgb.LGBMRegressor(**lgbm_params) for h in range(1, horizon + 1)},
    freq='D',
    lags=[1, 7, 28],
    date_features=['dayofweek', 'month'],
)
# Note: direct forecasting in mlforecast requires custom training loop;
# use mlforecast's built-in 'direct' strategy when available in newer versions`} />

      <TheoremBlock title="Global Models and the i.i.d. Assumption">
        Training a global model across series implicitly assumes the relationship between
        lag features and future values is the same (or similar) across series. This holds
        well when series share the same data-generating process (same product category, same
        market). When series are fundamentally different (e.g., mixing daily temperature and
        monthly sales), separate models or series-type embeddings are preferable.
      </TheoremBlock>

      <NoteBlock>
        mlforecast's <code>target_transforms</code> parameter supports automatic log
        transforms, differencing, and scaling. Use <code>LocalStandardScaler()</code> to
        normalize each series to zero mean and unit variance before training — this helps
        gradient boosting learn a common shape across series with very different magnitudes.
      </NoteBlock>

      <WarningBlock>
        The recursive prediction strategy means forecast errors compound over long horizons.
        Monitor SMAPE at each horizon step during cross-validation; if accuracy degrades
        sharply beyond h=7, consider adding longer-lag features or using direct forecasting.
      </WarningBlock>

      <ReferenceList references={[
        {
          authors: 'Olivares, K.G., Garza, A. et al.',
          year: 2023,
          title: 'mlforecast: Scalable machine learning for time series forecasting',
          journal: 'Nixtla Technical Report',
        },
        {
          authors: 'Montero-Manso, P., Hyndman, R.J.',
          year: 2021,
          title: 'Principles and algorithms for forecasting groups of time series: Locality and globality',
          journal: 'International Journal of Forecasting',
          volume: '37(4)',
          pages: '1632–1653',
        },
        {
          authors: 'Ke, G., Meng, Q. et al.',
          year: 2017,
          title: 'LightGBM: A highly efficient gradient boosting decision tree',
          journal: 'NeurIPS 2017',
        },
      ]} />
    </SectionLayout>
  );
}
