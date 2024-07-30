import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Grid,
} from '@mui/material';
import { useAppSelector } from '../store/useAppSelecter';
import { RootState } from '../store/store';
import { useAppDispatch } from '../store/useAppDispatch';
import { logout } from '../store/slices/auth';
import { toggleTheme } from '../store/slices/global';

// 自定义搜索框样式
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '50px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(3),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: `1px solid ${theme.palette.secondary.main}`,
}));

// 搜索图标容器样式
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.secondary.main,
}));

// 输入框样式
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    '&::placeholder': {
      color: theme.palette.primary.main,
    },
  },
}));

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const muiTheme = useAppSelector((state: RootState) => state.global.theme);

  const handleNewPostClick = () => {
    navigate('/newPost');
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleAccountClick = () => {
    navigate('/account');
    setAnchorEl(null);
  };
  const handleUserLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate('/login');
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const isMenuOpen = Boolean(anchorEl);
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id="primary-search-account-menu"
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{
        '& .MuiPaper-root': {
          bgcolor: theme.palette.background.default,
          '& .MuiMenuItem-root': {
            '&.Mui-selected': {
              bgcolor: theme.palette.common.white,
              color: theme.palette.secondary.main,
              '&:hover': {
                bgcolor: theme.palette.common.white,
                color: theme.palette.secondary.main,
              },
            },
          },
        },
      }}
    >
      <MenuItem onClick={handleAccountClick}>Account</MenuItem>
      <MenuItem onClick={handleUserLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderDrawer = (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      <List>
        <MenuItem component={Link} to="/" onClick={toggleDrawer(false)}>
          <ListItemText primary="Home" />
        </MenuItem>
        <MenuItem component={Link} to="/detail" onClick={toggleDrawer(false)}>
          <ListItemText primary="Detail" />
        </MenuItem>
      </List>
    </Drawer>
  );

  return (
    <AppBar position="fixed">
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              Joseph Blog
            </Typography>
            {renderDrawer}
          </>
        ) : (
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="h6"
                  noWrap
                  component={Link}
                  to="/"
                  sx={{
                    textDecoration: 'underline',
                    color: 'inherit',
                  }}
                >
                  Joseph Blog
                </Typography>
                <Box flexGrow={1}></Box>
                <Link
                  to="/"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    borderBottom:
                      location.pathname === '/'
                        ? `2px solid ${theme.palette.secondary.main}`
                        : 'none',
                  }}
                >
                  <Button sx={{ color: 'inherit' }}>Home</Button>
                </Link>
                <Link
                  to="/detail"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    borderBottom:
                      location.pathname === '/detail'
                        ? `2px solid ${theme.palette.secondary.main}`
                        : 'none',
                  }}
                >
                  <Button sx={{ color: 'inherit' }}>Detail</Button>
                </Link>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {isAuthenticated ? (
                  <>
                    {/* <Link
                      to="/account"
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        borderBottom:
                          location.pathname === '/account'
                            ? `2px solid ${theme.palette.secondary.main}`
                            : 'none',
                      }}
                    >
                      <Button sx={{ color: 'inherit' }}>Account</Button>
                    </Link> */}
                    <IconButton onClick={handleToggleTheme} color="inherit">
                      {muiTheme === 'light' ? (
                        <Brightness4Icon />
                      ) : (
                        <Brightness7Icon />
                      )}
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="account of current user"
                      aria-controls="primary-search-account-menu"
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                      sx={{ marginRight: theme.spacing(0) }}
                    >
                      <AccountCircle />
                    </IconButton>
                    <Box flexGrow={1}></Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<AddIcon />}
                      sx={{ marginLeft: theme.spacing(2) }}
                      onClick={handleNewPostClick}
                    >
                      New Post
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        borderBottom:
                          location.pathname === '/login'
                            ? `2px solid ${theme.palette.secondary.main}`
                            : 'none',
                      }}
                    >
                      <Button sx={{ color: 'inherit' }}>Login</Button>
                    </Link>
                    <Link
                      to="/register"
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        borderBottom:
                          location.pathname === '/register'
                            ? `2px solid ${theme.palette.secondary.main}`
                            : 'none',
                      }}
                    >
                      <Button sx={{ color: 'inherit' }}>Sign Up</Button>
                    </Link>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Toolbar>
      {renderMenu}
    </AppBar>
  );
};

export default Header;
