import{r as g,j as e}from"./vendor-CnSysweu.js";import{r as t}from"./vendor-katex-CdqB51LS.js";import{S as w,N as C,P as p,W as M,R as N,D as c,T,E as B}from"./subject-01-ts-foundations-fmj7uPpc.js";import{R as v,B as I,C as b,X as j,Y as y,T as S,c as A,L as z,d as F,a as k,b as q}from"./vendor-charts-BucFqer8.js";const O=Array.from({length:24},(s,r)=>({t:`W${r+1}`,demand:Math.round(100+8*Math.sin(r*.5)+(Math.random()-.5)*10)})),W=Array.from({length:24},(s,r)=>({t:`W${r+1}`,demand:Math.round(Math.max(0,80+(Math.random()-.5)*120))})),Q=[...Array.from({length:24},(s,r)=>({t:`W${r+1}`,demand:Math.random()<.3?Math.round(20+Math.random()*40):0}))],H=Array.from({length:24},(s,r)=>({t:`W${r+1}`,demand:Math.random()<.2?Math.round(150+Math.random()*200):0})),L=[{key:"smooth",label:"Smooth",data:O,color:"#22c55e",description:"Regular demand with low variability. CV < 0.5. Classical methods work well."},{key:"erratic",label:"Erratic",data:W,color:"#f59e0b",description:"Demand occurs every period but with high variability. CV > 0.5. Difficult to forecast accurately."},{key:"intermittent",label:"Intermittent",data:Q,color:"#6366f1",description:"Many zero periods with occasional small demands. Use Croston or SBA methods."},{key:"lumpy",label:"Lumpy",data:H,color:"#ef4444",description:"Intermittent AND erratic: many zeros with large, irregular spikes. Hardest to forecast."}];function $(){const[s,r]=g.useState("smooth"),a=L.find(i=>i.key===s);return e.jsxs(w,{title:"Demand Patterns & ABC-XYZ Classification",difficulty:"intermediate",readingTime:25,prerequisites:["Forecasting Basics","Statistical Measures"],children:[e.jsx("p",{children:"Before choosing a forecasting method for a SKU, you need to understand its demand pattern. The same exponential smoothing that works beautifully for a steady-selling product will completely fail on a spare part that sells once every few months. Systematic demand classification directs forecasting effort where it matters most."}),e.jsx("h2",{children:"Demand Pattern Taxonomy"}),e.jsxs("p",{children:["Demand patterns are characterized by two dimensions:"," ",e.jsx("strong",{children:"frequency"})," (how often does demand occur?) and"," ",e.jsx("strong",{children:"variability"})," (how much does it vary when it does occur?)."]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-2 my-4",children:L.map(({key:i,label:o,color:h})=>e.jsxs("button",{onClick:()=>r(i),className:`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${s===i?"border-indigo-500 bg-indigo-50":"border-gray-200 hover:border-gray-400"}`,children:[e.jsx("div",{className:"w-4 h-4 rounded-full mx-auto mb-1",style:{backgroundColor:h}}),o]},i))}),e.jsx("div",{className:"bg-gray-50 rounded-lg p-3 mb-3",children:e.jsx("p",{className:"text-sm text-gray-700",children:a.description})}),e.jsx(v,{width:"100%",height:220,children:e.jsxs(I,{data:a.data,children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(j,{dataKey:"t",tick:{fontSize:10},interval:3}),e.jsx(y,{}),e.jsx(S,{}),e.jsx(A,{dataKey:"demand",fill:a.color,name:"Demand"})]})}),e.jsx("h2",{children:"The Four Pattern Types"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-indigo-50",children:[e.jsx("th",{className:"border border-gray-300 p-2",children:"Pattern"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Freq."}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Variability"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Typical CV"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Recommended Method"})]})}),e.jsx("tbody",{children:[["Smooth","Regular","Low","< 0.5","ETS, ARIMA, moving average"],["Erratic","Regular","High","> 0.5","ETS with damping, robust regression"],["Intermittent","Sporadic","Low","ADI > 1.32","Croston's, SBA"],["Lumpy","Sporadic","High","Both high","TSB, IMAPA, simulation"]].map(([i,o,h,n,f])=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:"border border-gray-300 p-2 font-semibold",children:i}),e.jsx("td",{className:"border border-gray-300 p-2",children:o}),e.jsx("td",{className:"border border-gray-300 p-2",children:h}),e.jsx("td",{className:"border border-gray-300 p-2 font-mono",children:n}),e.jsx("td",{className:"border border-gray-300 p-2 text-gray-600",children:f})]},i))})]})}),e.jsx("h2",{children:"ABC Classification: By Revenue Impact"}),e.jsx("p",{children:'ABC analysis ranks SKUs by their revenue (or cost or volume) contribution. It is the "80/20 rule" applied to inventory:'}),e.jsxs("ul",{className:"list-disc pl-6 my-3 space-y-1",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Class A"}),": Top SKUs contributing 70% of revenue. High investment in forecast accuracy."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Class B"}),": Next tier, contributing the next 20% of revenue. Moderate attention."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Class C"}),": Remaining SKUs, bottom 10% of revenue. Minimal effort; use simple rules."]})]}),e.jsx(t.BlockMath,{math:"\\text{Cumulative revenue share}_i = \\frac{\\sum_{j=1}^{i} R_j}{\\sum_{j=1}^{N} R_j}"}),e.jsx("h2",{children:"XYZ Classification: By Forecast Difficulty"}),e.jsxs("p",{children:["XYZ classifies SKUs by how predictable their demand is, measured by the",e.jsx("strong",{children:" Coefficient of Variation (CV)"}),":"]}),e.jsx(t.BlockMath,{math:"\\text{CV} = \\frac{\\sigma_d}{\\bar{d}}"}),e.jsxs("ul",{className:"list-disc pl-6 my-3 space-y-1",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"X (predictable)"}),": CV < 0.5 — demand is stable and smooth."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Y (variable)"}),": 0.5 ≤ CV < 1.0 — demand fluctuates moderately."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Z (sporadic)"}),": CV ≥ 1.0 — demand is erratic or intermittent."]})]}),e.jsxs(C,{children:["For intermittent demand, CV is undefined when ",e.jsx(t.InlineMath,{math:"\\bar{d} = 0"}),". Use the Average Demand Interval (ADI) instead: ",e.jsx(t.InlineMath,{math:"\\text{ADI} = T / n_d"}),"where T is total periods and ",e.jsx(t.InlineMath,{math:"n_d"})," is periods with non-zero demand. ADI > 1.32 indicates intermittent demand (Syntetos-Boylan classification)."]}),e.jsx("h2",{children:"ABC-XYZ Matrix"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm border-collapse text-center",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-gray-100",children:[e.jsx("th",{className:"border border-gray-300 p-2"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"X (CV < 0.5)"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Y (0.5–1.0)"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Z (CV ≥ 1.0)"})]})}),e.jsx("tbody",{children:[["A (top 70% rev)","bg-green-100","bg-green-50","bg-yellow-100","Best models, frequent review","ML + ETS ensemble","Safety stock buffer"],["B (next 20%)","bg-green-50","bg-yellow-50","bg-orange-100","ETS, weekly review","Croston if intermittent","Slow-mover policy"],["C (bottom 10%)","bg-yellow-50","bg-orange-50","bg-red-100","Simple rules, min-max","On-demand ordering","Discontinue or VMI"]].map(([i,o,h,n,f,d,m])=>e.jsxs("tr",{children:[e.jsx("td",{className:"border border-gray-300 p-2 font-semibold text-left",children:i}),e.jsx("td",{className:`border border-gray-300 p-2 ${o}`,children:f}),e.jsx("td",{className:`border border-gray-300 p-2 ${h}`,children:d}),e.jsx("td",{className:`border border-gray-300 p-2 ${n}`,children:m})]},i))})]})}),e.jsx("h2",{children:"Python Implementation"}),e.jsx(p,{code:`import pandas as pd
import numpy as np

# ── Sample data: daily sales per SKU ────────────────────────────────────
np.random.seed(42)
n_skus = 1000
n_periods = 52  # weeks

# Simulate demand data
records = []
for i in range(n_skus):
    sku = f'SKU_{i:04d}'
    base_demand = np.random.lognormal(3, 1.5)  # varies widely across SKUs
    zero_prob = np.random.beta(2, 5)           # some SKUs are intermittent
    revenue_per_unit = np.random.uniform(5, 500)
    for w in range(n_periods):
        d = 0 if np.random.random() < zero_prob else max(0, np.random.poisson(base_demand))
        records.append({'sku': sku, 'week': w, 'demand': d,
                        'revenue': d * revenue_per_unit})

df = pd.DataFrame(records)

# ── ABC Classification ─────────────────────────────────────────────────
sku_revenue = df.groupby('sku')['revenue'].sum().sort_values(ascending=False)
total_revenue = sku_revenue.sum()
sku_revenue_pct = sku_revenue / total_revenue
cumulative_pct = sku_revenue_pct.cumsum()

def abc_class(cum_pct):
    if cum_pct <= 0.70: return 'A'
    elif cum_pct <= 0.90: return 'B'
    else: return 'C'

abc = cumulative_pct.apply(abc_class).rename('abc_class')
print(abc.value_counts())`}),e.jsx(p,{code:`# ── XYZ Classification ────────────────────────────────────────────────
sku_stats = df.groupby('sku')['demand'].agg(
    mean='mean',
    std='std',
    zeros=lambda x: (x == 0).sum(),
    count='count',
)
sku_stats['cv'] = sku_stats['std'] / sku_stats['mean'].replace(0, np.nan)
sku_stats['adi'] = sku_stats['count'] / (sku_stats['count'] - sku_stats['zeros']).replace(0, np.nan)

def xyz_class(row):
    if pd.isna(row['cv']) or row['mean'] == 0:
        return 'Z'  # no demand
    if row['cv'] < 0.5:
        return 'X'
    elif row['cv'] < 1.0:
        return 'Y'
    else:
        return 'Z'

sku_stats['xyz_class'] = sku_stats.apply(xyz_class, axis=1)

# ── Combine into ABC-XYZ ───────────────────────────────────────────────
classification = sku_stats.join(abc)
classification['abcxyz'] = classification['abc_class'] + classification['xyz_class']

print(classification['abcxyz'].value_counts().sort_index())
#  AX    58   <- best: high value, predictable
#  AY    41
#  AZ    28   <- high value but hard to forecast
#  BX    92
#  ...
#  CZ   312   <- most SKUs: low value, sporadic`}),e.jsx(p,{code:`# ── Strategy assignment ───────────────────────────────────────────────
strategy_map = {
    'AX': 'ML ensemble, daily review, safety stock = 1.64*sigma',
    'AY': 'ML + ETS, weekly review, safety stock = 2.05*sigma',
    'AZ': 'Croston/TSB, weekly review, high safety stock buffer',
    'BX': 'ETS, weekly review, standard safety stock',
    'BY': 'ETS or Croston, bi-weekly review',
    'BZ': 'Croston, bi-weekly review, slow-mover policy',
    'CX': 'Simple rules (min-max), monthly review',
    'CY': 'Min-max policy, monthly review',
    'CZ': 'On-demand ordering or discontinue',
}

classification['strategy'] = classification['abcxyz'].map(strategy_map)
print(classification[['abc_class', 'xyz_class', 'abcxyz', 'strategy']].head(10))`}),e.jsx(M,{children:"ABC-XYZ thresholds (70/90%, CV 0.5/1.0) are industry conventions, not laws. Calibrate them for your business: a retailer with 50,000 SKUs may define A as top 50% of revenue if that still represents a manageable review cadence."}),e.jsx(N,{references:[{authors:"Syntetos, A.A., Boylan, J.E., Croston, J.D.",year:2005,title:"On the categorization of demand patterns",journal:"Journal of the Operational Research Society",volume:"56(5)",pages:"495–503"},{authors:"Flores, B.E., Whybark, D.C.",year:1986,title:"Multiple criteria ABC analysis",journal:"International Journal of Operations and Production Management",volume:"6(3)",pages:"38–46"}]})]})}const je=Object.freeze(Object.defineProperty({__proto__:null,default:$},Symbol.toStringTag,{value:"Module"})),R=[{t:1,demand:0},{t:2,demand:0},{t:3,demand:4},{t:4,demand:0},{t:5,demand:0},{t:6,demand:0},{t:7,demand:7},{t:8,demand:0},{t:9,demand:0},{t:10,demand:3},{t:11,demand:0},{t:12,demand:0},{t:13,demand:0},{t:14,demand:0},{t:15,demand:6},{t:16,demand:0},{t:17,demand:0},{t:18,demand:5},{t:19,demand:0},{t:20,demand:0}],G=[{t:1,croston:3.2,sba:2.7,tsb:2.4,naive:0},{t:2,croston:3.2,sba:2.7,tsb:1.8,naive:0},{t:3,croston:3.5,sba:2.9,tsb:3.1,naive:4},{t:4,croston:3.5,sba:2.9,tsb:2.5,naive:0},{t:5,croston:3.5,sba:2.9,tsb:1.9,naive:0},{t:6,croston:3.5,sba:2.9,tsb:1.5,naive:0},{t:7,croston:4,sba:3.4,tsb:4.2,naive:7},{t:8,croston:4,sba:3.4,tsb:3.2,naive:0},{t:9,croston:4,sba:3.4,tsb:2.5,naive:0},{t:10,croston:3.8,sba:3.2,tsb:3.5,naive:3}];function V(){const[s,r]=g.useState(.2),[a,i]=g.useState(.2),o=R.filter(l=>l.demand>0),h=o.reduce((l,x)=>l+x.demand,0)/o.length,n=[];let f=0;R.forEach((l,x)=>{l.demand>0&&(n.push(x-f),f=x)});const d=n.reduce((l,x)=>l+x,0)/n.length,m=h/d,_=(1-s/2)*m;return e.jsxs(w,{title:"Intermittent Demand Methods",difficulty:"intermediate",readingTime:30,prerequisites:["Exponential Smoothing","Demand Patterns & ABC-XYZ"],children:[e.jsx("p",{children:"Intermittent demand — characterized by many periods of zero demand interspersed with occasional positive values — defies standard exponential smoothing and ARIMA methods. These methods were designed for continuous, regular demand and produce persistent positive forecasts even when demand may not occur for months. Specialized intermittent demand methods are required."}),e.jsx("h2",{children:"What Is Intermittent Demand?"}),e.jsxs("div",{className:"my-4",children:[e.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Example intermittent demand series (spare parts)"}),e.jsx(v,{width:"100%",height:160,children:e.jsxs(I,{data:R,children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(j,{dataKey:"t",label:{value:"Period",position:"insideBottom",offset:-3}}),e.jsx(y,{}),e.jsx(S,{}),e.jsx(A,{dataKey:"demand",fill:"#6366f1",name:"Demand"})]})})]}),e.jsxs(c,{title:"Syntetos-Boylan Classification Scheme",children:["A demand pattern is classified as ",e.jsx("strong",{children:"intermittent"})," when the Average Demand Interval (ADI) exceeds 1.32 (demand occurs less than once every 1.32 periods on average). The CV² threshold further distinguishes erratic from smooth non-zero demand:",e.jsxs("ul",{className:"list-disc pl-4 mt-2",children:[e.jsxs("li",{children:["ADI < 1.32, CV² < 0.49: ",e.jsx("strong",{children:"Smooth"})]}),e.jsxs("li",{children:["ADI < 1.32, CV² ≥ 0.49: ",e.jsx("strong",{children:"Erratic"})]}),e.jsxs("li",{children:["ADI ≥ 1.32, CV² < 0.49: ",e.jsx("strong",{children:"Intermittent"})]}),e.jsxs("li",{children:["ADI ≥ 1.32, CV² ≥ 0.49: ",e.jsx("strong",{children:"Lumpy"})]})]})]}),e.jsx("h2",{children:"Croston's Method (1972)"}),e.jsx("p",{children:"Croston's key insight: decompose the demand series into two components and forecast each separately using simple exponential smoothing."}),e.jsxs("ul",{className:"list-disc pl-6 my-3 space-y-1",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Demand size"})," ",e.jsx(t.InlineMath,{math:"\\hat{z}_t"}),": average non-zero demand magnitude"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Demand interval"})," ",e.jsx(t.InlineMath,{math:"\\hat{q}_t"}),": average number of periods between non-zero demands"]})]}),e.jsxs("p",{children:["Update equations (only applied at periods ",e.jsx(t.InlineMath,{math:"t"})," when demand is non-zero):"]}),e.jsx(t.BlockMath,{math:"\\hat{z}_t = \\alpha \\cdot d_t + (1-\\alpha) \\cdot \\hat{z}_{t-1}"}),e.jsx(t.BlockMath,{math:"\\hat{q}_t = \\alpha \\cdot \\ell_t + (1-\\alpha) \\cdot \\hat{q}_{t-1}"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\ell_t"})," is the observed inter-demand interval at time t. The one-period-ahead forecast is:"]}),e.jsx(t.BlockMath,{math:"\\hat{f}_{t+1} = \\frac{\\hat{z}_t}{\\hat{q}_t}"}),e.jsx("h2",{children:"SBA: Syntetos-Boylan Approximation"}),e.jsx("p",{children:"Croston's method is biased — it over-forecasts on average. Syntetos and Boylan (2005) derived a bias correction factor:"}),e.jsx(t.BlockMath,{math:"\\hat{f}^{\\text{SBA}}_{t+1} = \\left(1 - \\frac{\\alpha}{2}\\right) \\cdot \\frac{\\hat{z}_t}{\\hat{q}_t}"}),e.jsxs("p",{children:["The correction factor ",e.jsx(t.InlineMath,{math:"(1 - \\alpha/2)"})," is always less than 1, so SBA forecasts are always slightly lower than Croston. For typical smoothing parameters (α = 0.1–0.3), the bias reduction is 5–15%."]}),e.jsxs("div",{className:"bg-indigo-50 rounded-lg p-4 my-4",children:[e.jsx("h3",{className:"font-semibold mb-3",children:"Interactive: Croston vs SBA Calculation"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-3",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Alpha (size smoothing): ",s.toFixed(2)]}),e.jsx("input",{type:"range",min:"0.05",max:"0.5",step:"0.05",value:s,onChange:l=>r(parseFloat(l.target.value)),className:"w-full mt-1"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Alpha (interval smoothing): ",a.toFixed(2)]}),e.jsx("input",{type:"range",min:"0.05",max:"0.5",step:"0.05",value:a,onChange:l=>i(parseFloat(l.target.value)),className:"w-full mt-1"})]})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-3 text-sm",children:[e.jsxs("div",{className:"bg-white rounded p-3 text-center",children:[e.jsx("div",{className:"text-gray-500",children:"Avg. Demand Size"}),e.jsx("div",{className:"text-xl font-bold text-indigo-600",children:h.toFixed(2)})]}),e.jsxs("div",{className:"bg-white rounded p-3 text-center",children:[e.jsx("div",{className:"text-gray-500",children:"Avg. Interval"}),e.jsx("div",{className:"text-xl font-bold text-indigo-600",children:d.toFixed(2)})]}),e.jsxs("div",{className:"bg-white rounded p-3 text-center",children:[e.jsx("div",{className:"text-gray-500",children:"Croston / SBA"}),e.jsxs("div",{className:"text-xl font-bold text-indigo-600",children:[m.toFixed(2)," / ",_.toFixed(2)]})]})]})]}),e.jsx("h2",{children:"TSB: Teunter-Syntetos-Babai Method"}),e.jsxs("p",{children:["TSB (2011) uses a fundamentally different approach: instead of tracking the demand interval, it directly models the ",e.jsx("strong",{children:"probability of demand occurrence"}),"in each period."]}),e.jsx(t.BlockMath,{math:"\\hat{p}_t = \\alpha_p \\cdot \\mathbf{1}[d_t > 0] + (1 - \\alpha_p) \\cdot \\hat{p}_{t-1}"}),e.jsx(t.BlockMath,{math:"\\hat{z}_t = \\alpha_z \\cdot d_t \\cdot \\mathbf{1}[d_t > 0] + (1 - \\alpha_z) \\cdot \\hat{z}_{t-1}"}),e.jsx(t.BlockMath,{math:"\\hat{f}_{t+1} = \\hat{p}_t \\cdot \\hat{z}_t"}),e.jsx("p",{children:"TSB's key advantage: the demand probability decays over time if no demand occurs, which means forecasts naturally decrease during extended zero periods. Croston/SBA maintain a constant forecast regardless of how long the gap is."}),e.jsx("h2",{children:"IMAPA: Intermittent Multiple Aggregation Prediction Algorithm"}),e.jsx("p",{children:"IMAPA applies the Multiple Aggregation Prediction Algorithm (MAPA) to intermittent demand. It aggregates the series at multiple temporal levels (original, 2-period, 3-period, etc.), applies Croston's method at each level, and then combines the forecasts via a simple average. This multi-scale approach reduces variance without increasing bias."}),e.jsx("h2",{children:"Method Comparison"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-indigo-50",children:[e.jsx("th",{className:"border border-gray-300 p-2",children:"Method"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Bias"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Adapts to regime change?"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Best for"})]})}),e.jsx("tbody",{children:[["Croston (1972)","Positive bias","Slow","Stable intermittent demand"],["SBA (2005)","Near-unbiased","Slow","General intermittent; recommended default"],["TSB (2011)","Near-unbiased","Fast — demand prob decays","Products that may be discontinued"],["IMAPA","Near-unbiased","Moderate","Noisy intermittent, lumpy demand"]].map(([l,x,E,D])=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:"border border-gray-300 p-2 font-semibold",children:l}),e.jsx("td",{className:"border border-gray-300 p-2",children:x}),e.jsx("td",{className:"border border-gray-300 p-2",children:E}),e.jsx("td",{className:"border border-gray-300 p-2 text-gray-600",children:D})]},l))})]})}),e.jsx("h2",{children:"Forecast Comparison Chart"}),e.jsx(v,{width:"100%",height:240,children:e.jsxs(z,{data:G,children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(j,{dataKey:"t"}),e.jsx(y,{}),e.jsx(S,{}),e.jsx(F,{}),e.jsx(k,{type:"stepAfter",dataKey:"croston",stroke:"#6366f1",strokeWidth:2,dot:!1,name:"Croston"}),e.jsx(k,{type:"stepAfter",dataKey:"sba",stroke:"#22c55e",strokeWidth:2,dot:!1,name:"SBA"}),e.jsx(k,{type:"stepAfter",dataKey:"tsb",stroke:"#f59e0b",strokeWidth:2,dot:!1,name:"TSB"}),e.jsx(k,{type:"stepAfter",dataKey:"naive",stroke:"#ef4444",strokeWidth:1,strokeDasharray:"4 2",dot:!1,name:"Naive"})]})}),e.jsx("p",{className:"text-xs text-center text-gray-500 mt-1",children:"TSB adapts faster after observed demand; Croston/SBA are more stable between events."}),e.jsx("h2",{children:"Python: statsforecast Implementation"}),e.jsx(p,{code:`import pandas as pd
import numpy as np
from statsforecast import StatsForecast
from statsforecast.models import (
    CrostonOptimized,   # Croston's method with optimal alpha
    CrostonSBA,         # Syntetos-Boylan approximation
    IMAPA,              # Intermittent MAPA
    TSB,                # Teunter-Syntetos-Babai
    Naive,              # Benchmark
)

# ── Create intermittent demand data ────────────────────────────────────
np.random.seed(42)
n_periods = 104
n_skus = 200

records = []
for i in range(n_skus):
    uid = f'SPARE_{i:04d}'
    demand_prob = np.random.beta(1, 4)  # most SKUs have low demand probability
    avg_size = np.random.lognormal(1.5, 0.8)
    dates = pd.date_range('2022-01-01', periods=n_periods, freq='W')
    for date in dates:
        d = 0 if np.random.random() > demand_prob else max(0, int(np.random.poisson(avg_size)))
        records.append({'unique_id': uid, 'ds': date, 'y': float(d)})

df = pd.DataFrame(records)
zero_pct = (df['y'] == 0).mean()
print(f"Zero demand fraction: {zero_pct:.1%}")  # typically 60-90%`}),e.jsx(p,{code:`# ── Fit intermittent demand models ────────────────────────────────────
sf = StatsForecast(
    models=[
        CrostonOptimized(),
        CrostonSBA(),
        IMAPA(),
        TSB(alpha_d=0.2, alpha_p=0.2),  # alpha_d=demand size, alpha_p=demand prob
        Naive(),
    ],
    freq='W',
    n_jobs=-1,
)

horizon = 8
forecasts = sf.forecast(df=df, h=horizon)
print(forecasts.head())

# ── Cross-validate ─────────────────────────────────────────────────────
cv_df = sf.cross_validation(df=df, h=horizon, n_windows=4, step_size=4)

# ── Evaluation: use stockout-sensitive metrics ─────────────────────────
# For intermittent demand, standard RMSE is misleading.
# Prefer: MAE (less sensitive to zeros), Fill Rate, or CSL.
cv_df['ae_croston'] = (cv_df['y'] - cv_df['CrostonSBA']).abs()
cv_df['ae_tsb']     = (cv_df['y'] - cv_df['TSB']).abs()

print("MAE comparison:")
print(cv_df[['ae_croston', 'ae_tsb']].mean().round(3))`}),e.jsx(p,{code:`# ── Classify demand pattern before choosing method ────────────────────
def classify_demand(series):
    """Classify demand pattern using Syntetos-Boylan scheme."""
    n = len(series)
    n_nonzero = (series > 0).sum()
    if n_nonzero == 0:
        return 'no_demand'
    adi = n / n_nonzero
    cv2 = (series[series > 0].std() / series[series > 0].mean()) ** 2 if n_nonzero > 1 else 0
    if adi < 1.32 and cv2 < 0.49: return 'smooth'
    if adi < 1.32 and cv2 >= 0.49: return 'erratic'
    if adi >= 1.32 and cv2 < 0.49: return 'intermittent'
    return 'lumpy'

pattern_by_sku = (
    df.groupby('unique_id')['y']
    .apply(classify_demand)
    .value_counts()
)
print(pattern_by_sku)
#  smooth          52
#  erratic         38
#  intermittent    67
#  lumpy           43`}),e.jsxs(T,{title:"Why Standard Metrics Fail for Intermittent Demand",children:["RMSE heavily penalizes large errors. With intermittent demand, a forecast of 0 is wrong when demand occurs, but a forecast of 5 is wasteful when demand is zero. The ",e.jsx("strong",{children:"Scaled Mean Absolute Error (sMAPE)"})," is undefined when both actual and forecast are zero. Instead use:",e.jsxs("ul",{className:"list-disc pl-4 mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"MAE"}),": treats all periods equally, handles zeros"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"CSL (Cycle Service Level)"}),": fraction of order cycles without stockout"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Fill Rate"}),": fraction of demand met from stock"]})]})]}),e.jsx(M,{children:"CrostonOptimized fits alpha by minimizing in-sample MSE. This can overfit on short series. For series with fewer than 30 non-zero observations, fix alpha = 0.1–0.2 rather than optimizing it."}),e.jsx(N,{references:[{authors:"Croston, J.D.",year:1972,title:"Forecasting and stock control for intermittent demands",journal:"Operational Research Quarterly",volume:"23(3)",pages:"289–303"},{authors:"Syntetos, A.A., Boylan, J.E.",year:2005,title:"The accuracy of intermittent demand estimates",journal:"International Journal of Forecasting",volume:"21(2)",pages:"303–314"},{authors:"Teunter, R.H., Syntetos, A.A., Babai, M.Z.",year:2011,title:"Intermittent demand: Linking forecasting to inventory obsolescence",journal:"European Journal of Operational Research",volume:"214(3)",pages:"606–615"}]})]})}const Se=Object.freeze(Object.defineProperty({__proto__:null,default:V},Symbol.toStringTag,{value:"Module"}));function Z(){const[s,r]=g.useState(.03),[a,i]=g.useState(.38),o=1e3,h=[];let n=0;for(let d=1;d<=24;d++){const m=o-n,_=(s+a*(n/o))*m;n+=_,h.push({t:d,adoptions:Math.round(_),cumulative:Math.round(n)})}const f=h.reduce((d,m)=>m.adoptions>d.adoptions?m:d,h[0]);return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Bass Diffusion Model — Interactive"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 mb-3",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Innovation p: ",e.jsx("span",{className:"font-bold text-blue-600",children:s.toFixed(3)})]}),e.jsx("input",{type:"range",min:"0.001",max:"0.1",step:"0.001",value:s,onChange:d=>r(parseFloat(d.target.value)),className:"w-full mt-1"}),e.jsx("p",{className:"text-xs text-gray-500",children:"External influence (advertising, PR)"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Imitation q: ",e.jsx("span",{className:"font-bold text-orange-600",children:a.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0.05",max:"0.8",step:"0.01",value:a,onChange:d=>i(parseFloat(d.target.value)),className:"w-full mt-1"}),e.jsx("p",{className:"text-xs text-gray-500",children:"Social contagion (word-of-mouth)"})]})]}),e.jsxs("p",{className:"text-xs text-gray-600 mb-2",children:["M = 1,000 · Peak at period ",f.t," (",f.adoptions," units)"]}),e.jsx(v,{width:"100%",height:240,children:e.jsxs(z,{data:h,margin:{top:5,right:20,bottom:20,left:10},children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(j,{dataKey:"t",label:{value:"Period",position:"insideBottom",offset:-10}}),e.jsx(y,{yAxisId:"l",label:{value:"Sales",angle:-90,position:"insideLeft"}}),e.jsx(y,{yAxisId:"r",orientation:"right",label:{value:"Cumulative",angle:90,position:"insideRight"}}),e.jsx(S,{}),e.jsx(F,{verticalAlign:"top"}),e.jsx(k,{yAxisId:"l",dataKey:"adoptions",stroke:"#3b82f6",strokeWidth:2,dot:!1,name:"Period Sales"}),e.jsx(k,{yAxisId:"r",dataKey:"cumulative",stroke:"#f59e0b",strokeWidth:2,dot:!1,name:"Cumulative",strokeDasharray:"5 2"})]})})]})}function J(){return e.jsxs(w,{title:"New Product Forecasting",subject:"Supply Chain Forecasting",difficulty:"advanced",readingTime:12,children:[e.jsx("p",{children:"New product forecasting is among the hardest problems in supply chain management. By definition, there is no historical demand data for the new SKU. Errors translate directly into lost sales (understock) or write-offs (overstock), and the stakes are highest in the first weeks after launch. The toolbox includes diffusion models (theory-driven), analogical forecasting (data-driven via proxy), and Bayesian updating as early sales arrive."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Bass Diffusion Model"}),e.jsx("p",{children:"The Bass model (1969) describes the adoption of new products as a mixture of innovation (external influence from advertising) and imitation (social contagion from existing adopters). It was originally developed for consumer durables but applies broadly to technology, pharmaceuticals, and industrial products."}),e.jsxs(c,{title:"Bass Diffusion Model",children:["Let ",e.jsx(t.InlineMath,{math:"N(t)"})," be cumulative adopters at time ",e.jsx(t.InlineMath,{math:"t"})," and",e.jsx(t.InlineMath,{math:"M"})," the market potential. The rate of adoption is:",e.jsx(t.BlockMath,{math:"\\frac{dN}{dt} = \\left(p + q\\frac{N(t)}{M}\\right)(M - N(t))"}),"where ",e.jsx(t.InlineMath,{math:"p"})," is the coefficient of innovation and ",e.jsx(t.InlineMath,{math:"q"})," is the coefficient of imitation. The closed-form period sales solution is:",e.jsx(t.BlockMath,{math:"S(t) = M \\cdot \\frac{(p+q)^2/p \\cdot e^{-(p+q)t}}{\\left(1 + (q/p)e^{-(p+q)t}\\right)^2}"}),"Typical empirical ranges: ",e.jsx(t.InlineMath,{math:"p \\in [0.01, 0.03]"}),","," ",e.jsx(t.InlineMath,{math:"q \\in [0.3, 0.5]"}),"."]}),e.jsx(Z,{}),e.jsxs(T,{title:"Peak Adoption Time",children:["The Bass model predicts peak period sales at:",e.jsx(t.BlockMath,{math:"t^* = \\frac{\\ln(q/p)}{p + q}"}),"For consumer electronics (p=0.02, q=0.4), peak occurs at ",e.jsx(t.InlineMath,{math:"t^* \\approx 14"})," periods. This gives supply chain planners a specific horizon for maximum inventory need."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Analogical Forecasting"}),e.jsx("p",{children:"When Bass parameters cannot be estimated, analogical forecasting uses demand trajectories of similar established products as proxies. The process:"}),e.jsxs("ol",{className:"list-decimal ml-5 space-y-1 text-sm mt-2",children:[e.jsx("li",{children:"Select analog products based on market segment, price point, and category similarity"}),e.jsx("li",{children:"Index analog launch trajectories to a common base (Week 1 = 100)"}),e.jsx("li",{children:"Aggregate via similarity-weighted average"}),e.jsx("li",{children:"Scale the aggregate index to the new product's estimated market potential"}),e.jsx("li",{children:"Update analog weights as early sales data arrives"})]}),e.jsx(B,{title:"Fashion Retail — Analogical Forecasting",children:"A retailer launches a new sneaker style with no history. Five analogous SKUs from prior seasons are selected based on similar price tier and demographic targeting. Similarity weights: three close analogs at 25% each, two distant analogs at 12.5% each. The weighted trajectory projects a first-season range of 800–2,400 units at 90% confidence. This is wide, but sufficient to determine initial buy quantities (hedge conservative) and identify when to trigger a reorder (week 3–4 signal)."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Bayesian Updating with Early Sales"}),e.jsx("p",{children:"Bayesian methods treat the pre-launch forecast as a prior distribution and update it sequentially as each week of sales data arrives. The posterior uncertainty naturally shrinks and reorder decisions can be triggered when the posterior mean shifts beyond a planning threshold."}),e.jsxs(c,{title:"Normal-Normal Conjugate Update",children:["If the prior on total demand is ",e.jsx(t.InlineMath,{math:"M \\sim \\mathcal{N}(\\mu_0, \\sigma_0^2)"})," and we observe ",e.jsx(t.InlineMath,{math:"n"})," periods with mean ",e.jsx(t.InlineMath,{math:"\\bar{y}"})," and known noise ",e.jsx(t.InlineMath,{math:"\\sigma^2"}),", the posterior is:",e.jsx(t.BlockMath,{math:"\\mu_n = \\frac{\\sigma^2 \\mu_0 + n\\sigma_0^2 \\bar{y}}{\\sigma^2 + n\\sigma_0^2}, \\quad \\sigma_n^2 = \\frac{\\sigma^2 \\sigma_0^2}{\\sigma^2 + n\\sigma_0^2}"}),"The posterior mean is a precision-weighted average of prior and observed data. As",e.jsx(t.InlineMath,{math:"n \\to \\infty"}),", the prior is overwhelmed by data."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Managing Forecast Uncertainty"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Scenario planning"}),": Bear/Base/Bull cases corresponding to low, median, high adoption curves"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Option value of flexibility"}),": Price the cost of expedited freight or secondary suppliers vs overstock write-offs"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Rolling reviews"}),": Weekly re-forecast in first month, monthly thereafter"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Demand sensing"}),": Pre-orders, social media engagement, search volume as leading indicators"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Safe harbors"}),": For truly novel products, accept wide intervals and use modular production"]})]}),e.jsx(C,{children:"Bass model fitting on partial data systematically underestimates M and overestimates adoption speed. When fitting to fewer than 12 periods of sales, constrain q/p to a ratio consistent with analogous products rather than fitting freely."}),e.jsx(M,{children:"Analogical forecasting suffers from selection bias. Practitioners naturally select analogs that performed well (survivorship bias). Explicitly include failure-mode analogs — products that launched and quickly declined — to counteract optimism bias in the aggregate trajectory."}),e.jsx(p,{title:"Bass Model Fitting and Analogical Forecasting",code:`import numpy as np
import pandas as pd
from scipy.optimize import curve_fit

# ── Bass model functions ──────────────────────────────────────────────────────
def bass_cumulative(t, M, p, q):
    exp_term = np.exp(-(p + q) * t)
    return M * (1 - exp_term) / (1 + (q / p) * exp_term)

def bass_period_sales(t, M, p, q):
    exp_term = np.exp(-(p + q) * t)
    return M * (p + q)**2 * exp_term / p / (1 + (q / p) * exp_term)**2

# ── Fit Bass model to analog product historical sales ────────────────────────
np.random.seed(42)
t_hist  = np.arange(1, 25, dtype=float)
M_true, p_true, q_true = 5000, 0.025, 0.35
true_sales   = bass_period_sales(t_hist, M_true, p_true, q_true)
observed     = np.maximum(true_sales + np.random.normal(0, 80, len(t_hist)), 0)
cum_observed = np.cumsum(observed)

popt, pcov = curve_fit(
    bass_cumulative, t_hist, cum_observed,
    p0=[5000, 0.03, 0.3],
    bounds=([100, 0.001, 0.01], [1e6, 0.5, 2.0]),
    maxfev=10_000,
)
M_fit, p_fit, q_fit = popt
t_peak = np.log(q_fit / p_fit) / (p_fit + q_fit)

print(f"Fitted Bass parameters:")
print(f"  M = {M_fit:,.0f}  (true: {M_true:,})")
print(f"  p = {p_fit:.4f}  (true: {p_true})")
print(f"  q = {q_fit:.4f}  (true: {q_true})")
print(f"  Peak adoption period: {t_peak:.1f}")

# ── Forecast future periods ──────────────────────────────────────────────────
t_future = np.arange(25, 37, dtype=float)
fc = bass_period_sales(t_future, M_fit, p_fit, q_fit)
print(f"\\nForecast periods 25-36: {fc.round(0).astype(int)}")

# ── Analogical forecasting ────────────────────────────────────────────────────
analogs = {
    'Analog_A': bass_period_sales(np.arange(1, 25), 4500, 0.02, 0.40),
    'Analog_B': bass_period_sales(np.arange(1, 25), 5500, 0.03, 0.33),
    'Analog_C': bass_period_sales(np.arange(1, 25), 3000, 0.04, 0.30),
}
weights = {'Analog_A': 0.50, 'Analog_B': 0.30, 'Analog_C': 0.20}

# Index to base period (period 1)
indexed = {}
for name, arr in analogs.items():
    base = arr[0] if arr[0] > 0 else arr[arr > 0][0]
    indexed[name] = arr / base

# Weighted average index
avg_index = sum(indexed[n] * w for n, w in weights.items())

# Scale to new product's estimated market potential
SCALE = 300   # new product period-1 expectation
analog_fc = avg_index * SCALE
print(f"\\nAnalogical forecast (periods 1-16): {analog_fc[:16].round(0).astype(int)}")

# ── Bayesian update ───────────────────────────────────────────────────────────
def bayesian_update(prior_mu, prior_sigma, obs, noise_sigma):
    n = len(obs)
    obs_mean = np.mean(obs)
    post_var  = 1 / (1/prior_sigma**2 + n/noise_sigma**2)
    post_mean = post_var * (prior_mu/prior_sigma**2 + n*obs_mean/noise_sigma**2)
    return post_mean, np.sqrt(post_var)

prior_mu, prior_sigma = 5000, 1500
early_data = np.array([312, 289, 305, 278])   # 4 weeks of real sales
post_mu, post_sigma = bayesian_update(prior_mu, prior_sigma, early_data, noise_sigma=200)

print(f"\\nBayesian update after 4 weeks of sales:")
print(f"  Prior:     M ~ N({prior_mu:,}, {prior_sigma})")
print(f"  Posterior: M ~ N({post_mu:,.0f}, {post_sigma:,.0f})")
print(f"  90% CI:    [{post_mu - 1.645*post_sigma:,.0f}, {post_mu + 1.645*post_sigma:,.0f}]")
`}),e.jsx(N,{references:[{author:"Bass, F.M.",year:1969,title:"A new product growth model for consumer durables",journal:"Management Science",volume:"15(5)",pages:"215–227"},{author:"Kahn, K.B.",year:2006,title:"New Product Forecasting: An Applied Approach",publisher:"M.E. Sharpe"},{author:"Jiang, R., Bass, F.M., & Bass, P.I.",year:2006,title:"Virtual Bass model and the left-hand data-truncation bias in diffusion of innovation studies",journal:"International Journal of Research in Marketing",volume:"23(1)",pages:"93–106"}]})]})}const ke=Object.freeze(Object.defineProperty({__proto__:null,default:J},Symbol.toStringTag,{value:"Module"})),X=[{group:"Lag features",importance:.38},{group:"Rolling stats",importance:.24},{group:"Calendar",importance:.18},{group:"SKU attributes",importance:.12},{group:"Store attributes",importance:.08}],Y=[{skus:100,local_min:.2,global_min:1.2},{skus:1e3,local_min:2.1,global_min:1.4},{skus:1e4,local_min:21,global_min:1.8},{skus:1e5,local_min:210,global_min:4.2}];function ee(){const[s,r]=g.useState("lag");return e.jsxs(w,{title:"ML for SKU-Level Demand Forecasting",difficulty:"intermediate",readingTime:25,prerequisites:["LightGBM Basics","mlforecast Quickstart","Demand Patterns"],children:[e.jsx("p",{children:"Retailers and manufacturers must forecast demand for thousands to millions of individual SKUs across multiple locations — simultaneously, at weekly or daily granularity. No statistical method per series can scale to this challenge. Global ML models, particularly gradient boosted trees, have become the dominant approach at scale."}),e.jsx("h2",{children:"The Scale Challenge"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-indigo-50",children:[e.jsx("th",{className:"border border-gray-300 p-2",children:"Scale"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Example"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Viable Approach"})]})}),e.jsx("tbody",{children:[["~100 SKUs","Small D2C brand","statsforecast (one model per SKU)"],["~1,000 SKUs","Regional retailer","statsforecast or mlforecast (both viable)"],["~10,000 SKUs","National retailer","mlforecast with LightGBM (global)"],["~1M+ SKUs","Amazon, Walmart","Global LightGBM + custom infra"]].map(([a,i,o])=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:"border border-gray-300 p-2 font-semibold",children:a}),e.jsx("td",{className:"border border-gray-300 p-2",children:i}),e.jsx("td",{className:"border border-gray-300 p-2 text-gray-600",children:o})]},a))})]})}),e.jsx("h2",{children:"Global Model Architecture"}),e.jsxs(c,{title:"Global ML Model for Time Series",children:["A single model trained on the entire panel of (series, time) observations. Each row in the training dataset represents one (SKU, timestep) pair, with features derived from that series' history and the SKU's static attributes. The model learns a ",e.jsx("em",{children:"universal forecasting function"})," that generalizes across series."]}),e.jsx("p",{children:"Training dataset structure:"}),e.jsx("div",{className:"bg-gray-900 text-green-400 rounded p-3 font-mono text-xs my-3 overflow-x-auto",children:e.jsx("pre",{children:`| unique_id  | ds         | lag_1 | lag_7 | roll_7 | dow | category | y   |
|------------|------------|-------|-------|--------|-----|----------|-----|
| CA_1_001   | 2023-01-08 | 120   | 118   | 116.4  | 6   | grocery  | 125 |
| CA_1_001   | 2023-01-09 | 125   | 122   | 117.8  | 0   | grocery  | 108 |
| CA_1_002   | 2023-01-08 | 34    | 31    | 32.6   | 6   | beverage | 38  |
| TX_2_007   | 2023-01-08 | 0     | 2     | 1.4    | 6   | hardware | 0   |`})}),e.jsx("h2",{children:"Feature Engineering for SKU Forecasting"}),e.jsx("div",{className:"flex gap-2 flex-wrap my-4",children:[["lag","Lag Features"],["calendar","Calendar"],["sku","SKU Attrs"],["store","Store Attrs"]].map(([a,i])=>e.jsx("button",{onClick:()=>r(a),className:`px-3 py-1 rounded text-sm font-medium ${s===a?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:i},a))}),s==="lag"&&e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Lag Features"}),e.jsxs("ul",{className:"space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("code",{children:"lag_1"}),": last period demand (strongest signal)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"lag_2, lag_3"}),": short-term momentum"]}),e.jsxs("li",{children:[e.jsx("code",{children:"lag_7"}),": same day last week (weekly seasonality)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"lag_14, lag_28"}),": bi-weekly, monthly patterns"]}),e.jsxs("li",{children:[e.jsx("code",{children:"lag_364"}),": same day last year (annual seasonality)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"rolling_mean_7"}),": 7-day moving average of lag-1"]}),e.jsxs("li",{children:[e.jsx("code",{children:"rolling_std_7"}),": 7-day demand volatility"]}),e.jsxs("li",{children:[e.jsx("code",{children:"rolling_mean_28"}),": 28-day trend baseline"]})]})]}),s==="calendar"&&e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Calendar Features"}),e.jsxs("ul",{className:"space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("code",{children:"day_of_week"}),": 0–6, captures weekday pattern"]}),e.jsxs("li",{children:[e.jsx("code",{children:"week_of_year"}),": 1–52, seasonal effects"]}),e.jsxs("li",{children:[e.jsx("code",{children:"month"}),": 1–12"]}),e.jsxs("li",{children:[e.jsx("code",{children:"is_holiday"}),": binary, US/local holidays"]}),e.jsxs("li",{children:[e.jsx("code",{children:"days_to_holiday"}),": pre-holiday buying surge"]}),e.jsxs("li",{children:[e.jsx("code",{children:"days_from_holiday"}),": post-holiday dip"]}),e.jsxs("li",{children:["Fourier features: ",e.jsx("code",{children:"sin(2π·dow/7)"}),", ",e.jsx("code",{children:"cos(2π·dow/7)"})]})]})]}),s==="sku"&&e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"SKU-Level Static Features"}),e.jsxs("ul",{className:"space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("code",{children:"category"}),": product category (encoded)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"subcategory"}),": product subcategory"]}),e.jsxs("li",{children:[e.jsx("code",{children:"price"}),": current unit price"]}),e.jsxs("li",{children:[e.jsx("code",{children:"price_change"}),": price vs. 4-week average"]}),e.jsxs("li",{children:[e.jsx("code",{children:"is_on_promo"}),": promotional flag"]}),e.jsxs("li",{children:[e.jsx("code",{children:"weight_kg"}),": physical dimension"]}),e.jsxs("li",{children:[e.jsx("code",{children:"days_since_launch"}),": product maturity"]}),e.jsxs("li",{children:[e.jsx("code",{children:"abc_class"}),": A/B/C classification"]})]})]}),s==="store"&&e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Store/Location Static Features"}),e.jsxs("ul",{className:"space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("code",{children:"store_type"}),": hypermarket, convenience, etc."]}),e.jsxs("li",{children:[e.jsx("code",{children:"region"}),": geographic region"]}),e.jsxs("li",{children:[e.jsx("code",{children:"store_size_sqft"}),": physical size"]}),e.jsxs("li",{children:[e.jsx("code",{children:"avg_basket_size"}),": store-level metric"]}),e.jsxs("li",{children:[e.jsx("code",{children:"local_competition"}),": number of nearby competitors"]}),e.jsxs("li",{children:[e.jsx("code",{children:"population_density"}),": catchment area"]})]})]}),e.jsx("h2",{children:"Feature Importance by Category"}),e.jsx(v,{width:"100%",height:220,children:e.jsxs(I,{data:X,layout:"vertical",children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(j,{type:"number",tickFormatter:a=>`${(a*100).toFixed(0)}%`}),e.jsx(y,{type:"category",dataKey:"group",width:110,tick:{fontSize:12}}),e.jsx(S,{formatter:a=>`${(a*100).toFixed(1)}%`}),e.jsx(A,{dataKey:"importance",fill:"#6366f1",name:"Importance (gain)"})]})}),e.jsx("h2",{children:"Complete mlforecast Pipeline for 1000+ SKUs"}),e.jsx(p,{code:`import pandas as pd
import numpy as np
from mlforecast import MLForecast
from mlforecast.target_transforms import LocalStandardScaler
from window_ops.rolling import rolling_mean, rolling_std, rolling_max
import lightgbm as lgb

# ── 1. Generate 1,000 SKU x 2 years daily data ────────────────────────
np.random.seed(0)
n_skus = 1000
n_days = 730

stores = ['CA_1', 'CA_2', 'TX_1', 'TX_2', 'FL_1']
categories = ['Grocery', 'Beverages', 'Dairy', 'Bakery', 'Produce']

records = []
for i in range(n_skus):
    uid = f'STORE_{np.random.choice(stores)}_SKU_{i:04d}'
    cat = np.random.choice(categories)
    base = np.random.lognormal(3, 0.8)
    dates = pd.date_range('2022-01-01', periods=n_days, freq='D')
    dow_effect = np.array([0.9, 0.85, 0.9, 0.95, 1.0, 1.3, 1.1])
    seasonal = np.array([dow_effect[d.weekday()] for d in dates])
    trend = np.linspace(1.0, 1.15, n_days)
    noise = np.random.normal(0, 0.1, n_days)
    demand = np.maximum(0, base * trend * seasonal * (1 + noise)).round(0)
    for d, v in zip(dates, demand):
        records.append({'unique_id': uid, 'ds': d, 'y': v, 'category': cat})

df = pd.DataFrame(records)
print(f"Dataset: {len(df):,} rows, {df['unique_id'].nunique():,} series")`}),e.jsx(p,{code:`# ── 2. Static SKU features ────────────────────────────────────────────
static_features = (
    df.groupby('unique_id')['category']
    .first()
    .reset_index()
    .rename(columns={'category': 'category'})
)
# LightGBM handles categoricals natively
static_features['category'] = pd.Categorical(static_features['category'])

# ── 3. Define MLForecast ───────────────────────────────────────────────
lgbm = lgb.LGBMRegressor(
    n_estimators=1000,
    learning_rate=0.03,
    num_leaves=127,
    min_child_samples=30,
    subsample=0.8,
    colsample_bytree=0.8,
    early_stopping_rounds=50,
    random_state=42,
    verbosity=-1,
)

mlf = MLForecast(
    models=[lgbm],
    freq='D',
    lags=[1, 2, 3, 7, 14, 28, 56, 364],
    lag_transforms={
        1: [
            (rolling_mean, 7),
            (rolling_std, 7),
            (rolling_mean, 28),
            (rolling_max, 7),
        ],
        7: [(rolling_mean, 28)],
    },
    date_features=['dayofweek', 'week', 'month', 'year'],
    target_transforms=[LocalStandardScaler()],  # normalize per series
    num_threads=8,
)`}),e.jsx(p,{code:`# ── 4. Fit ────────────────────────────────────────────────────────────
# Use last 2 weeks as validation for early stopping
train = df[df['ds'] < '2023-12-18']
val   = df[df['ds'] >= '2023-12-18']

mlf.fit(
    train,
    static_features=['category'],
    id_col='unique_id',
    time_col='ds',
    target_col='y',
)

# ── 5. Forecast ───────────────────────────────────────────────────────
horizon = 28  # 4 weeks ahead
forecasts = mlf.predict(h=horizon)
forecasts['y_pred'] = forecasts['LGBMRegressor'].clip(lower=0)  # no negative demand
print(f"Forecast rows: {len(forecasts):,}")
print(forecasts.head())`}),e.jsx(p,{code:`# ── 6. Cross-validation backtesting ──────────────────────────────────
cv = mlf.cross_validation(
    df=df,
    h=28,
    n_windows=4,
    step_size=28,
    refit=False,       # use single trained model (faster)
)

# Evaluate per SKU and aggregate
cv['error'] = cv['y'] - cv['LGBMRegressor']
cv['ae'] = cv['error'].abs()
cv['ape'] = cv['ae'] / cv['y'].replace(0, np.nan)

print("Overall MAE:", cv['ae'].mean().round(2))
print("Overall SMAPE:", (2 * cv['ae'] / (cv['y'].abs() + cv['LGBMRegressor'].abs())).mean().round(4))

# Per-horizon accuracy
cv['horizon_step'] = cv.groupby(['unique_id', 'cutoff']).cumcount() + 1
horizon_accuracy = cv.groupby('horizon_step')['ae'].mean()
print("\\nMAE by forecast horizon:")
print(horizon_accuracy.round(2))`}),e.jsx("h2",{children:"Cold-Start: Forecasting New SKUs"}),e.jsx("p",{children:"New SKUs have no historical demand. Strategies in order of preference:"}),e.jsxs("ol",{className:"list-decimal pl-6 my-3 space-y-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Similar SKU transfer"}),": find nearest neighbor by attributes (category, price, store) and use their demand profile."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Category/store median"}),": forecast using the median demand of the category in that store."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Attributes-only model"}),": train a separate model predicting first-week demand from static features only (price, category, store type, promotional budget)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bayesian prior"}),": set an informative prior based on product attributes and update as observations arrive."]})]}),e.jsx(p,{code:`# ── Cold-start with attributes-only model ─────────────────────────────
from sklearn.ensemble import GradientBoostingRegressor

# Build training set: first-week demand for existing SKUs
first_week = (
    df[df['ds'] <= df.groupby('unique_id')['ds'].transform('min') + pd.Timedelta('6D')]
    .groupby('unique_id')['y']
    .sum()
    .reset_index()
    .rename(columns={'y': 'first_week_demand'})
)
cold_start_df = first_week.merge(static_features, on='unique_id')
cold_start_df['category_encoded'] = pd.Categorical(cold_start_df['category']).codes

X_cold = cold_start_df[['category_encoded']]
y_cold = np.log1p(cold_start_df['first_week_demand'])

cold_model = GradientBoostingRegressor(n_estimators=200, max_depth=4, random_state=42)
cold_model.fit(X_cold, y_cold)

# Predict for brand new SKU
new_sku_attrs = pd.DataFrame({'category_encoded': [2]})  # e.g., 'Dairy'
first_week_pred = np.expm1(cold_model.predict(new_sku_attrs)[0])
print(f"Cold-start first-week forecast: {first_week_pred:.1f} units")`}),e.jsxs(C,{children:["Log transform for SKU demand is usually beneficial. Demand distributions are right-skewed (many low sellers, few high sellers). A log transform makes the target more symmetric, helping gradient boosted trees split more effectively. Use ",e.jsx("code",{children:"np.log1p(y)"})," (adds 1 before log) to handle zeros safely, and",e.jsx("code",{children:"np.expm1(pred)"})," to back-transform."]}),e.jsx("h2",{children:"Training Time vs Scale"}),e.jsx(v,{width:"100%",height:220,children:e.jsxs(I,{data:Y,children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(j,{dataKey:"skus",tickFormatter:a=>a>=1e3?`${a/1e3}k`:a}),e.jsx(y,{label:{value:"Minutes",angle:-90,position:"insideLeft"}}),e.jsx(S,{formatter:a=>`${a} min`}),e.jsx(F,{}),e.jsx(A,{dataKey:"local_min",fill:"#ef4444",name:"Local (one model/SKU)"}),e.jsx(A,{dataKey:"global_min",fill:"#22c55e",name:"Global LightGBM"})]})}),e.jsx("p",{className:"text-xs text-center text-gray-500 mt-1",children:"Global models scale sub-linearly with number of SKUs; local models scale linearly."}),e.jsx(M,{children:"A global model assumes demand patterns are similar across series. If you mix very different series (e.g., perishable food + industrial equipment), train separate models by product segment or include rich static features so the model can distinguish them."}),e.jsx(N,{references:[{authors:"Bandara, K., Bergmeir, C., Smyl, S.",year:2020,title:"Forecasting across time series databases using recurrent neural networks on groups of similar series",journal:"Expert Systems with Applications",volume:"140",pages:"112896"},{authors:"Januschowski, T. et al.",year:2020,title:"Criteria for classifying forecasting methods",journal:"International Journal of Forecasting",volume:"36(1)",pages:"167–177"}]})]})}const we=Object.freeze(Object.defineProperty({__proto__:null,default:ee},Symbol.toStringTag,{value:"Module"})),K=[{csl:"90%",z:1.28},{csl:"92%",z:1.41},{csl:"95%",z:1.64},{csl:"97.5%",z:1.96},{csl:"99%",z:2.33},{csl:"99.9%",z:3.09}];function te(){const[s,r]=g.useState(95),[a,i]=g.useState(7),[o,h]=g.useState(20),[n,f]=g.useState(100),[d,m]=g.useState(2),_=s>=99.9?3.09:s>=99?2.33:s>=97.5?1.96:s>=95?1.64:s>=92?1.41:1.28,l=Math.sqrt(a*o*o+n*n*d*d),x=Math.round(_*l),E=Math.round(n*a+x),D=[90,92,95,97.5,99,99.9].map(u=>{const P=u>=99.9?3.09:u>=99?2.33:u>=97.5?1.96:u>=95?1.64:u>=92?1.41:1.28;return{csl:`${u}%`,ss:Math.round(P*l)}});return e.jsxs(w,{title:"Safety Stock Calculation",difficulty:"intermediate",readingTime:30,prerequisites:["Demand Patterns","Statistical Distributions","Inventory Basics"],children:[e.jsxs("p",{children:["Safety stock is the buffer inventory held to protect against two sources of uncertainty: ",e.jsx("strong",{children:"demand variability"})," (demand may be higher than forecast) and ",e.jsx("strong",{children:"lead time variability"})," (replenishment may arrive later than expected). Setting safety stock too low causes stockouts and lost sales; too high wastes capital and warehouse space."]}),e.jsx("h2",{children:"The Core Formula"}),e.jsx("p",{children:"Safety stock depends on the demand variability over the lead time. When both demand and lead time are variable:"}),e.jsx(t.BlockMath,{math:"SS = z \\cdot \\sigma_L"}),e.jsx("p",{children:"where the combined lead-time demand standard deviation is:"}),e.jsx(t.BlockMath,{math:"\\sigma_L = \\sqrt{LT \\cdot \\sigma_d^2 + \\bar{d}^2 \\cdot \\sigma_{LT}^2}"}),e.jsxs("ul",{className:"list-disc pl-6 my-3 space-y-1",children:[e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"z"}),": safety factor (z-score for desired service level)"]}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"LT"}),": average lead time (in periods)"]}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"\\sigma_d"}),": standard deviation of period demand"]}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"\\bar{d}"}),": average period demand"]}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"\\sigma_{LT}"}),": standard deviation of lead time"]})]}),e.jsxs(C,{children:["When lead time is constant (",e.jsx(t.InlineMath,{math:"\\sigma_{LT} = 0"}),"), the formula simplifies to ",e.jsx(t.InlineMath,{math:"SS = z \\cdot \\sigma_d \\cdot \\sqrt{LT}"}),". This is the version most commonly cited in textbooks, but real supply chains always have some lead time variability."]}),e.jsx("h2",{children:"Service Level to z-Factor Mapping"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm border-collapse text-center",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-indigo-50",children:[e.jsx("th",{className:"border border-gray-300 p-2",children:"Cycle Service Level"}),K.map(({csl:u})=>e.jsx("th",{className:"border border-gray-300 p-2",children:u},u))]})}),e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsx("td",{className:"border border-gray-300 p-2 font-semibold text-left",children:"z-factor"}),K.map(({z:u,csl:P})=>e.jsx("td",{className:"border border-gray-300 p-2 font-mono",children:u},P))]})})]})}),e.jsx("h2",{children:"CSL vs Fill Rate"}),e.jsxs(c,{title:"Cycle Service Level (CSL)",children:["The probability of ",e.jsx("em",{children:"not"})," stocking out during a replenishment cycle. A 95% CSL means 95% of order cycles have no stockout. Easy to compute but ignores the ",e.jsx("em",{children:"magnitude"})," of the stockout — a cycle where you're short by 1 unit counts the same as one where you're short by 1,000."]}),e.jsxs(c,{title:"Fill Rate (FR)",children:["The fraction of demand met immediately from on-hand stock.",e.jsx(t.BlockMath,{math:"FR = 1 - \\frac{E[\\text{units short per cycle}]}{\\bar{d} \\cdot LT}"}),"Fill rate is more practically meaningful for businesses. A 98% fill rate means 98% of ordered units are shipped on time. Achieving a given fill rate requires less safety stock than achieving the equivalent CSL."]}),e.jsx("h2",{children:"Interactive Safety Stock Calculator"}),e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4 my-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Cycle Service Level: ",s,"%"]}),e.jsx("input",{type:"range",min:"90",max:"99.9",step:"0.5",value:s,onChange:u=>r(parseFloat(u.target.value)),className:"w-full mt-1"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Avg Lead Time (days): ",a]}),e.jsx("input",{type:"range",min:"1",max:"30",step:"1",value:a,onChange:u=>i(parseInt(u.target.value)),className:"w-full mt-1"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Daily Demand Mean: ",n]}),e.jsx("input",{type:"range",min:"10",max:"500",step:"10",value:n,onChange:u=>f(parseInt(u.target.value)),className:"w-full mt-1"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Daily Demand Std Dev: ",o]}),e.jsx("input",{type:"range",min:"1",max:"100",step:"1",value:o,onChange:u=>h(parseInt(u.target.value)),className:"w-full mt-1"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Lead Time Std Dev (days): ",d]}),e.jsx("input",{type:"range",min:"0",max:"10",step:"0.5",value:d,onChange:u=>m(parseFloat(u.target.value)),className:"w-full mt-1"})]})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-3",children:[e.jsxs("div",{className:"bg-white rounded-lg p-3 text-center",children:[e.jsx("div",{className:"text-gray-500 text-sm",children:"z-factor"}),e.jsx("div",{className:"text-2xl font-bold text-indigo-600",children:_.toFixed(2)})]}),e.jsxs("div",{className:"bg-white rounded-lg p-3 text-center",children:[e.jsx("div",{className:"text-gray-500 text-sm",children:"Safety Stock"}),e.jsxs("div",{className:"text-2xl font-bold text-green-600",children:[x," units"]})]}),e.jsxs("div",{className:"bg-white rounded-lg p-3 text-center",children:[e.jsx("div",{className:"text-gray-500 text-sm",children:"Reorder Point"}),e.jsxs("div",{className:"text-2xl font-bold text-orange-600",children:[E," units"]})]})]})]}),e.jsx("h2",{children:"Safety Stock vs. Service Level"}),e.jsx(v,{width:"100%",height:220,children:e.jsxs(I,{data:D,children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(j,{dataKey:"csl"}),e.jsx(y,{label:{value:"Safety Stock (units)",angle:-90,position:"insideLeft"}}),e.jsx(S,{}),e.jsx(A,{dataKey:"ss",fill:"#6366f1",name:"Safety Stock"})]})}),e.jsx("p",{className:"text-xs text-center text-gray-500 mt-1",children:"Safety stock increases non-linearly with service level — the last few percent of service level are very expensive."}),e.jsx("h2",{children:"Impact of Forecast Accuracy on Safety Stock"}),e.jsx("p",{children:"The key insight: safety stock is a function of demand variability, not just average demand. A more accurate forecast reduces the standard deviation of the forecast error, which directly reduces required safety stock."}),e.jsx(t.BlockMath,{math:"SS \\propto \\sigma_{\\text{forecast error}} \\cdot \\sqrt{LT + RT}"}),e.jsx("p",{children:"where RT is the review period (time between order decisions). If a machine learning model reduces forecast error standard deviation from 30 to 20 units, safety stock drops by 33% — a direct working capital saving."}),e.jsx(B,{title:"Working Capital Impact",children:"Assume: 1,000 SKUs, average unit cost $50, average safety stock 100 units/SKU at 95% CSL. Total safety stock value = $5M. Improving forecast accuracy by 20% across all SKUs reduces safety stock by ~20%, saving $1M in tied-up capital. Carrying cost at 25% per year = $250K annual saving from improved forecasting."}),e.jsx("h2",{children:"Python: Safety Stock for Multiple SKUs"}),e.jsx(p,{code:`import pandas as pd
import numpy as np
from scipy import stats

# ── Sample inventory data ─────────────────────────────────────────────
np.random.seed(42)
n_skus = 500

sku_data = pd.DataFrame({
    'sku_id': [f'SKU_{i:04d}' for i in range(n_skus)],
    'avg_daily_demand': np.random.lognormal(3, 1, n_skus).round(1),
    'std_daily_demand': np.random.lognormal(2, 0.8, n_skus).round(1),
    'avg_lead_time_days': np.random.uniform(3, 21, n_skus).round(1),
    'std_lead_time_days': np.random.uniform(0, 5, n_skus).round(1),
    'unit_cost': np.random.lognormal(3, 1.5, n_skus).round(2),
    'target_csl': np.random.choice([0.90, 0.95, 0.99], n_skus,
                                    p=[0.3, 0.5, 0.2]),  # ABC-driven
})`}),e.jsx(p,{code:`# ── Calculate safety stock ────────────────────────────────────────────
def calculate_safety_stock(row):
    z = stats.norm.ppf(row['target_csl'])
    lt = row['avg_lead_time_days']
    sigma_d = row['std_daily_demand']
    d_bar = row['avg_daily_demand']
    sigma_lt = row['std_lead_time_days']
    # Combined lead-time demand std
    sigma_L = np.sqrt(lt * sigma_d**2 + d_bar**2 * sigma_lt**2)
    ss = z * sigma_L
    rop = d_bar * lt + ss
    return pd.Series({'z': z, 'sigma_L': sigma_L, 'safety_stock': ss, 'reorder_point': rop})

results = sku_data.apply(calculate_safety_stock, axis=1)
sku_data = pd.concat([sku_data, results], axis=1)
sku_data['safety_stock'] = sku_data['safety_stock'].clip(lower=0).round(0)
sku_data['ss_value'] = sku_data['safety_stock'] * sku_data['unit_cost']

print(sku_data[['sku_id', 'avg_daily_demand', 'safety_stock', 'reorder_point', 'ss_value']].head(10))`}),e.jsx(p,{code:`# ── Summary by service level ──────────────────────────────────────────
summary = sku_data.groupby('target_csl').agg(
    n_skus=('sku_id', 'count'),
    avg_ss=('safety_stock', 'mean'),
    total_ss_value=('ss_value', 'sum'),
).round(0)
print(summary)
#             n_skus  avg_ss  total_ss_value
# target_csl
# 0.90           150    82.0        820000.0
# 0.95           250   128.0       2560000.0
# 0.99           100   212.0       1060000.0

# ── Identify over-stocked SKUs ────────────────────────────────────────
sku_data['days_of_cover'] = sku_data['safety_stock'] / sku_data['avg_daily_demand']
overstocked = sku_data[sku_data['days_of_cover'] > 30].sort_values('ss_value', ascending=False)
print(f"Potentially over-stocked SKUs: {len(overstocked)}")
print(f"Excess SS value: \${overstocked['ss_value'].sum():,.0f}")`}),e.jsxs(T,{title:"The Square Root Law for Safety Stock",children:["When consolidating inventory across multiple locations (e.g., 4 warehouses into 1 central DC), safety stock does not decrease proportionally. Under independent demand:",e.jsx(t.BlockMath,{math:"SS_{\\text{central}} = \\frac{1}{\\sqrt{n}} \\cdot SS_{\\text{total decentralized}}"}),"Consolidating 4 warehouses into 1 reduces safety stock by ",e.jsx(t.InlineMath,{math:"1 - 1/\\sqrt{4} = 50\\%"}),'. This is the "risk pooling" effect and is the primary quantitative justification for centralized distribution.']}),e.jsx(M,{children:"The standard safety stock formula assumes demand is normally distributed. Highly skewed or intermittent demand violates this assumption. For those SKUs, use a parametric distribution (Poisson, Negative Binomial) or simulation-based approach to compute safety stock from empirical demand quantiles."}),e.jsx(N,{references:[{authors:"Silver, E.A., Pyke, D.F., Thomas, D.J.",year:2016,title:"Inventory and Production Management in Supply Chains (4th ed.)",journal:"CRC Press"},{authors:"Chopra, S., Meindl, P.",year:2021,title:"Supply Chain Management: Strategy, Planning, and Operation (7th ed.)",journal:"Pearson"}]})]})}const Me=Object.freeze(Object.defineProperty({__proto__:null,default:te},Symbol.toStringTag,{value:"Module"}));function se(){const[s,r]=g.useState(1e3),[a,i]=g.useState(50),[o,h]=g.useState(2),n=Math.sqrt(2*s*a/o),f=s/n*a,d=n/2*o,m=f+d,_=[];for(let l=50;l<=Math.min(n*3,2e3);l+=20){const x=s/l*a,E=l/2*o;_.push({q:Math.round(l),ordering:Math.round(x),holding:Math.round(E),total:Math.round(x+E)})}return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"EOQ Cost Curve — Interactive"}),e.jsxs("div",{className:"grid grid-cols-3 gap-3 mb-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium",children:["Annual Demand D: ",e.jsx("b",{children:s})]}),e.jsx("input",{type:"range",min:"100",max:"5000",step:"100",value:s,onChange:l=>r(+l.target.value),className:"w-full mt-1"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium",children:["Order Cost S: ",e.jsxs("b",{children:["$",a]})]}),e.jsx("input",{type:"range",min:"10",max:"300",step:"10",value:a,onChange:l=>i(+l.target.value),className:"w-full mt-1"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium",children:["Holding Cost H: ",e.jsxs("b",{children:["$",o,"/unit/yr"]})]}),e.jsx("input",{type:"range",min:"0.5",max:"10",step:"0.5",value:o,onChange:l=>h(+l.target.value),className:"w-full mt-1"})]})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-3 mb-4 text-center text-sm",children:[e.jsxs("div",{className:"bg-blue-50 rounded p-2",children:[e.jsx("div",{className:"text-gray-500",children:"EOQ"}),e.jsxs("div",{className:"text-xl font-bold text-blue-600",children:[n.toFixed(0)," units"]})]}),e.jsxs("div",{className:"bg-green-50 rounded p-2",children:[e.jsx("div",{className:"text-gray-500",children:"Order Freq"}),e.jsxs("div",{className:"text-xl font-bold text-green-600",children:[(s/n).toFixed(1),"×/yr"]})]}),e.jsxs("div",{className:"bg-orange-50 rounded p-2",children:[e.jsx("div",{className:"text-gray-500",children:"Total Cost"}),e.jsxs("div",{className:"text-xl font-bold text-orange-600",children:["$",m.toFixed(0),"/yr"]})]})]}),e.jsx(v,{width:"100%",height:230,children:e.jsxs(z,{data:_,margin:{top:5,right:20,bottom:20,left:10},children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(j,{dataKey:"q",label:{value:"Order Quantity Q",position:"insideBottom",offset:-10}}),e.jsx(y,{label:{value:"Annual Cost ($)",angle:-90,position:"insideLeft"}}),e.jsx(S,{}),e.jsx(F,{verticalAlign:"top"}),e.jsx(q,{x:Math.round(n),stroke:"#9333ea",strokeDasharray:"4 2",label:{value:"EOQ",position:"top",fill:"#9333ea"}}),e.jsx(k,{dataKey:"ordering",stroke:"#3b82f6",strokeWidth:2,dot:!1,name:"Ordering Cost"}),e.jsx(k,{dataKey:"holding",stroke:"#f59e0b",strokeWidth:2,dot:!1,name:"Holding Cost"}),e.jsx(k,{dataKey:"total",stroke:"#22c55e",strokeWidth:2,dot:!1,name:"Total Cost"})]})})]})}function ae(){return e.jsxs(w,{title:"EOQ and Reorder Point Models",subject:"Supply Chain Forecasting",difficulty:"intermediate",readingTime:12,children:[e.jsx("p",{children:"The Economic Order Quantity (EOQ) model and the Reorder Point (ROP) model are the foundation of classical inventory management. Although real supply chains have complications that violate EOQ assumptions, these models provide critical intuition about the cost tradeoffs in inventory, and modern systems still use them as base-case benchmarks and as building blocks for more sophisticated approaches."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Economic Order Quantity"}),e.jsxs(c,{title:"EOQ Model Assumptions",children:["The basic EOQ model assumes:",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsx("li",{children:"Demand rate D is constant and continuous (units per year)"}),e.jsx("li",{children:"Order cost S is fixed per order, independent of quantity"}),e.jsx("li",{children:"Holding cost H is proportional to inventory level (per unit per year)"}),e.jsx("li",{children:"Lead time is zero (instantaneous replenishment) — relaxed in ROP"}),e.jsx("li",{children:"No stockouts allowed"})]})]}),e.jsxs(T,{title:"EOQ Formula",children:["Total annual cost under a constant order quantity Q:",e.jsx(t.BlockMath,{math:"TC(Q) = \\underbrace{\\frac{D}{Q} \\cdot S}_{\\text{ordering}} + \\underbrace{\\frac{Q}{2} \\cdot H}_{\\text{holding}}"}),"Minimizing over Q gives the Economic Order Quantity:",e.jsx(t.BlockMath,{math:"Q^* = \\sqrt{\\frac{2DS}{H}}"}),"At the optimum, ordering cost equals holding cost. The minimum total annual cost is:",e.jsx(t.BlockMath,{math:"TC(Q^*) = \\sqrt{2DSH}"})]}),e.jsx(se,{}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Reorder Point (ROP)"}),e.jsxs("p",{children:["EOQ tells us ",e.jsx("em",{children:"how much"})," to order. The Reorder Point answers ",e.jsx("em",{children:"when"})," to order: when inventory level drops to the ROP, place a new order of size Q*. The ROP must cover expected demand during lead time plus a safety buffer."]}),e.jsxs(c,{title:"Reorder Point Formula",children:[e.jsx(t.BlockMath,{math:"\\text{ROP} = \\bar{d} \\cdot L + z_\\alpha \\cdot \\sigma_d \\sqrt{L}"}),"where ",e.jsx(t.InlineMath,{math:"\\bar{d}"})," is average daily demand, ",e.jsx(t.InlineMath,{math:"L"})," is lead time in days, ",e.jsx(t.InlineMath,{math:"z_\\alpha"})," is the safety factor for target service level",e.jsx(t.InlineMath,{math:"\\alpha"}),", and ",e.jsx(t.InlineMath,{math:"\\sigma_d"})," is the standard deviation of daily demand. The term ",e.jsx(t.InlineMath,{math:"z_\\alpha \\sigma_d \\sqrt{L}"})," is the safety stock."]}),e.jsxs(B,{title:"ROP Calculation for a Widget",children:["A manufacturer orders widgets with daily demand ~ N(50, 8²). Lead time is 5 days. Target cycle service level is 95% (z = 1.645).",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsx("li",{children:"Expected demand during lead time: 50 × 5 = 250 units"}),e.jsx("li",{children:"Safety stock: 1.645 × 8 × √5 = 29.4 ≈ 30 units"}),e.jsx("li",{children:"ROP = 250 + 30 = 280 units"})]}),"Place a new order when inventory hits 280. With EOQ = 200 (say), expected inventory oscillates between 280 (trigger) and 280 + 200 = 480 units."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Continuous vs Periodic Review"}),e.jsx("p",{children:"There are two fundamental review policies:"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-2 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"(s, Q) Continuous Review"}),": Monitor inventory continuously. Order Q* units whenever inventory hits reorder point s = ROP. Requires real-time tracking but minimizes safety stock."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"(R, S) Periodic Review"}),": Review inventory every R periods. Order up to level S (the order-up-to or base-stock level). Simpler to implement but requires more safety stock to cover demand during the review period plus lead time."]})]}),e.jsxs(c,{title:"Order-Up-To Level (S)",children:["In periodic review with cycle R and lead time L:",e.jsx(t.BlockMath,{math:"S = \\bar{d}(R + L) + z_\\alpha \\sigma_d \\sqrt{R + L}"}),"The order quantity each review period is ",e.jsx(t.InlineMath,{math:"S - \\text{current inventory}"}),". The safety stock covers demand over the review period plus lead time (R + L), not just the lead time."]}),e.jsx(C,{children:`EOQ robustness: the total cost curve is relatively flat near the optimum. Ordering 50% more or less than EOQ typically increases total cost by only ~6–12%. This "EOQ cost plateau" means that in practice, rounding to convenient lot sizes (full pallets, container loads) has minimal cost impact. Focus your optimization energy on the holding cost rate H — it's often underestimated, as it should include capital cost, warehouse space, obsolescence risk, and insurance.`}),e.jsx(M,{children:"The EOQ formula assumes deterministic, constant demand. In practice, demand fluctuates and the ROP formula assumes normally distributed demand during lead time. For intermittent demand SKUs, use the newsvendor model or bootstrapping instead. Also note: EOQ does not account for order batching, quantity discounts, or capacity constraints — extensions exist for each."}),e.jsx(p,{title:"EOQ Calculator and Inventory Simulation",code:`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import norm

# ── EOQ and ROP calculation ────────────────────────────────────────────────────
def eoq(D: float, S: float, H: float) -> float:
    """Economic Order Quantity."""
    return np.sqrt(2 * D * S / H)

def rop(d_avg: float, lead_time: int, sigma_d: float, service_level: float = 0.95) -> tuple:
    """Reorder point and safety stock for given cycle service level."""
    z = norm.ppf(service_level)
    safety_stock = z * sigma_d * np.sqrt(lead_time)
    return d_avg * lead_time + safety_stock, safety_stock

# ── Example SKU parameters ────────────────────────────────────────────────────
D        = 5200      # annual demand (units/year)
S        = 45.0      # order placement cost ($)
H        = 3.5       # holding cost ($/unit/year)
d_daily  = D / 365  # daily demand rate
sigma_d  = 4.0       # daily demand std dev
L        = 7         # lead time (days)
csl      = 0.97      # cycle service level

Q_star  = eoq(D, S, H)
rp, ss  = rop(d_daily, L, sigma_d, csl)
cycle_time = Q_star / d_daily  # days between orders

print(f"=== Inventory Policy ===")
print(f"  EOQ (Q*):          {Q_star:.0f} units")
print(f"  Orders/year:       {D/Q_star:.1f}")
print(f"  Cycle time:        {cycle_time:.0f} days")
print(f"  Safety stock:      {ss:.0f} units")
print(f"  Reorder point:     {rp:.0f} units")
print(f"  Min total cost:    \${np.sqrt(2*D*S*H):.2f}/year")

# ── Inventory simulation: (s, Q) policy ──────────────────────────────────────
np.random.seed(42)
T        = 365                   # simulation days
inventory = rp + Q_star          # start full
on_order  = 0
order_due = None

inv_trace  = []
orders     = []
stockouts  = 0

for t in range(T):
    # Receive order if due
    if order_due == t:
        inventory += Q_star
        on_order   = 0
        order_due  = None

    # Realize demand
    d = max(0, np.random.normal(d_daily, sigma_d))
    stockout = max(0, d - inventory)
    stockouts += stockout
    inventory  = max(0, inventory - d)

    # Check reorder point
    if inventory + on_order <= rp and on_order == 0:
        on_order  = Q_star
        order_due = t + L
        orders.append(t)

    inv_trace.append(inventory)

inv_arr = np.array(inv_trace)
print(f"\\n=== Simulation Results (365 days) ===")
print(f"  Avg inventory:  {inv_arr.mean():.1f} units")
print(f"  Stockouts:      {stockouts:.0f} units ({stockouts/D*100:.1f}% of demand)")
print(f"  Orders placed:  {len(orders)}")
print(f"  CSL achieved:   {1 - (inv_arr == 0).mean():.3f}")

# ── Period review: (R, S) policy ─────────────────────────────────────────────
R  = 7          # review every 7 days
S_oup = d_daily * (R + L) + norm.ppf(csl) * sigma_d * np.sqrt(R + L)
print(f"\\n(R={R}, S) policy:")
print(f"  Order-up-to level S = {S_oup:.0f}")
print(f"  Safety stock = {norm.ppf(csl) * sigma_d * np.sqrt(R + L):.0f}")
print(f"  (Extra safety vs continuous review: "
      f"{norm.ppf(csl) * sigma_d * (np.sqrt(R+L) - np.sqrt(L)):.0f} units)")
`}),e.jsx(N,{references:[{author:"Harris, F.W.",year:1913,title:"How many parts to make at once",journal:"Factory, The Magazine of Management",volume:"10(2)",pages:"135–136"},{author:"Silver, E.A., Pyke, D.F., & Thomas, D.J.",year:2017,title:"Inventory and Production Management in Supply Chains (4th ed.)",publisher:"CRC Press"},{author:"Zipkin, P.H.",year:2e3,title:"Foundations of Inventory Management",publisher:"McGraw-Hill"}]})]})}const Ne=Object.freeze(Object.defineProperty({__proto__:null,default:ae},Symbol.toStringTag,{value:"Module"}));function re(){const[s,r]=g.useState(20),[a,i]=g.useState(5),o=100,h=20,n=s/(s+a),f=o+h*(Math.sqrt(2)*ie(2*n-1)),d=[];for(let m=40;m<=180;m+=4){const _=de(m,o,h,s,a);d.push({q:m,profit:Math.round(_)})}return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Newsvendor Model — Expected Profit"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 mb-3",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium",children:["Underage cost c_u: ",e.jsxs("b",{children:["$",s,"/unit"]})]}),e.jsx("input",{type:"range",min:"5",max:"50",step:"5",value:s,onChange:m=>r(+m.target.value),className:"w-full mt-1"}),e.jsx("p",{className:"text-xs text-gray-500",children:"Lost margin per unit of unmet demand"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"text-sm font-medium",children:["Overage cost c_o: ",e.jsxs("b",{children:["$",a,"/unit"]})]}),e.jsx("input",{type:"range",min:"1",max:"30",step:"1",value:a,onChange:m=>i(+m.target.value),className:"w-full mt-1"}),e.jsx("p",{className:"text-xs text-gray-500",children:"Loss per unit of unsold inventory"})]})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-2 mb-3 text-center text-sm",children:[e.jsxs("div",{className:"bg-blue-50 rounded p-2",children:[e.jsx("div",{className:"text-gray-500",children:"Critical Ratio"}),e.jsx("div",{className:"font-bold text-blue-600",children:n.toFixed(3)})]}),e.jsxs("div",{className:"bg-green-50 rounded p-2",children:[e.jsx("div",{className:"text-gray-500",children:"Optimal Q*"}),e.jsxs("div",{className:"font-bold text-green-600",children:[Math.round(f)," units"]})]}),e.jsxs("div",{className:"bg-purple-50 rounded p-2",children:[e.jsx("div",{className:"text-gray-500",children:"Implied CSL"}),e.jsxs("div",{className:"font-bold text-purple-600",children:[(n*100).toFixed(0),"%"]})]})]}),e.jsx(v,{width:"100%",height:220,children:e.jsxs(z,{data:d,margin:{top:5,right:20,bottom:20,left:10},children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(j,{dataKey:"q",label:{value:"Order Quantity Q",position:"insideBottom",offset:-10}}),e.jsx(y,{label:{value:"Expected Profit ($)",angle:-90,position:"insideLeft"}}),e.jsx(S,{}),e.jsx(q,{x:Math.round(f),stroke:"#9333ea",strokeDasharray:"4 2",label:{value:"Q*",position:"top",fill:"#9333ea"}}),e.jsx(k,{dataKey:"profit",stroke:"#22c55e",strokeWidth:2,dot:!1,name:"Expected Profit"})]})})]})}function ie(s){const a=Math.log(1-s*s),i=2/(Math.PI*.147)+a/2;return(s>=0?1:-1)*Math.sqrt(Math.sqrt(i*i-a/.147)-i)}function ne(s,r,a){return .5*(1+oe((s-r)/(a*Math.sqrt(2))))}function oe(s){const r=1/(1+.5*Math.abs(s)),a=r*Math.exp(-s*s-1.26551223+r*(1.00002368+r*(.37409196+r*(.09678418+r*(-.18628806+r*(.27886807+r*(-1.13520398+r*(1.48851587+r*(-.82215223+r*.17087294)))))))));return s>=0?1-a:a-1}function le(s,r,a){return Math.exp(-.5*((s-r)/a)**2)/(a*Math.sqrt(2*Math.PI))}function de(s,r,a,i,o){const h=(s-r)/a,n=le(h,0,1),f=ne(s,r,a),d=(r-s)*(1-f)+a*n,m=s-r+d;return i*(r-d)-o*m}function ce(){return e.jsxs(w,{title:"Probabilistic Inventory Models",subject:"Supply Chain Forecasting",difficulty:"advanced",readingTime:13,children:[e.jsx("p",{children:"When demand is uncertain, the inventory problem becomes a stochastic optimization. The newsvendor model is the canonical single-period problem — it captures the fundamental tension between overstocking (wasted inventory) and understocking (lost sales or backorders). Extensions include multi-period lost-sales models, multi-echelon inventory, and full stochastic programming formulations."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"The Newsvendor Model"}),e.jsxs(c,{title:"Newsvendor Problem Setup",children:["A retailer must order ",e.jsx(t.InlineMath,{math:"Q"})," units before observing demand",e.jsx(t.InlineMath,{math:"D \\sim F(\\cdot)"}),". Costs:",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"c_u"}),": underage cost per unit of unmet demand (lost margin, goodwill loss)"]}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"c_o"}),": overage cost per unit of unsold inventory (salvage loss, storage)"]})]}),"Expected total cost:",e.jsx(t.BlockMath,{math:"C(Q) = c_u \\cdot \\mathbb{E}[(D - Q)^+] + c_o \\cdot \\mathbb{E}[(Q - D)^+]"})]}),e.jsxs(T,{title:"Newsvendor Optimality Condition",children:["The optimal order quantity ",e.jsx(t.InlineMath,{math:"Q^*"})," satisfies:",e.jsx(t.BlockMath,{math:"F(Q^*) = \\frac{c_u}{c_u + c_o} \\equiv \\text{CR}"}),"where CR is the ",e.jsx("em",{children:"critical ratio"}),". If demand is normally distributed with mean ",e.jsx(t.InlineMath,{math:"\\mu"}),"and standard deviation ",e.jsx(t.InlineMath,{math:"\\sigma"}),":",e.jsx(t.BlockMath,{math:"Q^* = \\mu + z_{\\text{CR}} \\cdot \\sigma, \\quad z_{\\text{CR}} = \\Phi^{-1}(\\text{CR})"}),"The critical ratio is the service level implied by the cost structure — no arbitrary target is needed."]}),e.jsx(re,{}),e.jsxs(B,{title:"Fashion Retailer with Clearance",children:["A buyer must order winter coats before the season. Purchase cost: $80, retail price: $150, end-of-season clearance price: $50.",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:["Underage cost ",e.jsx(t.InlineMath,{math:"c_u"})," = $150 − $80 = $70 (lost margin)"]}),e.jsxs("li",{children:["Overage cost ",e.jsx(t.InlineMath,{math:"c_o"})," = $80 − $50 = $30 (clearance loss)"]}),e.jsx("li",{children:"Critical ratio = 70/(70+30) = 0.70"}),e.jsx("li",{children:"With demand ~ N(500, 100²), optimal Q* = 500 + 0.524×100 = 552 coats"})]}),'This is the natural "fill-rate" interpretation: order enough to satisfy 70% of demand distributions.']}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Lost Sales vs Backorders"}),e.jsx("p",{children:"The multi-period extension of the newsvendor depends critically on whether unsatisfied demand is lost or backordered:"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-2 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Backorder model"}),": Unsatisfied demand waits until replenishment arrives. The base-stock policy is optimal: order-up-to level S = ",e.jsx(t.InlineMath,{math:"\\mu_L + z_{CSL} \\sigma_L"}),". This is equivalent to the ROP formula."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Lost-sales model"}),": Unsatisfied demand is permanently lost. The optimal policy is more complex — the base-stock level must be set higher because inventory has asymmetric value. The optimal S satisfies a similar critical ratio condition but applied to the lead-time demand distribution."]})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Multi-Echelon Inventory"}),e.jsx("p",{children:"Real supply chains have multiple stocking echelons: factory warehouse → regional DC → store → shelf. The Clark-Scarf model (1960) showed that multi-echelon systems can be decomposed: each echelon optimizes its base-stock level independently, with the warehouse's lead time reflecting the store's replenishment delay. Key insights:"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm mt-2",children:[e.jsx("li",{children:"Safety stock should be held at the echelon closest to customer demand — pooling upstream reduces safety stock"}),e.jsx("li",{children:"Supply chain vulnerability (demand amplification / bullwhip) means upstream echelons need larger safety buffers"}),e.jsx("li",{children:"Centralization (single DC) versus decentralization (multiple DCs) creates classic risk-pooling tradeoffs"})]}),e.jsxs(c,{title:"Risk Pooling Formula",children:["Consolidating ",e.jsx(t.InlineMath,{math:"n"})," independent, identically distributed demand streams into a single warehouse reduces the required safety stock by a factor of ",e.jsx(t.InlineMath,{math:"\\sqrt{n}"}),":",e.jsx(t.BlockMath,{math:"\\sigma_{\\text{pooled}} = \\sigma_{\\text{individual}} \\cdot \\sqrt{n}"}),"vs. ",e.jsx(t.InlineMath,{math:"n"})," independent stocks requiring ",e.jsx(t.InlineMath,{math:"n \\cdot \\sigma_{\\text{individual}}"})," total. The saving is ",e.jsx(t.InlineMath,{math:"(\\sqrt{n} - 1)/\\sqrt{n}"}),", e.g., 50% savings pooling 4 stores into 1 DC."]}),e.jsx(C,{children:"The newsvendor model assumes a single selling period. For products with multiple periods (most supply chain contexts), the base-stock (order-up-to) policy is optimal under backorders. Under lost sales, optimal policies are harder to compute exactly but can be approximated well by inflating the backorder safety factor by 20–30%."}),e.jsx(M,{children:"A common mistake is setting service level targets (95%, 99%) without connecting them to actual cost ratios. A retailer with 40% margin and 10% salvage loss has a natural critical ratio of 0.40/(0.40+0.10) = 0.80. Forcing a 95% CSL would overstock significantly and reduce total profit. Always anchor service-level targets in the cost structure."}),e.jsx(p,{title:"Newsvendor Solution and Monte Carlo Simulation",code:`import numpy as np
from scipy.stats import norm, poisson
from scipy.optimize import minimize_scalar

# ── Newsvendor with Normal demand ─────────────────────────────────────────────
def newsvendor_normal(mu, sigma, cu, co):
    """Optimal Q, expected cost, and expected profit."""
    cr     = cu / (cu + co)
    q_star = mu + sigma * norm.ppf(cr)
    # Expected cost
    z      = (q_star - mu) / sigma
    ec_under = cu * sigma * norm.pdf(z) + cu * (mu - q_star) * (1 - norm.cdf(z))
    ec_over  = co * sigma * norm.pdf(z) - co * (mu - q_star) * norm.cdf(z)
    # Simpler: E[cost] = cu * E[(D-Q)+] + co * E[(Q-D)+]
    e_short  = sigma * norm.pdf(z) - (q_star - mu) * (1 - norm.cdf(z))
    e_excess = (q_star - mu) + e_short        # by balance equation E[D-Q+] + Q = E[D] + E[Q-D+]
    total_ec = cu * e_short + co * e_excess
    return dict(q_star=round(q_star, 1), cr=round(cr, 4),
                e_short=round(e_short, 2), e_excess=round(e_excess, 2),
                expected_cost=round(total_ec, 2))

# ── Fashion example ────────────────────────────────────────────────────────────
result = newsvendor_normal(mu=500, sigma=100, cu=70, co=30)
print("Fashion Newsvendor:")
for k, v in result.items():
    print(f"  {k}: {v}")

# ── Newsvendor with Poisson demand (intermittent) ──────────────────────────────
def newsvendor_poisson(lam, cu, co):
    """Optimal Q for Poisson demand."""
    cr = cu / (cu + co)
    # Find smallest Q such that F(Q) >= cr
    q = poisson.ppf(cr, lam)
    return int(q), cr

q_poisson, cr_p = newsvendor_poisson(lam=15, cu=50, co=10)
print(f"\\nPoisson Newsvendor (lambda=15, cu=50, co=10):")
print(f"  CR = {cr_p:.3f}, Q* = {q_poisson}")

# ── Monte Carlo simulation ─────────────────────────────────────────────────────
np.random.seed(42)
n_sims = 50_000
mu, sigma, cu, co = 500, 100, 70, 30
cr = cu / (cu + co)
q_star = mu + sigma * norm.ppf(cr)

demands = np.random.normal(mu, sigma, n_sims)

profits = []
for q in [q_star - 50, q_star, q_star + 50]:
    sales    = np.minimum(demands, q)
    leftover = np.maximum(q - demands, 0)
    lost     = np.maximum(demands - q, 0)
    profit   = cu * sales - co * leftover - cu * lost
    profits.append({'q': round(q, 0), 'mean_profit': profit.mean().round(2),
                    'std_profit': profit.std().round(2)})

import pandas as pd
print("\\nMonte Carlo Profit by Order Quantity:")
print(pd.DataFrame(profits).to_string(index=False))

# ── Risk pooling demonstration ─────────────────────────────────────────────────
sigma_single = 50   # demand std dev per store
n_stores     = [1, 2, 4, 8, 16]
z_csl        = norm.ppf(0.95)   # 95% CSL

print("\\nRisk Pooling (95% CSL):")
print(f"{'Stores':>8} {'Decentralized SS':>20} {'Centralized SS':>18} {'Savings':>10}")
for n in n_stores:
    decentral = n * z_csl * sigma_single
    central   = z_csl * sigma_single * np.sqrt(n)
    saving    = (decentral - central) / decentral
    print(f"{n:>8} {decentral:>20.0f} {central:>18.0f} {saving:>9.1%}")
`}),e.jsx(N,{references:[{author:"Arrow, K.J., Harris, T., & Marschak, J.",year:1951,title:"Optimal inventory policy",journal:"Econometrica",volume:"19(3)",pages:"250–272"},{author:"Clark, A.J. & Scarf, H.",year:1960,title:"Optimal policies for a multi-echelon inventory problem",journal:"Management Science",volume:"6(4)",pages:"475–490"},{author:"Cachon, G. & Terwiesch, C.",year:2019,title:"Matching Supply with Demand: An Introduction to Operations Management (4th ed.)",publisher:"McGraw-Hill"}]})]})}const Ce=Object.freeze(Object.defineProperty({__proto__:null,default:ce},Symbol.toStringTag,{value:"Module"})),U=[{level:"Total Company",description:"Aggregate demand across all products, channels, and locations",useCase:"S&OP planning, capacity allocation"},{level:"Product Category",description:"Demand by product family or brand",useCase:"Category management, supplier negotiations"},{level:"SKU",description:"Individual stock-keeping unit demand",useCase:"Replenishment, safety stock calculation"},{level:"SKU × Location",description:"Demand per SKU per distribution center or store",useCase:"Store-level ordering, DC replenishment"},{level:"SKU × Channel",description:"Demand per SKU across e-commerce, wholesale, retail",useCase:"Channel allocation, inventory positioning"}];function me(){const[s,r]=g.useState(null);return e.jsxs(w,{title:"Supply Chain Hierarchy",subject:"Supply Chain Forecasting",difficulty:"intermediate",readingTime:11,children:[e.jsx("p",{children:"Supply chains naturally organize demand into hierarchies: products aggregate into categories, locations aggregate into regions and totals, channels aggregate across store and online. Forecasting at the right level of this hierarchy — and ensuring consistency across levels — is critical for operational planning. A regional forecast that doesn't sum to the national total creates planning contradictions."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"The Three Dimensions of Supply Chain Hierarchy"}),e.jsxs(c,{title:"Product Hierarchy",children:["Products organize from most granular to most aggregate:",e.jsx(t.BlockMath,{math:"\\text{SKU} \\to \\text{Sub-category} \\to \\text{Category} \\to \\text{Brand} \\to \\text{Total}"}),"Each level supports different business decisions. SKU-level drives replenishment; category-level drives assortment and supplier negotiations; total-level drives capacity and financial planning."]}),e.jsxs(c,{title:"Location Hierarchy",children:[e.jsx(t.BlockMath,{math:"\\text{Store / DC} \\to \\text{Region} \\to \\text{Country} \\to \\text{Global}"}),"Location hierarchies interact with product hierarchies: a retailer may have 500 stores × 50,000 SKUs = 25 million time series to manage. Aggregation and ML at global level with disaggregation is essential."]}),e.jsxs(c,{title:"Channel Hierarchy",children:["Modern omnichannel retail adds a third dimension:",e.jsx(t.BlockMath,{math:"\\text{Store} \\cup \\text{E-commerce} \\cup \\text{Wholesale} \\to \\text{Total Channel}"}),"Channel shifts (e.g., COVID-driven e-commerce surge) can make historical patterns at the SKU level misleading unless channel is modeled explicitly."]}),e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border",children:[e.jsx("h3",{className:"text-lg font-semibold mb-3",children:"Supply Chain Hierarchy Levels"}),e.jsx("div",{className:"space-y-2",children:U.map((a,i)=>e.jsxs("div",{onClick:()=>r(s===i?null:i),className:`p-3 rounded border cursor-pointer transition-all ${s===i?"border-blue-400 bg-blue-50":"border-gray-200 hover:border-blue-300"}`,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"font-semibold text-sm",children:a.level}),e.jsx("span",{className:"text-xs text-gray-500",children:i===0?"▲ Aggregate":i===U.length-1?"▼ Granular":""})]}),s===i&&e.jsxs("div",{className:"mt-2 text-sm space-y-1",children:[e.jsx("p",{className:"text-gray-700",children:a.description}),e.jsxs("p",{className:"text-blue-600",children:["Use case: ",a.useCase]})]})]},i))})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Forecasting at Each Level"}),e.jsx("p",{children:"Different levels have different data richness, signal-to-noise ratios, and planning horizons:"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-2 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Aggregate level"}),": More data per series (lower noise), supports longer horizons, macroeconomic drivers easier to model, but too coarse for operational decisions."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"SKU level"}),": Direct input to replenishment, but many SKUs are intermittent or have short histories, making individual time-series models unreliable."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"SKU × Location"}),": Maximum operational detail but potentially millions of series. Global models (one model trained on all series) are the only scalable approach."]})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Coherence Constraint"}),e.jsxs(T,{title:"Coherence Requirement",children:["A set of forecasts is ",e.jsx("em",{children:"coherent"})," if every level is consistent with every other level through the hierarchical summing structure. If ",e.jsx(t.InlineMath,{math:"\\mathbf{b}"})," are bottom-level forecasts and",e.jsx(t.InlineMath,{math:"\\mathbf{S}"})," is the summing matrix encoding the hierarchy:",e.jsx(t.BlockMath,{math:"\\hat{\\mathbf{y}} = \\mathbf{S} \\hat{\\mathbf{b}}"}),"Coherent forecasts satisfy this equation exactly. Incoherent forecasts create planning contradictions (e.g., regional orders exceed national supply plan)."]}),e.jsx(B,{title:"Coherence Failure Example",children:"A CPG manufacturer runs separate demand forecasting systems for sales (top-down, by brand) and operations (bottom-up, by SKU). Sales forecasts a 15% growth for a beverage brand. Operations forecasts 8% growth summed across SKUs. The gap of 7% goes unresolved, and the production plan is underfunded. When actual demand exceeds the production plan, a major retailer stockout occurs. Implementing a single hierarchical forecasting system with reconciliation eliminated this disconnect."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Practical Challenges"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-2 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"New SKUs and SKU churn"}),": New products appear, old ones are discontinued. The hierarchy must handle sparse or missing history at the bottom level gracefully."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Promotions and events"}),": A promotion at one store should not be disaggregated to all stores in the region — location-specific events break the stationarity assumption."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Organizational silos"}),": Commercial and operations teams often have separate forecasting processes. Hierarchy provides a framework for aligning them but requires governance."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Scale"}),": A large retailer may have 10M+ time series. Forecasting and reconciliation must be designed for distributed computation (Spark, Dask, or streaming architectures)."]})]}),e.jsx(C,{children:"The choice between forecasting top-down (disaggregate aggregate forecasts) versus bottom-up (aggregate SKU forecasts) versus middle-out (forecast at a middle level and propagate both ways) depends on where information is richest. For most retail supply chains, SKU-level historical data is the richest signal, making bottom-up the natural starting point. Reconciliation then enforces coherence."}),e.jsx(M,{children:"Temporal hierarchies also exist: daily forecasts must aggregate consistently to weekly and monthly totals. Handling calendar effects (52 vs 53 weeks per year, month-end effects) across temporal hierarchies requires careful period definition and is a common source of reconciliation bugs in practice."}),e.jsx(p,{title:"Supply Chain Hierarchy with hierarchicalforecast",code:`import pandas as pd
import numpy as np
from hierarchicalforecast.core import HierarchicalReconciliation
from hierarchicalforecast.methods import BottomUp, TopDown, MinTrace
from statsforecast import StatsForecast
from statsforecast.models import AutoETS, Naive

# ── Build a toy supply chain hierarchy ────────────────────────────────────────
# Structure: Total -> 2 Regions -> 4 Locations (stores/DCs)
# Tags define hierarchy: each column = one dimension
np.random.seed(42)
dates = pd.date_range('2021-01-04', periods=104, freq='W-MON')

# Generate bottom-level (store × SKU) weekly demand
store_ids  = ['North_A', 'North_B', 'South_A', 'South_B']
region_map = {'North_A': 'North', 'North_B': 'North',
              'South_A': 'South', 'South_B': 'South'}

rows = []
for store in store_ids:
    base = np.random.uniform(50, 200)
    trend = np.random.uniform(-0.1, 0.3)
    for i, date in enumerate(dates):
        d = base * (1 + trend * i / 104) + np.random.normal(0, 10)
        rows.append({'date': date, 'store': store,
                     'region': region_map[store], 'demand': max(0, d)})

df_store = pd.DataFrame(rows)

# ── Create hierarchical tags DataFrame ───────────────────────────────────────
# hierarchicalforecast expects: unique_id, ds, y  +  S (summing matrix)
def build_hierarchy(df):
    """Build hierarchical dataset with summing matrix."""
    # Pivot to wide (date x store)
    wide = df.pivot(index='date', columns='store', values='demand').reset_index()
    wide.columns.name = None

    # Add aggregate columns
    for region in ['North', 'South']:
        stores_in = [s for s in store_ids if region_map[s] == region]
        wide[region] = wide[stores_in].sum(axis=1)
    wide['Total'] = wide[store_ids].sum(axis=1)

    # Melt to long format for hierarchicalforecast
    all_series = store_ids + ['North', 'South', 'Total']
    long = wide.melt(id_vars='date', value_vars=all_series,
                     var_name='unique_id', value_name='y')
    long = long.rename(columns={'date': 'ds'}).sort_values(['unique_id', 'ds'])

    # Summing matrix S: rows = all series, cols = bottom-level series
    n_bottom = len(store_ids)
    S = pd.DataFrame(0, index=all_series, columns=store_ids)
    for s in store_ids:
        S.loc[s, s] = 1                          # bottom-level: identity
    for region in ['North', 'South']:
        for s in store_ids:
            if region_map[s] == region:
                S.loc[region, s] = 1             # region = sum of stores
    S.loc['Total'] = 1                            # total = sum of all

    return long, S

long_df, S = build_hierarchy(df_store)

# ── Fit base forecasts ────────────────────────────────────────────────────────
sf = StatsForecast(
    models=[AutoETS(model='ZZZ'), Naive()],
    freq='W-MON',
    n_jobs=-1,
)
sf.fit(long_df)
base_fc = sf.predict(h=8)

print("Base forecasts (first 5 rows):")
print(base_fc.head())

# ── Reconcile ─────────────────────────────────────────────────────────────────
hrec = HierarchicalReconciliation(reconcilers=[
    BottomUp(),
    TopDown(method='forecast_proportions'),
    MinTrace(method='ols'),
])

reconciled = hrec.reconcile(
    Y_hat_df=base_fc,
    Y_df=long_df,
    S=S,
)

print("\\nReconciled forecasts (Total + regions + stores):")
print(reconciled[reconciled['unique_id'].isin(['Total', 'North', 'South'])].head(24))
`}),e.jsx(N,{references:[{author:"Hyndman, R.J., Ahmed, R.A., Athanasopoulos, G., & Shang, H.L.",year:2011,title:"Optimal combination forecasts for hierarchical time series",journal:"Computational Statistics and Data Analysis",volume:"55(9)",pages:"2579–2589"},{author:"Athanasopoulos, G., Ahmed, R.A., & Hyndman, R.J.",year:2009,title:"Hierarchical forecasts for Australian domestic tourism",journal:"International Journal of Forecasting",volume:"25(1)",pages:"146–166"}]})]})}const Ae=Object.freeze(Object.defineProperty({__proto__:null,default:me},Symbol.toStringTag,{value:"Module"})),he=[{method:"Bottom-Up",mae_sku:12.4,mae_region:28.3,mae_total:45.1},{method:"Top-Down",mae_sku:18.7,mae_region:22.1,mae_total:31.8},{method:"Middle-Out",mae_sku:14.2,mae_region:20.8,mae_total:33.5},{method:"MinT(OLS)",mae_sku:10.8,mae_region:18.4,mae_total:28.6},{method:"MinT(Shrink)",mae_sku:10.1,mae_region:17.9,mae_total:27.2}];function ue(){const[s,r]=g.useState("mae_sku");return e.jsxs(w,{title:"Supply Chain Reconciliation",subject:"Supply Chain Forecasting",difficulty:"advanced",readingTime:12,children:[e.jsx("p",{children:"Once base forecasts are generated at each level of the supply chain hierarchy, they must be reconciled to ensure consistency: store-level forecasts must sum to regional, regional must sum to national. Reconciliation methods differ in which information they trust, how they handle forecast errors, and whether they enforce physical constraints like non-negativity."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Classical Reconciliation Approaches"}),e.jsxs(c,{title:"Bottom-Up Reconciliation",children:["Forecast only at the most granular level (SKU × location), then sum upward:",e.jsx(t.BlockMath,{math:"\\hat{y}_{\\text{region}} = \\sum_{i \\in \\text{region}} \\hat{y}_i"}),e.jsx("strong",{children:"Pros"}),": preserves granular signal, naturally coherent, captures local patterns.",e.jsx("br",{}),e.jsx("strong",{children:"Cons"}),": bottom-level forecasts are noisiest; macroeconomic signals that are visible at the aggregate get diluted."]}),e.jsxs(c,{title:"Top-Down Reconciliation",children:["Forecast at the aggregate level, then disaggregate using historical proportions:",e.jsx(t.BlockMath,{math:"\\hat{y}_i = p_i \\cdot \\hat{y}_{\\text{total}}, \\quad p_i = \\frac{\\bar{y}_i}{\\sum_j \\bar{y}_j}"}),e.jsx("strong",{children:"Pros"}),": aggregate forecasts use most data, good for stable proportions.",e.jsx("br",{}),e.jsx("strong",{children:"Cons"}),": loses local information; proportions shift with promotions, new products."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"MinT: Minimum Trace Reconciliation"}),e.jsxs(T,{title:"MinT Optimal Reconciliation",children:["Wickramasuriya et al. (2019) showed that among all unbiased linear reconciliation methods, the",e.jsx("em",{children:"minimum trace"})," (MinT) estimator minimizes the total forecast error variance. Given base forecasts ",e.jsx(t.InlineMath,{math:"\\tilde{\\mathbf{y}}"}),", the reconciled forecasts are:",e.jsx(t.BlockMath,{math:"\\hat{\\mathbf{y}} = \\mathbf{S}(\\mathbf{S}^\\top \\mathbf{W}^{-1} \\mathbf{S})^{-1} \\mathbf{S}^\\top \\mathbf{W}^{-1} \\tilde{\\mathbf{y}}"}),"where ",e.jsx(t.InlineMath,{math:"\\mathbf{W}"})," is the covariance matrix of base forecast errors.",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"MinT(OLS)"}),": ",e.jsx(t.InlineMath,{math:"\\mathbf{W} = \\mathbf{I}"})," — equal weight to all levels"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MinT(WLS)"}),": ",e.jsx(t.InlineMath,{math:"\\mathbf{W} = \\text{diag}(\\hat{\\sigma}_i^2)"})," — weight by in-sample variance"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MinT(Shrinkage)"}),": ",e.jsx(t.InlineMath,{math:"\\mathbf{W}"})," estimated with shrinkage regularization"]})]})]}),e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Reconciliation Method Comparison (MAE by Level)"}),e.jsx("div",{className:"flex gap-2 mb-3",children:[["mae_sku","SKU Level"],["mae_region","Region Level"],["mae_total","Total Level"]].map(([a,i])=>e.jsx("button",{onClick:()=>r(a),className:`px-3 py-1 text-sm rounded border ${s===a?"bg-blue-600 text-white border-blue-600":"border-gray-300"}`,children:i},a))}),e.jsx(v,{width:"100%",height:220,children:e.jsxs(I,{data:he,margin:{top:5,right:20,bottom:20,left:10},children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(j,{dataKey:"method"}),e.jsx(y,{label:{value:"MAE",angle:-90,position:"insideLeft"}}),e.jsx(S,{}),e.jsx(A,{dataKey:s,fill:"#3b82f6",name:"MAE"})]})}),e.jsx("p",{className:"text-xs text-gray-500 mt-2",children:"Illustrative values — MinT(Shrink) tends to outperform across all levels."})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Constrained Reconciliation (Non-Negativity)"}),e.jsx("p",{children:"Standard MinT can produce negative forecasts for intermittent demand SKUs. This is physically impossible — you cannot have negative demand. Two common approaches:"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-2 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Post-processing truncation"}),": Set ",e.jsx(t.InlineMath,{math:"\\hat{y}_i = \\max(0, \\hat{y}_i^{\\text{MinT}})"}),"and re-normalize upper levels. Simple but not optimal."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Projected reconciliation"}),": Solve the reconciliation as a constrained quadratic program with ",e.jsx(t.InlineMath,{math:"\\hat{y}_i \\geq 0"})," for all ",e.jsx(t.InlineMath,{math:"i"}),". More expensive but guarantees coherent, non-negative forecasts. Available in ",e.jsx("code",{children:"hierarchicalforecast"})," via the ",e.jsx("code",{children:"ERM"})," method with non-negativity constraints."]})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Temporal Reconciliation"}),e.jsx("p",{children:"Forecasts must also be consistent across time horizons. A monthly forecast for January should equal the sum of weekly forecasts for January's weeks. This temporal coherence is especially important for:"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm mt-2",children:[e.jsx("li",{children:"Monthly financial plans that must match weekly operational plans"}),e.jsx("li",{children:"Seasonal promotions spanning multiple periods"}),e.jsx("li",{children:"S&OP horizon (18-month monthly) vs. operational horizon (13-week weekly)"})]}),e.jsx(B,{title:"Temporal × Cross-Sectional Reconciliation",children:"A food manufacturer runs forecasting at multiple temporal and hierarchical levels simultaneously: national monthly brand forecasts feed into the financial plan, while regional weekly SKU-level forecasts feed into production scheduling. When brand-level January monthly forecast = 100,000 units but the sum of weekly regional SKU forecasts = 87,000 units, there's a 13% gap. Full temporal-hierarchical reconciliation (THIEF framework) resolves both dimensions simultaneously, producing consistent forecasts from national monthly down to regional weekly."}),e.jsxs(C,{children:["MinT requires estimating the forecast error covariance matrix ",e.jsx(t.InlineMath,{math:"\\mathbf{W}"}),". With many series (thousands of SKUs), the full covariance matrix is high-dimensional and hard to estimate reliably. MinT(Shrinkage) provides a regularized estimator that is much better conditioned than the sample covariance. In practice, MinT(WLS) offers a good balance of performance and computational cost."]}),e.jsx(M,{children:"Top-down reconciliation using average historical proportions breaks catastrophically when product mix changes: new SKU launches, discontinued products, major promotions, or channel shifts. Always use forecast-proportion top-down (proportions based on base forecasts, not history) or prefer bottom-up / MinT. Monitor proportion stability as a leading indicator of when to switch methods."}),e.jsx(p,{title:"MinT Reconciliation for Supply Chain with hierarchicalforecast",code:`import pandas as pd
import numpy as np
from hierarchicalforecast.core import HierarchicalReconciliation
from hierarchicalforecast.methods import BottomUp, TopDown, MinTrace
from hierarchicalforecast.evaluation import HierarchicalEvaluation
from statsforecast import StatsForecast
from statsforecast.models import AutoETS

# ── Build larger hierarchy: Total -> 3 Regions -> 9 Stores ───────────────────
np.random.seed(42)
dates = pd.date_range('2021-01-04', periods=130, freq='W-MON')

stores  = [f'Store_{r}_{i}' for r in ['North', 'Central', 'South'] for i in range(3)]
regions = ['North', 'Central', 'South']
region_of = {s: s.split('_')[1] for s in stores}

def gen_store_demand(store, n):
    base  = np.random.uniform(30, 120)
    trend = np.random.uniform(-0.05, 0.2)
    seas  = 10 * np.sin(2 * np.pi * np.arange(n) / 52)
    noise = np.random.normal(0, 8, n)
    return np.maximum(base * (1 + trend * np.arange(n) / n) + seas + noise, 0)

rows = []
for store in stores:
    demand = gen_store_demand(store, len(dates))
    for i, date in enumerate(dates):
        rows.append({'unique_id': store, 'ds': date, 'y': demand[i]})

df_stores = pd.DataFrame(rows)

# Add aggregate series
pivot  = df_stores.pivot(index='ds', columns='unique_id', values='y')
for region in regions:
    stores_r = [s for s in stores if region_of[s] == region]
    pivot[region] = pivot[stores_r].sum(axis=1)
pivot['Total'] = pivot[stores].sum(axis=1)

df_all = pivot.reset_index().melt(id_vars='ds', var_name='unique_id', value_name='y')

# ── Summing matrix S ──────────────────────────────────────────────────────────
all_ids = ['Total'] + regions + stores
S = pd.DataFrame(0, index=all_ids, columns=stores)
S.loc['Total'] = 1
for region in regions:
    for store in stores:
        if region_of[store] == region:
            S.loc[region, store] = 1
for store in stores:
    S.loc[store, store] = 1

# ── Train/test split ─────────────────────────────────────────────────────────
TRAIN_END = '2023-06-26'
train  = df_all[df_all['ds'] <= TRAIN_END]
test   = df_all[df_all['ds'] >  TRAIN_END]
h      = test['ds'].nunique()

# ── Generate base forecasts ───────────────────────────────────────────────────
sf = StatsForecast(models=[AutoETS(model='ZZZ')], freq='W-MON', n_jobs=-1)
sf.fit(train)
Y_hat_df = sf.predict(h=h)

# ── Reconcile ─────────────────────────────────────────────────────────────────
hrec = HierarchicalReconciliation(reconcilers=[
    BottomUp(),
    TopDown(method='forecast_proportions'),
    MinTrace(method='ols'),
    MinTrace(method='wls_var'),
    MinTrace(method='mint_shrink'),
])

recon = hrec.reconcile(
    Y_hat_df=Y_hat_df,
    Y_df=train,
    S=S,
)

# ── Non-negative truncation ───────────────────────────────────────────────────
model_cols = [c for c in recon.columns if c not in ['unique_id', 'ds']]
for col in model_cols:
    recon[col] = recon[col].clip(lower=0)

# ── Evaluate ─────────────────────────────────────────────────────────────────
eval_df = recon.merge(test[['unique_id', 'ds', 'y']], on=['unique_id', 'ds'])

for col in model_cols:
    mae_sku    = (eval_df[eval_df['unique_id'].isin(stores)][col]
                  - eval_df[eval_df['unique_id'].isin(stores)]['y']).abs().mean()
    mae_region = (eval_df[eval_df['unique_id'].isin(regions)][col]
                  - eval_df[eval_df['unique_id'].isin(regions)]['y']).abs().mean()
    mae_total  = (eval_df[eval_df['unique_id'] == 'Total'][col]
                  - eval_df[eval_df['unique_id'] == 'Total']['y']).abs().mean()
    print(f"{col:<30} SKU MAE: {mae_sku:6.2f}  Region MAE: {mae_region:7.2f}  Total MAE: {mae_total:7.2f}")

# ── Check coherence ───────────────────────────────────────────────────────────
col = 'AutoETS/MinTrace_method-mint_shrink'
if col in recon.columns:
    sample_date = recon['ds'].iloc[0]
    snap = recon[recon['ds'] == sample_date].set_index('unique_id')[col]
    region_sums = {r: sum(snap[s] for s in stores if region_of[s] == r) for r in regions}
    for r in regions:
        print(f"Coherence check: {r} forecast={snap[r]:.1f}, sum of stores={region_sums[r]:.1f}")
`}),e.jsx(N,{references:[{author:"Wickramasuriya, S.L., Athanasopoulos, G., & Hyndman, R.J.",year:2019,title:"Optimal forecast reconciliation using unbiased estimating equations",journal:"Journal of the American Statistical Association",volume:"114(526)",pages:"804–819"},{author:"Kourentzes, N. & Athanasopoulos, G.",year:2019,title:"Cross-temporal coherent forecasts for Australian tourism",journal:"Annals of Tourism Research",volume:"75",pages:"393–409"}]})]})}const Te=Object.freeze(Object.defineProperty({__proto__:null,default:ue},Symbol.toStringTag,{value:"Module"})),pe=Array.from({length:24},(s,r)=>{const a=Math.sin(r/4)*.4+(r>12?.3:-.1);return{period:r+1,tracking_signal:parseFloat(a.toFixed(3))}});function fe(){return e.jsxs(w,{title:"Forecast Bias and Error Analysis",subject:"Supply Chain Forecasting",difficulty:"intermediate",readingTime:10,children:[e.jsx("p",{children:"Forecast accuracy measurement is the foundation of any demand planning improvement cycle. But not all metrics are equal: the wrong metric can optimize for the wrong objective, hide systematic biases, or be dominated by a handful of high-volume SKUs. Supply chain forecasting requires metrics that are interpretable, scale-invariant, robust to intermittent demand, and connected to business outcomes."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Core Error Metrics"}),e.jsxs(c,{title:"MAPE — Mean Absolute Percentage Error",children:[e.jsx(t.BlockMath,{math:"\\text{MAPE} = \\frac{100}{n} \\sum_{t=1}^n \\left|\\frac{y_t - \\hat{y}_t}{y_t}\\right|"}),"Widely used due to interpretability (% error). Fatal flaw: undefined or explodes when",e.jsx(t.InlineMath,{math:"y_t = 0"}),", making it unsuitable for intermittent demand. Also asymmetric: overcorrects when actuals are small."]}),e.jsxs(c,{title:"WMAPE — Weighted MAPE",children:[e.jsx(t.BlockMath,{math:"\\text{WMAPE} = \\frac{\\sum_{t=1}^n |y_t - \\hat{y}_t|}{\\sum_{t=1}^n y_t}"}),"Weights errors by demand volume, reducing sensitivity to low-volume periods. Equivalent to total absolute error as a fraction of total demand. The preferred metric in most supply chain settings because it naturally aligns with business impact."]}),e.jsxs(c,{title:"MASE — Mean Absolute Scaled Error",children:[e.jsx(t.BlockMath,{math:"\\text{MASE} = \\frac{\\text{MAE}}{\\frac{1}{n-1}\\sum_{t=2}^n |y_t - y_{t-1}|}"}),"Scales MAE by the in-sample naive (random walk) MAE. Values below 1 mean the model beats the naive benchmark. Handles zeros, handles different scales, and is interpretable across SKUs. Recommended by Hyndman & Koehler (2006) as the most robust general-purpose metric."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Bias Detection"}),e.jsxs(c,{title:"Forecast Bias (Mean Error)",children:[e.jsx(t.BlockMath,{math:"\\text{Bias} = \\frac{1}{n}\\sum_{t=1}^n (y_t - \\hat{y}_t)"}),"Positive bias means systematic under-forecasting (actual > forecast → stockouts). Negative bias means systematic over-forecasting (actual < forecast → overstock). Bias should be tested for statistical significance before drawing conclusions."]}),e.jsxs(c,{title:"Tracking Signal",children:["The tracking signal monitors running bias relative to MAD:",e.jsx(t.BlockMath,{math:"\\text{TS}_t = \\frac{\\sum_{i=1}^t (y_i - \\hat{y}_i)}{\\text{MAD}_t}"}),"where ",e.jsx(t.InlineMath,{math:"\\text{MAD}_t = \\frac{1}{t}\\sum_{i=1}^t |y_i - \\hat{y}_i|"}),". Control limits are typically ±4 to ±6 MADs. Exceeding these triggers a model review."]}),e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Tracking Signal Over Time"}),e.jsx("p",{className:"text-sm text-gray-600 mb-3",children:"Control limits at ±4 MAD. Signal crossing ±4 triggers review. The upward drift after period 12 indicates emerging under-forecast bias."}),e.jsx(v,{width:"100%",height:220,children:e.jsxs(z,{data:pe,margin:{top:5,right:20,bottom:20,left:10},children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(j,{dataKey:"period",label:{value:"Period",position:"insideBottom",offset:-10}}),e.jsx(y,{domain:[-5,5],label:{value:"Tracking Signal",angle:-90,position:"insideLeft"}}),e.jsx(S,{}),e.jsx(q,{y:4,stroke:"#ef4444",strokeDasharray:"4 2",label:{value:"+4",fill:"#ef4444"}}),e.jsx(q,{y:-4,stroke:"#ef4444",strokeDasharray:"4 2",label:{value:"-4",fill:"#ef4444"}}),e.jsx(q,{y:0,stroke:"#6b7280"}),e.jsx(k,{dataKey:"tracking_signal",stroke:"#3b82f6",strokeWidth:2,dot:!1,name:"Tracking Signal"})]})})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Theil's U Statistic"}),e.jsxs(c,{title:"Theil's U2",children:["Compares model to the naive (no-change) forecast:",e.jsx(t.BlockMath,{math:"U_2 = \\sqrt{\\frac{\\sum_{t=1}^{n-1}(e_{t+1}/y_t)^2}{\\sum_{t=1}^{n-1}((y_{t+1}-y_t)/y_t)^2}}"}),e.jsx(t.InlineMath,{math:"U_2 < 1"}),": model outperforms naive. ",e.jsx(t.InlineMath,{math:"U_2 = 1"}),": model is as good as naive (unacceptable). ",e.jsx(t.InlineMath,{math:"U_2 > 1"}),": model is worse than naive."]}),e.jsx(B,{title:"Metric Selection by SKU Type",children:e.jsxs("table",{className:"text-sm border-collapse w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-gray-100",children:[e.jsx("th",{className:"border p-2 text-left",children:"SKU Type"}),e.jsx("th",{className:"border p-2",children:"Recommended Metric"}),e.jsx("th",{className:"border p-2",children:"Avoid"})]})}),e.jsx("tbody",{children:[["Smooth, high-volume","MAPE, WMAPE","Nothing severe"],["Intermittent","MASE, MAE, WMAPE","MAPE (division by zero)"],["New products (<6 periods)","MAE, scaled by initial forecast","MAPE, MASE (insufficient history)"],["Cross-SKU comparison","MASE, WMAPE","MAE, RMSE (scale-dependent)"],["Portfolio-level","WMAPE (demand-weighted)","Unweighted MAPE (small SKU dominance)"]].map(([s,r,a])=>e.jsxs("tr",{children:[e.jsx("td",{className:"border p-2 font-medium",children:s}),e.jsx("td",{className:"border p-2 text-green-700 text-xs",children:r}),e.jsx("td",{className:"border p-2 text-red-600 text-xs",children:a})]},s))})]})}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Bias Correction Methods"}),e.jsx("p",{children:"When systematic bias is detected, two main correction strategies exist:"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-2 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Additive correction"}),": Add the mean error to future forecasts. Works for constant bias but can over-correct if the bias is temporary."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Multiplicative correction"}),": Multiply forecasts by the ratio of mean actual to mean forecast. Better when bias scales with demand level (common for seasonal items)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Root cause investigation"}),": The best long-term fix is identifying ",e.jsx("em",{children:"why"}),"the bias exists. Common causes: missing promotion effects, incorrect seasonality, demand being cannibalized by a new product, or structural change in customer behavior."]})]}),e.jsx(C,{children:"Aggregate bias metrics can hide opposing biases at the SKU level. A portfolio WMAPE of 18% with zero aggregate bias could have 40% of SKUs systematically over-forecast and 60% systematically under-forecast, with the errors offsetting in aggregate. Always decompose bias analysis by product category, region, and lifecycle stage."}),e.jsx(M,{children:"MAPE is the most commonly reported metric in supply chain settings but is the least appropriate for portfolios with intermittent demand. If your reporting dashboard shows MAPE only, you are flying blind on 30–60% of your SKU portfolio. Migrate to WMAPE + MASE for comprehensive monitoring."}),e.jsx(p,{title:"Comprehensive Error Metrics for Supply Chain",code:`import numpy as np
import pandas as pd
from scipy import stats

def compute_sc_metrics(actuals: np.ndarray, forecasts: np.ndarray,
                       naive_forecasts: np.ndarray = None) -> dict:
    """
    Compute supply chain-relevant forecast error metrics.
    Returns dict of metric name -> value.
    """
    errors   = actuals - forecasts
    abs_err  = np.abs(errors)
    n        = len(actuals)

    metrics = {}

    # ── Basic metrics ─────────────────────────────────────────────────────────
    metrics['MAE']  = abs_err.mean()
    metrics['RMSE'] = np.sqrt((errors**2).mean())
    metrics['Bias'] = errors.mean()

    # ── MAPE (only on nonzero actuals) ────────────────────────────────────────
    nz_mask = actuals > 0
    if nz_mask.sum() > 0:
        metrics['MAPE'] = (abs_err[nz_mask] / actuals[nz_mask]).mean() * 100
    else:
        metrics['MAPE'] = np.nan

    # ── WMAPE ─────────────────────────────────────────────────────────────────
    metrics['WMAPE'] = abs_err.sum() / actuals.sum() * 100 if actuals.sum() > 0 else np.nan

    # ── MASE ─────────────────────────────────────────────────────────────────
    naive_mae = np.abs(np.diff(actuals)).mean()  # naive in-sample scale
    metrics['MASE'] = abs_err.mean() / naive_mae if naive_mae > 0 else np.nan

    # ── Theil's U2 ────────────────────────────────────────────────────────────
    if naive_forecasts is not None and len(naive_forecasts) == n:
        model_pct  = (errors / np.where(actuals > 0, actuals, np.nan))[:-1]
        naive_err  = actuals[1:] - naive_forecasts[1:]
        naive_pct  = (naive_err / np.where(actuals[:-1] > 0, actuals[:-1], np.nan))
        valid      = np.isfinite(model_pct) & np.isfinite(naive_pct)
        if valid.sum() > 0:
            metrics['TheilU2'] = np.sqrt(np.nansum(model_pct[valid]**2) /
                                          np.nansum(naive_pct[valid]**2))

    # ── Bias significance (t-test) ────────────────────────────────────────────
    t_stat, p_value = stats.ttest_1samp(errors, 0)
    metrics['Bias_tstat'] = t_stat
    metrics['Bias_pvalue'] = p_value
    metrics['Bias_significant'] = p_value < 0.05

    return {k: round(v, 4) if isinstance(v, float) else v for k, v in metrics.items()}


def tracking_signal(actuals: np.ndarray, forecasts: np.ndarray,
                    control_limit: float = 4.0) -> pd.DataFrame:
    """
    Compute cumulative tracking signal. Flags periods exceeding control limit.
    """
    errors   = actuals - forecasts
    cum_err  = np.cumsum(errors)
    mad      = np.array([np.abs(errors[:t+1]).mean() for t in range(len(errors))])
    ts       = cum_err / np.where(mad > 0, mad, np.nan)
    return pd.DataFrame({
        'period': np.arange(1, len(actuals) + 1),
        'error':  errors.round(2),
        'cum_error': cum_err.round(2),
        'MAD':    mad.round(3),
        'tracking_signal': ts.round(3),
        'alert':  np.abs(ts) > control_limit,
    })


# ── Example: compare two models ───────────────────────────────────────────────
np.random.seed(42)
n = 52
actuals   = 100 + 20 * np.sin(2 * np.pi * np.arange(n) / 52) + np.random.normal(0, 8, n)
naive_fc  = np.roll(actuals, 1); naive_fc[0] = actuals[0]
model_fc  = actuals * 0.95 + np.random.normal(0, 5, n)   # slight under-forecast

metrics = compute_sc_metrics(actuals, model_fc, naive_fc)
print("Forecast Error Metrics:")
for k, v in metrics.items():
    print(f"  {k:<22}: {v}")

ts_df = tracking_signal(actuals, model_fc)
alerts = ts_df[ts_df['alert']]
print(f"\\nTracking signal alerts (|TS| > 4): {len(alerts)} periods")
if len(alerts) > 0:
    print(alerts[['period', 'tracking_signal']].to_string(index=False))

# ── Bias correction ───────────────────────────────────────────────────────────
bias = metrics['Bias']
corrected_fc = model_fc + bias
metrics_corrected = compute_sc_metrics(actuals, corrected_fc)
print(f"\\nAfter additive bias correction:")
print(f"  Bias: {metrics_corrected['Bias']:.4f} (was {bias:.4f})")
print(f"  MAE:  {metrics_corrected['MAE']:.3f} (was {metrics['MAE']:.3f})")
`}),e.jsx(N,{references:[{author:"Hyndman, R.J. & Koehler, A.B.",year:2006,title:"Another look at measures of forecast accuracy",journal:"International Journal of Forecasting",volume:"22(4)",pages:"679–688"},{author:"Kolassa, S. & Schütz, W.",year:2007,title:"Advantages of the MAD/Mean ratio over the MAPE",journal:"Foresight: The International Journal of Applied Forecasting",volume:"6",pages:"40–43"}]})]})}const Be=Object.freeze(Object.defineProperty({__proto__:null,default:fe},Symbol.toStringTag,{value:"Module"})),ge=[{safety_stock:0,service_level:.72,excess_units:0},{safety_stock:20,service_level:.83,excess_units:20},{safety_stock:40,service_level:.9,excess_units:40},{safety_stock:65,service_level:.95,excess_units:65},{safety_stock:100,service_level:.975,excess_units:100},{safety_stock:145,service_level:.99,excess_units:145}];function xe(){return e.jsxs(w,{title:"Business Impact Metrics",subject:"Supply Chain Forecasting",difficulty:"intermediate",readingTime:10,children:[e.jsx("p",{children:"Statistical forecast accuracy (MAPE, MASE) is a means to an end — the end being better business outcomes. Supply chain executives care about service levels, inventory turns, working capital, and lost sales. Connecting forecast accuracy improvement to these financial metrics is critical for securing investment in forecasting capabilities and demonstrating ROI."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Service Level vs Inventory Cost Tradeoff"}),e.jsxs(c,{title:"Cycle Service Level (CSL)",children:["The probability of not stocking out during a replenishment cycle:",e.jsx(t.BlockMath,{math:"\\text{CSL} = P(D_L \\leq \\text{Stock}) = \\Phi\\left(\\frac{\\text{SS}}{\\sigma_L}\\right)"}),"where ",e.jsx(t.InlineMath,{math:"\\sigma_L = \\sigma_d \\sqrt{L}"})," is the standard deviation of demand during lead time. Higher CSL requires more safety stock, increasing holding costs."]}),e.jsxs(c,{title:"Fill Rate (FR)",children:["The fraction of demand satisfied immediately from stock (no stockout):",e.jsx(t.BlockMath,{math:"\\text{FR} = 1 - \\frac{\\mathbb{E}[(D - S)^+]}{E[D]}"}),"Fill rate is a more customer-relevant metric than CSL. A CSL of 95% does not mean 95% of units are delivered on time — a single stockout event can span many units. Fill rate directly measures the fraction of demand fulfilled."]}),e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Service Level vs Safety Stock Investment"}),e.jsx("p",{className:"text-sm text-gray-600 mb-3",children:'Each additional point of service level requires exponentially more safety stock investment. The "knee of the curve" around 95% CSL is often the economically optimal point.'}),e.jsx(v,{width:"100%",height:220,children:e.jsxs(I,{data:ge,margin:{top:5,right:20,bottom:20,left:10},children:[e.jsx(b,{strokeDasharray:"3 3"}),e.jsx(j,{dataKey:"service_level",tickFormatter:s=>`${(s*100).toFixed(0)}%`,label:{value:"Cycle Service Level",position:"insideBottom",offset:-10}}),e.jsx(y,{label:{value:"Safety Stock Units",angle:-90,position:"insideLeft"}}),e.jsx(S,{formatter:(s,r)=>[s,r==="excess_units"?"Safety Stock":r]}),e.jsx(A,{dataKey:"excess_units",fill:"#3b82f6",name:"Safety Stock Required"})]})})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Lost Sales Cost"}),e.jsxs(c,{title:"Lost Sales Calculation",children:["Expected annual lost sales cost:",e.jsx(t.BlockMath,{math:"\\text{Lost Sales Cost} = p_{\\text{lost}} \\cdot \\bar{d} \\cdot (1 - \\text{FR}) \\cdot 52"}),"where ",e.jsx(t.InlineMath,{math:"p_{\\text{lost}}"})," is the margin per unit lost (including goodwill),",e.jsx(t.InlineMath,{math:"\\bar{d}"})," is average weekly demand, and ",e.jsx(t.InlineMath,{math:"\\text{FR}"})," is fill rate. A 1% improvement in fill rate on a $50M revenue product with 40% margin saves ~$200K/year."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Excess Inventory Cost"}),e.jsxs(c,{title:"Excess Inventory Cost",children:["Annual cost of carrying excess inventory:",e.jsx(t.BlockMath,{math:"\\text{Holding Cost} = \\underbrace{r_c \\cdot C}_{\\text{capital}} + \\underbrace{r_w \\cdot C}_{\\text{warehouse}} + \\underbrace{r_o \\cdot C}_{\\text{obsolescence}}"}),"where ",e.jsx(t.InlineMath,{math:"C"})," is inventory value, ",e.jsx(t.InlineMath,{math:"r_c \\approx 8\\text{–}12\\%"})," is cost of capital, ",e.jsx(t.InlineMath,{math:"r_w \\approx 3\\text{–}5\\%"})," is warehouse rate, and",e.jsx(t.InlineMath,{math:"r_o"})," is SKU-specific obsolescence risk. Total holding cost is typically 20–30% of inventory value per year."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Value of Forecast Accuracy Improvement"}),e.jsxs(T,{title:"Safety Stock Reduction from Accuracy Improvement",children:["Safety stock scales with forecast error standard deviation. If RMSE improves by a factor",e.jsx(t.InlineMath,{math:"\\rho"}),":",e.jsx(t.BlockMath,{math:"\\text{SS}_{\\text{new}} = \\rho \\cdot \\text{SS}_{\\text{old}}"}),"A 20% reduction in RMSE (ρ = 0.8) reduces safety stock — and therefore holding cost — by 20%. For a $10M inventory with 25% annual holding rate, this saves $500K/year."]}),e.jsxs(B,{title:"ROI Calculation for ML Forecasting Investment",children:["A distributor invests $200K in an ML forecasting system that reduces WMAPE from 28% to 18% (a 36% relative improvement in accuracy):",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsx("li",{children:"Annual inventory value: $15M"}),e.jsx("li",{children:"Safety stock reduction: 25% (proportional to RMSE improvement)"}),e.jsx("li",{children:"Safety stock freed: $15M × 30% (SS fraction) × 25% = $1.125M"}),e.jsx("li",{children:"Annual holding cost saving: $1.125M × 25% = $281K"}),e.jsx("li",{children:"Lost sales reduction: Fill rate improvement 91% → 94.5%, saving $320K"}),e.jsx("li",{children:"Total annual benefit: ~$600K vs $200K investment = 3× first-year ROI"})]})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Value of Information"}),e.jsx("p",{children:"The value-of-information (VOI) framework quantifies how much additional data (more SKUs, longer history, external signals) is worth. If better demand sensing reduces forecast RMSE by a further 10%, the incremental saving can be computed and compared to the data acquisition cost."}),e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"POS data"}),": Point-of-sale data from retailers reduces lead time by providing real-time sell-through — worth capturing even at a cost"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Weather data"}),": For weather-sensitive categories (garden, HVAC, beverages), reducing weather uncertainty can cut RMSE by 5–15%"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Promotional calendars"}),": Accurate promotion data is often worth more than model complexity — a simple model with good promotion features beats a complex model without them"]})]}),e.jsx(C,{children:"The connection between statistical accuracy and business metrics is nonlinear and SKU-dependent. A 10% MAPE improvement on an A-X SKU (high value, stable demand) may save 10× more than the same improvement on a C-Z SKU. Build business impact dashboards that weight forecast improvement by SKU revenue and margin contribution."}),e.jsx(M,{children:"Inventory reduction initiatives and service level improvements can be in conflict. Moving from 95% to 92% CSL reduces safety stock by ~30% but causes a meaningful increase in stockouts. Always model the cost of service reduction before presenting inventory reduction numbers to leadership."}),e.jsx(p,{title:"Business Metrics Calculator",code:`import numpy as np
import pandas as pd
from scipy.stats import norm

def compute_business_metrics(
    avg_weekly_demand: float,
    demand_std: float,
    lead_time_weeks: int,
    unit_margin: float,
    unit_cost: float,
    annual_holding_rate: float = 0.25,
    forecast_rmse: float = None,
    target_csl: float = 0.95,
) -> dict:
    """
    Compute inventory business metrics given demand parameters and cost structure.
    """
    sigma_lt = demand_std * np.sqrt(lead_time_weeks)
    z_csl    = norm.ppf(target_csl)
    safety_stock = z_csl * sigma_lt

    # Fill rate: 1 - E[(D-S)+] / E[D]  (Normal approximation)
    e_stockout = sigma_lt * (norm.pdf(z_csl) - z_csl * (1 - norm.cdf(z_csl)))
    fill_rate  = 1 - e_stockout / (avg_weekly_demand * lead_time_weeks)
    fill_rate  = min(1.0, max(0, fill_rate))

    # Costs
    annual_demand = avg_weekly_demand * 52
    avg_inventory = safety_stock + avg_weekly_demand * lead_time_weeks / 2  # cycle + SS
    holding_cost  = avg_inventory * unit_cost * annual_holding_rate
    lost_sales    = annual_demand * (1 - fill_rate) * unit_margin

    # RMSE-based safety stock
    if forecast_rmse is not None:
        ss_forecast_based = z_csl * forecast_rmse * np.sqrt(lead_time_weeks)
    else:
        ss_forecast_based = safety_stock

    return {
        'safety_stock_units':    round(safety_stock, 1),
        'cycle_service_level':   round(target_csl * 100, 1),
        'fill_rate':             round(fill_rate * 100, 2),
        'avg_inventory_value':   round(avg_inventory * unit_cost, 0),
        'annual_holding_cost':   round(holding_cost, 0),
        'annual_lost_sales':     round(lost_sales, 0),
        'total_annual_cost':     round(holding_cost + lost_sales, 0),
        'ss_if_forecast_rmse':   round(ss_forecast_based, 1),
    }

def roi_of_accuracy_improvement(
    current_metrics: dict,
    new_rmse: float,
    current_rmse: float,
    investment: float,
    z_csl: float = 1.645,
    unit_cost: float = 50.0,
    annual_holding_rate: float = 0.25,
) -> dict:
    """Estimate ROI of improving forecast accuracy."""
    rmse_ratio        = new_rmse / current_rmse
    ss_reduction_pct  = 1 - rmse_ratio
    ss_saved_units    = current_metrics['safety_stock_units'] * ss_reduction_pct
    ss_value_freed    = ss_saved_units * unit_cost
    holding_saving    = ss_value_freed * annual_holding_rate
    annual_benefit    = holding_saving   # simplified (could add fill rate improvement)
    roi               = (annual_benefit - investment) / investment * 100

    return {
        'rmse_improvement_pct': round((1 - rmse_ratio) * 100, 1),
        'ss_freed_units':       round(ss_saved_units, 1),
        'ss_value_freed':       round(ss_value_freed, 0),
        'annual_holding_saving': round(holding_saving, 0),
        'first_year_roi_pct':   round(roi, 1),
    }


# ── Example: high-value consumer electronics SKU ─────────────────────────────
metrics_95 = compute_business_metrics(
    avg_weekly_demand=200, demand_std=40, lead_time_weeks=4,
    unit_margin=80, unit_cost=150, target_csl=0.95
)
metrics_97 = compute_business_metrics(
    avg_weekly_demand=200, demand_std=40, lead_time_weeks=4,
    unit_margin=80, unit_cost=150, target_csl=0.97
)

print("=== SKU Business Metrics ===")
print(f"{'Metric':<30} {'CSL=95%':>12} {'CSL=97%':>12}")
for k in metrics_95:
    print(f"{k:<30} {metrics_95[k]:>12} {metrics_97[k]:>12}")

# ── ROI of ML forecasting ─────────────────────────────────────────────────────
roi = roi_of_accuracy_improvement(
    current_metrics=metrics_95,
    new_rmse=32,           # after ML (RMSE drops from 40 to 32 = 20% improvement)
    current_rmse=40,
    investment=200_000,
    unit_cost=150,
)
print("\\n=== ROI of Forecast Accuracy Improvement ===")
for k, v in roi.items():
    print(f"  {k}: {v}")

# ── Portfolio-level analysis ──────────────────────────────────────────────────
skus = [
    {'sku': 'SKU_A', 'weekly_demand': 500, 'std': 80, 'lt': 2, 'margin': 100, 'cost': 200},
    {'sku': 'SKU_B', 'weekly_demand': 50, 'std': 30, 'lt': 6, 'margin': 40, 'cost': 80},
    {'sku': 'SKU_C', 'weekly_demand': 1000, 'std': 200, 'lt': 1, 'margin': 20, 'cost': 30},
]

portfolio = []
for sku in skus:
    m = compute_business_metrics(sku['weekly_demand'], sku['std'], sku['lt'],
                                  sku['margin'], sku['cost'])
    portfolio.append({'SKU': sku['sku'], **m})

df = pd.DataFrame(portfolio)
print("\\n=== Portfolio Business Metrics ===")
print(df[['SKU', 'fill_rate', 'annual_holding_cost', 'annual_lost_sales', 'total_annual_cost']].to_string(index=False))
print(f"\\nTotal portfolio annual cost: \${df['total_annual_cost'].sum():,.0f}")
`}),e.jsx(N,{references:[{author:"Chopra, S. & Meindl, P.",year:2021,title:"Supply Chain Management: Strategy, Planning, and Operation (7th ed.)",publisher:"Pearson"},{author:"Simchi-Levi, D., Kaminsky, P., & Simchi-Levi, E.",year:2021,title:"Designing and Managing the Supply Chain (3rd ed.)",publisher:"McGraw-Hill"}]})]})}const Ie=Object.freeze(Object.defineProperty({__proto__:null,default:xe},Symbol.toStringTag,{value:"Module"}));export{Se as a,ke as b,we as c,Me as d,Ne as e,Ce as f,Ae as g,Te as h,Be as i,Ie as j,je as s};
