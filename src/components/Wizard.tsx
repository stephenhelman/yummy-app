import { useEffect, useRef } from 'react';
import { useForm } from '../form/FormContext';
import { STEPS } from '../form/steps';
import { STEP_ORDER } from '../form/validation';
import type { StepId } from '../form/types';
import { useLanguage } from '../i18n/LanguageContext';
import { submitApplication } from '../lib/submit';
import { ProgressBar } from './ProgressBar';
import { StepHeader } from './StepHeader';
import { WizardNav } from './WizardNav';
import './Wizard.css';

const SHAKE_MS = 400;
const FOCUSABLE = 'input, textarea, select, button';

function isVisible(element: HTMLElement): boolean {
  return element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
}

/** Focus the first invalid control, scroll it into view and give each invalid field one shake. */
function revealInvalidFields() {
  const invalid = Array.from(document.querySelectorAll<HTMLElement>('[data-invalid="true"]')).filter(isVisible);
  const first = invalid[0];
  if (!first) return;

  const target = first.matches(FOCUSABLE) ? first : first.querySelector<HTMLElement>(FOCUSABLE);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target?.focus({ preventScroll: true });
  (target ?? first).scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });

  invalid.forEach((element) => {
    element.classList.remove('is-shaking');
    void element.offsetWidth;
    element.classList.add('is-shaking');
    window.setTimeout(() => element.classList.remove('is-shaking'), SHAKE_MS);
  });
}

export function Wizard({ step }: { step: StepId }) {
  const { state, dispatch } = useForm();
  const { t, lang } = useLanguage();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const index = STEP_ORDER.indexOf(step);
  const total = STEPS.length;
  const config = STEPS[index];
  const isLast = index === total - 1;
  const submitting = state.status === 'submitting';

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => {
    if (state.attempt === 0) return;
    const frame = window.requestAnimationFrame(revealInvalidFields);
    return () => window.cancelAnimationFrame(frame);
  }, [state.attempt]);

  if (!config) return null;
  const Step = config.render;
  const title = t(config.titleKey);

  const submit = async () => {
    dispatch({ type: 'submitStart' });
    try {
      await submitApplication(state.data, {
        language: lang,
        honeypot: honeypotRef.current?.value ?? '',
        startedAt: state.startedAt,
      });
      dispatch({ type: 'submitSuccess' });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'submitError' });
    }
  };

  const onNext = () => {
    const errors = config.validate(state.data);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'invalid', errors });
    } else if (isLast) {
      void submit();
    } else {
      dispatch({ type: 'next' });
    }
  };

  return (
    <div className="wizard">
      <ProgressBar current={index} total={total} />
      <div className="wizard__step" key={config.id} data-direction={state.direction}>
        <StepHeader
          index={index}
          total={total}
          title={config.titleKey}
          description={config.descriptionKey}
          headingRef={headingRef}
        />
        <Step />
      </div>
      <div className="visually-hidden" aria-hidden="true">
        <label>
          {t('wizard.honeypotLabel')}
          <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="visually-hidden" role="status" aria-live="polite">
        {t('wizard.announce', { current: index + 1, total, title })}
      </div>
      <WizardNav
        isLast={isLast}
        submitting={submitting}
        onBack={() => dispatch({ type: 'back' })}
        onNext={onNext}
      />
    </div>
  );
}
