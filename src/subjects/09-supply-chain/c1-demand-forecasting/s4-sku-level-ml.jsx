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

const featureGroupData = [
  { group: 'Lag features', importance: 0.38 },
  { group: 'Rolling stats', importance: 0.24 },
  { group: 'Calendar', importance: 0.18 },
  { group: 'SKU attributes', importance: 0.12 },
  { group: 'Store attributes', importance: 0.08 },
];

const scalingData = [
  { skus: 100, local_min: 0.2, global_min: 1.2 },
  { skus: 1000, local_min: 2.1, global_min: 1.4 },
  { skus: 10000, local_min: 21, global_min: 1.8 },
  { skus: 100000, local_min: 210, global_min: 4.2 },
];

export default function SkuLevelML() {
  const [featureTab, setFeatureTab] = useState('lag');

  return (
    <SectionLayout
      title="ML for SKU-Level Demand Forecasting"
      difficulty="intermediate"
      readingTime={25}
      prerequisites={['LightGBM Basics', 'mlforecast Quickstart', 'Demand Patterns']}
    >
      <p>
        Retailers and manufacturers must forecast demand for thousands to millions of
        individual SKUs across multiple locations — simultaneously, at weekly or daily
        granularity. No statistical method per series can scale to this challenge.
        Global ML models, particularly gradient boosted trees, have become the dominant
        approach at scale.
      </p>

      <h2>The Scale Challenge</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-50">
              <th className="border border-gray-300 p-2">Scale</th>
              <th className="border border-gray-300 p-2">Example</th>
              <th className="border border-gray-300 p-2">Viable Approach</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['~100 SKUs', 'Small D2C brand', 'statsforecast (one model per SKU)'],
              ['~1,000 SKUs', 'Regional retailer', 'statsforecast or mlforecast (both viable)'],
              ['~10,000 SKUs', 'National retailer', 'mlforecast with LightGBM (global)'],
              ['~1M+ SKUs', 'Amazon, Walmart', 'Global LightGBM + custom infra'],
            ].map(([scale, ex, approach]) => (
              <tr key={scale} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">{scale}</td>
                <td className="border border-gray-300 p-2">{ex}</td>
                <td className="border border-gray-300 p-2 text-gray-600">{approach}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Global Model Architecture</h2>
      <DefinitionBlock title="Global ML Model for Time Series">
        A single model trained on the entire panel of (series, time) observations.
        Each row in the training dataset represents one (SKU, timestep) pair, with
        features derived from that series' history and the SKU's static attributes.
        The model learns a <em>universal forecasting function</em> that generalizes
        across series.
      </DefinitionBlock>

      <p>Training dataset structure:</p>
      <div className="bg-gray-900 text-green-400 rounded p-3 font-mono text-xs my-3 overflow-x-auto">
        <pre>{`| unique_id  | ds         | lag_1 | lag_7 | roll_7 | dow | category | y   |
|------------|------------|-------|-------|--------|-----|----------|-----|
| CA_1_001   | 2023-01-08 | 120   | 118   | 116.4  | 6   | grocery  | 125 |
| CA_1_001   | 2023-01-09 | 125   | 122   | 117.8  | 0   | grocery  | 108 |
| CA_1_002   | 2023-01-08 | 34    | 31    | 32.6   | 6   | beverage | 38  |
| TX_2_007   | 2023-01-08 | 0     | 2     | 1.4    | 6   | hardware | 0   |`}</pre>
      </div>

      <h2>Feature Engineering for SKU Forecasting</h2>
      <div className="flex gap-2 flex-wrap my-4">
        {[['lag', 'Lag Features'], ['calendar', 'Calendar'], ['sku', 'SKU Attrs'], ['store', 'Store Attrs']].map(([key, label]) => (
          <button key={key} onClick={() => setFeatureTab(key)}
            className={`px-3 py-1 rounded text-sm font-medium ${featureTab === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {featureTab === 'lag' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Lag Features</h3>
          <ul className="space-y-1 text-sm">
            <li><code>lag_1</code>: last period demand (strongest signal)</li>
            <li><code>lag_2, lag_3</code>: short-term momentum</li>
            <li><code>lag_7</code>: same day last week (weekly seasonality)</li>
            <li><code>lag_14, lag_28</code>: bi-weekly, monthly patterns</li>
            <li><code>lag_364</code>: same day last year (annual seasonality)</li>
            <li><code>rolling_mean_7</code>: 7-day moving average of lag-1</li>
            <li><code>rolling_std_7</code>: 7-day demand volatility</li>
            <li><code>rolling_mean_28</code>: 28-day trend baseline</li>
          </ul>
        </div>
      )}
      {featureTab === 'calendar' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Calendar Features</h3>
          <ul className="space-y-1 text-sm">
            <li><code>day_of_week</code>: 0–6, captures weekday pattern</li>
            <li><code>week_of_year</code>: 1–52, seasonal effects</li>
            <li><code>month</code>: 1–12</li>
            <li><code>is_holiday</code>: binary, US/local holidays</li>
            <li><code>days_to_holiday</code>: pre-holiday buying surge</li>
            <li><code>days_from_holiday</code>: post-holiday dip</li>
            <li>Fourier features: <code>sin(2π·dow/7)</code>, <code>cos(2π·dow/7)</code></li>
          </ul>
        </div>
      )}
      {featureTab === 'sku' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">SKU-Level Static Features</h3>
          <ul className="space-y-1 text-sm">
            <li><code>category</code>: product category (encoded)</li>
            <li><code>subcategory</code>: product subcategory</li>
            <li><code>price</code>: current unit price</li>
            <li><code>price_change</code>: price vs. 4-week average</li>
            <li><code>is_on_promo</code>: promotional flag</li>
            <li><code>weight_kg</code>: physical dimension</li>
            <li><code>days_since_launch</code>: product maturity</li>
            <li><code>abc_class</code>: A/B/C classification</li>
          </ul>
        </div>
      )}
      {featureTab === 'store' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Store/Location Static Features</h3>
          <ul className="space-y-1 text-sm">
            <li><code>store_type</code>: hypermarket, convenience, etc.</li>
            <li><code>region</code>: geographic region</li>
            <li><code>store_size_sqft</code>: physical size</li>
            <li><code>avg_basket_size</code>: store-level metric</li>
            <li><code>local_competition</code>: number of nearby competitors</li>
            <li><code>population_density</code>: catchment area</li>
          </ul>
        </div>
      )}

      <h2>Feature Importance by Category</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={featureGroupData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
          <YAxis type="category" dataKey="group" width={110} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
          <Bar dataKey="importance" fill="#6366f1" name="Importance (gain)" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Complete mlforecast Pipeline for 1000+ SKUs</h2>
      <PythonCode code={`import pandas as pd
import numpy as np
from mlforecast import MLForecast
from mlforecast.target_transforms import LocalStandardScaler
from window_ops.rolling import rolling_mean, rolling_std, rolling_max
import lightgbm as lgb

# ── 1. Generate 1,000 SKU x 2 years daily data ────────────────────────
np.random.seed(0)
n_skus = 1000
n_days = 730

stores = ['CA_1', 'CA_2', 'TX_1', 'TX_2', 'FL_1']
categories = ['Grocery', 'Beverages', 'Dairy', 'Bakery', 'Produce']

records = []
for i in range(n_skus):
    uid = f'STORE_{np.random.choice(stores)}_SKU_{i:04d}'
    cat = np.random.choice(categories)
    base = np.random.lognormal(3, 0.8)
    dates = pd.date_range('2022-01-01', periods=n_days, freq='D')
    dow_effect = np.array([0.9, 0.85, 0.9, 0.95, 1.0, 1.3, 1.1])
    seasonal = np.array([dow_effect[d.weekday()] for d in dates])
    trend = np.linspace(1.0, 1.15, n_days)
    noise = np.random.normal(0, 0.1, n_days)
    demand = np.maximum(0, base * trend * seasonal * (1 + noise)).round(0)
    for d, v in zip(dates, demand):
        records.append({'unique_id': uid, 'ds': d, 'y': v, 'category': cat})

df = pd.DataFrame(records)
print(f"Dataset: {len(df):,} rows, {df['unique_id'].nunique():,} series")`} />

      <PythonCode code={`# ── 2. Static SKU features ────────────────────────────────────────────
static_features = (
    df.groupby('unique_id')['category']
    .first()
    .reset_index()
    .rename(columns={'category': 'category'})
)
# LightGBM handles categoricals natively
static_features['category'] = pd.Categorical(static_features['category'])

# ── 3. Define MLForecast ───────────────────────────────────────────────
lgbm = lgb.LGBMRegressor(
    n_estimators=1000,
    learning_rate=0.03,
    num_leaves=127,
    min_child_samples=30,
    subsample=0.8,
    colsample_bytree=0.8,
    early_stopping_rounds=50,
    random_state=42,
    verbosity=-1,
)

mlf = MLForecast(
    models=[lgbm],
    freq='D',
    lags=[1, 2, 3, 7, 14, 28, 56, 364],
    lag_transforms={
        1: [
            (rolling_mean, 7),
            (rolling_std, 7),
            (rolling_mean, 28),
            (rolling_max, 7),
        ],
        7: [(rolling_mean, 28)],
    },
    date_features=['dayofweek', 'week', 'month', 'year'],
    target_transforms=[LocalStandardScaler()],  # normalize per series
    num_threads=8,
)`} />

      <PythonCode code={`# ── 4. Fit ────────────────────────────────────────────────────────────
# Use last 2 weeks as validation for early stopping
train = df[df['ds'] < '2023-12-18']
val   = df[df['ds'] >= '2023-12-18']

mlf.fit(
    train,
    static_features=['category'],
    id_col='unique_id',
    time_col='ds',
    target_col='y',
)

# ── 5. Forecast ───────────────────────────────────────────────────────
horizon = 28  # 4 weeks ahead
forecasts = mlf.predict(h=horizon)
forecasts['y_pred'] = forecasts['LGBMRegressor'].clip(lower=0)  # no negative demand
print(f"Forecast rows: {len(forecasts):,}")
print(forecasts.head())`} />

      <PythonCode code={`# ── 6. Cross-validation backtesting ──────────────────────────────────
cv = mlf.cross_validation(
    df=df,
    h=28,
    n_windows=4,
    step_size=28,
    refit=False,       # use single trained model (faster)
)

# Evaluate per SKU and aggregate
cv['error'] = cv['y'] - cv['LGBMRegressor']
cv['ae'] = cv['error'].abs()
cv['ape'] = cv['ae'] / cv['y'].replace(0, np.nan)

print("Overall MAE:", cv['ae'].mean().round(2))
print("Overall SMAPE:", (2 * cv['ae'] / (cv['y'].abs() + cv['LGBMRegressor'].abs())).mean().round(4))

# Per-horizon accuracy
cv['horizon_step'] = cv.groupby(['unique_id', 'cutoff']).cumcount() + 1
horizon_accuracy = cv.groupby('horizon_step')['ae'].mean()
print("\\nMAE by forecast horizon:")
print(horizon_accuracy.round(2))`} />

      <h2>Cold-Start: Forecasting New SKUs</h2>
      <p>
        New SKUs have no historical demand. Strategies in order of preference:
      </p>
      <ol className="list-decimal pl-6 my-3 space-y-2">
        <li><strong>Similar SKU transfer</strong>: find nearest neighbor by attributes (category, price, store) and use their demand profile.</li>
        <li><strong>Category/store median</strong>: forecast using the median demand of the category in that store.</li>
        <li><strong>Attributes-only model</strong>: train a separate model predicting first-week demand from static features only (price, category, store type, promotional budget).</li>
        <li><strong>Bayesian prior</strong>: set an informative prior based on product attributes and update as observations arrive.</li>
      </ol>

      <PythonCode code={`# ── Cold-start with attributes-only model ─────────────────────────────
from sklearn.ensemble import GradientBoostingRegressor

# Build training set: first-week demand for existing SKUs
first_week = (
    df[df['ds'] <= df.groupby('unique_id')['ds'].transform('min') + pd.Timedelta('6D')]
    .groupby('unique_id')['y']
    .sum()
    .reset_index()
    .rename(columns={'y': 'first_week_demand'})
)
cold_start_df = first_week.merge(static_features, on='unique_id')
cold_start_df['category_encoded'] = pd.Categorical(cold_start_df['category']).codes

X_cold = cold_start_df[['category_encoded']]
y_cold = np.log1p(cold_start_df['first_week_demand'])

cold_model = GradientBoostingRegressor(n_estimators=200, max_depth=4, random_state=42)
cold_model.fit(X_cold, y_cold)

# Predict for brand new SKU
new_sku_attrs = pd.DataFrame({'category_encoded': [2]})  # e.g., 'Dairy'
first_week_pred = np.expm1(cold_model.predict(new_sku_attrs)[0])
print(f"Cold-start first-week forecast: {first_week_pred:.1f} units")`} />

      <NoteBlock>
        Log transform for SKU demand is usually beneficial. Demand distributions are
        right-skewed (many low sellers, few high sellers). A log transform makes the
        target more symmetric, helping gradient boosted trees split more effectively.
        Use <code>np.log1p(y)</code> (adds 1 before log) to handle zeros safely, and
        <code>np.expm1(pred)</code> to back-transform.
      </NoteBlock>

      <h2>Training Time vs Scale</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={scalingData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="skus" tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} />
          <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(v) => `${v} min`} />
          <Legend />
          <Bar dataKey="local_min" fill="#ef4444" name="Local (one model/SKU)" />
          <Bar dataKey="global_min" fill="#22c55e" name="Global LightGBM" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-center text-gray-500 mt-1">
        Global models scale sub-linearly with number of SKUs; local models scale linearly.
      </p>

      <WarningBlock>
        A global model assumes demand patterns are similar across series. If you mix
        very different series (e.g., perishable food + industrial equipment), train
        separate models by product segment or include rich static features so the model
        can distinguish them.
      </WarningBlock>

      <ReferenceList references={[
        {
          authors: 'Bandara, K., Bergmeir, C., Smyl, S.',
          year: 2020,
          title: 'Forecasting across time series databases using recurrent neural networks on groups of similar series',
          journal: 'Expert Systems with Applications',
          volume: '140',
          pages: '112896',
        },
        {
          authors: 'Januschowski, T. et al.',
          year: 2020,
          title: 'Criteria for classifying forecasting methods',
          journal: 'International Journal of Forecasting',
          volume: '36(1)',
          pages: '167–177',
        },
      ]} />
    </SectionLayout>
  );
}
