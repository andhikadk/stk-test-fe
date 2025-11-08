import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'warning' | 'ghost';
  size?: 'sm' | 'md';
  icon: ReactNode;
  isRound?: boolean;
}

export default function IconButton({
  variant = 'ghost',
  size = 'md',
  icon,
  isRound = false,
  className = '',
  ...props
}: IconButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0';

  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    danger: 'hover:bg-red-100 text-red-600',
    warning: 'hover:bg-yellow-100 text-yellow-600',
    ghost: 'hover:bg-gray-100 text-gray-600',
  };

  const sizeClasses = {
    sm: isRound ? 'w-5 h-5' : 'p-1',
    md: isRound ? 'w-6 h-6' : 'p-1',
  };

  const roundClasses = isRound ? 'rounded-full' : 'rounded';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundClasses} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
