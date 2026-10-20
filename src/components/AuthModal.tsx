import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  validateLoginIdentifier,
  validatePassword,
  findUserByIdentifier,
  DEFAULT_DEMO_USERS,
  formatPhoneNumber,
} from '../utils/authUtils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  registeredUsers: UserProfile[];
  onRegisterUser: (newUser: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPreferredStyle, setRegPreferredStyle] = useState('Low Skin Taper Fade');

  // Error & Feedback state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time detection of email vs phone
  const identifierCheck = validateLoginIdentifier(loginIdentifier);

  const handleFillDemo = (type: 'alex-email' | 'alex-phone' | 'marcus-phone') => {
    setTab('login');
    setErrors({});
    setLoginFeedback(null);

    if (type === 'alex-email') {
      setLoginIdentifier('alex.morgan@example.com');
      setLoginPassword('password123');
    } else if (type === 'alex-phone') {
      setLoginIdentifier('(555) 392-8172');
      setLoginPassword('password123');
    } else if (type === 'marcus-phone') {
      setLoginIdentifier('(555) 841-2930');
      setLoginPassword('password123');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoginFeedback(null);

    const validation = validateLoginIdentifier(loginIdentifier);
    if (!validation.isValid) {
      setErrors({ identifier: validation.error || 'Invalid email or phone number' });
      return;
    }

    if (!loginPassword) {
      setErrors({ password: 'Password is required' });
      return;
    }

    // Combine default demo accounts and any user created in localStorage
    const allUsers = [...DEFAULT_DEMO_USERS, ...registeredUsers];
    const found = findUserByIdentifier(allUsers, loginIdentifier);

    if (!found) {
      setErrors({
        identifier: 'No account found with this email or phone number. Check demo accounts above or register.',
      });
      return;
    }

    // In this demo, check password (or accept default password123)
    if (found.password && found.password !== loginPassword) {
      setErrors({ password: 'Incorrect password. Try: password123' });
      return;
    }

    const authenticatedUser: UserProfile = {
      ...found,
      isLoggedIn: true,
    };

    onLoginSuccess(authenticatedUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!regName.trim()) {
      newErrors.name = 'Full name is required';
    }

    const emailValidation = validateLoginIdentifier(regEmail);
    if (!emailValidation.isValid || emailValidation.type !== 'email') {
      newErrors.email = 'Please provide a valid email address';
    }

    const phoneValidation = validateLoginIdentifier(regPhone);
    if (!phoneValidation.isValid || phoneValidation.type !== 'phone') {
      newErrors.phone = 'Please provide a valid 10-digit phone number';
    }

    const passCheck = validatePassword(regPassword);
    if (!passCheck.isValid) {
      newErrors.password = passCheck.error || 'Password must be at least 6 characters';
    }

    if (regPassword !== regConfirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if email or phone already registered
    const allUsers = [...DEFAULT_DEMO_USERS, ...registeredUsers];
    if (findUserByIdentifier(allUsers, regEmail)) {
      newErrors.email = 'An account with this email already exists';
    }
    if (findUserByIdentifier(allUsers, regPhone)) {
      newErrors.phone = 'An account with this phone number already exists';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: formatPhoneNumber(regPhone),
      password: regPassword,
      isLoggedIn: true,
      preferredStyle: regPreferredStyle,
      preferredBeard: 'Natural Cleanup',
      memberSince: 'October 2026',
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div>
            <h3 className="text-base font-bold font-serif-display text-white">
              {tab === 'login' ? 'Customer Sign In' : 'Create Trimly Account'}
            </h3>
            <p className="text-xs text-stone-400">
              {tab === 'login'
                ? 'Sign in using your Email ID or Phone Number'
                : 'Join Trimly to book instantly without lines'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrors({});
            }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
              tab === 'login'
                ? 'border-amber-500 text-stone-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Sign In (Email or Phone)
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrors({});
            }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
              tab === 'register'
                ? 'border-amber-500 text-stone-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Demo Fast Fills Banner */}
        <div className="p-3 bg-amber-50/80 border-b border-amber-200/70 text-xs text-amber-950 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Fast Demo Sign-in:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => handleFillDemo('alex-phone')}
              className="px-2 py-1 bg-white hover:bg-amber-100/80 border border-amber-300 rounded text-[11px] font-semibold text-stone-800 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-amber-600" />
              <span>Alex (Phone: (555) 392-8172)</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('alex-email')}
              className="px-2 py-1 bg-white hover:bg-amber-100/80 border border-amber-300 rounded text-[11px] font-semibold text-stone-800 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3 h-3 text-amber-600" />
              <span>Alex (Email ID)</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('marcus-phone')}
              className="px-2 py-1 bg-white hover:bg-amber-100/80 border border-amber-300 rounded text-[11px] font-semibold text-stone-800 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-amber-600" />
              <span>Marcus (Phone: (555) 841-2930)</span>
            </button>
          </div>
        </div>

        {/* LOGIN TAB */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Email ID or Phone Number *
                </label>
                {loginIdentifier && identifierCheck.isValid && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    Detected {identifierCheck.type === 'email' ? 'Email Address' : 'Phone Number'}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. alex.morgan@example.com or 555-392-8172"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <div className="absolute left-3 top-3 text-stone-400">
                  {identifierCheck.type === 'phone' ? (
                    <Phone className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Mail className="w-4 h-4 text-stone-400" />
                  )}
                </div>
              </div>
              {errors.identifier && (
                <span className="text-[11px] text-red-600 mt-1 block flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.identifier}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Password *
                </label>
                <span className="text-[11px] text-amber-700 hover:underline cursor-pointer">
                  Forgot? (Use: password123)
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] text-red-600 mt-1 block flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.password}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Sign In with Email or Phone</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-stone-400 text-center leading-relaxed">
              * Simulated authentication. Customer profiles and booked appointments persist in your browser localStorage.
            </p>
          </form>
        ) : (
          /* REGISTRATION TAB */
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 max-h-[460px] overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Liam Taylor"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
              {errors.name && (
                <span className="text-[11px] text-red-600 mt-0.5 block">{errors.name}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email ID *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
                {errors.email && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{errors.email}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
                {errors.phone && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{errors.phone}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
                {errors.password && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{errors.password}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
                {errors.confirmPassword && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Preferred Haircut Style
              </label>
              <select
                value={regPreferredStyle}
                onChange={(e) => setRegPreferredStyle(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Low Skin Taper Fade">Low Skin Taper Fade</option>
                <option value="Classic Pompadour with Razor Part">Classic Pompadour with Razor Part</option>
                <option value="Textured Crop & French Fringe">Textured Crop & French Fringe</option>
                <option value="Mid Drop Fade">Mid Drop Fade</option>
                <option value="Executive Scissor Cut">Executive Scissor Cut</option>
                <option value="Buzz Cut with Lineup">Buzz Cut with Lineup</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Register & Create Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
