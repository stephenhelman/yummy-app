import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './Sheet.css';

interface SheetProps {
  variant: 'compact' | 'welcome' | 'success';
  intro: boolean;
  children: ReactNode;
}

export function Sheet({ variant, intro, children }: SheetProps) {
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Brief opacity dip when the language changes. Retriggered by class so nothing remounts:
  // entered data, the current step and the scroll position all stay.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const node = ref.current;
    if (!node) return;
    node.classList.remove('sheet--swap');
    void node.offsetWidth;
    node.classList.add('sheet--swap');
  }, [lang]);

  return (
    <main className="sheet" data-variant={variant} data-intro={intro || undefined}>
      <div className="sheet__content" ref={ref}>
        {children}
      </div>
    </main>
  );
}
