import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Shield,
  Calendar,
  Sparkles,
  ArrowRight,
  Scissors,
  CheckCircle2,
  Store,
  Star,
  Users,
} from 'lucide-react';
import { BarberShop } from '../types';
import { POPULAR_SERVICE_CATEGORIES } from '../data/barberShops';
import { ShopCard } from '../components/ShopCard';
import { ServiceCard } from '../components/ServiceCard';

interface HomePageProps {
  shops: BarberShop[];
  onNavigate: (view: string, shopId?: string) => void;
  onOpenBooking: (shopId?: string, serviceName?: string) => void;
  onSelectSearchLocality: (locality: string) => void;
  onSelectSearchQuery: (query: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  shops,
  onNavigate,
  onOpenBooking,
  onSelectSearchLocality,
  onSelectSearchQuery,
}) => {
  const [localityInput, setLocalityInput] = useState('Downtown');
  const [queryInput, setQueryInput] = useState('');

  const featuredShops = shops.filter((s) => s.featured).slice(0, 4);

  const popularLocalities = [
    'Downtown',
    'SoHo',
    'Williamsburg',
    'Midtown',
    'Silver Lake',
    'Wicker Park',
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localityInput.trim()) {
      onSelectSearchLocality(localityInput.trim());
    }
    if (queryInput.trim()) {
      onSelectSearchQuery(queryInput.trim());
    }
    onNavigate('explore');
  };

  const handleLocalityChipClick = (loc: string) => {
    setLocalityInput(loc);
    onSelectSearchLocality(loc);
    onNavigate('explore');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-900 text-white pt-16 pb-24 lg:pt-20 lg:pb-32">
        {/* Background Ambient Glow & Barber Photo Collage */}
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=80"
            alt="Barbershop Atmosphere"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/90 to-stone-900/80 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/80 border border-stone-700/80 text-amber-400 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Barber Shop Marketplace · Avoid The Waiting Line</span>
          </div>

          {/* Main Heading & Subtitle */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif-display tracking-tight text-white leading-tight">
              Your Next Haircut, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                Without the Wait.
              </span>
            </h1>
            <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              Discover the best barbers near you, choose your preferred time, and walk in when it’s your turn.
            </p>
          </div>

          {/* Search Box Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-stone-200/40 text-stone-900 grid grid-cols-1 sm:grid-cols-12 gap-2 text-left"
          >
            {/* Location Selector */}
            <div className="sm:col-span-4 relative flex items-center px-3 py-2 bg-stone-50 rounded-xl border border-stone-200/80">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0 mr-2.5" />
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Locality
                </label>
                <input
                  type="text"
                  value={localityInput}
                  onChange={(e) => setLocalityInput(e.target.value)}
                  placeholder="e.g. Downtown, SoHo"
                  className="w-full bg-transparent text-sm font-semibold text-stone-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Service or Shop Search */}
            <div className="sm:col-span-5 relative flex items-center px-3 py-2 bg-stone-50 rounded-xl border border-stone-200/80">
              <Search className="w-5 h-5 text-stone-400 shrink-0 mr-2.5" />
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Service or Shop
                </label>
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="e.g. Skin Fade, Beard Trim, Noble Blade"
                  className="w-full bg-transparent text-sm font-medium text-stone-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="sm:col-span-3 flex items-center">
              <button
                type="submit"
                className="w-full h-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <span>Find a Barber</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </form>

          {/* Quick Locality Selectors & Secondary Button */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-stone-400 font-medium mr-1">Trending Neighborhoods:</span>
            {popularLocalities.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => handleLocalityChipClick(loc)}
                className="px-3 py-1.5 rounded-lg bg-stone-800/70 hover:bg-stone-700/80 text-stone-200 transition-colors border border-stone-700/60"
              >
                {loc}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('explore')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 underline underline-offset-4 transition-colors"
            >
              <span>Explore all available barber shops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES SECTION */}
      <section id="popular-services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Grooming Essentials
            </span>
            <h2 className="text-3xl font-bold font-serif-display text-stone-900 tracking-tight">
              Popular Services
            </h2>
            <p className="text-stone-500 text-sm mt-1 max-w-lg">
              Book standalone cuts or complete gentleman combos from verified specialists.
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-stone-800 hover:text-amber-700 flex items-center gap-1 group self-start sm:self-end"
          >
            <span>View All Services in Shops</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {POPULAR_SERVICE_CATEGORIES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelectService={(serviceName) => onOpenBooking(undefined, serviceName)}
            />
          ))}
        </div>
      </section>

      {/* FEATURED BARBER SHOPS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Handpicked Studios
            </span>
            <h2 className="text-3xl font-bold font-serif-display text-stone-900 tracking-tight">
              Featured Barber Shops
            </h2>
            <p className="text-stone-500 text-sm mt-1 max-w-lg">
              Top-rated neighborhood establishments offering reserved appointment times today.
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Explore All {shops.length} Shops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredShops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onViewShop={(shopId) => onNavigate('shop-detail', shopId)}
              onBookNow={(shopId) => onOpenBooking(shopId)}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="bg-stone-100/70 border-y border-stone-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
              Zero Waiting Time
            </span>
            <h2 className="text-3xl font-bold font-serif-display text-stone-900 tracking-tight">
              How Trimly Works
            </h2>
            <p className="text-stone-500 text-sm">
              Say goodbye to awkward barber shop queues and wasted Saturday mornings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center font-bold text-lg font-serif-display">
                01
              </div>
              <h3 className="text-lg font-bold font-serif-display text-stone-900">
                1. Discover Shops
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Find premier barber shops near your home or office. Compare ratings, photos, vibes, transparent prices, and available barbers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center font-bold text-lg font-serif-display">
                02
              </div>
              <h3 className="text-lg font-bold font-serif-display text-stone-900">
                2. Choose Service & Slot
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Select your haircut or beard styling, choose your favorite barber, and pick an exact 30-min or 45-min open calendar slot.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center font-bold text-lg font-serif-display">
                03
              </div>
              <h3 className="text-lg font-bold font-serif-display text-stone-900">
                3. Walk In & Sit Down
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Receive instant confirmation with your booking ref. Walk straight in at your scheduled time and get straight in the chair.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE TRIMLY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            The Modern Standard
          </span>
          <h2 className="text-3xl font-bold font-serif-display text-stone-900 tracking-tight">
            Why Choose Trimly?
          </h2>
          <p className="text-stone-500 text-sm">
            Everything designed around your schedule and peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">No Unnecessary Waiting</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Say goodbye to sitting on crowded waiting benches for 45 minutes wondering when your turn will come.
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">Flexible Appointment Slots</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Live calculated schedules that take into account service durations and individual barber working hours.
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">Multiple Shops in One Place</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                A single unified marketplace to compare shops across downtown, midtown, and trendy creative districts.
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">Transparent Service Prices</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                No hidden chair fees or surprise checkout markups. See exactly what you'll pay before confirming.
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">Verified Barber Staff</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Read genuine customer feedback and select master fade artists, scissor craftsmen, or beard specialists.
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">Easy Appointment Management</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Need to reschedule or cancel? Manage your upcoming bookings in seconds directly from your customer dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP OWNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
              <Store className="w-3.5 h-3.5" />
              <span>Partner with Trimly</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-display text-white tracking-tight">
              Own a Barber Shop?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Bring your barber shop online, reach more customers, fill empty chairs during off-peak hours, and manage appointments more efficiently.
            </p>
          </div>

          <button
            onClick={() => onNavigate('list-shop')}
            className="shrink-0 py-3.5 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 group"
          >
            <span>List Your Shop</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* TESTIMONIALS (Clearly marked demonstration content) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Customer Stories
          </span>
          <h2 className="text-3xl font-bold font-serif-display text-stone-900 tracking-tight">
            What Clients Say
          </h2>
          <p className="text-stone-500 text-xs">
            * Sample demonstration testimonials from regular Trimly users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-700 leading-relaxed italic">
              "I used to lose half of my Saturday afternoon waiting at my local barbershop. With Trimly, I booked a 2:30 PM slot, walked in, sat right down with Marcus, and was on my way in 35 minutes looking sharp."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs text-stone-700">
                DM
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-900">David Miller</h5>
                <span className="text-[11px] text-stone-400">Visited The Noble Blade</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-700 leading-relaxed italic">
              "Comparing different shops by neighborhood and pricing in one place is fantastic. The booking flow took 30 seconds and didn't require me to call anyone while at work."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs text-stone-700">
                SC
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-900">Stephen Chen</h5>
                <span className="text-[11px] text-stone-400">Visited Crown & Razor Studio</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-700 leading-relaxed italic">
              "Being able to pick a specific master barber and see their exact available calendar slots is a game changer. The zero-wait experience feels like VIP service."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs text-stone-700">
                RM
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-900">Ryan Morales</h5>
                <span className="text-[11px] text-stone-400">Visited Apex Barber Lounge</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
