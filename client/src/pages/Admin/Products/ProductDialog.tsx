import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../../../utils/request';
import { useToast } from '../../../components/Toast';
import { useForm } from '../../../hooks/useForm';
import { ImageUpload } from '../../../components/ImageUpload';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  images: string[];
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onClose,
  product,
}) => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const initialValues = product
    ? { ...product }
    : {
        id: '',
        name: '',
        price: 0,
        description: '',
        category: '',
        stock: 0,
        images: [] as string[],
      };

  const { values, handleChange, handleSubmit, setFieldValue } = useForm<Product>({
    initialValues,
    onSubmit: async (values) => {
      if (product) {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
      onClose();
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Product, 'id'>) =>
      request.post<ApiResponse<Product>>('/admin/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      showSuccess('商品已创建');
    },
    onError: () => {
      showError('创建商品失败');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Product) =>
      request.put<ApiResponse<Product>>(`/admin/products/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      showSuccess('商品已更新');
    },
    onError: () => {
      showError('更新商品失败');
    },
  });

  const handleImagesChange = (images: string[]) => {
    setFieldValue('images', images);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {product ? '编辑商品' : '添加商品'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="商品名称"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="价格"
                name="price"
                type="number"
                value={values.price}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="库存"
                name="stock"
                type="number"
                value={values.stock}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="分类"
                name="category"
                value={values.category}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="描述"
                name="description"
                multiline
                rows={4}
                value={values.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <ImageUpload
                images={values.images}
                onChange={handleImagesChange}
                maxImages={5}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button type="submit" variant="contained">
            保存
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductDialog; 