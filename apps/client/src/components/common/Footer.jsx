import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Browse Hotels', to: '/' },
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
  { label: 'My Bookings', to: '/my-bookings' },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-850 mt-auto" style={{ borderColor: '#1c1c1c' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-white">Stay</span>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Ease</span>
            </span>
            <p className="text-neutral-500 text-xs mt-1">Find your perfect stay, anywhere.</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-neutral-500 hover:text-indigo-400 text-sm transition duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-850 mt-8 pt-6 text-center" style={{ borderColor: '#1c1c1c' }}>
          <p className="text-neutral-600 text-xs">
            © {new Date().getFullYear()} StayEase. All rights reserved. Built with ❤️ using React & Redux Toolkit.
          </p>
        </div>
      </div>
    </footer>
  );
}
