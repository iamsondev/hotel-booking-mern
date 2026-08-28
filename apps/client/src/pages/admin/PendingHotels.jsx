import { useGetPendingHotelsQuery, useApproveHotelMutation, useRejectHotelMutation } from '../../features/hotels/hotelApiSlice';
import { toast } from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import { MapPin, CheckCircle, XCircle, Building2 } from 'lucide-react';

export default function PendingHotels() {
  const { data: pendingResponse, isLoading, error } = useGetPendingHotelsQuery();
  const [approveHotel, { isLoading: isApproving }] = useApproveHotelMutation();
  const [rejectHotel, { isLoading: isRejecting }] = useRejectHotelMutation();

  const hotels = Array.isArray(pendingResponse)
    ? pendingResponse
    : pendingResponse?.data || pendingResponse?.hotels || [];

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
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6 font-sans">
      <div>
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-500 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>Listing Moderation Queue</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Pending Hotel Approvals</h2>
        <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-1">
          Review and approve or reject submitted hotel listings before they appear live on the platform.
        </p>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center p-12 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl text-[var(--text-muted)] text-sm">
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
                className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-primary)]/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl flex flex-col md:flex-row transition duration-200"
              >
                {/* Image */}
                <div className="md:w-56 w-full flex-shrink-0 bg-[var(--bg-input)] min-h-[160px]">
                  <img
                    src={imageUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover min-h-[160px]"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>

                {/* Details & Actions Layout */}
                <div className="flex flex-1 flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6">
                  {/* Info Block */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)] tracking-tight">{hotel.name}</h3>
                      <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold">
                        Pending Listing
                      </span>
                    </div>

                    <p className="text-[var(--text-secondary)] text-xs flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[var(--color-primary)] flex-shrink-0" />
                      {hotel.address?.city || 'City unspecified'}, {hotel.address?.country || ''}
                    </p>

                    {/* Room count status indicator */}
                    <div className="pt-0.5">
                      {(hotel.roomCount ?? 0) > 0 ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          ✓ {hotel.roomCount} room types added
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                          ⚠️ No rooms added yet
                        </span>
                      )}
                    </div>

                    <p className="text-[var(--text-secondary)] text-xs line-clamp-2 leading-relaxed">
                      {hotel.description || 'No description provided.'}
                    </p>

                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {hotel.amenities.slice(0, 4).map((item, idx) => (
                          <span key={idx} className="bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] px-2 py-0.5 rounded-full capitalize">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row md:flex-col gap-2 flex-shrink-0 w-full md:w-auto items-stretch md:items-end">
                    <div className="relative group flex-1 md:flex-initial">
                      <button
                        onClick={() => handleApprove(hotelId, hotel.name)}
                        disabled={isApproving || isRejecting}
                        className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold py-2.5 px-6 rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>

                      {/* Warning tooltip note on hover when roomCount === 0 */}
                      {(hotel.roomCount ?? 0) === 0 && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-0 mb-2 z-20 whitespace-nowrap bg-slate-900 dark:bg-slate-800 text-amber-400 text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-xl border border-amber-500/30">
                          Consider waiting until owner adds rooms
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleReject(hotelId, hotel.name)}
                      disabled={isApproving || isRejecting}
                      className="flex-1 md:flex-initial bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-bold py-2.5 px-6 rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
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
