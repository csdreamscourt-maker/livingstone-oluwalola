import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'minimal';
}

export function Input({
  label,
  error,
  helper,
  icon,
  variant = 'primary',
  className = '',
  ...props
}: InputProps) {
  const baseStyles = 'w-full px-4 py-2.5 md:py-2.5 rounded-md transition-colors duration-200 font-sans text-[15px] min-h-[44px] md:min-h-auto';

  const variants = {
    primary: `${baseStyles} border border-gray-200 bg-white text-midnight-950 placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500
      hover:border-gray-300
      disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
      ${error ? 'border-red-500 focus:ring-red-500/40' : ''}`,
    minimal: `${baseStyles} border-b border-gray-200 bg-transparent text-midnight-950 placeholder-gray-400
      focus:outline-none focus:border-gold-500 focus:bg-gray-50
      hover:border-gray-300
      disabled:border-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
      ${error ? 'border-b-red-500' : ''}`,
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-midnight-950 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`${variants[variant]} ${icon ? 'pl-12' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-2 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
}
