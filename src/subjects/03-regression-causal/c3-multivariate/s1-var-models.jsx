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

const varCode = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.api import VAR
from statsmodels.tsa.stattools import adfuller
from statsmodels.stats.stattools import durbin_watson
import warnings
warnings.filterwarnings('ignore')

# ── Simulate a stable VAR(2) with 3 variables ─────────────────────────────
np.random.seed(42)
n = 300
k = 3   # number of variables

# VAR(2) coefficient matrices
A1 = np.array([
    [ 0.5,  0.1, -0.1],
    [ 0.2,  0.4,  0.0],
    [-0.1,  0.1,  0.6]
])
A2 = np.array([
    [-0.2,  0.0,  0.1],
    [ 0.0, -0.1,  0.0],
    [ 0.0,  0.0, -0.2]
])
intercept = np.array([0.5, 1.0, -0.5])
Sigma = np.array([
    [1.0, 0.3, 0.1],
    [0.3, 1.5, 0.2],
    [0.1, 0.2, 0.8]
])

# Check stability: eigenvalues of companion matrix < 1
companion = np.block([
    [A1, A2],
    [np.eye(k), np.zeros((k, k))]
])
eigvals = np.linalg.eigvals(companion)
print(f"Max eigenvalue modulus: {np.abs(eigvals).max():.4f}  (< 1 => stable)")

# Simulate
Y = np.zeros((n, k))
Y[0:2] = np.random.multivariate_normal(np.zeros(k), Sigma, 2)
for t in range(2, n):
    eps = np.random.multivariate_normal(np.zeros(k), Sigma)
    Y[t] = intercept + A1 @ Y[t-1] + A2 @ Y[t-2] + eps

dates = pd.date_range('2000-01', periods=n, freq='QS')
df    = pd.DataFrame(Y, index=dates, columns=['GDP', 'Inflation', 'Interest'])
train = df.iloc[:-12]
test  = df.iloc[-12:]

# ── Unit root tests ────────────────────────────────────────────────────────
for col in df.columns:
    adf_stat, pval, *_ = adfuller(df[col], autolag='AIC')
    print(f"{col}: ADF stat={adf_stat:.3f}, p={pval:.3f} {'[stationary]' if pval<0.05 else '[may be unit root]'}")

# ── Fit VAR with lag order selection ──────────────────────────────────────
model = VAR(train)
lag_order = model.select_order(maxlags=8)
print("\\nLag order selection:")
print(lag_order.summary())

p_opt = lag_order.aic   # AIC-selected lag order
print(f"\\nOptimal p (AIC): {p_opt}")

# ── Estimate VAR(p) ────────────────────────────────────────────────────────
results = model.fit(p_opt)
print(results.summary())

# Durbin-Watson for each equation
print("\\nDurbin-Watson statistics:")
for i, col in enumerate(df.columns):
    dw = durbin_watson(results.resid[col])
    print(f"  {col}: DW = {dw:.4f}")

# ── Granger causality in VAR ───────────────────────────────────────────────
print("\\n=== Granger Causality Tests ===")
gc_test = results.test_causality('GDP', ['Inflation', 'Interest'], kind='f')
print(gc_test.summary())

# ── Impulse Response Functions ─────────────────────────────────────────────
irf = results.irf(periods=12)
irf.plot(orth=True, figsize=(12, 8))
plt.suptitle('Orthogonalised Impulse Response Functions', y=1.02)
plt.tight_layout()
plt.show()

# Print specific IRF: response of GDP to 1SD shock in Interest rate
irf_vals = irf.orth_irfs[:, 0, 2]   # periods x (response=GDP) x (shock=Interest)
print("\\nGDP response to 1SD Interest shock (periods 0-11):")
for t, v in enumerate(irf_vals):
    print(f"  Period {t:2d}: {v:+.4f}")

# ── Forecast Error Variance Decomposition ─────────────────────────────────
fevd = results.fevd(10)
fevd.plot()
plt.suptitle('Forecast Error Variance Decomposition')
plt.tight_layout()
plt.show()

print("\\nFEVD for GDP at horizon 10:")
print(pd.DataFrame(fevd.decomp[0],
                   columns=df.columns,
                   index=[f'h={h}' for h in range(1, 11)]))

# ── Forecasting ────────────────────────────────────────────────────────────
fc = results.forecast(train.values[-p_opt:], steps=12)
fc_df = pd.DataFrame(fc, index=test.index, columns=df.columns)

mae = (test - fc_df).abs().mean()
print("\\n12-step forecast MAE:")
print(mae)

# ── Plot GDP forecast ──────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(11, 4))
ax.plot(train['GDP'][-20:], label='Train')
ax.plot(test['GDP'], label='Actual', color='black')
ax.plot(fc_df['GDP'], label='VAR forecast', color='red', linestyle='--')
ax.set_title(f'VAR({p_opt}) GDP Forecast (12 quarters ahead)')
ax.legend()
plt.tight_layout()
plt.show()
`;

const references = [
  {
    title: 'Time Series Analysis (2nd ed.) — Chapter 11',
    author: 'Hamilton, J.D.',
    year: 1994,
    url: 'https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis'
  },
  {
    title: 'Applied Econometrics: Time Series (4th ed.)',
    author: 'Enders, W.',
    year: 2014,
    url: 'https://www.wiley.com/en-us/Applied+Econometric+Time+Series%2C+4th+Edition-p-9781118808566'
  },
  {
    title: 'Forecasting: Principles and Practice — VAR Models',
    author: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/VAR.html'
  },
  {
    title: 'statsmodels VAR documentation',
    author: 'statsmodels contributors',
    year: 2023,
    url: 'https://www.statsmodels.org/stable/vector_ar.html'
  }
];

export default function VARModels() {
  const [activeSection, setActiveSection] = useState('model');

  const sections = {
    model: 'VAR Model',
    stability: 'Stability',
    irf: 'Impulse Response',
    fevd: 'Variance Decomp'
  };

  return (
    <SectionLayout
      title="Vector Autoregression (VAR)"
      difficulty="advanced"
      readingTime={15}
    >
      <p>
        Univariate ARIMA models treat each series in isolation. When multiple time series move
        together — GDP, inflation, and interest rates; supply, demand, and price — a{' '}
        <strong>Vector Autoregression (VAR)</strong> models them as a system, allowing each
        variable to depend on its own lags and the lags of all other variables. VAR is the
        standard tool for multivariate macroeconomic and financial forecasting and for analysing
        how shocks propagate through a system.
      </p>

      <DefinitionBlock term="VAR(p) Model">
        A <InlineMath math="k" />-dimensional VAR(<InlineMath math="p" />) model is:
        <BlockMath math="\mathbf{y}_t = \mathbf{c} + \mathbf{A}_1 \mathbf{y}_{t-1} + \mathbf{A}_2 \mathbf{y}_{t-2} + \cdots + \mathbf{A}_p \mathbf{y}_{t-p} + \boldsymbol{\varepsilon}_t" />
        where:
        <ul>
          <li><InlineMath math="\mathbf{y}_t = (y_{1,t}, \ldots, y_{k,t})'" /> is a <InlineMath math="k \times 1" /> vector</li>
          <li><InlineMath math="\mathbf{c}" /> is a <InlineMath math="k \times 1" /> constant vector</li>
          <li><InlineMath math="\mathbf{A}_i" /> are <InlineMath math="k \times k" /> coefficient matrices</li>
          <li><InlineMath math="\boldsymbol{\varepsilon}_t \sim \text{WN}(\mathbf{0}, \boldsymbol{\Sigma})" /> is a white noise vector with positive-definite covariance matrix <InlineMath math="\boldsymbol{\Sigma}" /></li>
        </ul>
        The total number of parameters (excluding the intercept) is <InlineMath math="p k^2" />, growing quickly with <InlineMath math="k" /> and <InlineMath math="p" />.
      </DefinitionBlock>

      <div style={{ margin: '1.5rem 0' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '2px solid #e5e7eb', marginBottom: '1rem' }}>
          {Object.entries(sections).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              style={{
                padding: '0.5rem 1.25rem',
                background: activeSection === key ? '#1d4ed8' : 'transparent',
                color: activeSection === key ? 'white' : '#374151',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px 4px 0 0',
                fontWeight: activeSection === key ? 'bold' : 'normal'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {activeSection === 'model' && (
          <div>
            <p>
              Each equation in a VAR is an OLS regression of <InlineMath math="y_{j,t}" /> on{' '}
              <InlineMath math="p" /> lags of all <InlineMath math="k" /> variables. Because all
              equations share the same regressors, OLS applied equation-by-equation is equivalent to
              GLS (Seemingly Unrelated Regressions yields no efficiency gain here).
            </p>
            <p>
              For a bivariate VAR(1) (<InlineMath math="k=2, p=1" />):
            </p>
            <BlockMath math="\begin{pmatrix}y_{1,t} \\ y_{2,t}\end{pmatrix} = \begin{pmatrix}c_1 \\ c_2\end{pmatrix} + \begin{pmatrix}a_{11} & a_{12} \\ a_{21} & a_{22}\end{pmatrix}\begin{pmatrix}y_{1,t-1} \\ y_{2,t-1}\end{pmatrix} + \begin{pmatrix}\varepsilon_{1,t} \\ \varepsilon_{2,t}\end{pmatrix}" />
          </div>
        )}

        {activeSection === 'stability' && (
          <div>
            <p>
              A VAR(p) is <strong>stable</strong> (covariance-stationary) if all eigenvalues of the
              companion matrix <InlineMath math="\mathbf{F}" /> lie strictly inside the unit circle:
            </p>
            <BlockMath math="\mathbf{F} = \begin{pmatrix} \mathbf{A}_1 & \mathbf{A}_2 & \cdots & \mathbf{A}_p \\ \mathbf{I}_k & \mathbf{0} & \cdots & \mathbf{0} \\ \vdots & & \ddots & \vdots \\ \mathbf{0} & \cdots & \mathbf{I}_k & \mathbf{0} \end{pmatrix}" />
            <p>
              The companion matrix is <InlineMath math="kp \times kp" />. Stability requires
              <InlineMath math="|\lambda_i(\mathbf{F})| < 1" /> for all <InlineMath math="i" />.
            </p>
          </div>
        )}

        {activeSection === 'irf' && (
          <div>
            <p>
              The <strong>Moving Average representation</strong> of a stable VAR is{' '}
              <InlineMath math="\mathbf{y}_t = \boldsymbol{\mu} + \sum_{h=0}^{\infty} \boldsymbol{\Phi}_h \boldsymbol{\varepsilon}_{t-h}" />{' '}
              where <InlineMath math="\boldsymbol{\Phi}_h" /> are the MA coefficient matrices.
            </p>
            <p>
              <InlineMath math="(\boldsymbol{\Phi}_h)_{ij}" /> is the <strong>impulse response</strong>:
              the effect on <InlineMath math="y_{i,t+h}" /> of a unit shock to{' '}
              <InlineMath math="\varepsilon_{j,t}" />. However, since <InlineMath math="\boldsymbol{\Sigma}" /> is
              generally non-diagonal, shocks are correlated. The standard fix is{' '}
              <strong>Cholesky orthogonalisation</strong>: write{' '}
              <InlineMath math="\boldsymbol{\Sigma} = \mathbf{P}\mathbf{P}'" /> and define
              orthogonalised shocks <InlineMath math="\mathbf{u}_t = \mathbf{P}^{-1}\boldsymbol{\varepsilon}_t" />.
            </p>
          </div>
        )}

        {activeSection === 'fevd' && (
          <div>
            <p>
              <strong>Forecast Error Variance Decomposition (FEVD)</strong> quantifies what fraction
              of the <InlineMath math="h" />-step forecast error variance of variable <InlineMath math="i" />{' '}
              is attributable to shocks in variable <InlineMath math="j" />:
            </p>
            <BlockMath math="\omega_{ij}(h) = \frac{\sum_{s=0}^{h-1} (\boldsymbol{\Phi}_s \mathbf{P})_{ij}^2}{\sum_{s=0}^{h-1} \sum_{\ell=1}^{k} (\boldsymbol{\Phi}_s \mathbf{P})_{i\ell}^2}" />
            <p>
              FEVD values sum to 1 across <InlineMath math="j" /> for each{' '}
              <InlineMath math="(i, h)" />. If <InlineMath math="\omega_{ij}(h)" /> is large, shocks
              to <InlineMath math="j" /> are important drivers of uncertainty in variable{' '}
              <InlineMath math="i" /> at horizon <InlineMath math="h" />.
            </p>
          </div>
        )}
      </div>

      <h2>Lag Order Selection</h2>
      <p>
        The lag order <InlineMath math="p" /> is selected by minimising an information criterion.
        The most common are:
      </p>
      <BlockMath math="\text{AIC}(p) = \ln|\hat{\boldsymbol{\Sigma}}(p)| + \frac{2 p k^2}{T}" />
      <BlockMath math="\text{BIC}(p) = \ln|\hat{\boldsymbol{\Sigma}}(p)| + \frac{p k^2 \ln T}{T}" />
      <p>
        where <InlineMath math="\hat{\boldsymbol{\Sigma}}(p)" /> is the estimated error covariance
        matrix and <InlineMath math="T" /> is the sample size. AIC tends to select larger{' '}
        <InlineMath math="p" /> (better forecasting); BIC favours parsimony.
      </p>

      <NoteBlock title="Curse of Dimensionality">
        A VAR(p) with <InlineMath math="k" /> variables has <InlineMath math="k(pk + 1)" />{' '}
        parameters per equation. With <InlineMath math="k=5" /> and <InlineMath math="p=4" />:{' '}
        <InlineMath math="5 \times (20 + 1) = 105" /> parameters per equation, 525 total. With{' '}
        <InlineMath math="T = 100" /> observations this is severely over-parameterised. Remedies
        include: small <InlineMath math="k" />, Bayesian VAR (with Minnesota prior), or factor-augmented VAR (FAVAR).
      </NoteBlock>

      <h2>Granger Causality in VAR</h2>
      <p>
        Within the VAR framework, variable <InlineMath math="j" /> <strong>Granger-causes</strong>{' '}
        variable <InlineMath math="i" /> if the coefficients on lags of{' '}
        <InlineMath math="y_{j}" /> in equation <InlineMath math="i" /> are jointly non-zero. This
        is tested with a Wald (<InlineMath math="\chi^2" />) or F-test on the block of coefficients
        <InlineMath math="\{a_{ij,1}, a_{ij,2}, \ldots, a_{ij,p}\}" />.
      </p>

      <h2>Orthogonalised Impulse Response Functions</h2>
      <p>
        The Cholesky decomposition approach requires ordering the variables: the first variable in
        the ordering responds only to its own shock at impact; subsequent variables can be
        instantaneously affected by earlier ones. The ordering embodies economic assumptions about
        contemporaneous causality and should be motivated by theory.
      </p>

      <WarningBlock title="Sensitivity to Cholesky Ordering">
        IRF results from Cholesky orthogonalisation depend on the variable ordering. If the ordering
        is controversial, consider <strong>generalised IRFs</strong> (Pesaran & Shin, 1998) which
        are invariant to ordering, or sign-restricted VARs which impose theoretically motivated
        restrictions on the direction of impact responses.
      </WarningBlock>

      <ExampleBlock title="Macroeconomic VAR: GDP, Inflation, Interest Rates">
        A standard application in central bank research: quarterly GDP growth, CPI inflation, and
        the short-term interest rate form a VAR(2) system. Key findings typically include:
        <ul>
          <li>A positive shock to the interest rate (monetary tightening) reduces GDP with a lag of 2–4 quarters (contractionary effect).</li>
          <li>GDP shocks explain 60–80% of GDP forecast error variance at all horizons (own-shock dominance).</li>
          <li>At a 4-quarter horizon, interest rate shocks explain 15–25% of GDP variance — policy has delayed but meaningful real effects.</li>
          <li>Inflation responds to interest rate shocks with a 1–2 quarter delay, consistent with price stickiness.</li>
        </ul>
      </ExampleBlock>

      <TheoremBlock
        title="Wold Decomposition for Stable VAR"
        proof="Any covariance-stationary process with absolutely summable MA coefficients admits a Wold decomposition. For a stable VAR(p), the companion matrix F has spectral radius < 1, so powers of F decay geometrically, ensuring Phi_h = J F^h J' where J selects the first k rows. Summability follows from geometric decay."
      >
        Every stable VAR(<InlineMath math="p" />) has a convergent Wold (MA(<InlineMath math="\infty" />))
        representation:
        <BlockMath math="\mathbf{y}_t = \boldsymbol{\mu} + \sum_{h=0}^{\infty} \boldsymbol{\Phi}_h \boldsymbol{\varepsilon}_{t-h}, \quad \sum_{h=0}^{\infty} \|\boldsymbol{\Phi}_h\| < \infty" />
        The MA coefficient matrices satisfy <InlineMath math="\boldsymbol{\Phi}_h = \mathbf{J} \mathbf{F}^h \mathbf{J}'" />{' '}
        where <InlineMath math="\mathbf{F}" /> is the companion matrix and <InlineMath math="\mathbf{J} = [\mathbf{I}_k, \mathbf{0}, \ldots, \mathbf{0}]" />.
      </TheoremBlock>

      <PythonCode code={varCode} title="VAR(p): Fitting, IRF, FEVD, and Forecasting" />

      <h2>Summary</h2>
      <ul>
        <li>
          VAR(p) models a system of <InlineMath math="k" /> time series as a multivariate
          autoregression, capturing cross-variable dynamics.
        </li>
        <li>
          Lag order is selected by AIC (forecasting) or BIC (parsimony); stability requires all
          companion matrix eigenvalues inside the unit circle.
        </li>
        <li>
          Granger causality tests identify which variables help predict others within the system.
        </li>
        <li>
          Orthogonalised IRFs trace the dynamic response to structural shocks; results depend on
          the Cholesky ordering.
        </li>
        <li>
          FEVD quantifies how much of each variable's forecast uncertainty stems from shocks to
          other variables.
        </li>
        <li>
          Dimensionality grows as <InlineMath math="pk^2" />, requiring either small systems or
          Bayesian regularisation for large VAR applications.
        </li>
      </ul>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
