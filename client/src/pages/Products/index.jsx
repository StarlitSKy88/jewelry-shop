import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Drawer,
  useMediaQuery,
  IconButton,
  Button,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import ProductCard from '../../components/Products/ProductCard';
import ProductFilters from './components/ProductFilters';
import ProductSort from './components/ProductSort';
import { fetchProducts, fetchCategories } from '../../store/slices/productSlice';
import ProductGrid from './components/ProductGrid';

const Products = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // 从Redux store获取状态
  const {
    items: products,
    loading,
    error,
    filters,
    pagination,
  } = useSelector((state) => state.products);

  // 初始化加载
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // 监听筛选条件和分页化，重新获取产品
  useEffect(() => {
    const params = {
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    };
    dispatch(fetchProducts(params));
  }, [dispatch, filters, pagination.page, pagination.limit]);

  // 处理移动端筛选抽屉
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // 渲染筛选器
  const renderFilters = () => (
    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
      <Grid 
        item 
        sx={{ 
          width: { xs: '100%', sm: 240, md: 280 },
          display: { xs: 'none', md: 'block' },
        }}
      >
        <ProductFilters />
      </Grid>
      <Grid 
        item 
        sx={{ 
          flex: 1,
          minWidth: 0,
        }}
      >
        <ProductGrid products={products} />
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 页面标题和移动端筛选按钮 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          全部商品
        </Typography>
        {isMobile && (
          <IconButton
            sx={{ ml: 'auto' }}
            onClick={handleDrawerToggle}
            aria-label="打开筛选"
          >
            <FilterListIcon />
          </IconButton>
        )}
      </Box>

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex' }}>
        {/* 桌面端筛选栏 */}
        {!isMobile && renderFilters()}

        {/* 移动端筛选抽屉 */}
        {isMobile && (
          <Drawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // 提升移动端性能
            }}
          >
            {renderFilters()}
          </Drawer>
        )}

        {/* 主要内��区域 */}
        <Box sx={{ flexGrow: 1 }}>
          {/* 排序工具栏 */}
          <Box sx={{ mb: 3 }}>
            <ProductSort />
          </Box>

          {/* 产品列表 */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              {/* 空状态提示 */}
              {products.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary" paragraph>
                    没有找到符合条件的商品
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => dispatch(clearFilters())}
                  >
                    清除筛选条件
                  </Button>
                </Box>
              )}

              {/* 分页 */}
              {products.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={Math.ceil(pagination.total / pagination.limit)}
                    page={pagination.page}
                    onChange={(_, page) =>
                      dispatch(updatePagination({ page }))
                    }
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Products; 