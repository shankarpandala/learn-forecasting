import { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

const RAW = [
  17.55, 21.86, 23.89, 26.93, 26.89, 28.83, 30.08, 30.95,
  30.19, 31.58, 32.58, 33.48, 39.02, 41.39, 41.60, 48.55,
  46.90, 47.00, 50.90, 55.90,
];
const HORIZON = 8;

function computeSES(data, alpha, l0 = null) {
  const T = data.length;
  const level = [l0 !== null ? l0 : data[0]];
  for (let t = 1; t < T; t++) {
    level.push(alpha * data[t - 1] + (1 - alpha) * level[t - 1]);
  }
  // fitted values (one-step-ahead)
  const fitted = level.slice(1).concat([level[T - 1]]);
  // forecast (flat from lT)
  const forecastLevel = alpha * data[T - 1] + (1 - alpha) * level[T - 1];
  return { level, fitted, forecastLevel };
}

function SESChart() {
  const [alpha, setAlpha] = useState(0.3);
  const SPLIT = RAW.length;

  const { level, forecastLevel } = useMemo(
    () => computeSES(RAW, alpha),
    [alpha],
  );

  const chartData = RAW.map((v, i) => ({
    t: i + 1,
    actual: v,
    level: parseFloat(level[i].toFixed(2)),
  }));
  for (let h = 1; h <= HORIZON; h++) {
    chartData.push({ t: SPLIT + h, forecast: parseFloat(forecastLevel.toFixed(2)) });
  }

  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
        Interactive: SES Level Tracking
      </h3>
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          α = <span className="font-bold text-sky-500">{alpha.toFixed(2)}</span>
        </label>
        <input
          type="range" min={0.01} max={0.99} step={0.01} value={alpha}
          onChange={e => setAlpha(parseFloat(e.target.value))}
          className="w-56 accent-sky-500"
        />
        <span className="text-xs text-zinc-400">
          {alpha < 0.2 ? 'Long memory (slow adaptation)' : alpha > 0.7 ? 'Near naïve (fast adaptation)' : 'Balanced'}
        </span>
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
          <Line dataKey="level" name="Level ℓ_t" stroke="#3b82f6" strokeWidth={2} dot={false} connectNulls />
          <Line dataKey="forecast" name="Forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-zinc-400 mt-2">
        With α close to 0, the level changes slowly. With α close to 1, the level tracks recent data tightly (approaching naïve).
      </p>
    </div>
  );
}

const pythonCode = `# Simple Exponential Smoothing (SES)
# pip install statsmodels statsforecast

import numpy as np
import pandas as pd

# ── Option 1: statsmodels (full diagnostics) ──────────────────────────────────
from statsmodels.tsa.holtwinters import SimpleExpSmoothing

data = [17.55, 21.86, 23.89, 26.93, 26.89, 28.83, 30.08, 30.95,
        30.19, 31.58, 32.58, 33.48, 39.02, 41.39, 41.60, 48.55,
        46.90, 47.00, 50.90, 55.90]
y = pd.Series(data)

# Fit with automatic alpha via MLE (minimizes log-likelihood)
model = SimpleExpSmoothing(y, initialization_method='estimated')
fit = model.fit(optimized=True)

print(f"Optimal alpha: {fit.params['smoothing_level']:.4f}")
print(f"Initial level: {fit.params['initial_level']:.4f}")
print(f"AIC:           {fit.aic:.2f}")

# Forecast 8 steps ahead (flat forecast = last level)
fc = fit.forecast(8)
print("\\nForecasts:", fc.round(2).tolist())

# Prediction intervals
summary = fit.summary()
print(summary.tables[1])

# ── Option 2: statsforecast (faster, production use) ─────────────────────────
from statsforecast import StatsForecast
from statsforecast.models import SES

df = pd.DataFrame({
    'unique_id': 'oil',
    'ds': pd.date_range('2000', periods=len(data), freq='YS'),
    'y': data,
})

sf = StatsForecast(models=[SES(season_length=1, alpha=None)], freq='YS')
sf.fit(df)
forecasts = sf.predict(h=8, level=[80, 95])
print(forecasts)

# ── Manual SES to understand the recursion ───────────────────────────────────
def ses_manual(y, alpha, l0=None):
    T = len(y)
    l = np.empty(T + 1)
    l[0] = y[0] if l0 is None else l0
    for t in range(1, T + 1):
        l[t] = alpha * y[t - 1] + (1 - alpha) * l[t - 1]
    fitted  = l[1:]          # one-step-ahead fitted values
    forecast = l[T]           # flat h-step forecast
    sse = np.sum((y - fitted) ** 2)
    return fitted, forecast, sse

fitted, fc_val, sse = ses_manual(np.array(data), alpha=0.83)
print(f"\\nManual SSE at α=0.83: {sse:.4f}")
print(f"Forecast: {fc_val:.2f}")
`;

const references = [
  {
    label: 'FPP3 §8.1',
    title: 'Forecasting: Principles and Practice – Simple Exponential Smoothing',
    authors: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/ses.html',
  },
  {
    label: 'Brown 1959',
    title: 'Statistical Forecasting for Inventory Control',
    authors: 'Brown, R.G.',
    year: 1959,
  },
];

export default function SimpleExponentialSmoothing() {
  return (
    <SectionLayout
      title="Simple Exponential Smoothing"
      difficulty="beginner"
      readingTime={15}
      prerequisites={['Baseline methods', 'Moving averages']}
    >
      <p>
        Simple Exponential Smoothing (SES) is the foundation of the entire exponential smoothing
        family. Unlike a moving average with equal weights, SES assigns <em>exponentially
        declining weights</em> to past observations — the most recent data matters most, but
        every historical observation contributes.
      </p>

      <NoteBlock type="fpp3" title="FPP3 Chapter 8">
        This section covers FPP3 §8.1. SES is the simplest member of the ETS (Error–Trend–
        Seasonal) family and is equivalent to ETS(A,N,N).
      </NoteBlock>

      <h2>1. The Smoothing Equation</h2>
      <DefinitionBlock
        label="Definition 8.1"
        title="Simple Exponential Smoothing"
        definition="The level equation recursively updates a smoothed estimate of the current level of the series."
        notation="\ell_t = \alpha y_t + (1 - \alpha)\ell_{t-1}, \quad 0 < \alpha \leq 1"
      />
      <p>
        The forecast for any horizon <InlineMath math="h" /> is simply the current level:
      </p>
      <BlockMath math="\hat{y}_{T+h \mid T} = \ell_T \quad \text{for all } h \geq 1" />
      <p>
        This means SES produces a flat forecast — appropriate for data with no trend or
        seasonality. Extending to trend requires Holt's method; adding seasonality requires
        Holt-Winters.
      </p>

      <h2>2. The α Parameter</h2>
      <p>
        The smoothing parameter <InlineMath math="\alpha" /> controls the speed of adaptation:
      </p>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm text-zinc-700 dark:text-zinc-300 border-collapse">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800">
              <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">α value</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">Behaviour</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">Analogous to</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['α → 0', 'Very slow adaptation; long memory; nearly flat level', 'Mean method'],
              ['α ≈ 0.1–0.3', 'Slow adaptation; weights spread over many periods', 'Wide MA window'],
              ['α ≈ 0.5–0.7', 'Moderate; weights concentrated on recent ~5–10 obs', 'Narrow MA'],
              ['α → 1', 'Very fast; essentially the naïve method', 'Naïve forecast'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-mono">{a}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">{b}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sky-600 dark:text-sky-400">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>3. Weighted Average Form</h2>
      <p>
        Expanding the recursion reveals that SES is a weighted average of all past observations
        with geometrically declining weights:
      </p>
      <BlockMath math="\ell_T = \alpha \sum_{j=0}^{T-1} (1-\alpha)^j y_{T-j} + (1-\alpha)^T \ell_0" />
      <p>
        The weight on observation <InlineMath math="y_{T-j}" /> is{' '}
        <InlineMath math="\alpha(1-\alpha)^j" />, which decays exponentially with lag{' '}
        <InlineMath math="j" />. The sum of all weights equals 1 (geometric series).
      </p>

      <TheoremBlock
        label="Theorem 8.1"
        title="Optimal α via SSE Minimization"
        statement="The optimal smoothing parameter α* minimizes the one-step-ahead sum of squared errors: SSE(α) = Σ(y_t − ŷ_{t|t−1})² = Σ(y_t − ℓ_{t−1})². This is equivalent to maximizing the Gaussian log-likelihood when ε_t ~ N(0,σ²)."
        proof="Substituting the SES recursion, ŷ_{t|t-1} = ℓ_{t-1} = α·y_{t-1} + (1-α)·ℓ_{t-2}. The SSE is a continuous function of α on (0,1] and can be minimized via standard numerical optimization (e.g., Brent's method)."
        corollaries={[
          "The optimal α can be found analytically for AR(1) processes: if y_t = φ·y_{t-1} + ε_t, then α* = 1 − φ.",
          "AIC and AICc from the likelihood can be used to compare SES against other models.",
        ]}
      />

      <h2>Interactive: Level Tracking</h2>
      <SESChart />

      <ExampleBlock
        title="Fitting SES to Oil Production Data"
        difficulty="beginner"
        problem="Given 20 years of annual oil production data, fit SES and compute 8-year forecasts. The data shows no clear trend."
        solution={[
          {
            step: "Initialize the level",
            formula: "\\ell_0 = y_1 = 17.55 \\quad \\text{(or optimize } \\ell_0 \\text{ jointly with } \\alpha)",
            explanation: "A common initialization is to set the initial level equal to the first observation. Alternatively, estimate ℓ₀ jointly via MLE.",
          },
          {
            step: "Compute first update",
            formula: "\\ell_1 = \\alpha y_1 + (1-\\alpha)\\ell_0",
            explanation: "For α=0.83: ℓ₁ = 0.83×17.55 + 0.17×17.55 = 17.55 (first step is trivial if ℓ₀=y₁).",
          },
          {
            step: "Continue recursion",
            formula: "\\ell_T = \\alpha y_T + (1-\\alpha)\\ell_{T-1}",
            explanation: "After all 20 observations, ℓ₂₀ becomes the forecast for all future periods.",
          },
          {
            step: "Flat h-step forecast",
            formula: "\\hat{y}_{T+h|T} = \\ell_T \\quad \\forall h \\geq 1",
            explanation: "SES does not extrapolate a trend, so all future forecasts equal the final level estimate.",
          },
        ]}
      />

      <h2>Python: statsmodels & statsforecast</h2>
      <PythonCode
        code={pythonCode}
        filename="ses.py"
        title="Simple Exponential Smoothing — two implementations"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
