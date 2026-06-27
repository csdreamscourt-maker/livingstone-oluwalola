import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  icon?: boolean;
}

export function Alert({
  type = 'info',
  title,
  children,
  onClose,
  icon = true,
}: AlertProps) {
  const styles = {
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      text: 'text-blue-800',
      close: 'hover:bg-blue-100',
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200',
      icon: 'text-emerald-600',
      title: 'text-emerald-900',
      text: 'text-emerald-800',
      close: 'hover:bg-emerald-100',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      icon: 'text-amber-600',
      title: 'text-amber-900',
      text: 'text-amber-800',
      close: 'hover:bg-amber-100',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      text: 'text-red-800',
      close: 'hover:bg-red-100',
    },
  };

  const style = styles[type];

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const Icon = icons[type];

  return (
    <div className={`${style.bg} border border-current rounded-lg p-4 flex gap-4 animate-slideUp`}>
      {icon && (
        <Icon className={`${style.icon} w-5 h-5 flex-shrink-0 mt-0.5`} />
      )}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={`${style.title} font-semibold mb-1`}>
            {title}
          </h3>
        )}
        <div className={`${style.text} text-sm`}>
          {children}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${style.close} p-1 rounded transition-colors duration-200 flex-shrink-0`}
          aria-label="Close alert"
        >
          <X className={`${style.icon} w-5 h-5`} />
        </button>
      )}
    </div>
  );
}
