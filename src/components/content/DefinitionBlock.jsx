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

/**
 * Render a text string, replacing $...$ with inline KaTeX.
 */
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

/**
 * DefinitionBlock
 *
 * Props:
 *   label      – e.g. "Definition 1.1"
 *   title      – name of the term being defined
 *   definition – definition text (may contain $...$ inline math)
 *   formula    – optional LaTeX string rendered as BlockMath
 *   notation   – optional string or array of { symbol, meaning } objects
 *   children   – optional additional content
 */
export default function DefinitionBlock({ label, title, definition, formula, notation, children }) {
  const [showNotation, setShowNotation] = useState(false);

  const hasNotation = notation && (
    typeof notation === 'string'
      ? notation.length > 0
      : Array.isArray(notation) && notation.length > 0
  );

  return (
    <div className="my-6 rounded-xl border border-teal-200 dark:border-teal-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-teal-100 dark:bg-teal-900/40 border-b border-teal-200 dark:border-teal-800">
        <span className="flex-none w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold">
          D
        </span>
        <div className="flex-1 min-w-0">
          {label && (
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
              {label}
            </span>
          )}
          {title && (
            <span className="text-sm font-semibold text-teal-900 dark:text-teal-100">
              {title}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 bg-teal-50/50 dark:bg-teal-950/20 space-y-3">
        {/* Definition text */}
        {definition && (
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {renderInline(definition)}
          </p>
        )}

        {/* Formula */}
        {formula && (
          <div className="overflow-x-auto py-2 bg-white/60 dark:bg-zinc-900/40 rounded-lg px-4">
            <BlockMath math={formula} />
          </div>
        )}

        {/* Children */}
        {children && (
          <div className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
            {children}
          </div>
        )}

        {/* Notation toggle */}
        {hasNotation && (
          <div className="pt-2 border-t border-teal-200 dark:border-teal-800">
            <button
              onClick={() => setShowNotation((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
            >
              <ChevronIcon open={showNotation} />
              {showNotation ? 'Hide Notation' : 'Notation'}
            </button>

            <AnimatePresence initial={false}>
              {showNotation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3">
                    {typeof notation === 'string' ? (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {renderInline(notation)}
                      </p>
                    ) : (
                      <table className="text-sm w-full">
                        <thead>
                          <tr className="border-b border-teal-200 dark:border-teal-800">
                            <th className="text-left pb-1 text-teal-600 dark:text-teal-400 font-medium w-1/3">Symbol</th>
                            <th className="text-left pb-1 text-teal-600 dark:text-teal-400 font-medium">Meaning</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-teal-100 dark:divide-teal-900">
                          {notation.map((item, i) => (
                            <tr key={i}>
                              <td className="py-1.5 pr-4 text-zinc-600 dark:text-zinc-400 font-mono">
                                {item.symbol && item.symbol.startsWith('$') ? (
                                  <InlineMath math={item.symbol.slice(1, -1)} />
                                ) : (
                                  item.symbol
                                )}
                              </td>
                              <td className="py-1.5 text-zinc-600 dark:text-zinc-400">
                                {renderInline(item.meaning)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
