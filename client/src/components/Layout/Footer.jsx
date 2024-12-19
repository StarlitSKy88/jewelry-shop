import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              关于我们
            </Typography>
            <Typography variant="body2" color="text.secondary">
              我们是一家专注于提供高品质珠宝首饰的在线商城，
              致力于为每位顾客带来独特而精致的购物体验。
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              快速链接
            </Typography>
            <Link
              component={RouterLink}
              to="/products"
              color="text.secondary"
              display="block"
            >
              全部商品
            </Link>
            <Link
              component={RouterLink}
              to="/about"
              color="text.secondary"
              display="block"
            >
              关于我们
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              color="text.secondary"
              display="block"
            >
              联系我们
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              联系方式
            </Typography>
            <Typography variant="body2" color="text.secondary">
              邮箱：contact@jewelry-shop.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              电话：+86 123 4567 8901
            </Typography>
            <Typography variant="body2" color="text.secondary">
              地址：北京市朝阳区xx街xx号
            </Typography>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://jewelry-shop.com/">
              珠宝商城
            </Link>{' '}
            {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 