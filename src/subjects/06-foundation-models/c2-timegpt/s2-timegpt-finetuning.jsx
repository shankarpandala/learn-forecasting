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
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

const makeCurve = (n, overfitAt) =>
  Array.from({ length: n }, (_, i) => {
    const k = i + 1;
    const train = +(0.44 * Math.exp(-0.028 * k) + 0.058).toFixed(4);
    const overfit = overfitAt && k > overfitAt ? (k - overfitAt) * 0.0028 : 0;
    const val = +(0.42 * Math.exp(-0.017 * k) + 0.078 + overfit).toFixed(4);
    return { step: k, train, val };
  });

const SCENARIOS = {
  10:  { label: '10 steps (under-fit)', color: '#f59e0b', data: makeCurve(60, null).slice(0, 60) },
  50:  { label: '50 steps (good fit)',  color: '#22c55e', data: makeCurve(60, null) },
  150: { label: '150 steps (overfit)',  color: '#ef4444', data: makeCurve(60, 40) },
};

const LOSS_OPTIONS = [
  { name: 'MAE',   desc: 'Optimizes the conditional median. Robust to outliers. Recommended default for most demand forecasting tasks.' },
  { name: 'MSE',   desc: 'Optimizes the conditional mean. Strongly penalizes large deviations; sensitive to spikes and outliers.' },
  { name: 'RMSE',  desc: 'Square root of MSE; same physical units as target. Useful for communicating error magnitude to stakeholders.' },
  { name: 'MAPE',  desc: 'Percentage-based. Undefined when y = 0 — avoid with intermittent or near-zero demand series.' },
  { name: 'SMAPE', desc: 'Symmetric MAPE — bounded [0, 200%] but still numerically unstable when |y| + |ŷ| ≈ 0.' },
];

const code = `from nixtla import NixtlaClient
import pandas as pd
import numpy as np

client = NixtlaClient(api_key="YOUR_NIXTLA_API_KEY")

# ── Prepare data (required cols: unique_id | ds | y) ─────────────────────────
df = pd.read_csv("weekly_demand.csv", parse_dates=["ds"])
cutoff = df["ds"].max() - pd.Timedelta(weeks=8)
train  = df[df["ds"] <= cutoff]
test   = df[df["ds"] >  cutoff]
H = 8

# ── 1. Zero-shot baseline ─────────────────────────────────────────────────────
fc_zs = client.forecast(
    df=train, h=H, freq="W",
    time_col="ds", target_col="y",
    model="timegpt-1",
)

# ── 2. Fine-tuned: 50 steps, MAE loss ─────────────────────────────────────────
fc_ft = client.forecast(
    df=train, h=H, freq="W",
    time_col="ds", target_col="y",
    model="timegpt-1",
    finetune_steps=50,
    finetune_loss="mae",
)

# ── 3. MASE evaluation on holdout ─────────────────────────────────────────────
def mase(y_true, y_pred, y_train, s=52):
    num = np.mean(np.abs(np.array(y_true) - np.array(y_pred)))
    den = np.mean(np.abs(y_train[s:] - y_train[:-s]))
    return num / den if den > 0 else np.nan

for label, fc in [("zero-shot", fc_zs), ("ft-50-mae", fc_ft)]:
    scores = []
    for uid, grp in test.groupby("unique_id"):
        pred   = fc[fc["unique_id"] == uid]["TimeGPT"].values
        actual = grp.sort_values("ds")["y"].values
        hist   = train[train["unique_id"] == uid]["y"].values
        scores.append(mase(actual, pred, hist))
    print(f"{label:14s}  MASE = {np.nanmean(scores):.4f}")

# ── 4. Cross-validation to pick optimal finetune_steps ───────────────────────
for steps in [0, 10, 50, 100, 200]:
    cv = client.cross_validation(
        df=df, h=H, n_windows=3, freq="W",
        time_col="ds", target_col="y",
        model="timegpt-1",
        finetune_steps=steps,
        finetune_loss="mae",
    )
    cv_mae = (cv["y"] - cv["TimeGPT"]).abs().mean()
    print(f"steps={steps:4d}  CV-MAE = {cv_mae:.4f}")
`;

export default function TimeGPTFinetuning() {
  const [activeSteps, setActiveSteps] = useState(50);
  const [activeLoss, setActiveLoss] = useState('MAE');

  const scenario = SCENARIOS[activeSteps];
  const lossInfo = LOSS_OPTIONS.find((l) => l.name === activeLoss);

  return (
    <SectionLayout title="Fine-Tuning TimeGPT" difficulty="advanced" readingTime={11}>
      <p>
        TimeGPT ships as a zero-shot API — no training required for inference. For most
        standard datasets, zero-shot performance is competitive with domain-specific
        models. But when your series exhibit patterns absent from the pre-training corpus
        — unusual seasonality, proprietary demand dynamics, or systematic zero-shot bias
        — fine-tuning with a small number of gradient steps can meaningfully reduce error
        at moderate additional cost.
      </p>

      <h2>When Fine-Tuning Helps</h2>

      <ExampleBlock title="Strong candidates for fine-tuning">
        <ul>
          <li>
            <strong>Unusual seasonality:</strong> fiscal-year cycles, religious holidays
            (Ramadan, Lunar New Year, Diwali), industry-specific patterns absent from
            public pre-training corpora.
          </li>
          <li>
            <strong>Proprietary dynamics:</strong> internal sales cycles correlated with
            marketing spend, promotion calendars, or business-specific triggers.
          </li>
          <li>
            <strong>Systematic zero-shot bias:</strong> when TimeGPT consistently
            over- or under-shoots on your data, gradient steps can re-calibrate
            the output distribution without changing the architecture.
          </li>
          <li>
            <strong>Long history available:</strong> series with 200+ observations provide
            enough signal for adaptation without memorizing noise.
          </li>
        </ul>
      </ExampleBlock>

      <ExampleBlock title="When zero-shot is likely better">
        <ul>
          <li>Very short series ({'<'} 50 obs) — not enough signal to adapt without overfitting.</li>
          <li>Cold-start: new series with no historical data at all.</li>
          <li>Standard retail or energy patterns well-represented in pre-training data.</li>
          <li>Cost-sensitive pipelines — fine-tuned API calls are billed at a higher rate.</li>
        </ul>
      </ExampleBlock>

      <h2>The <code>finetune_steps</code> Parameter</h2>

      <p>
        Fine-tuning runs <InlineMath>{`K`}</InlineMath> gradient steps on your
        training data, starting from pre-trained TimeGPT weights <InlineMath>{`\\theta_0`}</InlineMath>.
        The optimizer is AdamW with a cosine-decay learning rate schedule:
      </p>

      <BlockMath>{`\\theta_{k+1} = \\theta_k - \\eta_k \\,\\nabla_\\theta \\mathcal{L}(y, \\hat{y}(\\theta_k))`}</BlockMath>

      <BlockMath>{`\\eta_k = \\eta_{\\min} + \\tfrac{1}{2}(\\eta_0 - \\eta_{\\min})\\!\\left(1 + \\cos\\frac{\\pi k}{K}\\right)`}</BlockMath>

      <p>
        Nixtla servers manage <InlineMath>{`\\eta_0 \\approx 10^{-4}`}</InlineMath>, small
        enough to prevent <em>catastrophic forgetting</em> of pre-trained representations
        while still shifting the output layers toward domain-specific patterns.
      </p>

      <h3>Simulated Loss Curves</h3>
      <p>Select a step-count scenario to see typical train vs validation behaviour:</p>

      <div style={{ marginBottom: '1rem' }}>
        {Object.entries(SCENARIOS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setActiveSteps(Number(k))}
            style={{
              margin: '0.2rem', padding: '0.3rem 1rem', borderRadius: '4px', cursor: 'pointer',
              border: `1px solid ${v.color}`,
              background: activeSteps === Number(k) ? v.color : '#fff',
              color: activeSteps === Number(k) ? '#fff' : v.color,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={270}>
        <LineChart data={scenario.data} margin={{ top: 5, right: 20, left: 0, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="step" label={{ value: 'Gradient steps', position: 'insideBottom', offset: -8 }} />
          <YAxis domain={[0.04, 0.52]} tickFormatter={(v) => v.toFixed(2)} />
          <Tooltip formatter={(v) => v.toFixed(4)} />
          <Legend verticalAlign="top" />
          <Line dataKey="train" name="Train Loss" stroke="#6366f1" dot={false} strokeWidth={2} />
          <Line dataKey="val"   name="Val Loss"   stroke="#f59e0b" dot={false} strokeWidth={2} />
          {activeSteps === 150 && (
            <ReferenceLine x={40} stroke="#ef4444" strokeDasharray="5 5"
              label={{ value: 'Overfit onset', fill: '#ef4444', fontSize: 11, position: 'insideTopRight' }} />
          )}
        </LineChart>
      </ResponsiveContainer>

      <WarningBlock title="Overfitting on Short Series">
        Too many fine-tuning steps on short series causes the model to memorize
        training-set idiosyncrasies. A typical safe range is <strong>10–100 steps</strong>.
        Always verify with cross-validation (≥ 3 windows) rather than guessing.
      </WarningBlock>

      <h2>Choosing <code>finetune_loss</code></h2>

      <div style={{ marginBottom: '0.75rem' }}>
        {LOSS_OPTIONS.map((l) => (
          <button
            key={l.name}
            onClick={() => setActiveLoss(l.name)}
            style={{
              margin: '0.2rem', padding: '0.25rem 0.7rem', borderRadius: '4px', cursor: 'pointer',
              border: '1px solid #8b5cf6',
              background: activeLoss === l.name ? '#8b5cf6' : '#fff',
              color: activeLoss === l.name ? '#fff' : '#8b5cf6',
            }}
          >
            {l.name}
          </button>
        ))}
      </div>

      {lossInfo && (
        <div style={{
          background: '#f5f3ff', border: '1px solid #8b5cf6',
          borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.5rem',
        }}>
          <strong>{lossInfo.name}:</strong> {lossInfo.desc}
        </div>
      )}

      <NoteBlock title="Loss Function vs Evaluation Metric">
        <code>finetune_loss</code> is what gets minimized during gradient updates.
        Your holdout <em>evaluation metric</em> (MASE, WQL, CRPS) is separate.
        A common pattern: fine-tune with MAE, evaluate with MASE or WQL on the
        holdout to compare zero-shot against fine-tuned.
      </NoteBlock>

      <h2>Cost Implications</h2>

      <DefinitionBlock term="Fine-Tuning Cost Structure">
        Nixtla bills fine-tuning compute and inference separately:
        <ul>
          <li>Fine-tuning cost scales with <InlineMath>{`K \\times N_{\\text{series}} \\times T_{\\text{avg}}`}</InlineMath></li>
          <li>Inference with fine-tuned weights costs approximately 2× standard inference</li>
          <li>Weights are cached server-side for a session window; subsequent calls reuse cached weights</li>
        </ul>
        Measure MASE improvement vs extra cost before committing fine-tuned inference at scale.
      </DefinitionBlock>

      <h2>Evaluation Protocol</h2>

      <TheoremBlock title="Cross-Validation Protocol for Step Selection">
        <ol>
          <li>Partition data into <InlineMath>{`W \\geq 3`}</InlineMath> time-series cross-validation windows.</li>
          <li>Evaluate step counts <InlineMath>{`K \\in \\{0, 10, 50, 100, 200\\}`}</InlineMath> (K=0 is the zero-shot baseline).</li>
          <li>Select the smallest K achieving near-minimum average validation MASE — prefer fewer steps when the gain plateaus (Occam's razor).</li>
          <li>If the fine-tuned and zero-shot MASE differ by less than one standard error across windows, use zero-shot to avoid added cost and complexity.</li>
        </ol>
      </TheoremBlock>

      <PythonCode code={code} title="TimeGPT Fine-Tuning with Cross-Validation Step Selection" />

      <ReferenceList
        references={[
          {
            title: 'TimeGPT-1: The First Foundation Model for Time Series Forecasting',
            authors: 'Garza, Challu, Mergenthaler-Canseco',
            year: 2023,
            venue: 'arXiv:2310.03589',
          },
          {
            title: 'Decoupled Weight Decay Regularization (AdamW)',
            authors: 'Loshchilov & Hutter',
            year: 2019,
            venue: 'ICLR 2019',
          },
          {
            title: 'Nixtla Documentation: Fine-Tuning TimeGPT',
            authors: 'Nixtla Engineering Team',
            year: 2024,
            venue: 'docs.nixtla.io',
          },
        ]}
      />
    </SectionLayout>
  );
}
