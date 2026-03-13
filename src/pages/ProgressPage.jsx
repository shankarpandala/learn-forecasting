import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import CURRICULUM, { getSubjectSectionCount } from '../subjects/index.js'
import useProgress from '../hooks/useProgress.js'
import useAppStore from '../store/appStore.js'

export default function ProgressPage() {
  const { isComplete, completedSections } = useProgress()
  const bookmarks = useAppStore((s) => s.bookmarks)
  const removeBookmark = useAppStore((s) => s.removeBookmark)

  const totalAllSections = CURRICULUM.reduce((acc, s) => acc + getSubjectSectionCount(s.id), 0)
  const totalCompleted = completedSections.length
  const overallPct = totalAllSections > 0 ? Math.round((totalCompleted / totalAllSections) * 100) : 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">My Progress</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Track your forecasting journey across all subjects.</p>

        {/* Overall progress */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-900 dark:text-gray-100">Overall Completion</span>
            <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">{overallPct}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 mb-2">
            <motion.div
              className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{totalCompleted} of {totalAllSections} sections completed</p>
        </div>

        {/* Per-subject progress */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Subjects</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-10">
          {CURRICULUM.map((subject, idx) => {
            const total = getSubjectSectionCount(subject.id)
            const done = subject.chapters?.reduce((acc, ch) => {
              return acc + (ch.sections?.filter((sec) => isComplete(subject.id, ch.id, sec.id)).length || 0)
            }, 0) || 0
            const pct = total > 0 ? Math.round((done / total) * 100) : 0

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <Link
                  to={`/subjects/${subject.id}`}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-sky-300 hover:shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-sky-700"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg text-white"
                    style={{ backgroundColor: subject.colorHex }}
                  >
                    {subject.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{subject.title}</p>
                      <span className="text-xs font-bold ml-2 shrink-0" style={{ color: subject.colorHex }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: subject.colorHex }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{done}/{total} sections</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bookmarks */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Bookmarks</h2>
        {bookmarks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-gray-400 dark:text-gray-500">
            <p className="text-sm">No bookmarks yet. Bookmark sections while reading to find them here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarks.map((b) => (
              <div
                key={`${b.subjectId}::${b.chapterId}::${b.sectionId}`}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
              >
                <Link
                  to={`/subjects/${b.subjectId}/${b.chapterId}/${b.sectionId}`}
                  className="flex-1 min-w-0 text-sm font-medium text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 truncate"
                >
                  {b.title}
                </Link>
                <button
                  onClick={() => removeBookmark(b.subjectId, b.chapterId, b.sectionId)}
                  className="shrink-0 text-xs text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                  aria-label="Remove bookmark"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
