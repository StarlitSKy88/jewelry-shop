import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  Rating,
  TextField,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ProductImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const ThumbnailImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  cursor: 'pointer',
  opacity: 0.6,
  transition: 'opacity 0.3s ease',
  '&.active': {
    opacity: 1,
  },
  '&:hover': {
    opacity: 1,
  },
}));

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '90vh',
  objectFit: 'contain',
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ pt: 12, pb: 8 }}>
      <Container>
        <Grid container spacing={6}>
          {/* 商品图片区域 */}
          <Grid item xs={12} md={6}>
            <Box>
              <ProductImage
                src={product.images[selectedImage]}
                alt={product.name}
                onClick={handlePreviewOpen}
              />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {product.images.map((image, index) => (
                  <Grid item xs={3} key={index}>
                    <ThumbnailImage
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={selectedImage === index ? 'active' : ''}
                      onClick={() => handleImageClick(index)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* 商品信息区域 */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={4.8} precision={0.1} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  (128 reviews)
                </Typography>
              </Box>
              <Typography variant="h5" color="primary" gutterBottom>
                ${product.price}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                {product.description}
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Size</InputLabel>
                <Select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  label="Size"
                >
                  {product.sizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}mm
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  InputProps={{ inputProps: { min: 1 } }}
                  sx={{ width: 100 }}
                />
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <IconButton onClick={handleFavoriteClick}>
                  {isFavorite ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>

              <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Description" />
                  <Tab label="Details" />
                  <Tab label="Reviews" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  <Typography>
                    {product.longDescription}
                  </Typography>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Typography variant="subtitle1" gutterBottom>
                    Materials
                  </Typography>
                  <Typography paragraph>
                    {product.materials}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Dimensions
                  </Typography>
                  <Typography>
                    {product.dimensions}
                  </Typography>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  {/* Reviews content */}
                  <Box>
                    {product.reviews.map((review, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="subtitle2" sx={{ ml: 1 }}>
                            {review.author}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {review.comment}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </TabPanel>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* 图片预览对话框 */}
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handlePreviewClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
              bgcolor: 'black',
            }}
          >
            <PreviewImage
              src={product.images[selectedImage]}
              alt={product.name}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Product added to cart successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

const product = {
  name: "Lava Bracelet IV (6mm)",
  price: 219,
  description: "A stunning bracelet featuring natural lava stones, perfect for both casual and formal wear.",
  longDescription: "The Lava Bracelet IV is crafted with genuine 6mm lava stones, known for their grounding properties and unique texture. Each bracelet is carefully hand-made to ensure the highest quality and attention to detail. The matte black finish of the lava stones creates a sophisticated look that pairs well with any outfit.",
  materials: "Natural lava stones, Sterling silver clasp, Elastic cord",
  dimensions: "Bracelet length: 19-20cm (adjustable), Stone size: 6mm",
  sizes: [4, 6, 8],
  images: [
    "/images/products/lava-bracelet-1.jpg",
    "/images/products/lava-bracelet-2.jpg",
    "/images/products/lava-bracelet-3.jpg",
    "/images/products/lava-bracelet-4.jpg"
  ],
  reviews: [
    {
      author: "John D.",
      rating: 5,
      comment: "Excellent quality and perfect fit. The stones are beautiful and the craftsmanship is outstanding."
    },
    {
      author: "Michael R.",
      rating: 4,
      comment: "Great bracelet, very comfortable to wear. The only minor issue is that it took a while to arrive."
    },
    {
      author: "David S.",
      rating: 5,
      comment: "Absolutely love this bracelet! The attention to detail is amazing and it looks even better in person."
    }
  ]
};

export default ProductDetail; 