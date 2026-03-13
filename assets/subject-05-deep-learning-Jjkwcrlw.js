import{j as e,r as h}from"./vendor-CnSysweu.js";import{r as t}from"./vendor-katex-CdqB51LS.js";import{S as m,D as d,T as g,N as c,W as p,P as u,E as x,R as f}from"./subject-01-ts-foundations-fmj7uPpc.js";import{R as j,L as M,C as T,X as N,Y as v,T as w,d as S,b as z,a as _,B as A,c as I}from"./vendor-charts-BucFqer8.js";function L(){const[s,o]=h.useState(3),n=6,i=["#6366f1","#8b5cf6","#a78bfa","#c4b5fd","#ddd6fe","#ede9fe"];return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"RNN Unrolled Through Time"}),e.jsxs("div",{className:"mb-3",children:[e.jsxs("label",{className:"text-sm text-gray-600 mr-2",children:["Unroll steps: ",s]}),e.jsx("input",{type:"range",min:1,max:n,value:s,onChange:r=>o(Number(r.target.value)),className:"w-40 accent-indigo-500"})]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("svg",{width:Math.max(s*120+40,300),height:220,children:[Array.from({length:s}).map((r,a)=>e.jsxs("g",{children:[e.jsx("rect",{x:a*120+20,y:60,width:80,height:50,rx:8,fill:i[a%i.length],stroke:"#4f46e5",strokeWidth:1.5}),e.jsxs("text",{x:a*120+60,y:89,textAnchor:"middle",fill:"white",fontSize:13,fontWeight:"bold",children:["h_",a]}),e.jsx("line",{x1:a*120+60,y1:160,x2:a*120+60,y2:112,stroke:"#64748b",strokeWidth:1.5,markerEnd:"url(#arrow)"}),e.jsxs("text",{x:a*120+60,y:178,textAnchor:"middle",fill:"#64748b",fontSize:12,children:["x_",a]}),e.jsx("line",{x1:a*120+60,y1:60,x2:a*120+60,y2:28,stroke:"#64748b",strokeWidth:1.5,markerEnd:"url(#arrow)"}),e.jsxs("text",{x:a*120+60,y:18,textAnchor:"middle",fill:"#64748b",fontSize:12,children:["y_",a]}),a<s-1&&e.jsx("line",{x1:a*120+100,y1:85,x2:a*120+140,y2:85,stroke:"#4f46e5",strokeWidth:2,markerEnd:"url(#arrow)"})]},a)),e.jsx("defs",{children:e.jsx("marker",{id:"arrow",markerWidth:"8",markerHeight:"8",refX:"6",refY:"3",orient:"auto",children:e.jsx("path",{d:"M0,0 L0,6 L8,3 z",fill:"#64748b"})})})]})}),e.jsx("p",{className:"text-xs text-gray-500 mt-2",children:"Each cell shares the same weights W_h and W_x. The hidden state h_t passes information forward through time."})]})}function F(){const s=Array.from({length:20},(o,n)=>({t:n,vanishing:Math.pow(.5,n).toFixed(6),exploding:Math.min(Math.pow(1.5,n),1e3).toFixed(2)}));return e.jsxs("div",{className:"my-4",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-2",children:"Gradient Magnitude vs. Distance in Time"}),e.jsx(j,{width:"100%",height:220,children:e.jsxs(M,{data:s,margin:{top:5,right:20,left:10,bottom:5},children:[e.jsx(T,{strokeDasharray:"3 3",stroke:"#e5e7eb"}),e.jsx(N,{dataKey:"t",label:{value:"Steps back in time",position:"insideBottom",offset:-2}}),e.jsx(v,{domain:[0,2]}),e.jsx(w,{}),e.jsx(S,{verticalAlign:"top"}),e.jsx(z,{y:1,stroke:"#9ca3af",strokeDasharray:"4 2"}),e.jsx(_,{type:"monotone",dataKey:"vanishing",stroke:"#ef4444",dot:!1,name:"Vanishing (|W|<1)"}),e.jsx(_,{type:"monotone",dataKey:"exploding",stroke:"#f97316",dot:!1,name:"Exploding (|W|>1, clamped)"})]})})]})}function q(){return e.jsxs(m,{title:"Recurrent Neural Networks for Forecasting",difficulty:"advanced",readingTime:35,prerequisites:["Neural network fundamentals","Backpropagation","Time series basics"],children:[e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Recurrent Neural Networks (RNNs) were the dominant deep learning architecture for sequential data through the late 2010s. Unlike feedforward networks, RNNs maintain a ",e.jsx("strong",{children:"hidden state"})," that acts as a compressed memory of all past inputs — a natural fit for time series where history matters."]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"The RNN Architecture"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["At each timestep ",e.jsx(t.InlineMath,{math:"t"}),", an RNN takes the current input ",e.jsx(t.InlineMath,{math:"x_t"})," and the previous hidden state ",e.jsx(t.InlineMath,{math:"h_{t-1}"})," to produce a new hidden state:"]}),e.jsxs(d,{title:"RNN Hidden State Update",children:[e.jsx(t.BlockMath,{math:"h_t = \\tanh(W_h h_{t-1} + W_x x_t + b)"}),e.jsxs("p",{className:"mt-2",children:["where ",e.jsx(t.InlineMath,{math:"W_h \\in \\mathbb{R}^{d \\times d}"})," is the recurrent weight matrix,"," ",e.jsx(t.InlineMath,{math:"W_x \\in \\mathbb{R}^{d \\times p}"})," maps the ",e.jsx(t.InlineMath,{math:"p"}),"-dimensional input to the hidden space, and ",e.jsx(t.InlineMath,{math:"b"})," is a bias vector. The output ",e.jsx(t.InlineMath,{math:"\\hat{y}_t = W_y h_t + b_y"}),"."]})]}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-4",children:["The crucial property is ",e.jsx("strong",{children:"weight sharing"}),": the same ",e.jsx(t.InlineMath,{math:"W_h, W_x"})," are used at every timestep. This allows the network to process sequences of any length without growing the parameter count."]}),e.jsx(L,{}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"Backpropagation Through Time (BPTT)"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Training an RNN requires computing gradients with respect to parameters shared across all timesteps. This is done by ",e.jsx("strong",{children:"unrolling"})," the network into a deep feedforward graph and applying standard backpropagation — a procedure called BPTT."]}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:["For a sequence of length ",e.jsx(t.InlineMath,{math:"T"}),", the total loss is:"]}),e.jsx(t.BlockMath,{math:"\\mathcal{L} = \\sum_{t=1}^{T} \\ell(\\hat{y}_t, y_t)"}),e.jsx("p",{className:"text-gray-700 leading-relaxed mt-3",children:"The gradient of the loss with respect to an early hidden state involves a chain of Jacobians:"}),e.jsx(t.BlockMath,{math:"\\frac{\\partial \\mathcal{L}_T}{\\partial h_k} = \\frac{\\partial \\mathcal{L}_T}{\\partial h_T} \\prod_{t=k+1}^{T} \\frac{\\partial h_t}{\\partial h_{t-1}}"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:["Each factor ",e.jsx(t.InlineMath,{math:"\\frac{\\partial h_t}{\\partial h_{t-1}} = \\text{diag}(\\tanh'(\\cdot)) \\cdot W_h"}),". When this matrix is repeatedly multiplied, the product either explodes or vanishes exponentially in ",e.jsx(t.InlineMath,{math:"T - k"}),"."]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"The Vanishing Gradient Problem"}),e.jsxs(g,{title:"Vanishing Gradient (Bengio et al., 1994)",children:[e.jsxs("p",{children:["If ",e.jsx(t.InlineMath,{math:"\\|W_h\\| < 1"})," (spectral norm), then the gradient"," ",e.jsx(t.InlineMath,{math:"\\|\\partial \\mathcal{L}_T / \\partial h_k\\|"})," decays exponentially as"," ",e.jsx(t.InlineMath,{math:"T - k \\to \\infty"}),". Specifically:"]}),e.jsx(t.BlockMath,{math:"\\left\\|\\frac{\\partial h_t}{\\partial h_{t-k}}\\right\\| \\leq (\\lambda_{\\max} \\cdot \\gamma)^k"}),e.jsxs("p",{className:"mt-2",children:["where ",e.jsx(t.InlineMath,{math:"\\lambda_{\\max}"})," is the largest singular value of ",e.jsx(t.InlineMath,{math:"W_h"})," and"," ",e.jsx(t.InlineMath,{math:"\\gamma < 1"})," comes from the saturation of ",e.jsx(t.InlineMath,{math:"\\tanh"}),". For long sequences, gradients from early timesteps become negligible."]})]}),e.jsx(F,{}),e.jsx("p",{className:"text-gray-700 leading-relaxed mt-2",children:'In practice, this means a vanilla RNN can only "remember" roughly 10–20 timesteps, making it unsuitable for forecasting problems with long seasonal patterns (e.g., annual seasonality in daily data requires 365-step memory).'}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"Exploding Gradients and Gradient Clipping"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["When ",e.jsx(t.InlineMath,{math:"\\|W_h\\| > 1"}),", gradients grow exponentially and the optimizer takes catastrophically large steps. The standard remedy is ",e.jsx("strong",{children:"gradient clipping"}),": rescale the gradient norm whenever it exceeds a threshold ",e.jsx(t.InlineMath,{math:"\\tau"}),":"]}),e.jsx(t.BlockMath,{math:"\\hat{g} = \\begin{cases} g & \\text{if } \\|g\\| \\leq \\tau \\\\ \\frac{\\tau}{\\|g\\|} g & \\text{otherwise} \\end{cases}"}),e.jsxs(c,{title:"Practical Clipping Values",children:["A threshold of ",e.jsx(t.InlineMath,{math:"\\tau = 1.0"})," or ",e.jsx(t.InlineMath,{math:"\\tau = 5.0"})," is typical. PyTorch provides ",e.jsx("code",{children:"torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)"}),". Exploding gradients manifest as NaN losses or sudden loss spikes — both are signs to reduce your learning rate or add clipping."]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"RNN Variants for Forecasting"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"Several architectural choices matter for time series:"}),e.jsxs("ul",{className:"list-disc pl-6 mt-3 space-y-2 text-gray-700",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Many-to-one:"})," encode the entire history, predict a single future step."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Many-to-many:"})," at each step produce an output — useful for multi-step forecasting via teacher forcing."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Seq2Seq:"})," encoder RNN compresses history into a context vector; decoder RNN generates the forecast horizon autoregressively."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Stacked RNNs:"})," multiple RNN layers where each layer's hidden states feed the next, learning hierarchical temporal patterns."]})]}),e.jsx(p,{title:"RNN Limitations in Practice",children:"Even with clipping, vanilla RNNs struggle with dependencies beyond ~20 timesteps. For most real-world forecasting tasks with seasonality or long-range trends, prefer LSTM or GRU (next section) or Transformer-based architectures. Vanilla RNNs are primarily of historical and pedagogical interest."}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"PyTorch Implementation"}),e.jsx(u,{children:`import torch
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
`}),e.jsx(x,{title:"Why This RNN Will Struggle",children:e.jsxs("p",{children:["The sine wave has period ",e.jsx(t.InlineMath,{math:"2\\pi \\approx 6.28"})," steps in the data (roughly 63 samples over the full range). With a lookback of 50 and 2 RNN layers, the model has enough context to learn this short-range pattern. However, if we increased the period to 200+ samples, the RNN's vanishing gradient would prevent it from leveraging the full history — this is where LSTM shines."]})}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"Truncated BPTT"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["For very long sequences, full BPTT is computationally prohibitive (memory scales with ",e.jsx(t.InlineMath,{math:"T"}),").",e.jsx("strong",{children:"Truncated BPTT"})," splits the sequence into chunks of length ",e.jsx(t.InlineMath,{math:"k"})," and backpropagates only within each chunk, while carrying the hidden state forward:"]}),e.jsx(t.BlockMath,{math:"\\text{for } t = 1, k+1, 2k+1, \\ldots: \\quad \\text{forward } k \\text{ steps, backward } k \\text{ steps}"}),e.jsxs(c,{title:"Hidden State Detachment",children:["In PyTorch, use ",e.jsx("code",{children:"h = h.detach()"})," between chunks to stop gradients from flowing beyond the chunk boundary. This trades some gradient accuracy for constant memory usage regardless of sequence length."]}),e.jsx(f,{references:[{authors:"Rumelhart, D.E., Hinton, G.E., Williams, R.J.",year:1986,title:"Learning representations by back-propagating errors",venue:"Nature",url:"https://doi.org/10.1038/323533a0"},{authors:"Bengio, Y., Simard, P., Frasconi, P.",year:1994,title:"Learning long-term dependencies with gradient descent is difficult",venue:"IEEE Transactions on Neural Networks",url:"https://doi.org/10.1109/72.279181"},{authors:"Pascanu, R., Mikolov, T., Bengio, Y.",year:2013,title:"On the difficulty of training recurrent neural networks",venue:"ICML",url:"https://proceedings.mlr.press/v28/pascanu13.html"},{authors:"Hewamalage, H., Bergmeir, C., Bandara, K.",year:2021,title:"Recurrent Neural Networks for Time Series Forecasting: Current status and future directions",venue:"International Journal of Forecasting",url:"https://doi.org/10.1016/j.ijforecast.2020.06.008"}]})]})}const xe=Object.freeze(Object.defineProperty({__proto__:null,default:q},Symbol.toStringTag,{value:"Module"}));function C(){const[s,o]=h.useState(null),n=[{id:"forget",label:"Forget Gate",color:"#ef4444",x:80,desc:"Decides what fraction of the old cell state to keep. Output ∈ (0,1): 0 = forget everything, 1 = keep everything."},{id:"input",label:"Input Gate",color:"#3b82f6",x:200,desc:"Decides which new information to write to the cell state. Pair of sigmoid (how much) and tanh (what to write)."},{id:"output",label:"Output Gate",color:"#10b981",x:320,desc:"Decides what part of the cell state to expose as the hidden state h_t. Filtered version of cell state."}],i=n.find(r=>r.id===s);return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"LSTM Cell — Click a Gate to Learn More"}),e.jsx("div",{className:"flex gap-3 mb-4 flex-wrap",children:n.map(r=>e.jsx("button",{onClick:()=>o(s===r.id?null:r.id),className:`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${s===r.id?"text-white border-transparent":"bg-white text-gray-700"}`,style:s===r.id?{backgroundColor:r.color,borderColor:r.color}:{borderColor:r.color},children:r.label},r.id))}),e.jsxs("svg",{width:"440",height:"180",children:[e.jsx("line",{x1:"10",y1:"40",x2:"430",y2:"40",stroke:"#9ca3af",strokeWidth:3,strokeDasharray:"6 3"}),e.jsx("text",{x:"10",y:"25",fontSize:11,fill:"#6b7280",children:"Cell state C_t highway"}),n.map(r=>e.jsxs("g",{onClick:()=>o(s===r.id?null:r.id),style:{cursor:"pointer"},children:[e.jsx("circle",{cx:r.x,cy:40,r:22,fill:s===r.id?r.color:"#f3f4f6",stroke:r.color,strokeWidth:2.5}),e.jsx("text",{x:r.x,y:44,textAnchor:"middle",fontSize:12,fill:s===r.id?"white":r.color,fontWeight:"bold",children:r.id==="forget"?"f":r.id==="input"?"i":"o"}),e.jsx("line",{x1:r.x,y1:100,x2:r.x,y2:63,stroke:r.color,strokeWidth:1.5,markerEnd:"url(#garrow)"}),e.jsx("text",{x:r.x,y:118,textAnchor:"middle",fontSize:10,fill:"#64748b",children:"[h,x]"}),e.jsx("text",{x:r.x,y:155,textAnchor:"middle",fontSize:10,fill:r.color,children:r.label})]},r.id)),e.jsx("line",{x1:"320",y1:"40",x2:"420",y2:"90",stroke:"#10b981",strokeWidth:1.5}),e.jsx("text",{x:"425",y:"95",fontSize:11,fill:"#10b981",children:"h_t"}),e.jsx("defs",{children:e.jsx("marker",{id:"garrow",markerWidth:"7",markerHeight:"7",refX:"5",refY:"3",orient:"auto",children:e.jsx("path",{d:"M0,0 L0,6 L7,3 z",fill:"#64748b"})})})]}),i&&e.jsxs("div",{className:"mt-3 p-3 rounded-md text-sm text-gray-700 border-l-4",style:{borderColor:i.color,backgroundColor:i.color+"15"},children:[e.jsxs("strong",{children:[i.label,":"]})," ",i.desc]})]})}function B(){return e.jsxs(m,{title:"LSTM & GRU Architectures",difficulty:"advanced",readingTime:35,prerequisites:["Recurrent Neural Networks (s1)","Vanishing gradient problem"],children:[e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Long Short-Term Memory (LSTM) networks were introduced by Hochreiter & Schmidhuber in 1997 to solve the vanishing gradient problem. The key insight: instead of overwriting the hidden state at each step, maintain a separate ",e.jsx("strong",{children:"cell state"})," that flows through time nearly unchanged — a gradient highway that allows learning over hundreds of timesteps."]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"LSTM: The Four Equations"}),e.jsxs(d,{title:"LSTM Cell Equations",children:[e.jsxs("p",{className:"mb-2 text-sm text-gray-600",children:["Let ",e.jsx(t.InlineMath,{math:"[h_{t-1}, x_t]"})," denote the concatenation of previous hidden state and current input."]}),e.jsx(t.BlockMath,{math:"f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f) \\quad \\text{(forget gate)}"}),e.jsx(t.BlockMath,{math:"i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i) \\quad \\text{(input gate)}"}),e.jsx(t.BlockMath,{math:"\\tilde{C}_t = \\tanh(W_C [h_{t-1}, x_t] + b_C) \\quad \\text{(candidate cell)}"}),e.jsx(t.BlockMath,{math:"C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t \\quad \\text{(cell state update)}"}),e.jsx(t.BlockMath,{math:"o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o) \\quad \\text{(output gate)}"}),e.jsx(t.BlockMath,{math:"h_t = o_t \\odot \\tanh(C_t) \\quad \\text{(hidden state)}"})]}),e.jsx(C,{}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 mt-6 mb-3",children:"Why LSTM Solves the Vanishing Gradient"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["The cell state update ",e.jsx(t.InlineMath,{math:"C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t"})," has a critical property: the gradient flows through this additive connection without passing through any nonlinearity (other than the multiplicative forget gate). This is analogous to residual connections in ResNets."]}),e.jsxs(g,{title:"Gradient Flow Through Cell State",children:[e.jsxs("p",{children:["The gradient of the loss with respect to an earlier cell state ",e.jsx(t.InlineMath,{math:"C_k"})," is:"]}),e.jsx(t.BlockMath,{math:"\\frac{\\partial \\mathcal{L}}{\\partial C_k} = \\frac{\\partial \\mathcal{L}}{\\partial C_T} \\prod_{t=k+1}^{T} f_t"}),e.jsxs("p",{className:"mt-2",children:["Since ",e.jsx(t.InlineMath,{math:"f_t \\in (0, 1)"}),", this product can be small, but it degrades far more gracefully than the exponential decay in vanilla RNNs — especially when the forget gate learns to keep ",e.jsx(t.InlineMath,{math:"f_t \\approx 1"})," for relevant memory."]})]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"GRU: A Simplified Alternative"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"Gated Recurrent Units (GRU), introduced by Cho et al. (2014), achieve similar performance to LSTM with fewer parameters by merging the cell state and hidden state, and using only two gates:"}),e.jsxs(d,{title:"GRU Equations",children:[e.jsx(t.BlockMath,{math:"z_t = \\sigma(W_z [h_{t-1}, x_t] + b_z) \\quad \\text{(update gate)}"}),e.jsx(t.BlockMath,{math:"r_t = \\sigma(W_r [h_{t-1}, x_t] + b_r) \\quad \\text{(reset gate)}"}),e.jsx(t.BlockMath,{math:"\\tilde{h}_t = \\tanh(W [r_t \\odot h_{t-1}, x_t] + b) \\quad \\text{(candidate)}"}),e.jsx(t.BlockMath,{math:"h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t \\quad \\text{(output)}"})]}),e.jsxs("ul",{className:"list-disc pl-6 mt-4 space-y-2 text-gray-700",children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Update gate ",e.jsx(t.InlineMath,{math:"z_t"}),":"]})," interpolates between old hidden state and new candidate. When ",e.jsx(t.InlineMath,{math:"z_t \\approx 0"}),", the unit ignores the input and copies past state."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Reset gate ",e.jsx(t.InlineMath,{math:"r_t"}),":"]})," controls how much past hidden state contributes to the candidate. When ",e.jsx(t.InlineMath,{math:"r_t \\approx 0"}),", the candidate ignores history — effectively resetting the memory."]})]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"LSTM vs GRU Comparison"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm border-collapse border border-gray-300",children:[e.jsx("thead",{className:"bg-indigo-50",children:e.jsxs("tr",{children:[e.jsx("th",{className:"border border-gray-300 p-3 text-left",children:"Property"}),e.jsx("th",{className:"border border-gray-300 p-3 text-left",children:"LSTM"}),e.jsx("th",{className:"border border-gray-300 p-3 text-left",children:"GRU"})]})}),e.jsx("tbody",{children:[["Gates","3 (forget, input, output)","2 (update, reset)"],["States","Cell state + hidden state","Hidden state only"],["Parameters","4 × (d² + d·p)","3 × (d² + d·p)"],["Long-range memory","Explicit cell state highway","Implicit via update gate"],["Training speed","Slower (more params)","Faster"],["Typical performance","Slightly better on complex tasks","Competitive, often matches LSTM"],["When to prefer","Large datasets, complex patterns","Limited data, fast iteration"]].map(([s,o,n],i)=>e.jsxs("tr",{className:i%2===0?"bg-white":"bg-gray-50",children:[e.jsx("td",{className:"border border-gray-300 p-3 font-medium text-gray-700",children:s}),e.jsx("td",{className:"border border-gray-300 p-3 text-gray-600",children:o}),e.jsx("td",{className:"border border-gray-300 p-3 text-gray-600",children:n})]},i))})]})}),e.jsx(c,{title:"Rule of Thumb",children:"In practice, LSTM and GRU perform similarly on most forecasting benchmarks. Start with GRU if you want faster training and less tuning. Use LSTM if you have a very long context window (>200 steps) and sufficient data to train it."}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"Multi-Layer LSTM with Dropout"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Stacking multiple LSTM layers allows the network to learn hierarchical temporal representations. Layer ",e.jsx(t.InlineMath,{math:"l"})," receives the hidden states from layer ",e.jsx(t.InlineMath,{math:"l-1"})," as inputs:"]}),e.jsx(t.BlockMath,{math:"h_t^{(l)} = \\text{LSTM}(h_t^{(l-1)}, h_{t-1}^{(l)})"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:["Dropout in LSTMs requires care. Standard dropout applied to recurrent connections hurts because it introduces noise in the temporal direction. The solution is ",e.jsx("strong",{children:"variational dropout"})," (Gal & Ghahramani, 2016): use the same dropout mask at every timestep within a sequence. PyTorch's built-in ",e.jsx("code",{children:"dropout"})," parameter applies standard dropout only to the outputs of non-final layers, which is a reasonable approximation."]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"PyTorch Implementation: Multi-Step LSTM"}),e.jsx(u,{children:`import torch
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
`}),e.jsx(x,{title:"M4 Monthly Dataset Benchmark",children:e.jsx("p",{children:"On the M4 monthly dataset (100,000 time series, horizon H=18), a 2-layer LSTM with hidden size 128 typically achieves sMAPE around 13-15%, compared to the Naïve2 baseline of ~16% and ES-RNN winner of ~11.4%. The key is global training across all series — a single LSTM trained on all series outperforms per-series LSTM by a wide margin."})}),e.jsx(p,{title:"LSTM Hyperparameter Sensitivity",children:"LSTMs are sensitive to initialization and learning rate. Best practices: (1) Initialize forget gate bias to 1 to encourage memory retention early in training. (2) Use learning rate warmup. (3) Normalize inputs to zero mean, unit variance. (4) Consider instance normalization (reversible IN) if series have varying scales."}),e.jsx(f,{references:[{authors:"Hochreiter, S., Schmidhuber, J.",year:1997,title:"Long Short-Term Memory",venue:"Neural Computation",url:"https://doi.org/10.1162/neco.1997.9.8.1735"},{authors:"Cho, K. et al.",year:2014,title:"Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation",venue:"EMNLP",url:"https://arxiv.org/abs/1406.1078"},{authors:"Gal, Y., Ghahramani, Z.",year:2016,title:"A Theoretically Grounded Application of Dropout in Recurrent Neural Networks",venue:"NeurIPS",url:"https://arxiv.org/abs/1512.05287"},{authors:"Smyl, S.",year:2020,title:"A hybrid method of exponential smoothing and recurrent neural networks for time series forecasting",venue:"International Journal of Forecasting",url:"https://doi.org/10.1016/j.ijforecast.2019.03.017"}]})]})}const fe=Object.freeze(Object.defineProperty({__proto__:null,default:B},Symbol.toStringTag,{value:"Module"}));function E(){const[s,o]=h.useState(0),n=[{label:"Encode inputs",desc:"The encoder LSTM processes x₁,…,xT step by step. At every step it produces a hidden state hᵢ. All hidden states are retained — not only the final one."},{label:"Compute alignment scores",desc:"At decoder step t, an alignment score e(sₜ₋₁, hᵢ) measures how relevant encoder state hᵢ is to the current decoding context. Common choices: dot-product or additive (Bahdanau) scoring."},{label:"Softmax weights",desc:"Scores are normalized with softmax to produce attention weights αᵢ ∈ (0,1) that sum to 1. High αᵢ tells the decoder to focus on encoder position i."},{label:"Context vector",desc:"A context vector cₜ = Σ αᵢ hᵢ is formed as a weighted combination of all encoder states. It summarizes the most relevant past information."},{label:"Decode & predict",desc:"The decoder combines cₜ with its own recurrent state sₜ and produces the forecast ŷₜ. Steps 2–5 repeat for every horizon step H."}];return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"Attention in Seq2Seq — Step by Step"}),e.jsx("div",{className:"flex gap-2 mb-4 flex-wrap",children:n.map((i,r)=>e.jsxs("button",{onClick:()=>o(r),className:`px-3 py-1 rounded text-sm font-medium border transition-all ${s===r?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`,children:[r+1,". ",i.label]},r))}),e.jsx("div",{className:"p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900",children:n[s].desc}),e.jsxs("div",{className:"mt-4 flex items-center gap-3 flex-wrap",children:[e.jsx("div",{className:"flex gap-1",children:["h₁","h₂","h₃","h₄"].map((i,r)=>e.jsx("div",{className:`w-10 h-10 rounded flex items-center justify-center text-xs font-mono border-2 transition-all ${s>=2?"bg-green-100 border-green-400 text-green-800":"bg-gray-100 border-gray-300 text-gray-600"}`,children:i},r))}),e.jsx("div",{className:"text-gray-400 text-lg",children:"→"}),e.jsx("div",{className:`w-12 h-10 rounded flex items-center justify-center text-xs font-mono border-2 transition-all ${s>=3?"bg-orange-100 border-orange-400 text-orange-800":"bg-gray-100 border-gray-300 text-gray-600"}`,children:"cₜ"}),e.jsx("div",{className:"text-gray-400 text-lg",children:"→"}),e.jsx("div",{className:`w-12 h-10 rounded flex items-center justify-center text-xs font-mono border-2 transition-all ${s>=4?"bg-purple-100 border-purple-400 text-purple-800":"bg-gray-100 border-gray-300 text-gray-600"}`,children:"ŷₜ"})]})]})}const R=`import torch
import torch.nn as nn
from neuralforecast import NeuralForecast
from neuralforecast.models import MQRNN
from neuralforecast.losses.pytorch import MQLoss
import pandas as pd
import numpy as np

# ── 1. Toy panel dataset ───────────────────────────────────────────────────
np.random.seed(42)
n_series, T = 50, 120
records = []
for uid in range(n_series):
    dates = pd.date_range('2019-01-01', periods=T, freq='W')
    trend    = np.linspace(0, 2, T)
    seasonal = np.sin(2 * np.pi * np.arange(T) / 52)
    noise    = 0.3 * np.random.randn(T)
    y = 100 + 20 * trend + 10 * seasonal + noise
    for d, v in zip(dates, y):
        records.append({'unique_id': f'series_{uid}', 'ds': d, 'y': float(v)})

df = pd.DataFrame(records)

# ── 2. MQRNN model (encoder-decoder with quantile outputs) ─────────────────
horizon = 12
model = MQRNN(
    h=horizon,
    max_steps=300,
    encoder_hidden_size=64,
    encoder_n_layers=2,
    decoder_hidden_size=64,
    decoder_layers=2,
    loss=MQLoss(level=[10, 50, 90]),
    input_size=3 * horizon,        # look-back = 36 weeks
    learning_rate=1e-3,
    batch_size=32,
    random_seed=42,
)

nf = NeuralForecast(models=[model], freq='W')
nf.fit(df)
forecasts = nf.predict()
print(forecasts.head())
# Columns: unique_id, ds, MQRNN-lo-10, MQRNN-median, MQRNN-hi-90

# ── 3. Manual PyTorch Seq2Seq with additive attention ─────────────────────
class Seq2SeqForecaster(nn.Module):
    """Encoder-LSTM + Decoder-LSTM with Bahdanau attention."""

    def __init__(self, input_size=1, hidden=64, horizon=12):
        super().__init__()
        self.horizon = horizon
        self.encoder = nn.LSTM(input_size, hidden, batch_first=True)
        self.decoder = nn.LSTM(1, hidden, batch_first=True)
        self.attn_W  = nn.Linear(hidden * 2, hidden)
        self.attn_v  = nn.Linear(hidden, 1, bias=False)
        self.fc_out  = nn.Linear(hidden, 1)

    def attention(self, s, enc_out):
        # s: (B, 1, H)  enc_out: (B, T, H)
        s_exp  = s.expand_as(enc_out)
        score  = self.attn_v(torch.tanh(self.attn_W(torch.cat([s_exp, enc_out], -1))))
        alpha  = torch.softmax(score, dim=1)           # (B, T, 1)
        ctx    = (alpha * enc_out).sum(dim=1, keepdim=True)
        return ctx

    def forward(self, x, teacher_forcing_ratio=0.5, target=None):
        enc_out, (h, c) = self.encoder(x)
        dec_in = x[:, -1:, :]       # start token = last observation
        preds  = []
        for t in range(self.horizon):
            dec_out, (h, c) = self.decoder(dec_in, (h, c))
            ctx  = self.attention(dec_out, enc_out)
            pred = self.fc_out(dec_out + ctx)          # (B, 1, 1)
            preds.append(pred)
            use_tf = (target is not None and
                      torch.rand(1).item() < teacher_forcing_ratio)
            dec_in = target[:, t:t+1, :] if use_tf else pred
        return torch.cat(preds, dim=1).squeeze(-1)     # (B, H)

model_pt = Seq2SeqForecaster(input_size=1, hidden=64, horizon=12)
x_dummy  = torch.randn(8, 36, 1)
print("Output shape:", model_pt(x_dummy).shape)   # torch.Size([8, 12])
`;function P(){return e.jsxs(m,{title:"Seq2Seq and Encoder-Decoder Architectures",difficulty:"advanced",readingTime:14,children:[e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Sequence-to-sequence (Seq2Seq) models separate the task of"," ",e.jsx("em",{children:"reading"})," historical data from the task of ",e.jsx("em",{children:"generating"})," future values. Originally developed for machine translation, they became a natural fit for multi-step time-series forecasting because they handle variable-length inputs and outputs without requiring a fixed horizon at model definition time."]}),e.jsxs(d,{title:"Encoder-Decoder Architecture",children:["An encoder-decoder model consists of two recurrent networks. The"," ",e.jsx("strong",{children:"encoder"})," maps an input sequence"," ",e.jsx(t.InlineMath,{math:"x_1, \\dots, x_T"})," to a context representation"," ",e.jsx(t.InlineMath,{math:"\\mathbf{c}"}),". The ",e.jsx("strong",{children:"decoder"})," then auto-regressively generates the forecast"," ",e.jsx(t.InlineMath,{math:"\\hat{y}_1, \\dots, \\hat{y}_H"})," conditioned on"," ",e.jsx(t.InlineMath,{math:"\\mathbf{c}"})," and previously generated values."]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"The Information Bottleneck Problem"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["In the vanilla Seq2Seq design the encoder compresses the entire input history into a ",e.jsx("em",{children:"single"}),' fixed-size vector — its final hidden state. For long sequences this creates an information bottleneck: early time steps get "forgotten" before the decoder begins. The attention mechanism eliminates this bottleneck by giving the decoder direct access to'," ",e.jsx("em",{children:"all"})," encoder hidden states."]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Attention Mechanism"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mb-4",children:["Bahdanau et al. (2015) introduced additive attention. At decoder step"," ",e.jsx(t.InlineMath,{math:"t"}),", an alignment score between the previous decoder state ",e.jsx(t.InlineMath,{math:"\\mathbf{s}_{t-1}"})," and encoder state"," ",e.jsx(t.InlineMath,{math:"\\mathbf{h}_i"})," is computed:"]}),e.jsx(t.BlockMath,{math:"e_{ti} = \\mathbf{v}^\\top \\tanh\\!\\bigl(\\mathbf{W}_1\\,\\mathbf{s}_{t-1} + \\mathbf{W}_2\\,\\mathbf{h}_i\\bigr)"}),e.jsx("p",{className:"text-gray-700 leading-relaxed mt-4 mb-4",children:"Scores are normalized with softmax to obtain attention weights:"}),e.jsx(t.BlockMath,{math:"\\alpha_{ti} = \\frac{\\exp(e_{ti})}{\\sum_{j=1}^{T}\\exp(e_{tj})}"}),e.jsx("p",{className:"text-gray-700 leading-relaxed mt-4 mb-2",children:"The context vector is the weighted sum of all encoder states:"}),e.jsx(t.BlockMath,{math:"\\mathbf{c}_t = \\sum_{i=1}^{T} \\alpha_{ti}\\,\\mathbf{h}_i"}),e.jsx(E,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Teacher Forcing"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["During training, the decoder can receive either its own previous prediction ",e.jsx(t.InlineMath,{math:"\\hat{y}_{t-1}"})," or the true ground-truth value ",e.jsx(t.InlineMath,{math:"y_{t-1}"})," as input for the next step. Using ground-truth inputs is called ",e.jsx("strong",{children:"teacher forcing"}),". It accelerates convergence by providing clean gradients, but creates a mismatch between training and inference — at test time, true values are unavailable and errors can compound."]}),e.jsxs(p,{title:"Exposure Bias",children:["With a 100% teacher-forcing ratio the model never learns to recover from its own prediction errors. A common remedy is ",e.jsx("em",{children:"scheduled sampling"}),": start with high teacher-forcing probability and linearly decay it over training so the model progressively learns to condition on its own outputs."]}),e.jsxs(g,{title:"MQRNN: Multi-Quantile RNN",children:[e.jsx("p",{children:"Wen et al. (2017) proposed MQRNN with two key design choices over vanilla Seq2Seq:"}),e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Global encoder, local decoder:"})," one shared encoder LSTM processes the look-back window; a lightweight MLP decoder is applied independently per horizon step, enabling fully parallel decoding."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Simultaneous quantile outputs:"})," a single forward pass produces forecasts at multiple quantile levels via the pinball loss:"]})]}),e.jsx(t.BlockMath,{math:"\\mathcal{L}_q(\\hat{y}, y) = \\max\\!\\bigl(q(y - \\hat{y}),\\;(q-1)(y - \\hat{y})\\bigr)"}),e.jsx("p",{className:"text-sm mt-2",children:"The parallel decoder makes MQRNN significantly faster than auto-regressive decoders for long horizons."})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Global vs. Local Training"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Seq2Seq models for production forecasting are trained on panels of many time series simultaneously. The encoder learns"," ",e.jsx("em",{children:"global patterns"})," shared across all series (seasonality shapes, trend dynamics), while per-series embeddings concatenated at the decoder capture ",e.jsx("em",{children:"local characteristics"}),". This global-local design is central to both MQRNN and DeepAR and allows zero-shot forecasting on new series with similar dynamics."]}),e.jsx(x,{title:"Choosing Input Window vs. Horizon",children:e.jsxs("p",{className:"text-sm text-gray-700",children:["A practical rule is to set the encoder look-back to"," ",e.jsx(t.InlineMath,{math:"2\\text{–}3\\times H"})," where ",e.jsx(t.InlineMath,{math:"H"})," ","is the forecast horizon. For weekly data with a 12-step horizon, a look-back of 24–36 steps covers at least one full seasonal cycle while keeping the encoder compact. Using too short a look-back discards seasonal information; too long a window adds computation without commensurate accuracy improvement."]})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Covariates in Encoder-Decoder Models"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"A key advantage of the Seq2Seq framework is the ability to incorporate covariates naturally:"}),e.jsxs("ul",{className:"list-disc ml-6 mt-2 space-y-1 text-gray-700 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Past covariates"})," (e.g., lagged promotions, weather actuals) are concatenated with the target at encoder input time steps."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Future known covariates"})," (e.g., planned promotions, calendar features) are fed to the decoder at each step, allowing the model to condition its forecast on known future information."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Static metadata"})," (e.g., product category, store region) is projected to an embedding and concatenated at every time step of both encoder and decoder."]})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Implementation"}),e.jsx(u,{code:R}),e.jsx(c,{title:"When to Use Seq2Seq Models",children:e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm",children:[e.jsxs("li",{children:["You need ",e.jsx("strong",{children:"multi-step probabilistic"})," forecasts (quantile or sample-based outputs)."]}),e.jsx("li",{children:"You have a large panel (hundreds to thousands of series) to train on jointly."}),e.jsx("li",{children:"You need to incorporate future known covariates (promotions, holidays) into the decoder."}),e.jsxs("li",{children:["For very long horizons (",">"," 100 steps), consider Transformer-based architectures that model long-range dependencies more efficiently via self-attention."]})]})}),e.jsx(f,{references:[{author:"Sutskever, I., Vinyals, O., & Le, Q. V.",year:2014,title:"Sequence to Sequence Learning with Neural Networks",venue:"NeurIPS"},{author:"Bahdanau, D., Cho, K., & Bengio, Y.",year:2015,title:"Neural Machine Translation by Jointly Learning to Align and Translate",venue:"ICLR"},{author:"Wen, R., et al.",year:2017,title:"A Multi-Horizon Quantile Recurrent Forecaster",venue:"NeurIPS Time Series Workshop"},{author:"Salinas, D., Flunkert, V., Gasthaus, J., & Januschowski, T.",year:2020,title:"DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks",venue:"International Journal of Forecasting"}]})]})}const ge=Object.freeze(Object.defineProperty({__proto__:null,default:P},Symbol.toStringTag,{value:"Module"}));function H(){const[s,o]=h.useState(0),n=["Generic Stack 1","Generic Stack 2","Seasonality Stack","Trend Stack"],i=["#6366f1","#8b5cf6","#f59e0b","#10b981"];return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"N-BEATS Doubly Residual Stack"}),e.jsx("div",{className:"flex gap-2 mb-4 flex-wrap",children:n.map((r,a)=>e.jsx("button",{onClick:()=>o(a),className:`px-3 py-1 rounded text-sm border-2 transition-all ${s===a?"text-white":"bg-white text-gray-700"}`,style:s===a?{backgroundColor:i[a],borderColor:i[a]}:{borderColor:i[a]},children:r},a))}),e.jsxs("svg",{width:"100%",viewBox:"0 0 500 230",style:{maxWidth:500},children:[e.jsx("rect",{x:"10",y:"95",width:"80",height:"40",rx:"6",fill:"#f1f5f9",stroke:"#94a3b8",strokeWidth:"1.5"}),e.jsx("text",{x:"50",y:"119",textAnchor:"middle",fontSize:"11",fill:"#475569",children:"Input x"}),n.map((r,a)=>e.jsxs("g",{opacity:s===a?1:.4,children:[e.jsx("rect",{x:110+a*90,y:"80",width:"70",height:"70",rx:"8",fill:s===a?i[a]:"#f3f4f6",stroke:i[a],strokeWidth:"2"}),e.jsx("text",{x:145+a*90,y:"108",textAnchor:"middle",fontSize:"10",fill:s===a?"white":i[a],fontWeight:"bold",children:"Block"}),e.jsx("text",{x:145+a*90,y:"122",textAnchor:"middle",fontSize:"9",fill:s===a?"white":"#6b7280",children:a+1}),e.jsx("line",{x1:145+a*90,y1:"80",x2:145+a*90,y2:"45",stroke:i[a],strokeWidth:"1.5",markerEnd:"url(#nb-arrow)"}),e.jsx("text",{x:145+a*90,y:"38",textAnchor:"middle",fontSize:"9",fill:i[a],children:"backcast"}),e.jsx("line",{x1:145+a*90,y1:"150",x2:145+a*90,y2:"185",stroke:i[a],strokeWidth:"1.5",markerEnd:"url(#nb-arrow)"}),e.jsx("text",{x:145+a*90,y:"198",textAnchor:"middle",fontSize:"9",fill:i[a],children:"forecast"}),a<n.length-1&&e.jsx("line",{x1:180+a*90,y1:"115",x2:110+(a+1)*90,y2:"115",stroke:"#9ca3af",strokeWidth:"1.5",strokeDasharray:"3 2",markerEnd:"url(#nb-arrow)"})]},a)),e.jsx("defs",{children:e.jsx("marker",{id:"nb-arrow",markerWidth:"7",markerHeight:"7",refX:"5",refY:"3",orient:"auto",children:e.jsx("path",{d:"M0,0 L0,6 L7,3 z",fill:"#64748b"})})})]}),e.jsx("p",{className:"text-xs text-gray-500 mt-2",children:"Each block produces a backcast (residual subtracted from input) and a forecast (added to output sum). The residual connection forces each block to focus on unexplained signal."})]})}function W(){return e.jsxs(m,{title:"N-BEATS: Neural Basis Expansion Analysis for Interpretable Time Series Forecasting",difficulty:"advanced",readingTime:40,prerequisites:["Deep learning fundamentals","Time series decomposition","Residual networks"],children:[e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["N-BEATS (Oreshkin et al., ICLR 2020) was a landmark paper: a purely feed-forward neural network — no recurrence, no attention — that set new state-of-the-art on M4 and M3 benchmarks. Its elegance lies in a ",e.jsx("strong",{children:"doubly residual architecture"})," where blocks progressively refine forecasts by subtracting what each block can explain."]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"Core Architecture: The Block"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"The fundamental building block of N-BEATS is deceptively simple: a stack of fully-connected layers followed by two linear projections:"}),e.jsxs(d,{title:"N-BEATS Block",children:[e.jsxs("p",{className:"mb-2",children:["Given input ",e.jsx(t.InlineMath,{math:"x \\in \\mathbb{R}^T"})," (lookback window):"]}),e.jsx(t.BlockMath,{math:"\\mathbf{h} = \\text{FC}_4(\\text{FC}_3(\\text{FC}_2(\\text{FC}_1(x))))"}),e.jsx(t.BlockMath,{math:"\\hat{x} = V_b \\, \\theta_b, \\quad \\theta_b = \\text{Linear}_b(\\mathbf{h})"}),e.jsx(t.BlockMath,{math:"\\hat{y} = V_f \\, \\theta_f, \\quad \\theta_f = \\text{Linear}_f(\\mathbf{h})"}),e.jsxs("p",{className:"mt-2",children:["where ",e.jsx(t.InlineMath,{math:"\\hat{x} \\in \\mathbb{R}^T"})," is the ",e.jsx("strong",{children:"backcast"})," (reconstruction of the input) and ",e.jsx(t.InlineMath,{math:"\\hat{y} \\in \\mathbb{R}^H"})," is the ",e.jsx("strong",{children:"forecast"}),".",e.jsx(t.InlineMath,{math:"V_b, V_f"})," are basis matrices defined by the block type."]})]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"Doubly Residual Stacking"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"Blocks are organized into stacks, and stacks are chained. The residual mechanism:"}),e.jsx(t.BlockMath,{math:"x^{(l+1)} = x^{(l)} - \\hat{x}^{(l)} \\quad \\text{(residual input to next block)}"}),e.jsx(t.BlockMath,{math:"\\hat{y}_{\\text{total}} = \\sum_{l=1}^{L} \\hat{y}^{(l)} \\quad \\text{(sum of block forecasts)}"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:['This "doubly residual" design forces each successive block to model only what previous blocks failed to explain — a form of ',e.jsx("strong",{children:"boosting in function space"})," rather than just adding residual skip connections."]}),e.jsx(H,{}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"Generic vs. Interpretable Variants"}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 mt-5 mb-2",children:"Generic N-BEATS"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["In the generic version, ",e.jsx(t.InlineMath,{math:"V_b"})," and ",e.jsx(t.InlineMath,{math:"V_f"})," are learned linear layers — no human-specified structure. The expansion coefficients ",e.jsx(t.InlineMath,{math:"\\theta"})," are projected to the forecast via:"]}),e.jsx(t.BlockMath,{math:"V_f \\in \\mathbb{R}^{H \\times p}, \\quad \\hat{y} = V_f \\theta_f"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-2",children:["where ",e.jsx(t.InlineMath,{math:"p \\ll H"})," is the number of expansion coefficients. This is a",e.jsx("strong",{children:" bottleneck"})," that regularizes the forecast."]}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 mt-5 mb-2",children:"Interpretable N-BEATS"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"The interpretable version uses domain-knowledge basis functions — this is where the model becomes truly elegant:"}),e.jsxs(d,{title:"Polynomial Trend Basis",children:[e.jsx(t.BlockMath,{math:"V_f^{\\text{trend}}[t, p] = \\left(\\frac{t}{H}\\right)^p, \\quad t = 1,\\ldots,H,\\; p = 0,\\ldots,P"}),e.jsxs("p",{className:"mt-2",children:["Each column is a polynomial basis function evaluated at forecast time points",e.jsx(t.InlineMath,{math:"t / H"})," for ",e.jsx(t.InlineMath,{math:"t = 1, \\ldots, H"}),". With",e.jsx(t.InlineMath,{math:"P = 2"}),", this produces constant + linear + quadratic trend components."]})]}),e.jsxs(d,{title:"Fourier Seasonality Basis",children:[e.jsx(t.BlockMath,{math:"V_f^{\\text{season}}[t, 2k-1] = \\cos\\!\\left(\\frac{2\\pi k t}{H}\\right), \\quad V_f^{\\text{season}}[t, 2k] = \\sin\\!\\left(\\frac{2\\pi k t}{H}\\right)"}),e.jsxs("p",{className:"mt-2",children:["Fourier basis functions for seasonality with ",e.jsx(t.InlineMath,{math:"K"})," harmonics. The network learns ",e.jsx("em",{children:"amplitudes"})," ",e.jsx(t.InlineMath,{math:"\\theta_f"}),", while the frequencies are fixed — interpretable because you can read off seasonal components."]})]}),e.jsx(x,{title:"Interpretability in Action",children:e.jsxs("p",{children:["After training, you can decompose any forecast as:",e.jsx(t.InlineMath,{math:"\\hat{y} = \\hat{y}_{\\text{trend}} + \\hat{y}_{\\text{seasonality}}"}),". The trend stack's output tells you the growth/decay direction; the seasonality stack's output shows the periodic component. This rivals STL decomposition but is learned end-to-end."]})}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"Why No Recurrence?"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"N-BEATS challenges the assumption that sequential architectures are necessary for time series. The lookback window provides a fixed-size context, and fully-connected layers with sufficient capacity can capture temporal dependencies within that window. Key advantages:"}),e.jsxs("ul",{className:"list-disc pl-6 mt-3 space-y-2 text-gray-700",children:[e.jsx("li",{children:"Fully parallelizable — no sequential computation bottleneck"}),e.jsx("li",{children:"Easier to train (no vanishing gradient through time)"}),e.jsx("li",{children:"Interpretable decomposition (interpretable version)"}),e.jsx("li",{children:"Strong inductive bias through basis expansion"})]}),e.jsxs(c,{title:"NBEATSx: Extension with Exogenous Variables",children:["The NBEATSx extension (Lopez-Ordoñez et al., 2022) adds exogenous covariates by modifying the block input to include both the target lookback window and covariate time series. Available in ",e.jsx("code",{children:"neuralforecast"})," as ",e.jsx("code",{children:"NBEATSx"}),"."]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800 mt-8 mb-4",children:"Python: N-BEATS with neuralforecast"}),e.jsx(u,{children:`import pandas as pd
import numpy as np
from neuralforecast import NeuralForecast
from neuralforecast.models import NBEATS, NBEATSx
from neuralforecast.losses.pytorch import MAE, MQLoss
from datasetsforecast.m4 import M4

# ── Load M4 monthly data ───────────────────────────────────────────────────────
train_df, *_ = M4.load(directory='data', group='Monthly')
# Long format: columns = ['unique_id', 'ds', 'y']
print(train_df.head())
print(f"Series: {train_df['unique_id'].nunique()}, Rows: {len(train_df)}")

# ── Basic N-BEATS (Generic) ───────────────────────────────────────────────────
nf = NeuralForecast(
    models=[
        NBEATS(
            h=18,                     # Forecast horizon (M4 monthly = 18 months)
            input_size=2 * 18,        # Lookback = 2x horizon
            stack_types=['generic', 'generic', 'generic'],  # 3 generic stacks
            n_blocks=[1, 1, 1],       # 1 block per stack
            mlp_units=[[512, 512], [512, 512], [512, 512]],  # 4 FC layers of 512
            n_harmonics=0,            # Only used for seasonality stacks
            n_polynomials=0,          # Only used for trend stacks
            max_steps=1000,
            learning_rate=1e-3,
            batch_size=1024,
            loss=MAE(),
            scaler_type='standard',   # Normalize per-series
            random_seed=42,
        )
    ],
    freq='M',
)
nf.fit(df=train_df)
preds = nf.predict()
print(preds.head())

# ── Interpretable N-BEATS ─────────────────────────────────────────────────────
nf_interp = NeuralForecast(
    models=[
        NBEATS(
            h=18,
            input_size=36,
            stack_types=['trend', 'seasonality'],  # Interpretable decomposition
            n_blocks=[3, 3],           # 3 blocks per stack
            mlp_units=[[256, 256], [256, 256]],
            n_polynomials=2,           # Degree of trend polynomial
            n_harmonics=2,             # Number of Fourier harmonics
            max_steps=1000,
            loss=MAE(),
        )
    ],
    freq='M',
)
nf_interp.fit(df=train_df)

# ── N-BEATSx with exogenous covariates ────────────────────────────────────────
# Suppose we have a 'price_index' covariate
train_with_cov = train_df.copy()
train_with_cov['price_index'] = np.random.randn(len(train_df))  # Placeholder

nf_x = NeuralForecast(
    models=[
        NBEATSx(
            h=18,
            input_size=36,
            futr_exog_list=['price_index'],   # Known in forecast horizon
            hist_exog_list=[],                # Only in historical window
            stack_types=['generic'],
            n_blocks=[3],
            mlp_units=[[512, 512]],
            max_steps=500,
            loss=MAE(),
        )
    ],
    freq='M',
)
nf_x.fit(df=train_with_cov)

# ── AutoNBEATS: Hyperparameter search ─────────────────────────────────────────
from neuralforecast.auto import AutoNBEATS
from ray import tune

nf_auto = NeuralForecast(
    models=[
        AutoNBEATS(
            h=18,
            config={
                'input_size': tune.choice([36, 72, 144]),
                'learning_rate': tune.loguniform(1e-4, 1e-2),
                'n_blocks': tune.choice([[1, 1], [3, 3], [3, 3, 3]]),
                'stack_types': tune.choice([
                    ['generic', 'generic'],
                    ['trend', 'seasonality'],
                ]),
            },
            num_samples=20,   # Trials
            refit_with_val=True,
        )
    ],
    freq='M',
)
nf_auto.fit(df=train_df)
`}),e.jsx(p,{title:"Input Size Matters",children:"N-BEATS is sensitive to the ratio of input size (lookback) to horizon. The authors recommend input_size = 2H to 5H. Too short a lookback and the model lacks context; too long and it adds noise. For daily data with weekly seasonality, try input_size = 7H."}),e.jsx(f,{references:[{authors:"Oreshkin, B.N., Carpov, D., Chapados, N., Bengio, Y.",year:2020,title:"N-BEATS: Neural basis expansion analysis for interpretable time series forecasting",venue:"ICLR 2020",url:"https://arxiv.org/abs/1905.10437"},{authors:"Lopez-Ordoñez, G. et al.",year:2022,title:"N-BEATSx: Neural basis expansion analysis with exogenous variables",venue:"International Journal of Forecasting",url:"https://arxiv.org/abs/2104.05522"},{authors:"Makridakis, S. et al.",year:2020,title:"The M4 Competition: 100,000 time series and 61 forecasting methods",venue:"International Journal of Forecasting",url:"https://doi.org/10.1016/j.ijforecast.2019.04.014"}]})]})}const ye=Object.freeze(Object.defineProperty({__proto__:null,default:W},Symbol.toStringTag,{value:"Module"})),D=[{model:"N-BEATS",ETTh1:.406,ETTm2:.279,Exchange:.088},{model:"N-HiTS",ETTh1:.398,ETTm2:.259,Exchange:.079},{model:"Autoformer",ETTh1:.449,ETTm2:.327,Exchange:.197},{model:"Informer",ETTh1:.865,ETTm2:.365,Exchange:.847}];function G(){const[s,o]=h.useState("ETTh1");return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"Long-Horizon MAE Comparison (lower is better)"}),e.jsx("div",{className:"flex gap-2 mb-4 flex-wrap",children:["ETTh1","ETTm2","Exchange"].map(n=>e.jsx("button",{onClick:()=>o(n),className:`px-3 py-1 rounded text-sm border transition-all ${s===n?"bg-indigo-600 text-white border-indigo-600":"bg-white text-gray-700 border-gray-300 hover:border-indigo-400"}`,children:n},n))}),e.jsx(j,{width:"100%",height:220,children:e.jsxs(A,{data:D,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(T,{strokeDasharray:"3 3"}),e.jsx(N,{dataKey:"model",tick:{fontSize:12}}),e.jsx(v,{tick:{fontSize:12},domain:[0,"auto"]}),e.jsx(w,{formatter:n=>n.toFixed(3)}),e.jsx(I,{dataKey:s,fill:"#6366f1",radius:[4,4,0,0]})]})}),e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"Approximate values from Challu et al. (2023). Horizon = 720 steps."})]})}const O=`from neuralforecast import NeuralForecast
from neuralforecast.models import NHITS
from neuralforecast.losses.pytorch import MAE, MQLoss
import pandas as pd
import numpy as np

# ── 1. Dataset ─────────────────────────────────────────────────────────────
# Long-horizon experiment: ETT (Electricity Transformer Temperature) format
np.random.seed(0)
T = 2000
dates = pd.date_range('2016-07-01', periods=T, freq='h')
# Simulate ETT-like signal: daily + weekly seasonality
t  = np.arange(T)
y  = (10 * np.sin(2 * np.pi * t / 24) +
      5  * np.sin(2 * np.pi * t / (24 * 7)) +
      0.5 * np.random.randn(T))
df = pd.DataFrame({'unique_id': 'ETT', 'ds': dates, 'y': y})

# ── 2. N-HiTS model ────────────────────────────────────────────────────────
# n_freq_downsample: pooling factors at each stack — key N-HiTS hyperparameter.
# A value of [24, 12, 1] means stack 0 downsamples by 24x (captures slow trends),
# stack 1 by 12x (medium patterns), stack 2 by 1x (high-frequency residuals).

horizon = 720   # long-horizon forecasting (30 days of hourly data)

model = NHITS(
    h=horizon,
    input_size=5 * horizon,           # large look-back for long horizons
    n_freq_downsample=[24, 12, 1],    # multi-rate sampling
    mlp_units=[[512, 512]] * 3,       # MLP per stack
    n_blocks=[1, 1, 1],
    n_pool_kernel_size=[2, 2, 1],
    interpolation_mode='linear',      # hierarchical interpolation
    loss=MAE(),
    max_steps=1000,
    learning_rate=1e-3,
    batch_size=32,
    random_seed=42,
)

nf = NeuralForecast(models=[model], freq='h')
nf.fit(df)
pred = nf.predict()
print(pred.head())

# ── 3. Probabilistic N-HiTS ────────────────────────────────────────────────
model_prob = NHITS(
    h=horizon,
    input_size=5 * horizon,
    n_freq_downsample=[24, 12, 1],
    loss=MQLoss(level=[10, 50, 90]),  # quantile outputs
    max_steps=500,
)
nf_prob = NeuralForecast(models=[model_prob], freq='h')
nf_prob.fit(df)
pred_prob = nf_prob.predict()
# Columns: NHITS-lo-10, NHITS-median, NHITS-hi-90

# ── 4. N-HiTS vs N-BEATS: key difference ──────────────────────────────────
# N-BEATS uses a fixed look-back and plain FC stacks.
# N-HiTS adds:
#  (a) MaxPool downsampling before each stack (multi-rate input)
#  (b) Explicit output interpolation (upsampling from coarse to fine grid)
# These two changes reduce parameter count and dramatically improve
# long-horizon accuracy — often 20-50% lower MAE on benchmarks like ETT.

from neuralforecast.models import NBEATS
model_nbeats = NBEATS(
    h=horizon,
    input_size=2 * horizon,
    n_harmonics=2,
    n_trend_blocks=3,
    n_seasonality_blocks=3,
    loss=MAE(),
    max_steps=500,
)
print("N-BEATS parameters:", sum(p.numel() for p in model_nbeats.parameters()))
print("N-HiTS  parameters:", sum(p.numel() for p in model.parameters()))
`;function V(){return e.jsxs(m,{title:"N-HiTS: Hierarchical Interpolation for Time Series",difficulty:"advanced",readingTime:13,children:[e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["N-HiTS (Neural Hierarchical Interpolation for Time Series) extends N-BEATS with two key innovations — ",e.jsx("em",{children:"multi-rate signal sampling"})," and"," ",e.jsx("em",{children:"hierarchical interpolation"})," — that make it particularly effective for long-horizon forecasting while using far fewer parameters than Transformer-based models."]}),e.jsxs(d,{title:"N-HiTS Architecture",children:["N-HiTS stacks multiple forecasting blocks, each operating at a different temporal resolution. Each block receives a ",e.jsx("em",{children:"downsampled"})," version of the input (via MaxPool), produces a coarse-resolution output, and uses linear interpolation to upsample it back to the full forecast horizon. The final forecast is the sum of all block outputs."]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Multi-Rate Input Sampling"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Vanilla N-BEATS passes the same full-resolution input to every stack. N-HiTS applies a MaxPool layer with kernel size ",e.jsx(t.InlineMath,{math:"k_s"})," before each stack ",e.jsx(t.InlineMath,{math:"s"}),", reducing the effective sampling rate. This mirrors the idea of a"," ",e.jsx("em",{children:"multi-rate signal processing"})," filterbank:"]}),e.jsx(t.BlockMath,{math:"\\tilde{x}^{(s)} = \\text{MaxPool}_{k_s}(x)"}),e.jsx("p",{className:"text-gray-700 leading-relaxed mt-3",children:"The first stack sees heavily downsampled input (low frequency / slow trend), the last stack sees full-resolution input (high frequency / residuals). This decomposition is explicit and inductive, unlike N-BEATS which learns the decomposition implicitly."}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Hierarchical Interpolation"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mb-4",children:["Each block produces an output at a"," ",e.jsx("em",{children:"coarser temporal resolution"})," — specifically"," ",e.jsx(t.InlineMath,{math:"\\lceil H / r_s \\rceil"})," points, where"," ",e.jsx(t.InlineMath,{math:"r_s"})," is the downsampling ratio of stack"," ",e.jsx(t.InlineMath,{math:"s"}),". The coarse output is then interpolated (linearly or nearest-neighbor) back to the full horizon length"," ",e.jsx(t.InlineMath,{math:"H"}),":"]}),e.jsx(t.BlockMath,{math:"\\hat{y}^{(s)} = \\text{Interp}\\!\\left(\\text{MLP}^{(s)}(\\tilde{x}^{(s)}),\\; H\\right)"}),e.jsx("p",{className:"text-gray-700 leading-relaxed mt-3",children:"The final multi-step forecast is the sum across all stacks:"}),e.jsx(t.BlockMath,{math:"\\hat{y} = \\sum_{s=1}^{S} \\hat{y}^{(s)}"}),e.jsx(g,{title:"Why Interpolation Helps Long Horizons",children:e.jsxs("p",{children:["In standard N-BEATS each block must produce all ",e.jsx(t.InlineMath,{math:"H"})," ","forecast values directly. For large ",e.jsx(t.InlineMath,{math:"H"})," (e.g., 720 steps) the output layer becomes very wide, increasing both parameters and overfitting risk. N-HiTS' interpolation approach means the output MLP only needs to predict ",e.jsx(t.InlineMath,{math:"\\lceil H/r_s\\rceil"})," values — a"," ",e.jsx(t.InlineMath,{math:"r_s\\times"})," reduction. The interpolation step is parameter-free and acts as a smooth inductive bias."]})}),e.jsx(G,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"N-HiTS vs N-BEATS"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"min-w-full text-sm border border-gray-200 rounded-lg",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Aspect"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"N-BEATS"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"N-HiTS"})]})}),e.jsx("tbody",{children:[["Input sampling","Full resolution for every stack","MaxPool downsampling per stack"],["Output generation","Direct full-horizon MLP output","Coarse output + interpolation"],["Parameter efficiency","Scales with H (wide output layers)","Scales with H/r (interpolated)"],["Best horizon","Short to medium (≤ 48 steps)","Long (≥ 96 steps)"],["Interpretability","Trend/seasonality basis expansion","Frequency-based decomposition"]].map(([s,o,n])=>e.jsxs("tr",{className:"border-t border-gray-200 hover:bg-gray-50",children:[e.jsx("td",{className:"px-4 py-2 font-medium text-gray-700",children:s}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:o}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:n})]},s))})]})}),e.jsx(x,{title:"Choosing n_freq_downsample",children:e.jsxs("p",{className:"text-sm text-gray-700",children:["The ",e.jsx("code",{children:"n_freq_downsample"})," parameter controls the MaxPool kernel sizes for each stack. A value of ",e.jsx("code",{children:"[24, 12, 1]"})," for hourly data works well: the first stack operates on daily averages (24x), the second on 2-hour blocks (12x), and the third on full resolution. For monthly data, ",e.jsx("code",{children:"[4, 2, 1]"})," (quarterly, semi-annual, monthly) is a reasonable starting point. Always set"," ",e.jsx("code",{children:"input_size"})," to at least ",e.jsx("code",{children:"3 × horizon"})," to give the model enough context."]})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Implementation"}),e.jsx(u,{code:O}),e.jsxs(p,{title:"Very Long Horizons Need Large Look-backs",children:["For horizon = 720 (hourly, 30-day forecast), set"," ",e.jsx("code",{children:"input_size = 5 * horizon = 3600"}),". This is much larger than typical RNN or N-BEATS look-backs. N-HiTS handles it efficiently because the MaxPool compresses the input before processing. Training time will still be longer — consider reducing ",e.jsx("code",{children:"max_steps"})," and using a learning rate scheduler."]}),e.jsx(c,{title:"When to Choose N-HiTS",children:e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm",children:[e.jsx("li",{children:"Horizon longer than 96 steps (outperforms N-BEATS and most Transformers)."}),e.jsx("li",{children:"Limited GPU memory — interpolation dramatically reduces output layer size."}),e.jsx("li",{children:"You want a principled frequency decomposition of the forecast."}),e.jsx("li",{children:"Short horizons: N-BEATS or LSTM-based models are equally strong and simpler to tune."})]})}),e.jsx(f,{references:[{author:"Challu, C., Olivares, K. G., Oreshkin, B. N., et al.",year:2023,title:"N-HiTS: Neural Hierarchical Interpolation for Time Series Forecasting",venue:"AAAI"},{author:"Oreshkin, B. N., Carpov, D., Chapados, N., & Bengio, Y.",year:2020,title:"N-BEATS: Neural Basis Expansion Analysis for Interpretable Time Series Forecasting",venue:"ICLR"},{author:"Zeng, A., Chen, M., Zhang, L., & Xu, Q.",year:2023,title:"Are Transformers Effective for Time Series Forecasting?",venue:"AAAI"}]})]})}const _e=Object.freeze(Object.defineProperty({__proto__:null,default:V},Symbol.toStringTag,{value:"Module"}));function U(){const[s,o]=h.useState(3),n=3,i=1+(n-1)*((1<<s)-1),r=Array.from({length:s},(a,l)=>({dilation:1<<l,label:`Layer ${l+1} (d=${1<<l})`}));return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"Dilated Causal Convolution — Receptive Field"}),e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx("label",{className:"text-sm text-gray-600",children:"Number of layers:"}),[2,3,4,5].map(a=>e.jsx("button",{onClick:()=>o(a),className:`px-3 py-1 rounded text-sm border transition-all ${s===a?"bg-teal-600 text-white border-teal-600":"bg-white text-gray-700 border-gray-300 hover:border-teal-400"}`,children:a},a))]}),e.jsx("div",{className:"space-y-2",children:r.map((a,l)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-xs text-gray-500 w-28 shrink-0",children:a.label}),e.jsx("div",{className:"flex gap-1",children:Array.from({length:Math.min(16,a.dilation*8)},(k,y)=>e.jsx("div",{className:`h-5 rounded text-xs flex items-center justify-center ${y%(a.dilation*2)===0?"bg-teal-500 text-white w-5":"bg-gray-200 text-gray-400 w-3"}`},y))})]},l))}),e.jsxs("div",{className:"mt-3 p-2 bg-teal-50 border border-teal-200 rounded text-sm text-teal-900",children:["Receptive field with kernel size ",n," and ",s," dilated layers:"," ",e.jsxs("strong",{children:[i," time steps"]})," ","(formula: 1 + (k-1) × (2^L - 1))"]})]})}const Q=`import torch
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
`;function K(){return e.jsxs(m,{title:"Temporal Convolutional Networks (TCN)",difficulty:"advanced",readingTime:12,children:[e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Temporal Convolutional Networks replace recurrence with"," ",e.jsx("em",{children:"dilated causal convolutions"})," arranged in residual blocks. This design gives TCNs the ability to capture very long-range dependencies with a precisely controlled ",e.jsx("em",{children:"receptive field"}),", while enabling fully parallel training — a significant advantage over sequential RNNs."]}),e.jsxs(d,{title:"Dilated Causal Convolution",children:["A ",e.jsx("strong",{children:"causal convolution"})," at time step ",e.jsx(t.InlineMath,{math:"t"})," ","uses only past and current inputs"," ",e.jsx(t.InlineMath,{math:"x_{\\leq t}"}),", never future ones. A"," ",e.jsx("strong",{children:"dilation"})," of ",e.jsx(t.InlineMath,{math:"d"})," skips"," ",e.jsx(t.InlineMath,{math:"d-1"})," positions between kernel elements, effectively expanding the receptive field without increasing the kernel size:",e.jsx(t.BlockMath,{math:"(x * k)_t = \\sum_{i=0}^{k-1} x_{t - d \\cdot i} \\cdot w_i"})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Exponentially Growing Dilations"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["TCNs typically double the dilation at each layer:"," ",e.jsx(t.InlineMath,{math:"d_\\ell = 2^\\ell"}),". With kernel size"," ",e.jsx(t.InlineMath,{math:"k"})," and ",e.jsx(t.InlineMath,{math:"L"})," layers, the receptive field (the number of past inputs that influence any single output) grows exponentially:"]}),e.jsx(t.BlockMath,{math:"\\text{RF} = 1 + (k-1)\\sum_{\\ell=0}^{L-1} 2^\\ell = 1 + (k-1)(2^L - 1)"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:["With ",e.jsx(t.InlineMath,{math:"k=3"})," and ",e.jsx(t.InlineMath,{math:"L=8"})," layers, the receptive field spans ",e.jsx("strong",{children:"511 steps"})," — sufficient for yearly seasonality in hourly data — with only 8 convolution layers."]}),e.jsx(U,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Residual Connections"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"Each TCN block wraps two dilated causal convolutions in a residual connection. If the number of input and output channels differ, a 1×1 convolution is used as a skip connection:"}),e.jsx(t.BlockMath,{math:"\\mathbf{z}^{(\\ell)} = \\text{ReLU}\\!\\bigl(\\mathbf{F}(x^{(\\ell)}) + W_s\\, x^{(\\ell)}\\bigr)"}),e.jsx("p",{className:"text-gray-700 leading-relaxed mt-3",children:"Residual connections solve vanishing gradients and allow stacking many layers without performance degradation — the same motivation as ResNets in image recognition."}),e.jsx(g,{title:"WaveNet and the Origins of Dilated TCNs",children:e.jsx("p",{children:"WaveNet (van den Oord et al., 2016) popularized dilated causal convolutions for audio waveform generation. The forecasting community later adapted this architecture for time series, combining it with residual blocks and replacing the softmax output with direct regression targets. The key insight: audio generation and time-series forecasting share the same auto-regressive conditional structure."})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"TCN vs RNN: When to Use Which"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"min-w-full text-sm border border-gray-200 rounded-lg",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Property"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"LSTM / GRU"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"TCN"})]})}),e.jsx("tbody",{children:[["Training parallelism","Sequential (slow)","Fully parallel (fast)"],["Receptive field","Theoretically infinite","Fixed, controllable"],["Memory during training","BPTT gradients through time","Standard backprop"],["Long-range dependencies","Struggles beyond ~200 steps","Explicit via dilation"],["Variable-length input","Native support","Requires padding/cropping"],["Interpretability","Gate activations","Convolution filters"]].map(([s,o,n])=>e.jsxs("tr",{className:"border-t border-gray-200 hover:bg-gray-50",children:[e.jsx("td",{className:"px-4 py-2 font-medium text-gray-700",children:s}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:o}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:n})]},s))})]})}),e.jsx(x,{title:"TimesNet: 2D Temporal Convolution",children:e.jsx("p",{className:"text-sm text-gray-700",children:"TimesNet (Wu et al., 2023) extends the TCN idea by reshaping the 1D time series into a 2D temporal map based on the detected dominant period, then applying standard 2D convolutions. This allows the model to capture both intra-period patterns (e.g., within a week) and inter-period patterns (e.g., week-over-week trends) simultaneously. It achieves state-of-the-art results on several benchmarks by exploiting the inherent 2D structure of seasonal time series."})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Implementation"}),e.jsx(u,{code:Q}),e.jsxs(p,{title:"Ensure Causal Masking",children:["Standard Conv1d in PyTorch uses symmetric padding, which leaks future information. Always use causal (left-only) padding:"," ",e.jsx("code",{children:"padding = (kernel_size - 1) * dilation"})," and then trim the right end of the output. Failing to do so produces a model that appears to work during training (because ground truth fills right-padding positions) but leaks information and will generalize poorly."]}),e.jsx(c,{title:"Practical Tips for TCNs",children:e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm",children:[e.jsxs("li",{children:["Set dilations to ",e.jsx("code",{children:"[1, 2, 4, 8, ...]"})," doubling each layer; 4–6 layers covers most daily/hourly datasets."]}),e.jsxs("li",{children:["Use ",e.jsx("strong",{children:"weight normalization"})," (not batch norm) for stable training — batch norm interacts poorly with variable-length sequences."]}),e.jsx("li",{children:"TCNs are very fast to train: no sequential dependency, all time steps processed in parallel on GPU."}),e.jsx("li",{children:"For multivariate forecasting, concatenate all variates as input channels (channel mixing) or process each independently (channel independence)."})]})}),e.jsx(f,{references:[{author:"Bai, S., Kolter, J. Z., & Koltun, V.",year:2018,title:"An Empirical Evaluation of Generic Convolutional and Recurrent Networks for Sequence Modeling",venue:"arXiv"},{author:"van den Oord, A., et al.",year:2016,title:"WaveNet: A Generative Model for Raw Audio",venue:"arXiv"},{author:"Wu, H., Hu, T., Liu, Y., et al.",year:2023,title:"TimesNet: Temporal 2D-Variation Modeling for General Time Series Analysis",venue:"ICLR"}]})]})}const be=Object.freeze(Object.defineProperty({__proto__:null,default:K},Symbol.toStringTag,{value:"Module"}));function X(){const[s,o]=h.useState(6),[n,i]=h.useState("full"),r=(a,l)=>n==="causal"&&l>a;return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"Attention Matrix Visualization"}),e.jsxs("div",{className:"flex gap-4 mb-4 flex-wrap items-center",children:[e.jsx("div",{className:"flex gap-2",children:[4,6,8].map(a=>e.jsxs("button",{onClick:()=>o(a),className:`px-3 py-1 rounded text-sm border transition-all ${s===a?"bg-violet-600 text-white border-violet-600":"bg-white text-gray-700 border-gray-300"}`,children:["T=",a]},a))}),e.jsx("div",{className:"flex gap-2",children:[["full","Full"],["causal","Causal (masked)"]].map(([a,l])=>e.jsx("button",{onClick:()=>i(a),className:`px-3 py-1 rounded text-sm border transition-all ${n===a?"bg-amber-600 text-white border-amber-600":"bg-white text-gray-700 border-gray-300"}`,children:l},a))})]}),e.jsx("div",{className:"flex gap-1",children:Array.from({length:s},(a,l)=>e.jsx("div",{className:"flex flex-col gap-1",children:Array.from({length:s},(k,y)=>e.jsx("div",{className:`w-7 h-7 rounded text-xs flex items-center justify-center font-mono border ${r(y,l)?"bg-gray-200 border-gray-300 text-gray-400":y===l?"bg-violet-500 text-white border-violet-600":"bg-violet-100 border-violet-200 text-violet-800"}`,children:r(y,l)?"−∞":"α"},y))},l))}),e.jsxs("p",{className:"text-xs text-gray-500 mt-3",children:["Rows = queries (output positions), Columns = keys (input positions).",n==="causal"?" Causal masking sets future positions to −∞ before softmax.":" Full attention: every position attends to all others — O(T²) cost."]})]})}const Y=`import torch
import torch.nn as nn
import torch.nn.functional as F
import math

# ── 1. Scaled Dot-Product Attention ────────────────────────────────────────
def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q: (B, heads, T_q, d_k)
    K: (B, heads, T_k, d_k)
    V: (B, heads, T_k, d_v)
    Returns: (B, heads, T_q, d_v), attention weights
    """
    d_k    = Q.shape[-1]
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)  # (B, H, T_q, T_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    weights = F.softmax(scores, dim=-1)
    output  = torch.matmul(weights, V)
    return output, weights


# ── 2. Multi-Head Attention Module ─────────────────────────────────────────
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model=128, num_heads=8):
        super().__init__()
        assert d_model % num_heads == 0
        self.d_k     = d_model // num_heads
        self.heads   = num_heads
        self.W_Q     = nn.Linear(d_model, d_model)
        self.W_K     = nn.Linear(d_model, d_model)
        self.W_V     = nn.Linear(d_model, d_model)
        self.W_out   = nn.Linear(d_model, d_model)

    def split_heads(self, x):
        B, T, D = x.shape
        return x.view(B, T, self.heads, self.d_k).transpose(1, 2)  # (B, H, T, d_k)

    def forward(self, query, key, value, mask=None):
        Q = self.split_heads(self.W_Q(query))
        K = self.split_heads(self.W_K(key))
        V = self.split_heads(self.W_V(value))
        x, attn_w = scaled_dot_product_attention(Q, K, V, mask)
        x = x.transpose(1, 2).contiguous().view(query.shape[0], -1, self.heads * self.d_k)
        return self.W_out(x), attn_w


# ── 3. Positional Encoding ─────────────────────────────────────────────────
class SinusoidalPositionalEncoding(nn.Module):
    def __init__(self, d_model=128, max_len=5000):
        super().__init__()
        pe   = torch.zeros(max_len, d_model)
        pos  = torch.arange(max_len).unsqueeze(1).float()
        div  = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(pos * div)
        pe[:, 1::2] = torch.cos(pos * div)
        self.register_buffer('pe', pe.unsqueeze(0))   # (1, max_len, d_model)

    def forward(self, x):
        return x + self.pe[:, :x.size(1)]


# ── 4. Transformer Encoder Layer ───────────────────────────────────────────
class TransformerEncoderLayer(nn.Module):
    def __init__(self, d_model=128, num_heads=8, ff_dim=256, dropout=0.1):
        super().__init__()
        self.attn    = MultiHeadAttention(d_model, num_heads)
        self.ff      = nn.Sequential(
            nn.Linear(d_model, ff_dim),
            nn.ReLU(),
            nn.Linear(ff_dim, d_model),
        )
        self.norm1   = nn.LayerNorm(d_model)
        self.norm2   = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        # Pre-norm (more stable than post-norm for long training)
        attn_out, _ = self.attn(self.norm1(x), self.norm1(x), self.norm1(x), mask)
        x = x + self.dropout(attn_out)
        x = x + self.dropout(self.ff(self.norm2(x)))
        return x


# ── 5. Simple Transformer Forecaster ──────────────────────────────────────
class TransformerForecaster(nn.Module):
    def __init__(self, input_dim=1, d_model=64, num_heads=4,
                 num_layers=3, horizon=24, dropout=0.1):
        super().__init__()
        self.input_proj = nn.Linear(input_dim, d_model)
        self.pos_enc    = SinusoidalPositionalEncoding(d_model)
        self.layers     = nn.ModuleList([
            TransformerEncoderLayer(d_model, num_heads, d_model * 4, dropout)
            for _ in range(num_layers)
        ])
        self.fc_out     = nn.Linear(d_model, horizon)

    def forward(self, x):
        # x: (B, T, input_dim)
        h = self.pos_enc(self.input_proj(x))
        for layer in self.layers:
            h = layer(h)
        # Use average pooling over time, then project to horizon
        return self.fc_out(h.mean(dim=1))   # (B, horizon)

# Test forward pass
model = TransformerForecaster(input_dim=1, d_model=64, horizon=24)
x     = torch.randn(16, 96, 1)   # (batch=16, lookback=96, features=1)
print("Output shape:", model(x).shape)   # torch.Size([16, 24])

# Complexity: O(T^2 * d) — with T=96, d=64: ~590K multiplications per layer
# For T=10000, this becomes 10000^2 * 64 = 6.4 billion — intractable
T_values = [96, 512, 1000, 2000]
for T in T_values:
    ops = T ** 2 * 64
    print(f"  T={T:5d}: {ops/1e6:.1f}M operations per layer")
`;function J(){return e.jsxs(m,{title:"Attention Mechanisms for Sequences",difficulty:"advanced",readingTime:14,children:[e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"The attention mechanism is the central innovation behind Transformer models. Unlike RNNs that process sequences step by step, attention allows every position in a sequence to directly communicate with every other position in a single operation — enabling parallelism and capturing long-range dependencies that recurrence struggles with."}),e.jsxs(d,{title:"Scaled Dot-Product Attention",children:["Given query matrix ",e.jsx(t.InlineMath,{math:"\\mathbf{Q}"}),", key matrix"," ",e.jsx(t.InlineMath,{math:"\\mathbf{K}"}),", and value matrix"," ",e.jsx(t.InlineMath,{math:"\\mathbf{V}"})," (each of shape"," ",e.jsx(t.InlineMath,{math:"T \\times d_k"}),"), the attention output is:",e.jsx(t.BlockMath,{math:"\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V"}),"The scaling factor ",e.jsx(t.InlineMath,{math:"1/\\sqrt{d_k}"})," prevents the dot products from growing too large in magnitude, which would push the softmax into saturation regions with near-zero gradients."]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Self-Attention in Time Series"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["In ",e.jsx("strong",{children:"self-attention"}),", queries, keys, and values all derive from the same sequence. For a time series of length ",e.jsx(t.InlineMath,{math:"T"}),", this produces a ",e.jsx(t.InlineMath,{math:"T \\times T"})," attention matrix where entry ",e.jsx(t.InlineMath,{math:"\\alpha_{ij}"})," quantifies how much time step"," ",e.jsx(t.InlineMath,{math:"i"})," attends to time step ",e.jsx(t.InlineMath,{math:"j"}),". This allows the model to capture non-local seasonal patterns (e.g., same day last week/year) without any inductive temporal bias."]}),e.jsx(X,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Multi-Head Attention"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mb-4",children:["Instead of a single attention function, multi-head attention runs"," ",e.jsx(t.InlineMath,{math:"h"})," parallel attention heads, each projecting to a lower-dimensional subspace:"]}),e.jsx(t.BlockMath,{math:"\\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)\\,W^O"}),e.jsx(t.BlockMath,{math:"\\text{head}_i = \\text{Attention}(QW_i^Q,\\; KW_i^K,\\; VW_i^V)"}),e.jsx("p",{className:"text-gray-700 leading-relaxed mt-3",children:"Different heads can specialize: one head might capture short-range correlations, another might learn annual seasonality, another might focus on trend-reversal patterns."}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Positional Encoding"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Self-attention is ",e.jsx("em",{children:"permutation-invariant"}),' — it has no built-in notion of "earlier" vs. "later." To preserve temporal order, a positional encoding ',e.jsx(t.InlineMath,{math:"\\mathbf{PE}(t)"})," is added to each input embedding. The classic sinusoidal encoding from Vaswani et al. (2017):"]}),e.jsx(t.BlockMath,{math:"\\text{PE}(t, 2i) = \\sin\\!\\left(\\frac{t}{10000^{2i/d}}\\right),\\quad \\text{PE}(t, 2i{+}1) = \\cos\\!\\left(\\frac{t}{10000^{2i/d}}\\right)"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:["For time series, ",e.jsx("em",{children:"learned positional embeddings"})," or"," ",e.jsx("em",{children:"timestamp features"})," (hour-of-day, day-of-week, month-of-year) often work better than sinusoidal encodings because they directly encode meaningful calendar periodicity."]}),e.jsxs(g,{title:"The Quadratic Complexity Problem",children:[e.jsxs("p",{children:["The attention operation computes a"," ",e.jsx(t.InlineMath,{math:"T \\times T"})," matrix, making its time and memory complexity ",e.jsx(t.InlineMath,{math:"O(T^2 d)"}),". For"," ",e.jsx(t.InlineMath,{math:"T = 10{,}000"})," steps (less than 2 weeks of minute-level data), this is computationally intractable on commodity hardware. This is why vanilla Transformers are rarely applied to very long time series without modifications:"]}),e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Sparse attention"})," (Informer, LogTrans): attend only to a subset of positions."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Patch tokenization"})," (PatchTST): group consecutive time steps into patches, reducing sequence length by the patch size."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Linear attention"})," (Flowformer): approximate the softmax kernel to achieve ",e.jsx(t.InlineMath,{math:"O(T)"})," complexity."]})]})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"The Full Transformer Block"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"A Transformer encoder layer consists of two sub-layers, each wrapped in a residual connection and layer normalization:"}),e.jsxs("ol",{className:"list-decimal ml-6 mt-2 space-y-2 text-gray-700 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Multi-head self-attention:"})," ",e.jsx(t.InlineMath,{math:"x' = \\text{LayerNorm}(x + \\text{MultiHead}(x, x, x))"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Position-wise feed-forward network:"})," ",e.jsx(t.InlineMath,{math:"x'' = \\text{LayerNorm}(x' + \\text{FFN}(x'))"}),"where ",e.jsx(t.InlineMath,{math:"\\text{FFN}(x) = W_2 \\text{ReLU}(W_1 x + b_1) + b_2"})]})]}),e.jsx(x,{title:"Causal vs. Non-Causal Attention in Forecasting",children:e.jsxs("p",{className:"text-sm text-gray-700",children:["Encoder-only architectures (like PatchTST) use ",e.jsx("em",{children:"non-causal"})," ","(bidirectional) attention: the model sees the entire look-back window at once, similar to BERT. Auto-regressive decoder architectures (like the original Transformer) use ",e.jsx("em",{children:"causal"})," (masked) attention: position ",e.jsx(t.InlineMath,{math:"t"})," can only attend to"," ",e.jsx(t.InlineMath,{math:"\\leq t"}),". For forecasting, non-causal encoders are more common since the input window is always fully observed."]})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Implementation"}),e.jsx(u,{code:Y}),e.jsxs(p,{title:"Transformers Are Not Always Better for Short Time Series",children:["Extensive benchmarks (Zeng et al., 2023) show that a simple linear model often matches or outperforms complex Transformer architectures on univariate long-horizon benchmarks. The key issue is the"," ",e.jsx("em",{children:"point permutation problem"}),": if you permute time steps randomly, a vanilla Transformer's loss barely changes, showing it may not exploit temporal order effectively. Modern fixes include patch-based tokenization (PatchTST) and channel-mixing (iTransformer)."]}),e.jsx(c,{title:"Key Takeaways",children:e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm",children:[e.jsxs("li",{children:["Attention complexity is ",e.jsx(t.InlineMath,{math:"O(T^2)"})," — use patches or sparse variants for long series."]}),e.jsx("li",{children:"Multi-head attention lets different heads specialize in different temporal patterns."}),e.jsx("li",{children:"Positional encoding is critical — sinusoidal or learned timestamp features."}),e.jsx("li",{children:"For short-to-medium horizons, simple models (linear, N-BEATS) are strong baselines before adding Transformer complexity."})]})}),e.jsx(f,{references:[{author:"Vaswani, A., et al.",year:2017,title:"Attention Is All You Need",venue:"NeurIPS"},{author:"Zhou, H., et al.",year:2021,title:"Informer: Beyond Efficient Transformer for Long Sequence Time-Series Forecasting",venue:"AAAI"},{author:"Zeng, A., Chen, M., Zhang, L., & Xu, Q.",year:2023,title:"Are Transformers Effective for Time Series Forecasting?",venue:"AAAI"},{author:"Nie, Y., et al.",year:2023,title:"A Time Series is Worth 64 Words: Long-term Forecasting with Transformers",venue:"ICLR"}]})]})}const je=Object.freeze(Object.defineProperty({__proto__:null,default:J},Symbol.toStringTag,{value:"Module"}));function $(){const[s,o]=h.useState(null),n=[{id:"static",label:"Static Covariates",examples:["Store ID","Product category","Country","SKU attributes"],usage:"Projected to a static embedding, injected into the encoder, decoder, and variable selection network. Captures fixed entity properties.",colorClass:"bg-blue-100 border-blue-400 text-blue-800",activeClass:"bg-blue-600 text-white border-blue-600"},{id:"known_future",label:"Known Future Covariates",examples:["Day of week","Holiday flag","Planned promotions","Price schedule"],usage:"Available for both historical and future time steps. Fed to both the LSTM encoder (history) and decoder (future), plus the self-attention layer.",colorClass:"bg-green-100 border-green-400 text-green-800",activeClass:"bg-green-600 text-white border-green-600"},{id:"unknown",label:"Unknown Past Covariates",examples:["Past sales","Past weather actuals","Market returns","Traffic counts"],usage:"Only available for past time steps. Fed to the LSTM encoder but not the decoder or future self-attention layers.",colorClass:"bg-orange-100 border-orange-400 text-orange-800",activeClass:"bg-orange-600 text-white border-orange-600"}],i=n.find(r=>r.id===s);return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"TFT Covariate Types — Click to Explore"}),e.jsx("div",{className:"flex gap-3 flex-wrap mb-4",children:n.map(r=>e.jsx("button",{onClick:()=>o(s===r.id?null:r.id),className:`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${s===r.id?r.activeClass:"bg-white text-gray-700 border-gray-300 hover:border-gray-400"}`,children:r.label},r.id))}),i&&e.jsxs("div",{className:"p-3 rounded-lg border border-gray-200 bg-white",children:[e.jsx("p",{className:"text-sm text-gray-700 mb-2",children:i.usage}),e.jsx("div",{className:"flex flex-wrap gap-2 mt-2",children:i.examples.map(r=>e.jsx("span",{className:`px-2 py-1 rounded text-xs font-mono border ${i.colorClass}`,children:r},r))})]})]})}const Z=`from neuralforecast import NeuralForecast
from neuralforecast.models import TFT
from neuralforecast.losses.pytorch import MQLoss
import pandas as pd
import numpy as np

# ── 1. Dataset with three covariate types ─────────────────────────────────
np.random.seed(42)
n_stores, T = 20, 104  # 20 stores, 2 years weekly

records = []
for store in range(n_stores):
    dates     = pd.date_range('2022-01-01', periods=T, freq='W')
    t         = np.arange(T)
    store_size = store % 2                              # static: 0=small, 1=large
    week_norm  = (t % 52).astype(float) / 52.0         # known future covariate
    holiday    = (t % 13 == 0).astype(float)            # known future covariate
    promo      = np.random.binomial(1, 0.15, T).astype(float)  # unknown future
    base = 1000 + 200 * store_size
    y    = (base + 100*np.sin(2*np.pi*t/52) + 150*holiday
            + 80*promo + 20*np.random.randn(T))
    for d, yv, wk, hol, pr in zip(dates, y, week_norm, holiday, promo):
        records.append({
            'unique_id': f'store_{store}',
            'ds': d, 'y': float(yv),
            'week_norm': wk,
            'is_holiday': hol,
            'past_promo': pr,
            'store_size': float(store_size),
        })

df = pd.DataFrame(records)

# ── 2. TFT model definition ────────────────────────────────────────────────
horizon = 13
model = TFT(
    h=horizon,
    input_size=4 * horizon,
    hidden_size=64,
    n_head=4,
    attn_dropout=0.1,
    dropout=0.1,
    loss=MQLoss(level=[10, 50, 90]),
    hist_exog_list=['past_promo'],               # unknown future (past only)
    futr_exog_list=['week_norm', 'is_holiday'],  # known for future
    stat_exog_list=['store_size'],               # static per series
    max_steps=500,
    learning_rate=1e-3,
    batch_size=32,
    random_seed=42,
)

nf = NeuralForecast(models=[model], freq='W')
nf.fit(df)

# ── 3. Prediction (supply future covariates) ───────────────────────────────
futr_df = nf.make_future_dataframe(df)
woy = pd.DatetimeIndex(futr_df['ds']).isocalendar().week.values
futr_df['week_norm']  = woy / 52.0
futr_df['is_holiday'] = (woy % 13 == 0).astype(float)
futr_df['store_size'] = futr_df['unique_id'].str.extract(r'(d+)')[0].astype(int) % 2

forecasts = nf.predict(futr_df=futr_df)
print(forecasts.head())
# Columns: unique_id, ds, TFT-lo-10, TFT-median, TFT-hi-90

print("Forecast shape:", forecasts.shape)
print("Unique series:", forecasts['unique_id'].nunique())
`;function ee(){return e.jsxs(m,{title:"Temporal Fusion Transformers (TFT)",difficulty:"advanced",readingTime:16,children:[e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"The Temporal Fusion Transformer (TFT) combines LSTMs, multi-head attention, and gating mechanisms into a unified architecture designed for multi-horizon forecasting with heterogeneous covariates. It won the M5 competition and consistently achieves strong results on real-world retail, energy, and financial datasets with rich covariate structure."}),e.jsxs(d,{title:"TFT Architecture Overview",children:["TFT processes three covariate categories through distinct pathways, then fuses them via a sequence-to-sequence architecture with attention:",e.jsxs("ol",{className:"list-decimal ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Variable Selection Networks (VSN)"})," — learn input importance weights per time step"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"LSTM Encoder-Decoder"})," — capture local and order-sensitive temporal patterns"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Multi-Head Self-Attention"})," — model long-range dependencies across the look-back window"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Quantile output layer"})," — simultaneously produce prediction intervals"]})]})]}),e.jsx($,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Variable Selection Networks (VSN)"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["The VSN is TFT's mechanism for learning which input features matter at each time step. Given ",e.jsx(t.InlineMath,{math:"m"})," input covariates, the VSN produces soft weights via a Gated Residual Network (GRN):"]}),e.jsx(t.BlockMath,{math:"\\mathbf{v} = \\text{softmax}\\!\\bigl(\\text{GRN}([x_1, \\dots, x_m])\\bigr)"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3 mb-4",children:["The enriched input is a weighted combination:"," ",e.jsx(t.InlineMath,{math:"\\tilde{x} = \\sum_i v_i\\,\\tilde{x}_i"})," where"," ",e.jsx(t.InlineMath,{math:"\\tilde{x}_i"})," are per-variable linear projections. The weights ",e.jsx(t.InlineMath,{math:"\\mathbf{v}"})," are interpretable — they show which covariates the model relied on for each forecast."]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Gated Residual Network (GRN)"}),e.jsx("p",{className:"text-gray-700 leading-relaxed mb-4",children:"The GRN is TFT's fundamental building block — a gated skip connection that lets the model adaptively bypass nonlinear transformations:"}),e.jsx(t.BlockMath,{math:"\\text{GRN}(a, c) = \\text{LayerNorm}\\!\\bigl(a + \\text{GLU}(\\eta_1)\\bigr)"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:["where ",e.jsx(t.InlineMath,{math:"\\eta_1 = W_1 a + W_2 c + b_1"})," and the optional context ",e.jsx(t.InlineMath,{math:"c"})," injects static embeddings. The Gated Linear Unit ",e.jsx(t.InlineMath,{math:"\\text{GLU}(x) = \\sigma(W_4 x)\\odot(W_5 x)"})," ","controls the flow of information through the nonlinear path."]}),e.jsxs(g,{title:"LSTM + Attention Fusion",children:[e.jsx("p",{children:"TFT uses a two-stage temporal processing strategy:"}),e.jsxs("ol",{className:"list-decimal ml-5 mt-2 space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"LSTM encoder-decoder:"})," processes historical look-back (encoder) and decodes future steps using known-future covariates (decoder). Handles local, position-sensitive patterns that attention alone misses."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Multi-head self-attention on LSTM outputs:"})," applies attention across the entire enriched sequence to capture long-range dependencies. The attention matrix is interpretable — high weights reveal which historical dates influenced each forecast step."]})]}),e.jsx("p",{className:"text-sm mt-3",children:"The combination outperforms either component alone: LSTM for local dynamics, attention for global patterns and non-local seasonality."})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Quantile Forecasting"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"TFT produces simultaneous multi-quantile forecasts via parallel linear output heads, one per quantile level. Training uses the pinball (quantile) loss summed over all quantiles and horizon steps:"}),e.jsx(t.BlockMath,{math:"\\mathcal{L} = \\frac{1}{HQ}\\sum_{q}\\sum_{t=1}^{H} \\mathcal{L}_q\\!\\bigl(\\hat{y}_t^{(q)}, y_t\\bigr)"}),e.jsx("p",{className:"text-gray-700 leading-relaxed mt-3",children:"This produces calibrated prediction intervals (e.g., P10–P90 = 80% interval) in a single forward pass without Monte Carlo sampling."}),e.jsxs(x,{title:"TFT vs. DeepAR: Practical Choice Guide",children:[e.jsxs("p",{className:"text-sm text-gray-700",children:[e.jsx("strong",{children:"Choose TFT when:"})," you have rich future-known covariates (promotions, holidays, pricing), you need interpretable variable importance scores, or you want simultaneous quantile outputs. TFT's explicit covariate handling is its main advantage over DeepAR."]}),e.jsxs("p",{className:"text-sm text-gray-700 mt-2",children:[e.jsx("strong",{children:"Choose DeepAR when:"})," the target distribution is clearly non-Gaussian (count data — use Negative Binomial), you have very many sparse series, or you have limited covariates and want a simpler model."]})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Implementation"}),e.jsx(u,{code:Z}),e.jsxs(p,{title:"Future Covariates Must Be Supplied at Inference",children:["TFT explicitly uses known-future covariates (holidays, promotions) in its decoder during prediction. You must provide a ",e.jsx("code",{children:"futr_df"})," DataFrame containing future covariate values for all horizon steps. Supplying zeros or missing values will produce degraded forecasts, especially for series with strong promotional or calendar-driven effects."]}),e.jsx(c,{title:"TFT Hyperparameter Priorities",children:e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("code",{children:"hidden_size"})," (64–256): most impactful; larger = more capacity but slower and more prone to overfitting."]}),e.jsxs("li",{children:[e.jsx("code",{children:"n_head"})," (1–8): number of attention heads; 4 is a robust default for most datasets."]}),e.jsxs("li",{children:[e.jsx("code",{children:"input_size"}),": set to at least 2× the seasonal period (e.g., 104 weeks for annual retail data)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"dropout"})," (0.1–0.3): important regularizer, especially for small-to-medium datasets."]}),e.jsx("li",{children:"Use AutoTFT (NeuralForecast) or Ray Tune for systematic hyperparameter search on large datasets."})]})}),e.jsx(f,{references:[{author:"Lim, B., Arık, S. Ö., Loeff, N., & Pfister, T.",year:2021,title:"Temporal Fusion Transformers for Interpretable Multi-horizon Time Series Forecasting",venue:"International Journal of Forecasting"},{author:"Salinas, D., Flunkert, V., Gasthaus, J., & Januschowski, T.",year:2020,title:"DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks",venue:"International Journal of Forecasting"},{author:"Makridakis, S., et al.",year:2022,title:"M5 accuracy competition: Results, findings, and conclusions",venue:"International Journal of Forecasting"}]})]})}const Te=Object.freeze(Object.defineProperty({__proto__:null,default:ee},Symbol.toStringTag,{value:"Module"}));function te(){const[s,o]=h.useState(16),n=96,i=Math.ceil(n/s);return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"Patch Tokenization vs Point Tokenization"}),e.jsxs("div",{className:"flex items-center gap-3 mb-4 flex-wrap",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"Patch size:"}),[8,16,32].map(r=>e.jsxs("button",{onClick:()=>o(r),className:`px-3 py-1 rounded text-sm border transition-all ${s===r?"bg-rose-600 text-white border-rose-600":"bg-white text-gray-700 border-gray-300"}`,children:["P=",r]},r))]}),e.jsxs("div",{className:"mb-3",children:[e.jsxs("p",{className:"text-xs text-gray-500 mb-1",children:["Point tokens (T=",n," tokens, O(T²) attention):"]}),e.jsx("div",{className:"flex flex-wrap gap-0.5",children:Array.from({length:n},(r,a)=>e.jsx("div",{className:"w-3 h-4 bg-gray-300 rounded-sm"},a))})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"text-xs text-gray-500 mb-1",children:["Patch tokens (",i," patches, O(",i,"²) attention — ",Math.round(n*n/(i*i)),"× reduction):"]}),e.jsx("div",{className:"flex flex-wrap gap-1",children:Array.from({length:i},(r,a)=>e.jsxs("div",{className:"h-6 bg-rose-400 rounded flex items-center justify-center text-white text-xs font-mono",style:{width:`${s*3}px`},children:["P",a+1]},a))})]}),e.jsxs("p",{className:"text-xs text-gray-500 mt-2",children:["Attention cost: ",n,"²=",n*n," (point) vs ",i,"²=",i*i," (patch) — ",Math.round(n*n/(i*i)),"× cheaper."]})]})}const ae=`from neuralforecast import NeuralForecast
from neuralforecast.models import PatchTST
from neuralforecast.losses.pytorch import MAE, MQLoss
import pandas as pd
import numpy as np

# ── 1. ETT-style hourly dataset ────────────────────────────────────────────
np.random.seed(0)
T = 2000
dates = pd.date_range('2016-07-01', periods=T, freq='h')
t  = np.arange(T)
y  = (15 * np.sin(2*np.pi*t/24) +         # daily seasonality
      8  * np.sin(2*np.pi*t/(24*7)) +      # weekly seasonality
      0.5 * np.random.randn(T))
df = pd.DataFrame({'unique_id': 'ETT', 'ds': dates, 'y': y})

# ── 2. PatchTST for point forecasting ─────────────────────────────────────
# patch_len: number of time steps per patch (token)
# stride:    step between consecutive patches (stride < patch_len = overlap)
# Channel independence: each variate processed independently
horizon = 96

model_point = PatchTST(
    h=horizon,
    input_size=512,          # large look-back for long-horizon
    patch_len=16,            # 16-step patches → 32 tokens for input_size=512
    stride=8,                # 50% overlap between patches
    d_model=128,
    n_heads=16,
    d_ff=256,
    dropout=0.2,
    loss=MAE(),
    max_steps=1000,
    learning_rate=5e-4,
    batch_size=32,
    random_seed=42,
)

nf = NeuralForecast(models=[model_point], freq='h')
nf.fit(df)
pred = nf.predict()
print(pred.head())

# ── 3. Number of patches and effective attention complexity ────────────────
input_size = 512
patch_len  = 16
stride     = 8
n_patches  = (input_size - patch_len) // stride + 1
print(f"Input steps: {input_size}")
print(f"Number of patches: {n_patches}")
print(f"Attention complexity ratio: {input_size**2 / n_patches**2:.1f}x cheaper than point tokens")

# ── 4. iTransformer conceptual difference ─────────────────────────────────
# Standard Transformer: token = time step, attention = "which time steps relate?"
# iTransformer:         token = VARIATE,   attention = "which variables relate?"

# In NeuralForecast / pytorch-forecasting, iTransformer treats the
# multivariate series where each variable becomes a token of length T,
# and attention is computed across variates rather than across time.
# This is particularly useful for multivariate forecasting with many
# correlated variables (e.g., electricity consumption across 321 sensors).

# Example: with 321 variates, iTransformer computes 321×321 attention
# instead of T×T — very efficient when T >> N_variates.
N_variates = 321
T_len = 720
print(f"\\nMultivariate attention comparison (T={T_len}, N={N_variates}):")
print(f"  Standard (time attention): {T_len}² = {T_len**2:,} operations")
print(f"  iTransformer (variate attention): {N_variates}² = {N_variates**2:,} operations")
print(f"  iTransformer is {T_len**2 // N_variates**2}x cheaper for this dataset")
`;function se(){return e.jsxs(m,{title:"PatchTST and iTransformer",difficulty:"advanced",readingTime:12,children:[e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Two innovations address the core limitations of vanilla Transformers for time-series forecasting: ",e.jsx("strong",{children:"PatchTST"})," reduces quadratic complexity by grouping time steps into patches (like ViT for images), and"," ",e.jsx("strong",{children:"iTransformer"})," inverts the attention axis to operate across variates rather than time steps — both dramatically improving long-horizon forecasting performance."]}),e.jsxs(d,{title:"Patch-Based Tokenization (PatchTST)",children:["Instead of treating each time step as a token (producing ",e.jsx(t.InlineMath,{math:"T"})," ","tokens), PatchTST divides the input series into non-overlapping or overlapping windows of length ",e.jsx(t.InlineMath,{math:"P"})," (the patch size), producing ",e.jsx(t.InlineMath,{math:"\\lceil T/P \\rceil"})," tokens. Each patch is linearly projected to a ",e.jsx(t.InlineMath,{math:"d_\\text{model}"}),"-dimensional embedding. This reduces attention complexity from"," ",e.jsx(t.InlineMath,{math:"O(T^2)"})," to"," ",e.jsx(t.InlineMath,{math:"O((T/P)^2)"})," — a ",e.jsx(t.InlineMath,{math:"P^2"}),"-fold reduction."]}),e.jsx(te,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Channel Independence in PatchTST"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["PatchTST processes each variate ",e.jsx("em",{children:"independently"})," — a design choice called ",e.jsx("strong",{children:"channel independence (CI)"}),". For a dataset with"," ",e.jsx(t.InlineMath,{math:"C"})," variates, PatchTST creates"," ",e.jsx(t.InlineMath,{math:"C"})," separate instances of the same Transformer (shared weights), one per variate. This:"]}),e.jsxs("ul",{className:"list-disc ml-6 mt-2 space-y-1 text-gray-700 text-sm",children:[e.jsx("li",{children:"Prevents cross-variate noise contamination in high-dimensional panels."}),e.jsx("li",{children:"Enables the model to scale to arbitrary numbers of variates."}),e.jsx("li",{children:"Surprisingly outperforms channel-mixing approaches on most long-horizon benchmarks."})]}),e.jsxs(g,{title:"Patch Semantics: Local vs. Global Context",children:[e.jsx("p",{children:"A single time-step token carries only a scalar value — almost no semantic content for the Transformer to work with. A patch token carries a short time series segment, encoding local patterns (mini trends, short cycles, volatility clusters) in a single embedding. This is analogous to image patches in Vision Transformers: a single pixel (scalar) provides little information, but a 16×16 patch carries local texture and structure."}),e.jsx("p",{className:"text-sm mt-2",children:"Empirically, PatchTST achieves 20–40% lower MSE on ETT benchmarks compared to point-token Transformers (Informer, Autoformer) with the same model size."})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"iTransformer: Inverted Attention"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Liu et al. (2024) propose a conceptual inversion of the Transformer for multivariate forecasting: instead of treating"," ",e.jsx("em",{children:"time steps"})," as tokens and computing attention across time, iTransformer treats ",e.jsx("em",{children:"variates"})," as tokens and computes attention across variates."]}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:["For each variate ",e.jsx(t.InlineMath,{math:"i"}),", its entire look-back window is embedded as a single token:"," ",e.jsx(t.InlineMath,{math:"\\mathbf{t}_i = \\text{Linear}(x_i^{1:T}) \\in \\mathbb{R}^d"}),". The Transformer then computes:"]}),e.jsx(t.BlockMath,{math:"\\text{Attention}(Q, K, V) \\text{ where each token } = \\text{one variate}"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:["This is efficient when the number of variates"," ",e.jsx(t.InlineMath,{math:"N \\ll T"})," (e.g., 321 sensors × 720 time steps), and captures inter-variate correlations instead of temporal correlations."]}),e.jsx("div",{className:"my-4 overflow-x-auto",children:e.jsxs("table",{className:"min-w-full text-sm border border-gray-200 rounded-lg",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Aspect"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"PatchTST"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"iTransformer"})]})}),e.jsx("tbody",{children:[["Token definition","Time-step patch (P consecutive steps)","One full variate (T steps)"],["Attention axis","Across time (patches)","Across variates"],["Complexity","O((T/P)²)","O(N²)"],["Best for","Long sequences (T ≫ N)","Many correlated variates (N ≫ T/P)"],["Channel interaction","None (CI)","Full cross-variate attention"]].map(([s,o,n])=>e.jsxs("tr",{className:"border-t border-gray-200 hover:bg-gray-50",children:[e.jsx("td",{className:"px-4 py-2 font-medium text-gray-700",children:s}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:o}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:n})]},s))})]})}),e.jsx(x,{title:"Choosing Patch Size and Stride",children:e.jsxs("p",{className:"text-sm text-gray-700",children:["Common settings from the original paper:"," ",e.jsx("code",{children:"patch_len=16, stride=8"})," (50% overlap) for hourly data. Larger patches reduce the token count further but lose fine-grained temporal resolution. Overlapping patches (stride ","<"," patch_len) improve boundary continuity. A good starting point: set the patch size to approximately the dominant short cycle (e.g., 24 for hourly daily cycle, 7 for daily weekly cycle)."]})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Implementation"}),e.jsx(u,{code:ae}),e.jsxs(p,{title:"Input Size Must Be Divisible",children:["PatchTST requires that the input window size, patch length, and stride are consistent. With non-overlapping patches, set"," ",e.jsx("code",{children:"input_size = N × patch_len"})," for some integer"," ",e.jsx(t.InlineMath,{math:"N"}),". With overlapping patches and stride"," ",e.jsx("code",{children:"s"}),", check that ",e.jsx("code",{children:"(input_size - patch_len) % stride == 0"}),". Inconsistent settings will cause shape errors in the embedding layer."]}),e.jsx(c,{title:"When to Use PatchTST vs. iTransformer",children:e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"PatchTST:"})," univariate or low-dimensional multivariate long-horizon forecasting. Best when T is large and cross-variate correlation is less important."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"iTransformer:"})," high-dimensional multivariate datasets (many correlated sensors or assets) where cross-variate dependencies drive predictability."]}),e.jsx("li",{children:"Both significantly outperform vanilla Transformers on standard benchmarks; choose based on your data dimensionality profile."})]})}),e.jsx(f,{references:[{author:"Nie, Y., Nguyen, N. H., Sinthong, P., & Kalagnanam, J.",year:2023,title:"A Time Series is Worth 64 Words: Long-term Forecasting with Transformers",venue:"ICLR"},{author:"Liu, Y., Hu, T., Zhang, H., et al.",year:2024,title:"iTransformer: Inverted Transformers Are Effective for Time Series Forecasting",venue:"ICLR"},{author:"Dosovitskiy, A., et al.",year:2021,title:"An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",venue:"ICLR"}]})]})}const Ne=Object.freeze(Object.defineProperty({__proto__:null,default:se},Symbol.toStringTag,{value:"Module"})),b=[{name:"NHITS",category:"MLP",horizon:"Long",strengths:"Hierarchical interpolation, parameter-efficient"},{name:"NBEATS",category:"MLP",horizon:"Medium",strengths:"Interpretable trend/seasonality decomposition"},{name:"TFT",category:"Transformer",horizon:"Medium",strengths:"Rich covariates, quantile outputs, interpretable VSN"},{name:"PatchTST",category:"Transformer",horizon:"Long",strengths:"Patch tokenization, efficient long-horizon"},{name:"LSTM",category:"RNN",horizon:"Short-Med",strengths:"Robust, low-data, sequential dynamics"},{name:"MQRNN",category:"RNN",horizon:"Medium",strengths:"Parallel quantile decoding, seq2seq"},{name:"TCN",category:"CNN",horizon:"Medium",strengths:"Dilated convolutions, fast training"},{name:"DeepAR",category:"RNN",horizon:"Medium",strengths:"Autoregressive probabilistic, distribution output"},{name:"iTransformer",category:"Transformer",horizon:"Long",strengths:"Inverted attention, multivariate correlations"},{name:"TimesNet",category:"CNN",horizon:"Long",strengths:"2D temporal convolution, seasonal patterns"}];function re(){const[s,o]=h.useState("All"),n=["All","MLP","Transformer","RNN","CNN"],i=s==="All"?b:b.filter(a=>a.category===s),r={MLP:"bg-blue-100 text-blue-800",Transformer:"bg-purple-100 text-purple-800",RNN:"bg-green-100 text-green-800",CNN:"bg-orange-100 text-orange-800"};return e.jsxs("div",{className:"my-6",children:[e.jsx("div",{className:"flex gap-2 mb-3 flex-wrap",children:n.map(a=>e.jsx("button",{onClick:()=>o(a),className:`px-3 py-1 rounded text-sm border transition-all ${s===a?"bg-gray-800 text-white border-gray-800":"bg-white text-gray-700 border-gray-300 hover:border-gray-500"}`,children:a},a))}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs("table",{className:"min-w-full text-sm",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Model"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Type"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Horizon"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Key Strengths"})]})}),e.jsx("tbody",{children:i.map(a=>e.jsxs("tr",{className:"border-t border-gray-200 hover:bg-gray-50",children:[e.jsx("td",{className:"px-4 py-2 font-mono font-medium text-gray-900",children:a.name}),e.jsx("td",{className:"px-4 py-2",children:e.jsx("span",{className:`px-2 py-0.5 rounded text-xs font-medium ${r[a.category]}`,children:a.category})}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:a.horizon}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:a.strengths})]},a.name))})]})})]})}const ne=`# pip install neuralforecast
from neuralforecast import NeuralForecast
from neuralforecast.models import NHITS, TFT, LSTM
from neuralforecast.losses.pytorch import MAE, MQLoss
import pandas as pd
import numpy as np

# ── 1. Data format ─────────────────────────────────────────────────────────
# NeuralForecast uses long-format DataFrames with 3 required columns:
#   unique_id : series identifier (str or int)
#   ds        : datetime column
#   y         : target value (float)
# Extra columns become covariates.

np.random.seed(42)
n_series, T = 30, 96
records = []
for uid in range(n_series):
    dates = pd.date_range('2020-01-01', periods=T, freq='ME')
    y = (50 + 10 * (uid % 5) +
         20 * np.sin(2 * np.pi * np.arange(T) / 12) +
         5  * np.random.randn(T))
    for d, v in zip(dates, y):
        records.append({'unique_id': f'series_{uid}', 'ds': d, 'y': float(v)})
df = pd.DataFrame(records)
print(f"Panel: {df['unique_id'].nunique()} series, {T} steps each")

# ── 2. Define models ───────────────────────────────────────────────────────
horizon = 12

models = [
    NHITS(
        h=horizon,
        input_size=3 * horizon,
        n_freq_downsample=[4, 2, 1],
        loss=MAE(),
        max_steps=300,
        random_seed=42,
    ),
    TFT(
        h=horizon,
        input_size=3 * horizon,
        hidden_size=32,
        n_head=4,
        loss=MQLoss(level=[10, 50, 90]),
        max_steps=300,
        random_seed=42,
    ),
    LSTM(
        h=horizon,
        input_size=2 * horizon,
        encoder_hidden_size=64,
        encoder_n_layers=2,
        loss=MAE(),
        max_steps=300,
        random_seed=42,
    ),
]

# ── 3. Train ───────────────────────────────────────────────────────────────
nf = NeuralForecast(models=models, freq='ME')
nf.fit(df)
# All models are trained globally on all series simultaneously.
# Under the hood: PyTorch Lightning with optional early stopping.

# ── 4. Predict ────────────────────────────────────────────────────────────
forecasts = nf.predict()
print(forecasts.head())
# Columns: unique_id, ds, NHITS, TFT-lo-10, TFT-median, TFT-hi-90, LSTM

# ── 5. Cross-validation ────────────────────────────────────────────────────
cv = nf.cross_validation(df, n_windows=3, step_size=horizon)
print(cv.head())
# Columns: unique_id, ds, cutoff, y (actual), NHITS, TFT-median, LSTM

# ── 6. Evaluation ─────────────────────────────────────────────────────────
from neuralforecast.losses.numpy import mae, smape
actuals = cv['y'].values
nhits   = cv['NHITS'].values
print(f"N-HiTS MAE:   {mae(nhits, actuals):.3f}")
print(f"N-HiTS SMAPE: {smape(nhits, actuals):.3f}")

# ── 7. Save and load ──────────────────────────────────────────────────────
nf.save('my_models/')
nf_loaded = NeuralForecast.load('my_models/')
preds2 = nf_loaded.predict()
`;function ie(){return e.jsxs(m,{title:"NeuralForecast Library",difficulty:"intermediate",readingTime:13,children:[e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"NeuralForecast is a Python library from Nixtla that provides a unified interface for training, evaluating, and deploying deep learning forecasting models. It abstracts PyTorch Lightning boilerplate while offering access to state-of-the-art architectures — LSTM, TFT, PatchTST, N-HiTS, and more — through a consistent scikit-learn-style API."}),e.jsxs(d,{title:"NeuralForecast Design Philosophy",children:["NeuralForecast is built around three principles:",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Long-format data:"})," all series share one DataFrame with ",e.jsx("code",{children:"unique_id"}),", ",e.jsx("code",{children:"ds"}),", ",e.jsx("code",{children:"y"})," columns — identical to StatsForecast and MLForecast."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Global training:"})," all series in the panel are trained together, enabling cross-series knowledge transfer."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Unified API:"})," every model exposes the same ",e.jsx("code",{children:"fit"})," / ",e.jsx("code",{children:"predict"})," / ",e.jsx("code",{children:"cross_validation"})," interface regardless of architecture."]})]})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Available Models"}),e.jsx(re,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Long-Format Data"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"Every row in a NeuralForecast DataFrame represents one observation: one series at one time point. This makes it easy to concatenate multiple series and add covariates as additional columns:"}),e.jsx("div",{className:"my-3 overflow-x-auto rounded border border-gray-200",children:e.jsxs("table",{className:"min-w-full text-sm",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsx("tr",{children:["unique_id","ds","y","holiday_flag"].map(s=>e.jsx("th",{className:"px-4 py-2 text-left font-mono text-gray-700",children:s},s))})}),e.jsx("tbody",{children:[["store_A","2023-01-01","1042.5","0"],["store_A","2023-01-08","1158.2","1"],["store_B","2023-01-01","842.1","0"],["store_B","2023-01-08","799.3","0"]].map((s,o)=>e.jsx("tr",{className:"border-t border-gray-200",children:s.map((n,i)=>e.jsx("td",{className:"px-4 py-2 font-mono text-gray-600 text-xs",children:n},i))},o))})]})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Global Training"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:[e.jsx("code",{children:"nf.fit(df)"})," trains a ",e.jsx("em",{children:"single shared model"})," on all series simultaneously. This is fundamentally different from fitting one model per series. Global training:"]}),e.jsxs("ul",{className:"list-disc ml-6 mt-2 space-y-1 text-gray-700 text-sm",children:[e.jsx("li",{children:"Transfers patterns across series (holiday shapes, trend dynamics)"}),e.jsx("li",{children:"Works for cold-start series with little history"}),e.jsx("li",{children:"Requires scale normalization — NeuralForecast applies RevIN automatically"})]}),e.jsx(g,{title:"Cross-Validation Without Refitting",children:e.jsxs("p",{children:[e.jsx("code",{children:"nf.cross_validation(n_windows=k, step_size=H)"})," evaluates the ",e.jsx("em",{children:"already-trained"})," model on ",e.jsx(t.InlineMath,{math:"k"})," rolling windows shifted by ",e.jsx(t.InlineMath,{math:"H"})," steps — no refitting. Each window uses the same trained weights, making evaluation fast but not accounting for distribution shift. For time-series that change over time, use ",e.jsx("code",{children:"refit=True"})," to retrain at each cutoff."]})}),e.jsx(x,{title:"max_steps vs. Epochs",children:e.jsxs("p",{className:"text-sm text-gray-700",children:["NeuralForecast uses ",e.jsx("code",{children:"max_steps"}),' (gradient update count) rather than epochs, because batch construction across many short series makes "epoch" ambiguous. A practical guide: ',e.jsx("code",{children:"max_steps=300"})," ","for quick prototyping, 500–1000 for production. Enable early stopping with ",e.jsx("code",{children:"early_stop_patience_steps=50"})," to avoid overfitting. Training progress is logged to the console via PyTorch Lightning."]})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Complete Pipeline"}),e.jsx(u,{code:ne}),e.jsxs(p,{title:"Frequency Must Match Your Data",children:["The ",e.jsx("code",{children:"freq"})," argument to ",e.jsx("code",{children:"NeuralForecast(freq=...)"})," ","must match the actual granularity of your ",e.jsx("code",{children:"ds"})," column. It is used to generate future dates during ",e.jsx("code",{children:"predict()"})," and to create calendar-based features. Use pandas aliases: ",e.jsx("code",{children:"'D'"}),","," ",e.jsx("code",{children:"'W'"}),", ",e.jsx("code",{children:"'ME'"})," (month-end), ",e.jsx("code",{children:"'MS'"})," ","(month-start), ",e.jsx("code",{children:"'h'"})," (hourly). A mismatch causes silently incorrect prediction timestamps."]}),e.jsx(c,{title:"NeuralForecast vs. Alternatives",children:e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"NeuralForecast (Nixtla):"})," broadest model selection, Nixtla ecosystem, easiest API — best starting point."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"pytorch-forecasting:"})," richer covariate handling, tighter PyTorch control, good for custom architectures."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"GluonTS (AWS):"})," strong probabilistic models (DeepAR, WaveNet), production-grade."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Darts:"})," unified classical + ML + DL API, best for single-series workflows."]})]})}),e.jsx(f,{references:[{author:"Olivares, K. G., et al.",year:2023,title:"Neural basis expansion analysis with exogenous variables: Forecasting electricity prices with NBEATSx",venue:"International Journal of Forecasting"},{author:"Challu, C., et al.",year:2023,title:"N-HiTS: Neural Hierarchical Interpolation for Time Series Forecasting",venue:"AAAI"}]})]})}const ve=Object.freeze(Object.defineProperty({__proto__:null,default:ie},Symbol.toStringTag,{value:"Module"})),oe=[{param:"learning_rate",impact:"High",range:"1e-4 – 1e-2",tip:"Log-uniform search; 1e-3 is a safe default"},{param:"hidden_size",impact:"High",range:"32 – 512",tip:"Double iteratively; diminishing returns above 256"},{param:"input_size",impact:"High",range:"2H – 10H",tip:"At least 2x seasonal period"},{param:"dropout",impact:"Medium",range:"0.0 – 0.4",tip:"Increase if validation loss diverges from train"},{param:"batch_size",impact:"Medium",range:"16 – 256",tip:"Larger = faster training; smaller = better generalization"},{param:"n_layers",impact:"Medium",range:"1 – 4",tip:"Rarely beneficial above 3"},{param:"max_steps",impact:"Low",range:"300 – 2000",tip:"Use early stopping instead of tuning this"}];function le(){const s={High:"bg-red-100 text-red-800",Medium:"bg-yellow-100 text-yellow-800",Low:"bg-green-100 text-green-800"};return e.jsx("div",{className:"my-6 overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs("table",{className:"min-w-full text-sm",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Parameter"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Impact"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Typical Range"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Tip"})]})}),e.jsx("tbody",{children:oe.map(o=>e.jsxs("tr",{className:"border-t border-gray-200 hover:bg-gray-50",children:[e.jsx("td",{className:"px-4 py-2 font-mono text-gray-900",children:o.param}),e.jsx("td",{className:"px-4 py-2",children:e.jsx("span",{className:`px-2 py-0.5 rounded text-xs font-medium ${s[o.impact]}`,children:o.impact})}),e.jsx("td",{className:"px-4 py-2 text-gray-600 font-mono text-xs",children:o.range}),e.jsx("td",{className:"px-4 py-2 text-gray-600 text-xs",children:o.tip})]},o.param))})]})})}const de=`from neuralforecast import NeuralForecast
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
`;function ce(){return e.jsxs(m,{title:"Hyperparameter Tuning for DL Forecasters",difficulty:"advanced",readingTime:11,children:[e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Deep learning forecasting models have many hyperparameters — architecture size, learning rate, dropout, look-back window — that strongly affect performance. NeuralForecast provides ",e.jsx("code",{children:"AutoModel"})," wrappers (AutoNHITS, AutoTFT, AutoLSTM) that integrate with Ray Tune to automatically search for good configurations."]}),e.jsxs(d,{title:"AutoModel in NeuralForecast",children:["NeuralForecast's ",e.jsx("strong",{children:"Auto"})," variants (e.g.,"," ",e.jsx("code",{children:"AutoNHITS"}),") wrap the corresponding model with a Ray Tune hyperparameter search. They run ",e.jsx("code",{children:"num_samples"})," random trials, each training with a different hyperparameter configuration, and select the best based on validation loss. The best model is optionally refit on the full training + validation data."]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Hyperparameter Impact Guide"}),e.jsx(le,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Search Strategies"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"Three common approaches, in order of increasing compute cost:"}),e.jsxs("ol",{className:"list-decimal ml-6 mt-2 space-y-2 text-gray-700 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Random search:"})," sample configurations uniformly at random. Surprisingly effective — with 20–50 trials, random search finds near-optimal configurations for most forecasting tasks. This is what AutoNHITS/AutoTFT use by default."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bayesian optimization (Optuna/BOHB):"})," fits a surrogate model of the objective to choose the next trial intelligently. Better than random for high-dimensional search spaces with many interactions."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Population-Based Training (PBT):"})," evolves a population of models, copying weights from good configurations and mutating hyperparameters. Useful for long-training models where early stopping information is expensive to compute."]})]}),e.jsxs(g,{title:"ASHA: Asynchronous Successive Halving",children:[e.jsx("p",{children:"Ray Tune's default scheduler for NeuralForecast is ASHA (Asynchronous Successive Halving). It aggressively terminates bad trials early by comparing intermediate validation metrics:"}),e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsx("li",{children:"All trials start with a small budget (few training steps)."}),e.jsx("li",{children:"The bottom half of trials (by validation loss) are stopped."}),e.jsx("li",{children:"Survivors get double the budget."}),e.jsx("li",{children:"This continues until only 1 trial remains with the full budget."})]}),e.jsxs("p",{className:"text-sm mt-2",children:["ASHA provides nearly the same result as fully training all trials but uses roughly ",e.jsx(t.InlineMath,{math:"\\log_2(n)"})," times less compute for"," ",e.jsx(t.InlineMath,{math:"n"})," trials."]})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Implementation"}),e.jsx(u,{code:de}),e.jsx(x,{title:"When AutoModels Are Worth the Cost",children:e.jsx("p",{className:"text-sm text-gray-700",children:"Automated tuning is worth the compute when: (a) you will deploy the model in production for months, (b) the dataset is large enough that architecture choices matter, or (c) the accuracy gain justifies the cost. For quick experiments or baseline comparisons, use the default hyperparameters — they are well-tuned starting points from the original papers. Reserve AutoModel search for final production training."})}),e.jsxs(p,{title:"Overfitting to Validation Set",children:["Running many hyperparameter trials risks ",e.jsx("em",{children:"meta-overfitting"}),": the selected configuration may be overfitted to the specific validation window used during search. Mitigate this by: (1) using a held-out test set that is never touched during tuning, (2) using multiple validation windows (",e.jsx("code",{children:"n_windows=3"}),"), and (3) limiting search to"," ",e.jsx(t.InlineMath,{math:"\\leq 50"})," trials for small datasets."]}),e.jsx(c,{title:"Compute Considerations",children:e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"CPU only:"})," limit to 10–20 trials, ",e.jsx("code",{children:"max_steps=200"}),". Good for fast models like N-HiTS."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Single GPU:"})," 30–50 trials, ",e.jsx("code",{children:"max_steps=500"}),". Suitable for TFT on medium datasets."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Multi-GPU / Ray cluster:"})," 100+ trials in parallel. Required for exhaustive search on large panels."]}),e.jsxs("li",{children:["Always set a ",e.jsx("code",{children:"time_budget_s"})," limit in Ray Tune to avoid runaway jobs."]})]})}),e.jsx(f,{references:[{author:"Li, L., et al.",year:2018,title:"Massively Parallel Hyperparameter Tuning",venue:"arXiv (ASHA)"},{author:"Liaw, R., et al.",year:2018,title:"Tune: A Research Platform for Distributed Model Selection and Training",venue:"ICML AutoML Workshop"},{author:"Bergstra, J., & Bengio, Y.",year:2012,title:"Random Search for Hyper-Parameter Optimization",venue:"JMLR"}]})]})}const we=Object.freeze(Object.defineProperty({__proto__:null,default:ce},Symbol.toStringTag,{value:"Module"}));export{fe as a,ge as b,ye as c,_e as d,be as e,je as f,Te as g,Ne as h,ve as i,we as j,xe as s};
