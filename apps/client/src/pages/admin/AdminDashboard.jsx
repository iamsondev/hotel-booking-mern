import { Link } from 'react-router-dom';
import { useGetPendingHotelsQuery } from '../../features/hotels/hotelApiSlice';
import { useGetAllBookingsQuery } from '../../features/bookings/bookingApiSlice';
import Loader from '../../components/common/Loader';

export default function AdminDashboard() {
  const { data: pendingResponse, isLoading: isPendingLoading } = useGetPendingHotelsQuery();
  const { data: bookingsResponse, isLoading: isBookingsLoading } = useGetAllBookingsQuery();

  const pendingHotels = pendingResponse?.hotels || pendingResponse || [];
  const allBookings = bookingsResponse?.bookings || bookingsResponse || [];

  const totalPending = pendingHotels.length;
  const totalBookings = allBookings.length;
  const confirmedBookings = allBookings.filter(
    (b) => b.status?.toLowerCase() === 'confirmed'
  ).length;

  if (isPendingLoading || isBookingsLoading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h2>
        <p className="text-neutral-450 text-sm mt-1" style={{ color: '#888' }}>
          Platform-wide oversight for hotels, approvals, and reservation analytics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-6 shadow-md" style={{ borderColor: '#222' }}>
          <h3 className="text-xs font-semibold text-neutral-450 uppercase tracking-wider mb-2">Pending Approvals</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-amber-400">{totalPending}</span>
            <span className="text-neutral-500 text-xs">hotels</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-6 shadow-md" style={{ borderColor: '#222' }}>
          <h3 className="text-xs font-semibold text-neutral-450 uppercase tracking-wider mb-2">Total Bookings</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white">{totalBookings}</span>
            <span className="text-neutral-500 text-xs">reservations</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-6 shadow-md" style={{ borderColor: '#222' }}>
          <h3 className="text-xs font-semibold text-neutral-450 uppercase tracking-wider mb-2">Confirmed Bookings</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-emerald-400">{confirmedBookings}</span>
            <span className="text-neutral-500 text-xs">active</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Hotels Panel */}
        <div className="bg-neutral-900 border border-neutral-880 rounded-3xl p-8 flex flex-col justify-between gap-6" style={{ borderColor: '#1c1c1c' }}>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-amber-400 text-xl">⏳</span>
              <h3 className="text-lg font-bold text-white tracking-tight">Hotel Approvals</h3>
            </div>
            <p className="text-neutral-450 text-sm leading-relaxed" style={{ color: '#aaa' }}>
              Review newly submitted hotels and approve or reject listings before they go live on the platform.
            </p>
            {totalPending > 0 && (
              <span className="inline-block mt-2 bg-amber-950/50 text-amber-400 border border-amber-800/80 text-xs font-semibold px-3 py-1 rounded-full">
                {totalPending} awaiting review
              </span>
            )}
          </div>
          <Link
            to="/admin/pending-hotels"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-2xl transition text-center text-sm cursor-pointer"
          >
            Review Pending Hotels →
          </Link>
        </div>

        {/* All Bookings Panel */}
        <div className="bg-neutral-900 border border-neutral-880 rounded-3xl p-8 flex flex-col justify-between gap-6" style={{ borderColor: '#1c1c1c' }}>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-indigo-400 text-xl">📋</span>
              <h3 className="text-lg font-bold text-white tracking-tight">Booking Records</h3>
            </div>
            <p className="text-neutral-450 text-sm leading-relaxed" style={{ color: '#aaa' }}>
              View and filter all platform-wide booking reservations including statuses, payment details, and user information.
            </p>
            {totalBookings > 0 && (
              <span className="inline-block mt-2 bg-indigo-950/50 text-indigo-400 border border-indigo-800/80 text-xs font-semibold px-3 py-1 rounded-full">
                {totalBookings} total bookings recorded
              </span>
            )}
          </div>
          <Link
            to="/admin/bookings"
            className="w-full bg-neutral-800 hover:bg-neutral-750 border border-neutral-750 text-neutral-200 font-semibold py-2.5 px-6 rounded-2xl transition text-center text-sm cursor-pointer"
            style={{ borderColor: '#2c2c2c' }}
          >
            View All Bookings →
          </Link>
        </div>
      </div>
    </div>
  );
}
