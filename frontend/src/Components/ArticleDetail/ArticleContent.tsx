import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Box, Typography, useTheme } from '@mui/material';
import { Visibility, Comment, ThumbUp } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import ArticleComment from './ArticleComment';

const ArticleContent: React.FC<{
  articleDetail: any;
  isFavorite: boolean;
  handleFavoriteClick: () => void;
}> = ({ articleDetail, isFavorite, handleFavoriteClick }) => {
  const theme = useTheme();
  const quillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (quillRef.current && articleDetail?.htmlContent) {
      const quill = new Quill(quillRef.current, {
        theme: 'bubble',
        readOnly: true,
      });
      quill.clipboard.dangerouslyPasteHTML(articleDetail.htmlContent);
    }
  }, [articleDetail]);

  return (
    <Box
      sx={{
        padding: theme.spacing(2),
        borderColor: theme.palette.background.default,
        borderRadius: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {articleDetail?.title || ''}
      </Typography>

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
            {new Date(articleDetail?.createdAt).toLocaleDateString() || ''}
          </Typography>
        </Box>
        <IconButton
          color={isFavorite ? 'secondary' : 'default'}
          onClick={handleFavoriteClick}
        >
          <ThumbUp />
        </IconButton>
      </Box>

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
      <Box>
        <ArticleComment />
      </Box>
    </Box>
  );
};

export default ArticleContent;
