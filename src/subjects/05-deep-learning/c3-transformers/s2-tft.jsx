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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function TFTArchDiagram() {
  const [activeComponent, setActiveComponent] = useState(null);

  const components = [
    { id: 'vsn', label: 'Variable Selection', color: '#6366f1', desc: 'Selects relevant input features using soft attention weights. Automatically identifies which features matter most at each timestep.' },
    { id: 'grn', label: 'Gated Residual Net', color: '#8b5cf6', desc: 'GRN: Linear + ELU + Dropout + Gate (GLU) + LayerNorm + Residual. The fundamental processing unit of TFT.' },
    { id: 'lstm', label: 'Seq-to-Seq LSTM', color: '#3b82f6', desc: 'Encoder-decoder LSTM processes historical inputs and future known inputs separately, providing temporal context.' },
    { id: 'attn', label: 'Multi-Head Attention', color: '#10b981', desc: 'Interpretable multi-head attention reveals which past timesteps the model focuses on when making each forecast step.' },
    { id: 'qout', label: 'Quantile Output', color: '#f59e0b', desc: 'Multiple quantile heads (e.g., q=0.1, 0.5, 0.9) produce prediction intervals directly without distributional assumptions.' },
  ];

  const active = components.find(c => c.id === activeComponent);

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">TFT Architecture — Click a Component</h4>
      <div className="flex gap-2 mb-4 flex-wrap">
        {components.map(c => (
          <button key={c.id}
            onClick={() => setActiveComponent(activeComponent === c.id ? null : c.id)}
            className={`px-3 py-1.5 rounded text-sm border-2 transition-all ${activeComponent === c.id ? 'text-white' : 'bg-white text-gray-700'}`}
            style={activeComponent === c.id ? { backgroundColor: c.color, borderColor: c.color } : { borderColor: c.color }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 my-2">
        {[
          { label: 'Static Covariates (entity attributes)', bg: '#f1f5f9', border: '#94a3b8' },
          { label: 'Variable Selection Networks (VSN)', bg: '#ede9fe', border: '#6366f1' },
          { label: 'Static Context Encoders (GRN)', bg: '#ede9fe', border: '#8b5cf6' },
          { label: 'LSTM Encoder (history) + LSTM Decoder (future known)', bg: '#dbeafe', border: '#3b82f6' },
          { label: 'Gated Add & Norm', bg: '#f0fdf4', border: '#86efac' },
          { label: 'Interpretable Multi-Head Attention', bg: '#dcfce7', border: '#10b981' },
          { label: 'Gated Add & Norm + Position-wise Feed Forward', bg: '#f0fdf4', border: '#86efac' },
          { label: 'Quantile Output Heads (q=0.1, 0.5, 0.9)', bg: '#fef3c7', border: '#f59e0b' },
        ].map((box, i) => (
          <div key={i} style={{ backgroundColor: box.bg, borderColor: box.border }}
            className="w-full max-w-md px-4 py-2 text-center text-sm rounded border-2 text-gray-700">
            {box.label}
          </div>
        ))}
      </div>

      {active && (
        <div className="mt-3 p-3 rounded-md text-sm text-gray-700 border-l-4"
          style={{ borderColor: active.color, backgroundColor: active.color + '15' }}>
          <strong>{active.label}:</strong> {active.desc}
        </div>
      )}
    </div>
  );
}

export default function TFT() {
  return (
    <SectionLayout
      title="Temporal Fusion Transformer (TFT)"
      difficulty="advanced"
      readingTime={40}
      prerequisites={['Transformer/attention mechanisms', 'LSTM (c1-s2)', 'Quantile regression']}
    >
      <p className="text-gray-700 leading-relaxed">
        The Temporal Fusion Transformer (Lim et al., IJF 2021) is one of the most practically
        impactful deep learning forecasting architectures. Designed to handle the messy reality
        of real-world forecasting — <strong>heterogeneous inputs</strong> (static attributes,
        historical features, future known covariates), <strong>multi-horizon outputs</strong>,
        and the need for <strong>interpretability</strong> — TFT remains a top performer on
        real-world tabular forecasting benchmarks.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Input Taxonomy</h2>
      <p className="text-gray-700 leading-relaxed">
        TFT explicitly categorizes inputs — a key strength for production applications:
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-indigo-50">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Input Type</th>
              <th className="border border-gray-300 p-3 text-left">Available When</th>
              <th className="border border-gray-300 p-3 text-left">Examples</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Static covariates', 'Always (time-invariant)', 'Store ID, product category, region'],
              ['Time-varying known future', 'Past and future both', 'Day of week, promotions, holidays'],
              ['Time-varying past-only', 'Historical window only', 'Target lags, sentiment, weather actuals'],
              ['Target variable', 'Historical window only', 'Sales, demand, price'],
            ].map(([type, when, ex], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-3 font-medium text-indigo-700">{type}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{when}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TFTArchDiagram />

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Gated Residual Network (GRN)</h2>
      <p className="text-gray-700 leading-relaxed">
        The GRN is TFT's fundamental processing unit. It can suppress irrelevant inputs via
        a gating mechanism, effectively becoming a skip connection when needed:
      </p>

      <DefinitionBlock title="Gated Residual Network">
        <BlockMath math="\text{GRN}(a, c) = \text{LayerNorm}\!\left(a + \text{GLU}\bigl(\text{ELU}(W_1 a + W_c c + b_1)\bigr)\right)" />
        <p className="mt-2">
          The Gated Linear Unit (GLU) component:
        </p>
        <BlockMath math="\text{GLU}(x) = \sigma(W_2 x + b_2) \odot (W_3 x + b_3)" />
        <p className="mt-2">
          The sigmoid gate <InlineMath math="\sigma(\cdot)" /> can zero out the entire transformation,
          making GRN behave like a skip connection when the context vector <InlineMath math="c" /> (from
          static covariates) indicates the input is already informative. This is critical for handling
          features of varying relevance across different entities.
        </p>
      </DefinitionBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Variable Selection Networks (VSN)</h2>
      <p className="text-gray-700 leading-relaxed">
        VSNs learn soft attention weights over input features at each timestep. For
        <InlineMath math="m" /> features:
      </p>
      <BlockMath math="v_t = \text{Softmax}\!\left(\text{GRN}_{vs}\!\left([\xi_t^{(1)}, \ldots, \xi_t^{(m)}],\; c_s\right)\right) \in \mathbb{R}^m" />
      <BlockMath math="\tilde{x}_t = \sum_{j=1}^{m} v_t^{(j)} \cdot \text{GRN}_j\!\left(x_t^{(j)}\right)" />
      <p className="text-gray-700 leading-relaxed mt-3">
        where <InlineMath math="c_s" /> is the static context vector — enabling the model to select
        different features for different entities. Averaging <InlineMath math="v_t^{(j)}" /> over
        time and series gives global feature importance scores directly interpretable as attention fractions.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Interpretable Multi-Head Attention</h2>
      <p className="text-gray-700 leading-relaxed">
        TFT modifies standard multi-head attention so all heads share the same value matrix,
        enabling interpretable attention aggregation:
      </p>
      <BlockMath math="A_h = \text{Softmax}\!\left(\frac{Q W_Q^{(h)} (K W_K^{(h)})^\top}{\sqrt{d_k}}\right)" />
      <BlockMath math="\text{MultiHead}(Q,K,V) = \left(\frac{1}{m_H}\sum_{h=1}^{m_H} A_h\right) V W_H" />
      <p className="text-gray-700 leading-relaxed mt-3">
        Since all heads share <InlineMath math="V" />, the mean attention matrix
        <InlineMath math="\bar{A} = \frac{1}{m_H}\sum_h A_h" /> is a valid temporal importance
        map: entry <InlineMath math="\bar{A}_{t, t'}" /> tells you how much forecast step
        <InlineMath math="t" /> attends to past step <InlineMath math="t'" />.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Quantile Output Heads</h2>
      <p className="text-gray-700 leading-relaxed">
        TFT produces predictions at multiple quantile levels simultaneously, trained with
        the sum of pinball losses:
      </p>
      <BlockMath math="\mathcal{L} = \sum_{q \in \mathcal{Q}} \sum_{t,h} \text{QL}(q,\; y_{t+h},\; \hat{y}_q(t+h))" />
      <BlockMath math="\text{QL}(q, y, \hat{y}) = \max\bigl(q(y-\hat{y}),\; (q-1)(y-\hat{y})\bigr)" />
      <p className="text-gray-700 leading-relaxed mt-3">
        With <InlineMath math="\mathcal{Q} = \{0.1, 0.5, 0.9\}" />, you get 80% prediction intervals
        (10th to 90th percentile) plus the median as the point forecast — no distributional assumptions required.
      </p>

      <NoteBlock title="TFT vs Pure Transformers">
        Unlike vanilla Transformers applied to time series, TFT explicitly handles the distinction
        between past-only and future-known inputs through separate encoder/decoder LSTMs. This
        architectural choice encodes domain knowledge about forecasting structure, which is why
        TFT tends to outperform generic Transformers on real forecasting datasets.
      </NoteBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Python: TFT with neuralforecast</h2>

      <PythonCode>{`import pandas as pd
import numpy as np
from neuralforecast import NeuralForecast
from neuralforecast.models import TFT
from neuralforecast.losses.pytorch import MQLoss

# ── Build a retail-style dataset with covariates ──────────────────────────────
np.random.seed(42)
dates = pd.date_range('2020-01-01', '2023-12-31', freq='D')
n_stores = 5

rows = []
for store_id in range(n_stores):
    base = 100 + store_id * 20
    for d in dates:
        is_weekend = int(d.dayofweek >= 5)
        is_holiday = int(d.month == 12 and d.day >= 20)
        y = (base
             + 30 * is_weekend
             + 50 * is_holiday
             + 10 * np.sin(2 * np.pi * d.dayofyear / 365)
             + np.random.randn() * 15)
        rows.append({
            'unique_id': f'store_{store_id}',
            'ds': d,
            'y': max(0.0, y),
            'is_weekend': is_weekend,       # Future-known: available in horizon
            'is_holiday': is_holiday,       # Future-known
            'day_of_week': d.dayofweek,     # Future-known
            'store_size': [100, 150, 80, 200, 120][store_id],  # Static
        })

df = pd.DataFrame(rows)

# ── TFT model ─────────────────────────────────────────────────────────────────
H = 28

tft = TFT(
    h=H,
    input_size=4 * H,
    # Covariate lists
    futr_exog_list=['is_weekend', 'is_holiday', 'day_of_week'],
    stat_exog_list=['store_size'],
    # Architecture
    hidden_size=128,
    n_head=4,
    dropout=0.1,
    attn_dropout=0.0,
    # Loss: quantiles for 80% and 95% prediction intervals
    loss=MQLoss(level=[80, 95]),
    learning_rate=1e-3,
    max_steps=500,
    batch_size=64,
    scaler_type='standard',
    random_seed=42,
)

nf = NeuralForecast(models=[tft], freq='D')
nf.fit(df=df)

# Provide future covariates for prediction
future_df = nf.make_future_dataframe()
future_df['is_weekend'] = (pd.to_datetime(future_df['ds']).dt.dayofweek >= 5).astype(int)
future_df['is_holiday'] = (
    (pd.to_datetime(future_df['ds']).dt.month == 12) &
    (pd.to_datetime(future_df['ds']).dt.day >= 20)
).astype(int)
future_df['day_of_week'] = pd.to_datetime(future_df['ds']).dt.dayofweek

preds = nf.predict(futr_df=future_df)
# Output columns: TFT-median, TFT-lo-80, TFT-hi-80, TFT-lo-95, TFT-hi-95
print(preds.columns.tolist())

# ── Cross-validation to evaluate ─────────────────────────────────────────────
cv = nf.cross_validation(df=df, n_windows=3, step_size=H, futr_df=future_df)
from neuralforecast.losses.numpy import mqloss
quantiles = [0.1, 0.9]   # 80% PI lower and upper
wql = mqloss(cv['y'].values,
             cv[['TFT-lo-80', 'TFT-hi-80']].values,
             quantiles=quantiles)
print(f"Weighted Quantile Loss: {wql:.4f}")

# ── pytorch-forecasting TFT (alternative) ─────────────────────────────────────
from pytorch_forecasting import TemporalFusionTransformer, TimeSeriesDataSet
from pytorch_forecasting.metrics import QuantileLoss

# Requires integer time_idx column
df['time_idx'] = (df['ds'] - df['ds'].min()).dt.days

training = TimeSeriesDataSet(
    df[df['ds'] < '2023-10-01'],
    time_idx='time_idx',
    target='y',
    group_ids=['unique_id'],
    min_encoder_length=4 * H,
    max_encoder_length=4 * H,
    min_prediction_length=H,
    max_prediction_length=H,
    static_reals=['store_size'],
    static_categoricals=['unique_id'],
    time_varying_known_reals=['is_weekend', 'is_holiday', 'day_of_week'],
    time_varying_unknown_reals=['y'],
    add_relative_time_idx=True,
    add_encoder_length=True,
)

tft_pf = TemporalFusionTransformer.from_dataset(
    training,
    hidden_size=128,
    attention_head_size=4,
    dropout=0.1,
    hidden_continuous_size=16,
    loss=QuantileLoss(quantiles=[0.1, 0.5, 0.9]),
    log_interval=10,
    learning_rate=1e-3,
)
print(f"Parameters: {tft_pf.size():,}")
`}</PythonCode>

      <ExampleBlock title="Reading TFT Attention Weights">
        <p>
          After training, use <code>model.interpret_output(output)</code> in pytorch-forecasting
          to get a dict with keys <code>'attention'</code>, <code>'static_variables'</code>,
          <code>'encoder_variables'</code>, and <code>'decoder_variables'</code>. The attention
          matrix (shape: batch × horizon × lookback) visualized as a heatmap shows temporal
          dependencies. Recurring high-attention at distance 7 confirms weekly seasonality learning.
        </p>
      </ExampleBlock>

      <WarningBlock title="Data Formatting Requirements">
        TFT fails silently when covariates are mislabeled. Common mistakes: (1) marking a
        past-only feature as future-known — the model will use future target values during training
        but not at inference, causing a train/test mismatch; (2) inconsistent time indexing
        (gaps in the series); (3) not normalizing features — TFT benefits from standardized inputs.
        Always validate your DataLoader with a few sample batches before full training.
      </WarningBlock>

      <ReferenceList references={[
        { authors: 'Lim, B., Arık, S.Ö., Loeff, N., Pfister, T.', year: 2021, title: 'Temporal Fusion Transformers for interpretable multi-horizon time series forecasting', venue: 'International Journal of Forecasting', url: 'https://doi.org/10.1016/j.ijforecast.2021.03.012' },
        { authors: 'Dauphin, Y.N. et al.', year: 2017, title: 'Language Modeling with Gated Convolutional Networks', venue: 'ICML 2017', url: 'https://arxiv.org/abs/1612.08083' },
        { authors: 'Olivares, K.G. et al.', year: 2022, title: 'NeuralForecast: User friendly state-of-the-art neural forecasting models', venue: 'arXiv', url: 'https://arxiv.org/abs/2207.03663' },
      ]} />
    </SectionLayout>
  );
}
