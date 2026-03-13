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
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';

const USE_CASES = [
  { domain: 'Retail Demand',   zeroShot: 78, finetuned: 85, classical: 68 },
  { domain: 'Electricity',     zeroShot: 82, finetuned: 86, classical: 80 },
  { domain: 'Renewables',      zeroShot: 74, finetuned: 80, classical: 65 },
  { domain: 'Financials',      zeroShot: 55, finetuned: 59, classical: 53 },
  { domain: 'Operations Anom', zeroShot: 76, finetuned: 82, classical: 60 },
];

const PIPELINE_STEPS = [
  { step: 'Load SKU data',      time: 0.5 },
  { step: 'Preprocess / pivot', time: 1.2 },
  { step: 'API batch forecast', time: 8.4 },
  { step: 'Post-process',       time: 0.3 },
  { step: 'Write to DB',        time: 0.6 },
];

const demandPipelineCode = `"""
End-to-end demand forecasting pipeline with TimeGPT.
Forecasts 500 retail SKUs 28 days ahead.
"""
from nixtla import NixtlaClient
import pandas as pd
import numpy as np

client = NixtlaClient(api_key="YOUR_NIXTLA_API_KEY")

# ── 1. Load & validate ────────────────────────────────────────────────────────
df = pd.read_parquet("sku_daily_sales.parquet")
# Ensure schema: unique_id (SKU), ds (date), y (units sold)
assert {"unique_id","ds","y"}.issubset(df.columns)
df["ds"] = pd.to_datetime(df["ds"])
df = df.sort_values(["unique_id","ds"])

# ── 2. Exogenous features: price, promotion flag ──────────────────────────────
exog = pd.read_parquet("sku_exog.parquet")   # same unique_id/ds keys
# columns: price_index, is_promo (future values required for horizon)
FUTURE_EXOG_COLS = ["price_index", "is_promo"]

# ── 3. Batch forecast: 500 SKUs, horizon=28 days ─────────────────────────────
forecast_df = client.forecast(
    df=df,
    X_df=exog,
    h=28,
    freq="D",
    time_col="ds",
    target_col="y",
    model="timegpt-1",
    add_history=True,           # include fitted values in response
    level=[80, 95],             # prediction intervals
)

# ── 4. Anomaly detection: flag residuals > 3σ ───────────────────────────────
anomalies = client.detect_anomalies(
    df=df,
    freq="D",
    time_col="ds",
    target_col="y",
    model="timegpt-1",
    level=99,
)
flagged = anomalies[anomalies["anomaly"] == True]
print(f"Anomalies found: {len(flagged)}")

# ── 5. Multi-series cross-validation ─────────────────────────────────────────
cv = client.cross_validation(
    df=df,
    h=28,
    n_windows=4,
    freq="D",
    time_col="ds",
    target_col="y",
    model="timegpt-1",
)
mae = (cv["y"] - cv["TimeGPT"]).abs()
print(f"CV MAE  mean={mae.mean():.2f}  p50={mae.median():.2f}  p95={mae.quantile(0.95):.2f}")

# ── 6. Write forecast to database ─────────────────────────────────────────────
forecast_df.to_parquet("forecasts/demand_forecast.parquet", index=False)
print(f"Wrote {len(forecast_df)} rows for {forecast_df['unique_id'].nunique()} SKUs")
`;

const microserviceCode = `"""
FastAPI microservice wrapping TimeGPT for on-demand forecasting.
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from nixtla import NixtlaClient
import pandas as pd
from functools import lru_cache

app = FastAPI(title="Forecasting Service")

@lru_cache(maxsize=1)
def get_client():
    return NixtlaClient(api_key="YOUR_NIXTLA_API_KEY")

class ForecastRequest(BaseModel):
    series: list[dict]   # [{unique_id, ds, y}, ...]
    horizon: int = 14
    freq: str = "D"
    level: list[int] = [80, 95]

class ForecastResponse(BaseModel):
    forecasts: list[dict]
    n_series: int

@app.post("/forecast", response_model=ForecastResponse)
async def forecast(req: ForecastRequest):
    if req.horizon > 60:
        raise HTTPException(400, "horizon must be <= 60")
    df = pd.DataFrame(req.series)
    df["ds"] = pd.to_datetime(df["ds"])
    client = get_client()
    result = client.forecast(
        df=df,
        h=req.horizon,
        freq=req.freq,
        time_col="ds",
        target_col="y",
        level=req.level,
    )
    return ForecastResponse(
        forecasts=result.to_dict(orient="records"),
        n_series=result["unique_id"].nunique(),
    )
`;

export default function TimeGPTApplications() {
  const [activeCase, setActiveCase] = useState('Retail Demand');
  const selected = USE_CASES.find((u) => u.domain === activeCase);

  return (
    <SectionLayout title="TimeGPT Real-World Applications" difficulty="intermediate" readingTime={12}>
      <p>
        TimeGPT's zero-shot API unlocks practical forecasting workflows that would
        otherwise require months of model development. This section walks through
        five real-world application domains — from retail demand to anomaly detection
        in operations — and closes with a production microservice pattern.
      </p>

      <h2>Application Domains Overview</h2>

      <p>
        The bar chart below compares relative accuracy (higher = better) across
        domains for zero-shot TimeGPT, fine-tuned TimeGPT, and classical statistical
        methods. Select a domain for detail.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        {USE_CASES.map((u) => (
          <button
            key={u.domain}
            onClick={() => setActiveCase(u.domain)}
            style={{
              margin: '0.2rem', padding: '0.25rem 0.7rem', borderRadius: '4px', cursor: 'pointer',
              border: '1px solid #6366f1',
              background: activeCase === u.domain ? '#6366f1' : '#fff',
              color: activeCase === u.domain ? '#fff' : '#6366f1',
              fontSize: '0.85rem',
            }}
          >
            {u.domain}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={USE_CASES} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="domain" tick={{ fontSize: 11 }} />
          <YAxis domain={[40, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Bar dataKey="zeroShot"  name="Zero-Shot"  fill="#6366f1" />
          <Bar dataKey="finetuned" name="Fine-Tuned"  fill="#22c55e" />
          <Bar dataKey="classical" name="Classical"   fill="#94a3b8" />
        </BarChart>
      </ResponsiveContainer>

      {selected && (
        <div style={{
          background: '#eef2ff', border: '1px solid #6366f1',
          borderRadius: '6px', padding: '0.75rem 1rem', margin: '1rem 0',
        }}>
          <strong>{selected.domain}:</strong>{' '}
          Zero-shot score {selected.zeroShot}, fine-tuned {selected.finetuned},
          classical {selected.classical}.
        </div>
      )}

      <h2>1. Retail Demand Forecasting</h2>

      <DefinitionBlock term="SKU-Level Zero-Shot Forecasting">
        Modern retailers manage hundreds of thousands of SKUs. Per-SKU model fitting is
        computationally intractable. TimeGPT's zero-shot API accepts batches of thousands
        of series simultaneously, producing probabilistic forecasts with prediction
        intervals — enabling safety-stock calculations without additional modeling.
      </DefinitionBlock>

      <ExampleBlock title="Typical Retail Pipeline">
        <ol>
          <li>Load 7-day rolling sales per SKU from a data warehouse.</li>
          <li>Add exogenous features: price index, promotional flags (current + future horizon).</li>
          <li>Call <code>client.forecast(h=28, level=[80,95])</code> for all SKUs in one request.</li>
          <li>Compute safety stock: <InlineMath>{`SS = z_{\\alpha} \\cdot \\sigma_{\\text{forecast}} \\cdot \\sqrt{LT}`}</InlineMath> where LT is lead time.</li>
          <li>Write reorder recommendations to ERP system.</li>
        </ol>
      </ExampleBlock>

      <h2>2. Energy Forecasting</h2>

      <p>
        Electricity load and renewable generation (solar, wind) share common challenges:
        strong diurnal and weekly seasonality, weather dependency, and the need for
        intraday probabilistic forecasts to manage grid balancing.
      </p>

      <NoteBlock title="Energy-Specific Considerations">
        <ul>
          <li>Include weather exogenous variables (temperature, cloud cover, wind speed) for best results.</li>
          <li>Probabilistic intervals are critical for battery dispatch optimization — use <code>level=[10,25,50,75,90]</code>.</li>
          <li>Renewable generation has hard bounds [0, capacity]; consider clipping forecasts post-processing.</li>
        </ul>
      </NoteBlock>

      <h2>3. Financial Time Series</h2>

      <WarningBlock title="Limitations for Financial Forecasting">
        TimeGPT (and all foundation models) are trained primarily on economic and
        operational time series. Financial prices are much closer to martingales —
        future prices are nearly unpredictable from past prices alone. Zero-shot
        performance on equity prices or FX rates is typically no better than naïve
        random walk. Do not use TimeGPT for financial return prediction without
        strong exogenous features and careful out-of-sample validation.
      </WarningBlock>

      <p>
        More suitable financial applications include: revenue forecasting (highly
        structured), subscriber/user counts (smooth trends), and macro indicators
        (GDP, CPI) which have strong autocorrelation structures.
      </p>

      <h2>4. Anomaly Detection in Operations</h2>

      <p>
        TimeGPT supports anomaly detection by comparing actual values against forecast
        prediction intervals. A point outside the <InlineMath>{`100(1-\\alpha)\\%`}</InlineMath> interval
        is flagged as anomalous:
      </p>

      <BlockMath>{`\\text{anomaly}_t = \\mathbf{1}\\left[y_t \\notin [\\hat{y}_t^{(\\alpha/2)},\\, \\hat{y}_t^{(1-\\alpha/2)}]\\right]`}</BlockMath>

      <ExampleBlock title="Operations Use Cases">
        <ul>
          <li>Server latency spikes in SRE/observability pipelines.</li>
          <li>Inventory shrinkage detection (actual vs expected depletion).</li>
          <li>Manufacturing defect rate anomalies.</li>
          <li>Payment fraud signals: unusual transaction volume deviations.</li>
        </ul>
      </ExampleBlock>

      <h2>5. Multi-Series Batch Pipeline</h2>

      <p>
        A single <code>client.forecast()</code> call handles thousands of series.
        Estimated timing for 500 daily SKUs with 28-day horizon:
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={PIPELINE_STEPS}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 110, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" unit="s" />
          <YAxis type="category" dataKey="step" tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => `${v}s`} />
          <Bar dataKey="time" name="Time (s)" fill="#0ea5e9" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <h2>Building a Forecasting Microservice</h2>

      <p>
        For production systems, wrap the Nixtla client in a lightweight FastAPI
        service that validates inputs, enforces horizon limits, and caches the
        client connection:
      </p>

      <PythonCode code={microserviceCode} title="FastAPI Forecasting Microservice with TimeGPT" />

      <h2>End-to-End Demand Pipeline</h2>

      <PythonCode code={demandPipelineCode} title="End-to-End Retail Demand Forecasting Pipeline" />

      <ReferenceList
        references={[
          {
            title: 'TimeGPT-1: The First Foundation Model for Time Series Forecasting',
            authors: 'Garza, Challu, Mergenthaler-Canseco',
            year: 2023,
            venue: 'arXiv:2310.03589',
          },
          {
            title: 'Nixtla Documentation: TimeGPT Use Cases',
            authors: 'Nixtla Engineering Team',
            year: 2024,
            venue: 'docs.nixtla.io',
          },
          {
            title: 'Probabilistic Forecasting in Electricity Markets',
            authors: 'Hong & Fan',
            year: 2016,
            venue: 'International Journal of Forecasting',
          },
        ]}
      />
    </SectionLayout>
  );
}
