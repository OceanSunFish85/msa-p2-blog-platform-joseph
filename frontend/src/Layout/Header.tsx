import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { setSearchMessage } from '../store/slices/article';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const muiTheme = useAppSelector((state: RootState) => state.global.theme);
  const [searchInput, setSearchInput] = useState('');
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Handle search
  const handleSearch = () => {
    dispatch(setSearchMessage(searchInput));
    navigate('/');
  };

  // Handle new post click
  const handleNewPostClick = () => {
    navigate('/newPost');
  };

  // Handle profile menu open
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle toggle theme
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // Handle account click
  const handleAccountClick = () => {
    navigate('/account');
    setAnchorEl(null);
  };

  // Handle user logout
  const handleUserLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate('/login');
  };

  // Handle search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  // Toggle drawer
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

  // Toggle search drawer
  const toggleSearchDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setSearchDrawerOpen(open);
    };

  // Account Button Menu
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

  // Mobile Route Drawer
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

  // Mobile Search Drawer
  const renderSearchDrawer = (
    <Drawer
      anchor="top"
      open={searchDrawerOpen}
      onClose={toggleSearchDrawer(false)}
    >
      <Box sx={{ padding: theme.spacing(2) }}>
        <TextField
          placeholder="Search…"
          variant="outlined"
          size="small"
          fullWidth
          onChange={handleSearchChange}
          InputProps={{
            sx: {
              borderRadius: 5, // 设置搜索栏左右圆形
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="secondary" onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: 'background.default',
            borderRadius: 5,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.secondary.main,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.secondary.dark,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.secondary.main,
              },
            },
          }}
        />
      </Box>
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
            <IconButton color="inherit" onClick={toggleSearchDrawer(true)}>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={handleToggleTheme} color="inherit">
              {muiTheme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <IconButton color="inherit" onClick={handleNewPostClick} edge="end">
              <AddIcon />
            </IconButton>
            {renderSearchDrawer}
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
              <Box flexGrow={1} textAlign="center">
                <TextField
                  placeholder="Search…"
                  variant="outlined"
                  size="small"
                  onChange={handleSearchChange}
                  InputProps={{
                    sx: {
                      borderRadius: 5, // 设置搜索栏左右圆形
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton color="secondary" onClick={handleSearch}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: '80%',
                    bgcolor: 'background.default',
                    borderRadius: 5,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: theme.palette.secondary.main,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.secondary.dark,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.secondary.main,
                      },
                    },
                  }}
                />
              </Box>
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
