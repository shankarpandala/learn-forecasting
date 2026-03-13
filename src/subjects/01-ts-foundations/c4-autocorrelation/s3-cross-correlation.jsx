import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Simulate a leading/lagging relationship between two series
function genCCFData(leadLag = 3, n = 80) {
  const data = [];
  const x = [];
  const y = [];
  for (let t = 0; t < n; t++) {
    const noise = Math.sin(t * 37.3) * 1.5 + Math.cos(t * 19.7) * 1.2;
    const signal = 3 * Math.sin(2 * Math.PI * t / 12);
    x.push(signal + noise);
  }
  for (let t = 0; t < n; t++) {
    const lag_x = t >= leadLag ? x[t - leadLag] : 0;
    const noise = Math.sin(t * 57.1) * 1.2 + Math.cos(t * 83.3) * 0.9;
    y.push(0.8 * lag_x + noise);
  }
  return { x, y, data: x.map((v, t) => ({ t, x: Math.round(v * 100) / 100, y: Math.round(y[t] * 100) / 100 })) };
}

function computeCCF(xs, ys, maxLag = 15) {
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b) / n;
  const meanY = ys.reduce((a, b) => a + b) / n;
  const stdX = Math.sqrt(xs.reduce((s, v) => s + (v - meanX) ** 2, 0) / n);
  const stdY = Math.sqrt(ys.reduce((s, v) => s + (v - meanY) ** 2, 0) / n);

  const ccf = [];
  for (let k = -maxLag; k <= maxLag; k++) {
    let num = 0;
    let cnt = 0;
    for (let t = Math.max(0, k); t < Math.min(n, n + k); t++) {
      num += (xs[t] - meanX) * (ys[t - k] - meanY);
      cnt++;
    }
    ccf.push({ lag: k, ccf: Math.round((num / (cnt * stdX * stdY)) * 1000) / 1000 });
  }
  return ccf;
}

function CCFViz() {
  const [leadLag, setLeadLag] = useState(3);
  const { x, y, data } = genCCFData(leadLag);
  const ccfData = computeCCF(x, y);
  const confBound = 1.96 / Math.sqrt(x.length);

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
      <h3 className="text-lg font-semibold text-sky-900 mb-1">Interactive: Cross-Correlation Function</h3>
      <p className="text-sm text-sky-700 mb-4">
        Adjust the lead-lag relationship between series X and Y. The CCF spike reveals the true lag.
      </p>
      <div className="mb-4">
        <label className="block text-sm text-sky-800 mb-1">
          Y lags X by <span className="font-bold">{leadLag}</span> period{leadLag !== 1 && 's'}
        </label>
        <input type="range" min={0} max={12} value={leadLag}
          onChange={e => setLeadLag(Number(e.target.value))}
          className="w-full accent-sky-600" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-center text-sky-600 mb-1">Series X (leading) and Y (lagging)</p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={data.slice(0, 50)} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="t" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip />
              <Line type="monotone" dataKey="x" stroke="#0284c7" strokeWidth={1.5} dot={false} name="X (t)" />
              <Line type="monotone" dataKey="y" stroke="#dc2626" strokeWidth={1.5} dot={false} name="Y (t)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-xs text-center text-sky-600 mb-1">Cross-Correlation Function CCF(k)</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={ccfData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="lag" tick={{ fontSize: 9 }} />
              <YAxis domain={[-1, 1]} tick={{ fontSize: 9 }} />
              <ReferenceLine y={confBound} stroke="#f97316" strokeDasharray="4 2" />
              <ReferenceLine y={-confBound} stroke="#f97316" strokeDasharray="4 2" />
              <Bar dataKey="ccf" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="text-xs text-center text-sky-500 mt-2">
        Dominant CCF spike at lag −{leadLag} indicates X leads Y by {leadLag} period{leadLag !== 1 && 's'}.
      </p>
    </div>
  );
}

const PYTHON_CODE = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import grangercausalitytests, ccf

# ─── Simulate a leading-indicator relationship ────────────────────────────────
np.random.seed(42)
n = 150
t = np.arange(n)

# X is a leading indicator (e.g., business confidence index)
x = np.sin(2 * np.pi * t / 12) + np.random.normal(0, 0.5, n)

# Y responds to X with a lag of 3 periods (e.g., production output)
y = np.zeros(n)
for i in range(3, n):
    y[i] = 0.7 * x[i-3] + 0.3 * y[i-1] + np.random.normal(0, 0.4)

df = pd.DataFrame({'X': x, 'Y': y})

# ─── Cross-Correlation Function ───────────────────────────────────────────────
# CCF of Y with respect to X at lags k = -15, ..., +15
ccf_pos = ccf(df['Y'], df['X'], nlags=15, unbiased=False)
# For negative lags, compute CCF with arguments reversed
ccf_neg = ccf(df['X'], df['Y'], nlags=15, unbiased=False)

print("CCF(Y_t, X_{t-k}) for selected lags:")
for k in range(-5, 11):
    if k < 0:
        r = ccf_neg[-k]
    else:
        r = ccf_pos[k]
    sig = ' ***' if abs(r) > 1.96 / np.sqrt(n) else ''
    print(f"  lag {k:3d}: {r:7.4f}{sig}")

print(f"\\nPeak CCF at lag 3 (expected): {ccf_pos[3]:.4f}")

# ─── Granger causality test ───────────────────────────────────────────────────
print("\\n" + "=" * 60)
print("Granger Causality: Does X Granger-cause Y?")
print("=" * 60)
# H0: X does NOT Granger-cause Y (past X has no predictive power for Y beyond Y's own lags)
data = df[['Y', 'X']].dropna()
gc_result = grangercausalitytests(data, maxlag=5, verbose=True)

# ─── Reverse direction: Does Y Granger-cause X? ───────────────────────────────
print("\\n" + "=" * 60)
print("Granger Causality: Does Y Granger-cause X?")
print("=" * 60)
data_rev = df[['X', 'Y']].dropna()
gc_rev = grangercausalitytests(data_rev, maxlag=5, verbose=True)

# ─── Visualise ────────────────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].plot(t[:60], x[:60], label='X (leading)', color='steelblue')
axes[0].plot(t[:60], y[:60], label='Y (lagging, k=3)', color='red', alpha=0.8)
axes[0].set_title('X leads Y by 3 periods')
axes[0].legend()
axes[0].grid(alpha=0.3)

lags = np.arange(-15, 16)
ccf_vals = [ccf_neg[k] if k < 0 else ccf_pos[k] for k in lags]
axes[1].bar(lags, ccf_vals, color='purple', alpha=0.7)
axes[1].axhline(1.96/np.sqrt(n), color='orange', linestyle='--', label='95% CI')
axes[1].axhline(-1.96/np.sqrt(n), color='orange', linestyle='--')
axes[1].set_title('Cross-Correlation Function CCF(Y, X)')
axes[1].set_xlabel('Lag k')
axes[1].legend()
axes[1].grid(alpha=0.3)

plt.tight_layout()
plt.show()
`;

export default function CrossCorrelationSection() {
  return (
    <SectionLayout
      title="Cross-Correlation & Granger Causality"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['ACF & PACF', 'Stationarity Concepts']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            The cross-correlation function (CCF) extends the autocorrelation concept to pairs
            of time series, measuring the correlation between two series at various lead and
            lag offsets. It is the primary tool for identifying lead-lag relationships —
            situations where one series systematically predicts another series shifted in
            time. Such relationships are foundational to regression-based forecasting models
            with external regressors (ARIMAX, transfer function models).
          </p>
        </section>

        <DefinitionBlock
          label="Definition 4.5"
          title="Cross-Covariance Function"
          definition="For two jointly covariance-stationary series {x_t} and {y_t}, the cross-covariance function γ_{xy}(k) measures their covariance at lag k. Unlike the autocovariance, the CCF is generally not symmetric: γ_{xy}(k) ≠ γ_{xy}(-k). Instead, γ_{xy}(k) = γ_{yx}(-k)."
          notation="\gamma_{xy}(k) = \mathrm{Cov}(x_t,\, y_{t+k}) = \mathbb{E}\!\left[(x_t - \mu_x)(y_{t+k} - \mu_y)\right]"
        />

        <DefinitionBlock
          label="Definition 4.6"
          title="Cross-Correlation Function (CCF)"
          definition="The CCF normalises the cross-covariance by the product of the marginal standard deviations, yielding a dimensionless measure in [-1, 1]. A significant CCF at lag k means that x_t is correlated with y_{t+k} — i.e., x leads y by k periods (for k > 0) or y leads x by k periods (for k < 0)."
          notation="\rho_{xy}(k) = \frac{\gamma_{xy}(k)}{\sigma_x \sigma_y}, \quad \hat{\rho}_{xy}(k) = \frac{\sum_{t}(x_t - \bar{x})(y_{t+k} - \bar{y})}{\sqrt{\sum_t(x_t-\bar{x})^2 \sum_t (y_t-\bar{y})^2}}"
        />

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Lead-Lag Relationships</h2>
          <p className="text-gray-700 mb-3">
            The CCF at lag <InlineMath math="k" /> reveals whether one series anticipates
            another:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-100">
                  <th className="border border-sky-200 px-3 py-2">CCF peak location</th>
                  <th className="border border-sky-200 px-3 py-2">Interpretation</th>
                  <th className="border border-sky-200 px-3 py-2">Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['k > 0: ρ_xy(k) large', 'x_t is correlated with y_{t+k}: x leads y by k periods', 'Business confidence → GDP growth (k=2 quarters)'],
                  ['k < 0: ρ_xy(k) large', 'y_t is correlated with x_{t+k}: y leads x by |k| periods', 'Hiring activity → wage inflation'],
                  ['k = 0 only', 'Contemporaneous correlation only; no lead-lag', 'Two synchronised macro series'],
                  ['All k near zero', 'Series are uncorrelated at all lags', 'Unrelated time series'],
                ].map(row => (
                  <tr key={row[0]} className="border-b border-sky-100 hover:bg-sky-50">
                    {row.map((c, i) => (
                      <td key={i} className={`border border-sky-200 px-3 py-2 ${i === 0 ? 'font-mono text-sky-700' : ''}`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <CCFViz />

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Granger Causality</h2>
          <DefinitionBlock
            label="Definition 4.7"
            title="Granger Causality"
            definition="A time series x_t is said to Granger-cause y_t if past values of x contain information about future values of y beyond what is contained in the entire past of y alone. Formally, x Granger-causes y if the forecast of y_{t+1} from {y_t, y_{t-1},..., x_t, x_{t-1},...} has strictly lower mean squared error than the forecast from {y_t, y_{t-1},...} alone."
            notation="\mathrm{MSE}\!\left[\hat{y}_{t+1} \mid \mathcal{F}_t\right] < \mathrm{MSE}\!\left[\hat{y}_{t+1} \mid \mathcal{G}_t\right]"
          />
          <p className="text-gray-700 text-sm mt-2">
            where <InlineMath math="\mathcal{F}_t = \{y_s, x_s: s \le t\}" /> and{' '}
            <InlineMath math="\mathcal{G}_t = \{y_s: s \le t\}" />.
          </p>

          <p className="text-gray-700 mt-3 mb-2">
            In practice, the Granger causality test runs the VAR regression:
          </p>
          <BlockMath math="y_t = \alpha + \sum_{j=1}^{p}\beta_j y_{t-j} + \sum_{j=1}^{p}\gamma_j x_{t-j} + \varepsilon_t" />
          <p className="text-gray-700 text-sm">
            and tests <InlineMath math="H_0: \gamma_1 = \gamma_2 = \cdots = \gamma_p = 0" /> using an F-test.
            Rejecting <InlineMath math="H_0" /> means x Granger-causes y at lag order p.
          </p>
        </section>

        <NoteBlock type="info" title="Granger Causality is NOT True Causality">
          <p>
            Despite its name, Granger causality is a statement about <em>predictability</em>,
            not about economic or physical causation. Series can Granger-cause each other
            for several spurious reasons:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li><strong>Common driver:</strong> a third variable z causes both x and y — x may Granger-cause y simply because both respond to z with different lags.</li>
            <li><strong>Anticipation effects:</strong> forward-looking agents may adjust before the "cause" occurs, reversing the apparent causal direction.</li>
            <li><strong>Non-stationarity:</strong> spurious Granger causality can appear between integrated series if cointegration is not accounted for.</li>
          </ul>
          <p className="mt-2">
            Use Granger tests as evidence for useful predictors, not causal mechanisms.
            Causal inference from observational time series requires additional assumptions
            (e.g., structural identification in SVAR models).
          </p>
        </NoteBlock>

        <WarningBlock title="Pre-whiten Before Computing CCF">
          <p>
            If either series is autocorrelated, the sample CCF will be distorted — the
            autocorrelation of one series "bleeds" into the apparent cross-correlation.
            The standard remedy is <strong>pre-whitening</strong>:
          </p>
          <ol className="mt-2 space-y-1 list-decimal list-inside text-sm">
            <li>Fit an ARIMA model to <InlineMath math="x_t" /> and save the residuals <InlineMath math="\hat{\alpha}_t" /></li>
            <li>Apply the same filter to <InlineMath math="y_t" /> to get <InlineMath math="\hat{\beta}_t" /></li>
            <li>Compute the CCF of <InlineMath math="\hat{\alpha}_t" /> and <InlineMath math="\hat{\beta}_t" /></li>
          </ol>
          <p className="mt-2">The pre-whitened CCF isolates the true dynamic relationship between the two series.</p>
        </WarningBlock>

        <PythonCode
          title="Cross-Correlation and Granger Causality in Python"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              authors: 'Granger, C.W.J.',
              year: 1969,
              title: 'Investigating causal relations by econometric models and cross-spectral methods',
              venue: 'Econometrica, 37(3), 424–438',
              type: 'paper',
              whyImportant: 'Introduces Granger causality. Despite the name, Granger is careful to note that this is a statement about temporal precedence and predictability, not physical causation.',
            },
            {
              authors: 'Box, G.E.P. & Jenkins, G.M.',
              year: 1970,
              title: 'Time Series Analysis: Forecasting and Control',
              venue: 'Holden-Day',
              type: 'book',
              whyImportant: 'Describes the prewhitening procedure for computing unbiased cross-correlations in the context of transfer function model identification.',
            },
            {
              authors: 'Hyndman, R.J. & Athanasopoulos, G.',
              year: 2021,
              title: 'Forecasting: Principles and Practice (3rd ed.), Section 10.1',
              venue: 'OTexts',
              type: 'book',
              whyImportant: 'Accessible treatment of dynamic regression and cross-correlation in the forecasting context.',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
