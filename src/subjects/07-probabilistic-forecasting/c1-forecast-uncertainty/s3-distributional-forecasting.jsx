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
  title: 'Distributional Forecasting',
  difficulty: 'advanced',
  readingTime: 13,
  description: 'Go beyond quantiles to forecast complete predictive distributions using normalizing flows, deep autoregressive models, and proper scoring rules.',
};

export default function DistributionalForecasting() {
  return (
    <SectionLayout title="Distributional Forecasting" metadata={metadata}>
      <p>
        The most complete form of probabilistic forecasting produces an entire predictive distribution,
        not just point estimates or a few quantiles. This allows computing any desired quantity —
        probabilities, quantiles, expected shortfall, or risk measures — from a single unified model.
      </p>

      <DefinitionBlock title="Predictive Distribution">
        The <strong>predictive distribution</strong> for horizon <InlineMath math="h" /> given information
        up to time <InlineMath math="t" /> is the conditional distribution:
        <BlockMath math="p(y_{t+h} \mid y_1, \ldots, y_t) = \int p(y_{t+h} \mid \theta) \, p(\theta \mid y_{1:t}) \, d\theta" />
        In practice, most methods approximate this by conditioning on point estimates
        <InlineMath math="\hat{\theta}" /> rather than integrating over parameter uncertainty.
      </DefinitionBlock>

      <h2>Deep Autoregressive Models (DeepAR)</h2>
      <p>
        DeepAR (Salinas et al., 2020) is Amazon's deep learning approach to distributional forecasting.
        It uses an LSTM to model temporal dynamics, then outputs the parameters of a chosen distribution
        at each time step:
      </p>
      <BlockMath math="p(z_{i,t} \mid z_{i,1:t-1}, x_{i,1:T}) = \ell(z_{i,t} \mid \theta(h_{i,t}))" />
      <p>
        where <InlineMath math="h_{i,t}" /> is the LSTM hidden state and <InlineMath math="\ell" /> is
        a likelihood function (Gaussian, Student-t, Negative Binomial for count data, etc.).
        Key advantages:
      </p>
      <ul>
        <li>Learns across thousands of related time series simultaneously</li>
        <li>Handles cold-start via learned covariate embeddings</li>
        <li>Choice of output distribution matches the data type</li>
        <li>Monte Carlo sampling naturally produces prediction intervals</li>
      </ul>

      <h2>Normalizing Flows for Time Series</h2>
      <p>
        Normalizing flows transform a simple base distribution (e.g., Gaussian) into a complex target
        distribution through a sequence of invertible mappings:
      </p>
      <BlockMath math="z = f_K \circ f_{K-1} \circ \cdots \circ f_1(x)" />
      <p>
        The log-likelihood is tractable via the change-of-variables formula:
      </p>
      <BlockMath math="\log p_X(x) = \log p_Z(z) + \sum_{k=1}^K \log \left|\det \frac{\partial f_k}{\partial z_{k-1}}\right|" />
      <p>
        In time series, flows are conditioned on the history <InlineMath math="h_t" /> (from an RNN or
        transformer), so the density at each future time step adapts to the observed context. Notable
        architectures include <strong>TimeGrad</strong> (diffusion-based) and <strong>TACTiS</strong>
        (transformer-attentional copulas).
      </p>

      <h2>Gaussian Processes for Time Series</h2>
      <p>
        A Gaussian Process (GP) defines a distribution over functions, making it naturally suited for
        uncertainty-aware time series modeling:
      </p>
      <BlockMath math="f(t) \sim \mathcal{GP}(\mu(t), k(t, t'))" />
      <p>
        The kernel <InlineMath math="k(t, t')" /> encodes prior beliefs about smoothness, periodicity,
        and scale. The posterior GP after observing data gives a closed-form predictive distribution:
      </p>
      <BlockMath math="f_* \mid X, y, X_* \sim \mathcal{N}(\bar{f}_*, \text{cov}(f_*))" />
      <p>
        GP forecasting is most practical for shorter series (due to <InlineMath math="O(n^3)" /> cost)
        or when combined with sparse approximations (inducing point methods).
      </p>

      <h2>CRPS: The Proper Scoring Rule for Distributions</h2>
      <p>
        The <strong>Continuous Ranked Probability Score</strong> (CRPS) is the standard metric for
        evaluating distributional forecasts. It generalizes MAE to the distributional setting:
      </p>
      <BlockMath math="\text{CRPS}(F, y) = \int_{-\infty}^{\infty} (F(z) - \mathbf{1}[z \geq y])^2 \, dz" />
      <p>
        where <InlineMath math="F" /> is the predicted CDF and <InlineMath math="y" /> is the observation.
        Equivalently:
      </p>
      <BlockMath math="\text{CRPS}(F, y) = \mathbb{E}_{F}|Y - y| - \frac{1}{2}\mathbb{E}_{F}|Y - Y'|" />
      <p>
        where <InlineMath math="Y, Y'" /> are independent draws from <InlineMath math="F" />.
        This representation enables CRPS computation from samples without knowing the analytical form of <InlineMath math="F" />.
      </p>

      <TheoremBlock title="Propriety of CRPS">
        CRPS is a <strong>strictly proper scoring rule</strong>: the expected CRPS is minimized if and
        only if the forecaster reports their true predictive distribution <InlineMath math="F = G" />,
        where <InlineMath math="G" /> is the true distribution generating the observations. No incentive
        exists to misreport the distribution.
      </TheoremBlock>

      <NoteBlock title="CRPS vs. Log Score">
        The log score <InlineMath math="-\log p(y)" /> is another proper scoring rule that heavily penalizes
        overconfident forecasts (when <InlineMath math="p(y)" /> is small). CRPS is less sensitive to
        extreme events and more robust to outliers. For heavy-tailed processes, CRPS is often preferred
        because it does not blow up when the predicted density near the observation is close to zero.
      </NoteBlock>

      <h2>Energy Score for Multivariate Distributions</h2>
      <p>
        When forecasting multiple horizons jointly, the Energy Score generalizes CRPS to
        multivariate distributions:
      </p>
      <BlockMath math="\text{ES}(F, \mathbf{y}) = \mathbb{E}_F \|\mathbf{Y} - \mathbf{y}\| - \frac{1}{2}\mathbb{E}_F \|\mathbf{Y} - \mathbf{Y}'\|" />
      <p>
        It is also strictly proper and can be estimated from Monte Carlo samples of the predictive distribution.
      </p>

      <WarningBlock title="Sampling vs. Analytic Evaluation">
        Many deep learning models produce forecast distributions through Monte Carlo sampling. When
        evaluating CRPS from samples, use a sufficiently large sample size (at least 200-500 paths)
        to get stable estimates. Too few samples leads to noisy CRPS estimates that may misrank models.
      </WarningBlock>

      <h2>Implementation with NeuralForecast</h2>

      <PythonCode code={`import numpy as np
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
`} />

      <ReferenceList references={[
        {
          title: 'DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks',
          authors: 'Salinas, D., Flunkert, V., Gasthaus, J. & Januschowski, T.',
          year: 2020,
          journal: 'International Journal of Forecasting',
        },
        {
          title: 'Strictly Proper Scoring Rules, Prediction, and Estimation',
          authors: 'Gneiting, T. & Raftery, A.E.',
          year: 2007,
          journal: 'Journal of the American Statistical Association',
        },
        {
          title: 'Neural Basis Expansion Analysis with Exogenous Variables (NBEATSx)',
          authors: 'Olivares, K.G. et al.',
          year: 2023,
          journal: 'International Journal of Forecasting',
        },
      ]} />
    </SectionLayout>
  );
}
