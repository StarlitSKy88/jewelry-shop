import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Button,
  Divider,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const CartItemImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  maxWidth: 120,
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 0,
  padding: 4,
}));

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');

  const updateQuantity = (itemId: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (itemId: number) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 500 ? 0 : 29;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  return (
    <Box sx={{ pt: 12, pb: 8 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" gutterBottom>
              Your cart is empty
            </Typography>
            <Button
              component={Link}
              to="/shop"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ mb: 4 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} sm={2}>
                      <CartItemImage src={item.image} alt={item.name} />
                    </Grid>
                    <Grid item xs={9} sm={4}>
                      <Typography variant="h6" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Size: {item.size}mm
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <QuantityButton
                          size="small"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <RemoveIcon />
                        </QuantityButton>
                        <Typography>{item.quantity}</Typography>
                        <QuantityButton
                          size="small"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <AddIcon />
                        </QuantityButton>
                      </Box>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                      <Typography variant="h6" color="primary">
                        ${item.price * item.quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                      <IconButton onClick={() => removeItem(item.id)}>
                        <CloseIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))}
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box sx={{ my: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography>Subtotal</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography>${calculateSubtotal()}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>Shipping</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography>
                          {calculateShipping() === 0 ? 'FREE' : `$${calculateShipping()}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      size="small"
                    />
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="h6">Total</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary">
                        ${calculateTotal()}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 3 }}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Free shipping on orders over $500
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

const initialCartItems = [
  {
    id: 1,
    name: "Lava Bracelet IV",
    size: 6,
    price: 219,
    quantity: 1,
    image: "/images/products/lava-bracelet-1.jpg"
  },
  {
    id: 2,
    name: "Imperial Jasper Bracelet VI",
    size: 4,
    price: 249,
    quantity: 2,
    image: "/images/products/jasper-bracelet.jpg"
  }
];

export default Cart; 