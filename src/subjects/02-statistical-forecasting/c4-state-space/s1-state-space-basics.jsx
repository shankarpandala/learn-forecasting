import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// ── Simple Kalman filter on scalar local-level model ──────────────────────
// Observation: y_t = mu_t + epsilon_t,  epsilon ~ N(0, sigma_e^2)
// State:       mu_t = mu_{t-1} + eta_t, eta     ~ N(0, sigma_n^2)
function runKalmanFilter(data, sigmaE2, sigmaN2) {
  const n = data.length;
  const filtered = [];    // a_t|t (filtered state mean)
  const predicted = [];   // a_t|t-1 (predicted state mean)
  const filteredVar = []; // P_t|t
  const predictedVar = [];// P_t|t-1

  let a = data[0];  // initialise at first observation
  let P = sigmaE2;  // diffuse-ish initialisation

  for (let t = 0; t < n; t++) {
    // Prediction step
    const a_pred = a;
    const P_pred = P + sigmaN2;
    predicted.push(a_pred);
    predictedVar.push(P_pred);

    // Update step
    const v = data[t] - a_pred;          // innovation
    const F = P_pred + sigmaE2;          // innovation variance
    const K = P_pred / F;                // Kalman gain
    a = a_pred + K * v;
    P = (1 - K) * P_pred;

    filtered.push(Math.round(a * 100) / 100);
    filteredVar.push(Math.round(P * 10000) / 10000);
  }
  return { filtered, predicted, filteredVar, predictedVar };
}

function generateNoisyTrend(n = 80, seed = 7) {
  let s = seed;
  const rng = () => {
    s = Math.imul(s, 1664525) + 1013904223;
    return ((s >>> 0) / 0xffffffff) * 2 - 1;
  };
  const data = [];
  let mu = 10;
  for (let t = 0; t < n; t++) {
    const eta = rng() * 0.3;   // level noise
    const eps = rng() * 2.5;   // observation noise
    mu += eta;
    data.push(Math.round((mu + eps) * 100) / 100);
  }
  return data;
}

function KalmanViz() {
  const [sigmaE, setSigmaE] = useState(2.5);
  const [sigmaN, setSigmaN] = useState(0.3);

  const rawData = generateNoisyTrend();
  const { filtered } = runKalmanFilter(rawData, sigmaE ** 2, sigmaN ** 2);
  const snr = Math.round((sigmaN / sigmaE) * 100) / 100;

  const chartData = rawData.map((y, t) => ({
    t,
    observed: y,
    filtered: filtered[t],
  }));

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
      <h3 className="text-lg font-semibold text-sky-900 mb-1">
        Interactive: Kalman Filter — Local Level Model
      </h3>
      <p className="text-sm text-sky-700 mb-4">
        Adjust the noise ratio. A high signal/noise ratio (large σ_η relative to σ_ε) makes
        the filter track the data closely; a small ratio produces heavy smoothing.
      </p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-sky-800 mb-1">
            Observation noise σ_ε = <span className="font-bold">{sigmaE}</span>
          </label>
          <input type="range" min={0.5} max={5} step={0.1} value={sigmaE}
            onChange={e => setSigmaE(parseFloat(e.target.value))}
            className="w-full accent-sky-600" />
        </div>
        <div>
          <label className="block text-sm text-sky-800 mb-1">
            Level noise σ_η = <span className="font-bold">{sigmaN}</span>
          </label>
          <input type="range" min={0.05} max={2} step={0.05} value={sigmaN}
            onChange={e => setSigmaN(parseFloat(e.target.value))}
            className="w-full accent-sky-600" />
        </div>
      </div>
      <div className="mb-2 text-sm text-sky-700">
        Signal-to-noise ratio: <span className="font-bold">{snr}</span>
        {snr > 0.5
          ? ' — filter follows data closely (responsive)'
          : ' — heavy smoothing (slow to adapt)'}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis dataKey="t" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="observed" stroke="#94a3b8" strokeWidth={1}
            dot={false} name="Observed y_t" opacity={0.7} />
          <Line type="monotone" dataKey="filtered" stroke="#0284c7" strokeWidth={2}
            dot={false} name="Filtered state μ_t|t" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const PYTHON_CODE = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.tsa.statespace.structural import UnobservedComponents

np.random.seed(42)
n = 150

# ─── Simulate a local level model ─────────────────────────────────────────────
# State equation:   mu_t = mu_{t-1} + eta_t,  eta_t ~ N(0, sigma_eta^2)
# Observation eqn:  y_t  = mu_t + eps_t,       eps_t ~ N(0, sigma_eps^2)
sigma_eps = 1.5
sigma_eta = 0.5

mu = np.zeros(n)
mu[0] = 10.0
for t in range(1, n):
    mu[t] = mu[t-1] + np.random.normal(0, sigma_eta)

y = mu + np.random.normal(0, sigma_eps, n)

# ─── Manual Kalman filter (for illustration) ──────────────────────────────────
def kalman_filter(y, sigma_eps2, sigma_eta2):
    n = len(y)
    a = np.zeros(n)          # filtered state mean
    P = np.zeros(n)          # filtered state variance
    a_pred = np.zeros(n)     # predicted state mean
    P_pred = np.zeros(n)     # predicted state variance
    v = np.zeros(n)          # innovations
    K = np.zeros(n)          # Kalman gain

    # Initialise (diffuse prior)
    a_pred[0] = y[0]
    P_pred[0] = 1e6

    for t in range(n):
        # Observation update
        v[t] = y[t] - a_pred[t]
        F = P_pred[t] + sigma_eps2
        K[t] = P_pred[t] / F
        a[t] = a_pred[t] + K[t] * v[t]
        P[t] = (1 - K[t]) * P_pred[t]

        # State prediction (if not last)
        if t < n - 1:
            a_pred[t+1] = a[t]
            P_pred[t+1] = P[t] + sigma_eta2

    return a, P, v, K

a_filt, P_filt, innovations, gains = kalman_filter(y, sigma_eps**2, sigma_eta**2)

print("Manual Kalman filter results:")
print(f"  Mean Kalman gain:       {gains.mean():.4f} (steady state: {sigma_eta**2 / (sigma_eta**2 + sigma_eps**2):.4f})")
print(f"  Mean filtered variance: {P_filt.mean():.6f}")
print(f"  RMSE (filtered vs true): {np.sqrt(np.mean((a_filt - mu)**2)):.4f}")

# ─── Fit local level model with statsmodels ───────────────────────────────────
model = UnobservedComponents(y, level='local level')
result = model.fit(disp=False)
print("\\nstatsmodels local level model:")
print(result.summary())

# Estimated noise variances
print(f"\\nTrue sigma_eps^2:      {sigma_eps**2:.4f}")
print(f"Estimated sigma_eps^2: {result.params[0]:.4f}")
print(f"True sigma_eta^2:      {sigma_eta**2:.4f}")
print(f"Estimated sigma_eta^2: {result.params[1]:.4f}")

# ─── Smoothed state and forecast ──────────────────────────────────────────────
smoothed = result.smoother_results
a_smooth = smoothed.smoothed_state[0]

forecast = result.forecast(10)

# ─── Plot results ────────────────────────────────────────────────────────────
fig, axes = plt.subplots(2, 1, figsize=(14, 10))

axes[0].plot(y, color='lightblue', label='Observed y_t', linewidth=1)
axes[0].plot(mu, color='black', label='True level μ_t', linewidth=1.5, linestyle='--')
axes[0].plot(a_filt, color='blue', label='Filtered state a_t|t', linewidth=1.5)
axes[0].plot(a_smooth, color='red', label='Smoothed state E[μ_t|Y]', linewidth=1.5)
axes[0].set_title('Local Level Model: Kalman Filter and Smoother')
axes[0].legend()
axes[0].grid(alpha=0.3)

# Innovations (should be approximately white noise)
axes[1].plot(innovations, color='steelblue', linewidth=0.8)
axes[1].axhline(0, color='black', linewidth=0.8)
axes[1].set_title('Innovations (one-step-ahead forecast errors)')
axes[1].grid(alpha=0.3)

plt.tight_layout()
plt.show()
`;

export default function StateSpaceBasicsSection() {
  return (
    <SectionLayout
      title="State Space Models"
      difficulty="advanced"
      readingTime={14}
      prerequisites={['ARIMA Models', 'Exponential Smoothing']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            State space models provide a general framework for representing time series where
            the observed data are generated by an underlying latent (hidden) state process.
            The framework unifies many classical methods — ARIMA, exponential smoothing, and
            structural decompositions — under a single estimation and filtering machinery:
            the Kalman filter. State space models are also the basis for more advanced
            approaches such as dynamic linear models, particle filters, and modern deep
            state space neural networks.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">The State Space Representation</h2>
          <p className="text-gray-700 mb-3">
            A linear Gaussian state space model consists of two equations. The{' '}
            <strong>observation equation</strong> links the observed data to the latent state,
            and the <strong>state transition equation</strong> describes how the state evolves
            over time.
          </p>

          <DefinitionBlock term="Linear Gaussian State Space Model">
            <p className="mb-2">
              <strong>Observation (measurement) equation:</strong>
            </p>
            <BlockMath math="y_t = Z_t \alpha_t + d_t + \varepsilon_t, \quad \varepsilon_t \sim \mathcal{N}(0,\, H_t)" />
            <p className="mb-2 mt-3">
              <strong>State (transition) equation:</strong>
            </p>
            <BlockMath math="\alpha_{t+1} = T_t \alpha_t + c_t + R_t \eta_t, \quad \eta_t \sim \mathcal{N}(0,\, Q_t)" />
            <p className="mt-3 text-sm">
              where <InlineMath math="\alpha_t \in \mathbb{R}^m" /> is the latent state vector,{' '}
              <InlineMath math="y_t \in \mathbb{R}^p" /> is the observation vector,{' '}
              <InlineMath math="Z_t, T_t, R_t, H_t, Q_t" /> are system matrices (possibly
              time-varying), and <InlineMath math="\varepsilon_t \perp \eta_t" />.
            </p>
          </DefinitionBlock>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-100">
                  <th className="border border-sky-200 px-3 py-2">Symbol</th>
                  <th className="border border-sky-200 px-3 py-2">Name</th>
                  <th className="border border-sky-200 px-3 py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Z_t', 'Observation matrix', 'Maps latent state to observed space'],
                  ['H_t', 'Observation noise covariance', 'Measurement error variance'],
                  ['T_t', 'Transition matrix', 'Propagates state from t to t+1'],
                  ['R_t', 'State noise selection matrix', 'Selects which state components are stochastic'],
                  ['Q_t', 'State noise covariance', 'Variability of state innovations'],
                  ['d_t, c_t', 'Intercept vectors', 'Optional constant terms in obs/state equations'],
                ].map(([sym, name, role]) => (
                  <tr key={sym} className="border-b border-sky-100 hover:bg-sky-50">
                    <td className="border border-sky-200 px-3 py-2 font-mono font-semibold text-sky-700">
                      <InlineMath math={sym} />
                    </td>
                    <td className="border border-sky-200 px-3 py-2 font-medium">{name}</td>
                    <td className="border border-sky-200 px-3 py-2">{role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">The Kalman Filter Algorithm</h2>
          <p className="text-gray-700 mb-3">
            The Kalman filter is a recursive algorithm that computes the optimal linear
            estimate of the state <InlineMath math="\alpha_t" /> given all observations up to
            time <InlineMath math="t" />. "Optimal" here means minimum mean squared error
            among all linear estimators; under Gaussian noise it is also the globally optimal
            (Bayesian posterior) estimator.
          </p>

          <TheoremBlock title="Kalman Filter Recursions">
            <p className="mb-2">
              Starting from an initial state <InlineMath math="a_1 = \mathbb{E}[\alpha_1]" />{' '}
              and <InlineMath math="P_1 = \mathrm{Var}(\alpha_1)" />, iterate:
            </p>
            <p className="font-semibold mt-3 mb-1">Prediction step (prior at t given t−1):</p>
            <BlockMath math="a_{t|t-1} = T_{t-1} a_{t-1|t-1}" />
            <BlockMath math="P_{t|t-1} = T_{t-1} P_{t-1|t-1} T_{t-1}^\top + R_{t-1} Q_{t-1} R_{t-1}^\top" />
            <p className="font-semibold mt-3 mb-1">Update step (posterior at t given y_t):</p>
            <BlockMath math="v_t = y_t - Z_t a_{t|t-1} - d_t \quad \text{(innovation)}" />
            <BlockMath math="F_t = Z_t P_{t|t-1} Z_t^\top + H_t \quad \text{(innovation variance)}" />
            <BlockMath math="K_t = P_{t|t-1} Z_t^\top F_t^{-1} \quad \text{(Kalman gain)}" />
            <BlockMath math="a_{t|t} = a_{t|t-1} + K_t v_t" />
            <BlockMath math="P_{t|t} = (I - K_t Z_t) P_{t|t-1}" />
          </TheoremBlock>

          <p className="text-gray-700 mt-3 text-sm">
            The Kalman gain <InlineMath math="K_t" /> determines how much new information{' '}
            <InlineMath math="v_t" /> updates the state estimate. When observation noise is
            high relative to state noise (<InlineMath math="H_t \gg Q_t" />), the gain is
            small and the filter is conservative. When state noise dominates, the filter
            tracks the data aggressively.
          </p>
        </section>

        <KalmanViz />

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">The Kalman Smoother</h2>
          <p className="text-gray-700 mb-3">
            The Kalman filter computes <InlineMath math="a_{t|t} = \mathbb{E}[\alpha_t \mid y_1, \ldots, y_t]" />{' '}
            — the conditional mean using observations up to and including time t. The{' '}
            <strong>Kalman smoother</strong> (also called the RTS smoother or backward pass)
            computes <InlineMath math="a_{t|T} = \mathbb{E}[\alpha_t \mid y_1, \ldots, y_T]" />{' '}
            — the conditional mean using all observations. Smoothed estimates are more
            accurate but require the entire dataset and cannot be used in real-time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: 'Filtered', math: 'a_{t|t}', color: 'sky',
                desc: 'Uses y_1,...,y_t. Available in real time. Optimal for online estimation.',
              },
              {
                label: 'Smoothed', math: 'a_{t|T}', color: 'violet',
                desc: 'Uses all y_1,...,y_T. Requires full dataset. Lower variance than filtered.',
              },
              {
                label: 'Predicted', math: 'a_{t|t-1}', color: 'amber',
                desc: 'Uses y_1,...,y_{t-1}. One-step-ahead forecast. Innovations v_t come from here.',
              },
            ].map(({ label, math, color, desc }) => {
              const styles = {
                sky: { box: 'rounded-lg border border-sky-200 bg-sky-50 p-4', h: 'font-semibold text-sky-900 mb-1', p: 'text-sm text-sky-800' },
                violet: { box: 'rounded-lg border border-violet-200 bg-violet-50 p-4', h: 'font-semibold text-violet-900 mb-1', p: 'text-sm text-violet-800' },
                amber: { box: 'rounded-lg border border-amber-200 bg-amber-50 p-4', h: 'font-semibold text-amber-900 mb-1', p: 'text-sm text-amber-800' },
              };
              const s = styles[color] || styles.sky;
              return (
                <div key={label} className={s.box}>
                  <h4 className={s.h}>{label}: <InlineMath math={math} /></h4>
                  <p className={s.p}>{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Parameter Estimation via Maximum Likelihood</h2>
          <p className="text-gray-700 mb-3">
            The system matrices <InlineMath math="Z, T, R, H, Q" /> typically contain unknown
            parameters <InlineMath math="\psi" /> (variance components, regression coefficients,
            AR/MA parameters). These are estimated by maximum likelihood using the prediction
            error decomposition.
          </p>
          <TheoremBlock title="Prediction Error Decomposition of the Likelihood">
            <p>
              The log-likelihood of the observations <InlineMath math="Y_T = (y_1, \ldots, y_T)" /> given
              parameters <InlineMath math="\psi" /> factors through the Kalman filter innovations:
            </p>
            <BlockMath math="\ell(\psi) = -\frac{1}{2}\sum_{t=1}^{T}\!\left(\log|F_t| + v_t^\top F_t^{-1} v_t\right)" />
            <p className="mt-2 text-sm">
              This is computed as a by-product of running the Kalman filter. Numerical
              optimisation (e.g., L-BFGS-B) is then applied to <InlineMath math="\ell(\psi)" />
              to obtain the MLE <InlineMath math="\hat{\psi}" />.
            </p>
          </TheoremBlock>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">ARIMA as a State Space Model</h2>
          <p className="text-gray-700 mb-3">
            Every ARIMA(p,d,q) model has an equivalent state space representation. For
            example, the AR(1) model <InlineMath math="y_t = \phi y_{t-1} + \varepsilon_t" />{' '}
            can be written as:
          </p>
          <BlockMath math="\alpha_t = y_t, \quad T = \phi, \quad Z = 1, \quad H = 0, \quad Q = \sigma^2" />
          <p className="text-gray-700 mb-3 text-sm">
            More generally, an ARMA(p,q) can be put in companion form with state dimension
            <InlineMath math="\max(p, q+1)" />. This unification means that the Kalman filter
            can handle missing observations, irregular sampling, and mixed-frequency data
            — all problems that are difficult for conventional ARIMA estimation.
          </p>
        </section>

        <ExampleBlock title="Local Level Model for Temperature Anomaly Tracking">
          <p className="text-gray-700 mb-3">
            The local level model is the simplest structural time series model. The true
            underlying level <InlineMath math="\mu_t" /> follows a random walk, and each
            observation adds independent measurement noise:
          </p>
          <BlockMath math="y_t = \mu_t + \varepsilon_t, \quad \varepsilon_t \sim \mathcal{N}(0, \sigma_\varepsilon^2)" />
          <BlockMath math="\mu_t = \mu_{t-1} + \eta_t, \quad \eta_t \sim \mathcal{N}(0, \sigma_\eta^2)" />
          <p className="text-gray-700 mt-3 mb-2">
            The ratio <InlineMath math="q = \sigma_\eta^2 / \sigma_\varepsilon^2" /> (the signal-to-noise
            ratio) controls the degree of smoothing:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>
              <strong>q → 0</strong>: level is nearly constant; filter converges to the overall mean (simple average).
            </li>
            <li>
              <strong>q → ∞</strong>: level changes rapidly; filter converges to the latest observation (naïve forecast).
            </li>
            <li>
              <strong>Intermediate q</strong>: exponential smoothing with discount factor related to q.
            </li>
          </ul>
          <p className="text-gray-700 mt-3 text-sm">
            The local level model is exactly equivalent to simple exponential smoothing
            with the optimal smoothing parameter <InlineMath math="\alpha^* = 1 - (1-K)" />{' '}
            where K is the steady-state Kalman gain.
          </p>
        </ExampleBlock>

        <NoteBlock title="Relationship to Exponential Smoothing">
          The ETS (Error-Trend-Seasonality) family of exponential smoothing models all have
          exact state space representations. This means they can be estimated by maximum
          likelihood via the Kalman filter, enabling proper likelihood-based model comparison
          (AIC, BIC) and statistically correct prediction intervals — advantages that are
          not available for heuristic exponential smoothing without the state space formulation.
        </NoteBlock>

        <WarningBlock title="Diffuse Initialisation and Burn-in">
          The Kalman filter requires an initial state mean <InlineMath math="a_1" /> and
          variance <InlineMath math="P_1" />. For non-stationary components (random walks,
          integrated trends), the initial variance is effectively infinite (diffuse prior).
          The first few filter steps during this burn-in period produce unreliable estimates.
          Statsmodels uses the Durbin-Koopman exact diffuse initialisation which handles this
          properly without discarding observations.
        </WarningBlock>

        <PythonCode
          title="Kalman Filter and State Space Models with statsmodels"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              title: 'Time Series Analysis by State Space Methods (2nd ed.)',
              author: 'Durbin, J. & Koopman, S.J.',
              year: 2012,
              url: 'https://doi.org/10.1093/acprof:oso/9780199641178.001.0001',
            },
            {
              title: 'A New Approach to Linear Filtering and Prediction Problems',
              author: 'Kalman, R.E.',
              year: 1960,
              url: 'https://doi.org/10.1115/1.3662552',
            },
            {
              title: 'Forecasting: Principles and Practice (3rd ed.) — Chapter 8: Exponential Smoothing',
              author: 'Hyndman, R.J. & Athanasopoulos, G.',
              year: 2021,
              url: 'https://otexts.com/fpp3/expsmooth.html',
            },
            {
              title: 'statsmodels UnobservedComponents documentation',
              author: 'Seabold, S. & Perktold, J.',
              year: 2010,
              url: 'https://www.statsmodels.org/stable/statespace.html',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
