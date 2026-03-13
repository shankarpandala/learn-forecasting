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
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

function DrawdownChart() {
  const prices = [100, 103, 101, 107, 112, 109, 115, 108, 104, 110, 118, 114, 120, 116, 122, 119, 125, 121, 128, 135];
  let peak = 100;
  const data = prices.map((p, i) => {
    if (p > peak) peak = p;
    return { t: i, price: p, drawdown: -((peak - p) / peak * 100) };
  });

  return (
    <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Portfolio Value and Drawdown</h4>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" />
          <YAxis domain={[90, 140]} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#2563eb" dot={false} strokeWidth={2} name="Portfolio ($)" />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" />
          <YAxis domain={[-20, 2]} tickFormatter={v => `${v}%`} />
          <Tooltip formatter={v => [`${v.toFixed(1)}%`, 'Drawdown']} />
          <Area type="monotone" dataKey="drawdown" stroke="#ef4444" fill="#fee2e2" fillOpacity={0.6} name="Drawdown (%)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const riskCode = `import numpy as np
import pandas as pd
from scipy import stats

# ── 1. Value at Risk (VaR) — three methods ────────────────────────────────
np.random.seed(42)
returns = np.random.normal(0.001, 0.02, 252)   # daily returns, 1 year

# Parametric VaR (assumes normal distribution)
alpha = 0.05   # 95% VaR
mu, sigma = returns.mean(), returns.std()
var_param = -(mu + stats.norm.ppf(alpha) * sigma)
print(f"Parametric 95% VaR: {var_param:.4f} ({var_param*100:.2f}%)")

# Historical VaR
var_hist = -np.percentile(returns, alpha*100)
print(f"Historical 95% VaR:  {var_hist:.4f} ({var_hist*100:.2f}%)")

# Monte Carlo VaR
n_sim = 100_000
simulated = np.random.normal(mu, sigma, n_sim)
var_mc = -np.percentile(simulated, alpha*100)
print(f"Monte Carlo 95% VaR: {var_mc:.4f} ({var_mc*100:.2f}%)")

# ── 2. CVaR / Expected Shortfall ─────────────────────────────────────────
# Expected loss given that loss exceeds VaR
cvar_hist = -returns[returns < -var_hist].mean()
cvar_param = -(mu - sigma * stats.norm.pdf(stats.norm.ppf(alpha)) / alpha)
print(f"Historical 95% CVaR:  {cvar_hist:.4f}")
print(f"Parametric 95% CVaR:  {cvar_param:.4f}")

# ── 3. Kelly Criterion for position sizing ────────────────────────────────
def kelly_fraction(win_prob, win_return, loss_return):
    """Kelly fraction: fraction of capital to risk per trade."""
    b = win_return / abs(loss_return)     # odds ratio
    p = win_prob
    q = 1 - p
    kelly = (b*p - q) / b
    return kelly

# Example: win 60% of time, win 1.5%, lose 1%
k = kelly_fraction(0.60, 0.015, 0.010)
half_k = k / 2   # half-Kelly: common risk management practice
print(f"Kelly fraction: {k:.4f} ({k*100:.1f}% of capital per trade)")
print(f"Half-Kelly:     {half_k:.4f} ({half_k*100:.1f}%)")

# ── 4. Portfolio VaR with correlation ─────────────────────────────────────
n_assets = 3
weights = np.array([0.5, 0.3, 0.2])
# Correlation matrix (e.g., BTC, ETH, SOL)
corr = np.array([
    [1.00, 0.75, 0.65],
    [0.75, 1.00, 0.70],
    [0.65, 0.70, 1.00],
])
vols = np.array([0.05, 0.06, 0.07])        # daily volatilities
cov = np.outer(vols, vols) * corr
portfolio_var_val = weights @ cov @ weights
portfolio_vol = np.sqrt(portfolio_var_val)
portfolio_var = stats.norm.ppf(1-alpha) * portfolio_vol
print(f"Portfolio daily 95% VaR: {portfolio_var:.4f} ({portfolio_var*100:.2f}%)")

# Diversification benefit
individual_vars = stats.norm.ppf(1-alpha) * vols
weighted_var = weights @ individual_vars
diversification = (weighted_var - portfolio_var) / weighted_var
print(f"Diversification benefit: {diversification:.1%}")

# ── 5. Drawdown analysis ──────────────────────────────────────────────────
price_series = pd.Series((1 + returns).cumprod() * 100)
rolling_max = price_series.cummax()
drawdown = (price_series - rolling_max) / rolling_max

max_drawdown = drawdown.min()
max_dd_end   = drawdown.idxmin()
max_dd_start = price_series[:max_dd_end].idxmax()

print(f"Maximum Drawdown: {max_drawdown:.2%}")
print(f"Drawdown period: {max_dd_start} → {max_dd_end}")

# Calmar ratio: annualized return / max drawdown
annual_return = (price_series.iloc[-1] / price_series.iloc[0])**(252/len(price_series)) - 1
calmar = abs(annual_return / max_drawdown)
print(f"Calmar ratio: {calmar:.2f}")

# ── 6. Sharpe and Sortino ratios ──────────────────────────────────────────
rf = 0.0001    # daily risk-free rate (≈ 2.5% annualized)
excess_returns = returns - rf
sharpe = np.sqrt(252) * excess_returns.mean() / excess_returns.std()
downside_vol = np.sqrt(252) * np.std(excess_returns[excess_returns < 0])
sortino = np.sqrt(252) * excess_returns.mean() / downside_vol
print(f"Annualized Sharpe: {sharpe:.2f}")
print(f"Annualized Sortino: {sortino:.2f}")

# ── 7. Stress testing: historical scenario replay ─────────────────────────
STRESS_SCENARIOS = {
    'COVID Crash (Mar 2020)': -0.34,    # S&P 500 drawdown
    'Crypto Winter 2022':     -0.75,    # BTC drawdown
    'FTX Collapse (Nov 2022)': -0.28,   # BTC 1-week return
    'March 2020 VIX spike':   +3.0,     # volatility shock
}
portfolio_value = 100_000
for name, shock in STRESS_SCENARIOS.items():
    if shock < 0:
        loss = portfolio_value * abs(shock)
        print(f"{name}: portfolio loss = ${loss:,.0f} ({shock:.0%})")
`;

export default function RiskManagement() {
  return (
    <SectionLayout title="Risk Management for Trading" difficulty="advanced" readingTime={13}>
      <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-4">
        Professional risk management is what separates systematic traders who survive multi-year
        drawdowns from those who blow up. The core tools — Value at Risk, Expected Shortfall,
        Kelly sizing, and drawdown analysis — quantify tail risk and enforce position limits
        that preserve capital through adverse markets.
      </p>

      <DefinitionBlock term="Value at Risk (VaR)">
        The <InlineMath math="(1-\alpha)" />-level VaR is the loss not exceeded with probability
        <InlineMath math="1-\alpha" />:
        <BlockMath math="\text{VaR}_\alpha = -\inf\{x : P(L \leq x) \geq 1-\alpha\} = -F_L^{-1}(\alpha)" />
        For normally distributed returns: <InlineMath math="\text{VaR}_{0.05} = -(\mu + z_{0.05}\sigma) = -\mu + 1.645\sigma" />.
        A 95% 1-day VaR of 2% means: "With 95% confidence, we will not lose more than 2% today."
      </DefinitionBlock>

      <h2 className="text-2xl font-bold mt-8 mb-3">Three VaR Methods</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {[
          { name: 'Parametric', desc: 'Assumes normal distribution. Fast but underestimates tail risk.', formula: '-\\mu - z_\\alpha \\sigma', color: 'blue' },
          { name: 'Historical', desc: 'Uses empirical quantile of past returns. No distributional assumption, data-intensive.', formula: '-\\hat{F}^{-1}(\\alpha)', color: 'green' },
          { name: 'Monte Carlo', desc: 'Simulates thousands of paths. Most flexible, handles complex instruments.', formula: '-\\text{quantile}(\\{L^{(s)}\\}, \\alpha)', color: 'purple' },
        ].map(m => (
          <div key={m.name} className={`p-3 bg-${m.color}-50 dark:bg-${m.color}-900/20 border border-${m.color}-200 dark:border-${m.color}-800 rounded-xl`}>
            <div className={`font-semibold text-${m.color}-900 dark:text-${m.color}-300 mb-1`}>{m.name}</div>
            <div className="mb-2"><InlineMath math={m.formula} /></div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{m.desc}</div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-3">CVaR: Expected Shortfall</h2>
      <p className="mb-3">
        VaR tells you the threshold but not how bad things get beyond it. <strong>Conditional VaR
        (CVaR)</strong>, also called Expected Shortfall (ES), is the expected loss given that we
        are in the worst <InlineMath math="\alpha" /> fraction of outcomes:
      </p>
      <BlockMath math="\text{CVaR}_\alpha = \mathbb{E}[L \mid L > \text{VaR}_\alpha] = -\frac{1}{\alpha}\int_0^\alpha F_L^{-1}(u)\,du" />
      <p className="mb-3">
        For normal returns: <InlineMath math="\text{CVaR}_{0.05} = -\mu + \sigma \frac{\phi(z_{0.05})}{\alpha}" />
        where <InlineMath math="\phi" /> is the standard normal PDF. CVaR is always
        <InlineMath math="\geq \text{VaR}" /> and is a <strong>coherent risk measure</strong>
        (satisfies subadditivity — diversification always reduces portfolio CVaR).
      </p>

      <TheoremBlock title="Kelly Criterion">
        Given a bet with win probability <InlineMath math="p" />, win return <InlineMath math="b" />,
        and loss return <InlineMath math="-1" />, the Kelly fraction that maximizes long-run log wealth is:
        <BlockMath math="f^* = \frac{bp - (1-p)}{b} = \frac{p(b+1) - 1}{b}" />
        For continuous returns with mean <InlineMath math="\mu" /> and variance <InlineMath math="\sigma^2" />:
        <BlockMath math="f^* = \frac{\mu}{\sigma^2}" />
        <strong>Half-Kelly</strong> (<InlineMath math="f^*/2" />) is the standard practitioner
        choice — it reduces growth rate by only 25% while halving the variance and maximum
        expected drawdown.
      </TheoremBlock>

      <DrawdownChart />

      <h2 className="text-2xl font-bold mt-8 mb-3">Maximum Drawdown</h2>
      <p className="mb-3">
        Maximum drawdown (MDD) measures the largest peak-to-trough decline:
      </p>
      <BlockMath math="\text{MDD} = \max_{0 \leq t_1 \leq t_2 \leq T} \frac{V_{t_1} - V_{t_2}}{V_{t_1}}" />
      <p className="mb-3">
        The <strong>Calmar ratio</strong> normalizes returns by maximum drawdown:
        <InlineMath math="\text{Calmar} = \frac{R_{annual}}{|\text{MDD}|}" />. A Calmar above 1
        means the strategy returns more than it ever drawdown — a high bar in practice.
      </p>

      <NoteBlock title="Crypto Risk Amplification">
        Crypto assets exhibit dramatically higher volatility than traditional assets. Bitcoin's
        annualized volatility is typically 60–100% vs 15–20% for equities. Apply volatility
        scaling: if your equity strategy risks 2% per trade, scale to 0.3–0.5% for BTC.
        Kelly fractions should be adjusted accordingly — naive full-Kelly on crypto leads to ruin.
      </NoteBlock>

      <ExampleBlock title="Complete Risk Toolkit">
        <PythonCode code={riskCode} title="VaR, CVaR, Kelly, drawdown analysis" />
      </ExampleBlock>

      <WarningBlock title="VaR Limitations">
        VaR is not a coherent risk measure — it violates subadditivity, meaning a portfolio
        can have higher VaR than the sum of its parts. During crisis periods (fat tails,
        correlation breakdown), VaR systematically underestimates actual losses. Always
        complement VaR with: (1) CVaR, (2) stress testing against historical worst scenarios,
        and (3) scenario analysis for correlated drawdowns across positions.
      </WarningBlock>

      <ReferenceList references={[
        { title: 'Risk Management and Financial Institutions', authors: 'Hull, J.C.', year: 2018, venue: 'Wiley Finance, 5th ed.' },
        { title: 'A New Interpretation of Information Rate', authors: 'Kelly, J.L.', year: 1956, venue: 'Bell System Technical Journal, 35(4), 917–926' },
        { title: 'Coherent Measures of Risk', authors: 'Artzner, P., Delbaen, F., Eber, J.-M., Heath, D.', year: 1999, venue: 'Mathematical Finance, 9(3), 203–228' },
        { title: 'Advances in Financial Machine Learning', authors: 'López de Prado, M.', year: 2018, venue: 'Wiley' },
      ]} />
    </SectionLayout>
  );
}
