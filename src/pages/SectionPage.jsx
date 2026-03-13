import { useParams, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { getCurriculumById, getChapterById, getSectionById } from '../subjects/index.js'

// ─────────────────────────────────────────────────────────────────────────────
// Registry of sections that have full content pages written.
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_REGISTRY = {
  // 01-ts-foundations
  '01-ts-foundations/c1-intro-forecasting/s1-what-is-forecasting': lazy(() => import('../subjects/01-ts-foundations/c1-intro-forecasting/s1-what-is-forecasting.jsx')),
  '01-ts-foundations/c1-intro-forecasting/s2-forecasting-workflow': lazy(() => import('../subjects/01-ts-foundations/c1-intro-forecasting/s2-forecasting-workflow.jsx')),
  '01-ts-foundations/c1-intro-forecasting/s3-forecast-evaluation': lazy(() => import('../subjects/01-ts-foundations/c1-intro-forecasting/s3-forecast-evaluation.jsx')),
  '01-ts-foundations/c2-ts-components/s1-ts-patterns': lazy(() => import('../subjects/01-ts-foundations/c2-ts-components/s1-ts-patterns.jsx')),
  '01-ts-foundations/c2-ts-components/s2-decomposition': lazy(() => import('../subjects/01-ts-foundations/c2-ts-components/s2-decomposition.jsx')),
  '01-ts-foundations/c2-ts-components/s3-transformations': lazy(() => import('../subjects/01-ts-foundations/c2-ts-components/s3-transformations.jsx')),
  '01-ts-foundations/c3-stationarity/s1-stationarity': lazy(() => import('../subjects/01-ts-foundations/c3-stationarity/s1-stationarity.jsx')),
  '01-ts-foundations/c3-stationarity/s2-unit-root-tests': lazy(() => import('../subjects/01-ts-foundations/c3-stationarity/s2-unit-root-tests.jsx')),
  '01-ts-foundations/c3-stationarity/s3-differencing': lazy(() => import('../subjects/01-ts-foundations/c3-stationarity/s3-differencing.jsx')),
  '01-ts-foundations/c4-autocorrelation/s1-acf-pacf': lazy(() => import('../subjects/01-ts-foundations/c4-autocorrelation/s1-acf-pacf.jsx')),
  '01-ts-foundations/c4-autocorrelation/s2-residual-diagnostics': lazy(() => import('../subjects/01-ts-foundations/c4-autocorrelation/s2-residual-diagnostics.jsx')),
  '01-ts-foundations/c4-autocorrelation/s3-cross-correlation': lazy(() => import('../subjects/01-ts-foundations/c4-autocorrelation/s3-cross-correlation.jsx')),
  // 02-statistical-forecasting
  '02-statistical-forecasting/c1-simple-methods/s1-baseline-methods': lazy(() => import('../subjects/02-statistical-forecasting/c1-simple-methods/s1-baseline-methods.jsx')),
  '02-statistical-forecasting/c1-simple-methods/s2-moving-averages': lazy(() => import('../subjects/02-statistical-forecasting/c1-simple-methods/s2-moving-averages.jsx')),
  '02-statistical-forecasting/c2-exponential-smoothing/s1-simple-exponential-smoothing': lazy(() => import('../subjects/02-statistical-forecasting/c2-exponential-smoothing/s1-simple-exponential-smoothing.jsx')),
  '02-statistical-forecasting/c2-exponential-smoothing/s2-holt-holtwinters': lazy(() => import('../subjects/02-statistical-forecasting/c2-exponential-smoothing/s2-holt-holtwinters.jsx')),
  '02-statistical-forecasting/c2-exponential-smoothing/s3-ets-state-space': lazy(() => import('../subjects/02-statistical-forecasting/c2-exponential-smoothing/s3-ets-state-space.jsx')),
  '02-statistical-forecasting/c3-arima/s1-ar-ma-models': lazy(() => import('../subjects/02-statistical-forecasting/c3-arima/s1-ar-ma-models.jsx')),
  '02-statistical-forecasting/c3-arima/s2-arima': lazy(() => import('../subjects/02-statistical-forecasting/c3-arima/s2-arima.jsx')),
  '02-statistical-forecasting/c3-arima/s3-sarima': lazy(() => import('../subjects/02-statistical-forecasting/c3-arima/s3-sarima.jsx')),
  '02-statistical-forecasting/c3-arima/s4-arima-python': lazy(() => import('../subjects/02-statistical-forecasting/c3-arima/s4-arima-python.jsx')),
  '02-statistical-forecasting/c4-state-space/s1-state-space-basics': lazy(() => import('../subjects/02-statistical-forecasting/c4-state-space/s1-state-space-basics.jsx')),
  '02-statistical-forecasting/c4-state-space/s2-structural-ts': lazy(() => import('../subjects/02-statistical-forecasting/c4-state-space/s2-structural-ts.jsx')),
  '02-statistical-forecasting/c4-state-space/s3-prophet-model': lazy(() => import('../subjects/02-statistical-forecasting/c4-state-space/s3-prophet-model.jsx')),
  // 03-regression-causal
  '03-regression-causal/c1-ts-regression/s1-regression-basics': lazy(() => import('../subjects/03-regression-causal/c1-ts-regression/s1-regression-basics.jsx')),
  '03-regression-causal/c1-ts-regression/s2-fourier-terms': lazy(() => import('../subjects/03-regression-causal/c1-ts-regression/s2-fourier-terms.jsx')),
  '03-regression-causal/c1-ts-regression/s3-dynamic-harmonic': lazy(() => import('../subjects/03-regression-causal/c1-ts-regression/s3-dynamic-harmonic.jsx')),
  '03-regression-causal/c2-dynamic-regression/s1-arimax': lazy(() => import('../subjects/03-regression-causal/c2-dynamic-regression/s1-arimax.jsx')),
  '03-regression-causal/c2-dynamic-regression/s2-distributed-lag': lazy(() => import('../subjects/03-regression-causal/c2-dynamic-regression/s2-distributed-lag.jsx')),
  '03-regression-causal/c3-multivariate/s1-var-models': lazy(() => import('../subjects/03-regression-causal/c3-multivariate/s1-var-models.jsx')),
  '03-regression-causal/c3-multivariate/s2-granger-causality': lazy(() => import('../subjects/03-regression-causal/c3-multivariate/s2-granger-causality.jsx')),
  '03-regression-causal/c3-multivariate/s3-cointegration': lazy(() => import('../subjects/03-regression-causal/c3-multivariate/s3-cointegration.jsx')),
  '03-regression-causal/c4-hierarchical/s1-hierarchical-ts': lazy(() => import('../subjects/03-regression-causal/c4-hierarchical/s1-hierarchical-ts.jsx')),
  '03-regression-causal/c4-hierarchical/s2-reconciliation': lazy(() => import('../subjects/03-regression-causal/c4-hierarchical/s2-reconciliation.jsx')),
  // 04-ml-forecasting
  '04-ml-forecasting/c1-feature-engineering/s1-lag-features': lazy(() => import('../subjects/04-ml-forecasting/c1-feature-engineering/s1-lag-features.jsx')),
  '04-ml-forecasting/c1-feature-engineering/s2-calendar-features': lazy(() => import('../subjects/04-ml-forecasting/c1-feature-engineering/s2-calendar-features.jsx')),
  '04-ml-forecasting/c1-feature-engineering/s3-target-encoding': lazy(() => import('../subjects/04-ml-forecasting/c1-feature-engineering/s3-target-encoding.jsx')),
  '04-ml-forecasting/c1-feature-engineering/s4-feature-selection': lazy(() => import('../subjects/04-ml-forecasting/c1-feature-engineering/s4-feature-selection.jsx')),
  '04-ml-forecasting/c2-tree-models/s1-random-forest-ts': lazy(() => import('../subjects/04-ml-forecasting/c2-tree-models/s1-random-forest-ts.jsx')),
  '04-ml-forecasting/c2-tree-models/s2-xgboost-forecasting': lazy(() => import('../subjects/04-ml-forecasting/c2-tree-models/s2-xgboost-forecasting.jsx')),
  '04-ml-forecasting/c2-tree-models/s3-lightgbm-forecasting': lazy(() => import('../subjects/04-ml-forecasting/c2-tree-models/s3-lightgbm-forecasting.jsx')),
  '04-ml-forecasting/c2-tree-models/s4-catboost-forecasting': lazy(() => import('../subjects/04-ml-forecasting/c2-tree-models/s4-catboost-forecasting.jsx')),
  '04-ml-forecasting/c3-ml-strategies/s1-forecast-strategies': lazy(() => import('../subjects/04-ml-forecasting/c3-ml-strategies/s1-forecast-strategies.jsx')),
  '04-ml-forecasting/c3-ml-strategies/s2-time-series-cv': lazy(() => import('../subjects/04-ml-forecasting/c3-ml-strategies/s2-time-series-cv.jsx')),
  '04-ml-forecasting/c3-ml-strategies/s3-mlforecast-pipeline': lazy(() => import('../subjects/04-ml-forecasting/c3-ml-strategies/s3-mlforecast-pipeline.jsx')),
  '04-ml-forecasting/c4-global-local/s1-global-models': lazy(() => import('../subjects/04-ml-forecasting/c4-global-local/s1-global-models.jsx')),
  '04-ml-forecasting/c4-global-local/s2-transfer-forecasting': lazy(() => import('../subjects/04-ml-forecasting/c4-global-local/s2-transfer-forecasting.jsx')),
  // 05-deep-learning
  '05-deep-learning/c1-rnn-lstm/s1-rnn-basics': lazy(() => import('../subjects/05-deep-learning/c1-rnn-lstm/s1-rnn-basics.jsx')),
  '05-deep-learning/c1-rnn-lstm/s2-lstm-gru': lazy(() => import('../subjects/05-deep-learning/c1-rnn-lstm/s2-lstm-gru.jsx')),
  '05-deep-learning/c1-rnn-lstm/s3-seq2seq': lazy(() => import('../subjects/05-deep-learning/c1-rnn-lstm/s3-seq2seq.jsx')),
  '05-deep-learning/c2-modern-dl/s1-nbeats': lazy(() => import('../subjects/05-deep-learning/c2-modern-dl/s1-nbeats.jsx')),
  '05-deep-learning/c2-modern-dl/s2-nhits': lazy(() => import('../subjects/05-deep-learning/c2-modern-dl/s2-nhits.jsx')),
  '05-deep-learning/c2-modern-dl/s3-tcn': lazy(() => import('../subjects/05-deep-learning/c2-modern-dl/s3-tcn.jsx')),
  '05-deep-learning/c3-transformers/s1-attention-basics': lazy(() => import('../subjects/05-deep-learning/c3-transformers/s1-attention-basics.jsx')),
  '05-deep-learning/c3-transformers/s2-tft': lazy(() => import('../subjects/05-deep-learning/c3-transformers/s2-tft.jsx')),
  '05-deep-learning/c3-transformers/s3-patchtst': lazy(() => import('../subjects/05-deep-learning/c3-transformers/s3-patchtst.jsx')),
  '05-deep-learning/c4-neuralforecast/s1-neuralforecast-basics': lazy(() => import('../subjects/05-deep-learning/c4-neuralforecast/s1-neuralforecast-basics.jsx')),
  '05-deep-learning/c4-neuralforecast/s2-hyperparameter-tuning': lazy(() => import('../subjects/05-deep-learning/c4-neuralforecast/s2-hyperparameter-tuning.jsx')),
  // 06-foundation-models
  '06-foundation-models/c1-foundation-overview/s1-paradigm-shift': lazy(() => import('../subjects/06-foundation-models/c1-foundation-overview/s1-paradigm-shift.jsx')),
  '06-foundation-models/c1-foundation-overview/s2-benchmark-landscape': lazy(() => import('../subjects/06-foundation-models/c1-foundation-overview/s2-benchmark-landscape.jsx')),
  '06-foundation-models/c2-timegpt/s1-timegpt-intro': lazy(() => import('../subjects/06-foundation-models/c2-timegpt/s1-timegpt-intro.jsx')),
  '06-foundation-models/c2-timegpt/s2-timegpt-finetuning': lazy(() => import('../subjects/06-foundation-models/c2-timegpt/s2-timegpt-finetuning.jsx')),
  '06-foundation-models/c2-timegpt/s3-timegpt-applications': lazy(() => import('../subjects/06-foundation-models/c2-timegpt/s3-timegpt-applications.jsx')),
  '06-foundation-models/c3-chronos/s1-chronos-architecture': lazy(() => import('../subjects/06-foundation-models/c3-chronos/s1-chronos-architecture.jsx')),
  '06-foundation-models/c3-chronos/s2-chronos-inference': lazy(() => import('../subjects/06-foundation-models/c3-chronos/s2-chronos-inference.jsx')),
  '06-foundation-models/c4-other-foundation/s1-lag-llama': lazy(() => import('../subjects/06-foundation-models/c4-other-foundation/s1-lag-llama.jsx')),
  '06-foundation-models/c4-other-foundation/s2-moirai': lazy(() => import('../subjects/06-foundation-models/c4-other-foundation/s2-moirai.jsx')),
  '06-foundation-models/c4-other-foundation/s3-moment-timesfm': lazy(() => import('../subjects/06-foundation-models/c4-other-foundation/s3-moment-timesfm.jsx')),
  // 07-probabilistic-forecasting
  '07-probabilistic-forecasting/c1-forecast-uncertainty/s1-prediction-intervals': lazy(() => import('../subjects/07-probabilistic-forecasting/c1-forecast-uncertainty/s1-prediction-intervals.jsx')),
  '07-probabilistic-forecasting/c1-forecast-uncertainty/s2-quantile-forecasting': lazy(() => import('../subjects/07-probabilistic-forecasting/c1-forecast-uncertainty/s2-quantile-forecasting.jsx')),
  '07-probabilistic-forecasting/c1-forecast-uncertainty/s3-distributional-forecasting': lazy(() => import('../subjects/07-probabilistic-forecasting/c1-forecast-uncertainty/s3-distributional-forecasting.jsx')),
  '07-probabilistic-forecasting/c2-conformal-prediction/s1-conformal-basics': lazy(() => import('../subjects/07-probabilistic-forecasting/c2-conformal-prediction/s1-conformal-basics.jsx')),
  '07-probabilistic-forecasting/c2-conformal-prediction/s2-adaptive-conformal': lazy(() => import('../subjects/07-probabilistic-forecasting/c2-conformal-prediction/s2-adaptive-conformal.jsx')),
  '07-probabilistic-forecasting/c3-bayesian-forecasting/s1-bayesian-ts': lazy(() => import('../subjects/07-probabilistic-forecasting/c3-bayesian-forecasting/s1-bayesian-ts.jsx')),
  '07-probabilistic-forecasting/c3-bayesian-forecasting/s2-pymc-forecasting': lazy(() => import('../subjects/07-probabilistic-forecasting/c3-bayesian-forecasting/s2-pymc-forecasting.jsx')),
  '07-probabilistic-forecasting/c3-bayesian-forecasting/s3-bsts': lazy(() => import('../subjects/07-probabilistic-forecasting/c3-bayesian-forecasting/s3-bsts.jsx')),
  '07-probabilistic-forecasting/c4-ensemble-forecasting/s1-forecast-combination': lazy(() => import('../subjects/07-probabilistic-forecasting/c4-ensemble-forecasting/s1-forecast-combination.jsx')),
  '07-probabilistic-forecasting/c4-ensemble-forecasting/s2-stacking-forecasts': lazy(() => import('../subjects/07-probabilistic-forecasting/c4-ensemble-forecasting/s2-stacking-forecasts.jsx')),
  // 08-forecasting-libraries
  '08-forecasting-libraries/c1-statsforecast/s1-statsforecast-intro': lazy(() => import('../subjects/08-forecasting-libraries/c1-statsforecast/s1-statsforecast-intro.jsx')),
  '08-forecasting-libraries/c1-statsforecast/s2-statsforecast-models': lazy(() => import('../subjects/08-forecasting-libraries/c1-statsforecast/s2-statsforecast-models.jsx')),
  '08-forecasting-libraries/c1-statsforecast/s3-statsforecast-scale': lazy(() => import('../subjects/08-forecasting-libraries/c1-statsforecast/s3-statsforecast-scale.jsx')),
  '08-forecasting-libraries/c2-mlforecast-lib/s1-mlforecast-intro': lazy(() => import('../subjects/08-forecasting-libraries/c2-mlforecast-lib/s1-mlforecast-intro.jsx')),
  '08-forecasting-libraries/c2-mlforecast-lib/s2-mlforecast-features': lazy(() => import('../subjects/08-forecasting-libraries/c2-mlforecast-lib/s2-mlforecast-features.jsx')),
  '08-forecasting-libraries/c3-darts-sktime/s1-darts-intro': lazy(() => import('../subjects/08-forecasting-libraries/c3-darts-sktime/s1-darts-intro.jsx')),
  '08-forecasting-libraries/c3-darts-sktime/s2-sktime-intro': lazy(() => import('../subjects/08-forecasting-libraries/c3-darts-sktime/s2-sktime-intro.jsx')),
  '08-forecasting-libraries/c4-data-tools/s1-pandas-ts': lazy(() => import('../subjects/08-forecasting-libraries/c4-data-tools/s1-pandas-ts.jsx')),
  '08-forecasting-libraries/c4-data-tools/s2-polars-ts': lazy(() => import('../subjects/08-forecasting-libraries/c4-data-tools/s2-polars-ts.jsx')),
  '08-forecasting-libraries/c4-data-tools/s3-visualization': lazy(() => import('../subjects/08-forecasting-libraries/c4-data-tools/s3-visualization.jsx')),
  // 09-supply-chain
  '09-supply-chain/c1-demand-forecasting/s1-demand-patterns': lazy(() => import('../subjects/09-supply-chain/c1-demand-forecasting/s1-demand-patterns.jsx')),
  '09-supply-chain/c1-demand-forecasting/s2-intermittent-demand': lazy(() => import('../subjects/09-supply-chain/c1-demand-forecasting/s2-intermittent-demand.jsx')),
  '09-supply-chain/c1-demand-forecasting/s3-new-product': lazy(() => import('../subjects/09-supply-chain/c1-demand-forecasting/s3-new-product.jsx')),
  '09-supply-chain/c1-demand-forecasting/s4-sku-level-ml': lazy(() => import('../subjects/09-supply-chain/c1-demand-forecasting/s4-sku-level-ml.jsx')),
  '09-supply-chain/c2-inventory-optimization/s1-safety-stock': lazy(() => import('../subjects/09-supply-chain/c2-inventory-optimization/s1-safety-stock.jsx')),
  '09-supply-chain/c2-inventory-optimization/s2-eoq-reorder': lazy(() => import('../subjects/09-supply-chain/c2-inventory-optimization/s2-eoq-reorder.jsx')),
  '09-supply-chain/c2-inventory-optimization/s3-probabilistic-inventory': lazy(() => import('../subjects/09-supply-chain/c2-inventory-optimization/s3-probabilistic-inventory.jsx')),
  '09-supply-chain/c3-sc-hierarchical/s1-sc-hierarchy': lazy(() => import('../subjects/09-supply-chain/c3-sc-hierarchical/s1-sc-hierarchy.jsx')),
  '09-supply-chain/c3-sc-hierarchical/s2-reconciliation-sc': lazy(() => import('../subjects/09-supply-chain/c3-sc-hierarchical/s2-reconciliation-sc.jsx')),
  '09-supply-chain/c4-sc-metrics/s1-forecast-bias': lazy(() => import('../subjects/09-supply-chain/c4-sc-metrics/s1-forecast-bias.jsx')),
  '09-supply-chain/c4-sc-metrics/s2-business-metrics': lazy(() => import('../subjects/09-supply-chain/c4-sc-metrics/s2-business-metrics.jsx')),
  // 10-financial-forecasting
  '10-financial-forecasting/c1-revenue-forecasting/s1-revenue-methods': lazy(() => import('../subjects/10-financial-forecasting/c1-revenue-forecasting/s1-revenue-methods.jsx')),
  '10-financial-forecasting/c1-revenue-forecasting/s2-scenario-planning': lazy(() => import('../subjects/10-financial-forecasting/c1-revenue-forecasting/s2-scenario-planning.jsx')),
  '10-financial-forecasting/c1-revenue-forecasting/s3-kpi-forecasting': lazy(() => import('../subjects/10-financial-forecasting/c1-revenue-forecasting/s3-kpi-forecasting.jsx')),
  '10-financial-forecasting/c2-equity-forecasting/s1-return-prediction': lazy(() => import('../subjects/10-financial-forecasting/c2-equity-forecasting/s1-return-prediction.jsx')),
  '10-financial-forecasting/c2-equity-forecasting/s2-factor-models': lazy(() => import('../subjects/10-financial-forecasting/c2-equity-forecasting/s2-factor-models.jsx')),
  '10-financial-forecasting/c2-equity-forecasting/s3-regime-detection': lazy(() => import('../subjects/10-financial-forecasting/c2-equity-forecasting/s3-regime-detection.jsx')),
  '10-financial-forecasting/c3-volatility/s1-garch-models': lazy(() => import('../subjects/10-financial-forecasting/c3-volatility/s1-garch-models.jsx')),
  '10-financial-forecasting/c3-volatility/s2-realized-vol': lazy(() => import('../subjects/10-financial-forecasting/c3-volatility/s2-realized-vol.jsx')),
  '10-financial-forecasting/c3-volatility/s3-implied-vol': lazy(() => import('../subjects/10-financial-forecasting/c3-volatility/s3-implied-vol.jsx')),
  '10-financial-forecasting/c4-crypto-trading/s1-crypto-forecasting': lazy(() => import('../subjects/10-financial-forecasting/c4-crypto-trading/s1-crypto-forecasting.jsx')),
  '10-financial-forecasting/c4-crypto-trading/s2-algo-trading': lazy(() => import('../subjects/10-financial-forecasting/c4-crypto-trading/s2-algo-trading.jsx')),
  '10-financial-forecasting/c4-crypto-trading/s3-risk-management': lazy(() => import('../subjects/10-financial-forecasting/c4-crypto-trading/s3-risk-management.jsx')),
}

function ComingSoon({ subjectId, chapterId, sectionId }) {
  const subject = getCurriculumById(subjectId)
  const chapter = getChapterById(subjectId, chapterId)
  const section = getSectionById(subjectId, chapterId, sectionId)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 text-center">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {section?.title || 'Section'} — Coming Soon
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        This section is being written. Check back soon for the full content.
      </p>
      <div className="flex justify-center gap-4">
        {chapter && (
          <Link
            to={`/subjects/${subjectId}/${chapterId}`}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-sky-400 hover:text-sky-700 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:border-sky-600 dark:hover:text-sky-400"
          >
            ← Back to {chapter.title}
          </Link>
        )}
        <Link
          to={`/subjects/${subjectId}`}
          className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
        >
          View All Sections
        </Link>
      </div>
    </div>
  )
}

export default function SectionPage() {
  const { subjectId, chapterId, sectionId } = useParams()
  const key = `${subjectId}/${chapterId}/${sectionId}`
  const ContentComponent = CONTENT_REGISTRY[key]

  if (!ContentComponent) {
    return <ComingSoon subjectId={subjectId} chapterId={chapterId} sectionId={sectionId} />
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[40vh] text-gray-400">
          Loading section…
        </div>
      }
    >
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ContentComponent />
      </motion.div>
    </Suspense>
  )
}
