import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Star,
  DollarSign,
  Clock,
  RotateCcw,
  Scissors,
} from 'lucide-react';
import { BarberShop } from '../types';
import { ShopCard } from '../components/ShopCard';

interface ExplorePageProps {
  shops: BarberShop[];
  initialLocality?: string;
  initialQuery?: string;
  onViewShop: (shopId: string) => void;
  onBookNow: (shopId: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  shops,
  initialLocality = 'all',
  initialQuery = '',
  onViewShop,
  onBookNow,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedLocality, setSelectedLocality] = useState(initialLocality || 'all');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('all');
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc' | 'reviews'>('rating');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Extract unique localities from shops
  const localities = useMemo(() => {
    const list = Array.from(new Set(shops.map((s) => s.locality)));
    return ['all', ...list];
  }, [shops]);

  // Filtering and sorting
  const filteredShops = useMemo(() => {
    return shops
      .filter((shop) => {
        // Search query filter (shop name, description, services)
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = shop.name.toLowerCase().includes(q);
          const matchLocality = shop.locality.toLowerCase().includes(q);
          const matchService = shop.services.some((s) => s.name.toLowerCase().includes(q));
          if (!matchName && !matchLocality && !matchService) return false;
        }

        // Locality filter
        if (selectedLocality !== 'all' && shop.locality.toLowerCase() !== selectedLocality.toLowerCase()) {
          return false;
        }

        // Service category filter
        if (selectedServiceCategory !== 'all') {
          const hasCategory = shop.services.some(
            (s) => s.category.toLowerCase() === selectedServiceCategory.toLowerCase()
          );
          if (!hasCategory) return false;
        }

        // Price level filter
        if (selectedPriceLevel !== 'all') {
          const matches =
            shop.priceLevel === selectedPriceLevel ||
            (selectedPriceLevel === '₹' && (shop.priceLevel === '$' || shop.priceLevel === '₹')) ||
            (selectedPriceLevel === '₹₹' && (shop.priceLevel === '$$' || shop.priceLevel === '₹₹')) ||
            (selectedPriceLevel === '₹₹₹' && (shop.priceLevel === '$$$' || shop.priceLevel === '₹₹₹'));
          if (!matches) return false;
        }

        // Rating filter
        if (selectedRating > 0 && shop.rating < selectedRating) {
          return false;
        }

        // Availability filter
        if (selectedAvailability === 'today' && !shop.nextAvailableSlot.toLowerCase().includes('today')) {
          return false;
        }
        if (selectedAvailability === 'tomorrow' && !shop.nextAvailableSlot.toLowerCase().includes('tomorrow')) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-asc') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price-desc') return b.startingPrice - a.startingPrice;
        if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        return 0;
      });
  }, [
    shops,
    searchTerm,
    selectedLocality,
    selectedServiceCategory,
    selectedPriceLevel,
    selectedRating,
    selectedAvailability,
    sortBy,
  ]);

  const activeFilterCount = [
    selectedLocality !== 'all',
    selectedServiceCategory !== 'all',
    selectedPriceLevel !== 'all',
    selectedRating > 0,
    selectedAvailability !== 'all',
    searchTerm.trim().length > 0,
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLocality('all');
    setSelectedServiceCategory('all');
    setSelectedPriceLevel('all');
    setSelectedRating(0);
    setSelectedAvailability('all');
    setSortBy('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
          Marketplace Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-display text-stone-900 tracking-tight">
          Explore Barber Shops
        </h1>
        <p className="text-stone-500 text-sm max-w-xl">
          Discover verified local barbers, compare service menus, and reserve appointment slots with zero wait.
        </p>
      </div>

      {/* Main Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by shop name, fade, hot towel, beard..."
              className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Locality Selector */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[170px]">
              <MapPin className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="all">All Neighborhoods</option>
                {localities
                  .filter((l) => l !== 'all')
                  .map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="rating">Top Rated (★)</option>
              <option value="reviews">Most Reviews</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="lg:hidden p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 flex items-center gap-1.5 text-xs font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>
          </div>
        </div>

        {/* Desktop Filter Chips / Interactive tabs */}
        <div className="hidden lg:flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-stone-400 font-medium mr-1">Service:</span>
            {[
              { id: 'all', label: 'All Services' },
              { id: 'Hair', label: 'Haircuts' },
              { id: 'Combos', label: 'Cut & Beard Combos' },
              { id: 'Beard & Shave', label: 'Beard & Shave' },
              { id: 'Treatments', label: 'Spa / Treatments' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedServiceCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedServiceCategory === cat.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}

            <span className="text-stone-300 mx-1">|</span>

            <span className="text-stone-400 font-medium mr-1">Price:</span>
            {['all', '₹', '₹₹', '₹₹₹'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedPriceLevel(lvl)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedPriceLevel === lvl
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {lvl === 'all' ? 'All' : lvl}
              </button>
            ))}

            <span className="text-stone-300 mx-1">|</span>

            <span className="text-stone-400 font-medium mr-1">Availability:</span>
            {[
              { id: 'all', label: 'Any Time' },
              { id: 'today', label: 'Available Today' },
              { id: 'tomorrow', label: 'Available Tomorrow' },
            ].map((avail) => (
              <button
                key={avail.id}
                onClick={() => setSelectedAvailability(avail.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedAvailability === avail.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {avail.label}
              </button>
            ))}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-stone-500 hover:text-stone-900 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Mobile Filters Drawer */}
        {showFiltersMobile && (
          <div className="lg:hidden pt-3 border-t border-stone-100 space-y-3 text-xs">
            <div>
              <span className="font-semibold text-stone-700 block mb-1">Service Type:</span>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'Hair', 'Combos', 'Beard & Shave', 'Treatments'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedServiceCategory(cat)}
                    className={`px-2.5 py-1 rounded-md ${
                      selectedServiceCategory === cat
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {cat === 'all' ? 'All Services' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-stone-700 block mb-1">Availability:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Any' },
                  { id: 'today', label: 'Today' },
                  { id: 'tomorrow', label: 'Tomorrow' },
                ].map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAvailability(a.id)}
                    className={`px-2.5 py-1 rounded-md ${
                      selectedAvailability === a.id
                        ? 'bg-emerald-800 text-white'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="pt-2">
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2 bg-stone-100 text-stone-800 font-semibold rounded-lg flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong className="text-stone-900">{filteredShops.length}</strong> barber shop
          {filteredShops.length === 1 ? '' : 's'}
          {selectedLocality !== 'all' && ` in ${selectedLocality}`}
        </span>
        <span className="text-stone-400">All shops verified by Trimly</span>
      </div>

      {/* Grid of Shops or Empty State */}
      {filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onViewShop={onViewShop}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
            <Scissors className="w-6 h-6 -rotate-45" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif-display text-stone-900">
              No Barber Shops Found
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              We couldn't find any barber shops matching your current search or filter combinations.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="py-2.5 px-5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
