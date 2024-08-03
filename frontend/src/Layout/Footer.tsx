// src/Layout/Footer.tsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%', // 宽度为页面宽度
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        display: 'flex',
        justifyContent: 'space-between', // 左右分布
        alignItems: 'center',
      }}
    >
      <Typography variant="body1">
        Joseph 2024 copyright all rights reserved
      </Typography>
      <Box>
        <IconButton aria-label="twitter" color="inherit">
          <TwitterIcon />
        </IconButton>
        <IconButton aria-label="instagram" color="inherit">
          <InstagramIcon />
        </IconButton>
        <IconButton aria-label="linkedin" color="inherit">
          <LinkedInIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
