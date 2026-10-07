import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Header } from './Header';
import type { HeaderVariant } from './Header';
import { Sheet } from './Sheet';
import { shouldPlayIntro } from '../lib/intro';
import './AppShell.css';

interface AppShellProps {
  variant: HeaderVariant;
  children: ReactNode;
}

const INTRO_MS = 700;

export function AppShell({ variant, children }: AppShellProps) {
  const [intro, setIntro] = useState(shouldPlayIntro);

  useEffect(() => {
    if (!intro) return;
    const id = window.setTimeout(() => setIntro(false), INTRO_MS);
    return () => window.clearTimeout(id);
  }, [intro]);

  return (
    <div className="shell">
      <Header variant={variant} intro={intro} />
      <Sheet variant={variant} intro={intro}>
        {children}
      </Sheet>
    </div>
  );
}
