import { useState } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useGetRoomByIdQuery } from '../features/rooms/roomApiSlice';
import { useCreateBookingMutation } from '../features/bookings/bookingApiSlice';
import { toast } from 'react-hot-toast';
import Loader from '../components/common/Loader';
import DatePickerField from '../components/common/DatePickerField';
import {
  BedDouble, Users, CalendarDays, CreditCard,
  CheckCircle2, Sparkles, Moon, DollarSign, ArrowRight, Info
} from 'lucide-react';

export default function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const { data: roomResponse, isLoading: isRoomLoading, error: roomError } = useGetRoomByIdQuery(roomId);
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();

  const room = roomResponse?.room || roomResponse;

  const initialCheckIn = searchParams.get('checkIn') || location.state?.checkInDate || '';
  const initialCheckOut = searchParams.get('checkOut') || location.state?.checkOutDate || '';

  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
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
            Review your selection and check real-time cost breakdown before proceeding to payment.
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
                  <CalendarDays className="w-4 h-4 text-[var(--color-primary)]" />
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
                  <Users className="w-4 h-4 text-[var(--color-primary)]" />
                  Guest & Room Inventory
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

              {/* ── REAL-TIME LIVE COST BREAKDOWN BANNER ── */}
              {nights > 0 ? (
                <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 border border-emerald-500/30 rounded-2xl p-5 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Live Cost Calculation
                    </span>
                    <span className="text-[11px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-500/30">
                      {nights} {nights === 1 ? 'Night' : 'Nights'} • {roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-[var(--text-secondary)] pt-1 border-t border-emerald-500/20">
                    <div className="flex justify-between items-center">
                      <span>Rate per Night</span>
                      <span className="font-bold text-[var(--text-primary)]">${pricePerNight} / night</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Stay Duration ({checkInDate} → {checkOutDate})</span>
                      <span className="font-bold text-[var(--text-primary)]">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Selected Room Count</span>
                      <span className="font-bold text-[var(--text-primary)]">{roomsCount} {roomsCount === 1 ? 'room' : 'rooms'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] italic">
                      <span>Calculation Formula</span>
                      <span>${pricePerNight} × {nights} nights × {roomsCount} rooms</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-primary)] block">
                        Total Amount Payable
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">Includes all rooms for entire stay</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2.5">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <span>Select both Check-In and Check-Out dates above to calculate your total reservation cost.</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isCreating || !checkInDate || !checkOutDate || nights <= 0}
                className="w-full flex items-center justify-center gap-2.5 text-white font-extrabold py-4 rounded-2xl shadow-lg transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ background: 'var(--color-primary)' }}
                onMouseEnter={(e) => { if (!isCreating && nights > 0) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary)')}
              >
                <CreditCard className="w-5 h-5" />
                {isCreating
                  ? 'Processing Booking...'
                  : nights > 0
                  ? `Proceed to Payment ($${totalPrice})`
                  : 'Select Stay Dates to Proceed'}
              </button>
            </form>
          </div>

          {/* ── PRICING SUMMARY SIDEBAR (2 cols) ── */}
          <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-xl flex flex-col space-y-6 sticky top-24">

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Pricing Summary</p>
              <h4 className="text-xl font-extrabold text-[var(--text-primary)] capitalize">{room.roomType || 'Standard'} Room</h4>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--border-color)] text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Rate per night</span>
                <span className="text-[var(--text-primary)] font-semibold">${pricePerNight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Number of rooms</span>
                <span className="text-[var(--text-primary)] font-semibold">{roomsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Duration</span>
                <span className="text-[var(--text-primary)] font-semibold">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Check-In</span>
                <span className="text-[var(--text-primary)] font-semibold">{checkInDate || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Check-Out</span>
                <span className="text-[var(--text-primary)] font-semibold">{checkOutDate || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Guests</span>
                <span className="text-[var(--text-primary)] font-semibold">{adultsCount} Adults{childrenCount > 0 ? `, ${childrenCount} Child` : ''}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-[var(--text-primary)] block">Estimated Total</span>
                {nights > 0 && (
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">
                    ${pricePerNight} × {nights}n × {roomsCount}r
                  </span>
                )}
              </div>
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

