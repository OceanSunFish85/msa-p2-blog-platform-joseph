import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  Fab,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import Quill from 'quill';
import { useNavigate } from 'react-router-dom';
import { incrementArticleViewCount } from '../../Services/ArticleService';
import {
  setSelectedArticleId,
  getArticleByIdThunk,
  getAuthorInfoThunk,
} from '../../store/slices/article';
import {
  checkFavoriteThunk,
  addFavoriteThunk,
  removeFavoriteThunk,
} from '../../store/slices/favorite';
import { useAppDispatch } from '../../store/useAppDispatch';
import { useAppSelector } from '../../store/useAppSelecter';
import TableOfContent from '../NewPost/TableofContent';
import ArticleContent from './ArticleContent';
import AuthorInfo from './AuthorInfo';
import ConfirmationDialog from './ConfirmationDialog';
import ArticleTableContent from './ArticleTableContent';
import ArticleDetailSnack from './ArticleDetailSnack';

const DetailPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const articleDetail = useAppSelector((state) => state.article.detail);
  const authorInfo = useAppSelector((state) => state.article.authorInfo);
  const quillRef = useRef<HTMLDivElement | null>(null);
  const [articleId, setArticleId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);
  const isFavorite = useAppSelector((state) => state.favorite.isFavorite);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [tocOpen, setTocOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [isLoginPrompt, setIsLoginPrompt] = useState<boolean>(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const id = localStorage.getItem('selectedArticleId');

    if (id) {
      dispatch(setSelectedArticleId(parseInt(id))); // 确保 id 是数字
      setArticleId(parseInt(id));
    }
    const email = localStorage.getItem('email');
    if (email) {
      setUserEmail(email);
    }
  }, [dispatch]);

  useEffect(() => {
    if (articleId) {
      dispatch(getArticleByIdThunk(articleId));
      dispatch(getAuthorInfoThunk(articleId));
      incrementArticleViewCount(articleId);
    }
  }, [articleId]);

  useEffect(() => {
    if (articleId && userEmail) {
      dispatch(checkFavoriteThunk({ articleId, userEmail }));
    }
  }, [articleId, userEmail]);

  useEffect(() => {
    if (quillRef.current && articleDetail?.htmlContent) {
      const quill = new Quill(quillRef.current, {
        theme: 'bubble',
        readOnly: true,
      });
      quill.clipboard.dangerouslyPasteHTML(articleDetail.htmlContent);

      const headings = Array.from(
        quillRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6')
      ).map((heading, index) => ({
        id: `heading-${index}`,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1)),
      }));
      setHeadings(headings);
    }
  }, [articleDetail]);

  const handleFavoriteClick = () => {
    if (!userEmail) {
      setSnackbarMessage('请先登录');
      setIsLoginPrompt(true);
      setSnackbarOpen(true);
      return;
    }
    if (isFavorite) {
      setConfirmOpen(true);
    } else {
      dispatch(
        addFavoriteThunk({ articleId: articleId!, userEmail: userEmail! })
      ).then(() => {
        setSnackbarMessage('Add Favourite Success !');
        setIsLoginPrompt(false);
        setSnackbarOpen(true);
      });
    }
  };

  const handleConfirmClose = (confirm: boolean) => {
    setConfirmOpen(false);
    if (confirm) {
      dispatch(
        removeFavoriteThunk({ articleId: articleId!, userEmail: userEmail! })
      ).then(() => {
        setSnackbarMessage('Cancel Favourite Success !');
        setIsLoginPrompt(false);
        setSnackbarOpen(true);
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        padding: theme.spacing(4),
        marginTop: theme.spacing(8),
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={2}
            sx={{ textAlign: 'center', padding: theme.spacing(2) }}
          >
            <AuthorInfo authorInfo={authorInfo} />
          </Grid>

          <Grid item xs={12} md={7}>
            <ArticleContent
              articleDetail={articleDetail}
              isFavorite={isFavorite}
              handleFavoriteClick={handleFavoriteClick}
            />
          </Grid>

          <Grid item xs={12} md={3} sx={{ padding: theme.spacing(2) }}>
            <ArticleTableContent headings={headings} />
          </Grid>
        </Grid>
      </Container>
      <ConfirmationDialog open={confirmOpen} onClose={handleConfirmClose} />
      <ArticleDetailSnack
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        isLoginPrompt={isLoginPrompt}
      />
      {isMobile && (
        <>
          <Fab
            color="secondary"
            aria-label="toc"
            sx={{ position: 'fixed', bottom: 80, right: 16 }}
            onClick={() => setTocOpen(true)}
          >
            <MenuBookIcon />
          </Fab>
          <Fab
            color="secondary"
            aria-label="settings"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={() => setSettingsOpen(true)}
          >
            <SettingsIcon />
          </Fab>
        </>
      )}
    </Box>
  );
};

export default DetailPage;
