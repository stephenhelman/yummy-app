import { DateInput } from '../../components/DateInput';
import { FieldGroup } from '../../components/FieldGroup';
import { StepBody } from '../../components/StepBody';
import { TextArea } from '../../components/TextArea';
import { YesNoQuestion } from '../../components/YesNoQuestion';

export function Eligibility() {
  return (
    <StepBody>
      <YesNoQuestion path="eligibility.workAuthorized" question="eligibility.workAuthorized" />
      <YesNoQuestion
        path="eligibility.workedHereBefore"
        question="eligibility.workedHereBefore"
        followUp={
          <FieldGroup layout="auto">
            <DateInput path="eligibility.previousStart" label="eligibility.previousStart" precision="month" compact />
            <DateInput path="eligibility.previousEnd" label="eligibility.previousEnd" precision="month" compact />
          </FieldGroup>
        }
      />
      <YesNoQuestion
        path="eligibility.felony"
        question="eligibility.felony"
        followUp={<TextArea path="eligibility.felonyExplanation" label="eligibility.felonyExplanation" compact />}
      />
      <YesNoQuestion path="eligibility.backgroundCheckConsent" question="eligibility.backgroundCheckConsent" />
    </StepBody>
  );
}
