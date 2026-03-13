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

function ParadigmComparison() {
  const [selected, setSelected] = useState('classical');
  const paradigms = {
    classical: {
      label: 'Classical (ARIMA, ETS)',
      steps: ['Identify model order (ACF/PACF)', 'Fit parameters per series', 'Diagnose residuals', 'Forecast', 'Re-fit when new data arrives'],
      pros: ['Interpretable parameters', 'Works with short series (20+ pts)', 'No GPU needed', 'Exact CIs under assumptions'],
      cons: ['Manual per-series workflow', 'Cannot leverage related series', 'Poor complex seasonality', 'No zero-shot capability'],
      btnClass: 'bg-blue-600',
      bgClass: 'bg-blue-50 border-blue-200',
    },
    dl: {
      label: 'Deep Learning (TFT, N-HiTS)',
      steps: ['Collect large panel dataset', 'Choose architecture & HPs', 'Train globally on all series', 'Predict (fast inference)', 'Periodic re-training'],
      pros: ['Learns cross-series patterns', 'Handles complex seasonality', 'Rich covariate support', 'Scales to millions of series'],
      cons: ['Requires large training data', 'GPU needed', 'HP tuning required', 'Domain-specific — retrain for new domain'],
      btnClass: 'bg-green-600',
      bgClass: 'bg-green-50 border-green-200',
    },
    foundation: {
      label: 'Foundation Models (TimeGPT, Chronos)',
      steps: ['Pre-trained on billions of time points', 'API call / load model', 'Zero-shot forecast', 'Optional fine-tuning', 'Prediction'],
      pros: ['Zero-shot — works immediately', 'No training data needed', 'General-purpose', 'Probabilistic outputs'],
      cons: ['Black-box', 'API costs (commercial)', 'May underperform specialists', 'Rapidly evolving'],
      btnClass: 'bg-purple-600',
      bgClass: 'bg-purple-50 border-purple-200',
    },
  };
  const p = paradigms[selected];
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">Forecasting Paradigm Comparison</h4>
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(paradigms).map(([k, v]) => (
          <button key={k} onClick={() => setSelected(k)}
            className={`px-3 py-2 rounded text-sm border-2 font-medium transition-all ${selected === k ? `${v.btnClass} text-white border-transparent` : 'bg-white text-gray-700 border-gray-300'}`}>
            {v.label}
          </button>
        ))}
      </div>
      <div className={`p-4 rounded-lg border ${p.bgClass}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Workflow</p>
            <ol className="space-y-1">
              {p.steps.map((s, i) => (
                <li key={i} className="text-xs text-gray-700 flex gap-2 items-start">
                  <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold ${p.btnClass}`}>{i+1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Advantages</p>
            <ul className="space-y-1">
              {p.pros.map(pro => <li key={pro} className="text-xs text-gray-700 flex gap-1"><span className="text-green-500 font-bold">+</span>{pro}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Limitations</p>
            <ul className="space-y-1">
              {p.cons.map(con => <li key={con} className="text-xs text-gray-700 flex gap-1"><span className="text-red-500 font-bold">−</span>{con}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const foundationIntroCode = `# Three foundation model options — minimal code to get started

# ── Option A: TimeGPT (Nixtla) — commercial API ────────────────────────────
# pip install nixtla
import pandas as pd
from nixtla import NixtlaClient

client = NixtlaClient(api_key='YOUR_API_KEY')

df = pd.DataFrame({
    'unique_id': ['elec'] * 96,
    'ds': pd.date_range('2023-01-01', periods=96, freq='h'),
    'y': [150 + 30 * (i % 24) + 5 * (i % 7) for i in range(96)],
})

# Zero-shot — no training required
forecast = client.forecast(df, h=24, freq='h')
print(forecast.head())

# ── Option B: Amazon Chronos — open-source, runs locally ──────────────────
# pip install chronos-forecasting
import torch
from chronos import ChronosPipeline

pipeline = ChronosPipeline.from_pretrained(
    "amazon/chronos-t5-small",   # 46M parameters
    device_map="cpu",
    torch_dtype=torch.float32,
)

context = torch.tensor(df['y'].values[-64:]).unsqueeze(0).float()
samples = pipeline.predict(context, prediction_length=24)
print("Shape:", samples.shape)   # (1, num_samples=20, 24)

# Point forecast from samples
import numpy as np
median = np.median(samples[0].numpy(), axis=0)
print("Chronos median forecast:", median)

# ── Option C: Google TimesFM — open-source ────────────────────────────────
# pip install timesfm
import timesfm

tfm = timesfm.TimesFm(
    context_len=512,
    horizon_len=24,
    input_patch_len=32,
    output_patch_len=128,
    num_layers=20,
    model_dims=1280,
    backend="cpu",
)
tfm.load_from_checkpoint(repo_id="google/timesfm-1.0-200m")
point_forecast, _ = tfm.forecast_on_df(df, freq='h', value_name='y', num_jobs=1)
print(point_forecast[['unique_id', 'ds', 'timesfm']].head())
`;

export default function ParadigmShiftSection() {
  return (
    <SectionLayout
      title="The Foundation Model Paradigm"
      difficulty="intermediate"
      readingTime={11}
    >
      <p className="text-gray-700 leading-relaxed">
        Foundation models represent a fundamental shift in time series
        forecasting. Instead of fitting a model per series or training on
        domain-specific data, a foundation model is pre-trained on a massive and
        diverse corpus of time series, then applied <em>directly</em> to new
        series without any additional training — a capability called{' '}
        <strong>zero-shot forecasting</strong>.
      </p>

      <DefinitionBlock title="Foundation Models for Time Series">
        A <strong>foundation model</strong> is a large neural network pre-trained
        on a diverse collection of time series from many domains (finance, energy,
        weather, retail, etc.). At inference, it accepts an arbitrary historical
        context and produces forecasts for the next <InlineMath math="H" /> steps
        — without any task-specific training. This mirrors how GPT-4 answers
        questions on any topic without fine-tuning.
      </DefinitionBlock>

      <ParadigmComparison />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        What Made This Possible
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Three factors converged around 2023–2024 to enable foundation models for
        time series:
      </p>
      <ol className="list-decimal ml-6 mt-2 space-y-2 text-gray-700 text-sm">
        <li>
          <strong>Massive diverse datasets:</strong> LOTSA, Monash, and other
          archives aggregated <em>billions</em> of time points across heterogeneous
          domains, providing enough variety for a model to learn transferable
          temporal dynamics.
        </li>
        <li>
          <strong>Scalable Transformer architectures:</strong> the same
          self-attention used in LLMs scales naturally to sequences of time-series
          tokens — whether raw values, patches, or quantized bins.
        </li>
        <li>
          <strong>Tokenization innovations:</strong> researchers devised ways to
          represent time series as discrete tokens (quantization in Chronos,
          patch embeddings in TimesFM), enabling standard language model training
          to apply directly to numerical sequences.
        </li>
      </ol>

      <TheoremBlock title="The LOTSA Pre-Training Corpus">
        <p>
          LOTSA (Woo et al., 2024) is the pre-training dataset used by Moirai.
          It contains over <strong>27 billion observations</strong> from 9
          time-series collections spanning multiple domains (energy, finance,
          traffic, weather, sales) and frequencies (sub-hourly to yearly). The
          diversity is crucial: a model trained only on electricity data would
          not generalize to retail demand or medical sensors.
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Zero-Shot vs. Fine-Tuned Foundation Models
      </h2>
      <p className="text-gray-700 leading-relaxed">
        In the <strong>zero-shot</strong> setting, the foundation model receives
        only the historical context and generates forecasts directly — no
        exposure to the target series during training. Performance depends on
        how well the target distribution is represented in the pre-training
        corpus.
      </p>
      <p className="text-gray-700 leading-relaxed mt-3">
        <strong>Fine-tuning</strong> adapts pre-trained weights using a small
        amount of domain-specific data (few-shot learning). This bridges the
        distribution gap, often substantially improving accuracy on niche domains
        (specialized industrial IoT, rare financial instruments) that are
        underrepresented in pre-training.
      </p>

      <div className="my-4 overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {['Model', 'Organization', 'Zero-Shot', 'Fine-Tune', 'Access'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['TimeGPT',   'Nixtla',     'Yes', 'Yes',     'API (paid)'],
              ['Chronos',   'Amazon',     'Yes', 'Yes',     'Open-source (HuggingFace)'],
              ['TimesFM',   'Google',     'Yes', 'Limited', 'Open-source (HuggingFace)'],
              ['Moirai',    'Salesforce', 'Yes', 'Yes',     'Open-source (HuggingFace)'],
              ['Lag-Llama', 'Academic',   'Yes', 'Yes',     'Open-source (HuggingFace)'],
              ['MOMENT',    'CMU',        'Partial', 'Yes', 'Open-source (HuggingFace)'],
            ].map(([m, o, zs, ft, ac]) => (
              <tr key={m} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 font-mono font-medium text-gray-900">{m}</td>
                <td className="px-4 py-2 text-gray-600">{o}</td>
                <td className="px-4 py-2 text-gray-600">{zs}</td>
                <td className="px-4 py-2 text-gray-600">{ft}</td>
                <td className="px-4 py-2 text-gray-600">{ac}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExampleBlock title="When Zero-Shot Forecasting Shines">
        <p className="text-sm text-gray-700">
          Zero-shot forecasting is especially valuable for:{' '}
          <strong>cold-start problems</strong> (new series with no training
          history), <strong>rapid prototyping</strong> (forecast in minutes
          without model training), <strong>low-volume series</strong> (too little
          history to train a reliable local model), and{' '}
          <strong>diverse portfolios</strong> where building separate models for
          hundreds of different data types is infeasible.
        </p>
      </ExampleBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Quick Start</h2>
      <PythonCode code={foundationIntroCode} />

      <WarningBlock title="Foundation Models Are Not Always Best">
        On well-studied benchmarks (ETT, M4, M5), a properly tuned N-HiTS or
        TFT often outperforms zero-shot foundation models. Foundation models
        excel at generality, cold-start convenience, and breadth across domains
        — not necessarily peak accuracy where a specialist model has been
        carefully tuned. Always benchmark against simpler baselines before
        committing to a foundation model in production.
      </WarningBlock>

      <NoteBlock title="The Road Ahead">
        <p className="text-sm text-gray-700">
          Foundation model research for time series is moving rapidly. Key open
          problems: incorporating covariates and metadata natively, handling
          irregular or multivariate series, and rigorous zero-shot evaluation
          protocols. The landscape will likely look substantially different in
          12–18 months as larger and better-evaluated models emerge.
        </p>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Ansari, A. F., et al.', year: 2024, title: 'Chronos: Learning the Language of Time Series', venue: 'arXiv' },
        { author: 'Woo, G., et al.', year: 2024, title: 'Unified Training of Universal Time Series Forecasting Transformers', venue: 'ICML (Moirai)' },
        { author: 'Garza, A., & Mergenthaler-Canseco, M.', year: 2023, title: 'TimeGPT-1', venue: 'arXiv' },
        { author: 'Das, A., et al.', year: 2024, title: 'A Decoder-Only Foundation Model for Time-Series Forecasting', venue: 'ICML (TimesFM)' },
      ]} />
    </SectionLayout>
  );
}
