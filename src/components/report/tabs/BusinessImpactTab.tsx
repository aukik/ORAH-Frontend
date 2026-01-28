/**
 * Business Impact Tab - BRUTALIST CIVIC AUTHORITY
 *
 * Displays financial exposure estimates, insurance gaps,
 * and operational risks related to AI usage.
 * High contrast design with bold typography.
 */

'use client';

import { DollarSign, Shield, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { BusinessImpact } from '@/types';

interface BusinessImpactTabProps {
  impact: BusinessImpact;
}

export function BusinessImpactTab({ impact }: BusinessImpactTabProps) {
  return (
    <div className="space-y-6">
      {/* Financial Exposure */}
      <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
        <div className="p-4 border-b-2 border-[var(--ink)] bg-[var(--ink)]">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-[var(--cream)]" aria-hidden="true" />
            <div>
              <h3 className="text-display text-lg text-[var(--cream)]">Financial Exposure</h3>
              <p className="text-sm text-[var(--cream)]/70">
                Potential penalties and financial risks from non-compliance
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-[var(--cream)] border-2 border-[var(--ink)]">
              <p className="text-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">
                PIPEDA Max Penalty
              </p>
              <p className="text-display text-3xl text-[var(--danger)] tabular-nums">
                {formatCurrency(impact.financialExposure.pipedalMaxPenalty)}
              </p>
              <p className="text-mono text-xs text-[var(--text-muted)] mt-2 uppercase tracking-wider">
                Per violation
              </p>
            </div>

            <div className="text-center p-6 bg-[var(--cream)] border-2 border-[var(--ink)]">
              <p className="text-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">
                Provincial Max Penalty
              </p>
              <p className="text-display text-3xl text-[var(--danger)] tabular-nums">
                {formatCurrency(impact.financialExposure.provincialMaxPenalty)}
              </p>
              <p className="text-mono text-xs text-[var(--text-muted)] mt-2 uppercase tracking-wider">
                Based on your province
              </p>
            </div>

            <div className="text-center p-6 bg-[var(--cream)] border-2 border-[var(--ink)]">
              <p className="text-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">
                Reputational Risk
              </p>
              <p className="text-display text-3xl text-[var(--caution)]">
                {impact.financialExposure.reputationalRisk}
              </p>
              <p className="text-mono text-xs text-[var(--text-muted)] mt-2 uppercase tracking-wider">
                Based on industry
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Gaps */}
      <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
        <div className="p-4 border-b-2 border-[var(--ink)]">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-[var(--ink)]" aria-hidden="true" />
            <div>
              <h3 className="text-display text-lg text-[var(--ink)]">Insurance Coverage Gaps</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Potential gaps in your current insurance coverage related to AI
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {impact.insuranceGaps.length > 0 ? (
            <ul className="space-y-3">
              {impact.insuranceGaps.map((gap, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 p-4 bg-[var(--caution-bg)] border-2 border-[var(--caution)]"
                >
                  <AlertTriangle
                    className="h-5 w-5 text-[var(--caution)] flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-[var(--text-primary)]">{gap}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              No significant insurance gaps identified based on current AI usage.
            </p>
          )}
        </div>
      </div>

      {/* Operational Risks */}
      <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
        <div className="p-4 border-b-2 border-[var(--ink)]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-[var(--ink)]" aria-hidden="true" />
            <div>
              <h3 className="text-display text-lg text-[var(--ink)]">Operational Risks</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Day-to-day risks from current AI practices
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {impact.operationalRisks.length > 0 ? (
            <ul className="space-y-3">
              {impact.operationalRisks.map((risk, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 p-4 border-2 border-[var(--ink)] bg-[var(--cream)]"
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-[var(--ink)] text-[var(--cream)] flex items-center justify-center text-mono font-bold">
                    {index + 1}
                  </span>
                  <p className="text-sm text-[var(--text-secondary)] pt-1">
                    {risk}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              No significant operational risks identified.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
