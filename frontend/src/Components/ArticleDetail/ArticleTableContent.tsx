import React from 'react';
import {
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

const ArticleTableContent: React.FC<{
  headings: Array<{ id: string; text: string; level: number }>;
}> = ({ headings }) => {
  const renderHeadings = (
    headings: Array<{ id: string; text: string; level: number }>
  ) => {
    return headings.map((heading) => (
      <ListItem
        key={heading.id}
        button
        component="a"
        href={`#${heading.id}`}
        sx={{
          pl: (heading.level - 1) * 2,
          typography: `h${Math.min(6, heading.level + 2)}`,
        }}
      >
        <ListItemText primary={heading.text} />
      </ListItem>
    ));
  };

  return (
    <Card
      sx={{
        padding: 2,
        textAlign: 'left',
        width: '100%',
        backgroundColor: 'background.default',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Table of Content
      </Typography>
      <Divider />
      <CardContent>
        <List>{renderHeadings(headings)}</List>
      </CardContent>
    </Card>
  );
};

export default ArticleTableContent;
