import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const handlePay = (e) => {
    e.preventDefault();
    toast.success('Mock Payment processing successful!');
    navigate('/my-bookings');
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md mx-auto my-12 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-2">Secure Checkout</h2>
      <p className="text-xs text-neutral-500 mb-6 font-mono">Invoice Reference: {bookingId}</p>
      
      <form onSubmit={handlePay} className="space-y-4 font-sans">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Cardholder Name</label>
          <input
            type="text"
            className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 rounded-2xl px-4 py-2.5 text-white outline-none"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Card Details</label>
          <div className="w-full bg-neutral-950/70 border border-neutral-800 rounded-2xl px-4 py-2.5 text-neutral-450 text-sm flex justify-between items-center" style={{ color: '#888' }}>
            <span>4242 4242 4242 4242</span>
            <span>12 / 29</span>
            <span>CVC</span>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-2xl transition duration-200 mt-2 cursor-pointer text-center text-sm"
        >
          Pay with Card
        </button>
      </form>
    </div>
  );
}
