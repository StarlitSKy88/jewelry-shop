import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ProductCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  position: 'relative',
  '&:hover': {
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    },
    '& .quick-view-button': {
      opacity: 1,
    },
  },
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 400,
  transition: 'transform 0.3s ease-in-out',
}));

const QuickViewButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: 100,
  left: '50%',
  transform: 'translateX(-50%)',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.black,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const FilterDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    padding: theme.spacing(3),
  },
}));

const Shop = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const FilterContent = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Filter By
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        Categories
      </Typography>
      <FormGroup>
        <FormControlLabel control={<Checkbox />} label="Bracelets" />
        <FormControlLabel control={<Checkbox />} label="Necklaces" />
        <FormControlLabel control={<Checkbox />} label="Rings" />
        <FormControlLabel control={<Checkbox />} label="Collections" />
      </FormGroup>

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          sx={{ color: theme.palette.primary.main }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>${priceRange[0]}</Typography>
          <Typography>${priceRange[1]}</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Materials
        </Typography>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="Gold" />
          <FormControlLabel control={<Checkbox />} label="Silver" />
          <FormControlLabel control={<Checkbox />} label="Platinum" />
          <FormControlLabel control={<Checkbox />} label="Gemstones" />
        </FormGroup>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ pt: 12, pb: 8 }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">Shop All</Typography>
          {isMobile && (
            <IconButton onClick={toggleFilter}>
              <FilterIcon />
            </IconButton>
          )}
        </Box>

        <Grid container spacing={3}>
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <FilterContent />
            </Grid>
          )}
          
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <ProductCard>
                    <ProductImage
                      image={product.image}
                      title={product.name}
                    />
                    <QuickViewButton className="quick-view-button">
                      Quick View
                    </QuickViewButton>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body1" color="primary">
                        ${product.price}
                      </Typography>
                    </CardContent>
                  </ProductCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <FilterDrawer
        anchor="right"
        open={isFilterOpen}
        onClose={toggleFilter}
      >
        <FilterContent />
      </FilterDrawer>
    </Box>
  );
};

const products = [
  {
    id: 1,
    name: "Lava Bracelet IV (6mm)",
    price: 219,
    image: "/images/products/lava-bracelet.jpg"
  },
  {
    id: 2,
    name: "Imperial Jasper Bracelet VI (4mm)",
    price: 249,
    image: "/images/products/jasper-bracelet.jpg"
  },
  {
    id: 3,
    name: "Black Onyx Bracelet V (4mm)",
    price: 169,
    image: "/images/products/onyx-bracelet.jpg"
  },
  {
    id: 4,
    name: "Dragon Blood Jasper Bracelet V (4mm)",
    price: 189,
    image: "/images/products/dragon-blood-bracelet.jpg"
  },
  {
    id: 5,
    name: "Gold Tiger Eye Bracelet III (8mm)",
    price: 199,
    image: "/images/products/tiger-eye-bracelet.jpg"
  },
  {
    id: 6,
    name: "Matte Black Onyx Bracelet II (8mm)",
    price: 179,
    image: "/images/products/matte-onyx-bracelet.jpg"
  }
];

export default Shop; 