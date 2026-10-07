import { useLanguage } from '../i18n/LanguageContext';
import { Button } from './Button';
import './WizardNav.css';

interface WizardNavProps {
  isLast: boolean;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function WizardNav({ isLast, submitting, onBack, onNext }: WizardNavProps) {
  const { t } = useLanguage();
  return (
    <nav className="wizard-nav">
      <Button variant="secondary" disabled={submitting} onClick={onBack}>
        {t('wizard.back')}
      </Button>
      <Button
        grow
        loading={submitting}
        disabled={submitting}
        aria-label={submitting ? t('wizard.submitting') : undefined}
        onClick={onNext}
      >
        {t(isLast ? 'wizard.submit' : 'wizard.continue')}
      </Button>
    </nav>
  );
}
