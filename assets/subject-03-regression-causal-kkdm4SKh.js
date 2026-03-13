import{j as e,r as f}from"./vendor-CnSysweu.js";import{r as t}from"./vendor-katex-CdqB51LS.js";import{S as x,D as y,E as b,N as u,W as g,P as _,R as j,T as I}from"./subject-01-ts-foundations-fmj7uPpc.js";import{R as C,L as E,C as T,X as R,Y as F,T as B,d as D,a as k,b as N,B as K,c as M}from"./vendor-charts-BucFqer8.js";const O=32,z=["Q1","Q2","Q3","Q4"],w={intercept:50,trend:2.5,q2:10,q3:25,q4:15};function H(){const a=[];for(let o=0;o<O;o++){const r=o+1,s=o%4,i=[0,w.q2,w.q3,w.q4][s],n=Math.sin(o*5.3)*4+Math.cos(o*2.7)*2,l=w.intercept+w.trend*r+i+n;a.push({t:r,quarter:z[s],y:parseFloat(l.toFixed(2)),seasonal:i})}return a}const G=H();function Q(a,o,r){const s=a.length,i=a.map(h=>{const d=[1];return o&&d.push(h.t),r&&(d.push(h.quarter==="Q2"?1:0),d.push(h.quarter==="Q3"?1:0),d.push(h.quarter==="Q4"?1:0)),d}),n=a.map(h=>h.y),l=i[0].length;Array.from({length:l},(h,d)=>Array.from({length:l},(v,c)=>i.reduce((q,P)=>q+P[d]*P[c],0))),Array.from({length:l},(h,d)=>i.reduce((v,c,q)=>v+c[d]*n[q],0));let m=new Array(l).fill(0);for(let h=0;h<5e3;h++){const v=new Array(l).fill(0);for(let c=0;c<s;c++){const P=i[c].reduce((S,W,V)=>S+W*m[V],0)-n[c];for(let S=0;S<l;S++)v[S]+=P*i[c][S]}for(let c=0;c<l;c++)m[c]-=1e-4*v[c]}const p=i.map(h=>h.reduce((d,v,c)=>d+v*m[c],0)),A=n.map((h,d)=>h-p[d]),L=A.reduce((h,d)=>h+d*d,0),X=n.reduce((h,d)=>h+(d-n.reduce((v,c)=>v+c,0)/s)**2,0);return{beta:m,fitted:p,residuals:A,r2:1-L/X}}function J(){const[a,o]=f.useState(!0),[r,s]=f.useState(!0),{fitted:i,r2:n}=f.useMemo(()=>Q(G,a,r),[a,r]),l=G.map((m,p)=>({t:m.t,actual:m.y,fitted:parseFloat(i[p].toFixed(2))}));return e.jsxs("div",{className:"my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900",children:[e.jsx("h3",{className:"text-sm font-semibold text-zinc-300 mb-3",children:"Interactive: Trend & Seasonality Components"}),e.jsx("div",{className:"flex gap-3 mb-4",children:[{label:"Linear Trend",value:a,set:o},{label:"Seasonal Dummies (Q2/Q3/Q4)",value:r,set:s}].map(({label:m,value:p,set:A})=>e.jsx("button",{onClick:()=>A(L=>!L),className:`px-3 py-1.5 rounded text-xs font-medium ${p?"bg-sky-600 text-white":"border border-zinc-500 text-zinc-400"}`,children:m},m))}),e.jsxs("p",{className:"text-xs text-zinc-400 mb-2",children:["R² = ",e.jsx("span",{className:"text-sky-400 font-bold",children:n.toFixed(4)})]}),e.jsx(C,{width:"100%",height:260,children:e.jsxs(E,{data:l,children:[e.jsx(T,{strokeDasharray:"3 3",stroke:"#374151",opacity:.3}),e.jsx(R,{dataKey:"t",tick:{fontSize:10},label:{value:"Quarter",position:"insideBottom",offset:-2,fontSize:10}}),e.jsx(F,{tick:{fontSize:10}}),e.jsx(B,{contentStyle:{fontSize:11}}),e.jsx(D,{wrapperStyle:{fontSize:11}}),e.jsx(k,{dataKey:"actual",name:"Actual",stroke:"#94a3b8",strokeWidth:1.5,dot:{r:2}}),e.jsx(k,{dataKey:"fitted",name:"Fitted",stroke:"#3b82f6",strokeWidth:2,dot:!1,strokeDasharray:"4 2"})]})}),e.jsx("p",{className:"text-xs text-zinc-500 mt-2",children:"Toggle components to see their contribution to model fit."})]})}const U=`# Time Series Regression with statsmodels OLS
# pip install statsmodels pandas numpy

import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf
import matplotlib.pyplot as plt

# ── 1. Generate quarterly retail sales data ───────────────────────────────────
np.random.seed(42)
n_years = 8
n = n_years * 4   # quarterly

quarters = pd.date_range('2015-01', periods=n, freq='QS')
q_labels = [(d.month // 3) for d in quarters]  # 1-4

t = np.arange(1, n + 1)
q2 = (np.array(q_labels) == 2).astype(int)
q3 = (np.array(q_labels) == 3).astype(int)
q4 = (np.array(q_labels) == 4).astype(int)

# True DGP: y = 50 + 2.5t + 10*Q2 + 25*Q3 + 15*Q4 + noise
y = 50 + 2.5*t + 10*q2 + 25*q3 + 15*q4 + np.random.normal(0, 4, n)

df = pd.DataFrame({'y': y, 't': t, 'q2': q2, 'q3': q3, 'q4': q4,
                   'quarter': q_labels, 'date': quarters})

# ── 2. Linear trend model ─────────────────────────────────────────────────────
X_trend = sm.add_constant(df[['t']])
model_trend = sm.OLS(df['y'], X_trend).fit()
print("Linear trend model:")
print(model_trend.summary())
print(f"R² = {model_trend.rsquared:.4f}")

# ── 3. Seasonal dummy variables model ────────────────────────────────────────
# Q1 is the baseline (omitted category)
X_season = sm.add_constant(df[['t', 'q2', 'q3', 'q4']])
model_season = sm.OLS(df['y'], X_season).fit()
print("\\nTrend + seasonal dummies:")
print(model_season.summary())

# Interpretation:
# Intercept: expected value in Q1 when t=0
# β_q2 = 10.xx: "Q2 is β_q2 units higher than Q1, holding trend constant"
# β_q3 = 25.xx: "Q3 is β_q3 units higher than Q1"
# β_q4 = 15.xx: "Q4 is β_q4 units higher than Q1"

# ── 4. Polynomial trend ───────────────────────────────────────────────────────
df['t2'] = df['t'] ** 2
X_poly = sm.add_constant(df[['t', 't2', 'q2', 'q3', 'q4']])
model_poly = sm.OLS(df['y'], X_poly).fit()
print(f"\\nPolynomial trend R² = {model_poly.rsquared:.4f}")

# ── 5. F-test for joint significance of seasonal dummies ──────────────────────
from statsmodels.stats.anova import anova_lm
model_no_season = sm.OLS(df['y'], sm.add_constant(df[['t']])).fit()
# Compare restricted (no season) vs unrestricted (with season)
# F-test via comparison of residual SS
sse_r = model_no_season.ssr
sse_u = model_season.ssr
k_r, k_u = 2, 5  # number of params
F_stat = ((sse_r - sse_u) / (k_u - k_r)) / (sse_u / (n - k_u))
from scipy.stats import f
p_value = 1 - f.cdf(F_stat, k_u - k_r, n - k_u)
print(f"\\nF-test for seasonality: F={F_stat:.2f}, p={p_value:.6f}")
print("Seasonality is", "significant" if p_value < 0.05 else "NOT significant")

# ── 6. Forecasting with the regression model ─────────────────────────────────
future_t = np.arange(n + 1, n + 9)   # 2 more years
future_q = (future_t - 1) % 4 + 1
future_df = pd.DataFrame({
    't':  future_t,
    'q2': (future_q == 2).astype(int),
    'q3': (future_q == 3).astype(int),
    'q4': (future_q == 4).astype(int),
})
X_future = sm.add_constant(future_df[['t', 'q2', 'q3', 'q4']], has_constant='add')
forecast = model_season.predict(X_future)

pred_result = model_season.get_prediction(X_future)
pred_ci = pred_result.summary_frame(alpha=0.05)
print("\\n8-quarter ahead forecasts:")
print(pred_ci[['mean', 'obs_ci_lower', 'obs_ci_upper']].round(2))

# ── 7. Residual diagnostics ───────────────────────────────────────────────────
# Check for autocorrelation in residuals (common in TS regression)
from statsmodels.stats.stattools import durbin_watson
dw = durbin_watson(model_season.resid)
print(f"\\nDurbin-Watson statistic: {dw:.4f}")
print("  DW near 2 → no autocorrelation in residuals")
print("  DW < 1.5  → positive autocorrelation (consider adding AR term)")
`,Y=[{label:"FPP3 §7",title:"Forecasting: Principles and Practice – Time series regression models",authors:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/regression.html"},{label:"Wooldridge 2010",title:"Econometric Analysis of Cross Section and Panel Data",authors:"Wooldridge, J.M.",year:2010}];function $(){return e.jsxs(x,{title:"Time Series Regression for Forecasting",difficulty:"beginner",readingTime:22,prerequisites:["Baseline methods","Linear algebra basics"],children:[e.jsxs("p",{children:["Regression-based forecasting models the relationship between a time series and explanatory variables (time index, dummy variables, external regressors). Unlike ARIMA which models autocorrelation structure, regression models explain"," ",e.jsx("em",{children:"why"})," the series behaves as it does — making forecasts interpretable and actionable."]}),e.jsx("h2",{children:"1. Linear Trend Model"}),e.jsx(y,{label:"Definition",title:"Linear Trend Model",definition:"The simplest regression model for a trended time series uses time as the sole predictor.",notation:"y_t = \\beta_0 + \\beta_1 t + \\varepsilon_t, \\quad t = 1, 2, \\ldots, T"}),e.jsxs("p",{children:[e.jsx(t.InlineMath,{math:"\\beta_1 > 0"})," implies an upward trend of"," ",e.jsx(t.InlineMath,{math:"\\beta_1"})," units per period. The OLS forecast for future period"," ",e.jsx(t.InlineMath,{math:"T + h"})," is:"]}),e.jsx(t.BlockMath,{math:"\\hat{y}_{T+h} = \\hat{\\beta}_0 + \\hat{\\beta}_1 (T + h)"}),e.jsx("h2",{children:"2. Polynomial Trend"}),e.jsx("p",{children:"When the trend is non-linear, polynomial terms can be added:"}),e.jsx(t.BlockMath,{math:"y_t = \\beta_0 + \\beta_1 t + \\beta_2 t^2 + \\varepsilon_t"}),e.jsx("p",{children:"Quadratic trends are common for hump-shaped or accelerating growth patterns. Use with caution for forecasting: polynomials can diverge rapidly outside the training range."}),e.jsx("h2",{children:"3. Seasonal Dummy Variables"}),e.jsxs("p",{children:["For a series with ",e.jsx(t.InlineMath,{math:"m"})," seasons, we need"," ",e.jsx(t.InlineMath,{math:"m - 1"}),' dummy variables to avoid perfect multicollinearity (the "dummy variable trap"). The omitted season becomes the baseline:']}),e.jsx(t.BlockMath,{math:"y_t = \\beta_0 + \\beta_1 t + \\beta_2 d_{2,t} + \\beta_3 d_{3,t} + \\cdots + \\beta_m d_{m,t} + \\varepsilon_t"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"d_{j,t} = 1"})," if observation ",e.jsx(t.InlineMath,{math:"t"})," ","belongs to season ",e.jsx(t.InlineMath,{math:"j"}),", and 0 otherwise."]}),e.jsx(b,{title:"Quarterly Sales: Interpretation of Seasonal Coefficients",difficulty:"beginner",problem:"A quarterly model is fitted with Q1 as baseline. The estimated coefficients are: β₀=50, β₁=2.5, β_Q2=10, β_Q3=25, β_Q4=15. Interpret each.",solution:[{step:"Intercept interpretation",formula:"\\hat{y}_1 = 50 + 2.5 \\times 1 = 52.5 \\text{ (Q1, t=1)}",explanation:"β₀ is the expected value in Q1 when t=1 (or at t=0 by extrapolation). Not always meaningful on its own."},{step:"Trend interpretation",formula:"\\hat{y}_{t+1} - \\hat{y}_t = \\beta_1 = 2.5",explanation:"Each quarter, sales increase by 2.5 units on average, holding the seasonal effect constant."},{step:"Q2 seasonal effect",formula:"\\hat{y}_{Q2} - \\hat{y}_{Q1} = \\beta_{Q2} = 10",explanation:"Q2 is 10 units higher than Q1, after accounting for the trend. This is the 'April–June premium'."},{step:"Q3 seasonal effect (peak)",formula:"\\hat{y}_{Q3} - \\hat{y}_{Q1} = \\beta_{Q3} = 25",explanation:"Q3 is the peak season, 25 units above the Q1 baseline. This is statistically significant if the t-statistic > 2."}]}),e.jsx("h2",{children:"4. F-test for Seasonal Significance"}),e.jsx("p",{children:"To test whether seasonality is jointly significant (all seasonal dummies = 0):"}),e.jsx(t.BlockMath,{math:"F = \\frac{(RSS_R - RSS_U) / q}{RSS_U / (T - k - 1)} \\sim F(q, T-k-1)"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"RSS_R"})," is the restricted (no season) residual sum of squares,",e.jsx(t.InlineMath,{math:"RSS_U"})," is unrestricted, and ",e.jsx(t.InlineMath,{math:"q = m - 1"})," is the number of seasonal dummies being tested."]}),e.jsx("h2",{children:"Interactive: Components Toggle"}),e.jsx(J,{}),e.jsx(u,{type:"tip",title:"Durbin-Watson Test",children:"After fitting a time series regression, always check the Durbin-Watson statistic. A value near 2 indicates no autocorrelation in residuals. Values below 1.5 suggest positive autocorrelation — a sign that ARIMA errors or lag terms should be added."}),e.jsx(g,{title:"Spurious Regression",children:"Regressing one non-stationary series on another can produce high R² and significant t-statistics purely by chance — spurious regression (Granger & Newbold, 1974). Always check stationarity of the residuals when both y and X are non-stationary. Use cointegration tests (Engle-Granger, Johansen) if needed."}),e.jsx("h2",{children:"Python: statsmodels OLS"}),e.jsx(_,{code:U,filename:"ts_regression.py",title:"Time series regression with trend, seasonality, and diagnostics"}),e.jsx(j,{references:Y})]})}const qe=Object.freeze(Object.defineProperty({__proto__:null,default:$},Symbol.toStringTag,{value:"Module"})),Z=`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX

# ── Synthetic monthly data: trend + two harmonics ──────────────────────────
np.random.seed(42)
t = np.arange(1, 121)          # 10 years of monthly observations
m = 12                          # seasonal period

trend    = 0.05 * t
season1  = 3.0 * np.sin(2 * np.pi * t / m) + 2.0 * np.cos(2 * np.pi * t / m)
season2  = 1.0 * np.sin(4 * np.pi * t / m) + 0.5 * np.cos(4 * np.pi * t / m)
noise    = np.random.normal(0, 0.5, len(t))
y        = 20 + trend + season1 + season2 + noise

dates  = pd.date_range('2014-01', periods=120, freq='MS')
series = pd.Series(y, index=dates)

# ── Helper: build K Fourier pairs ──────────────────────────────────────────
def fourier_terms(t_arr, period, K):
    """Return DataFrame with K sin/cos pairs for the given period."""
    cols = {}
    for k in range(1, K + 1):
        cols[f'sin{k}'] = np.sin(2 * np.pi * k * t_arr / period)
        cols[f'cos{k}'] = np.cos(2 * np.pi * k * t_arr / period)
    return pd.DataFrame(cols)

# ── Model selection: compare K = 1 … 4 ───────────────────────────────────
print(f"{'K':>3}  {'AIC':>10}  {'BIC':>10}  {'params':>8}")
print("-" * 38)
best_K, best_aic = None, np.inf
for K in range(1, 5):
    Xtr = fourier_terms(t, m, K)
    Xtr['trend'] = t
    Xtr.index = dates
    fit = SARIMAX(series, exog=Xtr, order=(0, 0, 0), trend='c').fit(disp=False)
    n_params = 1 + 1 + 2 * K          # intercept + trend + fourier
    print(f"{K:>3}  {fit.aic:>10.2f}  {fit.bic:>10.2f}  {n_params:>8}")
    if fit.aic < best_aic:
        best_aic, best_K = fit.aic, K

print(f"\\nBest K by AIC: {best_K}")

# ── Fit best model and forecast 24 months ─────────────────────────────────
Xtr_best = fourier_terms(t, m, best_K)
Xtr_best['trend'] = t
Xtr_best.index = dates
model_best = SARIMAX(series, exog=Xtr_best, order=(0, 0, 0), trend='c').fit(disp=False)

h = 24
t_fc = np.arange(121, 121 + h)
Xfc  = fourier_terms(t_fc, m, best_K)
Xfc['trend'] = t_fc
Xfc.index = pd.date_range('2024-01', periods=h, freq='MS')

fc      = model_best.get_forecast(steps=h, exog=Xfc)
fc_mean = fc.predicted_mean
fc_ci   = fc.conf_int()

# ── Multiple seasonal periods (daily data: weekly + annual) ───────────────
# For illustration only – no actual fitting here
t_daily = np.arange(1, 731)     # 2 years of daily data

def multi_fourier(t_arr, periods_K):
    """periods_K: list of (period, K) tuples."""
    frames = []
    for period, K in periods_K:
        df = fourier_terms(t_arr, period, K)
        df.columns = [f'p{period}_{c}' for c in df.columns]
        frames.append(df)
    return pd.concat(frames, axis=1)

X_daily = multi_fourier(t_daily, [(7, 3), (365.25, 5)])
print(f"\\nDaily feature matrix shape: {X_daily.shape}")
print("Columns:", list(X_daily.columns)[:8], "...")

# ── statsforecast AutoARIMA with Fourier seasonality ──────────────────────
# pip install statsforecast
try:
    from statsforecast import StatsForecast
    from statsforecast.models import AutoARIMA

    df_sf = pd.DataFrame({'unique_id': 'demo', 'ds': dates, 'y': y})
    sf = StatsForecast(models=[AutoARIMA(season_length=12)], freq='MS', n_jobs=1)
    sf.fit(df_sf)
    pred = sf.predict(h=24, level=[80, 95])
    print("\\nstatsforecast forecast (head):")
    print(pred.head())
except ImportError:
    print("\\nInstall statsforecast: pip install statsforecast")
`,ee=[{title:"Forecasting: Principles and Practice (3rd ed.) — Fourier Series",author:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/useful-predictors.html#fourier-series"},{title:"Time Series Analysis: Forecasting and Control (5th ed.)",author:"Box, G.E.P., Jenkins, G.M., Reinsel, G.C. & Ljung, G.M.",year:2015,url:"https://www.wiley.com/en-us/9781118675021"},{title:"statsmodels SARIMAX Documentation",author:"Seabold, S. & Perktold, J.",year:2023,url:"https://www.statsmodels.org/stable/generated/statsmodels.tsa.statespace.sarimax.SARIMAX.html"},{title:"StatsForecast Documentation",author:"Nixtla",year:2024,url:"https://nixtlaverse.nixtla.io/statsforecast/index.html"}];function te(){const[a,o]=f.useState(2),r={1:"Captures only the fundamental frequency — a pure sinusoidal wave. Suitable for very smooth, symmetric seasonal patterns.",2:"Adds the second harmonic, allowing asymmetric or double-peaked seasonal shapes. Often optimal for monthly data.",3:"Third harmonic captures narrower peaks and troughs. Useful when seasonality has a sharp spike (e.g., holiday retail).",4:"Fine-grained seasonal control. Rarely needed for monthly data; more useful with weekly or sub-weekly periods.",5:"Very detailed seasonal representation. With m=12, approaching diminishing returns.",6:"Maximum for monthly data (m=12). Equivalent to 11 seasonal dummy variables — full seasonal flexibility."};return e.jsxs(x,{title:"Fourier Terms for Seasonality",difficulty:"intermediate",readingTime:10,children:[e.jsxs("p",{children:["Seasonal dummy variables are the classic way to model periodic patterns, but they become impractical for high-frequency data. Monthly data needs 11 dummies; weekly data needs 51; daily data with annual seasonality needs 364. ",e.jsx("strong",{children:"Fourier terms"})," offer a parsimonious alternative: they approximate any periodic shape with far fewer parameters by representing seasonality as a truncated sum of sine and cosine waves."]}),e.jsxs(y,{term:"Fourier Series for Seasonality",children:["A truncated Fourier series with ",e.jsx(t.InlineMath,{math:"K"})," terms approximates a periodic seasonal pattern with period ",e.jsx(t.InlineMath,{math:"m"})," as:",e.jsx(t.BlockMath,{math:"S_K(t) = \\sum_{k=1}^{K} \\left[ \\alpha_k \\sin\\!\\left(\\frac{2\\pi k\\, t}{m}\\right) + \\beta_k \\cos\\!\\left(\\frac{2\\pi k\\, t}{m}\\right) \\right]"}),"where ",e.jsx(t.InlineMath,{math:"k"})," indexes the harmonic number, ",e.jsx(t.InlineMath,{math:"m"})," is the seasonal period (e.g., 12 for monthly, 52 for weekly, 365.25 for daily with annual seasonality), and ",e.jsx(t.InlineMath,{math:"\\alpha_k, \\beta_k"})," are regression coefficients estimated from data."]}),e.jsx("p",{children:"Embedding this in a regression with a linear trend gives the standard Fourier regression model:"}),e.jsx(t.BlockMath,{math:"y_t = \\beta_0 + \\beta_1\\, t + \\sum_{k=1}^{K} \\left[ \\alpha_k \\sin\\!\\left(\\frac{2\\pi k\\, t}{m}\\right) + \\beta_k \\cos\\!\\left(\\frac{2\\pi k\\, t}{m}\\right) \\right] + \\varepsilon_t"}),e.jsxs("p",{children:["This model has only ",e.jsx(t.InlineMath,{math:"2 + 2K"})," parameters regardless of"," ",e.jsx(t.InlineMath,{math:"m"}),", making it highly efficient for long or non-integer seasonal periods."]}),e.jsx("h2",{children:"Advantages Over Seasonal Dummies"}),e.jsx("p",{children:"The table below compares the number of parameters required to represent full seasonality using dummies versus Fourier terms at various common periods:"}),e.jsx("div",{style:{overflowX:"auto",margin:"1rem 0"},children:e.jsxs("table",{style:{borderCollapse:"collapse",width:"100%",fontSize:"0.9rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"#f1f5f9"},children:[e.jsx("th",{style:{padding:"8px 12px",textAlign:"left",border:"1px solid #e2e8f0"},children:"Data frequency"}),e.jsx("th",{style:{padding:"8px 12px",textAlign:"right",border:"1px solid #e2e8f0"},children:"Period m"}),e.jsx("th",{style:{padding:"8px 12px",textAlign:"right",border:"1px solid #e2e8f0"},children:"Seasonal dummies"}),e.jsx("th",{style:{padding:"8px 12px",textAlign:"right",border:"1px solid #e2e8f0"},children:"Fourier K=3"}),e.jsx("th",{style:{padding:"8px 12px",textAlign:"right",border:"1px solid #e2e8f0"},children:"Fourier K=5"})]})}),e.jsx("tbody",{children:[["Monthly",12,11,6,10],["Weekly",52,51,6,10],["Daily (weekly)",7,6,6,"—"],["Daily (annual)",365,364,6,10],["Hourly (daily)",24,23,6,10]].map(([s,i,n,l,m],p)=>e.jsxs("tr",{style:{background:p%2===0?"white":"#f8fafc"},children:[e.jsx("td",{style:{padding:"8px 12px",border:"1px solid #e2e8f0"},children:s}),e.jsx("td",{style:{padding:"8px 12px",textAlign:"right",border:"1px solid #e2e8f0"},children:i}),e.jsx("td",{style:{padding:"8px 12px",textAlign:"right",border:"1px solid #e2e8f0"},children:n}),e.jsx("td",{style:{padding:"8px 12px",textAlign:"right",border:"1px solid #e2e8f0",color:"#16a34a",fontWeight:"bold"},children:l}),e.jsx("td",{style:{padding:"8px 12px",textAlign:"right",border:"1px solid #e2e8f0",color:"#16a34a",fontWeight:"bold"},children:m})]},p))})]})}),e.jsx("h2",{children:"Choosing K: The Key Tuning Parameter"}),e.jsxs("p",{children:["Selecting ",e.jsx(t.InlineMath,{math:"K"})," balances bias (too few terms under-fit) against variance (too many terms overfit). The standard approach is to compare models across"," ",e.jsx(t.InlineMath,{math:"K = 1, 2, \\ldots, \\lfloor m/2 \\rfloor"})," using information criteria."]}),e.jsxs(I,{title:"Maximum K Constraint",proof:"The discrete Fourier transform of a sequence of length m has exactly floor(m/2) distinct positive frequencies. Adding Fourier pairs beyond K = floor(m/2) introduces exact linear dependencies among the regressors, making the design matrix rank-deficient.",children:["The maximum useful value is ",e.jsx(t.InlineMath,{math:"K_{\\max} = \\lfloor m/2 \\rfloor"}),". At this maximum, the Fourier terms span the same column space as a full set of"," ",e.jsx(t.InlineMath,{math:"m - 1"})," seasonal dummy variables, so nothing is gained beyond",e.jsx(t.InlineMath,{math:"K_{\\max}"}),"."]}),e.jsxs("div",{style:{margin:"1.5rem 0",padding:"1.25rem",background:"#f0f9ff",borderRadius:"8px",border:"1px solid #bae6fd"},children:[e.jsx("strong",{style:{display:"block",marginBottom:"0.75rem"},children:"Interactive: Explore K values"}),e.jsx("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.75rem"},children:[1,2,3,4,5,6].map(s=>e.jsxs("button",{onClick:()=>o(s),style:{padding:"0.3rem 0.9rem",background:a===s?"#0ea5e9":"#e0f2fe",color:a===s?"white":"#0369a1",border:`1px solid ${a===s?"#0284c7":"#7dd3fc"}`,borderRadius:"6px",cursor:"pointer",fontWeight:a===s?"bold":"normal"},children:["K=",s]},s))}),e.jsxs("div",{style:{fontSize:"0.9rem",color:"#1e40af"},children:[e.jsxs("strong",{children:["K=",a]})," uses ",e.jsxs("strong",{children:[2*a," seasonal parameters"]})," ","(vs. 11 for monthly seasonal dummies).",e.jsx("br",{}),r[a]]})]}),e.jsx(u,{title:"Model Selection Criteria",children:e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"AIC / AICc:"})," Preferred for forecasting. AICc adds a small-sample correction",e.jsx(t.InlineMath,{math:"\\text{AICc} = \\text{AIC} + \\frac{2k(k+1)}{n-k-1}"})," and is recommended when",e.jsx(t.InlineMath,{math:"n/k < 40"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"BIC:"})," Penalises complexity more strongly; produces more parsimonious models. Best when the true model is in the candidate set."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Time-series cross-validation:"})," Most reliable, but computationally expensive for large grids of K."]})]})}),e.jsx("h2",{children:"Multiple Seasonal Periods"}),e.jsxs("p",{children:["A decisive advantage of Fourier terms over dummies is that multiple periodic patterns can be modelled simultaneously by simply concatenating Fourier pairs for each period. For daily electricity consumption with both weekly (",e.jsx(t.InlineMath,{math:"m_1 = 7"}),") and annual (",e.jsx(t.InlineMath,{math:"m_2 = 365.25"}),") seasonality:"]}),e.jsx(t.BlockMath,{math:"y_t = \\beta_0 + \\beta_1 t + \\sum_{k=1}^{K_1}\\!\\left[\\alpha_k^{(7)}\\sin\\!\\tfrac{2\\pi k t}{7} + \\beta_k^{(7)}\\cos\\!\\tfrac{2\\pi k t}{7}\\right] + \\sum_{k=1}^{K_2}\\!\\left[\\alpha_k^{(365)}\\sin\\!\\tfrac{2\\pi k t}{365} + \\beta_k^{(365)}\\cos\\!\\tfrac{2\\pi k t}{365}\\right] + \\varepsilon_t"}),e.jsxs("p",{children:["With ",e.jsx(t.InlineMath,{math:"K_1 = 3"})," and ",e.jsx(t.InlineMath,{math:"K_2 = 5"}),", this captures both patterns using only ",e.jsx("strong",{children:"16 seasonal parameters"}),", far fewer than the"," ",e.jsx(t.InlineMath,{math:"6 + 364 = 370"})," needed by seasonal dummies."]}),e.jsxs(u,{title:"Non-Integer Periods",children:["The average Gregorian year is 365.25 days, making the annual period non-integer for daily data. Seasonal dummy variables cannot represent this. Fourier terms handle non-integer"," ",e.jsx(t.InlineMath,{math:"m"})," naturally because ",e.jsx(t.InlineMath,{math:"\\sin(2\\pi k t / 365.25)"})," ","is perfectly well-defined for any real ",e.jsx(t.InlineMath,{math:"m"}),"."]}),e.jsxs(b,{title:"Monthly Retail Sales: Selecting K",children:["Suppose we have 120 months of retail sales. We fit Fourier regression models with K=1 to K=6 and record AIC values (hypothetical):",e.jsx("br",{}),e.jsx("br",{}),"K=1: AIC=412.3, K=2: AIC=378.1, K=3: AIC=376.4, K=4: AIC=378.0, K=5: AIC=379.8, K=6: AIC=381.2.",e.jsx("br",{}),e.jsx("br",{}),"Minimum AIC is at K=3 (376.4), but K=2 is only 1.7 units worse. Following the rule of choosing the model within 2 AIC units of the minimum with fewest parameters, we select K=2. This captures the main annual cycle (K=1) plus a secondary harmonic that allows for asymmetry between the rise into the Christmas peak and the post-holiday dip."]}),e.jsx("h2",{children:"Combining Fourier Terms with ARIMA Errors"}),e.jsx("p",{children:"Plain OLS Fourier regression assumes uncorrelated errors. In practice, time series residuals are autocorrelated after removing trend and seasonality. The solution is to let the errors follow an ARIMA process:"}),e.jsx(t.BlockMath,{math:"y_t = \\mathbf{x}_t'\\boldsymbol{\\gamma} + \\eta_t, \\qquad \\phi(B)(1-B)^d \\eta_t = \\theta(B)\\varepsilon_t"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\mathbf{x}_t"})," contains the Fourier terms and any other regressors. This is called ",e.jsx("strong",{children:"dynamic harmonic regression"})," and is covered in the next section."]}),e.jsxs(g,{title:"Spurious Regression with Non-Stationary Series",children:["If ",e.jsx(t.InlineMath,{math:"y_t"})," has a unit root, OLS on Fourier regressors alone can produce spuriously significant coefficients. Always test for stationarity first (ADF or KPSS test). If the series is I(1), either difference it before adding Fourier regressors or use regression with ARIMA(p,1,q) errors."]}),e.jsx("h2",{children:"Fourier Terms in Machine Learning Models"}),e.jsx("p",{children:"Fourier features are not limited to linear models. They are powerful inputs for gradient boosted trees (LightGBM, XGBoost) and neural networks, because these models cannot extrapolate sinusoidal patterns from categorical time features alone. Adding Fourier columns to the feature matrix gives the model an explicit periodic signal."}),e.jsx(_,{code:Z,title:"Fourier Terms: statsmodels SARIMAX + statsforecast"}),e.jsx("h2",{children:"Summary"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Fourier terms represent seasonality as a sum of ",e.jsx(t.InlineMath,{math:"K"})," sine/cosine pairs, using only ",e.jsx(t.InlineMath,{math:"2K"})," parameters regardless of the period length."]}),e.jsx("li",{children:"They outperform seasonal dummies for long periods (weekly, daily, sub-daily) and non-integer periods such as 365.25."}),e.jsx("li",{children:"Multiple seasonal periods are handled by concatenating separate Fourier pairs for each period."}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"K"})," is selected by AIC/BIC; the maximum is"," ",e.jsx(t.InlineMath,{math:"\\lfloor m/2 \\rfloor"}),"."]}),e.jsx("li",{children:"Pair with ARIMA errors (dynamic harmonic regression) to handle residual autocorrelation."})]}),e.jsx(j,{references:ee})]})}const Pe=Object.freeze(Object.defineProperty({__proto__:null,default:te},Symbol.toStringTag,{value:"Module"})),ae=`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX
import itertools
import warnings
warnings.filterwarnings('ignore')

# ── Synthetic weekly data: trend + annual Fourier + AR(2) errors ───────────
np.random.seed(0)
n = 260         # 5 years of weekly data
m = 52          # annual period in weeks
t = np.arange(1, n + 1)

# Build true signal
trend  = 0.03 * t
f1     = 4.0 * np.sin(2 * np.pi * t / m) + 3.0 * np.cos(2 * np.pi * t / m)
f2     = 1.5 * np.sin(4 * np.pi * t / m) + 0.8 * np.cos(4 * np.pi * t / m)

# AR(2) errors
errors = np.zeros(n)
eps    = np.random.normal(0, 1, n)
for i in range(2, n):
    errors[i] = 0.6 * errors[i-1] - 0.2 * errors[i-2] + eps[i]

y = 50 + trend + f1 + f2 + errors

dates  = pd.date_range('2019-01-07', periods=n, freq='W-MON')
series = pd.Series(y, index=dates)
train  = series[:-26]   # hold out last 6 months
test   = series[-26:]

# ── Fourier feature builder ────────────────────────────────────────────────
def fourier_terms(t_arr, period, K):
    cols = {}
    for k in range(1, K + 1):
        cols[f's{k}'] = np.sin(2 * np.pi * k * t_arr / period)
        cols[f'c{k}'] = np.cos(2 * np.pi * k * t_arr / period)
    return pd.DataFrame(cols)

# ── Grid search over K and ARIMA order ────────────────────────────────────
# We fix d=0 (series is stationary after removing trend via regressor)
# and search p in {0,1,2}, q in {0,1,2}, K in {1,2,3,4}
results = []
t_train = t[:len(train)]

for K in range(1, 5):
    for p, q in itertools.product(range(3), range(3)):
        try:
            X = fourier_terms(t_train, m, K)
            X['trend'] = t_train
            X.index = train.index
            fit = SARIMAX(train, exog=X, order=(p, 0, q), trend='c').fit(disp=False)
            results.append({'K': K, 'p': p, 'q': q,
                            'AIC': fit.aic, 'BIC': fit.bic})
        except Exception:
            pass

results_df = pd.DataFrame(results).sort_values('AIC')
print("Top 5 models by AIC:")
print(results_df.head())

# ── Best model fit and forecast ────────────────────────────────────────────
best = results_df.iloc[0]
K_best, p_best, q_best = int(best.K), int(best.p), int(best.q)
print(f"\\nBest: K={K_best}, ARIMA({p_best},0,{q_best})")

X_train = fourier_terms(t_train, m, K_best)
X_train['trend'] = t_train
X_train.index = train.index

final_fit = SARIMAX(train, exog=X_train, order=(p_best, 0, q_best),
                    trend='c').fit(disp=False)
print(final_fit.summary())

# Forecast
h = len(test)
t_fc = t[len(train):]
X_fc = fourier_terms(t_fc, m, K_best)
X_fc['trend'] = t_fc
X_fc.index = test.index

fc     = final_fit.get_forecast(steps=h, exog=X_fc)
fc_mu  = fc.predicted_mean
fc_ci  = fc.conf_int()

# Evaluation
mae  = np.abs(test.values - fc_mu.values).mean()
rmse = np.sqrt(((test.values - fc_mu.values)**2).mean())
print(f"\\n26-week forecast  MAE={mae:.2f}  RMSE={rmse:.2f}")

# ── Comparison: DHR vs SARIMA ──────────────────────────────────────────────
# SARIMA(1,0,1)(1,1,0)[52] — naive seasonal benchmark
try:
    sarima = SARIMAX(train, order=(1,0,1),
                     seasonal_order=(1,1,0,52)).fit(disp=False)
    sarima_fc = sarima.get_forecast(steps=h).predicted_mean
    sarima_mae = np.abs(test.values - sarima_fc.values).mean()
    print(f"SARIMA benchmark  MAE={sarima_mae:.2f}")
    print(f"DHR improvement:  {(sarima_mae - mae)/sarima_mae*100:.1f}%")
except Exception as e:
    print(f"SARIMA fit failed: {e}")

# ── Plot ───────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(13, 5))
ax.plot(train[-52:], label='Training (last year)')
ax.plot(test, label='Actual', color='black')
ax.plot(fc_mu, label=f'DHR K={K_best} ARIMA({p_best},0,{q_best})', color='red')
ax.fill_between(fc_ci.index, fc_ci.iloc[:, 0], fc_ci.iloc[:, 1],
                alpha=0.2, color='red', label='95% CI')
ax.set_title('Dynamic Harmonic Regression — 26-week forecast')
ax.legend()
plt.tight_layout()
plt.show()
`,se=[{title:"Forecasting: Principles and Practice (3rd ed.) — Dynamic Harmonic Regression",author:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/dynamic-harmonic-regression.html"},{title:"Regression with ARIMA errors in Python",author:"statsmodels contributors",year:2023,url:"https://www.statsmodels.org/stable/examples/notebooks/generated/statespace_sarimax_stata.html"},{title:"Time Series Analysis (2nd ed.)",author:"Hamilton, J.D.",year:1994,url:"https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis"},{title:"pmdarima: ARIMA estimators for Python",author:"Smith, T.G.",year:2023,url:"https://alkaline-ml.com/pmdarima/"}];function ie(){const[a,o]=f.useState(!1);return e.jsxs(x,{title:"Dynamic Harmonic Regression",difficulty:"intermediate",readingTime:10,children:[e.jsxs("p",{children:["The previous section showed how Fourier terms efficiently capture seasonal patterns. In practice, however, the residuals from a Fourier regression are almost always autocorrelated — price series have momentum, demand series have carry-over effects, and so on."," ",e.jsx("strong",{children:"Dynamic harmonic regression (DHR)"})," solves this by combining Fourier terms with an ARIMA error model, getting the best of both worlds: flexible seasonality and proper handling of short-run dynamics."]}),e.jsxs(y,{term:"Dynamic Harmonic Regression",children:["A dynamic harmonic regression model combines a linear regression on Fourier terms (and other regressors) with ARIMA errors:",e.jsx(t.BlockMath,{math:"y_t = \\beta_0 + \\beta_1 t + \\sum_{k=1}^{K}\\!\\left[\\alpha_k \\sin\\tfrac{2\\pi k t}{m} + \\gamma_k \\cos\\tfrac{2\\pi k t}{m}\\right] + \\mathbf{z}_t'\\boldsymbol{\\delta} + \\eta_t"}),"where ",e.jsx(t.InlineMath,{math:"\\mathbf{z}_t"})," contains any additional regressors (promotions, holidays, etc.) and the error term ",e.jsx(t.InlineMath,{math:"\\eta_t"})," follows an ARIMA process:",e.jsx(t.BlockMath,{math:"\\phi(B)(1 - B)^d\\,\\eta_t = \\theta(B)\\,\\varepsilon_t, \\quad \\varepsilon_t \\sim \\text{WN}(0, \\sigma^2)"})]}),e.jsx("h2",{children:"Why Not Use SARIMA Instead?"}),e.jsx("p",{children:"A natural question: why use DHR when SARIMA already handles seasonality through seasonal differencing and seasonal AR/MA terms? There are several important reasons:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Long seasonal periods:"})," SARIMA requires estimating"," ",e.jsx(t.InlineMath,{math:"m"})," parameters per seasonal AR/MA order. For weekly data (m=52) that quickly becomes intractable."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Non-integer periods:"})," SARIMA demands integer ",e.jsx(t.InlineMath,{math:"m"}),", but Fourier terms work with ",e.jsx(t.InlineMath,{math:"m = 365.25"})," or any real value."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Multiple seasonalities:"})," SARIMA handles only one seasonal period; DHR easily incorporates multiple Fourier period pairs."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Additional regressors:"})," External variables (price, weather) plug naturally into the regression component of DHR."]})]}),e.jsx(u,{title:"DHR vs SARIMAX",children:"When the seasonal period is short and integer (e.g., monthly data, m=12), SARIMAX and DHR perform comparably and SARIMAX is often simpler to specify. DHR's advantages become decisive for weekly, daily, or sub-daily data."}),e.jsx("h2",{children:"Model Specification and Order Selection"}),e.jsxs("p",{children:["A DHR model is characterised by three sets of choices: the number of Fourier pairs"," ",e.jsx(t.InlineMath,{math:"K"}),", the ARIMA order ",e.jsx(t.InlineMath,{math:"(p, d, q)"})," for the errors, and whether to include seasonal ARIMA terms. The standard workflow is:"]}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Determine integration order ",e.jsx(t.InlineMath,{math:"d"})," for the series (ADF / KPSS test). Apply differencing if needed before fitting, or use ",e.jsx(t.InlineMath,{math:"d \\geq 1"})," in the ARIMA error component."]}),e.jsxs("li",{children:["Fit DHR models for ",e.jsx(t.InlineMath,{math:"K = 1, 2, \\ldots, K_{\\max}"})," with various",e.jsx(t.InlineMath,{math:"(p, q)"})," combinations and compare by AIC or AICc."]}),e.jsx("li",{children:"Check residuals of the selected model: the ACF/PACF of residuals should show no remaining autocorrelation."})]}),e.jsxs(I,{title:"Equivalence at Full K",proof:"When K = floor(m/2), the Fourier columns span the same column space as m-1 seasonal dummy variables. The ARIMA error component then handles everything not captured by trend + full-seasonal-dummies, which is the same residual as in a regression with seasonal dummies plus ARIMA errors.",children:["When ",e.jsx(t.InlineMath,{math:"K = \\lfloor m/2 \\rfloor"}),", the DHR model is algebraically equivalent to a regression-with-ARIMA-errors model using seasonal dummy variables. DHR is strictly more general because it allows intermediate ",e.jsx(t.InlineMath,{math:"K < \\lfloor m/2 \\rfloor"}),"."]}),e.jsx("h2",{children:"ARIMAX with Seasonal Harmonics"}),e.jsxs("p",{children:["In statsmodels, DHR is implemented via the ",e.jsx("code",{children:"SARIMAX"})," class with Fourier columns passed as ",e.jsx("code",{children:"exog"}),". This is sometimes called ",e.jsx("em",{children:"ARIMAX with seasonal harmonics"}),". The model is estimated by maximum likelihood using the Kalman filter, which handles the ARIMA structure on the error process efficiently."]}),e.jsxs("p",{children:["The likelihood of the SARIMAX model for observation ",e.jsx(t.InlineMath,{math:"t"})," is:"]}),e.jsx(t.BlockMath,{math:"\\ell(\\boldsymbol{\\theta}) = -\\frac{n}{2}\\log(2\\pi) - \\frac{1}{2}\\sum_{t=1}^{n}\\left[\\log F_t + \\frac{v_t^2}{F_t}\\right]"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"v_t"})," is the one-step-ahead prediction error and"," ",e.jsx(t.InlineMath,{math:"F_t"})," its variance, both computed by the Kalman filter."]}),e.jsx("h2",{children:"Forecasting with DHR"}),e.jsxs("p",{children:["Point forecasts ",e.jsx(t.InlineMath,{math:"h"})," steps ahead are obtained by:"]}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Computing the deterministic component: evaluate the Fourier terms at future time indices",e.jsx(t.InlineMath,{math:"t + 1, \\ldots, t + h"}),"."]}),e.jsx("li",{children:"Forecasting the ARIMA error component forward (converges to zero for stationary errors)."})]}),e.jsxs("p",{children:["Forecast intervals account for both the ARIMA error uncertainty and the coefficient estimation uncertainty (if the ",e.jsx("code",{children:"cov_type"})," argument is set appropriately)."]}),e.jsxs(g,{title:"Future Exogenous Variables Required",children:["Because Fourier terms are computed from the future time index, they are always available without additional forecasting. However, any other exogenous variable in"," ",e.jsx(t.InlineMath,{math:"\\mathbf{z}_t"})," (e.g., price, temperature) must be either known in advance or separately forecast before calling ",e.jsx("code",{children:"get_forecast()"}),". Failure to provide future exog values will raise an error or silently use zeros."]}),e.jsxs(b,{title:"Weekly Electricity Consumption (5 years, m=52)",children:["Consider weekly electricity demand for a utility company. SARIMA(1,0,1)(1,1,0)[52] is impractical due to the long seasonal period. Instead, we fit DHR models:",e.jsx("br",{}),e.jsx("br",{}),"With K=3 Fourier pairs (annual seasonality) and ARIMA(2,0,1) errors, the model uses only 9 seasonal parameters and 4 ARMA parameters. Grid search across K=1..4 and (p,q)=(0..2, 0..2) identifies K=2, ARIMA(2,0,1) as the best by AIC. The 26-week out-of-sample MAE is 2.3 GWh, compared to 3.1 GWh for naive seasonal SARIMA — a 26% improvement."]}),e.jsx("h2",{children:"Multiple Seasonal Periods in DHR"}),e.jsx("p",{children:"Daily data often exhibits both intra-week (m=7) and intra-year (m=365.25) seasonality. DHR handles this elegantly:"}),e.jsx(t.BlockMath,{math:"y_t = \\beta_0 + \\beta_1 t + \\underbrace{\\sum_{k=1}^{K_1}\\!\\left[\\alpha_k^{(7)}\\sin\\tfrac{2\\pi k t}{7} + \\gamma_k^{(7)}\\cos\\tfrac{2\\pi k t}{7}\\right]}_{\\text{weekly}} + \\underbrace{\\sum_{k=1}^{K_2}\\!\\left[\\alpha_k^{(365)}\\sin\\tfrac{2\\pi k t}{365} + \\gamma_k^{(365)}\\cos\\tfrac{2\\pi k t}{365}\\right]}_{\\text{annual}} + \\eta_t"}),e.jsx("p",{children:"The ARIMA errors then capture short-run autocorrelation not explained by either seasonal component."}),e.jsxs("div",{style:{margin:"1rem 0",padding:"1rem",background:"#fef9c3",borderRadius:"8px",border:"1px solid #fde047"},children:[e.jsx("strong",{children:"Practical Tip: pmdarima auto_arima"}),e.jsxs("p",{style:{marginTop:"0.5rem",fontSize:"0.9rem"},children:["The ",e.jsx("code",{children:"pmdarima"})," library's ",e.jsx("code",{children:"auto_arima()"})," function can automatically search the ARIMA order space when Fourier terms are passed as exogenous predictors. Use"," ",e.jsx("code",{children:"seasonal=False"})," (since seasonality is handled by Fourier terms) and set a reasonable ",e.jsx("code",{children:"max_p"})," / ",e.jsx("code",{children:"max_q"})," to control search time."]}),e.jsx("pre",{style:{background:"#fff",padding:"0.75rem",borderRadius:"4px",fontSize:"0.85rem",marginTop:"0.5rem"},children:`import pmdarima as pm
model = pm.auto_arima(train, exogenous=X_train,
                      seasonal=False, d=0,
                      max_p=3, max_q=3,
                      information_criterion='aic',
                      stepwise=True, trace=True)`})]}),e.jsx("h2",{children:"Residual Diagnostics"}),e.jsxs("p",{children:["After fitting, the residuals ",e.jsx(t.InlineMath,{math:"\\hat{\\varepsilon}_t"})," should pass:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Ljung-Box test:"})," No significant autocorrelation at lags 1–20."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ACF/PACF plots:"})," No significant spikes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Normality:"})," QQ-plot and Jarque-Bera test (important for valid prediction intervals)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Heteroskedasticity:"})," Plot residuals vs. fitted; look for funnelling. Consider log transformation if present."]})]}),e.jsx(_,{code:ae,title:"Dynamic Harmonic Regression: Grid Search and Forecast"}),e.jsx("h2",{children:"Summary"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Dynamic harmonic regression combines Fourier terms (for flexible seasonality) with ARIMA errors (for short-run dynamics), providing a unified model for complex seasonal time series."}),e.jsx("li",{children:"It is superior to SARIMA for long seasonal periods (m > 24), non-integer periods, and multiple seasonal patterns."}),e.jsxs("li",{children:["Model selection requires a joint grid search over ",e.jsx(t.InlineMath,{math:"K"})," and the ARIMA order ",e.jsx(t.InlineMath,{math:"(p, d, q)"}),", guided by AIC or AICc."]}),e.jsx("li",{children:"Forecasting is straightforward because Fourier terms for future periods are always computable from the time index alone."}),e.jsx("li",{children:"Residual diagnostics must confirm both the absence of autocorrelation and approximate normality for valid prediction intervals."})]}),e.jsx(j,{references:se})]})}const Ce=Object.freeze(Object.defineProperty({__proto__:null,default:ie},Symbol.toStringTag,{value:"Module"})),re=`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.stats.stattools import durbin_watson
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n = 200

# ── Simulate ARIMAX(1,1,1) with one exogenous variable ────────────────────
# x_t: advertising spend (unit-root process)
x = np.cumsum(np.random.normal(0, 1, n)) + 50

# Errors: ARMA(1,1)
eps   = np.random.normal(0, 1, n)
eta   = np.zeros(n)
for t in range(1, n):
    eta[t] = 0.5 * eta[t-1] + eps[t] - 0.3 * eps[t-1]

# y_t has a unit root: dy_t = 0.4*dx_t + ARMA(1,1) errors
dy = 0.4 * np.diff(x) + np.diff(eta)     # length n-1
y  = np.r_[10.0, 10.0 + np.cumsum(dy)]   # reconstruct levels

dates  = pd.date_range('2006-01', periods=n, freq='MS')
df     = pd.DataFrame({'y': y, 'x': x}, index=dates)
train  = df.iloc[:-24]
test   = df.iloc[-24:]

# ── Fit ARIMAX(1,1,1) with x as exogenous ─────────────────────────────────
model = SARIMAX(
    train['y'],
    exog=train[['x']],
    order=(1, 1, 1),
    trend='n'          # no intercept after differencing
)
fit = model.fit(disp=False)
print(fit.summary())
print(f"\\nDurbin-Watson: {durbin_watson(fit.resid):.3f}")

# ── Forecast 24 months (x assumed known in test set) ──────────────────────
fc     = fit.get_forecast(steps=24, exog=test[['x']])
fc_mu  = fc.predicted_mean
fc_ci  = fc.conf_int()

mae  = np.abs(test['y'] - fc_mu).mean()
rmse = np.sqrt(((test['y'] - fc_mu)**2).mean())
print(f"Test MAE={mae:.3f}  RMSE={rmse:.3f}")

# ── Intervention analysis ──────────────────────────────────────────────────
# Simulate level shift at period 100 and a transient outlier at period 150
y2 = y.copy()
y2[100:] += 8.0           # permanent level shift (step intervention)
y2[150]  += 15.0          # additive outlier (one-off spike)

# Intervention dummies
level_shift = np.zeros(n)
level_shift[100:] = 1.0   # step function

additive_outlier = np.zeros(n)
additive_outlier[150] = 1.0

# Pulse function (temporary step that decays via AR)
pulse = np.zeros(n)
pulse[100] = 1.0  # unit pulse — combined with AR captures ramp-up

X_int = pd.DataFrame({
    'x': x,
    'level_shift': level_shift,
    'outlier_150': additive_outlier
}, index=dates)

model_int = SARIMAX(
    y2,
    exog=X_int,
    order=(1, 1, 1),
    trend='n'
)
fit_int = model_int.fit(disp=False)
print("\\n--- Intervention model ---")
print(fit_int.summary().tables[1])

# ── Transfer function model (distributed-lag interpretation) ──────────────
# Allow x to enter with up to 2 lags by including x_t, x_{t-1}, x_{t-2}
X_tf = pd.DataFrame({
    'x_lag0': x,
    'x_lag1': np.r_[np.nan, x[:-1]],
    'x_lag2': np.r_[np.nan, np.nan, x[:-2]]
}, index=dates).dropna()

y_tf     = pd.Series(y, index=dates).loc[X_tf.index]
model_tf = SARIMAX(y_tf, exog=X_tf, order=(1, 1, 0), trend='n')
fit_tf   = model_tf.fit(disp=False)
print("\\n--- Transfer function (finite lag) ---")
print(fit_tf.summary().tables[1])

# Total effect (long-run multiplier for distributed lag)
b0, b1, b2 = [fit_tf.params[c] for c in ['x_lag0', 'x_lag1', 'x_lag2']]
total_effect = b0 + b1 + b2
print(f"\\nLong-run multiplier: {total_effect:.4f}")
print(f"Immediate effect:     {b0:.4f}")

# ── Plot results ───────────────────────────────────────────────────────────
fig, axes = plt.subplots(2, 1, figsize=(12, 8))
axes[0].plot(train['y'], label='Train')
axes[0].plot(test['y'], label='Actual test', color='black')
axes[0].plot(fc_mu, label='ARIMAX forecast', color='red')
axes[0].fill_between(fc_ci.index, fc_ci.iloc[:,0], fc_ci.iloc[:,1],
                     alpha=0.2, color='red')
axes[0].set_title('ARIMAX(1,1,1) Forecast')
axes[0].legend()

axes[1].plot(dates, y2, label='Observed (with interventions)')
axes[1].axvline(dates[100], color='orange', linestyle='--', label='Level shift')
axes[1].axvline(dates[150], color='purple', linestyle='--', label='Outlier')
axes[1].set_title('Intervention Analysis')
axes[1].legend()
plt.tight_layout()
plt.show()
`,ne=[{title:"Forecasting: Principles and Practice (3rd ed.) — Regression with ARIMA errors",author:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/regarima.html"},{title:"Time Series Analysis (2nd ed.)",author:"Hamilton, J.D.",year:1994,url:"https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis"},{title:"Transfer Function Models and Cross-Correlation Analysis",author:"Box, G.E.P. & Jenkins, G.M.",year:2015,url:"https://www.wiley.com/en-us/9781118675021"},{title:"statsmodels SARIMAX",author:"statsmodels contributors",year:2023,url:"https://www.statsmodels.org/stable/generated/statsmodels.tsa.statespace.sarimax.SARIMAX.html"}];function oe(){const[a,o]=f.useState("arimax");return e.jsxs(x,{title:"ARIMAX and Transfer Functions",difficulty:"advanced",readingTime:14,children:[e.jsxs("p",{children:["ARIMA models capture the internal dynamics of a single time series but cannot exploit information from related series or known external drivers. ",e.jsx("strong",{children:"ARIMAX"})," extends ARIMA by including exogenous input variables, making it one of the most practical tools in applied forecasting. ",e.jsx("strong",{children:"Transfer function models"})," further generalise this by allowing the exogenous input to enter with a rich lag structure and its own filter."]}),e.jsxs(y,{term:"ARIMAX Model",children:["An ARIMAX(",e.jsx(t.InlineMath,{math:"p,d,q"}),") model regresses the (possibly differenced) series on exogenous variables and ARMA errors:",e.jsx(t.BlockMath,{math:"\\phi(B)(1-B)^d y_t = \\sum_{j=1}^{k} \\delta_j x_{j,t} + \\theta(B)\\varepsilon_t"}),"where ",e.jsx(t.InlineMath,{math:"\\phi(B) = 1 - \\phi_1 B - \\cdots - \\phi_p B^p"})," is the AR polynomial, ",e.jsx(t.InlineMath,{math:"\\theta(B) = 1 + \\theta_1 B + \\cdots + \\theta_q B^q"})," is the MA polynomial, ",e.jsx(t.InlineMath,{math:"x_{j,t}"})," are exogenous predictors, and"," ",e.jsx(t.InlineMath,{math:"\\varepsilon_t \\sim \\text{WN}(0,\\sigma^2)"}),"."]}),e.jsxs(g,{title:"ARIMAX vs Regression with ARIMA Errors",children:["There are two distinct interpretations:",e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"True ARIMAX:"})," the AR polynomial ",e.jsx(t.InlineMath,{math:"\\phi(B)"})," is applied to ",e.jsx("em",{children:"both"})," ",e.jsx(t.InlineMath,{math:"y_t"})," and ",e.jsx(t.InlineMath,{math:"x_{j,t}"}),". This means the model equation above filters the exogenous variables through the same AR operator."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Regression with ARIMA errors:"})," ",e.jsx(t.InlineMath,{math:"y_t = \\boldsymbol{x}_t'\\boldsymbol{\\beta} + \\eta_t"})," where only the error ",e.jsx(t.InlineMath,{math:"\\eta_t"})," follows ARIMA. The exogenous variables are unfiltered."]})]}),"statsmodels ",e.jsx("code",{children:"SARIMAX"})," implements ",e.jsx("em",{children:"regression with ARIMA errors"})," (the second form), which is the standard interpretation in modern forecasting practice."]}),e.jsx("h2",{children:"Transfer Function Models"}),e.jsxs("p",{children:["A transfer function model (also called a dynamic regression or distributed-lag ARIMA model) allows the exogenous input ",e.jsx(t.InlineMath,{math:"x_t"})," to affect"," ",e.jsx(t.InlineMath,{math:"y_t"})," through a rational transfer function — an infinite distributed lag parameterised parsimoniously:"]}),e.jsx(t.BlockMath,{math:"y_t = \\frac{\\omega(B)}{\\delta(B)} x_{t-b} + \\frac{\\theta(B)}{\\phi(B)}\\varepsilon_t"}),e.jsx("p",{children:"where:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"b \\geq 0"})," is the ",e.jsx("strong",{children:"pure delay"})," (number of periods before ",e.jsx(t.InlineMath,{math:"x_t"})," first affects ",e.jsx(t.InlineMath,{math:"y_t"}),")"]}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"\\omega(B) = \\omega_0 - \\omega_1 B - \\cdots - \\omega_s B^s"})," is the",e.jsx("strong",{children:"numerator polynomial"})," (immediate impact shape)"]}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"\\delta(B) = 1 - \\delta_1 B - \\cdots - \\delta_r B^r"})," is the",e.jsx("strong",{children:"denominator polynomial"})," (generates geometric decay in the lag weights)"]})]}),e.jsxs(u,{title:"Impulse Response Function",children:["The sequence of coefficients on ",e.jsx(t.InlineMath,{math:"x_{t}, x_{t-1}, x_{t-2}, \\ldots"})," is called the ",e.jsx("strong",{children:"impulse response function"})," or transfer function weights"," ",e.jsx(t.InlineMath,{math:"\\nu_j"}),". For a stable transfer function:",e.jsx(t.BlockMath,{math:"\\nu(B) = \\frac{\\omega(B)}{\\delta(B)} = \\sum_{j=b}^{\\infty} \\nu_j B^j"}),"A first-order denominator ",e.jsx(t.InlineMath,{math:"\\delta(B) = 1 - \\delta_1 B"})," generates geometric decay: ",e.jsx(t.InlineMath,{math:"\\nu_j = \\omega_0 \\delta_1^{j-b}"}),"."]}),e.jsxs("div",{style:{margin:"1.5rem 0"},children:[e.jsx("div",{style:{display:"flex",gap:"0.5rem",marginBottom:"1rem",borderBottom:"2px solid #e2e8f0"},children:["arimax","transfer","intervention"].map(r=>e.jsx("button",{onClick:()=>o(r),style:{padding:"0.5rem 1.25rem",background:a===r?"#3b82f6":"transparent",color:a===r?"white":"#374151",border:"none",borderBottom:a===r?"2px solid #3b82f6":"none",cursor:"pointer",fontWeight:a===r?"bold":"normal",borderRadius:"4px 4px 0 0"},children:r==="arimax"?"ARIMAX":r==="transfer"?"Transfer Functions":"Interventions"},r))}),a==="arimax"&&e.jsxs("div",{children:[e.jsx("p",{children:e.jsx("strong",{children:"Standard ARIMAX workflow:"})}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Test ",e.jsx(t.InlineMath,{math:"y_t"})," and each ",e.jsx(t.InlineMath,{math:"x_{j,t}"})," for unit roots separately."]}),e.jsx("li",{children:"If both are I(1), test for cointegration before differencing (see Cointegration section)."}),e.jsxs("li",{children:["Choose differencing order ",e.jsx(t.InlineMath,{math:"d"})," (usually 0 or 1)."]}),e.jsxs("li",{children:["Select ",e.jsx(t.InlineMath,{math:"(p, q)"})," by AIC/BIC or inspecting ACF/PACF of differenced residuals."]}),e.jsx("li",{children:"Validate residuals: Ljung-Box, normality, heteroskedasticity."})]})]}),a==="transfer"&&e.jsxs("div",{children:[e.jsx("p",{children:e.jsx("strong",{children:"Transfer function identification (Box-Jenkins procedure):"})}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Prewhiten ",e.jsx(t.InlineMath,{math:"x_t"})," by fitting an ARIMA model: ",e.jsx(t.InlineMath,{math:"\\alpha(B)x_t = \\varepsilon_t^x"}),"."]}),e.jsxs("li",{children:["Apply the same filter to ",e.jsx(t.InlineMath,{math:"y_t"}),": ",e.jsx(t.InlineMath,{math:"\\alpha(B)y_t = \\beta_t"}),"."]}),e.jsxs("li",{children:["Compute the cross-correlation function (CCF) between ",e.jsx(t.InlineMath,{math:"\\varepsilon_t^x"})," and ",e.jsx(t.InlineMath,{math:"\\beta_t"}),". Significant lags identify the delay ",e.jsx(t.InlineMath,{math:"b"})," and the order ",e.jsx(t.InlineMath,{math:"(r, s)"}),"."]}),e.jsx("li",{children:"Estimate the full model and check residuals."})]})]}),a==="intervention"&&e.jsxs("div",{children:[e.jsx("p",{children:e.jsx("strong",{children:"Intervention analysis models structural breaks as dummy variables:"})}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Additive outlier (AO):"})," a single-period spike. Dummy = 1 at time ",e.jsx(t.InlineMath,{math:"T"}),", 0 elsewhere."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Level shift (LS):"})," permanent step change. Dummy = 0 before ",e.jsx(t.InlineMath,{math:"T"}),", 1 from ",e.jsx(t.InlineMath,{math:"T"})," onwards."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Temporary change (TC):"})," initial spike that decays geometrically. Dummy filtered by ",e.jsx(t.InlineMath,{math:"1/(1 - \\omega B)"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Innovational outlier (IO):"})," shock propagated through the ARMA filter — equivalent to a pulse in the noise process."]})]})]})]}),e.jsx("h2",{children:"Long-Run Multiplier"}),e.jsxs("p",{children:["For a distributed-lag model, the ",e.jsx("strong",{children:"long-run multiplier"})," (total cumulative effect of a permanent unit increase in ",e.jsx(t.InlineMath,{math:"x_t"}),") is:"]}),e.jsx(t.BlockMath,{math:"\\text{LRM} = \\sum_{j=0}^{\\infty} \\nu_j = \\frac{\\omega(1)}{\\delta(1)}"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\nu(1)"})," means the polynomial evaluated at ",e.jsx(t.InlineMath,{math:"B=1"}),". For a simple ARIMAX with instantaneous effect ",e.jsx(t.InlineMath,{math:"\\delta"})," and AR(1) error with coefficient ",e.jsx(t.InlineMath,{math:"\\phi"}),", the long-run multiplier is"," ",e.jsx(t.InlineMath,{math:"\\delta / (1 - \\phi)"}),"."]}),e.jsxs(b,{title:"Advertising and Sales: Transfer Function",children:["A manufacturer wants to model how advertising spend ",e.jsx(t.InlineMath,{math:"x_t"})," affects monthly sales ",e.jsx(t.InlineMath,{math:"y_t"}),". Cross-correlation analysis after prewhitening shows significant CCF at lags 0, 1, and 2, suggesting a finite distributed lag of order 2.",e.jsx("br",{}),e.jsx("br",{}),"The fitted model estimates ",e.jsx(t.InlineMath,{math:"\\hat\\nu_0 = 0.40"}),","," ",e.jsx(t.InlineMath,{math:"\\hat\\nu_1 = 0.25"}),", ",e.jsx(t.InlineMath,{math:"\\hat\\nu_2 = 0.12"})," with ARMA(1,0) errors. The immediate effect of an extra £1 of advertising is 40p in sales; the long-run multiplier is ",e.jsx(t.InlineMath,{math:"0.40 + 0.25 + 0.12 = 0.77"})," — every extra £1 generates £0.77 in total sales over three months."]}),e.jsx("h2",{children:"Stationarity Requirements"}),e.jsx("p",{children:"The properties of ARIMAX depend critically on the integration orders of the variables. Three cases arise:"}),e.jsx(I,{title:"Integration and Spurious Regression",proof:"If y_t ~ I(1) and x_t ~ I(0), regressing y on x will generally find no long-run relationship. If both are I(1) but not cointegrated, standard OLS t-statistics are asymptotically invalid. Only when both are I(1) and cointegrated does a levels regression produce super-consistent estimates.",children:e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Both I(0):"})," Standard ARIMAX in levels is valid."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Both I(1), not cointegrated:"})," Difference both before regression to avoid spurious results."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Both I(1) and cointegrated:"})," A levels ARIMAX (or VECM) is appropriate and gives super-consistent coefficient estimates."]})]})}),e.jsxs(g,{title:"Exogenous Variable Assumption",children:["ARIMAX assumes ",e.jsx(t.InlineMath,{math:"x_t"})," is ",e.jsx("em",{children:"strictly exogenous"}),": current and future errors do not cause changes in ",e.jsx(t.InlineMath,{math:"x"}),". This fails in many economic applications (e.g., advertising and sales are jointly determined). In such cases, use a VAR or IV methods. Granger causality tests (see the Granger Causality section) can inform this judgment."]}),e.jsx(_,{code:re,title:"ARIMAX, Transfer Functions, and Intervention Analysis"}),e.jsx("h2",{children:"Summary"}),e.jsxs("ul",{children:[e.jsx("li",{children:"ARIMAX extends ARIMA with exogenous predictors, combining the ARMA noise structure with regression on external drivers."}),e.jsx("li",{children:"Transfer function models allow a rich, parsimoniously parameterised lag structure for how inputs flow through to outputs, characterised by the impulse response function."}),e.jsx("li",{children:"Intervention analysis uses dummy variables to model structural breaks: additive outliers, level shifts, and temporary changes."}),e.jsx("li",{children:"The integration order of all variables must be checked before fitting; spurious regression is a real risk when mixing I(0) and I(1) series."}),e.jsxs("li",{children:["In Python, statsmodels ",e.jsx("code",{children:"SARIMAX"})," handles all variants via the ",e.jsx("code",{children:"exog"})," ","argument."]})]}),e.jsx(j,{references:ne})]})}const De=Object.freeze(Object.defineProperty({__proto__:null,default:oe},Symbol.toStringTag,{value:"Module"})),le=`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.regression.linear_model import OLS
from statsmodels.tsa.statespace.sarimax import SARIMAX
import warnings
warnings.filterwarnings('ignore')

np.random.seed(7)
n = 150

# ── Simulate ADL(1,2) data: y_t = 0.3*y_{t-1} + 0.5*x_t + 0.3*x_{t-1} + e_t
x   = np.random.normal(0, 2, n)
eps = np.random.normal(0, 1, n)
y   = np.zeros(n)
y[0] = 10
for t in range(1, n):
    xl1 = x[t-1]
    yl1 = y[t-1]
    y[t] = 0.3 * yl1 + 0.5 * x[t] + 0.3 * xl1 + eps[t]

dates  = pd.date_range('2012-01', periods=n, freq='MS')
df     = pd.DataFrame({'y': y, 'x': x}, index=dates)
train  = df.iloc[:-12]
test   = df.iloc[-12:]

# ─────────────────────────────────────────────────────────────────────────────
# 1. FINITE DISTRIBUTED LAG (FDL) — include q lags of x
# ─────────────────────────────────────────────────────────────────────────────
def build_lag_matrix(df, col, q):
    """Return DataFrame of col and q lagged versions."""
    lags = {f'{col}_lag{k}': df[col].shift(k) for k in range(q + 1)}
    return pd.DataFrame(lags).dropna()

q = 4  # finite lag order
X_fdl = build_lag_matrix(df, 'x', q)
y_fdl = df['y'].loc[X_fdl.index]

X_fdl_c = sm.add_constant(X_fdl)
fdl_fit  = OLS(y_fdl, X_fdl_c).fit(cov_type='HC1')
print("Finite Distributed Lag (q=4)")
print(fdl_fit.summary().tables[1])

# Impulse response: lag coefficients
irf_fdl = fdl_fit.params[[f'x_lag{k}' for k in range(q + 1)]].values
cumulative = np.cumsum(irf_fdl)
print(f"\\nLong-run multiplier (FDL): {irf_fdl.sum():.4f}")

# ─────────────────────────────────────────────────────────────────────────────
# 2. ALMON POLYNOMIAL (PDL) — constrain lag weights to lie on a polynomial
# ─────────────────────────────────────────────────────────────────────────────
# Polynomial of degree d on lags 0..q
# beta_k = sum_{j=0}^{d} alpha_j * k^j  (k = lag index)
def almon_basis(q, d):
    """Build Almon polynomial basis matrix (q+1) x (d+1)."""
    k = np.arange(q + 1)
    return np.column_stack([k**j for j in range(d + 1)])

q_almon, d_almon = 6, 2   # 6 lags, quadratic polynomial

X_raw = build_lag_matrix(df, 'x', q_almon)
y_almon = df['y'].loc[X_raw.index]

B = almon_basis(q_almon, d_almon)            # (7 x 3)
# Transform: each row of X_raw multiplied by B => X_pdl has d+1 columns
X_pdl = X_raw.values @ B                    # (n-q) x (d+1)
X_pdl = sm.add_constant(X_pdl)

almon_fit = OLS(y_almon, X_pdl).fit()
alpha = almon_fit.params[1:]                 # polynomial coefficients
irf_almon = B @ alpha                        # recover lag weights
print(f"\\nAlmon PDL (q={q_almon}, degree={d_almon}) long-run: {irf_almon.sum():.4f}")

# ─────────────────────────────────────────────────────────────────────────────
# 3. KOYCK GEOMETRIC LAG (infinite distributed lag)
# ─────────────────────────────────────────────────────────────────────────────
# beta_k = beta_0 * lambda^k  =>  y_t = mu + beta_0*x_t + lambda*y_{t-1} + u_t
X_koyck = pd.DataFrame({
    'const': 1.0,
    'x_t':   df['x'],
    'y_lag1': df['y'].shift(1)
}, index=dates).dropna()
y_koyck = df['y'].loc[X_koyck.index]

koyck_fit = OLS(y_koyck, X_koyck).fit(cov_type='HC1')
print("\\nKoyck Geometric Lag")
print(koyck_fit.summary().tables[1])

beta0  = koyck_fit.params['x_t']
lam    = koyck_fit.params['y_lag1']
lrm_koyck = beta0 / (1 - lam)
print(f"Immediate effect beta0: {beta0:.4f}")
print(f"Decay rate lambda:      {lam:.4f}")
print(f"Long-run multiplier:    {lrm_koyck:.4f}")

# ─────────────────────────────────────────────────────────────────────────────
# 4. ADL(1,2) — autoregressive distributed lag with ARIMA errors check
# ─────────────────────────────────────────────────────────────────────────────
X_adl = pd.DataFrame({
    'const': 1.0,
    'y_lag1': df['y'].shift(1),
    'x_t':    df['x'],
    'x_lag1': df['x'].shift(1),
}, index=dates).dropna()
y_adl = df['y'].loc[X_adl.index]

adl_fit = OLS(y_adl, X_adl).fit(cov_type='HC1')
print("\\nADL(1,2) model")
print(adl_fit.summary().tables[1])

a1    = adl_fit.params['y_lag1']
b0    = adl_fit.params['x_t']
b1    = adl_fit.params['x_lag1']
lrm_adl = (b0 + b1) / (1 - a1)
print(f"Long-run multiplier ADL: {lrm_adl:.4f}")

# ─────────────────────────────────────────────────────────────────────────────
# 5. ADL forecast vs actual
# ─────────────────────────────────────────────────────────────────────────────
# For forecasting, use SARIMAX with x and x_lag1 as regressors + AR(1) errors
train_s = train.copy()
X_s = pd.DataFrame({
    'x_t':    train_s['x'],
    'x_lag1': train_s['x'].shift(1)
}).dropna()
y_s = train_s['y'].loc[X_s.index]

model_s = SARIMAX(y_s, exog=X_s, order=(1, 0, 0), trend='c')
fit_s   = model_s.fit(disp=False)

X_fc = pd.DataFrame({'x_t': test['x'], 'x_lag1': test['x'].shift(1).fillna(train['x'].iloc[-1])})
fc_s = fit_s.get_forecast(steps=12, exog=X_fc)
mae  = np.abs(test['y'] - fc_s.predicted_mean).mean()
print(f"\\nADL SARIMAX forecast MAE: {mae:.4f}")

# ─────────────────────────────────────────────────────────────────────────────
# Plot impulse response functions
# ─────────────────────────────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(14, 4))
lags = np.arange(q + 1)

axes[0].bar(lags, irf_fdl, color='steelblue')
axes[0].set_title(f'FDL IRF (q={q})')
axes[0].set_xlabel('Lag')

axes[1].bar(np.arange(q_almon + 1), irf_almon, color='seagreen')
axes[1].set_title(f'Almon PDL IRF (q={q_almon}, deg={d_almon})')
axes[1].set_xlabel('Lag')

koyck_irfs = [beta0 * lam**k for k in range(10)]
axes[2].bar(np.arange(10), koyck_irfs, color='coral')
axes[2].set_title('Koyck Geometric Lag IRF')
axes[2].set_xlabel('Lag')

plt.tight_layout()
plt.show()
`,he=[{title:"Introduction to Econometrics (4th ed.)",author:"Stock, J.H. & Watson, M.W.",year:2019,url:"https://www.pearson.com/en-us/subject-catalog/p/introduction-to-econometrics/P200000006421"},{title:"Econometric Analysis (8th ed.)",author:"Greene, W.H.",year:2018,url:"https://www.pearson.com/en-us/subject-catalog/p/econometric-analysis/P200000006221"},{title:"Time Series Analysis (2nd ed.) — Chapter 10",author:"Hamilton, J.D.",year:1994,url:"https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis"},{title:"Forecasting: Principles and Practice — Regression with ARIMA errors",author:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/regarima.html"}];function de(){const[a,o]=f.useState("fdl"),r={fdl:{name:"Finite Distributed Lag",eq:String.raw`y_t = \alpha + \sum_{k=0}^{q} \beta_k x_{t-k} + \varepsilon_t`,pro:"Simple, no parametric restriction on lag shape.",con:"Multicollinearity among lagged x; many parameters for large q."},almon:{name:"Almon Polynomial Lag",eq:String.raw`\beta_k = \sum_{j=0}^{d} \alpha_j k^j, \quad k=0,\ldots,q`,pro:"Reduces parameters; smooth, economically reasonable lag profile.",con:"Polynomial degree and lag length must be chosen; ad-hoc endpoint restrictions sometimes imposed."},koyck:{name:"Koyck Geometric Lag",eq:String.raw`y_t = \mu + \beta_0 x_t + \lambda y_{t-1} + u_t`,pro:"Single parameter controls decay; parsimonious; infinite horizon.",con:"Restricts lag profile to monotone decay; lagged y introduces endogeneity (use IV)."},adl:{name:"ADL(p,q) Model",eq:String.raw`y_t = \sum_{i=1}^{p}\phi_i y_{t-i} + \sum_{k=0}^{q}\beta_k x_{t-k} + \alpha + \varepsilon_t`,pro:"General, nests FDL and Koyck; long-run multiplier derivable.",con:"Requires selecting p and q; can be over-parameterised."}},s=r[a];return e.jsxs(x,{title:"Distributed Lag Models",difficulty:"advanced",readingTime:12,children:[e.jsxs("p",{children:["When an explanatory variable ",e.jsx(t.InlineMath,{math:"x_t"})," affects the outcome"," ",e.jsx(t.InlineMath,{math:"y_t"})," not just instantaneously but over multiple subsequent periods, a single contemporaneous regressor under-represents the relationship. ",e.jsx("strong",{children:"Distributed lag models"})," capture this propagation by including multiple lags of"," ",e.jsx(t.InlineMath,{math:"x"}),". They are fundamental in demand forecasting, macroeconomics, and marketing science — anywhere that causes take time to work through to effects."]}),e.jsxs(y,{term:"Distributed Lag Model",children:["A distributed lag (DL) model relates ",e.jsx(t.InlineMath,{math:"y_t"})," to current and past values of ",e.jsx(t.InlineMath,{math:"x_t"}),":",e.jsx(t.BlockMath,{math:"y_t = \\alpha + \\sum_{k=0}^{\\infty} \\beta_k\\, x_{t-k} + \\varepsilon_t"}),"The sequence ",e.jsx(t.InlineMath,{math:"\\{\\beta_k\\}_{k=0}^\\infty"})," is the"," ",e.jsx("strong",{children:"impulse response function"})," (or lag distribution): ",e.jsx(t.InlineMath,{math:"\\beta_k"})," ","is the effect on ",e.jsx(t.InlineMath,{math:"y_t"})," of a unit increase in ",e.jsx(t.InlineMath,{math:"x_{t-k}"})," ","holding all other ",e.jsx(t.InlineMath,{math:"x"})," constant. The sum"," ",e.jsx(t.InlineMath,{math:"\\sum_{k=0}^{\\infty} \\beta_k"})," is the ",e.jsx("strong",{children:"long-run multiplier"}),"."]}),e.jsx("h2",{children:"Types of Distributed Lag Models"}),e.jsxs("div",{style:{margin:"1.5rem 0"},children:[e.jsx("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"1rem"},children:Object.entries(r).map(([i,n])=>e.jsx("button",{onClick:()=>o(i),style:{padding:"0.4rem 1rem",background:a===i?"#7c3aed":"#ede9fe",color:a===i?"white":"#5b21b6",border:`1px solid ${a===i?"#6d28d9":"#c4b5fd"}`,borderRadius:"6px",cursor:"pointer",fontWeight:a===i?"bold":"normal"},children:n.name.split(" ")[0]},i))}),e.jsxs("div",{style:{padding:"1rem",background:"#faf5ff",borderRadius:"8px",border:"1px solid #e9d5ff"},children:[e.jsx("strong",{children:s.name}),e.jsx(t.BlockMath,{math:s.eq}),e.jsxs("p",{style:{fontSize:"0.9rem"},children:[e.jsx("strong",{children:"Advantages:"})," ",s.pro]}),e.jsxs("p",{style:{fontSize:"0.9rem"},children:[e.jsx("strong",{children:"Limitations:"})," ",s.con]})]})]}),e.jsx("h2",{children:"1. Finite Distributed Lag (FDL)"}),e.jsxs("p",{children:["The simplest approach truncates the infinite lag at order ",e.jsx(t.InlineMath,{math:"q"}),":"]}),e.jsx(t.BlockMath,{math:"y_t = \\alpha + \\beta_0 x_t + \\beta_1 x_{t-1} + \\cdots + \\beta_q x_{t-q} + \\varepsilon_t"}),e.jsxs("p",{children:["Each ",e.jsx(t.InlineMath,{math:"\\beta_k"})," is estimated freely. The main challenge is multicollinearity among the lagged regressors (high autocorrelation in ",e.jsx(t.InlineMath,{math:"x"}),"means ",e.jsx(t.InlineMath,{math:"x_{t-k}"})," and ",e.jsx(t.InlineMath,{math:"x_{t-k-1}"})," are highly correlated). This inflates standard errors and makes individual coefficients unstable."]}),e.jsx("h2",{children:"2. Almon Polynomial Distributed Lag (PDL)"}),e.jsxs("p",{children:["The ",e.jsx("strong",{children:"Almon lag"})," (also called polynomial distributed lag, PDL) addresses multicollinearity by restricting the lag weights to lie on a polynomial of degree"," ",e.jsx(t.InlineMath,{math:"d"}),":"]}),e.jsx(t.BlockMath,{math:"\\beta_k = \\sum_{j=0}^{d} \\alpha_j\\, k^j, \\quad k = 0, 1, \\ldots, q"}),e.jsxs("p",{children:["Substituting into the regression and rearranging, the model becomes a regression on"," ",e.jsx(t.InlineMath,{math:"d + 1"})," transformed variables ",e.jsx(t.InlineMath,{math:"Z_{j,t} = \\sum_{k=0}^{q} k^j x_{t-k}"}),", dramatically reducing the parameter count from ",e.jsx(t.InlineMath,{math:"q+1"})," to"," ",e.jsx(t.InlineMath,{math:"d+1"}),"."]}),e.jsxs(u,{title:"Endpoint Constraints",children:["Practitioners sometimes impose constraints that ",e.jsx(t.InlineMath,{math:"\\beta_{-1} = 0"})," (no effect before lag 0) and/or ",e.jsx(t.InlineMath,{math:"\\beta_{q+1} = 0"})," (no effect beyond lag q). These are called ",e.jsx("em",{children:"endpoint restrictions"})," and reduce parameters by one or two more, but their validity should be tested."]}),e.jsx("h2",{children:"3. Koyck Geometric Lag"}),e.jsxs("p",{children:["The ",e.jsx("strong",{children:"Koyck transformation"})," assumes lag weights decay geometrically:"," ",e.jsx(t.InlineMath,{math:"\\beta_k = \\beta_0 \\lambda^k"})," for ",e.jsx(t.InlineMath,{math:"0 < \\lambda < 1"}),". Writing out the infinite sum and applying the Koyck transformation yields a finite model:"]}),e.jsx(t.BlockMath,{math:"y_t = \\mu(1-\\lambda) + \\beta_0 x_t + \\lambda y_{t-1} + (u_t - \\lambda u_{t-1})"}),e.jsxs("p",{children:["This MA(1) error structure means OLS is inconsistent (lagged ",e.jsx(t.InlineMath,{math:"y"})," is correlated with the composite error). The solutions are:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Instrumental variables (IV):"})," instrument ",e.jsx(t.InlineMath,{math:"y_{t-1}"})," with ",e.jsx(t.InlineMath,{math:"x_{t-1}"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Non-linear least squares:"})," estimate ",e.jsx(t.InlineMath,{math:"\\beta_0"})," and ",e.jsx(t.InlineMath,{math:"\\lambda"})," jointly."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ARMA error correction:"})," fit within a SARIMAX framework with the MA term included."]})]}),e.jsxs(g,{title:"OLS Bias in Koyck Models",children:["Using OLS on ",e.jsx(t.InlineMath,{math:"y_t = c + \\beta_0 x_t + \\lambda y_{t-1} + u_t"})," when the true error is MA(1) underestimates ",e.jsx(t.InlineMath,{math:"\\lambda"})," (and hence the long-run multiplier). Always use IV or NLS for Koyck models in inferential settings. For pure forecasting in a stable environment, the bias may be tolerable."]}),e.jsx("h2",{children:"4. Autoregressive Distributed Lag (ADL)"}),e.jsxs("p",{children:["The ",e.jsx("strong",{children:"ADL(p, q)"})," model nests both AR dynamics and distributed lags:"]}),e.jsx(t.BlockMath,{math:"y_t = \\alpha + \\sum_{i=1}^{p} \\phi_i y_{t-i} + \\sum_{k=0}^{q} \\beta_k x_{t-k} + \\varepsilon_t"}),e.jsxs("p",{children:["It is the most general short-run model and contains FDL (set ",e.jsx(t.InlineMath,{math:"p=0"}),") and Koyck (",e.jsx(t.InlineMath,{math:"p=1, q=0"}),") as special cases. The long-run multiplier from ADL is:"]}),e.jsx(t.BlockMath,{math:"\\text{LRM} = \\frac{\\sum_{k=0}^{q} \\beta_k}{1 - \\sum_{i=1}^{p} \\phi_i}"}),e.jsxs(I,{title:"ADL Long-Run Relationship",proof:"Set y_t = y_{t-1} = ... = y* and x_t = x_{t-1} = ... = x* in the ADL equation. Solving for y* in terms of x* gives y* = alpha/(1-sum phi_i) + LRM * x*. This assumes |sum phi_i| < 1 (stability).",children:["In the long-run equilibrium where ",e.jsx(t.InlineMath,{math:"y_t = y^*"})," and"," ",e.jsx(t.InlineMath,{math:"x_t = x^*"})," are constant, the ADL(p,q) model implies:",e.jsx(t.BlockMath,{math:"y^* = \\frac{\\alpha}{1 - \\sum_{i=1}^{p}\\phi_i} + \\underbrace{\\frac{\\sum_{k=0}^{q}\\beta_k}{1 - \\sum_{i=1}^{p}\\phi_i}}_{\\text{LRM}} \\cdot x^*"}),"The LRM exists if and only if the AR polynomial has all roots outside the unit circle (stability condition ",e.jsx(t.InlineMath,{math:"\\sum \\phi_i < 1"}),")."]}),e.jsxs(b,{title:"Price Elasticity of Demand (ADL Model)",children:["A retailer wants to estimate how a price promotion propagates into demand over subsequent weeks. Weekly unit sales ",e.jsx(t.InlineMath,{math:"y_t"})," are regressed on log price"," ",e.jsx(t.InlineMath,{math:"x_t"}),", its lags, and a lagged sales term.",e.jsx("br",{}),e.jsx("br",{}),"ADL(1,3) results: ",e.jsx(t.InlineMath,{math:"\\hat\\phi_1 = 0.35"})," (habit persistence),"," ",e.jsx(t.InlineMath,{math:"\\hat\\beta_0 = -0.80"})," (immediate price elasticity),"," ",e.jsx(t.InlineMath,{math:"\\hat\\beta_1 = -0.30"}),", ",e.jsx(t.InlineMath,{math:"\\hat\\beta_2 = -0.12"}),","," ",e.jsx(t.InlineMath,{math:"\\hat\\beta_3 = -0.05"}),".",e.jsx("br",{}),e.jsx("br",{}),"Long-run multiplier = ",e.jsx(t.InlineMath,{math:"(-0.80 - 0.30 - 0.12 - 0.05)/(1 - 0.35) = -1.96"}),". A permanent 10% price cut increases long-run demand by approximately 19.6%."]}),e.jsx("h2",{children:"Model Selection and Practical Guidance"}),e.jsxs("p",{children:["Selecting ",e.jsx(t.InlineMath,{math:"p"})," and ",e.jsx(t.InlineMath,{math:"q"})," in ADL follows the same information-criterion approach as ARIMA:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Use AIC to select for forecasting performance; BIC for parsimony."}),e.jsx("li",{children:"Check that residuals are white noise (Ljung-Box test)."}),e.jsxs("li",{children:["The ",e.jsx("strong",{children:"general-to-specific (GtS)"})," strategy starts with a generous"," ",e.jsx(t.InlineMath,{math:"p_{\\max}"})," and ",e.jsx(t.InlineMath,{math:"q_{\\max}"})," and eliminates insignificant lags sequentially."]}),e.jsx("li",{children:"For forecasting, Almon lags with cross-validated degree and lag length often outperform unconstrained FDL by reducing variance."})]}),e.jsx(_,{code:le,title:"FDL, Almon PDL, Koyck, and ADL Models in Python"}),e.jsx("h2",{children:"Applications in Demand Forecasting"}),e.jsx("p",{children:"Distributed lag models are workhorses in demand forecasting:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Advertising carryover:"})," The effect of advertising spend on sales decays over time; Koyck or Almon lags capture the carryover effect."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Promotional elasticity:"})," Price cuts boost current and near-future demand (stockpiling effect); ADL models with 2–4 lags capture this."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Interest rate pass-through:"})," Changes in the central bank rate percolate through mortgage rates with distributed lags of up to 12 months."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Supply chain delays:"})," Material cost shocks propagate into final prices with lags determined by inventory cycles."]})]}),e.jsx(j,{references:he})]})}const Le=Object.freeze(Object.defineProperty({__proto__:null,default:de},Symbol.toStringTag,{value:"Module"})),ce=`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.api import VAR
from statsmodels.tsa.stattools import adfuller
from statsmodels.stats.stattools import durbin_watson
import warnings
warnings.filterwarnings('ignore')

# ── Simulate a stable VAR(2) with 3 variables ─────────────────────────────
np.random.seed(42)
n = 300
k = 3   # number of variables

# VAR(2) coefficient matrices
A1 = np.array([
    [ 0.5,  0.1, -0.1],
    [ 0.2,  0.4,  0.0],
    [-0.1,  0.1,  0.6]
])
A2 = np.array([
    [-0.2,  0.0,  0.1],
    [ 0.0, -0.1,  0.0],
    [ 0.0,  0.0, -0.2]
])
intercept = np.array([0.5, 1.0, -0.5])
Sigma = np.array([
    [1.0, 0.3, 0.1],
    [0.3, 1.5, 0.2],
    [0.1, 0.2, 0.8]
])

# Check stability: eigenvalues of companion matrix < 1
companion = np.block([
    [A1, A2],
    [np.eye(k), np.zeros((k, k))]
])
eigvals = np.linalg.eigvals(companion)
print(f"Max eigenvalue modulus: {np.abs(eigvals).max():.4f}  (< 1 => stable)")

# Simulate
Y = np.zeros((n, k))
Y[0:2] = np.random.multivariate_normal(np.zeros(k), Sigma, 2)
for t in range(2, n):
    eps = np.random.multivariate_normal(np.zeros(k), Sigma)
    Y[t] = intercept + A1 @ Y[t-1] + A2 @ Y[t-2] + eps

dates = pd.date_range('2000-01', periods=n, freq='QS')
df    = pd.DataFrame(Y, index=dates, columns=['GDP', 'Inflation', 'Interest'])
train = df.iloc[:-12]
test  = df.iloc[-12:]

# ── Unit root tests ────────────────────────────────────────────────────────
for col in df.columns:
    adf_stat, pval, *_ = adfuller(df[col], autolag='AIC')
    print(f"{col}: ADF stat={adf_stat:.3f}, p={pval:.3f} {'[stationary]' if pval<0.05 else '[may be unit root]'}")

# ── Fit VAR with lag order selection ──────────────────────────────────────
model = VAR(train)
lag_order = model.select_order(maxlags=8)
print("\\nLag order selection:")
print(lag_order.summary())

p_opt = lag_order.aic   # AIC-selected lag order
print(f"\\nOptimal p (AIC): {p_opt}")

# ── Estimate VAR(p) ────────────────────────────────────────────────────────
results = model.fit(p_opt)
print(results.summary())

# Durbin-Watson for each equation
print("\\nDurbin-Watson statistics:")
for i, col in enumerate(df.columns):
    dw = durbin_watson(results.resid[col])
    print(f"  {col}: DW = {dw:.4f}")

# ── Granger causality in VAR ───────────────────────────────────────────────
print("\\n=== Granger Causality Tests ===")
gc_test = results.test_causality('GDP', ['Inflation', 'Interest'], kind='f')
print(gc_test.summary())

# ── Impulse Response Functions ─────────────────────────────────────────────
irf = results.irf(periods=12)
irf.plot(orth=True, figsize=(12, 8))
plt.suptitle('Orthogonalised Impulse Response Functions', y=1.02)
plt.tight_layout()
plt.show()

# Print specific IRF: response of GDP to 1SD shock in Interest rate
irf_vals = irf.orth_irfs[:, 0, 2]   # periods x (response=GDP) x (shock=Interest)
print("\\nGDP response to 1SD Interest shock (periods 0-11):")
for t, v in enumerate(irf_vals):
    print(f"  Period {t:2d}: {v:+.4f}")

# ── Forecast Error Variance Decomposition ─────────────────────────────────
fevd = results.fevd(10)
fevd.plot()
plt.suptitle('Forecast Error Variance Decomposition')
plt.tight_layout()
plt.show()

print("\\nFEVD for GDP at horizon 10:")
print(pd.DataFrame(fevd.decomp[0],
                   columns=df.columns,
                   index=[f'h={h}' for h in range(1, 11)]))

# ── Forecasting ────────────────────────────────────────────────────────────
fc = results.forecast(train.values[-p_opt:], steps=12)
fc_df = pd.DataFrame(fc, index=test.index, columns=df.columns)

mae = (test - fc_df).abs().mean()
print("\\n12-step forecast MAE:")
print(mae)

# ── Plot GDP forecast ──────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(11, 4))
ax.plot(train['GDP'][-20:], label='Train')
ax.plot(test['GDP'], label='Actual', color='black')
ax.plot(fc_df['GDP'], label='VAR forecast', color='red', linestyle='--')
ax.set_title(f'VAR({p_opt}) GDP Forecast (12 quarters ahead)')
ax.legend()
plt.tight_layout()
plt.show()
`,me=[{title:"Time Series Analysis (2nd ed.) — Chapter 11",author:"Hamilton, J.D.",year:1994,url:"https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis"},{title:"Applied Econometrics: Time Series (4th ed.)",author:"Enders, W.",year:2014,url:"https://www.wiley.com/en-us/Applied+Econometric+Time+Series%2C+4th+Edition-p-9781118808566"},{title:"Forecasting: Principles and Practice — VAR Models",author:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/VAR.html"},{title:"statsmodels VAR documentation",author:"statsmodels contributors",year:2023,url:"https://www.statsmodels.org/stable/vector_ar.html"}];function pe(){const[a,o]=f.useState("model"),r={model:"VAR Model",stability:"Stability",irf:"Impulse Response",fevd:"Variance Decomp"};return e.jsxs(x,{title:"Vector Autoregression (VAR)",difficulty:"advanced",readingTime:15,children:[e.jsxs("p",{children:["Univariate ARIMA models treat each series in isolation. When multiple time series move together — GDP, inflation, and interest rates; supply, demand, and price — a"," ",e.jsx("strong",{children:"Vector Autoregression (VAR)"})," models them as a system, allowing each variable to depend on its own lags and the lags of all other variables. VAR is the standard tool for multivariate macroeconomic and financial forecasting and for analysing how shocks propagate through a system."]}),e.jsxs(y,{term:"VAR(p) Model",children:["A ",e.jsx(t.InlineMath,{math:"k"}),"-dimensional VAR(",e.jsx(t.InlineMath,{math:"p"}),") model is:",e.jsx(t.BlockMath,{math:"\\mathbf{y}_t = \\mathbf{c} + \\mathbf{A}_1 \\mathbf{y}_{t-1} + \\mathbf{A}_2 \\mathbf{y}_{t-2} + \\cdots + \\mathbf{A}_p \\mathbf{y}_{t-p} + \\boldsymbol{\\varepsilon}_t"}),"where:",e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"\\mathbf{y}_t = (y_{1,t}, \\ldots, y_{k,t})'"})," is a ",e.jsx(t.InlineMath,{math:"k \\times 1"})," vector"]}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"\\mathbf{c}"})," is a ",e.jsx(t.InlineMath,{math:"k \\times 1"})," constant vector"]}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"\\mathbf{A}_i"})," are ",e.jsx(t.InlineMath,{math:"k \\times k"})," coefficient matrices"]}),e.jsxs("li",{children:[e.jsx(t.InlineMath,{math:"\\boldsymbol{\\varepsilon}_t \\sim \\text{WN}(\\mathbf{0}, \\boldsymbol{\\Sigma})"})," is a white noise vector with positive-definite covariance matrix ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\Sigma}"})]})]}),"The total number of parameters (excluding the intercept) is ",e.jsx(t.InlineMath,{math:"p k^2"}),", growing quickly with ",e.jsx(t.InlineMath,{math:"k"})," and ",e.jsx(t.InlineMath,{math:"p"}),"."]}),e.jsxs("div",{style:{margin:"1.5rem 0"},children:[e.jsx("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap",borderBottom:"2px solid #e5e7eb",marginBottom:"1rem"},children:Object.entries(r).map(([s,i])=>e.jsx("button",{onClick:()=>o(s),style:{padding:"0.5rem 1.25rem",background:a===s?"#1d4ed8":"transparent",color:a===s?"white":"#374151",border:"none",cursor:"pointer",borderRadius:"4px 4px 0 0",fontWeight:a===s?"bold":"normal"},children:i},s))}),a==="model"&&e.jsxs("div",{children:[e.jsxs("p",{children:["Each equation in a VAR is an OLS regression of ",e.jsx(t.InlineMath,{math:"y_{j,t}"})," on"," ",e.jsx(t.InlineMath,{math:"p"})," lags of all ",e.jsx(t.InlineMath,{math:"k"})," variables. Because all equations share the same regressors, OLS applied equation-by-equation is equivalent to GLS (Seemingly Unrelated Regressions yields no efficiency gain here)."]}),e.jsxs("p",{children:["For a bivariate VAR(1) (",e.jsx(t.InlineMath,{math:"k=2, p=1"}),"):"]}),e.jsx(t.BlockMath,{math:"\\begin{pmatrix}y_{1,t} \\\\ y_{2,t}\\end{pmatrix} = \\begin{pmatrix}c_1 \\\\ c_2\\end{pmatrix} + \\begin{pmatrix}a_{11} & a_{12} \\\\ a_{21} & a_{22}\\end{pmatrix}\\begin{pmatrix}y_{1,t-1} \\\\ y_{2,t-1}\\end{pmatrix} + \\begin{pmatrix}\\varepsilon_{1,t} \\\\ \\varepsilon_{2,t}\\end{pmatrix}"})]}),a==="stability"&&e.jsxs("div",{children:[e.jsxs("p",{children:["A VAR(p) is ",e.jsx("strong",{children:"stable"})," (covariance-stationary) if all eigenvalues of the companion matrix ",e.jsx(t.InlineMath,{math:"\\mathbf{F}"})," lie strictly inside the unit circle:"]}),e.jsx(t.BlockMath,{math:"\\mathbf{F} = \\begin{pmatrix} \\mathbf{A}_1 & \\mathbf{A}_2 & \\cdots & \\mathbf{A}_p \\\\ \\mathbf{I}_k & \\mathbf{0} & \\cdots & \\mathbf{0} \\\\ \\vdots & & \\ddots & \\vdots \\\\ \\mathbf{0} & \\cdots & \\mathbf{I}_k & \\mathbf{0} \\end{pmatrix}"}),e.jsxs("p",{children:["The companion matrix is ",e.jsx(t.InlineMath,{math:"kp \\times kp"}),". Stability requires",e.jsx(t.InlineMath,{math:"|\\lambda_i(\\mathbf{F})| < 1"})," for all ",e.jsx(t.InlineMath,{math:"i"}),"."]})]}),a==="irf"&&e.jsxs("div",{children:[e.jsxs("p",{children:["The ",e.jsx("strong",{children:"Moving Average representation"})," of a stable VAR is"," ",e.jsx(t.InlineMath,{math:"\\mathbf{y}_t = \\boldsymbol{\\mu} + \\sum_{h=0}^{\\infty} \\boldsymbol{\\Phi}_h \\boldsymbol{\\varepsilon}_{t-h}"})," ","where ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\Phi}_h"})," are the MA coefficient matrices."]}),e.jsxs("p",{children:[e.jsx(t.InlineMath,{math:"(\\boldsymbol{\\Phi}_h)_{ij}"})," is the ",e.jsx("strong",{children:"impulse response"}),": the effect on ",e.jsx(t.InlineMath,{math:"y_{i,t+h}"})," of a unit shock to"," ",e.jsx(t.InlineMath,{math:"\\varepsilon_{j,t}"}),". However, since ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\Sigma}"})," is generally non-diagonal, shocks are correlated. The standard fix is"," ",e.jsx("strong",{children:"Cholesky orthogonalisation"}),": write"," ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\Sigma} = \\mathbf{P}\\mathbf{P}'"})," and define orthogonalised shocks ",e.jsx(t.InlineMath,{math:"\\mathbf{u}_t = \\mathbf{P}^{-1}\\boldsymbol{\\varepsilon}_t"}),"."]})]}),a==="fevd"&&e.jsxs("div",{children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Forecast Error Variance Decomposition (FEVD)"})," quantifies what fraction of the ",e.jsx(t.InlineMath,{math:"h"}),"-step forecast error variance of variable ",e.jsx(t.InlineMath,{math:"i"})," ","is attributable to shocks in variable ",e.jsx(t.InlineMath,{math:"j"}),":"]}),e.jsx(t.BlockMath,{math:"\\omega_{ij}(h) = \\frac{\\sum_{s=0}^{h-1} (\\boldsymbol{\\Phi}_s \\mathbf{P})_{ij}^2}{\\sum_{s=0}^{h-1} \\sum_{\\ell=1}^{k} (\\boldsymbol{\\Phi}_s \\mathbf{P})_{i\\ell}^2}"}),e.jsxs("p",{children:["FEVD values sum to 1 across ",e.jsx(t.InlineMath,{math:"j"})," for each"," ",e.jsx(t.InlineMath,{math:"(i, h)"}),". If ",e.jsx(t.InlineMath,{math:"\\omega_{ij}(h)"})," is large, shocks to ",e.jsx(t.InlineMath,{math:"j"})," are important drivers of uncertainty in variable"," ",e.jsx(t.InlineMath,{math:"i"})," at horizon ",e.jsx(t.InlineMath,{math:"h"}),"."]})]})]}),e.jsx("h2",{children:"Lag Order Selection"}),e.jsxs("p",{children:["The lag order ",e.jsx(t.InlineMath,{math:"p"})," is selected by minimising an information criterion. The most common are:"]}),e.jsx(t.BlockMath,{math:"\\text{AIC}(p) = \\ln|\\hat{\\boldsymbol{\\Sigma}}(p)| + \\frac{2 p k^2}{T}"}),e.jsx(t.BlockMath,{math:"\\text{BIC}(p) = \\ln|\\hat{\\boldsymbol{\\Sigma}}(p)| + \\frac{p k^2 \\ln T}{T}"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\hat{\\boldsymbol{\\Sigma}}(p)"})," is the estimated error covariance matrix and ",e.jsx(t.InlineMath,{math:"T"})," is the sample size. AIC tends to select larger"," ",e.jsx(t.InlineMath,{math:"p"})," (better forecasting); BIC favours parsimony."]}),e.jsxs(u,{title:"Curse of Dimensionality",children:["A VAR(p) with ",e.jsx(t.InlineMath,{math:"k"})," variables has ",e.jsx(t.InlineMath,{math:"k(pk + 1)"})," ","parameters per equation. With ",e.jsx(t.InlineMath,{math:"k=5"})," and ",e.jsx(t.InlineMath,{math:"p=4"}),":"," ",e.jsx(t.InlineMath,{math:"5 \\times (20 + 1) = 105"})," parameters per equation, 525 total. With"," ",e.jsx(t.InlineMath,{math:"T = 100"})," observations this is severely over-parameterised. Remedies include: small ",e.jsx(t.InlineMath,{math:"k"}),", Bayesian VAR (with Minnesota prior), or factor-augmented VAR (FAVAR)."]}),e.jsx("h2",{children:"Granger Causality in VAR"}),e.jsxs("p",{children:["Within the VAR framework, variable ",e.jsx(t.InlineMath,{math:"j"})," ",e.jsx("strong",{children:"Granger-causes"})," ","variable ",e.jsx(t.InlineMath,{math:"i"})," if the coefficients on lags of"," ",e.jsx(t.InlineMath,{math:"y_{j}"})," in equation ",e.jsx(t.InlineMath,{math:"i"})," are jointly non-zero. This is tested with a Wald (",e.jsx(t.InlineMath,{math:"\\chi^2"}),") or F-test on the block of coefficients",e.jsx(t.InlineMath,{math:"\\{a_{ij,1}, a_{ij,2}, \\ldots, a_{ij,p}\\}"}),"."]}),e.jsx("h2",{children:"Orthogonalised Impulse Response Functions"}),e.jsx("p",{children:"The Cholesky decomposition approach requires ordering the variables: the first variable in the ordering responds only to its own shock at impact; subsequent variables can be instantaneously affected by earlier ones. The ordering embodies economic assumptions about contemporaneous causality and should be motivated by theory."}),e.jsxs(g,{title:"Sensitivity to Cholesky Ordering",children:["IRF results from Cholesky orthogonalisation depend on the variable ordering. If the ordering is controversial, consider ",e.jsx("strong",{children:"generalised IRFs"})," (Pesaran & Shin, 1998) which are invariant to ordering, or sign-restricted VARs which impose theoretically motivated restrictions on the direction of impact responses."]}),e.jsxs(b,{title:"Macroeconomic VAR: GDP, Inflation, Interest Rates",children:["A standard application in central bank research: quarterly GDP growth, CPI inflation, and the short-term interest rate form a VAR(2) system. Key findings typically include:",e.jsxs("ul",{children:[e.jsx("li",{children:"A positive shock to the interest rate (monetary tightening) reduces GDP with a lag of 2–4 quarters (contractionary effect)."}),e.jsx("li",{children:"GDP shocks explain 60–80% of GDP forecast error variance at all horizons (own-shock dominance)."}),e.jsx("li",{children:"At a 4-quarter horizon, interest rate shocks explain 15–25% of GDP variance — policy has delayed but meaningful real effects."}),e.jsx("li",{children:"Inflation responds to interest rate shocks with a 1–2 quarter delay, consistent with price stickiness."})]})]}),e.jsxs(I,{title:"Wold Decomposition for Stable VAR",proof:"Any covariance-stationary process with absolutely summable MA coefficients admits a Wold decomposition. For a stable VAR(p), the companion matrix F has spectral radius < 1, so powers of F decay geometrically, ensuring Phi_h = J F^h J' where J selects the first k rows. Summability follows from geometric decay.",children:["Every stable VAR(",e.jsx(t.InlineMath,{math:"p"}),") has a convergent Wold (MA(",e.jsx(t.InlineMath,{math:"\\infty"}),")) representation:",e.jsx(t.BlockMath,{math:"\\mathbf{y}_t = \\boldsymbol{\\mu} + \\sum_{h=0}^{\\infty} \\boldsymbol{\\Phi}_h \\boldsymbol{\\varepsilon}_{t-h}, \\quad \\sum_{h=0}^{\\infty} \\|\\boldsymbol{\\Phi}_h\\| < \\infty"}),"The MA coefficient matrices satisfy ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\Phi}_h = \\mathbf{J} \\mathbf{F}^h \\mathbf{J}'"})," ","where ",e.jsx(t.InlineMath,{math:"\\mathbf{F}"})," is the companion matrix and ",e.jsx(t.InlineMath,{math:"\\mathbf{J} = [\\mathbf{I}_k, \\mathbf{0}, \\ldots, \\mathbf{0}]"}),"."]}),e.jsx(_,{code:ce,title:"VAR(p): Fitting, IRF, FEVD, and Forecasting"}),e.jsx("h2",{children:"Summary"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["VAR(p) models a system of ",e.jsx(t.InlineMath,{math:"k"})," time series as a multivariate autoregression, capturing cross-variable dynamics."]}),e.jsx("li",{children:"Lag order is selected by AIC (forecasting) or BIC (parsimony); stability requires all companion matrix eigenvalues inside the unit circle."}),e.jsx("li",{children:"Granger causality tests identify which variables help predict others within the system."}),e.jsx("li",{children:"Orthogonalised IRFs trace the dynamic response to structural shocks; results depend on the Cholesky ordering."}),e.jsx("li",{children:"FEVD quantifies how much of each variable's forecast uncertainty stems from shocks to other variables."}),e.jsxs("li",{children:["Dimensionality grows as ",e.jsx(t.InlineMath,{math:"pk^2"}),", requiring either small systems or Bayesian regularisation for large VAR applications."]})]}),e.jsx(j,{references:me})]})}const Ee=Object.freeze(Object.defineProperty({__proto__:null,default:pe},Symbol.toStringTag,{value:"Module"})),fe=`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import grangercausalitytests, adfuller
from statsmodels.tsa.api import VAR
import warnings
warnings.filterwarnings('ignore')

np.random.seed(123)
n = 200

# ── Simulate: x Granger-causes y, but y does NOT Granger-cause x ─────────
x = np.zeros(n)
y = np.zeros(n)
for t in range(3, n):
    x[t] = 0.6 * x[t-1] - 0.1 * x[t-2] + np.random.normal()
    y[t] = 0.3 * y[t-1] + 0.5 * x[t-1] + 0.2 * x[t-2] + np.random.normal()

dates = pd.date_range('2000-01', periods=n, freq='MS')
df = pd.DataFrame({'x': x, 'y': y}, index=dates)

# ── ADF tests (Granger causality requires stationary series) ──────────────
for col in ['x', 'y']:
    stat, pval, *_ = adfuller(df[col], autolag='AIC')
    print(f"ADF {col}: stat={stat:.3f}, p={pval:.4f}")

# ── Test: Does x Granger-cause y? ─────────────────────────────────────────
print("\\n=== Does x Granger-cause y? ===")
gc_xy = grangercausalitytests(df[['y', 'x']], maxlag=5, verbose=True)
# Note: first column is the 'caused' variable

# ── Test: Does y Granger-cause x? (should not) ────────────────────────────
print("\\n=== Does y Granger-cause x? ===")
gc_yx = grangercausalitytests(df[['x', 'y']], maxlag=5, verbose=True)

# ── Extract p-values for a tidy summary ───────────────────────────────────
def granger_pvalues(gc_result, test='ssr_chi2test'):
    return {lag: result[0][test][1] for lag, result in gc_result.items()}

pvals_xy = granger_pvalues(gc_xy)
pvals_yx = granger_pvalues(gc_yx)

print("\\nSummary: p-values for F-test")
print(f"{'Lag':>5}  {'x->y':>10}  {'y->x':>10}")
for lag in range(1, 6):
    print(f"{lag:>5}  {pvals_xy[lag]:>10.4f}  {pvals_yx[lag]:>10.4f}")

# ── VAR-based Granger causality (block exogeneity test) ───────────────────
print("\\n=== VAR-based block exogeneity Granger causality ===")
var_model = VAR(df)
var_fit   = var_model.fit(maxlags=4, ic='aic')
print(f"VAR lag order: {var_fit.k_ar}")

# Does x Granger-cause y in the VAR?
gc_var = var_fit.test_causality('y', ['x'], kind='f')
print("\\nx -> y in VAR:")
print(gc_var.summary())

gc_var2 = var_fit.test_causality('x', ['y'], kind='f')
print("y -> x in VAR:")
print(gc_var2.summary())

# ── Instantaneous causality ───────────────────────────────────────────────
ic_test = var_fit.test_inst_causality('y', 'x')
print("\\nInstantaneous causality x <-> y:")
print(ic_test.summary())

# ── Practical application: macro data ────────────────────────────────────
# Simulate: Leading indicator (LEI) predicts GDP growth
lei  = np.cumsum(np.random.normal(0.1, 1, n))          # I(1) series
gdp  = np.r_[0, 0.6 * lei[:-1] + np.random.normal(0, 0.5, n-1)]  # lei leads
macro = pd.DataFrame({'LEI': np.diff(lei), 'dGDP': np.diff(gdp)},
                     index=dates[1:])

print("\\n=== Macro: Does LEI Granger-cause GDP growth? ===")
gc_macro = grangercausalitytests(macro[['dGDP', 'LEI']], maxlag=4, verbose=False)
for lag, res in gc_macro.items():
    fstat, pval, df1, df2 = res[0]['ssr_ftest']
    sig = '***' if pval < 0.01 else '**' if pval < 0.05 else '*' if pval < 0.1 else ''
    print(f"  Lag {lag}: F={fstat:.3f}, p={pval:.4f} {sig}")

# ── Plot: CCF helps identify lag at which causality operates ──────────────
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

# Cross-correlation: x leads y
lags_range = range(-6, 7)
ccf_vals = [df['y'].corr(df['x'].shift(lag)) for lag in lags_range]
axes[0].bar(list(lags_range), ccf_vals, color=['red' if lag > 0 else 'steelblue' for lag in lags_range])
axes[0].axhline(0, color='black', linewidth=0.8)
axes[0].set_xlabel('Lag (positive = x leads y)')
axes[0].set_title('Cross-Correlation: x and y')

# P-values across lags
axes[1].semilogy(list(pvals_xy.keys()), list(pvals_xy.values()), 'o-', label='x->y', color='red')
axes[1].semilogy(list(pvals_yx.keys()), list(pvals_yx.values()), 's--', label='y->x', color='blue')
axes[1].axhline(0.05, color='grey', linestyle=':', label='5% threshold')
axes[1].set_xlabel('Lag')
axes[1].set_ylabel('p-value (log scale)')
axes[1].set_title('Granger Causality p-values')
axes[1].legend()
plt.tight_layout()
plt.show()
`,ue=[{title:"Investigating Causal Relations by Econometric Models and Cross-spectral Methods",author:"Granger, C.W.J.",year:1969,url:"https://www.jstor.org/stable/1912791"},{title:"Time Series Analysis (2nd ed.) — Chapters 11-12",author:"Hamilton, J.D.",year:1994,url:"https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis"},{title:"statsmodels grangercausalitytests",author:"statsmodels contributors",year:2023,url:"https://www.statsmodels.org/stable/generated/statsmodels.tsa.stattools.grangercausalitytests.html"},{title:"Causality, Forecasting and Economic Theory",author:"Hoover, K.D.",year:2001,url:"https://www.cambridge.org/core/books/causality-in-macroeconomics/7A1E7C74BFCFE8A26CAD0A7396D16A35"}];function ge(){const[a,o]=f.useState(!1);return e.jsxs(x,{title:"Granger Causality",difficulty:"advanced",readingTime:10,children:[e.jsxs("p",{children:["When building forecasting models with multiple time series, a critical question is: does knowing the past of series ",e.jsx(t.InlineMath,{math:"X"})," help predict series"," ",e.jsx(t.InlineMath,{math:"Y"}),", beyond what is already captured by the past of ",e.jsx(t.InlineMath,{math:"Y"})," ","itself? This is the question answered by ",e.jsx("strong",{children:"Granger causality"}),", one of the most widely used concepts in time series econometrics."]}),e.jsxs(y,{term:"Granger Causality",children:["Series ",e.jsx(t.InlineMath,{math:"X"})," ",e.jsx("strong",{children:"Granger-causes"})," series ",e.jsx(t.InlineMath,{math:"Y"})," ","if, using all available information including the history of ",e.jsx(t.InlineMath,{math:"X"}),","," ",e.jsx(t.InlineMath,{math:"Y"})," can be predicted more accurately than using only the history of"," ",e.jsx(t.InlineMath,{math:"Y"})," and other available information excluding ",e.jsx(t.InlineMath,{math:"X"}),". Formally, in terms of mean squared prediction error:",e.jsx(t.BlockMath,{math:"\\text{MSE}(Y_{t+h} \\mid \\mathcal{F}_{t}) < \\text{MSE}(Y_{t+h} \\mid \\mathcal{F}_{t} \\setminus \\{X_s : s \\leq t\\})"}),"where ",e.jsx(t.InlineMath,{math:"\\mathcal{F}_t"})," is the full information set at time ",e.jsx(t.InlineMath,{math:"t"}),"."]}),e.jsx("h2",{children:"The F-Test for Granger Causality"}),e.jsxs("p",{children:["In a bivariate VAR(p) setting, Granger causality from ",e.jsx(t.InlineMath,{math:"X"})," to"," ",e.jsx(t.InlineMath,{math:"Y"})," is tested by comparing two OLS regressions:"]}),e.jsx("p",{children:e.jsx("strong",{children:"Unrestricted (full) model:"})}),e.jsx(t.BlockMath,{math:"y_t = \\alpha + \\sum_{i=1}^{p} \\phi_i y_{t-i} + \\sum_{j=1}^{p} \\gamma_j x_{t-j} + \\varepsilon_t"}),e.jsx("p",{children:e.jsx("strong",{children:"Restricted model (excluding lags of x):"})}),e.jsx(t.BlockMath,{math:"y_t = \\alpha + \\sum_{i=1}^{p} \\phi_i y_{t-i} + u_t"}),e.jsxs("p",{children:["The null hypothesis ",e.jsx(t.InlineMath,{math:"H_0: \\gamma_1 = \\gamma_2 = \\cdots = \\gamma_p = 0"})," ","(X does not Granger-cause Y) is tested with an F-statistic:"]}),e.jsx(t.BlockMath,{math:"F = \\frac{(\\text{RSS}_R - \\text{RSS}_U)/p}{\\text{RSS}_U/(T - 2p - 1)} \\sim F(p,\\; T - 2p - 1)"}),e.jsxs("p",{children:["Under ",e.jsx(t.InlineMath,{math:"H_0"}),", rejection implies X Granger-causes Y at the chosen significance level."]}),e.jsxs(u,{title:"Chi-squared vs F-test",children:["statsmodels ",e.jsx("code",{children:"grangercausalitytests"})," reports both the F-test and a"," ",e.jsx(t.InlineMath,{math:"\\chi^2"}),"-based likelihood ratio test (",e.jsx("code",{children:"ssr_chi2test"}),"). The F-test is more appropriate in small samples; both are asymptotically equivalent. For small ",e.jsx(t.InlineMath,{math:"T"}),", always use the F-test."]}),e.jsxs(I,{title:"VAR Block Exogeneity Test",proof:"In a VAR(p), the Granger non-causality restriction that variable j does not Granger-cause variable i is equivalent to the block of coefficients A_ij(1), A_ij(2), ..., A_ij(p) being jointly zero. This is a linear restriction on the coefficient matrix, testable with a standard Wald or F-test.",children:["In a VAR(p) model, ",e.jsx(t.InlineMath,{math:"X"})," does not Granger-cause ",e.jsx(t.InlineMath,{math:"Y"})," ","if and only if in the ",e.jsx(t.InlineMath,{math:"Y"}),"-equation:",e.jsx(t.BlockMath,{math:"A_{yx,1} = A_{yx,2} = \\cdots = A_{yx,p} = \\mathbf{0}"}),"The Wald statistic for this joint restriction is asymptotically"," ",e.jsx(t.InlineMath,{math:"\\chi^2(p)"})," under ",e.jsx(t.InlineMath,{math:"H_0"}),"."]}),e.jsx("h2",{children:"Choosing the Lag Length p"}),e.jsxs("p",{children:["The test outcome depends on ",e.jsx(t.InlineMath,{math:"p"}),". Common practice:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Select ",e.jsx(t.InlineMath,{math:"p"})," using AIC or BIC on the unrestricted VAR, then report results for this data-driven choice."]}),e.jsxs("li",{children:["As a robustness check, report results for a range of lags (",e.jsx(t.InlineMath,{math:"p = 1, \\ldots, p_{\\max}"}),")."]}),e.jsx("li",{children:"If results flip across lag lengths, the Granger relationship is fragile — report this honestly."})]}),e.jsx("h2",{children:"Instantaneous Causality"}),e.jsxs("p",{children:["Granger causality tests based on lags only test for predictive improvement using"," ",e.jsx("em",{children:"past"})," values. A distinct concept is ",e.jsx("strong",{children:"instantaneous causality"}),": whether ",e.jsx(t.InlineMath,{math:"\\varepsilon_{x,t}"})," and ",e.jsx(t.InlineMath,{math:"\\varepsilon_{y,t}"})," ","are contemporaneously correlated (i.e., ",e.jsx(t.InlineMath,{math:"\\Sigma_{xy} \\neq 0"}),"). This is tested by asking whether knowing the current innovation in ",e.jsx(t.InlineMath,{math:"X"})," improves the forecast of current ",e.jsx(t.InlineMath,{math:"Y"})," beyond its own innovation."]}),e.jsxs(b,{title:"Leading Economic Indicators and GDP",children:["A classic application: does the Conference Board Leading Economic Index (LEI) Granger-cause future GDP growth?",e.jsx("br",{}),e.jsx("br",{}),"Using quarterly US data (1970–2024), we test whether changes in LEI Granger-cause changes in real GDP growth over lags 1–6. Results typically show strong rejection of non-causality at lags 1–4 (p < 0.01), confirming the LEI's predictive value for near-term GDP. The reverse test (GDP growth Granger-causing LEI changes) is typically weak, supporting the leading indicator interpretation.",e.jsx("br",{}),e.jsx("br",{}),"However, correlation structures change over time; it is good practice to test over rolling sub-samples to check stability of the Granger relationship."]}),e.jsxs("div",{style:{margin:"1.5rem 0",padding:"1.25rem",background:"#fef2f2",borderRadius:"8px",border:"1px solid #fecaca",cursor:"pointer"},onClick:()=>o(!a),children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("strong",{style:{color:"#dc2626"},children:"Critical Limitations of Granger Causality"}),e.jsx("span",{style:{color:"#dc2626"},children:a?"▲ Hide":"▼ Show"})]}),a&&e.jsxs("ul",{style:{marginTop:"0.75rem",fontSize:"0.9rem",color:"#7f1d1d"},children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Not true causality:"})," Granger causality is purely a predictability concept. A common cause (third variable) driving both ",e.jsx(t.InlineMath,{math:"X"})," and"," ",e.jsx(t.InlineMath,{math:"Y"})," with different lags will appear as Granger causality from"," ",e.jsx(t.InlineMath,{math:"X"})," to ",e.jsx(t.InlineMath,{math:"Y"})," even though ",e.jsx(t.InlineMath,{math:"X"})," ","has no causal influence on ",e.jsx(t.InlineMath,{math:"Y"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Omitted variables:"}),` The "all available information" in Granger's definition is approximated by the finite VAR. If a confounding variable is omitted, spurious Granger causality can appear.`]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Non-stationarity:"})," Standard Granger causality tests are invalid for I(1) series. Either difference first or use the Toda-Yamamoto procedure (fit a VAR(p+1) in levels and test on p lags only)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Measurement frequency:"})," Granger causality depends on the observation frequency; a relationship visible in monthly data may vanish or reverse at quarterly frequency due to temporal aggregation."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Structural breaks:"})," A Granger relationship stable in historical data may break down after structural changes (Lucas critique)."]})]})]}),e.jsx("h2",{children:"Toda-Yamamoto Procedure for I(1) Series"}),e.jsxs("p",{children:["When series may be I(1) or cointegrated, standard Granger causality tests have non-standard limiting distributions. The ",e.jsx("strong",{children:"Toda-Yamamoto (1995)"})," procedure avoids this:"]}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Test integration order; let maximum order be ",e.jsx(t.InlineMath,{math:"d_{\\max}"}),"."]}),e.jsxs("li",{children:["Select the optimal VAR lag order ",e.jsx(t.InlineMath,{math:"p"})," (treating series as levels)."]}),e.jsxs("li",{children:["Fit a VAR of order ",e.jsx(t.InlineMath,{math:"p + d_{\\max}"})," in levels (intentionally over-lagged)."]}),e.jsxs("li",{children:["Perform the Wald test on only the first ",e.jsx(t.InlineMath,{math:"p"})," lags (ignore the extra ",e.jsx(t.InlineMath,{math:"d_{\\max}"})," lags)."]}),e.jsxs("li",{children:["Under ",e.jsx(t.InlineMath,{math:"H_0"}),", the Wald statistic is asymptotically ",e.jsx(t.InlineMath,{math:"\\chi^2(p)"})," even when series are I(1)."]})]}),e.jsx("h2",{children:"Applications in Forecasting"}),e.jsx("p",{children:"Granger causality testing guides model building in several important ways:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Variable selection:"})," Include a variable in a VAR or ARIMAX only if it Granger-causes the target; otherwise it adds noise."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Leading indicators:"})," Identify variables with strong Granger effects at long lags for early-warning forecasting."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Causal feature engineering:"})," In machine learning forecasting, variables that Granger-cause the target are good feature candidates."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Model evaluation:"})," After fitting a VAR, verify that Granger relationships in the model match economic priors."]})]}),e.jsxs(g,{title:"Multiple Testing",children:["In a VAR with ",e.jsx(t.InlineMath,{math:"k"})," variables, there are ",e.jsx(t.InlineMath,{math:"k(k-1)"})," ","Granger causality tests (each variable against each other). Running all at the 5% level gives a high family-wise error rate. Apply Bonferroni correction (divide threshold by number of tests) or use Holm's method to control for multiple comparisons."]}),e.jsx(_,{code:fe,title:"Granger Causality Tests: statsmodels and VAR"}),e.jsx("h2",{children:"Summary"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Granger causality measures whether the past of ",e.jsx(t.InlineMath,{math:"X"})," improves predictions of ",e.jsx(t.InlineMath,{math:"Y"})," beyond ",e.jsx(t.InlineMath,{math:"Y"}),"'s own history."]}),e.jsx("li",{children:"The F-test on block zero restrictions in a VAR or bivariate regression is the standard implementation."}),e.jsx("li",{children:"It is a predictability concept, not causal in the structural sense — omitted variables and common causes can create spurious Granger relationships."}),e.jsx("li",{children:"For I(1) series, use the Toda-Yamamoto procedure to maintain valid asymptotic inference."}),e.jsx("li",{children:"Granger causality results guide variable selection, lead-lag identification, and model validation in multivariate forecasting."})]}),e.jsx(j,{references:ue})]})}const Ge=Object.freeze(Object.defineProperty({__proto__:null,default:ge},Symbol.toStringTag,{value:"Module"}));function xe(a=100,o=42){let r=o;const s=()=>(r=r*1664525+1013904223&4294967295,(r>>>0)/4294967295*2-1),i=[];let n=0,l=0,m=0;for(let p=0;p<a;p++){n+=s()*1.2,l=n+s()*.5,m=2*n-1+s()*.5;const A=l-.5*m+1;i.push({t:p,x:parseFloat(l.toFixed(2)),y:parseFloat(m.toFixed(2)),spread:parseFloat(A.toFixed(2))})}return i}const ye=`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller, coint
from statsmodels.tsa.vector_ar.vecm import VECM, select_coint_rank, select_order
import warnings
warnings.filterwarnings('ignore')

np.random.seed(99)
n = 300

# ── Simulate two cointegrated I(1) series ─────────────────────────────────
# Common stochastic trend
trend = np.cumsum(np.random.normal(0, 1, n))
# y1 = trend + stationary component
# y2 = 2 * trend - 1 + stationary component  =>  cointegrating vector [1, -0.5]
y1 = trend + np.random.normal(0, 0.5, n)
y2 = 2.0 * trend - 1.0 + np.random.normal(0, 0.5, n)

dates = pd.date_range('1995-01', periods=n, freq='QS')
df = pd.DataFrame({'y1': y1, 'y2': y2}, index=dates)

# ── Step 1: Confirm both series are I(1) ──────────────────────────────────
for col in ['y1', 'y2']:
    stat, pval, *_ = adfuller(df[col], autolag='AIC')
    dstat, dpval, *_ = adfuller(df[col].diff().dropna(), autolag='AIC')
    print(f"{col}: ADF levels p={pval:.4f}, ADF diff p={dpval:.4f}")

# ── Engle-Granger two-step ─────────────────────────────────────────────────
print("\\n=== Engle-Granger Cointegration Test ===")
eg_stat, eg_pval, eg_crits = coint(df['y1'], df['y2'], trend='c')
print(f"EG stat: {eg_stat:.4f},  p-value: {eg_pval:.4f}")
print(f"Critical values: 1%={eg_crits[0]:.3f}, 5%={eg_crits[1]:.3f}, 10%={eg_crits[2]:.3f}")

# Step 1: OLS regression to get cointegrating vector
import statsmodels.api as sm
X_eg = sm.add_constant(df['y2'])
ols_fit = sm.OLS(df['y1'], X_eg).fit()
print(f"\\nCointegrating regression: y1 = {ols_fit.params['const']:.3f} + {ols_fit.params['y2']:.3f}*y2")

# Residuals (error-correction term)
ecm_residuals = ols_fit.resid
stat_r, pval_r, *_ = adfuller(ecm_residuals, autolag='AIC')
print(f"ADF on residuals: stat={stat_r:.4f}, p={pval_r:.4f}  {'[cointegrated!]' if pval_r < 0.05 else '[not cointegrated]'}")

# ── Johansen cointegration test ────────────────────────────────────────────
print("\\n=== Johansen Cointegration Rank Test ===")
result_rank = select_coint_rank(df, det_order=0, k_ar_diff=2,
                                method='trace', signif=0.05)
print(result_rank.summary())

# Also maximal eigenvalue test
result_maxeig = select_coint_rank(df, det_order=0, k_ar_diff=2,
                                   method='maxeig', signif=0.05)
print(result_maxeig.summary())
r_est = result_rank.rank   # estimated cointegrating rank
print(f"\\nEstimated cointegrating rank (trace): r={r_est}")

# ── Fit VECM ──────────────────────────────────────────────────────────────
print("\\n=== Vector Error Correction Model (VECM) ===")
# Select VAR lag order on differenced data
lag_sel = select_order(df, maxlags=6, deterministic='co')
print(f"Optimal k_ar_diff: {lag_sel.aic}")

vecm = VECM(df, k_ar_diff=lag_sel.aic, coint_rank=r_est,
            deterministic='co')   # 'co' = constant in cointegrating eq
vecm_fit = vecm.fit()
print(vecm_fit.summary())

# Cointegrating vector (normalised on y1)
beta = vecm_fit.beta
print(f"\\nCointegrating vector beta:
{beta}")

# Error correction speeds
alpha = vecm_fit.alpha
print(f"\\nAdjustment speeds alpha:
{alpha}")

# ── Forecast with VECM ────────────────────────────────────────────────────
h = 8
fc = vecm_fit.predict(steps=h)
print(f"\\n{h}-step VECM forecast (last 3 rows):")
fc_df = pd.DataFrame(fc, columns=['y1_fc', 'y2_fc'])
print(fc_df.tail(3))

# ── Application: pairs trading spread ────────────────────────────────────
# The ECM residual is the "spread" used in pairs trading strategies
spread = ecm_residuals
z_score = (spread - spread.rolling(60).mean()) / spread.rolling(60).std()

fig, axes = plt.subplots(3, 1, figsize=(12, 10))

axes[0].plot(df['y1'], label='y1', alpha=0.8)
axes[0].plot(df['y2'] * ols_fit.params['y2'] + ols_fit.params['const'],
             label='Predicted y1 from cointegrating eq', alpha=0.8, linestyle='--')
axes[0].set_title('y1 and Cointegrating Relationship')
axes[0].legend()

axes[1].plot(spread, color='purple')
axes[1].axhline(0, color='black', linewidth=0.8)
axes[1].set_title('Cointegrating Residual (Error Correction Term / Spread)')

axes[2].plot(z_score, color='darkorange')
axes[2].axhline(2, color='red', linestyle='--', label='+2σ entry')
axes[2].axhline(-2, color='green', linestyle='--', label='-2σ entry')
axes[2].set_title('Z-score of Spread (Pairs Trading Signal)')
axes[2].legend()
plt.tight_layout()
plt.show()
`,be=[{title:"Co-integration and Error Correction: Representation, Estimation, and Testing",author:"Engle, R.F. & Granger, C.W.J.",year:1987,url:"https://www.jstor.org/stable/1913236"},{title:"Estimation and Hypothesis Testing of Cointegration Vectors in Gaussian VAR Models",author:"Johansen, S.",year:1991,url:"https://www.jstor.org/stable/2938278"},{title:"Time Series Analysis (2nd ed.) — Chapters 19-20",author:"Hamilton, J.D.",year:1994,url:"https://press.princeton.edu/books/hardcover/9780691042893/time-series-analysis"},{title:"statsmodels VECM documentation",author:"statsmodels contributors",year:2023,url:"https://www.statsmodels.org/stable/vector_ar.html#vector-error-correction-models-vecm"}];function _e(){const[a,o]=f.useState("concept"),[r,s]=f.useState(!1),i=xe(100);return e.jsxs(x,{title:"Cointegration and Error Correction",difficulty:"expert",readingTime:14,children:[e.jsxs("p",{children:["Two I(1) time series that wander independently are unrelated in the long run — their difference grows without bound. But some pairs of I(1) series share a common stochastic trend and tend to move together, never drifting too far apart. These series are called"," ",e.jsx("strong",{children:"cointegrated"}),". Cointegration theory, developed by Engle and Granger (1987) and extended by Johansen (1991), provides the rigorous framework for modelling long-run equilibrium relationships and the short-run dynamics that restore equilibrium after shocks."]}),e.jsxs(y,{term:"Cointegration",children:["A set of ",e.jsx(t.InlineMath,{math:"k"})," series ",e.jsx(t.InlineMath,{math:"\\mathbf{y}_t = (y_{1,t}, \\ldots, y_{k,t})'"})," ","is said to be ",e.jsx("strong",{children:"cointegrated of order (1,1)"}),", written"," ",e.jsx(t.InlineMath,{math:"CI(1,1)"}),", if:",e.jsxs("ol",{children:[e.jsxs("li",{children:["Each component ",e.jsx(t.InlineMath,{math:"y_{i,t} \\sim I(1)"})," individually."]}),e.jsxs("li",{children:["There exists at least one non-zero vector ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\beta}"})," such that the linear combination ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\beta}'\\mathbf{y}_t \\sim I(0)"}),"."]})]}),"The vector ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\beta}"})," is the ",e.jsx("strong",{children:"cointegrating vector"}),", and the stationary combination ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\beta}'\\mathbf{y}_t"})," is the",e.jsx("strong",{children:" error correction term"})," — it represents the long-run equilibrium deviation."]}),e.jsxs("div",{style:{margin:"1.5rem 0"},children:[e.jsx("div",{style:{display:"flex",gap:"0.5rem",borderBottom:"2px solid #e5e7eb",marginBottom:"1rem"},children:[{key:"concept",label:"Concept"},{key:"engle",label:"Engle-Granger"},{key:"johansen",label:"Johansen"},{key:"vecm",label:"VECM"}].map(({key:n,label:l})=>e.jsx("button",{onClick:()=>o(n),style:{padding:"0.5rem 1.25rem",background:a===n?"#0891b2":"transparent",color:a===n?"white":"#374151",border:"none",cursor:"pointer",borderRadius:"4px 4px 0 0",fontWeight:a===n?"bold":"normal"},children:l},n))}),a==="concept"&&e.jsxs("div",{children:[e.jsxs("p",{children:["Two I(1) series ",e.jsx(t.InlineMath,{math:"y_{1,t}"})," and ",e.jsx(t.InlineMath,{math:"y_{2,t}"})," can be written as random walks: ",e.jsx(t.InlineMath,{math:"y_{i,t} = y_{i,t-1} + u_{i,t}"}),". If they share the same stochastic trend ",e.jsx(t.InlineMath,{math:"\\tau_t"}),":"]}),e.jsx(t.BlockMath,{math:"y_{1,t} = \\tau_t + \\eta_{1,t}, \\quad y_{2,t} = c + \\gamma \\tau_t + \\eta_{2,t}"}),e.jsxs("p",{children:["then ",e.jsx(t.InlineMath,{math:"y_{1,t} - \\gamma^{-1}(y_{2,t} - c) = \\eta_{1,t} - \\gamma^{-1}\\eta_{2,t} \\sim I(0)"}),". The cointegrating vector is ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\beta} = (1, -\\gamma^{-1})'"}),"."]})]}),a==="engle"&&e.jsxs("div",{children:[e.jsxs("p",{children:["The ",e.jsx("strong",{children:"Engle-Granger two-step procedure"}),":"]}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Regress ",e.jsx(t.InlineMath,{math:"y_{1,t}"})," on ",e.jsx(t.InlineMath,{math:"y_{2,t}, \\ldots, y_{k,t}"})," ","by OLS. The OLS estimator is ",e.jsx("em",{children:"super-consistent"}),": it converges at rate"," ",e.jsx(t.InlineMath,{math:"T"})," rather than ",e.jsx(t.InlineMath,{math:"\\sqrt{T}"}),", but standard errors are not asymptotically normal."]}),e.jsxs("li",{children:["Test the residuals ",e.jsx(t.InlineMath,{math:"\\hat{e}_t = y_{1,t} - \\hat{\\boldsymbol{\\beta}}'\\mathbf{y}_{2:k,t}"})," ","for stationarity using the ADF test with special critical values (Engle-Granger tables, not standard ADF tables)."]})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Limitation:"})," The EG procedure tests only one cointegrating vector. With ",e.jsx(t.InlineMath,{math:"k > 2"}),", there can be up to ",e.jsx(t.InlineMath,{math:"r = k-1"})," ","cointegrating vectors; use the Johansen test."]})]}),a==="johansen"&&e.jsxs("div",{children:[e.jsxs("p",{children:["The ",e.jsx("strong",{children:"Johansen test"})," estimates all cointegrating vectors simultaneously via reduced-rank regression on the VECM. It tests the rank of the long-run matrix",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\Pi}"}),":"]}),e.jsx(t.BlockMath,{math:"\\Delta\\mathbf{y}_t = \\boldsymbol{\\Pi}\\mathbf{y}_{t-1} + \\sum_{i=1}^{p-1} \\boldsymbol{\\Gamma}_i \\Delta\\mathbf{y}_{t-i} + \\boldsymbol{\\varepsilon}_t"}),e.jsxs("p",{children:["If ",e.jsx(t.InlineMath,{math:"\\text{rank}(\\boldsymbol{\\Pi}) = r"}),", then"," ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\Pi} = \\boldsymbol{\\alpha}\\boldsymbol{\\beta}'"})," where",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\beta}"})," is ",e.jsx(t.InlineMath,{math:"k \\times r"})," (cointegrating vectors) and ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\alpha}"})," is ",e.jsx(t.InlineMath,{math:"k \\times r"})," ","(adjustment speeds)."]}),e.jsx("p",{children:"Two test statistics:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Trace:"})," ",e.jsx(t.InlineMath,{math:"\\lambda_{\\text{trace}}(r) = -T\\sum_{i=r+1}^{k}\\ln(1-\\hat{\\lambda}_i)"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Max eigenvalue:"})," ",e.jsx(t.InlineMath,{math:"\\lambda_{\\max}(r, r+1) = -T\\ln(1-\\hat{\\lambda}_{r+1})"})]})]})]}),a==="vecm"&&e.jsxs("div",{children:[e.jsxs("p",{children:["The ",e.jsx("strong",{children:"Vector Error Correction Model (VECM)"})," is the cointegrated counterpart to VAR:"]}),e.jsx(t.BlockMath,{math:"\\Delta\\mathbf{y}_t = \\boldsymbol{\\alpha}\\underbrace{\\boldsymbol{\\beta}'\\mathbf{y}_{t-1}}_{\\text{ECT}} + \\sum_{i=1}^{p-1}\\boldsymbol{\\Gamma}_i\\Delta\\mathbf{y}_{t-i} + \\boldsymbol{\\varepsilon}_t"}),e.jsxs("p",{children:[e.jsx(t.InlineMath,{math:"\\boldsymbol{\\alpha}_{ij}"})," is the speed of adjustment of variable"," ",e.jsx(t.InlineMath,{math:"i"})," to cointegrating relationship ",e.jsx(t.InlineMath,{math:"j"}),". A negative ",e.jsx(t.InlineMath,{math:"\\alpha_{ij}"})," means variable ",e.jsx(t.InlineMath,{math:"i"})," ","corrects toward equilibrium. If ",e.jsx(t.InlineMath,{math:"\\alpha_{ij} = 0"}),", variable"," ",e.jsx(t.InlineMath,{math:"i"})," is ",e.jsx("em",{children:"weakly exogenous"})," with respect to cointegrating vector ",e.jsx(t.InlineMath,{math:"j"}),"."]})]})]}),e.jsxs("div",{style:{margin:"1.5rem 0",padding:"1rem",background:"#f8fafc",borderRadius:"8px",border:"1px solid #e2e8f0"},children:[e.jsx("h3",{style:{fontWeight:600,marginBottom:"0.75rem",fontSize:"0.95rem"},children:"Interactive: Cointegrated Series and Spread"}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",marginBottom:"0.75rem"},children:[e.jsx("button",{onClick:()=>s(!1),style:{padding:"0.3rem 0.9rem",borderRadius:"4px",border:"none",cursor:"pointer",background:r?"#e2e8f0":"#0891b2",color:r?"#374151":"white",fontWeight:r?"normal":"bold"},children:"Raw Series (I(1))"}),e.jsx("button",{onClick:()=>s(!0),style:{padding:"0.3rem 0.9rem",borderRadius:"4px",border:"none",cursor:"pointer",background:r?"#0891b2":"#e2e8f0",color:r?"white":"#374151",fontWeight:r?"bold":"normal"},children:"Spread / ECT (I(0))"})]}),e.jsx(C,{width:"100%",height:240,children:r?e.jsxs(E,{data:i,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(T,{strokeDasharray:"3 3"}),e.jsx(R,{dataKey:"t",label:{value:"Time",position:"insideBottom",offset:-2}}),e.jsx(F,{}),e.jsx(B,{}),e.jsx(N,{y:0,stroke:"#64748b",strokeDasharray:"4 2"}),e.jsx(k,{type:"monotone",dataKey:"spread",stroke:"#7c3aed",dot:!1,name:"Spread x − 0.5y + 1",strokeWidth:2})]}):e.jsxs(E,{data:i,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(T,{strokeDasharray:"3 3"}),e.jsx(R,{dataKey:"t",label:{value:"Time",position:"insideBottom",offset:-2}}),e.jsx(F,{}),e.jsx(B,{}),e.jsx(D,{}),e.jsx(k,{type:"monotone",dataKey:"x",stroke:"#2563eb",dot:!1,name:"x  (I(1))",strokeWidth:2}),e.jsx(k,{type:"monotone",dataKey:"y",stroke:"#16a34a",dot:!1,name:"y  (I(1))",strokeWidth:2})]})}),e.jsx("p",{style:{fontSize:"0.8rem",color:"#64748b",marginTop:"0.5rem"},children:"Both x and y are I(1) random walks with a shared stochastic trend. Their linear combination x − 0.5y + 1 is mean-reverting I(0) — the cointegrating relationship (error correction term)."})]}),e.jsxs(I,{title:"Granger Representation Theorem",proof:"If y_t is CI(1,1) with cointegrating vector beta, then there exists a VECM representation with alpha*beta' = Pi. Conversely, any VECM with rank(Pi)=r has r cointegrating relationships. The proof relies on the Beveridge-Nelson decomposition of I(1) processes into random walk and stationary components.",children:["If ",e.jsx(t.InlineMath,{math:"\\mathbf{y}_t"})," is cointegrated with rank ",e.jsx(t.InlineMath,{math:"r > 0"}),", then it has a valid VECM representation with"," ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\Pi} = \\boldsymbol{\\alpha}\\boldsymbol{\\beta}'"})," where"," ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\alpha}"})," and ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\beta}"})," are"," ",e.jsx(t.InlineMath,{math:"k \\times r"})," matrices of full column rank. The cointegrating vectors"," ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\beta}"})," are identified only up to a non-singular linear transformation; a normalisation is needed for unique interpretation."]}),e.jsx("h2",{children:"Cointegrating Rank and the Three Cases"}),e.jsxs("p",{children:["For a ",e.jsx(t.InlineMath,{math:"k"}),"-dimensional system:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:[e.jsx(t.InlineMath,{math:"r = 0"})," (no cointegration):"]})," All series are I(1) and unrelated in the long run. Model in first differences (VAR on ",e.jsx(t.InlineMath,{math:"\\Delta\\mathbf{y}_t"}),")."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:[e.jsx(t.InlineMath,{math:"0 < r < k"})," (partial cointegration):"]})," There are"," ",e.jsx(t.InlineMath,{math:"r"})," cointegrating relationships and ",e.jsx(t.InlineMath,{math:"k - r"})," common stochastic trends. Use VECM."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:[e.jsx(t.InlineMath,{math:"r = k"})," (full rank):"]})," All series are actually I(0). Model in levels (standard VAR)."]})]}),e.jsxs(g,{title:"Critical Values Depend on Deterministic Components",children:["Johansen and Engle-Granger critical values differ depending on whether the cointegrating equation includes a constant, a trend, or both. The deterministic specification must match the data — including an unnecessary trend inflates size; omitting a needed trend causes size distortion in the other direction. statsmodels' ",e.jsx("code",{children:"det_order"})," parameter controls this: -1 (none), 0 (constant), 1 (constant + trend)."]}),e.jsxs(b,{title:"Pairs Trading: Coca-Cola and PepsiCo",children:["A classic pairs trading application: Coca-Cola (KO) and PepsiCo (PEP) stock prices are both I(1) but share a common consumer staples trend. Engle-Granger test on log prices: ADF on residuals gives stat = -4.12 (p = 0.006 < 0.05), confirming cointegration.",e.jsx("br",{}),e.jsx("br",{}),"The cointegrating vector (normalised) is approximately ",e.jsx(t.InlineMath,{math:"(1, -0.92)"}),", meaning ",e.jsx(t.InlineMath,{math:"\\log P_{KO,t} - 0.92 \\log P_{PEP,t}"})," is stationary. When this spread rises 2 standard deviations above its historical mean (log prices diverge), the strategy shorts KO and longs PEP; when the spread reverts, positions are closed.",e.jsx("br",{}),e.jsx("br",{}),"The VECM adjustment speed ",e.jsx(t.InlineMath,{math:"\\hat\\alpha_{KO} \\approx -0.08"})," implies that ~8% of any deviation from equilibrium is corrected each period — roughly a 12-week half-life."]}),e.jsx("h2",{children:"Long-Run Equilibrium in Forecasting"}),e.jsx("p",{children:"For long-horizon forecasting, the VECM is preferred over a differenced VAR for cointegrated systems because:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"The error correction term enforces the long-run equilibrium constraint, preventing forecasts from diverging unrealistically."}),e.jsx("li",{children:"At short horizons, VECM and differenced VAR forecasts are similar; advantages accumulate at longer horizons."}),e.jsx("li",{children:"Ignoring cointegration (using a differenced VAR) loses long-run information and produces sub-optimal long-horizon forecasts."})]}),e.jsx(u,{title:"Forecast Uncertainty in VECM",children:"The long-run forecast of a VECM for a CI(1,1) system converges to a linear combination constrained to the cointegrating space. Unlike an unrestricted I(1) VAR whose forecast intervals grow without bound, the VECM's forecast variance is bounded in the direction of the cointegrating vector but still grows in the directions of common stochastic trends."}),e.jsx(_,{code:ye,title:"Cointegration: Engle-Granger, Johansen, and VECM"}),e.jsx("h2",{children:"Summary"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Cointegration describes a long-run equilibrium between I(1) series; their linear combination is I(0)."}),e.jsx("li",{children:"The Engle-Granger two-step procedure tests for a single cointegrating vector via OLS residuals; use only for bivariate systems."}),e.jsxs("li",{children:["The Johansen test handles multiple cointegrating vectors and provides full ML estimation; preferred for ",e.jsx(t.InlineMath,{math:"k \\geq 3"}),"."]}),e.jsxs("li",{children:["The VECM decomposes dynamics into long-run adjustment (ECT) and short-run deviations, with adjustment speed matrix ",e.jsx(t.InlineMath,{math:"\\boldsymbol{\\alpha}"}),"."]}),e.jsx("li",{children:"Applications include pairs trading (finance), demand systems (economics), and any setting with long-run equilibrium constraints."}),e.jsx("li",{children:"For long-horizon forecasting, VECM enforces equilibrium constraints that differenced VARs ignore, yielding better long-horizon forecasts."})]}),e.jsx(j,{references:be})]})}const Ke=Object.freeze(Object.defineProperty({__proto__:null,default:_e},Symbol.toStringTag,{value:"Module"})),je=[{q:"Q1-22",Total:280,ProdA:165,ProdB:115,AN:95,AS:70,BN:65,BS:50},{q:"Q2-22",Total:310,ProdA:185,ProdB:125,AN:108,AS:77,BN:72,BS:53},{q:"Q3-22",Total:295,ProdA:172,ProdB:123,AN:100,AS:72,BN:70,BS:53},{q:"Q4-22",Total:340,ProdA:200,ProdB:140,AN:116,AS:84,BN:80,BS:60},{q:"Q1-23",Total:305,ProdA:178,ProdB:127,AN:102,AS:76,BN:73,BS:54},{q:"Q2-23",Total:335,ProdA:195,ProdB:140,AN:112,AS:83,BN:80,BS:60},{q:"Q3-23",Total:320,ProdA:188,ProdB:132,AN:108,AS:80,BN:76,BS:56},{q:"Q4-23",Total:365,ProdA:215,ProdB:150,AN:124,AS:91,BN:86,BS:64}],ve=`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

# ── Build a simple product × region hierarchy ──────────────────────────────
# Hierarchy:
#   Total
#   ├── Product A
#   │   ├── A-North
#   │   └── A-South
#   └── Product B
#       ├── B-North
#       └── B-South
# 4 bottom-level series, 2 middle-level, 1 top-level = 7 total

np.random.seed(5)
n = 48  # 4 years monthly

def gen_series(base, trend, seasonality_amp, noise):
    t = np.arange(n)
    return (base + trend * t
            + seasonality_amp * np.sin(2 * np.pi * t / 12)
            + np.random.normal(0, noise, n))

# Bottom-level: 4 series
a_north = gen_series(100, 0.3, 10, 3)
a_south = gen_series( 80, 0.2,  8, 3)
b_north = gen_series( 60, 0.4,  6, 2)
b_south = gen_series( 40, 0.1,  4, 2)

# Derive aggregates (summing constraints)
prod_a = a_north + a_south
prod_b = b_north + b_south
total  = prod_a + prod_b

dates = pd.date_range('2020-01', periods=n, freq='MS')
df = pd.DataFrame({
    'Total':   total,
    'ProdA':   prod_a,
    'ProdB':   prod_b,
    'A_North': a_north,
    'A_South': a_south,
    'B_North': b_north,
    'B_South': b_south,
}, index=dates)

train = df.iloc[:-12]
test  = df.iloc[-12:]

# ── Verify summing constraints ─────────────────────────────────────────────
assert np.allclose(df['Total'], df['ProdA'] + df['ProdB'])
assert np.allclose(df['ProdA'], df['A_North'] + df['A_South'])
print("Summing constraints verified.")

# ── Summing matrix S ───────────────────────────────────────────────────────
# S maps bottom-level forecasts to all levels: y = S * y_bottom
# Rows: [Total, ProdA, ProdB, A_North, A_South, B_North, B_South]
# Cols: [A_North, A_South, B_North, B_South]
S = np.array([
    [1, 1, 1, 1],   # Total = all four
    [1, 1, 0, 0],   # ProdA = A_North + A_South
    [0, 0, 1, 1],   # ProdB = B_North + B_South
    [1, 0, 0, 0],   # A_North
    [0, 1, 0, 0],   # A_South
    [0, 0, 1, 0],   # B_North
    [0, 0, 0, 1],   # B_South
])
print(f"\\nSumming matrix S shape: {S.shape}")
print(S)

# ── Bottom-up approach ────────────────────────────────────────────────────
from statsmodels.tsa.holtwinters import ExponentialSmoothing

def ets_forecast(series, h=12):
    """Simple ETS forecast."""
    model = ExponentialSmoothing(series, trend='add', seasonal='add',
                                 seasonal_periods=12)
    fit = model.fit(optimized=True)
    return fit.forecast(h)

h = 12
# Step 1: forecast all 4 bottom-level series
fc_bottom = {}
for col in ['A_North', 'A_South', 'B_North', 'B_South']:
    fc_bottom[col] = ets_forecast(train[col], h)

# Step 2: aggregate using S
fc_bottom_matrix = np.column_stack([
    fc_bottom['A_North'].values,
    fc_bottom['A_South'].values,
    fc_bottom['B_North'].values,
    fc_bottom['B_South'].values
])
fc_bu = (S @ fc_bottom_matrix.T).T  # (h x 7)
fc_bu_df = pd.DataFrame(fc_bu, index=test.index,
                          columns=['Total','ProdA','ProdB','A_North','A_South','B_North','B_South'])
print("\\nBottom-up forecast (head):")
print(fc_bu_df.head(3))

# ── Top-down approach ─────────────────────────────────────────────────────
# Forecast total, then distribute using historical proportions
fc_total = ets_forecast(train['Total'], h)
proportions = train[['A_North','A_South','B_North','B_South']].mean() / train['Total'].mean()
print(f"\\nHistorical average proportions:
{proportions}")

fc_td_bottom = np.outer(fc_total.values, proportions.values)
fc_td = (S @ fc_td_bottom.T).T
fc_td_df = pd.DataFrame(fc_td, index=test.index,
                          columns=['Total','ProdA','ProdB','A_North','A_South','B_North','B_South'])

# ── Compare accuracy ─────────────────────────────────────────────────────
for approach, fc_df in [('Bottom-Up', fc_bu_df), ('Top-Down', fc_td_df)]:
    mae_total = (test['Total'] - fc_df['Total']).abs().mean()
    mae_bottom = (test[['A_North','A_South','B_North','B_South']].values -
                  fc_df[['A_North','A_South','B_North','B_South']].values).reshape(-1).mean()
    print(f"\\n{approach}: MAE Total={mae_total:.2f}, MAE Bottom avg={mae_bottom:.2f}")

# ── hierarchicalforecast library ─────────────────────────────────────────
# pip install hierarchicalforecast
try:
    from hierarchicalforecast.utils import aggregate
    from hierarchicalforecast.core import ReconcilerForecasts
    from hierarchicalforecast.methods import BottomUp, TopDown

    # Prepare long-format DataFrame for hierarchicalforecast
    bottom_df = pd.melt(
        train[['A_North','A_South','B_North','B_South']].reset_index(),
        id_vars='index', var_name='unique_id', value_name='y'
    ).rename(columns={'index': 'ds'})

    print("\\nhierarchicalforecast input (head):")
    print(bottom_df.head())
except ImportError:
    print("\\nInstall: pip install hierarchicalforecast")

# ── Plot ──────────────────────────────────────────────────────────────────
fig, axes = plt.subplots(2, 2, figsize=(13, 8))
bottom_series = ['A_North', 'A_South', 'B_North', 'B_South']
for ax, col in zip(axes.flat, bottom_series):
    ax.plot(train[col], label='Train')
    ax.plot(test[col], label='Actual', color='black')
    ax.plot(fc_bu_df[col], label='BU forecast', color='red', linestyle='--')
    ax.plot(fc_td_df[col], label='TD forecast', color='blue', linestyle=':')
    ax.set_title(col)
    ax.legend(fontsize=7)
plt.suptitle('Hierarchical Forecasting: Bottom-Up vs Top-Down', y=1.01)
plt.tight_layout()
plt.show()
`,Me=[{title:"Forecasting: Principles and Practice (3rd ed.) — Chapter 11: Hierarchical Forecasting",author:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/hierarchical.html"},{title:"Optimal Combination Forecasts for Hierarchical Time Series",author:"Hyndman, R.J., Ahmed, R.A., Athanasopoulos, G. & Shang, H.L.",year:2011,url:"https://www.tandfonline.com/doi/abs/10.1198/jcgs.2011.09107"},{title:"hierarchicalforecast: A Benchmark Library for Hierarchical Forecasting",author:"Olivares, K.G. et al.",year:2023,url:"https://proceedings.mlr.press/v151/olivares22a.html"},{title:"A Note on the Aggregation of Disaggregate Forecasts",author:"Kahn, K.B.",year:1998,url:"https://doi.org/10.1016/S0169-2070(97)00058-3"}];function Ie(){const[a,o]=f.useState("bottomup"),r={bottomup:{name:"Bottom-Up",desc:"Forecast each bottom-level series independently, then aggregate using the summing matrix S.",pros:["Preserves disaggregate information","No information loss at bottom level","Simple to implement"],cons:["Bottom-level noise can propagate upward","Ignores correlation structure","May over-estimate top-level uncertainty"],eq:String.raw`\tilde{\mathbf{y}}_h = S\hat{\mathbf{b}}_h`},topdown:{name:"Top-Down",desc:"Forecast the aggregate series at the top, then distribute to lower levels using historical proportion estimates.",pros:["Stable top-level forecast","Simple; only one model needed at top","Good for very sparse bottom series"],cons:["Information at lower levels lost","Proportions may shift over time","Bottom-level uncertainty underestimated"],eq:String.raw`\tilde{\mathbf{y}}_h = S \cdot p \cdot \hat{y}_{T,h}`},middleout:{name:"Middle-Out",desc:'Forecast a "middle" level of the hierarchy, then aggregate upward and disaggregate downward.',pros:["Balances top-level stability with bottom-level detail","Useful when middle level has most reliable data"],cons:["Choice of middle level is ad hoc","Inconsistencies can arise at edges"],eq:String.raw`\tilde{\mathbf{y}}_h = \text{aggregate}(S_m \hat{\mathbf{m}}_h) \cup \text{disaggregate}(\hat{\mathbf{m}}_h)`}},s=r[a];return e.jsxs(x,{title:"Hierarchical Time Series",difficulty:"advanced",readingTime:13,children:[e.jsxs("p",{children:["In retail, sales exist for individual SKUs, product categories, regions, and total company levels. In government statistics, employment figures are available by occupation, industry, state, and national level. These are ",e.jsx("strong",{children:"hierarchical time series"}),": collections of series related by aggregation constraints. Forecasting them requires producing coherent forecasts — forecasts at every level that are consistent with the aggregation structure."]}),e.jsxs(y,{term:"Hierarchical Time Series",children:["A hierarchical time series is a collection of series ",e.jsx(t.InlineMath,{math:"\\{y_{j,t}\\}"})," at multiple levels of aggregation, such that all series at each level sum to the series at the level above. At the bottom level there are ",e.jsx(t.InlineMath,{math:"m"})," series; the total is their sum. The structure is encoded by the ",e.jsx("strong",{children:"summing matrix"})," ",e.jsx(t.InlineMath,{math:"\\mathbf{S}"})," of dimension ",e.jsx(t.InlineMath,{math:"n \\times m"})," ","(",e.jsx(t.InlineMath,{math:"n"})," = total series, ",e.jsx(t.InlineMath,{math:"m"})," = bottom-level series):",e.jsx(t.BlockMath,{math:"\\mathbf{y}_t = \\mathbf{S}\\,\\mathbf{b}_t"}),"where ",e.jsx(t.InlineMath,{math:"\\mathbf{b}_t"})," is the ",e.jsx(t.InlineMath,{math:"m \\times 1"})," vector of bottom-level values."]}),e.jsx("h2",{children:"Structure of the Summing Matrix"}),e.jsx("p",{children:"For a two-level hierarchy with total, two product groups (A and B), and four bottom-level series (A-North, A-South, B-North, B-South):"}),e.jsx(t.BlockMath,{math:"\\mathbf{S} = \\begin{pmatrix} 1 & 1 & 1 & 1 \\\\ 1 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 1 \\\\ 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix} \\quad \\begin{matrix} \\text{Total} \\\\ \\text{ProdA} \\\\ \\text{ProdB} \\\\ \\text{A-North} \\\\ \\text{A-South} \\\\ \\text{B-North} \\\\ \\text{B-South} \\end{matrix}"}),e.jsxs("p",{children:["Any forecast vector ",e.jsx(t.InlineMath,{math:"\\tilde{\\mathbf{y}}_h"})," satisfying"," ",e.jsx(t.InlineMath,{math:"\\tilde{\\mathbf{y}}_h = \\mathbf{S}\\tilde{\\mathbf{b}}_h"})," for some bottom-level forecast ",e.jsx(t.InlineMath,{math:"\\tilde{\\mathbf{b}}_h"})," is called"," ",e.jsx("strong",{children:"coherent"}),"."]}),e.jsxs("div",{style:{margin:"1.5rem 0",padding:"1rem",background:"#f0fdf4",borderRadius:"8px",border:"1px solid #86efac"},children:[e.jsx("h3",{style:{fontWeight:600,marginBottom:"0.75rem",fontSize:"0.95rem"},children:"Interactive: Simulated Quarterly Sales Hierarchy"}),e.jsx("p",{style:{fontSize:"0.85rem",color:"#374151",marginBottom:"0.75rem"},children:"Observe how Total = ProdA + ProdB, and each product = its two regional series. Select a level to inspect."}),e.jsx(C,{width:"100%",height:240,children:e.jsxs(K,{data:je,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(T,{strokeDasharray:"3 3"}),e.jsx(R,{dataKey:"q"}),e.jsx(F,{}),e.jsx(B,{}),e.jsx(D,{}),e.jsx(M,{dataKey:"AN",stackId:"a",fill:"#60a5fa",name:"A-North"}),e.jsx(M,{dataKey:"AS",stackId:"a",fill:"#3b82f6",name:"A-South"}),e.jsx(M,{dataKey:"BN",stackId:"a",fill:"#86efac",name:"B-North"}),e.jsx(M,{dataKey:"BS",stackId:"a",fill:"#16a34a",name:"B-South"})]})}),e.jsx("p",{style:{fontSize:"0.78rem",color:"#64748b",marginTop:"0.4rem"},children:"Stacked bars show bottom-level series; their sum equals the Total (the summing constraint)."})]}),e.jsx("h2",{children:"Grouped vs Strictly Hierarchical Series"}),e.jsxs("p",{children:["A ",e.jsx("strong",{children:"grouped"})," time series can be disaggregated by multiple attributes that do not nest into a single tree. For example, sales can be disaggregated by"," ",e.jsx("em",{children:"product"})," (A, B) and by ",e.jsx("em",{children:"region"})," (North, South) — but Product A × North and Product B × North both roll up to North, and both A and B also roll up to Total."]}),e.jsxs(u,{title:"Grouped Series and the S Matrix",children:["Grouped series have a more complex ",e.jsx(t.InlineMath,{math:"\\mathbf{S}"})," with rows for each grouping attribute. The key property remains: every row of ",e.jsx(t.InlineMath,{math:"\\mathbf{S}"})," ","is a binary vector selecting which bottom-level series aggregate to that row's level. The coherence condition ",e.jsx(t.InlineMath,{math:"\\mathbf{y}_t = \\mathbf{S}\\mathbf{b}_t"})," still holds."]}),e.jsx("h2",{children:"Coherence Requirement"}),e.jsxs("p",{children:["A naive approach — forecast each series independently at each level — almost never produces coherent forecasts. For example, the sum of bottom-level forecasts will typically differ from the independently-generated top-level forecast. ",e.jsx("strong",{children:"Reconciliation"})," ","is the process of adjusting a set of incoherent base forecasts to satisfy the summing constraints. This is the subject of the next section; here we focus on the three classical approaches that produce coherent forecasts by construction."]}),e.jsxs("div",{style:{margin:"1.5rem 0"},children:[e.jsx("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"1rem"},children:Object.entries(r).map(([i,n])=>e.jsx("button",{onClick:()=>o(i),style:{padding:"0.4rem 1.2rem",background:a===i?"#16a34a":"#dcfce7",color:a===i?"white":"#15803d",border:`1px solid ${a===i?"#15803d":"#86efac"}`,borderRadius:"6px",cursor:"pointer",fontWeight:a===i?"bold":"normal"},children:n.name},i))}),e.jsxs("div",{style:{padding:"1.25rem",background:"#f0fdf4",borderRadius:"8px",border:"1px solid #86efac"},children:[e.jsx("strong",{style:{fontSize:"1rem"},children:s.name}),e.jsx("p",{style:{marginTop:"0.5rem"},children:s.desc}),e.jsx(t.BlockMath,{math:s.eq}),e.jsxs("div",{style:{display:"flex",gap:"2rem",marginTop:"0.75rem"},children:[e.jsxs("div",{children:[e.jsx("strong",{style:{color:"#15803d"},children:"Advantages:"}),e.jsx("ul",{style:{fontSize:"0.88rem",marginTop:"0.25rem"},children:s.pros.map((i,n)=>e.jsx("li",{children:i},n))})]}),e.jsxs("div",{children:[e.jsx("strong",{style:{color:"#dc2626"},children:"Limitations:"}),e.jsx("ul",{style:{fontSize:"0.88rem",marginTop:"0.25rem"},children:s.cons.map((i,n)=>e.jsx("li",{children:i},n))})]})]})]})]}),e.jsx("h2",{children:"Empirical Evidence on Method Performance"}),e.jsx("p",{children:"Research has produced some broad guidelines, though results vary across datasets:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Bottom-up"})," typically performs best when bottom-level series are informative and have sufficient history. It is the most common baseline."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Top-down with historical proportions"})," outperforms bottom-up when bottom-level series are noisy (short history, intermittent demand)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Middle-out"})," is popular in retail supply chain when product-family-level data is most reliable."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reconciliation methods"})," (MinT, OLS) consistently outperform all three simple approaches by combining information across levels — see the next section."]})]}),e.jsx(g,{title:"Proportional Top-Down Assumes Stable Shares",children:"Top-down with historical proportions implicitly assumes the relative shares of each series are constant over time. If product A's market share is growing and B's is declining, top-down forecasts will under-forecast A and over-forecast B. Always plot historical proportions over time as a diagnostic."}),e.jsx(b,{title:"Australian Tourism Hierarchy",children:"The Australian Tourism Demand dataset from the hts R package has 304 monthly series: national total, 8 states, 76 zones, and 304 regions. Bottom-up produces coherent but noisy region-level forecasts. Top-down with historical proportions underestimates growth in fast-growing regions. The OLS reconciliation (next section) reduces MASE by 15–20% for both aggregate and disaggregate levels compared to bottom-up."}),e.jsx("h2",{children:"Practical Implementation"}),e.jsxs("p",{children:["The ",e.jsx("code",{children:"hierarchicalforecast"})," library (Nixtla) provides a clean Python implementation supporting bottom-up, top-down, and all reconciliation methods:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Accepts any base forecasting model (ETS, ARIMA, LightGBM, etc.)."}),e.jsxs("li",{children:["Constructs ",e.jsx(t.InlineMath,{math:"\\mathbf{S}"})," automatically from a tagging DataFrame."]}),e.jsx("li",{children:"Supports point and probabilistic reconciliation."})]}),e.jsx(_,{code:ve,title:"Hierarchical Time Series: Bottom-Up and Top-Down"}),e.jsx("h2",{children:"Summary"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Hierarchical time series are collections of series related by aggregation constraints, encoded in the summing matrix ",e.jsx(t.InlineMath,{math:"\\mathbf{S}"}),"."]}),e.jsxs("li",{children:["Coherent forecasts satisfy ",e.jsx(t.InlineMath,{math:"\\tilde{\\mathbf{y}}_h = \\mathbf{S}\\tilde{\\mathbf{b}}_h"}),"; independently generated forecasts are generally incoherent."]}),e.jsx("li",{children:"Bottom-up aggregates bottom-level forecasts; top-down distributes a top-level forecast using proportions; middle-out combines both directions."}),e.jsx("li",{children:"Reconciliation methods (next section) dominate all three simple approaches by statistically combining information from all levels."}),e.jsxs("li",{children:["The ",e.jsx("code",{children:"hierarchicalforecast"})," library provides a practical Python toolkit for all major hierarchical forecasting approaches."]})]}),e.jsx(j,{references:Me})]})}const Xe=Object.freeze(Object.defineProperty({__proto__:null,default:Ie},Symbol.toStringTag,{value:"Module"})),Ae=[{name:"Total",base:348,ols:336,wls:338,mint:340,actual:341},{name:"ProdA",base:200,ols:196,wls:197,mint:198,actual:199},{name:"ProdB",base:158,ols:140,wls:141,mint:142,actual:142},{name:"A-North",base:115,ols:112,wls:113,mint:114,actual:113},{name:"A-South",base:88,ols:84,wls:84,mint:85,actual:86},{name:"B-North",base:83,ols:78,wls:79,mint:79,actual:80},{name:"B-South",base:62,ols:62,wls:62,mint:63,actual:62}],Se=`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.holtwinters import ExponentialSmoothing
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)
n = 60   # 5 years monthly

# ── Same 4-bottom hierarchy as previous section ────────────────────────────
def gen(base, trend, amp, noise):
    t = np.arange(n)
    return base + trend*t + amp*np.sin(2*np.pi*t/12) + np.random.normal(0, noise, n)

a_north = gen(100, 0.3, 10, 4)
a_south = gen( 80, 0.2,  8, 3)
b_north = gen( 60, 0.4,  6, 3)
b_south = gen( 40, 0.1,  4, 2)

prod_a = a_north + a_south
prod_b = b_north + b_south
total  = prod_a + prod_b

dates = pd.date_range('2019-01', periods=n, freq='MS')
all_series = np.column_stack([total, prod_a, prod_b, a_north, a_south, b_north, b_south])
labels = ['Total','ProdA','ProdB','A_North','A_South','B_North','B_South']
df = pd.DataFrame(all_series, index=dates, columns=labels)
train, test = df.iloc[:-12], df.iloc[-12:]

# Summing matrix S (7 x 4)
S = np.array([
    [1,1,1,1],
    [1,1,0,0],
    [0,0,1,1],
    [1,0,0,0],
    [0,1,0,0],
    [0,0,1,0],
    [0,0,0,1],
])
n_all, m = S.shape   # 7, 4

def ets_fc(series, h=12):
    mdl = ExponentialSmoothing(series, trend='add', seasonal='add', seasonal_periods=12)
    return mdl.fit(optimized=True).forecast(h)

# ── Base forecasts for ALL 7 series independently ─────────────────────────
base_fc = {}
for col in labels:
    base_fc[col] = ets_fc(train[col])

base_matrix = np.column_stack([base_fc[c].values for c in labels])  # (12 x 7)
yhat = base_matrix.T   # (7 x 12)

print("Base forecasts (incoherent): gap at total level")
gap = base_fc['Total'].values - (base_fc['A_North'].values + base_fc['A_South'].values +
                                   base_fc['B_North'].values + base_fc['B_South'].values)
print(f"  Mean coherence gap: {gap.mean():.4f}")

# ── OLS Reconciliation ────────────────────────────────────────────────────
# P_OLS = S(S'S)^{-1}S' — projects onto the coherent subspace
STS_inv = np.linalg.inv(S.T @ S)
P_ols = S @ STS_inv @ S.T    # (n_all x n_all)
yhat_ols = P_ols @ yhat       # (7 x 12)

# ── WLS Reconciliation ────────────────────────────────────────────────────
# Diagonal weight matrix W = diag(variance of base forecast errors)
# Estimate from in-sample residuals
residuals = np.zeros((n_all, n - 12))
for i, col in enumerate(labels):
    mdl = ExponentialSmoothing(df[col].iloc[:n-12], trend='add', seasonal='add', seasonal_periods=12)
    fit = mdl.fit(optimized=True)
    residuals[i] = fit.resid[-residuals.shape[1]:]

variances = residuals.var(axis=1)
W_diag = np.diag(variances)
W_inv  = np.diag(1.0 / variances)

P_wls = S @ np.linalg.inv(S.T @ W_inv @ S) @ S.T @ W_inv
yhat_wls = P_wls @ yhat

# ── MinT (Minimum Trace) Reconciliation ──────────────────────────────────
# Use shrinkage estimator of full covariance Sigma_h
# Simple version: use sample covariance of residuals
Sigma_hat = np.cov(residuals)   # (7 x 7)
# Shrinkage towards scaled identity (Ledoit-Wolf style, simplified)
shrink = 0.2
n_obs = residuals.shape[1]
Sigma_shrunk = (1 - shrink) * Sigma_hat + shrink * np.trace(Sigma_hat)/n_all * np.eye(n_all)
Sigma_inv = np.linalg.inv(Sigma_shrunk)

P_mint = S @ np.linalg.inv(S.T @ Sigma_inv @ S) @ S.T @ Sigma_inv
yhat_mint = P_mint @ yhat

# ── Verify coherence ──────────────────────────────────────────────────────
for name, yhat_r in [('OLS', yhat_ols), ('WLS', yhat_wls), ('MinT', yhat_mint)]:
    gap = yhat_r[0] - (yhat_r[3] + yhat_r[4] + yhat_r[5] + yhat_r[6])
    print(f"{name} coherence gap (should be ~0): {np.abs(gap).max():.2e}")

# ── Compute accuracy ─────────────────────────────────────────────────────
actual = test[labels].values.T   # (7 x 12)

def rmsse(actual, forecast, train_vals):
    """Root Mean Scaled Squared Error."""
    scale = np.mean(np.diff(train_vals)**2)
    return np.sqrt(np.mean((actual - forecast)**2) / scale)

results = {}
for name, fc in [('Base', yhat), ('OLS', yhat_ols), ('WLS', yhat_wls), ('MinT', yhat_mint)]:
    rmsse_vals = []
    for i, col in enumerate(labels):
        rmsse_vals.append(rmsse(actual[i], fc[i], train[col].values))
    results[name] = rmsse_vals
    print(f"
{name} RMSSE by series:")
    for col, v in zip(labels, rmsse_vals):
        print(f"  {col:<10}: {v:.4f}")

# ── hierarchicalforecast library (full pipeline) ──────────────────────────
try:
    from hierarchicalforecast.utils import aggregate
    from hierarchicalforecast.core import ReconcilerForecasts
    from hierarchicalforecast.methods import (
        BottomUp, TopDown, MinTrace, ERM
    )

    # Build long-format DataFrame
    bottom_cols = ['A_North', 'A_South', 'B_North', 'B_South']
    tag_df = pd.DataFrame({
        'A_North': {'Product': 'A', 'Region': 'North'},
        'A_South': {'Product': 'A', 'Region': 'South'},
        'B_North': {'Product': 'B', 'Region': 'North'},
        'B_South': {'Product': 'B', 'Region': 'South'},
    }).T.reset_index().rename(columns={'index': 'item'})

    long_df = []
    for col in bottom_cols:
        tmp = df[[col]].reset_index().rename(columns={'index':'ds', col:'y'})
        tmp['unique_id'] = col
        long_df.append(tmp)
    Y_df = pd.concat(long_df)

    # Create hierarchy using aggregate utility
    spec = [['Product'], ['Region'], ['Product', 'Region']]
    Y_hier, S_df, tags = aggregate(Y_df, spec)
    print("
hierarchicalforecast: hierarchy created")
    print(f"S matrix shape: {S_df.shape}")

    reconcilers = [
        BottomUp(),
        MinTrace(method='mint_shrink'),
    ]

    print("\\nFor full reconciliation, fit base models and pass to ReconcilerForecasts.")
    print("See: https://nixtlaverse.nixtla.io/hierarchicalforecast/index.html")

except ImportError:
    print("\\nInstall: pip install hierarchicalforecast")

# ── Plot: Total level comparison ─────────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 4))
ax.plot(train['Total'][-24:], label='Train', color='gray')
ax.plot(test['Total'], label='Actual', color='black', linewidth=2)
ax.plot(test.index, yhat[0], label='Base (incoherent)', color='orange', linestyle='--')
ax.plot(test.index, yhat_ols[0], label='OLS reconciled', color='blue', linestyle='-.')
ax.plot(test.index, yhat_mint[0], label='MinT reconciled', color='red', linestyle=':')
ax.set_title('Total-Level Forecast: Base vs Reconciliation Methods')
ax.legend()
plt.tight_layout()
plt.show()
`,we=[{title:"Optimal Combination Forecasts for Hierarchical Time Series",author:"Hyndman, R.J., Ahmed, R.A., Athanasopoulos, G. & Shang, H.L.",year:2011,url:"https://www.tandfonline.com/doi/abs/10.1198/jcgs.2011.09107"},{title:"Fast Computation of Reconciled Forecasts for Hierarchical and Grouped Time Series",author:"Hyndman, R.J., Lee, A.J. & Wang, E.",year:2016,url:"https://www.sciencedirect.com/science/article/pii/S0167947315002723"},{title:"Forecasting: Principles and Practice (3rd ed.) — Forecast Reconciliation",author:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/reconciliation.html"},{title:"Probabilistic Forecast Reconciliation: Properties, Evaluation and Score Optimisation",author:"Panagiotelis, A., Athanasopoulos, G., Gamakumara, P. & Hyndman, R.J.",year:2023,url:"https://doi.org/10.1016/j.ejor.2022.07.040"}];function ke(){const[a,o]=f.useState("ols"),r={ols:{name:"OLS",full:"Ordinary Least Squares",formula:String.raw`\mathbf{P}_{\text{OLS}} = \mathbf{S}(\mathbf{S}'\mathbf{S})^{-1}\mathbf{S}'`,W:String.raw`\mathbf{W} = \mathbf{I}_n`,desc:"Minimises sum of squared adjustments. Equivalent to projecting base forecasts onto the coherent subspace. Does not account for differing accuracies across series."},wls:{name:"WLS",full:"Weighted Least Squares (structural)",formula:String.raw`\mathbf{P}_{\text{WLS}} = \mathbf{S}(\mathbf{S}'\mathbf{W}^{-1}\mathbf{S})^{-1}\mathbf{S}'\mathbf{W}^{-1}`,W:String.raw`\mathbf{W} = \text{diag}(\hat{\sigma}_1^2, \ldots, \hat{\sigma}_n^2)`,desc:"Down-weights series with high forecast variance. The structural (series-count) version uses the number of bottom-level series aggregated to each level as weights."},mint_sample:{name:"MinT (sample)",full:"Minimum Trace (sample covariance)",formula:String.raw`\mathbf{P}_{\text{MinT}} = \mathbf{S}(\mathbf{S}'\hat{\boldsymbol{\Sigma}}_h^{-1}\mathbf{S})^{-1}\mathbf{S}'\hat{\boldsymbol{\Sigma}}_h^{-1}`,W:String.raw`\mathbf{W} = \hat{\boldsymbol{\Sigma}}_h \text{ (full covariance)}`,desc:"Uses the full covariance matrix of base forecast errors, accounting for cross-series correlations. Requires sufficient in-sample residuals to estimate the covariance well."},mint_shrink:{name:"MinT (shrink)",full:"Minimum Trace (shrinkage)",formula:String.raw`\hat{\boldsymbol{\Sigma}}_h^* = \lambda \hat{\mathbf{D}} + (1-\lambda)\hat{\boldsymbol{\Sigma}}_h`,W:String.raw`\hat{\boldsymbol{\Sigma}}_h^* \text{ (shrunk towards diagonal)}`,desc:"Shrinks the sample covariance towards a diagonal (Ledoit-Wolf style), regularising the estimate when n is large relative to T. The most robust MinT variant in practice."}},s=r[a];return e.jsxs(x,{title:"Forecast Reconciliation",difficulty:"advanced",readingTime:13,children:[e.jsxs("p",{children:["Independently forecasting each series in a hierarchy almost never produces coherent forecasts — the bottom-level forecasts will not sum to the top-level forecast."," ",e.jsx("strong",{children:"Forecast reconciliation"})," adjusts a set of base forecasts to satisfy the summing constraints, while minimising the information lost in the adjustment. Modern reconciliation methods (Hyndman et al., 2011) frame this as a weighted least squares problem, leading to a unified theory that nests bottom-up and top-down as special cases."]}),e.jsxs(y,{term:"Reconciled Forecast",children:["Given incoherent base forecasts ",e.jsx(t.InlineMath,{math:"\\hat{\\mathbf{y}}_h"})," for all"," ",e.jsx(t.InlineMath,{math:"n"})," series, a ",e.jsx("strong",{children:"reconciled forecast"})," takes the form:",e.jsx(t.BlockMath,{math:"\\tilde{\\mathbf{y}}_h = \\mathbf{S}\\mathbf{P}\\hat{\\mathbf{y}}_h"}),"where ",e.jsx(t.InlineMath,{math:"\\mathbf{P}"})," is an ",e.jsx(t.InlineMath,{math:"m \\times n"})," matrix that maps all base forecasts to the ",e.jsx(t.InlineMath,{math:"m"})," bottom-level series, and"," ",e.jsx(t.InlineMath,{math:"\\mathbf{S}"})," then re-aggregates to all ",e.jsx(t.InlineMath,{math:"n"})," levels. By construction, ",e.jsx(t.InlineMath,{math:"\\tilde{\\mathbf{y}}_h = \\mathbf{S}\\mathbf{b}_h"})," for the bottom-level reconciled forecast ",e.jsx(t.InlineMath,{math:"\\mathbf{b}_h = \\mathbf{P}\\hat{\\mathbf{y}}_h"}),", so all reconciled forecasts are coherent."]}),e.jsx("h2",{children:"The General Reconciliation Framework"}),e.jsx("p",{children:"Hyndman et al. (2011) show that the optimal linear unbiased reconciled forecast minimises the trace of the reconciled forecast error covariance matrix. The solution is:"}),e.jsx(t.BlockMath,{math:"\\mathbf{P} = (\\mathbf{S}'\\mathbf{W}_h^{-1}\\mathbf{S})^{-1}\\mathbf{S}'\\mathbf{W}_h^{-1}"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\mathbf{W}_h"})," is the ",e.jsx(t.InlineMath,{math:"n \\times n"})," ","covariance matrix of the ",e.jsx(t.InlineMath,{math:"h"}),"-step base forecast errors. Different choices of ",e.jsx(t.InlineMath,{math:"\\mathbf{W}_h"})," give different reconciliation methods:"]}),e.jsxs("div",{style:{margin:"1.5rem 0"},children:[e.jsx("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"1rem"},children:Object.entries(r).map(([i,n])=>e.jsx("button",{onClick:()=>o(i),style:{padding:"0.4rem 1.1rem",background:a===i?"#7c3aed":"#ede9fe",color:a===i?"white":"#5b21b6",border:`1px solid ${a===i?"#6d28d9":"#c4b5fd"}`,borderRadius:"6px",cursor:"pointer",fontWeight:a===i?"bold":"normal"},children:n.name},i))}),e.jsxs("div",{style:{padding:"1.25rem",background:"#faf5ff",borderRadius:"8px",border:"1px solid #e9d5ff"},children:[e.jsx("strong",{children:s.full}),e.jsx("p",{style:{marginTop:"0.5rem",fontSize:"0.9rem"},children:s.desc}),e.jsx(t.BlockMath,{math:s.formula}),e.jsxs("p",{style:{fontSize:"0.85rem",color:"#6b21a8"},children:["Weight matrix: ",e.jsx(t.InlineMath,{math:s.W})]})]})]}),e.jsxs(I,{title:"Unbiasedness of WLS Reconciliation",proof:"If the base forecasts are unbiased (E[hat{y}_h] = y_h), then SP*E[hat{y}_h] = SP*y_h = S*P*S*b_h. For reconciliation to preserve unbiasedness we need SPS = S, i.e., P is a left-inverse of S. The WLS solution P=(S'W^{-1}S)^{-1}S'W^{-1} satisfies SPS=S because S(S'W^{-1}S)^{-1}S'W^{-1}S = S*I = S.",children:["If the base forecasts ",e.jsx(t.InlineMath,{math:"\\hat{\\mathbf{y}}_h"})," are unbiased, then the WLS reconciled forecasts ",e.jsx(t.InlineMath,{math:"\\tilde{\\mathbf{y}}_h = \\mathbf{SP}\\hat{\\mathbf{y}}_h"})," ","are also unbiased for any positive-definite weight matrix ",e.jsx(t.InlineMath,{math:"\\mathbf{W}"}),", provided ",e.jsx(t.InlineMath,{math:"\\mathbf{SPS} = \\mathbf{S}"})," — a condition satisfied by the WLS estimator of ",e.jsx(t.InlineMath,{math:"\\mathbf{P}"}),"."]}),e.jsxs("div",{style:{margin:"1.5rem 0",padding:"1rem",background:"#faf5ff",borderRadius:"8px",border:"1px solid #e9d5ff"},children:[e.jsx("h3",{style:{fontWeight:600,marginBottom:"0.75rem",fontSize:"0.95rem"},children:"Base vs Reconciled Forecasts (Illustrative)"}),e.jsx(C,{width:"100%",height:260,children:e.jsxs(K,{data:Ae,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(T,{strokeDasharray:"3 3"}),e.jsx(R,{dataKey:"name"}),e.jsx(F,{}),e.jsx(B,{}),e.jsx(D,{}),e.jsx(M,{dataKey:"base",fill:"#f97316",name:"Base (incoherent)"}),e.jsx(M,{dataKey:"ols",fill:"#2563eb",name:"OLS reconciled"}),e.jsx(M,{dataKey:"mint",fill:"#7c3aed",name:"MinT reconciled"}),e.jsx(M,{dataKey:"actual",fill:"#374151",name:"Actual"})]})}),e.jsx("p",{style:{fontSize:"0.8rem",color:"#64748b",marginTop:"0.5rem"},children:"Base forecasts are incoherent (ProdA+ProdB ≠ Total). All reconciled forecasts are coherent by construction; MinT stays closest to actuals by leveraging covariance information."})]}),e.jsx("h2",{children:"OLS Reconciliation"}),e.jsxs("p",{children:["Setting ",e.jsx(t.InlineMath,{math:"\\mathbf{W} = \\mathbf{I}_n"})," gives the OLS reconciliation, which minimises ",e.jsx(t.InlineMath,{math:"\\|\\hat{\\mathbf{y}}_h - \\tilde{\\mathbf{y}}_h\\|^2"})," ","(the total squared adjustment). Geometrically, it orthogonally projects the base forecast vector onto the coherent subspace ",e.jsx(t.InlineMath,{math:"\\{\\mathbf{Sb} : \\mathbf{b} \\in \\mathbb{R}^m\\}"}),"."]}),e.jsxs(u,{title:"OLS = Ordinary Projection",children:["OLS reconciliation is equivalent to Moore-Penrose pseudo-inverse projection:"," ",e.jsx(t.InlineMath,{math:"\\mathbf{P}_{\\text{OLS}} = \\mathbf{S}(\\mathbf{S}'\\mathbf{S})^{-1}\\mathbf{S}' = \\mathbf{S}\\mathbf{S}^+"})," (when S has full column rank). Bottom-up is also a special case: it corresponds to"," ",e.jsx(t.InlineMath,{math:"\\mathbf{W} = \\text{diag}(\\mathbf{S}\\mathbf{S}')"}),", which assigns zero weight to all but the bottom-level series."]}),e.jsx("h2",{children:"MinT: Minimum Trace Reconciliation"}),e.jsxs("p",{children:["The ",e.jsx("strong",{children:"Minimum Trace (MinT)"})," reconciliation (Wickramasuriya et al., 2019) uses ",e.jsx(t.InlineMath,{math:"\\mathbf{W}_h = \\hat{\\boldsymbol{\\Sigma}}_h"}),", the estimated covariance of the ",e.jsx(t.InlineMath,{math:"h"}),"-step base forecast errors. This produces reconciled forecasts that minimise the total forecast error variance across all series."]}),e.jsx("p",{children:"The trace of the reconciled forecast error covariance is:"}),e.jsx(t.BlockMath,{math:"\\text{tr}(\\mathbf{V}_h) = \\text{tr}\\!\\left[\\mathbf{S}(\\mathbf{S}'\\boldsymbol{\\Sigma}_h^{-1}\\mathbf{S})^{-1}\\mathbf{S}'\\right]"}),e.jsxs("p",{children:["MinT minimises this over all unbiased linear reconciliation matrices ",e.jsx(t.InlineMath,{math:"\\mathbf{P}"}),"."]}),e.jsxs(g,{title:"Estimating the Covariance Matrix",children:["The full covariance estimator requires ",e.jsx(t.InlineMath,{math:"T \\gg n(n+1)/2"})," in-sample residuals to be well-conditioned. For large hierarchies (e.g., n=100), the sample covariance is singular or nearly so. Use:",e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"MinT-shrink:"})," Ledoit-Wolf shrinkage towards diagonal — most robust."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"MinT-ols:"})," Diagonal elements only (set off-diagonal to 0)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"WLS-var:"})," Diagonal of in-sample forecast error variances — simplest reliable option."]})]})]}),e.jsx("h2",{children:"Probabilistic Reconciliation"}),e.jsx("p",{children:"The methods above reconcile point forecasts. For probabilistic forecasts (sample paths, quantiles, or predictive distributions), reconciliation must preserve coherence across the full distribution:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Gaussian reconciliation:"})," If base forecast errors are jointly Gaussian, the reconciled distribution is also Gaussian with reconciled mean and covariance"," ",e.jsx(t.InlineMath,{math:"\\mathbf{V}_h = \\mathbf{SP}\\hat{\\boldsymbol{\\Sigma}}_h\\mathbf{P}'\\mathbf{S}'"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sample-path reconciliation:"})," Apply the reconciliation matrix",e.jsx(t.InlineMath,{math:"\\mathbf{SP}"})," to each simulated path from base forecast simulators. This is the most general method and works for any distributional assumption."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Energy score / variogram optimisation:"})," Panagiotelis et al. (2023) develop proper scoring rules for evaluating and optimising probabilistic reconciliation."]})]}),e.jsxs(b,{title:"Retail Demand Hierarchy: MinT Performance",children:["A retailer has 200 SKUs sold across 4 regions, giving 4 bottom-level series per SKU and aggregate product-category and regional totals — approximately 1,400 series total.",e.jsx("br",{}),e.jsx("br",{}),"Base ETS models forecast each series independently. Reconciliation results (RMSSE relative to bottom-up as baseline):",e.jsxs("ul",{children:[e.jsx("li",{children:"OLS: -4% vs bottom-up (modest improvement)"}),e.jsx("li",{children:"WLS-structural: -8% at bottom, -12% at total"}),e.jsx("li",{children:"MinT-shrink: -15% at bottom, -18% at total (best overall)"})]}),"MinT-shrink consistently outperforms because it accounts for cross-series correlations — e.g., that high forecast errors for A-North correlate with errors for A-South (same product, shared macro drivers), and MinT redistributes the adjustment accordingly."]}),e.jsx("h2",{children:"Practical Considerations"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Base model choice matters:"})," Reconciliation improves coherence but cannot fix poor base forecasts. Use the best possible individual models before reconciling."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cross-validation for W estimation:"})," Estimate ",e.jsx(t.InlineMath,{math:"\\mathbf{W}_h"})," ","from rolling-origin cross-validation residuals for better finite-sample performance."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Non-negative forecasts:"})," Standard reconciliation can produce negative forecasts for intermittent demand series. Post-process by setting negatives to zero, or use constrained reconciliation (available in hierarchicalforecast)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Temporal hierarchies:"})," The same framework applies to temporal aggregation (hourly → daily → monthly → annual), creating Temporal Hierarchies (Athanasopoulos et al., 2017)."]})]}),e.jsx(_,{code:Se,title:"OLS, WLS, and MinT Reconciliation from Scratch + hierarchicalforecast"}),e.jsx("h2",{children:"Summary"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Forecast reconciliation maps incoherent base forecasts to the coherent subspace via"," ",e.jsx(t.InlineMath,{math:"\\tilde{\\mathbf{y}}_h = \\mathbf{SP}\\hat{\\mathbf{y}}_h"}),"."]}),e.jsxs("li",{children:["OLS (",e.jsx(t.InlineMath,{math:"\\mathbf{W}=\\mathbf{I}"}),"), WLS (diagonal weights), and MinT (full covariance) are the main variants, nested in a common WLS framework."]}),e.jsx("li",{children:"MinT-shrink is the recommended default: it uses cross-series covariance information while avoiding singularity through Ledoit-Wolf shrinkage."}),e.jsx("li",{children:"Probabilistic reconciliation extends the framework to full predictive distributions, essential for coherent interval and density forecasts."}),e.jsxs("li",{children:["The ",e.jsx("code",{children:"hierarchicalforecast"})," library provides production-ready implementations of all major point and probabilistic reconciliation methods."]})]}),e.jsx(j,{references:we})]})}const We=Object.freeze(Object.defineProperty({__proto__:null,default:ke},Symbol.toStringTag,{value:"Module"}));export{Pe as a,Ce as b,De as c,Le as d,Ee as e,Ge as f,Ke as g,Xe as h,We as i,qe as s};
