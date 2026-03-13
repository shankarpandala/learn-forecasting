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

// Vol smile data
const smileData = [
  { strike: 80, iv_1m: 28.5, iv_3m: 25.2, iv_6m: 23.8 },
  { strike: 85, iv_1m: 26.1, iv_3m: 23.8, iv_6m: 22.7 },
  { strike: 90, iv_1m: 24.0, iv_3m: 22.5, iv_6m: 21.9 },
  { strike: 95, iv_1m: 22.2, iv_3m: 21.4, iv_6m: 21.3 },
  { strike: 100, iv_1m: 20.8, iv_3m: 20.6, iv_6m: 20.8 },
  { strike: 105, iv_1m: 19.9, iv_3m: 20.1, iv_6m: 20.5 },
  { strike: 110, iv_1m: 19.5, iv_3m: 19.8, iv_6m: 20.3 },
  { strike: 115, iv_1m: 19.8, iv_3m: 19.9, iv_6m: 20.4 },
  { strike: 120, iv_1m: 20.8, iv_3m: 20.4, iv_6m: 20.7 },
];

export default function ImpliedVol() {
  return (
    <SectionLayout
      title="Implied Volatility and Vol Surface"
      subject="Financial Forecasting"
      difficulty="expert"
      readingTime={14}
    >
      <p>
        Implied volatility (IV) is the volatility value that, when plugged into an options pricing model,
        produces the observed market price. Unlike realized volatility (backward-looking), implied volatility
        is forward-looking — it represents the market's consensus forecast of future volatility over the
        option's lifetime. The vol surface is the three-dimensional structure of IV across strikes (moneyness)
        and maturities.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-3">Black-Scholes Implied Volatility</h2>

      <DefinitionBlock title="Black-Scholes Model">
        The Black-Scholes formula prices a European call option as:
        <BlockMath math="C = S_0 \Phi(d_1) - K e^{-rT} \Phi(d_2)" />
        <BlockMath math="d_1 = \frac{\ln(S_0/K) + (r + \sigma^2/2)T}{\sigma\sqrt{T}}, \quad d_2 = d_1 - \sigma\sqrt{T}" />
        where <InlineMath math="S_0" /> is spot, <InlineMath math="K" /> is strike, <InlineMath math="T" />
        is time to expiry, <InlineMath math="r" /> is risk-free rate, and <InlineMath math="\sigma" /> is
        volatility. Implied volatility is the <InlineMath math="\sigma" /> that equates the model price
        to the observed market price — found numerically (no closed form).
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Volatility Smile and Skew</h2>
      <p>
        Black-Scholes assumes constant volatility across strikes. In reality, IV varies — this variation is
        the "vol smile" or "vol skew":
      </p>
      <ul className="list-disc ml-5 space-y-1 text-sm mt-2">
        <li><strong>Vol skew (equity)</strong>: IV is higher for low-strike (put) options than high-strike (call) options.
        Left tail risk (crash fear) drives up put prices relative to BS.</li>
        <li><strong>Vol smile (FX, commodities)</strong>: IV is symmetric around ATM, higher for both OTM puts and calls.
        Both tails are expensive.</li>
      </ul>

      <div className="my-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Volatility Smile / Skew Across Maturities</h3>
        <p className="text-sm text-gray-600 mb-3">
          Equity vol skew: OTM puts (left strikes) have higher IV due to crash fear. Skew flattens
          with maturity as more time allows mean reversion.
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={smileData} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="strike" label={{ value: 'Strike (spot = 100)', position: 'insideBottom', offset: -10 }} />
            <YAxis label={{ value: 'Implied Vol %', angle: -90, position: 'insideLeft' }} domain={[18, 30]} />
            <Tooltip />
            <Legend verticalAlign="top" />
            <Line dataKey="iv_1m" stroke="#ef4444" strokeWidth={2} dot={false} name="1M IV" />
            <Line dataKey="iv_3m" stroke="#3b82f6" strokeWidth={2} dot={false} name="3M IV" />
            <Line dataKey="iv_6m" stroke="#22c55e" strokeWidth={2} dot={false} name="6M IV" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-3">VIX Construction</h2>

      <DefinitionBlock title="VIX — Model-Free Volatility Index">
        The VIX measures 30-day implied volatility of the S&P 500 using a model-free formula:
        <BlockMath math="\text{VIX}^2 = \frac{2}{T} \sum_i \frac{\Delta K_i}{K_i^2} e^{rT} Q(K_i) - \frac{1}{T}\left[\frac{F}{K_0} - 1\right]^2" />
        where <InlineMath math="Q(K_i)" /> is the option price (put for <InlineMath math="K < F" />,
        call for <InlineMath math="K > F" />), <InlineMath math="F" /> is the forward price,
        <InlineMath math="K_0" /> is the first strike below <InlineMath math="F" />, and the sum runs
        over all quoted strikes. VIX captures the entire vol surface, not just ATM vol.
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">SABR Model</h2>

      <DefinitionBlock title="SABR Stochastic Volatility Model">
        SABR (Hagan et al. 2002) models the vol surface analytically with four parameters:
        <BlockMath math="dF = \sigma F^\beta dW_1, \quad d\sigma = \nu \sigma dW_2, \quad \mathbb{E}[dW_1 dW_2] = \rho \, dt" />
        where <InlineMath math="\beta \in [0,1]" /> controls the backbone shape (0=normal, 1=log-normal),
        <InlineMath math="\nu" /> is vol-of-vol, and <InlineMath math="\rho" /> is the correlation
        (equity: typically <InlineMath math="\rho < 0" /> for negative skew). SABR provides an
        analytic approximation for the IV surface that fits market smiles well for liquid options.
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Forecasting with Implied Volatility</h2>
      <p>
        IV is a forward-looking signal with several forecasting applications:
      </p>
      <ul className="list-disc ml-5 space-y-2 text-sm mt-2">
        <li><strong>Volatility forecasting</strong>: IV is a biased but efficient predictor of future RV.
        The variance risk premium (IV² − RV) is systematically positive (options are expensive) — shorting
        volatility generates a premium.</li>
        <li><strong>Return forecasting</strong>: The vol skew (SKEW index) and term structure of IV predict
        future equity returns at monthly horizons. Steeper skew predicts lower returns.</li>
        <li><strong>Cross-asset signals</strong>: Credit spreads and IV are co-integrated — IV term structure
        inversion (short-term IV > long-term IV) signals near-term stress.</li>
      </ul>

      <NoteBlock>
        The variance risk premium (VRP) is the difference between risk-neutral variance (IV²) and physical
        variance (RV): VRP = IV² − RV. It is persistently positive for equity index options (~3–5 vol points
        per year) because investors pay to hedge downside risk. Short volatility strategies harvest this
        premium but have severe left-tail risk (massive losses in market crashes). VRP estimation requires
        careful handling of maturity and moneyness alignment.
      </NoteBlock>

      <WarningBlock>
        Implied volatility from thinly traded options contains significant liquidity premium and bid-ask
        noise. Always use mid-price quotes and filter out options with zero open interest or abnormally wide
        spreads. For interpolation within the surface, use cubic spline or SVI (Stochastic Volatility
        Inspired) parameterization rather than linear interpolation, which can produce arbitrage.
      </WarningBlock>

      <PythonCode
        title="Black-Scholes Implied Vol and Vol Surface"
        code={`import numpy as np
from scipy.stats import norm
from scipy.optimize import brentq
import pandas as pd

# ── Black-Scholes pricing ─────────────────────────────────────────────────────
def bs_call(S, K, T, r, sigma):
    """Black-Scholes call price."""
    if T <= 0 or sigma <= 0:
        return max(S - K * np.exp(-r * T), 0)
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    return S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)

def bs_put(S, K, T, r, sigma):
    """Black-Scholes put price (put-call parity)."""
    c = bs_call(S, K, T, r, sigma)
    return c - S + K * np.exp(-r * T)

def bs_vega(S, K, T, r, sigma):
    """Black-Scholes vega."""
    if T <= 0 or sigma <= 0:
        return 0
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    return S * norm.pdf(d1) * np.sqrt(T)

# ── Implied volatility via Brent's method ────────────────────────────────────
def implied_vol(market_price, S, K, T, r, option_type='call', tol=1e-8):
    """
    Compute implied volatility by inverting BS formula.
    Returns np.nan if no solution found.
    """
    pricer = bs_call if option_type == 'call' else bs_put

    # Bounds check: option must be worth at least intrinsic
    intrinsic = max(S - K * np.exp(-r * T), 0) if option_type == 'call' \
                else max(K * np.exp(-r * T) - S, 0)
    if market_price <= intrinsic + 1e-10:
        return np.nan

    try:
        iv = brentq(
            lambda sigma: pricer(S, K, T, r, sigma) - market_price,
            a=1e-6, b=10.0, xtol=tol, full_output=False
        )
        return iv
    except ValueError:
        return np.nan

# ── Newton-Raphson IV (faster for well-behaved cases) ────────────────────────
def implied_vol_nr(market_price, S, K, T, r, option_type='call',
                   max_iter=50, tol=1e-8):
    """Newton-Raphson implied vol solver."""
    sigma = 0.25   # initial guess: 25%
    pricer = bs_call if option_type == 'call' else bs_put
    for _ in range(max_iter):
        price  = pricer(S, K, T, r, sigma)
        vega   = bs_vega(S, K, T, r, sigma)
        if abs(vega) < 1e-12:
            return np.nan
        sigma -= (price - market_price) / vega
        sigma  = max(sigma, 1e-8)
        if abs(price - market_price) < tol:
            return sigma
    return sigma

# ── Build a vol surface ───────────────────────────────────────────────────────
S, r = 100.0, 0.05
# Simulate market option prices with a known skewed vol structure
def market_vol(K, T):
    """Hypothetical true vol surface with negative skew."""
    atm_vol  = 0.20
    skew     = -0.15 * (K/S - 1)          # linear skew
    term     = 0.02 * np.log(T / 0.5 + 1) # term structure
    return max(atm_vol + skew + term, 0.05)

strikes     = np.arange(80, 125, 5, dtype=float)
maturities  = [1/12, 3/12, 6/12, 1.0]   # 1M, 3M, 6M, 1Y

surface = {}
for T in maturities:
    ivs = []
    for K in strikes:
        true_vol  = market_vol(K, T)
        call_px   = bs_call(S, K, T, r, true_vol) + np.random.normal(0, 0.02)
        call_px   = max(call_px, 0.01)
        iv_recovered = implied_vol(call_px, S, K, T, r, 'call')
        ivs.append(iv_recovered)
    surface[f'T={T:.2f}'] = ivs

surf_df = pd.DataFrame(surface, index=strikes)
surf_df.index.name = 'Strike'
print("Implied Volatility Surface:")
print((surf_df * 100).round(1).to_string())

# ── VIX-style index calculation ───────────────────────────────────────────────
def compute_vix_style(strikes, ivs, S, T, r):
    """Approximate VIX calculation from a list of (K, IV) pairs."""
    F = S * np.exp(r * T)
    K0_idx = np.searchsorted(strikes, F, side='right') - 1
    K0 = strikes[max(K0_idx, 0)]

    sigma2 = 0.0
    for i, (K, iv) in enumerate(zip(strikes, ivs)):
        if iv is None or np.isnan(iv):
            continue
        dK = (strikes[i+1] - strikes[i-1]) / 2 if 0 < i < len(strikes)-1 else (strikes[1] - strikes[0])
        opt_type = 'put' if K < F else ('call' if K > F else 'call')
        price = bs_put(S, K, T, r, iv) if opt_type == 'put' else bs_call(S, K, T, r, iv)
        sigma2 += (2 / T) * (dK / K**2) * np.exp(r * T) * price

    sigma2 -= (1 / T) * (F / K0 - 1)**2
    return np.sqrt(max(sigma2, 0)) * 100

T_vix = 30 / 365
ivs_vix = [market_vol(K, T_vix) for K in strikes]
vix = compute_vix_style(strikes, ivs_vix, S, T_vix, r)
print(f"\\nVIX-style index (30-day): {vix:.1f}")
`}
      />

      <ReferenceList
        references={[
          {
            author: 'Black, F. & Scholes, M.',
            year: 1973,
            title: 'The pricing of options and corporate liabilities',
            journal: 'Journal of Political Economy',
            volume: '81(3)',
            pages: '637–654',
          },
          {
            author: 'Hagan, P.S., Kumar, D., Lesniewski, A.S., & Woodward, D.E.',
            year: 2002,
            title: 'Managing smile risk',
            journal: 'Wilmott Magazine',
            volume: 'September',
            pages: '84–108',
          },
          {
            author: 'Gatheral, J.',
            year: 2006,
            title: 'The Volatility Surface: A Practitioner\'s Guide',
            publisher: 'Wiley',
          },
        ]}
      />
    </SectionLayout>
  );
}
