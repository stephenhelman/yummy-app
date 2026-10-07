import type { ReactNode } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from './Button';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Reveal } from './Reveal';
import './EntryCard.css';

export interface EntryDescriptor {
  icon: IconName;
  tone: 'yellow' | 'pink';
  /** Fredoka title on the expanded card. */
  cardTitle: string;
  summaryTitle: string;
  summaryMeta?: string;
}

interface EntryCardProps {
  descriptor: EntryDescriptor;
  expanded: boolean;
  justAdded?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  children: ReactNode;
}

function IconTile({ icon, tone }: { icon: IconName; tone: EntryDescriptor['tone'] }) {
  return (
    <span className="entry__tile" data-tone={tone}>
      <Icon name={icon} />
    </span>
  );
}

export function EntryCard({ descriptor, expanded, justAdded, onEdit, onRemove, children }: EntryCardProps) {
  const { t } = useLanguage();
  const { icon, tone, cardTitle, summaryTitle, summaryMeta } = descriptor;

  return (
    <article className="entry" data-new={justAdded || undefined}>
      <Reveal open={!expanded}>
        <div className="entry__summary">
          <IconTile icon={icon} tone={tone} />
          <div className="entry__text">
            <div className="entry__summary-title">{summaryTitle}</div>
            {summaryMeta && <div className="entry__meta">{summaryMeta}</div>}
          </div>
          {onEdit && (
            <Button
              variant="icon"
              iconBefore="edit"
              aria-label={t('common.editEntry', { title: summaryTitle })}
              onClick={onEdit}
            />
          )}
        </div>
      </Reveal>
      <Reveal open={expanded}>
        <div className="entry__body">
          <div className="entry__header">
            <IconTile icon={icon} tone={tone} />
            <h2 className="entry__title">{cardTitle}</h2>
            {onRemove && (
              <Button
                variant="icon"
                iconBefore="trash"
                aria-label={t('common.removeEntry', { title: cardTitle })}
                onClick={onRemove}
              />
            )}
          </div>
          {children}
        </div>
      </Reveal>
    </article>
  );
}
