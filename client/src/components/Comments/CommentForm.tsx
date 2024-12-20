import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useComments } from '@/hooks/useComments';
import { ImageUpload } from '@/components/ImageUpload';

interface CommentFormProps {
  productId: string;
  orderId?: string;
  onSuccess?: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  productId,
  orderId,
  onSuccess,
}) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { createComment } = useComments(productId);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating) {
      setError('请选择评分');
      return;
    }
    if (!content.trim()) {
      setError('请输入评价内容');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await createComment({
        productId,
        orderId: orderId || '',
        content: content.trim(),
        rating,
        images,
      });
      setContent('');
      setRating(null);
      setImages([]);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '评价失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography component="legend" gutterBottom>
          评分
        </Typography>
        <Rating
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="评价内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        <Typography component="legend" gutterBottom>
          上传图片
        </Typography>
        <ImageUpload
          value={images}
          onChange={setImages}
          maxCount={5}
          maxSize={5}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
      >
        {loading ? '提交中...' : '提交评价'}
      </Button>
    </Box>
  );
}; 