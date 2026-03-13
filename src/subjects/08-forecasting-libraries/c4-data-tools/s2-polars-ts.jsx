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

export const metadata = {
  title: 'Polars for Fast Data Processing',
  difficulty: 'intermediate',
  readingTime: 10,
  description: 'Use Polars for high-performance time series data processing: lazy evaluation, rolling expressions, and seamless integration with forecasting libraries.',
};

export default function PolarsTS() {
  return (
    <SectionLayout title="Polars for Fast Data Processing" metadata={metadata}>
      <p>
        Polars is a high-performance DataFrame library written in Rust, designed to be a faster
        replacement for pandas. For large-scale forecasting pipelines processing millions of rows
        across thousands of series, Polars can be 5-50x faster than pandas due to its columnar
        execution engine, lazy evaluation, and automatic query optimization.
      </p>

      <h2>Polars vs Pandas for Forecasting</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Feature</th>
              <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>pandas</th>
              <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Polars</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Execution model', 'Eager (row-by-row)', 'Lazy + columnar (Rust)'],
              ['Multi-threading', 'Limited (GIL)', 'Automatic across all cores'],
              ['Memory efficiency', 'Moderate (copies)', 'High (zero-copy, Arrow)'],
              ['GroupBy + rolling', 'Slow for large groups', '5-20x faster'],
              ['Query optimization', 'None', 'Automatic predicate pushdown'],
              ['pandas interop', 'Native', 'Easy conversion: .to_pandas()'],
              ['Ecosystem integration', 'Excellent', 'Growing (direct support in StatsForecast)'],
            ].map(([feat, pd, pl]) => (
              <tr key={feat}>
                <td style={{ padding: '0.6rem', border: '1px solid #e5e7eb', fontWeight: 500 }}>{feat}</td>
                <td style={{ padding: '0.6rem', border: '1px solid #e5e7eb' }}>{pd}</td>
                <td style={{ padding: '0.6rem', border: '1px solid #e5e7eb' }}>{pl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DefinitionBlock title="Lazy Evaluation in Polars">
        Polars' <strong>lazy API</strong> (<code>pl.scan_parquet()</code>, <code>df.lazy()</code>)
        builds a query plan without executing it. When you call <code>.collect()</code>, Polars
        optimizes the full query: pushing filters early, eliminating unused columns, and parallelizing
        independent operations. This is equivalent to database query planning and can dramatically
        reduce memory usage and execution time for complex pipelines.
      </DefinitionBlock>

      <h2>Time Series Operations in Polars</h2>
      <p>
        Polars has first-class datetime support with a rich expression API for time series operations:
      </p>
      <ul>
        <li><code>pl.col('date').dt.year()</code>, <code>.dt.month()</code>, <code>.dt.weekday()</code> — date components</li>
        <li><code>.rolling_mean(window_size=7)</code> — moving average (grouped or ungrouped)</li>
        <li><code>.shift(n)</code> — lag creation</li>
        <li><code>group_by_dynamic()</code> — time-based groupby (replaces pandas resample)</li>
        <li><code>upsample()</code> — frequency upsampling with fill strategies</li>
      </ul>

      <NoteBlock title="group_by vs group_by_dynamic">
        Polars distinguishes between <code>group_by()</code> (static groups, like series_id) and
        <code>group_by_dynamic()</code> (time-based windows). For forecasting feature engineering,
        you typically use <code>group_by('unique_id').agg([...])</code> for per-series statistics
        and <code>group_by_dynamic('ds', every='1w')</code> for temporal aggregations.
      </NoteBlock>

      <PythonCode code={`import polars as pl
import numpy as np
import pandas as pd
from datetime import date, timedelta

# ── Generate panel data ───────────────────────────────────────────────────────
np.random.seed(42)
N_SERIES = 1000
T = 365

records = []
for sid in range(N_SERIES):
    dates = [date(2023, 1, 1) + timedelta(days=i) for i in range(T)]
    base = np.random.uniform(100, 1000)
    y = (base + 0.2 * np.arange(T)
         + base * 0.1 * np.sin(2 * np.pi * np.arange(T) / 7)
         + np.random.randn(T) * base * 0.05)
    records.extend({
        'unique_id': f'S{sid:04d}',
        'ds': d,
        'y': float(max(0, v))
    } for d, v in zip(dates, y))

df = pl.DataFrame(records).with_columns(pl.col('ds').cast(pl.Date))
print(f"Shape: {df.shape}")
print(df.dtypes)

# ── Time features ─────────────────────────────────────────────────────────────
df = df.with_columns([
    pl.col('ds').dt.year().alias('year'),
    pl.col('ds').dt.month().alias('month'),
    pl.col('ds').dt.weekday().alias('day_of_week'),  # 0=Mon
    pl.col('ds').dt.day_of_year().alias('day_of_year'),
    (2 * np.pi * pl.col('ds').dt.weekday() / 7).sin().alias('sin_dow'),
    (2 * np.pi * pl.col('ds').dt.weekday() / 7).cos().alias('cos_dow'),
])

# ── Lag features (per series) ─────────────────────────────────────────────────
# Sort first — required for correct lag computation
df = df.sort(['unique_id', 'ds'])

df = df.with_columns([
    pl.col('y').shift(1).over('unique_id').alias('lag_1'),
    pl.col('y').shift(7).over('unique_id').alias('lag_7'),
    pl.col('y').shift(28).over('unique_id').alias('lag_28'),
    pl.col('y').shift(365).over('unique_id').alias('lag_365'),
])

# ── Rolling statistics (per series) ───────────────────────────────────────────
df = df.with_columns([
    pl.col('y').shift(1).rolling_mean(7).over('unique_id').alias('roll_mean_7'),
    pl.col('y').shift(1).rolling_mean(28).over('unique_id').alias('roll_mean_28'),
    pl.col('y').shift(1).rolling_std(7).over('unique_id').alias('roll_std_7'),
    pl.col('y').shift(1).rolling_min(7).over('unique_id').alias('roll_min_7'),
    pl.col('y').shift(1).rolling_max(7).over('unique_id').alias('roll_max_7'),
])

print(f"After feature engineering: {df.shape}")
print(df.select(['unique_id', 'ds', 'y', 'lag_1', 'roll_mean_7']).head())

# ── Temporal aggregation with group_by_dynamic ────────────────────────────────
weekly_df = (
    df.filter(pl.col('unique_id') == 'S0000')
    .sort('ds')
    .group_by_dynamic('ds', every='1w')
    .agg([
        pl.col('y').mean().alias('weekly_mean'),
        pl.col('y').sum().alias('weekly_sum'),
        pl.col('y').std().alias('weekly_std'),
    ])
)
print("\\nWeekly aggregation:")
print(weekly_df.head())

# ── Lazy evaluation pipeline ──────────────────────────────────────────────────
# Much more memory-efficient for large datasets
lazy_result = (
    pl.scan_csv('/tmp/sales.csv')  # doesn't load data yet
    if False else
    df.lazy()  # use existing DataFrame
)

# Build query plan
feature_query = (
    lazy_result
    .filter(pl.col('y') > 0)
    .sort(['unique_id', 'ds'])
    .with_columns([
        pl.col('y').shift(1).over('unique_id').alias('lag_1'),
        pl.col('y').shift(1).rolling_mean(7).over('unique_id').alias('roll_mean_7'),
    ])
    .select(['unique_id', 'ds', 'y', 'lag_1', 'roll_mean_7'])
    .drop_nulls()
)

# Execute the optimized query
result = feature_query.collect()
print(f"\\nLazy query result: {result.shape}")

# ── Convert to pandas for StatsForecast ───────────────────────────────────────
sf_input = df.select(['unique_id', 'ds', 'y']).to_pandas()
sf_input['ds'] = pd.to_datetime(sf_input['ds'])

from statsforecast import StatsForecast
from statsforecast.models import AutoETS

sf = StatsForecast(models=[AutoETS(season_length=7)], freq='D', n_jobs=-1)
sf.fit(sf_input.groupby('unique_id').tail(90))  # use last 90 days for speed
forecasts_pd = sf.predict(h=7)

# Convert back to Polars
forecasts_pl = pl.from_pandas(forecasts_pd)
print("\\nForecasts (Polars):", forecasts_pl.shape)

# ── Performance benchmark ─────────────────────────────────────────────────────
import time

# Polars lag + rolling (per group)
t0 = time.time()
_ = (df.lazy()
       .sort(['unique_id', 'ds'])
       .with_columns([pl.col('y').shift(1).rolling_mean(7).over('unique_id')])
       .collect())
polars_time = time.time() - t0

# pandas equivalent
df_pd = df.to_pandas()
t0 = time.time()
df_pd['roll_mean_7'] = (df_pd.sort_values(['unique_id', 'ds'])
                         .groupby('unique_id')['y']
                         .transform(lambda x: x.shift(1).rolling(7).mean()))
pandas_time = time.time() - t0

print(f"\\nRolling mean ({N_SERIES} series × {T} obs):")
print(f"  Polars: {polars_time:.2f}s")
print(f"  pandas: {pandas_time:.2f}s")
print(f"  Speedup: {pandas_time/polars_time:.1f}x")
`} />

      <WarningBlock title="over() vs sort_keys in Polars">
        The <code>.over('unique_id')</code> expression in Polars sorts by default within the group
        context. However, for time-dependent operations like <code>shift()</code> and
        <code>rolling_mean()</code>, you must <strong>sort the DataFrame by (unique_id, ds) first</strong>
        with <code>df.sort(['unique_id', 'ds'])</code>. Otherwise, lags may refer to the wrong
        time steps.
      </WarningBlock>

      <ReferenceList references={[
        {
          title: 'Polars: Blazingly Fast DataFrames in Rust and Python',
          authors: 'Vink, R.',
          year: 2024,
          url: 'https://pola.rs/',
        },
        {
          title: 'Apache Arrow: A Cross-Language Development Platform for In-Memory Data',
          authors: 'Apache Software Foundation',
          year: 2016,
          url: 'https://arrow.apache.org/',
        },
      ]} />
    </SectionLayout>
  );
}
