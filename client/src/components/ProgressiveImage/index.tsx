import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { useProgressiveImage } from '@/hooks/useProgressiveImage';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  width = '100%',
  height = '100%',
  className,
  style,
}) => {
  const { isLoading, error, imageRef } = useProgressiveImage(src);

  if (error) {
    return (
      <Box
        component="img"
        src="/images/image-error.png"
        alt="加载失败"
        width={width}
        height={height}
        className={className}
        style={style}
      />
    );
  }

  return (
    <Box position="relative" width={width} height={height}>
      {isLoading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      )}
      <Box
        component="img"
        ref={imageRef}
        src={src}
        alt={alt}
        width="100%"
        height="100%"
        className={className}
        style={{
          ...style,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          position: 'absolute',
          top: 0,
          left: 0,
          objectFit: 'cover',
        }}
      />
    </Box>
  );
};

export default ProgressiveImage; 