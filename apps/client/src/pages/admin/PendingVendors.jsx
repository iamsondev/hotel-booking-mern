import { useGetPendingOwnersQuery, useApproveOwnerMutation, useRejectOwnerMutation } from '../../features/users/userApiSlice';
import { toast } from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import { UserCheck, UserX, Mail, Phone, Calendar, ShieldAlert } from 'lucide-react';

export default function PendingVendors() {
  const { data: pendingResponse, isLoading, error } = useGetPendingOwnersQuery();
  const [approveOwner, { isLoading: isApproving }] = useApproveOwnerMutation();
  const [rejectOwner, { isLoading: isRejecting }] = useRejectOwnerMutation();

  const pendingOwners = Array.isArray(pendingResponse)
    ? pendingResponse
    : pendingResponse?.data || [];

  const handleApprove = async (userId, userName) => {
    try {
      const res = await approveOwner(userId).unwrap();
      toast.success(res?.message || `Vendor account for ${userName} approved!`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to approve vendor account');
    }
  };

  const handleReject = async (userId, userName) => {
    if (!window.confirm(`Reject vendor application for "${userName}"? Account will be demoted to standard user.`)) return;
    try {
      const res = await rejectOwner(userId).unwrap();
      toast.success(res?.message || `Vendor request for ${userName} rejected.`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to reject vendor account');
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm max-w-md mx-auto my-12">
        Failed to load pending vendors. Please check backend connection.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div>
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Vendor KYC & Registration Queue</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Pending Vendor Accounts</h2>
        <p className="text-neutral-450 text-sm mt-1" style={{ color: '#888' }}>
          Verify and approve newly registered Hotel Owners before allowing them to manage properties on the platform.
        </p>
      </div>

      {pendingOwners.length === 0 ? (
        <div className="text-center p-12 bg-neutral-900 border border-neutral-808 rounded-3xl text-neutral-400 text-sm" style={{ borderColor: '#1c1c1c', color: '#888' }}>
          🎉 No pending vendor verification requests. All partner accounts are active!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {pendingOwners.map((owner) => {
            const ownerId = owner._id || owner.id;
            const createdDate = owner.createdAt ? new Date(owner.createdAt).toLocaleDateString() : 'N/A';

            return (
              <div
                key={ownerId}
                className="bg-neutral-900 border border-neutral-850 hover:border-neutral-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between space-y-4 transition duration-200"
                style={{ borderColor: '#222' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white tracking-tight">{owner.name}</h3>
                    <span className="bg-amber-950/60 text-amber-300 border border-amber-800/60 text-[11px] px-2.5 py-0.5 rounded-full capitalize font-semibold">
                      Pending Approval
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-400">
                    <p className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                      {owner.email}
                    </p>
                    {owner.phone && (
                      <p className="flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                        {owner.phone}
                      </p>
                    )}
                    <p className="flex items-center text-neutral-500 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 mr-2 text-neutral-500" />
                      Registered: {createdDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-neutral-850" style={{ borderColor: '#222' }}>
                  <button
                    onClick={() => handleApprove(ownerId, owner.name)}
                    disabled={isApproving || isRejecting}
                    className="flex-1 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-400 border border-emerald-800/80 text-xs font-semibold py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Approve Vendor</span>
                  </button>
                  <button
                    onClick={() => handleReject(ownerId, owner.name)}
                    disabled={isApproving || isRejecting}
                    className="flex-1 bg-red-950/50 hover:bg-red-900/60 text-red-400 border border-red-800/80 text-xs font-semibold py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5"
                  >
                    <UserX className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
