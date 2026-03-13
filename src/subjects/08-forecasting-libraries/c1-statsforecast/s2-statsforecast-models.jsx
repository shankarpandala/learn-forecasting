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
  title: 'StatsForecast Model Zoo',
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Explore the full StatsForecast model library: AutoARIMA, AutoETS, AutoCES, MSTL, Theta, and their benchmark performance on the M4 dataset.',
};

export default function StatsForecastModels() {
  return (
    <SectionLayout title="StatsForecast Model Zoo" metadata={metadata}>
      <p>
        StatsForecast (Nixtla) provides highly optimized implementations of classical statistical
        forecasting models in Python, achieving 20-100x speedups over statsmodels through Numba JIT
        compilation and parallelization. The library covers everything from simple baselines to
        state-of-the-art classical models that won the M3 and M4 competitions.
      </p>

      <h2>AutoARIMA</h2>
      <p>
        StatsForecast's <code>AutoARIMA</code> automatically selects ARIMA orders using the Hyndman-Khandakar
        algorithm: it searches over (p, d, q) and seasonal (P, D, Q) using a stepwise procedure that
        minimizes AIC. Key features:
      </p>
      <ul>
        <li>Unit root tests (KPSS, ADF) for automatic differencing order selection</li>
        <li>Trigonometric seasonality option for long/multiple seasonal periods</li>
        <li>Parallel fitting across thousands of series</li>
        <li>10-50x faster than pmdarima's AutoARIMA for panel data</li>
      </ul>

      <DefinitionBlock title="AutoETS: Automatic Exponential Smoothing">
        <code>AutoETS</code> selects the best ETS model from all combinations of Error (A/M),
        Trend (N/A/Ad), and Seasonality (N/A/M) components, minimizing AICc. With 15 possible
        combinations (some excluded due to numerical instability), it automatically handles trend,
        seasonality, multiplicative effects, and damped trends without user specification.
      </DefinitionBlock>

      <h2>AutoCES: Complex Exponential Smoothing</h2>
      <p>
        Complex Exponential Smoothing (Svetunkov & Boylan, 2020) extends ETS to the complex number
        domain, enabling it to capture more complex dynamic patterns. <code>AutoCES</code> automatically
        selects from simple (S), partial (P), full (F), and none (N) seasonality variants. It often
        outperforms ETS on series with multiple or irregular seasonal patterns.
      </p>

      <h2>MSTL: Multiple Seasonal-Trend Decomposition</h2>
      <p>
        <code>MSTL</code> handles multiple seasonal periods simultaneously — a common requirement for
        hourly data (daily + weekly seasonality) or daily data (weekly + annual seasonality):
      </p>
      <ol>
        <li>Iteratively apply STL decomposition for each seasonal period</li>
        <li>After removing all seasonal components, fit a trend model</li>
        <li>Forecast each component separately and combine</li>
      </ol>
      <p>
        MSTL accepts a <code>season_length</code> list (e.g., <code>[24, 168]</code> for hourly data)
        and a <code>trend_forecaster</code> for the residual trend after decomposition.
      </p>

      <h2>Theta Model</h2>
      <p>
        The Theta method (Assimakopoulos & Nikolopoulos, 2000) modifies the local curvature of a time
        series through a parameter <InlineMath math="\theta" />, then forecasts each "theta line" separately:
      </p>
      <BlockMath math="\Delta^2 \theta_i(t) = \theta_i \Delta^2 y(t)" />
      <p>
        The Theta model won the M3 competition. StatsForecast implements the optimized <code>Theta</code>
        and <code>OptimizedTheta</code> variants, plus a seasonal version <code>SeasTheta</code> that
        deseasonalizes first.
      </p>

      <h2>Other Available Models</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Model</th>
              <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Description</th>
              <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Best For</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['SeasonalNaive', 'Repeat last seasonal cycle', 'Benchmark'],
              ['ADIDA', 'Aggregate-disaggregate intermittent demand', 'Sparse demand'],
              ['IMAPA', 'Intermittent multiple aggregation prediction algorithm', 'Intermittent series'],
              ['CrostonOptimized', "Croston's method with optimal smoothing", 'Intermittent demand'],
              ['HistoricAverage', 'Mean of all historical values', 'Stable baseline'],
              ['RandomWalkWithDrift', 'Differenced series + drift', 'Financial data'],
              ['DynamicOptimizedTheta', 'Time-varying Theta with optimization', 'Non-stationary series'],
              ['TBATS', 'Trigonometric, Box-Cox, ARMA, Trend, Seasonal', 'Complex seasonality'],
            ].map(([model, desc, best]) => (
              <tr key={model}>
                <td style={{ padding: '0.6rem', border: '1px solid #e5e7eb', fontFamily: 'monospace' }}>{model}</td>
                <td style={{ padding: '0.6rem', border: '1px solid #e5e7eb' }}>{desc}</td>
                <td style={{ padding: '0.6rem', border: '1px solid #e5e7eb' }}>{best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoteBlock title="M4 Benchmark Performance">
        On the M4 dataset (100,000 time series across 6 frequencies), StatsForecast models are competitive
        with deep learning approaches at a fraction of the computational cost. AutoETS and Theta consistently
        appear in the top-10 benchmarks, and the simple average of AutoARIMA + AutoETS + Theta typically
        matches or exceeds more complex approaches.
      </NoteBlock>

      <PythonCode code={`import pandas as pd
import numpy as np
from datasetsforecast.m4 import M4, M4Info, M4Evaluation
from statsforecast import StatsForecast
from statsforecast.models import (
    AutoARIMA, AutoETS, AutoCES, Theta, DynamicOptimizedTheta,
    MSTL, SeasonalNaive, HistoricAverage, CrostonOptimized,
    RandomWalkWithDrift
)

# ── Load M4 monthly data ──────────────────────────────────────────────────────
# pip install datasetsforecast
group = 'Monthly'
train_df, horizon, freq, seasonality = M4.load(directory='data', group=group)
print(f"Loaded {train_df['unique_id'].nunique()} series, horizon={horizon}")

# ── Define model zoo ──────────────────────────────────────────────────────────
models = [
    AutoARIMA(season_length=seasonality),
    AutoETS(season_length=seasonality),
    AutoCES(season_length=seasonality),
    Theta(season_length=seasonality),
    DynamicOptimizedTheta(season_length=seasonality),
    SeasonalNaive(season_length=seasonality),
    HistoricAverage(),
]

# ── Fit and forecast ──────────────────────────────────────────────────────────
sf = StatsForecast(
    models=models,
    freq=freq,
    n_jobs=-1,    # use all CPU cores
    fallback_model=SeasonalNaive(season_length=seasonality)
)

sf.fit(train_df)
forecasts = sf.predict(h=horizon)
print("Forecast shape:", forecasts.shape)
print("Forecast columns:", forecasts.columns.tolist())

# ── Evaluate on M4 test set ───────────────────────────────────────────────────
# M4Evaluation computes sMAPE and MASE
model_names = [repr(m) for m in models]
evaluation = M4Evaluation.evaluate(
    directory='data',
    group=group,
    cutoffs=[None],
)
print("\\nM4 Evaluation Results:")
print(evaluation)

# ── MSTL for multiple seasonalities (hourly data) ────────────────────────────
# Generate synthetic hourly data with daily + weekly seasonality
np.random.seed(42)
n_hours = 24 * 7 * 8  # 8 weeks
t = np.arange(n_hours)
y_hourly = (100
            + 20 * np.sin(2 * np.pi * t / 24)       # daily
            + 10 * np.sin(2 * np.pi * t / (24*7))   # weekly
            + np.random.randn(n_hours) * 3)

hourly_df = pd.DataFrame({
    'unique_id': 'series_1',
    'ds': pd.date_range('2023-01-01', periods=n_hours, freq='h'),
    'y': y_hourly,
})

from statsforecast.models import AutoARIMA as AARIMA

sf_hourly = StatsForecast(
    models=[
        MSTL(
            season_length=[24, 24*7],      # daily + weekly
            trend_forecaster=AARIMA()
        ),
    ],
    freq='h',
    n_jobs=1
)
sf_hourly.fit(hourly_df)
h_forecast = sf_hourly.predict(h=24*7, level=[80, 95])  # forecast next week
print("\\nMSTL hourly forecast shape:", h_forecast.shape)

# ── AutoARIMA with prediction intervals ──────────────────────────────────────
sf_pi = StatsForecast(
    models=[AutoARIMA(season_length=12)],
    freq='MS'  # monthly start
)

monthly_example = train_df[train_df['unique_id'] == train_df['unique_id'].iloc[0]]
sf_pi.fit(monthly_example)
fc_with_pi = sf_pi.predict(h=12, level=[80, 95])
print("\\nColumns with PI:", fc_with_pi.columns.tolist())

# ── Intermittent demand: Croston ──────────────────────────────────────────────
# Simulate intermittent demand
np.random.seed(10)
n_weeks = 104
demand = np.random.choice(
    [0]*3 + [np.random.poisson(3)],
    size=n_weeks
)
intermittent_df = pd.DataFrame({
    'unique_id': 'sku_001',
    'ds': pd.date_range('2022-01-01', periods=n_weeks, freq='W'),
    'y': demand.astype(float)
})

sf_int = StatsForecast(
    models=[CrostonOptimized(), SeasonalNaive(season_length=52)],
    freq='W',
)
sf_int.fit(intermittent_df)
intermittent_fc = sf_int.predict(h=13)
print("\\nIntermittent demand forecast:")
print(intermittent_fc.head())
`} />

      <WarningBlock title="season_length for AutoARIMA">
        StatsForecast's AutoARIMA performs seasonal unit root tests only up to the specified
        <code>season_length</code>. For long seasonal periods (e.g., 365 for daily data), ARIMA becomes
        computationally expensive. In such cases, prefer MSTL + AutoARIMA on the trend component, or
        use Fourier terms via the <code>AutoARIMA(nxreg=...)</code> option.
      </WarningBlock>

      <ReferenceList references={[
        {
          title: 'StatsForecast: Lightning Fast Forecasting with Statistical and Econometric Models',
          authors: 'Garza, A. et al.',
          year: 2022,
          journal: 'NeurIPS Datasets and Benchmarks',
        },
        {
          title: 'Forecasting: Principles and Practice (3rd ed.)',
          authors: 'Hyndman, R.J. & Athanasopoulos, G.',
          year: 2021,
          url: 'https://otexts.com/fpp3/',
        },
        {
          title: 'The Theta Model: A Decomposition Approach to Forecasting',
          authors: 'Assimakopoulos, V. & Nikolopoulos, K.',
          year: 2000,
          journal: 'International Journal of Forecasting',
        },
      ]} />
    </SectionLayout>
  );
}
