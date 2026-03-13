import useAppStore from '../store/appStore.js';

export default function useProgress() {
  const markSectionComplete = useAppStore((s) => s.markSectionComplete);
  const isComplete = useAppStore((s) => s.isComplete);
  const getSubjectProgress = useAppStore((s) => s.getSubjectProgress);
  const completedSections = useAppStore((s) => s.completedSections);

  return {
    markComplete: markSectionComplete,
    isComplete,
    getSubjectProgress,
    completedSections,
  };
}
