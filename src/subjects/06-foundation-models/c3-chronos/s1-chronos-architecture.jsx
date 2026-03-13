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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Tokenization visualization
function TokenizationViz() {
  const [numBins, setNumBins] = useState(10);

  const values = [-2.5, -1.8, -0.9, 0.1, 0.7, 1.3, 1.9, 2.6];
  const minV = -3, maxV = 3;
  const binWidth = (maxV - minV) / numBins;

  const getBin = v => Math.min(Math.floor((v - minV) / binWidth), numBins - 1);
  const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe',
    '#fde68a', '#fbbf24', '#f59e0b', '#d97706', '#b45309'];

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">Chronos Tokenization via Quantization</h4>
      <div className="mb-3 flex items-center gap-3">
        <label className="text-sm text-gray-600">Bins (vocabulary size per bin):</label>
        <input type="range" min={4} max={20} value={numBins}
          onChange={e => setNumBins(Number(e.target.value))}
          className="w-32 accent-indigo-500" />
        <span className="text-sm font-mono text-indigo-600">{numBins}</span>
      </div>
      <div className="flex items-end gap-1 h-20 bg-white border border-gray-200 rounded p-2">
        {Array.from({ length: numBins }, (_, i) => {
          const binMin = minV + i * binWidth;
          const binMax = binMin + binWidth;
          const count = values.filter(v => v >= binMin && v < binMax).length;
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                style={{ height: `${Math.max(count * 30, 4)}px`, backgroundColor: colors[i % colors.length] }}
                className="w-full rounded-t"
                title={`Bin ${i}: [${binMin.toFixed(1)}, ${binMax.toFixed(1)})`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{minV}</span><span>0</span><span>{maxV}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Values are normalized then mapped to discrete bins. Each bin is a "token" from the vocabulary.
        With {numBins} bins, the total vocabulary size for Chronos is {numBins * 2 + 2} (bins + special tokens).
      </p>
    </div>
  );
}

// Model size comparison
const chronosSizes = [
  { size: 'Tiny', params: 8, wql: 0.0820 },
  { size: 'Mini', params: 20, wql: 0.0792 },
  { size: 'Small', params: 46, wql: 0.0776 },
  { size: 'Base', params: 200, wql: 0.0759 },
  { size: 'Large', params: 710, wql: 0.0743 },
];

export default function ChronosArchitecture() {
  return (
    <SectionLayout
      title="Amazon Chronos: Learning the Language of Time Series"
      difficulty="advanced"
      readingTime={35}
      prerequisites={['Foundation model concepts (c1-s1)', 'T5/Transformer architecture', 'Probabilistic forecasting basics']}
    >
      <p className="text-gray-700 leading-relaxed">
        Chronos (Ansari et al., 2024) takes a provocative approach to time series forecasting:
        treat it as a <strong>language modeling problem</strong>. By tokenizing time series values
        into discrete bins and training a T5 language model to predict the next tokens, Chronos
        achieves strong zero-shot probabilistic forecasting without any time-series-specific
        architectural modifications.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">The Core Innovation: Tokenization via Quantization</h2>
      <p className="text-gray-700 leading-relaxed">
        The central question is: how do you feed continuous-valued time series data to a language
        model that operates on discrete tokens? Chronos answers this with uniform quantization:
      </p>

      <DefinitionBlock title="Chronos Tokenization">
        <p className="mb-2">Given a time series <InlineMath math="x_1, \ldots, x_T" />:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Normalize:</strong> apply mean-scale normalization:
            <BlockMath math="\tilde{x}_t = x_t / \bar{x}, \quad \bar{x} = \frac{1}{T}\sum_t |x_t| + \epsilon" />
          </li>
          <li>
            <strong>Quantize:</strong> map normalized values to <InlineMath math="B" /> equally-spaced bins
            covering <InlineMath math="[-s, +s]" /> (e.g., <InlineMath math="B = 4096, s = 10" />):
            <BlockMath math="\text{token}(x) = \left\lfloor \frac{x + s}{2s} \cdot B \right\rfloor \in \{0, 1, \ldots, B-1\}" />
          </li>
          <li>
            <strong>Special tokens:</strong> add PAD, EOS tokens — bringing vocabulary size to <InlineMath math="B + 2" />.
          </li>
        </ol>
      </DefinitionBlock>

      <TokenizationViz />

      <p className="text-gray-700 leading-relaxed mt-2">
        During inference, the model predicts a probability distribution over the vocabulary at
        each future timestep. To generate a probabilistic forecast, Chronos samples from this
        distribution, applies the inverse quantization mapping, then denormalizes — producing
        a set of sample paths that form a predictive distribution.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">T5 Backbone</h2>
      <p className="text-gray-700 leading-relaxed">
        Chronos uses the T5 (Text-to-Text Transfer Transformer) architecture unchanged, except
        for expanding the embedding layer to accommodate the larger vocabulary (4096 bins vs.
        ~32k word tokens in standard T5):
      </p>
      <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
        <li><strong>Encoder:</strong> processes the historical token sequence with relative position bias (T5's variant of positional encoding)</li>
        <li><strong>Decoder:</strong> autoregressively predicts future tokens, attending to the encoder output</li>
        <li><strong>Loss:</strong> standard cross-entropy over the tokenized forecast values — exactly the same as language model training</li>
      </ul>

      <NoteBlock title="Why T5 Works Here">
        T5's relative position bias (rather than fixed sinusoidal embeddings) allows the model
        to generalize to sequence lengths not seen during training — important because time series
        can have highly variable lengths. The encoder-decoder structure naturally separates
        "understanding the past" (encoder) from "predicting the future" (decoder).
      </NoteBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Training Data: KernelSynth</h2>
      <p className="text-gray-700 leading-relaxed">
        Chronos is trained on a combination of real-world datasets and synthetic data generated
        by <strong>KernelSynth</strong> — a method for generating diverse time series using
        Gaussian Process kernels:
      </p>
      <BlockMath math="y \sim \mathcal{GP}(0, k_1 \cdot k_2 \cdot k_3)" />
      <p className="text-gray-700 leading-relaxed mt-3">
        where each kernel <InlineMath math="k_i" /> is randomly chosen from a set including:
        RBF (smooth trends), Periodic (seasonality), Linear (linear trend), Matérn (rough trends),
        White Noise (noise). Random combinations create an enormous variety of patterns —
        trend + seasonality + noise, double seasonality, irregular cycles, etc.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Model Sizes</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-indigo-50">
            <tr>
              <th className="border border-gray-300 p-3">Size</th>
              <th className="border border-gray-300 p-3">Parameters (M)</th>
              <th className="border border-gray-300 p-3">T5 Variant</th>
              <th className="border border-gray-300 p-3">Use Case</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Tiny', '8M', 't5-efficient-tiny', 'Edge devices, ultra-fast inference'],
              ['Mini', '20M', 't5-efficient-mini', 'Lightweight deployment'],
              ['Small', '46M', 't5-efficient-small', 'Balance speed and accuracy'],
              ['Base', '200M', 't5-base', 'Production default'],
              ['Large', '710M', 't5-large', 'Maximum accuracy'],
            ].map(([size, params, variant, useCase], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-3 font-semibold text-indigo-700">{size}</td>
                <td className="border border-gray-300 p-3 text-center text-gray-600">{params}</td>
                <td className="border border-gray-300 p-3 font-mono text-gray-600 text-xs">{variant}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{useCase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-4">
        <h4 className="font-semibold text-gray-700 mb-2">WQL Score vs Model Size (lower is better)</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chronosSizes} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="size" />
            <YAxis domain={[0.072, 0.085]} />
            <Tooltip />
            <Bar dataKey="wql" fill="#6366f1" name="WQL (zero-shot)" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-1">Representative WQL scores on held-out benchmark datasets. Smaller = better.</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Python: HuggingFace Pipeline</h2>

      <PythonCode>{`# Install: pip install git+https://github.com/amazon-science/chronos-forecasting.git
import torch
import pandas as pd
import numpy as np
from chronos import ChronosPipeline

# ── Load Chronos from HuggingFace ─────────────────────────────────────────────
pipeline = ChronosPipeline.from_pretrained(
    "amazon/chronos-t5-small",       # or tiny, mini, base, large
    device_map="cpu",                # or "cuda" if GPU available
    torch_dtype=torch.bfloat16,      # Memory-efficient dtype
)

# ── Single series forecast ────────────────────────────────────────────────────
# Create a sample time series (electricity demand-like)
np.random.seed(42)
T = 200
trend = np.linspace(100, 130, T)
seasonal = 20 * np.sin(np.arange(T) * 2 * np.pi / 24)
noise = np.random.randn(T) * 5
y = trend + seasonal + noise

context = torch.tensor(y, dtype=torch.float32)

# Probabilistic forecast: returns (n_samples, horizon) matrix
quantile_levels = [0.1, 0.5, 0.9]
H = 48  # 48-step forecast

forecast_samples, quantiles = pipeline.predict_quantiles(
    context=context,
    prediction_length=H,
    quantile_levels=quantile_levels,
    num_samples=100,    # Sample this many paths from the predictive distribution
)

# forecast_samples: (100, 48)
# quantiles: (3, 48) for q=0.1, 0.5, 0.9
median_forecast = quantiles[1]   # 50th percentile
print(f"Forecast shape: {forecast_samples.shape}")
print(f"Next 5 steps (median): {median_forecast[:5].numpy()}")

# ── Multiple series ────────────────────────────────────────────────────────────
series_list = [
    torch.tensor(y + i * 20, dtype=torch.float32)
    for i in range(5)
]

# Pad to same length automatically
all_forecasts = pipeline.predict(
    context=series_list,
    prediction_length=H,
    num_samples=100,
)
print(f"Batch forecast shape: {all_forecasts.shape}")
# (5, 100, 48) = n_series × n_samples × horizon

# Extract quantiles for each series
for i in range(5):
    q10, q50, q90 = np.quantile(all_forecasts[i].numpy(), [0.1, 0.5, 0.9], axis=0)
    print(f"Series {i}: median={q50[0]:.1f}, 80% PI=[{q10[0]:.1f}, {q90[0]:.1f}]")

# ── Integration with nixtla/statsforecast ecosystem ───────────────────────────
from statsforecast import StatsForecast
from statsforecast.models import Naive, AutoETS

# Compare Chronos zero-shot vs classical methods on the same data
df_long = pd.DataFrame({
    'unique_id': 'elec_1',
    'ds': pd.date_range('2022-01-01', periods=T, freq='h'),
    'y': y,
})

sf = StatsForecast(models=[Naive(), AutoETS()], freq='h', n_jobs=-1)
sf.fit(df_long)
classical_preds = sf.predict(h=H)
print(classical_preds.head())
`}</PythonCode>

      <ExampleBlock title="Zero-Shot vs Fine-Tuned Comparison">
        <p>
          On M4 weekly data (359 series, H=13), Chronos-Large zero-shot achieves sMAPE ~9.4%
          vs AutoETS ~9.0% and AutoARIMA ~9.8%. The small gap to AutoETS — achieved with no
          domain-specific training — is remarkable. Fine-tuned Chronos typically closes this
          gap further, matching or exceeding AutoETS on most datasets.
        </p>
      </ExampleBlock>

      <WarningBlock title="Tokenization Precision Loss">
        Quantization introduces precision loss: with 4096 bins over range [-10, 10] after
        normalization, the minimum representable difference is 20/4096 ≈ 0.005. For series
        with very fine-grained differences (e.g., financial returns), this quantization noise
        may hurt accuracy. Consider using Chronos-Base or Large (finer effective resolution
        via more parameters) or models that operate on continuous values (TimeGPT, NHITS).
      </WarningBlock>

      <ReferenceList references={[
        { authors: 'Ansari, A.F. et al.', year: 2024, title: 'Chronos: Learning the Language of Time Series', venue: 'Transactions on Machine Learning Research', url: 'https://arxiv.org/abs/2403.07815' },
        { authors: 'Raffel, C. et al.', year: 2020, title: 'Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer (T5)', venue: 'JMLR', url: 'https://arxiv.org/abs/1910.10683' },
        { authors: 'Rasmussen, C.E., Williams, C.K.I.', year: 2006, title: 'Gaussian Processes for Machine Learning', venue: 'MIT Press', url: 'https://gaussianprocess.org/gpml/' },
      ]} />
    </SectionLayout>
  );
}
