import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { useQuery, useMutation } from '@tanstack/react-query';
import { request } from '../../utils/request';
import { useToast } from '../../components/Toast';
import Loading from '../../components/Loading';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
  };
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

const statusMap = {
  pending: { label: '待付款', color: 'warning' },
  processing: { label: '处理中', color: 'info' },
  completed: { label: '已完成', color: 'success' },
  cancelled: { label: '已取消', color: 'error' },
} as const;

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const { data: order, isLoading } = useQuery<ApiResponse<Order>>({
    queryKey: ['order', id],
    queryFn: () =>
      request.get<ApiResponse<Order>>(`/orders/${id}`).then((res) => res.data),
  });

  const cancelOrderMutation = useMutation({
    mutationFn: () => request.post(`/orders/${id}/cancel`),
    onSuccess: () => {
      showSuccess('订单已取消');
      navigate('/orders');
    },
    onError: () => {
      showError('取消订单失败');
    },
  });

  const handleCancel = () => {
    if (window.confirm('确定要取消订单吗？')) {
      cancelOrderMutation.mutate();
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!order) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          订单详情
        </Typography>
        {order.data.status === 'pending' && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancel}
          >
            取消订单
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">
              订单号：{order.data.id}
            </Typography>
            <Chip
              label={statusMap[order.data.status].label}
              color={statusMap[order.data.status].color}
              size="small"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              收货信息
            </Typography>
            <Typography variant="body2" color="text.secondary">
              收货人：{order.data.shippingAddress.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              电话：{order.data.shippingAddress.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              地址：{order.data.shippingAddress.address}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              商品信息
            </Typography>
            {order.data.items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 1,
                    mr: 2,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    单价：¥{item.price.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    数量：{item.quantity}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    小计：¥{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 2,
              mt: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              下单时间：{new Date(order.data.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="h6" color="primary">
              总计：¥{order.data.totalAmount.toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/orders')}
        >
          返回订单列表
        </Button>
      </Box>
    </Container>
  );
};

export default OrderDetail; 