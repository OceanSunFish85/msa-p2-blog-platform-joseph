// FeaturedArticle.tsx
import React from 'react';
import {
  Card,
  CardMedia,
  Grid,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Skeleton,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import NearMeIcon from '@mui/icons-material/NearMe';

const FeaturedArticle = ({
  article,
  isLoading,
  handleArticleClick,
}: {
  article: any;
  isLoading: boolean;
  handleArticleClick: (id: number) => void;
}) => {
  const theme = useTheme();
  return (
    <Box sx={{ p: 2, height: '100%', width: '100%' }}>
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          animation="wave"
          sx={{
            bgcolor: theme.palette.background.default,
            '&::before': {
              bgcolor: theme.palette.grey[400],
            },
            '&::after': {
              bgcolor: theme.palette.grey[200],
            },
          }}
        />
      ) : (
        article && (
          <Card sx={{ backgroundColor: theme.palette.background.default }}>
            <Grid container>
              <Grid item xs={12} md={8}>
                <CardMedia
                  component="img"
                  height="400"
                  image={article.cover}
                  alt="Featured Article"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleArticleClick(article.id)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CardContent sx={{ height: '80%' }}>
                  <Typography
                    variant="h5"
                    component="div"
                    textAlign="left"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleArticleClick(article.id)}
                  >
                    {article.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    textAlign="left"
                  >
                    {article.summary}
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
                      sx={{
                        marginRight: '8px',
                        color: theme.palette.secondary.main,
                      }}
                    >
                      {article.views}
                    </Typography>
                    <CommentIcon fontSize="small" sx={{ marginRight: '4px' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        marginRight: '8px',
                        color: theme.palette.secondary.main,
                      }}
                    >
                      {article.commentsCount}
                    </Typography>
                    <ThumbUpIcon fontSize="small" sx={{ marginRight: '4px' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        marginRight: '8px',
                        color: theme.palette.secondary.main,
                      }}
                    >
                      {article.likes}
                    </Typography>
                    <NearMeIcon fontSize="small" sx={{ marginRight: '4px' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        marginRight: '8px',
                        color: theme.palette.secondary.main,
                      }}
                    >
                      {new Date(article.createdAt).toLocaleDateString()}
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
              </Grid>
            </Grid>
          </Card>
        )
      )}
    </Box>
  );
};

export default FeaturedArticle;
