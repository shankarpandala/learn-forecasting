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

// Simulated GARCH conditional volatility
const garchData = Array.from({ length: 120 }, (_, i) => {
  const crisis = i >= 50 && i <= 70;
  const shock = i === 52 || i === 65;
  const vol = shock ? 0.045 : crisis ? 0.028 + (Math.random() * 0.01) : 0.012 + (Math.random() * 0.006);
  return {
    t: i + 1,
    returns: (Math.random() - 0.5) * vol * 100,
    cond_vol: vol * 100,
    realized_vol: (vol + (Math.random() - 0.5) * 0.003) * 100,
  };
});

const archEffectData = [
  { lag: 1, acf: 0.32 }, { lag: 2, acf: 0.28 }, { lag: 3, acf: 0.22 },
  { lag: 4, acf: 0.18 }, { lag: 5, acf: 0.15 }, { lag: 6, acf: 0.12 },
  { lag: 7, acf: 0.10 }, { lag: 8, acf: 0.08 },
];

export default function GarchModels() {
  const [modelType, setModelType] = useState('garch11');

  return (
    <SectionLayout
      title="GARCH & EGARCH Volatility Models"
      difficulty="advanced"
      readingTime={40}
      prerequisites={['ARIMA Models', 'Maximum Likelihood Estimation', 'Financial Time Series']}
    >
      <p>
        Financial returns are approximately uncorrelated over time, but their
        <em> squared values</em> are strongly correlated — a property called{' '}
        <strong>volatility clustering</strong>. Large price moves tend to follow large moves,
        and calm periods cluster together. GARCH models capture this time-varying conditional
        variance.
      </p>

      <h2>ARCH Effects: The Stylized Facts</h2>
      <p>
        For a return series <InlineMath math="r_t" />, even if <InlineMath math="E[r_t | r_{t-1}, \ldots] \approx 0" />
        (returns are unpredictable), the conditional variance is highly predictable:
      </p>
      <ul className="list-disc pl-6 my-3 space-y-1">
        <li><strong>Volatility clustering</strong>: high-volatility periods cluster together</li>
        <li><strong>Fat tails</strong>: returns have heavier tails than Gaussian</li>
        <li><strong>Leverage effect</strong>: negative returns increase future volatility more than positive returns of the same magnitude (stocks)</li>
        <li><strong>Mean reversion</strong>: volatility reverts to a long-run mean</li>
      </ul>

      <div className="my-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">ACF of Squared Returns (ARCH effect)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={archEffectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="lag" label={{ value: 'Lag', position: 'insideBottom', offset: -3 }} />
            <YAxis label={{ value: 'ACF(r²)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="acf" fill="#6366f1" name="ACF of r²" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-center text-gray-500 mt-1">
          Significant autocorrelation in squared returns indicates ARCH effects are present.
        </p>
      </div>

      <h2>ARCH(q) Model</h2>
      <p>Engle (1982) proposed the AutoRegressive Conditional Heteroskedasticity model:</p>
      <BlockMath math="r_t = \mu + \varepsilon_t, \quad \varepsilon_t = \sigma_t z_t, \quad z_t \sim \mathcal{N}(0,1)" />
      <BlockMath math="\sigma_t^2 = \omega + \sum_{i=1}^{q} \alpha_i \varepsilon_{t-i}^2" />
      <p>
        where <InlineMath math="\omega > 0" /> and <InlineMath math="\alpha_i \geq 0" />.
        The conditional variance depends on the last q squared innovations. A large
        shock <InlineMath math="\varepsilon_{t-1}^2" /> immediately raises tomorrow's variance.
      </p>

      <h2>GARCH(p, q) Model</h2>
      <p>
        Bollerslev (1986) generalized ARCH by adding lagged variance terms (analogous to
        the MA terms in ARMA):
      </p>
      <BlockMath math="\sigma_t^2 = \omega + \sum_{i=1}^{q} \alpha_i \varepsilon_{t-i}^2 + \sum_{j=1}^{p} \beta_j \sigma_{t-j}^2" />

      <p>In practice, <strong>GARCH(1,1)</strong> is almost universally used:</p>
      <BlockMath math="\sigma_t^2 = \omega + \alpha \varepsilon_{t-1}^2 + \beta \sigma_{t-1}^2" />

      <div className="flex gap-2 my-4">
        {[['garch11', 'GARCH(1,1)'], ['egarch', 'EGARCH'], ['gjr', 'GJR-GARCH']].map(([key, label]) => (
          <button key={key} onClick={() => setModelType(key)}
            className={`px-3 py-1 rounded text-sm font-medium ${modelType === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {modelType === 'garch11' && (
        <div className="bg-indigo-50 rounded-lg p-4 my-4">
          <h3 className="font-semibold mb-2">GARCH(1,1) Properties</h3>
          <ul className="text-sm space-y-2">
            <li><strong>Stationarity:</strong> <InlineMath math="\alpha + \beta < 1" /> required for covariance stationarity</li>
            <li><strong>Persistence:</strong> <InlineMath math="\alpha + \beta" /> close to 1 means shocks persist (common in financial markets: typically 0.97–0.99)</li>
            <li><strong>Long-run variance:</strong> <InlineMath math="\bar{\sigma}^2 = \omega / (1 - \alpha - \beta)" /></li>
            <li><strong>Half-life:</strong> periods for volatility to revert halfway to mean = <InlineMath math="\ln(0.5) / \ln(\alpha + \beta)" /></li>
          </ul>
        </div>
      )}
      {modelType === 'egarch' && (
        <div className="bg-green-50 rounded-lg p-4 my-4">
          <h3 className="font-semibold mb-2">EGARCH (Nelson, 1991)</h3>
          <p className="text-sm mb-2">Models log-variance to ensure positivity without parameter constraints:</p>
          <BlockMath math="\ln \sigma_t^2 = \omega + \beta \ln \sigma_{t-1}^2 + \alpha \left(\frac{|\varepsilon_{t-1}|}{\sigma_{t-1}} - \sqrt{2/\pi}\right) + \gamma \frac{\varepsilon_{t-1}}{\sigma_{t-1}}" />
          <p className="text-sm">The <InlineMath math="\gamma" /> term captures the <strong>leverage effect</strong>: negative returns (γ &lt; 0) increase volatility more than positive returns. Typical equity: γ ≈ −0.1 to −0.3.</p>
        </div>
      )}
      {modelType === 'gjr' && (
        <div className="bg-yellow-50 rounded-lg p-4 my-4">
          <h3 className="font-semibold mb-2">GJR-GARCH (Glosten-Jagannathan-Runkle, 1993)</h3>
          <p className="text-sm mb-2">Adds an indicator for negative shocks:</p>
          <BlockMath math="\sigma_t^2 = \omega + \alpha \varepsilon_{t-1}^2 + \gamma \varepsilon_{t-1}^2 \mathbf{1}[\varepsilon_{t-1} < 0] + \beta \sigma_{t-1}^2" />
          <p className="text-sm">When a negative shock occurs, variance increases by <InlineMath math="(\alpha + \gamma)" /> instead of just α. Simpler than EGARCH while capturing asymmetry. Typical equity: γ ≈ 0.05–0.15.</p>
        </div>
      )}

      <h2>Conditional Volatility Chart</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={garchData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cond_vol" stroke="#6366f1" strokeWidth={2} dot={false} name="GARCH(1,1) Cond. Volatility (%)" />
          <Line type="monotone" dataKey="realized_vol" stroke="#22c55e" strokeWidth={1} strokeDasharray="4 2" dot={false} name="Realized Volatility (%)" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-center text-gray-500 mt-1">
        GARCH conditional volatility tracks realized volatility during the simulated market shock (periods 50–70).
      </p>

      <h2>Volatility Forecasting: Multi-Step Ahead</h2>
      <p>The GARCH(1,1) h-step ahead variance forecast has an analytic form:</p>
      <BlockMath math="\mathbb{E}[\sigma_{t+h}^2 | \mathcal{F}_t] = \bar{\sigma}^2 + (\alpha + \beta)^{h-1} (\sigma_{t+1}^2 - \bar{\sigma}^2)" />
      <p>
        As <InlineMath math="h \to \infty" />, forecasts converge to the unconditional
        variance <InlineMath math="\bar{\sigma}^2" />. The speed of convergence is governed
        by <InlineMath math="(\alpha + \beta)^{h-1}" />.
      </p>

      <h2>Python: arch Library</h2>
      <PythonCode code={`import numpy as np
import pandas as pd
import yfinance as yf
from arch import arch_model

# ── 1. Download financial data ────────────────────────────────────────
ticker = 'SPY'
data = yf.download(ticker, start='2018-01-01', end='2024-01-01', progress=False)
returns = 100 * data['Adj Close'].pct_change().dropna()
print(f"Mean: {returns.mean():.4f}%, Std: {returns.std():.4f}%")

# ── 2. Test for ARCH effects (Ljung-Box on squared returns) ───────────
from statsmodels.stats.diagnostic import acorr_ljungbox
lb_test = acorr_ljungbox(returns ** 2, lags=[10, 20], return_df=True)
print("Ljung-Box test on r² (p-values):")
print(lb_test['lb_pvalue'])  # p < 0.05 confirms ARCH effects`} />

      <PythonCode code={`# ── 3. Fit GARCH(1,1) ────────────────────────────────────────────────
garch = arch_model(
    returns,
    vol='Garch',    # GARCH variance model
    p=1, q=1,       # GARCH(1,1)
    mean='AR',      # AR(1) mean model (or 'Constant')
    dist='t',       # Student-t innovations (fat tails)
)
res_garch = garch.fit(disp='off')
print(res_garch.summary())
#                  coef    std err         t      P>|t|
# mu            0.0412      0.012     3.41      0.001
# ar.L1        -0.0215      0.018    -1.20      0.231
# omega         0.0153      0.004     3.72      0.000
# alpha[1]      0.0892      0.012     7.62      0.000
# beta[1]       0.9021      0.015    60.5       0.000
# nu            5.82        0.55     10.6       0.000   (t-dist df)

print(f"Persistence (α+β): {res_garch.params['alpha[1]'] + res_garch.params['beta[1]']:.4f}")
# Typical value: 0.98 — very persistent volatility`} />

      <PythonCode code={`# ── 4. Fit EGARCH and GJR-GARCH ──────────────────────────────────────
egarch = arch_model(returns, vol='EGarch', p=1, q=1, mean='Constant', dist='t')
res_egarch = egarch.fit(disp='off')
gamma = res_egarch.params.get('gamma[1]', res_egarch.params.get('gamma'))
print(f"EGARCH gamma (leverage): {gamma:.4f}")   # negative = leverage effect

gjr = arch_model(returns, vol='Garch', p=1, o=1, q=1, mean='Constant', dist='t')
res_gjr = gjr.fit(disp='off')
print(f"GJR-GARCH gamma: {res_gjr.params['gamma[1]']:.4f}")  # > 0 confirms asymmetry`} />

      <PythonCode code={`# ── 5. Forecast volatility ────────────────────────────────────────────
horizon = 22  # ~1 month of trading days
forecast = res_garch.forecast(horizon=horizon, reindex=False)

# forecast.variance contains h-step ahead variance forecasts
vol_forecast = np.sqrt(forecast.variance.values[-1]) * np.sqrt(252)  # annualized
print("Annualized volatility forecast (next 22 days):")
for h, v in enumerate(vol_forecast[:5], 1):
    print(f"  t+{h}: {v:.2f}%")

# ── 6. Value at Risk from GARCH ───────────────────────────────────────
from scipy.stats import t as t_dist

alpha_var = 0.01  # 1% VaR
nu = res_garch.params['nu']   # estimated t-distribution d.f.
next_day_vol = np.sqrt(forecast.variance.values[-1, 0])  # 1-day ahead std (in %)

# Parametric VaR using t-distribution
t_quantile = t_dist.ppf(alpha_var, df=nu)
var_1pct = -(res_garch.params['mu'] + t_quantile * next_day_vol * np.sqrt(nu / (nu - 2)))
print(f"\\n1-day 1% parametric VaR: {var_1pct:.3f}%")  # e.g., 2.1% daily loss`} />

      <PythonCode code={`# ── 7. Rolling volatility forecasts (walk-forward) ───────────────────
rolling_vol = []
window = 252  # 1-year rolling window

for i in range(window, len(returns), 5):  # step 5 days (weekly refit)
    train = returns.iloc[i - window:i]
    model = arch_model(train, vol='Garch', p=1, q=1, mean='Constant', dist='t')
    result = model.fit(disp='off')
    fc = result.forecast(horizon=5, reindex=False)
    for h in range(5):
        if i + h < len(returns):
            rolling_vol.append({
                'date': returns.index[i + h],
                'garch_vol': np.sqrt(fc.variance.values[-1, h]),
                'actual_return': returns.iloc[i + h],
            })

vol_df = pd.DataFrame(rolling_vol)
# Correlation between GARCH vol forecast and |actual return| (should be positive)
corr = vol_df['garch_vol'].corr(vol_df['actual_return'].abs())
print(f"Forecast-realized vol correlation: {corr:.3f}")`} />

      <TheoremBlock title="Integrated GARCH and Long Memory">
        When <InlineMath math="\alpha + \beta = 1" />, the GARCH process is integrated
        (IGARCH). The variance forecast does not revert to a finite unconditional mean —
        shocks persist forever. This is observed empirically at very high frequency (tick
        data) and during regime changes. FIGARCH (Fractionally Integrated GARCH) provides
        a middle ground between standard GARCH and IGARCH for series with long memory
        in volatility.
      </TheoremBlock>

      <NoteBlock>
        Student-t innovations (<code>dist='t'</code>) almost always outperform Gaussian
        for financial returns. The estimated degrees-of-freedom parameter ν captures
        tail heaviness; typical values for equity returns are 4–8. Normal distribution
        corresponds to ν → ∞.
      </NoteBlock>

      <WarningBlock>
        GARCH models assume that the mean return is close to zero and model only the
        second moment (variance). They cannot capture jumps (large discontinuous price
        moves), regime changes, or long-run trends in returns. For option pricing or
        risk management, extend with jump-diffusion or Markov-switching GARCH.
      </WarningBlock>

      <ReferenceList references={[
        {
          authors: 'Engle, R.F.',
          year: 1982,
          title: 'Autoregressive conditional heteroscedasticity with estimates of the variance of United Kingdom inflation',
          journal: 'Econometrica',
          volume: '50(4)',
          pages: '987–1007',
        },
        {
          authors: 'Bollerslev, T.',
          year: 1986,
          title: 'Generalized autoregressive conditional heteroskedasticity',
          journal: 'Journal of Econometrics',
          volume: '31(3)',
          pages: '307–327',
        },
        {
          authors: 'Nelson, D.B.',
          year: 1991,
          title: 'Conditional heteroskedasticity in asset returns: A new approach',
          journal: 'Econometrica',
          volume: '59(2)',
          pages: '347–370',
        },
      ]} />
    </SectionLayout>
  );
}
