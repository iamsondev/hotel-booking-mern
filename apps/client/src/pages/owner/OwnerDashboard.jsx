import { useGetMyHotelsQuery } from '../../features/hotels/hotelApiSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { Building2, PlusCircle, CheckCircle2, Clock, ArrowRight, Sparkles } from 'lucide-react';

export default function OwnerDashboard() {
  const { data: hotelsResponse, isLoading, error } = useGetMyHotelsQuery();
  const hotels = Array.isArray(hotelsResponse)
    ? hotelsResponse
    : hotelsResponse?.data || hotelsResponse?.hotels || [];

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
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-neutral-900 to-indigo-950/80 border border-neutral-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1 rounded-full text-purple-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Owner Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Property Partner Hub
            </h1>
            <p className="text-neutral-400 text-sm max-w-xl">
              Manage hotel properties, room listings, pricing tiers, and track approval status.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/owner/hotels/add"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-500/20 flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Hotel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Properties */}
        <div className="relative group bg-neutral-900/90 border border-neutral-800 hover:border-indigo-500/50 rounded-3xl p-6 transition duration-300 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Properties</span>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 group-hover:scale-110 transition duration-300">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{totalHotels}</span>
            <span className="text-xs text-neutral-500 font-medium">Hotels</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Registered under your account</p>
        </div>

        {/* Live / Approved */}
        <div className="relative group bg-neutral-900/90 border border-neutral-800 hover:border-emerald-500/50 rounded-3xl p-6 transition duration-300 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Active & Published</span>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 group-hover:scale-110 transition duration-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400">{approvedHotels}</span>
            <span className="text-xs text-neutral-500 font-medium">Live</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Visible to all travelers</p>
        </div>

        {/* Under Review */}
        <div className="relative group bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/50 rounded-3xl p-6 transition duration-300 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Under Review</span>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 group-hover:scale-110 transition duration-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-400">{pendingHotels}</span>
            <span className="text-xs text-neutral-500 font-medium">Pending</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Awaiting admin approval</p>
        </div>
      </div>

      {/* Console Quick Action Hub */}
      <div className="bg-neutral-900/80 border border-neutral-800 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left relative z-10">
          <h2 className="text-xl font-bold text-white tracking-tight">Property Management Console</h2>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-xl">
            Control property information, upload gallery images, define room configurations, and monitor pricing per night.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
          <Link
            to="/owner/hotels"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-2xl transition text-center text-sm cursor-pointer shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 group"
          >
            <span>Manage Properties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
          <Link
            to="/owner/hotels/add"
            className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 font-bold py-3.5 px-6 rounded-2xl transition text-center text-sm cursor-pointer flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-4 h-4 text-neutral-400" />
            <span>Add Property</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
