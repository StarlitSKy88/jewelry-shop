import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useQuery } from '@tanstack/react-query';
import { request } from '../../utils/request';
import Loading from '../../components/Loading';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  const { data: banners, isLoading: bannersLoading } = useQuery<
    ApiResponse<Banner[]>
  >({
    queryKey: ['banners'],
    queryFn: () =>
      request
        .get<ApiResponse<Banner[]>>('/banners')
        .then((res) => res.data),
  });

  const { data: featuredProducts, isLoading: productsLoading } = useQuery<
    ApiResponse<Product[]>
  >({
    queryKey: ['featured-products'],
    queryFn: () =>
      request
        .get<ApiResponse<Product[]>>('/products/featured')
        .then((res) => res.data),
  });

  if (bannersLoading || productsLoading) {
    return <Loading />;
  }

  return (
    <Box>
      {/* Banner Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 300, md: 500 },
          overflow: 'hidden',
          mb: 6,
        }}
      >
        {banners?.data[0] && (
          <>
            <Box
              component="img"
              src={banners.data[0].image}
              alt={banners.data[0].title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center',
                px: 2,
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3.75rem' },
                }}
              >
                {banners.data[0].title}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  maxWidth: 800,
                  fontSize: { xs: '1rem', md: '1.5rem' },
                }}
              >
                {banners.data[0].description}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(banners.data[0].link)}
              >
                立即查看
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
        >
          精选商品
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          发现我们精心挑选的优质珠宝
        </Typography>

        <Grid container spacing={3}>
          {featuredProducts?.data.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    noWrap
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 1,
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ¥{product.price.toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    查看详情
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/products')}
          >
            查看全部商品
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 