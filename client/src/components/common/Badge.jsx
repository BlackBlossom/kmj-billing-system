/**
 * Badge Component
 * Status and priority badges
 */

import { cn } from '../../lib/utils';
import { getStatusColor, getPriorityColor } from '../../lib/utils';

const Badge = ({
  children,
  variant = 'default',
  size = 'default',
  status,
  priority,
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-emerald-100 text-emerald-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  // Use status or priority color if provided
  let colorClass = variants[variant];
  if (status) {
    colorClass = getStatusColor(status);
  } else if (priority) {
    colorClass = getPriorityColor(priority);
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        colorClass,
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Dot variant for inline status
export const BadgeDot = ({ variant = 'default', className }) => {
  const colors = {
    default: 'bg-neutral-400',
    primary: 'bg-emerald-600',
    success: 'bg-green-600',
    warning: 'bg-amber-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };

  return (
    <span
      className={cn(
        'inline-block h-2 w-2 rounded-full',
        colors[variant],
        className
      )}
    />
  );
};

export default Badge;
