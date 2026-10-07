import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'dashed' | 'icon' | 'text';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  iconBefore?: IconName;
  iconAfter?: IconName;
  /** Replaces the label with a three-dot pulse while keeping the button's width. */
  loading?: boolean;
  grow?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  iconBefore,
  iconAfter,
  loading = false,
  grow = false,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = ['btn', `btn--${variant}`, grow ? 'btn--grow' : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} type={type} data-loading={loading || undefined} {...rest}>
      <span className="btn__content">
        {iconBefore && <Icon name={iconBefore} strokeWidth={variant === 'dashed' ? 2.2 : 2} />}
        {children}
        {iconAfter && <Icon name={iconAfter} strokeWidth={2.2} />}
      </span>
      {loading && (
        <span className="btn__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      )}
    </button>
  );
}
