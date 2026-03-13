/**
 * DifficultyBadge
 *
 * Props:
 *   difficulty – 'beginner' | 'intermediate' | 'advanced' | 'expert'
 *   size       – 'sm' | 'md'  (default: 'sm')
 */

const DIFFICULTY_MAP = {
  beginner: {
    label: 'Beginner',
    cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  intermediate: {
    label: 'Intermediate',
    cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  },
  advanced: {
    label: 'Advanced',
    cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  },
  expert: {
    label: 'Expert',
    cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  },
};

const SIZE_CLS = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export default function DifficultyBadge({ difficulty, size = 'sm' }) {
  if (!difficulty) return null;

  const config = DIFFICULTY_MAP[difficulty.toLowerCase()] ?? DIFFICULTY_MAP.beginner;
  const sizeCls = SIZE_CLS[size] ?? SIZE_CLS.sm;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium capitalize ${config.cls} ${sizeCls}`}
    >
      {config.label}
    </span>
  );
}
