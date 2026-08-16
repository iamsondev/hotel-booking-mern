import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../utils/stripe';
import { useCreatePaymentIntentMutation } from '../features/payments/paymentApiSlice';
import { toast } from 'react-hot-toast';
import Loader from '../components/common/Loader';

function CheckoutForm({ bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
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
        toast.success('Payment completed successfully!');
        navigate('/my-bookings');
      }
    } catch (err) {
      toast.error('An unexpected error occurred processing your card payment.');
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
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold py-3 rounded-2xl transition duration-200 mt-2 cursor-pointer text-center text-sm"
        >
          {isProcessing ? 'Processing Payment...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}

export default function PaymentPage() {
  const { bookingId } = useParams();
  const [createPaymentIntent, { isLoading: isIntentLoading }] = useCreatePaymentIntentMutation();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        const res = await createPaymentIntent(bookingId).unwrap();
        setClientSecret(res.clientSecret || res.client_secret);
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to initialize payment gateway');
      }
    };
    if (bookingId) {
      getClientSecret();
    }
  }, [bookingId, createPaymentIntent]);

  if (isIntentLoading || !clientSecret) {
    return <Loader />;
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
