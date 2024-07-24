// src/pages/DetailPage.tsx
import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';

const mockArticle = {
  title: 'Understanding React Hooks',
  content: `
    <p>React hooks are functions that let you use state and lifecycle features in function components. They were introduced in React 16.8.</p>
    <p>Here are some commonly used hooks:</p>
    <ul>
      <li><strong>useState:</strong> Adds state to a function component.</li>
      <li><strong>useEffect:</strong> Adds side-effects to a function component.</li>
      <li><strong>useContext:</strong> Lets you use context in a function component.</li>
    </ul>
    <p>In this article, we will deep dive into each of these hooks and explore their usage and benefits.</p>
    <h2>useState</h2>
    <p>The useState hook lets you add state to function components. Here’s a simple example:</p>
    <pre><code>const [count, setCount] = useState(0);</code></pre>
    <p>In the above example, count is the state variable and setCount is the function to update the state.</p>
    <h2>useEffect</h2>
    <p>The useEffect hook lets you perform side effects in function components. Here’s a simple example:</p>
    <pre><code>useEffect(() => { document.title = 'You clicked count times'; }, [count]);</code></pre>
    <p>In the above example, the document title will be updated whenever the count changes.</p>
  `,
  author: {
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/100',
    bio: 'A passionate developer and writer.',
  },
  tableOfContents: [
    { text: 'Introduction', id: '#introduction' },
    { text: 'useState', id: '#useState' },
    { text: 'useEffect', id: '#useEffect' },
    { text: 'useContext', id: '#useContext' },
  ],
};

const DetailPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        padding: theme.spacing(4),
        marginTop: theme.spacing(8), // 设置 marginTop 以放置 header 遮挡
        display: 'flex',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={2} border={1}>
          {/* 左列 - 作者信息 */}
          <Grid item xs={12} md={2}>
            <Box sx={{ textAlign: 'center', padding: theme.spacing(2) }}>
              <Avatar
                sx={{ width: 100, height: 100, margin: 'auto' }}
                src={mockArticle.author.avatar}
                alt={mockArticle.author.name}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {mockArticle.author.name}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'left' }}>
                {mockArticle.author.bio}
              </Typography>
            </Box>
          </Grid>

          {/* 分割线 */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ marginX: theme.spacing(2) }}
          />

          {/* 中间列 - 文章主题 */}
          <Grid item xs={12} md={7}>
            <Box sx={{ padding: theme.spacing(2) }}>
              <Typography variant="h4" gutterBottom>
                {mockArticle.title}
              </Typography>
              <Box
                dangerouslySetInnerHTML={{ __html: mockArticle.content }}
                sx={{
                  '& h2': { marginTop: theme.spacing(4) },
                  '& pre': {
                    backgroundColor: theme.palette.background.paper,
                    padding: theme.spacing(2),
                    borderRadius: theme.shape.borderRadius,
                    overflowX: 'auto',
                  },
                }}
              />
            </Box>
          </Grid>

          {/* 分割线 */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ marginX: theme.spacing(2) }}
          />

          {/* 右列 - 目录 */}
          <Grid item xs={12} md={2}>
            <Box sx={{ padding: theme.spacing(2) }}>
              <Typography variant="h6">Table of Contents</Typography>
              <List>
                {mockArticle.tableOfContents.map((item) => (
                  <ListItem
                    button
                    component="a"
                    href={item.id}
                    key={item.id}
                    sx={{ padding: theme.spacing(1) }}
                  >
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DetailPage;
