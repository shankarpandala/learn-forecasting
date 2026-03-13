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

function FineTuningDecisionTree() {
  const [answer1, setAnswer1] = useState(null);
  const [answer2, setAnswer2] = useState(null);
  const recommendation = () => {
    if (answer1 === 'no') return { text: 'Use zero-shot TimeGPT', color: 'bg-green-100 border-green-300 text-green-800' };
    if (answer1 === 'yes' && answer2 === 'no') return { text: 'Use zero-shot TimeGPT — not enough data to fine-tune', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' };
    if (answer1 === 'yes' && answer2 === 'yes') return { text: 'Fine-tune TimeGPT — likely to improve accuracy', color: 'bg-purple-100 border-purple-300 text-purple-800' };
    return null;
  };
  const rec = recommendation();
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-4">Should You Fine-Tune?</h4>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Is zero-shot TimeGPT underperforming your baseline?</p>
          <div className="flex gap-2">
            {[['yes', 'Yes'], ['no', 'No (zero-shot is good enough)']].map(([v, l]) => (
              <button key={v} onClick={() => { setAnswer1(v); setAnswer2(null); }}
                className={`px-4 py-2 rounded text-sm border transition-all ${answer1 === v ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        {answer1 === 'yes' && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Do you have at least 100+ observations per series (or many similar series)?</p>
            <div className="flex gap-2">
              {[['yes', 'Yes'], ['no', 'No']].map(([v, l]) => (
                <button key={v} onClick={() => setAnswer2(v)}
                  className={`px-4 py-2 rounded text-sm border transition-all ${answer2 === v ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}
        {rec && (
          <div className={`p-3 rounded border font-medium text-sm ${rec.color}`}>
            Recommendation: {rec.text}
          </div>
        )}
      </div>
    </div>
  );
}

const fineTuningCode = `from nixtla import NixtlaClient
import pandas as pd
import numpy as np

client = NixtlaClient(api_key='YOUR_NIXTLA_API_KEY')

# ── 1. Prepare fine-tuning dataset ────────────────────────────────────────
# The more domain-specific and diverse your fine-tuning data, the better.
# You need: unique_id, ds, y — same format as forecasting.
np.random.seed(42)

# Simulate a specialized industrial sensor domain
# that differs from TimeGPT's pre-training distribution
records = []
for uid in range(30):
    T = 200
    dates = pd.date_range('2020-01-01', periods=T, freq='h')
    # Non-standard pattern: sawtooth with random resets
    t = np.arange(T)
    y = (20 * (t % 48) / 48 +       # sawtooth: 48-hour cycle
         3  * np.random.randn(T))
    for d, v in zip(dates, y):
        records.append({'unique_id': f'sensor_{uid}', 'ds': d, 'y': float(v)})

ft_df = pd.DataFrame(records)
print(f"Fine-tuning dataset: {ft_df['unique_id'].nunique()} series, ~{T} steps each")

# ── 2. Fine-tune TimeGPT ──────────────────────────────────────────────────
# finetune_steps: number of gradient update steps on your domain data
# finetune_depth: 1 (light), 2 (medium), 3 (deep) — deeper = more adaptation
#                 but higher risk of catastrophic forgetting
# loss_function:  'mae', 'mse', 'pinball' (for probabilistic)

ft_model = client.finetune(
    ft_df,
    freq='h',
    finetune_steps=50,
    finetune_depth=1,     # light fine-tuning — preserves general knowledge
    id_col='unique_id',
    time_col='ds',
    target_col='y',
)

print("Fine-tuned model ID:", ft_model.model_id)

# ── 3. Forecast with fine-tuned model ─────────────────────────────────────
# Hold out the last 24 steps for evaluation
test_sensor = ft_df[ft_df['unique_id'] == 'sensor_0'].copy()
train_sensor = test_sensor.iloc[:-24]
actual_24    = test_sensor.iloc[-24:]

# Zero-shot forecast
pred_zeroshot = client.forecast(train_sensor, h=24, freq='h')

# Fine-tuned forecast (pass model_id)
pred_finetuned = client.forecast(
    train_sensor, h=24, freq='h',
    model=ft_model.model_id,    # use fine-tuned weights
)

# Compare accuracy
mae_zs = np.mean(np.abs(pred_zeroshot['TimeGPT'].values - actual_24['y'].values))
mae_ft = np.mean(np.abs(pred_finetuned['TimeGPT'].values - actual_24['y'].values))
print(f"Zero-shot MAE:  {mae_zs:.3f}")
print(f"Fine-tuned MAE: {mae_ft:.3f}")
print(f"Improvement:    {(1 - mae_ft/mae_zs)*100:.1f}%")

# ── 4. Fine-tuning for probabilistic forecasts ────────────────────────────
ft_prob_model = client.finetune(
    ft_df,
    freq='h',
    finetune_steps=50,
    finetune_depth=1,
    loss_function='pinball',    # optimize quantile loss
)

pred_prob = client.forecast(
    train_sensor, h=24, freq='h',
    model=ft_prob_model.model_id,
    level=[80, 90],
)
print(pred_prob.columns.tolist())

# ── 5. Cost and token considerations ──────────────────────────────────────
# Fine-tuning consumes tokens proportional to:
#   finetune_steps × dataset_size
# Rule of thumb: start with finetune_steps=10 to test improvement,
# then increase to 50–100 for final deployment.
# Use fewer, larger series (if available) over many short series.
`;

export default function TimeGPTFineTuningSection() {
  return (
    <SectionLayout
      title="Fine-tuning TimeGPT"
      difficulty="advanced"
      readingTime={11}
    >
      <p className="text-gray-700 leading-relaxed">
        While TimeGPT's zero-shot capability is impressive, there are situations
        where <strong>fine-tuning</strong> — adapting the pre-trained model to
        domain-specific data — substantially improves accuracy. This section
        covers when fine-tuning helps, how to do it with the Nixtla API, and
        important cost and overfitting considerations.
      </p>

      <DefinitionBlock title="Fine-Tuning vs. Zero-Shot">
        <strong>Zero-shot forecasting</strong> uses the pre-trained TimeGPT
        model directly without any domain adaptation — fast and free of
        training cost but may miss domain-specific patterns. Fine-tuning
        performs additional gradient updates on your domain data, updating
        (some of) the model's weights to better capture your data's
        distribution. This is sometimes called <em>few-shot adaptation</em>
        when the domain dataset is small.
      </DefinitionBlock>

      <FineTuningDecisionTree />

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        When Fine-Tuning Helps
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Fine-tuning is most beneficial when:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 text-sm">
        <li>
          <strong>Domain mismatch:</strong> your time series have patterns
          (irregular spikes, unique seasonality, industrial dynamics) that are
          underrepresented in TimeGPT's pre-training corpus.
        </li>
        <li>
          <strong>Systematic bias:</strong> zero-shot forecasts are consistently
          too high or too low — fine-tuning can correct this without full
          retraining.
        </li>
        <li>
          <strong>Abundant domain data:</strong> you have 100+ observations per
          series or a panel of 10+ similar series — enough signal for adaptation
          without overfitting.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        Fine-Tuning Depth and Catastrophic Forgetting
      </h2>
      <p className="text-gray-700 leading-relaxed">
        TimeGPT exposes a <code>finetune_depth</code> parameter (1–3) that
        controls how many layers are updated:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-2 text-gray-700 text-sm">
        <li><strong>Depth 1 (light):</strong> updates only the final output layers. Fast, low cost, minimal risk of forgetting pre-trained patterns.</li>
        <li><strong>Depth 2 (medium):</strong> updates upper Transformer layers. Better adaptation for strong distribution shifts.</li>
        <li><strong>Depth 3 (deep):</strong> updates most parameters. Maximum adaptation but high risk of catastrophic forgetting — avoid unless you have large, clean domain data.</li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-3">
        <strong>Catastrophic forgetting</strong> occurs when aggressive
        fine-tuning overwrites the general knowledge learned during pre-training,
        causing the model to perform worse on series unlike the fine-tuning set.
        Always evaluate on a held-out test set that is <em>not</em> part of
        the fine-tuning data.
      </p>

      <TheoremBlock title="Transfer Learning Theory: Why Fine-Tuning Works">
        <p>
          Pre-trained model weights encode a rich prior over temporal dynamics
          learned from billions of diverse time points. Fine-tuning on domain
          data starts from this prior rather than from random initialization,
          dramatically reducing the amount of domain data needed to achieve
          good performance. Formally, if the pre-training distribution{' '}
          <InlineMath math="P_\text{pre}" /> and target distribution{' '}
          <InlineMath math="P_\text{target}" /> share structure, fine-tuning
          requires only <InlineMath math="O(1/\epsilon^2)" /> domain examples
          to achieve <InlineMath math="\epsilon" />-error, versus{' '}
          <InlineMath math="O(1/\epsilon^2 \cdot \log(1/\delta))" /> from
          scratch.
        </p>
      </TheoremBlock>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">Implementation</h2>
      <PythonCode code={fineTuningCode} />

      <ExampleBlock title="Few-Shot Fine-Tuning with Limited Data">
        <p className="text-sm text-gray-700">
          If you have very few series or short history, use{' '}
          <code>finetune_steps=10</code> and <code>finetune_depth=1</code>.
          Light fine-tuning with few steps acts as a last-layer calibration
          rather than full adaptation. Even 10–20 gradient steps on a few
          hundred observations can reduce bias on domain-specific series without
          risking catastrophic forgetting.
        </p>
      </ExampleBlock>

      <WarningBlock title="Fine-Tuning Cost Can Surprise You">
        Fine-tuning consumes tokens proportional to{' '}
        <code>finetune_steps × observations_in_dataset</code>. With 30 series
        × 200 steps × 50 fine-tuning steps = 300,000 token operations. Always
        check Nixtla's current pricing tier before submitting a large fine-tuning
        job. Use <code>finetune_steps=10</code> for a quick cost-accuracy check
        before scaling up.
      </WarningBlock>

      <NoteBlock title="Evaluating Fine-Tuning Benefit">
        <ul className="list-disc ml-5 space-y-1 text-sm">
          <li>Always compare fine-tuned vs. zero-shot on a held-out test window before deploying.</li>
          <li>Use multiple validation windows (<code>n_windows=3</code>) — a single window can be misleading.</li>
          <li>If fine-tuning does not improve over zero-shot on the held-out window, skip it — the pre-trained model is already well-calibrated for your domain.</li>
          <li>Re-fine-tune periodically if the underlying distribution drifts (e.g., post-pandemic consumer behavior changes).</li>
        </ul>
      </NoteBlock>

      <ReferenceList references={[
        { author: 'Garza, A., & Mergenthaler-Canseco, M.', year: 2023, title: 'TimeGPT-1', venue: 'arXiv' },
        { author: 'Kumar, A., et al.', year: 2022, title: 'Fine-Tuning Distorts Pretrained Features and Underperforms Out-of-Distribution', venue: 'ICLR' },
        { author: 'Bommasani, R., et al.', year: 2022, title: 'On the Opportunities and Risks of Foundation Models', venue: 'arXiv' },
      ]} />
    </SectionLayout>
  );
}
