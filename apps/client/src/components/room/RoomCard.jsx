import { useNavigate } from 'react-router-dom';

export default function RoomCard({ room, hotelId }) {
  const navigate = useNavigate();

  if (!room) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-850 hover:border-neutral-700 rounded-3xl p-6 shadow-md transition duration-300 flex flex-col justify-between h-full group" style={{ borderColor: '#222' }}>
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-xl font-bold text-white tracking-tight capitalize group-hover:text-indigo-400 transition">
            {room.roomType || 'Standard Room'}
          </h4>
          <div className="text-right">
            <span className="text-xl font-extrabold text-indigo-400">${room.pricePerNight}</span>
            <span className="text-xs text-neutral-500 block">/ night</span>
          </div>
        </div>

        {/* Capacity / Guests */}
        <div className="flex items-center space-x-2 text-sm text-neutral-450 mb-4" style={{ color: '#aaa' }}>
          <svg className="w-4 h-4 text-neutral-550 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Fits up to {room.capacity || 2} {room.capacity === 1 ? 'Guest' : 'Guests'}</span>
        </div>

        {/* Amenities badges */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-1.5">
              {room.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="bg-neutral-950 border border-neutral-850 text-neutral-400 text-xs px-2.5 py-1 rounded-full capitalize"
                  style={{ borderColor: '#2c2c2c' }}
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate(`/booking/${room._id || room.id}`)}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-2xl hover:shadow-lg hover:shadow-indigo-500/10 border border-indigo-550 transition duration-200 text-sm cursor-pointer text-center"
      >
        Book Now
      </button>
    </div>
  );
}
