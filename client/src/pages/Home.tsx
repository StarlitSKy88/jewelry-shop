import React from 'react';
import { Box, Typography, Container, Grid, Rating, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://via.placeholder.com/1920x1080/1a1a1a/C4A661?text=Hero+Image")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  }
}));

const ProductCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
  '& img': {
    width: '100%',
    height: 'auto',
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  }
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
}));

const Home = () => {
  return (
    <Box>
      <HeroSection>
        <ContentWrapper>
          <Container maxWidth="md">
            <Typography variant="h2" component="h1" gutterBottom>
              Express Your Unique Style
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
              MOST TRUSTED SOURCE FOR STONE BEADED BRACELETS
            </Typography>
            <Box mt={4}>
              <Rating value={4.8} readOnly precision={0.1} sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                4.8/5.0 (9929 REVIEWS)
              </Typography>
            </Box>
            <Box mt={6} display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>• Hand-made for your wrist size</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>• 30-day Satisfaction Guarantee</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>• Family-Crafted Quality Since 2015</Typography>
            </Box>
            <Button
              component={RouterLink}
              to="/shop"
              variant="contained"
              size="large"
              sx={{ mt: 6, px: 6, py: 1.5 }}
            >
              SHOP NOW
            </Button>
          </Container>
        </ContentWrapper>
      </HeroSection>

      <Box sx={{ bgcolor: 'background.default', py: 12 }}>
        <Container>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            Best Sellers
          </Typography>
          <Grid container spacing={4}>
            {bestSellers.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard>
                  <Box sx={{ overflow: 'hidden', mb: 2 }}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography 
                          component="span" 
                          sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 1 }}
                        >
                          ${product.originalPrice}
                        </Typography>
                        <Typography component="span" color="primary">
                          ${product.salePrice}
                        </Typography>
                      </Box>
                      <Button
                        component={RouterLink}
                        to={`/product/${product.id}`}
                        variant="outlined"
                        color="primary"
                      >
                        View
                      </Button>
                    </Box>
                  </Box>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: 'background.paper', py: 12 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 4 }}>
            Aurum Brothers Family
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 6, color: 'text.secondary' }}>
            Since 2015 we offer a range of different custom-made bracelets for men. 
            From bold colors to elegant bracelets there is always a design that fits your unique style. 
            We approach our bracelet designs through storytelling. 
            We love to be inspired by historical, cultural, or mythical themes so that our customers 
            not only wear our products but also feel like they're part of the story themselves!
          </Typography>
          <Box textAlign="center">
            <Button
              component={RouterLink}
              to="/about"
              variant="outlined"
              size="large"
              sx={{ px: 6 }}
            >
              Read our story
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

const bestSellers = [
  {
    id: 1,
    name: "Lava Bracelet IV",
    originalPrice: 219,
    salePrice: 164,
    image: "https://via.placeholder.com/400x400/1a1a1a/C4A661?text=Lava+Bracelet"
  },
  {
    id: 2,
    name: "Imperial Jasper Bracelet VI",
    originalPrice: 249,
    salePrice: 187,
    image: "https://via.placeholder.com/400x400/1a1a1a/C4A661?text=Jasper+Bracelet"
  },
  {
    id: 3,
    name: "Black Onyx Bracelet V",
    originalPrice: 169,
    salePrice: 127,
    image: "https://via.placeholder.com/400x400/1a1a1a/C4A661?text=Onyx+Bracelet"
  },
  {
    id: 4,
    name: "Dragon Blood Jasper Bracelet V",
    originalPrice: 189,
    salePrice: 142,
    image: "https://via.placeholder.com/400x400/1a1a1a/C4A661?text=Dragon+Blood+Bracelet"
  }
];

export default Home; 