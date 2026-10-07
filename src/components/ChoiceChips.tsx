import { useField } from '../form/useField';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/types';
import { Field } from './Field';
import './ChoiceChips.css';

export interface ChipOption<V extends string> {
  value: V;
  label: TranslationKey;
}

interface ChoiceChipsProps<V extends string> {
  path: string;
  label: TranslationKey;
  options: ReadonlyArray<ChipOption<V>>;
  /** Multi-select (array value) instead of single (value or null). */
  multiple?: boolean;
  /** Single mode only: lets a second tap clear the choice. */
  clearable?: boolean;
  optional?: boolean;
  compact?: boolean;
}

export function ChoiceChips<V extends string>({
  path,
  label,
  options,
  multiple = false,
  clearable = true,
  optional,
  compact,
}: ChoiceChipsProps<V>) {
  const { t } = useLanguage();
  const field = useField<V[] | V | null>(path);

  const isSelected = (value: V): boolean =>
    Array.isArray(field.value) ? field.value.includes(value) : field.value === value;

  const toggle = (value: V) => {
    const selected = isSelected(value);
    if (multiple) {
      const current = Array.isArray(field.value) ? field.value : [];
      field.onChange(selected ? current.filter((item) => item !== value) : [...current, value]);
    } else if (!selected || clearable) {
      field.onChange(selected ? null : value);
    }
    field.onBlur();
  };

  return (
    <Field id={field.id} label={label} error={field.error} optional={optional} compact={compact} group>
      {(control) => (
        <div className="chips" role="group" aria-labelledby={control.labelId} {...control.aria}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="chip"
              aria-pressed={isSelected(option.value)}
              onClick={() => toggle(option.value)}
            >
              {t(option.label)}
            </button>
          ))}
        </div>
      )}
    </Field>
  );
}
