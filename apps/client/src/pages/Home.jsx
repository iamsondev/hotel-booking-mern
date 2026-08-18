import { useState } from 'react';
import { useGetHotelsQuery } from '../features/hotels/hotelApiSlice';
import HotelCard from '../components/hotel/HotelCard';
import Loader from '../components/common/Loader';
import Pagination from '../components/common/Pagination';
import HeroSearch from '../components/home/HeroSearch';
import PopularDestinations from '../components/home/PopularDestinations';
import WhyChooseUs from '../components/home/WhyChooseUs';
import HomeFAQ from '../components/home/HomeFAQ';
import NewsletterBanner from '../components/home/NewsletterBanner';

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
    setTimeout(() => {
      document.getElementById('all-hotels')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="space-y-16 pb-12 font-sans">
      {/* 1. Hero Search Section */}
      <HeroSearch onSearch={handleSearch} />

      {/* 2. Popular City Destinations */}
      <PopularDestinations onCitySelect={handleSearch} />

      {/* 3. Real Hotels & Resorts from Database */}
      <section id="all-hotels" className="space-y-8 scroll-mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {search ? (
                <>
                  Hotels in{' '}
                  <span className="bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
                    {search}
                  </span>
                </>
              ) : (
                'All Featured Hotels & Resorts'
              )}
            </h2>
            {data && !isLoading && (
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                {data.total ?? data.hotels?.length ?? 0} properties registered
              </p>
            )}
          </div>

          {search && (
            <button
              onClick={() => { setSearch(''); setPage(1); }}
              className="text-xs text-[var(--color-primary)] hover:underline border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2 rounded-xl transition cursor-pointer font-semibold shadow-sm"
            >
              ✕ Clear filter: &ldquo;{search}&rdquo;
            </button>
          )}
        </div>

        {/* Loading / Error / Real Hotel Grid */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto">
            Failed to load hotels. Please check your backend connection.
          </div>
        ) : !data?.hotels || data.hotels.length === 0 ? (
          <div className="text-center py-16 space-y-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <p className="text-5xl">🏨</p>
            <p className="text-[var(--text-muted)] text-sm">
              {search
                ? `No hotels found for "${search}". Try a different city.`
                : 'No registered hotels available at the moment.'}
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
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </section>

      {/* 4. Why Choose Us Guarantee Section */}
      <WhyChooseUs />

      {/* 5. Frequently Asked Questions */}
      <HomeFAQ />

      {/* 6. VIP Newsletter Banner */}
      <NewsletterBanner />
    </div>
  );
}
