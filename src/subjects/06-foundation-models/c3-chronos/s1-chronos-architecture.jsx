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

function TokenizationViz() {
  const [bins, setBins] = useState(10);
  const values = [2.1, 3.8, 1.2, 4.5, 3.1, 2.7, 5.0, 1.8, 4.2, 3.5];
  const min = 1.0;
  const max = 5.5;
  const binWidth = (max - min) / bins;
  const tokenize = (v) => Math.min(Math.floor((v - min) / binWidth), bins - 1);
  const palette = ['#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81', '#1e1b4b', '#2563eb', '#1d4ed8', '#1e40af'];
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">Chronos: Real Values → Discrete Tokens</h4>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-sm text-gray-600">Vocabulary size:</span>
        {[6, 10, 20, 50].map(b => (
          <button key={b} onClick={() => setBins(b)}
            className={`px-3 py-1 rounded text-sm border transition-all ${bins === b ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}>
            B={b}
          </button>
        ))}
      </div>
      <div className="flex items-end gap-1 mb-3 h-20">
        {values.map((v, i) => {
          const token = tokenize(v);
          const heightPct = ((v - min) / (max - min)) * 100;
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full rounded-t transition-all"
                style={{ height: `${heightPct}%`, backgroundColor: palette[token % palette.length] }} />
              <span className="text-xs text-gray-500 font-mono">{token}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>min={min}</span><span>→ token indices →</span><span>max={max}</span>
      </div>
      <p className="text-xs text-gray-500">
        With B={bins} bins, each value maps to an integer token. The sequence becomes a
        token sequence that a standard language model can process with cross-entropy loss.
        Predicted tokens are converted back to real values using bin center values.
      </p>
    </div>
  );
}

const chronosArchCode = `# pip install chronos-forecasting transformers torch
import torch
import numpy as np
from chronos import ChronosPipeline

# ── 1. Load pre-trained Chronos ────────────────────────────────────────────
# Sizes: tiny(8M), mini(20M), small(46M), base(200M), large(710M)
# All use T5 encoder-decoder backbone.
pipeline = ChronosPipeline.from_pretrained(
    "amazon/chronos-t5-small",
    device_map="cpu",
    torch_dtype=torch.float32,
)

# ── 2. Prepare context ────────────────────────────────────────────────────
np.random.seed(42)
T  = 96
t  = np.arange(T)
y  = 15 * np.sin(2*np.pi*t/24) + 5 * np.sin(2*np.pi*t/7) + np.random.randn(T)

# Chronos accepts a 2D tensor (batch, time) or a list of 1D tensors
context = torch.tensor(y, dtype=torch.float32).unsqueeze(0)  # (1, 96)
print("Context shape:", context.shape)

# ── 3. Probabilistic forecast (sample paths) ──────────────────────────────
horizon = 24
samples = pipeline.predict(
    context=context,
    prediction_length=horizon,
    num_samples=100,      # 100 Monte Carlo samples
    temperature=1.0,      # sampling temperature (1.0 = standard)
    top_k=50,             # top-k token filtering
    top_p=1.0,            # nucleus sampling (1.0 = disabled)
)
print("Samples shape:", samples.shape)   # (1, 100, 24)

# ── 4. Point and interval forecasts from samples ──────────────────────────
s = samples[0].numpy()                    # (100, 24)
median = np.median(s, axis=0)
p10    = np.percentile(s, 10, axis=0)
p90    = np.percentile(s, 90, axis=0)

print("Median forecast (first 5):", median[:5].round(2))
print("80% interval width (first 5):", (p90 - p10)[:5].round(2))

# ── 5. Batch prediction (variable-length series) ──────────────────────────
# Chronos pads shorter series with special tokens via attention masking
contexts = [
    torch.tensor(y[:50], dtype=torch.float32),    # short series
    torch.tensor(y[:96], dtype=torch.float32),    # longer series
    torch.tensor(y[:80], dtype=torch.float32),    # another
]
batch_samples = pipeline.predict(contexts, prediction_length=24, num_samples=20)
print("\\nBatch shape:", batch_samples.shape)   # (3, 20, 24)

# ── 6. Tokenization internals (conceptual) ────────────────────────────────
# Chronos pipeline internally:
# 1. Normalizes: x̃ = x / mean(|x|)  [mean-scaling]
# 2. Quantizes x̃ into B=4096 bins (vocabulary size)
# 3. Maps each bin → token ID in T5's vocabulary
# 4. Encodes via T5 encoder (up to 512 tokens)
# 5. Decodes future tokens auto-regressively
# 6. Maps token IDs → bin centers → real values
# 7. Reverses normalization: y_pred = ỹ_pred × mean(|x|)

# ── 7. CRPS evaluation ────────────────────────────────────────────────────
def crps_samples(samples_matrix, actuals):
    """CRPS from Monte Carlo samples via energy score formula."""
    n = samples_matrix.shape[0]
    e1 = np.mean(np.abs(samples_matrix - actuals), axis=0)   # E[|X-y|]
    # Approximate E[|X-X'|] via random pairs
    idx = np.random.choice(n, size=(200, 2), replace=True)
    e2 = 0.5 * np.mean(np.abs(samples_matrix[idx[:, 0]] - samples_matrix[idx[:, 1]]), axis=0)
    return np.mean(e1 - e2)

# Simulate true future
true_future = 15 * np.sin(2*np.pi*(T + np.arange(horizon))/24) + np.random.randn(horizon)
print(f"\\nCRPS: {crps_samples(s, true_future):.4f}")

# ── 8. Chronos-Bolt (fast variant) ────────────────────────────────────────
# Chronos-Bolt is a distilled, faster version using patch-based architecture
# rather than token-by-token autoregressive decoding.
# It is ~50x faster than Chronos-T5 for long horizons.
bolt = ChronosPipeline.from_pretrained(
    "amazon/chronos-bolt-small",    # fast distilled model
    device_map="cpu",
    torch_dtype=torch.float32,
)
bolt_samples = bolt.predict(context, prediction_length=horizon, num_samples=20)
print("Bolt output shape:", bolt_samples.shape)
`;

export default function ChronosArchitectureSection() {
  return (
    <SectionLayout
      title="Amazon Chronos Architecture"
      difficulty="advanced"
      readingTime={13}
    >
      <p className="text-gray-700 leading-relaxed">
        Chronos (Ansari et al., 2024) is Amazon's open-source foundation model
        for time series forecasting. Its key innovation is treating forecasting
        as a language modeling problem: continuous time-series values are
        quantized into discrete tokens, enabling a standard T5 encoder-decoder
        to be trained using ordinary cross-entropy loss — no custom architecture
        required.
      </p>

      <DefinitionBlock title="Chronos Core Idea">
        Chronos reframes time-series forecasting as{' '}
        <strong>next-token prediction</strong>. Real-valued observations are
        mapped to integer token IDs via a quantization scheme (similar to audio
        tokenization in WaveNet). A T5 language model then learns the
        conditional distribution of future tokens given historical tokens. At
        inference, sampling from the decoder produces a set of future token
        sequences — which are decoded back to real values to yield probabilistic
        forecast samples.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Step 1: Normalization
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Before tokenization, each series is normalized using{' '}
        <em>mean scaling</em>: divide by the absolute mean of the context
        window to make the representation scale-invariant:
      </p>
      <BlockMath math="\tilde{x}_t = \frac{x_t}{\mu}, \quad \mu = \frac{1}{L}\sum_{i=1}^{L} |x_i|" />
      <p className="text-gray-700 leading-relaxed mt-3">
        This is reversed at the end — predicted token values are multiplied
        back by <InlineMath math="\mu" /> to recover the original scale.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Step 2: Quantization (Tokenization)
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        The normalized values <InlineMath math="\tilde{x}" /> are discretized
        into <InlineMath math="B" /> bins (vocabulary size, typically{' '}
        <InlineMath math="B = 4096" />) whose boundaries are derived from the
        quantile distribution of the pre-training data:
      </p>
      <BlockMath math="\text{token}(\tilde{x}) = k \;\;\text{such that}\;\; b_k \leq \tilde{x} < b_{k+1}" />

      <TokenizationViz />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Step 3: T5 Encoder-Decoder
      </h2>
      <p className="text-gray-700 leading-relaxed">
        The tokenized history is passed to a T5 encoder-decoder. The encoder
        processes up to 512 history tokens; the decoder auto-regressively
        generates future tokens. Chronos is available in five sizes:
      </p>
      <div className="my-3 overflow-x-auto rounded border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {['Variant', 'Parameters', 'Context', 'Speed (CPU)', 'Recommended For'].map(h => (
                <th key={h} className="px-3 py-2 text-left text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['chronos-t5-tiny',  '8M',   '512', 'Very fast', 'Quick experiments, edge inference'],
              ['chronos-t5-mini',  '20M',  '512', 'Fast',      'CPU production, latency-sensitive'],
              ['chronos-t5-small', '46M',  '512', 'Moderate',  'Balanced accuracy/speed (default)'],
              ['chronos-t5-base',  '200M', '512', 'Slow',      'Higher accuracy, GPU recommended'],
              ['chronos-t5-large', '710M', '512', 'Very slow', 'Best accuracy, large GPU required'],
            ].map(([m, p, c, sp, use]) => (
              <tr key={m} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-3 py-2 font-mono text-xs text-gray-900">{m}</td>
                <td className="px-3 py-2 text-gray-600">{p}</td>
                <td className="px-3 py-2 text-gray-600">{c}</td>
                <td className="px-3 py-2 text-gray-600 text-xs">{sp}</td>
                <td className="px-3 py-2 text-gray-500 text-xs">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TheoremBlock title="Why Cross-Entropy on Tokens Yields Probabilistic Forecasts">
        <p>
          Training on tokenized sequences with cross-entropy loss is equivalent
          to maximizing the log-likelihood of the joint conditional:
        </p>
        <BlockMath math="\log P(\text{tok}_{T+1}, \dots, \text{tok}_{T+H} \mid \text{tok}_1, \dots, \text{tok}_T)" />
        <p className="text-sm mt-2">
          This is exactly the probabilistic forecasting objective. The softmax
          distribution over future tokens defines a categorical distribution
          over quantized future values at each horizon step. Sampling from the
          decoder auto-regressively generates a coherent sample path over the
          entire forecast horizon — capturing joint distributional structure
          (including correlations across forecast steps), not just marginals.
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Training Data: Real + Synthetic
      </h2>
      <p className="text-gray-700 leading-relaxed">
        A distinctive design choice is the use of <strong>synthetic time
        series</strong> alongside real data. Synthetic series are sampled from
        statistical processes (Gaussian, Student-t, ARMA, ETS) with randomized
        parameters. This:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 text-sm">
        <li>Covers rare distributional shapes underrepresented in real datasets</li>
        <li>Provides theoretically unlimited training data</li>
        <li>Helps the model learn general temporal principles rather than domain artifacts</li>
      </ul>

      <ExampleBlock title="Chronos-Bolt: The Fast Distilled Variant">
        <p className="text-sm text-gray-700">
          Chronos-Bolt replaces the token-by-token autoregressive decoding with
          a <em>patched</em> architecture that predicts multiple future steps
          in parallel (similar to PatchTST). It is ~50× faster than the base
          Chronos-T5 for long horizons, with only a small accuracy trade-off.
          For production deployments where throughput matters,{' '}
          <code>chronos-bolt-small</code> or{' '}
          <code>chronos-bolt-base</code> are recommended over the T5 variants.
        </p>
      </ExampleBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Implementation</h2>
      <PythonCode code={chronosArchCode} />

      <WarningBlock title="512-Token Context Limit">
        All Chronos T5 models are limited to 512 context tokens. Input series
        longer than 512 steps are automatically truncated to the most recent
        512 values. For hourly data, this is only ~21 days of context. If your
        series has strong long-range seasonality (annual), consider aggregating
        to daily or weekly frequency before passing to Chronos, or use a model
        with a longer context (TimesFM: 512+ steps).
      </WarningBlock>

      <NoteBlock title="Working with Chronos Probabilistic Outputs">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li>Chronos outputs sample paths via <code>num_samples</code>. Compute quantiles post-hoc: <code>np.percentile(samples, [10, 50, 90], axis=0)</code>.</li>
          <li>For point forecasts, use the median of samples (more robust than the mean).</li>
          <li>Use CRPS (Continuous Ranked Probability Score) for rigorous probabilistic evaluation.</li>
          <li>Increase <code>num_samples</code> to 100–200 for stable quantile estimates; 20 is sufficient for the median.</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Ansari, A. F., Stella, L., Turkmen, C., et al.', year: 2024, title: 'Chronos: Learning the Language of Time Series', venue: 'Transactions on Machine Learning Research' },
        { author: 'Raffel, C., et al.', year: 2020, title: 'Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer', venue: 'JMLR (T5)' },
        { author: 'van den Oord, A., et al.', year: 2016, title: 'WaveNet: A Generative Model for Raw Audio', venue: 'arXiv' },
      ]} />
    </SectionLayout>
  );
}
