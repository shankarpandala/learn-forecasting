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

// Block architecture diagram
function NBeatsArchDiagram() {
  const [activeStack, setActiveStack] = useState(0);
  const stacks = ['Generic Stack 1', 'Generic Stack 2', 'Seasonality Stack', 'Trend Stack'];
  const colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981'];

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">N-BEATS Doubly Residual Stack</h4>
      <div className="flex gap-2 mb-4 flex-wrap">
        {stacks.map((s, i) => (
          <button key={i}
            onClick={() => setActiveStack(i)}
            className={`px-3 py-1 rounded text-sm border-2 transition-all ${activeStack === i ? 'text-white' : 'bg-white text-gray-700'}`}
            style={activeStack === i ? { backgroundColor: colors[i], borderColor: colors[i] } : { borderColor: colors[i] }}
          >
            {s}
          </button>
        ))}
      </div>

      <svg width="100%" viewBox="0 0 500 230" style={{ maxWidth: 500 }}>
        {/* Input */}
        <rect x="10" y="95" width="80" height="40" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="50" y="119" textAnchor="middle" fontSize="11" fill="#475569">Input x</text>

        {/* Stacks */}
        {stacks.map((s, i) => (
          <g key={i} opacity={activeStack === i ? 1 : 0.4}>
            <rect x={110 + i * 90} y="80" width="70" height="70" rx="8"
              fill={activeStack === i ? colors[i] : '#f3f4f6'}
              stroke={colors[i]} strokeWidth="2" />
            <text x={145 + i * 90} y="108" textAnchor="middle" fontSize="10"
              fill={activeStack === i ? 'white' : colors[i]} fontWeight="bold">Block</text>
            <text x={145 + i * 90} y="122" textAnchor="middle" fontSize="9"
              fill={activeStack === i ? 'white' : '#6b7280'}>{i + 1}</text>
            {/* Backcast output (upward) */}
            <line x1={145 + i * 90} y1="80" x2={145 + i * 90} y2="45"
              stroke={colors[i]} strokeWidth="1.5" markerEnd="url(#nb-arrow)" />
            <text x={145 + i * 90} y="38" textAnchor="middle" fontSize="9" fill={colors[i]}>backcast</text>
            {/* Forecast (downward) */}
            <line x1={145 + i * 90} y1="150" x2={145 + i * 90} y2="185"
              stroke={colors[i]} strokeWidth="1.5" markerEnd="url(#nb-arrow)" />
            <text x={145 + i * 90} y="198" textAnchor="middle" fontSize="9" fill={colors[i]}>forecast</text>
            {/* Residual arrow (between stacks) */}
            {i < stacks.length - 1 && (
              <line x1={180 + i * 90} y1="115" x2={110 + (i + 1) * 90} y2="115"
                stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#nb-arrow)" />
            )}
          </g>
        ))}

        <defs>
          <marker id="nb-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="#64748b" />
          </marker>
        </defs>
      </svg>

      <p className="text-xs text-gray-500 mt-2">
        Each block produces a backcast (residual subtracted from input) and a forecast (added to output sum).
        The residual connection forces each block to focus on unexplained signal.
      </p>
    </div>
  );
}

export default function NBeats() {
  return (
    <SectionLayout
      title="N-BEATS: Neural Basis Expansion Analysis for Interpretable Time Series Forecasting"
      difficulty="advanced"
      readingTime={40}
      prerequisites={['Deep learning fundamentals', 'Time series decomposition', 'Residual networks']}
    >
      <p className="text-gray-700 leading-relaxed">
        N-BEATS (Oreshkin et al., ICLR 2020) was a landmark paper: a purely feed-forward neural network
        — no recurrence, no attention — that set new state-of-the-art on M4 and M3 benchmarks. Its
        elegance lies in a <strong>doubly residual architecture</strong> where blocks progressively
        refine forecasts by subtracting what each block can explain.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Core Architecture: The Block</h2>
      <p className="text-gray-700 leading-relaxed">
        The fundamental building block of N-BEATS is deceptively simple: a stack of fully-connected
        layers followed by two linear projections:
      </p>

      <DefinitionBlock title="N-BEATS Block">
        <p className="mb-2">Given input <InlineMath math="x \in \mathbb{R}^T" /> (lookback window):</p>
        <BlockMath math="\mathbf{h} = \text{FC}_4(\text{FC}_3(\text{FC}_2(\text{FC}_1(x))))" />
        <BlockMath math="\hat{x} = V_b \, \theta_b, \quad \theta_b = \text{Linear}_b(\mathbf{h})" />
        <BlockMath math="\hat{y} = V_f \, \theta_f, \quad \theta_f = \text{Linear}_f(\mathbf{h})" />
        <p className="mt-2">
          where <InlineMath math="\hat{x} \in \mathbb{R}^T" /> is the <strong>backcast</strong> (reconstruction
          of the input) and <InlineMath math="\hat{y} \in \mathbb{R}^H" /> is the <strong>forecast</strong>.
          <InlineMath math="V_b, V_f" /> are basis matrices defined by the block type.
        </p>
      </DefinitionBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Doubly Residual Stacking</h2>
      <p className="text-gray-700 leading-relaxed">
        Blocks are organized into stacks, and stacks are chained. The residual mechanism:
      </p>
      <BlockMath math="x^{(l+1)} = x^{(l)} - \hat{x}^{(l)} \quad \text{(residual input to next block)}" />
      <BlockMath math="\hat{y}_{\text{total}} = \sum_{l=1}^{L} \hat{y}^{(l)} \quad \text{(sum of block forecasts)}" />

      <p className="text-gray-700 leading-relaxed mt-3">
        This "doubly residual" design forces each successive block to model only what previous blocks
        failed to explain — a form of <strong>boosting in function space</strong> rather than just
        adding residual skip connections.
      </p>

      <NBeatsArchDiagram />

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Generic vs. Interpretable Variants</h2>

      <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2">Generic N-BEATS</h3>
      <p className="text-gray-700 leading-relaxed">
        In the generic version, <InlineMath math="V_b" /> and <InlineMath math="V_f" /> are learned linear
        layers — no human-specified structure. The expansion coefficients <InlineMath math="\theta" /> are
        projected to the forecast via:
      </p>
      <BlockMath math="V_f \in \mathbb{R}^{H \times p}, \quad \hat{y} = V_f \theta_f" />
      <p className="text-gray-700 leading-relaxed mt-2">
        where <InlineMath math="p \ll H" /> is the number of expansion coefficients. This is a
        <strong> bottleneck</strong> that regularizes the forecast.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2">Interpretable N-BEATS</h3>
      <p className="text-gray-700 leading-relaxed">
        The interpretable version uses domain-knowledge basis functions — this is where the model
        becomes truly elegant:
      </p>

      <DefinitionBlock title="Polynomial Trend Basis">
        <BlockMath math="V_f^{\text{trend}}[t, p] = \left(\frac{t}{H}\right)^p, \quad t = 1,\ldots,H,\; p = 0,\ldots,P" />
        <p className="mt-2">
          Each column is a polynomial basis function evaluated at forecast time points
          <InlineMath math="t / H" /> for <InlineMath math="t = 1, \ldots, H" />. With
          <InlineMath math="P = 2" />, this produces constant + linear + quadratic trend components.
        </p>
      </DefinitionBlock>

      <DefinitionBlock title="Fourier Seasonality Basis">
        <BlockMath math="V_f^{\text{season}}[t, 2k-1] = \cos\!\left(\frac{2\pi k t}{H}\right), \quad V_f^{\text{season}}[t, 2k] = \sin\!\left(\frac{2\pi k t}{H}\right)" />
        <p className="mt-2">
          Fourier basis functions for seasonality with <InlineMath math="K" /> harmonics.
          The network learns <em>amplitudes</em> <InlineMath math="\theta_f" />, while the
          frequencies are fixed — interpretable because you can read off seasonal components.
        </p>
      </DefinitionBlock>

      <ExampleBlock title="Interpretability in Action">
        <p>
          After training, you can decompose any forecast as:
          <InlineMath math="\hat{y} = \hat{y}_{\text{trend}} + \hat{y}_{\text{seasonality}}" />.
          The trend stack's output tells you the growth/decay direction; the seasonality stack's
          output shows the periodic component. This rivals STL decomposition but is learned end-to-end.
        </p>
      </ExampleBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Why No Recurrence?</h2>
      <p className="text-gray-700 leading-relaxed">
        N-BEATS challenges the assumption that sequential architectures are necessary for time series.
        The lookback window provides a fixed-size context, and fully-connected layers with sufficient
        capacity can capture temporal dependencies within that window. Key advantages:
      </p>
      <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
        <li>Fully parallelizable — no sequential computation bottleneck</li>
        <li>Easier to train (no vanishing gradient through time)</li>
        <li>Interpretable decomposition (interpretable version)</li>
        <li>Strong inductive bias through basis expansion</li>
      </ul>

      <NoteBlock title="NBEATSx: Extension with Exogenous Variables">
        The NBEATSx extension (Lopez-Ordoñez et al., 2022) adds exogenous covariates by modifying
        the block input to include both the target lookback window and covariate time series.
        Available in <code>neuralforecast</code> as <code>NBEATSx</code>.
      </NoteBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Python: N-BEATS with neuralforecast</h2>

      <PythonCode>{`import pandas as pd
import numpy as np
from neuralforecast import NeuralForecast
from neuralforecast.models import NBEATS, NBEATSx
from neuralforecast.losses.pytorch import MAE, MQLoss
from datasetsforecast.m4 import M4

# ── Load M4 monthly data ───────────────────────────────────────────────────────
train_df, *_ = M4.load(directory='data', group='Monthly')
# Long format: columns = ['unique_id', 'ds', 'y']
print(train_df.head())
print(f"Series: {train_df['unique_id'].nunique()}, Rows: {len(train_df)}")

# ── Basic N-BEATS (Generic) ───────────────────────────────────────────────────
nf = NeuralForecast(
    models=[
        NBEATS(
            h=18,                     # Forecast horizon (M4 monthly = 18 months)
            input_size=2 * 18,        # Lookback = 2x horizon
            stack_types=['generic', 'generic', 'generic'],  # 3 generic stacks
            n_blocks=[1, 1, 1],       # 1 block per stack
            mlp_units=[[512, 512], [512, 512], [512, 512]],  # 4 FC layers of 512
            n_harmonics=0,            # Only used for seasonality stacks
            n_polynomials=0,          # Only used for trend stacks
            max_steps=1000,
            learning_rate=1e-3,
            batch_size=1024,
            loss=MAE(),
            scaler_type='standard',   # Normalize per-series
            random_seed=42,
        )
    ],
    freq='M',
)
nf.fit(df=train_df)
preds = nf.predict()
print(preds.head())

# ── Interpretable N-BEATS ─────────────────────────────────────────────────────
nf_interp = NeuralForecast(
    models=[
        NBEATS(
            h=18,
            input_size=36,
            stack_types=['trend', 'seasonality'],  # Interpretable decomposition
            n_blocks=[3, 3],           # 3 blocks per stack
            mlp_units=[[256, 256], [256, 256]],
            n_polynomials=2,           # Degree of trend polynomial
            n_harmonics=2,             # Number of Fourier harmonics
            max_steps=1000,
            loss=MAE(),
        )
    ],
    freq='M',
)
nf_interp.fit(df=train_df)

# ── N-BEATSx with exogenous covariates ────────────────────────────────────────
# Suppose we have a 'price_index' covariate
train_with_cov = train_df.copy()
train_with_cov['price_index'] = np.random.randn(len(train_df))  # Placeholder

nf_x = NeuralForecast(
    models=[
        NBEATSx(
            h=18,
            input_size=36,
            futr_exog_list=['price_index'],   # Known in forecast horizon
            hist_exog_list=[],                # Only in historical window
            stack_types=['generic'],
            n_blocks=[3],
            mlp_units=[[512, 512]],
            max_steps=500,
            loss=MAE(),
        )
    ],
    freq='M',
)
nf_x.fit(df=train_with_cov)

# ── AutoNBEATS: Hyperparameter search ─────────────────────────────────────────
from neuralforecast.auto import AutoNBEATS
from ray import tune

nf_auto = NeuralForecast(
    models=[
        AutoNBEATS(
            h=18,
            config={
                'input_size': tune.choice([36, 72, 144]),
                'learning_rate': tune.loguniform(1e-4, 1e-2),
                'n_blocks': tune.choice([[1, 1], [3, 3], [3, 3, 3]]),
                'stack_types': tune.choice([
                    ['generic', 'generic'],
                    ['trend', 'seasonality'],
                ]),
            },
            num_samples=20,   # Trials
            refit_with_val=True,
        )
    ],
    freq='M',
)
nf_auto.fit(df=train_df)
`}</PythonCode>

      <WarningBlock title="Input Size Matters">
        N-BEATS is sensitive to the ratio of input size (lookback) to horizon. The authors recommend
        input_size = 2H to 5H. Too short a lookback and the model lacks context; too long and
        it adds noise. For daily data with weekly seasonality, try input_size = 7H.
      </WarningBlock>

      <ReferenceList references={[
        { authors: 'Oreshkin, B.N., Carpov, D., Chapados, N., Bengio, Y.', year: 2020, title: 'N-BEATS: Neural basis expansion analysis for interpretable time series forecasting', venue: 'ICLR 2020', url: 'https://arxiv.org/abs/1905.10437' },
        { authors: 'Lopez-Ordoñez, G. et al.', year: 2022, title: 'N-BEATSx: Neural basis expansion analysis with exogenous variables', venue: 'International Journal of Forecasting', url: 'https://arxiv.org/abs/2104.05522' },
        { authors: 'Makridakis, S. et al.', year: 2020, title: 'The M4 Competition: 100,000 time series and 61 forecasting methods', venue: 'International Journal of Forecasting', url: 'https://doi.org/10.1016/j.ijforecast.2019.04.014' },
      ]} />
    </SectionLayout>
  );
}
