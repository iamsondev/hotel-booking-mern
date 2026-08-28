import { apiSlice } from '../../app/apiSlice';

export const hotelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: (params) => ({
        url: '/hotels',
        params, // page, limit, city, search
      }),
      transformResponse: (response) => ({
        hotels: response.data || [],
        total: response.pagination?.total || response.count || 0,
        totalPages: response.pagination?.pages || 1,
      }),
      providesTags: (result) => {
        if (result && result.hotels) {
          return [
            { type: 'Hotel', id: 'LIST' },
            ...result.hotels.map((h) => ({ type: 'Hotel', id: h._id })),
          ];
        }
        return [{ type: 'Hotel', id: 'LIST' }];
      },
    }),
    getHotelById: builder.query({
      query: (id) => `/hotels/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Hotel', id }],
    }),
    createHotel: builder.mutation({
      query: (newHotel) => ({
        url: '/hotels',
        method: 'POST',
        body: newHotel,
      }),
      invalidatesTags: ['Hotel'],
    }),
    updateHotel: builder.mutation({
      query: ({ id, ...updatedHotel }) => ({
        url: `/hotels/${id}`,
        method: 'PUT',
        body: updatedHotel,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Hotel', id }],
    }),
    deleteHotel: builder.mutation({
      query: (id) => ({
        url: `/hotels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hotel'],
    }),
    getMyHotels: builder.query({
      query: () => '/hotels/owner/my-hotels',
      transformResponse: (response) => response.data || [],
      providesTags: ['Hotel'],
    }),
    getPendingHotels: builder.query({
      query: () => '/hotels/admin/pending',
      transformResponse: (response) => response.data || [],
      providesTags: ['Hotel'],
    }),
    approveHotel: builder.mutation({
      query: (id) => ({
        url: `/hotels/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Hotel'],
    }),
    rejectHotel: builder.mutation({
      query: (id) => ({
        url: `/hotels/${id}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Hotel'],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
  useGetMyHotelsQuery,
  useGetPendingHotelsQuery,
  useApproveHotelMutation,
  useRejectHotelMutation,
} = hotelApiSlice;
