import type { ReactNode } from 'react';
import './ReviewList.css';

export function ReviewList({ children }: { children: ReactNode }) {
  return <ul className="review-list">{children}</ul>;
}
