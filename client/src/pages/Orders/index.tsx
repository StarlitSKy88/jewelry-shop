import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { useQuery } from '@tanstack/react-query';
import { request } from '../../utils/request';
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

const Orders: React.FC = () => {
  const { data: orders, isLoading } = useQuery<ApiResponse<Order[]>>({
    queryKey: ['orders'],
    queryFn: () =>
      request.get<ApiResponse<Order[]>>('/orders').then((res) => res.data),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!orders?.data.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          我的订单
        </Typography>
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            暂无订单
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        我的订单
      </Typography>

      <Grid container spacing={2}>
        {orders.data.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card>
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
                    订单号：{order.id}
                  </Typography>
                  <Chip
                    label={statusMap[order.status].label}
                    color={statusMap[order.status].color}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  {order.items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 1,
                          mr: 2,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">
                          {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          ¥{item.price.toLocaleString()} × {item.quantity}
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
                    borderTop: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      收货人：{order.shippingAddress.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      电话：{order.shippingAddress.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      地址：{order.shippingAddress.address}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      下单时间：
                      {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ mt: 1 }}
                    >
                      总计：¥{order.totalAmount.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Orders; 