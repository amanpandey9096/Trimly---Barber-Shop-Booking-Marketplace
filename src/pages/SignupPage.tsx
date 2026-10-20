import React, { useState } from 'react';
import {
  Scissors,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { UserProfile } from '../types';
import { validateRegistrationForm } from '../utils/authUtils';

interface SignupPageProps {
  onNavigate: (view: string) => void;
  onRegisterSuccess: (newUser: UserProfile) => void;
  registeredUsers: UserProfile[];
  redirectAfterLogin?: string | null;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onNavigate,
  onRegisterSuccess,
  registeredUsers,
  redirectAfterLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const validation = validateRegistrationForm({
      name,
      email,
      phone,
      password,
      confirmPassword,
      acceptTerms,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    // Check if email already registered
    const exists = registeredUsers.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      setFormErrors({
        email: 'An account with this email address already exists. Please sign in instead.',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newUser: UserProfile = {
        id: 'usr-' + Date.now(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        isLoggedIn: true,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      };

      setIsLoading(false);
      onRegisterSuccess(newUser);

      if (redirectAfterLogin) {
        onNavigate(redirectAfterLogin);
      } else {
        onNavigate('customer/dashboard');
      }
    }, 450);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <span className="font-serif-display font-bold text-2xl tracking-tight text-stone-900">
              TRIMLY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900 tracking-tight">
            Create Your Trimly Account
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            Book top barbers online, skip queues, and keep all your grooming passes in one place.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Julian Reed"
                  className={`w-full pl-10 pr-4 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                    formErrors.name ? 'border-red-400 bg-red-50/20' : 'border-stone-300'
                  }`}
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
              {formErrors.name && (
                <span className="text-[11px] text-red-600 mt-1 block">{formErrors.name}</span>
              )}
            </div>

            {/* Email & Phone grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-3 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      formErrors.email ? 'border-red-400 bg-red-50/20' : 'border-stone-300'
                    }`}
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
                {formErrors.email && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors.email}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full pl-10 pr-3 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      formErrors.phone ? 'border-red-400 bg-red-50/20' : 'border-stone-300'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
                {formErrors.phone && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors.phone}</span>
                )}
              </div>
            </div>

            {/* Passwords grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className={`w-full pl-10 pr-10 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      formErrors.password ? 'border-red-400 bg-red-50/20' : 'border-stone-300'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.password && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors.password}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full pl-10 pr-3 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      formErrors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-stone-300'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
                {formErrors.confirmPassword && (
                  <span className="text-[11px] text-red-600 mt-1 block">
                    {formErrors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 mt-0.5"
                />
                <span className="text-xs text-stone-600 leading-snug">
                  I agree to Trimly’s{' '}
                  <span className="text-amber-700 underline font-medium">Terms of Service</span>,{' '}
                  <span className="text-amber-700 underline font-medium">Privacy Policy</span>, and salon appointment cancellation policies.
                </span>
              </label>
              {formErrors.acceptTerms && (
                <span className="text-[11px] text-red-600 mt-1 block">{formErrors.acceptTerms}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="pt-4 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-bold text-amber-700 hover:text-amber-800 underline"
              >
                Sign In Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
