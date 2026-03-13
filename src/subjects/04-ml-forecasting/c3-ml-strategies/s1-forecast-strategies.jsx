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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Error accumulation chart: recursive MAE grows with horizon; direct stays flat
function buildErrorData(maxH = 20, baseError = 1.0, growthRate = 0.12) {
  return Array.from({ length: maxH }, (_, i) => {
    const h = i + 1;
    return {
      h,
      recursive: parseFloat((baseError * Math.pow(1 + growthRate, h - 1)).toFixed(3)),
      direct:    parseFloat((baseError * (1 + 0.01 * (h - 1))).toFixed(3)),
      dirrec:    parseFloat((baseError * (1 + 0.05 * (h - 1))).toFixed(3)),
    };
  });
}

function ErrorPropagationChart() {
  const [maxH, setMaxH] = useState(14);
  const data = buildErrorData(maxH);
  return (
    <div style={{ margin: '1.5rem 0', padding: '1rem', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
        <span style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}>Error vs Horizon</span>
        <label style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
          Max horizon: <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{maxH}</span>
        </label>
        <input type="range" min={5} max={28} value={maxH} onChange={e => setMaxH(Number(e.target.value))}
          style={{ width: '100px', accentColor: '#38bdf8' }} />
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
          <XAxis dataKey="h" stroke="#94a3b8" label={{ value: 'Horizon h', fill: '#94a3b8', position: 'insideBottom', offset: -2 }} />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }} />
          <Legend wrapperStyle={{ color: '#94a3b8' }} />
          <Line type="monotone" dataKey="recursive" stroke="#f87171" dot={false} strokeWidth={2} name="Recursive (error compounds)" />
          <Line type="monotone" dataKey="direct"    stroke="#34d399" dot={false} strokeWidth={2} name="Direct (stable)" />
          <Line type="monotone" dataKey="dirrec"    stroke="#fbbf24" dot={false} strokeWidth={2} name="DirRec (moderate growth)" />
        </LineChart>
      </ResponsiveContainer>
      <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.4rem' }}>
        Simulated relative MAE normalised to h=1. Recursive error grows exponentially; Direct stays flat
        since each model predicts directly from observed history.
      </p>
    </div>
  );
}

function StrategyComparison() {
  const [horizon, setHorizon] = useState(7);
  const strategies = [
    { name: 'Recursive', models: 1, steps: horizon, errorProp: true, desc: 'Single model applied iteratively' },
    { name: 'Direct (MIMO)', models: horizon, steps: 1, errorProp: false, desc: `${horizon} independent models` },
    { name: 'DirRec', models: horizon, steps: horizon, errorProp: false, desc: 'Direct + lag feedback (hybrid)' },
    { name: 'Multi-output', models: 1, steps: horizon, errorProp: false, desc: 'Single model, vector output' },
  ];
  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Strategy Comparison (h={horizon})</h3>
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-zinc-400">Horizon h: <span className="text-sky-400 font-bold">{horizon}</span></label>
        <input type="range" min={1} max={28} value={horizon} onChange={e => setHorizon(Number(e.target.value))} className="w-40 accent-sky-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {strategies.map(s => (
          <div key={s.name} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
            <p className="text-sky-400 font-semibold text-sm">{s.name}</p>
            <p className="text-zinc-400 text-xs mt-1">{s.desc}</p>
            <div className="flex gap-4 mt-2">
              <span className="text-xs"><span className="text-amber-300">{s.models}</span> <span className="text-zinc-500">model(s)</span></span>
              <span className={`text-xs ${s.errorProp ? 'text-red-400' : 'text-emerald-400'}`}>
                {s.errorProp ? 'error propagates' : 'no error prop.'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const recursiveCode = `import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error

# ── Build feature matrix ──────────────────────────────────────────────────────
np.random.seed(0)
n = 500
y = np.sin(np.arange(n) * 2 * np.pi / 52) * 10 + np.random.randn(n) * 2 + 50
lags = [1, 2, 3, 7, 14]

def make_features(series, lags):
    df = pd.DataFrame({'y': series})
    for l in lags: df[f'lag_{l}'] = df['y'].shift(l)
    df = df.dropna()
    return df[sorted([c for c in df.columns if c != 'y'])].values, df['y'].values

X, target = make_features(y, lags)
split = int(len(X) * 0.8)
model = GradientBoostingRegressor(n_estimators=200, learning_rate=0.05, random_state=42)
model.fit(X[:split], target[:split])

# ── Recursive multi-step prediction ──────────────────────────────────────────
def recursive_predict(model, history, lags, horizon):
    """history: array of past values (at least max(lags) long)."""
    hist = list(history)
    preds = []
    for _ in range(horizon):
        feat = np.array([hist[-l] for l in lags]).reshape(1, -1)
        p    = model.predict(feat)[0]
        preds.append(p)
        hist.append(p)   # feed back predicted value
    return np.array(preds)

history = y[:split + max(lags)]
horizon = 14
preds_recursive = recursive_predict(model, history, lags, horizon)
true_vals = y[split + max(lags): split + max(lags) + horizon]
print(f"Recursive MAE (h={horizon}): {mean_absolute_error(true_vals, preds_recursive):.3f}")
`;

const directCode = `import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error

# Direct (MIMO) strategy: one model per horizon step h
# Each model is trained to predict y_{t+h} directly from features at time t.

def make_direct_features(series, lags, horizon):
    """Create features and h-step-ahead targets."""
    datasets = {}
    df = pd.DataFrame({'y': series})
    for l in lags:
        df[f'lag_{l}'] = df['y'].shift(l)
    df = df.dropna()
    feat_cols = sorted([c for c in df.columns if c != 'y'])
    X_base = df[feat_cols].values
    for h in range(1, horizon + 1):
        # target at step h (shift back by h from feature row)
        y_h = df['y'].shift(-h).dropna().values
        n   = min(len(X_base), len(y_h))
        datasets[h] = (X_base[:n], y_h[:n])
    return datasets

np.random.seed(0)
n = 600
y = np.sin(np.arange(n) * 2 * np.pi / 52) * 10 + np.random.randn(n) * 2 + 50
lags = [1, 2, 3, 7, 14]
horizon = 14
split_frac = 0.8

datasets = make_direct_features(y, lags, horizon)
direct_models = {}
direct_preds  = {}

for h in range(1, horizon + 1):
    X_h, y_h = datasets[h]
    split = int(len(X_h) * split_frac)
    m = GradientBoostingRegressor(n_estimators=200, learning_rate=0.05, random_state=42)
    m.fit(X_h[:split], y_h[:split])
    direct_models[h] = m
    direct_preds[h]  = m.predict(X_h[split:split+1])[0]  # predict next step

# Evaluate
# For simplicity, evaluate at a single point
print("Direct predictions for each horizon step:")
for h, p in direct_preds.items():
    print(f"  h={h:2d}: pred={p:.2f}")
`;

const dirrecCode = `import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor

# DirRec: hybrid of Direct and Recursive
# - Separate model per horizon step (like Direct)
# - Each model uses predictions from earlier steps as features (like Recursive)
# - This captures inter-horizon dependencies while avoiding error accumulation bias

class DirRecForecaster:
    def __init__(self, base_model, lags, horizon):
        self.base_model  = base_model
        self.lags        = lags
        self.horizon     = horizon
        self.models      = {}

    def _make_features_h(self, series, h, prev_preds=None):
        """Build features for step h, optionally including previous predictions."""
        lag_feats = [series[-l] for l in self.lags if l <= len(series)]
        if prev_preds:
            lag_feats += list(prev_preds)  # add earlier-step predictions
        return np.array(lag_feats).reshape(1, -1)

    def fit(self, series, split):
        """Train one model per horizon step."""
        for h in range(1, self.horizon + 1):
            X, y_list = [], []
            for t in range(max(self.lags), split - h):
                feat = [series[t - l] for l in self.lags]
                # For DirRec, we'd also include model predictions for h-1, h-2 ...
                # simplified here to show the concept
                X.append(feat)
                y_list.append(series[t + h])
            import copy
            m = copy.deepcopy(self.base_model)
            m.fit(np.array(X), np.array(y_list))
            self.models[h] = m

    def predict(self, history):
        preds = []
        for h in range(1, self.horizon + 1):
            feat = np.array([history[-l] for l in self.lags]).reshape(1, -1)
            p    = self.models[h].predict(feat)[0]
            preds.append(p)
        return np.array(preds)

forecaster = DirRecForecaster(
    GradientBoostingRegressor(n_estimators=100, random_state=42),
    lags=[1, 2, 3, 7],
    horizon=14,
)
print("DirRec forecaster class defined.")
`;

const skforecastCode = `# pip install skforecast
from skforecast.ForecasterAutoreg import ForecasterAutoreg
from skforecast.ForecasterAutoregDirect import ForecasterAutoregDirect
import lightgbm as lgb
import pandas as pd
import numpy as np

np.random.seed(0)
n = 500
dates = pd.date_range('2022-01-01', periods=n, freq='D')
y = pd.Series(
    50 + np.linspace(0, 20, n) + 8 * np.sin(2 * np.pi * np.arange(n) / 365),
    index=dates,
    name='y'
)
train = y[:'2023-06-30']
test  = y['2023-07-01':]

# ── Recursive strategy ────────────────────────────────────────────────────────
forecaster_recursive = ForecasterAutoreg(
    regressor=lgb.LGBMRegressor(n_estimators=200, learning_rate=0.05, verbose=-1),
    lags=[1, 2, 3, 7, 14, 28],
)
forecaster_recursive.fit(y=train)
preds_recursive = forecaster_recursive.predict(steps=len(test))

# ── Direct strategy ───────────────────────────────────────────────────────────
forecaster_direct = ForecasterAutoregDirect(
    regressor=lgb.LGBMRegressor(n_estimators=200, learning_rate=0.05, verbose=-1),
    lags=[1, 2, 3, 7, 14, 28],
    steps=len(test),
)
forecaster_direct.fit(y=train)
preds_direct = forecaster_direct.predict(steps=len(test))

from sklearn.metrics import mean_absolute_error
print(f"Recursive MAE: {mean_absolute_error(test, preds_recursive):.3f}")
print(f"Direct MAE:    {mean_absolute_error(test, preds_direct):.3f}")
`;

const references = [
  { title: 'Multi-step time series forecasting: a survey', author: 'Taieb, S.B. et al.', year: 2012, url: 'https://doi.org/10.1016/j.neunet.2012.02.011' },
  { title: 'skforecast: Time series forecasting with scikit-learn regressors', author: 'Escobar, J.', year: 2022, url: 'https://skforecast.org/' },
  { title: 'The DirRec Strategy for Multi-step Forecasting', author: 'Sorjamaa, A. & Lendasse, A.', year: 2006, url: 'https://doi.org/10.1007/11550907_59' },
  { title: 'mlforecast: scalable machine learning for time series', author: 'Nixtla', year: 2023, url: 'https://nixtlaverse.nixtla.io/mlforecast/' },
];

export default function ForecastStrategies() {
  return (
    <SectionLayout title="Multi-Step Forecast Strategies" difficulty="intermediate" readingTime={11}>
      <p className="text-zinc-300 leading-relaxed">
        When forecasting beyond one step ahead, ML models face a fundamental choice:
        how should the model bridge from training (predicting one step) to inference
        (predicting many steps)? The answer defines the <em>forecast strategy</em>.
        Each strategy makes different trade-offs between model complexity, error
        accumulation, and computational cost.
      </p>

      <StrategyComparison />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Recursive Strategy</h2>

      <DefinitionBlock term="Recursive (NARX) Strategy">
        Train a single one-step-ahead model <InlineMath math="f" />, then apply it
        iteratively: the prediction at step <InlineMath math="h" /> becomes an input
        feature for step <InlineMath math="h+1" />:
        <BlockMath math={String.raw`\hat{y}_{t+h} = f(\hat{y}_{t+h-1}, \hat{y}_{t+h-2}, \ldots, y_t, y_{t-1}, \ldots)`} />
        One model, but errors compound: each prediction error propagates into future
        feature values.
      </DefinitionBlock>

      <PythonCode code={recursiveCode} title="Recursive Multi-Step Forecasting" />

      <ErrorPropagationChart />

      <WarningBlock title="Error Accumulation in Recursive Forecasting">
        For horizons beyond 7–14 steps, recursive strategy can degrade significantly
        because prediction errors in early steps corrupt the lag features used by later
        steps. Monitor MAE across horizons (horizon-1, 2, ..., H) to detect this
        degradation.
      </WarningBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Direct (MIMO) Strategy</h2>

      <DefinitionBlock term="Direct (Multiple Input Multiple Output) Strategy">
        Train a separate model <InlineMath math="f_h" /> for each horizon{' '}
        <InlineMath math="h = 1, \ldots, H" />, each using only known history:
        <BlockMath math={String.raw`\hat{y}_{t+h} = f_h(y_t, y_{t-1}, \ldots, y_{t-p})`} />
        <InlineMath math="H" /> models, no error propagation, but models are
        independent and do not share information across horizons.
      </DefinitionBlock>

      <PythonCode code={directCode} title="Direct (MIMO) Multi-Step Forecasting" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">DirRec Strategy</h2>
      <p className="text-zinc-300 leading-relaxed">
        DirRec combines the best of both worlds: separate models per horizon (like Direct)
        where each model uses predictions from earlier steps as additional features
        (like Recursive). This captures inter-horizon dependencies while limiting
        error propagation to adjacent steps.
      </p>

      <PythonCode code={dirrecCode} title="DirRec Strategy Implementation" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Multi-Output Strategy</h2>
      <p className="text-zinc-300 leading-relaxed">
        A single model outputs all horizon predictions simultaneously using
        <code>MultiOutputRegressor</code> from sklearn or native multi-output models.
        This is equivalent to Direct but with shared training infrastructure — the
        underlying estimator is cloned for each horizon step internally.
      </p>

      <div className="overflow-x-auto my-4">
        <table className="text-sm text-zinc-300 border-collapse w-full">
          <thead><tr className="bg-zinc-800">
            {['Strategy', 'Models', 'Error Propagation', 'Best For'].map(h => (
              <th key={h} className="border border-zinc-700 px-3 py-2 text-left text-xs">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              ['Recursive', '1', 'Yes — compounds over h', 'Short horizons (h ≤ 7), simple series'],
              ['Direct (MIMO)', 'H', 'No', 'Long horizons, when h-specific patterns matter'],
              ['DirRec', 'H', 'Partial (adjacent steps only)', 'Best accuracy, highest cost'],
              ['Multi-output', '1 (H heads)', 'No', 'When training budget is limited'],
            ].map(r => (
              <tr key={r[0]} className="hover:bg-zinc-800">
                {r.map((v, i) => <td key={i} className="border border-zinc-700 px-3 py-1 text-xs">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">skforecast Implementation</h2>
      <p className="text-zinc-300 leading-relaxed">
        The <code>skforecast</code> library provides sklearn-compatible classes for
        recursive and direct strategies, wrapping any sklearn regressor.
      </p>

      <PythonCode code={skforecastCode} title="skforecast: Recursive vs. Direct Strategy with LightGBM" />

      <TheoremBlock title="Empirical Strategy Comparison">
        Across diverse benchmark datasets, DirRec consistently achieves the lowest
        error but at the cost of H independent model training runs. For short horizons
        (h ≤ 7), recursive strategy is competitive and much simpler. For long horizons
        (h &gt; 14), direct or DirRec strategies are consistently preferable. When
        using gradient boosting, the direct strategy often matches DirRec accuracy
        at lower computational cost.
      </TheoremBlock>

      <ExampleBlock title="Weekly Retail Demand — Strategy Selection">
        <p className="text-zinc-300 text-sm">
          For a retailer forecasting weekly demand 8 weeks ahead:
        </p>
        <ul className="list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2">
          <li>Recursive: simple, 1 model — but week 8 MAE is 40% higher than week 1</li>
          <li>Direct: 8 separate models — each tuned to its specific horizon, uniform error</li>
          <li>Chosen: Direct strategy with LightGBM, horizon-specific feature lag selection</li>
          <li>Horizon 1: lags [1,2,3,7], Horizon 8: lags [7,8,14,28] (longer-range features)</li>
        </ul>
      </ExampleBlock>

      <NoteBlock title="Horizon-Specific Feature Engineering">
        For the Direct strategy, consider using different lag sets for each horizon.
        The most relevant features for <InlineMath math="h=1" /> (last week's values)
        differ from those for <InlineMath math="h=28" /> (seasonal patterns from a
        month ago). <code>skforecast</code> and <code>mlforecast</code> support
        horizon-specific lag configurations.
      </NoteBlock>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
