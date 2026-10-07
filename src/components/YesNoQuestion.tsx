import type { ReactNode } from 'react';
import { useField } from '../form/useField';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/types';
import type { YesNo } from '../form/types';
import { FieldError } from './Field';
import { Icon } from './Icon';
import { Reveal } from './Reveal';
import './YesNoQuestion.css';

interface YesNoQuestionProps {
  path: string;
  question: TranslationKey;
  /** "card" is a white card with the follow-up inside; "inline" sits directly in a parent card. */
  variant?: 'card' | 'inline';
  /** Shown in a tinted inset when the answer equals `revealOn`. */
  followUp?: ReactNode;
  revealOn?: boolean;
}

export function YesNoQuestion({ path, question, variant = 'card', followUp, revealOn = true }: YesNoQuestionProps) {
  const { t } = useLanguage();
  const field = useField<YesNo>(path);
  const labelId = `${field.id}-label`;
  const errorId = `${field.id}-error`;

  const choose = (value: boolean) => {
    field.onChange(value);
    field.onBlur();
  };

  return (
    <div className="yn" data-variant={variant} data-invalid={field.error ? 'true' : undefined}>
      <div className="yn__question" id={labelId}>
        {t(question)}
      </div>
      <div
        className="yn__choices"
        role="group"
        aria-labelledby={labelId}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={field.error ? errorId : undefined}
      >
        {([true, false] as const).map((value) => (
          <button
            key={String(value)}
            type="button"
            className="yn__btn"
            aria-pressed={field.value === value}
            onClick={() => choose(value)}
          >
            <Icon className="yn__check" name="check" size={16} strokeWidth={2.6} />
            {t(value ? 'common.yes' : 'common.no')}
          </button>
        ))}
      </div>
      {field.error && <FieldError id={errorId} error={field.error} />}
      {followUp && (
        <Reveal open={field.value === revealOn}>
          <div className="yn__followup">{followUp}</div>
        </Reveal>
      )}
    </div>
  );
}
