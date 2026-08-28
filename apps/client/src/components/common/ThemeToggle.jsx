import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); toggleTheme(); }}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
      className={`
        w-9 h-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]
        flex items-center justify-center
        hover:bg-[var(--bg-card-hover)] transition-all duration-200 cursor-pointer shadow-sm
        ${className}
      `}
    >
      {theme === 'dark'
        ? <Sun  className="w-4 h-4 text-[var(--color-accent)]" />
        : <Moon className="w-4 h-4 text-[var(--color-primary)]" />
      }
    </button>
  );
}
