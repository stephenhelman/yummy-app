import { useField } from '../form/useField';
import type { TranslationKey } from '../i18n/types';
import { Field } from './Field';
import './SignatureField.css';

interface SignatureFieldProps {
  path: string;
  label: TranslationKey;
  /** Shown while the typed name is wrong, to say what it should match. */
  mismatchHint?: string;
}

/** The typed name. Editing it takes back a signature that was already printed. */
export function SignatureField({ path, label, mismatchHint }: SignatureFieldProps) {
  const field = useField(path);
  const signedAt = useField('signature.signedAt');

  return (
    <Field id={field.id} label={label} error={field.error}>
      {(control) => (
        <>
          <input
            {...control.aria}
            className="control signature"
            name={field.path}
            type="text"
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            value={field.value}
            onChange={(event) => {
              field.onChange(event.target.value);
              if (signedAt.value) signedAt.onChange('');
            }}
            onBlur={field.onBlur}
          />
          {field.error && mismatchHint && <p className="signature__hint">{mismatchHint}</p>}
        </>
      )}
    </Field>
  );
}
