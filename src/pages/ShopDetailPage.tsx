import React, { useState } from 'react';
import {
  Star,
  MapPin,
  Phone,
  Clock,
  Scissors,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  Share2,
  Heart,
  Coffee,
  Wifi,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { BarberShop } from '../types';
import { formatINR } from '../utils/bookingEngine';

interface ShopDetailPageProps {
  shop: BarberShop;
  onBack: () => void;
  onOpenBooking: (shopId: string, serviceName?: string) => void;
}

export const ShopDetailPage: React.FC<ShopDetailPageProps> = ({
  shop,
  onBack,
  onOpenBooking,
}) => {
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string>(shop.coverImage);
  const [activeTab, setActiveTab] = useState<'services' | 'barbers' | 'reviews' | 'about'>('services');

  // Group services by category
  const categories = ['All', 'Hair', 'Combos', 'Beard & Shave', 'Treatments'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredServices = selectedCategory === 'All'
    ? shop.services
    : shop.services.filter((s) => s.category === selectedCategory);

  return (
    <div className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
      {/* Top Navigation breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-stone-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Shops</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">Shop ID: {shop.id}</span>
        </div>
      </div>

      {/* Hero Cover & Gallery */}
      <div className="space-y-3">
        <div className="relative aspect-[21/9] max-h-[440px] rounded-3xl overflow-hidden shadow-md border border-stone-200/80 bg-stone-900">
          <img
            src={selectedGalleryImg}
            alt={shop.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Shop Header Details on Image */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider">
                  Verified Studio
                </span>
                <span className="text-stone-300 text-xs">
                  {shop.locality} · {shop.city}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-display text-white tracking-tight">
                {shop.name}
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm line-clamp-1">
                {shop.tagline}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-stone-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-stone-700/80">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{shop.rating.toFixed(1)}</span>
                </div>
                <span className="text-[10px] text-stone-400 block">{shop.reviewCount} reviews</span>
              </div>

              <button
                onClick={() => onOpenBooking(shop.id)}
                className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
              >
                <Scissors className="w-4 h-4 -rotate-45" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {shop.gallery.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {shop.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedGalleryImg(img)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  selectedGalleryImg === img
                    ? 'border-amber-500 scale-105 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Tabs, Services, Barbers, Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 bg-white rounded-xl p-1 shadow-sm">
            {[
              { id: 'services', label: 'Services Menu' },
              { id: 'barbers', label: 'Master Barbers' },
              { id: 'reviews', label: `Reviews (${shop.reviews.length})` },
              { id: 'about', label: 'About & Amenities' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg text-center transition-all ${
                  activeTab === tab.id
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: SERVICES MENU */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              {/* Category sub-filter */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      selectedCategory === c
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Service list cards */}
              <div className="space-y-3">
                {filteredServices.map((svc) => (
                  <div
                    key={svc.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-sm hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-md">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-stone-900">{svc.name}</h4>
                        {svc.popular && (
                          <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                            Client Favorite
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{svc.description}</p>
                      <div className="text-[11px] text-stone-400 flex items-center gap-2 pt-0.5">
                        <span className="flex items-center gap-1 text-stone-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {svc.durationMinutes} mins
                        </span>
                        <span>·</span>
                        <span>{svc.category}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <span className="text-xl font-bold font-serif-display text-stone-900 tabular-nums">
                        {formatINR(svc.price)}
                      </span>
                      <button
                        onClick={() => onOpenBooking(shop.id, svc.name)}
                        className="py-2 px-4 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Scissors className="w-3.5 h-3.5 -rotate-45" />
                        <span>Book Service</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: BARBERS TEAM */}
          {activeTab === 'barbers' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-500">
                Meet the master barbers and certified hair architects at {shop.name}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shop.barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={barber.avatar}
                        alt={barber.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-sm"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-base font-bold text-stone-900">{barber.name}</h4>
                          <span className="text-xs font-semibold text-amber-600 flex items-center gap-0.5">
                            ★ {barber.rating}
                          </span>
                        </div>
                        <span className="text-xs text-stone-600 font-medium block">{barber.role}</span>
                        <span className="text-[11px] text-stone-400 block">
                          {barber.experienceYears} years craft experience
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 text-xs">
                      <span className="text-stone-400 block mb-0.5">Signature Specialty:</span>
                      <span className="text-stone-800 font-medium">{barber.specialty}</span>
                    </div>

                    <button
                      onClick={() => onOpenBooking(shop.id)}
                      className="w-full py-2 bg-stone-50 hover:bg-amber-50 hover:text-amber-800 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 transition-colors"
                    >
                      Book with {barber.name.split(' ')[0]}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold font-serif-display text-stone-900">
                      {shop.rating.toFixed(1)}
                    </span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Based on {shop.reviewCount} customer ratings
                  </p>
                </div>
                <div className="text-xs text-stone-400 text-right">
                  <span>100% verified appointments</span>
                </div>
              </div>

              <div className="space-y-3">
                {shop.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-stone-100 font-bold text-xs text-stone-700 flex items-center justify-center">
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-stone-900">{rev.author}</h5>
                          <span className="text-[10px] text-stone-400">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    <div className="text-[11px] text-stone-500 flex items-center gap-2 pt-1 border-t border-stone-100">
                      <span>Service: <strong className="text-stone-700">{rev.serviceTaken}</strong></span>
                      <span>·</span>
                      <span>Barber: <strong className="text-stone-700">{rev.barberName}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ABOUT & AMENITIES */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Our Story
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {shop.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                  Shop Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {shop.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center gap-2.5 text-xs text-stone-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Location, Hours, Booking Policies & Quick CTA */}
        <div className="space-y-6">
          {/* Quick Booking Action Card */}
          <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Reserve Your Chair
              </span>
              <h3 className="text-xl font-bold font-serif-display text-white mt-1">
                Skip The Waiting Line
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Next slot: <strong className="text-amber-400">{shop.nextAvailableSlot}</strong>
              </p>
            </div>

            <button
              onClick={() => onOpenBooking(shop.id)}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Scissors className="w-4 h-4 -rotate-45" />
              <span>Book Appointment Now</span>
            </button>
            <p className="text-[11px] text-stone-400 text-center">
              No prepayments required · Pay at shop
            </p>
          </div>

          {/* Opening Hours Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Opening Hours
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Open Today
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-700">
                <span className="text-stone-500">Monday – Friday</span>
                <span className="font-semibold">{shop.hours.weekdays}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span className="text-stone-500">Saturday</span>
                <span className="font-semibold">{shop.hours.saturday}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span className="text-stone-500">Sunday</span>
                <span className="font-semibold">{shop.hours.sunday}</span>
              </div>
            </div>
          </div>

          {/* Location & Contact Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100">
              Address & Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 text-stone-700">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{shop.address}</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-700">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{shop.phone}</span>
              </div>
            </div>
          </div>

          {/* Booking Policies */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3 text-xs">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Trimly Booking Guarantee</span>
            </h4>
            <ul className="space-y-2 text-stone-600 list-disc list-inside text-[11px] leading-relaxed">
              <li>Free cancellation up to 1 hour prior to appointment.</li>
              <li>Please arrive 5 minutes before your scheduled slot.</li>
              <li>Barbers sanitize equipment before every client.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
