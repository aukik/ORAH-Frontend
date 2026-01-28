/**
 * Data Risk Assessment Tab - BRUTALIST CIVIC AUTHORITY
 *
 * Displays data flow analysis and exposure assessment
 * for each type of data processed by AI tools.
 * High contrast design with bold typography.
 */

'use client';

import { Database, Globe, AlertTriangle } from 'lucide-react';
import { getRiskLevel, RISK_LEVELS, DATA_TYPES } from '@/lib/constants';
import type { DataRiskAssessment, DataType } from '@/types';

interface DataRiskTabProps {
  assessment: DataRiskAssessment;
}

function getDataTypeLabel(dataType: DataType): string {
  const found = DATA_TYPES.find((d) => d.value === dataType);
  return found?.label || dataType;
}

export function DataRiskTab({ assessment }: DataRiskTabProps) {
  return (
    <div className="space-y-6">
      {/* Data Flows */}
      <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
        <div className="p-4 border-b-2 border-[var(--ink)] bg-[var(--ink)]">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-[var(--cream)]" aria-hidden="true" />
            <h3 className="text-display text-lg text-[var(--cream)]">Data Flow Analysis</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {assessment.dataFlows.map((flow, index) => {
              const riskConfig = RISK_LEVELS[flow.riskLevel];
              return (
                <div
                  key={index}
                  className="p-4 border-2 border-[var(--ink)] bg-[var(--cream)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-display text-base text-[var(--ink)]">
                          {getDataTypeLabel(flow.dataType)}
                        </h4>
                        <span
                          className="text-mono text-xs font-bold px-2 py-1 uppercase tracking-wider border-2"
                          style={{
                            backgroundColor: riskConfig.bgColor,
                            color: riskConfig.color,
                            borderColor: riskConfig.color,
                          }}
                        >
                          {flow.riskLevel}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
                        <span>
                          <span className="text-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">Tools: </span>
                          {flow.tools.join(', ')}
                        </span>
                        {flow.crossBorder && (
                          <span className="flex items-center gap-1 text-[var(--caution)] bg-[var(--caution-bg)] px-2 py-1 border border-[var(--caution)]">
                            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="text-mono text-xs uppercase">Cross-border</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exposure Analysis */}
      <div className="bg-[var(--surface)] border-2 border-[var(--ink)] shadow-brutal">
        <div className="p-4 border-b-2 border-[var(--ink)]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-[var(--ink)]" aria-hidden="true" />
            <h3 className="text-display text-lg text-[var(--ink)]">Exposure Analysis</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {assessment.exposureAnalysis.map((analysis, index) => {
              const riskLevel = getRiskLevel(analysis.score);
              const riskConfig = RISK_LEVELS[riskLevel];

              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-display text-base text-[var(--ink)]">
                      {getDataTypeLabel(analysis.dataType)}
                    </span>
                    <span
                      className="text-mono text-sm font-bold tabular-nums"
                      style={{ color: riskConfig.color }}
                    >
                      {analysis.score}/100
                    </span>
                  </div>

                  {/* Progress bar - Brutalist style */}
                  <div className="h-4 bg-[var(--border-strong)] overflow-hidden">
                    <div
                      className="h-full transition-transform duration-500"
                      style={{
                        width: `${analysis.score}%`,
                        backgroundColor: riskConfig.color,
                      }}
                    />
                  </div>

                  {/* Concerns */}
                  {analysis.concerns.length > 0 && (
                    <ul className="space-y-2 mt-3">
                      {analysis.concerns.map((concern, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"
                        >
                          <span
                            className="flex-shrink-0 w-2 h-2 mt-2"
                            style={{ backgroundColor: riskConfig.color }}
                            aria-hidden="true"
                          />
                          {concern}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
