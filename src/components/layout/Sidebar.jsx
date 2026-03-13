import { Link, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../../store/appStore.js';
import { CURRICULUM } from '../../subjects/index.js';

function ChevronIcon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/* ── Section item ──────────────────────────────────── */
function SectionItem({ subjectId, chapterId, section, isActive }) {
  const isComplete = useAppStore((s) => s.isComplete);
  const done = isComplete(subjectId, chapterId, section.id);

  return (
    <Link
      to={`/subjects/${subjectId}/${chapterId}/${section.id}`}
      className={`flex items-center gap-2 pl-8 pr-3 py-1.5 rounded-md text-sm transition-colors ${
        isActive
          ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-medium'
          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
      }`}
    >
      <span
        className={`flex-none w-5 h-5 rounded-full border flex items-center justify-center text-xs transition-colors ${
          done
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-zinc-300 dark:border-zinc-600'
        }`}
      >
        {done && <CheckIcon />}
      </span>
      <span className="truncate">{section.title}</span>
    </Link>
  );
}

/* ── Chapter accordion ─────────────────────────────── */
function ChapterItem({ subjectId, chapter, currentChapterId, currentSectionId }) {
  const isCurrentChapter = chapter.id === currentChapterId;
  const [open, setOpen] = useState(isCurrentChapter);
  const isComplete = useAppStore((s) => s.isComplete);

  useEffect(() => {
    if (isCurrentChapter) setOpen(true);
  }, [isCurrentChapter]);

  const completedCount = (chapter.sections || []).filter((sec) =>
    isComplete(subjectId, chapter.id, sec.id)
  ).length;
  const totalCount = (chapter.sections || []).length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="mb-0.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
          isCurrentChapter
            ? 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/30'
            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <span
          className={`flex-none w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
            allDone
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-zinc-300 dark:border-zinc-600'
          }`}
        >
          {allDone && <CheckIcon />}
        </span>
        <span className="flex-1 truncate">{chapter.title}</span>
        {totalCount > 0 && (
          <span className="flex-none text-xs text-zinc-400 dark:text-zinc-500">
            {completedCount}/{totalCount}
          </span>
        )}
        <ChevronIcon open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-0.5 space-y-0.5">
              {(chapter.sections || []).map((sec) => (
                <SectionItem
                  key={sec.id}
                  subjectId={subjectId}
                  chapterId={chapter.id}
                  section={sec}
                  isActive={isCurrentChapter && sec.id === currentSectionId}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Subject accordion ─────────────────────────────── */
function SubjectItem({ subject, currentSubjectId, currentChapterId, currentSectionId }) {
  const isCurrent = subject.id === currentSubjectId;
  const [open, setOpen] = useState(isCurrent);
  const isComplete = useAppStore((s) => s.isComplete);

  useEffect(() => {
    if (isCurrent) setOpen(true);
  }, [isCurrent]);

  const totalSections = (subject.chapters || []).flatMap((c) => c.sections || []).length;
  const completedSections = (subject.chapters || [])
    .flatMap((c) => (c.sections || []).map((s) => ({ cId: c.id, sId: s.id })))
    .filter(({ cId, sId }) => isComplete(subject.id, cId, sId)).length;

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-left ${
          isCurrent
            ? 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-200'
            : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <span className="flex-none text-base">{subject.icon}</span>
        <span className="flex-1 truncate">{subject.title}</span>
        {totalSections > 0 && (
          <span className="flex-none text-xs text-zinc-400 dark:text-zinc-500">
            {completedSections}/{totalSections}
          </span>
        )}
        <ChevronIcon open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-zinc-200 dark:border-zinc-700 pl-2 pb-1">
              {(subject.chapters || []).map((chapter) => (
                <ChapterItem
                  key={chapter.id}
                  subjectId={subject.id}
                  chapter={chapter}
                  currentChapterId={isCurrent ? currentChapterId : null}
                  currentSectionId={isCurrent ? currentSectionId : null}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sidebar ───────────────────────────────────────── */
export default function Sidebar({ isOpen, onClose }) {
  const { subjectId, chapterId, sectionId } = useParams();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        className={`fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-[280px] flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Curriculum
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close sidebar"
          >
            <XIcon />
          </button>
        </div>

        {/* Scrollable subject list */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {CURRICULUM.map((subject) => (
            <SubjectItem
              key={subject.id}
              subject={subject}
              currentSubjectId={subjectId}
              currentChapterId={chapterId}
              currentSectionId={sectionId}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            to="/progress"
            className="flex items-center gap-1 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            onClick={onClose}
          >
            View My Progress
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </aside>
    </>
  );
}
