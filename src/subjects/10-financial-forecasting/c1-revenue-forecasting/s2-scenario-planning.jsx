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
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

function MonteCarloViz() {
  const [nSims] = useState(500);
  const quarters = 8;
  const base = 10;
  const growthMu = 0.05;
  const growthSd = 0.08;

  // Pre-compute percentiles
  const data = [];
  for (let q = 0; q < quarters; q++) {
    const revenues = Array.from({ length: nSims }, () => {
      let r = base;
      for (let i = 0; i <= q; i++) {
        r *= 1 + (growthMu + growthSd * (Math.random() < 0.5 ? 1 : -1) * Math.abs(randNorm()));
      }
      return r;
    }).sort((a, b) => a - b);
    data.push({
      quarter: `Q${q + 1}`,
      p10: +(revenues[Math.floor(nSims * 0.1)].toFixed(2)),
      p25: +(revenues[Math.floor(nSims * 0.25)].toFixed(2)),
      p50: +(revenues[Math.floor(nSims * 0.5)].toFixed(2)),
      p75: +(revenues[Math.floor(nSims * 0.75)].toFixed(2)),
      p90: +(revenues[Math.floor(nSims * 0.9)].toFixed(2)),
    });
  }

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold mb-1">Monte Carlo Revenue Fan Chart (8 Quarters)</h3>
      <p className="text-sm text-gray-600 mb-3">
        Base revenue $10M. Growth ~ N(5%, 8%). Shaded bands show P10–P90 and P25–P75 confidence intervals.
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis label={{ value: 'Revenue ($M)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Area dataKey="p90" fill="#dbeafe" stroke="none" name="P90" stackId="a" />
          <Area dataKey="p75" fill="#93c5fd" stroke="none" name="P75" stackId="b" />
          <Area dataKey="p50" fill="#3b82f6" stroke="#1d4ed8" name="Median" fillOpacity={0.6} />
          <Line dataKey="p10" stroke="#1e40af" strokeDasharray="4 2" dot={false} name="P10" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function randNorm() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export default function ScenarioPlanning() {
  return (
    <SectionLayout
      title="Scenario Planning and Simulation"
      subject="Financial Forecasting"
      difficulty="intermediate"
      readingTime={11}
    >
      <p>
        Point forecasts are a fiction: the future is uncertain and a single number conveys false precision.
        Scenario planning and Monte Carlo simulation replace point forecasts with distributions, ranges, and
        structured "what-if" analyses. For financial planning, this shift enables better resource allocation,
        risk-adjusted decision making, and stress-testing of strategic plans.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-3">Structured Scenario Analysis</h2>

      <DefinitionBlock title="Bear / Base / Bull Scenarios">
        The simplest scenario framework uses three cases:
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li><strong>Bull (upside)</strong>: Favorable macro, strong product-market fit, competitive wins. ~20% probability</li>
          <li><strong>Base</strong>: Most likely outcome given current trajectory. ~60% probability</li>
          <li><strong>Bear (downside)</strong>: Macro headwinds, competitive pressure, churn increase. ~20% probability</li>
        </ul>
        The expected value is the probability-weighted average:
        <BlockMath math="\mathbb{E}[\text{Revenue}] = p_{\text{bull}} R_{\text{bull}} + p_{\text{base}} R_{\text{base}} + p_{\text{bear}} R_{\text{bear}}" />
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Monte Carlo Revenue Simulation</h2>
      <p>
        Monte Carlo simulation replaces discrete scenarios with continuous probability distributions. Each
        driver (growth rate, churn, average contract value) is modeled as a distribution, and thousands of
        paths are simulated to build the full revenue distribution.
      </p>

      <MonteCarloViz />

      <TheoremBlock title="Revenue as a Function of Stochastic Drivers">
        If quarterly revenue growth follows <InlineMath math="g_t \sim \mathcal{N}(\mu_g, \sigma_g^2)" />,
        then projected revenue at quarter <InlineMath math="T" /> is:
        <BlockMath math="R_T = R_0 \prod_{t=1}^{T}(1 + g_t)" />
        This is a geometric Brownian motion structure. The distribution of <InlineMath math="\ln R_T" /> is
        approximately normal with mean <InlineMath math="\ln R_0 + T\mu_g" /> and variance
        <InlineMath math="T\sigma_g^2" />, so <InlineMath math="R_T" /> is log-normally distributed.
        The 90% prediction interval widens as <InlineMath math="\sqrt{T}" /> — uncertainty grows with horizon.
      </TheoremBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Sensitivity Analysis</h2>
      <p>
        Sensitivity (or "tornado") analysis identifies which drivers most impact the forecast. For each
        driver, it asks: if this input moves from its P10 to P90 value, how much does the revenue forecast change?
      </p>

      <ExampleBlock title="SaaS Revenue Sensitivity">
        For a SaaS company with $10M ARR, a sensitivity analysis reveals:
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li><strong>Net Revenue Retention (NRR)</strong>: ±15 points → ±$1.8M revenue impact (highest lever)</li>
          <li><strong>New logo win rate</strong>: ±20 points → ±$0.9M impact</li>
          <li><strong>Average deal size</strong>: ±25% → ±$0.7M impact</li>
          <li><strong>Sales cycle length</strong>: ±2 weeks → ±$0.3M impact</li>
        </ul>
        The NRR finding focuses management attention on customer success over new logo hunting.
      </ExampleBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Scenario Weighting and Uncertainty Quantification</h2>
      <p>
        Scenario probabilities should not be uniform. They should reflect:
      </p>
      <ul className="list-disc ml-5 space-y-1 text-sm mt-2">
        <li><strong>Historical base rates</strong>: How often have companies in this industry hit the bull case?</li>
        <li><strong>Current leading indicators</strong>: Pipeline coverage, customer health scores, macro signals</li>
        <li><strong>Expert elicitation</strong>: Structured expert judgment via the Delphi method or Bayesian prior elicitation</li>
        <li><strong>Calibration</strong>: Track historical scenario accuracy and adjust future probability weights</li>
      </ul>

      <NoteBlock>
        A common mistake in scenario planning is making scenarios "different stories" (narrative) rather than
        "different parameter values" (quantitative). Ensure each scenario maps to specific, measurable driver
        values that can be tracked in real time. This allows early detection of which scenario is materializing.
      </NoteBlock>

      <WarningBlock>
        Correlation between drivers is critical but often ignored in simple Monte Carlo simulations. Revenue,
        churn, and new logo rates are correlated with macro conditions. Sampling them independently
        underestimates tail risk (the bear scenario). Use a multivariate distribution (e.g., copula or
        Cholesky decomposition) to capture correlations.
      </WarningBlock>

      <PythonCode
        title="Monte Carlo Revenue Simulation"
        code={`import numpy as np
import pandas as pd
from scipy.stats import norm, lognorm
import matplotlib.pyplot as plt

# ── SaaS revenue simulation model ────────────────────────────────────────────
def simulate_saas_revenue(
    arr_start: float = 10.0,       # starting ARR ($M)
    n_quarters: int  = 8,          # forecast horizon
    n_sims: int      = 10_000,     # Monte Carlo paths
    # Growth drivers (mean, std) per quarter
    new_logo_mu: float   = 1.2,    # $M new ARR per quarter
    new_logo_sd: float   = 0.5,
    nrr_mu: float        = 1.10,   # net revenue retention (>1 = expansion)
    nrr_sd: float        = 0.06,
    seed: int            = 42,
) -> pd.DataFrame:
    """
    Simulate quarterly ARR paths for a SaaS business.
    ARR_t = ARR_{t-1} * NRR_t + NewARR_t
    """
    rng = np.random.default_rng(seed)

    arr_paths = np.zeros((n_sims, n_quarters + 1))
    arr_paths[:, 0] = arr_start

    for q in range(n_quarters):
        nrr     = rng.normal(nrr_mu, nrr_sd, n_sims).clip(0.7, 1.5)
        new_arr = rng.normal(new_logo_mu, new_logo_sd, n_sims).clip(0)
        arr_paths[:, q + 1] = arr_paths[:, q] * nrr + new_arr

    # Compute percentiles across simulations
    quarters = [f'Q{q}' for q in range(n_quarters + 1)]
    pctls = [5, 10, 25, 50, 75, 90, 95]
    results = pd.DataFrame(
        np.percentile(arr_paths, pctls, axis=0).T,
        columns=[f'P{p}' for p in pctls],
        index=quarters
    )
    results['mean'] = arr_paths.mean(axis=0)
    results['std']  = arr_paths.std(axis=0)
    return results, arr_paths

results, paths = simulate_saas_revenue()

print("ARR Forecast (Monte Carlo percentiles, $M):")
print(results[['P10', 'P25', 'P50', 'P75', 'P90']].round(2).to_string())

# ── Scenario analysis: 3 named scenarios ─────────────────────────────────────
scenarios = {
    'Bear': dict(nrr_mu=1.02, nrr_sd=0.04, new_logo_mu=0.6, new_logo_sd=0.2),
    'Base': dict(nrr_mu=1.10, nrr_sd=0.06, new_logo_mu=1.2, new_logo_sd=0.5),
    'Bull': dict(nrr_mu=1.18, nrr_sd=0.05, new_logo_mu=2.0, new_logo_sd=0.6),
}
scenario_probs = {'Bear': 0.20, 'Base': 0.60, 'Bull': 0.20}

scenario_p50 = {}
for name, params in scenarios.items():
    res, _ = simulate_saas_revenue(**params)
    scenario_p50[name] = res['P50'].values

ev = sum(scenario_probs[n] * scenario_p50[n] for n in scenarios)

print("\\nScenario P50 ARR at Q8 ($M):")
for name in scenarios:
    print(f"  {name}: {scenario_p50[name][-1]:.2f}")
print(f"  Expected Value (prob-weighted): {ev[-1]:.2f}")

# ── Sensitivity analysis ──────────────────────────────────────────────────────
def arr_at_horizon(nrr_mu, new_logo_mu, n_quarters=8, n_sims=5000):
    """Return median ARR at horizon for given parameters."""
    rng = np.random.default_rng(0)
    arr = np.full(n_sims, 10.0)
    for _ in range(n_quarters):
        nrr     = rng.normal(nrr_mu, 0.06, n_sims).clip(0.7, 1.5)
        new_arr = rng.normal(new_logo_mu, 0.5, n_sims).clip(0)
        arr     = arr * nrr + new_arr
    return np.median(arr)

base_arr = arr_at_horizon(1.10, 1.20)
sensitivities = {
    'NRR +10pp': arr_at_horizon(1.20, 1.20) - base_arr,
    'NRR -10pp': arr_at_horizon(1.00, 1.20) - base_arr,
    'New logo +50%': arr_at_horizon(1.10, 1.80) - base_arr,
    'New logo -50%': arr_at_horizon(1.10, 0.60) - base_arr,
}

print("\\nSensitivity Analysis (delta ARR at Q8 vs base):")
for k, v in sorted(sensitivities.items(), key=lambda x: abs(x[1]), reverse=True):
    print(f"  {k:<25}: {v:+.2f}M")
`}
      />

      <ReferenceList
        references={[
          {
            author: 'Dixit, A.K. & Pindyck, R.S.',
            year: 1994,
            title: 'Investment under Uncertainty',
            publisher: 'Princeton University Press',
          },
          {
            author: 'Glasserman, P.',
            year: 2004,
            title: 'Monte Carlo Methods in Financial Engineering',
            publisher: 'Springer',
          },
        ]}
      />
    </SectionLayout>
  );
}
