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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Illustrative coherence gaps: base forecasts vs reconciled for 7 series
const coherenceData = [
  { name: 'Total',    base: 348, ols: 336, wls: 338, mint: 340, actual: 341 },
  { name: 'ProdA',   base: 200, ols: 196, wls: 197, mint: 198, actual: 199 },
  { name: 'ProdB',   base: 158, ols: 140, wls: 141, mint: 142, actual: 142 },
  { name: 'A-North', base: 115, ols: 112, wls: 113, mint: 114, actual: 113 },
  { name: 'A-South', base:  88, ols:  84, wls:  84, mint:  85, actual:  86 },
  { name: 'B-North', base:  83, ols:  78, wls:  79, mint:  79, actual:  80 },
  { name: 'B-South', base:  62, ols:  62, wls:  62, mint:  63, actual:  62 },
];

const reconciliationCode = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.holtwinters import ExponentialSmoothing
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n = 60   # 5 years monthly

# ── Same 4-bottom hierarchy as previous section ────────────────────────────
def gen(base, trend, amp, noise):
    t = np.arange(n)
    return base + trend*t + amp*np.sin(2*np.pi*t/12) + np.random.normal(0, noise, n)

a_north = gen(100, 0.3, 10, 4)
a_south = gen( 80, 0.2,  8, 3)
b_north = gen( 60, 0.4,  6, 3)
b_south = gen( 40, 0.1,  4, 2)

prod_a = a_north + a_south
prod_b = b_north + b_south
total  = prod_a + prod_b

dates = pd.date_range('2019-01', periods=n, freq='MS')
all_series = np.column_stack([total, prod_a, prod_b, a_north, a_south, b_north, b_south])
labels = ['Total','ProdA','ProdB','A_North','A_South','B_North','B_South']
df = pd.DataFrame(all_series, index=dates, columns=labels)
train, test = df.iloc[:-12], df.iloc[-12:]

# Summing matrix S (7 x 4)
S = np.array([
    [1,1,1,1],
    [1,1,0,0],
    [0,0,1,1],
    [1,0,0,0],
    [0,1,0,0],
    [0,0,1,0],
    [0,0,0,1],
])
n_all, m = S.shape   # 7, 4

def ets_fc(series, h=12):
    mdl = ExponentialSmoothing(series, trend='add', seasonal='add', seasonal_periods=12)
    return mdl.fit(optimized=True).forecast(h)

# ── Base forecasts for ALL 7 series independently ─────────────────────────
base_fc = {}
for col in labels:
    base_fc[col] = ets_fc(train[col])

base_matrix = np.column_stack([base_fc[c].values for c in labels])  # (12 x 7)
yhat = base_matrix.T   # (7 x 12)

print("Base forecasts (incoherent): gap at total level")
gap = base_fc['Total'].values - (base_fc['A_North'].values + base_fc['A_South'].values +
                                   base_fc['B_North'].values + base_fc['B_South'].values)
print(f"  Mean coherence gap: {gap.mean():.4f}")

# ── OLS Reconciliation ────────────────────────────────────────────────────
# P_OLS = S(S'S)^{-1}S' — projects onto the coherent subspace
STS_inv = np.linalg.inv(S.T @ S)
P_ols = S @ STS_inv @ S.T    # (n_all x n_all)
yhat_ols = P_ols @ yhat       # (7 x 12)

# ── WLS Reconciliation ────────────────────────────────────────────────────
# Diagonal weight matrix W = diag(variance of base forecast errors)
# Estimate from in-sample residuals
residuals = np.zeros((n_all, n - 12))
for i, col in enumerate(labels):
    mdl = ExponentialSmoothing(df[col].iloc[:n-12], trend='add', seasonal='add', seasonal_periods=12)
    fit = mdl.fit(optimized=True)
    residuals[i] = fit.resid[-residuals.shape[1]:]

variances = residuals.var(axis=1)
W_diag = np.diag(variances)
W_inv  = np.diag(1.0 / variances)

P_wls = S @ np.linalg.inv(S.T @ W_inv @ S) @ S.T @ W_inv
yhat_wls = P_wls @ yhat

# ── MinT (Minimum Trace) Reconciliation ──────────────────────────────────
# Use shrinkage estimator of full covariance Sigma_h
# Simple version: use sample covariance of residuals
Sigma_hat = np.cov(residuals)   # (7 x 7)
# Shrinkage towards scaled identity (Ledoit-Wolf style, simplified)
shrink = 0.2
n_obs = residuals.shape[1]
Sigma_shrunk = (1 - shrink) * Sigma_hat + shrink * np.trace(Sigma_hat)/n_all * np.eye(n_all)
Sigma_inv = np.linalg.inv(Sigma_shrunk)

P_mint = S @ np.linalg.inv(S.T @ Sigma_inv @ S) @ S.T @ Sigma_inv
yhat_mint = P_mint @ yhat

# ── Verify coherence ──────────────────────────────────────────────────────
for name, yhat_r in [('OLS', yhat_ols), ('WLS', yhat_wls), ('MinT', yhat_mint)]:
    gap = yhat_r[0] - (yhat_r[3] + yhat_r[4] + yhat_r[5] + yhat_r[6])
    print(f"{name} coherence gap (should be ~0): {np.abs(gap).max():.2e}")

# ── Compute accuracy ─────────────────────────────────────────────────────
actual = test[labels].values.T   # (7 x 12)

def rmsse(actual, forecast, train_vals):
    """Root Mean Scaled Squared Error."""
    scale = np.mean(np.diff(train_vals)**2)
    return np.sqrt(np.mean((actual - forecast)**2) / scale)

results = {}
for name, fc in [('Base', yhat), ('OLS', yhat_ols), ('WLS', yhat_wls), ('MinT', yhat_mint)]:
    rmsse_vals = []
    for i, col in enumerate(labels):
        rmsse_vals.append(rmsse(actual[i], fc[i], train[col].values))
    results[name] = rmsse_vals
    print(f"\n{name} RMSSE by series:")
    for col, v in zip(labels, rmsse_vals):
        print(f"  {col:<10}: {v:.4f}")

# ── hierarchicalforecast library (full pipeline) ──────────────────────────
try:
    from hierarchicalforecast.utils import aggregate
    from hierarchicalforecast.core import ReconcilerForecasts
    from hierarchicalforecast.methods import (
        BottomUp, TopDown, MinTrace, ERM
    )

    # Build long-format DataFrame
    bottom_cols = ['A_North', 'A_South', 'B_North', 'B_South']
    tag_df = pd.DataFrame({
        'A_North': {'Product': 'A', 'Region': 'North'},
        'A_South': {'Product': 'A', 'Region': 'South'},
        'B_North': {'Product': 'B', 'Region': 'North'},
        'B_South': {'Product': 'B', 'Region': 'South'},
    }).T.reset_index().rename(columns={'index': 'item'})

    long_df = []
    for col in bottom_cols:
        tmp = df[[col]].reset_index().rename(columns={'index':'ds', col:'y'})
        tmp['unique_id'] = col
        long_df.append(tmp)
    Y_df = pd.concat(long_df)

    # Create hierarchy using aggregate utility
    spec = [['Product'], ['Region'], ['Product', 'Region']]
    Y_hier, S_df, tags = aggregate(Y_df, spec)
    print("\nhierarchicalforecast: hierarchy created")
    print(f"S matrix shape: {S_df.shape}")

    reconcilers = [
        BottomUp(),
        MinTrace(method='mint_shrink'),
    ]

    print("\\nFor full reconciliation, fit base models and pass to ReconcilerForecasts.")
    print("See: https://nixtlaverse.nixtla.io/hierarchicalforecast/index.html")

except ImportError:
    print("\\nInstall: pip install hierarchicalforecast")

# ── Plot: Total level comparison ─────────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 4))
ax.plot(train['Total'][-24:], label='Train', color='gray')
ax.plot(test['Total'], label='Actual', color='black', linewidth=2)
ax.plot(test.index, yhat[0], label='Base (incoherent)', color='orange', linestyle='--')
ax.plot(test.index, yhat_ols[0], label='OLS reconciled', color='blue', linestyle='-.')
ax.plot(test.index, yhat_mint[0], label='MinT reconciled', color='red', linestyle=':')
ax.set_title('Total-Level Forecast: Base vs Reconciliation Methods')
ax.legend()
plt.tight_layout()
plt.show()
`;

const references = [
  {
    title: 'Optimal Combination Forecasts for Hierarchical Time Series',
    author: 'Hyndman, R.J., Ahmed, R.A., Athanasopoulos, G. & Shang, H.L.',
    year: 2011,
    url: 'https://www.tandfonline.com/doi/abs/10.1198/jcgs.2011.09107'
  },
  {
    title: 'Fast Computation of Reconciled Forecasts for Hierarchical and Grouped Time Series',
    author: 'Hyndman, R.J., Lee, A.J. & Wang, E.',
    year: 2016,
    url: 'https://www.sciencedirect.com/science/article/pii/S0167947315002723'
  },
  {
    title: 'Forecasting: Principles and Practice (3rd ed.) — Forecast Reconciliation',
    author: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/reconciliation.html'
  },
  {
    title: 'Probabilistic Forecast Reconciliation: Properties, Evaluation and Score Optimisation',
    author: 'Panagiotelis, A., Athanasopoulos, G., Gamakumara, P. & Hyndman, R.J.',
    year: 2023,
    url: 'https://doi.org/10.1016/j.ejor.2022.07.040'
  }
];

export default function ForecastReconciliation() {
  const [selectedMethod, setSelectedMethod] = useState('ols');

  const methods = {
    ols: {
      name: 'OLS',
      full: 'Ordinary Least Squares',
      formula: String.raw`\mathbf{P}_{\text{OLS}} = \mathbf{S}(\mathbf{S}'\mathbf{S})^{-1}\mathbf{S}'`,
      W: String.raw`\mathbf{W} = \mathbf{I}_n`,
      desc: 'Minimises sum of squared adjustments. Equivalent to projecting base forecasts onto the coherent subspace. Does not account for differing accuracies across series.',
    },
    wls: {
      name: 'WLS',
      full: 'Weighted Least Squares (structural)',
      formula: String.raw`\mathbf{P}_{\text{WLS}} = \mathbf{S}(\mathbf{S}'\mathbf{W}^{-1}\mathbf{S})^{-1}\mathbf{S}'\mathbf{W}^{-1}`,
      W: String.raw`\mathbf{W} = \text{diag}(\hat{\sigma}_1^2, \ldots, \hat{\sigma}_n^2)`,
      desc: 'Down-weights series with high forecast variance. The structural (series-count) version uses the number of bottom-level series aggregated to each level as weights.',
    },
    mint_sample: {
      name: 'MinT (sample)',
      full: 'Minimum Trace (sample covariance)',
      formula: String.raw`\mathbf{P}_{\text{MinT}} = \mathbf{S}(\mathbf{S}'\hat{\boldsymbol{\Sigma}}_h^{-1}\mathbf{S})^{-1}\mathbf{S}'\hat{\boldsymbol{\Sigma}}_h^{-1}`,
      W: String.raw`\mathbf{W} = \hat{\boldsymbol{\Sigma}}_h \text{ (full covariance)}`,
      desc: 'Uses the full covariance matrix of base forecast errors, accounting for cross-series correlations. Requires sufficient in-sample residuals to estimate the covariance well.',
    },
    mint_shrink: {
      name: 'MinT (shrink)',
      full: 'Minimum Trace (shrinkage)',
      formula: String.raw`\hat{\boldsymbol{\Sigma}}_h^* = \lambda \hat{\mathbf{D}} + (1-\lambda)\hat{\boldsymbol{\Sigma}}_h`,
      W: String.raw`\hat{\boldsymbol{\Sigma}}_h^* \text{ (shrunk towards diagonal)}`,
      desc: 'Shrinks the sample covariance towards a diagonal (Ledoit-Wolf style), regularising the estimate when n is large relative to T. The most robust MinT variant in practice.',
    }
  };

  const m = methods[selectedMethod];

  return (
    <SectionLayout
      title="Forecast Reconciliation"
      difficulty="advanced"
      readingTime={13}
    >
      <p>
        Independently forecasting each series in a hierarchy almost never produces coherent
        forecasts — the bottom-level forecasts will not sum to the top-level forecast.{' '}
        <strong>Forecast reconciliation</strong> adjusts a set of base forecasts to satisfy the
        summing constraints, while minimising the information lost in the adjustment. Modern
        reconciliation methods (Hyndman et al., 2011) frame this as a weighted least squares
        problem, leading to a unified theory that nests bottom-up and top-down as special cases.
      </p>

      <DefinitionBlock term="Reconciled Forecast">
        Given incoherent base forecasts <InlineMath math="\hat{\mathbf{y}}_h" /> for all{' '}
        <InlineMath math="n" /> series, a <strong>reconciled forecast</strong> takes the form:
        <BlockMath math="\tilde{\mathbf{y}}_h = \mathbf{S}\mathbf{P}\hat{\mathbf{y}}_h" />
        where <InlineMath math="\mathbf{P}" /> is an <InlineMath math="m \times n" /> matrix that
        maps all base forecasts to the <InlineMath math="m" /> bottom-level series, and{' '}
        <InlineMath math="\mathbf{S}" /> then re-aggregates to all <InlineMath math="n" /> levels.
        By construction, <InlineMath math="\tilde{\mathbf{y}}_h = \mathbf{S}\mathbf{b}_h" /> for
        the bottom-level reconciled forecast <InlineMath math="\mathbf{b}_h = \mathbf{P}\hat{\mathbf{y}}_h" />,
        so all reconciled forecasts are coherent.
      </DefinitionBlock>

      <h2>The General Reconciliation Framework</h2>
      <p>
        Hyndman et al. (2011) show that the optimal linear unbiased reconciled forecast minimises
        the trace of the reconciled forecast error covariance matrix. The solution is:
      </p>
      <BlockMath math="\mathbf{P} = (\mathbf{S}'\mathbf{W}_h^{-1}\mathbf{S})^{-1}\mathbf{S}'\mathbf{W}_h^{-1}" />
      <p>
        where <InlineMath math="\mathbf{W}_h" /> is the <InlineMath math="n \times n" />{' '}
        covariance matrix of the <InlineMath math="h" />-step base forecast errors. Different
        choices of <InlineMath math="\mathbf{W}_h" /> give different reconciliation methods:
      </p>

      <div style={{ margin: '1.5rem 0' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {Object.entries(methods).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedMethod(key)}
              style={{
                padding: '0.4rem 1.1rem',
                background: selectedMethod === key ? '#7c3aed' : '#ede9fe',
                color: selectedMethod === key ? 'white' : '#5b21b6',
                border: `1px solid ${selectedMethod === key ? '#6d28d9' : '#c4b5fd'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: selectedMethod === key ? 'bold' : 'normal'
              }}
            >
              {val.name}
            </button>
          ))}
        </div>
        <div style={{ padding: '1.25rem', background: '#faf5ff', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
          <strong>{m.full}</strong>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{m.desc}</p>
          <BlockMath math={m.formula} />
          <p style={{ fontSize: '0.85rem', color: '#6b21a8' }}>
            Weight matrix: <InlineMath math={m.W} />
          </p>
        </div>
      </div>

      <TheoremBlock
        title="Unbiasedness of WLS Reconciliation"
        proof="If the base forecasts are unbiased (E[hat{y}_h] = y_h), then SP*E[hat{y}_h] = SP*y_h = S*P*S*b_h. For reconciliation to preserve unbiasedness we need SPS = S, i.e., P is a left-inverse of S. The WLS solution P=(S'W^{-1}S)^{-1}S'W^{-1} satisfies SPS=S because S(S'W^{-1}S)^{-1}S'W^{-1}S = S*I = S."
      >
        If the base forecasts <InlineMath math="\hat{\mathbf{y}}_h" /> are unbiased, then the
        WLS reconciled forecasts <InlineMath math="\tilde{\mathbf{y}}_h = \mathbf{SP}\hat{\mathbf{y}}_h" />{' '}
        are also unbiased for any positive-definite weight matrix <InlineMath math="\mathbf{W}" />,
        provided <InlineMath math="\mathbf{SPS} = \mathbf{S}" /> — a condition satisfied by the
        WLS estimator of <InlineMath math="\mathbf{P}" />.
      </TheoremBlock>

      {/* Recharts: base vs reconciled comparison */}
      <div style={{ margin: '1.5rem 0', padding: '1rem', background: '#faf5ff', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
          Base vs Reconciled Forecasts (Illustrative)
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={coherenceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="base"   fill="#f97316" name="Base (incoherent)" />
            <Bar dataKey="ols"    fill="#2563eb" name="OLS reconciled" />
            <Bar dataKey="mint"   fill="#7c3aed" name="MinT reconciled" />
            <Bar dataKey="actual" fill="#374151" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
          Base forecasts are incoherent (ProdA+ProdB ≠ Total). All reconciled forecasts are coherent
          by construction; MinT stays closest to actuals by leveraging covariance information.
        </p>
      </div>

      <h2>OLS Reconciliation</h2>
      <p>
        Setting <InlineMath math="\mathbf{W} = \mathbf{I}_n" /> gives the OLS reconciliation,
        which minimises <InlineMath math="\|\hat{\mathbf{y}}_h - \tilde{\mathbf{y}}_h\|^2" />{' '}
        (the total squared adjustment). Geometrically, it orthogonally projects the base forecast
        vector onto the coherent subspace <InlineMath math="\{\mathbf{Sb} : \mathbf{b} \in \mathbb{R}^m\}" />.
      </p>

      <NoteBlock title="OLS = Ordinary Projection">
        OLS reconciliation is equivalent to Moore-Penrose pseudo-inverse projection:{' '}
        <InlineMath math="\mathbf{P}_{\text{OLS}} = \mathbf{S}(\mathbf{S}'\mathbf{S})^{-1}\mathbf{S}' = \mathbf{S}\mathbf{S}^+" /> (when S has full column rank).
        Bottom-up is also a special case: it corresponds to{' '}
        <InlineMath math="\mathbf{W} = \text{diag}(\mathbf{S}\mathbf{S}')" />, which assigns zero
        weight to all but the bottom-level series.
      </NoteBlock>

      <h2>MinT: Minimum Trace Reconciliation</h2>
      <p>
        The <strong>Minimum Trace (MinT)</strong> reconciliation (Wickramasuriya et al., 2019)
        uses <InlineMath math="\mathbf{W}_h = \hat{\boldsymbol{\Sigma}}_h" />, the estimated
        covariance of the <InlineMath math="h" />-step base forecast errors. This produces
        reconciled forecasts that minimise the total forecast error variance across all series.
      </p>
      <p>
        The trace of the reconciled forecast error covariance is:
      </p>
      <BlockMath math="\text{tr}(\mathbf{V}_h) = \text{tr}\!\left[\mathbf{S}(\mathbf{S}'\boldsymbol{\Sigma}_h^{-1}\mathbf{S})^{-1}\mathbf{S}'\right]" />
      <p>
        MinT minimises this over all unbiased linear reconciliation matrices <InlineMath math="\mathbf{P}" />.
      </p>

      <WarningBlock title="Estimating the Covariance Matrix">
        The full covariance estimator requires <InlineMath math="T \gg n(n+1)/2" /> in-sample
        residuals to be well-conditioned. For large hierarchies (e.g., n=100), the sample
        covariance is singular or nearly so. Use:
        <ul>
          <li><strong>MinT-shrink:</strong> Ledoit-Wolf shrinkage towards diagonal — most robust.</li>
          <li><strong>MinT-ols:</strong> Diagonal elements only (set off-diagonal to 0).</li>
          <li><strong>WLS-var:</strong> Diagonal of in-sample forecast error variances — simplest reliable option.</li>
        </ul>
      </WarningBlock>

      <h2>Probabilistic Reconciliation</h2>
      <p>
        The methods above reconcile point forecasts. For probabilistic forecasts (sample paths,
        quantiles, or predictive distributions), reconciliation must preserve coherence across
        the full distribution:
      </p>
      <ul>
        <li>
          <strong>Gaussian reconciliation:</strong> If base forecast errors are jointly Gaussian,
          the reconciled distribution is also Gaussian with reconciled mean and covariance{' '}
          <InlineMath math="\mathbf{V}_h = \mathbf{SP}\hat{\boldsymbol{\Sigma}}_h\mathbf{P}'\mathbf{S}'" />.
        </li>
        <li>
          <strong>Sample-path reconciliation:</strong> Apply the reconciliation matrix
          <InlineMath math="\mathbf{SP}" /> to each simulated path from base forecast simulators.
          This is the most general method and works for any distributional assumption.
        </li>
        <li>
          <strong>Energy score / variogram optimisation:</strong> Panagiotelis et al. (2023)
          develop proper scoring rules for evaluating and optimising probabilistic reconciliation.
        </li>
      </ul>

      <ExampleBlock title="Retail Demand Hierarchy: MinT Performance">
        A retailer has 200 SKUs sold across 4 regions, giving 4 bottom-level series per SKU and
        aggregate product-category and regional totals — approximately 1,400 series total.
        <br /><br />
        Base ETS models forecast each series independently. Reconciliation results (RMSSE relative
        to bottom-up as baseline):
        <ul>
          <li>OLS: -4% vs bottom-up (modest improvement)</li>
          <li>WLS-structural: -8% at bottom, -12% at total</li>
          <li>MinT-shrink: -15% at bottom, -18% at total (best overall)</li>
        </ul>
        MinT-shrink consistently outperforms because it accounts for cross-series correlations —
        e.g., that high forecast errors for A-North correlate with errors for A-South (same product,
        shared macro drivers), and MinT redistributes the adjustment accordingly.
      </ExampleBlock>

      <h2>Practical Considerations</h2>
      <ul>
        <li>
          <strong>Base model choice matters:</strong> Reconciliation improves coherence but cannot
          fix poor base forecasts. Use the best possible individual models before reconciling.
        </li>
        <li>
          <strong>Cross-validation for W estimation:</strong> Estimate <InlineMath math="\mathbf{W}_h" />{' '}
          from rolling-origin cross-validation residuals for better finite-sample performance.
        </li>
        <li>
          <strong>Non-negative forecasts:</strong> Standard reconciliation can produce negative
          forecasts for intermittent demand series. Post-process by setting negatives to zero,
          or use constrained reconciliation (available in hierarchicalforecast).
        </li>
        <li>
          <strong>Temporal hierarchies:</strong> The same framework applies to temporal aggregation
          (hourly → daily → monthly → annual), creating Temporal Hierarchies (Athanasopoulos et
          al., 2017).
        </li>
      </ul>

      <PythonCode code={reconciliationCode} title="OLS, WLS, and MinT Reconciliation from Scratch + hierarchicalforecast" />

      <h2>Summary</h2>
      <ul>
        <li>
          Forecast reconciliation maps incoherent base forecasts to the coherent subspace via{' '}
          <InlineMath math="\tilde{\mathbf{y}}_h = \mathbf{SP}\hat{\mathbf{y}}_h" />.
        </li>
        <li>
          OLS (<InlineMath math="\mathbf{W}=\mathbf{I}" />), WLS (diagonal weights), and MinT
          (full covariance) are the main variants, nested in a common WLS framework.
        </li>
        <li>
          MinT-shrink is the recommended default: it uses cross-series covariance information
          while avoiding singularity through Ledoit-Wolf shrinkage.
        </li>
        <li>
          Probabilistic reconciliation extends the framework to full predictive distributions,
          essential for coherent interval and density forecasts.
        </li>
        <li>
          The <code>hierarchicalforecast</code> library provides production-ready implementations
          of all major point and probabilistic reconciliation methods.
        </li>
      </ul>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
