interface SkeletonProps {
  className?: string;
  count?: number;
  variant?: 'text' | 'circle' | 'rect' | 'card';
}

export function Skeleton({
  className = '',
  count = 1,
  variant = 'text',
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circle: 'w-12 h-12 rounded-full',
    rect: 'h-32 rounded-lg',
    card: 'h-64 rounded-xl',
  };

  const baseClass = `${variantClasses[variant]} bg-gray-100 animate-shimmer ${className}`;

  if (count === 1) {
    return <div className={baseClass} />;
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={baseClass} />
      ))}
    </div>
  );
}
