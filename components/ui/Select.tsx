import { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  helper,
  options,
  placeholder = 'Select an option',
  className = '',
  ...props
}: SelectProps) {
  const baseStyles = `w-full px-4 py-3 rounded-lg transition-all duration-300 font-sans text-base appearance-none bg-white text-midnight-950
    focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent
    border-2 border-gray-200 hover:border-gray-300
    disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
    cursor-pointer
    ${error ? 'border-red-500 focus:ring-red-500' : ''}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-midnight-950 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`${baseStyles} ${className} pr-10`}
          {...props}
        >
          <option value="">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
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
