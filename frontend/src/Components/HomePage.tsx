// src/pages/HomePage.tsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Divider, Grid } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      {/* 第一行 */}
      <Grid
        container
        spacing={2}
        sx={{ minHeight: '40vh', display: 'flex', alignItems: 'center' }} // 第一行垂直居中
      >
        {/* 第一列 */}
        <Grid container xs={8} sx={{ textAlign: 'center' }} marginRight={6}>
          {/* 第一行 */}
          <Grid item spacing={2}>
            <Typography variant="h2" gutterBottom>
              欢迎来到我的博客
            </Typography>
            <Typography variant="h5" gutterBottom>
              这是一个用于记录和分享技术的博客网站，每个人都可以展示自己卓越的技能
            </Typography>
            <Box
              component="img"
              src="/path/to/your/image.png" // 替换为你的图片路径
              alt="Hero"
              sx={{
                width: '100%',
                maxWidth: '600px', // 控制图片最大宽度
                mt: 2,
              }}
            />
          </Grid>
          {/* 第二行 */}
          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2, border: '1px solid #ccc' }}>
                <Typography variant="h6">长久以来</Typography>
                <Typography variant="body1">
                  这是一个示例文本，用于展示博客文章的简短描述。
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2, border: '1px solid #ccc' }}>
                <Typography variant="h6">长久以来</Typography>
                <Typography variant="body1">
                  这是一个示例文本，用于展示博客文章的简短描述。
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2, border: '1px solid #ccc' }}>
                <Typography variant="h6">长久以来</Typography>
                <Typography variant="body1">
                  这是一个示例文本，用于展示博客文章的简短描述。
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Divider orientation="vertical" flexItem />
        {/* 添加分割线 */}
        {/* 第二列 */}
        <Grid
          item
          xs={3}
          sx={{ textAlign: 'center' }}
          marginLeft={6}
          border={1}
        >
          <Typography variant="h2" gutterBottom>
            欢迎来到我的博客
          </Typography>
          <Typography variant="h5" gutterBottom>
            这是一个用于记录和分享技术的博客网站，每个人都可以展示自己卓越的技能
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
