import { AddressFields } from '../../components/AddressFields';
import { Checkbox } from '../../components/Checkbox';
import { DateInput } from '../../components/DateInput';
import type { EntryDescriptor } from '../../components/EntryCard';
import { FieldGroup } from '../../components/FieldGroup';
import { PayField } from '../../components/PayField';
import { RepeatableGroup } from '../../components/RepeatableGroup';
import { Reveal } from '../../components/Reveal';
import { StepBody } from '../../components/StepBody';
import { TextArea } from '../../components/TextArea';
import { TextInput } from '../../components/TextInput';
import { localeFor, useLanguage } from '../../i18n/LanguageContext';
import { formatPhone, joinMeta } from '../format';
import { formatMonthYear, rangeLabel } from '../summaries';
import { useFormValue } from '../useField';
import { MAX_EMPLOYERS } from '../types';
import type { Employer } from '../types';

export function Experience() {
  const { t, lang } = useLanguage();
  const firstJob = useFormValue<boolean>('experience.firstJob');
  const locale = localeFor(lang);

  const describe = (entry: Employer, index: number): EntryDescriptor => {
    const range = rangeLabel(
      t,
      formatMonthYear(entry.startDate, locale),
      formatMonthYear(entry.endDate, locale),
      'experience.present',
    );
    return {
      icon: 'briefcase',
      tone: 'yellow',
      cardTitle: t('experience.employerTitle', { n: index + 1 }),
      summaryTitle: entry.name || t('experience.newEmployer'),
      summaryMeta: joinMeta([entry.title, range]) || undefined,
    };
  };

  return (
    <StepBody>
      <Checkbox path="experience.firstJob" label="experience.firstJob" />
      <Reveal open={!firstJob}>
        <RepeatableGroup<Employer>
          group="experience.employers"
          max={MAX_EMPLOYERS}
          addLabel="experience.add"
          canRemove={(_, index) => index > 0}
          describe={describe}
          renderFields={(_, index) => {
            const base = `experience.employers.${index}`;
            return (
              <>
                <TextInput path={`${base}.name`} label="experience.name" compact />
                <TextInput
                  path={`${base}.email`}
                  label="experience.email"
                  type="email"
                  inputMode="email"
                  optional
                  compact
                />
                <TextInput
                  path={`${base}.phone`}
                  label="experience.phone"
                  type="tel"
                  inputMode="tel"
                  format={formatPhone}
                  placeholder="about.phonePlaceholder"
                  optional
                  compact
                />
                <AddressFields base={base} optional compact />
                <PayField
                  amountPath={`${base}.startingPay`}
                  typePath={`${base}.startingPayType`}
                  label="experience.startingPay"
                  optional
                  compact
                />
                <PayField
                  amountPath={`${base}.endingPay`}
                  typePath={`${base}.endingPayType`}
                  label="experience.endingPay"
                  optional
                  compact
                />
                <TextInput path={`${base}.title`} label="experience.jobTitle" compact />
                <TextArea
                  path={`${base}.responsibilities`}
                  label="experience.responsibilities"
                  placeholder="experience.responsibilitiesPlaceholder"
                  optional
                  compact
                />
                <FieldGroup layout="auto">
                  <DateInput path={`${base}.startDate`} label="experience.startDate" precision="month" compact />
                  <DateInput
                    path={`${base}.endDate`}
                    label="experience.endDate"
                    hint="experience.endDateHint"
                    precision="month"
                    optional
                    compact
                  />
                </FieldGroup>
                <TextInput path={`${base}.reasonForLeaving`} label="experience.reasonForLeaving" optional compact />
              </>
            );
          }}
        />
      </Reveal>
    </StepBody>
  );
}
