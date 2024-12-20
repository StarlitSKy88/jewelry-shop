import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  TextField,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../../../utils/request';
import Loading from '../../../components/Loading';

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  userName: string;
  status: 'pending' | 'paid' | 'shipping' | 'completed' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  address: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    address: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

const statusMap = {
  pending: { label: '待付款', color: 'warning' },
  paid: { label: '已付款', color: 'info' },
  shipping: { label: '配送中', color: 'primary' },
  completed: { label: '已完成', color: 'success' },
  cancelled: { label: '已取消', color: 'error' },
} as const;

const Orders = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['orders', page, rowsPerPage, search],
    queryFn: () =>
      request
        .get('/admin/orders', {
          params: {
            page: page + 1,
            limit: rowsPerPage,
            search,
          },
        })
        .then((res) => res.data),
  });

  const updateOrderStatus = useMutation({
    mutationFn: (data: { id: number; status: Order['status'] }) =>
      request.put(`/admin/orders/${data.id}/status`, { status: data.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      handleCloseDialog();
    },
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (order: Order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = (status: Order['status']) => {
    if (selectedOrder) {
      updateOrderStatus.mutate({ id: selectedOrder.id, status });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        订单管理
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            label="搜索订单"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>订单号</TableCell>
                <TableCell>用户</TableCell>
                <TableCell>金额</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>支付方式</TableCell>
                <TableCell>创建时间</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.userName}</TableCell>
                  <TableCell>￥{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusMap[order.status].label}
                      color={statusMap[order.status].color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(order)}
                    >
                      <ViewIcon />
                    </IconButton>
                    {order.status === 'paid' && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          updateOrderStatus.mutate({
                            id: order.id,
                            status: 'shipping',
                          })
                        }
                      >
                        <ShippingIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={-1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="每页行数"
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>订单详情</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    基本信息
                  </Typography>
                  <Typography>订单号：{selectedOrder.id}</Typography>
                  <Typography>用户：{selectedOrder.userName}</Typography>
                  <Typography>
                    创建时间：
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Typography>
                  <Typography>
                    更新时间：
                    {new Date(selectedOrder.updatedAt).toLocaleString()}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    收货信息
                  </Typography>
                  <Typography>
                    收货人：{selectedOrder.address.name}
                  </Typography>
                  <Typography>
                    电话：{selectedOrder.address.phone}
                  </Typography>
                  <Typography>
                    地址：
                    {`${selectedOrder.address.province}${selectedOrder.address.city}${selectedOrder.address.district}${selectedOrder.address.address}`}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    商品信息
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>商品名称</TableCell>
                          <TableCell align="right">数量</TableCell>
                          <TableCell align="right">单价</TableCell>
                          <TableCell align="right">小计</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell align="right">
                              {item.quantity}
                            </TableCell>
                            <TableCell align="right">
                              ￥{item.price.toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              ￥{(item.quantity * item.price).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <strong>总计</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>
                              ￥{selectedOrder.totalAmount.toFixed(2)}
                            </strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {selectedOrder.status !== 'completed' &&
                  selectedOrder.status !== 'cancelled' && (
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        订单操作
                      </Typography>
                      <FormControl fullWidth>
                        <InputLabel>更新状态</InputLabel>
                        <Select
                          value={selectedOrder.status}
                          label="更新状态"
                          onChange={(e) =>
                            handleUpdateStatus(
                              e.target.value as Order['status']
                            )
                          }
                        >
                          {Object.entries(statusMap).map(([key, value]) => (
                            <MenuItem key={key} value={key}>
                              {value.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders; 