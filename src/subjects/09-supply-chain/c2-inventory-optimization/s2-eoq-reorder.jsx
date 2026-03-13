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
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

function EOQViz() {
  const [D, setD] = useState(1000);
  const [S, setS] = useState(50);
  const [H, setH] = useState(2);

  const eoq = Math.sqrt((2 * D * S) / H);
  const orderingCost = (D / eoq) * S;
  const holdingCost  = (eoq / 2) * H;
  const totalCost    = orderingCost + holdingCost;

  // Build cost curve
  const data = [];
  for (let q = 50; q <= Math.min(eoq * 3, 2000); q += 20) {
    const oc = (D / q) * S;
    const hc = (q / 2) * H;
    data.push({ q: Math.round(q), ordering: Math.round(oc), holding: Math.round(hc), total: Math.round(oc + hc) });
  }

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold mb-2">EOQ Cost Curve — Interactive</h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-sm font-medium">Annual Demand D: <b>{D}</b></label>
          <input type="range" min="100" max="5000" step="100" value={D}
            onChange={e => setD(+e.target.value)} className="w-full mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Order Cost S: <b>${S}</b></label>
          <input type="range" min="10" max="300" step="10" value={S}
            onChange={e => setS(+e.target.value)} className="w-full mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Holding Cost H: <b>${H}/unit/yr</b></label>
          <input type="range" min="0.5" max="10" step="0.5" value={H}
            onChange={e => setH(+e.target.value)} className="w-full mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4 text-center text-sm">
        <div className="bg-blue-50 rounded p-2"><div className="text-gray-500">EOQ</div><div className="text-xl font-bold text-blue-600">{eoq.toFixed(0)} units</div></div>
        <div className="bg-green-50 rounded p-2"><div className="text-gray-500">Order Freq</div><div className="text-xl font-bold text-green-600">{(D/eoq).toFixed(1)}×/yr</div></div>
        <div className="bg-orange-50 rounded p-2"><div className="text-gray-500">Total Cost</div><div className="text-xl font-bold text-orange-600">${totalCost.toFixed(0)}/yr</div></div>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="q" label={{ value: 'Order Quantity Q', position: 'insideBottom', offset: -10 }} />
          <YAxis label={{ value: 'Annual Cost ($)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend verticalAlign="top" />
          <ReferenceLine x={Math.round(eoq)} stroke="#9333ea" strokeDasharray="4 2" label={{ value: 'EOQ', position: 'top', fill: '#9333ea' }} />
          <Line dataKey="ordering" stroke="#3b82f6" strokeWidth={2} dot={false} name="Ordering Cost" />
          <Line dataKey="holding" stroke="#f59e0b" strokeWidth={2} dot={false} name="Holding Cost" />
          <Line dataKey="total" stroke="#22c55e" strokeWidth={2} dot={false} name="Total Cost" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function EOQReorder() {
  return (
    <SectionLayout
      title="EOQ and Reorder Point Models"
      subject="Supply Chain Forecasting"
      difficulty="intermediate"
      readingTime={12}
    >
      <p>
        The Economic Order Quantity (EOQ) model and the Reorder Point (ROP) model are the foundation of classical
        inventory management. Although real supply chains have complications that violate EOQ assumptions, these
        models provide critical intuition about the cost tradeoffs in inventory, and modern systems still use
        them as base-case benchmarks and as building blocks for more sophisticated approaches.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-3">Economic Order Quantity</h2>

      <DefinitionBlock title="EOQ Model Assumptions">
        The basic EOQ model assumes:
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li>Demand rate D is constant and continuous (units per year)</li>
          <li>Order cost S is fixed per order, independent of quantity</li>
          <li>Holding cost H is proportional to inventory level (per unit per year)</li>
          <li>Lead time is zero (instantaneous replenishment) — relaxed in ROP</li>
          <li>No stockouts allowed</li>
        </ul>
      </DefinitionBlock>

      <TheoremBlock title="EOQ Formula">
        Total annual cost under a constant order quantity Q:
        <BlockMath math="TC(Q) = \underbrace{\frac{D}{Q} \cdot S}_{\text{ordering}} + \underbrace{\frac{Q}{2} \cdot H}_{\text{holding}}" />
        Minimizing over Q gives the Economic Order Quantity:
        <BlockMath math="Q^* = \sqrt{\frac{2DS}{H}}" />
        At the optimum, ordering cost equals holding cost. The minimum total annual cost is:
        <BlockMath math="TC(Q^*) = \sqrt{2DSH}" />
      </TheoremBlock>

      <EOQViz />

      <h2 className="text-xl font-bold mt-6 mb-3">Reorder Point (ROP)</h2>
      <p>
        EOQ tells us <em>how much</em> to order. The Reorder Point answers <em>when</em> to order: when inventory
        level drops to the ROP, place a new order of size Q*. The ROP must cover expected demand during lead time
        plus a safety buffer.
      </p>

      <DefinitionBlock title="Reorder Point Formula">
        <BlockMath math="\text{ROP} = \bar{d} \cdot L + z_\alpha \cdot \sigma_d \sqrt{L}" />
        where <InlineMath math="\bar{d}" /> is average daily demand, <InlineMath math="L" /> is lead time
        in days, <InlineMath math="z_\alpha" /> is the safety factor for target service level
        <InlineMath math="\alpha" />, and <InlineMath math="\sigma_d" /> is the standard deviation of daily
        demand. The term <InlineMath math="z_\alpha \sigma_d \sqrt{L}" /> is the safety stock.
      </DefinitionBlock>

      <ExampleBlock title="ROP Calculation for a Widget">
        A manufacturer orders widgets with daily demand ~ N(50, 8²). Lead time is 5 days. Target cycle
        service level is 95% (z = 1.645).
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li>Expected demand during lead time: 50 × 5 = 250 units</li>
          <li>Safety stock: 1.645 × 8 × √5 = 29.4 ≈ 30 units</li>
          <li>ROP = 250 + 30 = 280 units</li>
        </ul>
        Place a new order when inventory hits 280. With EOQ = 200 (say), expected inventory oscillates
        between 280 (trigger) and 280 + 200 = 480 units.
      </ExampleBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Continuous vs Periodic Review</h2>
      <p>
        There are two fundamental review policies:
      </p>
      <ul className="list-disc ml-5 space-y-2 text-sm mt-2">
        <li><strong>(s, Q) Continuous Review</strong>: Monitor inventory continuously. Order Q* units whenever
        inventory hits reorder point s = ROP. Requires real-time tracking but minimizes safety stock.</li>
        <li><strong>(R, S) Periodic Review</strong>: Review inventory every R periods. Order up to level S
        (the order-up-to or base-stock level). Simpler to implement but requires more safety stock to cover
        demand during the review period plus lead time.</li>
      </ul>

      <DefinitionBlock title="Order-Up-To Level (S)">
        In periodic review with cycle R and lead time L:
        <BlockMath math="S = \bar{d}(R + L) + z_\alpha \sigma_d \sqrt{R + L}" />
        The order quantity each review period is <InlineMath math="S - \text{current inventory}" />.
        The safety stock covers demand over the review period plus lead time (R + L), not just the lead time.
      </DefinitionBlock>

      <NoteBlock>
        EOQ robustness: the total cost curve is relatively flat near the optimum. Ordering 50% more or less
        than EOQ typically increases total cost by only ~6–12%. This "EOQ cost plateau" means that in practice,
        rounding to convenient lot sizes (full pallets, container loads) has minimal cost impact. Focus your
        optimization energy on the holding cost rate H — it's often underestimated, as it should include
        capital cost, warehouse space, obsolescence risk, and insurance.
      </NoteBlock>

      <WarningBlock>
        The EOQ formula assumes deterministic, constant demand. In practice, demand fluctuates and the ROP
        formula assumes normally distributed demand during lead time. For intermittent demand SKUs, use
        the newsvendor model or bootstrapping instead. Also note: EOQ does not account for order batching,
        quantity discounts, or capacity constraints — extensions exist for each.
      </WarningBlock>

      <PythonCode
        title="EOQ Calculator and Inventory Simulation"
        code={`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import norm

# ── EOQ and ROP calculation ────────────────────────────────────────────────────
def eoq(D: float, S: float, H: float) -> float:
    """Economic Order Quantity."""
    return np.sqrt(2 * D * S / H)

def rop(d_avg: float, lead_time: int, sigma_d: float, service_level: float = 0.95) -> tuple:
    """Reorder point and safety stock for given cycle service level."""
    z = norm.ppf(service_level)
    safety_stock = z * sigma_d * np.sqrt(lead_time)
    return d_avg * lead_time + safety_stock, safety_stock

# ── Example SKU parameters ────────────────────────────────────────────────────
D        = 5200      # annual demand (units/year)
S        = 45.0      # order placement cost ($)
H        = 3.5       # holding cost ($/unit/year)
d_daily  = D / 365  # daily demand rate
sigma_d  = 4.0       # daily demand std dev
L        = 7         # lead time (days)
csl      = 0.97      # cycle service level

Q_star  = eoq(D, S, H)
rp, ss  = rop(d_daily, L, sigma_d, csl)
cycle_time = Q_star / d_daily  # days between orders

print(f"=== Inventory Policy ===")
print(f"  EOQ (Q*):          {Q_star:.0f} units")
print(f"  Orders/year:       {D/Q_star:.1f}")
print(f"  Cycle time:        {cycle_time:.0f} days")
print(f"  Safety stock:      {ss:.0f} units")
print(f"  Reorder point:     {rp:.0f} units")
print(f"  Min total cost:    \${np.sqrt(2*D*S*H):.2f}/year")

# ── Inventory simulation: (s, Q) policy ──────────────────────────────────────
np.random.seed(42)
T        = 365                   # simulation days
inventory = rp + Q_star          # start full
on_order  = 0
order_due = None

inv_trace  = []
orders     = []
stockouts  = 0

for t in range(T):
    # Receive order if due
    if order_due == t:
        inventory += Q_star
        on_order   = 0
        order_due  = None

    # Realize demand
    d = max(0, np.random.normal(d_daily, sigma_d))
    stockout = max(0, d - inventory)
    stockouts += stockout
    inventory  = max(0, inventory - d)

    # Check reorder point
    if inventory + on_order <= rp and on_order == 0:
        on_order  = Q_star
        order_due = t + L
        orders.append(t)

    inv_trace.append(inventory)

inv_arr = np.array(inv_trace)
print(f"\\n=== Simulation Results (365 days) ===")
print(f"  Avg inventory:  {inv_arr.mean():.1f} units")
print(f"  Stockouts:      {stockouts:.0f} units ({stockouts/D*100:.1f}% of demand)")
print(f"  Orders placed:  {len(orders)}")
print(f"  CSL achieved:   {1 - (inv_arr == 0).mean():.3f}")

# ── Period review: (R, S) policy ─────────────────────────────────────────────
R  = 7          # review every 7 days
S_oup = d_daily * (R + L) + norm.ppf(csl) * sigma_d * np.sqrt(R + L)
print(f"\\n(R={R}, S) policy:")
print(f"  Order-up-to level S = {S_oup:.0f}")
print(f"  Safety stock = {norm.ppf(csl) * sigma_d * np.sqrt(R + L):.0f}")
print(f"  (Extra safety vs continuous review: "
      f"{norm.ppf(csl) * sigma_d * (np.sqrt(R+L) - np.sqrt(L)):.0f} units)")
`}
      />

      <ReferenceList
        references={[
          {
            author: 'Harris, F.W.',
            year: 1913,
            title: 'How many parts to make at once',
            journal: 'Factory, The Magazine of Management',
            volume: '10(2)',
            pages: '135–136',
          },
          {
            author: 'Silver, E.A., Pyke, D.F., & Thomas, D.J.',
            year: 2017,
            title: 'Inventory and Production Management in Supply Chains (4th ed.)',
            publisher: 'CRC Press',
          },
          {
            author: 'Zipkin, P.H.',
            year: 2000,
            title: 'Foundations of Inventory Management',
            publisher: 'McGraw-Hill',
          },
        ]}
      />
    </SectionLayout>
  );
}
