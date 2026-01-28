/**
 * Compliance Status Badge Component - BRUTALIST CIVIC AUTHORITY
 *
 * Displays compliance status with shield icon and color coding.
 * High contrast design with bold typography.
 */

'use client';

import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

type ComplianceStatus = 'compliant' | 'non_compliant' | 'partial' | 'unknown';

interface ComplianceStatusBadgeProps {
  status: ComplianceStatus;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<
  ComplianceStatus,
  {
    icon: typeof Shield;
    color: string;
    bgColor: string;
    borderColor: string;
    text: string;
  }
> = {
  compliant: {
    icon: ShieldCheck,
    color: 'var(--success)',
    bgColor: 'var(--success-bg)',
    borderColor: 'var(--success)',
    text: 'Compliant',
  },
  non_compliant: {
    icon: ShieldAlert,
    color: 'var(--danger)',
    bgColor: 'var(--danger-bg)',
    borderColor: 'var(--danger)',
    text: 'Non-Compliant',
  },
  partial: {
    icon: Shield,
    color: 'var(--caution)',
    bgColor: 'var(--caution-bg)',
    borderColor: 'var(--caution)',
    text: 'Partial',
  },
  unknown: {
    icon: ShieldQuestion,
    color: 'var(--text-muted)',
    bgColor: 'var(--cream)',
    borderColor: 'var(--border)',
    text: 'Unknown',
  },
};

const SIZES = {
  sm: { iconSize: 14, textSize: 'text-xs', padding: 'px-2 py-1' },
  md: { iconSize: 16, textSize: 'text-sm', padding: 'px-3 py-1.5' },
  lg: { iconSize: 20, textSize: 'text-base', padding: 'px-4 py-2' },
};

export function ComplianceStatusBadge({
  status,
  label,
  size = 'md',
  showIcon = true,
  className,
}: ComplianceStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZES[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 font-mono font-bold uppercase tracking-wider border-2',
        sizeConfig.padding,
        sizeConfig.textSize,
        className
      )}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        borderColor: config.borderColor,
      }}
    >
      {showIcon && (
        <Icon
          size={sizeConfig.iconSize}
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </div>
  );
}

/**
 * Inline compliance indicator for lists and tables
 * Brutalist style - square, no border-radius
 */
interface ComplianceIndicatorProps {
  compliant: boolean;
  className?: string;
}

export function ComplianceIndicator({
  compliant,
  className,
}: ComplianceIndicatorProps) {
  return (
    <span
      className={cn(
        'inline-flex h-3 w-3',
        compliant ? 'bg-[var(--success)]' : 'bg-[var(--danger)]',
        className
      )}
      aria-label={compliant ? 'Compliant' : 'Non-compliant'}
    />
  );
}
