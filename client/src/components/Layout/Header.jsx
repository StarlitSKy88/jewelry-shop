import { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container,
  Button,
  MenuItem,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#fff',
  color: '#000',
  boxShadow: 'none',
  borderBottom: '1px solid #eee',
});

const Logo = styled(Typography)({
  fontWeight: 700,
  letterSpacing: '.1rem',
  textDecoration: 'none',
  color: 'inherit',
});

const pages = [
  { title: '新品上市', path: '/new-arrivals' },
  { title: '手链系列', path: '/bracelets' },
  { title: '项链系列', path: '/necklaces' },
  { title: '限量系列', path: '/limited' },
  { title: '畅销系列', path: '/best-sellers' },
];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const cartItems = useSelector(state => state.cart.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* 移动端菜单 */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={(e) => setAnchorElNav(e.currentTarget)}
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.title}
                  component={Link}
                  to={page.path}
                  onClick={() => setAnchorElNav(null)}
                >
                  {page.title}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo */}
          <Logo
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: { xs: 1, md: 0 } }}
          >
            JEWELRY SHOP
          </Logo>

          {/* 桌面端导航 */}
          <Box 
            component="nav" 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              justifyContent: 'center',
              gap: 2
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.title}
                component={Link}
                to={page.path}
                sx={{ color: 'inherit' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* 用户功能区 */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              component={Link} 
              to="/account"
              aria-label="account"
            >
              <PersonOutlineIcon />
            </IconButton>
            <IconButton 
              component={Link} 
              to="/cart"
              aria-label="cart"
            >
              <Badge badgeContent={cartItemCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header; 