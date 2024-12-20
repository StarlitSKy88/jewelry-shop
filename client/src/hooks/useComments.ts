import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import type { PaginatedResponse } from '@/types';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  orderId: string;
  content: string;
  rating: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreateCommentData {
  productId: string;
  orderId: string;
  content: string;
  rating: number;
  images?: string[];
}

export const useComments = (productId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const commentsApi = useApi<PaginatedResponse<Comment>>('/comments');
  const commentApi = useApi<Comment>('/comments');

  // 获取评论列表
  const getComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await commentsApi.execute({
        params: productId ? { productId } : undefined,
      });
      setComments(response.items);
      setTotal(response.total);
      return response.items;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [commentsApi, productId]);

  // 创建评论
  const createComment = useCallback(async (data: CreateCommentData) => {
    try {
      const comment = await commentApi.execute({
        method: 'POST',
        data,
      });
      setComments((prev) => [comment, ...prev]);
      return comment;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [commentApi]);

  // 更新评论
  const updateComment = useCallback(async (id: string, data: Partial<Comment>) => {
    try {
      const comment = await commentApi.execute({
        url: `/comments/${id}`,
        method: 'PUT',
        data,
      });
      setComments((prev) =>
        prev.map((item) => (item.id === id ? comment : item))
      );
      return comment;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [commentApi]);

  // 删除评论
  const deleteComment = useCallback(async (id: string) => {
    try {
      await commentApi.execute({
        url: `/comments/${id}`,
        method: 'DELETE',
      });
      setComments((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }, [commentApi]);

  return {
    comments,
    loading,
    error,
    total,
    getComments,
    createComment,
    updateComment,
    deleteComment,
  };
}; 