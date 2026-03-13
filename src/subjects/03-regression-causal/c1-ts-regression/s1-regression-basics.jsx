import { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Synthetic quarterly retail data: trend + seasonality
const N = 32; // 8 years, 4 quarters each
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const TRUE_BETAS = { intercept: 50, trend: 2.5, q2: 10, q3: 25, q4: 15 };

function generateData() {
  const data = [];
  for (let i = 0; i < N; i++) {
    const t = i + 1;
    const q = i % 4;
    const seasonal = [0, TRUE_BETAS.q2, TRUE_BETAS.q3, TRUE_BETAS.q4][q];
    const noise = Math.sin(i * 5.3) * 4 + Math.cos(i * 2.7) * 2;
    const y = TRUE_BETAS.intercept + TRUE_BETAS.trend * t + seasonal + noise;
    data.push({ t, quarter: QUARTERS[q], y: parseFloat(y.toFixed(2)), seasonal });
  }
  return data;
}

const DATA = generateData();

// Simple OLS for: y = b0 + b1*t + b2*Q2 + b3*Q3 + b4*Q4
function fitOLS(data, useTrend, useSeasonality) {
  const n = data.length;
  const rows = data.map(d => {
    const row = [1];
    if (useTrend) row.push(d.t);
    if (useSeasonality) {
      row.push(d.quarter === 'Q2' ? 1 : 0);
      row.push(d.quarter === 'Q3' ? 1 : 0);
      row.push(d.quarter === 'Q4' ? 1 : 0);
    }
    return row;
  });
  const y = data.map(d => d.y);

  // X'X and X'y (manual matrix multiply for small case)
  const k = rows[0].length;
  const XtX = Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) =>
    rows.reduce((s, row) => s + row[i] * row[j], 0)
  ));
  const Xty = Array.from({ length: k }, (_, i) =>
    rows.reduce((s, row, r) => s + row[i] * y[r], 0)
  );

  // Simple Cholesky/pivot solve via Cramer (k <= 5)
  // Using numeric inverse for small k
  function inv2x2([[a, b], [c, d]]) { const det = a*d - b*c; return [[d/det, -b/det], [-c/det, a/det]]; }
  function matMul(A, B) { return A.map(row => B[0].map((_, j) => row.reduce((s, _, k2) => s + row[k2] * B[k2][j], 0))); }

  // Use gradient descent for simplicity if k > 2
  let beta = new Array(k).fill(0);
  for (let iter = 0; iter < 5000; iter++) {
    const lr = 0.0001;
    const grad = new Array(k).fill(0);
    for (let r = 0; r < n; r++) {
      const pred = rows[r].reduce((s, x, i) => s + x * beta[i], 0);
      const err = pred - y[r];
      for (let i = 0; i < k; i++) grad[i] += err * rows[r][i];
    }
    for (let i = 0; i < k; i++) beta[i] -= lr * grad[i];
  }

  const fitted = rows.map(row => row.reduce((s, x, i) => s + x * beta[i], 0));
  const residuals = y.map((yi, i) => yi - fitted[i]);
  const sse = residuals.reduce((s, e) => s + e * e, 0);
  const sst = y.reduce((s, yi) => s + (yi - y.reduce((a, b) => a + b, 0) / n) ** 2, 0);
  return { beta, fitted, residuals, r2: 1 - sse / sst };
}

function RegressionChart() {
  const [useTrend, setUseTrend] = useState(true);
  const [useSeason, setUseSeason] = useState(true);

  const { fitted, r2 } = useMemo(() => fitOLS(DATA, useTrend, useSeason), [useTrend, useSeason]);

  const chartData = DATA.map((d, i) => ({
    t: d.t, actual: d.y, fitted: parseFloat(fitted[i].toFixed(2)),
  }));

  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">
        Interactive: Trend & Seasonality Components
      </h3>
      <div className="flex gap-3 mb-4">
        {[
          { label: 'Linear Trend', value: useTrend, set: setUseTrend },
          { label: 'Seasonal Dummies (Q2/Q3/Q4)', value: useSeason, set: setUseSeason },
        ].map(({ label, value, set }) => (
          <button key={label} onClick={() => set(v => !v)}
            className={`px-3 py-1.5 rounded text-xs font-medium ${value ? 'bg-sky-600 text-white' : 'border border-zinc-500 text-zinc-400'}`}>
            {label}
          </button>
        ))}
      </div>
      <p className="text-xs text-zinc-400 mb-2">R² = <span className="text-sky-400 font-bold">{r2.toFixed(4)}</span></p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="t" tick={{ fontSize: 10 }} label={{ value: 'Quarter', position: 'insideBottom', offset: -2, fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line dataKey="actual" name="Actual" stroke="#94a3b8" strokeWidth={1.5} dot={{ r: 2 }} />
          <Line dataKey="fitted" name="Fitted" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-zinc-500 mt-2">Toggle components to see their contribution to model fit.</p>
    </div>
  );
}

const pythonCode = `# Time Series Regression with statsmodels OLS
# pip install statsmodels pandas numpy

import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf
import matplotlib.pyplot as plt

# ── 1. Generate quarterly retail sales data ───────────────────────────────────
np.random.seed(42)
n_years = 8
n = n_years * 4   # quarterly

quarters = pd.date_range('2015-01', periods=n, freq='QS')
q_labels = [(d.month // 3) for d in quarters]  # 1-4

t = np.arange(1, n + 1)
q2 = (np.array(q_labels) == 2).astype(int)
q3 = (np.array(q_labels) == 3).astype(int)
q4 = (np.array(q_labels) == 4).astype(int)

# True DGP: y = 50 + 2.5t + 10*Q2 + 25*Q3 + 15*Q4 + noise
y = 50 + 2.5*t + 10*q2 + 25*q3 + 15*q4 + np.random.normal(0, 4, n)

df = pd.DataFrame({'y': y, 't': t, 'q2': q2, 'q3': q3, 'q4': q4,
                   'quarter': q_labels, 'date': quarters})

# ── 2. Linear trend model ─────────────────────────────────────────────────────
X_trend = sm.add_constant(df[['t']])
model_trend = sm.OLS(df['y'], X_trend).fit()
print("Linear trend model:")
print(model_trend.summary())
print(f"R² = {model_trend.rsquared:.4f}")

# ── 3. Seasonal dummy variables model ────────────────────────────────────────
# Q1 is the baseline (omitted category)
X_season = sm.add_constant(df[['t', 'q2', 'q3', 'q4']])
model_season = sm.OLS(df['y'], X_season).fit()
print("\\nTrend + seasonal dummies:")
print(model_season.summary())

# Interpretation:
# Intercept: expected value in Q1 when t=0
# β_q2 = 10.xx: "Q2 is β_q2 units higher than Q1, holding trend constant"
# β_q3 = 25.xx: "Q3 is β_q3 units higher than Q1"
# β_q4 = 15.xx: "Q4 is β_q4 units higher than Q1"

# ── 4. Polynomial trend ───────────────────────────────────────────────────────
df['t2'] = df['t'] ** 2
X_poly = sm.add_constant(df[['t', 't2', 'q2', 'q3', 'q4']])
model_poly = sm.OLS(df['y'], X_poly).fit()
print(f"\\nPolynomial trend R² = {model_poly.rsquared:.4f}")

# ── 5. F-test for joint significance of seasonal dummies ──────────────────────
from statsmodels.stats.anova import anova_lm
model_no_season = sm.OLS(df['y'], sm.add_constant(df[['t']])).fit()
# Compare restricted (no season) vs unrestricted (with season)
# F-test via comparison of residual SS
sse_r = model_no_season.ssr
sse_u = model_season.ssr
k_r, k_u = 2, 5  # number of params
F_stat = ((sse_r - sse_u) / (k_u - k_r)) / (sse_u / (n - k_u))
from scipy.stats import f
p_value = 1 - f.cdf(F_stat, k_u - k_r, n - k_u)
print(f"\\nF-test for seasonality: F={F_stat:.2f}, p={p_value:.6f}")
print("Seasonality is", "significant" if p_value < 0.05 else "NOT significant")

# ── 6. Forecasting with the regression model ─────────────────────────────────
future_t = np.arange(n + 1, n + 9)   # 2 more years
future_q = (future_t - 1) % 4 + 1
future_df = pd.DataFrame({
    't':  future_t,
    'q2': (future_q == 2).astype(int),
    'q3': (future_q == 3).astype(int),
    'q4': (future_q == 4).astype(int),
})
X_future = sm.add_constant(future_df[['t', 'q2', 'q3', 'q4']], has_constant='add')
forecast = model_season.predict(X_future)

pred_result = model_season.get_prediction(X_future)
pred_ci = pred_result.summary_frame(alpha=0.05)
print("\\n8-quarter ahead forecasts:")
print(pred_ci[['mean', 'obs_ci_lower', 'obs_ci_upper']].round(2))

# ── 7. Residual diagnostics ───────────────────────────────────────────────────
# Check for autocorrelation in residuals (common in TS regression)
from statsmodels.stats.stattools import durbin_watson
dw = durbin_watson(model_season.resid)
print(f"\\nDurbin-Watson statistic: {dw:.4f}")
print("  DW near 2 → no autocorrelation in residuals")
print("  DW < 1.5  → positive autocorrelation (consider adding AR term)")
`;

const references = [
  {
    label: 'FPP3 §7',
    title: 'Forecasting: Principles and Practice – Time series regression models',
    authors: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/regression.html',
  },
  {
    label: 'Wooldridge 2010',
    title: 'Econometric Analysis of Cross Section and Panel Data',
    authors: 'Wooldridge, J.M.',
    year: 2010,
  },
];

export default function RegressionBasics() {
  return (
    <SectionLayout
      title="Time Series Regression for Forecasting"
      difficulty="beginner"
      readingTime={22}
      prerequisites={['Baseline methods', 'Linear algebra basics']}
    >
      <p>
        Regression-based forecasting models the relationship between a time series and
        explanatory variables (time index, dummy variables, external regressors). Unlike
        ARIMA which models autocorrelation structure, regression models explain{' '}
        <em>why</em> the series behaves as it does — making forecasts interpretable and
        actionable.
      </p>

      <h2>1. Linear Trend Model</h2>
      <DefinitionBlock
        label="Definition"
        title="Linear Trend Model"
        definition="The simplest regression model for a trended time series uses time as the sole predictor."
        notation="y_t = \beta_0 + \beta_1 t + \varepsilon_t, \quad t = 1, 2, \ldots, T"
      />
      <p>
        <InlineMath math="\beta_1 > 0" /> implies an upward trend of{' '}
        <InlineMath math="\beta_1" /> units per period. The OLS forecast for future period{' '}
        <InlineMath math="T + h" /> is:
      </p>
      <BlockMath math="\hat{y}_{T+h} = \hat{\beta}_0 + \hat{\beta}_1 (T + h)" />

      <h2>2. Polynomial Trend</h2>
      <p>
        When the trend is non-linear, polynomial terms can be added:
      </p>
      <BlockMath math="y_t = \beta_0 + \beta_1 t + \beta_2 t^2 + \varepsilon_t" />
      <p>
        Quadratic trends are common for hump-shaped or accelerating growth patterns.
        Use with caution for forecasting: polynomials can diverge rapidly outside the
        training range.
      </p>

      <h2>3. Seasonal Dummy Variables</h2>
      <p>
        For a series with <InlineMath math="m" /> seasons, we need{' '}
        <InlineMath math="m - 1" /> dummy variables to avoid perfect multicollinearity
        (the "dummy variable trap"). The omitted season becomes the baseline:
      </p>
      <BlockMath math="y_t = \beta_0 + \beta_1 t + \beta_2 d_{2,t} + \beta_3 d_{3,t} + \cdots + \beta_m d_{m,t} + \varepsilon_t" />
      <p>
        where <InlineMath math="d_{j,t} = 1" /> if observation <InlineMath math="t" />{' '}
        belongs to season <InlineMath math="j" />, and 0 otherwise.
      </p>

      <ExampleBlock
        title="Quarterly Sales: Interpretation of Seasonal Coefficients"
        difficulty="beginner"
        problem="A quarterly model is fitted with Q1 as baseline. The estimated coefficients are: β₀=50, β₁=2.5, β_Q2=10, β_Q3=25, β_Q4=15. Interpret each."
        solution={[
          {
            step: "Intercept interpretation",
            formula: "\\hat{y}_1 = 50 + 2.5 \\times 1 = 52.5 \\text{ (Q1, t=1)}",
            explanation: "β₀ is the expected value in Q1 when t=1 (or at t=0 by extrapolation). Not always meaningful on its own.",
          },
          {
            step: "Trend interpretation",
            formula: "\\hat{y}_{t+1} - \\hat{y}_t = \\beta_1 = 2.5",
            explanation: "Each quarter, sales increase by 2.5 units on average, holding the seasonal effect constant.",
          },
          {
            step: "Q2 seasonal effect",
            formula: "\\hat{y}_{Q2} - \\hat{y}_{Q1} = \\beta_{Q2} = 10",
            explanation: "Q2 is 10 units higher than Q1, after accounting for the trend. This is the 'April–June premium'.",
          },
          {
            step: "Q3 seasonal effect (peak)",
            formula: "\\hat{y}_{Q3} - \\hat{y}_{Q1} = \\beta_{Q3} = 25",
            explanation: "Q3 is the peak season, 25 units above the Q1 baseline. This is statistically significant if the t-statistic > 2.",
          },
        ]}
      />

      <h2>4. F-test for Seasonal Significance</h2>
      <p>
        To test whether seasonality is jointly significant (all seasonal dummies = 0):
      </p>
      <BlockMath math="F = \frac{(RSS_R - RSS_U) / q}{RSS_U / (T - k - 1)} \sim F(q, T-k-1)" />
      <p>
        where <InlineMath math="RSS_R" /> is the restricted (no season) residual sum of squares,
        <InlineMath math="RSS_U" /> is unrestricted, and <InlineMath math="q = m - 1" /> is
        the number of seasonal dummies being tested.
      </p>

      <h2>Interactive: Components Toggle</h2>
      <RegressionChart />

      <NoteBlock type="tip" title="Durbin-Watson Test">
        After fitting a time series regression, always check the Durbin-Watson statistic.
        A value near 2 indicates no autocorrelation in residuals. Values below 1.5 suggest
        positive autocorrelation — a sign that ARIMA errors or lag terms should be added.
      </NoteBlock>

      <WarningBlock title="Spurious Regression">
        Regressing one non-stationary series on another can produce high R² and significant
        t-statistics purely by chance — spurious regression (Granger & Newbold, 1974).
        Always check stationarity of the residuals when both y and X are non-stationary.
        Use cointegration tests (Engle-Granger, Johansen) if needed.
      </WarningBlock>

      <h2>Python: statsmodels OLS</h2>
      <PythonCode
        code={pythonCode}
        filename="ts_regression.py"
        title="Time series regression with trend, seasonality, and diagnostics"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
