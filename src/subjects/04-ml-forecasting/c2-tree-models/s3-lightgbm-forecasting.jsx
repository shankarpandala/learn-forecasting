import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

const pythonCode = `# LightGBM for Time Series Forecasting
# pip install lightgbm mlforecast pandas numpy scikit-learn optuna

import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.metrics import mean_absolute_error, mean_squared_error
import warnings
warnings.filterwarnings('ignore')

# ── 1. Generate multi-series dataset ─────────────────────────────────────────
np.random.seed(42)
n_series = 50
n_periods = 156   # 13 years monthly

records = []
for i in range(n_series):
    base    = np.random.uniform(50, 500)
    trend   = np.random.uniform(-0.3, 0.8)
    seas_amp = np.random.uniform(5, 30)
    noise_sd = np.random.uniform(2, 10)

    t = np.arange(n_periods)
    y = base + trend*t + seas_amp*np.sin(2*np.pi*t/12) + np.random.normal(0, noise_sd, n_periods)

    records.append(pd.DataFrame({
        'series_id': f'store_{i:03d}',
        'date': pd.date_range('2012-01', periods=n_periods, freq='MS'),
        'y': np.maximum(y, 0),
    }))

df = pd.concat(records, ignore_index=True)
print(f"Dataset: {df['series_id'].nunique()} series × {n_periods} periods = {len(df)} rows")

# ── 2. Feature engineering ────────────────────────────────────────────────────
def create_features(df, lags, windows):
    """Create lag and window features for each series group."""
    df = df.sort_values(['series_id', 'date']).copy()
    grp = df.groupby('series_id')['y']

    for lag in lags:
        df[f'lag_{lag}'] = grp.shift(lag)

    for w in windows:
        rolled = grp.shift(1).transform(lambda x: x.rolling(w).mean())
        df[f'roll_mean_{w}'] = rolled
        df[f'roll_std_{w}']  = grp.shift(1).transform(lambda x: x.rolling(w).std())

    df['month']      = df['date'].dt.month
    df['month_sin']  = np.sin(2 * np.pi * df['date'].dt.month / 12)
    df['month_cos']  = np.cos(2 * np.pi * df['date'].dt.month / 12)
    df['quarter']    = df['date'].dt.quarter

    # Encode series_id as integer category
    df['series_id_enc'] = df['series_id'].astype('category').cat.codes
    return df

LAGS    = [1, 2, 3, 6, 12, 13, 24]
WINDOWS = [3, 6, 12]

df_feat = create_features(df, LAGS, WINDOWS)
df_feat = df_feat.dropna()

feature_cols = [c for c in df_feat.columns
                if c not in ['y', 'date', 'series_id']]

print(f"Features: {feature_cols}")

# ── 3. Train/test split ───────────────────────────────────────────────────────
cutoff = pd.Timestamp('2023-01')
train = df_feat[df_feat['date'] < cutoff]
test  = df_feat[df_feat['date'] >= cutoff]

X_train, y_train = train[feature_cols], train['y']
X_test,  y_test  = test[feature_cols],  test['y']

# ── 4. LightGBM: Core Training ────────────────────────────────────────────────
lgb_params = {
    'objective':        'regression',
    'metric':           'mae',
    'num_leaves':       127,        # controls model complexity
    'learning_rate':    0.05,
    'n_estimators':     1000,
    'feature_fraction': 0.8,        # subsample features per tree
    'bagging_fraction': 0.8,        # subsample rows per tree
    'bagging_freq':     5,
    'min_child_samples': 20,
    'reg_alpha':        0.1,        # L1 regularization
    'reg_lambda':       0.1,        # L2 regularization
    'verbose':          -1,
    'n_jobs':           -1,
}

# Native LightGBM API with early stopping
dtrain = lgb.Dataset(X_train, label=y_train,
                     categorical_feature=['series_id_enc', 'month', 'quarter'],
                     free_raw_data=False)
dval   = lgb.Dataset(X_test, label=y_test, reference=dtrain)

callbacks = [lgb.early_stopping(50), lgb.log_evaluation(100)]
model = lgb.train(
    lgb_params,
    dtrain,
    num_boost_round=1000,
    valid_sets=[dval],
    callbacks=callbacks,
)

# ── 5. Evaluation ─────────────────────────────────────────────────────────────
preds = model.predict(X_test)
mae   = mean_absolute_error(y_test, preds)
rmse  = mean_squared_error(y_test, preds) ** 0.5
mape  = (np.abs((y_test - preds) / y_test.clip(1))).mean() * 100

print(f"\\nTest MAE:  {mae:.3f}")
print(f"Test RMSE: {rmse:.3f}")
print(f"Test MAPE: {mape:.2f}%")
print(f"Best iteration: {model.best_iteration}")

# ── 6. Feature importance ─────────────────────────────────────────────────────
importance = pd.Series(
    model.feature_importance(importance_type='gain'),
    index=feature_cols,
).sort_values(ascending=False)
print("\\nTop-10 features by gain:")
print(importance.head(10).round(1))

# ── 7. mlforecast integration (multi-step, multi-series) ─────────────────────
from mlforecast import MLForecast
from mlforecast.target_transforms import Differences
from window_ops.rolling import rolling_mean, rolling_std

# Re-format for mlforecast (requires unique_id, ds, y)
df_mlf = df.rename(columns={'series_id': 'unique_id', 'date': 'ds'})
train_mlf = df_mlf[df_mlf['ds'] < cutoff]

mlf = MLForecast(
    models={'lgb': lgb.LGBMRegressor(
        num_leaves=127, learning_rate=0.05, n_estimators=300,
        feature_fraction=0.8, verbose=-1,
    )},
    freq='MS',
    lags=[1, 2, 3, 6, 12],
    lag_transforms={
        1: [(rolling_mean, 3), (rolling_std, 3)],
        6: [(rolling_mean, 6)],
        12: [(rolling_mean, 12)],
    },
    date_features=['month', 'quarter'],
    target_transforms=[Differences([1])],  # first-difference target
)

mlf.fit(train_mlf)
forecast_mlf = mlf.predict(h=12, level=[80, 95])
print("\\nmlforecast output:")
print(forecast_mlf.head(10))

# ── 8. Hyperparameter tuning with Optuna ────────────────────────────────────
import optuna
optuna.logging.set_verbosity(optuna.logging.WARNING)

def objective(trial):
    params = {
        'objective': 'regression', 'metric': 'mae', 'verbose': -1,
        'num_leaves':     trial.suggest_int('num_leaves', 15, 255),
        'learning_rate':  trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
        'feature_fraction': trial.suggest_float('feature_fraction', 0.5, 1.0),
        'reg_alpha':      trial.suggest_float('reg_alpha', 1e-4, 10.0, log=True),
        'reg_lambda':     trial.suggest_float('reg_lambda', 1e-4, 10.0, log=True),
        'n_estimators':   300,
    }
    cv_model = lgb.LGBMRegressor(**params)
    cv_model.fit(X_train, y_train, eval_set=[(X_test, y_test)],
                 callbacks=[lgb.early_stopping(30, verbose=False), lgb.log_evaluation(-1)])
    return mean_absolute_error(y_test, cv_model.predict(X_test))

study = optuna.create_study(direction='minimize')
study.optimize(objective, n_trials=30, show_progress_bar=False)
print("\\nBest hyperparameters:", study.best_params)
print(f"Best MAE: {study.best_value:.3f}")
`;

const references = [
  {
    label: 'Ke 2017',
    title: 'LightGBM: A Highly Efficient Gradient Boosting Decision Tree',
    authors: 'Ke, G. et al.',
    year: 2017,
    url: 'https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html',
  },
  {
    label: 'mlforecast',
    title: 'mlforecast: Scalable machine learning for time series forecasting',
    authors: 'Nixtla',
    year: 2022,
    url: 'https://nixtlaverse.nixtla.io/mlforecast/index.html',
  },
];

export default function LightGBMForecasting() {
  return (
    <SectionLayout
      title="LightGBM for Time Series Forecasting"
      difficulty="advanced"
      readingTime={30}
      prerequisites={['Lag features & window statistics', 'Gradient boosting basics', 'Cross-validation for time series']}
    >
      <p>
        LightGBM (Light Gradient Boosting Machine, Ke et al. 2017) is one of the most
        popular gradient boosting libraries for tabular ML. Its speed and accuracy make it
        the default choice for large-scale time series forecasting in industry, consistently
        performing well in competitions such as M5 and Kaggle retail forecasting challenges.
      </p>

      <h2>1. LightGBM Advantages for Time Series</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'GOSS (Gradient-based One-Side Sampling)', desc: 'Keeps instances with large gradients, randomly samples small-gradient instances. Reduces data used per tree by ~50% with minimal accuracy loss.' },
          { title: 'EFB (Exclusive Feature Bundling)', desc: 'Bundles mutually exclusive sparse features into single features. Reduces feature dimensionality without information loss.' },
          { title: 'Histogram-based splitting', desc: 'Bins continuous features into discrete buckets before training. Much faster than pre-sorting (CatBoost/XGBoost style) on large datasets.' },
          { title: 'Native categorical support', desc: 'Handles store IDs, product categories, etc. natively without one-hot encoding. Uses optimal split finding over categories.' },
        ].map(({ title, desc }) => (
          <div key={title} className="p-4 rounded-lg bg-zinc-800 border border-zinc-700">
            <h4 className="text-sm font-semibold text-sky-400 mb-1">{title}</h4>
            <p className="text-xs text-zinc-400">{desc}</p>
          </div>
        ))}
      </div>

      <h2>2. Key Hyperparameters</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm text-zinc-300 border-collapse">
          <thead>
            <tr className="bg-zinc-800">
              <th className="border border-zinc-700 px-3 py-2">Parameter</th>
              <th className="border border-zinc-700 px-3 py-2">Default</th>
              <th className="border border-zinc-700 px-3 py-2">Effect</th>
              <th className="border border-zinc-700 px-3 py-2">Tuning</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['num_leaves', '31', 'Main complexity control. More leaves → more complex.', 'Increase with more data; try 15–511'],
              ['learning_rate', '0.1', 'Step size per boosting round', 'Lower (0.01–0.05) + more estimators = better'],
              ['n_estimators', '100', 'Number of trees', 'Use early stopping, not fixed value'],
              ['feature_fraction', '1.0', 'Fraction of features per tree (column sampling)', '0.6–0.9 helps regularize'],
              ['bagging_fraction', '1.0', 'Fraction of rows per tree (row sampling)', '0.7–0.9 with bagging_freq > 0'],
              ['min_child_samples', '20', 'Min data in leaf. Higher → more regularization', 'Increase for noisy time series'],
              ['reg_alpha', '0', 'L1 regularization on leaf weights', '0.1–1.0 for sparse features'],
              ['reg_lambda', '0', 'L2 regularization on leaf weights', '0.1–1.0 standard'],
            ].map(([p, d, e, t], i) => (
              <tr key={p} className={i % 2 === 0 ? '' : 'bg-zinc-800/50'}>
                <td className="border border-zinc-700 px-3 py-1.5 font-mono text-amber-300">{p}</td>
                <td className="border border-zinc-700 px-3 py-1.5 text-center">{d}</td>
                <td className="border border-zinc-700 px-3 py-1.5">{e}</td>
                <td className="border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400">{t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>3. mlforecast Integration</h2>
      <p>
        <code>mlforecast</code> (Nixtla) wraps ML models into a time-series-native API,
        handling:
      </p>
      <ul>
        <li>Automatic lag feature creation per series</li>
        <li>Multi-step recursive forecasting</li>
        <li>Target transforms (differencing, log)</li>
        <li>Parallel training across many series</li>
      </ul>

      <NoteBlock type="tip" title="LightGBM vs XGBoost for Time Series">
        LightGBM is generally preferred for time series for three reasons:
        (1) significantly faster training on large datasets (10–100× speedup);
        (2) better performance on datasets with many categorical features (store/product IDs);
        (3) leaf-wise tree growth captures complex interactions better than level-wise (XGBoost default).
        XGBoost's advantage: better documented, more stable API, and supports GPU training natively.
        For time series with few series and short horizons, the difference is negligible.
      </NoteBlock>

      <WarningBlock title="Multi-Step Forecasting Strategy">
        LightGBM is inherently a single-step model. For multi-step ahead forecasting:
        (1) <strong>Recursive</strong>: use predictions as lag features for the next step — error accumulation;
        (2) <strong>Direct</strong>: train a separate model for each horizon — no error accumulation, more models;
        (3) <strong>MIMO</strong>: predict all horizons simultaneously with a multi-output model.
        mlforecast uses recursive by default. For competition accuracy, direct or MIMO often wins.
      </WarningBlock>

      <h2>4. Complete Pipeline with Optuna Tuning</h2>
      <PythonCode
        code={pythonCode}
        filename="lightgbm_forecasting.py"
        title="LightGBM forecasting pipeline: feature engineering, training, evaluation, and hyperparameter tuning"
      />

      <ReferenceList references={references} />
    </SectionLayout>
  );
}
