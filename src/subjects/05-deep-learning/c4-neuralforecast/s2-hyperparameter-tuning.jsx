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

const hyperparamGuide = [
  { param: 'learning_rate', impact: 'High', range: '1e-4 – 1e-2', tip: 'Log-uniform search; 1e-3 is a safe default' },
  { param: 'hidden_size', impact: 'High', range: '32 – 512', tip: 'Double iteratively; diminishing returns above 256' },
  { param: 'input_size', impact: 'High', range: '2H – 10H', tip: 'At least 2x seasonal period' },
  { param: 'dropout', impact: 'Medium', range: '0.0 – 0.4', tip: 'Increase if validation loss diverges from train' },
  { param: 'batch_size', impact: 'Medium', range: '16 – 256', tip: 'Larger = faster training; smaller = better generalization' },
  { param: 'n_layers', impact: 'Medium', range: '1 – 4', tip: 'Rarely beneficial above 3' },
  { param: 'max_steps', impact: 'Low', range: '300 – 2000', tip: 'Use early stopping instead of tuning this' },
];

function HyperparamTable() {
  const impactColor = { High: 'bg-red-100 text-red-800', Medium: 'bg-yellow-100 text-yellow-800', Low: 'bg-green-100 text-green-800' };
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-gray-700">Parameter</th>
            <th className="px-4 py-2 text-left text-gray-700">Impact</th>
            <th className="px-4 py-2 text-left text-gray-700">Typical Range</th>
            <th className="px-4 py-2 text-left text-gray-700">Tip</th>
          </tr>
        </thead>
        <tbody>
          {hyperparamGuide.map(h => (
            <tr key={h.param} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2 font-mono text-gray-900">{h.param}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColor[h.impact]}`}>{h.impact}</span>
              </td>
              <td className="px-4 py-2 text-gray-600 font-mono text-xs">{h.range}</td>
              <td className="px-4 py-2 text-gray-600 text-xs">{h.tip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const autoTuningCode = `from neuralforecast import NeuralForecast
from neuralforecast.auto import AutoNHITS, AutoTFT, AutoLSTM
from neuralforecast.losses.pytorch import MAE, MQLoss
import pandas as pd
import numpy as np
import ray

# ── 1. Dataset ─────────────────────────────────────────────────────────────
np.random.seed(0)
n_series, T = 20, 120
records = []
for uid in range(n_series):
    dates = pd.date_range('2020-01-01', periods=T, freq='ME')
    t = np.arange(T)
    y = (100 + 5*uid % 10 + 20*np.sin(2*np.pi*t/12) + 3*np.random.randn(T))
    for d, v in zip(dates, y):
        records.append({'unique_id': f's{uid}', 'ds': d, 'y': float(v)})
df = pd.DataFrame(records)
horizon = 12

# ── 2. AutoNHITS: search over N-HiTS hyperparameters ──────────────────────
# num_samples: total Ray Tune trials to run
# Default search space covers: input_size, n_freq_downsample, learning_rate,
#   dropout, mlp_units, n_blocks, etc.
auto_nhits = AutoNHITS(
    h=horizon,
    loss=MAE(),
    config=None,           # use default search space
    num_samples=20,        # run 20 random trials
    refit_with_val=True,   # refit best config on full train+val
    random_seed=42,
)

nf = NeuralForecast(models=[auto_nhits], freq='ME')
nf.fit(df)
pred = nf.predict()
print("Best N-HiTS config:", auto_nhits.results.best_config)

# ── 3. AutoTFT with custom search space ───────────────────────────────────
from ray import tune

custom_config = {
    'hidden_size': tune.choice([32, 64, 128]),
    'n_head':      tune.choice([2, 4, 8]),
    'dropout':     tune.uniform(0.0, 0.3),
    'learning_rate': tune.loguniform(1e-4, 1e-2),
    'input_size':  tune.choice([horizon*2, horizon*3, horizon*4]),
    'max_steps':   tune.choice([300, 500]),
    'batch_size':  tune.choice([16, 32, 64]),
    'loss':        tune.choice([MQLoss(level=[10, 50, 90])]),
}

auto_tft = AutoTFT(
    h=horizon,
    loss=MQLoss(level=[10, 50, 90]),
    config=custom_config,
    num_samples=15,
    random_seed=42,
)

nf2 = NeuralForecast(models=[auto_tft], freq='ME')
nf2.fit(df)
best_tft_config = auto_tft.results.best_config
print("Best TFT hidden_size:", best_tft_config['hidden_size'])

# ── 4. Manual Ray Tune for fine-grained control ────────────────────────────
# If you want full Ray Tune control (ASHA scheduler, population-based training)
# you can integrate NeuralForecast models into a custom tune loop:

from ray import tune
from ray.tune.schedulers import ASHAScheduler

def train_nhits(config):
    from neuralforecast import NeuralForecast
    from neuralforecast.models import NHITS
    from neuralforecast.losses.pytorch import MAE
    m = NHITS(
        h=horizon,
        input_size=config['input_size'],
        n_freq_downsample=config['n_freq_downsample'],
        learning_rate=config['lr'],
        max_steps=300,
        loss=MAE(),
    )
    nf = NeuralForecast(models=[m], freq='ME')
    nf.fit(df)
    cv = nf.cross_validation(df, n_windows=2, step_size=horizon)
    from neuralforecast.losses.numpy import mae
    val_mae = mae(cv['NHITS'].values, cv['y'].values)
    tune.report(val_mae=val_mae)

search_space = {
    'input_size':          tune.choice([horizon*2, horizon*3]),
    'n_freq_downsample':   tune.choice([[4, 2, 1], [2, 1, 1]]),
    'lr':                  tune.loguniform(1e-4, 1e-2),
}

# Uncomment to run:
# ray.init(ignore_reinit_error=True)
# analysis = tune.run(
#     train_nhits,
#     config=search_space,
#     num_samples=10,
#     scheduler=ASHAScheduler(metric='val_mae', mode='min'),
# )
# print(analysis.best_config)

# ── 5. Practical tips ─────────────────────────────────────────────────────
print("""
Compute budget guide:
  Quick experiment  : num_samples=10,  max_steps=200  (~5 min, CPU)
  Standard search   : num_samples=30,  max_steps=500  (~30 min, GPU)
  Thorough search   : num_samples=100, max_steps=1000 (~3 hr, multi-GPU)

Always use early stopping (early_stop_patience_steps=50) to avoid
wasting compute on clearly bad configurations.
""")
`;

export default function HyperparameterTuningSection() {
  return (
    <SectionLayout
      title="Hyperparameter Tuning for DL Forecasters"
      difficulty="advanced"
      readingTime={11}
    >
      <p className="text-gray-700 leading-relaxed">
        Deep learning forecasting models have many hyperparameters — architecture
        size, learning rate, dropout, look-back window — that strongly affect
        performance. NeuralForecast provides <code>AutoModel</code> wrappers
        (AutoNHITS, AutoTFT, AutoLSTM) that integrate with Ray Tune to
        automatically search for good configurations.
      </p>

      <DefinitionBlock title="AutoModel in NeuralForecast">
        NeuralForecast's <strong>Auto</strong> variants (e.g.,{' '}
        <code>AutoNHITS</code>) wrap the corresponding model with a Ray Tune
        hyperparameter search. They run <code>num_samples</code> random trials,
        each training with a different hyperparameter configuration, and select
        the best based on validation loss. The best model is optionally refit
        on the full training + validation data.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Hyperparameter Impact Guide
      </h2>
      <HyperparamTable />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Search Strategies
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Three common approaches, in order of increasing compute cost:
      </p>
      <ol className="list-decimal ml-6 mt-2 space-y-2 text-gray-700 text-sm">
        <li>
          <strong>Random search:</strong> sample configurations uniformly at
          random. Surprisingly effective — with 20–50 trials, random search finds
          near-optimal configurations for most forecasting tasks. This is what
          AutoNHITS/AutoTFT use by default.
        </li>
        <li>
          <strong>Bayesian optimization (Optuna/BOHB):</strong> fits a surrogate
          model of the objective to choose the next trial intelligently. Better
          than random for high-dimensional search spaces with many interactions.
        </li>
        <li>
          <strong>Population-Based Training (PBT):</strong> evolves a
          population of models, copying weights from good configurations and
          mutating hyperparameters. Useful for long-training models where early
          stopping information is expensive to compute.
        </li>
      </ol>

      <TheoremBlock title="ASHA: Asynchronous Successive Halving">
        <p>
          Ray Tune's default scheduler for NeuralForecast is ASHA (Asynchronous
          Successive Halving). It aggressively terminates bad trials early by
          comparing intermediate validation metrics:
        </p>
        <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
          <li>All trials start with a small budget (few training steps).</li>
          <li>The bottom half of trials (by validation loss) are stopped.</li>
          <li>Survivors get double the budget.</li>
          <li>This continues until only 1 trial remains with the full budget.</li>
        </ul>
        <p className="text-sm mt-2">
          ASHA provides nearly the same result as fully training all trials but
          uses roughly <InlineMath math="\log_2(n)" /> times less compute for{' '}
          <InlineMath math="n" /> trials.
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Implementation</h2>
      <PythonCode code={autoTuningCode} />

      <ExampleBlock title="When AutoModels Are Worth the Cost">
        <p className="text-sm text-gray-700">
          Automated tuning is worth the compute when: (a) you will deploy the
          model in production for months, (b) the dataset is large enough that
          architecture choices matter, or (c) the accuracy gain justifies the
          cost. For quick experiments or baseline comparisons, use the default
          hyperparameters — they are well-tuned starting points from the
          original papers. Reserve AutoModel search for final production training.
        </p>
      </ExampleBlock>

      <WarningBlock title="Overfitting to Validation Set">
        Running many hyperparameter trials risks <em>meta-overfitting</em>: the
        selected configuration may be overfitted to the specific validation
        window used during search. Mitigate this by: (1) using a held-out test
        set that is never touched during tuning, (2) using multiple validation
        windows (<code>n_windows=3</code>), and (3) limiting search to{' '}
        <InlineMath math="\leq 50" /> trials for small datasets.
      </WarningBlock>

      <NoteBlock title="Compute Considerations">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li><strong>CPU only:</strong> limit to 10–20 trials, <code>max_steps=200</code>. Good for fast models like N-HiTS.</li>
          <li><strong>Single GPU:</strong> 30–50 trials, <code>max_steps=500</code>. Suitable for TFT on medium datasets.</li>
          <li><strong>Multi-GPU / Ray cluster:</strong> 100+ trials in parallel. Required for exhaustive search on large panels.</li>
          <li>Always set a <code>time_budget_s</code> limit in Ray Tune to avoid runaway jobs.</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Li, L., et al.', year: 2018, title: 'Massively Parallel Hyperparameter Tuning', venue: 'arXiv (ASHA)' },
        { author: 'Liaw, R., et al.', year: 2018, title: 'Tune: A Research Platform for Distributed Model Selection and Training', venue: 'ICML AutoML Workshop' },
        { author: 'Bergstra, J., & Bengio, Y.', year: 2012, title: 'Random Search for Hyper-Parameter Optimization', venue: 'JMLR' },
      ]} />
    </SectionLayout>
  );
}
