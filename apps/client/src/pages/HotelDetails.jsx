import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetHotelByIdQuery } from '../features/hotels/hotelApiSlice';
import { useGetRoomsByHotelQuery } from '../features/rooms/roomApiSlice';
import RoomCard from '../components/room/RoomCard';
import Loader from '../components/common/Loader';

export default function HotelDetails() {
  const { id } = useParams();
  const { data: hotelData, isLoading: isHotelLoading, error: hotelError } = useGetHotelByIdQuery(id);
  const { data: roomsData, isLoading: isRoomsLoading, error: roomsError } = useGetRoomsByHotelQuery(id);
  const [activeImage, setActiveImage] = useState(0);

  const hotel = hotelData?.hotel || hotelData;
  const rooms = roomsData?.rooms || roomsData;

  const isLoading = isHotelLoading || isRoomsLoading;
  const isError = hotelError || roomsError;

  if (isLoading) return <Loader />;

  if (isError || !hotel) {
    return (
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12">
        Failed to load hotel details. Please verify that this hotel exists or try again.
      </div>
    );
  }

  const images = hotel.images && hotel.images.length > 0
    ? hotel.images
    : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="space-y-12">
      {/* Main Layout and Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Gallery Column */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-805 bg-neutral-900 shadow-xl" style={{ borderColor: '#222' }}>
            <img
              src={images[activeImage]}
              alt={hotel.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImage === index ? 'border-indigo-500 scale-95' : 'border-transparent hover:border-neutral-700'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text/Info Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            {/* Stars */}
            <div className="flex items-center space-x-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-base ${
                    i < (hotel.starRating || 0) ? 'text-amber-400' : 'text-neutral-700'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {hotel.name}
            </h1>
            <p className="text-neutral-400 text-sm flex items-center">
              <svg className="w-4 h-4 mr-1 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {hotel.address?.line1 ? `${hotel.address.line1}, ` : ''}
              {hotel.address?.city || 'City unspecified'}, {hotel.address?.country || ''}
            </p>
          </div>

          <hr className="border-neutral-850" style={{ borderColor: '#222' }} />

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider text-xs">About this hotel</h3>
            <p className="text-neutral-450 leading-relaxed text-sm" style={{ color: '#aaa' }}>
              {hotel.description || 'No description provided for this hotel.'}
            </p>
          </div>

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="space-y-3 font-sans">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider text-xs">Offers & Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-neutral-900 border border-neutral-805 text-neutral-350 text-xs px-3.5 py-1.5 rounded-full capitalize font-semibold"
                    style={{ borderColor: '#222' }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="border-neutral-850" style={{ borderColor: '#222' }} />

      {/* Available Rooms Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Available Rooms</h2>
          <p className="text-neutral-500 text-sm mt-1">Select a room subclass to complete your booking process.</p>
        </div>

        {!rooms || rooms.length === 0 ? (
          <div className="text-center p-8 bg-neutral-900 border border-neutral-808 rounded-3xl text-neutral-400 text-sm max-w-lg mx-auto" style={{ borderColor: '#1c1c1c', color: '#888' }}>
            No rooms listed for this hotel yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room._id || room.id} room={room} hotelId={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
