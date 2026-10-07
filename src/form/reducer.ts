import { createEntry, createInitialData } from './initialData';
import { getIn, setIn } from '../lib/paths';
import { STEP_ORDER, validateStep } from './validation';
import type { ApplicationData, Errors, RepeatableGroupPath, Screen, StepId } from './types';

export type Direction = 'forward' | 'back';
export type Status = 'idle' | 'submitting' | 'error';

export interface FormState {
  step: Screen;
  direction: Direction;
  data: ApplicationData;
  touched: Record<string, true>;
  errors: Errors;
  status: Status;
  /** Set after Edit on the review screen, so Continue jumps straight back to Review. */
  returnToReview: boolean;
  /** Bumps on every failed Continue; the wizard focuses and shakes invalid fields when it changes. */
  attempt: number;
  startedAt: number | null;
  /** Step of a saved draft, shown on the welcome screen. */
  savedStep: StepId | null;
}

export type FormAction =
  | { type: 'setField'; path: string; value: unknown }
  | { type: 'blur'; path: string }
  | { type: 'addEntry'; group: RepeatableGroupPath }
  | { type: 'removeEntry'; group: RepeatableGroupPath; id: string }
  | { type: 'invalid'; errors: Errors }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'goTo'; step: StepId }
  | { type: 'start' }
  | { type: 'resume' }
  | { type: 'submitStart' }
  | { type: 'submitSuccess' }
  | { type: 'submitError' }
  | { type: 'reset' };

export function createInitialState(
  draft: { step: StepId; data: ApplicationData; startedAt: number | null } | null,
): FormState {
  return {
    step: 'welcome',
    direction: 'forward',
    data: draft?.data ?? createInitialData(),
    touched: {},
    errors: {},
    status: 'idle',
    returnToReview: false,
    attempt: 0,
    startedAt: draft?.startedAt ?? null,
    savedStep: draft?.step ?? null,
  };
}

function isStep(screen: Screen): screen is StepId {
  return screen !== 'welcome' && screen !== 'success';
}

function errorsFor(step: Screen, data: ApplicationData): Errors {
  return isStep(step) ? validateStep(step, data) : {};
}

function enterStep(state: FormState, step: Screen, direction: Direction, returnToReview: boolean): FormState {
  return {
    ...state,
    step,
    direction,
    returnToReview,
    touched: {},
    errors: errorsFor(step, state.data),
    status: 'idle',
  };
}

function updateData(state: FormState, data: ApplicationData): FormState {
  return { ...state, data, errors: errorsFor(state.step, data) };
}

function withoutGroupTouched(touched: FormState['touched'], group: string): FormState['touched'] {
  const prefix = `${group}.`;
  return Object.fromEntries(
    Object.entries(touched).filter(([path]) => !path.startsWith(prefix)),
  ) as FormState['touched'];
}

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'setField':
      return updateData(state, setIn(state.data, action.path, action.value));

    case 'blur':
      return state.touched[action.path]
        ? state
        : { ...state, touched: { ...state.touched, [action.path]: true } };

    case 'addEntry': {
      const entries = getIn(state.data, action.group);
      const list = Array.isArray(entries) ? entries : [];
      const next = setIn(state.data, action.group, [...list, createEntry(action.group)]);
      return updateData(state, next);
    }

    case 'removeEntry': {
      const entries = getIn(state.data, action.group);
      const list = Array.isArray(entries) ? (entries as Array<{ id: string }>) : [];
      const next = setIn(
        state.data,
        action.group,
        list.filter((entry) => entry.id !== action.id),
      );
      return {
        ...updateData(state, next),
        touched: withoutGroupTouched(state.touched, action.group),
      };
    }

    case 'invalid': {
      const touched = { ...state.touched };
      for (const path of Object.keys(action.errors)) touched[path] = true;
      return { ...state, errors: action.errors, touched, attempt: state.attempt + 1 };
    }

    case 'next': {
      if (!isStep(state.step)) return state;
      if (state.returnToReview) return enterStep(state, 'review', 'forward', false);
      const nextStep = STEP_ORDER[STEP_ORDER.indexOf(state.step) + 1];
      return nextStep ? enterStep(state, nextStep, 'forward', false) : state;
    }

    case 'back': {
      if (!isStep(state.step)) return state;
      if (state.returnToReview) return enterStep(state, 'review', 'back', false);
      const previous = STEP_ORDER[STEP_ORDER.indexOf(state.step) - 1];
      return enterStep(state, previous ?? 'welcome', 'back', false);
    }

    case 'goTo': {
      const fromReview = state.step === 'review' && action.step !== 'review';
      return enterStep(state, action.step, 'back', fromReview);
    }

    case 'start':
      return enterStep(
        { ...state, startedAt: state.startedAt ?? Date.now() },
        'aboutYou',
        'forward',
        false,
      );

    case 'resume':
      return enterStep(
        { ...state, startedAt: state.startedAt ?? Date.now() },
        state.savedStep ?? 'aboutYou',
        'forward',
        false,
      );

    case 'submitStart':
      return { ...state, status: 'submitting' };

    case 'submitSuccess':
      return { ...state, status: 'idle', step: 'success', direction: 'forward', savedStep: null };

    case 'submitError':
      return { ...state, status: 'error' };

    case 'reset':
      return createInitialState(null);
  }
}
