import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('accessToken') || null;
const storedUser = localStorage.getItem('user');
let initialUser = null;
try {
  initialUser = storedUser ? JSON.parse(storedUser) : null;
} catch (e) {
  initialUser = null;
}

const initialState = {
  user: initialUser,
  token: token,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      if (token) localStorage.setItem('accessToken', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

