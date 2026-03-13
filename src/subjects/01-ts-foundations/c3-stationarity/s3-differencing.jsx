import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

function generateRW(n = 80, seed = 42) {
  const data = [];
  let y = 100;
  let dy = 0;
  let d2y = 0;
  for (let t = 0; t < n; t++) {
    const eps = Math.sin(t * 127.3 + seed) * 3 + Math.cos(t * 53.7 + seed) * 2;
    if (t > 0) {
      const prev_dy = dy;
      dy = y - data[t - 1].y;
      if (t > 1) d2y = dy - data[t - 1].dy;
    }
    data.push({ t, y: Math.round(y * 10) / 10, dy: Math.round(dy * 10) / 10, d2y: Math.round(d2y * 10) / 10 });
    y = y + 0.2 + eps;
  }
  return data;
}

function DifferencingViz() {
  const [order, setOrder] = useState(0);
  const raw = generateRW();

  const yKey = order === 0 ? 'y' : order === 1 ? 'dy' : 'd2y';
  const labels = ['Original I(1)', 'First difference ∇y_t', 'Second difference ∇²y_t'];
  const colors = ['#dc2626', '#16a34a', '#0284c7'];

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
      <h3 className="text-lg font-semibold text-sky-900 mb-1">Interactive: Differencing Orders</h3>
      <p className="text-sm text-sky-700 mb-4">Toggle differencing order to see how it transforms the series.</p>
      <div className="flex gap-3 mb-4">
        {labels.map((label, i) => (
          <button key={i} onClick={() => setOrder(i)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${order === i ? 'bg-sky-600 text-white' : 'bg-white border border-sky-200 text-sky-700 hover:bg-sky-50'}`}>
            d={i}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={raw} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis dataKey="t" label={{ value: 't', position: 'insideBottom', offset: -3 }} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip formatter={v => [v, labels[order]]} />
          <Line type="monotone" dataKey={yKey} stroke={colors[order]} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-center mt-2 text-sky-600">{labels[order]}</p>
    </div>
  );
}

const PYTHON_CODE = `import numpy as np
import pandas as pd
from statsmodels.tsa.stattools import adfuller

# ─── First differencing ───────────────────────────────────────────────────────
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
df = pd.read_csv(url, index_col=0, parse_dates=True)
df.columns = ['passengers']
df.index.freq = 'MS'

# Log-transform first to handle multiplicative seasonality
y = np.log(df['passengers'])

# First difference: remove trend
dy = y.diff().dropna()

# Seasonal difference (lag 12): remove annual seasonality
dy_seasonal = y.diff(12).dropna()

# Both: first difference of seasonally differenced series (SARIMA convention)
dy_both = y.diff(12).diff().dropna()

print("ADF test results:")
for name, series in [('Original log', y), ('First diff', dy),
                     ('Seasonal diff', dy_seasonal), ('Both diffs', dy_both)]:
    stat, p, *_ = adfuller(series, autolag='AIC')
    print(f"  {name:20s}: stat={stat:7.3f}, p={p:.4f} {'[stationary]' if p < 0.05 else '[unit root]'}")

# ─── Automatic order selection: ndiffs / nsdiffs ──────────────────────────────
try:
    from pmdarima.arima import ndiffs, nsdiffs
    d  = ndiffs(y, test='adf')          # number of non-seasonal differences
    D  = nsdiffs(y, m=12, test='ch')    # number of seasonal differences (Canova-Hansen)
    print(f"\\nAuto-selected d  (non-seasonal): {d}")
    print(f"Auto-selected D  (seasonal):     {D}")
except ImportError:
    # Manual equivalent using statsmodels
    stat1, p1, *_ = adfuller(y, autolag='AIC')
    stat2, p2, *_ = adfuller(dy, autolag='AIC')
    d = 0 if p1 < 0.05 else (1 if p2 < 0.05 else 2)
    print(f"\\nManual d selection: {d}")

# ─── Over-differencing check ──────────────────────────────────────────────────
# If d is too large, the ACF of the differenced series will show negative
# autocorrelation at lag 1 (sign of over-differencing)
import statsmodels.api as sm
acf_vals = sm.tsa.acf(dy_both, nlags=5)
print(f"\\nACF of twice-differenced series at lag 1: {acf_vals[1]:.4f}")
if acf_vals[1] < -0.5:
    print("Warning: large negative lag-1 ACF suggests over-differencing!")
else:
    print("Lag-1 ACF looks reasonable.")
`;

export default function DifferencingSection() {
  return (
    <SectionLayout
      title="Differencing & Integration"
      difficulty="intermediate"
      readingTime={25}
      prerequisites={['Stationarity Concepts', 'Unit Root Tests']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Differencing is the primary technique for converting a non-stationary series
            into a stationary one. The order of differencing required defines the "order
            of integration" of the series. ARIMA models are parameterised by the
            differencing order <InlineMath math="d" /> in their name (AR-I-MA: the I stands
            for Integrated).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">First Differencing</h2>
          <DefinitionBlock
            label="Definition 3.8"
            title="First Difference Operator"
            definition="The first difference operator ∇ (nabla) maps y_t to the change from the previous period. First differencing removes a stochastic trend (random walk component). For a random walk y_t = y_{t-1} + ε_t, the first difference ∇y_t = ε_t is white noise."
            notation="\nabla y_t = y_t - y_{t-1} = (1 - B)y_t"
          />
          <p className="text-gray-700 text-sm mt-2">
            Here <InlineMath math="B" /> is the backshift (lag) operator:{' '}
            <InlineMath math="By_t = y_{t-1}" />.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Seasonal Differencing</h2>
          <DefinitionBlock
            label="Definition 3.9"
            title="Seasonal Difference Operator"
            definition="The seasonal difference operator ∇_m removes seasonal patterns of period m by subtracting the observation from m periods ago. For monthly data with annual seasonality, m=12. For weekly data with daily seasonality, m=7."
            notation="\nabla_m y_t = y_t - y_{t-m} = (1 - B^m)y_t"
          />
          <p className="text-gray-700 text-sm mt-2">
            In SARIMA notation, the model includes both non-seasonal differencing order{' '}
            <InlineMath math="d" /> and seasonal differencing order <InlineMath math="D" />,
            resulting in the transformation:
          </p>
          <BlockMath math="\nabla^d \nabla_m^D y_t = (1-B)^d(1-B^m)^D y_t" />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Order of Integration</h2>
          <DefinitionBlock
            label="Definition 3.10"
            title="Order of Integration I(d)"
            definition="A time series y_t is said to be integrated of order d, written I(d), if it becomes stationary (I(0)) after being differenced d times. Most economic and financial time series are I(0) or I(1). I(2) processes are rare but appear in some price-level series."
            notation="y_t \sim I(d) \iff \nabla^d y_t \sim I(0)"
          />
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-100">
                  <th className="border border-sky-200 px-3 py-2">Class</th>
                  <th className="border border-sky-200 px-3 py-2">Meaning</th>
                  <th className="border border-sky-200 px-3 py-2">Transformation to I(0)</th>
                  <th className="border border-sky-200 px-3 py-2">Examples</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['I(0)', 'Already stationary', 'None needed', 'Growth rates, residuals'],
                  ['I(1)', 'Unit root; stationary after 1 diff', '∇y_t = y_t - y_{t-1}', 'Log prices, log GDP, most macro series'],
                  ['I(2)', 'Two unit roots', '∇²y_t', 'Some price level series'],
                  ['I(1,1)', 'Seasonal + non-seasonal unit root', '∇∇₁₂y_t', 'Airline data (log)'],
                ].map(row => (
                  <tr key={row[0]} className="border-b border-sky-100 hover:bg-sky-50">
                    {row.map((c, i) => (
                      <td key={i} className={`border border-sky-200 px-3 py-2 font-mono ${i === 0 ? 'font-bold text-sky-700' : 'font-normal'}`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <DifferencingViz />

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Automatic Order Selection: NDIFFS / NSDIFFS</h2>
          <p className="text-gray-700 mb-3">
            The <code>ndiffs</code> function automates non-seasonal differencing order
            selection by sequentially applying unit root tests until the series is
            stationary. <code>nsdiffs</code> uses the Canova-Hansen (CH) test to
            determine the seasonal differencing order.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
              <h4 className="font-semibold text-sky-900 mb-2">NDIFFS algorithm</h4>
              <ol className="list-decimal list-inside text-sm text-sky-800 space-y-1">
                <li>Start with <InlineMath math="d = 0" /></li>
                <li>Apply ADF (or KPSS/PP) test to <InlineMath math="\nabla^d y_t" /></li>
                <li>If non-stationary, increment <InlineMath math="d" /> and repeat</li>
                <li>Stop when test indicates stationarity or <InlineMath math="d = d_{\max}" /></li>
              </ol>
            </div>
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
              <h4 className="font-semibold text-cyan-900 mb-2">NSDIFFS (Canova-Hansen)</h4>
              <ol className="list-decimal list-inside text-sm text-cyan-800 space-y-1">
                <li>Start with <InlineMath math="D = 0" /></li>
                <li>Apply CH test to <InlineMath math="\nabla_m^D y_t" /></li>
                <li>If seasonal unit root present, increment <InlineMath math="D" /></li>
                <li>Typically <InlineMath math="D \le 1" /> in practice</li>
              </ol>
            </div>
          </div>
        </section>

        <WarningBlock title="Avoid Over-Differencing">
          <p>Over-differencing introduces a non-invertible moving average component and can
          destabilise model estimation. A symptom is a large negative autocorrelation at lag
          1 in the differenced series (<InlineMath math="\rho(1) < -0.5" />). If this occurs,
          reduce the differencing order by one.</p>
          <p className="mt-2">Rule of thumb: the variance of the differenced series should be
          smaller than the variance of the undifferenced series. If differencing increases
          the variance, you have over-differenced.</p>
        </WarningBlock>

        <ExampleBlock
          title="Selecting Differencing Order for Airline Passenger Data"
          difficulty="intermediate"
          problem="The log-transformed monthly airline passenger series shows a clear upward trend and increasing seasonal amplitude (after log transform, the seasonal amplitude is approximately constant). Determine the appropriate differencing orders d and D."
          solution={[
            {
              step: 'Log-transform to stabilise variance',
              formula: 'w_t = \\log(y_t)',
              explanation: 'The original series has multiplicative seasonality. Log-transforming converts it to additive. The seasonal amplitude in w_t is approximately constant.',
            },
            {
              step: 'Test for seasonal unit root (D)',
              explanation: 'The series shows persistent annual seasonality. The HEGY or Canova-Hansen test indicates D=1. Apply seasonal differencing: ∇₁₂w_t = w_t - w_{t-12}.',
            },
            {
              step: 'Test for non-seasonal unit root (d)',
              formula: '\\nabla_{12} w_t = w_t - w_{t-12}',
              explanation: 'After seasonal differencing, apply ADF to ∇₁₂w_t. The test statistic is still large (fail to reject unit root), so apply d=1 as well.',
            },
            {
              step: 'Final transformation',
              formula: '\\nabla \\nabla_{12} w_t = (1-B)(1-B^{12})\\log(y_t)',
              explanation: 'This doubly-differenced series passes both ADF (reject unit root) and KPSS (fail to reject stationarity). Use d=1, D=1 in SARIMA.',
            },
          ]}
        />

        <PythonCode
          title="Differencing and Automatic Order Selection in Python"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              authors: 'Hyndman, R.J. & Khandakar, Y.',
              year: 2008,
              title: 'Automatic time series forecasting: the forecast package for R',
              venue: 'Journal of Statistical Software, 27(3)',
              type: 'paper',
              whyImportant: 'Describes the auto.arima algorithm including the NDIFFS/NSDIFFS procedures for automatic differencing order selection.',
            },
            {
              authors: 'Canova, F. & Hansen, B.E.',
              year: 1995,
              title: 'Are seasonal patterns constant over time? A test for seasonal stability',
              venue: 'Journal of Business & Economic Statistics, 13(3), 237–252',
              type: 'paper',
              whyImportant: 'Introduces the Canova-Hansen test for seasonal unit roots used in the NSDIFFS algorithm.',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
