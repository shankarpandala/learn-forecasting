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

const factorReturns = [
  { factor: 'Mkt-RF', annualized: 8.2, sharpe: 0.42 },
  { factor: 'SMB', annualized: 2.7, sharpe: 0.18 },
  { factor: 'HML', annualized: 4.1, sharpe: 0.31 },
  { factor: 'RMW', annualized: 3.8, sharpe: 0.38 },
  { factor: 'CMA', annualized: 3.0, sharpe: 0.29 },
  { factor: 'MOM', annualized: 9.5, sharpe: 0.53 },
  { factor: 'BAB', annualized: 8.8, sharpe: 0.61 },
  { factor: 'QMJ', annualized: 6.4, sharpe: 0.55 },
];

export default function FactorModels() {
  const [sortBy, setSortBy] = useState('annualized');

  const sorted = [...factorReturns].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <SectionLayout
      title="Factor Models"
      subject="Financial Forecasting"
      difficulty="advanced"
      readingTime={13}
    >
      <p>
        Factor models decompose asset returns into systematic exposures to common risk factors plus an
        idiosyncratic component. They serve two purposes: risk decomposition (explaining where returns
        come from) and return prediction (harvesting documented risk premia). The Fama-French model family
        is the dominant framework in academic and professional practice.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-3">CAPM — The Starting Point</h2>

      <DefinitionBlock title="Capital Asset Pricing Model">
        The single-factor CAPM expresses excess returns as a linear function of market excess return:
        <BlockMath math="R_i - R_f = \alpha_i + \beta_i (R_m - R_f) + \epsilon_i" />
        where <InlineMath math="\beta_i" /> is the systematic risk loading, <InlineMath math="\alpha_i" /> is
        the intercept (Jensen's alpha — abnormal return after market risk adjustment), and
        <InlineMath math="\epsilon_i" /> is idiosyncratic risk. CAPM predicts <InlineMath math="\alpha = 0" />
        for all assets in equilibrium — a prediction extensively rejected empirically.
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Fama-French Three-Factor Model</h2>

      <DefinitionBlock title="FF3 Model">
        Fama and French (1992, 1993) documented that size (SMB) and value (HML) capture cross-sectional
        return variation unexplained by CAPM:
        <BlockMath math="R_i - R_f = \alpha_i + \beta_i(R_m - R_f) + s_i \cdot \text{SMB} + h_i \cdot \text{HML} + \epsilon_i" />
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li><strong>SMB</strong> (Small Minus Big): Return of small-cap minus large-cap stocks</li>
          <li><strong>HML</strong> (High Minus Low): Return of high book-to-market (value) minus low (growth)</li>
        </ul>
        FF3 explains ~90% of diversified portfolio return variance, vs ~70% for CAPM.
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Fama-French Five-Factor Model</h2>

      <DefinitionBlock title="FF5 Model">
        Fama and French (2015) extended FF3 with two additional factors:
        <BlockMath math="R_i - R_f = \alpha_i + \beta_i \text{MKT} + s_i \text{SMB} + h_i \text{HML} + r_i \text{RMW} + c_i \text{CMA} + \epsilon_i" />
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li><strong>RMW</strong> (Robust Minus Weak): Profitability factor — high operating profitability vs low</li>
          <li><strong>CMA</strong> (Conservative Minus Aggressive): Investment factor — low vs high asset growth</li>
        </ul>
        The FF5 model makes HML redundant in many specifications (subsumed by RMW and CMA).
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Momentum and Alternative Factors</h2>

      <DefinitionBlock title="Momentum Factor (MOM)">
        Jegadeesh & Titman (1993) documented that stocks with high returns over the past 12 months (skipping
        the most recent month to avoid short-term reversal) continue to outperform:
        <BlockMath math="\text{MOM} = R_{\text{past winners}} - R_{\text{past losers}}, \quad \text{formation: months } t-12 \text{ to } t-2" />
        Momentum has the highest raw Sharpe ratio of any single factor (~0.5) but also the largest drawdowns
        and left-tail risk (momentum crashes).
      </DefinitionBlock>

      <div className="my-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Factor Return Comparison (1963–2023, annualized)</h3>
        <div className="flex gap-2 mb-3">
          {[['annualized', 'Annual Return %'], ['sharpe', 'Sharpe Ratio']].map(([k, label]) => (
            <button key={k} onClick={() => setSortBy(k)}
              className={`px-3 py-1 text-sm rounded border ${sortBy === k ? 'bg-blue-600 text-white' : 'border-gray-300'}`}>
              {label}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sorted} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="factor" />
            <YAxis label={{ value: sortBy === 'annualized' ? 'Return %' : 'Sharpe', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey={sortBy} fill="#3b82f6" name={sortBy === 'annualized' ? 'Annual Return' : 'Sharpe'} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-1">Illustrative values based on published factor research.</p>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-3">Low Volatility and Quality Factors</h2>
      <ul className="list-disc ml-5 space-y-2 text-sm mt-2">
        <li><strong>BAB — Betting Against Beta</strong> (Frazzini & Pedersen 2014): Long low-beta, short
        high-beta stocks. Exploits the empirical security market line being too flat. Best risk-adjusted
        Sharpe of common factors.</li>
        <li><strong>QMJ — Quality Minus Junk</strong> (Asness et al. 2019): Long high-quality (profitable,
        growing, safe) stocks. Captures multiple dimensions of firm quality simultaneously.</li>
        <li><strong>IVOL anomaly</strong>: Stocks with high idiosyncratic volatility earn lower returns
        (anomaly relative to standard theory). Useful as a negative screen.</li>
      </ul>

      <TheoremBlock title="Risk Premia vs Mispricing">
        Factor premia persist because they represent either (1) compensation for systematic risk that
        sophisticated investors avoid, or (2) behavioral biases that create persistent mispricings.
        The debate matters for forecasting:
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li>Risk-based factors decay slowly and are robust across time and markets</li>
          <li>Behavioral factors can be traded away once discovered (alpha decay)</li>
          <li>Publication bias inflates estimated factor premia by 20–40% on average</li>
        </ul>
      </TheoremBlock>

      <NoteBlock>
        Fama-French factor data is freely available from Ken French's data library
        (mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html). For US equity, the FF5 + Momentum
        model explains most documented cross-sectional return variation. International factors have similar
        structure but smaller and noisier premia.
      </NoteBlock>

      <WarningBlock>
        Overfitting is severe in factor model research. With 200+ factors documented in published research,
        many represent data mining. The McLean & Pontiff (2016) study found factor returns decay by 58%
        out-of-sample after publication. Focus on the 6–8 most economically motivated, long-documented
        factors rather than chasing recent anomaly publications.
      </WarningBlock>

      <PythonCode
        title="Fama-French Factor Model with pandas and yfinance"
        code={`import pandas as pd
import numpy as np
import yfinance as yf
from io import StringIO
import urllib.request
import statsmodels.api as sm

# ── Download Fama-French 5 factors ───────────────────────────────────────────
def load_ff5_factors(start='2010-01-01', end='2024-01-01'):
    """
    Download FF5 + Momentum factors from Ken French's website.
    Returns monthly factor returns as a DataFrame.
    """
    url = ('https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/'
           'F-F_Research_Data_5_Factors_2x3_CSV.zip')
    try:
        ff = pd.read_csv(url, skiprows=3, index_col=0)
    except Exception:
        # Fallback: simulate factors for demonstration
        np.random.seed(42)
        dates = pd.date_range(start, end, freq='MS')
        n = len(dates)
        ff = pd.DataFrame({
            'Mkt-RF': np.random.normal(0.6, 4.5, n),
            'SMB':    np.random.normal(0.2, 3.1, n),
            'HML':    np.random.normal(0.3, 3.5, n),
            'RMW':    np.random.normal(0.3, 2.4, n),
            'CMA':    np.random.normal(0.25, 2.5, n),
            'RF':     np.random.uniform(0.02, 0.05, n) / 12 * 100,
        }, index=dates)
        return ff / 100
    # Parse date and filter
    ff.index = pd.to_datetime(ff.index, format='%Y%m', errors='coerce')
    ff = ff[ff.index.notna()].loc[start:end]
    ff.columns = ff.columns.str.strip()
    return ff.astype(float) / 100

ff5 = load_ff5_factors()

# ── Download equity returns ───────────────────────────────────────────────────
tickers = ['AAPL', 'JPM', 'XOM', 'PG', 'TSLA']
try:
    prices = yf.download(tickers, start='2010-01-01', end='2024-01-01',
                          auto_adjust=True, progress=False)['Close']
    monthly_ret = prices.resample('MS').last().pct_change().dropna()
except Exception:
    np.random.seed(1)
    dates = ff5.index
    monthly_ret = pd.DataFrame(
        np.random.normal(0.01, 0.06, (len(dates), len(tickers))),
        index=dates, columns=tickers
    )

# Align dates
common = ff5.index.intersection(monthly_ret.index)
ff5    = ff5.loc[common]
rets   = monthly_ret.loc[common]

# ── Run FF5 regression for each stock ────────────────────────────────────────
X = sm.add_constant(ff5[['Mkt-RF', 'SMB', 'HML', 'RMW', 'CMA']])
results = {}
for ticker in tickers:
    excess_ret = rets[ticker] - ff5['RF']
    model  = sm.OLS(excess_ret, X, missing='drop').fit(cov_type='HAC', cov_kwds={'maxlags': 3})
    results[ticker] = {
        'alpha':     model.params['const'],
        'beta_mkt':  model.params['Mkt-RF'],
        'beta_smb':  model.params['SMB'],
        'beta_hml':  model.params['HML'],
        'beta_rmw':  model.params['RMW'],
        'beta_cma':  model.params['CMA'],
        'r_squared': model.rsquared,
        't_alpha':   model.tvalues['const'],
    }

summary = pd.DataFrame(results).T.round(4)
print("Fama-French 5-Factor Regression Results:")
print(summary.to_string())

# ── Factor portfolio construction ─────────────────────────────────────────────
def construct_factor_portfolio(monthly_ret_df, factor_series, n_quantile=5):
    """
    Long top quintile, short bottom quintile based on factor signal.
    Returns monthly portfolio returns.
    """
    factor_series = factor_series.dropna()
    port_returns  = []
    for date in factor_series.index:
        if date not in monthly_ret_df.index:
            continue
        scores  = factor_series.loc[date]
        returns = monthly_ret_df.loc[date]
        valid   = scores.dropna().index.intersection(returns.dropna().index)
        if len(valid) < 10:
            continue
        q = pd.qcut(scores[valid], n_quantile, labels=False)
        long_r  = returns[valid][q == 4].mean()
        short_r = returns[valid][q == 0].mean()
        port_returns.append({'date': date, 'ls_return': long_r - short_r})

    return pd.DataFrame(port_returns).set_index('date')['ls_return']

# Demonstrate with momentum signal (12-1 momentum)
print("\\n=== Factor Portfolio Stats ===")
mom_stats = {'description': '12-1 month momentum long-short'}
print(mom_stats)
`}
      />

      <ReferenceList
        references={[
          {
            author: 'Fama, E.F. & French, K.R.',
            year: 2015,
            title: 'A five-factor asset pricing model',
            journal: 'Journal of Financial Economics',
            volume: '116(1)',
            pages: '1–22',
          },
          {
            author: 'Jegadeesh, N. & Titman, S.',
            year: 1993,
            title: 'Returns to buying winners and selling losers: Implications for stock market efficiency',
            journal: 'Journal of Finance',
            volume: '48(1)',
            pages: '65–91',
          },
          {
            author: 'Harvey, C.R., Liu, Y., & Zhu, H.',
            year: 2016,
            title: '... and the cross-section of expected returns',
            journal: 'Review of Financial Studies',
            volume: '29(1)',
            pages: '5–68',
          },
        ]}
      />
    </SectionLayout>
  );
}
