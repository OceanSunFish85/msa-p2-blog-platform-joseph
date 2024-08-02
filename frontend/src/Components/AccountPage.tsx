import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LabelIcon from '@mui/icons-material/Label';
import { useAppDispatch } from '../store/useAppDispatch';
import { useAppSelector } from '../store/useAppSelecter';
import { RootState } from '../store/store';
import { fetchUserProfile, updateUserInfoThunk } from '../store/slices/user';
import { uploadAvatarThunk } from '../store/slices/upload';
import {
  deleteArticleThunk,
  getUserArticlesThunk,
  setSelectedArticleId,
} from '../store/slices/article';
import { ArticleStatus } from '../Models/enums/ArticleStatus';
import { ArticleSortOption } from '../Models/Article';
import { useNavigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);
  const userArticles = useAppSelector(
    (state: RootState) => state.article.userArticles
  );
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState<ArticleStatus>(
    ArticleStatus.Published
  );
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const userAvatar = localStorage.getItem('userAvatar');
  const userBio = localStorage.getItem('userBio');
  const userName = localStorage.getItem('username');

  const [diaOpen, setDiaOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortOption, setSortOption] = useState<ArticleSortOption>(
    ArticleSortOption.Date
  );
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState('');
  const [debouncedSearchKey, setDebouncedSearchKey] = useState(searchKey);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [deleteArticleId, setDeleteArticleId] = useState<number | null>(null);
  useEffect(() => {
    // 设置debouncedSearchKey，延迟请求
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      setDebouncedSearchKey(searchKey);
    }, 500); // 500ms延迟
    setTimeoutId(id);
  }, [searchKey]);

  useEffect(() => {
    dispatch(
      getUserArticlesThunk({
        searchKey: debouncedSearchKey || '',
        status: tabValue,
        pageNumber: 1,
        pageSize: 10,
        sortBy: sortOption,
        sortOrder: sortOrder,
      })
    );
  }, [dispatch, tabValue, sortOption, sortOrder, debouncedSearchKey]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleArticleClick = (id: number) => {
    dispatch(setSelectedArticleId(id));
    console.log(`Selected Article ID: ${id}`);
    navigate(`/editPost`);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const handleTabChange = (
    event: React.ChangeEvent<{}>,
    newValue: ArticleStatus
  ) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        // 调用 uploadAvatarThunk 上传头像
        const resultAction = await dispatch(
          uploadAvatarThunk(selectedFile)
        ).unwrap();
        const avatarUrl = localStorage.getItem('userAvatar');

        // 打印头像URL
        console.log('Avatar uploaded:', avatarUrl);

        // 更新用户信息中的头像URL
        await dispatch(updateUserInfoThunk({ Avatar: avatarUrl })).unwrap();
        await dispatch(fetchUserProfile());

        handleClose();
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }
  };

  const handleSortOptionClick = (option: ArticleSortOption) => {
    setSortOption(option);
    handleFilterClose();
  };

  const handleSortOrderClick = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const handleClickDiaOpen = (id: number) => {
    setDeleteArticleId(id);
    setDiaOpen(true);
  };

  const handleDiaClose = () => {
    setDiaOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      console.log('Deleting article:', id);
      await dispatch(deleteArticleThunk(id));
      handleDiaClose();
      setSnackbarOpen(true);
      dispatch(
        getUserArticlesThunk({
          searchKey: debouncedSearchKey || '',
          status: tabValue,
          pageNumber: 1,
          pageSize: 10,
          sortBy: sortOption,
          sortOrder: sortOrder,
        })
      );
    } catch (error) {
      console.error('Error deleting article:', error);
    }
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
                    <Card
                      sx={{
                        width: '80%',
                        margin: 'auto',
                        mt: 4,
                        bgcolor: theme.palette.background.default,
                      }}
                    >
                      <CardContent>
                        {/* 头像 */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 2,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 100,
                              height: 100,
                              cursor: 'pointer',
                              border: `2px solid ${theme.palette.background.paper}`,
                            }}
                            src={
                              user?.avatar ||
                              userAvatar ||
                              'https://via.placeholder.com/100'
                            }
                            alt="User Avatar"
                            onClick={handleClickOpen}
                          />
                        </Box>
                        <Dialog open={open} onClose={handleClose}>
                          <DialogTitle>修改头像</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              请选择要上传的头像图片：
                            </DialogContentText>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose}>取消</Button>
                            <Button onClick={handleUpload} color="primary">
                              确认
                            </Button>
                          </DialogActions>
                        </Dialog>
                        {/* 个人信息 */}
                        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                          {user?.userName || userName}
                        </Typography>
                        <Typography variant="body1" align="center">
                          {user?.bio || userBio}
                        </Typography>
                      </CardContent>
                      <Divider />
                      <CardActions sx={{ justifyContent: 'center' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          {/* 操作按钮 */}
                          <Tooltip title="编辑信息" arrow>
                            <IconButton
                              sx={{
                                boxShadow: 'none',
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                '&:hover': {
                                  backgroundColor: theme.palette.secondary.main,
                                  color: theme.palette.background.default,
                                },
                                '&:not(:last-child)::after': {
                                  marginLeft: 2,
                                  marginRight: 2,
                                  color: theme.palette.text.secondary,
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="修改密码" arrow>
                            <IconButton
                              sx={{
                                boxShadow: 'none',
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                '&:hover': {
                                  backgroundColor: theme.palette.secondary.main,
                                  color: theme.palette.background.default,
                                },
                                '&:not(:last-child)::after': {
                                  marginLeft: 2,
                                  marginRight: 2,
                                  color: theme.palette.text.secondary,
                                },
                              }}
                            >
                              <LockIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="设置标签" arrow>
                            <IconButton
                              sx={{
                                boxShadow: 'none',
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                '&:hover': {
                                  backgroundColor: theme.palette.secondary.main,
                                  color: theme.palette.background.default,
                                },
                              }}
                            >
                              <LabelIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardActions>
                    </Card>
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
                    border: `1px solid ${theme.palette.primary.main}`, // 边框颜色为 primary
                    padding: theme.spacing(0.5),
                    overflow: 'hidden', // 确保边框圆形
                    height: '36px',
                  }}
                >
                  <InputBase
                    placeholder="Search..."
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={handleSearchChange}
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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
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
                    {Object.values(ArticleStatus).map((status) => (
                      <Tab
                        label={status === 'Archived' ? 'Private' : status}
                        value={status}
                        key={status}
                      />
                    ))}
                  </Tabs>
                  <Box>
                    <IconButton color="inherit" onClick={handleSortOrderClick}>
                      {sortOrder === 'asc' ? (
                        <ArrowUpward />
                      ) : (
                        <ArrowDownward />
                      )}
                    </IconButton>
                    <IconButton color="inherit" onClick={handleFilterClick}>
                      <FilterListIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Menu
                  anchorEl={filterAnchorEl}
                  open={Boolean(filterAnchorEl)}
                  onClose={handleFilterClose}
                  sx={{
                    '& .MuiPaper-root': {
                      bgcolor: theme.palette.background.default,
                    },
                    '& .MuiMenuItem-root': {
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                        color: theme.palette.text.secondary,
                      },
                      '&.Mui-selected': {
                        bgcolor: theme.palette.action.selected,
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          bgcolor: theme.palette.action.selected,
                          color: theme.palette.text.secondary,
                        },
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() =>
                      handleSortOptionClick(ArticleSortOption.Comments)
                    }
                  >
                    按评论
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortOptionClick(ArticleSortOption.Views)
                    }
                  >
                    按阅读量
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortOptionClick(ArticleSortOption.Likes)
                    }
                  >
                    按喜欢数
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortOptionClick(ArticleSortOption.Date)
                    }
                  >
                    按发布时间
                  </MenuItem>
                </Menu>
              </AppBar>
              {/* 文章列表 */}
              <List sx={{ marginTop: theme.spacing(2) }}>
                {userArticles.map((userArticle) => (
                  <ListItem key={userArticle.id}>
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
                        image={
                          userArticle.cover || 'https://via.placeholder.com/150'
                        }
                        alt={userArticle.title}
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
                            {truncateText(userArticle.title, 30)}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ mt: 1 }}
                          >
                            {truncateText(userArticle.summary, 100)}
                          </Typography>
                        </CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          padding="8px"
                        >
                          <Box display="flex" alignItems="center">
                            <VisibilityIcon
                              fontSize="small"
                              sx={{ marginRight: '4px' }}
                            />
                            <Typography
                              variant="body2"
                              color="secondary.main"
                              sx={{ marginRight: '16px' }}
                            >
                              {userArticle.views}
                            </Typography>
                            <CommentIcon
                              fontSize="small"
                              sx={{ marginRight: '4px' }}
                            />
                            <Typography
                              variant="body2"
                              color="secondary.main"
                              sx={{ marginRight: '16px' }}
                            >
                              {userArticle.commentsCount}
                            </Typography>
                            <ThumbUpIcon
                              fontSize="small"
                              sx={{ marginRight: '4px' }}
                            />
                            <Typography
                              variant="body2"
                              color="secondary.main"
                              sx={{ marginRight: '16px' }}
                            >
                              {userArticle.likes}
                            </Typography>
                            <Typography variant="body2" color="secondary.main">
                              {new Date(
                                userArticle.createdAt
                              ).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <CardActions
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: theme.spacing(1),
                            }}
                          >
                            <Tooltip title="编辑文章" arrow>
                              <IconButton
                                onClick={() =>
                                  handleArticleClick(userArticle.id)
                                }
                                color="secondary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="删除" arrow>
                              <IconButton
                                onClick={() => {
                                  handleClickDiaOpen(userArticle.id);
                                }}
                                color="secondary"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>

                            <Snackbar
                              open={snackbarOpen}
                              autoHideDuration={6000}
                              onClose={handleSnackbarClose}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                              sx={{
                                mt: 8,
                                bgcolor: theme.palette.secondary.main,
                                opacity: 0.9,
                                borderRadius: 1,
                              }}
                            >
                              <Alert
                                onClose={handleSnackbarClose}
                                severity="success"
                                sx={{
                                  width: '100%',
                                  opacity: 0.9,
                                  backgroundColor: theme.palette.secondary.main,
                                  borderRadius: 1,
                                  color: theme.palette.background.default,
                                  '& .MuiAlert-icon': {
                                    color: theme.palette.background.default, // 自定义图标颜色
                                  },
                                }}
                              >
                                文章删除成功！
                              </Alert>
                            </Snackbar>
                          </CardActions>
                        </Box>
                      </Box>
                    </Card>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={diaOpen}
        onClose={handleDiaClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">删除文章</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            你确定要删除这篇文章吗？此操作无法撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiaClose} color="primary">
            取消
          </Button>
          <Button
            onClick={() => {
              handleDelete(deleteArticleId!);
            }}
            color="primary"
            autoFocus
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountPage;
