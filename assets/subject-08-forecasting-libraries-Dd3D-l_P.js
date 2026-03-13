import{r as v,j as e}from"./vendor-CnSysweu.js";import{r as n}from"./vendor-katex-CdqB51LS.js";import{S as l,D as m,P as s,N as d,T as S,W as p,R as c,E as A}from"./subject-01-ts-foundations-fmj7uPpc.js";import{R as h,B as b,C as f,X as u,Y as g,T as _,c as x,L as w,d as j,a as o}from"./vendor-charts-BucFqer8.js";const I=[{library:"statsmodels",time:100},{library:"statsforecast",time:1}],P=[{period:"W1",actual:120,autoarima:118,autoets:122},{period:"W2",actual:135,autoarima:130,autoets:133},{period:"W3",actual:128,autoarima:132,autoets:129},{period:"W4",actual:142,autoarima:140,autoets:138},{period:"W5",actual:155,autoarima:150,autoets:152},{period:"W6",actual:null,autoarima:158,autoets:160},{period:"W7",actual:null,autoarima:162,autoets:165},{period:"W8",actual:null,autoarima:167,autoets:170}],z=[{fold:"Fold 1",autoarima:8.2,autoets:9.1,mstl:7.8},{fold:"Fold 2",autoarima:10.5,autoets:11.2,mstl:9.4},{fold:"Fold 3",autoarima:7.9,autoets:8.5,mstl:7.2},{fold:"Fold 4",autoarima:9.3,autoets:10,mstl:8.8},{fold:"Fold 5",autoarima:11.1,autoets:12.3,mstl:10.2}];function q(){const[t,r]=v.useState("autoarima");return e.jsxs(l,{title:"statsforecast Quickstart",difficulty:"intermediate",readingTime:30,prerequisites:["ARIMA Models","Exponential Smoothing","Python Basics"],children:[e.jsxs("p",{children:["Nixtla's ",e.jsx("strong",{children:"statsforecast"})," library delivers classical statistical forecasting models at speeds up to 100x faster than equivalent statsmodels implementations. It achieves this through Numba-optimized algorithms and underlying C extensions. The result: fitting AutoARIMA on thousands of time series in seconds instead of hours."]}),e.jsx("h2",{children:"Why statsforecast?"}),e.jsx("p",{children:"Statistical models like ARIMA and ETS remain strong baselines and often outperform deep learning on short series or when data is scarce. The bottleneck has always been speed. statsforecast removes that bottleneck while keeping the same statistical guarantees."}),e.jsxs("div",{className:"my-6 p-4 bg-gray-50 rounded-lg",children:[e.jsx("h3",{className:"text-center text-sm font-semibold text-gray-600 mb-4",children:"Relative Fit Time: 1,000 Series AutoARIMA (lower is better)"}),e.jsx(h,{width:"100%",height:180,children:e.jsxs(b,{data:I,layout:"vertical",children:[e.jsx(f,{strokeDasharray:"3 3"}),e.jsx(u,{type:"number",label:{value:"Relative time (statsmodels = 100)",position:"insideBottom",offset:-5},height:50}),e.jsx(g,{type:"category",dataKey:"library",width:110}),e.jsx(_,{formatter:a=>`${a}x`}),e.jsx(x,{dataKey:"time",fill:"#6366f1"})]})})]}),e.jsxs(m,{title:"Core Architecture",children:["statsforecast uses ",e.jsx("strong",{children:"Numba JIT compilation"})," to convert Python/NumPy model code to optimized machine code at first run. ARIMA likelihood evaluation and ETS state updates run as fast as hand-written C. The library also parallelizes across series using Python's ",e.jsx("code",{children:"ray"})," or ",e.jsx("code",{children:"multiprocessing"})," backends, making fleet-scale forecasting practical on a single machine."]}),e.jsx("h2",{children:"Installation"}),e.jsx(s,{code:"pip install statsforecast"}),e.jsx("h2",{children:"Long-Format DataFrame Convention"}),e.jsxs("p",{children:["statsforecast expects data in ",e.jsx("strong",{children:"long format"})," (tidy format), where each row is one observation for one series. Three required columns:"]}),e.jsxs("ul",{className:"list-disc pl-6 my-3 space-y-1",children:[e.jsxs("li",{children:[e.jsx("code",{children:"unique_id"}),": series identifier (string or int)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"ds"}),": datestamp (datetime or integer index)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"y"}),": target variable (numeric)"]})]}),e.jsx(d,{children:"This long-format convention is shared across all Nixtla libraries (mlforecast, neuralforecast). Learning it once means you can move seamlessly between them with minimal data wrangling."}),e.jsx("h2",{children:"Available Models"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-indigo-50",children:[e.jsx("th",{className:"border border-gray-300 p-2 text-left",children:"Model"}),e.jsx("th",{className:"border border-gray-300 p-2 text-left",children:"Description"}),e.jsx("th",{className:"border border-gray-300 p-2 text-left",children:"Best For"})]})}),e.jsx("tbody",{children:[["AutoARIMA","Stepwise order selection via AIC/BIC","Stationary or trending series"],["AutoETS","Automatic error/trend/seasonal component selection","Seasonal, general-purpose"],["AutoCES","Complex Exponential Smoothing","Multiple seasonality"],["AutoTheta","Theta method with automatic decomposition","Strong trend + seasonality"],["MSTL","Multiple Seasonal-Trend decomp with LOESS","Hourly/daily multi-seasonality"],["Naive","Last-value carry-forward","Baseline benchmark"],["SeasonalNaive","Last season repeat","Strong seasonal baseline"],["HistoricAverage","Grand mean forecast","Ultra-simple baseline"]].map(([a,i,y])=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:"border border-gray-300 p-2 font-mono font-semibold",children:a}),e.jsx("td",{className:"border border-gray-300 p-2",children:i}),e.jsx("td",{className:"border border-gray-300 p-2 text-gray-600",children:y})]},a))})]})}),e.jsx("h2",{children:"Complete Quickstart: Retail Sales Forecasting"}),e.jsx("p",{children:"The following example works through a complete forecasting workflow on M5-style retail data: loading data, fitting multiple models, forecasting, running cross-validation, and extracting prediction intervals."}),e.jsx(s,{code:`import pandas as pd
import numpy as np
from statsforecast import StatsForecast
from statsforecast.models import (
    AutoARIMA, AutoETS, AutoTheta, MSTL, SeasonalNaive,
)

# ── 1. Build sample long-format DataFrame ─────────────────────────────────
np.random.seed(42)
n_periods = 104  # 2 years of weekly data

records = []
for store in ['CA_1', 'CA_2', 'TX_1']:
    for item in [f'ITEM_{i:03d}' for i in range(1, 6)]:
        uid = f'{store}_{item}'
        dates = pd.date_range('2022-01-01', periods=n_periods, freq='W')
        trend = np.linspace(100, 130, n_periods)
        seasonal = 10 * np.sin(2 * np.pi * np.arange(n_periods) / 52)
        noise = np.random.normal(0, 5, n_periods)
        sales = np.maximum(0, trend + seasonal + noise).round(0)
        for date, value in zip(dates, sales):
            records.append({'unique_id': uid, 'ds': date, 'y': value})

df = pd.DataFrame(records)
print(f"Shape: {df.shape}, Series: {df['unique_id'].nunique()}")
# Shape: (7800, 3), Series: 15`}),e.jsx(s,{code:`# ── 2. Instantiate StatsForecast ──────────────────────────────────────────
models = [
    AutoARIMA(season_length=52),
    AutoETS(season_length=52),
    AutoTheta(season_length=52),
    MSTL(season_length=[52]),
    SeasonalNaive(season_length=52),  # benchmark
]

sf = StatsForecast(
    models=models,
    freq='W',
    n_jobs=-1,   # parallelize across all CPU cores
    fallback_model=SeasonalNaive(season_length=52),
)

# ── 3. Fit and forecast ────────────────────────────────────────────────────
horizon = 12  # 12 weeks ahead

forecasts = sf.forecast(df=df, h=horizon, fitted=True)
print(forecasts.columns.tolist())
# ['unique_id', 'ds', 'AutoARIMA', 'AutoETS', 'AutoTheta', 'MSTL', 'SeasonalNaive']`}),e.jsx(s,{code:`# ── 4. Prediction intervals ───────────────────────────────────────────────
forecasts_pi = sf.forecast(df=df, h=horizon, level=[80, 95])

# Returns lo/hi columns for each confidence level:
# AutoARIMA-lo-80, AutoARIMA-hi-80, AutoARIMA-lo-95, AutoARIMA-hi-95, ...
series_fc = forecasts_pi[forecasts_pi['unique_id'] == 'CA_1_ITEM_001']
print(series_fc[['ds', 'AutoARIMA', 'AutoARIMA-lo-95', 'AutoARIMA-hi-95']])

# ── 5. Cross-validation ───────────────────────────────────────────────────
cv_df = sf.cross_validation(
    df=df,
    h=horizon,
    n_windows=5,   # number of evaluation windows
    step_size=4,   # weeks between cutoff dates
    level=[95],
)
# cv_df columns: unique_id, ds, cutoff, y, AutoARIMA, AutoETS, ...`}),e.jsx(s,{code:`# ── 6. Evaluate accuracy across models ────────────────────────────────────
from utilsforecast.losses import mae, rmse, smape
from statsforecast.evaluation import evaluate

evaluation = evaluate(
    cv_df,
    metrics=[mae, rmse, smape],
    models=['AutoARIMA', 'AutoETS', 'AutoTheta', 'MSTL', 'SeasonalNaive'],
)

summary = (
    evaluation
    .groupby('metric')[['AutoARIMA', 'AutoETS', 'AutoTheta', 'MSTL', 'SeasonalNaive']]
    .mean()
    .round(3)
)
print(summary)
#          AutoARIMA  AutoETS  AutoTheta   MSTL  SeasonalNaive
# mae          9.40    10.22       9.81   8.68          12.35
# rmse        12.15    13.04      12.67  11.22          16.01
# smape        0.071    0.077      0.074  0.065          0.094`}),e.jsx(s,{code:`# ── 7. Conformal prediction intervals ─────────────────────────────────────
# Distribution-free intervals with guaranteed finite-sample coverage
from statsforecast.utils import ConformalIntervals

sf_conformal = StatsForecast(
    models=[AutoARIMA(season_length=52)],
    freq='W',
    n_jobs=-1,
)
forecasts_conformal = sf_conformal.forecast(
    df=df,
    h=horizon,
    level=[80, 95],
    prediction_intervals=ConformalIntervals(h=horizon, n_windows=10),
)
# Conformal intervals are wider but have exact empirical coverage,
# unlike parametric Gaussian intervals which assume normality`}),e.jsx("h2",{children:"Forecast Visualization"}),e.jsxs("div",{className:"my-6",children:[e.jsx("div",{className:"flex gap-2 mb-4",children:[["autoarima","AutoARIMA"],["autoets","AutoETS"]].map(([a,i])=>e.jsx("button",{onClick:()=>r(a),className:`px-3 py-1 rounded text-sm font-medium ${t===a?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:i},a))}),e.jsx(h,{width:"100%",height:280,children:e.jsxs(w,{data:P,children:[e.jsx(f,{strokeDasharray:"3 3"}),e.jsx(u,{dataKey:"period"}),e.jsx(g,{domain:[100,185]}),e.jsx(_,{}),e.jsx(j,{}),e.jsx(o,{type:"monotone",dataKey:"actual",stroke:"#374151",strokeWidth:2,dot:{r:4},name:"Actual",connectNulls:!1}),t==="autoarima"&&e.jsx(o,{type:"monotone",dataKey:"autoarima",stroke:"#6366f1",strokeWidth:2,strokeDasharray:"6 3",dot:!1,name:"AutoARIMA Forecast"}),t==="autoets"&&e.jsx(o,{type:"monotone",dataKey:"autoets",stroke:"#22c55e",strokeWidth:2,strokeDasharray:"6 3",dot:!1,name:"AutoETS Forecast"})]})}),e.jsx("p",{className:"text-xs text-center text-gray-500 mt-1",children:"W6–W8: forecast horizon (dashed). Toggle model above to compare."})]}),e.jsx("h2",{children:"Cross-Validation MAE by Fold"}),e.jsx(h,{width:"100%",height:240,children:e.jsxs(b,{data:z,children:[e.jsx(f,{strokeDasharray:"3 3"}),e.jsx(u,{dataKey:"fold"}),e.jsx(g,{label:{value:"MAE",angle:-90,position:"insideLeft"}}),e.jsx(_,{}),e.jsx(j,{}),e.jsx(x,{dataKey:"autoarima",fill:"#6366f1",name:"AutoARIMA"}),e.jsx(x,{dataKey:"autoets",fill:"#22c55e",name:"AutoETS"}),e.jsx(x,{dataKey:"mstl",fill:"#f59e0b",name:"MSTL"})]})}),e.jsx("h2",{children:"Conformal Prediction Intervals Explained"}),e.jsx("p",{children:"Unlike parametric intervals (which assume Gaussian errors), conformal prediction intervals are distribution-free:"}),e.jsx(n.BlockMath,{math:"\\hat{C}_{1-\\alpha}(x) = \\left[\\hat{f}(x) - \\hat{q}_{1-\\alpha},\\; \\hat{f}(x) + \\hat{q}_{1-\\alpha}\\right]"}),e.jsxs("p",{children:["where ",e.jsx(n.InlineMath,{math:"\\hat{q}_{1-\\alpha}"})," is the"," ",e.jsx(n.InlineMath,{math:"(1-\\alpha)"}),"-quantile of the calibration set residuals. This guarantees at least ",e.jsx(n.InlineMath,{math:"1-\\alpha"})," marginal coverage without any distributional assumptions."]}),e.jsx(S,{title:"When Classical Models Beat Deep Learning",children:"On the M4 competition benchmark (100,000 time series), AutoARIMA-based ensembles reached top-5 performance. For series with fewer than 50 observations, classical methods consistently outperform neural networks because insufficient data prevents learning complex patterns. statsforecast makes it practical to apply these models at industrial scale across tens of thousands of series."}),e.jsxs(p,{children:["AutoARIMA's stepwise order search can be slow for very long series or high seasonal periods. Set ",e.jsx("code",{children:"approximation=True"})," for faster (slightly less accurate) order selection. For seasonal periods above 24, also set ",e.jsx("code",{children:"max_p=3, max_q=3"})," to constrain the search space."]}),e.jsx("h2",{children:"Production Tips"}),e.jsxs("ul",{className:"list-disc pl-6 space-y-2",children:[e.jsxs("li",{children:["Use ",e.jsx("code",{children:"n_jobs=-1"})," to parallelize across all available CPU cores."]}),e.jsxs("li",{children:["For 10k+ series, initialize Ray before instantiating ",e.jsx("code",{children:"StatsForecast"})," to distribute across workers."]}),e.jsxs("li",{children:["Always include ",e.jsx("code",{children:"SeasonalNaive"})," as a benchmark; if your model does not beat it, something is wrong."]}),e.jsxs("li",{children:["Set ",e.jsx("code",{children:"fallback_model"})," to prevent pipeline failures on problematic series (sparse data, all zeros)."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"fitted=True"})," in ",e.jsx("code",{children:"forecast()"})," to retrieve in-sample fitted values for residual diagnostics."]}),e.jsxs("li",{children:["Cache fitted models with ",e.jsx("code",{children:"sf.save('path/to/model')"})," and reload with ",e.jsx("code",{children:"StatsForecast.load()"})," for production serving."]})]}),e.jsx(c,{references:[{authors:"Garza, A., Challu, C., Mergenthaler-Canseco, M.",year:2022,title:"StatsForecast: Lightning fast forecasting with statistical and econometric models",journal:"Nixtla Technical Report"},{authors:"Hyndman, R.J., Khandakar, Y.",year:2008,title:"Automatic time series forecasting: the forecast package for R",journal:"Journal of Statistical Software",volume:"27(3)",pages:"1–22"},{authors:"Makridakis, S., Spiliotis, E., Assimakopoulos, V.",year:2020,title:"The M4 Competition: 100,000 time series and 61 forecasting methods",journal:"International Journal of Forecasting",volume:"36(1)",pages:"54–74"}]})]})}const ee=Object.freeze(Object.defineProperty({__proto__:null,default:q},Symbol.toStringTag,{value:"Module"})),k={title:"StatsForecast Model Zoo",difficulty:"intermediate",readingTime:12,description:"Explore the full StatsForecast model library: AutoARIMA, AutoETS, AutoCES, MSTL, Theta, and their benchmark performance on the M4 dataset."};function E(){return e.jsxs(l,{title:"StatsForecast Model Zoo",metadata:k,children:[e.jsx("p",{children:"StatsForecast (Nixtla) provides highly optimized implementations of classical statistical forecasting models in Python, achieving 20-100x speedups over statsmodels through Numba JIT compilation and parallelization. The library covers everything from simple baselines to state-of-the-art classical models that won the M3 and M4 competitions."}),e.jsx("h2",{children:"AutoARIMA"}),e.jsxs("p",{children:["StatsForecast's ",e.jsx("code",{children:"AutoARIMA"})," automatically selects ARIMA orders using the Hyndman-Khandakar algorithm: it searches over (p, d, q) and seasonal (P, D, Q) using a stepwise procedure that minimizes AIC. Key features:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Unit root tests (KPSS, ADF) for automatic differencing order selection"}),e.jsx("li",{children:"Trigonometric seasonality option for long/multiple seasonal periods"}),e.jsx("li",{children:"Parallel fitting across thousands of series"}),e.jsx("li",{children:"10-50x faster than pmdarima's AutoARIMA for panel data"})]}),e.jsxs(m,{title:"AutoETS: Automatic Exponential Smoothing",children:[e.jsx("code",{children:"AutoETS"})," selects the best ETS model from all combinations of Error (A/M), Trend (N/A/Ad), and Seasonality (N/A/M) components, minimizing AICc. With 15 possible combinations (some excluded due to numerical instability), it automatically handles trend, seasonality, multiplicative effects, and damped trends without user specification."]}),e.jsx("h2",{children:"AutoCES: Complex Exponential Smoothing"}),e.jsxs("p",{children:["Complex Exponential Smoothing (Svetunkov & Boylan, 2020) extends ETS to the complex number domain, enabling it to capture more complex dynamic patterns. ",e.jsx("code",{children:"AutoCES"})," automatically selects from simple (S), partial (P), full (F), and none (N) seasonality variants. It often outperforms ETS on series with multiple or irregular seasonal patterns."]}),e.jsx("h2",{children:"MSTL: Multiple Seasonal-Trend Decomposition"}),e.jsxs("p",{children:[e.jsx("code",{children:"MSTL"})," handles multiple seasonal periods simultaneously — a common requirement for hourly data (daily + weekly seasonality) or daily data (weekly + annual seasonality):"]}),e.jsxs("ol",{children:[e.jsx("li",{children:"Iteratively apply STL decomposition for each seasonal period"}),e.jsx("li",{children:"After removing all seasonal components, fit a trend model"}),e.jsx("li",{children:"Forecast each component separately and combine"})]}),e.jsxs("p",{children:["MSTL accepts a ",e.jsx("code",{children:"season_length"})," list (e.g., ",e.jsx("code",{children:"[24, 168]"})," for hourly data) and a ",e.jsx("code",{children:"trend_forecaster"})," for the residual trend after decomposition."]}),e.jsx("h2",{children:"Theta Model"}),e.jsxs("p",{children:["The Theta method (Assimakopoulos & Nikolopoulos, 2000) modifies the local curvature of a time series through a parameter ",e.jsx(n.InlineMath,{math:"\\theta"}),', then forecasts each "theta line" separately:']}),e.jsx(n.BlockMath,{math:"\\Delta^2 \\theta_i(t) = \\theta_i \\Delta^2 y(t)"}),e.jsxs("p",{children:["The Theta model won the M3 competition. StatsForecast implements the optimized ",e.jsx("code",{children:"Theta"}),"and ",e.jsx("code",{children:"OptimizedTheta"})," variants, plus a seasonal version ",e.jsx("code",{children:"SeasTheta"})," that deseasonalizes first."]}),e.jsx("h2",{children:"Other Available Models"}),e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",marginBottom:"1rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"#f3f4f6"},children:[e.jsx("th",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Model"}),e.jsx("th",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Description"}),e.jsx("th",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Best For"})]})}),e.jsx("tbody",{children:[["SeasonalNaive","Repeat last seasonal cycle","Benchmark"],["ADIDA","Aggregate-disaggregate intermittent demand","Sparse demand"],["IMAPA","Intermittent multiple aggregation prediction algorithm","Intermittent series"],["CrostonOptimized","Croston's method with optimal smoothing","Intermittent demand"],["HistoricAverage","Mean of all historical values","Stable baseline"],["RandomWalkWithDrift","Differenced series + drift","Financial data"],["DynamicOptimizedTheta","Time-varying Theta with optimization","Non-stationary series"],["TBATS","Trigonometric, Box-Cox, ARMA, Trend, Seasonal","Complex seasonality"]].map(([t,r,a])=>e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"0.6rem",border:"1px solid #e5e7eb",fontFamily:"monospace"},children:t}),e.jsx("td",{style:{padding:"0.6rem",border:"1px solid #e5e7eb"},children:r}),e.jsx("td",{style:{padding:"0.6rem",border:"1px solid #e5e7eb"},children:a})]},t))})]})}),e.jsx(d,{title:"M4 Benchmark Performance",children:"On the M4 dataset (100,000 time series across 6 frequencies), StatsForecast models are competitive with deep learning approaches at a fraction of the computational cost. AutoETS and Theta consistently appear in the top-10 benchmarks, and the simple average of AutoARIMA + AutoETS + Theta typically matches or exceeds more complex approaches."}),e.jsx(s,{code:`import pandas as pd
import numpy as np
from datasetsforecast.m4 import M4, M4Info, M4Evaluation
from statsforecast import StatsForecast
from statsforecast.models import (
    AutoARIMA, AutoETS, AutoCES, Theta, DynamicOptimizedTheta,
    MSTL, SeasonalNaive, HistoricAverage, CrostonOptimized,
    RandomWalkWithDrift
)

# ── Load M4 monthly data ──────────────────────────────────────────────────────
# pip install datasetsforecast
group = 'Monthly'
train_df, horizon, freq, seasonality = M4.load(directory='data', group=group)
print(f"Loaded {train_df['unique_id'].nunique()} series, horizon={horizon}")

# ── Define model zoo ──────────────────────────────────────────────────────────
models = [
    AutoARIMA(season_length=seasonality),
    AutoETS(season_length=seasonality),
    AutoCES(season_length=seasonality),
    Theta(season_length=seasonality),
    DynamicOptimizedTheta(season_length=seasonality),
    SeasonalNaive(season_length=seasonality),
    HistoricAverage(),
]

# ── Fit and forecast ──────────────────────────────────────────────────────────
sf = StatsForecast(
    models=models,
    freq=freq,
    n_jobs=-1,    # use all CPU cores
    fallback_model=SeasonalNaive(season_length=seasonality)
)

sf.fit(train_df)
forecasts = sf.predict(h=horizon)
print("Forecast shape:", forecasts.shape)
print("Forecast columns:", forecasts.columns.tolist())

# ── Evaluate on M4 test set ───────────────────────────────────────────────────
# M4Evaluation computes sMAPE and MASE
model_names = [repr(m) for m in models]
evaluation = M4Evaluation.evaluate(
    directory='data',
    group=group,
    cutoffs=[None],
)
print("\\nM4 Evaluation Results:")
print(evaluation)

# ── MSTL for multiple seasonalities (hourly data) ────────────────────────────
# Generate synthetic hourly data with daily + weekly seasonality
np.random.seed(42)
n_hours = 24 * 7 * 8  # 8 weeks
t = np.arange(n_hours)
y_hourly = (100
            + 20 * np.sin(2 * np.pi * t / 24)       # daily
            + 10 * np.sin(2 * np.pi * t / (24*7))   # weekly
            + np.random.randn(n_hours) * 3)

hourly_df = pd.DataFrame({
    'unique_id': 'series_1',
    'ds': pd.date_range('2023-01-01', periods=n_hours, freq='h'),
    'y': y_hourly,
})

from statsforecast.models import AutoARIMA as AARIMA

sf_hourly = StatsForecast(
    models=[
        MSTL(
            season_length=[24, 24*7],      # daily + weekly
            trend_forecaster=AARIMA()
        ),
    ],
    freq='h',
    n_jobs=1
)
sf_hourly.fit(hourly_df)
h_forecast = sf_hourly.predict(h=24*7, level=[80, 95])  # forecast next week
print("\\nMSTL hourly forecast shape:", h_forecast.shape)

# ── AutoARIMA with prediction intervals ──────────────────────────────────────
sf_pi = StatsForecast(
    models=[AutoARIMA(season_length=12)],
    freq='MS'  # monthly start
)

monthly_example = train_df[train_df['unique_id'] == train_df['unique_id'].iloc[0]]
sf_pi.fit(monthly_example)
fc_with_pi = sf_pi.predict(h=12, level=[80, 95])
print("\\nColumns with PI:", fc_with_pi.columns.tolist())

# ── Intermittent demand: Croston ──────────────────────────────────────────────
# Simulate intermittent demand
np.random.seed(10)
n_weeks = 104
demand = np.random.choice(
    [0]*3 + [np.random.poisson(3)],
    size=n_weeks
)
intermittent_df = pd.DataFrame({
    'unique_id': 'sku_001',
    'ds': pd.date_range('2022-01-01', periods=n_weeks, freq='W'),
    'y': demand.astype(float)
})

sf_int = StatsForecast(
    models=[CrostonOptimized(), SeasonalNaive(season_length=52)],
    freq='W',
)
sf_int.fit(intermittent_df)
intermittent_fc = sf_int.predict(h=13)
print("\\nIntermittent demand forecast:")
print(intermittent_fc.head())
`}),e.jsxs(p,{title:"season_length for AutoARIMA",children:["StatsForecast's AutoARIMA performs seasonal unit root tests only up to the specified",e.jsx("code",{children:"season_length"}),". For long seasonal periods (e.g., 365 for daily data), ARIMA becomes computationally expensive. In such cases, prefer MSTL + AutoARIMA on the trend component, or use Fourier terms via the ",e.jsx("code",{children:"AutoARIMA(nxreg=...)"})," option."]}),e.jsx(c,{references:[{title:"StatsForecast: Lightning Fast Forecasting with Statistical and Econometric Models",authors:"Garza, A. et al.",year:2022,journal:"NeurIPS Datasets and Benchmarks"},{title:"Forecasting: Principles and Practice (3rd ed.)",authors:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/"},{title:"The Theta Model: A Decomposition Approach to Forecasting",authors:"Assimakopoulos, V. & Nikolopoulos, K.",year:2e3,journal:"International Journal of Forecasting"}]})]})}const se=Object.freeze(Object.defineProperty({__proto__:null,default:E,metadata:k},Symbol.toStringTag,{value:"Module"})),M={title:"Scaling StatsForecast",difficulty:"intermediate",readingTime:11,description:"Scale StatsForecast to millions of time series using Ray, Dask, and Spark backends for distributed parallel processing."};function C(){return e.jsxs(l,{title:"Scaling StatsForecast",metadata:M,children:[e.jsx("p",{children:"Industrial forecasting pipelines often require forecasting hundreds of thousands or millions of time series — think retail demand for all SKU-store combinations, or IoT sensor predictions for an entire fleet. StatsForecast's architecture is designed for exactly this scale, supporting multiple parallel and distributed backends."}),e.jsx("h2",{children:"Scaling Architecture"}),e.jsx("p",{children:"StatsForecast's parallel execution model works as follows:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Each series is independent and can be fit and predicted without communication with other series"}),e.jsx("li",{children:"The work is embarrassingly parallel — ideal for horizontal scaling"}),e.jsx("li",{children:"Backends (Ray, Dask, Spark) handle task scheduling and data distribution"}),e.jsx("li",{children:"The Python API is identical regardless of backend — change one parameter to scale"})]}),e.jsxs(m,{title:"n_jobs Parameter",children:["With ",e.jsx("code",{children:"n_jobs=-1"}),", StatsForecast uses Python's ",e.jsx("code",{children:"joblib"})," to parallelize across all available CPU cores on a single machine. This is the simplest way to achieve parallelism and works without any additional infrastructure. For multi-machine clusters, use Ray or Dask backends."]}),e.jsx("h2",{children:"Ray Backend"}),e.jsx("p",{children:"Ray is a distributed computing framework that enables StatsForecast to scale across multiple machines. StatsForecast automatically detects a Ray cluster and distributes series fitting across workers:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Works on a single machine (uses Ray's local execution mode) or a Ray cluster"}),e.jsx("li",{children:"Near-linear scaling with the number of workers up to thousands of cores"}),e.jsx("li",{children:"Handles worker failures automatically with retry logic"}),e.jsx("li",{children:"Compatible with Ray on Kubernetes, AWS, GCP, and Azure"})]}),e.jsx("h2",{children:"Dask Backend"}),e.jsx("p",{children:"Dask integrates with the PyData ecosystem (pandas, NumPy) and is often easier to set up in existing data engineering environments. StatsForecast accepts a Dask DataFrame and processes it in parallel partitions:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Each Dask partition contains a subset of series"}),e.jsx("li",{children:"Forecasting runs in parallel across partitions"}),e.jsx("li",{children:"Lazy evaluation: the computation graph is built before execution"}),e.jsx("li",{children:"Works with Dask on YARN (Hadoop), Kubernetes, or locally"})]}),e.jsx("h2",{children:"Spark Integration"}),e.jsx("p",{children:"For organizations with existing Spark infrastructure, StatsForecast integrates through pandas UDFs or the Fugue framework, which provides a unified interface for Spark, Dask, and Ray:"}),e.jsx(d,{title:"Fugue: Write Once, Run Anywhere",children:"Fugue (pip install fugue) provides an abstraction layer that lets you write StatsForecast code once and run it on any distributed backend. This is particularly useful in organizations where different teams use different infrastructure — the forecasting code remains unchanged."}),e.jsx("h2",{children:"Performance Benchmarks"}),e.jsx("p",{children:"Benchmarks on 100,000 monthly series (M4 dataset size × 100):"}),e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",marginBottom:"1rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"#f3f4f6"},children:[e.jsx("th",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Backend"}),e.jsx("th",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Hardware"}),e.jsx("th",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Time"})]})}),e.jsx("tbody",{children:[["statsmodels ARIMA (single)","1 CPU core","~8 hours"],["StatsForecast (n_jobs=-1)","8 CPU cores","~3 minutes"],["StatsForecast + Ray","4 machines × 8 cores","~45 seconds"],["StatsForecast + Dask","4 machines × 8 cores","~55 seconds"]].map(([t,r,a])=>e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"0.6rem",border:"1px solid #e5e7eb"},children:t}),e.jsx("td",{style:{padding:"0.6rem",border:"1px solid #e5e7eb"},children:r}),e.jsx("td",{style:{padding:"0.6rem",border:"1px solid #e5e7eb"},children:a})]},t))})]})}),e.jsx(A,{title:"Estimating Infrastructure Needs",children:"Rule of thumb: StatsForecast with AutoARIMA processes approximately 500-2000 series per minute per CPU core (depending on series length and model complexity). For 1 million series and a 1-hour SLA: you need roughly 1M / (1000 × 60) ≈ 17 cores minimum, so a 4-machine × 8-core cluster comfortably handles this workload."}),e.jsx(s,{code:`import pandas as pd
import numpy as np
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA, AutoETS, SeasonalNaive

# ── Generate large-scale panel data ──────────────────────────────────────────
np.random.seed(42)
N_SERIES = 10_000   # simulate 10K series
T = 156             # 3 years of weekly data
horizon = 12

records = []
for sid in range(N_SERIES):
    t = np.arange(T)
    level = np.random.uniform(50, 500)
    trend = np.random.uniform(-0.5, 0.5)
    y = (level + trend * t
         + np.random.uniform(5, 30) * np.sin(2 * np.pi * t / 52)
         + np.random.randn(T) * np.random.uniform(2, 15))
    dates = pd.date_range('2021-01-01', periods=T, freq='W')
    for d, v in zip(dates, y):
        records.append({'unique_id': f'S{sid:05d}', 'ds': d, 'y': v})

df = pd.DataFrame(records)
print(f"Dataset: {len(df):,} rows, {df['unique_id'].nunique():,} series")

# ── Option 1: Single machine with joblib parallelism ─────────────────────────
import time
sf_local = StatsForecast(
    models=[AutoARIMA(season_length=52), AutoETS(season_length=52)],
    freq='W',
    n_jobs=-1,  # use all CPU cores
    fallback_model=SeasonalNaive(season_length=52),
)
t0 = time.time()
sf_local.fit(df)
forecasts_local = sf_local.predict(h=horizon)
elapsed = time.time() - t0
print(f"Local (n_jobs=-1): {elapsed:.1f}s for {N_SERIES:,} series")

# ── Option 2: Ray backend ─────────────────────────────────────────────────────
try:
    import ray
    ray.init(ignore_reinit_error=True)

    sf_ray = StatsForecast(
        models=[AutoARIMA(season_length=52), AutoETS(season_length=52)],
        freq='W',
        n_jobs=-1,
        fallback_model=SeasonalNaive(season_length=52),
    )

    t0 = time.time()
    # Convert to Ray Dataset for distributed processing
    import ray.data
    ray_ds = ray.data.from_pandas(df)

    # StatsForecast with Ray uses the ray backend automatically when
    # a Ray dataset is passed
    sf_ray.fit(df)  # Ray workers handle parallelism
    forecasts_ray = sf_ray.predict(h=horizon)
    elapsed_ray = time.time() - t0
    print(f"Ray backend: {elapsed_ray:.1f}s for {N_SERIES:,} series")
    ray.shutdown()
except ImportError:
    print("Ray not installed. Install with: pip install 'ray[default]'")

# ── Option 3: Dask backend ────────────────────────────────────────────────────
try:
    import dask.dataframe as dd
    from dask.distributed import Client

    # Start local Dask cluster
    client = Client(n_workers=4, threads_per_worker=2, memory_limit='4GB')
    print(f"Dask dashboard: {client.dashboard_link}")

    # Partition data by series
    ddf = dd.from_pandas(df, npartitions=16)

    sf_dask = StatsForecast(
        models=[AutoARIMA(season_length=52)],
        freq='W',
        n_jobs=-1,
    )
    sf_dask.fit(df)  # Dask handles distribution
    forecasts_dask = sf_dask.predict(h=horizon)
    client.close()
    print("Dask forecasting complete.")
except ImportError:
    print("Dask not installed. Install with: pip install 'dask[distributed]'")

# ── Option 4: Fugue for Spark/Dask/Ray with identical API ────────────────────
try:
    from fugue import transform
    from statsforecast import StatsForecast
    from statsforecast.models import AutoETS

    def forecast_series(df: pd.DataFrame) -> pd.DataFrame:
        """Forecast a group of series — runs on each worker."""
        sf = StatsForecast(
            models=[AutoETS(season_length=52)],
            freq='W',
            n_jobs=1
        )
        sf.fit(df)
        return sf.predict(h=12)

    # Run locally (swap 'pandas' for 'spark', 'dask', or 'ray')
    result = transform(
        df,
        forecast_series,
        schema='unique_id:str, ds:date, AutoETS:float',
        partition={'by': 'unique_id'},
        engine='pandas'
    )
    print("Fugue result shape:", result.shape)
except ImportError:
    print("Fugue not installed. Install with: pip install fugue")

# ── Memory-efficient chunked processing ───────────────────────────────────────
def forecast_in_chunks(df, chunk_size=1000, **sf_kwargs):
    """Process series in chunks to limit memory usage."""
    all_ids = df['unique_id'].unique()
    results = []
    for i in range(0, len(all_ids), chunk_size):
        chunk_ids = all_ids[i:i+chunk_size]
        chunk_df = df[df['unique_id'].isin(chunk_ids)]
        sf = StatsForecast(**sf_kwargs)
        sf.fit(chunk_df)
        preds = sf.predict(h=horizon)
        results.append(preds)
        if (i // chunk_size) % 10 == 0:
            print(f"  Processed {min(i+chunk_size, len(all_ids)):,}/{len(all_ids):,} series")
    return pd.concat(results, ignore_index=True)

# chunked_forecasts = forecast_in_chunks(
#     df, chunk_size=2000,
#     models=[AutoETS(season_length=52)], freq='W', n_jobs=-1
# )
`}),e.jsx(p,{title:"Memory Management at Scale",children:"With millions of series, storing all predictions in memory simultaneously may not be feasible. Use chunked processing or streaming approaches, writing intermediate results to Parquet files. StatsForecast's output for N series with horizon H and M models requires approximately N × H × M × 8 bytes — for 1M series, 12 steps, 3 models: ~288 MB, which is manageable; for 10M series it becomes 2.9 GB, requiring careful memory planning."}),e.jsx(c,{references:[{title:"StatsForecast: Lightning Fast Forecasting with Statistical and Econometric Models",authors:"Garza, A. et al.",year:2022,journal:"NeurIPS Datasets and Benchmarks"},{title:"Ray: A Distributed Framework for Emerging AI Applications",authors:"Moritz, P. et al.",year:2018,journal:"OSDI"},{title:"Fugue: Unifying Heterogeneous Distributed Computing Workloads",authors:"Han, H. & Zhao, G.",year:2021,url:"https://fugue-tutorials.readthedocs.io/"}]})]})}const ae=Object.freeze(Object.defineProperty({__proto__:null,default:C,metadata:M},Symbol.toStringTag,{value:"Module"})),L=[{feature:"lag_1",importance:.28},{feature:"lag_7",importance:.19},{feature:"rolling_mean_7",importance:.15},{feature:"lag_28",importance:.12},{feature:"rolling_mean_28",importance:.1},{feature:"day_of_week",importance:.08},{feature:"week_of_year",importance:.05},{feature:"is_holiday",importance:.03}],N=[{t:"W1",actual:245,lgbm:240},{t:"W2",actual:267,lgbm:260},{t:"W3",actual:231,lgbm:238},{t:"W4",actual:289,lgbm:280},{t:"W5",actual:312,lgbm:305},{t:"W6",actual:null,lgbm:318},{t:"W7",actual:null,lgbm:325},{t:"W8",actual:null,lgbm:330}];function B(){const[t,r]=v.useState("architecture");return e.jsxs(l,{title:"mlforecast Quickstart",difficulty:"intermediate",readingTime:30,prerequisites:["Gradient Boosting","Feature Engineering","statsforecast Basics"],children:[e.jsxs("p",{children:["Nixtla's ",e.jsx("strong",{children:"mlforecast"})," library applies global machine learning models to multiple time series simultaneously. Instead of fitting one model per series (local models), mlforecast trains a single model on all series together, capturing cross-series patterns while using lag features and rolling statistics as inputs."]}),e.jsx("h2",{children:"Global vs. Local Models"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 my-6",children:[e.jsxs("div",{className:"p-4 bg-blue-50 rounded-lg border border-blue-200",children:[e.jsx("h3",{className:"font-semibold text-blue-800 mb-2",children:"Local Models (statsforecast)"}),e.jsxs("ul",{className:"text-sm text-blue-700 space-y-1 list-disc pl-4",children:[e.jsx("li",{children:"One ARIMA/ETS per series"}),e.jsx("li",{children:"Captures series-specific patterns"}),e.jsx("li",{children:"Works well with few series"}),e.jsx("li",{children:"Cannot share information across series"}),e.jsx("li",{children:"Cold-start: must wait for history"})]})]}),e.jsxs("div",{className:"p-4 bg-green-50 rounded-lg border border-green-200",children:[e.jsx("h3",{className:"font-semibold text-green-800 mb-2",children:"Global Models (mlforecast)"}),e.jsxs("ul",{className:"text-sm text-green-700 space-y-1 list-disc pl-4",children:[e.jsx("li",{children:"One LightGBM/XGBoost for all series"}),e.jsx("li",{children:"Shares patterns across thousands of series"}),e.jsx("li",{children:"Scales to millions of series"}),e.jsx("li",{children:"Leverages cross-series information"}),e.jsx("li",{children:"Cold-start: use series features/attributes"})]})]})]}),e.jsxs(m,{title:"mlforecast Architecture",children:["mlforecast operates as a ",e.jsx("strong",{children:"feature engineering + tabular ML"})," pipeline. For each series at each timestep, it creates a row of features: lag values, rolling statistics, date features, and static covariates. It then trains any scikit-learn compatible model on this tabular dataset. Prediction is iterative: to forecast h steps ahead, the model recursively predicts one step at a time, using previous predictions as new lag inputs."]}),e.jsx("h2",{children:"Installation"}),e.jsx(s,{code:"pip install mlforecast lightgbm"}),e.jsx("h2",{children:"Core API: MLForecast Class"}),e.jsxs("p",{children:["The ",e.jsx("code",{children:"MLForecast"})," constructor takes:"]}),e.jsxs("ul",{className:"list-disc pl-6 my-3 space-y-1",children:[e.jsxs("li",{children:[e.jsx("code",{children:"models"}),": list of sklearn-compatible estimators"]}),e.jsxs("li",{children:[e.jsx("code",{children:"freq"}),": pandas frequency string"]}),e.jsxs("li",{children:[e.jsx("code",{children:"lags"}),": list of lag periods (e.g., ",e.jsx("code",{children:"[1, 7, 28]"}),")"]}),e.jsxs("li",{children:[e.jsx("code",{children:"lag_transforms"}),": dict mapping lag to transform functions"]}),e.jsxs("li",{children:[e.jsx("code",{children:"date_features"}),": list of date component names"]}),e.jsxs("li",{children:[e.jsx("code",{children:"num_threads"}),": parallelism for feature computation"]})]}),e.jsx("h2",{children:"Complete Pipeline: Retail Demand Forecasting"}),e.jsx(s,{code:`import pandas as pd
import numpy as np
from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
from window_ops.rolling import rolling_mean, rolling_std
import lightgbm as lgb

# ── 1. Long-format data (same convention as statsforecast) ─────────────────
np.random.seed(0)
n_periods = 365  # daily data, ~1 year
n_series = 100   # 100 SKUs

records = []
for i in range(n_series):
    uid = f'SKU_{i:04d}'
    dates = pd.date_range('2023-01-01', periods=n_periods, freq='D')
    base = np.random.uniform(50, 500)
    trend = np.linspace(0, base * 0.2, n_periods)
    day_of_week_effect = np.array([1.0, 0.9, 0.95, 1.0, 1.1, 1.3, 1.2])
    seasonal = np.array([day_of_week_effect[d.weekday()] for d in dates]) * base * 0.15
    noise = np.random.normal(0, base * 0.05, n_periods)
    sales = np.maximum(0, base + trend + seasonal + noise).round(0)
    for date, value in zip(dates, sales):
        records.append({'unique_id': uid, 'ds': date, 'y': value})

df = pd.DataFrame(records)
print(f"Rows: {len(df):,}, Series: {df['unique_id'].nunique()}")`}),e.jsx(s,{code:`# ── 2. Define LightGBM model ───────────────────────────────────────────────
lgbm_params = {
    'n_estimators': 500,
    'learning_rate': 0.05,
    'num_leaves': 63,
    'min_child_samples': 20,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'random_state': 42,
    'verbosity': -1,
}

# ── 3. Instantiate MLForecast ──────────────────────────────────────────────
mlf = MLForecast(
    models=[lgb.LGBMRegressor(**lgbm_params)],
    freq='D',
    lags=[1, 2, 3, 7, 14, 28],           # lag features
    lag_transforms={
        1: [(rolling_mean, 7), (rolling_std, 7)],   # 7-day rolling mean/std of lag-1
        7: [(rolling_mean, 28)],                     # 28-day rolling mean of lag-7
    },
    date_features=['dayofweek', 'week', 'month', 'year'],
    num_threads=4,
)

print("Features will include:")
print("  Lags:", [1, 2, 3, 7, 14, 28])
print("  Rolling: 7d mean, 7d std, 28d mean")
print("  Calendar: dayofweek, week, month, year")`}),e.jsx(s,{code:`# ── 4. Fit and forecast ───────────────────────────────────────────────────
horizon = 14  # 14 days ahead

mlf.fit(df)
forecasts = mlf.predict(h=horizon)

print(forecasts.head(10))
#    unique_id         ds  LGBMRegressor
# 0  SKU_0000  2024-01-01        187.0
# 1  SKU_0000  2024-01-02        192.0
# ...

# ── 5. Add static features (SKU attributes) ───────────────────────────────
# Create SKU-level attributes to improve cold-start and cross-series learning
sku_features = pd.DataFrame({
    'unique_id': [f'SKU_{i:04d}' for i in range(n_series)],
    'category': np.random.choice(['Electronics', 'Apparel', 'Food'], n_series),
    'price_tier': np.random.choice(['budget', 'mid', 'premium'], n_series),
    'weight_kg': np.random.uniform(0.1, 10.0, n_series).round(2),
})

mlf_with_features = MLForecast(
    models=[lgb.LGBMRegressor(**lgbm_params)],
    freq='D',
    lags=[1, 7, 28],
    lag_transforms={1: [(rolling_mean, 7)]},
    date_features=['dayofweek', 'month'],
)
mlf_with_features.fit(df, static_features=['category', 'price_tier', 'weight_kg'],
                      id_col='unique_id', time_col='ds', target_col='y',
                      X_df=sku_features)`}),e.jsx(s,{code:`# ── 6. Cross-validation / backtesting ────────────────────────────────────
cv_df = mlf.cross_validation(
    df=df,
    h=horizon,
    n_windows=4,      # 4 backtesting windows
    step_size=7,      # move cutoff forward 7 days each window
    refit=False,      # don't refit model at each window (faster)
)
print(cv_df.head())
#    unique_id         ds    cutoff   y  LGBMRegressor

# Compute MAE per window
cv_df['ae'] = (cv_df['y'] - cv_df['LGBMRegressor']).abs()
print(cv_df.groupby('cutoff')['ae'].mean().round(2))`}),e.jsx(s,{code:`# ── 7. Feature importance ─────────────────────────────────────────────────
import matplotlib.pyplot as plt

model = mlf.models_['LGBMRegressor']
feature_names = mlf.ts.features_order_
importance = pd.Series(
    model.feature_importances_, index=feature_names
).sort_values(ascending=False)

print("Top 10 features:")
print(importance.head(10))

# lag_1              0.28
# lag_7              0.19
# rolling_mean_7     0.15
# lag_28             0.12
# rolling_mean_28    0.10
# dayofweek          0.08
# week               0.05
# is_holiday         0.03`}),e.jsx("h2",{children:"Feature Importance"}),e.jsxs("div",{className:"my-6",children:[e.jsx(h,{width:"100%",height:280,children:e.jsxs(b,{data:L,layout:"vertical",children:[e.jsx(f,{strokeDasharray:"3 3"}),e.jsx(u,{type:"number",tickFormatter:a=>`${(a*100).toFixed(0)}%`}),e.jsx(g,{type:"category",dataKey:"feature",width:120,tick:{fontSize:12}}),e.jsx(_,{formatter:a=>`${(a*100).toFixed(1)}%`}),e.jsx(x,{dataKey:"importance",fill:"#6366f1",name:"Importance"})]})}),e.jsx("p",{className:"text-xs text-center text-gray-500 mt-1",children:"LightGBM feature importance (gain) from a typical retail demand model. Short-lag features dominate; day-of-week captures weekly patterns."})]}),e.jsx("h2",{children:"Forecast Sample"}),e.jsx(h,{width:"100%",height:250,children:e.jsxs(w,{data:N,children:[e.jsx(f,{strokeDasharray:"3 3"}),e.jsx(u,{dataKey:"t"}),e.jsx(g,{domain:[200,360]}),e.jsx(_,{}),e.jsx(j,{}),e.jsx(o,{type:"monotone",dataKey:"actual",stroke:"#374151",strokeWidth:2,dot:{r:4},name:"Actual",connectNulls:!1}),e.jsx(o,{type:"monotone",dataKey:"lgbm",stroke:"#6366f1",strokeWidth:2,strokeDasharray:"6 3",dot:!1,name:"LightGBM Forecast"})]})}),e.jsx("h2",{children:"Recursive vs. Direct Forecasting"}),e.jsxs("p",{children:["mlforecast uses ",e.jsx("strong",{children:"recursive (MIMO) forecasting"})," by default: the model predicts one step ahead, then uses that prediction as a lag feature to predict the next step. The error accumulates over the horizon."]}),e.jsx(n.BlockMath,{math:"\\hat{y}_{t+h} = f\\left(\\hat{y}_{t+h-1}, \\hat{y}_{t+h-2}, \\ldots, y_t, \\mathbf{x}_t\\right)"}),e.jsxs("p",{children:["For short horizons (h ≤ 7), recursive forecasting is usually fine. For longer horizons, consider using ",e.jsx("strong",{children:"direct forecasting"})," where a separate model is trained for each step h:"]}),e.jsx(s,{code:`# Direct multi-step forecasting: train separate model per horizon step
from mlforecast.target_transforms import LocalStandardScaler

# One model per horizon step avoids error accumulation
mlf_direct = MLForecast(
    models={f'h{h}': lgb.LGBMRegressor(**lgbm_params) for h in range(1, horizon + 1)},
    freq='D',
    lags=[1, 7, 28],
    date_features=['dayofweek', 'month'],
)
# Note: direct forecasting in mlforecast requires custom training loop;
# use mlforecast's built-in 'direct' strategy when available in newer versions`}),e.jsx(S,{title:"Global Models and the i.i.d. Assumption",children:"Training a global model across series implicitly assumes the relationship between lag features and future values is the same (or similar) across series. This holds well when series share the same data-generating process (same product category, same market). When series are fundamentally different (e.g., mixing daily temperature and monthly sales), separate models or series-type embeddings are preferable."}),e.jsxs(d,{children:["mlforecast's ",e.jsx("code",{children:"target_transforms"})," parameter supports automatic log transforms, differencing, and scaling. Use ",e.jsx("code",{children:"LocalStandardScaler()"})," to normalize each series to zero mean and unit variance before training — this helps gradient boosting learn a common shape across series with very different magnitudes."]}),e.jsx(p,{children:"The recursive prediction strategy means forecast errors compound over long horizons. Monitor SMAPE at each horizon step during cross-validation; if accuracy degrades sharply beyond h=7, consider adding longer-lag features or using direct forecasting."}),e.jsx(c,{references:[{authors:"Olivares, K.G., Garza, A. et al.",year:2023,title:"mlforecast: Scalable machine learning for time series forecasting",journal:"Nixtla Technical Report"},{authors:"Montero-Manso, P., Hyndman, R.J.",year:2021,title:"Principles and algorithms for forecasting groups of time series: Locality and globality",journal:"International Journal of Forecasting",volume:"37(4)",pages:"1632–1653"},{authors:"Ke, G., Meng, Q. et al.",year:2017,title:"LightGBM: A highly efficient gradient boosting decision tree",journal:"NeurIPS 2017"}]})]})}const te=Object.freeze(Object.defineProperty({__proto__:null,default:B},Symbol.toStringTag,{value:"Module"})),F={title:"MLForecast Feature Engineering",difficulty:"intermediate",readingTime:12,description:"Master MLForecast advanced feature engineering: lag_transforms, rolling statistics, multiple models, target transformations, and exogenous variables."};function W(){return e.jsxs(l,{title:"MLForecast Feature Engineering",metadata:F,children:[e.jsx("p",{children:"MLForecast's power comes from its flexible feature engineering pipeline. Beyond simple lags, it supports window-based transforms, exponential moving averages, custom functions, target transformations, and exogenous variables — all computed efficiently in parallel across thousands of series."}),e.jsx("h2",{children:"lag_transforms: Window-Based Features"}),e.jsxs("p",{children:["The ",e.jsx("code",{children:"lag_transforms"})," parameter applies functions to lagged values using a sliding window. The syntax is a dictionary mapping lag offsets to a list of (function, window_size) tuples. The ",e.jsx("code",{children:"window_ops"})," library provides optimized rolling functions:"]}),e.jsxs(m,{title:"lag_transforms Syntax",children:[e.jsxs("code",{children:["lag_transforms = ","{"," lag: [(fn, window), ...], ... ","}"]}),e.jsx("br",{}),"For each (lag, fn, window) combination, MLForecast computes the function over the window of values ending at the lag position. For ",e.jsx("code",{children:"lag=1, window=7"}),", the feature value at time ",e.jsx(n.InlineMath,{math:"t"})," is ",e.jsx(n.InlineMath,{math:"fn(y_{t-1}, y_{t-2}, \\ldots, y_{t-7})"}),"."]}),e.jsx("h2",{children:"Rolling Statistics Available"}),e.jsxs("p",{children:["The ",e.jsx("code",{children:"window_ops"})," library (a dependency of MLForecast) provides Numba-optimized rolling functions:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"rolling_mean"})," — moving average"]}),e.jsxs("li",{children:[e.jsx("code",{children:"rolling_std"})," — moving standard deviation (volatility)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"rolling_min"}),", ",e.jsx("code",{children:"rolling_max"})," — range features"]}),e.jsxs("li",{children:[e.jsx("code",{children:"rolling_quantile(q)"})," — moving quantile (e.g., 0.9 for ceiling)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"expanding_mean"})," — cumulative average (no window cutoff)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"ewm_mean(alpha)"})," — exponentially weighted moving average"]})]}),e.jsx("h2",{children:"Target Transformations"}),e.jsx("p",{children:"Target transforms pre-process the target variable before model fitting, improving numerical stability and enabling the model to learn in a transformed space:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"LocalStandardScaler:"})," Per-series standardization to zero mean, unit variance. Useful when series have very different scales."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Differences:"})," First or seasonal differencing. Removes trend and seasonality, making the target stationary."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"LocalBoxCox:"})," Box-Cox transform with per-series lambda estimation. Stabilizes variance in count or skewed data."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"LocalMinMaxScaler:"})," Per-series min-max normalization to [0, 1]."]})]}),e.jsx(p,{title:"Target Transforms and Prediction",children:"MLForecast automatically inverts target transformations when producing predictions, so output forecasts are always in the original scale. However, residuals and loss metrics during training operate in the transformed space. Use caution when comparing loss values across runs with different transforms."}),e.jsx("h2",{children:"Exogenous Variables"}),e.jsx("p",{children:"MLForecast supports two types of exogenous variables:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Past exogenous (known at training time):"})," Variables observed alongside the target during training but whose future values are unknown. Pass via ",e.jsx("code",{children:"X_df"})," in",e.jsx("code",{children:"fit()"}),"; MLForecast automatically creates lagged versions."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Future exogenous (known for forecast horizon):"})," Variables known in advance (holidays, promotions, weather forecasts). Pass via ",e.jsx("code",{children:"X_df"})," in ",e.jsx("code",{children:"predict()"}),"."]})]}),e.jsx("h2",{children:"Multiple Models in One Pipeline"}),e.jsx("p",{children:"MLForecast can train multiple models simultaneously on the same feature set, with each model contributing a separate column in the output. This is more efficient than training models separately because feature engineering runs only once."}),e.jsxs(A,{title:"Feature Engineering Hierarchy",children:["A well-designed MLForecast feature set typically includes:",e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Short lags (1-3):"})," Recent levels and changes"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Seasonal lags (7, 30, 52/365):"})," Same period last week/month/year"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Rolling statistics (7, 28, 90 days):"})," Trend and volatility context"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Date features (weekday, month, year):"})," Calendar effects"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Static features (category, region):"})," Series-level attributes"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Future exogenous (promotions, holidays):"})," Known future events"]})]})]}),e.jsx(s,{code:`import numpy as np
import pandas as pd
from mlforecast import MLForecast
from mlforecast.target_transforms import (
    LocalStandardScaler, Differences, LocalBoxCox
)
from window_ops.rolling import rolling_mean, rolling_std, rolling_min, rolling_max
from window_ops.ewm import ewm_mean
import lightgbm as lgb
from sklearn.linear_model import Ridge

# ── Generate synthetic panel data with promotions ─────────────────────────────
np.random.seed(42)
N = 50
T = 365

records = []
promos = {}
for sid in range(N):
    t = np.arange(T)
    level = np.random.uniform(100, 1000)
    # Random promotion flags (10% of days)
    promo = np.random.binomial(1, 0.1, T)
    promo_effect = promo * level * np.random.uniform(0.1, 0.4)
    y = (level
         + 0.1 * t
         + level * 0.15 * np.sin(2 * np.pi * t / 7)  # weekly
         + promo_effect
         + np.random.randn(T) * level * 0.05)
    dates = pd.date_range('2023-01-01', periods=T, freq='D')
    uid = f'S{sid:03d}'
    promos[uid] = promo
    for d, v, p in zip(dates, y, promo):
        records.append({'unique_id': uid, 'ds': d, 'y': max(0, v), 'promo': p})

df = pd.DataFrame(records)

# ── Build MLForecast with rich features ──────────────────────────────────────
lgbm_params = {
    'n_estimators': 300, 'learning_rate': 0.05,
    'num_leaves': 63, 'min_child_samples': 20, 'verbose': -1
}

mlf = MLForecast(
    models={
        'lgbm': lgb.LGBMRegressor(**lgbm_params),
        'ridge': Ridge(alpha=100),
    },
    freq='D',
    lags=[1, 2, 3, 7, 14, 28, 365],  # short + seasonal lags
    lag_transforms={
        1: [
            (rolling_mean, 7),       # 7-day MA of lag-1
            (rolling_mean, 28),      # 28-day MA
            (rolling_std, 7),        # 7-day volatility
            (rolling_min, 7),        # 7-day min
            (rolling_max, 7),        # 7-day max
            (ewm_mean, 0.3),         # exponentially weighted MA (alpha=0.3)
        ],
        7: [
            (rolling_mean, 4),       # 4-week moving average of weekly lag
        ],
    },
    date_features=['dayofweek', 'month', 'quarter', 'is_month_start', 'is_month_end'],
    target_transforms=[LocalStandardScaler()],  # normalize each series
    num_threads=4,
)

# Separate past exogenous into future (promo) and historical
h = 14
df_train = df.groupby('unique_id').apply(lambda x: x.iloc[:-h]).reset_index(drop=True)
df_test  = df.groupby('unique_id').apply(lambda x: x.iloc[-h:]).reset_index(drop=True)

# Exogenous variables for training (past promotions)
X_train = df_train[['unique_id', 'ds', 'promo']]
# Future exogenous for forecasting (assume promotions are planned in advance)
X_test  = df_test[['unique_id', 'ds', 'promo']]

mlf.fit(df_train, X_df=X_train)
forecasts = mlf.predict(h=h, X_df=X_test)
print("Forecast columns:", forecasts.columns.tolist())
print(forecasts.head())

# ── Differences transform for non-stationary data ────────────────────────────
mlf_diff = MLForecast(
    models={'lgbm': lgb.LGBMRegressor(**lgbm_params)},
    freq='D',
    lags=[1, 7, 14, 28],
    lag_transforms={1: [(rolling_mean, 7), (rolling_std, 7)]},
    date_features=['dayofweek', 'month'],
    target_transforms=[Differences([1])],  # first difference
)
mlf_diff.fit(df_train)
fc_diff = mlf_diff.predict(h=h)

# ── Cross-validation with exogenous variables ─────────────────────────────────
mlf_cv = MLForecast(
    models={'lgbm': lgb.LGBMRegressor(**lgbm_params)},
    freq='D',
    lags=[1, 7, 28],
    lag_transforms={1: [(rolling_mean, 7)]},
    date_features=['dayofweek', 'month'],
)
cv_result = mlf_cv.cross_validation(
    df=df_train,
    h=7,
    n_windows=3,
    step_size=14,
    refit=True,
)

from sklearn.metrics import mean_absolute_error
mae_lgbm = mean_absolute_error(cv_result['y'], cv_result['lgbm'])
print(f"\\nCV MAE (LightGBM): {mae_lgbm:.2f}")

# ── Feature importance analysis ───────────────────────────────────────────────
fitted_lgbm = mlf_cv.models_['lgbm']
feature_names = mlf_cv.ts.features_order_
importance = pd.Series(
    fitted_lgbm.feature_importances_, index=feature_names
).sort_values(ascending=False)

print("\\nTop 10 features by importance:")
for feat, imp in importance.head(10).items():
    print(f"  {feat}: {imp:.0f}")

# ── BoxCox transform for count data ──────────────────────────────────────────
# For demand data with zeros and right skew
mlf_bc = MLForecast(
    models={'lgbm': lgb.LGBMRegressor(**lgbm_params)},
    freq='D',
    lags=[1, 7, 28],
    lag_transforms={1: [(rolling_mean, 7)]},
    target_transforms=[LocalBoxCox()],  # auto-estimate lambda per series
)
mlf_bc.fit(df_train)
fc_bc = mlf_bc.predict(h=h)  # predictions are automatically back-transformed
print("\\nBoxCox forecast sample:")
print(fc_bc.head())
`}),e.jsxs(d,{title:"window_ops vs pandas rolling",children:["MLForecast uses ",e.jsx("code",{children:"window_ops"})," rather than pandas rolling for feature computation. This is significantly faster (Numba JIT-compiled) and avoids the pandas overhead of aligning windows across groups. The functions operate on NumPy arrays, so custom functions must also accept NumPy arrays."]}),e.jsx(c,{references:[{title:"mlforecast: Scalable machine learning for time series forecasting",authors:"Olivares, K.G., Garza, A. et al.",year:2023,journal:"Nixtla Technical Report"},{title:"Recursive vs. Direct Forecasting",authors:"Taieb, S.B. & Hyndman, R.J.",year:2012,journal:"International Journal of Forecasting"}]})]})}const re=Object.freeze(Object.defineProperty({__proto__:null,default:W,metadata:F},Symbol.toStringTag,{value:"Module"})),G=[{model:"ExponentialSmoothing",mase:1.12,trainTime:.3},{model:"Prophet",mase:1.28,trainTime:2.1},{model:"LightGBM",mase:.98,trainTime:5.4},{model:"TCNModel",mase:.91,trainTime:45.2},{model:"TFTModel",mase:.87,trainTime:120.8}],O=[{t:"Q1 22",actual:420,es:415,lgbm:418},{t:"Q2 22",actual:455,es:448,lgbm:451},{t:"Q3 22",actual:390,es:400,lgbm:393},{t:"Q4 22",actual:510,es:498,lgbm:505},{t:"Q1 23",actual:465,es:472,lgbm:461},{t:"Q2 23",actual:488,es:476,lgbm:482},{t:"Q3 23",actual:null,es:445,lgbm:452},{t:"Q4 23",actual:null,es:525,lgbm:531}];function U(){const[t,r]=v.useState("es");return e.jsxs(l,{title:"Darts: All-in-One Forecasting Library",difficulty:"intermediate",readingTime:30,prerequisites:["Exponential Smoothing","Machine Learning Basics","Python Basics"],children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Darts"})," (by Unit8) provides a unified Python API for over 30 forecasting models, from classical Exponential Smoothing to deep learning Temporal Fusion Transformers. Its core design principle: every model exposes identical ",e.jsx("code",{children:"fit()"}),",",e.jsx("code",{children:"predict()"}),", and ",e.jsx("code",{children:"historical_forecasts()"})," interfaces, making it trivial to swap models and compare them fairly."]}),e.jsx("h2",{children:"Installation"}),e.jsx(s,{code:`# Core install (classical + ML models)
pip install darts

# With all deep learning support (PyTorch-based models)
pip install "darts[torch]"`}),e.jsx("h2",{children:"The TimeSeries Object"}),e.jsxs(m,{title:"darts.TimeSeries",children:["The ",e.jsx("code",{children:"TimeSeries"})," class is Darts' central data structure. It wraps a pandas Series or DataFrame with a ",e.jsx("code",{children:"DatetimeIndex"})," (or integer index) and adds:",e.jsxs("ul",{className:"list-disc pl-4 mt-2 space-y-1",children:[e.jsx("li",{children:"Multivariate support (multiple columns = multiple components)"}),e.jsx("li",{children:"Probabilistic support (samples dimension for Monte Carlo forecasts)"}),e.jsx("li",{children:"Static covariates and future/past covariates"}),e.jsx("li",{children:"Automatic frequency inference and gap detection"})]})]}),e.jsx(s,{code:`import pandas as pd
import numpy as np
from darts import TimeSeries
from darts.datasets import AirPassengersDataset

# ── Option A: from pandas Series ──────────────────────────────────────────
dates = pd.date_range('2020-01-01', periods=120, freq='MS')
values = np.random.normal(100, 15, 120).cumsum() + 500
series = TimeSeries.from_times_and_values(dates, values)

# ── Option B: from pandas DataFrame ───────────────────────────────────────
df = pd.DataFrame({'date': dates, 'sales': values})
series = TimeSeries.from_dataframe(df, time_col='date', value_cols='sales', freq='MS')

# ── Option C: built-in datasets ───────────────────────────────────────────
series = AirPassengersDataset().load()

print(f"Length: {len(series)}")
print(f"Start: {series.start_time()}")
print(f"End:   {series.end_time()}")
print(f"Freq:  {series.freq}")`}),e.jsx(s,{code:`# TimeSeries slicing and operations
train, val = series[:-12], series[-12:]  # last 12 months for validation

# Split at specific date
train = series.drop_after(pd.Timestamp('2023-01-01'))
val   = series.drop_before(pd.Timestamp('2023-01-01'))

# Univariate → multivariate by stacking
import darts.utils.timeseries_generation as tg
trend_component = tg.linear_timeseries(start=series.start_time(),
                                        end_value=1.5, length=len(series))
multivariate = series.stack(trend_component)`}),e.jsx("h2",{children:"Model Categories"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"w-full text-sm border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-indigo-50",children:[e.jsx("th",{className:"border border-gray-300 p-2 text-left",children:"Category"}),e.jsx("th",{className:"border border-gray-300 p-2 text-left",children:"Examples"}),e.jsx("th",{className:"border border-gray-300 p-2 text-left",children:"Notes"})]})}),e.jsx("tbody",{children:[["Local Statistical","ExponentialSmoothing, ARIMA, AutoARIMA, Theta","One model per series; fast; good for few series"],["Local Regression","LinearRegressionModel, RandomForest, LightGBMModel","Tabular ML; one model per series"],["Global Regression","LightGBMModel (global=True), XGBModel","Single model across all series; scalable"],["Deep Learning (global)","TCNModel, NBEATSModel, NHiTSModel, TFTModel, TSMixerModel","PyTorch; requires torch install; needs much data"],["Probabilistic","Any model + .predict(num_samples=N)","Monte Carlo dropout or conformal wrappers"]].map(([a,i,y])=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:"border border-gray-300 p-2 font-semibold",children:a}),e.jsx("td",{className:"border border-gray-300 p-2 font-mono text-xs",children:i}),e.jsx("td",{className:"border border-gray-300 p-2 text-gray-600 text-xs",children:y})]},a))})]})}),e.jsx("h2",{children:"Complete Quickstart: ExponentialSmoothing vs LightGBM"}),e.jsx(s,{code:`from darts.models import ExponentialSmoothing, LightGBMModel
from darts.metrics import mae, mase, smape
from darts.dataprocessing.transformers import Scaler
import numpy as np

# Load Air Passengers dataset (classic benchmark)
from darts.datasets import AirPassengersDataset
series = AirPassengersDataset().load()

# Log-transform for variance stabilization
series_log = series.map(np.log)

# Train/test split
train, test = series_log[:-24], series_log[-24:]
horizon = len(test)

# ── Exponential Smoothing ──────────────────────────────────────────────────
es_model = ExponentialSmoothing()
es_model.fit(train)
es_pred = es_model.predict(horizon)
es_pred_orig = es_pred.map(np.exp)  # back-transform

print(f"ETS  MAE:  {mae(series[-24:], es_pred_orig):.2f}")
print(f"ETS  MASE: {mase(series[-24:], es_pred_orig, insample=series[:-24]):.3f}")`}),e.jsx(s,{code:`# ── LightGBM (regression model) ───────────────────────────────────────────
scaler = Scaler()
train_scaled = scaler.fit_transform(train)
test_scaled  = scaler.transform(test)

lgbm_model = LightGBMModel(
    lags=24,                  # use 24 lagged values as features
    lags_past_covariates=None,
    output_chunk_length=12,   # predict 12 steps at once
    n_estimators=300,
    num_leaves=31,
    random_state=42,
    verbose=-1,
)
lgbm_model.fit(train_scaled)
lgbm_pred_scaled = lgbm_model.predict(horizon)
lgbm_pred = scaler.inverse_transform(lgbm_pred_scaled).map(np.exp)

print(f"LGBM MAE:  {mae(series[-24:], lgbm_pred):.2f}")
print(f"LGBM MASE: {mase(series[-24:], lgbm_pred, insample=series[:-24]):.3f}")`}),e.jsx(s,{code:`# ── historical_forecasts: walk-forward backtesting ────────────────────────
# Re-trains or re-predicts at each step in history; gives realistic error estimates

es_historical = es_model.historical_forecasts(
    series_log,
    start=0.6,             # start backtesting from 60% of the series
    forecast_horizon=6,    # 6-step ahead forecasts
    stride=1,              # evaluate every timestep
    retrain=True,          # refit model at each step
    verbose=False,
)
print(f"Historical backtest MAE: {mae(series_log[es_historical.start_time():], es_historical):.4f}")

# ── Pipeline: preprocessing + model ───────────────────────────────────────
from darts.dataprocessing.pipeline import Pipeline
from darts.dataprocessing.transformers import MissingValuesFiller, Scaler

pipeline = Pipeline([
    MissingValuesFiller(),
    Scaler(),
    LightGBMModel(lags=12, output_chunk_length=6, verbose=-1),
])

pipeline.fit(train)
pipeline_pred = pipeline.predict(6)
print(f"Pipeline prediction shape: {pipeline_pred.n_timesteps} steps")`}),e.jsx(s,{code:`# ── Probabilistic forecasting with conformal intervals ────────────────────
from darts.models import ExponentialSmoothing
from darts.ad import QuantileDetector  # for conformal coverage

es_prob = ExponentialSmoothing()
es_prob.fit(train_scaled)

# Predict with Monte Carlo samples (for models that support stochastic output)
# For deterministic models, use conformal prediction wrapper:
from darts.utils.statistics import check_residuals_stationarity

residuals = es_prob.residuals(train_scaled)
print(f"Residuals stationarity p-value: {check_residuals_stationarity(residuals)[1]:.3f}")

# Probabilistic ETS with num_samples returns ensemble
pred_prob = es_prob.predict(horizon, num_samples=200)
# Access quantiles
print(f"10th pctile at t+1: {pred_prob.quantile_timeseries(0.10).first_value():.4f}")
print(f"90th pctile at t+1: {pred_prob.quantile_timeseries(0.90).first_value():.4f}")`}),e.jsx("h2",{children:"Model Comparison: MASE vs Training Time"}),e.jsxs("div",{className:"my-6",children:[e.jsx("div",{className:"flex gap-2 mb-4 flex-wrap",children:[["es","ExponentialSmoothing"],["lgbm","LightGBM"]].map(([a,i])=>e.jsx("button",{onClick:()=>r(a),className:`px-3 py-1 rounded text-sm font-medium ${t===a?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:i},a))}),e.jsx(h,{width:"100%",height:260,children:e.jsxs(w,{data:O,children:[e.jsx(f,{strokeDasharray:"3 3"}),e.jsx(u,{dataKey:"t"}),e.jsx(g,{domain:[360,560]}),e.jsx(_,{}),e.jsx(j,{}),e.jsx(o,{type:"monotone",dataKey:"actual",stroke:"#374151",strokeWidth:2,dot:{r:4},name:"Actual",connectNulls:!1}),t==="es"&&e.jsx(o,{type:"monotone",dataKey:"es",stroke:"#6366f1",strokeWidth:2,strokeDasharray:"6 3",dot:!1,name:"ExponentialSmoothing"}),t==="lgbm"&&e.jsx(o,{type:"monotone",dataKey:"lgbm",stroke:"#22c55e",strokeWidth:2,strokeDasharray:"6 3",dot:!1,name:"LightGBM"})]})})]}),e.jsxs("div",{className:"my-4",children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-600 mb-3",children:"MASE by Model (lower is better)"}),e.jsx(h,{width:"100%",height:200,children:e.jsxs(b,{data:G,layout:"vertical",children:[e.jsx(f,{strokeDasharray:"3 3"}),e.jsx(u,{type:"number",domain:[.8,1.35]}),e.jsx(g,{type:"category",dataKey:"model",width:150,tick:{fontSize:11}}),e.jsx(_,{}),e.jsx(x,{dataKey:"mase",fill:"#6366f1",name:"MASE"})]})}),e.jsx("p",{className:"text-xs text-center text-gray-500 mt-1",children:"Deep learning models (TCN, TFT) achieve lower MASE but require orders of magnitude more training time."})]}),e.jsx("h2",{children:"Covariate Support"}),e.jsx("p",{children:"Darts distinguishes three types of covariates:"}),e.jsxs("ul",{className:"list-disc pl-6 my-3 space-y-2",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Past covariates"}),": features known only up to the forecast origin (e.g., historical promotions). Passed to ",e.jsx("code",{children:"fit()"})," and used as model inputs for the lookback window."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Future covariates"}),": features known for the entire forecast horizon (e.g., planned holidays, calendar). Passed to both ",e.jsx("code",{children:"fit()"})," and ",e.jsx("code",{children:"predict()"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Static covariates"}),": time-invariant series-level features (e.g., SKU category). Attached directly to the ",e.jsx("code",{children:"TimeSeries"})," object."]})]}),e.jsxs(d,{children:["The ",e.jsx("code",{children:"historical_forecasts()"})," method is Darts' most powerful backtesting tool. It simulates the real forecasting process: at each evaluation timestep, it trains on data up to that point and predicts h steps ahead. Set ",e.jsx("code",{children:"retrain=False"}),"to use a single trained model (much faster) when you trust the model is stable."]}),e.jsx(p,{children:"Deep learning models (TCNModel, TFTModel) require substantial data to train. TCN typically needs at least 1,000 timesteps per series; TFT needs even more. For typical business forecasting with monthly data (60–120 points), ExponentialSmoothing or LightGBM will outperform neural networks."}),e.jsx(c,{references:[{authors:"Herzen, J. et al.",year:2022,title:"Darts: User-friendly modern machine learning for time series",journal:"Journal of Machine Learning Research",volume:"23(124)",pages:"1–6"},{authors:"Lim, B., Arık, S.Ö., Loeff, N., Pfister, T.",year:2021,title:"Temporal Fusion Transformers for interpretable multi-horizon time series forecasting",journal:"International Journal of Forecasting",volume:"37(4)",pages:"1748–1764"}]})]})}const ie=Object.freeze(Object.defineProperty({__proto__:null,default:U},Symbol.toStringTag,{value:"Module"})),T={title:"sktime for Forecasting",difficulty:"intermediate",readingTime:12,description:"Learn sktime's sklearn-compatible forecasting API: ForecastingHorizon, composable pipelines, and a unified interface for forecasting, classification, and regression."};function K(){return e.jsxs(l,{title:"sktime for Forecasting",metadata:T,children:[e.jsxs("p",{children:["sktime is a unified, sklearn-compatible library for time series machine learning, covering forecasting, classification, regression, clustering, and transformation. Its design mirrors scikit-learn: every estimator has ",e.jsx("code",{children:"fit()"}),", ",e.jsx("code",{children:"predict()"}),", and",e.jsx("code",{children:"get_params()"})," methods, enabling pipelines, grid search, and cross-validation to work seamlessly across all tasks."]}),e.jsxs(m,{title:"ForecastingHorizon",children:["sktime's ",e.jsx("code",{children:"ForecastingHorizon"})," (FH) object explicitly specifies ",e.jsx("em",{children:"which future periods"})," to forecast, rather than just a scalar horizon length. It can be:",e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Relative:"})," ",e.jsx("code",{children:"ForecastingHorizon([1, 2, 3, 6, 12])"})," — periods ahead from the cutoff"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Absolute:"})," ",e.jsx("code",{children:"ForecastingHorizon(['2024-01', '2024-06'], is_relative=False)"})," — specific dates"]})]}),"This allows forecasting at irregular horizons (e.g., every quarter) without predicting all intermediate steps."]}),e.jsx("h2",{children:"sklearn-Compatible API"}),e.jsx("p",{children:"sktime forecasters follow the sklearn estimator protocol, enabling:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Pipeline composition:"})," Chain transformers and forecasters with ",e.jsx("code",{children:"TransformedTargetForecaster"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Grid search:"})," Use ",e.jsx("code",{children:"ForecastingGridSearchCV"})," for hyperparameter tuning with temporal cross-validation"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reduced regression:"})," Wrap any sklearn regressor as a forecaster using ",e.jsx("code",{children:"make_reduction()"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Ensembling:"})," ",e.jsx("code",{children:"EnsembleForecaster"})," combines multiple forecasters"]})]}),e.jsx("h2",{children:"Data Format"}),e.jsxs("p",{children:["sktime uses pandas Series or DataFrames with a ",e.jsx("code",{children:"PeriodIndex"})," or",e.jsx("code",{children:"DatetimeIndex"}),". For panel data (multiple series), it uses a multi-index DataFrame with levels (instance_id, time). The convention is consistent across all tasks:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Univariate forecasting:"})," ",e.jsx("code",{children:"pd.Series"})," with ",e.jsx("code",{children:"DatetimeIndex"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Multivariate:"})," ",e.jsx("code",{children:"pd.DataFrame"})," with multiple columns"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Panel (multiple series):"})," ",e.jsx("code",{children:"pd.DataFrame"})," with 2-level multi-index ",e.jsx("code",{children:"(series_id, time)"})]})]}),e.jsx("h2",{children:"Reduction: ML Forecasting via sklearn"}),e.jsxs("p",{children:["The reduction approach transforms forecasting into a tabular regression problem using",e.jsx("code",{children:"make_reduction()"}),". Under the hood, it creates lag features automatically:"]}),e.jsx(n.BlockMath,{math:"\\hat{y}_{t+h} = f(y_t, y_{t-1}, \\ldots, y_{t-w+1})"}),e.jsx("p",{children:"Any sklearn regressor can be wrapped, enabling the full sklearn ecosystem (regularization, ensemble methods, pipelines) to be applied to time series forecasting."}),e.jsx("h2",{children:"Composable Pipelines"}),e.jsxs("p",{children:["sktime's ",e.jsx("code",{children:"TransformedTargetForecaster"})," chains preprocessing steps with a forecaster:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Deseasonalizer:"})," Remove and restore seasonal patterns"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Detrender:"})," Remove and restore trend"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"BoxCoxTransformer:"})," Variance stabilization"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Imputer:"})," Fill missing values before modeling"]})]}),e.jsxs("p",{children:["The pipeline's ",e.jsx("code",{children:"fit()"})," and ",e.jsx("code",{children:"predict()"})," methods handle the full transform-fit-inverse-transform cycle automatically."]}),e.jsxs(d,{title:"sktime vs Darts vs StatsForecast",children:["Each library has distinct strengths:",e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"sktime:"})," Best for sklearn integration, pipelines, and diverse time series tasks (not just forecasting)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Darts:"})," Best for easy model comparison and built-in backtesting framework"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"StatsForecast:"})," Best for speed at scale with classical statistical models"]})]}),"They are complementary and can be used together."]}),e.jsx(s,{code:`import pandas as pd
import numpy as np
from sktime.forecasting.arima import AutoARIMA
from sktime.forecasting.exp_smoothing import ExponentialSmoothing
from sktime.forecasting.naive import NaiveForecaster
from sktime.forecasting.base import ForecastingHorizon
from sktime.forecasting.model_selection import (
    ExpandingWindowSplitter, ForecastingGridSearchCV
)
from sktime.forecasting.compose import (
    TransformedTargetForecaster, EnsembleForecaster, make_reduction
)
from sktime.transformations.series.detrend import Deseasonalizer, Detrender
from sktime.transformations.series.boxcox import BoxCoxTransformer
from sklearn.ensemble import GradientBoostingRegressor
from sktime.performance_metrics.forecasting import mean_absolute_percentage_error

# ── Generate monthly time series ──────────────────────────────────────────────
np.random.seed(42)
T = 120
t = np.arange(T)
y = (100 + 0.5 * t
     + 15 * np.sin(2 * np.pi * t / 12)
     + np.random.randn(T) * 5)
dates = pd.period_range('2014-01', periods=T, freq='M')
series = pd.Series(y, index=dates, name='sales')

# Train/test split
n_test = 12
y_train, y_test = series[:-n_test], series[-n_test:]

# ── ForecastingHorizon ───────────────────────────────────────────────────────
fh = ForecastingHorizon(np.arange(1, n_test + 1))  # 1 to 12 steps ahead
fh_irregular = ForecastingHorizon([1, 3, 6, 12])   # only specific horizons

# ── Basic forecasters ─────────────────────────────────────────────────────────
# Naive baseline
naive = NaiveForecaster(strategy='last', sp=12)  # seasonal naive
naive.fit(y_train)
naive_pred = naive.predict(fh)

# AutoARIMA
auto_arima = AutoARIMA(sp=12, suppress_warnings=True)
auto_arima.fit(y_train)
arima_pred = auto_arima.predict(fh)

# Exponential Smoothing
ets = ExponentialSmoothing(trend='add', seasonal='add', sp=12)
ets.fit(y_train)
ets_pred = ets.predict(fh)

# Evaluate
for name, pred in [('Naive', naive_pred), ('AutoARIMA', arima_pred), ('ETS', ets_pred)]:
    mape = mean_absolute_percentage_error(y_test, pred)
    print(f"{name}: MAPE = {mape:.3f}")

# ── Pipeline: Detrend + Deseasonalize + ARIMA ────────────────────────────────
pipeline = TransformedTargetForecaster([
    ('detrend', Detrender()),
    ('deseasonalize', Deseasonalizer(sp=12)),
    ('forecaster', AutoARIMA(suppress_warnings=True)),
])
pipeline.fit(y_train)
pipeline_pred = pipeline.predict(fh)
mape_pipe = mean_absolute_percentage_error(y_test, pipeline_pred)
print(f"Pipeline (detrend+deseason+ARIMA): MAPE = {mape_pipe:.3f}")

# ── Reduction: sklearn regressor as forecaster ────────────────────────────────
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor

# Direct strategy: separate model per horizon step
rf_forecaster = make_reduction(
    RandomForestRegressor(n_estimators=100, random_state=42),
    window_length=24,         # use 24 lags as features
    strategy='direct',        # separate model per step
)
rf_forecaster.fit(y_train)
rf_pred = rf_forecaster.predict(fh)
mape_rf = mean_absolute_percentage_error(y_test, rf_pred)
print(f"RF (direct reduction): MAPE = {mape_rf:.3f}")

# Recursive strategy: one model, predict step-by-step
gbm_forecaster = make_reduction(
    GradientBoostingRegressor(n_estimators=200, max_depth=3),
    window_length=24,
    strategy='recursive',
)
gbm_forecaster.fit(y_train)
gbm_pred = gbm_forecaster.predict(fh)
mape_gbm = mean_absolute_percentage_error(y_test, gbm_pred)
print(f"GBM (recursive reduction): MAPE = {mape_gbm:.3f}")

# ── Ensemble forecaster ───────────────────────────────────────────────────────
ensemble = EnsembleForecaster([
    ('ets', ExponentialSmoothing(trend='add', seasonal='add', sp=12)),
    ('arima', AutoARIMA(sp=12, suppress_warnings=True)),
    ('gbm', make_reduction(GradientBoostingRegressor(n_estimators=100),
                           window_length=12, strategy='recursive')),
])
ensemble.fit(y_train)
ensemble_pred = ensemble.predict(fh)
mape_ens = mean_absolute_percentage_error(y_test, ensemble_pred)
print(f"Ensemble: MAPE = {mape_ens:.3f}")

# ── Grid search with temporal CV ──────────────────────────────────────────────
cv = ExpandingWindowSplitter(
    step_length=12,
    fh=np.arange(1, 13),
    initial_window=60,
)

param_grid = {
    'window_length': [12, 18, 24, 36],
}

grid_search = ForecastingGridSearchCV(
    make_reduction(Ridge(), strategy='recursive'),
    cv=cv,
    param_grid=param_grid,
    scoring=mean_absolute_percentage_error,
    n_jobs=-1,
)
grid_search.fit(y_train)
print(f"\\nBest window_length: {grid_search.best_params_}")
print(f"Best CV MAPE: {grid_search.best_score_:.3f}")

best_pred = grid_search.predict(fh)
mape_best = mean_absolute_percentage_error(y_test, best_pred)
print(f"Test MAPE (best model): {mape_best:.3f}")
`}),e.jsxs(p,{title:"PeriodIndex vs DatetimeIndex in sktime",children:["sktime works best with ",e.jsx("code",{children:"pd.PeriodIndex"})," rather than ",e.jsx("code",{children:"pd.DatetimeIndex"}),". PeriodIndex avoids ambiguities around daylight saving time and frequency inference. Convert with ",e.jsx("code",{children:"series.to_period('M')"})," for monthly data. If your data has a DatetimeIndex, sktime will usually convert automatically, but explicit conversion is safer."]}),e.jsx(c,{references:[{title:"sktime: A unified interface for machine learning with time series",authors:"Löning, M. et al.",year:2019,journal:"NeurIPS Workshop",url:"https://arxiv.org/abs/1909.07872"},{title:"Reducing the forecasting problem",authors:"Taieb, S.B. & Hyndman, R.J.",year:2012,journal:"International Journal of Forecasting"}]})]})}const oe=Object.freeze(Object.defineProperty({__proto__:null,default:K,metadata:T},Symbol.toStringTag,{value:"Module"})),H=[{period:"Jan",daily_avg:142,weekly_avg:148,monthly:145},{period:"Feb",daily_avg:155,weekly_avg:152,monthly:153},{period:"Mar",daily_avg:138,weekly_avg:141,monthly:139},{period:"Apr",daily_avg:162,weekly_avg:159,monthly:161},{period:"May",daily_avg:170,weekly_avg:168,monthly:169},{period:"Jun",daily_avg:158,weekly_avg:162,monthly:160}];function V(){const[t,r]=v.useState("datetime"),a=[{key:"datetime",label:"DatetimeIndex"},{key:"resample",label:"Resample"},{key:"rolling",label:"Rolling"},{key:"shift",label:"Shift/Lags"},{key:"tz",label:"Time Zones"}];return e.jsxs(l,{title:"Pandas for Time Series Analysis",difficulty:"beginner",readingTime:30,prerequisites:["Python Basics","pandas Fundamentals"],children:[e.jsxs("p",{children:["pandas was built with time series analysis in mind. Its ",e.jsx("code",{children:"DatetimeIndex"}),",",e.jsx("code",{children:"resample()"}),", ",e.jsx("code",{children:"rolling()"}),", and ",e.jsx("code",{children:"shift()"})," operations are the backbone of any forecasting pipeline. This section is a practical reference for the patterns you will use every day."]}),e.jsx("div",{className:"flex gap-2 flex-wrap my-4",children:a.map(({key:i,label:y})=>e.jsx("button",{onClick:()=>r(i),className:`px-3 py-1 rounded text-sm font-medium ${t===i?"bg-indigo-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:y},i))}),t==="datetime"&&e.jsxs("div",{children:[e.jsx("h2",{children:"DatetimeIndex: Creating and Setting"}),e.jsx(s,{code:`import pandas as pd
import numpy as np

# ── Creating a DatetimeIndex ──────────────────────────────────────────────
# From date range
idx = pd.date_range('2023-01-01', periods=365, freq='D')
idx_monthly = pd.date_range('2020-01', periods=48, freq='MS')  # month start
idx_hourly = pd.date_range('2023-06-01', periods=24*7, freq='h')

# ── Parsing from strings ──────────────────────────────────────────────────
df = pd.DataFrame({
    'date': ['2023-01-01', '2023-01-02', '2023-01-03'],
    'sales': [100, 120, 115],
})
df['date'] = pd.to_datetime(df['date'])
df = df.set_index('date')

# ── From epoch timestamps ─────────────────────────────────────────────────
timestamps = [1672531200, 1672617600, 1672704000]  # Unix seconds
idx_from_epoch = pd.to_datetime(timestamps, unit='s')

# ── Accessing components ──────────────────────────────────────────────────
df.index.year         # array of years
df.index.month        # 1-12
df.index.day          # 1-31
df.index.dayofweek    # 0=Monday, 6=Sunday
df.index.quarter      # 1-4
df.index.is_month_end # boolean: last day of month?

# ── Slicing with strings ──────────────────────────────────────────────────
df['2023']                     # all of 2023
df['2023-06':'2023-08']        # June–August 2023
df.loc['2023-01-15':'2023-02-28']  # date range slice`})]}),t==="resample"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Resampling: Frequency Conversion"}),e.jsxs("p",{children:[e.jsx("code",{children:"resample()"})," groups data by time frequency, similar to"," ",e.jsx("code",{children:"groupby()"})," but for time. Use it to downsample (daily → monthly) or upsample (monthly → daily with interpolation)."]}),e.jsx(s,{code:`import pandas as pd
import numpy as np

# Create daily data
idx = pd.date_range('2023-01-01', periods=365, freq='D')
df = pd.DataFrame({'sales': np.random.normal(100, 20, 365)}, index=idx)

# ── Downsampling (aggregation) ────────────────────────────────────────────
monthly_sum   = df.resample('MS').sum()      # month-start, sum
weekly_mean   = df.resample('W').mean()      # week-end, mean
quarterly_max = df.resample('QS').max()      # quarter-start, max
annual_total  = df.resample('YS').sum()      # year-start, sum

# Multiple aggregations at once
monthly_stats = df.resample('MS').agg({
    'sales': ['sum', 'mean', 'std', 'count']
})

# ── Upsampling (interpolation) ────────────────────────────────────────────
monthly_data = pd.DataFrame(
    {'sales': [100, 120, 95, 140]},
    index=pd.date_range('2023-01', periods=4, freq='MS')
)
# Forward fill to daily
daily_ffill = monthly_data.resample('D').ffill()
# Linear interpolation to daily
daily_interp = monthly_data.resample('D').interpolate('linear')
# Nearest value
daily_nearest = monthly_data.resample('D').nearest()

# ── OHLCV aggregation for financial data ─────────────────────────────────
price = pd.Series(np.random.normal(100, 5, 365 * 24),
                  index=pd.date_range('2023-01-01', periods=365*24, freq='h'))
daily_ohlcv = price.resample('D').ohlc()  # open, high, low, close`}),e.jsxs("div",{className:"my-4",children:[e.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Resampling aggregation comparison (synthetic retail data)"}),e.jsx(h,{width:"100%",height:240,children:e.jsxs(w,{data:H,children:[e.jsx(f,{strokeDasharray:"3 3"}),e.jsx(u,{dataKey:"period"}),e.jsx(g,{domain:[120,185]}),e.jsx(_,{}),e.jsx(j,{}),e.jsx(o,{type:"monotone",dataKey:"daily_avg",stroke:"#374151",strokeWidth:1,dot:!1,name:"Daily avg"}),e.jsx(o,{type:"monotone",dataKey:"weekly_avg",stroke:"#6366f1",strokeWidth:2,dot:!1,name:"Weekly avg"}),e.jsx(o,{type:"monotone",dataKey:"monthly",stroke:"#f59e0b",strokeWidth:2,dot:{r:5},name:"Monthly"})]})})]})]}),t==="rolling"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Rolling Windows: Moving Statistics"}),e.jsx("p",{children:"Rolling windows compute statistics over a sliding window of fixed size. They are the primary tool for creating lag-based features and for smoothing noisy series."}),e.jsx(s,{code:`import pandas as pd
import numpy as np

idx = pd.date_range('2023-01-01', periods=365, freq='D')
df = pd.DataFrame({'y': np.random.normal(100, 20, 365)}, index=idx)

# ── Basic rolling statistics ──────────────────────────────────────────────
df['ma_7']   = df['y'].rolling(7).mean()     # 7-day moving average
df['ma_28']  = df['y'].rolling(28).mean()    # 28-day moving average
df['std_7']  = df['y'].rolling(7).std()      # 7-day rolling std dev
df['min_7']  = df['y'].rolling(7).min()      # rolling minimum
df['max_7']  = df['y'].rolling(7).max()      # rolling maximum
df['sum_7']  = df['y'].rolling(7).sum()      # rolling sum
df['med_7']  = df['y'].rolling(7).median()   # rolling median

# ── Centered vs. trailing windows ────────────────────────────────────────
# Default: trailing (current + n-1 past values) — safe for forecasting
df['ma_7_trailing']  = df['y'].rolling(7).mean()
# Centered: uses n//2 values before AND after — only for visualization/analysis
df['ma_7_centered']  = df['y'].rolling(7, center=True).mean()

# ── Minimum periods: handle NaN at start ─────────────────────────────────
df['ma_7_minp'] = df['y'].rolling(7, min_periods=1).mean()

# ── Exponentially weighted moving average (EWMA) ─────────────────────────
df['ewma_7']  = df['y'].ewm(span=7).mean()    # span ~ window size
df['ewma_hl'] = df['y'].ewm(halflife=3).mean() # half-life in periods

# ── Rolling correlation (feature for multivariate) ───────────────────────
df['price'] = np.random.normal(50, 5, 365)
df['price_sales_corr_30'] = df['y'].rolling(30).corr(df['price'])

# ── Custom rolling functions ──────────────────────────────────────────────
df['cv_7'] = df['y'].rolling(7).std() / df['y'].rolling(7).mean()  # coeff of variation

# For complex functions use .apply() — slower but flexible
df['range_7'] = df['y'].rolling(7).apply(lambda x: x.max() - x.min())`})]}),t==="shift"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Shift: Lag and Lead Features"}),e.jsxs("p",{children:[e.jsx("code",{children:"shift(n)"})," moves data n periods forward (positive n = lag) or backward (negative n = lead). This is the primary way to create autoregressive features for ML models and to compute period-over-period changes."]}),e.jsx(s,{code:`import pandas as pd
import numpy as np

idx = pd.date_range('2023-01-01', periods=52, freq='W')
df = pd.DataFrame({'y': np.random.normal(200, 30, 52)}, index=idx)

# ── Lag features ──────────────────────────────────────────────────────────
df['lag_1']  = df['y'].shift(1)   # last week's value
df['lag_4']  = df['y'].shift(4)   # 4 weeks ago (1 month)
df['lag_52'] = df['y'].shift(52)  # same week last year

# ── Period-over-period changes ────────────────────────────────────────────
df['wow_change']  = df['y'] - df['y'].shift(1)           # absolute WoW
df['wow_pct']     = df['y'].pct_change(1)                 # % WoW
df['yoy_pct']     = df['y'].pct_change(52)                # % YoY
df['yoy_change']  = df['y'] - df['y'].shift(52)           # absolute YoY

# ── Rolling lag combinations (common ML features) ─────────────────────────
df['lag1_ma7']   = df['y'].shift(1).rolling(7).mean()     # MA of last 7, starting from lag-1
df['lag1_std7']  = df['y'].shift(1).rolling(7).std()

# ── Diff: remove trend ────────────────────────────────────────────────────
df['diff_1']  = df['y'].diff(1)     # first difference
df['diff_52'] = df['y'].diff(52)    # seasonal difference (52 weeks)

# ── Percent rank (cross-sectional normalization) ──────────────────────────
df['pct_rank'] = df['y'].rank(pct=True)

# ── Lead (future value) — for target creation, not features! ─────────────
df['next_week_y'] = df['y'].shift(-1)   # target: next week's value
# Drop last row where target is NaN
df_model = df.dropna(subset=['next_week_y'])

# ── Building a complete feature matrix ───────────────────────────────────
feature_cols = ['lag_1', 'lag_4', 'lag_52', 'lag1_ma7', 'lag1_std7',
                'wow_pct', 'yoy_pct']
X = df[feature_cols].dropna()
y = df.loc[X.index, 'next_week_y']
print(f"Feature matrix shape: {X.shape}")`})]}),t==="tz"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Time Zones and Business Calendars"}),e.jsx(s,{code:`import pandas as pd
import numpy as np

# ── Time zone localization ─────────────────────────────────────────────────
idx_naive = pd.date_range('2023-01-01', periods=100, freq='h')
idx_utc   = idx_naive.tz_localize('UTC')
idx_ny    = idx_utc.tz_convert('America/New_York')
idx_lon   = idx_utc.tz_convert('Europe/London')

# Series with timezone
s = pd.Series(range(100), index=idx_utc)
s_ny = s.tz_convert('America/New_York')

# ── Business day calendar ─────────────────────────────────────────────────
# B = business days (Mon–Fri), BMS = business month start
biz_days = pd.date_range('2023-01-01', '2023-12-31', freq='B')
print(f"Business days in 2023: {len(biz_days)}")  # ~261

# Custom calendar with US holidays
from pandas.tseries.holiday import USFederalHolidayCalendar
cal = USFederalHolidayCalendar()
biz_us = pd.bdate_range('2023-01-01', '2023-12-31', holidays=cal.holidays())
print(f"US trading days in 2023: {len(biz_us)}")  # ~251

# ── Filling missing dates ─────────────────────────────────────────────────
# A sparse series might have gaps; fill them before rolling
sparse_idx = pd.to_datetime(['2023-01-01', '2023-01-03', '2023-01-07'])
sparse = pd.Series([100, 110, 95], index=sparse_idx)
# Reindex to daily, then fill
daily_idx = pd.date_range(sparse.index.min(), sparse.index.max(), freq='D')
sparse_daily = sparse.reindex(daily_idx)
sparse_filled_ffill = sparse_daily.fillna(method='ffill')
sparse_filled_interp = sparse_daily.interpolate('linear')

# ── PeriodIndex for fiscal calendars ─────────────────────────────────────
quarters = pd.period_range('2020Q1', periods=16, freq='Q')
df_quarterly = pd.DataFrame({'revenue': np.random.normal(1000, 100, 16)},
                             index=quarters)
# Convert Period to Timestamp for plotting
df_quarterly.index = df_quarterly.index.to_timestamp()

# ── Useful time-based features ────────────────────────────────────────────
df = pd.DataFrame({'y': range(365)},
                  index=pd.date_range('2023-01-01', periods=365, freq='D'))
df['day_of_week']   = df.index.dayofweek          # 0–6
df['day_of_year']   = df.index.dayofyear           # 1–365
df['week_of_year']  = df.index.isocalendar().week.astype(int)
df['month']         = df.index.month               # 1–12
df['quarter']       = df.index.quarter             # 1–4
df['is_weekend']    = df.index.dayofweek >= 5      # bool
df['is_month_end']  = df.index.is_month_end        # bool
df['is_month_start'] = df.index.is_month_start     # bool
# Fourier features for cyclicality
df['sin_dow'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
df['cos_dow'] = np.cos(2 * np.pi * df['day_of_week'] / 7)`})]}),e.jsx("h2",{children:"Common Patterns Reference"}),e.jsx(s,{code:`# ── Complete preprocessing pipeline ─────────────────────────────────────
import pandas as pd
import numpy as np

def prepare_ts(df: pd.DataFrame, date_col: str, value_col: str,
               freq: str = 'D') -> pd.DataFrame:
    """Standard time series preprocessing pipeline."""
    df = df.copy()
    # 1. Parse and set datetime index
    df[date_col] = pd.to_datetime(df[date_col])
    df = df.set_index(date_col).sort_index()

    # 2. Ensure complete date range (fill gaps)
    full_idx = pd.date_range(df.index.min(), df.index.max(), freq=freq)
    df = df.reindex(full_idx)

    # 3. Interpolate missing values (up to 3 consecutive)
    df[value_col] = df[value_col].interpolate('linear', limit=3)

    # 4. Forward-fill remaining (e.g., extended gaps)
    df[value_col] = df[value_col].fillna(method='ffill').fillna(method='bfill')

    # 5. Log-transform (if all positive)
    if (df[value_col] > 0).all():
        df['log_y'] = np.log1p(df[value_col])

    # 6. Feature engineering
    df['lag_1']       = df[value_col].shift(1)
    df['lag_7']       = df[value_col].shift(7)
    df['lag_28']      = df[value_col].shift(28)
    df['roll_mean_7'] = df[value_col].shift(1).rolling(7).mean()
    df['roll_std_7']  = df[value_col].shift(1).rolling(7).std()
    df['day_of_week'] = df.index.dayofweek
    df['month']       = df.index.month

    return df.dropna()`}),e.jsxs(d,{children:["Always use ",e.jsx("code",{children:"shift(1)"})," before ",e.jsx("code",{children:"rolling()"})," when creating features for ML models. Without the shift, the rolling window includes the current value, which would constitute target leakage during training."]}),e.jsxs(p,{children:[e.jsx("code",{children:"fillna(method='ffill')"})," and ",e.jsx("code",{children:"bfill"})," are deprecated in recent pandas versions. Use ",e.jsx("code",{children:"fillna(method='ffill')"})," for pandas < 2.2, or",e.jsx("code",{children:"ffill()"})," / ",e.jsx("code",{children:"bfill()"})," as standalone methods in pandas ≥ 2.2."]}),e.jsx("h2",{children:"Performance Tips"}),e.jsxs("ul",{className:"list-disc pl-6 space-y-2",children:[e.jsxs("li",{children:["Use ",e.jsx("code",{children:"pd.Timestamp"})," comparisons rather than string slicing in hot paths — string parsing has overhead."]}),e.jsxs("li",{children:["For large DataFrames, ",e.jsx("code",{children:"resample().transform()"})," is faster than ",e.jsx("code",{children:"apply()"})," for simple aggregations."]}),e.jsxs("li",{children:["Store time series in ",e.jsx("strong",{children:"Parquet"})," format with a sorted datetime index — predicate pushdown on dates is extremely fast."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"pd.CategoricalIndex"})," for ",e.jsx("code",{children:"unique_id"})," columns in multi-series DataFrames to reduce memory by 5–10x."]}),e.jsxs("li",{children:[e.jsx("code",{children:"df.index.get_loc()"})," on a sorted DatetimeIndex is O(log n); unsorted is O(n). Always sort."]})]}),e.jsx(c,{references:[{authors:"McKinney, W.",year:2017,title:"Python for Data Analysis: Data Wrangling with Pandas, NumPy, and IPython (2nd ed.)",journal:"O'Reilly Media"},{authors:"pandas development team",year:2024,title:"pandas documentation: Time series / date functionality",journal:"pandas.pydata.org"}]})]})}const ne=Object.freeze(Object.defineProperty({__proto__:null,default:V},Symbol.toStringTag,{value:"Module"})),D={title:"Polars for Fast Data Processing",difficulty:"intermediate",readingTime:10,description:"Use Polars for high-performance time series data processing: lazy evaluation, rolling expressions, and seamless integration with forecasting libraries."};function Q(){return e.jsxs(l,{title:"Polars for Fast Data Processing",metadata:D,children:[e.jsx("p",{children:"Polars is a high-performance DataFrame library written in Rust, designed to be a faster replacement for pandas. For large-scale forecasting pipelines processing millions of rows across thousands of series, Polars can be 5-50x faster than pandas due to its columnar execution engine, lazy evaluation, and automatic query optimization."}),e.jsx("h2",{children:"Polars vs Pandas for Forecasting"}),e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",marginBottom:"1rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"#f3f4f6"},children:[e.jsx("th",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Feature"}),e.jsx("th",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"pandas"}),e.jsx("th",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Polars"})]})}),e.jsx("tbody",{children:[["Execution model","Eager (row-by-row)","Lazy + columnar (Rust)"],["Multi-threading","Limited (GIL)","Automatic across all cores"],["Memory efficiency","Moderate (copies)","High (zero-copy, Arrow)"],["GroupBy + rolling","Slow for large groups","5-20x faster"],["Query optimization","None","Automatic predicate pushdown"],["pandas interop","Native","Easy conversion: .to_pandas()"],["Ecosystem integration","Excellent","Growing (direct support in StatsForecast)"]].map(([t,r,a])=>e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"0.6rem",border:"1px solid #e5e7eb",fontWeight:500},children:t}),e.jsx("td",{style:{padding:"0.6rem",border:"1px solid #e5e7eb"},children:r}),e.jsx("td",{style:{padding:"0.6rem",border:"1px solid #e5e7eb"},children:a})]},t))})]})}),e.jsxs(m,{title:"Lazy Evaluation in Polars",children:["Polars' ",e.jsx("strong",{children:"lazy API"})," (",e.jsx("code",{children:"pl.scan_parquet()"}),", ",e.jsx("code",{children:"df.lazy()"}),") builds a query plan without executing it. When you call ",e.jsx("code",{children:".collect()"}),", Polars optimizes the full query: pushing filters early, eliminating unused columns, and parallelizing independent operations. This is equivalent to database query planning and can dramatically reduce memory usage and execution time for complex pipelines."]}),e.jsx("h2",{children:"Time Series Operations in Polars"}),e.jsx("p",{children:"Polars has first-class datetime support with a rich expression API for time series operations:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"pl.col('date').dt.year()"}),", ",e.jsx("code",{children:".dt.month()"}),", ",e.jsx("code",{children:".dt.weekday()"})," — date components"]}),e.jsxs("li",{children:[e.jsx("code",{children:".rolling_mean(window_size=7)"})," — moving average (grouped or ungrouped)"]}),e.jsxs("li",{children:[e.jsx("code",{children:".shift(n)"})," — lag creation"]}),e.jsxs("li",{children:[e.jsx("code",{children:"group_by_dynamic()"})," — time-based groupby (replaces pandas resample)"]}),e.jsxs("li",{children:[e.jsx("code",{children:"upsample()"})," — frequency upsampling with fill strategies"]})]}),e.jsxs(d,{title:"group_by vs group_by_dynamic",children:["Polars distinguishes between ",e.jsx("code",{children:"group_by()"})," (static groups, like series_id) and",e.jsx("code",{children:"group_by_dynamic()"})," (time-based windows). For forecasting feature engineering, you typically use ",e.jsx("code",{children:"group_by('unique_id').agg([...])"})," for per-series statistics and ",e.jsx("code",{children:"group_by_dynamic('ds', every='1w')"})," for temporal aggregations."]}),e.jsx(s,{code:`import polars as pl
import numpy as np
import pandas as pd
from datetime import date, timedelta

# ── Generate panel data ───────────────────────────────────────────────────────
np.random.seed(42)
N_SERIES = 1000
T = 365

records = []
for sid in range(N_SERIES):
    dates = [date(2023, 1, 1) + timedelta(days=i) for i in range(T)]
    base = np.random.uniform(100, 1000)
    y = (base + 0.2 * np.arange(T)
         + base * 0.1 * np.sin(2 * np.pi * np.arange(T) / 7)
         + np.random.randn(T) * base * 0.05)
    records.extend({
        'unique_id': f'S{sid:04d}',
        'ds': d,
        'y': float(max(0, v))
    } for d, v in zip(dates, y))

df = pl.DataFrame(records).with_columns(pl.col('ds').cast(pl.Date))
print(f"Shape: {df.shape}")
print(df.dtypes)

# ── Time features ─────────────────────────────────────────────────────────────
df = df.with_columns([
    pl.col('ds').dt.year().alias('year'),
    pl.col('ds').dt.month().alias('month'),
    pl.col('ds').dt.weekday().alias('day_of_week'),  # 0=Mon
    pl.col('ds').dt.day_of_year().alias('day_of_year'),
    (2 * np.pi * pl.col('ds').dt.weekday() / 7).sin().alias('sin_dow'),
    (2 * np.pi * pl.col('ds').dt.weekday() / 7).cos().alias('cos_dow'),
])

# ── Lag features (per series) ─────────────────────────────────────────────────
# Sort first — required for correct lag computation
df = df.sort(['unique_id', 'ds'])

df = df.with_columns([
    pl.col('y').shift(1).over('unique_id').alias('lag_1'),
    pl.col('y').shift(7).over('unique_id').alias('lag_7'),
    pl.col('y').shift(28).over('unique_id').alias('lag_28'),
    pl.col('y').shift(365).over('unique_id').alias('lag_365'),
])

# ── Rolling statistics (per series) ───────────────────────────────────────────
df = df.with_columns([
    pl.col('y').shift(1).rolling_mean(7).over('unique_id').alias('roll_mean_7'),
    pl.col('y').shift(1).rolling_mean(28).over('unique_id').alias('roll_mean_28'),
    pl.col('y').shift(1).rolling_std(7).over('unique_id').alias('roll_std_7'),
    pl.col('y').shift(1).rolling_min(7).over('unique_id').alias('roll_min_7'),
    pl.col('y').shift(1).rolling_max(7).over('unique_id').alias('roll_max_7'),
])

print(f"After feature engineering: {df.shape}")
print(df.select(['unique_id', 'ds', 'y', 'lag_1', 'roll_mean_7']).head())

# ── Temporal aggregation with group_by_dynamic ────────────────────────────────
weekly_df = (
    df.filter(pl.col('unique_id') == 'S0000')
    .sort('ds')
    .group_by_dynamic('ds', every='1w')
    .agg([
        pl.col('y').mean().alias('weekly_mean'),
        pl.col('y').sum().alias('weekly_sum'),
        pl.col('y').std().alias('weekly_std'),
    ])
)
print("\\nWeekly aggregation:")
print(weekly_df.head())

# ── Lazy evaluation pipeline ──────────────────────────────────────────────────
# Much more memory-efficient for large datasets
lazy_result = (
    pl.scan_csv('/tmp/sales.csv')  # doesn't load data yet
    if False else
    df.lazy()  # use existing DataFrame
)

# Build query plan
feature_query = (
    lazy_result
    .filter(pl.col('y') > 0)
    .sort(['unique_id', 'ds'])
    .with_columns([
        pl.col('y').shift(1).over('unique_id').alias('lag_1'),
        pl.col('y').shift(1).rolling_mean(7).over('unique_id').alias('roll_mean_7'),
    ])
    .select(['unique_id', 'ds', 'y', 'lag_1', 'roll_mean_7'])
    .drop_nulls()
)

# Execute the optimized query
result = feature_query.collect()
print(f"\\nLazy query result: {result.shape}")

# ── Convert to pandas for StatsForecast ───────────────────────────────────────
sf_input = df.select(['unique_id', 'ds', 'y']).to_pandas()
sf_input['ds'] = pd.to_datetime(sf_input['ds'])

from statsforecast import StatsForecast
from statsforecast.models import AutoETS

sf = StatsForecast(models=[AutoETS(season_length=7)], freq='D', n_jobs=-1)
sf.fit(sf_input.groupby('unique_id').tail(90))  # use last 90 days for speed
forecasts_pd = sf.predict(h=7)

# Convert back to Polars
forecasts_pl = pl.from_pandas(forecasts_pd)
print("\\nForecasts (Polars):", forecasts_pl.shape)

# ── Performance benchmark ─────────────────────────────────────────────────────
import time

# Polars lag + rolling (per group)
t0 = time.time()
_ = (df.lazy()
       .sort(['unique_id', 'ds'])
       .with_columns([pl.col('y').shift(1).rolling_mean(7).over('unique_id')])
       .collect())
polars_time = time.time() - t0

# pandas equivalent
df_pd = df.to_pandas()
t0 = time.time()
df_pd['roll_mean_7'] = (df_pd.sort_values(['unique_id', 'ds'])
                         .groupby('unique_id')['y']
                         .transform(lambda x: x.shift(1).rolling(7).mean()))
pandas_time = time.time() - t0

print(f"\\nRolling mean ({N_SERIES} series × {T} obs):")
print(f"  Polars: {polars_time:.2f}s")
print(f"  pandas: {pandas_time:.2f}s")
print(f"  Speedup: {pandas_time/polars_time:.1f}x")
`}),e.jsxs(p,{title:"over() vs sort_keys in Polars",children:["The ",e.jsx("code",{children:".over('unique_id')"})," expression in Polars sorts by default within the group context. However, for time-dependent operations like ",e.jsx("code",{children:"shift()"})," and",e.jsx("code",{children:"rolling_mean()"}),", you must ",e.jsx("strong",{children:"sort the DataFrame by (unique_id, ds) first"}),"with ",e.jsx("code",{children:"df.sort(['unique_id', 'ds'])"}),". Otherwise, lags may refer to the wrong time steps."]}),e.jsx(c,{references:[{title:"Polars: Blazingly Fast DataFrames in Rust and Python",authors:"Vink, R.",year:2024,url:"https://pola.rs/"},{title:"Apache Arrow: A Cross-Language Development Platform for In-Memory Data",authors:"Apache Software Foundation",year:2016,url:"https://arrow.apache.org/"}]})]})}const le=Object.freeze(Object.defineProperty({__proto__:null,default:Q,metadata:D},Symbol.toStringTag,{value:"Module"})),R={title:"Forecasting Visualization",difficulty:"beginner",readingTime:8,description:"Create clear, informative forecasting visualizations: time series plots, fan charts for uncertainty, ACF/PACF plots, and interactive Plotly charts."};function J(){return e.jsxs(l,{title:"Forecasting Visualization",metadata:R,children:[e.jsx("p",{children:"Clear visualization is essential throughout the forecasting workflow: exploratory analysis, model diagnostics, and communicating results to stakeholders. This section covers the essential plot types using matplotlib for publication-quality static charts and Plotly for interactive exploration."}),e.jsx("h2",{children:"Essential Plot Types for Forecasting"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Time series plot:"})," The baseline — always start by plotting your data"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Fan chart:"})," Visualize prediction intervals at multiple coverage levels"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ACF/PACF:"})," Diagnose autocorrelation structure and AR/MA order"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Residual plots:"})," Assess model fit and check for systematic errors"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Forecast comparison:"})," Compare multiple models on the same axes"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Decomposition:"})," Trend, seasonal, and residual components"]})]}),e.jsxs(m,{title:"Fan Chart",children:["A ",e.jsx("strong",{children:"fan chart"})," displays a central forecast surrounded by shaded bands representing prediction intervals at multiple coverage levels (e.g., 50%, 80%, 95%). The bands typically use a sequential colormap — darker near the center (high confidence), lighter at the edges (low confidence) — providing an intuitive visualization of forecast uncertainty that widens over the horizon."]}),e.jsx("h2",{children:"Matplotlib: Time Series and Fan Charts"}),e.jsx(s,{code:`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA, AutoETS

# ── Generate sample data ──────────────────────────────────────────────────────
np.random.seed(42)
T = 156  # 3 years weekly
t = np.arange(T)
y = 100 + 0.4 * t + 15 * np.sin(2 * np.pi * t / 52) + np.random.randn(T) * 6
dates = pd.date_range('2021-01-01', periods=T, freq='W')

df = pd.DataFrame({'unique_id': 'series_1', 'ds': dates, 'y': y})
train = df.iloc[:-12]
test  = df.iloc[-12:]

# Fit and get forecast with PIs
sf = StatsForecast(models=[AutoARIMA(season_length=52)], freq='W', n_jobs=1)
sf.fit(train)
fc = sf.predict(h=12, level=[50, 80, 95])

# ── 1. Basic time series + forecast plot ─────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 5))

ax.plot(train['ds'], train['y'], color='#1f2937', lw=1.5, label='Historical')
ax.plot(test['ds'], test['y'], color='#6b7280', lw=1.5, ls='--', label='Actual (holdout)')

# Fan chart: multiple PI levels
model = 'AutoARIMA'
ax.fill_between(fc['ds'],
    fc[f'{model}-lo-95'], fc[f'{model}-hi-95'],
    alpha=0.15, color='#6366f1', label='95% PI')
ax.fill_between(fc['ds'],
    fc[f'{model}-lo-80'], fc[f'{model}-hi-80'],
    alpha=0.25, color='#6366f1', label='80% PI')
ax.fill_between(fc['ds'],
    fc[f'{model}-lo-50'], fc[f'{model}-hi-50'],
    alpha=0.40, color='#6366f1', label='50% PI')
ax.plot(fc['ds'], fc[model], color='#6366f1', lw=2, label='Forecast')

ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
ax.xaxis.set_major_locator(mdates.MonthLocator(interval=6))
plt.xticks(rotation=30)
ax.set_xlabel('Date')
ax.set_ylabel('Value')
ax.set_title('AutoARIMA Forecast with Prediction Intervals', fontsize=13)
ax.legend(loc='upper left', fontsize=9)
ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('forecast_fan_chart.png', dpi=150)
plt.show()

# ── 2. Multi-model comparison plot ───────────────────────────────────────────
sf2 = StatsForecast(
    models=[AutoARIMA(season_length=52), AutoETS(season_length=52)],
    freq='W', n_jobs=1
)
sf2.fit(train)
fc2 = sf2.predict(h=12, level=[95])

fig, ax = plt.subplots(figsize=(12, 5))
ax.plot(train['ds'], train['y'], color='#1f2937', lw=1.5, label='Historical')
ax.plot(test['ds'], test['y'], color='#6b7280', lw=1.5, ls='--', label='Actual')

colors = {'AutoARIMA': '#6366f1', 'AutoETS': '#f59e0b'}
for model_name, color in colors.items():
    ax.fill_between(fc2['ds'],
        fc2[f'{model_name}-lo-95'], fc2[f'{model_name}-hi-95'],
        alpha=0.15, color=color)
    ax.plot(fc2['ds'], fc2[model_name], color=color, lw=2, label=model_name)

ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
ax.legend()
ax.set_title('AutoARIMA vs AutoETS Forecast Comparison')
ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('model_comparison.png', dpi=150)
plt.show()
`}),e.jsx("h2",{children:"ACF and PACF Plots"}),e.jsx(s,{code:`import matplotlib.pyplot as plt
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.stattools import acf, pacf
import numpy as np
import pandas as pd

# ── ACF and PACF side by side ─────────────────────────────────────────────────
np.random.seed(42)
y = np.cumsum(np.random.randn(200)) + 50  # random walk with trend

fig, axes = plt.subplots(1, 2, figsize=(13, 4))

plot_acf(y, lags=40, ax=axes[0], alpha=0.05)
axes[0].set_title('Autocorrelation Function (ACF)', fontsize=12)
axes[0].set_xlabel('Lag')

plot_pacf(y, lags=40, ax=axes[1], alpha=0.05, method='ywm')
axes[1].set_title('Partial Autocorrelation Function (PACF)', fontsize=12)
axes[1].set_xlabel('Lag')

plt.tight_layout()
plt.savefig('acf_pacf.png', dpi=150)
plt.show()

# ── Residual diagnostic plots ─────────────────────────────────────────────────
from statsmodels.tsa.statespace.sarimax import SARIMAX

dates = pd.date_range('2019-01-01', periods=200, freq='W')
series = pd.Series(y, index=dates)

model = SARIMAX(series, order=(1, 1, 1))
result = model.fit(disp=False)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Residuals over time
residuals = result.resid
axes[0, 0].plot(series.index, residuals, color='#6366f1', lw=1)
axes[0, 0].axhline(0, color='red', lw=0.5, ls='--')
axes[0, 0].set_title('Residuals Over Time')
axes[0, 0].set_xlabel('Date')

# Residual histogram
axes[0, 1].hist(residuals, bins=30, color='#6366f1', edgecolor='white', alpha=0.8)
axes[0, 1].set_title('Residual Distribution')
axes[0, 1].set_xlabel('Residual')

# ACF of residuals
plot_acf(residuals, lags=20, ax=axes[1, 0], alpha=0.05)
axes[1, 0].set_title('ACF of Residuals (should be white noise)')

# QQ plot
from scipy import stats
stats.probplot(residuals, dist='norm', plot=axes[1, 1])
axes[1, 1].set_title('Normal Q-Q Plot')

plt.suptitle('ARIMA Residual Diagnostics', fontsize=13, y=1.01)
plt.tight_layout()
plt.savefig('residual_diagnostics.png', dpi=150)
plt.show()
`}),e.jsx("h2",{children:"Plotly: Interactive Forecast Charts"}),e.jsx(s,{code:`import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import numpy as np
import pandas as pd

# ── Interactive fan chart with Plotly ─────────────────────────────────────────
np.random.seed(42)
T_hist = 100
T_fc   = 20
t_hist = np.arange(T_hist)
y_hist = 50 + 0.3 * t_hist + 8 * np.sin(2 * np.pi * t_hist / 52) + np.random.randn(T_hist) * 3

# Simulate forecast + intervals
t_fc = np.arange(T_hist, T_hist + T_fc)
y_fc = 50 + 0.3 * t_fc + 8 * np.sin(2 * np.pi * t_fc / 52)
growing_noise = np.linspace(3, 10, T_fc)
lo_95 = y_fc - 1.96 * growing_noise
hi_95 = y_fc + 1.96 * growing_noise
lo_80 = y_fc - 1.28 * growing_noise
hi_80 = y_fc + 1.28 * growing_noise
lo_50 = y_fc - 0.67 * growing_noise
hi_50 = y_fc + 0.67 * growing_noise

fig = go.Figure()

# Historical series
fig.add_trace(go.Scatter(
    x=list(t_hist), y=list(y_hist),
    mode='lines', name='Historical',
    line=dict(color='#1f2937', width=2)
))

# PI bands (plotly convention: fill 'tonexty' or use fill between traces)
fig.add_trace(go.Scatter(
    x=list(t_fc) + list(t_fc[::-1]),
    y=list(hi_95) + list(lo_95[::-1]),
    fill='toself', fillcolor='rgba(99, 102, 241, 0.1)',
    line=dict(color='rgba(99, 102, 241, 0)'),
    name='95% PI', showlegend=True
))
fig.add_trace(go.Scatter(
    x=list(t_fc) + list(t_fc[::-1]),
    y=list(hi_80) + list(lo_80[::-1]),
    fill='toself', fillcolor='rgba(99, 102, 241, 0.2)',
    line=dict(color='rgba(99, 102, 241, 0)'),
    name='80% PI'
))
fig.add_trace(go.Scatter(
    x=list(t_fc) + list(t_fc[::-1]),
    y=list(hi_50) + list(lo_50[::-1]),
    fill='toself', fillcolor='rgba(99, 102, 241, 0.35)',
    line=dict(color='rgba(99, 102, 241, 0)'),
    name='50% PI'
))
fig.add_trace(go.Scatter(
    x=list(t_fc), y=list(y_fc),
    mode='lines', name='Forecast',
    line=dict(color='#6366f1', width=2, dash='dash')
))

fig.update_layout(
    title='Interactive Forecast Fan Chart',
    xaxis_title='Time', yaxis_title='Value',
    hovermode='x unified',
    template='plotly_white',
    legend=dict(yanchor='top', y=0.99, xanchor='left', x=0.01)
)
fig.write_html('forecast_interactive.html')
# fig.show()  # uncomment in Jupyter

# ── STL Decomposition visualization ──────────────────────────────────────────
from statsmodels.tsa.seasonal import STL

dates = pd.date_range('2019-01-01', periods=200, freq='W')
y = pd.Series(y_hist, index=dates[:T_hist])

stl = STL(y, period=52, robust=True)
stl_result = stl.fit()

fig2 = make_subplots(rows=4, cols=1, shared_xaxes=True,
                     subplot_titles=['Observed', 'Trend', 'Seasonal', 'Residual'],
                     vertical_spacing=0.06)

components = [
    (stl_result.observed, '#1f2937'),
    (stl_result.trend,    '#6366f1'),
    (stl_result.seasonal, '#f59e0b'),
    (stl_result.resid,    '#ef4444'),
]
for i, (comp, color) in enumerate(components, 1):
    fig2.add_trace(
        go.Scatter(x=dates[:T_hist], y=comp,
                   mode='lines', line=dict(color=color, width=1.5),
                   showlegend=False),
        row=i, col=1
    )

fig2.update_layout(height=700, title_text='STL Decomposition', template='plotly_white')
fig2.write_html('stl_decomposition.html')
print("Saved interactive charts to HTML files.")
`}),e.jsxs(d,{title:"Matplotlib vs Plotly for Forecasting",children:["Use matplotlib for:",e.jsxs("ul",{children:[e.jsx("li",{children:"Publication-quality static figures (papers, reports, PDFs)"}),e.jsx("li",{children:"Complex multi-panel diagnostic layouts"}),e.jsx("li",{children:"ACF/PACF (statsmodels integrates with matplotlib natively)"})]}),"Use Plotly for:",e.jsxs("ul",{children:[e.jsx("li",{children:"Dashboards and web applications (Dash, Streamlit)"}),e.jsx("li",{children:"Exploring many series interactively (hover, zoom, pan)"}),e.jsx("li",{children:"Presentations where interactive zooming adds value"})]})]}),e.jsx(c,{references:[{title:"Matplotlib: A 2D Graphics Environment",authors:"Hunter, J.D.",year:2007,journal:"Computing in Science & Engineering"},{title:"Plotly Python Open Source Graphing Library",authors:"Plotly Technologies Inc.",year:2015,url:"https://plotly.com/python/"}]})]})}const de=Object.freeze(Object.defineProperty({__proto__:null,default:J,metadata:R},Symbol.toStringTag,{value:"Module"}));export{se as a,ae as b,te as c,re as d,ie as e,oe as f,ne as g,le as h,de as i,ee as s};
