import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

const WORKFLOW_STEPS = [
  {
    number: 1,
    title: 'Problem Definition',
    color: 'sky',
    description: 'Define what needs to be forecast, the forecast horizon, required accuracy, and how the forecasts will be used. A poorly specified problem is the most common cause of forecasting failure.',
    keyQuestions: ['What is the decision this forecast will inform?', 'What horizon is needed? (hours, days, months?)', 'What frequency of updates is required?', 'What level of aggregation? (SKU, category, total?)'],
  },
  {
    number: 2,
    title: 'Data Collection',
    color: 'cyan',
    description: 'Gather historical data for the target variable and any potential explanatory variables. Assess data quality: missing values, outliers, changes in data collection methods.',
    keyQuestions: ['How much history is available?', 'Are there known structural breaks?', 'What external drivers might be useful predictors?', 'Is data regularly spaced in time?'],
  },
  {
    number: 3,
    title: 'Exploratory Data Analysis',
    color: 'teal',
    description: 'Visualise the series to identify trend, seasonality, outliers, and structural breaks. Compute summary statistics. ACF/PACF plots reveal autocorrelation structure.',
    keyQuestions: ['Is there a trend? Is it linear or nonlinear?', 'What seasonality patterns exist?', 'Are there outliers or level shifts?', 'Is the variance stable or growing?'],
  },
  {
    number: 4,
    title: 'Model Selection & Fitting',
    color: 'sky',
    description: 'Choose model class(es) based on EDA findings. Fit on training data. Consider multiple candidate models and use information criteria (AIC, BIC) or cross-validation to compare.',
    keyQuestions: ['Stationary or non-stationary series?', 'Additive or multiplicative components?', 'Are external regressors available?', 'How complex a model is warranted?'],
  },
  {
    number: 5,
    title: 'Evaluation & Diagnostics',
    color: 'cyan',
    description: 'Evaluate on a held-out test set or via time-series cross-validation. Check residuals for autocorrelation, normality, and heteroskedasticity. Compare against simple benchmarks.',
    keyQuestions: ['Do residuals look like white noise?', 'Are coverage probabilities correct?', 'Does the model beat a naive benchmark?', 'Is performance stable over time?'],
  },
  {
    number: 6,
    title: 'Deployment & Monitoring',
    color: 'teal',
    description: 'Deploy forecasts into the operational system. Monitor forecast errors in production. Re-train periodically or when performance degrades. Document assumptions.',
    keyQuestions: ['How will forecasts be updated with new data?', 'What triggers a model re-evaluation?', 'How are forecast errors communicated to stakeholders?', 'Is there a fallback model?'],
  },
];

function WorkflowDiagram() {
  const [activeStep, setActiveStep] = useState(null);
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-sky-900">The Forecasting Workflow</h3>
      <p className="mb-4 text-sm text-sky-700">Click any step to expand details.</p>
      <div className="flex flex-col gap-2">
        {WORKFLOW_STEPS.map((step, i) => (
          <div key={step.number}>
            <button
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className={`w-full flex items-center gap-4 rounded-lg px-4 py-3 text-left transition-all ${
                activeStep === i
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white border border-sky-200 text-sky-900 hover:bg-sky-100'
              }`}
            >
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === i ? 'bg-white text-sky-600' : 'bg-sky-600 text-white'}`}>
                {step.number}
              </span>
              <span className="font-semibold">{step.title}</span>
              <span className={`ml-auto text-sm ${activeStep === i ? 'text-sky-200' : 'text-sky-400'}`}>
                {activeStep === i ? '▲' : '▼'}
              </span>
            </button>
            {activeStep === i && (
              <div className="bg-white border border-sky-200 border-t-0 rounded-b-lg p-4">
                <p className="text-gray-700 mb-3">{step.description}</p>
                <h5 className="font-semibold text-sky-800 mb-2 text-sm">Key questions:</h5>
                <ul className="space-y-1">
                  {step.keyQuestions.map((q, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-sky-500 mt-0.5">•</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {i < WORKFLOW_STEPS.length - 1 && (
              <div className="flex justify-center py-1">
                <span className="text-sky-400 text-lg">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const PYTHON_CODE = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.seasonal import seasonal_decompose

# ─── Step 1: Load data ────────────────────────────────────────────────────────
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
df = pd.read_csv(url, index_col=0, parse_dates=True)
df.columns = ['passengers']
df.index.freq = 'MS'

# ─── Step 2: Train / validation / test split ─────────────────────────────────
# Use the last 24 months as test, the 24 before that as validation
n = len(df)
train = df.iloc[:n-24]
val   = df.iloc[n-24:n-12]
test  = df.iloc[n-12:]

print(f"Train: {len(train)} obs  ({train.index[0].date()} – {train.index[-1].date()})")
print(f"Val  : {len(val)} obs  ({val.index[0].date()} – {val.index[-1].date()})")
print(f"Test : {len(test)} obs  ({test.index[0].date()} – {test.index[-1].date()})")

# ─── Step 3: Fit SARIMA on training data only ─────────────────────────────────
model = SARIMAX(train['passengers'],
                order=(1, 1, 1),
                seasonal_order=(1, 1, 1, 12),
                trend='c')
fitted = model.fit(disp=False)
print(fitted.summary())

# ─── Step 4: Forecast the validation period ───────────────────────────────────
fc_val = fitted.get_forecast(steps=12)
fc_mean = fc_val.predicted_mean
fc_ci   = fc_val.conf_int(alpha=0.05)

mae_val = np.mean(np.abs(fc_mean.values - val['passengers'].values))
print(f"\\nValidation MAE: {mae_val:.1f}")

# ─── Step 5: Residual check ───────────────────────────────────────────────────
residuals = fitted.resid
print(f"Residual mean : {residuals.mean():.4f}  (should be ~0)")
print(f"Residual std  : {residuals.std():.4f}")

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(residuals)
axes[0].axhline(0, color='red', linestyle='--')
axes[0].set_title('Residuals over time')

axes[1].hist(residuals, bins=20, edgecolor='black')
axes[1].set_title('Residual distribution')
plt.tight_layout()
plt.show()
`;

const CV_CODE = `import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error

def time_series_cv(series, model_fn, min_train=36, horizon=12, step=12):
    """
    Expanding-window time-series cross-validation.

    Parameters
    ----------
    series    : pd.Series  – the full time series
    model_fn  : callable   – takes a Series, returns an array of h forecasts
    min_train : int        – minimum training window size
    horizon   : int        – forecast horizon per fold
    step      : int        – how far to advance the origin each fold
    """
    errors = []
    n = len(series)
    origins = range(min_train, n - horizon + 1, step)

    for origin in origins:
        train = series.iloc[:origin]
        actual = series.iloc[origin:origin + horizon].values
        forecasts = model_fn(train)
        mae = mean_absolute_error(actual, forecasts[:horizon])
        errors.append({'origin': series.index[origin], 'mae': mae})
        print(f"  Origin {series.index[origin].date()}: MAE = {mae:.2f}")

    results = pd.DataFrame(errors)
    print(f"\\nMean CV MAE: {results['mae'].mean():.2f} ± {results['mae'].std():.2f}")
    return results

# Example: naive seasonal benchmark (repeat last year)
def naive_seasonal(train, m=12):
    last_season = train.values[-m:]
    return np.tile(last_season, 3)   # enough repetitions for any horizon

# Uncomment to run (requires the airline data loaded as 'df'):
# results = time_series_cv(df['passengers'], naive_seasonal)
`;

export default function ForecastingWorkflowSection() {
  return (
    <SectionLayout
      title="The Forecasting Workflow"
      difficulty="beginner"
      readingTime={25}
      prerequisites={['What is Forecasting?']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            Good forecasting is not just model selection — it is a structured process that
            begins before any data is loaded and continues after the model is deployed.
            Hyndman & Athanasopoulos describe a six-step cycle that applies regardless of the
            methods used. Skipping steps, especially problem definition and residual
            diagnostics, is the most common source of poor real-world performance.
          </p>
        </section>

        <WorkflowDiagram />

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Train / Validation / Test Splits</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Unlike in cross-sectional machine learning, time series data must be split
            respecting the temporal order. Future data must <em>never</em> be used to inform
            a model that is then evaluated on the past — this is called <strong>look-ahead bias</strong>{' '}
            or <strong>data leakage</strong>.
          </p>
          <div className="rounded-lg border border-sky-200 bg-white p-4 font-mono text-sm">
            <div className="flex gap-1 mb-2">
              <div className="flex-1 bg-sky-200 text-sky-900 rounded px-2 py-3 text-center font-semibold">
                Training set
              </div>
              <div className="w-24 bg-cyan-300 text-cyan-900 rounded px-2 py-3 text-center font-semibold">
                Validation
              </div>
              <div className="w-24 bg-orange-200 text-orange-900 rounded px-2 py-3 text-center font-semibold">
                Test set
              </div>
            </div>
            <div className="flex gap-1 text-xs text-gray-500">
              <div className="flex-1 text-center">Fit model here</div>
              <div className="w-24 text-center">Tune hyperparameters</div>
              <div className="w-24 text-center">Final evaluation only</div>
            </div>
          </div>
          <p className="mt-3 text-gray-700 text-sm">
            The test set should be used <strong>exactly once</strong>. Repeatedly evaluating
            on the test set and selecting based on test performance is a form of overfitting
            to the test period.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">
            Time Series Cross-Validation
          </h2>
          <p className="text-gray-700 mb-4">
            For longer series, rolling or expanding-window cross-validation gives a more
            reliable estimate of forecast accuracy than a single train/validation split.
          </p>
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 font-mono text-xs overflow-x-auto">
            {[
              { train: 24, gap: 0, fc: 12, fold: 1 },
              { train: 36, gap: 0, fc: 12, fold: 2 },
              { train: 48, gap: 0, fc: 12, fold: 3 },
            ].map(({ train, fc, fold }) => (
              <div key={fold} className="flex items-center gap-1 mb-1">
                <span className="w-12 text-sky-600">Fold {fold}:</span>
                {Array.from({ length: train }, (_, i) => (
                  <span key={i} className="w-3 h-4 bg-sky-400 inline-block rounded-sm" title="Training" />
                ))}
                {Array.from({ length: fc }, (_, i) => (
                  <span key={i} className="w-3 h-4 bg-orange-300 inline-block rounded-sm ml-0.5" title="Forecast" />
                ))}
              </div>
            ))}
            <div className="mt-2 flex gap-4 text-xs">
              <span><span className="inline-block w-3 h-3 bg-sky-400 rounded-sm mr-1" />Training</span>
              <span><span className="inline-block w-3 h-3 bg-orange-300 rounded-sm mr-1" />Forecast evaluation</span>
            </div>
          </div>
        </section>

        <WarningBlock title="Look-Ahead Bias (Data Leakage)">
          <p>The most damaging mistake in time series forecasting is using future information
          during model training or feature engineering. Common sources include:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li>Scaling/normalising using statistics from the full dataset (including test period)</li>
            <li>Feature engineering using rolling windows that include future observations</li>
            <li>Selecting model hyperparameters by evaluating on the test set multiple times</li>
            <li>Including target-leaking features that are only known in hindsight</li>
          </ul>
          <p className="mt-2">Always compute transformations and statistics using only the training
          window available at each forecast origin.</p>
        </WarningBlock>

        <PythonCode
          title="Basic Forecasting Workflow with statsmodels"
          code={PYTHON_CODE}
          runnable
        />

        <PythonCode
          title="Expanding-Window Time Series Cross-Validation"
          code={CV_CODE}
          runnable
        />

        <NoteBlock type="fpp3" title="FPP3 Reference">
          Hyndman & Athanasopoulos cover the forecasting workflow in Chapter 1 (Getting
          started) and time series cross-validation in Section 5.10 of{' '}
          <em>Forecasting: Principles and Practice</em> (3rd ed.). The{' '}
          <code>stretch_tsibble()</code> function in R implements the expanding-window
          CV scheme described here.
        </NoteBlock>

        <ExampleBlock
          title="Choosing a Forecast Horizon"
          difficulty="beginner"
          problem="A retail company replenishes warehouse stock every two weeks. Lead time from suppliers is 3 weeks. What forecast horizon is required, and at what granularity?"
          solution={[
            {
              step: 'Identify the decision cycle',
              explanation: 'Replenishment decisions are made every 2 weeks, so the forecast must cover at least the next 2-week period plus lead time.',
            },
            {
              step: 'Account for lead time',
              explanation: 'With a 3-week supplier lead time, an order placed today arrives in week 3. The forecast horizon must therefore be at least 3 + 2 = 5 weeks to cover the full replenishment cycle.',
            },
            {
              step: 'Choose granularity',
              explanation: 'Weekly granularity is appropriate: fine enough to capture demand patterns while matching the replenishment cycle. Daily granularity would over-specify the problem; monthly would be too coarse.',
            },
            {
              step: 'Determine aggregation level',
              explanation: 'Forecast at SKU × warehouse level — this is the decision unit. Aggregated category forecasts cannot drive individual replenishment decisions.',
            },
          ]}
        />

        <ReferenceList
          references={[
            {
              authors: 'Hyndman, R.J. & Athanasopoulos, G.',
              year: 2021,
              title: 'Forecasting: Principles and Practice (3rd ed.), Chapter 1',
              venue: 'OTexts',
              type: 'book',
              whyImportant: 'Introduces the forecasting workflow and the importance of problem framing before model selection.',
            },
            {
              authors: 'Tashman, L.J.',
              year: 2000,
              title: 'Out-of-sample tests of forecasting accuracy: an analysis and review',
              venue: 'International Journal of Forecasting, 16(4), 437–450',
              type: 'paper',
              whyImportant: 'Definitive analysis of evaluation methodology for time series, including the dangers of in-sample overfitting.',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
