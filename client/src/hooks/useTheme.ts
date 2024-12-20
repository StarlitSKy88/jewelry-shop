import { useState, useEffect } from 'react';
import type { ThemeMode } from '@/types';

const THEME_KEY = 'theme_mode';

export const useTheme = (): ThemeMode => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    // 优先从localStorage读取主题设置
    const savedMode = localStorage.getItem(THEME_KEY);
    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode;
    }
    // 如果没有保存的主题设置，则根据系统主题设置
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // 保存主题设置到localStorage
    localStorage.setItem(THEME_KEY, mode);
    // 更新body的class
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${mode}-mode`);
  }, [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return { mode, toggleMode };
}; 