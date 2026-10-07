import { ChoiceChips } from '../../components/ChoiceChips';
import type { ChipOption } from '../../components/ChoiceChips';
import type { EntryDescriptor } from '../../components/EntryCard';
import { FieldGroup } from '../../components/FieldGroup';
import { RepeatableGroup } from '../../components/RepeatableGroup';
import { StepBody } from '../../components/StepBody';
import { TextInput } from '../../components/TextInput';
import { YesNoQuestion } from '../../components/YesNoQuestion';
import { useLanguage } from '../../i18n/LanguageContext';
import { formatYear, joinMeta } from '../format';
import { rangeLabel } from '../summaries';
import { MAX_EDUCATION } from '../types';
import type { EducationEntry, EducationKind } from '../types';

const ADDED_KINDS: ReadonlyArray<ChipOption<EducationKind>> = [
  { value: 'college', label: 'education.college' },
  { value: 'other', label: 'education.other' },
];

const KIND_ICON: Record<EducationKind, Pick<EntryDescriptor, 'icon' | 'tone'>> = {
  highSchool: { icon: 'graduation-cap', tone: 'yellow' },
  college: { icon: 'building', tone: 'pink' },
  other: { icon: 'award', tone: 'pink' },
};

export function Education() {
  const { t } = useLanguage();

  const describe = (entry: EducationEntry): EntryDescriptor => {
    const kind = t(`education.${entry.kind}`);
    const range = rangeLabel(t, entry.from, entry.to, 'education.present');
    return {
      ...KIND_ICON[entry.kind],
      cardTitle: kind,
      summaryTitle: entry.name || kind,
      summaryMeta: entry.name ? joinMeta([kind, range]) : range || undefined,
    };
  };

  return (
    <StepBody>
      <RepeatableGroup<EducationEntry>
        group="education"
        max={MAX_EDUCATION}
        addLabel="education.add"
        canRemove={(_, index) => index > 0}
        describe={describe}
        renderFields={(entry, index) => {
          const base = `education.${index}`;
          return (
            <>
              {entry.kind !== 'highSchool' && (
                <ChoiceChips
                  path={`${base}.kind`}
                  label="education.kind"
                  options={ADDED_KINDS}
                  clearable={false}
                  compact
                />
              )}
              <TextInput path={`${base}.name`} label="education.name" compact />
              <TextInput
                path={`${base}.cityState`}
                label="education.cityState"
                placeholder="education.cityStatePlaceholder"
                optional
                compact
              />
              <FieldGroup layout="pair">
                <TextInput
                  path={`${base}.from`}
                  label="education.from"
                  placeholder="education.fromPlaceholder"
                  inputMode="numeric"
                  format={formatYear}
                  maxLength={4}
                  optional
                  compact
                />
                <TextInput
                  path={`${base}.to`}
                  label="education.to"
                  placeholder="education.toPlaceholder"
                  hint="education.toHint"
                  inputMode="numeric"
                  format={formatYear}
                  maxLength={4}
                  optional
                  compact
                />
              </FieldGroup>
              <YesNoQuestion path={`${base}.graduated`} question="education.graduated" variant="inline" />
              <TextInput
                path={`${base}.credential`}
                label="education.credential"
                placeholder="education.credentialPlaceholder"
                optional
                compact
              />
            </>
          );
        }}
      />
    </StepBody>
  );
}
