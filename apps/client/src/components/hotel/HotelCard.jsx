import { Link } from 'react-router-dom';

export default function HotelCard({ hotel }) {
  if (!hotel) return null;

  const imageUrl = hotel.images && hotel.images.length > 0 
    ? hotel.images[0] 
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl hover:border-neutral-700 transition duration-300 flex flex-col h-full group">
      {/* Card Image */}
      <div className="relative aspect-video overflow-hidden bg-neutral-805" style={{ background: '#181818' }}>
        <img
          src={imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
          }}
        />
        {hotel.avgRating !== undefined && hotel.avgRating !== null && (
          <div className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur-md text-indigo-300 font-bold px-3 py-1 rounded-full text-xs flex items-center border border-indigo-500/20 shadow-md">
            ★ {hotel.avgRating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Stars */}
        <div className="flex items-center space-x-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`text-sm ${
                i < (hotel.starRating || 0) 
                  ? 'text-amber-400' 
                  : 'text-neutral-700'
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition duration-200">
          {hotel.name}
        </h3>

        <p className="text-neutral-400 text-sm mb-6 flex items-center">
          <svg className="w-4 h-4 mr-1 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">
            {hotel.address?.city || 'Location unspecified'}
          </span>
        </p>

        <div className="mt-auto pt-4 border-t border-neutral-800/80">
          <Link
            to={`/hotels/${hotel._id || hotel.id}`}
            className="w-full inline-flex justify-center items-center bg-neutral-950 hover:bg-indigo-650 hover:bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-2xl hover:shadow-lg hover:shadow-indigo-500/10 border border-neutral-800 hover:border-indigo-500/30 transition duration-200 text-sm cursor-pointer"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
