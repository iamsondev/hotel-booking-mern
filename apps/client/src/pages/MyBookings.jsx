export default function MyBookings() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-2xl mx-auto my-12 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">My Bookings</h2>
      <p className="text-neutral-450 leading-relaxed" style={{ color: '#aaa' }}>
        You don&apos;t have any active bookings yet.
      </p>
    </div>
  );
}
