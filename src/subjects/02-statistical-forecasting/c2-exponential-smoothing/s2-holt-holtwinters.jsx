import { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Synthetic data: trend + seasonality + noise
const RAW = (() => {
  const n = 48;
  return Array.from({ length: n }, (_, i) => {
    const trend = 20 + 0.8 * i;
    const seasonal = 6 * Math.sin((2 * Math.PI * i) / 12);
    const noise = Math.sin(i * 4.7) * 2.5;
    return parseFloat((trend + seasonal + noise).toFixed(2));
  });
})();

function computeHolt(data, alpha, beta, phi = 1.0, horizon = 12) {
  const T = data.length;
  const l = [data[0]];
  const b = [data[1] - data[0]];
  for (let t = 1; t < T; t++) {
    l.push(alpha * data[t] + (1 - alpha) * (l[t - 1] + phi * b[t - 1]));
    b.push(beta * (l[t] - l[t - 1]) + (1 - beta) * phi * b[t - 1]);
  }
  const forecasts = [];
  for (let h = 1; h <= horizon; h++) {
    let sum = 0;
    for (let j = 1; j <= h; j++) sum += Math.pow(phi, j);
    forecasts.push(parseFloat((l[T - 1] + sum * b[T - 1]).toFixed(2)));
  }
  return { l, b, forecasts };
}

function HoltChart() {
  const [alpha, setAlpha] = useState(0.3);
  const [beta, setBeta] = useState(0.1);
  const [damped, setDamped] = useState(false);
  const [phi, setPhi] = useState(0.9);
  const SPLIT = RAW.length;
  const H = 16;

  const { l, forecasts } = useMemo(
    () => computeHolt(RAW, alpha, beta, damped ? phi : 1.0, H),
    [alpha, beta, damped, phi],
  );

  const chartData = RAW.map((v, i) => ({
    t: i + 1, actual: v, level: parseFloat(l[i].toFixed(2)),
  }));
  forecasts.forEach((fc, i) => {
    chartData.push({ t: SPLIT + i + 1, forecast: fc });
  });

  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
        Interactive: Holt's Linear Method with Optional Damping
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'α (level)', value: alpha, set: setAlpha, min: 0.01, max: 0.99, step: 0.01 },
          { label: 'β (trend)', value: beta, set: setBeta, min: 0.01, max: 0.99, step: 0.01 },
        ].map(({ label, value, set, min, max, step }) => (
          <div key={label}>
            <p className="text-xs text-zinc-500 mb-1">{label} = <span className="text-sky-500 font-bold">{value.toFixed(2)}</span></p>
            <input type="range" min={min} max={max} step={step} value={value}
              onChange={e => set(parseFloat(e.target.value))} className="w-full accent-sky-500" />
          </div>
        ))}
        <div className="flex items-center gap-2">
          <button onClick={() => setDamped(v => !v)}
            className={`px-3 py-1 rounded text-xs font-medium ${damped ? 'bg-amber-500 text-white' : 'border border-zinc-400 text-zinc-500'}`}>
            Damped: {damped ? 'ON' : 'OFF'}
          </button>
        </div>
        {damped && (
          <div>
            <p className="text-xs text-zinc-500 mb-1">φ = <span className="text-amber-500 font-bold">{phi.toFixed(2)}</span></p>
            <input type="range" min={0.8} max={0.99} step={0.01} value={phi}
              onChange={e => setPhi(parseFloat(e.target.value))} className="w-full accent-amber-500" />
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="t" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine x={SPLIT + 1} stroke="#6b7280" strokeDasharray="4 4" />
          <Line dataKey="actual" name="Actual" stroke="#94a3b8" strokeWidth={2} dot={false} />
          <Line dataKey="level" name="Level" stroke="#3b82f6" strokeWidth={1.5} dot={false} connectNulls />
          <Line dataKey="forecast" name="Forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-zinc-400 mt-2">
        With damping ON, long-run forecasts converge to a constant rather than extrapolating the trend indefinitely.
      </p>
    </div>
  );
}

const pythonCode = `# Holt's Method and Holt-Winters with statsmodels
# pip install statsmodels

import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing

# Synthetic monthly data with trend + seasonality
np.random.seed(0)
n = 48
t = np.arange(n)
y = 20 + 0.8*t + 6*np.sin(2*np.pi*t/12) + np.random.normal(0, 2, n)
ts = pd.Series(y, index=pd.date_range("2020-01", periods=n, freq="MS"))

# ── 1. Holt's Linear Method (trend, no seasonality) ──────────────────────────
holt = ExponentialSmoothing(ts, trend='add', seasonal=None,
                             initialization_method='estimated')
holt_fit = holt.fit(optimized=True)
print("Holt linear:")
print(f"  alpha={holt_fit.params['smoothing_level']:.3f}, "
      f"beta={holt_fit.params['smoothing_trend']:.3f}")
print(f"  AIC={holt_fit.aic:.2f}")

# ── 2. Holt's Damped Trend ────────────────────────────────────────────────────
holt_d = ExponentialSmoothing(ts, trend='add', damped_trend=True, seasonal=None,
                               initialization_method='estimated')
holt_d_fit = holt_d.fit(optimized=True)
print("\\nHolt damped:")
print(f"  phi={holt_d_fit.params['damping_trend']:.3f}")
print(f"  AIC={holt_d_fit.aic:.2f}")

# ── 3. Holt-Winters Additive Seasonality ─────────────────────────────────────
hw_add = ExponentialSmoothing(ts, trend='add', seasonal='add',
                               seasonal_periods=12,
                               initialization_method='estimated')
hw_add_fit = hw_add.fit(optimized=True)
print("\\nHolt-Winters additive:")
print(f"  alpha={hw_add_fit.params['smoothing_level']:.3f}, "
      f"beta={hw_add_fit.params['smoothing_trend']:.3f}, "
      f"gamma={hw_add_fit.params['smoothing_seasonal']:.3f}")
print(f"  AIC={hw_add_fit.aic:.2f}")

# ── 4. Holt-Winters Multiplicative Seasonality ───────────────────────────────
hw_mul = ExponentialSmoothing(ts, trend='add', seasonal='mul',
                               seasonal_periods=12,
                               initialization_method='estimated')
hw_mul_fit = hw_mul.fit(optimized=True)
print("\\nHolt-Winters multiplicative:")
print(f"  AIC={hw_mul_fit.aic:.2f}")

# ── Forecast and prediction intervals ────────────────────────────────────────
fc = hw_add_fit.forecast(12)
sim = hw_add_fit.simulate(12, repetitions=1000, error="add")
lower = sim.quantile(0.025, axis=1)
upper = sim.quantile(0.975, axis=1)
print("\\n12-step-ahead forecasts (additive H-W):")
print(pd.DataFrame({'forecast': fc, 'lower_95': lower, 'upper_95': upper}).round(2))
`;

const references = [
  {
    label: 'FPP3 §8.2-8.4',
    title: "Forecasting: Principles and Practice – Holt's and Holt-Winters' methods",
    authors: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/holt.html',
  },
  {
    label: 'Gardner 1985',
    title: 'Exponential smoothing: The state of the art',
    authors: 'Gardner, E.S.',
    year: 1985,
    url: 'https://doi.org/10.1002/for.3980040103',
  },
];

export default function HoltHoltWinters() {
  return (
    <SectionLayout
      title="Holt's Method & Holt-Winters"
      difficulty="intermediate"
      readingTime={20}
      prerequisites={["Simple Exponential Smoothing"]}
    >
      <p>
        SES only tracks the level. When data exhibits a trend or seasonality, we need
        additional state components. Holt's method adds a trend component; Holt-Winters
        further adds a seasonal component.
      </p>

      <h2>1. Holt's Linear (Double Exponential Smoothing)</h2>
      <p>
        Holt's method maintains two equations: one for the <strong>level</strong> and one
        for the <strong>trend</strong>:
      </p>
      <BlockMath math="\ell_t = \alpha y_t + (1-\alpha)(\ell_{t-1} + b_{t-1})" />
      <BlockMath math="b_t = \beta(\ell_t - \ell_{t-1}) + (1-\beta)b_{t-1}" />
      <p>The h-step-ahead forecast is a linear extrapolation:</p>
      <BlockMath math="\hat{y}_{T+h|T} = \ell_T + h b_T" />
      <p>
        where <InlineMath math="\alpha \in (0,1]" /> controls level smoothing and{' '}
        <InlineMath math="\beta \in (0,1]" /> controls trend smoothing.
      </p>

      <h2>2. Holt's Damped Trend</h2>
      <p>
        Unbounded linear extrapolation often over-forecasts in the long run. The damped
        trend method introduces <InlineMath math="\phi \in (0,1)" /> to attenuate the
        trend at longer horizons:
      </p>
      <BlockMath math="\ell_t = \alpha y_t + (1-\alpha)(\ell_{t-1} + \phi b_{t-1})" />
      <BlockMath math="b_t = \beta(\ell_t - \ell_{t-1}) + (1-\beta)\phi b_{t-1}" />
      <BlockMath math="\hat{y}_{T+h|T} = \ell_T + \left(\sum_{j=1}^{h}\phi^j\right) b_T" />
      <p>
        As <InlineMath math="h \to \infty" />, the forecast converges to{' '}
        <InlineMath math="\ell_T + \phi b_T / (1-\phi)" />, a finite value. Gardner &amp;
        McKenzie (1985) showed that damped trend outperforms undamped in most empirical tests.
      </p>

      <NoteBlock type="tip" title="Practical Recommendation">
        In practice, set <InlineMath math="\phi \in [0.8, 0.98]" />. Values below 0.8 damp
        the trend too aggressively; values above 0.98 are nearly equivalent to undamped.
        FPP3 recommends the damped trend as the default when a trend is present.
      </NoteBlock>

      <h2>3. Holt-Winters Additive Seasonality</h2>
      <p>
        When seasonality has roughly constant amplitude, use the additive version with
        period <InlineMath math="m" />:
      </p>
      <BlockMath math="\ell_t = \alpha(y_t - s_{t-m}) + (1-\alpha)(\ell_{t-1} + b_{t-1})" />
      <BlockMath math="b_t = \beta(\ell_t - \ell_{t-1}) + (1-\beta)b_{t-1}" />
      <BlockMath math="s_t = \gamma(y_t - \ell_{t-1} - b_{t-1}) + (1-\gamma)s_{t-m}" />
      <BlockMath math="\hat{y}_{T+h|T} = \ell_T + hb_T + s_{T+h-m(k+1)}" />
      <p>
        where <InlineMath math="k = \lfloor (h-1)/m \rfloor" /> and{' '}
        <InlineMath math="\gamma \in [0, 1-\alpha]" /> is the seasonal smoothing parameter.
      </p>

      <h2>4. Holt-Winters Multiplicative Seasonality</h2>
      <p>
        When seasonal fluctuations grow proportionally with the level (common in retail,
        tourism), the multiplicative formulation is preferred:
      </p>
      <BlockMath math="\ell_t = \alpha \frac{y_t}{s_{t-m}} + (1-\alpha)(\ell_{t-1} + b_{t-1})" />
      <BlockMath math="s_t = \gamma \frac{y_t}{\ell_{t-1} + b_{t-1}} + (1-\gamma)s_{t-m}" />
      <BlockMath math="\hat{y}_{T+h|T} = (\ell_T + hb_T) \cdot s_{T+h-m(k+1)}" />

      <WarningBlock title="Multiplicative vs Additive: Critical Choice">
        If seasonal amplitude is roughly constant → additive. If it grows with the level →
        multiplicative. A log-transform can convert multiplicative to additive. Multiplicative
        seasonality cannot handle zero or negative values, and prediction intervals are harder
        to compute analytically.
      </WarningBlock>

      <HoltChart />

      <DefinitionBlock
        label="Parameter Summary"
        title="Holt-Winters Parameters"
        definition="Four smoothing parameters govern Holt-Winters with damped trend."
        notation="\alpha \in (0,1],\; \beta \in (0,1],\; \gamma \in [0, 1-\alpha],\; \phi \in (0.8, 1)"
      />

      <h2>Python: All Four Variants</h2>
      <PythonCode
        code={pythonCode}
        filename="holt_holtwinters.py"
        title="Holt's method and Holt-Winters with statsmodels"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
