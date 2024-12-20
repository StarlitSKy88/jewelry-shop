import React from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

type SortType = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

interface ProductSortProps {
  sort?: SortType;
  onSortChange: (sort: SortType) => void;
}

export const ProductSort: React.FC<ProductSortProps> = ({
  sort,
  onSortChange,
}) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newSort: SortType | null,
  ) => {
    if (newSort !== null) {
      onSortChange(newSort);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <ToggleButtonGroup
        value={sort}
        exclusive
        onChange={handleChange}
        aria-label="商品排序"
        size="small"
      >
        <ToggleButton value="price_asc" aria-label="价格从低到高">
          价格
          <ArrowUpwardIcon sx={{ ml: 0.5 }} />
        </ToggleButton>
        <ToggleButton value="price_desc" aria-label="价格从高到低">
          价格
          <ArrowDownwardIcon sx={{ ml: 0.5 }} />
        </ToggleButton>
        <ToggleButton value="name_asc" aria-label="名称正序">
          名称
          <SortByAlphaIcon sx={{ ml: 0.5 }} />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}; 