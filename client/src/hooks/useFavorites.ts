import { useState, useCallback, useEffect } from 'react';
import { useApi } from './useApi';
import type { Product, PaginatedResponse } from '@/types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const favoritesApi = useApi<PaginatedResponse<Product>>('/favorites');
  const favoriteApi = useApi<{ message: string }>('/favorites');

  // 获取收藏列表
  const getFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await favoritesApi.execute();
      setFavorites(response.items);
      setTotal(response.total);
      return response.items;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [favoritesApi]);

  // 添加收藏
  const addFavorite = useCallback(async (productId: string) => {
    try {
      await favoriteApi.execute({
        method: 'POST',
        data: { productId },
      });
      // 重���获取收藏列表
      await getFavorites();
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [favoriteApi, getFavorites]);

  // 移除收藏
  const removeFavorite = useCallback(async (productId: string) => {
    try {
      await favoriteApi.execute({
        method: 'DELETE',
        url: `/favorites/${productId}`,
      });
      // 从状态中移除
      setFavorites((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [favoriteApi]);

  // 检查是否已收藏
  const checkFavorite = useCallback(async (productId: string) => {
    try {
      const response = await favoriteApi.execute({
        method: 'GET',
        url: `/favorites/check/${productId}`,
      });
      return response.message === 'favorited';
    } catch (error) {
      return false;
    }
  }, [favoriteApi]);

  // 初始化时获取收藏列表
  useEffect(() => {
    getFavorites();
  }, [getFavorites]);

  return {
    favorites,
    loading,
    error,
    total,
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
  };
}; 