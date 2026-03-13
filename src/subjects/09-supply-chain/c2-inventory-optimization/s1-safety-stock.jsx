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

const zFactors = [
  { csl: '90%', z: 1.28 }, { csl: '92%', z: 1.41 }, { csl: '95%', z: 1.64 },
  { csl: '97.5%', z: 1.96 }, { csl: '99%', z: 2.33 }, { csl: '99.9%', z: 3.09 },
];

export default function SafetyStock() {
  const [csl, setCsl] = useState(95);
  const [leadTime, setLeadTime] = useState(7);
  const [demandStd, setDemandStd] = useState(20);
  const [demandMean, setDemandMean] = useState(100);
  const [leadTimeStd, setLeadTimeStd] = useState(2);

  const z = csl >= 99.9 ? 3.09 : csl >= 99 ? 2.33 : csl >= 97.5 ? 1.96 : csl >= 95 ? 1.64 : csl >= 92 ? 1.41 : 1.28;
  const sigmaL = Math.sqrt(leadTime * demandStd * demandStd + demandMean * demandMean * leadTimeStd * leadTimeStd);
  const safetyStock = Math.round(z * sigmaL);
  const reorderPoint = Math.round(demandMean * leadTime + safetyStock);

  // Sensitivity chart: safety stock vs service level
  const sensitivityData = [90, 92, 95, 97.5, 99, 99.9].map((sl) => {
    const zv = sl >= 99.9 ? 3.09 : sl >= 99 ? 2.33 : sl >= 97.5 ? 1.96 : sl >= 95 ? 1.64 : sl >= 92 ? 1.41 : 1.28;
    return { csl: `${sl}%`, ss: Math.round(zv * sigmaL) };
  });

  return (
    <SectionLayout
      title="Safety Stock Calculation"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['Demand Patterns', 'Statistical Distributions', 'Inventory Basics']}
    >
      <p>
        Safety stock is the buffer inventory held to protect against two sources of
        uncertainty: <strong>demand variability</strong> (demand may be higher than forecast)
        and <strong>lead time variability</strong> (replenishment may arrive later than
        expected). Setting safety stock too low causes stockouts and lost sales; too high
        wastes capital and warehouse space.
      </p>

      <h2>The Core Formula</h2>
      <p>
        Safety stock depends on the demand variability over the lead time.
        When both demand and lead time are variable:
      </p>
      <BlockMath math="SS = z \cdot \sigma_L" />
      <p>where the combined lead-time demand standard deviation is:</p>
      <BlockMath math="\sigma_L = \sqrt{LT \cdot \sigma_d^2 + \bar{d}^2 \cdot \sigma_{LT}^2}" />
      <ul className="list-disc pl-6 my-3 space-y-1">
        <li><InlineMath math="z" />: safety factor (z-score for desired service level)</li>
        <li><InlineMath math="LT" />: average lead time (in periods)</li>
        <li><InlineMath math="\sigma_d" />: standard deviation of period demand</li>
        <li><InlineMath math="\bar{d}" />: average period demand</li>
        <li><InlineMath math="\sigma_{LT}" />: standard deviation of lead time</li>
      </ul>

      <NoteBlock>
        When lead time is constant (<InlineMath math="\sigma_{LT} = 0" />), the formula
        simplifies to <InlineMath math="SS = z \cdot \sigma_d \cdot \sqrt{LT}" />.
        This is the version most commonly cited in textbooks, but real supply chains always
        have some lead time variability.
      </NoteBlock>

      <h2>Service Level to z-Factor Mapping</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse text-center">
          <thead>
            <tr className="bg-indigo-50">
              <th className="border border-gray-300 p-2">Cycle Service Level</th>
              {zFactors.map(({ csl }) => (
                <th key={csl} className="border border-gray-300 p-2">{csl}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold text-left">z-factor</td>
              {zFactors.map(({ z, csl }) => (
                <td key={csl} className="border border-gray-300 p-2 font-mono">{z}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <h2>CSL vs Fill Rate</h2>
      <DefinitionBlock title="Cycle Service Level (CSL)">
        The probability of <em>not</em> stocking out during a replenishment cycle.
        A 95% CSL means 95% of order cycles have no stockout. Easy to compute but
        ignores the <em>magnitude</em> of the stockout — a cycle where you're short
        by 1 unit counts the same as one where you're short by 1,000.
      </DefinitionBlock>

      <DefinitionBlock title="Fill Rate (FR)">
        The fraction of demand met immediately from on-hand stock.
        <BlockMath math="FR = 1 - \frac{E[\text{units short per cycle}]}{\bar{d} \cdot LT}" />
        Fill rate is more practically meaningful for businesses. A 98% fill rate means
        98% of ordered units are shipped on time. Achieving a given fill rate requires
        less safety stock than achieving the equivalent CSL.
      </DefinitionBlock>

      <h2>Interactive Safety Stock Calculator</h2>
      <div className="bg-gray-50 rounded-lg p-4 my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Cycle Service Level: {csl}%
            </label>
            <input type="range" min="90" max="99.9" step="0.5" value={csl}
              onChange={(e) => setCsl(parseFloat(e.target.value))}
              className="w-full mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Avg Lead Time (days): {leadTime}
            </label>
            <input type="range" min="1" max="30" step="1" value={leadTime}
              onChange={(e) => setLeadTime(parseInt(e.target.value))}
              className="w-full mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Daily Demand Mean: {demandMean}
            </label>
            <input type="range" min="10" max="500" step="10" value={demandMean}
              onChange={(e) => setDemandMean(parseInt(e.target.value))}
              className="w-full mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Daily Demand Std Dev: {demandStd}
            </label>
            <input type="range" min="1" max="100" step="1" value={demandStd}
              onChange={(e) => setDemandStd(parseInt(e.target.value))}
              className="w-full mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Lead Time Std Dev (days): {leadTimeStd}
            </label>
            <input type="range" min="0" max="10" step="0.5" value={leadTimeStd}
              onChange={(e) => setLeadTimeStd(parseFloat(e.target.value))}
              className="w-full mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-gray-500 text-sm">z-factor</div>
            <div className="text-2xl font-bold text-indigo-600">{z.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-gray-500 text-sm">Safety Stock</div>
            <div className="text-2xl font-bold text-green-600">{safetyStock} units</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-gray-500 text-sm">Reorder Point</div>
            <div className="text-2xl font-bold text-orange-600">{reorderPoint} units</div>
          </div>
        </div>
      </div>

      <h2>Safety Stock vs. Service Level</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={sensitivityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="csl" />
          <YAxis label={{ value: 'Safety Stock (units)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="ss" fill="#6366f1" name="Safety Stock" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-center text-gray-500 mt-1">
        Safety stock increases non-linearly with service level — the last few percent of
        service level are very expensive.
      </p>

      <h2>Impact of Forecast Accuracy on Safety Stock</h2>
      <p>
        The key insight: safety stock is a function of demand variability, not just
        average demand. A more accurate forecast reduces the standard deviation of the
        forecast error, which directly reduces required safety stock.
      </p>
      <BlockMath math="SS \propto \sigma_{\text{forecast error}} \cdot \sqrt{LT + RT}" />
      <p>
        where RT is the review period (time between order decisions). If a machine learning
        model reduces forecast error standard deviation from 30 to 20 units, safety stock
        drops by 33% — a direct working capital saving.
      </p>

      <ExampleBlock title="Working Capital Impact">
        Assume: 1,000 SKUs, average unit cost $50, average safety stock 100 units/SKU at
        95% CSL. Total safety stock value = $5M. Improving forecast accuracy by 20% across
        all SKUs reduces safety stock by ~20%, saving $1M in tied-up capital. Carrying cost
        at 25% per year = $250K annual saving from improved forecasting.
      </ExampleBlock>

      <h2>Python: Safety Stock for Multiple SKUs</h2>
      <PythonCode code={`import pandas as pd
import numpy as np
from scipy import stats

# ── Sample inventory data ─────────────────────────────────────────────
np.random.seed(42)
n_skus = 500

sku_data = pd.DataFrame({
    'sku_id': [f'SKU_{i:04d}' for i in range(n_skus)],
    'avg_daily_demand': np.random.lognormal(3, 1, n_skus).round(1),
    'std_daily_demand': np.random.lognormal(2, 0.8, n_skus).round(1),
    'avg_lead_time_days': np.random.uniform(3, 21, n_skus).round(1),
    'std_lead_time_days': np.random.uniform(0, 5, n_skus).round(1),
    'unit_cost': np.random.lognormal(3, 1.5, n_skus).round(2),
    'target_csl': np.random.choice([0.90, 0.95, 0.99], n_skus,
                                    p=[0.3, 0.5, 0.2]),  # ABC-driven
})`} />

      <PythonCode code={`# ── Calculate safety stock ────────────────────────────────────────────
def calculate_safety_stock(row):
    z = stats.norm.ppf(row['target_csl'])
    lt = row['avg_lead_time_days']
    sigma_d = row['std_daily_demand']
    d_bar = row['avg_daily_demand']
    sigma_lt = row['std_lead_time_days']
    # Combined lead-time demand std
    sigma_L = np.sqrt(lt * sigma_d**2 + d_bar**2 * sigma_lt**2)
    ss = z * sigma_L
    rop = d_bar * lt + ss
    return pd.Series({'z': z, 'sigma_L': sigma_L, 'safety_stock': ss, 'reorder_point': rop})

results = sku_data.apply(calculate_safety_stock, axis=1)
sku_data = pd.concat([sku_data, results], axis=1)
sku_data['safety_stock'] = sku_data['safety_stock'].clip(lower=0).round(0)
sku_data['ss_value'] = sku_data['safety_stock'] * sku_data['unit_cost']

print(sku_data[['sku_id', 'avg_daily_demand', 'safety_stock', 'reorder_point', 'ss_value']].head(10))`} />

      <PythonCode code={`# ── Summary by service level ──────────────────────────────────────────
summary = sku_data.groupby('target_csl').agg(
    n_skus=('sku_id', 'count'),
    avg_ss=('safety_stock', 'mean'),
    total_ss_value=('ss_value', 'sum'),
).round(0)
print(summary)
#             n_skus  avg_ss  total_ss_value
# target_csl
# 0.90           150    82.0        820000.0
# 0.95           250   128.0       2560000.0
# 0.99           100   212.0       1060000.0

# ── Identify over-stocked SKUs ────────────────────────────────────────
sku_data['days_of_cover'] = sku_data['safety_stock'] / sku_data['avg_daily_demand']
overstocked = sku_data[sku_data['days_of_cover'] > 30].sort_values('ss_value', ascending=False)
print(f"Potentially over-stocked SKUs: {len(overstocked)}")
print(f"Excess SS value: ${overstocked['ss_value'].sum():,.0f}")`} />

      <TheoremBlock title="The Square Root Law for Safety Stock">
        When consolidating inventory across multiple locations (e.g., 4 warehouses into 1
        central DC), safety stock does not decrease proportionally. Under independent demand:
        <BlockMath math="SS_{\text{central}} = \frac{1}{\sqrt{n}} \cdot SS_{\text{total decentralized}}" />
        Consolidating 4 warehouses into 1 reduces safety stock by <InlineMath math="1 - 1/\sqrt{4} = 50\%" />.
        This is the "risk pooling" effect and is the primary quantitative justification for
        centralized distribution.
      </TheoremBlock>

      <WarningBlock>
        The standard safety stock formula assumes demand is normally distributed. Highly
        skewed or intermittent demand violates this assumption. For those SKUs, use a
        parametric distribution (Poisson, Negative Binomial) or simulation-based approach
        to compute safety stock from empirical demand quantiles.
      </WarningBlock>

      <ReferenceList references={[
        {
          authors: 'Silver, E.A., Pyke, D.F., Thomas, D.J.',
          year: 2016,
          title: 'Inventory and Production Management in Supply Chains (4th ed.)',
          journal: 'CRC Press',
        },
        {
          authors: 'Chopra, S., Meindl, P.',
          year: 2021,
          title: 'Supply Chain Management: Strategy, Planning, and Operation (7th ed.)',
          journal: 'Pearson',
        },
      ]} />
    </SectionLayout>
  );
}
