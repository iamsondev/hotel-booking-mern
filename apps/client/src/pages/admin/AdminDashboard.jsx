import { Link } from 'react-router-dom';
import { useGetPendingHotelsQuery } from '../../features/hotels/hotelApiSlice';
import { useGetAllBookingsQuery } from '../../features/bookings/bookingApiSlice';
import { useGetAllRoomsQuery } from '../../features/rooms/roomApiSlice';
import Loader from '../../components/common/Loader';
import { ShieldCheck, Hotel, CalendarCheck, Clock, ArrowRight, TrendingUp, DollarSign, Activity, BedDouble } from 'lucide-react';

export default function AdminDashboard() {
  const { data: pendingResponse, isLoading: isPendingLoading } = useGetPendingHotelsQuery();
  const { data: bookingsResponse, isLoading: isBookingsLoading } = useGetAllBookingsQuery();
  const { data: roomsResponse, isLoading: isRoomsLoading } = useGetAllRoomsQuery();

  const pendingHotels = Array.isArray(pendingResponse)
    ? pendingResponse
    : pendingResponse?.data || pendingResponse?.hotels || [];

  const allBookings = Array.isArray(bookingsResponse)
    ? bookingsResponse
    : bookingsResponse?.data || bookingsResponse?.bookings || [];

  const allRooms = Array.isArray(roomsResponse)
    ? roomsResponse
    : roomsResponse?.data || roomsResponse?.rooms || [];

  const totalPending = pendingHotels.length;
  const totalBookings = allBookings.length;
  const totalRoomTypes = allRooms.length;

  const totalPhysicalRooms = allRooms.reduce((sum, room) => sum + (Number(room.totalRooms) || 1), 0);
  
  const confirmedBookings = Array.isArray(allBookings)
    ? allBookings.filter((b) => b.status?.toLowerCase() === 'confirmed').length
    : 0;

  const totalRevenue = Array.isArray(allBookings)
    ? allBookings
        .filter((b) => b.paymentStatus?.toLowerCase() === 'paid')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    : 0;

  if (isPendingLoading || isBookingsLoading || isRoomsLoading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4 sm:px-6 font-sans">
      {/* Top Banner / Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/90 via-neutral-900 to-purple-950/90 border border-[var(--border-color)] p-6 sm:p-8 shadow-xl text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-500/30 px-3.5 py-1 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Console</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Executive Overview
            </h1>
            <p className="text-neutral-300 text-xs sm:text-sm max-w-xl">
              Real-time platform insights, hotel vendor approval queues, and complete booking analytics.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin/pending-hotels"
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow flex items-center space-x-2 cursor-pointer"
            >
              <span>Approvals</span>
              {totalPending > 0 && (
                <span className="bg-neutral-950 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-black">
                  {totalPending}
                </span>
              )}
            </Link>
            <Link
              to="/admin/bookings"
              className="bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] text-white font-semibold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider border border-[var(--border-color)] transition flex items-center space-x-2"
            >
              <span>All Bookings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-amber-500/50 rounded-3xl p-5 transition duration-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Pending Approval</span>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">{totalPending}</span>
            <span className="text-xs text-[var(--text-muted)] font-medium">Listings</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Requires review</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-cyan-500/50 rounded-3xl p-5 transition duration-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Total System Rooms</span>
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-600 dark:text-cyan-400">
              <BedDouble className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">{totalPhysicalRooms}</span>
            <span className="text-xs text-[var(--text-muted)] font-medium">{totalRoomTypes} Types</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Total inventory capacity</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-primary)]/50 rounded-3xl p-5 transition duration-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Total Bookings</span>
            <div className="p-2.5 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-2xl text-[var(--color-primary)]">
              <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">{totalBookings}</span>
            <span className="text-xs text-[var(--text-muted)] font-medium">Reservations</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Across all hotels</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-emerald-500/50 rounded-3xl p-5 transition duration-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Active Confirmed</span>
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{confirmedBookings}</span>
            <span className="text-xs text-[var(--text-muted)] font-medium">Confirmed</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Validated guests</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-purple-500/50 rounded-3xl p-5 transition duration-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Paid Revenue</span>
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-600 dark:text-purple-400">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">${totalRevenue.toLocaleString()}</span>
            <span className="text-xs text-[var(--text-muted)] font-medium">USD</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Stripe payments</p>
        </div>
      </div>

      {/* Main Action Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400">
                  <Hotel className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[var(--text-primary)] tracking-tight">Hotel Approvals Queue</h2>
                  <p className="text-[var(--text-secondary)] text-xs">Approve new vendor property submissions</p>
                </div>
              </div>
              {totalPending > 0 && (
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1 rounded-full animate-pulse">
                  {totalPending} Action Needed
                </span>
              )}
            </div>

            <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed">
              New hotel owners submit properties for platform onboarding. Review amenities, locations, and images before publishing live.
            </p>

            {pendingHotels.length > 0 ? (
              <div className="space-y-3 pt-2">
                {pendingHotels.slice(0, 2).map((h) => (
                  <div key={h._id || h.id} className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">{h.name}</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">{h.address?.city || 'Location unavailable'}</p>
                    </div>
                    <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-semibold">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl p-6 text-center text-xs text-[var(--text-muted)]">
                ✨ Queue clean! No hotels currently awaiting approval.
              </div>
            )}
          </div>

          <Link
            to="/admin/pending-hotels"
            className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3.5 px-6 rounded-2xl transition duration-200 text-center text-xs flex items-center justify-center space-x-2 group cursor-pointer shadow"
          >
            <span>Review Pending Queue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-[var(--color-primary)]">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[var(--text-primary)] tracking-tight">Booking Management</h2>
                  <p className="text-[var(--text-secondary)] text-xs">Inspect all global customer reservations</p>
                </div>
              </div>
              <span className="bg-indigo-500/10 border border-indigo-500/30 text-[var(--color-primary)] font-bold text-xs px-3 py-1 rounded-full">
                {totalBookings} Total Recorded
              </span>
            </div>

            <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed">
              Audit customer reservations, monitor payment states (paid / unpaid), check-in schedules, and perform platform cancellation audits.
            </p>

            {allBookings.length > 0 ? (
              <div className="space-y-3 pt-2">
                {allBookings.slice(0, 2).map((b) => (
                  <div key={b._id || b.id} className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">{b.user?.name || b.user?.email || 'Guest User'}</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">{b.hotel?.name || 'Hotel'} • ${b.totalPrice}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border capitalize ${
                      b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}>
                      {b.status || 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl p-6 text-center text-xs text-[var(--text-muted)]">
                No active bookings recorded in the system yet.
              </div>
            )}
          </div>

          <Link
            to="/admin/bookings"
            className="w-full text-white font-bold py-3.5 px-6 rounded-2xl transition duration-200 text-center text-xs flex items-center justify-center space-x-2 group cursor-pointer shadow"
            style={{ background: 'var(--color-primary)' }}
          >
            <span>Explore All Reservations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
