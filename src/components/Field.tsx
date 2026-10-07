import type { ReactNode } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/types';
import { Icon } from './Icon';
import './Field.css';

export interface AriaProps {
  id: string;
  'aria-invalid': true | undefined;
  'aria-describedby': string | undefined;
}

export interface ControlProps {
  labelId: string;
  /** Spread onto the control: id plus the aria wiring to the hint and error rows. */
  aria: AriaProps;
}

interface FieldProps {
  id: string;
  label: TranslationKey;
  error?: TranslationKey;
  hint?: TranslationKey;
  optional?: boolean;
  /** Smaller label and control, used inside cards. */
  compact?: boolean;
  /** Label names a group of controls (chips) instead of a single input. */
  group?: boolean;
  className?: string;
  children: (control: ControlProps) => ReactNode;
}

export function FieldError({ id, error }: { id: string; error: TranslationKey }) {
  const { t } = useLanguage();
  return (
    <p className="field__error" id={id}>
      <Icon name="alert-circle" size={14} strokeWidth={2.4} />
      {t(error)}
    </p>
  );
}

export function Field({ id, label, error, hint, optional, compact, group, className, children }: FieldProps) {
  const { t } = useLanguage();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ');

  const control: ControlProps = {
    labelId,
    aria: {
      id,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': describedBy || undefined,
    },
  };

  const labelContent = (
    <>
      {t(label)}
      {optional && <span className="field__optional"> ({t('common.optional')})</span>}
    </>
  );

  return (
    <div
      className={['field', className ?? ''].filter(Boolean).join(' ')}
      data-compact={compact || undefined}
      data-invalid={error ? 'true' : undefined}
    >
      {group ? (
        <span className="field__label" id={labelId}>
          {labelContent}
        </span>
      ) : (
        <label className="field__label" id={labelId} htmlFor={id}>
          {labelContent}
        </label>
      )}
      {children(control)}
      {hint && (
        <p className="field__hint" id={hintId}>
          {t(hint)}
        </p>
      )}
      {error && <FieldError id={errorId} error={error} />}
    </div>
  );
}
