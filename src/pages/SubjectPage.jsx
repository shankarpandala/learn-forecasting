import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCurriculumById, getSubjectSectionCount } from '../subjects/index.js'
import useProgress from '../hooks/useProgress.js'

const DIFFICULTY_STYLES = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-300 dark:border-orange-700',
  expert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-700',
}

export default function SubjectPage() {
  const { subjectId } = useParams()
  const subject = getCurriculumById(subjectId)
  const { isComplete } = useProgress()

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">Subject not found.</p>
        <Link to="/" className="text-sky-600 hover:underline dark:text-sky-400">← Back to Home</Link>
      </div>
    )
  }

  const totalSections = getSubjectSectionCount(subjectId)
  const completedSections = subject.chapters?.reduce((acc, ch) => {
    return acc + (ch.sections?.filter((sec) => isComplete(subjectId, ch.id, sec.id)).length || 0)
  }, 0) || 0
  const progressPct = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 dark:text-gray-100">{subject.title}</span>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="flex items-start gap-5">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl text-white shadow-md"
            style={{ backgroundColor: subject.colorHex }}
          >
            {subject.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${DIFFICULTY_STYLES[subject.difficulty] || DIFFICULTY_STYLES.intermediate}`}>
                {subject.difficulty}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{subject.estimatedHours}h estimated</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">·</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{totalSections} sections</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">{subject.title}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">{subject.description}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">Your Progress</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">{completedSections} / {totalSections} sections ({progressPct}%)</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
            <motion.div
              className="h-2.5 rounded-full"
              style={{ backgroundColor: subject.colorHex }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Prerequisites */}
        {subject.prerequisites?.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Prerequisites:</span>
            {subject.prerequisites.map((prereqId) => (
              <Link
                key={prereqId}
                to={`/subjects/${prereqId}`}
                className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs text-sky-600 hover:text-sky-800 dark:border-gray-700 dark:bg-gray-800/40 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
              >
                {prereqId.replace(/^\d+-/, '').replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Chapters */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Chapters</h2>
        {subject.chapters?.map((chapter, chIdx) => {
          const chCompleted = chapter.sections?.filter((sec) => isComplete(subjectId, chapter.id, sec.id)).length || 0
          const chTotal = chapter.sections?.length || 0
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chIdx * 0.07, duration: 0.4 }}
              className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Chapter header */}
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 dark:border-gray-800">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: subject.colorHex }}
                  >
                    {chIdx + 1}
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/subjects/${subjectId}/${chapter.id}`}
                      className="font-semibold text-gray-900 hover:text-sky-700 dark:text-gray-100 dark:hover:text-sky-400 transition-colors"
                    >
                      {chapter.title}
                    </Link>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{chapter.description}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{chCompleted}/{chTotal}</span>
                </div>
              </div>

              {/* Sections list */}
              <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
                {chapter.sections?.map((section) => {
                  const done = isComplete(subjectId, chapter.id, section.id)
                  return (
                    <Link
                      key={section.id}
                      to={`/subjects/${subjectId}/${chapter.id}/${section.id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <div className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                        done
                          ? 'border-emerald-500 bg-emerald-500 dark:border-emerald-400 dark:bg-emerald-400'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {done && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${done ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                          {section.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{section.description}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[section.difficulty] || DIFFICULTY_STYLES.intermediate}`}>
                          {section.difficulty}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{section.readingMinutes}m</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
