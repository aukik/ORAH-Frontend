/**
 * Report Tabs Component - BRUTALIST CIVIC AUTHORITY
 *
 * 6-tab interface for the risk assessment report.
 * High contrast brutalist design with bold typography.
 *
 * Features:
 * - URL sync via query parameter (?tab=...)
 * - Keyboard navigation (arrow keys handled by Radix)
 * - Proper aria-selected states
 */

'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  FileText,
  Scale,
  Database,
  TrendingDown,
  MessageSquare,
  ListChecks,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Report } from '@/types';

import { ExecutiveSummaryTab } from './tabs/ExecutiveSummaryTab';
import { LegalComplianceTab } from './tabs/LegalComplianceTab';
import { DataRiskTab } from './tabs/DataRiskTab';
import { BusinessImpactTab } from './tabs/BusinessImpactTab';
import { CommunicationTemplatesTab } from './tabs/CommunicationTemplatesTab';
import { ActionPlanTab } from './tabs/ActionPlanTab';

interface ReportTabsProps {
  report: Report;
  className?: string;
}

const TABS = [
  {
    id: 'summary',
    label: 'Executive Summary',
    icon: FileText,
    shortLabel: 'Summary',
  },
  {
    id: 'legal',
    label: 'Legal Compliance',
    icon: Scale,
    shortLabel: 'Legal',
  },
  {
    id: 'data',
    label: 'Data Risk Assessment',
    icon: Database,
    shortLabel: 'Data',
  },
  {
    id: 'impact',
    label: 'Business Impact',
    icon: TrendingDown,
    shortLabel: 'Impact',
  },
  {
    id: 'templates',
    label: 'Communication Templates',
    icon: MessageSquare,
    shortLabel: 'Templates',
  },
  {
    id: 'actions',
    label: 'Action Plan',
    icon: ListChecks,
    shortLabel: 'Actions',
  },
] as const;

type TabId = typeof TABS[number]['id'];

const DEFAULT_TAB: TabId = 'summary';

function isValidTab(tab: string | null): tab is TabId {
  if (!tab) return false;
  return TABS.some((t) => t.id === tab);
}

export function ReportTabs({ report, className }: ReportTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get initial tab from URL or default
  const initialTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<TabId>(
    isValidTab(initialTab) ? initialTab : DEFAULT_TAB
  );

  // Sync URL with tab state on mount (in case URL had invalid tab)
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (!isValidTab(urlTab) && urlTab !== null) {
      // Invalid tab in URL, update to default
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', DEFAULT_TAB);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, []);

  // Handle tab change - update URL
  const handleTabChange = useCallback(
    (value: TabId) => {
      setActiveTab(value);

      // Update URL with new tab
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', value);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (currentIndex + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = TABS.length - 1;
    }

    if (newIndex !== currentIndex) {
      handleTabChange(TABS[newIndex].id);
      // Focus the new tab button
      const tabButtons = document.querySelectorAll('[role="tab"]');
      (tabButtons[newIndex] as HTMLElement)?.focus();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <ExecutiveSummaryTab summary={report.executiveSummary} />;
      case 'legal':
        return <LegalComplianceTab compliance={report.legalCompliance} />;
      case 'data':
        return <DataRiskTab assessment={report.dataRiskAssessment} />;
      case 'impact':
        return <BusinessImpactTab impact={report.businessImpact} />;
      case 'templates':
        return <CommunicationTemplatesTab templates={report.communicationTemplates} />;
      case 'actions':
        return <ActionPlanTab actionItems={report.actionPlan} />;
      default:
        return null;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Tab List - Brutalist style */}
      <div
        role="tablist"
        aria-label="Report sections"
        className="flex flex-wrap gap-1 p-1 bg-[var(--surface)] border-2 border-[var(--ink)] mb-6"
      >
        {TABS.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'flex items-center justify-center gap-2 flex-1 min-w-[100px] py-3 px-4',
                'text-mono text-sm font-semibold uppercase tracking-wider',
                'transition-colors duration-100',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
                isActive
                  ? 'bg-[var(--ink)] text-[var(--cream)]'
                  : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--ink)]'
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
      >
        {renderTabContent()}
      </div>
    </div>
  );
}
