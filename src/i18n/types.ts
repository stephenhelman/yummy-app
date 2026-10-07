import type { en } from './en';

type Widen<T> = T extends string ? string : { -readonly [K in keyof T]: Widen<T[K]> };

/** Same shape as `en`, with every string leaf widened. A missing or extra key in a translation is a compile error. */
export type Dictionary = Widen<typeof en>;

type Paths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Paths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type TranslationKey = Paths<typeof en>;

export type Lang = 'en' | 'es';

export type TranslateVars = Record<string, string | number>;

export type Translate = (key: TranslationKey, vars?: TranslateVars) => string;
