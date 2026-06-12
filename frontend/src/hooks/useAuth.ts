import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { logout, setCredentials } from '../store/authSlice';
import type { User } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const signIn = (user: User, token: string) => {
    dispatch(setCredentials({ user, token }));
  };

  const signOut = () => {
    dispatch(logout());
  };

  return { user, token, isAuthenticated, isLoading, error, signIn, signOut };
};
