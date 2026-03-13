import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

const pythonCode = `# Prophet: Decomposable Time Series Forecasting
# pip install prophet

import pandas as pd
import numpy as np
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
from prophet.plot import plot_cross_validation_metric
import matplotlib.pyplot as plt

# ── 1. Data preparation ───────────────────────────────────────────────────────
# Prophet requires columns 'ds' (datetime) and 'y' (target)
np.random.seed(42)
n = 365 * 3   # 3 years daily data
dates = pd.date_range('2021-01-01', periods=n, freq='D')
t = np.arange(n)

# Simulate: linear trend + weekly + annual + holidays + noise
weekly = 5 * np.sin(2 * np.pi * t / 7)
annual = 15 * np.sin(2 * np.pi * t / 365.25)
trend_component = 0.05 * t
noise = np.random.normal(0, 3, n)
y = 100 + trend_component + weekly + annual + noise

df = pd.DataFrame({'ds': dates, 'y': y})

# ── 2. Basic Prophet model ────────────────────────────────────────────────────
m = Prophet(
    growth='linear',          # or 'logistic' for saturating growth
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False,
    changepoint_prior_scale=0.05,   # flexibility of trend (regularization)
    seasonality_prior_scale=10,     # flexibility of seasonality
    seasonality_mode='additive',    # or 'multiplicative'
    interval_width=0.95,            # prediction interval width
)

m.fit(df)

# ── 3. Future dataframe and forecast ─────────────────────────────────────────
future = m.make_future_dataframe(periods=90, freq='D')
forecast = m.predict(future)

print("Forecast columns:", forecast.columns.tolist())
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(10))

# ── 4. Decomposition plot ─────────────────────────────────────────────────────
fig1 = m.plot(forecast, figsize=(12, 5))
fig2 = m.plot_components(forecast, figsize=(12, 8))
plt.savefig('prophet_components.png', dpi=150)

# ── 5. Custom seasonality ─────────────────────────────────────────────────────
m2 = Prophet(yearly_seasonality=False, weekly_seasonality=True)
m2.add_seasonality(
    name='monthly',
    period=30.5,
    fourier_order=5,   # number of Fourier terms
)
m2.add_seasonality(
    name='quarterly',
    period=91.25,
    fourier_order=3,
)
m2.fit(df)

# ── 6. Holiday effects ────────────────────────────────────────────────────────
holidays = pd.DataFrame({
    'holiday': 'christmas',
    'ds': pd.date_range('2021-12-25', periods=3, freq='365D'),
    'lower_window': -2,   # effect starts 2 days before
    'upper_window': 1,    # effect ends 1 day after
})
m3 = Prophet(holidays=holidays)
m3.add_country_holidays(country_name='US')   # built-in US holidays
m3.fit(df)

# ── 7. Logistic growth (saturating forecasts) ────────────────────────────────
df_logistic = df.copy()
df_logistic['cap'] = 300    # carrying capacity
df_logistic['floor'] = 0    # minimum value

m4 = Prophet(growth='logistic')
m4.fit(df_logistic)
future4 = m4.make_future_dataframe(periods=90)
future4['cap'] = 300
future4['floor'] = 0
forecast4 = m4.predict(future4)

# ── 8. Cross-validation ───────────────────────────────────────────────────────
# Evaluate using sliding window CV
df_cv = cross_validation(
    m,
    initial='365 days',   # minimum training window
    period='90 days',     # spacing between cutoff dates
    horizon='90 days',    # forecast horizon
    parallel='processes', # parallelization
)
print("\\nCV results shape:", df_cv.shape)

df_perf = performance_metrics(df_cv)
print("\\nPerformance metrics:")
print(df_perf[['horizon', 'mae', 'mape', 'rmse', 'coverage']].head(10))

# Plot MAPE across horizons
fig3 = plot_cross_validation_metric(df_cv, metric='mape')
plt.savefig('prophet_cv_mape.png', dpi=150)

# ── 9. Uncertainty intervals via Monte Carlo ─────────────────────────────────
# Prophet samples from posterior using Stan under the hood
# mcmc_samples > 0 triggers full MCMC (slow but proper Bayesian intervals)
m_mcmc = Prophet(
    mcmc_samples=0,          # 0 = MAP estimation (fast); >0 = full MCMC
    interval_width=0.90,
)
m_mcmc.fit(df)
forecast_mcmc = m_mcmc.predict(future)
print("\\n90% interval width (first forecast):",
      (forecast_mcmc['yhat_upper'] - forecast_mcmc['yhat_lower']).iloc[-90:].mean().round(2))
`;

const references = [
  {
    label: 'Taylor & Letham 2018',
    title: 'Forecasting at Scale',
    authors: 'Taylor, S.J. & Letham, B.',
    year: 2018,
    url: 'https://doi.org/10.1080/00031305.2017.1380080',
  },
  {
    label: 'Prophet docs',
    title: 'Prophet: Forecasting at Scale — official documentation',
    authors: 'Meta Research',
    year: 2023,
    url: 'https://facebook.github.io/prophet/',
  },
];

export default function ProphetModel() {
  return (
    <SectionLayout
      title="Prophet: Decomposable Forecasting"
      difficulty="intermediate"
      readingTime={25}
      prerequisites={['ETS State Space Framework', 'ARIMA Models']}
    >
      <p>
        Prophet, developed by Meta's Core Data Science team (Taylor &amp; Letham, 2018),
        is a procedure for forecasting time series with strong seasonality, holiday effects,
        and irregular trend changepoints. It is designed for business analysts, not just
        statisticians.
      </p>

      <NoteBlock type="info" title="Taylor & Letham 2018">
        The original paper "Forecasting at Scale" was published in The American Statistician.
        Prophet uses a decomposable model fitted with Stan (probabilistic programming),
        making it robust to missing data, outliers, and shifts in trend.
      </NoteBlock>

      <h2>1. The Prophet Model</h2>
      <DefinitionBlock
        label="Definition"
        title="Prophet Decomposable Model"
        definition="Prophet decomposes the time series into three main components plus noise."
        notation="y(t) = g(t) + s(t) + h(t) + \varepsilon_t"
      />
      <ul>
        <li><strong><InlineMath math="g(t)" /></strong>: Trend function (piecewise linear or logistic)</li>
        <li><strong><InlineMath math="s(t)" /></strong>: Seasonality (Fourier series)</li>
        <li><strong><InlineMath math="h(t)" /></strong>: Holiday effects (indicator variables)</li>
        <li><strong><InlineMath math="\varepsilon_t" /></strong>: Error term</li>
      </ul>

      <h2>2. Trend Component</h2>
      <p>Prophet offers two trend models:</p>
      <p><strong>Piecewise linear</strong> with automatic changepoint detection:</p>
      <BlockMath math="g(t) = (k + \mathbf{a}(t)^T \boldsymbol{\delta}) t + (m + \mathbf{a}(t)^T \boldsymbol{\gamma})" />
      <p>
        where <InlineMath math="\boldsymbol{\delta}" /> are changepoint slope adjustments,
        automatically placed at potential changepoints. The prior{' '}
        <InlineMath math="\delta_j \sim \text{Laplace}(0, \tau)" /> with regularization
        strength <InlineMath math="\tau" /> = <code>changepoint_prior_scale</code>.
      </p>
      <p><strong>Logistic growth</strong> for saturating trends:</p>
      <BlockMath math="g(t) = \frac{C(t)}{1 + \exp(-(k + \mathbf{a}(t)^T\boldsymbol{\delta})(t - (m + \mathbf{a}(t)^T\boldsymbol{\gamma})))}" />
      <p>
        where <InlineMath math="C(t)" /> is the carrying capacity (user-specified or modeled).
      </p>

      <h2>3. Seasonality via Fourier Series</h2>
      <p>
        Rather than seasonal dummy variables, Prophet uses a Fourier series approximation
        for each seasonal period <InlineMath math="P" />:
      </p>
      <BlockMath math="s(t) = \sum_{n=1}^{N}\left(a_n \cos\frac{2\pi n t}{P} + b_n \sin\frac{2\pi n t}{P}\right)" />
      <p>
        The number of Fourier terms <InlineMath math="N" /> (<code>fourier_order</code>)
        controls the smoothness. Typical values: N=3 for annual seasonality, N=3 for weekly,
        N=10 for annual with fine-grained holidays.
      </p>

      <h2>4. Holiday Effects</h2>
      <p>
        Holidays are modeled as indicator variables with a window of effect:
      </p>
      <BlockMath math="h(t) = \mathbf{Z}(t) \boldsymbol{\kappa}, \quad \kappa_j \sim \text{Normal}(0, \nu^2)" />
      <p>
        where <InlineMath math="\mathbf{Z}(t)" /> is a binary indicator for whether time{' '}
        <InlineMath math="t" /> falls in a holiday window. The regularization prior prevents
        overfitting to noisy holiday spikes.
      </p>

      <h2>5. Uncertainty Intervals</h2>
      <p>
        Prophet generates uncertainty intervals via Monte Carlo simulation by default
        (MAP estimation). Full Bayesian inference via MCMC is available but slower:
      </p>
      <ul>
        <li><strong>Trend uncertainty</strong>: sampled from posterior over changepoint locations and magnitudes</li>
        <li><strong>Observation noise</strong>: sampled from the residual noise model</li>
        <li><strong>Seasonality uncertainty</strong>: included when <code>mcmc_samples &gt; 0</code></li>
      </ul>

      <h2>6. Prophet vs ARIMA: Trade-offs</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm text-zinc-700 dark:text-zinc-300 border-collapse">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800">
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">Aspect</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">Prophet</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">ARIMA</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['User skill required', 'Low — interpretable parameters', 'High — ACF/PACF expertise needed'],
              ['Multiple seasonalities', 'Native support', 'Complex seasonal ARIMA needed'],
              ['Holiday effects', 'Built-in, easy to specify', 'Manual SARIMAX exogenous'],
              ['Irregular frequencies', 'Handles naturally (Stan fits on t)', 'Requires regular grid'],
              ['Missing data', 'Handles gracefully', 'Requires imputation'],
              ['Theoretical foundation', 'Ad-hoc / pragmatic', 'Well-established (Box-Jenkins)'],
              ['Short series (<50 obs)', 'Works well', 'Struggles (few parameters estimable)'],
              ['Forecast accuracy', 'Good for business metrics', 'Better for stationary economic series'],
              ['Speed (1000+ series)', 'Slow (Stan per series)', 'statsforecast AutoARIMA: very fast'],
            ].map(([aspect, prophet, arima], i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-zinc-50 dark:bg-zinc-800/50'}>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 font-medium">{aspect}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-emerald-700 dark:text-emerald-400">{prophet}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-sky-700 dark:text-sky-400">{arima}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoteBlock type="warning" title="Prophet Is Not a Universal Solution">
        Prophet has been criticized for over-fitting changepoints and producing overconfident
        intervals on datasets it was not designed for. Always compare Prophet against seasonal
        naïve and ARIMA before deploying. For high-frequency data (hourly, sub-daily), consider
        NeuralProphet or TBATS instead.
      </NoteBlock>

      <WarningBlock title="When NOT to Use Prophet">
        Prophet struggles with: (1) non-business time series with complex autocorrelation
        structure, (2) very short series &lt; 2 seasonal cycles, (3) series requiring
        exogenous variable modeling beyond holidays, (4) purely AR/MA type dynamics
        with no trend or seasonality.
      </WarningBlock>

      <h2>Python: Complete Prophet API</h2>
      <PythonCode
        code={pythonCode}
        filename="prophet_model.py"
        title="Prophet — complete API with seasonality, holidays, logistic growth, and CV"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
