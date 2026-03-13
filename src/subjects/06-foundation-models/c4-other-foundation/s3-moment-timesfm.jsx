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

const allModels = [
  { name: 'TimeGPT',   org: 'Nixtla',     params: '~100M', backbone: 'Transformer Enc-Dec', token: 'Scalar value', output: 'Point + conformal PI', zeroShot: true, finetune: true, local: false, bestFor: 'API convenience, anomaly detection' },
  { name: 'Chronos',   org: 'Amazon',     params: '8M–710M', backbone: 'T5 Enc-Dec', token: 'Quantized bin', output: 'Sample paths', zeroShot: true, finetune: false, local: true, bestFor: 'Open-source probabilistic, CPU' },
  { name: 'TimesFM',   org: 'Google',     params: '200M',  backbone: 'Decoder-only patch', token: 'Patch', output: 'Point + quantiles', zeroShot: true, finetune: false, local: true, bestFor: 'Fast point forecast, large context' },
  { name: 'Moirai',    org: 'Salesforce', params: '14M–311M', backbone: 'Encoder Transformer', token: 'Multi-patch', output: 'Sample paths', zeroShot: true, finetune: true, local: true, bestFor: 'Multivariate, any-variate' },
  { name: 'Lag-Llama', org: 'Academic',   params: '~32M',  backbone: 'LLaMA Decoder-only', token: 'Lagged vector', output: 'Student-t dist.', zeroShot: true, finetune: true, local: true, bestFor: 'Heavy-tailed, GluonTS integration' },
  { name: 'MOMENT',    org: 'CMU',        params: '385M',  backbone: 'T5 Encoder (BERT-style)', token: 'Patch (masked)', output: 'Point (linear probe)', zeroShot: false, finetune: true, local: true, bestFor: 'Fine-tuning, representation learning' },
];

function ModelComparisonTable() {
  const [sortKey, setSortKey] = useState('name');
  const [highlight, setHighlight] = useState(null);
  return (
    <div className="my-6">
      <div className="flex gap-2 mb-3 flex-wrap text-xs">
        <span className="text-gray-500 self-center">Sort by:</span>
        {['name', 'params', 'org'].map(k => (
          <button key={k} onClick={() => setSortKey(k)}
            className={`px-3 py-1 rounded border transition-all ${sortKey === k ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300'}`}>
            {k}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-100">
            <tr>
              {['Model', 'Org', 'Params', 'Backbone', 'Token', 'Output', 'Zero-shot', 'Fine-tune', 'Local', 'Best For'].map(h => (
                <th key={h} className="px-3 py-2 text-left text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...allModels]
              .sort((a, b) => a[sortKey] > b[sortKey] ? 1 : -1)
              .map(m => (
                <tr key={m.name}
                  onClick={() => setHighlight(highlight === m.name ? null : m.name)}
                  className={`border-t border-gray-200 cursor-pointer transition-colors ${highlight === m.name ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-3 py-2 font-mono font-bold text-gray-900">{m.name}</td>
                  <td className="px-3 py-2 text-gray-600">{m.org}</td>
                  <td className="px-3 py-2 text-gray-600">{m.params}</td>
                  <td className="px-3 py-2 text-gray-600">{m.backbone}</td>
                  <td className="px-3 py-2 text-gray-600">{m.token}</td>
                  <td className="px-3 py-2 text-gray-600">{m.output}</td>
                  <td className="px-3 py-2 text-center">{m.zeroShot ? '✓' : '−'}</td>
                  <td className="px-3 py-2 text-center">{m.finetune ? '✓' : '−'}</td>
                  <td className="px-3 py-2 text-center">{m.local ? '✓' : '−'}</td>
                  <td className="px-3 py-2 text-gray-500 max-w-xs">{m.bestFor}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-1">Click a row to highlight. Sort by clicking column buttons above.</p>
    </div>
  );
}

const momentTimesFMCode = `# ═══════════════════════════════════════════════════════════════════════════
# MOMENT: Masked Pre-Training Foundation Model
# pip install momentfm torch transformers
# ═══════════════════════════════════════════════════════════════════════════
import torch
import numpy as np
from momentfm import MOMENTPipeline

# ── 1. Load MOMENT ─────────────────────────────────────────────────────────
moment = MOMENTPipeline.from_pretrained(
    "AutonLab/MOMENT-1-large",   # 385M parameter T5 encoder
    model_kwargs={
        "task_name": "forecasting",
        "forecast_horizon": 24,
    },
)
moment.init()

# ── 2. Zero-shot forecasting ───────────────────────────────────────────────
# MOMENT requires fixed-length context of 512 time steps
np.random.seed(42)
T = 512
t = np.arange(T)
y = 100 + 20*np.sin(2*np.pi*t/24) + np.random.randn(T)

# MOMENT input: (batch, n_channels, context_length=512)
context = torch.tensor(y, dtype=torch.float32).unsqueeze(0).unsqueeze(0)  # (1, 1, 512)

output = moment(context)
# output.forecast: (batch, horizon, n_channels) = (1, 24, 1)
forecast = output.forecast.squeeze().numpy()   # (24,)
print("MOMENT forecast shape:", forecast.shape)
print("First 5 steps:", forecast[:5].round(2))

# ── 3. MOMENT for anomaly detection ───────────────────────────────────────
moment_anomaly = MOMENTPipeline.from_pretrained(
    "AutonLab/MOMENT-1-large",
    model_kwargs={"task_name": "reconstruction"},  # masked reconstruction
)
moment_anomaly.init()

# Inject anomaly
y_anom = y.copy()
y_anom[250:255] += 200.0

ctx_anom = torch.tensor(y_anom, dtype=torch.float32).unsqueeze(0).unsqueeze(0)
# Mask out 20% of time steps and reconstruct
mask = torch.zeros(1, 1, T)
mask[:, :, 250:255] = 1.0   # mask the anomalous region

recon = moment_anomaly(ctx_anom, input_mask=mask)
recon_np = recon.reconstruction.squeeze().numpy()
error    = np.abs(y_anom - recon_np)
print("\\nAnomaly detection: max reconstruction error at", np.argmax(error))

# ═══════════════════════════════════════════════════════════════════════════
# TimesFM: Google's Patched Decoder-Only Foundation Model
# pip install timesfm[cpu]  (or timesfm[gpu] for CUDA)
# ═══════════════════════════════════════════════════════════════════════════
import timesfm

# ── 4. Load TimesFM ────────────────────────────────────────────────────────
tfm = timesfm.TimesFm(
    hparams=timesfm.TimesFmHparams(
        backend="cpu",         # 'gpu' for CUDA
        per_core_batch_size=32,
        horizon_len=24,
        num_layers=20,
        model_dims=1280,
        context_len=512,
        input_patch_len=32,
        output_patch_len=128,
    ),
    checkpoint=timesfm.TimesFmCheckpoint(
        huggingface_repo_id="google/timesfm-1.0-200m-pytorch",
    ),
)

# ── 5. Array-based inference ───────────────────────────────────────────────
# forecast_on_df returns point forecast (no native uncertainty)
import pandas as pd

df = pd.DataFrame({
    'unique_id': 'ts1',
    'ds': pd.date_range('2023-01-01', periods=T, freq='h'),
    'y': y,
})

point_fc, _ = tfm.forecast_on_df(df, freq='h', value_name='y', num_jobs=1)
print("\\nTimesFM forecast shape:", point_fc.shape)
print(point_fc[['unique_id', 'ds', 'timesfm']].head())

# ── 6. TimesFM with quantile outputs ──────────────────────────────────────
# TimesFM 1.0 supports quantile outputs via forecast() method
forecast_input = [torch.tensor(y[-512:], dtype=torch.float32)]
freq_input     = [0]   # 0 = high-freq (hourly/minute), 1 = medium, 2 = low

point_forecast, quantile_forecast = tfm.forecast(
    forecast_input,
    freq=freq_input,
)
# quantile_forecast: (batch, horizon, n_quantiles)
print("TimesFM quantile shape:", quantile_forecast.shape)

# ── 7. Comparing all models: decision guide ────────────────────────────────
guide = {
    "Need zero-shot + API": "TimeGPT",
    "Need zero-shot + local + probabilistic": "Chronos-Bolt",
    "Need fast point forecast": "TimesFM",
    "Need multivariate zero-shot": "Moirai",
    "Need heavy-tailed distribution": "Lag-Llama",
    "Need fine-tunable encoder": "MOMENT",
    "Need simple baseline": "N-HiTS (NeuralForecast)",
}
for scenario, model in guide.items():
    print(f"  {scenario:45s} → {model}")
`;

export default function MomentTimesFMSection() {
  return (
    <SectionLayout
      title="MOMENT and TimesFM"
      difficulty="advanced"
      readingTime={12}
    >
      <p className="text-gray-700 leading-relaxed">
        This section covers the final two major foundation models in the
        current landscape — <strong>MOMENT</strong> (CMU), which applies
        masked pre-training (BERT-style) to time series for strong fine-tuning
        performance, and <strong>TimesFM</strong> (Google), which uses a
        patched decoder-only Transformer for fast and scalable point
        forecasting. Together with Chronos, Moirai, Lag-Llama, and TimeGPT,
        these models form the current frontier of time series foundation models.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-3 text-gray-800">
        MOMENT: Masked Pre-Training for Time Series
      </h2>
      <DefinitionBlock title="MOMENT Architecture">
        MOMENT (Goswami et al., 2024) is a T5 Transformer encoder pre-trained
        using a <strong>masked patch modeling</strong> objective — the time
        series equivalent of BERT's masked language modeling. Random patches
        of the input sequence are masked, and the model is trained to
        reconstruct them. This forces the encoder to learn rich contextual
        representations of temporal patterns without requiring labeled
        forecasting data.
      </DefinitionBlock>

      <p className="text-gray-700 leading-relaxed mt-3">
        MOMENT uses <em>patch-based tokenization</em>: each token is a patch
        of 8 time steps. For a context of 512 time steps, this produces
        64 tokens — a manageable sequence for the encoder. The fixed context
        length of 512 is a requirement (shorter series must be zero-padded).
      </p>

      <TheoremBlock title="Masked Patch Modeling Objective">
        <p>
          For a sequence of <InlineMath math="N" /> patches{' '}
          <InlineMath math="\{p_1, \dots, p_N\}" />, a random subset{' '}
          <InlineMath math="\mathcal{M}" /> is masked with a learnable{' '}
          <code>[MASK]</code> token. The model is trained to reconstruct the
          masked patches:
        </p>
        <BlockMath math="\mathcal{L} = \frac{1}{|\mathcal{M}|}\sum_{i \in \mathcal{M}} \|p_i - \hat{p}_i\|_2^2" />
        <p className="text-sm mt-2">
          At fine-tuning time, the pre-trained encoder is frozen (or partially
          unfrozen), and a lightweight task-specific head (linear layer for
          forecasting, or anomaly score for detection) is trained on domain
          data. This is the same transfer learning paradigm as BERT/GPT in NLP
          — pre-train on massive unlabeled data, then fine-tune efficiently.
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        TimesFM: Google's Patched Decoder Foundation Model
      </h2>
      <DefinitionBlock title="TimesFM Architecture">
        TimesFM (Das et al., 2024) is a <strong>decoder-only Transformer</strong>
        with patch-based tokenization, trained on Google's large-scale internal
        time series corpus plus public data (Wikipedia, etc.). Unlike Chronos
        (which tokenizes values into discrete bins), TimesFM uses continuous
        real-valued patches with a lightweight patch embedding layer — similar
        to the input side of PatchTST, but with a causal decoder for
        auto-regressive generation.
      </DefinitionBlock>

      <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-semibold text-blue-800 text-sm mb-2">MOMENT Highlights</p>
          <ul className="text-xs text-blue-900 space-y-1">
            <li>T5 encoder (BERT-style bidirectional attention)</li>
            <li>Masked patch modeling pre-training</li>
            <li>Fixed 512-step context (required)</li>
            <li>Strong at fine-tuning with few labels</li>
            <li>Supports: forecasting, anomaly detection, classification, imputation</li>
            <li>385M parameters (large only)</li>
          </ul>
        </div>
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
          <p className="font-semibold text-rose-800 text-sm mb-2">TimesFM Highlights</p>
          <ul className="text-xs text-rose-900 space-y-1">
            <li>Decoder-only (GPT-style causal attention)</li>
            <li>Patch embedding (continuous values)</li>
            <li>Up to 512+ step context</li>
            <li>Point forecast primary; quantiles available</li>
            <li>Extremely fast inference (non-autoregressive output)</li>
            <li>200M parameters</li>
          </ul>
        </div>
      </div>

      <ExampleBlock title="MOMENT vs. TimesFM: Key Trade-offs">
        <p className="text-sm text-gray-700">
          <strong>Choose MOMENT when:</strong> you want to fine-tune a strong
          encoder on labeled domain data (transfer learning), need anomaly
          detection or imputation alongside forecasting, or prefer
          BERT-style bidirectional context over causal decoding. MOMENT is not
          a zero-shot forecaster in the same sense as Chronos — it requires
          a fine-tuning step for best forecasting performance.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          <strong>Choose TimesFM when:</strong> you want the fastest
          possible point forecast with minimal infrastructure, you trust
          Google's large-scale pre-training data, or you need a high-throughput
          zero-shot baseline to compare against.
        </p>
      </ExampleBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Complete Foundation Model Comparison
      </h2>
      <ModelComparisonTable />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Implementation: MOMENT and TimesFM
      </h2>
      <PythonCode code={momentTimesFMCode} />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Practical Decision Guide
      </h2>
      <div className="my-4 space-y-2">
        {[
          { q: 'Cold-start, no training data, need API', a: 'TimeGPT', color: 'purple' },
          { q: 'Cold-start, need local / open-source probabilistic', a: 'Chronos-Bolt', color: 'amber' },
          { q: 'Maximum point forecast speed, local', a: 'TimesFM', color: 'rose' },
          { q: 'Multivariate with cross-variate dependencies', a: 'Moirai or iTransformer', color: 'emerald' },
          { q: 'Heavy-tailed data, GluonTS pipeline', a: 'Lag-Llama', color: 'blue' },
          { q: 'Few-shot fine-tuning on labeled domain data', a: 'MOMENT or TFT', color: 'indigo' },
          { q: 'Panel training data available, rich covariates', a: 'TFT or N-HiTS (NeuralForecast)', color: 'gray' },
        ].map(({ q, a, color }) => (
          <div key={q} className="flex items-start gap-3 p-2 bg-gray-50 border border-gray-200 rounded">
            <span className="text-sm text-gray-600 flex-1">{q}</span>
            <span className="shrink-0 text-sm font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
              {a}
            </span>
          </div>
        ))}
      </div>

      <WarningBlock title="Rapid Pace of Change">
        The foundation model landscape for time series is evolving extremely
        rapidly. Model rankings on benchmarks change with each paper, and new
        models (Lag-Llama 2, TimesFM 2.0, Chronos-Bolt improvements) are
        released frequently. Always re-evaluate against the current state of
        the art before making production commitments — what was best 6 months
        ago may no longer be the optimal choice.
      </WarningBlock>

      <NoteBlock title="Starting Point Recommendation">
        <p className="text-sm text-gray-700">
          For most practitioners starting with foundation models, the recommended
          progression is: (1) try <strong>Chronos-Bolt-Small</strong> as a
          zero-shot local baseline — it is free, fast, and well-documented;
          (2) compare against <strong>TimeGPT</strong> via the Nixtla API for
          convenience; (3) only invest in larger models (Moirai, TimesFM,
          MOMENT) after establishing that the simpler options are insufficient
          for your use case.
        </p>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Goswami, M., Szafer, K., Choudhry, A., et al.', year: 2024, title: 'MOMENT: A Family of Open Time-series Foundation Models', venue: 'ICML' },
        { author: 'Das, A., Kong, W., Leach, A., Sen, R., & Yu, R.', year: 2024, title: 'A Decoder-Only Foundation Model for Time-Series Forecasting', venue: 'ICML (TimesFM)' },
        { author: 'Ansari, A. F., et al.', year: 2024, title: 'Chronos: Learning the Language of Time Series', venue: 'Transactions on Machine Learning Research' },
        { author: 'Woo, G., et al.', year: 2024, title: 'Unified Training of Universal Time Series Forecasting Transformers', venue: 'ICML (Moirai)' },
      ]} />
    </SectionLayout>
  );
}
