import type { PayType } from '../form/types';
import type { TranslationKey } from '../i18n/types';
import { ChoiceChips } from './ChoiceChips';
import type { ChipOption } from './ChoiceChips';
import { FieldGroup } from './FieldGroup';
import { MoneyInput } from './MoneyInput';

const PAY_TYPES: ReadonlyArray<ChipOption<PayType>> = [
  { value: 'hour', label: 'pay.hour' },
  { value: 'salary', label: 'pay.salary' },
];

interface PayFieldProps {
  amountPath: string;
  typePath: string;
  label: TranslationKey;
  optional?: boolean;
  compact?: boolean;
}

/** Amount with a $ prefix plus Hour / Salary chips. */
export function PayField({ amountPath, typePath, label, optional, compact }: PayFieldProps) {
  return (
    <FieldGroup>
      <MoneyInput path={amountPath} label={label} optional={optional} compact={compact} />
      <ChoiceChips path={typePath} label="pay.typeLabel" options={PAY_TYPES} optional compact={compact} />
    </FieldGroup>
  );
}
