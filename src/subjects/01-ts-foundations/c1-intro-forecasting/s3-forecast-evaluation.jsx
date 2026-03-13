import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Simulate a forecast scenario for the interactive demo
function generateData(noiseLevel) {
  const actual = [100, 110, 108, 115, 120, 118, 125, 130, 128, 135, 140, 138];
  const seed = noiseLevel / 10;
  const forecast = actual.map((v, i) => {
    const bias = seed * 5;
    const noise = (Math.sin(i * 1.7 + seed) * noiseLevel * 8);
    return Math.round((v + bias + noise) * 10) / 10;
  });
  return { actual, forecast };
}

function computeMetrics(actual, forecast) {
  const n = actual.length;
  const errors = actual.map((a, i) => a - forecast[i]);
  const absErrors = errors.map(Math.abs);
  const squaredErrors = errors.map(e => e * e);
  const pctErrors = actual.map((a, i) => Math.abs((a - forecast[i]) / a) * 100);

  const mae = absErrors.reduce((s, v) => s + v, 0) / n;
  const rmse = Math.sqrt(squaredErrors.reduce((s, v) => s + v, 0) / n);
  const mape = pctErrors.reduce((s, v) => s + v, 0) / n;
  // sMAPE
  const smape = actual.map((a, i) => {
    const denom = (Math.abs(a) + Math.abs(forecast[i])) / 2;
    return denom === 0 ? 0 : Math.abs(a - forecast[i]) / denom * 100;
  }).reduce((s, v) => s + v, 0) / n;
  // MASE with naive seasonal benchmark (use lag-1 naive here for simplicity)
  const naiveErrors = actual.slice(1).map((a, i) => Math.abs(a - actual[i]));
  const naiveMae = naiveErrors.reduce((s, v) => s + v, 0) / naiveErrors.length;
  const mase = mae / naiveMae;

  return {
    MAE: mae.toFixed(2),
    RMSE: rmse.toFixed(2),
    MAPE: mape.toFixed(2) + '%',
    sMAPE: smape.toFixed(2) + '%',
    MASE: mase.toFixed(3),
  };
}

function MetricsExplorer() {
  const [noiseLevel, setNoiseLevel] = useState(3);
  const { actual, forecast } = generateData(noiseLevel);
  const metrics = computeMetrics(actual, forecast);

  const max = Math.max(...actual, ...forecast);
  const min = Math.min(...actual, ...forecast);
  const range = max - min || 1;

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
      <h3 className="text-lg font-semibold text-sky-900 mb-1">Interactive: Error Metrics Explorer</h3>
      <p className="text-sm text-sky-700 mb-4">
        Adjust the noise slider to change forecast quality and watch how each metric responds.
      </p>
      <div className="mb-4">
        <label className="block text-sm font-medium text-sky-800 mb-1">
          Forecast noise level: <span className="font-bold">{noiseLevel}</span>
        </label>
        <input
          type="range" min={0} max={10} value={noiseLevel}
          onChange={e => setNoiseLevel(Number(e.target.value))}
          className="w-full accent-sky-600"
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg p-3 mb-4 border border-sky-100">
        <svg viewBox={`0 0 480 120`} className="w-full">
          {actual.map((v, i) => {
            const x = (i / (actual.length - 1)) * 440 + 20;
            const y = 110 - ((v - min) / range) * 100;
            const xNext = ((i + 1) / (actual.length - 1)) * 440 + 20;
            const yNext = i < actual.length - 1 ? 110 - ((actual[i + 1] - min) / range) * 100 : y;
            return i < actual.length - 1 ? (
              <line key={i} x1={x} y1={y} x2={xNext} y2={yNext} stroke="#0369a1" strokeWidth="2" />
            ) : null;
          })}
          {forecast.map((v, i) => {
            const x = (i / (forecast.length - 1)) * 440 + 20;
            const y = 110 - ((v - min) / range) * 100;
            const xNext = ((i + 1) / (forecast.length - 1)) * 440 + 20;
            const yNext = i < forecast.length - 1 ? 110 - ((forecast[i + 1] - min) / range) * 100 : y;
            return i < forecast.length - 1 ? (
              <line key={i} x1={x} y1={y} x2={xNext} y2={yNext} stroke="#f97316" strokeWidth="2" strokeDasharray="4 2" />
            ) : null;
          })}
          {actual.map((v, i) => {
            const x = (i / (actual.length - 1)) * 440 + 20;
            const y = 110 - ((v - min) / range) * 100;
            return <circle key={i} cx={x} cy={y} r="3" fill="#0369a1" />;
          })}
        </svg>
        <div className="flex gap-6 text-xs justify-center mt-1">
          <span><span className="inline-block w-4 h-0.5 bg-sky-700 mr-1 align-middle" />Actual</span>
          <span><span className="inline-block w-4 h-0.5 bg-orange-500 mr-1 align-middle border-dashed" style={{borderTop:'2px dashed #f97316', background:'transparent'}} />Forecast</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(metrics).map(([name, val]) => (
          <div key={name} className="bg-white rounded-lg p-3 text-center border border-sky-100 shadow-sm">
            <div className="text-xs text-sky-600 font-medium mb-1">{name}</div>
            <div className="text-lg font-bold text-sky-900">{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PYTHON_CODE = `import numpy as np
import pandas as pd

def mae(actual, forecast):
    """Mean Absolute Error"""
    return np.mean(np.abs(actual - forecast))

def rmse(actual, forecast):
    """Root Mean Squared Error"""
    return np.sqrt(np.mean((actual - forecast) ** 2))

def mape(actual, forecast):
    """Mean Absolute Percentage Error (undefined if any actual == 0)"""
    if np.any(actual == 0):
        raise ValueError("MAPE undefined for zero actuals")
    return np.mean(np.abs((actual - forecast) / actual)) * 100

def smape(actual, forecast):
    """Symmetric MAPE — bounded in [0, 200%]"""
    denom = (np.abs(actual) + np.abs(forecast)) / 2
    mask = denom > 0
    return np.mean(np.abs(actual[mask] - forecast[mask]) / denom[mask]) * 100

def mase(actual, forecast, seasonal_period=1):
    """
    Mean Absolute Scaled Error (Hyndman & Koehler, 2006).
    Scales MAE by the in-sample naive seasonal MAE.
    MASE < 1 means the model beats the naive seasonal benchmark.
    """
    n = len(actual)
    m = seasonal_period
    naive_errors = np.abs(actual[m:] - actual[:n-m])
    scale = np.mean(naive_errors)
    if scale == 0:
        raise ValueError("Scaling denominator is zero — constant series?")
    return mae(actual, forecast) / scale

def crps_normal(actual, mu, sigma):
    """
    Continuous Ranked Probability Score for a Normal predictive distribution.
    Lower is better; CRPS = MAE when sigma -> 0 (deterministic forecast).
    """
    from scipy import stats
    z = (actual - mu) / sigma
    phi = stats.norm.pdf(z)
    Phi = stats.norm.cdf(z)
    return np.mean(sigma * (z * (2 * Phi - 1) + 2 * phi - 1 / np.sqrt(np.pi)))

# ─── Example usage ───────────────────────────────────────────────────────────
np.random.seed(42)
n = 50
actual   = np.cumsum(np.random.randn(n)) + 100
forecast = actual + np.random.randn(n) * 5   # add forecast error

print(f"MAE  : {mae(actual, forecast):.3f}")
print(f"RMSE : {rmse(actual, forecast):.3f}")
print(f"MAPE : {mape(actual, forecast):.2f}%")
print(f"sMAPE: {smape(actual, forecast):.2f}%")
print(f"MASE : {mase(actual, forecast, seasonal_period=1):.3f}")

# Probabilistic: assume Gaussian predictive distribution
sigma_hat = 6.0   # predicted standard deviation
print(f"CRPS : {crps_normal(actual, forecast, sigma_hat):.3f}")
`;

export default function ForecastEvaluationSection() {
  return (
    <SectionLayout
      title="Forecast Evaluation Metrics"
      difficulty="beginner"
      readingTime={30}
      prerequisites={['The Forecasting Workflow']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Why Evaluation Matters</h2>
          <p className="text-gray-700 leading-relaxed">
            Selecting the right error metric is as important as selecting the right model.
            Different metrics have different sensitivities to outliers, different behaviours
            near zero, and different appropriateness for comparing forecasts across series
            with different scales. This section covers the most widely used metrics and when
            to prefer each.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Point Forecast Metrics</h2>
          <p className="text-gray-700 mb-4">
            Let <InlineMath math="y_t" /> be the actual value and{' '}
            <InlineMath math="\hat{y}_t" /> the forecast, with errors{' '}
            <InlineMath math="e_t = y_t - \hat{y}_t" /> over <InlineMath math="n" /> test periods.
          </p>

          <DefinitionBlock
            label="Definition 1.5"
            title="Mean Absolute Error (MAE)"
            definition="MAE is the average of the absolute forecast errors. It is easy to interpret (same units as the series) and treats all errors equally. Optimal under L1 loss; the minimising forecast is the conditional median."
            notation="\mathrm{MAE} = \frac{1}{n}\sum_{t=1}^{n}|e_t| = \frac{1}{n}\sum_{t=1}^{n}|y_t - \hat{y}_t|"
          />

          <DefinitionBlock
            label="Definition 1.6"
            title="Root Mean Squared Error (RMSE)"
            definition="RMSE is the square root of the mean squared error. It penalises large errors more heavily than MAE due to the squaring. Optimal under L2 loss; the minimising forecast is the conditional mean. RMSE >= MAE always, with equality only when all errors are equal."
            notation="\mathrm{RMSE} = \sqrt{\frac{1}{n}\sum_{t=1}^{n}e_t^2}"
          />

          <DefinitionBlock
            label="Definition 1.7"
            title="Mean Absolute Percentage Error (MAPE)"
            definition="MAPE expresses errors as a percentage of the actual values, making it scale-free. However, it is undefined when any actual value is zero and is asymmetric: over-forecasts are bounded at 100% while under-forecasts are unbounded."
            notation="\mathrm{MAPE} = \frac{100}{n}\sum_{t=1}^{n}\left|\frac{e_t}{y_t}\right|"
          />

          <DefinitionBlock
            label="Definition 1.8"
            title="Symmetric MAPE (sMAPE)"
            definition="sMAPE uses the average of actual and forecast in the denominator, making it symmetric and bounded in [0, 200%]. It was proposed to address MAPE's asymmetry but still has pathological behaviour when both actual and forecast are close to zero."
            notation="\mathrm{sMAPE} = \frac{100}{n}\sum_{t=1}^{n}\frac{|e_t|}{(|y_t|+|\hat{y}_t|)/2}"
          />

          <DefinitionBlock
            label="Definition 1.9"
            title="Mean Absolute Scaled Error (MASE)"
            definition="MASE scales the MAE by the in-sample MAE of the naive seasonal benchmark (repeat the value from m periods ago). A MASE < 1 means the model outperforms the naive seasonal benchmark. MASE is scale-free, well-defined for zero actuals, and suitable for comparing across series with different scales and units."
            notation="\mathrm{MASE} = \frac{\mathrm{MAE}}{\frac{1}{n-m}\sum_{t=m+1}^{n}|y_t - y_{t-m}|}"
          />
        </section>

        <NoteBlock type="info" title="Why MASE is Preferred for Cross-Dataset Comparison">
          MASE was introduced by Hyndman and Koehler (2006) specifically to address the
          shortcomings of MAPE and sMAPE for comparing forecast accuracy across series with
          different scales, units, or near-zero values. Because it divides by a meaningful
          in-sample baseline (the naive seasonal error), MASE is{' '}
          <strong>always finite</strong> (unless the series is constant), symmetric, and
          interpretable: a MASE of 0.8 means the model's MAE is 80% of the naive benchmark's MAE.
          It has been adopted as the primary metric in the M4 and M5 competitions.
        </NoteBlock>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Probabilistic Forecast Metrics</h2>

          <DefinitionBlock
            label="Definition 1.10"
            title="Continuous Ranked Probability Score (CRPS)"
            definition="CRPS evaluates a full predictive distribution F against the observed value y. It is the integral of the Brier score over all thresholds and can be written as the expected absolute error between the forecast CDF and the empirical CDF of the observation. For a deterministic forecast, CRPS reduces to MAE."
            notation="\mathrm{CRPS}(F, y) = \int_{-\infty}^{\infty}\left[F(x) - \mathbf{1}(x \ge y)\right]^2 dx"
          />

          <p className="text-gray-700 text-sm">
            For a Gaussian predictive distribution{' '}
            <InlineMath math="F = \mathcal{N}(\mu, \sigma^2)" />, CRPS has the closed form:
          </p>
          <BlockMath math="\mathrm{CRPS}\!\left(\mathcal{N}(\mu,\sigma^2), y\right) = \sigma\left[z\left(2\Phi(z)-1\right) + 2\phi(z) - \frac{1}{\sqrt{\pi}}\right], \quad z = \frac{y-\mu}{\sigma}" />
        </section>

        <MetricsExplorer />

        <WarningBlock title="MAPE Failures Near Zero">
          <p>MAPE has serious problems when actual values are near or equal to zero:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li>If <InlineMath math="y_t = 0" />, MAPE is undefined (division by zero).</li>
            <li>If <InlineMath math="y_t \approx 0" />, even small absolute errors produce enormous percentage errors.</li>
            <li>MAPE is asymmetric: a forecast of 0 when actual is 100 gives 100% error, but a forecast of 200 when actual is 100 gives 100% too — yet the latter is a much larger absolute mistake.</li>
          </ul>
          <p className="mt-2">Use MASE or RMSE when series contain zero or near-zero values (count data, intermittent demand).</p>
        </WarningBlock>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Metric Comparison Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-100">
                  {['Metric', 'Scale-free?', 'Handles zeros?', 'Outlier sensitive?', 'Preferred when'].map(h => (
                    <th key={h} className="border border-sky-200 px-3 py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['MAE', 'No', 'Yes', 'Low', 'Same-scale comparison, robust to outliers'],
                  ['RMSE', 'No', 'Yes', 'High', 'Large errors are especially costly'],
                  ['MAPE', 'Yes', 'No', 'Low', 'Business reporting (no zeros in data)'],
                  ['sMAPE', 'Yes', 'Partial', 'Low', 'When MAPE asymmetry is a concern'],
                  ['MASE', 'Yes', 'Yes', 'Low', 'Cross-series comparison, zero actuals'],
                  ['CRPS', 'No', 'Yes', 'Moderate', 'Evaluating full predictive distributions'],
                ].map(([m, sf, hz, os, pw]) => (
                  <tr key={m} className="border-b border-sky-100 hover:bg-sky-50">
                    <td className="border border-sky-200 px-3 py-2 font-mono font-semibold">{m}</td>
                    <td className="border border-sky-200 px-3 py-2">{sf}</td>
                    <td className="border border-sky-200 px-3 py-2">{hz}</td>
                    <td className="border border-sky-200 px-3 py-2">{os}</td>
                    <td className="border border-sky-200 px-3 py-2 text-gray-600">{pw}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <PythonCode
          title="Computing All Metrics with NumPy/SciPy"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              authors: 'Hyndman, R.J. & Koehler, A.B.',
              year: 2006,
              title: 'Another look at measures of forecast accuracy',
              venue: 'International Journal of Forecasting, 22(4), 679–688',
              type: 'paper',
              whyImportant: 'Introduces MASE and provides a comprehensive analysis of why MAPE and sMAPE have fundamental problems. The paper behind the preferred metric in modern forecasting competitions.',
            },
            {
              authors: 'Gneiting, T. & Raftery, A.E.',
              year: 2007,
              title: 'Strictly proper scoring rules, prediction, and estimation',
              venue: 'Journal of the American Statistical Association, 102(477), 359–378',
              type: 'paper',
              whyImportant: 'Foundational paper on proper scoring rules for probabilistic forecasts, including CRPS. Essential reading for anyone doing density forecasting.',
            },
            {
              authors: 'Makridakis, S., Spiliotis, E. & Assimakopoulos, V.',
              year: 2020,
              title: 'The M4 Competition: 100,000 time series and 61 forecasting methods',
              venue: 'International Journal of Forecasting, 36(1), 54–74',
              type: 'paper',
              whyImportant: 'Uses sMAPE and MASE as the primary evaluation metrics, making it a key reference for why these metrics are now standard.',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
