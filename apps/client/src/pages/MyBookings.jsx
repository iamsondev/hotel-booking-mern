import { useGetMyBookingsQuery, useCancelBookingMutation } from '../features/bookings/bookingApiSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../components/common/Loader';

export default function MyBookings() {
  const navigate = useNavigate();
  const { data: bookingsResponse, isLoading, error } = useGetMyBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const bookings = bookingsResponse?.bookings || bookingsResponse;

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(bookingId).unwrap();
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Cancellation failed');
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/80';
      case 'pending':
        return 'bg-amber-950/50 text-amber-400 border border-amber-800/80';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-950/50 text-red-400 border border-red-800/80';
      default:
        return 'bg-neutral-850 text-neutral-400 border border-neutral-800';
    }
  };

  const getPaymentBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-teal-950/50 text-teal-400 border border-teal-800/80';
      case 'unpaid':
        return 'bg-rose-950/50 text-rose-400 border border-rose-800/80';
      default:
        return 'bg-neutral-850 text-neutral-405 border border-neutral-800';
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12">
        Failed to load bookings list. Please check your network connection.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">My Bookings</h2>
        <p className="text-neutral-450 text-sm mt-1" style={{ color: '#888' }}>Track your active, past, and pending reservation cards.</p>
      </div>

      {!bookings || bookings.length === 0 ? (
        <div className="text-center p-12 bg-neutral-900 border border-neutral-808 rounded-3xl text-neutral-400 text-sm" style={{ borderColor: '#1c1c1c', color: '#888' }}>
          You have not made any bookings yet.
        </div>
      ) : (
        <div className="space-y-4 font-sans">
          {bookings.map((booking) => {
            const bookingId = booking._id || booking.id;
            const hotelName = booking.hotel?.name || booking.room?.hotel?.name || 'StayEase Hotel';
            const roomType = booking.room?.roomType || booking.roomType || 'Standard Room';

            const formattedCheckIn = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : '';
            const formattedCheckOut = booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : '';

            const isActiveStatus = booking.status?.toLowerCase() === 'pending' || booking.status?.toLowerCase() === 'confirmed';
            const isUnpaid = booking.paymentStatus?.toLowerCase() === 'unpaid';

            return (
              <div
                key={bookingId}
                className="bg-neutral-900 border border-neutral-850 hover:border-neutral-800 rounded-2xl p-6 shadow-md transition duration-200 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                style={{ borderColor: '#222' }}
              >
                {/* Details Section */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight capitalize">{hotelName}</h3>
                    <p className="text-xs text-neutral-450 capitalize" style={{ color: '#888' }}>{roomType}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 text-sm">
                    <div>
                      <span className="block text-xs text-neutral-500">Check-In</span>
                      <span className="text-white font-medium">{formattedCheckIn}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-neutral-500">Check-Out</span>
                      <span className="text-white font-medium">{formattedCheckOut}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1.5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize ${getPaymentBadge(booking.paymentStatus)}`}>
                      Payment: {booking.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Pricing and Actions Section */}
                <div className="flex flex-col items-start md:items-end justify-between gap-4 md:border-l md:border-neutral-800 md:pl-8">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-neutral-500 block">Total Price Paid/Due</span>
                    <span className="text-xl font-extrabold text-indigo-400">${booking.totalPrice}</span>
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    {/* Pay Button */}
                    {isActiveStatus && isUnpaid && (
                      <button
                        onClick={() => navigate(`/payment/${bookingId}`)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-4 rounded-xl transition duration-150 cursor-pointer text-center"
                      >
                        Pay Now
                      </button>
                    )}

                    {/* Cancel Button */}
                    {isActiveStatus && (
                      <button
                        onClick={() => handleCancel(bookingId)}
                        disabled={isCancelling}
                        className="bg-neutral-800 hover:bg-red-950/80 text-neutral-400 hover:text-red-400 text-xs font-semibold py-2 px-4 rounded-xl transition duration-150 cursor-pointer disabled:opacity-50 border border-neutral-750 hover:border-red-900/30"
                        style={{ borderColor: '#2c2c2c' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
