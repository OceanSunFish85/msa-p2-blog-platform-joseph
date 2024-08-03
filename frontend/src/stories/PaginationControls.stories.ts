import { Meta, StoryObj } from '@storybook/react';
import PaginationControls from '../Components/HomePage/PaginationControls';

const meta: Meta<typeof PaginationControls> = {
  title: 'Components/PaginationControls',
  component: PaginationControls,
  argTypes: {
    currentPage: {
      control: 'number',
    },
    handlePrevPage: {
      action: 'prevClicked',
    },
    handleNextPage: {
      action: 'nextClicked',
    },
    articlesLength: {
      control: 'number',
    },
  },
};

export default meta;

type Story = StoryObj<typeof PaginationControls>;

export const Default: Story = {
  args: {
    currentPage: 1,
    articlesLength: 10,
  },
};
