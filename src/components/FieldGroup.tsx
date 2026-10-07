import type { ReactNode } from 'react';
import './FieldGroup.css';

interface FieldGroupProps {
  /** "pair" is always two columns; "auto" drops to one column when there is no room (month pickers at 320px). */
  layout?: 'stack' | 'pair' | 'auto';
  children: ReactNode;
}

export function FieldGroup({ layout = 'stack', children }: FieldGroupProps) {
  return (
    <div className="field-group" data-layout={layout}>
      {children}
    </div>
  );
}
