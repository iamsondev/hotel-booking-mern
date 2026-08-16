import { useGetMyHotelsQuery } from '../../features/hotels/hotelApiSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';

export default function MyHotels() {
  const { data: hotelsResponse, isLoading, error } = useGetMyHotelsQuery();
  const hotels = hotelsResponse?.hotels || hotelsResponse || [];

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50';
      case 'pending':
        return 'bg-amber-950/80 text-amber-300 border border-amber-500/50';
      case 'rejected':
        return 'bg-red-950/80 text-red-300 border border-red-500/50';
      case 'suspended':
        return 'bg-neutral-800 text-neutral-400 border border-neutral-600';
      default:
        return 'bg-neutral-850 text-neutral-400 border border-neutral-800';
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12">
        Failed to load hotels. Please check your backend connection.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">My Hotels</h2>
          <p className="text-neutral-450 text-sm mt-1" style={{ color: '#888' }}>Select a hotel subclass to manage its rooms list or update details.</p>
        </div>
        <Link
          to="/owner/hotels/add"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-2xl transition text-sm cursor-pointer"
        >
          Add New Hotel
        </Link>
      </div>

      {!hotels || hotels.length === 0 ? (
        <div className="text-center p-12 bg-neutral-900 border border-neutral-808 rounded-3xl text-neutral-400 text-sm" style={{ borderColor: '#1c1c1c', color: '#888' }}>
          You have not added any hotels yet. Click &quot;Add New Hotel&quot; to begin!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {hotels.map((hotel) => {
            const hotelId = hotel._id || hotel.id;
            const imageUrl = hotel.images && hotel.images.length > 0 
              ? hotel.images[0] 
              : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={hotelId}
                className="bg-neutral-900 border border-neutral-850 hover:border-neutral-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition duration-200 flex flex-col justify-between"
                style={{ borderColor: '#222' }}
              >
                {/* Details Section */}
                <div>
                  <div className="aspect-[21/9] bg-neutral-805 relative overflow-hidden" style={{ background: '#181818' }}>
                    <img
                      src={imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute top-4 right-4 shadow-md">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-semibold backdrop-blur-md ${getStatusBadge(hotel.status)}`}>
                        {hotel.status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-white tracking-tight line-clamp-1">{hotel.name}</h3>
                    <p className="text-neutral-400 text-xs flex items-center leading-relaxed">
                      <svg className="w-4 h-4 mr-1 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hotel.address?.line1 ? `${hotel.address.line1}, ` : ''}{hotel.address?.city || 'City unspecified'}
                    </p>
                    <p className="text-neutral-450 text-sm line-clamp-2" style={{ color: '#aaa' }}>{hotel.description || 'No description provided.'}</p>

                    {hotel.status?.toLowerCase() === 'rejected' && (
                      <div className="bg-red-950/40 border border-red-900/60 rounded-xl p-2.5 text-xs text-red-300">
                        <span className="font-bold">Status Notice:</span> Rejected (Contact admin or update listing details for re-review)
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Section */}
                <div className="px-6 pb-6 pt-4 border-t border-neutral-850 flex items-center justify-between gap-3" style={{ borderColor: '#222' }}>
                  <button
                    onClick={() => alert('Editing hotel details config is under development')}
                    className="flex-grow text-center bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition border border-neutral-750 cursor-pointer"
                    style={{ borderColor: '#2c2c2c' }}
                  >
                    Edit Details
                  </button>
                  <Link
                    to={`/owner/hotels/${hotelId}/rooms`}
                    className="flex-grow text-center bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition cursor-pointer"
                  >
                    Manage Rooms
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
