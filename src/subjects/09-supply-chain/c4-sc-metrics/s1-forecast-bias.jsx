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
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const trackingData = Array.from({ length: 24 }, (_, i) => {
  const signal = Math.sin(i / 4) * 0.4 + (i > 12 ? 0.3 : -0.1);
  return { period: i + 1, tracking_signal: parseFloat(signal.toFixed(3)) };
});

export default function ForecastBias() {
  return (
    <SectionLayout
      title="Forecast Bias and Error Analysis"
      subject="Supply Chain Forecasting"
      difficulty="intermediate"
      readingTime={10}
    >
      <p>
        Forecast accuracy measurement is the foundation of any demand planning improvement cycle. But not all
        metrics are equal: the wrong metric can optimize for the wrong objective, hide systematic biases, or
        be dominated by a handful of high-volume SKUs. Supply chain forecasting requires metrics that are
        interpretable, scale-invariant, robust to intermittent demand, and connected to business outcomes.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-3">Core Error Metrics</h2>

      <DefinitionBlock title="MAPE — Mean Absolute Percentage Error">
        <BlockMath math="\text{MAPE} = \frac{100}{n} \sum_{t=1}^n \left|\frac{y_t - \hat{y}_t}{y_t}\right|" />
        Widely used due to interpretability (% error). Fatal flaw: undefined or explodes when
        <InlineMath math="y_t = 0" />, making it unsuitable for intermittent demand. Also asymmetric:
        overcorrects when actuals are small.
      </DefinitionBlock>

      <DefinitionBlock title="WMAPE — Weighted MAPE">
        <BlockMath math="\text{WMAPE} = \frac{\sum_{t=1}^n |y_t - \hat{y}_t|}{\sum_{t=1}^n y_t}" />
        Weights errors by demand volume, reducing sensitivity to low-volume periods. Equivalent to
        total absolute error as a fraction of total demand. The preferred metric in most supply chain
        settings because it naturally aligns with business impact.
      </DefinitionBlock>

      <DefinitionBlock title="MASE — Mean Absolute Scaled Error">
        <BlockMath math="\text{MASE} = \frac{\text{MAE}}{\frac{1}{n-1}\sum_{t=2}^n |y_t - y_{t-1}|}" />
        Scales MAE by the in-sample naive (random walk) MAE. Values below 1 mean the model beats the
        naive benchmark. Handles zeros, handles different scales, and is interpretable across SKUs.
        Recommended by Hyndman & Koehler (2006) as the most robust general-purpose metric.
      </DefinitionBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Bias Detection</h2>

      <DefinitionBlock title="Forecast Bias (Mean Error)">
        <BlockMath math="\text{Bias} = \frac{1}{n}\sum_{t=1}^n (y_t - \hat{y}_t)" />
        Positive bias means systematic under-forecasting (actual > forecast → stockouts).
        Negative bias means systematic over-forecasting (actual &lt; forecast → overstock).
        Bias should be tested for statistical significance before drawing conclusions.
      </DefinitionBlock>

      <DefinitionBlock title="Tracking Signal">
        The tracking signal monitors running bias relative to MAD:
        <BlockMath math="\text{TS}_t = \frac{\sum_{i=1}^t (y_i - \hat{y}_i)}{\text{MAD}_t}" />
        where <InlineMath math="\text{MAD}_t = \frac{1}{t}\sum_{i=1}^t |y_i - \hat{y}_i|" />.
        Control limits are typically ±4 to ±6 MADs. Exceeding these triggers a model review.
      </DefinitionBlock>

      <div className="my-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Tracking Signal Over Time</h3>
        <p className="text-sm text-gray-600 mb-3">
          Control limits at ±4 MAD. Signal crossing ±4 triggers review. The upward drift after period 12
          indicates emerging under-forecast bias.
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trackingData} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" label={{ value: 'Period', position: 'insideBottom', offset: -10 }} />
            <YAxis domain={[-5, 5]} label={{ value: 'Tracking Signal', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="4 2" label={{ value: '+4', fill: '#ef4444' }} />
            <ReferenceLine y={-4} stroke="#ef4444" strokeDasharray="4 2" label={{ value: '-4', fill: '#ef4444' }} />
            <ReferenceLine y={0} stroke="#6b7280" />
            <Line dataKey="tracking_signal" stroke="#3b82f6" strokeWidth={2} dot={false} name="Tracking Signal" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-3">Theil's U Statistic</h2>

      <DefinitionBlock title="Theil's U2">
        Compares model to the naive (no-change) forecast:
        <BlockMath math="U_2 = \sqrt{\frac{\sum_{t=1}^{n-1}(e_{t+1}/y_t)^2}{\sum_{t=1}^{n-1}((y_{t+1}-y_t)/y_t)^2}}" />
        <InlineMath math="U_2 < 1" />: model outperforms naive. <InlineMath math="U_2 = 1" />: model is as
        good as naive (unacceptable). <InlineMath math="U_2 > 1" />: model is worse than naive.
      </DefinitionBlock>

      <ExampleBlock title="Metric Selection by SKU Type">
        <table className="text-sm border-collapse w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">SKU Type</th>
              <th className="border p-2">Recommended Metric</th>
              <th className="border p-2">Avoid</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Smooth, high-volume', 'MAPE, WMAPE', 'Nothing severe'],
              ['Intermittent', 'MASE, MAE, WMAPE', 'MAPE (division by zero)'],
              ['New products (<6 periods)', 'MAE, scaled by initial forecast', 'MAPE, MASE (insufficient history)'],
              ['Cross-SKU comparison', 'MASE, WMAPE', 'MAE, RMSE (scale-dependent)'],
              ['Portfolio-level', 'WMAPE (demand-weighted)', 'Unweighted MAPE (small SKU dominance)'],
            ].map(([sku, rec, av]) => (
              <tr key={sku}>
                <td className="border p-2 font-medium">{sku}</td>
                <td className="border p-2 text-green-700 text-xs">{rec}</td>
                <td className="border p-2 text-red-600 text-xs">{av}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ExampleBlock>

      <h2 className="text-xl font-bold mt-6 mb-3">Bias Correction Methods</h2>
      <p>
        When systematic bias is detected, two main correction strategies exist:
      </p>
      <ul className="list-disc ml-5 space-y-2 text-sm mt-2">
        <li><strong>Additive correction</strong>: Add the mean error to future forecasts. Works for constant
        bias but can over-correct if the bias is temporary.</li>
        <li><strong>Multiplicative correction</strong>: Multiply forecasts by the ratio of mean actual to mean
        forecast. Better when bias scales with demand level (common for seasonal items).</li>
        <li><strong>Root cause investigation</strong>: The best long-term fix is identifying <em>why</em>
        the bias exists. Common causes: missing promotion effects, incorrect seasonality, demand being
        cannibalized by a new product, or structural change in customer behavior.</li>
      </ul>

      <NoteBlock>
        Aggregate bias metrics can hide opposing biases at the SKU level. A portfolio WMAPE of 18% with zero
        aggregate bias could have 40% of SKUs systematically over-forecast and 60% systematically under-forecast,
        with the errors offsetting in aggregate. Always decompose bias analysis by product category, region,
        and lifecycle stage.
      </NoteBlock>

      <WarningBlock>
        MAPE is the most commonly reported metric in supply chain settings but is the least appropriate for
        portfolios with intermittent demand. If your reporting dashboard shows MAPE only, you are flying blind
        on 30–60% of your SKU portfolio. Migrate to WMAPE + MASE for comprehensive monitoring.
      </WarningBlock>

      <PythonCode
        title="Comprehensive Error Metrics for Supply Chain"
        code={`import numpy as np
import pandas as pd
from scipy import stats

def compute_sc_metrics(actuals: np.ndarray, forecasts: np.ndarray,
                       naive_forecasts: np.ndarray = None) -> dict:
    """
    Compute supply chain-relevant forecast error metrics.
    Returns dict of metric name -> value.
    """
    errors   = actuals - forecasts
    abs_err  = np.abs(errors)
    n        = len(actuals)

    metrics = {}

    # ── Basic metrics ─────────────────────────────────────────────────────────
    metrics['MAE']  = abs_err.mean()
    metrics['RMSE'] = np.sqrt((errors**2).mean())
    metrics['Bias'] = errors.mean()

    # ── MAPE (only on nonzero actuals) ────────────────────────────────────────
    nz_mask = actuals > 0
    if nz_mask.sum() > 0:
        metrics['MAPE'] = (abs_err[nz_mask] / actuals[nz_mask]).mean() * 100
    else:
        metrics['MAPE'] = np.nan

    # ── WMAPE ─────────────────────────────────────────────────────────────────
    metrics['WMAPE'] = abs_err.sum() / actuals.sum() * 100 if actuals.sum() > 0 else np.nan

    # ── MASE ─────────────────────────────────────────────────────────────────
    naive_mae = np.abs(np.diff(actuals)).mean()  # naive in-sample scale
    metrics['MASE'] = abs_err.mean() / naive_mae if naive_mae > 0 else np.nan

    # ── Theil's U2 ────────────────────────────────────────────────────────────
    if naive_forecasts is not None and len(naive_forecasts) == n:
        model_pct  = (errors / np.where(actuals > 0, actuals, np.nan))[:-1]
        naive_err  = actuals[1:] - naive_forecasts[1:]
        naive_pct  = (naive_err / np.where(actuals[:-1] > 0, actuals[:-1], np.nan))
        valid      = np.isfinite(model_pct) & np.isfinite(naive_pct)
        if valid.sum() > 0:
            metrics['TheilU2'] = np.sqrt(np.nansum(model_pct[valid]**2) /
                                          np.nansum(naive_pct[valid]**2))

    # ── Bias significance (t-test) ────────────────────────────────────────────
    t_stat, p_value = stats.ttest_1samp(errors, 0)
    metrics['Bias_tstat'] = t_stat
    metrics['Bias_pvalue'] = p_value
    metrics['Bias_significant'] = p_value < 0.05

    return {k: round(v, 4) if isinstance(v, float) else v for k, v in metrics.items()}


def tracking_signal(actuals: np.ndarray, forecasts: np.ndarray,
                    control_limit: float = 4.0) -> pd.DataFrame:
    """
    Compute cumulative tracking signal. Flags periods exceeding control limit.
    """
    errors   = actuals - forecasts
    cum_err  = np.cumsum(errors)
    mad      = np.array([np.abs(errors[:t+1]).mean() for t in range(len(errors))])
    ts       = cum_err / np.where(mad > 0, mad, np.nan)
    return pd.DataFrame({
        'period': np.arange(1, len(actuals) + 1),
        'error':  errors.round(2),
        'cum_error': cum_err.round(2),
        'MAD':    mad.round(3),
        'tracking_signal': ts.round(3),
        'alert':  np.abs(ts) > control_limit,
    })


# ── Example: compare two models ───────────────────────────────────────────────
np.random.seed(42)
n = 52
actuals   = 100 + 20 * np.sin(2 * np.pi * np.arange(n) / 52) + np.random.normal(0, 8, n)
naive_fc  = np.roll(actuals, 1); naive_fc[0] = actuals[0]
model_fc  = actuals * 0.95 + np.random.normal(0, 5, n)   # slight under-forecast

metrics = compute_sc_metrics(actuals, model_fc, naive_fc)
print("Forecast Error Metrics:")
for k, v in metrics.items():
    print(f"  {k:<22}: {v}")

ts_df = tracking_signal(actuals, model_fc)
alerts = ts_df[ts_df['alert']]
print(f"\\nTracking signal alerts (|TS| > 4): {len(alerts)} periods")
if len(alerts) > 0:
    print(alerts[['period', 'tracking_signal']].to_string(index=False))

# ── Bias correction ───────────────────────────────────────────────────────────
bias = metrics['Bias']
corrected_fc = model_fc + bias
metrics_corrected = compute_sc_metrics(actuals, corrected_fc)
print(f"\\nAfter additive bias correction:")
print(f"  Bias: {metrics_corrected['Bias']:.4f} (was {bias:.4f})")
print(f"  MAE:  {metrics_corrected['MAE']:.3f} (was {metrics['MAE']:.3f})")
`}
      />

      <ReferenceList
        references={[
          {
            author: 'Hyndman, R.J. & Koehler, A.B.',
            year: 2006,
            title: 'Another look at measures of forecast accuracy',
            journal: 'International Journal of Forecasting',
            volume: '22(4)',
            pages: '679–688',
          },
          {
            author: 'Kolassa, S. & Schütz, W.',
            year: 2007,
            title: 'Advantages of the MAD/Mean ratio over the MAPE',
            journal: 'Foresight: The International Journal of Applied Forecasting',
            volume: '6',
            pages: '40–43',
          },
        ]}
      />
    </SectionLayout>
  );
}
