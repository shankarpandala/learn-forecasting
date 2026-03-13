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

const waterfallData = [
  { name: 'Jan MRR', value: 500000, base: 0, color: '#6366f1' },
  { name: '+ New', value: 45000, base: 500000, color: '#22c55e' },
  { name: '+ Expansion', value: 22000, base: 545000, color: '#10b981' },
  { name: '- Contraction', value: -8000, base: 559000, color: '#f59e0b' },
  { name: '- Churn', value: -18000, base: 551000, color: '#ef4444' },
  { name: 'Feb MRR', value: 541000, base: 0, color: '#6366f1' },
];

const scenarioData = [
  { month: 'Jan', base: 500, bull: 500, bear: 500 },
  { month: 'Feb', base: 541, bull: 555, bear: 520 },
  { month: 'Mar', base: 584, bull: 612, bear: 542 },
  { month: 'Apr', base: 630, bull: 672, bear: 566 },
  { month: 'May', base: 680, bull: 740, bear: 589 },
  { month: 'Jun', base: 734, bull: 814, bear: 614 },
];

const revenueDriverData = [
  { month: 'Q1', price: 49, volume: 1020, revenue: 49980 },
  { month: 'Q2', price: 52, volume: 1085, revenue: 56420 },
  { month: 'Q3', price: 52, volume: 1150, revenue: 59800 },
  { month: 'Q4', price: 55, volume: 1240, revenue: 68200 },
];

export default function RevenueMethods() {
  const [activeMethod, setActiveMethod] = useState('bottom-up');

  return (
    <SectionLayout
      title="Revenue Forecasting Methods"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['Time Series Basics', 'Business Metrics', 'Python/pandas']}
    >
      <p>
        Revenue forecasting sits at the intersection of finance, statistics, and business
        strategy. Unlike demand forecasting for physical goods, revenue forecasts must account
        for pricing dynamics, customer cohort behavior, macroeconomic indicators, and strategic
        decisions. The choice of method depends on your business model.
      </p>

      <h2>Forecasting Approaches</h2>
      <div className="flex gap-2 flex-wrap my-4">
        {[
          ['bottom-up', 'Bottom-Up'],
          ['top-down', 'Top-Down'],
          ['middle-out', 'Middle-Out'],
          ['driver', 'Driver-Based'],
        ].map(([key, label]) => (
          <button key={key} onClick={() => setActiveMethod(key)}
            className={`px-3 py-1 rounded text-sm font-medium ${activeMethod === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeMethod === 'bottom-up' && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Bottom-Up Forecasting</h3>
          <p className="text-sm text-blue-700 mb-2">
            Forecast at the most granular level (product × geography × channel) and sum up.
            Captures heterogeneity across segments. Best when you have strong granular data.
          </p>
          <p className="text-sm font-mono text-blue-600">
            Revenue = Σᵢ (units_i × price_i) for all i ∈ {'{products × channels}'}
          </p>
          <p className="text-sm text-blue-700 mt-2">
            Pros: Accurate at segment level, explainable. Cons: Error accumulation across many SKUs,
            expensive computationally.
          </p>
        </div>
      )}
      {activeMethod === 'top-down' && (
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">Top-Down Forecasting</h3>
          <p className="text-sm text-green-700 mb-2">
            Forecast total revenue first, then allocate down to segments using historical
            proportions or market share assumptions.
          </p>
          <p className="text-sm font-mono text-green-600">
            Segment_i = Total_Revenue × share_i (historical or modeled)
          </p>
          <p className="text-sm text-green-700 mt-2">
            Pros: Simple, stable. Cons: Ignores segment-level dynamics, misses shifts in mix.
          </p>
        </div>
      )}
      {activeMethod === 'middle-out' && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Middle-Out Forecasting</h3>
          <p className="text-sm text-yellow-700 mb-2">
            Forecast at an intermediate level (e.g., product category or region), then
            extrapolate both up (to total) and down (to individual SKUs/stores).
          </p>
          <p className="text-sm text-yellow-700 mt-2">
            Pros: Balances accuracy and effort. Commonly used in retail where category-level
            data is more reliable than SKU-level.
          </p>
        </div>
      )}
      {activeMethod === 'driver' && (
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-2">Driver-Based Forecasting</h3>
          <p className="text-sm text-purple-700 mb-2">
            Decompose revenue into its business drivers and forecast each driver separately:
          </p>
          <BlockMath math="\text{Revenue} = \text{Price} \times \text{Volume}" />
          <BlockMath math="\text{Volume} = \text{Customers} \times \text{Units/Customer}" />
          <p className="text-sm text-purple-700 mt-2">
            Pros: Connects forecasting to business decisions (pricing, marketing).
            Cons: Requires forecasting each driver accurately.
          </p>
        </div>
      )}

      <h2>Revenue Driver Decomposition</h2>
      <p>The fundamental decomposition for product revenue:</p>
      <BlockMath math="R_t = P_t \times Q_t" />
      <p>Year-over-year growth can be decomposed:</p>
      <BlockMath math="\frac{\Delta R}{R} = \frac{\Delta P}{P} + \frac{\Delta Q}{Q} + \frac{\Delta P \cdot \Delta Q}{P \cdot Q}" />
      <p>
        The cross-term (<InlineMath math="\Delta P \cdot \Delta Q / P \cdot Q" />) is
        negligible for small changes but matters for large pricing/volume moves.
      </p>

      <div className="my-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Price × Volume = Revenue (quarterly)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={revenueDriverData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Price ($)" />
            <Line yAxisId="left" type="monotone" dataKey="volume" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Volume (units)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2>SaaS Cohort Analysis: MRR Forecasting</h2>
      <p>For subscription businesses, the MRR waterfall model is the standard:</p>
      <BlockMath math="\text{MRR}_{t+1} = \text{MRR}_t + \text{New MRR} + \text{Expansion MRR} - \text{Contraction MRR} - \text{Churn MRR}" />

      <div className="my-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">MRR Waterfall: January to February</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={waterfallData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Bar dataKey="value" name="MRR Component">
              {waterfallData.map((entry, index) => (
                <rect key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>Scenario Planning</h2>
      <p>
        Scenario planning quantifies the range of outcomes under different business assumptions.
        A standard three-scenario framework:
      </p>
      <ul className="list-disc pl-6 my-3 space-y-1">
        <li><strong>Base</strong>: Most likely outcome; uses median assumptions for growth, churn, pricing.</li>
        <li><strong>Bull</strong>: Optimistic scenario; assumes higher growth, lower churn, successful upsells.</li>
        <li><strong>Bear</strong>: Pessimistic scenario; slower growth, elevated churn, pricing pressure.</li>
      </ul>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={scenarioData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `$${v}k`} />
          <Tooltip formatter={(v) => `$${v}k`} />
          <Legend />
          <Line type="monotone" dataKey="bull" stroke="#22c55e" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Bull (+22% growth)" />
          <Line type="monotone" dataKey="base" stroke="#6366f1" strokeWidth={2} dot={false} name="Base (+15% growth)" />
          <Line type="monotone" dataKey="bear" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Bear (+8% growth)" />
        </LineChart>
      </ResponsiveContainer>

      <h2>Python: Revenue Decomposition Model</h2>
      <PythonCode code={`import pandas as pd
import numpy as np
import statsmodels.api as sm

# ── 1. Build historical MRR dataset ───────────────────────────────────
np.random.seed(42)
months = pd.date_range('2020-01', periods=48, freq='MS')

# Simulate SaaS MRR dynamics
mrr = [100_000]
new_mrr_rate = 0.12      # 12% of MRR from new customers
expansion_rate = 0.03    # 3% of MRR from expansion
churn_rate = 0.025       # 2.5% monthly churn
records = [{'month': months[0], 'mrr': mrr[0], 'new': 0, 'expansion': 0,
            'contraction': 0, 'churn': 0}]

for i in range(1, len(months)):
    prev = mrr[-1]
    new = prev * new_mrr_rate * (1 + np.random.normal(0, 0.15))
    exp = prev * expansion_rate * (1 + np.random.normal(0, 0.2))
    con = prev * 0.005 * (1 + np.random.normal(0, 0.3))
    churn = prev * churn_rate * (1 + np.random.normal(0, 0.2))
    current = prev + new + exp - con - churn
    mrr.append(current)
    records.append({'month': months[i], 'mrr': current, 'new': new,
                    'expansion': exp, 'contraction': con, 'churn': churn})

df = pd.DataFrame(records).set_index('month')
print(df.tail())

# Net revenue retention (NRR): how much of last month's MRR do we retain + expand?
df['nrr'] = (df['mrr'] - df['new']) / df['mrr'].shift(1)
print(f"\\nMedian NRR: {df['nrr'].median():.1%}")  # healthy SaaS: >100%`} />

      <PythonCode code={`# ── 2. ETS forecast for each MRR component ────────────────────────────
from statsforecast import StatsForecast
from statsforecast.models import AutoETS, AutoARIMA

# Reshape to long format for statsforecast
components = ['new', 'expansion', 'churn']
long_dfs = []
for comp in components:
    tmp = df[[comp]].reset_index()
    tmp.columns = ['ds', 'y']
    tmp['unique_id'] = comp
    long_dfs.append(tmp)
sf_df = pd.concat(long_dfs)

sf = StatsForecast(
    models=[AutoETS(season_length=12), AutoARIMA(season_length=12)],
    freq='MS', n_jobs=-1,
)
forecasts = sf.forecast(df=sf_df, h=12)

# Reassemble MRR forecast from components
comp_forecasts = forecasts.pivot(index='ds', columns='unique_id', values='AutoETS')
last_mrr = df['mrr'].iloc[-1]
comp_forecasts['mrr_forecast'] = (
    last_mrr
    + comp_forecasts['new'].cumsum()
    + comp_forecasts['expansion'].cumsum()
    - comp_forecasts['churn'].cumsum()
)
print(comp_forecasts[['new', 'expansion', 'churn', 'mrr_forecast']].head())`} />

      <PythonCode code={`# ── 3. Regression with economic indicators ────────────────────────────
# Revenue often correlates with macro conditions
import statsmodels.api as sm

# Simulate macro indicators
df['gdp_growth'] = np.random.normal(0.025, 0.01, len(df))
df['unemployment'] = np.clip(np.cumsum(np.random.normal(0, 0.001, len(df))) + 0.04, 0.02, 0.12)
df['log_mrr'] = np.log(df['mrr'])

# Lagged regression (macro affects revenue with 1-2 month lag)
df['gdp_lag1'] = df['gdp_growth'].shift(1)
df['unemp_lag2'] = df['unemployment'].shift(2)

model_df = df[['log_mrr', 'gdp_lag1', 'unemp_lag2']].dropna()
X = sm.add_constant(model_df[['gdp_lag1', 'unemp_lag2']])
y = model_df['log_mrr']

result = sm.OLS(y, X).fit()
print(result.summary())

# Scenario forecasting using economic assumptions
scenarios = {
    'Base':  {'gdp_lag1': 0.025, 'unemp_lag2': 0.04},
    'Bull':  {'gdp_lag1': 0.040, 'unemp_lag2': 0.035},
    'Bear':  {'gdp_lag1': 0.010, 'unemp_lag2': 0.055},
}
for name, inputs in scenarios.items():
    x_scenario = [1.0, inputs['gdp_lag1'], inputs['unemp_lag2']]
    pred = np.exp(result.predict(x_scenario)[0])
    print(f"{name} scenario MRR: ${pred:,.0f}")`} />

      <TheoremBlock title="Net Revenue Retention (NRR) as the Core Metric">
        For SaaS businesses, NRR is the single most important predictor of long-run revenue.
        NRR &gt; 100% means existing customers collectively expand more than they churn —
        the business grows even with zero new customer acquisition.
        <BlockMath math="\text{NRR}_t = \frac{\text{MRR}_t - \text{New MRR}_t}{\text{MRR}_{t-1}}" />
        Best-in-class SaaS companies (Snowflake, Datadog) have NRR &gt; 130%. Rule-of-thumb:
        NRR &gt; 110% usually indicates product-market fit.
      </TheoremBlock>

      <NoteBlock>
        For quarterly or annual revenue forecasting, always decompose into at least 2–3
        components (new business, renewals/expansion, price changes) and forecast each
        separately. Mixing these in a single time series loses explanatory power and makes
        scenario analysis impossible.
      </NoteBlock>

      <WarningBlock>
        Regression models with macro indicators can appear accurate in-sample but fail
        out-of-sample. Always validate with rolling walk-forward cross-validation, not
        just in-sample R². Also test for look-ahead bias: macro indicators may be revised
        after initial release.
      </WarningBlock>

      <ReferenceList references={[
        {
          authors: 'Lim, M.',
          year: 2021,
          title: 'Financial Forecasting for New and Emerging Businesses',
          journal: 'Kogan Page',
        },
        {
          authors: 'Mauboussin, M.J., Callahan, D.',
          year: 2018,
          title: 'What Does a Price-Earnings Multiple Mean?',
          journal: 'Credit Suisse Global Financial Strategies',
        },
      ]} />
    </SectionLayout>
  );
}
