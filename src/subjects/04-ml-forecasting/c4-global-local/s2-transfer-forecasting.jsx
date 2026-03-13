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

const conceptCode = `# Transfer learning for time series:
# 1. Pre-train a global model on a large, diverse dataset (source domain)
# 2. Apply that model to new series with limited history (target domain)
#
# For ML (tree) models, "transfer" means:
#   a. Zero-shot: apply the pre-trained model directly to new series
#      (works if features are compatible)
#   b. Fine-tuning: continue training on the new series data
#      (adjust the model to the target distribution)
#   c. Feature transfer: use the pre-trained model's predictions
#      as meta-features for a small local model
#
# Unlike neural networks (where layer weights are transferred),
# tree models transfer learned decision boundaries / feature importance
# by re-weighting or extending the training distribution.

import numpy as np
import pandas as pd
import lightgbm as lgb

print("Transfer learning concepts for tree-based ML forecasting.")
print("Three approaches: zero-shot, fine-tuning, and feature transfer.")
`;

const zeroShotCode = `from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
import lightgbm as lgb
import pandas as pd
import numpy as np

# ── Step 1: Pre-train global model on source series (many, long series) ───────
np.random.seed(0)
n_source = 200
source_series = []
for uid in range(n_source):
    n = np.random.randint(200, 500)
    base = np.random.uniform(50, 500)
    amp  = np.random.uniform(5, 60)
    y = (base
         + amp * np.sin(2 * np.pi * np.arange(n) / 365)
         + amp * 0.3 * np.sin(2 * np.pi * np.arange(n) / 7)
         + np.random.randn(n) * base * 0.03)
    source_series.append(pd.DataFrame({
        'unique_id': f'src_{uid:03d}',
        'ds': pd.date_range('2019-01-01', periods=n, freq='D'),
        'y': y,
    }))

source_df = pd.concat(source_series, ignore_index=True)

# Train global model on source domain
fcst = MLForecast(
    models={'lgb': lgb.LGBMRegressor(n_estimators=500, learning_rate=0.05,
                                     num_leaves=63, verbose=-1)},
    freq='D',
    lags=[1, 7, 14, 28],
    lag_transforms={1: [('rolling_mean', 7), ('rolling_mean', 28)]},
    date_features=['dayofweek', 'month'],
)
fcst.fit(source_df)
print("Source model trained on", source_df['unique_id'].nunique(), "series")

# ── Step 2: Zero-shot prediction on new series (no fine-tuning) ────────────────
# New series: only 30 observations
new_series = pd.DataFrame({
    'unique_id': 'new_store',
    'ds': pd.date_range('2024-01-01', periods=30, freq='D'),
    'y': 250 + 20 * np.sin(2 * np.pi * np.arange(30) / 7) + np.random.randn(30) * 5,
})

# The global model was NOT trained on 'new_store', but its learned
# seasonality patterns apply directly to the new series.
# For zero-shot: add new series to the prediction context
preds_zeroshot = fcst.predict(h=14, new_df=new_series)
print(f"Zero-shot predictions for '{new_series['unique_id'].iloc[0]}':")
print(preds_zeroshot)
`;

const finetuningCode = `import lightgbm as lgb
import pandas as pd
import numpy as np
from mlforecast import MLForecast

# Fine-tuning approach for ML models:
# LightGBM supports "continue_training" — start from an existing model
# and run additional boosting rounds on the new series data.

np.random.seed(42)

# ── Generate pre-trained model ────────────────────────────────────────────────
n_source = 100
source_data = []
for uid in range(n_source):
    n = 300
    y = 100 + np.random.randn(n).cumsum() + 10 * np.sin(2 * np.pi * np.arange(n) / 52)
    source_data.append(pd.DataFrame({
        'unique_id': f's{uid}', 'ds': pd.date_range('2020-01-01', periods=n, freq='W'), 'y': y
    }))
source_df = pd.concat(source_data, ignore_index=True)

# Build feature matrix for source
def build_features(df, lags=[1,2,4,8,13,26]):
    df = df.sort_values(['unique_id','ds']).copy()
    for l in lags:
        df[f'lag_{l}'] = df.groupby('unique_id')['y'].shift(l)
    df = df.dropna()
    feats = [f'lag_{l}' for l in lags]
    return df[feats].values, df['y'].values, df

Xs, ys, src_feats = build_features(source_df)
source_model = lgb.LGBMRegressor(n_estimators=300, learning_rate=0.05, verbose=-1)
source_model.fit(Xs, ys)
print("Source model trained:", source_model.n_estimators, "trees")

# ── Fine-tune on a new series (target domain) ─────────────────────────────────
new_y = 350 + np.random.randn(80).cumsum() + 15 * np.sin(2 * np.pi * np.arange(80) / 52)
new_df = pd.DataFrame({
    'unique_id': 'target_series',
    'ds': pd.date_range('2023-01-01', periods=80, freq='W'),
    'y': new_y,
})
Xt, yt, _ = build_features(new_df)

# Fine-tune: init_model from source, run 100 additional trees
fine_tuned = lgb.LGBMRegressor(
    n_estimators=100,
    learning_rate=0.01,      # smaller LR for fine-tuning
    verbose=-1,
)
fine_tuned.fit(
    Xt[:-14], yt[:-14],
    init_model=source_model.booster_,   # start from pre-trained model
)
print(f"Fine-tuned model: {source_model.n_estimators + 100} total trees")

# Compare fine-tuned vs. from-scratch on target series
from sklearn.metrics import mean_absolute_error
scratch = lgb.LGBMRegressor(n_estimators=300, verbose=-1)
scratch.fit(Xt[:-14], yt[:-14])

preds_ft      = fine_tuned.predict(Xt[-14:])
preds_scratch = scratch.predict(Xt[-14:])
print(f"Fine-tuned MAE: {mean_absolute_error(yt[-14:], preds_ft):.3f}")
print(f"From-scratch MAE: {mean_absolute_error(yt[-14:], preds_scratch):.3f}")
`;

const featureTransferCode = `import lightgbm as lgb
import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error

# Feature Transfer: use global model's predictions as meta-features
# for a lightweight local model on the target series.
#
# This is a "stacking" approach:
#   Level 1: global model produces predictions
#   Level 2: local model corrects the predictions using target series data

np.random.seed(5)

# Simulate having a pre-trained global model
# (using source_model and Xt/yt from the fine-tuning example)

# Get global model predictions on target series
global_preds = source_model.predict(Xt)   # raw predictions from global model

# Build local correction features:
# [global_prediction, lag_1, lag_2, ...]
correction_X = np.column_stack([global_preds, Xt])   # global pred + original lags
correction_y = yt - global_preds                      # residuals to correct

# Train a simple Ridge regression on the first 60 rows
ridge = Ridge(alpha=1.0)
ridge.fit(correction_X[:-14], correction_y[:-14])

# Final predictions = global prediction + local correction
residuals_pred = ridge.predict(correction_X[-14:])
final_preds    = global_preds[-14:] + residuals_pred

print(f"Global-only MAE:           {mean_absolute_error(yt[-14:], global_preds[-14:]):.3f}")
print(f"Global + local correction: {mean_absolute_error(yt[-14:], final_preds):.3f}")
`;

const fewShotCode = `from mlforecast import MLForecast
import lightgbm as lgb
import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error

# Few-shot forecasting:
# New series with very little history (e.g., 14 days for a daily model)
# Global model provides reasonable baseline from cross-learning

np.random.seed(99)

# Source: 50 series with 2 years of data each
source_series = pd.concat([
    pd.DataFrame({
        'unique_id': f'src_{i}',
        'ds': pd.date_range('2022-01-01', periods=730, freq='D'),
        'y': 100 + i * 5 + 8 * np.sin(2 * np.pi * np.arange(730) / 7) + np.random.randn(730) * 3,
    }) for i in range(50)
], ignore_index=True)

fcst = MLForecast(
    models={'lgb': lgb.LGBMRegressor(n_estimators=300, verbose=-1)},
    freq='D',
    lags=[1, 7],
    date_features=['dayofweek'],
)
fcst.fit(source_series)

# Few-shot: new series with only 14 observations
few_shot = pd.DataFrame({
    'unique_id': 'new_brand',
    'ds': pd.date_range('2024-01-01', periods=14, freq='D'),
    'y': 200 + 12 * np.sin(2 * np.pi * np.arange(14) / 7) + np.random.randn(14) * 4,
})

# With only 14 obs, max lag is 7 — global model uses what's available
preds = fcst.predict(h=7, new_df=few_shot)
print("Few-shot predictions (14-obs history, 7-step horizon):")
print(preds)
`;

const references = [
  { title: 'Transfer Learning for Time Series Forecasting', author: 'Ye, L. & Keogh, E.', year: 2021, url: 'https://arxiv.org/abs/2102.02443' },
  { title: 'A Meta-Learning Perspective on Cold-Start Recommendations', author: 'Vartak, M. et al.', year: 2017, url: 'https://dl.acm.org/doi/10.5555/3294996.3295140' },
  { title: 'Temporal Fusion Transformers for Interpretable Multi-horizon Forecasting', author: 'Lim, B. et al.', year: 2021, url: 'https://arxiv.org/abs/1912.09363' },
  { title: 'TimesFM: Time Series Foundation Model (Google)', author: 'Das, A. et al.', year: 2024, url: 'https://arxiv.org/abs/2310.10688' },
  { title: 'mlforecast documentation', author: 'Nixtla', year: 2024, url: 'https://nixtlaverse.nixtla.io/mlforecast/' },
];

export default function TransferForecasting() {
  return (
    <SectionLayout title="Transfer Learning and Fine-tuning" difficulty="advanced" readingTime={12}>
      <p className="text-zinc-300 leading-relaxed">
        Transfer learning applies knowledge from a large, well-trained model to new
        problems with limited data. In deep learning this means sharing learned
        representations (weights); in tree-based ML forecasting it means leveraging a
        pre-trained global model to initialise, augment, or correct predictions for
        new time series with sparse history.
      </p>

      <DefinitionBlock term="Transfer Learning for Forecasting">
        Using a model pre-trained on a large source dataset (many series or long history)
        to improve predictions on a target dataset where training data is limited.
        Transfer can be applied as zero-shot prediction, fine-tuning (continued training),
        or feature transfer (using global model predictions as meta-features).
      </DefinitionBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Transfer Learning Approaches</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        {[
          {
            name: 'Zero-Shot',
            desc: 'Apply pre-trained global model directly to new series. No additional training on target. Effective when source and target share common patterns.',
            cost: 'No training',
            when: 'Very short series (<30 obs)',
          },
          {
            name: 'Fine-Tuning',
            desc: 'Continue training the global model on target series data with a small learning rate. Adapts the model to the target distribution.',
            cost: 'Small training set + low LR',
            when: 'Medium new series (30–200 obs)',
          },
          {
            name: 'Feature Transfer',
            desc: 'Use global model predictions as meta-features. Train a lightweight local corrector (Ridge, linear) on top of global predictions.',
            cost: 'Tiny local model',
            when: 'Target differs from source',
          },
        ].map(a => (
          <div key={a.name} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
            <p className="text-sky-400 font-semibold text-sm">{a.name}</p>
            <p className="text-zinc-300 text-xs mt-1">{a.desc}</p>
            <p className="text-zinc-500 text-xs mt-2"><span className="text-amber-400">Cost:</span> {a.cost}</p>
            <p className="text-zinc-500 text-xs"><span className="text-emerald-400">Use:</span> {a.when}</p>
          </div>
        ))}
      </div>

      <PythonCode code={conceptCode} title="Transfer Learning Concepts for Tree Models" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Zero-Shot: Global Model on New Series</h2>
      <p className="text-zinc-300 leading-relaxed">
        A global model learns universal seasonality and trend patterns from the source
        dataset. These patterns can be applied directly to new series because the
        date features (day of week, month) and lag structures are series-agnostic.
        The <code>new_df</code> parameter in mlforecast passes context for new series
        not seen during training.
      </p>

      <PythonCode code={zeroShotCode} title="Zero-Shot Prediction with mlforecast" />

      <NoteBlock title="Zero-Shot Works Best with Date Features">
        Zero-shot transfer relies on the model having learned the relationship between
        calendar features (day_of_week, month) and the target during source training.
        Models trained with only lag features (no date features) generalise less
        effectively to new series zero-shot, since lags encode series-specific history.
      </NoteBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Fine-Tuning</h2>
      <p className="text-zinc-300 leading-relaxed">
        LightGBM and XGBoost support warm-starting from an existing model via
        <code>init_model</code>. Fine-tuning runs additional boosting rounds on
        the target series data, adapting the global model's decision boundaries to
        the target distribution with a smaller learning rate.
      </p>

      <BlockMath math={String.raw`F_{\text{fine}}(\mathbf{x}) = F_{\text{global}}(\mathbf{x}) + \eta_{\text{small}} \sum_{m=1}^{M_{\text{fine}}} T_m(\mathbf{x})`} />

      <PythonCode code={finetuningCode} title="Fine-Tuning LightGBM on Target Series" />

      <WarningBlock title="Fine-Tuning Pitfalls">
        Use a learning rate 5–10x smaller than the source training rate when
        fine-tuning (e.g., 0.005–0.01 vs. 0.05). A large learning rate will
        overwrite the global model's knowledge rather than adapting it. Limit
        fine-tuning rounds proportionally to the target dataset size to prevent
        overfitting on the small target sample.
      </WarningBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Feature Transfer (Meta-Learning)</h2>
      <p className="text-zinc-300 leading-relaxed">
        Feature transfer treats the global model's prediction as a strong prior.
        A lightweight local model (Ridge, linear regression, or tiny tree model)
        learns to correct the residuals using the target series' limited data.
        This approach is robust even when the global model's distribution differs
        from the target — the local corrector absorbs the domain gap.
      </p>

      <PythonCode code={featureTransferCode} title="Feature Transfer: Global Prediction as Meta-Feature" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Few-Shot Forecasting</h2>
      <p className="text-zinc-300 leading-relaxed">
        Few-shot forecasting is the extreme case of transfer: the new series has only
        a handful of observations — insufficient to train any meaningful local model.
        The global model's cross-learned patterns provide the only signal, with lag
        features populated from the limited available history.
      </p>

      <PythonCode code={fewShotCode} title="Few-Shot Forecasting with Global Model" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Neural vs. Tree Transfer Learning</h2>
      <p className="text-zinc-300 leading-relaxed">
        Neural foundation models (TimesFM, Moirai, Chronos) take transfer learning
        further — pre-training on billions of time series observations and enabling
        zero-shot prediction on any new series without any feature engineering.
        For tree-based ML, the transfer mechanisms are less expressive but simpler
        to implement and control.
      </p>

      <div className="overflow-x-auto my-4">
        <table className="text-sm text-zinc-300 border-collapse w-full">
          <thead><tr className="bg-zinc-800">
            {['Method', 'Transfer Mechanism', 'Flexibility', 'Interpretability'].map(h => (
              <th key={h} className="border border-zinc-700 px-3 py-2 text-left text-xs">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              ['Tree zero-shot', 'Shared date feature patterns', 'High (same feature format)', 'Full SHAP support'],
              ['Tree fine-tuning', 'Additional boosting rounds', 'High (adjustable LR/rounds)', 'Full SHAP support'],
              ['Feature transfer', 'Global pred as meta-feature', 'Very high (any local model)', 'Local model interpretable'],
              ['Neural foundation', 'Weight initialisation + embedding', 'Medium (architecture-dependent)', 'Limited'],
            ].map(r => (
              <tr key={r[0]} className="hover:bg-zinc-800">
                {r.map((v, i) => <td key={i} className="border border-zinc-700 px-3 py-1 text-xs">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TheoremBlock title="Practical Transfer Learning Guidelines">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Source and target must share the same feature format (same lag set, same date features)</li>
          <li>Normalise source and target series to the same scale before fine-tuning to avoid scale bias</li>
          <li>Validate fine-tuning benefit: compare fine-tuned vs. global zero-shot on held-out target data</li>
          <li>For very short series (&lt;14 obs), zero-shot with date-feature-heavy model is most reliable</li>
          <li>Feature transfer (meta-learning correction) consistently improves over pure zero-shot when any target data is available</li>
        </ul>
      </TheoremBlock>

      <ExampleBlock title="New Store Launch Forecasting">
        <p className="text-zinc-300 text-sm">
          A retailer opens 10 new stores. Each has only 3 weeks (21 days) of sales history.
          The goal: forecast week 4–8 demand for inventory planning.
        </p>
        <ul className="list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2">
          <li>Source model: global LightGBM trained on 500 existing stores (3+ years each)</li>
          <li>Approach: feature transfer — global model prediction + Ridge corrector on 21-day history</li>
          <li>Features transferred: day_of_week seasonality, month pattern, lag structure</li>
          <li>Local correction: store-specific level, local promotion effects</li>
          <li>Result: 18% lower MAE vs. naive same-store-comparable approach on held-out week 5</li>
        </ul>
      </ExampleBlock>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
