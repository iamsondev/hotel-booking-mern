import { apiSlice } from '../../app/apiSlice';

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),
    getMyBookings: builder.query({
      query: () => '/bookings/my-bookings',
      providesTags: ['Booking'],
    }),
    getBookingById: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Booking'],
    }),
    getHotelBookings: builder.query({
      query: (hotelId) => `/bookings/hotel/${hotelId}`,
      providesTags: ['Booking'],
    }),
    getAllBookings: builder.query({
      query: () => '/bookings/admin/all',
      providesTags: ['Booking'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
  useCancelBookingMutation,
  useGetHotelBookingsQuery,
  useGetAllBookingsQuery,
} = bookingApiSlice;
