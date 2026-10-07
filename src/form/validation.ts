import { phoneDigits } from './format';
import { MIN_REFERENCES } from './types';
import type {
  ApplicationData,
  EducationEntry,
  Employer,
  Errors,
  Reference,
  StepId,
  YesNo,
} from './types';

export const STEP_ORDER: readonly StepId[] = [
  'aboutYou',
  'job',
  'eligibility',
  'education',
  'experience',
  'references',
  'review',
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const blank = (value: string) => value.trim() === '';
const validEmail = (value: string) => EMAIL.test(value.trim());
const validPhone = (value: string) => phoneDigits(value).length === 10;
const validZip = (value: string) => /^\d{5}$/.test(value);
const validYear = (value: string) => /^\d{4}$/.test(value);

export function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function signatureMatches(data: ApplicationData): boolean {
  const signed = normalizeName(data.signature.name);
  return signed !== '' && signed === normalizeName(data.applicant.fullName);
}

function requireText(errors: Errors, path: string, value: string) {
  if (blank(value)) errors[path] = 'errors.required';
}

function requireAnswer(errors: Errors, path: string, value: YesNo) {
  if (value === null) errors[path] = 'errors.answer';
}

function checkOptionalEmail(errors: Errors, path: string, value: string) {
  if (!blank(value) && !validEmail(value)) errors[path] = 'errors.email';
}

function checkOptionalPhone(errors: Errors, path: string, value: string) {
  if (!blank(value) && !validPhone(value)) errors[path] = 'errors.phone';
}

function checkOptionalZip(errors: Errors, path: string, value: string) {
  if (!blank(value) && !validZip(value)) errors[path] = 'errors.zip';
}

function checkOptionalYear(errors: Errors, path: string, value: string) {
  if (!blank(value) && !validYear(value)) errors[path] = 'errors.year';
}

function validateAboutYou({ applicant }: ApplicationData): Errors {
  const errors: Errors = {};
  requireText(errors, 'applicant.fullName', applicant.fullName);
  if (blank(applicant.email)) errors['applicant.email'] = 'errors.required';
  else checkOptionalEmail(errors, 'applicant.email', applicant.email);
  if (blank(applicant.phone)) errors['applicant.phone'] = 'errors.required';
  else checkOptionalPhone(errors, 'applicant.phone', applicant.phone);
  requireText(errors, 'applicant.street', applicant.street);
  requireText(errors, 'applicant.city', applicant.city);
  requireText(errors, 'applicant.state', applicant.state);
  if (blank(applicant.zip)) errors['applicant.zip'] = 'errors.required';
  else checkOptionalZip(errors, 'applicant.zip', applicant.zip);
  return errors;
}

function validateJob({ job }: ApplicationData): Errors {
  const errors: Errors = {};
  requireText(errors, 'job.position', job.position);
  requireText(errors, 'job.dateAvailable', job.dateAvailable);
  if (job.employmentTypes.length === 0) errors['job.employmentTypes'] = 'errors.choose';
  return errors;
}

function validateEligibility({ eligibility: e }: ApplicationData): Errors {
  const errors: Errors = {};
  requireAnswer(errors, 'eligibility.workAuthorized', e.workAuthorized);
  requireAnswer(errors, 'eligibility.workedHereBefore', e.workedHereBefore);
  if (e.workedHereBefore === true) {
    requireText(errors, 'eligibility.previousStart', e.previousStart);
    requireText(errors, 'eligibility.previousEnd', e.previousEnd);
  }
  requireAnswer(errors, 'eligibility.felony', e.felony);
  if (e.felony === true) requireText(errors, 'eligibility.felonyExplanation', e.felonyExplanation);
  requireAnswer(errors, 'eligibility.backgroundCheckConsent', e.backgroundCheckConsent);
  return errors;
}

function educationHasContent(entry: EducationEntry): boolean {
  return [entry.name, entry.cityState, entry.from, entry.to, entry.credential].some(
    (value) => !blank(value),
  ) || entry.graduated !== null;
}

function validateEducation({ education }: ApplicationData): Errors {
  const errors: Errors = {};
  education.forEach((entry, index) => {
    const base = `education.${index}`;
    if (educationHasContent(entry)) requireText(errors, `${base}.name`, entry.name);
    checkOptionalYear(errors, `${base}.from`, entry.from);
    checkOptionalYear(errors, `${base}.to`, entry.to);
  });
  return errors;
}

function validateEmployer(errors: Errors, entry: Employer, index: number) {
  const base = `experience.employers.${index}`;
  requireText(errors, `${base}.name`, entry.name);
  requireText(errors, `${base}.title`, entry.title);
  requireText(errors, `${base}.startDate`, entry.startDate);
  checkOptionalEmail(errors, `${base}.email`, entry.email);
  checkOptionalPhone(errors, `${base}.phone`, entry.phone);
  checkOptionalZip(errors, `${base}.zip`, entry.zip);
}

function validateExperience({ experience }: ApplicationData): Errors {
  const errors: Errors = {};
  if (experience.firstJob) return errors;
  experience.employers.forEach((entry, index) => validateEmployer(errors, entry, index));
  return errors;
}

function validateReference(errors: Errors, entry: Reference, index: number) {
  const base = `references.${index}`;
  requireText(errors, `${base}.name`, entry.name);
  requireText(errors, `${base}.relationship`, entry.relationship);
  checkOptionalEmail(errors, `${base}.email`, entry.email);
  checkOptionalPhone(errors, `${base}.phone`, entry.phone);
  if (blank(entry.email) && blank(entry.phone)) {
    errors[`${base}.email`] = 'errors.contact';
  }
}

function validateReferences({ references }: ApplicationData): Errors {
  const errors: Errors = {};
  references.forEach((entry, index) => validateReference(errors, entry, index));
  if (references.length < MIN_REFERENCES) errors.references = 'errors.referencesMin';
  return errors;
}

function validateReview(data: ApplicationData): Errors {
  const errors: Errors = {};
  if (!data.signature.certified) errors['signature.certified'] = 'errors.certify';
  if (blank(data.signature.name)) errors['signature.name'] = 'errors.required';
  else if (!signatureMatches(data)) errors['signature.name'] = 'errors.signature';
  if (blank(data.signature.signedAt)) errors['signature.signedAt'] = 'errors.sign';
  return errors;
}

const validators: Record<StepId, (data: ApplicationData) => Errors> = {
  aboutYou: validateAboutYou,
  job: validateJob,
  eligibility: validateEligibility,
  education: validateEducation,
  experience: validateExperience,
  references: validateReferences,
  review: validateReview,
};

export function validateStep(step: StepId, data: ApplicationData): Errors {
  return validators[step](data);
}

export function isStepId(value: string): value is StepId {
  return (STEP_ORDER as readonly string[]).includes(value);
}
