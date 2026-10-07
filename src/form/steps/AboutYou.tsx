import { AddressFields } from '../../components/AddressFields';
import { StepBody } from '../../components/StepBody';
import { TextInput } from '../../components/TextInput';
import { formatPhone } from '../format';

export function AboutYou() {
  return (
    <StepBody>
      <TextInput path="applicant.fullName" label="about.fullName" autoComplete="name" />
      <TextInput
        path="applicant.email"
        label="about.email"
        type="email"
        inputMode="email"
        autoComplete="email"
      />
      <TextInput
        path="applicant.phone"
        label="about.phone"
        placeholder="about.phonePlaceholder"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        format={formatPhone}
      />
      <AddressFields base="applicant" />
    </StepBody>
  );
}
