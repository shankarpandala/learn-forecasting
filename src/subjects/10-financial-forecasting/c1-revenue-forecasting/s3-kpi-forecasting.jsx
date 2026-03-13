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
  FunnelChart, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const funnelData = [
  { stage: 'Website Visits', value: 50000, pct: 100 },
  { stage: 'Leads', value: 5000, pct: 10 },
  { stage: 'MQLs', value: 1500, pct: 3 },
  { stage: 'SQLs', value: 600, pct: 1.2 },
  { stage: 'Opportunities', value: 200, pct: 0.4 },
  { stage: 'Closed Won', value: 60, pct: 0.12 },
];

export default function KPIForecasting() {
  return (
    <SectionLayout
      title="KPI and Driver Forecasting"
      subject="Financial Forecasting"
      difficulty="intermediate"
      readingTime={11}
    >
      <p>
        Driver-based forecasting builds revenue projections from the ground up using the underlying business
        mechanics: marketing generates leads, sales converts them, customers generate recurring revenue,
        and customer success retains them. Forecasting each driver separately and linking them through a
        structured model produces more interpretable, more actionable, and — when done well — more accurate
        forecasts than extrapolating revenue in aggregate.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-3">Driver-Based Revenue Architecture</h2>

      <DefinitionBlock title="Revenue Decomposition">
        For a subscription business:
        <BlockMath math="\text{MRR}_t = \text{MRR}_{t-1} \cdot (1 + \text{Expansion Rate} - \text{Churn Rate}) + \text{New MRR}_t" />
        where New MRR depends on the sales funnel:
        <BlockMath math="\text{New MRR}_t = \text{SQLs}_t \times \text{Win Rate}_t \times \text{ACV}_t / 12" />
        Each driver can be independently modeled and updated from its own data sources.
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Conversion Funnel Forecasting</h2>
      <p>
        The sales funnel provides a natural hierarchy of leading indicators. Each stage's conversion rate
        can be modeled historically and forecast forward:
      </p>

      <div className="my-6 p-4 bg-gray-50 rounded-lg border overflow-x-auto">
        <h3 className="text-lg font-semibold mb-3">Conversion Funnel Structure</h3>
        <div className="space-y-2">
          {funnelData.map((stage, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-36 text-sm font-medium text-right">{stage.stage}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-7 relative">
                <div
                  className="h-7 rounded-full flex items-center justify-end pr-2 text-xs text-white font-semibold"
                  style={{ width: `${stage.pct * 10}%`, backgroundColor: `hsl(${220 - i * 30}, 70%, 50%)`, minWidth: '2rem' }}
                >
                  {stage.value.toLocaleString()}
                </div>
              </div>
              <div className="w-16 text-xs text-gray-500 text-right">{stage.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      <DefinitionBlock title="Stage Conversion Rate Forecasting">
        Let <InlineMath math="c_s^{(t)}" /> be the conversion rate from stage <InlineMath math="s" /> to
        <InlineMath math="s+1" /> at time <InlineMath math="t" />. Model each rate using exponential smoothing
        or regression on drivers (e.g., ICP match rate, competitive win rate):
        <BlockMath math="\hat{c}_s^{(t+h)} = f(\text{sales rep tenure, product fit score, competitive landscape})" />
        Pipeline coverage ratio (SQL pipeline / revenue target) is the most predictive short-term indicator.
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Leading Indicators for Revenue</h2>
      <p>
        Revenue lags leading indicators by a predictable lag structure that varies by business type:
      </p>
      <ul className="list-disc ml-5 space-y-2 text-sm mt-2">
        <li><strong>Web traffic → Leads</strong>: 0–2 week lag. High volume, noisy.</li>
        <li><strong>MQLs → SQLs</strong>: 1–4 week lag depending on SDR capacity.</li>
        <li><strong>SQLs → Opportunities</strong>: 2–8 week lag depending on qualification speed.</li>
        <li><strong>Opportunities → Closed Won</strong>: 30–90 day average sales cycle.</li>
        <li><strong>Customer health score → Churn</strong>: 60–90 day leading indicator for churn events.</li>
      </ul>

      <ExampleBlock title="Pipeline Coverage as Revenue Leading Indicator">
        A B2B SaaS company tracks quarterly pipeline coverage ratio = (open pipeline value) / (revenue target).
        Historical data shows:
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li>Coverage ratio &gt; 3×: 90% probability of hitting quarterly target</li>
          <li>Coverage ratio 2–3×: 65% probability</li>
          <li>Coverage ratio &lt; 2×: 35% probability</li>
        </ul>
        By forecasting pipeline progression each week (using age-based conversion curves), the model
        provides a confidence-weighted revenue forecast 6–10 weeks into the future.
      </ExampleBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Customer Lifetime Value Prediction</h2>

      <DefinitionBlock title="BG/NBD Model for CLV">
        The BG/NBD (Beta-Geometric / Negative Binomial Distribution) model predicts future transaction
        counts for individual customers given their past transaction history:
        <BlockMath math="\mathbb{E}[Y | \text{history}] = \sum_{t=1}^{T} P(\text{alive at t}) \times \mathbb{E}[\text{purchases} | \text{alive}]" />
        Paired with a Gamma-Gamma spend model, it predicts CLV at the individual customer level. This is
        the foundation for customer cohort revenue forecasting and prioritizing retention efforts.
      </DefinitionBlock>

      <NoteBlock>
        Driver-based models are only as good as the conversion rate assumptions. Conversion rates shift with:
        macroeconomic environment, competitive dynamics, product-market fit changes, and rep quality changes.
        Build an alert system that flags when any funnel stage conversion rate deviates more than 2 standard
        deviations from its rolling 90-day average — this is usually the first sign of a structural change.
      </NoteBlock>

      <WarningBlock>
        The biggest driver-based forecasting failure mode is "garbage in, garbage out" — if CRM data quality
        is poor (deals not updated, stages misused, duplicate contacts), the pipeline forecast will be unreliable.
        Invest in CRM hygiene and data governance before building sophisticated pipeline models. A simple
        model with clean data outperforms a sophisticated model with dirty data.
      </WarningBlock>

      <PythonCode
        title="Driver-Based Revenue Model"
        code={`import numpy as np
import pandas as pd
from scipy.special import gammaln
from scipy.optimize import minimize

# ── Driver-based MRR forecasting ─────────────────────────────────────────────
class DriverBasedMRRModel:
    """
    Forecast MRR using: New MRR (from pipeline), Expansion, Churn.
    All rates are independently forecast using exponential smoothing.
    """
    def __init__(self, alpha: float = 0.3):
        self.alpha = alpha
        self.churn_rate    = None
        self.expansion_rate = None

    def fit(self, mrr_history: pd.DataFrame):
        """
        mrr_history: DataFrame with columns [date, mrr, new_mrr, expansion_mrr, churned_mrr]
        """
        df = mrr_history.copy().sort_values('date')
        # Compute rates
        df['churn_rate']     = df['churned_mrr'] / df['mrr'].shift(1)
        df['expansion_rate'] = df['expansion_mrr'] / df['mrr'].shift(1)
        df = df.dropna()

        # Exponential smoothing estimates
        self.churn_rate     = df['churn_rate'].ewm(alpha=self.alpha).mean().iloc[-1]
        self.expansion_rate = df['expansion_rate'].ewm(alpha=self.alpha).mean().iloc[-1]
        self.last_mrr       = df['mrr'].iloc[-1]
        self.avg_new_mrr    = df['new_mrr'].ewm(alpha=self.alpha).mean().iloc[-1]
        return self

    def predict(self, h: int, scenario: str = 'base') -> pd.DataFrame:
        """Forecast h months forward. scenario in ['bear', 'base', 'bull']."""
        scenario_adj = {'bear': 0.75, 'base': 1.0, 'bull': 1.25}
        adj = scenario_adj[scenario]

        forecasts = []
        mrr = self.last_mrr
        for i in range(1, h + 1):
            churn     = mrr * self.churn_rate
            expansion = mrr * self.expansion_rate * adj
            new_mrr   = self.avg_new_mrr * adj
            mrr       = mrr - churn + expansion + new_mrr
            forecasts.append({
                'month': i,
                'mrr': round(mrr, 2),
                'churn': round(churn, 2),
                'expansion': round(expansion, 2),
                'new_mrr': round(new_mrr, 2),
            })
        return pd.DataFrame(forecasts)


# ── Generate synthetic MRR history ───────────────────────────────────────────
np.random.seed(42)
n_months = 24
mrr_start = 500_000  # $500K MRR

dates, mrr_vals, new_mrr, exp_mrr, churn_mrr = [], [], [], [], []
mrr = mrr_start
for i in range(n_months):
    new   = np.random.normal(40_000, 8_000)
    exp   = mrr * np.random.normal(0.04, 0.01)
    churn = mrr * np.random.normal(0.025, 0.005)
    mrr   = mrr + new + exp - churn
    dates.append(pd.Timestamp('2022-01-01') + pd.DateOffset(months=i))
    mrr_vals.append(round(mrr, 0))
    new_mrr.append(round(new, 0))
    exp_mrr.append(round(exp, 0))
    churn_mrr.append(round(abs(churn), 0))

history = pd.DataFrame({'date': dates, 'mrr': mrr_vals,
                         'new_mrr': new_mrr, 'expansion_mrr': exp_mrr,
                         'churned_mrr': churn_mrr})

# ── Fit and forecast ──────────────────────────────────────────────────────────
model = DriverBasedMRRModel(alpha=0.3).fit(history)
print(f"Fitted rates: Churn={model.churn_rate:.2%}, Expansion={model.expansion_rate:.2%}")

scenarios = {}
for scenario in ['bear', 'base', 'bull']:
    scenarios[scenario] = model.predict(h=12, scenario=scenario)

print("\\n12-Month MRR Forecast by Scenario:")
comparison = pd.DataFrame({
    'Month': scenarios['base']['month'],
    'Bear MRR': scenarios['bear']['mrr'],
    'Base MRR': scenarios['base']['mrr'],
    'Bull MRR': scenarios['bull']['mrr'],
})
print(comparison.to_string(index=False))

# ── Funnel-based new logo pipeline model ─────────────────────────────────────
def pipeline_forecast(
    monthly_visitors: int,
    lead_rate: float = 0.10,
    mql_rate: float  = 0.30,
    sql_rate: float  = 0.40,
    opp_rate: float  = 0.33,
    win_rate: float  = 0.30,
    avg_contract_value: float = 60_000,  # ACV
    sales_cycle_months: int = 3,
) -> dict:
    leads = monthly_visitors * lead_rate
    mqls  = leads * mql_rate
    sqls  = mqls * sql_rate
    opps  = sqls * opp_rate
    wins  = opps * win_rate
    new_arr_per_month = wins * avg_contract_value / sales_cycle_months
    return {
        'monthly_visitors': monthly_visitors,
        'leads':  round(leads), 'MQLs': round(mqls),
        'SQLs':   round(sqls),  'Opps': round(opps),
        'wins':   round(wins),
        'new_arr_per_month': round(new_arr_per_month, 0),
    }

funnel = pipeline_forecast(monthly_visitors=50_000)
print("\\nPipeline Funnel Forecast:")
for k, v in funnel.items():
    print(f"  {k}: {v:,}" if isinstance(v, (int, float)) else f"  {k}: {v}")
`}
      />

      <ReferenceList
        references={[
          {
            author: 'Fader, P.S., Hardie, B.G.S., & Lee, K.L.',
            year: 2005,
            title: '"Counting your customers" the easy way: An alternative to the Pareto/NBD model',
            journal: 'Marketing Science',
            volume: '24(2)',
            pages: '275–284',
          },
          {
            author: 'Lim, C. & Hyndman, R.J.',
            year: 2021,
            title: 'Hierarchical and coherent forecasting for financial planning',
            journal: 'International Journal of Forecasting',
          },
        ]}
      />
    </SectionLayout>
  );
}
