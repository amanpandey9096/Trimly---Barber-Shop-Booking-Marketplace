import React, { useState } from 'react';
import {
  Scissors,
  Mail,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { validateLoginIdentifier } from '../utils/authUtils';

interface ForgotPasswordPageProps {
  onNavigate: (view: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validateLoginIdentifier(identifier);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid email or phone number');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 500);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
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
            Reset Account Password
          </h1>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Enter your registered email address or phone number to receive secure reset instructions.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
          {isSubmitted ? (
            <div className="space-y-4 text-center py-2 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-serif-display text-stone-900">
                  Reset Link Dispatched
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We have simulated sending password reset instructions to{' '}
                  <strong className="text-stone-900">{identifier}</strong>. In this frontend demo environment, your test credentials remain active.
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Return to Login</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Email Address or Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="alex.morgan@example.com or 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Sending Instructions...</span>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-stone-100 text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
