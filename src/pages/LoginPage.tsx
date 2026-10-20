import React, { useState } from 'react';
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  User,
  KeyRound,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  findUserByIdentifier,
  validateLoginIdentifier,
  validatePassword,
  DEFAULT_DEMO_USERS,
} from '../utils/authUtils';

interface LoginPageProps {
  onNavigate: (view: string) => void;
  onLoginSuccess: (user: UserProfile) => void;
  registeredUsers: UserProfile[];
  redirectAfterLogin?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  onLoginSuccess,
  registeredUsers,
  redirectAfterLogin,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formErrors, setFormErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const idValidation = validateLoginIdentifier(identifier);
    if (!idValidation.isValid) {
      setFormErrors((prev) => ({ ...prev, identifier: idValidation.error }));
      return;
    }

    const passValidation = validatePassword(password);
    if (!passValidation.isValid) {
      setFormErrors((prev) => ({ ...prev, password: passValidation.error }));
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Find matching user
      const allUsers = [...registeredUsers, ...DEFAULT_DEMO_USERS];
      const foundUser = findUserByIdentifier(allUsers, identifier);

      if (!foundUser) {
        setIsLoading(false);
        setFormErrors({
          general: 'No account found with this email or phone number. Check your credentials or sign up for a new account.',
        });
        return;
      }

      if (foundUser.password && foundUser.password !== password) {
        setIsLoading(false);
        setFormErrors({
          general: 'Incorrect password entered. Please try again or use the forgot password link.',
        });
        return;
      }

      // Successful login
      const authenticatedUser: UserProfile = {
        ...foundUser,
        isLoggedIn: true,
      };

      setIsLoading(false);
      onLoginSuccess(authenticatedUser);

      if (redirectAfterLogin) {
        onNavigate(redirectAfterLogin);
      } else {
        onNavigate('customer/dashboard');
      }
    }, 450);
  };

  const handleFastDemoLogin = (demoUser: UserProfile) => {
    setIdentifier(demoUser.email);
    setPassword(demoUser.password || 'password123');
    setFormErrors({});

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        ...demoUser,
        isLoggedIn: true,
      });
      if (redirectAfterLogin) {
        onNavigate(redirectAfterLogin);
      } else {
        onNavigate('customer/dashboard');
      }
    }, 300);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
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
          <h1 className="text-2xl font-bold font-serif-display text-stone-900 tracking-tight">
            Customer Login Portal
          </h1>
          <p className="text-xs text-stone-500">
            Sign in with your email or phone number to view guaranteed bookings and profile passes.
          </p>
        </div>

        {/* Demo Quick Logins Card */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>1-Click Test Customer Accounts</span>
            </span>
            <span className="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded font-semibold">
              Demo Sandbox
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFastDemoLogin(DEFAULT_DEMO_USERS[0])}
              className="py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border border-amber-200 text-stone-900 text-xs font-semibold text-left transition-all shadow-2xs hover:border-amber-400"
            >
              <div className="font-bold text-stone-900">Alex Morgan</div>
              <div className="text-[10px] text-stone-500 truncate">Upcoming booking</div>
            </button>
            <button
              type="button"
              onClick={() => handleFastDemoLogin(DEFAULT_DEMO_USERS[1])}
              className="py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border border-amber-200 text-stone-900 text-xs font-semibold text-left transition-all shadow-2xs hover:border-amber-400"
            >
              <div className="font-bold text-stone-900">Marcus Sterling</div>
              <div className="text-[10px] text-stone-500 truncate">Clean slate profile</div>
            </button>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
          {formErrors.general && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{formErrors.general}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email / Phone identifier */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Email Address or Phone Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="alex.morgan@example.com or 9876543210"
                  className={`w-full pl-10 pr-4 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                    formErrors.identifier ? 'border-red-400 bg-red-50/20' : 'border-stone-300'
                  }`}
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
              {formErrors.identifier && (
                <span className="text-[11px] text-red-600 mt-1 block">
                  {formErrors.identifier}
                </span>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-700">Password *</label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                    formErrors.password ? 'border-red-400 bg-red-50/20' : 'border-stone-300'
                  }`}
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formErrors.password && (
                <span className="text-[11px] text-red-600 mt-1 block">
                  {formErrors.password}
                </span>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-stone-600">
                Remember this device for future visits
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="pt-4 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-600">
              Don’t have an account yet?{' '}
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="font-bold text-amber-700 hover:text-amber-800 underline"
              >
                Create a Free Account
              </button>
            </p>
          </div>
        </div>

        {/* Demo Disclaimer notice */}
        <div className="text-center text-[11px] text-stone-400 space-y-1">
          <p>
            * For testing, use password <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-700 font-mono">password123</code> or click one of the 1-Click test accounts above.
          </p>
          <p>
            Real production customer data utilizes Supabase Auth or PostgreSQL Row-Level Security.
          </p>
        </div>
      </div>
    </div>
  );
};
