import { Checkbox } from '../../components/Checkbox';
import { InlineAlert } from '../../components/InlineAlert';
import { ReviewList } from '../../components/ReviewList';
import { ReviewRow } from '../../components/ReviewRow';
import { SignatureField } from '../../components/SignatureField';
import { SignaturePad } from '../../components/SignaturePad';
import { StepBody } from '../../components/StepBody';
import { localeFor, useLanguage } from '../../i18n/LanguageContext';
import type { Translate, TranslationKey } from '../../i18n/types';
import { useForm } from '../FormContext';
import { joinMeta } from '../format';
import { signatureMatches } from '../validation';
import { formatDay } from '../summaries';
import './Review.css';
import type { ApplicationData, StepId } from '../types';

interface Row {
  step: Exclude<StepId, 'review'>;
  title: TranslationKey;
  summary: string;
}

const filled = (value: string) => value.trim() !== '';

function counted(t: Translate, count: number, one: TranslationKey, other: TranslationKey): string {
  return count === 1 ? t(one) : t(other, { count });
}

function buildRows(data: ApplicationData, t: Translate, locale: string): Row[] {
  const { applicant, job, eligibility } = data;

  const jobSummary =
    joinMeta([
      job.position,
      job.employmentTypes
        .map((type) => t(`job.${type}`))
        .join(', '),
      job.dateAvailable && t('review.summaryJobFrom', { date: formatDay(job.dateAvailable, locale) }),
    ]) || t('review.summaryJobEmpty');

  const answers = [
    eligibility.workAuthorized,
    eligibility.workedHereBefore,
    eligibility.felony,
    eligibility.backgroundCheckConsent,
  ];
  const schools = data.education.filter((entry) => filled(entry.name)).length;
  const employers = data.experience.employers.filter((entry) => filled(entry.name)).length;
  const references = data.references.filter((entry) => filled(entry.name)).length;

  return [
    {
      step: 'aboutYou',
      title: 'steps.aboutYou.title',
      summary: t('review.summaryAboutYou', { name: applicant.fullName, phone: applicant.phone }),
    },
    { step: 'job', title: 'steps.job.title', summary: jobSummary },
    {
      step: 'eligibility',
      title: 'steps.eligibility.title',
      summary: t('review.summaryEligibility', {
        count: answers.filter((answer) => answer !== null).length,
        total: answers.length,
      }),
    },
    {
      step: 'education',
      title: 'steps.education.title',
      summary:
        schools === 0
          ? t('review.summarySchoolNone')
          : counted(t, schools, 'review.summarySchoolOne', 'review.summarySchoolOther'),
    },
    {
      step: 'experience',
      title: 'steps.experience.title',
      summary: data.experience.firstJob
        ? t('review.summaryFirstJob')
        : counted(t, employers, 'review.summaryEmployerOne', 'review.summaryEmployerOther'),
    },
    {
      step: 'references',
      title: 'steps.references.title',
      summary: counted(t, references, 'review.summaryReferenceOne', 'review.summaryReferenceOther'),
    },
  ];
}

export function Review() {
  const { state, dispatch } = useForm();
  const { t, lang } = useLanguage();
  const locale = localeFor(lang);
  const { data } = state;

  return (
    <StepBody>
      <ReviewList>
        {buildRows(data, t, locale).map((row) => (
          <ReviewRow
            key={row.step}
            title={t(row.title)}
            summary={row.summary}
            onEdit={() => dispatch({ type: 'goTo', step: row.step })}
          />
        ))}
      </ReviewList>
      <p className="review-eeo">{t('review.eeo')}</p>
      <Checkbox path="signature.certified" label="review.certify" />
      <SignatureField
        path="signature.name"
        label="review.signLabel"
        mismatchHint={filled(data.signature.name) ? t('review.signHint', { name: data.applicant.fullName }) : undefined}
      />
      <SignaturePad printName={data.applicant.fullName} canSign={signatureMatches(data)} />
      {state.status === 'error' && <InlineAlert tone="error">{t('review.submitError')}</InlineAlert>}
    </StepBody>
  );
}
