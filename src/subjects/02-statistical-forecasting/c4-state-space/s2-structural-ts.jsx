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

// ── Simulation helpers ────────────────────────────────────────────────────
function lcgRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = Math.imul(s, 1664525) + 1013904223;
    return ((s >>> 0) / 0xffffffff) * 2 - 1;
  };
}

function boxMuller(rng) {
  const u1 = Math.max((rng() + 1) / 2, 1e-9);
  const u2 = (rng() + 1) / 2;
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// Simulate BSM: level + trend + seasonality (dummy, period 12)
function simulateBSM({ sigLevel, sigSlope, sigSeas, sigObs, n = 96, m = 12 }) {
  const rng = lcgRng(42);
  const G = () => boxMuller(rng);

  const mu = new Array(n + 1).fill(0);  // level
  const nu = new Array(n + 1).fill(0);  // slope
  const gam = Array.from({ length: n + 1 }, () => new Array(m).fill(0)); // seasonal
  const y = new Array(n).fill(0);       // observations

  mu[0] = 10;
  nu[0] = 0.1;
  // initialise seasonal (sum to ~0)
  for (let j = 0; j < m; j++) gam[0][j] = 2 * Math.sin(2 * Math.PI * j / m);

  for (let t = 0; t < n; t++) {
    // seasonal component: first element is gamma_t
    const seasT = gam[t][0];

    // observation
    y[t] = Math.round((mu[t] + seasT + G() * sigObs) * 100) / 100;

    // state transitions
    mu[t + 1] = mu[t] + nu[t] + G() * sigLevel;
    nu[t + 1] = nu[t] + G() * sigSlope;

    // seasonal transition (rotate dummy variables)
    const newGam0 = -gam[t].slice(0, m - 1).reduce((a, b) => a + b, 0) + G() * sigSeas;
    gam[t + 1] = [newGam0, ...gam[t].slice(0, m - 1)];
  }

  const levelArr = mu.slice(0, n).map((v, i) => ({
    t: i,
    observed: y[i],
    level: Math.round(v * 100) / 100,
    trend: Math.round(nu[i] * 1000) / 1000,
    seasonal: Math.round(gam[i][0] * 100) / 100,
  }));

  return levelArr;
}

const PARAM_PRESETS = {
  smoothTrend: { sigLevel: 0.1, sigSlope: 0.02, sigSeas: 0.05, sigObs: 0.8, label: 'Smooth trend' },
  volatileTrend: { sigLevel: 0.5, sigSlope: 0.15, sigSeas: 0.05, sigObs: 0.8, label: 'Volatile trend' },
  strongSeas: { sigLevel: 0.1, sigSlope: 0.02, sigSeas: 0.3, sigObs: 0.8, label: 'Evolving seasonality' },
  highNoise: { sigLevel: 0.1, sigSlope: 0.02, sigSeas: 0.05, sigObs: 2.5, label: 'High observation noise' },
};

function BSMViz() {
  const [preset, setPreset] = useState('smoothTrend');
  const [component, setComponent] = useState('observed');

  const params = PARAM_PRESETS[preset];
  const data = simulateBSM(params);

  const COMP_COLORS = {
    observed: '#94a3b8',
    level: '#0284c7',
    seasonal: '#16a34a',
    trend: '#d97706',
  };
  const COMP_LABELS = {
    observed: 'Observed y_t',
    level: 'Level μ_t',
    seasonal: 'Seasonal γ_t',
    trend: 'Slope ν_t',
  };

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5 space-y-4">
      <h3 className="text-lg font-semibold text-sky-900 mb-1">
        Interactive: Basic Structural Model Components
      </h3>
      <p className="text-sm text-sky-700">
        Select a noise configuration and explore each structural component of the BSM.
      </p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(PARAM_PRESETS).map(([key, { label }]) => (
          <button key={key} onClick={() => setPreset(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${preset === key ? 'bg-sky-600 text-white' : 'bg-white border border-sky-200 text-sky-700'}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {Object.keys(COMP_COLORS).map(k => (
          <button key={k} onClick={() => setComponent(k)}
            className={`px-3 py-1 rounded text-xs font-medium border ${component === k ? 'text-white border-transparent' : 'bg-white text-sky-700 border-sky-200'}`}
            style={component === k ? { backgroundColor: COMP_COLORS[k] } : {}}>
            {COMP_LABELS[k]}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis dataKey="t" tick={{ fontSize: 10 }} />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
          <Tooltip formatter={v => [v, COMP_LABELS[component]]} />
          <Line type="monotone" dataKey={component} stroke={COMP_COLORS[component]}
            strokeWidth={component === 'observed' ? 1 : 2} dot={false} name={COMP_LABELS[component]} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-sky-500 text-center">
        σ_level={params.sigLevel}, σ_slope={params.sigSlope}, σ_seas={params.sigSeas},
        σ_obs={params.sigObs} — m=12 (monthly seasonality)
      </p>
    </div>
  );
}

const PYTHON_CODE = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.structural import UnobservedComponents

# ─── Load airline data as running example ────────────────────────────────────
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
df = pd.read_csv(url, index_col=0, parse_dates=True)
df.columns = ['passengers']
df.index.freq = 'MS'
y = np.log(df['passengers'])   # log-transform for additive decomposition

# ─── 1. Local Level Model ─────────────────────────────────────────────────────
# y_t = mu_t + eps_t,   eps_t ~ N(0, sigma_eps^2)
# mu_t = mu_{t-1} + eta_t, eta_t ~ N(0, sigma_eta^2)
model_ll = UnobservedComponents(y, level='local level')
result_ll = model_ll.fit(disp=False)
print("Local Level Model:")
print(f"  sigma_obs = {np.sqrt(result_ll.params[0]):.4f}")
print(f"  sigma_level = {np.sqrt(result_ll.params[1]):.4f}")
print(f"  AIC = {result_ll.aic:.2f}")

# ─── 2. Local Linear Trend Model ──────────────────────────────────────────────
# y_t = mu_t + eps_t
# mu_t = mu_{t-1} + nu_{t-1} + eta_t    (level with slope)
# nu_t = nu_{t-1} + zeta_t              (slope follows random walk)
model_llt = UnobservedComponents(y, level='local linear trend')
result_llt = model_llt.fit(disp=False)
print("\\nLocal Linear Trend Model:")
print(result_llt.summary())

# ─── 3. Basic Structural Model (BSM) ──────────────────────────────────────────
# Adds trigonometric or dummy seasonal component
model_bsm = UnobservedComponents(
    y,
    level='local linear trend',
    seasonal=12,         # 12-period dummy seasonality
    freq_seasonal=None,  # use dummy seasonality
)
result_bsm = model_bsm.fit(disp=False)
print("\\nBasic Structural Model:")
print(result_bsm.summary())
print(f"\\nAIC comparison:")
print(f"  Local level:       {result_ll.aic:.2f}")
print(f"  Local linear trend:{result_llt.aic:.2f}")
print(f"  BSM:               {result_bsm.aic:.2f}")

# ─── 4. Extract and plot components ──────────────────────────────────────────
fig = result_bsm.plot_components(figsize=(14, 10))
fig.suptitle('BSM Decomposition: Log Airline Passengers', y=1.01, fontsize=13)
plt.tight_layout()
plt.show()

# ─── 5. Forecast 24 months ahead ─────────────────────────────────────────────
forecast = result_bsm.get_forecast(steps=24)
forecast_mean = forecast.predicted_mean
forecast_ci = forecast.conf_int(alpha=0.05)

fig2, ax = plt.subplots(figsize=(14, 5))
y.plot(ax=ax, label='Log passengers (actual)', color='steelblue')
forecast_mean.plot(ax=ax, label='24-month forecast', color='red')
ax.fill_between(forecast_ci.index,
                forecast_ci.iloc[:, 0], forecast_ci.iloc[:, 1],
                alpha=0.2, color='red', label='95% PI')
ax.set_title('BSM 24-month Forecast')
ax.legend()
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()

# ─── 6. Trigonometric seasonality variant ────────────────────────────────────
# Harvey's stochastic trigonometric seasonality — more parsimonious
# Each harmonic has its own variance; seasonal pattern evolves smoothly
model_trig = UnobservedComponents(
    y,
    level='local linear trend',
    freq_seasonal=[{'period': 12, 'harmonics': 4}],  # 4 harmonics
)
result_trig = model_trig.fit(disp=False)
print(f"\\nTrigonometric seasonality (4 harmonics) AIC: {result_trig.aic:.2f}")
print(f"BSM dummy seasonality AIC:                  {result_bsm.aic:.2f}")
`;

export default function StructuralTimeSeriesSection() {
  return (
    <SectionLayout
      title="Structural Time Series Models"
      difficulty="advanced"
      readingTime={12}
      prerequisites={['State Space Models', 'ARIMA Models']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Structural time series models (also called unobserved components models) decompose
            an observed time series into interpretable components — trend, slope, seasonality,
            and regression effects — each with its own stochastic dynamics. Unlike the purely
            statistical ARIMA approach, structural models are built from economic or physical
            reasoning about the data-generating process. Each component is an unobserved
            state variable estimated via the Kalman filter.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            The canonical example is Harvey's Basic Structural Model (BSM), which decomposes
            a series as:
          </p>
          <BlockMath math="y_t = \mu_t + \gamma_t + \varepsilon_t" />
          <p className="text-sm text-gray-600">
            where <InlineMath math="\mu_t" /> is the trend/level component,{' '}
            <InlineMath math="\gamma_t" /> is the seasonal component, and{' '}
            <InlineMath math="\varepsilon_t" /> is observation noise.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">The Local Level Model</h2>
          <p className="text-gray-700 mb-3">
            The simplest structural model. The level evolves as a random walk; each observation
            adds independent measurement noise.
          </p>

          <DefinitionBlock term="Local Level Model">
            <p className="mb-1"><strong>Observation equation:</strong></p>
            <BlockMath math="y_t = \mu_t + \varepsilon_t, \quad \varepsilon_t \overset{iid}{\sim} \mathcal{N}(0,\, \sigma_\varepsilon^2)" />
            <p className="mb-1 mt-2"><strong>State (level) equation:</strong></p>
            <BlockMath math="\mu_t = \mu_{t-1} + \eta_t, \quad \eta_t \overset{iid}{\sim} \mathcal{N}(0,\, \sigma_\eta^2)" />
            <p className="mt-2 text-sm">
              The level <InlineMath math="\mu_t" /> is the "true" underlying value of the series,
              estimated as a random walk. The signal-to-noise ratio{' '}
              <InlineMath math="q = \sigma_\eta^2 / \sigma_\varepsilon^2" /> controls the
              smoothness of the estimated trend — equivalent to the exponential smoothing
              parameter.
            </p>
          </DefinitionBlock>

          <NoteBlock title="Equivalence to Simple Exponential Smoothing">
            The local level model is exactly equivalent to simple exponential smoothing (SES).
            The steady-state Kalman gain <InlineMath math="K^*" /> satisfies{' '}
            <InlineMath math="K^* = \alpha" /> (the SES smoothing parameter). Therefore,
            fitting the local level model by maximum likelihood produces the optimal SES
            smoothing parameter automatically, with no manual tuning required.
          </NoteBlock>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">The Local Linear Trend Model</h2>
          <p className="text-gray-700 mb-3">
            Extends the local level model by adding a stochastic slope (drift). Both the
            level and the slope can change over time.
          </p>

          <DefinitionBlock term="Local Linear Trend (LLT) Model">
            <p className="mb-1"><strong>Observation equation:</strong></p>
            <BlockMath math="y_t = \mu_t + \varepsilon_t, \quad \varepsilon_t \sim \mathcal{N}(0, \sigma_\varepsilon^2)" />
            <p className="mb-1 mt-2"><strong>Level equation:</strong></p>
            <BlockMath math="\mu_t = \mu_{t-1} + \nu_{t-1} + \eta_t, \quad \eta_t \sim \mathcal{N}(0, \sigma_\eta^2)" />
            <p className="mb-1 mt-2"><strong>Slope equation:</strong></p>
            <BlockMath math="\nu_t = \nu_{t-1} + \zeta_t, \quad \zeta_t \sim \mathcal{N}(0, \sigma_\zeta^2)" />
            <p className="mt-2 text-sm">
              The slope <InlineMath math="\nu_t" /> represents the local growth rate of the
              series. When <InlineMath math="\sigma_\zeta^2 = 0" />, the slope is constant
              (deterministic linear trend). When <InlineMath math="\sigma_\eta^2 = 0" /> and{' '}
              <InlineMath math="\sigma_\zeta^2 > 0" />, the model becomes the integrated
              random walk (smooth trend model).
            </p>
          </DefinitionBlock>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-100">
                  <th className="border border-sky-200 px-3 py-2">Constraint</th>
                  <th className="border border-sky-200 px-3 py-2">Resulting model</th>
                  <th className="border border-sky-200 px-3 py-2">Equivalent to</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['σ_ζ = 0, σ_η > 0', 'Level + fixed slope', 'Holt linear with fixed trend (β = 0)'],
                  ['σ_η = 0, σ_ζ > 0', 'Integrated random walk (smooth trend)', 'Holt-Winters with damped slope'],
                  ['σ_η > 0, σ_ζ > 0', 'Full LLT (stochastic trend + stochastic slope)', 'Holts linear exponential smoothing'],
                  ['σ_η = σ_ζ = 0', 'Deterministic linear trend', 'OLS linear regression on time'],
                ].map(([constraint, model, equiv]) => (
                  <tr key={constraint} className="border-b border-sky-100 hover:bg-sky-50">
                    <td className="border border-sky-200 px-3 py-2 font-mono text-sky-700 text-xs">{constraint}</td>
                    <td className="border border-sky-200 px-3 py-2">{model}</td>
                    <td className="border border-sky-200 px-3 py-2">{equiv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Seasonal Components</h2>
          <p className="text-gray-700 mb-3">
            Structural seasonality is modelled as a latent component that sums to approximately
            zero over one complete cycle. Two main approaches exist:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h4 className="font-semibold text-emerald-900 mb-2">Dummy Variable Seasonality</h4>
              <p className="text-sm text-emerald-800 mb-2">
                Maintains <InlineMath math="m-1" /> seasonal dummies that rotate each period.
                The constraint that the seasonal effects sum to zero ensures identifiability.
              </p>
              <BlockMath math="\gamma_t = -\sum_{j=1}^{m-1} \gamma_{t-j} + \omega_t, \quad \omega_t \sim \mathcal{N}(0, \sigma_\omega^2)" />
              <p className="text-xs text-emerald-700 mt-1">
                Uses m−1 state variables. Most flexible; allows each season to evolve independently.
              </p>
            </div>
            <div className="rounded-lg border border-violet-200 bg-violet-50 p-4">
              <h4 className="font-semibold text-violet-900 mb-2">Trigonometric (Harvey) Seasonality</h4>
              <p className="text-sm text-violet-800 mb-2">
                Decomposes seasonality into <InlineMath math="\lfloor m/2 \rfloor" /> harmonics.
                Each harmonic pair <InlineMath math="(\kappa_j^*, \kappa_j)" /> evolves as
                a stochastic cycle.
              </p>
              <BlockMath math="\gamma_t = \sum_{j=1}^{\lfloor m/2 \rfloor} \gamma_{j,t}" />
              <p className="text-xs text-violet-700 mt-1">
                More parsimonious. Smooth seasonal patterns. Can select number of harmonics by AIC.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">The Basic Structural Model (BSM)</h2>

          <DefinitionBlock term="Basic Structural Model (Harvey, 1989)">
            The BSM combines a local linear trend with dummy seasonality and observation noise:
            <BlockMath math="y_t = \underbrace{\mu_t}_{\text{level}} + \underbrace{\gamma_t}_{\text{seasonal}} + \underbrace{\varepsilon_t}_{\text{irregular}}" />
            where <InlineMath math="\mu_t" /> follows the LLT equations and{' '}
            <InlineMath math="\gamma_t" /> follows the dummy seasonal recursion.
            The model has four variance parameters:{' '}
            <InlineMath math="\sigma_\varepsilon^2, \sigma_\eta^2, \sigma_\zeta^2, \sigma_\omega^2" />.
            Restricting any of these to zero yields nested models that can be compared via
            likelihood ratio tests or information criteria.
          </DefinitionBlock>

          <p className="text-gray-700 mt-3 text-sm">
            The BSM generalises the classical additive decomposition (trend + season + residual)
            by making all components stochastic and estimating them simultaneously via the
            Kalman filter — rather than applying sequential moving average smoothing as in
            X-11 or STL decompositions.
          </p>
        </section>

        <BSMViz />

        <TheoremBlock title="Forecasting from Structural Models">
          <p>
            For an h-step-ahead forecast from the BSM, the predicted observation is:
          </p>
          <BlockMath math="\hat{y}_{T+h|T} = Z \cdot a_{T+h|T}" />
          <p className="mt-2">
            where <InlineMath math="a_{T+h|T} = T^h a_{T|T}" /> is obtained by iterating the
            state transition equation forward h steps. The forecast variance grows with h
            because both level and slope uncertainty accumulate:
          </p>
          <BlockMath math="\mathrm{Var}(\hat{y}_{T+h|T}) \approx \sigma_\varepsilon^2 + h^2 \sigma_\zeta^2 + h \sigma_\eta^2" />
          <p className="mt-2 text-sm">
            This gives prediction intervals that widen at rate <InlineMath math="O(h)" /> for
            the local level model and at rate <InlineMath math="O(h^{3/2})" /> for the LLT
            model — appropriate widening for trending series.
          </p>
        </TheoremBlock>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Adding Regression Effects</h2>
          <p className="text-gray-700 mb-3">
            Structural models extend naturally to include observed covariates (regression terms),
            creating a dynamic regression in state space form:
          </p>
          <BlockMath math="y_t = \mu_t + \gamma_t + \mathbf{x}_t^\top \boldsymbol{\beta}_t + \varepsilon_t" />
          <p className="text-gray-700 text-sm mb-3">
            where <InlineMath math="\boldsymbol{\beta}_t" /> may be time-varying (stochastic
            regression coefficients that follow random walks) or fixed. Time-varying regression
            allows the model to capture changing structural relationships — for example, a
            price elasticity that shifts over time.
          </p>
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm">
            <h4 className="font-semibold text-sky-900 mb-2">Common extensions in practice</h4>
            <ul className="space-y-1 list-disc list-inside text-sky-800">
              <li>
                <strong>Intervention effects:</strong> pulse and step dummies for known shocks
                (policy changes, outliers).
              </li>
              <li>
                <strong>Calendar effects:</strong> trading-day and holiday regressors for daily
                or weekly data.
              </li>
              <li>
                <strong>Transfer functions:</strong> lagged external regressors (leading indicators)
                included as fixed covariates.
              </li>
              <li>
                <strong>Time-varying parameters:</strong> allowing regression coefficients to
                drift over time, modelling structural breaks gradually.
              </li>
            </ul>
          </div>
        </section>

        <ExampleBlock title="Decomposing Airline Passenger Data with BSM">
          <p className="text-gray-700 mb-3">
            The log-transformed airline passenger series (Box-Jenkins airlines data) provides
            a canonical example for the BSM. After log transformation, the multiplicative
            seasonality becomes additive, making the structural model directly applicable.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>
              <strong>Model selection:</strong> compare local level, LLT, and BSM by AIC.
              The BSM (with 12-period seasonality) gives substantially better fit than
              the non-seasonal models.
            </li>
            <li>
              <strong>Estimated variances:</strong> the MLE finds that{' '}
              <InlineMath math="\hat{\sigma}_\zeta^2 \approx 0" /> (nearly deterministic slope),
              while <InlineMath math="\hat{\sigma}_\omega^2 > 0" /> (seasonal pattern evolves
              slightly over time).
            </li>
            <li>
              <strong>Components:</strong> the trend smoothly captures the exponential growth,
              the seasonal component is approximately stable with slight amplitude changes,
              and the irregular is small relative to the signal.
            </li>
            <li>
              <strong>Forecasting:</strong> the 24-month forecast appropriately continues the
              upward trend with growing prediction intervals driven by level uncertainty.
            </li>
          </ol>
        </ExampleBlock>

        <WarningBlock title="Identifiability: Variance Floor and Zero Constraints">
          When estimating BSM variance components, it is common for some estimates to hit
          zero — the optimiser cannot distinguish a truly zero variance from a very small one.
          Zero variances degenerate the corresponding component to a deterministic function.
          For example, <InlineMath math="\hat{\sigma}_\zeta^2 = 0" /> means the slope is
          effectively fixed at its initial value. Always check whether variance constraints
          are meaningful given the data, and compare AIC between constrained and unconstrained
          versions using likelihood ratio tests.
        </WarningBlock>

        <PythonCode
          title="Structural Time Series Models with statsmodels UnobservedComponents"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              title: 'Forecasting, Structural Time Series Models and the Kalman Filter',
              author: 'Harvey, A.C.',
              year: 1989,
              url: 'https://www.cambridge.org/core/books/forecasting-structural-time-series-models-and-the-kalman-filter/CE5E112570A56960601760E786D5C4DC',
            },
            {
              title: 'Time Series Analysis by State Space Methods (2nd ed.)',
              author: 'Durbin, J. & Koopman, S.J.',
              year: 2012,
              url: 'https://doi.org/10.1093/acprof:oso/9780199641178.001.0001',
            },
            {
              title: 'statsmodels UnobservedComponents: Structural Time Series',
              author: 'Fulton, C.',
              year: 2015,
              url: 'https://www.statsmodels.org/stable/generated/statsmodels.tsa.statespace.structural.UnobservedComponents.html',
            },
            {
              title: 'Forecasting: Principles and Practice (3rd ed.) — Chapter 8: ETS Models',
              author: 'Hyndman, R.J. & Athanasopoulos, G.',
              year: 2021,
              url: 'https://otexts.com/fpp3/ets.html',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
