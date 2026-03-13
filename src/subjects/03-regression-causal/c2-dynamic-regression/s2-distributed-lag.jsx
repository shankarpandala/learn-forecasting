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

const dlCode = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.regression.linear_model import OLS
from statsmodels.tsa.statespace.sarimax import SARIMAX
import warnings
warnings.filterwarnings('ignore')

np.random.seed(7)
n = 150

# ── Simulate ADL(1,2) data: y_t = 0.3*y_{t-1} + 0.5*x_t + 0.3*x_{t-1} + e_t
x   = np.random.normal(0, 2, n)
eps = np.random.normal(0, 1, n)
y   = np.zeros(n)
y[0] = 10
for t in range(1, n):
    xl1 = x[t-1]
    yl1 = y[t-1]
    y[t] = 0.3 * yl1 + 0.5 * x[t] + 0.3 * xl1 + eps[t]

dates  = pd.date_range('2012-01', periods=n, freq='MS')
df     = pd.DataFrame({'y': y, 'x': x}, index=dates)
train  = df.iloc[:-12]
test   = df.iloc[-12:]

# ─────────────────────────────────────────────────────────────────────────────
# 1. FINITE DISTRIBUTED LAG (FDL) — include q lags of x
# ─────────────────────────────────────────────────────────────────────────────
def build_lag_matrix(df, col, q):
    """Return DataFrame of col and q lagged versions."""
    lags = {f'{col}_lag{k}': df[col].shift(k) for k in range(q + 1)}
    return pd.DataFrame(lags).dropna()

q = 4  # finite lag order
X_fdl = build_lag_matrix(df, 'x', q)
y_fdl = df['y'].loc[X_fdl.index]

X_fdl_c = sm.add_constant(X_fdl)
fdl_fit  = OLS(y_fdl, X_fdl_c).fit(cov_type='HC1')
print("Finite Distributed Lag (q=4)")
print(fdl_fit.summary().tables[1])

# Impulse response: lag coefficients
irf_fdl = fdl_fit.params[[f'x_lag{k}' for k in range(q + 1)]].values
cumulative = np.cumsum(irf_fdl)
print(f"\\nLong-run multiplier (FDL): {irf_fdl.sum():.4f}")

# ─────────────────────────────────────────────────────────────────────────────
# 2. ALMON POLYNOMIAL (PDL) — constrain lag weights to lie on a polynomial
# ─────────────────────────────────────────────────────────────────────────────
# Polynomial of degree d on lags 0..q
# beta_k = sum_{j=0}^{d} alpha_j * k^j  (k = lag index)
def almon_basis(q, d):
    """Build Almon polynomial basis matrix (q+1) x (d+1)."""
    k = np.arange(q + 1)
    return np.column_stack([k**j for j in range(d + 1)])

q_almon, d_almon = 6, 2   # 6 lags, quadratic polynomial

X_raw = build_lag_matrix(df, 'x', q_almon)
y_almon = df['y'].loc[X_raw.index]

B = almon_basis(q_almon, d_almon)            # (7 x 3)
# Transform: each row of X_raw multiplied by B => X_pdl has d+1 columns
X_pdl = X_raw.values @ B                    # (n-q) x (d+1)
X_pdl = sm.add_constant(X_pdl)

almon_fit = OLS(y_almon, X_pdl).fit()
alpha = almon_fit.params[1:]                 # polynomial coefficients
irf_almon = B @ alpha                        # recover lag weights
print(f"\\nAlmon PDL (q={q_almon}, degree={d_almon}) long-run: {irf_almon.sum():.4f}")

# ─────────────────────────────────────────────────────────────────────────────
# 3. KOYCK GEOMETRIC LAG (infinite distributed lag)
# ─────────────────────────────────────────────────────────────────────────────
# beta_k = beta_0 * lambda^k  =>  y_t = mu + beta_0*x_t + lambda*y_{t-1} + u_t
X_koyck = pd.DataFrame({
    'const': 1.0,
    'x_t':   df['x'],
    'y_lag1': df['y'].shift(1)
}, index=dates).dropna()
y_koyck = df['y'].loc[X_koyck.index]

koyck_fit = OLS(y_koyck, X_koyck).fit(cov_type='HC1')
print("\\nKoyck Geometric Lag")
print(koyck_fit.summary().tables[1])

beta0  = koyck_fit.params['x_t']
lam    = koyck_fit.params['y_lag1']
lrm_koyck = beta0 / (1 - lam)
print(f"Immediate effect beta0: {beta0:.4f}")
print(f"Decay rate lambda:      {lam:.4f}")
print(f"Long-run multiplier:    {lrm_koyck:.4f}")

# ─────────────────────────────────────────────────────────────────────────────
# 4. ADL(1,2) — autoregressive distributed lag with ARIMA errors check
# ─────────────────────────────────────────────────────────────────────────────
X_adl = pd.DataFrame({
    'const': 1.0,
    'y_lag1': df['y'].shift(1),
    'x_t':    df['x'],
    'x_lag1': df['x'].shift(1),
}, index=dates).dropna()
y_adl = df['y'].loc[X_adl.index]

adl_fit = OLS(y_adl, X_adl).fit(cov_type='HC1')
print("\\nADL(1,2) model")
print(adl_fit.summary().tables[1])

a1    = adl_fit.params['y_lag1']
b0    = adl_fit.params['x_t']
b1    = adl_fit.params['x_lag1']
lrm_adl = (b0 + b1) / (1 - a1)
print(f"Long-run multiplier ADL: {lrm_adl:.4f}")

# ─────────────────────────────────────────────────────────────────────────────
# 5. ADL forecast vs actual
# ─────────────────────────────────────────────────────────────────────────────
# For forecasting, use SARIMAX with x and x_lag1 as regressors + AR(1) errors
train_s = train.copy()
X_s = pd.DataFrame({
    'x_t':    train_s['x'],
    'x_lag1': train_s['x'].shift(1)
}).dropna()
y_s = train_s['y'].loc[X_s.index]

model_s = SARIMAX(y_s, exog=X_s, order=(1, 0, 0), trend='c')
fit_s   = model_s.fit(disp=False)

X_fc = pd.DataFrame({'x_t': test['x'], 'x_lag1': test['x'].shift(1).fillna(train['x'].iloc[-1])})
fc_s = fit_s.get_forecast(steps=12, exog=X_fc)
mae  = np.abs(test['y'] - fc_s.predicted_mean).mean()
print(f"\\nADL SARIMAX forecast MAE: {mae:.4f}")

# ─────────────────────────────────────────────────────────────────────────────
# Plot impulse response functions
# ─────────────────────────────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(14, 4))
lags = np.arange(q + 1)

axes[0].bar(lags, irf_fdl, color='steelblue')
axes[0].set_title(f'FDL IRF (q={q})')
axes[0].set_xlabel('Lag')

axes[1].bar(np.arange(q_almon + 1), irf_almon, color='seagreen')
axes[1].set_title(f'Almon PDL IRF (q={q_almon}, deg={d_almon})')
axes[1].set_xlabel('Lag')

koyck_irfs = [beta0 * lam**k for k in range(10)]
axes[2].bar(np.arange(10), koyck_irfs, color='coral')
axes[2].set_title('Koyck Geometric Lag IRF')
axes[2].set_xlabel('Lag')

plt.tight_layout()
plt.show()
`;

const references = [
  {
    title: 'Introduction to Econometrics (4th ed.)',
    author: 'Stock, J.H. & Watson, M.W.',
    year: 2019,
    url: 'https://www.pearson.com/en-us/subject-catalog/p/introduction-to-econometrics/P200000006421'
  },
  {
    title: 'Econometric Analysis (8th ed.)',
    author: 'Greene, W.H.',
    year: 2018,
    url: 'https://www.pearson.com/en-us/subject-catalog/p/econometric-analysis/P200000006221'
  },
  {
    title: 'Time Series Analysis (2nd ed.) — Chapter 10',
    author: 'Hamilton, J.D.',
    year: 1994,
    url: 'https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis'
  },
  {
    title: 'Forecasting: Principles and Practice — Regression with ARIMA errors',
    author: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/regarima.html'
  }
];

export default function DistributedLag() {
  const [lagType, setLagType] = useState('fdl');

  const lagTypeInfo = {
    fdl: {
      name: 'Finite Distributed Lag',
      eq: String.raw`y_t = \alpha + \sum_{k=0}^{q} \beta_k x_{t-k} + \varepsilon_t`,
      pro: 'Simple, no parametric restriction on lag shape.',
      con: 'Multicollinearity among lagged x; many parameters for large q.',
    },
    almon: {
      name: 'Almon Polynomial Lag',
      eq: String.raw`\beta_k = \sum_{j=0}^{d} \alpha_j k^j, \quad k=0,\ldots,q`,
      pro: 'Reduces parameters; smooth, economically reasonable lag profile.',
      con: 'Polynomial degree and lag length must be chosen; ad-hoc endpoint restrictions sometimes imposed.',
    },
    koyck: {
      name: 'Koyck Geometric Lag',
      eq: String.raw`y_t = \mu + \beta_0 x_t + \lambda y_{t-1} + u_t`,
      pro: 'Single parameter controls decay; parsimonious; infinite horizon.',
      con: 'Restricts lag profile to monotone decay; lagged y introduces endogeneity (use IV).',
    },
    adl: {
      name: 'ADL(p,q) Model',
      eq: String.raw`y_t = \sum_{i=1}^{p}\phi_i y_{t-i} + \sum_{k=0}^{q}\beta_k x_{t-k} + \alpha + \varepsilon_t`,
      pro: 'General, nests FDL and Koyck; long-run multiplier derivable.',
      con: 'Requires selecting p and q; can be over-parameterised.',
    }
  };

  const info = lagTypeInfo[lagType];

  return (
    <SectionLayout
      title="Distributed Lag Models"
      difficulty="advanced"
      readingTime={12}
    >
      <p>
        When an explanatory variable <InlineMath math="x_t" /> affects the outcome{' '}
        <InlineMath math="y_t" /> not just instantaneously but over multiple subsequent periods,
        a single contemporaneous regressor under-represents the relationship. <strong>Distributed
        lag models</strong> capture this propagation by including multiple lags of{' '}
        <InlineMath math="x" />. They are fundamental in demand forecasting, macroeconomics, and
        marketing science — anywhere that causes take time to work through to effects.
      </p>

      <DefinitionBlock term="Distributed Lag Model">
        A distributed lag (DL) model relates <InlineMath math="y_t" /> to current and past values
        of <InlineMath math="x_t" />:
        <BlockMath math="y_t = \alpha + \sum_{k=0}^{\infty} \beta_k\, x_{t-k} + \varepsilon_t" />
        The sequence <InlineMath math="\{\beta_k\}_{k=0}^\infty" /> is the{' '}
        <strong>impulse response function</strong> (or lag distribution): <InlineMath math="\beta_k" />{' '}
        is the effect on <InlineMath math="y_t" /> of a unit increase in <InlineMath math="x_{t-k}" />{' '}
        holding all other <InlineMath math="x" /> constant. The sum{' '}
        <InlineMath math="\sum_{k=0}^{\infty} \beta_k" /> is the <strong>long-run multiplier</strong>.
      </DefinitionBlock>

      <h2>Types of Distributed Lag Models</h2>

      <div style={{ margin: '1.5rem 0' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {Object.entries(lagTypeInfo).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setLagType(key)}
              style={{
                padding: '0.4rem 1rem',
                background: lagType === key ? '#7c3aed' : '#ede9fe',
                color: lagType === key ? 'white' : '#5b21b6',
                border: `1px solid ${lagType === key ? '#6d28d9' : '#c4b5fd'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: lagType === key ? 'bold' : 'normal'
              }}
            >
              {val.name.split(' ')[0]}
            </button>
          ))}
        </div>
        <div style={{ padding: '1rem', background: '#faf5ff', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
          <strong>{info.name}</strong>
          <BlockMath math={info.eq} />
          <p style={{ fontSize: '0.9rem' }}><strong>Advantages:</strong> {info.pro}</p>
          <p style={{ fontSize: '0.9rem' }}><strong>Limitations:</strong> {info.con}</p>
        </div>
      </div>

      <h2>1. Finite Distributed Lag (FDL)</h2>
      <p>
        The simplest approach truncates the infinite lag at order <InlineMath math="q" />:
      </p>
      <BlockMath math="y_t = \alpha + \beta_0 x_t + \beta_1 x_{t-1} + \cdots + \beta_q x_{t-q} + \varepsilon_t" />
      <p>
        Each <InlineMath math="\beta_k" /> is estimated freely. The main challenge is
        multicollinearity among the lagged regressors (high autocorrelation in <InlineMath math="x" />
        means <InlineMath math="x_{t-k}" /> and <InlineMath math="x_{t-k-1}" /> are highly correlated).
        This inflates standard errors and makes individual coefficients unstable.
      </p>

      <h2>2. Almon Polynomial Distributed Lag (PDL)</h2>
      <p>
        The <strong>Almon lag</strong> (also called polynomial distributed lag, PDL) addresses
        multicollinearity by restricting the lag weights to lie on a polynomial of degree{' '}
        <InlineMath math="d" />:
      </p>
      <BlockMath math="\beta_k = \sum_{j=0}^{d} \alpha_j\, k^j, \quad k = 0, 1, \ldots, q" />
      <p>
        Substituting into the regression and rearranging, the model becomes a regression on{' '}
        <InlineMath math="d + 1" /> transformed variables <InlineMath math="Z_{j,t} = \sum_{k=0}^{q} k^j x_{t-k}" />,
        dramatically reducing the parameter count from <InlineMath math="q+1" /> to{' '}
        <InlineMath math="d+1" />.
      </p>

      <NoteBlock title="Endpoint Constraints">
        Practitioners sometimes impose constraints that <InlineMath math="\beta_{-1} = 0" /> (no
        effect before lag 0) and/or <InlineMath math="\beta_{q+1} = 0" /> (no effect beyond lag
        q). These are called <em>endpoint restrictions</em> and reduce parameters by one or two
        more, but their validity should be tested.
      </NoteBlock>

      <h2>3. Koyck Geometric Lag</h2>
      <p>
        The <strong>Koyck transformation</strong> assumes lag weights decay geometrically:{' '}
        <InlineMath math="\beta_k = \beta_0 \lambda^k" /> for <InlineMath math="0 < \lambda < 1" />.
        Writing out the infinite sum and applying the Koyck transformation yields a finite model:
      </p>
      <BlockMath math="y_t = \mu(1-\lambda) + \beta_0 x_t + \lambda y_{t-1} + (u_t - \lambda u_{t-1})" />
      <p>
        This MA(1) error structure means OLS is inconsistent (lagged <InlineMath math="y" /> is
        correlated with the composite error). The solutions are:
      </p>
      <ul>
        <li><strong>Instrumental variables (IV):</strong> instrument <InlineMath math="y_{t-1}" /> with <InlineMath math="x_{t-1}" />.</li>
        <li><strong>Non-linear least squares:</strong> estimate <InlineMath math="\beta_0" /> and <InlineMath math="\lambda" /> jointly.</li>
        <li><strong>ARMA error correction:</strong> fit within a SARIMAX framework with the MA term included.</li>
      </ul>

      <WarningBlock title="OLS Bias in Koyck Models">
        Using OLS on <InlineMath math="y_t = c + \beta_0 x_t + \lambda y_{t-1} + u_t" /> when
        the true error is MA(1) underestimates <InlineMath math="\lambda" /> (and hence the
        long-run multiplier). Always use IV or NLS for Koyck models in inferential settings.
        For pure forecasting in a stable environment, the bias may be tolerable.
      </WarningBlock>

      <h2>4. Autoregressive Distributed Lag (ADL)</h2>
      <p>
        The <strong>ADL(p, q)</strong> model nests both AR dynamics and distributed lags:
      </p>
      <BlockMath math="y_t = \alpha + \sum_{i=1}^{p} \phi_i y_{t-i} + \sum_{k=0}^{q} \beta_k x_{t-k} + \varepsilon_t" />
      <p>
        It is the most general short-run model and contains FDL (set <InlineMath math="p=0" />) and
        Koyck (<InlineMath math="p=1, q=0" />) as special cases. The long-run multiplier from ADL is:
      </p>
      <BlockMath math="\text{LRM} = \frac{\sum_{k=0}^{q} \beta_k}{1 - \sum_{i=1}^{p} \phi_i}" />

      <TheoremBlock
        title="ADL Long-Run Relationship"
        proof="Set y_t = y_{t-1} = ... = y* and x_t = x_{t-1} = ... = x* in the ADL equation. Solving for y* in terms of x* gives y* = alpha/(1-sum phi_i) + LRM * x*. This assumes |sum phi_i| < 1 (stability)."
      >
        In the long-run equilibrium where <InlineMath math="y_t = y^*" /> and{' '}
        <InlineMath math="x_t = x^*" /> are constant, the ADL(p,q) model implies:
        <BlockMath math="y^* = \frac{\alpha}{1 - \sum_{i=1}^{p}\phi_i} + \underbrace{\frac{\sum_{k=0}^{q}\beta_k}{1 - \sum_{i=1}^{p}\phi_i}}_{\text{LRM}} \cdot x^*" />
        The LRM exists if and only if the AR polynomial has all roots outside the unit circle
        (stability condition <InlineMath math="\sum \phi_i < 1" />).
      </TheoremBlock>

      <ExampleBlock title="Price Elasticity of Demand (ADL Model)">
        A retailer wants to estimate how a price promotion propagates into demand over subsequent
        weeks. Weekly unit sales <InlineMath math="y_t" /> are regressed on log price{' '}
        <InlineMath math="x_t" />, its lags, and a lagged sales term.
        <br /><br />
        ADL(1,3) results: <InlineMath math="\hat\phi_1 = 0.35" /> (habit persistence),{' '}
        <InlineMath math="\hat\beta_0 = -0.80" /> (immediate price elasticity),{' '}
        <InlineMath math="\hat\beta_1 = -0.30" />, <InlineMath math="\hat\beta_2 = -0.12" />,{' '}
        <InlineMath math="\hat\beta_3 = -0.05" />.
        <br /><br />
        Long-run multiplier = <InlineMath math="(-0.80 - 0.30 - 0.12 - 0.05)/(1 - 0.35) = -1.96" />.
        A permanent 10% price cut increases long-run demand by approximately 19.6%.
      </ExampleBlock>

      <h2>Model Selection and Practical Guidance</h2>
      <p>
        Selecting <InlineMath math="p" /> and <InlineMath math="q" /> in ADL follows the same
        information-criterion approach as ARIMA:
      </p>
      <ul>
        <li>Use AIC to select for forecasting performance; BIC for parsimony.</li>
        <li>Check that residuals are white noise (Ljung-Box test).</li>
        <li>
          The <strong>general-to-specific (GtS)</strong> strategy starts with a generous{' '}
          <InlineMath math="p_{\max}" /> and <InlineMath math="q_{\max}" /> and eliminates
          insignificant lags sequentially.
        </li>
        <li>
          For forecasting, Almon lags with cross-validated degree and lag length often outperform
          unconstrained FDL by reducing variance.
        </li>
      </ul>

      <PythonCode code={dlCode} title="FDL, Almon PDL, Koyck, and ADL Models in Python" />

      <h2>Applications in Demand Forecasting</h2>
      <p>
        Distributed lag models are workhorses in demand forecasting:
      </p>
      <ul>
        <li>
          <strong>Advertising carryover:</strong> The effect of advertising spend on sales decays
          over time; Koyck or Almon lags capture the carryover effect.
        </li>
        <li>
          <strong>Promotional elasticity:</strong> Price cuts boost current and near-future demand
          (stockpiling effect); ADL models with 2–4 lags capture this.
        </li>
        <li>
          <strong>Interest rate pass-through:</strong> Changes in the central bank rate percolate
          through mortgage rates with distributed lags of up to 12 months.
        </li>
        <li>
          <strong>Supply chain delays:</strong> Material cost shocks propagate into final prices
          with lags determined by inventory cycles.
        </li>
      </ul>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
