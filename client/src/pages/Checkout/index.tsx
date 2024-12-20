import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useQuery, useMutation } from '@tanstack/react-query';
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

interface OrderForm {
  name: string;
  phone: string;
  address: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState<OrderForm>({
    name: '',
    phone: '',
    address: '',
  });

  const { data: cart, isLoading } = useQuery<ApiResponse<CartItem[]>>({
    queryKey: ['cart'],
    queryFn: () =>
      request.get<ApiResponse<CartItem[]>>('/cart').then((res) => res.data),
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: OrderForm) => request.post('/orders', data),
    onSuccess: () => {
      showSuccess('订单已创建');
      navigate('/orders');
    },
    onError: () => {
      showError('创建订单失败');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      showError('请填写完整信息');
      return;
    }
    createOrderMutation.mutate(form);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!cart?.data.length) {
    navigate('/cart');
    return null;
  }

  const totalAmount = cart.data.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        结算
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                收货信息
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 2 }}
              >
                <TextField
                  fullWidth
                  label="收货人"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="手机号码"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="收货地址"
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  multiline
                  rows={3}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                订单摘要
              </Typography>
              {cart.data.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </Box>
              ))}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 2,
                  pt: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle1">总计</Typography>
                <Typography variant="subtitle1">
                  ¥{totalAmount.toLocaleString()}
                </Typography>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleSubmit}
                sx={{ mt: 3 }}
              >
                提交订单
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout; 