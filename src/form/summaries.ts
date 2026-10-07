import { parseLocalDate } from './format';
import type { Translate, TranslationKey } from '../i18n/types';

export function formatDay(value: string, locale: string): string {
  const date = parseLocalDate(value);
  return date ? date.toLocaleDateString(locale, { month: 'short', day: 'numeric' }) : '';
}

export function formatMonthYear(value: string, locale: string): string {
  const date = parseLocalDate(value);
  return date ? date.toLocaleDateString(locale, { month: 'short', year: 'numeric' }) : '';
}

/** "2021 – 2025", "2025 – present", or the lone end value; empty when both are blank. */
export function rangeLabel(t: Translate, from: string, to: string, present: TranslationKey): string {
  if (from) return t('common.dateRange', { from, to: to || t(present) });
  return to;
}
