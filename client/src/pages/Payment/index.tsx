import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, Typography, Paper } from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { request } from '../../utils/request';
import PaymentForm from '../../components/Payment';
import PaymentProvider from '../../components/Payment/PaymentProvider';
import { useToast } from '../../hooks/useToast';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // 获取订单信息
  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () =>
      request.get(`/orders/${orderId}`).then((res) => res.data),
    enabled: !!orderId,
  });

  // 创建支付
  const { mutate: createPayment, data: paymentData } = useMutation({
    mutationFn: (data: { orderId: string; amount: number }) =>
      request
        .post('/payments', data)
        .then((res) => res.data),
  });

  useEffect(() => {
    if (order && !paymentData) {
      createPayment({
        orderId: order.id,
        amount: order.total,
      });
    }
  }, [order, paymentData, createPayment]);

  const handlePaymentSuccess = (paymentId: string) => {
    showToast('支付成功', 'success');
    navigate(`/payment/result?orderId=${orderId}&paymentId=${paymentId}`);
  };

  const handlePaymentError = (error: string) => {
    showToast(error, 'error');
  };

  if (!order || !paymentData) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          订单支付
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            订单信息
          </Typography>
          <Typography>订单编号：{order.id}</Typography>
          <Typography>订单金额：￥{order.total.toFixed(2)}</Typography>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <PaymentProvider clientSecret={paymentData.clientSecret}>
            <PaymentForm
              orderId={order.id}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </PaymentProvider>
        </Paper>
      </Box>
    </Container>
  );
};

export default PaymentPage; 