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
  title: 'sktime for Forecasting',
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Learn sktime\'s sklearn-compatible forecasting API: ForecastingHorizon, composable pipelines, and a unified interface for forecasting, classification, and regression.',
};

export default function SktimeIntro() {
  return (
    <SectionLayout title="sktime for Forecasting" metadata={metadata}>
      <p>
        sktime is a unified, sklearn-compatible library for time series machine learning, covering
        forecasting, classification, regression, clustering, and transformation. Its design mirrors
        scikit-learn: every estimator has <code>fit()</code>, <code>predict()</code>, and
        <code>get_params()</code> methods, enabling pipelines, grid search, and cross-validation
        to work seamlessly across all tasks.
      </p>

      <DefinitionBlock title="ForecastingHorizon">
        sktime's <code>ForecastingHorizon</code> (FH) object explicitly specifies <em>which future
        periods</em> to forecast, rather than just a scalar horizon length. It can be:
        <ul>
          <li><strong>Relative:</strong> <code>ForecastingHorizon([1, 2, 3, 6, 12])</code> — periods ahead from the cutoff</li>
          <li><strong>Absolute:</strong> <code>ForecastingHorizon(['2024-01', '2024-06'], is_relative=False)</code> — specific dates</li>
        </ul>
        This allows forecasting at irregular horizons (e.g., every quarter) without predicting all intermediate steps.
      </DefinitionBlock>

      <h2>sklearn-Compatible API</h2>
      <p>
        sktime forecasters follow the sklearn estimator protocol, enabling:
      </p>
      <ul>
        <li><strong>Pipeline composition:</strong> Chain transformers and forecasters with <code>TransformedTargetForecaster</code></li>
        <li><strong>Grid search:</strong> Use <code>ForecastingGridSearchCV</code> for hyperparameter tuning with temporal cross-validation</li>
        <li><strong>Reduced regression:</strong> Wrap any sklearn regressor as a forecaster using <code>make_reduction()</code></li>
        <li><strong>Ensembling:</strong> <code>EnsembleForecaster</code> combines multiple forecasters</li>
      </ul>

      <h2>Data Format</h2>
      <p>
        sktime uses pandas Series or DataFrames with a <code>PeriodIndex</code> or
        <code>DatetimeIndex</code>. For panel data (multiple series), it uses a multi-index DataFrame
        with levels (instance_id, time). The convention is consistent across all tasks:
      </p>
      <ul>
        <li><strong>Univariate forecasting:</strong> <code>pd.Series</code> with <code>DatetimeIndex</code></li>
        <li><strong>Multivariate:</strong> <code>pd.DataFrame</code> with multiple columns</li>
        <li><strong>Panel (multiple series):</strong> <code>pd.DataFrame</code> with 2-level multi-index <code>(series_id, time)</code></li>
      </ul>

      <h2>Reduction: ML Forecasting via sklearn</h2>
      <p>
        The reduction approach transforms forecasting into a tabular regression problem using
        <code>make_reduction()</code>. Under the hood, it creates lag features automatically:
      </p>
      <BlockMath math="\hat{y}_{t+h} = f(y_t, y_{t-1}, \ldots, y_{t-w+1})" />
      <p>
        Any sklearn regressor can be wrapped, enabling the full sklearn ecosystem (regularization,
        ensemble methods, pipelines) to be applied to time series forecasting.
      </p>

      <h2>Composable Pipelines</h2>
      <p>
        sktime's <code>TransformedTargetForecaster</code> chains preprocessing steps with a forecaster:
      </p>
      <ul>
        <li><strong>Deseasonalizer:</strong> Remove and restore seasonal patterns</li>
        <li><strong>Detrender:</strong> Remove and restore trend</li>
        <li><strong>BoxCoxTransformer:</strong> Variance stabilization</li>
        <li><strong>Imputer:</strong> Fill missing values before modeling</li>
      </ul>
      <p>
        The pipeline's <code>fit()</code> and <code>predict()</code> methods handle the full
        transform-fit-inverse-transform cycle automatically.
      </p>

      <NoteBlock title="sktime vs Darts vs StatsForecast">
        Each library has distinct strengths:
        <ul>
          <li><strong>sktime:</strong> Best for sklearn integration, pipelines, and diverse time series tasks (not just forecasting)</li>
          <li><strong>Darts:</strong> Best for easy model comparison and built-in backtesting framework</li>
          <li><strong>StatsForecast:</strong> Best for speed at scale with classical statistical models</li>
        </ul>
        They are complementary and can be used together.
      </NoteBlock>

      <PythonCode code={`import pandas as pd
import numpy as np
from sktime.forecasting.arima import AutoARIMA
from sktime.forecasting.exp_smoothing import ExponentialSmoothing
from sktime.forecasting.naive import NaiveForecaster
from sktime.forecasting.base import ForecastingHorizon
from sktime.forecasting.model_selection import (
    ExpandingWindowSplitter, ForecastingGridSearchCV
)
from sktime.forecasting.compose import (
    TransformedTargetForecaster, EnsembleForecaster, make_reduction
)
from sktime.transformations.series.detrend import Deseasonalizer, Detrender
from sktime.transformations.series.boxcox import BoxCoxTransformer
from sklearn.ensemble import GradientBoostingRegressor
from sktime.performance_metrics.forecasting import mean_absolute_percentage_error

# ── Generate monthly time series ──────────────────────────────────────────────
np.random.seed(42)
T = 120
t = np.arange(T)
y = (100 + 0.5 * t
     + 15 * np.sin(2 * np.pi * t / 12)
     + np.random.randn(T) * 5)
dates = pd.period_range('2014-01', periods=T, freq='M')
series = pd.Series(y, index=dates, name='sales')

# Train/test split
n_test = 12
y_train, y_test = series[:-n_test], series[-n_test:]

# ── ForecastingHorizon ───────────────────────────────────────────────────────
fh = ForecastingHorizon(np.arange(1, n_test + 1))  # 1 to 12 steps ahead
fh_irregular = ForecastingHorizon([1, 3, 6, 12])   # only specific horizons

# ── Basic forecasters ─────────────────────────────────────────────────────────
# Naive baseline
naive = NaiveForecaster(strategy='last', sp=12)  # seasonal naive
naive.fit(y_train)
naive_pred = naive.predict(fh)

# AutoARIMA
auto_arima = AutoARIMA(sp=12, suppress_warnings=True)
auto_arima.fit(y_train)
arima_pred = auto_arima.predict(fh)

# Exponential Smoothing
ets = ExponentialSmoothing(trend='add', seasonal='add', sp=12)
ets.fit(y_train)
ets_pred = ets.predict(fh)

# Evaluate
for name, pred in [('Naive', naive_pred), ('AutoARIMA', arima_pred), ('ETS', ets_pred)]:
    mape = mean_absolute_percentage_error(y_test, pred)
    print(f"{name}: MAPE = {mape:.3f}")

# ── Pipeline: Detrend + Deseasonalize + ARIMA ────────────────────────────────
pipeline = TransformedTargetForecaster([
    ('detrend', Detrender()),
    ('deseasonalize', Deseasonalizer(sp=12)),
    ('forecaster', AutoARIMA(suppress_warnings=True)),
])
pipeline.fit(y_train)
pipeline_pred = pipeline.predict(fh)
mape_pipe = mean_absolute_percentage_error(y_test, pipeline_pred)
print(f"Pipeline (detrend+deseason+ARIMA): MAPE = {mape_pipe:.3f}")

# ── Reduction: sklearn regressor as forecaster ────────────────────────────────
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor

# Direct strategy: separate model per horizon step
rf_forecaster = make_reduction(
    RandomForestRegressor(n_estimators=100, random_state=42),
    window_length=24,         # use 24 lags as features
    strategy='direct',        # separate model per step
)
rf_forecaster.fit(y_train)
rf_pred = rf_forecaster.predict(fh)
mape_rf = mean_absolute_percentage_error(y_test, rf_pred)
print(f"RF (direct reduction): MAPE = {mape_rf:.3f}")

# Recursive strategy: one model, predict step-by-step
gbm_forecaster = make_reduction(
    GradientBoostingRegressor(n_estimators=200, max_depth=3),
    window_length=24,
    strategy='recursive',
)
gbm_forecaster.fit(y_train)
gbm_pred = gbm_forecaster.predict(fh)
mape_gbm = mean_absolute_percentage_error(y_test, gbm_pred)
print(f"GBM (recursive reduction): MAPE = {mape_gbm:.3f}")

# ── Ensemble forecaster ───────────────────────────────────────────────────────
ensemble = EnsembleForecaster([
    ('ets', ExponentialSmoothing(trend='add', seasonal='add', sp=12)),
    ('arima', AutoARIMA(sp=12, suppress_warnings=True)),
    ('gbm', make_reduction(GradientBoostingRegressor(n_estimators=100),
                           window_length=12, strategy='recursive')),
])
ensemble.fit(y_train)
ensemble_pred = ensemble.predict(fh)
mape_ens = mean_absolute_percentage_error(y_test, ensemble_pred)
print(f"Ensemble: MAPE = {mape_ens:.3f}")

# ── Grid search with temporal CV ──────────────────────────────────────────────
cv = ExpandingWindowSplitter(
    step_length=12,
    fh=np.arange(1, 13),
    initial_window=60,
)

param_grid = {
    'window_length': [12, 18, 24, 36],
}

grid_search = ForecastingGridSearchCV(
    make_reduction(Ridge(), strategy='recursive'),
    cv=cv,
    param_grid=param_grid,
    scoring=mean_absolute_percentage_error,
    n_jobs=-1,
)
grid_search.fit(y_train)
print(f"\\nBest window_length: {grid_search.best_params_}")
print(f"Best CV MAPE: {grid_search.best_score_:.3f}")

best_pred = grid_search.predict(fh)
mape_best = mean_absolute_percentage_error(y_test, best_pred)
print(f"Test MAPE (best model): {mape_best:.3f}")
`} />

      <WarningBlock title="PeriodIndex vs DatetimeIndex in sktime">
        sktime works best with <code>pd.PeriodIndex</code> rather than <code>pd.DatetimeIndex</code>.
        PeriodIndex avoids ambiguities around daylight saving time and frequency inference. Convert
        with <code>series.to_period('M')</code> for monthly data. If your data has a DatetimeIndex,
        sktime will usually convert automatically, but explicit conversion is safer.
      </WarningBlock>

      <ReferenceList references={[
        {
          title: 'sktime: A unified interface for machine learning with time series',
          authors: 'Löning, M. et al.',
          year: 2019,
          journal: 'NeurIPS Workshop',
          url: 'https://arxiv.org/abs/1909.07872',
        },
        {
          title: 'Reducing the forecasting problem',
          authors: 'Taieb, S.B. & Hyndman, R.J.',
          year: 2012,
          journal: 'International Journal of Forecasting',
        },
      ]} />
    </SectionLayout>
  );
}
