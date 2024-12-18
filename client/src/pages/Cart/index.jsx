import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Button,
  TextField,
  Divider,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';

const ProductImage = styled('img')({
  width: 80,
  height: 80,
  objectFit: 'cover',
});

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const [error, setError] = useState('');

  const handleQuantityChange = (item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
      setError('');
    } else {
      setError('商品数量超出限制');
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            购物车是空的
          </Typography>
          <Button 
            component={Link} 
            to="/products" 
            variant="contained" 
            sx={{ mt: 2 }}
          >
            继续购物
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        购物车
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>商品信息</TableCell>
              <TableCell align="right">单价</TableCell>
              <TableCell align="center">数量</TableCell>
              <TableCell align="right">小计</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <ProductImage src={item.images[0]} alt={item.name} />
                    <Box>
                      <Typography 
                        component={Link} 
                        to={`/products/${item.id}`}
                        sx={{ 
                          color: 'inherit',
                          textDecoration: 'none',
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        {item.name}
                      </Typography>
                      {item.specs && (
                        <Typography variant="body2" color="text.secondary">
                          {Object.entries(item.specs)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  ¥{item.price.toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton 
                      size="small"
                      onClick={() => handleQuantityChange(item, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      value={item.quantity}
                      size="small"
                      sx={{ 
                        width: 60,
                        mx: 1,
                        '& input': { textAlign: 'center' },
                      }}
                      inputProps={{ readOnly: true }}
                    />
                    <IconButton 
                      size="small"
                      onClick={() => handleQuantityChange(item, 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  ¥{(item.price * item.quantity).toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="error"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Box sx={{ width: 300 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>商品总计：</Typography>
            <Typography variant="h6">
              ¥{calculateTotal().toLocaleString()}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>总计：</Typography>
            <Typography variant="h5" color="error">
              ¥{calculateTotal().toLocaleString()}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            fullWidth 
            size="large"
            component={Link}
            to="/checkout"
          >
            结算
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Cart; 