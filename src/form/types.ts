import type { TranslationKey } from '../i18n/types';

export type YesNo = boolean | null;
export type PayType = 'hour' | 'salary';
export type EmploymentType = 'fullTime' | 'partTime' | 'seasonal';
export type EducationKind = 'highSchool' | 'college' | 'other';

export interface Applicant {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Job {
  position: string;
  dateAvailable: string;
  desiredPay: string;
  payType: PayType | null;
  employmentTypes: EmploymentType[];
}

export interface Eligibility {
  workAuthorized: YesNo;
  workedHereBefore: YesNo;
  previousStart: string;
  previousEnd: string;
  felony: YesNo;
  felonyExplanation: string;
  backgroundCheckConsent: YesNo;
}

export interface EducationEntry {
  id: string;
  kind: EducationKind;
  name: string;
  cityState: string;
  from: string;
  to: string;
  graduated: YesNo;
  credential: string;
}

export interface Employer {
  id: string;
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  startingPay: string;
  startingPayType: PayType | null;
  endingPay: string;
  endingPayType: PayType | null;
  title: string;
  responsibilities: string;
  startDate: string;
  endDate: string;
  reasonForLeaving: string;
}

export interface Reference {
  id: string;
  name: string;
  relationship: string;
  company: string;
  title: string;
  email: string;
  phone: string;
}

export interface ApplicationData {
  applicant: Applicant;
  job: Job;
  eligibility: Eligibility;
  education: EducationEntry[];
  experience: { firstJob: boolean; employers: Employer[] };
  references: Reference[];
  signature: { certified: boolean; name: string; signedAt: string };
}

export type StepId =
  | 'aboutYou'
  | 'job'
  | 'eligibility'
  | 'education'
  | 'experience'
  | 'references'
  | 'review';

export type Screen = StepId | 'welcome' | 'success';

/** Field path (dot notation, array indexes as numbers) to the i18n key of its error. */
export type Errors = Record<string, TranslationKey>;

export type RepeatableGroupPath = 'education' | 'experience.employers' | 'references';

export const MAX_EDUCATION = 4;
export const MAX_EMPLOYERS = 3;
export const MIN_REFERENCES = 2;
export const MAX_REFERENCES = 5;
