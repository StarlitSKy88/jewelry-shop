import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import type { Order, PaginatedResponse } from '@/types';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const ordersApi = useApi<PaginatedResponse<Order>>('/orders');
  const orderApi = useApi<Order>('/orders');

  // 获取订单列表
  const getOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ordersApi.execute();
      setOrders(response.items);
      setTotal(response.total);
      return response.items;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [ordersApi]);

  // 获取单个订单
  const getOrder = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const order = await orderApi.execute({ url: `/orders/${id}` });
      return order;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [orderApi]);

  // 创建订单
  const createOrder = useCallback(async (data: Partial<Order>) => {
    try {
      const order = await orderApi.execute({
        method: 'POST',
        data,
      });
      setOrders((prev) => [...prev, order]);
      return order;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [orderApi]);

  // 更新订单
  const updateOrder = useCallback(async (id: string, data: Partial<Order>) => {
    try {
      const order = await orderApi.execute({
        url: `/orders/${id}`,
        method: 'PUT',
        data,
      });
      setOrders((prev) =>
        prev.map((item) => (item.id === id ? order : item))
      );
      return order;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [orderApi]);

  // 取消订单
  const cancelOrder = useCallback(async (id: string) => {
    try {
      await orderApi.execute({
        url: `/orders/${id}/cancel`,
        method: 'POST',
      });
      setOrders((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'cancelled' } : item
        )
      );
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [orderApi]);

  // 支付订单
  const payOrder = useCallback(async (id: string, paymentMethod: string) => {
    try {
      await orderApi.execute({
        url: `/orders/${id}/pay`,
        method: 'POST',
        data: { paymentMethod },
      });
      setOrders((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'paid' } : item
        )
      );
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [orderApi]);

  // 确认收货
  const confirmDelivery = useCallback(async (id: string) => {
    try {
      await orderApi.execute({
        url: `/orders/${id}/confirm`,
        method: 'POST',
      });
      setOrders((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'delivered' } : item
        )
      );
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [orderApi]);

  return {
    orders,
    loading,
    error,
    total,
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    cancelOrder,
    payOrder,
    confirmDelivery,
  };
}; 