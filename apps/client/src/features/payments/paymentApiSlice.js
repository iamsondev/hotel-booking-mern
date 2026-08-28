import { apiSlice } from '../../app/apiSlice';

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (bookingId) => ({
        url: '/payments/create-intent',
        method: 'POST',
        body: typeof bookingId === 'object' && bookingId !== null ? bookingId : { bookingId },
      }),
    }),
    confirmPayment: builder.mutation({
      query: (bookingId) => ({
        url: '/payments/confirm',
        method: 'POST',
        body: typeof bookingId === 'object' && bookingId !== null ? bookingId : { bookingId },
      }),
      invalidatesTags: ['Booking', 'Hotel'],
    }),
    getPaymentByBooking: builder.query({
      query: (bookingId) => `/payments/booking/${bookingId}`,
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
  useGetPaymentByBookingQuery,
} = paymentApiSlice;
