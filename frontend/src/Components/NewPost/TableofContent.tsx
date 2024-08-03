import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface TableOfContentProps {
  headings: Array<{ id: string; text: string; level: number }>;
  handleHeadingClick: (id: string) => void;
}

const TableOfContent: React.FC<TableOfContentProps> = ({
  headings,
  handleHeadingClick,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'sticky',
        top: '100px',
        padding: 2,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderRadius: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6">Table of Content</Typography>
      <List>
        {headings.map((heading) => (
          <ListItem
            button
            key={heading.id}
            onClick={() => handleHeadingClick(heading.id)}
            sx={{
              pl: heading.level * 2, // Set padding left based on heading level
              typography: `h${Math.min(6, heading.level + 2)}`, // Set typography based on heading level
            }}
          >
            <ListItemText primary={heading.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TableOfContent;
