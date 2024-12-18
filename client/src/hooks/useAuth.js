import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout, getProfile } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleRegister = async (userData) => {
    try {
      await dispatch(register(userData)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const loadProfile = async () => {
    if (user) return;
    try {
      await dispatch(getProfile()).unwrap();
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    loadProfile,
  };
}; 