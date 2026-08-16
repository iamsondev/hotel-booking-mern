import { useParams } from 'react-router-dom';

export default function BookingPage() {
  const { roomId } = useParams();

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-2xl mx-auto my-12 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-2">Book Your Room</h2>
      <p className="text-neutral-500 mb-4">Complete your check-out process for room ID: <span className="text-indigo-400 font-mono">{roomId}</span></p>
      <p className="text-neutral-400 leading-relaxed">
        This is a placeholder page containing customer info fields, date selectors, and Stripe payment components.
      </p>
    </div>
  );
}
