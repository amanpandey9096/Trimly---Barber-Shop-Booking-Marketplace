import React, { useState, useRef, useEffect } from 'react';
import {
  Scissors,
  Calendar,
  User,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, shopId?: string) => void;
  onOpenBooking: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  user: UserProfile;
  upcomingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenBooking,
  onOpenAuth,
  onLogout,
  user,
  upcomingCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Explore Shops', view: 'explore' },
    { label: 'Services', view: 'home-services' },
    { label: 'How It Works', view: 'home-how-it-works' },
    { label: 'List Your Shop', view: 'list-shop' },
  ];

  const handleNavClick = (view: string) => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    if (view === 'home-services') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('popular-services')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (view === 'home-how-it-works') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      onNavigate(view);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm backdrop-blur-md bg-stone-900/95 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
            aria-label="Trimly Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 shadow-md group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white font-serif-display group-hover:text-amber-400 transition-colors">
                TRIMLY
              </span>
              <span className="text-[10px] uppercase tracking-widest text-amber-500/90 font-medium">
                Your Style · Your Slot
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.view)}
                  className={`text-sm font-medium transition-colors hover:text-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded py-1 px-1 relative ${
                    isActive ? 'text-amber-400 font-semibold' : 'text-stone-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user.isLoggedIn ? (
              <>
                {/* My Bookings link */}
                <button
                  onClick={() => onNavigate('customer/bookings')}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    currentView === 'customer/bookings'
                      ? 'bg-stone-800 text-amber-400'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                  title="View your booked appointments"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>My Bookings</span>
                  {upcomingCount > 0 && (
                    <span className="ml-0.5 px-2 py-0.5 text-xs font-bold bg-amber-500 text-stone-950 rounded-full">
                      {upcomingCount}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700/80 text-stone-200 text-sm font-medium transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-bold flex items-center justify-center text-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="truncate max-w-[100px]">{user.name ? user.name.split(' ')[0] : 'Profile'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                      <div className="px-4 py-2 border-b border-stone-800">
                        <div className="font-bold text-stone-100 truncate">{user.name}</div>
                        <div className="text-[11px] text-stone-400 truncate">{user.email || user.phone}</div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onNavigate('customer/dashboard');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-left"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-400" />
                          <span>Customer Dashboard</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onNavigate('customer/bookings');
                          }}
                          className="w-full flex items-center justify-between px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2.5">
                            <Calendar className="w-4 h-4 text-amber-400" />
                            <span>My Bookings</span>
                          </div>
                          {upcomingCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px]">
                              {upcomingCount}
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onNavigate('customer/profile');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-left"
                        >
                          <User className="w-4 h-4 text-amber-400" />
                          <span>Profile Settings</span>
                        </button>
                      </div>

                      {onLogout && (
                        <div className="pt-1 border-t border-stone-800">
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onLogout();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-stone-800 transition-colors text-left font-semibold"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Guest: Login and Sign Up buttons */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-2 text-sm font-semibold text-stone-200 hover:text-white hover:bg-stone-800/80 rounded-xl transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-3.5 py-2 text-sm font-semibold bg-stone-800 hover:bg-stone-750 text-amber-400 border border-amber-500/30 rounded-xl transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Prominent CTA */}
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shrink-0"
            >
              <Scissors className="w-4 h-4 -rotate-45" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenBooking}
              className="bg-amber-500 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.view)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === link.view
                    ? 'bg-stone-800 text-amber-400 font-semibold'
                    : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            {user.isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('customer/dashboard');
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-stone-800 text-amber-400 text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard ({user.name ? user.name.split(' ')[0] : 'Client'})</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('customer/bookings');
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-stone-800/60 text-stone-200 text-sm font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>My Bookings</span>
                  </div>
                  {upcomingCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-stone-950 rounded-full">
                      {upcomingCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('customer/profile');
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-300 hover:bg-stone-800 text-sm font-medium"
                >
                  <User className="w-4 h-4 text-stone-400" />
                  <span>Profile Settings</span>
                </button>

                {onLogout && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-red-400 text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('login');
                  }}
                  className="py-2 px-3 rounded-xl bg-stone-800 text-stone-200 font-semibold text-xs text-center border border-stone-700"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('signup');
                  }}
                  className="py-2 px-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs text-center"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md text-xs sm:text-sm"
            >
              <Scissors className="w-4 h-4 -rotate-45" />
              <span>Book an Appointment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
