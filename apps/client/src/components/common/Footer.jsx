import Logo from './Logo';

const footerLinks = [
  { label: 'Browse Hotels', to: '/' },
  { label: 'Sign In', to: '/login' },
  { label: 'Register', to: '/register' },
  { label: 'My Bookings', to: '/my-bookings' },
];

import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left space-y-1">
            <Logo />
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Your gateway to the world's finest stays.
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <RouterLink
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {link.label}
              </RouterLink>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-t mt-8 pt-6 text-center" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} GetNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
