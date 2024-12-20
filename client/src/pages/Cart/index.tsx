import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../../utils/request';
import { useToast } from '../../components/Toast';
import Loading from '../../components/Loading';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data: cart, isLoading } = useQuery<ApiResponse<CartItem[]>>({
    queryKey: ['cart'],
    queryFn: () =>
      request.get<ApiResponse<CartItem[]>>('/cart').then((res) => res.data),
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => request.put(`/cart/${itemId}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      showError('更新数量失败');
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => request.delete(`/cart/${itemId}`),
    onSuccess: () => {
      showSuccess('已从购物车移除');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      showError('移除失败');
    },
  });

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ itemId, quantity });
  };

  const handleRemoveItem = (itemId: string) => {
    if (window.confirm('确定要从购物车中移除该商品吗？')) {
      removeItemMutation.mutate(itemId);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!cart?.data.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          购物车
        </Typography>
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            购物车是空的
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

  const totalAmount = cart.data.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        购物车
      </Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          {cart.data.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      单价：¥{item.price.toLocaleString()}
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
                        onClick={() =>
                          handleUpdateQuantity(
                            item.id,
                            item.quantity - 1,
                          )
                        }
                        disabled={
                          item.quantity <= 1 ||
                          updateQuantityMutation.isPending
                        }
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.id,
                            item.quantity + 1,
                          )
                        }
                        disabled={updateQuantityMutation.isPending}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removeItemMutation.isPending}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1" color="primary">
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Card
          sx={{
            width: 300,
            height: 'fit-content',
            position: 'sticky',
            top: 24,
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              订单摘要
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Typography>商品总计</Typography>
              <Typography>¥{totalAmount.toLocaleString()}</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate('/checkout')}
            >
              去结算
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Cart; 