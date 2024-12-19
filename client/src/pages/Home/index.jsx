import { Box, Container, Typography, Grid } from '@mui/material';
import Banner from '../../components/Home/Banner';
import ProductCard from '../../components/Products/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../../utils/api';

function Home() {
  const { data: featuredProducts = [], isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => productAPI.getProducts({ featured: true, limit: 8 }),
  });

  return (
    <Box>
      <Banner />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          精选商品
        </Typography>
        <Grid container spacing={4}>
          {isLoading ? (
            <Typography>加载中...</Typography>
          ) : (
            featuredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <ProductCard product={product} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home; 