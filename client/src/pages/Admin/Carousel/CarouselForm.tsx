import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';

function CarouselForm({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      image: '',
      link: '',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? '编辑轮播图' : '添加轮播图'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="标题"
            type="text"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="image"
            label="图片URL"
            type="text"
            fullWidth
            value={formData.image}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="link"
            label="链接地址"
            type="text"
            fullWidth
            value={formData.link}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button type="submit" variant="contained" color="primary">
            保存
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CarouselForm; 