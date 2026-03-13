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
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const reconciliationComparison = [
  { method: 'Bottom-Up', mae_sku: 12.4, mae_region: 28.3, mae_total: 45.1 },
  { method: 'Top-Down', mae_sku: 18.7, mae_region: 22.1, mae_total: 31.8 },
  { method: 'Middle-Out', mae_sku: 14.2, mae_region: 20.8, mae_total: 33.5 },
  { method: 'MinT(OLS)', mae_sku: 10.8, mae_region: 18.4, mae_total: 28.6 },
  { method: 'MinT(Shrink)', mae_sku: 10.1, mae_region: 17.9, mae_total: 27.2 },
];

export default function ReconciliationSC() {
  const [activeMetric, setActiveMetric] = useState('mae_sku');

  return (
    <SectionLayout
      title="Supply Chain Reconciliation"
      subject="Supply Chain Forecasting"
      difficulty="advanced"
      readingTime={12}
    >
      <p>
        Once base forecasts are generated at each level of the supply chain hierarchy, they must be reconciled
        to ensure consistency: store-level forecasts must sum to regional, regional must sum to national.
        Reconciliation methods differ in which information they trust, how they handle forecast errors, and
        whether they enforce physical constraints like non-negativity.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-3">Classical Reconciliation Approaches</h2>

      <DefinitionBlock title="Bottom-Up Reconciliation">
        Forecast only at the most granular level (SKU × location), then sum upward:
        <BlockMath math="\hat{y}_{\text{region}} = \sum_{i \in \text{region}} \hat{y}_i" />
        <strong>Pros</strong>: preserves granular signal, naturally coherent, captures local patterns.
        <br /><strong>Cons</strong>: bottom-level forecasts are noisiest; macroeconomic signals that are
        visible at the aggregate get diluted.
      </DefinitionBlock>

      <DefinitionBlock title="Top-Down Reconciliation">
        Forecast at the aggregate level, then disaggregate using historical proportions:
        <BlockMath math="\hat{y}_i = p_i \cdot \hat{y}_{\text{total}}, \quad p_i = \frac{\bar{y}_i}{\sum_j \bar{y}_j}" />
        <strong>Pros</strong>: aggregate forecasts use most data, good for stable proportions.
        <br /><strong>Cons</strong>: loses local information; proportions shift with promotions, new products.
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">MinT: Minimum Trace Reconciliation</h2>

      <TheoremBlock title="MinT Optimal Reconciliation">
        Wickramasuriya et al. (2019) showed that among all unbiased linear reconciliation methods, the
        <em>minimum trace</em> (MinT) estimator minimizes the total forecast error variance. Given base
        forecasts <InlineMath math="\tilde{\mathbf{y}}" />, the reconciled forecasts are:
        <BlockMath math="\hat{\mathbf{y}} = \mathbf{S}(\mathbf{S}^\top \mathbf{W}^{-1} \mathbf{S})^{-1} \mathbf{S}^\top \mathbf{W}^{-1} \tilde{\mathbf{y}}" />
        where <InlineMath math="\mathbf{W}" /> is the covariance matrix of base forecast errors.
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li><strong>MinT(OLS)</strong>: <InlineMath math="\mathbf{W} = \mathbf{I}" /> — equal weight to all levels</li>
          <li><strong>MinT(WLS)</strong>: <InlineMath math="\mathbf{W} = \text{diag}(\hat{\sigma}_i^2)" /> — weight by in-sample variance</li>
          <li><strong>MinT(Shrinkage)</strong>: <InlineMath math="\mathbf{W}" /> estimated with shrinkage regularization</li>
        </ul>
      </TheoremBlock>

      <div className="my-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Reconciliation Method Comparison (MAE by Level)</h3>
        <div className="flex gap-2 mb-3">
          {[['mae_sku', 'SKU Level'], ['mae_region', 'Region Level'], ['mae_total', 'Total Level']].map(([k, label]) => (
            <button key={k} onClick={() => setActiveMetric(k)}
              className={`px-3 py-1 text-sm rounded border ${activeMetric === k ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}>
              {label}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={reconciliationComparison} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="method" />
            <YAxis label={{ value: 'MAE', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey={activeMetric} fill="#3b82f6" name="MAE" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-2">Illustrative values — MinT(Shrink) tends to outperform across all levels.</p>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-3">Constrained Reconciliation (Non-Negativity)</h2>
      <p>
        Standard MinT can produce negative forecasts for intermittent demand SKUs. This is physically
        impossible — you cannot have negative demand. Two common approaches:
      </p>
      <ul className="list-disc ml-5 space-y-2 text-sm mt-2">
        <li><strong>Post-processing truncation</strong>: Set <InlineMath math="\hat{y}_i = \max(0, \hat{y}_i^{\text{MinT}})" />
        and re-normalize upper levels. Simple but not optimal.</li>
        <li><strong>Projected reconciliation</strong>: Solve the reconciliation as a constrained quadratic
        program with <InlineMath math="\hat{y}_i \geq 0" /> for all <InlineMath math="i" />. More expensive
        but guarantees coherent, non-negative forecasts. Available in <code>hierarchicalforecast</code> via
        the <code>ERM</code> method with non-negativity constraints.</li>
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-3">Temporal Reconciliation</h2>
      <p>
        Forecasts must also be consistent across time horizons. A monthly forecast for January should equal
        the sum of weekly forecasts for January's weeks. This temporal coherence is especially important for:
      </p>
      <ul className="list-disc ml-5 space-y-1 text-sm mt-2">
        <li>Monthly financial plans that must match weekly operational plans</li>
        <li>Seasonal promotions spanning multiple periods</li>
        <li>S&OP horizon (18-month monthly) vs. operational horizon (13-week weekly)</li>
      </ul>

      <ExampleBlock title="Temporal × Cross-Sectional Reconciliation">
        A food manufacturer runs forecasting at multiple temporal and hierarchical levels simultaneously:
        national monthly brand forecasts feed into the financial plan, while regional weekly SKU-level forecasts
        feed into production scheduling. When brand-level January monthly forecast = 100,000 units but the
        sum of weekly regional SKU forecasts = 87,000 units, there's a 13% gap. Full temporal-hierarchical
        reconciliation (THIEF framework) resolves both dimensions simultaneously, producing consistent forecasts
        from national monthly down to regional weekly.
      </ExampleBlock>

      <NoteBlock>
        MinT requires estimating the forecast error covariance matrix <InlineMath math="\mathbf{W}" />. With
        many series (thousands of SKUs), the full covariance matrix is high-dimensional and hard to estimate
        reliably. MinT(Shrinkage) provides a regularized estimator that is much better conditioned than the
        sample covariance. In practice, MinT(WLS) offers a good balance of performance and computational cost.
      </NoteBlock>

      <WarningBlock>
        Top-down reconciliation using average historical proportions breaks catastrophically when product mix
        changes: new SKU launches, discontinued products, major promotions, or channel shifts. Always use
        forecast-proportion top-down (proportions based on base forecasts, not history) or prefer bottom-up
        / MinT. Monitor proportion stability as a leading indicator of when to switch methods.
      </WarningBlock>

      <PythonCode
        title="MinT Reconciliation for Supply Chain with hierarchicalforecast"
        code={`import pandas as pd
import numpy as np
from hierarchicalforecast.core import HierarchicalReconciliation
from hierarchicalforecast.methods import BottomUp, TopDown, MinTrace
from hierarchicalforecast.evaluation import HierarchicalEvaluation
from statsforecast import StatsForecast
from statsforecast.models import AutoETS

# ── Build larger hierarchy: Total -> 3 Regions -> 9 Stores ───────────────────
np.random.seed(42)
dates = pd.date_range('2021-01-04', periods=130, freq='W-MON')

stores  = [f'Store_{r}_{i}' for r in ['North', 'Central', 'South'] for i in range(3)]
regions = ['North', 'Central', 'South']
region_of = {s: s.split('_')[1] for s in stores}

def gen_store_demand(store, n):
    base  = np.random.uniform(30, 120)
    trend = np.random.uniform(-0.05, 0.2)
    seas  = 10 * np.sin(2 * np.pi * np.arange(n) / 52)
    noise = np.random.normal(0, 8, n)
    return np.maximum(base * (1 + trend * np.arange(n) / n) + seas + noise, 0)

rows = []
for store in stores:
    demand = gen_store_demand(store, len(dates))
    for i, date in enumerate(dates):
        rows.append({'unique_id': store, 'ds': date, 'y': demand[i]})

df_stores = pd.DataFrame(rows)

# Add aggregate series
pivot  = df_stores.pivot(index='ds', columns='unique_id', values='y')
for region in regions:
    stores_r = [s for s in stores if region_of[s] == region]
    pivot[region] = pivot[stores_r].sum(axis=1)
pivot['Total'] = pivot[stores].sum(axis=1)

df_all = pivot.reset_index().melt(id_vars='ds', var_name='unique_id', value_name='y')

# ── Summing matrix S ──────────────────────────────────────────────────────────
all_ids = ['Total'] + regions + stores
S = pd.DataFrame(0, index=all_ids, columns=stores)
S.loc['Total'] = 1
for region in regions:
    for store in stores:
        if region_of[store] == region:
            S.loc[region, store] = 1
for store in stores:
    S.loc[store, store] = 1

# ── Train/test split ─────────────────────────────────────────────────────────
TRAIN_END = '2023-06-26'
train  = df_all[df_all['ds'] <= TRAIN_END]
test   = df_all[df_all['ds'] >  TRAIN_END]
h      = test['ds'].nunique()

# ── Generate base forecasts ───────────────────────────────────────────────────
sf = StatsForecast(models=[AutoETS(model='ZZZ')], freq='W-MON', n_jobs=-1)
sf.fit(train)
Y_hat_df = sf.predict(h=h)

# ── Reconcile ─────────────────────────────────────────────────────────────────
hrec = HierarchicalReconciliation(reconcilers=[
    BottomUp(),
    TopDown(method='forecast_proportions'),
    MinTrace(method='ols'),
    MinTrace(method='wls_var'),
    MinTrace(method='mint_shrink'),
])

recon = hrec.reconcile(
    Y_hat_df=Y_hat_df,
    Y_df=train,
    S=S,
)

# ── Non-negative truncation ───────────────────────────────────────────────────
model_cols = [c for c in recon.columns if c not in ['unique_id', 'ds']]
for col in model_cols:
    recon[col] = recon[col].clip(lower=0)

# ── Evaluate ─────────────────────────────────────────────────────────────────
eval_df = recon.merge(test[['unique_id', 'ds', 'y']], on=['unique_id', 'ds'])

for col in model_cols:
    mae_sku    = (eval_df[eval_df['unique_id'].isin(stores)][col]
                  - eval_df[eval_df['unique_id'].isin(stores)]['y']).abs().mean()
    mae_region = (eval_df[eval_df['unique_id'].isin(regions)][col]
                  - eval_df[eval_df['unique_id'].isin(regions)]['y']).abs().mean()
    mae_total  = (eval_df[eval_df['unique_id'] == 'Total'][col]
                  - eval_df[eval_df['unique_id'] == 'Total']['y']).abs().mean()
    print(f"{col:<30} SKU MAE: {mae_sku:6.2f}  Region MAE: {mae_region:7.2f}  Total MAE: {mae_total:7.2f}")

# ── Check coherence ───────────────────────────────────────────────────────────
col = 'AutoETS/MinTrace_method-mint_shrink'
if col in recon.columns:
    sample_date = recon['ds'].iloc[0]
    snap = recon[recon['ds'] == sample_date].set_index('unique_id')[col]
    region_sums = {r: sum(snap[s] for s in stores if region_of[s] == r) for r in regions}
    for r in regions:
        print(f"Coherence check: {r} forecast={snap[r]:.1f}, sum of stores={region_sums[r]:.1f}")
`}
      />

      <ReferenceList
        references={[
          {
            author: 'Wickramasuriya, S.L., Athanasopoulos, G., & Hyndman, R.J.',
            year: 2019,
            title: 'Optimal forecast reconciliation using unbiased estimating equations',
            journal: 'Journal of the American Statistical Association',
            volume: '114(526)',
            pages: '804–819',
          },
          {
            author: 'Kourentzes, N. & Athanasopoulos, G.',
            year: 2019,
            title: 'Cross-temporal coherent forecasts for Australian tourism',
            journal: 'Annals of Tourism Research',
            volume: '75',
            pages: '393–409',
          },
        ]}
      />
    </SectionLayout>
  );
}
