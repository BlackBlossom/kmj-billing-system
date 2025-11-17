/**
 * Avatar Component
 * User avatar with initials fallback
 */

import { cn, getInitials, generateGradient } from '../../lib/utils';

const Avatar = ({
  src,
  alt,
  name,
  size = 'default',
  className,
  ...props
}) => {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    default: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-24 w-24 text-2xl',
  };

  const displayName = name || alt || 'User';
  const initials = getInitials(displayName);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        'rounded-full overflow-hidden',
        'font-medium text-white',
        'bg-[#31757A]', // Brand color background
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'User'}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

// Avatar Group Component
export const AvatarGroup = ({ children, max = 3, className }) => {
  const childrenArray = Array.isArray(children) ? children : [children];
  const displayChildren = childrenArray.slice(0, max);
  const remaining = childrenArray.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayChildren.map((child, index) => (
        <div
          key={index}
          className="ring-2 ring-white rounded-full"
        >
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className="flex items-center justify-center h-10 w-10 rounded-full bg-neutral-200 text-neutral-700 text-sm font-medium ring-2 ring-white"
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default Avatar;
