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

// Interactive LSTM gate diagram
function LSTMDiagram() {
  const [activeGate, setActiveGate] = useState(null);

  const gates = [
    { id: 'forget', label: 'Forget Gate', color: '#ef4444', x: 80, desc: 'Decides what fraction of the old cell state to keep. Output ∈ (0,1): 0 = forget everything, 1 = keep everything.' },
    { id: 'input', label: 'Input Gate', color: '#3b82f6', x: 200, desc: 'Decides which new information to write to the cell state. Pair of sigmoid (how much) and tanh (what to write).' },
    { id: 'output', label: 'Output Gate', color: '#10b981', x: 320, desc: 'Decides what part of the cell state to expose as the hidden state h_t. Filtered version of cell state.' },
  ];

  const active = gates.find(g => g.id === activeGate);

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">LSTM Cell — Click a Gate to Learn More</h4>
      <div className="flex gap-3 mb-4 flex-wrap">
        {gates.map(g => (
          <button
            key={g.id}
            onClick={() => setActiveGate(activeGate === g.id ? null : g.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
              activeGate === g.id ? 'text-white border-transparent' : 'bg-white text-gray-700'
            }`}
            style={activeGate === g.id ? { backgroundColor: g.color, borderColor: g.color } : { borderColor: g.color }}
          >
            {g.label}
          </button>
        ))}
      </div>

      <svg width="440" height="180">
        {/* Cell state highway */}
        <line x1="10" y1="40" x2="430" y2="40" stroke="#9ca3af" strokeWidth={3} strokeDasharray="6 3" />
        <text x="10" y="25" fontSize={11} fill="#6b7280">Cell state C_t highway</text>

        {/* Gate circles */}
        {gates.map(g => (
          <g key={g.id} onClick={() => setActiveGate(activeGate === g.id ? null : g.id)} style={{ cursor: 'pointer' }}>
            <circle cx={g.x} cy={40} r={22}
              fill={activeGate === g.id ? g.color : '#f3f4f6'}
              stroke={g.color} strokeWidth={2.5}
            />
            <text x={g.x} y={44} textAnchor="middle" fontSize={12}
              fill={activeGate === g.id ? 'white' : g.color} fontWeight="bold">
              {g.id === 'forget' ? 'f' : g.id === 'input' ? 'i' : 'o'}
            </text>
            {/* Input from x_t and h_{t-1} */}
            <line x1={g.x} y1={100} x2={g.x} y2={63} stroke={g.color} strokeWidth={1.5} markerEnd="url(#garrow)" />
            <text x={g.x} y={118} textAnchor="middle" fontSize={10} fill="#64748b">
              [h,x]
            </text>
            <text x={g.x} y={155} textAnchor="middle" fontSize={10} fill={g.color}>
              {g.label}
            </text>
          </g>
        ))}

        {/* Output h_t */}
        <line x1="320" y1="40" x2="420" y2="90" stroke="#10b981" strokeWidth={1.5} />
        <text x="425" y="95" fontSize={11} fill="#10b981">h_t</text>

        <defs>
          <marker id="garrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="#64748b" />
          </marker>
        </defs>
      </svg>

      {active && (
        <div className="mt-3 p-3 rounded-md text-sm text-gray-700 border-l-4" style={{ borderColor: active.color, backgroundColor: active.color + '15' }}>
          <strong>{active.label}:</strong> {active.desc}
        </div>
      )}
    </div>
  );
}

export default function LSTMandGRU() {
  return (
    <SectionLayout
      title="LSTM & GRU Architectures"
      difficulty="advanced"
      readingTime={35}
      prerequisites={['Recurrent Neural Networks (s1)', 'Vanishing gradient problem']}
    >
      <p className="text-gray-700 leading-relaxed">
        Long Short-Term Memory (LSTM) networks were introduced by Hochreiter & Schmidhuber in 1997 to
        solve the vanishing gradient problem. The key insight: instead of overwriting the hidden state
        at each step, maintain a separate <strong>cell state</strong> that flows through time nearly
        unchanged — a gradient highway that allows learning over hundreds of timesteps.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">LSTM: The Four Equations</h2>

      <DefinitionBlock title="LSTM Cell Equations">
        <p className="mb-2 text-sm text-gray-600">
          Let <InlineMath math="[h_{t-1}, x_t]" /> denote the concatenation of previous hidden state and current input.
        </p>
        <BlockMath math="f_t = \sigma(W_f [h_{t-1}, x_t] + b_f) \quad \text{(forget gate)}" />
        <BlockMath math="i_t = \sigma(W_i [h_{t-1}, x_t] + b_i) \quad \text{(input gate)}" />
        <BlockMath math="\tilde{C}_t = \tanh(W_C [h_{t-1}, x_t] + b_C) \quad \text{(candidate cell)}" />
        <BlockMath math="C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t \quad \text{(cell state update)}" />
        <BlockMath math="o_t = \sigma(W_o [h_{t-1}, x_t] + b_o) \quad \text{(output gate)}" />
        <BlockMath math="h_t = o_t \odot \tanh(C_t) \quad \text{(hidden state)}" />
      </DefinitionBlock>

      <LSTMDiagram />

      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Why LSTM Solves the Vanishing Gradient</h3>
      <p className="text-gray-700 leading-relaxed">
        The cell state update <InlineMath math="C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t" /> has a
        critical property: the gradient flows through this additive connection without passing through
        any nonlinearity (other than the multiplicative forget gate). This is analogous to residual
        connections in ResNets.
      </p>

      <TheoremBlock title="Gradient Flow Through Cell State">
        <p>The gradient of the loss with respect to an earlier cell state <InlineMath math="C_k" /> is:</p>
        <BlockMath math="\frac{\partial \mathcal{L}}{\partial C_k} = \frac{\partial \mathcal{L}}{\partial C_T} \prod_{t=k+1}^{T} f_t" />
        <p className="mt-2">
          Since <InlineMath math="f_t \in (0, 1)" />, this product can be small, but it degrades far
          more gracefully than the exponential decay in vanilla RNNs — especially when the forget gate
          learns to keep <InlineMath math="f_t \approx 1" /> for relevant memory.
        </p>
      </TheoremBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">GRU: A Simplified Alternative</h2>
      <p className="text-gray-700 leading-relaxed">
        Gated Recurrent Units (GRU), introduced by Cho et al. (2014), achieve similar performance to
        LSTM with fewer parameters by merging the cell state and hidden state, and using only two gates:
      </p>

      <DefinitionBlock title="GRU Equations">
        <BlockMath math="z_t = \sigma(W_z [h_{t-1}, x_t] + b_z) \quad \text{(update gate)}" />
        <BlockMath math="r_t = \sigma(W_r [h_{t-1}, x_t] + b_r) \quad \text{(reset gate)}" />
        <BlockMath math="\tilde{h}_t = \tanh(W [r_t \odot h_{t-1}, x_t] + b) \quad \text{(candidate)}" />
        <BlockMath math="h_t = (1 - z_t) \odot h_{t-1} + z_t \odot \tilde{h}_t \quad \text{(output)}" />
      </DefinitionBlock>

      <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
        <li><strong>Update gate <InlineMath math="z_t" />:</strong> interpolates between old hidden state and new candidate. When <InlineMath math="z_t \approx 0" />, the unit ignores the input and copies past state.</li>
        <li><strong>Reset gate <InlineMath math="r_t" />:</strong> controls how much past hidden state contributes to the candidate. When <InlineMath math="r_t \approx 0" />, the candidate ignores history — effectively resetting the memory.</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">LSTM vs GRU Comparison</h2>

      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-indigo-50">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Property</th>
              <th className="border border-gray-300 p-3 text-left">LSTM</th>
              <th className="border border-gray-300 p-3 text-left">GRU</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Gates', '3 (forget, input, output)', '2 (update, reset)'],
              ['States', 'Cell state + hidden state', 'Hidden state only'],
              ['Parameters', '4 × (d² + d·p)', '3 × (d² + d·p)'],
              ['Long-range memory', 'Explicit cell state highway', 'Implicit via update gate'],
              ['Training speed', 'Slower (more params)', 'Faster'],
              ['Typical performance', 'Slightly better on complex tasks', 'Competitive, often matches LSTM'],
              ['When to prefer', 'Large datasets, complex patterns', 'Limited data, fast iteration'],
            ].map(([prop, lstm, gru], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-3 font-medium text-gray-700">{prop}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{lstm}</td>
                <td className="border border-gray-300 p-3 text-gray-600">{gru}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoteBlock title="Rule of Thumb">
        In practice, LSTM and GRU perform similarly on most forecasting benchmarks. Start with GRU
        if you want faster training and less tuning. Use LSTM if you have a very long context window
        (&gt;200 steps) and sufficient data to train it.
      </NoteBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Multi-Layer LSTM with Dropout</h2>
      <p className="text-gray-700 leading-relaxed">
        Stacking multiple LSTM layers allows the network to learn hierarchical temporal representations.
        Layer <InlineMath math="l" /> receives the hidden states from layer <InlineMath math="l-1" /> as inputs:
      </p>
      <BlockMath math="h_t^{(l)} = \text{LSTM}(h_t^{(l-1)}, h_{t-1}^{(l)})" />

      <p className="text-gray-700 leading-relaxed mt-3">
        Dropout in LSTMs requires care. Standard dropout applied to recurrent connections hurts
        because it introduces noise in the temporal direction. The solution is <strong>variational
        dropout</strong> (Gal & Ghahramani, 2016): use the same dropout mask at every timestep
        within a sequence. PyTorch's built-in <code>dropout</code> parameter applies standard
        dropout only to the outputs of non-final layers, which is a reasonable approximation.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">PyTorch Implementation: Multi-Step LSTM</h2>

      <PythonCode>{`import torch
import torch.nn as nn
import numpy as np
from torch.utils.data import DataLoader, TensorDataset

# ── Multi-step LSTM Forecaster ────────────────────────────────────────────────
class LSTMForecaster(nn.Module):
    def __init__(self, input_size=1, hidden_size=128, num_layers=2,
                 dropout=0.2, horizon=24):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout,        # Dropout between LSTM layers
        )
        self.norm = nn.LayerNorm(hidden_size)
        self.fc = nn.Linear(hidden_size, horizon)

    def forward(self, x):
        # x: (batch, seq_len, input_size)
        out, (h_n, c_n) = self.lstm(x)
        # Use last hidden state of top layer
        last = self.norm(out[:, -1, :])
        return self.fc(last)   # (batch, horizon)


# ── GRU variant for comparison ────────────────────────────────────────────────
class GRUForecaster(nn.Module):
    def __init__(self, input_size=1, hidden_size=128, num_layers=2,
                 dropout=0.2, horizon=24):
        super().__init__()
        self.gru = nn.GRU(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout,
        )
        self.fc = nn.Linear(hidden_size, horizon)

    def forward(self, x):
        out, h_n = self.gru(x)
        return self.fc(out[:, -1, :])


# ── Seq2Seq LSTM for multi-step forecasting ───────────────────────────────────
class Seq2SeqLSTM(nn.Module):
    """Encoder-Decoder LSTM for multi-step forecasting."""
    def __init__(self, input_size=1, hidden_size=128, num_layers=2, horizon=24):
        super().__init__()
        self.encoder = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.decoder = nn.LSTM(1, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, 1)
        self.horizon = horizon

    def forward(self, x, teacher_force_ratio=0.5, y=None):
        # Encode
        _, (h, c) = self.encoder(x)

        # Start token: last observed value
        dec_input = x[:, -1:, :]   # (batch, 1, 1)
        outputs = []

        for t in range(self.horizon):
            out, (h, c) = self.decoder(dec_input, (h, c))
            pred = self.fc(out)            # (batch, 1, 1)
            outputs.append(pred)

            # Teacher forcing: feed ground truth or own prediction
            if y is not None and torch.rand(1).item() < teacher_force_ratio:
                dec_input = y[:, t:t+1, :]
            else:
                dec_input = pred

        return torch.cat(outputs, dim=1).squeeze(-1)  # (batch, horizon)


# ── Training loop example ─────────────────────────────────────────────────────
def train_model(model, train_loader, epochs=50, lr=1e-3):
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model = model.to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.OneCycleLR(
        optimizer, max_lr=lr, epochs=epochs, steps_per_epoch=len(train_loader)
    )
    criterion = nn.HuberLoss(delta=1.0)  # Robust to outliers

    for epoch in range(epochs):
        model.train()
        total_loss = 0
        for xb, yb in train_loader:
            xb, yb = xb.to(device), yb.to(device)
            pred = model(xb)
            loss = criterion(pred, yb)
            optimizer.zero_grad()
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            scheduler.step()
            total_loss += loss.item()
        if (epoch + 1) % 10 == 0:
            avg = total_loss / len(train_loader)
            print(f"Epoch {epoch+1:3d} | Huber Loss: {avg:.4f} | LR: {scheduler.get_last_lr()[0]:.2e}")

# Usage
# model = LSTMForecaster(hidden_size=128, num_layers=2, horizon=24)
# train_model(model, train_loader)
`}</PythonCode>

      <ExampleBlock title="M4 Monthly Dataset Benchmark">
        <p>
          On the M4 monthly dataset (100,000 time series, horizon H=18), a 2-layer LSTM with
          hidden size 128 typically achieves sMAPE around 13-15%, compared to the Naïve2 baseline
          of ~16% and ES-RNN winner of ~11.4%. The key is global training across all series —
          a single LSTM trained on all series outperforms per-series LSTM by a wide margin.
        </p>
      </ExampleBlock>

      <WarningBlock title="LSTM Hyperparameter Sensitivity">
        LSTMs are sensitive to initialization and learning rate. Best practices:
        (1) Initialize forget gate bias to 1 to encourage memory retention early in training.
        (2) Use learning rate warmup.
        (3) Normalize inputs to zero mean, unit variance.
        (4) Consider instance normalization (reversible IN) if series have varying scales.
      </WarningBlock>

      <ReferenceList references={[
        { authors: 'Hochreiter, S., Schmidhuber, J.', year: 1997, title: 'Long Short-Term Memory', venue: 'Neural Computation', url: 'https://doi.org/10.1162/neco.1997.9.8.1735' },
        { authors: 'Cho, K. et al.', year: 2014, title: 'Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation', venue: 'EMNLP', url: 'https://arxiv.org/abs/1406.1078' },
        { authors: 'Gal, Y., Ghahramani, Z.', year: 2016, title: 'A Theoretically Grounded Application of Dropout in Recurrent Neural Networks', venue: 'NeurIPS', url: 'https://arxiv.org/abs/1512.05287' },
        { authors: 'Smyl, S.', year: 2020, title: 'A hybrid method of exponential smoothing and recurrent neural networks for time series forecasting', venue: 'International Journal of Forecasting', url: 'https://doi.org/10.1016/j.ijforecast.2019.03.017' },
      ]} />
    </SectionLayout>
  );
}
