import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Generate heteroskedastic series and apply Box-Cox
function boxcox(y, lambda) {
  if (Math.abs(lambda) < 1e-9) return Math.log(y);
  return (Math.pow(y, lambda) - 1) / lambda;
}

function generateHeteroData(n = 72) {
  const data = [];
  for (let t = 0; t < n; t++) {
    const level = 50 + 1.2 * t;
    const noise = (Math.sin(t * 3.7) * 0.15 + Math.cos(t * 2.1) * 0.1) * level;
    const y = Math.max(0.1, level + noise);
    data.push({ t, y: Math.round(y * 100) / 100 });
  }
  return data;
}

function BoxCoxViz() {
  const [lambda, setLambda] = useState(0);
  const raw = generateHeteroData();
  const yVals = raw.map(d => d.y);
  const transformed = raw.map(d => ({ t: d.t, y: Math.round(boxcox(d.y, lambda) * 1000) / 1000 }));

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
      <h3 className="text-lg font-semibold text-sky-900 mb-1">Interactive: Box-Cox Transformation</h3>
      <p className="text-sm text-sky-700 mb-4">
        Slide <InlineMath math="\lambda" /> to observe how the transformation stabilises variance.
        Note: <InlineMath math="\lambda = 0" /> is the log transform.
      </p>
      <div className="mb-4">
        <label className="block text-sm font-medium text-sky-800 mb-1">
          <InlineMath math="\lambda" /> = <span className="font-bold text-sky-900">{lambda}</span>
          {lambda === 0 && <span className="ml-2 text-sky-600 text-xs">(log transform)</span>}
          {lambda === 1 && <span className="ml-2 text-sky-600 text-xs">(no transformation)</span>}
          {lambda === 0.5 && <span className="ml-2 text-sky-600 text-xs">(square root)</span>}
        </label>
        <input
          type="range" min={-1} max={2} step={0.1} value={lambda}
          onChange={e => setLambda(parseFloat(e.target.value))}
          className="w-full accent-sky-600"
        />
        <div className="flex justify-between text-xs text-sky-500 mt-1">
          <span>-1 (inverse)</span><span>0 (log)</span><span>0.5 (sqrt)</span><span>1 (none)</span><span>2 (square)</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-sky-700 mb-1 text-center">Original series (growing variance)</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={raw} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="t" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={v => [v.toFixed(2), 'y(t)']} />
              <Line type="monotone" dataKey="y" stroke="#0284c7" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-xs font-medium text-sky-700 mb-1 text-center">
            Box-Cox transformed (<InlineMath math={`\\lambda = ${lambda}`} />)
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={transformed} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="t" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <Tooltip formatter={v => [v.toFixed(3), 'w(t)']} />
              <Line type="monotone" dataKey="y" stroke="#dc2626" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const PYTHON_CODE = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats
from statsmodels.tsa.statespace.sarimax import SARIMAX

# ─── Generate heteroskedastic series ─────────────────────────────────────────
np.random.seed(42)
n = 120
t = np.arange(n)
level = 50 + 1.2 * t
noise = np.random.normal(0, 0.15 * level)   # variance grows with level
y = level + noise
y = np.maximum(y, 0.1)                        # ensure positive

# ─── Log transformation ───────────────────────────────────────────────────────
y_log = np.log(y)
print(f"Original - CoV (std/mean): {y.std()/y.mean():.3f}")
print(f"Log      - std:            {y_log.std():.3f}")

# ─── Box-Cox transformation ───────────────────────────────────────────────────
y_bc, fitted_lambda = stats.boxcox(y)
print(f"\\nOptimal Box-Cox lambda (MLE): {fitted_lambda:.4f}")
print(f"Box-Cox std:                  {y_bc.std():.3f}")

# Inverse transform (back-transforming forecasts)
def inv_boxcox(w, lam):
    if abs(lam) < 1e-9:
        return np.exp(w)
    return np.power(lam * w + 1, 1 / lam)

# ─── Guerrero method for lambda selection ────────────────────────────────────
# statsmodels SARIMAX uses Guerrero internally via optimal_order
# Direct Guerrero via pmdarima
try:
    from pmdarima.arima.utils import ndiffs
    from pmdarima.preprocessing import BoxCoxEndogTransformer
    bc = BoxCoxEndogTransformer(lmbda2=0)
    y_guerrero, _ = bc.fit_transform(y.reshape(-1, 1))
    print(f"Guerrero lambda: {bc.lmbda_:.4f}")
except ImportError:
    print("pmdarima not installed; using scipy MLE lambda instead")

# ─── Calendar adjustment: days-in-month ──────────────────────────────────────
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
df = pd.read_csv(url, index_col=0, parse_dates=True)
df.columns = ['passengers']
df.index.freq = 'MS'

# Adjust for number of days in each month
days_in_month = df.index.days_in_month
df['passengers_per_day'] = df['passengers'] / days_in_month
print("\\nFirst 5 rows with calendar adjustment:")
print(df.head())

# ─── Visualise transformations ────────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
axes[0].plot(y, color='steelblue'); axes[0].set_title('Original')
axes[1].plot(y_log, color='green'); axes[1].set_title('Log transform')
axes[2].plot(y_bc, color='red'); axes[2].set_title(f'Box-Cox (λ={fitted_lambda:.2f})')
for ax in axes: ax.grid(alpha=0.3)
plt.tight_layout(); plt.show()
`;

export default function TransformationsSection() {
  return (
    <SectionLayout
      title="Transformations & Adjustments"
      difficulty="intermediate"
      readingTime={25}
      prerequisites={['Patterns in Time Series', 'Classical & STL Decomposition']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Why Transform?</h2>
          <p className="text-gray-700 leading-relaxed">
            Transformations are applied before modelling to satisfy model assumptions
            (particularly constant variance), simplify the relationship between components,
            and sometimes improve forecast accuracy. The key principle is that a
            transformation should make the series easier to model — and any forecasts must
            be back-transformed to the original scale for interpretation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Log Transformation</h2>
          <p className="text-gray-700 mb-3">
            The log transform is the most commonly used transformation. It is appropriate
            when the variance of the series grows proportionally to its level
            (multiplicative noise). It also converts multiplicative models to additive ones.
          </p>
          <DefinitionBlock
            label="Definition 2.7"
            title="Log Transformation"
            definition="For a strictly positive series y_t > 0, the log-transformed series w_t = log(y_t) has variance that is approximately constant if the coefficient of variation (std/mean) of y_t is constant over time. Back-transformation via exp() introduces a bias correction term for the conditional mean."
            notation="w_t = \log(y_t), \quad \hat{y}_t = \exp(\hat{w}_t + \tfrac{1}{2}\hat{\sigma}^2)"
          />
          <NoteBlock type="tip" title="Back-Transformation Bias">
            When back-transforming a log-space forecast to the original scale, the naive
            inverse <InlineMath math="\exp(\hat{w}_t)" /> gives the <em>median</em> forecast,
            not the mean. The bias-corrected mean forecast is{' '}
            <InlineMath math="\exp(\hat{w}_t + \hat{\sigma}^2/2)" /> where{' '}
            <InlineMath math="\hat{\sigma}^2" /> is the forecast error variance in log space.
          </NoteBlock>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Box-Cox Transformation</h2>
          <p className="text-gray-700 mb-4">
            The Box-Cox family generalises the log transform with a single parameter{' '}
            <InlineMath math="\lambda" /> that can be chosen to optimally stabilise variance.
          </p>
          <DefinitionBlock
            label="Definition 2.8"
            title="Box-Cox Transformation"
            definition="The Box-Cox transformation maps a positive series y_t to w_t with parameter λ. The log transform is the limit as λ → 0. When λ = 0.5 the transformation is the square root; λ = -1 is the inverse. λ is typically estimated by maximum likelihood or the Guerrero method."
            notation="w_t = \begin{cases} \dfrac{y_t^\lambda - 1}{\lambda} & \lambda \ne 0 \\[6pt] \log(y_t) & \lambda = 0 \end{cases}"
          />

          <p className="text-gray-700 mb-3">
            The MLE estimate of <InlineMath math="\lambda" /> maximises:
          </p>
          <BlockMath math="\ell(\lambda) = -\frac{n}{2}\log\hat{\sigma}^2_\lambda + (\lambda-1)\sum_{t=1}^n \log y_t" />

          <p className="text-gray-700 mt-2 text-sm">
            where <InlineMath math="\hat{\sigma}^2_\lambda" /> is the estimated variance of the
            transformed series. The Guerrero (1993) method provides an alternative
            estimate that is specifically aimed at minimising forecast error.
          </p>
        </section>

        <BoxCoxViz />

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Calendar Adjustments</h2>
          <p className="text-gray-700 mb-4">
            Monthly series can show spurious seasonal patterns simply because months have
            different numbers of days. Dividing by the number of days (or trading days)
            removes this distortion.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
              <h4 className="font-semibold text-sky-900 mb-2">Days-in-Month Adjustment</h4>
              <BlockMath math="\tilde{y}_t = \frac{y_t}{d_t}" />
              <p className="text-sm text-sky-800 mt-1">
                where <InlineMath math="d_t" /> is the number of days in month <InlineMath math="t" />.
                February's shorter length otherwise suppresses values artificially.
              </p>
            </div>
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
              <h4 className="font-semibold text-cyan-900 mb-2">Trading Day Adjustment</h4>
              <BlockMath math="\tilde{y}_t = \frac{y_t}{b_t}" />
              <p className="text-sm text-cyan-800 mt-1">
                where <InlineMath math="b_t" /> counts business days. Important for financial
                and retail series where activity is zero on weekends/holidays.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Population Adjustments</h2>
          <p className="text-gray-700 mb-3">
            Time series that track aggregate quantities (total GDP, total hospital admissions)
            may show upward trends simply because the underlying population is growing.
            Per-capita adjustment removes demographic effects and allows fair cross-regional
            or cross-period comparison.
          </p>
          <BlockMath math="\tilde{y}_t = \frac{y_t}{\text{population}_t} \times 100{,}000 \quad \text{(per 100,000)}" />
        </section>

        <WarningBlock title="Always Back-Transform Forecasts">
          Transformations must be inverted when reporting results. A common error is to
          report forecast intervals computed in the transformed space without converting
          them back — this gives incorrect (often asymmetric) intervals. The Box-Cox
          back-transformation is:
          <BlockMath math="\hat{y}_t = \begin{cases} \exp(\hat{w}_t) & \lambda = 0 \\ (\lambda \hat{w}_t + 1)^{1/\lambda} & \lambda \ne 0 \end{cases}" />
          <p className="text-sm mt-2">Note that the back-transformed mean is biased;
          apply the appropriate bias correction for the conditional mean.</p>
        </WarningBlock>

        <PythonCode
          title="Box-Cox Transformation and Calendar Adjustment in Python"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              authors: 'Box, G.E.P. & Cox, D.R.',
              year: 1964,
              title: 'An analysis of transformations',
              venue: 'Journal of the Royal Statistical Society B, 26(2), 211–252',
              type: 'paper',
              whyImportant: 'Original Box-Cox paper. Introduces the power transformation family and MLE estimation of λ.',
            },
            {
              authors: 'Guerrero, V.M.',
              year: 1993,
              title: 'Time-series analysis supported by power transformations',
              venue: 'Journal of Forecasting, 12(1), 37–48',
              type: 'paper',
              whyImportant: 'Proposes the Guerrero method for λ selection by minimising forecast error — now a standard default in many software packages.',
            },
            {
              authors: 'Hyndman, R.J. & Athanasopoulos, G.',
              year: 2021,
              title: 'Forecasting: Principles and Practice (3rd ed.), Section 3.1',
              venue: 'OTexts',
              type: 'book',
              whyImportant: 'Practical guidance on when to apply transformations and the Guerrero method for λ selection.',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
