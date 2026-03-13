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

const grangerCode = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import grangercausalitytests, adfuller
from statsmodels.tsa.api import VAR
import warnings
warnings.filterwarnings('ignore')

np.random.seed(123)
n = 200

# ── Simulate: x Granger-causes y, but y does NOT Granger-cause x ─────────
x = np.zeros(n)
y = np.zeros(n)
for t in range(3, n):
    x[t] = 0.6 * x[t-1] - 0.1 * x[t-2] + np.random.normal()
    y[t] = 0.3 * y[t-1] + 0.5 * x[t-1] + 0.2 * x[t-2] + np.random.normal()

dates = pd.date_range('2000-01', periods=n, freq='MS')
df = pd.DataFrame({'x': x, 'y': y}, index=dates)

# ── ADF tests (Granger causality requires stationary series) ──────────────
for col in ['x', 'y']:
    stat, pval, *_ = adfuller(df[col], autolag='AIC')
    print(f"ADF {col}: stat={stat:.3f}, p={pval:.4f}")

# ── Test: Does x Granger-cause y? ─────────────────────────────────────────
print("\\n=== Does x Granger-cause y? ===")
gc_xy = grangercausalitytests(df[['y', 'x']], maxlag=5, verbose=True)
# Note: first column is the 'caused' variable

# ── Test: Does y Granger-cause x? (should not) ────────────────────────────
print("\\n=== Does y Granger-cause x? ===")
gc_yx = grangercausalitytests(df[['x', 'y']], maxlag=5, verbose=True)

# ── Extract p-values for a tidy summary ───────────────────────────────────
def granger_pvalues(gc_result, test='ssr_chi2test'):
    return {lag: result[0][test][1] for lag, result in gc_result.items()}

pvals_xy = granger_pvalues(gc_xy)
pvals_yx = granger_pvalues(gc_yx)

print("\\nSummary: p-values for F-test")
print(f"{'Lag':>5}  {'x->y':>10}  {'y->x':>10}")
for lag in range(1, 6):
    print(f"{lag:>5}  {pvals_xy[lag]:>10.4f}  {pvals_yx[lag]:>10.4f}")

# ── VAR-based Granger causality (block exogeneity test) ───────────────────
print("\\n=== VAR-based block exogeneity Granger causality ===")
var_model = VAR(df)
var_fit   = var_model.fit(maxlags=4, ic='aic')
print(f"VAR lag order: {var_fit.k_ar}")

# Does x Granger-cause y in the VAR?
gc_var = var_fit.test_causality('y', ['x'], kind='f')
print("\\nx -> y in VAR:")
print(gc_var.summary())

gc_var2 = var_fit.test_causality('x', ['y'], kind='f')
print("y -> x in VAR:")
print(gc_var2.summary())

# ── Instantaneous causality ───────────────────────────────────────────────
ic_test = var_fit.test_inst_causality('y', 'x')
print("\\nInstantaneous causality x <-> y:")
print(ic_test.summary())

# ── Practical application: macro data ────────────────────────────────────
# Simulate: Leading indicator (LEI) predicts GDP growth
lei  = np.cumsum(np.random.normal(0.1, 1, n))          # I(1) series
gdp  = np.r_[0, 0.6 * lei[:-1] + np.random.normal(0, 0.5, n-1)]  # lei leads
macro = pd.DataFrame({'LEI': np.diff(lei), 'dGDP': np.diff(gdp)},
                     index=dates[1:])

print("\\n=== Macro: Does LEI Granger-cause GDP growth? ===")
gc_macro = grangercausalitytests(macro[['dGDP', 'LEI']], maxlag=4, verbose=False)
for lag, res in gc_macro.items():
    fstat, pval, df1, df2 = res[0]['ssr_ftest']
    sig = '***' if pval < 0.01 else '**' if pval < 0.05 else '*' if pval < 0.1 else ''
    print(f"  Lag {lag}: F={fstat:.3f}, p={pval:.4f} {sig}")

# ── Plot: CCF helps identify lag at which causality operates ──────────────
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

# Cross-correlation: x leads y
lags_range = range(-6, 7)
ccf_vals = [df['y'].corr(df['x'].shift(lag)) for lag in lags_range]
axes[0].bar(list(lags_range), ccf_vals, color=['red' if lag > 0 else 'steelblue' for lag in lags_range])
axes[0].axhline(0, color='black', linewidth=0.8)
axes[0].set_xlabel('Lag (positive = x leads y)')
axes[0].set_title('Cross-Correlation: x and y')

# P-values across lags
axes[1].semilogy(list(pvals_xy.keys()), list(pvals_xy.values()), 'o-', label='x->y', color='red')
axes[1].semilogy(list(pvals_yx.keys()), list(pvals_yx.values()), 's--', label='y->x', color='blue')
axes[1].axhline(0.05, color='grey', linestyle=':', label='5% threshold')
axes[1].set_xlabel('Lag')
axes[1].set_ylabel('p-value (log scale)')
axes[1].set_title('Granger Causality p-values')
axes[1].legend()
plt.tight_layout()
plt.show()
`;

const references = [
  {
    title: 'Investigating Causal Relations by Econometric Models and Cross-spectral Methods',
    author: 'Granger, C.W.J.',
    year: 1969,
    url: 'https://www.jstor.org/stable/1912791'
  },
  {
    title: 'Time Series Analysis (2nd ed.) — Chapters 11-12',
    author: 'Hamilton, J.D.',
    year: 1994,
    url: 'https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis'
  },
  {
    title: 'statsmodels grangercausalitytests',
    author: 'statsmodels contributors',
    year: 2023,
    url: 'https://www.statsmodels.org/stable/generated/statsmodels.tsa.stattools.grangercausalitytests.html'
  },
  {
    title: 'Causality, Forecasting and Economic Theory',
    author: 'Hoover, K.D.',
    year: 2001,
    url: 'https://www.cambridge.org/core/books/causality-in-macroeconomics/7A1E7C74BFCFE8A26CAD0A7396D16A35'
  }
];

export default function GrangerCausality() {
  const [showLimitations, setShowLimitations] = useState(false);

  return (
    <SectionLayout
      title="Granger Causality"
      difficulty="advanced"
      readingTime={10}
    >
      <p>
        When building forecasting models with multiple time series, a critical question is:
        does knowing the past of series <InlineMath math="X" /> help predict series{' '}
        <InlineMath math="Y" />, beyond what is already captured by the past of <InlineMath math="Y" />{' '}
        itself? This is the question answered by <strong>Granger causality</strong>, one of the
        most widely used concepts in time series econometrics.
      </p>

      <DefinitionBlock term="Granger Causality">
        Series <InlineMath math="X" /> <strong>Granger-causes</strong> series <InlineMath math="Y" />{' '}
        if, using all available information including the history of <InlineMath math="X" />,{' '}
        <InlineMath math="Y" /> can be predicted more accurately than using only the history of{' '}
        <InlineMath math="Y" /> and other available information excluding <InlineMath math="X" />.
        Formally, in terms of mean squared prediction error:
        <BlockMath math="\text{MSE}(Y_{t+h} \mid \mathcal{F}_{t}) < \text{MSE}(Y_{t+h} \mid \mathcal{F}_{t} \setminus \{X_s : s \leq t\})" />
        where <InlineMath math="\mathcal{F}_t" /> is the full information set at time <InlineMath math="t" />.
      </DefinitionBlock>

      <h2>The F-Test for Granger Causality</h2>
      <p>
        In a bivariate VAR(p) setting, Granger causality from <InlineMath math="X" /> to{' '}
        <InlineMath math="Y" /> is tested by comparing two OLS regressions:
      </p>
      <p><strong>Unrestricted (full) model:</strong></p>
      <BlockMath math="y_t = \alpha + \sum_{i=1}^{p} \phi_i y_{t-i} + \sum_{j=1}^{p} \gamma_j x_{t-j} + \varepsilon_t" />
      <p><strong>Restricted model (excluding lags of x):</strong></p>
      <BlockMath math="y_t = \alpha + \sum_{i=1}^{p} \phi_i y_{t-i} + u_t" />
      <p>
        The null hypothesis <InlineMath math="H_0: \gamma_1 = \gamma_2 = \cdots = \gamma_p = 0" />{' '}
        (X does not Granger-cause Y) is tested with an F-statistic:
      </p>
      <BlockMath math="F = \frac{(\text{RSS}_R - \text{RSS}_U)/p}{\text{RSS}_U/(T - 2p - 1)} \sim F(p,\; T - 2p - 1)" />
      <p>
        Under <InlineMath math="H_0" />, rejection implies X Granger-causes Y at the chosen
        significance level.
      </p>

      <NoteBlock title="Chi-squared vs F-test">
        statsmodels <code>grangercausalitytests</code> reports both the F-test and a{' '}
        <InlineMath math="\chi^2" />-based likelihood ratio test (<code>ssr_chi2test</code>).
        The F-test is more appropriate in small samples; both are asymptotically equivalent.
        For small <InlineMath math="T" />, always use the F-test.
      </NoteBlock>

      <TheoremBlock
        title="VAR Block Exogeneity Test"
        proof="In a VAR(p), the Granger non-causality restriction that variable j does not Granger-cause variable i is equivalent to the block of coefficients A_ij(1), A_ij(2), ..., A_ij(p) being jointly zero. This is a linear restriction on the coefficient matrix, testable with a standard Wald or F-test."
      >
        In a VAR(p) model, <InlineMath math="X" /> does not Granger-cause <InlineMath math="Y" />{' '}
        if and only if in the <InlineMath math="Y" />-equation:
        <BlockMath math="A_{yx,1} = A_{yx,2} = \cdots = A_{yx,p} = \mathbf{0}" />
        The Wald statistic for this joint restriction is asymptotically{' '}
        <InlineMath math="\chi^2(p)" /> under <InlineMath math="H_0" />.
      </TheoremBlock>

      <h2>Choosing the Lag Length p</h2>
      <p>
        The test outcome depends on <InlineMath math="p" />. Common practice:
      </p>
      <ul>
        <li>
          Select <InlineMath math="p" /> using AIC or BIC on the unrestricted VAR, then report
          results for this data-driven choice.
        </li>
        <li>
          As a robustness check, report results for a range of lags (<InlineMath math="p = 1, \ldots, p_{\max}" />).
        </li>
        <li>
          If results flip across lag lengths, the Granger relationship is fragile — report
          this honestly.
        </li>
      </ul>

      <h2>Instantaneous Causality</h2>
      <p>
        Granger causality tests based on lags only test for predictive improvement using{' '}
        <em>past</em> values. A distinct concept is <strong>instantaneous causality</strong>:
        whether <InlineMath math="\varepsilon_{x,t}" /> and <InlineMath math="\varepsilon_{y,t}" />{' '}
        are contemporaneously correlated (i.e., <InlineMath math="\Sigma_{xy} \neq 0" />). This is
        tested by asking whether knowing the current innovation in <InlineMath math="X" /> improves
        the forecast of current <InlineMath math="Y" /> beyond its own innovation.
      </p>

      <ExampleBlock title="Leading Economic Indicators and GDP">
        A classic application: does the Conference Board Leading Economic Index (LEI) Granger-cause
        future GDP growth?
        <br /><br />
        Using quarterly US data (1970–2024), we test whether changes in LEI Granger-cause changes
        in real GDP growth over lags 1–6. Results typically show strong rejection of non-causality
        at lags 1–4 (p &lt; 0.01), confirming the LEI's predictive value for near-term GDP. The
        reverse test (GDP growth Granger-causing LEI changes) is typically weak, supporting the
        leading indicator interpretation.
        <br /><br />
        However, correlation structures change over time; it is good practice to test over rolling
        sub-samples to check stability of the Granger relationship.
      </ExampleBlock>

      <div
        style={{ margin: '1.5rem 0', padding: '1.25rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca', cursor: 'pointer' }}
        onClick={() => setShowLimitations(!showLimitations)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ color: '#dc2626' }}>Critical Limitations of Granger Causality</strong>
          <span style={{ color: '#dc2626' }}>{showLimitations ? '▲ Hide' : '▼ Show'}</span>
        </div>
        {showLimitations && (
          <ul style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#7f1d1d' }}>
            <li>
              <strong>Not true causality:</strong> Granger causality is purely a predictability
              concept. A common cause (third variable) driving both <InlineMath math="X" /> and{' '}
              <InlineMath math="Y" /> with different lags will appear as Granger causality from{' '}
              <InlineMath math="X" /> to <InlineMath math="Y" /> even though <InlineMath math="X" />{' '}
              has no causal influence on <InlineMath math="Y" />.
            </li>
            <li>
              <strong>Omitted variables:</strong> The "all available information" in Granger's
              definition is approximated by the finite VAR. If a confounding variable is omitted,
              spurious Granger causality can appear.
            </li>
            <li>
              <strong>Non-stationarity:</strong> Standard Granger causality tests are invalid for
              I(1) series. Either difference first or use the Toda-Yamamoto procedure (fit a
              VAR(p+1) in levels and test on p lags only).
            </li>
            <li>
              <strong>Measurement frequency:</strong> Granger causality depends on the observation
              frequency; a relationship visible in monthly data may vanish or reverse at quarterly
              frequency due to temporal aggregation.
            </li>
            <li>
              <strong>Structural breaks:</strong> A Granger relationship stable in historical data
              may break down after structural changes (Lucas critique).
            </li>
          </ul>
        )}
      </div>

      <h2>Toda-Yamamoto Procedure for I(1) Series</h2>
      <p>
        When series may be I(1) or cointegrated, standard Granger causality tests have non-standard
        limiting distributions. The <strong>Toda-Yamamoto (1995)</strong> procedure avoids this:
      </p>
      <ol>
        <li>Test integration order; let maximum order be <InlineMath math="d_{\max}" />.</li>
        <li>Select the optimal VAR lag order <InlineMath math="p" /> (treating series as levels).</li>
        <li>Fit a VAR of order <InlineMath math="p + d_{\max}" /> in levels (intentionally over-lagged).</li>
        <li>Perform the Wald test on only the first <InlineMath math="p" /> lags (ignore the extra <InlineMath math="d_{\max}" /> lags).</li>
        <li>Under <InlineMath math="H_0" />, the Wald statistic is asymptotically <InlineMath math="\chi^2(p)" /> even when series are I(1).</li>
      </ol>

      <h2>Applications in Forecasting</h2>
      <p>
        Granger causality testing guides model building in several important ways:
      </p>
      <ul>
        <li>
          <strong>Variable selection:</strong> Include a variable in a VAR or ARIMAX only if it
          Granger-causes the target; otherwise it adds noise.
        </li>
        <li>
          <strong>Leading indicators:</strong> Identify variables with strong Granger effects at
          long lags for early-warning forecasting.
        </li>
        <li>
          <strong>Causal feature engineering:</strong> In machine learning forecasting, variables
          that Granger-cause the target are good feature candidates.
        </li>
        <li>
          <strong>Model evaluation:</strong> After fitting a VAR, verify that Granger relationships
          in the model match economic priors.
        </li>
      </ul>

      <WarningBlock title="Multiple Testing">
        In a VAR with <InlineMath math="k" /> variables, there are <InlineMath math="k(k-1)" />{' '}
        Granger causality tests (each variable against each other). Running all at the 5% level
        gives a high family-wise error rate. Apply Bonferroni correction (divide threshold by number
        of tests) or use Holm's method to control for multiple comparisons.
      </WarningBlock>

      <PythonCode code={grangerCode} title="Granger Causality Tests: statsmodels and VAR" />

      <h2>Summary</h2>
      <ul>
        <li>
          Granger causality measures whether the past of <InlineMath math="X" /> improves
          predictions of <InlineMath math="Y" /> beyond <InlineMath math="Y" />'s own history.
        </li>
        <li>
          The F-test on block zero restrictions in a VAR or bivariate regression is the standard
          implementation.
        </li>
        <li>
          It is a predictability concept, not causal in the structural sense — omitted variables
          and common causes can create spurious Granger relationships.
        </li>
        <li>
          For I(1) series, use the Toda-Yamamoto procedure to maintain valid asymptotic inference.
        </li>
        <li>
          Granger causality results guide variable selection, lead-lag identification, and model
          validation in multivariate forecasting.
        </li>
      </ul>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
