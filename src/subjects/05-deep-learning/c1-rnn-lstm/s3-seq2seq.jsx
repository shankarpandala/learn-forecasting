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

function AttentionDiagram() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: 'Encode inputs', desc: 'The encoder LSTM processes x₁,…,xT step by step. At every step it produces a hidden state hᵢ. All hidden states are retained — not only the final one.' },
    { label: 'Compute alignment scores', desc: 'At decoder step t, an alignment score e(sₜ₋₁, hᵢ) measures how relevant encoder state hᵢ is to the current decoding context. Common choices: dot-product or additive (Bahdanau) scoring.' },
    { label: 'Softmax weights', desc: 'Scores are normalized with softmax to produce attention weights αᵢ ∈ (0,1) that sum to 1. High αᵢ tells the decoder to focus on encoder position i.' },
    { label: 'Context vector', desc: 'A context vector cₜ = Σ αᵢ hᵢ is formed as a weighted combination of all encoder states. It summarizes the most relevant past information.' },
    { label: 'Decode & predict', desc: 'The decoder combines cₜ with its own recurrent state sₜ and produces the forecast ŷₜ. Steps 2–5 repeat for every horizon step H.' },
  ];
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">Attention in Seq2Seq — Step by Step</h4>
      <div className="flex gap-2 mb-4 flex-wrap">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`px-3 py-1 rounded text-sm font-medium border transition-all ${
              step === i
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
        {steps[step].desc}
      </div>
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <div className="flex gap-1">
          {['h₁', 'h₂', 'h₃', 'h₄'].map((h, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded flex items-center justify-center text-xs font-mono border-2 transition-all ${
                step >= 2
                  ? 'bg-green-100 border-green-400 text-green-800'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
            >
              {h}
            </div>
          ))}
        </div>
        <div className="text-gray-400 text-lg">→</div>
        <div
          className={`w-12 h-10 rounded flex items-center justify-center text-xs font-mono border-2 transition-all ${
            step >= 3
              ? 'bg-orange-100 border-orange-400 text-orange-800'
              : 'bg-gray-100 border-gray-300 text-gray-600'
          }`}
        >
          cₜ
        </div>
        <div className="text-gray-400 text-lg">→</div>
        <div
          className={`w-12 h-10 rounded flex items-center justify-center text-xs font-mono border-2 transition-all ${
            step >= 4
              ? 'bg-purple-100 border-purple-400 text-purple-800'
              : 'bg-gray-100 border-gray-300 text-gray-600'
          }`}
        >
          ŷₜ
        </div>
      </div>
    </div>
  );
}

const seq2seqCode = `import torch
import torch.nn as nn
from neuralforecast import NeuralForecast
from neuralforecast.models import MQRNN
from neuralforecast.losses.pytorch import MQLoss
import pandas as pd
import numpy as np

# ── 1. Toy panel dataset ───────────────────────────────────────────────────
np.random.seed(42)
n_series, T = 50, 120
records = []
for uid in range(n_series):
    dates = pd.date_range('2019-01-01', periods=T, freq='W')
    trend    = np.linspace(0, 2, T)
    seasonal = np.sin(2 * np.pi * np.arange(T) / 52)
    noise    = 0.3 * np.random.randn(T)
    y = 100 + 20 * trend + 10 * seasonal + noise
    for d, v in zip(dates, y):
        records.append({'unique_id': f'series_{uid}', 'ds': d, 'y': float(v)})

df = pd.DataFrame(records)

# ── 2. MQRNN model (encoder-decoder with quantile outputs) ─────────────────
horizon = 12
model = MQRNN(
    h=horizon,
    max_steps=300,
    encoder_hidden_size=64,
    encoder_n_layers=2,
    decoder_hidden_size=64,
    decoder_layers=2,
    loss=MQLoss(level=[10, 50, 90]),
    input_size=3 * horizon,        # look-back = 36 weeks
    learning_rate=1e-3,
    batch_size=32,
    random_seed=42,
)

nf = NeuralForecast(models=[model], freq='W')
nf.fit(df)
forecasts = nf.predict()
print(forecasts.head())
# Columns: unique_id, ds, MQRNN-lo-10, MQRNN-median, MQRNN-hi-90

# ── 3. Manual PyTorch Seq2Seq with additive attention ─────────────────────
class Seq2SeqForecaster(nn.Module):
    """Encoder-LSTM + Decoder-LSTM with Bahdanau attention."""

    def __init__(self, input_size=1, hidden=64, horizon=12):
        super().__init__()
        self.horizon = horizon
        self.encoder = nn.LSTM(input_size, hidden, batch_first=True)
        self.decoder = nn.LSTM(1, hidden, batch_first=True)
        self.attn_W  = nn.Linear(hidden * 2, hidden)
        self.attn_v  = nn.Linear(hidden, 1, bias=False)
        self.fc_out  = nn.Linear(hidden, 1)

    def attention(self, s, enc_out):
        # s: (B, 1, H)  enc_out: (B, T, H)
        s_exp  = s.expand_as(enc_out)
        score  = self.attn_v(torch.tanh(self.attn_W(torch.cat([s_exp, enc_out], -1))))
        alpha  = torch.softmax(score, dim=1)           # (B, T, 1)
        ctx    = (alpha * enc_out).sum(dim=1, keepdim=True)
        return ctx

    def forward(self, x, teacher_forcing_ratio=0.5, target=None):
        enc_out, (h, c) = self.encoder(x)
        dec_in = x[:, -1:, :]       # start token = last observation
        preds  = []
        for t in range(self.horizon):
            dec_out, (h, c) = self.decoder(dec_in, (h, c))
            ctx  = self.attention(dec_out, enc_out)
            pred = self.fc_out(dec_out + ctx)          # (B, 1, 1)
            preds.append(pred)
            use_tf = (target is not None and
                      torch.rand(1).item() < teacher_forcing_ratio)
            dec_in = target[:, t:t+1, :] if use_tf else pred
        return torch.cat(preds, dim=1).squeeze(-1)     # (B, H)

model_pt = Seq2SeqForecaster(input_size=1, hidden=64, horizon=12)
x_dummy  = torch.randn(8, 36, 1)
print("Output shape:", model_pt(x_dummy).shape)   # torch.Size([8, 12])
`;

export default function Seq2SeqSection() {
  return (
    <SectionLayout
      title="Seq2Seq and Encoder-Decoder Architectures"
      difficulty="advanced"
      readingTime={14}
    >
      <p className="text-gray-700 leading-relaxed">
        Sequence-to-sequence (Seq2Seq) models separate the task of{' '}
        <em>reading</em> historical data from the task of <em>generating</em> future
        values. Originally developed for machine translation, they became a natural
        fit for multi-step time-series forecasting because they handle variable-length
        inputs and outputs without requiring a fixed horizon at model definition time.
      </p>

      <DefinitionBlock title="Encoder-Decoder Architecture">
        An encoder-decoder model consists of two recurrent networks. The{' '}
        <strong>encoder</strong> maps an input sequence{' '}
        <InlineMath math="x_1, \dots, x_T" /> to a context representation{' '}
        <InlineMath math="\mathbf{c}" />. The <strong>decoder</strong> then
        auto-regressively generates the forecast{' '}
        <InlineMath math="\hat{y}_1, \dots, \hat{y}_H" /> conditioned on{' '}
        <InlineMath math="\mathbf{c}" /> and previously generated values.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">The Information Bottleneck Problem</h2>
      <p className="text-gray-700 leading-relaxed">
        In the vanilla Seq2Seq design the encoder compresses the entire input
        history into a <em>single</em> fixed-size vector — its final hidden state.
        For long sequences this creates an information bottleneck: early time steps
        get "forgotten" before the decoder begins. The attention mechanism eliminates
        this bottleneck by giving the decoder direct access to{' '}
        <em>all</em> encoder hidden states.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Attention Mechanism</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Bahdanau et al. (2015) introduced additive attention. At decoder step{' '}
        <InlineMath math="t" />, an alignment score between the previous decoder
        state <InlineMath math="\mathbf{s}_{t-1}" /> and encoder state{' '}
        <InlineMath math="\mathbf{h}_i" /> is computed:
      </p>
      <BlockMath math="e_{ti} = \mathbf{v}^\top \tanh\!\bigl(\mathbf{W}_1\,\mathbf{s}_{t-1} + \mathbf{W}_2\,\mathbf{h}_i\bigr)" />
      <p className="text-gray-700 leading-relaxed mt-4 mb-4">
        Scores are normalized with softmax to obtain attention weights:
      </p>
      <BlockMath math="\alpha_{ti} = \frac{\exp(e_{ti})}{\sum_{j=1}^{T}\exp(e_{tj})}" />
      <p className="text-gray-700 leading-relaxed mt-4 mb-2">
        The context vector is the weighted sum of all encoder states:
      </p>
      <BlockMath math="\mathbf{c}_t = \sum_{i=1}^{T} \alpha_{ti}\,\mathbf{h}_i" />

      <AttentionDiagram />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Teacher Forcing</h2>
      <p className="text-gray-700 leading-relaxed">
        During training, the decoder can receive either its own previous
        prediction <InlineMath math="\hat{y}_{t-1}" /> or the true ground-truth
        value <InlineMath math="y_{t-1}" /> as input for the next step. Using
        ground-truth inputs is called <strong>teacher forcing</strong>. It
        accelerates convergence by providing clean gradients, but creates a
        mismatch between training and inference — at test time, true values are
        unavailable and errors can compound.
      </p>
      <WarningBlock title="Exposure Bias">
        With a 100% teacher-forcing ratio the model never learns to recover from
        its own prediction errors. A common remedy is <em>scheduled sampling</em>:
        start with high teacher-forcing probability and linearly decay it over
        training so the model progressively learns to condition on its own outputs.
      </WarningBlock>

      <TheoremBlock title="MQRNN: Multi-Quantile RNN">
        <p>
          Wen et al. (2017) proposed MQRNN with two key design choices over vanilla
          Seq2Seq:
        </p>
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li>
            <strong>Global encoder, local decoder:</strong> one shared encoder LSTM
            processes the look-back window; a lightweight MLP decoder is applied
            independently per horizon step, enabling fully parallel decoding.
          </li>
          <li>
            <strong>Simultaneous quantile outputs:</strong> a single forward pass
            produces forecasts at multiple quantile levels via the pinball loss:
          </li>
        </ul>
        <BlockMath math="\mathcal{L}_q(\hat{y}, y) = \max\!\bigl(q(y - \hat{y}),\;(q-1)(y - \hat{y})\bigr)" />
        <p className="text-sm mt-2">
          The parallel decoder makes MQRNN significantly faster than
          auto-regressive decoders for long horizons.
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Global vs. Local Training</h2>
      <p className="text-gray-700 leading-relaxed">
        Seq2Seq models for production forecasting are trained on panels of many
        time series simultaneously. The encoder learns{' '}
        <em>global patterns</em> shared across all series (seasonality shapes,
        trend dynamics), while per-series embeddings concatenated at the decoder
        capture <em>local characteristics</em>. This global-local design is
        central to both MQRNN and DeepAR and allows zero-shot forecasting on new
        series with similar dynamics.
      </p>

      <ExampleBlock title="Choosing Input Window vs. Horizon">
        <p className="text-sm text-gray-700">
          A practical rule is to set the encoder look-back to{' '}
          <InlineMath math="2\text{–}3\times H" /> where <InlineMath math="H" />{' '}
          is the forecast horizon. For weekly data with a 12-step horizon, a
          look-back of 24–36 steps covers at least one full seasonal cycle while
          keeping the encoder compact. Using too short a look-back discards
          seasonal information; too long a window adds computation without
          commensurate accuracy improvement.
        </p>
      </ExampleBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Covariates in Encoder-Decoder Models
      </h2>
      <p className="text-gray-700 leading-relaxed">
        A key advantage of the Seq2Seq framework is the ability to incorporate
        covariates naturally:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 text-sm">
        <li>
          <strong>Past covariates</strong> (e.g., lagged promotions, weather
          actuals) are concatenated with the target at encoder input time steps.
        </li>
        <li>
          <strong>Future known covariates</strong> (e.g., planned promotions,
          calendar features) are fed to the decoder at each step, allowing the
          model to condition its forecast on known future information.
        </li>
        <li>
          <strong>Static metadata</strong> (e.g., product category, store region)
          is projected to an embedding and concatenated at every time step of both
          encoder and decoder.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Implementation</h2>
      <PythonCode code={seq2seqCode} />

      <NoteBlock title="When to Use Seq2Seq Models">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li>You need <strong>multi-step probabilistic</strong> forecasts (quantile or sample-based outputs).</li>
          <li>You have a large panel (hundreds to thousands of series) to train on jointly.</li>
          <li>You need to incorporate future known covariates (promotions, holidays) into the decoder.</li>
          <li>For very long horizons ({'>'} 100 steps), consider Transformer-based architectures that model long-range dependencies more efficiently via self-attention.</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Sutskever, I., Vinyals, O., & Le, Q. V.', year: 2014, title: 'Sequence to Sequence Learning with Neural Networks', venue: 'NeurIPS' },
        { author: 'Bahdanau, D., Cho, K., & Bengio, Y.', year: 2015, title: 'Neural Machine Translation by Jointly Learning to Align and Translate', venue: 'ICLR' },
        { author: 'Wen, R., et al.', year: 2017, title: 'A Multi-Horizon Quantile Recurrent Forecaster', venue: 'NeurIPS Time Series Workshop' },
        { author: 'Salinas, D., Flunkert, V., Gasthaus, J., & Januschowski, T.', year: 2020, title: 'DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks', venue: 'International Journal of Forecasting' },
      ]} />
    </SectionLayout>
  );
}
