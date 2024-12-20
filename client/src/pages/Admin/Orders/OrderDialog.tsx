import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../../../utils/request';
import { useToast } from '../../../components/Toast';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
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

interface OrderDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDialog: React.FC<OrderDialogProps> = ({
  open,
  onClose,
  order,
}) => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const updateStatusMutation = useMutation({
    mutationFn: (status: Order['status']) =>
      request.put<ApiResponse<Order>>(`/admin/orders/${order?.id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      showSuccess('订单状态已更新');
      onClose();
    },
    onError: () => {
      showError('更新订单状态失败');
    },
  });

  const handleUpdateStatus = async (status: Order['status']) => {
    if (window.confirm('确定要更新订单状态吗？')) {
      await updateStatusMutation.mutateAsync(status);
    }
  };

  if (!order) return null;

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: '待处理',
      processing: '处理中',
      completed: '已完成',
      cancelled: '已取消',
    };
    return statusMap[status];
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>订单详情</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              基本信息
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2" gutterBottom>
                订单编号：{order.id}
              </Typography>
              <Typography variant="body2" gutterBottom>
                下单时间：{new Date(order.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                订单状态：{getStatusText(order.status)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                订单金额：¥{order.total.toLocaleString()}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              收货信息
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2" gutterBottom>
                收货人：{order.shippingAddress.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                联系电话：{order.shippingAddress.phone}
              </Typography>
              <Typography variant="body2" gutterBottom>
                收货地址：{order.shippingAddress.address}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              商品信息
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>商品名称</TableCell>
                    <TableCell align="right">单价</TableCell>
                    <TableCell align="right">数量</TableCell>
                    <TableCell align="right">小计</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">
                        ¥{item.price.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
        {order.status === 'pending' && (
          <Button
            color="primary"
            onClick={() => handleUpdateStatus('processing')}
          >
            开始处理
          </Button>
        )}
        {order.status === 'processing' && (
          <Button
            color="primary"
            onClick={() => handleUpdateStatus('completed')}
          >
            完成订单
          </Button>
        )}
        {(order.status === 'pending' || order.status === 'processing') && (
          <Button
            color="error"
            onClick={() => handleUpdateStatus('cancelled')}
          >
            取消订单
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OrderDialog; 