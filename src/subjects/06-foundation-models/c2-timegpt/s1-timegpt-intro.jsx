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

function APICapabilityGrid() {
  const caps = [
    { title: 'Point Forecasting', desc: 'Zero-shot multi-step forecasts for any frequency — hourly, daily, weekly, monthly.' },
    { title: 'Prediction Intervals', desc: 'Quantile forecasts (P10–P90) and confidence intervals from a single API call.' },
    { title: 'Anomaly Detection', desc: 'Detects anomalous observations by comparing actuals to model expectations.' },
    { title: 'Exogenous Variables', desc: 'Include future-known covariates (holidays, promotions) to improve accuracy.' },
    { title: 'Cross-Validation', desc: 'Rolling-window CV for offline model evaluation without additional training.' },
    { title: 'Fine-Tuning', desc: 'Domain-specific adaptation using your own time series data (paid tier).' },
  ];
  return (
    <div className="my-6 grid grid-cols-2 md:grid-cols-3 gap-3">
      {caps.map(c => (
        <div key={c.title} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm font-semibold text-purple-800 mb-1">{c.title}</p>
          <p className="text-xs text-purple-700">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

const timeGPTCode = `# pip install nixtla
from nixtla import NixtlaClient
import pandas as pd
import numpy as np

client = NixtlaClient(api_key='YOUR_NIXTLA_API_KEY')

# ── 1. Basic zero-shot forecast ───────────────────────────────────────────
np.random.seed(42)
T = 200
dates = pd.date_range('2021-01-01', periods=T, freq='D')
t = np.arange(T)
y = 100 + 0.1*t + 10*np.sin(2*np.pi*t/7) + 2*np.random.randn(T)
df = pd.DataFrame({'unique_id': 'demo', 'ds': dates, 'y': y})

forecast = client.forecast(df, h=14, freq='D')
print(forecast)
# unique_id  ds          TimeGPT
# demo       2021-07-21  108.32  ...

# ── 2. Prediction intervals ────────────────────────────────────────────────
forecast_pi = client.forecast(df, h=14, freq='D', level=[80, 90, 95])
print(forecast_pi.columns.tolist())
# ['unique_id', 'ds', 'TimeGPT',
#  'TimeGPT-lo-80', 'TimeGPT-hi-80',
#  'TimeGPT-lo-90', 'TimeGPT-hi-90', ...]

# ── 3. With exogenous (future-known) variables ────────────────────────────
df['is_weekend'] = (pd.DatetimeIndex(df['ds']).dayofweek >= 5).astype(float)

future_dates = pd.date_range(dates[-1] + pd.Timedelta('1D'), periods=14, freq='D')
future_df = pd.DataFrame({
    'unique_id': 'demo',
    'ds': future_dates,
    'is_weekend': (pd.DatetimeIndex(future_dates).dayofweek >= 5).astype(float),
})

forecast_exog = client.forecast(df, h=14, freq='D', X_df=future_df, level=[90])
print(forecast_exog.head())

# ── 4. Panel (multi-series) forecast ──────────────────────────────────────
panel = pd.concat([
    pd.DataFrame({
        'unique_id': f'series_{i}',
        'ds': pd.date_range('2022-01-01', periods=52, freq='W'),
        'y': 50 + 10*i + 5*np.sin(2*np.pi*np.arange(52)/52) + np.random.randn(52),
    })
    for i in range(10)
])

panel_forecast = client.forecast(panel, h=8, freq='W')
print(f"Panel forecast shape: {panel_forecast.shape}")   # (80, 3)

# ── 5. Anomaly detection ──────────────────────────────────────────────────
df_anom = df.copy()
df_anom.loc[100, 'y'] = 500.0   # inject spike

anomalies = client.detect_anomalies(df_anom, freq='D')
flagged = anomalies[anomalies['anomaly'] == 1]
print(flagged[['ds', 'y', 'TimeGPT', 'anomaly']])

# ── 6. Cross-validation ────────────────────────────────────────────────────
cv = client.cross_validation(df, h=14, freq='D', n_windows=3, step_size=14)
actuals  = cv['y'].values
preds    = cv['TimeGPT'].values
mae_val  = np.mean(np.abs(preds - actuals))
print(f"CV MAE: {mae_val:.3f}")
`;

export default function TimeGPTIntroSection() {
  return (
    <SectionLayout
      title="TimeGPT: Zero-Shot Forecasting"
      difficulty="intermediate"
      readingTime={12}
    >
      <p className="text-gray-700 leading-relaxed">
        TimeGPT (Garza & Mergenthaler-Canseco, 2023) is the first commercially
        available foundation model for time series forecasting. Developed by
        Nixtla, it was pre-trained on a proprietary corpus of over{' '}
        <strong>100 billion time points</strong> from diverse domains, enabling
        zero-shot forecasting on any series via a simple REST API — no training
        required.
      </p>

      <DefinitionBlock title="TimeGPT Architecture">
        TimeGPT is a Transformer-based encoder-decoder. The encoder processes
        the historical context window, and the decoder generates the multi-step
        forecast. Unlike domain-specific DL models, TimeGPT's weights are fixed
        at deployment — users access it through an API and never need to
        train or fine-tune (unless they choose to).
      </DefinitionBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">API Capabilities</h2>
      <APICapabilityGrid />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        How TimeGPT Generates Forecasts
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Given an input context{' '}
        <InlineMath math="(x_{t-L}, \dots, x_t)" />, TimeGPT normalizes the
        sequence to remove scale effects (similar to RevIN), encodes it via
        multi-head attention, and decodes a multi-step forecast. The
        normalization is applied and reversed automatically, allowing the model
        to generalize across series with very different magnitudes.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        Because TimeGPT was pre-trained on diverse domains, it implicitly
        recognizes common patterns without being told the domain: daily
        seasonality in energy data, weekly retail cycles, monthly economic
        trends.
      </p>

      <TheoremBlock title="Prediction Intervals via Conformal Prediction">
        <p>
          TimeGPT's prediction intervals use <strong>conformal prediction</strong>
          rather than learned quantile outputs. Given a calibration set of
          residuals, conformal prediction constructs intervals with a guaranteed
          coverage of at least <InlineMath math="1 - \alpha" /> under
          exchangeability:
        </p>
        <BlockMath math="P\!\bigl(y_{t+h} \in [\hat{y}_{t+h} - q_{1-\alpha},\; \hat{y}_{t+h} + q_{1-\alpha}]\bigr) \geq 1 - \alpha" />
        <p className="text-sm mt-2">
          where <InlineMath math="q_{1-\alpha}" /> is the{' '}
          <InlineMath math="(1-\alpha)" />-quantile of calibration residuals.
          This provides distribution-free coverage guarantees valid regardless
          of the underlying data distribution.
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Exogenous Variables
      </h2>
      <p className="text-gray-700 leading-relaxed">
        TimeGPT accepts future-known covariates via a separate{' '}
        <code>X_df</code> argument. The model conditions on these covariates
        during decoding, similarly to TFT's known-future covariate pathway.
        Supported inputs:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 text-sm">
        <li><strong>Numeric future covariates:</strong> promotions, prices, event flags</li>
        <li><strong>Calendar features:</strong> auto-generated from the frequency (day-of-week, etc.)</li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        Static series-level attributes (e.g., category, region) are not yet
        natively supported as inputs — use fine-tuning for strong domain-specific
        adjustments.
      </p>

      <ExampleBlock title="When TimeGPT Is a Good First Choice">
        <p className="text-sm text-gray-700">
          TimeGPT excels at: quick prototyping without infrastructure setup,
          cold-start series with no historical data, diverse portfolios with
          varying frequencies, and scenarios where model training is impractical
          (data privacy constraints, lack of ML engineering resources). It
          consistently outperforms per-series ARIMA fitting while being faster
          to deploy by orders of magnitude.
        </p>
      </ExampleBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Full SDK Example
      </h2>
      <PythonCode code={timeGPTCode} />

      <WarningBlock title="API Key and Token Consumption">
        TimeGPT requires a Nixtla API key. Each request consumes tokens
        proportional to the number of series, context length, and horizon.
        To reduce cost: (1) batch all series in a single panel DataFrame
        rather than per-series calls, (2) set{' '}
        <code>add_history=False</code> to skip fitted-value computation, and
        (3) reduce context length via the <code>input_size</code> parameter
        if the series have short memory.
      </WarningBlock>

      <NoteBlock title="TimeGPT vs. Open-Source Alternatives">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li><strong>TimeGPT:</strong> easiest API, managed infra, anomaly detection, fine-tuning — but has API cost and data leaves your environment.</li>
          <li><strong>Chronos (Amazon):</strong> open-source, runs locally, probabilistic, free — but slower on CPU and no covariate support.</li>
          <li><strong>TimesFM (Google):</strong> open-source, point forecast only, very fast — but no intervals natively.</li>
          <li>For data-sensitive applications (healthcare, finance), prefer local open-source models.</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Garza, A., & Mergenthaler-Canseco, M.', year: 2023, title: 'TimeGPT-1', venue: 'arXiv' },
        { author: 'Angelopoulos, A. N., & Bates, S.', year: 2023, title: 'Conformal Risk Control', venue: 'ICLR' },
        { author: 'Kim, T., et al.', year: 2022, title: 'Reversible Instance Normalization for Accurate Time-Series Forecasting against Distribution Shift', venue: 'ICLR' },
      ]} />
    </SectionLayout>
  );
}
