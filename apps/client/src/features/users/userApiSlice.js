import { apiSlice } from '../../app/apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPendingOwners: builder.query({
      query: () => '/users/admin/pending-owners',
      transformResponse: (response) => response.data || [],
      providesTags: ['User'],
    }),
    approveOwner: builder.mutation({
      query: (id) => ({
        url: `/users/admin/approve-owner/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),
    rejectOwner: builder.mutation({
      query: (id) => ({
        url: `/users/admin/reject-owner/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),
    getAllUsers: builder.query({
      query: () => '/users/admin/all',
      transformResponse: (response) => response.data || [],
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetPendingOwnersQuery,
  useApproveOwnerMutation,
  useRejectOwnerMutation,
  useGetAllUsersQuery,
} = userApiSlice;
