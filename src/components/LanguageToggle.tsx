import { useLanguage } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/types';
import './LanguageToggle.css';

const LANGS: readonly Lang[] = ['en', 'es'];

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  return (
    <div className="lang-toggle" role="group" aria-label={t('language.label')} data-lang={lang}>
      <span className="lang-toggle__indicator" aria-hidden="true" />
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className="lang-toggle__btn"
          lang={code}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {t(code === 'en' ? 'language.en' : 'language.es')}
        </button>
      ))}
    </div>
  );
}
