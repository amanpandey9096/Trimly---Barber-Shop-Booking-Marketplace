import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';
import { UserProfile } from '../types';
import { CustomerLayout } from '../components/CustomerLayout';
import { validateProfileSettings, validatePassword } from '../utils/authUtils';

interface CustomerProfilePageProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  upcomingCount?: number;
}

export const CustomerProfilePage: React.FC<CustomerProfilePageProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onNavigate,
  upcomingCount = 0,
}) => {
  // Form fields
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [preferredStyle, setPreferredStyle] = useState(user.preferredStyle || '');
  const [notes, setNotes] = useState(user.notes || '');

  // Validation & status messages
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Password change section state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});

    const validation = validateProfileSettings({ name, email, phone });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const updatedProfile: UserProfile = {
        ...user,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        preferredStyle: preferredStyle.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      onUpdateUser(updatedProfile);
      setIsSaving(false);
      setSuccessMessage('Profile details updated successfully! These details will automatically autofill future booking forms.');

      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }, 400);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const passRes = validatePassword(newPassword);
    if (!passRes.isValid) {
      setPasswordError(passRes.error || 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    // In demo mode: update password in user state
    const updatedUser: UserProfile = {
      ...user,
      password: newPassword,
    };
    onUpdateUser(updatedUser);

    setPasswordSuccess('Password updated successfully! (Frontend demo session updated)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');

    setTimeout(() => {
      setPasswordSuccess('');
      setShowPasswordSection(false);
    }, 2500);
  };

  return (
    <CustomerLayout
      currentView="customer/profile"
      onNavigate={onNavigate}
      user={user}
      onLogout={onLogout}
      upcomingCount={upcomingCount}
    >
      <div className="space-y-8 max-w-3xl">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900 tracking-tight">
            Customer Profile & Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Keep your contact details up-to-date for salon SMS notifications and one-click booking autofill.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 text-xs animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-sm">Changes Saved!</strong>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-serif-display font-bold text-2xl flex items-center justify-center shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif-display text-stone-900">
                {user.name || 'Valued Customer'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Member since {user.memberSince || 'September 2026'} · Client ID: <span className="font-mono">{user.id || 'usr-demo'}</span>
              </p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Authorized Account</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className={`w-full pl-10 pr-4 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      errors.name ? 'border-red-400 bg-red-50/20' : 'border-stone-300'
                    }`}
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
                {errors.name && (
                  <span className="text-[11px] text-red-600 mt-1 block">{errors.name}</span>
                )}
              </div>

              {/* Email Address */}
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
                    className={`w-full pl-10 pr-4 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      errors.email ? 'border-red-400 bg-red-50/20' : 'border-stone-300'
                    }`}
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
                {errors.email && (
                  <span className="text-[11px] text-red-600 mt-1 block">{errors.email}</span>
                )}
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Used for booking confirmation tickets and receipt passes.
                </span>
              </div>

              {/* Phone Number */}
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
                    className={`w-full pl-10 pr-4 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      errors.phone ? 'border-red-400 bg-red-50/20' : 'border-stone-300'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
                {errors.phone && (
                  <span className="text-[11px] text-red-600 mt-1 block">{errors.phone}</span>
                )}
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Barbers contact this number for arrival updates.
                </span>
              </div>

              {/* Preferred Hair/Beard Style */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Signature Styling Notes (Optional)
                </label>
                <input
                  type="text"
                  value={preferredStyle}
                  onChange={(e) => setPreferredStyle(e.target.value)}
                  placeholder="e.g. Low Skin Taper Fade & Textured Scissor Crop"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Saved notes automatically appear for your barber in future bookings.
                </span>
              </div>

              {/* Allergies / Special Requests */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Grooming Preferences or Sensitivities (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Sensitive skin around neckline, prefers cooling tea tree toner."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Changes take effect across your active session immediately.
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Account Security & Password Section */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif-display text-stone-900">
                  Account Password & Security
                </h3>
                <p className="text-xs text-stone-500">
                  Update your authentication credentials or security phrase.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="py-2 px-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors"
            >
              {showPasswordSection ? 'Hide' : 'Change Password'}
            </button>
          </div>

          {showPasswordSection && (
            <form onSubmit={handleUpdatePassword} className="space-y-4 pt-4 border-t border-stone-100 animate-in fade-in">
              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
                  {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
                  {passwordError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Logout Section */}
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-stone-900">Sign Out of Trimly</h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Securely terminate your current session on this device.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="py-2.5 px-4 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Now</span>
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
};
