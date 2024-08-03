import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import FeaturedArticle from './FeaturedArticle';
import ArticleList from './ArticleList';
import PaginationControls from './PaginationControls';
import { ArticleSortOption } from '../../Models/enums/ArticlesSortOption';
import { useAppSelector } from '../../store/useAppSelecter';
import { useAppDispatch } from '../../store/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../../store/slices/user';
import {
  getArticlesThunk,
  getTopArticlesThunk,
  setSelectedArticleId,
} from '../../store/slices/article';
import { incrementArticleViewCount } from '../../Services/ArticleService';

import ListHeaderBar from './ListHeaderBar';
import ChatComponent from './CommunicateCentre';

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile());
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
    _event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setTabValue(newValue);
  };

  const handleArticleClick = (id: number) => {
    dispatch(setSelectedArticleId(id));
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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
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
        {!isMobile ? (
          <Grid
            container
            spacing={2}
            sx={{ minHeight: '20vh', display: 'flex', alignItems: 'center' }}
            paddingTop={10}
          >
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <FeaturedArticle
                article={topArticles[0]}
                isLoading={isLoading}
                handleArticleClick={handleArticleClick}
              />
            </Grid>
          </Grid>
        ) : null}

        <Divider sx={{ my: 3 }} />

        <Grid
          container
          spacing={2}
          sx={{ minHeight: '50vh', display: 'flex', alignItems: 'left' }}
        >
          <Grid
            item
            container
            xs={isMobile ? 12 : 8}
            spacing={2}
            sx={{ textAlign: 'center' }}
            marginRight={1}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ListHeaderBar
                  tabValue={tabValue}
                  sortOrder={sortOrder}
                  filterAnchorEl={filterAnchorEl}
                  handleTabOnChange={handleTabOnChange}
                  handleSortOrderClick={handleSortOrderClick}
                  handleFilterClick={handleFilterClick}
                  handleFilterClose={handleFilterClose}
                  handleSortOptionClick={handleSortOptionClick}
                />

                <Box sx={{ p: 2, height: '100%' }}>
                  <ArticleList
                    isMobile={isMobile}
                    articles={articles}
                    handleArticleClick={handleArticleClick}
                  />
                </Box>
              </Grid>
              <PaginationControls
                currentPage={currentPage}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                articlesLength={articles.length}
              />
            </Grid>
          </Grid>

          <Divider orientation="vertical" flexItem />

          {!isMobile ? (
            <Grid item xs={3} sx={{ textAlign: 'center' }}>
              <Box flexGrow={1} width={430}>
                <ChatComponent />
              </Box>
            </Grid>
          ) : (
            <>
              <IconButton
                sx={{
                  position: 'fixed',
                  bottom: theme.spacing(2),
                  right: theme.spacing(2),
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.background.default,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
                onClick={handleDrawerToggle}
              >
                <ChatIcon />
              </IconButton>
              <Drawer
                anchor="bottom"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                sx={{
                  '& .MuiDrawer-paper': {
                    height: '70%',
                  },
                }}
              >
                <Box sx={{ p: 2 }}>
                  <ChatComponent />
                </Box>
              </Drawer>
            </>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
