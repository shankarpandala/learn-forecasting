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

const equityCurveData = [
  { month: 'Jan', strategy: 100, buyhold: 100 },
  { month: 'Feb', strategy: 103, buyhold: 108 },
  { month: 'Mar', strategy: 108, buyhold: 95 },
  { month: 'Apr', strategy: 112, buyhold: 110 },
  { month: 'May', strategy: 118, buyhold: 115 },
  { month: 'Jun', strategy: 114, buyhold: 105 },
  { month: 'Jul', strategy: 120, buyhold: 118 },
  { month: 'Aug', strategy: 125, buyhold: 122 },
  { month: 'Sep', strategy: 122, buyhold: 112 },
  { month: 'Oct', strategy: 130, buyhold: 125 },
  { month: 'Nov', strategy: 138, buyhold: 130 },
  { month: 'Dec', strategy: 142, buyhold: 135 },
];

const drawdownData = [
  { month: 'Jan', drawdown: 0 },
  { month: 'Feb', drawdown: -2 },
  { month: 'Mar', drawdown: -5 },
  { month: 'Apr', drawdown: -1 },
  { month: 'May', drawdown: 0 },
  { month: 'Jun', drawdown: -4 },
  { month: 'Jul', drawdown: -2 },
  { month: 'Aug', drawdown: 0 },
  { month: 'Sep', drawdown: -3 },
  { month: 'Oct', drawdown: 0 },
  { month: 'Nov', drawdown: 0 },
  { month: 'Dec', drawdown: 0 },
];

export default function AlgoTrading() {
  const [activeStrategy, setActiveStrategy] = useState('momentum');

  return (
    <SectionLayout
      title="Algorithmic Trading Strategies"
      difficulty="advanced"
      readingTime={35}
      prerequisites={['Crypto Forecasting', 'Financial Time Series', 'Statistics']}
    >
      <p>
        Algorithmic trading formalizes investment decisions into repeatable, systematic rules.
        This section covers the three core strategy archetypes — momentum, mean-reversion, and
        statistical arbitrage — along with rigorous backtesting methodology to avoid the pitfalls
        that cause most backtests to fail in live trading.
      </p>

      <h2>Strategy Taxonomy</h2>
      <div className="flex gap-2 flex-wrap my-4">
        {[
          ['momentum', 'Momentum'],
          ['mean-rev', 'Mean-Reversion'],
          ['stat-arb', 'Statistical Arbitrage'],
        ].map(([key, label]) => (
          <button key={key} onClick={() => setActiveStrategy(key)}
            className={`px-3 py-1 rounded text-sm font-medium ${activeStrategy === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeStrategy === 'momentum' && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Momentum Strategies</h3>
          <p className="text-sm text-blue-700 mb-2">
            <strong>Thesis</strong>: past winners continue to outperform past losers (Jegadeesh &
            Titman, 1993). Assets that have risen continue rising.
          </p>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
            <li><strong>Cross-sectional</strong>: rank assets by past 12-month return, long top decile, short bottom decile</li>
            <li><strong>Time-series (TSMOM)</strong>: go long if asset's own past 12-month return &gt; 0, short if &lt; 0</li>
            <li><strong>Short-term reversal</strong>: 1-week losers bounce back (mean-reversion at short horizon)</li>
          </ul>
          <p className="text-sm text-blue-700 mt-2 font-mono">
            Signal: r(t-252, t-21) — exclude last month to avoid short-term reversal
          </p>
        </div>
      )}
      {activeStrategy === 'mean-rev' && (
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">Mean-Reversion Strategies</h3>
          <p className="text-sm text-green-700 mb-2">
            <strong>Thesis</strong>: prices deviate from fundamental value and revert.
            Temporary dislocations are exploited.
          </p>
          <ul className="text-sm text-green-700 space-y-1 list-disc pl-4">
            <li><strong>Z-score trading</strong>: buy when price is N std below rolling mean, sell when above</li>
            <li><strong>Pairs trading</strong>: exploit cointegrated pair; trade the spread</li>
            <li><strong>Ornstein-Uhlenbeck</strong>: model spread as mean-reverting OU process, optimize entry/exit</li>
          </ul>
          <BlockMath math="dS_t = \theta(\mu - S_t)dt + \sigma dW_t" />
          <p className="text-sm text-green-700">Half-life = ln(2)/θ — how fast the spread reverts</p>
        </div>
      )}
      {activeStrategy === 'stat-arb' && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Statistical Arbitrage</h3>
          <p className="text-sm text-yellow-700 mb-2">
            <strong>Thesis</strong>: exploit pricing inefficiencies between related assets
            using statistical models.
          </p>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc pl-4">
            <li><strong>Crypto-specific</strong>: BTC vs ETH spread, exchange arbitrage (same asset, different exchanges)</li>
            <li><strong>Futures basis</strong>: spot vs perpetual futures basis trading</li>
            <li><strong>Factor-neutral</strong>: long undervalued, short overvalued, market-neutral</li>
          </ul>
        </div>
      )}

      <h2>Walk-Forward Backtesting Framework</h2>
      <DefinitionBlock title="Walk-Forward Analysis">
        Walk-forward analysis simulates real trading by training on a fixed in-sample window
        and testing on the immediately following out-of-sample period, then rolling forward.
        Unlike simple train/test splits, this provides multiple independent test periods and
        tests whether the strategy degrades over time (parameter instability).
      </DefinitionBlock>

      <div className="bg-gray-100 rounded p-3 font-mono text-xs my-4 overflow-x-auto">
        <pre>{`Train: [2019-01 → 2020-12]  Test: [2021-01 → 2021-03]
Train: [2019-04 → 2021-03]  Test: [2021-04 → 2021-06]
Train: [2019-07 → 2021-06]  Test: [2021-07 → 2021-09]
...`}</pre>
      </div>

      <h2>Equity Curve & Drawdown</h2>
      <div className="my-4">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={equityCurveData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[90, 155]} />
            <Tooltip formatter={(v) => `$${v}`} />
            <Legend />
            <Line type="monotone" dataKey="strategy" stroke="#6366f1" strokeWidth={2} dot={false} name="Momentum Strategy" />
            <Line type="monotone" dataKey="buyhold" stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 2" dot={false} name="Buy & Hold" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="my-4">
        <p className="text-sm text-gray-600 mb-1">Maximum Drawdown</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={drawdownData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Bar dataKey="drawdown" fill="#ef4444" name="Drawdown (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>Python: Momentum Strategy Backtest</h2>
      <PythonCode code={`import pandas as pd
import numpy as np
import yfinance as yf

# ── 1. Download crypto data ────────────────────────────────────────────
tickers = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'ADA-USD']
raw = yf.download(tickers, start='2020-01-01', end='2024-01-01', progress=False)
prices = raw['Adj Close'].dropna()
print(f"Assets: {prices.columns.tolist()}")
print(f"Dates: {prices.index[0].date()} to {prices.index[-1].date()}")`} />

      <PythonCode code={`# ── 2. Time-series momentum signal ────────────────────────────────────
# Signal: sign of trailing 12-month return (excluding last month)
# Positive return → long; negative → flat (no short for simplicity)

returns = prices.pct_change()

# 12-month lookback, skip last 1 month (avoid short-term reversal)
signal_raw = prices.shift(21) / prices.shift(252) - 1  # approx 12mo - 1mo
signal = np.sign(signal_raw)
signal = signal.clip(lower=0)  # long-only: 0 or +1

# Equal weight across assets that are long
n_long = signal.sum(axis=1).replace(0, np.nan)
weights = signal.div(n_long, axis=0).fillna(0)

# ── 3. Strategy returns ────────────────────────────────────────────────
# Apply weights with 1-day lag (signal known at close, trade next open ≈ next close)
strategy_returns = (weights.shift(1) * returns).sum(axis=1)
buyhold_returns = returns.mean(axis=1)  # equal-weight benchmark

# Remove first year (no signal)
strategy_returns = strategy_returns[strategy_returns.index >= '2021-01-01']
buyhold_returns  = buyhold_returns[buyhold_returns.index >= '2021-01-01']`} />

      <PythonCode code={`# ── 4. Performance metrics ────────────────────────────────────────────
def sharpe(rets, periods=365):
    return rets.mean() / rets.std() * np.sqrt(periods)

def max_drawdown(rets):
    cum = (1 + rets).cumprod()
    rolling_max = cum.cummax()
    drawdown = cum / rolling_max - 1
    return drawdown.min()

def calmar(rets, periods=365):
    ann_return = (1 + rets).prod() ** (periods / len(rets)) - 1
    mdd = abs(max_drawdown(rets))
    return ann_return / mdd if mdd > 0 else np.inf

metrics = pd.DataFrame({
    'Strategy': strategy_returns,
    'Buy & Hold': buyhold_returns,
}).apply(lambda col: pd.Series({
    'Ann. Return': f"{((1 + col).prod() ** (365/len(col)) - 1):.1%}",
    'Sharpe Ratio': f"{sharpe(col):.2f}",
    'Max Drawdown': f"{max_drawdown(col):.1%}",
    'Calmar Ratio': f"{calmar(col):.2f}",
    'Hit Rate': f"{(col > 0).mean():.1%}",
}))
print(metrics.T)`} />

      <PythonCode code={`# ── 5. Transaction costs ──────────────────────────────────────────────
# Realistic cost model: 0.1% taker fee + 0.1% slippage = 0.2% per trade
fee_rate = 0.002  # 0.2% per round-trip

# Compute daily portfolio turnover
turnover = weights.diff().abs().sum(axis=1)
cost_drag = turnover * fee_rate / 2  # one-way cost

strategy_net = strategy_returns - cost_drag.shift(1).fillna(0)
print(f"Gross Sharpe: {sharpe(strategy_returns):.3f}")
print(f"Net Sharpe:   {sharpe(strategy_net):.3f}")
print(f"Annual cost drag: {cost_drag.mean() * 365:.1%}")`} />

      <PythonCode code={`# ── 6. Walk-forward analysis ──────────────────────────────────────────
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler

def compute_features(prices, lookback=252):
    """Compute cross-sectional momentum features."""
    r = prices.pct_change()
    feats = pd.DataFrame(index=prices.index)
    feats['mom_12m_1m'] = prices.shift(21) / prices.shift(lookback) - 1
    feats['vol_adj_mom'] = feats['mom_12m_1m'] / (r.rolling(21).std() * np.sqrt(252))
    feats['vol_ratio']  = r.rolling(5).std() / r.rolling(21).std()
    return feats

wf_results = []
train_window = 365
test_window = 30

for start in range(train_window, len(prices) - test_window, test_window):
    train_prices = prices.iloc[start - train_window:start]
    test_prices  = prices.iloc[start:start + test_window]
    test_returns = test_prices.pct_change().dropna()

    # Simple signal: vol-adjusted momentum
    mom_signal = (
        train_prices.iloc[-1] / train_prices.shift(21).iloc[-1] - 1
    ).rank(ascending=True).apply(lambda x: 1 if x > len(prices.columns) / 2 else 0)
    n_long = mom_signal.sum()
    if n_long > 0:
        wts = mom_signal / n_long
        period_ret = (wts * test_returns).sum(axis=1).mean()
        wf_results.append({'period_return': period_ret, 'n_long': n_long})

wf_df = pd.DataFrame(wf_results)
print(f"Walk-forward periods: {len(wf_df)}")
print(f"Win rate: {(wf_df['period_return'] > 0).mean():.1%}")
print(f"Avg period return: {wf_df['period_return'].mean():.3%}")`} />

      <h2>Key Performance Metrics</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-50">
              <th className="border border-gray-300 p-2">Metric</th>
              <th className="border border-gray-300 p-2">Formula</th>
              <th className="border border-gray-300 p-2">Good Value (crypto)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Sharpe Ratio', 'μ / σ × √365', '> 1.5'],
              ['Max Drawdown', 'max(peak - trough) / peak', '< 30%'],
              ['Calmar Ratio', 'Ann. Return / |Max DD|', '> 1.0'],
              ['Hit Rate', 'fraction of profitable days', '> 52% (with high win/loss ratio)'],
              ['Profit Factor', 'gross profit / gross loss', '> 1.5'],
            ].map(([metric, formula, good]) => (
              <tr key={metric} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">{metric}</td>
                <td className="border border-gray-300 p-2 font-mono text-xs">{formula}</td>
                <td className="border border-gray-300 p-2 text-green-700">{good}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TheoremBlock title="The Fundamental Law of Active Management">
        Grinold (1989) shows that the information ratio (Sharpe of active returns) is:
        <BlockMath math="\text{IR} \approx \text{IC} \cdot \sqrt{\text{BR}}" />
        where IC = Information Coefficient (correlation of signals with outcomes) and
        BR = Breadth (number of independent bets per year). A strategy with IC = 0.05
        (modest predictive power) run at BR = 500 signals/year achieves IR ≈ 1.12.
        This argues for <em>many independent signals</em> over perfect prediction.
      </TheoremBlock>

      <WarningBlock>
        Overfitting in backtesting is the #1 cause of live trading failure. Red flags:
        (1) In-sample Sharpe &gt;&gt; Out-of-sample Sharpe. (2) Many parameters were optimized.
        (3) Strategy was selected after viewing multiple backtests. (4) No transaction
        cost adjustment. Apply the deflated Sharpe ratio (Bailey & Lopez de Prado, 2014)
        to penalize for multiple testing across strategies.
      </WarningBlock>

      <NoteBlock>
        Always test your backtest for look-ahead bias before trusting results. Common
        sources: (1) using adjusted close prices (dividends/splits adjust backwards),
        (2) using data that was revised after initial release, (3) using the current
        index composition rather than the historical composition.
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
          authors: 'Moskowitz, T.J., Ooi, Y.H., Pedersen, L.H.',
          year: 2012,
          title: 'Time series momentum',
          journal: 'Journal of Financial Economics',
          volume: '104(2)',
          pages: '228–250',
        },
        {
          authors: 'Bailey, D.H., Lopez de Prado, M.',
          year: 2014,
          title: 'The Deflated Sharpe Ratio: Correcting for Selection Bias, Backtest Overfitting and Non-Normality',
          journal: 'Journal of Portfolio Management',
          volume: '40(5)',
          pages: '94–107',
        },
      ]} />
    </SectionLayout>
  );
}
