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
  title: 'Bayesian Structural Time Series (BSTS)',
  difficulty: 'advanced',
  readingTime: 14,
  description: 'Master Bayesian state space models with spike-and-slab priors, and apply them to counterfactual causal inference with CausalImpact.',
};

export default function BSTS() {
  return (
    <SectionLayout title="Bayesian Structural Time Series (BSTS)" metadata={metadata}>
      <p>
        Bayesian Structural Time Series (BSTS) combines state space modeling with Bayesian inference,
        providing a flexible framework for decomposing time series into interpretable components while
        quantifying uncertainty. Developed at Google, BSTS is particularly powerful for counterfactual
        causal inference — answering "what would have happened if the intervention had not occurred?"
      </p>

      <h2>State Space Formulation</h2>
      <p>
        The BSTS model consists of two equations: an observation equation and a state transition equation:
      </p>
      <BlockMath math="\text{Observation: } y_t = Z_t' \alpha_t + \epsilon_t, \quad \epsilon_t \sim \mathcal{N}(0, \sigma_\epsilon^2)" />
      <BlockMath math="\text{Transition: } \alpha_{t+1} = T_t \alpha_t + R_t \eta_t, \quad \eta_t \sim \mathcal{N}(0, Q_t)" />
      <p>
        where <InlineMath math="\alpha_t" /> is the latent state vector, <InlineMath math="Z_t" /> maps
        states to observations, and <InlineMath math="T_t" /> is the state transition matrix. Different
        model components (trend, seasonality, regression) correspond to specific block structures in these matrices.
      </p>

      <DefinitionBlock title="Local Level Model (Unobserved Components)">
        The simplest BSTS model: a random-walk level with observation noise:
        <BlockMath math="y_t = \mu_t + \epsilon_t, \quad \epsilon_t \sim \mathcal{N}(0, \sigma_\epsilon^2)" />
        <BlockMath math="\mu_{t+1} = \mu_t + \eta_t, \quad \eta_t \sim \mathcal{N}(0, \sigma_\eta^2)" />
        The ratio <InlineMath math="\sigma_\eta^2 / \sigma_\epsilon^2" /> controls the signal-to-noise
        ratio: high values allow rapid level changes (flexible but noisy); low values enforce smoothness.
      </DefinitionBlock>

      <h2>Spike-and-Slab Priors for Variable Selection</h2>
      <p>
        When many covariates are available, BSTS uses spike-and-slab priors to simultaneously perform
        variable selection and estimation. Each regression coefficient is modeled as:
      </p>
      <BlockMath math="\beta_j \sim (1 - \pi_j)\delta_0 + \pi_j \mathcal{N}(0, \tau^2)" />
      <p>
        where <InlineMath math="\pi_j \in [0,1]" /> is the inclusion probability (slab weight),
        <InlineMath math="\delta_0" /> is a point mass at zero (spike), and <InlineMath math="\mathcal{N}(0, \tau^2)" />
        is the slab distribution. The posterior inclusion probability (PIP) measures how much evidence
        the data provides for including each variable.
      </p>

      <TheoremBlock title="Spike-and-Slab for Automatic Variable Selection">
        The spike-and-slab prior induces <strong>automatic sparsity</strong>: variables with low
        predictive value get posterior inclusion probabilities close to zero, effectively excluding
        them from the model. This is Bayesian LASSO on steroids, providing both the regularization
        effect and full uncertainty quantification about which variables matter.
      </TheoremBlock>

      <h2>CausalImpact: Counterfactual Analysis</h2>
      <p>
        CausalImpact (Brodersen et al., 2015) uses BSTS for causal inference about interventions.
        The key idea: fit a BSTS model on the pre-intervention period using control series as covariates,
        then forecast what the treated series <em>would have been</em> had the intervention not occurred.
        The causal effect is estimated as:
      </p>
      <BlockMath math="\hat{\tau}_t = y_t - \hat{y}_t^{counterfactual}, \quad t > T_0" />
      <p>
        where <InlineMath math="T_0" /> is the intervention date. The BSTS posterior provides full
        uncertainty intervals for the counterfactual, enabling hypothesis testing for the treatment effect.
      </p>

      <ExampleBlock title="Marketing Campaign Analysis with CausalImpact">
        A retailer launches a promotion on week 20. To estimate the incremental sales lift, they:
        <ol>
          <li>Select control markets that did not receive the promotion</li>
          <li>Fit a BSTS model on weeks 1-19 with control market sales as covariates</li>
          <li>Use the posterior to forecast weeks 20-30 as the counterfactual</li>
          <li>Compare actual sales to the counterfactual to estimate the causal lift</li>
        </ol>
        The Bayesian uncertainty bands on the counterfactual provide statistically rigorous confidence
        intervals for the estimated treatment effect.
      </ExampleBlock>

      <h2>Applications in Marketing and Business</h2>
      <p>
        BSTS and CausalImpact are widely used in industry for:
      </p>
      <ul>
        <li><strong>Marketing mix modeling:</strong> Attributing sales lift to advertising channels</li>
        <li><strong>A/B test analysis:</strong> When randomization is imperfect or control is observational</li>
        <li><strong>Policy evaluation:</strong> Estimating effects of business decisions (price changes, product launches)</li>
        <li><strong>Anomaly detection:</strong> Identifying periods where actuals diverge significantly from model expectations</li>
        <li><strong>Demand forecasting:</strong> With automatic variable selection from dozens of potential predictors</li>
      </ul>

      <WarningBlock title="Parallel Trend Assumption">
        CausalImpact's validity rests on the assumption that, in the absence of the intervention, the
        treated series would have evolved in parallel with the control series (adjusted by the fitted
        model). If controls are affected by the intervention (spillovers) or if the treated unit has
        unique unmodeled factors, the counterfactual will be biased. Always validate the pre-period
        model fit carefully.
      </WarningBlock>

      <h2>Implementation with Orbit (Python BSTS)</h2>

      <PythonCode code={`import numpy as np
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
`} />

      <NoteBlock title="Python BSTS Libraries">
        The original BSTS implementation is in R (the <code>bsts</code> package by Steven Scott).
        Python alternatives include:
        <ul>
          <li><strong>Orbit:</strong> Production-ready Bayesian time series by Uber, supports BSTS-style models</li>
          <li><strong>PyMC:</strong> Custom BSTS models with full flexibility</li>
          <li><strong>tfp (TensorFlow Probability):</strong> <code>sts</code> module with GPU acceleration</li>
          <li><strong>pycausalimpact:</strong> Python port of the R CausalImpact package</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        {
          title: 'Inferring Causal Impact Using Bayesian Structural Time-Series Models',
          authors: 'Brodersen, K.H. et al.',
          year: 2015,
          journal: 'Annals of Applied Statistics',
        },
        {
          title: 'Predicting the Present with Bayesian Structural Time Series',
          authors: 'Scott, S.L. & Varian, H.R.',
          year: 2014,
          journal: 'International Journal of Mathematical Modelling and Numerical Optimisation',
        },
        {
          title: 'Orbit: Probabilistic Forecast with Exponential Smoothing',
          authors: 'Ng, E. et al.',
          year: 2020,
          journal: 'arXiv',
        },
      ]} />
    </SectionLayout>
  );
}
