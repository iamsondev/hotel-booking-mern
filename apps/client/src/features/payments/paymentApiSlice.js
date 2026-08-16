import { apiSlice } from '../../app/apiSlice';

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (bookingId) => ({
        url: '/payments/create-intent',
        method: 'POST',
        body: { bookingId },
      }),
    }),
    getPaymentByBooking: builder.query({
      query: (bookingId) => `/payments/booking/${bookingId}`,
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useGetPaymentByBookingQuery,
} = paymentApiSlice;
