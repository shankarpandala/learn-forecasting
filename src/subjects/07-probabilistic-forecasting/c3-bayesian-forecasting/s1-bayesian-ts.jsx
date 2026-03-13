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
  title: 'Bayesian Time Series',
  difficulty: 'advanced',
  readingTime: 15,
  description: 'Understand Bayesian inference for time series, from prior specification to posterior predictive distributions, MCMC, and variational inference.',
};

export default function BayesianTS() {
  return (
    <SectionLayout title="Bayesian Time Series" metadata={metadata}>
      <p>
        Bayesian inference provides a principled framework for incorporating prior knowledge, quantifying
        all sources of uncertainty, and updating beliefs as data arrives. For time series forecasting,
        the Bayesian approach naturally produces a <em>posterior predictive distribution</em> that accounts
        for both observation noise and parameter uncertainty.
      </p>

      <h2>Bayesian Inference Framework</h2>
      <p>
        The central object in Bayesian inference is the posterior distribution over model parameters:
      </p>
      <BlockMath math="p(\theta \mid y_{1:T}) = \frac{p(y_{1:T} \mid \theta) \, p(\theta)}{p(y_{1:T})}" />
      <p>
        where <InlineMath math="p(\theta)" /> is the prior, <InlineMath math="p(y_{1:T} \mid \theta)" /> is
        the likelihood, and <InlineMath math="p(y_{1:T})" /> is the marginal likelihood (normalizing constant).
        For forecasting, we care about the <strong>posterior predictive distribution</strong>:
      </p>
      <BlockMath math="p(y_{T+h} \mid y_{1:T}) = \int p(y_{T+h} \mid \theta) \, p(\theta \mid y_{1:T}) \, d\theta" />

      <DefinitionBlock title="Posterior Predictive Distribution">
        The <strong>posterior predictive distribution</strong> marginalizes over parameter uncertainty:
        it is a mixture of forecast distributions, each weighted by how probable the corresponding
        parameters are given the observed data. This naturally produces wider prediction intervals
        than methods that condition on a single point estimate <InlineMath math="\hat{\theta}" />.
      </DefinitionBlock>

      <h2>Prior Specification</h2>
      <p>
        Choosing priors is one of the most important (and most debated) aspects of Bayesian modeling.
        Common strategies:
      </p>
      <ul>
        <li>
          <strong>Weakly informative priors:</strong> Regularize the model without strongly constraining
          inference. Example: <InlineMath math="\beta \sim \mathcal{N}(0, 1)" /> for regression coefficients
          on standardized data.
        </li>
        <li>
          <strong>Informative priors:</strong> Encode domain knowledge. Example: for an AR(1) coefficient,
          <InlineMath math="\phi \sim \mathcal{U}(-1, 1)" /> enforces stationarity.
        </li>
        <li>
          <strong>Hierarchical priors:</strong> Pool information across related series, learning shared
          hyperparameters from the data.
        </li>
        <li>
          <strong>Reference/Jeffreys priors:</strong> Objective, invariant priors for situations where
          no domain knowledge is available.
        </li>
      </ul>

      <NoteBlock title="Sensitivity to Priors">
        With sufficient data, the likelihood dominates and the posterior becomes insensitive to the prior
        (Bernstein–von Mises theorem). For short time series (common in business forecasting), priors
        matter substantially. Always check sensitivity by running inference under several prior choices.
      </NoteBlock>

      <h2>Bayesian AR(1) Model</h2>
      <p>
        A simple example: the Bayesian AR(1) model specifies:
      </p>
      <BlockMath math="\begin{aligned} \phi &\sim \mathcal{N}(0, 0.5) \\ \sigma &\sim \text{HalfNormal}(1) \\ y_t &= \phi y_{t-1} + \epsilon_t, \quad \epsilon_t \sim \mathcal{N}(0, \sigma^2) \end{aligned}" />
      <p>
        The posterior <InlineMath math="p(\phi, \sigma \mid y_{1:T})" /> is not available in closed form,
        so we need approximate inference methods.
      </p>

      <h2>Markov Chain Monte Carlo (MCMC)</h2>
      <p>
        MCMC algorithms generate samples from the posterior distribution by constructing a Markov chain
        whose stationary distribution equals the posterior. The most common algorithms for Bayesian
        time series are:
      </p>
      <ul>
        <li>
          <strong>NUTS (No-U-Turn Sampler):</strong> Hamiltonian Monte Carlo variant used by Stan and PyMC.
          Highly efficient for continuous parameters, adapts step size and trajectory length automatically.
        </li>
        <li>
          <strong>Metropolis-Hastings:</strong> General-purpose but slow for high-dimensional problems.
        </li>
        <li>
          <strong>Gibbs Sampling:</strong> Efficient when full conditionals are available (e.g., normal-normal models).
        </li>
      </ul>
      <BlockMath math="\hat{\theta}^{(s+1)} \sim q(\theta \mid \hat{\theta}^{(s)}), \quad \text{accept with prob. } \min\!\left(1, \frac{p(\theta^*\mid y)}{p(\theta^{(s)}\mid y)}\right)" />

      <h2>Variational Inference</h2>
      <p>
        When MCMC is too slow (e.g., large datasets or complex models), variational inference (VI)
        approximates the posterior with a tractable family <InlineMath math="q(\theta; \lambda)" />:
      </p>
      <BlockMath math="\lambda^* = \arg\min_\lambda \text{KL}(q(\theta; \lambda) \| p(\theta \mid y))" />
      <p>
        This is equivalent to maximizing the Evidence Lower Bound (ELBO):
      </p>
      <BlockMath math="\text{ELBO}(\lambda) = \mathbb{E}_{q}[\log p(y, \theta)] - \mathbb{E}_q[\log q(\theta; \lambda)]" />
      <p>
        Mean-field VI assumes independent factors: <InlineMath math="q(\theta) = \prod_i q_i(\theta_i)" />.
        Modern frameworks use stochastic VI with automatic differentiation (ADVI in Stan, Pyro, NumPyro).
      </p>

      <TheoremBlock title="MCMC vs Variational Inference">
        MCMC provides asymptotically exact samples from the posterior (given sufficient runtime), while
        VI provides a biased but faster approximation. For small-to-medium datasets, NUTS typically
        gives better coverage and is the preferred choice. VI scales to large datasets and is used
        when MCMC is computationally infeasible.
      </TheoremBlock>

      <h2>Advantages for Forecasting</h2>
      <p>
        Bayesian methods offer several unique advantages in forecasting contexts:
      </p>
      <ul>
        <li><strong>Full uncertainty quantification:</strong> Prediction intervals automatically account for parameter uncertainty, yielding better coverage than MLE-based intervals.</li>
        <li><strong>Hierarchical modeling:</strong> Naturally pool information across many related series, improving forecasts for low-data series.</li>
        <li><strong>Prior elicitation:</strong> Expert knowledge can be formally incorporated, especially valuable when data is scarce.</li>
        <li><strong>Model comparison:</strong> Bayesian model comparison via marginal likelihood (Bayes factors) or LOO-CV avoids overfitting.</li>
        <li><strong>Online updating:</strong> The posterior from one period becomes the prior for the next, enabling principled sequential learning.</li>
      </ul>

      <WarningBlock title="Computational Cost">
        MCMC can be orders of magnitude slower than MLE for large datasets. A model that fits in seconds
        with statsmodels may require minutes or hours with PyMC via NUTS. Strategies to mitigate cost:
        vectorized operations on PyTensor/JAX, GPU acceleration, hierarchical approximations, and
        variational inference for first-pass estimates.
      </WarningBlock>

      <h2>Introduction to PyMC</h2>

      <PythonCode code={`import numpy as np
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
`} />

      <ReferenceList references={[
        {
          title: 'Probabilistic Programming in Python using PyMC',
          authors: 'Salvatier, J., Wiecki, T.V. & Fonnesbeck, C.',
          year: 2016,
          journal: 'PeerJ Computer Science',
        },
        {
          title: 'Bayesian Data Analysis (3rd ed.)',
          authors: 'Gelman, A., Carlin, J.B., Stern, H.S. et al.',
          year: 2013,
          journal: 'CRC Press',
        },
        {
          title: 'Auto-Encoding Variational Bayes',
          authors: 'Kingma, D.P. & Welling, M.',
          year: 2014,
          journal: 'ICLR',
        },
      ]} />
    </SectionLayout>
  );
}
