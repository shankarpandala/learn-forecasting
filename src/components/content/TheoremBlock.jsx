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
 * TheoremBlock
 *
 * Props:
 *   label      – e.g. "Theorem 2.1"
 *   title      – theorem name
 *   statement  – theorem statement (string, may contain $...$ inline math)
 *   proof      – optional proof string or React node
 *   formula    – optional LaTeX string rendered as BlockMath
 *   note       – optional footnote string
 */
export default function TheoremBlock({ label, title, statement, proof, formula, note }) {
  const [showProof, setShowProof] = useState(false);

  // Render inline math in text: replace $...$ with <InlineMath>
  function renderInline(text) {
    if (!text || typeof text !== 'string') return text;
    const parts = text.split(/(\$[^$]+\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const latex = part.slice(1, -1);
        return <InlineMath key={i} math={latex} />;
      }
      return part;
    });
  }

  return (
    <div className="my-6 rounded-xl border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-indigo-100 dark:bg-indigo-900/40 border-b border-indigo-200 dark:border-indigo-800">
        <span className="flex-none w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">
          T
        </span>
        <div className="flex-1 min-w-0">
          {label && (
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 block">
              {label}
            </span>
          )}
          {title && (
            <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
              {title}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        {/* Statement */}
        {statement && (
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
            {renderInline(statement)}
          </p>
        )}

        {/* Formula */}
        {formula && (
          <div className="overflow-x-auto py-2">
            <BlockMath math={formula} />
          </div>
        )}

        {/* Note */}
        {note && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {renderInline(note)}
          </p>
        )}

        {/* Proof toggle */}
        {proof && (
          <div className="pt-2 border-t border-indigo-200 dark:border-indigo-800">
            <button
              onClick={() => setShowProof((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
            >
              <ChevronIcon open={showProof} />
              {showProof ? 'Hide Proof' : 'Show Proof'}
            </button>

            <AnimatePresence initial={false}>
              {showProof && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pl-4 border-l-2 border-indigo-300 dark:border-indigo-700 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2">
                    {typeof proof === 'string' ? (
                      <p>{renderInline(proof)}</p>
                    ) : (
                      proof
                    )}
                    <p className="text-right text-indigo-400 dark:text-indigo-500 font-serif text-base">□</p>
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
