import React, { useState } from 'react';
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// Generate two cointegrated I(1) series and their mean-reverting spread
function generateCointegratedData(n = 100, seed = 42) {
  let rng = seed;
  const rand = () => { rng = (rng * 1664525 + 1013904223) & 0xffffffff; return (rng >>> 0) / 0xffffffff * 2 - 1; };
  const data = [];
  let trend = 0, x = 0, y = 0;
  for (let i = 0; i < n; i++) {
    trend += rand() * 1.2;
    x = trend + rand() * 0.5;
    y = 2 * trend - 1 + rand() * 0.5;
    const spread = x - 0.5 * y + 1; // beta=(1,-0.5), intercept=1 → I(0)
    data.push({ t: i, x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)), spread: parseFloat(spread.toFixed(2)) });
  }
  return data;
}

const cointegrationCode = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller, coint
from statsmodels.tsa.vector_ar.vecm import VECM, select_coint_rank, select_order
import warnings
warnings.filterwarnings('ignore')

np.random.seed(99)
n = 300

# ── Simulate two cointegrated I(1) series ─────────────────────────────────
# Common stochastic trend
trend = np.cumsum(np.random.normal(0, 1, n))
# y1 = trend + stationary component
# y2 = 2 * trend - 1 + stationary component  =>  cointegrating vector [1, -0.5]
y1 = trend + np.random.normal(0, 0.5, n)
y2 = 2.0 * trend - 1.0 + np.random.normal(0, 0.5, n)

dates = pd.date_range('1995-01', periods=n, freq='QS')
df = pd.DataFrame({'y1': y1, 'y2': y2}, index=dates)

# ── Step 1: Confirm both series are I(1) ──────────────────────────────────
for col in ['y1', 'y2']:
    stat, pval, *_ = adfuller(df[col], autolag='AIC')
    dstat, dpval, *_ = adfuller(df[col].diff().dropna(), autolag='AIC')
    print(f"{col}: ADF levels p={pval:.4f}, ADF diff p={dpval:.4f}")

# ── Engle-Granger two-step ─────────────────────────────────────────────────
print("\\n=== Engle-Granger Cointegration Test ===")
eg_stat, eg_pval, eg_crits = coint(df['y1'], df['y2'], trend='c')
print(f"EG stat: {eg_stat:.4f},  p-value: {eg_pval:.4f}")
print(f"Critical values: 1%={eg_crits[0]:.3f}, 5%={eg_crits[1]:.3f}, 10%={eg_crits[2]:.3f}")

# Step 1: OLS regression to get cointegrating vector
import statsmodels.api as sm
X_eg = sm.add_constant(df['y2'])
ols_fit = sm.OLS(df['y1'], X_eg).fit()
print(f"\\nCointegrating regression: y1 = {ols_fit.params['const']:.3f} + {ols_fit.params['y2']:.3f}*y2")

# Residuals (error-correction term)
ecm_residuals = ols_fit.resid
stat_r, pval_r, *_ = adfuller(ecm_residuals, autolag='AIC')
print(f"ADF on residuals: stat={stat_r:.4f}, p={pval_r:.4f}  {'[cointegrated!]' if pval_r < 0.05 else '[not cointegrated]'}")

# ── Johansen cointegration test ────────────────────────────────────────────
print("\\n=== Johansen Cointegration Rank Test ===")
result_rank = select_coint_rank(df, det_order=0, k_ar_diff=2,
                                method='trace', signif=0.05)
print(result_rank.summary())

# Also maximal eigenvalue test
result_maxeig = select_coint_rank(df, det_order=0, k_ar_diff=2,
                                   method='maxeig', signif=0.05)
print(result_maxeig.summary())
r_est = result_rank.rank   # estimated cointegrating rank
print(f"\\nEstimated cointegrating rank (trace): r={r_est}")

# ── Fit VECM ──────────────────────────────────────────────────────────────
print("\\n=== Vector Error Correction Model (VECM) ===")
# Select VAR lag order on differenced data
lag_sel = select_order(df, maxlags=6, deterministic='co')
print(f"Optimal k_ar_diff: {lag_sel.aic}")

vecm = VECM(df, k_ar_diff=lag_sel.aic, coint_rank=r_est,
            deterministic='co')   # 'co' = constant in cointegrating eq
vecm_fit = vecm.fit()
print(vecm_fit.summary())

# Cointegrating vector (normalised on y1)
beta = vecm_fit.beta
print(f"\\nCointegrating vector beta:\n{beta}")

# Error correction speeds
alpha = vecm_fit.alpha
print(f"\\nAdjustment speeds alpha:\n{alpha}")

# ── Forecast with VECM ────────────────────────────────────────────────────
h = 8
fc = vecm_fit.predict(steps=h)
print(f"\\n{h}-step VECM forecast (last 3 rows):")
fc_df = pd.DataFrame(fc, columns=['y1_fc', 'y2_fc'])
print(fc_df.tail(3))

# ── Application: pairs trading spread ────────────────────────────────────
# The ECM residual is the "spread" used in pairs trading strategies
spread = ecm_residuals
z_score = (spread - spread.rolling(60).mean()) / spread.rolling(60).std()

fig, axes = plt.subplots(3, 1, figsize=(12, 10))

axes[0].plot(df['y1'], label='y1', alpha=0.8)
axes[0].plot(df['y2'] * ols_fit.params['y2'] + ols_fit.params['const'],
             label='Predicted y1 from cointegrating eq', alpha=0.8, linestyle='--')
axes[0].set_title('y1 and Cointegrating Relationship')
axes[0].legend()

axes[1].plot(spread, color='purple')
axes[1].axhline(0, color='black', linewidth=0.8)
axes[1].set_title('Cointegrating Residual (Error Correction Term / Spread)')

axes[2].plot(z_score, color='darkorange')
axes[2].axhline(2, color='red', linestyle='--', label='+2σ entry')
axes[2].axhline(-2, color='green', linestyle='--', label='-2σ entry')
axes[2].set_title('Z-score of Spread (Pairs Trading Signal)')
axes[2].legend()
plt.tight_layout()
plt.show()
`;

const references = [
  {
    title: 'Co-integration and Error Correction: Representation, Estimation, and Testing',
    author: 'Engle, R.F. & Granger, C.W.J.',
    year: 1987,
    url: 'https://www.jstor.org/stable/1913236'
  },
  {
    title: 'Estimation and Hypothesis Testing of Cointegration Vectors in Gaussian VAR Models',
    author: 'Johansen, S.',
    year: 1991,
    url: 'https://www.jstor.org/stable/2938278'
  },
  {
    title: 'Time Series Analysis (2nd ed.) — Chapters 19-20',
    author: 'Hamilton, J.D.',
    year: 1994,
    url: 'https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis'
  },
  {
    title: 'statsmodels VECM documentation',
    author: 'statsmodels contributors',
    year: 2023,
    url: 'https://www.statsmodels.org/stable/vector_ar.html#vector-error-correction-models-vecm'
  }
];

export default function Cointegration() {
  const [activeTab, setActiveTab] = useState('concept');
  const [showSpread, setShowSpread] = useState(false);
  const cointData = generateCointegratedData(100);

  return (
    <SectionLayout
      title="Cointegration and Error Correction"
      difficulty="expert"
      readingTime={14}
    >
      <p>
        Two I(1) time series that wander independently are unrelated in the long run — their
        difference grows without bound. But some pairs of I(1) series share a common stochastic
        trend and tend to move together, never drifting too far apart. These series are called{' '}
        <strong>cointegrated</strong>. Cointegration theory, developed by Engle and Granger (1987)
        and extended by Johansen (1991), provides the rigorous framework for modelling long-run
        equilibrium relationships and the short-run dynamics that restore equilibrium after shocks.
      </p>

      <DefinitionBlock term="Cointegration">
        A set of <InlineMath math="k" /> series <InlineMath math="\mathbf{y}_t = (y_{1,t}, \ldots, y_{k,t})'" />{' '}
        is said to be <strong>cointegrated of order (1,1)</strong>, written{' '}
        <InlineMath math="CI(1,1)" />, if:
        <ol>
          <li>Each component <InlineMath math="y_{i,t} \sim I(1)" /> individually.</li>
          <li>
            There exists at least one non-zero vector <InlineMath math="\boldsymbol{\beta}" /> such
            that the linear combination <InlineMath math="\boldsymbol{\beta}'\mathbf{y}_t \sim I(0)" />.
          </li>
        </ol>
        The vector <InlineMath math="\boldsymbol{\beta}" /> is the <strong>cointegrating vector</strong>,
        and the stationary combination <InlineMath math="\boldsymbol{\beta}'\mathbf{y}_t" /> is the
        <strong> error correction term</strong> — it represents the long-run equilibrium deviation.
      </DefinitionBlock>

      <div style={{ margin: '1.5rem 0' }}>
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e5e7eb', marginBottom: '1rem' }}>
          {[
            { key: 'concept', label: 'Concept' },
            { key: 'engle', label: 'Engle-Granger' },
            { key: 'johansen', label: 'Johansen' },
            { key: 'vecm', label: 'VECM' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '0.5rem 1.25rem',
                background: activeTab === key ? '#0891b2' : 'transparent',
                color: activeTab === key ? 'white' : '#374151',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px 4px 0 0',
                fontWeight: activeTab === key ? 'bold' : 'normal'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'concept' && (
          <div>
            <p>
              Two I(1) series <InlineMath math="y_{1,t}" /> and <InlineMath math="y_{2,t}" /> can be
              written as random walks: <InlineMath math="y_{i,t} = y_{i,t-1} + u_{i,t}" />. If they
              share the same stochastic trend <InlineMath math="\tau_t" />:
            </p>
            <BlockMath math="y_{1,t} = \tau_t + \eta_{1,t}, \quad y_{2,t} = c + \gamma \tau_t + \eta_{2,t}" />
            <p>
              then <InlineMath math="y_{1,t} - \gamma^{-1}(y_{2,t} - c) = \eta_{1,t} - \gamma^{-1}\eta_{2,t} \sim I(0)" />.
              The cointegrating vector is <InlineMath math="\boldsymbol{\beta} = (1, -\gamma^{-1})'" />.
            </p>
          </div>
        )}

        {activeTab === 'engle' && (
          <div>
            <p>The <strong>Engle-Granger two-step procedure</strong>:</p>
            <ol>
              <li>
                Regress <InlineMath math="y_{1,t}" /> on <InlineMath math="y_{2,t}, \ldots, y_{k,t}" />{' '}
                by OLS. The OLS estimator is <em>super-consistent</em>: it converges at rate{' '}
                <InlineMath math="T" /> rather than <InlineMath math="\sqrt{T}" />, but standard
                errors are not asymptotically normal.
              </li>
              <li>
                Test the residuals <InlineMath math="\hat{e}_t = y_{1,t} - \hat{\boldsymbol{\beta}}'\mathbf{y}_{2:k,t}" />{' '}
                for stationarity using the ADF test with special critical values (Engle-Granger
                tables, not standard ADF tables).
              </li>
            </ol>
            <p>
              <strong>Limitation:</strong> The EG procedure tests only one cointegrating
              vector. With <InlineMath math="k > 2" />, there can be up to <InlineMath math="r = k-1" />{' '}
              cointegrating vectors; use the Johansen test.
            </p>
          </div>
        )}

        {activeTab === 'johansen' && (
          <div>
            <p>
              The <strong>Johansen test</strong> estimates all cointegrating vectors simultaneously
              via reduced-rank regression on the VECM. It tests the rank of the long-run matrix
              <InlineMath math="\boldsymbol{\Pi}" />:
            </p>
            <BlockMath math="\Delta\mathbf{y}_t = \boldsymbol{\Pi}\mathbf{y}_{t-1} + \sum_{i=1}^{p-1} \boldsymbol{\Gamma}_i \Delta\mathbf{y}_{t-i} + \boldsymbol{\varepsilon}_t" />
            <p>
              If <InlineMath math="\text{rank}(\boldsymbol{\Pi}) = r" />, then{' '}
              <InlineMath math="\boldsymbol{\Pi} = \boldsymbol{\alpha}\boldsymbol{\beta}'" /> where
              <InlineMath math="\boldsymbol{\beta}" /> is <InlineMath math="k \times r" /> (cointegrating
              vectors) and <InlineMath math="\boldsymbol{\alpha}" /> is <InlineMath math="k \times r" />{' '}
              (adjustment speeds).
            </p>
            <p>Two test statistics:</p>
            <ul>
              <li><strong>Trace:</strong> <InlineMath math="\lambda_{\text{trace}}(r) = -T\sum_{i=r+1}^{k}\ln(1-\hat{\lambda}_i)" /></li>
              <li><strong>Max eigenvalue:</strong> <InlineMath math="\lambda_{\max}(r, r+1) = -T\ln(1-\hat{\lambda}_{r+1})" /></li>
            </ul>
          </div>
        )}

        {activeTab === 'vecm' && (
          <div>
            <p>
              The <strong>Vector Error Correction Model (VECM)</strong> is the cointegrated
              counterpart to VAR:
            </p>
            <BlockMath math="\Delta\mathbf{y}_t = \boldsymbol{\alpha}\underbrace{\boldsymbol{\beta}'\mathbf{y}_{t-1}}_{\text{ECT}} + \sum_{i=1}^{p-1}\boldsymbol{\Gamma}_i\Delta\mathbf{y}_{t-i} + \boldsymbol{\varepsilon}_t" />
            <p>
              <InlineMath math="\boldsymbol{\alpha}_{ij}" /> is the speed of adjustment of variable{' '}
              <InlineMath math="i" /> to cointegrating relationship <InlineMath math="j" />. A
              negative <InlineMath math="\alpha_{ij}" /> means variable <InlineMath math="i" />{' '}
              corrects toward equilibrium. If <InlineMath math="\alpha_{ij} = 0" />, variable{' '}
              <InlineMath math="i" /> is <em>weakly exogenous</em> with respect to cointegrating
              vector <InlineMath math="j" />.
            </p>
          </div>
        )}
      </div>

      {/* Interactive Visualization */}
      <div style={{ margin: '1.5rem 0', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
          Interactive: Cointegrated Series and Spread
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <button
            onClick={() => setShowSpread(false)}
            style={{ padding: '0.3rem 0.9rem', borderRadius: '4px', border: 'none', cursor: 'pointer',
              background: !showSpread ? '#0891b2' : '#e2e8f0', color: !showSpread ? 'white' : '#374151', fontWeight: !showSpread ? 'bold' : 'normal' }}
          >
            Raw Series (I(1))
          </button>
          <button
            onClick={() => setShowSpread(true)}
            style={{ padding: '0.3rem 0.9rem', borderRadius: '4px', border: 'none', cursor: 'pointer',
              background: showSpread ? '#0891b2' : '#e2e8f0', color: showSpread ? 'white' : '#374151', fontWeight: showSpread ? 'bold' : 'normal' }}
          >
            Spread / ECT (I(0))
          </button>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          {showSpread ? (
            <LineChart data={cointData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="t" label={{ value: 'Time', position: 'insideBottom', offset: -2 }} />
              <YAxis />
              <Tooltip />
              <ReferenceLine y={0} stroke="#64748b" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="spread" stroke="#7c3aed" dot={false} name="Spread x − 0.5y + 1" strokeWidth={2} />
            </LineChart>
          ) : (
            <LineChart data={cointData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="t" label={{ value: 'Time', position: 'insideBottom', offset: -2 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="x" stroke="#2563eb" dot={false} name="x  (I(1))" strokeWidth={2} />
              <Line type="monotone" dataKey="y" stroke="#16a34a" dot={false} name="y  (I(1))" strokeWidth={2} />
            </LineChart>
          )}
        </ResponsiveContainer>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
          Both x and y are I(1) random walks with a shared stochastic trend. Their linear combination
          x − 0.5y + 1 is mean-reverting I(0) — the cointegrating relationship (error correction term).
        </p>
      </div>

      <TheoremBlock
        title="Granger Representation Theorem"
        proof="If y_t is CI(1,1) with cointegrating vector beta, then there exists a VECM representation with alpha*beta' = Pi. Conversely, any VECM with rank(Pi)=r has r cointegrating relationships. The proof relies on the Beveridge-Nelson decomposition of I(1) processes into random walk and stationary components."
      >
        If <InlineMath math="\mathbf{y}_t" /> is cointegrated with rank <InlineMath math="r > 0" />,
        then it has a valid VECM representation with{' '}
        <InlineMath math="\boldsymbol{\Pi} = \boldsymbol{\alpha}\boldsymbol{\beta}'" /> where{' '}
        <InlineMath math="\boldsymbol{\alpha}" /> and <InlineMath math="\boldsymbol{\beta}" /> are{' '}
        <InlineMath math="k \times r" /> matrices of full column rank. The cointegrating vectors{' '}
        <InlineMath math="\boldsymbol{\beta}" /> are identified only up to a non-singular linear
        transformation; a normalisation is needed for unique interpretation.
      </TheoremBlock>

      <h2>Cointegrating Rank and the Three Cases</h2>
      <p>For a <InlineMath math="k" />-dimensional system:</p>
      <ul>
        <li>
          <strong><InlineMath math="r = 0" /> (no cointegration):</strong> All series are I(1) and
          unrelated in the long run. Model in first differences (VAR on <InlineMath math="\Delta\mathbf{y}_t" />).
        </li>
        <li>
          <strong><InlineMath math="0 < r < k" /> (partial cointegration):</strong> There are{' '}
          <InlineMath math="r" /> cointegrating relationships and <InlineMath math="k - r" /> common
          stochastic trends. Use VECM.
        </li>
        <li>
          <strong><InlineMath math="r = k" /> (full rank):</strong> All series are actually I(0).
          Model in levels (standard VAR).
        </li>
      </ul>

      <WarningBlock title="Critical Values Depend on Deterministic Components">
        Johansen and Engle-Granger critical values differ depending on whether the cointegrating
        equation includes a constant, a trend, or both. The deterministic specification must match
        the data — including an unnecessary trend inflates size; omitting a needed trend causes
        size distortion in the other direction. statsmodels' <code>det_order</code> parameter
        controls this: -1 (none), 0 (constant), 1 (constant + trend).
      </WarningBlock>

      <ExampleBlock title="Pairs Trading: Coca-Cola and PepsiCo">
        A classic pairs trading application: Coca-Cola (KO) and PepsiCo (PEP) stock prices are
        both I(1) but share a common consumer staples trend. Engle-Granger test on log prices:
        ADF on residuals gives stat = -4.12 (p = 0.006 &lt; 0.05), confirming cointegration.
        <br /><br />
        The cointegrating vector (normalised) is approximately <InlineMath math="(1, -0.92)" />,
        meaning <InlineMath math="\log P_{KO,t} - 0.92 \log P_{PEP,t}" /> is stationary. When
        this spread rises 2 standard deviations above its historical mean (log prices diverge),
        the strategy shorts KO and longs PEP; when the spread reverts, positions are closed.
        <br /><br />
        The VECM adjustment speed <InlineMath math="\hat\alpha_{KO} \approx -0.08" /> implies that
        ~8% of any deviation from equilibrium is corrected each period — roughly a 12-week
        half-life.
      </ExampleBlock>

      <h2>Long-Run Equilibrium in Forecasting</h2>
      <p>
        For long-horizon forecasting, the VECM is preferred over a differenced VAR for cointegrated
        systems because:
      </p>
      <ul>
        <li>
          The error correction term enforces the long-run equilibrium constraint, preventing
          forecasts from diverging unrealistically.
        </li>
        <li>
          At short horizons, VECM and differenced VAR forecasts are similar; advantages accumulate
          at longer horizons.
        </li>
        <li>
          Ignoring cointegration (using a differenced VAR) loses long-run information and produces
          sub-optimal long-horizon forecasts.
        </li>
      </ul>

      <NoteBlock title="Forecast Uncertainty in VECM">
        The long-run forecast of a VECM for a CI(1,1) system converges to a linear combination
        constrained to the cointegrating space. Unlike an unrestricted I(1) VAR whose forecast
        intervals grow without bound, the VECM's forecast variance is bounded in the direction
        of the cointegrating vector but still grows in the directions of common stochastic trends.
      </NoteBlock>

      <PythonCode code={cointegrationCode} title="Cointegration: Engle-Granger, Johansen, and VECM" />

      <h2>Summary</h2>
      <ul>
        <li>
          Cointegration describes a long-run equilibrium between I(1) series; their linear
          combination is I(0).
        </li>
        <li>
          The Engle-Granger two-step procedure tests for a single cointegrating vector via OLS
          residuals; use only for bivariate systems.
        </li>
        <li>
          The Johansen test handles multiple cointegrating vectors and provides full ML estimation;
          preferred for <InlineMath math="k \geq 3" />.
        </li>
        <li>
          The VECM decomposes dynamics into long-run adjustment (ECT) and short-run deviations,
          with adjustment speed matrix <InlineMath math="\boldsymbol{\alpha}" />.
        </li>
        <li>
          Applications include pairs trading (finance), demand systems (economics), and
          any setting with long-run equilibrium constraints.
        </li>
        <li>
          For long-horizon forecasting, VECM enforces equilibrium constraints that differenced
          VARs ignore, yielding better long-horizon forecasts.
        </li>
      </ul>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
