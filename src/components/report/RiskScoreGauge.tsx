/**
 * Risk Score Gauge Component - BRUTALIST CIVIC AUTHORITY
 *
 * Animated semi-circular gauge displaying the risk score (0-100)
 * with high contrast brutalist design.
 *
 * Accessibility:
 * - aria-label with current score and risk level
 * - Respects prefers-reduced-motion
 * - Screen reader friendly text alternative
 *
 * Design decisions:
 * - Bold, stark design with heavy typography
 * - High contrast ink/cream color scheme
 * - Animated needle respects prefers-reduced-motion
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getRiskLevel, RISK_LEVELS } from '@/lib/constants';

interface RiskScoreGaugeProps {
  /** Risk score from 0-100 */
  score: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show risk level label below gauge */
  showLabel?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const SIZES = {
  sm: { width: 180, strokeWidth: 14, fontSize: 'text-3xl' },
  md: { width: 260, strokeWidth: 18, fontSize: 'text-5xl' },
  lg: { width: 340, strokeWidth: 22, fontSize: 'text-6xl' },
};

function getGaugeColor(score: number): string {
  if (score <= 25) return 'var(--success)';
  if (score <= 50) return 'var(--caution)';
  if (score <= 75) return 'var(--danger)';
  return 'var(--danger)';
}

export function RiskScoreGauge({
  score,
  size = 'md',
  showLabel = true,
  className,
}: RiskScoreGaugeProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayScore, setDisplayScore] = useState(0);

  const { width, strokeWidth, fontSize } = SIZES[size];
  const height = width * 0.6;
  const radius = (width - strokeWidth) / 2;
  const circumference = Math.PI * radius;

  // Animate the score number
  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayScore(score);
      return;
    }

    const duration = 1000;
    const startTime = Date.now();
    const startScore = displayScore;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(startScore + (score - startScore) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score, shouldReduceMotion]);

  const riskLevel = getRiskLevel(score);
  const color = getGaugeColor(score);
  const riskInfo = RISK_LEVELS[riskLevel];

  return (
    <div
      className={cn('flex flex-col items-center', className)}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Risk score: ${score} out of 100. ${riskInfo.label} risk level.`}
    >
      {/* Brutalist frame */}
      <div className="relative p-4 bg-[var(--surface)] border-2 border-[var(--ink)]">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden="true"
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${height - strokeWidth / 2} A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${height - strokeWidth / 2}`}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth={strokeWidth}
            strokeLinecap="square"
          />

          {/* Colored arc - animated fill based on score */}
          <motion.path
            d={`M ${strokeWidth / 2} ${height - strokeWidth / 2} A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${height - strokeWidth / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="square"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference - (score / 100) * circumference,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 1,
              ease: 'easeOut',
            }}
          />

          {/* Tick marks at 0, 25, 50, 75, 100 - Brutalist style */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const tickAngle = ((tick / 100) * 180 - 90) * (Math.PI / 180);
            const innerRadius = radius - strokeWidth / 2 - 6;
            const outerRadius = radius - strokeWidth / 2 - 16;
            const x1 = width / 2 + Math.cos(tickAngle) * innerRadius;
            const y1 = height - strokeWidth / 2 + Math.sin(tickAngle) * innerRadius;
            const x2 = width / 2 + Math.cos(tickAngle) * outerRadius;
            const y2 = height - strokeWidth / 2 + Math.sin(tickAngle) * outerRadius;

            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--ink)"
                strokeWidth={3}
              />
            );
          })}

          {/* Score display in center - Bebas Neue style */}
          <text
            x={width / 2}
            y={height - strokeWidth - 8}
            textAnchor="middle"
            className={cn(fontSize, 'font-display tabular-nums')}
            fill="var(--ink)"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {displayScore}
          </text>

          {/* Label "RISK SCORE" */}
          <text
            x={width / 2}
            y={height - strokeWidth + 16}
            textAnchor="middle"
            className="text-xs font-mono uppercase tracking-widest"
            fill="var(--text-muted)"
          >
            RISK SCORE
          </text>
        </svg>
      </div>

      {/* Screen reader text - always available */}
      <span className="sr-only">
        Risk score is {score} out of 100, indicating {riskInfo.label.toLowerCase()} risk.
        {riskInfo.description}
      </span>

      {showLabel && (
        <div className="mt-4 text-center">
          <span
            className="text-mono text-sm font-bold px-4 py-2 uppercase tracking-widest inline-block border-2"
            style={{
              backgroundColor: riskInfo.bgColor,
              color: riskInfo.color,
              borderColor: riskInfo.color,
            }}
          >
            {riskInfo.label} RISK
          </span>
          <p className="text-sm text-[var(--text-secondary)] mt-3 max-w-[220px] leading-relaxed">
            {riskInfo.description}
          </p>
        </div>
      )}
    </div>
  );
}
