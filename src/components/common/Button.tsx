import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'forest' | 'teal' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  asAnchor?: boolean;
  href?: string;
}

/**
 * ReRoute Button Component
 * STRICT REQUIREMENT: Rectangular with slightly rounded corners (5–8px border radius).
 * No pill shapes or capsules.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  className = '',
  asAnchor = false,
  href,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap shrink-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-12 font-semibold',
  }[size];

  const variantStyles = {
    // Primary: Midnight Indigo / Deep Purple
    primary:
      'bg-[#1D1160] hover:bg-[#33006F] text-white shadow-sm border border-[#1D1160] focus-visible:outline-[#33006F]',
    // Secondary: Clean outline with crisp border
    secondary:
      'bg-white hover:bg-[#F4F7F5] text-[#1D1160] border border-[#D5DFD9] shadow-xs focus-visible:outline-[#1D1160]',
    // Forest: Deep sustainable agricultural green
    forest:
      'bg-[#17483C] hover:bg-[#12382F] text-white shadow-sm border border-[#17483C] focus-visible:outline-[#17483C]',
    // Teal: Secondary action
    teal:
      'bg-[#317787] hover:bg-[#205561] text-white shadow-sm border border-[#317787] focus-visible:outline-[#317787]',
    // Ghost: Transparent with subtle hover
    ghost:
      'bg-transparent hover:bg-[#E6EEF2]/60 text-[#17483C] border border-transparent focus-visible:outline-[#17483C]',
  }[variant];

  const combinedClasses = `${baseStyles} ${sizeStyles} ${variantStyles} ${className}`;

  if (asAnchor && href) {
    return (
      <a href={href} className={combinedClasses}>
        {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </a>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};

export default Button;
