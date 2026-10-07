import type { EntryDescriptor } from '../../components/EntryCard';
import { RepeatableGroup } from '../../components/RepeatableGroup';
import { StepBody } from '../../components/StepBody';
import { TextInput } from '../../components/TextInput';
import { useLanguage } from '../../i18n/LanguageContext';
import type { TranslationKey } from '../../i18n/types';
import { formatPhone } from '../format';
import { MAX_REFERENCES, MIN_REFERENCES } from '../types';
import type { Reference } from '../types';

const addLabel = (count: number): TranslationKey =>
  count < MIN_REFERENCES ? 'references.addSecond' : 'references.addAnother';

export function References() {
  const { t } = useLanguage();

  const describe = (entry: Reference, index: number): EntryDescriptor => ({
    icon: 'user',
    tone: index % 2 === 0 ? 'yellow' : 'pink',
    cardTitle: t('references.cardTitle', { n: index + 1 }),
    summaryTitle: entry.name || t('references.newReference'),
    summaryMeta: entry.relationship || undefined,
  });

  return (
    <StepBody>
      <RepeatableGroup<Reference>
        group="references"
        max={MAX_REFERENCES}
        addLabel={addLabel}
        canRemove={(_, index) => index > 0}
        describe={describe}
        renderFields={(_, index) => {
          const base = `references.${index}`;
          return (
            <>
              <TextInput path={`${base}.name`} label="references.name" autoComplete="off" compact />
              <TextInput
                path={`${base}.relationship`}
                label="references.relationship"
                placeholder="references.relationshipPlaceholder"
                compact
              />
              <TextInput path={`${base}.company`} label="references.company" optional compact />
              <TextInput path={`${base}.title`} label="references.title" optional compact />
              <TextInput
                path={`${base}.email`}
                label="references.email"
                hint="references.contactHint"
                type="email"
                inputMode="email"
                compact
              />
              <TextInput
                path={`${base}.phone`}
                label="references.phone"
                placeholder="about.phonePlaceholder"
                type="tel"
                inputMode="tel"
                format={formatPhone}
                compact
              />
            </>
          );
        }}
      />
    </StepBody>
  );
}
