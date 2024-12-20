import { useState, useCallback, useEffect } from 'react';
import { useApi } from './useApi';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface AddToCartData {
  productId: string;
  quantity: number;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cartApi = useApi<CartItem[]>('/cart');
  const addItemApi = useApi<CartItem>('/cart/add');
  const updateItemApi = useApi<CartItem>('/cart/update');
  const removeItemApi = useApi('/cart/remove');

  // 获取购物车商品
  const getItems = useCallback(async () => {
    try {
      setLoading(true);
      const items = await cartApi.execute();
      setItems(items);
      return items;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [cartApi]);

  // 添加商品到购物车
  const addItem = useCallback(async (data: AddToCartData) => {
    try {
      const item = await addItemApi.execute(data);
      setItems((prev) => [...prev, item]);
      return item;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [addItemApi]);

  // 更新购物车商品数量
  const updateItem = useCallback(async (id: string, quantity: number) => {
    try {
      const item = await updateItemApi.execute({ id, quantity });
      setItems((prev) =>
        prev.map((prevItem) => (prevItem.id === id ? item : prevItem))
      );
      return item;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [updateItemApi]);

  // 从购物车移除商品
  const removeItem = useCallback(async (id: string) => {
    try {
      await removeItemApi.execute({ id });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [removeItemApi]);

  // 清空购物车
  const clearCart = useCallback(async () => {
    try {
      await cartApi.execute({ method: 'DELETE' });
      setItems([]);
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [cartApi]);

  // 计算购物车商品总数
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // 计算购物车商品总价
  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 初始化时获取购物车商品
  useEffect(() => {
    getItems();
  }, [getItems]);

  return {
    items,
    loading,
    error,
    cartItemCount,
    cartTotal,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
}; 