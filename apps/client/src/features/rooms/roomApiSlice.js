import { apiSlice } from '../../app/apiSlice';

export const roomApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoomsByHotel: builder.query({
      query: (hotelId) => `/hotels/${hotelId}/rooms`,
      providesTags: ['Room'],
    }),
    getRoomById: builder.query({
      query: (id) => `/rooms/${id}`,
    }),
    createRoom: builder.mutation({
      query: ({ hotelId, ...roomData }) => ({
        url: `/hotels/${hotelId}/rooms`,
        method: 'POST',
        body: roomData,
      }),
      invalidatesTags: ['Room'],
    }),
    updateRoom: builder.mutation({
      query: ({ id, ...roomData }) => ({
        url: `/rooms/${id}`,
        method: 'PUT',
        body: roomData,
      }),
      invalidatesTags: ['Room'],
    }),
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Room'],
    }),
  }),
});

export const {
  useGetRoomsByHotelQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomApiSlice;
