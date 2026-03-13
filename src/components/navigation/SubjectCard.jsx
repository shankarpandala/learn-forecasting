import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useProgress from '../../hooks/useProgress.js';

const DIFFICULTY_BADGE = {
  beginner:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  advanced:     'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  expert:       'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

/**
 * SubjectCard
 *
 * Props:
 *   subject – a subject object from CURRICULUM with shape:
 *     {
 *       id, title, icon, colorHex, description,
 *       difficulty, estimatedHours, practicalRelevance,
 *       chapters: [{ sections: [] }]
 *     }
 */
export default function SubjectCard({ subject }) {
  const { getSubjectProgress, completedSections } = useProgress();

  const totalSections = (subject.chapters || []).reduce(
    (sum, ch) => sum + (ch.sections || []).length,
    0
  );

  const completedCount = completedSections.filter((key) =>
    key.startsWith(`${subject.id}::`)
  ).length;

  const progressPct = totalSections > 0
    ? Math.round((completedCount / totalSections) * 100)
    : 0;

  const diffBadge = DIFFICULTY_BADGE[subject.difficulty] ?? DIFFICULTY_BADGE.beginner;

  // Derive a safe Tailwind color from colorHex for border — we use inline style for the accent
  const accentColor = subject.colorHex || '#0ea5e9';

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/subjects/${subject.id}`}
        className="group flex flex-col h-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700 transition-all"
      >
        {/* Color accent bar */}
        <div
          className="h-1.5 w-full flex-none"
          style={{ backgroundColor: accentColor }}
        />

        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Icon + title row */}
          <div className="flex items-start gap-3">
            <span
              className="flex-none w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
              style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
            >
              {subject.icon}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors leading-snug">
                {subject.title}
              </h3>
              {subject.difficulty && (
                <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${diffBadge}`}>
                  {subject.difficulty}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {subject.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3 flex-1">
              {subject.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 flex-wrap">
            {subject.estimatedHours && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {subject.estimatedHours}h
              </span>
            )}
            {subject.practicalRelevance != null && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {subject.practicalRelevance}% practical
              </span>
            )}
            <span className="flex items-center gap-1 ml-auto">
              {totalSections} sections
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 dark:text-zinc-500">Progress</span>
              <span
                className="font-medium"
                style={{ color: accentColor }}
              >
                {completedCount}/{totalSections}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: accentColor,
                }}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
