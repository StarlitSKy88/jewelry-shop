import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    // 初始化时检查是否匹配
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // 添加监听器
    mediaQuery.addEventListener('change', handleChange);

    // 清理函数
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// 预定义的断点
export const useIsMobile = () => useMediaQuery('(max-width: 599px)');
export const useIsTablet = () => useMediaQuery('(min-width: 600px) and (max-width: 959px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 960px)');
export const useIsLargeScreen = () => useMediaQuery('(min-width: 1280px)'); 