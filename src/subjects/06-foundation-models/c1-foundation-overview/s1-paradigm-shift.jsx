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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// Timeline visualization
function FoundationModelTimeline() {
  const events = [
    { year: 2017, label: 'Transformer (Attention Is All You Need)', color: '#94a3b8', side: 'top' },
    { year: 2018, label: 'GPT-1: Language pretraining', color: '#94a3b8', side: 'bottom' },
    { year: 2020, label: 'GPT-3: Few-shot learning emerges', color: '#6366f1', side: 'top' },
    { year: 2021, label: 'N-BEATS / N-HiTS (deep TS models)', color: '#6366f1', side: 'bottom' },
    { year: 2022, label: 'PatchTST, DLinear LTSF debate', color: '#8b5cf6', side: 'top' },
    { year: 2023, label: 'TimeGPT (Nixtla), Lag-Llama', color: '#f59e0b', side: 'bottom' },
    { year: 2024, label: 'Chronos (Amazon), Moirai (Salesforce), TimesFM (Google)', color: '#10b981', side: 'top' },
    { year: 2025, label: 'Foundation models competitive with fine-tuned ML', color: '#10b981', side: 'bottom' },
  ];

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto">
      <h4 className="font-semibold text-gray-700 mb-4">Foundation Models for Time Series: Timeline</h4>
      <div className="relative" style={{ minWidth: 700, height: 180 }}>
        {/* Main timeline axis */}
        <div className="absolute" style={{ top: 88, left: 0, right: 0, height: 3, backgroundColor: '#e2e8f0' }} />

        {events.map((e, i) => {
          const xPct = ((e.year - 2017) / (2025 - 2017)) * 92 + 4;
          return (
            <div key={i} style={{ position: 'absolute', left: `${xPct}%`, top: e.side === 'top' ? 0 : 100 }}>
              {/* Dot */}
              <div style={{
                position: 'absolute', width: 10, height: 10, borderRadius: '50%',
                backgroundColor: e.color, top: e.side === 'top' ? 78 : -2,
                left: -5, zIndex: 2,
              }} />
              {/* Year label */}
              <div style={{
                position: 'absolute', top: e.side === 'top' ? 62 : 14,
                left: -16, fontSize: 11, fontWeight: 'bold', color: '#475569',
              }}>{e.year}</div>
              {/* Event label */}
              <div style={{
                position: 'absolute',
                top: e.side === 'top' ? -2 : 26,
                left: -40, width: 110, fontSize: 10, color: '#374151',
                lineHeight: 1.3, textAlign: 'center',
              }}>{e.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ParadigmShift() {
  return (
    <SectionLayout
      title="The Foundation Model Paradigm for Time Series"
      difficulty="intermediate"
      readingTime={25}
      prerequisites={['Machine learning basics', 'Time series fundamentals', 'Neural network concepts']}
    >
      <p className="text-gray-700 leading-relaxed">
        In NLP and vision, foundation models — pre-trained on vast datasets then applied to new
        tasks with little or no fine-tuning — have transformed the field. The same paradigm is
        now arriving for time series forecasting. This section explains what foundation models
        are, why they represent a genuine paradigm shift, and when they outperform traditional approaches.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">What Are Foundation Models?</h2>

      <DefinitionBlock title="Foundation Model (Bommasani et al., 2021)">
        <p>
          A model trained on broad data at scale that can be adapted (with little or no
          additional training) to a wide range of downstream tasks. Key properties:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Pre-training:</strong> trained on diverse data covering many domains and patterns</li>
          <li><strong>Emergent capabilities:</strong> behaviors not explicitly trained, arising from scale</li>
          <li><strong>Adaptation:</strong> zero-shot, few-shot, or lightweight fine-tuning for new tasks</li>
        </ul>
      </DefinitionBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">The Traditional vs. Foundation Model Paradigm</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-indigo-50">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Dimension</th>
              <th className="border border-gray-300 p-3 text-left">Traditional ML / Stats</th>
              <th className="border border-gray-300 p-3 text-left">Foundation Model</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Models per series', 'One model per series (local)', 'One model for all series'],
              ['Training data', 'Target series only', 'Millions of diverse series'],
              ['New series handling', 'Requires re-training', 'Zero-shot: immediate prediction'],
              ['Short series', 'Problematic (insufficient data)', 'Leverages knowledge transfer'],
              ['Training time (new task)', 'Minutes to hours', 'Seconds (zero-shot) to minutes (fine-tune)'],
              ['Interpretability', 'High (ARIMA, ETS coefficients)', 'Lower (but attention helps)'],
              ['Accuracy (long series)', 'Competitive', 'Often competitive or better'],
              ['Cold-start problem', 'Severe', 'Naturally handled'],
            ].map(([dim, trad, found], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-3 font-medium text-gray-700">{dim}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{trad}</td>
                <td className="border border-gray-300 p-3 text-indigo-700 font-medium">{found}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Zero-Shot, Few-Shot, and Fine-Tuning</h2>

      <p className="text-gray-700 leading-relaxed">
        Three adaptation regimes exist along a spectrum from no adaptation to full fine-tuning:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        {[
          {
            title: 'Zero-Shot',
            color: '#6366f1',
            desc: 'Apply the pre-trained model directly to new data with no updates. The model must generalize purely from pre-training. Works remarkably well for patterns similar to the training distribution.',
            when: 'Quick predictions, cold-start, exploration',
          },
          {
            title: 'Few-Shot',
            color: '#8b5cf6',
            desc: 'Condition the model on a small number of in-context examples (analogous to few-shot prompting in LLMs). Some models allow passing historical context that biases predictions.',
            when: 'When you have a small amount of target-domain data',
          },
          {
            title: 'Fine-Tuning',
            color: '#10b981',
            desc: 'Update model weights on your specific data, starting from pre-trained weights. Preserves learned representations while adapting to domain-specific patterns and scales.',
            when: 'When you have sufficient data and want maximum accuracy',
          },
        ].map(({ title, color, desc, when }) => (
          <div key={title} className="p-4 rounded-lg border-2" style={{ borderColor: color }}>
            <h4 className="font-bold mb-2" style={{ color }}>{title}</h4>
            <p className="text-sm text-gray-600 mb-2">{desc}</p>
            <p className="text-xs text-gray-500"><strong>Use when:</strong> {when}</p>
          </div>
        ))}
      </div>

      <FoundationModelTimeline />

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Scaling Laws for Time Series</h2>
      <p className="text-gray-700 leading-relaxed">
        In NLP, performance scales predictably with model size and data — a "scaling law":
      </p>
      <BlockMath math="\mathcal{L}(N, D) \approx \left(\frac{N_c}{N}\right)^{\alpha_N} + \left(\frac{D_c}{D}\right)^{\alpha_D} + \mathcal{L}_\infty" />
      <p className="text-gray-700 leading-relaxed mt-3">
        Early evidence (Chronos, TimesFM papers) suggests similar scaling behavior holds for
        time series foundation models, though with a key caveat: <strong>data diversity</strong>
        matters more than raw size. A model trained on 1 million heterogeneous series from
        finance, energy, retail, and weather generalizes far better than one trained on 10 million
        series from a single domain.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Major Foundation Models Landscape</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-indigo-50">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Model</th>
              <th className="border border-gray-300 p-3 text-left">Organization</th>
              <th className="border border-gray-300 p-3 text-left">Architecture</th>
              <th className="border border-gray-300 p-3 text-left">Output Type</th>
              <th className="border border-gray-300 p-3 text-left">Access</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['TimeGPT', 'Nixtla', 'Encoder-Decoder Transformer', 'Point + Intervals', 'API'],
              ['Chronos', 'Amazon', 'T5 + Quantization', 'Probabilistic (samples)', 'HuggingFace / Open'],
              ['TimesFM', 'Google', 'Patched Decoder Transformer', 'Point', 'HuggingFace / Open'],
              ['Lag-Llama', 'ServiceNow/McGill', 'LLaMA + Lag Features', 'Probabilistic (Student-t)', 'HuggingFace / Open'],
              ['Moirai', 'Salesforce', 'Universal Transformer', 'Probabilistic (mixture)', 'HuggingFace / Open'],
              ['MOMENT', 'CMU', 'Masked Encoder', 'Point + Embedding', 'HuggingFace / Open'],
              ['Timer', 'Tsinghua', 'GPT-style Decoder', 'Point', 'Open'],
            ].map(([model, org, arch, output, access], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-3 font-semibold text-indigo-700">{model}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{org}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{arch}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{output}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{access}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoteBlock title="When Foundation Models Win">
        Foundation models tend to outperform traditional methods when: (1) the target series is
        short (&lt;100 observations), preventing model fitting; (2) you need forecasts for thousands
        of new series without retraining; (3) the series exhibits patterns common in the pre-training
        data; (4) you need a quick baseline without feature engineering.
      </NoteBlock>

      <WarningBlock title="When to Be Skeptical">
        Foundation models can underperform when: (1) your domain is highly specialized and
        dissimilar from pre-training data (e.g., industrial sensor data); (2) you have long,
        stable time series where classical methods fit well; (3) you need strong guarantees on
        prediction interval calibration; (4) the model's maximum context length is shorter
        than your series' seasonal period.
      </WarningBlock>

      <ReferenceList references={[
        { authors: 'Bommasani, R. et al.', year: 2021, title: 'On the Opportunities and Risks of Foundation Models', venue: 'arXiv', url: 'https://arxiv.org/abs/2108.07258' },
        { authors: 'Garza, A., Challu, C., Mergenthaler-Canseco, M.', year: 2023, title: 'TimeGPT-1', venue: 'arXiv', url: 'https://arxiv.org/abs/2310.03589' },
        { authors: 'Ansari, A.F. et al.', year: 2024, title: 'Chronos: Learning the Language of Time Series', venue: 'arXiv', url: 'https://arxiv.org/abs/2403.07815' },
        { authors: 'Das, A. et al.', year: 2024, title: 'A Decoder-Only Foundation Model for Time-Series Forecasting', venue: 'ICML 2024', url: 'https://arxiv.org/abs/2310.10688' },
      ]} />
    </SectionLayout>
  );
}
