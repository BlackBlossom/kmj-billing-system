/**
 * Card Component
 * Shadcn/UI inspired card with variants
 */

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ANIMATION_VARIANTS } from '../../lib/constants';

const Card = ({
  children,
  className,
  padding = 'default',
  hover = false,
  gradient = false,
  onClick,
  ...props
}) => {
  const paddingVariants = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const Component = hover || onClick ? motion.div : 'div';
  
  const motionProps = hover || onClick
    ? {
        variants: ANIMATION_VARIANTS.scale,
        initial: 'hidden',
        animate: 'visible',
        whileHover: { scale: 1.02 },
        whileTap: onClick ? { scale: 0.98 } : undefined,
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-neutral-200 shadow-sm',
        'transition-shadow duration-200',
        hover && 'hover:shadow-md cursor-pointer',
        gradient &&
          'bg-linear-to-br from-white via-emerald-50/30 to-blue-50/30',
        paddingVariants[padding],
        onClick && 'cursor-pointer',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

const CardHeader = ({ children, className }) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

const CardTitle = ({ children, className }) => (
  <h3
    className={cn('text-xl font-semibold text-neutral-900', className)}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className }) => (
  <p className={cn('text-sm text-neutral-600 mt-1', className)}>
    {children}
  </p>
);

const CardContent = ({ children, className }) => (
  <div className={cn(className)}>{children}</div>
);

const CardFooter = ({ children, className }) => (
  <div className={cn('mt-4 flex items-center justify-end gap-2', className)}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
