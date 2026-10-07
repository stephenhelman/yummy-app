import { formatMoney } from '../form/format';
import { TextInput } from './TextInput';
import type { TextInputProps } from './TextInput';

type MoneyInputProps = Omit<TextInputProps, 'type' | 'format' | 'prefix' | 'inputMode'>;

export function MoneyInput(props: MoneyInputProps) {
  return <TextInput {...props} prefix="$" inputMode="decimal" format={formatMoney} />;
}
