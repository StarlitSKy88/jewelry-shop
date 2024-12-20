import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Layout() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAdminClick = () => {
    handleClose();
    navigate('/admin');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            珠宝商城
          </Typography>
          <Button color="inherit" component={Link} to="/products">
            商品
          </Button>
          <Button color="inherit" component={Link} to="/cart">
            购物车
          </Button>
          <IconButton
            color="inherit"
            onClick={handleMenu}
            sx={{ ml: 2 }}
          >
            <SettingsIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleAdminClick}>管理后台</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 3, bgcolor: 'grey.200' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 珠宝商城. 保留所有权利.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout; 