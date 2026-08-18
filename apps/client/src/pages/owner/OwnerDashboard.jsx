import { useSelector } from 'react-redux';
import { useGetMyHotelsQuery } from '../../features/hotels/hotelApiSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { Building2, PlusCircle, CheckCircle2, Clock, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';

export default function OwnerDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { data: hotelsResponse, isLoading, error } = useGetMyHotelsQuery();
  const hotels = Array.isArray(hotelsResponse)
    ? hotelsResponse
    : hotelsResponse?.data || hotelsResponse?.hotels || [];

  const totalHotels = hotels.length;
  const pendingHotels = hotels.filter((h) => h.status?.toLowerCase() === 'pending').length;
  const approvedHotels = hotels.filter(
    (h) => h.status?.toLowerCase() === 'approved' || h.status?.toLowerCase() === 'active'
  ).length;

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12">
        Failed to load owner dashboard stats. Please check your backend connection.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4 sm:px-6 font-sans">
      {/* Pending Verification Alert */}
      {user && user.isApproved === false && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start space-x-3 text-amber-700 dark:text-amber-300 shadow-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h4 className="font-bold">Account Pending Verification</h4>
            <p className="opacity-90 mt-0.5">
              Your account is pending admin verification. You can still add hotels, but they&apos;ll need approval before going live.
            </p>
          </div>
        </div>
      )}

      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/90 via-neutral-900 to-purple-950/90 border border-[var(--border-color)] p-6 sm:p-8 shadow-xl text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-500/30 px-3.5 py-1 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Owner Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Property Partner Hub
            </h1>
            <p className="text-neutral-300 text-xs sm:text-sm max-w-xl">
              Manage hotel properties, room listings, pricing tiers, and track approval status.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/owner/hotels/add"
              className="bg-[var(--color-primary)] hover:opacity-90 text-white font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Hotel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-primary)]/50 rounded-3xl p-6 transition duration-300 shadow-sm overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Total Properties</span>
            <div className="p-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-2xl text-[var(--color-primary)]">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">{totalHotels}</span>
            <span className="text-xs text-[var(--text-muted)] font-medium">Hotels</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Registered under your account</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-emerald-500/50 rounded-3xl p-6 transition duration-300 shadow-sm overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Active & Published</span>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{approvedHotels}</span>
            <span className="text-xs text-[var(--text-muted)] font-medium">Live</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Visible to all travelers</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-amber-500/50 rounded-3xl p-6 transition duration-300 shadow-sm overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Under Review</span>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{pendingHotels}</span>
            <span className="text-xs text-[var(--text-muted)] font-medium">Pending</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Awaiting admin approval</p>
        </div>
      </div>

      {/* Console Quick Action Hub */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 text-left">
          <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] tracking-tight">Property Management Console</h2>
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed max-w-xl">
            Control property details, upload gallery photos, configure room inventories, and manage night rates.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            to="/owner/hotels"
            className="text-white font-bold py-3 px-6 rounded-2xl transition text-center text-xs cursor-pointer shadow flex items-center justify-center space-x-2 group"
            style={{ background: 'var(--color-primary)' }}
          >
            <span>Manage Properties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
          <Link
            to="/owner/hotels/add"
            className="bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold py-3 px-6 rounded-2xl transition text-center text-xs cursor-pointer flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Add Property</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
