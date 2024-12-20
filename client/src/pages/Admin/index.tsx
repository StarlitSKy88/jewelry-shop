import React from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';

const menuItems = [
  {
    title: '仪表盘',
    icon: <DashboardIcon />,
    path: '/admin/dashboard',
    description: '查看网站整体运营数据'
  },
  {
    title: '用户管理',
    icon: <PeopleIcon />,
    path: '/admin/users',
    description: '管理用户账号和权限'
  },
  {
    title: '商品管理',
    icon: <ShoppingBagIcon />,
    path: '/admin/products',
    description: '管理商品信息和库存'
  },
  {
    title: '性能监控',
    icon: <TimelineIcon />,
    path: '/admin/performance',
    description: '监控网站性能指标'
  },
  {
    title: '系统设置',
    icon: <SettingsIcon />,
    path: '/admin/settings',
    description: '配置系统参数'
  }
];

const AdminHome = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        管理后台
      </Typography>
      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.path}>
            <Paper
              component={Link}
              to={item.path}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                textDecoration: 'none',
                color: 'text.primary',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[4]
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {React.cloneElement(item.icon, { sx: { mr: 1, fontSize: 24 } })}
                <Typography variant="h6" component="h2">
                  {item.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminHome; 