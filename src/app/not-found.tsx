/**
 * 404 Not Found Page - "Northern Authority" Design
 *
 * Displayed when a user navigates to a non-existent route.
 * Provides clear navigation back to the main application.
 *
 * Design elements:
 * - Dramatic hero entrance animation
 * - Decorative gradient orbs
 * - Bold typography
 */

import Link from 'next/link';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div
        className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-[var(--primary-100)] blur-3xl opacity-50"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 left-[10%] w-48 h-48 rounded-full bg-[var(--accent-gold-light)] blur-3xl opacity-40"
        aria-hidden="true"
      />

      <div className="relative text-center max-w-md stagger-children">
        {/* Logo with glow effect */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="p-5 bg-[var(--primary-100)] rounded-2xl shadow-lg">
              <Shield className="h-14 w-14 text-[var(--primary-700)]" aria-hidden="true" />
            </div>
            <div
              className="absolute inset-0 bg-[var(--primary-500)] blur-2xl opacity-20"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Error code */}
        <p className="text-[var(--primary-600)] font-semibold text-sm uppercase tracking-wider mb-3">
          Error 404
        </p>

        {/* Error Message */}
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-[var(--text-primary)] mb-5 leading-tight">
          Page Not Found
        </h1>
        <p className="text-[var(--text-secondary)] mb-10 leading-relaxed text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="h-4 w-4" aria-hidden="true" />
              Go to Homepage
            </Button>
          </Link>
          <Link href="/business-profile">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Start Assessment
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-sm text-[var(--text-muted)] mt-14 pt-8 border-t border-[var(--border-subtle)]">
          If you think this is an error, please{' '}
          <a
            href="mailto:support@example.com"
            className="text-[var(--primary-700)] font-medium underline underline-offset-2 hover:text-[var(--primary-600)] transition-colors duration-150"
          >
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
}
