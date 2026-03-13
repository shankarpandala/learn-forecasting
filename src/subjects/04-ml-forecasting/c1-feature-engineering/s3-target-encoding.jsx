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

function RollingWindowDemo() {
  const [window, setWindow] = useState(3);
  const series = [10, 13, 11, 15, 14, 18, 17, 20, 19, 22];
  const rows = series.map((y, i) => {
    const lag1 = i >= 1 ? series[i - 1] : null;
    const lag2 = i >= 2 ? series[i - 2] : null;
    const lag3 = i >= 3 ? series[i - 3] : null;
    const w = series.slice(Math.max(0, i - window + 1), i + 1);
    const mean = w.length === window ? (w.reduce((a, b) => a + b, 0) / window).toFixed(2) : null;
    const std = w.length === window
      ? Math.sqrt(w.map(v => (v - mean) ** 2).reduce((a, b) => a + b, 0) / (window - 1)).toFixed(2)
      : null;
    return { t: i + 1, y, lag1, lag2, lag3, mean, std };
  });
  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Interactive: Lag + Rolling Features</h3>
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-zinc-400">Rolling window: <span className="text-sky-400 font-bold">{window}</span></label>
        <input type="range" min={2} max={5} value={window} onChange={e => setWindow(Number(e.target.value))} className="w-40 accent-sky-500" />
      </div>
      <div className="overflow-x-auto">
        <table className="text-xs text-zinc-300 border-collapse">
          <thead><tr className="bg-zinc-800">
            {['t','y','lag_1','lag_2','lag_3',`roll_mean_${window}`,`roll_std_${window}`].map(h => (
              <th key={h} className={`border border-zinc-700 px-3 py-2 font-mono whitespace-nowrap ${h==='y'?'text-white bg-sky-900':h.startsWith('lag')?'text-amber-300':h.startsWith('roll')?'text-emerald-300':''}`}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{rows.map(r => (
            <tr key={r.t} className="hover:bg-zinc-800">
              {[r.t, r.y, r.lag1, r.lag2, r.lag3, r.mean, r.std].map((v, j) => (
                <td key={j} className="border border-zinc-700 px-3 py-1 text-center font-mono">{v ?? <span className="text-zinc-600">NaN</span>}</td>
              ))}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

const lagFeaturesCode = `import pandas as pd
import numpy as np

def add_lag_features(df: pd.DataFrame, target: str, lags: list) -> pd.DataFrame:
    """Add lag features for a single time series."""
    df = df.copy().sort_values('ds')
    for lag in lags:
        df[f'{target}_lag_{lag}'] = df[target].shift(lag)
    return df

# Usage: daily sales with lags 1, 7, 14, 28 (day-of-week and month-of-year anchors)
df = pd.DataFrame({
    'ds': pd.date_range('2023-01-01', periods=90, freq='D'),
    'y':  np.random.randn(90).cumsum() + 100,
})
df = add_lag_features(df, target='y', lags=[1, 2, 3, 7, 14, 28])
print(df[['ds', 'y', 'y_lag_1', 'y_lag_7', 'y_lag_28']].tail(10).to_string())
`;

const rollingCode = `import pandas as pd
import numpy as np

def add_rolling_features(
    df: pd.DataFrame,
    target: str,
    windows: list,
    quantiles: list = None,
    min_periods: int = 1,
) -> pd.DataFrame:
    """Add rolling statistics: mean, std, min, max, and optional quantiles."""
    df = df.copy().sort_values('ds')
    s = df[target]

    for w in windows:
        roll = s.shift(1).rolling(window=w, min_periods=min_periods)
        df[f'{target}_roll_mean_{w}'] = roll.mean()
        df[f'{target}_roll_std_{w}']  = roll.std()
        df[f'{target}_roll_min_{w}']  = roll.min()
        df[f'{target}_roll_max_{w}']  = roll.max()

        if quantiles:
            for q in quantiles:
                df[f'{target}_roll_q{int(q*100)}_{w}'] = roll.quantile(q)

    return df

df = pd.DataFrame({
    'ds': pd.date_range('2023-01-01', periods=200, freq='D'),
    'y':  np.random.randn(200).cumsum() + 100,
})
# Note: shift(1) before rolling ensures no data leakage —
# the rolling window uses only data available BEFORE the current timestep
df = add_rolling_features(df, 'y', windows=[7, 14, 28], quantiles=[0.1, 0.9])
print(df[['ds', 'y', 'y_roll_mean_7', 'y_roll_std_7', 'y_roll_q10_7']].tail(10))
`;

const expandingCode = `import pandas as pd
import numpy as np

def add_expanding_features(df: pd.DataFrame, target: str) -> pd.DataFrame:
    """Add expanding window (cumulative) statistics."""
    df = df.copy().sort_values('ds')
    s = df[target].shift(1)  # shift to avoid leakage

    exp = s.expanding(min_periods=1)
    df[f'{target}_exp_mean']  = exp.mean()
    df[f'{target}_exp_std']   = exp.std()
    df[f'{target}_exp_min']   = exp.min()
    df[f'{target}_exp_max']   = exp.max()
    df[f'{target}_exp_range'] = df[f'{target}_exp_max'] - df[f'{target}_exp_min']

    return df

# Expanding window is useful for slow-moving series or when the series
# history is informative about its long-run mean level.
df = pd.DataFrame({
    'ds': pd.date_range('2023-01-01', periods=100, freq='D'),
    'y':  np.random.randn(100).cumsum() + 50,
})
df = add_expanding_features(df, 'y')
print(df[['ds', 'y', 'y_exp_mean', 'y_exp_std']].tail(5))
`;

const ewmCode = `import pandas as pd
import numpy as np

def add_ewm_features(df: pd.DataFrame, target: str, spans: list) -> pd.DataFrame:
    """Add exponentially-weighted moving statistics."""
    df = df.copy().sort_values('ds')
    s = df[target].shift(1)  # no leakage

    for span in spans:
        ewm = s.ewm(span=span, adjust=False)
        df[f'{target}_ewm_mean_{span}'] = ewm.mean()
        df[f'{target}_ewm_std_{span}']  = ewm.std()

    return df

# EWM gives more weight to recent observations;
# span ~ 1/alpha controls the decay rate:
#   span=7  => alpha ≈ 0.25 (recent-heavy, fast-adapting)
#   span=28 => alpha ≈ 0.07 (slow-decaying, long memory)

df = pd.DataFrame({
    'ds': pd.date_range('2023-01-01', periods=100, freq='D'),
    'y':  np.random.randn(100).cumsum() + 100,
})
df = add_ewm_features(df, 'y', spans=[7, 14, 28])
print(df[['ds', 'y', 'y_ewm_mean_7', 'y_ewm_mean_28']].tail(8))
`;

const targetEncodingCode = `import pandas as pd
import numpy as np
from sklearn.model_selection import KFold

def target_encode_cv(
    df: pd.DataFrame,
    cat_col: str,
    target: str,
    n_splits: int = 5,
    smoothing: float = 10.0,
) -> pd.Series:
    """
    Target-encode a categorical column using k-fold cross-validation
    to prevent target leakage. Uses additive smoothing:

        encoded = (count * category_mean + smoothing * global_mean)
                  / (count + smoothing)

    The CV loop ensures the training-set rows are encoded using
    out-of-fold statistics only.
    """
    global_mean = df[target].mean()
    encoded = pd.Series(index=df.index, dtype=float)

    kf = KFold(n_splits=n_splits, shuffle=False)
    for train_idx, val_idx in kf.split(df):
        train = df.iloc[train_idx]
        stats = train.groupby(cat_col)[target].agg(['mean', 'count'])
        stats['smooth'] = (
            stats['count'] * stats['mean'] + smoothing * global_mean
        ) / (stats['count'] + smoothing)
        encoded.iloc[val_idx] = df[cat_col].iloc[val_idx].map(stats['smooth']).fillna(global_mean)

    return encoded

# Example: encode store_id categorical for a retail demand model
np.random.seed(42)
df = pd.DataFrame({
    'store_id': np.random.choice(['A', 'B', 'C', 'D'], size=1000),
    'y': np.random.randn(1000) + np.random.choice([5, 10, 15, 20], size=1000),
})
df['store_encoded'] = target_encode_cv(df, 'store_id', 'y')
print(df.groupby('store_id')[['y', 'store_encoded']].mean())
`;

const mlforecastFeaturesCode = `# pip install mlforecast lightgbm
from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
import lightgbm as lgb
import pandas as pd
import numpy as np

# mlforecast handles lag creation and rolling features internally
# via the lag_transforms parameter

fcst = MLForecast(
    models={'lgb': lgb.LGBMRegressor(n_estimators=300, learning_rate=0.05)},
    freq='D',
    lags=[1, 2, 3, 7, 14, 28],                    # explicit lags
    lag_transforms={
        1: [
            # (rolling_mean, window), (rolling_std, window), etc.
            ('rolling_mean', 7),
            ('rolling_mean', 28),
            ('rolling_std',  7),
            ('rolling_min',  7),
            ('rolling_max',  7),
        ],
        7: [('rolling_mean', 4)],                  # 4-week average at lag 7
    },
    date_features=['dayofweek', 'month', 'quarter'],
    target_transforms=[Differences([1])],          # first difference to remove trend
)

# Generate synthetic multi-series data in mlforecast format
np.random.seed(0)
n = 500
df = pd.DataFrame({
    'unique_id': 'series_1',
    'ds': pd.date_range('2022-01-01', periods=n, freq='D'),
    'y':  np.random.randn(n).cumsum() + 200,
})

fcst.fit(df)
horizon = 14
future = fcst.make_future_dataframe(h=horizon)
preds = fcst.predict(h=horizon, new_df=future)
print(preds)
`;

const references = [
  { title: 'Feature Engineering for Machine Learning', author: 'Zheng, A. & Casari, A.', year: 2018, url: 'https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/' },
  { title: 'mlforecast: scalable machine learning for time series', author: 'Nixtla', year: 2023, url: 'https://nixtlaverse.nixtla.io/mlforecast/' },
  { title: 'Target Encoding Done Right', author: 'Micci-Barreca, D.', year: 2001, url: 'https://dl.acm.org/doi/10.1145/507533.507538' },
  { title: 'pandas Time Series documentation', author: 'pandas contributors', year: 2024, url: 'https://pandas.pydata.org/docs/user_guide/timeseries.html' },
];

export default function LagTargetEncoding() {
  return (
    <SectionLayout title="Lag Features and Target Encoding" difficulty="intermediate" readingTime={12}>
      <p className="text-zinc-300 leading-relaxed">
        Converting a time series into a supervised learning problem requires representing
        the series' own history as input features. Lag features encode past values
        directly; rolling statistics summarize recent dynamics; exponential weighted
        averages capture recency-weighted memory; and target encoding converts
        high-cardinality categorical identifiers into meaningful numeric signals.
      </p>

      <DefinitionBlock term="Lag Feature">
        A feature <InlineMath math="y_{t-k}" /> that copies the target value from{' '}
        <InlineMath math="k" /> steps in the past. Lag features form the backbone of
        autoregressive ML models, directly exposing the series' own history to the
        learning algorithm.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Lag Features</h2>
      <p className="text-zinc-300 leading-relaxed">
        For a daily series, common lags are 1 (yesterday), 7 (same day last week), 14,
        and 28. The exact set should reflect the dominant seasonalities and any known
        lead-lag relationships in the domain.
      </p>

      <BlockMath math={String.raw`\mathbf{x}_t = [y_{t-1},\, y_{t-2},\, \ldots,\, y_{t-p}]`} />

      <PythonCode code={lagFeaturesCode} title="Lag Feature Extraction" />

      <WarningBlock title="Data Leakage from Lags">
        Always sort the dataframe by time before applying <code>shift()</code>. For
        multi-series datasets, apply <code>groupby('unique_id').shift(lag)</code> to
        prevent one series' past values leaking into another series' features.
      </WarningBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Rolling Statistics</h2>
      <p className="text-zinc-300 leading-relaxed">
        Rolling windows summarize recent behavior in a compact, noise-reduced form.
        Mean, standard deviation, min, and max capture the level, volatility, and range
        of the recent window.
      </p>

      <BlockMath math={String.raw`\mu^{(w)}_t = \frac{1}{w}\sum_{k=1}^{w} y_{t-k}, \qquad \sigma^{(w)}_t = \sqrt{\frac{1}{w-1}\sum_{k=1}^{w}(y_{t-k} - \mu^{(w)}_t)^2}`} />

      <RollingWindowDemo />

      <PythonCode code={rollingCode} title="Rolling Mean, Std, Min, Max and Quantiles" />

      <NoteBlock title="The shift(1) Convention">
        Always apply <code>.shift(1)</code> before <code>.rolling()</code>. Without
        the shift, the rolling window at time <InlineMath math="t" /> includes{' '}
        <InlineMath math="y_t" /> itself — leaking the target into its own feature.
        After the shift, <code>roll_mean_7</code> at time <InlineMath math="t" /> uses
        only <InlineMath math="y_{t-1}, \ldots, y_{t-7}" />.
      </NoteBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Expanding Window Features</h2>
      <p className="text-zinc-300 leading-relaxed">
        Expanding windows grow as more history accumulates, computing running statistics
        from the beginning of the series. They capture the long-run mean and are useful
        for slow-moving series or when level-setting across a long history matters.
      </p>

      <PythonCode code={expandingCode} title="Expanding Window Statistics" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Exponential Weighted Features</h2>
      <p className="text-zinc-300 leading-relaxed">
        Exponentially weighted moving averages (EWM) assign geometrically decreasing
        weights to older observations, controlled by span parameter{' '}
        <InlineMath math="\alpha = 2 / (\text{span} + 1)" />:
      </p>

      <BlockMath math={String.raw`\hat{y}^{(\alpha)}_t = \alpha \, y_{t-1} + (1-\alpha)\, \hat{y}^{(\alpha)}_{t-1}`} />

      <p className="text-zinc-300 leading-relaxed">
        EWM features combine the smoothing benefit of rolling averages with continuous
        weighting — recent observations matter more, avoiding the hard cutoff of a fixed
        window.
      </p>

      <PythonCode code={ewmCode} title="Exponentially Weighted Moving Features" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Target Encoding</h2>
      <p className="text-zinc-300 leading-relaxed">
        In multi-series forecasting, categorical identifiers (store ID, product ID, SKU)
        must be converted to numeric features. Target encoding replaces a category with
        the mean target value for that category — but must be computed with
        cross-validation to prevent leakage.
      </p>

      <DefinitionBlock term="Target Encoding with Smoothing">
        <BlockMath math={String.raw`\tilde{y}_c = \frac{n_c \cdot \bar{y}_c + \lambda \cdot \bar{y}_{\text{global}}}{n_c + \lambda}`} />
        where <InlineMath math="n_c" /> is the count of observations in category{' '}
        <InlineMath math="c" />, <InlineMath math="\bar{y}_c" /> is the category mean,
        and <InlineMath math="\lambda" /> is the smoothing parameter. Large{' '}
        <InlineMath math="\lambda" /> shrinks rare categories toward the global mean.
      </DefinitionBlock>

      <PythonCode code={targetEncodingCode} title="Target Encoding with K-Fold CV and Smoothing" />

      <WarningBlock title="Target Encoding Leakage Risk">
        Never compute target encodings on the full training set before splitting into
        train/validation folds. Always use out-of-fold statistics to compute encodings
        for training rows, and global statistics (from training only) for test rows.
        Libraries like <code>category_encoders</code> handle this automatically.
      </WarningBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">mlforecast Feature Engineering</h2>
      <p className="text-zinc-300 leading-relaxed">
        The <code>mlforecast</code> library automates lag and rolling-window feature
        creation for multi-series datasets, with efficient parallelised computation
        and correct handling of group boundaries.
      </p>

      <PythonCode code={mlforecastFeaturesCode} title="mlforecast: Lags, Rolling Stats, and Date Features" />

      <TheoremBlock title="Feature Importance: Lags vs. Rolling vs. EWM">
        Empirically, lag features at the dominant seasonality period (e.g., lag 7 for
        weekly data) are the single most important feature class. Rolling mean features
        add complementary signal by smoothing noise. EWM features are valuable when
        series undergo level shifts, as they adapt faster than long rolling windows.
        A well-engineered lag+rolling feature set often rivals complex deep learning
        models on standard benchmarks.
      </TheoremBlock>

      <ExampleBlock title="Energy Consumption Forecasting — Feature Set">
        <p className="text-zinc-300 text-sm">
          For hourly electricity demand forecasting:
        </p>
        <ul className="list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2">
          <li>Lags: 1h, 2h, 3h (inertia), 24h, 48h (daily cycle), 168h (weekly)</li>
          <li>Rolling mean/std: 24h, 168h windows</li>
          <li>EWM: spans 12, 24, 72 (fast/medium/slow decay)</li>
          <li>Calendar: hour_sin/cos, day_of_week_sin/cos, is_holiday</li>
          <li>Exogenous: temperature lag_1, temperature rolling_mean_24</li>
        </ul>
      </ExampleBlock>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
