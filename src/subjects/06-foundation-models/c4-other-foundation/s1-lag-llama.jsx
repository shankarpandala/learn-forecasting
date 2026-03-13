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

function LaggedFeatureViz() {
  const [lag, setLag] = useState(3);
  const series = [3.2, 4.1, 2.8, 5.0, 3.5, 4.8, 3.1, 4.4];
  const fixedLags = [1, 2];
  const allLags = [...fixedLags, lag];
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">Lag-Llama Token = Vector of Lagged Values</h4>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-sm text-gray-600">Extra lag index:</span>
        {[3, 6, 12, 24].map(l => (
          <button key={l} onClick={() => setLag(l)}
            className={`px-3 py-1 rounded text-sm border transition-all ${lag === l ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-700 border-gray-300'}`}>
            lag-{l}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="text-xs font-mono border-collapse w-full">
          <thead>
            <tr>
              <td className="px-2 py-1 text-gray-500 border border-gray-200">Feature</td>
              {series.map((_, i) => (
                <td key={i} className="px-2 py-1 text-center border border-gray-200 text-gray-700">t={i+1}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-1 text-gray-500 border border-gray-200 font-bold">x_t</td>
              {series.map((v, i) => (
                <td key={i} className="px-2 py-1 text-center border border-gray-200 bg-blue-50 text-blue-800">{v}</td>
              ))}
            </tr>
            {allLags.map(l => (
              <tr key={l}>
                <td className="px-2 py-1 text-gray-500 border border-gray-200">lag-{l}</td>
                {series.map((_, i) => {
                  const val = i >= l ? series[i - l] : null;
                  return (
                    <td key={i} className={`px-2 py-1 text-center border border-gray-200 ${val !== null ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-400'}`}>
                      {val !== null ? val : '−'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Each token at position t is the vector [x_t, x_(t-1), x_(t-2), x_(t-{lag})]. Lags encode local temporal context directly in the token embedding.
      </p>
    </div>
  );
}

const lagLlamaCode = `# Lag-Llama: LLaMA-based probabilistic foundation model
# Repository: github.com/time-series-foundation-models/lag-llama
# pip install lag-llama gluonts torch

import torch
import numpy as np
import pandas as pd
from gluonts.dataset.common import ListDataset
from gluonts.dataset.field_names import FieldName
from huggingface_hub import hf_hub_download

# ── 1. Download model checkpoint ──────────────────────────────────────────
ckpt_path = hf_hub_download(
    repo_id="time-series-foundation-models/Lag-Llama",
    filename="lag-llama.ckpt",
)

from lag_llama.gluon.estimator import LagLlamaEstimator

# ── 2. Prepare data (GluonTS ListDataset format) ──────────────────────────
np.random.seed(42)
T    = 200
freq = "h"
dates = pd.date_range("2023-01-01", periods=T, freq=freq)
t     = np.arange(T)
y     = 100 + 20*np.sin(2*np.pi*t/24) + 5*np.sin(2*np.pi*t/168) + 3*np.random.randn(T)

test_data = ListDataset(
    [{FieldName.TARGET: y, FieldName.START: dates[0]}],
    freq=freq,
)

# ── 3. Zero-shot prediction ────────────────────────────────────────────────
horizon = 24
estimator = LagLlamaEstimator(
    ckpt_path=ckpt_path,
    prediction_length=horizon,
    context_length=512,
    num_parallel_samples=100,     # Monte Carlo samples for probabilistic output
    device=torch.device("cpu"),   # use 'cuda' for GPU
)

# Build predictor from checkpoint (no training)
lightning_module = estimator.create_lightning_module()
transformation   = estimator.create_transformation()
predictor        = estimator.create_predictor(transformation, lightning_module)

forecasts = list(predictor.predict(test_data))
f = forecasts[0]
print("Samples shape:", f.samples.shape)   # (100, 24)

median = np.median(f.samples, axis=0)
p10    = np.percentile(f.samples, 10, axis=0)
p90    = np.percentile(f.samples, 90, axis=0)
print("Median forecast:", median[:5].round(2))

# ── 4. Fine-tuning on domain data ─────────────────────────────────────────
# Build a training dataset with multiple series
n_train = 20
train_data = ListDataset(
    [
        {
            FieldName.TARGET: y + 5*np.random.randn(T),
            FieldName.START:  dates[0],
        }
        for _ in range(n_train)
    ],
    freq=freq,
)

estimator_ft = LagLlamaEstimator(
    ckpt_path=ckpt_path,
    prediction_length=horizon,
    context_length=512,
    num_parallel_samples=100,
    batch_size=8,
    num_batches_per_epoch=10,
    trainer_kwargs={
        "max_epochs": 5,               # few epochs for light fine-tuning
        "enable_progress_bar": True,
    },
    device=torch.device("cpu"),
)

predictor_ft   = estimator_ft.train(train_data, cache_data=True)
ft_forecasts   = list(predictor_ft.predict(test_data))
ft_median      = np.median(ft_forecasts[0].samples, axis=0)

# Compare zero-shot vs fine-tuned
holdout = y[-horizon:]
mae_zs = np.mean(np.abs(median    - holdout))
mae_ft = np.mean(np.abs(ft_median - holdout))
print(f"Zero-shot MAE:  {mae_zs:.3f}")
print(f"Fine-tuned MAE: {mae_ft:.3f}")

# ── 5. Lag-Llama vs Chronos quick comparison ─────────────────────────────
comparison = {
    "Backbone":      ("LLaMA decoder-only", "T5 encoder-decoder"),
    "Token type":    ("Multi-lag vector",   "Scalar quantized bin"),
    "Output":        ("Student-t (μ,σ,ν)", "Token samples → real values"),
    "Probabilistic": ("Analytical",         "Monte Carlo sampling"),
    "API":           ("GluonTS",            "Native tensors"),
}
for k, (a, b) in comparison.items():
    print(f"{k:15s}  Lag-Llama: {a:30s}  Chronos: {b}")
`;

export default function LagLlamaSection() {
  return (
    <SectionLayout
      title="Lag-Llama: LLM-Based Forecasting"
      difficulty="advanced"
      readingTime={12}
    >
      <p className="text-gray-700 leading-relaxed">
        Lag-Llama (Rasul et al., 2024) adapts a LLaMA-style decoder-only
        Transformer for probabilistic time series forecasting. Its key
        architectural insight is using <em>lagged feature vectors</em> as input
        tokens — giving each token local temporal context — combined with a
        Student-t distribution output head that provides analytically calibrated
        prediction intervals.
      </p>

      <DefinitionBlock title="Lag-Llama Architecture">
        Lag-Llama is a <strong>decoder-only Transformer</strong> with causal
        self-attention. Each input token at step <InlineMath math="t" /> is a
        vector of lagged values:{' '}
        <InlineMath math="\mathbf{z}_t = [x_t,\, x_{t-l_1},\, x_{t-l_2},\, \dots]" />.
        The output head predicts the parameters of a{' '}
        <strong>Student-t distribution</strong>{' '}
        <InlineMath math="(\mu_t, \sigma_t, \nu_t)" /> at each forecast step —
        rather than a discrete token distribution or raw sample paths.
      </DefinitionBlock>

      <LaggedFeatureViz />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Lagged Features as Tokens
      </h2>
      <p className="text-gray-700 leading-relaxed">
        A single scalar value carries almost no temporal information. Lag-Llama
        enriches each token with lagged values at chosen offsets{' '}
        <InlineMath math="\mathcal{L} = \{l_1, l_2, \dots, l_K\}" />:
      </p>
      <BlockMath math="\mathbf{z}_t = [x_t,\; x_{t-l_1},\; x_{t-l_2},\; \dots,\; x_{t-l_K}] \in \mathbb{R}^{K+1}" />
      <p className="text-gray-700 leading-relaxed mt-3">
        The lag set is designed to cover multiple temporal scales. For hourly
        data, lags{' '}
        <InlineMath math="\{1, 2, 3, 4, 24, 48, 168\}" /> capture immediate
        history, daily patterns, and weekly patterns. This is conceptually
        similar to ARIMA's lag selection, but embedded inside a deep Transformer
        architecture.
      </p>

      <TheoremBlock title="Student-t Output Distribution">
        <p>
          Lag-Llama outputs a Student-t distribution at each forecast step:
        </p>
        <BlockMath math="x_{t+h} \mid \mathbf{z}_{1:t} \sim \text{StudentT}(\mu_{t+h},\; \sigma_{t+h},\; \nu_{t+h})" />
        <p className="text-sm mt-2">
          The three parameters are predicted by the Transformer's output layer.
          The Student-t distribution is heavier-tailed than a Gaussian —
          making it more robust to outliers common in real-world financial and
          demand data. Crucially, quantiles can be computed{' '}
          <em>analytically</em> from <InlineMath math="(\mu, \sigma, \nu)" />{' '}
          via the inverse CDF, without running many Monte Carlo samples.
          This enables faster inference and more stable quantile estimates.
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Lag-Llama vs. Chronos
      </h2>
      <div className="my-4 overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Aspect</th>
              <th className="px-4 py-2 text-left text-gray-700">Lag-Llama</th>
              <th className="px-4 py-2 text-left text-gray-700">Chronos</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Backbone', 'LLaMA decoder-only (GPT-style)', 'T5 encoder-decoder'],
              ['Token type', 'Multi-lag feature vector', 'Scalar quantized bin'],
              ['Output type', 'Student-t (μ, σ, ν)', 'Sampled token sequences'],
              ['Probabilistic', 'Analytical — no sampling needed', 'Monte Carlo sampling'],
              ['Ecosystem', 'GluonTS API', 'Native tensors / HuggingFace'],
              ['Context limit', '512 steps', '512 steps'],
              ['Open-source', 'Yes (HuggingFace)', 'Yes (HuggingFace)'],
              ['Fine-tuning', 'GluonTS Trainer', 'Not natively supported (v1)'],
            ].map(([a, b, c]) => (
              <tr key={a} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-700">{a}</td>
                <td className="px-4 py-2 text-gray-600">{b}</td>
                <td className="px-4 py-2 text-gray-600">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExampleBlock title="When Lag-Llama's Student-t Output Is Preferable">
        <p className="text-sm text-gray-700">
          Lag-Llama's distributional output is advantageous when: (a) latency
          matters and you cannot afford many Monte Carlo samples, (b) your data
          has heavy tails (finance, weather extremes) where Gaussian intervals
          would undercover, (c) you integrate with GluonTS evaluation pipelines
          that expect GluonTS Forecast objects, or (d) you need analytical
          probability estimates at a specific quantile (e.g., P95 for
          inventory planning) computed precisely.
        </p>
      </ExampleBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Implementation</h2>
      <PythonCode code={lagLlamaCode} />

      <WarningBlock title="GluonTS Dependency and API Complexity">
        Lag-Llama's interface is built on GluonTS, which uses its own{' '}
        <code>ListDataset</code> format and <code>FieldName</code> constants —
        different from the DataFrame API of TimeGPT or the tensor API of
        Chronos. If you are not already using GluonTS, Chronos or TimeGPT will
        have a substantially lower integration overhead for new projects.
      </WarningBlock>

      <NoteBlock title="Fine-Tuning with Lag-Llama">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li>Set <code>max_epochs=5–20</code> for light fine-tuning — enough to adapt output calibration without overwriting pre-trained features.</li>
          <li>Provide a GluonTS training dataset with at least 10–20 diverse series for stable fine-tuning.</li>
          <li>Use <code>num_batches_per_epoch=10–50</code> to control training speed — more batches per epoch = more gradient steps per epoch.</li>
          <li>Fine-tuning on 20 series × 200 steps × 5 epochs takes approximately 2–5 minutes on CPU.</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Rasul, K., Ashok, A., Williams, A. R., et al.', year: 2024, title: 'Lag-Llama: Towards Foundation Models for Probabilistic Time Series Forecasting', venue: 'ICLR LLMs for Time Series Workshop' },
        { author: 'Touvron, H., et al.', year: 2023, title: 'LLaMA: Open and Efficient Foundation Language Models', venue: 'arXiv' },
        { author: 'Alexandrov, A., et al.', year: 2020, title: 'GluonTS: Probabilistic and Neural Time Series Modeling in Python', venue: 'JMLR' },
      ]} />
    </SectionLayout>
  );
}
