import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

const arimaxCode = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.stats.stattools import durbin_watson
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n = 200

# ── Simulate ARIMAX(1,1,1) with one exogenous variable ────────────────────
# x_t: advertising spend (unit-root process)
x = np.cumsum(np.random.normal(0, 1, n)) + 50

# Errors: ARMA(1,1)
eps   = np.random.normal(0, 1, n)
eta   = np.zeros(n)
for t in range(1, n):
    eta[t] = 0.5 * eta[t-1] + eps[t] - 0.3 * eps[t-1]

# y_t has a unit root: dy_t = 0.4*dx_t + ARMA(1,1) errors
dy = 0.4 * np.diff(x) + np.diff(eta)     # length n-1
y  = np.r_[10.0, 10.0 + np.cumsum(dy)]   # reconstruct levels

dates  = pd.date_range('2006-01', periods=n, freq='MS')
df     = pd.DataFrame({'y': y, 'x': x}, index=dates)
train  = df.iloc[:-24]
test   = df.iloc[-24:]

# ── Fit ARIMAX(1,1,1) with x as exogenous ─────────────────────────────────
model = SARIMAX(
    train['y'],
    exog=train[['x']],
    order=(1, 1, 1),
    trend='n'          # no intercept after differencing
)
fit = model.fit(disp=False)
print(fit.summary())
print(f"\\nDurbin-Watson: {durbin_watson(fit.resid):.3f}")

# ── Forecast 24 months (x assumed known in test set) ──────────────────────
fc     = fit.get_forecast(steps=24, exog=test[['x']])
fc_mu  = fc.predicted_mean
fc_ci  = fc.conf_int()

mae  = np.abs(test['y'] - fc_mu).mean()
rmse = np.sqrt(((test['y'] - fc_mu)**2).mean())
print(f"Test MAE={mae:.3f}  RMSE={rmse:.3f}")

# ── Intervention analysis ──────────────────────────────────────────────────
# Simulate level shift at period 100 and a transient outlier at period 150
y2 = y.copy()
y2[100:] += 8.0           # permanent level shift (step intervention)
y2[150]  += 15.0          # additive outlier (one-off spike)

# Intervention dummies
level_shift = np.zeros(n)
level_shift[100:] = 1.0   # step function

additive_outlier = np.zeros(n)
additive_outlier[150] = 1.0

# Pulse function (temporary step that decays via AR)
pulse = np.zeros(n)
pulse[100] = 1.0  # unit pulse — combined with AR captures ramp-up

X_int = pd.DataFrame({
    'x': x,
    'level_shift': level_shift,
    'outlier_150': additive_outlier
}, index=dates)

model_int = SARIMAX(
    y2,
    exog=X_int,
    order=(1, 1, 1),
    trend='n'
)
fit_int = model_int.fit(disp=False)
print("\\n--- Intervention model ---")
print(fit_int.summary().tables[1])

# ── Transfer function model (distributed-lag interpretation) ──────────────
# Allow x to enter with up to 2 lags by including x_t, x_{t-1}, x_{t-2}
X_tf = pd.DataFrame({
    'x_lag0': x,
    'x_lag1': np.r_[np.nan, x[:-1]],
    'x_lag2': np.r_[np.nan, np.nan, x[:-2]]
}, index=dates).dropna()

y_tf     = pd.Series(y, index=dates).loc[X_tf.index]
model_tf = SARIMAX(y_tf, exog=X_tf, order=(1, 1, 0), trend='n')
fit_tf   = model_tf.fit(disp=False)
print("\\n--- Transfer function (finite lag) ---")
print(fit_tf.summary().tables[1])

# Total effect (long-run multiplier for distributed lag)
b0, b1, b2 = [fit_tf.params[c] for c in ['x_lag0', 'x_lag1', 'x_lag2']]
total_effect = b0 + b1 + b2
print(f"\\nLong-run multiplier: {total_effect:.4f}")
print(f"Immediate effect:     {b0:.4f}")

# ── Plot results ───────────────────────────────────────────────────────────
fig, axes = plt.subplots(2, 1, figsize=(12, 8))
axes[0].plot(train['y'], label='Train')
axes[0].plot(test['y'], label='Actual test', color='black')
axes[0].plot(fc_mu, label='ARIMAX forecast', color='red')
axes[0].fill_between(fc_ci.index, fc_ci.iloc[:,0], fc_ci.iloc[:,1],
                     alpha=0.2, color='red')
axes[0].set_title('ARIMAX(1,1,1) Forecast')
axes[0].legend()

axes[1].plot(dates, y2, label='Observed (with interventions)')
axes[1].axvline(dates[100], color='orange', linestyle='--', label='Level shift')
axes[1].axvline(dates[150], color='purple', linestyle='--', label='Outlier')
axes[1].set_title('Intervention Analysis')
axes[1].legend()
plt.tight_layout()
plt.show()
`;

const references = [
  {
    title: 'Forecasting: Principles and Practice (3rd ed.) — Regression with ARIMA errors',
    author: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/regarima.html'
  },
  {
    title: 'Time Series Analysis (2nd ed.)',
    author: 'Hamilton, J.D.',
    year: 1994,
    url: 'https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis'
  },
  {
    title: 'Transfer Function Models and Cross-Correlation Analysis',
    author: 'Box, G.E.P. & Jenkins, G.M.',
    year: 2015,
    url: 'https://www.wiley.com/en-us/9781118675021'
  },
  {
    title: 'statsmodels SARIMAX',
    author: 'statsmodels contributors',
    year: 2023,
    url: 'https://www.statsmodels.org/stable/generated/statsmodels.tsa.statespace.sarimax.SARIMAX.html'
  }
];

export default function ARIMAX() {
  const [activeTab, setActiveTab] = useState('arimax');

  return (
    <SectionLayout
      title="ARIMAX and Transfer Functions"
      difficulty="advanced"
      readingTime={14}
    >
      <p>
        ARIMA models capture the internal dynamics of a single time series but cannot exploit
        information from related series or known external drivers. <strong>ARIMAX</strong> extends
        ARIMA by including exogenous input variables, making it one of the most practical tools
        in applied forecasting. <strong>Transfer function models</strong> further generalise this
        by allowing the exogenous input to enter with a rich lag structure and its own filter.
      </p>

      <DefinitionBlock term="ARIMAX Model">
        An ARIMAX(<InlineMath math="p,d,q" />) model regresses the (possibly differenced) series
        on exogenous variables and ARMA errors:
        <BlockMath math="\phi(B)(1-B)^d y_t = \sum_{j=1}^{k} \delta_j x_{j,t} + \theta(B)\varepsilon_t" />
        where <InlineMath math="\phi(B) = 1 - \phi_1 B - \cdots - \phi_p B^p" /> is the AR
        polynomial, <InlineMath math="\theta(B) = 1 + \theta_1 B + \cdots + \theta_q B^q" /> is
        the MA polynomial, <InlineMath math="x_{j,t}" /> are exogenous predictors, and{' '}
        <InlineMath math="\varepsilon_t \sim \text{WN}(0,\sigma^2)" />.
      </DefinitionBlock>

      <WarningBlock title="ARIMAX vs Regression with ARIMA Errors">
        There are two distinct interpretations:
        <ul>
          <li>
            <strong>True ARIMAX:</strong> the AR polynomial <InlineMath math="\phi(B)" /> is
            applied to <em>both</em> <InlineMath math="y_t" /> and <InlineMath math="x_{j,t}" />.
            This means the model equation above filters the exogenous variables through the same
            AR operator.
          </li>
          <li>
            <strong>Regression with ARIMA errors:</strong>{' '}
            <InlineMath math="y_t = \boldsymbol{x}_t'\boldsymbol{\beta} + \eta_t" /> where only
            the error <InlineMath math="\eta_t" /> follows ARIMA. The exogenous variables are
            unfiltered.
          </li>
        </ul>
        statsmodels <code>SARIMAX</code> implements <em>regression with ARIMA errors</em> (the
        second form), which is the standard interpretation in modern forecasting practice.
      </WarningBlock>

      <h2>Transfer Function Models</h2>
      <p>
        A transfer function model (also called a dynamic regression or distributed-lag ARIMA model)
        allows the exogenous input <InlineMath math="x_t" /> to affect{' '}
        <InlineMath math="y_t" /> through a rational transfer function — an infinite distributed lag
        parameterised parsimoniously:
      </p>
      <BlockMath math="y_t = \frac{\omega(B)}{\delta(B)} x_{t-b} + \frac{\theta(B)}{\phi(B)}\varepsilon_t" />
      <p>where:</p>
      <ul>
        <li>
          <InlineMath math="b \geq 0" /> is the <strong>pure delay</strong> (number of periods
          before <InlineMath math="x_t" /> first affects <InlineMath math="y_t" />)
        </li>
        <li>
          <InlineMath math="\omega(B) = \omega_0 - \omega_1 B - \cdots - \omega_s B^s" /> is the
          <strong>numerator polynomial</strong> (immediate impact shape)
        </li>
        <li>
          <InlineMath math="\delta(B) = 1 - \delta_1 B - \cdots - \delta_r B^r" /> is the
          <strong>denominator polynomial</strong> (generates geometric decay in the lag weights)
        </li>
      </ul>

      <NoteBlock title="Impulse Response Function">
        The sequence of coefficients on <InlineMath math="x_{t}, x_{t-1}, x_{t-2}, \ldots" /> is
        called the <strong>impulse response function</strong> or transfer function weights{' '}
        <InlineMath math="\nu_j" />. For a stable transfer function:
        <BlockMath math="\nu(B) = \frac{\omega(B)}{\delta(B)} = \sum_{j=b}^{\infty} \nu_j B^j" />
        A first-order denominator <InlineMath math="\delta(B) = 1 - \delta_1 B" /> generates
        geometric decay: <InlineMath math="\nu_j = \omega_0 \delta_1^{j-b}" />.
      </NoteBlock>

      <div style={{ margin: '1.5rem 0' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0' }}>
          {['arimax', 'transfer', 'intervention'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.5rem 1.25rem',
                background: activeTab === tab ? '#3b82f6' : 'transparent',
                color: activeTab === tab ? 'white' : '#374151',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                borderRadius: '4px 4px 0 0'
              }}
            >
              {tab === 'arimax' ? 'ARIMAX' : tab === 'transfer' ? 'Transfer Functions' : 'Interventions'}
            </button>
          ))}
        </div>

        {activeTab === 'arimax' && (
          <div>
            <p><strong>Standard ARIMAX workflow:</strong></p>
            <ol>
              <li>Test <InlineMath math="y_t" /> and each <InlineMath math="x_{j,t}" /> for unit roots separately.</li>
              <li>If both are I(1), test for cointegration before differencing (see Cointegration section).</li>
              <li>Choose differencing order <InlineMath math="d" /> (usually 0 or 1).</li>
              <li>Select <InlineMath math="(p, q)" /> by AIC/BIC or inspecting ACF/PACF of differenced residuals.</li>
              <li>Validate residuals: Ljung-Box, normality, heteroskedasticity.</li>
            </ol>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div>
            <p><strong>Transfer function identification (Box-Jenkins procedure):</strong></p>
            <ol>
              <li>Prewhiten <InlineMath math="x_t" /> by fitting an ARIMA model: <InlineMath math="\alpha(B)x_t = \varepsilon_t^x" />.</li>
              <li>Apply the same filter to <InlineMath math="y_t" />: <InlineMath math="\alpha(B)y_t = \beta_t" />.</li>
              <li>Compute the cross-correlation function (CCF) between <InlineMath math="\varepsilon_t^x" /> and <InlineMath math="\beta_t" />. Significant lags identify the delay <InlineMath math="b" /> and the order <InlineMath math="(r, s)" />.</li>
              <li>Estimate the full model and check residuals.</li>
            </ol>
          </div>
        )}

        {activeTab === 'intervention' && (
          <div>
            <p><strong>Intervention analysis models structural breaks as dummy variables:</strong></p>
            <ul>
              <li><strong>Additive outlier (AO):</strong> a single-period spike. Dummy = 1 at time <InlineMath math="T" />, 0 elsewhere.</li>
              <li><strong>Level shift (LS):</strong> permanent step change. Dummy = 0 before <InlineMath math="T" />, 1 from <InlineMath math="T" /> onwards.</li>
              <li><strong>Temporary change (TC):</strong> initial spike that decays geometrically. Dummy filtered by <InlineMath math="1/(1 - \omega B)" />.</li>
              <li><strong>Innovational outlier (IO):</strong> shock propagated through the ARMA filter — equivalent to a pulse in the noise process.</li>
            </ul>
          </div>
        )}
      </div>

      <h2>Long-Run Multiplier</h2>
      <p>
        For a distributed-lag model, the <strong>long-run multiplier</strong> (total cumulative
        effect of a permanent unit increase in <InlineMath math="x_t" />) is:
      </p>
      <BlockMath math="\text{LRM} = \sum_{j=0}^{\infty} \nu_j = \frac{\omega(1)}{\delta(1)}" />
      <p>
        where <InlineMath math="\nu(1)" /> means the polynomial evaluated at <InlineMath math="B=1" />.
        For a simple ARIMAX with instantaneous effect <InlineMath math="\delta" /> and AR(1) error
        with coefficient <InlineMath math="\phi" />, the long-run multiplier is{' '}
        <InlineMath math="\delta / (1 - \phi)" />.
      </p>

      <ExampleBlock title="Advertising and Sales: Transfer Function">
        A manufacturer wants to model how advertising spend <InlineMath math="x_t" /> affects
        monthly sales <InlineMath math="y_t" />. Cross-correlation analysis after prewhitening
        shows significant CCF at lags 0, 1, and 2, suggesting a finite distributed lag of order 2.
        <br /><br />
        The fitted model estimates <InlineMath math="\hat\nu_0 = 0.40" />,{' '}
        <InlineMath math="\hat\nu_1 = 0.25" />, <InlineMath math="\hat\nu_2 = 0.12" /> with
        ARMA(1,0) errors. The immediate effect of an extra £1 of advertising is 40p in sales; the
        long-run multiplier is <InlineMath math="0.40 + 0.25 + 0.12 = 0.77" /> — every extra £1
        generates £0.77 in total sales over three months.
      </ExampleBlock>

      <h2>Stationarity Requirements</h2>
      <p>
        The properties of ARIMAX depend critically on the integration orders of the variables.
        Three cases arise:
      </p>

      <TheoremBlock
        title="Integration and Spurious Regression"
        proof="If y_t ~ I(1) and x_t ~ I(0), regressing y on x will generally find no long-run relationship. If both are I(1) but not cointegrated, standard OLS t-statistics are asymptotically invalid. Only when both are I(1) and cointegrated does a levels regression produce super-consistent estimates."
      >
        <ul>
          <li><strong>Both I(0):</strong> Standard ARIMAX in levels is valid.</li>
          <li><strong>Both I(1), not cointegrated:</strong> Difference both before regression to avoid spurious results.</li>
          <li><strong>Both I(1) and cointegrated:</strong> A levels ARIMAX (or VECM) is appropriate and gives super-consistent coefficient estimates.</li>
        </ul>
      </TheoremBlock>

      <WarningBlock title="Exogenous Variable Assumption">
        ARIMAX assumes <InlineMath math="x_t" /> is <em>strictly exogenous</em>: current and future
        errors do not cause changes in <InlineMath math="x" />. This fails in many economic
        applications (e.g., advertising and sales are jointly determined). In such cases, use a VAR
        or IV methods. Granger causality tests (see the Granger Causality section) can inform this
        judgment.
      </WarningBlock>

      <PythonCode code={arimaxCode} title="ARIMAX, Transfer Functions, and Intervention Analysis" />

      <h2>Summary</h2>
      <ul>
        <li>
          ARIMAX extends ARIMA with exogenous predictors, combining the ARMA noise structure with
          regression on external drivers.
        </li>
        <li>
          Transfer function models allow a rich, parsimoniously parameterised lag structure for how
          inputs flow through to outputs, characterised by the impulse response function.
        </li>
        <li>
          Intervention analysis uses dummy variables to model structural breaks: additive outliers,
          level shifts, and temporary changes.
        </li>
        <li>
          The integration order of all variables must be checked before fitting; spurious regression
          is a real risk when mixing I(0) and I(1) series.
        </li>
        <li>
          In Python, statsmodels <code>SARIMAX</code> handles all variants via the <code>exog</code>{' '}
          argument.
        </li>
      </ul>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
