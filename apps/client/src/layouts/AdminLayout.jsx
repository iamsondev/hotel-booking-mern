import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Clock, CalendarCheck, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    {
      label: 'Overview',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Vendor Approvals',
      path: '/admin/pending-vendors',
      icon: UserCheck,
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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col md:flex-row font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--bg-card)] border-r border-[var(--border-color)] p-6 flex flex-col justify-between flex-shrink-0 shadow-sm">
        <div className="space-y-6">


          {/* Header Badge */}
          <div className="flex items-center space-x-3 bg-blue-50 dark:bg-slate-800/60 border border-blue-200 dark:border-slate-700 p-3 rounded-2xl">
            <div className="p-2 bg-blue-600/10 dark:bg-sky-400/20 border border-blue-600/20 dark:border-sky-400/30 rounded-xl text-blue-600 dark:text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-theme-primary">Admin Console</h2>
              <p className="text-[10px] text-theme-secondary">Platform Control</p>
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
                      ? 'bg-blue-600 dark:bg-sky-400 text-white dark:text-slate-900 shadow-md'
                      : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-card-hover'
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
        <div className="pt-6 border-t border-theme">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xs font-semibold text-theme-secondary hover:text-theme-primary transition px-3 py-2 rounded-xl hover:bg-theme-card-hover"
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
