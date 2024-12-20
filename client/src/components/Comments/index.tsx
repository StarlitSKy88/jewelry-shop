import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';
import { CommentForm } from './CommentForm';

interface CommentsProps {
  productId: string;
}

export const Comments: React.FC<CommentsProps> = ({ productId }) => {
  const { comments, loading, error, getComments, deleteComment } = useComments(productId);
  const { user } = useAuth();

  useEffect(() => {
    getComments();
  }, [getComments]);

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        商品评价 ({comments.length})
      </Typography>

      {user && (
        <Box sx={{ mb: 4 }}>
          <CommentForm productId={productId} />
        </Box>
      )}

      {comments.map((comment) => (
        <Box
          key={comment.id}
          sx={{
            py: 2,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              src={comment.userAvatar}
              alt={comment.userName}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">{comment.userName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(comment.createdAt).toLocaleString()}
              </Typography>
            </Box>
            {user && user.id === comment.userId && (
              <Box>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(comment.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          <Rating value={comment.rating} readOnly size="small" sx={{ mb: 1 }} />

          <Typography variant="body2">{comment.content}</Typography>

          {comment.images && comment.images.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {comment.images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`评论图片 ${index + 1}`}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      ))}

      {comments.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          暂无评价
        </Typography>
      )}
    </Box>
  );
}; 