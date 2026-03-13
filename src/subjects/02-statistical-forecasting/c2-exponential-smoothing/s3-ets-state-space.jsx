import { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

const ETS_MODELS = [
  { error: 'A', trend: 'N', seasonal: 'N', name: 'SES', aic: '–', notes: 'Random walk with drift = 0' },
  { error: 'A', trend: 'A', seasonal: 'N', name: "Holt's linear", aic: '–', notes: 'Linear trend extrapolation' },
  { error: 'A', trend: 'Ad', seasonal: 'N', name: 'Damped trend', aic: '–', notes: 'Trend dampens to constant' },
  { error: 'A', trend: 'N', seasonal: 'A', name: 'Additive seasonal', aic: '–', notes: 'No trend' },
  { error: 'A', trend: 'A', seasonal: 'A', name: 'Holt-Winters add.', aic: '–', notes: 'Classic additive HW' },
  { error: 'A', trend: 'Ad', seasonal: 'A', name: 'Damped HW add.', aic: '–', notes: 'Recommended default' },
  { error: 'M', trend: 'N', seasonal: 'N', name: 'Multiplicative SES', aic: '–', notes: 'Proportional errors' },
  { error: 'M', trend: 'A', seasonal: 'N', name: 'Mult. Holt linear', aic: '–', notes: '' },
  { error: 'M', trend: 'Ad', seasonal: 'N', name: 'Mult. damped trend', aic: '–', notes: '' },
  { error: 'A', trend: 'N', seasonal: 'M', name: 'Additive error mult. seasonal', aic: '–', notes: '' },
  { error: 'A', trend: 'A', seasonal: 'M', name: 'HW multiplicative', aic: '–', notes: 'Growing seasonality' },
  { error: 'A', trend: 'Ad', seasonal: 'M', name: 'Damped HW mult.', aic: '–', notes: '' },
  { error: 'M', trend: 'N', seasonal: 'M', name: 'Mult.×Mult.', aic: '–', notes: '' },
  { error: 'M', trend: 'A', seasonal: 'M', name: 'Mult.×Linear×Mult.', aic: '–', notes: '' },
  { error: 'M', trend: 'Ad', seasonal: 'M', name: 'Mult.×Damped×Mult.', aic: '–', notes: '' },
  { error: 'M', trend: 'M', seasonal: 'N', name: 'Multiplicative trend', aic: '–', notes: 'Rarely used' },
  { error: 'M', trend: 'M', seasonal: 'A', name: 'Mult.×Mult.×Add.', aic: '–', notes: '' },
  { error: 'M', trend: 'M', seasonal: 'M', name: 'Full multiplicative', aic: '–', notes: 'Log-additive equivalent' },
];

function ETSModelTable() {
  const [filterError, setFilterError] = useState('All');
  const [filterTrend, setFilterTrend] = useState('All');

  const filtered = ETS_MODELS.filter(m =>
    (filterError === 'All' || m.error === filterError) &&
    (filterTrend === 'All' || m.trend === filterTrend)
  );

  return (
    <div className="my-6">
      <div className="flex gap-3 mb-3 flex-wrap">
        <div>
          <label className="text-xs text-zinc-500 mr-2">Error:</label>
          {['All', 'A', 'M'].map(v => (
            <button key={v} onClick={() => setFilterError(v)}
              className={`px-2 py-0.5 rounded text-xs mr-1 ${filterError === v ? 'bg-sky-600 text-white' : 'border border-zinc-400 text-zinc-500'}`}>
              {v}
            </button>
          ))}
        </div>
        <div>
          <label className="text-xs text-zinc-500 mr-2">Trend:</label>
          {['All', 'N', 'A', 'Ad', 'M'].map(v => (
            <button key={v} onClick={() => setFilterTrend(v)}
              className={`px-2 py-0.5 rounded text-xs mr-1 ${filterTrend === v ? 'bg-purple-600 text-white' : 'border border-zinc-400 text-zinc-500'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-zinc-700 dark:text-zinc-300 border-collapse">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800">
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">ETS(E,T,S)</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">Error</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">Trend</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">Season</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">Common Name</th>
              <th className="border border-zinc-300 dark:border-zinc-600 px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-zinc-50 dark:bg-zinc-800/50'}>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 font-mono text-xs">
                  ETS({m.error},{m.trend},{m.seasonal})
                </td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${m.error === 'A' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'}`}>
                    {m.error === 'A' ? 'Add' : 'Mul'}
                  </span>
                </td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-center">{m.trend}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-center">{m.seasonal}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5">{m.name}</td>
                <td className="border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-xs text-zinc-400">{m.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-zinc-400 mt-2">
        {ETS_MODELS.length} total ETS models. Some combinations (e.g., multiplicative trend with additive seasonality) are rarely used in practice.
      </p>
    </div>
  );
}

const pythonCode = `# ETS State Space Models
# pip install statsmodels statsforecast

import pandas as pd
import numpy as np
from statsmodels.tsa.exponential_smoothing.ets import ETSModel

# Monthly airline passengers (classic dataset)
from statsmodels.datasets import get_rdataset
air = get_rdataset('AirPassengers').data
ts = pd.Series(
    air['value'].values,
    index=pd.date_range('1949-01', periods=144, freq='MS'),
)

# ── Manual ETS(A,A,A) specification ─────────────────────────────────────────
model = ETSModel(ts, error='add', trend='add', seasonal='add',
                 seasonal_periods=12, initialization_method='estimated')
fit = model.fit(disp=False)
print(fit.summary())
print(f"\\nAIC:  {fit.aic:.2f}")
print(f"AICc: {fit.aicc:.2f}")
print(f"BIC:  {fit.bic:.2f}")

# ── AutoETS: automatic model selection via AICc ───────────────────────────────
from statsforecast import StatsForecast
from statsforecast.models import AutoETS

df = pd.DataFrame({
    'unique_id': 'air',
    'ds': pd.date_range('1949-01', periods=144, freq='MS'),
    'y': air['value'].values.astype(float),
})

sf = StatsForecast(
    models=[AutoETS(season_length=12)],
    freq='MS', n_jobs=-1,
)
sf.fit(df)
forecast = sf.predict(h=24, level=[80, 95])
print("\\nAutoETS forecasts:")
print(forecast.head())

# ── Prediction intervals from state space ─────────────────────────────────────
# ETS provides exact analytical prediction intervals
fc_full = fit.get_prediction(start=len(ts), end=len(ts) + 23)
summary_frame = fc_full.summary_frame(alpha=0.05)
print("\\n95% prediction intervals:")
print(summary_frame[['mean', 'pi_lower', 'pi_upper']].round(1))

# ── AIC comparison of all models ─────────────────────────────────────────────
combos = [
    ('add', 'add',  'add', 'ETS(A,A,A)'),
    ('add', 'add',  'mul', 'ETS(A,A,M)'),
    ('mul', 'add',  'mul', 'ETS(M,A,M)'),
    ('mul', 'add',  'add', 'ETS(M,A,A)'),
    ('add', 'add',  None,  'ETS(A,A,N)'),
]
for err, trend, seas, name in combos:
    kw = dict(error=err, trend=trend, initialization_method='estimated')
    if seas: kw['seasonal'] = seas; kw['seasonal_periods'] = 12
    try:
        m = ETSModel(ts, **kw).fit(disp=False)
        print(f"{name:12s}  AICc={m.aicc:.2f}")
    except Exception as e:
        print(f"{name:12s}  failed: {e}")
`;

const references = [
  {
    label: 'FPP3 §8.5',
    title: 'Forecasting: Principles and Practice – ETS models',
    authors: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/ets.html',
  },
  {
    label: 'Hyndman 2008',
    title: 'Forecasting with Exponential Smoothing: The State Space Approach',
    authors: 'Hyndman et al.',
    year: 2008,
    url: 'https://doi.org/10.1007/978-3-540-71918-2',
  },
];

export default function ETSStateSpace() {
  return (
    <SectionLayout
      title="ETS State Space Framework"
      difficulty="intermediate"
      readingTime={22}
      prerequisites={["Simple Exponential Smoothing", "Holt's Method & Holt-Winters"]}
    >
      <p>
        The ETS (Error–Trend–Seasonal) framework unifies all exponential smoothing methods
        under a single state space formulation. This provides a principled foundation for
        model selection via information criteria, exact prediction intervals, and maximum
        likelihood estimation.
      </p>

      <NoteBlock type="fpp3" title="FPP3 Chapter 8">
        The ETS framework was formally developed in Hyndman et al. (2008). FPP3 Chapter 8
        provides a thorough treatment. The key insight: each exponential smoothing method
        corresponds to a specific ETS model with well-defined statistical properties.
      </NoteBlock>

      <h2>1. ETS Notation</h2>
      <DefinitionBlock
        label="Definition"
        title="ETS(Error, Trend, Seasonal) Notation"
        definition="Each ETS model is identified by three components. Error and Seasonal can be Additive (A) or Multiplicative (M). Trend can be None (N), Additive (A), Additive Damped (Ad), or Multiplicative (M)."
        notation="\text{ETS}(\underbrace{E}_{\text{error}}, \underbrace{T}_{\text{trend}}, \underbrace{S}_{\text{seasonal}})"
      />

      <h2>2. State Space Equations</h2>
      <p>
        For the additive error case ETS(A,·,·), the innovation form is:
      </p>
      <BlockMath math="y_t = \mu_t + \varepsilon_t, \quad \varepsilon_t \sim \text{NID}(0, \sigma^2)" />
      <p>
        where <InlineMath math="\mu_t" /> is the conditional mean given the state at{' '}
        <InlineMath math="t-1" />. The state equations update level, trend, and seasonal
        components by adding a fraction of the innovation <InlineMath math="\varepsilon_t" />:
      </p>
      <BlockMath math="\ell_t = \ell_{t-1} + b_{t-1} + \alpha \varepsilon_t" />
      <BlockMath math="b_t = b_{t-1} + \beta \varepsilon_t" />
      <BlockMath math="s_t = s_{t-m} + \gamma \varepsilon_t" />
      <p>
        For the multiplicative error case ETS(M,·,·), the error enters multiplicatively:
      </p>
      <BlockMath math="y_t = \mu_t (1 + \varepsilon_t), \quad \varepsilon_t \sim \text{NID}(0, \sigma^2)" />

      <h2>3. The 18 ETS Models</h2>
      <p>
        Combining 2 error types × 4 trend types (N, A, Ad, M) × 3 seasonal types (N, A, M)
        gives 24 combinations, of which 6 are excluded as numerically unstable (multiplicative
        error with additive trend is excluded in most software), leaving 18 usable models:
      </p>
      <ETSModelTable />

      <h2>4. Model Selection via Information Criteria</h2>
      <TheoremBlock
        label="Theorem"
        title="AICc-Based ETS Model Selection"
        statement="Given a dataset, the ETS model minimizing the corrected AIC (AICc) is selected. AICc = AIC + 2k(k+1)/(T−k−1) where k is the number of parameters and T is the sample size. This corrects for small-sample bias in AIC = −2L + 2k."
        proof="The AICc correction term vanishes as T→∞, recovering AIC. For small T, AIC over-selects complex models; AICc penalizes more heavily. The ETSModel in statsmodels and AutoETS in statsforecast both use AICc by default."
        corollaries={[
          "BIC = −2L + k·log(T) penalizes more heavily for large T, preferring simpler models.",
          "Do not compare AIC across different datasets or transformations — only within the same series.",
        ]}
      />

      <h2>5. Prediction Intervals</h2>
      <p>
        A key advantage of the ETS state space framework: prediction intervals can be derived
        analytically (unlike bootstrap methods required for ARIMA). For ETS(A,N,N):
      </p>
      <BlockMath math="\hat{y}_{T+h|T} \pm z_{\alpha/2} \cdot \sigma\sqrt{1 + \alpha^2(h-1)}" />
      <p>
        For multiplicative error models, closed-form intervals are harder to obtain and
        simulation-based intervals are used.
      </p>

      <WarningBlock title="Multiplicative Models and Zero Values">
        ETS models with multiplicative errors or seasonality cannot handle zero or negative
        values in the time series. In such cases, use additive models or apply a log
        transformation before fitting.
      </WarningBlock>

      <h2>Python: ETSModel and AutoETS</h2>
      <PythonCode
        code={pythonCode}
        filename="ets_state_space.py"
        title="ETS model fitting, selection, and forecasting"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
