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
  title: 'Forecasting with PyMC',
  difficulty: 'advanced',
  readingTime: 14,
  description: 'Build complete Bayesian time series models in PyMC with trend, seasonality, and structural components, then extract full probabilistic forecasts.',
};

export default function PymcForecasting() {
  return (
    <SectionLayout title="Forecasting with PyMC" metadata={metadata}>
      <p>
        PyMC (formerly PyMC3) is a probabilistic programming library that lets you specify complex
        Bayesian models in Python and automatically sample from the posterior using NUTS. In this section,
        we build practical time series models with decomposable components — trend, seasonality, and
        regression effects — then extract full posterior predictive forecasts.
      </p>

      <h2>Structural Time Series Decomposition</h2>
      <p>
        A general structural model decomposes the time series into interpretable components:
      </p>
      <BlockMath math="y_t = \mu_t + \gamma_t + \beta' x_t + \epsilon_t" />
      <p>
        where <InlineMath math="\mu_t" /> is the trend, <InlineMath math="\gamma_t" /> is the seasonal
        component, <InlineMath math="\beta' x_t" /> captures covariate effects, and
        <InlineMath math="\epsilon_t \sim \mathcal{N}(0, \sigma^2)" /> is observation noise.
        The Bayesian approach places priors on all unknown components and their evolution over time.
      </p>

      <DefinitionBlock title="Local Linear Trend">
        A <strong>local linear trend</strong> allows both the level and slope to evolve stochastically:
        <BlockMath math="\mu_t = \mu_{t-1} + \nu_{t-1} + \eta_t^{(\mu)}" />
        <BlockMath math="\nu_t = \nu_{t-1} + \eta_t^{(\nu)}" />
        where <InlineMath math="\eta^{(\mu)} \sim \mathcal{N}(0, \sigma_\mu^2)" /> and
        <InlineMath math="\eta^{(\nu)} \sim \mathcal{N}(0, \sigma_\nu^2)" /> are innovation variances
        that control how quickly the level and slope can change.
      </DefinitionBlock>

      <h2>Fourier Seasonality in PyMC</h2>
      <p>
        Seasonal patterns are efficiently represented using Fourier terms. For period <InlineMath math="P" />,
        the K-th order Fourier representation uses <InlineMath math="2K" /> terms:
      </p>
      <BlockMath math="\gamma_t = \sum_{k=1}^{K} \left[ a_k \cos\!\left(\frac{2\pi k t}{P}\right) + b_k \sin\!\left(\frac{2\pi k t}{P}\right) \right]" />
      <p>
        The coefficients <InlineMath math="a_k, b_k" /> are given Gaussian priors. More Fourier terms
        allow more complex seasonal patterns at the cost of more parameters.
      </p>

      <NoteBlock title="Choosing K for Fourier Seasonality">
        Start with K = 3-5 for weekly or monthly data. Use LOO-CV (leave-one-out cross-validation)
        via ArviZ to compare models with different K. Increasing K beyond what the data supports leads
        to overfitting that the prior can mitigate but not eliminate.
      </NoteBlock>

      <h2>Posterior Predictive Sampling</h2>
      <p>
        Out-of-sample forecasting in PyMC requires careful handling of the temporal structure.
        The recommended workflow:
      </p>
      <ol>
        <li>Fit the model on training data using <code>pm.sample()</code></li>
        <li>Define future time indices and Fourier features for the forecast period</li>
        <li>Use <code>pm.Data</code> containers to swap in future features</li>
        <li>Call <code>pm.sample_posterior_predictive()</code> with the updated model context</li>
      </ol>

      <ExampleBlock title="Why Use pm.Data?">
        <code>pm.Data</code> creates a mutable container in the PyMC model graph. After sampling,
        you can call <code>{"pm.set_data({'X': X_future})"}</code> to replace training covariates with
        future ones, then sample the posterior predictive without refitting the model. This is the
        standard pattern for out-of-sample prediction in PyMC.
      </ExampleBlock>

      <h2>Complete PyMC Forecasting Model</h2>

      <PythonCode code={`import numpy as np
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
`} />

      <WarningBlock title="Divergences and Model Reparameterization">
        NUTS samplers report "divergences" when the sampler encounters regions of high curvature in the
        posterior. Divergences indicate unreliable samples. Common fixes:
        <ul>
          <li>Increase <code>target_accept</code> (try 0.95 or 0.99)</li>
          <li>Use non-centered parameterization for hierarchical models</li>
          <li>Tighten or reparameterize priors</li>
          <li>Check for model misspecification (plot prior/posterior predictive checks)</li>
        </ul>
      </WarningBlock>

      <ReferenceList references={[
        {
          title: 'PyMC: A Modern and Comprehensive Probabilistic Programming Framework',
          authors: 'Abril-Pla, O. et al.',
          year: 2023,
          journal: 'PeerJ Computer Science',
        },
        {
          title: 'Forecasting at Scale (Prophet)',
          authors: 'Taylor, S.J. & Letham, B.',
          year: 2018,
          journal: 'The American Statistician',
        },
        {
          title: 'Bayesian Time Series Analysis with PyMC3',
          authors: 'Martin, O., Kumar, R. & Lao, J.',
          year: 2022,
          journal: 'Bayesian Analysis with Python (book)',
        },
      ]} />
    </SectionLayout>
  );
}
