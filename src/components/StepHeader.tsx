import type { Ref } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/types';
import './StepHeader.css';

interface StepHeaderProps {
  index: number;
  total: number;
  title: TranslationKey;
  description?: TranslationKey;
  headingRef: Ref<HTMLHeadingElement>;
}

export function StepHeader({ index, total, title, description, headingRef }: StepHeaderProps) {
  const { t } = useLanguage();
  return (
    <header className="step-header">
      <p className="step-header__eyebrow">{t('wizard.stepOf', { current: index + 1, total })}</p>
      <h1 className="step-header__title" tabIndex={-1} ref={headingRef}>
        {t(title)}
      </h1>
      {description && <p className="step-header__description">{t(description)}</p>}
    </header>
  );
}
