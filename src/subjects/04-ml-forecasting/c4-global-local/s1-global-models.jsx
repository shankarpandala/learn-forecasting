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

function GlobalLocalComparison() {
  const [nSeries, setNSeries] = useState(100);
  const [nObs, setNObs] = useState(50);
  const localParams = 10;
  const globalParams = 500;
  const totalLocalParams = nSeries * localParams;
  const totalGlobalParams = globalParams;
  const localDataPerModel = nObs;
  const globalDataPerModel = nSeries * nObs;
  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Global vs. Local: Parameter and Data Comparison</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400 w-24">Series: <span className="text-sky-400 font-bold">{nSeries}</span></label>
          <input type="range" min={10} max={500} value={nSeries} onChange={e => setNSeries(Number(e.target.value))} className="w-full accent-sky-500" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400 w-28">Obs/series: <span className="text-sky-400 font-bold">{nObs}</span></label>
          <input type="range" min={20} max={200} value={nObs} onChange={e => setNObs(Number(e.target.value))} className="w-full accent-sky-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-zinc-800 border border-blue-800">
          <p className="text-blue-400 font-semibold text-sm mb-2">Local Models ({nSeries} models)</p>
          <p className="text-xs text-zinc-400">Parameters total: <span className="text-white font-mono">{totalLocalParams.toLocaleString()}</span></p>
          <p className="text-xs text-zinc-400">Training data per model: <span className="text-white font-mono">{localDataPerModel}</span> rows</p>
          <p className={`text-xs mt-1 ${nObs < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
            {nObs < 50 ? 'Warning: very short series' : 'Sufficient history'}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-zinc-800 border border-emerald-800">
          <p className="text-emerald-400 font-semibold text-sm mb-2">Global Model (1 model)</p>
          <p className="text-xs text-zinc-400">Parameters: <span className="text-white font-mono">{totalGlobalParams.toLocaleString()}</span></p>
          <p className="text-xs text-zinc-400">Training data: <span className="text-white font-mono">{(nSeries * nObs).toLocaleString()}</span> rows</p>
          <p className={`text-xs mt-1 ${nSeries * nObs > 1000 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {nSeries * nObs > 1000 ? 'Enough data for global model' : 'Small global dataset'}
          </p>
        </div>
      </div>
    </div>
  );
}

const localModelsCode = `import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error

# Generate multi-series data
np.random.seed(42)
n_series = 10
n = 300
series_list = []
for uid in range(n_series):
    base = 50 + uid * 10
    y = base + np.linspace(0, 10, n) + 5 * np.sin(2 * np.pi * np.arange(n) / 52) + np.random.randn(n) * 3
    series_list.append(pd.DataFrame({'uid': uid, 'y': y, 't': range(n)}))

df = pd.concat(series_list, ignore_index=True)

def make_features(series_y):
    df_s = pd.DataFrame({'y': series_y})
    for lag in [1, 2, 3, 7, 14]:
        df_s[f'lag_{lag}'] = df_s['y'].shift(lag)
    df_s = df_s.dropna()
    return df_s[[c for c in df_s.columns if c != 'y']].values, df_s['y'].values

# ── Local models: one per series ──────────────────────────────────────────────
split = 250
local_maes = []
for uid in range(n_series):
    s = df[df['uid'] == uid]['y'].values
    X, y = make_features(s)
    model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    model.fit(X[:split - 14], y[:split - 14])
    preds = model.predict(X[split - 14:split])
    local_maes.append(mean_absolute_error(y[split - 14:split], preds))

print(f"Local model mean MAE: {np.mean(local_maes):.3f} ± {np.std(local_maes):.3f}")
`;

const globalModelCode = `import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.metrics import mean_absolute_error

# ── Global model: one model trained on ALL series ─────────────────────────────
# Data is already in df from the local model example above

# Feature engineering with group-aware shifts
df_sorted = df.sort_values(['uid', 't']).copy()
for lag in [1, 2, 3, 7, 14]:
    df_sorted[f'lag_{lag}'] = df_sorted.groupby('uid')['y'].shift(lag)

df_sorted['series_id'] = df_sorted['uid'].astype('category')  # global series ID
df_sorted = df_sorted.dropna()

features  = [f'lag_{l}' for l in [1,2,3,7,14]] + ['series_id']
cat_feats = ['series_id']

split_t = 250
train = df_sorted[df_sorted['t'] < split_t]
test  = df_sorted[(df_sorted['t'] >= split_t) & (df_sorted['t'] < split_t + 14)]

dtrain = lgb.Dataset(train[features], label=train['y'], categorical_feature=cat_feats)
dval   = lgb.Dataset(test[features],  label=test['y'],  reference=dtrain, categorical_feature=cat_feats)

params = {
    'objective': 'regression_l1',
    'num_leaves': 63,
    'learning_rate': 0.05,
    'min_data_in_leaf': 20,
    'verbose': -1,
}
model = lgb.train(params, dtrain, num_boost_round=300,
                  valid_sets=[dval],
                  callbacks=[lgb.early_stopping(30, verbose=False)])

preds_global = model.predict(test[features])
global_mae   = mean_absolute_error(test['y'].values, preds_global)
print(f"Global model MAE: {global_mae:.3f}")
`;

const crossLearningCode = `# Cross-learning: the global model learns patterns shared across all series.
# For example, if all series have a weekly seasonality, the global model
# learns this once from N*T observations instead of T observations per series.
#
# This is especially powerful when:
# 1. Individual series are short (few observations)
# 2. Series share common patterns (seasonality, trend shape)
# 3. Series differ only in level (global model + series_id feature handles this)
#
# Mathematical intuition:
# Local model for series i: f_i(x) estimated from T_i data points
# Global model: F(x, i) estimated from sum_i T_i data points
#
# When T_i is small, local model has high variance (overfits).
# Global model borrows strength across series, reducing variance.

import pandas as pd
import numpy as np

# Short series scenario: only 30 observations per series
np.random.seed(0)
n_series = 50
short_n = 30

short_df = pd.concat([
    pd.DataFrame({
        'uid': uid,
        'y': (50 + uid * 2
              + 5 * np.sin(2 * np.pi * np.arange(short_n) / 7)
              + np.random.randn(short_n) * 3),
        't': range(short_n)
    }) for uid in range(n_series)
], ignore_index=True)

# Global model has 50 * 30 = 1500 training rows despite each series being short
total_rows = len(short_df)
print(f"Total training rows for global model: {total_rows}")
print(f"Average rows per local model: {short_n}")
print(f"Cross-learning advantage factor: {total_rows / short_n}x")
`;

const mlforecastGlobalCode = `from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
import lightgbm as lgb
import pandas as pd
import numpy as np

# Generate diverse multi-series dataset
np.random.seed(0)
all_series = []
for uid in range(100):
    n = np.random.randint(100, 400)  # varying series lengths
    base = np.random.uniform(50, 500)
    amp  = np.random.uniform(5, 50)
    y = (base
         + amp * np.sin(2 * np.pi * np.arange(n) / 365)
         + np.random.randn(n) * base * 0.05)
    all_series.append(pd.DataFrame({
        'unique_id': f'series_{uid:03d}',
        'ds': pd.date_range('2020-01-01', periods=n, freq='D'),
        'y': y,
    }))

df_multi = pd.concat(all_series, ignore_index=True)
print(f"Total rows: {len(df_multi):,}, Series: {df_multi['unique_id'].nunique()}")

# Global MLForecast model
fcst = MLForecast(
    models={
        'lgb': lgb.LGBMRegressor(
            n_estimators=500,
            learning_rate=0.05,
            num_leaves=63,
            min_child_samples=20,
            subsample=0.8,
            verbose=-1,
        )
    },
    freq='D',
    lags=[1, 7, 14, 28],
    lag_transforms={
        1: [('rolling_mean', 7), ('rolling_mean', 28), ('rolling_std', 7)],
    },
    date_features=['dayofweek', 'month', 'year'],
)

# Train global model — learns from all 100 series simultaneously
fcst.fit(df_multi)
preds = fcst.predict(h=28)
print(f"Predictions for {preds['unique_id'].nunique()} series, {len(preds)} total rows")
`;

const references = [
  { title: 'N-BEATS: Neural basis expansion analysis for interpretable time series forecasting', author: 'Oreshkin, B. et al.', year: 2020, url: 'https://arxiv.org/abs/1905.10437' },
  { title: 'Do We Really Need Deep Learning Models for Time Series Forecasting?', author: 'Zeng, A. et al.', year: 2023, url: 'https://arxiv.org/abs/2205.13504' },
  { title: 'Global vs Local Models for TS Forecasting', author: 'Januschowski, T. et al.', year: 2020, url: 'https://doi.org/10.1016/j.ijforecast.2020.07.002' },
  { title: 'mlforecast: scalable machine learning for time series', author: 'Nixtla', year: 2023, url: 'https://nixtlaverse.nixtla.io/mlforecast/' },
];

export default function GlobalModels() {
  return (
    <SectionLayout title="Global vs Local Models" difficulty="advanced" readingTime={11}>
      <p className="text-zinc-300 leading-relaxed">
        When forecasting multiple related time series, a fundamental architectural
        decision is whether to train one model per series (local) or a single model
        on all series (global). This choice profoundly affects generalisation,
        scalability, and performance on short series — and the answer has shifted
        decisively toward global models in modern ML forecasting.
      </p>

      <DefinitionBlock term="Local Model">
        A forecasting model trained independently on a single time series. Each model
        is optimised purely for its own series' patterns. Simple, interpretable, but
        requires sufficient history per series and does not learn from related series.
      </DefinitionBlock>

      <DefinitionBlock term="Global Model">
        A single forecasting model trained on all series simultaneously. It learns
        patterns shared across series — seasonality, trend shapes, response to
        promotions — and generalises these across series, including those with
        limited history. A series identifier feature distinguishes between series.
      </DefinitionBlock>

      <GlobalLocalComparison />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Local Models</h2>
      <p className="text-zinc-300 leading-relaxed">
        Local models are the classical approach: ARIMA, exponential smoothing, and
        simple regression models are fitted independently per series. They excel when
        series are unrelated (different domains, different data generating processes)
        and have abundant history.
      </p>

      <PythonCode code={localModelsCode} title="Local Models: One per Series" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Global Models</h2>
      <p className="text-zinc-300 leading-relaxed">
        A global model treats all series as a single supervised learning problem.
        The series identity is encoded as a feature (categorical ID or embedding),
        allowing the model to learn both shared patterns (seasonality, trend) and
        series-specific deviations (level, volatility).
      </p>

      <PythonCode code={globalModelCode} title="Global LightGBM Model on Multiple Series" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Cross-Learning</h2>
      <p className="text-zinc-300 leading-relaxed">
        The core benefit of global models is <em>cross-learning</em>: the model
        borrows statistical strength from the full dataset when estimating shared
        patterns, dramatically improving performance on short series.
      </p>

      <BlockMath math={String.raw`\text{Effective sample size} = \sum_{i=1}^{N} T_i \gg T_i \quad \text{for any single series } i`} />

      <PythonCode code={crossLearningCode} title="Cross-Learning Benefit for Short Series" />

      <TheoremBlock title="When Global Models Win">
        Global models consistently outperform local models when:
        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
          <li>Individual series have fewer than 100–200 observations</li>
          <li>Series share common seasonality, trend, or response to external drivers</li>
          <li>The feature set includes a series identifier (store, product, customer)</li>
          <li>The total dataset across series is large enough to train a complex model</li>
        </ul>
        Local models win when series are genuinely independent with long histories
        and heterogeneous data-generating processes.
      </TheoremBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Global Models with mlforecast</h2>

      <PythonCode code={mlforecastGlobalCode} title="100-Series Global MLForecast Model" />

      <NoteBlock title="Series Identity Feature">
        The series ID (<code>unique_id</code>) should be included as a categorical
        feature. In LightGBM and CatBoost, pass it as a categorical column. This
        allows the model to learn per-series level and scale differences, essentially
        blending the global seasonality estimate with a local mean correction.
      </NoteBlock>

      <WarningBlock title="Data Leakage in Multi-Series Feature Engineering">
        Always compute lag and rolling features within each series using
        <code>groupby('unique_id').shift()</code> and
        <code>groupby('unique_id').transform(lambda x: x.shift(1).rolling(7).mean())</code>.
        Computing rolling features without groupby will bleed observations from one
        series into another at series boundaries.
      </WarningBlock>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        <div className="p-4 rounded-lg bg-zinc-800 border border-blue-800">
          <p className="text-blue-400 font-semibold text-sm mb-2">Local Models — Best Practices</p>
          <ul className="list-disc list-inside text-zinc-300 text-xs space-y-1">
            <li>Use classical methods (ETS, ARIMA) for short series</li>
            <li>Apply per-series hyperparameter optimisation</li>
            <li>Consider when series are heterogeneous</li>
            <li>More interpretable per-series diagnostics</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg bg-zinc-800 border border-emerald-800">
          <p className="text-emerald-400 font-semibold text-sm mb-2">Global Models — Best Practices</p>
          <ul className="list-disc list-inside text-zinc-300 text-xs space-y-1">
            <li>Use LightGBM or XGBoost with series_id as categorical</li>
            <li>Scale/normalise targets if series have different magnitudes</li>
            <li>Use TimeSeriesSplit that respects series boundaries</li>
            <li>Evaluate per-series metrics to detect underperforming series</li>
          </ul>
        </div>
      </div>

      <ExampleBlock title="M5 Competition — Global Models Dominate">
        <p className="text-zinc-300 text-sm">
          The M5 competition (30,490 Walmart series) demonstrated that global ML
          models dramatically outperform per-series classical models:
        </p>
        <ul className="list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2">
          <li>Top solutions: global LightGBM with 30K series as categorical features</li>
          <li>Baseline (per-series ETS): WRMSSE ≈ 0.75</li>
          <li>Top global ML solution: WRMSSE ≈ 0.49 (35% improvement)</li>
          <li>Key: shared weekly seasonality pattern learned from 30K series simultaneously</li>
          <li>Short series (new products, new stores) especially benefited from cross-learning</li>
        </ul>
      </ExampleBlock>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
