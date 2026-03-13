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

const fourierCode = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX

# ── Synthetic monthly data: trend + two harmonics ──────────────────────────
np.random.seed(42)
t = np.arange(1, 121)          # 10 years of monthly observations
m = 12                          # seasonal period

trend    = 0.05 * t
season1  = 3.0 * np.sin(2 * np.pi * t / m) + 2.0 * np.cos(2 * np.pi * t / m)
season2  = 1.0 * np.sin(4 * np.pi * t / m) + 0.5 * np.cos(4 * np.pi * t / m)
noise    = np.random.normal(0, 0.5, len(t))
y        = 20 + trend + season1 + season2 + noise

dates  = pd.date_range('2014-01', periods=120, freq='MS')
series = pd.Series(y, index=dates)

# ── Helper: build K Fourier pairs ──────────────────────────────────────────
def fourier_terms(t_arr, period, K):
    """Return DataFrame with K sin/cos pairs for the given period."""
    cols = {}
    for k in range(1, K + 1):
        cols[f'sin{k}'] = np.sin(2 * np.pi * k * t_arr / period)
        cols[f'cos{k}'] = np.cos(2 * np.pi * k * t_arr / period)
    return pd.DataFrame(cols)

# ── Model selection: compare K = 1 … 4 ───────────────────────────────────
print(f"{'K':>3}  {'AIC':>10}  {'BIC':>10}  {'params':>8}")
print("-" * 38)
best_K, best_aic = None, np.inf
for K in range(1, 5):
    Xtr = fourier_terms(t, m, K)
    Xtr['trend'] = t
    Xtr.index = dates
    fit = SARIMAX(series, exog=Xtr, order=(0, 0, 0), trend='c').fit(disp=False)
    n_params = 1 + 1 + 2 * K          # intercept + trend + fourier
    print(f"{K:>3}  {fit.aic:>10.2f}  {fit.bic:>10.2f}  {n_params:>8}")
    if fit.aic < best_aic:
        best_aic, best_K = fit.aic, K

print(f"\\nBest K by AIC: {best_K}")

# ── Fit best model and forecast 24 months ─────────────────────────────────
Xtr_best = fourier_terms(t, m, best_K)
Xtr_best['trend'] = t
Xtr_best.index = dates
model_best = SARIMAX(series, exog=Xtr_best, order=(0, 0, 0), trend='c').fit(disp=False)

h = 24
t_fc = np.arange(121, 121 + h)
Xfc  = fourier_terms(t_fc, m, best_K)
Xfc['trend'] = t_fc
Xfc.index = pd.date_range('2024-01', periods=h, freq='MS')

fc      = model_best.get_forecast(steps=h, exog=Xfc)
fc_mean = fc.predicted_mean
fc_ci   = fc.conf_int()

# ── Multiple seasonal periods (daily data: weekly + annual) ───────────────
# For illustration only – no actual fitting here
t_daily = np.arange(1, 731)     # 2 years of daily data

def multi_fourier(t_arr, periods_K):
    """periods_K: list of (period, K) tuples."""
    frames = []
    for period, K in periods_K:
        df = fourier_terms(t_arr, period, K)
        df.columns = [f'p{period}_{c}' for c in df.columns]
        frames.append(df)
    return pd.concat(frames, axis=1)

X_daily = multi_fourier(t_daily, [(7, 3), (365.25, 5)])
print(f"\\nDaily feature matrix shape: {X_daily.shape}")
print("Columns:", list(X_daily.columns)[:8], "...")

# ── statsforecast AutoARIMA with Fourier seasonality ──────────────────────
# pip install statsforecast
try:
    from statsforecast import StatsForecast
    from statsforecast.models import AutoARIMA

    df_sf = pd.DataFrame({'unique_id': 'demo', 'ds': dates, 'y': y})
    sf = StatsForecast(models=[AutoARIMA(season_length=12)], freq='MS', n_jobs=1)
    sf.fit(df_sf)
    pred = sf.predict(h=24, level=[80, 95])
    print("\\nstatsforecast forecast (head):")
    print(pred.head())
except ImportError:
    print("\\nInstall statsforecast: pip install statsforecast")
`;

const references = [
  {
    title: 'Forecasting: Principles and Practice (3rd ed.) — Fourier Series',
    author: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/useful-predictors.html#fourier-series'
  },
  {
    title: 'Time Series Analysis: Forecasting and Control (5th ed.)',
    author: 'Box, G.E.P., Jenkins, G.M., Reinsel, G.C. & Ljung, G.M.',
    year: 2015,
    url: 'https://www.wiley.com/en-us/9781118675021'
  },
  {
    title: 'statsmodels SARIMAX Documentation',
    author: 'Seabold, S. & Perktold, J.',
    year: 2023,
    url: 'https://www.statsmodels.org/stable/generated/statsmodels.tsa.statespace.sarimax.SARIMAX.html'
  },
  {
    title: 'StatsForecast Documentation',
    author: 'Nixtla',
    year: 2024,
    url: 'https://nixtlaverse.nixtla.io/statsforecast/index.html'
  }
];

export default function FourierTerms() {
  const [selectedK, setSelectedK] = useState(2);

  const kDescriptions = {
    1: 'Captures only the fundamental frequency — a pure sinusoidal wave. Suitable for very smooth, symmetric seasonal patterns.',
    2: 'Adds the second harmonic, allowing asymmetric or double-peaked seasonal shapes. Often optimal for monthly data.',
    3: 'Third harmonic captures narrower peaks and troughs. Useful when seasonality has a sharp spike (e.g., holiday retail).',
    4: 'Fine-grained seasonal control. Rarely needed for monthly data; more useful with weekly or sub-weekly periods.',
    5: 'Very detailed seasonal representation. With m=12, approaching diminishing returns.',
    6: 'Maximum for monthly data (m=12). Equivalent to 11 seasonal dummy variables — full seasonal flexibility.'
  };

  return (
    <SectionLayout
      title="Fourier Terms for Seasonality"
      difficulty="intermediate"
      readingTime={10}
    >
      <p>
        Seasonal dummy variables are the classic way to model periodic patterns, but they become
        impractical for high-frequency data. Monthly data needs 11 dummies; weekly data needs 51;
        daily data with annual seasonality needs 364. <strong>Fourier terms</strong> offer a
        parsimonious alternative: they approximate any periodic shape with far fewer parameters by
        representing seasonality as a truncated sum of sine and cosine waves.
      </p>

      <DefinitionBlock term="Fourier Series for Seasonality">
        A truncated Fourier series with <InlineMath math="K" /> terms approximates a periodic
        seasonal pattern with period <InlineMath math="m" /> as:
        <BlockMath math="S_K(t) = \sum_{k=1}^{K} \left[ \alpha_k \sin\!\left(\frac{2\pi k\, t}{m}\right) + \beta_k \cos\!\left(\frac{2\pi k\, t}{m}\right) \right]" />
        where <InlineMath math="k" /> indexes the harmonic number, <InlineMath math="m" /> is the
        seasonal period (e.g., 12 for monthly, 52 for weekly, 365.25 for daily with annual
        seasonality), and <InlineMath math="\alpha_k, \beta_k" /> are regression coefficients
        estimated from data.
      </DefinitionBlock>

      <p>
        Embedding this in a regression with a linear trend gives the standard Fourier regression
        model:
      </p>
      <BlockMath math="y_t = \beta_0 + \beta_1\, t + \sum_{k=1}^{K} \left[ \alpha_k \sin\!\left(\frac{2\pi k\, t}{m}\right) + \beta_k \cos\!\left(\frac{2\pi k\, t}{m}\right) \right] + \varepsilon_t" />
      <p>
        This model has only <InlineMath math="2 + 2K" /> parameters regardless of{' '}
        <InlineMath math="m" />, making it highly efficient for long or non-integer seasonal periods.
      </p>

      <h2>Advantages Over Seasonal Dummies</h2>
      <p>
        The table below compares the number of parameters required to represent full seasonality
        using dummies versus Fourier terms at various common periods:
      </p>
      <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>Data frequency</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e2e8f0' }}>Period m</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e2e8f0' }}>Seasonal dummies</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e2e8f0' }}>Fourier K=3</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e2e8f0' }}>Fourier K=5</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Monthly', 12, 11, 6, 10],
              ['Weekly', 52, 51, 6, 10],
              ['Daily (weekly)', 7, 6, 6, '—'],
              ['Daily (annual)', 365, 364, 6, 10],
              ['Hourly (daily)', 24, 23, 6, 10],
            ].map(([freq, m, dum, f3, f5], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                <td style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>{freq}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e2e8f0' }}>{m}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e2e8f0' }}>{dum}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e2e8f0', color: '#16a34a', fontWeight: 'bold' }}>{f3}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e2e8f0', color: '#16a34a', fontWeight: 'bold' }}>{f5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Choosing K: The Key Tuning Parameter</h2>
      <p>
        Selecting <InlineMath math="K" /> balances bias (too few terms under-fit) against variance
        (too many terms overfit). The standard approach is to compare models across{' '}
        <InlineMath math="K = 1, 2, \ldots, \lfloor m/2 \rfloor" /> using information criteria.
      </p>

      <TheoremBlock
        title="Maximum K Constraint"
        proof="The discrete Fourier transform of a sequence of length m has exactly floor(m/2) distinct positive frequencies. Adding Fourier pairs beyond K = floor(m/2) introduces exact linear dependencies among the regressors, making the design matrix rank-deficient."
      >
        The maximum useful value is <InlineMath math="K_{\max} = \lfloor m/2 \rfloor" />. At
        this maximum, the Fourier terms span the same column space as a full set of{' '}
        <InlineMath math="m - 1" /> seasonal dummy variables, so nothing is gained beyond
        <InlineMath math="K_{\max}" />.
      </TheoremBlock>

      <div style={{ margin: '1.5rem 0', padding: '1.25rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
        <strong style={{ display: 'block', marginBottom: '0.75rem' }}>Interactive: Explore K values</strong>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {[1, 2, 3, 4, 5, 6].map(k => (
            <button
              key={k}
              onClick={() => setSelectedK(k)}
              style={{
                padding: '0.3rem 0.9rem',
                background: selectedK === k ? '#0ea5e9' : '#e0f2fe',
                color: selectedK === k ? 'white' : '#0369a1',
                border: `1px solid ${selectedK === k ? '#0284c7' : '#7dd3fc'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: selectedK === k ? 'bold' : 'normal'
              }}
            >
              K={k}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>
          <strong>K={selectedK}</strong> uses <strong>{2 * selectedK} seasonal parameters</strong>{' '}
          (vs. 11 for monthly seasonal dummies).
          <br />
          {kDescriptions[selectedK]}
        </div>
      </div>

      <NoteBlock title="Model Selection Criteria">
        <ul>
          <li><strong>AIC / AICc:</strong> Preferred for forecasting. AICc adds a small-sample correction
            <InlineMath math="\text{AICc} = \text{AIC} + \frac{2k(k+1)}{n-k-1}" /> and is recommended when
            <InlineMath math="n/k < 40" />.</li>
          <li><strong>BIC:</strong> Penalises complexity more strongly; produces more parsimonious models.
            Best when the true model is in the candidate set.</li>
          <li><strong>Time-series cross-validation:</strong> Most reliable, but computationally expensive
            for large grids of K.</li>
        </ul>
      </NoteBlock>

      <h2>Multiple Seasonal Periods</h2>
      <p>
        A decisive advantage of Fourier terms over dummies is that multiple periodic patterns can be
        modelled simultaneously by simply concatenating Fourier pairs for each period. For daily
        electricity consumption with both weekly (<InlineMath math="m_1 = 7" />) and annual
        (<InlineMath math="m_2 = 365.25" />) seasonality:
      </p>
      <BlockMath math="y_t = \beta_0 + \beta_1 t + \sum_{k=1}^{K_1}\!\left[\alpha_k^{(7)}\sin\!\tfrac{2\pi k t}{7} + \beta_k^{(7)}\cos\!\tfrac{2\pi k t}{7}\right] + \sum_{k=1}^{K_2}\!\left[\alpha_k^{(365)}\sin\!\tfrac{2\pi k t}{365} + \beta_k^{(365)}\cos\!\tfrac{2\pi k t}{365}\right] + \varepsilon_t" />
      <p>
        With <InlineMath math="K_1 = 3" /> and <InlineMath math="K_2 = 5" />, this captures both
        patterns using only <strong>16 seasonal parameters</strong>, far fewer than the{' '}
        <InlineMath math="6 + 364 = 370" /> needed by seasonal dummies.
      </p>

      <NoteBlock title="Non-Integer Periods">
        The average Gregorian year is 365.25 days, making the annual period non-integer for daily
        data. Seasonal dummy variables cannot represent this. Fourier terms handle non-integer{' '}
        <InlineMath math="m" /> naturally because <InlineMath math="\sin(2\pi k t / 365.25)" />{' '}
        is perfectly well-defined for any real <InlineMath math="m" />.
      </NoteBlock>

      <ExampleBlock title="Monthly Retail Sales: Selecting K">
        Suppose we have 120 months of retail sales. We fit Fourier regression models with
        K=1 to K=6 and record AIC values (hypothetical):
        <br /><br />
        K=1: AIC=412.3, K=2: AIC=378.1, K=3: AIC=376.4, K=4: AIC=378.0, K=5: AIC=379.8, K=6: AIC=381.2.
        <br /><br />
        Minimum AIC is at K=3 (376.4), but K=2 is only 1.7 units worse. Following the rule of
        choosing the model within 2 AIC units of the minimum with fewest parameters, we select K=2.
        This captures the main annual cycle (K=1) plus a secondary harmonic that allows for
        asymmetry between the rise into the Christmas peak and the post-holiday dip.
      </ExampleBlock>

      <h2>Combining Fourier Terms with ARIMA Errors</h2>
      <p>
        Plain OLS Fourier regression assumes uncorrelated errors. In practice, time series residuals
        are autocorrelated after removing trend and seasonality. The solution is to let the errors
        follow an ARIMA process:
      </p>
      <BlockMath math="y_t = \mathbf{x}_t'\boldsymbol{\gamma} + \eta_t, \qquad \phi(B)(1-B)^d \eta_t = \theta(B)\varepsilon_t" />
      <p>
        where <InlineMath math="\mathbf{x}_t" /> contains the Fourier terms and any other
        regressors. This is called <strong>dynamic harmonic regression</strong> and is covered in
        the next section.
      </p>

      <WarningBlock title="Spurious Regression with Non-Stationary Series">
        If <InlineMath math="y_t" /> has a unit root, OLS on Fourier regressors alone can produce
        spuriously significant coefficients. Always test for stationarity first (ADF or KPSS test).
        If the series is I(1), either difference it before adding Fourier regressors or use
        regression with ARIMA(p,1,q) errors.
      </WarningBlock>

      <h2>Fourier Terms in Machine Learning Models</h2>
      <p>
        Fourier features are not limited to linear models. They are powerful inputs for gradient
        boosted trees (LightGBM, XGBoost) and neural networks, because these models cannot
        extrapolate sinusoidal patterns from categorical time features alone. Adding Fourier columns
        to the feature matrix gives the model an explicit periodic signal.
      </p>

      <PythonCode code={fourierCode} title="Fourier Terms: statsmodels SARIMAX + statsforecast" />

      <h2>Summary</h2>
      <ul>
        <li>
          Fourier terms represent seasonality as a sum of <InlineMath math="K" /> sine/cosine
          pairs, using only <InlineMath math="2K" /> parameters regardless of the period length.
        </li>
        <li>
          They outperform seasonal dummies for long periods (weekly, daily, sub-daily) and
          non-integer periods such as 365.25.
        </li>
        <li>
          Multiple seasonal periods are handled by concatenating separate Fourier pairs for each
          period.
        </li>
        <li>
          <InlineMath math="K" /> is selected by AIC/BIC; the maximum is{' '}
          <InlineMath math="\lfloor m/2 \rfloor" />.
        </li>
        <li>
          Pair with ARIMA errors (dynamic harmonic regression) to handle residual autocorrelation.
        </li>
      </ul>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
