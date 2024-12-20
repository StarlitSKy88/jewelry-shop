import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image_url || '/images/product-placeholder.jpg'}
        alt={product.name}
        sx={{ cursor: 'pointer', objectFit: 'cover' }}
        onClick={handleProductClick}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' },
          }}
          onClick={handleProductClick}
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
          }}
        >
          {product.description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
            ¥{product.price.toFixed(2)}
          </Typography>
          {product.stock > 0 ? (
            <Typography variant="body2" color="success.main">
              有货
            </Typography>
          ) : (
            <Typography variant="body2" color="error">
              缺货
            </Typography>
          )}
        </Box>
      </CardContent>
      <CardActions>
        <IconButton
          size="small"
          onClick={handleFavoriteClick}
          color={isFavorite ? 'secondary' : 'default'}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Button
          size="small"
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          sx={{ ml: 'auto' }}
        >
          加入购物车
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard; 