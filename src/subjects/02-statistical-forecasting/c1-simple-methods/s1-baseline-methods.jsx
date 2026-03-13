import { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Generate a simple retail dataset
const RAW_DATA = [
  112, 118, 132, 129, 121, 135, 148, 148, 136, 119,
  104, 118, 115, 126, 141, 135, 125, 149, 170, 170,
  158, 133, 114, 140, 145, 150, 178, 163, 172, 178,
  199, 199, 184, 162, 146, 166,
];

function buildChartData(raw, showMean, showNaive, showSeasonal, showDrift, horizon = 8) {
  const T = raw.length;
  const m = 12; // monthly seasonality
  const mean = raw.reduce((a, b) => a + b, 0) / T;
  const lastVal = raw[T - 1];
  const drift = (raw[T - 1] - raw[0]) / (T - 1);

  const history = raw.map((y, i) => ({ t: i + 1, actual: y }));

  const forecasts = [];
  for (let h = 1; h <= horizon; h++) {
    const t = T + h;
    const entry = { t };
    if (showMean)     entry.mean = parseFloat(mean.toFixed(1));
    if (showNaive)    entry.naive = lastVal;
    if (showSeasonal) {
      const idx = T + h - 1 - m * Math.ceil((T + h - 1 - (T - 1)) / m);
      entry.seasonal = raw[((T - 1 - (m - ((h - 1) % m))) % T + T) % T];
    }
    if (showDrift)    entry.drift = parseFloat((lastVal + h * drift).toFixed(1));
    forecasts.push(entry);
  }

  return { history, forecasts };
}

function BaselineChart() {
  const [showMean, setShowMean]       = useState(true);
  const [showNaive, setShowNaive]     = useState(true);
  const [showSeasonal, setShowSeasonal] = useState(true);
  const [showDrift, setShowDrift]     = useState(true);

  const { history, forecasts } = useMemo(
    () => buildChartData(RAW_DATA, showMean, showNaive, showSeasonal, showDrift),
    [showMean, showNaive, showSeasonal, showDrift],
  );

  const combined = [
    ...history,
    ...forecasts,
  ];
  const splitT = RAW_DATA.length + 1;

  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
        Interactive: Baseline Forecasting Methods
      </h3>
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { key: 'mean',     label: 'Mean',            color: '#f59e0b', state: showMean,     set: setShowMean },
          { key: 'naive',    label: 'Naïve',           color: '#3b82f6', state: showNaive,    set: setShowNaive },
          { key: 'seasonal', label: 'Seasonal Naïve',  color: '#10b981', state: showSeasonal, set: setShowSeasonal },
          { key: 'drift',    label: 'Drift',           color: '#ef4444', state: showDrift,    set: setShowDrift },
        ].map(({ key, label, color, state, set }) => (
          <button
            key={key}
            onClick={() => set(v => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              state
                ? 'text-white border-transparent'
                : 'bg-transparent text-zinc-500 border-zinc-300 dark:border-zinc-600'
            }`}
            style={state ? { backgroundColor: color, borderColor: color } : {}}
          >
            {label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={combined} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="t" tick={{ fontSize: 11 }} label={{ value: 'Time', position: 'insideBottom', offset: -2, fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine x={splitT} stroke="#6b7280" strokeDasharray="4 4" label={{ value: 'Forecast origin', fontSize: 10, fill: '#9ca3af' }} />
          <Line dataKey="actual"   name="Actual"          stroke="#94a3b8" strokeWidth={2} dot={false} connectNulls />
          {showMean     && <Line dataKey="mean"     name="Mean"           stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 3" dot={false} connectNulls />}
          {showNaive    && <Line dataKey="naive"    name="Naïve"          stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 3" dot={false} connectNulls />}
          {showSeasonal && <Line dataKey="seasonal" name="Seasonal Naïve" stroke="#10b981" strokeWidth={2} strokeDasharray="5 3" dot={false} connectNulls />}
          {showDrift    && <Line dataKey="drift"    name="Drift"          stroke="#ef4444" strokeWidth={2} strokeDasharray="5 3" dot={false} connectNulls />}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-zinc-400 mt-2">Toggle methods to compare. Dashed lines are forecasts beyond the vertical reference line.</p>
    </div>
  );
}

const pythonCode = `# Baseline forecasting with statsforecast
# pip install statsforecast

import pandas as pd
import numpy as np
from statsforecast import StatsForecast
from statsforecast.models import (
    Naive,
    SeasonalNaive,
    HistoricAverage,
    RandomWalkWithDrift,
)

# Create a sample dataset (AirPassengers-style)
np.random.seed(42)
dates = pd.date_range('2019-01', periods=36, freq='MS')
values = [112, 118, 132, 129, 121, 135, 148, 148, 136, 119,
          104, 118, 115, 126, 141, 135, 125, 149, 170, 170,
          158, 133, 114, 140, 145, 150, 178, 163, 172, 178,
          199, 199, 184, 162, 146, 166]

df = pd.DataFrame({
    'unique_id': 'passengers',
    'ds': dates,
    'y': values,
})

# Instantiate all four baseline models
sf = StatsForecast(
    models=[
        HistoricAverage(),           # Mean method
        Naive(),                     # Naive method
        SeasonalNaive(season_length=12),  # Seasonal naive (monthly)
        RandomWalkWithDrift(),       # Drift method
    ],
    freq='MS',
    n_jobs=-1,
)

# Fit and forecast 12 periods ahead
forecasts = sf.forecast(df=df, h=12)
print(forecasts.head(12))

# Cross-validation: expanding window, 3-step-ahead, 4 windows
cv_df = sf.cross_validation(
    df=df,
    h=3,
    n_windows=4,
    step_size=1,
)

# Compute MAE per model
from statsforecast.utils import mae
errors = cv_df.groupby('unique_id').apply(
    lambda g: pd.Series({
        'MAE_HistoricAverage':   mae(g['y'], g['HistoricAverage']),
        'MAE_Naive':             mae(g['y'], g['Naive']),
        'MAE_SeasonalNaive':     mae(g['y'], g['SeasonalNaive']),
        'MAE_RWWithDrift':       mae(g['y'], g['RandomWalkWithDrift']),
    })
)
print(errors)
`;

const references = [
  {
    label: 'FPP3 §5',
    title: 'Forecasting: Principles and Practice (3rd ed.) – Chapter 5: The forecaster\'s toolbox',
    authors: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/simple-methods.html',
  },
  {
    label: 'statsforecast',
    title: 'Nixtla statsforecast – fast statistical forecasting',
    authors: 'Nixtla',
    year: 2022,
    url: 'https://nixtlaverse.nixtla.io/statsforecast/index.html',
  },
];

export default function BaselineMethods() {
  return (
    <SectionLayout
      title="Benchmark Forecasting Methods"
      difficulty="beginner"
      readingTime={12}
    >
      <p>
        Before building any sophisticated model, every forecasting project should benchmark against
        simple baseline methods. If your model cannot beat a naïve forecast, something is wrong —
        either the data has no exploitable structure or the model is over-engineered.
      </p>

      <NoteBlock type="fpp3" title="FPP3 Chapter 5">
        Hyndman &amp; Athanasopoulos devote Chapter 5 to these "toolbox" methods, stressing that
        even simple benchmarks provide a lower bar that any serious method must surpass.
      </NoteBlock>

      <h2>1. Mean Method</h2>
      <p>
        The mean method forecasts every future value as the historical average:
      </p>
      <BlockMath math="\hat{y}_{T+h \mid T} = \bar{y} = \frac{1}{T}\sum_{t=1}^{T} y_t" />
      <p>
        The forecast is flat: all future periods get the same value. This works reasonably
        well for stationary series with no trend or seasonality, but badly for everything else.
      </p>

      <h2>2. Naïve Method</h2>
      <DefinitionBlock
        label="Definition 5.1"
        title="Naïve Forecast"
        definition="Set all forecasts equal to the last observed value:"
        notation="\hat{y}_{T+h \mid T} = y_T"
      />
      <p>
        The naïve method is optimal for a random walk process. It is widely used in financial
        markets — the EMH (Efficient Market Hypothesis) implies stock prices follow a random walk,
        making naïve the theoretically justified baseline. <strong>Beating the naïve is the
        minimum bar</strong> for any new model.
      </p>

      <h2>3. Seasonal Naïve Method</h2>
      <p>
        For seasonal data, a more competitive benchmark repeats the value from the same season
        in the previous cycle:
      </p>
      <BlockMath math="\hat{y}_{T+h \mid T} = y_{T+h - m\lceil h/m \rceil}" />
      <p>
        where <InlineMath math="m" /> is the seasonal period (e.g., 12 for monthly, 4 for
        quarterly, 7 for daily-with-weekly-seasonality). The seasonal naïve is often very hard
        to beat on retail, energy, and transportation data.
      </p>

      <h2>4. Drift Method</h2>
      <p>
        The drift method adds the average change observed in the history to the last value:
      </p>
      <BlockMath math="\hat{y}_{T+h \mid T} = y_T + h \cdot \frac{y_T - y_1}{T - 1}" />
      <p>
        This is equivalent to drawing a straight line between the first and last observations
        and extrapolating. When there is a clear long-run trend this often outperforms the
        other three baselines.
      </p>

      <h2>Interactive Comparison</h2>
      <BaselineChart />

      <h2>Why Baselines Matter</h2>
      <p>
        A common mistake is to compare a complex ML model only against a naive RMSE or against
        other ML models. Benchmarks serve three purposes:
      </p>
      <ul>
        <li><strong>Sanity check</strong> — any model worse than naïve should be discarded.</li>
        <li><strong>Context</strong> — a 5% MAPE improvement over seasonal naïve is meaningful;
          a 5% improvement over a random guess is not.</li>
        <li><strong>Computational trade-off</strong> — seasonal naïve runs in microseconds;
          a neural network may run for hours. If accuracy gains are marginal, the baseline wins.</li>
      </ul>

      <NoteBlock type="tip" title="Practical Tip">
        Always include at least <strong>Naïve</strong> and <strong>SeasonalNaïve</strong> in
        every evaluation table. A model that fails to beat both should not be deployed.
      </NoteBlock>

      <h2>Python Implementation</h2>
      <PythonCode
        code={pythonCode}
        filename="baseline_methods.py"
        title="All four baseline methods with statsforecast"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
