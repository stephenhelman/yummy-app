import { formatState, formatZip } from '../form/format';
import { FieldGroup } from './FieldGroup';
import { TextInput } from './TextInput';

interface AddressFieldsProps {
  /** Path of the object holding street, city, state and zip. */
  base: string;
  optional?: boolean;
  compact?: boolean;
}

export function AddressFields({ base, optional, compact }: AddressFieldsProps) {
  return (
    <FieldGroup>
      <TextInput
        path={`${base}.street`}
        label="address.street"
        placeholder="address.streetPlaceholder"
        autoComplete="address-line1"
        optional={optional}
        compact={compact}
      />
      <TextInput
        path={`${base}.city`}
        label="address.city"
        autoComplete="address-level2"
        optional={optional}
        compact={compact}
      />
      <FieldGroup layout="auto">
        <TextInput
          path={`${base}.state`}
          label="address.state"
          autoComplete="address-level1"
          format={formatState}
          maxLength={2}
          optional={optional}
          compact={compact}
        />
        <TextInput
          path={`${base}.zip`}
          label="address.zip"
          placeholder="address.zipPlaceholder"
          inputMode="numeric"
          autoComplete="postal-code"
          format={formatZip}
          maxLength={5}
          optional={optional}
          compact={compact}
        />
      </FieldGroup>
    </FieldGroup>
  );
}
