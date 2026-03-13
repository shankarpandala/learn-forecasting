/**
 * NoteBlock – Callout / note component
 *
 * Props:
 *   type     – 'info' | 'historical' | 'tip' | 'warning' | 'fpp3'
 *   title    – optional heading text
 *   children – content
 */

const TYPE_CONFIG = {
  info: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    headerCls: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    bodyCls:   'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
    iconCls:   'text-blue-500',
    borderCls: 'border-l-blue-500',
    defaultTitle: 'Note',
  },
  historical: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    headerCls: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800',
    bodyCls:   'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800',
    iconCls:   'text-amber-500',
    borderCls: 'border-l-amber-500',
    defaultTitle: 'Historical Context',
  },
  tip: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    headerCls: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
    bodyCls:   'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
    iconCls:   'text-green-500',
    borderCls: 'border-l-green-500',
    defaultTitle: 'Tip',
  },
  warning: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    headerCls: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
    bodyCls:   'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
    iconCls:   'text-red-500',
    borderCls: 'border-l-red-500',
    defaultTitle: 'Warning',
  },
  fpp3: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    headerCls: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800',
    bodyCls:   'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800',
    iconCls:   'text-purple-500',
    borderCls: 'border-l-purple-500',
    defaultTitle: 'From FPP3',
  },
};

export default function NoteBlock({ type = 'info', title, children }) {
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;
  const displayTitle = title ?? config.defaultTitle;

  return (
    <div className={`my-6 rounded-xl border border-l-4 ${config.borderCls} overflow-hidden shadow-sm`}>
      {/* Header */}
      <div className={`flex items-center gap-2.5 px-4 py-2.5 border-b ${config.headerCls}`}>
        <span className={`flex-none ${config.iconCls}`}>{config.icon}</span>
        <span className="text-sm font-semibold">{displayTitle}</span>
      </div>

      {/* Body */}
      <div className={`px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed ${config.bodyCls}`}>
        {children}
      </div>
    </div>
  );
}
