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

// Interactive RNN unrolling visualization
function RNNUnrollViz() {
  const [steps, setSteps] = useState(3);
  const maxSteps = 6;

  const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-3">RNN Unrolled Through Time</h4>
      <div className="mb-3">
        <label className="text-sm text-gray-600 mr-2">Unroll steps: {steps}</label>
        <input
          type="range" min={1} max={maxSteps} value={steps}
          onChange={e => setSteps(Number(e.target.value))}
          className="w-40 accent-indigo-500"
        />
      </div>
      <div className="overflow-x-auto">
        <svg width={Math.max(steps * 120 + 40, 300)} height={220}>
          {/* Draw cells */}
          {Array.from({ length: steps }).map((_, i) => (
            <g key={i}>
              {/* Hidden state box */}
              <rect
                x={i * 120 + 20} y={60}
                width={80} height={50}
                rx={8} fill={colors[i % colors.length]}
                stroke="#4f46e5" strokeWidth={1.5}
              />
              <text x={i * 120 + 60} y={89} textAnchor="middle" fill="white" fontSize={13} fontWeight="bold">
                h_{i}
              </text>
              {/* Input arrow */}
              <line
                x1={i * 120 + 60} y1={160}
                x2={i * 120 + 60} y2={112}
                stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrow)"
              />
              <text x={i * 120 + 60} y={178} textAnchor="middle" fill="#64748b" fontSize={12}>
                x_{i}
              </text>
              {/* Output arrow */}
              <line
                x1={i * 120 + 60} y1={60}
                x2={i * 120 + 60} y2={28}
                stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrow)"
              />
              <text x={i * 120 + 60} y={18} textAnchor="middle" fill="#64748b" fontSize={12}>
                y_{i}
              </text>
              {/* Recurrent arrow (except last) */}
              {i < steps - 1 && (
                <line
                  x1={i * 120 + 100} y1={85}
                  x2={i * 120 + 140} y2={85}
                  stroke="#4f46e5" strokeWidth={2} markerEnd="url(#arrow)"
                />
              )}
            </g>
          ))}
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#64748b" />
            </marker>
          </defs>
        </svg>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Each cell shares the same weights W_h and W_x. The hidden state h_t passes information forward through time.
      </p>
    </div>
  );
}

// Gradient decay chart
function GradientDecayChart() {
  const data = Array.from({ length: 20 }, (_, t) => ({
    t,
    vanishing: Math.pow(0.5, t).toFixed(6),
    exploding: Math.min(Math.pow(1.5, t), 1000).toFixed(2),
  }));

  return (
    <div className="my-4">
      <h4 className="font-semibold text-gray-700 mb-2">Gradient Magnitude vs. Distance in Time</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="t" label={{ value: 'Steps back in time', position: 'insideBottom', offset: -2 }} />
          <YAxis domain={[0, 2]} />
          <Tooltip />
          <Legend verticalAlign="top" />
          <ReferenceLine y={1} stroke="#9ca3af" strokeDasharray="4 2" />
          <Line type="monotone" dataKey="vanishing" stroke="#ef4444" dot={false} name="Vanishing (|W|<1)" />
          <Line type="monotone" dataKey="exploding" stroke="#f97316" dot={false} name="Exploding (|W|>1, clamped)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function RNNBasics() {
  return (
    <SectionLayout
      title="Recurrent Neural Networks for Forecasting"
      difficulty="advanced"
      readingTime={35}
      prerequisites={['Neural network fundamentals', 'Backpropagation', 'Time series basics']}
    >
      <p className="text-gray-700 leading-relaxed">
        Recurrent Neural Networks (RNNs) were the dominant deep learning architecture for sequential data
        through the late 2010s. Unlike feedforward networks, RNNs maintain a <strong>hidden state</strong> that
        acts as a compressed memory of all past inputs — a natural fit for time series where history matters.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">The RNN Architecture</h2>
      <p className="text-gray-700 leading-relaxed">
        At each timestep <InlineMath math="t" />, an RNN takes the current input <InlineMath math="x_t" /> and
        the previous hidden state <InlineMath math="h_{t-1}" /> to produce a new hidden state:
      </p>

      <DefinitionBlock title="RNN Hidden State Update">
        <BlockMath math="h_t = \tanh(W_h h_{t-1} + W_x x_t + b)" />
        <p className="mt-2">
          where <InlineMath math="W_h \in \mathbb{R}^{d \times d}" /> is the recurrent weight matrix,{' '}
          <InlineMath math="W_x \in \mathbb{R}^{d \times p}" /> maps the <InlineMath math="p" />-dimensional
          input to the hidden space, and <InlineMath math="b" /> is a bias vector.
          The output <InlineMath math="\hat{y}_t = W_y h_t + b_y" />.
        </p>
      </DefinitionBlock>

      <p className="text-gray-700 leading-relaxed mt-4">
        The crucial property is <strong>weight sharing</strong>: the same <InlineMath math="W_h, W_x" /> are used
        at every timestep. This allows the network to process sequences of any length without growing the
        parameter count.
      </p>

      <RNNUnrollViz />

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Backpropagation Through Time (BPTT)</h2>
      <p className="text-gray-700 leading-relaxed">
        Training an RNN requires computing gradients with respect to parameters shared across all timesteps.
        This is done by <strong>unrolling</strong> the network into a deep feedforward graph and applying
        standard backpropagation — a procedure called BPTT.
      </p>

      <p className="text-gray-700 leading-relaxed mt-3">
        For a sequence of length <InlineMath math="T" />, the total loss is:
      </p>
      <BlockMath math="\mathcal{L} = \sum_{t=1}^{T} \ell(\hat{y}_t, y_t)" />

      <p className="text-gray-700 leading-relaxed mt-3">
        The gradient of the loss with respect to an early hidden state involves a chain of Jacobians:
      </p>
      <BlockMath math="\frac{\partial \mathcal{L}_T}{\partial h_k} = \frac{\partial \mathcal{L}_T}{\partial h_T} \prod_{t=k+1}^{T} \frac{\partial h_t}{\partial h_{t-1}}" />

      <p className="text-gray-700 leading-relaxed mt-3">
        Each factor <InlineMath math="\frac{\partial h_t}{\partial h_{t-1}} = \text{diag}(\tanh'(\cdot)) \cdot W_h" />.
        When this matrix is repeatedly multiplied, the product either explodes or vanishes exponentially in <InlineMath math="T - k" />.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">The Vanishing Gradient Problem</h2>

      <TheoremBlock title="Vanishing Gradient (Bengio et al., 1994)">
        <p>
          If <InlineMath math="\|W_h\| < 1" /> (spectral norm), then the gradient{' '}
          <InlineMath math="\|\partial \mathcal{L}_T / \partial h_k\|" /> decays exponentially as{' '}
          <InlineMath math="T - k \to \infty" />. Specifically:
        </p>
        <BlockMath math="\left\|\frac{\partial h_t}{\partial h_{t-k}}\right\| \leq (\lambda_{\max} \cdot \gamma)^k" />
        <p className="mt-2">
          where <InlineMath math="\lambda_{\max}" /> is the largest singular value of <InlineMath math="W_h" /> and
          {' '}<InlineMath math="\gamma < 1" /> comes from the saturation of <InlineMath math="\tanh" />.
          For long sequences, gradients from early timesteps become negligible.
        </p>
      </TheoremBlock>

      <GradientDecayChart />

      <p className="text-gray-700 leading-relaxed mt-2">
        In practice, this means a vanilla RNN can only "remember" roughly 10–20 timesteps, making it
        unsuitable for forecasting problems with long seasonal patterns (e.g., annual seasonality in
        daily data requires 365-step memory).
      </p>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Exploding Gradients and Gradient Clipping</h2>
      <p className="text-gray-700 leading-relaxed">
        When <InlineMath math="\|W_h\| > 1" />, gradients grow exponentially and the optimizer takes
        catastrophically large steps. The standard remedy is <strong>gradient clipping</strong>: rescale
        the gradient norm whenever it exceeds a threshold <InlineMath math="\tau" />:
      </p>

      <BlockMath math="\hat{g} = \begin{cases} g & \text{if } \|g\| \leq \tau \\ \frac{\tau}{\|g\|} g & \text{otherwise} \end{cases}" />

      <NoteBlock title="Practical Clipping Values">
        A threshold of <InlineMath math="\tau = 1.0" /> or <InlineMath math="\tau = 5.0" /> is typical.
        PyTorch provides <code>torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)</code>.
        Exploding gradients manifest as NaN losses or sudden loss spikes — both are signs to reduce
        your learning rate or add clipping.
      </NoteBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">RNN Variants for Forecasting</h2>
      <p className="text-gray-700 leading-relaxed">
        Several architectural choices matter for time series:
      </p>
      <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
        <li><strong>Many-to-one:</strong> encode the entire history, predict a single future step.</li>
        <li><strong>Many-to-many:</strong> at each step produce an output — useful for multi-step forecasting via teacher forcing.</li>
        <li><strong>Seq2Seq:</strong> encoder RNN compresses history into a context vector; decoder RNN generates the forecast horizon autoregressively.</li>
        <li><strong>Stacked RNNs:</strong> multiple RNN layers where each layer's hidden states feed the next, learning hierarchical temporal patterns.</li>
      </ul>

      <WarningBlock title="RNN Limitations in Practice">
        Even with clipping, vanilla RNNs struggle with dependencies beyond ~20 timesteps. For most
        real-world forecasting tasks with seasonality or long-range trends, prefer LSTM or GRU (next section)
        or Transformer-based architectures. Vanilla RNNs are primarily of historical and pedagogical interest.
      </WarningBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">PyTorch Implementation</h2>

      <PythonCode>{`import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from torch.utils.data import DataLoader, TensorDataset

# ── Data preparation ──────────────────────────────────────────────────────────
# Assume we have a univariate time series as a numpy array
np.random.seed(42)
T = 1000
t = np.linspace(0, 10 * np.pi, T)
series = np.sin(t) + 0.1 * np.random.randn(T)  # noisy sine wave

def create_windows(series, lookback, horizon):
    X, y = [], []
    for i in range(len(series) - lookback - horizon + 1):
        X.append(series[i : i + lookback])
        y.append(series[i + lookback : i + lookback + horizon])
    return np.array(X, dtype=np.float32), np.array(y, dtype=np.float32)

LOOKBACK = 50
HORIZON = 10
X, y = create_windows(series, LOOKBACK, HORIZON)

# Train/test split
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# Reshape to (batch, seq_len, features=1)
X_train = torch.tensor(X_train).unsqueeze(-1)
X_test  = torch.tensor(X_test).unsqueeze(-1)
y_train = torch.tensor(y_train)
y_test  = torch.tensor(y_test)

train_loader = DataLoader(TensorDataset(X_train, y_train), batch_size=64, shuffle=True)

# ── RNN Model ─────────────────────────────────────────────────────────────────
class RNNForecaster(nn.Module):
    def __init__(self, input_size=1, hidden_size=64, num_layers=2, horizon=10):
        super().__init__()
        self.rnn = nn.RNN(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,     # (batch, seq, feature)
            dropout=0.1,          # applied between layers (not on last layer)
            nonlinearity='tanh',  # 'relu' is also an option
        )
        self.fc = nn.Linear(hidden_size, horizon)

    def forward(self, x):
        # x: (batch, seq_len, input_size)
        out, h_n = self.rnn(x)       # out: (batch, seq_len, hidden_size)
        last_hidden = out[:, -1, :]  # take the last timestep
        return self.fc(last_hidden)  # (batch, horizon)

# ── Training ─────────────────────────────────────────────────────────────────
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = RNNForecaster(hidden_size=64, num_layers=2, horizon=HORIZON).to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.MSELoss()

for epoch in range(30):
    model.train()
    total_loss = 0
    for xb, yb in train_loader:
        xb, yb = xb.to(device), yb.to(device)
        pred = model(xb)
        loss = criterion(pred, yb)
        optimizer.zero_grad()
        loss.backward()
        # Gradient clipping to prevent exploding gradients
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        optimizer.step()
        total_loss += loss.item()
    if (epoch + 1) % 10 == 0:
        print(f"Epoch {epoch+1:3d} | Train MSE: {total_loss/len(train_loader):.4f}")

# ── Evaluation ────────────────────────────────────────────────────────────────
model.eval()
with torch.no_grad():
    preds = model(X_test.to(device)).cpu().numpy()

mae = np.abs(preds - y_test.numpy()).mean()
print(f"Test MAE: {mae:.4f}")
`}</PythonCode>

      <ExampleBlock title="Why This RNN Will Struggle">
        <p>
          The sine wave has period <InlineMath math="2\pi \approx 6.28" /> steps in the data (roughly 63 samples
          over the full range). With a lookback of 50 and 2 RNN layers, the model has enough context to
          learn this short-range pattern. However, if we increased the period to 200+ samples, the RNN's
          vanishing gradient would prevent it from leveraging the full history — this is where LSTM shines.
        </p>
      </ExampleBlock>

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Truncated BPTT</h2>
      <p className="text-gray-700 leading-relaxed">
        For very long sequences, full BPTT is computationally prohibitive (memory scales with <InlineMath math="T" />).
        <strong>Truncated BPTT</strong> splits the sequence into chunks of length <InlineMath math="k" /> and
        backpropagates only within each chunk, while carrying the hidden state forward:
      </p>
      <BlockMath math="\text{for } t = 1, k+1, 2k+1, \ldots: \quad \text{forward } k \text{ steps, backward } k \text{ steps}" />

      <NoteBlock title="Hidden State Detachment">
        In PyTorch, use <code>h = h.detach()</code> between chunks to stop gradients from flowing
        beyond the chunk boundary. This trades some gradient accuracy for constant memory usage
        regardless of sequence length.
      </NoteBlock>

      <ReferenceList references={[
        { authors: 'Rumelhart, D.E., Hinton, G.E., Williams, R.J.', year: 1986, title: 'Learning representations by back-propagating errors', venue: 'Nature', url: 'https://doi.org/10.1038/323533a0' },
        { authors: 'Bengio, Y., Simard, P., Frasconi, P.', year: 1994, title: 'Learning long-term dependencies with gradient descent is difficult', venue: 'IEEE Transactions on Neural Networks', url: 'https://doi.org/10.1109/72.279181' },
        { authors: 'Pascanu, R., Mikolov, T., Bengio, Y.', year: 2013, title: 'On the difficulty of training recurrent neural networks', venue: 'ICML', url: 'https://proceedings.mlr.press/v28/pascanu13.html' },
        { authors: 'Hewamalage, H., Bergmeir, C., Bandara, K.', year: 2021, title: 'Recurrent Neural Networks for Time Series Forecasting: Current status and future directions', venue: 'International Journal of Forecasting', url: 'https://doi.org/10.1016/j.ijforecast.2020.06.008' },
      ]} />
    </SectionLayout>
  );
}
