import React, { createContext, useContext } from 'react';
import useImagePreview from '../../hooks/useImagePreview';
import ImagePreview from './index';

interface ImagePreviewContextType {
  openPreview: (src: string, alt?: string) => void;
}

const ImagePreviewContext = createContext<ImagePreviewContextType | null>(null);

export const useImagePreviewContext = () => {
  const context = useContext(ImagePreviewContext);
  if (!context) {
    throw new Error('useImagePreviewContext must be used within an ImagePreviewProvider');
  }
  return context;
};

interface ImagePreviewProviderProps {
  children: React.ReactNode;
}

export const ImagePreviewProvider: React.FC<ImagePreviewProviderProps> = ({ children }) => {
  const imagePreview = useImagePreview();

  return (
    <ImagePreviewContext.Provider value={{ openPreview: imagePreview.openPreview }}>
      {children}
      <ImagePreview
        open={imagePreview.open}
        src={imagePreview.src}
        alt={imagePreview.alt}
        onClose={imagePreview.closePreview}
      />
    </ImagePreviewContext.Provider>
  );
}; 