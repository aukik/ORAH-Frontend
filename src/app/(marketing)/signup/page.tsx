/**
 * Sign Up Page - BRUTALIST CIVIC AUTHORITY
 *
 * Official registration portal for new user accounts.
 * Raw, utilitarian design with commanding presence.
 */

'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';

type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/choose-assessment';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength('weak');
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [password]);

  const validateForm = (): boolean => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    // Name validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate account creation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dummy signup - just redirect
    router.push(returnTo);
  };

  const getStrengthColor = (strength: PasswordStrength): string => {
    switch (strength) {
      case 'weak': return 'bg-[var(--danger)]';
      case 'medium': return 'bg-[var(--caution)]';
      case 'strong': return 'bg-[var(--safe)]';
    }
  };

  const getStrengthWidth = (strength: PasswordStrength): string => {
    switch (strength) {
      case 'weak': return 'w-1/3';
      case 'medium': return 'w-2/3';
      case 'strong': return 'w-full';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      {/* Header */}
      <header className="border-b-[3px] border-[var(--ink)] bg-[var(--surface)] py-4">
        <div className="container-lg">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-mono text-sm tracking-widest text-[var(--ink)] hover:text-[var(--accent)] transition-colors focus-ring"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            BACK TO HOME
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Portal Identity */}
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 bg-[var(--ink)] border-[3px] border-[var(--ink)] flex items-center justify-center relative">
                <Shield className="w-12 h-12 text-[var(--cream)]" aria-hidden="true" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--accent)]" />
              </div>
            </div>
            <h1 className="text-display text-4xl text-[var(--ink)] mb-2 tracking-tight">
              CREATE ACCOUNT
            </h1>
            <p className="text-mono text-sm text-[var(--text-secondary)] tracking-widest">
              REGISTER FOR SECURE ACCESS
            </p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-mono text-xs tracking-widest text-[var(--ink)] mb-2 uppercase"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-4 py-3 border-2 bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all ${
                  errors.fullName ? 'border-[var(--danger)]' : 'border-[var(--ink)]'
                }`}
                placeholder="John Smith"
                aria-invalid={errors.fullName ? 'true' : 'false'}
                aria-describedby={errors.fullName ? 'name-error' : undefined}
              />
              {errors.fullName && (
                <div id="name-error" className="mt-2 flex items-start gap-2" role="alert">
                  <AlertCircle className="w-4 h-4 text-[var(--danger)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-[var(--danger)]">{errors.fullName}</p>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-mono text-xs tracking-widest text-[var(--ink)] mb-2 uppercase"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border-2 bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all ${
                  errors.email ? 'border-[var(--danger)]' : 'border-[var(--ink)]'
                }`}
                placeholder="your.email@domain.com"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <div id="email-error" className="mt-2 flex items-start gap-2" role="alert">
                  <AlertCircle className="w-4 h-4 text-[var(--danger)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-[var(--danger)]">{errors.email}</p>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-mono text-xs tracking-widest text-[var(--ink)] mb-2 uppercase"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border-2 bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all ${
                  errors.password ? 'border-[var(--danger)]' : 'border-[var(--ink)]'
                }`}
                placeholder="Minimum 8 characters"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : 'password-strength'}
              />

              {/* Password Strength Indicator */}
              {password && (
                <div id="password-strength" className="mt-2" aria-live="polite">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1 bg-[var(--border)]">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength)} ${getStrengthWidth(passwordStrength)}`}
                      />
                    </div>
                    <span className="text-xs text-mono tracking-widest uppercase text-[var(--text-muted)]">
                      {passwordStrength}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <div id="password-error" className="mt-2 flex items-start gap-2" role="alert">
                  <AlertCircle className="w-4 h-4 text-[var(--danger)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-[var(--danger)]">{errors.password}</p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-mono text-xs tracking-widest text-[var(--ink)] mb-2 uppercase"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 border-2 bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all ${
                  errors.confirmPassword ? 'border-[var(--danger)]' : 'border-[var(--ink)]'
                }`}
                placeholder="Re-enter your password"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              {errors.confirmPassword && (
                <div id="confirm-password-error" className="mt-2 flex items-start gap-2" role="alert">
                  <AlertCircle className="w-4 h-4 text-[var(--danger)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-[var(--danger)]">{errors.confirmPassword}</p>
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="sr-only"
                    aria-invalid={errors.terms ? 'true' : 'false'}
                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                  />
                  <div
                    className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                      acceptTerms
                        ? 'bg-[var(--ink)] border-[var(--ink)]'
                        : errors.terms
                          ? 'border-[var(--danger)] bg-[var(--surface)]'
                          : 'border-[var(--ink)] bg-[var(--surface)]'
                    }`}
                  >
                    {acceptTerms && (
                      <div className="w-2 h-2 bg-[var(--accent)]" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="underline decoration-2 underline-offset-2">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="underline decoration-2 underline-offset-2">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.terms && (
                <div id="terms-error" className="mt-2 flex items-start gap-2" role="alert">
                  <AlertCircle className="w-4 h-4 text-[var(--danger)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-[var(--danger)]">{errors.terms}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-brutal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  CREATING ACCOUNT...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" aria-hidden="true" />
                  CREATE ACCOUNT
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t-2 border-[var(--border)] text-center">
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Already have an account?
            </p>
            <Link
              href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)] transition-colors text-mono text-sm tracking-widest focus-ring"
            >
              LOGIN
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 border-2 border-[var(--border)] bg-[var(--surface)]">
            <p className="text-mono text-xs text-[var(--text-muted)] leading-relaxed">
              NOTICE: By creating an account, you acknowledge that your information will be processed securely
              in accordance with applicable data protection regulations.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
