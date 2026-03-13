import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const momentumData = [
  { month: 'Jan', winner: 2.3, loser: -1.8, spread: 4.1 },
  { month: 'Feb', winner: 1.9, loser: -2.1, spread: 4.0 },
  { month: 'Mar', winner: -1.2, loser: -3.5, spread: 2.3 },
  { month: 'Apr', winner: 3.1, loser: 0.4, spread: 2.7 },
  { month: 'May', winner: 2.8, loser: -1.5, spread: 4.3 },
  { month: 'Jun', winner: 1.5, loser: -2.8, spread: 4.3 },
];

const factorData = [
  { factor: 'Momentum (12-1)', t_stat: 4.8 },
  { factor: 'Value (B/M)', t_stat: 3.9 },
  { factor: 'Size (SMB)', t_stat: 3.1 },
  { factor: 'Quality (ROE)', t_stat: 2.8 },
  { factor: 'Low Vol', t_stat: 2.5 },
  { factor: 'Liquidity', t_stat: 2.1 },
];

export default function ReturnPrediction() {
  const [activeEMH, setActiveEMH] = useState('semi-strong');

  return (
    <SectionLayout
      title="Stock Return Prediction"
      difficulty="advanced"
      readingTime={35}
      prerequisites={['Financial Time Series', 'Factor Models', 'Statistical Inference']}
    >
      <p>
        Predicting stock returns is the central problem of quantitative finance and one of
        the most difficult prediction tasks in machine learning. Returns have extremely low
        signal-to-noise ratio, are non-stationary, and exhibit properties (fat tails,
        volatility clustering, structural breaks) that violate most ML assumptions.
        Yet the factor zoo has grown to 400+ published "anomalies" — most of which are
        the product of data mining.
      </p>

      <h2>The Efficient Market Hypothesis</h2>
      <div className="flex gap-2 my-4">
        {[
          ['weak', 'Weak Form'],
          ['semi-strong', 'Semi-Strong'],
          ['strong', 'Strong Form'],
        ].map(([key, label]) => (
          <button key={key} onClick={() => setActiveEMH(key)}
            className={`px-3 py-1 rounded text-sm font-medium ${activeEMH === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeEMH === 'weak' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-1">Weak Form EMH</h3>
          <p className="text-sm">
            Current prices reflect all <em>past price</em> information. Technical analysis
            (chart patterns, moving average crossovers) cannot generate alpha.
            <strong> Evidence</strong>: largely confirmed — autocorrelation of daily returns
            is near zero. However, momentum at the 3–12 month horizon violates weak-form EMH.
          </p>
        </div>
      )}
      {activeEMH === 'semi-strong' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-1">Semi-Strong Form EMH</h3>
          <p className="text-sm">
            Prices reflect all <em>publicly available</em> information. Fundamental analysis
            cannot generate alpha. <strong>Evidence</strong>: mixed — anomalies (momentum,
            value, size) persist in some markets. Post-earnings drift (PEAD) is a well-documented
            violation. Most violations shrink after publication ("factor decay").
          </p>
        </div>
      )}
      {activeEMH === 'strong' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-1">Strong Form EMH</h3>
          <p className="text-sm">
            Prices reflect <em>all</em> information, including private/insider information.
            <strong> Evidence</strong>: rejected — insider trading is profitable (though illegal).
            Corporate insiders filing Form 4 trades outperform the market by 5–10% annually.
          </p>
        </div>
      )}

      <h2>Cross-Sectional Momentum</h2>
      <p>
        Jegadeesh & Titman (1993) documented that buying past 3–12 month winners and
        selling past losers generates statistically significant returns. The standard
        implementation:
      </p>
      <ol className="list-decimal pl-6 my-3 space-y-1">
        <li>Rank all stocks by their return over the past J months (excluding last 1 month to avoid short-term reversal)</li>
        <li>Go long the top decile (winners)</li>
        <li>Go short the bottom decile (losers)</li>
        <li>Hold for K months, then rebalance</li>
      </ol>

      <BlockMath math="\text{WML}_{t,t+K} = \frac{1}{n_W}\sum_{i \in W} r_{i,t,t+K} - \frac{1}{n_L}\sum_{i \in L} r_{i,t,t+K}" />

      <div className="my-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Winner vs Loser Portfolio Monthly Returns</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={momentumData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend />
            <Bar dataKey="winner" fill="#22c55e" name="Winners (+)" />
            <Bar dataKey="loser" fill="#ef4444" name="Losers (-)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>Time-Series Momentum (TSMOM)</h2>
      <p>
        Moskowitz et al. (2012) studied time-series momentum: each asset's own past return
        predicts its own future return. Unlike cross-sectional momentum, TSMOM does not
        require relative ranking.
      </p>
      <BlockMath math="\text{TSMOM Signal}_t = \text{sign}(r_{t-h,t}) \cdot \frac{1}{\sigma_{t}}" />
      <p>
        where <InlineMath math="\sigma_t" /> is the ex-ante volatility estimate. This
        vol-scaling ensures equal risk contribution across assets and time periods.
      </p>

      <h2>The Factor Zoo</h2>
      <p>
        Harvey, Liu & Zhu (2016) cataloged 316 published return predictors. Hou, Xue &
        Zhang (2020) found 65% of published factors failed basic replication. Key issues:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-800 text-sm">Data Mining Problems</h4>
          <ul className="text-xs text-red-700 space-y-1 list-disc pl-3 mt-1">
            <li>Multiple testing: 316 factors × 5% significance = 16 false positives by chance</li>
            <li>Researcher degrees of freedom: sample period, universe, weighting</li>
            <li>Publication bias: only significant results get published</li>
            <li>In-sample optimization: Sharpe looks great, then factor decays</li>
          </ul>
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 text-sm">Robust Factors</h4>
          <ul className="text-xs text-green-700 space-y-1 list-disc pl-3 mt-1">
            <li>Momentum: replicated globally, all asset classes</li>
            <li>Value (B/M): present but weaker post-2000</li>
            <li>Profitability (ROE, gross profit): robust in US and international</li>
            <li>Low volatility: persistent but partly explained by leverage constraints</li>
          </ul>
        </div>
      </div>

      <h2>Factor t-Statistics</h2>
      <div className="my-4">
        <p className="text-sm text-gray-600 mb-2">
          Published t-statistics for major anomalies. Suggested threshold for robust factors: t &gt; 3.0 (vs. traditional 2.0)
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={factorData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 6]} />
            <YAxis type="category" dataKey="factor" width={130} tick={{ fontSize: 12 }} />
            <Tooltip />
            {/* Significance threshold */}
            <Line type="monotone" dataKey={() => 3} stroke="#ef4444" strokeWidth={1} strokeDasharray="4 2" />
            <Bar dataKey="t_stat" fill="#6366f1" name="t-statistic" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>Python: Computing Momentum Factor with pandas</h2>
      <PythonCode code={`import pandas as pd
import numpy as np
import yfinance as yf
from scipy.stats import spearmanr

# ── 1. Download S&P 500 constituent data ──────────────────────────────
# Using a small universe for illustration
tickers = [
    'AAPL', 'MSFT', 'AMZN', 'NVDA', 'GOOGL', 'META', 'BRK-B', 'LLY',
    'V', 'JPM', 'XOM', 'UNH', 'WMT', 'JNJ', 'MA', 'PG', 'HD', 'CVX',
    'MRK', 'ABBV', 'COST', 'BAC', 'NFLX', 'AMD', 'CRM', 'ADBE', 'TMO',
    'PEP', 'ACN', 'CSCO',
]
prices = yf.download(tickers, start='2018-01-01', end='2024-01-01',
                     progress=False)['Adj Close']
prices = prices.dropna(axis=1, thresh=int(0.9 * len(prices)))
print(f"Universe: {prices.shape[1]} stocks")`} />

      <PythonCode code={`# ── 2. Compute cross-sectional momentum signal ────────────────────────
returns = prices.pct_change()

# J=12 month lookback, skip last 1 month (standard construction)
# Returns from t-252 to t-21 trading days ago
J = 252  # 12-month lookback (trading days)
skip = 21  # 1-month skip

# Past return signal
mom_raw = prices.shift(skip) / prices.shift(J) - 1

# Cross-sectional z-score (standardize within each date)
mom_zscore = mom_raw.sub(mom_raw.mean(axis=1), axis=0).div(
    mom_raw.std(axis=1), axis=0
)

# Decile assignment
def assign_decile(row):
    return pd.qcut(row.dropna(), q=10, labels=False, duplicates='drop')

# Sample: which stocks are in top/bottom decile on 2023-01-03?
sample_date = '2023-01-03'
sample_row = mom_raw.loc[sample_date].dropna()
deciles = pd.qcut(sample_row, q=10, labels=list(range(1, 11)), duplicates='drop')
print(f"\nTop decile (winners): {deciles[deciles == 10].index.tolist()}")
print(f"Bot decile (losers):  {deciles[deciles == 1].index.tolist()}")`} />

      <PythonCode code={`# ── 3. Long-short momentum portfolio ──────────────────────────────────
# Rebalance monthly; hold for K=1 month
K = 21  # 1-month holding period
rebalance_dates = prices.resample('MS').first().index

port_returns = []
for i, date in enumerate(rebalance_dates[:-1]):
    next_date = rebalance_dates[i + 1]
    if date not in mom_raw.index:
        continue
    signal = mom_raw.loc[date].dropna()
    if len(signal) < 10:
        continue
    deciles_today = pd.qcut(signal, q=10, labels=False, duplicates='drop')
    winners = deciles_today[deciles_today == 9].index  # top decile
    losers  = deciles_today[deciles_today == 0].index  # bottom decile

    # Forward return for holding period
    mask = (prices.index >= date) & (prices.index < next_date)
    period_rets = returns.loc[mask]
    if len(period_rets) == 0:
        continue

    win_ret  = period_rets[winners].mean(axis=1).mean() if len(winners) > 0 else 0
    lose_ret = period_rets[losers].mean(axis=1).mean() if len(losers) > 0 else 0
    wml      = win_ret - lose_ret   # Winner Minus Loser

    port_returns.append({
        'date': date,
        'winners': win_ret,
        'losers': lose_ret,
        'wml': wml,
    })

results_df = pd.DataFrame(port_returns).set_index('date')
print(results_df.tail())
print(f"\nAvg monthly WML: {results_df['wml'].mean():.3%}")
print(f"Sharpe (ann.):    {results_df['wml'].mean() / results_df['wml'].std() * np.sqrt(12):.2f}")`} />

      <PythonCode code={`# ── 4. Factor decay analysis ──────────────────────────────────────────
# Rank IC: how well does today's signal predict returns 1, 3, 6, 12 months ahead?
def rank_ic(signal_df, returns_df, forward_days):
    """Compute average rank IC across all dates."""
    ics = []
    for date in signal_df.index:
        sig = signal_df.loc[date].dropna()
        # Forward return over next 'forward_days' trading days
        future_date_idx = returns_df.index.searchsorted(date) + forward_days
        if future_date_idx >= len(returns_df):
            continue
        future_date = returns_df.index[future_date_idx]
        fwd_ret = (prices.loc[future_date] / prices.loc[date] - 1).dropna()
        common = sig.index.intersection(fwd_ret.index)
        if len(common) < 10:
            continue
        ic, _ = spearmanr(sig[common], fwd_ret[common])
        ics.append(ic)
    return np.mean(ics)

print("Momentum Rank IC by horizon:")
for h_days, h_label in [(5, '1W'), (21, '1M'), (63, '3M'), (126, '6M'), (252, '12M')]:
    ic = rank_ic(mom_raw, returns, h_days)
    print(f"  {h_label}: {ic:.4f}")`} />

      <PythonCode code={`# ── 5. Multiple testing correction ────────────────────────────────────
from statsmodels.stats.multitest import multipletests

# Simulate testing 50 candidate signals
np.random.seed(0)
n_tests = 50
p_values = np.random.uniform(0, 1, n_tests)
# Add a few "real" signals
p_values[:5] = np.random.uniform(0, 0.01, 5)

# Bonferroni correction
_, p_bonferroni, _, _ = multipletests(p_values, alpha=0.05, method='bonferroni')
# Benjamini-Hochberg (FDR control)
_, p_bh, _, _         = multipletests(p_values, alpha=0.05, method='fdr_bh')

print(f"Significant signals (raw p < 0.05): {(p_values < 0.05).sum()}")
print(f"Significant signals (Bonferroni):    {(p_bonferroni < 0.05).sum()}")
print(f"Significant signals (BH FDR 5%):     {(p_bh < 0.05).sum()}")
# Demonstrates how raw p < 0.05 inflates false discoveries`} />

      <TheoremBlock title="The Multiple Testing Problem in Finance">
        With 316 published factors, the expected number of false positives at α = 5%
        is 316 × 0.05 = 15.8. Harvey, Liu & Zhu (2016) recommend requiring t-statistics
        above 3.0 (p &lt; 0.27%) for factors tested in large samples, and above 4.0 for
        factors from large factor searches. The deflated Sharpe ratio (Bailey & Lopez de
        Prado, 2014) further penalizes based on the number of strategies tested.
      </TheoremBlock>

      <WarningBlock>
        P-hacking and the replication crisis in finance: of 97 equity anomalies tested by
        Hou, Xue & Zhang (2020) using updated data and methodology, only 36% replicated.
        Common failures: (1) using CRSP value-weighted returns instead of equal-weighted,
        (2) ignoring microcaps where most anomalies concentrate, (3) sample period ended
        before anomaly was discovered (momentum works less well post-publication).
      </WarningBlock>

      <NoteBlock>
        Factor decay is systematic: after a factor is published, hedge funds trade it out
        of existence. Momentum has the shortest half-life (~2 years for full decay in the
        US). Value has longer half-life but has been weak since 2007. The implication:
        always test your factor using the out-of-publication-year data to separate discovery
        from genuine alpha.
      </NoteBlock>

      <ReferenceList references={[
        {
          authors: 'Jegadeesh, N., Titman, S.',
          year: 1993,
          title: 'Returns to buying winners and selling losers: Implications for stock market efficiency',
          journal: 'Journal of Finance',
          volume: '48(1)',
          pages: '65–91',
        },
        {
          authors: 'Harvey, C.R., Liu, Y., Zhu, H.',
          year: 2016,
          title: '… and the cross-section of expected returns',
          journal: 'Review of Financial Studies',
          volume: '29(1)',
          pages: '5–68',
        },
        {
          authors: 'Hou, K., Xue, C., Zhang, L.',
          year: 2020,
          title: 'Replicating anomalies',
          journal: 'Review of Financial Studies',
          volume: '33(5)',
          pages: '2019–2133',
        },
        {
          authors: 'Moskowitz, T.J., Ooi, Y.H., Pedersen, L.H.',
          year: 2012,
          title: 'Time series momentum',
          journal: 'Journal of Financial Economics',
          volume: '104(2)',
          pages: '228–250',
        },
      ]} />
    </SectionLayout>
  );
}
