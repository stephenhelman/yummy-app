import { useCallback } from 'react';
import { useForm } from './FormContext';
import { getIn } from '../lib/paths';
import type { TranslationKey } from '../i18n/types';

export interface FieldBinding<T> {
  path: string;
  id: string;
  value: T;
  error: TranslationKey | undefined;
  onChange: (value: T) => void;
  onBlur: () => void;
}

export function fieldId(path: string): string {
  return `f-${path.replace(/\./g, '-')}`;
}

/** Reads a value from form state by path. The caller states the type the path holds. */
export function useFormValue<T>(path: string): T {
  const { state } = useForm();
  return getIn(state.data, path) as T;
}

export function useField<T = string>(path: string): FieldBinding<T> {
  const { state, dispatch } = useForm();
  const value = getIn(state.data, path) as T;
  const error = state.touched[path] ? state.errors[path] : undefined;

  const onChange = useCallback(
    (next: T) => dispatch({ type: 'setField', path, value: next }),
    [dispatch, path],
  );
  const onBlur = useCallback(() => dispatch({ type: 'blur', path }), [dispatch, path]);

  return { path, id: fieldId(path), value, error, onChange, onBlur };
}
