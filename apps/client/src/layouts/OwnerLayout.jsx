import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Building2, PlusCircle, ArrowLeft, Sparkles } from 'lucide-react';

export default function OwnerLayout() {
  const location = useLocation();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/owner/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'My Hotels',
      path: '/owner/hotels',
      icon: Building2,
    },
    {
      label: 'Add Hotel',
      path: '/owner/hotels/add',
      icon: PlusCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col md:flex-row font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--bg-card)] border-r border-[var(--border-color)] p-6 flex flex-col justify-between flex-shrink-0 shadow-sm">
        <div className="space-y-6">


          {/* Header Badge */}
          <div className="flex items-center space-x-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 p-3 rounded-2xl">
            <div className="p-2 bg-amber-600/10 dark:bg-amber-400/20 border border-amber-600/20 dark:border-amber-400/30 rounded-xl text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-theme-primary">Owner Portal</h2>
              <p className="text-[10px] text-theme-secondary">Partner Console</p>
            </div>
          </div>

          {/* Navigation Links */}
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
