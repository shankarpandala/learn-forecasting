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

function ApplicationCard({ title, domain, description, covariates, horizon }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase">{domain}</span>
          <p className="font-medium text-gray-800">{title}</p>
        </div>
        <span className="text-gray-400 text-lg">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="p-3 border-t border-gray-200 text-sm text-gray-700 space-y-2">
          <p>{description}</p>
          <div className="flex gap-4 text-xs">
            <div><span className="font-semibold text-gray-500">Typical horizon:</span> {horizon}</div>
            <div><span className="font-semibold text-gray-500">Key covariates:</span> {covariates}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const applicationsCode = `from nixtla import NixtlaClient
import pandas as pd
import numpy as np

client = NixtlaClient(api_key='YOUR_NIXTLA_API_KEY')
np.random.seed(42)

# ═══════════════════════════════════════════════════════════════════════════
# APPLICATION 1: Demand Forecasting (Retail)
# ═══════════════════════════════════════════════════════════════════════════
n_skus, T = 50, 52
demand_records = []
for sku in range(n_skus):
    dates   = pd.date_range('2022-01-01', periods=T, freq='W')
    base    = 200 + 100 * (sku % 5)
    trend   = 0.5 * np.arange(T)
    seasonal = 30 * np.sin(2 * np.pi * np.arange(T) / 52)
    promo   = np.random.binomial(1, 0.1, T).astype(float)
    y       = base + trend + seasonal + 50 * promo + 10 * np.random.randn(T)
    y       = np.maximum(y, 0)  # demand can't be negative
    for d, v, p in zip(dates, y, promo):
        demand_records.append({
            'unique_id': f'SKU_{sku:03d}',
            'ds': d, 'y': float(v),
            'promotion': p,
        })

demand_df = pd.DataFrame(demand_records)

# Future promotion schedule (known in advance)
last_date   = demand_df['ds'].max()
future_dates = pd.date_range(last_date + pd.Timedelta('7D'), periods=12, freq='W')
future_promo = pd.DataFrame([
    {'unique_id': f'SKU_{sku:03d}', 'ds': d, 'promotion': float(sku % 7 == 0)}
    for sku in range(n_skus) for d in future_dates
])

demand_forecast = client.forecast(
    demand_df, h=12, freq='W',
    X_df=future_promo,
    level=[80, 95],     # safety stock planning needs wide intervals
)
print(f"Demand forecast: {demand_forecast.shape}")
print(demand_forecast.head())

# ═══════════════════════════════════════════════════════════════════════════
# APPLICATION 2: Energy Load Forecasting
# ═══════════════════════════════════════════════════════════════════════════
T_energy = 168 * 4  # 4 weeks of hourly data
energy_dates = pd.date_range('2023-06-01', periods=T_energy, freq='h')
hour = pd.DatetimeIndex(energy_dates).hour
dow  = pd.DatetimeIndex(energy_dates).dayofweek
load = (
    5000
    + 1000 * np.sin(2 * np.pi * hour / 24)       # daily cycle
    + 300  * (dow < 5).astype(float)              # weekday effect
    + 50   * np.random.randn(T_energy)
)
energy_df = pd.DataFrame({'unique_id': 'grid_zone_A', 'ds': energy_dates, 'y': load})
energy_df['is_weekend'] = (dow >= 5).astype(float)

# 48-hour ahead forecast with prediction intervals
future_energy_dates = pd.date_range(energy_dates[-1] + pd.Timedelta('1h'), periods=48, freq='h')
future_energy = pd.DataFrame({
    'unique_id': 'grid_zone_A',
    'ds': future_energy_dates,
    'is_weekend': (pd.DatetimeIndex(future_energy_dates).dayofweek >= 5).astype(float),
})

energy_forecast = client.forecast(
    energy_df, h=48, freq='h',
    X_df=future_energy,
    level=[80, 95],
)
print(f"\\nEnergy forecast: {energy_forecast.shape}")

# ═══════════════════════════════════════════════════════════════════════════
# APPLICATION 3: Anomaly Detection for Operational Monitoring
# ═══════════════════════════════════════════════════════════════════════════
# Simulate server response time with injected anomalies
T_ops = 500
ops_dates = pd.date_range('2024-01-01', periods=T_ops, freq='10min')
rt = 200 + 20 * np.sin(2 * np.pi * np.arange(T_ops) / 144) + 5 * np.random.randn(T_ops)
# Inject anomalies: spike at t=200, step change at t=350
rt[200:205] += 500     # latency spike
rt[350:]    += 100     # gradual degradation

ops_df = pd.DataFrame({'unique_id': 'api_latency', 'ds': ops_dates, 'y': rt})

anomalies = client.detect_anomalies(ops_df, freq='10min')
n_anomalies = anomalies['anomaly'].sum()
print(f"\\nDetected {n_anomalies} anomalous intervals out of {T_ops}")
print(anomalies[anomalies['anomaly'] == 1][['ds', 'y', 'TimeGPT']].head())

# ═══════════════════════════════════════════════════════════════════════════
# APPLICATION 4: Cross-Series Learning — Cold Start
# ═══════════════════════════════════════════════════════════════════════════
# New store opened 4 weeks ago — too short for local model training
new_store_dates = pd.date_range('2024-03-01', periods=28, freq='D')
new_store_y     = 300 + 50 * np.sin(2 * np.pi * np.arange(28) / 7) + 10 * np.random.randn(28)
new_store_df    = pd.DataFrame({
    'unique_id': 'new_store_999',
    'ds': new_store_dates,
    'y': new_store_y,
})

# TimeGPT handles cold-start natively via its pre-trained knowledge
cold_start_forecast = client.forecast(new_store_df, h=14, freq='D', level=[90])
print(f"\\nCold-start forecast for new store (only 28 days of history):")
print(cold_start_forecast)
`;

export default function TimeGPTApplicationsSection() {
  return (
    <SectionLayout
      title="TimeGPT Applications"
      difficulty="intermediate"
      readingTime={12}
    >
      <p className="text-gray-700 leading-relaxed">
        TimeGPT's zero-shot capability makes it immediately useful across a wide
        range of domains. This section demonstrates four practical applications:
        retail demand forecasting, energy load forecasting, anomaly detection,
        and cold-start forecasting for new series — all using the Nixtla SDK.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-3 text-gray-800">
        Use Case Overview
      </h2>
      <div className="space-y-2">
        <ApplicationCard
          title="Retail Demand Forecasting"
          domain="Supply Chain"
          description="Forecast weekly SKU-level demand across a product portfolio. TimeGPT conditions on planned promotions as future covariates, improving accuracy during promotional periods. Prediction intervals drive safety stock calculations."
          horizon="4–13 weeks"
          covariates="Promotions, holidays, price changes"
        />
        <ApplicationCard
          title="Energy Load Forecasting"
          domain="Utilities"
          description="Forecast hourly electricity load for grid planning. TimeGPT captures daily and weekly seasonality patterns. 48-hour ahead forecasts with prediction intervals support dispatch optimization and reserve margins."
          horizon="24–168 hours"
          covariates="Hour-of-day, day-of-week, temperature, weekend flag"
        />
        <ApplicationCard
          title="Financial Time Series"
          domain="Finance"
          description="Forecast volatility or volume series (not raw prices — which are near-random walks). TimeGPT is useful for volume forecasting (order routing), liquidity prediction, and trading session demand estimation."
          horizon="1–30 days"
          covariates="Calendar effects, earnings dates, macro events"
        />
        <ApplicationCard
          title="Anomaly Detection / Monitoring"
          domain="Operations"
          description="Compare real-time metrics (latency, CPU, throughput) against TimeGPT's expected values. Deviations beyond prediction interval bounds flag anomalies. The foundation model provides a strong expected-value baseline without domain-specific training."
          horizon="N/A (detection)"
          covariates="Historical context window"
        />
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Cross-Series Learning: The Cold-Start Advantage
      </h2>
      <p className="text-gray-700 leading-relaxed">
        One of TimeGPT's most practical advantages is handling <em>cold-start</em>{' '}
        scenarios: new series with very short history. A traditional model
        requires at minimum 2× the seasonal period to estimate parameters
        (e.g., 24+ months for annual seasonality). TimeGPT's pre-trained
        knowledge allows reasonable forecasts from as few as 10–20 observations,
        because it has internalized seasonal and trend shapes from billions of
        training examples.
      </p>

      <TheoremBlock title="Anomaly Detection via Prediction Intervals">
        <p>
          TimeGPT's anomaly detection works by comparing the observed value{' '}
          <InlineMath math="y_t" /> against the model's predictive interval{' '}
          <InlineMath math="[\hat{y}_t^{(lo)}, \hat{y}_t^{(hi)}]" /> at a
          chosen confidence level. An observation is flagged as anomalous when:
        </p>
        <BlockMath math="y_t \notin [\hat{y}_t^{(lo)}, \hat{y}_t^{(hi)}]" />
        <p className="text-sm mt-2">
          This is a principled threshold because the interval is calibrated via
          conformal prediction, so the false positive rate is bounded by the
          chosen <InlineMath math="\alpha" /> level. Lower <InlineMath math="\alpha" />{' '}
          (wider interval) = fewer false alarms; higher{' '}
          <InlineMath math="\alpha" /> (narrower interval) = more sensitive
          detection.
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Code: Four Applications
      </h2>
      <PythonCode code={applicationsCode} />

      <ExampleBlock title="Financial Forecasting Caveats">
        <p className="text-sm text-gray-700">
          TimeGPT can forecast financial time series (volume, volatility,
          spreads) but <strong>should not</strong> be used to forecast raw
          prices for trading decisions — prices are near-random walks and any
          apparent forecasting skill is likely spurious. Instead, use TimeGPT
          for operationally predictable financial quantities: trading volumes
          (highly seasonal), option expiry demand, institutional order flow.
          Always backtest thoroughly before live deployment.
        </p>
      </ExampleBlock>

      <WarningBlock title="Anomaly Detection Requires Stable Context">
        TimeGPT's anomaly detection assumes that the historical context window
        is itself largely anomaly-free. If the context contains many anomalies,
        the model's baseline expectation will be skewed, leading to missed
        detections or excessive false positives. Pre-clean your context window
        before feeding it to the anomaly detection API, or use the{' '}
        <code>clean_ex_first=True</code> option if available.
      </WarningBlock>

      <NoteBlock title="Building a Production Monitoring Pipeline">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li>Ingest new data every interval (hourly, daily) and append to a rolling context window of 200–500 points.</li>
          <li>Call <code>client.detect_anomalies()</code> on each new batch.</li>
          <li>Send alerts when anomaly flag == 1 AND the deviation exceeds a domain-specific threshold (e.g., {'>'} 3σ above expected).</li>
          <li>Avoid calling per-observation — batch recent time steps together to reduce API token consumption.</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Garza, A., & Mergenthaler-Canseco, M.', year: 2023, title: 'TimeGPT-1', venue: 'arXiv' },
        { author: 'Angelopoulos, A. N., & Bates, S.', year: 2023, title: 'Conformal Risk Control', venue: 'ICLR' },
        { author: 'Makridakis, S., et al.', year: 2022, title: 'M5 accuracy competition: Results, findings and conclusions', venue: 'International Journal of Forecasting' },
      ]} />
    </SectionLayout>
  );
}
