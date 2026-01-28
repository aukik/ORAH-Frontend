/**
 * Executive Summary Tab - BRUTALIST CIVIC AUTHORITY
 *
 * Displays the risk score gauge, top risks, quick wins,
 * and contextual information about the business.
 * High contrast design with bold typography.
 */

'use client';

import { AlertTriangle, CheckCircle, Building, MapPin } from 'lucide-react';
import { RiskScoreGauge } from '../RiskScoreGauge';
import type { ExecutiveSummary } from '@/types';

interface ExecutiveSummaryTabProps {
  summary: ExecutiveSummary;
}

export function ExecutiveSummaryTab({ summary }: ExecutiveSummaryTabProps) {
  return (
    <div className="space-y-6">
      {/* Risk Score Section - Brutalist card */}
      <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal p-6">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <RiskScoreGauge score={summary.riskScore} size="lg" />

          <div className="flex-1 space-y-4 w-full">
            <h3 className="text-display text-xl text-[var(--ink)]">
              Risk Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(summary.riskBreakdown).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-mono font-bold tabular-nums text-[var(--ink)]">
                        {value}
                      </span>
                    </div>
                    <div className="h-3 bg-[var(--border-strong)] overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent)] transition-transform duration-500"
                        style={{ width: `${Math.min(value * 3.33, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Context Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[var(--ink)] flex items-center justify-center">
              <Building className="h-5 w-5 text-[var(--cream)]" aria-hidden="true" />
            </div>
            <h3 className="text-display text-lg text-[var(--ink)]">Industry Context</h3>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {summary.industryContext}
          </p>
        </div>

        <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[var(--ink)] flex items-center justify-center">
              <MapPin className="h-5 w-5 text-[var(--cream)]" aria-hidden="true" />
            </div>
            <h3 className="text-display text-lg text-[var(--ink)]">Provincial Context</h3>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {summary.provincialContext}
          </p>
        </div>
      </div>

      {/* Top Risks and Quick Wins */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Risks */}
        <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
          <div className="p-4 border-b-2 border-[var(--ink)] bg-[var(--danger-bg)]">
            <div className="flex items-center gap-3">
              <AlertTriangle
                className="h-5 w-5 text-[var(--danger)]"
                aria-hidden="true"
              />
              <h3 className="text-display text-lg text-[var(--ink)]">Top 3 Risks</h3>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {summary.topRisks.map((risk, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[var(--danger)] text-white flex items-center justify-center text-mono font-bold">
                    {index + 1}
                  </span>
                  <p className="text-[var(--text-secondary)] pt-1 leading-relaxed">
                    {risk}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Wins */}
        <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
          <div className="p-4 border-b-2 border-[var(--ink)] bg-[var(--success-bg)]">
            <div className="flex items-center gap-3">
              <CheckCircle
                className="h-5 w-5 text-[var(--success)]"
                aria-hidden="true"
              />
              <h3 className="text-display text-lg text-[var(--ink)]">Quick Wins</h3>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {summary.quickWins.map((win, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[var(--success)] text-white flex items-center justify-center text-mono font-bold">
                    {index + 1}
                  </span>
                  <p className="text-[var(--text-secondary)] pt-1 leading-relaxed">
                    {win}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
