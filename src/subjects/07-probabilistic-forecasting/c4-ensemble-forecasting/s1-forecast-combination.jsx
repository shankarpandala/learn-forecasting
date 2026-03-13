import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

export const metadata = {
  title: 'Forecast Combination',
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'Understand why combining forecasts consistently outperforms individual models, and implement simple average, trimmed mean, and optimal Bates-Granger combination.',
};

export default function ForecastCombination() {
  return (
    <SectionLayout title="Forecast Combination" metadata={metadata}>
      <p>
        One of the most robust findings in forecasting research is that combining forecasts from multiple
        models typically outperforms any individual model. This "wisdom of crowds" effect is not accidental —
        it has a solid theoretical basis rooted in bias-variance decomposition and portfolio diversification.
      </p>

      <h2>Why Combination Works</h2>
      <p>
        Each individual model captures some aspects of the data generating process while missing others.
        Combination reduces forecast error through two mechanisms:
      </p>
      <ul>
        <li>
          <strong>Variance reduction:</strong> If <InlineMath math="N" /> forecasts have equal variance
          <InlineMath math="\sigma^2" /> and zero pairwise correlation, the ensemble variance is
          <InlineMath math="\sigma^2 / N" />.
        </li>
        <li>
          <strong>Bias reduction:</strong> Models with opposite biases partially cancel when combined.
        </li>
      </ul>
      <BlockMath math="\text{MSE}(\bar{f}) \leq \frac{1}{N}\sum_{i=1}^N \text{MSE}(f_i)" />
      <p>
        The inequality holds exactly when the forecasts are unbiased and uncorrelated. In practice,
        forecasts from different model classes (e.g., statistical vs. ML) tend to have low correlation,
        making combination particularly effective.
      </p>

      <TheoremBlock title="Bates-Granger Optimal Combination">
        Given two unbiased forecasts <InlineMath math="f_1, f_2" /> with variances
        <InlineMath math="\sigma_1^2, \sigma_2^2" /> and covariance <InlineMath math="\sigma_{12}" />,
        the optimal linear combination <InlineMath math="\hat{y} = w f_1 + (1-w) f_2" /> minimizes
        MSE with:
        <BlockMath math="w^* = \frac{\sigma_2^2 - \sigma_{12}}{\sigma_1^2 + \sigma_2^2 - 2\sigma_{12}}" />
        When the forecasts are uncorrelated, this simplifies to the inverse-variance weighting:
        <BlockMath math="w_i \propto 1 / \sigma_i^2" />
      </TheoremBlock>

      <h2>Simple Combination Methods</h2>

      <DefinitionBlock title="Equal-Weight Average">
        The <strong>simple average</strong> assigns equal weight to all models:
        <BlockMath math="\hat{y}_t^{combo} = \frac{1}{N} \sum_{i=1}^N \hat{y}_t^{(i)}" />
        Despite its simplicity, the equal-weight average is remarkably competitive with more sophisticated
        methods, especially when the number of models is large and errors are estimation noise.
      </DefinitionBlock>

      <p>
        More sophisticated methods include:
      </p>
      <ul>
        <li>
          <strong>Trimmed mean:</strong> Remove the top and bottom <InlineMath math="k\%" /> of forecasts
          before averaging, reducing the influence of outlier models.
        </li>
        <li>
          <strong>Median:</strong> The sample median is robust to outlier forecasts and automatically
          downweights extreme values, equivalent to 50% trimming.
        </li>
        <li>
          <strong>Variance-weighted average:</strong> Weight models inversely by their out-of-sample variance.
          Estimated from a hold-out window.
        </li>
      </ul>

      <NoteBlock title="The Forecast Combination Puzzle">
        Despite theoretical arguments for estimated optimal weights, empirical studies (including the M4
        competition) consistently show that simple averages outperform or match more complex combination
        methods. Estimated optimal weights suffer from overfitting when the weight estimation sample is
        limited. The simple average is a safe default and a strong baseline.
      </NoteBlock>

      <h2>Regression-Based Combination</h2>
      <p>
        Granger-Ramanathan (1984) suggested combining via OLS regression on the individual forecasts:
      </p>
      <BlockMath math="\hat{y}_t = \alpha + \sum_{i=1}^N w_i f_t^{(i)} + \epsilon_t" />
      <p>
        The weights are estimated from past data and may not sum to one (allowing for overall bias
        correction via <InlineMath math="\alpha" />). A constrained version requiring
        <InlineMath math="\sum w_i = 1, w_i \geq 0" /> is more robust for small estimation samples.
      </p>

      <WarningBlock title="Overfitting in Regression Combination">
        With N models and limited history, OLS combination can overfit. Regularization (Ridge, Lasso)
        or constraint to non-negative weights is essential. A rule of thumb: use regression combination
        only when the estimation sample has at least 5-10× more observations than models.
      </WarningBlock>

      <h2>Implementation: Combining Multiple Models</h2>

      <PythonCode code={`import numpy as np
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
`} />

      <ExampleBlock title="M4 Competition Findings">
        In the M4 competition (2018), the winning hybrid ES-RNN model used a combination of exponential
        smoothing and neural networks. More importantly, the submission ranked 9th (FFORMS ensemble)
        used only simple averages of classical models and outperformed 95% of submissions — demonstrating
        the power of intelligent combination over complex single models.
      </ExampleBlock>

      <ReferenceList references={[
        {
          title: 'The Combination of Forecasts',
          authors: 'Bates, J.M. & Granger, C.W.J.',
          year: 1969,
          journal: 'Operational Research Quarterly',
        },
        {
          title: 'Improved Methods of Combining Forecasts',
          authors: 'Granger, C.W.J. & Ramanathan, R.',
          year: 1984,
          journal: 'Journal of Forecasting',
        },
        {
          title: 'The M4 Competition: Results, Findings, Conclusion and Way Forward',
          authors: 'Makridakis, S., Spiliotis, E. & Assimakopoulos, V.',
          year: 2018,
          journal: 'International Journal of Forecasting',
        },
      ]} />
    </SectionLayout>
  );
}
