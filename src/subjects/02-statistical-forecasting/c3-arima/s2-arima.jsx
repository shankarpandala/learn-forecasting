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

const pythonCode = `# ARIMA modeling with statsmodels and pmdarima
# pip install statsmodels pmdarima

import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller, kpss
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import matplotlib.pyplot as plt

# ── Step 1: Load and inspect data ────────────────────────────────────────────
from statsmodels.datasets import co2
co2_data = co2.load_pandas().data['co2'].resample('MS').mean().ffill()
ts = co2_data['1990':'2000']   # subset for clarity

# ── Step 2: Identify – stationarity tests ────────────────────────────────────
# Augmented Dickey-Fuller: H0 = unit root (non-stationary)
adf = adfuller(ts, autolag='AIC')
print(f"ADF statistic: {adf[0]:.4f}, p-value: {adf[1]:.4f}")
# => p > 0.05: likely non-stationary, need differencing

# First difference
ts_diff = ts.diff().dropna()
adf2 = adfuller(ts_diff, autolag='AIC')
print(f"Differenced ADF: {adf2[0]:.4f}, p-value: {adf2[1]:.4f}")
# => d = 1

# ── Step 3: ACF/PACF of differenced series ────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
plot_acf(ts_diff,  lags=20, ax=axes[0])
plot_pacf(ts_diff, lags=20, ax=axes[1])
plt.tight_layout(); plt.savefig('arima_acf.png', dpi=150)

# ── Step 4: Fit ARIMA(p,1,q) candidates ─────────────────────────────────────
results = []
for p in range(4):
    for q in range(4):
        try:
            m = ARIMA(ts, order=(p, 1, q)).fit()
            results.append({'order': f'({p},1,{q})', 'AIC': m.aic, 'BIC': m.bic})
        except Exception:
            pass

df_res = pd.DataFrame(results).sort_values('AICc' if 'AICc' in results[0] else 'AIC')
print("\\nTop ARIMA candidates:")
print(df_res.head(5).to_string(index=False))

# ── Fit best model ────────────────────────────────────────────────────────────
best = ARIMA(ts, order=(2, 1, 2)).fit()
print("\\n", best.summary())

# ── Step 5: Diagnostics ───────────────────────────────────────────────────────
residuals = best.resid
from statsmodels.stats.diagnostic import acorr_ljungbox
lb = acorr_ljungbox(residuals, lags=[10, 20], return_df=True)
print("\\nLjung-Box test (H0: no autocorrelation in residuals):")
print(lb)

# ── Step 6: Forecast ─────────────────────────────────────────────────────────
forecast_result = best.get_forecast(steps=24)
fc_mean = forecast_result.predicted_mean
fc_ci   = forecast_result.conf_int(alpha=0.05)
print("\\n24-step forecast:")
print(pd.concat([fc_mean.rename('forecast'), fc_ci], axis=1).round(2).head())

# ── Auto-ARIMA with pmdarima ──────────────────────────────────────────────────
from pmdarima import auto_arima

auto_model = auto_arima(
    ts,
    d=1,                  # force one differencing (known from ADF)
    start_p=0, start_q=0,
    max_p=4,  max_q=4,
    stepwise=True,        # stepwise search for speed
    information_criterion='aic',
    seasonal=False,       # non-seasonal version
    trace=True,           # print search log
)
print("\\nauto_arima best order:", auto_model.order)
print("AIC:", auto_model.aic())
`;

const references = [
  {
    label: 'FPP3 §9.5-9.9',
    title: 'Forecasting: Principles and Practice – ARIMA models',
    authors: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/arima.html',
  },
  {
    label: 'Box & Jenkins 1976',
    title: 'Time Series Analysis: Forecasting and Control',
    authors: 'Box, G.E.P. & Jenkins, G.M.',
    year: 1976,
  },
  {
    label: 'pmdarima',
    title: 'pmdarima: ARIMA estimators for Python',
    authors: 'Smith, T.',
    year: 2017,
    url: 'https://alkaline-ml.com/pmdarima/',
  },
];

export default function ARIMAModels() {
  return (
    <SectionLayout
      title="ARIMA Models"
      difficulty="intermediate"
      readingTime={28}
      prerequisites={['AR & MA Models', 'Stationarity and differencing']}
    >
      <p>
        ARIMA — AutoRegressive Integrated Moving Average — combines differencing to achieve
        stationarity with AR and MA components to model the autocorrelation structure of
        the differenced series.
      </p>

      <NoteBlock type="fpp3" title="FPP3 Chapter 9">
        FPP3 Chapter 9 covers ARIMA comprehensively, including the backshift operator,
        Box-Jenkins methodology, and automatic model selection. This is one of the most
        important chapters in applied forecasting.
      </NoteBlock>

      <h2>1. ARIMA(p,d,q) Specification</h2>
      <DefinitionBlock
        label="Definition"
        title="ARIMA(p, d, q)"
        definition="ARIMA combines three components: p autoregressive terms, d differences, and q moving average terms."
        notation="\underbrace{(1 - \phi_1 B - \cdots - \phi_p B^p)}_{\text{AR}(p)} \underbrace{(1-B)^d}_{\text{Integration}} y_t = c + \underbrace{(1 + \theta_1 B + \cdots + \theta_q B^q)}_{\text{MA}(q)} \varepsilon_t"
      />
      <p>
        where <InlineMath math="B" /> is the <strong>backshift operator</strong>:{' '}
        <InlineMath math="B y_t = y_{t-1}" />,{' '}
        <InlineMath math="B^k y_t = y_{t-k}" />, and{' '}
        <InlineMath math="(1-B)^d y_t" /> is the d-th difference.
      </p>

      <h2>2. Backshift Operator Notation</h2>
      <p>The backshift operator simplifies ARIMA notation considerably:</p>
      <BlockMath math="(1-B)y_t = y_t - y_{t-1} = \Delta y_t \quad \text{(first difference)}" />
      <BlockMath math="(1-B)^2 y_t = y_t - 2y_{t-1} + y_{t-2} = \Delta^2 y_t \quad \text{(second difference)}" />
      <p>An ARIMA(1,1,1) in backshift notation:</p>
      <BlockMath math="(1 - \phi_1 B)(1-B)y_t = c + (1 + \theta_1 B)\varepsilon_t" />

      <h2>3. Box-Jenkins Methodology</h2>
      <div className="my-4 space-y-4">
        {[
          {
            step: '1. Identify',
            description: 'Plot the series. Apply transformations (log, Box-Cox) if needed. Test stationarity (ADF, KPSS). Difference until stationary (determines d). Inspect ACF/PACF of differenced series to suggest p, q.',
          },
          {
            step: '2. Estimate',
            description: 'Fit candidate ARIMA(p,d,q) models via MLE. Compare AIC and BIC across competing models. Select the most parsimonious model that minimizes information criteria.',
          },
          {
            step: '3. Diagnose',
            description: 'Check residuals: (a) ACF of residuals should be white noise, (b) Ljung-Box test p-value > 0.05, (c) QQ-plot for normality, (d) no pattern in residual vs fitted plot.',
          },
          {
            step: '4. Forecast',
            description: 'Use the fitted model for point forecasts and prediction intervals. Transform back if a log or Box-Cox transformation was applied.',
          },
        ].map(({ step, description }) => (
          <div key={step} className="flex gap-4 p-4 bg-zinc-800/60 rounded-lg border border-zinc-700">
            <div className="shrink-0 w-24 text-sky-400 font-semibold text-sm">{step}</div>
            <div className="text-sm text-zinc-300">{description}</div>
          </div>
        ))}
      </div>

      <h2>4. Information Criteria for Model Selection</h2>
      <BlockMath math="\text{AIC} = -2\ln(\hat{L}) + 2k" />
      <BlockMath math="\text{AICc} = \text{AIC} + \frac{2k(k+1)}{T-k-1}" />
      <BlockMath math="\text{BIC} = -2\ln(\hat{L}) + k\ln(T)" />
      <p>
        where <InlineMath math="k" /> = number of estimated parameters,{' '}
        <InlineMath math="T" /> = sample size, and <InlineMath math="\hat{L}" /> = maximized
        likelihood. AICc is preferred for small samples (<InlineMath math="T < 50" />).
        BIC penalizes more for large <InlineMath math="T" />, tending to select simpler models.
      </p>

      <TheoremBlock
        label="Theorem"
        title="ARIMA Forecast Convergence"
        statement="For a stationary ARIMA(p,0,q) with |roots| > 1, as h → ∞, the h-step-ahead forecast ŷ_{T+h|T} converges to the unconditional mean μ = c/(1−φ₁−…−φₚ). For d=1, forecasts converge to a linear trend."
        proof="The forecast function satisfies the homogeneous difference equation (1−φ₁B−…−φₚBᵖ)ŷ_{T+h|T} = c for large h. Solutions are linear combinations of exponentials r_i^h where r_i are roots. For |r_i| < 1, all terms → 0."
        corollaries={[
          "ARIMA(0,1,0) with constant = drift method: forecast is a linear trend through the last observation.",
          "ARIMA(0,2,0): double-differenced random walk, produces quadratic trend extrapolation.",
        ]}
      />

      <ExampleBlock
        title="Fitting ARIMA to CO₂ Concentration Data"
        difficulty="intermediate"
        problem="Monthly Mauna Loa CO₂ data (1990-2000) shows strong upward trend. Identify and fit an appropriate non-seasonal ARIMA model."
        solution={[
          {
            step: "Test for stationarity",
            formula: "\\text{ADF test: } H_0 = \\text{unit root}",
            explanation: "ADF p-value ≈ 0.9 → fail to reject non-stationarity. First difference needed (d=1).",
          },
          {
            step: "Test differenced series",
            formula: "\\Delta y_t = y_t - y_{t-1}",
            explanation: "ADF on Δy_t gives p < 0.01 → stationary. Seasonal pattern visible → non-seasonal ARIMA on trend component.",
          },
          {
            step: "Read ACF/PACF",
            formula: "\\text{ACF cuts off at lag } q, \\text{ PACF cuts off at lag } p",
            explanation: "ACF shows spike at lag 1; PACF shows spike at lag 1 and 2. Suggests ARIMA(2,1,1) or ARIMA(1,1,1) as candidates.",
          },
          {
            step: "Select via AICc",
            formula: "\\min_{p,q} \\text{AICc}(p, 1, q)",
            explanation: "Grid search over p,q ∈ {0,1,2,3} with d=1. ARIMA(2,1,2) achieves lowest AICc.",
          },
        ]}
      />

      <h2>5. Auto-ARIMA: Automated Selection</h2>
      <p>
        Manual Box-Jenkins is labor-intensive for many series. Auto-ARIMA algorithms
        automate the stepwise search:
      </p>
      <ul>
        <li>
          <strong>pmdarima.auto_arima</strong>: stepwise search by default, tests ADF/KPSS
          to determine d, then searches p,q using AIC or BIC.
        </li>
        <li>
          <strong>statsforecast.AutoARIMA</strong>: significantly faster, vectorized
          implementation, recommended for multiple series in production.
        </li>
      </ul>

      <WarningBlock title="Auto-ARIMA Is Not a Silver Bullet">
        Auto-ARIMA may select a suboptimal order if the time series has structural breaks,
        outliers, or irregular patterns. Always validate the selected order with diagnostic
        plots and domain knowledge. For long-memory or fractional integration, ARFIMA may
        be more appropriate.
      </WarningBlock>

      <h2>Python: Full ARIMA Pipeline</h2>
      <PythonCode
        code={pythonCode}
        filename="arima_modeling.py"
        title="Box-Jenkins ARIMA workflow with statsmodels and pmdarima"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
