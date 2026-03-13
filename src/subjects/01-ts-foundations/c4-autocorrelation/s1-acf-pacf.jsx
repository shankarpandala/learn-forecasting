import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Compute ACF for an AR(2) series
function computeACF(phi1, phi2, maxLag = 20) {
  // Yule-Walker equations for AR(2) autocorrelations
  const rho = new Array(maxLag + 1).fill(0);
  rho[0] = 1;
  rho[1] = phi1 / (1 - phi2);
  for (let k = 2; k <= maxLag; k++) {
    rho[k] = phi1 * rho[k - 1] + phi2 * rho[k - 2];
  }
  return rho.slice(1).map((r, i) => ({ lag: i + 1, acf: Math.round(r * 1000) / 1000 }));
}

function computePACF(phi1, phi2, maxLag = 20) {
  // For AR(2), PACF is exactly phi1 at lag 1, phi2 at lag 2, ~0 for k>2
  return Array.from({ length: maxLag }, (_, i) => ({
    lag: i + 1,
    pacf: i === 0 ? Math.round(phi1 * 1000) / 1000
        : i === 1 ? Math.round(phi2 * 1000) / 1000
        : Math.round((Math.sin(i * 0.3) * 0.03) * 1000) / 1000,  // near-zero with tiny numeric noise
  }));
}

function ACFPACFViz() {
  const [phi1, setPhi1] = useState(0.7);
  const [phi2, setPhi2] = useState(-0.3);
  const [view, setView] = useState('acf');

  // Check stationarity condition for AR(2)
  const stationary = Math.abs(phi2) < 1 && phi1 + phi2 < 1 && phi2 - phi1 < 1;

  const acfData = computeACF(phi1, phi2);
  const pacfData = computePACF(phi1, phi2);
  const data = view === 'acf' ? acfData : pacfData;
  const yKey = view === 'acf' ? 'acf' : 'pacf';
  const confBound = 1.96 / Math.sqrt(100); // approximate 95% band for n=100

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
      <h3 className="text-lg font-semibold text-sky-900 mb-1">Interactive: ACF & PACF of AR(2)</h3>
      <p className="text-sm text-sky-700 mb-4">
        Adjust the AR(2) coefficients. Note the ACF decays geometrically while the PACF cuts off after lag 2.
      </p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-sky-800 mb-1">φ₁ = <span className="font-bold">{phi1}</span></label>
          <input type="range" min={-1} max={1} step={0.05} value={phi1}
            onChange={e => setPhi1(parseFloat(e.target.value))}
            className="w-full accent-sky-600" />
        </div>
        <div>
          <label className="block text-sm text-sky-800 mb-1">φ₂ = <span className="font-bold">{phi2}</span></label>
          <input type="range" min={-1} max={1} step={0.05} value={phi2}
            onChange={e => setPhi2(parseFloat(e.target.value))}
            className="w-full accent-sky-600" />
        </div>
      </div>
      {!stationary && (
        <div className="mb-3 rounded-lg bg-red-50 border border-red-200 p-2 text-sm text-red-700">
          Warning: current coefficients produce a non-stationary AR(2). ACF/PACF are not meaningful.
        </div>
      )}
      <div className="flex gap-3 mb-4">
        {['acf', 'pacf'].map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${view === v ? 'bg-sky-600 text-white' : 'bg-white border border-sky-200 text-sky-700'}`}>
            {v.toUpperCase()}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis dataKey="lag" label={{ value: 'Lag k', position: 'insideBottom', offset: -3 }} />
          <YAxis domain={[-1.1, 1.1]} />
          <Tooltip formatter={v => [v.toFixed(3), view.toUpperCase()]} />
          <ReferenceLine y={confBound} stroke="#f97316" strokeDasharray="4 2" label={{ value: `+${confBound.toFixed(2)}`, position: 'right', fontSize: 10 }} />
          <ReferenceLine y={-confBound} stroke="#f97316" strokeDasharray="4 2" label={{ value: `-${confBound.toFixed(2)}`, position: 'right', fontSize: 10 }} />
          <ReferenceLine y={0} stroke="#666" />
          <Bar dataKey={yKey} fill={view === 'acf' ? '#0284c7' : '#16a34a'} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-center text-sky-500 mt-2">
        Orange dashed lines: approximate 95% confidence bands (±1.96/√n, n=100)
      </p>
    </div>
  );
}

const PYTHON_CODE = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.stattools import acf, pacf

np.random.seed(42)
n = 200

# ─── Simulate AR(2) process ───────────────────────────────────────────────────
phi1, phi2 = 0.7, -0.3
y = np.zeros(n)
eps = np.random.normal(0, 1, n)
for t in range(2, n):
    y[t] = phi1 * y[t-1] + phi2 * y[t-2] + eps[t]

# ─── Compute ACF and PACF ─────────────────────────────────────────────────────
max_lag = 20
acf_vals, acf_conf = acf(y, nlags=max_lag, alpha=0.05)
pacf_vals, pacf_conf = pacf(y, nlags=max_lag, alpha=0.05, method='ols')

print("ACF values (lags 1-10):")
for k in range(1, 11):
    sig = '**' if abs(acf_vals[k]) > 1.96/np.sqrt(n) else '  '
    print(f"  lag {k:2d}: {acf_vals[k]:7.4f} {sig}")

print("\\nPACF values (lags 1-10):")
for k in range(1, 11):
    sig = '**' if abs(pacf_vals[k]) > 1.96/np.sqrt(n) else '  '
    print(f"  lag {k:2d}: {pacf_vals[k]:7.4f} {sig}")

# ─── Theoretical ACF for AR(2) via Yule-Walker ───────────────────────────────
rho = [1.0]
rho.append(phi1 / (1 - phi2))
for k in range(2, max_lag + 1):
    rho.append(phi1 * rho[-1] + phi2 * rho[-2])
print(f"\\nTheoretical vs sample rho(1): {rho[1]:.4f} vs {acf_vals[1]:.4f}")
print(f"Theoretical vs sample rho(2): {rho[2]:.4f} vs {acf_vals[2]:.4f}")

# ─── Plot ACF and PACF ────────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
plot_acf(y, lags=max_lag, ax=axes[0], title='ACF of AR(2) series',
         alpha=0.05, color='steelblue')
plot_pacf(y, lags=max_lag, ax=axes[1], title='PACF of AR(2) series',
          alpha=0.05, color='green', method='ols')
for ax in axes:
    ax.grid(alpha=0.3)
    ax.axhline(0, color='black', linewidth=0.8)
plt.tight_layout()
plt.show()

# ─── Lag plot ─────────────────────────────────────────────────────────────────
fig2, axes2 = plt.subplots(1, 3, figsize=(12, 4))
for i, lag in enumerate([1, 2, 12]):
    axes2[i].scatter(y[lag:], y[:-lag], alpha=0.4, s=10)
    axes2[i].set_xlabel(f'y(t-{lag})')
    axes2[i].set_ylabel('y(t)')
    axes2[i].set_title(f'Lag {lag} plot (r={np.corrcoef(y[lag:], y[:-lag])[0,1]:.3f})')
    axes2[i].grid(alpha=0.3)
plt.tight_layout()
plt.show()
`;

export default function ACFPACFSection() {
  return (
    <SectionLayout
      title="ACF & PACF"
      difficulty="intermediate"
      readingTime={35}
      prerequisites={['Stationarity Concepts', 'Differencing & Integration']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            The autocorrelation function (ACF) and partial autocorrelation function (PACF)
            are the two most important diagnostic tools in time series analysis. They reveal
            the correlation structure of the series at different lags and — crucially — their
            characteristic patterns identify the order of ARMA models.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Autocorrelation Function (ACF)</h2>
          <DefinitionBlock
            label="Definition 4.1"
            title="Autocovariance Function"
            definition="For a covariance-stationary process {y_t}, the autocovariance function γ(k) measures the covariance between y_t and y_{t+k} for any t. By stationarity, γ(k) depends only on the lag k, not on t."
            notation="\gamma(k) = \mathrm{Cov}(y_t,\, y_{t+k}) = \mathbb{E}\!\left[(y_t - \mu)(y_{t+k} - \mu)\right]"
          />
          <DefinitionBlock
            label="Definition 4.2"
            title="Autocorrelation Function (ACF)"
            definition="The ACF ρ(k) normalises the autocovariance by the variance so that ρ(k) ∈ [-1, 1]. The sample ACF is computed from the observed series and used to identify model structure. Significant autocorrelations outside the approximate 95% confidence band ±1.96/√T indicate statistically meaningful structure at that lag."
            notation="\rho(k) = \frac{\gamma(k)}{\gamma(0)} = \frac{\mathrm{Cov}(y_t, y_{t+k})}{\mathrm{Var}(y_t)}, \qquad \hat{\rho}(k) = \frac{\sum_{t=k+1}^{T}(y_t - \bar{y})(y_{t-k} - \bar{y})}{\sum_{t=1}^{T}(y_t - \bar{y})^2}"
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Partial Autocorrelation Function (PACF)</h2>
          <DefinitionBlock
            label="Definition 4.3"
            title="Partial Autocorrelation Function (PACF)"
            definition="The PACF α(k) measures the correlation between y_t and y_{t-k} after removing the linear effects of all intermediate lags y_{t-1}, ..., y_{t-k+1}. Equivalently, α(k) is the last coefficient in the OLS regression of y_t on y_{t-1}, ..., y_{t-k}."
            notation="\alpha(k) = \mathrm{Corr}(y_t - \hat{y}_t^{(k)},\; y_{t-k} - \hat{y}_{t-k}^{(k)})"
          />
          <p className="text-gray-700 text-sm mt-2">
            where <InlineMath math="\hat{y}_t^{(k)}" /> is the projection of{' '}
            <InlineMath math="y_t" /> onto the span of{' '}
            <InlineMath math="\{y_{t-1}, \ldots, y_{t-k+1}\}" />.
            The PACF can be computed recursively via the Durbin-Levinson algorithm.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">ACF/PACF Signatures for ARMA Models</h2>
          <p className="text-gray-700 mb-4">
            The distinctive patterns in the ACF and PACF are the primary tool for tentative
            model identification — the first step of the Box-Jenkins methodology.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-100">
                  <th className="border border-sky-200 px-3 py-2">Model</th>
                  <th className="border border-sky-200 px-3 py-2">ACF pattern</th>
                  <th className="border border-sky-200 px-3 py-2">PACF pattern</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['AR(p)', 'Tails off gradually (exponential or damped sinusoidal decay)', 'Cuts off sharply after lag p (= 0 for k > p)'],
                  ['MA(q)', 'Cuts off sharply after lag q (= 0 for k > q)', 'Tails off gradually (exponential or oscillating decay)'],
                  ['ARMA(p,q)', 'Tails off after lag q', 'Tails off after lag p'],
                  ['White noise', 'All lags ≈ 0 (within confidence band)', 'All lags ≈ 0 (within confidence band)'],
                  ['Random walk', 'Decays very slowly toward zero', 'Large spike at lag 1 only'],
                  ['Seasonal AR(P)_m', 'Large spikes at lags m, 2m, 3m... that decay', 'Significant spikes at m, 2m,..., Pm and near-zero elsewhere'],
                ].map(([model, acf, pacf]) => (
                  <tr key={model} className="border-b border-sky-100 hover:bg-sky-50">
                    <td className="border border-sky-200 px-3 py-2 font-semibold font-mono text-sky-700">{model}</td>
                    <td className="border border-sky-200 px-3 py-2">{acf}</td>
                    <td className="border border-sky-200 px-3 py-2">{pacf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ACFPACFViz />

        <TheoremBlock
          label="Theorem 4.1"
          title="Bartlett's Formula for ACF Confidence Bands"
          statement="For a white noise series of length T, the sample autocorrelations r̂(k) are approximately normally distributed with mean 0 and variance 1/T. For a general MA(q) process, the asymptotic variance of r̂(k) for k > q is (1 + 2∑_{j=1}^q ρ(j)²)/T."
          proof="Follows from the central limit theorem applied to the sample autocovariance estimator under weak dependence conditions. See Brockwell & Davis (1991), Chapter 7."
          corollaries={[
            'The approximate 95% confidence band for a white noise null is ±1.96/√T.',
            'After fitting an MA(q) model, the residual ACF should be within ±1.96/√T for lags k > q.',
          ]}
        />

        <NoteBlock type="tip" title="Reading Lag Plots">
          A lag plot of <InlineMath math="y_t" /> against <InlineMath math="y_{t-k}" /> is a
          scatter plot that visualises the autocorrelation at lag k directly. A linear cloud
          sloping upward indicates positive autocorrelation; downward indicates negative;
          a circular cloud indicates no autocorrelation. Lag plots also reveal non-linear
          dependence that the linear ACF may miss.
        </NoteBlock>

        <PythonCode
          title="Computing and Plotting ACF & PACF with statsmodels"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              authors: 'Box, G.E.P., Jenkins, G.M. & Reinsel, G.C.',
              year: 2015,
              title: 'Time Series Analysis: Forecasting and Control (5th ed.)',
              venue: 'Wiley',
              type: 'book',
              whyImportant: 'Original source for the model identification via ACF/PACF methodology.',
            },
            {
              authors: 'Brockwell, P.J. & Davis, R.A.',
              year: 1991,
              title: 'Time Series: Theory and Methods (2nd ed.)',
              venue: 'Springer',
              type: 'book',
              whyImportant: 'Rigorous treatment of the asymptotic distribution of sample ACF and PACF including Bartlett\'s formula.',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
