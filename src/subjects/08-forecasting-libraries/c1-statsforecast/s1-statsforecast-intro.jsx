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

const speedData = [
  { library: 'statsmodels', time: 100 },
  { library: 'statsforecast', time: 1 },
];

const forecastData = [
  { period: 'W1', actual: 120, autoarima: 118, autoets: 122 },
  { period: 'W2', actual: 135, autoarima: 130, autoets: 133 },
  { period: 'W3', actual: 128, autoarima: 132, autoets: 129 },
  { period: 'W4', actual: 142, autoarima: 140, autoets: 138 },
  { period: 'W5', actual: 155, autoarima: 150, autoets: 152 },
  { period: 'W6', actual: null, autoarima: 158, autoets: 160 },
  { period: 'W7', actual: null, autoarima: 162, autoets: 165 },
  { period: 'W8', actual: null, autoarima: 167, autoets: 170 },
];

const cvErrorData = [
  { fold: 'Fold 1', autoarima: 8.2, autoets: 9.1, mstl: 7.8 },
  { fold: 'Fold 2', autoarima: 10.5, autoets: 11.2, mstl: 9.4 },
  { fold: 'Fold 3', autoarima: 7.9, autoets: 8.5, mstl: 7.2 },
  { fold: 'Fold 4', autoarima: 9.3, autoets: 10.0, mstl: 8.8 },
  { fold: 'Fold 5', autoarima: 11.1, autoets: 12.3, mstl: 10.2 },
];

export default function StatsForecastIntro() {
  const [activeModel, setActiveModel] = useState('autoarima');

  return (
    <SectionLayout
      title="statsforecast Quickstart"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['ARIMA Models', 'Exponential Smoothing', 'Python Basics']}
    >
      <p>
        Nixtla's <strong>statsforecast</strong> library delivers classical statistical forecasting
        models at speeds up to 100x faster than equivalent statsmodels implementations. It achieves
        this through Numba-optimized algorithms and underlying C extensions. The result: fitting
        AutoARIMA on thousands of time series in seconds instead of hours.
      </p>

      <h2>Why statsforecast?</h2>
      <p>
        Statistical models like ARIMA and ETS remain strong baselines and often outperform deep
        learning on short series or when data is scarce. The bottleneck has always been speed.
        statsforecast removes that bottleneck while keeping the same statistical guarantees.
      </p>

      <div className="my-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-center text-sm font-semibold text-gray-600 mb-4">
          Relative Fit Time: 1,000 Series AutoARIMA (lower is better)
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={speedData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" label={{ value: 'Relative time (statsmodels = 100)', position: 'insideBottom', offset: -5 }} height={50} />
            <YAxis type="category" dataKey="library" width={110} />
            <Tooltip formatter={(v) => `${v}x`} />
            <Bar dataKey="time" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DefinitionBlock title="Core Architecture">
        statsforecast uses <strong>Numba JIT compilation</strong> to convert Python/NumPy model
        code to optimized machine code at first run. ARIMA likelihood evaluation and ETS state
        updates run as fast as hand-written C. The library also parallelizes across series using
        Python's <code>ray</code> or <code>multiprocessing</code> backends, making fleet-scale
        forecasting practical on a single machine.
      </DefinitionBlock>

      <h2>Installation</h2>
      <PythonCode code={`pip install statsforecast`} />

      <h2>Long-Format DataFrame Convention</h2>
      <p>
        statsforecast expects data in <strong>long format</strong> (tidy format), where each row is
        one observation for one series. Three required columns:
      </p>
      <ul className="list-disc pl-6 my-3 space-y-1">
        <li><code>unique_id</code>: series identifier (string or int)</li>
        <li><code>ds</code>: datestamp (datetime or integer index)</li>
        <li><code>y</code>: target variable (numeric)</li>
      </ul>

      <NoteBlock>
        This long-format convention is shared across all Nixtla libraries (mlforecast,
        neuralforecast). Learning it once means you can move seamlessly between them with minimal
        data wrangling.
      </NoteBlock>

      <h2>Available Models</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-50">
              <th className="border border-gray-300 p-2 text-left">Model</th>
              <th className="border border-gray-300 p-2 text-left">Description</th>
              <th className="border border-gray-300 p-2 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['AutoARIMA', 'Stepwise order selection via AIC/BIC', 'Stationary or trending series'],
              ['AutoETS', 'Automatic error/trend/seasonal component selection', 'Seasonal, general-purpose'],
              ['AutoCES', 'Complex Exponential Smoothing', 'Multiple seasonality'],
              ['AutoTheta', 'Theta method with automatic decomposition', 'Strong trend + seasonality'],
              ['MSTL', 'Multiple Seasonal-Trend decomp with LOESS', 'Hourly/daily multi-seasonality'],
              ['Naive', 'Last-value carry-forward', 'Baseline benchmark'],
              ['SeasonalNaive', 'Last season repeat', 'Strong seasonal baseline'],
              ['HistoricAverage', 'Grand mean forecast', 'Ultra-simple baseline'],
            ].map(([model, desc, bestFor]) => (
              <tr key={model} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 font-mono font-semibold">{model}</td>
                <td className="border border-gray-300 p-2">{desc}</td>
                <td className="border border-gray-300 p-2 text-gray-600">{bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Complete Quickstart: Retail Sales Forecasting</h2>
      <p>
        The following example works through a complete forecasting workflow on M5-style retail data:
        loading data, fitting multiple models, forecasting, running cross-validation, and extracting
        prediction intervals.
      </p>

      <PythonCode code={`import pandas as pd
import numpy as np
from statsforecast import StatsForecast
from statsforecast.models import (
    AutoARIMA, AutoETS, AutoTheta, MSTL, SeasonalNaive,
)

# ── 1. Build sample long-format DataFrame ─────────────────────────────────
np.random.seed(42)
n_periods = 104  # 2 years of weekly data

records = []
for store in ['CA_1', 'CA_2', 'TX_1']:
    for item in [f'ITEM_{i:03d}' for i in range(1, 6)]:
        uid = f'{store}_{item}'
        dates = pd.date_range('2022-01-01', periods=n_periods, freq='W')
        trend = np.linspace(100, 130, n_periods)
        seasonal = 10 * np.sin(2 * np.pi * np.arange(n_periods) / 52)
        noise = np.random.normal(0, 5, n_periods)
        sales = np.maximum(0, trend + seasonal + noise).round(0)
        for date, value in zip(dates, sales):
            records.append({'unique_id': uid, 'ds': date, 'y': value})

df = pd.DataFrame(records)
print(f"Shape: {df.shape}, Series: {df['unique_id'].nunique()}")
# Shape: (7800, 3), Series: 15`} />

      <PythonCode code={`# ── 2. Instantiate StatsForecast ──────────────────────────────────────────
models = [
    AutoARIMA(season_length=52),
    AutoETS(season_length=52),
    AutoTheta(season_length=52),
    MSTL(season_length=[52]),
    SeasonalNaive(season_length=52),  # benchmark
]

sf = StatsForecast(
    models=models,
    freq='W',
    n_jobs=-1,   # parallelize across all CPU cores
    fallback_model=SeasonalNaive(season_length=52),
)

# ── 3. Fit and forecast ────────────────────────────────────────────────────
horizon = 12  # 12 weeks ahead

forecasts = sf.forecast(df=df, h=horizon, fitted=True)
print(forecasts.columns.tolist())
# ['unique_id', 'ds', 'AutoARIMA', 'AutoETS', 'AutoTheta', 'MSTL', 'SeasonalNaive']`} />

      <PythonCode code={`# ── 4. Prediction intervals ───────────────────────────────────────────────
forecasts_pi = sf.forecast(df=df, h=horizon, level=[80, 95])

# Returns lo/hi columns for each confidence level:
# AutoARIMA-lo-80, AutoARIMA-hi-80, AutoARIMA-lo-95, AutoARIMA-hi-95, ...
series_fc = forecasts_pi[forecasts_pi['unique_id'] == 'CA_1_ITEM_001']
print(series_fc[['ds', 'AutoARIMA', 'AutoARIMA-lo-95', 'AutoARIMA-hi-95']])

# ── 5. Cross-validation ───────────────────────────────────────────────────
cv_df = sf.cross_validation(
    df=df,
    h=horizon,
    n_windows=5,   # number of evaluation windows
    step_size=4,   # weeks between cutoff dates
    level=[95],
)
# cv_df columns: unique_id, ds, cutoff, y, AutoARIMA, AutoETS, ...`} />

      <PythonCode code={`# ── 6. Evaluate accuracy across models ────────────────────────────────────
from utilsforecast.losses import mae, rmse, smape
from statsforecast.evaluation import evaluate

evaluation = evaluate(
    cv_df,
    metrics=[mae, rmse, smape],
    models=['AutoARIMA', 'AutoETS', 'AutoTheta', 'MSTL', 'SeasonalNaive'],
)

summary = (
    evaluation
    .groupby('metric')[['AutoARIMA', 'AutoETS', 'AutoTheta', 'MSTL', 'SeasonalNaive']]
    .mean()
    .round(3)
)
print(summary)
#          AutoARIMA  AutoETS  AutoTheta   MSTL  SeasonalNaive
# mae          9.40    10.22       9.81   8.68          12.35
# rmse        12.15    13.04      12.67  11.22          16.01
# smape        0.071    0.077      0.074  0.065          0.094`} />

      <PythonCode code={`# ── 7. Conformal prediction intervals ─────────────────────────────────────
# Distribution-free intervals with guaranteed finite-sample coverage
from statsforecast.utils import ConformalIntervals

sf_conformal = StatsForecast(
    models=[AutoARIMA(season_length=52)],
    freq='W',
    n_jobs=-1,
)
forecasts_conformal = sf_conformal.forecast(
    df=df,
    h=horizon,
    level=[80, 95],
    prediction_intervals=ConformalIntervals(h=horizon, n_windows=10),
)
# Conformal intervals are wider but have exact empirical coverage,
# unlike parametric Gaussian intervals which assume normality`} />

      <h2>Forecast Visualization</h2>
      <div className="my-6">
        <div className="flex gap-2 mb-4">
          {[['autoarima', 'AutoARIMA'], ['autoets', 'AutoETS']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveModel(key)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                activeModel === key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis domain={[100, 185]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#374151" strokeWidth={2} dot={{ r: 4 }} name="Actual" connectNulls={false} />
            {activeModel === 'autoarima' && (
              <Line type="monotone" dataKey="autoarima" stroke="#6366f1" strokeWidth={2} strokeDasharray="6 3" dot={false} name="AutoARIMA Forecast" />
            )}
            {activeModel === 'autoets' && (
              <Line type="monotone" dataKey="autoets" stroke="#22c55e" strokeWidth={2} strokeDasharray="6 3" dot={false} name="AutoETS Forecast" />
            )}
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-center text-gray-500 mt-1">
          W6–W8: forecast horizon (dashed). Toggle model above to compare.
        </p>
      </div>

      <h2>Cross-Validation MAE by Fold</h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={cvErrorData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fold" />
          <YAxis label={{ value: 'MAE', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="autoarima" fill="#6366f1" name="AutoARIMA" />
          <Bar dataKey="autoets" fill="#22c55e" name="AutoETS" />
          <Bar dataKey="mstl" fill="#f59e0b" name="MSTL" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Conformal Prediction Intervals Explained</h2>
      <p>
        Unlike parametric intervals (which assume Gaussian errors), conformal prediction
        intervals are distribution-free:
      </p>
      <BlockMath math="\hat{C}_{1-\alpha}(x) = \left[\hat{f}(x) - \hat{q}_{1-\alpha},\; \hat{f}(x) + \hat{q}_{1-\alpha}\right]" />
      <p>
        where <InlineMath math="\hat{q}_{1-\alpha}" /> is the
        {' '}<InlineMath math="(1-\alpha)" />-quantile of the calibration set residuals. This
        guarantees at least <InlineMath math="1-\alpha" /> marginal coverage without any
        distributional assumptions.
      </p>

      <TheoremBlock title="When Classical Models Beat Deep Learning">
        On the M4 competition benchmark (100,000 time series), AutoARIMA-based ensembles
        reached top-5 performance. For series with fewer than 50 observations, classical
        methods consistently outperform neural networks because insufficient data prevents
        learning complex patterns. statsforecast makes it practical to apply these models at
        industrial scale across tens of thousands of series.
      </TheoremBlock>

      <WarningBlock>
        AutoARIMA's stepwise order search can be slow for very long series or high seasonal
        periods. Set <code>approximation=True</code> for faster (slightly less accurate) order
        selection. For seasonal periods above 24, also set <code>max_p=3, max_q=3</code> to
        constrain the search space.
      </WarningBlock>

      <h2>Production Tips</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Use <code>n_jobs=-1</code> to parallelize across all available CPU cores.</li>
        <li>For 10k+ series, initialize Ray before instantiating <code>StatsForecast</code> to distribute across workers.</li>
        <li>Always include <code>SeasonalNaive</code> as a benchmark; if your model does not beat it, something is wrong.</li>
        <li>Set <code>fallback_model</code> to prevent pipeline failures on problematic series (sparse data, all zeros).</li>
        <li>Use <code>fitted=True</code> in <code>forecast()</code> to retrieve in-sample fitted values for residual diagnostics.</li>
        <li>Cache fitted models with <code>sf.save('path/to/model')</code> and reload with <code>StatsForecast.load()</code> for production serving.</li>
      </ul>

      <ReferenceList references={[
        {
          authors: 'Garza, A., Challu, C., Mergenthaler-Canseco, M.',
          year: 2022,
          title: 'StatsForecast: Lightning fast forecasting with statistical and econometric models',
          journal: 'Nixtla Technical Report',
        },
        {
          authors: 'Hyndman, R.J., Khandakar, Y.',
          year: 2008,
          title: 'Automatic time series forecasting: the forecast package for R',
          journal: 'Journal of Statistical Software',
          volume: '27(3)',
          pages: '1–22',
        },
        {
          authors: 'Makridakis, S., Spiliotis, E., Assimakopoulos, V.',
          year: 2020,
          title: 'The M4 Competition: 100,000 time series and 61 forecasting methods',
          journal: 'International Journal of Forecasting',
          volume: '36(1)',
          pages: '54–74',
        },
      ]} />
    </SectionLayout>
  );
}
