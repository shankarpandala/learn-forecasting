import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Generate synthetic seasonal data and fake decomposition
function generateSeriesData(n = 60) {
  const data = [];
  for (let t = 0; t < n; t++) {
    const trend    = 80 + 0.6 * t;
    const seasonal = 20 * Math.sin(2 * Math.PI * t / 12);
    const residual = Math.sin(t * 2.3 + 0.5) * 5 + Math.cos(t * 5.1) * 3;
    data.push({
      t,
      original: Math.round((trend + seasonal + residual) * 10) / 10,
      trend: Math.round(trend * 10) / 10,
      seasonal: Math.round(seasonal * 10) / 10,
      residual: Math.round(residual * 10) / 10,
    });
  }
  return data;
}

function DecompositionChart() {
  const [view, setView] = useState('original');
  const data = generateSeriesData();

  const panels = [
    { key: 'original', label: 'Original', color: '#0284c7', domain: ['auto', 'auto'] },
    { key: 'trend', label: 'Trend', color: '#dc2626', domain: [75, 120] },
    { key: 'seasonal', label: 'Seasonal', color: '#16a34a', domain: [-30, 30] },
    { key: 'residual', label: 'Residual', color: '#9333ea', domain: [-15, 15] },
  ];

  const active = panels.find(p => p.key === view);

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
      <h3 className="text-lg font-semibold text-sky-900 mb-1">Interactive: Time Series Decomposition</h3>
      <p className="text-sm text-sky-700 mb-4">Click a component to view it separately.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {panels.map(p => (
          <button
            key={p.key}
            onClick={() => setView(p.key)}
            style={{ borderColor: p.color, color: view === p.key ? 'white' : p.color, background: view === p.key ? p.color : 'white' }}
            className="px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis dataKey="t" label={{ value: 't (months)', position: 'insideBottom', offset: -3 }} />
          <YAxis domain={active.domain} />
          <Tooltip formatter={(v) => [v.toFixed(2), active.label]} />
          <Line
            type="monotone" dataKey={active.key}
            stroke={active.color} strokeWidth={2} dot={false}
          />
          {active.key === 'residual' && (
            <Line type="monotone" dataKey={() => 0} stroke="#ccc" strokeWidth={1} dot={false} strokeDasharray="4 2" />
          )}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-center text-sky-500 mt-2">
        Additive model: original = trend + seasonal + residual
      </p>
    </div>
  );
}

const PYTHON_CODE = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose, STL

# Load airline passengers data
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
df = pd.read_csv(url, index_col=0, parse_dates=True)
df.columns = ['passengers']
df.index.freq = 'MS'

# ─── Classical Decomposition (Additive) ──────────────────────────────────────
result_add = seasonal_decompose(df['passengers'], model='additive', period=12)

fig, axes = plt.subplots(4, 1, figsize=(12, 10), sharex=True)
result_add.observed.plot(ax=axes[0], title='Observed', color='steelblue')
result_add.trend.plot(ax=axes[1], title='Trend (centred MA)', color='red')
result_add.seasonal.plot(ax=axes[2], title='Seasonal', color='green')
result_add.resid.plot(ax=axes[3], title='Residual', color='purple')
for ax in axes:
    ax.grid(alpha=0.3)
plt.suptitle('Classical Additive Decomposition', fontsize=14)
plt.tight_layout()
plt.show()

# ─── Classical Decomposition (Multiplicative) ────────────────────────────────
result_mul = seasonal_decompose(df['passengers'], model='multiplicative', period=12)
# For multiplicative: observed = trend * seasonal * residual

# Seasonal indices (multiplicative)
seasonal_idx = result_mul.seasonal[:12]
print("Multiplicative seasonal indices:")
for i, (month, idx) in enumerate(zip(
    ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    seasonal_idx)):
    print(f"  {month}: {idx:.4f}")

# ─── STL Decomposition (robust to outliers) ───────────────────────────────────
stl = STL(df['passengers'], period=12, robust=True)
stl_result = stl.fit()

fig2 = stl_result.plot()
fig2.suptitle('STL Decomposition (robust=True)', fontsize=14)
plt.tight_layout()
plt.show()

# Compare STL vs classical residual variance
var_classical = result_add.resid.dropna().var()
var_stl       = stl_result.resid.var()
print(f"\\nClassical residual variance: {var_classical:.2f}")
print(f"STL residual variance:        {var_stl:.2f}")
print("Smaller residual variance indicates better trend/seasonal extraction.")
`;

export default function DecompositionSection() {
  return (
    <SectionLayout
      title="Classical & STL Decomposition"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['Patterns in Time Series']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            Decomposition methods separate a time series into its constituent components —
            trend, seasonal, and remainder — making each component visible for analysis and
            modelling. Two main approaches exist: <strong>classical decomposition</strong>,
            which uses moving averages, and <strong>STL decomposition</strong>, which uses
            locally weighted regression (LOESS) and is more flexible and robust.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Additive vs Multiplicative</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
              <h4 className="font-bold text-sky-900 mb-2">Additive</h4>
              <BlockMath math="y_t = T_t + S_t + R_t" />
              <p className="text-sm text-sky-800">Seasonal variation constant in absolute size. Choose when the seasonal range does not depend on the level.</p>
            </div>
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
              <h4 className="font-bold text-cyan-900 mb-2">Multiplicative</h4>
              <BlockMath math="y_t = T_t \cdot S_t \cdot R_t" />
              <p className="text-sm text-cyan-800">Seasonal variation proportional to level. Equivalent to additive decomposition of <InlineMath math="\log y_t" />.</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm">
            To choose, plot the series and inspect whether the seasonal swings grow as
            the level grows. The airline passenger data is the canonical example of
            multiplicative seasonality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Classical Decomposition</h2>
          <p className="text-gray-700 mb-4">
            Classical decomposition uses centred moving averages to estimate the trend,
            then averages the detrended series by season to obtain seasonal indices.
          </p>

          <DefinitionBlock
            label="Definition 2.5"
            title="Centred Moving Average"
            definition="For a series with even period m, the centred moving average uses a 2×m-MA to produce a symmetric smoother. For odd m, an m-MA is used directly. The CMA estimates the trend-cycle component."
            notation="\hat{T}_t = \frac{1}{m}\sum_{k=-\lfloor m/2\rfloor}^{\lfloor m/2\rfloor} y_{t+k} \quad \text{(odd } m\text{)}"
          />

          <p className="text-gray-700 mt-2 mb-2">
            The classical algorithm (additive) proceeds:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm ml-4">
            <li>Compute centred moving average <InlineMath math="\hat{T}_t" /> with order <InlineMath math="m" /></li>
            <li>Detrend: <InlineMath math="y_t - \hat{T}_t = \hat{S}_t + \hat{R}_t" /></li>
            <li>Seasonal indices: average detrended values for each season position <InlineMath math="s \in \{1,\ldots,m\}" />, normalise to sum to zero</li>
            <li>Remainder: <InlineMath math="\hat{R}_t = y_t - \hat{T}_t - \hat{S}_t" /></li>
          </ol>
        </section>

        <WarningBlock title="Classical Decomposition Limitations">
          <ul className="space-y-1 list-disc list-inside text-sm">
            <li>Trend estimates are missing at the start and end of the series (the moving average window loses observations).</li>
            <li>Trend oversmooths rapid changes — it cannot track sudden level shifts.</li>
            <li>Seasonal component is assumed constant: the same pattern every year. This fails for evolving seasonality.</li>
            <li>Not robust to outliers — a single outlier can distort the moving average estimate over a range of m observations.</li>
          </ul>
        </WarningBlock>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">STL Decomposition</h2>
          <p className="text-gray-700 mb-4">
            STL (Seasonal and Trend decomposition using Loess) was introduced by Cleveland
            et al. (1990). It is an iterative algorithm that alternates between inner loops
            (updating seasonal and trend) and outer loops (robustness re-weighting).
          </p>

          <DefinitionBlock
            label="Definition 2.6"
            title="STL Decomposition"
            definition="STL decomposes y_t = T_t + S_t + R_t using LOESS smoothing. The seasonal component is extracted via cycle-subseries smoothing (a LOESS fit to each month separately across years). The trend is then obtained by LOESS smoothing of the seasonally adjusted series. Outer iterations downweight outlier points."
            notation="y_t = T_t + S_t + R_t, \quad T_t = \mathrm{LOESS}(y_t - S_t), \quad S_t = \mathrm{LOESS\ per\ subseries}"
          />

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-100">
                  {['Feature', 'Classical', 'STL'].map(h => (
                    <th key={h} className="border border-sky-200 px-3 py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Seasonal variation', 'Constant', 'Can change over time'],
                  ['Robustness to outliers', 'Not robust', 'Robust (outer iterations)'],
                  ['Handles any periodicity', 'Yes', 'Yes'],
                  ['Missing end-points', 'Yes (MA window)', 'No (LOESS extrapolates)'],
                  ['Computational cost', 'Low', 'Moderate (iterative)'],
                  ['Multiplicative support', 'Yes (directly)', 'Via log transform'],
                ].map(row => (
                  <tr key={row[0]} className="border-b border-sky-100 hover:bg-sky-50">
                    {row.map((cell, i) => (
                      <td key={i} className={`border border-sky-200 px-3 py-2 ${i === 0 ? 'font-medium' : ''}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <DecompositionChart />

        <NoteBlock type="fpp3" title="FPP3 Chapter 3: Time Series Decomposition">
          Hyndman & Athanasopoulos cover classical decomposition in Section 3.3 and STL in
          Section 3.5 of <em>Forecasting: Principles and Practice</em> (3rd ed.). The book
          recommends STL for most practical applications due to its flexibility and
          robustness. The <code>feasts</code> R package provides <code>classical_decomposition()</code>{' '}
          and <code>STL()</code> functions that integrate with the tidyverts ecosystem.
        </NoteBlock>

        <PythonCode
          title="Classical and STL Decomposition with statsmodels"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              authors: 'Cleveland, R.B., Cleveland, W.S., McRae, J.E. & Terpenning, I.',
              year: 1990,
              title: 'STL: A seasonal-trend decomposition procedure based on loess',
              venue: 'Journal of Official Statistics, 6(1), 3–73',
              type: 'paper',
              whyImportant: 'The original STL paper. Describes the inner/outer loop algorithm and provides extensive empirical validation.',
            },
            {
              authors: 'Hyndman, R.J. & Athanasopoulos, G.',
              year: 2021,
              title: 'Forecasting: Principles and Practice (3rd ed.), Chapter 3',
              venue: 'OTexts',
              type: 'book',
              whyImportant: 'Accessible coverage of all major decomposition methods with R examples.',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
