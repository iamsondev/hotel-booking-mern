import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function HeroSearch({ onSearch }) {
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(city.trim());
  };

  return (
    <section className="relative w-full overflow-hidden rounded-3xl min-h-[480px] flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-neutral-950 to-purple-950 z-0" />
      {/* Decorative blobs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 w-full px-6 md:px-16 py-16 space-y-8">
        {/* Tagline */}
        <div className="max-w-2xl space-y-4">
          <span className="inline-block text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 rounded-full">
            🌏 Multi-vendor hotel marketplace
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Find Your Perfect <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              StayEase
            </span>{' '}
            Destination
          </h1>
          <p className="text-neutral-400 text-base leading-relaxed max-w-xl">
            Discover thousands of hotels, resorts and boutique stays. Book with confidence — best price guaranteed.
          </p>
        </div>

        {/* Search Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-3 max-w-3xl shadow-2xl"
        >
          {/* City input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City or hotel name..."
              className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition placeholder:text-neutral-600"
            />
          </div>

          {/* Check-in */}
          <div className="flex flex-col justify-center min-w-[140px]">
            <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1 pl-1">Check-In</label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Check-out */}
          <div className="flex flex-col justify-center min-w-[140px]">
            <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1 pl-1">Check-Out</label>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl transition duration-200 hover:shadow-lg hover:shadow-indigo-500/25 cursor-pointer text-sm self-end"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
