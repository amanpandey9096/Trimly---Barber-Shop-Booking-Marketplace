import React, { useState } from 'react';
import {
  Store,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldCheck,
  Users,
  Smartphone,
  Sparkles,
  ArrowRight,
  Scissors,
  Check,
} from 'lucide-react';

interface ListYourShopPageProps {
  onNavigate: (view: string) => void;
}

export const ListYourShopPage: React.FC<ListYourShopPageProps> = ({ onNavigate }) => {
  // Form state
  const [shopName, setShopName] = useState('Crown & Blade Barber Lounge');
  const [ownerName, setOwnerName] = useState('David Sterling');
  const [email, setEmail] = useState('david@crownblade.com');
  const [phone, setPhone] = useState('(555) 728-1934');
  const [locality, setLocality] = useState('Downtown');
  const [address, setAddress] = useState('184 Grand Avenue, Suite 101');
  const [chairs, setChairs] = useState('4');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Haircut',
    'Beard Trim',
    'Hot Towel Shave',
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const availableServices = [
    'Haircut',
    'Haircut & Beard Trim',
    'Beard Trim',
    'Hot Towel Shave',
    'Scalp Massage / Wash',
    'Kids Haircut',
    'Facial Scrub',
  ];

  const toggleService = (svc: string) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter((s) => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!shopName.trim()) newErrors.shopName = 'Shop name is required';
    if (!ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!address.trim()) newErrors.address = 'Street address is required';
    if (selectedServices.length === 0) newErrors.services = 'Select at least one service offered';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-14 border border-stone-800 shadow-xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
          <Store className="w-3.5 h-3.5" />
          <span>Trimly Partner Network</span>
        </div>

        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold font-serif-display tracking-tight text-white leading-tight">
            Bring Your Barber Shop Online.
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Fill empty chairs during quiet weekday hours, eliminate walk-in bottlenecks, and give your clients a seamless digital booking experience.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-stone-300">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            No setup fee
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Works on any phone or iPad
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Automated SMS reminders
          </span>
        </div>
      </div>

      {/* 4 Key Benefits */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Partner Perks
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900">
            Why Barbers Love Trimly
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">Fill Slow Hours</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Attract nearby professionals seeking morning and mid-afternoon haircut slots.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">Reduce No-Shows</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Automated reminders and calendar sync keep appointments verified and on track.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">Zero Hardware</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No expensive terminals. Manage appointments right from your barbers' existing phones.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">Barber Roster Control</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Set distinct schedules and custom service durations for each barber on your team.
            </p>
          </div>
        </div>
      </div>

      {/* Registration Section with Live Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold font-serif-display text-stone-900">
                  Shop Partner Application
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Fill in your details below. See your shop card preview update in real time on the right!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Apex Barber Co."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  {errors.shopName && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{errors.shopName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Owner / Manager Name *
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. David Sterling"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  {errors.ownerName && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{errors.ownerName}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shop@example.com"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  {errors.email && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{errors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-red-600 mt-0.5 block">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Locality / Neighborhood
                  </label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Downtown">Downtown</option>
                    <option value="SoHo">SoHo</option>
                    <option value="Williamsburg">Williamsburg</option>
                    <option value="Midtown">Midtown</option>
                    <option value="Silver Lake">Silver Lake</option>
                    <option value="Wicker Park">Wicker Park</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Number of Barber Chairs
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={chairs}
                    onChange={(e) => setChairs(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Suite 400"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                {errors.address && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{errors.address}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Services Offered * (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableServices.map((svc) => {
                    const isChecked = selectedServices.includes(svc);
                    return (
                      <button
                        key={svc}
                        type="button"
                        onClick={() => toggleService(svc)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold'
                            : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{svc}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.services && (
                  <span className="text-[11px] text-red-600 mt-1 block">{errors.services}</span>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>Submit Partner Application</span>
                </button>
                <p className="text-[11px] text-stone-400 text-center mt-2">
                  * Simulated partner onboarding demonstration. No real contracts or charges.
                </p>
              </div>
            </form>
          ) : (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Application Received
                </span>
                <h3 className="text-2xl font-bold font-serif-display text-stone-900">
                  Welcome to Trimly, {shopName}!
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Your listing demonstration has been pre-approved. Your profile is ready to accept simulated appointments.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 text-left max-w-md mx-auto space-y-1.5">
                <div><strong>Shop:</strong> {shopName}</div>
                <div><strong>Locality:</strong> {locality}</div>
                <div><strong>Chairs:</strong> {chairs} active chairs</div>
                <div><strong>Contact:</strong> {email} · {phone}</div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setSubmitted(false)}
                  className="py-2.5 px-4 rounded-xl border border-stone-300 text-xs font-semibold hover:bg-stone-50"
                >
                  Edit Application
                </button>
                <button
                  onClick={() => onNavigate('explore')}
                  className="py-2.5 px-5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800"
                >
                  Explore Other Shops
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Live Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Live Marketplace Card Preview</span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-300 shadow-lg overflow-hidden flex flex-col">
            <div className="relative aspect-[16/10] bg-stone-800 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"
                alt="Shop preview"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-3 right-3 bg-stone-900/90 text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm">
                <span>★ 5.0</span>
                <span className="text-stone-400 font-normal">(New)</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-xs text-amber-400 font-medium block">
                  {locality || 'Downtown'}
                </span>
                <h3 className="text-lg font-bold font-serif-display text-white line-clamp-1">
                  {shopName || 'Your Shop Name'}
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-stone-600">
                <span className="font-semibold text-stone-900">$$</span>
                <span>·</span>
                <span>Starts at <strong className="text-stone-900">$35</strong></span>
                <span>·</span>
                <span>{chairs || 1} Chairs</span>
              </div>

              <div className="border-t border-stone-100 pt-2">
                <span className="text-[11px] text-stone-400 block mb-1">Offered Services:</span>
                <div className="flex flex-wrap gap-1 text-stone-700">
                  {selectedServices.slice(0, 3).map((s) => (
                    <span key={s} className="bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                      {s}
                    </span>
                  ))}
                  {selectedServices.length > 3 && (
                    <span className="text-stone-400 text-[11px] py-0.5">
                      +{selectedServices.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium flex items-center gap-1.5 border border-emerald-100">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Next slot: Today at 2:00 PM</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 italic">
            * This card shows how prospective clients will see your barber shop on the Trimly Explore directory.
          </p>
        </div>
      </div>
    </div>
  );
};
