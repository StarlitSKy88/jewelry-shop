import { Box, Container, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Banner() {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 8,
        position: 'relative',
        backgroundImage: 'url(/images/banner-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
      >
        <Typography
          component="h1"
          variant="h2"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          发现独特的珠宝之美
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          精选优质珠宝，为您打造专属风格
        </Typography>
        <Button
          component={RouterLink}
          to="/products"
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          立即选购
        </Button>
      </Container>
    </Box>
  );
}

export default Banner; 