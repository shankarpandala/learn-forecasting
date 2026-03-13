import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

const pythonCode = `# Seasonal ARIMA (SARIMA/SARIMAX) modeling
# pip install statsmodels statsforecast

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.stattools import adfuller

# ── Classic dataset: Airline Passengers (Box-Jenkins 1976) ───────────────────
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
# Using built-in data instead
from statsmodels.datasets import get_rdataset
air = get_rdataset('AirPassengers').data
ts = pd.Series(
    air['value'].values,
    index=pd.date_range('1949-01', periods=144, freq='MS'),
    name='passengers',
)

# ── Step 1: Log-transform to stabilize variance ───────────────────────────────
log_ts = np.log(ts)

# ── Step 2: Seasonal differencing + regular differencing ─────────────────────
log_diff_12    = log_ts.diff(12).dropna()        # seasonal difference
log_diff_1_12  = log_diff_12.diff(1).dropna()    # then regular difference

# ADF test after both differences
adf = adfuller(log_diff_1_12)
print(f"ADF after (1,1)(0,1,0)[12]: stat={adf[0]:.3f}, p={adf[1]:.4f}")

# ── Step 3: ACF/PACF for order identification ─────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
plot_acf(log_diff_1_12,  lags=36, ax=axes[0], title='ACF — log Δ₁Δ₁₂ AirPassengers')
plot_pacf(log_diff_1_12, lags=36, ax=axes[1], title='PACF')
plt.tight_layout()
plt.savefig('sarima_acf.png', dpi=150)

# Interpretation: spike at lag 1 in ACF (MA(1)), spike at lag 12 in ACF (SMA(1))
# => SARIMA(0,1,1)(0,1,1)[12] — the "Airline model"

# ── Step 4: Fit the Airline Model SARIMA(0,1,1)(0,1,1)[12] ───────────────────
model = SARIMAX(
    log_ts,
    order=(0, 1, 1),
    seasonal_order=(0, 1, 1, 12),
    trend='n',
)
fit = model.fit(disp=False)
print(fit.summary())

# ── Step 5: Residual diagnostics ─────────────────────────────────────────────
fit.plot_diagnostics(figsize=(12, 8))
plt.savefig('sarima_diagnostics.png', dpi=150)

from statsmodels.stats.diagnostic import acorr_ljungbox
lb = acorr_ljungbox(fit.resid, lags=[12, 24])
print("\\nLjung-Box (H0: white noise residuals):")
print(lb)

# ── Step 6: Forecast 24 months, transform back ───────────────────────────────
forecast = fit.get_forecast(steps=24)
fc_log  = forecast.predicted_mean
fc_ci   = forecast.conf_int(alpha=0.05)

# Back-transform from log scale
fc_orig  = np.exp(fc_log)
fc_lower = np.exp(fc_ci.iloc[:, 0])
fc_upper = np.exp(fc_ci.iloc[:, 1])
print("\\n24-month forecast (original scale):")
print(pd.DataFrame({'forecast': fc_orig, 'lower': fc_lower, 'upper': fc_upper}).round(1))

# ── AutoARIMA from statsforecast (faster, multiple series) ───────────────────
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA

df_sf = pd.DataFrame({
    'unique_id': 'air',
    'ds': pd.date_range('1949-01', periods=144, freq='MS'),
    'y': np.log(ts.values),   # fit on log scale
})

sf = StatsForecast(
    models=[AutoARIMA(season_length=12)],
    freq='MS', n_jobs=-1,
)
sf.fit(df_sf)
result = sf.predict(h=24, level=[80, 95])
print("\\nAutoARIMA forecast (log scale):")
print(result.head())
`;

const references = [
  {
    label: 'FPP3 §9.9',
    title: 'Forecasting: Principles and Practice – Seasonal ARIMA',
    authors: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/seasonal-arima.html',
  },
  {
    label: 'Box & Jenkins 1976',
    title: 'Time Series Analysis: Forecasting and Control (Airline Passengers example)',
    authors: 'Box, G.E.P. & Jenkins, G.M.',
    year: 1976,
  },
];

export default function SARIMA() {
  return (
    <SectionLayout
      title="Seasonal ARIMA (SARIMA)"
      difficulty="intermediate"
      readingTime={25}
      prerequisites={['ARIMA models', 'AR & MA models']}
    >
      <p>
        Real-world time series frequently exhibit seasonal patterns — monthly sales that peak
        every December, electricity demand that spikes every summer. SARIMA extends ARIMA
        with seasonal AR and MA operators, enabling direct modeling of these periodic
        structures.
      </p>

      <h2>1. SARIMA Notation</h2>
      <DefinitionBlock
        label="Definition"
        title="SARIMA(p,d,q)(P,D,Q)[m]"
        definition="A Seasonal ARIMA model with non-seasonal order (p,d,q), seasonal order (P,D,Q), and seasonal period m."
        notation="\Phi_P(B^m)\,\phi_p(B)\,(1-B^m)^D(1-B)^d\,y_t = \Theta_Q(B^m)\,\theta_q(B)\,\varepsilon_t"
      />
      <p>
        where the seasonal operators use <InlineMath math="B^m" /> (the lag-m backshift):
      </p>
      <ul>
        <li>
          <InlineMath math="\Phi_P(B^m) = 1 - \Phi_1 B^m - \cdots - \Phi_P B^{Pm}" />: Seasonal AR
        </li>
        <li>
          <InlineMath math="\Theta_Q(B^m) = 1 + \Theta_1 B^m + \cdots + \Theta_Q B^{Qm}" />: Seasonal MA
        </li>
        <li>
          <InlineMath math="(1-B^m)^D" />: Seasonal differencing (D times)
        </li>
      </ul>

      <h2>2. Seasonal Differencing</h2>
      <p>
        Seasonal differencing removes periodic trends by subtracting the value from the
        same season in the previous cycle:
      </p>
      <BlockMath math="\Delta_m y_t = (1 - B^m) y_t = y_t - y_{t-m}" />
      <p>
        For monthly data with <InlineMath math="m=12" />, the seasonal difference compares
        January to the previous January, February to the previous February, etc.
        Combined with regular differencing:
      </p>
      <BlockMath math="\Delta\Delta_{12} y_t = (1-B)(1-B^{12}) y_t" />

      <h2>3. The Airline Model: SARIMA(0,1,1)(0,1,1)[12]</h2>
      <p>
        Box and Jenkins (1976) introduced the famous "airline model" fitted to international
        airline passenger data (1949–1960). It remains one of the most widely cited examples:
      </p>
      <BlockMath math="(1-B)(1-B^{12})\ln y_t = (1 + \theta_1 B)(1 + \Theta_1 B^{12})\varepsilon_t" />
      <p>
        The log transform stabilizes the growing seasonal variance. The two MA terms
        (non-seasonal and seasonal) capture the autocorrelation structure after differencing.
      </p>

      <h2>4. SARIMA ACF/PACF Patterns</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm text-zinc-700 dark:text-zinc-300 border-collapse">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800">
              <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">Seasonal Component</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">ACF at seasonal lags</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">PACF at seasonal lags</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['SAR(P)', 'Decays at lags m, 2m, 3m,...', 'Cuts off at lag Pm'],
              ['SMA(Q)', 'Cuts off at lag Qm', 'Decays at lags m, 2m, 3m,...'],
              ['SARMA(P,Q)', 'Decays after lag Qm', 'Decays after lag Pm'],
            ].map(([c, a, p]) => (
              <tr key={c}>
                <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-mono">{c}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">{a}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoteBlock type="tip" title="Practical SARIMA Selection">
        For most seasonal data, start with SARIMA(0,1,1)(0,1,1)[m] (the airline model) or
        SARIMA(1,1,0)(1,1,0)[m]. These simple forms often perform well. Use AutoARIMA to
        confirm or improve, especially if you have many series to model.
      </NoteBlock>

      <ExampleBlock
        title="Airline Passenger Data: Classic Box-Jenkins Example"
        difficulty="intermediate"
        problem="The AirPassengers dataset (1949–1960, monthly) shows exponential growth with increasing seasonal amplitude. Identify and fit an appropriate SARIMA model."
        solution={[
          {
            step: "Log-transform to stabilize variance",
            formula: "z_t = \\ln(y_t)",
            explanation: "Multiplicative seasonal pattern → log transforms it to additive, stabilizing variance across the trend.",
          },
          {
            step: "Apply seasonal and regular differencing",
            formula: "w_t = (1-B)(1-B^{12}) z_t",
            explanation: "D=1 seasonal differencing removes the seasonal pattern. d=1 regular differencing removes the linear trend. ADF confirms stationarity.",
          },
          {
            step: "Identify non-seasonal and seasonal MA(1) terms from ACF",
            formula: "\\text{ACF: significant spike at lag 1 and lag 12 only}",
            explanation: "Single spike at lag 1 → non-seasonal MA(1). Single spike at lag 12 → seasonal MA(1). Both cut off → pure MA terms → SARIMA(0,1,1)(0,1,1)[12].",
          },
          {
            step: "Fit airline model and check diagnostics",
            formula: "(1-B)(1-B^{12})\\ln y_t = (1 + \\theta_1 B)(1 + \\Theta_1 B^{12})\\varepsilon_t",
            explanation: "θ₁ ≈ -0.40, Θ₁ ≈ -0.62. Ljung-Box test shows white noise residuals. Model fits well with AIC = -227.",
          },
        ]}
      />

      <WarningBlock title="Over-differencing">
        Applying too many differences (d=2 or D=2) can induce artificial autocorrelation and
        worsen forecasts. The KPSS test (H0: stationarity) can complement ADF to avoid
        over-differencing. Use d=1 and D=1 for most economic and business series.
      </WarningBlock>

      <h2>Python: SARIMAX and AutoARIMA</h2>
      <PythonCode
        code={pythonCode}
        filename="sarima.py"
        title="SARIMA — airline passenger example with statsmodels and statsforecast"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
