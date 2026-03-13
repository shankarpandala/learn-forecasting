import{j as e,r as S}from"./vendor-CnSysweu.js";import{r as a}from"./vendor-katex-CdqB51LS.js";import{S as u,D as h,W as f,N as g,P as s,R as x,T as _,E as b}from"./subject-01-ts-foundations-fmj7uPpc.js";import{R as M,L,C as N,X as z,Y as T,T as B,d as C,a as v,B as A,c as R}from"./vendor-charts-BucFqer8.js";const k=[10,13,11,15,14,18,17,20,19,22];function P(){const[t,o]=S.useState(3),i=k.map((r,n)=>{const l={t:n+1,y:r};for(let m=1;m<=t;m++)l[`lag_${m}`]=n-m>=0?k[n-m]:null;return l.roll_mean_3=n>=2?parseFloat(((k[n-2]+k[n-1]+k[n])/3).toFixed(2)):null,l.roll_std_3=n>=2?parseFloat(Math.sqrt(((k[n-2]-l.roll_mean_3)**2+(k[n-1]-l.roll_mean_3)**2+(k[n]-l.roll_mean_3)**2)/2).toFixed(2)):null,l}),d=["t","y",...Array.from({length:t},(r,n)=>`lag_${n+1}`),"roll_mean_3","roll_std_3"];return e.jsxs("div",{className:"my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900",children:[e.jsx("h3",{className:"text-sm font-semibold text-zinc-300 mb-3",children:"Interactive: Tabularizing a Time Series into Lag Features"}),e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsxs("label",{className:"text-sm text-zinc-400",children:["Max lag: ",e.jsx("span",{className:"text-sky-400 font-bold",children:t})]}),e.jsx("input",{type:"range",min:1,max:6,value:t,onChange:r=>o(Number(r.target.value)),className:"w-40 accent-sky-500"})]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"text-xs text-zinc-300 border-collapse",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-zinc-800",children:d.map(r=>e.jsx("th",{className:`border border-zinc-700 px-3 py-2 font-mono whitespace-nowrap ${r==="y"?"text-white bg-sky-900":r.startsWith("lag")?"text-amber-300":r.startsWith("roll")?"text-emerald-300":""}`,children:r},r))})}),e.jsx("tbody",{children:i.map((r,n)=>e.jsx("tr",{className:n%2===0?"":"bg-zinc-800/50",children:d.map(l=>e.jsx("td",{className:`border border-zinc-700 px-3 py-1 text-center ${r[l]===null?"text-zinc-600 italic":l==="y"?"text-white font-medium":l.startsWith("lag")?"text-amber-200":l.startsWith("roll")?"text-emerald-200":""}`,children:r[l]===null?"NaN":r[l]},l))},n))})]})}),e.jsx("p",{className:"text-xs text-zinc-500 mt-2",children:"NaN rows (shown in gray) must be dropped or imputed before training. White = target (y_t), amber = lag features, green = window statistics."})]})}const G=`# Lag Features & Window Statistics for ML Forecasting
# pip install pandas numpy scikit-learn

import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error

# ── 1. Load data ──────────────────────────────────────────────────────────────
np.random.seed(42)
n = 200
t = np.arange(n)
y = 50 + 0.3*t + 5*np.sin(2*np.pi*t/12) + np.random.normal(0, 3, n)
ts = pd.Series(y, index=pd.date_range('2016-01', periods=n, freq='MS'), name='y')

# ── 2. Create lag features ────────────────────────────────────────────────────
def create_lag_features(series, lags):
    df = pd.DataFrame({'y': series})
    for lag in lags:
        df[f'lag_{lag}'] = series.shift(lag)
    return df

lags = [1, 2, 3, 6, 12]  # selected lags (use ACF/PACF to guide this)
df = create_lag_features(ts, lags)
print("Lag features created:")
print(df.head(15))

# ── 3. Rolling window statistics ─────────────────────────────────────────────
# ALL rolling windows must use min_periods or they'll look ahead!
# shift(1) ensures we only use data available at time t-1

windows = [3, 6, 12]
for w in windows:
    shifted = ts.shift(1)  # avoid leakage: use data up to t-1
    df[f'roll_mean_{w}'] = shifted.rolling(w).mean()
    df[f'roll_std_{w}']  = shifted.rolling(w).std()
    df[f'roll_min_{w}']  = shifted.rolling(w).min()
    df[f'roll_max_{w}']  = shifted.rolling(w).max()
    df[f'roll_skew_{w}'] = shifted.rolling(w).skew()

# ── 4. Expanding window features ─────────────────────────────────────────────
# Expanding = use all available history up to t-1
shifted = ts.shift(1)
df['expand_mean'] = shifted.expanding().mean()
df['expand_std']  = shifted.expanding().std()

# ── 5. Calendar features (date-based) ────────────────────────────────────────
df['month']       = df.index.month
df['quarter']     = df.index.quarter
df['month_sin']   = np.sin(2 * np.pi * df.index.month / 12)   # cyclic encoding
df['month_cos']   = np.cos(2 * np.pi * df.index.month / 12)

# ── 6. Drop NaN rows (from lags) ─────────────────────────────────────────────
df_clean = df.dropna()
print(f"\\nShape after dropping NaN: {df_clean.shape}")
print(f"Lost {len(df) - len(df_clean)} rows due to lags")

# ── 7. Train/test split (time-ordered!) ─────────────────────────────────────
cutoff = int(len(df_clean) * 0.8)
X = df_clean.drop(columns=['y'])
y_col = df_clean['y']

X_train, X_test = X.iloc[:cutoff], X.iloc[cutoff:]
y_train, y_test = y_col.iloc[:cutoff], y_col.iloc[cutoff:]

# ── 8. Fit Ridge regression ──────────────────────────────────────────────────
model = Ridge(alpha=1.0)
model.fit(X_train, y_train)
preds = model.predict(X_test)

mae = mean_absolute_error(y_test, preds)
print(f"\\nTest MAE: {mae:.3f}")
print("Feature importances (abs coefficients):")
importance = pd.Series(np.abs(model.coef_), index=X.columns).sort_values(ascending=False)
print(importance.head(10))

# ── 9. Feature selection using ACF/PACF ─────────────────────────────────────
from statsmodels.tsa.stattools import acf, pacf
acf_values  = acf(ts, nlags=15, alpha=0.05)
pacf_values = pacf(ts, nlags=15, alpha=0.05)

# Lags where PACF is significant suggest AR terms → use as lag features
sig_lags = [lag for lag in range(1, 16)
            if abs(pacf_values[0][lag]) > 1.96 / np.sqrt(len(ts))]
print("\\nSignificant PACF lags (suggested lag features):", sig_lags)

# ── 10. Data leakage check ────────────────────────────────────────────────────
def check_leakage(df, target_col):
    """Verify all features are computed from past data only."""
    corr_with_target = df.corr()[target_col].sort_values(ascending=False)
    print("\\nTop correlations with target (check for suspiciously high values):")
    print(corr_with_target.head(10))
    # Perfect correlation (1.0) with a feature other than the target itself is a red flag
    suspicious = corr_with_target[(corr_with_target > 0.995) & (corr_with_target.index != target_col)]
    if len(suspicious) > 0:
        print("WARNING: Potential data leakage detected!")
        print(suspicious)

check_leakage(df_clean, 'y')
`,D=[{label:"Cerqueira 2020",title:"Machine Learning vs Statistical Methods for Time Series Forecasting",authors:"Cerqueira, V., Torgo, L., & Mozetic, I.",year:2020,url:"https://arxiv.org/abs/1911.07549"},{label:"pandas shift",title:"pandas.Series.shift — pandas documentation",authors:"pandas development team",year:2023,url:"https://pandas.pydata.org/docs/reference/api/pandas.Series.shift.html"}];function E(){return e.jsxs(u,{title:"Lag Features & Window Statistics",difficulty:"intermediate",readingTime:20,prerequisites:["Supervised learning basics","ACF and PACF"],children:[e.jsxs("p",{children:["Machine learning algorithms expect tabular input — a feature matrix ",e.jsx(a.InlineMath,{math:"X"})," ","and target vector ",e.jsx(a.InlineMath,{math:"y"}),". Time series are sequential. The key insight for ML forecasting: ",e.jsx("strong",{children:"convert the time series to supervised learning format using lag features"}),"."]}),e.jsx("h2",{children:"1. The Tabularization Trick"}),e.jsx(h,{label:"Definition",title:"Time Series to Supervised Learning",definition:"For a h-step-ahead forecasting problem, the target at row t is y_{t+h} and the features are past values and statistics computed from history up to time t.",notation:"\\underbrace{y_{t+h}}_{\\text{target}} = f\\!\\left(\\underbrace{y_t, y_{t-1}, \\ldots, y_{t-p}}_{\\text{lag features}},\\; \\underbrace{\\bar{y}_{t-w:t}}_{\\text{window stats}},\\; \\underbrace{\\text{calendar}}_{\\text{month, dow}}\\right)"}),e.jsxs("p",{children:["This transformation is sometimes called the ",e.jsx("strong",{children:'"sliding window" or "tabular conversion"'}),". Any supervised learning model (XGBoost, LightGBM, Random Forest, Ridge, Neural Network) can then be applied."]}),e.jsx("h2",{children:"2. Lag Features"}),e.jsxs("p",{children:["Lag features are simply the time series shifted by ",e.jsx(a.InlineMath,{math:"k"})," periods:"]}),e.jsx(a.BlockMath,{math:"x_{t,k} = y_{t-k}, \\quad k = 1, 2, \\ldots, p"}),e.jsxs("p",{children:["The lag order ",e.jsx(a.InlineMath,{math:"p"})," determines how far back the model looks. Guidance: use PACF to identify significant lags (where PACF exceeds ±1.96/√T)."]}),e.jsx("h2",{children:"3. Rolling Window Statistics"}),e.jsx(a.BlockMath,{math:"\\bar{y}^{(w)}_t = \\frac{1}{w}\\sum_{j=1}^{w} y_{t-j}, \\quad \\sigma^{(w)}_t = \\sqrt{\\frac{1}{w-1}\\sum_{j=1}^{w}(y_{t-j} - \\bar{y}^{(w)}_t)^2}"}),e.jsx("p",{children:"Common rolling features:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Rolling mean"}),": captures local level"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Rolling std"}),": captures local volatility"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Rolling min/max"}),": captures range"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Rolling skew"}),": captures distributional shape"]})]}),e.jsxs("p",{children:["Always shift by 1 (",e.jsx("code",{children:"series.shift(1).rolling(w)"}),") before computing rolling statistics to prevent data leakage."]}),e.jsx("h2",{children:"4. Expanding Window Statistics"}),e.jsxs("p",{children:["Expanding windows accumulate all history up to time ",e.jsx(a.InlineMath,{math:"t"}),":"]}),e.jsx(a.BlockMath,{math:"\\text{ExpandMean}_t = \\frac{1}{t}\\sum_{j=1}^{t} y_j"}),e.jsx("p",{children:"Useful for capturing long-run averages and trend information without arbitrary window sizes."}),e.jsx("h2",{children:"Interactive: Feature Table"}),e.jsx(P,{}),e.jsx("h2",{children:"5. Data Leakage: The #1 Mistake"}),e.jsxs(f,{title:"Prevent Data Leakage at All Costs",children:["Data leakage occurs when features use information from the future that would not be available at prediction time. Common leakage sources:",e.jsxs("ul",{className:"mt-2 space-y-1",children:[e.jsxs("li",{children:["Rolling statistics computed on the current value instead of past values (",e.jsx("code",{children:"shift(1)"})," missing)"]}),e.jsx("li",{children:"Target encoding computed on the full dataset before train/test split"}),e.jsx("li",{children:"Scaling/normalization fitted on combined train+test data"}),e.jsx("li",{children:"Using future exogenous variables (e.g., tomorrow's weather)"})]}),"Leakage produces unrealistically good CV scores and catastrophically bad production performance."]}),e.jsx("h2",{children:"6. Lag Selection via ACF/PACF"}),e.jsx("p",{children:"Not all lags are informative. Adding too many lags increases model complexity and may introduce noise. Two practical approaches:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"PACF-based"}),": Include lags where PACF is statistically significant (|PACF| > 1.96/√T). This mirrors AR model order selection."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Importance-based"}),": Fit a LightGBM model with many lags, then prune based on feature importance (gain or SHAP values)."]})]}),e.jsx(g,{type:"tip",title:"Seasonal Lags",children:"Always include the seasonal lag (lag 12 for monthly, lag 7 for daily). The seasonal lag alone is equivalent to the seasonal naïve model — a strong baseline. If the ML model cannot improve on this, something is wrong."}),e.jsx("h2",{children:"Python: Complete Feature Engineering Pipeline"}),e.jsx(s,{code:G,filename:"lag_features.py",title:"Lag features, rolling statistics, and leakage prevention"}),e.jsx(x,{references:D})]})}const Nt=Object.freeze(Object.defineProperty({__proto__:null,default:E},Symbol.toStringTag,{value:"Module"}));function X(){const[t,o]=S.useState(7),i=Array.from({length:t},(l,m)=>{const p=2*Math.PI*m/t;return{label:m,sin:Math.sin(p).toFixed(3),cos:Math.cos(p).toFixed(3)}}),d=80,r=80,n=55;return e.jsxs("div",{className:"my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900",children:[e.jsx("h3",{className:"text-sm font-semibold text-zinc-300 mb-3",children:"Interactive: Cyclical Encoding on the Unit Circle"}),e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsxs("label",{className:"text-sm text-zinc-400",children:["Period: ",e.jsx("span",{className:"text-sky-400 font-bold",children:t})]}),e.jsx("input",{type:"range",min:3,max:12,value:t,onChange:l=>o(Number(l.target.value)),className:"w-40 accent-sky-500"})]}),e.jsxs("div",{className:"flex flex-col md:flex-row gap-6",children:[e.jsxs("svg",{width:"160",height:"160",className:"flex-shrink-0",children:[e.jsx("circle",{cx:d,cy:r,r:n,fill:"none",stroke:"#3f3f46",strokeWidth:"1"}),i.map((l,m)=>{const p=2*Math.PI*m/t-Math.PI/2,c=d+n*Math.cos(p),w=r+n*Math.sin(p);return e.jsxs("g",{children:[e.jsx("circle",{cx:c,cy:w,r:"5",fill:"#38bdf8"}),e.jsx("text",{x:c+7,y:w+4,fontSize:"9",fill:"#94a3b8",children:m})]},m)})]}),e.jsx("div",{className:"overflow-x-auto flex-1",children:e.jsxs("table",{className:"text-xs text-zinc-300 border-collapse w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-zinc-800",children:[e.jsx("th",{className:"border border-zinc-700 px-2 py-1",children:"value"}),e.jsx("th",{className:"border border-zinc-700 px-2 py-1 text-amber-300",children:"sin"}),e.jsx("th",{className:"border border-zinc-700 px-2 py-1 text-emerald-300",children:"cos"})]})}),e.jsx("tbody",{children:i.map(l=>e.jsxs("tr",{className:"hover:bg-zinc-800",children:[e.jsx("td",{className:"border border-zinc-700 px-2 py-1 text-center",children:l.label}),e.jsx("td",{className:"border border-zinc-700 px-2 py-1 text-center text-amber-300",children:l.sin}),e.jsx("td",{className:"border border-zinc-700 px-2 py-1 text-center text-emerald-300",children:l.cos})]},l.label))})]})})]}),e.jsxs("p",{className:"text-xs text-zinc-500 mt-3",children:["Values 0 and ",t," encode to the same (sin, cos) pair, preserving periodicity."]})]})}const q=`import pandas as pd
import numpy as np

def add_calendar_features(df: pd.DataFrame, date_col: str = 'ds') -> pd.DataFrame:
    """Extract standard calendar features from a datetime column."""
    df = df.copy()
    dt = pd.to_datetime(df[date_col])

    df['year']         = dt.dt.year
    df['month']        = dt.dt.month           # 1–12
    df['quarter']      = dt.dt.quarter         # 1–4
    df['week']         = dt.dt.isocalendar().week.astype(int)
    df['day_of_year']  = dt.dt.dayofyear       # 1–366
    df['day_of_month'] = dt.dt.day             # 1–31
    df['day_of_week']  = dt.dt.dayofweek       # 0=Mon … 6=Sun
    df['hour']         = dt.dt.hour            # 0–23 (sub-daily data)

    # Boolean flags
    df['is_weekend']        = dt.dt.dayofweek.isin([5, 6]).astype(int)
    df['is_month_start']    = dt.dt.is_month_start.astype(int)
    df['is_month_end']      = dt.dt.is_month_end.astype(int)
    df['is_quarter_start']  = dt.dt.is_quarter_start.astype(int)
    df['is_quarter_end']    = dt.dt.is_quarter_end.astype(int)
    df['is_year_start']     = dt.dt.is_year_start.astype(int)
    df['is_year_end']       = dt.dt.is_year_end.astype(int)

    return df

dates = pd.date_range('2023-01-01', periods=365, freq='D')
df = pd.DataFrame({'ds': dates, 'y': np.random.randn(365).cumsum() + 100})
df = add_calendar_features(df)
print(df[['ds', 'day_of_week', 'month', 'is_weekend', 'is_month_end']].head(10))
`,I=`import pandas as pd
import numpy as np

def add_cyclical_features(df: pd.DataFrame, date_col: str = 'ds') -> pd.DataFrame:
    """Encode periodic calendar values with sin/cos pairs."""
    df = df.copy()
    dt = pd.to_datetime(df[date_col])

    # (raw_value, period) for each cyclical feature
    specs = {
        'month':        (dt.dt.month - 1, 12),
        'day_of_week':  (dt.dt.dayofweek, 7),
        'day_of_month': (dt.dt.day - 1, 31),
        'day_of_year':  (dt.dt.dayofyear - 1, 366),
        'hour':         (dt.dt.hour, 24),
        'week':         (dt.dt.isocalendar().week.astype(int) - 1, 53),
    }
    for name, (values, period) in specs.items():
        angle = 2 * np.pi * values / period
        df[f'{name}_sin'] = np.sin(angle)
        df[f'{name}_cos'] = np.cos(angle)

    return df

df = pd.DataFrame({'ds': pd.date_range('2024-01-01', periods=14, freq='D')})
df = add_cyclical_features(df)
print(df[['ds', 'day_of_week_sin', 'day_of_week_cos']].to_string())
# Monday (0) and next Monday (7): sin(2pi*0/7) == sin(2pi*7/7) => same encoding ✓
`,O=`import pandas as pd
import numpy as np
import holidays   # pip install holidays

def add_holiday_features(df, date_col='ds', country='US', years=None):
    df = df.copy()
    dt = pd.to_datetime(df[date_col])
    if years is None:
        years = dt.dt.year.unique().tolist()

    cal = holidays.country_holidays(country, years=years)
    df['is_holiday']   = dt.dt.date.map(lambda d: 1 if d in cal else 0)
    df['holiday_name'] = dt.dt.date.map(lambda d: cal.get(d, ''))

    # Proximity: days until next / since last holiday
    hol_dates = pd.DatetimeIndex(sorted(pd.Timestamp(d) for d in cal.keys()))

    def days_to_next(ts):
        future = hol_dates[hol_dates > ts]
        return (future[0] - ts).days if len(future) else np.nan

    def days_from_last(ts):
        past = hol_dates[hol_dates <= ts]
        return (ts - past[-1]).days if len(past) else np.nan

    df['days_to_holiday']   = dt.map(days_to_next)
    df['days_from_holiday'] = dt.map(days_from_last)
    df['near_holiday'] = (
        (df['days_to_holiday'] <= 7) | (df['days_from_holiday'] <= 7)
    ).astype(int)
    return df

df = pd.DataFrame({'ds': pd.date_range('2024-12-20', periods=20, freq='D')})
df = add_holiday_features(df, country='US')
print(df[['ds', 'is_holiday', 'holiday_name', 'days_to_holiday']].to_string())
`,V=`import pandas as pd
from pandas.tseries.holiday import USFederalHolidayCalendar
from pandas.tseries.offsets import CustomBusinessDay

us_bd = CustomBusinessDay(calendar=USFederalHolidayCalendar())

def add_business_features(df, date_col='ds'):
    df = df.copy()
    dt = pd.to_datetime(df[date_col])

    df['is_business_day'] = dt.map(
        lambda d: 1 if len(pd.bdate_range(d, d, freq=us_bd)) > 0 else 0
    )

    def bdom(ts):   # business-day of month (1-based)
        return len(pd.bdate_range(ts.replace(day=1), ts, freq=us_bd))

    def bdays_left(ts):  # business days remaining in month
        month_end = ts + pd.offsets.MonthEnd(0)
        return len(pd.bdate_range(ts + pd.Timedelta(days=1), month_end, freq=us_bd))

    df['business_day_of_month']     = dt.map(bdom)
    df['business_days_remaining']   = dt.map(bdays_left)
    return df

df = pd.DataFrame({'ds': pd.bdate_range('2024-12-23', periods=10, freq=us_bd)})
df = add_business_features(df)
print(df.to_string())
`,W=`# pip install feature-engine>=1.6
import pandas as pd
import numpy as np
from feature_engine.datetime import DatetimeFeatures
from feature_engine.creation import CyclicalFeatures

df = pd.DataFrame({
    'ds': pd.date_range('2023-01-01', periods=500, freq='D'),
    'y':  np.random.randn(500).cumsum() + 200,
})

# Step 1: extract raw datetime components
dt_enc = DatetimeFeatures(
    variables=['ds'],
    features_to_extract=[
        'month', 'quarter', 'week', 'day_of_week',
        'day_of_month', 'day_of_year',
        'is_weekend', 'month_starts', 'month_ends',
    ],
    drop_original=False,
)
df = dt_enc.fit_transform(df)

# Step 2: apply cyclical encoding to selected period features
cyc_enc = CyclicalFeatures(
    variables=['ds_month', 'ds_day_of_week'],
    drop_original=True,
    max_values={'ds_month': 12, 'ds_day_of_week': 6},
)
df = cyc_enc.fit_transform(df)

print("Cyclical columns:", df.filter(regex='sin|cos').columns.tolist())
print("Total features:", df.shape[1])
`,H=[{title:"Forecasting: Principles and Practice (3rd ed.)",author:"Hyndman & Athanasopoulos",year:2021,url:"https://otexts.com/fpp3/"},{title:"feature-engine: DatetimeFeatures",author:"Galli, S.",year:2023,url:"https://feature-engine.trainindata.com/en/latest/user_guide/datetime/DatetimeFeatures.html"},{title:"Encoding Cyclical Continuous Features",author:"Niculescu-Mizil, A.",year:2021,url:"https://ianlondon.github.io/posts/encoding-cyclical-features-24hour-time/"},{title:"holidays Python package",author:"holidays contributors",year:2024,url:"https://python-holidays.readthedocs.io/"}];function U(){return e.jsxs(u,{title:"Calendar and Temporal Features",difficulty:"intermediate",readingTime:10,children:[e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Raw timestamps carry rich periodic information that tree models cannot extract automatically. Unlike convolutional or recurrent networks, gradient-boosted trees see each feature as an independent numeric value. Calendar feature engineering explicitly exposes seasonality, business rhythms, and holiday effects so that any tabular ML model can learn from them."}),e.jsx(h,{term:"Calendar Feature",children:"A numeric representation of a timestamp attribute — day of week, month, quarter, holiday indicator, etc. — that makes cyclic or event-driven patterns visible to a machine learning model as ordinary input columns."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Basic Temporal Features"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["The simplest approach extracts integer components from the timestamp. These are sufficient for tree models because decision trees learn arbitrary threshold splits (e.g., ",e.jsx(a.InlineMath,{math:"\\text{month} \\geq 10"})," captures Q4)."]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3 my-5",children:[{f:"year",r:"2020–2030",n:"trend proxy"},{f:"month",r:"1–12",n:"annual seasonality"},{f:"quarter",r:"1–4",n:"coarser annual"},{f:"week",r:"1–53",n:"ISO week number"},{f:"day_of_year",r:"1–366",n:"fine-grained annual"},{f:"day_of_month",r:"1–31",n:"pay-cycle effects"},{f:"day_of_week",r:"0–6",n:"weekly seasonality"},{f:"hour",r:"0–23",n:"intraday (sub-daily)"}].map(t=>e.jsxs("div",{className:"p-3 rounded-lg bg-zinc-800 border border-zinc-700",children:[e.jsx("p",{className:"font-mono text-sky-400 text-xs",children:t.f}),e.jsx("p",{className:"text-zinc-400 text-xs mt-1",children:t.r}),e.jsx("p",{className:"text-zinc-500 text-xs",children:t.n})]},t.f))}),e.jsx(s,{code:q,title:"Basic Calendar Feature Extraction (pandas)"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Cyclical Encoding"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Integer encodings create a false discontinuity: Sunday (6) is numerically far from Monday (0), yet they are adjacent in the weekly cycle. Cyclical encoding maps integers onto the unit circle:"}),e.jsx(a.BlockMath,{math:String.raw`\text{sin\_feat} = \sin\!\left(\frac{2\pi \, v}{T}\right), \qquad \text{cos\_feat} = \cos\!\left(\frac{2\pi \, v}{T}\right)`}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["where ",e.jsx(a.InlineMath,{math:"v"})," is the integer value (0-indexed) and"," ",e.jsx(a.InlineMath,{math:"T"})," is the period. Both sin and cos are always required; sin alone cannot distinguish values symmetric about the half-period."]}),e.jsx(X,{}),e.jsx(s,{code:I,title:"Cyclical Encoding with sin/cos"}),e.jsx(g,{title:"Cyclical vs. Integer: When It Matters",children:"Linear models and neural networks benefit most from cyclical encoding. Tree models are less sensitive because they can achieve the same periodicity through multi-level splits, but cyclical features still reduce required depth. Use both representations and let feature importance guide final selection."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Holiday Features"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Public holidays create sharp level shifts in retail sales, web traffic, and energy demand. A binary indicator is the minimum; proximity features capture pre-holiday shopping spikes and post-holiday dips."}),e.jsx(s,{code:O,title:"Holiday Indicator and Proximity Features"}),e.jsxs(f,{title:"Country and Regional Variation",children:["Always use the correct country and subdivision for your data. The"," ",e.jsx("code",{children:"holidays"})," library covers 100+ countries and many sub-regional calendars. For multi-country datasets, add per-country holiday columns rather than a single global flag."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Business Day Calendars"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Financial and B2B datasets follow business-day rhythms rather than calendar-day rhythms. Key business-calendar features:"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 space-y-1 ml-2 mb-4",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"is_business_day"})," — combines weekend and holiday exclusions"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"business_day_of_month"})," — payroll and invoice cycles"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"business_days_remaining"})," — month-end reporting pressure"]})]}),e.jsx(s,{code:V,title:"Business Day Calendar Features (pandas)"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Pipeline-Ready: feature-engine"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["The ",e.jsx("code",{children:"feature-engine"})," library provides sklearn-compatible transformers for datetime extraction and cyclical encoding, enabling clean deployment inside a ",e.jsx("code",{children:"Pipeline"}),"."]}),e.jsx(s,{code:W,title:"feature-engine DatetimeFeatures + CyclicalFeatures"}),e.jsxs(_,{title:"Empirical Importance Ranking",children:["For daily data, ",e.jsx("strong",{children:"day_of_week"})," is typically the most important calendar feature, followed by ",e.jsx("strong",{children:"month"})," and"," ",e.jsx("strong",{children:"is_holiday"}),". For hourly data, ",e.jsx("strong",{children:"hour"})," dominates. Cyclical encoding of high-importance features consistently reduces RMSE relative to integer encoding in gradient-boosted tree benchmarks."]}),e.jsxs(b,{title:"Retail Sales — Feature Engineering Pipeline",children:[e.jsx("p",{className:"text-zinc-300 text-sm",children:"A retail demand forecasting model for a US grocery chain might use:"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2",children:[e.jsx("li",{children:"day_of_week_sin, day_of_week_cos — weekly shopping pattern"}),e.jsx("li",{children:"month_sin, month_cos — annual seasonality (summer BBQ, Thanksgiving)"}),e.jsx("li",{children:"is_holiday, days_to_holiday — Thanksgiving / Christmas surges"}),e.jsx("li",{children:"is_month_end — end-of-month coupon redemption spike"}),e.jsx("li",{children:"business_day_of_month — B2B bulk orders"})]}),e.jsx("p",{className:"text-zinc-300 text-sm mt-2",children:"Adding these features to a LightGBM baseline typically reduces MAPE by 10–25% on weekly-seasonal retail data."})]}),e.jsx(f,{title:"Feature Explosion with One-Hot Encoding",children:"One-hot encoding calendar variables (e.g., 53 binary columns for ISO week) creates sparse, high-cardinality features. Prefer cyclical or ordinal integers for tree models. Reserve one-hot encoding for linear models where the model cannot learn interactions implicitly."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Summary Checklist"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 my-4",children:["Always include day_of_week for daily or sub-daily data","Use cyclical encoding for linear models and neural nets","Add is_holiday for consumer-facing demand series","Add proximity features (days_to_holiday) for pre-event spikes","Use business-day features for financial / B2B series","Use pandas CustomBusinessDay for non-standard calendars","Embed feature transformers in sklearn Pipeline","Check SHAP importance — prune low-signal calendar columns"].map((t,o)=>e.jsxs("div",{className:"flex items-start gap-2 p-3 rounded-lg bg-zinc-800 border border-zinc-700",children:[e.jsx("span",{className:"text-emerald-400 mt-0.5",children:"✓"}),e.jsx("span",{className:"text-zinc-300 text-sm",children:t})]},o))}),e.jsx(x,{references:H})]})}const zt=Object.freeze(Object.defineProperty({__proto__:null,default:U},Symbol.toStringTag,{value:"Module"}));function K(){const[t,o]=S.useState(3),i=[10,13,11,15,14,18,17,20,19,22],d=i.map((r,n)=>{const l=n>=1?i[n-1]:null,m=n>=2?i[n-2]:null,p=n>=3?i[n-3]:null,c=i.slice(Math.max(0,n-t+1),n+1),w=c.length===t?(c.reduce((j,F)=>j+F,0)/t).toFixed(2):null,y=c.length===t?Math.sqrt(c.map(j=>(j-w)**2).reduce((j,F)=>j+F,0)/(t-1)).toFixed(2):null;return{t:n+1,y:r,lag1:l,lag2:m,lag3:p,mean:w,std:y}});return e.jsxs("div",{className:"my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900",children:[e.jsx("h3",{className:"text-sm font-semibold text-zinc-300 mb-3",children:"Interactive: Lag + Rolling Features"}),e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsxs("label",{className:"text-sm text-zinc-400",children:["Rolling window: ",e.jsx("span",{className:"text-sky-400 font-bold",children:t})]}),e.jsx("input",{type:"range",min:2,max:5,value:t,onChange:r=>o(Number(r.target.value)),className:"w-40 accent-sky-500"})]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"text-xs text-zinc-300 border-collapse",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-zinc-800",children:["t","y","lag_1","lag_2","lag_3",`roll_mean_${t}`,`roll_std_${t}`].map(r=>e.jsx("th",{className:`border border-zinc-700 px-3 py-2 font-mono whitespace-nowrap ${r==="y"?"text-white bg-sky-900":r.startsWith("lag")?"text-amber-300":r.startsWith("roll")?"text-emerald-300":""}`,children:r},r))})}),e.jsx("tbody",{children:d.map(r=>e.jsx("tr",{className:"hover:bg-zinc-800",children:[r.t,r.y,r.lag1,r.lag2,r.lag3,r.mean,r.std].map((n,l)=>e.jsx("td",{className:"border border-zinc-700 px-3 py-1 text-center font-mono",children:n??e.jsx("span",{className:"text-zinc-600",children:"NaN"})},l))},r.t))})]})})]})}const $=`import pandas as pd
import numpy as np

def add_lag_features(df: pd.DataFrame, target: str, lags: list) -> pd.DataFrame:
    """Add lag features for a single time series."""
    df = df.copy().sort_values('ds')
    for lag in lags:
        df[f'{target}_lag_{lag}'] = df[target].shift(lag)
    return df

# Usage: daily sales with lags 1, 7, 14, 28 (day-of-week and month-of-year anchors)
df = pd.DataFrame({
    'ds': pd.date_range('2023-01-01', periods=90, freq='D'),
    'y':  np.random.randn(90).cumsum() + 100,
})
df = add_lag_features(df, target='y', lags=[1, 2, 3, 7, 14, 28])
print(df[['ds', 'y', 'y_lag_1', 'y_lag_7', 'y_lag_28']].tail(10).to_string())
`,Y=`import pandas as pd
import numpy as np

def add_rolling_features(
    df: pd.DataFrame,
    target: str,
    windows: list,
    quantiles: list = None,
    min_periods: int = 1,
) -> pd.DataFrame:
    """Add rolling statistics: mean, std, min, max, and optional quantiles."""
    df = df.copy().sort_values('ds')
    s = df[target]

    for w in windows:
        roll = s.shift(1).rolling(window=w, min_periods=min_periods)
        df[f'{target}_roll_mean_{w}'] = roll.mean()
        df[f'{target}_roll_std_{w}']  = roll.std()
        df[f'{target}_roll_min_{w}']  = roll.min()
        df[f'{target}_roll_max_{w}']  = roll.max()

        if quantiles:
            for q in quantiles:
                df[f'{target}_roll_q{int(q*100)}_{w}'] = roll.quantile(q)

    return df

df = pd.DataFrame({
    'ds': pd.date_range('2023-01-01', periods=200, freq='D'),
    'y':  np.random.randn(200).cumsum() + 100,
})
# Note: shift(1) before rolling ensures no data leakage —
# the rolling window uses only data available BEFORE the current timestep
df = add_rolling_features(df, 'y', windows=[7, 14, 28], quantiles=[0.1, 0.9])
print(df[['ds', 'y', 'y_roll_mean_7', 'y_roll_std_7', 'y_roll_q10_7']].tail(10))
`,Z=`import pandas as pd
import numpy as np

def add_expanding_features(df: pd.DataFrame, target: str) -> pd.DataFrame:
    """Add expanding window (cumulative) statistics."""
    df = df.copy().sort_values('ds')
    s = df[target].shift(1)  # shift to avoid leakage

    exp = s.expanding(min_periods=1)
    df[f'{target}_exp_mean']  = exp.mean()
    df[f'{target}_exp_std']   = exp.std()
    df[f'{target}_exp_min']   = exp.min()
    df[f'{target}_exp_max']   = exp.max()
    df[f'{target}_exp_range'] = df[f'{target}_exp_max'] - df[f'{target}_exp_min']

    return df

# Expanding window is useful for slow-moving series or when the series
# history is informative about its long-run mean level.
df = pd.DataFrame({
    'ds': pd.date_range('2023-01-01', periods=100, freq='D'),
    'y':  np.random.randn(100).cumsum() + 50,
})
df = add_expanding_features(df, 'y')
print(df[['ds', 'y', 'y_exp_mean', 'y_exp_std']].tail(5))
`,J=`import pandas as pd
import numpy as np

def add_ewm_features(df: pd.DataFrame, target: str, spans: list) -> pd.DataFrame:
    """Add exponentially-weighted moving statistics."""
    df = df.copy().sort_values('ds')
    s = df[target].shift(1)  # no leakage

    for span in spans:
        ewm = s.ewm(span=span, adjust=False)
        df[f'{target}_ewm_mean_{span}'] = ewm.mean()
        df[f'{target}_ewm_std_{span}']  = ewm.std()

    return df

# EWM gives more weight to recent observations;
# span ~ 1/alpha controls the decay rate:
#   span=7  => alpha ≈ 0.25 (recent-heavy, fast-adapting)
#   span=28 => alpha ≈ 0.07 (slow-decaying, long memory)

df = pd.DataFrame({
    'ds': pd.date_range('2023-01-01', periods=100, freq='D'),
    'y':  np.random.randn(100).cumsum() + 100,
})
df = add_ewm_features(df, 'y', spans=[7, 14, 28])
print(df[['ds', 'y', 'y_ewm_mean_7', 'y_ewm_mean_28']].tail(8))
`,Q=`import pandas as pd
import numpy as np
from sklearn.model_selection import KFold

def target_encode_cv(
    df: pd.DataFrame,
    cat_col: str,
    target: str,
    n_splits: int = 5,
    smoothing: float = 10.0,
) -> pd.Series:
    """
    Target-encode a categorical column using k-fold cross-validation
    to prevent target leakage. Uses additive smoothing:

        encoded = (count * category_mean + smoothing * global_mean)
                  / (count + smoothing)

    The CV loop ensures the training-set rows are encoded using
    out-of-fold statistics only.
    """
    global_mean = df[target].mean()
    encoded = pd.Series(index=df.index, dtype=float)

    kf = KFold(n_splits=n_splits, shuffle=False)
    for train_idx, val_idx in kf.split(df):
        train = df.iloc[train_idx]
        stats = train.groupby(cat_col)[target].agg(['mean', 'count'])
        stats['smooth'] = (
            stats['count'] * stats['mean'] + smoothing * global_mean
        ) / (stats['count'] + smoothing)
        encoded.iloc[val_idx] = df[cat_col].iloc[val_idx].map(stats['smooth']).fillna(global_mean)

    return encoded

# Example: encode store_id categorical for a retail demand model
np.random.seed(42)
df = pd.DataFrame({
    'store_id': np.random.choice(['A', 'B', 'C', 'D'], size=1000),
    'y': np.random.randn(1000) + np.random.choice([5, 10, 15, 20], size=1000),
})
df['store_encoded'] = target_encode_cv(df, 'store_id', 'y')
print(df.groupby('store_id')[['y', 'store_encoded']].mean())
`,ee=`# pip install mlforecast lightgbm
from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
import lightgbm as lgb
import pandas as pd
import numpy as np

# mlforecast handles lag creation and rolling features internally
# via the lag_transforms parameter

fcst = MLForecast(
    models={'lgb': lgb.LGBMRegressor(n_estimators=300, learning_rate=0.05)},
    freq='D',
    lags=[1, 2, 3, 7, 14, 28],                    # explicit lags
    lag_transforms={
        1: [
            # (rolling_mean, window), (rolling_std, window), etc.
            ('rolling_mean', 7),
            ('rolling_mean', 28),
            ('rolling_std',  7),
            ('rolling_min',  7),
            ('rolling_max',  7),
        ],
        7: [('rolling_mean', 4)],                  # 4-week average at lag 7
    },
    date_features=['dayofweek', 'month', 'quarter'],
    target_transforms=[Differences([1])],          # first difference to remove trend
)

# Generate synthetic multi-series data in mlforecast format
np.random.seed(0)
n = 500
df = pd.DataFrame({
    'unique_id': 'series_1',
    'ds': pd.date_range('2022-01-01', periods=n, freq='D'),
    'y':  np.random.randn(n).cumsum() + 200,
})

fcst.fit(df)
horizon = 14
future = fcst.make_future_dataframe(h=horizon)
preds = fcst.predict(h=horizon, new_df=future)
print(preds)
`,te=[{title:"Feature Engineering for Machine Learning",author:"Zheng, A. & Casari, A.",year:2018,url:"https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/"},{title:"mlforecast: scalable machine learning for time series",author:"Nixtla",year:2023,url:"https://nixtlaverse.nixtla.io/mlforecast/"},{title:"Target Encoding Done Right",author:"Micci-Barreca, D.",year:2001,url:"https://dl.acm.org/doi/10.1145/507533.507538"},{title:"pandas Time Series documentation",author:"pandas contributors",year:2024,url:"https://pandas.pydata.org/docs/user_guide/timeseries.html"}];function ae(){return e.jsxs(u,{title:"Lag Features and Target Encoding",difficulty:"intermediate",readingTime:12,children:[e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Converting a time series into a supervised learning problem requires representing the series' own history as input features. Lag features encode past values directly; rolling statistics summarize recent dynamics; exponential weighted averages capture recency-weighted memory; and target encoding converts high-cardinality categorical identifiers into meaningful numeric signals."}),e.jsxs(h,{term:"Lag Feature",children:["A feature ",e.jsx(a.InlineMath,{math:"y_{t-k}"})," that copies the target value from"," ",e.jsx(a.InlineMath,{math:"k"})," steps in the past. Lag features form the backbone of autoregressive ML models, directly exposing the series' own history to the learning algorithm."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Lag Features"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"For a daily series, common lags are 1 (yesterday), 7 (same day last week), 14, and 28. The exact set should reflect the dominant seasonalities and any known lead-lag relationships in the domain."}),e.jsx(a.BlockMath,{math:String.raw`\mathbf{x}_t = [y_{t-1},\, y_{t-2},\, \ldots,\, y_{t-p}]`}),e.jsx(s,{code:$,title:"Lag Feature Extraction"}),e.jsxs(f,{title:"Data Leakage from Lags",children:["Always sort the dataframe by time before applying ",e.jsx("code",{children:"shift()"}),". For multi-series datasets, apply ",e.jsx("code",{children:"groupby('unique_id').shift(lag)"})," to prevent one series' past values leaking into another series' features."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Rolling Statistics"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Rolling windows summarize recent behavior in a compact, noise-reduced form. Mean, standard deviation, min, and max capture the level, volatility, and range of the recent window."}),e.jsx(a.BlockMath,{math:String.raw`\mu^{(w)}_t = \frac{1}{w}\sum_{k=1}^{w} y_{t-k}, \qquad \sigma^{(w)}_t = \sqrt{\frac{1}{w-1}\sum_{k=1}^{w}(y_{t-k} - \mu^{(w)}_t)^2}`}),e.jsx(K,{}),e.jsx(s,{code:Y,title:"Rolling Mean, Std, Min, Max and Quantiles"}),e.jsxs(g,{title:"The shift(1) Convention",children:["Always apply ",e.jsx("code",{children:".shift(1)"})," before ",e.jsx("code",{children:".rolling()"}),". Without the shift, the rolling window at time ",e.jsx(a.InlineMath,{math:"t"})," includes"," ",e.jsx(a.InlineMath,{math:"y_t"})," itself — leaking the target into its own feature. After the shift, ",e.jsx("code",{children:"roll_mean_7"})," at time ",e.jsx(a.InlineMath,{math:"t"})," uses only ",e.jsx(a.InlineMath,{math:"y_{t-1}, \\ldots, y_{t-7}"}),"."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Expanding Window Features"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Expanding windows grow as more history accumulates, computing running statistics from the beginning of the series. They capture the long-run mean and are useful for slow-moving series or when level-setting across a long history matters."}),e.jsx(s,{code:Z,title:"Expanding Window Statistics"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Exponential Weighted Features"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["Exponentially weighted moving averages (EWM) assign geometrically decreasing weights to older observations, controlled by span parameter"," ",e.jsx(a.InlineMath,{math:"\\alpha = 2 / (\\text{span} + 1)"}),":"]}),e.jsx(a.BlockMath,{math:String.raw`\hat{y}^{(\alpha)}_t = \alpha \, y_{t-1} + (1-\alpha)\, \hat{y}^{(\alpha)}_{t-1}`}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"EWM features combine the smoothing benefit of rolling averages with continuous weighting — recent observations matter more, avoiding the hard cutoff of a fixed window."}),e.jsx(s,{code:J,title:"Exponentially Weighted Moving Features"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Target Encoding"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"In multi-series forecasting, categorical identifiers (store ID, product ID, SKU) must be converted to numeric features. Target encoding replaces a category with the mean target value for that category — but must be computed with cross-validation to prevent leakage."}),e.jsxs(h,{term:"Target Encoding with Smoothing",children:[e.jsx(a.BlockMath,{math:String.raw`\tilde{y}_c = \frac{n_c \cdot \bar{y}_c + \lambda \cdot \bar{y}_{\text{global}}}{n_c + \lambda}`}),"where ",e.jsx(a.InlineMath,{math:"n_c"})," is the count of observations in category"," ",e.jsx(a.InlineMath,{math:"c"}),", ",e.jsx(a.InlineMath,{math:"\\bar{y}_c"})," is the category mean, and ",e.jsx(a.InlineMath,{math:"\\lambda"})," is the smoothing parameter. Large"," ",e.jsx(a.InlineMath,{math:"\\lambda"})," shrinks rare categories toward the global mean."]}),e.jsx(s,{code:Q,title:"Target Encoding with K-Fold CV and Smoothing"}),e.jsxs(f,{title:"Target Encoding Leakage Risk",children:["Never compute target encodings on the full training set before splitting into train/validation folds. Always use out-of-fold statistics to compute encodings for training rows, and global statistics (from training only) for test rows. Libraries like ",e.jsx("code",{children:"category_encoders"})," handle this automatically."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"mlforecast Feature Engineering"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["The ",e.jsx("code",{children:"mlforecast"})," library automates lag and rolling-window feature creation for multi-series datasets, with efficient parallelised computation and correct handling of group boundaries."]}),e.jsx(s,{code:ee,title:"mlforecast: Lags, Rolling Stats, and Date Features"}),e.jsx(_,{title:"Feature Importance: Lags vs. Rolling vs. EWM",children:"Empirically, lag features at the dominant seasonality period (e.g., lag 7 for weekly data) are the single most important feature class. Rolling mean features add complementary signal by smoothing noise. EWM features are valuable when series undergo level shifts, as they adapt faster than long rolling windows. A well-engineered lag+rolling feature set often rivals complex deep learning models on standard benchmarks."}),e.jsxs(b,{title:"Energy Consumption Forecasting — Feature Set",children:[e.jsx("p",{className:"text-zinc-300 text-sm",children:"For hourly electricity demand forecasting:"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2",children:[e.jsx("li",{children:"Lags: 1h, 2h, 3h (inertia), 24h, 48h (daily cycle), 168h (weekly)"}),e.jsx("li",{children:"Rolling mean/std: 24h, 168h windows"}),e.jsx("li",{children:"EWM: spans 12, 24, 72 (fast/medium/slow decay)"}),e.jsx("li",{children:"Calendar: hour_sin/cos, day_of_week_sin/cos, is_holiday"}),e.jsx("li",{children:"Exogenous: temperature lag_1, temperature rolling_mean_24"})]})]}),e.jsx(x,{references:te})]})}const Tt=Object.freeze(Object.defineProperty({__proto__:null,default:ae},Symbol.toStringTag,{value:"Module"})),se=`# pip install shap lightgbm
import shap
import lightgbm as lgb
import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit

# Build a feature-rich dataset
np.random.seed(42)
n = 500
df = pd.DataFrame({'ds': pd.date_range('2022-01-01', periods=n, freq='D')})
df['y'] = np.random.randn(n).cumsum() + 100
# Add features: lags, rolling, calendar
for lag in [1, 7, 14, 28]:
    df[f'lag_{lag}'] = df['y'].shift(lag)
for w in [7, 14, 28]:
    df[f'roll_mean_{w}'] = df['y'].shift(1).rolling(w).mean()
    df[f'roll_std_{w}']  = df['y'].shift(1).rolling(w).std()
df['dow']   = df['ds'].dt.dayofweek
df['month'] = df['ds'].dt.month
df = df.dropna()

feature_cols = [c for c in df.columns if c not in ['ds', 'y']]
X, y = df[feature_cols].values, df['y'].values

# Train a LightGBM model
tscv = TimeSeriesSplit(n_splits=5)
model = lgb.LGBMRegressor(n_estimators=300, learning_rate=0.05, verbosity=-1)
train_idx, val_idx = list(tscv.split(X))[-1]
model.fit(X[train_idx], y[train_idx],
          eval_set=[(X[val_idx], y[val_idx])],
          callbacks=[lgb.early_stopping(50, verbose=False)])

# SHAP analysis
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X[val_idx])

# Mean absolute SHAP per feature (global importance)
shap_importance = pd.Series(
    np.abs(shap_values).mean(axis=0),
    index=feature_cols
).sort_values(ascending=False)
print("SHAP Feature Importance:")
print(shap_importance.head(10))

# Waterfall plot for a single prediction (requires matplotlib)
# shap.waterfall_plot(shap.Explanation(shap_values[0], feature_names=feature_cols))
`,re=`from sklearn.inspection import permutation_importance
from sklearn.ensemble import RandomForestRegressor
import pandas as pd
import numpy as np

# Using the same df, X, y, train_idx, val_idx from above
model = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
model.fit(X[train_idx], y[train_idx])

# Permutation importance on the validation set
result = permutation_importance(
    model, X[val_idx], y[val_idx],
    n_repeats=20,              # shuffle each feature 20 times
    random_state=42,
    scoring='neg_mean_absolute_error',
)

perm_imp = pd.DataFrame({
    'feature': feature_cols,
    'importance_mean': result.importances_mean,
    'importance_std':  result.importances_std,
}).sort_values('importance_mean', ascending=False)

print(perm_imp.head(10).to_string(index=False))

# Features with negative or near-zero importance can be removed
# without hurting (and possibly improving) predictive performance
redundant = perm_imp[perm_imp['importance_mean'] < 0.01]['feature'].tolist()
print(f"Features to consider dropping: {redundant}")
`,ie=`from sklearn.feature_selection import RFECV
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import TimeSeriesSplit
import pandas as pd
import numpy as np

# RFECV: recursive feature elimination with cross-validation
# Uses TimeSeriesSplit to respect temporal ordering
estimator = GradientBoostingRegressor(n_estimators=100, random_state=42)
selector = RFECV(
    estimator=estimator,
    step=1,                     # remove 1 feature per round
    cv=TimeSeriesSplit(n_splits=5),
    scoring='neg_mean_absolute_error',
    min_features_to_select=3,
    n_jobs=-1,
)
selector.fit(X, y)

selected_features = [f for f, s in zip(feature_cols, selector.support_) if s]
print(f"Optimal feature count: {selector.n_features_}")
print(f"Selected features: {selected_features}")

# Retrieve importance ranking
ranking = pd.Series(selector.ranking_, index=feature_cols).sort_values()
print("\\nFeature elimination ranking (1 = selected):")
print(ranking.head(12))
`,ne=`# pip install boruta
from boruta import BorutaPy
from sklearn.ensemble import RandomForestRegressor
import pandas as pd
import numpy as np

# Boruta is an all-relevant feature selection method:
# compares real features against their shuffled ("shadow") counterparts.
# Features consistently beating all shadow features are selected.

rf = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
boruta = BorutaPy(
    estimator=rf,
    n_estimators='auto',    # auto-determines RF size
    alpha=0.05,             # significance level for feature selection
    max_iter=100,
    random_state=42,
    verbose=0,
)
boruta.fit(X, y)

support    = pd.Series(boruta.support_,      index=feature_cols)  # confirmed
tentative  = pd.Series(boruta.support_weak_, index=feature_cols)  # borderline

print("Confirmed relevant features:")
print(support[support].index.tolist())
print("\\nTentative features (borderline):")
print(tentative[tentative].index.tolist())
print("\\nRejected features:")
print(support[(~support) & (~tentative)].index.tolist())
`,oe=`import pandas as pd
import numpy as np
from statsmodels.tsa.stattools import grangercausalitytests

# Granger causality tests whether X helps predict Y beyond Y's own lags.
# Used as a feature screening step BEFORE fitting the ML model.

np.random.seed(0)
n = 300
y = np.random.randn(n).cumsum()
x1 = np.roll(y, 3) + np.random.randn(n) * 0.5   # x1 Granger-causes y at lag 3
x2 = np.random.randn(n)                            # x2 is noise (no causality)

data = pd.DataFrame({'y': y, 'x1': x1, 'x2': x2})

print("=== Granger causality: x1 -> y ===")
grangercausalitytests(data[['y', 'x1']], maxlag=5, verbose=True)

print("\\n=== Granger causality: x2 -> y ===")
grangercausalitytests(data[['y', 'x2']], maxlag=5, verbose=True)

# Interpret: if any test p-value < 0.05 at any lag, include x as a candidate feature
# with that lag. If all p-values > 0.05, x2 adds no predictive value.
`,le=`import pandas as pd
import numpy as np
import shap
import lightgbm as lgb
from sklearn.model_selection import TimeSeriesSplit
from sklearn.feature_selection import RFECV

# ── Step 1: build features ────────────────────────────────────────────────────
np.random.seed(0)
n = 600
df = pd.DataFrame({'ds': pd.date_range('2021-01-01', periods=n, freq='D')})
df['y'] = np.sin(np.arange(n) * 2 * np.pi / 365) * 20 + np.random.randn(n) * 5 + 100

for lag in [1, 2, 3, 7, 14, 21, 28]:
    df[f'lag_{lag}'] = df['y'].shift(lag)
for w in [7, 14, 28]:
    s = df['y'].shift(1)
    df[f'rmean_{w}'] = s.rolling(w).mean()
    df[f'rstd_{w}']  = s.rolling(w).std()
df['dow']   = df['ds'].dt.dayofweek
df['month'] = df['ds'].dt.month
df['dow_sin'] = np.sin(2 * np.pi * df['dow'] / 7)
df['dow_cos'] = np.cos(2 * np.pi * df['dow'] / 7)
df = df.dropna()

features = [c for c in df.columns if c not in ['ds', 'y']]
X = df[features].values
y = df['y'].values
tscv = TimeSeriesSplit(n_splits=5)

# ── Step 2: SHAP screening ────────────────────────────────────────────────────
model = lgb.LGBMRegressor(n_estimators=200, learning_rate=0.05, verbosity=-1)
train_idx, val_idx = list(tscv.split(X))[-1]
model.fit(X[train_idx], y[train_idx])
shap_vals = shap.TreeExplainer(model).shap_values(X[val_idx])
shap_imp  = pd.Series(np.abs(shap_vals).mean(0), index=features)
keep = shap_imp[shap_imp > shap_imp.quantile(0.25)].index.tolist()
print(f"After SHAP screening: {len(keep)}/{len(features)} features kept")

# ── Step 3: RFECV on kept features ────────────────────────────────────────────
X_keep = df[keep].values
rfecv = RFECV(
    lgb.LGBMRegressor(n_estimators=100, verbosity=-1),
    cv=TimeSeriesSplit(n_splits=5),
    scoring='neg_mean_absolute_error',
    min_features_to_select=3,
    n_jobs=-1,
)
rfecv.fit(X_keep, y)
final_features = [f for f, s in zip(keep, rfecv.support_) if s]
print(f"Final feature set ({len(final_features)}): {final_features}")
`,de=[{title:"A Unified Approach to Interpreting Model Predictions (SHAP)",author:"Lundberg, S. & Lee, S.-I.",year:2017,url:"https://arxiv.org/abs/1705.07874"},{title:"Feature Importance in Random Forests",author:"Breiman, L.",year:2001,url:"https://link.springer.com/article/10.1023/A:1010933404324"},{title:"Boruta: An All-Relevant Feature Selection Method",author:"Kursa, M. & Rudnicki, W.",year:2010,url:"https://www.jstatsoft.org/article/view/v036i11"},{title:"Investigating Causal Relations by Econometric Models (Granger)",author:"Granger, C.W.J.",year:1969,url:"https://www.jstor.org/stable/1912791"},{title:"scikit-learn: Recursive Feature Elimination",author:"Pedregosa et al.",year:2011,url:"https://scikit-learn.org/stable/modules/feature_selection.html#rfe"}];function ce(){return e.jsxs(u,{title:"Feature Selection for Forecasting",difficulty:"intermediate",readingTime:10,children:[e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Feature engineering for time series easily produces hundreds of lag, rolling, and calendar columns. Including all of them wastes memory, increases training time, and can degrade model accuracy through noise. Feature selection identifies the predictive subset — the columns that genuinely improve generalization."}),e.jsx(h,{term:"Feature Selection",children:"The process of identifying a subset of input features that maximizes predictive performance on held-out data while discarding redundant or irrelevant columns. In forecasting, feature selection must respect temporal ordering to avoid leakage."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"SHAP Feature Importance"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"SHAP (SHapley Additive exPlanations) assigns each feature a contribution to every individual prediction, grounded in game-theoretic Shapley values. Unlike built-in tree importance (which uses split count or gain), SHAP values are consistent and correctly handle correlated features."}),e.jsx(a.BlockMath,{math:String.raw`\phi_j = \sum_{S \subseteq F \setminus \{j\}} \frac{|S|!\,(|F|-|S|-1)!}{|F|!}\bigl[f(S \cup \{j\}) - f(S)\bigr]`}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["Global importance is the mean absolute SHAP value across all validation samples:"," ",e.jsx(a.InlineMath,{math:"\\bar{\\phi}_j = \\frac{1}{N}\\sum_{i=1}^{N}|\\phi_j^{(i)}|"}),"."]}),e.jsx(s,{code:se,title:"SHAP Feature Importance with LightGBM"}),e.jsx(g,{title:"SHAP on the Validation Set",children:"Always compute SHAP importances on the held-out validation set, not the training set. Training-set SHAP values reflect what the model has memorised, not what generalises."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Permutation Importance"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Permutation importance measures how much the validation metric degrades when a feature's values are randomly shuffled (breaking its relationship with the target). It is model-agnostic and detects features that are predictive even when the model assigns them low split-gain importance."}),e.jsx(s,{code:re,title:"Permutation Importance (sklearn)"}),e.jsx(f,{title:"Correlated Features and Permutation Importance",children:"If two features are highly correlated, shuffling one may not hurt much because the model can still use the other. Both features will appear less important than they truly are. Use a correlation filter (e.g., Pearson r > 0.95) to remove redundant duplicates before running permutation importance."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Recursive Feature Elimination (RFECV)"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"RFECV iteratively fits a model, removes the least-important feature, and measures cross-validation performance at each step. It automatically selects the feature count that minimises the CV score, combining elimination with model selection."}),e.jsx(s,{code:ie,title:"RFECV with TimeSeriesSplit"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Boruta"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:`Boruta is an all-relevant feature selection algorithm. It creates "shadow" features (permuted copies of each feature), then runs a random forest comparing each real feature's importance to the maximum shadow importance. Features that consistently outperform their shadows are confirmed; those that never do are rejected.`}),e.jsx(s,{code:ne,title:"Boruta All-Relevant Feature Selection"}),e.jsx(g,{title:"Boruta vs. RFE",children:"RFE selects a minimal sufficient set — the smallest subset achieving near-optimal performance. Boruta selects all relevant features — every feature that carries unique signal. For forecasting, Boruta is often preferred when interpretability and completeness matter; RFE is preferred when minimising feature count is the primary goal."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Granger Causality"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["Granger causality tests whether lagged values of an exogenous variable",e.jsx(a.InlineMath,{math:"X"})," improve predictions of ",e.jsx(a.InlineMath,{math:"Y"})," beyond what ",e.jsx(a.InlineMath,{math:"Y"}),"'s own lags explain. It provides a statistical screening step to filter exogenous features before model training."]}),e.jsx(a.BlockMath,{math:String.raw`H_0: \alpha_1 = \alpha_2 = \cdots = \alpha_p = 0 \quad \text{(X does not Granger-cause Y)}`}),e.jsx(s,{code:oe,title:"Granger Causality Test for Exogenous Feature Screening"}),e.jsx(f,{title:"Granger Causality ≠ True Causality",children:"Granger causality is a test of predictive temporal precedence, not physical causation. A feature can Granger-cause a target purely due to a shared confound or spurious correlation. Use it as a fast screening step, not as proof of causal structure."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Recommended Pipeline"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"A practical two-stage selection pipeline: SHAP screening removes clearly uninformative features cheaply; RFECV then refines the selected set."}),e.jsx(s,{code:le,title:"Two-Stage Feature Selection: SHAP + RFECV"}),e.jsx(_,{title:"Feature Selection Improves Generalisation",children:"For ML forecasting models on typical business datasets (hundreds of features, thousands of rows), removing the bottom 25–50% of features by SHAP importance consistently yields 2–8% lower out-of-sample MAE. The effect is largest when the feature set contains many highly correlated rolling-window features."}),e.jsxs(b,{title:"Supply Chain Demand Forecasting — Selection Outcome",children:[e.jsx("p",{className:"text-zinc-300 text-sm",children:"Starting from 87 features (lags 1–28, rolling stats, calendar, promotions, price), a two-stage SHAP + RFECV pipeline selected 23 features:"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2",children:[e.jsx("li",{children:"Lags 1, 2, 7, 14, 28 (most predictive history)"}),e.jsx("li",{children:"Rolling mean 7, 28 (level estimate)"}),e.jsx("li",{children:"Rolling std 7 (volatility)"}),e.jsx("li",{children:"EWM mean span=7 (recency-weighted level)"}),e.jsx("li",{children:"day_of_week_sin/cos, month_sin/cos (seasonality)"}),e.jsx("li",{children:"is_holiday, days_to_holiday (event effects)"}),e.jsx("li",{children:"promotion_flag, price_delta (exogenous drivers)"})]}),e.jsx("p",{className:"text-zinc-300 text-sm mt-2",children:"Training time dropped by 4x and test MAE improved by 6%."})]}),e.jsx(x,{references:de})]})}const Bt=Object.freeze(Object.defineProperty({__proto__:null,default:ce},Symbol.toStringTag,{value:"Module"})),me=`import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# ── 1. Generate synthetic daily series ────────────────────────────────────────
np.random.seed(42)
n = 700
dates = pd.date_range('2021-01-01', periods=n, freq='D')
trend    = np.linspace(0, 20, n)
seasonal = 10 * np.sin(2 * np.pi * np.arange(n) / 365.25)
noise    = np.random.randn(n) * 3
y_raw    = 100 + trend + seasonal + noise

df = pd.DataFrame({'ds': dates, 'y': y_raw})

# ── 2. Tabularize: lags + rolling + calendar ──────────────────────────────────
for lag in [1, 2, 3, 7, 14, 28]:
    df[f'lag_{lag}'] = df['y'].shift(lag)
for w in [7, 14, 28]:
    s = df['y'].shift(1)
    df[f'rmean_{w}'] = s.rolling(w).mean()
    df[f'rstd_{w}']  = s.rolling(w).std()
df['dow']   = df['ds'].dt.dayofweek
df['month'] = df['ds'].dt.month
df['dow_sin'] = np.sin(2 * np.pi * df['dow'] / 7)
df['dow_cos'] = np.cos(2 * np.pi * df['dow'] / 7)
df = df.dropna()

features = [c for c in df.columns if c not in ['ds', 'y']]
X, y = df[features].values, df['y'].values

# ── 3. Time-series cross-validation ──────────────────────────────────────────
tscv = TimeSeriesSplit(n_splits=5, test_size=28)
maes = []
for train_idx, val_idx in tscv.split(X):
    rf = RandomForestRegressor(
        n_estimators=300,
        max_features='sqrt',    # m = sqrt(p) features per split
        min_samples_leaf=5,
        random_state=42,
        n_jobs=-1,
    )
    rf.fit(X[train_idx], y[train_idx])
    preds = rf.predict(X[val_idx])
    maes.append(mean_absolute_error(y[val_idx], preds))
    print(f"  Fold MAE: {maes[-1]:.3f}")

print(f"Mean CV MAE: {np.mean(maes):.3f} ± {np.std(maes):.3f}")
`,pe=`from sklearn.ensemble import RandomForestRegressor
import numpy as np
import pandas as pd

# OOB (out-of-bag) estimation uses the ~37% of bootstrap samples
# not seen by each tree to estimate generalisation error for FREE —
# no separate validation set needed.

np.random.seed(42)
X_train = np.random.randn(500, 10)
y_train = X_train[:, 0] * 3 + np.random.randn(500)

rf = RandomForestRegressor(
    n_estimators=500,
    oob_score=True,       # enable OOB scoring
    random_state=42,
    n_jobs=-1,
)
rf.fit(X_train, y_train)

print(f"OOB R²: {rf.oob_score_:.4f}")
# rf.oob_prediction_ gives per-sample OOB predictions
residuals = y_train - rf.oob_prediction_
print(f"OOB MAE: {np.abs(residuals).mean():.4f}")

# Note: OOB score is a biased estimate for time series because
# bootstrap samples violate temporal ordering. Prefer TimeSeriesSplit
# for proper backtesting, but OOB is useful for quick hyperparameter tuning.
`,he=`from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import TimeSeriesSplit, RandomizedSearchCV
import numpy as np

# Parameter grid for Random Forest forecasting
param_dist = {
    'n_estimators':    [100, 200, 500, 1000],
    'max_depth':       [None, 10, 20, 30],     # None = grow until leaves pure
    'max_features':    ['sqrt', 'log2', 0.3, 0.5],
    'min_samples_leaf':[1, 2, 5, 10],          # larger = more regularisation
    'max_samples':     [0.5, 0.7, 0.9, None],  # row sub-sampling per tree
    'bootstrap':       [True],                 # always True for OOB to work
}

rf = RandomForestRegressor(random_state=42, n_jobs=-1)
search = RandomizedSearchCV(
    rf,
    param_distributions=param_dist,
    n_iter=30,
    cv=TimeSeriesSplit(n_splits=5, test_size=28),
    scoring='neg_mean_absolute_error',
    random_state=42,
    n_jobs=-1,
    verbose=1,
)
# search.fit(X, y)  # fit with your feature matrix
# print("Best params:", search.best_params_)
# print("Best CV MAE:", -search.best_score_)

# Key hyperparameters for time series:
# n_estimators: more trees = lower variance, diminishing returns past ~500
# max_depth:    None often works; limit to prevent overfitting on small datasets
# min_samples_leaf: primary regularisation knob; increase for noisy series
# max_features: 'sqrt' is a strong default; tune for high-dimensional feature sets
print("Hyperparameter search configured. Call search.fit(X, y) to run.")
`,fe=`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor

# Fit RF on the full training set
rf = RandomForestRegressor(n_estimators=500, min_samples_leaf=5,
                           random_state=42, n_jobs=-1)
rf.fit(X, y)

# MDI (mean decrease in impurity) importance — built-in to sklearn
mdi_importance = pd.Series(rf.feature_importances_, index=features)
mdi_importance = mdi_importance.sort_values(ascending=False)

print("Top 10 features (MDI):")
print(mdi_importance.head(10))

# MDI tends to favour high-cardinality features and can be biased;
# combine with permutation importance for a robust view.
from sklearn.inspection import permutation_importance

perm = permutation_importance(
    rf, X, y, n_repeats=15, scoring='neg_mean_absolute_error', random_state=42
)
perm_imp = pd.Series(perm.importances_mean, index=features).sort_values(ascending=False)
print("\\nTop 10 features (Permutation):")
print(perm_imp.head(10))
`,ge=`import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# Recursive multi-step forecasting with a single Random Forest model
# At each step, predict one period ahead and feed back into features.

def recursive_forecast(model, last_known: np.ndarray, lags: list,
                        calendar_fn, horizon: int) -> np.ndarray:
    """
    last_known: array of the most recent max(lags) values
    lags: list of lag offsets (e.g. [1, 7, 14])
    calendar_fn: function(step) -> dict of calendar features for step t+step
    """
    history = list(last_known)
    preds = []
    for h in range(horizon):
        lag_feats = [history[-(lag)] for lag in lags]
        cal_feats = list(calendar_fn(h).values())
        x = np.array(lag_feats + cal_feats).reshape(1, -1)
        pred = model.predict(x)[0]
        preds.append(pred)
        history.append(pred)   # feed prediction back as "known" history
    return np.array(preds)

# Note: error accumulates with horizon in recursive forecasting.
# For long horizons (>14 steps), consider direct multi-output models
# or ensemble of direct models at each horizon.
print("Recursive forecast helper defined.")
`,ue=[{title:"Random Forests",author:"Breiman, L.",year:2001,url:"https://link.springer.com/article/10.1023/A:1010933404324"},{title:"Forecasting: Principles and Practice (3rd ed.) — ML",author:"Hyndman & Athanasopoulos",year:2021,url:"https://otexts.com/fpp3/nnetar.html"},{title:"A review of feature selection methods for machine learning-based disease risk prediction",author:"Liu et al.",year:2021,url:"https://doi.org/10.3389/fgene.2020.617277"},{title:"scikit-learn RandomForestRegressor",author:"Pedregosa et al.",year:2011,url:"https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html"}];function xe(){return e.jsxs(u,{title:"Random Forests for Forecasting",difficulty:"intermediate",readingTime:12,children:[e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Random forests bring ensemble averaging and built-in feature importance to time series forecasting. By converting the forecasting problem into a tabular supervised regression, any ML model — including random forests — can be applied. The result is a robust, largely hyperparameter-insensitive baseline that often outperforms classical statistical methods on complex, multi-seasonal data."}),e.jsxs(h,{term:"Random Forest",children:["An ensemble of ",e.jsx(a.InlineMath,{math:"B"})," decision trees, each trained on a bootstrap sample of the data with a random subset of"," ",e.jsx(a.InlineMath,{math:"m = \\lfloor\\sqrt{p}\\rfloor"})," features considered at each split. Predictions are averaged:",e.jsx(a.BlockMath,{math:String.raw`\hat{y} = \frac{1}{B}\sum_{b=1}^{B} T_b(\mathbf{x})`}),"The double randomisation (bootstrap + feature subsampling) de-correlates the trees, reducing ensemble variance without increasing bias."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Time Series as a Tabular Problem"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["The key transformation is ",e.jsx("em",{children:"tabularisation"}),": the time series is converted into a feature matrix where each row represents one time step with lagged values, rolling statistics, and calendar features as columns. The model then solves a standard supervised regression problem."]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3 my-5",children:[{step:"1. Engineer features",desc:"lags, rolling stats, calendar, exogenous variables"},{step:"2. Create (X, y) pairs",desc:"each row: features at time t, target = y_t"},{step:"3. Train RF",desc:"on chronologically ordered training split"},{step:"4. Predict",desc:"for future rows by populating features with known/predicted lags"},{step:"5. Evaluate",desc:"using TimeSeriesSplit CV to respect temporal order"},{step:"6. Tune",desc:"hyperparameters with RandomizedSearchCV + TimeSeriesSplit"}].map(t=>e.jsxs("div",{className:"p-3 rounded-lg bg-zinc-800 border border-zinc-700",children:[e.jsx("p",{className:"text-sky-400 text-sm font-semibold",children:t.step}),e.jsx("p",{className:"text-zinc-400 text-xs mt-1",children:t.desc})]},t.step))}),e.jsx(s,{code:me,title:"Random Forest Forecasting — Full Tabularisation Pipeline"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Out-of-Bag Error"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["Each bootstrap sample leaves out approximately"," ",e.jsx(a.InlineMath,{math:"1/e \\approx 36.8\\%"})," of training rows. These out-of-bag (OOB) samples are used to estimate prediction error without a separate validation set — making OOB a convenient free diagnostic during hyperparameter tuning."]}),e.jsx(s,{code:pe,title:"Out-of-Bag Error Estimation"}),e.jsxs(f,{title:"OOB Is Biased for Time Series",children:["OOB estimation is valid for i.i.d. data. For time series, bootstrap samples are drawn from across the entire series, so OOB folds can contain future observations relative to training rows. Use ",e.jsx("code",{children:"TimeSeriesSplit"})," for true backtesting; OOB is useful only as a cheap hyperparameter guide."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Key Hyperparameters"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"text-sm text-zinc-300 border-collapse w-full",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-zinc-800",children:["Parameter","Default","Effect","Tuning tip"].map(t=>e.jsx("th",{className:"border border-zinc-700 px-3 py-2 text-left",children:t},t))})}),e.jsx("tbody",{children:[["n_estimators","100","more trees → lower variance","set 300–1000; plateau early"],["max_features","sqrt(p)","fewer features → less correlation","'sqrt' almost always best"],["min_samples_leaf","1","larger → stronger regularisation","5–20 for noisy TS"],["max_depth","None","shallower → lower variance","rarely needed if leaf size set"],["max_samples","None","row sub-sampling per tree","0.7–0.9 for large datasets"]].map(t=>e.jsx("tr",{className:"hover:bg-zinc-800",children:t.map((o,i)=>e.jsx("td",{className:"border border-zinc-700 px-3 py-2 font-mono text-xs",children:o},i))},t[0]))})]})}),e.jsx(s,{code:he,title:"Hyperparameter Tuning with RandomizedSearchCV"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Feature Importance"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Random forests provide two importance measures. Mean Decrease in Impurity (MDI) counts the weighted impurity reduction from all splits on a feature. Permutation importance measures the MAE increase when a feature is shuffled. MDI is fast but biased toward high-cardinality features; permutation importance is model-agnostic and more reliable."}),e.jsx(s,{code:fe,title:"MDI and Permutation Feature Importance"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Multi-Step Forecasting"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"For forecasting beyond one step ahead, the two main approaches are:"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 space-y-1 ml-2 mb-4",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Recursive"}),": feed predictions back as lag features at each step. Simple but errors accumulate."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Direct"}),": train a separate model for each horizon ",e.jsx(a.InlineMath,{math:"h"}),". More models, but no error propagation."]})]}),e.jsx(s,{code:ge,title:"Recursive Multi-Step Forecasting Helper"}),e.jsxs(_,{title:"Advantages and Limitations for Time Series",children:[e.jsx("p",{className:"mb-2 font-semibold text-emerald-400",children:"Advantages"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm mb-3",children:[e.jsx("li",{children:"Robust to outliers and non-stationarity via tree splits"}),e.jsx("li",{children:"Natural feature importance diagnostics"}),e.jsx("li",{children:"Minimal preprocessing: no scaling required"}),e.jsx("li",{children:"Handles mixed-type features (lags + calendar + exogenous)"}),e.jsx("li",{children:"OOB provides free error estimate for model selection"})]}),e.jsx("p",{className:"mb-2 font-semibold text-red-400",children:"Limitations"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm",children:[e.jsx("li",{children:"Extrapolation beyond training range is poor (trees predict training max)"}),e.jsx("li",{children:"Slower than gradient boosting for large datasets"}),e.jsx("li",{children:"No native support for temporal structure or auto-covariance"}),e.jsx("li",{children:"Memory-intensive for large n_estimators"})]})]}),e.jsxs(b,{title:"Energy Demand Forecasting",children:[e.jsx("p",{className:"text-zinc-300 text-sm",children:"A RandomForestRegressor trained on 3 years of hourly electricity demand data with lags [1, 24, 48, 168], rolling means [24, 168], and calendar features (hour_sin/cos, day_of_week_sin/cos, is_holiday, temperature_lag_1) achieves:"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2",children:[e.jsx("li",{children:"MAPE ≈ 2.8% (vs. 4.5% for seasonal naïve)"}),e.jsx("li",{children:"Top features: lag_24, lag_168, temperature_lag_1, hour_sin"}),e.jsx("li",{children:"Best hyperparameters: n_estimators=500, min_samples_leaf=10"}),e.jsx("li",{children:"Prediction intervals: quantile regression forests (sklearn QuantileRegressor)"})]})]}),e.jsx(g,{title:"When to Use Random Forest vs. Gradient Boosting",children:"Random forests are preferable when training speed and robustness matter more than maximum accuracy. Gradient boosting (XGBoost, LightGBM) typically achieves 5–15% lower error on the same feature set but requires more careful hyperparameter tuning and is prone to overfitting on small datasets. Start with RF as a validated baseline, then upgrade to gradient boosting."}),e.jsx(x,{references:ue})]})}const Ct=Object.freeze(Object.defineProperty({__proto__:null,default:xe},Symbol.toStringTag,{value:"Module"})),_e=`# pip install xgboost
import xgboost as xgb
import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

# ── Feature engineering ──────────────────────────────────────────────────────
np.random.seed(0)
n = 800
dates = pd.date_range('2021-01-01', periods=n, freq='D')
y_raw = (100 + np.linspace(0, 30, n)
         + 12 * np.sin(2 * np.pi * np.arange(n) / 365.25)
         + np.random.randn(n) * 4)

df = pd.DataFrame({'ds': dates, 'y': y_raw})
for lag in [1, 2, 3, 7, 14, 28]:
    df[f'lag_{lag}'] = df['y'].shift(lag)
for w in [7, 14, 28]:
    s = df['y'].shift(1)
    df[f'rmean_{w}'] = s.rolling(w).mean()
    df[f'rstd_{w}']  = s.rolling(w).std()
df['dow_sin'] = np.sin(2 * np.pi * df['ds'].dt.dayofweek / 7)
df['dow_cos'] = np.cos(2 * np.pi * df['ds'].dt.dayofweek / 7)
df['month']   = df['ds'].dt.month
df = df.dropna()

features = [c for c in df.columns if c not in ['ds', 'y']]
X, y = df[features].values, df['y'].values

# ── XGBoost with early stopping ───────────────────────────────────────────────
tscv = TimeSeriesSplit(n_splits=5, test_size=28)
maes = []

for fold, (train_idx, val_idx) in enumerate(tscv.split(X)):
    dtrain = xgb.DMatrix(X[train_idx], label=y[train_idx], feature_names=features)
    dval   = xgb.DMatrix(X[val_idx],   label=y[val_idx],   feature_names=features)

    params = {
        'objective':        'reg:squarederror',
        'learning_rate':    0.05,
        'max_depth':        6,
        'min_child_weight': 5,
        'subsample':        0.8,
        'colsample_bytree': 0.8,
        'reg_alpha':        0.1,    # L1 regularisation
        'reg_lambda':       1.0,    # L2 regularisation
        'seed':             42,
    }
    model = xgb.train(
        params,
        dtrain,
        num_boost_round=1000,
        evals=[(dval, 'val')],
        early_stopping_rounds=50,
        verbose_eval=False,
    )
    preds = model.predict(dval)
    mae   = mean_absolute_error(y[val_idx], preds)
    maes.append(mae)
    print(f"Fold {fold+1}: best_iter={model.best_iteration}, MAE={mae:.3f}")

print(f"\\nMean CV MAE: {np.mean(maes):.3f} ± {np.std(maes):.3f}")
`,be=`# sklearn-compatible XGBoost API
import xgboost as xgb
from sklearn.pipeline import Pipeline
from sklearn.model_selection import TimeSeriesSplit, RandomizedSearchCV
import numpy as np

# XGBRegressor wraps XGBoost in sklearn interface
model = xgb.XGBRegressor(
    n_estimators=1000,
    learning_rate=0.05,
    max_depth=6,
    min_child_weight=5,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=1.0,
    early_stopping_rounds=50,   # works with eval_set in .fit()
    random_state=42,
    n_jobs=-1,
    tree_method='hist',         # faster training, similar to LightGBM histogram
)

# Fit with eval set for early stopping
tscv   = TimeSeriesSplit(n_splits=5, test_size=28)
folds  = list(tscv.split(X))
tr_idx, va_idx = folds[-1]

model.fit(
    X[tr_idx], y[tr_idx],
    eval_set=[(X[va_idx], y[va_idx])],
    verbose=False,
)
print(f"Best n_estimators: {model.best_iteration}")

# ── Hyperparameter search ─────────────────────────────────────────────────────
param_dist = {
    'max_depth':        [4, 6, 8, 10],
    'learning_rate':    [0.01, 0.03, 0.05, 0.1],
    'min_child_weight': [1, 3, 5, 10],
    'subsample':        [0.6, 0.8, 1.0],
    'colsample_bytree': [0.6, 0.8, 1.0],
    'reg_alpha':        [0, 0.1, 0.5, 1.0],
    'reg_lambda':       [0.5, 1.0, 2.0],
    'gamma':            [0, 0.1, 0.5],       # min loss reduction to split
}
search = RandomizedSearchCV(
    xgb.XGBRegressor(n_estimators=300, tree_method='hist', random_state=42),
    param_distributions=param_dist,
    n_iter=30,
    cv=TimeSeriesSplit(n_splits=5, test_size=28),
    scoring='neg_mean_absolute_error',
    n_jobs=-1,
    random_state=42,
)
# search.fit(X, y)
print("Hyperparameter search configured.")
`,ye=`import xgboost as xgb
import shap
import pandas as pd
import numpy as np

# Train final model
dtrain = xgb.DMatrix(X, label=y, feature_names=features)
params = {'objective': 'reg:squarederror', 'learning_rate': 0.05,
          'max_depth': 6, 'seed': 42, 'verbosity': 0}
model  = xgb.train(params, dtrain, num_boost_round=300)

# ── SHAP analysis ─────────────────────────────────────────────────────────────
explainer  = shap.TreeExplainer(model)
shap_vals  = explainer.shap_values(X)       # shape (n_samples, n_features)

# Global importance: mean |SHAP|
global_imp = pd.Series(
    np.abs(shap_vals).mean(axis=0), index=features
).sort_values(ascending=False)

print("Global SHAP importance (top 10):")
print(global_imp.head(10))

# SHAP summary plot (requires matplotlib)
# shap.summary_plot(shap_vals, features=X, feature_names=features)

# SHAP dependence: how lag_7 interacts with dow_sin
# shap.dependence_plot('lag_7', shap_vals, X, feature_names=features,
#                      interaction_index='dow_sin')
`,ve=`import xgboost as xgb
import numpy as np

# Custom MAPE-like objective for XGBoost
# XGBoost requires (gradient, hessian) of the loss w.r.t. predictions

def mape_objective(y_pred: np.ndarray, dtrain: xgb.DMatrix):
    """Approximate MAPE gradient/hessian (for positive targets)."""
    y_true  = dtrain.get_label()
    eps     = 1.0                      # smoothing to avoid div-by-zero
    grad    = np.sign(y_pred - y_true) / (np.abs(y_true) + eps)
    hess    = np.ones_like(grad) / (np.abs(y_true) + eps)
    return grad, hess

def mape_eval(y_pred, dtrain):
    """Custom MAPE evaluation metric."""
    y_true = dtrain.get_label()
    mape   = np.mean(np.abs((y_true - y_pred) / (np.abs(y_true) + 1e-8))) * 100
    return 'mape', mape

# Usage: pass to xgb.train
# model = xgb.train(
#     {'seed': 42},
#     dtrain,
#     num_boost_round=500,
#     obj=mape_objective,
#     feval=mape_eval,
#     evals=[(dval, 'val')],
#     early_stopping_rounds=50,
#     verbose_eval=10,
# )
print("Custom MAPE objective defined.")
`,we=[{title:"XGBoost: A Scalable Tree Boosting System",author:"Chen, T. & Guestrin, C.",year:2016,url:"https://arxiv.org/abs/1603.02754"},{title:"XGBoost Python documentation",author:"XGBoost contributors",year:2024,url:"https://xgboost.readthedocs.io/"},{title:"A Unified Approach to Interpreting Model Predictions (SHAP)",author:"Lundberg, S. & Lee, S.-I.",year:2017,url:"https://arxiv.org/abs/1705.07874"},{title:"M5 Accuracy Competition — Winning solutions (XGBoost/LGB dominant)",author:"Makridakis et al.",year:2022,url:"https://doi.org/10.1016/j.ijforecast.2021.11.013"}];function je(){return e.jsxs(u,{title:"XGBoost for Time Series",difficulty:"intermediate",readingTime:13,children:[e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"XGBoost (eXtreme Gradient Boosting) became the dominant algorithm in tabular ML competitions after its 2016 release. In time series forecasting, it consistently outperforms random forests by 5–20% on standard benchmarks and was a cornerstone of winning solutions in the M5 competition. This section covers the gradient boosting framework, XGBoost-specific architecture, and practical patterns for time series use."}),e.jsxs(h,{term:"Gradient Boosting",children:["An ensemble method that builds trees sequentially, each new tree fitting the negative gradient (pseudo-residuals) of the loss function:",e.jsx(a.BlockMath,{math:String.raw`F_m(\mathbf{x}) = F_{m-1}(\mathbf{x}) + \eta \cdot T_m(\mathbf{x})`}),"where ",e.jsx(a.InlineMath,{math:"\\eta"})," is the learning rate (shrinkage) and"," ",e.jsx(a.InlineMath,{math:"T_m"})," is the ",e.jsx(a.InlineMath,{math:"m"}),"-th tree fit to the current residuals. The regularised objective minimised by XGBoost is:",e.jsx(a.BlockMath,{math:String.raw`\mathcal{L} = \sum_{i} \ell(y_i, \hat{y}_i) + \sum_{m}\left[\gamma T + \tfrac{1}{2}\lambda \|\mathbf{w}\|^2 + \alpha \|\mathbf{w}\|_1\right]`}),"where ",e.jsx(a.InlineMath,{math:"T"})," is the number of leaves and"," ",e.jsx(a.InlineMath,{math:"\\mathbf{w}"})," are leaf weights."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"XGBoost Architecture Highlights"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 my-4",children:[{title:"Regularised objective",desc:"L1 + L2 penalties on leaf weights prevent overfitting, especially on small datasets"},{title:"Weighted quantile sketch",desc:"Efficient approximate split finding for large datasets"},{title:"Column subsampling",desc:"colsample_bytree and colsample_bylevel reduce feature correlation, speed up training"},{title:"Sparsity-aware splits",desc:"Handles missing values natively — missing values are routed to the default direction"},{title:"hist tree method",desc:"Histogram-based training (same idea as LightGBM) — much faster on large datasets"},{title:"GPU support",desc:'tree_method="gpu_hist" for multi-GPU training, critical for large feature matrices'}].map(t=>e.jsxs("div",{className:"p-3 rounded-lg bg-zinc-800 border border-zinc-700",children:[e.jsx("p",{className:"text-sky-400 text-sm font-semibold",children:t.title}),e.jsx("p",{className:"text-zinc-400 text-xs mt-1",children:t.desc})]},t.title))}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Full Training Pipeline"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["The recommended workflow: build features, use ",e.jsx("code",{children:"xgb.DMatrix"})," for efficient data storage, and enable early stopping on a time-series validation fold."]}),e.jsx(s,{code:_e,title:"XGBoost Forecasting with Early Stopping and TimeSeriesSplit"}),e.jsxs(f,{title:"Early Stopping with Time Series CV",children:["XGBoost's early stopping monitors the last evaluation set. When using",e.jsx("code",{children:"TimeSeriesSplit"}),", always use the ",e.jsx("em",{children:"most recent"})," fold as the evaluation set (not a random split), so early stopping reflects performance on data the model has never seen in temporal order."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Sklearn API and Hyperparameter Search"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:[e.jsx("code",{children:"XGBRegressor"})," provides a sklearn-compatible interface for integration into pipelines and ",e.jsx("code",{children:"RandomizedSearchCV"}),"."]}),e.jsx(s,{code:be,title:"XGBRegressor + RandomizedSearchCV"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"text-sm text-zinc-300 border-collapse w-full",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-zinc-800",children:["Parameter","Default","Role","Typical range"].map(t=>e.jsx("th",{className:"border border-zinc-700 px-3 py-2 text-left text-xs",children:t},t))})}),e.jsx("tbody",{children:[["learning_rate","0.3","shrinkage per tree","0.01–0.1"],["max_depth","6","tree depth cap","4–10"],["min_child_weight","1","min hessian in leaf","1–20"],["subsample","1.0","row sub-sampling","0.6–1.0"],["colsample_bytree","1.0","column sub-sampling","0.6–1.0"],["reg_alpha","0","L1 regularisation","0–1.0"],["reg_lambda","1","L2 regularisation","0.5–5.0"],["gamma","0","min gain to split","0–0.5"]].map(t=>e.jsx("tr",{className:"hover:bg-zinc-800",children:t.map((o,i)=>e.jsx("td",{className:"border border-zinc-700 px-3 py-1 font-mono text-xs",children:o},i))},t[0]))})]})}),e.jsxs(g,{title:"Learning Rate and n_estimators Trade-off",children:["Lower learning rates require more trees but generalize better. A common practice is to set ",e.jsx("code",{children:"learning_rate=0.05"})," with ",e.jsx("code",{children:"n_estimators=1000"}),"and use early stopping to find the optimal number of rounds. Avoid high learning rates (>0.2) with many rounds — they tend to overfit."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"SHAP Analysis"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["SHAP analysis on XGBoost models produces consistent, theoretically grounded feature attributions. The ",e.jsx("code",{children:"TreeExplainer"})," runs in ",e.jsx(a.InlineMath,{math:"O(TLD)"})," ","time (T trees, L leaves, D features), making it practical even for large ensembles."]}),e.jsx(s,{code:ye,title:"SHAP Feature Importance and Interaction Analysis"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Custom Loss Functions"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"XGBoost accepts custom objectives via a Python function returning the gradient and hessian of the loss. This enables training directly on business metrics like MAPE, asymmetric MAE, or pinball loss for quantile forecasting."}),e.jsx(s,{code:ve,title:"Custom MAPE Objective for XGBoost"}),e.jsx(_,{title:"XGBoost in M5 Competition",children:"In the M5 forecasting competition (30,490 retail series, 28-day horizon), XGBoost and LightGBM-based solutions dominated the top positions. Key patterns used by winners: (1) global models across all series, (2) recursive feature engineering with lags [7, 14, 28], (3) TWEEDIE loss for sparse intermittent demand, (4) ensembling XGBoost with LightGBM and feed-forward networks."}),e.jsxs(b,{title:"Retail Demand Forecasting — XGBoost Configuration",children:[e.jsx("p",{className:"text-zinc-300 text-sm",children:"Typical XGBoost configuration for a daily retail demand forecasting model:"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2",children:[e.jsxs("li",{children:["objective: ",e.jsx("code",{children:"reg:tweedie"})," (handles zero-inflated demand)"]}),e.jsx("li",{children:"learning_rate: 0.05, n_estimators: 1000 with early stopping at 50"}),e.jsx("li",{children:"max_depth: 6, min_child_weight: 10 (robust to demand sparsity)"}),e.jsx("li",{children:"colsample_bytree: 0.8, subsample: 0.8"}),e.jsx("li",{children:"Features: lags [1,7,14,28], rolling [7,28], calendar, store/product encoding"}),e.jsx("li",{children:"CV: TimeSeriesSplit with 5 folds, test_size=28 (matches horizon)"})]})]}),e.jsx(x,{references:we})]})}const Lt=Object.freeze(Object.defineProperty({__proto__:null,default:je},Symbol.toStringTag,{value:"Module"})),ke=`# pip install lightgbm
import lightgbm as lgb
import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

# ── Feature engineering ──────────────────────────────────────────────────────
np.random.seed(1)
n = 900
dates = pd.date_range('2021-01-01', periods=n, freq='D')
y_raw = (150
         + np.linspace(0, 40, n)
         + 15 * np.sin(2 * np.pi * np.arange(n) / 365.25)
         + 5  * np.sin(2 * np.pi * np.arange(n) / 7)
         + np.random.randn(n) * 5)

df = pd.DataFrame({'ds': dates, 'y': y_raw})
for lag in [1, 2, 3, 7, 14, 28]:
    df[f'lag_{lag}'] = df['y'].shift(lag)
for w in [7, 14, 28]:
    s = df['y'].shift(1)
    df[f'rmean_{w}'] = s.rolling(w).mean()
    df[f'rstd_{w}']  = s.rolling(w).std()
df['dow']   = df['ds'].dt.dayofweek     # categorical: 0–6
df['month'] = df['ds'].dt.month         # categorical: 1–12
df['dow_sin'] = np.sin(2 * np.pi * df['dow'] / 7)
df['dow_cos'] = np.cos(2 * np.pi * df['dow'] / 7)
df = df.dropna()

features  = [c for c in df.columns if c not in ['ds', 'y']]
cat_feats = ['dow', 'month']    # will use LightGBM's native categorical support
X = df[features]
y = df['y'].values

# ── LightGBM dataset and training ─────────────────────────────────────────────
tscv = TimeSeriesSplit(n_splits=5, test_size=28)
maes = []

for fold, (tr, va) in enumerate(tscv.split(X)):
    dtrain = lgb.Dataset(X.iloc[tr], label=y[tr], categorical_feature=cat_feats, free_raw_data=False)
    dval   = lgb.Dataset(X.iloc[va], label=y[va], reference=dtrain, free_raw_data=False)

    params = {
        'objective':       'regression',
        'metric':          'mae',
        'learning_rate':   0.05,
        'num_leaves':      63,           # primary complexity parameter
        'min_data_in_leaf': 20,
        'feature_fraction': 0.8,         # colsample equivalent
        'bagging_fraction': 0.8,         # subsample equivalent
        'bagging_freq':    1,
        'reg_alpha':       0.1,
        'reg_lambda':      1.0,
        'verbose':         -1,
        'seed':            42,
    }
    model = lgb.train(
        params,
        dtrain,
        num_boost_round=1000,
        valid_sets=[dval],
        callbacks=[
            lgb.early_stopping(stopping_rounds=50, verbose=False),
            lgb.log_evaluation(period=-1),
        ],
    )
    preds = model.predict(X.iloc[va])
    mae   = mean_absolute_error(y[va], preds)
    maes.append(mae)
    print(f"Fold {fold+1}: best_iter={model.best_iteration}, MAE={mae:.3f}")

print(f"\\nMean CV MAE: {np.mean(maes):.3f} ± {np.std(maes):.3f}")
`,Se=`import lightgbm as lgb
import pandas as pd
import numpy as np

# LightGBM handles categorical features natively using
# an optimal many-vs-many grouping strategy (Fisher 1958).
# This is superior to one-hot encoding for high-cardinality categoricals.

# Create a multi-store dataset
np.random.seed(0)
n = 2000
df = pd.DataFrame({
    'ds':       pd.date_range('2022-01-01', periods=n, freq='D').repeat(1),
    'store_id': np.random.choice(['A', 'B', 'C', 'D', 'E'], size=n),
    'product':  np.random.choice(range(50), size=n),
})
df['y'] = (df['store_id'].map({'A':100,'B':150,'C':200,'D':80,'E':120})
           + df['product'] * 2
           + np.random.randn(n) * 10)

# Convert to pandas Categorical — LightGBM detects these automatically
df['store_id'] = df['store_id'].astype('category')
df['product']  = df['product'].astype('category')

# Lag features (within each store/product group)
df = df.sort_values(['store_id', 'product', 'ds'])
df['lag_1'] = df.groupby(['store_id', 'product'])['y'].shift(1)
df = df.dropna()

X = df[['store_id', 'product', 'lag_1']]
y = df['y'].values

# LightGBM automatically treats pandas Categorical columns as categoricals
dtrain = lgb.Dataset(X, label=y)
params = {
    'objective': 'regression_l1',
    'num_leaves': 31,
    'learning_rate': 0.05,
    'verbose': -1,
}
model = lgb.train(params, dtrain, num_boost_round=200)
print("Model trained with native categorical features.")
print(f"Feature importance: {dict(zip(X.columns, model.feature_importance()))}")
`,Fe=`import lightgbm as lgb
import optuna
from sklearn.model_selection import TimeSeriesSplit, cross_val_score
import numpy as np

# Optuna is the recommended hyperparameter tuner for LightGBM
# pip install optuna

def objective(trial):
    params = {
        'objective':         'regression',
        'metric':            'mae',
        'verbosity':         -1,
        'num_leaves':        trial.suggest_int('num_leaves', 20, 300),
        'learning_rate':     trial.suggest_float('lr', 0.01, 0.2, log=True),
        'min_data_in_leaf':  trial.suggest_int('min_data', 5, 100),
        'feature_fraction':  trial.suggest_float('feature_fraction', 0.4, 1.0),
        'bagging_fraction':  trial.suggest_float('bagging_fraction', 0.4, 1.0),
        'bagging_freq':      trial.suggest_int('bagging_freq', 1, 7),
        'reg_alpha':         trial.suggest_float('alpha', 0.0, 5.0),
        'reg_lambda':        trial.suggest_float('lambda', 0.0, 5.0),
        'seed': 42,
    }
    tscv = TimeSeriesSplit(n_splits=5, test_size=28)
    maes = []
    for tr, va in tscv.split(X):
        dtrain = lgb.Dataset(X[tr], label=y[tr])
        dval   = lgb.Dataset(X[va], label=y[va], reference=dtrain)
        m = lgb.train(params, dtrain, num_boost_round=300,
                      valid_sets=[dval],
                      callbacks=[lgb.early_stopping(30, verbose=False),
                                 lgb.log_evaluation(-1)])
        maes.append(np.mean(np.abs(y[va] - m.predict(X[va]))))
    return np.mean(maes)

# study = optuna.create_study(direction='minimize')
# study.optimize(objective, n_trials=50, show_progress_bar=True)
# print("Best params:", study.best_params)
# print("Best MAE:", study.best_value)
print("Optuna objective function defined. Call study.optimize() to run.")
`,Me=`import lightgbm as lgb
import numpy as np

# GPU training with LightGBM
# Requirements: LightGBM compiled with GPU support
# pip install lightgbm --install-option=--gpu   (or use pre-built wheels)

params_gpu = {
    'objective':     'regression',
    'metric':        'mae',
    'device':        'gpu',          # or 'cuda' for CUDA-based GPU
    'gpu_platform_id': 0,
    'gpu_device_id': 0,
    'num_leaves':    255,            # can afford deeper trees with GPU speed
    'learning_rate': 0.05,
    'feature_fraction': 0.8,
    'verbose': -1,
}

# For CPU: histogram-based training is already very fast
params_cpu = {
    'objective':     'regression',
    'metric':        'mae',
    'device':        'cpu',
    'num_threads':   8,              # parallelism
    'num_leaves':    63,
    'learning_rate': 0.05,
    'verbose': -1,
}

# LightGBM CPU is already faster than XGBoost for large datasets
# GPU provides 10-100x speedup on very large datasets (>1M rows)
print("GPU and CPU configurations defined.")
`,Ne=`import lightgbm as lgb
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import numpy as np

# sklearn-compatible LGBMRegressor
model = lgb.LGBMRegressor(
    n_estimators=1000,
    learning_rate=0.05,
    num_leaves=63,
    min_child_samples=20,          # min_data_in_leaf equivalent
    subsample=0.8,
    subsample_freq=1,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=1.0,
    random_state=42,
    n_jobs=-1,
    verbose=-1,
)

# LightGBM does NOT need feature scaling — tree splits are scale-invariant.
# But if embedding in a pipeline with a linear model:
pipe = Pipeline([
    # ('scaler', StandardScaler()),   # NOT needed for LightGBM
    ('lgb', model),
])

# Fit with early stopping via callbacks
from sklearn.model_selection import TimeSeriesSplit
tscv = TimeSeriesSplit(n_splits=5, test_size=28)
tr, va = list(tscv.split(X))[-1]

model.fit(
    X[tr], y[tr],
    eval_set=[(X[va], y[va])],
    callbacks=[lgb.early_stopping(50), lgb.log_evaluation(-1)],
)
print(f"Best iteration: {model.best_iteration_}")
`,ze=[{title:"LightGBM: A Highly Efficient Gradient Boosting Decision Tree",author:"Ke et al.",year:2017,url:"https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html"},{title:"LightGBM documentation",author:"Microsoft",year:2024,url:"https://lightgbm.readthedocs.io/"},{title:"Optuna: A Next-generation Hyperparameter Optimization Framework",author:"Akiba et al.",year:2019,url:"https://arxiv.org/abs/1907.10902"},{title:"M5 Forecasting Competition — Methods overview",author:"Makridakis et al.",year:2022,url:"https://doi.org/10.1016/j.ijforecast.2021.11.013"}];function Te(){return e.jsxs(u,{title:"LightGBM for Forecasting",difficulty:"intermediate",readingTime:13,children:[e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"LightGBM (Light Gradient Boosting Machine) was developed by Microsoft to address XGBoost's speed limitations on large datasets. It introduced two key innovations — histogram-based splitting and leaf-wise tree growth — that make it significantly faster and often more accurate than XGBoost, especially on high-dimensional feature sets common in ML forecasting pipelines."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Key Architectural Innovations"}),e.jsxs(h,{term:"Histogram-Based Splitting",children:["Instead of sorting all feature values to find split points (O(n log n)), LightGBM bins continuous features into ",e.jsx(a.InlineMath,{math:"K"})," discrete histogram buckets (default K=255). Split finding then requires scanning only K buckets rather than all n values — reducing the per-tree cost from",e.jsx(a.InlineMath,{math:"O(np)"})," to ",e.jsx(a.InlineMath,{math:"O(Kp)"}),", where"," ",e.jsx(a.InlineMath,{math:"K \\ll n"}),"."]}),e.jsxs(h,{term:"Leaf-Wise (Best-First) Tree Growth",children:["XGBoost grows trees level-by-level (depth-first). LightGBM grows the leaf with the largest loss reduction at each step, regardless of depth. This produces asymmetric trees that reduce loss faster per split, but requires the"," ",e.jsx("code",{children:"max_depth"})," or ",e.jsx("code",{children:"num_leaves"})," constraint to prevent overfitting.",e.jsx(a.BlockMath,{math:String.raw`\text{next leaf} = \arg\max_{\ell} \Delta L_\ell`}),"The result: with the same ",e.jsx("code",{children:"num_leaves"}),", leaf-wise trees achieve lower loss than depth-wise trees."]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 my-5",children:[{title:"Speed",val:"5–20x faster than XGBoost on large datasets"},{title:"num_leaves",val:"Primary complexity knob (replaces max_depth)"},{title:"GOSS",val:"Gradient-based One-Side Sampling: focus on high-gradient rows"},{title:"EFB",val:"Exclusive Feature Bundling: compresses sparse features"},{title:"Native categoricals",val:"Optimal split finding for categorical features"},{title:"GPU training",val:"Full GPU support with histogram method"}].map(t=>e.jsxs("div",{className:"p-3 rounded-lg bg-zinc-800 border border-zinc-700",children:[e.jsx("p",{className:"text-sky-400 text-sm font-semibold",children:t.title}),e.jsx("p",{className:"text-zinc-400 text-xs mt-1",children:t.val})]},t.title))}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Full Forecasting Pipeline"}),e.jsx(s,{code:ke,title:"LightGBM Forecasting — Full Pipeline"}),e.jsxs(f,{title:"num_leaves is the Primary Regularisation Knob",children:["Unlike XGBoost where ",e.jsx("code",{children:"max_depth"})," is primary, LightGBM's main complexity control is ",e.jsx("code",{children:"num_leaves"}),". A model with",e.jsx("code",{children:"num_leaves=127"})," and ",e.jsx("code",{children:"max_depth=7"})," is very different from a model with only ",e.jsx("code",{children:"max_depth=7"}),". Always tune",e.jsx("code",{children:"num_leaves"})," first, then ",e.jsx("code",{children:"min_data_in_leaf"})," for regularisation."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Native Categorical Features"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"LightGBM's categorical feature support uses an optimal Fisher grouping algorithm that finds the best many-vs-many partition of categories, avoiding the cardinality explosion of one-hot encoding. For time series forecasting with many store/product IDs, this is a significant advantage."}),e.jsx(s,{code:Se,title:"Native Categorical Features in LightGBM"}),e.jsx(g,{title:"When to Use Native Categoricals",children:"LightGBM's native categorical handling outperforms one-hot encoding when cardinality is high (>10 categories) and the relationship between category and target is non-linear. For low-cardinality features (e.g., day_of_week with 7 values), cyclical encoding may still be preferred for linear model interpretability."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Hyperparameter Tuning with Optuna"}),e.jsx(s,{code:Fe,title:"Optuna Hyperparameter Search for LightGBM"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"text-sm text-zinc-300 border-collapse w-full",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-zinc-800",children:["Parameter","Default","Effect","Typical range"].map(t=>e.jsx("th",{className:"border border-zinc-700 px-3 py-2 text-left text-xs",children:t},t))})}),e.jsx("tbody",{children:[["num_leaves","31","model complexity","20–300 (start at 63)"],["learning_rate","0.1","shrinkage","0.01–0.1"],["min_data_in_leaf","20","regularisation","10–100 for TS"],["feature_fraction","1.0","column sub-sampling","0.6–1.0"],["bagging_fraction","1.0","row sub-sampling","0.6–0.9"],["bagging_freq","0","sub-sampling frequency","1–5"],["reg_alpha","0","L1 penalty","0–2.0"],["reg_lambda","0","L2 penalty","0–5.0"]].map(t=>e.jsx("tr",{className:"hover:bg-zinc-800",children:t.map((o,i)=>e.jsx("td",{className:"border border-zinc-700 px-3 py-1 font-mono text-xs",children:o},i))},t[0]))})]})}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"GPU Training"}),e.jsx(s,{code:Me,title:"GPU Training Configuration"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Sklearn API"}),e.jsx(s,{code:Ne,title:"LGBMRegressor (sklearn API)"}),e.jsx(_,{title:"LightGBM vs. XGBoost for Forecasting",children:"Empirically, LightGBM trains 5–20x faster than XGBoost on large datasets (>100K rows) due to histogram-based splitting. Accuracy is similar — neither consistently dominates, though LightGBM often wins on high-cardinality categorical features. For the M5 competition (30K series, millions of rows), LightGBM was the workhorse of most top solutions due to its training speed, enabling more extensive hyperparameter search and more complex feature engineering."}),e.jsxs(b,{title:"Electricity Demand Forecasting — LightGBM Config",children:[e.jsx("p",{className:"text-zinc-300 text-sm",children:"For a national-level hourly electricity demand forecasting problem (8760 historical observations per year, 24-hour horizon):"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2",children:[e.jsx("li",{children:"objective: regression_l1 (MAE — robust to demand spikes)"}),e.jsx("li",{children:"num_leaves: 127, min_data_in_leaf: 50"}),e.jsx("li",{children:"learning_rate: 0.05, n_estimators: 800 with early stopping"}),e.jsx("li",{children:"feature_fraction: 0.7, bagging_fraction: 0.8, bagging_freq: 1"}),e.jsx("li",{children:"Native categoricals: hour, day_of_week, month, is_holiday"}),e.jsx("li",{children:"Exogenous: temperature (lag_1, lag_24, rolling_mean_24)"}),e.jsx("li",{children:"Training time on CPU (8 cores): ~45 seconds vs ~8 min for XGBoost"})]})]}),e.jsx(x,{references:ze})]})}const Rt=Object.freeze(Object.defineProperty({__proto__:null,default:Te},Symbol.toStringTag,{value:"Module"})),Be=`# pip install catboost
from catboost import CatBoostRegressor, Pool
import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

# ── Feature engineering ──────────────────────────────────────────────────────
np.random.seed(7)
n = 700
dates = pd.date_range('2021-01-01', periods=n, freq='D')
y_raw = (200
         + np.linspace(0, 25, n)
         + 20 * np.sin(2 * np.pi * np.arange(n) / 365.25)
         + np.random.randn(n) * 6)

df = pd.DataFrame({'ds': dates, 'y': y_raw})
for lag in [1, 2, 3, 7, 14, 28]:
    df[f'lag_{lag}'] = df['y'].shift(lag)
for w in [7, 14, 28]:
    s = df['y'].shift(1)
    df[f'rmean_{w}'] = s.rolling(w).mean()
    df[f'rstd_{w}']  = s.rolling(w).std()
df['dow']   = df['ds'].dt.dayofweek.astype(str)   # string = categorical
df['month'] = df['ds'].dt.month.astype(str)
df['dow_sin'] = np.sin(2 * np.pi * df['ds'].dt.dayofweek / 7)
df['dow_cos'] = np.cos(2 * np.pi * df['ds'].dt.dayofweek / 7)
df = df.dropna()

features  = [c for c in df.columns if c not in ['ds', 'y']]
cat_cols  = ['dow', 'month']
num_cols  = [c for c in features if c not in cat_cols]
X = df[features]
y = df['y'].values

# ── CatBoost with TimeSeriesSplit ──────────────────────────────────────────────
tscv = TimeSeriesSplit(n_splits=5, test_size=28)
maes = []

for fold, (tr, va) in enumerate(tscv.split(X)):
    X_tr, X_va = X.iloc[tr], X.iloc[va]
    y_tr, y_va = y[tr], y[va]

    # CatBoost Pool: wraps X + y + categorical feature indices
    train_pool = Pool(X_tr, y_tr, cat_features=cat_cols)
    val_pool   = Pool(X_va, y_va, cat_features=cat_cols)

    model = CatBoostRegressor(
        iterations=1000,
        learning_rate=0.05,
        depth=6,                    # max tree depth
        l2_leaf_reg=3.0,            # L2 regularisation
        rsm=0.8,                    # random subspace method (feature fraction)
        subsample=0.8,              # row sub-sampling
        eval_metric='MAE',
        early_stopping_rounds=50,
        random_seed=42,
        verbose=False,
    )
    model.fit(train_pool, eval_set=val_pool)

    preds = model.predict(val_pool)
    mae   = mean_absolute_error(y_va, preds)
    maes.append(mae)
    print(f"Fold {fold+1}: best_iter={model.best_iteration_}, MAE={mae:.3f}")

print(f"\\nMean CV MAE: {np.mean(maes):.3f} ± {np.std(maes):.3f}")
`,Ce=`# CatBoost's "Ordered Boosting" is its core differentiator.
# Standard gradient boosting computes pseudo-residuals using the full
# training set, which causes overfitting on categorical target statistics.
#
# Ordered boosting fixes this:
# 1. Assign each training example a random order (permutation)
# 2. When computing the gradient for example i, use only examples
#    that appear BEFORE i in the random order
# 3. For categorical features, compute target statistics using only
#    the "past" examples in the permutation
#
# This eliminates target leakage in categorical encoding, which is
# particularly impactful when many high-cardinality categoricals exist.
#
# In practice: set boosting_type='Ordered' (default for small datasets)
# For large datasets (>50K rows), 'Plain' is faster with minimal accuracy loss.

from catboost import CatBoostRegressor

model_ordered = CatBoostRegressor(
    iterations=500,
    learning_rate=0.05,
    boosting_type='Ordered',      # default for small/medium datasets
    verbose=False,
)

model_plain = CatBoostRegressor(
    iterations=500,
    learning_rate=0.05,
    boosting_type='Plain',        # faster, use for >50K rows
    verbose=False,
)
print("Ordered and Plain boosting models configured.")
`,Le=`from catboost import CatBoostRegressor, Pool
import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

# Multi-series demand forecasting with CatBoost
# High-cardinality store + product categoricals — where CatBoost excels

np.random.seed(0)
n_stores   = 20
n_products = 50
dates      = pd.date_range('2022-01-01', periods=365, freq='D')

records = []
for store in range(n_stores):
    for prod in range(n_products):
        base = 50 + store * 5 + prod * 2
        sales = (base
                 + 5 * np.sin(2 * np.pi * np.arange(365) / 7)
                 + np.random.randn(365) * 3)
        for i, d in enumerate(dates):
            records.append({
                'ds':       d,
                'store_id': f'store_{store:02d}',
                'product':  f'prod_{prod:03d}',
                'y':        max(0, sales[i]),
            })

df = pd.DataFrame(records)
df = df.sort_values(['store_id', 'product', 'ds'])

# Lag features within each series
for lag in [1, 7, 14]:
    df[f'lag_{lag}'] = df.groupby(['store_id', 'product'])['y'].shift(lag)
df['roll_mean_7'] = (
    df.groupby(['store_id', 'product'])['y']
      .transform(lambda x: x.shift(1).rolling(7).mean())
)
df['dow']   = df['ds'].dt.dayofweek.astype(str)
df['month'] = df['ds'].dt.month.astype(str)
df = df.dropna()

features = ['store_id', 'product', 'dow', 'month', 'lag_1', 'lag_7', 'lag_14', 'roll_mean_7']
cat_cols  = ['store_id', 'product', 'dow', 'month']
X = df[features]
y = df['y'].values

# Time-based split (last 28 days as test)
split_date = pd.Timestamp('2022-12-04')
tr_mask = df['ds'] < split_date
va_mask = df['ds'] >= split_date

train_pool = Pool(X[tr_mask], y[tr_mask], cat_features=cat_cols)
val_pool   = Pool(X[va_mask], y[va_mask], cat_features=cat_cols)

model = CatBoostRegressor(
    iterations=500,
    learning_rate=0.05,
    depth=6,
    l2_leaf_reg=3.0,
    eval_metric='MAE',
    early_stopping_rounds=50,
    random_seed=42,
    verbose=False,
)
model.fit(train_pool, eval_set=val_pool)

preds = model.predict(val_pool)
print(f"Test MAE: {mean_absolute_error(y[va_mask], preds):.3f}")
print(f"Best iteration: {model.best_iteration_}")
`,Re=`from catboost import CatBoostRegressor
import pandas as pd
import numpy as np

# CatBoost provides multiple feature importance measures

# 1. PredictionValuesChange (default): similar to MDI in random forests
# 2. LossFunctionChange: how much loss increases if feature is removed
# 3. ShapValues: SHAP values (most reliable, most expensive)

model.fit(train_pool, eval_set=val_pool, verbose=False)

# Default importance
imp_default = pd.Series(
    model.get_feature_importance(),
    index=features
).sort_values(ascending=False)
print("PredictionValuesChange importance:")
print(imp_default)

# SHAP values
shap_vals = model.get_feature_importance(
    data=val_pool,
    type='ShapValues',
)  # shape (n_samples, n_features + 1)

shap_mean = pd.Series(
    np.abs(shap_vals[:, :-1]).mean(axis=0),
    index=features
).sort_values(ascending=False)
print("\\nSHAP importance:")
print(shap_mean)
`,Ae=[{title:"CatBoost: unbiased boosting with categorical features",author:"Prokhorenkova et al.",year:2018,url:"https://arxiv.org/abs/1706.09516"},{title:"CatBoost documentation",author:"Yandex",year:2024,url:"https://catboost.ai/docs/"},{title:"Ordered Boosting in CatBoost",author:"Dorogush, A. et al.",year:2017,url:"https://arxiv.org/abs/1706.09516"},{title:"Benchmarking gradient boosting algorithms for tabular data",author:"Grinsztajn et al.",year:2022,url:"https://arxiv.org/abs/2207.08815"}];function Pe(){return e.jsxs(u,{title:"CatBoost for Forecasting",difficulty:"intermediate",readingTime:10,children:[e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"CatBoost, developed by Yandex in 2017, introduces ordered boosting — a technique that eliminates target leakage in categorical feature encoding. For time series forecasting problems with many categorical identifiers (store, product, region, customer segment), CatBoost often outperforms XGBoost and LightGBM with significantly less preprocessing."}),e.jsx(h,{term:"Ordered Boosting",children:"A variant of gradient boosting that computes pseudo-residuals for each training example using only the subset of data that comes before it in a random permutation. This prevents the target leakage problem that arises when gradient statistics for categorical feature encoding are computed from the full training set."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Why Ordered Boosting Matters"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Standard gradient boosting with target-encoded categoricals has a subtle leakage issue: the target encoding of a category is computed using all rows of that category, including the row being predicted. This causes overfitting on high-cardinality categorical features. CatBoost solves this with its ordered approach:"}),e.jsx(s,{code:Ce,title:"Ordered vs. Plain Boosting in CatBoost"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3 my-5",children:[{title:"No manual encoding",desc:"Pass string/integer categorical columns directly — no one-hot or target encoding required"},{title:"Ordered statistics",desc:"Target statistics computed without leakage, crucial for high-cardinality IDs"},{title:"Symmetric trees",desc:"All nodes at the same depth use the same split — faster GPU inference, better generalisation"},{title:"Robust to defaults",desc:"Default hyperparameters work well out-of-the-box; less tuning needed than XGBoost/LGB"},{title:"Built-in SHAP",desc:'Fast SHAP value computation via get_feature_importance(type="ShapValues")'},{title:"Missing values",desc:"Native handling of NaN without imputation"}].map(t=>e.jsxs("div",{className:"p-3 rounded-lg bg-zinc-800 border border-zinc-700",children:[e.jsx("p",{className:"text-sky-400 text-sm font-semibold",children:t.title}),e.jsx("p",{className:"text-zinc-400 text-xs mt-1",children:t.desc})]},t.title))}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Basic Forecasting Pipeline"}),e.jsx(s,{code:Be,title:"CatBoost Forecasting with TimeSeriesSplit"}),e.jsxs(g,{title:"Passing Categoricals to CatBoost",children:["CatBoost requires categorical features to be either string type or integer type — not pandas Categorical. Pass the column names (or indices) via",e.jsx("code",{children:"cat_features"})," in the ",e.jsx("code",{children:"Pool"})," constructor. String columns are automatically handled; integer columns designated as categorical are treated as unordered categories rather than numeric values."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Multi-Series Demand Forecasting"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"CatBoost's native categorical support is most valuable when forecasting hundreds or thousands of series with categorical identifiers (store, product, SKU, region). A global model can learn cross-series patterns without any manual encoding."}),e.jsx(s,{code:Le,title:"Demand Forecasting with Store + Product Categoricals"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Feature Importance and SHAP"}),e.jsx(s,{code:Re,title:"Feature Importance Methods in CatBoost"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"text-sm text-zinc-300 border-collapse w-full",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-zinc-800",children:["Parameter","Default","Role"].map(t=>e.jsx("th",{className:"border border-zinc-700 px-3 py-2 text-left text-xs",children:t},t))})}),e.jsx("tbody",{children:[["iterations","1000","number of trees (use with early stopping)"],["learning_rate","0.03","shrinkage (lower than XGBoost default)"],["depth","6","symmetric tree depth (4–10 for TS)"],["l2_leaf_reg","3.0","L2 regularisation on leaf values"],["rsm","1.0","random subspace method (feature fraction)"],["subsample","1.0 (Bernoulli)","row sub-sampling (bootstrap=Bernoulli)"],["boosting_type","Ordered/Plain","Ordered for <50K rows; Plain otherwise"],["border_count","254","histogram bucket count (like num_leaves in LGB)"]].map(t=>e.jsx("tr",{className:"hover:bg-zinc-800",children:t.map((o,i)=>e.jsx("td",{className:"border border-zinc-700 px-3 py-1 font-mono text-xs",children:o},i))},t[0]))})]})}),e.jsx(f,{title:"Training Speed vs. XGBoost/LightGBM",children:"CatBoost's ordered boosting with symmetric trees is slower to train than LightGBM on pure numerical data. For datasets with many numerical features and few categoricals, LightGBM is usually preferred. CatBoost's speed advantage emerges with GPU training and many high-cardinality categoricals, where its native encoding avoids the preprocessing overhead."}),e.jsx(_,{title:"CatBoost vs. XGBoost/LightGBM — When to Choose",children:e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Choose CatBoost"})," when: many high-cardinality categoricals (store/product IDs), limited time for feature preprocessing, need robust out-of-box defaults"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Choose LightGBM"})," when: large dataset (>500K rows), need fastest training, primarily numerical features"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Choose XGBoost"})," when: small dataset, maximum sklearn ecosystem compatibility, extensive community resources needed"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"In practice"}),": ensemble all three for maximum accuracy (a common pattern in top forecasting competition solutions)"]})]})}),e.jsxs(b,{title:"E-commerce Demand Forecasting with CatBoost",children:[e.jsx("p",{className:"text-zinc-300 text-sm",children:"An e-commerce retailer with 10,000 SKUs across 50 warehouses uses CatBoost for 7-day-ahead demand forecasting:"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2",children:[e.jsx("li",{children:"Categorical features: sku_id, warehouse_id, category, brand (all high-cardinality)"}),e.jsx("li",{children:"No manual encoding — passed directly as string columns"}),e.jsx("li",{children:"Numerical features: lags [1,7,14,28], rolling [7,28], price, is_promotion"}),e.jsx("li",{children:"Model trained globally on all series: 1 model, 500K rows"}),e.jsx("li",{children:"Result: 12% lower MAPE vs. per-SKU ARIMA baseline, 3x faster to retrain"})]})]}),e.jsx(x,{references:Ae})]})}const At=Object.freeze(Object.defineProperty({__proto__:null,default:Pe},Symbol.toStringTag,{value:"Module"}));function Ge(t=20,o=1,i=.12){return Array.from({length:t},(d,r)=>{const n=r+1;return{h:n,recursive:parseFloat((o*Math.pow(1+i,n-1)).toFixed(3)),direct:parseFloat((o*(1+.01*(n-1))).toFixed(3)),dirrec:parseFloat((o*(1+.05*(n-1))).toFixed(3))}})}function De(){const[t,o]=S.useState(14),i=Ge(t);return e.jsxs("div",{style:{margin:"1.5rem 0",padding:"1rem",background:"#0f172a",borderRadius:"8px",border:"1px solid #334155"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"0.75rem"},children:[e.jsx("span",{style:{color:"#cbd5e1",fontSize:"0.9rem",fontWeight:600},children:"Error vs Horizon"}),e.jsxs("label",{style:{color:"#94a3b8",fontSize:"0.82rem"},children:["Max horizon: ",e.jsx("span",{style:{color:"#38bdf8",fontWeight:"bold"},children:t})]}),e.jsx("input",{type:"range",min:5,max:28,value:t,onChange:d=>o(Number(d.target.value)),style:{width:"100px",accentColor:"#38bdf8"}})]}),e.jsx(M,{width:"100%",height:220,children:e.jsxs(L,{data:i,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(N,{strokeDasharray:"3 3",stroke:"#1e3a5f"}),e.jsx(z,{dataKey:"h",stroke:"#94a3b8",label:{value:"Horizon h",fill:"#94a3b8",position:"insideBottom",offset:-2}}),e.jsx(T,{stroke:"#94a3b8"}),e.jsx(B,{contentStyle:{background:"#1e293b",border:"1px solid #334155",color:"#e2e8f0"}}),e.jsx(C,{wrapperStyle:{color:"#94a3b8"}}),e.jsx(v,{type:"monotone",dataKey:"recursive",stroke:"#f87171",dot:!1,strokeWidth:2,name:"Recursive (error compounds)"}),e.jsx(v,{type:"monotone",dataKey:"direct",stroke:"#34d399",dot:!1,strokeWidth:2,name:"Direct (stable)"}),e.jsx(v,{type:"monotone",dataKey:"dirrec",stroke:"#fbbf24",dot:!1,strokeWidth:2,name:"DirRec (moderate growth)"})]})}),e.jsx("p",{style:{color:"#64748b",fontSize:"0.78rem",marginTop:"0.4rem"},children:"Simulated relative MAE normalised to h=1. Recursive error grows exponentially; Direct stays flat since each model predicts directly from observed history."})]})}function Ee(){const[t,o]=S.useState(7),i=[{name:"Recursive",models:1,steps:t,errorProp:!0,desc:"Single model applied iteratively"},{name:"Direct (MIMO)",models:t,steps:1,errorProp:!1,desc:`${t} independent models`},{name:"DirRec",models:t,steps:t,errorProp:!1,desc:"Direct + lag feedback (hybrid)"},{name:"Multi-output",models:1,steps:t,errorProp:!1,desc:"Single model, vector output"}];return e.jsxs("div",{className:"my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900",children:[e.jsxs("h3",{className:"text-sm font-semibold text-zinc-300 mb-3",children:["Strategy Comparison (h=",t,")"]}),e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsxs("label",{className:"text-sm text-zinc-400",children:["Horizon h: ",e.jsx("span",{className:"text-sky-400 font-bold",children:t})]}),e.jsx("input",{type:"range",min:1,max:28,value:t,onChange:d=>o(Number(d.target.value)),className:"w-40 accent-sky-500"})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3",children:i.map(d=>e.jsxs("div",{className:"p-3 rounded-lg bg-zinc-800 border border-zinc-700",children:[e.jsx("p",{className:"text-sky-400 font-semibold text-sm",children:d.name}),e.jsx("p",{className:"text-zinc-400 text-xs mt-1",children:d.desc}),e.jsxs("div",{className:"flex gap-4 mt-2",children:[e.jsxs("span",{className:"text-xs",children:[e.jsx("span",{className:"text-amber-300",children:d.models})," ",e.jsx("span",{className:"text-zinc-500",children:"model(s)"})]}),e.jsx("span",{className:`text-xs ${d.errorProp?"text-red-400":"text-emerald-400"}`,children:d.errorProp?"error propagates":"no error prop."})]})]},d.name))})]})}const Xe=`import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error

# ── Build feature matrix ──────────────────────────────────────────────────────
np.random.seed(0)
n = 500
y = np.sin(np.arange(n) * 2 * np.pi / 52) * 10 + np.random.randn(n) * 2 + 50
lags = [1, 2, 3, 7, 14]

def make_features(series, lags):
    df = pd.DataFrame({'y': series})
    for l in lags: df[f'lag_{l}'] = df['y'].shift(l)
    df = df.dropna()
    return df[sorted([c for c in df.columns if c != 'y'])].values, df['y'].values

X, target = make_features(y, lags)
split = int(len(X) * 0.8)
model = GradientBoostingRegressor(n_estimators=200, learning_rate=0.05, random_state=42)
model.fit(X[:split], target[:split])

# ── Recursive multi-step prediction ──────────────────────────────────────────
def recursive_predict(model, history, lags, horizon):
    """history: array of past values (at least max(lags) long)."""
    hist = list(history)
    preds = []
    for _ in range(horizon):
        feat = np.array([hist[-l] for l in lags]).reshape(1, -1)
        p    = model.predict(feat)[0]
        preds.append(p)
        hist.append(p)   # feed back predicted value
    return np.array(preds)

history = y[:split + max(lags)]
horizon = 14
preds_recursive = recursive_predict(model, history, lags, horizon)
true_vals = y[split + max(lags): split + max(lags) + horizon]
print(f"Recursive MAE (h={horizon}): {mean_absolute_error(true_vals, preds_recursive):.3f}")
`,qe=`import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error

# Direct (MIMO) strategy: one model per horizon step h
# Each model is trained to predict y_{t+h} directly from features at time t.

def make_direct_features(series, lags, horizon):
    """Create features and h-step-ahead targets."""
    datasets = {}
    df = pd.DataFrame({'y': series})
    for l in lags:
        df[f'lag_{l}'] = df['y'].shift(l)
    df = df.dropna()
    feat_cols = sorted([c for c in df.columns if c != 'y'])
    X_base = df[feat_cols].values
    for h in range(1, horizon + 1):
        # target at step h (shift back by h from feature row)
        y_h = df['y'].shift(-h).dropna().values
        n   = min(len(X_base), len(y_h))
        datasets[h] = (X_base[:n], y_h[:n])
    return datasets

np.random.seed(0)
n = 600
y = np.sin(np.arange(n) * 2 * np.pi / 52) * 10 + np.random.randn(n) * 2 + 50
lags = [1, 2, 3, 7, 14]
horizon = 14
split_frac = 0.8

datasets = make_direct_features(y, lags, horizon)
direct_models = {}
direct_preds  = {}

for h in range(1, horizon + 1):
    X_h, y_h = datasets[h]
    split = int(len(X_h) * split_frac)
    m = GradientBoostingRegressor(n_estimators=200, learning_rate=0.05, random_state=42)
    m.fit(X_h[:split], y_h[:split])
    direct_models[h] = m
    direct_preds[h]  = m.predict(X_h[split:split+1])[0]  # predict next step

# Evaluate
# For simplicity, evaluate at a single point
print("Direct predictions for each horizon step:")
for h, p in direct_preds.items():
    print(f"  h={h:2d}: pred={p:.2f}")
`,Ie=`import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor

# DirRec: hybrid of Direct and Recursive
# - Separate model per horizon step (like Direct)
# - Each model uses predictions from earlier steps as features (like Recursive)
# - This captures inter-horizon dependencies while avoiding error accumulation bias

class DirRecForecaster:
    def __init__(self, base_model, lags, horizon):
        self.base_model  = base_model
        self.lags        = lags
        self.horizon     = horizon
        self.models      = {}

    def _make_features_h(self, series, h, prev_preds=None):
        """Build features for step h, optionally including previous predictions."""
        lag_feats = [series[-l] for l in self.lags if l <= len(series)]
        if prev_preds:
            lag_feats += list(prev_preds)  # add earlier-step predictions
        return np.array(lag_feats).reshape(1, -1)

    def fit(self, series, split):
        """Train one model per horizon step."""
        for h in range(1, self.horizon + 1):
            X, y_list = [], []
            for t in range(max(self.lags), split - h):
                feat = [series[t - l] for l in self.lags]
                # For DirRec, we'd also include model predictions for h-1, h-2 ...
                # simplified here to show the concept
                X.append(feat)
                y_list.append(series[t + h])
            import copy
            m = copy.deepcopy(self.base_model)
            m.fit(np.array(X), np.array(y_list))
            self.models[h] = m

    def predict(self, history):
        preds = []
        for h in range(1, self.horizon + 1):
            feat = np.array([history[-l] for l in self.lags]).reshape(1, -1)
            p    = self.models[h].predict(feat)[0]
            preds.append(p)
        return np.array(preds)

forecaster = DirRecForecaster(
    GradientBoostingRegressor(n_estimators=100, random_state=42),
    lags=[1, 2, 3, 7],
    horizon=14,
)
print("DirRec forecaster class defined.")
`,Oe=`# pip install skforecast
from skforecast.ForecasterAutoreg import ForecasterAutoreg
from skforecast.ForecasterAutoregDirect import ForecasterAutoregDirect
import lightgbm as lgb
import pandas as pd
import numpy as np

np.random.seed(0)
n = 500
dates = pd.date_range('2022-01-01', periods=n, freq='D')
y = pd.Series(
    50 + np.linspace(0, 20, n) + 8 * np.sin(2 * np.pi * np.arange(n) / 365),
    index=dates,
    name='y'
)
train = y[:'2023-06-30']
test  = y['2023-07-01':]

# ── Recursive strategy ────────────────────────────────────────────────────────
forecaster_recursive = ForecasterAutoreg(
    regressor=lgb.LGBMRegressor(n_estimators=200, learning_rate=0.05, verbose=-1),
    lags=[1, 2, 3, 7, 14, 28],
)
forecaster_recursive.fit(y=train)
preds_recursive = forecaster_recursive.predict(steps=len(test))

# ── Direct strategy ───────────────────────────────────────────────────────────
forecaster_direct = ForecasterAutoregDirect(
    regressor=lgb.LGBMRegressor(n_estimators=200, learning_rate=0.05, verbose=-1),
    lags=[1, 2, 3, 7, 14, 28],
    steps=len(test),
)
forecaster_direct.fit(y=train)
preds_direct = forecaster_direct.predict(steps=len(test))

from sklearn.metrics import mean_absolute_error
print(f"Recursive MAE: {mean_absolute_error(test, preds_recursive):.3f}")
print(f"Direct MAE:    {mean_absolute_error(test, preds_direct):.3f}")
`,Ve=[{title:"Multi-step time series forecasting: a survey",author:"Taieb, S.B. et al.",year:2012,url:"https://doi.org/10.1016/j.neunet.2012.02.011"},{title:"skforecast: Time series forecasting with scikit-learn regressors",author:"Escobar, J.",year:2022,url:"https://skforecast.org/"},{title:"The DirRec Strategy for Multi-step Forecasting",author:"Sorjamaa, A. & Lendasse, A.",year:2006,url:"https://doi.org/10.1007/11550907_59"},{title:"mlforecast: scalable machine learning for time series",author:"Nixtla",year:2023,url:"https://nixtlaverse.nixtla.io/mlforecast/"}];function We(){return e.jsxs(u,{title:"Multi-Step Forecast Strategies",difficulty:"intermediate",readingTime:11,children:[e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["When forecasting beyond one step ahead, ML models face a fundamental choice: how should the model bridge from training (predicting one step) to inference (predicting many steps)? The answer defines the ",e.jsx("em",{children:"forecast strategy"}),". Each strategy makes different trade-offs between model complexity, error accumulation, and computational cost."]}),e.jsx(Ee,{}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Recursive Strategy"}),e.jsxs(h,{term:"Recursive (NARX) Strategy",children:["Train a single one-step-ahead model ",e.jsx(a.InlineMath,{math:"f"}),", then apply it iteratively: the prediction at step ",e.jsx(a.InlineMath,{math:"h"})," becomes an input feature for step ",e.jsx(a.InlineMath,{math:"h+1"}),":",e.jsx(a.BlockMath,{math:String.raw`\hat{y}_{t+h} = f(\hat{y}_{t+h-1}, \hat{y}_{t+h-2}, \ldots, y_t, y_{t-1}, \ldots)`}),"One model, but errors compound: each prediction error propagates into future feature values."]}),e.jsx(s,{code:Xe,title:"Recursive Multi-Step Forecasting"}),e.jsx(De,{}),e.jsx(f,{title:"Error Accumulation in Recursive Forecasting",children:"For horizons beyond 7–14 steps, recursive strategy can degrade significantly because prediction errors in early steps corrupt the lag features used by later steps. Monitor MAE across horizons (horizon-1, 2, ..., H) to detect this degradation."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Direct (MIMO) Strategy"}),e.jsxs(h,{term:"Direct (Multiple Input Multiple Output) Strategy",children:["Train a separate model ",e.jsx(a.InlineMath,{math:"f_h"})," for each horizon"," ",e.jsx(a.InlineMath,{math:"h = 1, \\ldots, H"}),", each using only known history:",e.jsx(a.BlockMath,{math:String.raw`\hat{y}_{t+h} = f_h(y_t, y_{t-1}, \ldots, y_{t-p})`}),e.jsx(a.InlineMath,{math:"H"})," models, no error propagation, but models are independent and do not share information across horizons."]}),e.jsx(s,{code:qe,title:"Direct (MIMO) Multi-Step Forecasting"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"DirRec Strategy"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"DirRec combines the best of both worlds: separate models per horizon (like Direct) where each model uses predictions from earlier steps as additional features (like Recursive). This captures inter-horizon dependencies while limiting error propagation to adjacent steps."}),e.jsx(s,{code:Ie,title:"DirRec Strategy Implementation"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Multi-Output Strategy"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["A single model outputs all horizon predictions simultaneously using",e.jsx("code",{children:"MultiOutputRegressor"})," from sklearn or native multi-output models. This is equivalent to Direct but with shared training infrastructure — the underlying estimator is cloned for each horizon step internally."]}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"text-sm text-zinc-300 border-collapse w-full",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-zinc-800",children:["Strategy","Models","Error Propagation","Best For"].map(t=>e.jsx("th",{className:"border border-zinc-700 px-3 py-2 text-left text-xs",children:t},t))})}),e.jsx("tbody",{children:[["Recursive","1","Yes — compounds over h","Short horizons (h ≤ 7), simple series"],["Direct (MIMO)","H","No","Long horizons, when h-specific patterns matter"],["DirRec","H","Partial (adjacent steps only)","Best accuracy, highest cost"],["Multi-output","1 (H heads)","No","When training budget is limited"]].map(t=>e.jsx("tr",{className:"hover:bg-zinc-800",children:t.map((o,i)=>e.jsx("td",{className:"border border-zinc-700 px-3 py-1 text-xs",children:o},i))},t[0]))})]})}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"skforecast Implementation"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["The ",e.jsx("code",{children:"skforecast"})," library provides sklearn-compatible classes for recursive and direct strategies, wrapping any sklearn regressor."]}),e.jsx(s,{code:Oe,title:"skforecast: Recursive vs. Direct Strategy with LightGBM"}),e.jsx(_,{title:"Empirical Strategy Comparison",children:"Across diverse benchmark datasets, DirRec consistently achieves the lowest error but at the cost of H independent model training runs. For short horizons (h ≤ 7), recursive strategy is competitive and much simpler. For long horizons (h > 14), direct or DirRec strategies are consistently preferable. When using gradient boosting, the direct strategy often matches DirRec accuracy at lower computational cost."}),e.jsxs(b,{title:"Weekly Retail Demand — Strategy Selection",children:[e.jsx("p",{className:"text-zinc-300 text-sm",children:"For a retailer forecasting weekly demand 8 weeks ahead:"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2",children:[e.jsx("li",{children:"Recursive: simple, 1 model — but week 8 MAE is 40% higher than week 1"}),e.jsx("li",{children:"Direct: 8 separate models — each tuned to its specific horizon, uniform error"}),e.jsx("li",{children:"Chosen: Direct strategy with LightGBM, horizon-specific feature lag selection"}),e.jsx("li",{children:"Horizon 1: lags [1,2,3,7], Horizon 8: lags [7,8,14,28] (longer-range features)"})]})]}),e.jsxs(g,{title:"Horizon-Specific Feature Engineering",children:["For the Direct strategy, consider using different lag sets for each horizon. The most relevant features for ",e.jsx(a.InlineMath,{math:"h=1"})," (last week's values) differ from those for ",e.jsx(a.InlineMath,{math:"h=28"})," (seasonal patterns from a month ago). ",e.jsx("code",{children:"skforecast"})," and ",e.jsx("code",{children:"mlforecast"})," support horizon-specific lag configurations."]}),e.jsx(x,{references:Ve})]})}const Pt=Object.freeze(Object.defineProperty({__proto__:null,default:We},Symbol.toStringTag,{value:"Module"}));function He(){const[t,o]=S.useState("expanding"),i=20,d=4,r=3,l={expanding:Array.from({length:d},(p,c)=>({train:[0,(c+1)*3+2],test:[(c+1)*3+2,(c+1)*3+2+r]})),sliding:Array.from({length:d},(p,c)=>({train:[c*2,c*2+8],test:[c*2+8,c*2+8+r]})),blocked:Array.from({length:d},(p,c)=>{const w=Math.floor(i/d),y=c*w,j=y+Math.floor(w*.7);return{train:[y,j],test:[j,y+w]}})}[t],m={train:"#1e40af",test:"#b91c1c",gap:"#3f3f46"};return e.jsxs("div",{className:"my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900",children:[e.jsx("h3",{className:"text-sm font-semibold text-zinc-300 mb-3",children:"Cross-Validation Scheme Visualiser"}),e.jsx("div",{className:"flex gap-2 mb-4 flex-wrap",children:["expanding","sliding","blocked"].map(p=>e.jsx("button",{onClick:()=>o(p),className:`px-3 py-1 rounded text-xs font-semibold ${t===p?"bg-sky-700 text-white":"bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`,children:p},p))}),e.jsx("div",{className:"space-y-2",children:l.map((p,c)=>e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsxs("span",{className:"text-xs text-zinc-500 w-12",children:["Fold ",c+1]}),e.jsx("div",{className:"flex gap-0.5",children:Array.from({length:i},(w,y)=>{const j=y>=p.train[0]&&y<p.train[1],F=y>=p.test[0]&&y<p.test[1];return e.jsx("div",{className:"w-3 h-5 rounded-sm",style:{backgroundColor:j?m.train:F?m.test:m.gap}},y)})})]},c))}),e.jsxs("div",{className:"flex gap-4 mt-3",children:[e.jsxs("span",{className:"flex items-center gap-1 text-xs text-zinc-400",children:[e.jsx("div",{className:"w-3 h-3 rounded-sm",style:{backgroundColor:m.train}})," Train"]}),e.jsxs("span",{className:"flex items-center gap-1 text-xs text-zinc-400",children:[e.jsx("div",{className:"w-3 h-3 rounded-sm",style:{backgroundColor:m.test}})," Test"]}),e.jsxs("span",{className:"flex items-center gap-1 text-xs text-zinc-400",children:[e.jsx("div",{className:"w-3 h-3 rounded-sm",style:{backgroundColor:m.gap}})," Unused"]})]})]})}const Ue=`from sklearn.model_selection import TimeSeriesSplit
import numpy as np
import pandas as pd
import lightgbm as lgb
from sklearn.metrics import mean_absolute_error

# ── Expanding window CV ───────────────────────────────────────────────────────
n = 500
np.random.seed(0)
X = np.random.randn(n, 10)
y = X[:, 0] * 3 + np.sin(np.arange(n) * 2 * np.pi / 52) + np.random.randn(n)

# TimeSeriesSplit: expanding train, fixed test size
tscv_expanding = TimeSeriesSplit(
    n_splits=5,
    test_size=28,     # fixed test size per fold
    gap=0,            # gap between train and test (use > 0 to avoid leakage)
)
print("Expanding window splits:")
for i, (tr, va) in enumerate(tscv_expanding.split(X)):
    print(f"  Fold {i+1}: train={tr[0]}:{tr[-1]+1}, val={va[0]}:{va[-1]+1} ({len(tr)} / {len(va)} samples)")

# ── Sliding window CV ─────────────────────────────────────────────────────────
# sklearn doesn't natively support fixed-window sliding CV, but we can implement it:
def sliding_window_cv(n_samples, train_size, test_size, step=1):
    """Generate (train, test) index pairs for sliding window CV."""
    splits = []
    start = 0
    while start + train_size + test_size <= n_samples:
        train_idx = np.arange(start, start + train_size)
        test_idx  = np.arange(start + train_size, start + train_size + test_size)
        splits.append((train_idx, test_idx))
        start += step
    return splits

splits = sliding_window_cv(n, train_size=200, test_size=28, step=28)
print(f"\\nSliding window splits: {len(splits)} folds")
for i, (tr, va) in enumerate(splits[:3]):
    print(f"  Fold {i+1}: train={tr[0]}:{tr[-1]+1}, val={va[0]}:{va[-1]+1}")
`,Ke=`from skforecast.model_selection import backtesting_forecaster
from skforecast.ForecasterAutoreg import ForecasterAutoreg
import lightgbm as lgb
import pandas as pd
import numpy as np

np.random.seed(0)
n = 600
dates = pd.date_range('2021-06-01', periods=n, freq='D')
y = pd.Series(
    100 + np.linspace(0, 30, n)
        + 15 * np.sin(2 * np.pi * np.arange(n) / 365.25)
        + np.random.randn(n) * 4,
    index=dates, name='demand',
)

forecaster = ForecasterAutoreg(
    regressor=lgb.LGBMRegressor(n_estimators=200, learning_rate=0.05, verbose=-1),
    lags=[1, 2, 3, 7, 14, 28],
)

# skforecast v0.9+: pass cv object
from skforecast.model_selection import TimeSeriesFold
cv = TimeSeriesFold(
    initial_train_size=int(n * 0.6),
    steps=14,
    refit=True,
    fixed_train_size=False,   # expanding window
)
metric, preds = backtesting_forecaster(
    forecaster=forecaster, y=y, cv=cv,
    metric='mean_absolute_error', verbose=False,
)
print(f"Expanding-window backtest MAE: {metric:.3f}")
`,$e=`import numpy as np
from sklearn.base import BaseEstimator

# Purged Cross-Validation: used in financial time series
# Removes observations from training that are "close in time" to the test set
# to prevent information leakage through auto-correlated features.

class PurgedTimeSeriesSplit:
    """
    Expanding-window CV with a purge gap between train and test.
    gap = number of rows to remove from end of train set.
    """
    def __init__(self, n_splits=5, test_size=50, gap=10):
        self.n_splits  = n_splits
        self.test_size = test_size
        self.gap       = gap

    def split(self, X, y=None, groups=None):
        n = len(X)
        total = self.test_size * self.n_splits
        for k in range(self.n_splits):
            val_end   = n - self.test_size * (self.n_splits - k - 1)
            val_start = val_end - self.test_size
            train_end = val_start - self.gap       # purge gap!
            if train_end <= 0:
                continue
            train_idx = np.arange(0, train_end)
            val_idx   = np.arange(val_start, val_end)
            yield train_idx, val_idx

# Example
np.random.seed(0)
X = np.random.randn(500, 10)
pcv = PurgedTimeSeriesSplit(n_splits=5, test_size=40, gap=10)
for i, (tr, va) in enumerate(pcv.split(X)):
    print(f"Fold {i+1}: train=[0:{tr[-1]+1}], gap=[{tr[-1]+1}:{va[0]}], val=[{va[0]}:{va[-1]+1}]")
`,Ye=[{title:"Time Series Cross-Validation in scikit-learn",author:"Pedregosa et al.",year:2011,url:"https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split"},{title:"skforecast: Backtesting documentation",author:"Escobar, J.",year:2023,url:"https://skforecast.org/latest/user_guides/backtesting.html"},{title:"Advances in Financial Machine Learning (Purged CV)",author:"de Prado, M.L.",year:2018,url:"https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086"},{title:"Evaluating Time Series Forecasting Models",author:"Cerqueira, V. et al.",year:2020,url:"https://arxiv.org/abs/1904.00522"}];function Ze(){return e.jsxs(u,{title:"Time Series Cross-Validation",difficulty:"intermediate",readingTime:10,children:[e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Standard k-fold cross-validation randomly shuffles rows, creating future-to-past leakage in time series models. Proper time series CV respects temporal ordering: training always uses only data available before the validation period. This section covers the main CV schemes and their implementation."}),e.jsx(f,{title:"Never Use Random K-Fold on Time Series",children:"Random k-fold allows validation rows from the past to test on training rows from the future. This inflates the estimated performance — the model appears better than it actually is when deployed on new, unseen future data. Always use time-respecting CV schemes."}),e.jsx(He,{}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Expanding Window CV"}),e.jsxs(h,{term:"Expanding Window Cross-Validation",children:["At each fold ",e.jsx(a.InlineMath,{math:"k"}),", the training set grows to include all data up to the start of the validation period:",e.jsx(a.BlockMath,{math:String.raw`\text{Train}_k = [1, \ldots, t_k], \quad \text{Val}_k = [t_k + 1, \ldots, t_k + h]`}),"where ",e.jsx(a.InlineMath,{math:"t_k"})," increases with each fold. This mimics real deployment: the model has access to all historical data at each forecast origin."]}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Expanding window is the most common choice for forecasting. It simulates how a production model is retrained as more data arrives over time."}),e.jsx(s,{code:Ue,title:"Expanding and Sliding Window CV (sklearn)"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Sliding Window CV"}),e.jsxs(h,{term:"Sliding Window Cross-Validation",children:["The training window has a fixed size ",e.jsx(a.InlineMath,{math:"W"}),", sliding forward at each fold:",e.jsx(a.BlockMath,{math:String.raw`\text{Train}_k = [t_k - W + 1, \ldots, t_k], \quad \text{Val}_k = [t_k + 1, \ldots, t_k + h]`}),"This is preferred when older data is irrelevant (structural breaks, regime changes) or when memory constraints limit training set size."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Blocked CV"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Blocked CV divides the series into non-overlapping blocks, using portions of each block for training and the remainder for validation. Unlike expanding or sliding CV, it distributes test periods throughout the series — useful for detecting model degradation over different time periods."}),e.jsxs(g,{title:"Gap Between Train and Test",children:["For datasets with autocorrelated features (e.g., rolling windows computed from recent data), add a ",e.jsx("em",{children:"gap"})," between the last training row and the first validation row. The gap size should match the forecast horizon. This prevents the validation target from influencing features in the last training rows."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Backtesting with skforecast"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:[e.jsx("code",{children:"skforecast"}),"'s ",e.jsx("code",{children:"backtesting_forecaster"})," function implements expanding or sliding-window backtesting, including optional model refitting at each step."]}),e.jsx(s,{code:Ke,title:"skforecast Expanding-Window Backtest"}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"text-sm text-zinc-300 border-collapse w-full",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-zinc-800",children:["Scheme","Train size","Best for","Pitfall"].map(t=>e.jsx("th",{className:"border border-zinc-700 px-3 py-2 text-left text-xs",children:t},t))})}),e.jsx("tbody",{children:[["Expanding","Grows","Stationary series with long history","Early folds have little data"],["Sliding","Fixed W","Non-stationary, regime changes","Discards useful old data"],["Blocked","Variable","Testing across full time range","Can use future data in block"],["Purged","Grows","Financial / highly autocorrelated","Reduces training size"]].map(t=>e.jsx("tr",{className:"hover:bg-zinc-800",children:t.map((o,i)=>e.jsx("td",{className:"border border-zinc-700 px-3 py-1 text-xs",children:o},i))},t[0]))})]})}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Purged CV for Financial Data"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["Financial time series often use rolling features with large windows. A validation row at time ",e.jsx(a.InlineMath,{math:"t"})," may have rolling features that include training rows at time ",e.jsx(a.InlineMath,{math:"t - 1, t - 2, \\ldots"})," — creating a subtle information leak. Purged CV removes a buffer zone of rows between train and validation sets."]}),e.jsx(s,{code:$e,title:"Purged Cross-Validation"}),e.jsx(_,{title:"Choosing the Right CV Scheme",children:"For most forecasting applications: use expanding window with a gap equal to the forecast horizon, and test_size equal to the deployment horizon. Use 5 folds minimum — fewer folds give high-variance estimates. Avoid having folds where the training set is smaller than the full seasonal cycle (e.g., <365 rows for annual seasonality)."}),e.jsxs(b,{title:"Hyperparameter Tuning with TimeSeriesSplit",children:[e.jsx("p",{className:"text-zinc-300 text-sm",children:"Correct setup for LightGBM hyperparameter search on a daily series:"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2",children:[e.jsx("li",{children:"n_splits=5, test_size=28 (matches 4-week deployment horizon)"}),e.jsx("li",{children:"gap=7 (prevents leakage from 7-day lag features)"}),e.jsx("li",{children:"Initial train size: at least 2 full annual cycles (730 days)"}),e.jsx("li",{children:"RandomizedSearchCV with 30 trials, TimeSeriesSplit as cv"}),e.jsx("li",{children:"Score each trial by mean MAE across all 5 folds"})]})]}),e.jsx(x,{references:Ye})]})}const Gt=Object.freeze(Object.defineProperty({__proto__:null,default:Ze},Symbol.toStringTag,{value:"Module"})),Je=[{fold:"Fold 1",lgb:4.1,rf:5.3,ridge:7.2},{fold:"Fold 2",lgb:3.8,rf:5,ridge:6.9},{fold:"Fold 3",lgb:4.4,rf:5.5,ridge:7.4},{fold:"Fold 4",lgb:4,rf:4.9,ridge:7},{fold:"Fold 5",lgb:3.7,rf:4.7,ridge:6.7}],Qe=Array.from({length:14},(t,o)=>({h:o+1,lgb:parseFloat((3.5+o*.12).toFixed(2)),ridge:parseFloat((5.8+o*.22).toFixed(2))})),et=`# pip install mlforecast lightgbm
# mlforecast requires data in "long format":
#   unique_id | ds | y  (and optionally exogenous columns)
#
# The library handles:
#   - Feature engineering (lags, lag transforms, date features)
#   - Multi-series management (correct group-wise shifting)
#   - Training a single global model on all series
#   - Recursive and direct prediction
#   - Prediction with future exogenous variables

import pandas as pd
import numpy as np
from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
import lightgbm as lgb

# ── Generate synthetic multi-series data ─────────────────────────────────────
np.random.seed(42)
series_data = []
for uid in ['store_A', 'store_B', 'store_C']:
    n   = 500
    base = {'store_A': 100, 'store_B': 150, 'store_C': 80}[uid]
    y   = (base
           + np.linspace(0, 20, n)
           + 10 * np.sin(2 * np.pi * np.arange(n) / 365.25)
           + np.random.randn(n) * 5)
    series_data.append(pd.DataFrame({
        'unique_id': uid,
        'ds':        pd.date_range('2022-01-01', periods=n, freq='D'),
        'y':         y,
    }))

df = pd.concat(series_data, ignore_index=True)
print(df.head())
print(f"Shape: {df.shape}, series: {df['unique_id'].nunique()}")
`,tt=`from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
import lightgbm as lgb
import numpy as np

# ── Define the MLForecast pipeline ───────────────────────────────────────────
fcst = MLForecast(
    models={
        'lgb': lgb.LGBMRegressor(
            n_estimators=300,
            learning_rate=0.05,
            num_leaves=63,
            min_child_samples=20,
            subsample=0.8,
            colsample_bytree=0.8,
            verbose=-1,
        )
    },
    freq='D',                          # pandas frequency string

    # Lag features — applied per series (no cross-series leakage)
    lags=[1, 2, 3, 7, 14, 28],

    # Rolling/expanding transforms on lagged values
    lag_transforms={
        1: [                           # transforms applied to lag-1 values
            ('rolling_mean', 7),       # rolling mean of last 7 lag-1 values
            ('rolling_mean', 28),
            ('rolling_std',  7),
            ('rolling_min',  7),
            ('rolling_max',  7),
        ],
        7: [('rolling_mean', 4)],      # 4-week rolling mean at lag 7
    },

    # Automatic date features (extracted from ds column)
    date_features=['dayofweek', 'month', 'quarter', 'year'],

    # Optional: first-difference the target before training
    target_transforms=[Differences([1])],
)

fcst.fit(df)
print("Model trained on", df['unique_id'].nunique(), "series")
print("Feature names:", fcst.ts.features_order_)
`,at=`from mlforecast import MLForecast
import pandas as pd
import numpy as np

# ── Predict h steps ahead ──────────────────────────────────────────────────
horizon = 14
preds = fcst.predict(h=horizon)
print(preds.head(10))
# Output columns: unique_id | ds | lgb

# ── Predict with future exogenous variables ───────────────────────────────
# If the model was trained with exogenous features (e.g., temperature, price),
# you must provide future values for all exogenous cols.

# Example: adding an exogenous variable during training
df_exog = df.copy()
df_exog['temperature'] = (20
    + 10 * np.sin(2 * np.pi * np.arange(len(df_exog)) / 365.25)
    + np.random.randn(len(df_exog)) * 2)

fcst_exog = MLForecast(
    models={'lgb': lgb.LGBMRegressor(n_estimators=200, verbose=-1)},
    freq='D',
    lags=[1, 7, 14],
    date_features=['dayofweek', 'month'],
)
fcst_exog.fit(df_exog)  # temperature is automatically included as a feature

# For prediction, provide future temperature values
future_exog = fcst_exog.make_future_dataframe(h=14)
future_exog['temperature'] = np.random.randn(len(future_exog)) * 2 + 20  # forecast values

preds_exog = fcst_exog.predict(h=14, X_df=future_exog)
print("Predictions with exogenous variables:")
print(preds_exog.head())
`,st=`from mlforecast import MLForecast
from mlforecast.utils import PredictionIntervals
import lightgbm as lgb
import pandas as pd
import numpy as np

# mlforecast cross-validation: expanding or sliding window
horizon = 14

cv_preds = fcst.cross_validation(
    df=df,
    h=horizon,
    n_windows=5,        # number of validation windows
    step_size=28,       # how many steps to advance between windows
    refit=True,         # refit model at each window
)
print("CV predictions shape:", cv_preds.shape)
print(cv_preds.head())

# Compute metrics per fold
from sklearn.metrics import mean_absolute_error, mean_absolute_percentage_error

for window in cv_preds['cutoff'].unique():
    fold = cv_preds[cv_preds['cutoff'] == window]
    mae  = mean_absolute_error(fold['y'], fold['lgb'])
    mape = mean_absolute_percentage_error(fold['y'], fold['lgb']) * 100
    print(f"  Cutoff {str(window)[:10]}: MAE={mae:.2f}, MAPE={mape:.1f}%")
`,rt=`from mlforecast import MLForecast
import lightgbm as lgb
import xgboost as xgb
from sklearn.ensemble import RandomForestRegressor
import numpy as np

# Train multiple models simultaneously in one pipeline
fcst_multi = MLForecast(
    models={
        'lgb': lgb.LGBMRegressor(
            n_estimators=300, learning_rate=0.05, num_leaves=63, verbose=-1
        ),
        'xgb': xgb.XGBRegressor(
            n_estimators=300, learning_rate=0.05, max_depth=6,
            tree_method='hist', verbosity=0
        ),
        'rf': RandomForestRegressor(
            n_estimators=200, min_samples_leaf=5, n_jobs=-1, random_state=42
        ),
    },
    freq='D',
    lags=[1, 7, 14, 28],
    lag_transforms={1: [('rolling_mean', 7), ('rolling_std', 7)]},
    date_features=['dayofweek', 'month'],
)
fcst_multi.fit(df)
preds_multi = fcst_multi.predict(h=14)

# Simple ensemble: average the models
preds_multi['ensemble'] = preds_multi[['lgb', 'xgb', 'rf']].mean(axis=1)
print(preds_multi.head(10))
`,it=`from mlforecast import MLForecast
from mlforecast.utils import PredictionIntervals
import lightgbm as lgb
import numpy as np

# Conformal prediction intervals via mlforecast
# Uses held-out residuals from cross-validation to construct intervals

fcst_pi = MLForecast(
    models={'lgb': lgb.LGBMRegressor(n_estimators=200, verbose=-1)},
    freq='D',
    lags=[1, 7, 14],
    date_features=['dayofweek', 'month'],
)
fcst_pi.fit(df, prediction_intervals=PredictionIntervals(n_windows=3, h=14))

# Predict with 90% conformal prediction interval
preds_pi = fcst_pi.predict(h=14, level=[80, 90, 95])
print("Prediction interval columns:", [c for c in preds_pi.columns if 'lo' in c or 'hi' in c])
print(preds_pi.head())
# Output: unique_id | ds | lgb | lgb-lo-90 | lgb-hi-90 | lgb-lo-95 | lgb-hi-95 ...
`,nt=[{title:"mlforecast: scalable machine learning for time series forecasting",author:"Nixtla",year:2023,url:"https://nixtlaverse.nixtla.io/mlforecast/"},{title:"mlforecast GitHub",author:"Nixtla",year:2024,url:"https://github.com/Nixtla/mlforecast"},{title:"statsforecast: statistical models at scale",author:"Nixtla",year:2023,url:"https://nixtlaverse.nixtla.io/statsforecast/"},{title:"Conformal Prediction for Time Series",author:"Stankeviciute, K. et al.",year:2021,url:"https://arxiv.org/abs/2107.07511"}];function ot(){return e.jsxs(u,{title:"mlforecast Pipeline",difficulty:"intermediate",readingTime:13,children:[e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:[e.jsx("code",{children:"mlforecast"})," (by Nixtla) provides a complete ML forecasting pipeline designed for scalability across thousands of series. It handles feature engineering, multi-series management, training, prediction, and cross-validation in a clean API — eliminating the boilerplate of manual lag construction and series-level group handling."]}),e.jsx(h,{term:"MLForecast",children:"A Python library that wraps any sklearn-compatible regressor into a complete multi-step, multi-series forecasting pipeline. It automatically engineers lag features, rolling statistics, and date features per series, trains a global model on all series simultaneously, and provides cross-validation and prediction interval utilities."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Data Format"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["mlforecast requires data in ",e.jsx("strong",{children:"long format"}),": one row per (series, timestamp). The required columns are:"]}),e.jsx("div",{className:"grid grid-cols-3 gap-3 my-4",children:[{col:"unique_id",desc:"Series identifier (string or int)"},{col:"ds",desc:"Timestamp (datetime or string)"},{col:"y",desc:"Target variable (float)"}].map(t=>e.jsxs("div",{className:"p-3 rounded-lg bg-zinc-800 border border-zinc-700",children:[e.jsx("p",{className:"font-mono text-sky-400 text-sm",children:t.col}),e.jsx("p",{className:"text-zinc-400 text-xs mt-1",children:t.desc})]},t.col))}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Additional columns are treated as exogenous variables and included as features."}),e.jsx(s,{code:et,title:"Data Preparation for mlforecast"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Building the Pipeline"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["The ",e.jsx("code",{children:"MLForecast"})," constructor accepts the model(s), frequency, lag specification, and optional transforms. The ",e.jsx("code",{children:"lag_transforms"}),"parameter defines rolling/expanding statistics computed on lagged values — per series, correctly avoiding cross-series leakage."]}),e.jsx(s,{code:tt,title:"MLForecast Pipeline with LightGBM"}),e.jsxs(g,{title:"target_transforms",children:[e.jsx("code",{children:"Differences([1])"})," applies first differencing to remove trend before training and automatically inverts the transform at prediction time. This is equivalent to training on ",e.jsx(a.InlineMath,{math:"\\Delta y_t = y_t - y_{t-1}"})," and reconstructing absolute values from cumulative sum. Use for non-stationary series."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Prediction and Exogenous Variables"}),e.jsx(s,{code:at,title:"Predict and Predict with Exogenous Variables"}),e.jsx(f,{title:"Exogenous Variables at Prediction Time",children:"If you train with exogenous features (e.g., temperature, promotions), you must provide forecasts of these variables for the future horizon at prediction time. mlforecast does not forecast exogenous variables automatically — these must come from separate models or external data sources."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Cross-Validation"}),e.jsx(s,{code:st,title:"mlforecast Cross-Validation"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",margin:"1rem 0"},children:[e.jsxs("div",{style:{padding:"0.75rem",background:"#0f172a",borderRadius:"8px",border:"1px solid #334155"},children:[e.jsx("p",{style:{color:"#94a3b8",fontWeight:600,fontSize:"0.85rem",marginBottom:"0.5rem"},children:"MAE per CV Fold"}),e.jsx(M,{width:"100%",height:180,children:e.jsxs(A,{data:Je,margin:{top:5,right:10,left:0,bottom:5},children:[e.jsx(N,{strokeDasharray:"3 3",stroke:"#1e3a5f"}),e.jsx(z,{dataKey:"fold",stroke:"#64748b",tick:{fontSize:10}}),e.jsx(T,{stroke:"#64748b",tick:{fontSize:10}}),e.jsx(B,{contentStyle:{background:"#1e293b",border:"1px solid #334155",color:"#e2e8f0",fontSize:11}}),e.jsx(C,{wrapperStyle:{color:"#94a3b8",fontSize:11}}),e.jsx(R,{dataKey:"lgb",fill:"#34d399",name:"LightGBM"}),e.jsx(R,{dataKey:"rf",fill:"#60a5fa",name:"Random Forest"}),e.jsx(R,{dataKey:"ridge",fill:"#f87171",name:"Ridge"})]})})]}),e.jsxs("div",{style:{padding:"0.75rem",background:"#0f172a",borderRadius:"8px",border:"1px solid #334155"},children:[e.jsx("p",{style:{color:"#94a3b8",fontWeight:600,fontSize:"0.85rem",marginBottom:"0.5rem"},children:"MAE vs Horizon"}),e.jsx(M,{width:"100%",height:180,children:e.jsxs(L,{data:Qe,margin:{top:5,right:10,left:0,bottom:5},children:[e.jsx(N,{strokeDasharray:"3 3",stroke:"#1e3a5f"}),e.jsx(z,{dataKey:"h",stroke:"#64748b",tick:{fontSize:10}}),e.jsx(T,{stroke:"#64748b",tick:{fontSize:10}}),e.jsx(B,{contentStyle:{background:"#1e293b",border:"1px solid #334155",color:"#e2e8f0",fontSize:11}}),e.jsx(C,{wrapperStyle:{color:"#94a3b8",fontSize:11}}),e.jsx(v,{type:"monotone",dataKey:"lgb",stroke:"#34d399",dot:!1,name:"LightGBM",strokeWidth:2}),e.jsx(v,{type:"monotone",dataKey:"ridge",stroke:"#f87171",dot:!1,name:"Ridge",strokeWidth:2})]})})]})]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Multiple Models and Ensembling"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"mlforecast can train multiple models in parallel using the same feature set, enabling straightforward model comparison and ensembling."}),e.jsx(s,{code:rt,title:"Multiple Models and Simple Ensemble"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Prediction Intervals"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"mlforecast supports conformal prediction intervals via cross-validation residuals. These are distribution-free and valid for any model, providing coverage guarantees without assuming Gaussian errors."}),e.jsx(s,{code:it,title:"Conformal Prediction Intervals"}),e.jsx(_,{title:"mlforecast Architecture Summary",children:e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 text-sm",children:[{k:"Feature engineering",v:"Lags + rolling stats + date features, per-series, no leakage"},{k:"Global model",v:"Single model trained on all series simultaneously"},{k:"Multi-series support",v:"Scales to 10,000+ series with efficient pandas groupby ops"},{k:"Frequency support",v:"D, W, M, H, min, custom — any pandas offset string"},{k:"Prediction strategy",v:"Recursive by default; direct via ForecasterAutoregDirect"},{k:"Prediction intervals",v:"Conformal (distribution-free) via cross-validation residuals"}].map(t=>e.jsxs("div",{className:"p-2 rounded bg-zinc-800 border border-zinc-700",children:[e.jsxs("span",{className:"text-sky-400 font-semibold",children:[t.k,": "]}),e.jsx("span",{className:"text-zinc-300",children:t.v})]},t.k))})}),e.jsxs(b,{title:"Retail Demand Forecasting at Scale",children:[e.jsx("p",{className:"text-zinc-300 text-sm",children:"Using mlforecast to forecast daily demand for 5,000 SKUs across 20 stores (100,000 series):"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2",children:[e.jsx("li",{children:"Data: long format, 100K series × 730 days = 73M rows"}),e.jsx("li",{children:"Lags: [1, 7, 14, 28], rolling [7, 28] — engineered in ~30s via pandas"}),e.jsx("li",{children:"Model: LightGBM global (1 model for all series)"}),e.jsx("li",{children:"Training time: ~3 min on 8-core CPU (vs. weeks for 100K individual models)"}),e.jsx("li",{children:"CV: cross_validation(n_windows=3, h=28) — 3 backtest windows"}),e.jsx("li",{children:"Result: 8% lower WRMSSE vs. per-series exponential smoothing"})]})]}),e.jsx(x,{references:nt})]})}const Dt=Object.freeze(Object.defineProperty({__proto__:null,default:ot},Symbol.toStringTag,{value:"Module"})),lt=[{nSeries:10,global:1.35,local:1.4},{nSeries:50,global:1.15,local:1.4},{nSeries:100,global:1.02,local:1.38},{nSeries:500,global:.88,local:1.37},{nSeries:1e3,global:.8,local:1.36},{nSeries:5e3,global:.74,local:1.35}];function dt(){const[t,o]=S.useState(100),[i,d]=S.useState(50),r=10,n=500,l=t*r,m=n,p=i;return e.jsxs("div",{className:"my-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900",children:[e.jsx("h3",{className:"text-sm font-semibold text-zinc-300 mb-3",children:"Global vs. Local: Parameter and Data Comparison"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3 mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("label",{className:"text-xs text-zinc-400 w-24",children:["Series: ",e.jsx("span",{className:"text-sky-400 font-bold",children:t})]}),e.jsx("input",{type:"range",min:10,max:500,value:t,onChange:c=>o(Number(c.target.value)),className:"w-full accent-sky-500"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("label",{className:"text-xs text-zinc-400 w-28",children:["Obs/series: ",e.jsx("span",{className:"text-sky-400 font-bold",children:i})]}),e.jsx("input",{type:"range",min:20,max:200,value:i,onChange:c=>d(Number(c.target.value)),className:"w-full accent-sky-500"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"p-3 rounded-lg bg-zinc-800 border border-blue-800",children:[e.jsxs("p",{className:"text-blue-400 font-semibold text-sm mb-2",children:["Local Models (",t," models)"]}),e.jsxs("p",{className:"text-xs text-zinc-400",children:["Parameters total: ",e.jsx("span",{className:"text-white font-mono",children:l.toLocaleString()})]}),e.jsxs("p",{className:"text-xs text-zinc-400",children:["Training data per model: ",e.jsx("span",{className:"text-white font-mono",children:p})," rows"]}),e.jsx("p",{className:`text-xs mt-1 ${i<50?"text-red-400":"text-emerald-400"}`,children:i<50?"Warning: very short series":"Sufficient history"})]}),e.jsxs("div",{className:"p-3 rounded-lg bg-zinc-800 border border-emerald-800",children:[e.jsx("p",{className:"text-emerald-400 font-semibold text-sm mb-2",children:"Global Model (1 model)"}),e.jsxs("p",{className:"text-xs text-zinc-400",children:["Parameters: ",e.jsx("span",{className:"text-white font-mono",children:m.toLocaleString()})]}),e.jsxs("p",{className:"text-xs text-zinc-400",children:["Training data: ",e.jsx("span",{className:"text-white font-mono",children:(t*i).toLocaleString()})," rows"]}),e.jsx("p",{className:`text-xs mt-1 ${t*i>1e3?"text-emerald-400":"text-amber-400"}`,children:t*i>1e3?"Enough data for global model":"Small global dataset"})]})]})]})}const ct=`import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error

# Generate multi-series data
np.random.seed(42)
n_series = 10
n = 300
series_list = []
for uid in range(n_series):
    base = 50 + uid * 10
    y = base + np.linspace(0, 10, n) + 5 * np.sin(2 * np.pi * np.arange(n) / 52) + np.random.randn(n) * 3
    series_list.append(pd.DataFrame({'uid': uid, 'y': y, 't': range(n)}))

df = pd.concat(series_list, ignore_index=True)

def make_features(series_y):
    df_s = pd.DataFrame({'y': series_y})
    for lag in [1, 2, 3, 7, 14]:
        df_s[f'lag_{lag}'] = df_s['y'].shift(lag)
    df_s = df_s.dropna()
    return df_s[[c for c in df_s.columns if c != 'y']].values, df_s['y'].values

# ── Local models: one per series ──────────────────────────────────────────────
split = 250
local_maes = []
for uid in range(n_series):
    s = df[df['uid'] == uid]['y'].values
    X, y = make_features(s)
    model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    model.fit(X[:split - 14], y[:split - 14])
    preds = model.predict(X[split - 14:split])
    local_maes.append(mean_absolute_error(y[split - 14:split], preds))

print(f"Local model mean MAE: {np.mean(local_maes):.3f} ± {np.std(local_maes):.3f}")
`,mt=`import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.metrics import mean_absolute_error

# ── Global model: one model trained on ALL series ─────────────────────────────
# Data is already in df from the local model example above

# Feature engineering with group-aware shifts
df_sorted = df.sort_values(['uid', 't']).copy()
for lag in [1, 2, 3, 7, 14]:
    df_sorted[f'lag_{lag}'] = df_sorted.groupby('uid')['y'].shift(lag)

df_sorted['series_id'] = df_sorted['uid'].astype('category')  # global series ID
df_sorted = df_sorted.dropna()

features  = [f'lag_{l}' for l in [1,2,3,7,14]] + ['series_id']
cat_feats = ['series_id']

split_t = 250
train = df_sorted[df_sorted['t'] < split_t]
test  = df_sorted[(df_sorted['t'] >= split_t) & (df_sorted['t'] < split_t + 14)]

dtrain = lgb.Dataset(train[features], label=train['y'], categorical_feature=cat_feats)
dval   = lgb.Dataset(test[features],  label=test['y'],  reference=dtrain, categorical_feature=cat_feats)

params = {
    'objective': 'regression_l1',
    'num_leaves': 63,
    'learning_rate': 0.05,
    'min_data_in_leaf': 20,
    'verbose': -1,
}
model = lgb.train(params, dtrain, num_boost_round=300,
                  valid_sets=[dval],
                  callbacks=[lgb.early_stopping(30, verbose=False)])

preds_global = model.predict(test[features])
global_mae   = mean_absolute_error(test['y'].values, preds_global)
print(f"Global model MAE: {global_mae:.3f}")
`,pt=`# Cross-learning: the global model learns patterns shared across all series.
# For example, if all series have a weekly seasonality, the global model
# learns this once from N*T observations instead of T observations per series.
#
# This is especially powerful when:
# 1. Individual series are short (few observations)
# 2. Series share common patterns (seasonality, trend shape)
# 3. Series differ only in level (global model + series_id feature handles this)
#
# Mathematical intuition:
# Local model for series i: f_i(x) estimated from T_i data points
# Global model: F(x, i) estimated from sum_i T_i data points
#
# When T_i is small, local model has high variance (overfits).
# Global model borrows strength across series, reducing variance.

import pandas as pd
import numpy as np

# Short series scenario: only 30 observations per series
np.random.seed(0)
n_series = 50
short_n = 30

short_df = pd.concat([
    pd.DataFrame({
        'uid': uid,
        'y': (50 + uid * 2
              + 5 * np.sin(2 * np.pi * np.arange(short_n) / 7)
              + np.random.randn(short_n) * 3),
        't': range(short_n)
    }) for uid in range(n_series)
], ignore_index=True)

# Global model has 50 * 30 = 1500 training rows despite each series being short
total_rows = len(short_df)
print(f"Total training rows for global model: {total_rows}")
print(f"Average rows per local model: {short_n}")
print(f"Cross-learning advantage factor: {total_rows / short_n}x")
`,ht=`from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
import lightgbm as lgb
import pandas as pd
import numpy as np

# Generate diverse multi-series dataset
np.random.seed(0)
all_series = []
for uid in range(100):
    n = np.random.randint(100, 400)  # varying series lengths
    base = np.random.uniform(50, 500)
    amp  = np.random.uniform(5, 50)
    y = (base
         + amp * np.sin(2 * np.pi * np.arange(n) / 365)
         + np.random.randn(n) * base * 0.05)
    all_series.append(pd.DataFrame({
        'unique_id': f'series_{uid:03d}',
        'ds': pd.date_range('2020-01-01', periods=n, freq='D'),
        'y': y,
    }))

df_multi = pd.concat(all_series, ignore_index=True)
print(f"Total rows: {len(df_multi):,}, Series: {df_multi['unique_id'].nunique()}")

# Global MLForecast model
fcst = MLForecast(
    models={
        'lgb': lgb.LGBMRegressor(
            n_estimators=500,
            learning_rate=0.05,
            num_leaves=63,
            min_child_samples=20,
            subsample=0.8,
            verbose=-1,
        )
    },
    freq='D',
    lags=[1, 7, 14, 28],
    lag_transforms={
        1: [('rolling_mean', 7), ('rolling_mean', 28), ('rolling_std', 7)],
    },
    date_features=['dayofweek', 'month', 'year'],
)

# Train global model — learns from all 100 series simultaneously
fcst.fit(df_multi)
preds = fcst.predict(h=28)
print(f"Predictions for {preds['unique_id'].nunique()} series, {len(preds)} total rows")
`,ft=[{title:"N-BEATS: Neural basis expansion analysis for interpretable time series forecasting",author:"Oreshkin, B. et al.",year:2020,url:"https://arxiv.org/abs/1905.10437"},{title:"Do We Really Need Deep Learning Models for Time Series Forecasting?",author:"Zeng, A. et al.",year:2023,url:"https://arxiv.org/abs/2205.13504"},{title:"Global vs Local Models for TS Forecasting",author:"Januschowski, T. et al.",year:2020,url:"https://doi.org/10.1016/j.ijforecast.2020.07.002"},{title:"mlforecast: scalable machine learning for time series",author:"Nixtla",year:2023,url:"https://nixtlaverse.nixtla.io/mlforecast/"}];function gt(){return e.jsxs(u,{title:"Global vs Local Models",difficulty:"advanced",readingTime:11,children:[e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"When forecasting multiple related time series, a fundamental architectural decision is whether to train one model per series (local) or a single model on all series (global). This choice profoundly affects generalisation, scalability, and performance on short series — and the answer has shifted decisively toward global models in modern ML forecasting."}),e.jsx(h,{term:"Local Model",children:"A forecasting model trained independently on a single time series. Each model is optimised purely for its own series' patterns. Simple, interpretable, but requires sufficient history per series and does not learn from related series."}),e.jsx(h,{term:"Global Model",children:"A single forecasting model trained on all series simultaneously. It learns patterns shared across series — seasonality, trend shapes, response to promotions — and generalises these across series, including those with limited history. A series identifier feature distinguishes between series."}),e.jsx(dt,{}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Local Models"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Local models are the classical approach: ARIMA, exponential smoothing, and simple regression models are fitted independently per series. They excel when series are unrelated (different domains, different data generating processes) and have abundant history."}),e.jsx(s,{code:ct,title:"Local Models: One per Series"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Global Models"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"A global model treats all series as a single supervised learning problem. The series identity is encoded as a feature (categorical ID or embedding), allowing the model to learn both shared patterns (seasonality, trend) and series-specific deviations (level, volatility)."}),e.jsx(s,{code:mt,title:"Global LightGBM Model on Multiple Series"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Cross-Learning"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["The core benefit of global models is ",e.jsx("em",{children:"cross-learning"}),": the model borrows statistical strength from the full dataset when estimating shared patterns, dramatically improving performance on short series."]}),e.jsx(a.BlockMath,{math:String.raw`\text{Effective sample size} = \sum_{i=1}^{N} T_i \gg T_i \quad \text{for any single series } i`}),e.jsx(s,{code:pt,title:"Cross-Learning Benefit for Short Series"}),e.jsxs("div",{style:{margin:"1rem 0",padding:"0.75rem",background:"#0f172a",borderRadius:"8px",border:"1px solid #334155"},children:[e.jsx("p",{style:{color:"#94a3b8",fontWeight:600,fontSize:"0.85rem",marginBottom:"0.5rem"},children:"Cross-Learning Benefit: MASE vs Number of Series (T=50 each, illustrative)"}),e.jsx(M,{width:"100%",height:210,children:e.jsxs(L,{data:lt,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(N,{strokeDasharray:"3 3",stroke:"#1e3a5f"}),e.jsx(z,{dataKey:"nSeries",stroke:"#94a3b8",tick:{fontSize:10},label:{value:"Number of Series",fill:"#64748b",position:"insideBottom",offset:-2}}),e.jsx(T,{stroke:"#94a3b8",tick:{fontSize:10},domain:[.6,1.5],label:{value:"MASE",angle:-90,fill:"#64748b",position:"insideLeft"}}),e.jsx(B,{contentStyle:{background:"#1e293b",border:"1px solid #334155",color:"#e2e8f0",fontSize:11}}),e.jsx(C,{wrapperStyle:{color:"#94a3b8",fontSize:11}}),e.jsx(v,{type:"monotone",dataKey:"global",stroke:"#34d399",dot:!0,name:"Global (LightGBM)",strokeWidth:2}),e.jsx(v,{type:"monotone",dataKey:"local",stroke:"#94a3b8",dot:!1,name:"Local (per-series)",strokeWidth:2,strokeDasharray:"5 3"})]})}),e.jsx("p",{style:{color:"#64748b",fontSize:"0.78rem",marginTop:"0.4rem"},children:"As the number of series grows, the global model improves dramatically via cross-learning. Local models are unaffected by N since they never see data from other series."})]}),e.jsxs(_,{title:"When Global Models Win",children:["Global models consistently outperform local models when:",e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm mt-2",children:[e.jsx("li",{children:"Individual series have fewer than 100–200 observations"}),e.jsx("li",{children:"Series share common seasonality, trend, or response to external drivers"}),e.jsx("li",{children:"The feature set includes a series identifier (store, product, customer)"}),e.jsx("li",{children:"The total dataset across series is large enough to train a complex model"})]}),"Local models win when series are genuinely independent with long histories and heterogeneous data-generating processes."]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Global Models with mlforecast"}),e.jsx(s,{code:ht,title:"100-Series Global MLForecast Model"}),e.jsxs(g,{title:"Series Identity Feature",children:["The series ID (",e.jsx("code",{children:"unique_id"}),") should be included as a categorical feature. In LightGBM and CatBoost, pass it as a categorical column. This allows the model to learn per-series level and scale differences, essentially blending the global seasonality estimate with a local mean correction."]}),e.jsxs(f,{title:"Data Leakage in Multi-Series Feature Engineering",children:["Always compute lag and rolling features within each series using",e.jsx("code",{children:"groupby('unique_id').shift()"})," and",e.jsx("code",{children:"groupby('unique_id').transform(lambda x: x.shift(1).rolling(7).mean())"}),". Computing rolling features without groupby will bleed observations from one series into another at series boundaries."]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 my-5",children:[e.jsxs("div",{className:"p-4 rounded-lg bg-zinc-800 border border-blue-800",children:[e.jsx("p",{className:"text-blue-400 font-semibold text-sm mb-2",children:"Local Models — Best Practices"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-xs space-y-1",children:[e.jsx("li",{children:"Use classical methods (ETS, ARIMA) for short series"}),e.jsx("li",{children:"Apply per-series hyperparameter optimisation"}),e.jsx("li",{children:"Consider when series are heterogeneous"}),e.jsx("li",{children:"More interpretable per-series diagnostics"})]})]}),e.jsxs("div",{className:"p-4 rounded-lg bg-zinc-800 border border-emerald-800",children:[e.jsx("p",{className:"text-emerald-400 font-semibold text-sm mb-2",children:"Global Models — Best Practices"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-xs space-y-1",children:[e.jsx("li",{children:"Use LightGBM or XGBoost with series_id as categorical"}),e.jsx("li",{children:"Scale/normalise targets if series have different magnitudes"}),e.jsx("li",{children:"Use TimeSeriesSplit that respects series boundaries"}),e.jsx("li",{children:"Evaluate per-series metrics to detect underperforming series"})]})]})]}),e.jsxs(b,{title:"M5 Competition — Global Models Dominate",children:[e.jsx("p",{className:"text-zinc-300 text-sm",children:"The M5 competition (30,490 Walmart series) demonstrated that global ML models dramatically outperform per-series classical models:"}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2",children:[e.jsx("li",{children:"Top solutions: global LightGBM with 30K series as categorical features"}),e.jsx("li",{children:"Baseline (per-series ETS): WRMSSE ≈ 0.75"}),e.jsx("li",{children:"Top global ML solution: WRMSSE ≈ 0.49 (35% improvement)"}),e.jsx("li",{children:"Key: shared weekly seasonality pattern learned from 30K series simultaneously"}),e.jsx("li",{children:"Short series (new products, new stores) especially benefited from cross-learning"})]})]}),e.jsx(x,{references:ft})]})}const Et=Object.freeze(Object.defineProperty({__proto__:null,default:gt},Symbol.toStringTag,{value:"Module"})),ut=[{n:7,zeroShot:2.4,finetune:2.1,featureXfer:2,local:12},{n:14,zeroShot:2.2,finetune:1.9,featureXfer:1.8,local:6.5},{n:30,zeroShot:2.1,finetune:1.7,featureXfer:1.6,local:3.2},{n:60,zeroShot:2.1,finetune:1.5,featureXfer:1.5,local:2.1},{n:120,zeroShot:2,finetune:1.4,featureXfer:1.4,local:1.6},{n:250,zeroShot:2,finetune:1.3,featureXfer:1.3,local:1.3}],xt=`# Transfer learning for time series:
# 1. Pre-train a global model on a large, diverse dataset (source domain)
# 2. Apply that model to new series with limited history (target domain)
#
# For ML (tree) models, "transfer" means:
#   a. Zero-shot: apply the pre-trained model directly to new series
#      (works if features are compatible)
#   b. Fine-tuning: continue training on the new series data
#      (adjust the model to the target distribution)
#   c. Feature transfer: use the pre-trained model's predictions
#      as meta-features for a small local model
#
# Unlike neural networks (where layer weights are transferred),
# tree models transfer learned decision boundaries / feature importance
# by re-weighting or extending the training distribution.

import numpy as np
import pandas as pd
import lightgbm as lgb

print("Transfer learning concepts for tree-based ML forecasting.")
print("Three approaches: zero-shot, fine-tuning, and feature transfer.")
`,_t=`from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
import lightgbm as lgb
import pandas as pd
import numpy as np

# ── Step 1: Pre-train global model on source series (many, long series) ───────
np.random.seed(0)
n_source = 200
source_series = []
for uid in range(n_source):
    n = np.random.randint(200, 500)
    base = np.random.uniform(50, 500)
    amp  = np.random.uniform(5, 60)
    y = (base
         + amp * np.sin(2 * np.pi * np.arange(n) / 365)
         + amp * 0.3 * np.sin(2 * np.pi * np.arange(n) / 7)
         + np.random.randn(n) * base * 0.03)
    source_series.append(pd.DataFrame({
        'unique_id': f'src_{uid:03d}',
        'ds': pd.date_range('2019-01-01', periods=n, freq='D'),
        'y': y,
    }))

source_df = pd.concat(source_series, ignore_index=True)

# Train global model on source domain
fcst = MLForecast(
    models={'lgb': lgb.LGBMRegressor(n_estimators=500, learning_rate=0.05,
                                     num_leaves=63, verbose=-1)},
    freq='D',
    lags=[1, 7, 14, 28],
    lag_transforms={1: [('rolling_mean', 7), ('rolling_mean', 28)]},
    date_features=['dayofweek', 'month'],
)
fcst.fit(source_df)
print("Source model trained on", source_df['unique_id'].nunique(), "series")

# ── Step 2: Zero-shot prediction on new series (no fine-tuning) ────────────────
# New series: only 30 observations
new_series = pd.DataFrame({
    'unique_id': 'new_store',
    'ds': pd.date_range('2024-01-01', periods=30, freq='D'),
    'y': 250 + 20 * np.sin(2 * np.pi * np.arange(30) / 7) + np.random.randn(30) * 5,
})

# The global model was NOT trained on 'new_store', but its learned
# seasonality patterns apply directly to the new series.
# For zero-shot: add new series to the prediction context
preds_zeroshot = fcst.predict(h=14, new_df=new_series)
print(f"Zero-shot predictions for '{new_series['unique_id'].iloc[0]}':")
print(preds_zeroshot)
`,bt=`import lightgbm as lgb
import pandas as pd
import numpy as np
from mlforecast import MLForecast

# Fine-tuning approach for ML models:
# LightGBM supports "continue_training" — start from an existing model
# and run additional boosting rounds on the new series data.

np.random.seed(42)

# ── Generate pre-trained model ────────────────────────────────────────────────
n_source = 100
source_data = []
for uid in range(n_source):
    n = 300
    y = 100 + np.random.randn(n).cumsum() + 10 * np.sin(2 * np.pi * np.arange(n) / 52)
    source_data.append(pd.DataFrame({
        'unique_id': f's{uid}', 'ds': pd.date_range('2020-01-01', periods=n, freq='W'), 'y': y
    }))
source_df = pd.concat(source_data, ignore_index=True)

# Build feature matrix for source
def build_features(df, lags=[1,2,4,8,13,26]):
    df = df.sort_values(['unique_id','ds']).copy()
    for l in lags:
        df[f'lag_{l}'] = df.groupby('unique_id')['y'].shift(l)
    df = df.dropna()
    feats = [f'lag_{l}' for l in lags]
    return df[feats].values, df['y'].values, df

Xs, ys, src_feats = build_features(source_df)
source_model = lgb.LGBMRegressor(n_estimators=300, learning_rate=0.05, verbose=-1)
source_model.fit(Xs, ys)
print("Source model trained:", source_model.n_estimators, "trees")

# ── Fine-tune on a new series (target domain) ─────────────────────────────────
new_y = 350 + np.random.randn(80).cumsum() + 15 * np.sin(2 * np.pi * np.arange(80) / 52)
new_df = pd.DataFrame({
    'unique_id': 'target_series',
    'ds': pd.date_range('2023-01-01', periods=80, freq='W'),
    'y': new_y,
})
Xt, yt, _ = build_features(new_df)

# Fine-tune: init_model from source, run 100 additional trees
fine_tuned = lgb.LGBMRegressor(
    n_estimators=100,
    learning_rate=0.01,      # smaller LR for fine-tuning
    verbose=-1,
)
fine_tuned.fit(
    Xt[:-14], yt[:-14],
    init_model=source_model.booster_,   # start from pre-trained model
)
print(f"Fine-tuned model: {source_model.n_estimators + 100} total trees")

# Compare fine-tuned vs. from-scratch on target series
from sklearn.metrics import mean_absolute_error
scratch = lgb.LGBMRegressor(n_estimators=300, verbose=-1)
scratch.fit(Xt[:-14], yt[:-14])

preds_ft      = fine_tuned.predict(Xt[-14:])
preds_scratch = scratch.predict(Xt[-14:])
print(f"Fine-tuned MAE: {mean_absolute_error(yt[-14:], preds_ft):.3f}")
print(f"From-scratch MAE: {mean_absolute_error(yt[-14:], preds_scratch):.3f}")
`,yt=`import lightgbm as lgb
import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error

# Feature Transfer: use global model's predictions as meta-features
# for a lightweight local model on the target series.
#
# This is a "stacking" approach:
#   Level 1: global model produces predictions
#   Level 2: local model corrects the predictions using target series data

np.random.seed(5)

# Simulate having a pre-trained global model
# (using source_model and Xt/yt from the fine-tuning example)

# Get global model predictions on target series
global_preds = source_model.predict(Xt)   # raw predictions from global model

# Build local correction features:
# [global_prediction, lag_1, lag_2, ...]
correction_X = np.column_stack([global_preds, Xt])   # global pred + original lags
correction_y = yt - global_preds                      # residuals to correct

# Train a simple Ridge regression on the first 60 rows
ridge = Ridge(alpha=1.0)
ridge.fit(correction_X[:-14], correction_y[:-14])

# Final predictions = global prediction + local correction
residuals_pred = ridge.predict(correction_X[-14:])
final_preds    = global_preds[-14:] + residuals_pred

print(f"Global-only MAE:           {mean_absolute_error(yt[-14:], global_preds[-14:]):.3f}")
print(f"Global + local correction: {mean_absolute_error(yt[-14:], final_preds):.3f}")
`,vt=`from mlforecast import MLForecast
import lightgbm as lgb
import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error

# Few-shot forecasting:
# New series with very little history (e.g., 14 days for a daily model)
# Global model provides reasonable baseline from cross-learning

np.random.seed(99)

# Source: 50 series with 2 years of data each
source_series = pd.concat([
    pd.DataFrame({
        'unique_id': f'src_{i}',
        'ds': pd.date_range('2022-01-01', periods=730, freq='D'),
        'y': 100 + i * 5 + 8 * np.sin(2 * np.pi * np.arange(730) / 7) + np.random.randn(730) * 3,
    }) for i in range(50)
], ignore_index=True)

fcst = MLForecast(
    models={'lgb': lgb.LGBMRegressor(n_estimators=300, verbose=-1)},
    freq='D',
    lags=[1, 7],
    date_features=['dayofweek'],
)
fcst.fit(source_series)

# Few-shot: new series with only 14 observations
few_shot = pd.DataFrame({
    'unique_id': 'new_brand',
    'ds': pd.date_range('2024-01-01', periods=14, freq='D'),
    'y': 200 + 12 * np.sin(2 * np.pi * np.arange(14) / 7) + np.random.randn(14) * 4,
})

# With only 14 obs, max lag is 7 — global model uses what's available
preds = fcst.predict(h=7, new_df=few_shot)
print("Few-shot predictions (14-obs history, 7-step horizon):")
print(preds)
`,wt=[{title:"Transfer Learning for Time Series Forecasting",author:"Ye, L. & Keogh, E.",year:2021,url:"https://arxiv.org/abs/2102.02443"},{title:"A Meta-Learning Perspective on Cold-Start Recommendations",author:"Vartak, M. et al.",year:2017,url:"https://dl.acm.org/doi/10.5555/3294996.3295140"},{title:"Temporal Fusion Transformers for Interpretable Multi-horizon Forecasting",author:"Lim, B. et al.",year:2021,url:"https://arxiv.org/abs/1912.09363"},{title:"TimesFM: Time Series Foundation Model (Google)",author:"Das, A. et al.",year:2024,url:"https://arxiv.org/abs/2310.10688"},{title:"mlforecast documentation",author:"Nixtla",year:2024,url:"https://nixtlaverse.nixtla.io/mlforecast/"}];function jt(){return e.jsxs(u,{title:"Transfer Learning and Fine-tuning",difficulty:"advanced",readingTime:12,children:[e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Transfer learning applies knowledge from a large, well-trained model to new problems with limited data. In deep learning this means sharing learned representations (weights); in tree-based ML forecasting it means leveraging a pre-trained global model to initialise, augment, or correct predictions for new time series with sparse history."}),e.jsx(h,{term:"Transfer Learning for Forecasting",children:"Using a model pre-trained on a large source dataset (many series or long history) to improve predictions on a target dataset where training data is limited. Transfer can be applied as zero-shot prediction, fine-tuning (continued training), or feature transfer (using global model predictions as meta-features)."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Transfer Learning Approaches"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3 my-4",children:[{name:"Zero-Shot",desc:"Apply pre-trained global model directly to new series. No additional training on target. Effective when source and target share common patterns.",cost:"No training",when:"Very short series (<30 obs)"},{name:"Fine-Tuning",desc:"Continue training the global model on target series data with a small learning rate. Adapts the model to the target distribution.",cost:"Small training set + low LR",when:"Medium new series (30–200 obs)"},{name:"Feature Transfer",desc:"Use global model predictions as meta-features. Train a lightweight local corrector (Ridge, linear) on top of global predictions.",cost:"Tiny local model",when:"Target differs from source"}].map(t=>e.jsxs("div",{className:"p-3 rounded-lg bg-zinc-800 border border-zinc-700",children:[e.jsx("p",{className:"text-sky-400 font-semibold text-sm",children:t.name}),e.jsx("p",{className:"text-zinc-300 text-xs mt-1",children:t.desc}),e.jsxs("p",{className:"text-zinc-500 text-xs mt-2",children:[e.jsx("span",{className:"text-amber-400",children:"Cost:"})," ",t.cost]}),e.jsxs("p",{className:"text-zinc-500 text-xs",children:[e.jsx("span",{className:"text-emerald-400",children:"Use:"})," ",t.when]})]},t.name))}),e.jsx(s,{code:xt,title:"Transfer Learning Concepts for Tree Models"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Zero-Shot: Global Model on New Series"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["A global model learns universal seasonality and trend patterns from the source dataset. These patterns can be applied directly to new series because the date features (day of week, month) and lag structures are series-agnostic. The ",e.jsx("code",{children:"new_df"})," parameter in mlforecast passes context for new series not seen during training."]}),e.jsx(s,{code:_t,title:"Zero-Shot Prediction with mlforecast"}),e.jsx(g,{title:"Zero-Shot Works Best with Date Features",children:"Zero-shot transfer relies on the model having learned the relationship between calendar features (day_of_week, month) and the target during source training. Models trained with only lag features (no date features) generalise less effectively to new series zero-shot, since lags encode series-specific history."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Fine-Tuning"}),e.jsxs("p",{className:"text-zinc-300 leading-relaxed",children:["LightGBM and XGBoost support warm-starting from an existing model via",e.jsx("code",{children:"init_model"}),". Fine-tuning runs additional boosting rounds on the target series data, adapting the global model's decision boundaries to the target distribution with a smaller learning rate."]}),e.jsx(a.BlockMath,{math:String.raw`F_{\text{fine}}(\mathbf{x}) = F_{\text{global}}(\mathbf{x}) + \eta_{\text{small}} \sum_{m=1}^{M_{\text{fine}}} T_m(\mathbf{x})`}),e.jsx(s,{code:bt,title:"Fine-Tuning LightGBM on Target Series"}),e.jsx(f,{title:"Fine-Tuning Pitfalls",children:"Use a learning rate 5–10x smaller than the source training rate when fine-tuning (e.g., 0.005–0.01 vs. 0.05). A large learning rate will overwrite the global model's knowledge rather than adapting it. Limit fine-tuning rounds proportionally to the target dataset size to prevent overfitting on the small target sample."}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Feature Transfer (Meta-Learning)"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Feature transfer treats the global model's prediction as a strong prior. A lightweight local model (Ridge, linear regression, or tiny tree model) learns to correct the residuals using the target series' limited data. This approach is robust even when the global model's distribution differs from the target — the local corrector absorbs the domain gap."}),e.jsx(s,{code:yt,title:"Feature Transfer: Global Prediction as Meta-Feature"}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Few-Shot Forecasting"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Few-shot forecasting is the extreme case of transfer: the new series has only a handful of observations — insufficient to train any meaningful local model. The global model's cross-learned patterns provide the only signal, with lag features populated from the limited available history."}),e.jsx(s,{code:vt,title:"Few-Shot Forecasting with Global Model"}),e.jsxs("div",{style:{margin:"1rem 0",padding:"0.75rem",background:"#0f172a",borderRadius:"8px",border:"1px solid #334155"},children:[e.jsx("p",{style:{color:"#94a3b8",fontWeight:600,fontSize:"0.85rem",marginBottom:"0.5rem"},children:"MAE vs Target Observations: Transfer Approaches vs Local-Only (Illustrative)"}),e.jsx(M,{width:"100%",height:220,children:e.jsxs(L,{data:ut,margin:{top:5,right:20,left:0,bottom:5},children:[e.jsx(N,{strokeDasharray:"3 3",stroke:"#1e3a5f"}),e.jsx(z,{dataKey:"n",stroke:"#94a3b8",tick:{fontSize:10},label:{value:"Target obs",fill:"#64748b",position:"insideBottom",offset:-2}}),e.jsx(T,{stroke:"#94a3b8",tick:{fontSize:10},domain:[0,14],label:{value:"MAE",angle:-90,fill:"#64748b",position:"insideLeft"}}),e.jsx(B,{contentStyle:{background:"#1e293b",border:"1px solid #334155",color:"#e2e8f0",fontSize:11}}),e.jsx(C,{wrapperStyle:{color:"#94a3b8",fontSize:11}}),e.jsx(v,{type:"monotone",dataKey:"local",stroke:"#ef4444",dot:!1,name:"Local only",strokeWidth:2,strokeDasharray:"4 2"}),e.jsx(v,{type:"monotone",dataKey:"zeroShot",stroke:"#60a5fa",dot:!1,name:"Zero-shot",strokeWidth:2}),e.jsx(v,{type:"monotone",dataKey:"finetune",stroke:"#34d399",dot:!1,name:"Fine-tuned",strokeWidth:2}),e.jsx(v,{type:"monotone",dataKey:"featureXfer",stroke:"#fbbf24",dot:!1,name:"Feature transfer",strokeWidth:2})]})}),e.jsx("p",{style:{color:"#64748b",fontSize:"0.78rem",marginTop:"0.4rem"},children:"Local-only model degrades sharply for fewer than ~60 obs. All transfer approaches maintain acceptable accuracy even with 7-14 observations. Feature transfer consistently wins over zero-shot when any target data is available."})]}),e.jsx("h2",{className:"text-xl font-semibold text-white mt-8 mb-3",children:"Neural vs. Tree Transfer Learning"}),e.jsx("p",{className:"text-zinc-300 leading-relaxed",children:"Neural foundation models (TimesFM, Moirai, Chronos) take transfer learning further — pre-training on billions of time series observations and enabling zero-shot prediction on any new series without any feature engineering. For tree-based ML, the transfer mechanisms are less expressive but simpler to implement and control."}),e.jsx("div",{className:"overflow-x-auto my-4",children:e.jsxs("table",{className:"text-sm text-zinc-300 border-collapse w-full",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-zinc-800",children:["Method","Transfer Mechanism","Flexibility","Interpretability"].map(t=>e.jsx("th",{className:"border border-zinc-700 px-3 py-2 text-left text-xs",children:t},t))})}),e.jsx("tbody",{children:[["Tree zero-shot","Shared date feature patterns","High (same feature format)","Full SHAP support"],["Tree fine-tuning","Additional boosting rounds","High (adjustable LR/rounds)","Full SHAP support"],["Feature transfer","Global pred as meta-feature","Very high (any local model)","Local model interpretable"],["Neural foundation","Weight initialisation + embedding","Medium (architecture-dependent)","Limited"]].map(t=>e.jsx("tr",{className:"hover:bg-zinc-800",children:t.map((o,i)=>e.jsx("td",{className:"border border-zinc-700 px-3 py-1 text-xs",children:o},i))},t[0]))})]})}),e.jsx(_,{title:"Practical Transfer Learning Guidelines",children:e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm",children:[e.jsx("li",{children:"Source and target must share the same feature format (same lag set, same date features)"}),e.jsx("li",{children:"Normalise source and target series to the same scale before fine-tuning to avoid scale bias"}),e.jsx("li",{children:"Validate fine-tuning benefit: compare fine-tuned vs. global zero-shot on held-out target data"}),e.jsx("li",{children:"For very short series (<14 obs), zero-shot with date-feature-heavy model is most reliable"}),e.jsx("li",{children:"Feature transfer (meta-learning correction) consistently improves over pure zero-shot when any target data is available"})]})}),e.jsxs(b,{title:"New Store Launch Forecasting",children:[e.jsx("p",{className:"text-zinc-300 text-sm",children:"A retailer opens 10 new stores. Each has only 3 weeks (21 days) of sales history. The goal: forecast week 4–8 demand for inventory planning."}),e.jsxs("ul",{className:"list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2",children:[e.jsx("li",{children:"Source model: global LightGBM trained on 500 existing stores (3+ years each)"}),e.jsx("li",{children:"Approach: feature transfer — global model prediction + Ridge corrector on 21-day history"}),e.jsx("li",{children:"Features transferred: day_of_week seasonality, month pattern, lag structure"}),e.jsx("li",{children:"Local correction: store-specific level, local promotion effects"}),e.jsx("li",{children:"Result: 18% lower MAE vs. naive same-store-comparable approach on held-out week 5"})]})]}),e.jsx(x,{references:wt})]})}const Xt=Object.freeze(Object.defineProperty({__proto__:null,default:jt},Symbol.toStringTag,{value:"Module"}));export{zt as a,Tt as b,Bt as c,Ct as d,Lt as e,Rt as f,At as g,Pt as h,Gt as i,Dt as j,Et as k,Xt as l,Nt as s};
