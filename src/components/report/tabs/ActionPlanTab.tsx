/**
 * Action Plan Tab - BRUTALIST CIVIC AUTHORITY
 *
 * Displays a prioritized 30-60-90 day roadmap with
 * actionable items and progress tracking.
 * High contrast design with bold typography.
 */

'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActionItem } from '@/types';

interface ActionPlanTabProps {
  actionItems: ActionItem[];
}

const PRIORITY_CONFIG = {
  CRITICAL: {
    color: 'var(--danger)',
    bgColor: 'var(--danger-bg)',
    label: 'Critical',
  },
  HIGH: {
    color: 'var(--danger)',
    bgColor: 'var(--danger-bg)',
    label: 'High',
  },
  MEDIUM: {
    color: 'var(--caution)',
    bgColor: 'var(--caution-bg)',
    label: 'Medium',
  },
  LOW: {
    color: 'var(--success)',
    bgColor: 'var(--success-bg)',
    label: 'Low',
  },
};

const TIMELINE_CONFIG = {
  '30_DAYS': { label: '30 Days', order: 1 },
  '60_DAYS': { label: '60 Days', order: 2 },
  '90_DAYS': { label: '90 Days', order: 3 },
};

function ActionItemCard({
  item,
  onToggle,
}: {
  item: ActionItem;
  onToggle: (id: string) => void;
}) {
  const priorityConfig = PRIORITY_CONFIG[item.priority];

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 border-2 border-[var(--ink)] transition-colors duration-100',
        item.completed
          ? 'bg-[var(--cream)] opacity-60'
          : 'bg-[var(--surface)]'
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        className="flex-shrink-0 mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {item.completed ? (
          <CheckCircle2
            className="h-6 w-6 text-[var(--success)]"
            aria-hidden="true"
          />
        ) : (
          <Circle
            className="h-6 w-6 text-[var(--text-muted)]"
            aria-hidden="true"
          />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h4
            className={cn(
              'text-display text-base text-[var(--ink)]',
              item.completed && 'line-through'
            )}
          >
            {item.title}
          </h4>
          <span
            className="text-mono text-xs font-bold px-2 py-1 uppercase tracking-wider border-2"
            style={{
              backgroundColor: priorityConfig.bgColor,
              color: priorityConfig.color,
              borderColor: priorityConfig.color,
            }}
          >
            {priorityConfig.label}
          </span>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
        <div className="flex items-center gap-4 mt-3 text-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Flag className="h-3 w-3" aria-hidden="true" />
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ActionPlanTab({ actionItems }: ActionPlanTabProps) {
  const [items, setItems] = useState(actionItems);

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Group items by timeline
  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.timeline]) {
        acc[item.timeline] = [];
      }
      acc[item.timeline].push(item);
      return acc;
    },
    {} as Record<string, ActionItem[]>
  );

  // Sort timelines
  const sortedTimelines = Object.keys(groupedItems).sort(
    (a, b) =>
      TIMELINE_CONFIG[a as keyof typeof TIMELINE_CONFIG].order -
      TIMELINE_CONFIG[b as keyof typeof TIMELINE_CONFIG].order
  );

  return (
    <div className="space-y-6">
      {/* Progress Overview - Brutalist card */}
      <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
        <div className="p-4 border-b-2 border-[var(--ink)] bg-[var(--ink)]">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-[var(--cream)]" aria-hidden="true" />
            <h3 className="text-display text-lg text-[var(--cream)]">Action Plan Progress</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-mono text-sm uppercase tracking-wider text-[var(--text-secondary)]">
                {completedCount} of {totalCount} actions completed
              </span>
              <span className="text-display text-2xl tabular-nums text-[var(--ink)]">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="h-4 bg-[var(--border-strong)] overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] transition-transform duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Groups */}
      {sortedTimelines.map((timeline) => {
        const timelineConfig = TIMELINE_CONFIG[timeline as keyof typeof TIMELINE_CONFIG];
        const timelineItems = groupedItems[timeline];
        const timelineCompleted = timelineItems.filter((i) => i.completed).length;

        return (
          <div key={timeline} className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
            <div className="p-4 border-b-2 border-[var(--ink)] flex items-center justify-between">
              <h3 className="text-display text-lg text-[var(--ink)]">{timelineConfig.label}</h3>
              <span className="text-mono text-sm text-[var(--text-muted)]">
                {timelineCompleted} / {timelineItems.length}
              </span>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {timelineItems
                  .sort((a, b) => {
                    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                  })
                  .map((item) => (
                    <ActionItemCard
                      key={item.id}
                      item={item}
                      onToggle={handleToggle}
                    />
                  ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
