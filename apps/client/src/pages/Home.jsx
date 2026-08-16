import { useState } from 'react';
import { useGetHotelsQuery } from '../features/hotels/hotelApiSlice';
import HotelCard from '../components/hotel/HotelCard';
import Loader from '../components/common/Loader';

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6; // list 6 hotels per page

  // fetch data using RTK query matching parameters
  const { data, isLoading, error } = useGetHotelsQuery({
    page,
    limit,
    search: search || undefined
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1); // reset to page 1 on new search
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data && page < data.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950/70 via-neutral-900 to-purple-950/70 border border-neutral-800/80 p-8 md:p-12 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-2xl text-center md:text-left relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Discover Your Next <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">StayEase</span> Destination
          </h1>
          <p className="text-neutral-400 text-sm md:text-base mb-8 leading-relaxed">
            Find the finest houses, hotels, and luxury suites tailored for comfort and productivity.
          </p>
          
          {/* Search Inputs */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by city or hotel name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-neutral-950/90 border border-neutral-805 focus:border-indigo-500 rounded-2xl pl-12 pr-4 py-3 text-white outline-none focus:outline-none transition-all focus:ring-1 focus:ring-indigo-500 text-sm"
                style={{ borderColor: '#262626' }}
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-2xl transition duration-300 hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer text-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Grid View */}
      <div>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto">
            Failed to load hotels list. Please check your backend connection.
          </div>
        ) : !data?.hotels || data.hotels.length === 0 ? (
          <div className="text-center p-12 bg-neutral-900 border border-neutral-808 rounded-3xl text-neutral-450 text-sm max-w-lg mx-auto" style={{ borderColor: '#1c1c1c', color: '#888' }}>
            No hotels matching your criteria could be found.
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hotels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.hotels.map((hotel) => (
                <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
              ))}
            </div>

            {/* Pagination Controls */}
            {data.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 pt-6 border-t border-neutral-900">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-xl transition duration-150 text-sm cursor-pointer disabled:cursor-not-allowed border border-neutral-800"
                >
                  Previous
                </button>
                <span className="text-sm font-semibold text-neutral-450" style={{ color: '#aaa' }}>
                  Page {page} of {data.totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === data.totalPages}
                  className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-xl transition duration-150 text-sm cursor-pointer disabled:cursor-not-allowed border border-neutral-800"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
