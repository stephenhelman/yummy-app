import { ChoiceChips } from '../../components/ChoiceChips';
import type { ChipOption } from '../../components/ChoiceChips';
import { DateInput } from '../../components/DateInput';
import { PayField } from '../../components/PayField';
import { StepBody } from '../../components/StepBody';
import { TextInput } from '../../components/TextInput';
import type { EmploymentType } from '../types';

const EMPLOYMENT_TYPES: ReadonlyArray<ChipOption<EmploymentType>> = [
  { value: 'fullTime', label: 'job.fullTime' },
  { value: 'partTime', label: 'job.partTime' },
  { value: 'seasonal', label: 'job.seasonal' },
];

export function TheJob() {
  return (
    <StepBody>
      <TextInput path="job.position" label="job.position" placeholder="job.positionPlaceholder" />
      <DateInput path="job.dateAvailable" label="job.dateAvailable" />
      <PayField amountPath="job.desiredPay" typePath="job.payType" label="job.desiredPay" optional />
      <ChoiceChips path="job.employmentTypes" label="job.employmentTypes" options={EMPLOYMENT_TYPES} multiple />
    </StepBody>
  );
}
