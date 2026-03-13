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

const modelComparisonData = [
  { model: 'ExponentialSmoothing', mase: 1.12, trainTime: 0.3 },
  { model: 'Prophet', mase: 1.28, trainTime: 2.1 },
  { model: 'LightGBM', mase: 0.98, trainTime: 5.4 },
  { model: 'TCNModel', mase: 0.91, trainTime: 45.2 },
  { model: 'TFTModel', mase: 0.87, trainTime: 120.8 },
];

const historicalFcData = [
  { t: 'Q1 22', actual: 420, es: 415, lgbm: 418 },
  { t: 'Q2 22', actual: 455, es: 448, lgbm: 451 },
  { t: 'Q3 22', actual: 390, es: 400, lgbm: 393 },
  { t: 'Q4 22', actual: 510, es: 498, lgbm: 505 },
  { t: 'Q1 23', actual: 465, es: 472, lgbm: 461 },
  { t: 'Q2 23', actual: 488, es: 476, lgbm: 482 },
  { t: 'Q3 23', actual: null, es: 445, lgbm: 452 },
  { t: 'Q4 23', actual: null, es: 525, lgbm: 531 },
];

export default function DartsIntro() {
  const [selectedModel, setSelectedModel] = useState('es');

  return (
    <SectionLayout
      title="Darts: All-in-One Forecasting Library"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['Exponential Smoothing', 'Machine Learning Basics', 'Python Basics']}
    >
      <p>
        <strong>Darts</strong> (by Unit8) provides a unified Python API for over 30 forecasting
        models, from classical Exponential Smoothing to deep learning Temporal Fusion Transformers.
        Its core design principle: every model exposes identical <code>fit()</code>,
        <code>predict()</code>, and <code>historical_forecasts()</code> interfaces, making it
        trivial to swap models and compare them fairly.
      </p>

      <h2>Installation</h2>
      <PythonCode code={`# Core install (classical + ML models)
pip install darts

# With all deep learning support (PyTorch-based models)
pip install "darts[torch]"`} />

      <h2>The TimeSeries Object</h2>

      <DefinitionBlock title="darts.TimeSeries">
        The <code>TimeSeries</code> class is Darts' central data structure. It wraps a
        pandas Series or DataFrame with a <code>DatetimeIndex</code> (or integer index)
        and adds:
        <ul className="list-disc pl-4 mt-2 space-y-1">
          <li>Multivariate support (multiple columns = multiple components)</li>
          <li>Probabilistic support (samples dimension for Monte Carlo forecasts)</li>
          <li>Static covariates and future/past covariates</li>
          <li>Automatic frequency inference and gap detection</li>
        </ul>
      </DefinitionBlock>

      <PythonCode code={`import pandas as pd
import numpy as np
from darts import TimeSeries
from darts.datasets import AirPassengersDataset

# ── Option A: from pandas Series ──────────────────────────────────────────
dates = pd.date_range('2020-01-01', periods=120, freq='MS')
values = np.random.normal(100, 15, 120).cumsum() + 500
series = TimeSeries.from_times_and_values(dates, values)

# ── Option B: from pandas DataFrame ───────────────────────────────────────
df = pd.DataFrame({'date': dates, 'sales': values})
series = TimeSeries.from_dataframe(df, time_col='date', value_cols='sales', freq='MS')

# ── Option C: built-in datasets ───────────────────────────────────────────
series = AirPassengersDataset().load()

print(f"Length: {len(series)}")
print(f"Start: {series.start_time()}")
print(f"End:   {series.end_time()}")
print(f"Freq:  {series.freq}")`} />

      <PythonCode code={`# TimeSeries slicing and operations
train, val = series[:-12], series[-12:]  # last 12 months for validation

# Split at specific date
train = series.drop_after(pd.Timestamp('2023-01-01'))
val   = series.drop_before(pd.Timestamp('2023-01-01'))

# Univariate → multivariate by stacking
import darts.utils.timeseries_generation as tg
trend_component = tg.linear_timeseries(start=series.start_time(),
                                        end_value=1.5, length=len(series))
multivariate = series.stack(trend_component)`} />

      <h2>Model Categories</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-50">
              <th className="border border-gray-300 p-2 text-left">Category</th>
              <th className="border border-gray-300 p-2 text-left">Examples</th>
              <th className="border border-gray-300 p-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Local Statistical', 'ExponentialSmoothing, ARIMA, AutoARIMA, Theta', 'One model per series; fast; good for few series'],
              ['Local Regression', 'LinearRegressionModel, RandomForest, LightGBMModel', 'Tabular ML; one model per series'],
              ['Global Regression', 'LightGBMModel (global=True), XGBModel', 'Single model across all series; scalable'],
              ['Deep Learning (global)', 'TCNModel, NBEATSModel, NHiTSModel, TFTModel, TSMixerModel', 'PyTorch; requires torch install; needs much data'],
              ['Probabilistic', 'Any model + .predict(num_samples=N)', 'Monte Carlo dropout or conformal wrappers'],
            ].map(([cat, ex, note]) => (
              <tr key={cat} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">{cat}</td>
                <td className="border border-gray-300 p-2 font-mono text-xs">{ex}</td>
                <td className="border border-gray-300 p-2 text-gray-600 text-xs">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Complete Quickstart: ExponentialSmoothing vs LightGBM</h2>

      <PythonCode code={`from darts.models import ExponentialSmoothing, LightGBMModel
from darts.metrics import mae, mase, smape
from darts.dataprocessing.transformers import Scaler
import numpy as np

# Load Air Passengers dataset (classic benchmark)
from darts.datasets import AirPassengersDataset
series = AirPassengersDataset().load()

# Log-transform for variance stabilization
series_log = series.map(np.log)

# Train/test split
train, test = series_log[:-24], series_log[-24:]
horizon = len(test)

# ── Exponential Smoothing ──────────────────────────────────────────────────
es_model = ExponentialSmoothing()
es_model.fit(train)
es_pred = es_model.predict(horizon)
es_pred_orig = es_pred.map(np.exp)  # back-transform

print(f"ETS  MAE:  {mae(series[-24:], es_pred_orig):.2f}")
print(f"ETS  MASE: {mase(series[-24:], es_pred_orig, insample=series[:-24]):.3f}")`} />

      <PythonCode code={`# ── LightGBM (regression model) ───────────────────────────────────────────
scaler = Scaler()
train_scaled = scaler.fit_transform(train)
test_scaled  = scaler.transform(test)

lgbm_model = LightGBMModel(
    lags=24,                  # use 24 lagged values as features
    lags_past_covariates=None,
    output_chunk_length=12,   # predict 12 steps at once
    n_estimators=300,
    num_leaves=31,
    random_state=42,
    verbose=-1,
)
lgbm_model.fit(train_scaled)
lgbm_pred_scaled = lgbm_model.predict(horizon)
lgbm_pred = scaler.inverse_transform(lgbm_pred_scaled).map(np.exp)

print(f"LGBM MAE:  {mae(series[-24:], lgbm_pred):.2f}")
print(f"LGBM MASE: {mase(series[-24:], lgbm_pred, insample=series[:-24]):.3f}")`} />

      <PythonCode code={`# ── historical_forecasts: walk-forward backtesting ────────────────────────
# Re-trains or re-predicts at each step in history; gives realistic error estimates

es_historical = es_model.historical_forecasts(
    series_log,
    start=0.6,             # start backtesting from 60% of the series
    forecast_horizon=6,    # 6-step ahead forecasts
    stride=1,              # evaluate every timestep
    retrain=True,          # refit model at each step
    verbose=False,
)
print(f"Historical backtest MAE: {mae(series_log[es_historical.start_time():], es_historical):.4f}")

# ── Pipeline: preprocessing + model ───────────────────────────────────────
from darts.dataprocessing.pipeline import Pipeline
from darts.dataprocessing.transformers import MissingValuesFiller, Scaler

pipeline = Pipeline([
    MissingValuesFiller(),
    Scaler(),
    LightGBMModel(lags=12, output_chunk_length=6, verbose=-1),
])

pipeline.fit(train)
pipeline_pred = pipeline.predict(6)
print(f"Pipeline prediction shape: {pipeline_pred.n_timesteps} steps")`} />

      <PythonCode code={`# ── Probabilistic forecasting with conformal intervals ────────────────────
from darts.models import ExponentialSmoothing
from darts.ad import QuantileDetector  # for conformal coverage

es_prob = ExponentialSmoothing()
es_prob.fit(train_scaled)

# Predict with Monte Carlo samples (for models that support stochastic output)
# For deterministic models, use conformal prediction wrapper:
from darts.utils.statistics import check_residuals_stationarity

residuals = es_prob.residuals(train_scaled)
print(f"Residuals stationarity p-value: {check_residuals_stationarity(residuals)[1]:.3f}")

# Probabilistic ETS with num_samples returns ensemble
pred_prob = es_prob.predict(horizon, num_samples=200)
# Access quantiles
print(f"10th pctile at t+1: {pred_prob.quantile_timeseries(0.10).first_value():.4f}")
print(f"90th pctile at t+1: {pred_prob.quantile_timeseries(0.90).first_value():.4f}")`} />

      <h2>Model Comparison: MASE vs Training Time</h2>
      <div className="my-6">
        <div className="flex gap-2 mb-4 flex-wrap">
          {[['es', 'ExponentialSmoothing'], ['lgbm', 'LightGBM']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedModel(key)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedModel === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={historicalFcData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" />
            <YAxis domain={[360, 560]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#374151" strokeWidth={2} dot={{ r: 4 }} name="Actual" connectNulls={false} />
            {selectedModel === 'es' && (
              <Line type="monotone" dataKey="es" stroke="#6366f1" strokeWidth={2} strokeDasharray="6 3" dot={false} name="ExponentialSmoothing" />
            )}
            {selectedModel === 'lgbm' && (
              <Line type="monotone" dataKey="lgbm" stroke="#22c55e" strokeWidth={2} strokeDasharray="6 3" dot={false} name="LightGBM" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="my-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">MASE by Model (lower is better)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={modelComparisonData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0.8, 1.35]} />
            <YAxis type="category" dataKey="model" width={150} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="mase" fill="#6366f1" name="MASE" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-center text-gray-500 mt-1">
          Deep learning models (TCN, TFT) achieve lower MASE but require orders of magnitude more training time.
        </p>
      </div>

      <h2>Covariate Support</h2>
      <p>Darts distinguishes three types of covariates:</p>
      <ul className="list-disc pl-6 my-3 space-y-2">
        <li><strong>Past covariates</strong>: features known only up to the forecast origin (e.g., historical promotions). Passed to <code>fit()</code> and used as model inputs for the lookback window.</li>
        <li><strong>Future covariates</strong>: features known for the entire forecast horizon (e.g., planned holidays, calendar). Passed to both <code>fit()</code> and <code>predict()</code>.</li>
        <li><strong>Static covariates</strong>: time-invariant series-level features (e.g., SKU category). Attached directly to the <code>TimeSeries</code> object.</li>
      </ul>

      <NoteBlock>
        The <code>historical_forecasts()</code> method is Darts' most powerful backtesting
        tool. It simulates the real forecasting process: at each evaluation timestep, it
        trains on data up to that point and predicts h steps ahead. Set <code>retrain=False</code>
        to use a single trained model (much faster) when you trust the model is stable.
      </NoteBlock>

      <WarningBlock>
        Deep learning models (TCNModel, TFTModel) require substantial data to train. TCN
        typically needs at least 1,000 timesteps per series; TFT needs even more. For typical
        business forecasting with monthly data (60–120 points), ExponentialSmoothing or
        LightGBM will outperform neural networks.
      </WarningBlock>

      <ReferenceList references={[
        {
          authors: 'Herzen, J. et al.',
          year: 2022,
          title: 'Darts: User-friendly modern machine learning for time series',
          journal: 'Journal of Machine Learning Research',
          volume: '23(124)',
          pages: '1–6',
        },
        {
          authors: 'Lim, B., Arık, S.Ö., Loeff, N., Pfister, T.',
          year: 2021,
          title: 'Temporal Fusion Transformers for interpretable multi-horizon time series forecasting',
          journal: 'International Journal of Forecasting',
          volume: '37(4)',
          pages: '1748–1764',
        },
      ]} />
    </SectionLayout>
  );
}
