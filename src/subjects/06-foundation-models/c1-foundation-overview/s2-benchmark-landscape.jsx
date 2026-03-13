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
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const radarData = [
  { metric: 'Short-horizon', TimeGPT: 75, Chronos: 72, NHiTS: 85, ARIMA: 80 },
  { metric: 'Long-horizon', TimeGPT: 70, Chronos: 68, NHiTS: 88, ARIMA: 45 },
  { metric: 'Zero-shot', TimeGPT: 90, Chronos: 88, NHiTS: 30, ARIMA: 40 },
  { metric: 'Probabilistic', TimeGPT: 80, Chronos: 85, NHiTS: 75, ARIMA: 65 },
  { metric: 'Covariates', TimeGPT: 70, Chronos: 30, NHiTS: 65, ARIMA: 50 },
  { metric: 'Speed', TimeGPT: 60, Chronos: 75, NHiTS: 80, ARIMA: 90 },
];

function RadarComparison() {
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-1">Model Capability Radar</h4>
      <p className="text-xs text-gray-500 mb-3">Approximate relative scores (0–100) — not directly comparable across dimensions.</p>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
          <Radar name="TimeGPT" dataKey="TimeGPT" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
          <Radar name="Chronos" dataKey="Chronos" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
          <Radar name="N-HiTS" dataKey="NHiTS" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
          <Radar name="ARIMA" dataKey="ARIMA" stroke="#6b7280" fill="#6b7280" fillOpacity={0.10} />
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

const benchmarkData = [
  { benchmark: 'M4 (Monthly)', winner: 'N-HiTS / N-BEATS', foundation: 'TimeGPT competitive', note: '100K series, many frequencies' },
  { benchmark: 'M5 (Daily, Walmart)', winner: 'TFT / LightGBM', foundation: 'TimeGPT competitive', note: '30,490 hierarchical retail series' },
  { benchmark: 'ETTh1 (Hourly)', winner: 'PatchTST / N-HiTS', foundation: 'Chronos competitive', note: 'Long-horizon: 96–720 steps' },
  { benchmark: 'Monash (All)', winner: 'N-HiTS / N-BEATS', foundation: 'Chronos ~best zero-shot', note: '30+ datasets, many domains' },
  { benchmark: 'GIFT-Eval', winner: 'Moirai / Chronos', foundation: 'Foundation models shine', note: 'Designed for zero-shot eval' },
];

function BenchmarkTable() {
  const [sortCol, setSortCol] = useState('benchmark');
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {['Benchmark', 'Best Tuned Model', 'Best Foundation', 'Note'].map((h, i) => (
              <th key={h} className="px-4 py-2 text-left text-gray-700 cursor-pointer hover:bg-gray-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {benchmarkData.map(row => (
            <tr key={row.benchmark} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-900">{row.benchmark}</td>
              <td className="px-4 py-2 text-green-700 font-mono text-xs">{row.winner}</td>
              <td className="px-4 py-2 text-purple-700 text-xs">{row.foundation}</td>
              <td className="px-4 py-2 text-gray-500 text-xs">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BenchmarkLandscapeSection() {
  return (
    <SectionLayout
      title="Foundation Model Benchmarks"
      difficulty="intermediate"
      readingTime={10}
    >
      <p className="text-gray-700 leading-relaxed">
        Evaluating forecasting models fairly is surprisingly difficult. Different
        benchmarks favor different model families, metrics can be gamed, and
        zero-shot evaluation introduces additional complexity. This section maps
        the benchmark landscape and provides a practical guide for selecting
        models based on your use case.
      </p>

      <DefinitionBlock title="Key Benchmarks">
        <ul className="list-disc ml-5 space-y-1 text-sm mt-2">
          <li><strong>Monash:</strong> 30+ datasets from diverse domains and frequencies, the de facto standard for broad DL forecasting evaluation.</li>
          <li><strong>M4 / M5:</strong> large-scale real-world competitions; M4 is mostly stationary series, M5 is hierarchical retail demand.</li>
          <li><strong>ETT (Electricity Transformer Temperature):</strong> widely used for long-horizon evaluation (horizon 96–720); may be overfitted by the community.</li>
          <li><strong>GIFT-Eval:</strong> designed specifically for zero-shot generalization evaluation of foundation models, using held-out domains from pre-training.</li>
        </ul>
      </DefinitionBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Benchmark Summary
      </h2>
      <BenchmarkTable />

      <RadarComparison />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Point vs. Probabilistic Metrics
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Forecasting accuracy metrics fall into two categories:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-semibold text-blue-800 text-sm mb-2">Point Forecast Metrics</p>
          <ul className="text-xs text-blue-900 space-y-1">
            <li><strong>MAE:</strong> Mean Absolute Error — scale-dependent, robust to outliers</li>
            <li><strong>MSE / RMSE:</strong> penalizes large errors more heavily</li>
            <li><strong>MAPE:</strong> % error — undefined for zero actuals</li>
            <li><strong>sMAPE:</strong> symmetric MAPE — used in M4/M5 competitions</li>
            <li><strong>MASE:</strong> MAE relative to naïve in-sample forecast — scale-free, preferred</li>
          </ul>
        </div>
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="font-semibold text-purple-800 text-sm mb-2">Probabilistic Metrics</p>
          <ul className="text-xs text-purple-900 space-y-1">
            <li><strong>CRPS:</strong> Continuous Ranked Probability Score — proper scoring rule for distributional forecasts</li>
            <li><strong>Pinball Loss:</strong> quantile-specific loss — measures calibration at a specific level</li>
            <li><strong>Coverage:</strong> fraction of actuals within prediction interval — should match nominal level</li>
            <li><strong>Winkler Score:</strong> interval width penalized for missed coverage</li>
          </ul>
        </div>
      </div>

      <TheoremBlock title="CRPS: The Gold Standard for Probabilistic Evaluation">
        <p>
          The Continuous Ranked Probability Score (CRPS) is the proper scoring
          rule for evaluating full predictive distributions. For a forecast
          distribution <InlineMath math="F" /> and observed value{' '}
          <InlineMath math="y" />:
        </p>
        <BlockMath math="\text{CRPS}(F, y) = \int_{-\infty}^{\infty} \bigl(F(z) - \mathbf{1}[z \geq y]\bigr)^2 dz" />
        <p className="text-sm mt-2">
          Lower is better. CRPS reduces to MAE for point forecasts, making it
          a natural generalization. It simultaneously penalizes miscalibration
          and poor sharpness — a model that is calibrated but very wide still
          gets a high CRPS. Use CRPS to compare models with different output
          types (sample-based vs. quantile-based).
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Practical Model Selection Guide
      </h2>
      <div className="my-4 space-y-3">
        {[
          { scenario: 'Cold start / no training data', recommendation: 'TimeGPT or Chronos (zero-shot)', reason: 'No training data available; foundation models are the only viable option.' },
          { scenario: 'Large panel with rich covariates', recommendation: 'TFT or DeepAR', reason: 'Foundation models have limited covariate support; TFT excels with promotions, holidays, etc.' },
          { scenario: 'Long horizon (>= 96 steps)', recommendation: 'N-HiTS or PatchTST', reason: 'Best long-horizon accuracy on ETT/M4 when training data is available.' },
          { scenario: 'High-dimensional multivariate', recommendation: 'iTransformer or Moirai', reason: 'Cross-variate attention is critical when variables are correlated.' },
          { scenario: 'Fast prototyping / experimentation', recommendation: 'Chronos (small) or N-HiTS default', reason: 'Chronos-tiny runs on CPU in seconds; N-HiTS trains quickly.' },
          { scenario: 'Production: accuracy + interpretability', recommendation: 'TFT', reason: 'Variable selection weights provide business-explainable feature importances.' },
        ].map(item => (
          <div key={item.scenario} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <span className="text-xs font-semibold text-gray-500 uppercase">Scenario</span>
                <p className="text-sm font-medium text-gray-800">{item.scenario}</p>
              </div>
              <div className="text-gray-400">→</div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Recommendation</span>
                <p className="text-sm font-mono font-medium text-indigo-700">{item.recommendation}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ExampleBlock title="The ETT Benchmark Controversy">
        <p className="text-sm text-gray-700">
          The ETT (Electricity Transformer Temperature) benchmark has been
          criticized as potentially overfitted by the community: hundreds of
          papers have tuned architectures specifically for this dataset.
          Zeng et al. (2023) showed that a simple linear model called DLinear
          outperforms many complex Transformers on ETT — suggesting the
          benchmark may not be representative of real forecasting difficulty.
          Always evaluate on held-out data from your own domain before trusting
          benchmark rankings.
        </p>
      </ExampleBlock>

      <WarningBlock title="Benchmark Leakage in Foundation Models">
        Some foundation model pre-training datasets may include the test sets
        from popular benchmarks (ETT, M4). This creates inflated zero-shot
        performance that does not generalize. GIFT-Eval was designed to mitigate
        this by evaluating on strictly held-out domains not present in any
        known pre-training corpus. Be skeptical of foundation model benchmark
        numbers without explicit data contamination checks.
      </WarningBlock>

      <NoteBlock title="How to Pick Metrics for Your Use Case">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li>Symmetric, scale-free? Use <strong>MASE</strong> or <strong>sMAPE</strong>.</li>
          <li>Penalize large errors more? Use <strong>RMSE</strong>.</li>
          <li>Evaluating a full predictive distribution? Use <strong>CRPS</strong>.</li>
          <li>Business-facing metric? Map to domain-specific cost (inventory overstock, missed demand).</li>
          <li>Multiple series with different scales? Always normalize before comparing MAE across series.</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Godahewa, R., et al.', year: 2021, title: 'Monash Time Series Forecasting Archive', venue: 'NeurIPS Datasets and Benchmarks' },
        { author: 'Ansari, A. F., et al.', year: 2024, title: 'Chronos: Learning the Language of Time Series', venue: 'arXiv' },
        { author: 'Zeng, A., et al.', year: 2023, title: 'Are Transformers Effective for Time Series Forecasting?', venue: 'AAAI' },
        { author: 'Aksu, T., et al.', year: 2024, title: 'GIFT-Eval: A Benchmark for General Time Series Forecasting Model Evaluation', venue: 'arXiv' },
      ]} />
    </SectionLayout>
  );
}
