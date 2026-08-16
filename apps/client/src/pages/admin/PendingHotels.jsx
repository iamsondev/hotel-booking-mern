import { useGetPendingHotelsQuery, useApproveHotelMutation, useRejectHotelMutation } from '../../features/hotels/hotelApiSlice';
import { toast } from 'react-hot-toast';
import Loader from '../../components/common/Loader';

export default function PendingHotels() {
  const { data: pendingResponse, isLoading, error } = useGetPendingHotelsQuery();
  const [approveHotel, { isLoading: isApproving }] = useApproveHotelMutation();
  const [rejectHotel, { isLoading: isRejecting }] = useRejectHotelMutation();

  const hotels = pendingResponse?.hotels || pendingResponse || [];

  const handleApprove = async (hotelId, hotelName) => {
    try {
      await approveHotel(hotelId).unwrap();
      toast.success(`"${hotelName}" has been approved and is now live.`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to approve hotel');
    }
  };

  const handleReject = async (hotelId, hotelName) => {
    if (!window.confirm(`Reject "${hotelName}"? The owner will need to resubmit.`)) return;
    try {
      await rejectHotel(hotelId).unwrap();
      toast.success(`"${hotelName}" has been rejected.`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to reject hotel');
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12">
        Failed to load pending hotels. Please check your backend connection.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Pending Hotel Approvals</h2>
        <p className="text-neutral-450 text-sm mt-1" style={{ color: '#888' }}>
          Review and approve or reject submitted hotel listings before they appear on the platform.
        </p>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center p-12 bg-neutral-900 border border-neutral-808 rounded-3xl text-neutral-400 text-sm" style={{ borderColor: '#1c1c1c', color: '#888' }}>
          🎉 No hotels pending review. All submissions have been processed.
        </div>
      ) : (
        <div className="space-y-5 font-sans">
          {hotels.map((hotel) => {
            const hotelId = hotel._id || hotel.id;
            const imageUrl = hotel.images?.[0] ||
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={hotelId}
                className="bg-neutral-900 border border-neutral-850 hover:border-neutral-800 rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row transition duration-200"
                style={{ borderColor: '#222' }}
              >
                {/* Image */}
                <div className="md:w-52 w-full flex-shrink-0 bg-neutral-850" style={{ minHeight: '160px', background: '#181818' }}>
                  <img
                    src={imageUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    style={{ minHeight: '160px' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>

                {/* Details & Actions Layout */}
                <div className="flex flex-1 flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6">
                  {/* Info Block */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">{hotel.name}</h3>
                      <span className="bg-amber-950/50 text-amber-400 border border-amber-800/80 text-xs px-2.5 py-0.5 rounded-full capitalize font-semibold">
                        Pending
                      </span>
                    </div>

                    <p className="text-neutral-400 text-xs flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hotel.address?.city || 'City unspecified'}, {hotel.address?.country || ''}
                    </p>

                    <p className="text-neutral-450 text-sm line-clamp-2" style={{ color: '#aaa' }}>
                      {hotel.description || 'No description provided.'}
                    </p>

                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {hotel.amenities.slice(0, 4).map((item, idx) => (
                          <span key={idx} className="bg-neutral-950 border border-neutral-850 text-neutral-500 text-[10px] px-2 py-0.5 rounded-full capitalize">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row md:flex-col gap-2 flex-shrink-0 w-full md:w-auto">
                    <button
                      onClick={() => handleApprove(hotelId, hotel.name)}
                      disabled={isApproving || isRejecting}
                      className="flex-grow md:flex-grow-0 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-400 border border-emerald-800/80 text-xs font-semibold py-2 px-6 rounded-xl transition cursor-pointer disabled:opacity-50 text-center"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(hotelId, hotel.name)}
                      disabled={isApproving || isRejecting}
                      className="flex-grow md:flex-grow-0 bg-red-950/50 hover:bg-red-900/60 text-red-400 border border-red-800/80 text-xs font-semibold py-2 px-6 rounded-xl transition cursor-pointer disabled:opacity-50 text-center"
                    >
                      ✕ Reject
                    </button>
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
