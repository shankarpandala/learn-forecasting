import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCurriculumById, getChapterById } from '../subjects/index.js'
import useProgress from '../hooks/useProgress.js'

const DIFFICULTY_STYLES = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-300 dark:border-orange-700',
  expert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-700',
}

export default function ChapterPage() {
  const { subjectId, chapterId } = useParams()
  const subject = getCurriculumById(subjectId)
  const chapter = getChapterById(subjectId, chapterId)
  const { isComplete } = useProgress()

  if (!subject || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">Chapter not found.</p>
        <Link to="/" className="text-sky-600 hover:underline dark:text-sky-400">← Back to Home</Link>
      </div>
    )
  }

  const completed = chapter.sections?.filter((sec) => isComplete(subjectId, chapterId, sec.id)).length || 0
  const total = chapter.sections?.length || 0
  const chapterIdx = subject.chapters?.findIndex((c) => c.id === chapterId) ?? 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Home</Link>
        <span className="mx-2">›</span>
        <Link to={`/subjects/${subjectId}`} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">{subject.title}</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 dark:text-gray-100">{chapter.title}</span>
      </nav>

      {/* Chapter header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: subject.colorHex }}
          >
            {chapterIdx + 1}
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{subject.title}</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-3">{chapter.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">{chapter.description}</p>

        <div className="flex items-center gap-4">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${DIFFICULTY_STYLES[chapter.difficulty] || DIFFICULTY_STYLES.intermediate}`}>
            {chapter.difficulty}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round((chapter.estimatedMinutes || 0) / 60 * 10) / 10}h estimated</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{completed}/{total} completed</span>
        </div>

        <div className="mt-4 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
          <motion.div
            className="h-2 rounded-full"
            style={{ backgroundColor: subject.colorHex }}
            initial={{ width: 0 }}
            animate={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Sections list */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Sections</h2>
        {chapter.sections?.map((section, idx) => {
          const done = isComplete(subjectId, chapterId, section.id)
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
            >
              <Link
                to={`/subjects/${subjectId}/${chapterId}/${section.id}`}
                className={`group flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md ${
                  done
                    ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/40 dark:bg-emerald-900/10'
                    : 'border-gray-200 bg-white hover:border-sky-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-sky-700'
                }`}
              >
                {/* Step number / check */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  done
                    ? 'bg-emerald-500 text-white dark:bg-emerald-500'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-sky-100 group-hover:text-sky-700 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-sky-900/30 dark:group-hover:text-sky-400'
                }`}>
                  {done ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate transition-colors ${
                    done ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 group-hover:text-sky-700 dark:text-gray-100 dark:group-hover:text-sky-400'
                  }`}>
                    {section.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{section.description}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[section.difficulty] || DIFFICULTY_STYLES.intermediate}`}>
                    {section.difficulty}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{section.readingMinutes}m</span>
                  <svg className="h-4 w-4 text-gray-400 group-hover:text-sky-500 transition-colors dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Back to subject */}
      <div className="mt-10 flex justify-start">
        <Link
          to={`/subjects/${subjectId}`}
          className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {subject.title}
        </Link>
      </div>
    </div>
  )
}
