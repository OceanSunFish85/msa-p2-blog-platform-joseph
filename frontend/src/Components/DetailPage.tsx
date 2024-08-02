import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Typography,
  useTheme,
} from '@mui/material';
import { ThumbUp, Visibility, Comment } from '@mui/icons-material';
import { useAppDispatch } from '../store/useAppDispatch';
import {
  getArticleByIdThunk,
  getAuthorInfoThunk,
  setSelectedArticleId,
} from '../store/slices/article';
import { useAppSelector } from '../store/useAppSelecter';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // 引入 Quill 的 CSS 样式
import 'quill/dist/quill.bubble.css'; // 引入 Quill 的 Bubble 样式
import {
  addFavoriteThunk,
  checkFavoriteThunk,
  removeFavoriteThunk,
} from '../store/slices/favorite';
import { Link, useNavigate } from 'react-router-dom';
import { incrementArticleViewCount } from '../Services/ArticleService';
import { checkFavorite } from '../Services/FavoriteService';

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
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [isLoginPrompt, setIsLoginPrompt] = useState<boolean>(false);

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

  const renderHeadings = (
    headings: Array<{ id: string; text: string; level: number }>
  ) => {
    return headings.map((heading) => (
      <ListItem
        key={heading.id}
        button
        component="a"
        href={`#${heading.id}`}
        sx={{
          pl: (heading.level - 1) * 2, // Adjust the padding based on the heading level
          typography: `h${Math.min(6, heading.level + 2)}`, // Set typography based on heading level
        }}
      >
        <ListItemText primary={heading.text} />
      </ListItem>
    ));
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        padding: theme.spacing(4),
        marginTop: theme.spacing(8), // 设置 marginTop 以放置 header 遮挡
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {/* 左列 - 作者信息 */}
          <Grid
            item
            xs={12}
            md={2}
            sx={{ textAlign: 'center', padding: theme.spacing(2) }}
          >
            <Card
              sx={{
                padding: theme.spacing(2),
                textAlign: 'center',
                width: '100%',
              }}
            >
              <CardContent>
                <Avatar
                  sx={{ width: 100, height: 100, margin: 'auto' }}
                  src={authorInfo?.avatar || ''}
                  alt={authorInfo?.userName || ''}
                />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {authorInfo?.userName || 'Unknown Author'}
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'left' }}>
                  {authorInfo?.bio || 'No bio available'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 中间列 - 文章主题 */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{ padding: theme.spacing(2), borderColor: 'secondary.main' }}
            >
              {/* 文章标题 */}
              <Typography variant="h4" gutterBottom>
                {articleDetail?.title || ''}
              </Typography>

              {/* 文章信息 */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2, backgroundColor: theme.palette.background.paper }}
              >
                <Box display="flex" alignItems="center">
                  <Visibility sx={{ marginRight: '4px' }} color="secondary" />
                  <Typography
                    variant="body2"
                    color="secondary"
                    sx={{ marginRight: '16px' }}
                  >
                    {articleDetail?.views || 0}
                  </Typography>
                  <Comment sx={{ marginRight: '4px' }} />
                  <Typography
                    variant="body2"
                    color="secondary"
                    sx={{ marginRight: '16px' }}
                  >
                    {articleDetail?.commentsCount || 0}
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    {new Date(articleDetail?.createdAt).toLocaleDateString() ||
                      ''}
                  </Typography>
                </Box>
                <IconButton
                  color={isFavorite ? 'secondary' : 'default'}
                  onClick={handleFavoriteClick}
                >
                  <ThumbUp />
                </IconButton>
              </Box>

              {/* 文章内容 */}
              <Box
                sx={{
                  maxWidth: '100%',
                  overflow: 'auto',
                  '& h2': { marginTop: theme.spacing(4) },
                  '& pre': {
                    backgroundColor: theme.palette.background.paper,
                    padding: theme.spacing(2),
                    borderRadius: theme.shape.borderRadius,
                    overflowX: 'auto',
                  },
                }}
              >
                <div ref={quillRef} />
              </Box>
            </Box>
          </Grid>

          {/* 右列 - 目录 */}
          <Grid item xs={12} md={3} sx={{ padding: theme.spacing(2) }}>
            <Card
              sx={{
                padding: theme.spacing(2),
                textAlign: 'left',
                width: '100%',
                backgroundColor: theme.palette.background.default,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Table of Content
              </Typography>
              <Divider />
              <CardContent>
                <List>{renderHeadings(headings)}</List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={confirmOpen}
        onClose={() => handleConfirmClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'取消收藏'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            你确定要取消收藏这篇文章吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmClose(false)} color="primary">
            否
          </Button>
          <Button
            onClick={() => handleConfirmClose(true)}
            color="primary"
            autoFocus
          >
            是
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={handleSnackbarClose}
        sx={{
          mt: 8,
          bgcolor: theme.palette.secondary.main,
          opacity: 0.9,
          borderRadius: 1,
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
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
          {isLoginPrompt ? (
            <Link
              to="/login"
              style={{
                color: theme.palette.background.default,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={() => setSnackbarOpen(false)}
            >
              Please Login
            </Link>
          ) : (
            snackbarMessage
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DetailPage;
