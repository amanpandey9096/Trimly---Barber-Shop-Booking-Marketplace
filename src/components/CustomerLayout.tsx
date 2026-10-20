import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  User,
  Scissors,
  LogOut,
  ChevronRight,
  Database,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  X,
  Code2,
} from 'lucide-react';
import { UserProfile } from '../types';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';

interface CustomerLayoutProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile;
  onLogout: () => void;
  upcomingCount?: number;
  supabaseSynced?: boolean;
  supabaseTableMissing?: boolean;
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  currentView,
  onNavigate,
  user,
  onLogout,
  upcomingCount = 0,
  supabaseSynced = true,
  supabaseTableMissing = false,
  children,
}) => {
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const navItems = [
    {
      id: 'customer/dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'customer/bookings',
      label: 'My Bookings',
      icon: Calendar,
      badge: upcomingCount > 0 ? `${upcomingCount} Active` : null,
    },
    {
      id: 'customer/profile',
      label: 'Profile Settings',
      icon: User,
      badge: null,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mobile Nav Tabs */}
      <div className="lg:hidden mb-6 bg-white rounded-2xl p-2 border border-stone-200 shadow-sm flex items-center justify-between gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label.split(' ')[0]}</span>
              {item.badge && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          );
        })}
        <button
          onClick={() => onNavigate('explore')}
          className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          <Scissors className="w-3.5 h-3.5 -rotate-45" />
          <span>Book</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar (1 Column) */}
        <aside className="hidden lg:block lg:col-span-1 bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-6 sticky top-24">
          {/* User Profile Header */}
          <div className="flex items-center gap-3.5 pb-5 border-b border-stone-100">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-serif-display font-bold text-lg flex items-center justify-center shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-stone-900 truncate">{user.name || 'Valued Client'}</h3>
              <p className="text-xs text-stone-500 truncate">{user.email || user.phone}</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md mt-1 font-medium border border-amber-200/60">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>Client Member</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-stone-400' : 'text-stone-300'}`} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Primary Action */}
          <div className="pt-2">
            <button
              onClick={() => onNavigate('explore')}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <Scissors className="w-3.5 h-3.5 -rotate-45" />
              <span>Book a Barber</span>
            </button>
          </div>

          {/* Supabase Cloud Database Status */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2 text-[11px] text-stone-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Supabase Connected</span>
              </div>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="leading-relaxed text-stone-600">
              Project <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-emerald-200 text-emerald-900">yxdkexatwqwudlgsvflv</code> is linked for customer profile & booking storage.
            </p>
            <button
              type="button"
              onClick={() => setShowSchemaModal(true)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-white hover:bg-emerald-100/60 text-emerald-900 border border-emerald-200/90 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{supabaseTableMissing ? 'Setup Database Tables' : 'View SQL Table Schema'}</span>
            </button>
          </div>

          {/* Logout Action */}
          <div className="pt-2 border-t border-stone-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        </aside>

        {/* Main Content Viewport (3 Columns) */}
        <div className="lg:col-span-3 min-w-0">
          {children}
        </div>
      </div>

      {/* Supabase SQL Schema Helper Modal */}
      {showSchemaModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-display text-stone-900">
                    Supabase SQL Table Setup (yxdkexatwqwudlgsvflv)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Run this SQL in your Supabase Dashboard SQL Editor to ensure the <code className="font-mono">customers</code> and <code className="font-mono">appointments</code> tables exist.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSchemaModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-2xl bg-stone-900 text-stone-100 font-mono text-[11px] overflow-x-auto max-h-80 leading-relaxed">
                {SUPABASE_SQL_SCHEMA}
              </pre>
              <button
                type="button"
                onClick={handleCopySql}
                className="absolute top-3 right-3 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied SQL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSchemaModal(false)}
                className="py-2 px-5 rounded-xl bg-stone-900 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
