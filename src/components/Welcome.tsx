import { useForm } from '../form/FormContext';
import { clearDraft } from '../form/persistence';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/types';
import { Button } from './Button';
import { Icon } from './Icon';
import { InlineAlert } from './InlineAlert';
import './Welcome.css';

const HANDY: readonly TranslationKey[] = ['welcome.handyContact', 'welcome.handyJob', 'welcome.handyReferences'];

export function Welcome() {
  const { state, dispatch } = useForm();
  const { t } = useLanguage();
  const hasDraft = state.savedStep !== null;

  const startOver = () => {
    clearDraft();
    dispatch({ type: 'reset' });
  };

  return (
    <div className="welcome">
      <div className="welcome__intro">
        <span className="welcome__badge">{t('welcome.badge')}</span>
        <h1 className="welcome__title">{t('welcome.title')}</h1>
        <p className="welcome__body">{t('welcome.body')}</p>
      </div>

      <section className="welcome__card">
        <h2 className="welcome__card-title">{t('welcome.handyTitle')}</h2>
        <ul className="welcome__list">
          {HANDY.map((key) => (
            <li key={key}>
              <Icon name="check" className="welcome__tick" />
              {t(key)}
            </li>
          ))}
        </ul>
      </section>

      <div className="welcome__actions">
        {hasDraft ? (
          <>
            <InlineAlert tone="info">
              <strong>{t('welcome.resumeTitle')}</strong> — {t('welcome.resumeBody')}
            </InlineAlert>
            <Button iconAfter="arrow-right" onClick={() => dispatch({ type: 'resume' })}>
              {t('welcome.resume')}
            </Button>
            <Button variant="secondary" onClick={startOver}>
              {t('welcome.startOver')}
            </Button>
          </>
        ) : (
          <Button iconAfter="arrow-right" onClick={() => dispatch({ type: 'start' })}>
            {t('welcome.start')}
          </Button>
        )}
      </div>

      <p className="welcome__address">{t('shop.addressInline')}</p>
    </div>
  );
}
