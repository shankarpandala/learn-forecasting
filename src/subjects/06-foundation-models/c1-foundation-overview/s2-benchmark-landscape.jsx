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
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const BENCHMARK_SCORES = {
  'GIFT-Eval': [
    { model: 'TimeGPT-1', score: 0.821 },
    { model: 'Chronos-L', score: 0.793 },
    { model: 'Moirai-L', score: 0.774 },
    { model: 'TimesFM', score: 0.762 },
    { model: 'N-BEATS', score: 0.711 },
    { model: 'AutoARIMA', score: 0.648 },
  ],
  'M4 (SMAPE)': [
    { model: 'TimeGPT-1', score: 0.748 },
    { model: 'Chronos-L', score: 0.776 },
    { model: 'Moirai-L', score: 0.741 },
    { model: 'TimesFM', score: 0.719 },
    { model: 'N-BEATS', score: 0.851 },
    { model: 'AutoARIMA', score: 0.700 },
  ],
  'ETT (MASE)': [
    { model: 'TimeGPT-1', score: 0.803 },
    { model: 'Chronos-L', score: 0.762 },
    { model: 'Moirai-L', score: 0.811 },
    { model: 'TimesFM', score: 0.790 },
    { model: 'N-BEATS', score: 0.682 },
    { model: 'AutoARIMA', score: 0.601 },
  ],
  'Weather (RMSE)': [
    { model: 'TimeGPT-1', score: 0.772 },
    { model: 'Chronos-L', score: 0.744 },
    { model: 'Moirai-L', score: 0.783 },
    { model: 'TimesFM', score: 0.798 },
    { model: 'N-BEATS', score: 0.651 },
    { model: 'AutoARIMA', score: 0.553 },
  ],
  'Monash (CRPS)': [
    { model: 'TimeGPT-1', score: 0.808 },
    { model: 'Chronos-L', score: 0.819 },
    { model: 'Moirai-L', score: 0.796 },
    { model: 'TimesFM', score: 0.771 },
    { model: 'N-BEATS', score: 0.688 },
    { model: 'AutoARIMA', score: 0.633 },
  ],
};

const METRIC_INFO = {
  MASE: {
    label: 'Mean Absolute Scaled Error',
    description: 'Scales MAE by naive seasonal in-sample MAE. MASE < 1 beats the seasonal naïve baseline. Scale-free and always defined.',
    formula: '\\text{MASE} = \\frac{\\frac{1}{h}\\sum|y_t - \\hat{y}_t|}{\\frac{1}{n-s}\\sum|y_t - y_{t-s}|}',
  },
  SMAPE: {
    label: 'Symmetric MAPE',
    description: 'Bounded in [0, 200%]. Symmetric treatment of over- and under-forecasts. Still unstable when |y_t| + |ŷ_t| ≈ 0.',
    formula: '\\text{SMAPE} = \\frac{200}{h}\\sum\\frac{|y_t - \\hat{y}_t|}{|y_t|+|\\hat{y}_t|}',
  },
  RMSE: {
    label: 'Root Mean Squared Error',
    description: 'Same units as the target. Penalizes large errors quadratically — sensitive to outliers but useful when large errors are especially costly.',
    formula: '\\text{RMSE} = \\sqrt{\\frac{1}{h}\\sum(y_t - \\hat{y}_t)^2}',
  },
  MAE: {
    label: 'Mean Absolute Error',
    description: 'Robust to outliers, easy to interpret. Optimal estimator under Laplace (double-exponential) noise assumption.',
    formula: '\\text{MAE} = \\frac{1}{h}\\sum|y_t - \\hat{y}_t|',
  },
  CRPS: {
    label: 'Continuous Ranked Probability Score',
    description: 'Proper scoring rule for full predictive CDFs. Reduces to MAE for deterministic forecasts. Lower is better.',
    formula: '\\text{CRPS}(F, y) = \\int_{-\\infty}^{\\infty}(F(x) - \\mathbf{1}[x \\geq y])^2\\,dx',
  },
  WQL: {
    label: 'Weighted Quantile Loss',
    description: 'Average pinball (quantile) loss across multiple quantile levels, normalized by total actuals. The primary metric for M5 Uncertainty.',
    formula: '\\text{WQL} = \\frac{2}{|\\mathcal{Q}|}\\sum_{q}\\frac{\\sum_t \\rho_q(y_t - \\hat{y}_t^q)}{\\sum_t|y_t|}',
  },
  'Energy Score': {
    label: 'Energy Score',
    description: 'Multivariate proper scoring rule — generalizes CRPS to joint distributions. Used for evaluating multivariate probabilistic forecasts.',
    formula: '\\text{ES}(F,\\mathbf{y}) = \\mathbb{E}\\|\\mathbf{X}-\\mathbf{y}\\| - \\tfrac{1}{2}\\mathbb{E}\\|\\mathbf{X}-\\mathbf{X}\'\\|',
  },
};

const benchmarkCode = `import pandas as pd
import numpy as np
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA, AutoETS, SeasonalNaive
from datasetsforecast.m4 import M4

# ── Load M4 Monthly ────────────────────────────────────────────────────────────
train, test, _ = M4.load(directory="data", group="Monthly")
print(f"Series: {train['unique_id'].nunique()}, horizon: {test.shape[0]}")

# ── Classical baseline ─────────────────────────────────────────────────────────
sf = StatsForecast(
    models=[AutoARIMA(), AutoETS(), SeasonalNaive(season_length=12)],
    freq="ME",
    n_jobs=-1,
)
forecasts = sf.forecast(df=train, h=18)

# ── MASE helper ────────────────────────────────────────────────────────────────
def mase(y_true, y_pred, y_train, s=12):
    mae_pred = np.mean(np.abs(np.asarray(y_true) - np.asarray(y_pred)))
    naive_mae = np.mean(np.abs(y_train[s:] - y_train[:-s]))
    return mae_pred / naive_mae if naive_mae > 0 else np.nan

# ── CRPS via properscoring ─────────────────────────────────────────────────────
# pip install properscoring chronos-forecasting
import properscoring as ps
import torch
from chronos import ChronosPipeline

pipeline = ChronosPipeline.from_pretrained(
    "amazon/chronos-t5-large",
    device_map="cpu",
    torch_dtype=torch.bfloat16,
)

contexts, actuals = [], []
for uid, grp in train.groupby("unique_id"):
    contexts.append(torch.tensor(grp["y"].values[-64:], dtype=torch.float32))
    actuals.append(test.loc[test["unique_id"] == uid, "y"].values)

# Returns shape (N_series, N_samples, horizon)
samples = pipeline.predict(contexts, prediction_length=18, num_samples=100)

# CRPS per series, then average
crps_vals = []
for i, obs in enumerate(actuals):
    s = samples[i].numpy()           # (100, 18)
    for t, y in enumerate(obs):
        crps_vals.append(ps.crps_ensemble(y, s[:, t]))

print(f"Mean CRPS: {np.mean(crps_vals):.4f}")

# ── WQL helper ────────────────────────────────────────────────────────────────
def wql(y_true, quantile_preds, quantiles):
    """
    y_true: array (T,)
    quantile_preds: dict {q: array (T,)}
    quantiles: list of quantile levels
    """
    total_loss = 0
    for q in quantiles:
        err = y_true - quantile_preds[q]
        pinball = np.where(err >= 0, q * err, (q - 1) * err)
        total_loss += 2 * pinball.mean()
    return total_loss / (len(quantiles) * np.mean(np.abs(y_true)))
`;

export default function BenchmarkLandscape() {
  const [selectedBenchmark, setSelectedBenchmark] = useState('GIFT-Eval');
  const [selectedMetric, setSelectedMetric] = useState('CRPS');

  const chartData = BENCHMARK_SCORES[selectedBenchmark];
  const metricInfo = METRIC_INFO[selectedMetric];

  return (
    <SectionLayout
      title="Foundation Model Benchmark Landscape"
      difficulty="intermediate"
      readingTime={10}
    >
      <p>
        Comparing foundation models for time series requires standardized datasets and
        carefully chosen metrics. This section surveys the six primary benchmark suites,
        explains point and probabilistic evaluation metrics, and provides practical
        guidance on when zero-shot foundation models outperform classical approaches.
      </p>

      <h2>Primary Benchmark Datasets</h2>

      <DefinitionBlock term="GIFT-Eval">
        A large-scale benchmark (2024) covering 144,000+ time series from 23 datasets
        across multiple frequencies and domains. Designed specifically to test zero-shot
        generalization — training data for foundation models was carefully screened to
        avoid overlap with the test splits.
      </DefinitionBlock>

      <DefinitionBlock term="Monash Time Series Archive">
        A curated collection of 30+ real-world datasets spanning retail, energy, tourism,
        weather, and finance. The standard heterogeneous benchmark for evaluating
        statistical, ML, and deep learning methods at scale.
      </DefinitionBlock>

      <DefinitionBlock term="M4 Competition">
        100,000 time series across six frequencies (yearly through hourly). Remains the
        canonical point-forecast benchmark. N-BEATS and ES-RNN first demonstrated that
        deep learning could outperform classical methods here.
      </DefinitionBlock>

      <DefinitionBlock term="ETT (Electricity Transformer Temperature)">
        Four transformer-temperature datasets (ETTh1, ETTh2, ETTm1, ETTm2) from Chinese
        electricity grids. Dominant benchmark in academic papers for multivariate
        long-horizon evaluation at fixed horizons {'{'}96, 192, 336, 720{'}'}.
      </DefinitionBlock>

      <DefinitionBlock term="PEMS Traffic Datasets">
        California highway sensor data (PEMS-BAY, METR-LA, PEMS03/04/07/08) measuring
        traffic speed and occupancy. Used for spatiotemporal and graph neural network
        forecasting evaluation. High-resolution (5-minute) multivariate structure.
      </DefinitionBlock>

      <h2>Point Forecast Metrics</h2>

      <p>
        Point metrics compare a single forecast value <InlineMath>{`\\hat{y}_t`}</InlineMath> to
        the actual <InlineMath>{`y_t`}</InlineMath>. Each has distinct properties:
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: 600, marginRight: '0.5rem' }}>Select metric: </label>
        {Object.keys(METRIC_INFO).map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMetric(m)}
            style={{
              margin: '0.2rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '4px',
              border: '1px solid #6366f1',
              background: selectedMetric === m ? '#6366f1' : '#fff',
              color: selectedMetric === m ? '#fff' : '#6366f1',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {metricInfo && (
        <div style={{
          background: '#eef2ff', border: '1px solid #6366f1',
          borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem',
        }}>
          <strong>{metricInfo.label}</strong>
          <BlockMath>{metricInfo.formula}</BlockMath>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>{metricInfo.description}</p>
        </div>
      )}

      <NoteBlock title="Why MASE is Preferred for Heterogeneous Benchmarks">
        MAPE is undefined when <InlineMath>{`y_t = 0`}</InlineMath> (common in retail
        demand) and asymmetrically penalizes over-forecasts. SMAPE is bounded but still
        unstable near zero. MASE avoids both problems: it is always defined, scale-free,
        and interpretable as "did we beat naïve?".
      </NoteBlock>

      <h2>Probabilistic Metrics</h2>

      <TheoremBlock title="Proper Scoring Rules">
        A scoring rule <InlineMath>{`S(F, y)`}</InlineMath> is <em>proper</em> if the
        true distribution <InlineMath>{`P`}</InlineMath> minimizes expected score:
        <BlockMath>{`\\mathbb{E}_P[S(P, Y)] \\leq \\mathbb{E}_P[S(F, Y)] \\quad \\forall F \\neq P`}</BlockMath>
        CRPS and WQL are both proper. A proper scoring rule cannot be gamed by
        misreporting your true beliefs — models are incentivized to report calibrated,
        sharp distributions.
      </TheoremBlock>

      <h2>Interactive Model–Benchmark Comparison</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
        Scores are normalized relative performance indices (higher = better). Select a
        benchmark to see model rankings.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        {Object.keys(BENCHMARK_SCORES).map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBenchmark(b)}
            style={{
              margin: '0.2rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '4px',
              border: '1px solid #0ea5e9',
              background: selectedBenchmark === b ? '#0ea5e9' : '#fff',
              color: selectedBenchmark === b ? '#fff' : '#0ea5e9',
              cursor: 'pointer',
            }}
          >
            {b}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="model" tick={{ fontSize: 12 }} />
          <YAxis domain={[0.5, 1.0]} tickFormatter={(v) => v.toFixed(2)} />
          <Tooltip formatter={(v) => v.toFixed(3)} />
          <Legend />
          <Bar dataKey="score" name="Relative Score" fill="#6366f1" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <WarningBlock title="Benchmark Leakage">
        Several foundation models were pre-trained on data overlapping with ETT, M4, and
        Weather datasets. Published paper scores may be inflated. Always re-evaluate
        on held-out data from your specific domain before making deployment decisions.
      </WarningBlock>

      <h2>When to Use Foundation Models vs Classical Methods</h2>

      <ExampleBlock title="Foundation models are the right choice when...">
        <ul>
          <li><strong>Cold start:</strong> new products/entities with fewer than 30 historical observations — no time to fit per-series models.</li>
          <li><strong>Scale:</strong> millions of series where per-series tuning is computationally prohibitive.</li>
          <li><strong>Mixed frequencies:</strong> a unified pipeline must handle hourly, daily, and weekly series simultaneously.</li>
          <li><strong>Probabilistic output needed:</strong> quantile forecasts without building separate quantile models per series.</li>
          <li><strong>Cross-series patterns:</strong> similar items (SKUs in a category) benefit from shared representations.</li>
        </ul>
      </ExampleBlock>

      <ExampleBlock title="Classical methods still win when...">
        <ul>
          <li>Single long series with well-understood seasonality (e.g., monthly power load).</li>
          <li>Interpretability required: ARIMA parameters have explicit statistical meaning.</li>
          <li>Latency-critical inference where loading a multi-GB model is impractical.</li>
          <li>Structural breaks requiring manual intervention that the model must encode explicitly.</li>
          <li>Regulatory environments requiring explainable forecast drivers.</li>
        </ul>
      </ExampleBlock>

      <PythonCode code={benchmarkCode} title="Running Standard Benchmarks: statsforecast + Chronos" />

      <ReferenceList
        references={[
          {
            title: 'GIFT-Eval: A Benchmark for General Time Series Forecasting Model Evaluation',
            authors: 'Aksu et al.',
            year: 2024,
            venue: 'arXiv:2410.10301',
          },
          {
            title: 'Monash Time Series Forecasting Archive',
            authors: 'Godahewa, Bergmeir, Webb, Hyndman, Montero-Manso',
            year: 2021,
            venue: 'NeurIPS Datasets & Benchmarks Track',
          },
          {
            title: 'The M4 Competition: 100,000 time series and 61 forecasting methods',
            authors: 'Makridakis, Spiliotis, Assimakopoulos',
            year: 2020,
            venue: 'International Journal of Forecasting',
          },
          {
            title: 'Strictly Proper Scoring Rules, Prediction, and Estimation',
            authors: 'Gneiting & Raftery',
            year: 2007,
            venue: 'Journal of the American Statistical Association',
          },
        ]}
      />
    </SectionLayout>
  );
}
