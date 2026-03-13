import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Generate synthetic time series with controllable components
function buildSeries(opts) {
  const { trend, seasonal, cycle, noise, n } = opts;
  const data = [];
  for (let t = 0; t < n; t++) {
    const trendVal   = trend    ? 0.5 * t : 0;
    const seasonVal  = seasonal ? 15 * Math.sin(2 * Math.PI * t / 12) : 0;
    const cycleVal   = cycle    ? 20 * Math.sin(2 * Math.PI * t / 48) : 0;
    const noiseVal   = noise    ? (Math.sin(t * 37.3) * 10 + Math.cos(t * 19.7) * 8) : 0;
    const y = 100 + trendVal + seasonVal + cycleVal + noiseVal;
    data.push({ t, y: Math.round(y * 10) / 10 });
  }
  return data;
}

function TSPatternViz() {
  const [components, setComponents] = useState({ trend: true, seasonal: true, cycle: false, noise: false });
  const data = buildSeries({ ...components, n: 60 });

  const toggle = key => setComponents(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
      <h3 className="text-lg font-semibold text-sky-900 mb-1">Interactive: Time Series Components</h3>
      <p className="text-sm text-sky-700 mb-4">
        Toggle components on/off to see how each one shapes the time series.
      </p>
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { key: 'trend', label: 'Trend', color: 'bg-sky-600' },
          { key: 'seasonal', label: 'Seasonality', color: 'bg-cyan-500' },
          { key: 'cycle', label: 'Cycle', color: 'bg-teal-500' },
          { key: 'noise', label: 'Irregular', color: 'bg-orange-400' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              components[key] ? 'text-white shadow-md ' + color : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current opacity-70" />
            {label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis dataKey="t" label={{ value: 'Time (months)', position: 'insideBottom', offset: -2 }} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip formatter={(v) => [v.toFixed(1), 'y(t)']} />
          <Line
            type="monotone" dataKey="y"
            stroke="#0284c7" strokeWidth={2} dot={false}
            name="Composite series"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-sky-600 mt-2 text-center">
        Active: {Object.entries(components).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none (constant series)'}
      </p>
    </div>
  );
}

const PYTHON_CODE = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

np.random.seed(42)
n = 120  # 10 years of monthly data
t = np.arange(n)

# ─── Individual components ──────────────────────────────────────────────────
trend     = 0.5 * t                                        # linear upward drift
seasonal  = 15 * np.sin(2 * np.pi * t / 12)               # annual cycle (m=12)
cycle     = 20 * np.sin(2 * np.pi * t / 48)               # ~4-year business cycle
irregular = np.random.normal(0, 8, n)                      # white noise

# ─── Additive composition ───────────────────────────────────────────────────
y = 100 + trend + seasonal + cycle + irregular

dates = pd.date_range('2014-01', periods=n, freq='MS')
series = pd.Series(y, index=dates, name='Composite')

# ─── Plot all components separately ─────────────────────────────────────────
fig, axes = plt.subplots(5, 1, figsize=(12, 16), sharex=True)

for ax, data, title, color in zip(axes,
    [y, trend, seasonal, cycle, irregular],
    ['Composite', 'Trend', 'Seasonality (m=12)', 'Cycle (~4 yr)', 'Irregular'],
    ['steelblue', 'red', 'green', 'purple', 'gray']):
    ax.plot(dates, data, color=color, linewidth=1.5)
    ax.set_title(title, fontsize=11)
    ax.grid(alpha=0.3)

plt.tight_layout()
plt.show()

# ─── Characteristics summary ────────────────────────────────────────────────
print("Series summary:")
print(series.describe())
print(f"\\nSeasonal range: {seasonal.max() - seasonal.min():.1f}")
print(f"Trend at end:   {trend[-1]:.1f}")
print(f"Noise std:      {irregular.std():.2f}")
`;

export default function TSPatternsSection() {
  return (
    <SectionLayout
      title="Patterns in Time Series"
      difficulty="beginner"
      readingTime={25}
      prerequisites={['What is Forecasting?']}
    >
      <div className="space-y-6">
        <NoteBlock type="historical" title="Decomposition Origins">
          The idea of decomposing a time series into systematic and irregular components dates
          to the 19th century, when economists separated "secular trend" from seasonal
          fluctuations in economic data. Warren Persons (1919) formalised the four-component
          model — trend, cycle, seasonal, irregular — which remains the standard framework.
        </NoteBlock>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">The Four Components</h2>
          <p className="text-gray-700 mb-4">
            Most real-world time series can be understood as the combination of four
            underlying patterns. Identifying which components are present guides the choice
            of models and transformations.
          </p>
        </section>

        <DefinitionBlock
          label="Definition 2.1"
          title="Trend"
          definition="The trend T_t is the long-run, systematic increase or decrease in the level of the series. Trends may be linear, nonlinear (exponential, logistic), or piecewise. A series is said to have a stochastic trend if the trend itself evolves randomly over time (e.g., a random walk)."
          notation="T_t = \beta_0 + \beta_1 t \quad \text{(linear trend)}"
        />

        <DefinitionBlock
          label="Definition 2.2"
          title="Seasonality"
          definition="Seasonality S_t refers to regular, periodic fluctuations with a fixed and known period m (e.g., m=12 for monthly data with annual seasonality, m=7 for daily data with weekly seasonality). Seasonal patterns are deterministic and predictable given the calendar position."
          notation="S_t = S_{t-m} \quad \text{(seasonal pattern repeats every } m \text{ periods)}"
        />

        <DefinitionBlock
          label="Definition 2.3"
          title="Cycle"
          definition="A cycle C_t consists of rises and falls that are not of a fixed period. Cycles typically have durations of 2–10 years and are driven by economic, political, or other systemic forces. Unlike seasonality, cycle lengths are irregular and often only identifiable in retrospect."
          notation="C_t \text{ — aperiodic oscillation, } 2 \le \text{period} \le 10 \text{ years typically}"
        />

        <DefinitionBlock
          label="Definition 2.4"
          title="Irregular (Remainder) Component"
          definition="The irregular component E_t captures all variation not explained by trend, seasonality, or cycle. In an ideal model it is white noise: a sequence of uncorrelated random variables with zero mean and constant variance. Non-white-noise residuals indicate model misspecification."
          notation="E_t \sim \mathrm{WN}(0, \sigma^2) \quad \text{(white noise)}"
        />

        <TSPatternViz />

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">
            Additive vs Multiplicative Decomposition
          </h2>
          <p className="text-gray-700 mb-4">
            The components can combine additively or multiplicatively. When seasonal
            variation scales with the level of the series, a multiplicative structure is more
            appropriate — the log transform converts it to additive.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
              <h4 className="font-semibold text-sky-900 mb-2">Additive Model</h4>
              <BlockMath math="y_t = T_t + S_t + C_t + E_t" />
              <p className="text-sm text-sky-800 mt-2">
                Use when seasonal variation is roughly constant in absolute terms regardless
                of the series level. Appropriate for many economic series.
              </p>
            </div>
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
              <h4 className="font-semibold text-cyan-900 mb-2">Multiplicative Model</h4>
              <BlockMath math="y_t = T_t \times S_t \times C_t \times E_t" />
              <p className="text-sm text-cyan-800 mt-2">
                Use when seasonal fluctuations grow proportionally with the level.
                Equivalent to an additive model on <InlineMath math="\log y_t" />.
                Common in retail sales, airline data.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Component Characteristics</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-100">
                  {['Component', 'Period', 'Predictability', 'Stochastic?', 'Modelling approach'].map(h => (
                    <th key={h} className="border border-sky-200 px-3 py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Trend', 'None (long-run)', 'High (short-term)', 'Can be', 'Differencing, HP filter, STL'],
                  ['Seasonality', 'Fixed (m known)', 'Very high', 'Usually not', 'Seasonal dummies, Fourier terms, SARIMA'],
                  ['Cycle', '2–10 years (variable)', 'Low to moderate', 'Yes', 'Business cycle models, HP filter'],
                  ['Irregular', 'None', 'None (by def.)', 'Yes', 'White noise model; check if WN holds'],
                ].map(row => (
                  <tr key={row[0]} className="border-b border-sky-100 hover:bg-sky-50">
                    {row.map((cell, i) => (
                      <td key={i} className={`border border-sky-200 px-3 py-2 ${i === 0 ? 'font-semibold' : ''}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ExampleBlock
          title="Identifying Components in Retail Sales Data"
          difficulty="beginner"
          problem="Monthly retail clothing sales show: (1) a steady upward drift over 5 years, (2) a spike every December that roughly doubles baseline sales, (3) random month-to-month fluctuations. Identify the components and choose the decomposition type."
          solution={[
            { step: 'Identify trend', explanation: 'The steady upward drift over 5 years is a trend component T_t. Its gradual nature suggests a linear or slowly-varying trend.' },
            { step: 'Identify seasonality', explanation: 'The December spike with fixed period m=12 is classic annual seasonality S_t. It is calendar-driven and fully predictable.' },
            { step: 'Assess multiplicative vs additive', explanation: 'If the December spike is "roughly double baseline", the seasonal amplitude grows with the level — this suggests a multiplicative structure. Visually check: does the seasonal range increase as the level increases?' },
            { step: 'Choose decomposition', formula: 'y_t = T_t \\times S_t \\times E_t', explanation: 'Multiplicative decomposition (or equivalently, work with log(y_t) and use additive decomposition).' },
            { step: 'No cycle component', explanation: 'With only 5 years of data, business cycles (2–10 years) cannot be reliably identified. Absorb any cyclic variation into the trend.' },
          ]}
        />

        <PythonCode
          title="Generating Synthetic Time Series with Each Component"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              authors: 'Hyndman, R.J. & Athanasopoulos, G.',
              year: 2021,
              title: 'Forecasting: Principles and Practice (3rd ed.), Chapter 2',
              venue: 'OTexts',
              type: 'book',
              whyImportant: 'Clear introduction to time series patterns with visual examples using real datasets.',
            },
            {
              authors: 'Cleveland, R.B., Cleveland, W.S., McRae, J.E. & Terpenning, I.',
              year: 1990,
              title: 'STL: A seasonal-trend decomposition procedure based on loess',
              venue: 'Journal of Official Statistics, 6(1), 3–73',
              type: 'paper',
              whyImportant: 'Introduces the STL decomposition method, which is robust to outliers and handles changing seasonal patterns.',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
