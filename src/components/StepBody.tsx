import { Children } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import './StepBody.css';

const MAX_STAGGERED = 8;

/** Wraps each direct child so it can fade up in sequence on step entry. */
export function StepBody({ children }: { children: ReactNode }) {
  return (
    <div className="step-body">
      {Children.toArray(children).map((child, index) => (
        <div
          className="step-body__item"
          style={{ '--i': Math.min(index, MAX_STAGGERED) } as CSSProperties}
          key={index}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
