import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../utils/request';
import { useToast } from './useToast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // 获取当前用户信息
  const { data: user, isLoading } = useQuery<User>(['auth'], async () => {
    try {
      const response = await request.get('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  });

  // 登录
  const login = useMutation(
    async (data: LoginData) => {
      const response = await request.post('/auth/login', data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        queryClient.setQueryData(['auth'], data.user);
        showToast('登录成功', 'success');
      },
      onError: () => {
        showToast('登录失败，请检查邮箱和密码', 'error');
      },
    }
  );

  // 注册
  const register = useMutation(
    async (data: RegisterData) => {
      const response = await request.post('/auth/register', data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        queryClient.setQueryData(['auth'], data.user);
        showToast('注册成功', 'success');
      },
      onError: () => {
        showToast('注册失败，请稍后重试', 'error');
      },
    }
  );

  // 登出
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    queryClient.setQueryData(['auth'], null);
    showToast('已退出登录', 'info');
  }, [queryClient, showToast]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: login.mutate,
    register: register.mutate,
    logout,
  };
}; 