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
  Legend, ResponsiveContainer,
} from 'recharts';

function BassModelViz() {
  const [p, setP] = useState(0.03);
  const [q, setQ] = useState(0.38);
  const M = 1000;
  const data = [];
  let cumAdopters = 0;
  for (let t = 1; t <= 24; t++) {
    const remaining = M - cumAdopters;
    const adoptions = (p + q * (cumAdopters / M)) * remaining;
    cumAdopters += adoptions;
    data.push({ t, adoptions: Math.round(adoptions), cumulative: Math.round(cumAdopters) });
  }
  const peak = data.reduce((best, d) => d.adoptions > best.adoptions ? d : best, data[0]);

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold mb-2">Bass Diffusion Model — Interactive</h3>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Innovation p: <span className="font-bold text-blue-600">{p.toFixed(3)}</span>
          </label>
          <input type="range" min="0.001" max="0.1" step="0.001" value={p}
            onChange={e => setP(parseFloat(e.target.value))} className="w-full mt-1" />
          <p className="text-xs text-gray-500">External influence (advertising, PR)</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Imitation q: <span className="font-bold text-orange-600">{q.toFixed(2)}</span>
          </label>
          <input type="range" min="0.05" max="0.8" step="0.01" value={q}
            onChange={e => setQ(parseFloat(e.target.value))} className="w-full mt-1" />
          <p className="text-xs text-gray-500">Social contagion (word-of-mouth)</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-2">M = 1,000 · Peak at period {peak.t} ({peak.adoptions} units)</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" label={{ value: 'Period', position: 'insideBottom', offset: -10 }} />
          <YAxis yAxisId="l" label={{ value: 'Sales', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="r" orientation="right" label={{ value: 'Cumulative', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Line yAxisId="l" dataKey="adoptions" stroke="#3b82f6" strokeWidth={2} dot={false} name="Period Sales" />
          <Line yAxisId="r" dataKey="cumulative" stroke="#f59e0b" strokeWidth={2} dot={false} name="Cumulative" strokeDasharray="5 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function NewProductForecasting() {
  return (
    <SectionLayout
      title="New Product Forecasting"
      subject="Supply Chain Forecasting"
      difficulty="advanced"
      readingTime={12}
    >
      <p>
        New product forecasting is among the hardest problems in supply chain management. By definition, there
        is no historical demand data for the new SKU. Errors translate directly into lost sales (understock) or
        write-offs (overstock), and the stakes are highest in the first weeks after launch. The toolbox includes
        diffusion models (theory-driven), analogical forecasting (data-driven via proxy), and Bayesian updating
        as early sales arrive.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-3">Bass Diffusion Model</h2>
      <p>
        The Bass model (1969) describes the adoption of new products as a mixture of innovation (external
        influence from advertising) and imitation (social contagion from existing adopters). It was originally
        developed for consumer durables but applies broadly to technology, pharmaceuticals, and industrial products.
      </p>

      <DefinitionBlock title="Bass Diffusion Model">
        Let <InlineMath math="N(t)" /> be cumulative adopters at time <InlineMath math="t" /> and
        <InlineMath math="M" /> the market potential. The rate of adoption is:
        <BlockMath math="\frac{dN}{dt} = \left(p + q\frac{N(t)}{M}\right)(M - N(t))" />
        where <InlineMath math="p" /> is the coefficient of innovation and <InlineMath math="q" /> is the
        coefficient of imitation. The closed-form period sales solution is:
        <BlockMath math="S(t) = M \cdot \frac{(p+q)^2/p \cdot e^{-(p+q)t}}{\left(1 + (q/p)e^{-(p+q)t}\right)^2}" />
        Typical empirical ranges: <InlineMath math="p \in [0.01, 0.03]" />,{' '}
        <InlineMath math="q \in [0.3, 0.5]" />.
      </DefinitionBlock>

      <BassModelViz />

      <TheoremBlock title="Peak Adoption Time">
        The Bass model predicts peak period sales at:
        <BlockMath math="t^* = \frac{\ln(q/p)}{p + q}" />
        For consumer electronics (p=0.02, q=0.4), peak occurs at <InlineMath math="t^* \approx 14" /> periods.
        This gives supply chain planners a specific horizon for maximum inventory need.
      </TheoremBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Analogical Forecasting</h2>
      <p>
        When Bass parameters cannot be estimated, analogical forecasting uses demand trajectories of similar
        established products as proxies. The process:
      </p>
      <ol className="list-decimal ml-5 space-y-1 text-sm mt-2">
        <li>Select analog products based on market segment, price point, and category similarity</li>
        <li>Index analog launch trajectories to a common base (Week 1 = 100)</li>
        <li>Aggregate via similarity-weighted average</li>
        <li>Scale the aggregate index to the new product's estimated market potential</li>
        <li>Update analog weights as early sales data arrives</li>
      </ol>

      <ExampleBlock title="Fashion Retail — Analogical Forecasting">
        A retailer launches a new sneaker style with no history. Five analogous SKUs from prior seasons are
        selected based on similar price tier and demographic targeting. Similarity weights: three close analogs
        at 25% each, two distant analogs at 12.5% each. The weighted trajectory projects a first-season
        range of 800–2,400 units at 90% confidence. This is wide, but sufficient to determine initial buy
        quantities (hedge conservative) and identify when to trigger a reorder (week 3–4 signal).
      </ExampleBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Bayesian Updating with Early Sales</h2>
      <p>
        Bayesian methods treat the pre-launch forecast as a prior distribution and update it sequentially as
        each week of sales data arrives. The posterior uncertainty naturally shrinks and reorder decisions
        can be triggered when the posterior mean shifts beyond a planning threshold.
      </p>

      <DefinitionBlock title="Normal-Normal Conjugate Update">
        If the prior on total demand is <InlineMath math="M \sim \mathcal{N}(\mu_0, \sigma_0^2)" /> and
        we observe <InlineMath math="n" /> periods with mean <InlineMath math="\bar{y}" /> and
        known noise <InlineMath math="\sigma^2" />, the posterior is:
        <BlockMath math="\mu_n = \frac{\sigma^2 \mu_0 + n\sigma_0^2 \bar{y}}{\sigma^2 + n\sigma_0^2}, \quad \sigma_n^2 = \frac{\sigma^2 \sigma_0^2}{\sigma^2 + n\sigma_0^2}" />
        The posterior mean is a precision-weighted average of prior and observed data. As
        <InlineMath math="n \to \infty" />, the prior is overwhelmed by data.
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Managing Forecast Uncertainty</h2>
      <ul className="list-disc ml-5 space-y-1 text-sm mt-2">
        <li><strong>Scenario planning</strong>: Bear/Base/Bull cases corresponding to low, median, high adoption curves</li>
        <li><strong>Option value of flexibility</strong>: Price the cost of expedited freight or secondary suppliers vs overstock write-offs</li>
        <li><strong>Rolling reviews</strong>: Weekly re-forecast in first month, monthly thereafter</li>
        <li><strong>Demand sensing</strong>: Pre-orders, social media engagement, search volume as leading indicators</li>
        <li><strong>Safe harbors</strong>: For truly novel products, accept wide intervals and use modular production</li>
      </ul>

      <NoteBlock>
        Bass model fitting on partial data systematically underestimates M and overestimates adoption speed.
        When fitting to fewer than 12 periods of sales, constrain q/p to a ratio consistent with analogous
        products rather than fitting freely.
      </NoteBlock>

      <WarningBlock>
        Analogical forecasting suffers from selection bias. Practitioners naturally select analogs that
        performed well (survivorship bias). Explicitly include failure-mode analogs — products that launched
        and quickly declined — to counteract optimism bias in the aggregate trajectory.
      </WarningBlock>

      <PythonCode
        title="Bass Model Fitting and Analogical Forecasting"
        code={`import numpy as np
import pandas as pd
from scipy.optimize import curve_fit

# ── Bass model functions ──────────────────────────────────────────────────────
def bass_cumulative(t, M, p, q):
    exp_term = np.exp(-(p + q) * t)
    return M * (1 - exp_term) / (1 + (q / p) * exp_term)

def bass_period_sales(t, M, p, q):
    exp_term = np.exp(-(p + q) * t)
    return M * (p + q)**2 * exp_term / p / (1 + (q / p) * exp_term)**2

# ── Fit Bass model to analog product historical sales ────────────────────────
np.random.seed(42)
t_hist  = np.arange(1, 25, dtype=float)
M_true, p_true, q_true = 5000, 0.025, 0.35
true_sales   = bass_period_sales(t_hist, M_true, p_true, q_true)
observed     = np.maximum(true_sales + np.random.normal(0, 80, len(t_hist)), 0)
cum_observed = np.cumsum(observed)

popt, pcov = curve_fit(
    bass_cumulative, t_hist, cum_observed,
    p0=[5000, 0.03, 0.3],
    bounds=([100, 0.001, 0.01], [1e6, 0.5, 2.0]),
    maxfev=10_000,
)
M_fit, p_fit, q_fit = popt
t_peak = np.log(q_fit / p_fit) / (p_fit + q_fit)

print(f"Fitted Bass parameters:")
print(f"  M = {M_fit:,.0f}  (true: {M_true:,})")
print(f"  p = {p_fit:.4f}  (true: {p_true})")
print(f"  q = {q_fit:.4f}  (true: {q_true})")
print(f"  Peak adoption period: {t_peak:.1f}")

# ── Forecast future periods ──────────────────────────────────────────────────
t_future = np.arange(25, 37, dtype=float)
fc = bass_period_sales(t_future, M_fit, p_fit, q_fit)
print(f"\\nForecast periods 25-36: {fc.round(0).astype(int)}")

# ── Analogical forecasting ────────────────────────────────────────────────────
analogs = {
    'Analog_A': bass_period_sales(np.arange(1, 25), 4500, 0.02, 0.40),
    'Analog_B': bass_period_sales(np.arange(1, 25), 5500, 0.03, 0.33),
    'Analog_C': bass_period_sales(np.arange(1, 25), 3000, 0.04, 0.30),
}
weights = {'Analog_A': 0.50, 'Analog_B': 0.30, 'Analog_C': 0.20}

# Index to base period (period 1)
indexed = {}
for name, arr in analogs.items():
    base = arr[0] if arr[0] > 0 else arr[arr > 0][0]
    indexed[name] = arr / base

# Weighted average index
avg_index = sum(indexed[n] * w for n, w in weights.items())

# Scale to new product's estimated market potential
SCALE = 300   # new product period-1 expectation
analog_fc = avg_index * SCALE
print(f"\\nAnalogical forecast (periods 1-16): {analog_fc[:16].round(0).astype(int)}")

# ── Bayesian update ───────────────────────────────────────────────────────────
def bayesian_update(prior_mu, prior_sigma, obs, noise_sigma):
    n = len(obs)
    obs_mean = np.mean(obs)
    post_var  = 1 / (1/prior_sigma**2 + n/noise_sigma**2)
    post_mean = post_var * (prior_mu/prior_sigma**2 + n*obs_mean/noise_sigma**2)
    return post_mean, np.sqrt(post_var)

prior_mu, prior_sigma = 5000, 1500
early_data = np.array([312, 289, 305, 278])   # 4 weeks of real sales
post_mu, post_sigma = bayesian_update(prior_mu, prior_sigma, early_data, noise_sigma=200)

print(f"\\nBayesian update after 4 weeks of sales:")
print(f"  Prior:     M ~ N({prior_mu:,}, {prior_sigma})")
print(f"  Posterior: M ~ N({post_mu:,.0f}, {post_sigma:,.0f})")
print(f"  90% CI:    [{post_mu - 1.645*post_sigma:,.0f}, {post_mu + 1.645*post_sigma:,.0f}]")
`}
      />

      <ReferenceList
        references={[
          {
            author: 'Bass, F.M.',
            year: 1969,
            title: 'A new product growth model for consumer durables',
            journal: 'Management Science',
            volume: '15(5)',
            pages: '215–227',
          },
          {
            author: 'Kahn, K.B.',
            year: 2006,
            title: 'New Product Forecasting: An Applied Approach',
            publisher: 'M.E. Sharpe',
          },
          {
            author: 'Jiang, R., Bass, F.M., & Bass, P.I.',
            year: 2006,
            title: 'Virtual Bass model and the left-hand data-truncation bias in diffusion of innovation studies',
            journal: 'International Journal of Research in Marketing',
            volume: '23(1)',
            pages: '93–106',
          },
        ]}
      />
    </SectionLayout>
  );
}
