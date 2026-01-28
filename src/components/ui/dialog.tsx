/**
 * Dialog component built on Radix UI Dialog
 *
 * Provides accessible modal dialogs with:
 * - Focus trap
 * - Escape key to close
 * - Click outside to close (optional)
 * - aria-labelledby and aria-describedby
 *
 * Use for:
 * - Unsaved changes warnings
 * - Confirmation dialogs
 * - Form modals
 */

'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%]',
        'gap-4 border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg rounded-lg',
        'duration-200',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className={cn(
          'absolute right-4 top-4 rounded-sm opacity-70',
          'transition-opacity duration-150 ease-out',
          'hover:opacity-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2',
          'disabled:pointer-events-none'
        )}
        aria-label="Close dialog"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'font-display text-lg leading-none tracking-tight text-[var(--text-primary)]',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-[var(--text-secondary)]', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

/**
 * Pre-built confirmation dialog for common use cases like unsaved changes
 */
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'danger';
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            type="button"
            onClick={handleCancel}
            className={cn(
              'inline-flex items-center justify-center h-10 px-4 rounded-lg text-sm font-medium',
              'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)]',
              'transition-[color,background-color,border-color] duration-150 ease-out',
              'hover:bg-[var(--surface-secondary)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2'
            )}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={cn(
              'inline-flex items-center justify-center h-10 px-4 rounded-lg text-sm font-medium',
              'transition-[color,background-color] duration-150 ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              variant === 'danger'
                ? 'bg-[var(--error)] text-white hover:bg-[#a82828] focus-visible:ring-[var(--error)]'
                : 'bg-[var(--primary-900)] text-[var(--text-inverse)] hover:bg-[var(--primary-700)] focus-visible:ring-[var(--primary-500)]'
            )}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook for unsaved changes warning
 *
 * Usage:
 * const { showWarning, WarningDialog, handleNavigation } = useUnsavedChangesWarning(hasUnsavedChanges);
 *
 * // Before navigation:
 * handleNavigation(() => router.push('/next-page'));
 *
 * // In your component:
 * <WarningDialog />
 */
function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  const [showWarning, setShowWarning] = React.useState(false);
  const [pendingNavigation, setPendingNavigation] = React.useState<(() => void) | null>(null);

  const handleNavigation = React.useCallback(
    (navigateFn: () => void) => {
      if (hasUnsavedChanges) {
        setPendingNavigation(() => navigateFn);
        setShowWarning(true);
      } else {
        navigateFn();
      }
    },
    [hasUnsavedChanges]
  );

  const handleConfirm = React.useCallback(() => {
    pendingNavigation?.();
    setPendingNavigation(null);
  }, [pendingNavigation]);

  const handleCancel = React.useCallback(() => {
    setPendingNavigation(null);
  }, []);

  const WarningDialog = React.useCallback(
    () => (
      <ConfirmDialog
        open={showWarning}
        onOpenChange={setShowWarning}
        title="Unsaved changes"
        description="You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
        confirmLabel="Leave anyway"
        cancelLabel="Stay on page"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        variant="danger"
      />
    ),
    [showWarning, handleConfirm, handleCancel]
  );

  // Warn on browser navigation (back button, closing tab)
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        // Modern browsers ignore custom messages, but this triggers the default warning
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return {
    showWarning,
    setShowWarning,
    handleNavigation,
    WarningDialog,
  };
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  ConfirmDialog,
  useUnsavedChangesWarning,
};
