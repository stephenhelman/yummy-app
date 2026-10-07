export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function phoneDigits(value: string): string {
  const digits = digitsOnly(value);
  return digits.length > 10 && digits.startsWith('1') ? digits.slice(1, 11) : digits.slice(0, 10);
}

/** (915) 555-0123 as the applicant types. */
export function formatPhone(value: string): string {
  const d = phoneDigits(value);
  if (d.length === 0) return '';
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function formatZip(value: string): string {
  return digitsOnly(value).slice(0, 5);
}

export function formatYear(value: string): string {
  return digitsOnly(value).slice(0, 4);
}

export function formatState(value: string): string {
  return value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
}

/** Digits with at most one decimal point and two decimals. */
export function formatMoney(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  const [whole = '', ...rest] = cleaned.split('.');
  if (rest.length === 0) return whole;
  return `${whole}.${rest.join('').slice(0, 2)}`;
}

export function joinMeta(parts: Array<string | undefined | false>): string {
  return parts.filter((part): part is string => Boolean(part)).join(' · ');
}

/** Parse yyyy-mm-dd or yyyy-mm as a local date. */
export function parseLocalDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value);
  if (!match) return null;
  const [, year = '', month = '', day = '1'] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}
