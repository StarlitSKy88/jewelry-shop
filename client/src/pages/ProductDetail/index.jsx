import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  TextField,
  Paper,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { productAPI } from '../../utils/api';
import { addToCart } from '../../store/slices/cartSlice';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProduct(id),
  });

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">加载商品信息失败</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}>
      <Grid container spacing={isMobile ? 2 : 4}>
        {/* 商品图片 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ mb: isMobile ? 2 : 0 }}>
            <img
              src={product.image_url || '/images/product-placeholder.jpg'}
              alt={product.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: isMobile ? '300px' : '500px',
                objectFit: 'cover',
              }}
            />
          </Paper>
        </Grid>

        {/* 商品信息 */}
        <Grid item xs={12} md={6}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            gutterBottom
            sx={{ wordBreak: 'break-word' }}
          >
            {product.name}
          </Typography>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            color="primary"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            ¥{product.price.toFixed(2)}
          </Typography>
          <Divider sx={{ my: isMobile ? 1 : 2 }} />
          
          <Typography 
            variant="body1" 
            paragraph
            sx={{ 
              fontSize: isMobile ? '0.9rem' : '1rem',
              mb: isMobile ? 1 : 2 
            }}
          >
            {product.description}
          </Typography>

          <Box sx={{ mt: isMobile ? 2 : 3 }}>
            <Typography variant={isMobile ? "body2" : "subtitle1"} gutterBottom>
              库存状态：
              <Typography
                component="span"
                color={product.stock > 0 ? 'success.main' : 'error.main'}
              >
                {product.stock > 0 ? `有货 (${product.stock}件)` : '缺货'}
              </Typography>
            </Typography>
          </Box>

          {product.stock > 0 && (
            <Box sx={{ mt: isMobile ? 1 : 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={isMobile ? 4 : 'auto'}>
                  <TextField
                    type="number"
                    label="数量"
                    value={quantity}
                    onChange={handleQuantityChange}
                    InputProps={{ 
                      inputProps: { min: 1, max: product.stock },
                    }}
                    size="small"
                    fullWidth={isMobile}
                  />
                </Grid>
                <Grid item xs={isMobile ? 8 : 'auto'}>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    size={isMobile ? "medium" : "large"}
                    fullWidth={isMobile}
                  >
                    加入购物车
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: isMobile ? 2 : 3 }} />

          {/* 商品详细信息 */}
          <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
            商品详情
          </Typography>
          <Box component="dl" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
            <Box sx={{ display: 'flex', my: 1 }}>
              <Typography component="dt" sx={{ width: isMobile ? 80 : 100 }}>
                商品编号：
              </Typography>
              <Typography component="dd">{product.id}</Typography>
            </Box>
            <Box sx={{ display: 'flex', my: 1 }}>
              <Typography component="dt" sx={{ width: isMobile ? 80 : 100 }}>
                商品分类：
              </Typography>
              <Typography component="dd">{product.category?.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', my: 1 }}>
              <Typography component="dt" sx={{ width: isMobile ? 80 : 100 }}>
                上架时间：
              </Typography>
              <Typography component="dd">
                {new Date(product.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetail; 