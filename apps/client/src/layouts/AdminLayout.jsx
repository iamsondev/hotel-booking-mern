import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Clock, CalendarCheck, ArrowLeft, ShieldCheck } from 'lucide-react';
import Logo from '../components/common/Logo';
import ThemeToggle from '../components/common/ThemeToggle';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    {
      label: 'Overview',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Hotel Approvals',
      path: '/admin/pending-hotels',
      icon: Clock,
    },
    {
      label: 'All Bookings',
      path: '/admin/bookings',
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-900/90 border-r border-neutral-850 p-6 flex flex-col justify-between flex-shrink-0" style={{ borderColor: '#1f1f1f' }}>
        <div className="space-y-8">
          {/* Brand Logo & Theme Switcher */}
          <div className="flex items-center justify-between">
            <Logo />
            <ThemeToggle />
          </div>

          {/* Header Badge */}
          <div className="flex items-center space-x-3 bg-indigo-950/40 border border-indigo-800/40 p-3 rounded-2xl">
            <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-white">Admin Console</h2>
              <p className="text-[10px] text-neutral-400">Platform Control</p>
            </div>
          </div>

          {/* Nav Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-850/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to Public App */}
        <div className="pt-6 border-t border-neutral-850" style={{ borderColor: '#1f1f1f' }}>
          <Link
            to="/"
            className="flex items-center space-x-2 text-xs font-semibold text-neutral-400 hover:text-white transition px-3 py-2 rounded-xl hover:bg-neutral-850/40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
