import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ArrowRight, Star, ShieldCheck, Clock } from 'lucide-react';

const POPULAR_TAGS = [
  { label: 'Tokyo',       emoji: '🗼' },
  { label: 'Dubai',       emoji: '🏙️' },
  { label: 'Paris',       emoji: '🇫🇷' },
  { label: 'London',      emoji: '🏰' },
  { label: 'Deluxe Suite',emoji: '✨' },
];

const trustPoints = [
  {
    icon: Star,
    iconClass: 'fill-amber-400 text-amber-400',
    bg: 'rgba(251,191,36,0.1)',
    border: 'rgba(251,191,36,0.25)',
    title: '4.9 / 5 Rated Stays',
    sub: 'Over 15,000+ verified guest reviews',
  },
  {
    icon: ShieldCheck,
    iconClass: 'text-emerald-500',
    bg: 'rgba(52,211,153,0.1)',
    border: 'rgba(52,211,153,0.2)',
    title: 'Best Price Guarantee',
    sub: 'No hidden fees — direct partner rates',
  },
  {
    icon: Clock,
    iconClass: 'text-sky-500',
    bg: 'rgba(56,189,248,0.1)',
    border: 'rgba(56,189,248,0.2)',
    title: 'Instant Confirmation',
    sub: 'Flexible check-in & 24/7 support',
  },
];

export default function HeroSearch({ onSearch }) {
  const today = new Date().toISOString().split('T')[0];
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Guests');

  const heroRef  = useRef(null);
  const headRef  = useRef(null);
  const formRef  = useRef(null);
  const trustRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-badge',  { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo('.hero-h1',    { y: 40,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 }, '-=0.3')
        .fromTo('.hero-sub',   { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .fromTo(formRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
        .fromTo('.trust-card', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 }, '-=0.2');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(city.trim());
  };

  const handleTagClick = (tagName) => {
    setCity(tagName);
    if (onSearch) onSearch(tagName);
  };

  return (
    <section ref={heroRef} className="relative w-full space-y-6">

      {/* ── HERO BANNER ── */}
      <div
        className="relative w-full rounded-[28px] overflow-hidden min-h-[520px] lg:min-h-[580px] flex flex-col justify-between p-6 sm:p-10 lg:p-14"
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=90"
            alt="Luxury Hotel"
            className="w-full h-full object-cover object-center scale-[1.03] transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
        </div>

        {/* Headline */}
        <div ref={headRef} className="relative z-10 max-w-2xl space-y-5 pt-2">
          <div
            className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-wide"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.22)' }}
          >
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>LUXURY HOTELS &amp; RESORTS</span>
          </div>

          <h1 className="hero-h1 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            Find Your Perfect{' '}
            <br />
            <span className="font-serif italic font-normal text-amber-200">Luxury Stay</span>
          </h1>

          <p className="hero-sub text-white/85 text-sm sm:text-base max-w-lg font-medium leading-relaxed">
            Discover extraordinary hotels, beach resorts & private villas with guaranteed best prices and seamless booking.
          </p>
        </div>

        {/* Search Form */}
        <div ref={formRef} className="relative z-10 w-full pt-8">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 transition-all"
            style={{
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.85)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.28)',
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">

              {/* Destination */}
              <div
                className="lg:col-span-4 flex items-center gap-3 px-4 py-3 rounded-xl sm:rounded-2xl transition-all duration-200"
                style={{ background: 'rgba(241,237,229,0.8)', border: '1px solid transparent' }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-black uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
                    Destination
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="City, hotel, or location..."
                    className="w-full bg-transparent text-sm font-bold outline-none placeholder:font-normal placeholder:text-stone-400"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {/* Check-in */}
              <div
                className="lg:col-span-3 flex items-center gap-3 px-4 py-3 rounded-xl sm:rounded-2xl transition-all duration-200"
                style={{ background: 'rgba(241,237,229,0.8)', border: '1px solid transparent' }}
              >
                <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-black uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Check-in</label>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold outline-none cursor-pointer"
                    style={{ color: 'var(--text-primary)', colorScheme: 'light' }}
                  />
                </div>
              </div>

              {/* Check-out */}
              <div
                className="lg:col-span-3 flex items-center gap-3 px-4 py-3 rounded-xl sm:rounded-2xl transition-all duration-200"
                style={{ background: 'rgba(241,237,229,0.8)', border: '1px solid transparent' }}
              >
                <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-black uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Check-out</label>
                  <input
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold outline-none cursor-pointer"
                    style={{ color: 'var(--text-primary)', colorScheme: 'light' }}
                  />
                </div>
              </div>

              {/* Guests */}
              <div
                className="lg:col-span-2 flex items-center gap-2.5 px-3 py-3 rounded-xl sm:rounded-2xl transition-all duration-200"
                style={{ background: 'rgba(241,237,229,0.8)', border: '1px solid transparent' }}
              >
                <Users className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-black uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Guests</label>
                  <select
                    value={guests}
                    onChange={e => setGuests(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold outline-none cursor-pointer"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="lg:col-span-12 pt-1">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl sm:rounded-2xl font-extrabold text-white text-base shadow-xl transition-all duration-300 cursor-pointer group"
                  style={{ background: 'var(--color-primary)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
                >
                  <Search className="w-5 h-5" />
                  <span>Search Available Hotels</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </form>

          {/* Trending tags */}
          <div className="flex flex-wrap items-center gap-2 mt-4 px-1">
            <span className="text-xs font-bold text-white/70 mr-1">Trending:</span>
            {POPULAR_TAGS.map(tag => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleTagClick(tag.label)}
                className="inline-flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,168,71,0.6)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
              >
                <span>{tag.emoji}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUST STRIP ── */}
      <div ref={trustRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-2">
        {trustPoints.map(({ icon: Icon, iconClass, bg, border, title, sub }) => (
          <motion.div
            key={title}
            whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
            className="trust-card flex items-center gap-3 p-4 rounded-2xl"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: bg, border: `1px solid ${border}` }}
            >
              <Icon className={`w-5 h-5 ${iconClass}`} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>{title}</h4>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
