import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CURRICULUM from '../subjects/index.js'

function buildSearchIndex() {
  const items = []
  for (const subject of CURRICULUM) {
    for (const chapter of subject.chapters || []) {
      for (const section of chapter.sections || []) {
        items.push({
          subjectId: subject.id,
          subjectTitle: subject.title,
          subjectColor: subject.colorHex,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          sectionId: section.id,
          sectionTitle: section.title,
          description: section.description || '',
          difficulty: section.difficulty,
          readingMinutes: section.readingMinutes,
          searchText: [subject.title, chapter.title, section.title, section.description || ''].join(' ').toLowerCase(),
        })
      }
    }
  }
  return items
}

const SEARCH_INDEX = buildSearchIndex()

export default function SearchPage() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return SEARCH_INDEX.filter((item) => item.searchText.includes(q)).slice(0, 30)
  }, [query])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Search</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Search across all forecasting topics, techniques, and libraries.</p>

        {/* Search input */}
        <div className="relative mb-8">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search ARIMA, LightGBM, GARCH, demand forecasting…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-sky-600"
            autoFocus
          />
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {query.trim() && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {results.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                  No results for "{query}". Try different keywords.
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</p>
                  <div className="space-y-2">
                    {results.map((item, idx) => (
                      <motion.div
                        key={`${item.subjectId}/${item.chapterId}/${item.sectionId}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.25 }}
                      >
                        <Link
                          to={`/subjects/${item.subjectId}/${item.chapterId}/${item.sectionId}`}
                          className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-sky-300 hover:shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-sky-700"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                              style={{ backgroundColor: item.subjectColor }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.sectionTitle}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {item.subjectTitle} › {item.chapterTitle}
                              </p>
                              {item.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                              )}
                            </div>
                            <div className="shrink-0 flex items-center gap-1">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                item.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                item.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                              }`}>
                                {item.difficulty}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!query.trim() && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400">Start typing to search across {SEARCH_INDEX.length} sections.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['ARIMA', 'LightGBM', 'LSTM', 'TimeGPT', 'conformal prediction', 'demand forecasting', 'GARCH', 'N-BEATS'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 hover:border-sky-300 hover:text-sky-700 transition-colors dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:border-sky-600 dark:hover:text-sky-400"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
