/**
 * Loading Component
 * Spinners and skeleton loaders
 */

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// Spinner Loader
export const Spinner = ({ size = 'default', className }) => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <svg
      className={cn('animate-spin text-emerald-600', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Full Page Loader
export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="xl" />
      <p className="mt-4 text-neutral-600">{message}</p>
    </div>
  );
};

// Skeleton Loader
export const Skeleton = ({ className, ...props }) => {
  return (
    <motion.div
      className={cn('bg-neutral-200 rounded animate-pulse', className)}
      {...props}
    />
  );
};

// Skeleton variants
export const SkeletonText = ({ lines = 3, className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 && 'w-2/3')}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className }) => {
  return (
    <div className={cn('p-6 border border-neutral-200 rounded-xl', className)}>
      <div className="flex items-start space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 5, columns = 4, className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-10 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

// Button Loading State
export const ButtonLoader = ({ text = 'Loading...', className }) => {
  return (
    <span className={cn('flex items-center', className)}>
      <Spinner size="sm" className="mr-2" />
      {text}
    </span>
  );
};

const Loading = {
  Spinner,
  PageLoader,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  ButtonLoader,
};

export default Loading;
