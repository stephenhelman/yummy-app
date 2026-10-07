import './ProgressBar.css';

interface ProgressBarProps {
  /** Zero-based index of the current step. */
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="progress" aria-hidden="true" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className="progress__segment"
          data-filled={index <= current}
          data-final={index === total - 1}
        >
          <div className="progress__fill" />
        </div>
      ))}
    </div>
  );
}
