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

const hierarchyLevels = [
  { level: 'Total Company', description: 'Aggregate demand across all products, channels, and locations', useCase: 'S&OP planning, capacity allocation' },
  { level: 'Product Category', description: 'Demand by product family or brand', useCase: 'Category management, supplier negotiations' },
  { level: 'SKU', description: 'Individual stock-keeping unit demand', useCase: 'Replenishment, safety stock calculation' },
  { level: 'SKU × Location', description: 'Demand per SKU per distribution center or store', useCase: 'Store-level ordering, DC replenishment' },
  { level: 'SKU × Channel', description: 'Demand per SKU across e-commerce, wholesale, retail', useCase: 'Channel allocation, inventory positioning' },
];

export default function SCHierarchy() {
  const [selectedLevel, setSelectedLevel] = useState(null);

  return (
    <SectionLayout
      title="Supply Chain Hierarchy"
      subject="Supply Chain Forecasting"
      difficulty="intermediate"
      readingTime={11}
    >
      <p>
        Supply chains naturally organize demand into hierarchies: products aggregate into categories, locations
        aggregate into regions and totals, channels aggregate across store and online. Forecasting at the right
        level of this hierarchy — and ensuring consistency across levels — is critical for operational planning.
        A regional forecast that doesn't sum to the national total creates planning contradictions.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-3">The Three Dimensions of Supply Chain Hierarchy</h2>

      <DefinitionBlock title="Product Hierarchy">
        Products organize from most granular to most aggregate:
        <BlockMath math="\text{SKU} \to \text{Sub-category} \to \text{Category} \to \text{Brand} \to \text{Total}" />
        Each level supports different business decisions. SKU-level drives replenishment; category-level
        drives assortment and supplier negotiations; total-level drives capacity and financial planning.
      </DefinitionBlock>

      <DefinitionBlock title="Location Hierarchy">
        <BlockMath math="\text{Store / DC} \to \text{Region} \to \text{Country} \to \text{Global}" />
        Location hierarchies interact with product hierarchies: a retailer may have 500 stores × 50,000 SKUs
        = 25 million time series to manage. Aggregation and ML at global level with disaggregation is essential.
      </DefinitionBlock>

      <DefinitionBlock title="Channel Hierarchy">
        Modern omnichannel retail adds a third dimension:
        <BlockMath math="\text{Store} \cup \text{E-commerce} \cup \text{Wholesale} \to \text{Total Channel}" />
        Channel shifts (e.g., COVID-driven e-commerce surge) can make historical patterns at the SKU level
        misleading unless channel is modeled explicitly.
      </DefinitionBlock>

      <div className="my-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Supply Chain Hierarchy Levels</h3>
        <div className="space-y-2">
          {hierarchyLevels.map((row, i) => (
            <div
              key={i}
              onClick={() => setSelectedLevel(selectedLevel === i ? null : i)}
              className={`p-3 rounded border cursor-pointer transition-all ${selectedLevel === i ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{row.level}</span>
                <span className="text-xs text-gray-500">{i === 0 ? '▲ Aggregate' : i === hierarchyLevels.length - 1 ? '▼ Granular' : ''}</span>
              </div>
              {selectedLevel === i && (
                <div className="mt-2 text-sm space-y-1">
                  <p className="text-gray-700">{row.description}</p>
                  <p className="text-blue-600">Use case: {row.useCase}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-3">Forecasting at Each Level</h2>
      <p>
        Different levels have different data richness, signal-to-noise ratios, and planning horizons:
      </p>
      <ul className="list-disc ml-5 space-y-2 text-sm mt-2">
        <li><strong>Aggregate level</strong>: More data per series (lower noise), supports longer horizons,
        macroeconomic drivers easier to model, but too coarse for operational decisions.</li>
        <li><strong>SKU level</strong>: Direct input to replenishment, but many SKUs are intermittent
        or have short histories, making individual time-series models unreliable.</li>
        <li><strong>SKU × Location</strong>: Maximum operational detail but potentially millions of series.
        Global models (one model trained on all series) are the only scalable approach.</li>
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-3">Coherence Constraint</h2>

      <TheoremBlock title="Coherence Requirement">
        A set of forecasts is <em>coherent</em> if every level is consistent with every other level through
        the hierarchical summing structure. If <InlineMath math="\mathbf{b}" /> are bottom-level forecasts and
        <InlineMath math="\mathbf{S}" /> is the summing matrix encoding the hierarchy:
        <BlockMath math="\hat{\mathbf{y}} = \mathbf{S} \hat{\mathbf{b}}" />
        Coherent forecasts satisfy this equation exactly. Incoherent forecasts create planning contradictions
        (e.g., regional orders exceed national supply plan).
      </TheoremBlock>

      <ExampleBlock title="Coherence Failure Example">
        A CPG manufacturer runs separate demand forecasting systems for sales (top-down, by brand) and
        operations (bottom-up, by SKU). Sales forecasts a 15% growth for a beverage brand. Operations
        forecasts 8% growth summed across SKUs. The gap of 7% goes unresolved, and the production plan
        is underfunded. When actual demand exceeds the production plan, a major retailer stockout occurs.
        Implementing a single hierarchical forecasting system with reconciliation eliminated this disconnect.
      </ExampleBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Practical Challenges</h2>
      <ul className="list-disc ml-5 space-y-2 text-sm mt-2">
        <li><strong>New SKUs and SKU churn</strong>: New products appear, old ones are discontinued.
        The hierarchy must handle sparse or missing history at the bottom level gracefully.</li>
        <li><strong>Promotions and events</strong>: A promotion at one store should not be disaggregated to
        all stores in the region — location-specific events break the stationarity assumption.</li>
        <li><strong>Organizational silos</strong>: Commercial and operations teams often have separate forecasting
        processes. Hierarchy provides a framework for aligning them but requires governance.</li>
        <li><strong>Scale</strong>: A large retailer may have 10M+ time series. Forecasting and reconciliation
        must be designed for distributed computation (Spark, Dask, or streaming architectures).</li>
      </ul>

      <NoteBlock>
        The choice between forecasting top-down (disaggregate aggregate forecasts) versus bottom-up (aggregate
        SKU forecasts) versus middle-out (forecast at a middle level and propagate both ways) depends on where
        information is richest. For most retail supply chains, SKU-level historical data is the richest signal,
        making bottom-up the natural starting point. Reconciliation then enforces coherence.
      </NoteBlock>

      <WarningBlock>
        Temporal hierarchies also exist: daily forecasts must aggregate consistently to weekly and monthly
        totals. Handling calendar effects (52 vs 53 weeks per year, month-end effects) across temporal
        hierarchies requires careful period definition and is a common source of reconciliation bugs in practice.
      </WarningBlock>

      <PythonCode
        title="Supply Chain Hierarchy with hierarchicalforecast"
        code={`import pandas as pd
import numpy as np
from hierarchicalforecast.core import HierarchicalReconciliation
from hierarchicalforecast.methods import BottomUp, TopDown, MinTrace
from statsforecast import StatsForecast
from statsforecast.models import AutoETS, Naive

# ── Build a toy supply chain hierarchy ────────────────────────────────────────
# Structure: Total -> 2 Regions -> 4 Locations (stores/DCs)
# Tags define hierarchy: each column = one dimension
np.random.seed(42)
dates = pd.date_range('2021-01-04', periods=104, freq='W-MON')

# Generate bottom-level (store × SKU) weekly demand
store_ids  = ['North_A', 'North_B', 'South_A', 'South_B']
region_map = {'North_A': 'North', 'North_B': 'North',
              'South_A': 'South', 'South_B': 'South'}

rows = []
for store in store_ids:
    base = np.random.uniform(50, 200)
    trend = np.random.uniform(-0.1, 0.3)
    for i, date in enumerate(dates):
        d = base * (1 + trend * i / 104) + np.random.normal(0, 10)
        rows.append({'date': date, 'store': store,
                     'region': region_map[store], 'demand': max(0, d)})

df_store = pd.DataFrame(rows)

# ── Create hierarchical tags DataFrame ───────────────────────────────────────
# hierarchicalforecast expects: unique_id, ds, y  +  S (summing matrix)
def build_hierarchy(df):
    """Build hierarchical dataset with summing matrix."""
    # Pivot to wide (date x store)
    wide = df.pivot(index='date', columns='store', values='demand').reset_index()
    wide.columns.name = None

    # Add aggregate columns
    for region in ['North', 'South']:
        stores_in = [s for s in store_ids if region_map[s] == region]
        wide[region] = wide[stores_in].sum(axis=1)
    wide['Total'] = wide[store_ids].sum(axis=1)

    # Melt to long format for hierarchicalforecast
    all_series = store_ids + ['North', 'South', 'Total']
    long = wide.melt(id_vars='date', value_vars=all_series,
                     var_name='unique_id', value_name='y')
    long = long.rename(columns={'date': 'ds'}).sort_values(['unique_id', 'ds'])

    # Summing matrix S: rows = all series, cols = bottom-level series
    n_bottom = len(store_ids)
    S = pd.DataFrame(0, index=all_series, columns=store_ids)
    for s in store_ids:
        S.loc[s, s] = 1                          # bottom-level: identity
    for region in ['North', 'South']:
        for s in store_ids:
            if region_map[s] == region:
                S.loc[region, s] = 1             # region = sum of stores
    S.loc['Total'] = 1                            # total = sum of all

    return long, S

long_df, S = build_hierarchy(df_store)

# ── Fit base forecasts ────────────────────────────────────────────────────────
sf = StatsForecast(
    models=[AutoETS(model='ZZZ'), Naive()],
    freq='W-MON',
    n_jobs=-1,
)
sf.fit(long_df)
base_fc = sf.predict(h=8)

print("Base forecasts (first 5 rows):")
print(base_fc.head())

# ── Reconcile ─────────────────────────────────────────────────────────────────
hrec = HierarchicalReconciliation(reconcilers=[
    BottomUp(),
    TopDown(method='forecast_proportions'),
    MinTrace(method='ols'),
])

reconciled = hrec.reconcile(
    Y_hat_df=base_fc,
    Y_df=long_df,
    S=S,
)

print("\\nReconciled forecasts (Total + regions + stores):")
print(reconciled[reconciled['unique_id'].isin(['Total', 'North', 'South'])].head(24))
`}
      />

      <ReferenceList
        references={[
          {
            author: 'Hyndman, R.J., Ahmed, R.A., Athanasopoulos, G., & Shang, H.L.',
            year: 2011,
            title: 'Optimal combination forecasts for hierarchical time series',
            journal: 'Computational Statistics and Data Analysis',
            volume: '55(9)',
            pages: '2579–2589',
          },
          {
            author: 'Athanasopoulos, G., Ahmed, R.A., & Hyndman, R.J.',
            year: 2009,
            title: 'Hierarchical forecasts for Australian domestic tourism',
            journal: 'International Journal of Forecasting',
            volume: '25(1)',
            pages: '146–166',
          },
        ]}
      />
    </SectionLayout>
  );
}
