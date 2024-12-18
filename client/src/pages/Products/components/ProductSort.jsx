import { Box, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters } from '../../../store/slices/productSlice';

const sortOptions = [
  { value: 'newest', label: '最新上架' },
  { value: 'price_asc', label: '价格从低到高' },
  { value: 'price_desc', label: '价格从高到低' },
  { value: 'popular', label: '最受欢迎' },
];

const ProductSort = () => {
  const dispatch = useDispatch();
  const { sortBy } = useSelector((state) => state.products.filters);

  // 处理排序方式变化
  const handleSortChange = (event) => {
    dispatch(updateFilters({ sortBy: event.target.value }));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>排序方式</InputLabel>
        <Select
          value={sortBy}
          onChange={handleSortChange}
          label="排序方式"
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ProductSort; 