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
 * Single exercise within the ExerciseBlock
 */
function Exercise({ exercise, number }) {
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const diff = difficultyMap[exercise.difficulty] ?? difficultyMap.beginner;

  return (
    <div className="rounded-lg border border-green-200 dark:border-green-800 overflow-hidden">
      {/* Exercise header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-green-50 dark:bg-green-950/30 border-b border-green-200 dark:border-green-800">
        <span className="flex-none w-6 h-6 rounded-full bg-green-600 dark:bg-green-700 text-white flex items-center justify-center text-xs font-bold">
          {number}
        </span>
        <span className="flex-1 text-sm font-semibold text-green-900 dark:text-green-100 truncate">
          {exercise.title}
        </span>
        {exercise.difficulty && (
          <span className={`flex-none inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${diff.cls}`}>
            {diff.label}
          </span>
        )}
      </div>

      {/* Problem */}
      <div className="px-4 py-3 space-y-3 bg-white dark:bg-zinc-900/20">
        {exercise.problem && (
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {renderInline(exercise.problem)}
          </p>
        )}

        {/* Hints */}
        {exercise.hints && exercise.hints.length > 0 && (
          <div>
            <button
              onClick={() => setShowHints((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
            >
              <ChevronIcon open={showHints} />
              {showHints ? 'Hide Hints' : `Hints (${exercise.hints.length})`}
            </button>

            <AnimatePresence initial={false}>
              {showHints && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ul className="mt-2 space-y-1.5 pl-4">
                    {exercise.hints.map((hint, i) => (
                      <li key={i} className="flex gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="text-green-500 flex-none mt-0.5">💡</span>
                        <span>{renderInline(hint)}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Solution */}
        {exercise.solution && (
          <div>
            <button
              onClick={() => setShowSolution((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
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
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 pl-3 border-l-2 border-green-300 dark:border-green-700 space-y-2">
                    {typeof exercise.solution === 'string' ? (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {renderInline(exercise.solution)}
                      </p>
                    ) : Array.isArray(exercise.solution) ? (
                      exercise.solution.map((step, i) => (
                        <div key={i} className="space-y-1">
                          {step.step && (
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              {renderInline(step.step)}
                            </p>
                          )}
                          {step.formula && (
                            <div className="overflow-x-auto">
                              <BlockMath math={step.formula} />
                            </div>
                          )}
                          {step.explanation && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {renderInline(step.explanation)}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      exercise.solution
                    )}
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

/**
 * ExerciseBlock
 *
 * Props:
 *   exercises – array of exercise objects, each with:
 *     { title, difficulty, problem, hints (array of strings), solution }
 */
export default function ExerciseBlock({ exercises }) {
  if (!exercises || exercises.length === 0) return null;

  return (
    <div className="my-6 rounded-xl border border-green-200 dark:border-green-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-green-100 dark:bg-green-900/40 border-b border-green-200 dark:border-green-800">
        <span className="flex-none w-8 h-8 rounded-full bg-green-600 dark:bg-green-700 text-white flex items-center justify-center text-base">
          ★
        </span>
        <span className="text-sm font-semibold text-green-900 dark:text-green-100">
          Exercises ({exercises.length})
        </span>
      </div>

      {/* Exercise list */}
      <div className="p-4 space-y-3 bg-green-50/30 dark:bg-green-950/10">
        {exercises.map((exercise, idx) => (
          <Exercise key={idx} exercise={exercise} number={idx + 1} />
        ))}
      </div>
    </div>
  );
}
