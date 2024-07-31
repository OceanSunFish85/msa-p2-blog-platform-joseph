import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
} from '@mui/material';
import headSection from '../assets/Head-section.png';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useTheme } from '@mui/material/styles';
import { useAppDispatch } from '../store/useAppDispatch';
import { useAppSelector } from '../store/useAppSelecter';
import { getArticlesThunk } from '../store/slices/article';
import { ArticleSortOption } from '../Models/Article';

const categories = [
  { value: '', label: '全部分类' },
  { value: 'technology', label: '技术' },
  { value: 'development', label: '开发' },
  { value: 'management', label: '管理' },
];

const HomePage: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [category, setCategory] = useState<string>('');
  const dispatch = useAppDispatch();
  const articles = useAppSelector((state) => state.article.articles);
  const theme = useTheme();

  useEffect(() => {
    dispatch(
      getArticlesThunk({
        pageNumber: 1,
        pageSize: 10,
        sortBy: ArticleSortOption.Date,
        sortOrder: 'desc',
      })
    );
  }, [dispatch]);

  useEffect(() => {
    console.log('articles:', articles);
  }, [articles]);

  const handleTabOnChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setTabValue(newValue);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value);
  };

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        padding: theme.spacing(4),
      }}
    >
      <Container maxWidth="xl">
        {/* 第一行 */}
        <Grid
          container
          spacing={2}
          sx={{ minHeight: '20vh', display: 'flex', alignItems: 'center' }}
          paddingTop={10}
        >
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Box sx={{ p: 2, height: '100%', width: '100%' }}>
              <Card sx={{ backgroundColor: theme.palette.background.default }}>
                <Grid container>
                  <Grid item xs={12} md={8}>
                    <CardMedia
                      component="img"
                      height="400"
                      image={headSection}
                      alt="Featured Article"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <CardContent>
                      <Typography variant="h5" component="div" textAlign="left">
                        Featured Article Title
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        textAlign="left"
                      >
                        This is a brief description or excerpt of the featured
                        article, giving readers an overview of the main content.
                      </Typography>
                    </CardContent>
                    <Box display="flex" justifyContent="flex-end" padding="8px">
                      <CardActions>
                        <Button size="small" color="secondary">
                          Read More
                        </Button>
                      </CardActions>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* 第二行 */}
        <Grid
          container
          spacing={2}
          sx={{ minHeight: '50vh', display: 'flex', alignItems: 'left' }}
        >
          {/* 第一列 */}
          <Grid
            item
            container
            xs={8}
            spacing={2}
            sx={{ textAlign: 'center' }}
            marginRight={1}
          >
            {/* 第一行 */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <AppBar
                  position="static"
                  color="primary"
                  sx={{ boxShadow: 'none' }}
                >
                  <Toolbar>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabOnChange}
                      sx={{
                        flexGrow: 1,
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
                      <Tab label="全部" />
                      <Tab label="关注" />
                    </Tabs>
                    <Select
                      value={category}
                      onChange={handleCategoryChange}
                      displayEmpty
                      inputProps={{ 'aria-label': '分类' }}
                      sx={{
                        ml: 2,
                        '& .MuiSelect-select': {
                          padding: '8px 32px 8px 8px',
                          backgroundColor: theme.palette.background.default,
                          borderRadius: theme.shape.borderRadius,
                          '&:focus': {
                            backgroundColor: theme.palette.background.default,
                          },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiSvgIcon-root': {
                          color: theme.palette.text.primary,
                        },
                      }}
                      variant="outlined"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: theme.palette.background.default,
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
                          },
                        },
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <IconButton color="inherit" onClick={handleFilterClick}>
                      <FilterListIcon />
                    </IconButton>
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
                      <MenuItem onClick={handleFilterClose}>按评论</MenuItem>
                      <MenuItem onClick={handleFilterClose}>按阅读量</MenuItem>
                      <MenuItem onClick={handleFilterClose}>
                        按发布时间
                      </MenuItem>
                    </Menu>
                  </Toolbar>
                </AppBar>
                <Box sx={{ p: 2, height: '100%' }}>
                  <List>
                    {articles.map((article) => (
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
                            sx={{ width: 200, height: 150 }}
                            image={article.cover}
                            alt={article.title}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              width: '100%',
                            }}
                          >
                            <CardContent>
                              <Tooltip title={article.title} placement="top">
                                <Typography variant="h6" component="div">
                                  {truncateText(article.title, 30)}
                                </Typography>
                              </Tooltip>
                              <Tooltip title={article.summary} placement="top">
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {truncateText(article.summary, 100)}
                                </Typography>
                              </Tooltip>
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
                                  {article.views}
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
                                  {article.commentsCount}
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
                                  {article.likes}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="secondary.main"
                                >
                                  {new Date(
                                    article.createdAt
                                  ).toLocaleDateString()}
                                </Typography>
                              </Box>
                              <CardActions>
                                <Button size="small" color="secondary">
                                  Read More
                                </Button>
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
          </Grid>

          <Divider orientation="vertical" flexItem />

          {/* 第二列 */}
          <Grid item xs={3} sx={{ textAlign: 'center' }} marginLeft={6}>
            <Typography variant="h2" gutterBottom>
              这片区域我还不知道放置什么内容
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
