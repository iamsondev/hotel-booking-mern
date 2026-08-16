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
          // Backend returns: { success, message, data: { _id, name, email, role, accessToken } }
          dispatch(setCredentials({
            user: data.data,
            token: data.data?.accessToken
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
          // Backend returns: { success, message, data: { _id, name, email, role, accessToken } }
          dispatch(setCredentials({
            user: data.data,
            token: data.data?.accessToken
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
        // Backend Zod schema expects { idToken }, frontend @react-oauth/google sends credential string
        body: { idToken: tokenData.token || tokenData.idToken || tokenData.credential },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Backend returns: { success, message, data: { _id, name, email, role, accessToken } }
          dispatch(setCredentials({
            user: data.data,
            token: data.data?.accessToken
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
