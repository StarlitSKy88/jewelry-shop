import { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Button, 
  IconButton,
  Tabs,
  Tab,
  TextField,
  Breadcrumbs,
  Link as MuiLink,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useParams } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

const ProductImage = styled('img')({
  width: '100%',
  height: 'auto',
  display: 'block',
});

const ThumbImage = styled('img')({
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  cursor: 'pointer',
  border: '2px solid transparent',
  '&.active': {
    borderColor: '#000',
  },
});

const TabPanel = ({ children, value, index }) => (
  <Box hidden={value !== index} sx={{ py: 3 }}>
    {value === index && children}
  </Box>
);

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const dispatch = useDispatch();

  // 模拟产品数据，实际应从API获取
  const product = {
    id,
    name: '18K金钻石手链',
    price: 12999,
    originalPrice: 15999,
    description: '精选南非钻石，18K金打造，简约优雅的设计彰显高贵气质。',
    images: [
      '/images/product1-1.jpg',
      '/images/product1-2.jpg',
      '/images/product1-3.jpg',
      '/images/product1-4.jpg',
    ],
    specs: {
      material: '18K金',
      stone: '钻石',
      weight: '3.5g',
      size: '16-18cm可调',
      certificate: 'GIA证书',
    },
    stock: 10,
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      specs: product.specs,
      stock: product.stock,
      quantity,
    }));
    setSnackbar({
      open: true,
      message: '已添加到购物车',
      severity: 'success',
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setSnackbar({
      open: true,
      message: isFavorite ? '已取消收藏' : '已添加到收藏夹',
      severity: 'success',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 面包屑导航 */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <MuiLink component={Link} to="/" color="inherit">
          首页
        </MuiLink>
        <MuiLink component={Link} to="/products" color="inherit">
          全部商品
        </MuiLink>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={6}>
        {/* 商品图片 */}
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 2 }}>
            <ProductImage
              src={product.images[selectedImage]}
              alt={product.name}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {product.images.map((image, index) => (
              <ThumbImage
                key={index}
                src={image}
                alt={`${product.name}-${index}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </Box>
        </Grid>

        {/* 商品信息 */}
        <Grid item xs={12} md={5}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h5" 
              color="error" 
              component="span"
              sx={{ mr: 2 }}
            >
              ¥{product.price.toLocaleString()}
            </Typography>
            {product.originalPrice && (
              <Typography 
                variant="h6" 
                color="text.secondary" 
                component="span"
                sx={{ textDecoration: 'line-through' }}
              >
                ¥{product.originalPrice.toLocaleString()}
              </Typography>
            )}
          </Box>

          <Typography variant="body1" sx={{ mb: 4 }}>
            {product.description}
          </Typography>

          {/* 数量选择 */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>数量：</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                value={quantity}
                size="small"
                sx={{ width: 60, mx: 1 }}
                inputProps={{ 
                  style: { textAlign: 'center' },
                  readOnly: true
                }}
              />
              <IconButton 
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Typography color="text.secondary">
              库存：{product.stock}件
            </Typography>
          </Box>

          {/* 操作按钮 */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button 
              variant="contained" 
              size="large"
              fullWidth
              onClick={handleAddToCart}
            >
              加入购物车
            </Button>
            <IconButton 
              onClick={handleToggleFavorite}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              {isFavorite ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Box>

          {/* 商品详情标签页 */}
          <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, newValue) => setTabValue(newValue)}
            >
              <Tab label="商品详情" />
              <Tab label="规格参数" />
              <Tab label="购买须知" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="body1">
                {product.description}
              </Typography>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Object.entries(product.specs).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ width: 100 }} color="text.secondary">
                      {key}：
                    </Typography>
                    <Typography>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="body1" paragraph>
                1. 支持7天无理由退换货
              </Typography>
              <Typography variant="body1" paragraph>
                2. 商品支持正品保证
              </Typography>
              <Typography variant="body1" paragraph>
                3. 全顺丰包邮
              </Typography>
            </TabPanel>
          </Box>
        </Grid>
      </Grid>

      {/* 提示消息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail; 