import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

interface PaymentFormProps {
  orderId: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

const PaymentForm = ({ orderId, onSuccess, onError }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/result?orderId=${orderId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || '支付失败，请重试');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      onError('支付过程中发生错误，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        支付信息
      </Typography>

      <Box sx={{ mb: 3 }}>
        <PaymentElement />
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || isProcessing}
        sx={{ py: 1.5 }}
      >
        {isProcessing ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            处理中...
          </>
        ) : (
          '确认支付'
        )}
      </Button>
    </Box>
  );
};

export default PaymentForm; 