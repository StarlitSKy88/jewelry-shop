import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  updateQuantity,
  removeFromCart,
} from '../../store/slices/cartSlice';

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= item.stock) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            py: 8,
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
          <Typography variant="h5" color="text.secondary">
            购物车是空的
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
          >
            去购物
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        购物车
      </Typography>

      <Grid container spacing={3}>
        {/* 购物车商品列表 */}
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  {/* 商品图片 */}
                  <Grid item xs={4} sm={3}>
                    <img
                      src={item.image_url || '/images/product-placeholder.jpg'}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '100px',
                        objectFit: 'cover',
                      }}
                    />
                  </Grid>

                  {/* 商品信息 */}
                  <Grid item xs={8} sm={9}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        sx={{ mb: 1 }}
                      >
                        {item.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(item.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      单价: ¥{item.price.toFixed(2)}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item, parseInt(e.target.value))
                        }
                        size="small"
                        inputProps={{
                          min: 1,
                          max: item.stock,
                          style: { textAlign: 'center', width: '50px' },
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* 订单总结 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                订单总结
              </Typography>
              <Box sx={{ my: 2 }}>
                <Grid container justifyContent="space-between">
                  <Typography>商品总价</Typography>
                  <Typography>¥{cartTotal.toFixed(2)}</Typography>
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ my: 2 }}>
                <Grid container justifyContent="space-between">
                  <Typography variant="h6">应付总额</Typography>
                  <Typography variant="h6" color="primary">
                    ¥{cartTotal.toFixed(2)}
                  </Typography>
                </Grid>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{ mt: 2 }}
              >
                去结算
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Cart; 