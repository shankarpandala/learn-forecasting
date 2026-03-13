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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TimeGPTIntro() {
  return (
    <SectionLayout
      title="TimeGPT: The First Foundation Model for Time Series"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['Foundation model concepts (c1-s1)', 'Transformer architecture basics']}
    >
      <p className="text-gray-700 leading-relaxed">
        TimeGPT (Garza et al., 2023) was the first foundation model specifically designed for
        time series forecasting. Released by Nixtla, it demonstrated that a single pre-trained
        model could achieve competitive zero-shot accuracy across finance, energy, retail, and
        weather datasets — without any fine-tuning on the target domain.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Architecture Overview</h2>
      <p className="text-gray-700 leading-relaxed">
        TimeGPT uses an <strong>encoder-decoder Transformer</strong> architecture:
      </p>

      <DefinitionBlock title="TimeGPT Architecture">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Encoder:</strong> processes the historical window <InlineMath math="x_{1:T}" /> using multi-head self-attention and feed-forward layers. Produces a latent representation capturing temporal patterns.</li>
          <li><strong>Decoder:</strong> attends to the encoder output via cross-attention, generating the forecast <InlineMath math="\hat{y}_{T+1:T+H}" /> autoregressively or in a single forward pass.</li>
          <li><strong>Local normalization:</strong> each input window is normalized by its mean and standard deviation, then denormalized at output — enabling handling of diverse value scales across series.</li>
        </ul>
      </DefinitionBlock>

      <p className="text-gray-700 leading-relaxed mt-4">
        The key design choices that enable generalization across datasets:
      </p>
      <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
        <li><strong>Instance normalization:</strong> input <InlineMath math="x \leftarrow (x - \mu_x)/\sigma_x" /> removes series-specific scale and offset, making the model distribution-agnostic</li>
        <li><strong>Flexible context window:</strong> handles variable-length inputs up to a maximum context length</li>
        <li><strong>Multi-frequency training:</strong> trained on series with diverse frequencies (hourly, daily, weekly, monthly, yearly)</li>
        <li><strong>Anomaly handling:</strong> robust training with winsorization of extreme values</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Training Data</h2>
      <p className="text-gray-700 leading-relaxed">
        TimeGPT was trained on a massive, diverse corpus of time series:
      </p>
      <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
        <li>Over 100 billion data points across multiple domains</li>
        <li>Sources: finance (stock prices, FX rates), energy (electricity, gas), retail (sales, transactions), weather, web traffic, and more</li>
        <li>Multiple temporal frequencies from seconds to years</li>
        <li>Both stationary and non-stationary series, with various trend/seasonality combinations</li>
      </ul>

      <NoteBlock title="Why Scale Matters">
        The diversity of training data is more important than sheer volume. TimeGPT's strong
        zero-shot performance on retail data (despite being trained on many other domains) suggests
        the model learns general temporal patterns — periodicity, trend behavior, volatility regimes
        — rather than domain-specific facts. This is analogous to how GPT learns "language" rather
        than domain facts.
      </NoteBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">The Nixtla API</h2>
      <p className="text-gray-700 leading-relaxed">
        TimeGPT is accessed via the Nixtla cloud API using the <code>nixtla</code> Python client.
        The API design mirrors the <code>neuralforecast</code> interface: long-format DataFrames
        with <code>unique_id</code>, <code>ds</code>, <code>y</code> columns.
      </p>

      <PythonCode>{`# Install: pip install nixtla
import pandas as pd
import numpy as np
from nixtla import NixtlaClient

# ── Authenticate ───────────────────────────────────────────────────────────────
client = NixtlaClient(api_key='your_api_key_here')  # Get at dashboard.nixtla.io
# Or set env variable: export NIXTLA_API_KEY='...'

# ── Basic zero-shot forecasting ────────────────────────────────────────────────
# Prepare long-format DataFrame
df = pd.DataFrame({
    'unique_id': ['series_1'] * 120,
    'ds': pd.date_range('2020-01-01', periods=120, freq='ME'),
    'y': np.random.randn(120).cumsum() + 100,
})

# Zero-shot forecast: no training needed!
forecasts = client.forecast(
    df=df,
    h=12,                   # Forecast 12 months
    freq='ME',              # Monthly end frequency
    time_col='ds',
    target_col='y',
    id_col='unique_id',
    level=[80, 95],         # Return 80% and 95% prediction intervals
)
print(forecasts.head())
# unique_id          ds  TimeGPT  TimeGPT-lo-80  TimeGPT-hi-80  ...

# ── Multiple series ────────────────────────────────────────────────────────────
n_series = 50
dfs = []
for i in range(n_series):
    dfs.append(pd.DataFrame({
        'unique_id': [f'series_{i}'] * 60,
        'ds': pd.date_range('2021-01-01', periods=60, freq='W'),
        'y': np.sin(np.arange(60) * 0.3 + i) * 10 + np.random.randn(60),
    }))
multi_df = pd.concat(dfs, ignore_index=True)

# Single API call forecasts all 50 series simultaneously
multi_forecasts = client.forecast(
    df=multi_df,
    h=8,
    freq='W',
    level=[95],
)
print(f"Forecasts shape: {multi_forecasts.shape}")
# (400, 5) = 50 series × 8 steps × columns

# ── With exogenous covariates ──────────────────────────────────────────────────
# Future-known covariates must span the forecast horizon
df_with_cov = df.copy()
df_with_cov['promotion'] = (np.arange(120) % 12 == 0).astype(float)
df_with_cov['month_sin'] = np.sin(2 * np.pi * df['ds'].dt.month / 12)

# Future covariates DataFrame (for the forecast horizon)
future_dates = pd.date_range(df['ds'].max(), periods=13, freq='ME')[1:]
future_df = pd.DataFrame({
    'unique_id': ['series_1'] * 12,
    'ds': future_dates,
    'promotion': 0.0,
    'month_sin': np.sin(2 * np.pi * future_dates.month / 12),
})

forecasts_with_cov = client.forecast(
    df=df_with_cov,
    X_df=future_df,         # Future covariates
    h=12,
    freq='ME',
    level=[80, 95],
)

# ── Anomaly detection (built-in) ───────────────────────────────────────────────
anomalies = client.detect_anomalies(
    df=df,
    freq='ME',
    level=99,               # Flag as anomaly if outside 99% PI
)
print(anomalies[anomalies['anomaly'] == True])
`}</PythonCode>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">When TimeGPT Works Well</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="p-4 rounded-lg border-2 border-green-300 bg-green-50">
          <h4 className="font-bold text-green-700 mb-2">Good Use Cases</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc pl-4">
            <li>Cold-start: forecasting brand new series with no history</li>
            <li>Rapid prototyping before investing in ML infrastructure</li>
            <li>Short to medium series (&lt;500 observations)</li>
            <li>Series with strong regular seasonality</li>
            <li>Mixed-frequency portfolios (many series, different freqs)</li>
            <li>When you don't have ML engineering resources</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-2 border-red-300 bg-red-50">
          <h4 className="font-bold text-red-700 mb-2">Be Cautious When</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc pl-4">
            <li>Highly domain-specific series (industrial sensors)</li>
            <li>Very long series where classical methods fit well</li>
            <li>Strict latency requirements (API adds network overhead)</li>
            <li>Data privacy constraints (data sent to cloud)</li>
            <li>Irregular time series or custom seasonalities</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Zero-Shot Benchmark Performance</h2>
      <p className="text-gray-700 leading-relaxed">
        The TimeGPT paper reported competitive zero-shot results on multiple benchmarks. On
        standard datasets, TimeGPT zero-shot often matches or slightly beats well-tuned
        statistical baselines:
      </p>

      <ExampleBlock title="M4 Monthly Benchmark">
        <p>
          On M4 Monthly (48,000 series, H=18), TimeGPT zero-shot achieves sMAPE around 12-14%,
          comparable to Naïve2 (16%) and AutoETS (12.4%), though below the ES-RNN winner (11.4%).
          The key advantage: zero-shot TimeGPT requires no per-series model fitting, making it
          useful when you receive hundreds of new series daily.
        </p>
      </ExampleBlock>

      <WarningBlock title="API Costs and Rate Limits">
        TimeGPT is a paid API service (free tier available). For production use with thousands
        of series, estimate costs carefully: pricing is per input token (each data point counts
        as a token). For large datasets, evaluate whether fine-tuning an open-source model
        (Chronos, Lag-Llama) offers better cost-performance trade-offs.
      </WarningBlock>

      <ReferenceList references={[
        { authors: 'Garza, A., Challu, C., Mergenthaler-Canseco, M.', year: 2023, title: 'TimeGPT-1', venue: 'arXiv', url: 'https://arxiv.org/abs/2310.03589' },
        { authors: 'Makridakis, S. et al.', year: 2020, title: 'The M4 Competition: 100,000 time series and 61 forecasting methods', venue: 'International Journal of Forecasting', url: 'https://doi.org/10.1016/j.ijforecast.2019.04.014' },
        { authors: 'Bommasani, R. et al.', year: 2021, title: 'On the Opportunities and Risks of Foundation Models', venue: 'arXiv', url: 'https://arxiv.org/abs/2108.07258' },
      ]} />
    </SectionLayout>
  );
}
