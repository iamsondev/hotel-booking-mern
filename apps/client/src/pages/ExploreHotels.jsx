import { useState } from 'react';
import { useGetHotelsQuery } from '../features/hotels/hotelApiSlice';
import HotelCard from '../components/hotel/HotelCard';
import Loader from '../components/common/Loader';
import Pagination from '../components/common/Pagination';
import { Search, SlidersHorizontal, MapPin, Star, Building2, RotateCcw } from 'lucide-react';

export default function ExploreHotels() {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [starFilter, setStarFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading, error } = useGetHotelsQuery({
    page,
    limit,
    search: cityFilter || search || undefined,
  });

  const hotels = data?.hotels || [];
  const totalPages = data?.totalPages || 1;

  // Filter hotels client-side if star rating selected
  const filteredHotels = starFilter
    ? hotels.filter((h) => h.starRating === parseInt(starFilter, 10))
    : hotels;

  const handleResetFilters = () => {
    setSearch('');
    setCityFilter('');
    setStarFilter('');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/90 via-neutral-900 to-purple-950/90 border border-[var(--border-color)] p-8 shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Discover Partner Properties</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Explore All Luxury Hotels & Resorts
          </h1>
          <p className="text-neutral-400 text-sm max-w-2xl">
            Browse verified partner listings across prime destinations. Filter by city, ratings, and features to reserve your perfect stay.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Keyword Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search hotel name or keyword..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] rounded-2xl pl-11 pr-4 py-2.5 text-xs text-[var(--text-primary)] outline-none transition"
            />
          </div>

          {/* City Filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-4 top-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Filter by city (e.g. Cox's Bazar)..."
              value={cityFilter}
              onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] rounded-2xl pl-11 pr-4 py-2.5 text-xs text-[var(--text-primary)] outline-none transition"
            />
          </div>

          {/* Star Rating Select */}
          <div className="relative">
            <Star className="w-4 h-4 absolute left-4 top-3.5 text-amber-400" />
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] rounded-2xl pl-11 pr-4 py-2.5 text-xs text-[var(--text-primary)] outline-none transition capitalize"
            >
              <option value="">All Star Ratings</option>
              <option value="5">5 Star Luxury</option>
              <option value="4">4 Star Premium</option>
              <option value="3">3 Star Comfort</option>
              <option value="2">2 Star Standard</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar */}
        {(search || cityFilter || starFilter) && (
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-xs">
            <span className="text-[var(--text-secondary)] font-medium">
              Showing filtered results ({filteredHotels.length} properties)
            </span>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-1.5 text-[var(--color-primary)] hover:underline font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid View */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto">
          Failed to load hotels list. Please check backend connection.
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className="text-center py-16 space-y-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)]">
          <p className="text-5xl">🏨</p>
          <p className="text-[var(--text-muted)] text-sm">
            No properties match your active search filters. Try adjusting your query.
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-[var(--color-primary)] text-white text-xs font-bold px-5 py-2.5 rounded-2xl transition cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
