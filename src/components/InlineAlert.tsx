import type { ReactNode } from 'react';
import { Icon } from './Icon';
import './InlineAlert.css';

interface InlineAlertProps {
  tone: 'error' | 'info';
  children: ReactNode;
}

export function InlineAlert({ tone, children }: InlineAlertProps) {
  return (
    <div className="alert" data-tone={tone} role={tone === 'error' ? 'alert' : undefined}>
      <Icon name="alert-circle" size={20} />
      <p>{children}</p>
    </div>
  );
}
