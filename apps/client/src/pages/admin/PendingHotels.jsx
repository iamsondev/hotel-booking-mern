import { useState } from 'react';
import { useGetPendingHotelsQuery, useApproveHotelMutation, useRejectHotelMutation } from '../../features/hotels/hotelApiSlice';
import { toast } from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import {
  MapPin,
  CheckCircle,
  XCircle,
  Building2,
  BedDouble,
  Layers,
  ChevronDown,
  ChevronUp,
  Users,
  Star,
  User,
  Mail,
  Phone,
  Sparkles,
  ShieldAlert,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { confirmDelete } from '../../utils/confirmDialog';

export default function PendingHotels() {
  const { data: pendingResponse, isLoading, error } = useGetPendingHotelsQuery();
  const [approveHotel, { isLoading: isApproving }] = useApproveHotelMutation();
  const [rejectHotel, { isLoading: isRejecting }] = useRejectHotelMutation();
  const [expandedHotelId, setExpandedHotelId] = useState(null);

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
    const isConfirmed = await confirmDelete({
      title: 'Reject Hotel Submission?',
      text: `Are you sure you want to reject "${hotelName}"? The owner will need to resubmit.`,
      confirmButtonText: 'Yes, Reject',
    });
    if (!isConfirmed) return;

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
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12 shadow-lg">
        Failed to load pending hotels. Please check your backend connection.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-color)]/60">
        <div>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 px-3.5 py-1 rounded-full text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Listing Moderation Queue</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
            Pending Property Approvals
          </h2>
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-1">
            Audit vendor property profiles, available room categories, and total inventory before releasing live to guests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] px-4 py-2 rounded-2xl text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-2 shadow-sm">
            <Building2 className="w-4 h-4 text-[var(--color-primary)]" />
            <span>{hotels.length} {hotels.length === 1 ? 'Property' : 'Properties'} Awaiting Review</span>
          </div>
        </div>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center p-16 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl text-[var(--text-muted)] text-sm shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">All clear! No pending submissions</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
            All submitted hotels have been thoroughly reviewed and processed.
          </p>
        </div>
      ) : (
        <div className="space-y-6 font-sans">
          {hotels.map((hotel) => {
            const hotelId = hotel._id || hotel.id;
            const imageUrl = hotel.images?.[0] ||
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';

            const roomsDetails = hotel.roomsDetails || [];
            const roomCount = hotel.roomCount ?? roomsDetails.length;

            const calculatedRoomsSum = roomsDetails.reduce((sum, r) => {
              const count = Number(r.totalRooms);
              return sum + (count > 0 ? count : 1);
            }, 0);

            const totalPhysicalRooms = (hotel.totalPhysicalRooms && hotel.totalPhysicalRooms > 0)
              ? hotel.totalPhysicalRooms
              : (calculatedRoomsSum > 0 ? calculatedRoomsSum : roomCount);

            const isExpanded = expandedHotelId === hotelId;
            const starCount = hotel.starRating || 3;
            const ownerName = hotel.owner?.name || 'Vendor Owner';
            const ownerEmail = hotel.owner?.email || '';

            return (
              <div
                key={hotelId}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-primary)]/40 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative group"
              >
                {/* Subtle top accent line */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500"></div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Top Bar: Property Title, Stars & Owner Info */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[var(--border-color)]/60">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
                          {hotel.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-extrabold shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                          Pending Review
                        </span>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap text-xs text-[var(--text-secondary)]">
                        <span className="flex items-center text-[var(--color-primary)] font-semibold">
                          <MapPin className="w-3.5 h-3.5 mr-1" />
                          {hotel.address?.street ? `${hotel.address.street}, ` : ''}{hotel.address?.city || 'Location unspecified'}, {hotel.address?.country || ''}
                        </span>

                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: starCount }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-[11px] font-bold text-[var(--text-muted)] ml-1">
                            ({starCount} Star Rating)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Owner Badge */}
                    <div className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl px-4 py-2.5 flex items-center gap-3 self-start lg:self-auto shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center justify-center font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-bold">Property Vendor</span>
                        <span className="font-bold text-[var(--text-primary)] block">{ownerName}</span>
                        {ownerEmail && (
                          <span className="text-[11px] text-[var(--text-muted)] block flex items-center gap-1">
                            <Mail className="w-3 h-3 inline" /> {ownerEmail}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle Layout: Cover Photo + Details + Inventory Hub */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: Hotel Preview Image */}
                    <div className="lg:col-span-4 relative rounded-2xl overflow-hidden bg-[var(--bg-input)] border border-[var(--border-color)] group/img min-h-[200px] shadow-sm">
                      <img
                        src={imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover min-h-[200px] max-h-[260px] group-hover/img:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>
                      
                      {hotel.images && hotel.images.length > 1 && (
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>+{hotel.images.length} Photos</span>
                        </div>
                      )}
                    </div>

                    {/* Middle-Right: Summary Details & Room Breakdown */}
                    <div className="lg:col-span-8 space-y-4">
                      {/* Key Inventory KPI Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                              Room Types
                            </span>
                            <span className="text-lg font-black text-[var(--text-primary)]">
                              {roomCount} {roomCount === 1 ? 'Category' : 'Categories'}
                            </span>
                          </div>
                        </div>

                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-3 flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                            <BedDouble className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                              Total Inventory
                            </span>
                            <span className="text-lg font-black text-[var(--text-primary)]">
                              {totalPhysicalRooms} {totalPhysicalRooms === 1 ? 'Room' : 'Rooms'}
                            </span>
                          </div>
                        </div>

                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-3 flex items-center gap-3 col-span-2 sm:col-span-1">
                          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                              City Location
                            </span>
                            <span className="text-sm font-bold text-[var(--text-primary)] truncate block">
                              {hotel.address?.city || 'Unspecified'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[var(--text-secondary)] text-xs leading-relaxed line-clamp-2 bg-[var(--bg-input)]/50 p-3 rounded-2xl border border-[var(--border-color)]/60">
                        {hotel.description || 'No description provided for this listing.'}
                      </p>

                      {/* Amenities checklist chips */}
                      {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {hotel.amenities.map((item, idx) => (
                            <span
                              key={idx}
                              className="bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-semibold px-2.5 py-1 rounded-xl capitalize"
                            >
                              ✓ {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category Breakdown Section */}
                  {roomsDetails.length > 0 ? (
                    <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                            Category Breakdown ({roomsDetails.length} Registered Categories)
                          </span>
                          <span className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-cyan-500/20">
                            Detailed Inventory
                          </span>
                        </div>

                        {roomsDetails.length > 3 && (
                          <button
                            onClick={() => setExpandedHotelId(isExpanded ? null : hotelId)}
                            className="text-xs text-[var(--color-primary)] font-bold flex items-center hover:underline cursor-pointer bg-[var(--bg-input)] border border-[var(--border-color)] px-3 py-1 rounded-xl transition"
                          >
                            {isExpanded ? 'Collapse List' : `View All (${roomsDetails.length})`}
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                          </button>
                        )}
                      </div>

                      {/* Category Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(isExpanded ? roomsDetails : roomsDetails.slice(0, 3)).map((room, idx) => {
                          const categoryRooms = Number(room.totalRooms) > 0 ? room.totalRooms : 1;
                          return (
                            <div
                              key={room._id || idx}
                              className="bg-[var(--bg-input)] border border-[var(--border-color)] hover:border-[var(--color-primary)]/40 rounded-2xl p-4 space-y-2 shadow-sm transition"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-sm text-[var(--text-primary)] capitalize tracking-tight flex items-center gap-1.5">
                                  <BedDouble className="w-4 h-4 text-[var(--color-primary)]" />
                                  {room.roomType}
                                </span>
                                <span className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                                  {categoryRooms} {categoryRooms === 1 ? 'room' : 'rooms'} available
                                </span>
                              </div>

                              <div className="flex items-baseline justify-between pt-1 border-t border-[var(--border-color)]/50">
                                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                  ${room.pricePerNight} <span className="text-[10px] text-[var(--text-muted)] font-medium">/ night</span>
                                </div>
                                {room.capacity?.adults && (
                                  <span className="text-[11px] text-[var(--text-muted)] font-semibold flex items-center gap-1">
                                    <Users className="w-3 h-3 text-[var(--color-primary)]" /> {room.capacity.adults} Adults {room.capacity.children > 0 ? `, ${room.capacity.children} Child` : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-500" />
                      <span>
                        Notice: The property owner has registered this hotel profile, but has not added any room categories yet. Consider waiting for rooms before approving.
                      </span>
                    </div>
                  )}

                  {/* Bottom Control Actions Bar */}
                  <div className="pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button
                      onClick={() => handleReject(hotelId, hotel.name)}
                      disabled={isApproving || isRejecting}
                      className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-bold text-xs py-3 px-6 rounded-2xl transition duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-4.5 h-4.5" />
                      <span>Reject Property Submission</span>
                    </button>

                    <button
                      onClick={() => handleApprove(hotelId, hotel.name)}
                      disabled={isApproving || isRejecting}
                      className="w-full sm:w-auto text-white font-bold text-xs py-3 px-8 rounded-2xl transition duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl group/btn"
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    >
                      <CheckCircle className="w-4.5 h-4.5 group-hover/btn:scale-110 transition-transform" />
                      <span>Approve & Launch Live</span>
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


