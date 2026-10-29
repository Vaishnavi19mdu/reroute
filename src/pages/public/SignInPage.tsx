import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2, KeyRound } from 'lucide-react';
import { ReRouteLogo } from '../../assets/icons/ReRouteLogo';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { PasswordInput } from '../../components/common/PasswordInput';

interface SignInPageProps {
  onNavigate: (path: string) => void;
  initialMode?: 'signin' | 'forgot';
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onNavigate,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'forgot'>(initialMode);

  // Sign In Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotFeedback, setForgotFeedback] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
    return undefined;
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitFeedback(null);

    const emailErr = validateEmail(email);
    const passwordErr = !password ? 'Password is required.' : undefined;

    if (emailErr || passwordErr) {
      setErrors({ email: emailErr, password: passwordErr });
      return;
    }

    setErrors({});
    setSubmitFeedback('Sign in successful. Welcome to ReRoute!');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotFeedback(null);

    const emailErr = validateEmail(forgotEmail);
    if (emailErr) {
      setForgotError(emailErr);
      return;
    }

    setForgotError(null);
    setForgotFeedback('Password reset instructions have been sent to your email.');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col justify-between text-[#1D1160]">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E2EBE5] py-4 px-4 sm:px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="cursor-pointer focus-visible:outline-2 focus-visible:outline-[#17483C] rounded-[4px]"
            aria-label="ReRoute Home"
          >
            <ReRouteLogo variant="full" />
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#17483C] hover:text-[#317787] transition-colors cursor-pointer py-1.5 px-2.5 rounded-[4px] hover:bg-[#F4F7F5]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6 sm:my-10">
        <div className="w-full max-w-md bg-white rounded-[8px] border border-[#E2EBE5] shadow-xs p-6 sm:p-8 space-y-6">
          
          {mode === 'signin' ? (
            <>
              {/* Sign In Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17483C] font-heading">
                  Sign in to ReRoute
                </h1>
              </div>

              {/* Submit Feedback Banner */}
              {submitFeedback && (
                <div className="p-3.5 bg-[#8FBC8B]/15 border border-[#8FBC8B] rounded-[6px] text-xs text-[#17483C] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#088A1A] shrink-0 mt-0.5" />
                  <div>{submitFeedback}</div>
                </div>
              )}

              {/* Sign In Form: strictly email + password, NO role selector */}
              <form onSubmit={handleSignInSubmit} className="space-y-4" noValidate>
                {/* Email Address */}
                <FormField
                  label="Email address"
                  id="signin-email"
                  required
                  error={errors.email}
                >
                  <div className="relative">
                    <input
                      id="signin-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="name@example.com"
                      aria-invalid={!!errors.email}
                      className={`w-full px-3 py-2 pl-9 rounded-[6px] border text-sm text-[#1D1160] transition-colors focus:outline-none focus:ring-2 focus:ring-[#17483C]/20 ${
                        errors.email
                          ? 'border-[#C5221F] bg-[#FFF8F8] focus:border-[#C5221F]'
                          : 'border-[#D5DFD9] bg-white focus:border-[#17483C]'
                      }`}
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </FormField>

                {/* Password */}
                <FormField
                  label="Password"
                  id="signin-password"
                  required
                  error={errors.password}
                >
                  <PasswordInput
                    id="signin-password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Enter your password"
                    hasError={!!errors.password}
                  />
                </FormField>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 text-[#475569] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-[4px] border-[#D5DFD9] text-[#17483C] focus:ring-[#17483C] cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setSubmitFeedback(null);
                    }}
                    className="font-semibold text-[#17483C] hover:text-[#317787] transition-colors underline underline-offset-2 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Primary Sign In Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center mt-3"
                >
                  Sign In
                </Button>
              </form>

              {/* Switch to Sign Up */}
              <div className="pt-4 border-t border-[#E2EBE5] text-center text-xs text-[#64748B]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/signup')}
                  className="font-bold text-[#17483C] hover:text-[#317787] underline underline-offset-2 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Forgot Password Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17483C] font-heading">
                  Reset your password
                </h1>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Enter your registered email address to receive password reset instructions.
                </p>
              </div>

              {/* Forgot Feedback */}
              {forgotFeedback && (
                <div className="p-3.5 bg-[#8FBC8B]/15 border border-[#8FBC8B] rounded-[6px] text-xs text-[#17483C] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#088A1A] shrink-0 mt-0.5" />
                  <div>{forgotFeedback}</div>
                </div>
              )}

              {/* Forgot Password Form */}
              <form onSubmit={handleForgotSubmit} className="space-y-4" noValidate>
                <FormField
                  label="Email address"
                  id="forgot-email"
                  required
                  error={forgotError || undefined}
                >
                  <div className="relative">
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        if (forgotError) setForgotError(null);
                      }}
                      placeholder="name@example.com"
                      aria-invalid={!!forgotError}
                      className={`w-full px-3 py-2 pl-9 rounded-[6px] border text-sm text-[#1D1160] transition-colors focus:outline-none focus:ring-2 focus:ring-[#17483C]/20 ${
                        forgotError
                          ? 'border-[#C5221F] bg-[#FFF8F8] focus:border-[#C5221F]'
                          : 'border-[#D5DFD9] bg-white focus:border-[#17483C]'
                      }`}
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </FormField>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  icon={<KeyRound className="w-4 h-4" />}
                >
                  Request Reset Link
                </Button>
              </form>

              {/* Return to Sign In */}
              <div className="pt-4 border-t border-[#E2EBE5] text-center text-xs text-[#64748B]">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setForgotFeedback(null);
                    setForgotError(null);
                  }}
                  className="font-bold text-[#17483C] hover:text-[#317787] underline underline-offset-2 cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </>
          )}

        </div>
      </main>

      {/* Mini Footer */}
      <footer className="text-center py-4 px-4 text-xs text-[#64748B] border-t border-[#E2EBE5] bg-white">
        <p>ReRoute · Waste to Worth · Team Syndicates</p>
      </footer>
    </div>
  );
};

export default SignInPage;
