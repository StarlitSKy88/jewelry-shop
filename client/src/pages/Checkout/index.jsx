import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../../store/slices/cartSlice';
import { orderAPI } from '../../utils/api';
import { useMutation } from '@tanstack/react-query';

const steps = ['确认订单', '填写地址', '选择支付方式'];

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('alipay');

  const createOrderMutation = useMutation({
    mutationFn: (orderData) => orderAPI.createOrder(orderData),
    onSuccess: (data) => {
      dispatch(clearCart());
      navigate('/order-success', { state: { orderId: data.id } });
    },
  });

  const handleAddressChange = (field) => (event) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // 提交订单
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress,
        paymentMethod,
        totalAmount: cartTotal
      };
      createOrderMutation.mutate(orderData);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // 验证当前步骤是否可以继续
  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return cartItems.length > 0;
      case 1:
        return Object.values(shippingAddress).every(value => value.trim() !== '');
      case 2:
        return paymentMethod !== '';
      default:
        return false;
    }
  };

  if (cartItems.length === 0 && activeStep === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          购物车为空，请先添加商品
          <Button
            color="inherit"
            size="small"
            onClick={() => navigate('/products')}
            sx={{ ml: 2 }}
          >
            去购物
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        结算
      </Typography>

      <Stepper 
        activeStep={activeStep} 
        sx={{ mb: 4 }}
        orientation={isMobile ? "vertical" : "horizontal"}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* 步骤内容 */}
          <Card>
            <CardContent>
              {activeStep === 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    确认订单信息
                  </Typography>
                  {cartItems.map((item) => (
                    <Box key={item.id} sx={{ mb: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={3}>
                          <img
                            src={item.image_url || '/images/product-placeholder.jpg'}
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: 'auto',
                              maxHeight: '80px',
                              objectFit: 'cover',
                            }}
                          />
                        </Grid>
                        <Grid item xs={9}>
                          <Typography variant="subtitle1">{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            数量: {item.quantity} × ¥{item.price.toFixed(2)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 2 }} />
                    </Box>
                  ))}
                </>
              )}

              {activeStep === 1 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    收货地址
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="收货人姓名"
                        value={shippingAddress.name}
                        onChange={handleAddressChange('name')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="手机号码"
                        value={shippingAddress.phone}
                        onChange={handleAddressChange('phone')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        label="省份"
                        value={shippingAddress.province}
                        onChange={handleAddressChange('province')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        label="城市"
                        value={shippingAddress.city}
                        onChange={handleAddressChange('city')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        label="区县"
                        value={shippingAddress.district}
                        onChange={handleAddressChange('district')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="详细地址"
                        value={shippingAddress.address}
                        onChange={handleAddressChange('address')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="邮政编码"
                        value={shippingAddress.zipCode}
                        onChange={handleAddressChange('zipCode')}
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    支付方式
                  </Typography>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
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
                </>
              )}
            </CardContent>
          </Card>
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
                <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                  <Typography>运费</Typography>
                  <Typography>¥0.00</Typography>
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
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                {activeStep > 0 && (
                  <Button onClick={handleBack}>
                    上一步
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  sx={{ ml: 'auto' }}
                >
                  {activeStep === steps.length - 1 ? '提交订���' : '下一步'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Checkout; 