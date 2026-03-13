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

const demandSeries = [
  { t: 1, demand: 0 }, { t: 2, demand: 0 }, { t: 3, demand: 4 },
  { t: 4, demand: 0 }, { t: 5, demand: 0 }, { t: 6, demand: 0 },
  { t: 7, demand: 7 }, { t: 8, demand: 0 }, { t: 9, demand: 0 },
  { t: 10, demand: 3 }, { t: 11, demand: 0 }, { t: 12, demand: 0 },
  { t: 13, demand: 0 }, { t: 14, demand: 0 }, { t: 15, demand: 6 },
  { t: 16, demand: 0 }, { t: 17, demand: 0 }, { t: 18, demand: 5 },
  { t: 19, demand: 0 }, { t: 20, demand: 0 },
];

const forecastCompareData = [
  { t: 1, croston: 3.2, sba: 2.7, tsb: 2.4, naive: 0 },
  { t: 2, croston: 3.2, sba: 2.7, tsb: 1.8, naive: 0 },
  { t: 3, croston: 3.5, sba: 2.9, tsb: 3.1, naive: 4 },
  { t: 4, croston: 3.5, sba: 2.9, tsb: 2.5, naive: 0 },
  { t: 5, croston: 3.5, sba: 2.9, tsb: 1.9, naive: 0 },
  { t: 6, croston: 3.5, sba: 2.9, tsb: 1.5, naive: 0 },
  { t: 7, croston: 4.0, sba: 3.4, tsb: 4.2, naive: 7 },
  { t: 8, croston: 4.0, sba: 3.4, tsb: 3.2, naive: 0 },
  { t: 9, croston: 4.0, sba: 3.4, tsb: 2.5, naive: 0 },
  { t: 10, croston: 3.8, sba: 3.2, tsb: 3.5, naive: 3 },
];

export default function IntermittentDemand() {
  const [alphaSize, setAlphaSize] = useState(0.2);
  const [alphaInterval, setAlphaInterval] = useState(0.2);

  // Demonstrate Croston's update step
  const nonZero = demandSeries.filter((d) => d.demand > 0);
  const avgSize = nonZero.reduce((s, d) => s + d.demand, 0) / nonZero.length;
  const intervals = [];
  let last = 0;
  demandSeries.forEach((d, i) => {
    if (d.demand > 0) { intervals.push(i - last); last = i; }
  });
  const avgInterval = intervals.reduce((s, v) => s + v, 0) / intervals.length;
  const crostonForecast = avgSize / avgInterval;
  const sbaForecast = (1 - alphaSize / 2) * crostonForecast;

  return (
    <SectionLayout
      title="Intermittent Demand Methods"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['Exponential Smoothing', 'Demand Patterns & ABC-XYZ']}
    >
      <p>
        Intermittent demand — characterized by many periods of zero demand interspersed with
        occasional positive values — defies standard exponential smoothing and ARIMA methods.
        These methods were designed for continuous, regular demand and produce persistent
        positive forecasts even when demand may not occur for months. Specialized intermittent
        demand methods are required.
      </p>

      <h2>What Is Intermittent Demand?</h2>

      <div className="my-4">
        <p className="text-sm text-gray-600 mb-2">Example intermittent demand series (spare parts)</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={demandSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" label={{ value: 'Period', position: 'insideBottom', offset: -3 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="demand" fill="#6366f1" name="Demand" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DefinitionBlock title="Syntetos-Boylan Classification Scheme">
        A demand pattern is classified as <strong>intermittent</strong> when the
        Average Demand Interval (ADI) exceeds 1.32 (demand occurs less than once every 1.32
        periods on average). The CV² threshold further distinguishes erratic from smooth
        non-zero demand:
        <ul className="list-disc pl-4 mt-2">
          <li>ADI &lt; 1.32, CV² &lt; 0.49: <strong>Smooth</strong></li>
          <li>ADI &lt; 1.32, CV² &ge; 0.49: <strong>Erratic</strong></li>
          <li>ADI &ge; 1.32, CV² &lt; 0.49: <strong>Intermittent</strong></li>
          <li>ADI &ge; 1.32, CV² &ge; 0.49: <strong>Lumpy</strong></li>
        </ul>
      </DefinitionBlock>

      <h2>Croston's Method (1972)</h2>
      <p>
        Croston's key insight: decompose the demand series into two components and forecast
        each separately using simple exponential smoothing.
      </p>
      <ul className="list-disc pl-6 my-3 space-y-1">
        <li><strong>Demand size</strong> <InlineMath math="\hat{z}_t" />: average non-zero demand magnitude</li>
        <li><strong>Demand interval</strong> <InlineMath math="\hat{q}_t" />: average number of periods between non-zero demands</li>
      </ul>

      <p>Update equations (only applied at periods <InlineMath math="t" /> when demand is non-zero):</p>
      <BlockMath math="\hat{z}_t = \alpha \cdot d_t + (1-\alpha) \cdot \hat{z}_{t-1}" />
      <BlockMath math="\hat{q}_t = \alpha \cdot \ell_t + (1-\alpha) \cdot \hat{q}_{t-1}" />

      <p>
        where <InlineMath math="\ell_t" /> is the observed inter-demand interval at time t.
        The one-period-ahead forecast is:
      </p>
      <BlockMath math="\hat{f}_{t+1} = \frac{\hat{z}_t}{\hat{q}_t}" />

      <h2>SBA: Syntetos-Boylan Approximation</h2>
      <p>
        Croston's method is biased — it over-forecasts on average. Syntetos and Boylan (2005)
        derived a bias correction factor:
      </p>
      <BlockMath math="\hat{f}^{\text{SBA}}_{t+1} = \left(1 - \frac{\alpha}{2}\right) \cdot \frac{\hat{z}_t}{\hat{q}_t}" />

      <p>
        The correction factor <InlineMath math="(1 - \alpha/2)" /> is always less than 1,
        so SBA forecasts are always slightly lower than Croston. For typical smoothing
        parameters (α = 0.1–0.3), the bias reduction is 5–15%.
      </p>

      <div className="bg-indigo-50 rounded-lg p-4 my-4">
        <h3 className="font-semibold mb-3">Interactive: Croston vs SBA Calculation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Alpha (size smoothing): {alphaSize.toFixed(2)}
            </label>
            <input type="range" min="0.05" max="0.5" step="0.05" value={alphaSize}
              onChange={(e) => setAlphaSize(parseFloat(e.target.value))}
              className="w-full mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Alpha (interval smoothing): {alphaInterval.toFixed(2)}
            </label>
            <input type="range" min="0.05" max="0.5" step="0.05" value={alphaInterval}
              onChange={(e) => setAlphaInterval(parseFloat(e.target.value))}
              className="w-full mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-white rounded p-3 text-center">
            <div className="text-gray-500">Avg. Demand Size</div>
            <div className="text-xl font-bold text-indigo-600">{avgSize.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded p-3 text-center">
            <div className="text-gray-500">Avg. Interval</div>
            <div className="text-xl font-bold text-indigo-600">{avgInterval.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded p-3 text-center">
            <div className="text-gray-500">Croston / SBA</div>
            <div className="text-xl font-bold text-indigo-600">
              {crostonForecast.toFixed(2)} / {sbaForecast.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <h2>TSB: Teunter-Syntetos-Babai Method</h2>
      <p>
        TSB (2011) uses a fundamentally different approach: instead of tracking the demand
        interval, it directly models the <strong>probability of demand occurrence</strong>
        in each period.
      </p>
      <BlockMath math="\hat{p}_t = \alpha_p \cdot \mathbf{1}[d_t > 0] + (1 - \alpha_p) \cdot \hat{p}_{t-1}" />
      <BlockMath math="\hat{z}_t = \alpha_z \cdot d_t \cdot \mathbf{1}[d_t > 0] + (1 - \alpha_z) \cdot \hat{z}_{t-1}" />
      <BlockMath math="\hat{f}_{t+1} = \hat{p}_t \cdot \hat{z}_t" />

      <p>
        TSB's key advantage: the demand probability decays over time if no demand occurs,
        which means forecasts naturally decrease during extended zero periods. Croston/SBA
        maintain a constant forecast regardless of how long the gap is.
      </p>

      <h2>IMAPA: Intermittent Multiple Aggregation Prediction Algorithm</h2>
      <p>
        IMAPA applies the Multiple Aggregation Prediction Algorithm (MAPA) to intermittent
        demand. It aggregates the series at multiple temporal levels (original, 2-period,
        3-period, etc.), applies Croston's method at each level, and then combines the
        forecasts via a simple average. This multi-scale approach reduces variance without
        increasing bias.
      </p>

      <h2>Method Comparison</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-50">
              <th className="border border-gray-300 p-2">Method</th>
              <th className="border border-gray-300 p-2">Bias</th>
              <th className="border border-gray-300 p-2">Adapts to regime change?</th>
              <th className="border border-gray-300 p-2">Best for</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Croston (1972)', 'Positive bias', 'Slow', 'Stable intermittent demand'],
              ['SBA (2005)', 'Near-unbiased', 'Slow', 'General intermittent; recommended default'],
              ['TSB (2011)', 'Near-unbiased', 'Fast — demand prob decays', 'Products that may be discontinued'],
              ['IMAPA', 'Near-unbiased', 'Moderate', 'Noisy intermittent, lumpy demand'],
            ].map(([m, b, a, u]) => (
              <tr key={m} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">{m}</td>
                <td className="border border-gray-300 p-2">{b}</td>
                <td className="border border-gray-300 p-2">{a}</td>
                <td className="border border-gray-300 p-2 text-gray-600">{u}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Forecast Comparison Chart</h2>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={forecastCompareData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="stepAfter" dataKey="croston" stroke="#6366f1" strokeWidth={2} dot={false} name="Croston" />
          <Line type="stepAfter" dataKey="sba" stroke="#22c55e" strokeWidth={2} dot={false} name="SBA" />
          <Line type="stepAfter" dataKey="tsb" stroke="#f59e0b" strokeWidth={2} dot={false} name="TSB" />
          <Line type="stepAfter" dataKey="naive" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 2" dot={false} name="Naive" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-center text-gray-500 mt-1">
        TSB adapts faster after observed demand; Croston/SBA are more stable between events.
      </p>

      <h2>Python: statsforecast Implementation</h2>
      <PythonCode code={`import pandas as pd
import numpy as np
from statsforecast import StatsForecast
from statsforecast.models import (
    CrostonOptimized,   # Croston's method with optimal alpha
    CrostonSBA,         # Syntetos-Boylan approximation
    IMAPA,              # Intermittent MAPA
    TSB,                # Teunter-Syntetos-Babai
    Naive,              # Benchmark
)

# ── Create intermittent demand data ────────────────────────────────────
np.random.seed(42)
n_periods = 104
n_skus = 200

records = []
for i in range(n_skus):
    uid = f'SPARE_{i:04d}'
    demand_prob = np.random.beta(1, 4)  # most SKUs have low demand probability
    avg_size = np.random.lognormal(1.5, 0.8)
    dates = pd.date_range('2022-01-01', periods=n_periods, freq='W')
    for date in dates:
        d = 0 if np.random.random() > demand_prob else max(0, int(np.random.poisson(avg_size)))
        records.append({'unique_id': uid, 'ds': date, 'y': float(d)})

df = pd.DataFrame(records)
zero_pct = (df['y'] == 0).mean()
print(f"Zero demand fraction: {zero_pct:.1%}")  # typically 60-90%`} />

      <PythonCode code={`# ── Fit intermittent demand models ────────────────────────────────────
sf = StatsForecast(
    models=[
        CrostonOptimized(),
        CrostonSBA(),
        IMAPA(),
        TSB(alpha_d=0.2, alpha_p=0.2),  # alpha_d=demand size, alpha_p=demand prob
        Naive(),
    ],
    freq='W',
    n_jobs=-1,
)

horizon = 8
forecasts = sf.forecast(df=df, h=horizon)
print(forecasts.head())

# ── Cross-validate ─────────────────────────────────────────────────────
cv_df = sf.cross_validation(df=df, h=horizon, n_windows=4, step_size=4)

# ── Evaluation: use stockout-sensitive metrics ─────────────────────────
# For intermittent demand, standard RMSE is misleading.
# Prefer: MAE (less sensitive to zeros), Fill Rate, or CSL.
cv_df['ae_croston'] = (cv_df['y'] - cv_df['CrostonSBA']).abs()
cv_df['ae_tsb']     = (cv_df['y'] - cv_df['TSB']).abs()

print("MAE comparison:")
print(cv_df[['ae_croston', 'ae_tsb']].mean().round(3))`} />

      <PythonCode code={`# ── Classify demand pattern before choosing method ────────────────────
def classify_demand(series):
    """Classify demand pattern using Syntetos-Boylan scheme."""
    n = len(series)
    n_nonzero = (series > 0).sum()
    if n_nonzero == 0:
        return 'no_demand'
    adi = n / n_nonzero
    cv2 = (series[series > 0].std() / series[series > 0].mean()) ** 2 if n_nonzero > 1 else 0
    if adi < 1.32 and cv2 < 0.49: return 'smooth'
    if adi < 1.32 and cv2 >= 0.49: return 'erratic'
    if adi >= 1.32 and cv2 < 0.49: return 'intermittent'
    return 'lumpy'

pattern_by_sku = (
    df.groupby('unique_id')['y']
    .apply(classify_demand)
    .value_counts()
)
print(pattern_by_sku)
#  smooth          52
#  erratic         38
#  intermittent    67
#  lumpy           43`} />

      <TheoremBlock title="Why Standard Metrics Fail for Intermittent Demand">
        RMSE heavily penalizes large errors. With intermittent demand, a forecast of 0
        is wrong when demand occurs, but a forecast of 5 is wasteful when demand is zero.
        The <strong>Scaled Mean Absolute Error (sMAPE)</strong> is undefined when both
        actual and forecast are zero. Instead use:
        <ul className="list-disc pl-4 mt-2">
          <li><strong>MAE</strong>: treats all periods equally, handles zeros</li>
          <li><strong>CSL (Cycle Service Level)</strong>: fraction of order cycles without stockout</li>
          <li><strong>Fill Rate</strong>: fraction of demand met from stock</li>
        </ul>
      </TheoremBlock>

      <WarningBlock>
        CrostonOptimized fits alpha by minimizing in-sample MSE. This can overfit on short
        series. For series with fewer than 30 non-zero observations, fix alpha = 0.1–0.2
        rather than optimizing it.
      </WarningBlock>

      <ReferenceList references={[
        {
          authors: 'Croston, J.D.',
          year: 1972,
          title: 'Forecasting and stock control for intermittent demands',
          journal: 'Operational Research Quarterly',
          volume: '23(3)',
          pages: '289–303',
        },
        {
          authors: 'Syntetos, A.A., Boylan, J.E.',
          year: 2005,
          title: 'The accuracy of intermittent demand estimates',
          journal: 'International Journal of Forecasting',
          volume: '21(2)',
          pages: '303–314',
        },
        {
          authors: 'Teunter, R.H., Syntetos, A.A., Babai, M.Z.',
          year: 2011,
          title: 'Intermittent demand: Linking forecasting to inventory obsolescence',
          journal: 'European Journal of Operational Research',
          volume: '214(3)',
          pages: '606–615',
        },
      ]} />
    </SectionLayout>
  );
}
