import { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Demo tabular representation of lag features
const SERIES = [10, 13, 11, 15, 14, 18, 17, 20, 19, 22];

function LagFeatureTable() {
  const [maxLag, setMaxLag] = useState(3);

  const rows = SERIES.map((y, i) => {
    const row = { t: i + 1, y };
    for (let lag = 1; lag <= maxLag; lag++) {
      row[`lag_${lag}`] = i - lag >= 0 ? SERIES[i - lag] : null;
    }
    // rolling mean (window 3)
    row['roll_mean_3'] = i >= 2 ? parseFloat(((SERIES[i-2] + SERIES[i-1] + SERIES[i]) / 3).toFixed(2)) : null;
    row['roll_std_3'] = i >= 2 ? parseFloat((Math.sqrt(((SERIES[i-2] - row['roll_mean_3'])**2 + (SERIES[i-1] - row['roll_mean_3'])**2 + (SERIES[i] - row['roll_mean_3'])**2) / 2)).toFixed(2)) : null;
    return row;
  });

  const allKeys = ['t', 'y', ...Array.from({ length: maxLag }, (_, i) => `lag_${i+1}`), 'roll_mean_3', 'roll_std_3'];

  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">
        Interactive: Tabularizing a Time Series into Lag Features
      </h3>
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-zinc-400">
          Max lag: <span className="text-sky-400 font-bold">{maxLag}</span>
        </label>
        <input type="range" min={1} max={6} value={maxLag} onChange={e => setMaxLag(Number(e.target.value))} className="w-40 accent-sky-500" />
      </div>
      <div className="overflow-x-auto">
        <table className="text-xs text-zinc-300 border-collapse">
          <thead>
            <tr className="bg-zinc-800">
              {allKeys.map(k => (
                <th key={k} className={`border border-zinc-700 px-3 py-2 font-mono whitespace-nowrap ${k === 'y' ? 'text-white bg-sky-900' : k.startsWith('lag') ? 'text-amber-300' : k.startsWith('roll') ? 'text-emerald-300' : ''}`}>
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-zinc-800/50'}>
                {allKeys.map(k => (
                  <td key={k} className={`border border-zinc-700 px-3 py-1 text-center ${row[k] === null ? 'text-zinc-600 italic' : k === 'y' ? 'text-white font-medium' : k.startsWith('lag') ? 'text-amber-200' : k.startsWith('roll') ? 'text-emerald-200' : ''}`}>
                    {row[k] === null ? 'NaN' : row[k]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-zinc-500 mt-2">
        NaN rows (shown in gray) must be dropped or imputed before training. White = target (y_t), amber = lag features, green = window statistics.
      </p>
    </div>
  );
}

const pythonCode = `# Lag Features & Window Statistics for ML Forecasting
# pip install pandas numpy scikit-learn

import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error

# ── 1. Load data ──────────────────────────────────────────────────────────────
np.random.seed(42)
n = 200
t = np.arange(n)
y = 50 + 0.3*t + 5*np.sin(2*np.pi*t/12) + np.random.normal(0, 3, n)
ts = pd.Series(y, index=pd.date_range('2016-01', periods=n, freq='MS'), name='y')

# ── 2. Create lag features ────────────────────────────────────────────────────
def create_lag_features(series, lags):
    df = pd.DataFrame({'y': series})
    for lag in lags:
        df[f'lag_{lag}'] = series.shift(lag)
    return df

lags = [1, 2, 3, 6, 12]  # selected lags (use ACF/PACF to guide this)
df = create_lag_features(ts, lags)
print("Lag features created:")
print(df.head(15))

# ── 3. Rolling window statistics ─────────────────────────────────────────────
# ALL rolling windows must use min_periods or they'll look ahead!
# shift(1) ensures we only use data available at time t-1

windows = [3, 6, 12]
for w in windows:
    shifted = ts.shift(1)  # avoid leakage: use data up to t-1
    df[f'roll_mean_{w}'] = shifted.rolling(w).mean()
    df[f'roll_std_{w}']  = shifted.rolling(w).std()
    df[f'roll_min_{w}']  = shifted.rolling(w).min()
    df[f'roll_max_{w}']  = shifted.rolling(w).max()
    df[f'roll_skew_{w}'] = shifted.rolling(w).skew()

# ── 4. Expanding window features ─────────────────────────────────────────────
# Expanding = use all available history up to t-1
shifted = ts.shift(1)
df['expand_mean'] = shifted.expanding().mean()
df['expand_std']  = shifted.expanding().std()

# ── 5. Calendar features (date-based) ────────────────────────────────────────
df['month']       = df.index.month
df['quarter']     = df.index.quarter
df['month_sin']   = np.sin(2 * np.pi * df.index.month / 12)   # cyclic encoding
df['month_cos']   = np.cos(2 * np.pi * df.index.month / 12)

# ── 6. Drop NaN rows (from lags) ─────────────────────────────────────────────
df_clean = df.dropna()
print(f"\\nShape after dropping NaN: {df_clean.shape}")
print(f"Lost {len(df) - len(df_clean)} rows due to lags")

# ── 7. Train/test split (time-ordered!) ─────────────────────────────────────
cutoff = int(len(df_clean) * 0.8)
X = df_clean.drop(columns=['y'])
y_col = df_clean['y']

X_train, X_test = X.iloc[:cutoff], X.iloc[cutoff:]
y_train, y_test = y_col.iloc[:cutoff], y_col.iloc[cutoff:]

# ── 8. Fit Ridge regression ──────────────────────────────────────────────────
model = Ridge(alpha=1.0)
model.fit(X_train, y_train)
preds = model.predict(X_test)

mae = mean_absolute_error(y_test, preds)
print(f"\\nTest MAE: {mae:.3f}")
print("Feature importances (abs coefficients):")
importance = pd.Series(np.abs(model.coef_), index=X.columns).sort_values(ascending=False)
print(importance.head(10))

# ── 9. Feature selection using ACF/PACF ─────────────────────────────────────
from statsmodels.tsa.stattools import acf, pacf
acf_values  = acf(ts, nlags=15, alpha=0.05)
pacf_values = pacf(ts, nlags=15, alpha=0.05)

# Lags where PACF is significant suggest AR terms → use as lag features
sig_lags = [lag for lag in range(1, 16)
            if abs(pacf_values[0][lag]) > 1.96 / np.sqrt(len(ts))]
print("\\nSignificant PACF lags (suggested lag features):", sig_lags)

# ── 10. Data leakage check ────────────────────────────────────────────────────
def check_leakage(df, target_col):
    """Verify all features are computed from past data only."""
    corr_with_target = df.corr()[target_col].sort_values(ascending=False)
    print("\\nTop correlations with target (check for suspiciously high values):")
    print(corr_with_target.head(10))
    # Perfect correlation (1.0) with a feature other than the target itself is a red flag
    suspicious = corr_with_target[(corr_with_target > 0.995) & (corr_with_target.index != target_col)]
    if len(suspicious) > 0:
        print("WARNING: Potential data leakage detected!")
        print(suspicious)

check_leakage(df_clean, 'y')
`;

const references = [
  {
    label: 'Cerqueira 2020',
    title: 'Machine Learning vs Statistical Methods for Time Series Forecasting',
    authors: 'Cerqueira, V., Torgo, L., & Mozetic, I.',
    year: 2020,
    url: 'https://arxiv.org/abs/1911.07549',
  },
  {
    label: 'pandas shift',
    title: 'pandas.Series.shift — pandas documentation',
    authors: 'pandas development team',
    year: 2023,
    url: 'https://pandas.pydata.org/docs/reference/api/pandas.Series.shift.html',
  },
];

export default function LagFeatures() {
  return (
    <SectionLayout
      title="Lag Features & Window Statistics"
      difficulty="intermediate"
      readingTime={20}
      prerequisites={['Supervised learning basics', 'ACF and PACF']}
    >
      <p>
        Machine learning algorithms expect tabular input — a feature matrix <InlineMath math="X" />{' '}
        and target vector <InlineMath math="y" />. Time series are sequential. The key insight
        for ML forecasting: <strong>convert the time series to supervised learning format
        using lag features</strong>.
      </p>

      <h2>1. The Tabularization Trick</h2>
      <DefinitionBlock
        label="Definition"
        title="Time Series to Supervised Learning"
        definition="For a h-step-ahead forecasting problem, the target at row t is y_{t+h} and the features are past values and statistics computed from history up to time t."
        notation="\underbrace{y_{t+h}}_{\text{target}} = f\!\left(\underbrace{y_t, y_{t-1}, \ldots, y_{t-p}}_{\text{lag features}},\; \underbrace{\bar{y}_{t-w:t}}_{\text{window stats}},\; \underbrace{\text{calendar}}_{\text{month, dow}}\right)"
      />
      <p>
        This transformation is sometimes called the <strong>"sliding window" or "tabular
        conversion"</strong>. Any supervised learning model (XGBoost, LightGBM, Random
        Forest, Ridge, Neural Network) can then be applied.
      </p>

      <h2>2. Lag Features</h2>
      <p>
        Lag features are simply the time series shifted by <InlineMath math="k" /> periods:
      </p>
      <BlockMath math="x_{t,k} = y_{t-k}, \quad k = 1, 2, \ldots, p" />
      <p>
        The lag order <InlineMath math="p" /> determines how far back the model looks.
        Guidance: use PACF to identify significant lags (where PACF exceeds ±1.96/√T).
      </p>

      <h2>3. Rolling Window Statistics</h2>
      <BlockMath math="\bar{y}^{(w)}_t = \frac{1}{w}\sum_{j=1}^{w} y_{t-j}, \quad \sigma^{(w)}_t = \sqrt{\frac{1}{w-1}\sum_{j=1}^{w}(y_{t-j} - \bar{y}^{(w)}_t)^2}" />
      <p>Common rolling features:</p>
      <ul>
        <li><strong>Rolling mean</strong>: captures local level</li>
        <li><strong>Rolling std</strong>: captures local volatility</li>
        <li><strong>Rolling min/max</strong>: captures range</li>
        <li><strong>Rolling skew</strong>: captures distributional shape</li>
      </ul>
      <p>
        Always shift by 1 (<code>series.shift(1).rolling(w)</code>) before computing
        rolling statistics to prevent data leakage.
      </p>

      <h2>4. Expanding Window Statistics</h2>
      <p>
        Expanding windows accumulate all history up to time <InlineMath math="t" />:
      </p>
      <BlockMath math="\text{ExpandMean}_t = \frac{1}{t}\sum_{j=1}^{t} y_j" />
      <p>
        Useful for capturing long-run averages and trend information without arbitrary
        window sizes.
      </p>

      <h2>Interactive: Feature Table</h2>
      <LagFeatureTable />

      <h2>5. Data Leakage: The #1 Mistake</h2>
      <WarningBlock title="Prevent Data Leakage at All Costs">
        Data leakage occurs when features use information from the future that would not
        be available at prediction time. Common leakage sources:
        <ul className="mt-2 space-y-1">
          <li>Rolling statistics computed on the current value instead of past values (<code>shift(1)</code> missing)</li>
          <li>Target encoding computed on the full dataset before train/test split</li>
          <li>Scaling/normalization fitted on combined train+test data</li>
          <li>Using future exogenous variables (e.g., tomorrow's weather)</li>
        </ul>
        Leakage produces unrealistically good CV scores and catastrophically bad production performance.
      </WarningBlock>

      <h2>6. Lag Selection via ACF/PACF</h2>
      <p>
        Not all lags are informative. Adding too many lags increases model complexity and
        may introduce noise. Two practical approaches:
      </p>
      <ul>
        <li>
          <strong>PACF-based</strong>: Include lags where PACF is statistically significant
          (|PACF| &gt; 1.96/√T). This mirrors AR model order selection.
        </li>
        <li>
          <strong>Importance-based</strong>: Fit a LightGBM model with many lags, then
          prune based on feature importance (gain or SHAP values).
        </li>
      </ul>

      <NoteBlock type="tip" title="Seasonal Lags">
        Always include the seasonal lag (lag 12 for monthly, lag 7 for daily). The seasonal
        lag alone is equivalent to the seasonal naïve model — a strong baseline. If the
        ML model cannot improve on this, something is wrong.
      </NoteBlock>

      <h2>Python: Complete Feature Engineering Pipeline</h2>
      <PythonCode
        code={pythonCode}
        filename="lag_features.py"
        title="Lag features, rolling statistics, and leakage prevention"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
