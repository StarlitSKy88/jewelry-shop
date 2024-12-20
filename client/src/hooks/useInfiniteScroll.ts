import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollConfig {
  threshold?: number; // 触发加载的阈值（距离底部的像素值）
  isEnabled?: boolean; // 是否启用无限滚动
}

interface UseInfiniteScrollReturn {
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  containerRef: React.RefObject<HTMLElement>;
  reset: () => void;
}

export const useInfiniteScroll = <T>(
  fetchData: (page: number) => Promise<T[]>,
  config: UseInfiniteScrollConfig = {}
): UseInfiniteScrollReturn => {
  const { threshold = 100, isEnabled = true } = config;
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // 加载更多数据
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newItems = await fetchData(page);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prevItems) => [...prevItems, ...newItems]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error loading more items:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, page, isLoading, hasMore]);

  // 重置状态
  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setIsLoading(false);
    setHasMore(true);
  }, []);

  // 设置Intersection Observer
  useEffect(() => {
    if (!isEnabled) return;

    const options = {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0,
    };

    observer.current = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && hasMore) {
        loadMore();
      }
    }, options);

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.current.observe(currentContainer);
    }

    return () => {
      if (observer.current && currentContainer) {
        observer.current.unobserve(currentContainer);
      }
    };
  }, [isEnabled, threshold, isLoading, hasMore, loadMore]);

  // 处理滚动事件（兼容不支持Intersection Observer的浏览器）
  useEffect(() => {
    if (!isEnabled || observer.current) return;

    const handleScroll = () => {
      if (!containerRef.current || isLoading || !hasMore) return;

      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollHeight - scrollTop - clientHeight <= threshold) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEnabled, threshold, isLoading, hasMore, loadMore]);

  return {
    isLoading,
    hasMore,
    loadMore,
    containerRef,
    reset,
  };
}; 