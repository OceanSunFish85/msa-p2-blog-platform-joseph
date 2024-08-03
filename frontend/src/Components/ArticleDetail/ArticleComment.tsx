import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  useTheme,
  InputAdornment,
  Popover,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { incrementCommentsCount } from '../../Services/ArticleService';
import {
  getCommentsByArticleIdThunk,
  likeCommentThunk,
  dislikeCommentThunk,
  addCommentThunk,
} from '../../store/slices/comment';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/useAppDispatch';
import { useAppSelector } from '../../store/useAppSelecter';

const ArticleComment: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { comments, loading, error } = useAppSelector(
    (state: RootState) => state.comment
  );

  const selectedArticleId = localStorage.getItem('selectedArticleId');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const [commentContent, setCommentContent] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const commentListRef = useRef<HTMLDivElement>(null);

  const [showPicker, setShowPicker] = useState(false);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (selectedArticleId) {
      dispatch(getCommentsByArticleIdThunk(Number(selectedArticleId)));
    }
  }, [dispatch, selectedArticleId]);

  useEffect(() => {
    if (commentListRef.current) {
      commentListRef.current.scrollTop = commentListRef.current.scrollHeight;
    }
  }, [comments]);

  const handleLike = (commentId: number) => {
    dispatch(likeCommentThunk(commentId));
  };

  const handleDislike = (commentId: number) => {
    dispatch(dislikeCommentThunk(commentId));
  };

  const handlePickerOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowPicker(true);
  };

  const handlePickerClose = () => {
    setAnchorEl(null);
    setShowPicker(false);
  };

  const handleEmojiClick = (emoji: any) => {
    const cursorPosition = textFieldRef.current?.selectionStart || 0;
    const newMessage =
      commentContent.slice(0, cursorPosition) +
      emoji.native +
      commentContent.slice(cursorPosition);
    setCommentContent(newMessage);
    setShowPicker(false);
  };

  const handleAddComment = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    if (selectedArticleId && commentContent.trim() !== '') {
      dispatch(
        addCommentThunk({
          articleId: Number(selectedArticleId),
          content: commentContent,
        })
      ).then(() => {
        incrementCommentsCount(Number(selectedArticleId));
        setCommentContent('');
        dispatch(getCommentsByArticleIdThunk(Number(selectedArticleId)));
        if (commentListRef.current) {
          commentListRef.current.scrollTop =
            commentListRef.current.scrollHeight;
        }
      });
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const commentList = Array.isArray(comments) ? comments : [];

  return (
    <Box
      sx={{
        border: 1,
        borderColor: theme.palette.divider,
        padding: 2,
        borderRadius: 1,
        minHeight: '400px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h6">Comments</Typography>
      <Box
        ref={commentListRef}
        sx={{
          overflowY: 'auto',
          flexGrow: 1,
          paddingRight: 2,
        }}
      >
        {commentList.length === 0 ? (
          <Typography>No More Comment</Typography>
        ) : (
          commentList.map((comment) => (
            <Card
              key={comment.id}
              sx={{ mb: 2, bgcolor: theme.palette.background.default }}
            >
              <CardHeader
                avatar={<Avatar src={comment.authorAvatar} />}
                title={comment.authorName}
                subheader={new Date(comment.createdAt).toLocaleString()}
                action={
                  <>
                    <IconButton onClick={() => handleLike(comment.id)}>
                      <ThumbUpIcon />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {comment.likes}
                      </Typography>
                    </IconButton>
                    <IconButton onClick={() => handleDislike(comment.id)}>
                      <ThumbDownIcon />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {comment.dislikes}
                      </Typography>
                    </IconButton>
                  </>
                }
              />
              <CardContent>
                <Typography variant="body2">{comment.content}</Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        <TextField
          label="Add a comment"
          fullWidth
          multiline
          minRows={3}
          variant="outlined"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          disabled={!isAuthenticated}
          sx={{ mb: 1 }}
          inputRef={textFieldRef}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handlePickerOpen}>😀</IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Popover
          open={showPicker}
          anchorEl={anchorEl}
          onClose={handlePickerClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Picker data={data} onEmojiSelect={handleEmojiClick} />
        </Popover>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          disabled={!isAuthenticated || commentContent.trim() === ''}
        >
          Comment
        </Button>
        {!isAuthenticated && showLoginPrompt && (
          <Alert severity="warning" sx={{ mt: 2, alignSelf: 'flex-start' }}>
            Please Login !
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default ArticleComment;
