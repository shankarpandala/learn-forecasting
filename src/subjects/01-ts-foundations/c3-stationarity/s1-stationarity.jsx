import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Simulate stationary AR(1) and random walk
function buildSeries(type, phi = 0.7, n = 100) {
  const data = [];
  let y = 0;
  const rng = (seed) => {
    let x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  };
  for (let t = 0; t < n; t++) {
    const eps = (rng(t + type.length * 7) - 0.5) * 4;
    if (type === 'ar1') {
      y = phi * y + eps;
    } else if (type === 'rw') {
      y = y + eps;
    } else if (type === 'trend') {
      y = 0.3 * t + eps * 5;
    } else {
      y = eps;
    }
    data.push({ t, y: Math.round(y * 100) / 100 });
  }
  return data;
}

function StationarityViz() {
  const [seriesType, setSeriesType] = useState('ar1');
  const [phi, setPhi] = useState(0.7);
  const data = buildSeries(seriesType, phi);

  const labels = {
    ar1: `Stationary AR(1), φ=${phi}`,
    rw: 'Random Walk (non-stationary)',
    trend: 'Deterministic Trend (non-stationary)',
    wn: 'White Noise (stationary)',
  };

  const stationary = seriesType === 'ar1' || seriesType === 'wn';
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
      <h3 className="text-lg font-semibold text-sky-900 mb-1">Interactive: Stationary vs Non-Stationary Series</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(labels).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setSeriesType(k)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              seriesType === k ? 'bg-sky-600 text-white' : 'bg-white border border-sky-200 text-sky-700 hover:bg-sky-50'
            }`}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>
      {seriesType === 'ar1' && (
        <div className="mb-4">
          <label className="block text-sm text-sky-800 mb-1">
            AR coefficient φ = <span className="font-bold">{phi}</span>
            {Math.abs(phi) >= 1 && <span className="text-red-600 ml-2">(non-stationary: |φ| ≥ 1)</span>}
          </label>
          <input type="range" min={-1.2} max={1.2} step={0.1} value={phi}
            onChange={e => setPhi(parseFloat(e.target.value))}
            className="w-full accent-sky-600" />
          <div className="flex justify-between text-xs text-sky-400"><span>-1.2</span><span>0</span><span>1.2</span></div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis dataKey="t" label={{ value: 't', position: 'insideBottom', offset: -3 }} />
          <YAxis />
          <Tooltip formatter={v => [v.toFixed(2), 'y_t']} />
          <Line type="monotone" dataKey="y" stroke={stationary && !(seriesType === 'ar1' && Math.abs(phi) >= 1) ? '#16a34a' : '#dc2626'} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className={`mt-3 rounded-lg p-3 text-sm font-medium ${
        stationary && !(seriesType === 'ar1' && Math.abs(phi) >= 1)
          ? 'bg-green-50 text-green-800 border border-green-200'
          : 'bg-red-50 text-red-800 border border-red-200'
      }`}>
        {stationary && !(seriesType === 'ar1' && Math.abs(phi) >= 1)
          ? `Stationary — ${labels[seriesType]}. Mean and variance are constant over time.`
          : `Non-stationary — ${labels[seriesType]}. Mean or variance changes over time.`}
      </div>
    </div>
  );
}

const PYTHON_CODE = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

np.random.seed(42)
n = 200

# ─── 1. White noise (strictly stationary) ────────────────────────────────────
wn = np.random.normal(0, 1, n)

# ─── 2. Stationary AR(1): |φ| < 1 ────────────────────────────────────────────
phi = 0.8
ar1 = np.zeros(n)
eps = np.random.normal(0, 1, n)
for t in range(1, n):
    ar1[t] = phi * ar1[t-1] + eps[t]

# Theoretical mean and variance of AR(1)
mean_ar1 = 0                             # E[y_t] = 0 for zero-mean process
var_ar1  = 1 / (1 - phi**2)             # Var[y_t] = sigma^2 / (1-phi^2)
print(f"AR(1) theoretical variance: {var_ar1:.4f}")
print(f"AR(1) sample variance:      {ar1.var():.4f}")

# ─── 3. Random walk (unit root, non-stationary) ───────────────────────────────
rw = np.cumsum(np.random.normal(0, 1, n))

# Variance grows with time — classic sign of non-stationarity
mid   = rw[:n//2].var()
later = rw[n//2:].var()
print(f"\\nRandom walk variance (first half):  {mid:.2f}")
print(f"Random walk variance (second half): {later:.2f}  (should be ~2x first)")

# ─── 4. Random walk with drift ───────────────────────────────────────────────
drift = 0.3
rw_drift = np.cumsum(np.random.normal(drift, 1, n))

# ─── Plot ─────────────────────────────────────────────────────────────────────
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
for ax, y, title, color in zip(axes.ravel(),
    [wn, ar1, rw, rw_drift],
    ['White Noise (stationary)', f'AR(1), φ={phi} (stationary)',
     'Random Walk', f'Random Walk with drift={drift}'],
    ['gray', 'steelblue', 'red', 'darkorange']):
    ax.plot(y, color=color, linewidth=1)
    ax.axhline(0, color='black', linestyle='--', linewidth=0.8, alpha=0.5)
    ax.set_title(title, fontsize=11)
    ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
`;

export default function StationaritySection() {
  return (
    <SectionLayout
      title="Stationarity Concepts"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['Patterns in Time Series', 'Transformations & Adjustments']}
    >
      <div className="space-y-6">
        <NoteBlock type="historical" title="Historical Note">
          The mathematical theory of stationarity developed alongside probability theory in
          the early 20th century. Aleksandr Khinchin (1934) introduced the concept of
          wide-sense (covariance) stationarity and proved the Wiener-Khinchin theorem
          connecting the autocorrelation function to the spectral density. The unit root
          concept became central to macroeconometrics after Nelson and Plosser (1982) showed
          that most macroeconomic series contain unit roots.
        </NoteBlock>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">What is Stationarity?</h2>
          <p className="text-gray-700 leading-relaxed">
            Stationarity is a central assumption in classical time series analysis. Most
            ARIMA-type models require — or are much better behaved under — stationarity.
            The intuition is simple: a stationary series has statistical properties that do
            not change over time. Non-stationary series with trends or unit roots violate
            this assumption and lead to spurious regressions and unreliable inference.
          </p>
        </section>

        <DefinitionBlock
          label="Definition 3.1"
          title="Strict Stationarity"
          definition="A stochastic process {y_t} is strictly stationary if the joint distribution of (y_{t_1}, ..., y_{t_k}) is identical to the joint distribution of (y_{t_1+h}, ..., y_{t_k+h}) for all k, all time points t_1 < ... < t_k, and all shifts h. The entire probability law is invariant to time shifts."
          notation="(y_{t_1},\ldots,y_{t_k}) \overset{d}{=} (y_{t_1+h},\ldots,y_{t_k+h}) \quad \forall h, k, t_1<\cdots<t_k"
        />

        <DefinitionBlock
          label="Definition 3.2"
          title="Weak (Covariance) Stationarity"
          definition="A process {y_t} is weakly stationary (or covariance stationary) if: (1) E[y_t] = μ is constant for all t; (2) Var[y_t] = σ² < ∞ is constant for all t; (3) Cov[y_t, y_{t+k}] = γ(k) depends only on the lag k, not on t. Weak stationarity is a less restrictive condition: strict stationarity with finite second moments implies weak stationarity, but not vice versa."
          notation="\mathbb{E}[y_t] = \mu, \quad \mathrm{Var}[y_t] = \sigma^2, \quad \mathrm{Cov}(y_t, y_{t+k}) = \gamma(k)"
        />

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">White Noise</h2>
          <DefinitionBlock
            label="Definition 3.3"
            title="White Noise"
            definition="A white noise process {ε_t} satisfies: (1) E[ε_t] = 0; (2) E[ε_t²] = σ² (constant variance); (3) E[ε_t ε_s] = 0 for t ≠ s (no autocorrelation). White noise is weakly stationary. Strong white noise additionally requires independence (not just uncorrelatedness). Gaussian white noise further requires normality."
            notation="\varepsilon_t \sim \mathrm{WN}(0, \sigma^2)"
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Random Walk and Unit Root</h2>
          <p className="text-gray-700 mb-3">
            A random walk is the prototypical non-stationary process. It accumulates shocks
            permanently — there is no tendency to return to a mean.
          </p>
          <DefinitionBlock
            label="Definition 3.4"
            title="Random Walk"
            definition="The random walk is defined by y_t = y_{t-1} + ε_t, where ε_t is white noise. The conditional mean equals the last observation (E[y_{t+h}|y_t] = y_t), the variance grows without bound (Var[y_t] = t σ²), and the series has no finite unconditional mean. The random walk is I(1): one difference produces a stationary series."
            notation="y_t = y_{t-1} + \varepsilon_t \implies \nabla y_t = \varepsilon_t \sim \mathrm{WN}(0, \sigma^2)"
          />

          <p className="text-gray-700 mt-3 mb-2">
            Writing <InlineMath math="y_t = \phi y_{t-1} + \varepsilon_t" />, the process has
            a <strong>unit root</strong> when <InlineMath math="\phi = 1" />. For{' '}
            <InlineMath math="|\phi| < 1" />, the process is stationary. Exactly at{' '}
            <InlineMath math="\phi = 1" />, the variance is:
          </p>
          <BlockMath math="\mathrm{Var}[y_t] = t\sigma^2 \to \infty \text{ as } t \to \infty" />
        </section>

        <TheoremBlock
          label="Theorem 3.1"
          title="Variance of a Stationary AR(1)"
          statement="For a stationary AR(1) process y_t = φ y_{t-1} + ε_t with |φ| < 1 and ε_t ~ WN(0, σ²), the unconditional variance is σ²_y = σ²/(1-φ²), and the autocovariance at lag k is γ(k) = σ²_y φ^k."
          proof="Taking unconditional expectations of Var[y_t] = φ² Var[y_{t-1}] + σ² and using the stationarity assumption Var[y_t] = Var[y_{t-1}] = σ²_y gives σ²_y = φ²σ²_y + σ², hence σ²_y = σ²/(1-φ²). For γ(k), multiply y_{t-k} on both sides of the AR equation and take expectations."
          corollaries={[
            'As |φ| → 1 from below, σ²_y → ∞, confirming the non-stationary behaviour at the unit root.',
            'The autocorrelation at lag k is ρ(k) = γ(k)/γ(0) = φ^k, decaying geometrically to zero.',
          ]}
        />

        <StationarityViz />

        <WarningBlock title="Spurious Regression">
          Regressing one non-stationary series on another unrelated non-stationary series
          typically produces a high R² and significant t-statistics — even when there is no
          true relationship. This is <strong>spurious regression</strong>, first documented
          by Granger & Newbold (1974). Always test for stationarity before running regressions
          on time series. Use differencing or cointegration analysis when series are I(1).
        </WarningBlock>

        <PythonCode
          title="Stationary vs Non-Stationary Series in Python"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              authors: 'Hamilton, J.D.',
              year: 1994,
              title: 'Time Series Analysis',
              venue: 'Princeton University Press',
              type: 'book',
              whyImportant: 'The standard graduate-level reference for time series econometrics. Chapters 1-3 cover stationarity, ergodicity, and ARMA processes rigorously.',
            },
            {
              authors: 'Nelson, C.R. & Plosser, C.I.',
              year: 1982,
              title: 'Trends and random walks in macroeconomic time series',
              venue: 'Journal of Monetary Economics, 10(2), 139–162',
              type: 'paper',
              whyImportant: 'Influential paper showing that most macroeconomic time series are better described as random walks than as stationary fluctuations around deterministic trends.',
            },
            {
              authors: 'Granger, C.W.J. & Newbold, P.',
              year: 1974,
              title: 'Spurious regressions in econometrics',
              venue: 'Journal of Econometrics, 2(2), 111–120',
              type: 'paper',
              whyImportant: 'Demonstrates the spurious regression problem and motivates the need for stationarity testing before regression analysis.',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
