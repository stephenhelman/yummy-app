import type { ReactNode } from 'react';
import './Reveal.css';

interface RevealProps {
  open: boolean;
  className?: string;
  children: ReactNode;
}

/** Animates height with grid rows (0fr to 1fr), no measuring. Closed content leaves the tab order. */
export function Reveal({ open, className, children }: RevealProps) {
  return (
    <div className={className ? `reveal ${className}` : 'reveal'} data-open={open}>
      <div className="reveal__inner">{children}</div>
    </div>
  );
}
