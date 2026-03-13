import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import CURRICULUM, { getSubjectSectionCount } from '../subjects/index.js'
import useProgress from '../hooks/useProgress.js'

const TS_SYMBOLS = ['〜', 'σ', 'μ', '∑', '∫', 'Δ', 'λ', 'ρ']

const FLOATING_POSITIONS = [
  { top: '12%', left: '8%', size: '3rem', delay: 0 },
  { top: '25%', right: '10%', size: '2.5rem', delay: 0.4 },
  { top: '60%', left: '5%', size: '2rem', delay: 0.8 },
  { bottom: '20%', right: '8%', size: '3.5rem', delay: 0.2 },
  { top: '45%', right: '20%', size: '2rem', delay: 1.1 },
  { top: '15%', left: '40%', size: '1.5rem', delay: 0.6 },
  { bottom: '30%', left: '18%', size: '2.5rem', delay: 0.9 },
  { top: '70%', right: '30%', size: '1.8rem', delay: 0.3 },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const LEARNING_PATH = [
  {
    step: 1,
    title: 'Foundations',
    subjects: ['Time Series Foundations', 'Statistical Forecasting', 'Regression & Causal'],
    color: '#0ea5e9',
  },
  {
    step: 2,
    title: 'Machine Learning',
    subjects: ['ML Forecasting', 'Python Libraries', 'Probabilistic Forecasting'],
    color: '#10b981',
  },
  {
    step: 3,
    title: 'Deep Learning',
    subjects: ['Deep Learning', 'Foundation Models'],
    color: '#f59e0b',
  },
  {
    step: 4,
    title: 'Applications',
    subjects: ['Supply Chain', 'Financial Forecasting'],
    color: '#ec4899',
  },
]

const FEATURES = [
  { icon: '📖', label: 'FPP3 Aligned', desc: "Based on Hyndman & Athanasopoulos's Forecasting: Principles and Practice 3rd ed." },
  { icon: '🐍', label: 'Python-First', desc: 'Every concept backed by runnable Python with statsforecast, mlforecast, neuralforecast.' },
  { icon: '📊', label: 'Interactive Charts', desc: 'Explore time series patterns, model diagnostics, and forecast comparisons interactively.' },
  { icon: '🏭', label: 'Real Applications', desc: 'Supply chain, demand planning, revenue, equity, options, and crypto forecasting.' },
  { icon: '🤖', label: 'Foundation Models', desc: 'TimeGPT, Chronos, Lag-Llama, Moirai, MOMENT — the latest pre-trained TS models.' },
  { icon: '📐', label: 'Rigorous Theory', desc: 'Formal statistical theory alongside practical implementation guidance.' },
]

export default function HomePage() {
  const { isComplete } = useProgress()

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-sky-50/30 px-6 py-20 md:py-28 dark:from-gray-950 dark:via-gray-900 dark:to-sky-950/20">
        {TS_SYMBOLS.map((symbol, idx) => {
          const pos = FLOATING_POSITIONS[idx] || {}
          return (
            <motion.span
              key={idx}
              className="pointer-events-none absolute select-none font-serif font-bold text-sky-200/40 dark:text-sky-400/10"
              style={{ ...pos, fontSize: pos.size }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -12, 0] }}
              transition={{
                opacity: { delay: pos.delay, duration: 0.6 },
                y: { delay: pos.delay, duration: 4 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' },
              }}
              aria-hidden="true"
            >
              {symbol}
            </motion.span>
          )
        })}

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
              Learn{' '}
              <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Forecasting
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="mx-auto mt-6 max-w-3xl text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            A comprehensive interactive resource for time series forecasting — statistical methods,
            machine learning, deep learning, and foundation models with real-world applications in
            supply chain, finance, and algorithmic trading.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {[
              { value: '10', label: 'Subjects' },
              { value: '35+', label: 'Chapters' },
              { value: '120+', label: 'Interactive Sections' },
              { value: 'FPP3', label: 'Aligned' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 backdrop-blur dark:border-gray-700 dark:bg-gray-800/60"
              >
                <span className="text-base font-bold text-sky-600 dark:text-sky-400">{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <a
              href="#subjects"
              className="rounded-xl bg-sky-600 px-7 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-sky-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Start Learning →
            </a>
            <Link
              to="/progress"
              className="rounded-xl border border-gray-300 bg-white px-7 py-3 text-base font-semibold text-gray-700 transition-all hover:border-sky-400 hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:border-sky-500 dark:hover:text-sky-400"
            >
              View Progress
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Learning Path ── */}
      <section className="bg-gray-50 px-6 py-16 dark:bg-gray-900/50">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Recommended Learning Path
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Build from statistical foundations to cutting-edge foundation models.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEARNING_PATH.map((phase, idx) => (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
              >
                <div
                  className="mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: phase.color }}
                >
                  {phase.step}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{phase.title}</h3>
                <ul className="space-y-1">
                  {phase.subjects.map((s) => (
                    <li key={s} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: phase.color }} aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subjects Grid ── */}
      <section id="subjects" className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">All Subjects</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              10 subjects covering the complete forecasting toolkit.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {CURRICULUM.map((subject) => {
              const total = getSubjectSectionCount(subject.id)
              const completed = subject.chapters?.reduce((acc, ch) => {
                return acc + (ch.sections?.filter((sec) => isComplete(subject.id, ch.id, sec.id)).length || 0)
              }, 0) || 0

              return (
                <motion.div key={subject.id} variants={cardVariants}>
                  <Link
                    to={`/subjects/${subject.id}`}
                    className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-sky-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-sky-700"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl text-white shadow-sm"
                        style={{ backgroundColor: subject.colorHex }}
                      >
                        {subject.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                          {subject.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {subject.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          subject.difficulty === 'beginner'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : subject.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}
                      >
                        {subject.difficulty}
                      </span>
                      <span>{subject.estimatedHours}h estimated</span>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
                        <span>{completed}/{total} sections</span>
                        <span>{total > 0 ? Math.round((completed / total) * 100) : 0}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: total > 0 ? `${(completed / total) * 100}%` : '0%',
                            backgroundColor: subject.colorHex,
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-gray-50 px-6 py-16 dark:bg-gray-900/50">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              What Makes This Different
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">{f.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Practical Forecasting Knowledge
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              Every section bridges theory and practice — formal statistical definitions alongside
              runnable Python code using the best libraries (statsforecast, mlforecast, neuralforecast,
              darts). Real-world use cases ground each technique in supply chain, revenue forecasting,
              equity markets, and cryptocurrency trading. Interactive charts let you explore model
              behavior and understand forecasting intuitively.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['FPP3 Aligned', 'Interactive Charts', 'Python Code', 'Supply Chain', 'Finance & Trading', 'Foundation Models', 'Progress Tracking'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-800/60 dark:bg-sky-900/20 dark:text-sky-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
