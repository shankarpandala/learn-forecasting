import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Simulate residuals — either good (WN) or bad (autocorrelated)
function simResiduals(type, n = 80) {
  const res = [];
  let y = 0;
  for (let t = 0; t < n; t++) {
    const u = Math.sin(t * 73.1 + 11.3) * 2.1 + Math.cos(t * 29.7) * 1.8;
    if (type === 'good') {
      y = u;
    } else if (type === 'autocorr') {
      y = 0.7 * y + u * 0.5;
    } else {
      // heteroskedastic
      const scale = 1 + 0.03 * t;
      y = u * scale;
    }
    res.push({ t, y: Math.round(y * 100) / 100 });
  }
  return res;
}

function computeSampleACF(data, maxLag = 15) {
  const y = data.map(d => d.y);
  const mean = y.reduce((a, b) => a + b, 0) / y.length;
  const denom = y.reduce((s, v) => s + (v - mean) ** 2, 0);
  return Array.from({ length: maxLag }, (_, k) => {
    const lag = k + 1;
    const num = y.slice(lag).reduce((s, v, i) => s + (v - mean) * (y[i] - mean), 0);
    return { lag, acf: Math.round((num / denom) * 1000) / 1000 };
  });
}

function ResidualDiagViz() {
  const [type, setType] = useState('good');
  const residuals = simResiduals(type);
  const acfData = computeSampleACF(residuals);
  const confBound = 1.96 / Math.sqrt(residuals.length);

  const mean = residuals.reduce((s, d) => s + d.y, 0) / residuals.length;
  const variance = residuals.reduce((s, d) => s + (d.y - mean) ** 2, 0) / residuals.length;

  const labels = { good: 'Good residuals (white noise)', autocorr: 'Autocorrelated residuals', hetero: 'Heteroskedastic residuals' };

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
      <h3 className="text-lg font-semibold text-sky-900 mb-1">Interactive: Residual Diagnostics</h3>
      <p className="text-sm text-sky-700 mb-4">Compare residual patterns from different misspecifications.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(labels).map(([k, label]) => (
          <button key={k} onClick={() => setType(k)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${type === k ? 'bg-sky-600 text-white' : 'bg-white border border-sky-200 text-sky-700 hover:bg-sky-50'}`}>
            {label.split(' ')[0]}
          </button>
        ))}
      </div>
      <p className="text-sm font-medium text-sky-800 mb-3">{labels[type]}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-center text-sky-600 mb-1">Residuals over time</p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={residuals} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="t" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="y" stroke="#0284c7" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-xs text-center text-sky-600 mb-1">Residual ACF</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={acfData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="lag" tick={{ fontSize: 9 }} />
              <YAxis domain={[-1, 1]} tick={{ fontSize: 9 }} />
              <ReferenceLine y={confBound} stroke="#f97316" strokeDasharray="4 2" />
              <ReferenceLine y={-confBound} stroke="#f97316" strokeDasharray="4 2" />
              <Bar dataKey="acf" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-white p-3 border border-sky-100 text-sm">
        <span className="font-medium text-sky-700">Summary: </span>
        {type === 'good' && 'Mean ≈ 0, variance constant, ACF within bands — consistent with white noise. Model is well-specified.'}
        {type === 'autocorr' && 'ACF shows significant autocorrelation — model has not captured all temporal structure. Add AR/MA terms or increase differencing.'}
        {type === 'hetero' && 'Variance grows over time — heteroskedasticity present. Consider GARCH model, Box-Cox transformation, or weighted regression.'}
      </div>
    </div>
  );
}

const PYTHON_CODE = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.stats.diagnostic import acorr_ljungbox
from statsmodels.tsa.statespace.sarimax import SARIMAX
from scipy import stats

# ─── Fit SARIMA to airline data ───────────────────────────────────────────────
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
df = pd.read_csv(url, index_col=0, parse_dates=True)
df.columns = ['passengers']
df.index.freq = 'MS'
y = np.log(df['passengers'])

model = SARIMAX(y, order=(1,1,1), seasonal_order=(1,1,1,12), trend='n')
result = model.fit(disp=False)
resid = result.resid.dropna()

# ─── 1. Basic checks ──────────────────────────────────────────────────────────
print(f"Residual mean : {resid.mean():.6f}  (should be ~0)")
print(f"Residual std  : {resid.std():.4f}")
print(f"Residual min  : {resid.min():.4f}")
print(f"Residual max  : {resid.max():.4f}")

# ─── 2. Ljung-Box test for autocorrelation ────────────────────────────────────
# H0: no autocorrelation up to lag h
lb_results = acorr_ljungbox(resid, lags=[10, 15, 20], return_df=True)
print("\\nLjung-Box test:")
print(lb_results)
# p > 0.05 -> fail to reject H0 -> no significant autocorrelation (good!)

# ─── 3. Normality test (Jarque-Bera) ─────────────────────────────────────────
jb_stat, jb_p = stats.jarque_bera(resid)
print(f"\\nJarque-Bera normality test:")
print(f"  Statistic: {jb_stat:.4f}")
print(f"  p-value:   {jb_p:.4f}")
print(f"  {'Normal residuals' if jb_p > 0.05 else 'Non-normal residuals — check for outliers'}")

# ─── 4. Heteroskedasticity check (squared residual ACF) ──────────────────────
from statsmodels.stats.diagnostic import het_arch
arch_stat, arch_p, f_stat, f_p = het_arch(resid, nlags=5)
print(f"\\nARCH test for heteroskedasticity:")
print(f"  p-value: {arch_p:.4f}")
print(f"  {'No ARCH effects' if arch_p > 0.05 else 'ARCH effects present — consider GARCH model'}")

# ─── 5. Visual diagnostics ───────────────────────────────────────────────────
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Residuals over time
axes[0,0].plot(resid.index, resid.values, color='steelblue', linewidth=1)
axes[0,0].axhline(0, color='red', linestyle='--')
axes[0,0].set_title('Residuals over time')
axes[0,0].grid(alpha=0.3)

# Histogram + normal density
axes[0,1].hist(resid, bins=20, density=True, edgecolor='black', alpha=0.7)
x = np.linspace(resid.min(), resid.max(), 100)
axes[0,1].plot(x, stats.norm.pdf(x, resid.mean(), resid.std()), 'r-', linewidth=2)
axes[0,1].set_title('Residual histogram')
axes[0,1].grid(alpha=0.3)

# QQ plot
stats.probplot(resid, dist='norm', plot=axes[1,0])
axes[1,0].set_title('Normal Q-Q plot')
axes[1,0].grid(alpha=0.3)

# ACF of residuals
from statsmodels.graphics.tsaplots import plot_acf
plot_acf(resid, lags=20, ax=axes[1,1], title='ACF of residuals', alpha=0.05)
axes[1,1].grid(alpha=0.3)

plt.tight_layout()
plt.show()
`;

export default function ResidualDiagnosticsSection() {
  return (
    <SectionLayout
      title="Residual Diagnostics"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['ACF & PACF', 'The Forecasting Workflow']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Why Residual Diagnostics?</h2>
          <p className="text-gray-700 leading-relaxed">
            A well-specified model should produce residuals that are indistinguishable from
            white noise. If the residuals still contain structure (autocorrelation, trend,
            heteroskedasticity, non-normality), the model has not fully extracted the
            predictable information from the data. Residual diagnostics are the primary
            tool for detecting misspecification.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Properties of Good Residuals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Zero mean', desc: 'E[e_t] ≈ 0 for all t. A non-zero mean indicates a missing constant term.', formula: '\\bar{e} = \\frac{1}{T}\\sum_t e_t \\approx 0' },
              { title: 'No autocorrelation', desc: 'Cov(e_t, e_{t-k}) ≈ 0 for all k ≠ 0. Autocorrelated residuals indicate unexploited structure.', formula: '\\hat{\\rho}(k) \\approx 0 \\text{ for } k \\neq 0' },
              { title: 'Constant variance', desc: 'Var(e_t) ≈ σ² (homoskedastic). Growing variance suggests a transformation is needed.', formula: '\\mathrm{Var}(e_t) = \\sigma^2 < \\infty' },
              { title: 'Normal distribution', desc: 'e_t ~ N(0, σ²) (ideally). Required for valid prediction intervals. Mild departures are acceptable.', formula: 'e_t \\sim \\mathcal{N}(0, \\sigma^2)' },
            ].map(({ title, desc, formula }) => (
              <div key={title} className="rounded-lg border border-sky-200 bg-sky-50 p-4">
                <h4 className="font-semibold text-sky-900 mb-1">{title}</h4>
                <p className="text-sm text-sky-800 mb-2">{desc}</p>
                <BlockMath math={formula} />
              </div>
            ))}
          </div>
        </section>

        <DefinitionBlock
          label="Definition 4.4"
          title="Ljung-Box Test"
          definition="The Ljung-Box (LB) test is a portmanteau test for the joint null hypothesis that the first h autocorrelations of the residuals are all zero. The test statistic follows approximately a chi-squared distribution with h degrees of freedom (or h - p - q for ARIMA residuals)."
          notation="Q_{LB}(h) = T(T+2)\sum_{k=1}^{h}\frac{\hat{\rho}(k)^2}{T-k} \sim \chi^2(h)"
        />

        <NoteBlock type="tip" title="Choosing the Lag Length for Ljung-Box">
          The choice of <InlineMath math="h" /> in the Ljung-Box test matters. Common
          recommendations:
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li>For non-seasonal data: use <InlineMath math="h = 10" /> or <InlineMath math="h = \min(T/5, 10)" /></li>
            <li>For seasonal data with period m: use <InlineMath math="h = 2m" /></li>
            <li>Degrees of freedom: <InlineMath math="h - p - q" /> for ARMA(p,q) residuals</li>
          </ul>
          A p-value above 0.05 means we fail to reject the null of no autocorrelation —
          the residuals are consistent with white noise.
        </NoteBlock>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">QQ Plot for Normality</h2>
          <p className="text-gray-700 mb-3">
            A normal QQ (quantile-quantile) plot compares the empirical quantiles of the
            residuals against the theoretical quantiles of a normal distribution. Points
            lying close to the 45° line indicate normality. Deviations in the tails indicate
            heavy tails (over-dispersed residuals) or skewness.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { pattern: 'Points on the line', meaning: 'Residuals are approximately normal — prediction intervals are reliable', status: 'good' },
              { pattern: 'S-shape deviation', meaning: 'Heavy tails (leptokurtic) — intervals too narrow. Consider t-distribution for errors', status: 'warn' },
              { pattern: 'Skewed curve', meaning: 'Asymmetric residuals — may indicate need for transformation or missing variable', status: 'warn' },
            ].map(({ pattern, meaning, status }) => (
              <div key={pattern} className={`rounded-lg p-3 border text-sm ${status === 'good' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <h5 className={`font-semibold mb-1 ${status === 'good' ? 'text-green-900' : 'text-yellow-900'}`}>{pattern}</h5>
                <p className={status === 'good' ? 'text-green-800' : 'text-yellow-800'}>{meaning}</p>
              </div>
            ))}
          </div>
        </section>

        <ResidualDiagViz />

        <ExampleBlock
          title="Diagnosing SARIMA Residuals"
          difficulty="intermediate"
          problem="After fitting SARIMA(1,1,1)(1,1,1)[12] to log airline passengers, the residual diagnostics show: mean = 0.001, Ljung-Box p-value (h=24) = 0.32, Jarque-Bera p = 0.09, a slight S-curve in the QQ plot. Is the model adequate?"
          solution={[
            { step: 'Check mean', explanation: 'Mean ≈ 0.001 ≈ 0. No systematic bias. Pass.' },
            { step: 'Check autocorrelation', explanation: 'Ljung-Box p = 0.32 >> 0.05. Fail to reject H₀ of no autocorrelation. Residuals are uncorrelated. Pass.' },
            { step: 'Check normality', explanation: 'Jarque-Bera p = 0.09 > 0.05. Fail to reject normality. The slight S-curve in the QQ plot is acceptable with 120 observations. Pass.' },
            { step: 'Overall assessment', explanation: 'All diagnostic tests pass. The model is adequately specified. Prediction intervals based on the normal distribution are appropriate for this series.' },
          ]}
        />

        <WarningBlock title="Residuals vs Innovations">
          In ARIMA/SARIMA models, distinguish between one-step-ahead residuals (innovations)
          and multi-step-ahead errors. Ljung-Box and other diagnostic tests apply to the
          one-step-ahead residuals. Multi-step forecast errors have increasing variance and
          are generally correlated — this is expected behaviour, not a model defect.
        </WarningBlock>

        <PythonCode
          title="Residual Diagnostics for SARIMA with statsmodels"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              authors: 'Ljung, G.M. & Box, G.E.P.',
              year: 1978,
              title: 'On a measure of lack of fit in time series models',
              venue: 'Biometrika, 65(2), 297–303',
              type: 'paper',
              whyImportant: 'Introduces the Ljung-Box modification of the Box-Pierce portmanteau statistic, which has better finite-sample properties.',
            },
            {
              authors: 'Box, G.E.P. & Pierce, D.A.',
              year: 1970,
              title: 'Distribution of residual autocorrelations in autoregressive-integrated moving average time series models',
              venue: 'Journal of the American Statistical Association, 65(332), 1509–1526',
              type: 'paper',
              whyImportant: 'Original portmanteau test paper. The test is fundamental to the Box-Jenkins model diagnostic step.',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
