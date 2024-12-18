import { useState, memo } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box,
  Button,
  IconButton,
  Tooltip 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

const StyledCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 0,
  boxShadow: 'none',
  position: 'relative',
  '&:hover': {
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    },
    '& .product-actions': {
      opacity: 1,
    },
  },
});

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '100%',
  transition: 'transform 0.3s ease-in-out',
});

const ProductActions = styled(Box)({
  position: 'absolute',
  top: 10,
  right: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
});

const ProductCard = ({ product, onQuickView, onToggleFavorite }) => {
  const { id, name, price, originalPrice, images, isFavorite = false } = product;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <StyledCard
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <StyledCardMedia
          component="img"
          loading="lazy"
          srcSet={`${images[0]}?w=300 300w, ${images[0]}?w=600 600w`}
          sizes="(max-width: 600px) 300px, 600px"
          alt={name}
        />
        <ProductActions className="product-actions">
          <Tooltip title="快速预览">
            <IconButton
              sx={{ bgcolor: 'white' }}
              onClick={() => onQuickView(product)}
            >
              <RemoveRedEyeOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={isFavorite ? "取消收藏" : "加入收藏"}>
            <IconButton
              sx={{ bgcolor: 'white' }}
              onClick={() => onToggleFavorite(product)}
            >
              {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        </ProductActions>
      </Box>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Typography 
          component={Link} 
          to={`/products/${id}`}
          sx={{ 
            color: 'inherit',
            textDecoration: 'none',
            fontWeight: 500,
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          {name}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography 
            component="span" 
            sx={{ 
              color: 'error.main',
              mr: 1,
              fontWeight: 500,
            }}
          >
            ¥{price.toLocaleString()}
          </Typography>
          {originalPrice && (
            <Typography 
              component="span" 
              sx={{ 
                textDecoration: 'line-through',
                color: 'text.secondary',
              }}
            >
              ¥{originalPrice.toLocaleString()}
            </Typography>
          )}
        </Box>
        <Button
          variant="outlined"
          fullWidth
          sx={{ 
            mt: 2,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          component={Link}
          to={`/products/${id}`}
        >
          查看详情
        </Button>
      </CardContent>
    </StyledCard>
  );
};

// 添加比较函数
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.isFavorite === nextProps.isFavorite
  );
};

export default memo(ProductCard, areEqual); 