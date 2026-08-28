import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetMyHotelsQuery, useUpdateHotelMutation, useDeleteHotelMutation } from '../../features/hotels/hotelApiSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import CloudinaryImageUpload from '../../components/common/CloudinaryImageUpload';
import { toast } from 'react-hot-toast';
import { confirmDelete } from '../../utils/confirmDialog';

export default function MyHotels() {
  const { user } = useSelector((state) => state.auth);
  const { data: hotelsResponse, isLoading, error } = useGetMyHotelsQuery();
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();
  const [deleteHotel, { isLoading: isDeleting }] = useDeleteHotelMutation();
  const hotels = hotelsResponse?.hotels || hotelsResponse || [];

  // Edit Modal State
  const [editingHotel, setEditingHotel] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStarRating, setEditStarRating] = useState('3');
  const [editCity, setEditCity] = useState('');
  const [editStreet, setEditStreet] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editImages, setEditImages] = useState([]);

  const openEditModal = (hotel) => {
    setEditingHotel(hotel);
    setEditName(hotel.name || '');
    setEditDescription(hotel.description || '');
    setEditStarRating(hotel.starRating?.toString() || '3');
    setEditCity(hotel.address?.city || '');
    setEditStreet(hotel.address?.street || hotel.address?.line1 || '');
    setEditCountry(hotel.address?.country || '');
    setEditImages(hotel.images || []);
  };

  const closeEditModal = () => {
    setEditingHotel(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingHotel) return;

    try {
      const hotelId = editingHotel._id || editingHotel.id;
      await updateHotel({
        id: hotelId,
        name: editName,
        description: editDescription,
        starRating: parseInt(editStarRating, 10) || 3,
        address: {
          ...editingHotel.address,
          street: editStreet,
          city: editCity,
          country: editCountry,
        },
        images: editImages,
      }).unwrap();

      toast.success('Hotel details updated successfully!');
      closeEditModal();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to update hotel details');
    }
  };

  const handleDelete = async (hotelId) => {
    const isConfirmed = await confirmDelete({
      title: 'Delete Hotel Listing?',
      text: 'This will permanently delete the hotel or deactivate it if active bookings exist.',
      confirmButtonText: 'Yes, Delete',
    });
    if (!isConfirmed) return;

    try {
      const res = await deleteHotel(hotelId).unwrap();
      toast.success(res?.message || 'Hotel request processed successfully');
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to process hotel deletion');
    }
  };

  const getStatusBadge = (status, isDeleted) => {
    if (isDeleted) {
      return 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20';
    }
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20';
      default:
        return 'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-color)]';
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12">
        Failed to load hotels. Please check your backend connection.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">My Hotels</h2>
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-1">Select a property to manage its rooms or update property details.</p>
        </div>
        <Link
          to="/owner/hotels/add"
          className="text-white font-bold py-2.5 px-6 rounded-2xl transition text-xs shadow-md cursor-pointer"
          style={{ background: 'var(--color-primary)' }}
        >
          Add New Hotel
        </Link>
      </div>

      {user && user.isApproved === false && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-700 dark:text-amber-300 text-xs sm:text-sm flex items-start space-x-3">
          <span className="text-xl">⚠️</span>
          <div>
            <span className="font-bold block">Vendor Account Pending Approval</span>
            <p className="opacity-90 mt-0.5">
              Your Vendor/HotelOwner account is currently awaiting Admin verification. Once verified by our team, your listings will go live for guest bookings.
            </p>
          </div>
        </div>
      )}

      {!hotels || hotels.length === 0 ? (
        <div className="text-center p-12 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl text-[var(--text-muted)] text-sm">
          You have not added any hotels yet. Click &quot;Add New Hotel&quot; to begin!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {hotels.map((hotel) => {
            const hotelId = hotel._id || hotel.id;
            const imageUrl = hotel.images && hotel.images.length > 0 
              ? hotel.images[0] 
              : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={hotelId}
                className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-200 flex flex-col justify-between ${hotel.isDeleted ? 'opacity-75' : ''}`}
              >
                <div>
                  <div className="aspect-[21/9] bg-[var(--bg-input)] relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full shadow-md backdrop-blur-md ${getStatusBadge(hotel.status, hotel.isDeleted)}`}>
                        {hotel.isDeleted ? 'Deactivated' : hotel.status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-extrabold text-[var(--text-primary)] tracking-tight">{hotel.name}</h3>
                      <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        ★ {hotel.starRating} Star
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)] text-xs font-medium">
                      📍 {hotel.address?.street ? `${hotel.address.street}, ` : ''}{hotel.address?.city}, {hotel.address?.country}
                    </p>
                    <p className="text-[var(--text-secondary)] text-xs line-clamp-2 leading-relaxed">{hotel.description || 'No description provided.'}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between gap-2 text-xs font-bold">
                  <button
                    onClick={() => openEditModal(hotel)}
                    disabled={hotel.isDeleted}
                    className="flex-1 text-center bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] py-2.5 px-3 rounded-xl transition border border-[var(--border-color)] cursor-pointer disabled:opacity-40"
                  >
                    Edit Details
                  </button>
                  {hotel.isDeleted ? (
                    <button
                      disabled
                      className="flex-1 text-center bg-[var(--bg-input)] text-[var(--text-muted)] py-2.5 px-3 rounded-xl transition border border-[var(--border-color)] opacity-40 cursor-not-allowed"
                    >
                      Manage Rooms
                    </button>
                  ) : (
                    <Link
                      to={`/owner/hotels/${hotelId}/rooms`}
                      className="flex-1 text-center text-white py-2.5 px-3 rounded-xl transition shadow cursor-pointer"
                      style={{ background: 'var(--color-primary)' }}
                    >
                      Manage Rooms
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(hotelId)}
                    disabled={isDeleting || hotel.isDeleted}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-2.5 px-3 rounded-xl transition cursor-pointer disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Hotel Modal */}
      {editingHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-4">
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">Edit Property Listing</h3>
              <button
                onClick={closeEditModal}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">Property Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl px-3.5 py-2.5 outline-none focus:border-[var(--color-primary)]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">Star Rating</label>
                  <select
                    value={editStarRating}
                    onChange={(e) => setEditStarRating(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl px-3.5 py-2.5 outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Star Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="3"
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl px-3.5 py-2.5 outline-none focus:border-[var(--color-primary)] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">Street</label>
                  <input
                    type="text"
                    value={editStreet}
                    onChange={(e) => setEditStreet(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl px-3 py-2 outline-none focus:border-[var(--color-primary)] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl px-3 py-2 outline-none focus:border-[var(--color-primary)] text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">Country</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl px-3 py-2 outline-none focus:border-[var(--color-primary)] text-xs"
                    required
                  />
                </div>
              </div>

              <CloudinaryImageUpload
                images={editImages}
                onChange={setEditImages}
                label="Property Gallery Photos"
              />

              <div className="flex gap-3 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-primary)] py-2.5 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 text-white py-2.5 rounded-xl font-bold transition shadow"
                  style={{ background: 'var(--color-primary)' }}
                >
                  {isUpdating ? 'Saving Changes...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
