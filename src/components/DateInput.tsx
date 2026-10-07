import { TextInput } from './TextInput';
import type { TextInputProps } from './TextInput';

interface DateInputProps extends Omit<TextInputProps, 'type' | 'format' | 'prefix' | 'inputMode'> {
  /** "date" picks a day, "month" picks a month and year. */
  precision?: 'date' | 'month';
}

export function DateInput({ precision = 'date', ...rest }: DateInputProps) {
  return <TextInput {...rest} type={precision} />;
}
