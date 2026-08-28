import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetRoomsByHotelQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation
} from '../../features/rooms/roomApiSlice';
import { toast } from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import CloudinaryImageUpload from '../../components/common/CloudinaryImageUpload';

export default function ManageRooms() {
  const { hotelId } = useParams();

  const { data: roomsResponse, isLoading, error } = useGetRoomsByHotelQuery(hotelId);
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();

  const rooms = Array.isArray(roomsResponse)
    ? roomsResponse
    : roomsResponse?.data || roomsResponse?.rooms || [];

  // Form states
  const [roomType, setRoomType] = useState('standard');
  const [pricePerNight, setPricePerNight] = useState('');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [totalRooms, setTotalRooms] = useState('5');
  const [amenitiesString, setAmenitiesString] = useState('');
  const [roomImages, setRoomImages] = useState([]);

  // Editing state
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setRoomType('standard');
    setPricePerNight('');
    setAdults('2');
    setChildren('0');
    setTotalRooms('5');
    setAmenitiesString('');
    setRoomImages([]);
    setEditingId(null);
  };

  const handleEditClick = (room) => {
    setEditingId(room._id || room.id);
    setRoomType(room.roomType || 'standard');
    setPricePerNight(room.pricePerNight?.toString() || '');

    const roomAdults = room.capacity?.adults ?? room.adults ?? 2;
    const roomChildren = room.capacity?.children ?? room.children ?? 0;
    setAdults(roomAdults.toString());
    setChildren(roomChildren.toString());

    setTotalRooms(room.totalRooms?.toString() || '1');
    setAmenitiesString(room.amenities ? room.amenities.join(', ') : '');
    setRoomImages(room.images || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pricePerNight || !adults || !totalRooms) {
      toast.error('Please enter all required fields');
      return;
    }

    const amenitiesList = amenitiesString
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const payload = {
      roomType,
      pricePerNight: Number(pricePerNight),
      capacity: {
        adults: Number(adults),
        children: Number(children),
      },
      adults: Number(adults),
      children: Number(children),
      totalRooms: Number(totalRooms),
      amenities: amenitiesList,
      images: roomImages,
    };

    try {
      if (editingId) {
        await updateRoom({ id: editingId, ...payload }).unwrap();
        toast.success('Room category updated successfully!');
      } else {
        await createRoom({ hotelId, ...payload }).unwrap();
        toast.success('Room category added successfully!');
      }
      resetForm();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Operation failed. Please review values.');
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room type?')) return;
    try {
      const res = await deleteRoom(roomId).unwrap();
      toast.success(res?.message || 'Room type deleted successfully');
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to delete room');
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12">
        Failed to load rooms details. Please check your backend connection.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8 font-sans px-4 sm:px-6">
      {rooms.length === 0 && (
        <div className="bg-sky-500/10 dark:bg-sky-900/30 border border-sky-500/20 dark:border-sky-700/40 text-sky-800 dark:text-sky-200 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium shadow-sm">
          <span>🎉 Your hotel is set up! Add at least one room type so guests can start booking.</span>
        </div>
      )}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Manage Rooms
        </h2>
        <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-1">
          Configure room categories, pricing tiers, capacities, and uploaded photos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Active Rooms List (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
            Active Room Classes ({rooms.length})
          </h3>

          {rooms.length === 0 ? (
            <div className="text-center p-12 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl text-[var(--text-muted)] text-sm">
              No room categories registered for this hotel yet. Use the panel on the right to add one.
            </div>
          ) : (
            <div className="space-y-4 font-sans">
              {rooms.map((room) => {
                const roomId = room._id || room.id;
                const adultsCount = room.capacity?.adults ?? room.adults ?? 2;
                const childrenCount = room.capacity?.children ?? room.children ?? 0;

                return (
                  <div
                    key={roomId}
                    className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition duration-150"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)] capitalize truncate">
                          {room.roomType}
                        </h4>
                        {!room.isActive && (
                          <span className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">
                            Deactivated
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                        Capacity: {adultsCount} Adults, {childrenCount} Children | Available: {room.totalRooms} rooms
                      </p>
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {room.amenities.slice(0, 4).map((item, index) => (
                            <span
                              key={index}
                              className="bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] px-2 py-0.5 rounded-full capitalize"
                            >
                              {item}
                            </span>
                          ))}
                          {room.amenities.length > 4 && (
                            <span className="text-[10px] text-[var(--text-muted)] self-center">
                              +{room.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 sm:border-l sm:border-[var(--border-color)] sm:pl-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--border-color)]">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-semibold">
                          Night Rate
                        </span>
                        <span className="text-base sm:text-lg font-extrabold text-[var(--color-primary)]">
                          ${room.pricePerNight}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(room)}
                          className="bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[var(--border-color)] transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(roomId)}
                          disabled={isDeleting}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Room configuration form (2 cols) */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)]">
            {editingId ? 'Edit Room Category' : 'Add New Room Category'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">
                Room Category Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] text-[var(--text-primary)] rounded-2xl px-3.5 py-2.5 outline-none transition capitalize text-xs"
                required
              >
                <option value="standard">Standard Room</option>
                <option value="deluxe">Deluxe Room</option>
                <option value="suite">Luxury Suite</option>
                <option value="executive">Executive Suite</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">
                Price Per Night ($)
              </label>
              <input
                type="number"
                min="1"
                placeholder="120"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] text-[var(--text-primary)] rounded-2xl px-3.5 py-2.5 outline-none transition text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">
                  Max Adults
                </label>
                <input
                  type="number"
                  min="1"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] text-[var(--text-primary)] rounded-2xl px-3.5 py-2.5 outline-none transition text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">
                  Max Children
                </label>
                <input
                  type="number"
                  min="0"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] text-[var(--text-primary)] rounded-2xl px-3.5 py-2.5 outline-none transition text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">
                Total Available Rooms
              </label>
              <input
                type="number"
                min="1"
                value={totalRooms}
                onChange={(e) => setTotalRooms(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] text-[var(--text-primary)] rounded-2xl px-3.5 py-2.5 outline-none transition text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[var(--text-secondary)] text-[10px] mb-1.5">
                Amenities (comma-separated)
              </label>
              <input
                type="text"
                placeholder="King Bed, Balcony, WiFi, Minibar"
                value={amenitiesString}
                onChange={(e) => setAmenitiesString(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-primary)] text-[var(--text-primary)] rounded-2xl px-3.5 py-2.5 outline-none transition text-xs"
              />
            </div>

            <CloudinaryImageUpload
              images={roomImages}
              onChange={setRoomImages}
              label="Room Category Photos"
            />

            <div className="flex gap-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold py-3 rounded-2xl transition cursor-pointer text-center text-xs"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex-1 text-white font-bold py-3 rounded-2xl transition duration-200 cursor-pointer text-center text-xs shadow-md"
                style={{ background: 'var(--color-primary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary)')}
              >
                {editingId ? 'Save Changes' : 'Add Room Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
