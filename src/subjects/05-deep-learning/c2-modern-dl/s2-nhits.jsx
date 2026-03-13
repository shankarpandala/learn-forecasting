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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const benchmarkData = [
  { model: 'N-BEATS', ETTh1: 0.406, ETTm2: 0.279, Exchange: 0.088 },
  { model: 'N-HiTS', ETTh1: 0.398, ETTm2: 0.259, Exchange: 0.079 },
  { model: 'Autoformer', ETTh1: 0.449, ETTm2: 0.327, Exchange: 0.197 },
  { model: 'Informer', ETTh1: 0.865, ETTm2: 0.365, Exchange: 0.847 },
];

function BenchmarkChart() {
  const [metric, setMetric] = useState('ETTh1');
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">
        Long-Horizon MAE Comparison (lower is better)
      </h4>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['ETTh1', 'ETTm2', 'Exchange'].map(m => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`px-3 py-1 rounded text-sm border transition-all ${
              metric === m
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={benchmarkData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="model" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} />
          <Tooltip formatter={(v) => v.toFixed(3)} />
          <Bar dataKey={metric} fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 mt-1">
        Approximate values from Challu et al. (2023). Horizon = 720 steps.
      </p>
    </div>
  );
}

const nhitsCode = `from neuralforecast import NeuralForecast
from neuralforecast.models import NHITS
from neuralforecast.losses.pytorch import MAE, MQLoss
import pandas as pd
import numpy as np

# ── 1. Dataset ─────────────────────────────────────────────────────────────
# Long-horizon experiment: ETT (Electricity Transformer Temperature) format
np.random.seed(0)
T = 2000
dates = pd.date_range('2016-07-01', periods=T, freq='h')
# Simulate ETT-like signal: daily + weekly seasonality
t  = np.arange(T)
y  = (10 * np.sin(2 * np.pi * t / 24) +
      5  * np.sin(2 * np.pi * t / (24 * 7)) +
      0.5 * np.random.randn(T))
df = pd.DataFrame({'unique_id': 'ETT', 'ds': dates, 'y': y})

# ── 2. N-HiTS model ────────────────────────────────────────────────────────
# n_freq_downsample: pooling factors at each stack — key N-HiTS hyperparameter.
# A value of [24, 12, 1] means stack 0 downsamples by 24x (captures slow trends),
# stack 1 by 12x (medium patterns), stack 2 by 1x (high-frequency residuals).

horizon = 720   # long-horizon forecasting (30 days of hourly data)

model = NHITS(
    h=horizon,
    input_size=5 * horizon,           # large look-back for long horizons
    n_freq_downsample=[24, 12, 1],    # multi-rate sampling
    mlp_units=[[512, 512]] * 3,       # MLP per stack
    n_blocks=[1, 1, 1],
    n_pool_kernel_size=[2, 2, 1],
    interpolation_mode='linear',      # hierarchical interpolation
    loss=MAE(),
    max_steps=1000,
    learning_rate=1e-3,
    batch_size=32,
    random_seed=42,
)

nf = NeuralForecast(models=[model], freq='h')
nf.fit(df)
pred = nf.predict()
print(pred.head())

# ── 3. Probabilistic N-HiTS ────────────────────────────────────────────────
model_prob = NHITS(
    h=horizon,
    input_size=5 * horizon,
    n_freq_downsample=[24, 12, 1],
    loss=MQLoss(level=[10, 50, 90]),  # quantile outputs
    max_steps=500,
)
nf_prob = NeuralForecast(models=[model_prob], freq='h')
nf_prob.fit(df)
pred_prob = nf_prob.predict()
# Columns: NHITS-lo-10, NHITS-median, NHITS-hi-90

# ── 4. N-HiTS vs N-BEATS: key difference ──────────────────────────────────
# N-BEATS uses a fixed look-back and plain FC stacks.
# N-HiTS adds:
#  (a) MaxPool downsampling before each stack (multi-rate input)
#  (b) Explicit output interpolation (upsampling from coarse to fine grid)
# These two changes reduce parameter count and dramatically improve
# long-horizon accuracy — often 20-50% lower MAE on benchmarks like ETT.

from neuralforecast.models import NBEATS
model_nbeats = NBEATS(
    h=horizon,
    input_size=2 * horizon,
    n_harmonics=2,
    n_trend_blocks=3,
    n_seasonality_blocks=3,
    loss=MAE(),
    max_steps=500,
)
print("N-BEATS parameters:", sum(p.numel() for p in model_nbeats.parameters()))
print("N-HiTS  parameters:", sum(p.numel() for p in model.parameters()))
`;

export default function NHiTSSection() {
  return (
    <SectionLayout
      title="N-HiTS: Hierarchical Interpolation for Time Series"
      difficulty="advanced"
      readingTime={13}
    >
      <p className="text-gray-700 leading-relaxed">
        N-HiTS (Neural Hierarchical Interpolation for Time Series) extends N-BEATS
        with two key innovations — <em>multi-rate signal sampling</em> and{' '}
        <em>hierarchical interpolation</em> — that make it particularly effective for
        long-horizon forecasting while using far fewer parameters than Transformer-based
        models.
      </p>

      <DefinitionBlock title="N-HiTS Architecture">
        N-HiTS stacks multiple forecasting blocks, each operating at a different
        temporal resolution. Each block receives a <em>downsampled</em> version of
        the input (via MaxPool), produces a coarse-resolution output, and uses
        linear interpolation to upsample it back to the full forecast horizon. The
        final forecast is the sum of all block outputs.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Multi-Rate Input Sampling
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Vanilla N-BEATS passes the same full-resolution input to every stack. N-HiTS
        applies a MaxPool layer with kernel size <InlineMath math="k_s" /> before
        each stack <InlineMath math="s" />, reducing the effective sampling rate.
        This mirrors the idea of a{' '}
        <em>multi-rate signal processing</em> filterbank:
      </p>
      <BlockMath math="\tilde{x}^{(s)} = \text{MaxPool}_{k_s}(x)" />
      <p className="text-gray-700 leading-relaxed mt-3">
        The first stack sees heavily downsampled input (low frequency / slow
        trend), the last stack sees full-resolution input (high frequency /
        residuals). This decomposition is explicit and inductive, unlike N-BEATS
        which learns the decomposition implicitly.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Hierarchical Interpolation
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Each block produces an output at a{' '}
        <em>coarser temporal resolution</em> — specifically{' '}
        <InlineMath math="\lceil H / r_s \rceil" /> points, where{' '}
        <InlineMath math="r_s" /> is the downsampling ratio of stack{' '}
        <InlineMath math="s" />. The coarse output is then interpolated (linearly
        or nearest-neighbor) back to the full horizon length{' '}
        <InlineMath math="H" />:
      </p>
      <BlockMath math="\hat{y}^{(s)} = \text{Interp}\!\left(\text{MLP}^{(s)}(\tilde{x}^{(s)}),\; H\right)" />
      <p className="text-gray-700 leading-relaxed mt-3">
        The final multi-step forecast is the sum across all stacks:
      </p>
      <BlockMath math="\hat{y} = \sum_{s=1}^{S} \hat{y}^{(s)}" />

      <TheoremBlock title="Why Interpolation Helps Long Horizons">
        <p>
          In standard N-BEATS each block must produce all <InlineMath math="H" />{' '}
          forecast values directly. For large <InlineMath math="H" /> (e.g., 720
          steps) the output layer becomes very wide, increasing both parameters and
          overfitting risk. N-HiTS' interpolation approach means the output MLP
          only needs to predict <InlineMath math="\lceil H/r_s\rceil" /> values —
          a{' '}
          <InlineMath math="r_s\times" /> reduction. The interpolation step is
          parameter-free and acts as a smooth inductive bias.
        </p>
      </TheoremBlock>

      <BenchmarkChart />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        N-HiTS vs N-BEATS
      </h2>
      <div className="overflow-x-auto my-4">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Aspect</th>
              <th className="px-4 py-2 text-left text-gray-700">N-BEATS</th>
              <th className="px-4 py-2 text-left text-gray-700">N-HiTS</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Input sampling', 'Full resolution for every stack', 'MaxPool downsampling per stack'],
              ['Output generation', 'Direct full-horizon MLP output', 'Coarse output + interpolation'],
              ['Parameter efficiency', 'Scales with H (wide output layers)', 'Scales with H/r (interpolated)'],
              ['Best horizon', 'Short to medium (≤ 48 steps)', 'Long (≥ 96 steps)'],
              ['Interpretability', 'Trend/seasonality basis expansion', 'Frequency-based decomposition'],
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

      <ExampleBlock title="Choosing n_freq_downsample">
        <p className="text-sm text-gray-700">
          The <code>n_freq_downsample</code> parameter controls the MaxPool kernel
          sizes for each stack. A value of <code>[24, 12, 1]</code> for hourly
          data works well: the first stack operates on daily averages (24x),
          the second on 2-hour blocks (12x), and the third on full resolution.
          For monthly data, <code>[4, 2, 1]</code> (quarterly, semi-annual,
          monthly) is a reasonable starting point. Always set{' '}
          <code>input_size</code> to at least <code>3 × horizon</code> to give
          the model enough context.
        </p>
      </ExampleBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Implementation</h2>
      <PythonCode code={nhitsCode} />

      <WarningBlock title="Very Long Horizons Need Large Look-backs">
        For horizon = 720 (hourly, 30-day forecast), set{' '}
        <code>input_size = 5 * horizon = 3600</code>. This is much larger than
        typical RNN or N-BEATS look-backs. N-HiTS handles it efficiently because
        the MaxPool compresses the input before processing. Training time will
        still be longer — consider reducing <code>max_steps</code> and using a
        learning rate scheduler.
      </WarningBlock>

      <NoteBlock title="When to Choose N-HiTS">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li>Horizon longer than 96 steps (outperforms N-BEATS and most Transformers).</li>
          <li>Limited GPU memory — interpolation dramatically reduces output layer size.</li>
          <li>You want a principled frequency decomposition of the forecast.</li>
          <li>Short horizons: N-BEATS or LSTM-based models are equally strong and simpler to tune.</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Challu, C., Olivares, K. G., Oreshkin, B. N., et al.', year: 2023, title: 'N-HiTS: Neural Hierarchical Interpolation for Time Series Forecasting', venue: 'AAAI' },
        { author: 'Oreshkin, B. N., Carpov, D., Chapados, N., & Bengio, Y.', year: 2020, title: 'N-BEATS: Neural Basis Expansion Analysis for Interpretable Time Series Forecasting', venue: 'ICLR' },
        { author: 'Zeng, A., Chen, M., Zhang, L., & Xu, Q.', year: 2023, title: 'Are Transformers Effective for Time Series Forecasting?', venue: 'AAAI' },
      ]} />
    </SectionLayout>
  );
}
