import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
import { useField } from '../form/useField';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/types';
import { Field } from './Field';
import './TextInput.css';

export interface TextInputProps {
  path: string;
  label: TranslationKey;
  placeholder?: TranslationKey;
  hint?: TranslationKey;
  optional?: boolean;
  compact?: boolean;
  type?: HTMLInputTypeAttribute;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  maxLength?: number;
  /** Cleans or formats the raw value as the applicant types. */
  format?: (value: string) => string;
  /** Text shown inside the field before the value, e.g. "$". */
  prefix?: string;
}

export function TextInput({
  path,
  label,
  placeholder,
  hint,
  optional,
  compact,
  type = 'text',
  inputMode,
  autoComplete,
  maxLength,
  format,
  prefix,
}: TextInputProps) {
  const { t } = useLanguage();
  const field = useField(path);

  return (
    <Field id={field.id} label={label} error={field.error} hint={hint} optional={optional} compact={compact}>
      {(control) => {
        const input = (
          <input
            {...control.aria}
            className="control"
            name={field.path}
            type={type}
            inputMode={inputMode}
            autoComplete={autoComplete}
            maxLength={maxLength}
            placeholder={placeholder ? t(placeholder) : undefined}
            value={field.value}
            onChange={(event) => field.onChange(format ? format(event.target.value) : event.target.value)}
            onBlur={field.onBlur}
          />
        );
        return prefix ? (
          <div className="input-prefix">
            <span className="input-prefix__symbol" aria-hidden="true">
              {prefix}
            </span>
            {input}
          </div>
        ) : (
          input
        );
      }}
    </Field>
  );
}
