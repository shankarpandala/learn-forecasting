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

function CovariateTypeExplorer() {
  const [selected, setSelected] = useState(null);
  const types = [
    {
      id: 'static',
      label: 'Static Covariates',
      examples: ['Store ID', 'Product category', 'Country', 'SKU attributes'],
      usage: 'Projected to a static embedding, injected into the encoder, decoder, and variable selection network. Captures fixed entity properties.',
      colorClass: 'bg-blue-100 border-blue-400 text-blue-800',
      activeClass: 'bg-blue-600 text-white border-blue-600',
    },
    {
      id: 'known_future',
      label: 'Known Future Covariates',
      examples: ['Day of week', 'Holiday flag', 'Planned promotions', 'Price schedule'],
      usage: 'Available for both historical and future time steps. Fed to both the LSTM encoder (history) and decoder (future), plus the self-attention layer.',
      colorClass: 'bg-green-100 border-green-400 text-green-800',
      activeClass: 'bg-green-600 text-white border-green-600',
    },
    {
      id: 'unknown',
      label: 'Unknown Past Covariates',
      examples: ['Past sales', 'Past weather actuals', 'Market returns', 'Traffic counts'],
      usage: 'Only available for past time steps. Fed to the LSTM encoder but not the decoder or future self-attention layers.',
      colorClass: 'bg-orange-100 border-orange-400 text-orange-800',
      activeClass: 'bg-orange-600 text-white border-orange-600',
    },
  ];
  const active = types.find(t => t.id === selected);
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">TFT Covariate Types — Click to Explore</h4>
      <div className="flex gap-3 flex-wrap mb-4">
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => setSelected(selected === t.id ? null : t.id)}
            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
              selected === t.id ? t.activeClass : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {active && (
        <div className="p-3 rounded-lg border border-gray-200 bg-white">
          <p className="text-sm text-gray-700 mb-2">{active.usage}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {active.examples.map(ex => (
              <span key={ex} className={`px-2 py-1 rounded text-xs font-mono border ${active.colorClass}`}>{ex}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const tftCode = `from neuralforecast import NeuralForecast
from neuralforecast.models import TFT
from neuralforecast.losses.pytorch import MQLoss
import pandas as pd
import numpy as np

# ── 1. Dataset with three covariate types ─────────────────────────────────
np.random.seed(42)
n_stores, T = 20, 104  # 20 stores, 2 years weekly

records = []
for store in range(n_stores):
    dates     = pd.date_range('2022-01-01', periods=T, freq='W')
    t         = np.arange(T)
    store_size = store % 2                              # static: 0=small, 1=large
    week_norm  = (t % 52).astype(float) / 52.0         # known future covariate
    holiday    = (t % 13 == 0).astype(float)            # known future covariate
    promo      = np.random.binomial(1, 0.15, T).astype(float)  # unknown future
    base = 1000 + 200 * store_size
    y    = (base + 100*np.sin(2*np.pi*t/52) + 150*holiday
            + 80*promo + 20*np.random.randn(T))
    for d, yv, wk, hol, pr in zip(dates, y, week_norm, holiday, promo):
        records.append({
            'unique_id': f'store_{store}',
            'ds': d, 'y': float(yv),
            'week_norm': wk,
            'is_holiday': hol,
            'past_promo': pr,
            'store_size': float(store_size),
        })

df = pd.DataFrame(records)

# ── 2. TFT model definition ────────────────────────────────────────────────
horizon = 13
model = TFT(
    h=horizon,
    input_size=4 * horizon,
    hidden_size=64,
    n_head=4,
    attn_dropout=0.1,
    dropout=0.1,
    loss=MQLoss(level=[10, 50, 90]),
    hist_exog_list=['past_promo'],               # unknown future (past only)
    futr_exog_list=['week_norm', 'is_holiday'],  # known for future
    stat_exog_list=['store_size'],               # static per series
    max_steps=500,
    learning_rate=1e-3,
    batch_size=32,
    random_seed=42,
)

nf = NeuralForecast(models=[model], freq='W')
nf.fit(df)

# ── 3. Prediction (supply future covariates) ───────────────────────────────
futr_df = nf.make_future_dataframe(df)
woy = pd.DatetimeIndex(futr_df['ds']).isocalendar().week.values
futr_df['week_norm']  = woy / 52.0
futr_df['is_holiday'] = (woy % 13 == 0).astype(float)
futr_df['store_size'] = futr_df['unique_id'].str.extract(r'(\d+)')[0].astype(int) % 2

forecasts = nf.predict(futr_df=futr_df)
print(forecasts.head())
# Columns: unique_id, ds, TFT-lo-10, TFT-median, TFT-hi-90

print("Forecast shape:", forecasts.shape)
print("Unique series:", forecasts['unique_id'].nunique())
`;

export default function TFTSection() {
  return (
    <SectionLayout
      title="Temporal Fusion Transformers (TFT)"
      difficulty="advanced"
      readingTime={16}
    >
      <p className="text-gray-700 leading-relaxed">
        The Temporal Fusion Transformer (TFT) combines LSTMs, multi-head
        attention, and gating mechanisms into a unified architecture designed
        for multi-horizon forecasting with heterogeneous covariates. It won the
        M5 competition and consistently achieves strong results on real-world
        retail, energy, and financial datasets with rich covariate structure.
      </p>

      <DefinitionBlock title="TFT Architecture Overview">
        TFT processes three covariate categories through distinct pathways, then
        fuses them via a sequence-to-sequence architecture with attention:
        <ol className="list-decimal ml-5 mt-2 space-y-1 text-sm">
          <li><strong>Variable Selection Networks (VSN)</strong> — learn input importance weights per time step</li>
          <li><strong>LSTM Encoder-Decoder</strong> — capture local and order-sensitive temporal patterns</li>
          <li><strong>Multi-Head Self-Attention</strong> — model long-range dependencies across the look-back window</li>
          <li><strong>Quantile output layer</strong> — simultaneously produce prediction intervals</li>
        </ol>
      </DefinitionBlock>

      <CovariateTypeExplorer />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Variable Selection Networks (VSN)
      </h2>
      <p className="text-gray-700 leading-relaxed">
        The VSN is TFT's mechanism for learning which input features matter at
        each time step. Given <InlineMath math="m" /> input covariates, the VSN
        produces soft weights via a Gated Residual Network (GRN):
      </p>
      <BlockMath math="\mathbf{v} = \text{softmax}\!\bigl(\text{GRN}([x_1, \dots, x_m])\bigr)" />
      <p className="text-gray-700 leading-relaxed mt-3 mb-4">
        The enriched input is a weighted combination:{' '}
        <InlineMath math="\tilde{x} = \sum_i v_i\,\tilde{x}_i" /> where{' '}
        <InlineMath math="\tilde{x}_i" /> are per-variable linear projections.
        The weights <InlineMath math="\mathbf{v}" /> are interpretable — they
        show which covariates the model relied on for each forecast.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Gated Residual Network (GRN)
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        The GRN is TFT's fundamental building block — a gated skip connection
        that lets the model adaptively bypass nonlinear transformations:
      </p>
      <BlockMath math="\text{GRN}(a, c) = \text{LayerNorm}\!\bigl(a + \text{GLU}(\eta_1)\bigr)" />
      <p className="text-gray-700 leading-relaxed mt-3">
        where <InlineMath math="\eta_1 = W_1 a + W_2 c + b_1" /> and the
        optional context <InlineMath math="c" /> injects static embeddings.
        The Gated Linear Unit <InlineMath math="\text{GLU}(x) = \sigma(W_4 x)\odot(W_5 x)" />{' '}
        controls the flow of information through the nonlinear path.
      </p>

      <TheoremBlock title="LSTM + Attention Fusion">
        <p>TFT uses a two-stage temporal processing strategy:</p>
        <ol className="list-decimal ml-5 mt-2 space-y-2 text-sm">
          <li>
            <strong>LSTM encoder-decoder:</strong> processes historical
            look-back (encoder) and decodes future steps using known-future
            covariates (decoder). Handles local, position-sensitive patterns
            that attention alone misses.
          </li>
          <li>
            <strong>Multi-head self-attention on LSTM outputs:</strong> applies
            attention across the entire enriched sequence to capture long-range
            dependencies. The attention matrix is interpretable — high weights
            reveal which historical dates influenced each forecast step.
          </li>
        </ol>
        <p className="text-sm mt-3">
          The combination outperforms either component alone: LSTM for local
          dynamics, attention for global patterns and non-local seasonality.
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Quantile Forecasting
      </h2>
      <p className="text-gray-700 leading-relaxed">
        TFT produces simultaneous multi-quantile forecasts via parallel linear
        output heads, one per quantile level. Training uses the pinball (quantile)
        loss summed over all quantiles and horizon steps:
      </p>
      <BlockMath math="\mathcal{L} = \frac{1}{HQ}\sum_{q}\sum_{t=1}^{H} \mathcal{L}_q\!\bigl(\hat{y}_t^{(q)}, y_t\bigr)" />
      <p className="text-gray-700 leading-relaxed mt-3">
        This produces calibrated prediction intervals (e.g., P10–P90 = 80%
        interval) in a single forward pass without Monte Carlo sampling.
      </p>

      <ExampleBlock title="TFT vs. DeepAR: Practical Choice Guide">
        <p className="text-sm text-gray-700">
          <strong>Choose TFT when:</strong> you have rich future-known covariates
          (promotions, holidays, pricing), you need interpretable variable importance
          scores, or you want simultaneous quantile outputs. TFT's explicit
          covariate handling is its main advantage over DeepAR.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          <strong>Choose DeepAR when:</strong> the target distribution is clearly
          non-Gaussian (count data — use Negative Binomial), you have very many
          sparse series, or you have limited covariates and want a simpler model.
        </p>
      </ExampleBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Implementation</h2>
      <PythonCode code={tftCode} />

      <WarningBlock title="Future Covariates Must Be Supplied at Inference">
        TFT explicitly uses known-future covariates (holidays, promotions) in its
        decoder during prediction. You must provide a <code>futr_df</code> DataFrame
        containing future covariate values for all horizon steps. Supplying zeros
        or missing values will produce degraded forecasts, especially for series
        with strong promotional or calendar-driven effects.
      </WarningBlock>

      <NoteBlock title="TFT Hyperparameter Priorities">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li><code>hidden_size</code> (64–256): most impactful; larger = more capacity but slower and more prone to overfitting.</li>
          <li><code>n_head</code> (1–8): number of attention heads; 4 is a robust default for most datasets.</li>
          <li><code>input_size</code>: set to at least 2× the seasonal period (e.g., 104 weeks for annual retail data).</li>
          <li><code>dropout</code> (0.1–0.3): important regularizer, especially for small-to-medium datasets.</li>
          <li>Use AutoTFT (NeuralForecast) or Ray Tune for systematic hyperparameter search on large datasets.</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Lim, B., Arık, S. Ö., Loeff, N., & Pfister, T.', year: 2021, title: 'Temporal Fusion Transformers for Interpretable Multi-horizon Time Series Forecasting', venue: 'International Journal of Forecasting' },
        { author: 'Salinas, D., Flunkert, V., Gasthaus, J., & Januschowski, T.', year: 2020, title: 'DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks', venue: 'International Journal of Forecasting' },
        { author: 'Makridakis, S., et al.', year: 2022, title: 'M5 accuracy competition: Results, findings, and conclusions', venue: 'International Journal of Forecasting' },
      ]} />
    </SectionLayout>
  );
}
