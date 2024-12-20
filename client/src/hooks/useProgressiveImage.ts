import { useState, useEffect, useRef } from 'react';

interface UseProgressiveImageReturn {
  isLoading: boolean;
  error: boolean;
  imageRef: React.RefObject<HTMLImageElement>;
}

export const useProgressiveImage = (src: string): UseProgressiveImageReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = src;
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    const currentImage = imageRef.current;
    if (currentImage) {
      observer.observe(currentImage);

      const handleLoad = () => {
        setIsLoading(false);
        setError(false);
      };

      const handleError = () => {
        setIsLoading(false);
        setError(true);
      };

      currentImage.addEventListener('load', handleLoad);
      currentImage.addEventListener('error', handleError);

      return () => {
        observer.unobserve(currentImage);
        currentImage.removeEventListener('load', handleLoad);
        currentImage.removeEventListener('error', handleError);
      };
    }
  }, [src]);

  return { isLoading, error, imageRef };
};

export default useProgressiveImage; 