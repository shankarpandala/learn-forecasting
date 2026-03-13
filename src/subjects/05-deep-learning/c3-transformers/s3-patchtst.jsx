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

function PatchVsPointViz() {
  const [patchSize, setPatchSize] = useState(16);
  const T = 96;
  const nPatches = Math.ceil(T / patchSize);
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">Patch Tokenization vs Point Tokenization</h4>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-sm text-gray-600">Patch size:</span>
        {[8, 16, 32].map(p => (
          <button key={p} onClick={() => setPatchSize(p)}
            className={`px-3 py-1 rounded text-sm border transition-all ${patchSize === p ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-700 border-gray-300'}`}>
            P={p}
          </button>
        ))}
      </div>
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Point tokens (T={T} tokens, O(T²) attention):</p>
        <div className="flex flex-wrap gap-0.5">
          {Array.from({ length: T }, (_, i) => (
            <div key={i} className="w-3 h-4 bg-gray-300 rounded-sm" />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Patch tokens ({nPatches} patches, O({nPatches}²) attention — {Math.round((T*T)/(nPatches*nPatches))}× reduction):</p>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: nPatches }, (_, i) => (
            <div key={i}
              className="h-6 bg-rose-400 rounded flex items-center justify-center text-white text-xs font-mono"
              style={{ width: `${patchSize * 3}px` }}>
              P{i+1}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Attention cost: {T}²={T*T} (point) vs {nPatches}²={nPatches*nPatches} (patch) — {Math.round((T*T)/(nPatches*nPatches))}× cheaper.
      </p>
    </div>
  );
}

const patchTSTCode = `from neuralforecast import NeuralForecast
from neuralforecast.models import PatchTST
from neuralforecast.losses.pytorch import MAE, MQLoss
import pandas as pd
import numpy as np

# ── 1. ETT-style hourly dataset ────────────────────────────────────────────
np.random.seed(0)
T = 2000
dates = pd.date_range('2016-07-01', periods=T, freq='h')
t  = np.arange(T)
y  = (15 * np.sin(2*np.pi*t/24) +         # daily seasonality
      8  * np.sin(2*np.pi*t/(24*7)) +      # weekly seasonality
      0.5 * np.random.randn(T))
df = pd.DataFrame({'unique_id': 'ETT', 'ds': dates, 'y': y})

# ── 2. PatchTST for point forecasting ─────────────────────────────────────
# patch_len: number of time steps per patch (token)
# stride:    step between consecutive patches (stride < patch_len = overlap)
# Channel independence: each variate processed independently
horizon = 96

model_point = PatchTST(
    h=horizon,
    input_size=512,          # large look-back for long-horizon
    patch_len=16,            # 16-step patches → 32 tokens for input_size=512
    stride=8,                # 50% overlap between patches
    d_model=128,
    n_heads=16,
    d_ff=256,
    dropout=0.2,
    loss=MAE(),
    max_steps=1000,
    learning_rate=5e-4,
    batch_size=32,
    random_seed=42,
)

nf = NeuralForecast(models=[model_point], freq='h')
nf.fit(df)
pred = nf.predict()
print(pred.head())

# ── 3. Number of patches and effective attention complexity ────────────────
input_size = 512
patch_len  = 16
stride     = 8
n_patches  = (input_size - patch_len) // stride + 1
print(f"Input steps: {input_size}")
print(f"Number of patches: {n_patches}")
print(f"Attention complexity ratio: {input_size**2 / n_patches**2:.1f}x cheaper than point tokens")

# ── 4. iTransformer conceptual difference ─────────────────────────────────
# Standard Transformer: token = time step, attention = "which time steps relate?"
# iTransformer:         token = VARIATE,   attention = "which variables relate?"

# In NeuralForecast / pytorch-forecasting, iTransformer treats the
# multivariate series where each variable becomes a token of length T,
# and attention is computed across variates rather than across time.
# This is particularly useful for multivariate forecasting with many
# correlated variables (e.g., electricity consumption across 321 sensors).

# Example: with 321 variates, iTransformer computes 321×321 attention
# instead of T×T — very efficient when T >> N_variates.
N_variates = 321
T_len = 720
print(f"\\nMultivariate attention comparison (T={T_len}, N={N_variates}):")
print(f"  Standard (time attention): {T_len}² = {T_len**2:,} operations")
print(f"  iTransformer (variate attention): {N_variates}² = {N_variates**2:,} operations")
print(f"  iTransformer is {T_len**2 // N_variates**2}x cheaper for this dataset")
`;

export default function PatchTSTSection() {
  return (
    <SectionLayout
      title="PatchTST and iTransformer"
      difficulty="advanced"
      readingTime={12}
    >
      <p className="text-gray-700 leading-relaxed">
        Two innovations address the core limitations of vanilla Transformers for
        time-series forecasting: <strong>PatchTST</strong> reduces quadratic
        complexity by grouping time steps into patches (like ViT for images), and{' '}
        <strong>iTransformer</strong> inverts the attention axis to operate across
        variates rather than time steps — both dramatically improving long-horizon
        forecasting performance.
      </p>

      <DefinitionBlock title="Patch-Based Tokenization (PatchTST)">
        Instead of treating each time step as a token (producing <InlineMath math="T" />{' '}
        tokens), PatchTST divides the input series into non-overlapping or
        overlapping windows of length <InlineMath math="P" /> (the patch size),
        producing <InlineMath math="\lceil T/P \rceil" /> tokens. Each patch is
        linearly projected to a <InlineMath math="d_\text{model}" />-dimensional
        embedding. This reduces attention complexity from{' '}
        <InlineMath math="O(T^2)" /> to{' '}
        <InlineMath math="O((T/P)^2)" /> — a <InlineMath math="P^2" />-fold
        reduction.
      </DefinitionBlock>

      <PatchVsPointViz />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Channel Independence in PatchTST
      </h2>
      <p className="text-gray-700 leading-relaxed">
        PatchTST processes each variate <em>independently</em> — a design choice
        called <strong>channel independence (CI)</strong>. For a dataset with{' '}
        <InlineMath math="C" /> variates, PatchTST creates{' '}
        <InlineMath math="C" /> separate instances of the same Transformer
        (shared weights), one per variate. This:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 text-sm">
        <li>Prevents cross-variate noise contamination in high-dimensional panels.</li>
        <li>Enables the model to scale to arbitrary numbers of variates.</li>
        <li>Surprisingly outperforms channel-mixing approaches on most long-horizon benchmarks.</li>
      </ul>

      <TheoremBlock title="Patch Semantics: Local vs. Global Context">
        <p>
          A single time-step token carries only a scalar value — almost no
          semantic content for the Transformer to work with. A patch token
          carries a short time series segment, encoding local patterns (mini
          trends, short cycles, volatility clusters) in a single embedding.
          This is analogous to image patches in Vision Transformers: a single
          pixel (scalar) provides little information, but a 16×16 patch carries
          local texture and structure.
        </p>
        <p className="text-sm mt-2">
          Empirically, PatchTST achieves 20–40% lower MSE on ETT benchmarks
          compared to point-token Transformers (Informer, Autoformer) with the
          same model size.
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        iTransformer: Inverted Attention
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Liu et al. (2024) propose a conceptual inversion of the Transformer for
        multivariate forecasting: instead of treating{' '}
        <em>time steps</em> as tokens and computing attention across time,
        iTransformer treats <em>variates</em> as tokens and computes attention
        across variates.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        For each variate <InlineMath math="i" />, its entire look-back window
        is embedded as a single token:{' '}
        <InlineMath math="\mathbf{t}_i = \text{Linear}(x_i^{1:T}) \in \mathbb{R}^d" />.
        The Transformer then computes:
      </p>
      <BlockMath math="\text{Attention}(Q, K, V) \text{ where each token } = \text{one variate}" />
      <p className="text-gray-700 leading-relaxed mt-3">
        This is efficient when the number of variates{' '}
        <InlineMath math="N \ll T" /> (e.g., 321 sensors × 720 time steps), and
        captures inter-variate correlations instead of temporal correlations.
      </p>

      <div className="my-4 overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Aspect</th>
              <th className="px-4 py-2 text-left text-gray-700">PatchTST</th>
              <th className="px-4 py-2 text-left text-gray-700">iTransformer</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Token definition', 'Time-step patch (P consecutive steps)', 'One full variate (T steps)'],
              ['Attention axis', 'Across time (patches)', 'Across variates'],
              ['Complexity', 'O((T/P)²)', 'O(N²)'],
              ['Best for', 'Long sequences (T ≫ N)', 'Many correlated variates (N ≫ T/P)'],
              ['Channel interaction', 'None (CI)', 'Full cross-variate attention'],
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

      <ExampleBlock title="Choosing Patch Size and Stride">
        <p className="text-sm text-gray-700">
          Common settings from the original paper:{' '}
          <code>patch_len=16, stride=8</code> (50% overlap) for hourly data.
          Larger patches reduce the token count further but lose fine-grained
          temporal resolution. Overlapping patches (stride {'<'} patch_len) improve
          boundary continuity. A good starting point: set the patch size to
          approximately the dominant short cycle (e.g., 24 for hourly daily cycle,
          7 for daily weekly cycle).
        </p>
      </ExampleBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Implementation</h2>
      <PythonCode code={patchTSTCode} />

      <WarningBlock title="Input Size Must Be Divisible">
        PatchTST requires that the input window size, patch length, and stride
        are consistent. With non-overlapping patches, set{' '}
        <code>input_size = N × patch_len</code> for some integer{' '}
        <InlineMath math="N" />. With overlapping patches and stride{' '}
        <code>s</code>, check that <code>(input_size - patch_len) % stride == 0</code>.
        Inconsistent settings will cause shape errors in the embedding layer.
      </WarningBlock>

      <NoteBlock title="When to Use PatchTST vs. iTransformer">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li><strong>PatchTST:</strong> univariate or low-dimensional multivariate long-horizon forecasting. Best when T is large and cross-variate correlation is less important.</li>
          <li><strong>iTransformer:</strong> high-dimensional multivariate datasets (many correlated sensors or assets) where cross-variate dependencies drive predictability.</li>
          <li>Both significantly outperform vanilla Transformers on standard benchmarks; choose based on your data dimensionality profile.</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Nie, Y., Nguyen, N. H., Sinthong, P., & Kalagnanam, J.', year: 2023, title: 'A Time Series is Worth 64 Words: Long-term Forecasting with Transformers', venue: 'ICLR' },
        { author: 'Liu, Y., Hu, T., Zhang, H., et al.', year: 2024, title: 'iTransformer: Inverted Transformers Are Effective for Time Series Forecasting', venue: 'ICLR' },
        { author: 'Dosovitskiy, A., et al.', year: 2021, title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale', venue: 'ICLR' },
      ]} />
    </SectionLayout>
  );
}
