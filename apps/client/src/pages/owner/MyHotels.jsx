import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetMyHotelsQuery, useUpdateHotelMutation, useDeleteHotelMutation } from '../../features/hotels/hotelApiSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import CloudinaryImageUpload from '../../components/common/CloudinaryImageUpload';
import { toast } from 'react-hot-toast';

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
    if (window.confirm('This will delete the hotel or deactivate it if bookings exist. Continue?')) {
      try {
        const res = await deleteHotel(hotelId).unwrap();
        toast.success(res?.message || 'Hotel request processed successfully');
      } catch (err) {
        toast.error(err?.data?.message || err?.error || 'Failed to process hotel deletion');
      }
    }
  };

  const getStatusBadge = (status, isDeleted) => {
    if (isDeleted) {
      return 'bg-neutral-800 text-neutral-400 border border-neutral-600';
    }
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50';
      case 'pending':
        return 'bg-amber-950/80 text-amber-300 border border-amber-500/50';
      case 'rejected':
        return 'bg-red-950/80 text-red-300 border border-red-500/50';
      case 'suspended':
        return 'bg-neutral-800 text-neutral-400 border border-neutral-600';
      default:
        return 'bg-neutral-850 text-neutral-400 border border-neutral-800';
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
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">My Hotels</h2>
          <p className="text-neutral-450 text-sm mt-1" style={{ color: '#888' }}>Select a hotel subclass to manage its rooms list or update details.</p>
        </div>
        <Link
          to="/owner/hotels/add"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-2xl transition text-sm cursor-pointer"
        >
          Add New Hotel
        </Link>
      </div>

      {user && user.isApproved === false && (
        <div className="bg-amber-950/40 border border-amber-800/80 rounded-2xl p-4 text-amber-300 text-sm flex items-start space-x-3">
          <span className="text-xl">⚠️</span>
          <div>
            <span className="font-bold text-amber-200 block">Vendor Account Pending Approval</span>
            <p className="text-xs text-amber-300/80 mt-0.5">
              Your Vendor/HotelOwner account is currently awaiting Admin verification. Once your account is verified by our admin team, you will be able to publish live hotel listings.
            </p>
          </div>
        </div>
      )}

      {!hotels || hotels.length === 0 ? (
        <div className="text-center p-12 bg-neutral-900 border border-neutral-808 rounded-3xl text-neutral-400 text-sm" style={{ borderColor: '#1c1c1c', color: '#888' }}>
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
                className={`bg-neutral-900 border border-neutral-850 hover:border-neutral-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition duration-200 flex flex-col justify-between ${hotel.isDeleted ? 'opacity-80' : ''}`}
                style={{ borderColor: '#222' }}
              >
                {/* Details Section */}
                <div>
                  <div className="aspect-[21/9] bg-neutral-805 relative overflow-hidden" style={{ background: '#181818' }}>
                    <img
                      src={imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute top-4 right-4 shadow-md">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-semibold backdrop-blur-md ${getStatusBadge(hotel.status, hotel.isDeleted)}`}>
                        {hotel.isDeleted ? 'Deactivated' : (hotel.status || 'Pending')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-white tracking-tight line-clamp-1">{hotel.name}</h3>
                    <p className="text-neutral-400 text-xs flex items-center leading-relaxed">
                      <svg className="w-4 h-4 mr-1 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hotel.address?.street || hotel.address?.line1 ? `${hotel.address?.street || hotel.address?.line1}, ` : ''}{hotel.address?.city || 'City unspecified'}
                    </p>
                    <p className="text-neutral-450 text-sm line-clamp-2" style={{ color: '#aaa' }}>{hotel.description || 'No description provided.'}</p>

                    {hotel.isDeleted ? (
                      <div className="bg-neutral-850 border border-neutral-750 rounded-xl p-2.5 text-xs text-neutral-400">
                        <span className="font-bold text-neutral-300">Status Notice:</span> Deactivated (Hotel has booking history, deactivated instead of deleted)
                      </div>
                    ) : hotel.status?.toLowerCase() === 'rejected' ? (
                      <div className="bg-red-950/40 border border-red-900/60 rounded-xl p-2.5 text-xs text-red-300">
                        <span className="font-bold">Status Notice:</span> Rejected (Contact admin or update listing details for re-review)
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Actions Section */}
                <div className="px-6 pb-6 pt-4 border-t border-neutral-850 flex items-center justify-between gap-2" style={{ borderColor: '#222' }}>
                  <button
                    onClick={() => openEditModal(hotel)}
                    disabled={hotel.isDeleted}
                    className="flex-grow text-center bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold py-2.5 px-3 rounded-xl transition border border-neutral-750 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderColor: '#2c2c2c' }}
                  >
                    Edit Details
                  </button>
                  {hotel.isDeleted ? (
                    <button
                      disabled
                      className="flex-grow text-center bg-neutral-850 text-neutral-500 text-xs font-semibold py-2.5 px-3 rounded-xl transition border border-neutral-800 opacity-40 cursor-not-allowed"
                    >
                      Manage Rooms
                    </button>
                  ) : (
                    <Link
                      to={`/owner/hotels/${hotelId}/rooms`}
                      className="flex-grow text-center bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition cursor-pointer"
                    >
                      Manage Rooms
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(hotelId)}
                    disabled={isDeleting || hotel.isDeleted}
                    className="bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-900/60 text-xs font-semibold py-2.5 px-3 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <h3 className="text-xl font-bold text-white">Edit Property Listing</h3>
              <button
                onClick={closeEditModal}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-5 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Property Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Star Rating</label>
                  <select
                    value={editStarRating}
                    onChange={(e) => setEditStarRating(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500"
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="3"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Street</label>
                  <input
                    type="text"
                    value={editStreet}
                    onChange={(e) => setEditStreet(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Cloudinary Image Upload Section */}
              <CloudinaryImageUpload
                images={editImages}
                onChange={setEditImages}
                label="Property Gallery Photos"
              />

              <div className="flex gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 py-2.5 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-semibold transition"
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

