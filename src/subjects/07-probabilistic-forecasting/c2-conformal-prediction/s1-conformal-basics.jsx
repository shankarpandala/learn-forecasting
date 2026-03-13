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
  title: 'Conformal Prediction Basics',
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Learn split conformal prediction: a distribution-free method with finite-sample coverage guarantees for any forecasting model.',
};

export default function ConformalBasics() {
  return (
    <SectionLayout title="Conformal Prediction Basics" metadata={metadata}>
      <p>
        Conformal prediction is a framework for constructing prediction intervals with <em>guaranteed</em> finite-sample
        coverage, regardless of the underlying model or data distribution (under exchangeability). Unlike
        bootstrap or parametric intervals, conformal prediction requires no distributional assumptions
        and works as a wrapper around any existing point forecasting model.
      </p>

      <DefinitionBlock title="Split Conformal Prediction">
        Given a pre-trained model and a held-out <strong>calibration set</strong>{' '}
        <InlineMath math="\{(x_i, y_i)\}_{i=1}^n" />, split conformal prediction:
        <ol>
          <li>Computes non-conformity scores <InlineMath math="s_i = |y_i - \hat{f}(x_i)|" /></li>
          <li>Finds the <InlineMath math="\lceil (n+1)(1-\alpha) \rceil / n" /> empirical quantile
              <InlineMath math="\hat{q}" /> of the scores</li>
          <li>Returns the prediction set <InlineMath math="\hat{C}(x) = [\hat{f}(x) - \hat{q},\ \hat{f}(x) + \hat{q}]" /></li>
        </ol>
      </DefinitionBlock>

      <h2>The Calibration Set</h2>
      <p>
        The calibration set is a held-out portion of the data used exclusively to determine the width of
        prediction intervals. It must be <em>independent</em> of the training data used to fit the model.
        The three-way split for conformal forecasting is:
      </p>
      <ul>
        <li><strong>Training set:</strong> Used to fit the forecasting model</li>
        <li><strong>Calibration set:</strong> Used to compute non-conformity scores and find the quantile threshold</li>
        <li><strong>Test set:</strong> The future observations for which we issue interval forecasts</li>
      </ul>

      <NoteBlock title="Calibration Set Size">
        The calibration set should contain at least <InlineMath math="n \geq \lceil (1-\alpha)/\alpha \rceil" /> observations
        for the quantile to be well-defined. For 95% coverage, you need at least 19 calibration points.
        In practice, 200–500 calibration points are recommended for stable intervals.
      </NoteBlock>

      <h2>Non-Conformity Scores</h2>
      <p>
        The non-conformity score measures how unusual a new observation is relative to the model's predictions.
        The simplest choice for regression is the absolute residual:
      </p>
      <BlockMath math="s_i = |y_i - \hat{f}(x_i)|" />
      <p>
        Other choices include:
      </p>
      <ul>
        <li><strong>Signed residual:</strong> <InlineMath math="s_i = y_i - \hat{f}(x_i)" /> (asymmetric intervals)</li>
        <li><strong>Normalized score:</strong> <InlineMath math="s_i = |y_i - \hat{f}(x_i)| / \hat{\sigma}(x_i)" /> (locally adaptive width)</li>
        <li><strong>CQR score:</strong> <InlineMath math="\max(q_\tau^{lo}(x) - y, y - q_\tau^{hi}(x))" /> for quantile models</li>
      </ul>

      <h2>Coverage Guarantee</h2>

      <TheoremBlock title="Marginal Coverage Guarantee">
        Under <strong>exchangeability</strong> of the calibration and test points, split conformal prediction
        achieves:
        <BlockMath math="P(Y_{n+1} \in \hat{C}(X_{n+1})) \geq 1 - \alpha" />
        Moreover, coverage is bounded above by:
        <BlockMath math="P(Y_{n+1} \in \hat{C}(X_{n+1})) \leq 1 - \alpha + \frac{1}{n+1}" />
        so coverage is nearly exact (not overly conservative) for large calibration sets.
      </TheoremBlock>

      <p>
        The exchangeability assumption holds when calibration and test data are i.i.d. from the same
        distribution. For time series, this is violated by temporal dependence and distribution shift,
        which motivates the adaptive methods in the next section.
      </p>

      <h2>Marginal vs Conditional Coverage</h2>
      <p>
        The guarantee above is <strong>marginal</strong>: coverage holds on average over all possible
        test inputs. It does <em>not</em> guarantee coverage for every subgroup or covariate region.
      </p>
      <ul>
        <li>
          <strong>Marginal coverage:</strong> <InlineMath math="P(Y \in \hat{C}(X)) \geq 1 - \alpha" /> — holds unconditionally.
        </li>
        <li>
          <strong>Conditional coverage:</strong> <InlineMath math="P(Y \in \hat{C}(X) \mid X = x) \geq 1 - \alpha" /> — only achievable
          with stronger assumptions or adaptive methods.
        </li>
      </ul>

      <WarningBlock title="Marginal vs Conditional Coverage in Practice">
        A model with 95% marginal coverage may have 70% coverage in one subgroup and 99% in another.
        For safety-critical applications (medical, financial), conditional coverage is often what matters.
        Conformalized Quantile Regression (CQR) and localized conformal methods offer better conditional
        coverage by using locally adaptive non-conformity scores.
      </WarningBlock>

      <ExampleBlock title="Conformal Interval vs Parametric Interval">
        Consider a neural network trained on retail demand. The parametric approach assumes Gaussian
        residuals and computes intervals from the model's estimated variance. Conformal prediction instead
        looks at actual calibration residuals — if the model systematically under-predicts certain
        SKUs, the calibration scores will be larger, and the interval widens accordingly, without any
        distributional assumption.
      </ExampleBlock>

      <h2>Conformalized Quantile Regression (CQR)</h2>
      <p>
        CQR (Romano et al., 2019) combines quantile regression with conformal calibration for improved
        conditional coverage. Instead of a fixed-width interval, CQR adapts interval width to local uncertainty:
      </p>
      <BlockMath math="s_i = \max(q_{\alpha/2}(x_i) - y_i,\ y_i - q_{1-\alpha/2}(x_i))" />
      <p>
        The calibrated interval for a new point is:
      </p>
      <BlockMath math="\hat{C}(x) = [q_{\alpha/2}(x) - \hat{q},\ q_{1-\alpha/2}(x) + \hat{q}]" />
      <p>
        This inherits the coverage guarantee of conformal prediction while benefiting from the local
        adaptivity of quantile regression.
      </p>

      <h2>Implementation with MAPIE</h2>

      <PythonCode code={`import numpy as np
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
`} />

      <ReferenceList references={[
        {
          title: 'A Gentle Introduction to Conformal Prediction and Distribution-Free Uncertainty Quantification',
          authors: 'Angelopoulos, A.N. & Bates, S.',
          year: 2023,
          url: 'https://arxiv.org/abs/2107.07511',
        },
        {
          title: 'Conformalized Quantile Regression',
          authors: 'Romano, Y., Patterson, E. & Candes, E.',
          year: 2019,
          journal: 'NeurIPS',
        },
        {
          title: 'MAPIE: an open-source library for distribution-free uncertainty quantification',
          authors: 'Taquet, V. et al.',
          year: 2022,
          journal: 'arXiv',
        },
      ]} />
    </SectionLayout>
  );
}
