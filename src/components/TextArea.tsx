import { useField } from '../form/useField';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/types';
import { Field } from './Field';
import './TextArea.css';

interface TextAreaProps {
  path: string;
  label: TranslationKey;
  placeholder?: TranslationKey;
  hint?: TranslationKey;
  optional?: boolean;
  compact?: boolean;
  rows?: number;
}

export function TextArea({ path, label, placeholder, hint, optional, compact, rows = 3 }: TextAreaProps) {
  const { t } = useLanguage();
  const field = useField(path);

  return (
    <Field id={field.id} label={label} error={field.error} hint={hint} optional={optional} compact={compact}>
      {(control) => (
        <textarea
          {...control.aria}
          className="control textarea"
          name={field.path}
          rows={rows}
          placeholder={placeholder ? t(placeholder) : undefined}
          value={field.value}
          onChange={(event) => field.onChange(event.target.value)}
          onBlur={field.onBlur}
        />
      )}
    </Field>
  );
}
