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

const architectureCode = `# pip install mlforecast lightgbm
# mlforecast requires data in "long format":
#   unique_id | ds | y  (and optionally exogenous columns)
#
# The library handles:
#   - Feature engineering (lags, lag transforms, date features)
#   - Multi-series management (correct group-wise shifting)
#   - Training a single global model on all series
#   - Recursive and direct prediction
#   - Prediction with future exogenous variables

import pandas as pd
import numpy as np
from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
import lightgbm as lgb

# ── Generate synthetic multi-series data ─────────────────────────────────────
np.random.seed(42)
series_data = []
for uid in ['store_A', 'store_B', 'store_C']:
    n   = 500
    base = {'store_A': 100, 'store_B': 150, 'store_C': 80}[uid]
    y   = (base
           + np.linspace(0, 20, n)
           + 10 * np.sin(2 * np.pi * np.arange(n) / 365.25)
           + np.random.randn(n) * 5)
    series_data.append(pd.DataFrame({
        'unique_id': uid,
        'ds':        pd.date_range('2022-01-01', periods=n, freq='D'),
        'y':         y,
    }))

df = pd.concat(series_data, ignore_index=True)
print(df.head())
print(f"Shape: {df.shape}, series: {df['unique_id'].nunique()}")
`;

const basicMLForecastCode = `from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
import lightgbm as lgb
import numpy as np

# ── Define the MLForecast pipeline ───────────────────────────────────────────
fcst = MLForecast(
    models={
        'lgb': lgb.LGBMRegressor(
            n_estimators=300,
            learning_rate=0.05,
            num_leaves=63,
            min_child_samples=20,
            subsample=0.8,
            colsample_bytree=0.8,
            verbose=-1,
        )
    },
    freq='D',                          # pandas frequency string

    # Lag features — applied per series (no cross-series leakage)
    lags=[1, 2, 3, 7, 14, 28],

    # Rolling/expanding transforms on lagged values
    lag_transforms={
        1: [                           # transforms applied to lag-1 values
            ('rolling_mean', 7),       # rolling mean of last 7 lag-1 values
            ('rolling_mean', 28),
            ('rolling_std',  7),
            ('rolling_min',  7),
            ('rolling_max',  7),
        ],
        7: [('rolling_mean', 4)],      # 4-week rolling mean at lag 7
    },

    # Automatic date features (extracted from ds column)
    date_features=['dayofweek', 'month', 'quarter', 'year'],

    # Optional: first-difference the target before training
    target_transforms=[Differences([1])],
)

fcst.fit(df)
print("Model trained on", df['unique_id'].nunique(), "series")
print("Feature names:", fcst.ts.features_order_)
`;

const predictCode = `from mlforecast import MLForecast
import pandas as pd
import numpy as np

# ── Predict h steps ahead ──────────────────────────────────────────────────
horizon = 14
preds = fcst.predict(h=horizon)
print(preds.head(10))
# Output columns: unique_id | ds | lgb

# ── Predict with future exogenous variables ───────────────────────────────
# If the model was trained with exogenous features (e.g., temperature, price),
# you must provide future values for all exogenous cols.

# Example: adding an exogenous variable during training
df_exog = df.copy()
df_exog['temperature'] = (20
    + 10 * np.sin(2 * np.pi * np.arange(len(df_exog)) / 365.25)
    + np.random.randn(len(df_exog)) * 2)

fcst_exog = MLForecast(
    models={'lgb': lgb.LGBMRegressor(n_estimators=200, verbose=-1)},
    freq='D',
    lags=[1, 7, 14],
    date_features=['dayofweek', 'month'],
)
fcst_exog.fit(df_exog)  # temperature is automatically included as a feature

# For prediction, provide future temperature values
future_exog = fcst_exog.make_future_dataframe(h=14)
future_exog['temperature'] = np.random.randn(len(future_exog)) * 2 + 20  # forecast values

preds_exog = fcst_exog.predict(h=14, X_df=future_exog)
print("Predictions with exogenous variables:")
print(preds_exog.head())
`;

const cvCode = `from mlforecast import MLForecast
from mlforecast.utils import PredictionIntervals
import lightgbm as lgb
import pandas as pd
import numpy as np

# mlforecast cross-validation: expanding or sliding window
horizon = 14

cv_preds = fcst.cross_validation(
    df=df,
    h=horizon,
    n_windows=5,        # number of validation windows
    step_size=28,       # how many steps to advance between windows
    refit=True,         # refit model at each window
)
print("CV predictions shape:", cv_preds.shape)
print(cv_preds.head())

# Compute metrics per fold
from sklearn.metrics import mean_absolute_error, mean_absolute_percentage_error

for window in cv_preds['cutoff'].unique():
    fold = cv_preds[cv_preds['cutoff'] == window]
    mae  = mean_absolute_error(fold['y'], fold['lgb'])
    mape = mean_absolute_percentage_error(fold['y'], fold['lgb']) * 100
    print(f"  Cutoff {str(window)[:10]}: MAE={mae:.2f}, MAPE={mape:.1f}%")
`;

const multiModelCode = `from mlforecast import MLForecast
import lightgbm as lgb
import xgboost as xgb
from sklearn.ensemble import RandomForestRegressor
import numpy as np

# Train multiple models simultaneously in one pipeline
fcst_multi = MLForecast(
    models={
        'lgb': lgb.LGBMRegressor(
            n_estimators=300, learning_rate=0.05, num_leaves=63, verbose=-1
        ),
        'xgb': xgb.XGBRegressor(
            n_estimators=300, learning_rate=0.05, max_depth=6,
            tree_method='hist', verbosity=0
        ),
        'rf': RandomForestRegressor(
            n_estimators=200, min_samples_leaf=5, n_jobs=-1, random_state=42
        ),
    },
    freq='D',
    lags=[1, 7, 14, 28],
    lag_transforms={1: [('rolling_mean', 7), ('rolling_std', 7)]},
    date_features=['dayofweek', 'month'],
)
fcst_multi.fit(df)
preds_multi = fcst_multi.predict(h=14)

# Simple ensemble: average the models
preds_multi['ensemble'] = preds_multi[['lgb', 'xgb', 'rf']].mean(axis=1)
print(preds_multi.head(10))
`;

const predictionIntervalsCode = `from mlforecast import MLForecast
from mlforecast.utils import PredictionIntervals
import lightgbm as lgb
import numpy as np

# Conformal prediction intervals via mlforecast
# Uses held-out residuals from cross-validation to construct intervals

fcst_pi = MLForecast(
    models={'lgb': lgb.LGBMRegressor(n_estimators=200, verbose=-1)},
    freq='D',
    lags=[1, 7, 14],
    date_features=['dayofweek', 'month'],
)
fcst_pi.fit(df, prediction_intervals=PredictionIntervals(n_windows=3, h=14))

# Predict with 90% conformal prediction interval
preds_pi = fcst_pi.predict(h=14, level=[80, 90, 95])
print("Prediction interval columns:", [c for c in preds_pi.columns if 'lo' in c or 'hi' in c])
print(preds_pi.head())
# Output: unique_id | ds | lgb | lgb-lo-90 | lgb-hi-90 | lgb-lo-95 | lgb-hi-95 ...
`;

const references = [
  { title: 'mlforecast: scalable machine learning for time series forecasting', author: 'Nixtla', year: 2023, url: 'https://nixtlaverse.nixtla.io/mlforecast/' },
  { title: 'mlforecast GitHub', author: 'Nixtla', year: 2024, url: 'https://github.com/Nixtla/mlforecast' },
  { title: 'statsforecast: statistical models at scale', author: 'Nixtla', year: 2023, url: 'https://nixtlaverse.nixtla.io/statsforecast/' },
  { title: 'Conformal Prediction for Time Series', author: 'Stankeviciute, K. et al.', year: 2021, url: 'https://arxiv.org/abs/2107.07511' },
];

export default function MLForecastPipeline() {
  return (
    <SectionLayout title="mlforecast Pipeline" difficulty="intermediate" readingTime={13}>
      <p className="text-zinc-300 leading-relaxed">
        <code>mlforecast</code> (by Nixtla) provides a complete ML forecasting pipeline
        designed for scalability across thousands of series. It handles feature
        engineering, multi-series management, training, prediction, and cross-validation
        in a clean API — eliminating the boilerplate of manual lag construction and
        series-level group handling.
      </p>

      <DefinitionBlock term="MLForecast">
        A Python library that wraps any sklearn-compatible regressor into a complete
        multi-step, multi-series forecasting pipeline. It automatically engineers
        lag features, rolling statistics, and date features per series, trains a
        global model on all series simultaneously, and provides cross-validation
        and prediction interval utilities.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Data Format</h2>
      <p className="text-zinc-300 leading-relaxed">
        mlforecast requires data in <strong>long format</strong>: one row per
        (series, timestamp). The required columns are:
      </p>
      <div className="grid grid-cols-3 gap-3 my-4">
        {[
          { col: 'unique_id', desc: 'Series identifier (string or int)' },
          { col: 'ds', desc: 'Timestamp (datetime or string)' },
          { col: 'y', desc: 'Target variable (float)' },
        ].map(c => (
          <div key={c.col} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
            <p className="font-mono text-sky-400 text-sm">{c.col}</p>
            <p className="text-zinc-400 text-xs mt-1">{c.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-zinc-300 leading-relaxed">
        Additional columns are treated as exogenous variables and included as features.
      </p>

      <PythonCode code={architectureCode} title="Data Preparation for mlforecast" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Building the Pipeline</h2>
      <p className="text-zinc-300 leading-relaxed">
        The <code>MLForecast</code> constructor accepts the model(s), frequency,
        lag specification, and optional transforms. The <code>lag_transforms</code>
        parameter defines rolling/expanding statistics computed on lagged values —
        per series, correctly avoiding cross-series leakage.
      </p>

      <PythonCode code={basicMLForecastCode} title="MLForecast Pipeline with LightGBM" />

      <NoteBlock title="target_transforms">
        <code>Differences([1])</code> applies first differencing to remove trend before
        training and automatically inverts the transform at prediction time. This is
        equivalent to training on <InlineMath math="\Delta y_t = y_t - y_{t-1}" /> and
        reconstructing absolute values from cumulative sum. Use for non-stationary series.
      </NoteBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Prediction and Exogenous Variables</h2>

      <PythonCode code={predictCode} title="Predict and Predict with Exogenous Variables" />

      <WarningBlock title="Exogenous Variables at Prediction Time">
        If you train with exogenous features (e.g., temperature, promotions), you
        must provide forecasts of these variables for the future horizon at prediction
        time. mlforecast does not forecast exogenous variables automatically — these
        must come from separate models or external data sources.
      </WarningBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Cross-Validation</h2>

      <PythonCode code={cvCode} title="mlforecast Cross-Validation" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Multiple Models and Ensembling</h2>
      <p className="text-zinc-300 leading-relaxed">
        mlforecast can train multiple models in parallel using the same feature set,
        enabling straightforward model comparison and ensembling.
      </p>

      <PythonCode code={multiModelCode} title="Multiple Models and Simple Ensemble" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Prediction Intervals</h2>
      <p className="text-zinc-300 leading-relaxed">
        mlforecast supports conformal prediction intervals via cross-validation
        residuals. These are distribution-free and valid for any model, providing
        coverage guarantees without assuming Gaussian errors.
      </p>

      <PythonCode code={predictionIntervalsCode} title="Conformal Prediction Intervals" />

      <TheoremBlock title="mlforecast Architecture Summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            { k: 'Feature engineering', v: 'Lags + rolling stats + date features, per-series, no leakage' },
            { k: 'Global model', v: 'Single model trained on all series simultaneously' },
            { k: 'Multi-series support', v: 'Scales to 10,000+ series with efficient pandas groupby ops' },
            { k: 'Frequency support', v: 'D, W, M, H, min, custom — any pandas offset string' },
            { k: 'Prediction strategy', v: 'Recursive by default; direct via ForecasterAutoregDirect' },
            { k: 'Prediction intervals', v: 'Conformal (distribution-free) via cross-validation residuals' },
          ].map(i => (
            <div key={i.k} className="p-2 rounded bg-zinc-800 border border-zinc-700">
              <span className="text-sky-400 font-semibold">{i.k}: </span>
              <span className="text-zinc-300">{i.v}</span>
            </div>
          ))}
        </div>
      </TheoremBlock>

      <ExampleBlock title="Retail Demand Forecasting at Scale">
        <p className="text-zinc-300 text-sm">
          Using mlforecast to forecast daily demand for 5,000 SKUs across 20 stores
          (100,000 series):
        </p>
        <ul className="list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2">
          <li>Data: long format, 100K series × 730 days = 73M rows</li>
          <li>Lags: [1, 7, 14, 28], rolling [7, 28] — engineered in ~30s via pandas</li>
          <li>Model: LightGBM global (1 model for all series)</li>
          <li>Training time: ~3 min on 8-core CPU (vs. weeks for 100K individual models)</li>
          <li>CV: cross_validation(n_windows=3, h=28) — 3 backtest windows</li>
          <li>Result: 8% lower WRMSSE vs. per-series exponential smoothing</li>
        </ul>
      </ExampleBlock>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
