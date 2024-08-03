import { Meta, StoryObj } from '@storybook/react';
import ListHeaderBar from '../Components/HomePage/ListHeaderBar';
import { ArticleSortOption } from '../Models/enums/ArticlesSortOption';

const meta: Meta<typeof ListHeaderBar> = {
  title: 'Components/ListHeaderBar',
  component: ListHeaderBar,
  argTypes: {
    tabValue: {
      control: 'number',
      defaultValue: 0,
    },
    sortOrder: {
      control: {
        type: 'radio',
        options: ['asc', 'desc'],
      },
      defaultValue: 'asc',
    },
    filterAnchorEl: {
      control: {
        type: 'boolean',
        options: [true, false],
      },
    },
    handleTabOnChange: {
      action: 'tabChanged',
    },
    handleSortOrderClick: {
      action: 'sortOrderClicked',
    },
    handleFilterClick: {
      action: 'filterClicked',
    },
    handleFilterClose: {
      action: 'filterClosed',
    },
    handleSortOptionClick: {
      action: 'sortOptionClicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ListHeaderBar>;

export const Default: Story = {
  args: {
    tabValue: 0,
    sortOrder: 'asc',
    filterAnchorEl: null,
    handleTabOnChange: (_event, newValue) =>
      console.log('Tab changed:', newValue),
    handleSortOrderClick: () => console.log('Sort order clicked'),
    handleFilterClick: (event) =>
      console.log('Filter clicked:', event.currentTarget),
    handleFilterClose: () => console.log('Filter closed'),
    handleSortOptionClick: (option: ArticleSortOption) =>
      console.log('Sort option clicked:', option),
  },
};
