/**
 * WarningBlock – Red/amber warning callout.
 *
 * Props:
 *   title    – optional heading (default: "Warning")
 *   type     – 'warning' (red) | 'caution' (amber)  default: 'warning'
 *   children – content
 */

function WarningIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function CautionIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const CONFIGS = {
  warning: {
    icon: <WarningIcon />,
    headerCls: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
    bodyCls: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
    iconCls: 'text-red-500',
    borderCls: 'border-l-red-500',
    defaultTitle: 'Warning',
  },
  caution: {
    icon: <CautionIcon />,
    headerCls: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800',
    bodyCls: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800',
    iconCls: 'text-amber-500',
    borderCls: 'border-l-amber-500',
    defaultTitle: 'Caution',
  },
};

export default function WarningBlock({ type = 'warning', title, children }) {
  const config = CONFIGS[type] ?? CONFIGS.warning;
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
