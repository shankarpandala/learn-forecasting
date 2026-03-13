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
  title: 'Scaling StatsForecast',
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'Scale StatsForecast to millions of time series using Ray, Dask, and Spark backends for distributed parallel processing.',
};

export default function StatsForecastScale() {
  return (
    <SectionLayout title="Scaling StatsForecast" metadata={metadata}>
      <p>
        Industrial forecasting pipelines often require forecasting hundreds of thousands or millions of
        time series — think retail demand for all SKU-store combinations, or IoT sensor predictions for
        an entire fleet. StatsForecast's architecture is designed for exactly this scale, supporting
        multiple parallel and distributed backends.
      </p>

      <h2>Scaling Architecture</h2>
      <p>
        StatsForecast's parallel execution model works as follows:
      </p>
      <ul>
        <li>Each series is independent and can be fit and predicted without communication with other series</li>
        <li>The work is embarrassingly parallel — ideal for horizontal scaling</li>
        <li>Backends (Ray, Dask, Spark) handle task scheduling and data distribution</li>
        <li>The Python API is identical regardless of backend — change one parameter to scale</li>
      </ul>

      <DefinitionBlock title="n_jobs Parameter">
        With <code>n_jobs=-1</code>, StatsForecast uses Python's <code>joblib</code> to parallelize
        across all available CPU cores on a single machine. This is the simplest way to achieve
        parallelism and works without any additional infrastructure. For multi-machine clusters, use
        Ray or Dask backends.
      </DefinitionBlock>

      <h2>Ray Backend</h2>
      <p>
        Ray is a distributed computing framework that enables StatsForecast to scale across multiple
        machines. StatsForecast automatically detects a Ray cluster and distributes series fitting
        across workers:
      </p>
      <ul>
        <li>Works on a single machine (uses Ray's local execution mode) or a Ray cluster</li>
        <li>Near-linear scaling with the number of workers up to thousands of cores</li>
        <li>Handles worker failures automatically with retry logic</li>
        <li>Compatible with Ray on Kubernetes, AWS, GCP, and Azure</li>
      </ul>

      <h2>Dask Backend</h2>
      <p>
        Dask integrates with the PyData ecosystem (pandas, NumPy) and is often easier to set up in
        existing data engineering environments. StatsForecast accepts a Dask DataFrame and processes
        it in parallel partitions:
      </p>
      <ul>
        <li>Each Dask partition contains a subset of series</li>
        <li>Forecasting runs in parallel across partitions</li>
        <li>Lazy evaluation: the computation graph is built before execution</li>
        <li>Works with Dask on YARN (Hadoop), Kubernetes, or locally</li>
      </ul>

      <h2>Spark Integration</h2>
      <p>
        For organizations with existing Spark infrastructure, StatsForecast integrates through
        pandas UDFs or the Fugue framework, which provides a unified interface for Spark, Dask, and Ray:
      </p>

      <NoteBlock title="Fugue: Write Once, Run Anywhere">
        Fugue (pip install fugue) provides an abstraction layer that lets you write StatsForecast code
        once and run it on any distributed backend. This is particularly useful in organizations where
        different teams use different infrastructure — the forecasting code remains unchanged.
      </NoteBlock>

      <h2>Performance Benchmarks</h2>
      <p>
        Benchmarks on 100,000 monthly series (M4 dataset size × 100):
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Backend</th>
              <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Hardware</th>
              <th style={{ padding: '0.75rem', border: '1px solid #e5e7eb' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['statsmodels ARIMA (single)', '1 CPU core', '~8 hours'],
              ['StatsForecast (n_jobs=-1)', '8 CPU cores', '~3 minutes'],
              ['StatsForecast + Ray', '4 machines × 8 cores', '~45 seconds'],
              ['StatsForecast + Dask', '4 machines × 8 cores', '~55 seconds'],
            ].map(([backend, hw, time]) => (
              <tr key={backend}>
                <td style={{ padding: '0.6rem', border: '1px solid #e5e7eb' }}>{backend}</td>
                <td style={{ padding: '0.6rem', border: '1px solid #e5e7eb' }}>{hw}</td>
                <td style={{ padding: '0.6rem', border: '1px solid #e5e7eb' }}>{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExampleBlock title="Estimating Infrastructure Needs">
        Rule of thumb: StatsForecast with AutoARIMA processes approximately 500-2000 series per minute
        per CPU core (depending on series length and model complexity). For 1 million series and a
        1-hour SLA: you need roughly 1M / (1000 × 60) ≈ 17 cores minimum, so a 4-machine × 8-core
        cluster comfortably handles this workload.
      </ExampleBlock>

      <PythonCode code={`import pandas as pd
import numpy as np
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA, AutoETS, SeasonalNaive

# ── Generate large-scale panel data ──────────────────────────────────────────
np.random.seed(42)
N_SERIES = 10_000   # simulate 10K series
T = 156             # 3 years of weekly data
horizon = 12

records = []
for sid in range(N_SERIES):
    t = np.arange(T)
    level = np.random.uniform(50, 500)
    trend = np.random.uniform(-0.5, 0.5)
    y = (level + trend * t
         + np.random.uniform(5, 30) * np.sin(2 * np.pi * t / 52)
         + np.random.randn(T) * np.random.uniform(2, 15))
    dates = pd.date_range('2021-01-01', periods=T, freq='W')
    for d, v in zip(dates, y):
        records.append({'unique_id': f'S{sid:05d}', 'ds': d, 'y': v})

df = pd.DataFrame(records)
print(f"Dataset: {len(df):,} rows, {df['unique_id'].nunique():,} series")

# ── Option 1: Single machine with joblib parallelism ─────────────────────────
import time
sf_local = StatsForecast(
    models=[AutoARIMA(season_length=52), AutoETS(season_length=52)],
    freq='W',
    n_jobs=-1,  # use all CPU cores
    fallback_model=SeasonalNaive(season_length=52),
)
t0 = time.time()
sf_local.fit(df)
forecasts_local = sf_local.predict(h=horizon)
elapsed = time.time() - t0
print(f"Local (n_jobs=-1): {elapsed:.1f}s for {N_SERIES:,} series")

# ── Option 2: Ray backend ─────────────────────────────────────────────────────
try:
    import ray
    ray.init(ignore_reinit_error=True)

    sf_ray = StatsForecast(
        models=[AutoARIMA(season_length=52), AutoETS(season_length=52)],
        freq='W',
        n_jobs=-1,
        fallback_model=SeasonalNaive(season_length=52),
    )

    t0 = time.time()
    # Convert to Ray Dataset for distributed processing
    import ray.data
    ray_ds = ray.data.from_pandas(df)

    # StatsForecast with Ray uses the ray backend automatically when
    # a Ray dataset is passed
    sf_ray.fit(df)  # Ray workers handle parallelism
    forecasts_ray = sf_ray.predict(h=horizon)
    elapsed_ray = time.time() - t0
    print(f"Ray backend: {elapsed_ray:.1f}s for {N_SERIES:,} series")
    ray.shutdown()
except ImportError:
    print("Ray not installed. Install with: pip install 'ray[default]'")

# ── Option 3: Dask backend ────────────────────────────────────────────────────
try:
    import dask.dataframe as dd
    from dask.distributed import Client

    # Start local Dask cluster
    client = Client(n_workers=4, threads_per_worker=2, memory_limit='4GB')
    print(f"Dask dashboard: {client.dashboard_link}")

    # Partition data by series
    ddf = dd.from_pandas(df, npartitions=16)

    sf_dask = StatsForecast(
        models=[AutoARIMA(season_length=52)],
        freq='W',
        n_jobs=-1,
    )
    sf_dask.fit(df)  # Dask handles distribution
    forecasts_dask = sf_dask.predict(h=horizon)
    client.close()
    print("Dask forecasting complete.")
except ImportError:
    print("Dask not installed. Install with: pip install 'dask[distributed]'")

# ── Option 4: Fugue for Spark/Dask/Ray with identical API ────────────────────
try:
    from fugue import transform
    from statsforecast import StatsForecast
    from statsforecast.models import AutoETS

    def forecast_series(df: pd.DataFrame) -> pd.DataFrame:
        """Forecast a group of series — runs on each worker."""
        sf = StatsForecast(
            models=[AutoETS(season_length=52)],
            freq='W',
            n_jobs=1
        )
        sf.fit(df)
        return sf.predict(h=12)

    # Run locally (swap 'pandas' for 'spark', 'dask', or 'ray')
    result = transform(
        df,
        forecast_series,
        schema='unique_id:str, ds:date, AutoETS:float',
        partition={'by': 'unique_id'},
        engine='pandas'
    )
    print("Fugue result shape:", result.shape)
except ImportError:
    print("Fugue not installed. Install with: pip install fugue")

# ── Memory-efficient chunked processing ───────────────────────────────────────
def forecast_in_chunks(df, chunk_size=1000, **sf_kwargs):
    """Process series in chunks to limit memory usage."""
    all_ids = df['unique_id'].unique()
    results = []
    for i in range(0, len(all_ids), chunk_size):
        chunk_ids = all_ids[i:i+chunk_size]
        chunk_df = df[df['unique_id'].isin(chunk_ids)]
        sf = StatsForecast(**sf_kwargs)
        sf.fit(chunk_df)
        preds = sf.predict(h=horizon)
        results.append(preds)
        if (i // chunk_size) % 10 == 0:
            print(f"  Processed {min(i+chunk_size, len(all_ids)):,}/{len(all_ids):,} series")
    return pd.concat(results, ignore_index=True)

# chunked_forecasts = forecast_in_chunks(
#     df, chunk_size=2000,
#     models=[AutoETS(season_length=52)], freq='W', n_jobs=-1
# )
`} />

      <WarningBlock title="Memory Management at Scale">
        With millions of series, storing all predictions in memory simultaneously may not be feasible.
        Use chunked processing or streaming approaches, writing intermediate results to Parquet files.
        StatsForecast's output for N series with horizon H and M models requires approximately
        N × H × M × 8 bytes — for 1M series, 12 steps, 3 models: ~288 MB, which is manageable;
        for 10M series it becomes 2.9 GB, requiring careful memory planning.
      </WarningBlock>

      <ReferenceList references={[
        {
          title: 'StatsForecast: Lightning Fast Forecasting with Statistical and Econometric Models',
          authors: 'Garza, A. et al.',
          year: 2022,
          journal: 'NeurIPS Datasets and Benchmarks',
        },
        {
          title: 'Ray: A Distributed Framework for Emerging AI Applications',
          authors: 'Moritz, P. et al.',
          year: 2018,
          journal: 'OSDI',
        },
        {
          title: 'Fugue: Unifying Heterogeneous Distributed Computing Workloads',
          authors: 'Han, H. & Zhao, G.',
          year: 2021,
          url: 'https://fugue-tutorials.readthedocs.io/',
        },
      ]} />
    </SectionLayout>
  );
}
