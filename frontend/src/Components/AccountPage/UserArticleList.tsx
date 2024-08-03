import React from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useTheme } from '@mui/material/styles';

interface ArticleListProps {
  userArticles: any[];
  handleArticleClick: (id: number) => void;
  handleClickDiaOpen: (id: number) => void;
}

const UserArticleList: React.FC<ArticleListProps> = ({
  userArticles,
  handleArticleClick,
  handleClickDiaOpen,
}) => {
  const theme = useTheme();

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

  return (
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
              image={userArticle.cover || 'https://via.placeholder.com/150'}
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

                <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
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
                  <CommentIcon fontSize="small" sx={{ marginRight: '4px' }} />
                  <Typography
                    variant="body2"
                    color="secondary.main"
                    sx={{ marginRight: '16px' }}
                  >
                    {userArticle.commentsCount}
                  </Typography>
                  <ThumbUpIcon fontSize="small" sx={{ marginRight: '4px' }} />
                  <Typography
                    variant="body2"
                    color="secondary.main"
                    sx={{ marginRight: '16px' }}
                  >
                    {userArticle.likes}
                  </Typography>
                  <Typography variant="body2" color="secondary.main">
                    {new Date(userArticle.createdAt).toLocaleDateString()}
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
                      onClick={() => handleArticleClick(userArticle.id)}
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
                </CardActions>
              </Box>
            </Box>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default UserArticleList;
