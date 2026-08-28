import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function CalendarPopup({ selectedDate, minDate, maxDate, onChange, onClose }) {
  const today = new Date();
  const initial = selectedDate ? new Date(selectedDate) : (minDate ? new Date(minDate) : today);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const minD = minDate ? new Date(minDate) : null;
  const maxD = maxDate ? new Date(maxDate) : null;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleDayClick = (day) => {
    const clicked = new Date(viewYear, viewMonth, day);
    if (minD && clicked < minD) return;
    if (maxD && clicked > maxD) return;
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(iso);
    onClose();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const d = new Date(selectedDate);
    return d.getFullYear() === viewYear && d.getMonth() === viewMonth && d.getDate() === day;
  };

  const isToday = (day) => {
    return today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
  };

  const isDisabled = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    if (minD) { const m = new Date(minD); m.setHours(0,0,0,0); if (d < m) return true; }
    if (maxD) { const mx = new Date(maxD); mx.setHours(0,0,0,0); if (d > mx) return true; }
    return false;
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="absolute z-50 mt-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-4 w-72 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth}
          className="p-1.5 rounded-xl hover:bg-[var(--bg-input)] text-[var(--text-secondary)] transition cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-extrabold text-[var(--text-primary)]">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextMonth}
          className="p-1.5 rounded-xl hover:bg-[var(--bg-input)] text-[var(--text-secondary)] transition cursor-pointer">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-[var(--text-muted)] uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day Cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) =>
          day === null ? (
            <div key={`empty-${idx}`} />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={isDisabled(day)}
              className={`
                w-8 h-8 mx-auto text-xs font-semibold rounded-xl transition cursor-pointer
                ${isSelected(day)
                  ? 'text-white shadow-md'
                  : isToday(day)
                    ? 'border border-[var(--color-primary)] text-[var(--color-primary)] font-extrabold'
                    : isDisabled(day)
                      ? 'text-[var(--text-muted)] opacity-40 cursor-not-allowed'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-input)]'
                }
              `}
              style={isSelected(day) ? { background: 'var(--color-primary)' } : {}}
            >
              {day}
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* ── Date Field with popup calendar ── */
export default function DatePickerField({ label, value, onChange, minDate, maxDate, placeholder = 'Select date' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formatted = value
    ? new Date(value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-left transition
          bg-[var(--bg-input)] border cursor-pointer outline-none
          ${open ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/30' : 'border-[var(--border-color)] hover:border-[var(--color-primary)]/50'}
        `}
      >
        <Calendar className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
        <span className={value ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] font-normal text-xs'}>
          {formatted || placeholder}
        </span>
      </button>

      {open && (
        <CalendarPopup
          selectedDate={value}
          minDate={minDate}
          maxDate={maxDate}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
