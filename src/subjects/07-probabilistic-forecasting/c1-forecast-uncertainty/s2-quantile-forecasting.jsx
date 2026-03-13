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
  title: 'Quantile Forecasting',
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Forecast specific quantiles of the future distribution using quantile regression, pinball loss, and gradient-boosted quantile models.',
};

export default function QuantileForecasting() {
  return (
    <SectionLayout title="Quantile Forecasting" metadata={metadata}>
      <p>
        Rather than estimating the full predictive distribution, quantile forecasting targets specific
        percentiles of the future value. A quantile forecast at level <InlineMath math="\tau \in (0,1)" /> answers
        the question: "What value will be exceeded only <InlineMath math="100(1-\tau)\%" /> of the time?"
        This is directly useful for inventory planning, risk management, and service level agreements.
      </p>

      <DefinitionBlock title="Quantile Function">
        The <strong>quantile</strong> at level <InlineMath math="\tau" /> of a random variable <InlineMath math="Y" /> is:
        <BlockMath math="Q_\tau(Y) = \inf\{y : P(Y \leq y) \geq \tau\}" />
        A quantile forecasting model estimates <InlineMath math="Q_\tau(Y_{t+h} \mid \mathcal{F}_t)" />, the
        conditional quantile given information up to time <InlineMath math="t" />.
      </DefinitionBlock>

      <h2>Quantile Regression</h2>
      <p>
        Classical linear quantile regression (Koenker and Bassett, 1978) estimates conditional quantiles
        by minimizing the <strong>pinball loss</strong> (also called check loss or quantile loss):
      </p>
      <BlockMath math="\mathcal{L}_\tau(y, \hat{q}) = \begin{cases} \tau (y - \hat{q}) & \text{if } y \geq \hat{q} \\ (1 - \tau)(\hat{q} - y) & \text{if } y < \hat{q} \end{cases}" />
      <p>
        This asymmetric loss function penalizes underprediction and overprediction differently, with the
        ratio of penalties equal to <InlineMath math="\tau : (1-\tau)" />. At <InlineMath math="\tau = 0.5" />,
        the pinball loss reduces to MAE (median regression).
      </p>

      <TheoremBlock title="Optimality of Quantile Regression">
        The function <InlineMath math="\hat{q}^*(x)" /> that minimizes the expected pinball loss
        <BlockMath math="\mathbb{E}[\mathcal{L}_\tau(Y, \hat{q}(X))]" />
        is exactly the conditional <InlineMath math="\tau" />-quantile <InlineMath math="Q_\tau(Y \mid X = x)" />.
        This means any model trained by minimizing pinball loss directly targets the correct quantile,
        without needing distributional assumptions.
      </TheoremBlock>

      <ExampleBlock title="Pinball Loss in Practice">
        For a 90th percentile forecast (<InlineMath math="\tau = 0.9" />):
        <ul>
          <li>If actual = 100 and forecast = 80 (underprediction by 20): loss = 0.9 × 20 = 18</li>
          <li>If actual = 100 and forecast = 120 (overprediction by 20): loss = 0.1 × 20 = 2</li>
        </ul>
        The asymmetry (18 vs 2) reflects that missing a high quantile upward is much cheaper than
        missing it downward — appropriate for capacity planning where underestimation is costly.
      </ExampleBlock>

      <h2>Quantile Regression Forests</h2>
      <p>
        Meinshausen (2006) showed that random forests can estimate the full conditional distribution,
        not just the mean. A <strong>Quantile Regression Forest</strong> (QRF) works by:
      </p>
      <ol>
        <li>Training a standard random forest on the training data</li>
        <li>For a new input <InlineMath math="x" />, collecting all training observations that fall in the same leaf nodes</li>
        <li>Computing the empirical quantile of those collected observations</li>
      </ol>
      <p>
        This approach is non-parametric and naturally adapts to heteroscedasticity — regions of the input
        space with high variance automatically produce wider intervals.
      </p>

      <h2>LightGBM Quantile Regression</h2>
      <p>
        Gradient-boosted trees support quantile regression by using pinball loss as the objective function.
        LightGBM's <code>objective='quantile'</code> with <code>alpha=tau</code> trains a model that directly
        minimizes pinball loss. Advantages over QRF:
      </p>
      <ul>
        <li>Handles larger datasets more efficiently</li>
        <li>Better at capturing complex interaction effects</li>
        <li>Supports categorical features natively</li>
        <li>Can be tuned via learning rate and number of trees</li>
      </ul>

      <WarningBlock title="Quantile Crossing">
        When training separate models for different quantiles (e.g., 10th, 50th, 90th), the resulting
        quantile estimates may "cross" — meaning the 10th percentile forecast exceeds the 50th percentile
        forecast for some inputs. This is mathematically invalid. Solutions include:
        <ul>
          <li>Post-processing: isotonic regression to enforce monotonicity</li>
          <li>Multi-output models that predict all quantiles simultaneously</li>
          <li>Non-crossing quantile regression (Takeuchi et al., 2006)</li>
        </ul>
      </WarningBlock>

      <h2>Probabilistic Neural Network Outputs</h2>
      <p>
        Deep learning models can be adapted for quantile forecasting in two main ways:
      </p>
      <ul>
        <li>
          <strong>Multi-quantile output heads:</strong> The network predicts multiple quantiles simultaneously,
          trained jointly with a sum of pinball losses. This is used in DeepAR, TFT (Temporal Fusion Transformer),
          and N-BEATS-Q.
        </li>
        <li>
          <strong>Parametric output:</strong> The network outputs parameters of a known distribution
          (e.g., mean and variance for Gaussian, or alpha/beta for Beta distribution), from which
          quantiles are derived analytically.
        </li>
      </ul>

      <NoteBlock title="Connecting to Prediction Intervals">
        A prediction interval at level <InlineMath math="1-\alpha" /> is equivalent to the interval between
        the <InlineMath math="\alpha/2" /> and <InlineMath math="1-\alpha/2" /> quantile forecasts. For a
        95% PI, use quantile forecasts at <InlineMath math="\tau = 0.025" /> and <InlineMath math="\tau = 0.975" />.
      </NoteBlock>

      <h2>Implementation: sklearn and LightGBM</h2>

      <PythonCode code={`import numpy as np
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
`} />

      <h2>Evaluation: Beyond Pinball Loss</h2>
      <p>
        When producing multiple quantile forecasts, two aggregate metrics are commonly used:
      </p>
      <ul>
        <li>
          <strong>Mean Pinball Loss (MPL):</strong> Average pinball loss across all quantile levels,
          measuring overall distributional accuracy.
        </li>
        <li>
          <strong>Quantile Score (WQL):</strong> Weighted quantile loss used in the M5 competition,
          giving more weight to extreme quantiles.
        </li>
        <li>
          <strong>Calibration plots:</strong> Compare empirical coverage at each quantile level against
          the nominal level. A perfectly calibrated model produces a diagonal plot.
        </li>
      </ul>

      <ReferenceList references={[
        {
          title: 'Regression Quantiles',
          authors: 'Koenker, R. & Bassett, G.',
          year: 1978,
          journal: 'Econometrica',
        },
        {
          title: 'Quantile Regression Forests',
          authors: 'Meinshausen, N.',
          year: 2006,
          journal: 'Journal of Machine Learning Research',
        },
        {
          title: 'LightGBM: A Highly Efficient Gradient Boosting Decision Tree',
          authors: 'Ke, G. et al.',
          year: 2017,
          journal: 'NeurIPS',
        },
      ]} />
    </SectionLayout>
  );
}
