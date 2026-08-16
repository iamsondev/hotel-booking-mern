import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRoomByIdQuery } from '../features/rooms/roomApiSlice';
import { useCreateBookingMutation } from '../features/bookings/bookingApiSlice';
import { toast } from 'react-hot-toast';
import Loader from '../components/common/Loader';

export default function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { data: roomResponse, isLoading: isRoomLoading, error: roomError } = useGetRoomByIdQuery(roomId);
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();

  const room = roomResponse?.room || roomResponse;

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [numberOfRooms, setNumberOfRooms] = useState(1);

  const today = new Date().toISOString().split('T')[0];

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateNights();
  const pricePerNight = room?.pricePerNight || 0;
  const totalPrice = pricePerNight * nights * numberOfRooms;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
      toast.error('Please select both Check-In and Check-Out dates');
      return;
    }

    if (nights <= 0) {
      toast.error('Check-Out date must be after Check-In date');
      return;
    }

    try {
      const response = await createBooking({
        roomId,
        checkInDate,
        checkOutDate,
        guests: {
          adults,
          children
        },
        numberOfRooms,
        totalPrice
      }).unwrap();

      toast.success('Reservation created successfully!');
      
      const bookingId = response.booking?._id || response.booking?.id || response._id || response.id;
      navigate(`/payment/${bookingId}`);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to complete booking. Room might be unavailable.');
    }
  };

  if (isRoomLoading) return <Loader />;

  if (roomError || !room) {
    return (
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12">
        Failed to load room details. Please verify your selection and try again.
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Booking Form Card (3 cols) */}
        <div className="lg:col-span-3 bg-neutral-900 border border-neutral-805 rounded-3xl p-6 md:p-8 shadow-2xl relative" style={{ borderColor: '#222' }}>
          <h2 className="text-2xl font-bold text-white mb-6">Complete Reservation Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Check-In Date</label>
                <input
                  type="date"
                  min={today}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Check-Out Date</label>
                <input
                  type="date"
                  min={checkInDate || today}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Adults</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Children</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Rooms Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numberOfRooms}
                  onChange={(e) => setNumberOfRooms(parseInt(e.target.value) || 1)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold py-3.5 rounded-2xl transition duration-300 shadow-lg cursor-pointer text-center text-sm"
            >
              {isCreating ? 'Processing Booking...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>

        {/* Pricing & Summary Card (2 cols) */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-805 rounded-3xl p-6 md:p-8 shadow-2xl relative flex flex-col space-y-6" style={{ borderColor: '#222' }}>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-1">Pricing Summary</h3>
            <h4 className="text-xl font-bold text-white capitalize">{room.roomType || 'Standard Room'}</h4>
          </div>

          <div className="space-y-3 pt-4 border-t border-neutral-800/80 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-400">Rate per night</span>
              <span className="text-white font-medium">${pricePerNight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Number of rooms</span>
              <span className="text-white font-medium">{numberOfRooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Duration</span>
              <span className="text-white font-medium">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
            <span className="text-base font-bold text-white">Estimated Total</span>
            <span className="text-2xl font-extrabold text-indigo-400">${totalPrice}</span>
          </div>

          {room.amenities && room.amenities.length > 0 && (
            <div className="pt-4 border-t border-neutral-800/80">
              <h5 className="text-xs font-semibold text-neutral-450 uppercase tracking-wider mb-2">Room Inclusions</h5>
              <div className="flex flex-wrap gap-1.5">
                {room.amenities.map((item, idx) => (
                  <span key={idx} className="bg-neutral-950 border border-neutral-800 text-neutral-400 text-xs px-2.5 py-1 rounded-full capitalize">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
