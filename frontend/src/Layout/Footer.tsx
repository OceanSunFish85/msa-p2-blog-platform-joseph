// src/components/Footer.tsx
import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        width: '100%',
        position: 'fixed',
        bottom: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2">
        hotcoffee 2020 copyright all rights reserved
      </Typography>
      <Box
        sx={{
          display: 'flex',
          '& > *': {
            mx: 0.5,
          },
        }}
      >
        <IconButton
          aria-label="twitter"
          color="inherit"
          component={Link}
          href="https://twitter.com"
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          aria-label="instagram"
          color="inherit"
          component={Link}
          href="https://instagram.com"
        >
          <InstagramIcon />
        </IconButton>
        <IconButton
          aria-label="linkedin"
          color="inherit"
          component={Link}
          href="https://linkedin.com"
        >
          <LinkedInIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
