import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center space-x-2.5 group ${className}`}>
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
        <Home className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-tight text-white dark:text-white light:text-slate-900 group-hover:opacity-90 transition">
          Get<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Nest</span>
        </span>
      </div>
    </Link>
  );
}
