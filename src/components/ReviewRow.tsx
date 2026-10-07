import { useLanguage } from '../i18n/LanguageContext';
import { Button } from './Button';
import './ReviewRow.css';

interface ReviewRowProps {
  title: string;
  summary: string;
  onEdit: () => void;
}

export function ReviewRow({ title, summary, onEdit }: ReviewRowProps) {
  const { t } = useLanguage();
  return (
    <li className="review-row">
      <div className="review-row__text">
        <div className="review-row__title">{title}</div>
        <div className="review-row__summary">{summary}</div>
      </div>
      <Button variant="text" aria-label={`${t('common.edit')}: ${title}`} onClick={onEdit}>
        {t('common.edit')}
      </Button>
    </li>
  );
}
