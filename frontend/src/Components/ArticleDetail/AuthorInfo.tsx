import React from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';

const AuthorInfo: React.FC<{ authorInfo: any }> = ({ authorInfo }) => {
  return (
    <Card
      sx={{
        padding: 2,
        textAlign: 'center',
        width: '100%',
        bgcolor: 'background.default',
      }}
    >
      <CardHeader title="Author Info" />
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
  );
};

export default AuthorInfo;
