import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const orderId = location.state?.orderId;

  if (!orderId) {
    navigate('/');
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: isMobile ? 4 : 8, mb: isMobile ? 4 : 8 }}>
      <Paper 
        elevation={3}
        sx={{
          p: isMobile ? 3 : 4,
          textAlign: 'center',
        }}
      >
        <CheckCircleOutlineIcon
          sx={{
            fontSize: isMobile ? 60 : 80,
            color: 'success.main',
            mb: 2,
          }}
        />
        
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
          订单提交成功！
        </Typography>
        
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          订单号：{orderId}
        </Typography>
        
        <Typography variant="body1" paragraph>
          感谢您的购买！我们将尽快处理您的订单。
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
            size={isMobile ? "medium" : "large"}
          >
            继续购物
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/profile/orders')}
            size={isMobile ? "medium" : "large"}
          >
            查看订单
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default OrderSuccess; 