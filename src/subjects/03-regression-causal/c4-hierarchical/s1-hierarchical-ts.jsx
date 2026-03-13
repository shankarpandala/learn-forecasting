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
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Simulated quarterly sales: Total, Product A, Product B, and four bottom-level series
const hierarchyData = [
  { q: 'Q1-22', Total: 280, ProdA: 165, ProdB: 115, AN: 95, AS: 70, BN: 65, BS: 50 },
  { q: 'Q2-22', Total: 310, ProdA: 185, ProdB: 125, AN: 108, AS: 77, BN: 72, BS: 53 },
  { q: 'Q3-22', Total: 295, ProdA: 172, ProdB: 123, AN: 100, AS: 72, BN: 70, BS: 53 },
  { q: 'Q4-22', Total: 340, ProdA: 200, ProdB: 140, AN: 116, AS: 84, BN: 80, BS: 60 },
  { q: 'Q1-23', Total: 305, ProdA: 178, ProdB: 127, AN: 102, AS: 76, BN: 73, BS: 54 },
  { q: 'Q2-23', Total: 335, ProdA: 195, ProdB: 140, AN: 112, AS: 83, BN: 80, BS: 60 },
  { q: 'Q3-23', Total: 320, ProdA: 188, ProdB: 132, AN: 108, AS: 80, BN: 76, BS: 56 },
  { q: 'Q4-23', Total: 365, ProdA: 215, ProdB: 150, AN: 124, AS: 91, BN: 86, BS: 64 },
];

const hierarchicalCode = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

# ── Build a simple product × region hierarchy ──────────────────────────────
# Hierarchy:
#   Total
#   ├── Product A
#   │   ├── A-North
#   │   └── A-South
#   └── Product B
#       ├── B-North
#       └── B-South
# 4 bottom-level series, 2 middle-level, 1 top-level = 7 total

np.random.seed(5)
n = 48  # 4 years monthly

def gen_series(base, trend, seasonality_amp, noise):
    t = np.arange(n)
    return (base + trend * t
            + seasonality_amp * np.sin(2 * np.pi * t / 12)
            + np.random.normal(0, noise, n))

# Bottom-level: 4 series
a_north = gen_series(100, 0.3, 10, 3)
a_south = gen_series( 80, 0.2,  8, 3)
b_north = gen_series( 60, 0.4,  6, 2)
b_south = gen_series( 40, 0.1,  4, 2)

# Derive aggregates (summing constraints)
prod_a = a_north + a_south
prod_b = b_north + b_south
total  = prod_a + prod_b

dates = pd.date_range('2020-01', periods=n, freq='MS')
df = pd.DataFrame({
    'Total':   total,
    'ProdA':   prod_a,
    'ProdB':   prod_b,
    'A_North': a_north,
    'A_South': a_south,
    'B_North': b_north,
    'B_South': b_south,
}, index=dates)

train = df.iloc[:-12]
test  = df.iloc[-12:]

# ── Verify summing constraints ─────────────────────────────────────────────
assert np.allclose(df['Total'], df['ProdA'] + df['ProdB'])
assert np.allclose(df['ProdA'], df['A_North'] + df['A_South'])
print("Summing constraints verified.")

# ── Summing matrix S ───────────────────────────────────────────────────────
# S maps bottom-level forecasts to all levels: y = S * y_bottom
# Rows: [Total, ProdA, ProdB, A_North, A_South, B_North, B_South]
# Cols: [A_North, A_South, B_North, B_South]
S = np.array([
    [1, 1, 1, 1],   # Total = all four
    [1, 1, 0, 0],   # ProdA = A_North + A_South
    [0, 0, 1, 1],   # ProdB = B_North + B_South
    [1, 0, 0, 0],   # A_North
    [0, 1, 0, 0],   # A_South
    [0, 0, 1, 0],   # B_North
    [0, 0, 0, 1],   # B_South
])
print(f"\\nSumming matrix S shape: {S.shape}")
print(S)

# ── Bottom-up approach ────────────────────────────────────────────────────
from statsmodels.tsa.holtwinters import ExponentialSmoothing

def ets_forecast(series, h=12):
    """Simple ETS forecast."""
    model = ExponentialSmoothing(series, trend='add', seasonal='add',
                                 seasonal_periods=12)
    fit = model.fit(optimized=True)
    return fit.forecast(h)

h = 12
# Step 1: forecast all 4 bottom-level series
fc_bottom = {}
for col in ['A_North', 'A_South', 'B_North', 'B_South']:
    fc_bottom[col] = ets_forecast(train[col], h)

# Step 2: aggregate using S
fc_bottom_matrix = np.column_stack([
    fc_bottom['A_North'].values,
    fc_bottom['A_South'].values,
    fc_bottom['B_North'].values,
    fc_bottom['B_South'].values
])
fc_bu = (S @ fc_bottom_matrix.T).T  # (h x 7)
fc_bu_df = pd.DataFrame(fc_bu, index=test.index,
                          columns=['Total','ProdA','ProdB','A_North','A_South','B_North','B_South'])
print("\\nBottom-up forecast (head):")
print(fc_bu_df.head(3))

# ── Top-down approach ─────────────────────────────────────────────────────
# Forecast total, then distribute using historical proportions
fc_total = ets_forecast(train['Total'], h)
proportions = train[['A_North','A_South','B_North','B_South']].mean() / train['Total'].mean()
print(f"\\nHistorical average proportions:\n{proportions}")

fc_td_bottom = np.outer(fc_total.values, proportions.values)
fc_td = (S @ fc_td_bottom.T).T
fc_td_df = pd.DataFrame(fc_td, index=test.index,
                          columns=['Total','ProdA','ProdB','A_North','A_South','B_North','B_South'])

# ── Compare accuracy ─────────────────────────────────────────────────────
for approach, fc_df in [('Bottom-Up', fc_bu_df), ('Top-Down', fc_td_df)]:
    mae_total = (test['Total'] - fc_df['Total']).abs().mean()
    mae_bottom = (test[['A_North','A_South','B_North','B_South']].values -
                  fc_df[['A_North','A_South','B_North','B_South']].values).reshape(-1).mean()
    print(f"\\n{approach}: MAE Total={mae_total:.2f}, MAE Bottom avg={mae_bottom:.2f}")

# ── hierarchicalforecast library ─────────────────────────────────────────
# pip install hierarchicalforecast
try:
    from hierarchicalforecast.utils import aggregate
    from hierarchicalforecast.core import ReconcilerForecasts
    from hierarchicalforecast.methods import BottomUp, TopDown

    # Prepare long-format DataFrame for hierarchicalforecast
    bottom_df = pd.melt(
        train[['A_North','A_South','B_North','B_South']].reset_index(),
        id_vars='index', var_name='unique_id', value_name='y'
    ).rename(columns={'index': 'ds'})

    print("\\nhierarchicalforecast input (head):")
    print(bottom_df.head())
except ImportError:
    print("\\nInstall: pip install hierarchicalforecast")

# ── Plot ──────────────────────────────────────────────────────────────────
fig, axes = plt.subplots(2, 2, figsize=(13, 8))
bottom_series = ['A_North', 'A_South', 'B_North', 'B_South']
for ax, col in zip(axes.flat, bottom_series):
    ax.plot(train[col], label='Train')
    ax.plot(test[col], label='Actual', color='black')
    ax.plot(fc_bu_df[col], label='BU forecast', color='red', linestyle='--')
    ax.plot(fc_td_df[col], label='TD forecast', color='blue', linestyle=':')
    ax.set_title(col)
    ax.legend(fontsize=7)
plt.suptitle('Hierarchical Forecasting: Bottom-Up vs Top-Down', y=1.01)
plt.tight_layout()
plt.show()
`;

const references = [
  {
    title: 'Forecasting: Principles and Practice (3rd ed.) — Chapter 11: Hierarchical Forecasting',
    author: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/hierarchical.html'
  },
  {
    title: 'Optimal Combination Forecasts for Hierarchical Time Series',
    author: 'Hyndman, R.J., Ahmed, R.A., Athanasopoulos, G. & Shang, H.L.',
    year: 2011,
    url: 'https://www.tandfonline.com/doi/abs/10.1198/jcgs.2011.09107'
  },
  {
    title: 'hierarchicalforecast: A Benchmark Library for Hierarchical Forecasting',
    author: 'Olivares, K.G. et al.',
    year: 2023,
    url: 'https://proceedings.mlr.press/v151/olivares22a.html'
  },
  {
    title: 'A Note on the Aggregation of Disaggregate Forecasts',
    author: 'Kahn, K.B.',
    year: 1998,
    url: 'https://doi.org/10.1016/S0169-2070(97)00058-3'
  }
];

export default function HierarchicalTS() {
  const [method, setMethod] = useState('bottomup');

  const methodInfo = {
    bottomup: {
      name: 'Bottom-Up',
      desc: 'Forecast each bottom-level series independently, then aggregate using the summing matrix S.',
      pros: ['Preserves disaggregate information', 'No information loss at bottom level', 'Simple to implement'],
      cons: ['Bottom-level noise can propagate upward', 'Ignores correlation structure', 'May over-estimate top-level uncertainty'],
      eq: String.raw`\tilde{\mathbf{y}}_h = S\hat{\mathbf{b}}_h`
    },
    topdown: {
      name: 'Top-Down',
      desc: 'Forecast the aggregate series at the top, then distribute to lower levels using historical proportion estimates.',
      pros: ['Stable top-level forecast', 'Simple; only one model needed at top', 'Good for very sparse bottom series'],
      cons: ['Information at lower levels lost', 'Proportions may shift over time', 'Bottom-level uncertainty underestimated'],
      eq: String.raw`\tilde{\mathbf{y}}_h = S \cdot p \cdot \hat{y}_{T,h}`
    },
    middleout: {
      name: 'Middle-Out',
      desc: 'Forecast a "middle" level of the hierarchy, then aggregate upward and disaggregate downward.',
      pros: ['Balances top-level stability with bottom-level detail', 'Useful when middle level has most reliable data'],
      cons: ['Choice of middle level is ad hoc', 'Inconsistencies can arise at edges'],
      eq: String.raw`\tilde{\mathbf{y}}_h = \text{aggregate}(S_m \hat{\mathbf{m}}_h) \cup \text{disaggregate}(\hat{\mathbf{m}}_h)`
    }
  };

  const info = methodInfo[method];

  return (
    <SectionLayout
      title="Hierarchical Time Series"
      difficulty="advanced"
      readingTime={13}
    >
      <p>
        In retail, sales exist for individual SKUs, product categories, regions, and total
        company levels. In government statistics, employment figures are available by occupation,
        industry, state, and national level. These are <strong>hierarchical time series</strong>:
        collections of series related by aggregation constraints. Forecasting them requires
        producing coherent forecasts — forecasts at every level that are consistent with the
        aggregation structure.
      </p>

      <DefinitionBlock term="Hierarchical Time Series">
        A hierarchical time series is a collection of series <InlineMath math="\{y_{j,t}\}" /> at
        multiple levels of aggregation, such that all series at each level sum to the series at
        the level above. At the bottom level there are <InlineMath math="m" /> series; the total
        is their sum. The structure is encoded by the <strong>summing matrix</strong>{' '}
        <InlineMath math="\mathbf{S}" /> of dimension <InlineMath math="n \times m" />{' '}
        (<InlineMath math="n" /> = total series, <InlineMath math="m" /> = bottom-level series):
        <BlockMath math="\mathbf{y}_t = \mathbf{S}\,\mathbf{b}_t" />
        where <InlineMath math="\mathbf{b}_t" /> is the <InlineMath math="m \times 1" /> vector of
        bottom-level values.
      </DefinitionBlock>

      <h2>Structure of the Summing Matrix</h2>
      <p>
        For a two-level hierarchy with total, two product groups (A and B), and four bottom-level
        series (A-North, A-South, B-North, B-South):
      </p>
      <BlockMath math="\mathbf{S} = \begin{pmatrix} 1 & 1 & 1 & 1 \\ 1 & 1 & 0 & 0 \\ 0 & 0 & 1 & 1 \\ 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix} \quad \begin{matrix} \text{Total} \\ \text{ProdA} \\ \text{ProdB} \\ \text{A-North} \\ \text{A-South} \\ \text{B-North} \\ \text{B-South} \end{matrix}" />
      <p>
        Any forecast vector <InlineMath math="\tilde{\mathbf{y}}_h" /> satisfying{' '}
        <InlineMath math="\tilde{\mathbf{y}}_h = \mathbf{S}\tilde{\mathbf{b}}_h" /> for some
        bottom-level forecast <InlineMath math="\tilde{\mathbf{b}}_h" /> is called{' '}
        <strong>coherent</strong>.
      </p>

      {/* Interactive hierarchy visualization */}
      <div style={{ margin: '1.5rem 0', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
          Interactive: Simulated Quarterly Sales Hierarchy
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.75rem' }}>
          Observe how Total = ProdA + ProdB, and each product = its two regional series. Select a level to inspect.
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={hierarchyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="q" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="AN" stackId="a" fill="#60a5fa" name="A-North" />
            <Bar dataKey="AS" stackId="a" fill="#3b82f6" name="A-South" />
            <Bar dataKey="BN" stackId="a" fill="#86efac" name="B-North" />
            <Bar dataKey="BS" stackId="a" fill="#16a34a" name="B-South" />
          </BarChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem' }}>
          Stacked bars show bottom-level series; their sum equals the Total (the summing constraint).
        </p>
      </div>

      <h2>Grouped vs Strictly Hierarchical Series</h2>
      <p>
        A <strong>grouped</strong> time series can be disaggregated by multiple attributes that do
        not nest into a single tree. For example, sales can be disaggregated by{' '}
        <em>product</em> (A, B) and by <em>region</em> (North, South) — but Product A × North and
        Product B × North both roll up to North, and both A and B also roll up to Total.
      </p>

      <NoteBlock title="Grouped Series and the S Matrix">
        Grouped series have a more complex <InlineMath math="\mathbf{S}" /> with rows for each
        grouping attribute. The key property remains: every row of <InlineMath math="\mathbf{S}" />{' '}
        is a binary vector selecting which bottom-level series aggregate to that row's level.
        The coherence condition <InlineMath math="\mathbf{y}_t = \mathbf{S}\mathbf{b}_t" /> still
        holds.
      </NoteBlock>

      <h2>Coherence Requirement</h2>
      <p>
        A naive approach — forecast each series independently at each level — almost never
        produces coherent forecasts. For example, the sum of bottom-level forecasts will typically
        differ from the independently-generated top-level forecast. <strong>Reconciliation</strong>{' '}
        is the process of adjusting a set of incoherent base forecasts to satisfy the summing
        constraints. This is the subject of the next section; here we focus on the three classical
        approaches that produce coherent forecasts by construction.
      </p>

      <div style={{ margin: '1.5rem 0' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {Object.entries(methodInfo).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setMethod(key)}
              style={{
                padding: '0.4rem 1.2rem',
                background: method === key ? '#16a34a' : '#dcfce7',
                color: method === key ? 'white' : '#15803d',
                border: `1px solid ${method === key ? '#15803d' : '#86efac'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: method === key ? 'bold' : 'normal'
              }}
            >
              {val.name}
            </button>
          ))}
        </div>
        <div style={{ padding: '1.25rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
          <strong style={{ fontSize: '1rem' }}>{info.name}</strong>
          <p style={{ marginTop: '0.5rem' }}>{info.desc}</p>
          <BlockMath math={info.eq} />
          <div style={{ display: 'flex', gap: '2rem', marginTop: '0.75rem' }}>
            <div>
              <strong style={{ color: '#15803d' }}>Advantages:</strong>
              <ul style={{ fontSize: '0.88rem', marginTop: '0.25rem' }}>
                {info.pros.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div>
              <strong style={{ color: '#dc2626' }}>Limitations:</strong>
              <ul style={{ fontSize: '0.88rem', marginTop: '0.25rem' }}>
                {info.cons.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h2>Empirical Evidence on Method Performance</h2>
      <p>
        Research has produced some broad guidelines, though results vary across datasets:
      </p>
      <ul>
        <li>
          <strong>Bottom-up</strong> typically performs best when bottom-level series are
          informative and have sufficient history. It is the most common baseline.
        </li>
        <li>
          <strong>Top-down with historical proportions</strong> outperforms bottom-up when
          bottom-level series are noisy (short history, intermittent demand).
        </li>
        <li>
          <strong>Middle-out</strong> is popular in retail supply chain when product-family-level
          data is most reliable.
        </li>
        <li>
          <strong>Reconciliation methods</strong> (MinT, OLS) consistently outperform all three
          simple approaches by combining information across levels — see the next section.
        </li>
      </ul>

      <WarningBlock title="Proportional Top-Down Assumes Stable Shares">
        Top-down with historical proportions implicitly assumes the relative shares of each
        series are constant over time. If product A's market share is growing and B's is
        declining, top-down forecasts will under-forecast A and over-forecast B. Always plot
        historical proportions over time as a diagnostic.
      </WarningBlock>

      <ExampleBlock title="Australian Tourism Hierarchy">
        The Australian Tourism Demand dataset from the hts R package has 304 monthly series:
        national total, 8 states, 76 zones, and 304 regions. Bottom-up produces coherent but
        noisy region-level forecasts. Top-down with historical proportions underestimates
        growth in fast-growing regions. The OLS reconciliation (next section) reduces MASE by
        15–20% for both aggregate and disaggregate levels compared to bottom-up.
      </ExampleBlock>

      <h2>Practical Implementation</h2>
      <p>
        The <code>hierarchicalforecast</code> library (Nixtla) provides a clean Python
        implementation supporting bottom-up, top-down, and all reconciliation methods:
      </p>
      <ul>
        <li>Accepts any base forecasting model (ETS, ARIMA, LightGBM, etc.).</li>
        <li>Constructs <InlineMath math="\mathbf{S}" /> automatically from a tagging DataFrame.</li>
        <li>Supports point and probabilistic reconciliation.</li>
      </ul>

      <PythonCode code={hierarchicalCode} title="Hierarchical Time Series: Bottom-Up and Top-Down" />

      <h2>Summary</h2>
      <ul>
        <li>
          Hierarchical time series are collections of series related by aggregation constraints,
          encoded in the summing matrix <InlineMath math="\mathbf{S}" />.
        </li>
        <li>
          Coherent forecasts satisfy <InlineMath math="\tilde{\mathbf{y}}_h = \mathbf{S}\tilde{\mathbf{b}}_h" />;
          independently generated forecasts are generally incoherent.
        </li>
        <li>
          Bottom-up aggregates bottom-level forecasts; top-down distributes a top-level forecast
          using proportions; middle-out combines both directions.
        </li>
        <li>
          Reconciliation methods (next section) dominate all three simple approaches by
          statistically combining information from all levels.
        </li>
        <li>
          The <code>hierarchicalforecast</code> library provides a practical Python toolkit
          for all major hierarchical forecasting approaches.
        </li>
      </ul>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
