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

export default function LagLlama() {
  return (
    <SectionLayout
      title="Lag-Llama: Towards a Foundation Model for Probabilistic Time Series Forecasting"
      difficulty="advanced"
      readingTime={30}
      prerequisites={['Foundation model concepts (c1-s1)', 'LLaMA / decoder Transformers', 'Probabilistic forecasting basics']}
    >
      <p className="text-gray-700 leading-relaxed">
        Lag-Llama (Rasul et al., 2024) adapts the LLaMA decoder-only Transformer architecture
        for probabilistic time series forecasting. Its key insight: rather than using positional
        encodings to convey "what time step am I at?", Lag-Llama uses <strong>lag features</strong>
        — values from meaningful past offsets — as the primary temporal representation. This allows
        the model to naturally exploit periodic and autocorrelated structure in time series.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Architecture: LLaMA Adapted for Time Series</h2>
      <p className="text-gray-700 leading-relaxed">
        Lag-Llama builds on the LLaMA architecture (a decoder-only Transformer with RoPE positional
        embeddings and SwiGLU activations) with time-series-specific input preprocessing:
      </p>

      <DefinitionBlock title="Lag-Llama Input Construction">
        <p className="mb-2">
          For a time series value <InlineMath math="x_t" /> at step <InlineMath math="t" />,
          the input token is constructed from lag values at a set of offsets
          <InlineMath math="\mathcal{L} = \{l_1, l_2, \ldots, l_K\}" />:
        </p>
        <BlockMath math="\mathbf{z}_t = [x_{t-l_1},\; x_{t-l_2},\; \ldots,\; x_{t-l_K}] \in \mathbb{R}^K" />
        <p className="mt-2">
          These lag features are then projected to the model's hidden dimension via a linear embedding:
          <InlineMath math="\mathbf{h}_t^{(0)} = W_e \mathbf{z}_t + b_e" />.
        </p>
      </DefinitionBlock>

      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Lag Selection</h3>
      <p className="text-gray-700 leading-relaxed">
        The lag set <InlineMath math="\mathcal{L}" /> is chosen based on autocorrelation structure,
        covering multiple seasonal periods. Lag-Llama uses a fixed lag set that covers:
      </p>
      <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
        <li><strong>Short lags (1-7):</strong> recent autocorrelation structure</li>
        <li><strong>Seasonal lags:</strong> offsets at known seasonal periods (7, 14, 28 for weekly; 12, 24 for monthly/hourly)</li>
        <li><strong>Long-range lags:</strong> annual seasonality (365, 52, 12 depending on frequency)</li>
      </ul>

      <p className="text-gray-700 leading-relaxed mt-3">
        The lag feature vector effectively tells the model "what was the value at each relevant
        past time point?", providing rich temporal context without requiring explicit positional
        encodings for time series semantics.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Probabilistic Output: Student-t Distribution</h2>
      <p className="text-gray-700 leading-relaxed">
        Rather than predicting a single value or discrete token distribution (as in Chronos),
        Lag-Llama outputs the parameters of a <strong>Student-t distribution</strong> at each
        forecast step:
      </p>
      <BlockMath math="\hat{y}_{t+h} \sim \text{Student-t}(\nu_h, \mu_h, \sigma_h)" />
      <p className="text-gray-700 leading-relaxed mt-3">
        where <InlineMath math="\nu_h > 0" /> (degrees of freedom),
        <InlineMath math="\mu_h" /> (location), and <InlineMath math="\sigma_h > 0" /> (scale)
        are predicted by linear projection heads on top of the decoder output.
      </p>

      <DefinitionBlock title="Student-t Distribution for Forecasting">
        <BlockMath math="p(y \mid \nu, \mu, \sigma) = \frac{\Gamma\!\left(\frac{\nu+1}{2}\right)}{\Gamma\!\left(\frac{\nu}{2}\right)\sqrt{\nu\pi}\,\sigma} \left(1 + \frac{(y-\mu)^2}{\nu\sigma^2}\right)^{-\frac{\nu+1}{2}}" />
        <p className="mt-2">
          The Student-t distribution is preferred over Gaussian because: (1) heavier tails
          (controlled by <InlineMath math="\nu" />) handle outlier events naturally; (2) as
          <InlineMath math="\nu \to \infty" /> it approaches Gaussian; (3) with
          <InlineMath math="\nu = 1" /> it becomes the Cauchy distribution for very heavy tails.
          The model can adapt tail heaviness to the data.
        </p>
      </DefinitionBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Pre-Training Data: The Pile of Time Series</h2>
      <p className="text-gray-700 leading-relaxed">
        Lag-Llama was pre-trained on a diverse collection called "The Pile of Time Series" —
        an aggregation of public time series datasets spanning:
      </p>
      <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
        <li>Electricity consumption (electricity, traffic)</li>
        <li>Weather measurements (temperature, humidity)</li>
        <li>Financial data (exchange rates)</li>
        <li>Retail and demand data (M4, M5 subsets)</li>
        <li>Web traffic and other internet metrics</li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        Unlike Chronos which uses KernelSynth synthetic data augmentation, Lag-Llama focuses
        exclusively on real-world time series, making its pre-training distribution closer to
        typical production use cases.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Zero-Shot and Fine-Tuned Performance</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-indigo-50">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Dataset</th>
              <th className="border border-gray-300 p-3 text-left">Lag-Llama (zero-shot)</th>
              <th className="border border-gray-300 p-3 text-left">Lag-Llama (fine-tuned)</th>
              <th className="border border-gray-300 p-3 text-left">DeepAR</th>
              <th className="border border-gray-300 p-3 text-left">TFT</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Electricity', 'Competitive', 'Best', 'Strong', 'Strong'],
              ['Traffic', 'Moderate', 'Best', 'Good', 'Good'],
              ['Exchange', 'Good', 'Best', 'Moderate', 'Moderate'],
              ['M4 Weekly', 'Competitive', 'Best', 'Good', 'Good'],
              ['Tourism Monthly', 'Good', 'Best', 'Good', 'Good'],
            ].map(([ds, lz, lf, dar, tft], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-3 font-medium text-gray-700">{ds}</td>
                <td className="border border-gray-300 p-3 text-indigo-600">{lz}</td>
                <td className="border border-gray-300 p-3 text-green-600 font-medium">{lf}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{dar}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{tft}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoteBlock title="Fine-Tuning Significantly Helps">
        Unlike Chronos and TimeGPT which are competitive zero-shot, Lag-Llama shows a larger
        improvement from fine-tuning. This suggests the model architecture is well-suited to
        adaptation but may need target-domain exposure to fully utilize its capacity. Fine-tuning
        even for a small number of steps (100-500) typically provides substantial gains.
      </NoteBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Python: Lag-Llama via HuggingFace</h2>

      <PythonCode>{`# Install: pip install lag-llama
# Model available at: huggingface.co/time-series-foundation-models/Lag-Llama
import torch
import pandas as pd
import numpy as np
from gluonts.dataset.pandas import PandasDataset
from gluonts.dataset.split import split

# ── Prepare data in GluonTS format ────────────────────────────────────────────
# Lag-Llama uses GluonTS data format
np.random.seed(42)
dates = pd.date_range('2020-01-01', periods=365, freq='D')
y = (np.sin(np.arange(365) * 2 * np.pi / 7) * 10   # weekly seasonality
     + np.linspace(0, 20, 365)                        # trend
     + np.random.randn(365) * 2)                      # noise

ts_df = pd.DataFrame({'y': y}, index=dates)
dataset = PandasDataset(ts_df, target='y', freq='D')

# Split into train and test
prediction_length = 30
train, test_template = split(dataset, offset=-prediction_length)
test = test_template.generate_instances(prediction_length=prediction_length)

# ── Load Lag-Llama from HuggingFace ───────────────────────────────────────────
from huggingface_hub import hf_hub_download
ckpt = hf_hub_download(
    repo_id='time-series-foundation-models/Lag-Llama',
    filename='lag-llama.ckpt',
)

from lag_llama.gluon.estimator import LagLlamaEstimator

# Zero-shot: use pretrained weights without fine-tuning
estimator = LagLlamaEstimator(
    ckpt_path=ckpt,
    prediction_length=prediction_length,
    context_length=prediction_length * 3,   # 3x look-back
    device=torch.device('cpu'),             # or 'cuda'
    num_samples=100,                        # Samples from Student-t distribution
    batch_size=32,
    num_parallel_samples=100,
)

# Zero-shot prediction
lightning_module, transformation, predictor = estimator.create_predictor(
    transformed_data=estimator.create_transformation()(iter(test)),
    trained_params=None,   # Use pre-trained params
)

forecasts = list(predictor.predict(test))
print(f"Forecast type: {type(forecasts[0])}")
print(f"Sample shape: {forecasts[0].samples.shape}")  # (100, 30)

# Extract quantiles
fc = forecasts[0]
median = np.median(fc.samples, axis=0)
q10 = np.quantile(fc.samples, 0.1, axis=0)
q90 = np.quantile(fc.samples, 0.9, axis=0)
print(f"Median forecast next 5 days: {median[:5].round(2)}")

# ── Fine-tuning on target domain ──────────────────────────────────────────────
estimator_ft = LagLlamaEstimator(
    ckpt_path=ckpt,
    prediction_length=prediction_length,
    context_length=prediction_length * 3,
    device=torch.device('cpu'),
    num_samples=100,
    batch_size=32,
    # Fine-tuning hyperparameters
    lr=5e-4,
    max_epochs=20,          # Few epochs sufficient for fine-tuning
    nonnegative_pred_samples=True,   # Enforce non-negative forecasts (e.g., demand)
)

predictor_ft = estimator_ft.train(training_data=train, num_workers=0)
forecasts_ft = list(predictor_ft.predict(test))
ft_median = np.median(forecasts_ft[0].samples, axis=0)
print(f"Fine-tuned vs zero-shot improvement:")
print(f"  Zero-shot MAE:   {np.abs(median - y[-30:]).mean():.2f}")
print(f"  Fine-tuned MAE:  {np.abs(ft_median - y[-30:]).mean():.2f}")

# ── Evaluation with GluonTS metrics ───────────────────────────────────────────
from gluonts.evaluation import make_evaluation_predictions, Evaluator

# Compute CRPS, sMAPE, and coverage
evaluator = Evaluator(quantiles=[0.1, 0.5, 0.9])
agg_metrics, ts_metrics = evaluator(iter(test), iter(forecasts))
print(f"CRPS: {agg_metrics['mean_wQuantileLoss']:.4f}")
print(f"sMAPE: {agg_metrics['sMAPE']:.4f}")
`}</PythonCode>

      <ExampleBlock title="When Lag Features Beat Positional Encodings">
        <p>
          Consider daily electricity consumption with weekly seasonality. A model with positional
          encoding sees "step 10" at position 10 — it must learn that positions 10, 17, 24, ...
          are all Mondays. Lag-Llama instead sees the actual value from 7 days ago as an explicit
          feature, making the weekly pattern immediately available without any learning. This is
          especially powerful for irregular seasonal patterns that are hard to encode positionally.
        </p>
      </ExampleBlock>

      <WarningBlock title="GluonTS Dependency">
        Lag-Llama's official implementation uses GluonTS for data loading, which has different
        conventions from neuralforecast/statsforecast (item_id, start, target vs unique_id, ds, y).
        If integrating with the Nixtla ecosystem, you'll need to convert formats. Community
        wrappers exist but may lag behind the official release.
      </WarningBlock>

      <ReferenceList references={[
        { authors: 'Rasul, K. et al.', year: 2024, title: 'Lag-Llama: Towards Foundation Models for Probabilistic Time Series Forecasting', venue: 'arXiv', url: 'https://arxiv.org/abs/2310.08278' },
        { authors: 'Touvron, H. et al.', year: 2023, title: 'LLaMA: Open and Efficient Foundation Language Models', venue: 'arXiv', url: 'https://arxiv.org/abs/2302.13971' },
        { authors: 'Salinas, D., Flunkert, V., Gasthaus, J.', year: 2020, title: 'DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks', venue: 'International Journal of Forecasting', url: 'https://arxiv.org/abs/1704.04110' },
      ]} />
    </SectionLayout>
  );
}
