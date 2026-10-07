import { useEffect } from 'react';
import { useField } from '../form/useField';
import { localeFor, useLanguage } from '../i18n/LanguageContext';
import { Button } from './Button';
import { FieldError } from './Field';
import './SignaturePad.css';

const SIGNATURE_FONT = '"Mrs Saint Delafield"';

interface SignaturePadProps {
  /** The name to print, in script. */
  printName: string;
  /** Tapping is locked until the typed name matches. */
  canSign: boolean;
}

function inkSize(name: string): number {
  if (name.length > 28) return 30;
  if (name.length > 20) return 38;
  if (name.length > 14) return 46;
  return 54;
}

/** Tap to sign: prints the applicant's name as a handwritten signature that writes itself on. */
export function SignaturePad({ printName, canSign }: SignaturePadProps) {
  const { t, lang } = useLanguage();
  const field = useField('signature.signedAt');
  const signed = field.value !== '';
  const name = printName.trim().replace(/\s+/g, ' ');
  const errorId = `${field.id}-error`;

  // Fetch the script font before it is needed, so it is ready when the signature prints.
  useEffect(() => {
    void document.fonts?.load(`54px ${SIGNATURE_FONT}`, name || 'Aa');
  }, [name]);

  const sign = () => {
    field.onChange(new Date().toISOString());
    field.onBlur();
  };

  const signedDate = signed
    ? new Date(field.value).toLocaleDateString(localeFor(lang), { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="sig" data-invalid={field.error ? 'true' : undefined} data-signed={signed || undefined}>
      <div className="sig__pad">
        {signed ? (
          <div className="sig__ink-wrap" role="img" aria-label={t('review.signedBy', { name })}>
            <span className="sig__mark" aria-hidden="true">
              ×
            </span>
            <span className="sig__ink" key={field.value} style={{ fontSize: inkSize(name) }}>
              {name}
              <span className="sig__cover" aria-hidden="true" />
            </span>
          </div>
        ) : (
          <Button
            iconBefore="edit"
            disabled={!canSign}
            aria-describedby={field.error ? errorId : undefined}
            onClick={sign}
          >
            {t('review.tapToSign')}
          </Button>
        )}
        <span className="sig__line" aria-hidden="true" />
      </div>

      <div className="sig__footer" aria-live="polite">
        {signed ? (
          <>
            <p className="sig__caption">{t('review.signedOn', { date: signedDate })}</p>
            <Button variant="text" onClick={() => field.onChange('')}>
              {t('review.signAgain')}
            </Button>
          </>
        ) : (
          !canSign && <p className="sig__caption">{t('review.tapToSignLocked')}</p>
        )}
      </div>
      {field.error && <FieldError id={errorId} error={field.error} />}
    </div>
  );
}
