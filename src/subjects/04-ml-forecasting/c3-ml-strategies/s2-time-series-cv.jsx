import { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ReferenceArea, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

const N_TOTAL = 30;
const N_INIT = 14;
const GAP = 2;
const HORIZON = 4;
const MAX_FOLDS = 4;

function buildSplits(nFolds, cvType) {
  const splits = [];
  for (let fold = 0; fold < nFolds; fold++) {
    let trainEnd, valStart, valEnd;
    if (cvType === 'expanding') {
      trainEnd  = N_INIT + fold * HORIZON;
      valStart  = trainEnd + GAP;
      valEnd    = valStart + HORIZON - 1;
    } else {
      // sliding window: train size stays fixed
      const fixedWindow = N_INIT;
      trainEnd  = N_INIT + fold * HORIZON;
      valStart  = trainEnd + GAP;
      valEnd    = valStart + HORIZON - 1;
      const trainStart = trainEnd - fixedWindow + 1;
      splits.push({ fold: fold + 1, trainStart, trainEnd, valStart, valEnd });
      continue;
    }
    splits.push({ fold: fold + 1, trainStart: 1, trainEnd, valStart, valEnd });
  }
  return splits.filter(s => s.valEnd <= N_TOTAL);
}

function CVDiagram() {
  const [nFolds, setNFolds] = useState(3);
  const [cvType, setCVType] = useState('expanding');
  const [showGap, setShowGap] = useState(true);

  const splits = buildSplits(nFolds, cvType);
  const timepoints = Array.from({ length: N_TOTAL }, (_, i) => i + 1);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">
        Interactive: Cross-Validation Split Diagram
      </h3>
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400">Folds:</label>
          <input type="range" min={1} max={MAX_FOLDS} value={nFolds} onChange={e => setNFolds(Number(e.target.value))} className="w-24 accent-sky-500" />
          <span className="text-sky-400 font-bold text-sm">{nFolds}</span>
        </div>
        <div className="flex gap-2">
          {['expanding', 'sliding'].map(t => (
            <button key={t} onClick={() => setCVType(t)}
              className={`px-2 py-1 rounded text-xs font-medium ${cvType === t ? 'bg-sky-600 text-white' : 'border border-zinc-500 text-zinc-400'}`}>
              {t === 'expanding' ? 'Expanding Window' : 'Sliding Window'}
            </button>
          ))}
        </div>
        <button onClick={() => setShowGap(v => !v)}
          className={`px-2 py-1 rounded text-xs font-medium ${showGap ? 'bg-amber-600 text-white' : 'border border-zinc-500 text-zinc-400'}`}>
          Gap: {showGap ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Visual split grid */}
      <div className="overflow-x-auto">
        <div className="flex flex-col gap-2 min-w-[600px]">
          {/* Timeline header */}
          <div className="flex gap-0">
            <div className="w-16 text-xs text-zinc-500">Fold</div>
            {timepoints.map(t => (
              <div key={t} className="flex-1 text-center text-xs text-zinc-600 leading-none">{t % 5 === 0 ? t : ''}</div>
            ))}
          </div>
          {splits.map(({ fold, trainStart, trainEnd, valStart, valEnd }) => (
            <div key={fold} className="flex gap-0 items-center">
              <div className="w-16 text-xs text-zinc-400 font-semibold">Fold {fold}</div>
              {timepoints.map(t => {
                let bg = 'bg-zinc-800';
                if (t >= trainStart && t <= trainEnd) bg = 'bg-blue-700/70';
                if (showGap && t > trainEnd && t < valStart) bg = 'bg-amber-800/60';
                if (t >= valStart && t <= valEnd) bg = 'bg-emerald-600/70';
                return (
                  <div key={t} className={`flex-1 h-6 ${bg} border-r border-zinc-700/30`} title={`t=${t}`} />
                );
              })}
            </div>
          ))}
          {/* Legend */}
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs"><span className="w-4 h-4 bg-blue-700/70 inline-block rounded-sm" /> Train</span>
            {showGap && <span className="flex items-center gap-1 text-xs"><span className="w-4 h-4 bg-amber-800/60 inline-block rounded-sm" /> Gap</span>}
            <span className="flex items-center gap-1 text-xs"><span className="w-4 h-4 bg-emerald-600/70 inline-block rounded-sm" /> Validation</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-4 h-4 bg-zinc-800 inline-block rounded-sm border border-zinc-600" /> Unused</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-zinc-500 mt-3">
        Gap = {GAP} period(s). Horizon = {HORIZON} period(s). Gap prevents leakage when features use recent history.
      </p>
    </div>
  );
}

const pythonCode = `# Cross-Validation for Time Series
# pip install scikit-learn statsforecast lightgbm pandas numpy

import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error
import lightgbm as lgb

# ── 1. Generate data ──────────────────────────────────────────────────────────
np.random.seed(42)
n = 120  # 10 years monthly
t = np.arange(n)
y = 50 + 0.4*t + 5*np.sin(2*np.pi*t/12) + np.random.normal(0, 3, n)
ts = pd.Series(y, index=pd.date_range('2014-01', periods=n, freq='MS'), name='y')

# ── 2. sklearn TimeSeriesSplit (expanding window) ─────────────────────────────
tscv = TimeSeriesSplit(n_splits=5, gap=0, test_size=12)

for fold, (train_idx, val_idx) in enumerate(tscv.split(ts)):
    print(f"Fold {fold+1}: train {train_idx[0]}–{train_idx[-1]}, "
          f"val {val_idx[0]}–{val_idx[-1]}, "
          f"train_size={len(train_idx)}, val_size={len(val_idx)}")

# ── 3. Custom expanding window CV with gap ────────────────────────────────────
def expanding_window_cv(series, min_train, horizon, step_size, gap=0):
    """
    Expanding window cross-validation for time series.
    
    Parameters
    ----------
    series      : pd.Series with DatetimeIndex
    min_train   : minimum training window size
    horizon     : forecast horizon (validation size)
    step_size   : step between consecutive cutoffs
    gap         : number of periods between train end and val start
                  (helps when features use lagged values)
    
    Yields
    ------
    (train, val) : pd.Series slices
    """
    n = len(series)
    cutoff = min_train
    while cutoff + gap + horizon <= n:
        train = series.iloc[:cutoff]
        val   = series.iloc[cutoff + gap: cutoff + gap + horizon]
        yield train, val
        cutoff += step_size

# ── 4. Evaluate a simple model with CV ───────────────────────────────────────
def create_features_1d(series, lags=(1, 2, 3, 12)):
    df = pd.DataFrame({'y': series})
    for lag in lags:
        df[f'lag_{lag}'] = series.shift(lag)
    df['month'] = series.index.month
    return df.dropna()

scores = []
for fold, (train_ts, val_ts) in enumerate(
    expanding_window_cv(ts, min_train=36, horizon=12, step_size=12, gap=1)
):
    # Combine: features need full series for lags
    combined = pd.concat([train_ts, val_ts])
    df_all = create_features_1d(combined)
    
    train_len = len(train_ts)
    df_train = df_all.iloc[:train_len - 1]   # adjust for lag NaN drop
    df_val   = df_all.iloc[train_len - 1:]
    
    if len(df_train) < 10 or len(df_val) < 1:
        continue
    
    feature_cols = [c for c in df_all.columns if c != 'y']
    model = lgb.LGBMRegressor(n_estimators=200, learning_rate=0.1, verbose=-1)
    model.fit(df_train[feature_cols], df_train['y'])
    
    preds = model.predict(df_val[feature_cols])
    mae = mean_absolute_error(df_val['y'], preds)
    scores.append({'fold': fold + 1, 'mae': mae, 'n_train': len(df_train)})
    print(f"  Fold {fold+1}: n_train={len(df_train)}, MAE={mae:.3f}")

print(f"\\nMean MAE: {np.mean([s['mae'] for s in scores]):.3f}")
print(f"Std  MAE: {np.std([s['mae'] for s in scores]):.3f}")

# ── 5. Sliding window CV (fixed train size) ────────────────────────────────────
def sliding_window_cv(series, window_size, horizon, step_size, gap=0):
    n = len(series)
    start = 0
    while start + window_size + gap + horizon <= n:
        train = series.iloc[start: start + window_size]
        val   = series.iloc[start + window_size + gap: start + window_size + gap + horizon]
        yield train, val
        start += step_size

# ── 6. statsforecast built-in cross-validation ───────────────────────────────
from statsforecast import StatsForecast
from statsforecast.models import AutoETS, AutoARIMA, Naive, SeasonalNaive

df_sf = pd.DataFrame({
    'unique_id': 'ts1',
    'ds': ts.index,
    'y': ts.values,
})

sf = StatsForecast(
    models=[
        SeasonalNaive(season_length=12),
        AutoETS(season_length=12),
        AutoARIMA(season_length=12),
    ],
    freq='MS',
    n_jobs=-1,
)

# Expanding window CV: 3 windows, 12 steps ahead
cv_df = sf.cross_validation(
    df=df_sf,
    h=12,
    step_size=12,
    n_windows=3,
    refit=True,          # refit model at each cutoff
)

# Compute MAE per model and horizon
from statsforecast.losses import mae as sf_mae
print("\\nCross-validation MAE by model:")
for col in ['SeasonalNaive', 'AutoETS', 'AutoARIMA']:
    if col in cv_df.columns:
        m = sf_mae(cv_df['y'].values, cv_df[col].values)
        print(f"  {col:20s}: {m:.3f}")

# ── 7. How many folds? Practical recommendations ─────────────────────────────
n_obs = len(ts)
horizon = 12
min_train = 36    # minimum 3 years for seasonal models
max_folds = (n_obs - min_train - horizon) // horizon
print(f"\\nWith n={n_obs}, min_train={min_train}, horizon={horizon}:")
print(f"  Max possible folds: {max_folds}")
print(f"  Recommended: {min(max_folds, 5)} (diminishing returns beyond 5)")
`;

const references = [
  {
    label: 'Bergmeir 2012',
    title: 'On the use of cross-validation for time series predictor evaluation',
    authors: 'Bergmeir, C. & Benítez, J.M.',
    year: 2012,
    url: 'https://doi.org/10.1016/j.ins.2011.12.028',
  },
  {
    label: 'sklearn TimeSeriesSplit',
    title: 'sklearn.model_selection.TimeSeriesSplit',
    authors: 'scikit-learn developers',
    year: 2023,
    url: 'https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html',
  },
];

export default function TimeSeriesCV() {
  return (
    <SectionLayout
      title="Cross-Validation for Time Series"
      difficulty="intermediate"
      readingTime={20}
      prerequisites={['Lag features & window statistics', 'Model evaluation basics']}
    >
      <p>
        Cross-validation is essential for reliable model evaluation. Standard k-fold CV
        randomly assigns observations to folds — catastrophically wrong for time series,
        where future values must never appear in training. Time series CV requires
        strictly temporal splits.
      </p>

      <WarningBlock title="Why Random CV Fails for Time Series">
        Random CV shuffles observations before splitting into folds. For time series, this
        means fold 1 might train on periods 1, 3, 5, 7 and validate on 2, 4, 6, 8 —
        using future data to predict the past. This produces wildly optimistic performance
        estimates that collapse in production. Always use temporal splits.
      </WarningBlock>

      <h2>1. Walk-Forward Validation (Expanding Window)</h2>
      <DefinitionBlock
        label="Definition"
        title="Expanding Window Cross-Validation"
        definition="Train on all data up to cutoff t, validate on the next h periods. Advance the cutoff by step_size and repeat."
        notation="\text{Fold } k: \quad \text{Train} = [1, t_k], \quad \text{Val} = [t_k + g + 1, \, t_k + g + h]"
      />
      <p>
        where <InlineMath math="g \geq 0" /> is the gap between training end and validation
        start. The training set grows with each fold, mimicking real deployment conditions.
      </p>

      <h2>2. Sliding Window CV (Fixed Train Size)</h2>
      <p>
        When data is non-stationary or you want to mimic a fixed-window production model:
      </p>
      <BlockMath math="\text{Fold } k: \quad \text{Train} = [t_k - W + 1, t_k], \quad \text{Val} = [t_k + g + 1, \, t_k + g + h]" />
      <p>
        The training window size <InlineMath math="W" /> stays constant. Useful when
        old data is irrelevant (e.g., post-COVID retail patterns differ from pre-COVID).
      </p>

      <h2>3. The Gap Parameter</h2>
      <p>
        The gap <InlineMath math="g" /> introduces a buffer between training end and
        validation start. This is critical when:
      </p>
      <ul>
        <li>Features use rolling statistics that include recent observations</li>
        <li>The forecast horizon implies a real-world decision lag (e.g., ordering 4 weeks ahead)</li>
        <li>You want to reduce correlation between train and validation errors</li>
      </ul>
      <p>
        Setting <InlineMath math="g = h" /> is conservative and safe. Setting{' '}
        <InlineMath math="g = 0" /> is fine when features use strict past-only data.
      </p>

      <h2>Interactive: CV Split Visualization</h2>
      <CVDiagram />

      <NoteBlock type="tip" title="How Many Folds? Practical Recommendations">
        <ul>
          <li><strong>Rule of thumb</strong>: 3–5 folds are usually sufficient. Beyond 5, the gain in reliability is minimal and computation grows linearly.</li>
          <li><strong>Minimum training size</strong>: Use at least 2× the seasonal period as minimum training. For monthly data: ≥ 24 months.</li>
          <li><strong>Step size</strong>: Set equal to the horizon (h). Smaller steps create highly correlated folds with little new information.</li>
          <li><strong>Reporting</strong>: Report mean ± std of CV metric across folds — not just the mean. High variance in CV scores signals unstable models.</li>
        </ul>
      </NoteBlock>

      <h2>4. Aggregating CV Metrics</h2>
      <p>
        Two common approaches to aggregate fold-level errors:
      </p>
      <BlockMath math="\overline{\text{MAE}} = \frac{1}{K}\sum_{k=1}^{K} \text{MAE}_k \quad \text{(fold average)}" />
      <BlockMath math="\text{MAE}_{\text{pooled}} = \frac{\sum_{k=1}^{K}\sum_{h=1}^{H} |e_{k,h}|}{\sum_k H_k} \quad \text{(pooled)}" />
      <p>
        Pooled MAE weights folds by their size (different if folds have varying horizon lengths).
        Both are valid; report which you use for reproducibility.
      </p>

      <h2>Python: TimeSeriesSplit and Custom CV</h2>
      <PythonCode
        code={pythonCode}
        filename="ts_cross_validation.py"
        title="Walk-forward CV with sklearn, custom expanding window, and statsforecast"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
