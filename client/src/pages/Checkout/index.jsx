import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { clearCart } from '../../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'alipay',
  });
  const [error, setError] = useState('');

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      setError('请填写完整的收货信息');
      return;
    }

    try {
      // 这里应该调用后端API处理订单
      const orderData = {
        items: cartItems,
        total: calculateTotal(),
        shippingInfo: formData,
      };
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 清空购物车
      dispatch(clearCart());
      
      // 跳转到成功页面
      navigate('/order-success');
    } catch (error) {
      setError('订单提交失败，请重试');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        结算
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              收货信息
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="收货人姓名"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="联系电话"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="收货地址"
                  name="address"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          <StyledPaper>
            <FormControl component="fieldset">
              <FormLabel component="legend">支付方式</FormLabel>
              <RadioGroup
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <FormControlLabel 
                  value="alipay" 
                  control={<Radio />} 
                  label="支付宝" 
                />
                <FormControlLabel 
                  value="wechat" 
                  control={<Radio />} 
                  label="微信支付" 
                />
                <FormControlLabel 
                  value="card" 
                  control={<Radio />} 
                  label="银行卡" 
                />
              </RadioGroup>
            </FormControl>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              订单摘要
            </Typography>
            {cartItems.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography>
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">总计</Typography>
              <Typography variant="h6" color="error">
                ¥{calculateTotal().toLocaleString()}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmit}
            >
              提交订单
            </Button>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout; 