import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../../utils/request';
import { useToast } from '../../components/Toast';
import Loading from '../../components/Loading';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  isFavorite: boolean;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery<ApiResponse<Product>>({
    queryKey: ['product', id],
    queryFn: () =>
      request
        .get<ApiResponse<Product>>(`/products/${id}`)
        .then((res) => res.data),
  });

  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: string; quantity: number }) =>
      request.post('/cart', data),
    onSuccess: () => {
      showSuccess('已添加到购物车');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      showError('添加到购物车失败');
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: () =>
      product?.data.isFavorite
        ? request.delete(`/favorites/${id}`)
        : request.post('/favorites', { productId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      showSuccess(
        product?.data.isFavorite ? '已取消收藏' : '已添加到收藏',
      );
    },
    onError: () => {
      showError(
        product?.data.isFavorite ? '取消收藏失败' : '收藏失败',
      );
    },
  });

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (
      newQuantity >= 1 &&
      newQuantity <= (product?.data.stock || 0)
    ) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCartMutation.mutate({
      productId: product.data.id,
      quantity,
    });
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavoriteMutation.mutate();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!product) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.data.images[0]}
            alt={product.data.name}
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Typography variant="h4" component="h1" gutterBottom>
                  {product.data.name}
                </Typography>
                <IconButton
                  color="error"
                  onClick={handleToggleFavorite}
                  disabled={toggleFavoriteMutation.isPending}
                >
                  {product.data.isFavorite ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Box>

              <Typography
                variant="h5"
                color="primary"
                sx={{ mb: 3 }}
              >
                ¥{product.data.price.toLocaleString()}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                {product.data.description}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  库存：{product.data.stock}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.data.stock}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAddToCart}
                  disabled={
                    addToCartMutation.isPending ||
                    product.data.stock === 0
                  }
                  sx={{ flex: 1 }}
                >
                  加入购物车
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/cart')}
                  sx={{ flex: 1 }}
                >
                  查看购物车
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail; 