import { useNavigate } from 'react-router-dom';

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m0 0l7-7m-7 7l7 7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m0 0l-7-7m7 7l-7 7" />
    </svg>
  );
}

/**
 * PrevNextNav
 *
 * Props:
 *   prevSection – section object with { subjectId, chapterId, sectionId, title } or null
 *   nextSection – section object with { subjectId, chapterId, sectionId, title } or null
 */
export default function PrevNextNav({ prevSection, nextSection }) {
  const navigate = useNavigate();

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

  if (!prevSection && !nextSection) return null;

  return (
    <nav
      className="flex items-center justify-between gap-4 pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800"
      aria-label="Section navigation"
    >
      {/* Previous */}
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

      {/* Next */}
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
  );
}
