/**
 * Tabs component built on Radix UI Tabs
 *
 * Provides accessible tabbed content navigation with:
 * - Keyboard navigation (arrow keys)
 * - URL sync support via onValueChange callback
 * - Proper aria-selected states
 *
 * Usage with URL sync:
 * const [tab, setTab] = useState(searchParams.get('tab') || 'overview');
 * <Tabs value={tab} onValueChange={(v) => {
 *   setTab(v);
 *   router.push(`?tab=${v}`, { scroll: false });
 * }}>
 */

'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-12 items-center justify-start gap-1 rounded-lg bg-[var(--surface-secondary)] p-1 text-[var(--text-secondary)]',
      className
    )}
    // Keyboard navigation is handled by Radix - arrow keys work out of the box
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium',
      // Explicit transition - not 'all'
      'transition-[color,background-color,box-shadow] duration-150 ease-out',
      // Focus state
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2',
      // Disabled state
      'disabled:pointer-events-none disabled:opacity-50',
      // Active state
      'data-[state=active]:bg-[var(--surface)] data-[state=active]:text-[var(--text-primary)] data-[state=active]:shadow-sm',
      // Hover
      'hover:text-[var(--text-primary)]',
      className
    )}
    // aria-selected is handled by Radix
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2',
      // Fade in animation for tab content
      'data-[state=active]:animate-fade-in-up',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
