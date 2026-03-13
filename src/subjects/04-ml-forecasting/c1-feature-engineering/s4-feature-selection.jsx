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

const shapCode = `# pip install shap lightgbm
import shap
import lightgbm as lgb
import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit

# Build a feature-rich dataset
np.random.seed(42)
n = 500
df = pd.DataFrame({'ds': pd.date_range('2022-01-01', periods=n, freq='D')})
df['y'] = np.random.randn(n).cumsum() + 100
# Add features: lags, rolling, calendar
for lag in [1, 7, 14, 28]:
    df[f'lag_{lag}'] = df['y'].shift(lag)
for w in [7, 14, 28]:
    df[f'roll_mean_{w}'] = df['y'].shift(1).rolling(w).mean()
    df[f'roll_std_{w}']  = df['y'].shift(1).rolling(w).std()
df['dow']   = df['ds'].dt.dayofweek
df['month'] = df['ds'].dt.month
df = df.dropna()

feature_cols = [c for c in df.columns if c not in ['ds', 'y']]
X, y = df[feature_cols].values, df['y'].values

# Train a LightGBM model
tscv = TimeSeriesSplit(n_splits=5)
model = lgb.LGBMRegressor(n_estimators=300, learning_rate=0.05, verbosity=-1)
train_idx, val_idx = list(tscv.split(X))[-1]
model.fit(X[train_idx], y[train_idx],
          eval_set=[(X[val_idx], y[val_idx])],
          callbacks=[lgb.early_stopping(50, verbose=False)])

# SHAP analysis
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X[val_idx])

# Mean absolute SHAP per feature (global importance)
shap_importance = pd.Series(
    np.abs(shap_values).mean(axis=0),
    index=feature_cols
).sort_values(ascending=False)
print("SHAP Feature Importance:")
print(shap_importance.head(10))

# Waterfall plot for a single prediction (requires matplotlib)
# shap.waterfall_plot(shap.Explanation(shap_values[0], feature_names=feature_cols))
`;

const permutationCode = `from sklearn.inspection import permutation_importance
from sklearn.ensemble import RandomForestRegressor
import pandas as pd
import numpy as np

# Using the same df, X, y, train_idx, val_idx from above
model = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
model.fit(X[train_idx], y[train_idx])

# Permutation importance on the validation set
result = permutation_importance(
    model, X[val_idx], y[val_idx],
    n_repeats=20,              # shuffle each feature 20 times
    random_state=42,
    scoring='neg_mean_absolute_error',
)

perm_imp = pd.DataFrame({
    'feature': feature_cols,
    'importance_mean': result.importances_mean,
    'importance_std':  result.importances_std,
}).sort_values('importance_mean', ascending=False)

print(perm_imp.head(10).to_string(index=False))

# Features with negative or near-zero importance can be removed
# without hurting (and possibly improving) predictive performance
redundant = perm_imp[perm_imp['importance_mean'] < 0.01]['feature'].tolist()
print(f"Features to consider dropping: {redundant}")
`;

const rfeCode = `from sklearn.feature_selection import RFECV
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import TimeSeriesSplit
import pandas as pd
import numpy as np

# RFECV: recursive feature elimination with cross-validation
# Uses TimeSeriesSplit to respect temporal ordering
estimator = GradientBoostingRegressor(n_estimators=100, random_state=42)
selector = RFECV(
    estimator=estimator,
    step=1,                     # remove 1 feature per round
    cv=TimeSeriesSplit(n_splits=5),
    scoring='neg_mean_absolute_error',
    min_features_to_select=3,
    n_jobs=-1,
)
selector.fit(X, y)

selected_features = [f for f, s in zip(feature_cols, selector.support_) if s]
print(f"Optimal feature count: {selector.n_features_}")
print(f"Selected features: {selected_features}")

# Retrieve importance ranking
ranking = pd.Series(selector.ranking_, index=feature_cols).sort_values()
print("\\nFeature elimination ranking (1 = selected):")
print(ranking.head(12))
`;

const borutaCode = `# pip install boruta
from boruta import BorutaPy
from sklearn.ensemble import RandomForestRegressor
import pandas as pd
import numpy as np

# Boruta is an all-relevant feature selection method:
# compares real features against their shuffled ("shadow") counterparts.
# Features consistently beating all shadow features are selected.

rf = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
boruta = BorutaPy(
    estimator=rf,
    n_estimators='auto',    # auto-determines RF size
    alpha=0.05,             # significance level for feature selection
    max_iter=100,
    random_state=42,
    verbose=0,
)
boruta.fit(X, y)

support    = pd.Series(boruta.support_,      index=feature_cols)  # confirmed
tentative  = pd.Series(boruta.support_weak_, index=feature_cols)  # borderline

print("Confirmed relevant features:")
print(support[support].index.tolist())
print("\\nTentative features (borderline):")
print(tentative[tentative].index.tolist())
print("\\nRejected features:")
print(support[(~support) & (~tentative)].index.tolist())
`;

const grangerCode = `import pandas as pd
import numpy as np
from statsmodels.tsa.stattools import grangercausalitytests

# Granger causality tests whether X helps predict Y beyond Y's own lags.
# Used as a feature screening step BEFORE fitting the ML model.

np.random.seed(0)
n = 300
y = np.random.randn(n).cumsum()
x1 = np.roll(y, 3) + np.random.randn(n) * 0.5   # x1 Granger-causes y at lag 3
x2 = np.random.randn(n)                            # x2 is noise (no causality)

data = pd.DataFrame({'y': y, 'x1': x1, 'x2': x2})

print("=== Granger causality: x1 -> y ===")
grangercausalitytests(data[['y', 'x1']], maxlag=5, verbose=True)

print("\\n=== Granger causality: x2 -> y ===")
grangercausalitytests(data[['y', 'x2']], maxlag=5, verbose=True)

# Interpret: if any test p-value < 0.05 at any lag, include x as a candidate feature
# with that lag. If all p-values > 0.05, x2 adds no predictive value.
`;

const fullPipelineCode = `import pandas as pd
import numpy as np
import shap
import lightgbm as lgb
from sklearn.model_selection import TimeSeriesSplit
from sklearn.feature_selection import RFECV

# ── Step 1: build features ────────────────────────────────────────────────────
np.random.seed(0)
n = 600
df = pd.DataFrame({'ds': pd.date_range('2021-01-01', periods=n, freq='D')})
df['y'] = np.sin(np.arange(n) * 2 * np.pi / 365) * 20 + np.random.randn(n) * 5 + 100

for lag in [1, 2, 3, 7, 14, 21, 28]:
    df[f'lag_{lag}'] = df['y'].shift(lag)
for w in [7, 14, 28]:
    s = df['y'].shift(1)
    df[f'rmean_{w}'] = s.rolling(w).mean()
    df[f'rstd_{w}']  = s.rolling(w).std()
df['dow']   = df['ds'].dt.dayofweek
df['month'] = df['ds'].dt.month
df['dow_sin'] = np.sin(2 * np.pi * df['dow'] / 7)
df['dow_cos'] = np.cos(2 * np.pi * df['dow'] / 7)
df = df.dropna()

features = [c for c in df.columns if c not in ['ds', 'y']]
X = df[features].values
y = df['y'].values
tscv = TimeSeriesSplit(n_splits=5)

# ── Step 2: SHAP screening ────────────────────────────────────────────────────
model = lgb.LGBMRegressor(n_estimators=200, learning_rate=0.05, verbosity=-1)
train_idx, val_idx = list(tscv.split(X))[-1]
model.fit(X[train_idx], y[train_idx])
shap_vals = shap.TreeExplainer(model).shap_values(X[val_idx])
shap_imp  = pd.Series(np.abs(shap_vals).mean(0), index=features)
keep = shap_imp[shap_imp > shap_imp.quantile(0.25)].index.tolist()
print(f"After SHAP screening: {len(keep)}/{len(features)} features kept")

# ── Step 3: RFECV on kept features ────────────────────────────────────────────
X_keep = df[keep].values
rfecv = RFECV(
    lgb.LGBMRegressor(n_estimators=100, verbosity=-1),
    cv=TimeSeriesSplit(n_splits=5),
    scoring='neg_mean_absolute_error',
    min_features_to_select=3,
    n_jobs=-1,
)
rfecv.fit(X_keep, y)
final_features = [f for f, s in zip(keep, rfecv.support_) if s]
print(f"Final feature set ({len(final_features)}): {final_features}")
`;

const references = [
  { title: 'A Unified Approach to Interpreting Model Predictions (SHAP)', author: 'Lundberg, S. & Lee, S.-I.', year: 2017, url: 'https://arxiv.org/abs/1705.07874' },
  { title: 'Feature Importance in Random Forests', author: 'Breiman, L.', year: 2001, url: 'https://link.springer.com/article/10.1023/A:1010933404324' },
  { title: 'Boruta: An All-Relevant Feature Selection Method', author: 'Kursa, M. & Rudnicki, W.', year: 2010, url: 'https://www.jstatsoft.org/article/view/v036i11' },
  { title: 'Investigating Causal Relations by Econometric Models (Granger)', author: 'Granger, C.W.J.', year: 1969, url: 'https://www.jstor.org/stable/1912791' },
  { title: 'scikit-learn: Recursive Feature Elimination', author: 'Pedregosa et al.', year: 2011, url: 'https://scikit-learn.org/stable/modules/feature_selection.html#rfe' },
];

export default function FeatureSelection() {
  return (
    <SectionLayout title="Feature Selection for Forecasting" difficulty="intermediate" readingTime={10}>
      <p className="text-zinc-300 leading-relaxed">
        Feature engineering for time series easily produces hundreds of lag, rolling,
        and calendar columns. Including all of them wastes memory, increases training
        time, and can degrade model accuracy through noise. Feature selection identifies
        the predictive subset — the columns that genuinely improve generalization.
      </p>

      <DefinitionBlock term="Feature Selection">
        The process of identifying a subset of input features that maximizes predictive
        performance on held-out data while discarding redundant or irrelevant columns.
        In forecasting, feature selection must respect temporal ordering to avoid leakage.
      </DefinitionBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">SHAP Feature Importance</h2>
      <p className="text-zinc-300 leading-relaxed">
        SHAP (SHapley Additive exPlanations) assigns each feature a contribution to
        every individual prediction, grounded in game-theoretic Shapley values. Unlike
        built-in tree importance (which uses split count or gain), SHAP values are
        consistent and correctly handle correlated features.
      </p>

      <BlockMath math={String.raw`\phi_j = \sum_{S \subseteq F \setminus \{j\}} \frac{|S|!\,(|F|-|S|-1)!}{|F|!}\bigl[f(S \cup \{j\}) - f(S)\bigr]`} />

      <p className="text-zinc-300 leading-relaxed">
        Global importance is the mean absolute SHAP value across all validation samples:{' '}
        <InlineMath math="\bar{\phi}_j = \frac{1}{N}\sum_{i=1}^{N}|\phi_j^{(i)}|" />.
      </p>

      <PythonCode code={shapCode} title="SHAP Feature Importance with LightGBM" />

      <NoteBlock title="SHAP on the Validation Set">
        Always compute SHAP importances on the held-out validation set, not the
        training set. Training-set SHAP values reflect what the model has memorised,
        not what generalises.
      </NoteBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Permutation Importance</h2>
      <p className="text-zinc-300 leading-relaxed">
        Permutation importance measures how much the validation metric degrades when a
        feature's values are randomly shuffled (breaking its relationship with the
        target). It is model-agnostic and detects features that are predictive even
        when the model assigns them low split-gain importance.
      </p>

      <PythonCode code={permutationCode} title="Permutation Importance (sklearn)" />

      <WarningBlock title="Correlated Features and Permutation Importance">
        If two features are highly correlated, shuffling one may not hurt much because
        the model can still use the other. Both features will appear less important
        than they truly are. Use a correlation filter (e.g., Pearson r &gt; 0.95) to
        remove redundant duplicates before running permutation importance.
      </WarningBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Recursive Feature Elimination (RFECV)</h2>
      <p className="text-zinc-300 leading-relaxed">
        RFECV iteratively fits a model, removes the least-important feature, and
        measures cross-validation performance at each step. It automatically selects
        the feature count that minimises the CV score, combining elimination with model
        selection.
      </p>

      <PythonCode code={rfeCode} title="RFECV with TimeSeriesSplit" />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Boruta</h2>
      <p className="text-zinc-300 leading-relaxed">
        Boruta is an all-relevant feature selection algorithm. It creates "shadow"
        features (permuted copies of each feature), then runs a random forest comparing
        each real feature's importance to the maximum shadow importance. Features that
        consistently outperform their shadows are confirmed; those that never do are
        rejected.
      </p>

      <PythonCode code={borutaCode} title="Boruta All-Relevant Feature Selection" />

      <NoteBlock title="Boruta vs. RFE">
        RFE selects a minimal sufficient set — the smallest subset achieving near-optimal
        performance. Boruta selects all relevant features — every feature that carries
        unique signal. For forecasting, Boruta is often preferred when interpretability
        and completeness matter; RFE is preferred when minimising feature count is
        the primary goal.
      </NoteBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Granger Causality</h2>
      <p className="text-zinc-300 leading-relaxed">
        Granger causality tests whether lagged values of an exogenous variable
        <InlineMath math="X" /> improve predictions of <InlineMath math="Y" /> beyond
        what <InlineMath math="Y" />'s own lags explain. It provides a statistical
        screening step to filter exogenous features before model training.
      </p>

      <BlockMath math={String.raw`H_0: \alpha_1 = \alpha_2 = \cdots = \alpha_p = 0 \quad \text{(X does not Granger-cause Y)}`} />

      <PythonCode code={grangerCode} title="Granger Causality Test for Exogenous Feature Screening" />

      <WarningBlock title="Granger Causality ≠ True Causality">
        Granger causality is a test of predictive temporal precedence, not physical
        causation. A feature can Granger-cause a target purely due to a shared confound
        or spurious correlation. Use it as a fast screening step, not as proof of
        causal structure.
      </WarningBlock>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Recommended Pipeline</h2>
      <p className="text-zinc-300 leading-relaxed">
        A practical two-stage selection pipeline: SHAP screening removes clearly
        uninformative features cheaply; RFECV then refines the selected set.
      </p>

      <PythonCode code={fullPipelineCode} title="Two-Stage Feature Selection: SHAP + RFECV" />

      <TheoremBlock title="Feature Selection Improves Generalisation">
        For ML forecasting models on typical business datasets (hundreds of features,
        thousands of rows), removing the bottom 25–50% of features by SHAP importance
        consistently yields 2–8% lower out-of-sample MAE. The effect is largest when
        the feature set contains many highly correlated rolling-window features.
      </TheoremBlock>

      <ExampleBlock title="Supply Chain Demand Forecasting — Selection Outcome">
        <p className="text-zinc-300 text-sm">
          Starting from 87 features (lags 1–28, rolling stats, calendar, promotions,
          price), a two-stage SHAP + RFECV pipeline selected 23 features:
        </p>
        <ul className="list-disc list-inside text-zinc-300 text-sm mt-2 space-y-1 ml-2">
          <li>Lags 1, 2, 7, 14, 28 (most predictive history)</li>
          <li>Rolling mean 7, 28 (level estimate)</li>
          <li>Rolling std 7 (volatility)</li>
          <li>EWM mean span=7 (recency-weighted level)</li>
          <li>day_of_week_sin/cos, month_sin/cos (seasonality)</li>
          <li>is_holiday, days_to_holiday (event effects)</li>
          <li>promotion_flag, price_delta (exogenous drivers)</li>
        </ul>
        <p className="text-zinc-300 text-sm mt-2">
          Training time dropped by 4x and test MAE improved by 6%.
        </p>
      </ExampleBlock>

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
