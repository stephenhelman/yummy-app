import { useField } from '../form/useField';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/types';
import { FieldError } from './Field';
import './Checkbox.css';

interface CheckboxProps {
  path: string;
  label: TranslationKey;
}

export function Checkbox({ path, label }: CheckboxProps) {
  const { t } = useLanguage();
  const field = useField<boolean>(path);
  const errorId = `${field.id}-error`;

  return (
    <div className="checkbox-wrap" data-invalid={field.error ? 'true' : undefined}>
      <label className="checkbox" data-checked={field.value || undefined}>
        <input
          id={field.id}
          name={field.path}
          type="checkbox"
          checked={field.value}
          aria-invalid={field.error ? true : undefined}
          aria-describedby={field.error ? errorId : undefined}
          onChange={(event) => {
            field.onChange(event.target.checked);
            field.onBlur();
          }}
        />
        <span>{t(label)}</span>
      </label>
      {field.error && <FieldError id={errorId} error={field.error} />}
    </div>
  );
}
