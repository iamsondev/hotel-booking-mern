import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BedDouble, Wifi, Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function RoomCard({ room, hotelId }) {
  const navigate = useNavigate();

  if (!room) return null;

  const roomImage = room.images && room.images.length > 0
    ? room.images[0]
    : 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-primary)]/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full"
    >
      <div>
        {/* Room Image Preview */}
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
          <img
            src={roomImage}
            alt={room.roomType || 'Luxury Suite'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          
          {/* Room Type Tag */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>{room.roomType || 'Standard Suite'}</span>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-3 right-3 bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border-color)] px-3 py-1.5 rounded-2xl text-right shadow-lg">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-[var(--color-primary)]">${room.pricePerNight}</span>
              <span className="text-[10px] text-[var(--text-muted)] font-semibold">/ night</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition">
              {room.roomType || 'Standard Suite'}
            </h4>
            {room.isAvailable !== false && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Available
              </span>
            )}
          </div>

          {/* Features Row */}
          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] font-medium pt-1 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[var(--color-primary)]" />
              {(() => {
                const adults = room.capacity?.adults ?? room.adults ?? 2;
                const children = room.capacity?.children ?? room.children ?? 0;
                const total = adults + children;
                return <span>{total} {total === 1 ? 'Guest' : 'Guests'}</span>;
              })()}
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-[var(--color-accent)]" />
              <span>King Bed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span>Free WiFi</span>
            </div>
          </div>

          {/* Amenities Badges */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {room.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border border-[var(--border-color)] text-[11px] font-semibold px-2.5 py-1 rounded-xl capitalize"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0">
        <button
          onClick={() => navigate(`/booking/${room._id || room.id}`)}
          className="w-full text-white font-bold py-3 px-5 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
          style={{ background: 'var(--color-primary)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
        >
          <span>Reserve Room</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}

