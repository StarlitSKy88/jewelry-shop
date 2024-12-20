import React, { useState, useCallback, memo } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Zoom,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
} from '@mui/icons-material';
import ProgressiveImage from '../ProgressiveImage';

interface ImagePreviewProps {
  open: boolean;
  src: string;
  lowQualitySrc?: string;
  alt?: string;
  onClose: () => void;
}

const ImagePreviewControls = memo(({ 
  onZoomIn, 
  onZoomOut, 
  onRotateLeft, 
  onRotateRight, 
  onReset 
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onReset: () => void;
}) => (
  <Box
    sx={{
      position: 'absolute',
      left: '50%',
      bottom: 16,
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 1,
      bgcolor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 2,
      p: 1,
      zIndex: 1,
    }}
  >
    <IconButton size="small" onClick={onZoomOut} sx={{ color: 'white' }}>
      <ZoomOutIcon />
    </IconButton>
    <IconButton size="small" onClick={onZoomIn} sx={{ color: 'white' }}>
      <ZoomInIcon />
    </IconButton>
    <IconButton size="small" onClick={onRotateLeft} sx={{ color: 'white' }}>
      <RotateLeftIcon />
    </IconButton>
    <IconButton size="small" onClick={onRotateRight} sx={{ color: 'white' }}>
      <RotateRightIcon />
    </IconButton>
    <IconButton size="small" onClick={onReset} sx={{ color: 'white' }}>
      重置
    </IconButton>
  </Box>
));

ImagePreviewControls.displayName = 'ImagePreviewControls';

const ImagePreview: React.FC<ImagePreviewProps> = memo(({
  open,
  src,
  lowQualitySrc = src,
  alt = '图片预览',
  onClose,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  }, []);

  const handleRotateLeft = useCallback(() => {
    setRotation((prev) => prev - 90);
  }, []);

  const handleRotateRight = useCallback(() => {
    setRotation((prev) => prev + 90);
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setRotation(0);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Zoom}
    >
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          minHeight: 400,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        <ImagePreviewControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onReset={handleReset}
        />
        <DialogContent>
          <ProgressiveImage
            src={src}
            lowQualitySrc={lowQualitySrc}
            alt={alt}
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease-in-out',
              maxHeight: '80vh',
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </DialogContent>
      </Box>
    </Dialog>
  );
});

ImagePreview.displayName = 'ImagePreview';

export default ImagePreview; 