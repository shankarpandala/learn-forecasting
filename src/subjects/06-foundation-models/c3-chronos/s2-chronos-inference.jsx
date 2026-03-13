import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SPEED_DATA = [
  { model: 'Bolt-Small', ms: 55, color: '#22c55e' },
  { model: 'Bolt-Base', ms: 120, color: '#16a34a' },
  { model: 'T5-Tiny', ms: 85, color: '#93c5fd' },
  { model: 'T5-Mini', ms: 140, color: '#60a5fa' },
  { model: 'T5-Small', ms: 280, color: '#3b82f6' },
  { model: 'T5-Base', ms: 820, color: '#2563eb' },
  { model: 'T5-Large', ms: 2800, color: '#1d4ed8' },
];

const boltCode = `# pip install chronos-forecasting
import torch, numpy as np, pandas as pd, time
from chronos import ChronosBoltPipeline, ChronosPipeline

# --- Load Chronos-Bolt (fast) ---
bolt = ChronosBoltPipeline.from_pretrained(
    "amazon/chronos-bolt-small",
    device_map="cpu",
    torch_dtype=torch.bfloat16,
)

# Single series
np.random.seed(42)
context = torch.tensor(
    100 + np.arange(104)*0.5 + 20*np.sin(2*np.pi*np.arange(104)/52)
    + np.random.randn(104)*3,
    dtype=torch.float32
).unsqueeze(0)                            # shape (1, context_length)

forecast = bolt.predict(context, prediction_length=13, num_samples=100)
# forecast shape: (1, 100, 13)
median = np.quantile(forecast[0].numpy(), 0.5, axis=0)
lo_80  = np.quantile(forecast[0].numpy(), 0.1, axis=0)
hi_80  = np.quantile(forecast[0].numpy(), 0.9, axis=0)

# --- Batch inference (variable-length series) ---
batch = [torch.tensor(np.random.randn(n)+i*10, dtype=torch.float32)
         for i, n in enumerate([52, 78, 104, 130, 60])]
batch_fcst = bolt.predict(batch, prediction_length=12, num_samples=50)
print(batch_fcst.shape)                   # (5, 50, 12)

# --- Pandas helper ---
def chronos_forecast(df, id_col, date_col, target_col, horizon, n_samples=100):
    results = []
    for uid, grp in df.groupby(id_col):
        ctx = torch.tensor(grp[target_col].values, dtype=torch.float32).unsqueeze(0)
        s   = bolt.predict(ctx, horizon, n_samples)[0].numpy()
        freq = pd.infer_freq(grp[date_col].values[-10:]) or 'W'
        future = pd.date_range(
            grp[date_col].max() + pd.tseries.frequencies.to_offset(freq),
            periods=horizon,
        )
        results.append(pd.DataFrame({
            id_col: uid, date_col: future,
            'median': np.median(s, 0),
            'q10': np.quantile(s, .1, 0),
            'q90': np.quantile(s, .9, 0),
        }))
    return pd.concat(results, ignore_index=True)

# Build sample retail dataset
dfs = []
for sku in ['A','B','C']:
    np.random.seed(hash(sku)%100)
    dfs.append(pd.DataFrame({
        'sku': sku,
        'date': pd.date_range('2022-01-01', periods=104, freq='W'),
        'sales': np.maximum(0, 100 + np.random.randn(104).cumsum()*2
                            + 20*np.sin(2*np.pi*np.arange(104)/52)),
    }))
retail_df = pd.concat(dfs)
fcst_df = chronos_forecast(retail_df, 'sku', 'date', 'sales', horizon=13)
print(fcst_df.head())

# --- Timing comparison Bolt vs T5 ---
std = ChronosPipeline.from_pretrained(
    "amazon/chronos-t5-small", device_map="cpu", torch_dtype=torch.bfloat16
)
single = torch.tensor(np.random.randn(100), dtype=torch.float32).unsqueeze(0)

t0 = time.perf_counter()
for _ in range(10):
    bolt.predict(single, 12, num_samples=20)
bolt_ms = (time.perf_counter()-t0)/10*1000

t0 = time.perf_counter()
for _ in range(10):
    std.predict(single, 12, num_samples=20)
std_ms = (time.perf_counter()-t0)/10*1000

print(f"Bolt-Small: {bolt_ms:.1f} ms | T5-Small: {std_ms:.1f} ms | Speedup: {std_ms/bolt_ms:.1f}x")
`;

export default function ChronosInference() {
  const [device, setDevice] = useState('cpu');
  const data = device === 'cpu' ? SPEED_DATA : SPEED_DATA.map(d => ({ ...d, ms: Math.round(d.ms * 0.12) }));

  return (
    <SectionLayout title="Chronos-Bolt: Fast Inference" difficulty="intermediate" readingTime={10}>
      <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-4">
        Chronos-Bolt is a distilled, optimized variant of Amazon Chronos designed for production
        workloads. It achieves <strong>4–8× faster inference</strong> than standard Chronos-T5
        models while maintaining comparable accuracy — making it the recommended choice for
        low-latency pipelines and large-scale batch processing.
      </p>

      <DefinitionBlock term="Chronos-Bolt">
        A knowledge-distilled Chronos model that replaces the full T5 encoder-decoder with a
        lightweight patched decoder. Flash attention and optimized tokenization reduce inference
        time dramatically, especially on CPU — the most common deployment target for forecasting.
      </DefinitionBlock>

      <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Inference Time per Series (100 samples, h=24)
        </h4>
        <div className="flex gap-2 mb-4">
          {['cpu', 'gpu'].map(d => (
            <button key={d} onClick={() => setDevice(d)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${device === d ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'}`}>
              {d.toUpperCase()}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="model" angle={-35} textAnchor="end" tick={{ fontSize: 11 }} />
            <YAxis label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={v => [`${v} ms`, 'Inference time']} />
            <Bar dataKey="ms" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-2">Bolt models (green bars) are consistently faster at similar accuracy.</p>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-3">Bolt vs Standard Chronos</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-blue-50 dark:bg-blue-900/30">
              {['Feature', 'Chronos-T5', 'Chronos-Bolt'].map(h => (
                <th key={h} className="px-4 py-2 text-left border border-blue-200 dark:border-blue-800">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Architecture', 'T5 encoder-decoder', 'Patched decoder-only'],
              ['CPU inference (Small)', '~280 ms/series', '~55 ms/series'],
              ['GPU inference (Small)', '~28 ms/series', '~8 ms/series'],
              ['Accuracy vs T5-Small', 'Baseline', 'Within 1–2% on most benchmarks'],
              ['HuggingFace ID', 'amazon/chronos-t5-{size}', 'amazon/chronos-bolt-{size}'],
              ['Python class', 'ChronosPipeline', 'ChronosBoltPipeline'],
            ].map(([f, t5, bolt]) => (
              <tr key={f} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 font-medium border border-gray-200 dark:border-gray-700">{f}</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">{t5}</td>
                <td className="px-4 py-2 text-blue-700 dark:text-blue-300 font-medium border border-gray-200 dark:border-gray-700">{bolt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-3">Output: Sample Trajectories</h2>
      <p className="mb-3">
        Both Chronos and Chronos-Bolt return <strong>sample trajectories</strong>, not point
        forecasts. From these samples you derive any summary:
      </p>
      <ul className="list-disc pl-6 mb-4 space-y-1 text-zinc-700 dark:text-zinc-300">
        <li><strong>Median:</strong> <code>np.quantile(samples, 0.5, axis=0)</code> — robust point forecast</li>
        <li><strong>Mean:</strong> <code>np.mean(samples, axis=0)</code> — minimum MSE estimator</li>
        <li><strong>80% PI:</strong> <code>np.quantile(samples, [0.1, 0.9], axis=0)</code></li>
        <li><strong>CRPS:</strong> compute from samples for probabilistic evaluation</li>
      </ul>

      <NoteBlock title="Caching and Offline Use">
        The first call to <code>from_pretrained()</code> downloads weights (~200 MB for Small) to
        <code> ~/.cache/huggingface/hub</code>. Set <code>TRANSFORMERS_CACHE</code> to override.
        For air-gapped environments: <code>huggingface-cli download amazon/chronos-bolt-small</code>
        then use <code>local_files_only=True</code>.
      </NoteBlock>

      <ExampleBlock title="Batch Inference with Chronos-Bolt">
        <PythonCode code={boltCode} title="Chronos-Bolt production pipeline" />
      </ExampleBlock>

      <WarningBlock title="Calibration Validation Required">
        Chronos-Bolt's compressed architecture can produce slightly narrower prediction intervals
        than Chronos-T5 on out-of-distribution series. Always validate empirical coverage on a
        holdout set before relying on Bolt's PIs for high-stakes inventory or financial decisions.
        Use <code>num_samples≥200</code> for stable quantile estimates.
      </WarningBlock>

      <ReferenceList references={[
        { title: 'Chronos: Learning the Language of Time Series', authors: 'Ansari, A.F. et al.', year: 2024, venue: 'Transactions on Machine Learning Research' },
        { title: 'amazon/chronos-bolt-small (HuggingFace)', authors: 'Amazon Science', year: 2024, venue: 'huggingface.co' },
      ]} />
    </SectionLayout>
  );
}
