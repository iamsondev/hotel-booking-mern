import { apiSlice } from '../../app/apiSlice';
import { setCredentials, logout } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({
            user: data.user,
            token: data.token || data.accessToken
          }));
        } catch (err) {
          console.error('Registration failed:', err);
        }
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({
            user: data.user,
            token: data.token || data.accessToken
          }));
        } catch (err) {
          console.error('Login failed:', err);
        }
      },
    }),
    googleLogin: builder.mutation({
      query: (tokenData) => ({
        url: '/auth/google',
        method: 'POST',
        body: tokenData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({
            user: data.user,
            token: data.token || data.accessToken
          }));
        } catch (err) {
          console.error('Google login failed:', err);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (err) {
          console.error('Logout failed:', err);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
} = authApiSlice;
