import { useLanguage } from '../i18n/LanguageContext';
import logo1x from '../assets/la-michoacana-yummy-logo@1x.png';
import logo2x from '../assets/la-michoacana-yummy-logo.png';
import './Logo.css';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const { t } = useLanguage();
  return (
    <img
      className={className ? `logo ${className}` : 'logo'}
      src={logo1x}
      srcSet={`${logo1x} 1x, ${logo2x} 2x`}
      width={557}
      height={473}
      alt={t('common.logoAlt')}
    />
  );
}
