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
  title: 'Adaptive Conformal Inference',
  difficulty: 'advanced',
  readingTime: 12,
  description: 'Extend conformal prediction to non-exchangeable time series settings with adaptive methods that maintain valid coverage under distribution shift.',
};

export default function AdaptiveConformal() {
  return (
    <SectionLayout title="Adaptive Conformal Inference" metadata={metadata}>
      <p>
        Split conformal prediction requires exchangeability — a condition violated by time series due to
        temporal dependence and distribution shift. Adaptive Conformal Inference (ACI) addresses this by
        dynamically adjusting the coverage threshold over time, maintaining long-run coverage even when
        the data distribution changes.
      </p>

      <DefinitionBlock title="Adaptive Conformal Inference (ACI)">
        ACI (Gibbs and Candes, 2021) maintains a running miscoverage rate <InlineMath math="\alpha_t" /> that
        is updated after each observation:
        <BlockMath math="\alpha_{t+1} = \alpha_t + \gamma (\alpha - \text{err}_t)" />
        where <InlineMath math="\text{err}_t = \mathbf{1}[y_t \notin \hat{C}_t]" /> is the coverage error
        at time <InlineMath math="t" />, and <InlineMath math="\gamma > 0" /> is a step size controlling
        adaptation speed.
      </DefinitionBlock>

      <h2>Why Exchangeability Fails for Time Series</h2>
      <p>
        Standard conformal prediction assumes that calibration and test observations are exchangeable
        (i.e., their joint distribution is invariant to permutation). Time series violates this because:
      </p>
      <ul>
        <li><strong>Temporal dependence:</strong> Recent observations are more informative than distant ones</li>
        <li><strong>Distribution shift:</strong> Seasonality, trend breaks, and regime changes alter the forecast error distribution</li>
        <li><strong>Covariate shift:</strong> Future covariates may differ from calibration-period covariates</li>
      </ul>

      <h2>The ACI Algorithm</h2>
      <p>
        The update rule has an elegant interpretation: if the interval misses (<InlineMath math="\text{err}_t = 1" />),
        the effective alpha increases (wider intervals next round); if covered (<InlineMath math="\text{err}_t = 0" />),
        alpha decreases (narrower intervals). This is a gradient descent step on the pinball loss of the miscoverage rate.
      </p>
      <BlockMath math="\alpha_{t+1} = \alpha_t + \gamma(\alpha - \mathbf{1}[y_t \notin \hat{C}_t])" />

      <TheoremBlock title="Long-Run Coverage of ACI">
        Under mild conditions, ACI achieves <strong>long-run marginal coverage</strong>:
        <BlockMath math="\frac{1}{T} \sum_{t=1}^{T} \mathbf{1}[y_t \in \hat{C}_t] \to 1 - \alpha \quad \text{as } T \to \infty" />
        This holds regardless of the temporal dependence structure or distribution shift pattern.
        The step size <InlineMath math="\gamma" /> controls the trade-off between responsiveness to recent
        changes and stability.
      </TheoremBlock>

      <h2>EnbPI: Online Conformal for Time Series</h2>
      <p>
        Ensemble batch prediction intervals (EnbPI, Xu and Xie, 2021) adapts conformal prediction to
        online time series by:
      </p>
      <ol>
        <li>Training an ensemble of base models on bootstrap samples</li>
        <li>Computing leave-one-out residuals as non-conformity scores</li>
        <li>Maintaining a sliding window of residuals for the calibration set</li>
        <li>Updating intervals as new observations arrive</li>
      </ol>
      <p>
        EnbPI is particularly well-suited for forecasting under distribution shift because old calibration
        points are downweighted or discarded as the window moves forward.
      </p>

      <h2>Covariate-Conditional Coverage</h2>
      <p>
        Marginal coverage averaged over time may mask poor coverage in specific regimes. For instance,
        during demand spikes, a conformal model might chronically miss. <strong>Locally weighted conformal
        prediction</strong> addresses this by weighting calibration scores by their similarity to the
        current test point:
      </p>
      <BlockMath math="\hat{q}(x) = \text{Quantile}_{1-\alpha}\!\left( s_1, \ldots, s_n;\ w(x, x_i) \right)" />
      <p>
        where <InlineMath math="w(x, x_i)" /> is a kernel weight measuring how similar calibration point
        <InlineMath math="x_i" /> is to the test point <InlineMath math="x" />. This provides
        <em>approximate</em> conditional coverage at the cost of wider intervals.
      </p>

      <ExampleBlock title="ACI in Electricity Demand Forecasting">
        During a summer heatwave, an electricity demand forecasting model significantly underpredicts
        demand — its calibration set came from mild-weather periods. Standard conformal intervals miss
        repeatedly. ACI detects the sustained misses and widens intervals automatically within a few
        time steps, providing valid coverage even during the anomalous regime, without requiring model retraining.
      </ExampleBlock>

      <WarningBlock title="Choosing the Step Size">
        The step size <InlineMath math="\gamma" /> controls adaptation speed. Too small a value means slow
        response to distribution shift; too large causes volatile interval widths that overreact to
        single observations. A common heuristic is <InlineMath math="\gamma = 0.005" /> for daily data
        and <InlineMath math="\gamma = 0.02" /> for weekly data. Cross-validation on historical shifts
        can help select an appropriate value.
      </WarningBlock>

      <h2>Practical Applications</h2>
      <p>
        Adaptive conformal methods are particularly valuable in:
      </p>
      <ul>
        <li><strong>Energy forecasting:</strong> Daily/hourly intervals that adapt to seasonal regime changes</li>
        <li><strong>Retail inventory:</strong> Intervals that widen during promotional periods automatically</li>
        <li><strong>Finance:</strong> VaR (Value at Risk) estimates that respond to volatility clustering</li>
        <li><strong>Healthcare monitoring:</strong> Online vital sign prediction with patient-specific adaptation</li>
      </ul>

      <h2>Implementation: ACI for Time Series</h2>

      <PythonCode code={`import numpy as np
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
`} />

      <NoteBlock title="EnbPI vs ACI">
        ACI adapts the coverage level <InlineMath math="\alpha_t" /> while keeping the calibration set
        fixed. EnbPI instead maintains a sliding window of recent residuals. ACI is simpler to implement
        and can be applied on top of any calibrated model; EnbPI requires an ensemble and is better
        suited for fully online learning settings.
      </NoteBlock>

      <ReferenceList references={[
        {
          title: 'Adaptive Conformal Inference Under Distribution Shift',
          authors: 'Gibbs, I. & Candes, E.',
          year: 2021,
          journal: 'NeurIPS',
        },
        {
          title: 'Conformal Prediction Intervals for Time Series',
          authors: 'Xu, C. & Xie, Y.',
          year: 2021,
          journal: 'ICML',
        },
        {
          title: 'Robust Conformal Prediction using Weighted Residuals',
          authors: 'Tibshirani, R.J. et al.',
          year: 2019,
          journal: 'Journal of the American Statistical Association',
        },
      ]} />
    </SectionLayout>
  );
}
