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

function CyclicalDemo() {
  const [period, setPeriod] = useState(7);
  const points = Array.from({ length: period }, (_, i) => {
    const angle = (2 * Math.PI * i) / period;
    return { label: i, sin: Math.sin(angle).toFixed(3), cos: Math.cos(angle).toFixed(3) };
  });
  const cx = 80, cy = 80, r = 55;
  return (
    <div className="my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Interactive: Cyclical Encoding on the Unit Circle</h3>
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-zinc-400">Period: <span className="text-sky-400 font-bold">{period}</span></label>
        <input type="range" min={3} max={12} value={period} onChange={e => setPeriod(Number(e.target.value))} className="w-40 accent-sky-500" />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <svg width="160" height="160" className="flex-shrink-0">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3f3f46" strokeWidth="1" />
          {points.map((p, i) => {
            const a = (2 * Math.PI * i) / period - Math.PI / 2;
            const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="5" fill="#38bdf8" />
                <text x={x + 7} y={y + 4} fontSize="9" fill="#94a3b8">{i}</text>
              </g>
            );
          })}
        </svg>
        <div className="overflow-x-auto flex-1">
          <table className="text-xs text-zinc-300 border-collapse w-full">
            <thead><tr className="bg-zinc-800">
              <th className="border border-zinc-700 px-2 py-1">value</th>
              <th className="border border-zinc-700 px-2 py-1 text-amber-300">sin</th>
              <th className="border border-zinc-700 px-2 py-1 text-emerald-300">cos</th>
            </tr></thead>
            <tbody>{points.map(p => (
              <tr key={p.label} className="hover:bg-zinc-800">
                <td className="border border-zinc-700 px-2 py-1 text-center">{p.label}</td>
                <td className="border border-zinc-700 px-2 py-1 text-center text-amber-300">{p.sin}</td>
                <td className="border border-zinc-700 px-2 py-1 text-center text-emerald-300">{p.cos}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-zinc-500 mt-3">Values 0 and {period} encode to the same (sin, cos) pair, preserving periodicity.</p>
    </div>
  );
}

const basicCalendarCode = `import pandas as pd
import numpy as np

def add_calendar_features(df: pd.DataFrame, date_col: str = 'ds') -> pd.DataFrame:
    """Extract standard calendar features from a datetime column."""
    df = df.copy()
    dt = pd.to_datetime(df[date_col])

    df['year']         = dt.dt.year
    df['month']        = dt.dt.month           # 1–12
    df['quarter']      = dt.dt.quarter         # 1–4
    df['week']         = dt.dt.isocalendar().week.astype(int)
    df['day_of_year']  = dt.dt.dayofyear       # 1–366
    df['day_of_month'] = dt.dt.day             # 1–31
    df['day_of_week']  = dt.dt.dayofweek       # 0=Mon … 6=Sun
    df['hour']         = dt.dt.hour            # 0–23 (sub-daily data)

    # Boolean flags
    df['is_weekend']        = dt.dt.dayofweek.isin([5, 6]).astype(int)
    df['is_month_start']    = dt.dt.is_month_start.astype(int)
    df['is_month_end']      = dt.dt.is_month_end.astype(int)
    df['is_quarter_start']  = dt.dt.is_quarter_start.astype(int)
    df['is_quarter_end']    = dt.dt.is_quarter_end.astype(int)
    df['is_year_start']     = dt.dt.is_year_start.astype(int)
    df['is_year_end']       = dt.dt.is_year_end.astype(int)

    return df

dates = pd.date_range('2023-01-01', periods=365, freq='D')
df = pd.DataFrame({'ds': dates, 'y': np.random.randn(365).cumsum() + 100})
df = add_calendar_features(df)
print(df[['ds', 'day_of_week', 'month', 'is_weekend', 'is_month_end']].head(10))
`;

const cyclicalCode = `import pandas as pd
import numpy as np

def add_cyclical_features(df: pd.DataFrame, date_col: str = 'ds') -> pd.DataFrame:
    """Encode periodic calendar values with sin/cos pairs."""
    df = df.copy()
    dt = pd.to_datetime(df[date_col])

    # (raw_value, period) for each cyclical feature
    specs = {
        'month':        (dt.dt.month - 1, 12),
        'day_of_week':  (dt.dt.dayofweek, 7),
        'day_of_month': (dt.dt.day - 1, 31),
        'day_of_year':  (dt.dt.dayofyear - 1, 366),
        'hour':         (dt.dt.hour, 24),
        'week':         (dt.dt.isocalendar().week.astype(int) - 1, 53),
    }
    for name, (values, period) in specs.items():
        angle = 2 * np.pi * values / period
        df[f'{name}_sin'] = np.sin(angle)
        df[f'{name}_cos'] = np.cos(angle)

    return df

df = pd.DataFrame({'ds': pd.date_range('2024-01-01', periods=14, freq='D')})
df = add_cyclical_features(df)
print(df[['ds', 'day_of_week_sin', 'day_of_week_cos']].to_string())
# Monday (0) and next Monday (7): sin(2pi*0/7) == sin(2pi*7/7) => same encoding ✓
`;

const holidayCode = `import pandas as pd
import numpy as np
import holidays   # pip install holidays

def add_holiday_features(df, date_col='ds', country='US', years=None):
    df = df.copy()
    dt = pd.to_datetime(df[date_col])
    if years is None:
        years = dt.dt.year.unique().tolist()

    cal = holidays.country_holidays(country, years=years)
    df['is_holiday']   = dt.dt.date.map(lambda d: 1 if d in cal else 0)
    df['holiday_name'] = dt.dt.date.map(lambda d: cal.get(d, ''))

    # Proximity: days until next / since last holiday
    hol_dates = pd.DatetimeIndex(sorted(pd.Timestamp(d) for d in cal.keys()))

    def days_to_next(ts):
        future = hol_dates[hol_dates > ts]
        return (future[0] - ts).days if len(future) else np.nan

    def days_from_last(ts):
        past = hol_dates[hol_dates <= ts]
        return (ts - past[-1]).days if len(past) else np.nan

    df['days_to_holiday']   = dt.map(days_to_next)
    df['days_from_holiday'] = dt.map(days_from_last)
    df['near_holiday'] = (
        (df['days_to_holiday'] <= 7) | (df['days_from_holiday'] <= 7)
    ).astype(int)
    return df

df = pd.DataFrame({'ds': pd.date_range('2024-12-20', periods=20, freq='D')})
df = add_holiday_features(df, country='US')
print(df[['ds', 'is_holiday', 'holiday_name', 'days_to_holiday']].to_string())
`;

const businessCalendarCode = `import pandas as pd
from pandas.tseries.holiday import USFederalHolidayCalendar
from pandas.tseries.offsets import CustomBusinessDay

us_bd = CustomBusinessDay(calendar=USFederalHolidayCalendar())

def add_business_features(df, date_col='ds'):
    df = df.copy()
    dt = pd.to_datetime(df[date_col])

    df['is_business_day'] = dt.map(
        lambda d: 1 if len(pd.bdate_range(d, d, freq=us_bd)) > 0 else 0
    )

    def bdom(ts):   # business-day of month (1-based)
        return len(pd.bdate_range(ts.replace(day=1), ts, freq=us_bd))

    def bdays_left(ts):  # business days remaining in month
        month_end = ts + pd.offsets.MonthEnd(0)
        return len(pd.bdate_range(ts + pd.Timedelta(days=1), month_end, freq=us_bd))

    df['business_day_of_month']     = dt.map(bdom)
    df['business_days_remaining']   = dt.map(bdays_left)
    return df

df = pd.DataFrame({'ds': pd.bdate_range('2024-12-23', periods=10, freq=us_bd)})
df = add_business_features(df)
print(df.to_string())
`;

const featureEngineCode = `# pip install feature-engine>=1.6
import pandas as pd
import numpy as np
from feature_engine.datetime import DatetimeFeatures
from feature_engine.creation import CyclicalFeatures

df = pd.DataFrame({
    'ds': pd.date_range('2023-01-01', periods=500, freq='D'),
    'y':  np.random.randn(500).cumsum() + 200,
})

# Step 1: extract raw datetime components
dt_enc = DatetimeFeatures(
    variables=['ds'],
    features_to_extract=[
        'month', 'quarter', 'week', 'day_of_week',
        'day_of_month', 'day_of_year',
        'is_weekend', 'month_starts', 'month_ends',
    ],
    drop_original=False,
)
df = dt_enc.fit_transform(df)

# Step 2: apply cyclical encoding to selected period features
cyc_enc = CyclicalFeatures(
    variables=['ds_month', 'ds_day_of_week'],
    drop_original=True,
    max_values={'ds_month': 12, 'ds_day_of_week': 6},
)
df = cyc_enc.fit_transform(df)

print("Cyclical columns:", df.filter(regex='sin|cos').columns.tolist())
print("Total features:", df.shape[1])
`;

const references = [
  { title: 'Forecasting: Principles and Practice (3rd ed.)', author: 'Hyndman & Athanasopoulos', year: 2021, url: 'https://otexts.com/fpp3/' },
  { title: 'feature-engine: DatetimeFeatures', author: 'Galli, S.', year: 2023, url: 'https://feature-engine.trainindata.com/en/latest/user_guide/datetime/DatetimeFeatures.html' },
  { title: 'Encoding Cyclical Continuous Features', author: 'Niculescu-Mizil, A.', year: 2021, url: 'https://ianlondon.github.io/posts/encoding-cyclical-features-24hour-time/' },
  { title: 'holidays Python package', author: 'holidays contributors', year: 2024, url: 'https://python-holidays.readthedocs.io/' },
];

export default function CalendarFeatures() {
  return (
    <SectionLayout title="Calendar and Temporal Features" difficulty="intermediate" readingTime={10}>
      <p className="text-zinc-300 leading-relaxed">
        Raw timestamps carry rich periodic information that tree models cannot extract
        automatically. Unlike convolutional or recurrent networks, gradient-boosted
        trees see each feature as an independent numeric value. Calendar feature
        engineering explicitly exposes seasonality, business rhythms, and holiday effects
        so that any tabular ML model can learn from them.
      </p>

      <DefinitionBlock term="Calendar Feature">
        A numeric representation of a timestamp attribute — day of week, month, quarter,
        holiday indicator, etc. — that makes cyclic or event-driven patterns visible to
        a machine learning model as ordinary input columns.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Basic Temporal Features</h2>
      <p className="text-zinc-300 leading-relaxed">
        The simplest approach extracts integer components from the timestamp. These are
        sufficient for tree models because decision trees learn arbitrary threshold splits
        (e.g., <InlineMath math="\text{month} \geq 10" /> captures Q4).
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
        {[
          { f: 'year', r: '2020–2030', n: 'trend proxy' },
          { f: 'month', r: '1–12', n: 'annual seasonality' },
          { f: 'quarter', r: '1–4', n: 'coarser annual' },
          { f: 'week', r: '1–53', n: 'ISO week number' },
          { f: 'day_of_year', r: '1–366', n: 'fine-grained annual' },
          { f: 'day_of_month', r: '1–31', n: 'pay-cycle effects' },
          { f: 'day_of_week', r: '0–6', n: 'weekly seasonality' },
          { f: 'hour', r: '0–23', n: 'intraday (sub-daily)' },
        ].map(r => (
          <div key={r.f} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
            <p className="font-mono text-sky-400 text-xs">{r.f}</p>
            <p className="text-zinc-400 text-xs mt-1">{r.r}</p>
            <p className="text-zinc-500 text-xs">{r.n}</p>
          </div>
        ))}
      </div>

      <PythonCode code={basicCalendarCode} title="Basic Calendar Feature Extraction (pandas)" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Cyclical Encoding</h2>
      <p className="text-zinc-300 leading-relaxed">
        Integer encodings create a false discontinuity: Sunday (6) is numerically far
        from Monday (0), yet they are adjacent in the weekly cycle. Cyclical encoding
        maps integers onto the unit circle:
      </p>

      <BlockMath math={String.raw`\text{sin\_feat} = \sin\!\left(\frac{2\pi \, v}{T}\right), \qquad \text{cos\_feat} = \cos\!\left(\frac{2\pi \, v}{T}\right)`} />

      <p className="text-zinc-300 leading-relaxed">
        where <InlineMath math="v" /> is the integer value (0-indexed) and{' '}
        <InlineMath math="T" /> is the period. Both sin and cos are always required;
        sin alone cannot distinguish values symmetric about the half-period.
      </p>

      <CyclicalDemo />

      <PythonCode code={cyclicalCode} title="Cyclical Encoding with sin/cos" />

      <NoteBlock title="Cyclical vs. Integer: When It Matters">
        Linear models and neural networks benefit most from cyclical encoding. Tree
        models are less sensitive because they can achieve the same periodicity through
        multi-level splits, but cyclical features still reduce required depth. Use both
        representations and let feature importance guide final selection.
      </NoteBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Holiday Features</h2>
      <p className="text-zinc-300 leading-relaxed">
        Public holidays create sharp level shifts in retail sales, web traffic, and
        energy demand. A binary indicator is the minimum; proximity features capture
        pre-holiday shopping spikes and post-holiday dips.
      </p>

      <PythonCode code={holidayCode} title="Holiday Indicator and Proximity Features" />

      <WarningBlock title="Country and Regional Variation">
        Always use the correct country and subdivision for your data. The{' '}
        <code>holidays</code> library covers 100+ countries and many sub-regional
        calendars. For multi-country datasets, add per-country holiday columns rather
        than a single global flag.
      </WarningBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Business Day Calendars</h2>
      <p className="text-zinc-300 leading-relaxed">
        Financial and B2B datasets follow business-day rhythms rather than calendar-day
        rhythms. Key business-calendar features:
      </p>
      <ul className="list-disc list-inside text-zinc-300 space-y-1 ml-2 mb-4">
        <li><strong>is_business_day</strong> — combines weekend and holiday exclusions</li>
        <li><strong>business_day_of_month</strong> — payroll and invoice cycles</li>
        <li><strong>business_days_remaining</strong> — month-end reporting pressure</li>
      </ul>

      <PythonCode code={businessCalendarCode} title="Business Day Calendar Features (pandas)" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Pipeline-Ready: feature-engine</h2>
      <p className="text-zinc-300 leading-relaxed">
        The <code>feature-engine</code> library provides sklearn-compatible transformers
        for datetime extraction and cyclical encoding, enabling clean deployment inside
        a <code>Pipeline</code>.
      </p>

      <PythonCode code={featureEngineCode} title="feature-engine DatetimeFeatures + CyclicalFeatures" />

      <TheoremBlock title="Empirical Importance Ranking">
        For daily data, <strong>day_of_week</strong> is typically the most important
        calendar feature, followed by <strong>month</strong> and{' '}
        <strong>is_holiday</strong>. For hourly data, <strong>hour</strong> dominates.
        Cyclical encoding of high-importance features consistently reduces RMSE relative
        to integer encoding in gradient-boosted tree benchmarks.
      </TheoremBlock>

      <ExampleBlock title="Retail Sales — Feature Engineering Pipeline">
        <p className="text-zinc-300 text-sm">
          A retail demand forecasting model for a US grocery chain might use:
        </p>
        <ul className="list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2">
          <li>day_of_week_sin, day_of_week_cos — weekly shopping pattern</li>
          <li>month_sin, month_cos — annual seasonality (summer BBQ, Thanksgiving)</li>
          <li>is_holiday, days_to_holiday — Thanksgiving / Christmas surges</li>
          <li>is_month_end — end-of-month coupon redemption spike</li>
          <li>business_day_of_month — B2B bulk orders</li>
        </ul>
        <p className="text-zinc-300 text-sm mt-2">
          Adding these features to a LightGBM baseline typically reduces MAPE by
          10–25% on weekly-seasonal retail data.
        </p>
      </ExampleBlock>

      <WarningBlock title="Feature Explosion with One-Hot Encoding">
        One-hot encoding calendar variables (e.g., 53 binary columns for ISO week)
        creates sparse, high-cardinality features. Prefer cyclical or ordinal integers
        for tree models. Reserve one-hot encoding for linear models where the model
        cannot learn interactions implicitly.
      </WarningBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Summary Checklist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        {[
          'Always include day_of_week for daily or sub-daily data',
          'Use cyclical encoding for linear models and neural nets',
          'Add is_holiday for consumer-facing demand series',
          'Add proximity features (days_to_holiday) for pre-event spikes',
          'Use business-day features for financial / B2B series',
          'Use pandas CustomBusinessDay for non-standard calendars',
          'Embed feature transformers in sklearn Pipeline',
          'Check SHAP importance — prune low-signal calendar columns',
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-zinc-800 border border-zinc-700">
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span className="text-zinc-300 text-sm">{item}</span>
          </div>
        ))}
      </div>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
