import { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

// Simulate a noisy seasonal series
const RAW = (() => {
  const n = 60;
  const data = [];
  for (let i = 0; i < n; i++) {
    const trend = 50 + 0.4 * i;
    const seasonal = 8 * Math.sin((2 * Math.PI * i) / 12);
    const noise = (Math.sin(i * 7.3) * 5 + Math.cos(i * 3.1) * 3);
    data.push(parseFloat((trend + seasonal + noise).toFixed(2)));
  }
  return data;
})();

function simpleMA(data, k) {
  return data.map((_, i) => {
    if (i < k - 1) return null;
    const slice = data.slice(i - k + 1, i + 1);
    return parseFloat((slice.reduce((a, b) => a + b, 0) / k).toFixed(2));
  });
}

function centeredMA(data, k) {
  const half = Math.floor(k / 2);
  return data.map((_, i) => {
    if (i < half || i >= data.length - half) return null;
    const slice = data.slice(i - half, i + half + 1);
    return parseFloat((slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(2));
  });
}

function MovingAverageChart() {
  const [window, setWindow] = useState(6);
  const [showCentered, setShowCentered] = useState(false);

  const maValues = useMemo(() => simpleMA(RAW, window), [window]);
  const cmaValues = useMemo(() => centeredMA(RAW, window % 2 === 0 ? window + 1 : window), [window]);

  const chartData = RAW.map((v, i) => ({
    t: i + 1,
    actual: v,
    sma: maValues[i],
    cma: showCentered ? cmaValues[i] : undefined,
  }));

  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
        Interactive: Moving Average Window Size
      </h3>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          Window (k):&nbsp;
          <span className="font-bold text-sky-500">{window}</span>
        </label>
        <input
          type="range" min={2} max={20} value={window}
          onChange={e => setWindow(Number(e.target.value))}
          className="w-48 accent-sky-500"
        />
        <button
          onClick={() => setShowCentered(v => !v)}
          className={`px-3 py-1 rounded-lg text-xs font-medium border ${showCentered ? 'bg-emerald-600 text-white border-emerald-600' : 'border-zinc-400 text-zinc-500'}`}
        >
          Centered MA
        </button>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="t" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line dataKey="actual" name="Actual" stroke="#94a3b8" strokeWidth={1.5} dot={false} />
          <Line dataKey="sma" name={`SMA(${window})`} stroke="#3b82f6" strokeWidth={2} dot={false} connectNulls />
          {showCentered && (
            <Line dataKey="cma" name="Centered MA" stroke="#10b981" strokeWidth={2} dot={false} connectNulls />
          )}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-zinc-400 mt-2">
        Larger windows smooth more noise but introduce more lag. Toggle Centered MA to see the symmetrically aligned version.
      </p>
    </div>
  );
}

const pythonCode = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Generate example data
np.random.seed(0)
n = 60
t = np.arange(n)
y = 50 + 0.4 * t + 8 * np.sin(2 * np.pi * t / 12) + np.random.normal(0, 3, n)
ts = pd.Series(y, index=pd.date_range("2019-01", periods=n, freq="MS"))

# --- Simple Moving Average ---
k = 6
sma = ts.rolling(window=k).mean()           # trailing MA
print(sma.head(10))

# --- Weighted Moving Average with declining weights ---
weights = np.arange(1, k + 1, dtype=float)  # [1, 2, 3, 4, 5, 6]
weights /= weights.sum()                     # normalize

wma = ts.rolling(window=k).apply(
    lambda x: np.dot(x, weights), raw=True
)
print(wma.head(10))

# --- Centered Moving Average (for seasonal adjustment) ---
# Use even window via two passes for even-length windows
m = 12   # monthly seasonality
cma_even = ts.rolling(window=m, center=True).mean()       # approx centered
# Proper 2×m centered MA for even m:
cma_2m = ts.rolling(window=m).mean()
cma_2m_center = (cma_2m + cma_2m.shift(-1)) / 2          # average to center

# --- Detrend by removing CMA (classic decomposition step) ---
detrended = ts - cma_2m_center
seasonal_avg = detrended.groupby(detrended.index.month).transform('mean')
remainder = detrended - seasonal_avg
print("\\nRemainder variance:", remainder.dropna().var().round(2))

# --- Henderson MA (trend estimation, used in X-11/X-13) ---
# The 13-term Henderson filter weights:
henderson_13 = np.array([
    -0.019, -0.028,  0.000,  0.066,  0.147,  0.214,
     0.240,
     0.214,  0.147,  0.066,  0.000, -0.028, -0.019,
])
hma = ts.rolling(window=13, center=True).apply(
    lambda x: np.dot(x, henderson_13), raw=True
)

# Plot all
fig, axes = plt.subplots(2, 1, figsize=(12, 8), sharex=True)
axes[0].plot(ts, label='Raw', alpha=0.6, color='gray')
axes[0].plot(sma, label=f'SMA({k})', color='blue')
axes[0].plot(wma, label=f'WMA({k})', color='orange', linestyle='--')
axes[0].plot(hma, label='Henderson-13', color='red')
axes[0].legend(); axes[0].set_title('Smoothing Methods')

axes[1].plot(detrended, label='Detrended', alpha=0.7)
axes[1].plot(seasonal_avg, label='Seasonal Component', color='purple')
axes[1].legend(); axes[1].set_title('Decomposition via Centered MA')
plt.tight_layout()
plt.savefig('moving_averages.png', dpi=150)
`;

const references = [
  {
    label: 'FPP3 §3.3',
    title: 'Forecasting: Principles and Practice – Moving averages',
    authors: 'Hyndman, R.J. & Athanasopoulos, G.',
    year: 2021,
    url: 'https://otexts.com/fpp3/moving-averages.html',
  },
  {
    label: 'pandas rolling',
    title: 'pandas.DataFrame.rolling documentation',
    authors: 'pandas development team',
    year: 2023,
    url: 'https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rolling.html',
  },
];

export default function MovingAverages() {
  return (
    <SectionLayout
      title="Moving Averages & Smoothing"
      difficulty="beginner"
      readingTime={14}
      prerequisites={['Baseline methods']}
    >
      <p>
        Moving averages are among the oldest smoothing techniques in time series analysis.
        Rather than forecasting, they are primarily used to <em>extract trend-cycle components</em>
        and remove noise — an essential step before classical decomposition and some ARIMA
        preprocessing.
      </p>

      <h2>1. Simple Moving Average</h2>
      <DefinitionBlock
        label="Definition"
        title="Simple Moving Average (SMA)"
        definition="The k-point trailing moving average at time t is the average of the k most recent observations."
        notation="\hat{T}_t = \frac{1}{k}\sum_{j=0}^{k-1} y_{t-j}"
      />
      <p>
        Key properties of the SMA:
      </p>
      <ul>
        <li>Larger <InlineMath math="k" /> → more smoothing, more lag introduced.</li>
        <li>The MA removes random variation but does not forecast ahead (it is a lag-based filter).</li>
        <li>For a series with no trend, <InlineMath math="k \to T" /> recovers the mean method.</li>
      </ul>

      <h2>2. Weighted Moving Average</h2>
      <p>
        A weighted MA assigns different importance to each observation. Declining weights are
        the most common choice — giving more importance to recent data:
      </p>
      <BlockMath math="\hat{T}_t = \sum_{j=0}^{k-1} w_j \, y_{t-j}, \quad \sum_{j=0}^{k-1} w_j = 1" />
      <p>
        A simple linearly-declining scheme: <InlineMath math="w_j \propto (k - j)" />, so
        the most recent observation receives weight <InlineMath math="k" /> and the oldest
        receives weight 1, normalized to sum to 1.
      </p>

      <h2>3. Centered Moving Average</h2>
      <p>
        For <em>trend estimation</em> rather than smoothing, a <strong>centered</strong> MA
        places the smoothed value at the center of the window:
      </p>
      <BlockMath math="\hat{T}_t = \frac{1}{k}\sum_{j=-(k-1)/2}^{(k-1)/2} y_{t+j} \quad (k \text{ odd})" />
      <p>
        For even <InlineMath math="k" />, a 2×m centered MA is used: average two consecutive
        k-period trailing MAs to achieve centering:
      </p>
      <BlockMath math="\hat{T}_t = \frac{1}{2}\left(\frac{1}{m}\sum_{j=0}^{m-1} y_{t-j} + \frac{1}{m}\sum_{j=1}^{m} y_{t-j}\right)" />
      <p>
        This 2×12 centered MA is used in classical additive decomposition to estimate the
        trend-cycle before computing seasonal and remainder components.
      </p>

      <h2>4. Henderson Moving Average</h2>
      <p>
        The Henderson MA is a specialized filter used in official statistics (X-11/X-13
        seasonal adjustment). Its weights minimize the sum of squares of third differences,
        producing a smooth trend estimate that passes cubic polynomials exactly:
      </p>
      <BlockMath math="\hat{T}_t = \sum_{j=-h}^{h} w_j^{(H)} y_{t+j}" />
      <p>
        The 13-term Henderson filter is commonly used for monthly data. Unlike a simple MA,
        it allows negative weights to better handle non-monotone trends.
      </p>

      <WarningBlock title="Moving Averages Are Not Forecasting Methods">
        Simple and centered moving averages are <em>smoothers</em>, not forecasting methods.
        They cannot produce h-step-ahead forecasts because centered MA requires future values.
        For forecasting, use exponential smoothing or ARIMA instead. Use MAs to extract
        trend components for decomposition and seasonal adjustment.
      </WarningBlock>

      <h2>Interactive Window Size Comparison</h2>
      <MovingAverageChart />

      <NoteBlock type="tip" title="Choosing the Window Size">
        A common heuristic: set <InlineMath math="k" /> equal to the seasonal period
        (<InlineMath math="k=12" /> for monthly, <InlineMath math="k=4" /> for quarterly).
        This averages out exactly one full seasonal cycle, effectively removing seasonality
        from the trend estimate.
      </NoteBlock>

      <h2>Python Implementation</h2>
      <PythonCode
        code={pythonCode}
        filename="moving_averages.py"
        title="Simple, Weighted, Centered, and Henderson MAs with pandas"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
