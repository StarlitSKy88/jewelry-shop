import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import { useQuery } from '@tanstack/react-query';
import { request } from '../../../utils/request';

interface Category {
  id: string;
  name: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

interface FilterState {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const { data: categories } = useQuery<ApiResponse<Category[]>>({
    queryKey: ['categories'],
    queryFn: () =>
      request
        .get<ApiResponse<Category[]>>('/categories')
        .then((res) => res.data),
  });

  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === categoryId ? undefined : categoryId,
    });
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onFilterChange({
        ...filters,
        minPrice: newValue[0],
        maxPrice: newValue[1],
      });
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        筛选条件
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          分类
        </Typography>
        <FormControl component="fieldset">
          <FormGroup>
            {categories?.data.map((category) => (
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

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          价格范围
        </Typography>
        <Slider
          value={[filters.minPrice || 0, filters.maxPrice || 10000]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          step={100}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            ¥{filters.minPrice || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ¥{filters.maxPrice || 10000}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}; 