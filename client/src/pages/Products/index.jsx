import { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Pagination,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import ProductCard from '../../components/Products/ProductCard';
import ProductFilters from './components/ProductFilters';
import ProductSort from './components/ProductSort';
import { productAPI } from '../../utils/api';

function Products() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const [sort, setSort] = useState('createdAt:desc');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, filters, sort],
    queryFn: () =>
      productAPI.getProducts({
        page,
        limit: 12,
        ...filters,
        sort,
      }),
  });

  const handlePageChange = (event, value) => {
    setPage(value);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    if (isMobile) {
      setIsFilterDrawerOpen(false);
    }
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1">
          全部商品
        </Typography>
        {isMobile && (
          <Button
            startIcon={<FilterListIcon />}
            onClick={toggleFilterDrawer}
            variant="outlined"
            size="small"
          >
            筛选
          </Button>
        )}
      </Box>
      
      <Grid container spacing={3}>
        {/* 桌面端筛选器 */}
        {!isMobile && (
          <Grid item md={3}>
            <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
          </Grid>
        )}
        
        {/* 移动端筛选器抽屉 */}
        {isMobile && (
          <Drawer
            anchor="right"
            open={isFilterDrawerOpen}
            onClose={toggleFilterDrawer}
            PaperProps={{
              sx: { width: '80%', maxWidth: '300px', p: 2 }
            }}
          >
            <ProductFilters 
              filters={filters} 
              onFilterChange={handleFilterChange}
              isMobile={true}
            />
          </Drawer>
        )}
        
        {/* 商品列表 */}
        <Grid item xs={12} md={!isMobile ? 9 : 12}>
          <Box mb={2}>
            <ProductSort sort={sort} onSortChange={handleSortChange} isMobile={isMobile} />
          </Box>
          
          {isLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={isMobile ? 1 : 2}>
                {data?.products.map((product) => (
                  <Grid item key={product.id} xs={6} sm={6} md={4}>
                    <ProductCard product={product} isMobile={isMobile} />
                  </Grid>
                ))}
              </Grid>
              
              <Box 
                display="flex" 
                justifyContent="center" 
                mt={4}
                sx={{
                  '& .MuiPagination-ul': {
                    flexWrap: 'nowrap',
                  }
                }}
              >
                <Pagination
                  count={Math.ceil((data?.total || 0) / 12)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                />
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Products; 