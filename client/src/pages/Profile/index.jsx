import { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import { orderAPI } from '../../utils/api';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 获取订单历史
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: orderAPI.getOrders,
  });

  // 更新用户信息
  const updateUserMutation = useMutation({
    mutationFn: (data) => updateUser(data),
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUserInfoChange = (field) => (event) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSaveUserInfo = () => {
    updateUserMutation.mutate(userInfo);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        个人中心
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="个人信息" />
          <Tab label="我的订单" />
          <Tab label="收货地址" />
        </Tabs>
      </Box>

      {/* 个人信息 */}
      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">基本信息</Typography>
              <Button
                startIcon={isEditing ? null : <EditIcon />}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? '取消' : '编辑'}
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="用户名"
                  value={userInfo.username}
                  onChange={handleUserInfoChange('username')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="邮箱"
                  value={userInfo.email}
                  onChange={handleUserInfoChange('email')}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleSaveUserInfo}
                  disabled={updateUserMutation.isLoading}
                >
                  保存
                </Button>
              </Box>
            )}

            {updateUserMutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                更新失败，请重试
              </Alert>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* 订单历史 */}
      <TabPanel value={activeTab} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              订单历史
            </Typography>
            
            {isLoadingOrders ? (
              <Typography>加载中...</Typography>
            ) : orders.length === 0 ? (
              <Typography color="text.secondary">暂无订单</Typography>
            ) : (
              <List>
                {orders.map((order) => (
                  <div key={order.id}>
                    <ListItem>
                      <ListItemText
                        primary={`订单号：${order.id}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              下单时间：{new Date(order.created_at).toLocaleString()}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              订单状态：{order.status}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              总金额：¥{order.total_amount.toFixed(2)}
                            </Typography>
                          </>
                        }
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        查看详情
                      </Button>
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* 收货地址 */}
      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">收货地址</Typography>
              <Button startIcon={<AddIcon />}>
                添加新地址
              </Button>
            </Box>

            <List>
              {[].map((address) => (
                <div key={address.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton edge="end" aria-label="edit">
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={`${address.name} ${address.phone}`}
                      secondary={`${address.province}${address.city}${address.district}${address.address}`}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>

            {/* 暂无地址时显示 */}
            {true && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                暂无收货地址
              </Typography>
            )}
          </CardContent>
        </Card>
      </TabPanel>
    </Container>
  );
}

export default Profile; 