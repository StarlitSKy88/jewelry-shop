import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { request } from '../../../utils/request';

const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  const { data: paymentStatus, isLoading } = useQuery({
    queryKey: ['payment-status', paymentId],
    queryFn: () =>
      request
        .get(`/payments/${paymentId}/status`)
        .then((res) => res.data),
    enabled: !!paymentId,
    refetchInterval: (data) =>
      data?.status === 'pending' ? 3000 : false,
  });

  useEffect(() => {
    if (!orderId || !paymentId) {
      navigate('/');
    }
  }, [orderId, paymentId, navigate]);

  const handleViewOrder = () => {
    navigate(`/orders/${orderId}`);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>正在查询支付结果...</Typography>
      </Box>
    );
  }

  const isSuccess = paymentStatus?.status === 'success';

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 8,
        }}
      >
        {isSuccess ? (
          <SuccessIcon
            sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
          />
        ) : (
          <ErrorIcon
            sx={{ fontSize: 64, color: 'error.main', mb: 2 }}
          />
        )}

        <Typography variant="h4" gutterBottom>
          {isSuccess ? '支付成功' : '支付失败'}
        </Typography>

        <Typography color="text.secondary" align="center" sx={{ mb: 4 }}>
          {isSuccess
            ? '您的订单已支付成功，我们将尽快为您发货'
            : '支付遇到问题，请稍后重试或联系客服'}
        </Typography>

        <Typography variant="h6" gutterBottom>
          订单金额：￥{paymentStatus?.amount?.toFixed(2)}
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleViewOrder}
            sx={{ minWidth: 120 }}
          >
            查看订单
          </Button>
          <Button
            variant="outlined"
            onClick={handleContinueShopping}
            sx={{ minWidth: 120 }}
          >
            继续购物
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentResult; 