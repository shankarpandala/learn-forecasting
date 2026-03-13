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

// Multi-rate sampling visualization
function MultiRateSamplingViz() {
  const [selectedRate, setSelectedRate] = useState(0);
  const rates = [
    { label: 'Stack 1: Rate 1 (full res)', poolSize: 1, color: '#6366f1' },
    { label: 'Stack 2: Rate 2 (2x pool)', poolSize: 2, color: '#f59e0b' },
    { label: 'Stack 3: Rate 4 (4x pool)', poolSize: 4, color: '#10b981' },
  ];

  const fullSeries = Array.from({ length: 24 }, (_, i) => ({
    i,
    v: Math.sin(i * 0.5) + 0.5 * Math.sin(i * 2) + 0.2 * (i % 7 < 2 ? 1 : 0),
  }));

  const r = rates[selectedRate];
  const sampled = fullSeries.filter((_, i) => i % r.poolSize === 0);

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">Multi-Rate MaxPool Subsampling</h4>
      <div className="flex gap-2 mb-4 flex-wrap">
        {rates.map((rate, i) => (
          <button key={i}
            onClick={() => setSelectedRate(i)}
            className={`px-3 py-1.5 rounded text-sm border-2 transition-all ${selectedRate === i ? 'text-white' : 'bg-white text-gray-700'}`}
            style={selectedRate === i ? { backgroundColor: rate.color, borderColor: rate.color } : { borderColor: rate.color }}
          >
            {rate.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="i" type="number" domain={[0, 23]} tickCount={8} />
          <YAxis />
          <Tooltip />
          <Line data={fullSeries} type="monotone" dataKey="v" stroke="#d1d5db" dot={false} strokeWidth={1} name="Original" />
          <Line data={sampled} type="monotone" dataKey="v" stroke={r.color} dot={{ r: 4, fill: r.color }} strokeWidth={2} name={`Subsampled (pool=${r.poolSize})`} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 mt-2">
        Larger pool sizes capture low-frequency (slow) components; small pool sizes preserve high-frequency details.
        N-HiTS allocates different stacks to different frequency ranges.
      </p>
    </div>
  );
}

export default function NHiTS() {
  return (
    <SectionLayout
      title="N-HiTS: Neural Hierarchical Interpolation for Time Series Forecasting"
      difficulty="advanced"
      readingTime={35}
      prerequisites={['N-BEATS architecture (s1)', 'Signal processing basics', 'MaxPooling']}
    >
      <p className="text-gray-700 leading-relaxed">
        N-HiTS (Challu et al., AAAI 2023) extends N-BEATS with a critical insight for long-horizon
        forecasting: <strong>different components of a time series operate at different frequencies</strong>.
        By sampling each stack's input at a different temporal resolution and using hierarchical
        interpolation for the output, N-HiTS achieves superior accuracy on long horizons while being
        computationally more efficient than Transformer-based models.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">The Core Problem: Long-Horizon Forecasting</h2>
      <p className="text-gray-700 leading-relaxed">
        For short horizons (H &lt; 48), N-BEATS is highly competitive. But for long horizons
        (H = 96, 192, 720 as in the LTSF benchmark), the model must simultaneously:
      </p>
      <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
        <li>Capture long-range slow-moving trends (low frequency)</li>
        <li>Reproduce seasonal patterns (medium frequency)</li>
        <li>Track short-term fluctuations (high frequency)</li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        Trying to do all this with a single resolution lookback is inefficient. N-HiTS introduces
        two mechanisms to address this: <strong>multi-rate signal sampling</strong> and
        <strong>hierarchical interpolation</strong>.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Multi-Rate Signal Sampling</h2>

      <DefinitionBlock title="MaxPool Subsampling">
        <p className="mb-2">
          Each stack <InlineMath math="s" /> applies a MaxPool with kernel size <InlineMath math="k_s" />
          to the input window before processing:
        </p>
        <BlockMath math="\tilde{x}^{(s)} = \text{MaxPool}(x,\, k_s) \in \mathbb{R}^{\lfloor T/k_s \rfloor}" />
        <p className="mt-2">
          With <InlineMath math="k_1 = 1, k_2 = 2, k_3 = 4" /> for three stacks, the first stack
          sees the full temporal resolution, the second sees every other point, and the third
          sees every fourth point — each attuned to a different frequency band.
        </p>
      </DefinitionBlock>

      <MultiRateSamplingViz />

      <p className="text-gray-700 leading-relaxed mt-2">
        MaxPool (rather than AvgPool or strided convolution) is used because it is differentiable
        and captures the local maximum — a meaningful statistic for detecting peaks in demand,
        traffic, or other peaky time series.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Hierarchical Interpolation</h2>
      <p className="text-gray-700 leading-relaxed">
        Because each stack produces a forecast at a <em>coarser</em> temporal resolution (matching
        its subsampled input), N-HiTS upsamples each stack's forecast output back to the full
        horizon using linear interpolation:
      </p>

      <DefinitionBlock title="Hierarchical Interpolation">
        <BlockMath math="\hat{y}^{(s)} = \text{Interp}\!\left(V_f^{(s)} \theta_f^{(s)},\; \text{size}=H\right)" />
        <p className="mt-2">
          where <InlineMath math="V_f^{(s)} \theta_f^{(s)} \in \mathbb{R}^{\lfloor H / k_s \rfloor}" />
          is the coarse forecast from stack <InlineMath math="s" />, and Interp upsamples it to
          length <InlineMath math="H" /> via linear interpolation. The total forecast is the sum:
        </p>
        <BlockMath math="\hat{y} = \sum_s \hat{y}^{(s)}" />
      </DefinitionBlock>

      <p className="text-gray-700 leading-relaxed mt-3">
        Interpolation acts as a smoothness constraint: a coarse stack can only express
        low-frequency patterns. This is a powerful inductive bias — it forces the model to
        separate scales rather than trying to learn everything at the finest resolution.
      </p>

      <TheoremBlock title="Expressiveness Analysis">
        <p>
          N-HiTS has strictly greater expressiveness than N-BEATS for long-horizon problems:
          given equal parameter budgets, N-HiTS can represent signals with both slow trends
          (handled by coarse stacks) and rapid oscillations (handled by fine stacks)
          simultaneously, while N-BEATS must learn both from the same resolution.
          Formally, N-HiTS's effective parameter efficiency scales as <InlineMath math="O(H / k_s)" />
          per stack versus <InlineMath math="O(H)" /> for N-BEATS.
        </p>
      </TheoremBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">N-HiTS vs Transformers: The LTSF Debate</h2>
      <p className="text-gray-700 leading-relaxed">
        The N-HiTS paper (and the concurrent "Are Transformers Effective for Time Series Forecasting?"
        paper by Zeng et al.) showed that simple MLP-based models can outperform complex Transformer
        architectures on standard long-horizon benchmarks (ETTh1, ETTm1, Exchange, Weather datasets).
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-indigo-50">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Model</th>
              <th className="border border-gray-300 p-3 text-left">Architecture</th>
              <th className="border border-gray-300 p-3 text-left">Long Horizon</th>
              <th className="border border-gray-300 p-3 text-left">Speed</th>
              <th className="border border-gray-300 p-3 text-left">Params</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['N-HiTS', 'MLP + MaxPool + Interpolation', 'Excellent', 'Very Fast', 'Low'],
              ['N-BEATS', 'MLP + Basis Expansion', 'Good', 'Fast', 'Low'],
              ['FEDformer', 'Transformer (Fourier)', 'Good', 'Slow', 'High'],
              ['Autoformer', 'Transformer (Autocorr)', 'Good', 'Slow', 'High'],
              ['DLinear', 'Linear (decomposed)', 'Good', 'Very Fast', 'Very Low'],
              ['PatchTST', 'Transformer (Patched)', 'Very Good', 'Medium', 'Medium'],
            ].map(([model, arch, long, speed, params], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-3 font-semibold text-indigo-700">{model}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{arch}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{long}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{speed}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{params}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoteBlock title="The LTSF Benchmark Caveat">
        The long-horizon benchmark results are dataset-dependent. On ETT datasets, simple models
        often win. On M4/M5 competition data with many heterogeneous series, N-BEATS and N-HiTS
        (trained globally) tend to outperform simpler approaches. Always validate on your own data.
      </NoteBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Python: N-HiTS and AutoNHiTS</h2>

      <PythonCode>{`import pandas as pd
import numpy as np
from neuralforecast import NeuralForecast
from neuralforecast.models import NHITS
from neuralforecast.auto import AutoNHITS
from neuralforecast.losses.pytorch import MAE, DistributionLoss
from datasetsforecast.long_horizon import LongHorizon

# ── Load ETTh1 (Long Horizon benchmark dataset) ───────────────────────────────
Y_df, *_ = LongHorizon.load(directory='data', group='ETTh1')
# Y_df: ['unique_id', 'ds', 'y']  (7 columns become 7 unique series)
print(Y_df.head())

# ── Configure N-HiTS for long horizon ─────────────────────────────────────────
H = 96  # Forecast 96 steps ahead

nhits = NHITS(
    h=H,
    input_size=5 * H,           # Lookback = 5x horizon
    stack_types=['identity', 'identity', 'identity'],  # Generic stacks
    n_blocks=[1, 1, 1],
    mlp_units=[[512, 512], [512, 512], [512, 512]],
    n_pool_kernel_size=[2, 2, 1],   # MaxPool kernel sizes per stack
    # Stack 1: pool=2 (medium-freq)
    # Stack 2: pool=2 (medium-freq)
    # Stack 3: pool=1 (full resolution, high-freq)
    n_freq_downsample=[4, 2, 1],    # Output frequency downsample per stack
    # Stack 1 outputs H/4 points, interpolated to H
    # Stack 2 outputs H/2 points, interpolated to H
    # Stack 3 outputs H points (full resolution)
    dropout_prob_theta=0.0,
    learning_rate=1e-3,
    max_steps=1000,
    loss=MAE(),
    scaler_type='standard',
    random_seed=1,
)

nf = NeuralForecast(models=[nhits], freq='H')
nf.fit(df=Y_df)
forecasts = nf.predict()
print(forecasts.head())

# ── AutoNHITS: automatic hyperparameter tuning ────────────────────────────────
from ray import tune

auto_nhits = AutoNHITS(
    h=H,
    config={
        'input_size': tune.choice([2*H, 3*H, 5*H]),
        'learning_rate': tune.loguniform(1e-4, 1e-2),
        'n_pool_kernel_size': tune.choice([
            [8, 4, 1],
            [4, 2, 1],
            [2, 2, 1],
        ]),
        'n_freq_downsample': tune.choice([
            [8, 4, 1],
            [4, 2, 1],
        ]),
        'n_blocks': tune.choice([[1, 1, 1], [3, 3, 3]]),
    },
    num_samples=30,
    refit_with_val=True,
)

nf_auto = NeuralForecast(models=[auto_nhits], freq='H')
nf_auto.fit(df=Y_df)

# ── Probabilistic N-HiTS with quantile outputs ───────────────────────────────
nhits_prob = NHITS(
    h=H,
    input_size=3 * H,
    stack_types=['identity', 'identity', 'identity'],
    n_blocks=[1, 1, 1],
    mlp_units=[[256, 256]] * 3,
    n_pool_kernel_size=[4, 2, 1],
    n_freq_downsample=[4, 2, 1],
    loss=DistributionLoss(
        distribution='Normal',
        level=[80, 95],   # Prediction intervals to output
    ),
    max_steps=500,
)

nf_prob = NeuralForecast(models=[nhits_prob], freq='H')
nf_prob.fit(df=Y_df)
prob_forecasts = nf_prob.predict()
# prob_forecasts has columns: NHITS, NHITS-lo-80, NHITS-hi-80, NHITS-lo-95, NHITS-hi-95
print(prob_forecasts.columns.tolist())

# ── Benchmarking N-HiTS vs N-BEATS ───────────────────────────────────────────
from neuralforecast.models import NBEATS
from neuralforecast.utils import AirPassengersDF

# Use built-in dataset for quick demo
df = AirPassengersDF

nf_compare = NeuralForecast(
    models=[
        NHITS(h=12, input_size=24, max_steps=200, loss=MAE()),
        NBEATS(h=12, input_size=24, max_steps=200, loss=MAE()),
    ],
    freq='M',
)
nf_compare.fit(df=df)
cv_results = nf_compare.cross_validation(df=df, n_windows=3)
print(cv_results.groupby('model')['MAE'].mean())
`}</PythonCode>

      <ExampleBlock title="When to Choose N-HiTS over N-BEATS">
        <p>
          Use N-HiTS when your forecast horizon is long relative to the lookback window (H/T &gt; 0.5),
          or when you know the series contains multiple frequency components (e.g., hourly data with
          daily and weekly seasonality). For short horizons on monthly data (H=12, T=24), N-BEATS
          with a generic stack is often simpler and equally good.
        </p>
      </ExampleBlock>

      <WarningBlock title="Pool Kernel Size Configuration">
        The <code>n_pool_kernel_size</code> and <code>n_freq_downsample</code> are the most important
        hyperparameters for N-HiTS. A common mistake is using pool sizes that don't match the actual
        seasonal periods in the data. For hourly data: try pool sizes [24, 8, 1] to create stacks
        specialized for daily, 3-hourly, and hourly patterns.
      </WarningBlock>

      <ReferenceList references={[
        { authors: 'Challu, C., Olivares, K.G., Oreshkin, B.N. et al.', year: 2023, title: 'N-HiTS: Neural Hierarchical Interpolation for Time Series Forecasting', venue: 'AAAI 2023', url: 'https://arxiv.org/abs/2201.12886' },
        { authors: 'Zeng, A., Chen, M., Zhang, L., Xu, Q.', year: 2023, title: 'Are Transformers Effective for Time Series Forecasting?', venue: 'AAAI 2023', url: 'https://arxiv.org/abs/2205.13504' },
        { authors: 'Oreshkin, B.N. et al.', year: 2020, title: 'N-BEATS: Neural basis expansion analysis for interpretable time series forecasting', venue: 'ICLR 2020', url: 'https://arxiv.org/abs/1905.10437' },
      ]} />
    </SectionLayout>
  );
}
