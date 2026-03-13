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

const modelCatalog = [
  { name: 'NHITS',        category: 'MLP',         horizon: 'Long',       strengths: 'Hierarchical interpolation, parameter-efficient' },
  { name: 'NBEATS',       category: 'MLP',         horizon: 'Medium',     strengths: 'Interpretable trend/seasonality decomposition' },
  { name: 'TFT',          category: 'Transformer', horizon: 'Medium',     strengths: 'Rich covariates, quantile outputs, interpretable VSN' },
  { name: 'PatchTST',     category: 'Transformer', horizon: 'Long',       strengths: 'Patch tokenization, efficient long-horizon' },
  { name: 'LSTM',         category: 'RNN',         horizon: 'Short-Med',  strengths: 'Robust, low-data, sequential dynamics' },
  { name: 'MQRNN',        category: 'RNN',         horizon: 'Medium',     strengths: 'Parallel quantile decoding, seq2seq' },
  { name: 'TCN',          category: 'CNN',         horizon: 'Medium',     strengths: 'Dilated convolutions, fast training' },
  { name: 'DeepAR',       category: 'RNN',         horizon: 'Medium',     strengths: 'Autoregressive probabilistic, distribution output' },
  { name: 'iTransformer', category: 'Transformer', horizon: 'Long',       strengths: 'Inverted attention, multivariate correlations' },
  { name: 'TimesNet',     category: 'CNN',         horizon: 'Long',       strengths: '2D temporal convolution, seasonal patterns' },
];

function ModelCatalogTable() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'MLP', 'Transformer', 'RNN', 'CNN'];
  const filtered = filter === 'All' ? modelCatalog : modelCatalog.filter(m => m.category === filter);
  const catColor = {
    MLP: 'bg-blue-100 text-blue-800',
    Transformer: 'bg-purple-100 text-purple-800',
    RNN: 'bg-green-100 text-green-800',
    CNN: 'bg-orange-100 text-orange-800',
  };
  return (
    <div className="my-6">
      <div className="flex gap-2 mb-3 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1 rounded text-sm border transition-all ${
              filter === c
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
            }`}>
            {c}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Model</th>
              <th className="px-4 py-2 text-left text-gray-700">Type</th>
              <th className="px-4 py-2 text-left text-gray-700">Horizon</th>
              <th className="px-4 py-2 text-left text-gray-700">Key Strengths</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.name} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 font-mono font-medium text-gray-900">{m.name}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${catColor[m.category]}`}>
                    {m.category}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-600">{m.horizon}</td>
                <td className="px-4 py-2 text-gray-600">{m.strengths}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const nfCode = `# pip install neuralforecast
from neuralforecast import NeuralForecast
from neuralforecast.models import NHITS, TFT, LSTM
from neuralforecast.losses.pytorch import MAE, MQLoss
import pandas as pd
import numpy as np

# ── 1. Data format ─────────────────────────────────────────────────────────
# NeuralForecast uses long-format DataFrames with 3 required columns:
#   unique_id : series identifier (str or int)
#   ds        : datetime column
#   y         : target value (float)
# Extra columns become covariates.

np.random.seed(42)
n_series, T = 30, 96
records = []
for uid in range(n_series):
    dates = pd.date_range('2020-01-01', periods=T, freq='ME')
    y = (50 + 10 * (uid % 5) +
         20 * np.sin(2 * np.pi * np.arange(T) / 12) +
         5  * np.random.randn(T))
    for d, v in zip(dates, y):
        records.append({'unique_id': f'series_{uid}', 'ds': d, 'y': float(v)})
df = pd.DataFrame(records)
print(f"Panel: {df['unique_id'].nunique()} series, {T} steps each")

# ── 2. Define models ───────────────────────────────────────────────────────
horizon = 12

models = [
    NHITS(
        h=horizon,
        input_size=3 * horizon,
        n_freq_downsample=[4, 2, 1],
        loss=MAE(),
        max_steps=300,
        random_seed=42,
    ),
    TFT(
        h=horizon,
        input_size=3 * horizon,
        hidden_size=32,
        n_head=4,
        loss=MQLoss(level=[10, 50, 90]),
        max_steps=300,
        random_seed=42,
    ),
    LSTM(
        h=horizon,
        input_size=2 * horizon,
        encoder_hidden_size=64,
        encoder_n_layers=2,
        loss=MAE(),
        max_steps=300,
        random_seed=42,
    ),
]

# ── 3. Train ───────────────────────────────────────────────────────────────
nf = NeuralForecast(models=models, freq='ME')
nf.fit(df)
# All models are trained globally on all series simultaneously.
# Under the hood: PyTorch Lightning with optional early stopping.

# ── 4. Predict ────────────────────────────────────────────────────────────
forecasts = nf.predict()
print(forecasts.head())
# Columns: unique_id, ds, NHITS, TFT-lo-10, TFT-median, TFT-hi-90, LSTM

# ── 5. Cross-validation ────────────────────────────────────────────────────
cv = nf.cross_validation(df, n_windows=3, step_size=horizon)
print(cv.head())
# Columns: unique_id, ds, cutoff, y (actual), NHITS, TFT-median, LSTM

# ── 6. Evaluation ─────────────────────────────────────────────────────────
from neuralforecast.losses.numpy import mae, smape
actuals = cv['y'].values
nhits   = cv['NHITS'].values
print(f"N-HiTS MAE:   {mae(nhits, actuals):.3f}")
print(f"N-HiTS SMAPE: {smape(nhits, actuals):.3f}")

# ── 7. Save and load ──────────────────────────────────────────────────────
nf.save('my_models/')
nf_loaded = NeuralForecast.load('my_models/')
preds2 = nf_loaded.predict()
`;

export default function NeuralForecastBasicsSection() {
  return (
    <SectionLayout
      title="NeuralForecast Library"
      difficulty="intermediate"
      readingTime={13}
    >
      <p className="text-gray-700 leading-relaxed">
        NeuralForecast is a Python library from Nixtla that provides a unified
        interface for training, evaluating, and deploying deep learning
        forecasting models. It abstracts PyTorch Lightning boilerplate while
        offering access to state-of-the-art architectures — LSTM, TFT,
        PatchTST, N-HiTS, and more — through a consistent scikit-learn-style
        API.
      </p>

      <DefinitionBlock title="NeuralForecast Design Philosophy">
        NeuralForecast is built around three principles:
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li><strong>Long-format data:</strong> all series share one DataFrame with <code>unique_id</code>, <code>ds</code>, <code>y</code> columns — identical to StatsForecast and MLForecast.</li>
          <li><strong>Global training:</strong> all series in the panel are trained together, enabling cross-series knowledge transfer.</li>
          <li><strong>Unified API:</strong> every model exposes the same <code>fit</code> / <code>predict</code> / <code>cross_validation</code> interface regardless of architecture.</li>
        </ul>
      </DefinitionBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Available Models</h2>
      <ModelCatalogTable />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Long-Format Data</h2>
      <p className="text-gray-700 leading-relaxed">
        Every row in a NeuralForecast DataFrame represents one observation: one
        series at one time point. This makes it easy to concatenate multiple
        series and add covariates as additional columns:
      </p>
      <div className="my-3 overflow-x-auto rounded border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {['unique_id', 'ds', 'y', 'holiday_flag'].map(col => (
                <th key={col} className="px-4 py-2 text-left font-mono text-gray-700">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['store_A', '2023-01-01', '1042.5', '0'],
              ['store_A', '2023-01-08', '1158.2', '1'],
              ['store_B', '2023-01-01', '842.1',  '0'],
              ['store_B', '2023-01-08', '799.3',  '0'],
            ].map((row, i) => (
              <tr key={i} className="border-t border-gray-200">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 font-mono text-gray-600 text-xs">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Global Training</h2>
      <p className="text-gray-700 leading-relaxed">
        <code>nf.fit(df)</code> trains a <em>single shared model</em> on all
        series simultaneously. This is fundamentally different from fitting one
        model per series. Global training:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 text-sm">
        <li>Transfers patterns across series (holiday shapes, trend dynamics)</li>
        <li>Works for cold-start series with little history</li>
        <li>Requires scale normalization — NeuralForecast applies RevIN automatically</li>
      </ul>

      <TheoremBlock title="Cross-Validation Without Refitting">
        <p>
          <code>nf.cross_validation(n_windows=k, step_size=H)</code> evaluates
          the <em>already-trained</em> model on <InlineMath math="k" /> rolling
          windows shifted by <InlineMath math="H" /> steps — no refitting.
          Each window uses the same trained weights, making evaluation fast but
          not accounting for distribution shift. For time-series that change over
          time, use <code>refit=True</code> to retrain at each cutoff.
        </p>
      </TheoremBlock>

      <ExampleBlock title="max_steps vs. Epochs">
        <p className="text-sm text-gray-700">
          NeuralForecast uses <code>max_steps</code> (gradient update count)
          rather than epochs, because batch construction across many short series
          makes "epoch" ambiguous. A practical guide: <code>max_steps=300</code>{' '}
          for quick prototyping, 500–1000 for production. Enable early stopping
          with <code>early_stop_patience_steps=50</code> to avoid overfitting.
          Training progress is logged to the console via PyTorch Lightning.
        </p>
      </ExampleBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Complete Pipeline</h2>
      <PythonCode code={nfCode} />

      <WarningBlock title="Frequency Must Match Your Data">
        The <code>freq</code> argument to <code>NeuralForecast(freq=...)</code>{' '}
        must match the actual granularity of your <code>ds</code> column. It is
        used to generate future dates during <code>predict()</code> and to create
        calendar-based features. Use pandas aliases: <code>'D'</code>,{' '}
        <code>'W'</code>, <code>'ME'</code> (month-end), <code>'MS'</code>{' '}
        (month-start), <code>'h'</code> (hourly). A mismatch causes silently
        incorrect prediction timestamps.
      </WarningBlock>

      <NoteBlock title="NeuralForecast vs. Alternatives">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li><strong>NeuralForecast (Nixtla):</strong> broadest model selection, Nixtla ecosystem, easiest API — best starting point.</li>
          <li><strong>pytorch-forecasting:</strong> richer covariate handling, tighter PyTorch control, good for custom architectures.</li>
          <li><strong>GluonTS (AWS):</strong> strong probabilistic models (DeepAR, WaveNet), production-grade.</li>
          <li><strong>Darts:</strong> unified classical + ML + DL API, best for single-series workflows.</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Olivares, K. G., et al.', year: 2023, title: 'Neural basis expansion analysis with exogenous variables: Forecasting electricity prices with NBEATSx', venue: 'International Journal of Forecasting' },
        { author: 'Challu, C., et al.', year: 2023, title: 'N-HiTS: Neural Hierarchical Interpolation for Time Series Forecasting', venue: 'AAAI' },
      ]} />
    </SectionLayout>
  );
}
