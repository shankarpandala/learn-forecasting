import { Link } from 'react-router-dom';
import { getSubject, getChapter, getSection } from '../../utils/curriculum.js';

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600 flex-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 9.75L12 3l9 6.75V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.75z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V12h6v9" />
    </svg>
  );
}

/**
 * Breadcrumb navigation.
 *
 * Props:
 *   subjectId  – e.g. '01-ts-foundations'
 *   chapterId  – e.g. 'c1-intro-forecasting'  (optional)
 *   sectionId  – e.g. 's1-what-is-forecasting' (optional)
 */
export default function Breadcrumbs({ subjectId, chapterId, sectionId }) {
  const subject = subjectId ? getSubject(subjectId) : null;
  const chapter = subject && chapterId ? getChapter(subjectId, chapterId) : null;
  const section = chapter && sectionId ? getSection(subjectId, chapterId, sectionId) : null;

  const crumbs = [
    {
      key: 'home',
      to: '/',
      label: null, // icon only
      icon: <HomeIcon />,
    },
    subject && {
      key: 'subjects',
      to: '/subjects',
      label: 'Subjects',
    },
    subject && {
      key: 'subject',
      to: `/subjects/${subjectId}`,
      label: subject.title,
    },
    chapter && {
      key: 'chapter',
      to: `/subjects/${subjectId}/${chapterId}`,
      label: chapter.title,
    },
    section && {
      key: 'section',
      to: `/subjects/${subjectId}/${chapterId}/${sectionId}`,
      label: section.title,
      current: true,
    },
  ].filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap text-sm">
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <span key={crumb.key} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronIcon />}
            {isLast ? (
              <span
                className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[200px]"
                aria-current="page"
              >
                {crumb.label ?? crumb.icon}
              </span>
            ) : (
              <Link
                to={crumb.to}
                className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors truncate max-w-[180px]"
                title={crumb.label || 'Home'}
              >
                {crumb.icon && crumb.icon}
                {crumb.label && <span>{crumb.label}</span>}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
