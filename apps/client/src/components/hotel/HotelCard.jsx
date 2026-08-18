import { Link, useNavigate } from 'react-router-dom';

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();
  if (!hotel) return null;

  const hotelId = hotel._id || hotel.id;
  const imageUrl = hotel.images?.length > 0
    ? hotel.images[0]
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';

  const handleCardClick = () => {
    if (hotelId) {
      navigate(`/hotels/${hotelId}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="card-base rounded-3xl overflow-hidden flex flex-col h-full group cursor-pointer border border-[var(--border-color)] hover:border-[var(--color-primary)]/40 transition-all duration-300 shadow-md hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-[var(--bg-card-hover)]">
        <img
          src={imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Avg rating pill */}
        {hotel.avgRating != null && (
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-[var(--bg-card)]/90 backdrop-blur-sm border border-[var(--border-color)] px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow"
            style={{ color: 'var(--color-accent)' }}>
            ★ {hotel.avgRating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Star rating row */}
        <div className="flex items-center gap-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-sm"
              style={{ color: i < (hotel.starRating ?? 0) ? 'var(--color-accent)' : 'var(--border-color)' }}>
              ★
            </span>
          ))}
        </div>

        {/* Name */}
        <h3 className="text-base font-extrabold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors mb-1.5 line-clamp-1">
          {hotel.name}
        </h3>

        {/* Location */}
        <p className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1 mb-5">
          <svg className="w-3.5 h-3.5 flex-shrink-0 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{hotel.address?.city ?? 'Location unspecified'}</span>
        </p>

        {/* CTA */}
        <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
          <Link
            to={`/hotels/${hotelId}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full inline-flex justify-center items-center text-sm font-extrabold py-2.5 px-4 rounded-2xl text-white transition-all duration-200"
            style={{ background: 'var(--color-primary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
