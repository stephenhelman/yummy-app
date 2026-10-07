import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import './Sprinkles.css';

const COUNT = 14;
const COLORS = ['var(--pink)', 'var(--yellow)', 'var(--pink-strong)'] as const;

interface Sprinkle {
  angle: number;
  distance: number;
  delay: number;
  color: string;
}

function createSprinkles(): Sprinkle[] {
  return Array.from({ length: COUNT }, (_, index) => ({
    angle: (360 / COUNT) * index + (Math.random() * 16 - 8),
    distance: 72 + Math.random() * 44,
    delay: 380 + Math.random() * 90,
    // 12 in the logo colors, then one teal and one purple echoing the popsicle
    color:
      index === COUNT - 2
        ? 'var(--teal)'
        : index === COUNT - 1
          ? 'var(--purple)'
          : COLORS[index % COLORS.length] ?? 'var(--pink)',
  }));
}

/** Burst of short rounded bars around its parent. Place inside a positioned element. */
export function Sprinkles() {
  const sprinkles = useMemo(createSprinkles, []);
  return (
    <div className="sprinkles" aria-hidden="true">
      {sprinkles.map((sprinkle, index) => (
        <span
          key={index}
          className="sprinkles__bar"
          style={
            {
              '--angle': `${sprinkle.angle}deg`,
              '--dist': `${sprinkle.distance}px`,
              '--delay': `${sprinkle.delay}ms`,
              '--color': sprinkle.color,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
