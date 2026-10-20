import React from 'react';
import { Star, MapPin, Clock, ArrowRight, Scissors } from 'lucide-react';
import { BarberShop } from '../types';
import { formatINR } from '../utils/bookingEngine';

interface ShopCardProps {
  shop: BarberShop;
  onViewShop: (shopId: string) => void;
  onBookNow: (shopId: string) => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, onViewShop, onBookNow }) => {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-stone-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image with overlay badge */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={shop.coverImage}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Rating & Review overlay */}
        <div className="absolute top-3 right-3 bg-stone-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{shop.rating.toFixed(1)}</span>
          <span className="text-stone-400 font-normal">({shop.reviewCount})</span>
        </div>

        {/* Locality bottom overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1 text-xs text-stone-200 mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium">{shop.locality}, {shop.city}</span>
          </div>
          <h3 className="text-xl font-bold font-serif-display tracking-tight text-white line-clamp-1">
            {shop.name}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Tagline / Subtitle */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
            {shop.tagline}
          </p>

          {/* Clean unboxed metadata (anti-slop: clean text with dividers) */}
          <div className="flex items-center gap-2 text-xs text-stone-600 mb-3">
            <span className="font-semibold text-stone-900">{shop.priceLevel}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Starts at <strong className="text-stone-900">{formatINR(shop.startingPrice)}</strong></span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{shop.barbers.length} Barbers</span>
          </div>

          {/* Popular services preview */}
          <div className="text-xs text-stone-500 border-t border-stone-100 pt-3">
            <span className="text-stone-400 font-medium block mb-1">Top Services:</span>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-stone-700">
              {shop.services.slice(0, 3).map((service, idx) => (
                <span key={service.id} className="inline-flex items-center">
                  <span className="hover:text-amber-700">{service.name} (${service.price})</span>
                  {idx < 2 && <span className="ml-2 text-stone-300">/</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Next Available Slot & Actions */}
        <div className="pt-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mb-3 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-100/60">
            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Next available: <strong>{shop.nextAvailableSlot}</strong></span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewShop(shop.id)}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-800 hover:bg-stone-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            >
              <span>View Shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onBookNow(shop.id)}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Scissors className="w-3.5 h-3.5 -rotate-45" />
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
