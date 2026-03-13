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

function CVSchemeViz() {
  const [scheme, setScheme] = useState('expanding');
  const n = 20, nFolds = 4, testSize = 3;
  const schemes = {
    expanding: Array.from({ length: nFolds }, (_, k) => ({
      train: [0, (k + 1) * 3 + 2],
      test:  [(k + 1) * 3 + 2, (k + 1) * 3 + 2 + testSize],
    })),
    sliding: Array.from({ length: nFolds }, (_, k) => ({
      train: [k * 2, k * 2 + 8],
      test:  [k * 2 + 8, k * 2 + 8 + testSize],
    })),
    blocked: Array.from({ length: nFolds }, (_, k) => {
      const blockSize = Math.floor(n / nFolds);
      const start = k * blockSize;
      const trainEnd = start + Math.floor(blockSize * 0.7);
      return { train: [start, trainEnd], test: [trainEnd, start + blockSize] };
    }),
  };
  const folds = schemes[scheme];
  const colors = { train: '#1e40af', test: '#b91c1c', gap: '#3f3f46' };
  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Cross-Validation Scheme Visualiser</h3>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['expanding', 'sliding', 'blocked'].map(s => (
          <button key={s} onClick={() => setScheme(s)}
            className={`px-3 py-1 rounded text-xs font-semibold ${scheme === s ? 'bg-sky-700 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {folds.map((fold, fi) => (
          <div key={fi} className="flex items-center gap-1">
            <span className="text-xs text-zinc-500 w-12">Fold {fi+1}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: n }, (_, i) => {
                const inTrain = i >= fold.train[0] && i < fold.train[1];
                const inTest  = i >= fold.test[0]  && i < fold.test[1];
                return (
                  <div key={i} className="w-3 h-5 rounded-sm"
                    style={{ backgroundColor: inTrain ? colors.train : inTest ? colors.test : colors.gap }} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3">
        <span className="flex items-center gap-1 text-xs text-zinc-400">
          <div className="w-3 h-3 rounded-sm" style={{backgroundColor: colors.train}} /> Train
        </span>
        <span className="flex items-center gap-1 text-xs text-zinc-400">
          <div className="w-3 h-3 rounded-sm" style={{backgroundColor: colors.test}} /> Test
        </span>
        <span className="flex items-center gap-1 text-xs text-zinc-400">
          <div className="w-3 h-3 rounded-sm" style={{backgroundColor: colors.gap}} /> Unused
        </span>
      </div>
    </div>
  );
}

const sklearnTSCV = `from sklearn.model_selection import TimeSeriesSplit
import numpy as np
import pandas as pd
import lightgbm as lgb
from sklearn.metrics import mean_absolute_error

# ── Expanding window CV ───────────────────────────────────────────────────────
n = 500
np.random.seed(0)
X = np.random.randn(n, 10)
y = X[:, 0] * 3 + np.sin(np.arange(n) * 2 * np.pi / 52) + np.random.randn(n)

# TimeSeriesSplit: expanding train, fixed test size
tscv_expanding = TimeSeriesSplit(
    n_splits=5,
    test_size=28,     # fixed test size per fold
    gap=0,            # gap between train and test (use > 0 to avoid leakage)
)
print("Expanding window splits:")
for i, (tr, va) in enumerate(tscv_expanding.split(X)):
    print(f"  Fold {i+1}: train={tr[0]}:{tr[-1]+1}, val={va[0]}:{va[-1]+1} ({len(tr)} / {len(va)} samples)")

# ── Sliding window CV ─────────────────────────────────────────────────────────
# sklearn doesn't natively support fixed-window sliding CV, but we can implement it:
def sliding_window_cv(n_samples, train_size, test_size, step=1):
    """Generate (train, test) index pairs for sliding window CV."""
    splits = []
    start = 0
    while start + train_size + test_size <= n_samples:
        train_idx = np.arange(start, start + train_size)
        test_idx  = np.arange(start + train_size, start + train_size + test_size)
        splits.append((train_idx, test_idx))
        start += step
    return splits

splits = sliding_window_cv(n, train_size=200, test_size=28, step=28)
print(f"\\nSliding window splits: {len(splits)} folds")
for i, (tr, va) in enumerate(splits[:3]):
    print(f"  Fold {i+1}: train={tr[0]}:{tr[-1]+1}, val={va[0]}:{va[-1]+1}")
`;

const backtestCode = `# pip install skforecast
from skforecast.model_selection import backtesting_forecaster
from skforecast.ForecasterAutoreg import ForecasterAutoreg
import lightgbm as lgb
import pandas as pd
import numpy as np

# Create a synthetic daily series
np.random.seed(0)
n = 600
dates = pd.date_range('2021-06-01', periods=n, freq='D')
y = pd.Series(
    100 + np.linspace(0, 30, n)
        + 15 * np.sin(2 * np.pi * np.arange(n) / 365.25)
        + np.random.randn(n) * 4,
    index=dates,
    name='demand',
)

# Build forecaster
forecaster = ForecasterAutoreg(
    regressor=lgb.LGBMRegressor(
        n_estimators=300, learning_rate=0.05, num_leaves=31, verbose=-1
    ),
    lags=[1, 2, 3, 7, 14, 28],
)

# backtesting_forecaster implements expanding-window backtest
metric, predictions = backtesting_forecaster(
    forecaster=forecaster,
    y=y,
    cv=backtesting_forecaster.__code__,  # uses internal CV
    metric='mean_absolute_error',
    initial_train_size=int(n * 0.6),     # first 60% as initial training window
    fixed_train_size=False,              # False = expanding window
    steps=14,                            # forecast horizon per fold
    refit=True,                          # refit model at each backtest step
    verbose=False,
)
print(f"Backtest MAE (expanding, h=14): {metric:.3f}")
`;

const backtestCode2 = `from skforecast.model_selection import backtesting_forecaster
from skforecast.ForecasterAutoreg import ForecasterAutoreg
import lightgbm as lgb
import pandas as pd
import numpy as np

np.random.seed(0)
n = 600
dates = pd.date_range('2021-06-01', periods=n, freq='D')
y = pd.Series(
    100 + np.linspace(0, 30, n)
        + 15 * np.sin(2 * np.pi * np.arange(n) / 365.25)
        + np.random.randn(n) * 4,
    index=dates, name='demand',
)

forecaster = ForecasterAutoreg(
    regressor=lgb.LGBMRegressor(n_estimators=200, learning_rate=0.05, verbose=-1),
    lags=[1, 2, 3, 7, 14, 28],
)

# skforecast v0.9+: pass cv object
from skforecast.model_selection import TimeSeriesFold
cv = TimeSeriesFold(
    initial_train_size=int(n * 0.6),
    steps=14,
    refit=True,
    fixed_train_size=False,   # expanding window
)
metric, preds = backtesting_forecaster(
    forecaster=forecaster, y=y, cv=cv,
    metric='mean_absolute_error', verbose=False,
)
print(f"Expanding-window backtest MAE: {metric:.3f}")
`;

const purgedCVCode = `import numpy as np
from sklearn.base import BaseEstimator

# Purged Cross-Validation: used in financial time series
# Removes observations from training that are "close in time" to the test set
# to prevent information leakage through auto-correlated features.

class PurgedTimeSeriesSplit:
    """
    Expanding-window CV with a purge gap between train and test.
    gap = number of rows to remove from end of train set.
    """
    def __init__(self, n_splits=5, test_size=50, gap=10):
        self.n_splits  = n_splits
        self.test_size = test_size
        self.gap       = gap

    def split(self, X, y=None, groups=None):
        n = len(X)
        total = self.test_size * self.n_splits
        for k in range(self.n_splits):
            val_end   = n - self.test_size * (self.n_splits - k - 1)
            val_start = val_end - self.test_size
            train_end = val_start - self.gap       # purge gap!
            if train_end <= 0:
                continue
            train_idx = np.arange(0, train_end)
            val_idx   = np.arange(val_start, val_end)
            yield train_idx, val_idx

# Example
np.random.seed(0)
X = np.random.randn(500, 10)
pcv = PurgedTimeSeriesSplit(n_splits=5, test_size=40, gap=10)
for i, (tr, va) in enumerate(pcv.split(X)):
    print(f"Fold {i+1}: train=[0:{tr[-1]+1}], gap=[{tr[-1]+1}:{va[0]}], val=[{va[0]}:{va[-1]+1}]")
`;

const references = [
  { title: 'Time Series Cross-Validation in scikit-learn', author: 'Pedregosa et al.', year: 2011, url: 'https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split' },
  { title: 'skforecast: Backtesting documentation', author: 'Escobar, J.', year: 2023, url: 'https://skforecast.org/latest/user_guides/backtesting.html' },
  { title: 'Advances in Financial Machine Learning (Purged CV)', author: 'de Prado, M.L.', year: 2018, url: 'https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086' },
  { title: 'Evaluating Time Series Forecasting Models', author: 'Cerqueira, V. et al.', year: 2020, url: 'https://arxiv.org/abs/1904.00522' },
];

export default function TimeSeriesCV() {
  return (
    <SectionLayout title="Time Series Cross-Validation" difficulty="intermediate" readingTime={10}>
      <p className="text-zinc-300 leading-relaxed">
        Standard k-fold cross-validation randomly shuffles rows, creating future-to-past
        leakage in time series models. Proper time series CV respects temporal ordering:
        training always uses only data available before the validation period.
        This section covers the main CV schemes and their implementation.
      </p>

      <WarningBlock title="Never Use Random K-Fold on Time Series">
        Random k-fold allows validation rows from the past to test on training rows
        from the future. This inflates the estimated performance — the model appears
        better than it actually is when deployed on new, unseen future data. Always
        use time-respecting CV schemes.
      </WarningBlock>

      <CVSchemeViz />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Expanding Window CV</h2>

      <DefinitionBlock term="Expanding Window Cross-Validation">
        At each fold <InlineMath math="k" />, the training set grows to include all
        data up to the start of the validation period:
        <BlockMath math={String.raw`\text{Train}_k = [1, \ldots, t_k], \quad \text{Val}_k = [t_k + 1, \ldots, t_k + h]`} />
        where <InlineMath math="t_k" /> increases with each fold. This mimics real
        deployment: the model has access to all historical data at each forecast origin.
      </DefinitionBlock>

      <p className="text-zinc-300 leading-relaxed">
        Expanding window is the most common choice for forecasting. It simulates
        how a production model is retrained as more data arrives over time.
      </p>

      <PythonCode code={sklearnTSCV} title="Expanding and Sliding Window CV (sklearn)" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Sliding Window CV</h2>

      <DefinitionBlock term="Sliding Window Cross-Validation">
        The training window has a fixed size <InlineMath math="W" />, sliding forward
        at each fold:
        <BlockMath math={String.raw`\text{Train}_k = [t_k - W + 1, \ldots, t_k], \quad \text{Val}_k = [t_k + 1, \ldots, t_k + h]`} />
        This is preferred when older data is irrelevant (structural breaks, regime changes)
        or when memory constraints limit training set size.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Blocked CV</h2>
      <p className="text-zinc-300 leading-relaxed">
        Blocked CV divides the series into non-overlapping blocks, using portions of
        each block for training and the remainder for validation. Unlike expanding or
        sliding CV, it distributes test periods throughout the series — useful for
        detecting model degradation over different time periods.
      </p>

      <NoteBlock title="Gap Between Train and Test">
        For datasets with autocorrelated features (e.g., rolling windows computed from
        recent data), add a <em>gap</em> between the last training row and the first
        validation row. The gap size should match the forecast horizon. This prevents
        the validation target from influencing features in the last training rows.
      </NoteBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Backtesting with skforecast</h2>
      <p className="text-zinc-300 leading-relaxed">
        <code>skforecast</code>'s <code>backtesting_forecaster</code> function
        implements expanding or sliding-window backtesting, including optional model
        refitting at each step.
      </p>

      <PythonCode code={backtestCode2} title="skforecast Expanding-Window Backtest" />

      <div className="overflow-x-auto my-4">
        <table className="text-sm text-zinc-300 border-collapse w-full">
          <thead><tr className="bg-zinc-800">
            {['Scheme', 'Train size', 'Best for', 'Pitfall'].map(h => (
              <th key={h} className="border border-zinc-700 px-3 py-2 text-left text-xs">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              ['Expanding', 'Grows', 'Stationary series with long history', 'Early folds have little data'],
              ['Sliding', 'Fixed W', 'Non-stationary, regime changes', 'Discards useful old data'],
              ['Blocked', 'Variable', 'Testing across full time range', 'Can use future data in block'],
              ['Purged', 'Grows', 'Financial / highly autocorrelated', 'Reduces training size'],
            ].map(r => (
              <tr key={r[0]} className="hover:bg-zinc-800">
                {r.map((v, i) => <td key={i} className="border border-zinc-700 px-3 py-1 text-xs">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Purged CV for Financial Data</h2>
      <p className="text-zinc-300 leading-relaxed">
        Financial time series often use rolling features with large windows. A validation
        row at time <InlineMath math="t" /> may have rolling features that include
        training rows at time <InlineMath math="t - 1, t - 2, \ldots" /> — creating a
        subtle information leak. Purged CV removes a buffer zone of rows between train
        and validation sets.
      </p>

      <PythonCode code={purgedCVCode} title="Purged Cross-Validation" />

      <TheoremBlock title="Choosing the Right CV Scheme">
        For most forecasting applications: use expanding window with a gap equal to
        the forecast horizon, and test_size equal to the deployment horizon. Use 5 folds
        minimum — fewer folds give high-variance estimates. Avoid having folds where the
        training set is smaller than the full seasonal cycle (e.g., &lt;365 rows for
        annual seasonality).
      </TheoremBlock>

      <ExampleBlock title="Hyperparameter Tuning with TimeSeriesSplit">
        <p className="text-zinc-300 text-sm">
          Correct setup for LightGBM hyperparameter search on a daily series:
        </p>
        <ul className="list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2">
          <li>n_splits=5, test_size=28 (matches 4-week deployment horizon)</li>
          <li>gap=7 (prevents leakage from 7-day lag features)</li>
          <li>Initial train size: at least 2 full annual cycles (730 days)</li>
          <li>RandomizedSearchCV with 30 trials, TimeSeriesSplit as cv</li>
          <li>Score each trial by mean MAE across all 5 folds</li>
        </ul>
      </ExampleBlock>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
