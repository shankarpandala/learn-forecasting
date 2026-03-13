/**
 * Curriculum registry for Learn Forecasting.
 * Covers statistical, ML, deep learning, and foundation model approaches
 * to time series forecasting with practical applications.
 *
 * Reference: Forecasting: Principles and Practice (3rd ed) by Hyndman & Athanasopoulos
 */

export const CURRICULUM = [
  {
    id: '01-ts-foundations',
    title: 'Time Series Foundations',
    icon: '〜',
    colorHex: '#0ea5e9',
    description: 'Core concepts of time series data — components, stationarity, autocorrelation, and the mathematical framework underlying all forecasting methods.',
    prerequisites: [],
    practicalRelevance: 100,
    estimatedHours: 12,
    difficulty: 'beginner',
    chapters: [
      {
        id: 'c1-intro-forecasting',
        title: 'Introduction to Forecasting',
        description: 'What forecasting is, why it matters, types of forecasts, and the forecasting workflow.',
        difficulty: 'beginner',
        estimatedMinutes: 120,
        sections: [
          { id: 's1-what-is-forecasting', title: 'What is Forecasting?', difficulty: 'beginner', readingMinutes: 15, description: 'Forecasting defined, types of predictions, forecast horizon, and use cases.', buildsOn: null },
          { id: 's2-forecasting-workflow', title: 'The Forecasting Workflow', difficulty: 'beginner', readingMinutes: 20, description: 'Problem definition, data collection, model selection, evaluation, and deployment.', buildsOn: '01-ts-foundations/c1-intro-forecasting/s1-what-is-forecasting' },
          { id: 's3-forecast-evaluation', title: 'Forecast Evaluation Metrics', difficulty: 'beginner', readingMinutes: 25, description: 'MAE, RMSE, MAPE, MASE, sMAPE, CRPS — choosing the right error metric.', buildsOn: '01-ts-foundations/c1-intro-forecasting/s2-forecasting-workflow' },
        ],
      },
      {
        id: 'c2-ts-components',
        title: 'Time Series Components',
        description: 'Decomposing time series into trend, seasonality, cycles, and residuals using classical and STL methods.',
        difficulty: 'beginner',
        estimatedMinutes: 150,
        sections: [
          { id: 's1-ts-patterns', title: 'Patterns in Time Series', difficulty: 'beginner', readingMinutes: 20, description: 'Trend, seasonality, cycles, and irregular components explained visually.', buildsOn: '01-ts-foundations/c1-intro-forecasting/s3-forecast-evaluation' },
          { id: 's2-decomposition', title: 'Classical & STL Decomposition', difficulty: 'beginner', readingMinutes: 25, description: 'Additive vs multiplicative decomposition, STL, seasonal adjustment.', buildsOn: '01-ts-foundations/c2-ts-components/s1-ts-patterns' },
          { id: 's3-transformations', title: 'Transformations & Adjustments', difficulty: 'beginner', readingMinutes: 20, description: 'Log, Box-Cox, calendar adjustments, and population-adjusted series.', buildsOn: '01-ts-foundations/c2-ts-components/s2-decomposition' },
        ],
      },
      {
        id: 'c3-stationarity',
        title: 'Stationarity & Unit Roots',
        description: 'Understanding stationarity, testing for unit roots, and transforming non-stationary series for modeling.',
        difficulty: 'intermediate',
        estimatedMinutes: 160,
        sections: [
          { id: 's1-stationarity', title: 'Stationarity Concepts', difficulty: 'intermediate', readingMinutes: 25, description: 'Strict vs weak stationarity, white noise, random walks.', buildsOn: '01-ts-foundations/c2-ts-components/s3-transformations' },
          { id: 's2-unit-root-tests', title: 'Unit Root Tests', difficulty: 'intermediate', readingMinutes: 30, description: 'ADF test, KPSS test, PP test — interpreting results with Python.', buildsOn: '01-ts-foundations/c3-stationarity/s1-stationarity' },
          { id: 's3-differencing', title: 'Differencing & Integration', difficulty: 'intermediate', readingMinutes: 25, description: 'First and seasonal differencing, order of integration, NSDIFFS.', buildsOn: '01-ts-foundations/c3-stationarity/s2-unit-root-tests' },
        ],
      },
      {
        id: 'c4-autocorrelation',
        title: 'Autocorrelation & Diagnostics',
        description: 'ACF, PACF, cross-correlation, and residual diagnostics for time series models.',
        difficulty: 'intermediate',
        estimatedMinutes: 140,
        sections: [
          { id: 's1-acf-pacf', title: 'ACF & PACF', difficulty: 'intermediate', readingMinutes: 30, description: 'Autocorrelation function, partial ACF, lag plots, and their interpretation.', buildsOn: '01-ts-foundations/c3-stationarity/s3-differencing' },
          { id: 's2-residual-diagnostics', title: 'Residual Diagnostics', difficulty: 'intermediate', readingMinutes: 25, description: 'Ljung-Box test, portmanteau tests, checking model assumptions.', buildsOn: '01-ts-foundations/c4-autocorrelation/s1-acf-pacf' },
          { id: 's3-cross-correlation', title: 'Cross-Correlation & Causality', difficulty: 'intermediate', readingMinutes: 20, description: 'CCF, lead-lag relationships, and Granger causality primer.', buildsOn: '01-ts-foundations/c4-autocorrelation/s2-residual-diagnostics' },
        ],
      },
    ],
  },
  {
    id: '02-statistical-forecasting',
    title: 'Statistical Forecasting',
    icon: 'σ',
    colorHex: '#8b5cf6',
    description: 'Classical statistical methods — ETS exponential smoothing, ARIMA, SARIMA, and state space models. Based on FPP3 by Hyndman & Athanasopoulos.',
    prerequisites: ['01-ts-foundations'],
    practicalRelevance: 95,
    estimatedHours: 18,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-simple-methods',
        title: 'Simple Forecasting Methods',
        description: 'Naïve, seasonal naïve, drift, and mean methods — baselines every forecaster must know.',
        difficulty: 'beginner',
        estimatedMinutes: 100,
        sections: [
          { id: 's1-baseline-methods', title: 'Benchmark Methods', difficulty: 'beginner', readingMinutes: 20, description: 'Mean, naïve, seasonal naïve, and drift methods with Python.', buildsOn: '01-ts-foundations/c4-autocorrelation/s3-cross-correlation' },
          { id: 's2-moving-averages', title: 'Moving Averages & Smoothing', difficulty: 'beginner', readingMinutes: 20, description: 'Simple, weighted, and centered moving averages. Smoothing as a filter.', buildsOn: '02-statistical-forecasting/c1-simple-methods/s1-baseline-methods' },
        ],
      },
      {
        id: 'c2-exponential-smoothing',
        title: 'Exponential Smoothing (ETS)',
        description: 'Simple, double, triple exponential smoothing and the full ETS state space framework.',
        difficulty: 'intermediate',
        estimatedMinutes: 200,
        sections: [
          { id: 's1-simple-exponential-smoothing', title: 'Simple Exponential Smoothing', difficulty: 'intermediate', readingMinutes: 25, description: 'SES formula, α parameter, optimal smoothing, one-step-ahead forecasts.', buildsOn: '02-statistical-forecasting/c1-simple-methods/s2-moving-averages' },
          { id: 's2-holt-holtwinters', title: "Holt's & Holt-Winters Methods", difficulty: 'intermediate', readingMinutes: 30, description: "Holt's linear trend, Holt-Winters additive and multiplicative seasonality.", buildsOn: '02-statistical-forecasting/c2-exponential-smoothing/s1-simple-exponential-smoothing' },
          { id: 's3-ets-state-space', title: 'ETS State Space Framework', difficulty: 'intermediate', readingMinutes: 35, description: 'ETS(E,T,S) notation, AIC model selection, prediction intervals from state space.', buildsOn: '02-statistical-forecasting/c2-exponential-smoothing/s2-holt-holtwinters' },
        ],
      },
      {
        id: 'c3-arima',
        title: 'ARIMA Models',
        description: 'AR, MA, ARMA, ARIMA — Box-Jenkins methodology, automatic model selection, and diagnostics.',
        difficulty: 'intermediate',
        estimatedMinutes: 240,
        sections: [
          { id: 's1-ar-ma-models', title: 'AR & MA Models', difficulty: 'intermediate', readingMinutes: 30, description: 'Autoregressive and moving average processes, stationarity conditions, ACF/PACF signatures.', buildsOn: '02-statistical-forecasting/c2-exponential-smoothing/s3-ets-state-space' },
          { id: 's2-arima', title: 'ARIMA: Integrated Models', difficulty: 'intermediate', readingMinutes: 35, description: 'ARIMA(p,d,q) specification, Box-Jenkins workflow, auto.arima in Python.', buildsOn: '02-statistical-forecasting/c3-arima/s1-ar-ma-models' },
          { id: 's3-sarima', title: 'Seasonal ARIMA (SARIMA)', difficulty: 'intermediate', readingMinutes: 30, description: 'SARIMA(p,d,q)(P,D,Q)[m], seasonal differencing, model identification.', buildsOn: '02-statistical-forecasting/c3-arima/s2-arima' },
          { id: 's4-arima-python', title: 'ARIMA in Python: statsmodels & statsforecast', difficulty: 'intermediate', readingMinutes: 25, description: 'Fitting ARIMA with statsmodels and statsforecast, comparison, production tips.', buildsOn: '02-statistical-forecasting/c3-arima/s3-sarima' },
        ],
      },
      {
        id: 'c4-state-space',
        title: 'State Space & Structural Models',
        description: 'Kalman filter, structural time series models, and BSTS as a generalization of ETS/ARIMA.',
        difficulty: 'advanced',
        estimatedMinutes: 180,
        sections: [
          { id: 's1-state-space-basics', title: 'State Space Representation', difficulty: 'advanced', readingMinutes: 35, description: 'Observation and state equations, Kalman filter, local level model.', buildsOn: '02-statistical-forecasting/c3-arima/s4-arima-python' },
          { id: 's2-structural-ts', title: 'Structural Time Series', difficulty: 'advanced', readingMinutes: 35, description: 'Local linear trend, seasonal components, cycle component, Harvey models.', buildsOn: '02-statistical-forecasting/c4-state-space/s1-state-space-basics' },
          { id: 's3-prophet-model', title: 'Prophet: Decomposable Forecasting', difficulty: 'intermediate', readingMinutes: 30, description: "Meta's Prophet — trend changepoints, seasonality, holidays, and Python API.", buildsOn: '02-statistical-forecasting/c4-state-space/s2-structural-ts' },
        ],
      },
    ],
  },
  {
    id: '03-regression-causal',
    title: 'Regression & Causal Methods',
    icon: '⟶',
    colorHex: '#10b981',
    description: 'Regression-based forecasting with external regressors, dynamic regression, distributed lags, VAR models, and hierarchical forecasting.',
    prerequisites: ['01-ts-foundations', '02-statistical-forecasting'],
    practicalRelevance: 90,
    estimatedHours: 14,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-ts-regression',
        title: 'Time Series Regression',
        description: 'Regression with time series predictors — trend, seasonality dummies, Fourier terms, and splines.',
        difficulty: 'intermediate',
        estimatedMinutes: 160,
        sections: [
          { id: 's1-regression-basics', title: 'Regression for Forecasting', difficulty: 'intermediate', readingMinutes: 25, description: 'OLS with time index, trend terms, dummy variables for seasonality.', buildsOn: '02-statistical-forecasting/c4-state-space/s3-prophet-model' },
          { id: 's2-fourier-terms', title: 'Fourier Terms & Splines', difficulty: 'intermediate', readingMinutes: 25, description: 'Flexible seasonality via Fourier series, piecewise linear splines for trend.', buildsOn: '03-regression-causal/c1-ts-regression/s1-regression-basics' },
          { id: 's3-dynamic-harmonic', title: 'Dynamic Harmonic Regression', difficulty: 'advanced', readingMinutes: 25, description: 'ARIMA errors with Fourier regressors for complex seasonal patterns.', buildsOn: '03-regression-causal/c1-ts-regression/s2-fourier-terms' },
        ],
      },
      {
        id: 'c2-dynamic-regression',
        title: 'Dynamic Regression & ARIMAX',
        description: 'Regression with ARIMA errors, transfer function models, and external regressors.',
        difficulty: 'intermediate',
        estimatedMinutes: 160,
        sections: [
          { id: 's1-arimax', title: 'ARIMAX: ARIMA with Regressors', difficulty: 'intermediate', readingMinutes: 30, description: 'Regression errors vs ARIMAX, spurious regression, stationarity of regressors.', buildsOn: '03-regression-causal/c1-ts-regression/s3-dynamic-harmonic' },
          { id: 's2-distributed-lag', title: 'Distributed Lag Models (ADL)', difficulty: 'advanced', readingMinutes: 30, description: 'Finite distributed lag, ADL(p,q) models, lag selection, impulse responses.', buildsOn: '03-regression-causal/c2-dynamic-regression/s1-arimax' },
        ],
      },
      {
        id: 'c3-multivariate',
        title: 'Multivariate Models (VAR)',
        description: 'Vector autoregression, impulse response functions, and Granger causality testing.',
        difficulty: 'advanced',
        estimatedMinutes: 180,
        sections: [
          { id: 's1-var-models', title: 'Vector Autoregression (VAR)', difficulty: 'advanced', readingMinutes: 35, description: 'VAR(p) specification, lag selection (AIC/BIC/HQ), estimation, forecasting.', buildsOn: '03-regression-causal/c2-dynamic-regression/s2-distributed-lag' },
          { id: 's2-granger-causality', title: 'Granger Causality', difficulty: 'advanced', readingMinutes: 25, description: 'Granger causality test, limitations, and application to forecasting.', buildsOn: '03-regression-causal/c3-multivariate/s1-var-models' },
          { id: 's3-cointegration', title: 'Cointegration & VECM', difficulty: 'advanced', readingMinutes: 30, description: 'Engle-Granger and Johansen cointegration, error correction models.', buildsOn: '03-regression-causal/c3-multivariate/s2-granger-causality' },
        ],
      },
      {
        id: 'c4-hierarchical',
        title: 'Hierarchical & Grouped Forecasting',
        description: 'Bottom-up, top-down, and optimal reconciliation methods for hierarchical time series.',
        difficulty: 'advanced',
        estimatedMinutes: 180,
        sections: [
          { id: 's1-hierarchical-ts', title: 'Hierarchical Time Series', difficulty: 'advanced', readingMinutes: 30, description: 'Aggregation structures, summing constraints, bottom-up vs top-down.', buildsOn: '03-regression-causal/c3-multivariate/s3-cointegration' },
          { id: 's2-reconciliation', title: 'Optimal Reconciliation', difficulty: 'advanced', readingMinutes: 35, description: 'MinT reconciliation, OLS, WLS, and shrinkage estimators (statsforecast HierarchicalForecast).', buildsOn: '03-regression-causal/c4-hierarchical/s1-hierarchical-ts' },
        ],
      },
    ],
  },
  {
    id: '04-ml-forecasting',
    title: 'Machine Learning Forecasting',
    icon: '⚡',
    colorHex: '#f59e0b',
    description: 'Feature engineering for time series, tree-based models (XGBoost, LightGBM, CatBoost), and global forecasting strategies using mlforecast.',
    prerequisites: ['01-ts-foundations'],
    practicalRelevance: 98,
    estimatedHours: 20,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-feature-engineering',
        title: 'Feature Engineering for Time Series',
        description: 'Creating informative features: lags, rolling statistics, calendar features, and target encoding.',
        difficulty: 'intermediate',
        estimatedMinutes: 200,
        sections: [
          { id: 's1-lag-features', title: 'Lag Features & Window Statistics', difficulty: 'intermediate', readingMinutes: 30, description: 'Lag selection, rolling mean/std/min/max, expanding window features with pandas.', buildsOn: '01-ts-foundations/c4-autocorrelation/s3-cross-correlation' },
          { id: 's2-calendar-features', title: 'Calendar & Date Features', difficulty: 'intermediate', readingMinutes: 25, description: 'Day-of-week, month, quarter, holidays, Fourier encoding, and cyclical encoding.', buildsOn: '04-ml-forecasting/c1-feature-engineering/s1-lag-features' },
          { id: 's3-target-encoding', title: 'Target Encoding & Categorical Features', difficulty: 'intermediate', readingMinutes: 20, description: 'Entity embeddings, target mean encoding, and handling high-cardinality categoricals.', buildsOn: '04-ml-forecasting/c1-feature-engineering/s2-calendar-features' },
          { id: 's4-feature-selection', title: 'Feature Importance & Selection', difficulty: 'intermediate', readingMinutes: 25, description: 'SHAP values, permutation importance, recursive feature elimination for time series.', buildsOn: '04-ml-forecasting/c1-feature-engineering/s3-target-encoding' },
        ],
      },
      {
        id: 'c2-tree-models',
        title: 'Tree-Based Forecasting Models',
        description: 'Random Forest, XGBoost, LightGBM, and CatBoost for tabularized time series forecasting.',
        difficulty: 'intermediate',
        estimatedMinutes: 220,
        sections: [
          { id: 's1-random-forest-ts', title: 'Random Forest for Time Series', difficulty: 'intermediate', readingMinutes: 30, description: 'Tabularization approach, avoiding leakage, out-of-bag evaluation, tuning.', buildsOn: '04-ml-forecasting/c1-feature-engineering/s4-feature-selection' },
          { id: 's2-xgboost-forecasting', title: 'XGBoost Forecasting', difficulty: 'intermediate', readingMinutes: 35, description: 'XGBoost with time series features, hyperparameter tuning, and time-based CV.', buildsOn: '04-ml-forecasting/c2-tree-models/s1-random-forest-ts' },
          { id: 's3-lightgbm-forecasting', title: 'LightGBM Forecasting', difficulty: 'intermediate', readingMinutes: 30, description: 'LightGBM advantages, categorical native support, mlforecast pipeline integration.', buildsOn: '04-ml-forecasting/c2-tree-models/s2-xgboost-forecasting' },
          { id: 's4-catboost-forecasting', title: 'CatBoost & Ensemble Methods', difficulty: 'intermediate', readingMinutes: 25, description: 'CatBoost for categorical time series, model stacking, and ensemble forecasting.', buildsOn: '04-ml-forecasting/c2-tree-models/s3-lightgbm-forecasting' },
        ],
      },
      {
        id: 'c3-ml-strategies',
        title: 'ML Forecasting Strategies',
        description: 'Direct, recursive, MIMO strategies, cross-validation for time series, and backtesting.',
        difficulty: 'intermediate',
        estimatedMinutes: 180,
        sections: [
          { id: 's1-forecast-strategies', title: 'Multi-Step Forecast Strategies', difficulty: 'intermediate', readingMinutes: 30, description: 'Direct multi-output, recursive, DIRECT, MIMO — trade-offs and when to use each.', buildsOn: '04-ml-forecasting/c2-tree-models/s4-catboost-forecasting' },
          { id: 's2-time-series-cv', title: 'Cross-Validation for Time Series', difficulty: 'intermediate', readingMinutes: 25, description: 'Expanding window, sliding window, and gap-based CV — avoiding data leakage.', buildsOn: '04-ml-forecasting/c3-ml-strategies/s1-forecast-strategies' },
          { id: 's3-mlforecast-pipeline', title: 'mlforecast: Scalable ML Forecasting', difficulty: 'intermediate', readingMinutes: 30, description: 'Nixtla mlforecast for global models, feature transformers, and production pipelines.', buildsOn: '04-ml-forecasting/c3-ml-strategies/s2-time-series-cv' },
        ],
      },
      {
        id: 'c4-global-local',
        title: 'Global vs Local Models',
        description: 'Cross-learning across multiple series, transfer forecasting, and multi-series pooling.',
        difficulty: 'advanced',
        estimatedMinutes: 160,
        sections: [
          { id: 's1-global-models', title: 'Global Forecasting Models', difficulty: 'advanced', readingMinutes: 30, description: 'Learning across multiple series, global model advantages, and when they fail.', buildsOn: '04-ml-forecasting/c3-ml-strategies/s3-mlforecast-pipeline' },
          { id: 's2-transfer-forecasting', title: 'Transfer Learning for Forecasting', difficulty: 'advanced', readingMinutes: 30, description: 'Pre-training on source series, fine-tuning on target, meta-learning approaches.', buildsOn: '04-ml-forecasting/c4-global-local/s1-global-models' },
        ],
      },
    ],
  },
  {
    id: '05-deep-learning',
    title: 'Deep Learning for Forecasting',
    icon: '⬡',
    colorHex: '#ef4444',
    description: 'RNNs, LSTMs, TCN, N-BEATS, N-HiTS, Temporal Fusion Transformer, and modern deep learning architectures for sequence forecasting.',
    prerequisites: ['01-ts-foundations', '04-ml-forecasting'],
    practicalRelevance: 95,
    estimatedHours: 22,
    difficulty: 'advanced',
    chapters: [
      {
        id: 'c1-rnn-lstm',
        title: 'RNNs & LSTMs',
        description: 'Sequence modeling fundamentals — vanilla RNN, LSTM, GRU, and multi-layer architectures.',
        difficulty: 'advanced',
        estimatedMinutes: 220,
        sections: [
          { id: 's1-rnn-basics', title: 'Recurrent Neural Networks', difficulty: 'advanced', readingMinutes: 35, description: 'RNN architecture, backpropagation through time, vanishing/exploding gradients.', buildsOn: '04-ml-forecasting/c4-global-local/s2-transfer-forecasting' },
          { id: 's2-lstm-gru', title: 'LSTM & GRU Architectures', difficulty: 'advanced', readingMinutes: 35, description: 'LSTM gates, cell state, GRU simplification, PyTorch implementation.', buildsOn: '05-deep-learning/c1-rnn-lstm/s1-rnn-basics' },
          { id: 's3-seq2seq', title: 'Encoder-Decoder Seq2Seq', difficulty: 'advanced', readingMinutes: 30, description: 'Seq2Seq for multi-step forecasting, teacher forcing, scheduled sampling.', buildsOn: '05-deep-learning/c1-rnn-lstm/s2-lstm-gru' },
        ],
      },
      {
        id: 'c2-modern-dl',
        title: 'Modern DL Architectures',
        description: 'N-BEATS, N-HiTS, TCN, WaveNet — purpose-built neural forecasters without RNNs.',
        difficulty: 'advanced',
        estimatedMinutes: 240,
        sections: [
          { id: 's1-nbeats', title: 'N-BEATS: Neural Basis Expansion', difficulty: 'advanced', readingMinutes: 40, description: 'Doubly residual stacking, basis expansion, interpretable and generic versions.', buildsOn: '05-deep-learning/c1-rnn-lstm/s3-seq2seq' },
          { id: 's2-nhits', title: 'N-HiTS: Hierarchical Interpolation', difficulty: 'advanced', readingMinutes: 35, description: 'Multi-rate signal sampling, hierarchical interpolation, long-horizon superiority.', buildsOn: '05-deep-learning/c2-modern-dl/s1-nbeats' },
          { id: 's3-tcn', title: 'Temporal Convolutional Networks (TCN)', difficulty: 'advanced', readingMinutes: 30, description: 'Dilated causal convolutions, residual connections, TCN vs LSTM comparison.', buildsOn: '05-deep-learning/c2-modern-dl/s2-nhits' },
        ],
      },
      {
        id: 'c3-transformers',
        title: 'Transformer-Based Forecasting',
        description: 'Temporal Fusion Transformer, Informer, PatchTST, iTransformer — attention for sequences.',
        difficulty: 'advanced',
        estimatedMinutes: 260,
        sections: [
          { id: 's1-attention-basics', title: 'Attention Mechanisms for Sequences', difficulty: 'advanced', readingMinutes: 35, description: 'Self-attention, positional encoding, and why transformers struggle with long sequences.', buildsOn: '05-deep-learning/c2-modern-dl/s3-tcn' },
          { id: 's2-tft', title: 'Temporal Fusion Transformer (TFT)', difficulty: 'advanced', readingMinutes: 40, description: 'Variable selection networks, gating, multi-head attention, quantile outputs.', buildsOn: '05-deep-learning/c3-transformers/s1-attention-basics' },
          { id: 's3-patchtst', title: 'PatchTST & iTransformer', difficulty: 'advanced', readingMinutes: 35, description: 'Patch-based tokenization (PatchTST), inverted dimension attention (iTransformer).', buildsOn: '05-deep-learning/c3-transformers/s2-tft' },
        ],
      },
      {
        id: 'c4-neuralforecast',
        title: 'neuralforecast Library',
        description: 'Nixtla neuralforecast: production-ready deep learning forecasting in Python.',
        difficulty: 'intermediate',
        estimatedMinutes: 160,
        sections: [
          { id: 's1-neuralforecast-basics', title: 'Getting Started with neuralforecast', difficulty: 'intermediate', readingMinutes: 30, description: 'NeuralForecast API, AutoNHITS, AutoNBEATS, scalable training and inference.', buildsOn: '05-deep-learning/c3-transformers/s3-patchtst' },
          { id: 's2-hyperparameter-tuning', title: 'Hyperparameter Tuning & Auto Models', difficulty: 'intermediate', readingMinutes: 30, description: 'Ray Tune integration, optuna search, AutoTFT, cross-validation in neuralforecast.', buildsOn: '05-deep-learning/c4-neuralforecast/s1-neuralforecast-basics' },
        ],
      },
    ],
  },
  {
    id: '06-foundation-models',
    title: 'Foundation Models',
    icon: '◈',
    colorHex: '#a855f7',
    description: 'Pre-trained large time series models — TimeGPT, Amazon Chronos, Lag-Llama, Moirai, MOMENT, and TimesFM for zero-shot and fine-tuned forecasting.',
    prerequisites: ['01-ts-foundations', '05-deep-learning'],
    practicalRelevance: 92,
    estimatedHours: 16,
    difficulty: 'advanced',
    chapters: [
      {
        id: 'c1-foundation-overview',
        title: 'Foundation Models Overview',
        description: 'The paradigm shift to pre-trained time series models — capabilities, limitations, and evaluation.',
        difficulty: 'intermediate',
        estimatedMinutes: 140,
        sections: [
          { id: 's1-paradigm-shift', title: 'The Foundation Model Paradigm', difficulty: 'intermediate', readingMinutes: 25, description: 'From task-specific to general models, zero-shot vs fine-tuned, scaling laws for TS.', buildsOn: '05-deep-learning/c4-neuralforecast/s2-hyperparameter-tuning' },
          { id: 's2-benchmark-landscape', title: 'Benchmark Landscape & Evaluation', difficulty: 'intermediate', readingMinutes: 25, description: 'LTSF-Linear debate, Monash benchmarks, M-competitions, zero-shot evaluation protocols.', buildsOn: '06-foundation-models/c1-foundation-overview/s1-paradigm-shift' },
        ],
      },
      {
        id: 'c2-timegpt',
        title: 'TimeGPT & Nixtla',
        description: "Nixtla's TimeGPT — the first foundation model for time series, API usage, and fine-tuning.",
        difficulty: 'intermediate',
        estimatedMinutes: 180,
        sections: [
          { id: 's1-timegpt-intro', title: 'TimeGPT Architecture & API', difficulty: 'intermediate', readingMinutes: 30, description: 'TimeGPT transformer architecture, Nixtla API, zero-shot forecasting walkthrough.', buildsOn: '06-foundation-models/c1-foundation-overview/s2-benchmark-landscape' },
          { id: 's2-timegpt-finetuning', title: 'Fine-Tuning TimeGPT', difficulty: 'intermediate', readingMinutes: 30, description: 'Fine-tuning on domain-specific data, anomaly detection with TimeGPT, uncertainty quantification.', buildsOn: '06-foundation-models/c2-timegpt/s1-timegpt-intro' },
          { id: 's3-timegpt-applications', title: 'TimeGPT: Use Cases & Limitations', difficulty: 'intermediate', readingMinutes: 25, description: 'Supply chain, finance, energy applications. When TimeGPT wins and when it loses.', buildsOn: '06-foundation-models/c2-timegpt/s2-timegpt-finetuning' },
        ],
      },
      {
        id: 'c3-chronos',
        title: 'Amazon Chronos',
        description: 'Chronos: Language model pre-trained on quantized time series for probabilistic forecasting.',
        difficulty: 'advanced',
        estimatedMinutes: 160,
        sections: [
          { id: 's1-chronos-architecture', title: 'Chronos Architecture', difficulty: 'advanced', readingMinutes: 35, description: 'Tokenization via quantization, T5 backbone, probabilistic output via sampling.', buildsOn: '06-foundation-models/c2-timegpt/s3-timegpt-applications' },
          { id: 's2-chronos-inference', title: 'Chronos Inference & Fine-Tuning', difficulty: 'intermediate', readingMinutes: 30, description: 'HuggingFace integration, AutoGluon-TimeSeries with Chronos, fine-tuning strategies.', buildsOn: '06-foundation-models/c3-chronos/s1-chronos-architecture' },
        ],
      },
      {
        id: 'c4-other-foundation',
        title: 'Lag-Llama, Moirai & MOMENT',
        description: 'Open-source foundation models: Lag-Llama, Salesforce Moirai, MIT MOMENT, and Google TimesFM.',
        difficulty: 'advanced',
        estimatedMinutes: 180,
        sections: [
          { id: 's1-lag-llama', title: 'Lag-Llama: LLM for Forecasting', difficulty: 'advanced', readingMinutes: 30, description: 'Lag-Llama architecture, lag features as tokens, probabilistic forecasting.', buildsOn: '06-foundation-models/c3-chronos/s2-chronos-inference' },
          { id: 's2-moirai', title: 'Salesforce Moirai', difficulty: 'advanced', readingMinutes: 30, description: 'Universal forecasting model, patch-based architecture, LOTSA dataset training.', buildsOn: '06-foundation-models/c4-other-foundation/s1-lag-llama' },
          { id: 's3-moment-timesfm', title: 'MOMENT & TimesFM', difficulty: 'advanced', readingMinutes: 30, description: 'MIT MOMENT for multiple tasks, Google TimesFM patching approach, comparative analysis.', buildsOn: '06-foundation-models/c4-other-foundation/s2-moirai' },
        ],
      },
    ],
  },
  {
    id: '07-probabilistic-forecasting',
    title: 'Probabilistic Forecasting',
    icon: '∫',
    colorHex: '#06b6d4',
    description: 'Forecast distributions rather than point estimates — conformal prediction, quantile regression, Bayesian methods, and ensemble uncertainty.',
    prerequisites: ['01-ts-foundations', '02-statistical-forecasting'],
    practicalRelevance: 90,
    estimatedHours: 16,
    difficulty: 'advanced',
    chapters: [
      {
        id: 'c1-forecast-uncertainty',
        title: 'Forecast Uncertainty',
        description: 'Sources of forecast uncertainty, prediction intervals, and distributional forecasting fundamentals.',
        difficulty: 'intermediate',
        estimatedMinutes: 160,
        sections: [
          { id: 's1-prediction-intervals', title: 'Prediction Intervals', difficulty: 'intermediate', readingMinutes: 25, description: 'Analytical vs bootstrap intervals, coverage, and calibration.', buildsOn: '02-statistical-forecasting/c4-state-space/s3-prophet-model' },
          { id: 's2-quantile-forecasting', title: 'Quantile Regression Forecasting', difficulty: 'intermediate', readingMinutes: 30, description: 'Pinball loss, quantile regression forests, gradient boosting quantiles.', buildsOn: '07-probabilistic-forecasting/c1-forecast-uncertainty/s1-prediction-intervals' },
          { id: 's3-distributional-forecasting', title: 'Distributional Forecasting', difficulty: 'advanced', readingMinutes: 30, description: 'CRPS, energy score, full predictive distribution, proper scoring rules.', buildsOn: '07-probabilistic-forecasting/c1-forecast-uncertainty/s2-quantile-forecasting' },
        ],
      },
      {
        id: 'c2-conformal-prediction',
        title: 'Conformal Prediction',
        description: 'Distribution-free prediction intervals with guaranteed coverage using conformal prediction.',
        difficulty: 'advanced',
        estimatedMinutes: 180,
        sections: [
          { id: 's1-conformal-basics', title: 'Conformal Prediction Theory', difficulty: 'advanced', readingMinutes: 35, description: 'Exchangeability, split conformal, full conformal, marginal vs conditional coverage.', buildsOn: '07-probabilistic-forecasting/c1-forecast-uncertainty/s3-distributional-forecasting' },
          { id: 's2-adaptive-conformal', title: 'Adaptive Conformal for Time Series', difficulty: 'advanced', readingMinutes: 35, description: 'Adaptive CI, EnbPI, SPCI — handling distribution shift in sequential settings.', buildsOn: '07-probabilistic-forecasting/c2-conformal-prediction/s1-conformal-basics' },
        ],
      },
      {
        id: 'c3-bayesian-forecasting',
        title: 'Bayesian Forecasting',
        description: 'Bayesian structural time series, PyMC, posterior predictive distributions, and MCMC.',
        difficulty: 'advanced',
        estimatedMinutes: 200,
        sections: [
          { id: 's1-bayesian-ts', title: 'Bayesian Time Series Basics', difficulty: 'advanced', readingMinutes: 35, description: 'Prior, likelihood, posterior. Conjugate priors for AR models. Bayesian ARIMA.', buildsOn: '07-probabilistic-forecasting/c2-conformal-prediction/s2-adaptive-conformal' },
          { id: 's2-pymc-forecasting', title: 'Probabilistic Programming with PyMC', difficulty: 'advanced', readingMinutes: 40, description: 'Building time series models in PyMC, MCMC sampling, posterior predictive checks.', buildsOn: '07-probabilistic-forecasting/c3-bayesian-forecasting/s1-bayesian-ts' },
          { id: 's3-bsts', title: 'Bayesian Structural Time Series (BSTS)', difficulty: 'advanced', readingMinutes: 35, description: 'Local linear trend, seasonal components, regression effects, and Causal Impact.', buildsOn: '07-probabilistic-forecasting/c3-bayesian-forecasting/s2-pymc-forecasting' },
        ],
      },
      {
        id: 'c4-ensemble-forecasting',
        title: 'Ensemble & Combination Methods',
        description: 'Model averaging, stacking, and forecast combination theory.',
        difficulty: 'intermediate',
        estimatedMinutes: 160,
        sections: [
          { id: 's1-forecast-combination', title: 'Forecast Combination Theory', difficulty: 'intermediate', readingMinutes: 30, description: 'Why combining works: bias-variance trade-off, optimal weights, equal-weight robustness.', buildsOn: '07-probabilistic-forecasting/c3-bayesian-forecasting/s3-bsts' },
          { id: 's2-stacking-forecasts', title: 'Stacking & Meta-Learning', difficulty: 'intermediate', readingMinutes: 30, description: 'Level-0/level-1 stacking, cross-validated meta-features, dynamic model selection.', buildsOn: '07-probabilistic-forecasting/c4-ensemble-forecasting/s1-forecast-combination' },
        ],
      },
    ],
  },
  {
    id: '08-forecasting-libraries',
    title: 'Python Forecasting Libraries',
    icon: '⚙',
    colorHex: '#f97316',
    description: 'Hands-on guide to the Python forecasting ecosystem: statsforecast, mlforecast, neuralforecast, darts, sktime, and Prophet.',
    prerequisites: ['01-ts-foundations'],
    practicalRelevance: 100,
    estimatedHours: 18,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-statsforecast',
        title: 'statsforecast: Fast Statistical Forecasting',
        description: 'Nixtla statsforecast — blazing-fast ARIMA, ETS, CES, and baseline models at scale.',
        difficulty: 'intermediate',
        estimatedMinutes: 200,
        sections: [
          { id: 's1-statsforecast-intro', title: 'statsforecast Quickstart', difficulty: 'intermediate', readingMinutes: 30, description: 'StatsForecast API, AutoARIMA, AutoETS, cross-validation pipeline.', buildsOn: '02-statistical-forecasting/c3-arima/s4-arima-python' },
          { id: 's2-statsforecast-models', title: 'statsforecast Model Zoo', difficulty: 'intermediate', readingMinutes: 30, description: 'MSTL, AutoCES, GARCH, Theta, Four Theta — when to use each model.', buildsOn: '08-forecasting-libraries/c1-statsforecast/s1-statsforecast-intro' },
          { id: 's3-statsforecast-scale', title: 'Scaling to Millions of Series', difficulty: 'intermediate', readingMinutes: 25, description: 'Parallel execution, Ray and Spark backends, hierarchical forecasting integration.', buildsOn: '08-forecasting-libraries/c1-statsforecast/s2-statsforecast-models' },
        ],
      },
      {
        id: 'c2-mlforecast-lib',
        title: 'mlforecast: ML Forecasting at Scale',
        description: 'Nixtla mlforecast for global ML models — feature generation, pipelines, and distributed training.',
        difficulty: 'intermediate',
        estimatedMinutes: 180,
        sections: [
          { id: 's1-mlforecast-intro', title: 'mlforecast Quickstart', difficulty: 'intermediate', readingMinutes: 30, description: 'MLForecast API, LightGBM pipeline, lag transforms, and cross-validation.', buildsOn: '04-ml-forecasting/c3-ml-strategies/s3-mlforecast-pipeline' },
          { id: 's2-mlforecast-features', title: 'Feature Engineering in mlforecast', difficulty: 'intermediate', readingMinutes: 30, description: 'Built-in lag transforms, rolling stats, date features, custom transformations.', buildsOn: '08-forecasting-libraries/c2-mlforecast-lib/s1-mlforecast-intro' },
        ],
      },
      {
        id: 'c3-darts-sktime',
        title: 'Darts & sktime',
        description: 'Unit8 Darts and Alan Turing Institute sktime — unified forecasting APIs and pipelines.',
        difficulty: 'intermediate',
        estimatedMinutes: 180,
        sections: [
          { id: 's1-darts-intro', title: 'Darts: All-in-One Forecasting', difficulty: 'intermediate', readingMinutes: 30, description: 'TimeSeries object, unified model API, backtesting, and pipeline building with Darts.', buildsOn: '08-forecasting-libraries/c2-mlforecast-lib/s2-mlforecast-features' },
          { id: 's2-sktime-intro', title: 'sktime: Sklearn for Time Series', difficulty: 'intermediate', readingMinutes: 30, description: 'ForecastingPipeline, reduction strategies, and sklearn-compatible forecasting.', buildsOn: '08-forecasting-libraries/c3-darts-sktime/s1-darts-intro' },
        ],
      },
      {
        id: 'c4-data-tools',
        title: 'Data Tools & Visualization',
        description: 'Pandas, Polars, and visualization tools for time series analysis and forecasting.',
        difficulty: 'beginner',
        estimatedMinutes: 160,
        sections: [
          { id: 's1-pandas-ts', title: 'Pandas for Time Series', difficulty: 'beginner', readingMinutes: 30, description: 'DatetimeIndex, resampling, rolling, shift, period, and time zone handling.', buildsOn: '01-ts-foundations/c1-intro-forecasting/s3-forecast-evaluation' },
          { id: 's2-polars-ts', title: 'Polars for Fast Time Series Processing', difficulty: 'intermediate', readingMinutes: 25, description: 'Polars lazy API, group-by-dynamic, rolling expressions, and benchmark comparisons.', buildsOn: '08-forecasting-libraries/c4-data-tools/s1-pandas-ts' },
          { id: 's3-visualization', title: 'Visualization: plotly, matplotlib, seaborn', difficulty: 'beginner', readingMinutes: 20, description: 'Interactive time series plots, seasonality plots, ACF/PACF, forecast fan charts.', buildsOn: '08-forecasting-libraries/c4-data-tools/s2-polars-ts' },
        ],
      },
    ],
  },
  {
    id: '09-supply-chain',
    title: 'Supply Chain Forecasting',
    icon: '⬡',
    colorHex: '#84cc16',
    description: 'Demand planning, inventory optimization, intermittent demand, SKU-level forecasting, and hierarchical reconciliation in supply chain contexts.',
    prerequisites: ['01-ts-foundations', '02-statistical-forecasting', '04-ml-forecasting'],
    practicalRelevance: 95,
    estimatedHours: 16,
    difficulty: 'intermediate',
    chapters: [
      {
        id: 'c1-demand-forecasting',
        title: 'Demand Forecasting',
        description: 'SKU-level demand forecasting, intermittent demand, and new product forecasting.',
        difficulty: 'intermediate',
        estimatedMinutes: 200,
        sections: [
          { id: 's1-demand-patterns', title: 'Demand Patterns & Classification', difficulty: 'intermediate', readingMinutes: 25, description: 'Smooth, erratic, intermittent, and lumpy demand — ABC-XYZ classification.', buildsOn: '02-statistical-forecasting/c1-simple-methods/s2-moving-averages' },
          { id: 's2-intermittent-demand', title: 'Intermittent Demand Methods', difficulty: 'intermediate', readingMinutes: 30, description: "Croston's method, SBA, TSB, IMAPA — forecasting slow-moving SKUs.", buildsOn: '09-supply-chain/c1-demand-forecasting/s1-demand-patterns' },
          { id: 's3-new-product', title: 'New Product Forecasting', difficulty: 'advanced', readingMinutes: 30, description: 'Bass diffusion model, analogous products, product lifecycle forecasting.', buildsOn: '09-supply-chain/c1-demand-forecasting/s2-intermittent-demand' },
          { id: 's4-sku-level-ml', title: 'ML for SKU-Level Demand', difficulty: 'intermediate', readingMinutes: 25, description: 'LightGBM for thousands of SKUs, global models, and handling cold-start.', buildsOn: '09-supply-chain/c1-demand-forecasting/s3-new-product' },
        ],
      },
      {
        id: 'c2-inventory-optimization',
        title: 'Inventory Optimization',
        description: 'Translating forecasts into inventory decisions — safety stock, reorder points, and service levels.',
        difficulty: 'intermediate',
        estimatedMinutes: 200,
        sections: [
          { id: 's1-safety-stock', title: 'Safety Stock Calculation', difficulty: 'intermediate', readingMinutes: 30, description: 'Safety stock formulas, cycle service level, fill rate, and forecast error impact.', buildsOn: '09-supply-chain/c1-demand-forecasting/s4-sku-level-ml' },
          { id: 's2-eoq-reorder', title: 'EOQ, ROP & Order Policies', difficulty: 'intermediate', readingMinutes: 25, description: 'Economic order quantity, reorder point, (s,S) and (R,Q) policies.', buildsOn: '09-supply-chain/c2-inventory-optimization/s1-safety-stock' },
          { id: 's3-probabilistic-inventory', title: 'Probabilistic Inventory Models', difficulty: 'advanced', readingMinutes: 35, description: 'Newsvendor model, stochastic lead times, simulation-based optimization.', buildsOn: '09-supply-chain/c2-inventory-optimization/s2-eoq-reorder' },
        ],
      },
      {
        id: 'c3-sc-hierarchical',
        title: 'Hierarchical Supply Chain Forecasting',
        description: 'Top-down, bottom-up, and middle-out forecasting across the supply chain hierarchy.',
        difficulty: 'advanced',
        estimatedMinutes: 180,
        sections: [
          { id: 's1-sc-hierarchy', title: 'Supply Chain Hierarchy', difficulty: 'advanced', readingMinutes: 30, description: 'Category → brand → product → SKU → store → DC hierarchy and aggregation constraints.', buildsOn: '09-supply-chain/c2-inventory-optimization/s3-probabilistic-inventory' },
          { id: 's2-reconciliation-sc', title: 'Reconciliation in Supply Chain', difficulty: 'advanced', readingMinutes: 35, description: 'MinT reconciliation for SKU/store, HierarchicalForecast library, coherent forecasts.', buildsOn: '09-supply-chain/c3-sc-hierarchical/s1-sc-hierarchy' },
        ],
      },
      {
        id: 'c4-sc-metrics',
        title: 'Forecast Metrics & Operational KPIs',
        description: 'Error metrics from an operations perspective — bias, MASE, and connecting forecast accuracy to business outcomes.',
        difficulty: 'intermediate',
        estimatedMinutes: 140,
        sections: [
          { id: 's1-forecast-bias', title: 'Forecast Bias & Tracking Signal', difficulty: 'intermediate', readingMinutes: 25, description: 'Bias detection, tracking signal, Trigg-Leach adaptive smoothing, bias correction.', buildsOn: '09-supply-chain/c3-sc-hierarchical/s2-reconciliation-sc' },
          { id: 's2-business-metrics', title: 'Connecting Forecasts to Business KPIs', difficulty: 'intermediate', readingMinutes: 25, description: 'Inventory cost, service level, stockout cost — forecast accuracy vs business value.', buildsOn: '09-supply-chain/c4-sc-metrics/s1-forecast-bias' },
        ],
      },
    ],
  },
  {
    id: '10-financial-forecasting',
    title: 'Financial Forecasting',
    icon: '$',
    colorHex: '#ec4899',
    description: 'Revenue forecasting, equity return prediction, volatility modeling, cryptocurrency forecasting, and options pricing using time series methods.',
    prerequisites: ['01-ts-foundations', '02-statistical-forecasting', '04-ml-forecasting'],
    practicalRelevance: 95,
    estimatedHours: 18,
    difficulty: 'advanced',
    chapters: [
      {
        id: 'c1-revenue-forecasting',
        title: 'Revenue & Business Forecasting',
        description: 'Top-down and bottom-up revenue forecasting, scenario planning, and business KPI forecasting.',
        difficulty: 'intermediate',
        estimatedMinutes: 200,
        sections: [
          { id: 's1-revenue-methods', title: 'Revenue Forecasting Methods', difficulty: 'intermediate', readingMinutes: 30, description: 'Top-down, bottom-up, driver-based forecasting, cohort analysis for SaaS/e-commerce.', buildsOn: '03-regression-causal/c4-hierarchical/s2-reconciliation' },
          { id: 's2-scenario-planning', title: 'Scenario Planning & Simulation', difficulty: 'intermediate', readingMinutes: 25, description: 'Base/bull/bear scenarios, Monte Carlo simulation, sensitivity analysis.', buildsOn: '10-financial-forecasting/c1-revenue-forecasting/s1-revenue-methods' },
          { id: 's3-kpi-forecasting', title: 'KPI Forecasting: DAU, MRR, Churn', difficulty: 'intermediate', readingMinutes: 25, description: 'Forecasting SaaS KPIs — DAU, MAU, MRR, ARR, churn rate with Prophet and ARIMA.', buildsOn: '10-financial-forecasting/c1-revenue-forecasting/s2-scenario-planning' },
        ],
      },
      {
        id: 'c2-equity-forecasting',
        title: 'Equity & Market Forecasting',
        description: 'Return prediction, factor models, portfolio optimization, and market regime detection.',
        difficulty: 'advanced',
        estimatedMinutes: 220,
        sections: [
          { id: 's1-return-prediction', title: 'Stock Return Prediction', difficulty: 'advanced', readingMinutes: 35, description: 'EMH limitations, momentum vs mean-reversion, ML for alpha, data mining bias.', buildsOn: '10-financial-forecasting/c1-revenue-forecasting/s3-kpi-forecasting' },
          { id: 's2-factor-models', title: 'Factor Models & Alpha', difficulty: 'advanced', readingMinutes: 35, description: 'Fama-French factors, linear factor models, ML factor construction, backtesting.', buildsOn: '10-financial-forecasting/c2-equity-forecasting/s1-return-prediction' },
          { id: 's3-regime-detection', title: 'Market Regime Detection', difficulty: 'advanced', readingMinutes: 30, description: 'HMM for regime detection, volatility regimes, regime-switching ARIMA.', buildsOn: '10-financial-forecasting/c2-equity-forecasting/s2-factor-models' },
        ],
      },
      {
        id: 'c3-volatility',
        title: 'Volatility Modeling',
        description: 'GARCH family models, realized volatility, VIX forecasting, and implied volatility surface.',
        difficulty: 'advanced',
        estimatedMinutes: 220,
        sections: [
          { id: 's1-garch-models', title: 'GARCH & EGARCH Models', difficulty: 'advanced', readingMinutes: 40, description: 'ARCH effects, GARCH(1,1), EGARCH, GJR-GARCH — estimating and forecasting volatility.', buildsOn: '10-financial-forecasting/c2-equity-forecasting/s3-regime-detection' },
          { id: 's2-realized-vol', title: 'Realized Volatility & HAR', difficulty: 'advanced', readingMinutes: 35, description: 'Realized variance, bipower variation, HAR-RV model, volatility forecasting benchmarks.', buildsOn: '10-financial-forecasting/c3-volatility/s1-garch-models' },
          { id: 's3-implied-vol', title: 'Implied Volatility & Vol Surface', difficulty: 'advanced', readingMinutes: 35, description: 'Black-Scholes IV, volatility smile/skew, term structure, and forecasting the surface.', buildsOn: '10-financial-forecasting/c3-volatility/s2-realized-vol' },
        ],
      },
      {
        id: 'c4-crypto-trading',
        title: 'Cryptocurrency & Algo Trading',
        description: 'Crypto market microstructure, on-chain data, sentiment, and algorithmic trading strategies.',
        difficulty: 'advanced',
        estimatedMinutes: 220,
        sections: [
          { id: 's1-crypto-forecasting', title: 'Cryptocurrency Price Forecasting', difficulty: 'advanced', readingMinutes: 35, description: 'Crypto market dynamics, on-chain metrics, sentiment signals, and ML approaches.', buildsOn: '10-financial-forecasting/c3-volatility/s3-implied-vol' },
          { id: 's2-algo-trading', title: 'Algorithmic Trading Strategies', difficulty: 'advanced', readingMinutes: 35, description: 'Momentum, mean-reversion, pairs trading — backtesting with vectorbt and zipline.', buildsOn: '10-financial-forecasting/c4-crypto-trading/s1-crypto-forecasting' },
          { id: 's3-risk-management', title: 'Risk Management & Position Sizing', difficulty: 'advanced', readingMinutes: 30, description: 'VaR, CVaR, Kelly criterion, maximum drawdown, and forecasting-based position sizing.', buildsOn: '10-financial-forecasting/c4-crypto-trading/s2-algo-trading' },
        ],
      },
    ],
  },
];

export default CURRICULUM;

export function getSubjectSectionCount(subjectId) {
  const subject = CURRICULUM.find((s) => s.id === subjectId);
  if (!subject) return 0;
  return subject.chapters.reduce((acc, ch) => acc + (ch.sections?.length || 0), 0);
}

export function getCurriculumById(subjectId) {
  return CURRICULUM.find((s) => s.id === subjectId) || null;
}

export function getChapterById(subjectId, chapterId) {
  const subject = getCurriculumById(subjectId);
  if (!subject) return null;
  return (subject.chapters || []).find((c) => c.id === chapterId) || null;
}

export function getSectionById(subjectId, chapterId, sectionId) {
  const chapter = getChapterById(subjectId, chapterId);
  if (!chapter) return null;
  return (chapter.sections || []).find((s) => s.id === sectionId) || null;
}

export function resolveBuildsOn(path) {
  if (!path) return null;
  const [subjectId, chapterId, sectionId] = path.split('/');
  return getSectionById(subjectId, chapterId, sectionId);
}

export function getAdjacentSections(subjectId, chapterId, sectionId) {
  const subject = getCurriculumById(subjectId);
  if (!subject) return { prev: null, next: null };
  const flat = [];
  for (const ch of subject.chapters || []) {
    for (const sec of ch.sections || []) {
      flat.push({ subjectId, chapterId: ch.id, sectionId: sec.id, title: sec.title });
    }
  }
  const idx = flat.findIndex((s) => s.chapterId === chapterId && s.sectionId === sectionId);
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}
