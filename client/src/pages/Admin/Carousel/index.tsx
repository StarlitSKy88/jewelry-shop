import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CarouselForm from './CarouselForm';
import { useState } from 'react';

function CarouselManagement() {
  const [openForm, setOpenForm] = useState(false);
  const [carousels, setCarousels] = useState([
    // 示例数据
    { id: 1, title: '新品上市', image: '/images/carousel1.jpg', link: '/products/new' },
    { id: 2, title: '特惠活动', image: '/images/carousel2.jpg', link: '/products/sale' },
  ]);

  const handleAdd = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  const handleSave = (data) => {
    // 这里处理保存逻辑
    console.log('Save carousel:', data);
    setOpenForm(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">轮播图管理</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          添加轮播图
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>标题</TableCell>
              <TableCell>图片</TableCell>
              <TableCell>链接</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carousels.map((carousel) => (
              <TableRow key={carousel.id}>
                <TableCell>{carousel.id}</TableCell>
                <TableCell>{carousel.title}</TableCell>
                <TableCell>
                  <img
                    src={carousel.image}
                    alt={carousel.title}
                    style={{ width: 100, height: 'auto' }}
                  />
                </TableCell>
                <TableCell>{carousel.link}</TableCell>
                <TableCell>
                  <Button color="primary">编辑</Button>
                  <Button color="error">删除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CarouselForm open={openForm} onClose={handleClose} onSave={handleSave} />
    </Container>
  );
}

export default CarouselManagement; 