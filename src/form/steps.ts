import type { ComponentType } from 'react';
import type { TranslationKey } from '../i18n/types';
import { AboutYou } from './steps/AboutYou';
import { Education } from './steps/Education';
import { Eligibility } from './steps/Eligibility';
import { Experience } from './steps/Experience';
import { References } from './steps/References';
import { Review } from './steps/Review';
import { TheJob } from './steps/TheJob';
import { STEP_ORDER, validateStep } from './validation';
import type { ApplicationData, Errors, StepId } from './types';

export interface StepConfig {
  id: StepId;
  titleKey: TranslationKey;
  descriptionKey?: TranslationKey;
  render: ComponentType;
  validate: (data: ApplicationData) => Errors;
}

type StepDefinition = Omit<StepConfig, 'id' | 'validate'>;

const definitions: Record<StepId, StepDefinition> = {
  aboutYou: { titleKey: 'steps.aboutYou.title', descriptionKey: 'steps.aboutYou.description', render: AboutYou },
  job: { titleKey: 'steps.job.title', descriptionKey: 'steps.job.description', render: TheJob },
  eligibility: {
    titleKey: 'steps.eligibility.title',
    descriptionKey: 'steps.eligibility.description',
    render: Eligibility,
  },
  education: { titleKey: 'steps.education.title', descriptionKey: 'steps.education.description', render: Education },
  experience: {
    titleKey: 'steps.experience.title',
    descriptionKey: 'steps.experience.description',
    render: Experience,
  },
  references: {
    titleKey: 'steps.references.title',
    descriptionKey: 'steps.references.description',
    render: References,
  },
  review: { titleKey: 'steps.review.title', render: Review },
};

/** Ordered step list. The wizard shell, progress bar and nav read only from this. */
export const STEPS: readonly StepConfig[] = STEP_ORDER.map((id) => ({
  id,
  ...definitions[id],
  validate: (data: ApplicationData) => validateStep(id, data),
}));
