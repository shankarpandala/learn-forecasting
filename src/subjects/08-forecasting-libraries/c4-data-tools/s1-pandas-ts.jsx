import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const resampleData = [
  { period: 'Jan', daily_avg: 142, weekly_avg: 148, monthly: 145 },
  { period: 'Feb', daily_avg: 155, weekly_avg: 152, monthly: 153 },
  { period: 'Mar', daily_avg: 138, weekly_avg: 141, monthly: 139 },
  { period: 'Apr', daily_avg: 162, weekly_avg: 159, monthly: 161 },
  { period: 'May', daily_avg: 170, weekly_avg: 168, monthly: 169 },
  { period: 'Jun', daily_avg: 158, weekly_avg: 162, monthly: 160 },
];

export default function PandasTimeSeries() {
  const [activeSection, setActiveSection] = useState('datetime');

  const sections = [
    { key: 'datetime', label: 'DatetimeIndex' },
    { key: 'resample', label: 'Resample' },
    { key: 'rolling', label: 'Rolling' },
    { key: 'shift', label: 'Shift/Lags' },
    { key: 'tz', label: 'Time Zones' },
  ];

  return (
    <SectionLayout
      title="Pandas for Time Series Analysis"
      difficulty="beginner"
      readingTime={30}
      prerequisites={['Python Basics', 'pandas Fundamentals']}
    >
      <p>
        pandas was built with time series analysis in mind. Its <code>DatetimeIndex</code>,
        <code>resample()</code>, <code>rolling()</code>, and <code>shift()</code> operations are
        the backbone of any forecasting pipeline. This section is a practical reference for the
        patterns you will use every day.
      </p>

      <div className="flex gap-2 flex-wrap my-4">
        {sections.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`px-3 py-1 rounded text-sm font-medium ${
              activeSection === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeSection === 'datetime' && (
        <div>
          <h2>DatetimeIndex: Creating and Setting</h2>
          <PythonCode code={`import pandas as pd
import numpy as np

# ── Creating a DatetimeIndex ──────────────────────────────────────────────
# From date range
idx = pd.date_range('2023-01-01', periods=365, freq='D')
idx_monthly = pd.date_range('2020-01', periods=48, freq='MS')  # month start
idx_hourly = pd.date_range('2023-06-01', periods=24*7, freq='h')

# ── Parsing from strings ──────────────────────────────────────────────────
df = pd.DataFrame({
    'date': ['2023-01-01', '2023-01-02', '2023-01-03'],
    'sales': [100, 120, 115],
})
df['date'] = pd.to_datetime(df['date'])
df = df.set_index('date')

# ── From epoch timestamps ─────────────────────────────────────────────────
timestamps = [1672531200, 1672617600, 1672704000]  # Unix seconds
idx_from_epoch = pd.to_datetime(timestamps, unit='s')

# ── Accessing components ──────────────────────────────────────────────────
df.index.year         # array of years
df.index.month        # 1-12
df.index.day          # 1-31
df.index.dayofweek    # 0=Monday, 6=Sunday
df.index.quarter      # 1-4
df.index.is_month_end # boolean: last day of month?

# ── Slicing with strings ──────────────────────────────────────────────────
df['2023']                     # all of 2023
df['2023-06':'2023-08']        # June–August 2023
df.loc['2023-01-15':'2023-02-28']  # date range slice`} />
        </div>
      )}

      {activeSection === 'resample' && (
        <div>
          <h2>Resampling: Frequency Conversion</h2>
          <p>
            <code>resample()</code> groups data by time frequency, similar to{' '}
            <code>groupby()</code> but for time. Use it to downsample (daily → monthly)
            or upsample (monthly → daily with interpolation).
          </p>
          <PythonCode code={`import pandas as pd
import numpy as np

# Create daily data
idx = pd.date_range('2023-01-01', periods=365, freq='D')
df = pd.DataFrame({'sales': np.random.normal(100, 20, 365)}, index=idx)

# ── Downsampling (aggregation) ────────────────────────────────────────────
monthly_sum   = df.resample('MS').sum()      # month-start, sum
weekly_mean   = df.resample('W').mean()      # week-end, mean
quarterly_max = df.resample('QS').max()      # quarter-start, max
annual_total  = df.resample('YS').sum()      # year-start, sum

# Multiple aggregations at once
monthly_stats = df.resample('MS').agg({
    'sales': ['sum', 'mean', 'std', 'count']
})

# ── Upsampling (interpolation) ────────────────────────────────────────────
monthly_data = pd.DataFrame(
    {'sales': [100, 120, 95, 140]},
    index=pd.date_range('2023-01', periods=4, freq='MS')
)
# Forward fill to daily
daily_ffill = monthly_data.resample('D').ffill()
# Linear interpolation to daily
daily_interp = monthly_data.resample('D').interpolate('linear')
# Nearest value
daily_nearest = monthly_data.resample('D').nearest()

# ── OHLCV aggregation for financial data ─────────────────────────────────
price = pd.Series(np.random.normal(100, 5, 365 * 24),
                  index=pd.date_range('2023-01-01', periods=365*24, freq='h'))
daily_ohlcv = price.resample('D').ohlc()  # open, high, low, close`} />

          <div className="my-4">
            <p className="text-sm text-gray-600 mb-2">Resampling aggregation comparison (synthetic retail data)</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={resampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[120, 185]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="daily_avg" stroke="#374151" strokeWidth={1} dot={false} name="Daily avg" />
                <Line type="monotone" dataKey="weekly_avg" stroke="#6366f1" strokeWidth={2} dot={false} name="Weekly avg" />
                <Line type="monotone" dataKey="monthly" stroke="#f59e0b" strokeWidth={2} dot={{ r: 5 }} name="Monthly" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeSection === 'rolling' && (
        <div>
          <h2>Rolling Windows: Moving Statistics</h2>
          <p>
            Rolling windows compute statistics over a sliding window of fixed size. They are
            the primary tool for creating lag-based features and for smoothing noisy series.
          </p>
          <PythonCode code={`import pandas as pd
import numpy as np

idx = pd.date_range('2023-01-01', periods=365, freq='D')
df = pd.DataFrame({'y': np.random.normal(100, 20, 365)}, index=idx)

# ── Basic rolling statistics ──────────────────────────────────────────────
df['ma_7']   = df['y'].rolling(7).mean()     # 7-day moving average
df['ma_28']  = df['y'].rolling(28).mean()    # 28-day moving average
df['std_7']  = df['y'].rolling(7).std()      # 7-day rolling std dev
df['min_7']  = df['y'].rolling(7).min()      # rolling minimum
df['max_7']  = df['y'].rolling(7).max()      # rolling maximum
df['sum_7']  = df['y'].rolling(7).sum()      # rolling sum
df['med_7']  = df['y'].rolling(7).median()   # rolling median

# ── Centered vs. trailing windows ────────────────────────────────────────
# Default: trailing (current + n-1 past values) — safe for forecasting
df['ma_7_trailing']  = df['y'].rolling(7).mean()
# Centered: uses n//2 values before AND after — only for visualization/analysis
df['ma_7_centered']  = df['y'].rolling(7, center=True).mean()

# ── Minimum periods: handle NaN at start ─────────────────────────────────
df['ma_7_minp'] = df['y'].rolling(7, min_periods=1).mean()

# ── Exponentially weighted moving average (EWMA) ─────────────────────────
df['ewma_7']  = df['y'].ewm(span=7).mean()    # span ~ window size
df['ewma_hl'] = df['y'].ewm(halflife=3).mean() # half-life in periods

# ── Rolling correlation (feature for multivariate) ───────────────────────
df['price'] = np.random.normal(50, 5, 365)
df['price_sales_corr_30'] = df['y'].rolling(30).corr(df['price'])

# ── Custom rolling functions ──────────────────────────────────────────────
df['cv_7'] = df['y'].rolling(7).std() / df['y'].rolling(7).mean()  # coeff of variation

# For complex functions use .apply() — slower but flexible
df['range_7'] = df['y'].rolling(7).apply(lambda x: x.max() - x.min())`} />
        </div>
      )}

      {activeSection === 'shift' && (
        <div>
          <h2>Shift: Lag and Lead Features</h2>
          <p>
            <code>shift(n)</code> moves data n periods forward (positive n = lag) or backward
            (negative n = lead). This is the primary way to create autoregressive features for
            ML models and to compute period-over-period changes.
          </p>
          <PythonCode code={`import pandas as pd
import numpy as np

idx = pd.date_range('2023-01-01', periods=52, freq='W')
df = pd.DataFrame({'y': np.random.normal(200, 30, 52)}, index=idx)

# ── Lag features ──────────────────────────────────────────────────────────
df['lag_1']  = df['y'].shift(1)   # last week's value
df['lag_4']  = df['y'].shift(4)   # 4 weeks ago (1 month)
df['lag_52'] = df['y'].shift(52)  # same week last year

# ── Period-over-period changes ────────────────────────────────────────────
df['wow_change']  = df['y'] - df['y'].shift(1)           # absolute WoW
df['wow_pct']     = df['y'].pct_change(1)                 # % WoW
df['yoy_pct']     = df['y'].pct_change(52)                # % YoY
df['yoy_change']  = df['y'] - df['y'].shift(52)           # absolute YoY

# ── Rolling lag combinations (common ML features) ─────────────────────────
df['lag1_ma7']   = df['y'].shift(1).rolling(7).mean()     # MA of last 7, starting from lag-1
df['lag1_std7']  = df['y'].shift(1).rolling(7).std()

# ── Diff: remove trend ────────────────────────────────────────────────────
df['diff_1']  = df['y'].diff(1)     # first difference
df['diff_52'] = df['y'].diff(52)    # seasonal difference (52 weeks)

# ── Percent rank (cross-sectional normalization) ──────────────────────────
df['pct_rank'] = df['y'].rank(pct=True)

# ── Lead (future value) — for target creation, not features! ─────────────
df['next_week_y'] = df['y'].shift(-1)   # target: next week's value
# Drop last row where target is NaN
df_model = df.dropna(subset=['next_week_y'])

# ── Building a complete feature matrix ───────────────────────────────────
feature_cols = ['lag_1', 'lag_4', 'lag_52', 'lag1_ma7', 'lag1_std7',
                'wow_pct', 'yoy_pct']
X = df[feature_cols].dropna()
y = df.loc[X.index, 'next_week_y']
print(f"Feature matrix shape: {X.shape}")`} />
        </div>
      )}

      {activeSection === 'tz' && (
        <div>
          <h2>Time Zones and Business Calendars</h2>
          <PythonCode code={`import pandas as pd
import numpy as np

# ── Time zone localization ─────────────────────────────────────────────────
idx_naive = pd.date_range('2023-01-01', periods=100, freq='h')
idx_utc   = idx_naive.tz_localize('UTC')
idx_ny    = idx_utc.tz_convert('America/New_York')
idx_lon   = idx_utc.tz_convert('Europe/London')

# Series with timezone
s = pd.Series(range(100), index=idx_utc)
s_ny = s.tz_convert('America/New_York')

# ── Business day calendar ─────────────────────────────────────────────────
# B = business days (Mon–Fri), BMS = business month start
biz_days = pd.date_range('2023-01-01', '2023-12-31', freq='B')
print(f"Business days in 2023: {len(biz_days)}")  # ~261

# Custom calendar with US holidays
from pandas.tseries.holiday import USFederalHolidayCalendar
cal = USFederalHolidayCalendar()
biz_us = pd.bdate_range('2023-01-01', '2023-12-31', holidays=cal.holidays())
print(f"US trading days in 2023: {len(biz_us)}")  # ~251

# ── Filling missing dates ─────────────────────────────────────────────────
# A sparse series might have gaps; fill them before rolling
sparse_idx = pd.to_datetime(['2023-01-01', '2023-01-03', '2023-01-07'])
sparse = pd.Series([100, 110, 95], index=sparse_idx)
# Reindex to daily, then fill
daily_idx = pd.date_range(sparse.index.min(), sparse.index.max(), freq='D')
sparse_daily = sparse.reindex(daily_idx)
sparse_filled_ffill = sparse_daily.fillna(method='ffill')
sparse_filled_interp = sparse_daily.interpolate('linear')

# ── PeriodIndex for fiscal calendars ─────────────────────────────────────
quarters = pd.period_range('2020Q1', periods=16, freq='Q')
df_quarterly = pd.DataFrame({'revenue': np.random.normal(1000, 100, 16)},
                             index=quarters)
# Convert Period to Timestamp for plotting
df_quarterly.index = df_quarterly.index.to_timestamp()

# ── Useful time-based features ────────────────────────────────────────────
df = pd.DataFrame({'y': range(365)},
                  index=pd.date_range('2023-01-01', periods=365, freq='D'))
df['day_of_week']   = df.index.dayofweek          # 0–6
df['day_of_year']   = df.index.dayofyear           # 1–365
df['week_of_year']  = df.index.isocalendar().week.astype(int)
df['month']         = df.index.month               # 1–12
df['quarter']       = df.index.quarter             # 1–4
df['is_weekend']    = df.index.dayofweek >= 5      # bool
df['is_month_end']  = df.index.is_month_end        # bool
df['is_month_start'] = df.index.is_month_start     # bool
# Fourier features for cyclicality
df['sin_dow'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
df['cos_dow'] = np.cos(2 * np.pi * df['day_of_week'] / 7)`} />
        </div>
      )}

      <h2>Common Patterns Reference</h2>

      <PythonCode code={`# ── Complete preprocessing pipeline ─────────────────────────────────────
import pandas as pd
import numpy as np

def prepare_ts(df: pd.DataFrame, date_col: str, value_col: str,
               freq: str = 'D') -> pd.DataFrame:
    """Standard time series preprocessing pipeline."""
    df = df.copy()
    # 1. Parse and set datetime index
    df[date_col] = pd.to_datetime(df[date_col])
    df = df.set_index(date_col).sort_index()

    # 2. Ensure complete date range (fill gaps)
    full_idx = pd.date_range(df.index.min(), df.index.max(), freq=freq)
    df = df.reindex(full_idx)

    # 3. Interpolate missing values (up to 3 consecutive)
    df[value_col] = df[value_col].interpolate('linear', limit=3)

    # 4. Forward-fill remaining (e.g., extended gaps)
    df[value_col] = df[value_col].fillna(method='ffill').fillna(method='bfill')

    # 5. Log-transform (if all positive)
    if (df[value_col] > 0).all():
        df['log_y'] = np.log1p(df[value_col])

    # 6. Feature engineering
    df['lag_1']       = df[value_col].shift(1)
    df['lag_7']       = df[value_col].shift(7)
    df['lag_28']      = df[value_col].shift(28)
    df['roll_mean_7'] = df[value_col].shift(1).rolling(7).mean()
    df['roll_std_7']  = df[value_col].shift(1).rolling(7).std()
    df['day_of_week'] = df.index.dayofweek
    df['month']       = df.index.month

    return df.dropna()`} />

      <NoteBlock>
        Always use <code>shift(1)</code> before <code>rolling()</code> when creating
        features for ML models. Without the shift, the rolling window includes the current
        value, which would constitute target leakage during training.
      </NoteBlock>

      <WarningBlock>
        <code>fillna(method='ffill')</code> and <code>bfill</code> are deprecated in recent
        pandas versions. Use <code>fillna(method='ffill')</code> for pandas &lt; 2.2, or
        <code>ffill()</code> / <code>bfill()</code> as standalone methods in pandas &ge; 2.2.
      </WarningBlock>

      <h2>Performance Tips</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Use <code>pd.Timestamp</code> comparisons rather than string slicing in hot paths — string parsing has overhead.</li>
        <li>For large DataFrames, <code>resample().transform()</code> is faster than <code>apply()</code> for simple aggregations.</li>
        <li>Store time series in <strong>Parquet</strong> format with a sorted datetime index — predicate pushdown on dates is extremely fast.</li>
        <li>Use <code>pd.CategoricalIndex</code> for <code>unique_id</code> columns in multi-series DataFrames to reduce memory by 5–10x.</li>
        <li><code>df.index.get_loc()</code> on a sorted DatetimeIndex is O(log n); unsorted is O(n). Always sort.</li>
      </ul>

      <ReferenceList references={[
        {
          authors: 'McKinney, W.',
          year: 2017,
          title: 'Python for Data Analysis: Data Wrangling with Pandas, NumPy, and IPython (2nd ed.)',
          journal: "O'Reilly Media",
        },
        {
          authors: 'pandas development team',
          year: 2024,
          title: 'pandas documentation: Time series / date functionality',
          journal: 'pandas.pydata.org',
        },
      ]} />
    </SectionLayout>
  );
}
