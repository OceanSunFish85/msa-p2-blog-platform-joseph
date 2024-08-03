import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import { ArticleSortOption } from '../../Models/enums/ArticlesSortOption';
import { ArticleStatus } from '../../Models/enums/ArticleStatus';
import {
  getUserArticlesThunk,
  setSelectedArticleId,
  deleteArticleThunk,
} from '../../store/slices/article';
import { changePasswordThunk } from '../../store/slices/auth';
import { uploadAvatarThunk } from '../../store/slices/upload';
import { updateUserInfoThunk, fetchUserProfile } from '../../store/slices/user';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/useAppDispatch';
import { useAppSelector } from '../../store/useAppSelecter';
import Dialogs from './Dialogs';
import PaginationControls from './PaginationControl';
import UserProfileCard from './UserProfileCard';
import AccountSnack from './AccountSnack';
import UserArticleList from './UserArticleList';

const AccountPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);
  const userArticles = useAppSelector(
    (state: RootState) => state.article.userArticles
  );
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState<ArticleStatus>(
    ArticleStatus.Published
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const userAvatar = localStorage.getItem('userAvatar');
  const userBio = localStorage.getItem('userBio');
  const userName = localStorage.getItem('username');

  const [diaOpen, setDiaOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortOption, setSortOption] = useState<ArticleSortOption>(
    ArticleSortOption.Date
  );
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState('');
  const [debouncedSearchKey, setDebouncedSearchKey] = useState(searchKey);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [deleteArticleId, setDeleteArticleId] = useState<number | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const { isLoading, error } = useAppSelector((state: RootState) => state.auth);

  const [userEditOpen, setUserEditOpen] = useState(false);
  const [username, setUsername] = useState(userName || '');
  const [bio, setBio] = useState(userBio || '');

  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      setDebouncedSearchKey(searchKey);
    }, 500);
    setTimeoutId(id);
  }, [searchKey]);

  useEffect(() => {
    dispatch(
      getUserArticlesThunk({
        searchKey: debouncedSearchKey || '',
        status: tabValue,
        pageNumber: currentPage,
        pageSize: 10,
        sortBy: sortOption,
        sortOrder: sortOrder,
      })
    );
  }, [
    dispatch,
    tabValue,
    sortOption,
    sortOrder,
    debouncedSearchKey,
    currentPage,
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleArticleClick = (id: number) => {
    dispatch(setSelectedArticleId(id));
    navigate(`/editPost`);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const handleTabChange = (
    _event: React.ChangeEvent<{}>,
    newValue: ArticleStatus
  ) => {
    setTabValue(newValue);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        await dispatch(uploadAvatarThunk(selectedFile)).unwrap();
        const avatarUrl = localStorage.getItem('userAvatar');

        await dispatch(updateUserInfoThunk({ Avatar: avatarUrl })).unwrap();
        await dispatch(fetchUserProfile());

        handleClose();
        setSnackbarMessage('Avatar uploaded successfully!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }
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

  const handleClickDiaOpen = (id: number) => {
    setDeleteArticleId(id);
    setDiaOpen(true);
  };

  const handleDiaClose = () => {
    setDiaOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteArticleThunk(id));
      handleDiaClose();
      setSnackbarMessage('Article deleted successfully!');
      setSnackbarOpen(true);
      dispatch(
        getUserArticlesThunk({
          searchKey: debouncedSearchKey || '',
          status: tabValue,
          pageNumber: 1,
          pageSize: 10,
          sortBy: sortOption,
          sortOrder: sortOrder,
        })
      );
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleClickChangePasswordOpen = () => {
    setChangePasswordOpen(true);
  };

  const handleChangePasswordClose = () => {
    setChangePasswordOpen(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleChangePassword = () => {
    dispatch(changePasswordThunk({ currentPassword, newPassword })).then(() => {
      handleChangePasswordClose();
      navigate('/login');
    });
  };

  const handleUserEditOpen = () => {
    setUserEditOpen(true);
  };

  const handleUserEditClose = () => {
    setUserEditOpen(false);
  };

  const handleUserEdit = async () => {
    try {
      await dispatch(
        updateUserInfoThunk({ UserName: username, Bio: bio })
      ).unwrap();
      await dispatch(fetchUserProfile());

      handleUserEditClose();
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
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
        marginTop: theme.spacing(8),
        display: 'flex',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={2} alignItems="flex-start" minHeight="80vh">
          <Grid item xs={12} md={4}>
            <Box sx={{ padding: theme.spacing(2) }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <UserProfileCard
                      user={user}
                      userAvatar={userAvatar}
                      userBio={userBio}
                      userName={userName}
                      handleClickOpen={handleClickOpen}
                      handleUserEditOpen={handleUserEditOpen}
                      handleClickChangePasswordOpen={
                        handleClickChangePasswordOpen
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Divider orientation="vertical" flexItem />

          <Grid item xs={12} md={7}>
            <Box sx={{ padding: theme.spacing(2) }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6">Article Management</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background.default,
                    borderRadius: '50px',
                    border: `1px solid ${theme.palette.primary.main}`,
                    padding: theme.spacing(0.5),
                    overflow: 'hidden',
                    height: '36px',
                  }}
                >
                  <InputBase
                    placeholder="Search..."
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={handleSearchChange}
                    sx={{ marginLeft: theme.spacing(1), flex: 1 }}
                  />
                  <IconButton
                    type="submit"
                    sx={{ p: '10px' }}
                    color="secondary"
                  >
                    <SearchIcon />
                  </IconButton>
                </Box>
              </Box>
              <Divider></Divider>

              <AppBar
                position="static"
                sx={{ marginTop: theme.spacing(2), boxShadow: 'none' }}
                color="primary"
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                      '& .MuiTabs-indicator': {
                        backgroundColor: theme.palette.secondary.main,
                      },
                      '& .MuiTab-root': {
                        color: 'inherit',
                        '&.Mui-selected': {
                          color: theme.palette.secondary.main,
                        },
                      },
                    }}
                  >
                    {Object.values(ArticleStatus).map((status) => (
                      <Tab
                        label={status === 'Archived' ? 'Private' : status}
                        value={status}
                        key={status}
                      />
                    ))}
                  </Tabs>
                  <Box>
                    <IconButton
                      sx={{ color: theme.palette.secondary.main }}
                      onClick={handleSortOrderClick}
                    >
                      {sortOrder === 'asc' ? (
                        <ArrowUpward />
                      ) : (
                        <ArrowDownward />
                      )}
                    </IconButton>
                    <IconButton
                      sx={{ color: theme.palette.secondary.main }}
                      onClick={handleFilterClick}
                    >
                      <FilterListIcon />
                    </IconButton>
                  </Box>
                </Box>
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
              </AppBar>
              <UserArticleList
                userArticles={userArticles}
                handleArticleClick={handleArticleClick}
                handleClickDiaOpen={handleClickDiaOpen}
              />
              <PaginationControls
                currentPage={currentPage}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                userArticlesLength={userArticles.length}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Dialogs
        open={open}
        onClose={handleClose}
        selectedFile={selectedFile}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
        deleteOpen={diaOpen}
        deleteClose={handleDiaClose}
        deleteId={deleteArticleId}
        onDelete={handleDelete}
        passwordOpen={changePasswordOpen}
        passwordClose={handleChangePasswordClose}
        currentPassword={currentPassword}
        newPassword={newPassword}
        onPasswordChange={(type, value) => {
          if (type === 'current') setCurrentPassword(value);
          if (type === 'new') setNewPassword(value);
        }}
        onPasswordSubmit={handleChangePassword}
        isLoading={isLoading}
        error={error}
        editOpen={userEditOpen}
        editClose={handleUserEditClose}
        username={username}
        bio={bio}
        onUserInfoChange={(type, value) => {
          if (type === 'username') setUsername(value);
          if (type === 'bio') setBio(value);
        }}
        onUserInfoSubmit={handleUserEdit}
      />
      <AccountSnack
        snackbarOpen={snackbarOpen}
        snackbarMessage={snackbarMessage}
        handleSnackbarClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default AccountPage;
