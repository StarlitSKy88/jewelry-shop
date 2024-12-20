import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '../../../utils/request';
import Loading from '../../../components/Loading';
import ImageUpload from '../../../components/ImageUpload';

interface Category {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  image: string;
  order: number;
  createdAt: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  parentId: number | null;
  image: string;
  order: number;
}

const Categories = () => {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    parentId: null,
    image: '',
    order: 0,
  });

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => request.get('/admin/categories').then((res) => res.data),
  });

  const createCategory = useMutation({
    mutationFn: (data: CategoryFormData) =>
      request.post('/admin/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseDialog();
    },
  });

  const updateCategory = useMutation({
    mutationFn: (data: { id: number; data: CategoryFormData }) =>
      request.put(`/admin/categories/${data.id}`, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseDialog();
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: number) => request.delete(`/admin/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        parentId: category.parentId,
        image: category.image,
        order: category.order,
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: '',
        description: '',
        parentId: null,
        image: '',
        order: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      parentId: null,
      image: '',
      order: 0,
    });
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      updateCategory.mutate({ id: selectedCategory.id, data: formData });
    } else {
      createCategory.mutate(formData);
    }
  };

  const getParentName = (parentId: number | null) => {
    if (!parentId) return '无';
    const parent = categories?.find((c) => c.id === parentId);
    return parent ? parent.name : '无';
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">分类管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          添加分��
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>名称</TableCell>
                <TableCell>描述</TableCell>
                <TableCell>上级分类</TableCell>
                <TableCell>排序</TableCell>
                <TableCell>创建时间</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{getParentName(category.parentId)}</TableCell>
                  <TableCell>{category.order}</TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(category)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteCategory.mutate(category.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedCategory ? '编辑分类' : '添加分类'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="分类名称"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="分类描述"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>上级分类</InputLabel>
              <Select
                value={formData.parentId || ''}
                label="上级分类"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parentId: e.target.value as number | null,
                  })
                }
              >
                <MenuItem value="">无</MenuItem>
                {categories
                  ?.filter((c) => c.id !== selectedCategory?.id)
                  .map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="排序"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value, 10),
                })
              }
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle1" gutterBottom>
              分类图片
            </Typography>
            <ImageUpload
              value={[formData.image]}
              onChange={(images) =>
                setFormData({ ...formData, image: images[0] || '' })
              }
              maxFiles={1}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSubmit} variant="contained">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories; 