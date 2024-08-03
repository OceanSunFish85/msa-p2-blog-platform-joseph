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
  Skeleton,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { useTheme } from '@mui/material/styles';
import { useAppDispatch } from '../store/useAppDispatch';
import { useAppSelector } from '../store/useAppSelecter';
import {
  getArticlesThunk,
  getTopArticlesThunk,
  setSelectedArticleId,
} from '../store/slices/article';
import { ArticleSortOption } from '../Models/Article';
import { useNavigate } from 'react-router-dom';
import PublicChatRoom from './PublicChatRoom';
import { fetchUserProfile } from '../store/slices/user';
import { incrementArticleViewCount } from '../Services/ArticleService';

const HomePage: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const dispatch = useAppDispatch();
  const articles = useAppSelector((state) => state.article.articles);
  const searchMessage = useAppSelector((state) => state.article.searchMessage);
  const topArticles = useAppSelector((state) => state.article.topArticles);
  const isLoading = useAppSelector((state) => state.article.loading);
  const [searchKey, setSearchKey] = useState<string>(searchMessage ?? '');
  const theme = useTheme();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortOption, setSortOption] = useState<ArticleSortOption>(
    ArticleSortOption.Date
  );
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile());
      console.log('Fetching user profile...');
    } else {
      console.log('No token found');
    }
  }, [token]);

  useEffect(() => {
    dispatch(getTopArticlesThunk());
  }, [dispatch]);

  useEffect(() => {
    setSearchKey(searchMessage);
    dispatch(
      getArticlesThunk({
        pageNumber: currentPage,
        pageSize: 10,
        sortBy: sortOption,
        sortOrder: sortOrder,
        searchKey: searchKey,
      })
    );
  }, [sortOption, sortOrder, dispatch, searchKey, searchMessage, currentPage]);

  const handleTabOnChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setTabValue(newValue);
  };

  const handleArticleClick = (id: number) => {
    dispatch(setSelectedArticleId(id));
    console.log(`Selected Article ID: ${id}`);
    incrementArticleViewCount(id);
    navigate(`/detail`);
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

  const truncateText = (
    text: string | undefined,
    maxLength: number
  ): string => {
    if (!text) {
      return '';
    }
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
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
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={400}
                  animation="wave"
                  sx={{
                    bgcolor: theme.palette.grey[300],
                    '&::before': {
                      bgcolor: theme.palette.grey[400],
                    },
                    '&::after': {
                      bgcolor: theme.palette.grey[200],
                    },
                  }}
                />
              ) : (
                topArticles.length > 0 && (
                  <Card
                    sx={{ backgroundColor: theme.palette.background.default }}
                  >
                    <Grid container>
                      <Grid item xs={12} md={8}>
                        <CardMedia
                          component="img"
                          height="400"
                          image={topArticles[0].cover}
                          alt="Featured Article"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CardContent>
                          <Typography
                            variant="h5"
                            component="div"
                            textAlign="left"
                          >
                            {topArticles[0].title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            textAlign="left"
                          >
                            {topArticles[0].summary}
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
                              color="text.secondary"
                              sx={{ marginRight: '8px' }}
                            >
                              {topArticles[0].views}
                            </Typography>
                            <CommentIcon
                              fontSize="small"
                              sx={{ marginRight: '4px' }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ marginRight: '8px' }}
                            >
                              {topArticles[0].commentsCount}
                            </Typography>
                            <ThumbUpIcon
                              fontSize="small"
                              sx={{ marginRight: '4px' }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ marginRight: '8px' }}
                            >
                              {topArticles[0].likes}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ marginRight: '8px' }}
                            >
                              {new Date(
                                topArticles[0].createdAt
                              ).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <CardActions>
                            <Button
                              size="small"
                              color="secondary"
                              onClick={() =>
                                handleArticleClick(topArticles[0].id)
                              }
                            >
                              Read More
                            </Button>
                          </CardActions>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                )
              )}
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
                    </Tabs>
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
                        Comments
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleSortOptionClick(ArticleSortOption.Views)
                        }
                      >
                        Views
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleSortOptionClick(ArticleSortOption.Likes)
                        }
                      >
                        Likes
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleSortOptionClick(ArticleSortOption.Date)
                        }
                      >
                        Date
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
                            sx={{
                              width: 200,
                              height: 166,
                              cursor: 'pointer',
                            }}
                            image={article.cover}
                            alt={article.title}
                            onClick={() => handleArticleClick(article.id)}
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
                                <Button
                                  size="small"
                                  color="secondary"
                                  onClick={() => handleArticleClick(article.id)}
                                >
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
              {/* Pagination Controls */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={4}
                width="100%"
              >
                <Grid container alignItems="center">
                  <Grid item xs={4} display="flex" justifyContent="flex-start">
                    {currentPage > 1 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePrevPage}
                      >
                        Prev
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={4} display="flex" justifyContent="center">
                    <Typography variant="body1">Page {currentPage}</Typography>
                  </Grid>
                  <Grid item xs={4} display="flex" justifyContent="flex-end">
                    {articles.length === 10 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNextPage}
                      >
                        Next
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Divider orientation="vertical" flexItem />

          {/* 第二列 */}
          <Grid item xs={3} sx={{ textAlign: 'center' }}>
            <Box flexGrow={1} width={430}>
              <PublicChatRoom />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
