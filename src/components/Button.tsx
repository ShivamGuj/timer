import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  icon,
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    success: 'bg-green-50 text-green-600 hover:bg-green-100',
  };

  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
    icon: 'p-2 rounded-full',
  };

  const baseClasses = 'font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {icon && size === 'icon' ? icon : (
        <div className='flex items-center'>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </div>
      )}
    </button>
  );
};
