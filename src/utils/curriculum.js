import { CURRICULUM } from '../subjects/index.js';

export function getSubject(id) {
  return CURRICULUM.find((s) => s.id === id) || null;
}

export function getChapter(subjectId, chapterId) {
  const subject = getSubject(subjectId);
  if (!subject) return null;
  return (subject.chapters || []).find((c) => c.id === chapterId) || null;
}

export function getSection(subjectId, chapterId, sectionId) {
  const chapter = getChapter(subjectId, chapterId);
  if (!chapter) return null;
  return (chapter.sections || []).find((s) => s.id === sectionId) || null;
}

function flatSections(subjectId) {
  const subject = getSubject(subjectId);
  if (!subject) return [];
  const flat = [];
  for (const chapter of subject.chapters || []) {
    for (const section of chapter.sections || []) {
      flat.push({ subjectId, chapterId: chapter.id, sectionId: section.id, ...section });
    }
  }
  return flat;
}

export function getNextSection(subjectId, chapterId, sectionId) {
  const flat = flatSections(subjectId);
  const idx = flat.findIndex((s) => s.chapterId === chapterId && s.sectionId === sectionId);
  if (idx === -1 || idx >= flat.length - 1) return null;
  return flat[idx + 1];
}

export function getPrevSection(subjectId, chapterId, sectionId) {
  const flat = flatSections(subjectId);
  const idx = flat.findIndex((s) => s.chapterId === chapterId && s.sectionId === sectionId);
  if (idx <= 0) return null;
  return flat[idx - 1];
}

export default { subjects: CURRICULUM };
