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

export const metadata = {
  title: 'Prediction Intervals',
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'Learn to construct, evaluate, and interpret prediction intervals for time series forecasts, covering analytical and simulation-based methods.',
};

export default function PredictionIntervals() {
  return (
    <SectionLayout title="Prediction Intervals" metadata={metadata}>
      <p>
        Point forecasts tell you the expected value of a future observation, but they say nothing about
        how confident you should be in that estimate. Prediction intervals fill this gap by providing a
        range within which the actual value is expected to fall with a specified probability.
      </p>

      <DefinitionBlock title="Prediction Interval">
        A <strong>prediction interval</strong> (PI) at coverage level <InlineMath math="1 - \alpha" /> is
        an interval <InlineMath math="[L_t, U_t]" /> such that:
        <BlockMath math="P(y_{t+h} \in [L_t, U_t]) \geq 1 - \alpha" />
        where <InlineMath math="y_{t+h}" /> is the future observation at horizon <InlineMath math="h" />,
        and <InlineMath math="\alpha" /> is the miscoverage rate (typically 0.05 for 95% intervals).
      </DefinitionBlock>

      <h2>Confidence Intervals vs Prediction Intervals</h2>
      <p>
        These two concepts are frequently confused, even in professional settings. The distinction is fundamental:
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Property</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Confidence Interval</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb' }}>Prediction Interval</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>What it covers</td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>True parameter (e.g., mean)</td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Future individual observation</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Sources of uncertainty</td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Estimation uncertainty only</td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Estimation + irreducible noise</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Width as n grows</td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Shrinks to zero</td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Converges to noise floor</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Use case</td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Parameter estimation</td>
              <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Forecasting future values</td>
            </tr>
          </tbody>
        </table>
      </div>

      <WarningBlock>
        Using a confidence interval where a prediction interval is required systematically underestimates
        uncertainty. A 95% confidence interval for the mean will have much lower actual coverage for individual
        future observations. Always use prediction intervals when communicating forecast uncertainty.
      </WarningBlock>

      <h2>Analytical Prediction Intervals</h2>
      <p>
        When a model has known distributional assumptions, prediction intervals can be derived analytically.
        For an ARIMA model with Gaussian errors, the h-step-ahead prediction interval is:
      </p>
      <BlockMath math="\hat{y}_{t+h|t} \pm z_{\alpha/2} \cdot \hat{\sigma}_h" />
      <p>where the forecast variance grows with horizon:</p>
      <BlockMath math="\hat{\sigma}_h^2 = \hat{\sigma}^2 \sum_{i=0}^{h-1} \psi_i^2" />
      <p>
        Here <InlineMath math="\psi_i" /> are the MA coefficients in the infinite MA representation of
        the ARIMA model. This means prediction intervals widen as we forecast further into the future,
        correctly reflecting increasing uncertainty.
      </p>

      <h2>Simulation-Based Prediction Intervals</h2>
      <p>
        For complex models where analytical formulas are unavailable, simulation provides a general alternative.
        The bootstrap approach works by:
      </p>
      <ol>
        <li>Fit the model and collect residuals <InlineMath math="\hat{\epsilon}_1, \ldots, \hat{\epsilon}_T" /></li>
        <li>Simulate many future paths by drawing residuals with replacement</li>
        <li>Compute quantiles of the resulting distribution at each horizon</li>
      </ol>

      <TheoremBlock title="Coverage Probability">
        A prediction interval has <strong>valid coverage</strong> if, over many independent repetitions of
        the forecasting experiment, the true value falls within the interval at least <InlineMath math="1-\alpha" /> of
        the time. A PI is <em>exact</em> if:
        <BlockMath math="P(y_{t+h} \in [L_t, U_t]) = 1 - \alpha" />
        and <em>conservative</em> if the probability strictly exceeds <InlineMath math="1 - \alpha" />.
      </TheoremBlock>

      <h2>Evaluating Prediction Intervals: The Winkler Score</h2>
      <p>
        The Winkler score (also called the interval score) penalizes both wide intervals and coverage
        failures simultaneously:
      </p>
      <BlockMath math="W_\alpha = (U - L) + \frac{2}{\alpha}(L - y)\mathbf{1}[y < L] + \frac{2}{\alpha}(y - U)\mathbf{1}[y > U]" />
      <p>
        Lower Winkler scores are better. The first term rewards narrow intervals; the penalty terms
        penalize misses proportionally to how far outside the interval the actual value falls.
        The <InlineMath math="2/\alpha" /> factor scales the penalty so that a 95% interval is penalized
        more heavily per unit miss than an 80% interval.
      </p>

      <ExampleBlock title="Computing the Winkler Score">
        Suppose you issue a 95% PI of [42, 68] and the actual value is 75.
        <BlockMath math="W_{0.05} = (68 - 42) + \frac{2}{0.05}(75 - 68) = 26 + 40 \times 7 = 306" />
        Compare this to a wider interval [30, 80] with the same actual value of 75 (which is covered):
        <BlockMath math="W_{0.05} = (80 - 30) + 0 = 50" />
        The wider interval scores much better because it avoids the heavy miss penalty.
      </ExampleBlock>

      <h2>Common Pitfalls</h2>

      <WarningBlock title="Underestimation from Model Misspecification">
        Analytical prediction intervals derived from ARIMA or ETS only account for uncertainty from future
        errors — they do not account for uncertainty in the estimated parameters themselves. As a result,
        they are systematically too narrow, especially for short training series. Bootstrapped intervals or
        conformal methods provide better finite-sample coverage.
      </WarningBlock>

      <NoteBlock title="Non-Gaussian Residuals">
        Many time series have skewed or heavy-tailed residuals (e.g., demand data, financial returns). Using
        Gaussian-based intervals in these cases produces unreliable coverage. Consider:
        <ul>
          <li>Transforming the data (log, Box-Cox) before modeling</li>
          <li>Using distribution-free simulation intervals</li>
          <li>Quantile regression (covered in the next section)</li>
        </ul>
      </NoteBlock>

      <NoteBlock title="Fan Charts">
        When communicating forecast uncertainty to non-technical stakeholders, fan charts (shaded bands for
        multiple coverage levels, e.g., 50%, 80%, 95%) are more intuitive than a single interval. They
        convey both the central tendency and the full range of uncertainty.
      </NoteBlock>

      <h2>Implementation with statsmodels and StatsForecast</h2>

      <PythonCode code={`import pandas as pd
import numpy as np
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA, AutoETS

# ── Analytical PIs with statsmodels ──────────────────────────────────────────
np.random.seed(42)
n = 200
t = np.arange(n)
y = 50 + 0.3 * t + 10 * np.sin(2 * np.pi * t / 52) + np.random.normal(0, 3, n)
dates = pd.date_range('2020-01-01', periods=n, freq='W')
series = pd.Series(y, index=dates)

train, test = series[:-12], series[-12:]

# Fit SARIMA
model = SARIMAX(train, order=(1, 1, 1), seasonal_order=(1, 0, 1, 52),
                enforce_stationarity=False, enforce_invertibility=False)
result = model.fit(disp=False)

# Get forecast with 95% prediction interval
forecast = result.get_forecast(steps=12)
pred_mean = forecast.predicted_mean
pred_ci = forecast.conf_int(alpha=0.05)

print(pd.DataFrame({
    'forecast': pred_mean,
    'lower_95': pred_ci.iloc[:, 0],
    'upper_95': pred_ci.iloc[:, 1],
    'actual': test.values
}))

# ── Winkler Score ─────────────────────────────────────────────────────────────
def winkler_score(actual, lower, upper, alpha=0.05):
    width = upper - lower
    miss_below = np.maximum(lower - actual, 0)
    miss_above = np.maximum(actual - upper, 0)
    penalty = (2 / alpha) * (miss_below + miss_above)
    return (width + penalty).mean()

score = winkler_score(
    test.values,
    pred_ci.iloc[:, 0].values,
    pred_ci.iloc[:, 1].values
)
print(f"Mean Winkler Score (95%): {score:.2f}")

# Empirical coverage
coverage = np.mean(
    (test.values >= pred_ci.iloc[:, 0].values) &
    (test.values <= pred_ci.iloc[:, 1].values)
)
print(f"Empirical Coverage: {coverage:.1%}  (target: 95%)")

# ── StatsForecast with PIs for panel data ─────────────────────────────────────
df = pd.DataFrame({
    'unique_id': 'series_1',
    'ds': dates[:188],
    'y': y[:188],
})

sf = StatsForecast(
    models=[AutoARIMA(season_length=52), AutoETS(season_length=52)],
    freq='W',
    n_jobs=-1
)
sf.fit(df)

# Forecast with multiple PI levels
forecast_df = sf.predict(h=12, level=[80, 95])
print("StatsForecast output columns:", forecast_df.columns.tolist())

# ── Bootstrap Prediction Intervals ───────────────────────────────────────────
def bootstrap_pi(train_series, n_steps, n_boot=500, alpha=0.05):
    """Bootstrap PI for AR(1) model."""
    from statsmodels.tsa.ar_model import AutoReg
    mdl = AutoReg(train_series, lags=1, old_names=False).fit()
    residuals = mdl.resid

    boot_forecasts = np.zeros((n_boot, n_steps))
    for b in range(n_boot):
        sim_errors = np.random.choice(residuals, size=n_steps, replace=True)
        path = [train_series.iloc[-1]]
        for e in sim_errors:
            nxt = mdl.params[0] + mdl.params[1] * path[-1] + e
            path.append(nxt)
        boot_forecasts[b] = path[1:]

    lower = np.quantile(boot_forecasts, alpha / 2, axis=0)
    upper = np.quantile(boot_forecasts, 1 - alpha / 2, axis=0)
    return lower, upper

lower_boot, upper_boot = bootstrap_pi(train, n_steps=12)
boot_coverage = np.mean(
    (test.values >= lower_boot) & (test.values <= upper_boot)
)
print(f"Bootstrap Coverage (95%): {boot_coverage:.1%}")
`} />

      <h2>Choosing the Right Method</h2>
      <p>
        The choice between analytical and simulation-based intervals depends on model complexity and
        the importance of computational efficiency:
      </p>
      <ul>
        <li><strong>Analytical (ARIMA/ETS):</strong> Fast and closed-form, but assumes Gaussian errors and ignores parameter uncertainty.</li>
        <li><strong>Bootstrap:</strong> Distribution-free, captures non-Gaussian residuals, but computationally heavier.</li>
        <li><strong>Conformal prediction:</strong> Provides finite-sample coverage guarantees regardless of the underlying model (covered in Chapter 2).</li>
        <li><strong>Bayesian:</strong> Naturally quantifies all sources of uncertainty via the posterior predictive distribution (covered in Chapter 3).</li>
      </ul>

      <ReferenceList references={[
        {
          title: 'Forecasting: Principles and Practice (3rd ed.) — Prediction Intervals',
          authors: 'Hyndman, R.J. & Athanasopoulos, G.',
          year: 2021,
          url: 'https://otexts.com/fpp3/prediction-intervals.html',
        },
        {
          title: 'Strictly Proper Scoring Rules, Prediction, and Estimation',
          authors: 'Gneiting, T. & Raftery, A.E.',
          year: 2007,
          journal: 'Journal of the American Statistical Association',
        },
        {
          title: 'A Note on the Interval Score',
          authors: 'Winkler, R.L.',
          year: 1972,
          journal: 'Management Science',
        },
      ]} />
    </SectionLayout>
  );
}
