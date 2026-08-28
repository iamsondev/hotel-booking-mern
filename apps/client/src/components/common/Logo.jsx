import { Link } from 'react-router-dom';

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Icon mark */}
      <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-md group-hover:opacity-90 transition">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z" fill="white" />
          <rect x="9" y="15" width="6" height="6" fill="white" opacity="0.4" />
        </svg>
      </div>
      {/* Wordmark */}
      <span className="text-[1.3rem] font-black tracking-tight leading-none">
        <span className="text-[var(--text-primary)]">Get</span>
        <span className="text-[var(--color-primary)]">Nest</span>
      </span>
    </Link>
  );
}
