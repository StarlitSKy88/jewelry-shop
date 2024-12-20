import React, { useState } from 'react';
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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
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
  isFavorite: boolean;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [search, setSearch] = useState('');

  const { data: products, isLoading } = useQuery<ApiResponse<Product[]>>({
    queryKey: ['products', search],
    queryFn: () =>
      request
        .get<ApiResponse<Product[]>>('/products', {
          params: { search },
        })
        .then((res) => res.data),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: ({
      productId,
      isFavorite,
    }: {
      productId: string;
      isFavorite: boolean;
    }) =>
      isFavorite
        ? request.delete(`/favorites/${productId}`)
        : request.post('/favorites', { productId }),
    onSuccess: (_, { isFavorite }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSuccess(isFavorite ? '已取消收藏' : '已添加到收藏');
    },
    onError: (_, { isFavorite }) => {
      showError(isFavorite ? '取消收藏失败' : '收藏失败');
    },
  });

  const handleToggleFavorite = (
    productId: string,
    isFavorite: boolean,
  ) => {
    toggleFavoriteMutation.mutate({ productId, isFavorite });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!products) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          商品列表
        </Typography>
        <TextField
          placeholder="搜索商品"
          value={search}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <Grid container spacing={3}>
        {products.data.map((product) => (
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
                  onClick={() =>
                    handleToggleFavorite(
                      product.id,
                      product.isFavorite,
                    )
                  }
                  disabled={toggleFavoriteMutation.isPending}
                >
                  {product.isFavorite ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products; 