import { useForm } from '../form/FormContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Sprinkles } from './Sprinkles';
import './Success.css';

export function Success() {
  const { state } = useForm();
  const { t } = useLanguage();
  const firstName = state.data.applicant.fullName.trim().split(/\s+/)[0] ?? '';

  return (
    <div className="success">
      <div className="success__badge-wrap">
        <div className="success__badge">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path className="success__check" d="M20 6 9 17l-5-5" pathLength={1} />
          </svg>
        </div>
        <Sprinkles />
      </div>
      <h1 className="success__title">{t('success.title')}</h1>
      <p className="success__body">{t('success.body', { firstName })}</p>
      <section className="success__card">
        <h2 className="success__card-title">{t('success.cardTitle')}</h2>
        <p className="success__address">
          {t('shop.addressLine1')}
          <br />
          {t('shop.addressLine2')}
        </p>
      </section>
    </div>
  );
}
