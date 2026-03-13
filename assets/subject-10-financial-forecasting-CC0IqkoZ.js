import{r as j,j as e}from"./vendor-CnSysweu.js";import{r as t}from"./vendor-katex-CdqB51LS.js";import{S as f,P as n,T as v,N as g,W as x,R as _,D as o,E as F}from"./subject-01-ts-foundations-fmj7uPpc.js";import{R as c,L as k,C as m,X as h,Y as l,T as p,d as R,a as d,B as b,c as y,A,e as S}from"./vendor-charts-BucFqer8.js";const B=[{name:"Jan MRR",value:5e5,base:0,color:"#6366f1"},{name:"+ New",value:45e3,base:5e5,color:"#22c55e"},{name:"+ Expansion",value:22e3,base:545e3,color:"#10b981"},{name:"- Contraction",value:-8e3,base:559e3,color:"#f59e0b"},{name:"- Churn",value:-18e3,base:551e3,color:"#ef4444"},{name:"Feb MRR",value:541e3,base:0,color:"#6366f1"}],V=[{month:"Jan",base:500,bull:500,bear:500},{month:"Feb",base:541,bull:555,bear:520},{month:"Mar",base:584,bull:612,bear:542},{month:"Apr",base:630,bull:672,bear:566},{month:"May",base:680,bull:740,bear:589},{month:"Jun",base:734,bull:814,bear:614}],q=[{month:"Q1",price:49,volume:1020,revenue:49980},{month:"Q2",price:52,volume:1085,revenue:56420},{month:"Q3",price:52,volume:1150,revenue:59800},{month:"Q4",price:55,volume:1240,revenue:68200}];function I(){const[r,i]=j.useState("bottom-up");return e.jsxs(f,{title:"Revenue Forecasting Methods",difficulty:"intermediate",readingTime:30,prerequisites:["Time Series Basics","Business Metrics","Python/pandas"],children:[e.jsx("p",{children:"Revenue forecasting sits at the intersection of finance, statistics, and business strategy. Unlike demand forecasting for physical goods, revenue forecasts must account for pricing dynamics, customer cohort behavior, macroeconomic indicators, and strategic decisions. The choice of method depends on your business model."}),e.jsx("h2",{children:"Forecasting Approaches"}),e.jsx("div",{className:"flex gap-2 flex-wrap my-4",children:[["bottom-up","Bottom-Up"],["top-down","Top-Down"],["middle-out","Middle-Out"],["driver","Driver-Based"]].map(([a,s])=>e.jsx("button",{onClick:()=>i(a),className:`px-3 py-1 rounded text-sm font-medium ${r===a?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:s},a))}),r==="bottom-up"&&e.jsxs("div",{className:"bg-blue-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold text-blue-800 mb-2",children:"Bottom-Up Forecasting"}),e.jsx("p",{className:"text-sm text-blue-700 mb-2",children:"Forecast at the most granular level (product × geography × channel) and sum up. Captures heterogeneity across segments. Best when you have strong granular data."}),e.jsxs("p",{className:"text-sm font-mono text-blue-600",children:["Revenue = Σᵢ (units_i × price_i) for all i ∈ ","{products × channels}"]}),e.jsx("p",{className:"text-sm text-blue-700 mt-2",children:"Pros: Accurate at segment level, explainable. Cons: Error accumulation across many SKUs, expensive computationally."})]}),r==="top-down"&&e.jsxs("div",{className:"bg-green-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold text-green-800 mb-2",children:"Top-Down Forecasting"}),e.jsx("p",{className:"text-sm text-green-700 mb-2",children:"Forecast total revenue first, then allocate down to segments using historical proportions or market share assumptions."}),e.jsx("p",{className:"text-sm font-mono text-green-600",children:"Segment_i = Total_Revenue × share_i (historical or modeled)"}),e.jsx("p",{className:"text-sm text-green-700 mt-2",children:"Pros: Simple, stable. Cons: Ignores segment-level dynamics, misses shifts in mix."})]}),r==="middle-out"&&e.jsxs("div",{className:"bg-yellow-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold text-yellow-800 mb-2",children:"Middle-Out Forecasting"}),e.jsx("p",{className:"text-sm text-yellow-700 mb-2",children:"Forecast at an intermediate level (e.g., product category or region), then extrapolate both up (to total) and down (to individual SKUs/stores)."}),e.jsx("p",{className:"text-sm text-yellow-700 mt-2",children:"Pros: Balances accuracy and effort. Commonly used in retail where category-level data is more reliable than SKU-level."})]}),r==="driver"&&e.jsxs("div",{className:"bg-purple-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold text-purple-800 mb-2",children:"Driver-Based Forecasting"}),e.jsx("p",{className:"text-sm text-purple-700 mb-2",children:"Decompose revenue into its business drivers and forecast each driver separately:"}),e.jsx(t.BlockMath,{math:"\\text{Revenue} = \\text{Price} \\times \\text{Volume}"}),e.jsx(t.BlockMath,{math:"\\text{Volume} = \\text{Customers} \\times \\text{Units/Customer}"}),e.jsx("p",{className:"text-sm text-purple-700 mt-2",children:"Pros: Connects forecasting to business decisions (pricing, marketing). Cons: Requires forecasting each driver accurately."})]}),e.jsx("h2",{children:"Revenue Driver Decomposition"}),e.jsx("p",{children:"The fundamental decomposition for product revenue:"}),e.jsx(t.BlockMath,{math:"R_t = P_t \\times Q_t"}),e.jsx("p",{children:"Year-over-year growth can be decomposed:"}),e.jsx(t.BlockMath,{math:"\\frac{\\Delta R}{R} = \\frac{\\Delta P}{P} + \\frac{\\Delta Q}{Q} + \\frac{\\Delta P \\cdot \\Delta Q}{P \\cdot Q}"}),e.jsxs("p",{children:["The cross-term (",e.jsx(t.InlineMath,{math:"\\Delta P \\cdot \\Delta Q / P \\cdot Q"}),") is negligible for small changes but matters for large pricing/volume moves."]}),e.jsxs("div",{className:"my-4",children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-600 mb-2",children:"Price × Volume = Revenue (quarterly)"}),e.jsx(c,{width:"100%",height:220,children:e.jsxs(k,{data:q,children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"month"}),e.jsx(l,{yAxisId:"left"}),e.jsx(l,{yAxisId:"right",orientation:"right"}),e.jsx(p,{}),e.jsx(R,{}),e.jsx(d,{yAxisId:"left",type:"monotone",dataKey:"price",stroke:"#6366f1",strokeWidth:2,dot:{r:4},name:"Price ($)"}),e.jsx(d,{yAxisId:"left",type:"monotone",dataKey:"volume",stroke:"#22c55e",strokeWidth:2,dot:{r:4},name:"Volume (units)"})]})})]}),e.jsx("h2",{children:"SaaS Cohort Analysis: MRR Forecasting"}),e.jsx("p",{children:"For subscription businesses, the MRR waterfall model is the standard:"}),e.jsx(t.BlockMath,{math:"\\text{MRR}_{t+1} = \\text{MRR}_t + \\text{New MRR} + \\text{Expansion MRR} - \\text{Contraction MRR} - \\text{Churn MRR}"}),e.jsxs("div",{className:"my-4",children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-600 mb-2",children:"MRR Waterfall: January to February"}),e.jsx(c,{width:"100%",height:240,children:e.jsxs(b,{data:B,children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"name",tick:{fontSize:11}}),e.jsx(l,{tickFormatter:a=>`$${(a/1e3).toFixed(0)}k`}),e.jsx(p,{formatter:a=>`$${(a/1e3).toFixed(0)}k`}),e.jsx(y,{dataKey:"value",name:"MRR Component",children:B.map((a,s)=>e.jsx("rect",{fill:a.color},s))})]})})]}),e.jsx("h2",{children:"Scenario Planning"}),e.jsx("p",{children:"Scenario planning quantifies the range of outcomes under different business assumptions. A standard three-scenario framework:"}),e.jsxs("ul",{className:"list-disc pl-6 my-3 space-y-1",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Base"}),": Most likely outcome; uses median assumptions for growth, churn, pricing."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bull"}),": Optimistic scenario; assumes higher growth, lower churn, successful upsells."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bear"}),": Pessimistic scenario; slower growth, elevated churn, pricing pressure."]})]}),e.jsx(c,{width:"100%",height:250,children:e.jsxs(k,{data:V,children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"month"}),e.jsx(l,{tickFormatter:a=>`$${a}k`}),e.jsx(p,{formatter:a=>`$${a}k`}),e.jsx(R,{}),e.jsx(d,{type:"monotone",dataKey:"bull",stroke:"#22c55e",strokeWidth:2,strokeDasharray:"6 3",dot:!1,name:"Bull (+22% growth)"}),e.jsx(d,{type:"monotone",dataKey:"base",stroke:"#6366f1",strokeWidth:2,dot:!1,name:"Base (+15% growth)"}),e.jsx(d,{type:"monotone",dataKey:"bear",stroke:"#ef4444",strokeWidth:2,strokeDasharray:"6 3",dot:!1,name:"Bear (+8% growth)"})]})}),e.jsx("h2",{children:"Python: Revenue Decomposition Model"}),e.jsx(n,{code:`import pandas as pd
import numpy as np
import statsmodels.api as sm

# ── 1. Build historical MRR dataset ───────────────────────────────────
np.random.seed(42)
months = pd.date_range('2020-01', periods=48, freq='MS')

# Simulate SaaS MRR dynamics
mrr = [100_000]
new_mrr_rate = 0.12      # 12% of MRR from new customers
expansion_rate = 0.03    # 3% of MRR from expansion
churn_rate = 0.025       # 2.5% monthly churn
records = [{'month': months[0], 'mrr': mrr[0], 'new': 0, 'expansion': 0,
            'contraction': 0, 'churn': 0}]

for i in range(1, len(months)):
    prev = mrr[-1]
    new = prev * new_mrr_rate * (1 + np.random.normal(0, 0.15))
    exp = prev * expansion_rate * (1 + np.random.normal(0, 0.2))
    con = prev * 0.005 * (1 + np.random.normal(0, 0.3))
    churn = prev * churn_rate * (1 + np.random.normal(0, 0.2))
    current = prev + new + exp - con - churn
    mrr.append(current)
    records.append({'month': months[i], 'mrr': current, 'new': new,
                    'expansion': exp, 'contraction': con, 'churn': churn})

df = pd.DataFrame(records).set_index('month')
print(df.tail())

# Net revenue retention (NRR): how much of last month's MRR do we retain + expand?
df['nrr'] = (df['mrr'] - df['new']) / df['mrr'].shift(1)
print(f"\\nMedian NRR: {df['nrr'].median():.1%}")  # healthy SaaS: >100%`}),e.jsx(n,{code:`# ── 2. ETS forecast for each MRR component ────────────────────────────
from statsforecast import StatsForecast
from statsforecast.models import AutoETS, AutoARIMA

# Reshape to long format for statsforecast
components = ['new', 'expansion', 'churn']
long_dfs = []
for comp in components:
    tmp = df[[comp]].reset_index()
    tmp.columns = ['ds', 'y']
    tmp['unique_id'] = comp
    long_dfs.append(tmp)
sf_df = pd.concat(long_dfs)

sf = StatsForecast(
    models=[AutoETS(season_length=12), AutoARIMA(season_length=12)],
    freq='MS', n_jobs=-1,
)
forecasts = sf.forecast(df=sf_df, h=12)

# Reassemble MRR forecast from components
comp_forecasts = forecasts.pivot(index='ds', columns='unique_id', values='AutoETS')
last_mrr = df['mrr'].iloc[-1]
comp_forecasts['mrr_forecast'] = (
    last_mrr
    + comp_forecasts['new'].cumsum()
    + comp_forecasts['expansion'].cumsum()
    - comp_forecasts['churn'].cumsum()
)
print(comp_forecasts[['new', 'expansion', 'churn', 'mrr_forecast']].head())`}),e.jsx(n,{code:`# ── 3. Regression with economic indicators ────────────────────────────
# Revenue often correlates with macro conditions
import statsmodels.api as sm

# Simulate macro indicators
df['gdp_growth'] = np.random.normal(0.025, 0.01, len(df))
df['unemployment'] = np.clip(np.cumsum(np.random.normal(0, 0.001, len(df))) + 0.04, 0.02, 0.12)
df['log_mrr'] = np.log(df['mrr'])

# Lagged regression (macro affects revenue with 1-2 month lag)
df['gdp_lag1'] = df['gdp_growth'].shift(1)
df['unemp_lag2'] = df['unemployment'].shift(2)

model_df = df[['log_mrr', 'gdp_lag1', 'unemp_lag2']].dropna()
X = sm.add_constant(model_df[['gdp_lag1', 'unemp_lag2']])
y = model_df['log_mrr']

result = sm.OLS(y, X).fit()
print(result.summary())

# Scenario forecasting using economic assumptions
scenarios = {
    'Base':  {'gdp_lag1': 0.025, 'unemp_lag2': 0.04},
    'Bull':  {'gdp_lag1': 0.040, 'unemp_lag2': 0.035},
    'Bear':  {'gdp_lag1': 0.010, 'unemp_lag2': 0.055},
}
for name, inputs in scenarios.items():
    x_scenario = [1.0, inputs['gdp_lag1'], inputs['unemp_lag2']]
    pred = np.exp(result.predict(x_scenario)[0])
    print(f"{name} scenario MRR: \${pred:,.0f}")`}),e.jsxs(v,{title:"Net Revenue Retention (NRR) as the Core Metric",children:["For SaaS businesses, NRR is the single most important predictor of long-run revenue. NRR > 100% means existing customers collectively expand more than they churn — the business grows even with zero new customer acquisition.",e.jsx(t.BlockMath,{math:"\\text{NRR}_t = \\frac{\\text{MRR}_t - \\text{New MRR}_t}{\\text{MRR}_{t-1}}"}),"Best-in-class SaaS companies (Snowflake, Datadog) have NRR > 130%. Rule-of-thumb: NRR > 110% usually indicates product-market fit."]}),e.jsx(g,{children:"For quarterly or annual revenue forecasting, always decompose into at least 2–3 components (new business, renewals/expansion, price changes) and forecast each separately. Mixing these in a single time series loses explanatory power and makes scenario analysis impossible."}),e.jsx(x,{children:"Regression models with macro indicators can appear accurate in-sample but fail out-of-sample. Always validate with rolling walk-forward cross-validation, not just in-sample R². Also test for look-ahead bias: macro indicators may be revised after initial release."}),e.jsx(_,{references:[{authors:"Lim, M.",year:2021,title:"Financial Forecasting for New and Emerging Businesses",journal:"Kogan Page"},{authors:"Mauboussin, M.J., Callahan, D.",year:2018,title:"What Does a Price-Earnings Multiple Mean?",journal:"Credit Suisse Global Financial Strategies"}]})]})}const fe=Object.freeze(Object.defineProperty({__proto__:null,default:I},Symbol.toStringTag,{value:"Module"}));function P(){const[r]=j.useState(500),i=8,a=10,s=.05,u=.08,T=[];for(let w=0;w<i;w++){const M=Array.from({length:r},()=>{let N=a;for(let C=0;C<=w;C++)N*=1+(s+u*(Math.random()<.5?1:-1)*Math.abs(D()));return N}).sort((N,C)=>N-C);T.push({quarter:`Q${w+1}`,p10:+M[Math.floor(r*.1)].toFixed(2),p25:+M[Math.floor(r*.25)].toFixed(2),p50:+M[Math.floor(r*.5)].toFixed(2),p75:+M[Math.floor(r*.75)].toFixed(2),p90:+M[Math.floor(r*.9)].toFixed(2)})}return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border",children:[e.jsx("h3",{className:"text-lg font-semibold mb-1",children:"Monte Carlo Revenue Fan Chart (8 Quarters)"}),e.jsx("p",{className:"text-sm text-gray-600 mb-3",children:"Base revenue $10M. Growth ~ N(5%, 8%). Shaded bands show P10–P90 and P25–P75 confidence intervals."}),e.jsx(c,{width:"100%",height:260,children:e.jsxs(A,{data:T,margin:{top:5,right:20,bottom:20,left:10},children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"quarter"}),e.jsx(l,{label:{value:"Revenue ($M)",angle:-90,position:"insideLeft"}}),e.jsx(p,{}),e.jsx(S,{dataKey:"p90",fill:"#dbeafe",stroke:"none",name:"P90",stackId:"a"}),e.jsx(S,{dataKey:"p75",fill:"#93c5fd",stroke:"none",name:"P75",stackId:"b"}),e.jsx(S,{dataKey:"p50",fill:"#3b82f6",stroke:"#1d4ed8",name:"Median",fillOpacity:.6}),e.jsx(d,{dataKey:"p10",stroke:"#1e40af",strokeDasharray:"4 2",dot:!1,name:"P10"})]})})]})}function D(){let r=0,i=0;for(;r===0;)r=Math.random();for(;i===0;)i=Math.random();return Math.sqrt(-2*Math.log(r))*Math.cos(2*Math.PI*i)}function z(){return e.jsxs(f,{title:"Scenario Planning and Simulation",subject:"Financial Forecasting",difficulty:"intermediate",readingTime:11,children:[e.jsx("p",{children:'Point forecasts are a fiction: the future is uncertain and a single number conveys false precision. Scenario planning and Monte Carlo simulation replace point forecasts with distributions, ranges, and structured "what-if" analyses. For financial planning, this shift enables better resource allocation, risk-adjusted decision making, and stress-testing of strategic plans.'}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Structured Scenario Analysis"}),e.jsxs(o,{title:"Bear / Base / Bull Scenarios",children:["The simplest scenario framework uses three cases:",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Bull (upside)"}),": Favorable macro, strong product-market fit, competitive wins. ~20% probability"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Base"}),": Most likely outcome given current trajectory. ~60% probability"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bear (downside)"}),": Macro headwinds, competitive pressure, churn increase. ~20% probability"]})]}),"The expected value is the probability-weighted average:",e.jsx(t.BlockMath,{math:"\\mathbb{E}[\\text{Revenue}] = p_{\\text{bull}} R_{\\text{bull}} + p_{\\text{base}} R_{\\text{base}} + p_{\\text{bear}} R_{\\text{bear}}"})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Monte Carlo Revenue Simulation"}),e.jsx("p",{children:"Monte Carlo simulation replaces discrete scenarios with continuous probability distributions. Each driver (growth rate, churn, average contract value) is modeled as a distribution, and thousands of paths are simulated to build the full revenue distribution."}),e.jsx(P,{}),e.jsxs(v,{title:"Revenue as a Function of Stochastic Drivers",children:["If quarterly revenue growth follows ",e.jsx(t.InlineMath,{math:"g_t \\sim \\mathcal{N}(\\mu_g, \\sigma_g^2)"}),", then projected revenue at quarter ",e.jsx(t.InlineMath,{math:"T"})," is:",e.jsx(t.BlockMath,{math:"R_T = R_0 \\prod_{t=1}^{T}(1 + g_t)"}),"This is a geometric Brownian motion structure. The distribution of ",e.jsx(t.InlineMath,{math:"\\ln R_T"})," is approximately normal with mean ",e.jsx(t.InlineMath,{math:"\\ln R_0 + T\\mu_g"})," and variance",e.jsx(t.InlineMath,{math:"T\\sigma_g^2"}),", so ",e.jsx(t.InlineMath,{math:"R_T"})," is log-normally distributed. The 90% prediction interval widens as ",e.jsx(t.InlineMath,{math:"\\sqrt{T}"})," — uncertainty grows with horizon."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Sensitivity Analysis"}),e.jsx("p",{children:'Sensitivity (or "tornado") analysis identifies which drivers most impact the forecast. For each driver, it asks: if this input moves from its P10 to P90 value, how much does the revenue forecast change?'}),e.jsxs(F,{title:"SaaS Revenue Sensitivity",children:["For a SaaS company with $10M ARR, a sensitivity analysis reveals:",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Net Revenue Retention (NRR)"}),": ±15 points → ±$1.8M revenue impact (highest lever)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"New logo win rate"}),": ±20 points → ±$0.9M impact"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Average deal size"}),": ±25% → ±$0.7M impact"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sales cycle length"}),": ±2 weeks → ±$0.3M impact"]})]}),"The NRR finding focuses management attention on customer success over new logo hunting."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Scenario Weighting and Uncertainty Quantification"}),e.jsx("p",{children:"Scenario probabilities should not be uniform. They should reflect:"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Historical base rates"}),": How often have companies in this industry hit the bull case?"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Current leading indicators"}),": Pipeline coverage, customer health scores, macro signals"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Expert elicitation"}),": Structured expert judgment via the Delphi method or Bayesian prior elicitation"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Calibration"}),": Track historical scenario accuracy and adjust future probability weights"]})]}),e.jsx(g,{children:'A common mistake in scenario planning is making scenarios "different stories" (narrative) rather than "different parameter values" (quantitative). Ensure each scenario maps to specific, measurable driver values that can be tracked in real time. This allows early detection of which scenario is materializing.'}),e.jsx(x,{children:"Correlation between drivers is critical but often ignored in simple Monte Carlo simulations. Revenue, churn, and new logo rates are correlated with macro conditions. Sampling them independently underestimates tail risk (the bear scenario). Use a multivariate distribution (e.g., copula or Cholesky decomposition) to capture correlations."}),e.jsx(n,{title:"Monte Carlo Revenue Simulation",code:`import numpy as np
import pandas as pd
from scipy.stats import norm, lognorm
import matplotlib.pyplot as plt

# ── SaaS revenue simulation model ────────────────────────────────────────────
def simulate_saas_revenue(
    arr_start: float = 10.0,       # starting ARR ($M)
    n_quarters: int  = 8,          # forecast horizon
    n_sims: int      = 10_000,     # Monte Carlo paths
    # Growth drivers (mean, std) per quarter
    new_logo_mu: float   = 1.2,    # $M new ARR per quarter
    new_logo_sd: float   = 0.5,
    nrr_mu: float        = 1.10,   # net revenue retention (>1 = expansion)
    nrr_sd: float        = 0.06,
    seed: int            = 42,
) -> pd.DataFrame:
    """
    Simulate quarterly ARR paths for a SaaS business.
    ARR_t = ARR_{t-1} * NRR_t + NewARR_t
    """
    rng = np.random.default_rng(seed)

    arr_paths = np.zeros((n_sims, n_quarters + 1))
    arr_paths[:, 0] = arr_start

    for q in range(n_quarters):
        nrr     = rng.normal(nrr_mu, nrr_sd, n_sims).clip(0.7, 1.5)
        new_arr = rng.normal(new_logo_mu, new_logo_sd, n_sims).clip(0)
        arr_paths[:, q + 1] = arr_paths[:, q] * nrr + new_arr

    # Compute percentiles across simulations
    quarters = [f'Q{q}' for q in range(n_quarters + 1)]
    pctls = [5, 10, 25, 50, 75, 90, 95]
    results = pd.DataFrame(
        np.percentile(arr_paths, pctls, axis=0).T,
        columns=[f'P{p}' for p in pctls],
        index=quarters
    )
    results['mean'] = arr_paths.mean(axis=0)
    results['std']  = arr_paths.std(axis=0)
    return results, arr_paths

results, paths = simulate_saas_revenue()

print("ARR Forecast (Monte Carlo percentiles, $M):")
print(results[['P10', 'P25', 'P50', 'P75', 'P90']].round(2).to_string())

# ── Scenario analysis: 3 named scenarios ─────────────────────────────────────
scenarios = {
    'Bear': dict(nrr_mu=1.02, nrr_sd=0.04, new_logo_mu=0.6, new_logo_sd=0.2),
    'Base': dict(nrr_mu=1.10, nrr_sd=0.06, new_logo_mu=1.2, new_logo_sd=0.5),
    'Bull': dict(nrr_mu=1.18, nrr_sd=0.05, new_logo_mu=2.0, new_logo_sd=0.6),
}
scenario_probs = {'Bear': 0.20, 'Base': 0.60, 'Bull': 0.20}

scenario_p50 = {}
for name, params in scenarios.items():
    res, _ = simulate_saas_revenue(**params)
    scenario_p50[name] = res['P50'].values

ev = sum(scenario_probs[n] * scenario_p50[n] for n in scenarios)

print("\\nScenario P50 ARR at Q8 ($M):")
for name in scenarios:
    print(f"  {name}: {scenario_p50[name][-1]:.2f}")
print(f"  Expected Value (prob-weighted): {ev[-1]:.2f}")

# ── Sensitivity analysis ──────────────────────────────────────────────────────
def arr_at_horizon(nrr_mu, new_logo_mu, n_quarters=8, n_sims=5000):
    """Return median ARR at horizon for given parameters."""
    rng = np.random.default_rng(0)
    arr = np.full(n_sims, 10.0)
    for _ in range(n_quarters):
        nrr     = rng.normal(nrr_mu, 0.06, n_sims).clip(0.7, 1.5)
        new_arr = rng.normal(new_logo_mu, 0.5, n_sims).clip(0)
        arr     = arr * nrr + new_arr
    return np.median(arr)

base_arr = arr_at_horizon(1.10, 1.20)
sensitivities = {
    'NRR +10pp': arr_at_horizon(1.20, 1.20) - base_arr,
    'NRR -10pp': arr_at_horizon(1.00, 1.20) - base_arr,
    'New logo +50%': arr_at_horizon(1.10, 1.80) - base_arr,
    'New logo -50%': arr_at_horizon(1.10, 0.60) - base_arr,
}

print("\\nSensitivity Analysis (delta ARR at Q8 vs base):")
for k, v in sorted(sensitivities.items(), key=lambda x: abs(x[1]), reverse=True):
    print(f"  {k:<25}: {v:+.2f}M")
`}),e.jsx(_,{references:[{author:"Dixit, A.K. & Pindyck, R.S.",year:1994,title:"Investment under Uncertainty",publisher:"Princeton University Press"},{author:"Glasserman, P.",year:2004,title:"Monte Carlo Methods in Financial Engineering",publisher:"Springer"}]})]})}const ge=Object.freeze(Object.defineProperty({__proto__:null,default:z},Symbol.toStringTag,{value:"Module"})),H=[{stage:"Website Visits",value:5e4,pct:100},{stage:"Leads",value:5e3,pct:10},{stage:"MQLs",value:1500,pct:3},{stage:"SQLs",value:600,pct:1.2},{stage:"Opportunities",value:200,pct:.4},{stage:"Closed Won",value:60,pct:.12}];function K(){return e.jsxs(f,{title:"KPI and Driver Forecasting",subject:"Financial Forecasting",difficulty:"intermediate",readingTime:11,children:[e.jsx("p",{children:"Driver-based forecasting builds revenue projections from the ground up using the underlying business mechanics: marketing generates leads, sales converts them, customers generate recurring revenue, and customer success retains them. Forecasting each driver separately and linking them through a structured model produces more interpretable, more actionable, and — when done well — more accurate forecasts than extrapolating revenue in aggregate."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Driver-Based Revenue Architecture"}),e.jsxs(o,{title:"Revenue Decomposition",children:["For a subscription business:",e.jsx(t.BlockMath,{math:"\\text{MRR}_t = \\text{MRR}_{t-1} \\cdot (1 + \\text{Expansion Rate} - \\text{Churn Rate}) + \\text{New MRR}_t"}),"where New MRR depends on the sales funnel:",e.jsx(t.BlockMath,{math:"\\text{New MRR}_t = \\text{SQLs}_t \\times \\text{Win Rate}_t \\times \\text{ACV}_t / 12"}),"Each driver can be independently modeled and updated from its own data sources."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Conversion Funnel Forecasting"}),e.jsx("p",{children:"The sales funnel provides a natural hierarchy of leading indicators. Each stage's conversion rate can be modeled historically and forecast forward:"}),e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border overflow-x-auto",children:[e.jsx("h3",{className:"text-lg font-semibold mb-3",children:"Conversion Funnel Structure"}),e.jsx("div",{className:"space-y-2",children:H.map((r,i)=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-36 text-sm font-medium text-right",children:r.stage}),e.jsx("div",{className:"flex-1 bg-gray-200 rounded-full h-7 relative",children:e.jsx("div",{className:"h-7 rounded-full flex items-center justify-end pr-2 text-xs text-white font-semibold",style:{width:`${r.pct*10}%`,backgroundColor:`hsl(${220-i*30}, 70%, 50%)`,minWidth:"2rem"},children:r.value.toLocaleString()})}),e.jsxs("div",{className:"w-16 text-xs text-gray-500 text-right",children:[r.pct,"%"]})]},i))})]}),e.jsxs(o,{title:"Stage Conversion Rate Forecasting",children:["Let ",e.jsx(t.InlineMath,{math:"c_s^{(t)}"})," be the conversion rate from stage ",e.jsx(t.InlineMath,{math:"s"})," to",e.jsx(t.InlineMath,{math:"s+1"})," at time ",e.jsx(t.InlineMath,{math:"t"}),". Model each rate using exponential smoothing or regression on drivers (e.g., ICP match rate, competitive win rate):",e.jsx(t.BlockMath,{math:"\\hat{c}_s^{(t+h)} = f(\\text{sales rep tenure, product fit score, competitive landscape})"}),"Pipeline coverage ratio (SQL pipeline / revenue target) is the most predictive short-term indicator."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Leading Indicators for Revenue"}),e.jsx("p",{children:"Revenue lags leading indicators by a predictable lag structure that varies by business type:"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-2 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Web traffic → Leads"}),": 0–2 week lag. High volume, noisy."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MQLs → SQLs"}),": 1–4 week lag depending on SDR capacity."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"SQLs → Opportunities"}),": 2–8 week lag depending on qualification speed."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Opportunities → Closed Won"}),": 30–90 day average sales cycle."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Customer health score → Churn"}),": 60–90 day leading indicator for churn events."]})]}),e.jsxs(F,{title:"Pipeline Coverage as Revenue Leading Indicator",children:["A B2B SaaS company tracks quarterly pipeline coverage ratio = (open pipeline value) / (revenue target). Historical data shows:",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsx("li",{children:"Coverage ratio > 3×: 90% probability of hitting quarterly target"}),e.jsx("li",{children:"Coverage ratio 2–3×: 65% probability"}),e.jsx("li",{children:"Coverage ratio < 2×: 35% probability"})]}),"By forecasting pipeline progression each week (using age-based conversion curves), the model provides a confidence-weighted revenue forecast 6–10 weeks into the future."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Customer Lifetime Value Prediction"}),e.jsxs(o,{title:"BG/NBD Model for CLV",children:["The BG/NBD (Beta-Geometric / Negative Binomial Distribution) model predicts future transaction counts for individual customers given their past transaction history:",e.jsx(t.BlockMath,{math:"\\mathbb{E}[Y | \\text{history}] = \\sum_{t=1}^{T} P(\\text{alive at t}) \\times \\mathbb{E}[\\text{purchases} | \\text{alive}]"}),"Paired with a Gamma-Gamma spend model, it predicts CLV at the individual customer level. This is the foundation for customer cohort revenue forecasting and prioritizing retention efforts."]}),e.jsx(g,{children:"Driver-based models are only as good as the conversion rate assumptions. Conversion rates shift with: macroeconomic environment, competitive dynamics, product-market fit changes, and rep quality changes. Build an alert system that flags when any funnel stage conversion rate deviates more than 2 standard deviations from its rolling 90-day average — this is usually the first sign of a structural change."}),e.jsx(x,{children:'The biggest driver-based forecasting failure mode is "garbage in, garbage out" — if CRM data quality is poor (deals not updated, stages misused, duplicate contacts), the pipeline forecast will be unreliable. Invest in CRM hygiene and data governance before building sophisticated pipeline models. A simple model with clean data outperforms a sophisticated model with dirty data.'}),e.jsx(n,{title:"Driver-Based Revenue Model",code:`import numpy as np
import pandas as pd
from scipy.special import gammaln
from scipy.optimize import minimize

# ── Driver-based MRR forecasting ─────────────────────────────────────────────
class DriverBasedMRRModel:
    """
    Forecast MRR using: New MRR (from pipeline), Expansion, Churn.
    All rates are independently forecast using exponential smoothing.
    """
    def __init__(self, alpha: float = 0.3):
        self.alpha = alpha
        self.churn_rate    = None
        self.expansion_rate = None

    def fit(self, mrr_history: pd.DataFrame):
        """
        mrr_history: DataFrame with columns [date, mrr, new_mrr, expansion_mrr, churned_mrr]
        """
        df = mrr_history.copy().sort_values('date')
        # Compute rates
        df['churn_rate']     = df['churned_mrr'] / df['mrr'].shift(1)
        df['expansion_rate'] = df['expansion_mrr'] / df['mrr'].shift(1)
        df = df.dropna()

        # Exponential smoothing estimates
        self.churn_rate     = df['churn_rate'].ewm(alpha=self.alpha).mean().iloc[-1]
        self.expansion_rate = df['expansion_rate'].ewm(alpha=self.alpha).mean().iloc[-1]
        self.last_mrr       = df['mrr'].iloc[-1]
        self.avg_new_mrr    = df['new_mrr'].ewm(alpha=self.alpha).mean().iloc[-1]
        return self

    def predict(self, h: int, scenario: str = 'base') -> pd.DataFrame:
        """Forecast h months forward. scenario in ['bear', 'base', 'bull']."""
        scenario_adj = {'bear': 0.75, 'base': 1.0, 'bull': 1.25}
        adj = scenario_adj[scenario]

        forecasts = []
        mrr = self.last_mrr
        for i in range(1, h + 1):
            churn     = mrr * self.churn_rate
            expansion = mrr * self.expansion_rate * adj
            new_mrr   = self.avg_new_mrr * adj
            mrr       = mrr - churn + expansion + new_mrr
            forecasts.append({
                'month': i,
                'mrr': round(mrr, 2),
                'churn': round(churn, 2),
                'expansion': round(expansion, 2),
                'new_mrr': round(new_mrr, 2),
            })
        return pd.DataFrame(forecasts)


# ── Generate synthetic MRR history ───────────────────────────────────────────
np.random.seed(42)
n_months = 24
mrr_start = 500_000  # $500K MRR

dates, mrr_vals, new_mrr, exp_mrr, churn_mrr = [], [], [], [], []
mrr = mrr_start
for i in range(n_months):
    new   = np.random.normal(40_000, 8_000)
    exp   = mrr * np.random.normal(0.04, 0.01)
    churn = mrr * np.random.normal(0.025, 0.005)
    mrr   = mrr + new + exp - churn
    dates.append(pd.Timestamp('2022-01-01') + pd.DateOffset(months=i))
    mrr_vals.append(round(mrr, 0))
    new_mrr.append(round(new, 0))
    exp_mrr.append(round(exp, 0))
    churn_mrr.append(round(abs(churn), 0))

history = pd.DataFrame({'date': dates, 'mrr': mrr_vals,
                         'new_mrr': new_mrr, 'expansion_mrr': exp_mrr,
                         'churned_mrr': churn_mrr})

# ── Fit and forecast ──────────────────────────────────────────────────────────
model = DriverBasedMRRModel(alpha=0.3).fit(history)
print(f"Fitted rates: Churn={model.churn_rate:.2%}, Expansion={model.expansion_rate:.2%}")

scenarios = {}
for scenario in ['bear', 'base', 'bull']:
    scenarios[scenario] = model.predict(h=12, scenario=scenario)

print("\\n12-Month MRR Forecast by Scenario:")
comparison = pd.DataFrame({
    'Month': scenarios['base']['month'],
    'Bear MRR': scenarios['bear']['mrr'],
    'Base MRR': scenarios['base']['mrr'],
    'Bull MRR': scenarios['bull']['mrr'],
})
print(comparison.to_string(index=False))

# ── Funnel-based new logo pipeline model ─────────────────────────────────────
def pipeline_forecast(
    monthly_visitors: int,
    lead_rate: float = 0.10,
    mql_rate: float  = 0.30,
    sql_rate: float  = 0.40,
    opp_rate: float  = 0.33,
    win_rate: float  = 0.30,
    avg_contract_value: float = 60_000,  # ACV
    sales_cycle_months: int = 3,
) -> dict:
    leads = monthly_visitors * lead_rate
    mqls  = leads * mql_rate
    sqls  = mqls * sql_rate
    opps  = sqls * opp_rate
    wins  = opps * win_rate
    new_arr_per_month = wins * avg_contract_value / sales_cycle_months
    return {
        'monthly_visitors': monthly_visitors,
        'leads':  round(leads), 'MQLs': round(mqls),
        'SQLs':   round(sqls),  'Opps': round(opps),
        'wins':   round(wins),
        'new_arr_per_month': round(new_arr_per_month, 0),
    }

funnel = pipeline_forecast(monthly_visitors=50_000)
print("\\nPipeline Funnel Forecast:")
for k, v in funnel.items():
    print(f"  {k}: {v:,}" if isinstance(v, (int, float)) else f"  {k}: {v}")
`}),e.jsx(_,{references:[{author:"Fader, P.S., Hardie, B.G.S., & Lee, K.L.",year:2005,title:'"Counting your customers" the easy way: An alternative to the Pareto/NBD model',journal:"Marketing Science",volume:"24(2)",pages:"275–284"},{author:"Lim, C. & Hyndman, R.J.",year:2021,title:"Hierarchical and coherent forecasting for financial planning",journal:"International Journal of Forecasting"}]})]})}const xe=Object.freeze(Object.defineProperty({__proto__:null,default:K},Symbol.toStringTag,{value:"Module"})),L=[{month:"Jan",winner:2.3,loser:-1.8,spread:4.1},{month:"Feb",winner:1.9,loser:-2.1,spread:4},{month:"Mar",winner:-1.2,loser:-3.5,spread:2.3},{month:"Apr",winner:3.1,loser:.4,spread:2.7},{month:"May",winner:2.8,loser:-1.5,spread:4.3},{month:"Jun",winner:1.5,loser:-2.8,spread:4.3}],E=[{factor:"Momentum (12-1)",t_stat:4.8},{factor:"Value (B/M)",t_stat:3.9},{factor:"Size (SMB)",t_stat:3.1},{factor:"Quality (ROE)",t_stat:2.8},{factor:"Low Vol",t_stat:2.5},{factor:"Liquidity",t_stat:2.1}];function G(){const[r,i]=j.useState("semi-strong");return e.jsxs(f,{title:"Stock Return Prediction",difficulty:"advanced",readingTime:35,prerequisites:["Financial Time Series","Factor Models","Statistical Inference"],children:[e.jsx("p",{children:'Predicting stock returns is the central problem of quantitative finance and one of the most difficult prediction tasks in machine learning. Returns have extremely low signal-to-noise ratio, are non-stationary, and exhibit properties (fat tails, volatility clustering, structural breaks) that violate most ML assumptions. Yet the factor zoo has grown to 400+ published "anomalies" — most of which are the product of data mining.'}),e.jsx("h2",{children:"The Efficient Market Hypothesis"}),e.jsx("div",{className:"flex gap-2 my-4",children:[["weak","Weak Form"],["semi-strong","Semi-Strong"],["strong","Strong Form"]].map(([a,s])=>e.jsx("button",{onClick:()=>i(a),className:`px-3 py-1 rounded text-sm font-medium ${r===a?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:s},a))}),r==="weak"&&e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold mb-1",children:"Weak Form EMH"}),e.jsxs("p",{className:"text-sm",children:["Current prices reflect all ",e.jsx("em",{children:"past price"})," information. Technical analysis (chart patterns, moving average crossovers) cannot generate alpha.",e.jsx("strong",{children:" Evidence"}),": largely confirmed — autocorrelation of daily returns is near zero. However, momentum at the 3–12 month horizon violates weak-form EMH."]})]}),r==="semi-strong"&&e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold mb-1",children:"Semi-Strong Form EMH"}),e.jsxs("p",{className:"text-sm",children:["Prices reflect all ",e.jsx("em",{children:"publicly available"})," information. Fundamental analysis cannot generate alpha. ",e.jsx("strong",{children:"Evidence"}),': mixed — anomalies (momentum, value, size) persist in some markets. Post-earnings drift (PEAD) is a well-documented violation. Most violations shrink after publication ("factor decay").']})]}),r==="strong"&&e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold mb-1",children:"Strong Form EMH"}),e.jsxs("p",{className:"text-sm",children:["Prices reflect ",e.jsx("em",{children:"all"})," information, including private/insider information.",e.jsx("strong",{children:" Evidence"}),": rejected — insider trading is profitable (though illegal). Corporate insiders filing Form 4 trades outperform the market by 5–10% annually."]})]}),e.jsx("h2",{children:"Cross-Sectional Momentum"}),e.jsx("p",{children:"Jegadeesh & Titman (1993) documented that buying past 3–12 month winners and selling past losers generates statistically significant returns. The standard implementation:"}),e.jsxs("ol",{className:"list-decimal pl-6 my-3 space-y-1",children:[e.jsx("li",{children:"Rank all stocks by their return over the past J months (excluding last 1 month to avoid short-term reversal)"}),e.jsx("li",{children:"Go long the top decile (winners)"}),e.jsx("li",{children:"Go short the bottom decile (losers)"}),e.jsx("li",{children:"Hold for K months, then rebalance"})]}),e.jsx(t.BlockMath,{math:"\\text{WML}_{t,t+K} = \\frac{1}{n_W}\\sum_{i \\in W} r_{i,t,t+K} - \\frac{1}{n_L}\\sum_{i \\in L} r_{i,t,t+K}"}),e.jsxs("div",{className:"my-4",children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-600 mb-2",children:"Winner vs Loser Portfolio Monthly Returns"}),e.jsx(c,{width:"100%",height:220,children:e.jsxs(b,{data:L,children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"month"}),e.jsx(l,{tickFormatter:a=>`${a}%`}),e.jsx(p,{formatter:a=>`${a}%`}),e.jsx(R,{}),e.jsx(y,{dataKey:"winner",fill:"#22c55e",name:"Winners (+)"}),e.jsx(y,{dataKey:"loser",fill:"#ef4444",name:"Losers (-)"})]})})]}),e.jsx("h2",{children:"Time-Series Momentum (TSMOM)"}),e.jsx("p",{children:"Moskowitz et al. (2012) studied time-series momentum: each asset's own past return predicts its own future return. Unlike cross-sectional momentum, TSMOM does not require relative ranking."}),e.jsx(t.BlockMath,{math:"\\text{TSMOM Signal}_t = \\text{sign}(r_{t-h,t}) \\cdot \\frac{1}{\\sigma_{t}}"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\sigma_t"})," is the ex-ante volatility estimate. This vol-scaling ensures equal risk contribution across assets and time periods."]}),e.jsx("h2",{children:"The Factor Zoo"}),e.jsx("p",{children:"Harvey, Liu & Zhu (2016) cataloged 316 published return predictors. Hou, Xue & Zhang (2020) found 65% of published factors failed basic replication. Key issues:"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 my-4",children:[e.jsxs("div",{className:"p-3 bg-red-50 rounded-lg border border-red-200",children:[e.jsx("h4",{className:"font-semibold text-red-800 text-sm",children:"Data Mining Problems"}),e.jsxs("ul",{className:"text-xs text-red-700 space-y-1 list-disc pl-3 mt-1",children:[e.jsx("li",{children:"Multiple testing: 316 factors × 5% significance = 16 false positives by chance"}),e.jsx("li",{children:"Researcher degrees of freedom: sample period, universe, weighting"}),e.jsx("li",{children:"Publication bias: only significant results get published"}),e.jsx("li",{children:"In-sample optimization: Sharpe looks great, then factor decays"})]})]}),e.jsxs("div",{className:"p-3 bg-green-50 rounded-lg border border-green-200",children:[e.jsx("h4",{className:"font-semibold text-green-800 text-sm",children:"Robust Factors"}),e.jsxs("ul",{className:"text-xs text-green-700 space-y-1 list-disc pl-3 mt-1",children:[e.jsx("li",{children:"Momentum: replicated globally, all asset classes"}),e.jsx("li",{children:"Value (B/M): present but weaker post-2000"}),e.jsx("li",{children:"Profitability (ROE, gross profit): robust in US and international"}),e.jsx("li",{children:"Low volatility: persistent but partly explained by leverage constraints"})]})]})]}),e.jsx("h2",{children:"Factor t-Statistics"}),e.jsxs("div",{className:"my-4",children:[e.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Published t-statistics for major anomalies. Suggested threshold for robust factors: t > 3.0 (vs. traditional 2.0)"}),e.jsx(c,{width:"100%",height:200,children:e.jsxs(b,{data:E,layout:"vertical",children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{type:"number",domain:[0,6]}),e.jsx(l,{type:"category",dataKey:"factor",width:130,tick:{fontSize:12}}),e.jsx(p,{}),e.jsx(d,{type:"monotone",dataKey:()=>3,stroke:"#ef4444",strokeWidth:1,strokeDasharray:"4 2"}),e.jsx(y,{dataKey:"t_stat",fill:"#6366f1",name:"t-statistic"})]})})]}),e.jsx("h2",{children:"Python: Computing Momentum Factor with pandas"}),e.jsx(n,{code:`import pandas as pd
import numpy as np
import yfinance as yf
from scipy.stats import spearmanr

# ── 1. Download S&P 500 constituent data ──────────────────────────────
# Using a small universe for illustration
tickers = [
    'AAPL', 'MSFT', 'AMZN', 'NVDA', 'GOOGL', 'META', 'BRK-B', 'LLY',
    'V', 'JPM', 'XOM', 'UNH', 'WMT', 'JNJ', 'MA', 'PG', 'HD', 'CVX',
    'MRK', 'ABBV', 'COST', 'BAC', 'NFLX', 'AMD', 'CRM', 'ADBE', 'TMO',
    'PEP', 'ACN', 'CSCO',
]
prices = yf.download(tickers, start='2018-01-01', end='2024-01-01',
                     progress=False)['Adj Close']
prices = prices.dropna(axis=1, thresh=int(0.9 * len(prices)))
print(f"Universe: {prices.shape[1]} stocks")`}),e.jsx(n,{code:`# ── 2. Compute cross-sectional momentum signal ────────────────────────
returns = prices.pct_change()

# J=12 month lookback, skip last 1 month (standard construction)
# Returns from t-252 to t-21 trading days ago
J = 252  # 12-month lookback (trading days)
skip = 21  # 1-month skip

# Past return signal
mom_raw = prices.shift(skip) / prices.shift(J) - 1

# Cross-sectional z-score (standardize within each date)
mom_zscore = mom_raw.sub(mom_raw.mean(axis=1), axis=0).div(
    mom_raw.std(axis=1), axis=0
)

# Decile assignment
def assign_decile(row):
    return pd.qcut(row.dropna(), q=10, labels=False, duplicates='drop')

# Sample: which stocks are in top/bottom decile on 2023-01-03?
sample_date = '2023-01-03'
sample_row = mom_raw.loc[sample_date].dropna()
deciles = pd.qcut(sample_row, q=10, labels=list(range(1, 11)), duplicates='drop')
print(f"
Top decile (winners): {deciles[deciles == 10].index.tolist()}")
print(f"Bot decile (losers):  {deciles[deciles == 1].index.tolist()}")`}),e.jsx(n,{code:`# ── 3. Long-short momentum portfolio ──────────────────────────────────
# Rebalance monthly; hold for K=1 month
K = 21  # 1-month holding period
rebalance_dates = prices.resample('MS').first().index

port_returns = []
for i, date in enumerate(rebalance_dates[:-1]):
    next_date = rebalance_dates[i + 1]
    if date not in mom_raw.index:
        continue
    signal = mom_raw.loc[date].dropna()
    if len(signal) < 10:
        continue
    deciles_today = pd.qcut(signal, q=10, labels=False, duplicates='drop')
    winners = deciles_today[deciles_today == 9].index  # top decile
    losers  = deciles_today[deciles_today == 0].index  # bottom decile

    # Forward return for holding period
    mask = (prices.index >= date) & (prices.index < next_date)
    period_rets = returns.loc[mask]
    if len(period_rets) == 0:
        continue

    win_ret  = period_rets[winners].mean(axis=1).mean() if len(winners) > 0 else 0
    lose_ret = period_rets[losers].mean(axis=1).mean() if len(losers) > 0 else 0
    wml      = win_ret - lose_ret   # Winner Minus Loser

    port_returns.append({
        'date': date,
        'winners': win_ret,
        'losers': lose_ret,
        'wml': wml,
    })

results_df = pd.DataFrame(port_returns).set_index('date')
print(results_df.tail())
print(f"
Avg monthly WML: {results_df['wml'].mean():.3%}")
print(f"Sharpe (ann.):    {results_df['wml'].mean() / results_df['wml'].std() * np.sqrt(12):.2f}")`}),e.jsx(n,{code:`# ── 4. Factor decay analysis ──────────────────────────────────────────
# Rank IC: how well does today's signal predict returns 1, 3, 6, 12 months ahead?
def rank_ic(signal_df, returns_df, forward_days):
    """Compute average rank IC across all dates."""
    ics = []
    for date in signal_df.index:
        sig = signal_df.loc[date].dropna()
        # Forward return over next 'forward_days' trading days
        future_date_idx = returns_df.index.searchsorted(date) + forward_days
        if future_date_idx >= len(returns_df):
            continue
        future_date = returns_df.index[future_date_idx]
        fwd_ret = (prices.loc[future_date] / prices.loc[date] - 1).dropna()
        common = sig.index.intersection(fwd_ret.index)
        if len(common) < 10:
            continue
        ic, _ = spearmanr(sig[common], fwd_ret[common])
        ics.append(ic)
    return np.mean(ics)

print("Momentum Rank IC by horizon:")
for h_days, h_label in [(5, '1W'), (21, '1M'), (63, '3M'), (126, '6M'), (252, '12M')]:
    ic = rank_ic(mom_raw, returns, h_days)
    print(f"  {h_label}: {ic:.4f}")`}),e.jsx(n,{code:`# ── 5. Multiple testing correction ────────────────────────────────────
from statsmodels.stats.multitest import multipletests

# Simulate testing 50 candidate signals
np.random.seed(0)
n_tests = 50
p_values = np.random.uniform(0, 1, n_tests)
# Add a few "real" signals
p_values[:5] = np.random.uniform(0, 0.01, 5)

# Bonferroni correction
_, p_bonferroni, _, _ = multipletests(p_values, alpha=0.05, method='bonferroni')
# Benjamini-Hochberg (FDR control)
_, p_bh, _, _         = multipletests(p_values, alpha=0.05, method='fdr_bh')

print(f"Significant signals (raw p < 0.05): {(p_values < 0.05).sum()}")
print(f"Significant signals (Bonferroni):    {(p_bonferroni < 0.05).sum()}")
print(f"Significant signals (BH FDR 5%):     {(p_bh < 0.05).sum()}")
# Demonstrates how raw p < 0.05 inflates false discoveries`}),e.jsx(v,{title:"The Multiple Testing Problem in Finance",children:"With 316 published factors, the expected number of false positives at α = 5% is 316 × 0.05 = 15.8. Harvey, Liu & Zhu (2016) recommend requiring t-statistics above 3.0 (p < 0.27%) for factors tested in large samples, and above 4.0 for factors from large factor searches. The deflated Sharpe ratio (Bailey & Lopez de Prado, 2014) further penalizes based on the number of strategies tested."}),e.jsx(x,{children:"P-hacking and the replication crisis in finance: of 97 equity anomalies tested by Hou, Xue & Zhang (2020) using updated data and methodology, only 36% replicated. Common failures: (1) using CRSP value-weighted returns instead of equal-weighted, (2) ignoring microcaps where most anomalies concentrate, (3) sample period ended before anomaly was discovered (momentum works less well post-publication)."}),e.jsx(g,{children:"Factor decay is systematic: after a factor is published, hedge funds trade it out of existence. Momentum has the shortest half-life (~2 years for full decay in the US). Value has longer half-life but has been weak since 2007. The implication: always test your factor using the out-of-publication-year data to separate discovery from genuine alpha."}),e.jsx(_,{references:[{authors:"Jegadeesh, N., Titman, S.",year:1993,title:"Returns to buying winners and selling losers: Implications for stock market efficiency",journal:"Journal of Finance",volume:"48(1)",pages:"65–91"},{authors:"Harvey, C.R., Liu, Y., Zhu, H.",year:2016,title:"… and the cross-section of expected returns",journal:"Review of Financial Studies",volume:"29(1)",pages:"5–68"},{authors:"Hou, K., Xue, C., Zhang, L.",year:2020,title:"Replicating anomalies",journal:"Review of Financial Studies",volume:"33(5)",pages:"2019–2133"},{authors:"Moskowitz, T.J., Ooi, Y.H., Pedersen, L.H.",year:2012,title:"Time series momentum",journal:"Journal of Financial Economics",volume:"104(2)",pages:"228–250"}]})]})}const _e=Object.freeze(Object.defineProperty({__proto__:null,default:G},Symbol.toStringTag,{value:"Module"})),O=[{factor:"Mkt-RF",annualized:8.2,sharpe:.42},{factor:"SMB",annualized:2.7,sharpe:.18},{factor:"HML",annualized:4.1,sharpe:.31},{factor:"RMW",annualized:3.8,sharpe:.38},{factor:"CMA",annualized:3,sharpe:.29},{factor:"MOM",annualized:9.5,sharpe:.53},{factor:"BAB",annualized:8.8,sharpe:.61},{factor:"QMJ",annualized:6.4,sharpe:.55}];function W(){const[r,i]=j.useState("annualized"),a=[...O].sort((s,u)=>u[r]-s[r]);return e.jsxs(f,{title:"Factor Models",subject:"Financial Forecasting",difficulty:"advanced",readingTime:13,children:[e.jsx("p",{children:"Factor models decompose asset returns into systematic exposures to common risk factors plus an idiosyncratic component. They serve two purposes: risk decomposition (explaining where returns come from) and return prediction (harvesting documented risk premia). The Fama-French model family is the dominant framework in academic and professional practice."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"CAPM — The Starting Point"}),e.jsxs(o,{title:"Capital Asset Pricing Model",children:["The single-factor CAPM expresses excess returns as a linear function of market excess return:",e.jsx(t.BlockMath,{math:"R_i - R_f = \\alpha_i + \\beta_i (R_m - R_f) + \\epsilon_i"}),"where ",e.jsx(t.InlineMath,{math:"\\beta_i"})," is the systematic risk loading, ",e.jsx(t.InlineMath,{math:"\\alpha_i"})," is the intercept (Jensen's alpha — abnormal return after market risk adjustment), and",e.jsx(t.InlineMath,{math:"\\epsilon_i"})," is idiosyncratic risk. CAPM predicts ",e.jsx(t.InlineMath,{math:"\\alpha = 0"}),"for all assets in equilibrium — a prediction extensively rejected empirically."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Fama-French Three-Factor Model"}),e.jsxs(o,{title:"FF3 Model",children:["Fama and French (1992, 1993) documented that size (SMB) and value (HML) capture cross-sectional return variation unexplained by CAPM:",e.jsx(t.BlockMath,{math:"R_i - R_f = \\alpha_i + \\beta_i(R_m - R_f) + s_i \\cdot \\text{SMB} + h_i \\cdot \\text{HML} + \\epsilon_i"}),e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"SMB"})," (Small Minus Big): Return of small-cap minus large-cap stocks"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"HML"})," (High Minus Low): Return of high book-to-market (value) minus low (growth)"]})]}),"FF3 explains ~90% of diversified portfolio return variance, vs ~70% for CAPM."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Fama-French Five-Factor Model"}),e.jsxs(o,{title:"FF5 Model",children:["Fama and French (2015) extended FF3 with two additional factors:",e.jsx(t.BlockMath,{math:"R_i - R_f = \\alpha_i + \\beta_i \\text{MKT} + s_i \\text{SMB} + h_i \\text{HML} + r_i \\text{RMW} + c_i \\text{CMA} + \\epsilon_i"}),e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"RMW"})," (Robust Minus Weak): Profitability factor — high operating profitability vs low"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"CMA"})," (Conservative Minus Aggressive): Investment factor — low vs high asset growth"]})]}),"The FF5 model makes HML redundant in many specifications (subsumed by RMW and CMA)."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Momentum and Alternative Factors"}),e.jsxs(o,{title:"Momentum Factor (MOM)",children:["Jegadeesh & Titman (1993) documented that stocks with high returns over the past 12 months (skipping the most recent month to avoid short-term reversal) continue to outperform:",e.jsx(t.BlockMath,{math:"\\text{MOM} = R_{\\text{past winners}} - R_{\\text{past losers}}, \\quad \\text{formation: months } t-12 \\text{ to } t-2"}),"Momentum has the highest raw Sharpe ratio of any single factor (~0.5) but also the largest drawdowns and left-tail risk (momentum crashes)."]}),e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Factor Return Comparison (1963–2023, annualized)"}),e.jsx("div",{className:"flex gap-2 mb-3",children:[["annualized","Annual Return %"],["sharpe","Sharpe Ratio"]].map(([s,u])=>e.jsx("button",{onClick:()=>i(s),className:`px-3 py-1 text-sm rounded border ${r===s?"bg-blue-600 text-white":"border-gray-300"}`,children:u},s))}),e.jsx(c,{width:"100%",height:220,children:e.jsxs(b,{data:a,margin:{top:5,right:20,bottom:20,left:10},children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"factor"}),e.jsx(l,{label:{value:r==="annualized"?"Return %":"Sharpe",angle:-90,position:"insideLeft"}}),e.jsx(p,{}),e.jsx(y,{dataKey:r,fill:"#3b82f6",name:r==="annualized"?"Annual Return":"Sharpe"})]})}),e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"Illustrative values based on published factor research."})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Low Volatility and Quality Factors"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-2 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"BAB — Betting Against Beta"})," (Frazzini & Pedersen 2014): Long low-beta, short high-beta stocks. Exploits the empirical security market line being too flat. Best risk-adjusted Sharpe of common factors."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"QMJ — Quality Minus Junk"})," (Asness et al. 2019): Long high-quality (profitable, growing, safe) stocks. Captures multiple dimensions of firm quality simultaneously."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"IVOL anomaly"}),": Stocks with high idiosyncratic volatility earn lower returns (anomaly relative to standard theory). Useful as a negative screen."]})]}),e.jsxs(v,{title:"Risk Premia vs Mispricing",children:["Factor premia persist because they represent either (1) compensation for systematic risk that sophisticated investors avoid, or (2) behavioral biases that create persistent mispricings. The debate matters for forecasting:",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsx("li",{children:"Risk-based factors decay slowly and are robust across time and markets"}),e.jsx("li",{children:"Behavioral factors can be traded away once discovered (alpha decay)"}),e.jsx("li",{children:"Publication bias inflates estimated factor premia by 20–40% on average"})]})]}),e.jsx(g,{children:"Fama-French factor data is freely available from Ken French's data library (mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html). For US equity, the FF5 + Momentum model explains most documented cross-sectional return variation. International factors have similar structure but smaller and noisier premia."}),e.jsx(x,{children:"Overfitting is severe in factor model research. With 200+ factors documented in published research, many represent data mining. The McLean & Pontiff (2016) study found factor returns decay by 58% out-of-sample after publication. Focus on the 6–8 most economically motivated, long-documented factors rather than chasing recent anomaly publications."}),e.jsx(n,{title:"Fama-French Factor Model with pandas and yfinance",code:`import pandas as pd
import numpy as np
import yfinance as yf
from io import StringIO
import urllib.request
import statsmodels.api as sm

# ── Download Fama-French 5 factors ───────────────────────────────────────────
def load_ff5_factors(start='2010-01-01', end='2024-01-01'):
    """
    Download FF5 + Momentum factors from Ken French's website.
    Returns monthly factor returns as a DataFrame.
    """
    url = ('https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/'
           'F-F_Research_Data_5_Factors_2x3_CSV.zip')
    try:
        ff = pd.read_csv(url, skiprows=3, index_col=0)
    except Exception:
        # Fallback: simulate factors for demonstration
        np.random.seed(42)
        dates = pd.date_range(start, end, freq='MS')
        n = len(dates)
        ff = pd.DataFrame({
            'Mkt-RF': np.random.normal(0.6, 4.5, n),
            'SMB':    np.random.normal(0.2, 3.1, n),
            'HML':    np.random.normal(0.3, 3.5, n),
            'RMW':    np.random.normal(0.3, 2.4, n),
            'CMA':    np.random.normal(0.25, 2.5, n),
            'RF':     np.random.uniform(0.02, 0.05, n) / 12 * 100,
        }, index=dates)
        return ff / 100
    # Parse date and filter
    ff.index = pd.to_datetime(ff.index, format='%Y%m', errors='coerce')
    ff = ff[ff.index.notna()].loc[start:end]
    ff.columns = ff.columns.str.strip()
    return ff.astype(float) / 100

ff5 = load_ff5_factors()

# ── Download equity returns ───────────────────────────────────────────────────
tickers = ['AAPL', 'JPM', 'XOM', 'PG', 'TSLA']
try:
    prices = yf.download(tickers, start='2010-01-01', end='2024-01-01',
                          auto_adjust=True, progress=False)['Close']
    monthly_ret = prices.resample('MS').last().pct_change().dropna()
except Exception:
    np.random.seed(1)
    dates = ff5.index
    monthly_ret = pd.DataFrame(
        np.random.normal(0.01, 0.06, (len(dates), len(tickers))),
        index=dates, columns=tickers
    )

# Align dates
common = ff5.index.intersection(monthly_ret.index)
ff5    = ff5.loc[common]
rets   = monthly_ret.loc[common]

# ── Run FF5 regression for each stock ────────────────────────────────────────
X = sm.add_constant(ff5[['Mkt-RF', 'SMB', 'HML', 'RMW', 'CMA']])
results = {}
for ticker in tickers:
    excess_ret = rets[ticker] - ff5['RF']
    model  = sm.OLS(excess_ret, X, missing='drop').fit(cov_type='HAC', cov_kwds={'maxlags': 3})
    results[ticker] = {
        'alpha':     model.params['const'],
        'beta_mkt':  model.params['Mkt-RF'],
        'beta_smb':  model.params['SMB'],
        'beta_hml':  model.params['HML'],
        'beta_rmw':  model.params['RMW'],
        'beta_cma':  model.params['CMA'],
        'r_squared': model.rsquared,
        't_alpha':   model.tvalues['const'],
    }

summary = pd.DataFrame(results).T.round(4)
print("Fama-French 5-Factor Regression Results:")
print(summary.to_string())

# ── Factor portfolio construction ─────────────────────────────────────────────
def construct_factor_portfolio(monthly_ret_df, factor_series, n_quantile=5):
    """
    Long top quintile, short bottom quintile based on factor signal.
    Returns monthly portfolio returns.
    """
    factor_series = factor_series.dropna()
    port_returns  = []
    for date in factor_series.index:
        if date not in monthly_ret_df.index:
            continue
        scores  = factor_series.loc[date]
        returns = monthly_ret_df.loc[date]
        valid   = scores.dropna().index.intersection(returns.dropna().index)
        if len(valid) < 10:
            continue
        q = pd.qcut(scores[valid], n_quantile, labels=False)
        long_r  = returns[valid][q == 4].mean()
        short_r = returns[valid][q == 0].mean()
        port_returns.append({'date': date, 'ls_return': long_r - short_r})

    return pd.DataFrame(port_returns).set_index('date')['ls_return']

# Demonstrate with momentum signal (12-1 momentum)
print("\\n=== Factor Portfolio Stats ===")
mom_stats = {'description': '12-1 month momentum long-short'}
print(mom_stats)
`}),e.jsx(_,{references:[{author:"Fama, E.F. & French, K.R.",year:2015,title:"A five-factor asset pricing model",journal:"Journal of Financial Economics",volume:"116(1)",pages:"1–22"},{author:"Jegadeesh, N. & Titman, S.",year:1993,title:"Returns to buying winners and selling losers: Implications for stock market efficiency",journal:"Journal of Finance",volume:"48(1)",pages:"65–91"},{author:"Harvey, C.R., Liu, Y., & Zhu, H.",year:2016,title:"... and the cross-section of expected returns",journal:"Review of Financial Studies",volume:"29(1)",pages:"5–68"}]})]})}const ye=Object.freeze(Object.defineProperty({__proto__:null,default:W},Symbol.toStringTag,{value:"Module"}));function J(){const r=[];let i=100;for(let a=0;a<100;a++){const s=a<30?0:a<60?1:a<80?0:1,w=(s===0?.5:-.3)+(s===0?1.2:2.8)*(Math.random()<.5?1:-1)*Math.abs(Math.random());i*=1+w/100,r.push({t:a,price:+i.toFixed(2),regime:s,prob_bull:s===0?.8+Math.random()*.2:Math.random()*.3})}return r}const X=J();function $(){const[r,i]=j.useState(!0);return e.jsxs(f,{title:"Market Regime Detection",subject:"Financial Forecasting",difficulty:"advanced",readingTime:13,children:[e.jsx("p",{children:"Financial markets switch between distinct states — bull vs bear, low vs high volatility, risk-on vs risk-off — and the optimal investment strategy differs dramatically across regimes. Regime detection models identify these states from observable data, enabling adaptive forecasting and portfolio management. The key challenge is that regimes are latent: they cannot be directly observed, only inferred."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Hidden Markov Models"}),e.jsxs(o,{title:"Hidden Markov Model for Market Regimes",children:["An HMM models returns ",e.jsx(t.InlineMath,{math:"y_t"})," as being generated by a latent state",e.jsx(t.InlineMath,{math:"s_t \\in \\{1, \\ldots, K\\}"})," that follows a first-order Markov chain:",e.jsx(t.BlockMath,{math:"P(s_t = j | s_{t-1} = i) = A_{ij}"}),"Conditional on the state, returns are drawn from a state-specific distribution:",e.jsx(t.BlockMath,{math:"y_t | s_t = k \\sim \\mathcal{N}(\\mu_k, \\sigma_k^2)"}),"Parameters ",e.jsx(t.InlineMath,{math:"\\{A, \\mu_k, \\sigma_k\\}"})," are estimated via the Baum-Welch algorithm (EM). The Viterbi algorithm then decodes the most likely state sequence."]}),e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Simulated Price Path with Regime Detection"}),e.jsxs("div",{className:"flex items-center gap-4 mb-3",children:[e.jsx("button",{onClick:()=>i(!r),className:`px-3 py-1 text-sm rounded border ${r?"bg-blue-600 text-white":"border-gray-300"}`,children:r?"Hide Regimes":"Show Regimes"}),e.jsxs("span",{className:"text-sm text-gray-600",children:[e.jsx("span",{className:"inline-block w-3 h-3 bg-green-200 mr-1 rounded"}),"Bull regime",e.jsx("span",{className:"inline-block w-3 h-3 bg-red-200 mr-1 rounded ml-3"}),"Bear regime"]})]}),e.jsx(c,{width:"100%",height:220,children:e.jsxs(A,{data:X,margin:{top:5,right:20,bottom:20,left:10},children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"t",label:{value:"Period",position:"insideBottom",offset:-10}}),e.jsx(l,{}),e.jsx(p,{}),r&&e.jsx(S,{dataKey:"regime",fill:"transparent",stroke:"none",label:({x:a,y:s})=>null}),e.jsx(d,{dataKey:"price",stroke:"#1d4ed8",strokeWidth:2,dot:!1,name:"Price"}),e.jsx(d,{dataKey:"prob_bull",stroke:"#22c55e",strokeWidth:1.5,dot:!1,yAxisId:"right",strokeDasharray:"4 2",name:"P(Bull)"})]})})]}),e.jsxs(v,{title:"Transition Matrix Interpretation",children:["The transition matrix ",e.jsx(t.InlineMath,{math:"A"})," encodes regime persistence:",e.jsx(t.BlockMath,{math:"A = \\begin{pmatrix} p_{11} & 1-p_{11} \\\\ 1-p_{22} & p_{22} \\end{pmatrix}"}),"Expected regime duration: ",e.jsx(t.InlineMath,{math:"\\mathbb{E}[\\text{duration}_k] = 1/(1-p_{kk})"}),". A bull market with ",e.jsx(t.InlineMath,{math:"p_{11} = 0.97"})," has expected duration 1/0.03 ≈ 33 months. This matches historical bull market durations and allows scenario planning."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Volatility Regime Detection"}),e.jsx("p",{children:"Volatility regimes (low-vol vs high-vol) are more tractable than direction regimes because volatility is more persistent and estimable from high-frequency data. A 2-state GARCH model or realized volatility clustering identifies:"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Calm regime"}),": VIX < 20, daily returns ± 0.5–1%, momentum strategies perform"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Crisis regime"}),": VIX > 30, daily returns ±2–5%, correlation spikes, diversification breaks"]})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Clustering-Based Regime Detection"}),e.jsxs("p",{children:["K-means and Gaussian Mixture Models (GMM) provide alternative unsupervised approaches. Feature engineering is critical: cluster on ","{","rolling volatility, trend strength, cross-asset correlations, term structure slope","}"," rather than raw returns."]}),e.jsxs(F,{title:"Three-Regime Portfolio Allocation",children:["An asset manager identifies three regimes using a 3-state HMM on global equity + bond + credit returns:",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Risk-On"})," (p≈0.55): High equity allocation, momentum tilt, reduce bonds"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Transition"})," (p≈0.30): Balanced allocation, reduce concentration"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Risk-Off"})," (p≈0.15): Treasury bonds, gold, defensive equities, hedge"]})]}),"Regime-switching allocation improved Sharpe ratio from 0.52 (static 60/40) to 0.71 in backtest. Practical limitation: regime detection lags the true regime change by 2–6 weeks due to smoothing."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Regime-Switching ARIMA"}),e.jsx("p",{children:"Markov Switching ARIMA (MS-ARIMA) allows AR parameters and variance to switch with the hidden state. For return prediction, a 2-state model with different means and variances captures the bull/bear distinction. The Hamilton (1989) model is the canonical example."}),e.jsx(g,{children:"HMMs are sensitive to initialization. Run the EM algorithm multiple times from different random starting points (at least 10–20 restarts) and select the solution with highest log-likelihood. Also cross-validate the number of states K using BIC or out-of-sample likelihood rather than in-sample fit — K=3 or K=4 often overfits."}),e.jsx(x,{children:"Regime detection has a fundamental look-ahead bias problem in backtesting. The HMM knows the full history when fitting, so identified regime boundaries look cleaner than they would in real time. Always evaluate regime-based strategies in true walk-forward (online) fashion — fitting only on data available at each decision point."}),e.jsx(n,{title:"HMM Market Regime Detection with hmmlearn",code:`import numpy as np
import pandas as pd
from hmmlearn import hmm
from sklearn.preprocessing import StandardScaler

# ── Generate or load return data ──────────────────────────────────────────────
np.random.seed(42)

# Simulate 2-regime returns: bull (high mean, low vol) + bear (low mean, high vol)
def simulate_regime_returns(n=1000):
    regimes  = [0]
    A = np.array([[0.97, 0.03], [0.05, 0.95]])   # transition matrix
    for _ in range(n - 1):
        r = regimes[-1]
        regimes.append(0 if np.random.rand() < A[r, 0] else 1)

    mus    = [0.05, -0.10]   # % per month
    sigmas = [1.20,  3.50]
    returns = np.array([np.random.normal(mus[s], sigmas[s]) for s in regimes])
    return returns, np.array(regimes)

returns, true_regimes = simulate_regime_returns(n=600)

# Feature engineering: returns + rolling vol
vol_21 = pd.Series(returns).rolling(21).std().fillna(method='bfill').values
features = np.column_stack([returns, vol_21])

# ── Fit 2-state Gaussian HMM ─────────────────────────────────────────────────
scaler   = StandardScaler()
X_scaled = scaler.fit_transform(features)

best_model, best_score = None, -np.inf
for trial in range(15):    # multiple restarts
    model = hmm.GaussianHMM(
        n_components=2,
        covariance_type='full',
        n_iter=200,
        random_state=trial,
    )
    try:
        model.fit(X_scaled)
        score = model.score(X_scaled)
        if score > best_score:
            best_score = score
            best_model = model
    except Exception:
        continue

# ── Decode states ─────────────────────────────────────────────────────────────
states      = best_model.predict(X_scaled)
state_probs = best_model.predict_proba(X_scaled)   # shape (T, K)

# Identify which state is "bull" (higher mean return)
state_means = [returns[states == k].mean() for k in range(2)]
bull_state  = np.argmax(state_means)
bear_state  = 1 - bull_state

print(f"Bull state ({bull_state}): mean={state_means[bull_state]:.3f}%, "
      f"vol={returns[states == bull_state].std():.3f}%")
print(f"Bear state ({bear_state}): mean={state_means[bear_state]:.3f}%, "
      f"vol={returns[states == bear_state].std():.3f}%")

# ── Transition matrix ─────────────────────────────────────────────────────────
A = best_model.transmat_
print(f"\\nTransition Matrix:")
print(f"  P(bull→bull) = {A[bull_state, bull_state]:.3f}  "
      f"Expected duration: {1/(1-A[bull_state, bull_state]):.0f} periods")
print(f"  P(bear→bear) = {A[bear_state, bear_state]:.3f}  "
      f"Expected duration: {1/(1-A[bear_state, bear_state]):.0f} periods")

# ── Regime-adaptive Sharpe ratio ─────────────────────────────────────────────
# Strategy: invest in risky asset only in bull regime
bull_proba     = state_probs[:, bull_state]
threshold      = 0.6
position       = (bull_proba > threshold).astype(float)
strategy_ret   = position * returns
benchmark_ret  = returns   # always invested

def sharpe(rets, annualize=12):
    return rets.mean() / rets.std() * np.sqrt(annualize)

print(f"\\nBacktest Performance:")
print(f"  Buy & Hold Sharpe: {sharpe(benchmark_ret):.3f}")
print(f"  Regime Strategy Sharpe: {sharpe(strategy_ret):.3f}")
print(f"  % time in market: {position.mean():.1%}")

# ── 3-state model comparison ───────────────────────────────────────────────────
bic_scores = {}
for k in [2, 3, 4]:
    m = hmm.GaussianHMM(n_components=k, covariance_type='full', n_iter=200, random_state=0)
    try:
        m.fit(X_scaled)
        n_params = k**2 + k * X_scaled.shape[1] + k * (X_scaled.shape[1]**2)
        bic = -2 * m.score(X_scaled) * len(X_scaled) + n_params * np.log(len(X_scaled))
        bic_scores[k] = round(bic, 1)
    except Exception:
        bic_scores[k] = None

print("\\nBIC by number of states (lower = better):")
for k, b in bic_scores.items():
    print(f"  K={k}: BIC={b}")
`}),e.jsx(_,{references:[{author:"Hamilton, J.D.",year:1989,title:"A new approach to the economic analysis of nonstationary time series and the business cycle",journal:"Econometrica",volume:"57(2)",pages:"357–384"},{author:"Ang, A. & Bekaert, G.",year:2002,title:"Regime switches in interest rates",journal:"Journal of Business & Economic Statistics",volume:"20(2)",pages:"163–182"}]})]})}const ve=Object.freeze(Object.defineProperty({__proto__:null,default:$},Symbol.toStringTag,{value:"Module"})),U=Array.from({length:120},(r,i)=>{const a=i>=50&&i<=70,u=i===52||i===65?.045:a?.028+Math.random()*.01:.012+Math.random()*.006;return{t:i+1,returns:(Math.random()-.5)*u*100,cond_vol:u*100,realized_vol:(u+(Math.random()-.5)*.003)*100}}),Q=[{lag:1,acf:.32},{lag:2,acf:.28},{lag:3,acf:.22},{lag:4,acf:.18},{lag:5,acf:.15},{lag:6,acf:.12},{lag:7,acf:.1},{lag:8,acf:.08}];function Y(){const[r,i]=j.useState("garch11");return e.jsxs(f,{title:"GARCH & EGARCH Volatility Models",difficulty:"advanced",readingTime:40,prerequisites:["ARIMA Models","Maximum Likelihood Estimation","Financial Time Series"],children:[e.jsxs("p",{children:["Financial returns are approximately uncorrelated over time, but their",e.jsx("em",{children:" squared values"})," are strongly correlated — a property called"," ",e.jsx("strong",{children:"volatility clustering"}),". Large price moves tend to follow large moves, and calm periods cluster together. GARCH models capture this time-varying conditional variance."]}),e.jsx("h2",{children:"ARCH Effects: The Stylized Facts"}),e.jsxs("p",{children:["For a return series ",e.jsx(t.InlineMath,{math:"r_t"}),", even if ",e.jsx(t.InlineMath,{math:"E[r_t | r_{t-1}, \\ldots] \\approx 0"}),"(returns are unpredictable), the conditional variance is highly predictable:"]}),e.jsxs("ul",{className:"list-disc pl-6 my-3 space-y-1",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Volatility clustering"}),": high-volatility periods cluster together"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Fat tails"}),": returns have heavier tails than Gaussian"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Leverage effect"}),": negative returns increase future volatility more than positive returns of the same magnitude (stocks)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mean reversion"}),": volatility reverts to a long-run mean"]})]}),e.jsxs("div",{className:"my-4",children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-600 mb-2",children:"ACF of Squared Returns (ARCH effect)"}),e.jsx(c,{width:"100%",height:180,children:e.jsxs(b,{data:Q,children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"lag",label:{value:"Lag",position:"insideBottom",offset:-3}}),e.jsx(l,{label:{value:"ACF(r²)",angle:-90,position:"insideLeft"}}),e.jsx(p,{}),e.jsx(y,{dataKey:"acf",fill:"#6366f1",name:"ACF of r²"})]})}),e.jsx("p",{className:"text-xs text-center text-gray-500 mt-1",children:"Significant autocorrelation in squared returns indicates ARCH effects are present."})]}),e.jsx("h2",{children:"ARCH(q) Model"}),e.jsx("p",{children:"Engle (1982) proposed the AutoRegressive Conditional Heteroskedasticity model:"}),e.jsx(t.BlockMath,{math:"r_t = \\mu + \\varepsilon_t, \\quad \\varepsilon_t = \\sigma_t z_t, \\quad z_t \\sim \\mathcal{N}(0,1)"}),e.jsx(t.BlockMath,{math:"\\sigma_t^2 = \\omega + \\sum_{i=1}^{q} \\alpha_i \\varepsilon_{t-i}^2"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\omega > 0"})," and ",e.jsx(t.InlineMath,{math:"\\alpha_i \\geq 0"}),". The conditional variance depends on the last q squared innovations. A large shock ",e.jsx(t.InlineMath,{math:"\\varepsilon_{t-1}^2"})," immediately raises tomorrow's variance."]}),e.jsx("h2",{children:"GARCH(p, q) Model"}),e.jsx("p",{children:"Bollerslev (1986) generalized ARCH by adding lagged variance terms (analogous to the MA terms in ARMA):"}),e.jsx(t.BlockMath,{math:"\\sigma_t^2 = \\omega + \\sum_{i=1}^{q} \\alpha_i \\varepsilon_{t-i}^2 + \\sum_{j=1}^{p} \\beta_j \\sigma_{t-j}^2"}),e.jsxs("p",{children:["In practice, ",e.jsx("strong",{children:"GARCH(1,1)"})," is almost universally used:"]}),e.jsx(t.BlockMath,{math:"\\sigma_t^2 = \\omega + \\alpha \\varepsilon_{t-1}^2 + \\beta \\sigma_{t-1}^2"}),e.jsx("div",{className:"flex gap-2 my-4",children:[["garch11","GARCH(1,1)"],["egarch","EGARCH"],["gjr","GJR-GARCH"]].map(([a,s])=>e.jsx("button",{onClick:()=>i(a),className:`px-3 py-1 rounded text-sm font-medium ${r===a?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:s},a))}),r==="garch11"&&e.jsxs("div",{className:"bg-indigo-50 rounded-lg p-4 my-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"GARCH(1,1) Properties"}),e.jsxs("ul",{className:"text-sm space-y-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Stationarity:"})," ",e.jsx(t.InlineMath,{math:"\\alpha + \\beta < 1"})," required for covariance stationarity"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Persistence:"})," ",e.jsx(t.InlineMath,{math:"\\alpha + \\beta"})," close to 1 means shocks persist (common in financial markets: typically 0.97–0.99)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Long-run variance:"})," ",e.jsx(t.InlineMath,{math:"\\bar{\\sigma}^2 = \\omega / (1 - \\alpha - \\beta)"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Half-life:"})," periods for volatility to revert halfway to mean = ",e.jsx(t.InlineMath,{math:"\\ln(0.5) / \\ln(\\alpha + \\beta)"})]})]})]}),r==="egarch"&&e.jsxs("div",{className:"bg-green-50 rounded-lg p-4 my-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"EGARCH (Nelson, 1991)"}),e.jsx("p",{className:"text-sm mb-2",children:"Models log-variance to ensure positivity without parameter constraints:"}),e.jsx(t.BlockMath,{math:"\\ln \\sigma_t^2 = \\omega + \\beta \\ln \\sigma_{t-1}^2 + \\alpha \\left(\\frac{|\\varepsilon_{t-1}|}{\\sigma_{t-1}} - \\sqrt{2/\\pi}\\right) + \\gamma \\frac{\\varepsilon_{t-1}}{\\sigma_{t-1}}"}),e.jsxs("p",{className:"text-sm",children:["The ",e.jsx(t.InlineMath,{math:"\\gamma"})," term captures the ",e.jsx("strong",{children:"leverage effect"}),": negative returns (γ < 0) increase volatility more than positive returns. Typical equity: γ ≈ −0.1 to −0.3."]})]}),r==="gjr"&&e.jsxs("div",{className:"bg-yellow-50 rounded-lg p-4 my-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"GJR-GARCH (Glosten-Jagannathan-Runkle, 1993)"}),e.jsx("p",{className:"text-sm mb-2",children:"Adds an indicator for negative shocks:"}),e.jsx(t.BlockMath,{math:"\\sigma_t^2 = \\omega + \\alpha \\varepsilon_{t-1}^2 + \\gamma \\varepsilon_{t-1}^2 \\mathbf{1}[\\varepsilon_{t-1} < 0] + \\beta \\sigma_{t-1}^2"}),e.jsxs("p",{className:"text-sm",children:["When a negative shock occurs, variance increases by ",e.jsx(t.InlineMath,{math:"(\\alpha + \\gamma)"})," instead of just α. Simpler than EGARCH while capturing asymmetry. Typical equity: γ ≈ 0.05–0.15."]})]}),e.jsx("h2",{children:"Conditional Volatility Chart"}),e.jsx(c,{width:"100%",height:260,children:e.jsxs(k,{data:U,children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"t"}),e.jsx(l,{}),e.jsx(p,{}),e.jsx(R,{}),e.jsx(d,{type:"monotone",dataKey:"cond_vol",stroke:"#6366f1",strokeWidth:2,dot:!1,name:"GARCH(1,1) Cond. Volatility (%)"}),e.jsx(d,{type:"monotone",dataKey:"realized_vol",stroke:"#22c55e",strokeWidth:1,strokeDasharray:"4 2",dot:!1,name:"Realized Volatility (%)"})]})}),e.jsx("p",{className:"text-xs text-center text-gray-500 mt-1",children:"GARCH conditional volatility tracks realized volatility during the simulated market shock (periods 50–70)."}),e.jsx("h2",{children:"Volatility Forecasting: Multi-Step Ahead"}),e.jsx("p",{children:"The GARCH(1,1) h-step ahead variance forecast has an analytic form:"}),e.jsx(t.BlockMath,{math:"\\mathbb{E}[\\sigma_{t+h}^2 | \\mathcal{F}_t] = \\bar{\\sigma}^2 + (\\alpha + \\beta)^{h-1} (\\sigma_{t+1}^2 - \\bar{\\sigma}^2)"}),e.jsxs("p",{children:["As ",e.jsx(t.InlineMath,{math:"h \\to \\infty"}),", forecasts converge to the unconditional variance ",e.jsx(t.InlineMath,{math:"\\bar{\\sigma}^2"}),". The speed of convergence is governed by ",e.jsx(t.InlineMath,{math:"(\\alpha + \\beta)^{h-1}"}),"."]}),e.jsx("h2",{children:"Python: arch Library"}),e.jsx(n,{code:`import numpy as np
import pandas as pd
import yfinance as yf
from arch import arch_model

# ── 1. Download financial data ────────────────────────────────────────
ticker = 'SPY'
data = yf.download(ticker, start='2018-01-01', end='2024-01-01', progress=False)
returns = 100 * data['Adj Close'].pct_change().dropna()
print(f"Mean: {returns.mean():.4f}%, Std: {returns.std():.4f}%")

# ── 2. Test for ARCH effects (Ljung-Box on squared returns) ───────────
from statsmodels.stats.diagnostic import acorr_ljungbox
lb_test = acorr_ljungbox(returns ** 2, lags=[10, 20], return_df=True)
print("Ljung-Box test on r² (p-values):")
print(lb_test['lb_pvalue'])  # p < 0.05 confirms ARCH effects`}),e.jsx(n,{code:`# ── 3. Fit GARCH(1,1) ────────────────────────────────────────────────
garch = arch_model(
    returns,
    vol='Garch',    # GARCH variance model
    p=1, q=1,       # GARCH(1,1)
    mean='AR',      # AR(1) mean model (or 'Constant')
    dist='t',       # Student-t innovations (fat tails)
)
res_garch = garch.fit(disp='off')
print(res_garch.summary())
#                  coef    std err         t      P>|t|
# mu            0.0412      0.012     3.41      0.001
# ar.L1        -0.0215      0.018    -1.20      0.231
# omega         0.0153      0.004     3.72      0.000
# alpha[1]      0.0892      0.012     7.62      0.000
# beta[1]       0.9021      0.015    60.5       0.000
# nu            5.82        0.55     10.6       0.000   (t-dist df)

print(f"Persistence (α+β): {res_garch.params['alpha[1]'] + res_garch.params['beta[1]']:.4f}")
# Typical value: 0.98 — very persistent volatility`}),e.jsx(n,{code:`# ── 4. Fit EGARCH and GJR-GARCH ──────────────────────────────────────
egarch = arch_model(returns, vol='EGarch', p=1, q=1, mean='Constant', dist='t')
res_egarch = egarch.fit(disp='off')
gamma = res_egarch.params.get('gamma[1]', res_egarch.params.get('gamma'))
print(f"EGARCH gamma (leverage): {gamma:.4f}")   # negative = leverage effect

gjr = arch_model(returns, vol='Garch', p=1, o=1, q=1, mean='Constant', dist='t')
res_gjr = gjr.fit(disp='off')
print(f"GJR-GARCH gamma: {res_gjr.params['gamma[1]']:.4f}")  # > 0 confirms asymmetry`}),e.jsx(n,{code:`# ── 5. Forecast volatility ────────────────────────────────────────────
horizon = 22  # ~1 month of trading days
forecast = res_garch.forecast(horizon=horizon, reindex=False)

# forecast.variance contains h-step ahead variance forecasts
vol_forecast = np.sqrt(forecast.variance.values[-1]) * np.sqrt(252)  # annualized
print("Annualized volatility forecast (next 22 days):")
for h, v in enumerate(vol_forecast[:5], 1):
    print(f"  t+{h}: {v:.2f}%")

# ── 6. Value at Risk from GARCH ───────────────────────────────────────
from scipy.stats import t as t_dist

alpha_var = 0.01  # 1% VaR
nu = res_garch.params['nu']   # estimated t-distribution d.f.
next_day_vol = np.sqrt(forecast.variance.values[-1, 0])  # 1-day ahead std (in %)

# Parametric VaR using t-distribution
t_quantile = t_dist.ppf(alpha_var, df=nu)
var_1pct = -(res_garch.params['mu'] + t_quantile * next_day_vol * np.sqrt(nu / (nu - 2)))
print(f"\\n1-day 1% parametric VaR: {var_1pct:.3f}%")  # e.g., 2.1% daily loss`}),e.jsx(n,{code:`# ── 7. Rolling volatility forecasts (walk-forward) ───────────────────
rolling_vol = []
window = 252  # 1-year rolling window

for i in range(window, len(returns), 5):  # step 5 days (weekly refit)
    train = returns.iloc[i - window:i]
    model = arch_model(train, vol='Garch', p=1, q=1, mean='Constant', dist='t')
    result = model.fit(disp='off')
    fc = result.forecast(horizon=5, reindex=False)
    for h in range(5):
        if i + h < len(returns):
            rolling_vol.append({
                'date': returns.index[i + h],
                'garch_vol': np.sqrt(fc.variance.values[-1, h]),
                'actual_return': returns.iloc[i + h],
            })

vol_df = pd.DataFrame(rolling_vol)
# Correlation between GARCH vol forecast and |actual return| (should be positive)
corr = vol_df['garch_vol'].corr(vol_df['actual_return'].abs())
print(f"Forecast-realized vol correlation: {corr:.3f}")`}),e.jsxs(v,{title:"Integrated GARCH and Long Memory",children:["When ",e.jsx(t.InlineMath,{math:"\\alpha + \\beta = 1"}),", the GARCH process is integrated (IGARCH). The variance forecast does not revert to a finite unconditional mean — shocks persist forever. This is observed empirically at very high frequency (tick data) and during regime changes. FIGARCH (Fractionally Integrated GARCH) provides a middle ground between standard GARCH and IGARCH for series with long memory in volatility."]}),e.jsxs(g,{children:["Student-t innovations (",e.jsx("code",{children:"dist='t'"}),") almost always outperform Gaussian for financial returns. The estimated degrees-of-freedom parameter ν captures tail heaviness; typical values for equity returns are 4–8. Normal distribution corresponds to ν → ∞."]}),e.jsx(x,{children:"GARCH models assume that the mean return is close to zero and model only the second moment (variance). They cannot capture jumps (large discontinuous price moves), regime changes, or long-run trends in returns. For option pricing or risk management, extend with jump-diffusion or Markov-switching GARCH."}),e.jsx(_,{references:[{authors:"Engle, R.F.",year:1982,title:"Autoregressive conditional heteroscedasticity with estimates of the variance of United Kingdom inflation",journal:"Econometrica",volume:"50(4)",pages:"987–1007"},{authors:"Bollerslev, T.",year:1986,title:"Generalized autoregressive conditional heteroskedasticity",journal:"Journal of Econometrics",volume:"31(3)",pages:"307–327"},{authors:"Nelson, D.B.",year:1991,title:"Conditional heteroskedasticity in asset returns: A new approach",journal:"Econometrica",volume:"59(2)",pages:"347–370"}]})]})}const be=Object.freeze(Object.defineProperty({__proto__:null,default:Y},Symbol.toStringTag,{value:"Module"}));function Z(){return e.jsxs(f,{title:"Realized Volatility",subject:"Financial Forecasting",difficulty:"advanced",readingTime:12,children:[e.jsx("p",{children:"Realized volatility (RV) uses intraday high-frequency returns to produce a model-free estimate of daily volatility. Unlike GARCH, which infers volatility from a parametric model, RV observes it directly from many intraday return observations. This makes RV a significantly more accurate volatility measure — essentially treating volatility as observable rather than latent."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Realized Variance"}),e.jsxs(o,{title:"Realized Variance (RV)",children:["Given ",e.jsx(t.InlineMath,{math:"M"})," intraday returns ",e.jsx(t.InlineMath,{math:"r_{t,j} = \\ln P_{t,j} - \\ln P_{t,j-1}"}),"on day ",e.jsx(t.InlineMath,{math:"t"}),", realized variance is:",e.jsx(t.BlockMath,{math:"\\text{RV}_t = \\sum_{j=1}^{M} r_{t,j}^2"}),"Under mild conditions, as ",e.jsx(t.InlineMath,{math:"M \\to \\infty"}),", ",e.jsx(t.InlineMath,{math:"\\text{RV}_t \\to \\sigma_t^2"}),"(the true integrated variance). For 5-minute returns on a 6.5-hour trading day,",e.jsx(t.InlineMath,{math:"M \\approx 78"})," observations per day."]}),e.jsxs(o,{title:"Bipower Variation",children:["Barndorff-Nielsen & Shephard (2004) introduced bipower variation to disentangle continuous volatility from jump components:",e.jsx(t.BlockMath,{math:"\\text{BPV}_t = \\frac{\\pi}{2} \\sum_{j=2}^{M} |r_{t,j}| \\cdot |r_{t,j-1}|"}),"Jump component: ",e.jsx(t.InlineMath,{math:"J_t = \\max(\\text{RV}_t - \\text{BPV}_t, 0)"}),". Continuous component: ",e.jsx(t.InlineMath,{math:"C_t = \\text{BPV}_t"}),". Separating jumps from continuous volatility is important because they have different forecasting implications — jumps are less persistent than continuous volatility."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"HAR-RV Model"}),e.jsxs(v,{title:"Heterogeneous Autoregressive Model (HAR-RV)",children:["Corsi (2009) proposed a simple but powerful model exploiting realized volatility's long memory:",e.jsx(t.BlockMath,{math:"\\text{RV}_{t+1} = \\alpha + \\beta_d \\text{RV}_t + \\beta_w \\overline{\\text{RV}}_{t-4:t} + \\beta_m \\overline{\\text{RV}}_{t-21:t} + \\epsilon_{t+1}"}),"where ",e.jsx(t.InlineMath,{math:"\\overline{\\text{RV}}_{t-k:t}"})," is the rolling average of RV over the last",e.jsx(t.InlineMath,{math:"k"})," days. The three components capture daily, weekly, and monthly volatility persistence — corresponding to short-term traders, institutional portfolio managers, and long-term investors. Despite its simplicity, HAR-RV beats GARCH out-of-sample in virtually every study."]}),e.jsxs(F,{title:"HAR-RV Extensions",children:["The HAR framework is extensible:",e.jsxs("ul",{className:"list-disc ml-5 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"HAR-RV-J"}),": Adds jump component as a regressor — jumps forecast lower future volatility"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"HAR-CJ"}),": Uses continuous and jump components separately"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"CHAR"}),": Uses realized semivariances (upside vs downside) — leverage effect captured directly"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"HAR-RV-RS"}),": Realized skewness and kurtosis as additional predictors"]})]})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"High-Frequency Data Cleaning"}),e.jsx("p",{children:"Raw tick data contains microstructure noise that inflates RV estimates when computed at the highest frequency. Key data cleaning steps:"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Bid-ask bounce removal"}),": Use midpoint prices, not transaction prices, to eliminate bounce"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sampling frequency"}),": 5-minute intervals are the practical sweet spot — higher frequency amplifies noise, lower frequency wastes information"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Jump filter"}),": Winsorize or remove returns exceeding 5–10 standard deviations (fat-finger trades, data errors)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Calendar time vs trade time"}),": Volume-weighted subsampling produces more uniform signal quality"]})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"RV vs GARCH"}),e.jsx("p",{children:"The fundamental difference: GARCH is a latent volatility model (volatility is inferred from daily returns), while RV is a measurement-based approach (volatility is estimated from intraday data)."}),e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm mt-2",children:[e.jsx("li",{children:"RV is more accurate in-sample (uses more data per day)"}),e.jsx("li",{children:"RV requires intraday data — unavailable for many assets (private equity, real assets, OTC)"}),e.jsx("li",{children:"GARCH generalizes to any return frequency; RV needs high-frequency data"}),e.jsx("li",{children:"For liquid exchange-traded assets, HAR-RV consistently outperforms GARCH for 1-day ahead forecast"}),e.jsx("li",{children:"For longer horizons (10+ days), the advantage of RV shrinks"})]}),e.jsx(g,{children:"The optimal sampling frequency for realized variance depends on the level of market microstructure noise. Aït-Sahalia & Mykland (2003) show the bias-variance tradeoff is minimized at approximately 5 minutes for US equities. In practice, 5-minute sampling is the most common choice, though some practitioners use 10-minute intervals for less liquid assets."}),e.jsx(x,{children:"HAR-RV produces the conditional mean forecast of realized volatility. For options pricing and risk management, you also need the conditional variance of realized volatility (vol-of-vol). The HAR-RV residuals are not normally distributed — they are right-skewed and leptokurtic. Use a log transformation: fit HAR on log(RV) for better residual behavior and prediction intervals."}),e.jsx(n,{title:"Realized Volatility from Tick Data",code:`import numpy as np
import pandas as pd
import statsmodels.api as sm

# ── Simulate 5-minute intraday prices ────────────────────────────────────────
np.random.seed(42)

def simulate_5min_prices(n_days: int = 252, freq_per_day: int = 78):
    """
    Simulate 5-minute prices with stochastic volatility.
    Returns DataFrame: [datetime, price, log_return]
    """
    rows = []
    price = 100.0
    for day in range(n_days):
        # Daily volatility ~ log-normal
        sigma_day = np.exp(-3.5 + 0.5 * np.random.randn())
        sigma_intra = sigma_day / np.sqrt(freq_per_day)
        date = pd.Timestamp('2022-01-03') + pd.Timedelta(days=day)
        for j in range(freq_per_day):
            ret   = np.random.normal(0, sigma_intra)
            price *= np.exp(ret)
            rows.append({'datetime': date + pd.Timedelta(minutes=5 * (j + 1)),
                          'date': date, 'price': price, 'log_return': ret})
    return pd.DataFrame(rows)

tick_df = simulate_5min_prices()
print(f"Generated {len(tick_df):,} 5-minute observations across {tick_df['date'].nunique()} days")

# ── Compute daily realized variance ──────────────────────────────────────────
def compute_realized_measures(tick_df: pd.DataFrame) -> pd.DataFrame:
    """Compute RV, BPV, and jump component per day."""
    results = []
    for date, group in tick_df.groupby('date'):
        r = group['log_return'].values
        n = len(r)
        if n < 2:
            continue

        # Realized variance
        rv = np.sum(r**2)

        # Bipower variation (jump-robust)
        bpv = (np.pi / 2) * np.sum(np.abs(r[1:]) * np.abs(r[:-1]))

        # Jump component
        jump = max(rv - bpv, 0)

        # Realized semivariances
        rv_plus  = np.sum(r[r > 0]**2)
        rv_minus = np.sum(r[r < 0]**2)

        results.append({
            'date':     date,
            'rv':       rv,
            'rv_ann':   rv * 252,         # annualized variance
            'rvol_ann': np.sqrt(rv * 252), # annualized vol
            'bpv':      bpv,
            'jump':     jump,
            'rv_plus':  rv_plus,
            'rv_minus': rv_minus,
            'n_obs':    n,
        })

    return pd.DataFrame(results).set_index('date')

rv_df = compute_realized_measures(tick_df)
print(f"\\nRealized Vol Summary:")
print(rv_df[['rv', 'rvol_ann', 'bpv', 'jump']].describe().round(6))

# ── HAR-RV model ──────────────────────────────────────────────────────────────
def build_har_features(rv_series: pd.Series, log_transform: bool = True) -> pd.DataFrame:
    """Build daily, weekly, monthly RV features."""
    s = np.log(rv_series.clip(1e-10)) if log_transform else rv_series
    df = pd.DataFrame({'rv_d': s})
    df['rv_w'] = s.rolling(5).mean()   # weekly avg
    df['rv_m'] = s.rolling(22).mean()  # monthly avg
    df['rv_next'] = s.shift(-1)        # 1-step ahead target
    return df.dropna()

har_df = build_har_features(rv_df['rv'])
X = sm.add_constant(har_df[['rv_d', 'rv_w', 'rv_m']])
y = har_df['rv_next']

# Train/test split
n_train = int(len(har_df) * 0.8)
X_train, X_test = X.iloc[:n_train], X.iloc[n_train:]
y_train, y_test = y.iloc[:n_train], y.iloc[n_train:]

model = sm.OLS(y_train, X_train).fit(cov_type='HAC', cov_kwds={'maxlags': 5})
print(f"\\nHAR-RV Model Summary:")
print(model.summary().tables[1])

# Out-of-sample performance
y_pred = model.predict(X_test)
rmse   = np.sqrt(((y_test - y_pred)**2).mean())
r2_oos = 1 - ((y_test - y_pred)**2).sum() / ((y_test - y_test.mean())**2).sum()
print(f"\\nOut-of-sample RMSE (log RV): {rmse:.4f}")
print(f"Out-of-sample R² (log RV):   {r2_oos:.4f}")

# Convert back to annualized vol forecast
y_pred_vol = np.sqrt(np.exp(y_pred) * 252) * 100
print(f"\\nForecast annualized vol (last 5 days):")
print(y_pred_vol.tail().round(2).to_string())

# ── Jump detection test ───────────────────────────────────────────────────────
# Barndorff-Nielsen & Shephard ratio test
rv_arr, bpv_arr = rv_df['rv'].values, rv_df['bpv'].values
tp  = (np.pi/2)**2 + np.pi - 5           # constant ≈ 0.61
j_stat = (rv_arr - bpv_arr) / rv_arr     # jump fraction
jump_days = rv_df[j_stat > 0.3]          # >30% of RV from jumps
print(f"\\nDays with >30% jump contribution: {len(jump_days)} ({len(jump_days)/len(rv_df):.1%})")
`}),e.jsx(_,{references:[{author:"Andersen, T.G., Bollerslev, T., Diebold, F.X., & Labys, P.",year:2003,title:"Modeling and forecasting realized volatility",journal:"Econometrica",volume:"71(2)",pages:"579–625"},{author:"Corsi, F.",year:2009,title:"A simple approximate long-memory model of realized volatility",journal:"Journal of Financial Econometrics",volume:"7(2)",pages:"174–196"},{author:"Barndorff-Nielsen, O.E. & Shephard, N.",year:2004,title:"Power and bipower variation with stochastic volatility and jumps",journal:"Journal of Financial Econometrics",volume:"2(1)",pages:"1–37"}]})]})}const je=Object.freeze(Object.defineProperty({__proto__:null,default:Z},Symbol.toStringTag,{value:"Module"})),ee=[{strike:80,iv_1m:28.5,iv_3m:25.2,iv_6m:23.8},{strike:85,iv_1m:26.1,iv_3m:23.8,iv_6m:22.7},{strike:90,iv_1m:24,iv_3m:22.5,iv_6m:21.9},{strike:95,iv_1m:22.2,iv_3m:21.4,iv_6m:21.3},{strike:100,iv_1m:20.8,iv_3m:20.6,iv_6m:20.8},{strike:105,iv_1m:19.9,iv_3m:20.1,iv_6m:20.5},{strike:110,iv_1m:19.5,iv_3m:19.8,iv_6m:20.3},{strike:115,iv_1m:19.8,iv_3m:19.9,iv_6m:20.4},{strike:120,iv_1m:20.8,iv_3m:20.4,iv_6m:20.7}];function te(){return e.jsxs(f,{title:"Implied Volatility and Vol Surface",subject:"Financial Forecasting",difficulty:"expert",readingTime:14,children:[e.jsx("p",{children:"Implied volatility (IV) is the volatility value that, when plugged into an options pricing model, produces the observed market price. Unlike realized volatility (backward-looking), implied volatility is forward-looking — it represents the market's consensus forecast of future volatility over the option's lifetime. The vol surface is the three-dimensional structure of IV across strikes (moneyness) and maturities."}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Black-Scholes Implied Volatility"}),e.jsxs(o,{title:"Black-Scholes Model",children:["The Black-Scholes formula prices a European call option as:",e.jsx(t.BlockMath,{math:"C = S_0 \\Phi(d_1) - K e^{-rT} \\Phi(d_2)"}),e.jsx(t.BlockMath,{math:"d_1 = \\frac{\\ln(S_0/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}}, \\quad d_2 = d_1 - \\sigma\\sqrt{T}"}),"where ",e.jsx(t.InlineMath,{math:"S_0"})," is spot, ",e.jsx(t.InlineMath,{math:"K"})," is strike, ",e.jsx(t.InlineMath,{math:"T"}),"is time to expiry, ",e.jsx(t.InlineMath,{math:"r"})," is risk-free rate, and ",e.jsx(t.InlineMath,{math:"\\sigma"})," is volatility. Implied volatility is the ",e.jsx(t.InlineMath,{math:"\\sigma"})," that equates the model price to the observed market price — found numerically (no closed form)."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Volatility Smile and Skew"}),e.jsx("p",{children:'Black-Scholes assumes constant volatility across strikes. In reality, IV varies — this variation is the "vol smile" or "vol skew":'}),e.jsxs("ul",{className:"list-disc ml-5 space-y-1 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Vol skew (equity)"}),": IV is higher for low-strike (put) options than high-strike (call) options. Left tail risk (crash fear) drives up put prices relative to BS."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Vol smile (FX, commodities)"}),": IV is symmetric around ATM, higher for both OTM puts and calls. Both tails are expensive."]})]}),e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg border",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Volatility Smile / Skew Across Maturities"}),e.jsx("p",{className:"text-sm text-gray-600 mb-3",children:"Equity vol skew: OTM puts (left strikes) have higher IV due to crash fear. Skew flattens with maturity as more time allows mean reversion."}),e.jsx(c,{width:"100%",height:240,children:e.jsxs(k,{data:ee,margin:{top:5,right:20,bottom:20,left:10},children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"strike",label:{value:"Strike (spot = 100)",position:"insideBottom",offset:-10}}),e.jsx(l,{label:{value:"Implied Vol %",angle:-90,position:"insideLeft"},domain:[18,30]}),e.jsx(p,{}),e.jsx(R,{verticalAlign:"top"}),e.jsx(d,{dataKey:"iv_1m",stroke:"#ef4444",strokeWidth:2,dot:!1,name:"1M IV"}),e.jsx(d,{dataKey:"iv_3m",stroke:"#3b82f6",strokeWidth:2,dot:!1,name:"3M IV"}),e.jsx(d,{dataKey:"iv_6m",stroke:"#22c55e",strokeWidth:2,dot:!1,name:"6M IV"})]})})]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"VIX Construction"}),e.jsxs(o,{title:"VIX — Model-Free Volatility Index",children:["The VIX measures 30-day implied volatility of the S&P 500 using a model-free formula:",e.jsx(t.BlockMath,{math:"\\text{VIX}^2 = \\frac{2}{T} \\sum_i \\frac{\\Delta K_i}{K_i^2} e^{rT} Q(K_i) - \\frac{1}{T}\\left[\\frac{F}{K_0} - 1\\right]^2"}),"where ",e.jsx(t.InlineMath,{math:"Q(K_i)"})," is the option price (put for ",e.jsx(t.InlineMath,{math:"K < F"}),", call for ",e.jsx(t.InlineMath,{math:"K > F"}),"), ",e.jsx(t.InlineMath,{math:"F"})," is the forward price,",e.jsx(t.InlineMath,{math:"K_0"})," is the first strike below ",e.jsx(t.InlineMath,{math:"F"}),", and the sum runs over all quoted strikes. VIX captures the entire vol surface, not just ATM vol."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"SABR Model"}),e.jsxs(o,{title:"SABR Stochastic Volatility Model",children:["SABR (Hagan et al. 2002) models the vol surface analytically with four parameters:",e.jsx(t.BlockMath,{math:"dF = \\sigma F^\\beta dW_1, \\quad d\\sigma = \\nu \\sigma dW_2, \\quad \\mathbb{E}[dW_1 dW_2] = \\rho \\, dt"}),"where ",e.jsx(t.InlineMath,{math:"\\beta \\in [0,1]"})," controls the backbone shape (0=normal, 1=log-normal),",e.jsx(t.InlineMath,{math:"\\nu"})," is vol-of-vol, and ",e.jsx(t.InlineMath,{math:"\\rho"})," is the correlation (equity: typically ",e.jsx(t.InlineMath,{math:"\\rho < 0"})," for negative skew). SABR provides an analytic approximation for the IV surface that fits market smiles well for liquid options."]}),e.jsx("h2",{className:"text-xl font-bold mt-6 mb-3",children:"Forecasting with Implied Volatility"}),e.jsx("p",{children:"IV is a forward-looking signal with several forecasting applications:"}),e.jsxs("ul",{className:"list-disc ml-5 space-y-2 text-sm mt-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Volatility forecasting"}),": IV is a biased but efficient predictor of future RV. The variance risk premium (IV² − RV) is systematically positive (options are expensive) — shorting volatility generates a premium."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Return forecasting"}),": The vol skew (SKEW index) and term structure of IV predict future equity returns at monthly horizons. Steeper skew predicts lower returns."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cross-asset signals"}),": Credit spreads and IV are co-integrated — IV term structure inversion (short-term IV > long-term IV) signals near-term stress."]})]}),e.jsx(g,{children:"The variance risk premium (VRP) is the difference between risk-neutral variance (IV²) and physical variance (RV): VRP = IV² − RV. It is persistently positive for equity index options (~3–5 vol points per year) because investors pay to hedge downside risk. Short volatility strategies harvest this premium but have severe left-tail risk (massive losses in market crashes). VRP estimation requires careful handling of maturity and moneyness alignment."}),e.jsx(x,{children:"Implied volatility from thinly traded options contains significant liquidity premium and bid-ask noise. Always use mid-price quotes and filter out options with zero open interest or abnormally wide spreads. For interpolation within the surface, use cubic spline or SVI (Stochastic Volatility Inspired) parameterization rather than linear interpolation, which can produce arbitrage."}),e.jsx(n,{title:"Black-Scholes Implied Vol and Vol Surface",code:`import numpy as np
from scipy.stats import norm
from scipy.optimize import brentq
import pandas as pd

# ── Black-Scholes pricing ─────────────────────────────────────────────────────
def bs_call(S, K, T, r, sigma):
    """Black-Scholes call price."""
    if T <= 0 or sigma <= 0:
        return max(S - K * np.exp(-r * T), 0)
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    return S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)

def bs_put(S, K, T, r, sigma):
    """Black-Scholes put price (put-call parity)."""
    c = bs_call(S, K, T, r, sigma)
    return c - S + K * np.exp(-r * T)

def bs_vega(S, K, T, r, sigma):
    """Black-Scholes vega."""
    if T <= 0 or sigma <= 0:
        return 0
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    return S * norm.pdf(d1) * np.sqrt(T)

# ── Implied volatility via Brent's method ────────────────────────────────────
def implied_vol(market_price, S, K, T, r, option_type='call', tol=1e-8):
    """
    Compute implied volatility by inverting BS formula.
    Returns np.nan if no solution found.
    """
    pricer = bs_call if option_type == 'call' else bs_put

    # Bounds check: option must be worth at least intrinsic
    intrinsic = max(S - K * np.exp(-r * T), 0) if option_type == 'call'                 else max(K * np.exp(-r * T) - S, 0)
    if market_price <= intrinsic + 1e-10:
        return np.nan

    try:
        iv = brentq(
            lambda sigma: pricer(S, K, T, r, sigma) - market_price,
            a=1e-6, b=10.0, xtol=tol, full_output=False
        )
        return iv
    except ValueError:
        return np.nan

# ── Newton-Raphson IV (faster for well-behaved cases) ────────────────────────
def implied_vol_nr(market_price, S, K, T, r, option_type='call',
                   max_iter=50, tol=1e-8):
    """Newton-Raphson implied vol solver."""
    sigma = 0.25   # initial guess: 25%
    pricer = bs_call if option_type == 'call' else bs_put
    for _ in range(max_iter):
        price  = pricer(S, K, T, r, sigma)
        vega   = bs_vega(S, K, T, r, sigma)
        if abs(vega) < 1e-12:
            return np.nan
        sigma -= (price - market_price) / vega
        sigma  = max(sigma, 1e-8)
        if abs(price - market_price) < tol:
            return sigma
    return sigma

# ── Build a vol surface ───────────────────────────────────────────────────────
S, r = 100.0, 0.05
# Simulate market option prices with a known skewed vol structure
def market_vol(K, T):
    """Hypothetical true vol surface with negative skew."""
    atm_vol  = 0.20
    skew     = -0.15 * (K/S - 1)          # linear skew
    term     = 0.02 * np.log(T / 0.5 + 1) # term structure
    return max(atm_vol + skew + term, 0.05)

strikes     = np.arange(80, 125, 5, dtype=float)
maturities  = [1/12, 3/12, 6/12, 1.0]   # 1M, 3M, 6M, 1Y

surface = {}
for T in maturities:
    ivs = []
    for K in strikes:
        true_vol  = market_vol(K, T)
        call_px   = bs_call(S, K, T, r, true_vol) + np.random.normal(0, 0.02)
        call_px   = max(call_px, 0.01)
        iv_recovered = implied_vol(call_px, S, K, T, r, 'call')
        ivs.append(iv_recovered)
    surface[f'T={T:.2f}'] = ivs

surf_df = pd.DataFrame(surface, index=strikes)
surf_df.index.name = 'Strike'
print("Implied Volatility Surface:")
print((surf_df * 100).round(1).to_string())

# ── VIX-style index calculation ───────────────────────────────────────────────
def compute_vix_style(strikes, ivs, S, T, r):
    """Approximate VIX calculation from a list of (K, IV) pairs."""
    F = S * np.exp(r * T)
    K0_idx = np.searchsorted(strikes, F, side='right') - 1
    K0 = strikes[max(K0_idx, 0)]

    sigma2 = 0.0
    for i, (K, iv) in enumerate(zip(strikes, ivs)):
        if iv is None or np.isnan(iv):
            continue
        dK = (strikes[i+1] - strikes[i-1]) / 2 if 0 < i < len(strikes)-1 else (strikes[1] - strikes[0])
        opt_type = 'put' if K < F else ('call' if K > F else 'call')
        price = bs_put(S, K, T, r, iv) if opt_type == 'put' else bs_call(S, K, T, r, iv)
        sigma2 += (2 / T) * (dK / K**2) * np.exp(r * T) * price

    sigma2 -= (1 / T) * (F / K0 - 1)**2
    return np.sqrt(max(sigma2, 0)) * 100

T_vix = 30 / 365
ivs_vix = [market_vol(K, T_vix) for K in strikes]
vix = compute_vix_style(strikes, ivs_vix, S, T_vix, r)
print(f"\\nVIX-style index (30-day): {vix:.1f}")
`}),e.jsx(_,{references:[{author:"Black, F. & Scholes, M.",year:1973,title:"The pricing of options and corporate liabilities",journal:"Journal of Political Economy",volume:"81(3)",pages:"637–654"},{author:"Hagan, P.S., Kumar, D., Lesniewski, A.S., & Woodward, D.E.",year:2002,title:"Managing smile risk",journal:"Wilmott Magazine",volume:"September",pages:"84–108"},{author:"Gatheral, J.",year:2006,title:"The Volatility Surface: A Practitioner's Guide",publisher:"Wiley"}]})]})}const we=Object.freeze(Object.defineProperty({__proto__:null,default:te},Symbol.toStringTag,{value:"Module"})),ae=[{feature:"lag_return_1d",importance:.18},{feature:"realized_vol_7d",importance:.14},{feature:"lag_return_7d",importance:.11},{feature:"rsi_14",importance:.09},{feature:"nvt_ratio",importance:.08},{feature:"volume_change",importance:.07},{feature:"mvrv_ratio",importance:.06},{feature:"fear_greed",importance:.06},{feature:"macd_signal",importance:.05},{feature:"bb_width",importance:.04}],re=[{ret:"-10%+",freq:3},{ret:"-8%",freq:5},{ret:"-6%",freq:9},{ret:"-4%",freq:15},{ret:"-2%",freq:22},{ret:"0%",freq:28},{ret:"+2%",freq:21},{ret:"+4%",freq:14},{ret:"+6%",freq:8},{ret:"+8%",freq:5},{ret:"+10%+",freq:6}];function se(){const[r,i]=j.useState("technical");return e.jsxs(f,{title:"Cryptocurrency Price Forecasting",difficulty:"advanced",readingTime:35,prerequisites:["Financial Time Series","LightGBM/Feature Engineering","GARCH Models"],children:[e.jsx("p",{children:"Cryptocurrency markets present unique forecasting challenges: 24/7 continuous trading, extreme volatility, fat-tailed return distributions, regime shifts, and a rich ecosystem of on-chain data unavailable in traditional finance. These characteristics demand specialized feature engineering and careful handling of non-stationarity."}),e.jsx("h2",{children:"Unique Characteristics of Crypto Markets"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 my-4",children:[e.jsxs("div",{className:"p-3 bg-red-50 rounded-lg border border-red-200",children:[e.jsx("h4",{className:"font-semibold text-red-800 text-sm mb-1",children:"Challenges"}),e.jsxs("ul",{className:"text-xs text-red-700 space-y-1 list-disc pl-3",children:[e.jsx("li",{children:"24/7 trading: no market close or overnight gap"}),e.jsx("li",{children:"Returns 5–10x more volatile than equities"}),e.jsx("li",{children:"Fat tails: kurtosis often > 10 (normal ≈ 3)"}),e.jsx("li",{children:"Regime changes: bull/bear markets shift dynamics"}),e.jsx("li",{children:"Microstructure: low liquidity → price manipulation"}),e.jsx("li",{children:"Survivorship bias: most crypto projects go to zero"})]})]}),e.jsxs("div",{className:"p-3 bg-green-50 rounded-lg border border-green-200",children:[e.jsx("h4",{className:"font-semibold text-green-800 text-sm mb-1",children:"Unique Opportunities"}),e.jsxs("ul",{className:"text-xs text-green-700 space-y-1 list-disc pl-3",children:[e.jsx("li",{children:"On-chain data: transparent, real-time blockchain metrics"}),e.jsx("li",{children:"Sentiment proxies: social media, search volume"}),e.jsx("li",{children:"High-frequency data available (hourly, minutely)"}),e.jsx("li",{children:"Retail-driven: sentiment effects stronger than equities"}),e.jsx("li",{children:"Cross-asset flows: BTC dominance as regime signal"})]})]})]}),e.jsx("h2",{children:"Return Distribution"}),e.jsxs("div",{className:"my-4",children:[e.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Daily BTC returns (stylized): much fatter tails than Gaussian"}),e.jsx(c,{width:"100%",height:200,children:e.jsxs(b,{data:re,children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"ret",tick:{fontSize:11}}),e.jsx(l,{label:{value:"Frequency",angle:-90,position:"insideLeft"}}),e.jsx(p,{}),e.jsx(y,{dataKey:"freq",fill:"#f59e0b",name:"Frequency"})]})})]}),e.jsx("h2",{children:"Feature Engineering for Crypto"}),e.jsx("div",{className:"flex gap-2 flex-wrap my-4",children:[["technical","Technical"],["onchain","On-Chain"],["sentiment","Sentiment"]].map(([a,s])=>e.jsx("button",{onClick:()=>i(a),className:`px-3 py-1 rounded text-sm font-medium ${r===a?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:s},a))}),r==="technical"&&e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Technical Features"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-2 text-sm",children:[e.jsxs("div",{children:[e.jsx("strong",{children:"Momentum:"}),e.jsxs("ul",{className:"list-disc pl-4 mt-1 space-y-0.5",children:[e.jsx("li",{children:"Lag returns: 1d, 3d, 7d, 30d"}),e.jsx("li",{children:"RSI(14): overbought/oversold"}),e.jsx("li",{children:"MACD and signal line"}),e.jsx("li",{children:"Stochastic oscillator"})]})]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Volatility:"}),e.jsxs("ul",{className:"list-disc pl-4 mt-1 space-y-0.5",children:[e.jsx("li",{children:"Realized vol: 7d, 30d"}),e.jsx("li",{children:"Bollinger Band width"}),e.jsx("li",{children:"ATR (Average True Range)"}),e.jsx("li",{children:"Vol ratio: short/long"})]})]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Volume:"}),e.jsxs("ul",{className:"list-disc pl-4 mt-1 space-y-0.5",children:[e.jsx("li",{children:"Volume change vs 7d avg"}),e.jsx("li",{children:"OBV (On-Balance Volume)"}),e.jsx("li",{children:"Taker buy/sell ratio"})]})]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Price Structure:"}),e.jsxs("ul",{className:"list-disc pl-4 mt-1 space-y-0.5",children:[e.jsx("li",{children:"Distance from 200-day MA"}),e.jsx("li",{children:"All-time high drawdown"}),e.jsx("li",{children:"52-week high/low ratio"})]})]})]})]}),r==="onchain"&&e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"On-Chain Features (Bitcoin-specific)"}),e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"NVT Ratio"})," (Network Value to Transactions): Market cap / on-chain transaction volume. High NVT → overvalued. Analogous to P/E ratio."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MVRV Ratio"})," (Market Value to Realized Value): Market cap / realized cap (what each coin last moved at). MVRV > 3.5 historically marks cycle tops."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Realized Cap"}),": Sum of each UTXO's value at its last movement price. More stable than market cap."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"SOPR"})," (Spent Output Profit Ratio): Whether coins moved today were in profit. SOPR < 1 → selling at loss → potential bottom."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Exchange flow"}),": Net BTC inflow to exchanges. Large inflows → potential selling pressure."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Hash rate"}),": Network security; miner capitulation signals."]})]})]}),r==="sentiment"&&e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"Sentiment Features"}),e.jsxs("ul",{className:"space-y-2 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Fear & Greed Index"}),": CNN-style composite 0–100. Extreme fear (<20) historically good buying signal; extreme greed (>80) caution."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Social media volume"}),": Reddit post count, Twitter/X mention volume, LunarCrush social score."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Google Trends"}),': Search interest for "Bitcoin", "crypto". Spike in retail interest → late cycle signal.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Funding rates"}),": Perpetual futures funding rate. Positive = longs paying shorts; extreme = crowded long position."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Open interest"}),": Total futures open interest. Rising OI with rising price = trend continuation."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Long/short ratio"}),": Aggregated trader positioning from exchanges."]})]})]}),e.jsx("h2",{children:"Feature Importance"}),e.jsx(c,{width:"100%",height:260,children:e.jsxs(b,{data:ae,layout:"vertical",children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{type:"number",tickFormatter:a=>`${(a*100).toFixed(0)}%`}),e.jsx(l,{type:"category",dataKey:"feature",width:140,tick:{fontSize:11}}),e.jsx(p,{formatter:a=>`${(a*100).toFixed(1)}%`}),e.jsx(y,{dataKey:"importance",fill:"#f59e0b",name:"Importance"})]})}),e.jsx("h2",{children:"Return Prediction vs Price Prediction"}),e.jsxs("p",{children:["Predicting raw price levels is ill-posed: prices are non-stationary (I(1)). Always predict ",e.jsx("strong",{children:"returns"})," instead:"]}),e.jsx(t.BlockMath,{math:"r_t = \\ln P_t - \\ln P_{t-1} = \\ln\\left(\\frac{P_t}{P_{t-1}}\\right)"}),e.jsx("p",{children:"Log returns are approximately stationary (after removing ARCH effects). They are also additive: multi-period returns = sum of single-period log returns."}),e.jsx("h2",{children:"Python: BTC Feature Engineering + LightGBM"}),e.jsx(n,{code:`import pandas as pd
import numpy as np
import yfinance as yf
import lightgbm as lgb
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

# ── 1. Download BTC price data ─────────────────────────────────────────
btc = yf.download('BTC-USD', start='2018-01-01', end='2024-01-01', progress=False)
btc = btc[['Open', 'High', 'Low', 'Close', 'Volume']].copy()
print(f"Shape: {btc.shape}")`}),e.jsx(n,{code:`# ── 2. Technical feature engineering ─────────────────────────────────
def compute_rsi(series, window=14):
    delta = series.diff()
    gain = delta.clip(lower=0).rolling(window).mean()
    loss = (-delta.clip(upper=0)).rolling(window).mean()
    rs = gain / loss.replace(0, np.nan)
    return 100 - (100 / (1 + rs))

def compute_macd(series, fast=12, slow=26, signal=9):
    ema_fast = series.ewm(span=fast).mean()
    ema_slow = series.ewm(span=slow).mean()
    macd = ema_fast - ema_slow
    macd_signal = macd.ewm(span=signal).mean()
    return macd - macd_signal  # histogram

close = btc['Close']
vol = btc['Volume']

df = pd.DataFrame(index=btc.index)
# Returns
df['ret_1d'] = close.pct_change(1)
df['ret_3d'] = close.pct_change(3)
df['ret_7d'] = close.pct_change(7)
df['ret_30d'] = close.pct_change(30)
df['log_ret_1d'] = np.log(close / close.shift(1))

# Volatility
df['realized_vol_7d']  = df['log_ret_1d'].rolling(7).std() * np.sqrt(365)
df['realized_vol_30d'] = df['log_ret_1d'].rolling(30).std() * np.sqrt(365)
df['vol_ratio']        = df['realized_vol_7d'] / df['realized_vol_30d']

# Momentum
df['rsi_14']    = compute_rsi(close, 14)
df['macd_hist'] = compute_macd(close)
df['mom_score'] = (df['ret_7d'].rank(pct=True) + df['ret_30d'].rank(pct=True)) / 2

# Bollinger Bands
bb_mid = close.rolling(20).mean()
bb_std = close.rolling(20).std()
df['bb_width'] = 2 * bb_std / bb_mid
df['bb_pos']   = (close - bb_mid) / (2 * bb_std)

# Volume
df['vol_change_7d'] = vol / vol.rolling(7).mean() - 1
df['obv'] = (np.sign(df['log_ret_1d']) * vol).cumsum()
df['obv_change'] = df['obv'].pct_change(7)

# Distance from moving averages
df['dist_ma50']  = close / close.rolling(50).mean() - 1
df['dist_ma200'] = close / close.rolling(200).mean() - 1`}),e.jsx(n,{code:`# ── 3. Target: forward 7-day return ──────────────────────────────────
df['target'] = close.pct_change(7).shift(-7)  # 7-day forward return

# Clip extreme returns (tail risk management)
df['target'] = df['target'].clip(-0.5, 0.5)

# ── 4. Train/test split (time-ordered) ───────────────────────────────
df = df.dropna()
train = df[df.index < '2023-01-01']
test  = df[df.index >= '2023-01-01']

feature_cols = [c for c in df.columns if c != 'target']
X_train, y_train = train[feature_cols], train['target']
X_test,  y_test  = test[feature_cols],  test['target']

# ── 5. LightGBM model ─────────────────────────────────────────────────
lgbm = lgb.LGBMRegressor(
    n_estimators=500,
    learning_rate=0.02,
    num_leaves=31,
    min_child_samples=30,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=0.1,
    random_state=42,
    verbosity=-1,
)
lgbm.fit(X_train, y_train,
         eval_set=[(X_test, y_test)],
         callbacks=[lgb.early_stopping(50, verbose=False)])

y_pred = lgbm.predict(X_test)
print(f"Test MAE: {mean_absolute_error(y_test, y_pred):.4f}")
print(f"Correlation (pred vs actual): {np.corrcoef(y_pred, y_test)[0,1]:.4f}")`}),e.jsx(n,{code:`# ── 6. Regime detection ───────────────────────────────────────────────
# Crypto markets alternate between bull and bear regimes
# Simple regime detection using 200-day MA

df['regime'] = np.where(close > close.rolling(200).mean(), 'bull', 'bear')
regime_returns = df.groupby('regime')['ret_1d'].describe()
print(regime_returns)

# Evaluate model per regime
results = pd.DataFrame({
    'actual': y_test,
    'predicted': y_pred,
    'regime': df.loc[y_test.index, 'regime'],
})
print(results.groupby('regime').apply(
    lambda g: pd.Series({'mae': mean_absolute_error(g['actual'], g['predicted']),
                         'corr': g['actual'].corr(g['predicted'])})
))`}),e.jsx(o,{title:"NVT Ratio",children:"Network Value to Transactions Ratio = Market Cap / 30-day average daily on-chain transaction volume (USD). An on-chain analogue to the P/E ratio for networks. NVT > 65 has historically signaled overvaluation; NVT < 35 potential undervaluation. Available from Glassnode, CoinMetrics, or computed from raw blockchain data."}),e.jsx(o,{title:"MVRV Ratio",children:"Market Value to Realized Value = Market Cap / Realized Cap. Realized Cap sums each coin at the price it last moved, providing an estimate of aggregate cost basis. When MVRV > 3.5, most holders are in profit and incentivized to sell (historically coincides with cycle peaks). MVRV < 1 means average holder is at a loss."}),e.jsxs(x,{children:["Backtesting bias in crypto is severe. Two critical issues: (1) ",e.jsx("strong",{children:"Survivorship bias"})," — most altcoins go to zero; a backtest on only surviving coins inflates returns. (2) ",e.jsx("strong",{children:"Look-ahead bias"})," — on-chain metrics like MVRV are often revised after initial publication; use point-in-time data from providers like Glassnode, not retrospectively computed values."]}),e.jsxs(g,{children:["Predicting the ",e.jsx("em",{children:"direction"})," of returns (classification) is often more actionable than magnitude (regression). A classifier that correctly predicts direction 55% of the time can be profitable with proper position sizing, even with low magnitude accuracy."]}),e.jsx(_,{references:[{authors:"Cretarola, A., Figà-Talamanca, G.",year:2021,title:"Detecting bubbles in Bitcoin price dynamics via market exuberance",journal:"Annals of Operations Research",volume:"299",pages:"459–479"},{authors:"Liu, Y., Tsyvinski, A.",year:2021,title:"Risks and returns of cryptocurrency",journal:"Review of Financial Studies",volume:"34(6)",pages:"2689–2727"}]})]})}const ke=Object.freeze(Object.defineProperty({__proto__:null,default:se},Symbol.toStringTag,{value:"Module"})),ie=[{month:"Jan",strategy:100,buyhold:100},{month:"Feb",strategy:103,buyhold:108},{month:"Mar",strategy:108,buyhold:95},{month:"Apr",strategy:112,buyhold:110},{month:"May",strategy:118,buyhold:115},{month:"Jun",strategy:114,buyhold:105},{month:"Jul",strategy:120,buyhold:118},{month:"Aug",strategy:125,buyhold:122},{month:"Sep",strategy:122,buyhold:112},{month:"Oct",strategy:130,buyhold:125},{month:"Nov",strategy:138,buyhold:130},{month:"Dec",strategy:142,buyhold:135}],ne=[{month:"Jan",drawdown:0},{month:"Feb",drawdown:-2},{month:"Mar",drawdown:-5},{month:"Apr",drawdown:-1},{month:"May",drawdown:0},{month:"Jun",drawdown:-4},{month:"Jul",drawdown:-2},{month:"Aug",drawdown:0},{month:"Sep",drawdown:-3},{month:"Oct",drawdown:0},{month:"Nov",drawdown:0},{month:"Dec",drawdown:0}];function oe(){const[r,i]=j.useState("momentum");return e.jsxs(f,{title:"Algorithmic Trading Strategies",difficulty:"advanced",readingTime:35,prerequisites:["Crypto Forecasting","Financial Time Series","Statistics"],children:[e.jsx("p",{children:"Algorithmic trading formalizes investment decisions into repeatable, systematic rules. This section covers the three core strategy archetypes — momentum, mean-reversion, and statistical arbitrage — along with rigorous backtesting methodology to avoid the pitfalls that cause most backtests to fail in live trading."}),e.jsx("h2",{children:"Strategy Taxonomy"}),e.jsx("div",{className:"flex gap-2 flex-wrap my-4",children:[["momentum","Momentum"],["mean-rev","Mean-Reversion"],["stat-arb","Statistical Arbitrage"]].map(([a,s])=>e.jsx("button",{onClick:()=>i(a),className:`px-3 py-1 rounded text-sm font-medium ${r===a?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:s},a))}),r==="momentum"&&e.jsxs("div",{className:"bg-blue-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold text-blue-800 mb-2",children:"Momentum Strategies"}),e.jsxs("p",{className:"text-sm text-blue-700 mb-2",children:[e.jsx("strong",{children:"Thesis"}),": past winners continue to outperform past losers (Jegadeesh & Titman, 1993). Assets that have risen continue rising."]}),e.jsxs("ul",{className:"text-sm text-blue-700 space-y-1 list-disc pl-4",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Cross-sectional"}),": rank assets by past 12-month return, long top decile, short bottom decile"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Time-series (TSMOM)"}),": go long if asset's own past 12-month return > 0, short if < 0"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Short-term reversal"}),": 1-week losers bounce back (mean-reversion at short horizon)"]})]}),e.jsx("p",{className:"text-sm text-blue-700 mt-2 font-mono",children:"Signal: r(t-252, t-21) — exclude last month to avoid short-term reversal"})]}),r==="mean-rev"&&e.jsxs("div",{className:"bg-green-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold text-green-800 mb-2",children:"Mean-Reversion Strategies"}),e.jsxs("p",{className:"text-sm text-green-700 mb-2",children:[e.jsx("strong",{children:"Thesis"}),": prices deviate from fundamental value and revert. Temporary dislocations are exploited."]}),e.jsxs("ul",{className:"text-sm text-green-700 space-y-1 list-disc pl-4",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Z-score trading"}),": buy when price is N std below rolling mean, sell when above"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Pairs trading"}),": exploit cointegrated pair; trade the spread"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Ornstein-Uhlenbeck"}),": model spread as mean-reverting OU process, optimize entry/exit"]})]}),e.jsx(t.BlockMath,{math:"dS_t = \\theta(\\mu - S_t)dt + \\sigma dW_t"}),e.jsx("p",{className:"text-sm text-green-700",children:"Half-life = ln(2)/θ — how fast the spread reverts"})]}),r==="stat-arb"&&e.jsxs("div",{className:"bg-yellow-50 rounded-lg p-4",children:[e.jsx("h3",{className:"font-semibold text-yellow-800 mb-2",children:"Statistical Arbitrage"}),e.jsxs("p",{className:"text-sm text-yellow-700 mb-2",children:[e.jsx("strong",{children:"Thesis"}),": exploit pricing inefficiencies between related assets using statistical models."]}),e.jsxs("ul",{className:"text-sm text-yellow-700 space-y-1 list-disc pl-4",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Crypto-specific"}),": BTC vs ETH spread, exchange arbitrage (same asset, different exchanges)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Futures basis"}),": spot vs perpetual futures basis trading"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Factor-neutral"}),": long undervalued, short overvalued, market-neutral"]})]})]}),e.jsx("h2",{children:"Walk-Forward Backtesting Framework"}),e.jsx(o,{title:"Walk-Forward Analysis",children:"Walk-forward analysis simulates real trading by training on a fixed in-sample window and testing on the immediately following out-of-sample period, then rolling forward. Unlike simple train/test splits, this provides multiple independent test periods and tests whether the strategy degrades over time (parameter instability)."}),e.jsx("div",{className:"bg-gray-100 rounded p-3 font-mono text-xs my-4 overflow-x-auto",children:e.jsx("pre",{children:`Train: [2019-01 → 2020-12]  Test: [2021-01 → 2021-03]
Train: [2019-04 → 2021-03]  Test: [2021-04 → 2021-06]
Train: [2019-07 → 2021-06]  Test: [2021-07 → 2021-09]
...`})}),e.jsx("h2",{children:"Equity Curve & Drawdown"}),e.jsx("div",{className:"my-4",children:e.jsx(c,{width:"100%",height:220,children:e.jsxs(k,{data:ie,children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"month"}),e.jsx(l,{domain:[90,155]}),e.jsx(p,{formatter:a=>`$${a}`}),e.jsx(R,{}),e.jsx(d,{type:"monotone",dataKey:"strategy",stroke:"#6366f1",strokeWidth:2,dot:!1,name:"Momentum Strategy"}),e.jsx(d,{type:"monotone",dataKey:"buyhold",stroke:"#9ca3af",strokeWidth:1,strokeDasharray:"4 2",dot:!1,name:"Buy & Hold"})]})})}),e.jsxs("div",{className:"my-4",children:[e.jsx("p",{className:"text-sm text-gray-600 mb-1",children:"Maximum Drawdown"}),e.jsx(c,{width:"100%",height:120,children:e.jsxs(b,{data:ne,children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"month",tick:{fontSize:11}}),e.jsx(l,{tickFormatter:a=>`${a}%`}),e.jsx(p,{formatter:a=>`${a}%`}),e.jsx(y,{dataKey:"drawdown",fill:"#ef4444",name:"Drawdown (%)"})]})})]}),e.jsx("h2",{children:"Python: Momentum Strategy Backtest"}),e.jsx(n,{code:`import pandas as pd
import numpy as np
import yfinance as yf

# ── 1. Download crypto data ────────────────────────────────────────────
tickers = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'ADA-USD']
raw = yf.download(tickers, start='2020-01-01', end='2024-01-01', progress=False)
prices = raw['Adj Close'].dropna()
print(f"Assets: {prices.columns.tolist()}")
print(f"Dates: {prices.index[0].date()} to {prices.index[-1].date()}")`}),e.jsx(n,{code:`# ── 2. Time-series momentum signal ────────────────────────────────────
# Signal: sign of trailing 12-month return (excluding last month)
# Positive return → long; negative → flat (no short for simplicity)

returns = prices.pct_change()

# 12-month lookback, skip last 1 month (avoid short-term reversal)
signal_raw = prices.shift(21) / prices.shift(252) - 1  # approx 12mo - 1mo
signal = np.sign(signal_raw)
signal = signal.clip(lower=0)  # long-only: 0 or +1

# Equal weight across assets that are long
n_long = signal.sum(axis=1).replace(0, np.nan)
weights = signal.div(n_long, axis=0).fillna(0)

# ── 3. Strategy returns ────────────────────────────────────────────────
# Apply weights with 1-day lag (signal known at close, trade next open ≈ next close)
strategy_returns = (weights.shift(1) * returns).sum(axis=1)
buyhold_returns = returns.mean(axis=1)  # equal-weight benchmark

# Remove first year (no signal)
strategy_returns = strategy_returns[strategy_returns.index >= '2021-01-01']
buyhold_returns  = buyhold_returns[buyhold_returns.index >= '2021-01-01']`}),e.jsx(n,{code:`# ── 4. Performance metrics ────────────────────────────────────────────
def sharpe(rets, periods=365):
    return rets.mean() / rets.std() * np.sqrt(periods)

def max_drawdown(rets):
    cum = (1 + rets).cumprod()
    rolling_max = cum.cummax()
    drawdown = cum / rolling_max - 1
    return drawdown.min()

def calmar(rets, periods=365):
    ann_return = (1 + rets).prod() ** (periods / len(rets)) - 1
    mdd = abs(max_drawdown(rets))
    return ann_return / mdd if mdd > 0 else np.inf

metrics = pd.DataFrame({
    'Strategy': strategy_returns,
    'Buy & Hold': buyhold_returns,
}).apply(lambda col: pd.Series({
    'Ann. Return': f"{((1 + col).prod() ** (365/len(col)) - 1):.1%}",
    'Sharpe Ratio': f"{sharpe(col):.2f}",
    'Max Drawdown': f"{max_drawdown(col):.1%}",
    'Calmar Ratio': f"{calmar(col):.2f}",
    'Hit Rate': f"{(col > 0).mean():.1%}",
}))
print(metrics.T)`}),e.jsx(n,{code:`# ── 5. Transaction costs ──────────────────────────────────────────────
# Realistic cost model: 0.1% taker fee + 0.1% slippage = 0.2% per trade
fee_rate = 0.002  # 0.2% per round-trip

# Compute daily portfolio turnover
turnover = weights.diff().abs().sum(axis=1)
cost_drag = turnover * fee_rate / 2  # one-way cost

strategy_net = strategy_returns - cost_drag.shift(1).fillna(0)
print(f"Gross Sharpe: {sharpe(strategy_returns):.3f}")
print(f"Net Sharpe:   {sharpe(strategy_net):.3f}")
print(f"Annual cost drag: {cost_drag.mean() * 365:.1%}")`}),e.jsx(n,{code:`# ── 6. Walk-forward analysis ──────────────────────────────────────────
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler

def compute_features(prices, lookback=252):
    """Compute cross-sectional momentum features."""
    r = prices.pct_change()
    feats = pd.DataFrame(index=prices.index)
    feats['mom_12m_1m'] = prices.shift(21) / prices.shift(lookback) - 1
    feats['vol_adj_mom'] = feats['mom_12m_1m'] / (r.rolling(21).std() * np.sqrt(252))
    feats['vol_ratio']  = r.rolling(5).std() / r.rolling(21).std()
    return feats

wf_results = []
train_window = 365
test_window = 30

for start in range(train_window, len(prices) - test_window, test_window):
    train_prices = prices.iloc[start - train_window:start]
    test_prices  = prices.iloc[start:start + test_window]
    test_returns = test_prices.pct_change().dropna()

    # Simple signal: vol-adjusted momentum
    mom_signal = (
        train_prices.iloc[-1] / train_prices.shift(21).iloc[-1] - 1
    ).rank(ascending=True).apply(lambda x: 1 if x > len(prices.columns) / 2 else 0)
    n_long = mom_signal.sum()
    if n_long > 0:
        wts = mom_signal / n_long
        period_ret = (wts * test_returns).sum(axis=1).mean()
        wf_results.append({'period_return': period_ret, 'n_long': n_long})

wf_df = pd.DataFrame(wf_results)
print(f"Walk-forward periods: {len(wf_df)}")
print(f"Win rate: {(wf_df['period_return'] > 0).mean():.1%}")
print(f"Avg period return: {wf_df['period_return'].mean():.3%}")`}),e.jsx("h2",{children:"Key Performance Metrics"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-indigo-50",children:[e.jsx("th",{className:"border border-gray-300 p-2",children:"Metric"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Formula"}),e.jsx("th",{className:"border border-gray-300 p-2",children:"Good Value (crypto)"})]})}),e.jsx("tbody",{children:[["Sharpe Ratio","μ / σ × √365","> 1.5"],["Max Drawdown","max(peak - trough) / peak","< 30%"],["Calmar Ratio","Ann. Return / |Max DD|","> 1.0"],["Hit Rate","fraction of profitable days","> 52% (with high win/loss ratio)"],["Profit Factor","gross profit / gross loss","> 1.5"]].map(([a,s,u])=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:"border border-gray-300 p-2 font-semibold",children:a}),e.jsx("td",{className:"border border-gray-300 p-2 font-mono text-xs",children:s}),e.jsx("td",{className:"border border-gray-300 p-2 text-green-700",children:u})]},a))})]})}),e.jsxs(v,{title:"The Fundamental Law of Active Management",children:["Grinold (1989) shows that the information ratio (Sharpe of active returns) is:",e.jsx(t.BlockMath,{math:"\\text{IR} \\approx \\text{IC} \\cdot \\sqrt{\\text{BR}}"}),"where IC = Information Coefficient (correlation of signals with outcomes) and BR = Breadth (number of independent bets per year). A strategy with IC = 0.05 (modest predictive power) run at BR = 500 signals/year achieves IR ≈ 1.12. This argues for ",e.jsx("em",{children:"many independent signals"})," over perfect prediction."]}),e.jsx(x,{children:"Overfitting in backtesting is the #1 cause of live trading failure. Red flags: (1) In-sample Sharpe >> Out-of-sample Sharpe. (2) Many parameters were optimized. (3) Strategy was selected after viewing multiple backtests. (4) No transaction cost adjustment. Apply the deflated Sharpe ratio (Bailey & Lopez de Prado, 2014) to penalize for multiple testing across strategies."}),e.jsx(g,{children:"Always test your backtest for look-ahead bias before trusting results. Common sources: (1) using adjusted close prices (dividends/splits adjust backwards), (2) using data that was revised after initial release, (3) using the current index composition rather than the historical composition."}),e.jsx(_,{references:[{authors:"Jegadeesh, N., Titman, S.",year:1993,title:"Returns to buying winners and selling losers: Implications for stock market efficiency",journal:"Journal of Finance",volume:"48(1)",pages:"65–91"},{authors:"Moskowitz, T.J., Ooi, Y.H., Pedersen, L.H.",year:2012,title:"Time series momentum",journal:"Journal of Financial Economics",volume:"104(2)",pages:"228–250"},{authors:"Bailey, D.H., Lopez de Prado, M.",year:2014,title:"The Deflated Sharpe Ratio: Correcting for Selection Bias, Backtest Overfitting and Non-Normality",journal:"Journal of Portfolio Management",volume:"40(5)",pages:"94–107"}]})]})}const Re=Object.freeze(Object.defineProperty({__proto__:null,default:oe},Symbol.toStringTag,{value:"Module"}));function le(){const r=[100,103,101,107,112,109,115,108,104,110,118,114,120,116,122,119,125,121,128,135];let i=100;const a=r.map((s,u)=>(s>i&&(i=s),{t:u,price:s,drawdown:-((i-s)/i*100)}));return e.jsxs("div",{className:"my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",children:[e.jsx("h4",{className:"font-semibold text-gray-800 dark:text-gray-200 mb-3",children:"Portfolio Value and Drawdown"}),e.jsx(c,{width:"100%",height:180,children:e.jsxs(k,{data:a,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"t"}),e.jsx(l,{domain:[90,140]}),e.jsx(p,{}),e.jsx(d,{type:"monotone",dataKey:"price",stroke:"#2563eb",dot:!1,strokeWidth:2,name:"Portfolio ($)"})]})}),e.jsx(c,{width:"100%",height:120,children:e.jsxs(A,{data:a,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(m,{strokeDasharray:"3 3"}),e.jsx(h,{dataKey:"t"}),e.jsx(l,{domain:[-20,2],tickFormatter:s=>`${s}%`}),e.jsx(p,{formatter:s=>[`${s.toFixed(1)}%`,"Drawdown"]}),e.jsx(S,{type:"monotone",dataKey:"drawdown",stroke:"#ef4444",fill:"#fee2e2",fillOpacity:.6,name:"Drawdown (%)"})]})})]})}const de=`import numpy as np
import pandas as pd
from scipy import stats

# ── 1. Value at Risk (VaR) — three methods ────────────────────────────────
np.random.seed(42)
returns = np.random.normal(0.001, 0.02, 252)   # daily returns, 1 year

# Parametric VaR (assumes normal distribution)
alpha = 0.05   # 95% VaR
mu, sigma = returns.mean(), returns.std()
var_param = -(mu + stats.norm.ppf(alpha) * sigma)
print(f"Parametric 95% VaR: {var_param:.4f} ({var_param*100:.2f}%)")

# Historical VaR
var_hist = -np.percentile(returns, alpha*100)
print(f"Historical 95% VaR:  {var_hist:.4f} ({var_hist*100:.2f}%)")

# Monte Carlo VaR
n_sim = 100_000
simulated = np.random.normal(mu, sigma, n_sim)
var_mc = -np.percentile(simulated, alpha*100)
print(f"Monte Carlo 95% VaR: {var_mc:.4f} ({var_mc*100:.2f}%)")

# ── 2. CVaR / Expected Shortfall ─────────────────────────────────────────
# Expected loss given that loss exceeds VaR
cvar_hist = -returns[returns < -var_hist].mean()
cvar_param = -(mu - sigma * stats.norm.pdf(stats.norm.ppf(alpha)) / alpha)
print(f"Historical 95% CVaR:  {cvar_hist:.4f}")
print(f"Parametric 95% CVaR:  {cvar_param:.4f}")

# ── 3. Kelly Criterion for position sizing ────────────────────────────────
def kelly_fraction(win_prob, win_return, loss_return):
    """Kelly fraction: fraction of capital to risk per trade."""
    b = win_return / abs(loss_return)     # odds ratio
    p = win_prob
    q = 1 - p
    kelly = (b*p - q) / b
    return kelly

# Example: win 60% of time, win 1.5%, lose 1%
k = kelly_fraction(0.60, 0.015, 0.010)
half_k = k / 2   # half-Kelly: common risk management practice
print(f"Kelly fraction: {k:.4f} ({k*100:.1f}% of capital per trade)")
print(f"Half-Kelly:     {half_k:.4f} ({half_k*100:.1f}%)")

# ── 4. Portfolio VaR with correlation ─────────────────────────────────────
n_assets = 3
weights = np.array([0.5, 0.3, 0.2])
# Correlation matrix (e.g., BTC, ETH, SOL)
corr = np.array([
    [1.00, 0.75, 0.65],
    [0.75, 1.00, 0.70],
    [0.65, 0.70, 1.00],
])
vols = np.array([0.05, 0.06, 0.07])        # daily volatilities
cov = np.outer(vols, vols) * corr
portfolio_var_val = weights @ cov @ weights
portfolio_vol = np.sqrt(portfolio_var_val)
portfolio_var = stats.norm.ppf(1-alpha) * portfolio_vol
print(f"Portfolio daily 95% VaR: {portfolio_var:.4f} ({portfolio_var*100:.2f}%)")

# Diversification benefit
individual_vars = stats.norm.ppf(1-alpha) * vols
weighted_var = weights @ individual_vars
diversification = (weighted_var - portfolio_var) / weighted_var
print(f"Diversification benefit: {diversification:.1%}")

# ── 5. Drawdown analysis ──────────────────────────────────────────────────
price_series = pd.Series((1 + returns).cumprod() * 100)
rolling_max = price_series.cummax()
drawdown = (price_series - rolling_max) / rolling_max

max_drawdown = drawdown.min()
max_dd_end   = drawdown.idxmin()
max_dd_start = price_series[:max_dd_end].idxmax()

print(f"Maximum Drawdown: {max_drawdown:.2%}")
print(f"Drawdown period: {max_dd_start} → {max_dd_end}")

# Calmar ratio: annualized return / max drawdown
annual_return = (price_series.iloc[-1] / price_series.iloc[0])**(252/len(price_series)) - 1
calmar = abs(annual_return / max_drawdown)
print(f"Calmar ratio: {calmar:.2f}")

# ── 6. Sharpe and Sortino ratios ──────────────────────────────────────────
rf = 0.0001    # daily risk-free rate (≈ 2.5% annualized)
excess_returns = returns - rf
sharpe = np.sqrt(252) * excess_returns.mean() / excess_returns.std()
downside_vol = np.sqrt(252) * np.std(excess_returns[excess_returns < 0])
sortino = np.sqrt(252) * excess_returns.mean() / downside_vol
print(f"Annualized Sharpe: {sharpe:.2f}")
print(f"Annualized Sortino: {sortino:.2f}")

# ── 7. Stress testing: historical scenario replay ─────────────────────────
STRESS_SCENARIOS = {
    'COVID Crash (Mar 2020)': -0.34,    # S&P 500 drawdown
    'Crypto Winter 2022':     -0.75,    # BTC drawdown
    'FTX Collapse (Nov 2022)': -0.28,   # BTC 1-week return
    'March 2020 VIX spike':   +3.0,     # volatility shock
}
portfolio_value = 100_000
for name, shock in STRESS_SCENARIOS.items():
    if shock < 0:
        loss = portfolio_value * abs(shock)
        print(f"{name}: portfolio loss = \${loss:,.0f} ({shock:.0%})")
`;function ce(){return e.jsxs(f,{title:"Risk Management for Trading",difficulty:"advanced",readingTime:13,children:[e.jsx("p",{className:"text-lg text-zinc-700 dark:text-zinc-300 mb-4",children:"Professional risk management is what separates systematic traders who survive multi-year drawdowns from those who blow up. The core tools — Value at Risk, Expected Shortfall, Kelly sizing, and drawdown analysis — quantify tail risk and enforce position limits that preserve capital through adverse markets."}),e.jsxs(o,{term:"Value at Risk (VaR)",children:["The ",e.jsx(t.InlineMath,{math:"(1-\\alpha)"}),"-level VaR is the loss not exceeded with probability",e.jsx(t.InlineMath,{math:"1-\\alpha"}),":",e.jsx(t.BlockMath,{math:"\\text{VaR}_\\alpha = -\\inf\\{x : P(L \\leq x) \\geq 1-\\alpha\\} = -F_L^{-1}(\\alpha)"}),"For normally distributed returns: ",e.jsx(t.InlineMath,{math:"\\text{VaR}_{0.05} = -(\\mu + z_{0.05}\\sigma) = -\\mu + 1.645\\sigma"}),'. A 95% 1-day VaR of 2% means: "With 95% confidence, we will not lose more than 2% today."']}),e.jsx("h2",{className:"text-2xl font-bold mt-8 mb-3",children:"Three VaR Methods"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3 mb-6",children:[e.jsxs("div",{className:"p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl",children:[e.jsx("div",{className:"font-semibold text-blue-900 dark:text-blue-300 mb-1",children:"Parametric"}),e.jsx("div",{className:"mb-2",children:e.jsx(t.InlineMath,{math:"-\\mu - z_\\alpha \\sigma"})}),e.jsx("div",{className:"text-xs text-gray-600 dark:text-gray-400",children:"Assumes normal distribution. Fast but underestimates tail risk."})]}),e.jsxs("div",{className:"p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl",children:[e.jsx("div",{className:"font-semibold text-green-900 dark:text-green-300 mb-1",children:"Historical"}),e.jsx("div",{className:"mb-2",children:e.jsx(t.InlineMath,{math:"-\\hat{F}^{-1}(\\alpha)"})}),e.jsx("div",{className:"text-xs text-gray-600 dark:text-gray-400",children:"Uses empirical quantile of past returns. No distributional assumption, data-intensive."})]}),e.jsxs("div",{className:"p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl",children:[e.jsx("div",{className:"font-semibold text-purple-900 dark:text-purple-300 mb-1",children:"Monte Carlo"}),e.jsx("div",{className:"mb-2",children:e.jsx(t.InlineMath,{math:"-\\text{quantile}(\\{L^{(s)}\\}, \\alpha)"})}),e.jsx("div",{className:"text-xs text-gray-600 dark:text-gray-400",children:"Simulates thousands of paths. Most flexible, handles complex instruments."})]})]}),e.jsx("h2",{className:"text-2xl font-bold mt-8 mb-3",children:"CVaR: Expected Shortfall"}),e.jsxs("p",{className:"mb-3",children:["VaR tells you the threshold but not how bad things get beyond it. ",e.jsx("strong",{children:"Conditional VaR (CVaR)"}),", also called Expected Shortfall (ES), is the expected loss given that we are in the worst ",e.jsx(t.InlineMath,{math:"\\alpha"})," fraction of outcomes:"]}),e.jsx(t.BlockMath,{math:"\\text{CVaR}_\\alpha = \\mathbb{E}[L \\mid L > \\text{VaR}_\\alpha] = -\\frac{1}{\\alpha}\\int_0^\\alpha F_L^{-1}(u)\\,du"}),e.jsxs("p",{className:"mb-3",children:["For normal returns: ",e.jsx(t.InlineMath,{math:"\\text{CVaR}_{0.05} = -\\mu + \\sigma \\frac{\\phi(z_{0.05})}{\\alpha}"}),"where ",e.jsx(t.InlineMath,{math:"\\phi"})," is the standard normal PDF. CVaR is always",e.jsx(t.InlineMath,{math:"\\geq \\text{VaR}"})," and is a ",e.jsx("strong",{children:"coherent risk measure"}),"(satisfies subadditivity — diversification always reduces portfolio CVaR)."]}),e.jsxs(v,{title:"Kelly Criterion",children:["Given a bet with win probability ",e.jsx(t.InlineMath,{math:"p"}),", win return ",e.jsx(t.InlineMath,{math:"b"}),", and loss return ",e.jsx(t.InlineMath,{math:"-1"}),", the Kelly fraction that maximizes long-run log wealth is:",e.jsx(t.BlockMath,{math:"f^* = \\frac{bp - (1-p)}{b} = \\frac{p(b+1) - 1}{b}"}),"For continuous returns with mean ",e.jsx(t.InlineMath,{math:"\\mu"})," and variance ",e.jsx(t.InlineMath,{math:"\\sigma^2"}),":",e.jsx(t.BlockMath,{math:"f^* = \\frac{\\mu}{\\sigma^2}"}),e.jsx("strong",{children:"Half-Kelly"})," (",e.jsx(t.InlineMath,{math:"f^*/2"}),") is the standard practitioner choice — it reduces growth rate by only 25% while halving the variance and maximum expected drawdown."]}),e.jsx(le,{}),e.jsx("h2",{className:"text-2xl font-bold mt-8 mb-3",children:"Maximum Drawdown"}),e.jsx("p",{className:"mb-3",children:"Maximum drawdown (MDD) measures the largest peak-to-trough decline:"}),e.jsx(t.BlockMath,{math:"\\text{MDD} = \\max_{0 \\leq t_1 \\leq t_2 \\leq T} \\frac{V_{t_1} - V_{t_2}}{V_{t_1}}"}),e.jsxs("p",{className:"mb-3",children:["The ",e.jsx("strong",{children:"Calmar ratio"})," normalizes returns by maximum drawdown:",e.jsx(t.InlineMath,{math:"\\text{Calmar} = \\frac{R_{annual}}{|\\text{MDD}|}"}),". A Calmar above 1 means the strategy returns more than it ever drawdown — a high bar in practice."]}),e.jsx(g,{title:"Crypto Risk Amplification",children:"Crypto assets exhibit dramatically higher volatility than traditional assets. Bitcoin's annualized volatility is typically 60–100% vs 15–20% for equities. Apply volatility scaling: if your equity strategy risks 2% per trade, scale to 0.3–0.5% for BTC. Kelly fractions should be adjusted accordingly — naive full-Kelly on crypto leads to ruin."}),e.jsx(F,{title:"Complete Risk Toolkit",children:e.jsx(n,{code:de,title:"VaR, CVaR, Kelly, drawdown analysis"})}),e.jsx(x,{title:"VaR Limitations",children:"VaR is not a coherent risk measure — it violates subadditivity, meaning a portfolio can have higher VaR than the sum of its parts. During crisis periods (fat tails, correlation breakdown), VaR systematically underestimates actual losses. Always complement VaR with: (1) CVaR, (2) stress testing against historical worst scenarios, and (3) scenario analysis for correlated drawdowns across positions."}),e.jsx(_,{references:[{title:"Risk Management and Financial Institutions",authors:"Hull, J.C.",year:2018,venue:"Wiley Finance, 5th ed."},{title:"A New Interpretation of Information Rate",authors:"Kelly, J.L.",year:1956,venue:"Bell System Technical Journal, 35(4), 917–926"},{title:"Coherent Measures of Risk",authors:"Artzner, P., Delbaen, F., Eber, J.-M., Heath, D.",year:1999,venue:"Mathematical Finance, 9(3), 203–228"},{title:"Advances in Financial Machine Learning",authors:"López de Prado, M.",year:2018,venue:"Wiley"}]})]})}const Me=Object.freeze(Object.defineProperty({__proto__:null,default:ce},Symbol.toStringTag,{value:"Module"}));export{ge as a,xe as b,_e as c,ye as d,ve as e,be as f,je as g,we as h,ke as i,Re as j,Me as k,fe as s};
