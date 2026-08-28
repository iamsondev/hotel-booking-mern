import { useGetMyBookingsQuery, useCancelBookingMutation } from '../features/bookings/bookingApiSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../components/common/Loader';
import { Ticket, Calendar, DollarSign, CreditCard, XCircle, Hotel, ArrowRight } from 'lucide-react';
import { confirmDelete } from '../utils/confirmDialog';

export default function MyBookings() {
  const navigate = useNavigate();
  const { data: bookingsResponse, isLoading, error } = useGetMyBookingsQuery();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const bookings = Array.isArray(bookingsResponse)
    ? bookingsResponse
    : bookingsResponse?.data || bookingsResponse?.bookings || [];

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (b) => b.status?.toLowerCase() === 'confirmed' || b.status?.toLowerCase() === 'pending'
  ).length;
  const unpaidBookings = bookings.filter((b) => b.paymentStatus?.toLowerCase() === 'unpaid').length;

  const handleCancel = async (bookingId) => {
    const isConfirmed = await confirmDelete({
      title: 'Cancel Reservation?',
      text: 'Are you sure you want to cancel this booking stay?',
      confirmButtonText: 'Yes, Cancel Stay',
      icon: 'warning',
    });
    if (!isConfirmed) return;

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
        return 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50';
      case 'pending':
        return 'bg-amber-950/80 text-amber-300 border border-amber-500/50';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-950/80 text-red-300 border border-red-500/50';
      default:
        return 'bg-neutral-850 text-neutral-400 border border-neutral-800';
    }
  };

  const getPaymentBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-teal-950/80 text-teal-300 border border-teal-500/50';
      case 'unpaid':
        return 'bg-rose-950/80 text-rose-300 border border-rose-500/50';
      default:
        return 'bg-neutral-850 text-neutral-400 border border-neutral-800';
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12">
        Failed to load your reservations. Please check your connection.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 px-4 font-sans">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-neutral-900 to-blue-950/80 border border-neutral-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Ticket className="w-4 h-4" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              My Reservation Dashboard
            </h1>
            <p className="text-neutral-400 text-sm max-w-xl">
              Track upcoming stays, manage check-in timelines, complete Stripe payments, or cancel active bookings.
            </p>
          </div>

          <Link
            to="/"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-500/20 flex items-center space-x-2 w-fit"
          >
            <Hotel className="w-4 h-4" />
            <span>Book New Hotel</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Reservations</span>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{totalBookings}</span>
            <span className="text-xs text-neutral-500 font-medium">Stays</span>
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Active / Upcoming</span>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400">{activeBookings}</span>
            <span className="text-xs text-neutral-500 font-medium">Active</span>
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-808 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Pending Payments</span>
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-rose-400">{unpaidBookings}</span>
            <span className="text-xs text-neutral-500 font-medium">Unpaid</span>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {!bookings || bookings.length === 0 ? (
        <div className="text-center p-12 bg-neutral-900/80 border border-neutral-800 rounded-3xl text-neutral-400 text-sm space-y-4 shadow-xl">
          <p className="text-neutral-400 font-medium">You have not made any hotel reservations yet.</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-2xl transition text-xs uppercase tracking-wider"
          >
            <span>Explore Partner Hotels</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => {
            const bookingId = booking._id || booking.id;
            const hotelName = booking.hotel?.name || booking.room?.hotel?.name || 'StayEase Partner Hotel';
            const roomType = booking.room?.roomType || booking.roomType || 'Standard Room';

            const formattedCheckIn = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A';
            const formattedCheckOut = booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A';

            const isActiveStatus = booking.status?.toLowerCase() === 'pending' || booking.status?.toLowerCase() === 'confirmed';
            const isUnpaid = booking.paymentStatus?.toLowerCase() === 'unpaid';

            return (
              <div
                key={bookingId}
                className="bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 rounded-3xl p-6 shadow-xl transition duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Details Section */}
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight capitalize">{hotelName}</h3>
                    <p className="text-xs text-neutral-400 capitalize mt-0.5">{roomType}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div>
                      <span className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Check-In</span>
                      <span className="text-white font-semibold">{formattedCheckIn}</span>
                    </div>
                    <div className="h-8 w-px bg-neutral-800 hidden sm:block"></div>
                    <div>
                      <span className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Check-Out</span>
                      <span className="text-white font-semibold">{formattedCheckOut}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <span className={`text-xs px-3 py-1 rounded-full capitalize font-bold ${getStatusBadge(booking.status)}`}>
                      {booking.status || 'Pending'}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full capitalize font-bold ${getPaymentBadge(booking.paymentStatus)}`}>
                      Payment: {booking.paymentStatus || 'Unpaid'}
                    </span>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="flex flex-col items-start lg:items-end justify-between gap-4 lg:border-l lg:border-neutral-800 lg:pl-8">
                  <div>
                    <span className="text-xs text-neutral-500 block font-semibold uppercase tracking-wider">Total Amount</span>
                    <span className="text-2xl font-black text-indigo-400">${booking.totalPrice}</span>
                  </div>

                  <div className="flex items-center space-x-3 w-full lg:w-auto">
                    {/* Pay Button */}
                    {isActiveStatus && isUnpaid && (
                      <button
                        onClick={() => navigate(`/payment/${bookingId}`)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-5 rounded-2xl transition shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center space-x-1.5"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay Now</span>
                      </button>
                    )}

                    {/* Cancel Button */}
                    {isActiveStatus && (
                      <button
                        onClick={() => handleCancel(bookingId)}
                        disabled={isCancelling}
                        className="bg-neutral-800 hover:bg-red-950/80 text-neutral-400 hover:text-red-300 border border-neutral-750 hover:border-red-900/50 text-xs font-semibold py-2.5 px-5 rounded-2xl transition cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel Stay</span>
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
