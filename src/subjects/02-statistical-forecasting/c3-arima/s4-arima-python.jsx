import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

const statsmodelsCode = `# statsmodels ARIMA API — full walkthrough
# pip install statsmodels

import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX

# Prepare data
np.random.seed(42)
n = 120
t = np.arange(n)
y = 50 + 0.5 * t + 5 * np.sin(2 * np.pi * t / 12) + np.random.normal(0, 3, n)
ts = pd.Series(y, index=pd.date_range("2015-01", periods=n, freq="MS"))

# ── Non-seasonal ARIMA ────────────────────────────────────────────────────────
model = ARIMA(ts, order=(2, 1, 1), trend='n')
fit = model.fit()

# Key results
print("Coefficients:")
print(fit.params)
print(f"\\nAIC:  {fit.aic:.2f}")
print(f"BIC:  {fit.bic:.2f}")
print(f"Log-likelihood: {fit.llf:.2f}")

# In-sample fitted values
fitted = fit.fittedvalues

# One-step-ahead prediction
pred1 = fit.get_prediction(start=0, end=n-1, dynamic=False)
pred_df = pred1.summary_frame(alpha=0.05)

# Multi-step forecast
fc = fit.get_forecast(steps=24)
fc_mean = fc.predicted_mean
fc_ci95 = fc.conf_int(alpha=0.05)
fc_ci80 = fc.conf_int(alpha=0.20)

print("\\n24-step forecast:")
print(pd.concat([fc_mean, fc_ci95], axis=1).round(2).head(8))

# Residual diagnostics
residuals = fit.resid
print(f"\\nResidual mean:   {residuals.mean():.4f}")
print(f"Residual std:    {residuals.std():.4f}")

from statsmodels.stats.diagnostic import acorr_ljungbox
lb_test = acorr_ljungbox(residuals, lags=[10, 20], return_df=True)
print("\\nLjung-Box test:")
print(lb_test)

# ── SARIMAX — also handles exogenous regressors ───────────────────────────────
# Create a dummy exogenous variable (e.g. promotion indicator)
exog = np.zeros(n)
exog[24:36] = 1   # promotion in months 24-35

sarimax_model = SARIMAX(
    ts,
    exog=exog,
    order=(1, 1, 1),
    seasonal_order=(1, 1, 1, 12),
    trend='n',
)
sarimax_fit = sarimax_model.fit(disp=False)
print("\\nSARIMAX with exogenous:")
print(f"  AIC={sarimax_fit.aic:.2f}")

# Forecast with future exog values
exog_future = np.zeros(12)
fc_sarimax = sarimax_fit.get_forecast(steps=12, exog=exog_future)
`;

const statsforecastCode = `# statsforecast AutoARIMA — production-grade, fast
# pip install statsforecast

import pandas as pd
import numpy as np
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA, ARIMA as SFArima

# Multi-series setup (statsforecast's strength)
np.random.seed(42)
n = 120

# Create 10 series at once
series_list = []
for i in range(10):
    t = np.arange(n)
    y = (50 + i*10) + (0.3 + i*0.05)*t + np.random.normal(0, 3, n)
    series_list.append(pd.DataFrame({
        'unique_id': f'series_{i}',
        'ds': pd.date_range("2015-01", periods=n, freq="MS"),
        'y': y,
    }))

df = pd.concat(series_list, ignore_index=True)

# ── AutoARIMA: automatic order selection per series ──────────────────────────
sf = StatsForecast(
    models=[
        AutoARIMA(season_length=12, information_criterion='aicc'),
    ],
    freq='MS',
    n_jobs=-1,   # parallel fitting
)
sf.fit(df)
forecasts = sf.predict(h=12, level=[80, 95])
print(f"Fitted {df['unique_id'].nunique()} series")
print(forecasts.head())

# ── Manual ARIMA order with statsforecast ────────────────────────────────────
sf2 = StatsForecast(
    models=[
        SFArima(order=(2, 1, 1), season_length=12),
        SFArima(order=(1, 1, 1), season_length=12),
    ],
    freq='MS', n_jobs=-1,
)
forecasts2 = sf2.forecast(df=df, h=12)
print("\\nManual ARIMA forecasts:")
print(forecasts2.head())

# ── Cross-validation for ARIMA ────────────────────────────────────────────────
cv_results = sf.cross_validation(
    df=df,
    h=12,
    step_size=12,
    n_windows=3,
)
from statsforecast.losses import mae, smape
print("\\nCross-validation results:")
print(cv_results.groupby('unique_id')['AutoARIMA'].apply(
    lambda x: pd.Series({'MAE': (x - cv_results.loc[x.index, 'y']).abs().mean()})
).head())
`;

const pipelineCode = `# End-to-end production ARIMA pipeline
# pip install statsforecast pmdarima pandas numpy scikit-learn

import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA
from statsforecast.losses import mae, smape, mase

# ── 1. Load and preprocess ────────────────────────────────────────────────────
def load_data():
    """Load time series in StatsForecast long format."""
    np.random.seed(0)
    n = 156  # 13 years monthly
    records = []
    for uid in ['product_A', 'product_B', 'product_C']:
        base = np.random.uniform(50, 200)
        trend = np.random.uniform(0.1, 0.5)
        seasonal_amp = np.random.uniform(5, 20)
        noise_std = np.random.uniform(2, 8)
        t = np.arange(n)
        y = base + trend*t + seasonal_amp*np.sin(2*np.pi*t/12) + \
            np.random.normal(0, noise_std, n)
        records.append(pd.DataFrame({
            'unique_id': uid,
            'ds': pd.date_range('2012-01', periods=n, freq='MS'),
            'y': np.maximum(y, 0),  # ensure non-negative
        }))
    return pd.concat(records, ignore_index=True)

df = load_data()

# ── 2. Train/test split ───────────────────────────────────────────────────────
cutoff = pd.Timestamp('2023-01')
train = df[df['ds'] < cutoff]
test  = df[df['ds'] >= cutoff]
H = test['ds'].nunique()
print(f"Train: {len(train)} rows | Test: {H} months per series")

# ── 3. Fit AutoARIMA ──────────────────────────────────────────────────────────
sf = StatsForecast(
    models=[AutoARIMA(season_length=12)],
    freq='MS', n_jobs=-1,
)
sf.fit(train)
forecasts = sf.predict(h=H, level=[80, 95])

# ── 4. Evaluate ───────────────────────────────────────────────────────────────
eval_df = test.merge(forecasts[['unique_id', 'ds', 'AutoARIMA']], on=['unique_id', 'ds'])
metrics = eval_df.groupby('unique_id').apply(lambda g: pd.Series({
    'MAE':   mean_absolute_error(g['y'], g['AutoARIMA']),
    'RMSE':  mean_squared_error(g['y'], g['AutoARIMA']) ** 0.5,
    'MAPE':  (np.abs((g['y'] - g['AutoARIMA']) / g['y'].replace(0, np.nan))).mean() * 100,
}))
print("\\nForecast metrics by series:")
print(metrics.round(3))

# ── 5. Cross-validation with rolling windows ─────────────────────────────────
cv = sf.cross_validation(df=train, h=12, step_size=6, n_windows=4)
cv_mae = cv.groupby('unique_id').apply(
    lambda g: mean_absolute_error(g['y'], g['AutoARIMA'])
)
print("\\nCV MAE (train):", cv_mae.round(2).to_dict())
`;

const comparisonData = [
  { lib: 'statsmodels ARIMA', speed: 'Slow (pure Python)', api: 'Manual order selection', nJobs: 'No', seriesAt: '1', prediction: 'Analytical', exog: 'Yes (SARIMAX)' },
  { lib: 'pmdarima auto_arima', speed: 'Moderate', api: 'Automated stepwise', nJobs: 'Limited', seriesAt: '1', prediction: 'Simulation', exog: 'Yes' },
  { lib: 'statsforecast AutoARIMA', speed: 'Very fast (Cython)', api: 'Automated, vectorized', nJobs: 'Yes (-1)', seriesAt: '1000s', prediction: 'Analytical', exog: 'No (use SARIMAX)' },
];

const references = [
  {
    label: 'statsmodels',
    title: 'statsmodels ARIMA documentation',
    authors: 'Seabold & Perktold',
    year: 2010,
    url: 'https://www.statsmodels.org/stable/tsa.html',
  },
  {
    label: 'statsforecast',
    title: 'Nixtla statsforecast — fast forecasting',
    authors: 'Garza et al.',
    year: 2022,
    url: 'https://nixtlaverse.nixtla.io/statsforecast/index.html',
  },
  {
    label: 'pmdarima',
    title: 'pmdarima: ARIMA estimators for Python',
    authors: 'Smith, T.',
    year: 2017,
    url: 'https://alkaline-ml.com/pmdarima/',
  },
];

export default function ARIMAPython() {
  return (
    <SectionLayout
      title="ARIMA in Python: statsmodels & statsforecast"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['ARIMA models', 'SARIMA']}
    >
      <p>
        Two main Python ecosystems cover ARIMA modeling: <strong>statsmodels</strong> (flexible,
        full diagnostics, suitable for single-series deep analysis) and{' '}
        <strong>statsforecast</strong> (fast, production-grade, handles thousands of series).
        This section provides a practical comparison and complete code for both.
      </p>

      <h2>1. Library Comparison</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm text-zinc-700 dark:text-zinc-300 border-collapse">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800">
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">Library</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">Speed</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">API</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">n_jobs</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">Multi-series</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">Pred. intervals</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">Exogenous</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-zinc-50 dark:bg-zinc-800/50'}>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 font-semibold">{row.lib}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5">{row.speed}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5">{row.api}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-center">{row.nJobs}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5">{row.seriesAt}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5">{row.prediction}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5">{row.exog}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoteBlock type="tip" title="When to Use Which">
        Use <strong>statsmodels</strong> for: single-series research, custom diagnostics,
        exogenous regressors (SARIMAX), transfer function models, intervention analysis.
        Use <strong>statsforecast</strong> for: production pipelines, retail/supply chain
        with many SKUs, M-competition style evaluations, speed-critical workflows.
      </NoteBlock>

      <h2>2. statsmodels: Full API Walkthrough</h2>
      <PythonCode
        code={statsmodelsCode}
        filename="statsmodels_arima.py"
        title="statsmodels ARIMA and SARIMAX complete API"
      />

      <h2>3. statsforecast: Fast Multi-Series AutoARIMA</h2>
      <PythonCode
        code={statsforecastCode}
        filename="statsforecast_arima.py"
        title="statsforecast AutoARIMA for multiple series"
      />

      <WarningBlock title="Prediction Interval Coverage">
        statsmodels prediction intervals assume Gaussian residuals. If residuals are
        heavy-tailed, coverage may be below nominal. Use simulation-based intervals or
        conformal prediction for distribution-free guarantees.
      </WarningBlock>

      <h2>4. Production Pipeline: End-to-End</h2>
      <PythonCode
        code={pipelineCode}
        filename="arima_pipeline.py"
        title="Complete ARIMA forecasting pipeline with cross-validation"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
