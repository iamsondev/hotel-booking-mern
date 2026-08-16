import { useState } from 'react';
import { useGetAllBookingsQuery } from '../../features/bookings/bookingApiSlice';
import Loader from '../../components/common/Loader';

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'cancelled'];

export default function AllBookings() {
  const { data: bookingsResponse, isLoading, error } = useGetAllBookingsQuery();
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const allBookings = Array.isArray(bookingsResponse)
    ? bookingsResponse
    : bookingsResponse?.data || bookingsResponse?.bookings || [];

  // Client-side filter by status
  const filtered = statusFilter === 'all'
    ? allBookings
    : allBookings.filter((b) => b.status?.toLowerCase() === statusFilter);

  // Client-side pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1); // reset page on filter change
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-emerald-950/50 text-emerald-400 border-emerald-800/80';
      case 'pending': return 'bg-amber-950/50 text-amber-400 border-amber-800/80';
      case 'cancelled':
      case 'canceled': return 'bg-red-950/50 text-red-400 border-red-800/80';
      default: return 'bg-neutral-850 text-neutral-400 border-neutral-800';
    }
  };

  const getPaymentBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-teal-950/50 text-teal-400 border-teal-800/80';
      case 'unpaid': return 'bg-rose-950/50 text-rose-400 border-rose-800/80';
      default: return 'bg-neutral-850 text-neutral-400 border-neutral-800';
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12">
        Failed to load booking records. Please check your backend connection.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">All Bookings</h2>
          <p className="text-neutral-450 text-sm mt-1" style={{ color: '#888' }}>
            {filtered.length} reservation{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500 text-sm capitalize cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {paginated.length === 0 ? (
        <div className="text-center p-12 bg-neutral-900 border border-neutral-808 rounded-3xl text-neutral-400 text-sm" style={{ borderColor: '#1c1c1c', color: '#888' }}>
          No bookings match the selected filter.
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-neutral-900 border border-neutral-850 rounded-3xl overflow-hidden shadow-xl" style={{ borderColor: '#222' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans text-left">
                <thead>
                  <tr className="border-b border-neutral-850 text-xs text-neutral-500 uppercase tracking-wider" style={{ borderColor: '#222' }}>
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Hotel</th>
                    <th className="px-5 py-4">Room</th>
                    <th className="px-5 py-4">Check-In</th>
                    <th className="px-5 py-4">Check-Out</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850" style={{ borderColor: '#1c1c1c' }}>
                  {paginated.map((booking) => {
                    const bookingId = booking._id || booking.id;
                    const userName = booking.user?.name || booking.user?.email || '—';
                    const hotelName = booking.hotel?.name || booking.room?.hotel?.name || '—';
                    const roomType = booking.room?.roomType || booking.roomType || '—';
                    const checkIn = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : '—';
                    const checkOut = booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : '—';

                    return (
                      <tr
                        key={bookingId}
                        className="hover:bg-neutral-850/30 transition duration-100"
                        style={{ borderColor: '#1c1c1c' }}
                      >
                        <td className="px-5 py-4 text-white font-medium">{userName}</td>
                        <td className="px-5 py-4 text-neutral-350 max-w-[140px] truncate" style={{ color: '#ccc' }}>{hotelName}</td>
                        <td className="px-5 py-4 text-neutral-450 capitalize" style={{ color: '#aaa' }}>{roomType}</td>
                        <td className="px-5 py-4 text-neutral-450" style={{ color: '#aaa' }}>{checkIn}</td>
                        <td className="px-5 py-4 text-neutral-450" style={{ color: '#aaa' }}>{checkOut}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize border ${getStatusBadge(booking.status)}`}>
                            {booking.status || 'unknown'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize border ${getPaymentBadge(booking.paymentStatus)}`}>
                            {booking.paymentStatus || 'unknown'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-indigo-400">
                          ${booking.totalPrice ?? '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white font-medium py-2 px-4 rounded-xl text-sm cursor-pointer disabled:cursor-not-allowed border border-neutral-800 transition"
              >
                Previous
              </button>
              <span className="text-sm text-neutral-450 font-semibold" style={{ color: '#aaa' }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white font-medium py-2 px-4 rounded-xl text-sm cursor-pointer disabled:cursor-not-allowed border border-neutral-800 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
