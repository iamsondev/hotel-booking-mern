import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGetHotelByIdQuery } from '../features/hotels/hotelApiSlice';
import { useGetRoomsByHotelQuery } from '../features/rooms/roomApiSlice';
import RoomCard from '../components/room/RoomCard';
import Loader from '../components/common/Loader';
import {
  Star, MapPin, Share2, Heart, ShieldCheck, Wifi, Coffee,
  Sparkles, Check, ChevronRight, X, Maximize2, Award, Clock,
  ArrowRight, Utensils, Waves, Dumbbell, Car, CheckCircle2,
  Calendar, Info, AlertCircle, PhoneCall, Globe
} from 'lucide-react';

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: hotelData, isLoading: isHotelLoading, error: hotelError } = useGetHotelByIdQuery(id);
  const { data: roomsData, isLoading: isRoomsLoading, error: roomsError } = useGetRoomsByHotelQuery(id);

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);

  const headerRef = useRef(null);
  const galleryRef = useRef(null);
  const roomsSectionRef = useRef(null);

  const hotel = hotelData?.data || hotelData?.hotel || (hotelData?._id ? hotelData : null);
  const rooms = Array.isArray(roomsData) ? roomsData : (roomsData?.data || roomsData?.rooms || []);

  const isLoading = isHotelLoading || isRoomsLoading;
  const isError = hotelError || roomsError;

  // GSAP animations on page load
  useEffect(() => {
    if (!isLoading && hotel && headerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.gsap-fade-up',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
        );
        gsap.fromTo(
          galleryRef.current,
          { scale: 0.96, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.2 }
        );
      }, headerRef);
      return () => ctx.revert();
    }
  }, [isLoading, hotel]);

  const scrollToRooms = () => {
    roomsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) return <Loader />;

  if (isError || !hotel) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-12 bg-red-950/20 border border-red-900/30 rounded-3xl text-red-400 text-sm max-w-lg mx-auto my-16 shadow-2xl"
      >
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400 opacity-80" />
        <h3 className="text-xl font-bold text-white mb-2">Hotel Details Unavailable</h3>
        <p className="text-neutral-400 text-xs mb-6">
          We could not load information for this hotel. It may have been removed or is temporarily unreachable.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl transition text-xs cursor-pointer"
        >
          Return to Home
        </button>
      </motion.div>
    );
  }

  const defaultImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  ];

  const images = hotel.images && hotel.images.length > 0 ? hotel.images : defaultImages;
  const startingPrice = rooms && rooms.length > 0
    ? Math.min(...rooms.map(r => r.pricePerNight || 999))
    : 199;

  const amenityIcons = {
    wifi: <Wifi className="w-4 h-4 text-indigo-400" />,
    pool: <Waves className="w-4 h-4 text-blue-400" />,
    dining: <Utensils className="w-4 h-4 text-amber-400" />,
    spa: <Sparkles className="w-4 h-4 text-purple-400" />,
    gym: <Dumbbell className="w-4 h-4 text-emerald-400" />,
    parking: <Car className="w-4 h-4 text-emerald-400" />,
    breakfast: <Coffee className="w-4 h-4 text-amber-400" />,
  };

  return (
    <div className="space-y-12 pb-16 font-sans text-[var(--text-primary)]">
      
      {/* Top Header & Breadcrumb */}
      <div ref={headerRef} className="space-y-4">
        <div className="flex items-center justify-between gsap-fade-up">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
            <span className="cursor-pointer hover:text-[var(--color-primary)] transition" onClick={() => navigate('/')}>Stays</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="capitalize">{hotel.address?.city || 'Featured'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[var(--text-primary)] font-bold truncate">{hotel.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2.5 rounded-2xl border transition cursor-pointer ${
                isSaved
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
              className="p-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-white transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title, Star Rating, Badges */}
        <div className="space-y-3 gsap-fade-up">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 bg-amber-400/10 border border-amber-400/30 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{hotel.starRating || 5}-Star Luxury Haven</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Stay Ease Partner
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
            {hotel.name}
          </h1>

          <p className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
            <span>
              {hotel.address?.line1 ? `${hotel.address.line1}, ` : ''}
              {hotel.address?.city || 'Location'}, {hotel.address?.country || ''}
            </span>
            <span className="opacity-30">·</span>
            <span className="text-[var(--color-accent)] font-semibold text-xs">Prime Location (9.8 Score)</span>
          </p>
        </div>
      </div>

      {/* Modern Bento Photo Gallery Showcase */}
      <div ref={galleryRef} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 aspect-[16/9] max-h-[520px]">
          {/* Main Hero Photo */}
          <div
            onClick={() => setLightboxOpen(true)}
            className="lg:col-span-3 relative rounded-3xl overflow-hidden border border-[var(--border-color)] bg-neutral-900 group cursor-pointer shadow-2xl"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={images[activeImage]}
                alt={hotel.name}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <button
              onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
              className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-2xl border border-white/20 flex items-center gap-2 transition cursor-pointer shadow-lg"
            >
              <Maximize2 className="w-4 h-4 text-[var(--color-accent)]" />
              <span>Full Gallery ({images.length})</span>
            </button>
          </div>

          {/* Side Thumbnail Stack (Desktop) */}
          <div className="hidden lg:flex flex-col gap-4">
            {images.slice(0, 3).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative flex-1 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                  activeImage === idx
                    ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30 scale-[0.98]'
                    : 'border-transparent opacity-75 hover:opacity-100 hover:scale-[1.02]'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Horizontal Thumbnail Scroller */}
        {images.length > 1 && (
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 scrollbar-none">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  activeImage === index ? 'border-[var(--color-primary)] scale-95' : 'border-transparent opacity-70'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content & Sticky Booking Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column — Detailed Info & Tabs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-[var(--border-color)] space-x-6 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Overview & Story' },
              { id: 'amenities', label: 'Luxury Amenities' },
              { id: 'surroundings', label: 'Location & Highlights' },
              { id: 'policies', label: 'Stay Policies' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-extrabold transition-all relative cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'var(--color-primary)' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content Panes */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">About {hotel.name}</h3>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {hotel.description ||
                      `Experience unmatched hospitality and architectural elegance at ${hotel.name}. Situated in a prime location, our resort blends modern sophistication with world-class amenities to ensure an unforgettable stay for discerning travelers.`}
                  </p>
                </div>

                {/* Key Highlights Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-[var(--text-muted)] tracking-wider">Check-In</p>
                    <p className="text-xs font-black text-[var(--text-primary)]">2:00 PM onwards</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-[var(--text-muted)] tracking-wider">Check-Out</p>
                    <p className="text-xs font-black text-[var(--text-primary)]">Until 12:00 PM</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-[var(--text-muted)] tracking-wider">Front Desk</p>
                    <p className="text-xs font-black text-emerald-400">24/7 Concierge</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-[var(--text-muted)] tracking-wider">Cancellation</p>
                    <p className="text-xs font-black text-[var(--color-accent)]">Free options</p>
                  </div>
                </div>

                {/* Property Perks */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">Why guests love staying here</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: 'Prime Location', desc: 'Situated close to top cultural sights & fine dining.' },
                      { title: 'Superb Service', desc: 'Rated 9.9 for friendly and attentive hospitality.' },
                      { title: 'Luxury Comforts', desc: 'Premium bedding, soundproof rooms & high-speed Wi-Fi.' },
                      { title: 'Flexible Booking', desc: 'Reserve now with no immediate hidden fees.' },
                    ].map((perk, i) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-[var(--text-primary)]">{perk.title}</p>
                          <p className="text-[11px] text-[var(--text-muted)]">{perk.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'amenities' && (
              <motion.div
                key="amenities"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Featured Amenities & Facilities</h3>
                {hotel.amenities && hotel.amenities.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {hotel.amenities.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm hover:border-[var(--color-primary)]/40 transition"
                      >
                        <div className="p-2 rounded-xl bg-[var(--bg-card-hover)] border border-[var(--border-color)]">
                          {amenityIcons[item.toLowerCase()] || <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />}
                        </div>
                        <span className="text-xs font-bold text-[var(--text-primary)] capitalize">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)]">Full list of amenities is available during check-in.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'surroundings' && (
              <motion.div
                key="surroundings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Location & Nearby Attractions</h3>
                <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl space-y-3">
                  <div className="flex items-center justify-between text-xs py-2 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)] font-medium">International Airport</span>
                    <span className="font-bold text-[var(--text-primary)]">14.2 km</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)] font-medium">City Promenade & Shopping</span>
                    <span className="font-bold text-[var(--text-primary)]">0.8 km</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)] font-medium">Oceanfront Beach Access</span>
                    <span className="font-bold text-[var(--text-primary)]">1.5 km</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2">
                    <span className="text-[var(--text-secondary)] font-medium">Central Train Station</span>
                    <span className="font-bold text-[var(--text-primary)]">3.5 km</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'policies' && (
              <motion.div
                key="policies"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 text-xs text-[var(--text-secondary)]"
              >
                <h3 className="text-xl font-bold text-[var(--text-primary)]">House Policies & Terms</h3>
                <div className="space-y-3 p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl">
                  <p><strong className="text-[var(--text-primary)]">Check-in:</strong> 2:00 PM - 11:30 PM. Guests are required to show photo ID at check-in.</p>
                  <p><strong className="text-[var(--text-primary)]">Check-out:</strong> 11:00 AM - 12:00 PM.</p>
                  <p><strong className="text-[var(--text-primary)]">Children & Extra Beds:</strong> Children of all ages are welcome. Cribs available upon request.</p>
                  <p><strong className="text-[var(--text-primary)]">Pets:</strong> Pets allowed with prior notification to concierge.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column — Sticky Luxury Reservation Summary Card */}
        <div className="sticky top-24 space-y-6">
          <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Price & Rating Header */}
            <div className="flex items-baseline justify-between border-b border-[var(--border-color)] pb-4">
              <div>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Starts from</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[var(--color-primary)]">${startingPrice}</span>
                  <span className="text-xs text-[var(--text-muted)] font-bold">/ night</span>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-1 bg-amber-400/10 px-2.5 py-1 rounded-xl text-xs font-black text-amber-400 border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.9 / 5</span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">128 Verified Reviews</p>
              </div>
            </div>

            {/* Availability Status */}
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Rooms available for your selected stay dates!</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={scrollToRooms}
              className="w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              style={{ background: 'var(--color-primary)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
            >
              <span>View Available Rooms</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Guarantee points */}
            <div className="space-y-2 pt-2 text-[11px] text-[var(--text-muted)] font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Instant Confirmation & Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Free cancellation up to 24h before check-in</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-[var(--border-color)]" />

      {/* Available Rooms Section */}
      <div ref={roomsSectionRef} className="space-y-8 pt-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[var(--color-accent)] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Accommodations
            </span>
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Available Suites & Rooms</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">Select your preferred suite to proceed with seamless booking.</p>
          </div>

          {rooms && rooms.length > 0 && (
            <span className="text-xs font-bold text-[var(--text-secondary)] bg-[var(--bg-card)] px-3 py-1.5 rounded-xl border border-[var(--border-color)]">
              {rooms.length} Suites Listed
            </span>
          )}
        </div>

        {!rooms || rooms.length === 0 ? (
          <div className="text-center p-12 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl text-[var(--text-muted)] text-xs max-w-md mx-auto">
            No room listings available for this property currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room._id || room.id} room={room} hotelId={id} />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Full Gallery Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full">
              <div>
                <h4 className="text-lg font-bold">{hotel.name}</h4>
                <p className="text-xs text-neutral-400">Photo {activeImage + 1} of {images.length}</p>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Main Image */}
            <div className="relative max-w-5xl mx-auto w-full aspect-[16/10] max-h-[70vh] flex items-center justify-center">
              <motion.img
                key={activeImage}
                src={images[activeImage]}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-contain rounded-2xl shadow-2xl"
              />
            </div>

            {/* Modal Thumbnails Footer */}
            <div className="flex gap-2 overflow-x-auto justify-center max-w-4xl mx-auto w-full py-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                    activeImage === i ? 'border-indigo-500 scale-105' : 'border-transparent opacity-50'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
