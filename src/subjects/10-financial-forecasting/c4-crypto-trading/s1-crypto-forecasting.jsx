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

const featureImportanceData = [
  { feature: 'lag_return_1d', importance: 0.18 },
  { feature: 'realized_vol_7d', importance: 0.14 },
  { feature: 'lag_return_7d', importance: 0.11 },
  { feature: 'rsi_14', importance: 0.09 },
  { feature: 'nvt_ratio', importance: 0.08 },
  { feature: 'volume_change', importance: 0.07 },
  { feature: 'mvrv_ratio', importance: 0.06 },
  { feature: 'fear_greed', importance: 0.06 },
  { feature: 'macd_signal', importance: 0.05 },
  { feature: 'bb_width', importance: 0.04 },
];

const btcReturnDist = [
  { ret: '-10%+', freq: 3 },
  { ret: '-8%', freq: 5 },
  { ret: '-6%', freq: 9 },
  { ret: '-4%', freq: 15 },
  { ret: '-2%', freq: 22 },
  { ret: '0%', freq: 28 },
  { ret: '+2%', freq: 21 },
  { ret: '+4%', freq: 14 },
  { ret: '+6%', freq: 8 },
  { ret: '+8%', freq: 5 },
  { ret: '+10%+', freq: 6 },
];

export default function CryptoForecasting() {
  const [activeFeatureGroup, setActiveFeatureGroup] = useState('technical');

  return (
    <SectionLayout
      title="Cryptocurrency Price Forecasting"
      difficulty="advanced"
      readingTime={35}
      prerequisites={['Financial Time Series', 'LightGBM/Feature Engineering', 'GARCH Models']}
    >
      <p>
        Cryptocurrency markets present unique forecasting challenges: 24/7 continuous trading,
        extreme volatility, fat-tailed return distributions, regime shifts, and a rich ecosystem
        of on-chain data unavailable in traditional finance. These characteristics demand
        specialized feature engineering and careful handling of non-stationarity.
      </p>

      <h2>Unique Characteristics of Crypto Markets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-800 text-sm mb-1">Challenges</h4>
          <ul className="text-xs text-red-700 space-y-1 list-disc pl-3">
            <li>24/7 trading: no market close or overnight gap</li>
            <li>Returns 5–10x more volatile than equities</li>
            <li>Fat tails: kurtosis often &gt; 10 (normal ≈ 3)</li>
            <li>Regime changes: bull/bear markets shift dynamics</li>
            <li>Microstructure: low liquidity → price manipulation</li>
            <li>Survivorship bias: most crypto projects go to zero</li>
          </ul>
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 text-sm mb-1">Unique Opportunities</h4>
          <ul className="text-xs text-green-700 space-y-1 list-disc pl-3">
            <li>On-chain data: transparent, real-time blockchain metrics</li>
            <li>Sentiment proxies: social media, search volume</li>
            <li>High-frequency data available (hourly, minutely)</li>
            <li>Retail-driven: sentiment effects stronger than equities</li>
            <li>Cross-asset flows: BTC dominance as regime signal</li>
          </ul>
        </div>
      </div>

      <h2>Return Distribution</h2>
      <div className="my-4">
        <p className="text-sm text-gray-600 mb-2">Daily BTC returns (stylized): much fatter tails than Gaussian</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={btcReturnDist}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ret" tick={{ fontSize: 11 }} />
            <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="freq" fill="#f59e0b" name="Frequency" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>Feature Engineering for Crypto</h2>
      <div className="flex gap-2 flex-wrap my-4">
        {[['technical', 'Technical'], ['onchain', 'On-Chain'], ['sentiment', 'Sentiment']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveFeatureGroup(key)}
            className={`px-3 py-1 rounded text-sm font-medium ${activeFeatureGroup === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeFeatureGroup === 'technical' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Technical Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Momentum:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                <li>Lag returns: 1d, 3d, 7d, 30d</li>
                <li>RSI(14): overbought/oversold</li>
                <li>MACD and signal line</li>
                <li>Stochastic oscillator</li>
              </ul>
            </div>
            <div>
              <strong>Volatility:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                <li>Realized vol: 7d, 30d</li>
                <li>Bollinger Band width</li>
                <li>ATR (Average True Range)</li>
                <li>Vol ratio: short/long</li>
              </ul>
            </div>
            <div>
              <strong>Volume:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                <li>Volume change vs 7d avg</li>
                <li>OBV (On-Balance Volume)</li>
                <li>Taker buy/sell ratio</li>
              </ul>
            </div>
            <div>
              <strong>Price Structure:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                <li>Distance from 200-day MA</li>
                <li>All-time high drawdown</li>
                <li>52-week high/low ratio</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {activeFeatureGroup === 'onchain' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">On-Chain Features (Bitcoin-specific)</h3>
          <ul className="space-y-2 text-sm">
            <li><strong>NVT Ratio</strong> (Network Value to Transactions): Market cap / on-chain transaction volume. High NVT → overvalued. Analogous to P/E ratio.</li>
            <li><strong>MVRV Ratio</strong> (Market Value to Realized Value): Market cap / realized cap (what each coin last moved at). MVRV &gt; 3.5 historically marks cycle tops.</li>
            <li><strong>Realized Cap</strong>: Sum of each UTXO's value at its last movement price. More stable than market cap.</li>
            <li><strong>SOPR</strong> (Spent Output Profit Ratio): Whether coins moved today were in profit. SOPR &lt; 1 → selling at loss → potential bottom.</li>
            <li><strong>Exchange flow</strong>: Net BTC inflow to exchanges. Large inflows → potential selling pressure.</li>
            <li><strong>Hash rate</strong>: Network security; miner capitulation signals.</li>
          </ul>
        </div>
      )}
      {activeFeatureGroup === 'sentiment' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Sentiment Features</h3>
          <ul className="space-y-2 text-sm">
            <li><strong>Fear & Greed Index</strong>: CNN-style composite 0–100. Extreme fear (&lt;20) historically good buying signal; extreme greed (&gt;80) caution.</li>
            <li><strong>Social media volume</strong>: Reddit post count, Twitter/X mention volume, LunarCrush social score.</li>
            <li><strong>Google Trends</strong>: Search interest for "Bitcoin", "crypto". Spike in retail interest → late cycle signal.</li>
            <li><strong>Funding rates</strong>: Perpetual futures funding rate. Positive = longs paying shorts; extreme = crowded long position.</li>
            <li><strong>Open interest</strong>: Total futures open interest. Rising OI with rising price = trend continuation.</li>
            <li><strong>Long/short ratio</strong>: Aggregated trader positioning from exchanges.</li>
          </ul>
        </div>
      )}

      <h2>Feature Importance</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={featureImportanceData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
          <YAxis type="category" dataKey="feature" width={140} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
          <Bar dataKey="importance" fill="#f59e0b" name="Importance" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Return Prediction vs Price Prediction</h2>
      <p>
        Predicting raw price levels is ill-posed: prices are non-stationary (I(1)).
        Always predict <strong>returns</strong> instead:
      </p>
      <BlockMath math="r_t = \ln P_t - \ln P_{t-1} = \ln\left(\frac{P_t}{P_{t-1}}\right)" />
      <p>
        Log returns are approximately stationary (after removing ARCH effects). They are
        also additive: multi-period returns = sum of single-period log returns.
      </p>

      <h2>Python: BTC Feature Engineering + LightGBM</h2>
      <PythonCode code={`import pandas as pd
import numpy as np
import yfinance as yf
import lightgbm as lgb
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

# ── 1. Download BTC price data ─────────────────────────────────────────
btc = yf.download('BTC-USD', start='2018-01-01', end='2024-01-01', progress=False)
btc = btc[['Open', 'High', 'Low', 'Close', 'Volume']].copy()
print(f"Shape: {btc.shape}")`} />

      <PythonCode code={`# ── 2. Technical feature engineering ─────────────────────────────────
def compute_rsi(series, window=14):
    delta = series.diff()
    gain = delta.clip(lower=0).rolling(window).mean()
    loss = (-delta.clip(upper=0)).rolling(window).mean()
    rs = gain / loss.replace(0, np.nan)
    return 100 - (100 / (1 + rs))

def compute_macd(series, fast=12, slow=26, signal=9):
    ema_fast = series.ewm(span=fast).mean()
    ema_slow = series.ewm(span=slow).mean()
    macd = ema_fast - ema_slow
    macd_signal = macd.ewm(span=signal).mean()
    return macd - macd_signal  # histogram

close = btc['Close']
vol = btc['Volume']

df = pd.DataFrame(index=btc.index)
# Returns
df['ret_1d'] = close.pct_change(1)
df['ret_3d'] = close.pct_change(3)
df['ret_7d'] = close.pct_change(7)
df['ret_30d'] = close.pct_change(30)
df['log_ret_1d'] = np.log(close / close.shift(1))

# Volatility
df['realized_vol_7d']  = df['log_ret_1d'].rolling(7).std() * np.sqrt(365)
df['realized_vol_30d'] = df['log_ret_1d'].rolling(30).std() * np.sqrt(365)
df['vol_ratio']        = df['realized_vol_7d'] / df['realized_vol_30d']

# Momentum
df['rsi_14']    = compute_rsi(close, 14)
df['macd_hist'] = compute_macd(close)
df['mom_score'] = (df['ret_7d'].rank(pct=True) + df['ret_30d'].rank(pct=True)) / 2

# Bollinger Bands
bb_mid = close.rolling(20).mean()
bb_std = close.rolling(20).std()
df['bb_width'] = 2 * bb_std / bb_mid
df['bb_pos']   = (close - bb_mid) / (2 * bb_std)

# Volume
df['vol_change_7d'] = vol / vol.rolling(7).mean() - 1
df['obv'] = (np.sign(df['log_ret_1d']) * vol).cumsum()
df['obv_change'] = df['obv'].pct_change(7)

# Distance from moving averages
df['dist_ma50']  = close / close.rolling(50).mean() - 1
df['dist_ma200'] = close / close.rolling(200).mean() - 1`} />

      <PythonCode code={`# ── 3. Target: forward 7-day return ──────────────────────────────────
df['target'] = close.pct_change(7).shift(-7)  # 7-day forward return

# Clip extreme returns (tail risk management)
df['target'] = df['target'].clip(-0.5, 0.5)

# ── 4. Train/test split (time-ordered) ───────────────────────────────
df = df.dropna()
train = df[df.index < '2023-01-01']
test  = df[df.index >= '2023-01-01']

feature_cols = [c for c in df.columns if c != 'target']
X_train, y_train = train[feature_cols], train['target']
X_test,  y_test  = test[feature_cols],  test['target']

# ── 5. LightGBM model ─────────────────────────────────────────────────
lgbm = lgb.LGBMRegressor(
    n_estimators=500,
    learning_rate=0.02,
    num_leaves=31,
    min_child_samples=30,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=0.1,
    random_state=42,
    verbosity=-1,
)
lgbm.fit(X_train, y_train,
         eval_set=[(X_test, y_test)],
         callbacks=[lgb.early_stopping(50, verbose=False)])

y_pred = lgbm.predict(X_test)
print(f"Test MAE: {mean_absolute_error(y_test, y_pred):.4f}")
print(f"Correlation (pred vs actual): {np.corrcoef(y_pred, y_test)[0,1]:.4f}")`} />

      <PythonCode code={`# ── 6. Regime detection ───────────────────────────────────────────────
# Crypto markets alternate between bull and bear regimes
# Simple regime detection using 200-day MA

df['regime'] = np.where(close > close.rolling(200).mean(), 'bull', 'bear')
regime_returns = df.groupby('regime')['ret_1d'].describe()
print(regime_returns)

# Evaluate model per regime
results = pd.DataFrame({
    'actual': y_test,
    'predicted': y_pred,
    'regime': df.loc[y_test.index, 'regime'],
})
print(results.groupby('regime').apply(
    lambda g: pd.Series({'mae': mean_absolute_error(g['actual'], g['predicted']),
                         'corr': g['actual'].corr(g['predicted'])})
))`} />

      <DefinitionBlock title="NVT Ratio">
        Network Value to Transactions Ratio = Market Cap / 30-day average daily on-chain
        transaction volume (USD). An on-chain analogue to the P/E ratio for networks.
        NVT &gt; 65 has historically signaled overvaluation; NVT &lt; 35 potential undervaluation.
        Available from Glassnode, CoinMetrics, or computed from raw blockchain data.
      </DefinitionBlock>

      <DefinitionBlock title="MVRV Ratio">
        Market Value to Realized Value = Market Cap / Realized Cap. Realized Cap sums each
        coin at the price it last moved, providing an estimate of aggregate cost basis.
        When MVRV &gt; 3.5, most holders are in profit and incentivized to sell (historically
        coincides with cycle peaks). MVRV &lt; 1 means average holder is at a loss.
      </DefinitionBlock>

      <WarningBlock>
        Backtesting bias in crypto is severe. Two critical issues: (1) <strong>Survivorship
        bias</strong> — most altcoins go to zero; a backtest on only surviving coins inflates
        returns. (2) <strong>Look-ahead bias</strong> — on-chain metrics like MVRV are often
        revised after initial publication; use point-in-time data from providers like
        Glassnode, not retrospectively computed values.
      </WarningBlock>

      <NoteBlock>
        Predicting the <em>direction</em> of returns (classification) is often more actionable
        than magnitude (regression). A classifier that correctly predicts direction 55% of the
        time can be profitable with proper position sizing, even with low magnitude accuracy.
      </NoteBlock>

      <ReferenceList references={[
        {
          authors: 'Cretarola, A., Figà-Talamanca, G.',
          year: 2021,
          title: 'Detecting bubbles in Bitcoin price dynamics via market exuberance',
          journal: 'Annals of Operations Research',
          volume: '299',
          pages: '459–479',
        },
        {
          authors: 'Liu, Y., Tsyvinski, A.',
          year: 2021,
          title: 'Risks and returns of cryptocurrency',
          journal: 'Review of Financial Studies',
          volume: '34(6)',
          pages: '2689–2727',
        },
      ]} />
    </SectionLayout>
  );
}
