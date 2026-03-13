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
  title: 'Forecasting Visualization',
  difficulty: 'beginner',
  readingTime: 8,
  description: 'Create clear, informative forecasting visualizations: time series plots, fan charts for uncertainty, ACF/PACF plots, and interactive Plotly charts.',
};

export default function ForecastingVisualization() {
  return (
    <SectionLayout title="Forecasting Visualization" metadata={metadata}>
      <p>
        Clear visualization is essential throughout the forecasting workflow: exploratory analysis,
        model diagnostics, and communicating results to stakeholders. This section covers the essential
        plot types using matplotlib for publication-quality static charts and Plotly for interactive
        exploration.
      </p>

      <h2>Essential Plot Types for Forecasting</h2>
      <ul>
        <li><strong>Time series plot:</strong> The baseline — always start by plotting your data</li>
        <li><strong>Fan chart:</strong> Visualize prediction intervals at multiple coverage levels</li>
        <li><strong>ACF/PACF:</strong> Diagnose autocorrelation structure and AR/MA order</li>
        <li><strong>Residual plots:</strong> Assess model fit and check for systematic errors</li>
        <li><strong>Forecast comparison:</strong> Compare multiple models on the same axes</li>
        <li><strong>Decomposition:</strong> Trend, seasonal, and residual components</li>
      </ul>

      <DefinitionBlock title="Fan Chart">
        A <strong>fan chart</strong> displays a central forecast surrounded by shaded bands representing
        prediction intervals at multiple coverage levels (e.g., 50%, 80%, 95%). The bands typically
        use a sequential colormap — darker near the center (high confidence), lighter at the edges
        (low confidence) — providing an intuitive visualization of forecast uncertainty that widens
        over the horizon.
      </DefinitionBlock>

      <h2>Matplotlib: Time Series and Fan Charts</h2>

      <PythonCode code={`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from statsforecast import StatsForecast
from statsforecast.models import AutoARIMA, AutoETS

# ── Generate sample data ──────────────────────────────────────────────────────
np.random.seed(42)
T = 156  # 3 years weekly
t = np.arange(T)
y = 100 + 0.4 * t + 15 * np.sin(2 * np.pi * t / 52) + np.random.randn(T) * 6
dates = pd.date_range('2021-01-01', periods=T, freq='W')

df = pd.DataFrame({'unique_id': 'series_1', 'ds': dates, 'y': y})
train = df.iloc[:-12]
test  = df.iloc[-12:]

# Fit and get forecast with PIs
sf = StatsForecast(models=[AutoARIMA(season_length=52)], freq='W', n_jobs=1)
sf.fit(train)
fc = sf.predict(h=12, level=[50, 80, 95])

# ── 1. Basic time series + forecast plot ─────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 5))

ax.plot(train['ds'], train['y'], color='#1f2937', lw=1.5, label='Historical')
ax.plot(test['ds'], test['y'], color='#6b7280', lw=1.5, ls='--', label='Actual (holdout)')

# Fan chart: multiple PI levels
model = 'AutoARIMA'
ax.fill_between(fc['ds'],
    fc[f'{model}-lo-95'], fc[f'{model}-hi-95'],
    alpha=0.15, color='#6366f1', label='95% PI')
ax.fill_between(fc['ds'],
    fc[f'{model}-lo-80'], fc[f'{model}-hi-80'],
    alpha=0.25, color='#6366f1', label='80% PI')
ax.fill_between(fc['ds'],
    fc[f'{model}-lo-50'], fc[f'{model}-hi-50'],
    alpha=0.40, color='#6366f1', label='50% PI')
ax.plot(fc['ds'], fc[model], color='#6366f1', lw=2, label='Forecast')

ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
ax.xaxis.set_major_locator(mdates.MonthLocator(interval=6))
plt.xticks(rotation=30)
ax.set_xlabel('Date')
ax.set_ylabel('Value')
ax.set_title('AutoARIMA Forecast with Prediction Intervals', fontsize=13)
ax.legend(loc='upper left', fontsize=9)
ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('forecast_fan_chart.png', dpi=150)
plt.show()

# ── 2. Multi-model comparison plot ───────────────────────────────────────────
sf2 = StatsForecast(
    models=[AutoARIMA(season_length=52), AutoETS(season_length=52)],
    freq='W', n_jobs=1
)
sf2.fit(train)
fc2 = sf2.predict(h=12, level=[95])

fig, ax = plt.subplots(figsize=(12, 5))
ax.plot(train['ds'], train['y'], color='#1f2937', lw=1.5, label='Historical')
ax.plot(test['ds'], test['y'], color='#6b7280', lw=1.5, ls='--', label='Actual')

colors = {'AutoARIMA': '#6366f1', 'AutoETS': '#f59e0b'}
for model_name, color in colors.items():
    ax.fill_between(fc2['ds'],
        fc2[f'{model_name}-lo-95'], fc2[f'{model_name}-hi-95'],
        alpha=0.15, color=color)
    ax.plot(fc2['ds'], fc2[model_name], color=color, lw=2, label=model_name)

ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
ax.legend()
ax.set_title('AutoARIMA vs AutoETS Forecast Comparison')
ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('model_comparison.png', dpi=150)
plt.show()
`} />

      <h2>ACF and PACF Plots</h2>

      <PythonCode code={`import matplotlib.pyplot as plt
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.stattools import acf, pacf
import numpy as np
import pandas as pd

# ── ACF and PACF side by side ─────────────────────────────────────────────────
np.random.seed(42)
y = np.cumsum(np.random.randn(200)) + 50  # random walk with trend

fig, axes = plt.subplots(1, 2, figsize=(13, 4))

plot_acf(y, lags=40, ax=axes[0], alpha=0.05)
axes[0].set_title('Autocorrelation Function (ACF)', fontsize=12)
axes[0].set_xlabel('Lag')

plot_pacf(y, lags=40, ax=axes[1], alpha=0.05, method='ywm')
axes[1].set_title('Partial Autocorrelation Function (PACF)', fontsize=12)
axes[1].set_xlabel('Lag')

plt.tight_layout()
plt.savefig('acf_pacf.png', dpi=150)
plt.show()

# ── Residual diagnostic plots ─────────────────────────────────────────────────
from statsmodels.tsa.statespace.sarimax import SARIMAX

dates = pd.date_range('2019-01-01', periods=200, freq='W')
series = pd.Series(y, index=dates)

model = SARIMAX(series, order=(1, 1, 1))
result = model.fit(disp=False)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Residuals over time
residuals = result.resid
axes[0, 0].plot(series.index, residuals, color='#6366f1', lw=1)
axes[0, 0].axhline(0, color='red', lw=0.5, ls='--')
axes[0, 0].set_title('Residuals Over Time')
axes[0, 0].set_xlabel('Date')

# Residual histogram
axes[0, 1].hist(residuals, bins=30, color='#6366f1', edgecolor='white', alpha=0.8)
axes[0, 1].set_title('Residual Distribution')
axes[0, 1].set_xlabel('Residual')

# ACF of residuals
plot_acf(residuals, lags=20, ax=axes[1, 0], alpha=0.05)
axes[1, 0].set_title('ACF of Residuals (should be white noise)')

# QQ plot
from scipy import stats
stats.probplot(residuals, dist='norm', plot=axes[1, 1])
axes[1, 1].set_title('Normal Q-Q Plot')

plt.suptitle('ARIMA Residual Diagnostics', fontsize=13, y=1.01)
plt.tight_layout()
plt.savefig('residual_diagnostics.png', dpi=150)
plt.show()
`} />

      <h2>Plotly: Interactive Forecast Charts</h2>

      <PythonCode code={`import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import numpy as np
import pandas as pd

# ── Interactive fan chart with Plotly ─────────────────────────────────────────
np.random.seed(42)
T_hist = 100
T_fc   = 20
t_hist = np.arange(T_hist)
y_hist = 50 + 0.3 * t_hist + 8 * np.sin(2 * np.pi * t_hist / 52) + np.random.randn(T_hist) * 3

# Simulate forecast + intervals
t_fc = np.arange(T_hist, T_hist + T_fc)
y_fc = 50 + 0.3 * t_fc + 8 * np.sin(2 * np.pi * t_fc / 52)
growing_noise = np.linspace(3, 10, T_fc)
lo_95 = y_fc - 1.96 * growing_noise
hi_95 = y_fc + 1.96 * growing_noise
lo_80 = y_fc - 1.28 * growing_noise
hi_80 = y_fc + 1.28 * growing_noise
lo_50 = y_fc - 0.67 * growing_noise
hi_50 = y_fc + 0.67 * growing_noise

fig = go.Figure()

# Historical series
fig.add_trace(go.Scatter(
    x=list(t_hist), y=list(y_hist),
    mode='lines', name='Historical',
    line=dict(color='#1f2937', width=2)
))

# PI bands (plotly convention: fill 'tonexty' or use fill between traces)
fig.add_trace(go.Scatter(
    x=list(t_fc) + list(t_fc[::-1]),
    y=list(hi_95) + list(lo_95[::-1]),
    fill='toself', fillcolor='rgba(99, 102, 241, 0.1)',
    line=dict(color='rgba(99, 102, 241, 0)'),
    name='95% PI', showlegend=True
))
fig.add_trace(go.Scatter(
    x=list(t_fc) + list(t_fc[::-1]),
    y=list(hi_80) + list(lo_80[::-1]),
    fill='toself', fillcolor='rgba(99, 102, 241, 0.2)',
    line=dict(color='rgba(99, 102, 241, 0)'),
    name='80% PI'
))
fig.add_trace(go.Scatter(
    x=list(t_fc) + list(t_fc[::-1]),
    y=list(hi_50) + list(lo_50[::-1]),
    fill='toself', fillcolor='rgba(99, 102, 241, 0.35)',
    line=dict(color='rgba(99, 102, 241, 0)'),
    name='50% PI'
))
fig.add_trace(go.Scatter(
    x=list(t_fc), y=list(y_fc),
    mode='lines', name='Forecast',
    line=dict(color='#6366f1', width=2, dash='dash')
))

fig.update_layout(
    title='Interactive Forecast Fan Chart',
    xaxis_title='Time', yaxis_title='Value',
    hovermode='x unified',
    template='plotly_white',
    legend=dict(yanchor='top', y=0.99, xanchor='left', x=0.01)
)
fig.write_html('forecast_interactive.html')
# fig.show()  # uncomment in Jupyter

# ── STL Decomposition visualization ──────────────────────────────────────────
from statsmodels.tsa.seasonal import STL

dates = pd.date_range('2019-01-01', periods=200, freq='W')
y = pd.Series(y_hist, index=dates[:T_hist])

stl = STL(y, period=52, robust=True)
stl_result = stl.fit()

fig2 = make_subplots(rows=4, cols=1, shared_xaxes=True,
                     subplot_titles=['Observed', 'Trend', 'Seasonal', 'Residual'],
                     vertical_spacing=0.06)

components = [
    (stl_result.observed, '#1f2937'),
    (stl_result.trend,    '#6366f1'),
    (stl_result.seasonal, '#f59e0b'),
    (stl_result.resid,    '#ef4444'),
]
for i, (comp, color) in enumerate(components, 1):
    fig2.add_trace(
        go.Scatter(x=dates[:T_hist], y=comp,
                   mode='lines', line=dict(color=color, width=1.5),
                   showlegend=False),
        row=i, col=1
    )

fig2.update_layout(height=700, title_text='STL Decomposition', template='plotly_white')
fig2.write_html('stl_decomposition.html')
print("Saved interactive charts to HTML files.")
`} />

      <NoteBlock title="Matplotlib vs Plotly for Forecasting">
        Use matplotlib for:
        <ul>
          <li>Publication-quality static figures (papers, reports, PDFs)</li>
          <li>Complex multi-panel diagnostic layouts</li>
          <li>ACF/PACF (statsmodels integrates with matplotlib natively)</li>
        </ul>
        Use Plotly for:
        <ul>
          <li>Dashboards and web applications (Dash, Streamlit)</li>
          <li>Exploring many series interactively (hover, zoom, pan)</li>
          <li>Presentations where interactive zooming adds value</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        {
          title: 'Matplotlib: A 2D Graphics Environment',
          authors: 'Hunter, J.D.',
          year: 2007,
          journal: 'Computing in Science & Engineering',
        },
        {
          title: 'Plotly Python Open Source Graphing Library',
          authors: 'Plotly Technologies Inc.',
          year: 2015,
          url: 'https://plotly.com/python/',
        },
      ]} />
    </SectionLayout>
  );
}
