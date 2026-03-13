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
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

function NewsvendorViz() {
  const [cu, setCu] = useState(20);  // underage cost
  const [co, setCo] = useState(5);   // overage cost
  const mu = 100, sigma = 20;
  const cr = cu / (cu + co);
  const qStar = mu + sigma * (Math.sqrt(2) * erfinvApprox(2 * cr - 1));

  // Approximate profit vs quantity
  const data = [];
  for (let q = 40; q <= 180; q += 4) {
    // Expected profit = cu * E[min(D,q)] - co * E[max(q-D,0)] - base
    const profit = expectedProfit(q, mu, sigma, cu, co);
    data.push({ q, profit: Math.round(profit) });
  }

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold mb-2">Newsvendor Model — Expected Profit</h3>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="text-sm font-medium">Underage cost c_u: <b>${cu}/unit</b></label>
          <input type="range" min="5" max="50" step="5" value={cu}
            onChange={e => setCu(+e.target.value)} className="w-full mt-1" />
          <p className="text-xs text-gray-500">Lost margin per unit of unmet demand</p>
        </div>
        <div>
          <label className="text-sm font-medium">Overage cost c_o: <b>${co}/unit</b></label>
          <input type="range" min="1" max="30" step="1" value={co}
            onChange={e => setCo(+e.target.value)} className="w-full mt-1" />
          <p className="text-xs text-gray-500">Loss per unit of unsold inventory</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3 text-center text-sm">
        <div className="bg-blue-50 rounded p-2"><div className="text-gray-500">Critical Ratio</div><div className="font-bold text-blue-600">{cr.toFixed(3)}</div></div>
        <div className="bg-green-50 rounded p-2"><div className="text-gray-500">Optimal Q*</div><div className="font-bold text-green-600">{Math.round(qStar)} units</div></div>
        <div className="bg-purple-50 rounded p-2"><div className="text-gray-500">Implied CSL</div><div className="font-bold text-purple-600">{(cr * 100).toFixed(0)}%</div></div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="q" label={{ value: 'Order Quantity Q', position: 'insideBottom', offset: -10 }} />
          <YAxis label={{ value: 'Expected Profit ($)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <ReferenceLine x={Math.round(qStar)} stroke="#9333ea" strokeDasharray="4 2"
            label={{ value: 'Q*', position: 'top', fill: '#9333ea' }} />
          <Line dataKey="profit" stroke="#22c55e" strokeWidth={2} dot={false} name="Expected Profit" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Helpers for visualization
function erfinvApprox(x) {
  // Rational approximation for erf inverse
  const a = 0.147;
  const ln_term = Math.log(1 - x * x);
  const term1 = 2 / (Math.PI * a) + ln_term / 2;
  const sign = x >= 0 ? 1 : -1;
  return sign * Math.sqrt(Math.sqrt(term1 * term1 - ln_term / a) - term1);
}

function normalCDF(x, mu, sigma) {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
}

function erf(x) {
  const t = 1 / (1 + 0.5 * Math.abs(x));
  const tau = t * Math.exp(-x*x - 1.26551223 + t*(1.00002368 + t*(0.37409196 +
    t*(0.09678418 + t*(-0.18628806 + t*(0.27886807 + t*(-1.13520398 +
    t*(1.48851587 + t*(-0.82215223 + t*0.17087294)))))))));
  return x >= 0 ? 1 - tau : tau - 1;
}

function normalPDF(x, mu, sigma) {
  return Math.exp(-0.5 * ((x - mu)/sigma)**2) / (sigma * Math.sqrt(2 * Math.PI));
}

function expectedProfit(q, mu, sigma, cu, co) {
  // E[profit] = cu * E[min(D,q)] - co * E[(q-D)+]
  // E[min(D,q)] = mu - (mu-q)*Phi((q-mu)/sigma) - sigma*phi((q-mu)/sigma)
  const z = (q - mu) / sigma;
  const phiZ = normalPDF(z, 0, 1);
  const PhiZ = normalCDF(q, mu, sigma);
  const eLoss = (mu - q) * (1 - PhiZ) + sigma * phiZ; // E[(D-q)+]
  const eExcess = q - mu + eLoss;   // E[(q-D)+]
  return cu * (mu - eLoss) - co * eExcess;
}

export default function ProbabilisticInventory() {
  return (
    <SectionLayout
      title="Probabilistic Inventory Models"
      subject="Supply Chain Forecasting"
      difficulty="advanced"
      readingTime={13}
    >
      <p>
        When demand is uncertain, the inventory problem becomes a stochastic optimization. The newsvendor model
        is the canonical single-period problem — it captures the fundamental tension between overstocking
        (wasted inventory) and understocking (lost sales or backorders). Extensions include multi-period
        lost-sales models, multi-echelon inventory, and full stochastic programming formulations.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-3">The Newsvendor Model</h2>

      <DefinitionBlock title="Newsvendor Problem Setup">
        A retailer must order <InlineMath math="Q" /> units before observing demand
        <InlineMath math="D \sim F(\cdot)" />. Costs:
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li><InlineMath math="c_u" />: underage cost per unit of unmet demand (lost margin, goodwill loss)</li>
          <li><InlineMath math="c_o" />: overage cost per unit of unsold inventory (salvage loss, storage)</li>
        </ul>
        Expected total cost:
        <BlockMath math="C(Q) = c_u \cdot \mathbb{E}[(D - Q)^+] + c_o \cdot \mathbb{E}[(Q - D)^+]" />
      </DefinitionBlock>

      <TheoremBlock title="Newsvendor Optimality Condition">
        The optimal order quantity <InlineMath math="Q^*" /> satisfies:
        <BlockMath math="F(Q^*) = \frac{c_u}{c_u + c_o} \equiv \text{CR}" />
        where CR is the <em>critical ratio</em>. If demand is normally distributed with mean <InlineMath math="\mu" />
        and standard deviation <InlineMath math="\sigma" />:
        <BlockMath math="Q^* = \mu + z_{\text{CR}} \cdot \sigma, \quad z_{\text{CR}} = \Phi^{-1}(\text{CR})" />
        The critical ratio is the service level implied by the cost structure — no arbitrary target is needed.
      </TheoremBlock>

      <NewsvendorViz />

      <ExampleBlock title="Fashion Retailer with Clearance">
        A buyer must order winter coats before the season. Purchase cost: $80, retail price: $150, end-of-season
        clearance price: $50.
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li>Underage cost <InlineMath math="c_u" /> = $150 − $80 = $70 (lost margin)</li>
          <li>Overage cost <InlineMath math="c_o" /> = $80 − $50 = $30 (clearance loss)</li>
          <li>Critical ratio = 70/(70+30) = 0.70</li>
          <li>With demand ~ N(500, 100²), optimal Q* = 500 + 0.524×100 = 552 coats</li>
        </ul>
        This is the natural "fill-rate" interpretation: order enough to satisfy 70% of demand distributions.
      </ExampleBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Lost Sales vs Backorders</h2>
      <p>
        The multi-period extension of the newsvendor depends critically on whether unsatisfied demand is lost
        or backordered:
      </p>
      <ul className="list-disc ml-5 space-y-2 text-sm mt-2">
        <li><strong>Backorder model</strong>: Unsatisfied demand waits until replenishment arrives.
        The base-stock policy is optimal: order-up-to level S = <InlineMath math="\mu_L + z_{CSL} \sigma_L" />.
        This is equivalent to the ROP formula.</li>
        <li><strong>Lost-sales model</strong>: Unsatisfied demand is permanently lost. The optimal policy is
        more complex — the base-stock level must be set higher because inventory has asymmetric value.
        The optimal S satisfies a similar critical ratio condition but applied to the lead-time demand distribution.</li>
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-3">Multi-Echelon Inventory</h2>
      <p>
        Real supply chains have multiple stocking echelons: factory warehouse → regional DC → store → shelf.
        The Clark-Scarf model (1960) showed that multi-echelon systems can be decomposed: each echelon optimizes
        its base-stock level independently, with the warehouse's lead time reflecting the store's
        replenishment delay. Key insights:
      </p>
      <ul className="list-disc ml-5 space-y-1 text-sm mt-2">
        <li>Safety stock should be held at the echelon closest to customer demand — pooling upstream reduces safety stock</li>
        <li>Supply chain vulnerability (demand amplification / bullwhip) means upstream echelons need larger safety buffers</li>
        <li>Centralization (single DC) versus decentralization (multiple DCs) creates classic risk-pooling tradeoffs</li>
      </ul>

      <DefinitionBlock title="Risk Pooling Formula">
        Consolidating <InlineMath math="n" /> independent, identically distributed demand streams into a single
        warehouse reduces the required safety stock by a factor of <InlineMath math="\sqrt{n}" />:
        <BlockMath math="\sigma_{\text{pooled}} = \sigma_{\text{individual}} \cdot \sqrt{n}" />
        vs. <InlineMath math="n" /> independent stocks requiring <InlineMath math="n \cdot \sigma_{\text{individual}}" /> total.
        The saving is <InlineMath math="(\sqrt{n} - 1)/\sqrt{n}" />, e.g., 50% savings pooling 4 stores into 1 DC.
      </DefinitionBlock>

      <NoteBlock>
        The newsvendor model assumes a single selling period. For products with multiple periods (most supply
        chain contexts), the base-stock (order-up-to) policy is optimal under backorders. Under lost sales,
        optimal policies are harder to compute exactly but can be approximated well by inflating the backorder
        safety factor by 20–30%.
      </NoteBlock>

      <WarningBlock>
        A common mistake is setting service level targets (95%, 99%) without connecting them to actual
        cost ratios. A retailer with 40% margin and 10% salvage loss has a natural critical ratio of
        0.40/(0.40+0.10) = 0.80. Forcing a 95% CSL would overstock significantly and reduce total profit.
        Always anchor service-level targets in the cost structure.
      </WarningBlock>

      <PythonCode
        title="Newsvendor Solution and Monte Carlo Simulation"
        code={`import numpy as np
from scipy.stats import norm, poisson
from scipy.optimize import minimize_scalar

# ── Newsvendor with Normal demand ─────────────────────────────────────────────
def newsvendor_normal(mu, sigma, cu, co):
    """Optimal Q, expected cost, and expected profit."""
    cr     = cu / (cu + co)
    q_star = mu + sigma * norm.ppf(cr)
    # Expected cost
    z      = (q_star - mu) / sigma
    ec_under = cu * sigma * norm.pdf(z) + cu * (mu - q_star) * (1 - norm.cdf(z))
    ec_over  = co * sigma * norm.pdf(z) - co * (mu - q_star) * norm.cdf(z)
    # Simpler: E[cost] = cu * E[(D-Q)+] + co * E[(Q-D)+]
    e_short  = sigma * norm.pdf(z) - (q_star - mu) * (1 - norm.cdf(z))
    e_excess = (q_star - mu) + e_short        # by balance equation E[D-Q+] + Q = E[D] + E[Q-D+]
    total_ec = cu * e_short + co * e_excess
    return dict(q_star=round(q_star, 1), cr=round(cr, 4),
                e_short=round(e_short, 2), e_excess=round(e_excess, 2),
                expected_cost=round(total_ec, 2))

# ── Fashion example ────────────────────────────────────────────────────────────
result = newsvendor_normal(mu=500, sigma=100, cu=70, co=30)
print("Fashion Newsvendor:")
for k, v in result.items():
    print(f"  {k}: {v}")

# ── Newsvendor with Poisson demand (intermittent) ──────────────────────────────
def newsvendor_poisson(lam, cu, co):
    """Optimal Q for Poisson demand."""
    cr = cu / (cu + co)
    # Find smallest Q such that F(Q) >= cr
    q = poisson.ppf(cr, lam)
    return int(q), cr

q_poisson, cr_p = newsvendor_poisson(lam=15, cu=50, co=10)
print(f"\\nPoisson Newsvendor (lambda=15, cu=50, co=10):")
print(f"  CR = {cr_p:.3f}, Q* = {q_poisson}")

# ── Monte Carlo simulation ─────────────────────────────────────────────────────
np.random.seed(42)
n_sims = 50_000
mu, sigma, cu, co = 500, 100, 70, 30
cr = cu / (cu + co)
q_star = mu + sigma * norm.ppf(cr)

demands = np.random.normal(mu, sigma, n_sims)

profits = []
for q in [q_star - 50, q_star, q_star + 50]:
    sales    = np.minimum(demands, q)
    leftover = np.maximum(q - demands, 0)
    lost     = np.maximum(demands - q, 0)
    profit   = cu * sales - co * leftover - cu * lost
    profits.append({'q': round(q, 0), 'mean_profit': profit.mean().round(2),
                    'std_profit': profit.std().round(2)})

import pandas as pd
print("\\nMonte Carlo Profit by Order Quantity:")
print(pd.DataFrame(profits).to_string(index=False))

# ── Risk pooling demonstration ─────────────────────────────────────────────────
sigma_single = 50   # demand std dev per store
n_stores     = [1, 2, 4, 8, 16]
z_csl        = norm.ppf(0.95)   # 95% CSL

print("\\nRisk Pooling (95% CSL):")
print(f"{'Stores':>8} {'Decentralized SS':>20} {'Centralized SS':>18} {'Savings':>10}")
for n in n_stores:
    decentral = n * z_csl * sigma_single
    central   = z_csl * sigma_single * np.sqrt(n)
    saving    = (decentral - central) / decentral
    print(f"{n:>8} {decentral:>20.0f} {central:>18.0f} {saving:>9.1%}")
`}
      />

      <ReferenceList
        references={[
          {
            author: 'Arrow, K.J., Harris, T., & Marschak, J.',
            year: 1951,
            title: 'Optimal inventory policy',
            journal: 'Econometrica',
            volume: '19(3)',
            pages: '250–272',
          },
          {
            author: 'Clark, A.J. & Scarf, H.',
            year: 1960,
            title: 'Optimal policies for a multi-echelon inventory problem',
            journal: 'Management Science',
            volume: '6(4)',
            pages: '475–490',
          },
          {
            author: 'Cachon, G. & Terwiesch, C.',
            year: 2019,
            title: 'Matching Supply with Demand: An Introduction to Operations Management (4th ed.)',
            publisher: 'McGraw-Hill',
          },
        ]}
      />
    </SectionLayout>
  );
}
