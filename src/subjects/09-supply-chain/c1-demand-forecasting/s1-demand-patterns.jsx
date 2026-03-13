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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const smoothData = Array.from({ length: 24 }, (_, i) => ({
  t: `W${i + 1}`,
  demand: Math.round(100 + 8 * Math.sin(i * 0.5) + (Math.random() - 0.5) * 10),
}));

const erraticData = Array.from({ length: 24 }, (_, i) => ({
  t: `W${i + 1}`,
  demand: Math.round(Math.max(0, 80 + (Math.random() - 0.5) * 120)),
}));

const intermittentData = [
  ...Array.from({ length: 24 }, (_, i) => ({
    t: `W${i + 1}`,
    demand: Math.random() < 0.3 ? Math.round(20 + Math.random() * 40) : 0,
  })),
];

const lumpyData = Array.from({ length: 24 }, (_, i) => ({
  t: `W${i + 1}`,
  demand: Math.random() < 0.2 ? Math.round(150 + Math.random() * 200) : 0,
}));

const abcData = [
  { sku: 'SKU-A1', revenue: 450000, class: 'A', cv: 0.2, xyz: 'X' },
  { sku: 'SKU-A2', revenue: 320000, class: 'A', cv: 0.7, xyz: 'Y' },
  { sku: 'SKU-A3', revenue: 280000, class: 'A', cv: 1.5, xyz: 'Z' },
  { sku: 'SKU-B1', revenue: 85000,  class: 'B', cv: 0.3, xyz: 'X' },
  { sku: 'SKU-B2', revenue: 62000,  class: 'B', cv: 0.8, xyz: 'Y' },
  { sku: 'SKU-C1', revenue: 12000,  class: 'C', cv: 1.8, xyz: 'Z' },
];

const patternOptions = [
  { key: 'smooth', label: 'Smooth', data: smoothData, color: '#22c55e', description: 'Regular demand with low variability. CV < 0.5. Classical methods work well.' },
  { key: 'erratic', label: 'Erratic', data: erraticData, color: '#f59e0b', description: 'Demand occurs every period but with high variability. CV > 0.5. Difficult to forecast accurately.' },
  { key: 'intermittent', label: 'Intermittent', data: intermittentData, color: '#6366f1', description: 'Many zero periods with occasional small demands. Use Croston or SBA methods.' },
  { key: 'lumpy', label: 'Lumpy', data: lumpyData, color: '#ef4444', description: 'Intermittent AND erratic: many zeros with large, irregular spikes. Hardest to forecast.' },
];

export default function DemandPatterns() {
  const [activePattern, setActivePattern] = useState('smooth');

  const current = patternOptions.find((p) => p.key === activePattern);

  return (
    <SectionLayout
      title="Demand Patterns & ABC-XYZ Classification"
      difficulty="intermediate"
      readingTime={25}
      prerequisites={['Forecasting Basics', 'Statistical Measures']}
    >
      <p>
        Before choosing a forecasting method for a SKU, you need to understand its demand
        pattern. The same exponential smoothing that works beautifully for a steady-selling
        product will completely fail on a spare part that sells once every few months.
        Systematic demand classification directs forecasting effort where it matters most.
      </p>

      <h2>Demand Pattern Taxonomy</h2>
      <p>
        Demand patterns are characterized by two dimensions:{' '}
        <strong>frequency</strong> (how often does demand occur?) and{' '}
        <strong>variability</strong> (how much does it vary when it does occur?).
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4">
        {patternOptions.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setActivePattern(key)}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              activePattern === key ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: color }} />
            {label}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <p className="text-sm text-gray-700">{current.description}</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={current.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" tick={{ fontSize: 10 }} interval={3} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="demand" fill={current.color} name="Demand" />
        </BarChart>
      </ResponsiveContainer>

      <h2>The Four Pattern Types</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-50">
              <th className="border border-gray-300 p-2">Pattern</th>
              <th className="border border-gray-300 p-2">Freq.</th>
              <th className="border border-gray-300 p-2">Variability</th>
              <th className="border border-gray-300 p-2">Typical CV</th>
              <th className="border border-gray-300 p-2">Recommended Method</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Smooth', 'Regular', 'Low', '< 0.5', 'ETS, ARIMA, moving average'],
              ['Erratic', 'Regular', 'High', '> 0.5', 'ETS with damping, robust regression'],
              ['Intermittent', 'Sporadic', 'Low', 'ADI > 1.32', "Croston's, SBA"],
              ['Lumpy', 'Sporadic', 'High', 'Both high', 'TSB, IMAPA, simulation'],
            ].map(([pat, freq, variab, cv, method]) => (
              <tr key={pat} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">{pat}</td>
                <td className="border border-gray-300 p-2">{freq}</td>
                <td className="border border-gray-300 p-2">{variab}</td>
                <td className="border border-gray-300 p-2 font-mono">{cv}</td>
                <td className="border border-gray-300 p-2 text-gray-600">{method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>ABC Classification: By Revenue Impact</h2>
      <p>
        ABC analysis ranks SKUs by their revenue (or cost or volume) contribution. It is
        the "80/20 rule" applied to inventory:
      </p>
      <ul className="list-disc pl-6 my-3 space-y-1">
        <li><strong>Class A</strong>: Top SKUs contributing 70% of revenue. High investment in forecast accuracy.</li>
        <li><strong>Class B</strong>: Next tier, contributing the next 20% of revenue. Moderate attention.</li>
        <li><strong>Class C</strong>: Remaining SKUs, bottom 10% of revenue. Minimal effort; use simple rules.</li>
      </ul>

      <BlockMath math="\text{Cumulative revenue share}_i = \frac{\sum_{j=1}^{i} R_j}{\sum_{j=1}^{N} R_j}" />

      <h2>XYZ Classification: By Forecast Difficulty</h2>
      <p>
        XYZ classifies SKUs by how predictable their demand is, measured by the
        <strong> Coefficient of Variation (CV)</strong>:
      </p>
      <BlockMath math="\text{CV} = \frac{\sigma_d}{\bar{d}}" />
      <ul className="list-disc pl-6 my-3 space-y-1">
        <li><strong>X (predictable)</strong>: CV &lt; 0.5 — demand is stable and smooth.</li>
        <li><strong>Y (variable)</strong>: 0.5 &le; CV &lt; 1.0 — demand fluctuates moderately.</li>
        <li><strong>Z (sporadic)</strong>: CV &ge; 1.0 — demand is erratic or intermittent.</li>
      </ul>

      <NoteBlock>
        For intermittent demand, CV is undefined when <InlineMath math="\bar{d} = 0" />.
        Use the Average Demand Interval (ADI) instead: <InlineMath math="\text{ADI} = T / n_d" />
        where T is total periods and <InlineMath math="n_d" /> is periods with non-zero demand.
        ADI &gt; 1.32 indicates intermittent demand (Syntetos-Boylan classification).
      </NoteBlock>

      <h2>ABC-XYZ Matrix</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2"></th>
              <th className="border border-gray-300 p-2">X (CV &lt; 0.5)</th>
              <th className="border border-gray-300 p-2">Y (0.5–1.0)</th>
              <th className="border border-gray-300 p-2">Z (CV &ge; 1.0)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['A (top 70% rev)', 'bg-green-100', 'bg-green-50', 'bg-yellow-100',
               'Best models, frequent review', 'ML + ETS ensemble', 'Safety stock buffer'],
              ['B (next 20%)', 'bg-green-50', 'bg-yellow-50', 'bg-orange-100',
               'ETS, weekly review', 'Croston if intermittent', 'Slow-mover policy'],
              ['C (bottom 10%)', 'bg-yellow-50', 'bg-orange-50', 'bg-red-100',
               'Simple rules, min-max', 'On-demand ordering', 'Discontinue or VMI'],
            ].map(([label, c1, c2, c3, s1, s2, s3]) => (
              <tr key={label}>
                <td className="border border-gray-300 p-2 font-semibold text-left">{label}</td>
                <td className={`border border-gray-300 p-2 ${c1}`}>{s1}</td>
                <td className={`border border-gray-300 p-2 ${c2}`}>{s2}</td>
                <td className={`border border-gray-300 p-2 ${c3}`}>{s3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Python Implementation</h2>
      <PythonCode code={`import pandas as pd
import numpy as np

# ── Sample data: daily sales per SKU ────────────────────────────────────
np.random.seed(42)
n_skus = 1000
n_periods = 52  # weeks

# Simulate demand data
records = []
for i in range(n_skus):
    sku = f'SKU_{i:04d}'
    base_demand = np.random.lognormal(3, 1.5)  # varies widely across SKUs
    zero_prob = np.random.beta(2, 5)           # some SKUs are intermittent
    revenue_per_unit = np.random.uniform(5, 500)
    for w in range(n_periods):
        d = 0 if np.random.random() < zero_prob else max(0, np.random.poisson(base_demand))
        records.append({'sku': sku, 'week': w, 'demand': d,
                        'revenue': d * revenue_per_unit})

df = pd.DataFrame(records)

# ── ABC Classification ─────────────────────────────────────────────────
sku_revenue = df.groupby('sku')['revenue'].sum().sort_values(ascending=False)
total_revenue = sku_revenue.sum()
sku_revenue_pct = sku_revenue / total_revenue
cumulative_pct = sku_revenue_pct.cumsum()

def abc_class(cum_pct):
    if cum_pct <= 0.70: return 'A'
    elif cum_pct <= 0.90: return 'B'
    else: return 'C'

abc = cumulative_pct.apply(abc_class).rename('abc_class')
print(abc.value_counts())`} />

      <PythonCode code={`# ── XYZ Classification ────────────────────────────────────────────────
sku_stats = df.groupby('sku')['demand'].agg(
    mean='mean',
    std='std',
    zeros=lambda x: (x == 0).sum(),
    count='count',
)
sku_stats['cv'] = sku_stats['std'] / sku_stats['mean'].replace(0, np.nan)
sku_stats['adi'] = sku_stats['count'] / (sku_stats['count'] - sku_stats['zeros']).replace(0, np.nan)

def xyz_class(row):
    if pd.isna(row['cv']) or row['mean'] == 0:
        return 'Z'  # no demand
    if row['cv'] < 0.5:
        return 'X'
    elif row['cv'] < 1.0:
        return 'Y'
    else:
        return 'Z'

sku_stats['xyz_class'] = sku_stats.apply(xyz_class, axis=1)

# ── Combine into ABC-XYZ ───────────────────────────────────────────────
classification = sku_stats.join(abc)
classification['abcxyz'] = classification['abc_class'] + classification['xyz_class']

print(classification['abcxyz'].value_counts().sort_index())
#  AX    58   <- best: high value, predictable
#  AY    41
#  AZ    28   <- high value but hard to forecast
#  BX    92
#  ...
#  CZ   312   <- most SKUs: low value, sporadic`} />

      <PythonCode code={`# ── Strategy assignment ───────────────────────────────────────────────
strategy_map = {
    'AX': 'ML ensemble, daily review, safety stock = 1.64*sigma',
    'AY': 'ML + ETS, weekly review, safety stock = 2.05*sigma',
    'AZ': 'Croston/TSB, weekly review, high safety stock buffer',
    'BX': 'ETS, weekly review, standard safety stock',
    'BY': 'ETS or Croston, bi-weekly review',
    'BZ': 'Croston, bi-weekly review, slow-mover policy',
    'CX': 'Simple rules (min-max), monthly review',
    'CY': 'Min-max policy, monthly review',
    'CZ': 'On-demand ordering or discontinue',
}

classification['strategy'] = classification['abcxyz'].map(strategy_map)
print(classification[['abc_class', 'xyz_class', 'abcxyz', 'strategy']].head(10))`} />

      <WarningBlock>
        ABC-XYZ thresholds (70/90%, CV 0.5/1.0) are industry conventions, not laws.
        Calibrate them for your business: a retailer with 50,000 SKUs may define A as
        top 50% of revenue if that still represents a manageable review cadence.
      </WarningBlock>

      <ReferenceList references={[
        {
          authors: 'Syntetos, A.A., Boylan, J.E., Croston, J.D.',
          year: 2005,
          title: 'On the categorization of demand patterns',
          journal: 'Journal of the Operational Research Society',
          volume: '56(5)',
          pages: '495–503',
        },
        {
          authors: 'Flores, B.E., Whybark, D.C.',
          year: 1986,
          title: 'Multiple criteria ABC analysis',
          journal: 'International Journal of Operations and Production Management',
          volume: '6(3)',
          pages: '38–46',
        },
      ]} />
    </SectionLayout>
  );
}
