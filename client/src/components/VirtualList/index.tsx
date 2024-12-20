import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  onEndReached,
  endReachedThreshold = 0.8,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isEndReached, setIsEndReached] = useState(false);

  // 计算可见区域的起始和结束索引
  const visibleCount = Math.ceil(height / itemHeight);
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setScrollTop(scrollTop);

      // 检查是否到达底部
      if (
        !isEndReached &&
        onEndReached &&
        scrollTop + clientHeight >= scrollHeight * endReachedThreshold
      ) {
        setIsEndReached(true);
        onEndReached();
      } else if (scrollTop + clientHeight < scrollHeight * endReachedThreshold) {
        setIsEndReached(false);
      }
    }
  }, [endReachedThreshold, isEndReached, onEndReached]);

  // 监听滚动事件
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // 渲染可见项
  const visibleItems = items.slice(startIndex, endIndex).map((item, index) => (
    <Box
      key={startIndex + index}
      style={{
        position: 'absolute',
        top: (startIndex + index) * itemHeight,
        width: '100%',
        height: itemHeight,
      }}
    >
      {renderItem(item, startIndex + index)}
    </Box>
  ));

  return (
    <Box
      ref={containerRef}
      sx={{
        height,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Box style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </Box>
    </Box>
  );
}

export default VirtualList; 