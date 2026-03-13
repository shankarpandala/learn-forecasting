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
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ScatterChart, Scatter, Cell,
} from 'recharts';

const serviceVsInventory = [
  { safety_stock: 0, service_level: 0.72, excess_units: 0 },
  { safety_stock: 20, service_level: 0.83, excess_units: 20 },
  { safety_stock: 40, service_level: 0.90, excess_units: 40 },
  { safety_stock: 65, service_level: 0.95, excess_units: 65 },
  { safety_stock: 100, service_level: 0.975, excess_units: 100 },
  { safety_stock: 145, service_level: 0.99, excess_units: 145 },
];

export default function BusinessMetrics() {
  return (
    <SectionLayout
      title="Business Impact Metrics"
      subject="Supply Chain Forecasting"
      difficulty="intermediate"
      readingTime={10}
    >
      <p>
        Statistical forecast accuracy (MAPE, MASE) is a means to an end — the end being better business
        outcomes. Supply chain executives care about service levels, inventory turns, working capital, and
        lost sales. Connecting forecast accuracy improvement to these financial metrics is critical for
        securing investment in forecasting capabilities and demonstrating ROI.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-3">Service Level vs Inventory Cost Tradeoff</h2>

      <DefinitionBlock title="Cycle Service Level (CSL)">
        The probability of not stocking out during a replenishment cycle:
        <BlockMath math="\text{CSL} = P(D_L \leq \text{Stock}) = \Phi\left(\frac{\text{SS}}{\sigma_L}\right)" />
        where <InlineMath math="\sigma_L = \sigma_d \sqrt{L}" /> is the standard deviation of demand during
        lead time. Higher CSL requires more safety stock, increasing holding costs.
      </DefinitionBlock>

      <DefinitionBlock title="Fill Rate (FR)">
        The fraction of demand satisfied immediately from stock (no stockout):
        <BlockMath math="\text{FR} = 1 - \frac{\mathbb{E}[(D - S)^+]}{E[D]}" />
        Fill rate is a more customer-relevant metric than CSL. A CSL of 95% does not mean 95% of units
        are delivered on time — a single stockout event can span many units. Fill rate directly measures
        the fraction of demand fulfilled.
      </DefinitionBlock>

      <div className="my-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Service Level vs Safety Stock Investment</h3>
        <p className="text-sm text-gray-600 mb-3">
          Each additional point of service level requires exponentially more safety stock investment.
          The "knee of the curve" around 95% CSL is often the economically optimal point.
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={serviceVsInventory} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="service_level" tickFormatter={v => `${(v*100).toFixed(0)}%`}
              label={{ value: 'Cycle Service Level', position: 'insideBottom', offset: -10 }} />
            <YAxis label={{ value: 'Safety Stock Units', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(v, n) => [v, n === 'excess_units' ? 'Safety Stock' : n]} />
            <Bar dataKey="excess_units" fill="#3b82f6" name="Safety Stock Required" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-3">Lost Sales Cost</h2>

      <DefinitionBlock title="Lost Sales Calculation">
        Expected annual lost sales cost:
        <BlockMath math="\text{Lost Sales Cost} = p_{\text{lost}} \cdot \bar{d} \cdot (1 - \text{FR}) \cdot 52" />
        where <InlineMath math="p_{\text{lost}}" /> is the margin per unit lost (including goodwill),
        <InlineMath math="\bar{d}" /> is average weekly demand, and <InlineMath math="\text{FR}" /> is fill rate.
        A 1% improvement in fill rate on a $50M revenue product with 40% margin saves ~$200K/year.
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Excess Inventory Cost</h2>

      <DefinitionBlock title="Excess Inventory Cost">
        Annual cost of carrying excess inventory:
        <BlockMath math="\text{Holding Cost} = \underbrace{r_c \cdot C}_{\text{capital}} + \underbrace{r_w \cdot C}_{\text{warehouse}} + \underbrace{r_o \cdot C}_{\text{obsolescence}}" />
        where <InlineMath math="C" /> is inventory value, <InlineMath math="r_c \approx 8\text{–}12\%" /> is
        cost of capital, <InlineMath math="r_w \approx 3\text{–}5\%" /> is warehouse rate, and
        <InlineMath math="r_o" /> is SKU-specific obsolescence risk. Total holding cost is typically 20–30%
        of inventory value per year.
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Value of Forecast Accuracy Improvement</h2>

      <TheoremBlock title="Safety Stock Reduction from Accuracy Improvement">
        Safety stock scales with forecast error standard deviation. If RMSE improves by a factor
        <InlineMath math="\rho" />:
        <BlockMath math="\text{SS}_{\text{new}} = \rho \cdot \text{SS}_{\text{old}}" />
        A 20% reduction in RMSE (ρ = 0.8) reduces safety stock — and therefore holding cost — by 20%.
        For a $10M inventory with 25% annual holding rate, this saves $500K/year.
      </TheoremBlock>

      <ExampleBlock title="ROI Calculation for ML Forecasting Investment">
        A distributor invests $200K in an ML forecasting system that reduces WMAPE from 28% to 18%
        (a 36% relative improvement in accuracy):
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li>Annual inventory value: $15M</li>
          <li>Safety stock reduction: 25% (proportional to RMSE improvement)</li>
          <li>Safety stock freed: $15M × 30% (SS fraction) × 25% = $1.125M</li>
          <li>Annual holding cost saving: $1.125M × 25% = $281K</li>
          <li>Lost sales reduction: Fill rate improvement 91% → 94.5%, saving $320K</li>
          <li>Total annual benefit: ~$600K vs $200K investment = 3× first-year ROI</li>
        </ul>
      </ExampleBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Value of Information</h2>
      <p>
        The value-of-information (VOI) framework quantifies how much additional data (more SKUs, longer history,
        external signals) is worth. If better demand sensing reduces forecast RMSE by a further 10%, the
        incremental saving can be computed and compared to the data acquisition cost.
      </p>
      <ul className="list-disc ml-5 space-y-1 text-sm mt-2">
        <li><strong>POS data</strong>: Point-of-sale data from retailers reduces lead time by providing
        real-time sell-through — worth capturing even at a cost</li>
        <li><strong>Weather data</strong>: For weather-sensitive categories (garden, HVAC, beverages), reducing
        weather uncertainty can cut RMSE by 5–15%</li>
        <li><strong>Promotional calendars</strong>: Accurate promotion data is often worth more than model
        complexity — a simple model with good promotion features beats a complex model without them</li>
      </ul>

      <NoteBlock>
        The connection between statistical accuracy and business metrics is nonlinear and SKU-dependent.
        A 10% MAPE improvement on an A-X SKU (high value, stable demand) may save 10× more than the same
        improvement on a C-Z SKU. Build business impact dashboards that weight forecast improvement by
        SKU revenue and margin contribution.
      </NoteBlock>

      <WarningBlock>
        Inventory reduction initiatives and service level improvements can be in conflict. Moving from 95%
        to 92% CSL reduces safety stock by ~30% but causes a meaningful increase in stockouts. Always model
        the cost of service reduction before presenting inventory reduction numbers to leadership.
      </WarningBlock>

      <PythonCode
        title="Business Metrics Calculator"
        code={`import numpy as np
import pandas as pd
from scipy.stats import norm

def compute_business_metrics(
    avg_weekly_demand: float,
    demand_std: float,
    lead_time_weeks: int,
    unit_margin: float,
    unit_cost: float,
    annual_holding_rate: float = 0.25,
    forecast_rmse: float = None,
    target_csl: float = 0.95,
) -> dict:
    """
    Compute inventory business metrics given demand parameters and cost structure.
    """
    sigma_lt = demand_std * np.sqrt(lead_time_weeks)
    z_csl    = norm.ppf(target_csl)
    safety_stock = z_csl * sigma_lt

    # Fill rate: 1 - E[(D-S)+] / E[D]  (Normal approximation)
    e_stockout = sigma_lt * (norm.pdf(z_csl) - z_csl * (1 - norm.cdf(z_csl)))
    fill_rate  = 1 - e_stockout / (avg_weekly_demand * lead_time_weeks)
    fill_rate  = min(1.0, max(0, fill_rate))

    # Costs
    annual_demand = avg_weekly_demand * 52
    avg_inventory = safety_stock + avg_weekly_demand * lead_time_weeks / 2  # cycle + SS
    holding_cost  = avg_inventory * unit_cost * annual_holding_rate
    lost_sales    = annual_demand * (1 - fill_rate) * unit_margin

    # RMSE-based safety stock
    if forecast_rmse is not None:
        ss_forecast_based = z_csl * forecast_rmse * np.sqrt(lead_time_weeks)
    else:
        ss_forecast_based = safety_stock

    return {
        'safety_stock_units':    round(safety_stock, 1),
        'cycle_service_level':   round(target_csl * 100, 1),
        'fill_rate':             round(fill_rate * 100, 2),
        'avg_inventory_value':   round(avg_inventory * unit_cost, 0),
        'annual_holding_cost':   round(holding_cost, 0),
        'annual_lost_sales':     round(lost_sales, 0),
        'total_annual_cost':     round(holding_cost + lost_sales, 0),
        'ss_if_forecast_rmse':   round(ss_forecast_based, 1),
    }

def roi_of_accuracy_improvement(
    current_metrics: dict,
    new_rmse: float,
    current_rmse: float,
    investment: float,
    z_csl: float = 1.645,
    unit_cost: float = 50.0,
    annual_holding_rate: float = 0.25,
) -> dict:
    """Estimate ROI of improving forecast accuracy."""
    rmse_ratio        = new_rmse / current_rmse
    ss_reduction_pct  = 1 - rmse_ratio
    ss_saved_units    = current_metrics['safety_stock_units'] * ss_reduction_pct
    ss_value_freed    = ss_saved_units * unit_cost
    holding_saving    = ss_value_freed * annual_holding_rate
    annual_benefit    = holding_saving   # simplified (could add fill rate improvement)
    roi               = (annual_benefit - investment) / investment * 100

    return {
        'rmse_improvement_pct': round((1 - rmse_ratio) * 100, 1),
        'ss_freed_units':       round(ss_saved_units, 1),
        'ss_value_freed':       round(ss_value_freed, 0),
        'annual_holding_saving': round(holding_saving, 0),
        'first_year_roi_pct':   round(roi, 1),
    }


# ── Example: high-value consumer electronics SKU ─────────────────────────────
metrics_95 = compute_business_metrics(
    avg_weekly_demand=200, demand_std=40, lead_time_weeks=4,
    unit_margin=80, unit_cost=150, target_csl=0.95
)
metrics_97 = compute_business_metrics(
    avg_weekly_demand=200, demand_std=40, lead_time_weeks=4,
    unit_margin=80, unit_cost=150, target_csl=0.97
)

print("=== SKU Business Metrics ===")
print(f"{'Metric':<30} {'CSL=95%':>12} {'CSL=97%':>12}")
for k in metrics_95:
    print(f"{k:<30} {metrics_95[k]:>12} {metrics_97[k]:>12}")

# ── ROI of ML forecasting ─────────────────────────────────────────────────────
roi = roi_of_accuracy_improvement(
    current_metrics=metrics_95,
    new_rmse=32,           # after ML (RMSE drops from 40 to 32 = 20% improvement)
    current_rmse=40,
    investment=200_000,
    unit_cost=150,
)
print("\\n=== ROI of Forecast Accuracy Improvement ===")
for k, v in roi.items():
    print(f"  {k}: {v}")

# ── Portfolio-level analysis ──────────────────────────────────────────────────
skus = [
    {'sku': 'SKU_A', 'weekly_demand': 500, 'std': 80, 'lt': 2, 'margin': 100, 'cost': 200},
    {'sku': 'SKU_B', 'weekly_demand': 50, 'std': 30, 'lt': 6, 'margin': 40, 'cost': 80},
    {'sku': 'SKU_C', 'weekly_demand': 1000, 'std': 200, 'lt': 1, 'margin': 20, 'cost': 30},
]

portfolio = []
for sku in skus:
    m = compute_business_metrics(sku['weekly_demand'], sku['std'], sku['lt'],
                                  sku['margin'], sku['cost'])
    portfolio.append({'SKU': sku['sku'], **m})

df = pd.DataFrame(portfolio)
print("\\n=== Portfolio Business Metrics ===")
print(df[['SKU', 'fill_rate', 'annual_holding_cost', 'annual_lost_sales', 'total_annual_cost']].to_string(index=False))
print(f"\\nTotal portfolio annual cost: ${df['total_annual_cost'].sum():,.0f}")
`}
      />

      <ReferenceList
        references={[
          {
            author: 'Chopra, S. & Meindl, P.',
            year: 2021,
            title: 'Supply Chain Management: Strategy, Planning, and Operation (7th ed.)',
            publisher: 'Pearson',
          },
          {
            author: 'Simchi-Levi, D., Kaminsky, P., & Simchi-Levi, E.',
            year: 2021,
            title: 'Designing and Managing the Supply Chain (3rd ed.)',
            publisher: 'McGraw-Hill',
          },
        ]}
      />
    </SectionLayout>
  );
}
