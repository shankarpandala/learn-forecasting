import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

function ChevronIcon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function renderInline(text) {
  if (!text || typeof text !== 'string') return text;
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={i} math={part.slice(1, -1)} />;
    }
    return part;
  });
}

const difficultyMap = {
  beginner: { label: 'Beginner', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  intermediate: { label: 'Intermediate', cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
  advanced: { label: 'Advanced', cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  expert: { label: 'Expert', cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
};

/**
 * ExampleBlock
 *
 * Props:
 *   title      – example title string
 *   difficulty – 'beginner' | 'intermediate' | 'advanced' | 'expert'
 *   problem    – problem statement (string, may contain $...$)
 *   solution   – array of step objects: { step, formula, explanation }
 */
export default function ExampleBlock({ title, difficulty, problem, solution }) {
  const [showSolution, setShowSolution] = useState(false);
  const diff = difficultyMap[difficulty] ?? difficultyMap.beginner;

  return (
    <div className="my-6 rounded-xl border border-amber-200 dark:border-amber-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-amber-100 dark:bg-amber-900/40 border-b border-amber-200 dark:border-amber-800">
        <span className="flex-none w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
          E
        </span>
        <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-amber-900 dark:text-amber-100 truncate">
            {title}
          </span>
          {difficulty && (
            <span className={`flex-none inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${diff.cls}`}>
              {diff.label}
            </span>
          )}
        </div>
      </div>

      {/* Problem */}
      <div className="px-5 py-4 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
        {problem && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
              Problem
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {renderInline(problem)}
            </p>
          </div>
        )}

        {/* Solution toggle */}
        {solution && solution.length > 0 && (
          <div className="pt-3 border-t border-amber-200 dark:border-amber-800">
            <button
              onClick={() => setShowSolution((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
            >
              <ChevronIcon open={showSolution} />
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>

            <AnimatePresence initial={false}>
              {showSolution && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-4">
                    {solution.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        {/* Step number */}
                        <div className="flex-none w-7 h-7 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-center text-xs font-bold mt-0.5">
                          {idx + 1}
                        </div>

                        <div className="flex-1 space-y-2 min-w-0">
                          {/* Step label */}
                          {item.step && (
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              {renderInline(item.step)}
                            </p>
                          )}

                          {/* Formula */}
                          {item.formula && (
                            <div className="overflow-x-auto bg-white/70 dark:bg-zinc-900/50 rounded-lg px-4 py-2">
                              <BlockMath math={item.formula} />
                            </div>
                          )}

                          {/* Explanation */}
                          {item.explanation && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                              {renderInline(item.explanation)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
