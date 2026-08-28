import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRoomByIdQuery } from '../features/rooms/roomApiSlice';
import { useCreateBookingMutation } from '../features/bookings/bookingApiSlice';
import { toast } from 'react-hot-toast';
import Loader from '../components/common/Loader';
import DatePickerField from '../components/common/DatePickerField';
import {
  BedDouble, Users, CalendarDays, CreditCard,
  CheckCircle2, Sparkles, Moon
} from 'lucide-react';

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
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights();
  const pricePerNight = room?.pricePerNight || 0;
  const roomsCount = Number(numberOfRooms) || 0;
  const adultsCount = Number(adults) || 0;
  const childrenCount = Number(children) || 0;
  const totalPrice = pricePerNight * nights * roomsCount;

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
    if (adultsCount < 1) {
      toast.error('Please add at least 1 adult guest');
      return;
    }
    if (roomsCount < 1) {
      toast.error('Please select at least 1 room');
      return;
    }

    try {
      const response = await createBooking({
        roomId,
        checkInDate,
        checkOutDate,
        numberOfGuests: { adults: adultsCount, children: childrenCount },
        numberOfRooms: roomsCount,
        totalPrice,
      }).unwrap();

      toast.success('Reservation created successfully!');
      const bookingObj = response.data || response.booking || response;
      const bookingId = bookingObj?._id || bookingObj?.id;
      if (!bookingId) {
        toast.error('Booking created successfully! View in My Bookings.');
        navigate('/my-bookings');
        return;
      }
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

  const adultsMax = room.capacity?.adults ?? room.adults ?? 10;
  const childrenMax = room.capacity?.children ?? room.children ?? 10;
  const roomImage = room.images?.[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-[85vh] py-8 px-4 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8 text-center space-y-1">
          <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-4 py-1.5 rounded-full text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Secure Booking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Complete Reservation Details
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Review your selection and confirm your stay details below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── BOOKING FORM (3 cols) ── */}
          <div className="lg:col-span-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-xl space-y-7">

            {/* Room Image Preview */}
            <div className="relative rounded-2xl overflow-hidden h-44 w-full bg-[var(--bg-input)]">
              <img
                src={roomImage}
                alt={room.roomType}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="text-white font-extrabold text-lg capitalize">{room.roomType || 'Standard'} Room</span>
              </div>
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">
                ★ Premium Stay
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Section */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Choose Your Dates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DatePickerField
                    label="Check-In Date"
                    value={checkInDate}
                    onChange={(val) => {
                      setCheckInDate(val);
                      if (checkOutDate && val >= checkOutDate) setCheckOutDate('');
                    }}
                    minDate={today}
                    placeholder="Select check-in..."
                  />
                  <DatePickerField
                    label="Check-Out Date"
                    value={checkOutDate}
                    onChange={setCheckOutDate}
                    minDate={checkInDate || today}
                    placeholder="Select check-out..."
                  />
                </div>

                {/* Duration Badge */}
                {nights > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-4 py-2.5 rounded-xl">
                    <Moon className="w-4 h-4" />
                    <span>{nights} {nights === 1 ? 'night' : 'nights'} selected — {checkInDate} → {checkOutDate}</span>
                  </div>
                )}
              </div>

              {/* Guests & Rooms */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Guest Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Adults */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">
                      Adults <span className="normal-case font-normal">(max {adultsMax})</span>
                    </label>
                    <div className="flex items-center bg-[var(--bg-input)] border border-[var(--border-color)] focus-within:border-[var(--color-primary)] rounded-2xl overflow-hidden transition">
                      <button type="button" onClick={() => setAdults((v) => Math.max(1, (parseInt(v, 10) || 1) - 1))}
                        className="px-4 py-3 text-[var(--text-muted)] hover:text-[var(--color-primary)] text-lg font-bold transition cursor-pointer select-none">−</button>
                      <input type="number" min="1" max={adultsMax} value={adults}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            setAdults('');
                          } else {
                            const v = parseInt(val, 10);
                            if (!isNaN(v)) setAdults(Math.min(adultsMax, Math.max(0, v)));
                          }
                        }}
                        onBlur={() => {
                          if (adults === '' || parseInt(adults, 10) < 1) setAdults(1);
                        }}
                        className="flex-1 w-0 bg-transparent text-center text-[var(--text-primary)] font-extrabold text-base outline-none py-3 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                      <button type="button" onClick={() => setAdults((v) => Math.min(adultsMax, (parseInt(v, 10) || 0) + 1))}
                        className="px-4 py-3 text-[var(--text-muted)] hover:text-[var(--color-primary)] text-lg font-bold transition cursor-pointer select-none">+</button>
                    </div>
                  </div>

                  {/* Children */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">
                      Children <span className="normal-case font-normal">(max {childrenMax})</span>
                    </label>
                    <div className="flex items-center bg-[var(--bg-input)] border border-[var(--border-color)] focus-within:border-[var(--color-primary)] rounded-2xl overflow-hidden transition">
                      <button type="button" onClick={() => setChildren((v) => Math.max(0, (parseInt(v, 10) || 0) - 1))}
                        className="px-4 py-3 text-[var(--text-muted)] hover:text-[var(--color-primary)] text-lg font-bold transition cursor-pointer select-none">−</button>
                      <input type="number" min="0" max={childrenMax} value={children}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            setChildren('');
                          } else {
                            const v = parseInt(val, 10);
                            if (!isNaN(v)) setChildren(Math.min(childrenMax, Math.max(0, v)));
                          }
                        }}
                        onBlur={() => {
                          if (children === '' || parseInt(children, 10) < 0) setChildren(0);
                        }}
                        className="flex-1 w-0 bg-transparent text-center text-[var(--text-primary)] font-extrabold text-base outline-none py-3 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                      <button type="button" onClick={() => setChildren((v) => Math.min(childrenMax, (parseInt(v, 10) || 0) + 1))}
                        className="px-4 py-3 text-[var(--text-muted)] hover:text-[var(--color-primary)] text-lg font-bold transition cursor-pointer select-none">+</button>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">
                      Rooms <span className="normal-case font-normal">(max {room.totalRooms || 10})</span>
                    </label>
                    <div className="flex items-center bg-[var(--bg-input)] border border-[var(--border-color)] focus-within:border-[var(--color-primary)] rounded-2xl overflow-hidden transition">
                      <button type="button" onClick={() => setNumberOfRooms((v) => Math.max(1, (parseInt(v, 10) || 1) - 1))}
                        className="px-4 py-3 text-[var(--text-muted)] hover:text-[var(--color-primary)] text-lg font-bold transition cursor-pointer select-none">−</button>
                      <input type="number" min="1" max={room.totalRooms || 10} value={numberOfRooms}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            setNumberOfRooms('');
                          } else {
                            const v = parseInt(val, 10);
                            if (!isNaN(v)) setNumberOfRooms(Math.min(room.totalRooms || 10, Math.max(0, v)));
                          }
                        }}
                        onBlur={() => {
                          if (numberOfRooms === '' || parseInt(numberOfRooms, 10) < 1) setNumberOfRooms(1);
                        }}
                        className="flex-1 w-0 bg-transparent text-center text-[var(--text-primary)] font-extrabold text-base outline-none py-3 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                      <button type="button" onClick={() => setNumberOfRooms((v) => Math.min(room.totalRooms || 10, (parseInt(v, 10) || 0) + 1))}
                        className="px-4 py-3 text-[var(--text-muted)] hover:text-[var(--color-primary)] text-lg font-bold transition cursor-pointer select-none">+</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isCreating || !checkInDate || !checkOutDate || nights <= 0}
                className="w-full flex items-center justify-center gap-2.5 text-white font-extrabold py-4 rounded-2xl shadow-lg transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ background: 'var(--color-primary)' }}
                onMouseEnter={(e) => { if (!isCreating) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary)')}
              >
                <CreditCard className="w-5 h-5" />
                {isCreating ? 'Processing Booking...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          {/* ── PRICING SUMMARY (2 cols) ── */}
          <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-xl flex flex-col space-y-6 sticky top-24">

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Pricing Summary</p>
              <h4 className="text-xl font-extrabold text-[var(--text-primary)] capitalize">{room.roomType || 'Standard'} Room</h4>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--border-color)] text-sm">
              {[
                { label: 'Rate per night', value: `$${pricePerNight}` },
                { label: 'Number of rooms', value: numberOfRooms },
                { label: 'Duration', value: `${nights} ${nights === 1 ? 'Night' : 'Nights'}` },
                { label: 'Check-In', value: checkInDate || '—' },
                { label: 'Check-Out', value: checkOutDate || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">{label}</span>
                  <span className="text-[var(--text-primary)] font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
              <span className="text-base font-extrabold text-[var(--text-primary)]">Estimated Total</span>
              <span className="text-2xl font-black" style={{ color: 'var(--color-primary)' }}>
                ${totalPrice}
              </span>
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div className="pt-4 border-t border-[var(--border-color)]">
                <h5 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Room Inclusions
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {room.amenities.map((item, idx) => (
                    <span key={idx} className="bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs px-2.5 py-1 rounded-xl capitalize">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Security badge */}
            <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs border-t border-[var(--border-color)] pt-4">
              <BedDouble className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Secure payment • Instant confirmation • Free cancellation policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
