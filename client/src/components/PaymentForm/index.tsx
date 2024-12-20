import { useState } from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { request } from '../../utils/request';
import QRCode from 'qrcode.react';

interface PaymentFormProps {
  orderId: number;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'online' | 'offline';
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'alipay',
    name: '支付宝',
    icon: '/icons/alipay.png',
    type: 'online',
  },
  {
    id: 'wechat',
    name: '微信支付',
    icon: '/icons/wechat.png',
    type: 'online',
  },
  {
    id: 'bank',
    name: '银行卡',
    icon: '/icons/bank.png',
    type: 'online',
  },
];

const PaymentForm = ({ orderId, amount, onSuccess, onCancel }: PaymentFormProps) => {
  const [selectedMethod, setSelectedMethod] = useState('alipay');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    cardNumber: '',
    holderName: '',
    expiryDate: '',
    cvv: '',
  });

  // 创建支付订单
  const createPayment = useMutation({
    mutationFn: (data: { orderId: number; method: string }) =>
      request.post('/payments', data),
    onSuccess: (response) => {
      if (response.data.qrCode) {
        setQrCodeUrl(response.data.qrCode);
        setShowQRCode(true);
        startPolling();
      } else if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    },
  });

  // 银行卡支付
  const processBankPayment = useMutation({
    mutationFn: (data: {
      orderId: number;
      method: string;
      cardInfo: typeof bankInfo;
    }) => request.post('/payments/bank', data),
    onSuccess: () => {
      onSuccess();
    },
  });

  // 轮询支付状态
  const pollPaymentStatus = useMutation({
    mutationFn: (paymentId: string) =>
      request.get(`/payments/${paymentId}/status`),
  });

  const startPolling = () => {
    const interval = setInterval(async () => {
      const result = await pollPaymentStatus.mutateAsync(orderId.toString());
      if (result.data.status === 'success') {
        clearInterval(interval);
        onSuccess();
      } else if (result.data.status === 'failed') {
        clearInterval(interval);
        // 处理支付失败
      }
    }, 3000);

    // 5分钟后停止轮询
    setTimeout(() => {
      clearInterval(interval);
    }, 5 * 60 * 1000);
  };

  const handleSubmit = () => {
    if (selectedMethod === 'bank') {
      processBankPayment.mutate({
        orderId,
        method: selectedMethod,
        cardInfo: bankInfo,
      });
    } else {
      createPayment.mutate({
        orderId,
        method: selectedMethod,
      });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        支付金额：￥{amount.toFixed(2)}
      </Typography>

      <RadioGroup
        value={selectedMethod}
        onChange={(e) => setSelectedMethod(e.target.value)}
      >
        <Grid container spacing={2}>
          {paymentMethods.map((method) => (
            <Grid item xs={12} key={method.id}>
              <FormControlLabel
                value={method.id}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={method.icon}
                      alt={method.name}
                      style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    <Typography>{method.name}</Typography>
                  </Box>
                }
              />
            </Grid>
          ))}
        </Grid>
      </RadioGroup>

      {selectedMethod === 'bank' && (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="卡号"
                value={bankInfo.cardNumber}
                onChange={(e) =>
                  setBankInfo({ ...bankInfo, cardNumber: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="持卡人姓名"
                value={bankInfo.holderName}
                onChange={(e) =>
                  setBankInfo({ ...bankInfo, holderName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="有效期"
                placeholder="MM/YY"
                value={bankInfo.expiryDate}
                onChange={(e) =>
                  setBankInfo({ ...bankInfo, expiryDate: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                type="password"
                value={bankInfo.cvv}
                onChange={(e) =>
                  setBankInfo({ ...bankInfo, cvv: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
          取消
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={createPayment.isLoading || processBankPayment.isLoading}
        >
          {createPayment.isLoading || processBankPayment.isLoading ? (
            <CircularProgress size={24} />
          ) : (
            '确认支付'
          )}
        </Button>
      </Box>

      <Dialog open={showQRCode} onClose={() => setShowQRCode(false)}>
        <DialogTitle>请扫码支付</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
            }}
          >
            <QRCode value={qrCodeUrl} size={200} />
            <Typography sx={{ mt: 2 }}>
              支付金额：￥{amount.toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQRCode(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentForm; 