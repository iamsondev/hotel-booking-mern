import { useState } from 'react';
import {
  Search, MapPin, Calendar, Users, ArrowRight, Star, ShieldCheck, Clock, Sparkles
} from 'lucide-react';

const POPULAR_TAGS = [
  { label: "Cox's Bazar", icon: '🏖️' },
  { label: 'Sylhet', icon: '🌲' },
  { label: 'Dhaka', icon: '🏙️' },
  { label: 'Sreemangal', icon: '⛰️' },
  { label: 'Deluxe Suite', icon: '🏰' },
];

export default function HeroSearch({ onSearch }) {
  const today = new Date().toISOString().split('T')[0];

  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Guests');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(city.trim());
    }
  };

  const handleTagClick = (tagName) => {
    setCity(tagName);
    if (onSearch) {
      onSearch(tagName);
    }
  };

  return (
    <section className="relative w-full space-y-6">
      {/* ── MAIN HERO BANNER ───────────────────────────────── */}
      <div className="relative w-full rounded-[28px] overflow-hidden min-h-[520px] lg:min-h-[560px] flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-2xl border border-black/10 dark:border-white/10">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=90"
            alt="Luxury Hotel & Resort"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Subtle gradient overlays for contrast & warmth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </div>

        {/* Top Tag & Main Headline */}
        <div className="relative z-10 max-w-2xl space-y-4 pt-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>LUXURY HOTELS & RESORTS</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-md">
            Find Your Perfect <br />
            <span className="font-serif italic font-normal text-amber-200">
              Luxury Stay
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/85 text-sm sm:text-base max-w-lg font-medium leading-relaxed">
            Discover extraordinary hotels, beach resorts, and private villas with guaranteed best prices and seamless booking.
          </p>
        </div>

        {/* Floating Search Container */}
        <div className="relative z-10 w-full pt-8">
          <form onSubmit={handleSubmit}
            className="bg-white/95 dark:bg-[#181510]/95 backdrop-blur-2xl border border-white/80 dark:border-stone-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              
              {/* Destination Input (lg:col-span-4) */}
              <div className="lg:col-span-4 flex items-center gap-3 px-4 py-3 bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-xl sm:rounded-2xl transition hover:border-amber-500/50">
                <MapPin className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City, hotel, or location..."
                    className="w-full bg-transparent text-sm font-bold text-[var(--text-primary)] outline-none placeholder:text-stone-400 dark:placeholder:text-stone-500 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Check-in (lg:col-span-2.5) */}
              <div className="lg:col-span-3 flex items-center gap-3 px-4 py-3 bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-xl sm:rounded-2xl transition hover:border-amber-500/50">
                <Calendar className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
                    Check-in
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100 outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Check-out (lg:col-span-2.5) */}
              <div className="lg:col-span-3 flex items-center gap-3 px-4 py-3 bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-xl sm:rounded-2xl transition hover:border-amber-500/50">
                <Calendar className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
                    Check-out
                  </label>
                  <input
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100 outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Guests (lg:col-span-2) */}
              <div className="lg:col-span-2 flex items-center gap-2.5 px-3 py-3 bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-xl sm:rounded-2xl transition hover:border-amber-500/50">
                <Users className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-[var(--text-primary)] outline-none cursor-pointer"
                  >
                    <option value="1 Guest" className="bg-white dark:bg-stone-900">1 Guest</option>
                    <option value="2 Guests" className="bg-white dark:bg-stone-900">2 Guests</option>
                    <option value="3 Guests" className="bg-white dark:bg-stone-900">3 Guests</option>
                    <option value="4+ Guests" className="bg-white dark:bg-stone-900">4+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA (lg:col-span-12 or bottom full row on mobile) */}
              <div className="lg:col-span-12 pt-1">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl sm:rounded-2xl font-extrabold text-white text-base shadow-xl transition-all duration-200 cursor-pointer group"
                  style={{ background: 'var(--color-primary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary)')}
                >
                  <Search className="w-5 h-5" />
                  <span>Search Available Hotels</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </form>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-4 px-1">
            <span className="text-xs font-bold text-white/70 mr-1">Trending:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleTagClick(tag.label)}
                className="inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 hover:border-amber-400/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition cursor-pointer"
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUST & VALUE STRIP ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-2">
        
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500 flex-shrink-0">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[var(--text-primary)]">4.9 / 5 Rated Stays</h4>
            <p className="text-xs text-[var(--text-secondary)]">Over 15,000+ verified guest reviews</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[var(--text-primary)]">Best Price Guarantee</h4>
            <p className="text-xs text-[var(--text-secondary)]">No hidden fees, direct partner rates</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-500/10 text-sky-600 dark:text-sky-400 flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[var(--text-primary)]">Instant Confirmation</h4>
            <p className="text-xs text-[var(--text-secondary)]">Flexible check-in & 24/7 customer support</p>
          </div>
        </div>

      </div>
    </section>
  );
}

