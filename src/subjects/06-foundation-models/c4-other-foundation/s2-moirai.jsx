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

const MODELS = [
  { name: 'moirai-1.0-R-small', params: '14M', ctx: 512, recommendation: 'Fast prototyping' },
  { name: 'moirai-1.0-R-base', params: '91M', ctx: 512, recommendation: 'Default choice' },
  { name: 'moirai-1.0-R-large', params: '311M', ctx: 512, recommendation: 'Best accuracy' },
];

function ModelSelector() {
  const [sel, setSel] = useState('moirai-1.0-R-base');
  const m = MODELS.find(x => x.name === sel);
  return (
    <div className="my-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
      <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">Moirai Model Variants</h4>
      <div className="flex flex-wrap gap-2 mb-4">
        {MODELS.map(x => (
          <button key={x.name} onClick={() => setSel(x.name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all ${sel === x.name ? 'bg-purple-600 text-white border-purple-600' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'}`}>
            {x.name.split('-').pop()}
          </button>
        ))}
      </div>
      <div className="text-sm space-y-1">
        <div><span className="font-medium">Model:</span> <code className="text-purple-700 dark:text-purple-300">{m.name}</code></div>
        <div><span className="font-medium">Parameters:</span> {m.params}</div>
        <div><span className="font-medium">Max context:</span> {m.ctx} time steps</div>
        <div><span className="font-medium">Use case:</span> {m.recommendation}</div>
      </div>
    </div>
  );
}

const moiraiCode = `# pip install uni2ts
# (Salesforce Unified Training repo)
import torch
import numpy as np
import pandas as pd
from einops import rearrange
from uni2ts.model.moirai import MoiraiForecast, MoiraiModule

# --- Load MOIRAI from HuggingFace ---
# Model IDs: Salesforce/moirai-1.0-R-small / base / large
model = MoiraiForecast.from_pretrained(
    "Salesforce/moirai-1.0-R-base",
    prediction_length=12,
    context_length=64,
    patch_size="auto",       # automatically selects patch size
    num_samples=100,
    target_dim=1,            # univariate
    feat_dynamic_real_dim=0, # no exogenous features
    observed_mask_dim=1,
)
model.eval()

# --- Prepare a single series ---
np.random.seed(42)
n = 104
ts = (100 + 0.5*np.arange(n)
      + 20*np.sin(2*np.pi*np.arange(n)/12)
      + np.random.randn(n)*3)

# MOIRAI expects: (batch, time, variate)
context_ts = torch.tensor(ts[-64:], dtype=torch.float32).unsqueeze(0).unsqueeze(-1)
# observed mask: 1 = observed, 0 = missing
observed = torch.ones_like(context_ts, dtype=torch.bool)

with torch.no_grad():
    forecast = model(
        past_target=context_ts,
        past_observed_target=observed,
    )
# forecast shape: (batch, num_samples, prediction_length, variate)
# -> (1, 100, 12, 1)
samples = forecast.squeeze(-1).squeeze(0).numpy()  # (100, 12)

median = np.median(samples, axis=0)
lo_90  = np.quantile(samples, 0.05, axis=0)
hi_90  = np.quantile(samples, 0.95, axis=0)
print(f"Median forecast: {median.round(2)}")
print(f"90% PI: [{lo_90.round(2)}, {hi_90.round(2)}]")


# --- Multivariate forecasting with any-variate attention ---
model_mv = MoiraiForecast.from_pretrained(
    "Salesforce/moirai-1.0-R-base",
    prediction_length=6,
    context_length=48,
    patch_size="auto",
    num_samples=50,
    target_dim=3,             # 3 variates
    feat_dynamic_real_dim=0,
    observed_mask_dim=3,
)
model_mv.eval()

# (batch=1, time=48, variate=3)
mv_context = torch.tensor(
    np.random.randn(48, 3) + np.arange(3)*10,
    dtype=torch.float32
).unsqueeze(0)
mv_obs = torch.ones_like(mv_context, dtype=torch.bool)

with torch.no_grad():
    mv_fc = model_mv(past_target=mv_context, past_observed_target=mv_obs)
# shape: (1, 50, 6, 3)
print(f"Multivariate forecast shape: {mv_fc.shape}")


# --- Pandas-based pipeline ---
def moirai_forecast_df(df, id_col, ds_col, y_col, horizon, context_len=64, n_samples=100):
    """Zero-shot MOIRAI forecast from long-format DataFrame."""
    mod = MoiraiForecast.from_pretrained(
        "Salesforce/moirai-1.0-R-base",
        prediction_length=horizon,
        context_length=context_len,
        patch_size="auto",
        num_samples=n_samples,
        target_dim=1,
        feat_dynamic_real_dim=0,
        observed_mask_dim=1,
    )
    mod.eval()
    results = []
    for uid, grp in df.groupby(id_col):
        ctx = torch.tensor(
            grp[y_col].values[-context_len:], dtype=torch.float32
        ).unsqueeze(0).unsqueeze(-1)
        obs = torch.ones_like(ctx, dtype=torch.bool)
        with torch.no_grad():
            fc = mod(past_target=ctx, past_observed_target=obs)
        s = fc.squeeze(-1).squeeze(0).numpy()  # (n_samples, horizon)
        freq = pd.infer_freq(grp[ds_col].iloc[-10:]) or 'ME'
        future = pd.date_range(grp[ds_col].max(), periods=horizon+1, freq=freq)[1:]
        results.append(pd.DataFrame({
            id_col: uid, ds_col: future,
            'forecast': np.median(s, 0),
            'q10': np.quantile(s, 0.1, 0),
            'q90': np.quantile(s, 0.9, 0),
        }))
    return pd.concat(results, ignore_index=True)
`;

export default function Moirai() {
  return (
    <SectionLayout title="Moirai: Universal Time Series Forecasting" difficulty="advanced" readingTime={11}>
      <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-4">
        Salesforce MOIRAI (2024) is a foundation model for time series forecasting with a unique
        <strong> any-variate attention</strong> mechanism — a single model handles both univariate
        and multivariate series without architectural changes. Pre-trained on LOTSA, the largest
        open time series archive with 27 billion data points.
      </p>

      <DefinitionBlock term="MOIRAI (Unified Forecasting)">
        Masked Encoder with Any-Variate Attention trained via a masked pre-training objective
        analogous to BERT. The model learns to reconstruct masked patches of time series from
        surrounding context, enabling rich representations transferable to forecasting tasks.
      </DefinitionBlock>

      <h2 className="text-2xl font-bold mt-8 mb-3">Key Innovations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { title: 'Multi-Patch Tokenization', desc: 'Input is divided into patches of multiple sizes (8, 16, 32, 64 time steps). Each patch size captures dynamics at different scales. The model attends across all patch sizes simultaneously.', icon: '📐' },
          { title: 'Any-Variate Attention', desc: 'Each variate of a multivariate series is treated as a separate sequence of tokens. Attention is applied across all variates jointly — so the model can scale to any number of dimensions without retraining.', icon: '🔀' },
          { title: 'LOTSA Pre-training', desc: 'Large-Scale Open Time Series Archive: 27 datasets, 27 billion observations, spanning finance, energy, retail, weather, transportation, and more. Largest public pre-training corpus for TS.', icon: '🗄️' },
          { title: 'Mixture Output', desc: 'MOIRAI outputs a mixture of distributions (Student-t + lognormal + negative binomial) to handle both continuous and count data. The model selects the appropriate distribution per series automatically.', icon: '📊' },
        ].map(({ title, desc, icon }) => (
          <div key={title} className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
            <div className="text-xl mb-2">{icon}</div>
            <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-1">{title}</h4>
            <p className="text-sm text-purple-800 dark:text-purple-300">{desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-3">Architecture: Masked Encoder</h2>
      <p className="mb-3">
        Unlike Chronos (encoder-decoder) or TimeGPT (encoder-decoder), MOIRAI uses a
        <strong> masked encoder</strong> trained with a masked autoencoding objective:
      </p>
      <ol className="list-decimal pl-6 mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
        <li><strong>Patch tokenization:</strong> Divide series into non-overlapping patches; project each to a token vector.</li>
        <li><strong>Masking:</strong> Randomly mask 40% of tokens during pre-training.</li>
        <li><strong>Transformer encoder:</strong> Full self-attention over unmasked tokens from all variates.</li>
        <li><strong>Distribution head:</strong> Predict distribution parameters for masked patches (reconstruction loss).</li>
        <li><strong>Forecasting:</strong> At inference, future tokens are treated as "masked" and predicted from the context.</li>
      </ol>

      <TheoremBlock title="Any-Variate Attention">
        For a multivariate series with <InlineMath math="C" /> variates, MOIRAI constructs
        <InlineMath math="C \times T/p" /> patch tokens (where <InlineMath math="p" /> is patch size
        and <InlineMath math="T" /> is context length). Self-attention is applied across all
        <InlineMath math="C \times T/p" /> tokens jointly:
        <BlockMath math="\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V" />
        where <InlineMath math="Q, K, V \in \mathbb{R}^{(C \cdot T/p) \times d}" />.
        This allows the model to capture cross-variate dependencies without fixed dimensionality.
      </TheoremBlock>

      <ModelSelector />

      <h2 className="text-2xl font-bold mt-8 mb-3">LOTSA Pre-training Data</h2>
      <p className="mb-3">
        MOIRAI is pre-trained on the <strong>LOTSA</strong> (Large-Scale Open Time Series Archive)
        dataset, curated by Salesforce Research:
      </p>
      <ul className="list-disc pl-6 mb-4 space-y-1 text-zinc-700 dark:text-zinc-300">
        <li><strong>27 billion data points</strong> from public datasets</li>
        <li>Multiple frequencies: hourly, daily, weekly, monthly, quarterly</li>
        <li>Domains: energy (electricity, solar), transportation (traffic, rideshare), finance (stocks, FX), weather, retail, web traffic</li>
        <li>Includes M1–M4 competition data, ETT, PEMS, Electricity, and more</li>
      </ul>

      <NoteBlock title="Comparison: MOIRAI vs Chronos">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-100 dark:bg-gray-700"><th className="p-2 text-left">Aspect</th><th className="p-2">MOIRAI</th><th className="p-2">Chronos</th></tr></thead>
            <tbody>
              {[
                ['Architecture', 'Masked encoder', 'T5 encoder-decoder'],
                ['Tokenization', 'Patch-based (multi-size)', 'Quantization (4096 bins)'],
                ['Multivariate', 'Native (any-variate attn)', 'Univariate only'],
                ['Output', 'Mixture of distributions', 'Sample from token probs'],
                ['Pre-train data', '27B points (LOTSA)', '~1.5B (real + synthetic)'],
                ['Python package', 'uni2ts', 'chronos-forecasting'],
              ].map(([a, m, c]) => (
                <tr key={a} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-2 font-medium">{a}</td>
                  <td className="p-2 text-purple-700 dark:text-purple-300">{m}</td>
                  <td className="p-2 text-blue-700 dark:text-blue-300">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </NoteBlock>

      <ExampleBlock title="MOIRAI Inference via uni2ts">
        <PythonCode code={moiraiCode} title="MOIRAI Forecasting" />
      </ExampleBlock>

      <WarningBlock title="uni2ts Installation Complexity">
        The <code>uni2ts</code> package has more complex dependencies than <code>chronos-forecasting</code>
        (requires <code>einops</code>, specific <code>transformers</code> version). Verify your
        environment with <code>pip install "uni2ts[torch]"</code>. Docker images are available
        for reproducible deployments.
      </WarningBlock>

      <ReferenceList references={[
        { title: 'Unified Training of Universal Time Series Forecasting Transformers', authors: 'Woo, G. et al. (Salesforce)', year: 2024, venue: 'ICML 2024' },
        { title: 'LOTSA: Large-Scale Open Time Series Archive', authors: 'Woo, G. et al.', year: 2024, venue: 'Salesforce Research' },
      ]} />
    </SectionLayout>
  );
}
