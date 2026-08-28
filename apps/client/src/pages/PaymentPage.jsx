import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../utils/stripe';
import { useCreatePaymentIntentMutation, useConfirmPaymentMutation } from '../features/payments/paymentApiSlice';
import { toast } from 'react-hot-toast';
import Loader from '../components/common/Loader';

function CheckoutForm({ bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [confirmPayment] = useConfirmPaymentMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/my-bookings`,
        },
        redirect: 'if_required',
      });

      if (result.error) {
        toast.error(result.error.message || 'Payment confirmation failed');
      } else {
        await confirmPayment(bookingId).unwrap();
        toast.success('Payment completed & reservation confirmed!');
        navigate('/my-bookings');
      }
    } catch (err) {
      toast.error('An unexpected error occurred processing your payment.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-805 rounded-3xl p-8 max-w-md mx-auto my-12 shadow-2xl relative" style={{ borderColor: '#222' }}>
      <h2 className="text-2xl font-bold text-white mb-2">Secure Checkout</h2>
      <p className="text-xs text-neutral-500 mb-6 font-mono">Invoice Reference: {bookingId}</p>

      <form onSubmit={handleSubmit} className="space-y-6 font-sans">
        <div className="bg-neutral-950/70 border border-neutral-850 p-4 rounded-2xl" style={{ borderColor: '#222' }}>
          <PaymentElement />
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold py-3 rounded-2xl transition duration-200 mt-2 cursor-pointer text-center text-sm flex items-center justify-center gap-2"
        >
          {isProcessing ? 'Processing Payment...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [createPaymentIntent, { isLoading: isIntentLoading }] = useCreatePaymentIntentMutation();
  const [confirmPayment, { isLoading: isConfirming }] = useConfirmPaymentMutation();
  const [clientSecret, setClientSecret] = useState('');
  const [isAlreadyPaid, setIsAlreadyPaid] = useState(false);

  const isValidId = bookingId && bookingId !== 'undefined' && bookingId.length === 24;

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        const res = await createPaymentIntent(bookingId).unwrap();
        if (res.alreadyPaid) {
          setIsAlreadyPaid(true);
          return;
        }
        const secret = res.data?.clientSecret || res.clientSecret || res.data?.data?.clientSecret || res.client_secret;
        setClientSecret(secret || '');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to initialize payment gateway');
      }
    };
    if (isValidId) {
      getClientSecret();
    }
  }, [bookingId, isValidId, createPaymentIntent]);

  if (!isValidId) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl text-center shadow-2xl space-y-4 font-sans">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">!</div>
        <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Invalid Booking Reference</h2>
        <p className="text-xs text-[var(--text-secondary)]">The booking reference URL is invalid or missing. Please select a valid reservation to make payment.</p>
        <button
          onClick={() => navigate('/my-bookings')}
          className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-2xl transition cursor-pointer text-sm"
        >
          Go to My Bookings
        </button>
      </div>
    );
  }

  if (isAlreadyPaid) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl text-center shadow-2xl space-y-4 font-sans">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
        <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Booking Confirmed!</h2>
        <p className="text-xs text-[var(--text-secondary)]">This reservation is already paid and active in your account.</p>
        <button
          onClick={() => navigate('/my-bookings')}
          className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-2xl transition cursor-pointer text-sm"
        >
          View My Bookings
        </button>
      </div>
    );
  }

  if (isIntentLoading || !clientSecret) {
    return <Loader />;
  }

  // Handle mock secret in dev mode
  if (clientSecret.startsWith('pi_mock_')) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md mx-auto my-12 shadow-2xl space-y-6 text-center font-sans">
        <h2 className="text-2xl font-bold text-white">Payment Checkout (Dev Mode)</h2>
        <p className="text-xs text-neutral-400">Mock gateway active. Click below to simulate completing payment.</p>
        <button
          disabled={isConfirming}
          onClick={async () => {
            try {
              await confirmPayment(bookingId).unwrap();
              toast.success('Mock payment completed & reservation confirmed!');
              navigate('/my-bookings');
            } catch (err) {
              toast.error(err?.data?.message || 'Failed to update payment status in database');
            }
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 text-white font-bold py-3 rounded-2xl transition cursor-pointer text-sm"
        >
          {isConfirming ? 'Updating Database...' : 'Simulate Successful Payment'}
        </button>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#6366f1',
        colorBackground: '#0a0a0a',
        colorText: '#ffffff',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm bookingId={bookingId} />
    </Elements>
  );
}
