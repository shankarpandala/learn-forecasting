import{j as e,r as p}from"./vendor-CnSysweu.js";import{r}from"./vendor-katex-CdqB51LS.js";import{S as f,D as c,T as b,E as h,P as u,W as x,N as g,R as y}from"./subject-01-ts-foundations-fmj7uPpc.js";import{R as _,B as S,C as v,X as T,Y as M,T as k,d as P,c as j,L as O,a as C,b as B}from"./vendor-charts-BucFqer8.js";function D(){const[t,o]=p.useState("classical"),i={classical:{label:"Classical (ARIMA, ETS)",steps:["Identify model order (ACF/PACF)","Fit parameters per series","Diagnose residuals","Forecast","Re-fit when new data arrives"],pros:["Interpretable parameters","Works with short series (20+ pts)","No GPU needed","Exact CIs under assumptions"],cons:["Manual per-series workflow","Cannot leverage related series","Poor complex seasonality","No zero-shot capability"],btnClass:"bg-blue-600",bgClass:"bg-blue-50 border-blue-200"},dl:{label:"Deep Learning (TFT, N-HiTS)",steps:["Collect large panel dataset","Choose architecture & HPs","Train globally on all series","Predict (fast inference)","Periodic re-training"],pros:["Learns cross-series patterns","Handles complex seasonality","Rich covariate support","Scales to millions of series"],cons:["Requires large training data","GPU needed","HP tuning required","Domain-specific — retrain for new domain"],btnClass:"bg-green-600",bgClass:"bg-green-50 border-green-200"},foundation:{label:"Foundation Models (TimeGPT, Chronos)",steps:["Pre-trained on billions of time points","API call / load model","Zero-shot forecast","Optional fine-tuning","Prediction"],pros:["Zero-shot — works immediately","No training data needed","General-purpose","Probabilistic outputs"],cons:["Black-box","API costs (commercial)","May underperform specialists","Rapidly evolving"],btnClass:"bg-purple-600",bgClass:"bg-purple-50 border-purple-200"}},s=i[t];return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"Forecasting Paradigm Comparison"}),e.jsx("div",{className:"flex gap-2 mb-4 flex-wrap",children:Object.entries(i).map(([a,l])=>e.jsx("button",{onClick:()=>o(a),className:`px-3 py-2 rounded text-sm border-2 font-medium transition-all ${t===a?`${l.btnClass} text-white border-transparent`:"bg-white text-gray-700 border-gray-300"}`,children:l.label},a))}),e.jsx("div",{className:`p-4 rounded-lg border ${s.bgClass}`,children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold text-gray-500 uppercase mb-2",children:"Workflow"}),e.jsx("ol",{className:"space-y-1",children:s.steps.map((a,l)=>e.jsxs("li",{className:"text-xs text-gray-700 flex gap-2 items-start",children:[e.jsx("span",{className:`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold ${s.btnClass}`,children:l+1}),a]},l))})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold text-gray-500 uppercase mb-2",children:"Advantages"}),e.jsx("ul",{className:"space-y-1",children:s.pros.map(a=>e.jsxs("li",{className:"text-xs text-gray-700 flex gap-1",children:[e.jsx("span",{className:"text-green-500 font-bold",children:"+"}),a]},a))})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold text-gray-500 uppercase mb-2",children:"Limitations"}),e.jsx("ul",{className:"space-y-1",children:s.cons.map(a=>e.jsxs("li",{className:"text-xs text-gray-700 flex gap-1",children:[e.jsx("span",{className:"text-red-500 font-bold",children:"−"}),a]},a))})]})]})})]})}const U=`# Three foundation model options — minimal code to get started

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
`;function W(){return e.jsxs(f,{title:"The Foundation Model Paradigm",difficulty:"intermediate",readingTime:11,children:[e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Foundation models represent a fundamental shift in time series forecasting. Instead of fitting a model per series or training on domain-specific data, a foundation model is pre-trained on a massive and diverse corpus of time series, then applied ",e.jsx("em",{children:"directly"})," to new series without any additional training — a capability called"," ",e.jsx("strong",{children:"zero-shot forecasting"}),"."]}),e.jsxs(c,{title:"Foundation Models for Time Series",children:["A ",e.jsx("strong",{children:"foundation model"})," is a large neural network pre-trained on a diverse collection of time series from many domains (finance, energy, weather, retail, etc.). At inference, it accepts an arbitrary historical context and produces forecasts for the next ",e.jsx(r.InlineMath,{math:"H"})," steps — without any task-specific training. This mirrors how GPT-4 answers questions on any topic without fine-tuning."]}),e.jsx(D,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"What Made This Possible"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"Three factors converged around 2023–2024 to enable foundation models for time series:"}),e.jsxs("ol",{className:"list-decimal ml-6 mt-2 space-y-2 text-gray-700 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Massive diverse datasets:"})," LOTSA, Monash, and other archives aggregated ",e.jsx("em",{children:"billions"})," of time points across heterogeneous domains, providing enough variety for a model to learn transferable temporal dynamics."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Scalable Transformer architectures:"})," the same self-attention used in LLMs scales naturally to sequences of time-series tokens — whether raw values, patches, or quantized bins."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tokenization innovations:"})," researchers devised ways to represent time series as discrete tokens (quantization in Chronos, patch embeddings in TimesFM), enabling standard language model training to apply directly to numerical sequences."]})]}),e.jsx(b,{title:"The LOTSA Pre-Training Corpus",children:e.jsxs("p",{children:["LOTSA (Woo et al., 2024) is the pre-training dataset used by Moirai. It contains over ",e.jsx("strong",{children:"27 billion observations"})," from 9 time-series collections spanning multiple domains (energy, finance, traffic, weather, sales) and frequencies (sub-hourly to yearly). The diversity is crucial: a model trained only on electricity data would not generalize to retail demand or medical sensors."]})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Zero-Shot vs. Fine-Tuned Foundation Models"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["In the ",e.jsx("strong",{children:"zero-shot"})," setting, the foundation model receives only the historical context and generates forecasts directly — no exposure to the target series during training. Performance depends on how well the target distribution is represented in the pre-training corpus."]}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:[e.jsx("strong",{children:"Fine-tuning"})," adapts pre-trained weights using a small amount of domain-specific data (few-shot learning). This bridges the distribution gap, often substantially improving accuracy on niche domains (specialized industrial IoT, rare financial instruments) that are underrepresented in pre-training."]}),e.jsx("div",{className:"my-4 overflow-x-auto",children:e.jsxs("table",{className:"min-w-full text-sm border border-gray-200 rounded-lg",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsx("tr",{children:["Model","Organization","Zero-Shot","Fine-Tune","Access"].map(t=>e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:t},t))})}),e.jsx("tbody",{children:[["TimeGPT","Nixtla","Yes","Yes","API (paid)"],["Chronos","Amazon","Yes","Yes","Open-source (HuggingFace)"],["TimesFM","Google","Yes","Limited","Open-source (HuggingFace)"],["Moirai","Salesforce","Yes","Yes","Open-source (HuggingFace)"],["Lag-Llama","Academic","Yes","Yes","Open-source (HuggingFace)"],["MOMENT","CMU","Partial","Yes","Open-source (HuggingFace)"]].map(([t,o,i,s,a])=>e.jsxs("tr",{className:"border-t border-gray-200 hover:bg-gray-50",children:[e.jsx("td",{className:"px-4 py-2 font-mono font-medium text-gray-900",children:t}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:o}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:i}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:s}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:a})]},t))})]})}),e.jsx(h,{title:"When Zero-Shot Forecasting Shines",children:e.jsxs("p",{className:"text-sm text-gray-700",children:["Zero-shot forecasting is especially valuable for:"," ",e.jsx("strong",{children:"cold-start problems"})," (new series with no training history), ",e.jsx("strong",{children:"rapid prototyping"})," (forecast in minutes without model training), ",e.jsx("strong",{children:"low-volume series"})," (too little history to train a reliable local model), and"," ",e.jsx("strong",{children:"diverse portfolios"})," where building separate models for hundreds of different data types is infeasible."]})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Quick Start"}),e.jsx(u,{code:U}),e.jsx(x,{title:"Foundation Models Are Not Always Best",children:"On well-studied benchmarks (ETT, M4, M5), a properly tuned N-HiTS or TFT often outperforms zero-shot foundation models. Foundation models excel at generality, cold-start convenience, and breadth across domains — not necessarily peak accuracy where a specialist model has been carefully tuned. Always benchmark against simpler baselines before committing to a foundation model in production."}),e.jsx(g,{title:"The Road Ahead",children:e.jsx("p",{className:"text-sm text-gray-700",children:"Foundation model research for time series is moving rapidly. Key open problems: incorporating covariates and metadata natively, handling irregular or multivariate series, and rigorous zero-shot evaluation protocols. The landscape will likely look substantially different in 12–18 months as larger and better-evaluated models emerge."})}),e.jsx(y,{references:[{author:"Ansari, A. F., et al.",year:2024,title:"Chronos: Learning the Language of Time Series",venue:"arXiv"},{author:"Woo, G., et al.",year:2024,title:"Unified Training of Universal Time Series Forecasting Transformers",venue:"ICML (Moirai)"},{author:"Garza, A., & Mergenthaler-Canseco, M.",year:2023,title:"TimeGPT-1",venue:"arXiv"},{author:"Das, A., et al.",year:2024,title:"A Decoder-Only Foundation Model for Time-Series Forecasting",venue:"ICML (TimesFM)"}]})]})}const _e=Object.freeze(Object.defineProperty({__proto__:null,default:W},Symbol.toStringTag,{value:"Module"})),z={"GIFT-Eval":[{model:"TimeGPT-1",score:.821},{model:"Chronos-L",score:.793},{model:"Moirai-L",score:.774},{model:"TimesFM",score:.762},{model:"N-BEATS",score:.711},{model:"AutoARIMA",score:.648}],"M4 (SMAPE)":[{model:"TimeGPT-1",score:.748},{model:"Chronos-L",score:.776},{model:"Moirai-L",score:.741},{model:"TimesFM",score:.719},{model:"N-BEATS",score:.851},{model:"AutoARIMA",score:.7}],"ETT (MASE)":[{model:"TimeGPT-1",score:.803},{model:"Chronos-L",score:.762},{model:"Moirai-L",score:.811},{model:"TimesFM",score:.79},{model:"N-BEATS",score:.682},{model:"AutoARIMA",score:.601}],"Weather (RMSE)":[{model:"TimeGPT-1",score:.772},{model:"Chronos-L",score:.744},{model:"Moirai-L",score:.783},{model:"TimesFM",score:.798},{model:"N-BEATS",score:.651},{model:"AutoARIMA",score:.553}],"Monash (CRPS)":[{model:"TimeGPT-1",score:.808},{model:"Chronos-L",score:.819},{model:"Moirai-L",score:.796},{model:"TimesFM",score:.771},{model:"N-BEATS",score:.688},{model:"AutoARIMA",score:.633}]},F={MASE:{label:"Mean Absolute Scaled Error",description:"Scales MAE by naive seasonal in-sample MAE. MASE < 1 beats the seasonal naïve baseline. Scale-free and always defined.",formula:"\\text{MASE} = \\frac{\\frac{1}{h}\\sum|y_t - \\hat{y}_t|}{\\frac{1}{n-s}\\sum|y_t - y_{t-s}|}"},SMAPE:{label:"Symmetric MAPE",description:"Bounded in [0, 200%]. Symmetric treatment of over- and under-forecasts. Still unstable when |y_t| + |ŷ_t| ≈ 0.",formula:"\\text{SMAPE} = \\frac{200}{h}\\sum\\frac{|y_t - \\hat{y}_t|}{|y_t|+|\\hat{y}_t|}"},RMSE:{label:"Root Mean Squared Error",description:"Same units as the target. Penalizes large errors quadratically — sensitive to outliers but useful when large errors are especially costly.",formula:"\\text{RMSE} = \\sqrt{\\frac{1}{h}\\sum(y_t - \\hat{y}_t)^2}"},MAE:{label:"Mean Absolute Error",description:"Robust to outliers, easy to interpret. Optimal estimator under Laplace (double-exponential) noise assumption.",formula:"\\text{MAE} = \\frac{1}{h}\\sum|y_t - \\hat{y}_t|"},CRPS:{label:"Continuous Ranked Probability Score",description:"Proper scoring rule for full predictive CDFs. Reduces to MAE for deterministic forecasts. Lower is better.",formula:"\\text{CRPS}(F, y) = \\int_{-\\infty}^{\\infty}(F(x) - \\mathbf{1}[x \\geq y])^2\\,dx"},WQL:{label:"Weighted Quantile Loss",description:"Average pinball (quantile) loss across multiple quantile levels, normalized by total actuals. The primary metric for M5 Uncertainty.",formula:"\\text{WQL} = \\frac{2}{|\\mathcal{Q}|}\\sum_{q}\\frac{\\sum_t \\rho_q(y_t - \\hat{y}_t^q)}{\\sum_t|y_t|}"},"Energy Score":{label:"Energy Score",description:"Multivariate proper scoring rule — generalizes CRPS to joint distributions. Used for evaluating multivariate probabilistic forecasts.",formula:"\\text{ES}(F,\\mathbf{y}) = \\mathbb{E}\\|\\mathbf{X}-\\mathbf{y}\\| - \\tfrac{1}{2}\\mathbb{E}\\|\\mathbf{X}-\\mathbf{X}'\\|"}},K=`import pandas as pd
import numpy as np
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA, AutoETS, SeasonalNaive
from datasetsforecast.m4 import M4

# ── Load M4 Monthly ────────────────────────────────────────────────────────────
train, test, _ = M4.load(directory="data", group="Monthly")
print(f"Series: {train['unique_id'].nunique()}, horizon: {test.shape[0]}")

# ── Classical baseline ─────────────────────────────────────────────────────────
sf = StatsForecast(
    models=[AutoARIMA(), AutoETS(), SeasonalNaive(season_length=12)],
    freq="ME",
    n_jobs=-1,
)
forecasts = sf.forecast(df=train, h=18)

# ── MASE helper ────────────────────────────────────────────────────────────────
def mase(y_true, y_pred, y_train, s=12):
    mae_pred = np.mean(np.abs(np.asarray(y_true) - np.asarray(y_pred)))
    naive_mae = np.mean(np.abs(y_train[s:] - y_train[:-s]))
    return mae_pred / naive_mae if naive_mae > 0 else np.nan

# ── CRPS via properscoring ─────────────────────────────────────────────────────
# pip install properscoring chronos-forecasting
import properscoring as ps
import torch
from chronos import ChronosPipeline

pipeline = ChronosPipeline.from_pretrained(
    "amazon/chronos-t5-large",
    device_map="cpu",
    torch_dtype=torch.bfloat16,
)

contexts, actuals = [], []
for uid, grp in train.groupby("unique_id"):
    contexts.append(torch.tensor(grp["y"].values[-64:], dtype=torch.float32))
    actuals.append(test.loc[test["unique_id"] == uid, "y"].values)

# Returns shape (N_series, N_samples, horizon)
samples = pipeline.predict(contexts, prediction_length=18, num_samples=100)

# CRPS per series, then average
crps_vals = []
for i, obs in enumerate(actuals):
    s = samples[i].numpy()           # (100, 18)
    for t, y in enumerate(obs):
        crps_vals.append(ps.crps_ensemble(y, s[:, t]))

print(f"Mean CRPS: {np.mean(crps_vals):.4f}")

# ── WQL helper ────────────────────────────────────────────────────────────────
def wql(y_true, quantile_preds, quantiles):
    """
    y_true: array (T,)
    quantile_preds: dict {q: array (T,)}
    quantiles: list of quantile levels
    """
    total_loss = 0
    for q in quantiles:
        err = y_true - quantile_preds[q]
        pinball = np.where(err >= 0, q * err, (q - 1) * err)
        total_loss += 2 * pinball.mean()
    return total_loss / (len(quantiles) * np.mean(np.abs(y_true)))
`;function H(){const[t,o]=p.useState("GIFT-Eval"),[i,s]=p.useState("CRPS"),a=z[t],l=F[i];return e.jsxs(f,{title:"Foundation Model Benchmark Landscape",difficulty:"intermediate",readingTime:10,children:[e.jsx("p",{children:"Comparing foundation models for time series requires standardized datasets and carefully chosen metrics. This section surveys the six primary benchmark suites, explains point and probabilistic evaluation metrics, and provides practical guidance on when zero-shot foundation models outperform classical approaches."}),e.jsx("h2",{children:"Primary Benchmark Datasets"}),e.jsx(c,{term:"GIFT-Eval",children:"A large-scale benchmark (2024) covering 144,000+ time series from 23 datasets across multiple frequencies and domains. Designed specifically to test zero-shot generalization — training data for foundation models was carefully screened to avoid overlap with the test splits."}),e.jsx(c,{term:"Monash Time Series Archive",children:"A curated collection of 30+ real-world datasets spanning retail, energy, tourism, weather, and finance. The standard heterogeneous benchmark for evaluating statistical, ML, and deep learning methods at scale."}),e.jsx(c,{term:"M4 Competition",children:"100,000 time series across six frequencies (yearly through hourly). Remains the canonical point-forecast benchmark. N-BEATS and ES-RNN first demonstrated that deep learning could outperform classical methods here."}),e.jsxs(c,{term:"ETT (Electricity Transformer Temperature)",children:["Four transformer-temperature datasets (ETTh1, ETTh2, ETTm1, ETTm2) from Chinese electricity grids. Dominant benchmark in academic papers for multivariate long-horizon evaluation at fixed horizons ","{","96, 192, 336, 720","}","."]}),e.jsx(c,{term:"PEMS Traffic Datasets",children:"California highway sensor data (PEMS-BAY, METR-LA, PEMS03/04/07/08) measuring traffic speed and occupancy. Used for spatiotemporal and graph neural network forecasting evaluation. High-resolution (5-minute) multivariate structure."}),e.jsx("h2",{children:"Point Forecast Metrics"}),e.jsxs("p",{children:["Point metrics compare a single forecast value ",e.jsx(r.InlineMath,{children:"\\hat{y}_t"})," to the actual ",e.jsx(r.InlineMath,{children:"y_t"}),". Each has distinct properties:"]}),e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("label",{style:{fontWeight:600,marginRight:"0.5rem"},children:"Select metric: "}),Object.keys(F).map(n=>e.jsx("button",{onClick:()=>s(n),style:{margin:"0.2rem",padding:"0.25rem 0.6rem",borderRadius:"4px",border:"1px solid #6366f1",background:i===n?"#6366f1":"#fff",color:i===n?"#fff":"#6366f1",cursor:"pointer",fontSize:"0.85rem"},children:n},n))]}),l&&e.jsxs("div",{style:{background:"#eef2ff",border:"1px solid #6366f1",borderRadius:"8px",padding:"1rem 1.25rem",marginBottom:"1.5rem"},children:[e.jsx("strong",{children:l.label}),e.jsx(r.BlockMath,{children:l.formula}),e.jsx("p",{style:{margin:0,fontSize:"0.9rem"},children:l.description})]}),e.jsxs(g,{title:"Why MASE is Preferred for Heterogeneous Benchmarks",children:["MAPE is undefined when ",e.jsx(r.InlineMath,{children:"y_t = 0"}),' (common in retail demand) and asymmetrically penalizes over-forecasts. SMAPE is bounded but still unstable near zero. MASE avoids both problems: it is always defined, scale-free, and interpretable as "did we beat naïve?".']}),e.jsx("h2",{children:"Probabilistic Metrics"}),e.jsxs(b,{title:"Proper Scoring Rules",children:["A scoring rule ",e.jsx(r.InlineMath,{children:"S(F, y)"})," is ",e.jsx("em",{children:"proper"})," if the true distribution ",e.jsx(r.InlineMath,{children:"P"})," minimizes expected score:",e.jsx(r.BlockMath,{children:"\\mathbb{E}_P[S(P, Y)] \\leq \\mathbb{E}_P[S(F, Y)] \\quad \\forall F \\neq P"}),"CRPS and WQL are both proper. A proper scoring rule cannot be gamed by misreporting your true beliefs — models are incentivized to report calibrated, sharp distributions."]}),e.jsx("h2",{children:"Interactive Model–Benchmark Comparison"}),e.jsx("p",{style:{fontSize:"0.9rem",color:"#6b7280"},children:"Scores are normalized relative performance indices (higher = better). Select a benchmark to see model rankings."}),e.jsx("div",{style:{marginBottom:"1rem"},children:Object.keys(z).map(n=>e.jsx("button",{onClick:()=>o(n),style:{margin:"0.2rem",padding:"0.3rem 0.8rem",borderRadius:"4px",border:"1px solid #0ea5e9",background:t===n?"#0ea5e9":"#fff",color:t===n?"#fff":"#0ea5e9",cursor:"pointer"},children:n},n))}),e.jsx(_,{width:"100%",height:300,children:e.jsxs(S,{data:a,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(v,{strokeDasharray:"3 3"}),e.jsx(T,{dataKey:"model",tick:{fontSize:12}}),e.jsx(M,{domain:[.5,1],tickFormatter:n=>n.toFixed(2)}),e.jsx(k,{formatter:n=>n.toFixed(3)}),e.jsx(P,{}),e.jsx(j,{dataKey:"score",name:"Relative Score",fill:"#6366f1",radius:[3,3,0,0]})]})}),e.jsx(x,{title:"Benchmark Leakage",children:"Several foundation models were pre-trained on data overlapping with ETT, M4, and Weather datasets. Published paper scores may be inflated. Always re-evaluate on held-out data from your specific domain before making deployment decisions."}),e.jsx("h2",{children:"When to Use Foundation Models vs Classical Methods"}),e.jsx(h,{title:"Foundation models are the right choice when...",children:e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Cold start:"})," new products/entities with fewer than 30 historical observations — no time to fit per-series models."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Scale:"})," millions of series where per-series tuning is computationally prohibitive."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mixed frequencies:"})," a unified pipeline must handle hourly, daily, and weekly series simultaneously."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Probabilistic output needed:"})," quantile forecasts without building separate quantile models per series."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cross-series patterns:"})," similar items (SKUs in a category) benefit from shared representations."]})]})}),e.jsx(h,{title:"Classical methods still win when...",children:e.jsxs("ul",{children:[e.jsx("li",{children:"Single long series with well-understood seasonality (e.g., monthly power load)."}),e.jsx("li",{children:"Interpretability required: ARIMA parameters have explicit statistical meaning."}),e.jsx("li",{children:"Latency-critical inference where loading a multi-GB model is impractical."}),e.jsx("li",{children:"Structural breaks requiring manual intervention that the model must encode explicitly."}),e.jsx("li",{children:"Regulatory environments requiring explainable forecast drivers."})]})}),e.jsx(u,{code:K,title:"Running Standard Benchmarks: statsforecast + Chronos"}),e.jsx(y,{references:[{title:"GIFT-Eval: A Benchmark for General Time Series Forecasting Model Evaluation",authors:"Aksu et al.",year:2024,venue:"arXiv:2410.10301"},{title:"Monash Time Series Forecasting Archive",authors:"Godahewa, Bergmeir, Webb, Hyndman, Montero-Manso",year:2021,venue:"NeurIPS Datasets & Benchmarks Track"},{title:"The M4 Competition: 100,000 time series and 61 forecasting methods",authors:"Makridakis, Spiliotis, Assimakopoulos",year:2020,venue:"International Journal of Forecasting"},{title:"Strictly Proper Scoring Rules, Prediction, and Estimation",authors:"Gneiting & Raftery",year:2007,venue:"Journal of the American Statistical Association"}]})]})}const ve=Object.freeze(Object.defineProperty({__proto__:null,default:H},Symbol.toStringTag,{value:"Module"}));function Y(){const t=[{title:"Point Forecasting",desc:"Zero-shot multi-step forecasts for any frequency — hourly, daily, weekly, monthly."},{title:"Prediction Intervals",desc:"Quantile forecasts (P10–P90) and confidence intervals from a single API call."},{title:"Anomaly Detection",desc:"Detects anomalous observations by comparing actuals to model expectations."},{title:"Exogenous Variables",desc:"Include future-known covariates (holidays, promotions) to improve accuracy."},{title:"Cross-Validation",desc:"Rolling-window CV for offline model evaluation without additional training."},{title:"Fine-Tuning",desc:"Domain-specific adaptation using your own time series data (paid tier)."}];return e.jsx("div",{className:"my-6 grid grid-cols-2 md:grid-cols-3 gap-3",children:t.map(o=>e.jsxs("div",{className:"p-3 bg-purple-50 border border-purple-200 rounded-lg",children:[e.jsx("p",{className:"text-sm font-semibold text-purple-800 mb-1",children:o.title}),e.jsx("p",{className:"text-xs text-purple-700",children:o.desc})]},o.title))})}const V=`# pip install nixtla
from nixtla import NixtlaClient
import pandas as pd
import numpy as np

client = NixtlaClient(api_key='YOUR_NIXTLA_API_KEY')

# ── 1. Basic zero-shot forecast ───────────────────────────────────────────
np.random.seed(42)
T = 200
dates = pd.date_range('2021-01-01', periods=T, freq='D')
t = np.arange(T)
y = 100 + 0.1*t + 10*np.sin(2*np.pi*t/7) + 2*np.random.randn(T)
df = pd.DataFrame({'unique_id': 'demo', 'ds': dates, 'y': y})

forecast = client.forecast(df, h=14, freq='D')
print(forecast)
# unique_id  ds          TimeGPT
# demo       2021-07-21  108.32  ...

# ── 2. Prediction intervals ────────────────────────────────────────────────
forecast_pi = client.forecast(df, h=14, freq='D', level=[80, 90, 95])
print(forecast_pi.columns.tolist())
# ['unique_id', 'ds', 'TimeGPT',
#  'TimeGPT-lo-80', 'TimeGPT-hi-80',
#  'TimeGPT-lo-90', 'TimeGPT-hi-90', ...]

# ── 3. With exogenous (future-known) variables ────────────────────────────
df['is_weekend'] = (pd.DatetimeIndex(df['ds']).dayofweek >= 5).astype(float)

future_dates = pd.date_range(dates[-1] + pd.Timedelta('1D'), periods=14, freq='D')
future_df = pd.DataFrame({
    'unique_id': 'demo',
    'ds': future_dates,
    'is_weekend': (pd.DatetimeIndex(future_dates).dayofweek >= 5).astype(float),
})

forecast_exog = client.forecast(df, h=14, freq='D', X_df=future_df, level=[90])
print(forecast_exog.head())

# ── 4. Panel (multi-series) forecast ──────────────────────────────────────
panel = pd.concat([
    pd.DataFrame({
        'unique_id': f'series_{i}',
        'ds': pd.date_range('2022-01-01', periods=52, freq='W'),
        'y': 50 + 10*i + 5*np.sin(2*np.pi*np.arange(52)/52) + np.random.randn(52),
    })
    for i in range(10)
])

panel_forecast = client.forecast(panel, h=8, freq='W')
print(f"Panel forecast shape: {panel_forecast.shape}")   # (80, 3)

# ── 5. Anomaly detection ──────────────────────────────────────────────────
df_anom = df.copy()
df_anom.loc[100, 'y'] = 500.0   # inject spike

anomalies = client.detect_anomalies(df_anom, freq='D')
flagged = anomalies[anomalies['anomaly'] == 1]
print(flagged[['ds', 'y', 'TimeGPT', 'anomaly']])

# ── 6. Cross-validation ────────────────────────────────────────────────────
cv = client.cross_validation(df, h=14, freq='D', n_windows=3, step_size=14)
actuals  = cv['y'].values
preds    = cv['TimeGPT'].values
mae_val  = np.mean(np.abs(preds - actuals))
print(f"CV MAE: {mae_val:.3f}")
`;function X(){return e.jsxs(f,{title:"TimeGPT: Zero-Shot Forecasting",difficulty:"intermediate",readingTime:12,children:[e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["TimeGPT (Garza & Mergenthaler-Canseco, 2023) is the first commercially available foundation model for time series forecasting. Developed by Nixtla, it was pre-trained on a proprietary corpus of over"," ",e.jsx("strong",{children:"100 billion time points"})," from diverse domains, enabling zero-shot forecasting on any series via a simple REST API — no training required."]}),e.jsx(c,{title:"TimeGPT Architecture",children:"TimeGPT is a Transformer-based encoder-decoder. The encoder processes the historical context window, and the decoder generates the multi-step forecast. Unlike domain-specific DL models, TimeGPT's weights are fixed at deployment — users access it through an API and never need to train or fine-tune (unless they choose to)."}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"API Capabilities"}),e.jsx(Y,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"How TimeGPT Generates Forecasts"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Given an input context"," ",e.jsx(r.InlineMath,{math:"(x_{t-L}, \\dots, x_t)"}),", TimeGPT normalizes the sequence to remove scale effects (similar to RevIN), encodes it via multi-head attention, and decodes a multi-step forecast. The normalization is applied and reversed automatically, allowing the model to generalize across series with very different magnitudes."]}),e.jsx("p",{className:"text-gray-700 leading-relaxed mt-3",children:"Because TimeGPT was pre-trained on diverse domains, it implicitly recognizes common patterns without being told the domain: daily seasonality in energy data, weekly retail cycles, monthly economic trends."}),e.jsxs(b,{title:"Prediction Intervals via Conformal Prediction",children:[e.jsxs("p",{children:["TimeGPT's prediction intervals use ",e.jsx("strong",{children:"conformal prediction"}),"rather than learned quantile outputs. Given a calibration set of residuals, conformal prediction constructs intervals with a guaranteed coverage of at least ",e.jsx(r.InlineMath,{math:"1 - \\alpha"})," under exchangeability:"]}),e.jsx(r.BlockMath,{math:"P\\!\\bigl(y_{t+h} \\in [\\hat{y}_{t+h} - q_{1-\\alpha},\\; \\hat{y}_{t+h} + q_{1-\\alpha}]\\bigr) \\geq 1 - \\alpha"}),e.jsxs("p",{className:"text-sm mt-2",children:["where ",e.jsx(r.InlineMath,{math:"q_{1-\\alpha}"})," is the"," ",e.jsx(r.InlineMath,{math:"(1-\\alpha)"}),"-quantile of calibration residuals. This provides distribution-free coverage guarantees valid regardless of the underlying data distribution."]})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Exogenous Variables"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["TimeGPT accepts future-known covariates via a separate"," ",e.jsx("code",{children:"X_df"})," argument. The model conditions on these covariates during decoding, similarly to TFT's known-future covariate pathway. Supported inputs:"]}),e.jsxs("ul",{className:"list-disc ml-6 mt-2 space-y-1 text-gray-700 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Numeric future covariates:"})," promotions, prices, event flags"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Calendar features:"})," auto-generated from the frequency (day-of-week, etc.)"]})]}),e.jsx("p",{className:"text-gray-700 leading-relaxed mt-3",children:"Static series-level attributes (e.g., category, region) are not yet natively supported as inputs — use fine-tuning for strong domain-specific adjustments."}),e.jsx(h,{title:"When TimeGPT Is a Good First Choice",children:e.jsx("p",{className:"text-sm text-gray-700",children:"TimeGPT excels at: quick prototyping without infrastructure setup, cold-start series with no historical data, diverse portfolios with varying frequencies, and scenarios where model training is impractical (data privacy constraints, lack of ML engineering resources). It consistently outperforms per-series ARIMA fitting while being faster to deploy by orders of magnitude."})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Full SDK Example"}),e.jsx(u,{code:V}),e.jsxs(x,{title:"API Key and Token Consumption",children:["TimeGPT requires a Nixtla API key. Each request consumes tokens proportional to the number of series, context length, and horizon. To reduce cost: (1) batch all series in a single panel DataFrame rather than per-series calls, (2) set"," ",e.jsx("code",{children:"add_history=False"})," to skip fitted-value computation, and (3) reduce context length via the ",e.jsx("code",{children:"input_size"})," parameter if the series have short memory."]}),e.jsx(g,{title:"TimeGPT vs. Open-Source Alternatives",children:e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"TimeGPT:"})," easiest API, managed infra, anomaly detection, fine-tuning — but has API cost and data leaves your environment."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Chronos (Amazon):"})," open-source, runs locally, probabilistic, free — but slower on CPU and no covariate support."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"TimesFM (Google):"})," open-source, point forecast only, very fast — but no intervals natively."]}),e.jsx("li",{children:"For data-sensitive applications (healthcare, finance), prefer local open-source models."})]})}),e.jsx(y,{references:[{author:"Garza, A., & Mergenthaler-Canseco, M.",year:2023,title:"TimeGPT-1",venue:"arXiv"},{author:"Angelopoulos, A. N., & Bates, S.",year:2023,title:"Conformal Risk Control",venue:"ICLR"},{author:"Kim, T., et al.",year:2022,title:"Reversible Instance Normalization for Accurate Time-Series Forecasting against Distribution Shift",venue:"ICLR"}]})]})}const Te=Object.freeze(Object.defineProperty({__proto__:null,default:X},Symbol.toStringTag,{value:"Module"})),w=(t,o)=>Array.from({length:t},(i,s)=>{const a=s+1,l=+(.44*Math.exp(-.028*a)+.058).toFixed(4),n=o&&a>o?(a-o)*.0028:0,d=+(.42*Math.exp(-.017*a)+.078+n).toFixed(4);return{step:a,train:l,val:d}}),q={10:{label:"10 steps (under-fit)",color:"#f59e0b",data:w(60,null).slice(0,60)},50:{label:"50 steps (good fit)",color:"#22c55e",data:w(60,null)},150:{label:"150 steps (overfit)",color:"#ef4444",data:w(60,40)}},L=[{name:"MAE",desc:"Optimizes the conditional median. Robust to outliers. Recommended default for most demand forecasting tasks."},{name:"MSE",desc:"Optimizes the conditional mean. Strongly penalizes large deviations; sensitive to spikes and outliers."},{name:"RMSE",desc:"Square root of MSE; same physical units as target. Useful for communicating error magnitude to stakeholders."},{name:"MAPE",desc:"Percentage-based. Undefined when y = 0 — avoid with intermittent or near-zero demand series."},{name:"SMAPE",desc:"Symmetric MAPE — bounded [0, 200%] but still numerically unstable when |y| + |ŷ| ≈ 0."}],Z=`from nixtla import NixtlaClient
import pandas as pd
import numpy as np

client = NixtlaClient(api_key="YOUR_NIXTLA_API_KEY")

# ── Prepare data (required cols: unique_id | ds | y) ─────────────────────────
df = pd.read_csv("weekly_demand.csv", parse_dates=["ds"])
cutoff = df["ds"].max() - pd.Timedelta(weeks=8)
train  = df[df["ds"] <= cutoff]
test   = df[df["ds"] >  cutoff]
H = 8

# ── 1. Zero-shot baseline ─────────────────────────────────────────────────────
fc_zs = client.forecast(
    df=train, h=H, freq="W",
    time_col="ds", target_col="y",
    model="timegpt-1",
)

# ── 2. Fine-tuned: 50 steps, MAE loss ─────────────────────────────────────────
fc_ft = client.forecast(
    df=train, h=H, freq="W",
    time_col="ds", target_col="y",
    model="timegpt-1",
    finetune_steps=50,
    finetune_loss="mae",
)

# ── 3. MASE evaluation on holdout ─────────────────────────────────────────────
def mase(y_true, y_pred, y_train, s=52):
    num = np.mean(np.abs(np.array(y_true) - np.array(y_pred)))
    den = np.mean(np.abs(y_train[s:] - y_train[:-s]))
    return num / den if den > 0 else np.nan

for label, fc in [("zero-shot", fc_zs), ("ft-50-mae", fc_ft)]:
    scores = []
    for uid, grp in test.groupby("unique_id"):
        pred   = fc[fc["unique_id"] == uid]["TimeGPT"].values
        actual = grp.sort_values("ds")["y"].values
        hist   = train[train["unique_id"] == uid]["y"].values
        scores.append(mase(actual, pred, hist))
    print(f"{label:14s}  MASE = {np.nanmean(scores):.4f}")

# ── 4. Cross-validation to pick optimal finetune_steps ───────────────────────
for steps in [0, 10, 50, 100, 200]:
    cv = client.cross_validation(
        df=df, h=H, n_windows=3, freq="W",
        time_col="ds", target_col="y",
        model="timegpt-1",
        finetune_steps=steps,
        finetune_loss="mae",
    )
    cv_mae = (cv["y"] - cv["TimeGPT"]).abs().mean()
    print(f"steps={steps:4d}  CV-MAE = {cv_mae:.4f}")
`;function Q(){const[t,o]=p.useState(50),[i,s]=p.useState("MAE"),a=q[t],l=L.find(n=>n.name===i);return e.jsxs(f,{title:"Fine-Tuning TimeGPT",difficulty:"advanced",readingTime:11,children:[e.jsx("p",{children:"TimeGPT ships as a zero-shot API — no training required for inference. For most standard datasets, zero-shot performance is competitive with domain-specific models. But when your series exhibit patterns absent from the pre-training corpus — unusual seasonality, proprietary demand dynamics, or systematic zero-shot bias — fine-tuning with a small number of gradient steps can meaningfully reduce error at moderate additional cost."}),e.jsx("h2",{children:"When Fine-Tuning Helps"}),e.jsx(h,{title:"Strong candidates for fine-tuning",children:e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Unusual seasonality:"})," fiscal-year cycles, religious holidays (Ramadan, Lunar New Year, Diwali), industry-specific patterns absent from public pre-training corpora."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Proprietary dynamics:"})," internal sales cycles correlated with marketing spend, promotion calendars, or business-specific triggers."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Systematic zero-shot bias:"})," when TimeGPT consistently over- or under-shoots on your data, gradient steps can re-calibrate the output distribution without changing the architecture."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Long history available:"})," series with 200+ observations provide enough signal for adaptation without memorizing noise."]})]})}),e.jsx(h,{title:"When zero-shot is likely better",children:e.jsxs("ul",{children:[e.jsxs("li",{children:["Very short series (","<"," 50 obs) — not enough signal to adapt without overfitting."]}),e.jsx("li",{children:"Cold-start: new series with no historical data at all."}),e.jsx("li",{children:"Standard retail or energy patterns well-represented in pre-training data."}),e.jsx("li",{children:"Cost-sensitive pipelines — fine-tuned API calls are billed at a higher rate."})]})}),e.jsxs("h2",{children:["The ",e.jsx("code",{children:"finetune_steps"})," Parameter"]}),e.jsxs("p",{children:["Fine-tuning runs ",e.jsx(r.InlineMath,{children:"K"})," gradient steps on your training data, starting from pre-trained TimeGPT weights ",e.jsx(r.InlineMath,{children:"\\theta_0"}),". The optimizer is AdamW with a cosine-decay learning rate schedule:"]}),e.jsx(r.BlockMath,{children:"\\theta_{k+1} = \\theta_k - \\eta_k \\,\\nabla_\\theta \\mathcal{L}(y, \\hat{y}(\\theta_k))"}),e.jsx(r.BlockMath,{children:"\\eta_k = \\eta_{\\min} + \\tfrac{1}{2}(\\eta_0 - \\eta_{\\min})\\!\\left(1 + \\cos\\frac{\\pi k}{K}\\right)"}),e.jsxs("p",{children:["Nixtla servers manage ",e.jsx(r.InlineMath,{children:"\\eta_0 \\approx 10^{-4}"}),", small enough to prevent ",e.jsx("em",{children:"catastrophic forgetting"})," of pre-trained representations while still shifting the output layers toward domain-specific patterns."]}),e.jsx("h3",{children:"Simulated Loss Curves"}),e.jsx("p",{children:"Select a step-count scenario to see typical train vs validation behaviour:"}),e.jsx("div",{style:{marginBottom:"1rem"},children:Object.entries(q).map(([n,d])=>e.jsx("button",{onClick:()=>o(Number(n)),style:{margin:"0.2rem",padding:"0.3rem 1rem",borderRadius:"4px",cursor:"pointer",border:`1px solid ${d.color}`,background:t===Number(n)?d.color:"#fff",color:t===Number(n)?"#fff":d.color},children:d.label},n))}),e.jsx(_,{width:"100%",height:270,children:e.jsxs(O,{data:a.data,margin:{top:5,right:20,left:0,bottom:16},children:[e.jsx(v,{strokeDasharray:"3 3"}),e.jsx(T,{dataKey:"step",label:{value:"Gradient steps",position:"insideBottom",offset:-8}}),e.jsx(M,{domain:[.04,.52],tickFormatter:n=>n.toFixed(2)}),e.jsx(k,{formatter:n=>n.toFixed(4)}),e.jsx(P,{verticalAlign:"top"}),e.jsx(C,{dataKey:"train",name:"Train Loss",stroke:"#6366f1",dot:!1,strokeWidth:2}),e.jsx(C,{dataKey:"val",name:"Val Loss",stroke:"#f59e0b",dot:!1,strokeWidth:2}),t===150&&e.jsx(B,{x:40,stroke:"#ef4444",strokeDasharray:"5 5",label:{value:"Overfit onset",fill:"#ef4444",fontSize:11,position:"insideTopRight"}})]})}),e.jsxs(x,{title:"Overfitting on Short Series",children:["Too many fine-tuning steps on short series causes the model to memorize training-set idiosyncrasies. A typical safe range is ",e.jsx("strong",{children:"10–100 steps"}),". Always verify with cross-validation (≥ 3 windows) rather than guessing."]}),e.jsxs("h2",{children:["Choosing ",e.jsx("code",{children:"finetune_loss"})]}),e.jsx("div",{style:{marginBottom:"0.75rem"},children:L.map(n=>e.jsx("button",{onClick:()=>s(n.name),style:{margin:"0.2rem",padding:"0.25rem 0.7rem",borderRadius:"4px",cursor:"pointer",border:"1px solid #8b5cf6",background:i===n.name?"#8b5cf6":"#fff",color:i===n.name?"#fff":"#8b5cf6"},children:n.name},n.name))}),l&&e.jsxs("div",{style:{background:"#f5f3ff",border:"1px solid #8b5cf6",borderRadius:"6px",padding:"0.75rem 1rem",marginBottom:"1.5rem"},children:[e.jsxs("strong",{children:[l.name,":"]})," ",l.desc]}),e.jsxs(g,{title:"Loss Function vs Evaluation Metric",children:[e.jsx("code",{children:"finetune_loss"})," is what gets minimized during gradient updates. Your holdout ",e.jsx("em",{children:"evaluation metric"})," (MASE, WQL, CRPS) is separate. A common pattern: fine-tune with MAE, evaluate with MASE or WQL on the holdout to compare zero-shot against fine-tuned."]}),e.jsx("h2",{children:"Cost Implications"}),e.jsxs(c,{term:"Fine-Tuning Cost Structure",children:["Nixtla bills fine-tuning compute and inference separately:",e.jsxs("ul",{children:[e.jsxs("li",{children:["Fine-tuning cost scales with ",e.jsx(r.InlineMath,{children:"K \\times N_{\\text{series}} \\times T_{\\text{avg}}"})]}),e.jsx("li",{children:"Inference with fine-tuned weights costs approximately 2× standard inference"}),e.jsx("li",{children:"Weights are cached server-side for a session window; subsequent calls reuse cached weights"})]}),"Measure MASE improvement vs extra cost before committing fine-tuned inference at scale."]}),e.jsx("h2",{children:"Evaluation Protocol"}),e.jsx(b,{title:"Cross-Validation Protocol for Step Selection",children:e.jsxs("ol",{children:[e.jsxs("li",{children:["Partition data into ",e.jsx(r.InlineMath,{children:"W \\geq 3"})," time-series cross-validation windows."]}),e.jsxs("li",{children:["Evaluate step counts ",e.jsx(r.InlineMath,{children:"K \\in \\{0, 10, 50, 100, 200\\}"})," (K=0 is the zero-shot baseline)."]}),e.jsx("li",{children:"Select the smallest K achieving near-minimum average validation MASE — prefer fewer steps when the gain plateaus (Occam's razor)."}),e.jsx("li",{children:"If the fine-tuned and zero-shot MASE differ by less than one standard error across windows, use zero-shot to avoid added cost and complexity."})]})}),e.jsx(u,{code:Z,title:"TimeGPT Fine-Tuning with Cross-Validation Step Selection"}),e.jsx(y,{references:[{title:"TimeGPT-1: The First Foundation Model for Time Series Forecasting",authors:"Garza, Challu, Mergenthaler-Canseco",year:2023,venue:"arXiv:2310.03589"},{title:"Decoupled Weight Decay Regularization (AdamW)",authors:"Loshchilov & Hutter",year:2019,venue:"ICLR 2019"},{title:"Nixtla Documentation: Fine-Tuning TimeGPT",authors:"Nixtla Engineering Team",year:2024,venue:"docs.nixtla.io"}]})]})}const Me=Object.freeze(Object.defineProperty({__proto__:null,default:Q},Symbol.toStringTag,{value:"Module"})),N=[{domain:"Retail Demand",zeroShot:78,finetuned:85,classical:68},{domain:"Electricity",zeroShot:82,finetuned:86,classical:80},{domain:"Renewables",zeroShot:74,finetuned:80,classical:65},{domain:"Financials",zeroShot:55,finetuned:59,classical:53},{domain:"Operations Anom",zeroShot:76,finetuned:82,classical:60}],$=[{step:"Load SKU data",time:.5},{step:"Preprocess / pivot",time:1.2},{step:"API batch forecast",time:8.4},{step:"Post-process",time:.3},{step:"Write to DB",time:.6}],J=`"""
End-to-end demand forecasting pipeline with TimeGPT.
Forecasts 500 retail SKUs 28 days ahead.
"""
from nixtla import NixtlaClient
import pandas as pd
import numpy as np

client = NixtlaClient(api_key="YOUR_NIXTLA_API_KEY")

# ── 1. Load & validate ────────────────────────────────────────────────────────
df = pd.read_parquet("sku_daily_sales.parquet")
# Ensure schema: unique_id (SKU), ds (date), y (units sold)
assert {"unique_id","ds","y"}.issubset(df.columns)
df["ds"] = pd.to_datetime(df["ds"])
df = df.sort_values(["unique_id","ds"])

# ── 2. Exogenous features: price, promotion flag ──────────────────────────────
exog = pd.read_parquet("sku_exog.parquet")   # same unique_id/ds keys
# columns: price_index, is_promo (future values required for horizon)
FUTURE_EXOG_COLS = ["price_index", "is_promo"]

# ── 3. Batch forecast: 500 SKUs, horizon=28 days ─────────────────────────────
forecast_df = client.forecast(
    df=df,
    X_df=exog,
    h=28,
    freq="D",
    time_col="ds",
    target_col="y",
    model="timegpt-1",
    add_history=True,           # include fitted values in response
    level=[80, 95],             # prediction intervals
)

# ── 4. Anomaly detection: flag residuals > 3σ ───────────────────────────────
anomalies = client.detect_anomalies(
    df=df,
    freq="D",
    time_col="ds",
    target_col="y",
    model="timegpt-1",
    level=99,
)
flagged = anomalies[anomalies["anomaly"] == True]
print(f"Anomalies found: {len(flagged)}")

# ── 5. Multi-series cross-validation ─────────────────────────────────────────
cv = client.cross_validation(
    df=df,
    h=28,
    n_windows=4,
    freq="D",
    time_col="ds",
    target_col="y",
    model="timegpt-1",
)
mae = (cv["y"] - cv["TimeGPT"]).abs()
print(f"CV MAE  mean={mae.mean():.2f}  p50={mae.median():.2f}  p95={mae.quantile(0.95):.2f}")

# ── 6. Write forecast to database ─────────────────────────────────────────────
forecast_df.to_parquet("forecasts/demand_forecast.parquet", index=False)
print(f"Wrote {len(forecast_df)} rows for {forecast_df['unique_id'].nunique()} SKUs")
`,ee=`"""
FastAPI microservice wrapping TimeGPT for on-demand forecasting.
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from nixtla import NixtlaClient
import pandas as pd
from functools import lru_cache

app = FastAPI(title="Forecasting Service")

@lru_cache(maxsize=1)
def get_client():
    return NixtlaClient(api_key="YOUR_NIXTLA_API_KEY")

class ForecastRequest(BaseModel):
    series: list[dict]   # [{unique_id, ds, y}, ...]
    horizon: int = 14
    freq: str = "D"
    level: list[int] = [80, 95]

class ForecastResponse(BaseModel):
    forecasts: list[dict]
    n_series: int

@app.post("/forecast", response_model=ForecastResponse)
async def forecast(req: ForecastRequest):
    if req.horizon > 60:
        raise HTTPException(400, "horizon must be <= 60")
    df = pd.DataFrame(req.series)
    df["ds"] = pd.to_datetime(df["ds"])
    client = get_client()
    result = client.forecast(
        df=df,
        h=req.horizon,
        freq=req.freq,
        time_col="ds",
        target_col="y",
        level=req.level,
    )
    return ForecastResponse(
        forecasts=result.to_dict(orient="records"),
        n_series=result["unique_id"].nunique(),
    )
`;function te(){const[t,o]=p.useState("Retail Demand"),i=N.find(s=>s.domain===t);return e.jsxs(f,{title:"TimeGPT Real-World Applications",difficulty:"intermediate",readingTime:12,children:[e.jsx("p",{children:"TimeGPT's zero-shot API unlocks practical forecasting workflows that would otherwise require months of model development. This section walks through five real-world application domains — from retail demand to anomaly detection in operations — and closes with a production microservice pattern."}),e.jsx("h2",{children:"Application Domains Overview"}),e.jsx("p",{children:"The bar chart below compares relative accuracy (higher = better) across domains for zero-shot TimeGPT, fine-tuned TimeGPT, and classical statistical methods. Select a domain for detail."}),e.jsx("div",{style:{marginBottom:"1rem"},children:N.map(s=>e.jsx("button",{onClick:()=>o(s.domain),style:{margin:"0.2rem",padding:"0.25rem 0.7rem",borderRadius:"4px",cursor:"pointer",border:"1px solid #6366f1",background:t===s.domain?"#6366f1":"#fff",color:t===s.domain?"#fff":"#6366f1",fontSize:"0.85rem"},children:s.domain},s.domain))}),e.jsx(_,{width:"100%",height:260,children:e.jsxs(S,{data:N,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(v,{strokeDasharray:"3 3"}),e.jsx(T,{dataKey:"domain",tick:{fontSize:11}}),e.jsx(M,{domain:[40,100],label:{value:"Score",angle:-90,position:"insideLeft"}}),e.jsx(k,{}),e.jsx(P,{verticalAlign:"top"}),e.jsx(j,{dataKey:"zeroShot",name:"Zero-Shot",fill:"#6366f1"}),e.jsx(j,{dataKey:"finetuned",name:"Fine-Tuned",fill:"#22c55e"}),e.jsx(j,{dataKey:"classical",name:"Classical",fill:"#94a3b8"})]})}),i&&e.jsxs("div",{style:{background:"#eef2ff",border:"1px solid #6366f1",borderRadius:"6px",padding:"0.75rem 1rem",margin:"1rem 0"},children:[e.jsxs("strong",{children:[i.domain,":"]})," ","Zero-shot score ",i.zeroShot,", fine-tuned ",i.finetuned,", classical ",i.classical,"."]}),e.jsx("h2",{children:"1. Retail Demand Forecasting"}),e.jsx(c,{term:"SKU-Level Zero-Shot Forecasting",children:"Modern retailers manage hundreds of thousands of SKUs. Per-SKU model fitting is computationally intractable. TimeGPT's zero-shot API accepts batches of thousands of series simultaneously, producing probabilistic forecasts with prediction intervals — enabling safety-stock calculations without additional modeling."}),e.jsx(h,{title:"Typical Retail Pipeline",children:e.jsxs("ol",{children:[e.jsx("li",{children:"Load 7-day rolling sales per SKU from a data warehouse."}),e.jsx("li",{children:"Add exogenous features: price index, promotional flags (current + future horizon)."}),e.jsxs("li",{children:["Call ",e.jsx("code",{children:"client.forecast(h=28, level=[80,95])"})," for all SKUs in one request."]}),e.jsxs("li",{children:["Compute safety stock: ",e.jsx(r.InlineMath,{children:"SS = z_{\\alpha} \\cdot \\sigma_{\\text{forecast}} \\cdot \\sqrt{LT}"})," where LT is lead time."]}),e.jsx("li",{children:"Write reorder recommendations to ERP system."})]})}),e.jsx("h2",{children:"2. Energy Forecasting"}),e.jsx("p",{children:"Electricity load and renewable generation (solar, wind) share common challenges: strong diurnal and weekly seasonality, weather dependency, and the need for intraday probabilistic forecasts to manage grid balancing."}),e.jsx(g,{title:"Energy-Specific Considerations",children:e.jsxs("ul",{children:[e.jsx("li",{children:"Include weather exogenous variables (temperature, cloud cover, wind speed) for best results."}),e.jsxs("li",{children:["Probabilistic intervals are critical for battery dispatch optimization — use ",e.jsx("code",{children:"level=[10,25,50,75,90]"}),"."]}),e.jsx("li",{children:"Renewable generation has hard bounds [0, capacity]; consider clipping forecasts post-processing."})]})}),e.jsx("h2",{children:"3. Financial Time Series"}),e.jsx(x,{title:"Limitations for Financial Forecasting",children:"TimeGPT (and all foundation models) are trained primarily on economic and operational time series. Financial prices are much closer to martingales — future prices are nearly unpredictable from past prices alone. Zero-shot performance on equity prices or FX rates is typically no better than naïve random walk. Do not use TimeGPT for financial return prediction without strong exogenous features and careful out-of-sample validation."}),e.jsx("p",{children:"More suitable financial applications include: revenue forecasting (highly structured), subscriber/user counts (smooth trends), and macro indicators (GDP, CPI) which have strong autocorrelation structures."}),e.jsx("h2",{children:"4. Anomaly Detection in Operations"}),e.jsxs("p",{children:["TimeGPT supports anomaly detection by comparing actual values against forecast prediction intervals. A point outside the ",e.jsx(r.InlineMath,{children:"100(1-\\alpha)\\%"})," interval is flagged as anomalous:"]}),e.jsx(r.BlockMath,{children:"\\text{anomaly}_t = \\mathbf{1}\\left[y_t \\notin [\\hat{y}_t^{(\\alpha/2)},\\, \\hat{y}_t^{(1-\\alpha/2)}]\\right]"}),e.jsx(h,{title:"Operations Use Cases",children:e.jsxs("ul",{children:[e.jsx("li",{children:"Server latency spikes in SRE/observability pipelines."}),e.jsx("li",{children:"Inventory shrinkage detection (actual vs expected depletion)."}),e.jsx("li",{children:"Manufacturing defect rate anomalies."}),e.jsx("li",{children:"Payment fraud signals: unusual transaction volume deviations."})]})}),e.jsx("h2",{children:"5. Multi-Series Batch Pipeline"}),e.jsxs("p",{children:["A single ",e.jsx("code",{children:"client.forecast()"})," call handles thousands of series. Estimated timing for 500 daily SKUs with 28-day horizon:"]}),e.jsx(_,{width:"100%",height:200,children:e.jsxs(S,{data:$,layout:"vertical",margin:{top:5,right:30,left:110,bottom:5},children:[e.jsx(v,{strokeDasharray:"3 3"}),e.jsx(T,{type:"number",unit:"s"}),e.jsx(M,{type:"category",dataKey:"step",tick:{fontSize:12}}),e.jsx(k,{formatter:s=>`${s}s`}),e.jsx(j,{dataKey:"time",name:"Time (s)",fill:"#0ea5e9",radius:[0,3,3,0]})]})}),e.jsx("h2",{children:"Building a Forecasting Microservice"}),e.jsx("p",{children:"For production systems, wrap the Nixtla client in a lightweight FastAPI service that validates inputs, enforces horizon limits, and caches the client connection:"}),e.jsx(u,{code:ee,title:"FastAPI Forecasting Microservice with TimeGPT"}),e.jsx("h2",{children:"End-to-End Demand Pipeline"}),e.jsx(u,{code:J,title:"End-to-End Retail Demand Forecasting Pipeline"}),e.jsx(y,{references:[{title:"TimeGPT-1: The First Foundation Model for Time Series Forecasting",authors:"Garza, Challu, Mergenthaler-Canseco",year:2023,venue:"arXiv:2310.03589"},{title:"Nixtla Documentation: TimeGPT Use Cases",authors:"Nixtla Engineering Team",year:2024,venue:"docs.nixtla.io"},{title:"Probabilistic Forecasting in Electricity Markets",authors:"Hong & Fan",year:2016,venue:"International Journal of Forecasting"}]})]})}const ke=Object.freeze(Object.defineProperty({__proto__:null,default:te},Symbol.toStringTag,{value:"Module"}));function ae(){const[t,o]=p.useState(10),i=[2.1,3.8,1.2,4.5,3.1,2.7,5,1.8,4.2,3.5],s=1,a=5.5,l=(a-s)/t,n=m=>Math.min(Math.floor((m-s)/l),t-1),d=["#818cf8","#6366f1","#4f46e5","#4338ca","#3730a3","#312e81","#1e1b4b","#2563eb","#1d4ed8","#1e40af"];return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"Chronos: Real Values → Discrete Tokens"}),e.jsxs("div",{className:"flex items-center gap-3 mb-4 flex-wrap",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"Vocabulary size:"}),[6,10,20,50].map(m=>e.jsxs("button",{onClick:()=>o(m),className:`px-3 py-1 rounded text-sm border transition-all ${t===m?"bg-indigo-600 text-white border-indigo-600":"bg-white text-gray-700 border-gray-300"}`,children:["B=",m]},m))]}),e.jsx("div",{className:"flex items-end gap-1 mb-3 h-20",children:i.map((m,R)=>{const A=n(m),G=(m-s)/(a-s)*100;return e.jsxs("div",{className:"flex flex-col items-center gap-1 flex-1",children:[e.jsx("div",{className:"w-full rounded-t transition-all",style:{height:`${G}%`,backgroundColor:d[A%d.length]}}),e.jsx("span",{className:"text-xs text-gray-500 font-mono",children:A})]},R)})}),e.jsxs("div",{className:"flex justify-between text-xs text-gray-500 mb-1",children:[e.jsxs("span",{children:["min=",s]}),e.jsx("span",{children:"→ token indices →"}),e.jsxs("span",{children:["max=",a]})]}),e.jsxs("p",{className:"text-xs text-gray-500",children:["With B=",t," bins, each value maps to an integer token. The sequence becomes a token sequence that a standard language model can process with cross-entropy loss. Predicted tokens are converted back to real values using bin center values."]})]})}const se=`# pip install chronos-forecasting transformers torch
import torch
import numpy as np
from chronos import ChronosPipeline

# ── 1. Load pre-trained Chronos ────────────────────────────────────────────
# Sizes: tiny(8M), mini(20M), small(46M), base(200M), large(710M)
# All use T5 encoder-decoder backbone.
pipeline = ChronosPipeline.from_pretrained(
    "amazon/chronos-t5-small",
    device_map="cpu",
    torch_dtype=torch.float32,
)

# ── 2. Prepare context ────────────────────────────────────────────────────
np.random.seed(42)
T  = 96
t  = np.arange(T)
y  = 15 * np.sin(2*np.pi*t/24) + 5 * np.sin(2*np.pi*t/7) + np.random.randn(T)

# Chronos accepts a 2D tensor (batch, time) or a list of 1D tensors
context = torch.tensor(y, dtype=torch.float32).unsqueeze(0)  # (1, 96)
print("Context shape:", context.shape)

# ── 3. Probabilistic forecast (sample paths) ──────────────────────────────
horizon = 24
samples = pipeline.predict(
    context=context,
    prediction_length=horizon,
    num_samples=100,      # 100 Monte Carlo samples
    temperature=1.0,      # sampling temperature (1.0 = standard)
    top_k=50,             # top-k token filtering
    top_p=1.0,            # nucleus sampling (1.0 = disabled)
)
print("Samples shape:", samples.shape)   # (1, 100, 24)

# ── 4. Point and interval forecasts from samples ──────────────────────────
s = samples[0].numpy()                    # (100, 24)
median = np.median(s, axis=0)
p10    = np.percentile(s, 10, axis=0)
p90    = np.percentile(s, 90, axis=0)

print("Median forecast (first 5):", median[:5].round(2))
print("80% interval width (first 5):", (p90 - p10)[:5].round(2))

# ── 5. Batch prediction (variable-length series) ──────────────────────────
# Chronos pads shorter series with special tokens via attention masking
contexts = [
    torch.tensor(y[:50], dtype=torch.float32),    # short series
    torch.tensor(y[:96], dtype=torch.float32),    # longer series
    torch.tensor(y[:80], dtype=torch.float32),    # another
]
batch_samples = pipeline.predict(contexts, prediction_length=24, num_samples=20)
print("\\nBatch shape:", batch_samples.shape)   # (3, 20, 24)

# ── 6. Tokenization internals (conceptual) ────────────────────────────────
# Chronos pipeline internally:
# 1. Normalizes: x̃ = x / mean(|x|)  [mean-scaling]
# 2. Quantizes x̃ into B=4096 bins (vocabulary size)
# 3. Maps each bin → token ID in T5's vocabulary
# 4. Encodes via T5 encoder (up to 512 tokens)
# 5. Decodes future tokens auto-regressively
# 6. Maps token IDs → bin centers → real values
# 7. Reverses normalization: y_pred = ỹ_pred × mean(|x|)

# ── 7. CRPS evaluation ────────────────────────────────────────────────────
def crps_samples(samples_matrix, actuals):
    """CRPS from Monte Carlo samples via energy score formula."""
    n = samples_matrix.shape[0]
    e1 = np.mean(np.abs(samples_matrix - actuals), axis=0)   # E[|X-y|]
    # Approximate E[|X-X'|] via random pairs
    idx = np.random.choice(n, size=(200, 2), replace=True)
    e2 = 0.5 * np.mean(np.abs(samples_matrix[idx[:, 0]] - samples_matrix[idx[:, 1]]), axis=0)
    return np.mean(e1 - e2)

# Simulate true future
true_future = 15 * np.sin(2*np.pi*(T + np.arange(horizon))/24) + np.random.randn(horizon)
print(f"\\nCRPS: {crps_samples(s, true_future):.4f}")

# ── 8. Chronos-Bolt (fast variant) ────────────────────────────────────────
# Chronos-Bolt is a distilled, faster version using patch-based architecture
# rather than token-by-token autoregressive decoding.
# It is ~50x faster than Chronos-T5 for long horizons.
bolt = ChronosPipeline.from_pretrained(
    "amazon/chronos-bolt-small",    # fast distilled model
    device_map="cpu",
    torch_dtype=torch.float32,
)
bolt_samples = bolt.predict(context, prediction_length=horizon, num_samples=20)
print("Bolt output shape:", bolt_samples.shape)
`;function re(){return e.jsxs(f,{title:"Amazon Chronos Architecture",difficulty:"advanced",readingTime:13,children:[e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"Chronos (Ansari et al., 2024) is Amazon's open-source foundation model for time series forecasting. Its key innovation is treating forecasting as a language modeling problem: continuous time-series values are quantized into discrete tokens, enabling a standard T5 encoder-decoder to be trained using ordinary cross-entropy loss — no custom architecture required."}),e.jsxs(c,{title:"Chronos Core Idea",children:["Chronos reframes time-series forecasting as"," ",e.jsx("strong",{children:"next-token prediction"}),". Real-valued observations are mapped to integer token IDs via a quantization scheme (similar to audio tokenization in WaveNet). A T5 language model then learns the conditional distribution of future tokens given historical tokens. At inference, sampling from the decoder produces a set of future token sequences — which are decoded back to real values to yield probabilistic forecast samples."]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Step 1: Normalization"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mb-4",children:["Before tokenization, each series is normalized using"," ",e.jsx("em",{children:"mean scaling"}),": divide by the absolute mean of the context window to make the representation scale-invariant:"]}),e.jsx(r.BlockMath,{math:"\\tilde{x}_t = \\frac{x_t}{\\mu}, \\quad \\mu = \\frac{1}{L}\\sum_{i=1}^{L} |x_i|"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:["This is reversed at the end — predicted token values are multiplied back by ",e.jsx(r.InlineMath,{math:"\\mu"})," to recover the original scale."]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Step 2: Quantization (Tokenization)"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mb-4",children:["The normalized values ",e.jsx(r.InlineMath,{math:"\\tilde{x}"})," are discretized into ",e.jsx(r.InlineMath,{math:"B"})," bins (vocabulary size, typically"," ",e.jsx(r.InlineMath,{math:"B = 4096"}),") whose boundaries are derived from the quantile distribution of the pre-training data:"]}),e.jsx(r.BlockMath,{math:"\\text{token}(\\tilde{x}) = k \\;\\;\\text{such that}\\;\\; b_k \\leq \\tilde{x} < b_{k+1}"}),e.jsx(ae,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Step 3: T5 Encoder-Decoder"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"The tokenized history is passed to a T5 encoder-decoder. The encoder processes up to 512 history tokens; the decoder auto-regressively generates future tokens. Chronos is available in five sizes:"}),e.jsx("div",{className:"my-3 overflow-x-auto rounded border border-gray-200",children:e.jsxs("table",{className:"min-w-full text-sm",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsx("tr",{children:["Variant","Parameters","Context","Speed (CPU)","Recommended For"].map(t=>e.jsx("th",{className:"px-3 py-2 text-left text-gray-700",children:t},t))})}),e.jsx("tbody",{children:[["chronos-t5-tiny","8M","512","Very fast","Quick experiments, edge inference"],["chronos-t5-mini","20M","512","Fast","CPU production, latency-sensitive"],["chronos-t5-small","46M","512","Moderate","Balanced accuracy/speed (default)"],["chronos-t5-base","200M","512","Slow","Higher accuracy, GPU recommended"],["chronos-t5-large","710M","512","Very slow","Best accuracy, large GPU required"]].map(([t,o,i,s,a])=>e.jsxs("tr",{className:"border-t border-gray-200 hover:bg-gray-50",children:[e.jsx("td",{className:"px-3 py-2 font-mono text-xs text-gray-900",children:t}),e.jsx("td",{className:"px-3 py-2 text-gray-600",children:o}),e.jsx("td",{className:"px-3 py-2 text-gray-600",children:i}),e.jsx("td",{className:"px-3 py-2 text-gray-600 text-xs",children:s}),e.jsx("td",{className:"px-3 py-2 text-gray-500 text-xs",children:a})]},t))})]})}),e.jsxs(b,{title:"Why Cross-Entropy on Tokens Yields Probabilistic Forecasts",children:[e.jsx("p",{children:"Training on tokenized sequences with cross-entropy loss is equivalent to maximizing the log-likelihood of the joint conditional:"}),e.jsx(r.BlockMath,{math:"\\log P(\\text{tok}_{T+1}, \\dots, \\text{tok}_{T+H} \\mid \\text{tok}_1, \\dots, \\text{tok}_T)"}),e.jsx("p",{className:"text-sm mt-2",children:"This is exactly the probabilistic forecasting objective. The softmax distribution over future tokens defines a categorical distribution over quantized future values at each horizon step. Sampling from the decoder auto-regressively generates a coherent sample path over the entire forecast horizon — capturing joint distributional structure (including correlations across forecast steps), not just marginals."})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Training Data: Real + Synthetic"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["A distinctive design choice is the use of ",e.jsx("strong",{children:"synthetic time series"})," alongside real data. Synthetic series are sampled from statistical processes (Gaussian, Student-t, ARMA, ETS) with randomized parameters. This:"]}),e.jsxs("ul",{className:"list-disc ml-6 mt-2 space-y-1 text-gray-700 text-sm",children:[e.jsx("li",{children:"Covers rare distributional shapes underrepresented in real datasets"}),e.jsx("li",{children:"Provides theoretically unlimited training data"}),e.jsx("li",{children:"Helps the model learn general temporal principles rather than domain artifacts"})]}),e.jsx(h,{title:"Chronos-Bolt: The Fast Distilled Variant",children:e.jsxs("p",{className:"text-sm text-gray-700",children:["Chronos-Bolt replaces the token-by-token autoregressive decoding with a ",e.jsx("em",{children:"patched"})," architecture that predicts multiple future steps in parallel (similar to PatchTST). It is ~50× faster than the base Chronos-T5 for long horizons, with only a small accuracy trade-off. For production deployments where throughput matters,"," ",e.jsx("code",{children:"chronos-bolt-small"})," or"," ",e.jsx("code",{children:"chronos-bolt-base"})," are recommended over the T5 variants."]})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Implementation"}),e.jsx(u,{code:se}),e.jsx(x,{title:"512-Token Context Limit",children:"All Chronos T5 models are limited to 512 context tokens. Input series longer than 512 steps are automatically truncated to the most recent 512 values. For hourly data, this is only ~21 days of context. If your series has strong long-range seasonality (annual), consider aggregating to daily or weekly frequency before passing to Chronos, or use a model with a longer context (TimesFM: 512+ steps)."}),e.jsx(g,{title:"Working with Chronos Probabilistic Outputs",children:e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm",children:[e.jsxs("li",{children:["Chronos outputs sample paths via ",e.jsx("code",{children:"num_samples"}),". Compute quantiles post-hoc: ",e.jsx("code",{children:"np.percentile(samples, [10, 50, 90], axis=0)"}),"."]}),e.jsx("li",{children:"For point forecasts, use the median of samples (more robust than the mean)."}),e.jsx("li",{children:"Use CRPS (Continuous Ranked Probability Score) for rigorous probabilistic evaluation."}),e.jsxs("li",{children:["Increase ",e.jsx("code",{children:"num_samples"})," to 100–200 for stable quantile estimates; 20 is sufficient for the median."]})]})}),e.jsx(y,{references:[{author:"Ansari, A. F., Stella, L., Turkmen, C., et al.",year:2024,title:"Chronos: Learning the Language of Time Series",venue:"Transactions on Machine Learning Research"},{author:"Raffel, C., et al.",year:2020,title:"Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer",venue:"JMLR (T5)"},{author:"van den Oord, A., et al.",year:2016,title:"WaveNet: A Generative Model for Raw Audio",venue:"arXiv"}]})]})}const Se=Object.freeze(Object.defineProperty({__proto__:null,default:re},Symbol.toStringTag,{value:"Module"})),E=[{model:"Bolt-Small",ms:55,color:"#22c55e"},{model:"Bolt-Base",ms:120,color:"#16a34a"},{model:"T5-Tiny",ms:85,color:"#93c5fd"},{model:"T5-Mini",ms:140,color:"#60a5fa"},{model:"T5-Small",ms:280,color:"#3b82f6"},{model:"T5-Base",ms:820,color:"#2563eb"},{model:"T5-Large",ms:2800,color:"#1d4ed8"}],ie=`# pip install chronos-forecasting
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
`;function ne(){const[t,o]=p.useState("cpu"),i=t==="cpu"?E:E.map(s=>({...s,ms:Math.round(s.ms*.12)}));return e.jsxs(f,{title:"Chronos-Bolt: Fast Inference",difficulty:"intermediate",readingTime:10,children:[e.jsxs("p",{className:"text-lg text-zinc-700 dark:text-zinc-300 mb-4",children:["Chronos-Bolt is a distilled, optimized variant of Amazon Chronos designed for production workloads. It achieves ",e.jsx("strong",{children:"4–8× faster inference"})," than standard Chronos-T5 models while maintaining comparable accuracy — making it the recommended choice for low-latency pipelines and large-scale batch processing."]}),e.jsx(c,{term:"Chronos-Bolt",children:"A knowledge-distilled Chronos model that replaces the full T5 encoder-decoder with a lightweight patched decoder. Flash attention and optimized tokenization reduce inference time dramatically, especially on CPU — the most common deployment target for forecasting."}),e.jsxs("div",{className:"my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",children:[e.jsx("h4",{className:"font-semibold text-gray-800 dark:text-gray-200 mb-3",children:"Inference Time per Series (100 samples, h=24)"}),e.jsx("div",{className:"flex gap-2 mb-4",children:["cpu","gpu"].map(s=>e.jsx("button",{onClick:()=>o(s),className:`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${t===s?"bg-blue-600 text-white":"bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"}`,children:s.toUpperCase()},s))}),e.jsx(_,{width:"100%",height:220,children:e.jsxs(S,{data:i,margin:{top:5,right:20,left:10,bottom:50},children:[e.jsx(v,{strokeDasharray:"3 3"}),e.jsx(T,{dataKey:"model",angle:-35,textAnchor:"end",tick:{fontSize:11}}),e.jsx(M,{label:{value:"ms",angle:-90,position:"insideLeft"}}),e.jsx(k,{formatter:s=>[`${s} ms`,"Inference time"]}),e.jsx(j,{dataKey:"ms",fill:"#3b82f6",radius:[4,4,0,0]})]})}),e.jsx("p",{className:"text-xs text-gray-500 mt-2",children:"Bolt models (green bars) are consistently faster at similar accuracy."})]}),e.jsx("h2",{className:"text-2xl font-bold mt-8 mb-3",children:"Bolt vs Standard Chronos"}),e.jsx("div",{className:"overflow-x-auto mb-6",children:e.jsxs("table",{className:"w-full text-sm border-collapse",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-blue-50 dark:bg-blue-900/30",children:["Feature","Chronos-T5","Chronos-Bolt"].map(s=>e.jsx("th",{className:"px-4 py-2 text-left border border-blue-200 dark:border-blue-800",children:s},s))})}),e.jsx("tbody",{children:[["Architecture","T5 encoder-decoder","Patched decoder-only"],["CPU inference (Small)","~280 ms/series","~55 ms/series"],["GPU inference (Small)","~28 ms/series","~8 ms/series"],["Accuracy vs T5-Small","Baseline","Within 1–2% on most benchmarks"],["HuggingFace ID","amazon/chronos-t5-{size}","amazon/chronos-bolt-{size}"],["Python class","ChronosPipeline","ChronosBoltPipeline"]].map(([s,a,l])=>e.jsxs("tr",{className:"border-b border-gray-200 dark:border-gray-700",children:[e.jsx("td",{className:"px-4 py-2 font-medium border border-gray-200 dark:border-gray-700",children:s}),e.jsx("td",{className:"px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700",children:a}),e.jsx("td",{className:"px-4 py-2 text-blue-700 dark:text-blue-300 font-medium border border-gray-200 dark:border-gray-700",children:l})]},s))})]})}),e.jsx("h2",{className:"text-2xl font-bold mt-8 mb-3",children:"Output: Sample Trajectories"}),e.jsxs("p",{className:"mb-3",children:["Both Chronos and Chronos-Bolt return ",e.jsx("strong",{children:"sample trajectories"}),", not point forecasts. From these samples you derive any summary:"]}),e.jsxs("ul",{className:"list-disc pl-6 mb-4 space-y-1 text-zinc-700 dark:text-zinc-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Median:"})," ",e.jsx("code",{children:"np.quantile(samples, 0.5, axis=0)"})," — robust point forecast"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mean:"})," ",e.jsx("code",{children:"np.mean(samples, axis=0)"})," — minimum MSE estimator"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"80% PI:"})," ",e.jsx("code",{children:"np.quantile(samples, [0.1, 0.9], axis=0)"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"CRPS:"})," compute from samples for probabilistic evaluation"]})]}),e.jsxs(g,{title:"Caching and Offline Use",children:["The first call to ",e.jsx("code",{children:"from_pretrained()"})," downloads weights (~200 MB for Small) to",e.jsx("code",{children:" ~/.cache/huggingface/hub"}),". Set ",e.jsx("code",{children:"TRANSFORMERS_CACHE"})," to override. For air-gapped environments: ",e.jsx("code",{children:"huggingface-cli download amazon/chronos-bolt-small"}),"then use ",e.jsx("code",{children:"local_files_only=True"}),"."]}),e.jsx(h,{title:"Batch Inference with Chronos-Bolt",children:e.jsx(u,{code:ie,title:"Chronos-Bolt production pipeline"})}),e.jsxs(x,{title:"Calibration Validation Required",children:["Chronos-Bolt's compressed architecture can produce slightly narrower prediction intervals than Chronos-T5 on out-of-distribution series. Always validate empirical coverage on a holdout set before relying on Bolt's PIs for high-stakes inventory or financial decisions. Use ",e.jsx("code",{children:"num_samples≥200"})," for stable quantile estimates."]}),e.jsx(y,{references:[{title:"Chronos: Learning the Language of Time Series",authors:"Ansari, A.F. et al.",year:2024,venue:"Transactions on Machine Learning Research"},{title:"amazon/chronos-bolt-small (HuggingFace)",authors:"Amazon Science",year:2024,venue:"huggingface.co"}]})]})}const we=Object.freeze(Object.defineProperty({__proto__:null,default:ne},Symbol.toStringTag,{value:"Module"}));function oe(){const[t,o]=p.useState(3),i=[3.2,4.1,2.8,5,3.5,4.8,3.1,4.4],a=[...[1,2],t];return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"Lag-Llama Token = Vector of Lagged Values"}),e.jsxs("div",{className:"flex items-center gap-3 mb-4 flex-wrap",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"Extra lag index:"}),[3,6,12,24].map(l=>e.jsxs("button",{onClick:()=>o(l),className:`px-3 py-1 rounded text-sm border transition-all ${t===l?"bg-rose-600 text-white border-rose-600":"bg-white text-gray-700 border-gray-300"}`,children:["lag-",l]},l))]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"text-xs font-mono border-collapse w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("td",{className:"px-2 py-1 text-gray-500 border border-gray-200",children:"Feature"}),i.map((l,n)=>e.jsxs("td",{className:"px-2 py-1 text-center border border-gray-200 text-gray-700",children:["t=",n+1]},n))]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"px-2 py-1 text-gray-500 border border-gray-200 font-bold",children:"x_t"}),i.map((l,n)=>e.jsx("td",{className:"px-2 py-1 text-center border border-gray-200 bg-blue-50 text-blue-800",children:l},n))]}),a.map(l=>e.jsxs("tr",{children:[e.jsxs("td",{className:"px-2 py-1 text-gray-500 border border-gray-200",children:["lag-",l]}),i.map((n,d)=>{const m=d>=l?i[d-l]:null;return e.jsx("td",{className:`px-2 py-1 text-center border border-gray-200 ${m!==null?"bg-green-50 text-green-800":"bg-gray-100 text-gray-400"}`,children:m!==null?m:"−"},d)})]},l))]})]})}),e.jsxs("p",{className:"text-xs text-gray-500 mt-2",children:["Each token at position t is the vector [x_t, x_(t-1), x_(t-2), x_(t-",t,")]. Lags encode local temporal context directly in the token embedding."]})]})}const le=`# Lag-Llama: LLaMA-based probabilistic foundation model
# Repository: github.com/time-series-foundation-models/lag-llama
# pip install lag-llama gluonts torch

import torch
import numpy as np
import pandas as pd
from gluonts.dataset.common import ListDataset
from gluonts.dataset.field_names import FieldName
from huggingface_hub import hf_hub_download

# ── 1. Download model checkpoint ──────────────────────────────────────────
ckpt_path = hf_hub_download(
    repo_id="time-series-foundation-models/Lag-Llama",
    filename="lag-llama.ckpt",
)

from lag_llama.gluon.estimator import LagLlamaEstimator

# ── 2. Prepare data (GluonTS ListDataset format) ──────────────────────────
np.random.seed(42)
T    = 200
freq = "h"
dates = pd.date_range("2023-01-01", periods=T, freq=freq)
t     = np.arange(T)
y     = 100 + 20*np.sin(2*np.pi*t/24) + 5*np.sin(2*np.pi*t/168) + 3*np.random.randn(T)

test_data = ListDataset(
    [{FieldName.TARGET: y, FieldName.START: dates[0]}],
    freq=freq,
)

# ── 3. Zero-shot prediction ────────────────────────────────────────────────
horizon = 24
estimator = LagLlamaEstimator(
    ckpt_path=ckpt_path,
    prediction_length=horizon,
    context_length=512,
    num_parallel_samples=100,     # Monte Carlo samples for probabilistic output
    device=torch.device("cpu"),   # use 'cuda' for GPU
)

# Build predictor from checkpoint (no training)
lightning_module = estimator.create_lightning_module()
transformation   = estimator.create_transformation()
predictor        = estimator.create_predictor(transformation, lightning_module)

forecasts = list(predictor.predict(test_data))
f = forecasts[0]
print("Samples shape:", f.samples.shape)   # (100, 24)

median = np.median(f.samples, axis=0)
p10    = np.percentile(f.samples, 10, axis=0)
p90    = np.percentile(f.samples, 90, axis=0)
print("Median forecast:", median[:5].round(2))

# ── 4. Fine-tuning on domain data ─────────────────────────────────────────
# Build a training dataset with multiple series
n_train = 20
train_data = ListDataset(
    [
        {
            FieldName.TARGET: y + 5*np.random.randn(T),
            FieldName.START:  dates[0],
        }
        for _ in range(n_train)
    ],
    freq=freq,
)

estimator_ft = LagLlamaEstimator(
    ckpt_path=ckpt_path,
    prediction_length=horizon,
    context_length=512,
    num_parallel_samples=100,
    batch_size=8,
    num_batches_per_epoch=10,
    trainer_kwargs={
        "max_epochs": 5,               # few epochs for light fine-tuning
        "enable_progress_bar": True,
    },
    device=torch.device("cpu"),
)

predictor_ft   = estimator_ft.train(train_data, cache_data=True)
ft_forecasts   = list(predictor_ft.predict(test_data))
ft_median      = np.median(ft_forecasts[0].samples, axis=0)

# Compare zero-shot vs fine-tuned
holdout = y[-horizon:]
mae_zs = np.mean(np.abs(median    - holdout))
mae_ft = np.mean(np.abs(ft_median - holdout))
print(f"Zero-shot MAE:  {mae_zs:.3f}")
print(f"Fine-tuned MAE: {mae_ft:.3f}")

# ── 5. Lag-Llama vs Chronos quick comparison ─────────────────────────────
comparison = {
    "Backbone":      ("LLaMA decoder-only", "T5 encoder-decoder"),
    "Token type":    ("Multi-lag vector",   "Scalar quantized bin"),
    "Output":        ("Student-t (μ,σ,ν)", "Token samples → real values"),
    "Probabilistic": ("Analytical",         "Monte Carlo sampling"),
    "API":           ("GluonTS",            "Native tensors"),
}
for k, (a, b) in comparison.items():
    print(f"{k:15s}  Lag-Llama: {a:30s}  Chronos: {b}")
`;function ce(){return e.jsxs(f,{title:"Lag-Llama: LLM-Based Forecasting",difficulty:"advanced",readingTime:12,children:[e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["Lag-Llama (Rasul et al., 2024) adapts a LLaMA-style decoder-only Transformer for probabilistic time series forecasting. Its key architectural insight is using ",e.jsx("em",{children:"lagged feature vectors"})," as input tokens — giving each token local temporal context — combined with a Student-t distribution output head that provides analytically calibrated prediction intervals."]}),e.jsxs(c,{title:"Lag-Llama Architecture",children:["Lag-Llama is a ",e.jsx("strong",{children:"decoder-only Transformer"})," with causal self-attention. Each input token at step ",e.jsx(r.InlineMath,{math:"t"})," is a vector of lagged values:"," ",e.jsx(r.InlineMath,{math:"\\mathbf{z}_t = [x_t,\\, x_{t-l_1},\\, x_{t-l_2},\\, \\dots]"}),". The output head predicts the parameters of a"," ",e.jsx("strong",{children:"Student-t distribution"})," ",e.jsx(r.InlineMath,{math:"(\\mu_t, \\sigma_t, \\nu_t)"})," at each forecast step — rather than a discrete token distribution or raw sample paths."]}),e.jsx(oe,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Lagged Features as Tokens"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["A single scalar value carries almost no temporal information. Lag-Llama enriches each token with lagged values at chosen offsets"," ",e.jsx(r.InlineMath,{math:"\\mathcal{L} = \\{l_1, l_2, \\dots, l_K\\}"}),":"]}),e.jsx(r.BlockMath,{math:"\\mathbf{z}_t = [x_t,\\; x_{t-l_1},\\; x_{t-l_2},\\; \\dots,\\; x_{t-l_K}] \\in \\mathbb{R}^{K+1}"}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:["The lag set is designed to cover multiple temporal scales. For hourly data, lags"," ",e.jsx(r.InlineMath,{math:"\\{1, 2, 3, 4, 24, 48, 168\\}"})," capture immediate history, daily patterns, and weekly patterns. This is conceptually similar to ARIMA's lag selection, but embedded inside a deep Transformer architecture."]}),e.jsxs(b,{title:"Student-t Output Distribution",children:[e.jsx("p",{children:"Lag-Llama outputs a Student-t distribution at each forecast step:"}),e.jsx(r.BlockMath,{math:"x_{t+h} \\mid \\mathbf{z}_{1:t} \\sim \\text{StudentT}(\\mu_{t+h},\\; \\sigma_{t+h},\\; \\nu_{t+h})"}),e.jsxs("p",{className:"text-sm mt-2",children:["The three parameters are predicted by the Transformer's output layer. The Student-t distribution is heavier-tailed than a Gaussian — making it more robust to outliers common in real-world financial and demand data. Crucially, quantiles can be computed"," ",e.jsx("em",{children:"analytically"})," from ",e.jsx(r.InlineMath,{math:"(\\mu, \\sigma, \\nu)"})," ","via the inverse CDF, without running many Monte Carlo samples. This enables faster inference and more stable quantile estimates."]})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Lag-Llama vs. Chronos"}),e.jsx("div",{className:"my-4 overflow-x-auto",children:e.jsxs("table",{className:"min-w-full text-sm border border-gray-200 rounded-lg",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Aspect"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Lag-Llama"}),e.jsx("th",{className:"px-4 py-2 text-left text-gray-700",children:"Chronos"})]})}),e.jsx("tbody",{children:[["Backbone","LLaMA decoder-only (GPT-style)","T5 encoder-decoder"],["Token type","Multi-lag feature vector","Scalar quantized bin"],["Output type","Student-t (μ, σ, ν)","Sampled token sequences"],["Probabilistic","Analytical — no sampling needed","Monte Carlo sampling"],["Ecosystem","GluonTS API","Native tensors / HuggingFace"],["Context limit","512 steps","512 steps"],["Open-source","Yes (HuggingFace)","Yes (HuggingFace)"],["Fine-tuning","GluonTS Trainer","Not natively supported (v1)"]].map(([t,o,i])=>e.jsxs("tr",{className:"border-t border-gray-200 hover:bg-gray-50",children:[e.jsx("td",{className:"px-4 py-2 font-medium text-gray-700",children:t}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:o}),e.jsx("td",{className:"px-4 py-2 text-gray-600",children:i})]},t))})]})}),e.jsx(h,{title:"When Lag-Llama's Student-t Output Is Preferable",children:e.jsx("p",{className:"text-sm text-gray-700",children:"Lag-Llama's distributional output is advantageous when: (a) latency matters and you cannot afford many Monte Carlo samples, (b) your data has heavy tails (finance, weather extremes) where Gaussian intervals would undercover, (c) you integrate with GluonTS evaluation pipelines that expect GluonTS Forecast objects, or (d) you need analytical probability estimates at a specific quantile (e.g., P95 for inventory planning) computed precisely."})}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Implementation"}),e.jsx(u,{code:le}),e.jsxs(x,{title:"GluonTS Dependency and API Complexity",children:["Lag-Llama's interface is built on GluonTS, which uses its own"," ",e.jsx("code",{children:"ListDataset"})," format and ",e.jsx("code",{children:"FieldName"})," constants — different from the DataFrame API of TimeGPT or the tensor API of Chronos. If you are not already using GluonTS, Chronos or TimeGPT will have a substantially lower integration overhead for new projects."]}),e.jsx(g,{title:"Fine-Tuning with Lag-Llama",children:e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm",children:[e.jsxs("li",{children:["Set ",e.jsx("code",{children:"max_epochs=5–20"})," for light fine-tuning — enough to adapt output calibration without overwriting pre-trained features."]}),e.jsx("li",{children:"Provide a GluonTS training dataset with at least 10–20 diverse series for stable fine-tuning."}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"num_batches_per_epoch=10–50"})," to control training speed — more batches per epoch = more gradient steps per epoch."]}),e.jsx("li",{children:"Fine-tuning on 20 series × 200 steps × 5 epochs takes approximately 2–5 minutes on CPU."})]})}),e.jsx(y,{references:[{author:"Rasul, K., Ashok, A., Williams, A. R., et al.",year:2024,title:"Lag-Llama: Towards Foundation Models for Probabilistic Time Series Forecasting",venue:"ICLR LLMs for Time Series Workshop"},{author:"Touvron, H., et al.",year:2023,title:"LLaMA: Open and Efficient Foundation Language Models",venue:"arXiv"},{author:"Alexandrov, A., et al.",year:2020,title:"GluonTS: Probabilistic and Neural Time Series Modeling in Python",venue:"JMLR"}]})]})}const Ne=Object.freeze(Object.defineProperty({__proto__:null,default:ce},Symbol.toStringTag,{value:"Module"})),I=[{name:"moirai-1.0-R-small",params:"14M",ctx:512,recommendation:"Fast prototyping"},{name:"moirai-1.0-R-base",params:"91M",ctx:512,recommendation:"Default choice"},{name:"moirai-1.0-R-large",params:"311M",ctx:512,recommendation:"Best accuracy"}];function de(){const[t,o]=p.useState("moirai-1.0-R-base"),i=I.find(s=>s.name===t);return e.jsxs("div",{className:"my-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800",children:[e.jsx("h4",{className:"font-semibold text-purple-900 dark:text-purple-200 mb-3",children:"Moirai Model Variants"}),e.jsx("div",{className:"flex flex-wrap gap-2 mb-4",children:I.map(s=>e.jsx("button",{onClick:()=>o(s.name),className:`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all ${t===s.name?"bg-purple-600 text-white border-purple-600":"bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"}`,children:s.name.split("-").pop()},s.name))}),e.jsxs("div",{className:"text-sm space-y-1",children:[e.jsxs("div",{children:[e.jsx("span",{className:"font-medium",children:"Model:"})," ",e.jsx("code",{className:"text-purple-700 dark:text-purple-300",children:i.name})]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-medium",children:"Parameters:"})," ",i.params]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-medium",children:"Max context:"})," ",i.ctx," time steps"]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-medium",children:"Use case:"})," ",i.recommendation]})]})]})}const me=`# pip install uni2ts
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
`;function he(){return e.jsxs(f,{title:"Moirai: Universal Time Series Forecasting",difficulty:"advanced",readingTime:11,children:[e.jsxs("p",{className:"text-lg text-zinc-700 dark:text-zinc-300 mb-4",children:["Salesforce MOIRAI (2024) is a foundation model for time series forecasting with a unique",e.jsx("strong",{children:" any-variate attention"})," mechanism — a single model handles both univariate and multivariate series without architectural changes. Pre-trained on LOTSA, the largest open time series archive with 27 billion data points."]}),e.jsx(c,{term:"MOIRAI (Unified Forecasting)",children:"Masked Encoder with Any-Variate Attention trained via a masked pre-training objective analogous to BERT. The model learns to reconstruct masked patches of time series from surrounding context, enabling rich representations transferable to forecasting tasks."}),e.jsx("h2",{className:"text-2xl font-bold mt-8 mb-3",children:"Key Innovations"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",children:[{title:"Multi-Patch Tokenization",desc:"Input is divided into patches of multiple sizes (8, 16, 32, 64 time steps). Each patch size captures dynamics at different scales. The model attends across all patch sizes simultaneously.",icon:"📐"},{title:"Any-Variate Attention",desc:"Each variate of a multivariate series is treated as a separate sequence of tokens. Attention is applied across all variates jointly — so the model can scale to any number of dimensions without retraining.",icon:"🔀"},{title:"LOTSA Pre-training",desc:"Large-Scale Open Time Series Archive: 27 datasets, 27 billion observations, spanning finance, energy, retail, weather, transportation, and more. Largest public pre-training corpus for TS.",icon:"🗄️"},{title:"Mixture Output",desc:"MOIRAI outputs a mixture of distributions (Student-t + lognormal + negative binomial) to handle both continuous and count data. The model selects the appropriate distribution per series automatically.",icon:"📊"}].map(({title:t,desc:o,icon:i})=>e.jsxs("div",{className:"p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl",children:[e.jsx("div",{className:"text-xl mb-2",children:i}),e.jsx("h4",{className:"font-semibold text-purple-900 dark:text-purple-200 mb-1",children:t}),e.jsx("p",{className:"text-sm text-purple-800 dark:text-purple-300",children:o})]},t))}),e.jsx("h2",{className:"text-2xl font-bold mt-8 mb-3",children:"Architecture: Masked Encoder"}),e.jsxs("p",{className:"mb-3",children:["Unlike Chronos (encoder-decoder) or TimeGPT (encoder-decoder), MOIRAI uses a",e.jsx("strong",{children:" masked encoder"})," trained with a masked autoencoding objective:"]}),e.jsxs("ol",{className:"list-decimal pl-6 mb-4 space-y-2 text-zinc-700 dark:text-zinc-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Patch tokenization:"})," Divide series into non-overlapping patches; project each to a token vector."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Masking:"})," Randomly mask 40% of tokens during pre-training."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Transformer encoder:"})," Full self-attention over unmasked tokens from all variates."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Distribution head:"})," Predict distribution parameters for masked patches (reconstruction loss)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Forecasting:"}),' At inference, future tokens are treated as "masked" and predicted from the context.']})]}),e.jsxs(b,{title:"Any-Variate Attention",children:["For a multivariate series with ",e.jsx(r.InlineMath,{math:"C"})," variates, MOIRAI constructs",e.jsx(r.InlineMath,{math:"C \\times T/p"})," patch tokens (where ",e.jsx(r.InlineMath,{math:"p"})," is patch size and ",e.jsx(r.InlineMath,{math:"T"})," is context length). Self-attention is applied across all",e.jsx(r.InlineMath,{math:"C \\times T/p"})," tokens jointly:",e.jsx(r.BlockMath,{math:"\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V"}),"where ",e.jsx(r.InlineMath,{math:"Q, K, V \\in \\mathbb{R}^{(C \\cdot T/p) \\times d}"}),". This allows the model to capture cross-variate dependencies without fixed dimensionality."]}),e.jsx(de,{}),e.jsx("h2",{className:"text-2xl font-bold mt-8 mb-3",children:"LOTSA Pre-training Data"}),e.jsxs("p",{className:"mb-3",children:["MOIRAI is pre-trained on the ",e.jsx("strong",{children:"LOTSA"})," (Large-Scale Open Time Series Archive) dataset, curated by Salesforce Research:"]}),e.jsxs("ul",{className:"list-disc pl-6 mb-4 space-y-1 text-zinc-700 dark:text-zinc-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"27 billion data points"})," from public datasets"]}),e.jsx("li",{children:"Multiple frequencies: hourly, daily, weekly, monthly, quarterly"}),e.jsx("li",{children:"Domains: energy (electricity, solar), transportation (traffic, rideshare), finance (stocks, FX), weather, retail, web traffic"}),e.jsx("li",{children:"Includes M1–M4 competition data, ETT, PEMS, Electricity, and more"})]}),e.jsx(g,{title:"Comparison: MOIRAI vs Chronos",children:e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-xs",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-gray-100 dark:bg-gray-700",children:[e.jsx("th",{className:"p-2 text-left",children:"Aspect"}),e.jsx("th",{className:"p-2",children:"MOIRAI"}),e.jsx("th",{className:"p-2",children:"Chronos"})]})}),e.jsx("tbody",{children:[["Architecture","Masked encoder","T5 encoder-decoder"],["Tokenization","Patch-based (multi-size)","Quantization (4096 bins)"],["Multivariate","Native (any-variate attn)","Univariate only"],["Output","Mixture of distributions","Sample from token probs"],["Pre-train data","27B points (LOTSA)","~1.5B (real + synthetic)"],["Python package","uni2ts","chronos-forecasting"]].map(([t,o,i])=>e.jsxs("tr",{className:"border-t border-gray-200 dark:border-gray-700",children:[e.jsx("td",{className:"p-2 font-medium",children:t}),e.jsx("td",{className:"p-2 text-purple-700 dark:text-purple-300",children:o}),e.jsx("td",{className:"p-2 text-blue-700 dark:text-blue-300",children:i})]},t))})]})})}),e.jsx(h,{title:"MOIRAI Inference via uni2ts",children:e.jsx(u,{code:me,title:"MOIRAI Forecasting"})}),e.jsxs(x,{title:"uni2ts Installation Complexity",children:["The ",e.jsx("code",{children:"uni2ts"})," package has more complex dependencies than ",e.jsx("code",{children:"chronos-forecasting"}),"(requires ",e.jsx("code",{children:"einops"}),", specific ",e.jsx("code",{children:"transformers"})," version). Verify your environment with ",e.jsx("code",{children:'pip install "uni2ts[torch]"'}),". Docker images are available for reproducible deployments."]}),e.jsx(y,{references:[{title:"Unified Training of Universal Time Series Forecasting Transformers",authors:"Woo, G. et al. (Salesforce)",year:2024,venue:"ICML 2024"},{title:"LOTSA: Large-Scale Open Time Series Archive",authors:"Woo, G. et al.",year:2024,venue:"Salesforce Research"}]})]})}const Pe=Object.freeze(Object.defineProperty({__proto__:null,default:he},Symbol.toStringTag,{value:"Module"})),pe=[{name:"TimeGPT",org:"Nixtla",params:"~100M",backbone:"Transformer Enc-Dec",token:"Scalar value",output:"Point + conformal PI",zeroShot:!0,finetune:!0,local:!1,bestFor:"API convenience, anomaly detection"},{name:"Chronos",org:"Amazon",params:"8M–710M",backbone:"T5 Enc-Dec",token:"Quantized bin",output:"Sample paths",zeroShot:!0,finetune:!1,local:!0,bestFor:"Open-source probabilistic, CPU"},{name:"TimesFM",org:"Google",params:"200M",backbone:"Decoder-only patch",token:"Patch",output:"Point + quantiles",zeroShot:!0,finetune:!1,local:!0,bestFor:"Fast point forecast, large context"},{name:"Moirai",org:"Salesforce",params:"14M–311M",backbone:"Encoder Transformer",token:"Multi-patch",output:"Sample paths",zeroShot:!0,finetune:!0,local:!0,bestFor:"Multivariate, any-variate"},{name:"Lag-Llama",org:"Academic",params:"~32M",backbone:"LLaMA Decoder-only",token:"Lagged vector",output:"Student-t dist.",zeroShot:!0,finetune:!0,local:!0,bestFor:"Heavy-tailed, GluonTS integration"},{name:"MOMENT",org:"CMU",params:"385M",backbone:"T5 Encoder (BERT-style)",token:"Patch (masked)",output:"Point (linear probe)",zeroShot:!1,finetune:!0,local:!0,bestFor:"Fine-tuning, representation learning"}];function ue(){const[t,o]=p.useState("name"),[i,s]=p.useState(null);return e.jsxs("div",{className:"my-6",children:[e.jsxs("div",{className:"flex gap-2 mb-3 flex-wrap text-xs",children:[e.jsx("span",{className:"text-gray-500 self-center",children:"Sort by:"}),["name","params","org"].map(a=>e.jsx("button",{onClick:()=>o(a),className:`px-3 py-1 rounded border transition-all ${t===a?"bg-gray-800 text-white border-gray-800":"bg-white text-gray-700 border-gray-300"}`,children:a},a))]}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-gray-200",children:e.jsxs("table",{className:"min-w-full text-xs",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsx("tr",{children:["Model","Org","Params","Backbone","Token","Output","Zero-shot","Fine-tune","Local","Best For"].map(a=>e.jsx("th",{className:"px-3 py-2 text-left text-gray-700 whitespace-nowrap",children:a},a))})}),e.jsx("tbody",{children:[...pe].sort((a,l)=>a[t]>l[t]?1:-1).map(a=>e.jsxs("tr",{onClick:()=>s(i===a.name?null:a.name),className:`border-t border-gray-200 cursor-pointer transition-colors ${i===a.name?"bg-indigo-50":"hover:bg-gray-50"}`,children:[e.jsx("td",{className:"px-3 py-2 font-mono font-bold text-gray-900",children:a.name}),e.jsx("td",{className:"px-3 py-2 text-gray-600",children:a.org}),e.jsx("td",{className:"px-3 py-2 text-gray-600",children:a.params}),e.jsx("td",{className:"px-3 py-2 text-gray-600",children:a.backbone}),e.jsx("td",{className:"px-3 py-2 text-gray-600",children:a.token}),e.jsx("td",{className:"px-3 py-2 text-gray-600",children:a.output}),e.jsx("td",{className:"px-3 py-2 text-center",children:a.zeroShot?"✓":"−"}),e.jsx("td",{className:"px-3 py-2 text-center",children:a.finetune?"✓":"−"}),e.jsx("td",{className:"px-3 py-2 text-center",children:a.local?"✓":"−"}),e.jsx("td",{className:"px-3 py-2 text-gray-500 max-w-xs",children:a.bestFor})]},a.name))})]})}),e.jsx("p",{className:"text-xs text-gray-400 mt-1",children:"Click a row to highlight. Sort by clicking column buttons above."})]})}const fe=`# ═══════════════════════════════════════════════════════════════════════════
# MOMENT: Masked Pre-Training Foundation Model
# pip install momentfm torch transformers
# ═══════════════════════════════════════════════════════════════════════════
import torch
import numpy as np
from momentfm import MOMENTPipeline

# ── 1. Load MOMENT ─────────────────────────────────────────────────────────
moment = MOMENTPipeline.from_pretrained(
    "AutonLab/MOMENT-1-large",   # 385M parameter T5 encoder
    model_kwargs={
        "task_name": "forecasting",
        "forecast_horizon": 24,
    },
)
moment.init()

# ── 2. Zero-shot forecasting ───────────────────────────────────────────────
# MOMENT requires fixed-length context of 512 time steps
np.random.seed(42)
T = 512
t = np.arange(T)
y = 100 + 20*np.sin(2*np.pi*t/24) + np.random.randn(T)

# MOMENT input: (batch, n_channels, context_length=512)
context = torch.tensor(y, dtype=torch.float32).unsqueeze(0).unsqueeze(0)  # (1, 1, 512)

output = moment(context)
# output.forecast: (batch, horizon, n_channels) = (1, 24, 1)
forecast = output.forecast.squeeze().numpy()   # (24,)
print("MOMENT forecast shape:", forecast.shape)
print("First 5 steps:", forecast[:5].round(2))

# ── 3. MOMENT for anomaly detection ───────────────────────────────────────
moment_anomaly = MOMENTPipeline.from_pretrained(
    "AutonLab/MOMENT-1-large",
    model_kwargs={"task_name": "reconstruction"},  # masked reconstruction
)
moment_anomaly.init()

# Inject anomaly
y_anom = y.copy()
y_anom[250:255] += 200.0

ctx_anom = torch.tensor(y_anom, dtype=torch.float32).unsqueeze(0).unsqueeze(0)
# Mask out 20% of time steps and reconstruct
mask = torch.zeros(1, 1, T)
mask[:, :, 250:255] = 1.0   # mask the anomalous region

recon = moment_anomaly(ctx_anom, input_mask=mask)
recon_np = recon.reconstruction.squeeze().numpy()
error    = np.abs(y_anom - recon_np)
print("\\nAnomaly detection: max reconstruction error at", np.argmax(error))

# ═══════════════════════════════════════════════════════════════════════════
# TimesFM: Google's Patched Decoder-Only Foundation Model
# pip install timesfm[cpu]  (or timesfm[gpu] for CUDA)
# ═══════════════════════════════════════════════════════════════════════════
import timesfm

# ── 4. Load TimesFM ────────────────────────────────────────────────────────
tfm = timesfm.TimesFm(
    hparams=timesfm.TimesFmHparams(
        backend="cpu",         # 'gpu' for CUDA
        per_core_batch_size=32,
        horizon_len=24,
        num_layers=20,
        model_dims=1280,
        context_len=512,
        input_patch_len=32,
        output_patch_len=128,
    ),
    checkpoint=timesfm.TimesFmCheckpoint(
        huggingface_repo_id="google/timesfm-1.0-200m-pytorch",
    ),
)

# ── 5. Array-based inference ───────────────────────────────────────────────
# forecast_on_df returns point forecast (no native uncertainty)
import pandas as pd

df = pd.DataFrame({
    'unique_id': 'ts1',
    'ds': pd.date_range('2023-01-01', periods=T, freq='h'),
    'y': y,
})

point_fc, _ = tfm.forecast_on_df(df, freq='h', value_name='y', num_jobs=1)
print("\\nTimesFM forecast shape:", point_fc.shape)
print(point_fc[['unique_id', 'ds', 'timesfm']].head())

# ── 6. TimesFM with quantile outputs ──────────────────────────────────────
# TimesFM 1.0 supports quantile outputs via forecast() method
forecast_input = [torch.tensor(y[-512:], dtype=torch.float32)]
freq_input     = [0]   # 0 = high-freq (hourly/minute), 1 = medium, 2 = low

point_forecast, quantile_forecast = tfm.forecast(
    forecast_input,
    freq=freq_input,
)
# quantile_forecast: (batch, horizon, n_quantiles)
print("TimesFM quantile shape:", quantile_forecast.shape)

# ── 7. Comparing all models: decision guide ────────────────────────────────
guide = {
    "Need zero-shot + API": "TimeGPT",
    "Need zero-shot + local + probabilistic": "Chronos-Bolt",
    "Need fast point forecast": "TimesFM",
    "Need multivariate zero-shot": "Moirai",
    "Need heavy-tailed distribution": "Lag-Llama",
    "Need fine-tunable encoder": "MOMENT",
    "Need simple baseline": "N-HiTS (NeuralForecast)",
}
for scenario, model in guide.items():
    print(f"  {scenario:45s} → {model}")
`;function xe(){return e.jsxs(f,{title:"MOMENT and TimesFM",difficulty:"advanced",readingTime:12,children:[e.jsxs("p",{className:"text-gray-700 leading-relaxed",children:["This section covers the final two major foundation models in the current landscape — ",e.jsx("strong",{children:"MOMENT"})," (CMU), which applies masked pre-training (BERT-style) to time series for strong fine-tuning performance, and ",e.jsx("strong",{children:"TimesFM"})," (Google), which uses a patched decoder-only Transformer for fast and scalable point forecasting. Together with Chronos, Moirai, Lag-Llama, and TimeGPT, these models form the current frontier of time series foundation models."]}),e.jsx("h2",{className:"text-xl font-semibold mt-4 mb-3 text-gray-800",children:"MOMENT: Masked Pre-Training for Time Series"}),e.jsxs(c,{title:"MOMENT Architecture",children:["MOMENT (Goswami et al., 2024) is a T5 Transformer encoder pre-trained using a ",e.jsx("strong",{children:"masked patch modeling"})," objective — the time series equivalent of BERT's masked language modeling. Random patches of the input sequence are masked, and the model is trained to reconstruct them. This forces the encoder to learn rich contextual representations of temporal patterns without requiring labeled forecasting data."]}),e.jsxs("p",{className:"text-gray-700 leading-relaxed mt-3",children:["MOMENT uses ",e.jsx("em",{children:"patch-based tokenization"}),": each token is a patch of 8 time steps. For a context of 512 time steps, this produces 64 tokens — a manageable sequence for the encoder. The fixed context length of 512 is a requirement (shorter series must be zero-padded)."]}),e.jsxs(b,{title:"Masked Patch Modeling Objective",children:[e.jsxs("p",{children:["For a sequence of ",e.jsx(r.InlineMath,{math:"N"})," patches"," ",e.jsx(r.InlineMath,{math:"\\{p_1, \\dots, p_N\\}"}),", a random subset"," ",e.jsx(r.InlineMath,{math:"\\mathcal{M}"})," is masked with a learnable"," ",e.jsx("code",{children:"[MASK]"})," token. The model is trained to reconstruct the masked patches:"]}),e.jsx(r.BlockMath,{math:"\\mathcal{L} = \\frac{1}{|\\mathcal{M}|}\\sum_{i \\in \\mathcal{M}} \\|p_i - \\hat{p}_i\\|_2^2"}),e.jsx("p",{className:"text-sm mt-2",children:"At fine-tuning time, the pre-trained encoder is frozen (or partially unfrozen), and a lightweight task-specific head (linear layer for forecasting, or anomaly score for detection) is trained on domain data. This is the same transfer learning paradigm as BERT/GPT in NLP — pre-train on massive unlabeled data, then fine-tune efficiently."})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"TimesFM: Google's Patched Decoder Foundation Model"}),e.jsxs(c,{title:"TimesFM Architecture",children:["TimesFM (Das et al., 2024) is a ",e.jsx("strong",{children:"decoder-only Transformer"}),"with patch-based tokenization, trained on Google's large-scale internal time series corpus plus public data (Wikipedia, etc.). Unlike Chronos (which tokenizes values into discrete bins), TimesFM uses continuous real-valued patches with a lightweight patch embedding layer — similar to the input side of PatchTST, but with a causal decoder for auto-regressive generation."]}),e.jsxs("div",{className:"my-4 grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"p-3 bg-blue-50 border border-blue-200 rounded-lg",children:[e.jsx("p",{className:"font-semibold text-blue-800 text-sm mb-2",children:"MOMENT Highlights"}),e.jsxs("ul",{className:"text-xs text-blue-900 space-y-1",children:[e.jsx("li",{children:"T5 encoder (BERT-style bidirectional attention)"}),e.jsx("li",{children:"Masked patch modeling pre-training"}),e.jsx("li",{children:"Fixed 512-step context (required)"}),e.jsx("li",{children:"Strong at fine-tuning with few labels"}),e.jsx("li",{children:"Supports: forecasting, anomaly detection, classification, imputation"}),e.jsx("li",{children:"385M parameters (large only)"})]})]}),e.jsxs("div",{className:"p-3 bg-rose-50 border border-rose-200 rounded-lg",children:[e.jsx("p",{className:"font-semibold text-rose-800 text-sm mb-2",children:"TimesFM Highlights"}),e.jsxs("ul",{className:"text-xs text-rose-900 space-y-1",children:[e.jsx("li",{children:"Decoder-only (GPT-style causal attention)"}),e.jsx("li",{children:"Patch embedding (continuous values)"}),e.jsx("li",{children:"Up to 512+ step context"}),e.jsx("li",{children:"Point forecast primary; quantiles available"}),e.jsx("li",{children:"Extremely fast inference (non-autoregressive output)"}),e.jsx("li",{children:"200M parameters"})]})]})]}),e.jsxs(h,{title:"MOMENT vs. TimesFM: Key Trade-offs",children:[e.jsxs("p",{className:"text-sm text-gray-700",children:[e.jsx("strong",{children:"Choose MOMENT when:"})," you want to fine-tune a strong encoder on labeled domain data (transfer learning), need anomaly detection or imputation alongside forecasting, or prefer BERT-style bidirectional context over causal decoding. MOMENT is not a zero-shot forecaster in the same sense as Chronos — it requires a fine-tuning step for best forecasting performance."]}),e.jsxs("p",{className:"text-sm text-gray-700 mt-2",children:[e.jsx("strong",{children:"Choose TimesFM when:"})," you want the fastest possible point forecast with minimal infrastructure, you trust Google's large-scale pre-training data, or you need a high-throughput zero-shot baseline to compare against."]})]}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Complete Foundation Model Comparison"}),e.jsx(ue,{}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Implementation: MOMENT and TimesFM"}),e.jsx(u,{code:fe}),e.jsx("h2",{className:"text-xl font-semibold mt-8 mb-3 text-gray-800",children:"Practical Decision Guide"}),e.jsx("div",{className:"my-4 space-y-2",children:[{q:"Cold-start, no training data, need API",a:"TimeGPT",color:"purple"},{q:"Cold-start, need local / open-source probabilistic",a:"Chronos-Bolt",color:"amber"},{q:"Maximum point forecast speed, local",a:"TimesFM",color:"rose"},{q:"Multivariate with cross-variate dependencies",a:"Moirai or iTransformer",color:"emerald"},{q:"Heavy-tailed data, GluonTS pipeline",a:"Lag-Llama",color:"blue"},{q:"Few-shot fine-tuning on labeled domain data",a:"MOMENT or TFT",color:"indigo"},{q:"Panel training data available, rich covariates",a:"TFT or N-HiTS (NeuralForecast)",color:"gray"}].map(({q:t,a:o,color:i})=>e.jsxs("div",{className:"flex items-start gap-3 p-2 bg-gray-50 border border-gray-200 rounded",children:[e.jsx("span",{className:"text-sm text-gray-600 flex-1",children:t}),e.jsx("span",{className:"shrink-0 text-sm font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded",children:o})]},t))}),e.jsx(x,{title:"Rapid Pace of Change",children:"The foundation model landscape for time series is evolving extremely rapidly. Model rankings on benchmarks change with each paper, and new models (Lag-Llama 2, TimesFM 2.0, Chronos-Bolt improvements) are released frequently. Always re-evaluate against the current state of the art before making production commitments — what was best 6 months ago may no longer be the optimal choice."}),e.jsx(g,{title:"Starting Point Recommendation",children:e.jsxs("p",{className:"text-sm text-gray-700",children:["For most practitioners starting with foundation models, the recommended progression is: (1) try ",e.jsx("strong",{children:"Chronos-Bolt-Small"})," as a zero-shot local baseline — it is free, fast, and well-documented; (2) compare against ",e.jsx("strong",{children:"TimeGPT"})," via the Nixtla API for convenience; (3) only invest in larger models (Moirai, TimesFM, MOMENT) after establishing that the simpler options are insufficient for your use case."]})}),e.jsx(y,{references:[{author:"Goswami, M., Szafer, K., Choudhry, A., et al.",year:2024,title:"MOMENT: A Family of Open Time-series Foundation Models",venue:"ICML"},{author:"Das, A., Kong, W., Leach, A., Sen, R., & Yu, R.",year:2024,title:"A Decoder-Only Foundation Model for Time-Series Forecasting",venue:"ICML (TimesFM)"},{author:"Ansari, A. F., et al.",year:2024,title:"Chronos: Learning the Language of Time Series",venue:"Transactions on Machine Learning Research"},{author:"Woo, G., et al.",year:2024,title:"Unified Training of Universal Time Series Forecasting Transformers",venue:"ICML (Moirai)"}]})]})}const Ae=Object.freeze(Object.defineProperty({__proto__:null,default:xe},Symbol.toStringTag,{value:"Module"}));export{ve as a,Te as b,Me as c,ke as d,Se as e,we as f,Ne as g,Pe as h,Ae as i,_e as s};
