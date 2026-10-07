import { LanguageToggle } from './LanguageToggle';
import { Logo } from './Logo';
import './Header.css';

export type HeaderVariant = 'compact' | 'welcome' | 'success';

interface HeaderProps {
  variant: HeaderVariant;
  /** Plays the first-load logo scale-in. */
  intro: boolean;
}

export function Header({ variant, intro }: HeaderProps) {
  return (
    <header className="header" data-variant={variant} data-intro={intro || undefined}>
      {variant !== 'success' && (
        <div className="header__toggle">
          <LanguageToggle />
        </div>
      )}
      <Logo className="header__logo" />
    </header>
  );
}
