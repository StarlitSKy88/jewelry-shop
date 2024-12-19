import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Button,
  Stack,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../../../utils/api';

function ProductFilters({ filters, onFilterChange, isMobile }) {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: productAPI.getCategories,
  });

  const handleChange = (name) => (event) => {
    onFilterChange({
      ...filters,
      [name]: event.target.value,
    });
  };

  const handleReset = () => {
    onFilterChange({
      category: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  const content = (
    <>
      <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
        筛选条件
      </Typography>

      {/* 分类筛选 */}
      <FormControl 
        fullWidth 
        sx={{ mb: isMobile ? 1.5 : 2 }}
        size={isMobile ? "small" : "medium"}
      >
        <InputLabel>商品分类</InputLabel>
        <Select
          value={filters.category}
          label="商品分类"
          onChange={handleChange('category')}
        >
          <MenuItem value="">全部</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 价格区间 */}
      <Typography 
        variant={isMobile ? "body2" : "subtitle2"} 
        gutterBottom
        sx={{ mt: isMobile ? 1 : 2 }}
      >
        价格区间
      </Typography>
      <Stack 
        direction={isMobile ? "row" : "column"} 
        spacing={1} 
        sx={{ mb: isMobile ? 1.5 : 2 }}
      >
        <TextField
          label="最低价"
          type="number"
          size={isMobile ? "small" : "medium"}
          value={filters.minPrice}
          onChange={handleChange('minPrice')}
          InputProps={{ inputProps: { min: 0 } }}
          fullWidth
        />
        <TextField
          label="最高价"
          type="number"
          size={isMobile ? "small" : "medium"}
          value={filters.maxPrice}
          onChange={handleChange('maxPrice')}
          InputProps={{ inputProps: { min: 0 } }}
          fullWidth
        />
      </Stack>

      {/* 重置按钮 */}
      <Button
        variant="outlined"
        fullWidth
        onClick={handleReset}
        size={isMobile ? "small" : "medium"}
        sx={{ mt: 1 }}
      >
        重置筛选
      </Button>
    </>
  );

  if (isMobile) {
    return content;
  }

  return (
    <Paper sx={{ p: 2 }}>
      {content}
    </Paper>
  );
}

export default ProductFilters; 