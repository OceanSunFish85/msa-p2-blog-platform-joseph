// src/Layout/Header.tsx
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
import { Link } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
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

// 自定义样式的 MenuItem
const CustomMenuItem = styled(MenuItem)<{
  component?: React.ElementType;
  to?: string;
}>(({ theme }) => ({
  '&.active': {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.main,
      top: '-4px',
      right: '-4px',
    },
  },
}));

// 自定义搜索框样式
const Search = styled('div')(({ theme }) => ({
  position: 'relative', // 使其相对定位
  borderRadius: theme.shape.borderRadius, // 圆角边框
  backgroundColor: alpha(theme.palette.common.white, 0.15), // 背景颜色，透明度为 0.15
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25), // 悬停时背景颜色透明度变为 0.25
  },
  marginRight: theme.spacing(2), // 右外边距
  marginLeft: 0, // 左外边距
  width: '100%', // 宽度为 100%
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3), // 在小屏幕以上设备上，左外边距为 theme.spacing(3)
    width: 'auto', // 宽度为自动
  },
}));

// 搜索图标容器样式
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2), // 内边距
  height: '100%', // 高度为 100%
  position: 'absolute', // 绝对定位
  pointerEvents: 'none', // 使其不响应鼠标事件
  display: 'flex', // 使用 flex 布局
  alignItems: 'center', // 垂直居中
  justifyContent: 'center', // 水平居中
}));

// 输入框样式
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit', // 颜色继承父级
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0), // 内边距
    paddingLeft: `calc(1em + ${theme.spacing(4)})`, // 左内边距
    transition: theme.transitions.create('width'), // 宽度过渡效果
    width: '100%', // 宽度为 100%
    [theme.breakpoints.up('md')]: {
      width: '20ch', // 在中等及以上屏幕宽度为 20 个字符宽度
    },
  },
}));

const Header: React.FC = () => {
  const theme = useTheme(); // 获取主题
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 判断是否为小屏幕设备
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // 菜单锚点
  const [drawerOpen, setDrawerOpen] = React.useState(false); // 抽屉状态

  // 处理菜单打开
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 处理菜单关闭
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 切换抽屉状态
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

  const isMenuOpen = Boolean(anchorEl); // 判断菜单是否打开
  const renderMenu = (
    <Menu
      anchorEl={anchorEl} // 菜单锚点元素
      anchorOrigin={{
        vertical: 'top', // 垂直方向对齐方式
        horizontal: 'right', // 水平方向对齐方式
      }}
      id="primary-search-account-menu" // 菜单 ID
      keepMounted // 保持挂载状态
      transformOrigin={{
        vertical: 'top', // 垂直方向变换原点
        horizontal: 'right', // 水平方向变换原点
      }}
      open={isMenuOpen} // 菜单是否打开
      onClose={handleMenuClose} // 菜单关闭事件
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const renderDrawer = (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      <List>
        <ListItem component={Link} to="/" onClick={toggleDrawer(false)}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component={Link} to="/articles" onClick={toggleDrawer(false)}>
          <ListItemText primary="Articles" />
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <AppBar position="fixed">
      {' '}
      {/* 固定定位的应用栏 */}
      <Toolbar>
        {' '}
        {/* 工具栏，水平排列内容 */}
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
              {/* 左侧区域 */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="h6"
                  noWrap
                  component={Link}
                  to="/"
                  sx={{
                    textDecoration: 'underline', // 文字装饰，无下划线
                    color: 'inherit', // 颜色继承父级
                  }}
                >
                  Joseph Blog
                </Typography>
                <CustomMenuItem component={Link} to="/">
                  Home
                </CustomMenuItem>
                <CustomMenuItem component={Link} to="/articles">
                  Articles
                </CustomMenuItem>
              </Box>
            </Grid>
            <Grid item xs={4}>
              {/* 中间区域 */}
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…" // 输入框占位符
                  inputProps={{ 'aria-label': 'search' }} // 无障碍属性
                />
              </Search>
            </Grid>
            <Grid item xs={4}>
              {/* 右侧区域 */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
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
                <CustomMenuItem component={Link} to="/">
                  Account
                </CustomMenuItem>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  sx={{ marginLeft: theme.spacing(2) }}
                >
                  New Post
                </Button>
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
