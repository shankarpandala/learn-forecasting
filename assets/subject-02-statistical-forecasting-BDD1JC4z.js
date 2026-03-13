import{j as e,r as p}from"./vendor-CnSysweu.js";import{r as t}from"./vendor-katex-CdqB51LS.js";import{S as A,N as j,D as _,P as b,R as M,W as S,T as z,E as B}from"./subject-01-ts-foundations-fmj7uPpc.js";import{R as k,L as F,C as w,X as T,Y as I,T as N,d as q,b as C,a as x,B as G,c as J}from"./vendor-charts-BucFqer8.js";const H=[112,118,132,129,121,135,148,148,136,119,104,118,115,126,141,135,125,149,170,170,158,133,114,140,145,150,178,163,172,178,199,199,184,162,146,166];function $(a,n,s,l,o,r=8){const i=a.length,d=12,c=a.reduce((m,f)=>m+f,0)/i,h=a[i-1],u=(a[i-1]-a[0])/(i-1),g=a.map((m,f)=>({t:f+1,actual:m})),v=[];for(let m=1;m<=r;m++){const y={t:i+m};n&&(y.mean=parseFloat(c.toFixed(1))),s&&(y.naive=h),l&&(y.seasonal=a[((i-1-(d-(m-1)%d))%i+i)%i]),o&&(y.drift=parseFloat((h+m*u).toFixed(1))),v.push(y)}return{history:g,forecasts:v}}function V(){const[a,n]=p.useState(!0),[s,l]=p.useState(!0),[o,r]=p.useState(!0),[i,d]=p.useState(!0),{history:c,forecasts:h}=p.useMemo(()=>$(H,a,s,o,i),[a,s,o,i]),u=[...c,...h],g=H.length+1;return e.jsxs("div",{className:"my-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",children:[e.jsx("h3",{className:"text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3",children:"Interactive: Baseline Forecasting Methods"}),e.jsx("div",{className:"flex flex-wrap gap-3 mb-4",children:[{key:"mean",label:"Mean",color:"#f59e0b",state:a,set:n},{key:"naive",label:"Naïve",color:"#3b82f6",state:s,set:l},{key:"seasonal",label:"Seasonal Naïve",color:"#10b981",state:o,set:r},{key:"drift",label:"Drift",color:"#ef4444",state:i,set:d}].map(({key:v,label:m,color:f,state:y,set:P})=>e.jsx("button",{onClick:()=>P(R=>!R),className:`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${y?"text-white border-transparent":"bg-transparent text-zinc-500 border-zinc-300 dark:border-zinc-600"}`,style:y?{backgroundColor:f,borderColor:f}:{},children:m},v))}),e.jsx(k,{width:"100%",height:280,children:e.jsxs(F,{data:u,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(w,{strokeDasharray:"3 3",stroke:"#374151",opacity:.3}),e.jsx(T,{dataKey:"t",tick:{fontSize:11},label:{value:"Time",position:"insideBottom",offset:-2,fontSize:11}}),e.jsx(I,{tick:{fontSize:11}}),e.jsx(N,{contentStyle:{fontSize:12}}),e.jsx(q,{wrapperStyle:{fontSize:12}}),e.jsx(C,{x:g,stroke:"#6b7280",strokeDasharray:"4 4",label:{value:"Forecast origin",fontSize:10,fill:"#9ca3af"}}),e.jsx(x,{dataKey:"actual",name:"Actual",stroke:"#94a3b8",strokeWidth:2,dot:!1,connectNulls:!0}),a&&e.jsx(x,{dataKey:"mean",name:"Mean",stroke:"#f59e0b",strokeWidth:2,strokeDasharray:"5 3",dot:!1,connectNulls:!0}),s&&e.jsx(x,{dataKey:"naive",name:"Naïve",stroke:"#3b82f6",strokeWidth:2,strokeDasharray:"5 3",dot:!1,connectNulls:!0}),o&&e.jsx(x,{dataKey:"seasonal",name:"Seasonal Naïve",stroke:"#10b981",strokeWidth:2,strokeDasharray:"5 3",dot:!1,connectNulls:!0}),i&&e.jsx(x,{dataKey:"drift",name:"Drift",stroke:"#ef4444",strokeWidth:2,strokeDasharray:"5 3",dot:!1,connectNulls:!0})]})}),e.jsx("p",{className:"text-xs text-zinc-400 mt-2",children:"Toggle methods to compare. Dashed lines are forecasts beyond the vertical reference line."})]})}const X=`# Baseline forecasting with statsforecast
# pip install statsforecast

import pandas as pd
import numpy as np
from statsforecast import StatsForecast
from statsforecast.models import (
    Naive,
    SeasonalNaive,
    HistoricAverage,
    RandomWalkWithDrift,
)

# Create a sample dataset (AirPassengers-style)
np.random.seed(42)
dates = pd.date_range('2019-01', periods=36, freq='MS')
values = [112, 118, 132, 129, 121, 135, 148, 148, 136, 119,
          104, 118, 115, 126, 141, 135, 125, 149, 170, 170,
          158, 133, 114, 140, 145, 150, 178, 163, 172, 178,
          199, 199, 184, 162, 146, 166]

df = pd.DataFrame({
    'unique_id': 'passengers',
    'ds': dates,
    'y': values,
})

# Instantiate all four baseline models
sf = StatsForecast(
    models=[
        HistoricAverage(),           # Mean method
        Naive(),                     # Naive method
        SeasonalNaive(season_length=12),  # Seasonal naive (monthly)
        RandomWalkWithDrift(),       # Drift method
    ],
    freq='MS',
    n_jobs=-1,
)

# Fit and forecast 12 periods ahead
forecasts = sf.forecast(df=df, h=12)
print(forecasts.head(12))

# Cross-validation: expanding window, 3-step-ahead, 4 windows
cv_df = sf.cross_validation(
    df=df,
    h=3,
    n_windows=4,
    step_size=1,
)

# Compute MAE per model
from statsforecast.utils import mae
errors = cv_df.groupby('unique_id').apply(
    lambda g: pd.Series({
        'MAE_HistoricAverage':   mae(g['y'], g['HistoricAverage']),
        'MAE_Naive':             mae(g['y'], g['Naive']),
        'MAE_SeasonalNaive':     mae(g['y'], g['SeasonalNaive']),
        'MAE_RWWithDrift':       mae(g['y'], g['RandomWalkWithDrift']),
    })
)
print(errors)
`,Q=[{label:"FPP3 §5",title:"Forecasting: Principles and Practice (3rd ed.) – Chapter 5: The forecaster's toolbox",authors:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/simple-methods.html"},{label:"statsforecast",title:"Nixtla statsforecast – fast statistical forecasting",authors:"Nixtla",year:2022,url:"https://nixtlaverse.nixtla.io/statsforecast/index.html"}];function Z(){return e.jsxs(A,{title:"Benchmark Forecasting Methods",difficulty:"beginner",readingTime:12,children:[e.jsx("p",{children:"Before building any sophisticated model, every forecasting project should benchmark against simple baseline methods. If your model cannot beat a naïve forecast, something is wrong — either the data has no exploitable structure or the model is over-engineered."}),e.jsx(j,{type:"fpp3",title:"FPP3 Chapter 5",children:'Hyndman & Athanasopoulos devote Chapter 5 to these "toolbox" methods, stressing that even simple benchmarks provide a lower bar that any serious method must surpass.'}),e.jsx("h2",{children:"1. Mean Method"}),e.jsx("p",{children:"The mean method forecasts every future value as the historical average:"}),e.jsx(t.BlockMath,{math:"\\hat{y}_{T+h \\mid T} = \\bar{y} = \\frac{1}{T}\\sum_{t=1}^{T} y_t"}),e.jsx("p",{children:"The forecast is flat: all future periods get the same value. This works reasonably well for stationary series with no trend or seasonality, but badly for everything else."}),e.jsx("h2",{children:"2. Naïve Method"}),e.jsx(_,{label:"Definition 5.1",title:"Naïve Forecast",definition:"Set all forecasts equal to the last observed value:",notation:"\\hat{y}_{T+h \\mid T} = y_T"}),e.jsxs("p",{children:["The naïve method is optimal for a random walk process. It is widely used in financial markets — the EMH (Efficient Market Hypothesis) implies stock prices follow a random walk, making naïve the theoretically justified baseline. ",e.jsx("strong",{children:"Beating the naïve is the minimum bar"})," for any new model."]}),e.jsx("h2",{children:"3. Seasonal Naïve Method"}),e.jsx("p",{children:"For seasonal data, a more competitive benchmark repeats the value from the same season in the previous cycle:"}),e.jsx(t.BlockMath,{math:"\\hat{y}_{T+h \\mid T} = y_{T+h - m\\lceil h/m \\rceil}"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"m"})," is the seasonal period (e.g., 12 for monthly, 4 for quarterly, 7 for daily-with-weekly-seasonality). The seasonal naïve is often very hard to beat on retail, energy, and transportation data."]}),e.jsx("h2",{children:"4. Drift Method"}),e.jsx("p",{children:"The drift method adds the average change observed in the history to the last value:"}),e.jsx(t.BlockMath,{math:"\\hat{y}_{T+h \\mid T} = y_T + h \\cdot \\frac{y_T - y_1}{T - 1}"}),e.jsx("p",{children:"This is equivalent to drawing a straight line between the first and last observations and extrapolating. When there is a clear long-run trend this often outperforms the other three baselines."}),e.jsx("h2",{children:"Interactive Comparison"}),e.jsx(V,{}),e.jsx("h2",{children:"Why Baselines Matter"}),e.jsx("p",{children:"A common mistake is to compare a complex ML model only against a naive RMSE or against other ML models. Benchmarks serve three purposes:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Sanity check"})," — any model worse than naïve should be discarded."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Context"})," — a 5% MAPE improvement over seasonal naïve is meaningful; a 5% improvement over a random guess is not."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Computational trade-off"})," — seasonal naïve runs in microseconds; a neural network may run for hours. If accuracy gains are marginal, the baseline wins."]})]}),e.jsxs(j,{type:"tip",title:"Practical Tip",children:["Always include at least ",e.jsx("strong",{children:"Naïve"})," and ",e.jsx("strong",{children:"SeasonalNaïve"})," in every evaluation table. A model that fails to beat both should not be deployed."]}),e.jsx("h2",{children:"Python Implementation"}),e.jsx(b,{code:X,filename:"baseline_methods.py",title:"All four baseline methods with statsforecast"}),e.jsx(M,{references:Q})]})}const at=Object.freeze(Object.defineProperty({__proto__:null,default:Z},Symbol.toStringTag,{value:"Module"})),E=(()=>{const n=[];for(let s=0;s<60;s++){const l=50+.4*s,o=8*Math.sin(2*Math.PI*s/12),r=Math.sin(s*7.3)*5+Math.cos(s*3.1)*3;n.push(parseFloat((l+o+r).toFixed(2)))}return n})();function Y(a,n){return a.map((s,l)=>{if(l<n-1)return null;const o=a.slice(l-n+1,l+1);return parseFloat((o.reduce((r,i)=>r+i,0)/n).toFixed(2))})}function ee(a,n){const s=Math.floor(n/2);return a.map((l,o)=>{if(o<s||o>=a.length-s)return null;const r=a.slice(o-s,o+s+1);return parseFloat((r.reduce((i,d)=>i+d,0)/r.length).toFixed(2))})}function te(){const[a,n]=p.useState(6),[s,l]=p.useState(!1),o=p.useMemo(()=>Y(E,a),[a]),r=p.useMemo(()=>ee(E,a%2===0?a+1:a),[a]),i=E.map((d,c)=>({t:c+1,actual:d,sma:o[c],cma:s?r[c]:void 0}));return e.jsxs("div",{className:"my-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",children:[e.jsx("h3",{className:"text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3",children:"Interactive: Moving Average Window Size"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-4 mb-4",children:[e.jsxs("label",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:["Window (k): ",e.jsx("span",{className:"font-bold text-sky-500",children:a})]}),e.jsx("input",{type:"range",min:2,max:20,value:a,onChange:d=>n(Number(d.target.value)),className:"w-48 accent-sky-500"}),e.jsx("button",{onClick:()=>l(d=>!d),className:`px-3 py-1 rounded-lg text-xs font-medium border ${s?"bg-emerald-600 text-white border-emerald-600":"border-zinc-400 text-zinc-500"}`,children:"Centered MA"})]}),e.jsx(k,{width:"100%",height:280,children:e.jsxs(F,{data:i,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(w,{strokeDasharray:"3 3",stroke:"#374151",opacity:.3}),e.jsx(T,{dataKey:"t",tick:{fontSize:11}}),e.jsx(I,{tick:{fontSize:11}}),e.jsx(N,{contentStyle:{fontSize:12}}),e.jsx(q,{wrapperStyle:{fontSize:12}}),e.jsx(x,{dataKey:"actual",name:"Actual",stroke:"#94a3b8",strokeWidth:1.5,dot:!1}),e.jsx(x,{dataKey:"sma",name:`SMA(${a})`,stroke:"#3b82f6",strokeWidth:2,dot:!1,connectNulls:!0}),s&&e.jsx(x,{dataKey:"cma",name:"Centered MA",stroke:"#10b981",strokeWidth:2,dot:!1,connectNulls:!0})]})}),e.jsx("p",{className:"text-xs text-zinc-400 mt-2",children:"Larger windows smooth more noise but introduce more lag. Toggle Centered MA to see the symmetrically aligned version."})]})}const ae=`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Generate example data
np.random.seed(0)
n = 60
t = np.arange(n)
y = 50 + 0.4 * t + 8 * np.sin(2 * np.pi * t / 12) + np.random.normal(0, 3, n)
ts = pd.Series(y, index=pd.date_range("2019-01", periods=n, freq="MS"))

# --- Simple Moving Average ---
k = 6
sma = ts.rolling(window=k).mean()           # trailing MA
print(sma.head(10))

# --- Weighted Moving Average with declining weights ---
weights = np.arange(1, k + 1, dtype=float)  # [1, 2, 3, 4, 5, 6]
weights /= weights.sum()                     # normalize

wma = ts.rolling(window=k).apply(
    lambda x: np.dot(x, weights), raw=True
)
print(wma.head(10))

# --- Centered Moving Average (for seasonal adjustment) ---
# Use even window via two passes for even-length windows
m = 12   # monthly seasonality
cma_even = ts.rolling(window=m, center=True).mean()       # approx centered
# Proper 2×m centered MA for even m:
cma_2m = ts.rolling(window=m).mean()
cma_2m_center = (cma_2m + cma_2m.shift(-1)) / 2          # average to center

# --- Detrend by removing CMA (classic decomposition step) ---
detrended = ts - cma_2m_center
seasonal_avg = detrended.groupby(detrended.index.month).transform('mean')
remainder = detrended - seasonal_avg
print("\\nRemainder variance:", remainder.dropna().var().round(2))

# --- Henderson MA (trend estimation, used in X-11/X-13) ---
# The 13-term Henderson filter weights:
henderson_13 = np.array([
    -0.019, -0.028,  0.000,  0.066,  0.147,  0.214,
     0.240,
     0.214,  0.147,  0.066,  0.000, -0.028, -0.019,
])
hma = ts.rolling(window=13, center=True).apply(
    lambda x: np.dot(x, henderson_13), raw=True
)

# Plot all
fig, axes = plt.subplots(2, 1, figsize=(12, 8), sharex=True)
axes[0].plot(ts, label='Raw', alpha=0.6, color='gray')
axes[0].plot(sma, label=f'SMA({k})', color='blue')
axes[0].plot(wma, label=f'WMA({k})', color='orange', linestyle='--')
axes[0].plot(hma, label='Henderson-13', color='red')
axes[0].legend(); axes[0].set_title('Smoothing Methods')

axes[1].plot(detrended, label='Detrended', alpha=0.7)
axes[1].plot(seasonal_avg, label='Seasonal Component', color='purple')
axes[1].legend(); axes[1].set_title('Decomposition via Centered MA')
plt.tight_layout()
plt.savefig('moving_averages.png', dpi=150)
`,se=[{label:"FPP3 §3.3",title:"Forecasting: Principles and Practice – Moving averages",authors:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/moving-averages.html"},{label:"pandas rolling",title:"pandas.DataFrame.rolling documentation",authors:"pandas development team",year:2023,url:"https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rolling.html"}];function re(){return e.jsxs(A,{title:"Moving Averages & Smoothing",difficulty:"beginner",readingTime:14,prerequisites:["Baseline methods"],children:[e.jsxs("p",{children:["Moving averages are among the oldest smoothing techniques in time series analysis. Rather than forecasting, they are primarily used to ",e.jsx("em",{children:"extract trend-cycle components"}),"and remove noise — an essential step before classical decomposition and some ARIMA preprocessing."]}),e.jsx("h2",{children:"1. Simple Moving Average"}),e.jsx(_,{label:"Definition",title:"Simple Moving Average (SMA)",definition:"The k-point trailing moving average at time t is the average of the k most recent observations.",notation:"\\hat{T}_t = \\frac{1}{k}\\sum_{j=0}^{k-1} y_{t-j}"}),e.jsx("p",{children:"Key properties of the SMA:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Larger ",e.jsx(t.InlineMath,{math:"k"})," → more smoothing, more lag introduced."]}),e.jsx("li",{children:"The MA removes random variation but does not forecast ahead (it is a lag-based filter)."}),e.jsxs("li",{children:["For a series with no trend, ",e.jsx(t.InlineMath,{math:"k \\to T"})," recovers the mean method."]})]}),e.jsx("h2",{children:"2. Weighted Moving Average"}),e.jsx("p",{children:"A weighted MA assigns different importance to each observation. Declining weights are the most common choice — giving more importance to recent data:"}),e.jsx(t.BlockMath,{math:"\\hat{T}_t = \\sum_{j=0}^{k-1} w_j \\, y_{t-j}, \\quad \\sum_{j=0}^{k-1} w_j = 1"}),e.jsxs("p",{children:["A simple linearly-declining scheme: ",e.jsx(t.InlineMath,{math:"w_j \\propto (k - j)"}),", so the most recent observation receives weight ",e.jsx(t.InlineMath,{math:"k"})," and the oldest receives weight 1, normalized to sum to 1."]}),e.jsx("h2",{children:"3. Centered Moving Average"}),e.jsxs("p",{children:["For ",e.jsx("em",{children:"trend estimation"})," rather than smoothing, a ",e.jsx("strong",{children:"centered"})," MA places the smoothed value at the center of the window:"]}),e.jsx(t.BlockMath,{math:"\\hat{T}_t = \\frac{1}{k}\\sum_{j=-(k-1)/2}^{(k-1)/2} y_{t+j} \\quad (k \\text{ odd})"}),e.jsxs("p",{children:["For even ",e.jsx(t.InlineMath,{math:"k"}),", a 2×m centered MA is used: average two consecutive k-period trailing MAs to achieve centering:"]}),e.jsx(t.BlockMath,{math:"\\hat{T}_t = \\frac{1}{2}\\left(\\frac{1}{m}\\sum_{j=0}^{m-1} y_{t-j} + \\frac{1}{m}\\sum_{j=1}^{m} y_{t-j}\\right)"}),e.jsx("p",{children:"This 2×12 centered MA is used in classical additive decomposition to estimate the trend-cycle before computing seasonal and remainder components."}),e.jsx("h2",{children:"4. Henderson Moving Average"}),e.jsx("p",{children:"The Henderson MA is a specialized filter used in official statistics (X-11/X-13 seasonal adjustment). Its weights minimize the sum of squares of third differences, producing a smooth trend estimate that passes cubic polynomials exactly:"}),e.jsx(t.BlockMath,{math:"\\hat{T}_t = \\sum_{j=-h}^{h} w_j^{(H)} y_{t+j}"}),e.jsx("p",{children:"The 13-term Henderson filter is commonly used for monthly data. Unlike a simple MA, it allows negative weights to better handle non-monotone trends."}),e.jsxs(S,{title:"Moving Averages Are Not Forecasting Methods",children:["Simple and centered moving averages are ",e.jsx("em",{children:"smoothers"}),", not forecasting methods. They cannot produce h-step-ahead forecasts because centered MA requires future values. For forecasting, use exponential smoothing or ARIMA instead. Use MAs to extract trend components for decomposition and seasonal adjustment."]}),e.jsx("h2",{children:"Interactive Window Size Comparison"}),e.jsx(te,{}),e.jsxs(j,{type:"tip",title:"Choosing the Window Size",children:["A common heuristic: set ",e.jsx(t.InlineMath,{math:"k"})," equal to the seasonal period (",e.jsx(t.InlineMath,{math:"k=12"})," for monthly, ",e.jsx(t.InlineMath,{math:"k=4"})," for quarterly). This averages out exactly one full seasonal cycle, effectively removing seasonality from the trend estimate."]}),e.jsx("h2",{children:"Python Implementation"}),e.jsx(b,{code:ae,filename:"moving_averages.py",title:"Simple, Weighted, Centered, and Henderson MAs with pandas"}),e.jsx(M,{references:se})]})}const st=Object.freeze(Object.defineProperty({__proto__:null,default:re},Symbol.toStringTag,{value:"Module"})),D=[17.55,21.86,23.89,26.93,26.89,28.83,30.08,30.95,30.19,31.58,32.58,33.48,39.02,41.39,41.6,48.55,46.9,47,50.9,55.9],ie=8;function ne(a,n,s=null){const l=a.length,o=[s!==null?s:a[0]];for(let d=1;d<l;d++)o.push(n*a[d-1]+(1-n)*o[d-1]);const r=o.slice(1).concat([o[l-1]]),i=n*a[l-1]+(1-n)*o[l-1];return{level:o,fitted:r,forecastLevel:i}}function oe(){const[a,n]=p.useState(.3),s=D.length,{level:l,forecastLevel:o}=p.useMemo(()=>ne(D,a),[a]),r=D.map((i,d)=>({t:d+1,actual:i,level:parseFloat(l[d].toFixed(2))}));for(let i=1;i<=ie;i++)r.push({t:s+i,forecast:parseFloat(o.toFixed(2))});return e.jsxs("div",{className:"my-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",children:[e.jsx("h3",{className:"text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3",children:"Interactive: SES Level Tracking"}),e.jsxs("div",{className:"flex items-center gap-4 mb-4",children:[e.jsxs("label",{className:"text-sm text-zinc-600 dark:text-zinc-400",children:["α = ",e.jsx("span",{className:"font-bold text-sky-500",children:a.toFixed(2)})]}),e.jsx("input",{type:"range",min:.01,max:.99,step:.01,value:a,onChange:i=>n(parseFloat(i.target.value)),className:"w-56 accent-sky-500"}),e.jsx("span",{className:"text-xs text-zinc-400",children:a<.2?"Long memory (slow adaptation)":a>.7?"Near naïve (fast adaptation)":"Balanced"})]}),e.jsx(k,{width:"100%",height:280,children:e.jsxs(F,{data:r,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(w,{strokeDasharray:"3 3",stroke:"#374151",opacity:.3}),e.jsx(T,{dataKey:"t",tick:{fontSize:11}}),e.jsx(I,{tick:{fontSize:11}}),e.jsx(N,{contentStyle:{fontSize:12}}),e.jsx(q,{wrapperStyle:{fontSize:12}}),e.jsx(C,{x:s+1,stroke:"#6b7280",strokeDasharray:"4 4"}),e.jsx(x,{dataKey:"actual",name:"Actual",stroke:"#94a3b8",strokeWidth:2,dot:!1}),e.jsx(x,{dataKey:"level",name:"Level ℓ_t",stroke:"#3b82f6",strokeWidth:2,dot:!1,connectNulls:!0}),e.jsx(x,{dataKey:"forecast",name:"Forecast",stroke:"#f59e0b",strokeWidth:2,strokeDasharray:"6 3",dot:!1,connectNulls:!0})]})}),e.jsx("p",{className:"text-xs text-zinc-400 mt-2",children:"With α close to 0, the level changes slowly. With α close to 1, the level tracks recent data tightly (approaching naïve)."})]})}const le=`# Simple Exponential Smoothing (SES)
# pip install statsmodels statsforecast

import numpy as np
import pandas as pd

# ── Option 1: statsmodels (full diagnostics) ──────────────────────────────────
from statsmodels.tsa.holtwinters import SimpleExpSmoothing

data = [17.55, 21.86, 23.89, 26.93, 26.89, 28.83, 30.08, 30.95,
        30.19, 31.58, 32.58, 33.48, 39.02, 41.39, 41.60, 48.55,
        46.90, 47.00, 50.90, 55.90]
y = pd.Series(data)

# Fit with automatic alpha via MLE (minimizes log-likelihood)
model = SimpleExpSmoothing(y, initialization_method='estimated')
fit = model.fit(optimized=True)

print(f"Optimal alpha: {fit.params['smoothing_level']:.4f}")
print(f"Initial level: {fit.params['initial_level']:.4f}")
print(f"AIC:           {fit.aic:.2f}")

# Forecast 8 steps ahead (flat forecast = last level)
fc = fit.forecast(8)
print("\\nForecasts:", fc.round(2).tolist())

# Prediction intervals
summary = fit.summary()
print(summary.tables[1])

# ── Option 2: statsforecast (faster, production use) ─────────────────────────
from statsforecast import StatsForecast
from statsforecast.models import SES

df = pd.DataFrame({
    'unique_id': 'oil',
    'ds': pd.date_range('2000', periods=len(data), freq='YS'),
    'y': data,
})

sf = StatsForecast(models=[SES(season_length=1, alpha=None)], freq='YS')
sf.fit(df)
forecasts = sf.predict(h=8, level=[80, 95])
print(forecasts)

# ── Manual SES to understand the recursion ───────────────────────────────────
def ses_manual(y, alpha, l0=None):
    T = len(y)
    l = np.empty(T + 1)
    l[0] = y[0] if l0 is None else l0
    for t in range(1, T + 1):
        l[t] = alpha * y[t - 1] + (1 - alpha) * l[t - 1]
    fitted  = l[1:]          # one-step-ahead fitted values
    forecast = l[T]           # flat h-step forecast
    sse = np.sum((y - fitted) ** 2)
    return fitted, forecast, sse

fitted, fc_val, sse = ses_manual(np.array(data), alpha=0.83)
print(f"\\nManual SSE at α=0.83: {sse:.4f}")
print(f"Forecast: {fc_val:.2f}")
`,de=[{label:"FPP3 §8.1",title:"Forecasting: Principles and Practice – Simple Exponential Smoothing",authors:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/ses.html"},{label:"Brown 1959",title:"Statistical Forecasting for Inventory Control",authors:"Brown, R.G.",year:1959}];function ce(){return e.jsxs(A,{title:"Simple Exponential Smoothing",difficulty:"beginner",readingTime:15,prerequisites:["Baseline methods","Moving averages"],children:[e.jsxs("p",{children:["Simple Exponential Smoothing (SES) is the foundation of the entire exponential smoothing family. Unlike a moving average with equal weights, SES assigns ",e.jsx("em",{children:"exponentially declining weights"})," to past observations — the most recent data matters most, but every historical observation contributes."]}),e.jsx(j,{type:"fpp3",title:"FPP3 Chapter 8",children:"This section covers FPP3 §8.1. SES is the simplest member of the ETS (Error–Trend– Seasonal) family and is equivalent to ETS(A,N,N)."}),e.jsx("h2",{children:"1. The Smoothing Equation"}),e.jsx(_,{label:"Definition 8.1",title:"Simple Exponential Smoothing",definition:"The level equation recursively updates a smoothed estimate of the current level of the series.",notation:"\\ell_t = \\alpha y_t + (1 - \\alpha)\\ell_{t-1}, \\quad 0 < \\alpha \\leq 1"}),e.jsxs("p",{children:["The forecast for any horizon ",e.jsx(t.InlineMath,{math:"h"})," is simply the current level:"]}),e.jsx(t.BlockMath,{math:"\\hat{y}_{T+h \\mid T} = \\ell_T \\quad \\text{for all } h \\geq 1"}),e.jsx("p",{children:"This means SES produces a flat forecast — appropriate for data with no trend or seasonality. Extending to trend requires Holt's method; adding seasonality requires Holt-Winters."}),e.jsx("h2",{children:"2. The α Parameter"}),e.jsxs("p",{children:["The smoothing parameter ",e.jsx(t.InlineMath,{math:"\\alpha"})," controls the speed of adaptation:"]}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm text-zinc-700 dark:text-zinc-300 border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-zinc-100 dark:bg-zinc-800",children:[e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:"α value"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:"Behaviour"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:"Analogous to"})]})}),e.jsx("tbody",{children:[["α → 0","Very slow adaptation; long memory; nearly flat level","Mean method"],["α ≈ 0.1–0.3","Slow adaptation; weights spread over many periods","Wide MA window"],["α ≈ 0.5–0.7","Moderate; weights concentrated on recent ~5–10 obs","Narrow MA"],["α → 1","Very fast; essentially the naïve method","Naïve forecast"]].map(([a,n,s])=>e.jsxs("tr",{children:[e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-mono",children:a}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:n}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sky-600 dark:text-sky-400",children:s})]},a))})]})}),e.jsx("h2",{children:"3. Weighted Average Form"}),e.jsx("p",{children:"Expanding the recursion reveals that SES is a weighted average of all past observations with geometrically declining weights:"}),e.jsx(t.BlockMath,{math:"\\ell_T = \\alpha \\sum_{j=0}^{T-1} (1-\\alpha)^j y_{T-j} + (1-\\alpha)^T \\ell_0"}),e.jsxs("p",{children:["The weight on observation ",e.jsx(t.InlineMath,{math:"y_{T-j}"})," is"," ",e.jsx(t.InlineMath,{math:"\\alpha(1-\\alpha)^j"}),", which decays exponentially with lag"," ",e.jsx(t.InlineMath,{math:"j"}),". The sum of all weights equals 1 (geometric series)."]}),e.jsx(z,{label:"Theorem 8.1",title:"Optimal α via SSE Minimization",statement:"The optimal smoothing parameter α* minimizes the one-step-ahead sum of squared errors: SSE(α) = Σ(y_t − ŷ_{t|t−1})² = Σ(y_t − ℓ_{t−1})². This is equivalent to maximizing the Gaussian log-likelihood when ε_t ~ N(0,σ²).",proof:"Substituting the SES recursion, ŷ_{t|t-1} = ℓ_{t-1} = α·y_{t-1} + (1-α)·ℓ_{t-2}. The SSE is a continuous function of α on (0,1] and can be minimized via standard numerical optimization (e.g., Brent's method).",corollaries:["The optimal α can be found analytically for AR(1) processes: if y_t = φ·y_{t-1} + ε_t, then α* = 1 − φ.","AIC and AICc from the likelihood can be used to compare SES against other models."]}),e.jsx("h2",{children:"Interactive: Level Tracking"}),e.jsx(oe,{}),e.jsx(B,{title:"Fitting SES to Oil Production Data",difficulty:"beginner",problem:"Given 20 years of annual oil production data, fit SES and compute 8-year forecasts. The data shows no clear trend.",solution:[{step:"Initialize the level",formula:"\\ell_0 = y_1 = 17.55 \\quad \\text{(or optimize } \\ell_0 \\text{ jointly with } \\alpha)",explanation:"A common initialization is to set the initial level equal to the first observation. Alternatively, estimate ℓ₀ jointly via MLE."},{step:"Compute first update",formula:"\\ell_1 = \\alpha y_1 + (1-\\alpha)\\ell_0",explanation:"For α=0.83: ℓ₁ = 0.83×17.55 + 0.17×17.55 = 17.55 (first step is trivial if ℓ₀=y₁)."},{step:"Continue recursion",formula:"\\ell_T = \\alpha y_T + (1-\\alpha)\\ell_{T-1}",explanation:"After all 20 observations, ℓ₂₀ becomes the forecast for all future periods."},{step:"Flat h-step forecast",formula:"\\hat{y}_{T+h|T} = \\ell_T \\quad \\forall h \\geq 1",explanation:"SES does not extrapolate a trend, so all future forecasts equal the final level estimate."}]}),e.jsx("h2",{children:"Python: statsmodels & statsforecast"}),e.jsx(b,{code:le,filename:"ses.py",title:"Simple Exponential Smoothing — two implementations"}),e.jsx(M,{references:de})]})}const rt=Object.freeze(Object.defineProperty({__proto__:null,default:ce},Symbol.toStringTag,{value:"Module"})),L=Array.from({length:48},(n,s)=>{const l=20+.8*s,o=6*Math.sin(2*Math.PI*s/12),r=Math.sin(s*4.7)*2.5;return parseFloat((l+o+r).toFixed(2))});function me(a,n,s,l=1,o=12){const r=a.length,i=[a[0]],d=[a[1]-a[0]];for(let h=1;h<r;h++)i.push(n*a[h]+(1-n)*(i[h-1]+l*d[h-1])),d.push(s*(i[h]-i[h-1])+(1-s)*l*d[h-1]);const c=[];for(let h=1;h<=o;h++){let u=0;for(let g=1;g<=h;g++)u+=Math.pow(l,g);c.push(parseFloat((i[r-1]+u*d[r-1]).toFixed(2)))}return{l:i,b:d,forecasts:c}}function he(){const[a,n]=p.useState(.3),[s,l]=p.useState(.1),[o,r]=p.useState(!1),[i,d]=p.useState(.9),c=L.length,h=16,{l:u,forecasts:g}=p.useMemo(()=>me(L,a,s,o?i:1,h),[a,s,o,i]),v=L.map((m,f)=>({t:f+1,actual:m,level:parseFloat(u[f].toFixed(2))}));return g.forEach((m,f)=>{v.push({t:c+f+1,forecast:m})}),e.jsxs("div",{className:"my-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",children:[e.jsx("h3",{className:"text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3",children:"Interactive: Holt's Linear Method with Optional Damping"}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3 mb-4",children:[[{label:"α (level)",value:a,set:n,min:.01,max:.99,step:.01},{label:"β (trend)",value:s,set:l,min:.01,max:.99,step:.01}].map(({label:m,value:f,set:y,min:P,max:R,step:O})=>e.jsxs("div",{children:[e.jsxs("p",{className:"text-xs text-zinc-500 mb-1",children:[m," = ",e.jsx("span",{className:"text-sky-500 font-bold",children:f.toFixed(2)})]}),e.jsx("input",{type:"range",min:P,max:R,step:O,value:f,onChange:U=>y(parseFloat(U.target.value)),className:"w-full accent-sky-500"})]},m)),e.jsx("div",{className:"flex items-center gap-2",children:e.jsxs("button",{onClick:()=>r(m=>!m),className:`px-3 py-1 rounded text-xs font-medium ${o?"bg-amber-500 text-white":"border border-zinc-400 text-zinc-500"}`,children:["Damped: ",o?"ON":"OFF"]})}),o&&e.jsxs("div",{children:[e.jsxs("p",{className:"text-xs text-zinc-500 mb-1",children:["φ = ",e.jsx("span",{className:"text-amber-500 font-bold",children:i.toFixed(2)})]}),e.jsx("input",{type:"range",min:.8,max:.99,step:.01,value:i,onChange:m=>d(parseFloat(m.target.value)),className:"w-full accent-amber-500"})]})]}),e.jsx(k,{width:"100%",height:280,children:e.jsxs(F,{data:v,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(w,{strokeDasharray:"3 3",stroke:"#374151",opacity:.3}),e.jsx(T,{dataKey:"t",tick:{fontSize:11}}),e.jsx(I,{tick:{fontSize:11}}),e.jsx(N,{contentStyle:{fontSize:12}}),e.jsx(q,{wrapperStyle:{fontSize:12}}),e.jsx(C,{x:c+1,stroke:"#6b7280",strokeDasharray:"4 4"}),e.jsx(x,{dataKey:"actual",name:"Actual",stroke:"#94a3b8",strokeWidth:2,dot:!1}),e.jsx(x,{dataKey:"level",name:"Level",stroke:"#3b82f6",strokeWidth:1.5,dot:!1,connectNulls:!0}),e.jsx(x,{dataKey:"forecast",name:"Forecast",stroke:"#f59e0b",strokeWidth:2,strokeDasharray:"6 3",dot:!1,connectNulls:!0})]})}),e.jsx("p",{className:"text-xs text-zinc-400 mt-2",children:"With damping ON, long-run forecasts converge to a constant rather than extrapolating the trend indefinitely."})]})}const pe=`# Holt's Method and Holt-Winters with statsmodels
# pip install statsmodels

import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing

# Synthetic monthly data with trend + seasonality
np.random.seed(0)
n = 48
t = np.arange(n)
y = 20 + 0.8*t + 6*np.sin(2*np.pi*t/12) + np.random.normal(0, 2, n)
ts = pd.Series(y, index=pd.date_range("2020-01", periods=n, freq="MS"))

# ── 1. Holt's Linear Method (trend, no seasonality) ──────────────────────────
holt = ExponentialSmoothing(ts, trend='add', seasonal=None,
                             initialization_method='estimated')
holt_fit = holt.fit(optimized=True)
print("Holt linear:")
print(f"  alpha={holt_fit.params['smoothing_level']:.3f}, "
      f"beta={holt_fit.params['smoothing_trend']:.3f}")
print(f"  AIC={holt_fit.aic:.2f}")

# ── 2. Holt's Damped Trend ────────────────────────────────────────────────────
holt_d = ExponentialSmoothing(ts, trend='add', damped_trend=True, seasonal=None,
                               initialization_method='estimated')
holt_d_fit = holt_d.fit(optimized=True)
print("\\nHolt damped:")
print(f"  phi={holt_d_fit.params['damping_trend']:.3f}")
print(f"  AIC={holt_d_fit.aic:.2f}")

# ── 3. Holt-Winters Additive Seasonality ─────────────────────────────────────
hw_add = ExponentialSmoothing(ts, trend='add', seasonal='add',
                               seasonal_periods=12,
                               initialization_method='estimated')
hw_add_fit = hw_add.fit(optimized=True)
print("\\nHolt-Winters additive:")
print(f"  alpha={hw_add_fit.params['smoothing_level']:.3f}, "
      f"beta={hw_add_fit.params['smoothing_trend']:.3f}, "
      f"gamma={hw_add_fit.params['smoothing_seasonal']:.3f}")
print(f"  AIC={hw_add_fit.aic:.2f}")

# ── 4. Holt-Winters Multiplicative Seasonality ───────────────────────────────
hw_mul = ExponentialSmoothing(ts, trend='add', seasonal='mul',
                               seasonal_periods=12,
                               initialization_method='estimated')
hw_mul_fit = hw_mul.fit(optimized=True)
print("\\nHolt-Winters multiplicative:")
print(f"  AIC={hw_mul_fit.aic:.2f}")

# ── Forecast and prediction intervals ────────────────────────────────────────
fc = hw_add_fit.forecast(12)
sim = hw_add_fit.simulate(12, repetitions=1000, error="add")
lower = sim.quantile(0.025, axis=1)
upper = sim.quantile(0.975, axis=1)
print("\\n12-step-ahead forecasts (additive H-W):")
print(pd.DataFrame({'forecast': fc, 'lower_95': lower, 'upper_95': upper}).round(2))
`,fe=[{label:"FPP3 §8.2-8.4",title:"Forecasting: Principles and Practice – Holt's and Holt-Winters' methods",authors:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/holt.html"},{label:"Gardner 1985",title:"Exponential smoothing: The state of the art",authors:"Gardner, E.S.",year:1985,url:"https://doi.org/10.1002/for.3980040103"}];function ue(){return e.jsxs(A,{title:"Holt's Method & Holt-Winters",difficulty:"intermediate",readingTime:20,prerequisites:["Simple Exponential Smoothing"],children:[e.jsx("p",{children:"SES only tracks the level. When data exhibits a trend or seasonality, we need additional state components. Holt's method adds a trend component; Holt-Winters further adds a seasonal component."}),e.jsx("h2",{children:"1. Holt's Linear (Double Exponential Smoothing)"}),e.jsxs("p",{children:["Holt's method maintains two equations: one for the ",e.jsx("strong",{children:"level"})," and one for the ",e.jsx("strong",{children:"trend"}),":"]}),e.jsx(t.BlockMath,{math:"\\ell_t = \\alpha y_t + (1-\\alpha)(\\ell_{t-1} + b_{t-1})"}),e.jsx(t.BlockMath,{math:"b_t = \\beta(\\ell_t - \\ell_{t-1}) + (1-\\beta)b_{t-1}"}),e.jsx("p",{children:"The h-step-ahead forecast is a linear extrapolation:"}),e.jsx(t.BlockMath,{math:"\\hat{y}_{T+h|T} = \\ell_T + h b_T"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\alpha \\in (0,1]"})," controls level smoothing and"," ",e.jsx(t.InlineMath,{math:"\\beta \\in (0,1]"})," controls trend smoothing."]}),e.jsx("h2",{children:"2. Holt's Damped Trend"}),e.jsxs("p",{children:["Unbounded linear extrapolation often over-forecasts in the long run. The damped trend method introduces ",e.jsx(t.InlineMath,{math:"\\phi \\in (0,1)"})," to attenuate the trend at longer horizons:"]}),e.jsx(t.BlockMath,{math:"\\ell_t = \\alpha y_t + (1-\\alpha)(\\ell_{t-1} + \\phi b_{t-1})"}),e.jsx(t.BlockMath,{math:"b_t = \\beta(\\ell_t - \\ell_{t-1}) + (1-\\beta)\\phi b_{t-1}"}),e.jsx(t.BlockMath,{math:"\\hat{y}_{T+h|T} = \\ell_T + \\left(\\sum_{j=1}^{h}\\phi^j\\right) b_T"}),e.jsxs("p",{children:["As ",e.jsx(t.InlineMath,{math:"h \\to \\infty"}),", the forecast converges to"," ",e.jsx(t.InlineMath,{math:"\\ell_T + \\phi b_T / (1-\\phi)"}),", a finite value. Gardner & McKenzie (1985) showed that damped trend outperforms undamped in most empirical tests."]}),e.jsxs(j,{type:"tip",title:"Practical Recommendation",children:["In practice, set ",e.jsx(t.InlineMath,{math:"\\phi \\in [0.8, 0.98]"}),". Values below 0.8 damp the trend too aggressively; values above 0.98 are nearly equivalent to undamped. FPP3 recommends the damped trend as the default when a trend is present."]}),e.jsx("h2",{children:"3. Holt-Winters Additive Seasonality"}),e.jsxs("p",{children:["When seasonality has roughly constant amplitude, use the additive version with period ",e.jsx(t.InlineMath,{math:"m"}),":"]}),e.jsx(t.BlockMath,{math:"\\ell_t = \\alpha(y_t - s_{t-m}) + (1-\\alpha)(\\ell_{t-1} + b_{t-1})"}),e.jsx(t.BlockMath,{math:"b_t = \\beta(\\ell_t - \\ell_{t-1}) + (1-\\beta)b_{t-1}"}),e.jsx(t.BlockMath,{math:"s_t = \\gamma(y_t - \\ell_{t-1} - b_{t-1}) + (1-\\gamma)s_{t-m}"}),e.jsx(t.BlockMath,{math:"\\hat{y}_{T+h|T} = \\ell_T + hb_T + s_{T+h-m(k+1)}"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"k = \\lfloor (h-1)/m \\rfloor"})," and"," ",e.jsx(t.InlineMath,{math:"\\gamma \\in [0, 1-\\alpha]"})," is the seasonal smoothing parameter."]}),e.jsx("h2",{children:"4. Holt-Winters Multiplicative Seasonality"}),e.jsx("p",{children:"When seasonal fluctuations grow proportionally with the level (common in retail, tourism), the multiplicative formulation is preferred:"}),e.jsx(t.BlockMath,{math:"\\ell_t = \\alpha \\frac{y_t}{s_{t-m}} + (1-\\alpha)(\\ell_{t-1} + b_{t-1})"}),e.jsx(t.BlockMath,{math:"s_t = \\gamma \\frac{y_t}{\\ell_{t-1} + b_{t-1}} + (1-\\gamma)s_{t-m}"}),e.jsx(t.BlockMath,{math:"\\hat{y}_{T+h|T} = (\\ell_T + hb_T) \\cdot s_{T+h-m(k+1)}"}),e.jsx(S,{title:"Multiplicative vs Additive: Critical Choice",children:"If seasonal amplitude is roughly constant → additive. If it grows with the level → multiplicative. A log-transform can convert multiplicative to additive. Multiplicative seasonality cannot handle zero or negative values, and prediction intervals are harder to compute analytically."}),e.jsx(he,{}),e.jsx(_,{label:"Parameter Summary",title:"Holt-Winters Parameters",definition:"Four smoothing parameters govern Holt-Winters with damped trend.",notation:"\\alpha \\in (0,1],\\; \\beta \\in (0,1],\\; \\gamma \\in [0, 1-\\alpha],\\; \\phi \\in (0.8, 1)"}),e.jsx("h2",{children:"Python: All Four Variants"}),e.jsx(b,{code:pe,filename:"holt_holtwinters.py",title:"Holt's method and Holt-Winters with statsmodels"}),e.jsx(M,{references:fe})]})}const it=Object.freeze(Object.defineProperty({__proto__:null,default:ue},Symbol.toStringTag,{value:"Module"})),W=[{error:"A",trend:"N",seasonal:"N",name:"SES",aic:"–",notes:"Random walk with drift = 0"},{error:"A",trend:"A",seasonal:"N",name:"Holt's linear",aic:"–",notes:"Linear trend extrapolation"},{error:"A",trend:"Ad",seasonal:"N",name:"Damped trend",aic:"–",notes:"Trend dampens to constant"},{error:"A",trend:"N",seasonal:"A",name:"Additive seasonal",aic:"–",notes:"No trend"},{error:"A",trend:"A",seasonal:"A",name:"Holt-Winters add.",aic:"–",notes:"Classic additive HW"},{error:"A",trend:"Ad",seasonal:"A",name:"Damped HW add.",aic:"–",notes:"Recommended default"},{error:"M",trend:"N",seasonal:"N",name:"Multiplicative SES",aic:"–",notes:"Proportional errors"},{error:"M",trend:"A",seasonal:"N",name:"Mult. Holt linear",aic:"–",notes:""},{error:"M",trend:"Ad",seasonal:"N",name:"Mult. damped trend",aic:"–",notes:""},{error:"A",trend:"N",seasonal:"M",name:"Additive error mult. seasonal",aic:"–",notes:""},{error:"A",trend:"A",seasonal:"M",name:"HW multiplicative",aic:"–",notes:"Growing seasonality"},{error:"A",trend:"Ad",seasonal:"M",name:"Damped HW mult.",aic:"–",notes:""},{error:"M",trend:"N",seasonal:"M",name:"Mult.×Mult.",aic:"–",notes:""},{error:"M",trend:"A",seasonal:"M",name:"Mult.×Linear×Mult.",aic:"–",notes:""},{error:"M",trend:"Ad",seasonal:"M",name:"Mult.×Damped×Mult.",aic:"–",notes:""},{error:"M",trend:"M",seasonal:"N",name:"Multiplicative trend",aic:"–",notes:"Rarely used"},{error:"M",trend:"M",seasonal:"A",name:"Mult.×Mult.×Add.",aic:"–",notes:""},{error:"M",trend:"M",seasonal:"M",name:"Full multiplicative",aic:"–",notes:"Log-additive equivalent"}];function xe(){const[a,n]=p.useState("All"),[s,l]=p.useState("All"),o=W.filter(r=>(a==="All"||r.error===a)&&(s==="All"||r.trend===s));return e.jsxs("div",{className:"my-6",children:[e.jsxs("div",{className:"flex gap-3 mb-3 flex-wrap",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-zinc-500 mr-2",children:"Error:"}),["All","A","M"].map(r=>e.jsx("button",{onClick:()=>n(r),className:`px-2 py-0.5 rounded text-xs mr-1 ${a===r?"bg-sky-600 text-white":"border border-zinc-400 text-zinc-500"}`,children:r},r))]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-zinc-500 mr-2",children:"Trend:"}),["All","N","A","Ad","M"].map(r=>e.jsx("button",{onClick:()=>l(r),className:`px-2 py-0.5 rounded text-xs mr-1 ${s===r?"bg-purple-600 text-white":"border border-zinc-400 text-zinc-500"}`,children:r},r))]})]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-sm text-zinc-700 dark:text-zinc-300 border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-zinc-100 dark:bg-zinc-800",children:[e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"ETS(E,T,S)"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"Error"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"Trend"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"Season"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"Common Name"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"Notes"})]})}),e.jsx("tbody",{children:o.map((r,i)=>e.jsxs("tr",{className:i%2===0?"":"bg-zinc-50 dark:bg-zinc-800/50",children:[e.jsxs("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 font-mono text-xs",children:["ETS(",r.error,",",r.trend,",",r.seasonal,")"]}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-center",children:e.jsx("span",{className:`px-1.5 py-0.5 rounded text-xs font-medium ${r.error==="A"?"bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300":"bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"}`,children:r.error==="A"?"Add":"Mul"})}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-center",children:r.trend}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-center",children:r.seasonal}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5",children:r.name}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-xs text-zinc-400",children:r.notes})]},i))})]})}),e.jsxs("p",{className:"text-xs text-zinc-400 mt-2",children:[W.length," total ETS models. Some combinations (e.g., multiplicative trend with additive seasonality) are rarely used in practice."]})]})}const ge=`# ETS State Space Models
# pip install statsmodels statsforecast

import pandas as pd
import numpy as np
from statsmodels.tsa.exponential_smoothing.ets import ETSModel

# Monthly airline passengers (classic dataset)
from statsmodels.datasets import get_rdataset
air = get_rdataset('AirPassengers').data
ts = pd.Series(
    air['value'].values,
    index=pd.date_range('1949-01', periods=144, freq='MS'),
)

# ── Manual ETS(A,A,A) specification ─────────────────────────────────────────
model = ETSModel(ts, error='add', trend='add', seasonal='add',
                 seasonal_periods=12, initialization_method='estimated')
fit = model.fit(disp=False)
print(fit.summary())
print(f"\\nAIC:  {fit.aic:.2f}")
print(f"AICc: {fit.aicc:.2f}")
print(f"BIC:  {fit.bic:.2f}")

# ── AutoETS: automatic model selection via AICc ───────────────────────────────
from statsforecast import StatsForecast
from statsforecast.models import AutoETS

df = pd.DataFrame({
    'unique_id': 'air',
    'ds': pd.date_range('1949-01', periods=144, freq='MS'),
    'y': air['value'].values.astype(float),
})

sf = StatsForecast(
    models=[AutoETS(season_length=12)],
    freq='MS', n_jobs=-1,
)
sf.fit(df)
forecast = sf.predict(h=24, level=[80, 95])
print("\\nAutoETS forecasts:")
print(forecast.head())

# ── Prediction intervals from state space ─────────────────────────────────────
# ETS provides exact analytical prediction intervals
fc_full = fit.get_prediction(start=len(ts), end=len(ts) + 23)
summary_frame = fc_full.summary_frame(alpha=0.05)
print("\\n95% prediction intervals:")
print(summary_frame[['mean', 'pi_lower', 'pi_upper']].round(1))

# ── AIC comparison of all models ─────────────────────────────────────────────
combos = [
    ('add', 'add',  'add', 'ETS(A,A,A)'),
    ('add', 'add',  'mul', 'ETS(A,A,M)'),
    ('mul', 'add',  'mul', 'ETS(M,A,M)'),
    ('mul', 'add',  'add', 'ETS(M,A,A)'),
    ('add', 'add',  None,  'ETS(A,A,N)'),
]
for err, trend, seas, name in combos:
    kw = dict(error=err, trend=trend, initialization_method='estimated')
    if seas: kw['seasonal'] = seas; kw['seasonal_periods'] = 12
    try:
        m = ETSModel(ts, **kw).fit(disp=False)
        print(f"{name:12s}  AICc={m.aicc:.2f}")
    except Exception as e:
        print(f"{name:12s}  failed: {e}")
`,ye=[{label:"FPP3 §8.5",title:"Forecasting: Principles and Practice – ETS models",authors:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/ets.html"},{label:"Hyndman 2008",title:"Forecasting with Exponential Smoothing: The State Space Approach",authors:"Hyndman et al.",year:2008,url:"https://doi.org/10.1007/978-3-540-71918-2"}];function _e(){return e.jsxs(A,{title:"ETS State Space Framework",difficulty:"intermediate",readingTime:22,prerequisites:["Simple Exponential Smoothing","Holt's Method & Holt-Winters"],children:[e.jsx("p",{children:"The ETS (Error–Trend–Seasonal) framework unifies all exponential smoothing methods under a single state space formulation. This provides a principled foundation for model selection via information criteria, exact prediction intervals, and maximum likelihood estimation."}),e.jsx(j,{type:"fpp3",title:"FPP3 Chapter 8",children:"The ETS framework was formally developed in Hyndman et al. (2008). FPP3 Chapter 8 provides a thorough treatment. The key insight: each exponential smoothing method corresponds to a specific ETS model with well-defined statistical properties."}),e.jsx("h2",{children:"1. ETS Notation"}),e.jsx(_,{label:"Definition",title:"ETS(Error, Trend, Seasonal) Notation",definition:"Each ETS model is identified by three components. Error and Seasonal can be Additive (A) or Multiplicative (M). Trend can be None (N), Additive (A), Additive Damped (Ad), or Multiplicative (M).",notation:"\\text{ETS}(\\underbrace{E}_{\\text{error}}, \\underbrace{T}_{\\text{trend}}, \\underbrace{S}_{\\text{seasonal}})"}),e.jsx("h2",{children:"2. State Space Equations"}),e.jsx("p",{children:"For the additive error case ETS(A,·,·), the innovation form is:"}),e.jsx(t.BlockMath,{math:"y_t = \\mu_t + \\varepsilon_t, \\quad \\varepsilon_t \\sim \\text{NID}(0, \\sigma^2)"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\mu_t"})," is the conditional mean given the state at"," ",e.jsx(t.InlineMath,{math:"t-1"}),". The state equations update level, trend, and seasonal components by adding a fraction of the innovation ",e.jsx(t.InlineMath,{math:"\\varepsilon_t"}),":"]}),e.jsx(t.BlockMath,{math:"\\ell_t = \\ell_{t-1} + b_{t-1} + \\alpha \\varepsilon_t"}),e.jsx(t.BlockMath,{math:"b_t = b_{t-1} + \\beta \\varepsilon_t"}),e.jsx(t.BlockMath,{math:"s_t = s_{t-m} + \\gamma \\varepsilon_t"}),e.jsx("p",{children:"For the multiplicative error case ETS(M,·,·), the error enters multiplicatively:"}),e.jsx(t.BlockMath,{math:"y_t = \\mu_t (1 + \\varepsilon_t), \\quad \\varepsilon_t \\sim \\text{NID}(0, \\sigma^2)"}),e.jsx("h2",{children:"3. The 18 ETS Models"}),e.jsx("p",{children:"Combining 2 error types × 4 trend types (N, A, Ad, M) × 3 seasonal types (N, A, M) gives 24 combinations, of which 6 are excluded as numerically unstable (multiplicative error with additive trend is excluded in most software), leaving 18 usable models:"}),e.jsx(xe,{}),e.jsx("h2",{children:"4. Model Selection via Information Criteria"}),e.jsx(z,{label:"Theorem",title:"AICc-Based ETS Model Selection",statement:"Given a dataset, the ETS model minimizing the corrected AIC (AICc) is selected. AICc = AIC + 2k(k+1)/(T−k−1) where k is the number of parameters and T is the sample size. This corrects for small-sample bias in AIC = −2L + 2k.",proof:"The AICc correction term vanishes as T→∞, recovering AIC. For small T, AIC over-selects complex models; AICc penalizes more heavily. The ETSModel in statsmodels and AutoETS in statsforecast both use AICc by default.",corollaries:["BIC = −2L + k·log(T) penalizes more heavily for large T, preferring simpler models.","Do not compare AIC across different datasets or transformations — only within the same series."]}),e.jsx("h2",{children:"5. Prediction Intervals"}),e.jsx("p",{children:"A key advantage of the ETS state space framework: prediction intervals can be derived analytically (unlike bootstrap methods required for ARIMA). For ETS(A,N,N):"}),e.jsx(t.BlockMath,{math:"\\hat{y}_{T+h|T} \\pm z_{\\alpha/2} \\cdot \\sigma\\sqrt{1 + \\alpha^2(h-1)}"}),e.jsx("p",{children:"For multiplicative error models, closed-form intervals are harder to obtain and simulation-based intervals are used."}),e.jsx(S,{title:"Multiplicative Models and Zero Values",children:"ETS models with multiplicative errors or seasonality cannot handle zero or negative values in the time series. In such cases, use additive models or apply a log transformation before fitting."}),e.jsx("h2",{children:"Python: ETSModel and AutoETS"}),e.jsx(b,{code:ge,filename:"ets_state_space.py",title:"ETS model fitting, selection, and forecasting"}),e.jsx(M,{references:ye})]})}const nt=Object.freeze(Object.defineProperty({__proto__:null,default:_e},Symbol.toStringTag,{value:"Module"}));function be(a,n=100,s=42){let l=0;const o=[];for(let r=0;r<n;r++){const i=Math.sin(r*7.3+s)*2+Math.cos(r*3.7+s)*1.5;l=a*l+i,o.push(parseFloat(l.toFixed(3)))}return o}function je(a,n=20){const s=a.length,l=a.reduce((r,i)=>r+i,0)/s,o=a.reduce((r,i)=>r+(i-l)**2,0)/s;return Array.from({length:n},(r,i)=>{const d=i+1;let c=0;for(let h=0;h<s-d;h++)c+=(a[h]-l)*(a[h+d]-l);return{lag:d,acf:parseFloat((c/((s-d)*o)).toFixed(4))}})}function ve(){const[a,n]=p.useState(.7),s=p.useMemo(()=>be(a),[a]),l=p.useMemo(()=>je(s),[s]),o=s.map((i,d)=>({t:d,y:i})),r=a>.9?"Near unit root (non-stationary)":a<-.5?"Oscillating":a>0?"Positive autocorrelation":"Negative autocorrelation";return e.jsxs("div",{className:"my-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",children:[e.jsx("h3",{className:"text-sm font-semibold text-zinc-300 mb-3",children:"Interactive: AR(1) Process Simulator"}),e.jsxs("div",{className:"flex items-center gap-4 mb-4",children:[e.jsxs("label",{className:"text-sm text-zinc-400",children:["φ₁ = ",e.jsx("span",{className:"font-bold text-sky-400",children:a.toFixed(2)})]}),e.jsx("input",{type:"range",min:-.99,max:.99,step:.01,value:a,onChange:i=>n(parseFloat(i.target.value)),className:"w-56 accent-sky-500"}),e.jsx("span",{className:"text-xs text-zinc-400",children:r})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-zinc-500 mb-1",children:"Simulated AR(1) series"}),e.jsx(k,{width:"100%",height:180,children:e.jsxs(F,{data:o,children:[e.jsx(w,{strokeDasharray:"3 3",stroke:"#374151",opacity:.3}),e.jsx(T,{dataKey:"t",tick:{fontSize:10}}),e.jsx(I,{tick:{fontSize:10}}),e.jsx(N,{contentStyle:{fontSize:11}}),e.jsx(x,{dataKey:"y",stroke:"#3b82f6",strokeWidth:1.5,dot:!1,name:"y_t"})]})})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-zinc-500 mb-1",children:"Sample ACF"}),e.jsx(k,{width:"100%",height:180,children:e.jsxs(G,{data:l,barSize:8,children:[e.jsx(w,{strokeDasharray:"3 3",stroke:"#374151",opacity:.3}),e.jsx(T,{dataKey:"lag",tick:{fontSize:10}}),e.jsx(I,{domain:[-1,1],tick:{fontSize:10}}),e.jsx(N,{contentStyle:{fontSize:11}}),e.jsx(C,{y:0,stroke:"#6b7280"}),e.jsx(C,{y:1.96/Math.sqrt(100),stroke:"#f59e0b",strokeDasharray:"4 2"}),e.jsx(C,{y:-1.96/Math.sqrt(100),stroke:"#f59e0b",strokeDasharray:"4 2"}),e.jsx(J,{dataKey:"acf",fill:"#3b82f6",name:"ACF"})]})})]})]}),e.jsx("p",{className:"text-xs text-zinc-400 mt-2",children:"Gold dashed lines = ±1.96/√T (approximate 95% confidence bounds). AR(1) ACF decays exponentially; the rate depends on φ₁."})]})}const Ae=`# AR, MA, and ARMA model simulation and identification
# pip install statsmodels

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import acf, pacf
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.arima_process import ArmaProcess

np.random.seed(42)
n = 200

# ── Simulate AR(2) ────────────────────────────────────────────────────────────
# y_t = 0.6*y_{t-1} - 0.2*y_{t-2} + ε_t
# Note: ArmaProcess uses coefficient convention AR[0]=1, AR[1]=-φ₁, AR[2]=-φ₂
ar2_process = ArmaProcess(ar=[1, -0.6, 0.2], ma=[1])
ar2_data = ar2_process.generate_sample(nsample=n, scale=1.0)

# ── Simulate MA(2) ────────────────────────────────────────────────────────────
# y_t = ε_t + 0.8*ε_{t-1} + 0.3*ε_{t-2}
ma2_process = ArmaProcess(ar=[1], ma=[1, 0.8, 0.3])
ma2_data = ma2_process.generate_sample(nsample=n, scale=1.0)

# ── ACF and PACF ─────────────────────────────────────────────────────────────
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

plot_acf(ar2_data,  lags=20, ax=axes[0, 0], title='AR(2) ACF  — exponential decay')
plot_pacf(ar2_data, lags=20, ax=axes[0, 1], title='AR(2) PACF — cuts off at lag 2')
plot_acf(ma2_data,  lags=20, ax=axes[1, 0], title='MA(2) ACF  — cuts off at lag 2')
plot_pacf(ma2_data, lags=20, ax=axes[1, 1], title='MA(2) PACF — exponential decay')
plt.tight_layout()
plt.savefig('acf_pacf_patterns.png', dpi=150)

# ── Fit AR(2) via statsmodels ARIMA ──────────────────────────────────────────
from statsmodels.tsa.arima.model import ARIMA

model_ar2 = ARIMA(ar2_data, order=(2, 0, 0))
fit_ar2 = model_ar2.fit()
print("AR(2) fit:")
print(fit_ar2.summary())

model_ma2 = ARIMA(ma2_data, order=(0, 0, 2))
fit_ma2 = model_ma2.fit()
print("\\nMA(2) fit:")
print(f"  θ₁={fit_ma2.params['ma.L1']:.4f}, θ₂={fit_ma2.params['ma.L2']:.4f}")

# ── Stationarity check: Augmented Dickey-Fuller ───────────────────────────────
from statsmodels.tsa.stattools import adfuller

for name, data in [('AR(2)', ar2_data), ('MA(2)', ma2_data)]:
    result = adfuller(data)
    print(f"\\n{name} ADF test:")
    print(f"  Statistic: {result[0]:.4f}, p-value: {result[1]:.4f}")
    print(f"  {'Stationary' if result[1] < 0.05 else 'Non-stationary'}")

# ── Invertibility check for MA ────────────────────────────────────────────────
# MA is invertible if all roots of MA polynomial lie outside unit circle
ma_roots = np.roots([1, 0.8, 0.3])
print("\\nMA(2) roots:", np.abs(ma_roots).round(4))
print("Invertible:", all(np.abs(ma_roots) > 1))
`,Me=[{label:"FPP3 §9.1-9.4",title:"Forecasting: Principles and Practice – AR and MA models",authors:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/AR.html"},{label:"Box & Jenkins 1976",title:"Time Series Analysis: Forecasting and Control",authors:"Box, G.E.P. & Jenkins, G.M.",year:1976}];function Se(){return e.jsxs(A,{title:"AR & MA Models",difficulty:"intermediate",readingTime:25,prerequisites:["Stationarity and differencing","ACF and PACF"],children:[e.jsx("p",{children:"Autoregressive (AR) and Moving Average (MA) models are the building blocks of the ARIMA family. Understanding their structure, stationarity conditions, and ACF/PACF signatures is essential for correct model identification."}),e.jsx("h2",{children:"1. Autoregressive Models: AR(p)"}),e.jsx(_,{label:"Definition",title:"Autoregressive Model AR(p)",definition:"A p-th order autoregressive model expresses the current value as a linear combination of the p most recent values plus white noise.",notation:"y_t = c + \\phi_1 y_{t-1} + \\phi_2 y_{t-2} + \\cdots + \\phi_p y_{t-p} + \\varepsilon_t"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"c"})," is a constant, ",e.jsx(t.InlineMath,{math:"\\phi_1, \\ldots, \\phi_p"})," ","are autoregressive coefficients, and"," ",e.jsx(t.InlineMath,{math:"\\varepsilon_t \\sim \\text{WN}(0, \\sigma^2)"}),"."]}),e.jsx(z,{label:"Theorem",title:"Stationarity of AR(1)",statement:"The AR(1) process y_t = c + φ₁·y_{t-1} + ε_t is (weakly) stationary if and only if |φ₁| < 1. The mean is μ = c/(1−φ₁) and variance is σ²/(1−φ₁²).",proof:"Assuming stationarity: E[y_t] = c + φ₁·E[y_t], so μ = c/(1−φ₁). Var[y_t] = φ₁²·Var[y_t] + σ², so γ₀ = σ²/(1−φ₁²), requiring |φ₁| < 1.",corollaries:["For AR(p), stationarity requires all roots of the characteristic polynomial 1−φ₁z−φ₂z²−…−φₚzᵖ=0 to lie outside the unit circle.","At the boundary |φ₁|=1, we have a unit root (random walk), which is non-stationary."]}),e.jsx("h2",{children:"2. Moving Average Models: MA(q)"}),e.jsx(_,{label:"Definition",title:"Moving Average Model MA(q)",definition:"A q-th order moving average model expresses the current value as a linear combination of the q most recent white noise terms.",notation:"y_t = c + \\varepsilon_t + \\theta_1 \\varepsilon_{t-1} + \\theta_2 \\varepsilon_{t-2} + \\cdots + \\theta_q \\varepsilon_{t-q}"}),e.jsxs("p",{children:["MA(q) processes are always stationary (finite sum of stationary terms). However, they must be ",e.jsx("strong",{children:"invertible"})," to have a unique AR(∞) representation and for estimation to be well-posed."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Invertibility"})," requires all roots of",e.jsx(t.InlineMath,{math:" 1 + \\theta_1 z + \\cdots + \\theta_q z^q = 0 "}),"to lie ",e.jsx("em",{children:"outside"})," the unit circle."]}),e.jsx("h2",{children:"3. ACF/PACF Identification Signatures"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm text-zinc-700 dark:text-zinc-300 border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-zinc-100 dark:bg-zinc-800",children:[e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:"Model"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:"ACF Pattern"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:"PACF Pattern"})]})}),e.jsx("tbody",{children:[["AR(p)","Exponential decay / damped oscillations","Cuts off sharply at lag p"],["MA(q)","Cuts off sharply at lag q","Exponential decay / damped oscillations"],["ARMA(p,q)","Decays exponentially after lag q","Decays exponentially after lag p"],["White Noise","All lags near zero","All lags near zero"],["Random Walk","Slow linear decay","Large spike at lag 1 only"]].map(([a,n,s])=>e.jsxs("tr",{children:[e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-mono",children:a}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:n}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:s})]},a))})]})}),e.jsx(j,{type:"tip",title:"ACF/PACF in Practice",children:"In practice, ACF/PACF plots rarely show perfectly clean cutoffs due to sampling variability. The 95% confidence bounds (±1.96/√T) help distinguish significant from insignificant spikes. Prefer parsimony: start with small p, q values."}),e.jsx("h2",{children:"Interactive: AR(1) ACF Patterns"}),e.jsx(ve,{}),e.jsx(S,{title:"ARMA vs AR vs MA: Model Order Selection",children:"Do not over-specify p or q. Adding unnecessary lags increases variance of parameter estimates and may cause overfitting. Use AIC/BIC (discussed in ARIMA section) rather than relying solely on visual ACF/PACF inspection."}),e.jsx("h2",{children:"Python: Simulating and Fitting AR/MA Models"}),e.jsx(b,{code:Ae,filename:"ar_ma_models.py",title:"AR/MA simulation, ACF/PACF, and fitting with statsmodels"}),e.jsx(M,{references:Me})]})}const ot=Object.freeze(Object.defineProperty({__proto__:null,default:Se},Symbol.toStringTag,{value:"Module"})),ke=`# ARIMA modeling with statsmodels and pmdarima
# pip install statsmodels pmdarima

import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller, kpss
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import matplotlib.pyplot as plt

# ── Step 1: Load and inspect data ────────────────────────────────────────────
from statsmodels.datasets import co2
co2_data = co2.load_pandas().data['co2'].resample('MS').mean().ffill()
ts = co2_data['1990':'2000']   # subset for clarity

# ── Step 2: Identify – stationarity tests ────────────────────────────────────
# Augmented Dickey-Fuller: H0 = unit root (non-stationary)
adf = adfuller(ts, autolag='AIC')
print(f"ADF statistic: {adf[0]:.4f}, p-value: {adf[1]:.4f}")
# => p > 0.05: likely non-stationary, need differencing

# First difference
ts_diff = ts.diff().dropna()
adf2 = adfuller(ts_diff, autolag='AIC')
print(f"Differenced ADF: {adf2[0]:.4f}, p-value: {adf2[1]:.4f}")
# => d = 1

# ── Step 3: ACF/PACF of differenced series ────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
plot_acf(ts_diff,  lags=20, ax=axes[0])
plot_pacf(ts_diff, lags=20, ax=axes[1])
plt.tight_layout(); plt.savefig('arima_acf.png', dpi=150)

# ── Step 4: Fit ARIMA(p,1,q) candidates ─────────────────────────────────────
results = []
for p in range(4):
    for q in range(4):
        try:
            m = ARIMA(ts, order=(p, 1, q)).fit()
            results.append({'order': f'({p},1,{q})', 'AIC': m.aic, 'BIC': m.bic})
        except Exception:
            pass

df_res = pd.DataFrame(results).sort_values('AICc' if 'AICc' in results[0] else 'AIC')
print("\\nTop ARIMA candidates:")
print(df_res.head(5).to_string(index=False))

# ── Fit best model ────────────────────────────────────────────────────────────
best = ARIMA(ts, order=(2, 1, 2)).fit()
print("\\n", best.summary())

# ── Step 5: Diagnostics ───────────────────────────────────────────────────────
residuals = best.resid
from statsmodels.stats.diagnostic import acorr_ljungbox
lb = acorr_ljungbox(residuals, lags=[10, 20], return_df=True)
print("\\nLjung-Box test (H0: no autocorrelation in residuals):")
print(lb)

# ── Step 6: Forecast ─────────────────────────────────────────────────────────
forecast_result = best.get_forecast(steps=24)
fc_mean = forecast_result.predicted_mean
fc_ci   = forecast_result.conf_int(alpha=0.05)
print("\\n24-step forecast:")
print(pd.concat([fc_mean.rename('forecast'), fc_ci], axis=1).round(2).head())

# ── Auto-ARIMA with pmdarima ──────────────────────────────────────────────────
from pmdarima import auto_arima

auto_model = auto_arima(
    ts,
    d=1,                  # force one differencing (known from ADF)
    start_p=0, start_q=0,
    max_p=4,  max_q=4,
    stepwise=True,        # stepwise search for speed
    information_criterion='aic',
    seasonal=False,       # non-seasonal version
    trace=True,           # print search log
)
print("\\nauto_arima best order:", auto_model.order)
print("AIC:", auto_model.aic())
`,we=[{label:"FPP3 §9.5-9.9",title:"Forecasting: Principles and Practice – ARIMA models",authors:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/arima.html"},{label:"Box & Jenkins 1976",title:"Time Series Analysis: Forecasting and Control",authors:"Box, G.E.P. & Jenkins, G.M.",year:1976},{label:"pmdarima",title:"pmdarima: ARIMA estimators for Python",authors:"Smith, T.",year:2017,url:"https://alkaline-ml.com/pmdarima/"}];function Te(){return e.jsxs(A,{title:"ARIMA Models",difficulty:"intermediate",readingTime:28,prerequisites:["AR & MA Models","Stationarity and differencing"],children:[e.jsx("p",{children:"ARIMA — AutoRegressive Integrated Moving Average — combines differencing to achieve stationarity with AR and MA components to model the autocorrelation structure of the differenced series."}),e.jsx(j,{type:"fpp3",title:"FPP3 Chapter 9",children:"FPP3 Chapter 9 covers ARIMA comprehensively, including the backshift operator, Box-Jenkins methodology, and automatic model selection. This is one of the most important chapters in applied forecasting."}),e.jsx("h2",{children:"1. ARIMA(p,d,q) Specification"}),e.jsx(_,{label:"Definition",title:"ARIMA(p, d, q)",definition:"ARIMA combines three components: p autoregressive terms, d differences, and q moving average terms.",notation:"\\underbrace{(1 - \\phi_1 B - \\cdots - \\phi_p B^p)}_{\\text{AR}(p)} \\underbrace{(1-B)^d}_{\\text{Integration}} y_t = c + \\underbrace{(1 + \\theta_1 B + \\cdots + \\theta_q B^q)}_{\\text{MA}(q)} \\varepsilon_t"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"B"})," is the ",e.jsx("strong",{children:"backshift operator"}),":"," ",e.jsx(t.InlineMath,{math:"B y_t = y_{t-1}"}),","," ",e.jsx(t.InlineMath,{math:"B^k y_t = y_{t-k}"}),", and"," ",e.jsx(t.InlineMath,{math:"(1-B)^d y_t"})," is the d-th difference."]}),e.jsx("h2",{children:"2. Backshift Operator Notation"}),e.jsx("p",{children:"The backshift operator simplifies ARIMA notation considerably:"}),e.jsx(t.BlockMath,{math:"(1-B)y_t = y_t - y_{t-1} = \\Delta y_t \\quad \\text{(first difference)}"}),e.jsx(t.BlockMath,{math:"(1-B)^2 y_t = y_t - 2y_{t-1} + y_{t-2} = \\Delta^2 y_t \\quad \\text{(second difference)}"}),e.jsx("p",{children:"An ARIMA(1,1,1) in backshift notation:"}),e.jsx(t.BlockMath,{math:"(1 - \\phi_1 B)(1-B)y_t = c + (1 + \\theta_1 B)\\varepsilon_t"}),e.jsx("h2",{children:"3. Box-Jenkins Methodology"}),e.jsx("div",{className:"my-4 space-y-4",children:[{step:"1. Identify",description:"Plot the series. Apply transformations (log, Box-Cox) if needed. Test stationarity (ADF, KPSS). Difference until stationary (determines d). Inspect ACF/PACF of differenced series to suggest p, q."},{step:"2. Estimate",description:"Fit candidate ARIMA(p,d,q) models via MLE. Compare AIC and BIC across competing models. Select the most parsimonious model that minimizes information criteria."},{step:"3. Diagnose",description:"Check residuals: (a) ACF of residuals should be white noise, (b) Ljung-Box test p-value > 0.05, (c) QQ-plot for normality, (d) no pattern in residual vs fitted plot."},{step:"4. Forecast",description:"Use the fitted model for point forecasts and prediction intervals. Transform back if a log or Box-Cox transformation was applied."}].map(({step:a,description:n})=>e.jsxs("div",{className:"flex gap-4 p-4 bg-zinc-800/60 rounded-lg border border-zinc-700",children:[e.jsx("div",{className:"shrink-0 w-24 text-sky-400 font-semibold text-sm",children:a}),e.jsx("div",{className:"text-sm text-zinc-300",children:n})]},a))}),e.jsx("h2",{children:"4. Information Criteria for Model Selection"}),e.jsx(t.BlockMath,{math:"\\text{AIC} = -2\\ln(\\hat{L}) + 2k"}),e.jsx(t.BlockMath,{math:"\\text{AICc} = \\text{AIC} + \\frac{2k(k+1)}{T-k-1}"}),e.jsx(t.BlockMath,{math:"\\text{BIC} = -2\\ln(\\hat{L}) + k\\ln(T)"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"k"})," = number of estimated parameters,"," ",e.jsx(t.InlineMath,{math:"T"})," = sample size, and ",e.jsx(t.InlineMath,{math:"\\hat{L}"})," = maximized likelihood. AICc is preferred for small samples (",e.jsx(t.InlineMath,{math:"T < 50"}),"). BIC penalizes more for large ",e.jsx(t.InlineMath,{math:"T"}),", tending to select simpler models."]}),e.jsx(z,{label:"Theorem",title:"ARIMA Forecast Convergence",statement:"For a stationary ARIMA(p,0,q) with |roots| > 1, as h → ∞, the h-step-ahead forecast ŷ_{T+h|T} converges to the unconditional mean μ = c/(1−φ₁−…−φₚ). For d=1, forecasts converge to a linear trend.",proof:"The forecast function satisfies the homogeneous difference equation (1−φ₁B−…−φₚBᵖ)ŷ_{T+h|T} = c for large h. Solutions are linear combinations of exponentials r_i^h where r_i are roots. For |r_i| < 1, all terms → 0.",corollaries:["ARIMA(0,1,0) with constant = drift method: forecast is a linear trend through the last observation.","ARIMA(0,2,0): double-differenced random walk, produces quadratic trend extrapolation."]}),e.jsx(B,{title:"Fitting ARIMA to CO₂ Concentration Data",difficulty:"intermediate",problem:"Monthly Mauna Loa CO₂ data (1990-2000) shows strong upward trend. Identify and fit an appropriate non-seasonal ARIMA model.",solution:[{step:"Test for stationarity",formula:"\\text{ADF test: } H_0 = \\text{unit root}",explanation:"ADF p-value ≈ 0.9 → fail to reject non-stationarity. First difference needed (d=1)."},{step:"Test differenced series",formula:"\\Delta y_t = y_t - y_{t-1}",explanation:"ADF on Δy_t gives p < 0.01 → stationary. Seasonal pattern visible → non-seasonal ARIMA on trend component."},{step:"Read ACF/PACF",formula:"\\text{ACF cuts off at lag } q, \\text{ PACF cuts off at lag } p",explanation:"ACF shows spike at lag 1; PACF shows spike at lag 1 and 2. Suggests ARIMA(2,1,1) or ARIMA(1,1,1) as candidates."},{step:"Select via AICc",formula:"\\min_{p,q} \\text{AICc}(p, 1, q)",explanation:"Grid search over p,q ∈ {0,1,2,3} with d=1. ARIMA(2,1,2) achieves lowest AICc."}]}),e.jsx("h2",{children:"5. Auto-ARIMA: Automated Selection"}),e.jsx("p",{children:"Manual Box-Jenkins is labor-intensive for many series. Auto-ARIMA algorithms automate the stepwise search:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"pmdarima.auto_arima"}),": stepwise search by default, tests ADF/KPSS to determine d, then searches p,q using AIC or BIC."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"statsforecast.AutoARIMA"}),": significantly faster, vectorized implementation, recommended for multiple series in production."]})]}),e.jsx(S,{title:"Auto-ARIMA Is Not a Silver Bullet",children:"Auto-ARIMA may select a suboptimal order if the time series has structural breaks, outliers, or irregular patterns. Always validate the selected order with diagnostic plots and domain knowledge. For long-memory or fractional integration, ARFIMA may be more appropriate."}),e.jsx("h2",{children:"Python: Full ARIMA Pipeline"}),e.jsx(b,{code:ke,filename:"arima_modeling.py",title:"Box-Jenkins ARIMA workflow with statsmodels and pmdarima"}),e.jsx(M,{references:we})]})}const lt=Object.freeze(Object.defineProperty({__proto__:null,default:Te},Symbol.toStringTag,{value:"Module"})),Ie=`# Seasonal ARIMA (SARIMA/SARIMAX) modeling
# pip install statsmodels statsforecast

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.stattools import adfuller

# ── Classic dataset: Airline Passengers (Box-Jenkins 1976) ───────────────────
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
# Using built-in data instead
from statsmodels.datasets import get_rdataset
air = get_rdataset('AirPassengers').data
ts = pd.Series(
    air['value'].values,
    index=pd.date_range('1949-01', periods=144, freq='MS'),
    name='passengers',
)

# ── Step 1: Log-transform to stabilize variance ───────────────────────────────
log_ts = np.log(ts)

# ── Step 2: Seasonal differencing + regular differencing ─────────────────────
log_diff_12    = log_ts.diff(12).dropna()        # seasonal difference
log_diff_1_12  = log_diff_12.diff(1).dropna()    # then regular difference

# ADF test after both differences
adf = adfuller(log_diff_1_12)
print(f"ADF after (1,1)(0,1,0)[12]: stat={adf[0]:.3f}, p={adf[1]:.4f}")

# ── Step 3: ACF/PACF for order identification ─────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
plot_acf(log_diff_1_12,  lags=36, ax=axes[0], title='ACF — log Δ₁Δ₁₂ AirPassengers')
plot_pacf(log_diff_1_12, lags=36, ax=axes[1], title='PACF')
plt.tight_layout()
plt.savefig('sarima_acf.png', dpi=150)

# Interpretation: spike at lag 1 in ACF (MA(1)), spike at lag 12 in ACF (SMA(1))
# => SARIMA(0,1,1)(0,1,1)[12] — the "Airline model"

# ── Step 4: Fit the Airline Model SARIMA(0,1,1)(0,1,1)[12] ───────────────────
model = SARIMAX(
    log_ts,
    order=(0, 1, 1),
    seasonal_order=(0, 1, 1, 12),
    trend='n',
)
fit = model.fit(disp=False)
print(fit.summary())

# ── Step 5: Residual diagnostics ─────────────────────────────────────────────
fit.plot_diagnostics(figsize=(12, 8))
plt.savefig('sarima_diagnostics.png', dpi=150)

from statsmodels.stats.diagnostic import acorr_ljungbox
lb = acorr_ljungbox(fit.resid, lags=[12, 24])
print("\\nLjung-Box (H0: white noise residuals):")
print(lb)

# ── Step 6: Forecast 24 months, transform back ───────────────────────────────
forecast = fit.get_forecast(steps=24)
fc_log  = forecast.predicted_mean
fc_ci   = forecast.conf_int(alpha=0.05)

# Back-transform from log scale
fc_orig  = np.exp(fc_log)
fc_lower = np.exp(fc_ci.iloc[:, 0])
fc_upper = np.exp(fc_ci.iloc[:, 1])
print("\\n24-month forecast (original scale):")
print(pd.DataFrame({'forecast': fc_orig, 'lower': fc_lower, 'upper': fc_upper}).round(1))

# ── AutoARIMA from statsforecast (faster, multiple series) ───────────────────
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA

df_sf = pd.DataFrame({
    'unique_id': 'air',
    'ds': pd.date_range('1949-01', periods=144, freq='MS'),
    'y': np.log(ts.values),   # fit on log scale
})

sf = StatsForecast(
    models=[AutoARIMA(season_length=12)],
    freq='MS', n_jobs=-1,
)
sf.fit(df_sf)
result = sf.predict(h=24, level=[80, 95])
print("\\nAutoARIMA forecast (log scale):")
print(result.head())
`,Ne=[{label:"FPP3 §9.9",title:"Forecasting: Principles and Practice – Seasonal ARIMA",authors:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/seasonal-arima.html"},{label:"Box & Jenkins 1976",title:"Time Series Analysis: Forecasting and Control (Airline Passengers example)",authors:"Box, G.E.P. & Jenkins, G.M.",year:1976}];function ze(){return e.jsxs(A,{title:"Seasonal ARIMA (SARIMA)",difficulty:"intermediate",readingTime:25,prerequisites:["ARIMA models","AR & MA models"],children:[e.jsx("p",{children:"Real-world time series frequently exhibit seasonal patterns — monthly sales that peak every December, electricity demand that spikes every summer. SARIMA extends ARIMA with seasonal AR and MA operators, enabling direct modeling of these periodic structures."}),e.jsx("h2",{children:"1. SARIMA Notation"}),e.jsx(_,{label:"Definition",title:"SARIMA(p,d,q)(P,D,Q)[m]",definition:"A Seasonal ARIMA model with non-seasonal order (p,d,q), seasonal order (P,D,Q), and seasonal period m.",notation:"\\Phi_P(B^m)\\,\\phi_p(B)\\,(1-B^m)^D(1-B)^d\\,y_t = \\Theta_Q(B^m)\\,\\theta_q(B)\\,\\varepsilon_t"}),e.jsxs("p",{children:["where the seasonal operators use ",e.jsx(t.InlineMath,{math:"B^m"})," (the lag-m backshift):"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"\\Phi_P(B^m) = 1 - \\Phi_1 B^m - \\cdots - \\Phi_P B^{Pm}"}),": Seasonal AR"]}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"\\Theta_Q(B^m) = 1 + \\Theta_1 B^m + \\cdots + \\Theta_Q B^{Qm}"}),": Seasonal MA"]}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"(1-B^m)^D"}),": Seasonal differencing (D times)"]})]}),e.jsx("h2",{children:"2. Seasonal Differencing"}),e.jsx("p",{children:"Seasonal differencing removes periodic trends by subtracting the value from the same season in the previous cycle:"}),e.jsx(t.BlockMath,{math:"\\Delta_m y_t = (1 - B^m) y_t = y_t - y_{t-m}"}),e.jsxs("p",{children:["For monthly data with ",e.jsx(t.InlineMath,{math:"m=12"}),", the seasonal difference compares January to the previous January, February to the previous February, etc. Combined with regular differencing:"]}),e.jsx(t.BlockMath,{math:"\\Delta\\Delta_{12} y_t = (1-B)(1-B^{12}) y_t"}),e.jsx("h2",{children:"3. The Airline Model: SARIMA(0,1,1)(0,1,1)[12]"}),e.jsx("p",{children:'Box and Jenkins (1976) introduced the famous "airline model" fitted to international airline passenger data (1949–1960). It remains one of the most widely cited examples:'}),e.jsx(t.BlockMath,{math:"(1-B)(1-B^{12})\\ln y_t = (1 + \\theta_1 B)(1 + \\Theta_1 B^{12})\\varepsilon_t"}),e.jsx("p",{children:"The log transform stabilizes the growing seasonal variance. The two MA terms (non-seasonal and seasonal) capture the autocorrelation structure after differencing."}),e.jsx("h2",{children:"4. SARIMA ACF/PACF Patterns"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm text-zinc-700 dark:text-zinc-300 border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-zinc-100 dark:bg-zinc-800",children:[e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:"Seasonal Component"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:"ACF at seasonal lags"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:"PACF at seasonal lags"})]})}),e.jsx("tbody",{children:[["SAR(P)","Decays at lags m, 2m, 3m,...","Cuts off at lag Pm"],["SMA(Q)","Cuts off at lag Qm","Decays at lags m, 2m, 3m,..."],["SARMA(P,Q)","Decays after lag Qm","Decays after lag Pm"]].map(([a,n,s])=>e.jsxs("tr",{children:[e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-mono",children:a}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:n}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-4 py-2",children:s})]},a))})]})}),e.jsx(j,{type:"tip",title:"Practical SARIMA Selection",children:"For most seasonal data, start with SARIMA(0,1,1)(0,1,1)[m] (the airline model) or SARIMA(1,1,0)(1,1,0)[m]. These simple forms often perform well. Use AutoARIMA to confirm or improve, especially if you have many series to model."}),e.jsx(B,{title:"Airline Passenger Data: Classic Box-Jenkins Example",difficulty:"intermediate",problem:"The AirPassengers dataset (1949–1960, monthly) shows exponential growth with increasing seasonal amplitude. Identify and fit an appropriate SARIMA model.",solution:[{step:"Log-transform to stabilize variance",formula:"z_t = \\ln(y_t)",explanation:"Multiplicative seasonal pattern → log transforms it to additive, stabilizing variance across the trend."},{step:"Apply seasonal and regular differencing",formula:"w_t = (1-B)(1-B^{12}) z_t",explanation:"D=1 seasonal differencing removes the seasonal pattern. d=1 regular differencing removes the linear trend. ADF confirms stationarity."},{step:"Identify non-seasonal and seasonal MA(1) terms from ACF",formula:"\\text{ACF: significant spike at lag 1 and lag 12 only}",explanation:"Single spike at lag 1 → non-seasonal MA(1). Single spike at lag 12 → seasonal MA(1). Both cut off → pure MA terms → SARIMA(0,1,1)(0,1,1)[12]."},{step:"Fit airline model and check diagnostics",formula:"(1-B)(1-B^{12})\\ln y_t = (1 + \\theta_1 B)(1 + \\Theta_1 B^{12})\\varepsilon_t",explanation:"θ₁ ≈ -0.40, Θ₁ ≈ -0.62. Ljung-Box test shows white noise residuals. Model fits well with AIC = -227."}]}),e.jsx(S,{title:"Over-differencing",children:"Applying too many differences (d=2 or D=2) can induce artificial autocorrelation and worsen forecasts. The KPSS test (H0: stationarity) can complement ADF to avoid over-differencing. Use d=1 and D=1 for most economic and business series."}),e.jsx("h2",{children:"Python: SARIMAX and AutoARIMA"}),e.jsx(b,{code:Ie,filename:"sarima.py",title:"SARIMA — airline passenger example with statsmodels and statsforecast"}),e.jsx(M,{references:Ne})]})}const dt=Object.freeze(Object.defineProperty({__proto__:null,default:ze},Symbol.toStringTag,{value:"Module"})),Fe=`# statsmodels ARIMA API — full walkthrough
# pip install statsmodels

import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX

# Prepare data
np.random.seed(42)
n = 120
t = np.arange(n)
y = 50 + 0.5 * t + 5 * np.sin(2 * np.pi * t / 12) + np.random.normal(0, 3, n)
ts = pd.Series(y, index=pd.date_range("2015-01", periods=n, freq="MS"))

# ── Non-seasonal ARIMA ────────────────────────────────────────────────────────
model = ARIMA(ts, order=(2, 1, 1), trend='n')
fit = model.fit()

# Key results
print("Coefficients:")
print(fit.params)
print(f"\\nAIC:  {fit.aic:.2f}")
print(f"BIC:  {fit.bic:.2f}")
print(f"Log-likelihood: {fit.llf:.2f}")

# In-sample fitted values
fitted = fit.fittedvalues

# One-step-ahead prediction
pred1 = fit.get_prediction(start=0, end=n-1, dynamic=False)
pred_df = pred1.summary_frame(alpha=0.05)

# Multi-step forecast
fc = fit.get_forecast(steps=24)
fc_mean = fc.predicted_mean
fc_ci95 = fc.conf_int(alpha=0.05)
fc_ci80 = fc.conf_int(alpha=0.20)

print("\\n24-step forecast:")
print(pd.concat([fc_mean, fc_ci95], axis=1).round(2).head(8))

# Residual diagnostics
residuals = fit.resid
print(f"\\nResidual mean:   {residuals.mean():.4f}")
print(f"Residual std:    {residuals.std():.4f}")

from statsmodels.stats.diagnostic import acorr_ljungbox
lb_test = acorr_ljungbox(residuals, lags=[10, 20], return_df=True)
print("\\nLjung-Box test:")
print(lb_test)

# ── SARIMAX — also handles exogenous regressors ───────────────────────────────
# Create a dummy exogenous variable (e.g. promotion indicator)
exog = np.zeros(n)
exog[24:36] = 1   # promotion in months 24-35

sarimax_model = SARIMAX(
    ts,
    exog=exog,
    order=(1, 1, 1),
    seasonal_order=(1, 1, 1, 12),
    trend='n',
)
sarimax_fit = sarimax_model.fit(disp=False)
print("\\nSARIMAX with exogenous:")
print(f"  AIC={sarimax_fit.aic:.2f}")

# Forecast with future exog values
exog_future = np.zeros(12)
fc_sarimax = sarimax_fit.get_forecast(steps=12, exog=exog_future)
`,Ce=`# statsforecast AutoARIMA — production-grade, fast
# pip install statsforecast

import pandas as pd
import numpy as np
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA, ARIMA as SFArima

# Multi-series setup (statsforecast's strength)
np.random.seed(42)
n = 120

# Create 10 series at once
series_list = []
for i in range(10):
    t = np.arange(n)
    y = (50 + i*10) + (0.3 + i*0.05)*t + np.random.normal(0, 3, n)
    series_list.append(pd.DataFrame({
        'unique_id': f'series_{i}',
        'ds': pd.date_range("2015-01", periods=n, freq="MS"),
        'y': y,
    }))

df = pd.concat(series_list, ignore_index=True)

# ── AutoARIMA: automatic order selection per series ──────────────────────────
sf = StatsForecast(
    models=[
        AutoARIMA(season_length=12, information_criterion='aicc'),
    ],
    freq='MS',
    n_jobs=-1,   # parallel fitting
)
sf.fit(df)
forecasts = sf.predict(h=12, level=[80, 95])
print(f"Fitted {df['unique_id'].nunique()} series")
print(forecasts.head())

# ── Manual ARIMA order with statsforecast ────────────────────────────────────
sf2 = StatsForecast(
    models=[
        SFArima(order=(2, 1, 1), season_length=12),
        SFArima(order=(1, 1, 1), season_length=12),
    ],
    freq='MS', n_jobs=-1,
)
forecasts2 = sf2.forecast(df=df, h=12)
print("\\nManual ARIMA forecasts:")
print(forecasts2.head())

# ── Cross-validation for ARIMA ────────────────────────────────────────────────
cv_results = sf.cross_validation(
    df=df,
    h=12,
    step_size=12,
    n_windows=3,
)
from statsforecast.losses import mae, smape
print("\\nCross-validation results:")
print(cv_results.groupby('unique_id')['AutoARIMA'].apply(
    lambda x: pd.Series({'MAE': (x - cv_results.loc[x.index, 'y']).abs().mean()})
).head())
`,Pe=`# End-to-end production ARIMA pipeline
# pip install statsforecast pmdarima pandas numpy scikit-learn

import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA
from statsforecast.losses import mae, smape, mase

# ── 1. Load and preprocess ────────────────────────────────────────────────────
def load_data():
    """Load time series in StatsForecast long format."""
    np.random.seed(0)
    n = 156  # 13 years monthly
    records = []
    for uid in ['product_A', 'product_B', 'product_C']:
        base = np.random.uniform(50, 200)
        trend = np.random.uniform(0.1, 0.5)
        seasonal_amp = np.random.uniform(5, 20)
        noise_std = np.random.uniform(2, 8)
        t = np.arange(n)
        y = base + trend*t + seasonal_amp*np.sin(2*np.pi*t/12) +             np.random.normal(0, noise_std, n)
        records.append(pd.DataFrame({
            'unique_id': uid,
            'ds': pd.date_range('2012-01', periods=n, freq='MS'),
            'y': np.maximum(y, 0),  # ensure non-negative
        }))
    return pd.concat(records, ignore_index=True)

df = load_data()

# ── 2. Train/test split ───────────────────────────────────────────────────────
cutoff = pd.Timestamp('2023-01')
train = df[df['ds'] < cutoff]
test  = df[df['ds'] >= cutoff]
H = test['ds'].nunique()
print(f"Train: {len(train)} rows | Test: {H} months per series")

# ── 3. Fit AutoARIMA ──────────────────────────────────────────────────────────
sf = StatsForecast(
    models=[AutoARIMA(season_length=12)],
    freq='MS', n_jobs=-1,
)
sf.fit(train)
forecasts = sf.predict(h=H, level=[80, 95])

# ── 4. Evaluate ───────────────────────────────────────────────────────────────
eval_df = test.merge(forecasts[['unique_id', 'ds', 'AutoARIMA']], on=['unique_id', 'ds'])
metrics = eval_df.groupby('unique_id').apply(lambda g: pd.Series({
    'MAE':   mean_absolute_error(g['y'], g['AutoARIMA']),
    'RMSE':  mean_squared_error(g['y'], g['AutoARIMA']) ** 0.5,
    'MAPE':  (np.abs((g['y'] - g['AutoARIMA']) / g['y'].replace(0, np.nan))).mean() * 100,
}))
print("\\nForecast metrics by series:")
print(metrics.round(3))

# ── 5. Cross-validation with rolling windows ─────────────────────────────────
cv = sf.cross_validation(df=train, h=12, step_size=6, n_windows=4)
cv_mae = cv.groupby('unique_id').apply(
    lambda g: mean_absolute_error(g['y'], g['AutoARIMA'])
)
print("\\nCV MAE (train):", cv_mae.round(2).to_dict())
`,Re=[{lib:"statsmodels ARIMA",speed:"Slow (pure Python)",api:"Manual order selection",nJobs:"No",seriesAt:"1",prediction:"Analytical",exog:"Yes (SARIMAX)"},{lib:"pmdarima auto_arima",speed:"Moderate",api:"Automated stepwise",nJobs:"Limited",seriesAt:"1",prediction:"Simulation",exog:"Yes"},{lib:"statsforecast AutoARIMA",speed:"Very fast (Cython)",api:"Automated, vectorized",nJobs:"Yes (-1)",seriesAt:"1000s",prediction:"Analytical",exog:"No (use SARIMAX)"}],Be=[{label:"statsmodels",title:"statsmodels ARIMA documentation",authors:"Seabold & Perktold",year:2010,url:"https://www.statsmodels.org/stable/tsa.html"},{label:"statsforecast",title:"Nixtla statsforecast — fast forecasting",authors:"Garza et al.",year:2022,url:"https://nixtlaverse.nixtla.io/statsforecast/index.html"},{label:"pmdarima",title:"pmdarima: ARIMA estimators for Python",authors:"Smith, T.",year:2017,url:"https://alkaline-ml.com/pmdarima/"}];function qe(){return e.jsxs(A,{title:"ARIMA in Python: statsmodels & statsforecast",difficulty:"intermediate",readingTime:30,prerequisites:["ARIMA models","SARIMA"],children:[e.jsxs("p",{children:["Two main Python ecosystems cover ARIMA modeling: ",e.jsx("strong",{children:"statsmodels"})," (flexible, full diagnostics, suitable for single-series deep analysis) and"," ",e.jsx("strong",{children:"statsforecast"})," (fast, production-grade, handles thousands of series). This section provides a practical comparison and complete code for both."]}),e.jsx("h2",{children:"1. Library Comparison"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm text-zinc-700 dark:text-zinc-300 border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-zinc-100 dark:bg-zinc-800",children:[e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"Library"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"Speed"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"API"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"n_jobs"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"Multi-series"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"Pred. intervals"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"Exogenous"})]})}),e.jsx("tbody",{children:Re.map((a,n)=>e.jsxs("tr",{className:n%2===0?"":"bg-zinc-50 dark:bg-zinc-800/50",children:[e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 font-semibold",children:a.lib}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5",children:a.speed}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5",children:a.api}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-center",children:a.nJobs}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5",children:a.seriesAt}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5",children:a.prediction}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5",children:a.exog})]},n))})]})}),e.jsxs(j,{type:"tip",title:"When to Use Which",children:["Use ",e.jsx("strong",{children:"statsmodels"})," for: single-series research, custom diagnostics, exogenous regressors (SARIMAX), transfer function models, intervention analysis. Use ",e.jsx("strong",{children:"statsforecast"})," for: production pipelines, retail/supply chain with many SKUs, M-competition style evaluations, speed-critical workflows."]}),e.jsx("h2",{children:"2. statsmodels: Full API Walkthrough"}),e.jsx(b,{code:Fe,filename:"statsmodels_arima.py",title:"statsmodels ARIMA and SARIMAX complete API"}),e.jsx("h2",{children:"3. statsforecast: Fast Multi-Series AutoARIMA"}),e.jsx(b,{code:Ce,filename:"statsforecast_arima.py",title:"statsforecast AutoARIMA for multiple series"}),e.jsx(S,{title:"Prediction Interval Coverage",children:"statsmodels prediction intervals assume Gaussian residuals. If residuals are heavy-tailed, coverage may be below nominal. Use simulation-based intervals or conformal prediction for distribution-free guarantees."}),e.jsx("h2",{children:"4. Production Pipeline: End-to-End"}),e.jsx(b,{code:Pe,filename:"arima_pipeline.py",title:"Complete ARIMA forecasting pipeline with cross-validation"}),e.jsx(M,{references:Be})]})}const ct=Object.freeze(Object.defineProperty({__proto__:null,default:qe},Symbol.toStringTag,{value:"Module"}));function Ee(a,n,s){const l=a.length,o=[],r=[],i=[],d=[];let c=a[0],h=n;for(let u=0;u<l;u++){const g=c,v=h+s;r.push(g),d.push(v);const m=a[u]-g,f=v+n,y=v/f;c=g+y*m,h=(1-y)*v,o.push(Math.round(c*100)/100),i.push(Math.round(h*1e4)/1e4)}return{filtered:o,predicted:r,filteredVar:i,predictedVar:d}}function De(a=80,n=7){let s=n;const l=()=>(s=Math.imul(s,1664525)+1013904223,(s>>>0)/4294967295*2-1),o=[];let r=10;for(let i=0;i<a;i++){const d=l()*.3,c=l()*2.5;r+=d,o.push(Math.round((r+c)*100)/100)}return o}function Le(){const[a,n]=p.useState(2.5),[s,l]=p.useState(.3),o=De(),{filtered:r}=Ee(o,a**2,s**2),i=Math.round(s/a*100)/100,d=o.map((c,h)=>({t:h,observed:c,filtered:r[h]}));return e.jsxs("div",{className:"rounded-xl border border-sky-200 bg-sky-50 p-5",children:[e.jsx("h3",{className:"text-lg font-semibold text-sky-900 mb-1",children:"Interactive: Kalman Filter — Local Level Model"}),e.jsx("p",{className:"text-sm text-sky-700 mb-4",children:"Adjust the noise ratio. A high signal/noise ratio (large σ_η relative to σ_ε) makes the filter track the data closely; a small ratio produces heavy smoothing."}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 mb-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm text-sky-800 mb-1",children:["Observation noise σ_ε = ",e.jsx("span",{className:"font-bold",children:a})]}),e.jsx("input",{type:"range",min:.5,max:5,step:.1,value:a,onChange:c=>n(parseFloat(c.target.value)),className:"w-full accent-sky-600"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm text-sky-800 mb-1",children:["Level noise σ_η = ",e.jsx("span",{className:"font-bold",children:s})]}),e.jsx("input",{type:"range",min:.05,max:2,step:.05,value:s,onChange:c=>l(parseFloat(c.target.value)),className:"w-full accent-sky-600"})]})]}),e.jsxs("div",{className:"mb-2 text-sm text-sky-700",children:["Signal-to-noise ratio: ",e.jsx("span",{className:"font-bold",children:i}),i>.5?" — filter follows data closely (responsive)":" — heavy smoothing (slow to adapt)"]}),e.jsx(k,{width:"100%",height:220,children:e.jsxs(F,{data:d,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(w,{strokeDasharray:"3 3",stroke:"#e0f2fe"}),e.jsx(T,{dataKey:"t"}),e.jsx(I,{domain:["auto","auto"]}),e.jsx(N,{}),e.jsx(q,{}),e.jsx(x,{type:"monotone",dataKey:"observed",stroke:"#94a3b8",strokeWidth:1,dot:!1,name:"Observed y_t",opacity:.7}),e.jsx(x,{type:"monotone",dataKey:"filtered",stroke:"#0284c7",strokeWidth:2,dot:!1,name:"Filtered state μ_t|t"})]})})]})}const He=`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.tsa.statespace.structural import UnobservedComponents

np.random.seed(42)
n = 150

# ─── Simulate a local level model ─────────────────────────────────────────────
# State equation:   mu_t = mu_{t-1} + eta_t,  eta_t ~ N(0, sigma_eta^2)
# Observation eqn:  y_t  = mu_t + eps_t,       eps_t ~ N(0, sigma_eps^2)
sigma_eps = 1.5
sigma_eta = 0.5

mu = np.zeros(n)
mu[0] = 10.0
for t in range(1, n):
    mu[t] = mu[t-1] + np.random.normal(0, sigma_eta)

y = mu + np.random.normal(0, sigma_eps, n)

# ─── Manual Kalman filter (for illustration) ──────────────────────────────────
def kalman_filter(y, sigma_eps2, sigma_eta2):
    n = len(y)
    a = np.zeros(n)          # filtered state mean
    P = np.zeros(n)          # filtered state variance
    a_pred = np.zeros(n)     # predicted state mean
    P_pred = np.zeros(n)     # predicted state variance
    v = np.zeros(n)          # innovations
    K = np.zeros(n)          # Kalman gain

    # Initialise (diffuse prior)
    a_pred[0] = y[0]
    P_pred[0] = 1e6

    for t in range(n):
        # Observation update
        v[t] = y[t] - a_pred[t]
        F = P_pred[t] + sigma_eps2
        K[t] = P_pred[t] / F
        a[t] = a_pred[t] + K[t] * v[t]
        P[t] = (1 - K[t]) * P_pred[t]

        # State prediction (if not last)
        if t < n - 1:
            a_pred[t+1] = a[t]
            P_pred[t+1] = P[t] + sigma_eta2

    return a, P, v, K

a_filt, P_filt, innovations, gains = kalman_filter(y, sigma_eps**2, sigma_eta**2)

print("Manual Kalman filter results:")
print(f"  Mean Kalman gain:       {gains.mean():.4f} (steady state: {sigma_eta**2 / (sigma_eta**2 + sigma_eps**2):.4f})")
print(f"  Mean filtered variance: {P_filt.mean():.6f}")
print(f"  RMSE (filtered vs true): {np.sqrt(np.mean((a_filt - mu)**2)):.4f}")

# ─── Fit local level model with statsmodels ───────────────────────────────────
model = UnobservedComponents(y, level='local level')
result = model.fit(disp=False)
print("\\nstatsmodels local level model:")
print(result.summary())

# Estimated noise variances
print(f"\\nTrue sigma_eps^2:      {sigma_eps**2:.4f}")
print(f"Estimated sigma_eps^2: {result.params[0]:.4f}")
print(f"True sigma_eta^2:      {sigma_eta**2:.4f}")
print(f"Estimated sigma_eta^2: {result.params[1]:.4f}")

# ─── Smoothed state and forecast ──────────────────────────────────────────────
smoothed = result.smoother_results
a_smooth = smoothed.smoothed_state[0]

forecast = result.forecast(10)

# ─── Plot results ────────────────────────────────────────────────────────────
fig, axes = plt.subplots(2, 1, figsize=(14, 10))

axes[0].plot(y, color='lightblue', label='Observed y_t', linewidth=1)
axes[0].plot(mu, color='black', label='True level μ_t', linewidth=1.5, linestyle='--')
axes[0].plot(a_filt, color='blue', label='Filtered state a_t|t', linewidth=1.5)
axes[0].plot(a_smooth, color='red', label='Smoothed state E[μ_t|Y]', linewidth=1.5)
axes[0].set_title('Local Level Model: Kalman Filter and Smoother')
axes[0].legend()
axes[0].grid(alpha=0.3)

# Innovations (should be approximately white noise)
axes[1].plot(innovations, color='steelblue', linewidth=0.8)
axes[1].axhline(0, color='black', linewidth=0.8)
axes[1].set_title('Innovations (one-step-ahead forecast errors)')
axes[1].grid(alpha=0.3)

plt.tight_layout()
plt.show()
`;function We(){return e.jsx(A,{title:"State Space Models",difficulty:"advanced",readingTime:14,prerequisites:["ARIMA Models","Exponential Smoothing"],children:e.jsxs("div",{className:"space-y-6",children:[e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold text-sky-900 mb-3",children:"Introduction"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"State space models provide a general framework for representing time series where the observed data are generated by an underlying latent (hidden) state process. The framework unifies many classical methods — ARIMA, exponential smoothing, and structural decompositions — under a single estimation and filtering machinery: the Kalman filter. State space models are also the basis for more advanced approaches such as dynamic linear models, particle filters, and modern deep state space neural networks."})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold text-sky-900 mb-3",children:"The State Space Representation"}),e.jsxs("p",{className:"text-gray-700 mb-3",children:["A linear Gaussian state space model consists of two equations. The"," ",e.jsx("strong",{children:"observation equation"})," links the observed data to the latent state, and the ",e.jsx("strong",{children:"state transition equation"})," describes how the state evolves over time."]}),e.jsxs(_,{term:"Linear Gaussian State Space Model",children:[e.jsx("p",{className:"mb-2",children:e.jsx("strong",{children:"Observation (measurement) equation:"})}),e.jsx(t.BlockMath,{math:"y_t = Z_t \\alpha_t + d_t + \\varepsilon_t, \\quad \\varepsilon_t \\sim \\mathcal{N}(0,\\, H_t)"}),e.jsx("p",{className:"mb-2 mt-3",children:e.jsx("strong",{children:"State (transition) equation:"})}),e.jsx(t.BlockMath,{math:"\\alpha_{t+1} = T_t \\alpha_t + c_t + R_t \\eta_t, \\quad \\eta_t \\sim \\mathcal{N}(0,\\, Q_t)"}),e.jsxs("p",{className:"mt-3 text-sm",children:["where ",e.jsx(t.InlineMath,{math:"\\alpha_t \\in \\mathbb{R}^m"})," is the latent state vector,"," ",e.jsx(t.InlineMath,{math:"y_t \\in \\mathbb{R}^p"})," is the observation vector,"," ",e.jsx(t.InlineMath,{math:"Z_t, T_t, R_t, H_t, Q_t"})," are system matrices (possibly time-varying), and ",e.jsx(t.InlineMath,{math:"\\varepsilon_t \\perp \\eta_t"}),"."]})]}),e.jsx("div",{className:"overflow-x-auto mt-4",children:e.jsxs("table",{className:"w-full text-sm border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-sky-100",children:[e.jsx("th",{className:"border border-sky-200 px-3 py-2",children:"Symbol"}),e.jsx("th",{className:"border border-sky-200 px-3 py-2",children:"Name"}),e.jsx("th",{className:"border border-sky-200 px-3 py-2",children:"Role"})]})}),e.jsx("tbody",{children:[["Z_t","Observation matrix","Maps latent state to observed space"],["H_t","Observation noise covariance","Measurement error variance"],["T_t","Transition matrix","Propagates state from t to t+1"],["R_t","State noise selection matrix","Selects which state components are stochastic"],["Q_t","State noise covariance","Variability of state innovations"],["d_t, c_t","Intercept vectors","Optional constant terms in obs/state equations"]].map(([a,n,s])=>e.jsxs("tr",{className:"border-b border-sky-100 hover:bg-sky-50",children:[e.jsx("td",{className:"border border-sky-200 px-3 py-2 font-mono font-semibold text-sky-700",children:e.jsx(t.InlineMath,{math:a})}),e.jsx("td",{className:"border border-sky-200 px-3 py-2 font-medium",children:n}),e.jsx("td",{className:"border border-sky-200 px-3 py-2",children:s})]},a))})]})})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold text-sky-900 mb-3",children:"The Kalman Filter Algorithm"}),e.jsxs("p",{className:"text-gray-700 mb-3",children:["The Kalman filter is a recursive algorithm that computes the optimal linear estimate of the state ",e.jsx(t.InlineMath,{math:"\\alpha_t"})," given all observations up to time ",e.jsx(t.InlineMath,{math:"t"}),'. "Optimal" here means minimum mean squared error among all linear estimators; under Gaussian noise it is also the globally optimal (Bayesian posterior) estimator.']}),e.jsxs(z,{title:"Kalman Filter Recursions",children:[e.jsxs("p",{className:"mb-2",children:["Starting from an initial state ",e.jsx(t.InlineMath,{math:"a_1 = \\mathbb{E}[\\alpha_1]"})," ","and ",e.jsx(t.InlineMath,{math:"P_1 = \\mathrm{Var}(\\alpha_1)"}),", iterate:"]}),e.jsx("p",{className:"font-semibold mt-3 mb-1",children:"Prediction step (prior at t given t−1):"}),e.jsx(t.BlockMath,{math:"a_{t|t-1} = T_{t-1} a_{t-1|t-1}"}),e.jsx(t.BlockMath,{math:"P_{t|t-1} = T_{t-1} P_{t-1|t-1} T_{t-1}^\\top + R_{t-1} Q_{t-1} R_{t-1}^\\top"}),e.jsx("p",{className:"font-semibold mt-3 mb-1",children:"Update step (posterior at t given y_t):"}),e.jsx(t.BlockMath,{math:"v_t = y_t - Z_t a_{t|t-1} - d_t \\quad \\text{(innovation)}"}),e.jsx(t.BlockMath,{math:"F_t = Z_t P_{t|t-1} Z_t^\\top + H_t \\quad \\text{(innovation variance)}"}),e.jsx(t.BlockMath,{math:"K_t = P_{t|t-1} Z_t^\\top F_t^{-1} \\quad \\text{(Kalman gain)}"}),e.jsx(t.BlockMath,{math:"a_{t|t} = a_{t|t-1} + K_t v_t"}),e.jsx(t.BlockMath,{math:"P_{t|t} = (I - K_t Z_t) P_{t|t-1}"})]}),e.jsxs("p",{className:"text-gray-700 mt-3 text-sm",children:["The Kalman gain ",e.jsx(t.InlineMath,{math:"K_t"})," determines how much new information"," ",e.jsx(t.InlineMath,{math:"v_t"})," updates the state estimate. When observation noise is high relative to state noise (",e.jsx(t.InlineMath,{math:"H_t \\gg Q_t"}),"), the gain is small and the filter is conservative. When state noise dominates, the filter tracks the data aggressively."]})]}),e.jsx(Le,{}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold text-sky-900 mb-3",children:"The Kalman Smoother"}),e.jsxs("p",{className:"text-gray-700 mb-3",children:["The Kalman filter computes ",e.jsx(t.InlineMath,{math:"a_{t|t} = \\mathbb{E}[\\alpha_t \\mid y_1, \\ldots, y_t]"})," ","— the conditional mean using observations up to and including time t. The"," ",e.jsx("strong",{children:"Kalman smoother"})," (also called the RTS smoother or backward pass) computes ",e.jsx(t.InlineMath,{math:"a_{t|T} = \\mathbb{E}[\\alpha_t \\mid y_1, \\ldots, y_T]"})," ","— the conditional mean using all observations. Smoothed estimates are more accurate but require the entire dataset and cannot be used in real-time."]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[{label:"Filtered",math:"a_{t|t}",color:"sky",desc:"Uses y_1,...,y_t. Available in real time. Optimal for online estimation."},{label:"Smoothed",math:"a_{t|T}",color:"violet",desc:"Uses all y_1,...,y_T. Requires full dataset. Lower variance than filtered."},{label:"Predicted",math:"a_{t|t-1}",color:"amber",desc:"Uses y_1,...,y_{t-1}. One-step-ahead forecast. Innovations v_t come from here."}].map(({label:a,math:n,color:s,desc:l})=>{const o={sky:{box:"rounded-lg border border-sky-200 bg-sky-50 p-4",h:"font-semibold text-sky-900 mb-1",p:"text-sm text-sky-800"},violet:{box:"rounded-lg border border-violet-200 bg-violet-50 p-4",h:"font-semibold text-violet-900 mb-1",p:"text-sm text-violet-800"},amber:{box:"rounded-lg border border-amber-200 bg-amber-50 p-4",h:"font-semibold text-amber-900 mb-1",p:"text-sm text-amber-800"}},r=o[s]||o.sky;return e.jsxs("div",{className:r.box,children:[e.jsxs("h4",{className:r.h,children:[a,": ",e.jsx(t.InlineMath,{math:n})]}),e.jsx("p",{className:r.p,children:l})]},a)})})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold text-sky-900 mb-3",children:"Parameter Estimation via Maximum Likelihood"}),e.jsxs("p",{className:"text-gray-700 mb-3",children:["The system matrices ",e.jsx(t.InlineMath,{math:"Z, T, R, H, Q"})," typically contain unknown parameters ",e.jsx(t.InlineMath,{math:"\\psi"})," (variance components, regression coefficients, AR/MA parameters). These are estimated by maximum likelihood using the prediction error decomposition."]}),e.jsxs(z,{title:"Prediction Error Decomposition of the Likelihood",children:[e.jsxs("p",{children:["The log-likelihood of the observations ",e.jsx(t.InlineMath,{math:"Y_T = (y_1, \\ldots, y_T)"})," given parameters ",e.jsx(t.InlineMath,{math:"\\psi"})," factors through the Kalman filter innovations:"]}),e.jsx(t.BlockMath,{math:"\\ell(\\psi) = -\\frac{1}{2}\\sum_{t=1}^{T}\\!\\left(\\log|F_t| + v_t^\\top F_t^{-1} v_t\\right)"}),e.jsxs("p",{className:"mt-2 text-sm",children:["This is computed as a by-product of running the Kalman filter. Numerical optimisation (e.g., L-BFGS-B) is then applied to ",e.jsx(t.InlineMath,{math:"\\ell(\\psi)"}),"to obtain the MLE ",e.jsx(t.InlineMath,{math:"\\hat{\\psi}"}),"."]})]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold text-sky-900 mb-3",children:"ARIMA as a State Space Model"}),e.jsxs("p",{className:"text-gray-700 mb-3",children:["Every ARIMA(p,d,q) model has an equivalent state space representation. For example, the AR(1) model ",e.jsx(t.InlineMath,{math:"y_t = \\phi y_{t-1} + \\varepsilon_t"})," ","can be written as:"]}),e.jsx(t.BlockMath,{math:"\\alpha_t = y_t, \\quad T = \\phi, \\quad Z = 1, \\quad H = 0, \\quad Q = \\sigma^2"}),e.jsxs("p",{className:"text-gray-700 mb-3 text-sm",children:["More generally, an ARMA(p,q) can be put in companion form with state dimension",e.jsx(t.InlineMath,{math:"\\max(p, q+1)"}),". This unification means that the Kalman filter can handle missing observations, irregular sampling, and mixed-frequency data — all problems that are difficult for conventional ARIMA estimation."]})]}),e.jsxs(B,{title:"Local Level Model for Temperature Anomaly Tracking",children:[e.jsxs("p",{className:"text-gray-700 mb-3",children:["The local level model is the simplest structural time series model. The true underlying level ",e.jsx(t.InlineMath,{math:"\\mu_t"})," follows a random walk, and each observation adds independent measurement noise:"]}),e.jsx(t.BlockMath,{math:"y_t = \\mu_t + \\varepsilon_t, \\quad \\varepsilon_t \\sim \\mathcal{N}(0, \\sigma_\\varepsilon^2)"}),e.jsx(t.BlockMath,{math:"\\mu_t = \\mu_{t-1} + \\eta_t, \\quad \\eta_t \\sim \\mathcal{N}(0, \\sigma_\\eta^2)"}),e.jsxs("p",{className:"text-gray-700 mt-3 mb-2",children:["The ratio ",e.jsx(t.InlineMath,{math:"q = \\sigma_\\eta^2 / \\sigma_\\varepsilon^2"})," (the signal-to-noise ratio) controls the degree of smoothing:"]}),e.jsxs("ul",{className:"text-sm text-gray-700 space-y-1 list-disc list-inside",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"q → 0"}),": level is nearly constant; filter converges to the overall mean (simple average)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"q → ∞"}),": level changes rapidly; filter converges to the latest observation (naïve forecast)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Intermediate q"}),": exponential smoothing with discount factor related to q."]})]}),e.jsxs("p",{className:"text-gray-700 mt-3 text-sm",children:["The local level model is exactly equivalent to simple exponential smoothing with the optimal smoothing parameter ",e.jsx(t.InlineMath,{math:"\\alpha^* = 1 - (1-K)"})," ","where K is the steady-state Kalman gain."]})]}),e.jsx(j,{title:"Relationship to Exponential Smoothing",children:"The ETS (Error-Trend-Seasonality) family of exponential smoothing models all have exact state space representations. This means they can be estimated by maximum likelihood via the Kalman filter, enabling proper likelihood-based model comparison (AIC, BIC) and statistically correct prediction intervals — advantages that are not available for heuristic exponential smoothing without the state space formulation."}),e.jsxs(S,{title:"Diffuse Initialisation and Burn-in",children:["The Kalman filter requires an initial state mean ",e.jsx(t.InlineMath,{math:"a_1"})," and variance ",e.jsx(t.InlineMath,{math:"P_1"}),". For non-stationary components (random walks, integrated trends), the initial variance is effectively infinite (diffuse prior). The first few filter steps during this burn-in period produce unreliable estimates. Statsmodels uses the Durbin-Koopman exact diffuse initialisation which handles this properly without discarding observations."]}),e.jsx(b,{title:"Kalman Filter and State Space Models with statsmodels",code:He,runnable:!0}),e.jsx(M,{references:[{title:"Time Series Analysis by State Space Methods (2nd ed.)",author:"Durbin, J. & Koopman, S.J.",year:2012,url:"https://doi.org/10.1093/acprof:oso/9780199641178.001.0001"},{title:"A New Approach to Linear Filtering and Prediction Problems",author:"Kalman, R.E.",year:1960,url:"https://doi.org/10.1115/1.3662552"},{title:"Forecasting: Principles and Practice (3rd ed.) — Chapter 8: Exponential Smoothing",author:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/expsmooth.html"},{title:"statsmodels UnobservedComponents documentation",author:"Seabold, S. & Perktold, J.",year:2010,url:"https://www.statsmodels.org/stable/statespace.html"}]})]})})}const mt=Object.freeze(Object.defineProperty({__proto__:null,default:We},Symbol.toStringTag,{value:"Module"}));function Ke(a){let n=a>>>0;return function(){return n=Math.imul(n,1664525)+1013904223,(n>>>0)/4294967295*2-1}}function Oe(a){const n=Math.max((a()+1)/2,1e-9),s=(a()+1)/2;return Math.sqrt(-2*Math.log(n))*Math.cos(2*Math.PI*s)}function Ue({sigLevel:a,sigSlope:n,sigSeas:s,sigObs:l,n:o=96,m:r=12}){const i=Ke(42),d=()=>Oe(i),c=new Array(o+1).fill(0),h=new Array(o+1).fill(0),u=Array.from({length:o+1},()=>new Array(r).fill(0)),g=new Array(o).fill(0);c[0]=10,h[0]=.1;for(let m=0;m<r;m++)u[0][m]=2*Math.sin(2*Math.PI*m/r);for(let m=0;m<o;m++){const f=u[m][0];g[m]=Math.round((c[m]+f+d()*l)*100)/100,c[m+1]=c[m]+h[m]+d()*a,h[m+1]=h[m]+d()*n;const y=-u[m].slice(0,r-1).reduce((P,R)=>P+R,0)+d()*s;u[m+1]=[y,...u[m].slice(0,r-1)]}return c.slice(0,o).map((m,f)=>({t:f,observed:g[f],level:Math.round(m*100)/100,trend:Math.round(h[f]*1e3)/1e3,seasonal:Math.round(u[f][0]*100)/100}))}const K={smoothTrend:{sigLevel:.1,sigSlope:.02,sigSeas:.05,sigObs:.8,label:"Smooth trend"},volatileTrend:{sigLevel:.5,sigSlope:.15,sigSeas:.05,sigObs:.8,label:"Volatile trend"},strongSeas:{sigLevel:.1,sigSlope:.02,sigSeas:.3,sigObs:.8,label:"Evolving seasonality"},highNoise:{sigLevel:.1,sigSlope:.02,sigSeas:.05,sigObs:2.5,label:"High observation noise"}};function Ge(){const[a,n]=p.useState("smoothTrend"),[s,l]=p.useState("observed"),o=K[a],r=Ue(o),i={observed:"#94a3b8",level:"#0284c7",seasonal:"#16a34a",trend:"#d97706"},d={observed:"Observed y_t",level:"Level μ_t",seasonal:"Seasonal γ_t",trend:"Slope ν_t"};return e.jsxs("div",{className:"rounded-xl border border-sky-200 bg-sky-50 p-5 space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold text-sky-900 mb-1",children:"Interactive: Basic Structural Model Components"}),e.jsx("p",{className:"text-sm text-sky-700",children:"Select a noise configuration and explore each structural component of the BSM."}),e.jsx("div",{className:"flex flex-wrap gap-2",children:Object.entries(K).map(([c,{label:h}])=>e.jsx("button",{onClick:()=>n(c),className:`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${a===c?"bg-sky-600 text-white":"bg-white border border-sky-200 text-sky-700"}`,children:h},c))}),e.jsx("div",{className:"flex gap-2",children:Object.keys(i).map(c=>e.jsx("button",{onClick:()=>l(c),className:`px-3 py-1 rounded text-xs font-medium border ${s===c?"text-white border-transparent":"bg-white text-sky-700 border-sky-200"}`,style:s===c?{backgroundColor:i[c]}:{},children:d[c]},c))}),e.jsx(k,{width:"100%",height:220,children:e.jsxs(F,{data:r,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(w,{strokeDasharray:"3 3",stroke:"#e0f2fe"}),e.jsx(T,{dataKey:"t",tick:{fontSize:10}}),e.jsx(I,{domain:["auto","auto"],tick:{fontSize:10}}),e.jsx(N,{formatter:c=>[c,d[s]]}),e.jsx(x,{type:"monotone",dataKey:s,stroke:i[s],strokeWidth:s==="observed"?1:2,dot:!1,name:d[s]})]})}),e.jsxs("p",{className:"text-xs text-sky-500 text-center",children:["σ_level=",o.sigLevel,", σ_slope=",o.sigSlope,", σ_seas=",o.sigSeas,", σ_obs=",o.sigObs," — m=12 (monthly seasonality)"]})]})}const Je=`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.structural import UnobservedComponents

# ─── Load airline data as running example ────────────────────────────────────
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
df = pd.read_csv(url, index_col=0, parse_dates=True)
df.columns = ['passengers']
df.index.freq = 'MS'
y = np.log(df['passengers'])   # log-transform for additive decomposition

# ─── 1. Local Level Model ─────────────────────────────────────────────────────
# y_t = mu_t + eps_t,   eps_t ~ N(0, sigma_eps^2)
# mu_t = mu_{t-1} + eta_t, eta_t ~ N(0, sigma_eta^2)
model_ll = UnobservedComponents(y, level='local level')
result_ll = model_ll.fit(disp=False)
print("Local Level Model:")
print(f"  sigma_obs = {np.sqrt(result_ll.params[0]):.4f}")
print(f"  sigma_level = {np.sqrt(result_ll.params[1]):.4f}")
print(f"  AIC = {result_ll.aic:.2f}")

# ─── 2. Local Linear Trend Model ──────────────────────────────────────────────
# y_t = mu_t + eps_t
# mu_t = mu_{t-1} + nu_{t-1} + eta_t    (level with slope)
# nu_t = nu_{t-1} + zeta_t              (slope follows random walk)
model_llt = UnobservedComponents(y, level='local linear trend')
result_llt = model_llt.fit(disp=False)
print("\\nLocal Linear Trend Model:")
print(result_llt.summary())

# ─── 3. Basic Structural Model (BSM) ──────────────────────────────────────────
# Adds trigonometric or dummy seasonal component
model_bsm = UnobservedComponents(
    y,
    level='local linear trend',
    seasonal=12,         # 12-period dummy seasonality
    freq_seasonal=None,  # use dummy seasonality
)
result_bsm = model_bsm.fit(disp=False)
print("\\nBasic Structural Model:")
print(result_bsm.summary())
print(f"\\nAIC comparison:")
print(f"  Local level:       {result_ll.aic:.2f}")
print(f"  Local linear trend:{result_llt.aic:.2f}")
print(f"  BSM:               {result_bsm.aic:.2f}")

# ─── 4. Extract and plot components ──────────────────────────────────────────
fig = result_bsm.plot_components(figsize=(14, 10))
fig.suptitle('BSM Decomposition: Log Airline Passengers', y=1.01, fontsize=13)
plt.tight_layout()
plt.show()

# ─── 5. Forecast 24 months ahead ─────────────────────────────────────────────
forecast = result_bsm.get_forecast(steps=24)
forecast_mean = forecast.predicted_mean
forecast_ci = forecast.conf_int(alpha=0.05)

fig2, ax = plt.subplots(figsize=(14, 5))
y.plot(ax=ax, label='Log passengers (actual)', color='steelblue')
forecast_mean.plot(ax=ax, label='24-month forecast', color='red')
ax.fill_between(forecast_ci.index,
                forecast_ci.iloc[:, 0], forecast_ci.iloc[:, 1],
                alpha=0.2, color='red', label='95% PI')
ax.set_title('BSM 24-month Forecast')
ax.legend()
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()

# ─── 6. Trigonometric seasonality variant ────────────────────────────────────
# Harvey's stochastic trigonometric seasonality — more parsimonious
# Each harmonic has its own variance; seasonal pattern evolves smoothly
model_trig = UnobservedComponents(
    y,
    level='local linear trend',
    freq_seasonal=[{'period': 12, 'harmonics': 4}],  # 4 harmonics
)
result_trig = model_trig.fit(disp=False)
print(f"\\nTrigonometric seasonality (4 harmonics) AIC: {result_trig.aic:.2f}")
print(f"BSM dummy seasonality AIC:                  {result_bsm.aic:.2f}")
`;function $e(){return e.jsx(A,{title:"Structural Time Series Models",difficulty:"advanced",readingTime:12,prerequisites:["State Space Models","ARIMA Models"],children:e.jsxs("div",{className:"space-y-6",children:[e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold text-sky-900 mb-3",children:"Introduction"}),e.jsx("p",{className:"text-gray-700 leading-relaxed",children:"Structural time series models (also called unobserved components models) decompose an observed time series into interpretable components — trend, slope, seasonality, and regression effects — each with its own stochastic dynamics. Unlike the purely statistical ARIMA approach, structural models are built from economic or physical reasoning about the data-generating process. Each component is an unobserved state variable estimated via the Kalman filter."}),e.jsx("p",{className:"text-gray-700 leading-relaxed mt-3",children:"The canonical example is Harvey's Basic Structural Model (BSM), which decomposes a series as:"}),e.jsx(t.BlockMath,{math:"y_t = \\mu_t + \\gamma_t + \\varepsilon_t"}),e.jsxs("p",{className:"text-sm text-gray-600",children:["where ",e.jsx(t.InlineMath,{math:"\\mu_t"})," is the trend/level component,"," ",e.jsx(t.InlineMath,{math:"\\gamma_t"})," is the seasonal component, and"," ",e.jsx(t.InlineMath,{math:"\\varepsilon_t"})," is observation noise."]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold text-sky-900 mb-3",children:"The Local Level Model"}),e.jsx("p",{className:"text-gray-700 mb-3",children:"The simplest structural model. The level evolves as a random walk; each observation adds independent measurement noise."}),e.jsxs(_,{term:"Local Level Model",children:[e.jsx("p",{className:"mb-1",children:e.jsx("strong",{children:"Observation equation:"})}),e.jsx(t.BlockMath,{math:"y_t = \\mu_t + \\varepsilon_t, \\quad \\varepsilon_t \\overset{iid}{\\sim} \\mathcal{N}(0,\\, \\sigma_\\varepsilon^2)"}),e.jsx("p",{className:"mb-1 mt-2",children:e.jsx("strong",{children:"State (level) equation:"})}),e.jsx(t.BlockMath,{math:"\\mu_t = \\mu_{t-1} + \\eta_t, \\quad \\eta_t \\overset{iid}{\\sim} \\mathcal{N}(0,\\, \\sigma_\\eta^2)"}),e.jsxs("p",{className:"mt-2 text-sm",children:["The level ",e.jsx(t.InlineMath,{math:"\\mu_t"}),' is the "true" underlying value of the series, estimated as a random walk. The signal-to-noise ratio'," ",e.jsx(t.InlineMath,{math:"q = \\sigma_\\eta^2 / \\sigma_\\varepsilon^2"})," controls the smoothness of the estimated trend — equivalent to the exponential smoothing parameter."]})]}),e.jsxs(j,{title:"Equivalence to Simple Exponential Smoothing",children:["The local level model is exactly equivalent to simple exponential smoothing (SES). The steady-state Kalman gain ",e.jsx(t.InlineMath,{math:"K^*"})," satisfies"," ",e.jsx(t.InlineMath,{math:"K^* = \\alpha"})," (the SES smoothing parameter). Therefore, fitting the local level model by maximum likelihood produces the optimal SES smoothing parameter automatically, with no manual tuning required."]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold text-sky-900 mb-3",children:"The Local Linear Trend Model"}),e.jsx("p",{className:"text-gray-700 mb-3",children:"Extends the local level model by adding a stochastic slope (drift). Both the level and the slope can change over time."}),e.jsxs(_,{term:"Local Linear Trend (LLT) Model",children:[e.jsx("p",{className:"mb-1",children:e.jsx("strong",{children:"Observation equation:"})}),e.jsx(t.BlockMath,{math:"y_t = \\mu_t + \\varepsilon_t, \\quad \\varepsilon_t \\sim \\mathcal{N}(0, \\sigma_\\varepsilon^2)"}),e.jsx("p",{className:"mb-1 mt-2",children:e.jsx("strong",{children:"Level equation:"})}),e.jsx(t.BlockMath,{math:"\\mu_t = \\mu_{t-1} + \\nu_{t-1} + \\eta_t, \\quad \\eta_t \\sim \\mathcal{N}(0, \\sigma_\\eta^2)"}),e.jsx("p",{className:"mb-1 mt-2",children:e.jsx("strong",{children:"Slope equation:"})}),e.jsx(t.BlockMath,{math:"\\nu_t = \\nu_{t-1} + \\zeta_t, \\quad \\zeta_t \\sim \\mathcal{N}(0, \\sigma_\\zeta^2)"}),e.jsxs("p",{className:"mt-2 text-sm",children:["The slope ",e.jsx(t.InlineMath,{math:"\\nu_t"})," represents the local growth rate of the series. When ",e.jsx(t.InlineMath,{math:"\\sigma_\\zeta^2 = 0"}),", the slope is constant (deterministic linear trend). When ",e.jsx(t.InlineMath,{math:"\\sigma_\\eta^2 = 0"})," and"," ",e.jsx(t.InlineMath,{math:"\\sigma_\\zeta^2 > 0"}),", the model becomes the integrated random walk (smooth trend model)."]})]}),e.jsx("div",{className:"overflow-x-auto mt-3",children:e.jsxs("table",{className:"w-full text-sm border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-sky-100",children:[e.jsx("th",{className:"border border-sky-200 px-3 py-2",children:"Constraint"}),e.jsx("th",{className:"border border-sky-200 px-3 py-2",children:"Resulting model"}),e.jsx("th",{className:"border border-sky-200 px-3 py-2",children:"Equivalent to"})]})}),e.jsx("tbody",{children:[["σ_ζ = 0, σ_η > 0","Level + fixed slope","Holt linear with fixed trend (β = 0)"],["σ_η = 0, σ_ζ > 0","Integrated random walk (smooth trend)","Holt-Winters with damped slope"],["σ_η > 0, σ_ζ > 0","Full LLT (stochastic trend + stochastic slope)","Holts linear exponential smoothing"],["σ_η = σ_ζ = 0","Deterministic linear trend","OLS linear regression on time"]].map(([a,n,s])=>e.jsxs("tr",{className:"border-b border-sky-100 hover:bg-sky-50",children:[e.jsx("td",{className:"border border-sky-200 px-3 py-2 font-mono text-sky-700 text-xs",children:a}),e.jsx("td",{className:"border border-sky-200 px-3 py-2",children:n}),e.jsx("td",{className:"border border-sky-200 px-3 py-2",children:s})]},a))})]})})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold text-sky-900 mb-3",children:"Seasonal Components"}),e.jsx("p",{className:"text-gray-700 mb-3",children:"Structural seasonality is modelled as a latent component that sums to approximately zero over one complete cycle. Two main approaches exist:"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"rounded-lg border border-emerald-200 bg-emerald-50 p-4",children:[e.jsx("h4",{className:"font-semibold text-emerald-900 mb-2",children:"Dummy Variable Seasonality"}),e.jsxs("p",{className:"text-sm text-emerald-800 mb-2",children:["Maintains ",e.jsx(t.InlineMath,{math:"m-1"})," seasonal dummies that rotate each period. The constraint that the seasonal effects sum to zero ensures identifiability."]}),e.jsx(t.BlockMath,{math:"\\gamma_t = -\\sum_{j=1}^{m-1} \\gamma_{t-j} + \\omega_t, \\quad \\omega_t \\sim \\mathcal{N}(0, \\sigma_\\omega^2)"}),e.jsx("p",{className:"text-xs text-emerald-700 mt-1",children:"Uses m−1 state variables. Most flexible; allows each season to evolve independently."})]}),e.jsxs("div",{className:"rounded-lg border border-violet-200 bg-violet-50 p-4",children:[e.jsx("h4",{className:"font-semibold text-violet-900 mb-2",children:"Trigonometric (Harvey) Seasonality"}),e.jsxs("p",{className:"text-sm text-violet-800 mb-2",children:["Decomposes seasonality into ",e.jsx(t.InlineMath,{math:"\\lfloor m/2 \\rfloor"})," harmonics. Each harmonic pair ",e.jsx(t.InlineMath,{math:"(\\kappa_j^*, \\kappa_j)"})," evolves as a stochastic cycle."]}),e.jsx(t.BlockMath,{math:"\\gamma_t = \\sum_{j=1}^{\\lfloor m/2 \\rfloor} \\gamma_{j,t}"}),e.jsx("p",{className:"text-xs text-violet-700 mt-1",children:"More parsimonious. Smooth seasonal patterns. Can select number of harmonics by AIC."})]})]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold text-sky-900 mb-3",children:"The Basic Structural Model (BSM)"}),e.jsxs(_,{term:"Basic Structural Model (Harvey, 1989)",children:["The BSM combines a local linear trend with dummy seasonality and observation noise:",e.jsx(t.BlockMath,{math:"y_t = \\underbrace{\\mu_t}_{\\text{level}} + \\underbrace{\\gamma_t}_{\\text{seasonal}} + \\underbrace{\\varepsilon_t}_{\\text{irregular}}"}),"where ",e.jsx(t.InlineMath,{math:"\\mu_t"})," follows the LLT equations and"," ",e.jsx(t.InlineMath,{math:"\\gamma_t"})," follows the dummy seasonal recursion. The model has four variance parameters:"," ",e.jsx(t.InlineMath,{math:"\\sigma_\\varepsilon^2, \\sigma_\\eta^2, \\sigma_\\zeta^2, \\sigma_\\omega^2"}),". Restricting any of these to zero yields nested models that can be compared via likelihood ratio tests or information criteria."]}),e.jsx("p",{className:"text-gray-700 mt-3 text-sm",children:"The BSM generalises the classical additive decomposition (trend + season + residual) by making all components stochastic and estimating them simultaneously via the Kalman filter — rather than applying sequential moving average smoothing as in X-11 or STL decompositions."})]}),e.jsx(Ge,{}),e.jsxs(z,{title:"Forecasting from Structural Models",children:[e.jsx("p",{children:"For an h-step-ahead forecast from the BSM, the predicted observation is:"}),e.jsx(t.BlockMath,{math:"\\hat{y}_{T+h|T} = Z \\cdot a_{T+h|T}"}),e.jsxs("p",{className:"mt-2",children:["where ",e.jsx(t.InlineMath,{math:"a_{T+h|T} = T^h a_{T|T}"})," is obtained by iterating the state transition equation forward h steps. The forecast variance grows with h because both level and slope uncertainty accumulate:"]}),e.jsx(t.BlockMath,{math:"\\mathrm{Var}(\\hat{y}_{T+h|T}) \\approx \\sigma_\\varepsilon^2 + h^2 \\sigma_\\zeta^2 + h \\sigma_\\eta^2"}),e.jsxs("p",{className:"mt-2 text-sm",children:["This gives prediction intervals that widen at rate ",e.jsx(t.InlineMath,{math:"O(h)"})," for the local level model and at rate ",e.jsx(t.InlineMath,{math:"O(h^{3/2})"})," for the LLT model — appropriate widening for trending series."]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold text-sky-900 mb-3",children:"Adding Regression Effects"}),e.jsx("p",{className:"text-gray-700 mb-3",children:"Structural models extend naturally to include observed covariates (regression terms), creating a dynamic regression in state space form:"}),e.jsx(t.BlockMath,{math:"y_t = \\mu_t + \\gamma_t + \\mathbf{x}_t^\\top \\boldsymbol{\\beta}_t + \\varepsilon_t"}),e.jsxs("p",{className:"text-gray-700 text-sm mb-3",children:["where ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\beta}_t"})," may be time-varying (stochastic regression coefficients that follow random walks) or fixed. Time-varying regression allows the model to capture changing structural relationships — for example, a price elasticity that shifts over time."]}),e.jsxs("div",{className:"rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm",children:[e.jsx("h4",{className:"font-semibold text-sky-900 mb-2",children:"Common extensions in practice"}),e.jsxs("ul",{className:"space-y-1 list-disc list-inside text-sky-800",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Intervention effects:"})," pulse and step dummies for known shocks (policy changes, outliers)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Calendar effects:"})," trading-day and holiday regressors for daily or weekly data."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Transfer functions:"})," lagged external regressors (leading indicators) included as fixed covariates."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Time-varying parameters:"})," allowing regression coefficients to drift over time, modelling structural breaks gradually."]})]})]})]}),e.jsxs(B,{title:"Decomposing Airline Passenger Data with BSM",children:[e.jsx("p",{className:"text-gray-700 mb-3",children:"The log-transformed airline passenger series (Box-Jenkins airlines data) provides a canonical example for the BSM. After log transformation, the multiplicative seasonality becomes additive, making the structural model directly applicable."}),e.jsxs("ol",{className:"list-decimal list-inside space-y-2 text-sm text-gray-700",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Model selection:"})," compare local level, LLT, and BSM by AIC. The BSM (with 12-period seasonality) gives substantially better fit than the non-seasonal models."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Estimated variances:"})," the MLE finds that"," ",e.jsx(t.InlineMath,{math:"\\hat{\\sigma}_\\zeta^2 \\approx 0"})," (nearly deterministic slope), while ",e.jsx(t.InlineMath,{math:"\\hat{\\sigma}_\\omega^2 > 0"})," (seasonal pattern evolves slightly over time)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Components:"})," the trend smoothly captures the exponential growth, the seasonal component is approximately stable with slight amplitude changes, and the irregular is small relative to the signal."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Forecasting:"})," the 24-month forecast appropriately continues the upward trend with growing prediction intervals driven by level uncertainty."]})]})]}),e.jsxs(S,{title:"Identifiability: Variance Floor and Zero Constraints",children:["When estimating BSM variance components, it is common for some estimates to hit zero — the optimiser cannot distinguish a truly zero variance from a very small one. Zero variances degenerate the corresponding component to a deterministic function. For example, ",e.jsx(t.InlineMath,{math:"\\hat{\\sigma}_\\zeta^2 = 0"})," means the slope is effectively fixed at its initial value. Always check whether variance constraints are meaningful given the data, and compare AIC between constrained and unconstrained versions using likelihood ratio tests."]}),e.jsx(b,{title:"Structural Time Series Models with statsmodels UnobservedComponents",code:Je,runnable:!0}),e.jsx(M,{references:[{title:"Forecasting, Structural Time Series Models and the Kalman Filter",author:"Harvey, A.C.",year:1989,url:"https://www.cambridge.org/core/books/forecasting-structural-time-series-models-and-the-kalman-filter/CE5E112570A56960601760E786D5C4DC"},{title:"Time Series Analysis by State Space Methods (2nd ed.)",author:"Durbin, J. & Koopman, S.J.",year:2012,url:"https://doi.org/10.1093/acprof:oso/9780199641178.001.0001"},{title:"statsmodels UnobservedComponents: Structural Time Series",author:"Fulton, C.",year:2015,url:"https://www.statsmodels.org/stable/generated/statsmodels.tsa.statespace.structural.UnobservedComponents.html"},{title:"Forecasting: Principles and Practice (3rd ed.) — Chapter 8: ETS Models",author:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/ets.html"}]})]})})}const ht=Object.freeze(Object.defineProperty({__proto__:null,default:$e},Symbol.toStringTag,{value:"Module"})),Ve=`# Prophet: Decomposable Time Series Forecasting
# pip install prophet

import pandas as pd
import numpy as np
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
from prophet.plot import plot_cross_validation_metric
import matplotlib.pyplot as plt

# ── 1. Data preparation ───────────────────────────────────────────────────────
# Prophet requires columns 'ds' (datetime) and 'y' (target)
np.random.seed(42)
n = 365 * 3   # 3 years daily data
dates = pd.date_range('2021-01-01', periods=n, freq='D')
t = np.arange(n)

# Simulate: linear trend + weekly + annual + holidays + noise
weekly = 5 * np.sin(2 * np.pi * t / 7)
annual = 15 * np.sin(2 * np.pi * t / 365.25)
trend_component = 0.05 * t
noise = np.random.normal(0, 3, n)
y = 100 + trend_component + weekly + annual + noise

df = pd.DataFrame({'ds': dates, 'y': y})

# ── 2. Basic Prophet model ────────────────────────────────────────────────────
m = Prophet(
    growth='linear',          # or 'logistic' for saturating growth
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False,
    changepoint_prior_scale=0.05,   # flexibility of trend (regularization)
    seasonality_prior_scale=10,     # flexibility of seasonality
    seasonality_mode='additive',    # or 'multiplicative'
    interval_width=0.95,            # prediction interval width
)

m.fit(df)

# ── 3. Future dataframe and forecast ─────────────────────────────────────────
future = m.make_future_dataframe(periods=90, freq='D')
forecast = m.predict(future)

print("Forecast columns:", forecast.columns.tolist())
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(10))

# ── 4. Decomposition plot ─────────────────────────────────────────────────────
fig1 = m.plot(forecast, figsize=(12, 5))
fig2 = m.plot_components(forecast, figsize=(12, 8))
plt.savefig('prophet_components.png', dpi=150)

# ── 5. Custom seasonality ─────────────────────────────────────────────────────
m2 = Prophet(yearly_seasonality=False, weekly_seasonality=True)
m2.add_seasonality(
    name='monthly',
    period=30.5,
    fourier_order=5,   # number of Fourier terms
)
m2.add_seasonality(
    name='quarterly',
    period=91.25,
    fourier_order=3,
)
m2.fit(df)

# ── 6. Holiday effects ────────────────────────────────────────────────────────
holidays = pd.DataFrame({
    'holiday': 'christmas',
    'ds': pd.date_range('2021-12-25', periods=3, freq='365D'),
    'lower_window': -2,   # effect starts 2 days before
    'upper_window': 1,    # effect ends 1 day after
})
m3 = Prophet(holidays=holidays)
m3.add_country_holidays(country_name='US')   # built-in US holidays
m3.fit(df)

# ── 7. Logistic growth (saturating forecasts) ────────────────────────────────
df_logistic = df.copy()
df_logistic['cap'] = 300    # carrying capacity
df_logistic['floor'] = 0    # minimum value

m4 = Prophet(growth='logistic')
m4.fit(df_logistic)
future4 = m4.make_future_dataframe(periods=90)
future4['cap'] = 300
future4['floor'] = 0
forecast4 = m4.predict(future4)

# ── 8. Cross-validation ───────────────────────────────────────────────────────
# Evaluate using sliding window CV
df_cv = cross_validation(
    m,
    initial='365 days',   # minimum training window
    period='90 days',     # spacing between cutoff dates
    horizon='90 days',    # forecast horizon
    parallel='processes', # parallelization
)
print("\\nCV results shape:", df_cv.shape)

df_perf = performance_metrics(df_cv)
print("\\nPerformance metrics:")
print(df_perf[['horizon', 'mae', 'mape', 'rmse', 'coverage']].head(10))

# Plot MAPE across horizons
fig3 = plot_cross_validation_metric(df_cv, metric='mape')
plt.savefig('prophet_cv_mape.png', dpi=150)

# ── 9. Uncertainty intervals via Monte Carlo ─────────────────────────────────
# Prophet samples from posterior using Stan under the hood
# mcmc_samples > 0 triggers full MCMC (slow but proper Bayesian intervals)
m_mcmc = Prophet(
    mcmc_samples=0,          # 0 = MAP estimation (fast); >0 = full MCMC
    interval_width=0.90,
)
m_mcmc.fit(df)
forecast_mcmc = m_mcmc.predict(future)
print("\\n90% interval width (first forecast):",
      (forecast_mcmc['yhat_upper'] - forecast_mcmc['yhat_lower']).iloc[-90:].mean().round(2))
`,Xe=[{label:"Taylor & Letham 2018",title:"Forecasting at Scale",authors:"Taylor, S.J. & Letham, B.",year:2018,url:"https://doi.org/10.1080/00031305.2017.1380080"},{label:"Prophet docs",title:"Prophet: Forecasting at Scale — official documentation",authors:"Meta Research",year:2023,url:"https://facebook.github.io/prophet/"}];function Qe(){return e.jsxs(A,{title:"Prophet: Decomposable Forecasting",difficulty:"intermediate",readingTime:25,prerequisites:["ETS State Space Framework","ARIMA Models"],children:[e.jsx("p",{children:"Prophet, developed by Meta's Core Data Science team (Taylor & Letham, 2018), is a procedure for forecasting time series with strong seasonality, holiday effects, and irregular trend changepoints. It is designed for business analysts, not just statisticians."}),e.jsx(j,{type:"info",title:"Taylor & Letham 2018",children:'The original paper "Forecasting at Scale" was published in The American Statistician. Prophet uses a decomposable model fitted with Stan (probabilistic programming), making it robust to missing data, outliers, and shifts in trend.'}),e.jsx("h2",{children:"1. The Prophet Model"}),e.jsx(_,{label:"Definition",title:"Prophet Decomposable Model",definition:"Prophet decomposes the time series into three main components plus noise.",notation:"y(t) = g(t) + s(t) + h(t) + \\varepsilon_t"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx(t.InlineMath,{math:"g(t)"})}),": Trend function (piecewise linear or logistic)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx(t.InlineMath,{math:"s(t)"})}),": Seasonality (Fourier series)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx(t.InlineMath,{math:"h(t)"})}),": Holiday effects (indicator variables)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx(t.InlineMath,{math:"\\varepsilon_t"})}),": Error term"]})]}),e.jsx("h2",{children:"2. Trend Component"}),e.jsx("p",{children:"Prophet offers two trend models:"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Piecewise linear"})," with automatic changepoint detection:"]}),e.jsx(t.BlockMath,{math:"g(t) = (k + \\mathbf{a}(t)^T \\boldsymbol{\\delta}) t + (m + \\mathbf{a}(t)^T \\boldsymbol{\\gamma})"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\delta}"})," are changepoint slope adjustments, automatically placed at potential changepoints. The prior"," ",e.jsx(t.InlineMath,{math:"\\delta_j \\sim \\text{Laplace}(0, \\tau)"})," with regularization strength ",e.jsx(t.InlineMath,{math:"\\tau"})," = ",e.jsx("code",{children:"changepoint_prior_scale"}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Logistic growth"})," for saturating trends:"]}),e.jsx(t.BlockMath,{math:"g(t) = \\frac{C(t)}{1 + \\exp(-(k + \\mathbf{a}(t)^T\\boldsymbol{\\delta})(t - (m + \\mathbf{a}(t)^T\\boldsymbol{\\gamma})))}"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"C(t)"})," is the carrying capacity (user-specified or modeled)."]}),e.jsx("h2",{children:"3. Seasonality via Fourier Series"}),e.jsxs("p",{children:["Rather than seasonal dummy variables, Prophet uses a Fourier series approximation for each seasonal period ",e.jsx(t.InlineMath,{math:"P"}),":"]}),e.jsx(t.BlockMath,{math:"s(t) = \\sum_{n=1}^{N}\\left(a_n \\cos\\frac{2\\pi n t}{P} + b_n \\sin\\frac{2\\pi n t}{P}\\right)"}),e.jsxs("p",{children:["The number of Fourier terms ",e.jsx(t.InlineMath,{math:"N"})," (",e.jsx("code",{children:"fourier_order"}),") controls the smoothness. Typical values: N=3 for annual seasonality, N=3 for weekly, N=10 for annual with fine-grained holidays."]}),e.jsx("h2",{children:"4. Holiday Effects"}),e.jsx("p",{children:"Holidays are modeled as indicator variables with a window of effect:"}),e.jsx(t.BlockMath,{math:"h(t) = \\mathbf{Z}(t) \\boldsymbol{\\kappa}, \\quad \\kappa_j \\sim \\text{Normal}(0, \\nu^2)"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\mathbf{Z}(t)"})," is a binary indicator for whether time"," ",e.jsx(t.InlineMath,{math:"t"})," falls in a holiday window. The regularization prior prevents overfitting to noisy holiday spikes."]}),e.jsx("h2",{children:"5. Uncertainty Intervals"}),e.jsx("p",{children:"Prophet generates uncertainty intervals via Monte Carlo simulation by default (MAP estimation). Full Bayesian inference via MCMC is available but slower:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Trend uncertainty"}),": sampled from posterior over changepoint locations and magnitudes"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Observation noise"}),": sampled from the residual noise model"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Seasonality uncertainty"}),": included when ",e.jsx("code",{children:"mcmc_samples > 0"})]})]}),e.jsx("h2",{children:"6. Prophet vs ARIMA: Trade-offs"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm text-zinc-700 dark:text-zinc-300 border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-zinc-100 dark:bg-zinc-800",children:[e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"Aspect"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"Prophet"}),e.jsx("th",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-2",children:"ARIMA"})]})}),e.jsx("tbody",{children:[["User skill required","Low — interpretable parameters","High — ACF/PACF expertise needed"],["Multiple seasonalities","Native support","Complex seasonal ARIMA needed"],["Holiday effects","Built-in, easy to specify","Manual SARIMAX exogenous"],["Irregular frequencies","Handles naturally (Stan fits on t)","Requires regular grid"],["Missing data","Handles gracefully","Requires imputation"],["Theoretical foundation","Ad-hoc / pragmatic","Well-established (Box-Jenkins)"],["Short series (<50 obs)","Works well","Struggles (few parameters estimable)"],["Forecast accuracy","Good for business metrics","Better for stationary economic series"],["Speed (1000+ series)","Slow (Stan per series)","statsforecast AutoARIMA: very fast"]].map(([a,n,s],l)=>e.jsxs("tr",{className:l%2===0?"":"bg-zinc-50 dark:bg-zinc-800/50",children:[e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 font-medium",children:a}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-emerald-700 dark:text-emerald-400",children:n}),e.jsx("td",{className:"border border-zinc-300 dark:border-zinc-600 px-3 py-1.5 text-sky-700 dark:text-sky-400",children:s})]},l))})]})}),e.jsx(j,{type:"warning",title:"Prophet Is Not a Universal Solution",children:"Prophet has been criticized for over-fitting changepoints and producing overconfident intervals on datasets it was not designed for. Always compare Prophet against seasonal naïve and ARIMA before deploying. For high-frequency data (hourly, sub-daily), consider NeuralProphet or TBATS instead."}),e.jsx(S,{title:"When NOT to Use Prophet",children:"Prophet struggles with: (1) non-business time series with complex autocorrelation structure, (2) very short series < 2 seasonal cycles, (3) series requiring exogenous variable modeling beyond holidays, (4) purely AR/MA type dynamics with no trend or seasonality."}),e.jsx("h2",{children:"Python: Complete Prophet API"}),e.jsx(b,{code:Ve,filename:"prophet_model.py",title:"Prophet — complete API with seasonality, holidays, logistic growth, and CV"}),e.jsx(M,{references:Xe})]})}const pt=Object.freeze(Object.defineProperty({__proto__:null,default:Qe},Symbol.toStringTag,{value:"Module"}));export{st as a,rt as b,it as c,nt as d,ot as e,lt as f,dt as g,ct as h,mt as i,ht as j,pt as k,at as s};
