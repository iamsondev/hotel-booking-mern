import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight } from 'lucide-react';

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();
  if (!hotel) return null;

  const hotelId = hotel._id || hotel.id;
  const imageUrl = hotel.images?.length > 0
    ? hotel.images[0]
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onClick={() => hotelId && navigate(`/hotels/${hotelId}`)}
      className="group relative flex flex-col h-full rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden" style={{ background: 'var(--bg-card-hover)' }}>
        <img
          src={imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={e => {
            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Star rating pill */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border"
          style={{
            background: 'rgba(255,255,255,0.15)',
            borderColor: 'rgba(255,255,255,0.3)',
            color: '#FFF',
          }}
        >
          {Array.from({ length: hotel.starRating ?? 0 }).map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="ml-0.5">{hotel.starRating ?? 0}-Star</span>
        </div>

        {/* Avg rating */}
        {hotel.avgRating != null && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-black backdrop-blur-md border flex items-center gap-1"
            style={{
              background: 'rgba(255,255,255,0.92)',
              borderColor: 'rgba(0,0,0,0.08)',
              color: 'var(--color-accent)',
            }}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {hotel.avgRating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Name */}
        <h3
          className="text-base font-extrabold line-clamp-1 mb-1.5 transition-colors duration-200 group-hover:text-[var(--color-primary)]"
          style={{ color: 'var(--text-primary)' }}
        >
          {hotel.name}
        </h3>

        {/* Location */}
        <p className="text-xs font-medium flex items-center gap-1.5 mb-4" style={{ color: 'var(--text-secondary)' }}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
          <span className="line-clamp-1">
            {[hotel.address?.city, hotel.address?.country].filter(Boolean).join(', ') || 'Location unspecified'}
          </span>
        </p>

        {/* Amenity pills */}
        {hotel.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {hotel.amenities.slice(0, 3).map(a => (
              <span
                key={a}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                style={{
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                {a}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/hotels/${hotelId}`); }}
            className="w-full inline-flex justify-center items-center gap-2 text-sm font-bold py-2.5 px-4 rounded-2xl text-white transition-all duration-200 group/btn cursor-pointer"
            style={{ background: 'var(--color-primary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
