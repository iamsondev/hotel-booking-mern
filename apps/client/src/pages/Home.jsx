import { useState } from 'react';
import { useGetHotelsQuery } from '../features/hotels/hotelApiSlice';
import HotelCard from '../components/hotel/HotelCard';
import Loader from '../components/common/Loader';
import HeroSearch from '../components/home/HeroSearch';
import WhyChooseUs from '../components/home/WhyChooseUs';
import PopularDestinations from '../components/home/PopularDestinations';

export default function Home() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, error } = useGetHotelsQuery({
    page,
    limit,
    search: search || undefined,
  });

  const handleSearch = (city) => {
    setSearch(city);
    setPage(1);
    // Scroll to hotel list after a brief tick
    setTimeout(() => {
      document.getElementById('all-hotels')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="space-y-16">
      {/* 1. Hero + Search */}
      <HeroSearch onSearch={handleSearch} />

      {/* 2. Why Choose Us */}
      <WhyChooseUs />

      {/* 3. Popular Destinations */}
      <PopularDestinations onCitySelect={handleSearch} />

      {/* 4. All Hotels Section */}
      <section id="all-hotels" className="space-y-8 scroll-mt-6">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {search ? (
                <>
                  Hotels in{' '}
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {search}
                  </span>
                </>
              ) : (
                'All Hotels'
              )}
            </h2>
            {data && !isLoading && (
              <p className="text-neutral-500 text-sm mt-1">
                {data.total ?? data.hotels?.length ?? 0} properties found
              </p>
            )}
          </div>

          {/* Clear search filter */}
          {search && (
            <button
              onClick={() => { setSearch(''); setPage(1); }}
              className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 rounded-xl transition cursor-pointer"
            >
              ✕ Clear filter: &ldquo;{search}&rdquo;
            </button>
          )}
        </div>

        {/* Loading / Error / Grid */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto">
            Failed to load hotels. Please check your backend connection.
          </div>
        ) : !data?.hotels || data.hotels.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-5xl">🏨</p>
            <p className="text-neutral-400 text-sm">
              {search
                ? `No hotels found for "${search}". Try a different city.`
                : 'No hotels available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.hotels.map((hotel) => (
                <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 pt-4 border-t border-neutral-900">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white font-medium py-2 px-5 rounded-xl text-sm border border-neutral-800 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <span className="text-sm font-semibold text-neutral-450" style={{ color: '#aaa' }}>
                  {page} / {data.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, data.totalPages))}
                  disabled={page === data.totalPages}
                  className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white font-medium py-2 px-5 rounded-xl text-sm border border-neutral-800 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
