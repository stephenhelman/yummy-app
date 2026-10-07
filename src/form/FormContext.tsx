import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { createInitialState, formReducer } from './reducer';
import type { FormAction, FormState } from './reducer';
import { clearDraft, loadDraft, saveDraft } from './persistence';
import { isStepId } from './validation';

const SAVE_DELAY_MS = 400;

interface FormContextValue {
  state: FormState;
  dispatch: Dispatch<FormAction>;
}

const FormContext = createContext<FormContextValue | null>(null);

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, undefined, () =>
    createInitialState(loadDraft()),
  );

  // Debounced draft save. Welcome and success never write, so a finished or reset form stays cleared.
  useEffect(() => {
    if (state.step === 'welcome' || state.step === 'success' || !isStepId(state.step)) return;
    const step = state.step;
    const id = window.setTimeout(
      () => saveDraft({ step, data: state.data, startedAt: state.startedAt }),
      SAVE_DELAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [state.data, state.step, state.startedAt]);

  useEffect(() => {
    if (state.step === 'success') clearDraft();
  }, [state.step]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useForm(): FormContextValue {
  const context = useContext(FormContext);
  if (!context) throw new Error('useForm must be used inside FormProvider');
  return context;
}
