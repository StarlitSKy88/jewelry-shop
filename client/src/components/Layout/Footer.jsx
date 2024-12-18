import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
}));

const FooterLink = styled(Link)({
  color: '#fff',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const Footer = () => {
  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              关于我们
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              我们致力于为您提供最优质的珠宝首饰，每一件作品都凝聚着匠人的心血与艺术的灵感。
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" component="a" href="https://instagram.com">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" component="a" href="https://facebook.com">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" component="a" href="https://twitter.com">
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              快速链接
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink href="/about">关于我们</FooterLink>
              <FooterLink href="/contact">联系我们</FooterLink>
              <FooterLink href="/shipping">配送信息</FooterLink>
              <FooterLink href="/returns">退换政策</FooterLink>
              <FooterLink href="/faq">常见问题</FooterLink>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              联系方式
            </Typography>
            <Typography variant="body2" paragraph>
              客服电话：400-888-8888
            </Typography>
            <Typography variant="body2" paragraph>
              营业时间：周一至周日 10:00-22:00
            </Typography>
            <Typography variant="body2" paragraph>
              邮箱：service@jewelryshop.com
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Jewelry Shop. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer; 