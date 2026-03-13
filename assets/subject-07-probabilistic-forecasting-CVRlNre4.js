import{j as e}from"./vendor-CnSysweu.js";import{r as t}from"./vendor-katex-CdqB51LS.js";import{S as s,D as r,W as a,T as l,E as d,N as i,P as n,R as o}from"./subject-01-ts-foundations-fmj7uPpc.js";const c={title:"Prediction Intervals",difficulty:"intermediate",readingTime:11,description:"Learn to construct, evaluate, and interpret prediction intervals for time series forecasts, covering analytical and simulation-based methods."};function v(){return e.jsxs(s,{title:"Prediction Intervals",metadata:c,children:[e.jsx("p",{children:"Point forecasts tell you the expected value of a future observation, but they say nothing about how confident you should be in that estimate. Prediction intervals fill this gap by providing a range within which the actual value is expected to fall with a specified probability."}),e.jsxs(r,{title:"Prediction Interval",children:["A ",e.jsx("strong",{children:"prediction interval"})," (PI) at coverage level ",e.jsx(t.InlineMath,{math:"1 - \\alpha"})," is an interval ",e.jsx(t.InlineMath,{math:"[L_t, U_t]"})," such that:",e.jsx(t.BlockMath,{math:"P(y_{t+h} \\in [L_t, U_t]) \\geq 1 - \\alpha"}),"where ",e.jsx(t.InlineMath,{math:"y_{t+h}"})," is the future observation at horizon ",e.jsx(t.InlineMath,{math:"h"}),", and ",e.jsx(t.InlineMath,{math:"\\alpha"})," is the miscoverage rate (typically 0.05 for 95% intervals)."]}),e.jsx("h2",{children:"Confidence Intervals vs Prediction Intervals"}),e.jsx("p",{children:"These two concepts are frequently confused, even in professional settings. The distinction is fundamental:"}),e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",marginBottom:"1rem"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"#f3f4f6"},children:[e.jsx("th",{style:{padding:"0.75rem",textAlign:"left",border:"1px solid #e5e7eb"},children:"Property"}),e.jsx("th",{style:{padding:"0.75rem",textAlign:"left",border:"1px solid #e5e7eb"},children:"Confidence Interval"}),e.jsx("th",{style:{padding:"0.75rem",textAlign:"left",border:"1px solid #e5e7eb"},children:"Prediction Interval"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"What it covers"}),e.jsx("td",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"True parameter (e.g., mean)"}),e.jsx("td",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Future individual observation"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Sources of uncertainty"}),e.jsx("td",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Estimation uncertainty only"}),e.jsx("td",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Estimation + irreducible noise"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Width as n grows"}),e.jsx("td",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Shrinks to zero"}),e.jsx("td",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Converges to noise floor"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Use case"}),e.jsx("td",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Parameter estimation"}),e.jsx("td",{style:{padding:"0.75rem",border:"1px solid #e5e7eb"},children:"Forecasting future values"})]})]})]})}),e.jsx(a,{children:"Using a confidence interval where a prediction interval is required systematically underestimates uncertainty. A 95% confidence interval for the mean will have much lower actual coverage for individual future observations. Always use prediction intervals when communicating forecast uncertainty."}),e.jsx("h2",{children:"Analytical Prediction Intervals"}),e.jsx("p",{children:"When a model has known distributional assumptions, prediction intervals can be derived analytically. For an ARIMA model with Gaussian errors, the h-step-ahead prediction interval is:"}),e.jsx(t.BlockMath,{math:"\\hat{y}_{t+h|t} \\pm z_{\\alpha/2} \\cdot \\hat{\\sigma}_h"}),e.jsx("p",{children:"where the forecast variance grows with horizon:"}),e.jsx(t.BlockMath,{math:"\\hat{\\sigma}_h^2 = \\hat{\\sigma}^2 \\sum_{i=0}^{h-1} \\psi_i^2"}),e.jsxs("p",{children:["Here ",e.jsx(t.InlineMath,{math:"\\psi_i"})," are the MA coefficients in the infinite MA representation of the ARIMA model. This means prediction intervals widen as we forecast further into the future, correctly reflecting increasing uncertainty."]}),e.jsx("h2",{children:"Simulation-Based Prediction Intervals"}),e.jsx("p",{children:"For complex models where analytical formulas are unavailable, simulation provides a general alternative. The bootstrap approach works by:"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Fit the model and collect residuals ",e.jsx(t.InlineMath,{math:"\\hat{\\epsilon}_1, \\ldots, \\hat{\\epsilon}_T"})]}),e.jsx("li",{children:"Simulate many future paths by drawing residuals with replacement"}),e.jsx("li",{children:"Compute quantiles of the resulting distribution at each horizon"})]}),e.jsxs(l,{title:"Coverage Probability",children:["A prediction interval has ",e.jsx("strong",{children:"valid coverage"})," if, over many independent repetitions of the forecasting experiment, the true value falls within the interval at least ",e.jsx(t.InlineMath,{math:"1-\\alpha"})," of the time. A PI is ",e.jsx("em",{children:"exact"})," if:",e.jsx(t.BlockMath,{math:"P(y_{t+h} \\in [L_t, U_t]) = 1 - \\alpha"}),"and ",e.jsx("em",{children:"conservative"})," if the probability strictly exceeds ",e.jsx(t.InlineMath,{math:"1 - \\alpha"}),"."]}),e.jsx("h2",{children:"Evaluating Prediction Intervals: The Winkler Score"}),e.jsx("p",{children:"The Winkler score (also called the interval score) penalizes both wide intervals and coverage failures simultaneously:"}),e.jsx(t.BlockMath,{math:"W_\\alpha = (U - L) + \\frac{2}{\\alpha}(L - y)\\mathbf{1}[y < L] + \\frac{2}{\\alpha}(y - U)\\mathbf{1}[y > U]"}),e.jsxs("p",{children:["Lower Winkler scores are better. The first term rewards narrow intervals; the penalty terms penalize misses proportionally to how far outside the interval the actual value falls. The ",e.jsx(t.InlineMath,{math:"2/\\alpha"})," factor scales the penalty so that a 95% interval is penalized more heavily per unit miss than an 80% interval."]}),e.jsxs(d,{title:"Computing the Winkler Score",children:["Suppose you issue a 95% PI of [42, 68] and the actual value is 75.",e.jsx(t.BlockMath,{math:"W_{0.05} = (68 - 42) + \\frac{2}{0.05}(75 - 68) = 26 + 40 \\times 7 = 306"}),"Compare this to a wider interval [30, 80] with the same actual value of 75 (which is covered):",e.jsx(t.BlockMath,{math:"W_{0.05} = (80 - 30) + 0 = 50"}),"The wider interval scores much better because it avoids the heavy miss penalty."]}),e.jsx("h2",{children:"Common Pitfalls"}),e.jsx(a,{title:"Underestimation from Model Misspecification",children:"Analytical prediction intervals derived from ARIMA or ETS only account for uncertainty from future errors — they do not account for uncertainty in the estimated parameters themselves. As a result, they are systematically too narrow, especially for short training series. Bootstrapped intervals or conformal methods provide better finite-sample coverage."}),e.jsxs(i,{title:"Non-Gaussian Residuals",children:["Many time series have skewed or heavy-tailed residuals (e.g., demand data, financial returns). Using Gaussian-based intervals in these cases produces unreliable coverage. Consider:",e.jsxs("ul",{children:[e.jsx("li",{children:"Transforming the data (log, Box-Cox) before modeling"}),e.jsx("li",{children:"Using distribution-free simulation intervals"}),e.jsx("li",{children:"Quantile regression (covered in the next section)"})]})]}),e.jsx(i,{title:"Fan Charts",children:"When communicating forecast uncertainty to non-technical stakeholders, fan charts (shaded bands for multiple coverage levels, e.g., 50%, 80%, 95%) are more intuitive than a single interval. They convey both the central tendency and the full range of uncertainty."}),e.jsx("h2",{children:"Implementation with statsmodels and StatsForecast"}),e.jsx(n,{code:`import pandas as pd
import numpy as np
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA, AutoETS

# ── Analytical PIs with statsmodels ──────────────────────────────────────────
np.random.seed(42)
n = 200
t = np.arange(n)
y = 50 + 0.3 * t + 10 * np.sin(2 * np.pi * t / 52) + np.random.normal(0, 3, n)
dates = pd.date_range('2020-01-01', periods=n, freq='W')
series = pd.Series(y, index=dates)

train, test = series[:-12], series[-12:]

# Fit SARIMA
model = SARIMAX(train, order=(1, 1, 1), seasonal_order=(1, 0, 1, 52),
                enforce_stationarity=False, enforce_invertibility=False)
result = model.fit(disp=False)

# Get forecast with 95% prediction interval
forecast = result.get_forecast(steps=12)
pred_mean = forecast.predicted_mean
pred_ci = forecast.conf_int(alpha=0.05)

print(pd.DataFrame({
    'forecast': pred_mean,
    'lower_95': pred_ci.iloc[:, 0],
    'upper_95': pred_ci.iloc[:, 1],
    'actual': test.values
}))

# ── Winkler Score ─────────────────────────────────────────────────────────────
def winkler_score(actual, lower, upper, alpha=0.05):
    width = upper - lower
    miss_below = np.maximum(lower - actual, 0)
    miss_above = np.maximum(actual - upper, 0)
    penalty = (2 / alpha) * (miss_below + miss_above)
    return (width + penalty).mean()

score = winkler_score(
    test.values,
    pred_ci.iloc[:, 0].values,
    pred_ci.iloc[:, 1].values
)
print(f"Mean Winkler Score (95%): {score:.2f}")

# Empirical coverage
coverage = np.mean(
    (test.values >= pred_ci.iloc[:, 0].values) &
    (test.values <= pred_ci.iloc[:, 1].values)
)
print(f"Empirical Coverage: {coverage:.1%}  (target: 95%)")

# ── StatsForecast with PIs for panel data ─────────────────────────────────────
df = pd.DataFrame({
    'unique_id': 'series_1',
    'ds': dates[:188],
    'y': y[:188],
})

sf = StatsForecast(
    models=[AutoARIMA(season_length=52), AutoETS(season_length=52)],
    freq='W',
    n_jobs=-1
)
sf.fit(df)

# Forecast with multiple PI levels
forecast_df = sf.predict(h=12, level=[80, 95])
print("StatsForecast output columns:", forecast_df.columns.tolist())

# ── Bootstrap Prediction Intervals ───────────────────────────────────────────
def bootstrap_pi(train_series, n_steps, n_boot=500, alpha=0.05):
    """Bootstrap PI for AR(1) model."""
    from statsmodels.tsa.ar_model import AutoReg
    mdl = AutoReg(train_series, lags=1, old_names=False).fit()
    residuals = mdl.resid

    boot_forecasts = np.zeros((n_boot, n_steps))
    for b in range(n_boot):
        sim_errors = np.random.choice(residuals, size=n_steps, replace=True)
        path = [train_series.iloc[-1]]
        for e in sim_errors:
            nxt = mdl.params[0] + mdl.params[1] * path[-1] + e
            path.append(nxt)
        boot_forecasts[b] = path[1:]

    lower = np.quantile(boot_forecasts, alpha / 2, axis=0)
    upper = np.quantile(boot_forecasts, 1 - alpha / 2, axis=0)
    return lower, upper

lower_boot, upper_boot = bootstrap_pi(train, n_steps=12)
boot_coverage = np.mean(
    (test.values >= lower_boot) & (test.values <= upper_boot)
)
print(f"Bootstrap Coverage (95%): {boot_coverage:.1%}")
`}),e.jsx("h2",{children:"Choosing the Right Method"}),e.jsx("p",{children:"The choice between analytical and simulation-based intervals depends on model complexity and the importance of computational efficiency:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Analytical (ARIMA/ETS):"})," Fast and closed-form, but assumes Gaussian errors and ignores parameter uncertainty."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bootstrap:"})," Distribution-free, captures non-Gaussian residuals, but computationally heavier."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Conformal prediction:"})," Provides finite-sample coverage guarantees regardless of the underlying model (covered in Chapter 2)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bayesian:"})," Naturally quantifies all sources of uncertainty via the posterior predictive distribution (covered in Chapter 3)."]})]}),e.jsx(o,{references:[{title:"Forecasting: Principles and Practice (3rd ed.) — Prediction Intervals",authors:"Hyndman, R.J. & Athanasopoulos, G.",year:2021,url:"https://otexts.com/fpp3/prediction-intervals.html"},{title:"Strictly Proper Scoring Rules, Prediction, and Estimation",authors:"Gneiting, T. & Raftery, A.E.",year:2007,journal:"Journal of the American Statistical Association"},{title:"A Note on the Interval Score",authors:"Winkler, R.L.",year:1972,journal:"Management Science"}]})]})}const B=Object.freeze(Object.defineProperty({__proto__:null,default:v,metadata:c},Symbol.toStringTag,{value:"Module"})),h={title:"Quantile Forecasting",difficulty:"intermediate",readingTime:12,description:"Forecast specific quantiles of the future distribution using quantile regression, pinball loss, and gradient-boosted quantile models."};function b(){return e.jsxs(s,{title:"Quantile Forecasting",metadata:h,children:[e.jsxs("p",{children:["Rather than estimating the full predictive distribution, quantile forecasting targets specific percentiles of the future value. A quantile forecast at level ",e.jsx(t.InlineMath,{math:"\\tau \\in (0,1)"}),' answers the question: "What value will be exceeded only ',e.jsx(t.InlineMath,{math:"100(1-\\tau)\\%"}),' of the time?" This is directly useful for inventory planning, risk management, and service level agreements.']}),e.jsxs(r,{title:"Quantile Function",children:["The ",e.jsx("strong",{children:"quantile"})," at level ",e.jsx(t.InlineMath,{math:"\\tau"})," of a random variable ",e.jsx(t.InlineMath,{math:"Y"})," is:",e.jsx(t.BlockMath,{math:"Q_\\tau(Y) = \\inf\\{y : P(Y \\leq y) \\geq \\tau\\}"}),"A quantile forecasting model estimates ",e.jsx(t.InlineMath,{math:"Q_\\tau(Y_{t+h} \\mid \\mathcal{F}_t)"}),", the conditional quantile given information up to time ",e.jsx(t.InlineMath,{math:"t"}),"."]}),e.jsx("h2",{children:"Quantile Regression"}),e.jsxs("p",{children:["Classical linear quantile regression (Koenker and Bassett, 1978) estimates conditional quantiles by minimizing the ",e.jsx("strong",{children:"pinball loss"})," (also called check loss or quantile loss):"]}),e.jsx(t.BlockMath,{math:"\\mathcal{L}_\\tau(y, \\hat{q}) = \\begin{cases} \\tau (y - \\hat{q}) & \\text{if } y \\geq \\hat{q} \\\\ (1 - \\tau)(\\hat{q} - y) & \\text{if } y < \\hat{q} \\end{cases}"}),e.jsxs("p",{children:["This asymmetric loss function penalizes underprediction and overprediction differently, with the ratio of penalties equal to ",e.jsx(t.InlineMath,{math:"\\tau : (1-\\tau)"}),". At ",e.jsx(t.InlineMath,{math:"\\tau = 0.5"}),", the pinball loss reduces to MAE (median regression)."]}),e.jsxs(l,{title:"Optimality of Quantile Regression",children:["The function ",e.jsx(t.InlineMath,{math:"\\hat{q}^*(x)"})," that minimizes the expected pinball loss",e.jsx(t.BlockMath,{math:"\\mathbb{E}[\\mathcal{L}_\\tau(Y, \\hat{q}(X))]"}),"is exactly the conditional ",e.jsx(t.InlineMath,{math:"\\tau"}),"-quantile ",e.jsx(t.InlineMath,{math:"Q_\\tau(Y \\mid X = x)"}),". This means any model trained by minimizing pinball loss directly targets the correct quantile, without needing distributional assumptions."]}),e.jsxs(d,{title:"Pinball Loss in Practice",children:["For a 90th percentile forecast (",e.jsx(t.InlineMath,{math:"\\tau = 0.9"}),"):",e.jsxs("ul",{children:[e.jsx("li",{children:"If actual = 100 and forecast = 80 (underprediction by 20): loss = 0.9 × 20 = 18"}),e.jsx("li",{children:"If actual = 100 and forecast = 120 (overprediction by 20): loss = 0.1 × 20 = 2"})]}),"The asymmetry (18 vs 2) reflects that missing a high quantile upward is much cheaper than missing it downward — appropriate for capacity planning where underestimation is costly."]}),e.jsx("h2",{children:"Quantile Regression Forests"}),e.jsxs("p",{children:["Meinshausen (2006) showed that random forests can estimate the full conditional distribution, not just the mean. A ",e.jsx("strong",{children:"Quantile Regression Forest"})," (QRF) works by:"]}),e.jsxs("ol",{children:[e.jsx("li",{children:"Training a standard random forest on the training data"}),e.jsxs("li",{children:["For a new input ",e.jsx(t.InlineMath,{math:"x"}),", collecting all training observations that fall in the same leaf nodes"]}),e.jsx("li",{children:"Computing the empirical quantile of those collected observations"})]}),e.jsx("p",{children:"This approach is non-parametric and naturally adapts to heteroscedasticity — regions of the input space with high variance automatically produce wider intervals."}),e.jsx("h2",{children:"LightGBM Quantile Regression"}),e.jsxs("p",{children:["Gradient-boosted trees support quantile regression by using pinball loss as the objective function. LightGBM's ",e.jsx("code",{children:"objective='quantile'"})," with ",e.jsx("code",{children:"alpha=tau"})," trains a model that directly minimizes pinball loss. Advantages over QRF:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Handles larger datasets more efficiently"}),e.jsx("li",{children:"Better at capturing complex interaction effects"}),e.jsx("li",{children:"Supports categorical features natively"}),e.jsx("li",{children:"Can be tuned via learning rate and number of trees"})]}),e.jsxs(a,{title:"Quantile Crossing",children:['When training separate models for different quantiles (e.g., 10th, 50th, 90th), the resulting quantile estimates may "cross" — meaning the 10th percentile forecast exceeds the 50th percentile forecast for some inputs. This is mathematically invalid. Solutions include:',e.jsxs("ul",{children:[e.jsx("li",{children:"Post-processing: isotonic regression to enforce monotonicity"}),e.jsx("li",{children:"Multi-output models that predict all quantiles simultaneously"}),e.jsx("li",{children:"Non-crossing quantile regression (Takeuchi et al., 2006)"})]})]}),e.jsx("h2",{children:"Probabilistic Neural Network Outputs"}),e.jsx("p",{children:"Deep learning models can be adapted for quantile forecasting in two main ways:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Multi-quantile output heads:"})," The network predicts multiple quantiles simultaneously, trained jointly with a sum of pinball losses. This is used in DeepAR, TFT (Temporal Fusion Transformer), and N-BEATS-Q."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Parametric output:"})," The network outputs parameters of a known distribution (e.g., mean and variance for Gaussian, or alpha/beta for Beta distribution), from which quantiles are derived analytically."]})]}),e.jsxs(i,{title:"Connecting to Prediction Intervals",children:["A prediction interval at level ",e.jsx(t.InlineMath,{math:"1-\\alpha"})," is equivalent to the interval between the ",e.jsx(t.InlineMath,{math:"\\alpha/2"})," and ",e.jsx(t.InlineMath,{math:"1-\\alpha/2"})," quantile forecasts. For a 95% PI, use quantile forecasts at ",e.jsx(t.InlineMath,{math:"\\tau = 0.025"})," and ",e.jsx(t.InlineMath,{math:"\\tau = 0.975"}),"."]}),e.jsx("h2",{children:"Implementation: sklearn and LightGBM"}),e.jsx(n,{code:`import numpy as np
import pandas as pd
from sklearn.linear_model import QuantileRegressor
from sklearn.ensemble import GradientBoostingRegressor
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_pinball_loss

# ── Generate sample time series features ─────────────────────────────────────
np.random.seed(42)
n = 1000
t = np.arange(n)

# Heteroscedastic series: variance grows with t
noise_std = 1 + 0.5 * np.sin(2 * np.pi * t / 365)
y = 20 + 0.02 * t + 5 * np.sin(2 * np.pi * t / 52) + noise_std * np.random.randn(n)

# Create lag features
def make_features(series, lags=[1, 2, 7, 14, 28]):
    df = pd.DataFrame({'y': series})
    for lag in lags:
        df[f'lag_{lag}'] = df['y'].shift(lag)
    df['t'] = np.arange(len(series))
    df['sin_week'] = np.sin(2 * np.pi * df['t'] / 52)
    df['cos_week'] = np.cos(2 * np.pi * df['t'] / 52)
    return df.dropna()

df = make_features(y)
X = df.drop('y', axis=1).values
y_clean = df['y'].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y_clean, test_size=0.2, shuffle=False
)

# ── Linear Quantile Regression ────────────────────────────────────────────────
quantiles = [0.1, 0.5, 0.9]
qr_models = {}
for q in quantiles:
    qr = QuantileRegressor(quantile=q, alpha=0.01, solver='highs')
    qr.fit(X_train, y_train)
    qr_models[q] = qr
    preds = qr.predict(X_test)
    score = mean_pinball_loss(y_test, preds, alpha=q)
    print(f"Linear QR q={q:.1f}: pinball loss = {score:.3f}")

# ── Gradient Boosting Quantile Regression (sklearn) ───────────────────────────
gbr_models = {}
for q in quantiles:
    gbr = GradientBoostingRegressor(
        loss='quantile', alpha=q,
        n_estimators=200, max_depth=4, learning_rate=0.05
    )
    gbr.fit(X_train, y_train)
    gbr_models[q] = gbr

# Evaluate coverage of 80% PI (10th to 90th percentile)
lower = gbr_models[0.1].predict(X_test)
upper = gbr_models[0.9].predict(X_test)
coverage = np.mean((y_test >= lower) & (y_test <= upper))
print(f"GBR 80% PI Coverage: {coverage:.1%}  (target: 80%)")

# ── LightGBM Quantile Regression ──────────────────────────────────────────────
lgb_models = {}
for q in quantiles:
    params = {
        'objective': 'quantile',
        'alpha': q,
        'num_leaves': 63,
        'learning_rate': 0.05,
        'n_estimators': 300,
        'min_child_samples': 20,
        'verbose': -1,
    }
    model = lgb.LGBMRegressor(**params)
    model.fit(X_train, y_train,
              eval_set=[(X_test, y_test)],
              callbacks=[lgb.early_stopping(50, verbose=False)])
    lgb_models[q] = model
    preds = model.predict(X_test)
    score = mean_pinball_loss(y_test, preds, alpha=q)
    print(f"LightGBM q={q:.1f}: pinball loss = {score:.3f}")

# ── Fix quantile crossing with isotonic regression ───────────────────────────
from sklearn.isotonic import IsotonicRegression

def fix_crossing(preds_low, preds_high):
    """Ensure preds_low <= preds_high pointwise."""
    stacked = np.column_stack([preds_low, preds_high])
    # Simple fix: swap where crossed
    crossed = stacked[:, 0] > stacked[:, 1]
    stacked[crossed] = stacked[crossed][:, ::-1]
    return stacked[:, 0], stacked[:, 1]

low_raw = lgb_models[0.1].predict(X_test)
high_raw = lgb_models[0.9].predict(X_test)
low_fixed, high_fixed = fix_crossing(low_raw, high_raw)

n_crossed_before = np.sum(low_raw > high_raw)
n_crossed_after = np.sum(low_fixed > high_fixed)
print(f"Quantile crossings: {n_crossed_before} -> {n_crossed_after}")

# ── Multi-quantile evaluation ─────────────────────────────────────────────────
results = []
for q in [0.1, 0.25, 0.5, 0.75, 0.9]:
    if q not in lgb_models:
        params = {'objective': 'quantile', 'alpha': q, 'verbose': -1}
        m = lgb.LGBMRegressor(**params)
        m.fit(X_train, y_train)
        lgb_models[q] = m
    preds = lgb_models[q].predict(X_test)
    emp_coverage = np.mean(y_test <= preds)
    results.append({'quantile': q, 'target': q, 'empirical': emp_coverage})

print("\\nQuantile calibration check:")
print(pd.DataFrame(results).to_string(index=False))
`}),e.jsx("h2",{children:"Evaluation: Beyond Pinball Loss"}),e.jsx("p",{children:"When producing multiple quantile forecasts, two aggregate metrics are commonly used:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Mean Pinball Loss (MPL):"})," Average pinball loss across all quantile levels, measuring overall distributional accuracy."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Quantile Score (WQL):"})," Weighted quantile loss used in the M5 competition, giving more weight to extreme quantiles."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Calibration plots:"})," Compare empirical coverage at each quantile level against the nominal level. A perfectly calibrated model produces a diagonal plot."]})]}),e.jsx(o,{references:[{title:"Regression Quantiles",authors:"Koenker, R. & Bassett, G.",year:1978,journal:"Econometrica"},{title:"Quantile Regression Forests",authors:"Meinshausen, N.",year:2006,journal:"Journal of Machine Learning Research"},{title:"LightGBM: A Highly Efficient Gradient Boosting Decision Tree",authors:"Ke, G. et al.",year:2017,journal:"NeurIPS"}]})]})}const R=Object.freeze(Object.defineProperty({__proto__:null,default:b,metadata:h},Symbol.toStringTag,{value:"Module"})),m={title:"Distributional Forecasting",difficulty:"advanced",readingTime:13,description:"Go beyond quantiles to forecast complete predictive distributions using normalizing flows, deep autoregressive models, and proper scoring rules."};function j(){return e.jsxs(s,{title:"Distributional Forecasting",metadata:m,children:[e.jsx("p",{children:"The most complete form of probabilistic forecasting produces an entire predictive distribution, not just point estimates or a few quantiles. This allows computing any desired quantity — probabilities, quantiles, expected shortfall, or risk measures — from a single unified model."}),e.jsxs(r,{title:"Predictive Distribution",children:["The ",e.jsx("strong",{children:"predictive distribution"})," for horizon ",e.jsx(t.InlineMath,{math:"h"})," given information up to time ",e.jsx(t.InlineMath,{math:"t"})," is the conditional distribution:",e.jsx(t.BlockMath,{math:"p(y_{t+h} \\mid y_1, \\ldots, y_t) = \\int p(y_{t+h} \\mid \\theta) \\, p(\\theta \\mid y_{1:t}) \\, d\\theta"}),"In practice, most methods approximate this by conditioning on point estimates",e.jsx(t.InlineMath,{math:"\\hat{\\theta}"})," rather than integrating over parameter uncertainty."]}),e.jsx("h2",{children:"Deep Autoregressive Models (DeepAR)"}),e.jsx("p",{children:"DeepAR (Salinas et al., 2020) is Amazon's deep learning approach to distributional forecasting. It uses an LSTM to model temporal dynamics, then outputs the parameters of a chosen distribution at each time step:"}),e.jsx(t.BlockMath,{math:"p(z_{i,t} \\mid z_{i,1:t-1}, x_{i,1:T}) = \\ell(z_{i,t} \\mid \\theta(h_{i,t}))"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"h_{i,t}"})," is the LSTM hidden state and ",e.jsx(t.InlineMath,{math:"\\ell"})," is a likelihood function (Gaussian, Student-t, Negative Binomial for count data, etc.). Key advantages:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Learns across thousands of related time series simultaneously"}),e.jsx("li",{children:"Handles cold-start via learned covariate embeddings"}),e.jsx("li",{children:"Choice of output distribution matches the data type"}),e.jsx("li",{children:"Monte Carlo sampling naturally produces prediction intervals"})]}),e.jsx("h2",{children:"Normalizing Flows for Time Series"}),e.jsx("p",{children:"Normalizing flows transform a simple base distribution (e.g., Gaussian) into a complex target distribution through a sequence of invertible mappings:"}),e.jsx(t.BlockMath,{math:"z = f_K \\circ f_{K-1} \\circ \\cdots \\circ f_1(x)"}),e.jsx("p",{children:"The log-likelihood is tractable via the change-of-variables formula:"}),e.jsx(t.BlockMath,{math:"\\log p_X(x) = \\log p_Z(z) + \\sum_{k=1}^K \\log \\left|\\det \\frac{\\partial f_k}{\\partial z_{k-1}}\\right|"}),e.jsxs("p",{children:["In time series, flows are conditioned on the history ",e.jsx(t.InlineMath,{math:"h_t"})," (from an RNN or transformer), so the density at each future time step adapts to the observed context. Notable architectures include ",e.jsx("strong",{children:"TimeGrad"})," (diffusion-based) and ",e.jsx("strong",{children:"TACTiS"}),"(transformer-attentional copulas)."]}),e.jsx("h2",{children:"Gaussian Processes for Time Series"}),e.jsx("p",{children:"A Gaussian Process (GP) defines a distribution over functions, making it naturally suited for uncertainty-aware time series modeling:"}),e.jsx(t.BlockMath,{math:"f(t) \\sim \\mathcal{GP}(\\mu(t), k(t, t'))"}),e.jsxs("p",{children:["The kernel ",e.jsx(t.InlineMath,{math:"k(t, t')"})," encodes prior beliefs about smoothness, periodicity, and scale. The posterior GP after observing data gives a closed-form predictive distribution:"]}),e.jsx(t.BlockMath,{math:"f_* \\mid X, y, X_* \\sim \\mathcal{N}(\\bar{f}_*, \\text{cov}(f_*))"}),e.jsxs("p",{children:["GP forecasting is most practical for shorter series (due to ",e.jsx(t.InlineMath,{math:"O(n^3)"})," cost) or when combined with sparse approximations (inducing point methods)."]}),e.jsx("h2",{children:"CRPS: The Proper Scoring Rule for Distributions"}),e.jsxs("p",{children:["The ",e.jsx("strong",{children:"Continuous Ranked Probability Score"})," (CRPS) is the standard metric for evaluating distributional forecasts. It generalizes MAE to the distributional setting:"]}),e.jsx(t.BlockMath,{math:"\\text{CRPS}(F, y) = \\int_{-\\infty}^{\\infty} (F(z) - \\mathbf{1}[z \\geq y])^2 \\, dz"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"F"})," is the predicted CDF and ",e.jsx(t.InlineMath,{math:"y"})," is the observation. Equivalently:"]}),e.jsx(t.BlockMath,{math:"\\text{CRPS}(F, y) = \\mathbb{E}_{F}|Y - y| - \\frac{1}{2}\\mathbb{E}_{F}|Y - Y'|"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"Y, Y'"})," are independent draws from ",e.jsx(t.InlineMath,{math:"F"}),". This representation enables CRPS computation from samples without knowing the analytical form of ",e.jsx(t.InlineMath,{math:"F"}),"."]}),e.jsxs(l,{title:"Propriety of CRPS",children:["CRPS is a ",e.jsx("strong",{children:"strictly proper scoring rule"}),": the expected CRPS is minimized if and only if the forecaster reports their true predictive distribution ",e.jsx(t.InlineMath,{math:"F = G"}),", where ",e.jsx(t.InlineMath,{math:"G"})," is the true distribution generating the observations. No incentive exists to misreport the distribution."]}),e.jsxs(i,{title:"CRPS vs. Log Score",children:["The log score ",e.jsx(t.InlineMath,{math:"-\\log p(y)"})," is another proper scoring rule that heavily penalizes overconfident forecasts (when ",e.jsx(t.InlineMath,{math:"p(y)"})," is small). CRPS is less sensitive to extreme events and more robust to outliers. For heavy-tailed processes, CRPS is often preferred because it does not blow up when the predicted density near the observation is close to zero."]}),e.jsx("h2",{children:"Energy Score for Multivariate Distributions"}),e.jsx("p",{children:"When forecasting multiple horizons jointly, the Energy Score generalizes CRPS to multivariate distributions:"}),e.jsx(t.BlockMath,{math:"\\text{ES}(F, \\mathbf{y}) = \\mathbb{E}_F \\|\\mathbf{Y} - \\mathbf{y}\\| - \\frac{1}{2}\\mathbb{E}_F \\|\\mathbf{Y} - \\mathbf{Y}'\\|"}),e.jsx("p",{children:"It is also strictly proper and can be estimated from Monte Carlo samples of the predictive distribution."}),e.jsx(a,{title:"Sampling vs. Analytic Evaluation",children:"Many deep learning models produce forecast distributions through Monte Carlo sampling. When evaluating CRPS from samples, use a sufficiently large sample size (at least 200-500 paths) to get stable estimates. Too few samples leads to noisy CRPS estimates that may misrank models."}),e.jsx("h2",{children:"Implementation with NeuralForecast"}),e.jsx(n,{code:`import numpy as np
import pandas as pd
from neuralforecast import NeuralForecast
from neuralforecast.models import DeepAR, PatchTST, iTransformer
from neuralforecast.losses.pytorch import CRPS, MQLoss, DistributionLoss
import properscoring as ps  # pip install properscoring

# ── Generate panel data ───────────────────────────────────────────────────────
np.random.seed(42)
n_series, n_obs = 50, 200
records = []
for sid in range(n_series):
    base = np.random.uniform(10, 100)
    noise_scale = np.random.uniform(0.5, 3.0)
    t = np.arange(n_obs)
    vals = (base
            + 0.1 * t
            + 5 * np.sin(2 * np.pi * t / 52)
            + noise_scale * np.random.randn(n_obs))
    dates = pd.date_range('2020-01-01', periods=n_obs, freq='W')
    for d, v in zip(dates, vals):
        records.append({'unique_id': f'series_{sid}', 'ds': d, 'y': v})

df = pd.DataFrame(records)

# Split train / test (last 12 weeks as test)
horizon = 12
train_df = df.groupby('unique_id').apply(
    lambda x: x.iloc[:-horizon]).reset_index(drop=True)
test_df = df.groupby('unique_id').apply(
    lambda x: x.iloc[-horizon:]).reset_index(drop=True)

# ── DeepAR with Gaussian likelihood ──────────────────────────────────────────
nf_deepar = NeuralForecast(
    models=[
        DeepAR(
            h=horizon,
            input_size=52,
            lstm_n_layers=2,
            lstm_hidden_size=128,
            loss=DistributionLoss(distribution='Normal', level=[80, 95]),
            max_steps=200,
            val_check_steps=50,
        )
    ],
    freq='W'
)
nf_deepar.fit(df=train_df)
forecasts_deepar = nf_deepar.predict()
print("DeepAR forecast columns:", forecasts_deepar.columns.tolist())

# ── Multi-Quantile Loss with PatchTST ────────────────────────────────────────
quantile_levels = [10, 20, 30, 40, 50, 60, 70, 80, 90]  # percentiles
nf_mq = NeuralForecast(
    models=[
        PatchTST(
            h=horizon,
            input_size=52,
            loss=MQLoss(level=quantile_levels),
            max_steps=200,
        )
    ],
    freq='W'
)
nf_mq.fit(df=train_df)
forecasts_mq = nf_mq.predict()

# ── CRPS Evaluation from quantile forecasts ───────────────────────────────────
def crps_from_quantiles(y_true, quantile_preds, quantile_levels):
    """Estimate CRPS from a set of quantile predictions using trapezoidal rule."""
    taus = np.array(quantile_levels) / 100.0
    crps_vals = np.zeros(len(y_true))
    for i, y in enumerate(y_true):
        q = quantile_preds[i]
        pinball = np.array([
            (y - qi) * t if y >= qi else (qi - y) * (1 - t)
            for qi, t in zip(q, taus)
        ])
        # CRPS = 2 * integral of pinball loss over tau
        crps_vals[i] = 2 * np.trapz(pinball, taus)
    return crps_vals.mean()

# ── properscoring: CRPS from samples ─────────────────────────────────────────
# Simulate 500 forecast samples from a Normal distribution
n_test_obs = 100
y_test = np.random.randn(n_test_obs) * 2 + 5
forecast_samples = np.random.randn(n_test_obs, 500) * 2.1 + 5.1  # slightly biased

# CRPS from samples using properscoring
crps_values = ps.crps_ensemble(y_test, forecast_samples)
print(f"Mean CRPS: {crps_values.mean():.4f}")

# Energy score for multivariate forecasts (multiple horizons)
def energy_score(y_obs, samples):
    """
    y_obs: (n_obs, n_horizons)
    samples: (n_obs, n_samples, n_horizons)
    """
    n_obs, n_samp, _ = samples.shape
    term1 = np.mean(
        np.linalg.norm(samples - y_obs[:, None, :], axis=-1), axis=1
    )
    idx1 = np.random.randint(0, n_samp, n_obs)
    idx2 = np.random.randint(0, n_samp, n_obs)
    s1 = samples[np.arange(n_obs), idx1]
    s2 = samples[np.arange(n_obs), idx2]
    term2 = 0.5 * np.linalg.norm(s1 - s2, axis=-1)
    return (term1 - term2).mean()

# ── Spread-Skill ratio ────────────────────────────────────────────────────────
# Checks if forecast spread matches forecast error
spread = forecast_samples.std(axis=1)
skill = np.abs(y_test - forecast_samples.mean(axis=1))
spread_skill = spread.mean() / skill.mean()
print(f"Spread-Skill Ratio: {spread_skill:.3f}  (1.0 = perfect calibration)")
`}),e.jsx(o,{references:[{title:"DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks",authors:"Salinas, D., Flunkert, V., Gasthaus, J. & Januschowski, T.",year:2020,journal:"International Journal of Forecasting"},{title:"Strictly Proper Scoring Rules, Prediction, and Estimation",authors:"Gneiting, T. & Raftery, A.E.",year:2007,journal:"Journal of the American Statistical Association"},{title:"Neural Basis Expansion Analysis with Exogenous Variables (NBEATSx)",authors:"Olivares, K.G. et al.",year:2023,journal:"International Journal of Forecasting"}]})]})}const F=Object.freeze(Object.defineProperty({__proto__:null,default:j,metadata:m},Symbol.toStringTag,{value:"Module"})),p={title:"Conformal Prediction Basics",difficulty:"intermediate",readingTime:12,description:"Learn split conformal prediction: a distribution-free method with finite-sample coverage guarantees for any forecasting model."};function w(){return e.jsxs(s,{title:"Conformal Prediction Basics",metadata:p,children:[e.jsxs("p",{children:["Conformal prediction is a framework for constructing prediction intervals with ",e.jsx("em",{children:"guaranteed"})," finite-sample coverage, regardless of the underlying model or data distribution (under exchangeability). Unlike bootstrap or parametric intervals, conformal prediction requires no distributional assumptions and works as a wrapper around any existing point forecasting model."]}),e.jsxs(r,{title:"Split Conformal Prediction",children:["Given a pre-trained model and a held-out ",e.jsx("strong",{children:"calibration set"})," ",e.jsx(t.InlineMath,{math:"\\{(x_i, y_i)\\}_{i=1}^n"}),", split conformal prediction:",e.jsxs("ol",{children:[e.jsxs("li",{children:["Computes non-conformity scores ",e.jsx(t.InlineMath,{math:"s_i = |y_i - \\hat{f}(x_i)|"})]}),e.jsxs("li",{children:["Finds the ",e.jsx(t.InlineMath,{math:"\\lceil (n+1)(1-\\alpha) \\rceil / n"})," empirical quantile",e.jsx(t.InlineMath,{math:"\\hat{q}"})," of the scores"]}),e.jsxs("li",{children:["Returns the prediction set ",e.jsx(t.InlineMath,{math:"\\hat{C}(x) = [\\hat{f}(x) - \\hat{q},\\ \\hat{f}(x) + \\hat{q}]"})]})]})]}),e.jsx("h2",{children:"The Calibration Set"}),e.jsxs("p",{children:["The calibration set is a held-out portion of the data used exclusively to determine the width of prediction intervals. It must be ",e.jsx("em",{children:"independent"})," of the training data used to fit the model. The three-way split for conformal forecasting is:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Training set:"})," Used to fit the forecasting model"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Calibration set:"})," Used to compute non-conformity scores and find the quantile threshold"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Test set:"})," The future observations for which we issue interval forecasts"]})]}),e.jsxs(i,{title:"Calibration Set Size",children:["The calibration set should contain at least ",e.jsx(t.InlineMath,{math:"n \\geq \\lceil (1-\\alpha)/\\alpha \\rceil"})," observations for the quantile to be well-defined. For 95% coverage, you need at least 19 calibration points. In practice, 200–500 calibration points are recommended for stable intervals."]}),e.jsx("h2",{children:"Non-Conformity Scores"}),e.jsx("p",{children:"The non-conformity score measures how unusual a new observation is relative to the model's predictions. The simplest choice for regression is the absolute residual:"}),e.jsx(t.BlockMath,{math:"s_i = |y_i - \\hat{f}(x_i)|"}),e.jsx("p",{children:"Other choices include:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Signed residual:"})," ",e.jsx(t.InlineMath,{math:"s_i = y_i - \\hat{f}(x_i)"})," (asymmetric intervals)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Normalized score:"})," ",e.jsx(t.InlineMath,{math:"s_i = |y_i - \\hat{f}(x_i)| / \\hat{\\sigma}(x_i)"})," (locally adaptive width)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"CQR score:"})," ",e.jsx(t.InlineMath,{math:"\\max(q_\\tau^{lo}(x) - y, y - q_\\tau^{hi}(x))"})," for quantile models"]})]}),e.jsx("h2",{children:"Coverage Guarantee"}),e.jsxs(l,{title:"Marginal Coverage Guarantee",children:["Under ",e.jsx("strong",{children:"exchangeability"})," of the calibration and test points, split conformal prediction achieves:",e.jsx(t.BlockMath,{math:"P(Y_{n+1} \\in \\hat{C}(X_{n+1})) \\geq 1 - \\alpha"}),"Moreover, coverage is bounded above by:",e.jsx(t.BlockMath,{math:"P(Y_{n+1} \\in \\hat{C}(X_{n+1})) \\leq 1 - \\alpha + \\frac{1}{n+1}"}),"so coverage is nearly exact (not overly conservative) for large calibration sets."]}),e.jsx("p",{children:"The exchangeability assumption holds when calibration and test data are i.i.d. from the same distribution. For time series, this is violated by temporal dependence and distribution shift, which motivates the adaptive methods in the next section."}),e.jsx("h2",{children:"Marginal vs Conditional Coverage"}),e.jsxs("p",{children:["The guarantee above is ",e.jsx("strong",{children:"marginal"}),": coverage holds on average over all possible test inputs. It does ",e.jsx("em",{children:"not"})," guarantee coverage for every subgroup or covariate region."]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Marginal coverage:"})," ",e.jsx(t.InlineMath,{math:"P(Y \\in \\hat{C}(X)) \\geq 1 - \\alpha"})," — holds unconditionally."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Conditional coverage:"})," ",e.jsx(t.InlineMath,{math:"P(Y \\in \\hat{C}(X) \\mid X = x) \\geq 1 - \\alpha"})," — only achievable with stronger assumptions or adaptive methods."]})]}),e.jsx(a,{title:"Marginal vs Conditional Coverage in Practice",children:"A model with 95% marginal coverage may have 70% coverage in one subgroup and 99% in another. For safety-critical applications (medical, financial), conditional coverage is often what matters. Conformalized Quantile Regression (CQR) and localized conformal methods offer better conditional coverage by using locally adaptive non-conformity scores."}),e.jsx(d,{title:"Conformal Interval vs Parametric Interval",children:"Consider a neural network trained on retail demand. The parametric approach assumes Gaussian residuals and computes intervals from the model's estimated variance. Conformal prediction instead looks at actual calibration residuals — if the model systematically under-predicts certain SKUs, the calibration scores will be larger, and the interval widens accordingly, without any distributional assumption."}),e.jsx("h2",{children:"Conformalized Quantile Regression (CQR)"}),e.jsx("p",{children:"CQR (Romano et al., 2019) combines quantile regression with conformal calibration for improved conditional coverage. Instead of a fixed-width interval, CQR adapts interval width to local uncertainty:"}),e.jsx(t.BlockMath,{math:"s_i = \\max(q_{\\alpha/2}(x_i) - y_i,\\ y_i - q_{1-\\alpha/2}(x_i))"}),e.jsx("p",{children:"The calibrated interval for a new point is:"}),e.jsx(t.BlockMath,{math:"\\hat{C}(x) = [q_{\\alpha/2}(x) - \\hat{q},\\ q_{1-\\alpha/2}(x) + \\hat{q}]"}),e.jsx("p",{children:"This inherits the coverage guarantee of conformal prediction while benefiting from the local adaptivity of quantile regression."}),e.jsx("h2",{children:"Implementation with MAPIE"}),e.jsx(n,{code:`import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from mapie.regression import MapieRegressor
from mapie.metrics import coverage_score, regression_mean_width_score

# ── Generate synthetic time series data ───────────────────────────────────────
np.random.seed(0)
n = 500
t = np.arange(n)
y = 20 + 0.05 * t + 5 * np.sin(2 * np.pi * t / 52) + np.random.randn(n) * (1 + 0.01 * t)

# Build lag features
def make_lag_features(series, lags=range(1, 8)):
    df = pd.DataFrame({'y': series})
    for lag in lags:
        df[f'lag_{lag}'] = df['y'].shift(lag)
    df['t'] = np.arange(len(series))
    df['sin52'] = np.sin(2 * np.pi * df['t'] / 52)
    df['cos52'] = np.cos(2 * np.pi * df['t'] / 52)
    return df.dropna()

df_feat = make_lag_features(y)
X = df_feat.drop('y', axis=1).values
y_clean = df_feat['y'].values

# Three-way split: train / calibration / test
n_train = int(len(X) * 0.6)
n_cal   = int(len(X) * 0.2)

X_train, y_train = X[:n_train], y_clean[:n_train]
X_cal,   y_cal   = X[n_train:n_train+n_cal], y_clean[n_train:n_train+n_cal]
X_test,  y_test  = X[n_train+n_cal:], y_clean[n_train+n_cal:]

# ── Manual Split Conformal Prediction ────────────────────────────────────────
base_model = GradientBoostingRegressor(n_estimators=100, max_depth=4)
base_model.fit(X_train, y_train)

# Compute calibration non-conformity scores
cal_preds = base_model.predict(X_cal)
cal_scores = np.abs(y_cal - cal_preds)

# Find the (1-alpha) quantile with finite-sample correction
alpha = 0.05
n_cal_size = len(y_cal)
q_level = np.ceil((n_cal_size + 1) * (1 - alpha)) / n_cal_size
q_hat = np.quantile(cal_scores, q_level, method='higher')
print(f"Conformal threshold q_hat: {q_hat:.3f}")

# Build prediction intervals on test set
test_preds = base_model.predict(X_test)
lower = test_preds - q_hat
upper = test_preds + q_hat

cov = coverage_score(y_test, lower, upper)
width = regression_mean_width_score(lower, upper)
print(f"Coverage: {cov:.1%}  (target: 95%)")
print(f"Mean Width: {width:.3f}")

# ── MAPIE: Split Conformal with CV+ ──────────────────────────────────────────
# cv='split' uses split conformal; cv='prefit' uses your pre-trained model
mapie = MapieRegressor(
    estimator=GradientBoostingRegressor(n_estimators=100),
    method='base',
    cv='split',
    test_size=0.2
)
mapie.fit(np.vstack([X_train, X_cal]), np.concatenate([y_train, y_cal]))
y_pred, y_pis = mapie.predict(X_test, alpha=0.05)

cov_mapie = coverage_score(y_test, y_pis[:, 0, 0], y_pis[:, 1, 0])
print(f"MAPIE Coverage: {cov_mapie:.1%}")

# ── Conformalized Quantile Regression (CQR) ───────────────────────────────────
from sklearn.ensemble import GradientBoostingRegressor as GBR

# Train lower and upper quantile models
q_low_model  = GBR(loss='quantile', alpha=0.025, n_estimators=100)
q_high_model = GBR(loss='quantile', alpha=0.975, n_estimators=100)
q_low_model.fit(X_train, y_train)
q_high_model.fit(X_train, y_train)

# CQR non-conformity scores on calibration set
cal_lo = q_low_model.predict(X_cal)
cal_hi = q_high_model.predict(X_cal)
cqr_scores = np.maximum(cal_lo - y_cal, y_cal - cal_hi)

q_cqr = np.quantile(cqr_scores, q_level, method='higher')
print(f"CQR threshold: {q_cqr:.3f}")

# Apply CQR intervals to test set
test_lo = q_low_model.predict(X_test)  - q_cqr
test_hi = q_high_model.predict(X_test) + q_cqr

cov_cqr = coverage_score(y_test, test_lo, test_hi)
width_cqr = regression_mean_width_score(test_lo, test_hi)
print(f"CQR Coverage: {cov_cqr:.1%}, Mean Width: {width_cqr:.3f}")
`}),e.jsx(o,{references:[{title:"A Gentle Introduction to Conformal Prediction and Distribution-Free Uncertainty Quantification",authors:"Angelopoulos, A.N. & Bates, S.",year:2023,url:"https://arxiv.org/abs/2107.07511"},{title:"Conformalized Quantile Regression",authors:"Romano, Y., Patterson, E. & Candes, E.",year:2019,journal:"NeurIPS"},{title:"MAPIE: an open-source library for distribution-free uncertainty quantification",authors:"Taquet, V. et al.",year:2022,journal:"arXiv"}]})]})}const z=Object.freeze(Object.defineProperty({__proto__:null,default:w,metadata:p},Symbol.toStringTag,{value:"Module"})),u={title:"Adaptive Conformal Inference",difficulty:"advanced",readingTime:12,description:"Extend conformal prediction to non-exchangeable time series settings with adaptive methods that maintain valid coverage under distribution shift."};function M(){return e.jsxs(s,{title:"Adaptive Conformal Inference",metadata:u,children:[e.jsx("p",{children:"Split conformal prediction requires exchangeability — a condition violated by time series due to temporal dependence and distribution shift. Adaptive Conformal Inference (ACI) addresses this by dynamically adjusting the coverage threshold over time, maintaining long-run coverage even when the data distribution changes."}),e.jsxs(r,{title:"Adaptive Conformal Inference (ACI)",children:["ACI (Gibbs and Candes, 2021) maintains a running miscoverage rate ",e.jsx(t.InlineMath,{math:"\\alpha_t"})," that is updated after each observation:",e.jsx(t.BlockMath,{math:"\\alpha_{t+1} = \\alpha_t + \\gamma (\\alpha - \\text{err}_t)"}),"where ",e.jsx(t.InlineMath,{math:"\\text{err}_t = \\mathbf{1}[y_t \\notin \\hat{C}_t]"})," is the coverage error at time ",e.jsx(t.InlineMath,{math:"t"}),", and ",e.jsx(t.InlineMath,{math:"\\gamma > 0"})," is a step size controlling adaptation speed."]}),e.jsx("h2",{children:"Why Exchangeability Fails for Time Series"}),e.jsx("p",{children:"Standard conformal prediction assumes that calibration and test observations are exchangeable (i.e., their joint distribution is invariant to permutation). Time series violates this because:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Temporal dependence:"})," Recent observations are more informative than distant ones"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Distribution shift:"})," Seasonality, trend breaks, and regime changes alter the forecast error distribution"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Covariate shift:"})," Future covariates may differ from calibration-period covariates"]})]}),e.jsx("h2",{children:"The ACI Algorithm"}),e.jsxs("p",{children:["The update rule has an elegant interpretation: if the interval misses (",e.jsx(t.InlineMath,{math:"\\text{err}_t = 1"}),"), the effective alpha increases (wider intervals next round); if covered (",e.jsx(t.InlineMath,{math:"\\text{err}_t = 0"}),"), alpha decreases (narrower intervals). This is a gradient descent step on the pinball loss of the miscoverage rate."]}),e.jsx(t.BlockMath,{math:"\\alpha_{t+1} = \\alpha_t + \\gamma(\\alpha - \\mathbf{1}[y_t \\notin \\hat{C}_t])"}),e.jsxs(l,{title:"Long-Run Coverage of ACI",children:["Under mild conditions, ACI achieves ",e.jsx("strong",{children:"long-run marginal coverage"}),":",e.jsx(t.BlockMath,{math:"\\frac{1}{T} \\sum_{t=1}^{T} \\mathbf{1}[y_t \\in \\hat{C}_t] \\to 1 - \\alpha \\quad \\text{as } T \\to \\infty"}),"This holds regardless of the temporal dependence structure or distribution shift pattern. The step size ",e.jsx(t.InlineMath,{math:"\\gamma"})," controls the trade-off between responsiveness to recent changes and stability."]}),e.jsx("h2",{children:"EnbPI: Online Conformal for Time Series"}),e.jsx("p",{children:"Ensemble batch prediction intervals (EnbPI, Xu and Xie, 2021) adapts conformal prediction to online time series by:"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Training an ensemble of base models on bootstrap samples"}),e.jsx("li",{children:"Computing leave-one-out residuals as non-conformity scores"}),e.jsx("li",{children:"Maintaining a sliding window of residuals for the calibration set"}),e.jsx("li",{children:"Updating intervals as new observations arrive"})]}),e.jsx("p",{children:"EnbPI is particularly well-suited for forecasting under distribution shift because old calibration points are downweighted or discarded as the window moves forward."}),e.jsx("h2",{children:"Covariate-Conditional Coverage"}),e.jsxs("p",{children:["Marginal coverage averaged over time may mask poor coverage in specific regimes. For instance, during demand spikes, a conformal model might chronically miss. ",e.jsx("strong",{children:"Locally weighted conformal prediction"})," addresses this by weighting calibration scores by their similarity to the current test point:"]}),e.jsx(t.BlockMath,{math:"\\hat{q}(x) = \\text{Quantile}_{1-\\alpha}\\!\\left( s_1, \\ldots, s_n;\\ w(x, x_i) \\right)"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"w(x, x_i)"})," is a kernel weight measuring how similar calibration point",e.jsx(t.InlineMath,{math:"x_i"})," is to the test point ",e.jsx(t.InlineMath,{math:"x"}),". This provides",e.jsx("em",{children:"approximate"})," conditional coverage at the cost of wider intervals."]}),e.jsx(d,{title:"ACI in Electricity Demand Forecasting",children:"During a summer heatwave, an electricity demand forecasting model significantly underpredicts demand — its calibration set came from mild-weather periods. Standard conformal intervals miss repeatedly. ACI detects the sustained misses and widens intervals automatically within a few time steps, providing valid coverage even during the anomalous regime, without requiring model retraining."}),e.jsxs(a,{title:"Choosing the Step Size",children:["The step size ",e.jsx(t.InlineMath,{math:"\\gamma"})," controls adaptation speed. Too small a value means slow response to distribution shift; too large causes volatile interval widths that overreact to single observations. A common heuristic is ",e.jsx(t.InlineMath,{math:"\\gamma = 0.005"})," for daily data and ",e.jsx(t.InlineMath,{math:"\\gamma = 0.02"})," for weekly data. Cross-validation on historical shifts can help select an appropriate value."]}),e.jsx("h2",{children:"Practical Applications"}),e.jsx("p",{children:"Adaptive conformal methods are particularly valuable in:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Energy forecasting:"})," Daily/hourly intervals that adapt to seasonal regime changes"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Retail inventory:"})," Intervals that widen during promotional periods automatically"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Finance:"})," VaR (Value at Risk) estimates that respond to volatility clustering"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Healthcare monitoring:"})," Online vital sign prediction with patient-specific adaptation"]})]}),e.jsx("h2",{children:"Implementation: ACI for Time Series"}),e.jsx(n,{code:`import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor

# ── Generate non-stationary time series ──────────────────────────────────────
np.random.seed(42)
n = 500
t = np.arange(n)

# Distribution shift: variance doubles at t=300
noise = np.where(t < 300,
                 np.random.randn(n) * 2,
                 np.random.randn(n) * 5)  # sudden volatility increase
y = 20 + 0.05 * t + 4 * np.sin(2 * np.pi * t / 52) + noise

def make_features(series, lags=7):
    df = pd.DataFrame({'y': series})
    for lag in range(1, lags + 1):
        df[f'lag_{lag}'] = df['y'].shift(lag)
    df['t'] = np.arange(len(series))
    df['sin52'] = np.sin(2 * np.pi * df['t'] / 52)
    return df.dropna()

df_feat = make_features(y)
X = df_feat.drop('y', axis=1).values
y_clean = df_feat['y'].values

# Train on first 200 points
n_train = 200
X_train, y_train = X[:n_train], y_clean[:n_train]

model = GradientBoostingRegressor(n_estimators=100, max_depth=4)
model.fit(X_train, y_train)

# ── Standard Split Conformal (fixed width) ────────────────────────────────────
n_cal = 50
X_cal = X[n_train:n_train+n_cal]
y_cal = y_clean[n_train:n_train+n_cal]
cal_scores = np.abs(y_cal - model.predict(X_cal))
alpha = 0.1  # target 90% coverage
q_fixed = np.quantile(cal_scores, np.ceil((n_cal+1)*(1-alpha))/n_cal)
print(f"Fixed conformal threshold: {q_fixed:.3f}")

# ── Adaptive Conformal Inference (ACI) ───────────────────────────────────────
class AdaptiveConformal:
    def __init__(self, model, alpha=0.1, gamma=0.01, initial_scores=None):
        self.model = model
        self.alpha = alpha
        self.gamma = gamma
        self.alpha_t = alpha  # running effective alpha
        self.scores_window = list(initial_scores) if initial_scores is not None else []

    def get_threshold(self):
        if not self.scores_window:
            return 0.0
        q_level = np.ceil((len(self.scores_window)+1) * (1 - self.alpha_t))
        q_level = int(min(q_level, len(self.scores_window)))
        return np.sort(self.scores_window)[q_level - 1]

    def predict_interval(self, x):
        point = self.model.predict(x.reshape(1, -1))[0]
        q = self.get_threshold()
        return point - q, point + q

    def update(self, x, y_true):
        lo, hi = self.predict_interval(x)
        covered = lo <= y_true <= hi
        # ACI update rule
        err_t = 0 if covered else 1
        self.alpha_t = self.alpha_t + self.gamma * (self.alpha - err_t)
        self.alpha_t = np.clip(self.alpha_t, 0.001, 0.999)
        # Add new score to window
        point = self.model.predict(x.reshape(1, -1))[0]
        self.scores_window.append(abs(y_true - point))
        if len(self.scores_window) > 200:  # sliding window
            self.scores_window.pop(0)
        return covered

# ── Online evaluation: fixed vs adaptive ─────────────────────────────────────
aci = AdaptiveConformal(model, alpha=alpha, gamma=0.01,
                        initial_scores=cal_scores)

X_test = X[n_train+n_cal:]
y_test = y_clean[n_train+n_cal:]

fixed_misses = []
aci_misses   = []
aci_widths   = []
fixed_widths = []

for i, (xi, yi) in enumerate(zip(X_test, y_test)):
    # Fixed conformal
    point = model.predict(xi.reshape(1, -1))[0]
    f_lo, f_hi = point - q_fixed, point + q_fixed
    fixed_misses.append(int(not (f_lo <= yi <= f_hi)))
    fixed_widths.append(f_hi - f_lo)

    # ACI
    covered = aci.update(xi, yi)
    aci_misses.append(int(not covered))
    lo, hi = aci.predict_interval(xi)
    aci_widths.append(hi - lo)

# Coverage over full test set
fixed_cov = 1 - np.mean(fixed_misses)
aci_cov   = 1 - np.mean(aci_misses)
print(f"\\nTarget coverage: {1-alpha:.0%}")
print(f"Fixed conformal coverage: {fixed_cov:.1%}")
print(f"ACI coverage:             {aci_cov:.1%}")

# Coverage post-shift (t > 300 - n_train - n_cal)
shift_start = max(0, 300 - n_train - n_cal)
fixed_cov_post = 1 - np.mean(fixed_misses[shift_start:])
aci_cov_post   = 1 - np.mean(aci_misses[shift_start:])
print(f"\\nPost-shift coverage (t>300):")
print(f"Fixed: {fixed_cov_post:.1%}, ACI: {aci_cov_post:.1%}")
print(f"Mean ACI width: {np.mean(aci_widths):.3f}")
print(f"Mean fixed width: {np.mean(fixed_widths):.3f}")
`}),e.jsxs(i,{title:"EnbPI vs ACI",children:["ACI adapts the coverage level ",e.jsx(t.InlineMath,{math:"\\alpha_t"})," while keeping the calibration set fixed. EnbPI instead maintains a sliding window of recent residuals. ACI is simpler to implement and can be applied on top of any calibrated model; EnbPI requires an ensemble and is better suited for fully online learning settings."]}),e.jsx(o,{references:[{title:"Adaptive Conformal Inference Under Distribution Shift",authors:"Gibbs, I. & Candes, E.",year:2021,journal:"NeurIPS"},{title:"Conformal Prediction Intervals for Time Series",authors:"Xu, C. & Xie, Y.",year:2021,journal:"ICML"},{title:"Robust Conformal Prediction using Weighted Residuals",authors:"Tibshirani, R.J. et al.",year:2019,journal:"Journal of the American Statistical Association"}]})]})}const E=Object.freeze(Object.defineProperty({__proto__:null,default:M,metadata:u},Symbol.toStringTag,{value:"Module"})),f={title:"Bayesian Time Series",difficulty:"advanced",readingTime:15,description:"Understand Bayesian inference for time series, from prior specification to posterior predictive distributions, MCMC, and variational inference."};function T(){return e.jsxs(s,{title:"Bayesian Time Series",metadata:f,children:[e.jsxs("p",{children:["Bayesian inference provides a principled framework for incorporating prior knowledge, quantifying all sources of uncertainty, and updating beliefs as data arrives. For time series forecasting, the Bayesian approach naturally produces a ",e.jsx("em",{children:"posterior predictive distribution"})," that accounts for both observation noise and parameter uncertainty."]}),e.jsx("h2",{children:"Bayesian Inference Framework"}),e.jsx("p",{children:"The central object in Bayesian inference is the posterior distribution over model parameters:"}),e.jsx(t.BlockMath,{math:"p(\\theta \\mid y_{1:T}) = \\frac{p(y_{1:T} \\mid \\theta) \\, p(\\theta)}{p(y_{1:T})}"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"p(\\theta)"})," is the prior, ",e.jsx(t.InlineMath,{math:"p(y_{1:T} \\mid \\theta)"})," is the likelihood, and ",e.jsx(t.InlineMath,{math:"p(y_{1:T})"})," is the marginal likelihood (normalizing constant). For forecasting, we care about the ",e.jsx("strong",{children:"posterior predictive distribution"}),":"]}),e.jsx(t.BlockMath,{math:"p(y_{T+h} \\mid y_{1:T}) = \\int p(y_{T+h} \\mid \\theta) \\, p(\\theta \\mid y_{1:T}) \\, d\\theta"}),e.jsxs(r,{title:"Posterior Predictive Distribution",children:["The ",e.jsx("strong",{children:"posterior predictive distribution"})," marginalizes over parameter uncertainty: it is a mixture of forecast distributions, each weighted by how probable the corresponding parameters are given the observed data. This naturally produces wider prediction intervals than methods that condition on a single point estimate ",e.jsx(t.InlineMath,{math:"\\hat{\\theta}"}),"."]}),e.jsx("h2",{children:"Prior Specification"}),e.jsx("p",{children:"Choosing priors is one of the most important (and most debated) aspects of Bayesian modeling. Common strategies:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Weakly informative priors:"})," Regularize the model without strongly constraining inference. Example: ",e.jsx(t.InlineMath,{math:"\\beta \\sim \\mathcal{N}(0, 1)"})," for regression coefficients on standardized data."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Informative priors:"})," Encode domain knowledge. Example: for an AR(1) coefficient,",e.jsx(t.InlineMath,{math:"\\phi \\sim \\mathcal{U}(-1, 1)"})," enforces stationarity."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Hierarchical priors:"})," Pool information across related series, learning shared hyperparameters from the data."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reference/Jeffreys priors:"})," Objective, invariant priors for situations where no domain knowledge is available."]})]}),e.jsx(i,{title:"Sensitivity to Priors",children:"With sufficient data, the likelihood dominates and the posterior becomes insensitive to the prior (Bernstein–von Mises theorem). For short time series (common in business forecasting), priors matter substantially. Always check sensitivity by running inference under several prior choices."}),e.jsx("h2",{children:"Bayesian AR(1) Model"}),e.jsx("p",{children:"A simple example: the Bayesian AR(1) model specifies:"}),e.jsx(t.BlockMath,{math:"\\begin{aligned} \\phi &\\sim \\mathcal{N}(0, 0.5) \\\\ \\sigma &\\sim \\text{HalfNormal}(1) \\\\ y_t &= \\phi y_{t-1} + \\epsilon_t, \\quad \\epsilon_t \\sim \\mathcal{N}(0, \\sigma^2) \\end{aligned}"}),e.jsxs("p",{children:["The posterior ",e.jsx(t.InlineMath,{math:"p(\\phi, \\sigma \\mid y_{1:T})"})," is not available in closed form, so we need approximate inference methods."]}),e.jsx("h2",{children:"Markov Chain Monte Carlo (MCMC)"}),e.jsx("p",{children:"MCMC algorithms generate samples from the posterior distribution by constructing a Markov chain whose stationary distribution equals the posterior. The most common algorithms for Bayesian time series are:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"NUTS (No-U-Turn Sampler):"})," Hamiltonian Monte Carlo variant used by Stan and PyMC. Highly efficient for continuous parameters, adapts step size and trajectory length automatically."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Metropolis-Hastings:"})," General-purpose but slow for high-dimensional problems."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Gibbs Sampling:"})," Efficient when full conditionals are available (e.g., normal-normal models)."]})]}),e.jsx(t.BlockMath,{math:"\\hat{\\theta}^{(s+1)} \\sim q(\\theta \\mid \\hat{\\theta}^{(s)}), \\quad \\text{accept with prob. } \\min\\!\\left(1, \\frac{p(\\theta^*\\mid y)}{p(\\theta^{(s)}\\mid y)}\\right)"}),e.jsx("h2",{children:"Variational Inference"}),e.jsxs("p",{children:["When MCMC is too slow (e.g., large datasets or complex models), variational inference (VI) approximates the posterior with a tractable family ",e.jsx(t.InlineMath,{math:"q(\\theta; \\lambda)"}),":"]}),e.jsx(t.BlockMath,{math:"\\lambda^* = \\arg\\min_\\lambda \\text{KL}(q(\\theta; \\lambda) \\| p(\\theta \\mid y))"}),e.jsx("p",{children:"This is equivalent to maximizing the Evidence Lower Bound (ELBO):"}),e.jsx(t.BlockMath,{math:"\\text{ELBO}(\\lambda) = \\mathbb{E}_{q}[\\log p(y, \\theta)] - \\mathbb{E}_q[\\log q(\\theta; \\lambda)]"}),e.jsxs("p",{children:["Mean-field VI assumes independent factors: ",e.jsx(t.InlineMath,{math:"q(\\theta) = \\prod_i q_i(\\theta_i)"}),". Modern frameworks use stochastic VI with automatic differentiation (ADVI in Stan, Pyro, NumPyro)."]}),e.jsx(l,{title:"MCMC vs Variational Inference",children:"MCMC provides asymptotically exact samples from the posterior (given sufficient runtime), while VI provides a biased but faster approximation. For small-to-medium datasets, NUTS typically gives better coverage and is the preferred choice. VI scales to large datasets and is used when MCMC is computationally infeasible."}),e.jsx("h2",{children:"Advantages for Forecasting"}),e.jsx("p",{children:"Bayesian methods offer several unique advantages in forecasting contexts:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Full uncertainty quantification:"})," Prediction intervals automatically account for parameter uncertainty, yielding better coverage than MLE-based intervals."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Hierarchical modeling:"})," Naturally pool information across many related series, improving forecasts for low-data series."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Prior elicitation:"})," Expert knowledge can be formally incorporated, especially valuable when data is scarce."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Model comparison:"})," Bayesian model comparison via marginal likelihood (Bayes factors) or LOO-CV avoids overfitting."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Online updating:"})," The posterior from one period becomes the prior for the next, enabling principled sequential learning."]})]}),e.jsx(a,{title:"Computational Cost",children:"MCMC can be orders of magnitude slower than MLE for large datasets. A model that fits in seconds with statsmodels may require minutes or hours with PyMC via NUTS. Strategies to mitigate cost: vectorized operations on PyTensor/JAX, GPU acceleration, hierarchical approximations, and variational inference for first-pass estimates."}),e.jsx("h2",{children:"Introduction to PyMC"}),e.jsx(n,{code:`import numpy as np
import pymc as pm
import arviz as az
import pandas as pd

# ── Generate AR(2) time series ────────────────────────────────────────────────
np.random.seed(42)
T = 200
phi1_true, phi2_true = 0.6, -0.2
sigma_true = 1.5

y = np.zeros(T)
y[0], y[1] = 0, 0
for t in range(2, T):
    y[t] = phi1_true * y[t-1] + phi2_true * y[t-2] + np.random.normal(0, sigma_true)

# ── Bayesian AR(2) model in PyMC ──────────────────────────────────────────────
with pm.Model() as ar2_model:
    # Priors
    phi1 = pm.Normal('phi1', mu=0, sigma=0.5)
    phi2 = pm.Normal('phi2', mu=0, sigma=0.5)
    sigma = pm.HalfNormal('sigma', sigma=2)

    # AR(2) likelihood (vectorized)
    mu = phi1 * y[1:-1] + phi2 * y[:-2]
    likelihood = pm.Normal('y', mu=mu, sigma=sigma, observed=y[2:])

    # Sample from posterior using NUTS
    trace = pm.sample(
        draws=1000,
        tune=500,
        chains=2,
        target_accept=0.9,
        return_inferencedata=True,
        progressbar=False
    )

# ── Posterior summary ─────────────────────────────────────────────────────────
summary = az.summary(trace, var_names=['phi1', 'phi2', 'sigma'])
print(summary)
print(f"\\nTrue values: phi1={phi1_true}, phi2={phi2_true}, sigma={sigma_true}")

# ── Posterior predictive samples ──────────────────────────────────────────────
with ar2_model:
    # Out-of-sample forecasting by extending the model
    ppc = pm.sample_posterior_predictive(trace, progressbar=False)

print("\\nR-hat statistics (should be close to 1.0):")
print(az.summary(trace, var_names=['phi1', 'phi2', 'sigma'])['r_hat'])

# ── Simple manual posterior predictive forecast ───────────────────────────────
# Draw parameter samples from the posterior
phi1_samples = trace.posterior['phi1'].values.flatten()
phi2_samples = trace.posterior['phi2'].values.flatten()
sigma_samples = trace.posterior['sigma'].values.flatten()

n_samples = len(phi1_samples)
h = 12  # forecast horizon
forecast_paths = np.zeros((n_samples, h))

for s in range(n_samples):
    path = [y[-2], y[-1]]
    for i in range(h):
        next_val = (phi1_samples[s] * path[-1]
                   + phi2_samples[s] * path[-2]
                   + np.random.normal(0, sigma_samples[s]))
        path.append(next_val)
        forecast_paths[s, i] = path[-1]

# Posterior predictive intervals
lower_95 = np.percentile(forecast_paths, 2.5, axis=0)
upper_95 = np.percentile(forecast_paths, 97.5, axis=0)
median_fc = np.percentile(forecast_paths, 50, axis=0)

print("\\nForecast (median ± 95% PI):")
for h_i in range(1, 7):
    print(f"  h={h_i}: {median_fc[h_i-1]:.2f} [{lower_95[h_i-1]:.2f}, {upper_95[h_i-1]:.2f}]")
`}),e.jsx(o,{references:[{title:"Probabilistic Programming in Python using PyMC",authors:"Salvatier, J., Wiecki, T.V. & Fonnesbeck, C.",year:2016,journal:"PeerJ Computer Science"},{title:"Bayesian Data Analysis (3rd ed.)",authors:"Gelman, A., Carlin, J.B., Stern, H.S. et al.",year:2013,journal:"CRC Press"},{title:"Auto-Encoding Variational Bayes",authors:"Kingma, D.P. & Welling, M.",year:2014,journal:"ICLR"}]})]})}const N=Object.freeze(Object.defineProperty({__proto__:null,default:T,metadata:f},Symbol.toStringTag,{value:"Module"})),_={title:"Forecasting with PyMC",difficulty:"advanced",readingTime:14,description:"Build complete Bayesian time series models in PyMC with trend, seasonality, and structural components, then extract full probabilistic forecasts."};function S(){return e.jsxs(s,{title:"Forecasting with PyMC",metadata:_,children:[e.jsx("p",{children:"PyMC (formerly PyMC3) is a probabilistic programming library that lets you specify complex Bayesian models in Python and automatically sample from the posterior using NUTS. In this section, we build practical time series models with decomposable components — trend, seasonality, and regression effects — then extract full posterior predictive forecasts."}),e.jsx("h2",{children:"Structural Time Series Decomposition"}),e.jsx("p",{children:"A general structural model decomposes the time series into interpretable components:"}),e.jsx(t.BlockMath,{math:"y_t = \\mu_t + \\gamma_t + \\beta' x_t + \\epsilon_t"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\mu_t"})," is the trend, ",e.jsx(t.InlineMath,{math:"\\gamma_t"})," is the seasonal component, ",e.jsx(t.InlineMath,{math:"\\beta' x_t"})," captures covariate effects, and",e.jsx(t.InlineMath,{math:"\\epsilon_t \\sim \\mathcal{N}(0, \\sigma^2)"})," is observation noise. The Bayesian approach places priors on all unknown components and their evolution over time."]}),e.jsxs(r,{title:"Local Linear Trend",children:["A ",e.jsx("strong",{children:"local linear trend"})," allows both the level and slope to evolve stochastically:",e.jsx(t.BlockMath,{math:"\\mu_t = \\mu_{t-1} + \\nu_{t-1} + \\eta_t^{(\\mu)}"}),e.jsx(t.BlockMath,{math:"\\nu_t = \\nu_{t-1} + \\eta_t^{(\\nu)}"}),"where ",e.jsx(t.InlineMath,{math:"\\eta^{(\\mu)} \\sim \\mathcal{N}(0, \\sigma_\\mu^2)"})," and",e.jsx(t.InlineMath,{math:"\\eta^{(\\nu)} \\sim \\mathcal{N}(0, \\sigma_\\nu^2)"})," are innovation variances that control how quickly the level and slope can change."]}),e.jsx("h2",{children:"Fourier Seasonality in PyMC"}),e.jsxs("p",{children:["Seasonal patterns are efficiently represented using Fourier terms. For period ",e.jsx(t.InlineMath,{math:"P"}),", the K-th order Fourier representation uses ",e.jsx(t.InlineMath,{math:"2K"})," terms:"]}),e.jsx(t.BlockMath,{math:"\\gamma_t = \\sum_{k=1}^{K} \\left[ a_k \\cos\\!\\left(\\frac{2\\pi k t}{P}\\right) + b_k \\sin\\!\\left(\\frac{2\\pi k t}{P}\\right) \\right]"}),e.jsxs("p",{children:["The coefficients ",e.jsx(t.InlineMath,{math:"a_k, b_k"})," are given Gaussian priors. More Fourier terms allow more complex seasonal patterns at the cost of more parameters."]}),e.jsx(i,{title:"Choosing K for Fourier Seasonality",children:"Start with K = 3-5 for weekly or monthly data. Use LOO-CV (leave-one-out cross-validation) via ArviZ to compare models with different K. Increasing K beyond what the data supports leads to overfitting that the prior can mitigate but not eliminate."}),e.jsx("h2",{children:"Posterior Predictive Sampling"}),e.jsx("p",{children:"Out-of-sample forecasting in PyMC requires careful handling of the temporal structure. The recommended workflow:"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Fit the model on training data using ",e.jsx("code",{children:"pm.sample()"})]}),e.jsx("li",{children:"Define future time indices and Fourier features for the forecast period"}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"pm.Data"})," containers to swap in future features"]}),e.jsxs("li",{children:["Call ",e.jsx("code",{children:"pm.sample_posterior_predictive()"})," with the updated model context"]})]}),e.jsxs(d,{title:"Why Use pm.Data?",children:[e.jsx("code",{children:"pm.Data"})," creates a mutable container in the PyMC model graph. After sampling, you can call ",e.jsx("code",{children:"pm.set_data({'X': X_future})"})," to replace training covariates with future ones, then sample the posterior predictive without refitting the model. This is the standard pattern for out-of-sample prediction in PyMC."]}),e.jsx("h2",{children:"Complete PyMC Forecasting Model"}),e.jsx(n,{code:`import numpy as np
import pandas as pd
import pymc as pm
import pytensor.tensor as pt
import arviz as az

# ── Simulate weekly data with trend + seasonality ─────────────────────────────
np.random.seed(42)
T = 156  # 3 years of weekly data
t = np.arange(T)

trend_true = 50 + 0.3 * t
seasonal_true = 8 * np.sin(2 * np.pi * t / 52) + 3 * np.cos(4 * np.pi * t / 52)
y = trend_true + seasonal_true + np.random.normal(0, 3, T)

# Train on first 144 weeks, forecast last 12
n_train = 144
y_train = y[:n_train]
y_test  = y[n_train:]
t_train = t[:n_train]
t_future = t[n_train:]

# ── Helper: Fourier features ──────────────────────────────────────────────────
def fourier_features(t_arr, period, K):
    """Return (n, 2K) array of Fourier features."""
    features = []
    for k in range(1, K + 1):
        features.append(np.sin(2 * np.pi * k * t_arr / period))
        features.append(np.cos(2 * np.pi * k * t_arr / period))
    return np.column_stack(features)

K = 4  # Fourier order
period = 52  # annual seasonality

X_train_fourier  = fourier_features(t_train, period, K)
X_future_fourier = fourier_features(t_future, period, K)

# ── PyMC model: linear trend + Fourier seasonality ───────────────────────────
with pm.Model() as ts_model:
    # Mutable data containers for out-of-sample prediction
    t_data = pm.Data('t_data', t_train, dims='obs')
    X_data = pm.Data('X_data', X_train_fourier, dims=('obs', 'fourier'))

    # Trend priors
    alpha = pm.Normal('alpha', mu=50, sigma=20)      # intercept
    beta  = pm.Normal('beta',  mu=0,  sigma=1)       # slope

    # Seasonality priors
    fourier_coefs = pm.Normal('fourier_coefs', mu=0, sigma=5, shape=2*K)

    # Observation noise
    sigma = pm.HalfNormal('sigma', sigma=5)

    # Deterministic mean
    trend    = alpha + beta * t_data
    seasonal = pm.math.dot(X_data, fourier_coefs)
    mu       = trend + seasonal

    # Likelihood
    obs = pm.Normal('obs', mu=mu, sigma=sigma, observed=y_train, dims='obs')

    # ── Fit ───────────────────────────────────────────────────────────────────
    trace = pm.sample(
        draws=1000, tune=500, chains=2,
        target_accept=0.9,
        return_inferencedata=True,
        progressbar=False
    )

# ── Out-of-sample forecast ────────────────────────────────────────────────────
with ts_model:
    pm.set_data({'t_data': t_future, 'X_data': X_future_fourier})
    ppc = pm.sample_posterior_predictive(trace, var_names=['obs'], progressbar=False)

fc_samples = ppc.posterior_predictive['obs'].values.reshape(-1, len(t_future))

lower_80 = np.percentile(fc_samples, 10, axis=0)
upper_80 = np.percentile(fc_samples, 90, axis=0)
lower_95 = np.percentile(fc_samples, 2.5, axis=0)
upper_95 = np.percentile(fc_samples, 97.5, axis=0)
median_fc = np.percentile(fc_samples, 50, axis=0)

# Evaluate
mae = np.mean(np.abs(y_test - median_fc))
cov_95 = np.mean((y_test >= lower_95) & (y_test <= upper_95))
cov_80 = np.mean((y_test >= lower_80) & (y_test <= upper_80))
print(f"MAE: {mae:.3f}")
print(f"80% PI coverage: {cov_80:.1%}  (target: 80%)")
print(f"95% PI coverage: {cov_95:.1%}  (target: 95%)")

# ── Model diagnostics ─────────────────────────────────────────────────────────
print("\\nPosterior summary:")
print(az.summary(trace, var_names=['alpha', 'beta', 'sigma']))

# LOO cross-validation for model comparison
loo = az.loo(trace, ts_model)
print(f"\\nLOO-CV ELPD: {loo.elpd_loo:.2f} ± {loo.se:.2f}")

# ── Hierarchical model for multiple series ────────────────────────────────────
# (Sketch: shared hyperpriors across N series)
N_series = 5
y_panel = np.stack([y_train + np.random.normal(0, 5) for _ in range(N_series)])

with pm.Model() as hier_model:
    # Hyperpriors
    mu_alpha = pm.Normal('mu_alpha', mu=50, sigma=20)
    sigma_alpha = pm.HalfNormal('sigma_alpha', sigma=10)
    mu_beta = pm.Normal('mu_beta', mu=0, sigma=1)
    sigma_beta = pm.HalfNormal('sigma_beta', sigma=0.5)

    # Per-series priors (non-centered parameterization)
    alpha_offset = pm.Normal('alpha_offset', mu=0, sigma=1, shape=N_series)
    beta_offset  = pm.Normal('beta_offset',  mu=0, sigma=1, shape=N_series)

    alpha_s = pm.Deterministic('alpha_s', mu_alpha + sigma_alpha * alpha_offset)
    beta_s  = pm.Deterministic('beta_s',  mu_beta  + sigma_beta  * beta_offset)

    sigma_obs = pm.HalfNormal('sigma_obs', sigma=5)

    for i in range(N_series):
        mu_i = alpha_s[i] + beta_s[i] * t_train
        pm.Normal(f'y_{i}', mu=mu_i, sigma=sigma_obs, observed=y_panel[i])

    hier_trace = pm.sample(500, tune=300, chains=2, progressbar=False,
                           return_inferencedata=True)

print("\\nHierarchical model alpha estimates per series:")
print(az.summary(hier_trace, var_names=['alpha_s'])['mean'].values)
`}),e.jsxs(a,{title:"Divergences and Model Reparameterization",children:['NUTS samplers report "divergences" when the sampler encounters regions of high curvature in the posterior. Divergences indicate unreliable samples. Common fixes:',e.jsxs("ul",{children:[e.jsxs("li",{children:["Increase ",e.jsx("code",{children:"target_accept"})," (try 0.95 or 0.99)"]}),e.jsx("li",{children:"Use non-centered parameterization for hierarchical models"}),e.jsx("li",{children:"Tighten or reparameterize priors"}),e.jsx("li",{children:"Check for model misspecification (plot prior/posterior predictive checks)"})]})]}),e.jsx(o,{references:[{title:"PyMC: A Modern and Comprehensive Probabilistic Programming Framework",authors:"Abril-Pla, O. et al.",year:2023,journal:"PeerJ Computer Science"},{title:"Forecasting at Scale (Prophet)",authors:"Taylor, S.J. & Letham, B.",year:2018,journal:"The American Statistician"},{title:"Bayesian Time Series Analysis with PyMC3",authors:"Martin, O., Kumar, R. & Lao, J.",year:2022,journal:"Bayesian Analysis with Python (book)"}]})]})}const X=Object.freeze(Object.defineProperty({__proto__:null,default:S,metadata:_},Symbol.toStringTag,{value:"Module"})),g={title:"Bayesian Structural Time Series (BSTS)",difficulty:"advanced",readingTime:14,description:"Master Bayesian state space models with spike-and-slab priors, and apply them to counterfactual causal inference with CausalImpact."};function k(){return e.jsxs(s,{title:"Bayesian Structural Time Series (BSTS)",metadata:g,children:[e.jsx("p",{children:'Bayesian Structural Time Series (BSTS) combines state space modeling with Bayesian inference, providing a flexible framework for decomposing time series into interpretable components while quantifying uncertainty. Developed at Google, BSTS is particularly powerful for counterfactual causal inference — answering "what would have happened if the intervention had not occurred?"'}),e.jsx("h2",{children:"State Space Formulation"}),e.jsx("p",{children:"The BSTS model consists of two equations: an observation equation and a state transition equation:"}),e.jsx(t.BlockMath,{math:"\\text{Observation: } y_t = Z_t' \\alpha_t + \\epsilon_t, \\quad \\epsilon_t \\sim \\mathcal{N}(0, \\sigma_\\epsilon^2)"}),e.jsx(t.BlockMath,{math:"\\text{Transition: } \\alpha_{t+1} = T_t \\alpha_t + R_t \\eta_t, \\quad \\eta_t \\sim \\mathcal{N}(0, Q_t)"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\alpha_t"})," is the latent state vector, ",e.jsx(t.InlineMath,{math:"Z_t"})," maps states to observations, and ",e.jsx(t.InlineMath,{math:"T_t"})," is the state transition matrix. Different model components (trend, seasonality, regression) correspond to specific block structures in these matrices."]}),e.jsxs(r,{title:"Local Level Model (Unobserved Components)",children:["The simplest BSTS model: a random-walk level with observation noise:",e.jsx(t.BlockMath,{math:"y_t = \\mu_t + \\epsilon_t, \\quad \\epsilon_t \\sim \\mathcal{N}(0, \\sigma_\\epsilon^2)"}),e.jsx(t.BlockMath,{math:"\\mu_{t+1} = \\mu_t + \\eta_t, \\quad \\eta_t \\sim \\mathcal{N}(0, \\sigma_\\eta^2)"}),"The ratio ",e.jsx(t.InlineMath,{math:"\\sigma_\\eta^2 / \\sigma_\\epsilon^2"})," controls the signal-to-noise ratio: high values allow rapid level changes (flexible but noisy); low values enforce smoothness."]}),e.jsx("h2",{children:"Spike-and-Slab Priors for Variable Selection"}),e.jsx("p",{children:"When many covariates are available, BSTS uses spike-and-slab priors to simultaneously perform variable selection and estimation. Each regression coefficient is modeled as:"}),e.jsx(t.BlockMath,{math:"\\beta_j \\sim (1 - \\pi_j)\\delta_0 + \\pi_j \\mathcal{N}(0, \\tau^2)"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"\\pi_j \\in [0,1]"})," is the inclusion probability (slab weight),",e.jsx(t.InlineMath,{math:"\\delta_0"})," is a point mass at zero (spike), and ",e.jsx(t.InlineMath,{math:"\\mathcal{N}(0, \\tau^2)"}),"is the slab distribution. The posterior inclusion probability (PIP) measures how much evidence the data provides for including each variable."]}),e.jsxs(l,{title:"Spike-and-Slab for Automatic Variable Selection",children:["The spike-and-slab prior induces ",e.jsx("strong",{children:"automatic sparsity"}),": variables with low predictive value get posterior inclusion probabilities close to zero, effectively excluding them from the model. This is Bayesian LASSO on steroids, providing both the regularization effect and full uncertainty quantification about which variables matter."]}),e.jsx("h2",{children:"CausalImpact: Counterfactual Analysis"}),e.jsxs("p",{children:["CausalImpact (Brodersen et al., 2015) uses BSTS for causal inference about interventions. The key idea: fit a BSTS model on the pre-intervention period using control series as covariates, then forecast what the treated series ",e.jsx("em",{children:"would have been"})," had the intervention not occurred. The causal effect is estimated as:"]}),e.jsx(t.BlockMath,{math:"\\hat{\\tau}_t = y_t - \\hat{y}_t^{counterfactual}, \\quad t > T_0"}),e.jsxs("p",{children:["where ",e.jsx(t.InlineMath,{math:"T_0"})," is the intervention date. The BSTS posterior provides full uncertainty intervals for the counterfactual, enabling hypothesis testing for the treatment effect."]}),e.jsxs(d,{title:"Marketing Campaign Analysis with CausalImpact",children:["A retailer launches a promotion on week 20. To estimate the incremental sales lift, they:",e.jsxs("ol",{children:[e.jsx("li",{children:"Select control markets that did not receive the promotion"}),e.jsx("li",{children:"Fit a BSTS model on weeks 1-19 with control market sales as covariates"}),e.jsx("li",{children:"Use the posterior to forecast weeks 20-30 as the counterfactual"}),e.jsx("li",{children:"Compare actual sales to the counterfactual to estimate the causal lift"})]}),"The Bayesian uncertainty bands on the counterfactual provide statistically rigorous confidence intervals for the estimated treatment effect."]}),e.jsx("h2",{children:"Applications in Marketing and Business"}),e.jsx("p",{children:"BSTS and CausalImpact are widely used in industry for:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Marketing mix modeling:"})," Attributing sales lift to advertising channels"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"A/B test analysis:"})," When randomization is imperfect or control is observational"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Policy evaluation:"})," Estimating effects of business decisions (price changes, product launches)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Anomaly detection:"})," Identifying periods where actuals diverge significantly from model expectations"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Demand forecasting:"})," With automatic variable selection from dozens of potential predictors"]})]}),e.jsx(a,{title:"Parallel Trend Assumption",children:"CausalImpact's validity rests on the assumption that, in the absence of the intervention, the treated series would have evolved in parallel with the control series (adjusted by the fitted model). If controls are affected by the intervention (spillovers) or if the treated unit has unique unmodeled factors, the counterfactual will be biased. Always validate the pre-period model fit carefully."}),e.jsx("h2",{children:"Implementation with Orbit (Python BSTS)"}),e.jsx(n,{code:`import numpy as np
import pandas as pd

# ── Simulate treated and control series ──────────────────────────────────────
np.random.seed(42)
T = 100
T0 = 70  # intervention at week 70

t = np.arange(T)
# Control series
control1 = 50 + 0.4 * t + 5 * np.sin(2 * np.pi * t / 52) + np.random.randn(T) * 3
control2 = 30 + 0.2 * t + 3 * np.cos(2 * np.pi * t / 52) + np.random.randn(T) * 2

# Treated series: follows controls pre-intervention, then gets a +10 lift
treatment_effect = np.where(t >= T0, 10, 0)
treated = (0.8 * control1 + 0.3 * control2 + 5
           + 0.15 * t + treatment_effect + np.random.randn(T) * 2)

dates = pd.date_range('2021-01-01', periods=T, freq='W')
df = pd.DataFrame({
    'date': dates,
    'y': treated,
    'control1': control1,
    'control2': control2,
})
df_pre  = df[df['date'] < dates[T0]]
df_post = df[df['date'] >= dates[T0]]

# ── Orbit: Bayesian time series library ──────────────────────────────────────
# pip install orbit-ml
try:
    from orbit.models import LGT
    from orbit.diagnostics.metrics import smape

    orbit_model = LGT(
        response_col='y',
        date_col='date',
        regressor_col=['control1', 'control2'],
        seasonality=52,
        seed=42,
    )
    orbit_model.fit(df=df_pre)
    predicted = orbit_model.predict(df=df)
    print("Orbit LGT predictions shape:", predicted.shape)
except ImportError:
    print("orbit-ml not installed. Showing manual BSTS sketch instead.")

# ── Manual BSTS sketch with PyMC ─────────────────────────────────────────────
import pymc as pm

X_pre  = df_pre[['control1', 'control2']].values
y_pre  = df_pre['y'].values
X_post = df_post[['control1', 'control2']].values
t_pre  = np.arange(len(y_pre))

with pm.Model() as bsts_model:
    # Spike-and-slab style: inclusion indicators
    pi = pm.Beta('pi', alpha=1, beta=1, shape=2)
    gamma = pm.Bernoulli('gamma', p=pi, shape=2)

    # Regression coefficients
    beta_raw = pm.Normal('beta_raw', mu=0, sigma=2, shape=2)
    beta = pm.Deterministic('beta', gamma * beta_raw)

    # Local level
    sigma_level = pm.HalfNormal('sigma_level', sigma=1)
    level_innovations = pm.Normal('level_innov', mu=0, sigma=sigma_level, shape=len(y_pre))
    level = pm.Deterministic('level', pm.math.cumsum(level_innovations))

    # Observation noise
    sigma_obs = pm.HalfNormal('sigma_obs', sigma=3)

    mu = level + pm.math.dot(X_pre, beta)
    obs = pm.Normal('obs', mu=mu, sigma=sigma_obs, observed=y_pre)

    trace = pm.sample(500, tune=300, chains=2, progressbar=False,
                      return_inferencedata=True)

# ── Post-intervention counterfactual (simplified) ─────────────────────────────
import arviz as az

# Get posterior inclusion probabilities
gamma_post = trace.posterior['gamma'].values.reshape(-1, 2)
pip = gamma_post.mean(axis=0)
print(f"\\nPosterior Inclusion Probabilities: control1={pip[0]:.3f}, control2={pip[1]:.3f}")

# Posterior beta samples
beta_samples = trace.posterior['beta'].values.reshape(-1, 2)

# Generate counterfactual forecasts
n_samples = beta_samples.shape[0]
h_post = len(df_post)
counterfactual_samples = np.zeros((n_samples, h_post))

for s in range(n_samples):
    counterfactual_samples[s] = X_post @ beta_samples[s]

cf_median = np.median(counterfactual_samples, axis=0)
cf_lower  = np.percentile(counterfactual_samples, 2.5, axis=0)
cf_upper  = np.percentile(counterfactual_samples, 97.5, axis=0)

# Estimated causal effect
y_post_actual = df_post['y'].values
effect_median = y_post_actual - cf_median
effect_lower  = y_post_actual - cf_upper
effect_upper  = y_post_actual - cf_lower

cumulative_effect = effect_median.sum()
print(f"\\nEstimated cumulative causal effect: {cumulative_effect:.2f}")
print(f"True effect (sum): {treatment_effect[T0:].sum():.2f}")
`}),e.jsxs(i,{title:"Python BSTS Libraries",children:["The original BSTS implementation is in R (the ",e.jsx("code",{children:"bsts"})," package by Steven Scott). Python alternatives include:",e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Orbit:"})," Production-ready Bayesian time series by Uber, supports BSTS-style models"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"PyMC:"})," Custom BSTS models with full flexibility"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"tfp (TensorFlow Probability):"})," ",e.jsx("code",{children:"sts"})," module with GPU acceleration"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"pycausalimpact:"})," Python port of the R CausalImpact package"]})]})]}),e.jsx(o,{references:[{title:"Inferring Causal Impact Using Bayesian Structural Time-Series Models",authors:"Brodersen, K.H. et al.",year:2015,journal:"Annals of Applied Statistics"},{title:"Predicting the Present with Bayesian Structural Time Series",authors:"Scott, S.L. & Varian, H.R.",year:2014,journal:"International Journal of Mathematical Modelling and Numerical Optimisation"},{title:"Orbit: Probabilistic Forecast with Exponential Smoothing",authors:"Ng, E. et al.",year:2020,journal:"arXiv"}]})]})}const G=Object.freeze(Object.defineProperty({__proto__:null,default:k,metadata:g},Symbol.toStringTag,{value:"Module"})),x={title:"Forecast Combination",difficulty:"intermediate",readingTime:11,description:"Understand why combining forecasts consistently outperforms individual models, and implement simple average, trimmed mean, and optimal Bates-Granger combination."};function I(){return e.jsxs(s,{title:"Forecast Combination",metadata:x,children:[e.jsx("p",{children:'One of the most robust findings in forecasting research is that combining forecasts from multiple models typically outperforms any individual model. This "wisdom of crowds" effect is not accidental — it has a solid theoretical basis rooted in bias-variance decomposition and portfolio diversification.'}),e.jsx("h2",{children:"Why Combination Works"}),e.jsx("p",{children:"Each individual model captures some aspects of the data generating process while missing others. Combination reduces forecast error through two mechanisms:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Variance reduction:"})," If ",e.jsx(t.InlineMath,{math:"N"})," forecasts have equal variance",e.jsx(t.InlineMath,{math:"\\sigma^2"})," and zero pairwise correlation, the ensemble variance is",e.jsx(t.InlineMath,{math:"\\sigma^2 / N"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bias reduction:"})," Models with opposite biases partially cancel when combined."]})]}),e.jsx(t.BlockMath,{math:"\\text{MSE}(\\bar{f}) \\leq \\frac{1}{N}\\sum_{i=1}^N \\text{MSE}(f_i)"}),e.jsx("p",{children:"The inequality holds exactly when the forecasts are unbiased and uncorrelated. In practice, forecasts from different model classes (e.g., statistical vs. ML) tend to have low correlation, making combination particularly effective."}),e.jsxs(l,{title:"Bates-Granger Optimal Combination",children:["Given two unbiased forecasts ",e.jsx(t.InlineMath,{math:"f_1, f_2"})," with variances",e.jsx(t.InlineMath,{math:"\\sigma_1^2, \\sigma_2^2"})," and covariance ",e.jsx(t.InlineMath,{math:"\\sigma_{12}"}),", the optimal linear combination ",e.jsx(t.InlineMath,{math:"\\hat{y} = w f_1 + (1-w) f_2"})," minimizes MSE with:",e.jsx(t.BlockMath,{math:"w^* = \\frac{\\sigma_2^2 - \\sigma_{12}}{\\sigma_1^2 + \\sigma_2^2 - 2\\sigma_{12}}"}),"When the forecasts are uncorrelated, this simplifies to the inverse-variance weighting:",e.jsx(t.BlockMath,{math:"w_i \\propto 1 / \\sigma_i^2"})]}),e.jsx("h2",{children:"Simple Combination Methods"}),e.jsxs(r,{title:"Equal-Weight Average",children:["The ",e.jsx("strong",{children:"simple average"})," assigns equal weight to all models:",e.jsx(t.BlockMath,{math:"\\hat{y}_t^{combo} = \\frac{1}{N} \\sum_{i=1}^N \\hat{y}_t^{(i)}"}),"Despite its simplicity, the equal-weight average is remarkably competitive with more sophisticated methods, especially when the number of models is large and errors are estimation noise."]}),e.jsx("p",{children:"More sophisticated methods include:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Trimmed mean:"})," Remove the top and bottom ",e.jsx(t.InlineMath,{math:"k\\%"})," of forecasts before averaging, reducing the influence of outlier models."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Median:"})," The sample median is robust to outlier forecasts and automatically downweights extreme values, equivalent to 50% trimming."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Variance-weighted average:"})," Weight models inversely by their out-of-sample variance. Estimated from a hold-out window."]})]}),e.jsx(i,{title:"The Forecast Combination Puzzle",children:"Despite theoretical arguments for estimated optimal weights, empirical studies (including the M4 competition) consistently show that simple averages outperform or match more complex combination methods. Estimated optimal weights suffer from overfitting when the weight estimation sample is limited. The simple average is a safe default and a strong baseline."}),e.jsx("h2",{children:"Regression-Based Combination"}),e.jsx("p",{children:"Granger-Ramanathan (1984) suggested combining via OLS regression on the individual forecasts:"}),e.jsx(t.BlockMath,{math:"\\hat{y}_t = \\alpha + \\sum_{i=1}^N w_i f_t^{(i)} + \\epsilon_t"}),e.jsxs("p",{children:["The weights are estimated from past data and may not sum to one (allowing for overall bias correction via ",e.jsx(t.InlineMath,{math:"\\alpha"}),"). A constrained version requiring",e.jsx(t.InlineMath,{math:"\\sum w_i = 1, w_i \\geq 0"})," is more robust for small estimation samples."]}),e.jsx(a,{title:"Overfitting in Regression Combination",children:"With N models and limited history, OLS combination can overfit. Regularization (Ridge, Lasso) or constraint to non-negative weights is essential. A rule of thumb: use regression combination only when the estimation sample has at least 5-10× more observations than models."}),e.jsx("h2",{children:"Implementation: Combining Multiple Models"}),e.jsx(n,{code:`import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_absolute_error
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA, AutoETS, SeasonalNaive, Theta

# ── Generate panel data ───────────────────────────────────────────────────────
np.random.seed(42)
T = 200
n_series = 30
horizon = 12

records = []
for sid in range(n_series):
    t = np.arange(T)
    y = (np.random.uniform(50, 200)
         + 0.2 * t
         + 10 * np.sin(2 * np.pi * t / 52)
         + np.random.randn(T) * 5)
    dates = pd.date_range('2019-01-01', periods=T, freq='W')
    for d, v in zip(dates, y):
        records.append({'unique_id': f'S{sid:03d}', 'ds': d, 'y': v})

df = pd.DataFrame(records)
df_train = df.groupby('unique_id').apply(
    lambda x: x.iloc[:-horizon]).reset_index(drop=True)
df_test = df.groupby('unique_id').apply(
    lambda x: x.iloc[-horizon:]).reset_index(drop=True)

# ── Fit models with StatsForecast ─────────────────────────────────────────────
sf = StatsForecast(
    models=[
        AutoARIMA(season_length=52),
        AutoETS(season_length=52),
        Theta(season_length=52),
        SeasonalNaive(season_length=52),
    ],
    freq='W',
    n_jobs=-1
)
sf.fit(df_train)
forecasts = sf.predict(h=horizon)

# Merge with actuals
merged = forecasts.merge(
    df_test[['unique_id', 'ds', 'y']],
    on=['unique_id', 'ds']
)

model_cols = ['AutoARIMA', 'AutoETS', 'Theta', 'SeasonalNaive']

# ── Individual model MAE ──────────────────────────────────────────────────────
print("Individual model MAE:")
for col in model_cols:
    mae = mean_absolute_error(merged['y'], merged[col])
    print(f"  {col}: {mae:.3f}")

# ── Simple Average ────────────────────────────────────────────────────────────
merged['simple_avg'] = merged[model_cols].mean(axis=1)
mae_avg = mean_absolute_error(merged['y'], merged['simple_avg'])
print(f"\\nSimple Average MAE: {mae_avg:.3f}")

# ── Trimmed Mean (remove best and worst) ─────────────────────────────────────
def trimmed_mean(row, cols, trim_pct=0.25):
    vals = sorted(row[cols].values)
    k = max(1, int(len(vals) * trim_pct))
    return np.mean(vals[k:-k])

merged['trimmed_mean'] = merged.apply(trimmed_mean, cols=model_cols, axis=1)
mae_trim = mean_absolute_error(merged['y'], merged['trimmed_mean'])
print(f"Trimmed Mean MAE:   {mae_trim:.3f}")

# ── Median Combination ────────────────────────────────────────────────────────
merged['median'] = merged[model_cols].median(axis=1)
mae_med = mean_absolute_error(merged['y'], merged['median'])
print(f"Median MAE:         {mae_med:.3f}")

# ── Inverse-Variance Weighting ────────────────────────────────────────────────
# Use first 50% of test data to estimate per-model variance
n_val = len(merged) // 2
val = merged.iloc[:n_val]
holdout = merged.iloc[n_val:]

variances = {col: np.var(val['y'] - val[col]) for col in model_cols}
inv_var_weights = {col: 1/v for col, v in variances.items()}
total_weight = sum(inv_var_weights.values())
norm_weights = {col: w / total_weight for col, w in inv_var_weights.items()}

print("\\nInverse-variance weights:", {k: f"{v:.3f}" for k, v in norm_weights.items()})

holdout = holdout.copy()
holdout['inv_var_combo'] = sum(holdout[col] * w for col, w in norm_weights.items())
mae_iv = mean_absolute_error(holdout['y'], holdout['inv_var_combo'])
print(f"Inv-Variance Combo MAE: {mae_iv:.3f}")

# ── Bates-Granger Optimal (Ridge regression) ──────────────────────────────────
X_val = val[model_cols].values
y_val = val['y'].values
X_hold = holdout[model_cols].values
y_hold = holdout['y'].values

ridge = Ridge(alpha=10, fit_intercept=True, positive=True)
ridge.fit(X_val, y_val)
bg_preds = ridge.predict(X_hold)
mae_bg = mean_absolute_error(y_hold, bg_preds)
print(f"Ridge (BG) Combo MAE:   {mae_bg:.3f}")
print(f"Ridge weights: {dict(zip(model_cols, ridge.coef_.round(3)))}")
`}),e.jsx(d,{title:"M4 Competition Findings",children:"In the M4 competition (2018), the winning hybrid ES-RNN model used a combination of exponential smoothing and neural networks. More importantly, the submission ranked 9th (FFORMS ensemble) used only simple averages of classical models and outperformed 95% of submissions — demonstrating the power of intelligent combination over complex single models."}),e.jsx(o,{references:[{title:"The Combination of Forecasts",authors:"Bates, J.M. & Granger, C.W.J.",year:1969,journal:"Operational Research Quarterly"},{title:"Improved Methods of Combining Forecasts",authors:"Granger, C.W.J. & Ramanathan, R.",year:1984,journal:"Journal of Forecasting"},{title:"The M4 Competition: Results, Findings, Conclusion and Way Forward",authors:"Makridakis, S., Spiliotis, E. & Assimakopoulos, V.",year:2018,journal:"International Journal of Forecasting"}]})]})}const L=Object.freeze(Object.defineProperty({__proto__:null,default:I,metadata:x},Symbol.toStringTag,{value:"Module"})),y={title:"Stacking and Meta-Learning",difficulty:"advanced",readingTime:12,description:"Implement stacking (stacked generalization) for time series: generate level-1 predictions with time-series-aware cross-validation, then train a meta-learner."};function C(){return e.jsxs(s,{title:"Stacking and Meta-Learning",metadata:y,children:[e.jsxs("p",{children:["Stacking (Wolpert, 1992), also called stacked generalization, is a systematic approach to combining models that goes beyond fixed-weight averaging. A ",e.jsx("em",{children:"meta-learner"})," is trained on the predictions of base models, learning to weight and correct them in a data-adaptive way. Applied carefully to time series, stacking can significantly outperform individual models."]}),e.jsxs(r,{title:"Stacking Architecture",children:["A stacking ensemble has two levels:",e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Level-1 (base learners):"})," A set of diverse forecasting models",e.jsx(t.InlineMath,{math:"f_1, \\ldots, f_N"})," trained independently."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Level-2 (meta-learner):"})," A model ",e.jsx(t.InlineMath,{math:"g"})," trained on the out-of-sample predictions of the level-1 models:",e.jsx(t.BlockMath,{math:"\\hat{y}_t = g(f_1(x_t), \\ldots, f_N(x_t))"})]})]}),"The key insight is that the meta-learner can learn non-linear relationships between base model predictions, including when each model is trustworthy."]}),e.jsx("h2",{children:"Time-Series-Aware Stacking"}),e.jsx("p",{children:"Standard k-fold cross-validation uses random splits that would cause data leakage in time series. For valid out-of-fold predictions, we must use temporal cross-validation (TimeSeriesSplit):"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Split the training data into ",e.jsx(t.InlineMath,{math:"K"})," temporal folds"]}),e.jsxs("li",{children:["For each fold ",e.jsx(t.InlineMath,{math:"k"}),": train each base model on folds 1 to k-1, predict fold k"]}),e.jsx("li",{children:"Collect all out-of-fold predictions to form the meta-feature matrix"}),e.jsx("li",{children:"Train the meta-learner on these meta-features against the true targets"})]}),e.jsx("p",{children:"This process ensures no data leakage: each out-of-fold prediction is made by a model that has never seen the target values it predicts."}),e.jsx(a,{title:"Data Leakage in Time Series Stacking",children:"Using standard k-fold cross-validation for generating level-1 predictions in time series allows the model trained on future data to predict past data, introducing information leakage. This produces overly optimistic meta-learner training and poor generalization. Always use walk-forward or expanding window validation."}),e.jsx("h2",{children:"Meta-Learner Choices"}),e.jsx("p",{children:"The meta-learner should be simple enough to avoid overfitting the meta-features:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Linear regression (constrained):"})," Fastest, most interpretable. Use non-negative weights to prevent negative combination coefficients."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Ridge regression:"})," Regularized linear combination, good default."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"LightGBM:"})," Can learn non-linear interaction effects between model predictions, useful when models excel in different regimes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Elastic Net:"})," L1 + L2 regularization, automatically performs model selection."]})]}),e.jsx("h2",{children:"Boosted Hybrid Approach"}),e.jsx("p",{children:"An alternative to pure stacking is the boosted hybrid: fit a statistical model first (e.g., ETS), then train a machine learning model on the residuals. The final forecast is:"}),e.jsx(t.BlockMath,{math:"\\hat{y}_{t+h} = \\hat{y}_{t+h}^{\\text{ETS}} + \\hat{r}_{t+h}^{\\text{ML}}"}),e.jsx("p",{children:"This approach is particularly effective because:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"The statistical model handles trend and seasonality reliably"}),e.jsx("li",{children:"The ML model captures non-linear patterns and covariate effects in residuals"}),e.jsx("li",{children:"Residuals often have smaller scale and are easier to model"})]}),e.jsx("h2",{children:"Online Learning Combination"}),e.jsx("p",{children:"When the distribution changes over time, static stacking weights become outdated. Online learning methods update combination weights in real-time:"}),e.jsx(t.BlockMath,{math:"w_i^{(t+1)} = w_i^{(t)} \\cdot \\exp(-\\eta \\cdot \\ell(y_t, f_i^{(t)}))"}),e.jsx("p",{children:"This exponential weighting scheme (Exponentiated Gradient, EG) increases weights for models performing well and decreases those performing poorly. It adapts to regime changes automatically."}),e.jsxs(d,{title:"When Stacking Adds Most Value",children:["Stacking is most beneficial when:",e.jsxs("ul",{children:[e.jsx("li",{children:"Base models are diverse (different model families, not just hyperparameter variants)"}),e.jsx("li",{children:"Different models excel in different regimes (e.g., ARIMA in stable periods, ML during promotions)"}),e.jsx("li",{children:"Sufficient out-of-fold data is available to train the meta-learner robustly"}),e.jsx("li",{children:"The meta-learner has access to meta-features (series ID, time of year, etc.) beyond just model predictions"})]})]}),e.jsx(n,{code:`import numpy as np
import pandas as pd
from sklearn.model_selection import TimeSeriesSplit
from sklearn.linear_model import Ridge, LinearRegression
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error
import lightgbm as lgb

# ── Generate training data ────────────────────────────────────────────────────
np.random.seed(42)
T = 500
t = np.arange(T)
y = (100
     + 0.2 * t
     + 15 * np.sin(2 * np.pi * t / 52)
     + 5  * np.sin(4 * np.pi * t / 52)
     + np.random.randn(T) * 6)

def make_features(series, lags=range(1, 15)):
    df = pd.DataFrame({'y': series})
    for lag in lags:
        df[f'lag_{lag}'] = df['y'].shift(lag)
    df['t'] = np.arange(len(series))
    df['sin52'] = np.sin(2 * np.pi * df['t'] / 52)
    df['cos52'] = np.cos(2 * np.pi * df['t'] / 52)
    df['sin26'] = np.sin(4 * np.pi * df['t'] / 52)
    return df.dropna()

df = make_features(y)
X = df.drop('y', axis=1).values
y_clean = df['y'].values

# Train/test split (last 52 weeks as test)
n_test = 52
X_train, X_test = X[:-n_test], X[-n_test:]
y_train, y_test = y_clean[:-n_test], y_clean[-n_test:]

# ── Base learners ─────────────────────────────────────────────────────────────
base_models = {
    'GBM_shallow': GradientBoostingRegressor(n_estimators=100, max_depth=2),
    'GBM_deep':    GradientBoostingRegressor(n_estimators=100, max_depth=5),
    'LightGBM':    lgb.LGBMRegressor(n_estimators=100, num_leaves=31, verbose=-1),
    'Ridge':       Ridge(alpha=100),
}

# ── Generate out-of-fold predictions (temporal CV) ───────────────────────────
tscv = TimeSeriesSplit(n_splits=5)
n_models = len(base_models)
oof_preds = np.zeros((len(X_train), n_models))

for fold_idx, (train_idx, val_idx) in enumerate(tscv.split(X_train)):
    X_fold_train, X_fold_val = X_train[train_idx], X_train[val_idx]
    y_fold_train = y_train[train_idx]

    for m_idx, (name, model) in enumerate(base_models.items()):
        model.fit(X_fold_train, y_fold_train)
        oof_preds[val_idx, m_idx] = model.predict(X_fold_val)

# Only use rows that were predicted at least once
valid_rows = np.any(oof_preds != 0, axis=1)
X_meta_train = oof_preds[valid_rows]
y_meta_train = y_train[valid_rows]

# ── Train base models on full training set ────────────────────────────────────
test_preds = np.zeros((n_test, n_models))
for m_idx, (name, model) in enumerate(base_models.items()):
    model.fit(X_train, y_train)
    test_preds[:, m_idx] = model.predict(X_test)
    mae = mean_absolute_error(y_test, test_preds[:, m_idx])
    print(f"{name} MAE: {mae:.3f}")

# ── Meta-learner: Ridge (non-negative) ───────────────────────────────────────
from sklearn.linear_model import Ridge
meta_ridge = Ridge(alpha=1.0, positive=True)
meta_ridge.fit(X_meta_train, y_meta_train)
stacked_preds_ridge = meta_ridge.predict(test_preds)
mae_stack_ridge = mean_absolute_error(y_test, stacked_preds_ridge)
print(f"\\nRidge meta-learner MAE: {mae_stack_ridge:.3f}")
print(f"Meta weights: {dict(zip(base_models.keys(), meta_ridge.coef_.round(3)))}")

# ── Meta-learner: LightGBM ────────────────────────────────────────────────────
meta_lgb = lgb.LGBMRegressor(n_estimators=50, num_leaves=7, verbose=-1)
meta_lgb.fit(X_meta_train, y_meta_train)
stacked_preds_lgb = meta_lgb.predict(test_preds)
mae_stack_lgb = mean_absolute_error(y_test, stacked_preds_lgb)
print(f"LightGBM meta-learner MAE: {mae_stack_lgb:.3f}")

# ── Boosted Hybrid: ETS residuals + ML ───────────────────────────────────────
from statsmodels.tsa.holtwinters import ExponentialSmoothing

ets = ExponentialSmoothing(y_train, trend='add', seasonal='add',
                           seasonal_periods=52).fit(optimized=True)
ets_train_preds = ets.fittedvalues
residuals_train  = y_train - ets_train_preds

# Train ML on residuals
ml_residual = lgb.LGBMRegressor(n_estimators=100, num_leaves=31, verbose=-1)
ml_residual.fit(X_train, residuals_train)

ets_test_preds = ets.forecast(n_test)
ml_test_residuals = ml_residual.predict(X_test)
hybrid_preds = ets_test_preds + ml_test_residuals
mae_hybrid = mean_absolute_error(y_test, hybrid_preds)
print(f"\\nBoosted Hybrid MAE: {mae_hybrid:.3f}")

# ── Summary ───────────────────────────────────────────────────────────────────
simple_avg = test_preds.mean(axis=1)
mae_avg = mean_absolute_error(y_test, simple_avg)
print(f"\\nSimple Average MAE:        {mae_avg:.3f}")
print(f"Ridge Stacking MAE:        {mae_stack_ridge:.3f}")
print(f"LightGBM Stacking MAE:     {mae_stack_lgb:.3f}")
print(f"Boosted Hybrid MAE:        {mae_hybrid:.3f}")
`}),e.jsx(i,{title:"Cross-Validation Leakage in Stacking",children:"A subtle form of leakage occurs if the same fold is used for both generating out-of-fold predictions and selecting meta-hyperparameters. Use a separate outer validation set for meta-learner hyperparameter selection, or use nested cross-validation."}),e.jsx(o,{references:[{title:"Stacked Generalization",authors:"Wolpert, D.H.",year:1992,journal:"Neural Networks"},{title:"A Review of Forecast Combination",authors:"Timmermann, A.",year:2006,journal:"Handbook of Economic Forecasting"},{title:"Ensembles of Local Models: Forecast Combination for Time Series",authors:"Kang, Y. et al.",year:2022,journal:"International Journal of Forecasting"}]})]})}const D=Object.freeze(Object.defineProperty({__proto__:null,default:C,metadata:y},Symbol.toStringTag,{value:"Module"}));export{R as a,F as b,z as c,E as d,N as e,X as f,G as g,L as h,D as i,B as s};
