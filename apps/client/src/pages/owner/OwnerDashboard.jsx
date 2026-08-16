import { useGetMyHotelsQuery } from '../../features/hotels/hotelApiSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';

export default function OwnerDashboard() {
  const { data: hotelsResponse, isLoading, error } = useGetMyHotelsQuery();
  const hotels = hotelsResponse?.hotels || hotelsResponse || [];

  const totalHotels = hotels.length;
  const pendingHotels = hotels.filter((h) => h.status?.toLowerCase() === 'pending').length;
  const approvedHotels = hotels.filter(
    (h) => h.status?.toLowerCase() === 'approved' || h.status?.toLowerCase() === 'active'
  ).length;

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12">
        Failed to load owner dashboard stats. Please check your backend connection.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Owner Dashboard</h2>
        <p className="text-neutral-450 text-sm mt-1" style={{ color: '#888' }}>Overview of your business performance, approvals, and actions.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Hotels */}
        <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-6 shadow-md" style={{ borderColor: '#222' }}>
          <h3 className="text-xs font-semibold text-neutral-450 uppercase tracking-wider mb-2">Total Hotels</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white">{totalHotels}</span>
            <span className="text-neutral-500 text-xs">properties</span>
          </div>
        </div>

        {/* Live / Approved */}
        <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-6 shadow-md" style={{ borderColor: '#222' }}>
          <h3 className="text-xs font-semibold text-neutral-450 uppercase tracking-wider mb-2">Live / Approved</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-emerald-400">{approvedHotels}</span>
            <span className="text-neutral-500 text-xs">active</span>
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-6 shadow-md" style={{ borderColor: '#222' }}>
          <h3 className="text-xs font-semibold text-neutral-450 uppercase tracking-wider mb-2">Under Review</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-amber-400">{pendingHotels}</span>
            <span className="text-neutral-500 text-xs">pending</span>
          </div>
        </div>
      </div>

      {/* Action panel & Link */}
      <div className="bg-neutral-900 border border-neutral-880 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderColor: '#1c1c1c' }}>
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-white tracking-tight">Property Management Console</h3>
          <p className="text-neutral-450 text-sm leading-relaxed" style={{ color: '#aaa' }}>
            Add new listings, update active amenities, establish rooms descriptions, and manage reservations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            to="/owner/hotels"
            className="bg-indigo-650 hover:bg-indigo-600 bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-2xl transition text-center text-sm cursor-pointer"
          >
            Manage Hotels
          </Link>
          <Link
            to="/owner/hotels/add"
            className="bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-semibold py-2.5 px-6 rounded-2xl transition text-center text-sm cursor-pointer"
          >
            Add New Hotel
          </Link>
        </div>
      </div>
    </div>
  );
}
