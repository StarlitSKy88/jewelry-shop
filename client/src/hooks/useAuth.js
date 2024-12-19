import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  selectIsAuthenticated,
  selectUser,
  selectAuthLoading,
  selectAuthError,
} from '../store/slices/authSlice';
import { authAPI } from '../utils/api';

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // 登录
  const loginMutation = useMutation({
    mutationFn: (credentials) => authAPI.login(credentials),
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
      navigate('/');
    },
    onError: (error) => {
      dispatch(loginFailure(error.message));
    },
  });

  // 注册
  const registerMutation = useMutation({
    mutationFn: (userData) => authAPI.register(userData),
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
      navigate('/');
    },
    onError: (error) => {
      dispatch(loginFailure(error.message));
    },
  });

  // 获取当前用户信息
  const { data: currentUser, refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authAPI.getCurrentUser(),
    enabled: isAuthenticated,
    onError: () => {
      dispatch(logout());
    },
  });

  // 登出
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return {
    user: currentUser || user,
    isAuthenticated,
    isLoading,
    error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    refetchUser,
  };
}

export default useAuth; 