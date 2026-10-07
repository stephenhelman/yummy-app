import type { ApplicationData, EducationEntry, Employer, Reference, RepeatableGroupPath } from './types';

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function createEducation(kind: EducationEntry['kind']): EducationEntry {
  return {
    id: newId(),
    kind,
    name: '',
    cityState: '',
    from: '',
    to: '',
    graduated: null,
    credential: '',
  };
}

export function createEmployer(): Employer {
  return {
    id: newId(),
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    startingPay: '',
    startingPayType: null,
    endingPay: '',
    endingPayType: null,
    title: '',
    responsibilities: '',
    startDate: '',
    endDate: '',
    reasonForLeaving: '',
  };
}

export function createReference(): Reference {
  return { id: newId(), name: '', relationship: '', company: '', title: '', email: '', phone: '' };
}

export function createEntry(group: RepeatableGroupPath): EducationEntry | Employer | Reference {
  if (group === 'education') return createEducation('college');
  if (group === 'references') return createReference();
  return createEmployer();
}

export function createInitialData(): ApplicationData {
  return {
    applicant: { fullName: '', email: '', phone: '', street: '', city: 'El Paso', state: 'TX', zip: '' },
    job: { position: '', dateAvailable: '', desiredPay: '', payType: null, employmentTypes: [] },
    eligibility: {
      workAuthorized: null,
      workedHereBefore: null,
      previousStart: '',
      previousEnd: '',
      felony: null,
      felonyExplanation: '',
      backgroundCheckConsent: null,
    },
    education: [createEducation('highSchool')],
    experience: { firstJob: false, employers: [createEmployer()] },
    references: [createReference()],
    signature: { certified: false, name: '', signedAt: '' },
  };
}
