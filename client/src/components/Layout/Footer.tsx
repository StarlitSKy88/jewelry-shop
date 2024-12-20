import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button,
  Link as MuiLink,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const FooterSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(8, 0),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'rgba(196, 166, 97, 0.1)',
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  display: 'block',
  marginBottom: theme.spacing(1),
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const Footer = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 处理订阅逻辑
  };

  return (
    <FooterSection>
      <Container>
        <Grid container spacing={4}>
          {/* 品牌信息 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              AURUM BROTHERS
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Since 2015 we offer a range of different custom-made bracelets for men. 
              From bold colors to elegant bracelets there is always a design that fits your unique style.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <SocialButton aria-label="facebook">
                <Facebook />
              </SocialButton>
              <SocialButton aria-label="instagram">
                <Instagram />
              </SocialButton>
              <SocialButton aria-label="twitter">
                <Twitter />
              </SocialButton>
              <SocialButton aria-label="youtube">
                <YouTube />
              </SocialButton>
            </Box>
          </Grid>

          {/* 快速链接 */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box component="nav">
              {['Shop', 'About Us', 'Contact', 'FAQ'].map((item) => (
                <StyledLink
                  key={item}
                  to={`/${item.toLowerCase().replace(' ', '-')}`}
                >
                  {item}
                </StyledLink>
              ))}
            </Box>
          </Grid>

          {/* 客户服务 */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Box component="nav">
              {[
                'Shipping Info',
                'Returns',
                'Size Guide',
                'Track Order',
              ].map((item) => (
                <StyledLink
                  key={item}
                  to={`/${item.toLowerCase().replace(' ', '-')}`}
                >
                  {item}
                </StyledLink>
              ))}
            </Box>
          </Grid>

          {/* 订阅区域 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Subscribe to receive updates, access to exclusive deals, and more.
            </Typography>
            <Box component="form" onSubmit={handleNewsletterSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Subscribe
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* 版权信息 */}
        <Box sx={{ mt: 8, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Aurum Brothers. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
              <StyledLink
                to="/privacy-policy"
                style={{ display: 'inline', marginRight: '24px' }}
              >
                Privacy Policy
              </StyledLink>
              <StyledLink
                to="/terms-of-service"
                style={{ display: 'inline' }}
              >
                Terms of Service
              </StyledLink>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </FooterSection>
  );
};

export default Footer; 