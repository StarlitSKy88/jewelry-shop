import { useVirtual } from 'react-virtual';
import { Box, Grid } from '@mui/material';

const ProductGrid = ({ products }) => {
  const parentRef = React.useRef();
  
  const rowVirtualizer = useVirtual({
    size: Math.ceil(products.length / 3),
    parentRef,
    estimateSize: React.useCallback(() => 350, []),
    overscan: 5,
  });

  return (
    <Box ref={parentRef} sx={{ height: '100vh', overflow: 'auto' }}>
      <Box
        sx={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => {
          const rowProducts = products.slice(virtualRow.index * 3, (virtualRow.index + 1) * 3);
          return (
            <Grid
              container
              spacing={3}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
              key={virtualRow.index}
            >
              {rowProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          );
        })}
      </Box>
    </Box>
  );
};

export default ProductGrid; 