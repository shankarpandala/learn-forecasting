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
  title: 'Stacking and Meta-Learning',
  difficulty: 'advanced',
  readingTime: 12,
  description: 'Implement stacking (stacked generalization) for time series: generate level-1 predictions with time-series-aware cross-validation, then train a meta-learner.',
};

export default function StackingForecasts() {
  return (
    <SectionLayout title="Stacking and Meta-Learning" metadata={metadata}>
      <p>
        Stacking (Wolpert, 1992), also called stacked generalization, is a systematic approach to
        combining models that goes beyond fixed-weight averaging. A <em>meta-learner</em> is trained
        on the predictions of base models, learning to weight and correct them in a data-adaptive way.
        Applied carefully to time series, stacking can significantly outperform individual models.
      </p>

      <DefinitionBlock title="Stacking Architecture">
        A stacking ensemble has two levels:
        <ul>
          <li><strong>Level-1 (base learners):</strong> A set of diverse forecasting models
              <InlineMath math="f_1, \ldots, f_N" /> trained independently.</li>
          <li><strong>Level-2 (meta-learner):</strong> A model <InlineMath math="g" /> trained on the
              out-of-sample predictions of the level-1 models:
              <BlockMath math="\hat{y}_t = g(f_1(x_t), \ldots, f_N(x_t))" /></li>
        </ul>
        The key insight is that the meta-learner can learn non-linear relationships between base model
        predictions, including when each model is trustworthy.
      </DefinitionBlock>

      <h2>Time-Series-Aware Stacking</h2>
      <p>
        Standard k-fold cross-validation uses random splits that would cause data leakage in time series.
        For valid out-of-fold predictions, we must use temporal cross-validation (TimeSeriesSplit):
      </p>
      <ol>
        <li>Split the training data into <InlineMath math="K" /> temporal folds</li>
        <li>For each fold <InlineMath math="k" />: train each base model on folds 1 to k-1, predict fold k</li>
        <li>Collect all out-of-fold predictions to form the meta-feature matrix</li>
        <li>Train the meta-learner on these meta-features against the true targets</li>
      </ol>
      <p>
        This process ensures no data leakage: each out-of-fold prediction is made by a model that has
        never seen the target values it predicts.
      </p>

      <WarningBlock title="Data Leakage in Time Series Stacking">
        Using standard k-fold cross-validation for generating level-1 predictions in time series allows
        the model trained on future data to predict past data, introducing information leakage. This
        produces overly optimistic meta-learner training and poor generalization. Always use walk-forward
        or expanding window validation.
      </WarningBlock>

      <h2>Meta-Learner Choices</h2>
      <p>
        The meta-learner should be simple enough to avoid overfitting the meta-features:
      </p>
      <ul>
        <li><strong>Linear regression (constrained):</strong> Fastest, most interpretable. Use non-negative weights to prevent negative combination coefficients.</li>
        <li><strong>Ridge regression:</strong> Regularized linear combination, good default.</li>
        <li><strong>LightGBM:</strong> Can learn non-linear interaction effects between model predictions, useful when models excel in different regimes.</li>
        <li><strong>Elastic Net:</strong> L1 + L2 regularization, automatically performs model selection.</li>
      </ul>

      <h2>Boosted Hybrid Approach</h2>
      <p>
        An alternative to pure stacking is the boosted hybrid: fit a statistical model first (e.g., ETS),
        then train a machine learning model on the residuals. The final forecast is:
      </p>
      <BlockMath math="\hat{y}_{t+h} = \hat{y}_{t+h}^{\text{ETS}} + \hat{r}_{t+h}^{\text{ML}}" />
      <p>
        This approach is particularly effective because:
      </p>
      <ul>
        <li>The statistical model handles trend and seasonality reliably</li>
        <li>The ML model captures non-linear patterns and covariate effects in residuals</li>
        <li>Residuals often have smaller scale and are easier to model</li>
      </ul>

      <h2>Online Learning Combination</h2>
      <p>
        When the distribution changes over time, static stacking weights become outdated. Online learning
        methods update combination weights in real-time:
      </p>
      <BlockMath math="w_i^{(t+1)} = w_i^{(t)} \cdot \exp(-\eta \cdot \ell(y_t, f_i^{(t)}))" />
      <p>
        This exponential weighting scheme (Exponentiated Gradient, EG) increases weights for models
        performing well and decreases those performing poorly. It adapts to regime changes automatically.
      </p>

      <ExampleBlock title="When Stacking Adds Most Value">
        Stacking is most beneficial when:
        <ul>
          <li>Base models are diverse (different model families, not just hyperparameter variants)</li>
          <li>Different models excel in different regimes (e.g., ARIMA in stable periods, ML during promotions)</li>
          <li>Sufficient out-of-fold data is available to train the meta-learner robustly</li>
          <li>The meta-learner has access to meta-features (series ID, time of year, etc.) beyond just model predictions</li>
        </ul>
      </ExampleBlock>

      <PythonCode code={`import numpy as np
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
`} />

      <NoteBlock title="Cross-Validation Leakage in Stacking">
        A subtle form of leakage occurs if the same fold is used for both generating out-of-fold predictions
        and selecting meta-hyperparameters. Use a separate outer validation set for meta-learner
        hyperparameter selection, or use nested cross-validation.
      </NoteBlock>

      <ReferenceList references={[
        {
          title: 'Stacked Generalization',
          authors: 'Wolpert, D.H.',
          year: 1992,
          journal: 'Neural Networks',
        },
        {
          title: 'A Review of Forecast Combination',
          authors: 'Timmermann, A.',
          year: 2006,
          journal: 'Handbook of Economic Forecasting',
        },
        {
          title: 'Ensembles of Local Models: Forecast Combination for Time Series',
          authors: 'Kang, Y. et al.',
          year: 2022,
          journal: 'International Journal of Forecasting',
        },
      ]} />
    </SectionLayout>
  );
}
