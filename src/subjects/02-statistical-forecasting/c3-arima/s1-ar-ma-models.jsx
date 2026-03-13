import { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Simulate AR(1) process
function simulateAR1(phi, n = 100, seed = 42) {
  let x = 0;
  const data = [];
  // Simple deterministic "noise" using trig for reproducibility
  for (let t = 0; t < n; t++) {
    const eps = Math.sin(t * 7.3 + seed) * 2 + Math.cos(t * 3.7 + seed) * 1.5;
    x = phi * x + eps;
    data.push(parseFloat(x.toFixed(3)));
  }
  return data;
}

// Compute sample ACF
function computeACF(data, maxLag = 20) {
  const n = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const variance = data.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  return Array.from({ length: maxLag }, (_, lag) => {
    const k = lag + 1;
    let cov = 0;
    for (let t = 0; t < n - k; t++) cov += (data[t] - mean) * (data[t + k] - mean);
    return { lag: k, acf: parseFloat((cov / ((n - k) * variance)).toFixed(4)) };
  });
}

function AR1Simulator() {
  const [phi, setPhi] = useState(0.7);
  const series = useMemo(() => simulateAR1(phi), [phi]);
  const acf = useMemo(() => computeACF(series), [series]);

  const seriesData = series.map((v, i) => ({ t: i, y: v }));
  const label = phi > 0.9 ? 'Near unit root (non-stationary)' : phi < -0.5 ? 'Oscillating' : phi > 0 ? 'Positive autocorrelation' : 'Negative autocorrelation';

  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">
        Interactive: AR(1) Process Simulator
      </h3>
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm text-zinc-400">
          φ₁ = <span className="font-bold text-sky-400">{phi.toFixed(2)}</span>
        </label>
        <input type="range" min={-0.99} max={0.99} step={0.01} value={phi}
          onChange={e => setPhi(parseFloat(e.target.value))}
          className="w-56 accent-sky-500" />
        <span className="text-xs text-zinc-400">{label}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-zinc-500 mb-1">Simulated AR(1) series</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={seriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="t" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Line dataKey="y" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="y_t" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">Sample ACF</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={acf} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="lag" tick={{ fontSize: 10 }} />
              <YAxis domain={[-1, 1]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#6b7280" />
              <ReferenceLine y={1.96 / Math.sqrt(100)} stroke="#f59e0b" strokeDasharray="4 2" />
              <ReferenceLine y={-1.96 / Math.sqrt(100)} stroke="#f59e0b" strokeDasharray="4 2" />
              <Bar dataKey="acf" fill="#3b82f6" name="ACF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="text-xs text-zinc-400 mt-2">
        Gold dashed lines = ±1.96/√T (approximate 95% confidence bounds). AR(1) ACF decays exponentially; the rate depends on φ₁.
      </p>
    </div>
  );
}

const pythonCode = `# AR, MA, and ARMA model simulation and identification
# pip install statsmodels

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import acf, pacf
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.arima_process import ArmaProcess

np.random.seed(42)
n = 200

# ── Simulate AR(2) ────────────────────────────────────────────────────────────
# y_t = 0.6*y_{t-1} - 0.2*y_{t-2} + ε_t
# Note: ArmaProcess uses coefficient convention AR[0]=1, AR[1]=-φ₁, AR[2]=-φ₂
ar2_process = ArmaProcess(ar=[1, -0.6, 0.2], ma=[1])
ar2_data = ar2_process.generate_sample(nsample=n, scale=1.0)

# ── Simulate MA(2) ────────────────────────────────────────────────────────────
# y_t = ε_t + 0.8*ε_{t-1} + 0.3*ε_{t-2}
ma2_process = ArmaProcess(ar=[1], ma=[1, 0.8, 0.3])
ma2_data = ma2_process.generate_sample(nsample=n, scale=1.0)

# ── ACF and PACF ─────────────────────────────────────────────────────────────
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

plot_acf(ar2_data,  lags=20, ax=axes[0, 0], title='AR(2) ACF  — exponential decay')
plot_pacf(ar2_data, lags=20, ax=axes[0, 1], title='AR(2) PACF — cuts off at lag 2')
plot_acf(ma2_data,  lags=20, ax=axes[1, 0], title='MA(2) ACF  — cuts off at lag 2')
plot_pacf(ma2_data, lags=20, ax=axes[1, 1], title='MA(2) PACF — exponential decay')
plt.tight_layout()
plt.savefig('acf_pacf_patterns.png', dpi=150)

# ── Fit AR(2) via statsmodels ARIMA ──────────────────────────────────────────
from statsmodels.tsa.arima.model import ARIMA

model_ar2 = ARIMA(ar2_data, order=(2, 0, 0))
fit_ar2 = model_ar2.fit()
print("AR(2) fit:")
print(fit_ar2.summary())

model_ma2 = ARIMA(ma2_data, order=(0, 0, 2))
fit_ma2 = model_ma2.fit()
print("\\nMA(2) fit:")
print(f"  θ₁={fit_ma2.params['ma.L1']:.4f}, θ₂={fit_ma2.params['ma.L2']:.4f}")

# ── Stationarity check: Augmented Dickey-Fuller ───────────────────────────────
from statsmodels.tsa.stattools import adfuller

for name, data in [('AR(2)', ar2_data), ('MA(2)', ma2_data)]:
    result = adfuller(data)
    print(f"\\n{name} ADF test:")
    print(f"  Statistic: {result[0]:.4f}, p-value: {result[1]:.4f}")
    print(f"  {'Stationary' if result[1] < 0.05 else 'Non-stationary'}")

# ── Invertibility check for MA ────────────────────────────────────────────────
# MA is invertible if all roots of MA polynomial lie outside unit circle
ma_roots = np.roots([1, 0.8, 0.3])
print("\\nMA(2) roots:", np.abs(ma_roots).round(4))
print("Invertible:", all(np.abs(ma_roots) > 1))
`;

const references = [
  {
    label: 'FPP3 §9.1-9.4',
    title: 'Forecasting: Principles and Practice – AR and MA models',
    authors: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/AR.html',
  },
  {
    label: 'Box & Jenkins 1976',
    title: 'Time Series Analysis: Forecasting and Control',
    authors: 'Box, G.E.P. & Jenkins, G.M.',
    year: 1976,
  },
];

export default function ARMAModels() {
  return (
    <SectionLayout
      title="AR & MA Models"
      difficulty="intermediate"
      readingTime={25}
      prerequisites={['Stationarity and differencing', 'ACF and PACF']}
    >
      <p>
        Autoregressive (AR) and Moving Average (MA) models are the building blocks of
        the ARIMA family. Understanding their structure, stationarity conditions, and
        ACF/PACF signatures is essential for correct model identification.
      </p>

      <h2>1. Autoregressive Models: AR(p)</h2>
      <DefinitionBlock
        label="Definition"
        title="Autoregressive Model AR(p)"
        definition="A p-th order autoregressive model expresses the current value as a linear combination of the p most recent values plus white noise."
        notation="y_t = c + \phi_1 y_{t-1} + \phi_2 y_{t-2} + \cdots + \phi_p y_{t-p} + \varepsilon_t"
      />
      <p>
        where <InlineMath math="c" /> is a constant, <InlineMath math="\phi_1, \ldots, \phi_p" />{' '}
        are autoregressive coefficients, and{' '}
        <InlineMath math="\varepsilon_t \sim \text{WN}(0, \sigma^2)" />.
      </p>

      <TheoremBlock
        label="Theorem"
        title="Stationarity of AR(1)"
        statement="The AR(1) process y_t = c + φ₁·y_{t-1} + ε_t is (weakly) stationary if and only if |φ₁| < 1. The mean is μ = c/(1−φ₁) and variance is σ²/(1−φ₁²)."
        proof="Assuming stationarity: E[y_t] = c + φ₁·E[y_t], so μ = c/(1−φ₁). Var[y_t] = φ₁²·Var[y_t] + σ², so γ₀ = σ²/(1−φ₁²), requiring |φ₁| < 1."
        corollaries={[
          "For AR(p), stationarity requires all roots of the characteristic polynomial 1−φ₁z−φ₂z²−…−φₚzᵖ=0 to lie outside the unit circle.",
          "At the boundary |φ₁|=1, we have a unit root (random walk), which is non-stationary.",
        ]}
      />

      <h2>2. Moving Average Models: MA(q)</h2>
      <DefinitionBlock
        label="Definition"
        title="Moving Average Model MA(q)"
        definition="A q-th order moving average model expresses the current value as a linear combination of the q most recent white noise terms."
        notation="y_t = c + \varepsilon_t + \theta_1 \varepsilon_{t-1} + \theta_2 \varepsilon_{t-2} + \cdots + \theta_q \varepsilon_{t-q}"
      />
      <p>
        MA(q) processes are always stationary (finite sum of stationary terms). However,
        they must be <strong>invertible</strong> to have a unique AR(∞) representation
        and for estimation to be well-posed.
      </p>
      <p>
        <strong>Invertibility</strong> requires all roots of
        <InlineMath math=" 1 + \theta_1 z + \cdots + \theta_q z^q = 0 " />
        to lie <em>outside</em> the unit circle.
      </p>

      <h2>3. ACF/PACF Identification Signatures</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm text-zinc-700 dark:text-zinc-300 border-collapse">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800">
              <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">Model</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">ACF Pattern</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">PACF Pattern</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['AR(p)', 'Exponential decay / damped oscillations', 'Cuts off sharply at lag p'],
              ['MA(q)', 'Cuts off sharply at lag q', 'Exponential decay / damped oscillations'],
              ['ARMA(p,q)', 'Decays exponentially after lag q', 'Decays exponentially after lag p'],
              ['White Noise', 'All lags near zero', 'All lags near zero'],
              ['Random Walk', 'Slow linear decay', 'Large spike at lag 1 only'],
            ].map(([model, acf, pacf]) => (
              <tr key={model}>
                <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-mono">{model}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">{acf}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">{pacf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoteBlock type="tip" title="ACF/PACF in Practice">
        In practice, ACF/PACF plots rarely show perfectly clean cutoffs due to sampling
        variability. The 95% confidence bounds (±1.96/√T) help distinguish significant
        from insignificant spikes. Prefer parsimony: start with small p, q values.
      </NoteBlock>

      <h2>Interactive: AR(1) ACF Patterns</h2>
      <AR1Simulator />

      <WarningBlock title="ARMA vs AR vs MA: Model Order Selection">
        Do not over-specify p or q. Adding unnecessary lags increases variance of parameter
        estimates and may cause overfitting. Use AIC/BIC (discussed in ARIMA section) rather
        than relying solely on visual ACF/PACF inspection.
      </WarningBlock>

      <h2>Python: Simulating and Fitting AR/MA Models</h2>
      <PythonCode
        code={pythonCode}
        filename="ar_ma_models.py"
        title="AR/MA simulation, ACF/PACF, and fitting with statsmodels"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
