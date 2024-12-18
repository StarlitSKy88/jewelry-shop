import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const BannerWrapper = styled(Box)({
  position: 'relative',
  height: '80vh',
  minHeight: 500,
  overflow: 'hidden',
});

const SlideContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  transition: 'opacity 0.5s ease-in-out',
}));

const SlideBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255,255,255,0.3)',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
}));

const slides = [
  {
    image: '/images/banner1.jpg',
    title: '奢华臻品，为您而选',
    subtitle: '精选优质宝石，打造专属于您的珠宝首饰',
    buttonText: '立即选购',
    link: '/products',
  },
  {
    image: '/images/banner2.jpg',
    title: '新品上市',
    subtitle: '2024春季新品系列，邀您共赏',
    buttonText: '查看详情',
    link: '/new-arrivals',
  },
  {
    image: '/images/banner3.jpg',
    title: '限时特惠',
    subtitle: '精选商品限时8折起',
    buttonText: '立即抢购',
    link: '/sale',
  },
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <BannerWrapper>
      {slides.map((slide, index) => (
        <SlideContent
          key={index}
          sx={{
            opacity: currentSlide === index ? 1 : 0,
            visibility: currentSlide === index ? 'visible' : 'hidden',
          }}
        >
          <SlideBackground
            sx={{
              backgroundImage: `url(${slide.image})`,
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ maxWidth: 600, color: '#fff' }}>
              <Typography variant="h1" gutterBottom>
                {slide.title}
              </Typography>
              <Typography variant="h5" sx={{ mb: 4 }}>
                {slide.subtitle}
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to={slide.link}
                sx={{
                  backgroundColor: '#fff',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                {slide.buttonText}
              </Button>
            </Box>
          </Container>
        </SlideContent>
      ))}
      
      <NavigationButton
        sx={{ left: 20 }}
        onClick={handlePrevSlide}
      >
        <ArrowBackIosNewIcon />
      </NavigationButton>
      
      <NavigationButton
        sx={{ right: 20 }}
        onClick={handleNextSlide}
      >
        <ArrowForwardIosIcon />
      </NavigationButton>
    </BannerWrapper>
  );
};

export default Banner; 