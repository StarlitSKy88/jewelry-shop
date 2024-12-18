import { Box, Container, Grid, Typography } from '@mui/material';
import Banner from '../../components/Home/Banner';
import ProductCard from '../../components/Products/ProductCard';
import { styled } from '@mui/material/styles';

const SectionTitle = styled(Typography)({
  textAlign: 'center',
  marginBottom: '2rem',
  '&::after': {
    content: '""',
    display: 'block',
    width: '60px',
    height: '2px',
    backgroundColor: '#000',
    margin: '1rem auto 0',
  },
});

const Home = () => {
  // 这里应该从API获取数据
  const featuredProducts = []; 
  const newArrivals = [];

  return (
    <Box>
      <Banner />
      
      <Container sx={{ py: 8 }}>
        <SectionTitle variant="h2">
          畅销系列
        </SectionTitle>
        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <SectionTitle variant="h2">
            新品上市
          </SectionTitle>
          <Grid container spacing={4}>
            {newArrivals.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 