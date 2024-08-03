import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import { useTheme } from '@mui/material/styles';

interface UserProfileCardProps {
  user: any;
  userAvatar: string | null;
  userBio: string | null;
  userName: string | null;
  handleClickOpen: () => void;
  handleUserEditOpen: () => void;
  handleClickChangePasswordOpen: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  userAvatar,
  userBio,
  userName,
  handleClickOpen,
  handleUserEditOpen,
  handleClickChangePasswordOpen,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: '80%',
        margin: 'auto',
        mt: 4,
        bgcolor: theme.palette.background.default,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              cursor: 'pointer',
              border: `2px solid ${theme.palette.background.paper}`,
            }}
            src={
              user?.avatar || userAvatar || 'https://via.placeholder.com/100'
            }
            alt="User Avatar"
            onClick={handleClickOpen}
          />
        </Box>
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          {user?.userName || userName}
        </Typography>
        <Typography variant="body1" align="center">
          {user?.bio || userBio}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Tooltip title="Edit Profile" arrow>
            <IconButton
              onClick={handleUserEditOpen}
              sx={{
                boxShadow: 'none',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.background.default,
                },
                '&:not(:last-child)::after': {
                  marginLeft: 2,
                  marginRight: 2,
                  color: theme.palette.text.secondary,
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Password" arrow>
            <IconButton
              sx={{
                boxShadow: 'none',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.background.default,
                },
                '&:not(:last-child)::after': {
                  marginLeft: 2,
                  marginRight: 2,
                  color: theme.palette.text.secondary,
                },
              }}
              onClick={handleClickChangePasswordOpen}
            >
              <LockIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default UserProfileCard;
