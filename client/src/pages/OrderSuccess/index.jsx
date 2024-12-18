import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderSuccess = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <CheckCircleOutlineIcon 
          sx={{ fontSize: 80, color: 'success.main', mb: 2 }} 
        />
        <Typography variant="h4" gutterBottom>
          订单提交成功！
        </Typography>
        <Typography color="text.secondary" paragraph>
          感谢您的购买，我们将尽快为您发货。
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            component={Link} 
            to="/orders" 
            variant="contained"
          >
            查看订单
          </Button>
          <Button 
            component={Link} 
            to="/products" 
            variant="outlined"
          >
            继续购物
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderSuccess; 