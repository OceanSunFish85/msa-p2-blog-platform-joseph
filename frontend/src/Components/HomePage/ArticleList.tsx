import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CardActions,
  Button,
  List,
  ListItem,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import NearMeIcon from '@mui/icons-material/NearMe';

const ArticleList = ({
  articles,
  handleArticleClick,
  isMobile,
}: {
  articles: any[];
  handleArticleClick: (id: number) => void;
  isMobile: boolean;
}) => {
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <List>
      {articles.map((article) => (
        <ListItem
          key={article.id}
          onClick={isMobile ? () => handleArticleClick(article.id) : undefined}
          sx={{ cursor: isMobile ? 'pointer' : 'default' }}
        >
          <Card
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              width: '100%',
              backgroundColor: 'background.default',
            }}
          >
            <CardMedia
              component="img"
              sx={{
                width: isMobile ? '100%' : 200,
                height: isMobile ? 'auto' : 166,
                cursor: !isMobile ? 'pointer' : 'default',
              }}
              image={article.cover}
              alt={article.title}
              onClick={
                !isMobile ? () => handleArticleClick(article.id) : undefined
              }
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
                  <Typography variant="body2" color="text.primary">
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
                  <CommentIcon fontSize="small" sx={{ marginRight: '4px' }} />
                  <Typography
                    variant="body2"
                    color="secondary.main"
                    sx={{ marginRight: '16px' }}
                  >
                    {article.commentsCount}
                  </Typography>
                  <ThumbUpIcon fontSize="small" sx={{ marginRight: '4px' }} />
                  <Typography
                    variant="body2"
                    color="secondary.main"
                    sx={{ marginRight: '16px' }}
                  >
                    {article.likes}
                  </Typography>
                  {!isMobile && (
                    <>
                      <NearMeIcon
                        fontSize="small"
                        sx={{ marginRight: '4px' }}
                      />
                      <Typography variant="body2" color="secondary.main">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </Typography>
                    </>
                  )}
                </Box>
                {!isMobile && (
                  <CardActions>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArticleClick(article.id);
                      }}
                    >
                      Read More
                    </Button>
                  </CardActions>
                )}
              </Box>
            </Box>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default ArticleList;
