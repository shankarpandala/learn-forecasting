import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Breadcrumbs from '../layout/Breadcrumbs.jsx';
import { getNextSection, getPrevSection } from '../../utils/curriculum.js';
import useProgress from '../../hooks/useProgress.js';

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m0 0l7-7m-7 7l7 7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m0 0l-7-7m7 7l-7 7" />
    </svg>
  );
}

/**
 * SectionLayout
 *
 * Wraps a section's content with:
 * - Breadcrumb navigation
 * - Animated entry
 * - Title + metadata header
 * - Mark Complete button
 * - Prev / Next navigation footer
 *
 * Props:
 *   title        – section title string
 *   difficulty   – 'beginner' | 'intermediate' | 'advanced' | 'expert'
 *   readingTime  – estimated reading minutes (number)
 *   children     – section body content
 */
export default function SectionLayout({ title, difficulty, readingTime, children }) {
  const { subjectId, chapterId, sectionId } = useParams();
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();

  const done = isComplete(subjectId, chapterId, sectionId);
  const prevSection = getPrevSection(subjectId, chapterId, sectionId);
  const nextSection = getNextSection(subjectId, chapterId, sectionId);

  const difficultyColors = {
    beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    expert: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  };
  const diffBadge = difficultyColors[difficulty] ?? difficultyColors.beginner;

  function handleMarkComplete() {
    if (!done) {
      markComplete(subjectId, chapterId, sectionId);
    }
  }

  function handlePrev() {
    if (prevSection) {
      navigate(`/subjects/${prevSection.subjectId}/${prevSection.chapterId}/${prevSection.sectionId}`);
    }
  }

  function handleNext() {
    if (nextSection) {
      navigate(`/subjects/${nextSection.subjectId}/${nextSection.chapterId}/${nextSection.sectionId}`);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs subjectId={subjectId} chapterId={chapterId} sectionId={sectionId} />
      </div>

      {/* Section header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {difficulty && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${diffBadge}`}>
              {difficulty}
            </span>
          )}
          {readingTime && (
            <span className="inline-flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} min read
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-4">
          {title}
        </h1>

        {/* Mark complete */}
        <button
          onClick={handleMarkComplete}
          disabled={done}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            done
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 cursor-default'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300'
          }`}
        >
          <CheckIcon />
          {done ? 'Completed' : 'Mark as Complete'}
        </button>
      </header>

      {/* Divider */}
      <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-8" />

      {/* Content */}
      <div className="prose prose-zinc dark:prose-invert max-w-none
        prose-headings:font-bold
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:leading-relaxed prose-p:text-zinc-700 dark:prose-p:text-zinc-300
        prose-a:text-sky-600 dark:prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline
        prose-code:text-sky-700 dark:prose-code:text-sky-300
        prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-950
        prose-blockquote:border-sky-400 prose-blockquote:text-zinc-600 dark:prose-blockquote:text-zinc-400
      ">
        {children}
      </div>

      {/* Bottom mark complete */}
      <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-center">
        <button
          onClick={handleMarkComplete}
          disabled={done}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
            done
              ? 'bg-emerald-500 text-white cursor-default'
              : 'bg-sky-500 hover:bg-sky-600 text-white hover:shadow-md active:scale-95'
          }`}
        >
          <CheckIcon />
          {done ? 'Section Completed!' : 'Mark Section as Complete'}
        </button>
      </div>

      {/* Prev / Next navigation */}
      <nav className="mt-8 flex items-center justify-between gap-4">
        {prevSection ? (
          <button
            onClick={handlePrev}
            className="group flex items-center gap-3 flex-1 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-all text-left"
          >
            <ArrowLeftIcon />
            <div className="min-w-0">
              <div className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">Previous</div>
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-sky-700 dark:group-hover:text-sky-300 truncate transition-colors">
                {prevSection.title}
              </div>
            </div>
          </button>
        ) : (
          <div className="flex-1" />
        )}

        {nextSection ? (
          <button
            onClick={handleNext}
            className="group flex items-center gap-3 flex-1 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-all text-right justify-end"
          >
            <div className="min-w-0">
              <div className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">Next</div>
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-sky-700 dark:group-hover:text-sky-300 truncate transition-colors">
                {nextSection.title}
              </div>
            </div>
            <ArrowRightIcon />
          </button>
        ) : (
          <div className="flex-1" />
        )}
      </nav>
    </motion.div>
  );
}
