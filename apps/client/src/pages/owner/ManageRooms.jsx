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

export default function ManageRooms() {
  const { hotelId } = useParams();

  const { data: roomsResponse, isLoading, error } = useGetRoomsByHotelQuery(hotelId);
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();

  const rooms = roomsResponse?.rooms || roomsResponse || [];

  // Form states
  const [roomType, setRoomType] = useState('standard');
  const [pricePerNight, setPricePerNight] = useState('');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [totalRooms, setTotalRooms] = useState('5');
  const [amenitiesString, setAmenitiesString] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setRoomType('standard');
    setPricePerNight('');
    setAdults('2');
    setChildren('0');
    setTotalRooms('5');
    setAmenitiesString('');
    setEditingId(null);
  };

  const handleEditClick = (room) => {
    setEditingId(room._id || room.id);
    setRoomType(room.roomType || 'standard');
    setPricePerNight(room.pricePerNight?.toString() || '');
    
    // Support nested or flat capacity structure safely
    const roomAdults = room.capacity?.adults ?? room.adults ?? 2;
    const roomChildren = room.capacity?.children ?? room.children ?? 0;
    setAdults(roomAdults.toString());
    setChildren(roomChildren.toString());
    
    setTotalRooms(room.totalRooms?.toString() || '1');
    setAmenitiesString(room.amenities ? room.amenities.join(', ') : '');
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
      // Fla fields fallback support inside database requests
      adults: Number(adults),
      children: Number(children),
      totalRooms: Number(totalRooms),
      amenities: amenitiesList,
    };

    try {
      if (editingId) {
        // Edit mode
        await updateRoom({ id: editingId, ...payload }).unwrap();
        toast.success('Room type updated successfully!');
      } else {
        // Add mode
        await createRoom({ hotelId, ...payload }).unwrap();
        toast.success('Room type added successfully!');
      }
      resetForm();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Operation failed. Please review values.');
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room level?')) return;
    try {
      await deleteRoom(roomId).unwrap();
      toast.success('Room type deleted successfully');
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
    <div className="max-w-5xl mx-auto py-6 space-y-12">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Manage Rooms</h2>
        <p className="text-neutral-450 text-sm mt-1" style={{ color: '#888' }}>Configure room inventories, capacities, pricing tiers, and descriptions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Rooms List Table/Grid (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">Active Rooms Classes</h3>
          
          {rooms.length === 0 ? (
            <div className="text-center p-12 bg-neutral-900 border border-neutral-808 rounded-3xl text-neutral-400 text-sm" style={{ borderColor: '#1c1c1c', color: '#888' }}>
              No room types registered for this hotel yet. Use the dashboard panel to add one.
            </div>
          ) : (
            <div className="space-y-3 font-sans">
              {rooms.map((room) => {
                const roomId = room._id || room.id;
                const adultsCount = room.capacity?.adults ?? room.adults ?? 2;
                const childrenCount = room.capacity?.children ?? room.children ?? 0;
                
                return (
                  <div
                    key={roomId}
                    className="bg-neutral-900 border border-neutral-850 hover:border-neutral-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition duration-150"
                    style={{ borderColor: '#222' }}
                  >
                    <div>
                      <h4 className="text-lg font-bold text-white tracking-tight capitalize group-hover:text-indigo-400 transition mb-1">
                        {room.roomType}
                      </h4>
                      <p className="text-neutral-400 text-xs leading-relaxed">
                        Max Capacity: {adultsCount} Adults, {childrenCount} Children | Quantity: {room.totalRooms}
                      </p>
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {room.amenities.slice(0, 3).map((item, index) => (
                            <span key={index} className="bg-neutral-950 border border-neutral-850 text-neutral-500 text-[10px] px-2 py-0.5 rounded-full capitalize">
                              {item}
                            </span>
                          ))}
                          {room.amenities.length > 3 && (
                            <span className="text-[10px] text-neutral-600 self-center">+{room.amenities.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:border-l sm:border-neutral-850 sm:pl-6">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-neutral-550 block">Night Rate</span>
                        <span className="text-lg font-extrabold text-indigo-400">${room.pricePerNight}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(room)}
                          className="bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs px-3 py-1.5 rounded-lg border border-neutral-750 transition duration-150 cursor-pointer"
                          style={{ borderColor: '#2c2c2c' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(roomId)}
                          disabled={isDeleting}
                          className="bg-neutral-850 hover:bg-red-950/80 text-neutral-450 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg border border-neutral-750 hover:border-red-900/30 transition duration-150 cursor-pointer"
                          style={{ borderColor: '#2c2c2c' }}
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
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-805 rounded-3xl p-6 shadow-2xl relative" style={{ borderColor: '#222' }}>
          <h3 className="text-lg font-bold text-white mb-6">
            {editingId ? 'Edit Room Configuration' : 'Add New Room Class'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Room Type / Category</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-neutral-955 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-550 text-sm capitalize"
                style={{ background: '#0a0a0a' }}
                required
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Price Per Night ($)</label>
              <input
                type="number"
                min="1"
                placeholder="120"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(e.target.value)}
                className="w-full bg-neutral-950/70 border border-neutral-805 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Max Adults</label>
                <input
                  type="number"
                  min="1"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Max Children</label>
                <input
                  type="number"
                  min="0"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Total Rooms Inventory</label>
              <input
                type="number"
                min="1"
                value={totalRooms}
                onChange={(e) => setTotalRooms(e.target.value)}
                className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Amenities (comma-separated)</label>
              <input
                type="text"
                placeholder="King Bed, Balcony, Minibar"
                value={amenitiesString}
                onChange={(e) => setAmenitiesString(e.target.value)}
                className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-grow bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-semibold py-3 rounded-2xl transition cursor-pointer text-center text-sm"
                  style={{ borderColor: '#2c2c2c' }}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex-grow bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-2xl transition duration-200 cursor-pointer text-center text-sm"
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
