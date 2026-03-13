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

function AttentionMatrixViz() {
  const [seqLen, setSeqLen] = useState(6);
  const [mode, setMode] = useState('full');

  const isMasked = (i, j) => mode === 'causal' && j > i;

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">Attention Matrix Visualization</h4>
      <div className="flex gap-4 mb-4 flex-wrap items-center">
        <div className="flex gap-2">
          {[4, 6, 8].map(n => (
            <button key={n} onClick={() => setSeqLen(n)}
              className={`px-3 py-1 rounded text-sm border transition-all ${seqLen === n ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-700 border-gray-300'}`}>
              T={n}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {[['full', 'Full'], ['causal', 'Causal (masked)']].map(([v, l]) => (
            <button key={v} onClick={() => setMode(v)}
              className={`px-3 py-1 rounded text-sm border transition-all ${mode === v ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-700 border-gray-300'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: seqLen }, (_, j) => (
          <div key={j} className="flex flex-col gap-1">
            {Array.from({ length: seqLen }, (_, i) => (
              <div key={i}
                className={`w-7 h-7 rounded text-xs flex items-center justify-center font-mono border ${
                  isMasked(i, j)
                    ? 'bg-gray-200 border-gray-300 text-gray-400'
                    : i === j
                      ? 'bg-violet-500 text-white border-violet-600'
                      : 'bg-violet-100 border-violet-200 text-violet-800'
                }`}>
                {isMasked(i, j) ? '−∞' : 'α'}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Rows = queries (output positions), Columns = keys (input positions).
        {mode === 'causal' ? ' Causal masking sets future positions to −∞ before softmax.' : ' Full attention: every position attends to all others — O(T²) cost.'}
      </p>
    </div>
  );
}

const attentionCode = `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

# ── 1. Scaled Dot-Product Attention ────────────────────────────────────────
def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q: (B, heads, T_q, d_k)
    K: (B, heads, T_k, d_k)
    V: (B, heads, T_k, d_v)
    Returns: (B, heads, T_q, d_v), attention weights
    """
    d_k    = Q.shape[-1]
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)  # (B, H, T_q, T_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    weights = F.softmax(scores, dim=-1)
    output  = torch.matmul(weights, V)
    return output, weights


# ── 2. Multi-Head Attention Module ─────────────────────────────────────────
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model=128, num_heads=8):
        super().__init__()
        assert d_model % num_heads == 0
        self.d_k     = d_model // num_heads
        self.heads   = num_heads
        self.W_Q     = nn.Linear(d_model, d_model)
        self.W_K     = nn.Linear(d_model, d_model)
        self.W_V     = nn.Linear(d_model, d_model)
        self.W_out   = nn.Linear(d_model, d_model)

    def split_heads(self, x):
        B, T, D = x.shape
        return x.view(B, T, self.heads, self.d_k).transpose(1, 2)  # (B, H, T, d_k)

    def forward(self, query, key, value, mask=None):
        Q = self.split_heads(self.W_Q(query))
        K = self.split_heads(self.W_K(key))
        V = self.split_heads(self.W_V(value))
        x, attn_w = scaled_dot_product_attention(Q, K, V, mask)
        x = x.transpose(1, 2).contiguous().view(query.shape[0], -1, self.heads * self.d_k)
        return self.W_out(x), attn_w


# ── 3. Positional Encoding ─────────────────────────────────────────────────
class SinusoidalPositionalEncoding(nn.Module):
    def __init__(self, d_model=128, max_len=5000):
        super().__init__()
        pe   = torch.zeros(max_len, d_model)
        pos  = torch.arange(max_len).unsqueeze(1).float()
        div  = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(pos * div)
        pe[:, 1::2] = torch.cos(pos * div)
        self.register_buffer('pe', pe.unsqueeze(0))   # (1, max_len, d_model)

    def forward(self, x):
        return x + self.pe[:, :x.size(1)]


# ── 4. Transformer Encoder Layer ───────────────────────────────────────────
class TransformerEncoderLayer(nn.Module):
    def __init__(self, d_model=128, num_heads=8, ff_dim=256, dropout=0.1):
        super().__init__()
        self.attn    = MultiHeadAttention(d_model, num_heads)
        self.ff      = nn.Sequential(
            nn.Linear(d_model, ff_dim),
            nn.ReLU(),
            nn.Linear(ff_dim, d_model),
        )
        self.norm1   = nn.LayerNorm(d_model)
        self.norm2   = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        # Pre-norm (more stable than post-norm for long training)
        attn_out, _ = self.attn(self.norm1(x), self.norm1(x), self.norm1(x), mask)
        x = x + self.dropout(attn_out)
        x = x + self.dropout(self.ff(self.norm2(x)))
        return x


# ── 5. Simple Transformer Forecaster ──────────────────────────────────────
class TransformerForecaster(nn.Module):
    def __init__(self, input_dim=1, d_model=64, num_heads=4,
                 num_layers=3, horizon=24, dropout=0.1):
        super().__init__()
        self.input_proj = nn.Linear(input_dim, d_model)
        self.pos_enc    = SinusoidalPositionalEncoding(d_model)
        self.layers     = nn.ModuleList([
            TransformerEncoderLayer(d_model, num_heads, d_model * 4, dropout)
            for _ in range(num_layers)
        ])
        self.fc_out     = nn.Linear(d_model, horizon)

    def forward(self, x):
        # x: (B, T, input_dim)
        h = self.pos_enc(self.input_proj(x))
        for layer in self.layers:
            h = layer(h)
        # Use average pooling over time, then project to horizon
        return self.fc_out(h.mean(dim=1))   # (B, horizon)

# Test forward pass
model = TransformerForecaster(input_dim=1, d_model=64, horizon=24)
x     = torch.randn(16, 96, 1)   # (batch=16, lookback=96, features=1)
print("Output shape:", model(x).shape)   # torch.Size([16, 24])

# Complexity: O(T^2 * d) — with T=96, d=64: ~590K multiplications per layer
# For T=10000, this becomes 10000^2 * 64 = 6.4 billion — intractable
T_values = [96, 512, 1000, 2000]
for T in T_values:
    ops = T ** 2 * 64
    print(f"  T={T:5d}: {ops/1e6:.1f}M operations per layer")
`;

export default function AttentionBasicsSection() {
  return (
    <SectionLayout
      title="Attention Mechanisms for Sequences"
      difficulty="advanced"
      readingTime={14}
    >
      <p className="text-gray-700 leading-relaxed">
        The attention mechanism is the central innovation behind Transformer
        models. Unlike RNNs that process sequences step by step, attention
        allows every position in a sequence to directly communicate with every
        other position in a single operation — enabling parallelism and capturing
        long-range dependencies that recurrence struggles with.
      </p>

      <DefinitionBlock title="Scaled Dot-Product Attention">
        Given query matrix <InlineMath math="\mathbf{Q}" />, key matrix{' '}
        <InlineMath math="\mathbf{K}" />, and value matrix{' '}
        <InlineMath math="\mathbf{V}" /> (each of shape{' '}
        <InlineMath math="T \times d_k" />), the attention output is:
        <BlockMath math="\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V" />
        The scaling factor <InlineMath math="1/\sqrt{d_k}" /> prevents the dot
        products from growing too large in magnitude, which would push the
        softmax into saturation regions with near-zero gradients.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Self-Attention in Time Series
      </h2>
      <p className="text-gray-700 leading-relaxed">
        In <strong>self-attention</strong>, queries, keys, and values all derive
        from the same sequence. For a time series of length <InlineMath math="T" />,
        this produces a <InlineMath math="T \times T" /> attention matrix where
        entry <InlineMath math="\alpha_{ij}" /> quantifies how much time step{' '}
        <InlineMath math="i" /> attends to time step <InlineMath math="j" />.
        This allows the model to capture non-local seasonal patterns (e.g., same
        day last week/year) without any inductive temporal bias.
      </p>

      <AttentionMatrixViz />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Multi-Head Attention
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Instead of a single attention function, multi-head attention runs{' '}
        <InlineMath math="h" /> parallel attention heads, each projecting to a
        lower-dimensional subspace:
      </p>
      <BlockMath math="\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)\,W^O" />
      <BlockMath math="\text{head}_i = \text{Attention}(QW_i^Q,\; KW_i^K,\; VW_i^V)" />
      <p className="text-gray-700 leading-relaxed mt-3">
        Different heads can specialize: one head might capture short-range
        correlations, another might learn annual seasonality, another might focus
        on trend-reversal patterns.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Positional Encoding
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Self-attention is <em>permutation-invariant</em> — it has no built-in
        notion of "earlier" vs. "later." To preserve temporal order, a positional
        encoding <InlineMath math="\mathbf{PE}(t)" /> is added to each input
        embedding. The classic sinusoidal encoding from Vaswani et al. (2017):
      </p>
      <BlockMath math="\text{PE}(t, 2i) = \sin\!\left(\frac{t}{10000^{2i/d}}\right),\quad \text{PE}(t, 2i{+}1) = \cos\!\left(\frac{t}{10000^{2i/d}}\right)" />
      <p className="text-gray-700 leading-relaxed mt-3">
        For time series, <em>learned positional embeddings</em> or{' '}
        <em>timestamp features</em> (hour-of-day, day-of-week, month-of-year)
        often work better than sinusoidal encodings because they directly encode
        meaningful calendar periodicity.
      </p>

      <TheoremBlock title="The Quadratic Complexity Problem">
        <p>
          The attention operation computes a{' '}
          <InlineMath math="T \times T" /> matrix, making its time and memory
          complexity <InlineMath math="O(T^2 d)" />. For{' '}
          <InlineMath math="T = 10{,}000" /> steps (less than 2 weeks of
          minute-level data), this is computationally intractable on commodity
          hardware. This is why vanilla Transformers are rarely applied to very
          long time series without modifications:
        </p>
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li><strong>Sparse attention</strong> (Informer, LogTrans): attend only to a subset of positions.</li>
          <li><strong>Patch tokenization</strong> (PatchTST): group consecutive time steps into patches, reducing sequence length by the patch size.</li>
          <li><strong>Linear attention</strong> (Flowformer): approximate the softmax kernel to achieve <InlineMath math="O(T)" /> complexity.</li>
        </ul>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        The Full Transformer Block
      </h2>
      <p className="text-gray-700 leading-relaxed">
        A Transformer encoder layer consists of two sub-layers, each wrapped in
        a residual connection and layer normalization:
      </p>
      <ol className="list-decimal ml-6 mt-2 space-y-2 text-gray-700 text-sm">
        <li>
          <strong>Multi-head self-attention:</strong>{' '}
          <InlineMath math="x' = \text{LayerNorm}(x + \text{MultiHead}(x, x, x))" />
        </li>
        <li>
          <strong>Position-wise feed-forward network:</strong>{' '}
          <InlineMath math="x'' = \text{LayerNorm}(x' + \text{FFN}(x'))" />
          where <InlineMath math="\text{FFN}(x) = W_2 \text{ReLU}(W_1 x + b_1) + b_2" />
        </li>
      </ol>

      <ExampleBlock title="Causal vs. Non-Causal Attention in Forecasting">
        <p className="text-sm text-gray-700">
          Encoder-only architectures (like PatchTST) use <em>non-causal</em>{' '}
          (bidirectional) attention: the model sees the entire look-back window
          at once, similar to BERT. Auto-regressive decoder architectures (like
          the original Transformer) use <em>causal</em> (masked) attention:
          position <InlineMath math="t" /> can only attend to{' '}
          <InlineMath math="\leq t" />. For forecasting, non-causal encoders are
          more common since the input window is always fully observed.
        </p>
      </ExampleBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Implementation</h2>
      <PythonCode code={attentionCode} />

      <WarningBlock title="Transformers Are Not Always Better for Short Time Series">
        Extensive benchmarks (Zeng et al., 2023) show that a simple linear model
        often matches or outperforms complex Transformer architectures on
        univariate long-horizon benchmarks. The key issue is the{' '}
        <em>point permutation problem</em>: if you permute time steps randomly,
        a vanilla Transformer's loss barely changes, showing it may not exploit
        temporal order effectively. Modern fixes include patch-based tokenization
        (PatchTST) and channel-mixing (iTransformer).
      </WarningBlock>

      <NoteBlock title="Key Takeaways">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li>Attention complexity is <InlineMath math="O(T^2)" /> — use patches or sparse variants for long series.</li>
          <li>Multi-head attention lets different heads specialize in different temporal patterns.</li>
          <li>Positional encoding is critical — sinusoidal or learned timestamp features.</li>
          <li>For short-to-medium horizons, simple models (linear, N-BEATS) are strong baselines before adding Transformer complexity.</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Vaswani, A., et al.', year: 2017, title: 'Attention Is All You Need', venue: 'NeurIPS' },
        { author: 'Zhou, H., et al.', year: 2021, title: 'Informer: Beyond Efficient Transformer for Long Sequence Time-Series Forecasting', venue: 'AAAI' },
        { author: 'Zeng, A., Chen, M., Zhang, L., & Xu, Q.', year: 2023, title: 'Are Transformers Effective for Time Series Forecasting?', venue: 'AAAI' },
        { author: 'Nie, Y., et al.', year: 2023, title: 'A Time Series is Worth 64 Words: Long-term Forecasting with Transformers', venue: 'ICLR' },
      ]} />
    </SectionLayout>
  );
}
