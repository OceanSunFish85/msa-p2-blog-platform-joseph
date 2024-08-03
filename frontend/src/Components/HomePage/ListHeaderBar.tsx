// ListHeaderBar.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  Divider,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { ArticleSortOption } from '../../Models/enums/ArticlesSortOption';

interface ListHeaderBarProps {
  tabValue: number;
  sortOrder: 'asc' | 'desc';
  filterAnchorEl: HTMLElement | null;
  handleTabOnChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
  handleSortOrderClick: () => void;
  handleFilterClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleFilterClose: () => void;
  handleSortOptionClick: (option: ArticleSortOption) => void;
}

const ListHeaderBar: React.FC<ListHeaderBarProps> = ({
  tabValue,
  sortOrder,
  filterAnchorEl,
  handleTabOnChange,
  handleSortOrderClick,
  handleFilterClick,
  handleFilterClose,
  handleSortOptionClick,
}) => {
  const theme = useTheme();

  return (
    <AppBar position="static" color="primary" sx={{ boxShadow: 'none' }}>
      <Toolbar>
        <Tabs
          value={tabValue}
          onChange={handleTabOnChange}
          sx={{
            flexGrow: 1,
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
          <Tab label="Articles" />
        </Tabs>

        <IconButton
          color="inherit"
          onClick={handleSortOrderClick}
          sx={{ color: theme.palette.secondary.main }}
        >
          {sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
        </IconButton>
        <IconButton
          color="inherit"
          onClick={handleFilterClick}
          sx={{ color: theme.palette.secondary.main }}
        >
          <FilterListIcon />
        </IconButton>
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
            onClick={() => handleSortOptionClick(ArticleSortOption.Comments)}
          >
            Comments
          </MenuItem>
          <MenuItem
            onClick={() => handleSortOptionClick(ArticleSortOption.Views)}
          >
            Views
          </MenuItem>
          <MenuItem
            onClick={() => handleSortOptionClick(ArticleSortOption.Likes)}
          >
            Likes
          </MenuItem>
          <MenuItem
            onClick={() => handleSortOptionClick(ArticleSortOption.Date)}
          >
            Date
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default ListHeaderBar;
