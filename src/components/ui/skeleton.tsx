/**
 * Skeleton loading component
 *
 * Use instead of returning null during loading states.
 * Provides visual placeholder while content loads.
 *
 * The shimmer animation is disabled when user has prefers-reduced-motion set.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width of skeleton - defaults to full width */
  width?: string | number;
  /** Height of skeleton */
  height?: string | number;
}

function Skeleton({
  className,
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        // Use the skeleton class from globals.css which has the shimmer animation
        'skeleton',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Pre-built skeleton components for common use cases
 */

function SkeletonText({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn('h-4 w-full', className)}
      {...props}
    />
  );
}

function SkeletonHeading({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn('h-8 w-3/4', className)}
      {...props}
    />
  );
}

function SkeletonButton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn('h-11 w-32 rounded-lg', className)}
      {...props}
    />
  );
}

function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6', className)}
      {...props}
    >
      <SkeletonHeading className="mb-4" />
      <div className="space-y-2">
        <SkeletonText />
        <SkeletonText className="w-5/6" />
        <SkeletonText className="w-4/6" />
      </div>
    </div>
  );
}

function SkeletonInput({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn('h-11 w-full rounded-lg', className)}
      {...props}
    />
  );
}

/**
 * Form field skeleton with label placeholder
 */
function SkeletonFormField({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      <Skeleton className="h-4 w-24" />
      <SkeletonInput />
    </div>
  );
}

export {
  Skeleton,
  SkeletonText,
  SkeletonHeading,
  SkeletonButton,
  SkeletonCard,
  SkeletonInput,
  SkeletonFormField,
};
