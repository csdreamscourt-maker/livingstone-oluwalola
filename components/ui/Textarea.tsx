import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  maxLength?: number;
}

export function Textarea({
  label,
  error,
  helper,
  maxLength,
  className = '',
  ...props
}: TextareaProps) {
  const baseStyles = `w-full px-4 py-3 rounded-lg transition-all duration-300 font-sans text-base border-2 border-gray-200 bg-white text-midnight-950 placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent focus:bg-white
    hover:border-gray-300
    disabled:bg-gray-50 disabled:border-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
    resize-vertical min-h-[120px]
    ${error ? 'border-red-500 focus:ring-red-500' : ''}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-midnight-950 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          className={`${baseStyles} ${className}`}
          maxLength={maxLength}
          {...props}
        />
        {maxLength && (
          <div className="absolute bottom-2 right-3 text-xs text-gray-400">
            {(props.value as string)?.length || 0} / {maxLength}
          </div>
        )}
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
