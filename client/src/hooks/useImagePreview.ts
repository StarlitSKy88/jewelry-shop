import { useState, useCallback } from 'react';

interface ImagePreviewState {
  open: boolean;
  src: string;
  alt?: string;
}

const defaultState: ImagePreviewState = {
  open: false,
  src: '',
  alt: '',
};

export const useImagePreview = () => {
  const [state, setState] = useState<ImagePreviewState>(defaultState);

  const openPreview = useCallback((src: string, alt?: string) => {
    setState({
      open: true,
      src,
      alt,
    });
  }, []);

  const closePreview = useCallback(() => {
    setState(defaultState);
  }, []);

  return {
    ...state,
    openPreview,
    closePreview,
  };
};

export default useImagePreview; 