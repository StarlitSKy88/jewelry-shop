import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import type { Product, PaginatedResponse, SearchParams } from '@/types';

interface UseProductsParams extends SearchParams {
  limit?: number;
}

export const useProducts = (params: UseProductsParams = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const productsApi = useApi<PaginatedResponse<Product>>('/products');
  const productApi = useApi<Product>('/products');

  // 获取商品列表
  const getProducts = useCallback(async (searchParams?: SearchParams) => {
    try {
      setLoading(true);
      const response = await productsApi.execute({ params: { ...params, ...searchParams } });
      setProducts(response.items);
      setTotal(response.total);
      return response;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [productsApi, params]);

  // 获取单个商品
  const getProduct = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const product = await productApi.execute({ url: `/products/${id}` });
      return product;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [productApi]);

  // 创建商品
  const createProduct = useCallback(async (data: Partial<Product>) => {
    try {
      const product = await productApi.execute({
        method: 'POST',
        data,
      });
      setProducts((prev) => [...prev, product]);
      return product;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [productApi]);

  // 更新商品
  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    try {
      const product = await productApi.execute({
        url: `/products/${id}`,
        method: 'PUT',
        data,
      });
      setProducts((prev) =>
        prev.map((item) => (item.id === id ? product : item))
      );
      return product;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [productApi]);

  // 删除商品
  const deleteProduct = useCallback(async (id: string) => {
    try {
      await productApi.execute({
        url: `/products/${id}`,
        method: 'DELETE',
      });
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [productApi]);

  return {
    products,
    loading,
    error,
    total,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}; 