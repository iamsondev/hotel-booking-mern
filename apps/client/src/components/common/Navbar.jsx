import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogoutMutation } from '../../features/auth/authApiSlice';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import {
  Globe, ChevronDown, Ticket,
  LayoutDashboard, Building2, LogOut,
  Menu, X, MapPin,
} from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const [logoutApi] = useLogoutMutation();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [userOpen,     setUserOpen]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [langOpen,     setLangOpen]     = useState(false);
  const [currency,     setCurrency]     = useState('USD');
  const [language,     setLanguage]     = useState('EN');

  const dropRef = useRef(null);

  const handleLogout = async () => {
    try { await logoutApi().unwrap(); navigate('/login'); }
    catch (err) { console.error(err); }
    finally { setUserOpen(false); }
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setUserOpen(false); setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLink = (to, label) => (
    <Link
      key={to} to={to}
      className={`text-sm font-semibold transition-colors duration-150 ${
        location.pathname === to
          ? 'text-[var(--color-primary)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-card) 92%, transparent)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Left — Logo + Navigation */}
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/hotels" className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition">
                Explore Stays
              </Link>
              <a href="/#destinations" className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition">
                Destinations
              </a>
              <a href="/#special-offers" className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition">
                Special Offers
              </a>
              <a href="/#experiences" className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition">
                Experiences
              </a>
            </nav>
          </div>

          {/* Right — Controls (desktop) */}
          <div className="hidden md:flex items-center gap-3" ref={dropRef}>

            {/* Language / Currency */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 rounded-xl transition cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>{language}</span>
                <span className="opacity-30">·</span>
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-xl py-2 z-50 text-xs">
                  {/* Currencies */}
                  <p className="px-3 pt-1 pb-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Currency</p>
                  {['USD ($)','EUR (€)','BDT (৳)','GBP (£)'].map((c) => {
                    const code = c.split(' ')[0];
                    return (
                      <button key={c} onClick={() => { setCurrency(code); setLangOpen(false); }}
                        className="w-full text-left px-3 py-1.5 flex items-center justify-between font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition cursor-pointer">
                        {c}
                        {currency === code && <span className="text-[var(--color-primary)] font-black">✓</span>}
                      </button>
                    );
                  })}
                  <div className="my-1 border-t border-[var(--border-color)]" />
                  {/* Languages */}
                  <p className="px-3 pt-1 pb-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Language</p>
                  {['EN (English)','BN (বাংলা)','ES (Español)'].map((l) => {
                    const code = l.split(' ')[0];
                    return (
                      <button key={l} onClick={() => { setLanguage(code); setLangOpen(false); }}
                        className="w-full text-left px-3 py-1.5 flex items-center justify-between font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition cursor-pointer">
                        {l}
                        {language === code && <span className="text-[var(--color-primary)] font-black">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2.5 border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] px-3 py-1.5 rounded-2xl transition cursor-pointer shadow-sm"
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black shadow"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-extrabold text-[var(--text-primary)] leading-none">
                      {user?.name ?? 'User'}
                    </p>
                    <p className="text-[10px] font-semibold capitalize" style={{ color: 'var(--color-accent)' }}>
                      {user?.role === 'hotelOwner' ? 'Partner' : user?.role ?? 'Guest'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </button>

                {userOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                    <div className="px-4 py-2.5 border-b border-[var(--border-color)]">
                      <p className="text-[10px] text-[var(--text-muted)]">Signed in as</p>
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      {user?.role === 'admin' && (
                        <Link to="/admin/dashboard" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition">
                          <LayoutDashboard className="w-4 h-4" style={{ color: 'var(--color-primary)' }} /> Admin Console
                        </Link>
                      )}
                      {user?.role === 'hotelOwner' && (
                        <Link to="/owner/dashboard" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition">
                          <Building2 className="w-4 h-4" style={{ color: 'var(--color-accent)' }} /> Owner Dashboard
                        </Link>
                      )}
                      {user?.role === 'user' && (
                        <Link to="/my-bookings" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition">
                          <Ticket className="w-4 h-4" style={{ color: 'var(--color-primary)' }} /> My Bookings
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-[var(--border-color)] pt-1">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition text-left cursor-pointer">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-2 transition">
                  Sign In
                </Link>
                <Link to="/register"
                  className="text-xs font-bold px-4 py-2.5 rounded-xl text-white shadow-md transition"
                  style={{ background: 'var(--color-primary)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] cursor-pointer">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--border-color)] bg-[var(--bg-card)] px-4 pb-6 pt-4 space-y-2 shadow-xl">
          <Link to="/hotels" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]">Explore Stays</Link>
          <a href="/#destinations" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]">Destinations</a>
          <a href="/#special-offers" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]">Special Offers</a>
          <a href="/#experiences" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]">Experiences</a>
          <div className="my-2 border-t border-[var(--border-color)]" />
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && <Link to="/admin/dashboard" className="block px-3 py-2 rounded-xl text-sm font-bold hover:bg-[var(--bg-card-hover)]" style={{ color: 'var(--color-primary)' }}>Admin Console</Link>}
              {user?.role === 'hotelOwner' && <Link to="/owner/dashboard" className="block px-3 py-2 rounded-xl text-sm font-bold hover:bg-[var(--bg-card-hover)]" style={{ color: 'var(--color-accent)' }}>Owner Dashboard</Link>}
              {user?.role === 'user' && <Link to="/my-bookings" className="block px-3 py-2 rounded-xl text-sm font-bold hover:bg-[var(--bg-card-hover)]" style={{ color: 'var(--color-primary)' }}>My Bookings</Link>}
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">Sign Out</button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link to="/login" className="text-center py-2.5 rounded-xl border border-[var(--border-color)] text-sm font-bold text-[var(--text-primary)]">Sign In</Link>
              <Link to="/register" className="text-center py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'var(--color-primary)' }}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
