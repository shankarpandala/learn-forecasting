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

function ReceptiveFieldDiagram() {
  const [numLayers, setNumLayers] = useState(3);
  const kernelSize = 3;
  const receptiveField = 1 + (kernelSize - 1) * ((1 << numLayers) - 1);
  const layers = Array.from({ length: numLayers }, (_, i) => ({
    dilation: 1 << i,
    label: `Layer ${i + 1} (d=${1 << i})`,
  }));
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">Dilated Causal Convolution — Receptive Field</h4>
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-gray-600">Number of layers:</label>
        {[2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => setNumLayers(n)}
            className={`px-3 py-1 rounded text-sm border transition-all ${
              numLayers === n
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {layers.map((layer, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-28 shrink-0">{layer.label}</span>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(16, layer.dilation * 8) }, (_, j) => (
                <div
                  key={j}
                  className={`h-5 rounded text-xs flex items-center justify-center ${
                    j % (layer.dilation * 2) === 0
                      ? 'bg-teal-500 text-white w-5'
                      : 'bg-gray-200 text-gray-400 w-3'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 p-2 bg-teal-50 border border-teal-200 rounded text-sm text-teal-900">
        Receptive field with kernel size {kernelSize} and {numLayers} dilated layers:{' '}
        <strong>{receptiveField} time steps</strong>
        {' '}(formula: 1 + (k-1) × (2^L - 1))
      </div>
    </div>
  );
}

const tcnCode = `import torch
import torch.nn as nn
import torch.nn.functional as F
from neuralforecast import NeuralForecast
from neuralforecast.models import TCN
from neuralforecast.losses.pytorch import MAE
import pandas as pd
import numpy as np

# ── 1. Dataset ─────────────────────────────────────────────────────────────
np.random.seed(42)
T = 1000
dates = pd.date_range('2020-01-01', periods=T, freq='D')
t  = np.arange(T)
y  = (20 * np.sin(2 * np.pi * t / 365) +
      5  * np.sin(2 * np.pi * t / 7) +
      0.1 * t + np.random.randn(T) * 2)
df = pd.DataFrame({'unique_id': 'series_1', 'ds': dates, 'y': y})

# ── 2. NeuralForecast TCN ──────────────────────────────────────────────────
model = TCN(
    h=28,
    input_size=112,
    kernel_size=3,            # convolution kernel width
    dilations=[1, 2, 4, 8, 16],   # doubling dilations
    encoder_hidden_size=64,
    context_size=10,
    loss=MAE(),
    max_steps=500,
    learning_rate=1e-3,
    batch_size=32,
    random_seed=42,
)

nf = NeuralForecast(models=[model], freq='D')
nf.fit(df)
pred = nf.predict()
print(pred)

# ── 3. Custom Temporal Convolutional Network in PyTorch ─────────────────────
class CausalConv1d(nn.Module):
    """Dilated causal convolution that preserves temporal ordering."""

    def __init__(self, in_ch, out_ch, kernel_size, dilation):
        super().__init__()
        self.padding = (kernel_size - 1) * dilation   # causal padding
        self.conv = nn.Conv1d(in_ch, out_ch, kernel_size,
                              dilation=dilation, padding=self.padding)

    def forward(self, x):
        return self.conv(x)[:, :, :-self.padding] if self.padding else self.conv(x)


class TCNResidualBlock(nn.Module):
    def __init__(self, in_ch, out_ch, kernel_size, dilation, dropout=0.2):
        super().__init__()
        self.conv1  = CausalConv1d(in_ch, out_ch, kernel_size, dilation)
        self.conv2  = CausalConv1d(out_ch, out_ch, kernel_size, dilation)
        self.norm1  = nn.LayerNorm(out_ch)
        self.norm2  = nn.LayerNorm(out_ch)
        self.drop   = nn.Dropout(dropout)
        # Skip connection (1x1 conv if channel mismatch)
        self.skip   = nn.Conv1d(in_ch, out_ch, 1) if in_ch != out_ch else nn.Identity()

    def forward(self, x):
        # x: (B, C, T)
        out = F.relu(self.norm1(self.conv1(x).transpose(1, 2)).transpose(1, 2))
        out = self.drop(out)
        out = F.relu(self.norm2(self.conv2(out).transpose(1, 2)).transpose(1, 2))
        out = self.drop(out)
        return F.relu(out + self.skip(x))


class TemporalConvNet(nn.Module):
    """Stack of residual dilated causal convolution blocks."""

    def __init__(self, input_size, num_channels, kernel_size=3, dropout=0.2):
        super().__init__()
        layers = []
        for i, (in_ch, out_ch) in enumerate(zip(
            [input_size] + list(num_channels[:-1]), num_channels
        )):
            dilation = 2 ** i
            layers.append(TCNResidualBlock(in_ch, out_ch, kernel_size, dilation, dropout))
        self.network = nn.Sequential(*layers)

    def forward(self, x):
        return self.network(x)   # (B, C_last, T)


class TCNForecaster(nn.Module):
    def __init__(self, in_features=1, channels=(64, 64, 64, 64), horizon=28):
        super().__init__()
        self.tcn = TemporalConvNet(in_features, channels)
        self.fc  = nn.Linear(channels[-1], horizon)

    def forward(self, x):
        # x: (B, T, F) → (B, F, T) for Conv1d
        out = self.tcn(x.transpose(1, 2))   # (B, C, T)
        return self.fc(out[:, :, -1])        # use last time step → (B, H)

model_pt = TCNForecaster(in_features=1, channels=(64,) * 4, horizon=28)
x_dummy  = torch.randn(16, 112, 1)
print("TCN output shape:", model_pt(x_dummy).shape)   # (16, 28)

# Receptive field: 1 + (kernel_size-1) * sum(2^i for i in range(L))
kernel_size, L = 3, 4
rf = 1 + (kernel_size - 1) * ((2 ** L) - 1)
print(f"Receptive field ({L} layers, k={kernel_size}): {rf} steps")
`;

export default function TCNSection() {
  return (
    <SectionLayout
      title="Temporal Convolutional Networks (TCN)"
      difficulty="advanced"
      readingTime={12}
    >
      <p className="text-gray-700 leading-relaxed">
        Temporal Convolutional Networks replace recurrence with{' '}
        <em>dilated causal convolutions</em> arranged in residual blocks. This
        design gives TCNs the ability to capture very long-range dependencies
        with a precisely controlled <em>receptive field</em>, while enabling
        fully parallel training — a significant advantage over sequential RNNs.
      </p>

      <DefinitionBlock title="Dilated Causal Convolution">
        A <strong>causal convolution</strong> at time step <InlineMath math="t" />{' '}
        uses only past and current inputs{' '}
        <InlineMath math="x_{\leq t}" />, never future ones. A{' '}
        <strong>dilation</strong> of <InlineMath math="d" /> skips{' '}
        <InlineMath math="d-1" /> positions between kernel elements, effectively
        expanding the receptive field without increasing the kernel size:
        <BlockMath math="(x * k)_t = \sum_{i=0}^{k-1} x_{t - d \cdot i} \cdot w_i" />
      </DefinitionBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Exponentially Growing Dilations
      </h2>
      <p className="text-gray-700 leading-relaxed">
        TCNs typically double the dilation at each layer:{' '}
        <InlineMath math="d_\ell = 2^\ell" />. With kernel size{' '}
        <InlineMath math="k" /> and <InlineMath math="L" /> layers, the
        receptive field (the number of past inputs that influence any single
        output) grows exponentially:
      </p>
      <BlockMath math="\text{RF} = 1 + (k-1)\sum_{\ell=0}^{L-1} 2^\ell = 1 + (k-1)(2^L - 1)" />
      <p className="text-gray-700 leading-relaxed mt-3">
        With <InlineMath math="k=3" /> and <InlineMath math="L=8" /> layers,
        the receptive field spans <strong>511 steps</strong> — sufficient for
        yearly seasonality in hourly data — with only 8 convolution layers.
      </p>

      <ReceptiveFieldDiagram />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Residual Connections
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Each TCN block wraps two dilated causal convolutions in a residual
        connection. If the number of input and output channels differ, a 1×1
        convolution is used as a skip connection:
      </p>
      <BlockMath math="\mathbf{z}^{(\ell)} = \text{ReLU}\!\bigl(\mathbf{F}(x^{(\ell)}) + W_s\, x^{(\ell)}\bigr)" />
      <p className="text-gray-700 leading-relaxed mt-3">
        Residual connections solve vanishing gradients and allow stacking many
        layers without performance degradation — the same motivation as ResNets
        in image recognition.
      </p>

      <TheoremBlock title="WaveNet and the Origins of Dilated TCNs">
        <p>
          WaveNet (van den Oord et al., 2016) popularized dilated causal
          convolutions for audio waveform generation. The forecasting community
          later adapted this architecture for time series, combining it with
          residual blocks and replacing the softmax output with direct regression
          targets. The key insight: audio generation and time-series forecasting
          share the same auto-regressive conditional structure.
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        TCN vs RNN: When to Use Which
      </h2>
      <div className="overflow-x-auto my-4">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Property</th>
              <th className="px-4 py-2 text-left text-gray-700">LSTM / GRU</th>
              <th className="px-4 py-2 text-left text-gray-700">TCN</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Training parallelism', 'Sequential (slow)', 'Fully parallel (fast)'],
              ['Receptive field', 'Theoretically infinite', 'Fixed, controllable'],
              ['Memory during training', 'BPTT gradients through time', 'Standard backprop'],
              ['Long-range dependencies', 'Struggles beyond ~200 steps', 'Explicit via dilation'],
              ['Variable-length input', 'Native support', 'Requires padding/cropping'],
              ['Interpretability', 'Gate activations', 'Convolution filters'],
            ].map(([p, a, b]) => (
              <tr key={p} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-700">{p}</td>
                <td className="px-4 py-2 text-gray-600">{a}</td>
                <td className="px-4 py-2 text-gray-600">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExampleBlock title="TimesNet: 2D Temporal Convolution">
        <p className="text-sm text-gray-700">
          TimesNet (Wu et al., 2023) extends the TCN idea by reshaping the 1D
          time series into a 2D temporal map based on the detected dominant
          period, then applying standard 2D convolutions. This allows the model
          to capture both intra-period patterns (e.g., within a week) and
          inter-period patterns (e.g., week-over-week trends) simultaneously.
          It achieves state-of-the-art results on several benchmarks by
          exploiting the inherent 2D structure of seasonal time series.
        </p>
      </ExampleBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Implementation</h2>
      <PythonCode code={tcnCode} />

      <WarningBlock title="Ensure Causal Masking">
        Standard Conv1d in PyTorch uses symmetric padding, which leaks future
        information. Always use causal (left-only) padding:{' '}
        <code>padding = (kernel_size - 1) * dilation</code> and then trim the
        right end of the output. Failing to do so produces a model that appears
        to work during training (because ground truth fills right-padding
        positions) but leaks information and will generalize poorly.
      </WarningBlock>

      <NoteBlock title="Practical Tips for TCNs">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li>Set dilations to <code>[1, 2, 4, 8, ...]</code> doubling each layer; 4–6 layers covers most daily/hourly datasets.</li>
          <li>Use <strong>weight normalization</strong> (not batch norm) for stable training — batch norm interacts poorly with variable-length sequences.</li>
          <li>TCNs are very fast to train: no sequential dependency, all time steps processed in parallel on GPU.</li>
          <li>For multivariate forecasting, concatenate all variates as input channels (channel mixing) or process each independently (channel independence).</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Bai, S., Kolter, J. Z., & Koltun, V.', year: 2018, title: 'An Empirical Evaluation of Generic Convolutional and Recurrent Networks for Sequence Modeling', venue: 'arXiv' },
        { author: 'van den Oord, A., et al.', year: 2016, title: 'WaveNet: A Generative Model for Raw Audio', venue: 'arXiv' },
        { author: 'Wu, H., Hu, T., Liu, Y., et al.', year: 2023, title: 'TimesNet: Temporal 2D-Variation Modeling for General Time Series Analysis', venue: 'ICLR' },
      ]} />
    </SectionLayout>
  );
}
