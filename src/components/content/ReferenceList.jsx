import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ChevronIcon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const TYPE_CONFIG = {
  foundational: {
    label: 'Foundational',
    cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    dot: 'bg-purple-500',
  },
  paper: {
    label: 'Paper',
    cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  book: {
    label: 'Book',
    cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  software: {
    label: 'Software',
    cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    dot: 'bg-orange-500',
  },
};

function ReferenceItem({ ref: reference, index }) {
  const [showWhy, setShowWhy] = useState(false);
  const typeConf = TYPE_CONFIG[reference.type] ?? TYPE_CONFIG.paper;

  return (
    <li className="group flex gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
      {/* Index */}
      <span className="flex-none w-6 text-right text-xs text-zinc-400 dark:text-zinc-600 pt-0.5 font-mono">
        [{index}]
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-snug">
            {/* Authors */}
            {reference.authors && (
              <span className="font-medium">{reference.authors}</span>
            )}
            {reference.year && (
              <span className="text-zinc-500 dark:text-zinc-400"> ({reference.year}). </span>
            )}
            {/* Title */}
            {reference.title && (
              <span className="italic">{reference.title}.</span>
            )}
            {/* Venue */}
            {reference.venue && (
              <span className="text-zinc-500 dark:text-zinc-400"> {reference.venue}.</span>
            )}
          </p>

          {/* Type badge */}
          <span className={`flex-none inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeConf.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${typeConf.dot}`} />
            {typeConf.label}
          </span>
        </div>

        {/* Why important */}
        {reference.whyImportant && (
          <div>
            <button
              onClick={() => setShowWhy((v) => !v)}
              className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              <ChevronIcon open={showWhy} />
              {showWhy ? 'Hide' : 'Why important?'}
            </button>

            <AnimatePresence initial={false}>
              {showWhy && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-4 border-l-2 border-sky-300 dark:border-sky-700">
                    {reference.whyImportant}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </li>
  );
}

/**
 * ReferenceList
 *
 * Props:
 *   references – array of reference objects:
 *     {
 *       authors:      string,
 *       year:         string | number,
 *       title:        string,
 *       venue:        string,
 *       type:         'paper' | 'book' | 'foundational' | 'software',
 *       whyImportant: string (optional),
 *     }
 */
export default function ReferenceList({ references }) {
  if (!references || references.length === 0) return null;

  // Group by type for summary
  const typeCounts = references.reduce((acc, r) => {
    const t = r.type || 'paper';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="my-8 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            References ({references.length})
          </span>
        </div>

        {/* Type summary pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(typeCounts).map(([type, count]) => {
            const conf = TYPE_CONFIG[type] ?? TYPE_CONFIG.paper;
            return (
              <span key={type} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${conf.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                {count} {conf.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Reference list */}
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800 px-5">
        {references.map((ref, idx) => (
          <ReferenceItem key={idx} ref={ref} index={idx + 1} />
        ))}
      </ul>
    </div>
  );
}
