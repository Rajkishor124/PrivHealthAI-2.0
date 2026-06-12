import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types';
import { decodeJwt } from '../utils';

const storedToken = localStorage.getItem('token');

const hydrateUser = (token: string | null): User | null => {
  if (!token) return null;
  const payload = decodeJwt(token);
  if (!payload) return null;
  if (payload.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
    return null;
  }
  return {
    id: payload.userId,
    name: payload.name,
    phone: payload.sub,
    role: payload.role,
    createdAt: '',
  };
};

const rehydratedUser = hydrateUser(storedToken);

const initialState: AuthState = {
  user: rehydratedUser,
  token: rehydratedUser ? storedToken : null,
  isAuthenticated: !!rehydratedUser,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
