import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  User,
  Scissors,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../types';

interface CustomerLayoutProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile;
  onLogout: () => void;
  upcomingCount?: number;
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  currentView,
  onNavigate,
  user,
  onLogout,
  upcomingCount = 0,
  children,
}) => {
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

          {/* Simulated Demo Session Notice */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5 text-[11px] text-stone-500">
            <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Demo Authentication</span>
            </div>
            <p className="leading-relaxed">
              Active frontend session stored in local browser state. Permanent cross-device sync requires Supabase Auth or Firebase backend integration.
            </p>
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
    </div>
  );
};
