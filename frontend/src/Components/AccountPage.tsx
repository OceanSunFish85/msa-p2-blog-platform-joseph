// src/pages/AccountPage.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const mockArticles = [
  {
    id: 1,
    title: 'Understanding React Hooks',
    summary:
      'A deep dive into React hooks and how they can be used to simplify your components.',
    image: 'https://via.placeholder.com/150',
    tags: ['React', 'Hooks'],
    views: 150,
    comments: 10,
    date: '2023-01-01',
  },
  {
    id: 2,
    title: 'Introduction to TypeScript',
    summary:
      'Learn the basics of TypeScript and how it can help you write safer and more reliable code.',
    image: 'https://via.placeholder.com/150',
    tags: ['TypeScript', 'JavaScript'],
    views: 200,
    comments: 20,
    date: '2023-02-01',
  },
  // Add more mock articles here
];

const AccountPage: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        padding: theme.spacing(4),
        marginTop: theme.spacing(8), // 设置 marginTop 以放置 header 遮挡
        display: 'flex',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={2} alignItems="flex-start" minHeight="80vh">
          {/* 左列 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ padding: theme.spacing(2) }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {/* 头像 */}
                    <Avatar
                      sx={{ width: 100, height: 100, cursor: 'pointer' }}
                      src="https://via.placeholder.com/100"
                      alt="User Avatar"
                      onClick={handleClickOpen}
                    />
                    <Dialog open={open} onClose={handleClose}>
                      <DialogTitle>修改头像</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          您确定要修改头像吗？
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>取消</Button>
                        <Button onClick={handleClose} color="primary">
                          确认
                        </Button>
                      </DialogActions>
                    </Dialog>
                    {/* 个人信息 */}
                    <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                      用户名
                    </Typography>
                    <Typography variant="body1" align="center">
                      兴趣标签: 编程, 阅读, 旅行
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {/* 操作按钮 */}
                    <Button
                      variant="contained"
                      sx={{
                        mb: 1,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      编辑信息
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        mb: 1,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      修改密码
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      设置标签
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* 分割线 */}
          <Divider orientation="vertical" flexItem />

          {/* 右列 */}
          <Grid item xs={12} md={7}>
            <Box sx={{ padding: theme.spacing(2) }}>
              {/* 文章管理标题 */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6">文章管理</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background.default,
                    borderRadius: '50px', // 圆形
                    border: `1px solid ${theme.palette.primary.main}`, // 边框颜色为 secondary
                    padding: theme.spacing(0.5),
                    overflow: 'hidden', // 确保边框圆形
                    height: '36px',
                  }}
                >
                  <InputBase
                    placeholder="Search..."
                    inputProps={{ 'aria-label': 'search' }}
                    sx={{ marginLeft: theme.spacing(1), flex: 1 }}
                  />
                  <IconButton
                    type="submit"
                    sx={{ p: '10px' }}
                    color="secondary"
                  >
                    <SearchIcon />
                  </IconButton>
                </Box>
              </Box>
              <Divider></Divider>

              {/* 文章管理标签 */}
              <AppBar
                position="static"
                sx={{ marginTop: theme.spacing(2), boxShadow: 'none' }}
                color="primary"
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTabs-indicator': {
                      backgroundColor: theme.palette.secondary.main, // 指示器颜色
                    },
                    '& .MuiTab-root': {
                      color: 'inherit',
                      '&.Mui-selected': {
                        color: theme.palette.secondary.main, // 选中状态下的颜色
                      },
                    },
                  }}
                >
                  <Tab label="我的文章" />
                  <Tab label="我的收藏" />
                </Tabs>
              </AppBar>

              {/* 文章列表 */}
              <List sx={{ marginTop: theme.spacing(2) }}>
                {mockArticles.map((article) => (
                  <ListItem key={article.id}>
                    <Card
                      sx={{
                        display: 'flex',
                        width: '100%',
                        backgroundColor: theme.palette.background.default,
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{ width: 150 }}
                        image={article.image}
                        alt={article.title}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          flexGrow: 1,
                        }}
                      >
                        <CardContent>
                          <Typography component="div" variant="h6">
                            {article.title}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: theme.spacing(1),
                              flexWrap: 'wrap',
                              mt: 1,
                            }}
                          >
                            {article.tags.map((tag) => (
                              <Typography
                                key={tag}
                                variant="body2"
                                color="secondary"
                              >
                                {tag}
                              </Typography>
                            ))}
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ mt: 1 }}
                          >
                            {article.summary}
                          </Typography>
                        </CardContent>
                        <CardActions
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: theme.spacing(1),
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: theme.spacing(2) }}>
                            <Typography variant="body2" color="text.primary">
                              阅读量: {article.views}
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                              评论数: {article.comments}
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                              上传日期: {article.date}
                            </Typography>
                          </Box>
                          <IconButton
                            onClick={handleMenuClick}
                            color="secondary"
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={menuAnchorEl}
                            open={Boolean(menuAnchorEl)}
                            onClose={handleMenuClose}
                            sx={{
                              '& .MuiPaper-root': {
                                bgcolor: theme.palette.background.default,
                              },
                              '& .MuiMenuItem-root': {
                                '&:hover': {
                                  bgcolor: theme.palette.action.hover,
                                  color: theme.palette.text.secondary, // 悬停时字体颜色变成次要颜色
                                },
                                '&.Mui-selected': {
                                  bgcolor: theme.palette.action.selected,
                                  color: theme.palette.text.secondary, // 选中项的字体颜色变成次要颜色
                                  '&:hover': {
                                    bgcolor: theme.palette.action.selected,
                                    color: theme.palette.text.secondary, // 悬停时保持选中项的字体颜色为次要颜色
                                  },
                                },
                              },
                            }}
                          >
                            <MenuItem onClick={handleMenuClose}>编辑</MenuItem>
                            <MenuItem onClick={handleMenuClose}>
                              设置公开
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose}>删除</MenuItem>
                          </Menu>
                        </CardActions>
                      </Box>
                    </Card>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AccountPage;
