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

const dynamicHarmonicCode = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX
import itertools
import warnings
warnings.filterwarnings('ignore')

# ── Synthetic weekly data: trend + annual Fourier + AR(2) errors ───────────
np.random.seed(0)
n = 260         # 5 years of weekly data
m = 52          # annual period in weeks
t = np.arange(1, n + 1)

# Build true signal
trend  = 0.03 * t
f1     = 4.0 * np.sin(2 * np.pi * t / m) + 3.0 * np.cos(2 * np.pi * t / m)
f2     = 1.5 * np.sin(4 * np.pi * t / m) + 0.8 * np.cos(4 * np.pi * t / m)

# AR(2) errors
errors = np.zeros(n)
eps    = np.random.normal(0, 1, n)
for i in range(2, n):
    errors[i] = 0.6 * errors[i-1] - 0.2 * errors[i-2] + eps[i]

y = 50 + trend + f1 + f2 + errors

dates  = pd.date_range('2019-01-07', periods=n, freq='W-MON')
series = pd.Series(y, index=dates)
train  = series[:-26]   # hold out last 6 months
test   = series[-26:]

# ── Fourier feature builder ────────────────────────────────────────────────
def fourier_terms(t_arr, period, K):
    cols = {}
    for k in range(1, K + 1):
        cols[f's{k}'] = np.sin(2 * np.pi * k * t_arr / period)
        cols[f'c{k}'] = np.cos(2 * np.pi * k * t_arr / period)
    return pd.DataFrame(cols)

# ── Grid search over K and ARIMA order ────────────────────────────────────
# We fix d=0 (series is stationary after removing trend via regressor)
# and search p in {0,1,2}, q in {0,1,2}, K in {1,2,3,4}
results = []
t_train = t[:len(train)]

for K in range(1, 5):
    for p, q in itertools.product(range(3), range(3)):
        try:
            X = fourier_terms(t_train, m, K)
            X['trend'] = t_train
            X.index = train.index
            fit = SARIMAX(train, exog=X, order=(p, 0, q), trend='c').fit(disp=False)
            results.append({'K': K, 'p': p, 'q': q,
                            'AIC': fit.aic, 'BIC': fit.bic})
        except Exception:
            pass

results_df = pd.DataFrame(results).sort_values('AIC')
print("Top 5 models by AIC:")
print(results_df.head())

# ── Best model fit and forecast ────────────────────────────────────────────
best = results_df.iloc[0]
K_best, p_best, q_best = int(best.K), int(best.p), int(best.q)
print(f"\\nBest: K={K_best}, ARIMA({p_best},0,{q_best})")

X_train = fourier_terms(t_train, m, K_best)
X_train['trend'] = t_train
X_train.index = train.index

final_fit = SARIMAX(train, exog=X_train, order=(p_best, 0, q_best),
                    trend='c').fit(disp=False)
print(final_fit.summary())

# Forecast
h = len(test)
t_fc = t[len(train):]
X_fc = fourier_terms(t_fc, m, K_best)
X_fc['trend'] = t_fc
X_fc.index = test.index

fc     = final_fit.get_forecast(steps=h, exog=X_fc)
fc_mu  = fc.predicted_mean
fc_ci  = fc.conf_int()

# Evaluation
mae  = np.abs(test.values - fc_mu.values).mean()
rmse = np.sqrt(((test.values - fc_mu.values)**2).mean())
print(f"\\n26-week forecast  MAE={mae:.2f}  RMSE={rmse:.2f}")

# ── Comparison: DHR vs SARIMA ──────────────────────────────────────────────
# SARIMA(1,0,1)(1,1,0)[52] — naive seasonal benchmark
try:
    sarima = SARIMAX(train, order=(1,0,1),
                     seasonal_order=(1,1,0,52)).fit(disp=False)
    sarima_fc = sarima.get_forecast(steps=h).predicted_mean
    sarima_mae = np.abs(test.values - sarima_fc.values).mean()
    print(f"SARIMA benchmark  MAE={sarima_mae:.2f}")
    print(f"DHR improvement:  {(sarima_mae - mae)/sarima_mae*100:.1f}%")
except Exception as e:
    print(f"SARIMA fit failed: {e}")

# ── Plot ───────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(13, 5))
ax.plot(train[-52:], label='Training (last year)')
ax.plot(test, label='Actual', color='black')
ax.plot(fc_mu, label=f'DHR K={K_best} ARIMA({p_best},0,{q_best})', color='red')
ax.fill_between(fc_ci.index, fc_ci.iloc[:, 0], fc_ci.iloc[:, 1],
                alpha=0.2, color='red', label='95% CI')
ax.set_title('Dynamic Harmonic Regression — 26-week forecast')
ax.legend()
plt.tight_layout()
plt.show()
`;

const references = [
  {
    title: 'Forecasting: Principles and Practice (3rd ed.) — Dynamic Harmonic Regression',
    author: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/dynamic-harmonic-regression.html'
  },
  {
    title: 'Regression with ARIMA errors in Python',
    author: 'statsmodels contributors',
    year: 2023,
    url: 'https://www.statsmodels.org/stable/examples/notebooks/generated/statespace_sarimax_stata.html'
  },
  {
    title: 'Time Series Analysis (2nd ed.)',
    author: 'Hamilton, J.D.',
    year: 1994,
    url: 'https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis'
  },
  {
    title: 'pmdarima: ARIMA estimators for Python',
    author: 'Smith, T.G.',
    year: 2023,
    url: 'https://alkaline-ml.com/pmdarima/'
  }
];

export default function DynamicHarmonicRegression() {
  const [showProof, setShowProof] = useState(false);

  return (
    <SectionLayout
      title="Dynamic Harmonic Regression"
      difficulty="intermediate"
      readingTime={10}
    >
      <p>
        The previous section showed how Fourier terms efficiently capture seasonal patterns. In
        practice, however, the residuals from a Fourier regression are almost always autocorrelated
        — price series have momentum, demand series have carry-over effects, and so on.{' '}
        <strong>Dynamic harmonic regression (DHR)</strong> solves this by combining Fourier terms
        with an ARIMA error model, getting the best of both worlds: flexible seasonality and
        proper handling of short-run dynamics.
      </p>

      <DefinitionBlock term="Dynamic Harmonic Regression">
        A dynamic harmonic regression model combines a linear regression on Fourier terms
        (and other regressors) with ARIMA errors:
        <BlockMath math="y_t = \beta_0 + \beta_1 t + \sum_{k=1}^{K}\!\left[\alpha_k \sin\tfrac{2\pi k t}{m} + \gamma_k \cos\tfrac{2\pi k t}{m}\right] + \mathbf{z}_t'\boldsymbol{\delta} + \eta_t" />
        where <InlineMath math="\mathbf{z}_t" /> contains any additional regressors (promotions,
        holidays, etc.) and the error term <InlineMath math="\eta_t" /> follows an ARIMA process:
        <BlockMath math="\phi(B)(1 - B)^d\,\eta_t = \theta(B)\,\varepsilon_t, \quad \varepsilon_t \sim \text{WN}(0, \sigma^2)" />
      </DefinitionBlock>

      <h2>Why Not Use SARIMA Instead?</h2>
      <p>
        A natural question: why use DHR when SARIMA already handles seasonality through seasonal
        differencing and seasonal AR/MA terms? There are several important reasons:
      </p>
      <ul>
        <li>
          <strong>Long seasonal periods:</strong> SARIMA requires estimating{' '}
          <InlineMath math="m" /> parameters per seasonal AR/MA order. For weekly data (m=52)
          that quickly becomes intractable.
        </li>
        <li>
          <strong>Non-integer periods:</strong> SARIMA demands integer <InlineMath math="m" />,
          but Fourier terms work with <InlineMath math="m = 365.25" /> or any real value.
        </li>
        <li>
          <strong>Multiple seasonalities:</strong> SARIMA handles only one seasonal period;
          DHR easily incorporates multiple Fourier period pairs.
        </li>
        <li>
          <strong>Additional regressors:</strong> External variables (price, weather) plug
          naturally into the regression component of DHR.
        </li>
      </ul>

      <NoteBlock title="DHR vs SARIMAX">
        When the seasonal period is short and integer (e.g., monthly data, m=12), SARIMAX and DHR
        perform comparably and SARIMAX is often simpler to specify. DHR's advantages become
        decisive for weekly, daily, or sub-daily data.
      </NoteBlock>

      <h2>Model Specification and Order Selection</h2>
      <p>
        A DHR model is characterised by three sets of choices: the number of Fourier pairs{' '}
        <InlineMath math="K" />, the ARIMA order <InlineMath math="(p, d, q)" /> for the errors,
        and whether to include seasonal ARIMA terms. The standard workflow is:
      </p>
      <ol>
        <li>
          Determine integration order <InlineMath math="d" /> for the series (ADF / KPSS test).
          Apply differencing if needed before fitting, or use <InlineMath math="d \geq 1" /> in
          the ARIMA error component.
        </li>
        <li>
          Fit DHR models for <InlineMath math="K = 1, 2, \ldots, K_{\max}" /> with various
          <InlineMath math="(p, q)" /> combinations and compare by AIC or AICc.
        </li>
        <li>
          Check residuals of the selected model: the ACF/PACF of residuals should show no
          remaining autocorrelation.
        </li>
      </ol>

      <TheoremBlock
        title="Equivalence at Full K"
        proof="When K = floor(m/2), the Fourier columns span the same column space as m-1 seasonal dummy variables. The ARIMA error component then handles everything not captured by trend + full-seasonal-dummies, which is the same residual as in a regression with seasonal dummies plus ARIMA errors."
      >
        When <InlineMath math="K = \lfloor m/2 \rfloor" />, the DHR model is algebraically
        equivalent to a regression-with-ARIMA-errors model using seasonal dummy variables. DHR
        is strictly more general because it allows intermediate <InlineMath math="K < \lfloor m/2 \rfloor" />.
      </TheoremBlock>

      <h2>ARIMAX with Seasonal Harmonics</h2>
      <p>
        In statsmodels, DHR is implemented via the <code>SARIMAX</code> class with Fourier columns
        passed as <code>exog</code>. This is sometimes called <em>ARIMAX with seasonal harmonics</em>.
        The model is estimated by maximum likelihood using the Kalman filter, which handles the
        ARIMA structure on the error process efficiently.
      </p>
      <p>
        The likelihood of the SARIMAX model for observation <InlineMath math="t" /> is:
      </p>
      <BlockMath math="\ell(\boldsymbol{\theta}) = -\frac{n}{2}\log(2\pi) - \frac{1}{2}\sum_{t=1}^{n}\left[\log F_t + \frac{v_t^2}{F_t}\right]" />
      <p>
        where <InlineMath math="v_t" /> is the one-step-ahead prediction error and{' '}
        <InlineMath math="F_t" /> its variance, both computed by the Kalman filter.
      </p>

      <h2>Forecasting with DHR</h2>
      <p>
        Point forecasts <InlineMath math="h" /> steps ahead are obtained by:
      </p>
      <ol>
        <li>
          Computing the deterministic component: evaluate the Fourier terms at future time indices
          <InlineMath math="t + 1, \ldots, t + h" />.
        </li>
        <li>
          Forecasting the ARIMA error component forward (converges to zero for stationary errors).
        </li>
      </ol>
      <p>
        Forecast intervals account for both the ARIMA error uncertainty and the coefficient
        estimation uncertainty (if the <code>cov_type</code> argument is set appropriately).
      </p>

      <WarningBlock title="Future Exogenous Variables Required">
        Because Fourier terms are computed from the future time index, they are always available
        without additional forecasting. However, any other exogenous variable in{' '}
        <InlineMath math="\mathbf{z}_t" /> (e.g., price, temperature) must be either known in
        advance or separately forecast before calling <code>get_forecast()</code>. Failure to
        provide future exog values will raise an error or silently use zeros.
      </WarningBlock>

      <ExampleBlock title="Weekly Electricity Consumption (5 years, m=52)">
        Consider weekly electricity demand for a utility company. SARIMA(1,0,1)(1,1,0)[52] is
        impractical due to the long seasonal period. Instead, we fit DHR models:
        <br /><br />
        With K=3 Fourier pairs (annual seasonality) and ARIMA(2,0,1) errors, the model uses only
        9 seasonal parameters and 4 ARMA parameters. Grid search across K=1..4 and
        (p,q)=(0..2, 0..2) identifies K=2, ARIMA(2,0,1) as the best by AIC. The 26-week
        out-of-sample MAE is 2.3 GWh, compared to 3.1 GWh for naive seasonal SARIMA — a 26%
        improvement.
      </ExampleBlock>

      <h2>Multiple Seasonal Periods in DHR</h2>
      <p>
        Daily data often exhibits both intra-week (m=7) and intra-year (m=365.25) seasonality.
        DHR handles this elegantly:
      </p>
      <BlockMath math="y_t = \beta_0 + \beta_1 t + \underbrace{\sum_{k=1}^{K_1}\!\left[\alpha_k^{(7)}\sin\tfrac{2\pi k t}{7} + \gamma_k^{(7)}\cos\tfrac{2\pi k t}{7}\right]}_{\text{weekly}} + \underbrace{\sum_{k=1}^{K_2}\!\left[\alpha_k^{(365)}\sin\tfrac{2\pi k t}{365} + \gamma_k^{(365)}\cos\tfrac{2\pi k t}{365}\right]}_{\text{annual}} + \eta_t" />
      <p>
        The ARIMA errors then capture short-run autocorrelation not explained by either seasonal
        component.
      </p>

      <div style={{ margin: '1rem 0', padding: '1rem', background: '#fef9c3', borderRadius: '8px', border: '1px solid #fde047' }}>
        <strong>Practical Tip: pmdarima auto_arima</strong>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          The <code>pmdarima</code> library's <code>auto_arima()</code> function can automatically
          search the ARIMA order space when Fourier terms are passed as exogenous predictors. Use{' '}
          <code>seasonal=False</code> (since seasonality is handled by Fourier terms) and set a
          reasonable <code>max_p</code> / <code>max_q</code> to control search time.
        </p>
        <pre style={{ background: '#fff', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', marginTop: '0.5rem' }}>{`import pmdarima as pm
model = pm.auto_arima(train, exogenous=X_train,
                      seasonal=False, d=0,
                      max_p=3, max_q=3,
                      information_criterion='aic',
                      stepwise=True, trace=True)`}</pre>
      </div>

      <h2>Residual Diagnostics</h2>
      <p>
        After fitting, the residuals <InlineMath math="\hat{\varepsilon}_t" /> should pass:
      </p>
      <ul>
        <li><strong>Ljung-Box test:</strong> No significant autocorrelation at lags 1–20.</li>
        <li><strong>ACF/PACF plots:</strong> No significant spikes.</li>
        <li><strong>Normality:</strong> QQ-plot and Jarque-Bera test (important for valid
          prediction intervals).</li>
        <li><strong>Heteroskedasticity:</strong> Plot residuals vs. fitted; look for funnelling.
          Consider log transformation if present.</li>
      </ul>

      <PythonCode code={dynamicHarmonicCode} title="Dynamic Harmonic Regression: Grid Search and Forecast" />

      <h2>Summary</h2>
      <ul>
        <li>
          Dynamic harmonic regression combines Fourier terms (for flexible seasonality) with ARIMA
          errors (for short-run dynamics), providing a unified model for complex seasonal time series.
        </li>
        <li>
          It is superior to SARIMA for long seasonal periods (m &gt; 24), non-integer periods, and
          multiple seasonal patterns.
        </li>
        <li>
          Model selection requires a joint grid search over <InlineMath math="K" /> and the ARIMA
          order <InlineMath math="(p, d, q)" />, guided by AIC or AICc.
        </li>
        <li>
          Forecasting is straightforward because Fourier terms for future periods are always
          computable from the time index alone.
        </li>
        <li>
          Residual diagnostics must confirm both the absence of autocorrelation and approximate
          normality for valid prediction intervals.
        </li>
      </ul>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
