/**
 * Landing Page - BRUTALIST CIVIC AUTHORITY
 *
 * A bold, unforgettable landing page that commands attention.
 * Meticulous alignment and spacing throughout.
 */

'use client';

import Link from 'next/link';
import { ArrowRight, AlertTriangle, Shield, Clock, FileText, Globe, Zap, Upload, AlertCircle, DollarSign, CircleHelp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Button with hover tooltip - Uses React portal to render tooltip at body level
 * This bypasses parent clip-path restrictions and ensures tooltips always display
 *
 * Context: The hero section uses diagonal-cut class with clip-path that was clipping tooltips.
 * Approach: Portal rendering at document.body level completely bypasses all parent containers.
 * Trade-offs: Slightly more complex than inline rendering, but guaranteed to work regardless of parent styles.
 */
function ButtonWithTooltip({
  href,
  className,
  children,
  tooltipTitle,
  tooltipContent,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  tooltipTitle: string;
  tooltipContent: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle SSR - only render portal on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Use viewport coordinates for fixed positioning (no scrollY/scrollX needed)
      setPosition({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2 - 160, // Center tooltip (320px wide / 2)
      });
    }
  };

  const handleMouseEnter = () => {
    // Clear any pending hide timeout when re-entering
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    // Add 150ms delay before hiding to allow mouse movement to tooltip
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  // Tooltip element - rendered via portal at body level to bypass clip-path
  const tooltipElement = isVisible && isMounted ? (
    <div
      className="fixed w-80 p-4 bg-[var(--ink)] text-[var(--cream)] text-sm border-2 border-[var(--brand-secondary)] shadow-lg"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 999999,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--ink)] border-t-2 border-l-2 border-[var(--brand-secondary)] rotate-45" />
      <p className="font-medium mb-1">{tooltipTitle}</p>
      <p>{tooltipContent}</p>
    </div>
  ) : null;

  return (
    <>
      <div
        ref={containerRef}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link href={href} className={className}>
          {children}
        </Link>
      </div>
      {isMounted && createPortal(tooltipElement, document.body)}
    </>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Skip Link */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b-[3px] border-[var(--ink)] bg-[var(--surface)]">
        <div className="container-lg py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 focus-ring"
          >
            <div className="w-10 h-10 bg-[var(--ink)] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[var(--cream)]" aria-hidden="true" />
            </div>
            <span className="text-display text-display-sm text-[var(--ink)] hidden sm:block">
              Responsibly
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[var(--ink)] hover:text-[var(--accent)] text-mono text-sm tracking-widest transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)] transition-colors text-mono text-sm tracking-widest focus-ring"
            >
              Sign Up
            </Link>
            <Link href="/choose-assessment" className="btn-brutal">
              Start Now
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Hero Section */}
        <section className="bg-[var(--brand-primary)] text-[var(--cream)] py-16 md:py-24 diagonal-cut relative">
          {/* Gradient background accent */}
          <div className="absolute inset-0 opacity-15" style={{
            background: 'radial-gradient(circle at 20% 50%, var(--brand-tertiary) 0%, transparent 50%)'
          }} aria-hidden="true" />
          <div className="absolute inset-0 opacity-10" style={{
            background: 'radial-gradient(circle at 80% 20%, var(--brand-tertiary) 0%, transparent 40%)'
          }} aria-hidden="true" />
          <div className="container-lg relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Message */}
              <div className="stagger">
                <p className="text-mono text-[var(--brand-secondary)] text-sm mb-4 tracking-widest">
                  FREE COMPLIANCE CHECK FOR CANADIAN BUSINESSES
                </p>

                <h1 className="text-display text-display-lg text-[var(--cream)] mb-6">
                  Is Your AI
                  <br />
                  <span className="text-[var(--brand-secondary)]">Breaking</span>
                  <br />
                  The Law?
                </h1>

                <p className="text-mono text-sm tracking-widest text-[var(--cream)] mb-8 whitespace-nowrap">
                  Find out if your AI tools put you at risk—in 10 minutes.
                </p>

                <div className="flex flex-wrap gap-4">
                  {/* Full Assessment button with hover tooltip */}
                  <ButtonWithTooltip
                    href="/business-profile"
                    className="btn-brutal-on-dark"
                    tooltipTitle="Comprehensive Assessment"
                    tooltipContent="Provide your business data accurately through our guided 5-step form for a detailed compliance analysis tailored to your specific situation."
                  >
                    Full Assessment
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </ButtonWithTooltip>

                  {/* Quick Scan button with hover tooltip */}
                  <ButtonWithTooltip
                    href="/quick-scan"
                    className="btn-brutal-outline-dark"
                    tooltipTitle="Automated Web Scan"
                    tooltipContent="Enter your website URL and we'll automatically extract your business profile, detect AI tool usage, and analyze your public-facing privacy practices."
                  >
                    <Zap className="w-5 h-5" aria-hidden="true" />
                    Quick Scan
                  </ButtonWithTooltip>
                </div>
              </div>

              {/* Right - Big number */}
              <div className="lg:text-right animate-enter" style={{ animationDelay: '300ms' }}>
                <div className="inline-block">
                  <p className="text-mono text-[var(--cream)] text-sm mb-2 tracking-widest lg:text-right">
                    PENALTY PER VIOLATION
                  </p>
                  <p className="number-massive text-[var(--brand-secondary)] animate-number">
                    $100K Fine
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[var(--ink-light)] text-white py-4 md:py-6 diagonal-cut-reverse">
          <div className="container-lg">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-display text-display-sm">10</p>
                <p className="text-mono text-xs tracking-widest opacity-80">MINUTES</p>
              </div>
              <div>
                <p className="text-display text-display-sm">6</p>
                <p className="text-mono text-xs tracking-widest opacity-80">TAB REPORT</p>
              </div>
              <div>
                <p className="text-display text-display-sm">$0</p>
                <p className="text-mono text-xs tracking-widest opacity-80">COST</p>
              </div>
            </div>
          </div>
        </section>

        {/* Maria's Story - Timeline/Journey */}
        <section className="bg-[var(--ink)] relative py-12 md:py-16">
          {/* Accent glow overlays for storytelling atmosphere */}
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: 'linear-gradient(135deg, var(--brand-secondary) 0%, transparent 50%)' }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 opacity-8"
            style={{ background: 'radial-gradient(circle at 70% 80%, var(--brand-tertiary) 0%, transparent 40%)' }}
            aria-hidden="true"
          />

          <div className="container-lg relative z-10">
            {/* Section header */}
            <div className="text-center mb-10 md:mb-12 stagger">
              <h2 className="text-display text-display-md text-[var(--cream)] mb-4">
                It Started With One Upload…
              </h2>
              <div className="w-24 h-[3px] bg-[var(--brand-secondary)] mx-auto" />
            </div>

            {/* Timeline - All icons centered vertically, text alternating left/right */}
            <div className="relative max-w-4xl mx-auto">
              {/* Vertical line - hidden on mobile, shown on md+ */}
              <div
                className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[3px] bg-[var(--brand-secondary)]/30 -translate-x-1/2"
                aria-hidden="true"
              />

              {/* Timeline steps */}
              <div className="space-y-6 md:space-y-12">
                {/* Step 1 - Icon center, text RIGHT */}
                <div className="timeline-step flex items-start md:grid md:grid-cols-2 md:gap-8 md:items-center relative">
                  {/* Mobile marker */}
                  <div className="flex md:hidden w-10 h-10 rounded-full bg-[var(--brand-secondary)] items-center justify-center mr-4 flex-shrink-0">
                    <Upload className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>

                  {/* Desktop: Icon centered on page (absolutely positioned) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[var(--ink)] border-3 border-[var(--brand-secondary)] items-center justify-center z-10">
                    <Upload className="w-5 h-5 text-[var(--brand-secondary)]" aria-hidden="true" />
                  </div>

                  {/* Desktop: Empty left column */}
                  <div className="hidden md:block" />

                  {/* Desktop: Text on right */}
                  <div className="flex-1 md:pl-12">
                    <p className="text-mono text-[var(--brand-secondary)] text-xs tracking-widest mb-2">DAY 1</p>
                    <p className="text-[var(--cream)] text-lg leading-relaxed">
                      Maria, an accountant in Ottawa, uploaded her clients&apos; financial documents to ChatGPT to help prepare tax summaries faster.
                    </p>
                  </div>
                </div>

                {/* Step 2 - Icon center, text LEFT */}
                <div className="timeline-step flex items-start md:grid md:grid-cols-2 md:gap-8 md:items-center relative">
                  {/* Mobile marker */}
                  <div className="flex md:hidden w-10 h-10 rounded-full bg-[var(--caution)] items-center justify-center mr-4 flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>

                  {/* Desktop: Icon centered on page (absolutely positioned) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[var(--ink)] border-3 border-[var(--caution)] items-center justify-center z-10">
                    <AlertCircle className="w-5 h-5 text-[var(--caution)]" aria-hidden="true" />
                  </div>

                  {/* Desktop: Text on left */}
                  <div className="flex-1 md:pr-12 md:text-right">
                    <p className="text-mono text-[var(--caution)] text-xs tracking-widest mb-2">48 HOURS LATER</p>
                    <p className="text-[var(--cream)] text-lg leading-relaxed">
                      Her client discovered their confidential financial data was sent to US servers without consent and filed a <span className="text-[var(--caution)] font-bold">PIPEDA complaint</span>.
                    </p>
                  </div>

                  {/* Desktop: Empty right column */}
                  <div className="hidden md:block" />
                </div>

                {/* Step 3 - Icon center, text RIGHT - ALERT COLOR (between caution and danger) */}
                <div className="timeline-step flex items-start md:grid md:grid-cols-2 md:gap-8 md:items-center relative">
                  {/* Mobile marker */}
                  <div className="flex md:hidden w-10 h-10 rounded-full bg-[var(--alert)] items-center justify-center mr-4 flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>

                  {/* Desktop: Icon centered on page (absolutely positioned) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[var(--ink)] border-3 border-[var(--alert)] items-center justify-center z-10">
                    <DollarSign className="w-5 h-5 text-[var(--alert)]" aria-hidden="true" />
                  </div>

                  {/* Desktop: Empty left column */}
                  <div className="hidden md:block" />

                  {/* Desktop: Text on right */}
                  <div className="flex-1 md:pl-12">
                    <p className="text-mono text-[var(--alert)] text-xs tracking-widest mb-2">THE CONSEQUENCE</p>
                    <p className="text-[var(--cream)] text-lg leading-relaxed">
                      Maria will potentially face a <span className="text-[var(--alert)] font-bold text-2xl">$100,000 fine</span> for violating consent requirements. Her business insurance doesn&apos;t cover privacy violations.
                    </p>
                  </div>
                </div>

                {/* Step 4 - Icon center, text LEFT - RED/MOST ALARMING */}
                <div className="timeline-step flex items-start md:grid md:grid-cols-2 md:gap-8 md:items-center relative">
                  {/* Mobile marker */}
                  <div className="flex md:hidden w-10 h-10 rounded-full bg-[var(--danger)] items-center justify-center mr-4 flex-shrink-0 animate-pulse-glow-danger">
                    <CircleHelp className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>

                  {/* Desktop: Icon centered on page (absolutely positioned) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[var(--danger)] items-center justify-center z-10 animate-pulse-glow-danger">
                    <CircleHelp className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>

                  {/* Desktop: Text on left */}
                  <div className="flex-1 md:pr-12 md:text-right">
                    <p className="text-display text-display-sm text-[var(--cream)] mb-4">
                      She Had No Idea
                    </p>
                    <p className="text-[var(--cream)]/70 text-lg max-w-md md:ml-auto">
                      Maria didn&apos;t know she was breaking the law. <span className="text-[var(--danger)] font-bold">Don&apos;t let this happen to you.</span>
                    </p>
                  </div>

                  {/* Desktop: Empty right column */}
                  <div className="hidden md:block" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section className="py-12 md:py-20 bg-[var(--surface)]">
          <div className="container-lg">
            <div className="mb-10 md:mb-12 stagger">
              <p className="text-mono text-[var(--accent)] text-sm mb-3 tracking-widest">
                THE STAKES
              </p>
              <h2 className="text-display text-display-md text-[var(--ink)] mb-4">
                Why You Need to Act Now
              </h2>
              <div className="w-24 h-[3px] bg-[var(--accent)]" />
            </div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6 stagger">
              {/* Card 1 */}
              <div className="card-brutal-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[var(--danger-bg)] border-2 border-[var(--danger)] flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-[var(--danger)]" aria-hidden="true" />
                  </div>
                  <h3 className="text-display text-xl text-[var(--ink)] pt-2">PIPEDA Penalties</h3>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Using ChatGPT with customer data? You might already be in violation.
                  Most small businesses have no idea about consent requirements.
                </p>
                <div className="mt-4 pt-4 border-t-2 border-[var(--border)]">
                  <p className="text-mono text-2xl text-[var(--danger)]">$100,000</p>
                  <p className="text-mono text-xs text-[var(--text-muted)] tracking-widest">PER VIOLATION</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="card-brutal-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[var(--caution-bg)] border-2 border-[var(--caution)] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[var(--caution)]" aria-hidden="true" />
                  </div>
                  <h3 className="text-display text-xl text-[var(--ink)] pt-2">Ontario PHIPA</h3>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Ontario&apos;s Personal Health Information Protection Act strictly regulates how health data is collected, used, and disclosed—including AI processing.
                </p>
                <div className="mt-4 pt-4 border-t-2 border-[var(--border)]">
                  <p className="text-mono text-2xl text-[var(--caution)]">ACTIVE</p>
                  <p className="text-mono text-xs text-[var(--text-muted)] tracking-widest">IN FORCE SINCE 2004</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="card-brutal-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[var(--ink)] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[var(--cream)]" aria-hidden="true" />
                  </div>
                  <h3 className="text-display text-xl text-[var(--ink)] pt-2">Quebec Law 25</h3>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Fully in effect since September 2024. Quebec&apos;s strict privacy law
                  includes data portability rights and mandatory breach reporting.
                </p>
                <div className="mt-4 pt-4 border-t-2 border-[var(--border)]">
                  <p className="text-mono text-2xl text-[var(--ink)]">$25M</p>
                  <p className="text-mono text-xs text-[var(--text-muted)] tracking-widest">MAXIMUM FINE</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two Options Side by Side */}
        <section id="how-it-works" className="py-16 md:py-24 bg-[var(--ink)]">
          <div className="container-lg">
            <div className="mb-12 stagger">
              <p className="text-mono text-[var(--brand-secondary)] text-sm mb-3 tracking-widest">
                GET STARTED
              </p>
              <h2 className="text-display text-display-md text-[var(--cream)] mb-4">
                Choose Your Path
              </h2>
              <div className="w-24 h-[3px] bg-[var(--brand-secondary)]" />
            </div>

            {/* Side by Side Options */}
            <div className="grid lg:grid-cols-2 gap-0 border-2 border-[var(--cream)]">
              {/* Option 1: Full Assessment */}
              <div className="lg:border-r-2 border-[var(--cream)] flex flex-col">
                <div className="p-6 md:p-8 border-b-2 border-[var(--cream)] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Clock className="w-5 h-5 text-[var(--brand-secondary)]" aria-hidden="true" />
                      <span className="text-mono text-xs tracking-widest text-[var(--brand-secondary)]">
                        10 MINUTES
                      </span>
                    </div>
                    <h3 className="text-display text-display-sm text-[var(--cream)]">Full Assessment</h3>
                  </div>
                </div>

                <div className="p-6 md:p-8 bg-[var(--ink-light)] flex-1 flex flex-col">
                  <p className="text-[var(--cream)]/70 mb-6">
                    Answer in 5 quick steps for a comprehensive, tailored analysis of your AI compliance risks.
                  </p>

                  <div className="space-y-1 mb-8 flex-1">
                    {[
                      { num: '01', title: 'Business Profile' },
                      { num: '02', title: 'AI Tools' },
                      { num: '03', title: 'Data Types' },
                      { num: '04', title: 'Usage Patterns' },
                      { num: '05', title: 'Safeguards' },
                    ].map((step) => (
                      <div
                        key={step.num}
                        className="flex items-center gap-4 py-2 border-b border-[var(--cream)]/10"
                      >
                        <span className="text-display text-lg text-[var(--brand-secondary)] tabular-nums w-8">
                          {step.num}
                        </span>
                        <span className="text-sm text-[var(--cream)]/80">{step.title}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link href="/business-profile" className="btn-brutal-on-dark w-full justify-center">
                      Start Full Assessment
                      <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Option 2: Quick Scan */}
              <div className="flex flex-col">
                <div className="p-6 md:p-8 border-b-2 border-[var(--cream)] bg-[var(--brand-secondary)]">
                  <div className="flex items-center gap-3 mb-1">
                    <Zap className="w-5 h-5 text-white" aria-hidden="true" />
                    <span className="text-mono text-xs tracking-widest text-white/80">
                      INSTANT
                    </span>
                  </div>
                  <h3 className="text-display text-display-sm text-white">Quick Scan</h3>
                </div>

                <div className="p-6 md:p-8 bg-[var(--ink-light)] flex-1 flex flex-col">
                  <p className="text-[var(--cream)]/70 mb-6">
                    Just enter your website URL. We&apos;ll scan it to detect your business profile and AI usage automatically.
                  </p>

                  <div className="bg-[var(--ink)] p-4 mb-8 border border-[var(--cream)]/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-4 h-4 text-[var(--brand-secondary)]" aria-hidden="true" />
                      <code className="text-mono text-[var(--cream)]/80 text-xs">
                        yourwebsite.com
                      </code>
                    </div>
                    <div className="space-y-1 text-mono text-xs text-[var(--cream)]/50">
                      <p>→ Detects business info</p>
                      <p>→ Finds AI tool mentions</p>
                      <p>→ Checks privacy policy</p>
                      <p>→ Analyzes data practices</p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Link href="/quick-scan" className="btn-brutal-on-dark w-full justify-center">
                      Try Quick Scan
                      <Zap className="w-5 h-5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Report Preview */}
        <section className="py-12 md:py-16 bg-[var(--surface)]">
          <div className="container-lg">
            <div className="p-8 md:p-12 bg-[var(--ink)] text-[var(--cream)] border-2 border-[var(--ink)]">
              <div className="text-center mb-10">
                <p className="text-mono text-[var(--brand-secondary)] text-sm mb-3 tracking-widest">
                  WHAT YOU GET
                </p>
                <h3 className="text-display text-display-md">Your Report Includes</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Risk Score (0–100)', desc: 'Overall compliance rating' },
                  { title: 'PIPEDA Status', desc: 'Federal compliance check' },
                  { title: 'Provincial Analysis', desc: 'Province-specific laws' },
                  { title: 'Data Flow Map', desc: 'Where your data goes' },
                  { title: 'Policy Templates', desc: 'Ready-to-use documents' },
                  { title: '30-60-90 Day Plan', desc: 'Prioritized action items' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[var(--brand-secondary)] mt-2 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <span className="text-[var(--cream)] font-medium block">{item.title}</span>
                      <span className="text-[var(--cream)]/60 text-sm">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Centered */}
        <section className="py-24 md:py-32 bg-[var(--accent)] text-white relative overflow-hidden">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 40px,
                white 40px,
                white 42px
              )`
            }}
            aria-hidden="true"
          />

          <div className="container-lg relative">
            <div className="max-w-2xl mx-auto text-center stagger">
              <h2 className="text-display text-display-lg mb-6">
                Don&apos;t Wait
                <br />
                For The Fine
              </h2>
              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                Free 10-minute assessment. Zero cost. Know your risk today.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/choose-assessment"
                  className="btn-brutal bg-white text-[var(--ink)] border-[var(--ink)] hover:bg-[var(--cream)] inline-flex"
                >
                  Start Free Assessment
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-[var(--ink)] text-[var(--cream)] border-t-[3px] border-[var(--brand-secondary)]">
        <div className="container-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--brand-secondary)] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-mono text-sm">RESPONSIBLY</span>
            </div>
            <p className="text-mono text-xs text-[var(--cream)]/60 text-center md:text-right max-w-md">
              Educational guidance only. Not legal advice.
              Consult a privacy professional for compliance requirements.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
