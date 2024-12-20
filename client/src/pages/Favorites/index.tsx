import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../../utils/request';
import { useToast } from '../../components/Toast';
import Loading from '../../components/Loading';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data: favorites, isLoading } = useQuery<ApiResponse<Product[]>>({
    queryKey: ['favorites'],
    queryFn: () =>
      request.get<ApiResponse<Product[]>>('/favorites').then((res) => res.data),
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (productId: string) =>
      request.delete(`/favorites/${productId}`),
    onSuccess: () => {
      showSuccess('已从收藏夹移除');
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: () => {
      showError('移除失败');
    },
  });

  const handleRemoveFavorite = (productId: string) => {
    removeFavoriteMutation.mutate(productId);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!favorites?.data.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          我的收藏
        </Typography>
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            暂无收藏商品
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
          >
            去购物
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        我的收藏
      </Typography>

      <Grid container spacing={3}>
        {favorites.data.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  noWrap
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 1,
                  }}
                >
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ¥{product.price.toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  查看详情
                </Button>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveFavorite(product.id)}
                  disabled={removeFavoriteMutation.isPending}
                >
                  <FavoriteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Favorites; 