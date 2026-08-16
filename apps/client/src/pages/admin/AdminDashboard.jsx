import { Link } from 'react-router-dom';
import { useGetPendingHotelsQuery } from '../../features/hotels/hotelApiSlice';
import { useGetAllBookingsQuery } from '../../features/bookings/bookingApiSlice';
import Loader from '../../components/common/Loader';
import { ShieldCheck, Hotel, CalendarCheck, Clock, ArrowRight, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const { data: pendingResponse, isLoading: isPendingLoading } = useGetPendingHotelsQuery();
  const { data: bookingsResponse, isLoading: isBookingsLoading } = useGetAllBookingsQuery();

  const pendingHotels = Array.isArray(pendingResponse)
    ? pendingResponse
    : pendingResponse?.data || pendingResponse?.hotels || [];

  const allBookings = Array.isArray(bookingsResponse)
    ? bookingsResponse
    : bookingsResponse?.data || bookingsResponse?.bookings || [];

  const totalPending = pendingHotels.length;
  const totalBookings = allBookings.length;
  
  const confirmedBookings = Array.isArray(allBookings)
    ? allBookings.filter((b) => b.status?.toLowerCase() === 'confirmed').length
    : 0;

  const totalRevenue = Array.isArray(allBookings)
    ? allBookings
        .filter((b) => b.paymentStatus?.toLowerCase() === 'paid')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    : 0;

  if (isPendingLoading || isBookingsLoading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4">
      {/* Top Banner / Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-neutral-900 to-purple-950/80 border border-neutral-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Executive Overview
            </h1>
            <p className="text-neutral-400 text-sm max-w-xl">
              Real-time platform insights, hotel vendor approval queues, and complete booking analytics.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin/pending-hotels"
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center space-x-2"
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
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider border border-neutral-700 transition flex items-center space-x-2"
            >
              <span>All Bookings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pending Approvals */}
        <div className="relative group bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/50 rounded-3xl p-6 transition duration-300 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Pending Approval</span>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 group-hover:scale-110 transition duration-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-400">{totalPending}</span>
            <span className="text-xs text-neutral-500 font-medium">Listings</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Requires verification review</p>
        </div>

        {/* Total Reservations */}
        <div className="relative group bg-neutral-900/90 border border-neutral-800 hover:border-indigo-500/50 rounded-3xl p-6 transition duration-300 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Bookings</span>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 group-hover:scale-110 transition duration-300">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{totalBookings}</span>
            <span className="text-xs text-neutral-500 font-medium">Reservations</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Across all partner hotels</p>
        </div>

        {/* Confirmed Bookings */}
        <div className="relative group bg-neutral-900/90 border border-neutral-800 hover:border-emerald-500/50 rounded-3xl p-6 transition duration-300 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Active Confirmed</span>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 group-hover:scale-110 transition duration-300">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400">{confirmedBookings}</span>
            <span className="text-xs text-neutral-500 font-medium">Confirmed</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Validated & ready guests</p>
        </div>

        {/* Estimated Gross Revenue */}
        <div className="relative group bg-neutral-900/90 border border-neutral-800 hover:border-purple-500/50 rounded-3xl p-6 transition duration-300 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Paid Revenue</span>
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 group-hover:scale-110 transition duration-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-purple-400">${totalRevenue.toLocaleString()}</span>
            <span className="text-xs text-neutral-500 font-medium">USD</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Settled Stripe payments</p>
        </div>
      </div>

      {/* Main Action Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Hotels Review Hub */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-2xl">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
                  <Hotel className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Hotel Approvals Queue</h2>
                  <p className="text-neutral-400 text-xs mt-0.5">Approve new vendor property submissions</p>
                </div>
              </div>
              {totalPending > 0 && (
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs px-3 py-1 rounded-full animate-pulse">
                  {totalPending} Action Needed
                </span>
              )}
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed">
              New hotel owners submit properties for platform onboarding. Review amenities, locations, and images before publishing live.
            </p>

            {pendingHotels.length > 0 ? (
              <div className="space-y-3 pt-2">
                {pendingHotels.slice(0, 2).map((h) => (
                  <div key={h._id || h.id} className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{h.name}</h4>
                      <p className="text-xs text-neutral-500">{h.address?.city || 'Location unavailable'}</p>
                    </div>
                    <span className="text-xs bg-amber-950/60 text-amber-400 border border-amber-800/60 px-2.5 py-1 rounded-full font-semibold">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-neutral-950/40 border border-neutral-800/60 rounded-2xl p-6 text-center text-xs text-neutral-500">
                ✨ Queue clean! No hotels currently awaiting approval.
              </div>
            )}
          </div>

          <Link
            to="/admin/pending-hotels"
            className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3.5 px-6 rounded-2xl transition duration-200 text-center text-sm flex items-center justify-center space-x-2 group cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <span>Review Pending Queue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Platform Reservation Intelligence Hub */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-2xl">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Booking Management</h2>
                  <p className="text-neutral-400 text-xs mt-0.5">Inspect all global customer reservations</p>
                </div>
              </div>
              <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs px-3 py-1 rounded-full">
                {totalBookings} Total Recorded
              </span>
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed">
              Audit customer reservations, monitor payment states (paid / unpaid), check-in schedules, and perform platform cancellation audits.
            </p>

            {allBookings.length > 0 ? (
              <div className="space-y-3 pt-2">
                {allBookings.slice(0, 2).map((b) => (
                  <div key={b._id || b.id} className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{b.user?.name || b.user?.email || 'Guest User'}</h4>
                      <p className="text-xs text-neutral-500">{b.hotel?.name || 'Hotel'} • ${b.totalPrice}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border capitalize ${
                      b.status === 'confirmed' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                    }`}>
                      {b.status || 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-neutral-950/40 border border-neutral-800/60 rounded-2xl p-6 text-center text-xs text-neutral-500">
                No active bookings recorded in the system yet.
              </div>
            )}
          </div>

          <Link
            to="/admin/bookings"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-2xl transition duration-200 text-center text-sm flex items-center justify-center space-x-2 group cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <span>Explore All Reservations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
