import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useForm } from '../form/FormContext';
import { useFormValue } from '../form/useField';
import type { RepeatableGroupPath } from '../form/types';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/types';
import { Button } from './Button';
import { EntryCard } from './EntryCard';
import { FieldError } from './Field';
import type { EntryDescriptor } from './EntryCard';
import { Reveal } from './Reveal';
import './RepeatableGroup.css';

/** Matches the Reveal transition so a removed card finishes collapsing before it unmounts. */
const COLLAPSE_MS = 300;

interface RepeatableGroupProps<T extends { id: string }> {
  group: RepeatableGroupPath;
  max: number;
  /** A function lets the label change with the count, e.g. "Add your second reference". */
  addLabel: TranslationKey | ((count: number) => TranslationKey);
  describe: (entry: T, index: number) => EntryDescriptor;
  renderFields: (entry: T, index: number) => ReactNode;
  /** The first entry is permanent when false for index 0. */
  canRemove?: (entry: T, index: number) => boolean;
}

export function RepeatableGroup<T extends { id: string }>({
  group,
  max,
  addLabel,
  describe,
  renderFields,
  canRemove = () => true,
}: RepeatableGroupProps<T>) {
  const { state, dispatch } = useForm();
  const { t } = useLanguage();
  const entries = useFormValue<T[]>(group);

  // Group-level error (e.g. "add at least two"), shown once the applicant has tried to continue
  const minError = state.touched[group] ? state.errors[group] : undefined;
  const minErrorId = `${group}-min-error`;

  const hasErrors = (index: number) =>
    Object.keys(state.errors).some((path) => path.startsWith(`${group}.${index}.`));

  const [expanded, setExpanded] = useState<ReadonlySet<string>>(
    () =>
      new Set(
        entries
          .filter((_, index) => index === entries.length - 1 || hasErrors(index))
          .map((entry) => entry.id),
      ),
  );
  const [removing, setRemoving] = useState<ReadonlySet<string>>(new Set());
  const [addedId, setAddedId] = useState<string | null>(null);
  const previousIds = useRef(entries.map((entry) => entry.id));

  // A card added through the Add button opens; finished siblings fold down to their summary row.
  useEffect(() => {
    const known = new Set(previousIds.current);
    const added = entries.find((entry) => !known.has(entry.id));
    previousIds.current = entries.map((entry) => entry.id);
    if (!added) return;
    setAddedId(added.id);
    setExpanded((current) => {
      const next = new Set<string>([added.id]);
      entries.forEach((entry, index) => {
        if (entry.id !== added.id && current.has(entry.id) && hasErrors(index)) next.add(entry.id);
      });
      return next;
    });
  }, [entries]);

  const toggleSet = (set: ReadonlySet<string>, id: string, on: boolean): ReadonlySet<string> => {
    const next = new Set(set);
    if (on) next.add(id);
    else next.delete(id);
    return next;
  };

  const remove = (id: string) => {
    setRemoving((current) => toggleSet(current, id, true));
    window.setTimeout(() => {
      dispatch({ type: 'removeEntry', group, id });
      setRemoving((current) => toggleSet(current, id, false));
    }, COLLAPSE_MS);
  };

  return (
    <div className="group">
      {entries.map((entry, index) => (
        <Reveal key={entry.id} open={!removing.has(entry.id)}>
          <div className="group__slot">
            <EntryCard
              descriptor={describe(entry, index)}
              expanded={expanded.has(entry.id)}
              justAdded={entry.id === addedId}
              onEdit={() => setExpanded((current) => toggleSet(current, entry.id, true))}
              onRemove={canRemove(entry, index) ? () => remove(entry.id) : undefined}
            >
              {renderFields(entry, index)}
            </EntryCard>
          </div>
        </Reveal>
      ))}
      {(entries.length < max || minError) && (
        <div className="group__add" data-invalid={minError ? 'true' : undefined}>
          {entries.length < max && (
            <Button
              variant="dashed"
              iconBefore="plus"
              aria-describedby={minError ? minErrorId : undefined}
              onClick={() => dispatch({ type: 'addEntry', group })}
            >
              {t(typeof addLabel === 'function' ? addLabel(entries.length) : addLabel)}
            </Button>
          )}
          {minError && <FieldError id={minErrorId} error={minError} />}
        </div>
      )}
    </div>
  );
}
