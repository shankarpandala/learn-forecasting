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
  Legend, ResponsiveContainer, BarChart, Bar,
} from 'recharts';

export default function RealizedVol() {
  return (
    <SectionLayout
      title="Realized Volatility"
      subject="Financial Forecasting"
      difficulty="advanced"
      readingTime={12}
    >
      <p>
        Realized volatility (RV) uses intraday high-frequency returns to produce a model-free estimate of
        daily volatility. Unlike GARCH, which infers volatility from a parametric model, RV observes it
        directly from many intraday return observations. This makes RV a significantly more accurate
        volatility measure — essentially treating volatility as observable rather than latent.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-3">Realized Variance</h2>

      <DefinitionBlock title="Realized Variance (RV)">
        Given <InlineMath math="M" /> intraday returns <InlineMath math="r_{t,j} = \ln P_{t,j} - \ln P_{t,j-1}" />
        on day <InlineMath math="t" />, realized variance is:
        <BlockMath math="\text{RV}_t = \sum_{j=1}^{M} r_{t,j}^2" />
        Under mild conditions, as <InlineMath math="M \to \infty" />, <InlineMath math="\text{RV}_t \to \sigma_t^2" />
        (the true integrated variance). For 5-minute returns on a 6.5-hour trading day,
        <InlineMath math="M \approx 78" /> observations per day.
      </DefinitionBlock>

      <DefinitionBlock title="Bipower Variation">
        Barndorff-Nielsen & Shephard (2004) introduced bipower variation to disentangle continuous volatility
        from jump components:
        <BlockMath math="\text{BPV}_t = \frac{\pi}{2} \sum_{j=2}^{M} |r_{t,j}| \cdot |r_{t,j-1}|" />
        Jump component: <InlineMath math="J_t = \max(\text{RV}_t - \text{BPV}_t, 0)" />.
        Continuous component: <InlineMath math="C_t = \text{BPV}_t" />.
        Separating jumps from continuous volatility is important because they have different forecasting
        implications — jumps are less persistent than continuous volatility.
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">HAR-RV Model</h2>

      <TheoremBlock title="Heterogeneous Autoregressive Model (HAR-RV)">
        Corsi (2009) proposed a simple but powerful model exploiting realized volatility's long memory:
        <BlockMath math="\text{RV}_{t+1} = \alpha + \beta_d \text{RV}_t + \beta_w \overline{\text{RV}}_{t-4:t} + \beta_m \overline{\text{RV}}_{t-21:t} + \epsilon_{t+1}" />
        where <InlineMath math="\overline{\text{RV}}_{t-k:t}" /> is the rolling average of RV over the last
        <InlineMath math="k" /> days. The three components capture daily, weekly, and monthly volatility
        persistence — corresponding to short-term traders, institutional portfolio managers, and long-term investors.
        Despite its simplicity, HAR-RV beats GARCH out-of-sample in virtually every study.
      </TheoremBlock>

      <ExampleBlock title="HAR-RV Extensions">
        The HAR framework is extensible:
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li><strong>HAR-RV-J</strong>: Adds jump component as a regressor — jumps forecast lower future volatility</li>
          <li><strong>HAR-CJ</strong>: Uses continuous and jump components separately</li>
          <li><strong>CHAR</strong>: Uses realized semivariances (upside vs downside) — leverage effect captured directly</li>
          <li><strong>HAR-RV-RS</strong>: Realized skewness and kurtosis as additional predictors</li>
        </ul>
      </ExampleBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">High-Frequency Data Cleaning</h2>
      <p>
        Raw tick data contains microstructure noise that inflates RV estimates when computed at the highest
        frequency. Key data cleaning steps:
      </p>
      <ul className="list-disc ml-5 space-y-1 text-sm mt-2">
        <li><strong>Bid-ask bounce removal</strong>: Use midpoint prices, not transaction prices, to eliminate bounce</li>
        <li><strong>Sampling frequency</strong>: 5-minute intervals are the practical sweet spot — higher frequency amplifies noise, lower frequency wastes information</li>
        <li><strong>Jump filter</strong>: Winsorize or remove returns exceeding 5–10 standard deviations (fat-finger trades, data errors)</li>
        <li><strong>Calendar time vs trade time</strong>: Volume-weighted subsampling produces more uniform signal quality</li>
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-3">RV vs GARCH</h2>
      <p>
        The fundamental difference: GARCH is a latent volatility model (volatility is inferred from daily returns),
        while RV is a measurement-based approach (volatility is estimated from intraday data).
      </p>
      <ul className="list-disc ml-5 space-y-1 text-sm mt-2">
        <li>RV is more accurate in-sample (uses more data per day)</li>
        <li>RV requires intraday data — unavailable for many assets (private equity, real assets, OTC)</li>
        <li>GARCH generalizes to any return frequency; RV needs high-frequency data</li>
        <li>For liquid exchange-traded assets, HAR-RV consistently outperforms GARCH for 1-day ahead forecast</li>
        <li>For longer horizons (10+ days), the advantage of RV shrinks</li>
      </ul>

      <NoteBlock>
        The optimal sampling frequency for realized variance depends on the level of market microstructure
        noise. Aït-Sahalia & Mykland (2003) show the bias-variance tradeoff is minimized at approximately
        5 minutes for US equities. In practice, 5-minute sampling is the most common choice, though some
        practitioners use 10-minute intervals for less liquid assets.
      </NoteBlock>

      <WarningBlock>
        HAR-RV produces the conditional mean forecast of realized volatility. For options pricing and risk
        management, you also need the conditional variance of realized volatility (vol-of-vol). The HAR-RV
        residuals are not normally distributed — they are right-skewed and leptokurtic. Use a log
        transformation: fit HAR on log(RV) for better residual behavior and prediction intervals.
      </WarningBlock>

      <PythonCode
        title="Realized Volatility from Tick Data"
        code={`import numpy as np
import pandas as pd
import statsmodels.api as sm

# ── Simulate 5-minute intraday prices ────────────────────────────────────────
np.random.seed(42)

def simulate_5min_prices(n_days: int = 252, freq_per_day: int = 78):
    """
    Simulate 5-minute prices with stochastic volatility.
    Returns DataFrame: [datetime, price, log_return]
    """
    rows = []
    price = 100.0
    for day in range(n_days):
        # Daily volatility ~ log-normal
        sigma_day = np.exp(-3.5 + 0.5 * np.random.randn())
        sigma_intra = sigma_day / np.sqrt(freq_per_day)
        date = pd.Timestamp('2022-01-03') + pd.Timedelta(days=day)
        for j in range(freq_per_day):
            ret   = np.random.normal(0, sigma_intra)
            price *= np.exp(ret)
            rows.append({'datetime': date + pd.Timedelta(minutes=5 * (j + 1)),
                          'date': date, 'price': price, 'log_return': ret})
    return pd.DataFrame(rows)

tick_df = simulate_5min_prices()
print(f"Generated {len(tick_df):,} 5-minute observations across {tick_df['date'].nunique()} days")

# ── Compute daily realized variance ──────────────────────────────────────────
def compute_realized_measures(tick_df: pd.DataFrame) -> pd.DataFrame:
    """Compute RV, BPV, and jump component per day."""
    results = []
    for date, group in tick_df.groupby('date'):
        r = group['log_return'].values
        n = len(r)
        if n < 2:
            continue

        # Realized variance
        rv = np.sum(r**2)

        # Bipower variation (jump-robust)
        bpv = (np.pi / 2) * np.sum(np.abs(r[1:]) * np.abs(r[:-1]))

        # Jump component
        jump = max(rv - bpv, 0)

        # Realized semivariances
        rv_plus  = np.sum(r[r > 0]**2)
        rv_minus = np.sum(r[r < 0]**2)

        results.append({
            'date':     date,
            'rv':       rv,
            'rv_ann':   rv * 252,         # annualized variance
            'rvol_ann': np.sqrt(rv * 252), # annualized vol
            'bpv':      bpv,
            'jump':     jump,
            'rv_plus':  rv_plus,
            'rv_minus': rv_minus,
            'n_obs':    n,
        })

    return pd.DataFrame(results).set_index('date')

rv_df = compute_realized_measures(tick_df)
print(f"\\nRealized Vol Summary:")
print(rv_df[['rv', 'rvol_ann', 'bpv', 'jump']].describe().round(6))

# ── HAR-RV model ──────────────────────────────────────────────────────────────
def build_har_features(rv_series: pd.Series, log_transform: bool = True) -> pd.DataFrame:
    """Build daily, weekly, monthly RV features."""
    s = np.log(rv_series.clip(1e-10)) if log_transform else rv_series
    df = pd.DataFrame({'rv_d': s})
    df['rv_w'] = s.rolling(5).mean()   # weekly avg
    df['rv_m'] = s.rolling(22).mean()  # monthly avg
    df['rv_next'] = s.shift(-1)        # 1-step ahead target
    return df.dropna()

har_df = build_har_features(rv_df['rv'])
X = sm.add_constant(har_df[['rv_d', 'rv_w', 'rv_m']])
y = har_df['rv_next']

# Train/test split
n_train = int(len(har_df) * 0.8)
X_train, X_test = X.iloc[:n_train], X.iloc[n_train:]
y_train, y_test = y.iloc[:n_train], y.iloc[n_train:]

model = sm.OLS(y_train, X_train).fit(cov_type='HAC', cov_kwds={'maxlags': 5})
print(f"\\nHAR-RV Model Summary:")
print(model.summary().tables[1])

# Out-of-sample performance
y_pred = model.predict(X_test)
rmse   = np.sqrt(((y_test - y_pred)**2).mean())
r2_oos = 1 - ((y_test - y_pred)**2).sum() / ((y_test - y_test.mean())**2).sum()
print(f"\\nOut-of-sample RMSE (log RV): {rmse:.4f}")
print(f"Out-of-sample R² (log RV):   {r2_oos:.4f}")

# Convert back to annualized vol forecast
y_pred_vol = np.sqrt(np.exp(y_pred) * 252) * 100
print(f"\\nForecast annualized vol (last 5 days):")
print(y_pred_vol.tail().round(2).to_string())

# ── Jump detection test ───────────────────────────────────────────────────────
# Barndorff-Nielsen & Shephard ratio test
rv_arr, bpv_arr = rv_df['rv'].values, rv_df['bpv'].values
tp  = (np.pi/2)**2 + np.pi - 5           # constant ≈ 0.61
j_stat = (rv_arr - bpv_arr) / rv_arr     # jump fraction
jump_days = rv_df[j_stat > 0.3]          # >30% of RV from jumps
print(f"\\nDays with >30% jump contribution: {len(jump_days)} ({len(jump_days)/len(rv_df):.1%})")
`}
      />

      <ReferenceList
        references={[
          {
            author: 'Andersen, T.G., Bollerslev, T., Diebold, F.X., & Labys, P.',
            year: 2003,
            title: 'Modeling and forecasting realized volatility',
            journal: 'Econometrica',
            volume: '71(2)',
            pages: '579–625',
          },
          {
            author: 'Corsi, F.',
            year: 2009,
            title: 'A simple approximate long-memory model of realized volatility',
            journal: 'Journal of Financial Econometrics',
            volume: '7(2)',
            pages: '174–196',
          },
          {
            author: 'Barndorff-Nielsen, O.E. & Shephard, N.',
            year: 2004,
            title: 'Power and bipower variation with stochastic volatility and jumps',
            journal: 'Journal of Financial Econometrics',
            volume: '2(1)',
            pages: '1–37',
          },
        ]}
      />
    </SectionLayout>
  );
}
