import { createInitialData } from './initialData';
import { isStepId } from './validation';
import type { ApplicationData, StepId } from './types';

const DRAFT_KEY = 'lmy-application-v1';
const DRAFT_VERSION = 1;

export interface Draft {
  step: StepId;
  data: ApplicationData;
  startedAt: number | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeData(saved: Record<string, unknown>): ApplicationData {
  const base = createInitialData();
  const pick = <T extends object>(fallback: T, value: unknown): T =>
    isRecord(value) ? { ...fallback, ...value } : fallback;
  const list = <T,>(fallback: T[], value: unknown): T[] =>
    Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback;
  const experience = isRecord(saved.experience) ? saved.experience : {};

  return {
    applicant: pick(base.applicant, saved.applicant),
    job: pick(base.job, saved.job),
    eligibility: pick(base.eligibility, saved.eligibility),
    education: list(base.education, saved.education),
    experience: {
      firstJob: experience.firstJob === true,
      employers: list(base.experience.employers, experience.employers),
    },
    references: list(base.references, saved.references),
    signature: pick(base.signature, saved.signature),
  };
}

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.v !== DRAFT_VERSION) return null;
    if (typeof parsed.step !== 'string' || !isStepId(parsed.step) || !isRecord(parsed.data)) return null;
    return {
      step: parsed.step,
      data: mergeData(parsed.data),
      startedAt: typeof parsed.startedAt === 'number' ? parsed.startedAt : null,
    };
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ v: DRAFT_VERSION, ...draft }));
  } catch {
    // storage full or blocked: the form still works, it just won't survive a reload
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // nothing to clear
  }
}
