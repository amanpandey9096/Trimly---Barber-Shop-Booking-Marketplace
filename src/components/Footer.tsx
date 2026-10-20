import React from 'react';
import { Scissors, MapPin, Phone, Mail, Instagram, Facebook, Twitter, ArrowRight, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 shadow-md">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-serif-display">
                TRIMLY
              </span>
            </div>
            <p className="text-stone-400 text-sm max-w-sm leading-relaxed">
              "Your Style. Your Slot. Your Time."
              <br />
              The marketplace connecting gentlemen with top-tier local barber shops. Choose your service, pick your barber, and walk in when it’s your turn.
            </p>
            <div className="pt-2 flex items-center gap-4 text-stone-400">
              <span className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center hover:text-amber-400 hover:border-amber-500/50 transition-colors cursor-pointer" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </span>
              <span className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center hover:text-amber-400 hover:border-amber-500/50 transition-colors cursor-pointer" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </span>
              <span className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center hover:text-amber-400 hover:border-amber-500/50 transition-colors cursor-pointer" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Customer Navigation */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Find Barber Shops
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Popular Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('customer/dashboard')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Customer Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('customer/bookings')}
                  className="hover:text-amber-400 transition-colors"
                >
                  My Bookings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('customer/profile')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Profile Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Top Rated Barbers
                </button>
              </li>
            </ul>
          </div>

          {/* Barber Partners */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              For Barbers
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('list-shop')}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <span>List Your Shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('list-shop')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Partner Benefits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('list-shop')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Shop Registration
                </button>
              </li>
              <li>
                <span className="text-stone-500 text-xs">Zero upfront hardware needed</span>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <span className="hover:text-amber-400 transition-colors cursor-pointer">
                  Frequently Asked Questions
                </span>
              </li>
              <li>
                <span className="hover:text-amber-400 transition-colors cursor-pointer">
                  Cancellation Policies
                </span>
              </li>
              <li>
                <span className="hover:text-amber-400 transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-amber-400 transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li className="pt-2 text-xs text-stone-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulated Secure Checkout</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Trimly Technologies Inc. All rights reserved.</p>
          <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg text-stone-400 max-w-xl text-center md:text-right">
            <span className="font-semibold text-amber-400">Demonstration Marketplace:</span> All barber shops, services, reviews, and booking confirmations shown on Trimly are simulated for presentation and frontend testing.
          </div>
        </div>
      </div>
    </footer>
  );
};
