import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const sortOptions = [
  { value: 'createdAt:desc', label: '最新上架' },
  { value: 'price:asc', label: '价格从低到高' },
  { value: 'price:desc', label: '价格从高到低' },
  { value: 'name:asc', label: '名称A-Z' },
  { value: 'name:desc', label: '名称Z-A' },
];

function ProductSort({ sort, onSortChange, isMobile }) {
  const handleChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: isMobile ? 'flex-start' : 'flex-end',
      mb: isMobile ? 2 : 0
    }}>
      <FormControl 
        sx={{ 
          minWidth: isMobile ? '100%' : 200
        }} 
        size={isMobile ? "small" : "medium"}
      >
        <InputLabel>排序方式</InputLabel>
        <Select 
          value={sort} 
          label="排序方式" 
          onChange={handleChange}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5,
              },
            },
          }}
        >
          {sortOptions.map((option) => (
            <MenuItem 
              key={option.value} 
              value={option.value}
              sx={{ 
                fontSize: isMobile ? '0.875rem' : '1rem',
                py: isMobile ? 1 : 1.5
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default ProductSort; 