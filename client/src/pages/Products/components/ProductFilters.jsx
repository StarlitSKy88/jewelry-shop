import {
  Box,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters, clearFilters } from '../../../store/slices/productSlice';

const ProductFilters = () => {
  const dispatch = useDispatch();
  const { filters, categories } = useSelector((state) => state.products);

  // 处理分类选择
  const handleCategoryChange = (category) => {
    dispatch(updateFilters({ category }));
  };

  // 处理价格范围变化
  const handlePriceChange = (_, newValue) => {
    dispatch(updateFilters({ priceRange: newValue }));
  };

  // 清除所有筛选条件
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        筛选条件
      </Typography>

      {/* 分类筛选 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          商品分类
        </Typography>
        <FormControl component="fieldset">
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    checked={filters.category === category.id}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                }
                label={category.name}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Box>

      {/* 价格范围筛选 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          价格范围
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={100000}
            step={1000}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              ¥{filters.priceRange[0].toLocaleString()}
            </Typography>
            <Typography variant="body2">
              ¥{filters.priceRange[1].toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 清除筛选按钮 */}
      <Button
        variant="outlined"
        fullWidth
        onClick={handleClearFilters}
        sx={{ mt: 2 }}
      >
        清除筛选
      </Button>
    </Box>
  );
};

export default ProductFilters; 