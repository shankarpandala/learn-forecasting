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

export default function NeuralForecastBasics() {
  return (
    <SectionLayout
      title="Getting Started with neuralforecast"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={['Python/pandas basics', 'Neural network concepts', 'Time series fundamentals']}
    >
      <p className="text-gray-700 leading-relaxed">
        <strong>neuralforecast</strong> is Nixtla's open-source library for scalable neural
        forecasting. It provides a unified, scikit-learn-inspired interface to state-of-the-art
        architectures (NHITS, NBEATS, TFT, PatchTST, and more), with built-in support for
        multi-series training, exogenous covariates, probabilistic outputs, and automatic
        hyperparameter tuning.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">The Long-Format DataFrame</h2>
      <p className="text-gray-700 leading-relaxed">
        All neuralforecast models consume a <strong>long-format</strong> DataFrame — one row
        per (series, timestep) pair. This is the same format used across the entire Nixtla
        ecosystem (statsforecast, mlforecast, TimeGPT):
      </p>

      <DefinitionBlock title="Required DataFrame Schema">
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse border border-gray-300 w-full">
            <thead className="bg-indigo-50">
              <tr>
                <th className="border border-gray-300 p-2">Column</th>
                <th className="border border-gray-300 p-2">Type</th>
                <th className="border border-gray-300 p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['unique_id', 'str / int', 'Series identifier. One value per distinct time series.'],
                ['ds', 'datetime / int', 'Timestamp or time index. Must be sorted within each unique_id.'],
                ['y', 'float', 'Target variable to forecast.'],
                ['[covariates]', 'float / int', 'Optional: exogenous features added as additional columns.'],
              ].map(([col, type, desc], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 p-2 font-mono text-indigo-700">{col}</td>
                  <td className="border border-gray-300 p-2 text-gray-600">{type}</td>
                  <td className="border border-gray-300 p-2 text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DefinitionBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Available Models</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-indigo-50">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Model</th>
              <th className="border border-gray-300 p-3 text-left">Architecture</th>
              <th className="border border-gray-300 p-3 text-left">Best For</th>
              <th className="border border-gray-300 p-3 text-left">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['NHITS', 'MLP + MaxPool', 'Long horizons, fast training', 'Easy'],
              ['NBEATS', 'MLP + Basis Expansion', 'Short-medium horizons, interpretability', 'Easy'],
              ['NBEATSx', 'NBEATS + covariates', 'When you have rich covariates', 'Medium'],
              ['TFT', 'LSTM + Attention + VSN', 'Rich covariates, interpretability', 'Hard'],
              ['PatchTST', 'Transformer (patched)', 'Long sequences, channel independence', 'Medium'],
              ['TimesNet', 'Conv2D on 2D time maps', 'Periodic patterns', 'Medium'],
              ['LSTM', 'LSTM encoder-decoder', 'Simple sequential baseline', 'Easy'],
              ['DLinear', 'Linear (decomposed)', 'Fast baseline, long horizons', 'Easy'],
              ['MLP', 'Feedforward MLP', 'Simple baseline', 'Easy'],
              ['VanillaTransformer', 'Standard Transformer', 'Reference comparison', 'Medium'],
            ].map(([model, arch, bestFor, diff], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-3 font-semibold text-indigo-700">{model}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{arch}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{bestFor}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Core API: fit / predict / cross_val_predict</h2>
      <p className="text-gray-700 leading-relaxed">
        The <code>NeuralForecast</code> class wraps one or more models with a consistent interface:
      </p>

      <PythonCode>{`import pandas as pd
import numpy as np
from neuralforecast import NeuralForecast
from neuralforecast.models import NHITS, NBEATS
from neuralforecast.losses.pytorch import MAE, MSE, MQLoss
from neuralforecast.utils import AirPassengersDF

# ── 1. Load data (built-in M4 Airlines dataset) ───────────────────────────────
df = AirPassengersDF  # Already in long format: unique_id, ds, y
print(df.dtypes)
print(df.head())
#    unique_id         ds      y
# 0          1 1949-01-01  112.0
# ...

# ── 2. Instantiate models ─────────────────────────────────────────────────────
H = 12  # Forecast horizon: 12 months

models = [
    NHITS(
        h=H,
        input_size=2 * H,
        max_steps=300,
        loss=MAE(),
        scaler_type='standard',
        random_seed=1,
    ),
    NBEATS(
        h=H,
        input_size=2 * H,
        stack_types=['trend', 'seasonality'],
        n_blocks=[3, 3],
        mlp_units=[[256, 256], [256, 256]],
        max_steps=300,
        loss=MAE(),
        scaler_type='standard',
        random_seed=1,
    ),
]

# ── 3. Fit ────────────────────────────────────────────────────────────────────
nf = NeuralForecast(models=models, freq='M')
nf.fit(df=df)

# ── 4. Predict ────────────────────────────────────────────────────────────────
# Returns a DataFrame with one row per (series, forecast_step)
forecasts = nf.predict()
print(forecasts.head())
#    unique_id         ds     NHITS     NBEATS
# 0          1 1961-01-01  438.7     442.1
# ...

# ── 5. Cross-validation ───────────────────────────────────────────────────────
# Rolling-window CV: n_windows windows, each of size H
cv_df = nf.cross_validation(
    df=df,
    n_windows=3,          # 3 validation windows
    step_size=H,          # Move forward H steps each window
)
print(cv_df.columns.tolist())
# ['unique_id', 'ds', 'cutoff', 'y', 'NHITS', 'NBEATS']

# Compute MAE for each model
for model_name in ['NHITS', 'NBEATS']:
    mae = (cv_df['y'] - cv_df[model_name]).abs().mean()
    print(f"{model_name} MAE: {mae:.2f}")
`}</PythonCode>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Working with Real Data: M4 Monthly</h2>

      <PythonCode>{`from datasetsforecast.m4 import M4

# ── Load 100k M4 monthly series ───────────────────────────────────────────────
train_df, test_df, S_df = M4.load(directory='data', group='Monthly')
# train_df: long-format training data
# test_df: 18-step ahead targets for evaluation
# S_df: seasonal periods metadata

print(f"Training series: {train_df['unique_id'].nunique()}")
print(f"Training rows:   {len(train_df):,}")

H = 18  # M4 monthly horizon

# ── Global training: one model for all 48k monthly series ────────────────────
nf = NeuralForecast(
    models=[
        NHITS(
            h=H,
            input_size=5 * H,                # 90-month lookback
            stack_types=['identity'] * 3,
            n_blocks=[1, 1, 1],
            mlp_units=[[512, 512]] * 3,
            n_pool_kernel_size=[2, 2, 1],
            n_freq_downsample=[6, 2, 1],
            max_steps=1000,
            batch_size=1024,
            learning_rate=1e-3,
            loss=MAE(),
            scaler_type='standard',
        )
    ],
    freq='M',
)

# Trains on all series simultaneously — "global model"
nf.fit(df=train_df)
forecasts = nf.predict()

# ── Evaluate: sMAPE ───────────────────────────────────────────────────────────
merged = forecasts.merge(test_df, on=['unique_id', 'ds'])
smape = (2 * (merged['NHITS'] - merged['y']).abs() /
         (merged['NHITS'].abs() + merged['y'].abs())).mean() * 100
print(f"sMAPE: {smape:.2f}%")
# Expected: ~12-14% (competitive with top M4 methods)
`}</PythonCode>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">AutoNHITS and AutoNBEATS</h2>
      <p className="text-gray-700 leading-relaxed">
        Auto models perform hyperparameter search using Ray Tune under the hood. They test
        multiple configurations and return the best model:
      </p>

      <PythonCode>{`from neuralforecast.auto import AutoNHITS, AutoNBEATS
from ray import tune

# ── AutoNHITS with custom search space ────────────────────────────────────────
nf_auto = NeuralForecast(
    models=[
        AutoNHITS(
            h=H,
            config={
                'input_size': tune.choice([2*H, 3*H, 5*H]),
                'learning_rate': tune.loguniform(1e-4, 1e-2),
                'n_pool_kernel_size': tune.choice([[8, 4, 1], [4, 2, 1], [2, 2, 1]]),
                'n_freq_downsample': tune.choice([[8, 4, 1], [4, 2, 1]]),
                'max_steps': 500,
                'batch_size': 1024,
                'loss': MAE(),
            },
            num_samples=20,         # Try 20 configurations
            refit_with_val=True,    # Refit best config on full data
            cpus=4,
            gpus=0,
        )
    ],
    freq='M',
)

nf_auto.fit(df=train_df, val_size=H)   # Hold out last H steps as validation
best_forecasts = nf_auto.predict()

# ── Saving and loading ────────────────────────────────────────────────────────
# Save trained model
nf.save(path='./checkpoints/nhits_m4/', overwrite=True)

# Load and predict without retraining
nf_loaded = NeuralForecast.load(path='./checkpoints/nhits_m4/')
new_forecasts = nf_loaded.predict()
`}</PythonCode>

      <NoteBlock title="GPU Training">
        neuralforecast automatically uses GPU if available (via PyTorch Lightning). For large
        datasets, GPU training can be 10-50x faster. Pass <code>accelerator='gpu'</code> to
        each model constructor to force GPU usage even if CPU is available, or configure via
        PyTorch Lightning's <code>Trainer</code>.
      </NoteBlock>

      <WarningBlock title="val_size vs n_windows">
        Two ways to validate: (1) <code>val_size=H</code> in <code>nf.fit()</code> holds out
        the last H steps from each series for early stopping; (2) <code>nf.cross_validation(n_windows=3)</code>
        runs 3 rolling-window evaluations after fitting. The first is faster (used during training),
        the second gives a proper out-of-sample estimate. Use both: val_size for model selection,
        cross_validation for reporting.
      </WarningBlock>

      <ReferenceList references={[
        { authors: 'Olivares, K.G. et al.', year: 2022, title: 'NeuralForecast: User friendly state-of-the-art neural forecasting models', venue: 'arXiv', url: 'https://arxiv.org/abs/2207.03663' },
        { authors: 'Garza, A. et al.', year: 2022, title: 'StatsForecast: Lightning fast forecasting with statistical and econometric models', venue: 'NeurIPS Datasets and Benchmarks', url: 'https://arxiv.org/abs/2207.03663' },
        { authors: 'Challu, C. et al.', year: 2023, title: 'N-HiTS: Neural Hierarchical Interpolation for Time Series Forecasting', venue: 'AAAI 2023', url: 'https://arxiv.org/abs/2201.12886' },
      ]} />
    </SectionLayout>
  );
}
