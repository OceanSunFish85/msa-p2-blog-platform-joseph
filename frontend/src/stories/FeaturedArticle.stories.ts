import { Meta, StoryObj } from '@storybook/react';
import FeaturedArticle from '../Components/HomePage/FeaturedArticle';

const meta: Meta<typeof FeaturedArticle> = {
  title: 'Components/FeaturedArticle',
  component: FeaturedArticle,
  argTypes: {
    article: {
      control: 'object',
    },
    isLoading: {
      control: 'boolean',
    },
    handleArticleClick: {
      action: 'clicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FeaturedArticle>;

export const Default: Story = {
  args: {
    article: {
      id: '1',
      title: 'Sample Article Title',
      summary: 'This is a summary of the sample article.',
      cover: 'https://via.placeholder.com/400',
      views: 100,
      commentsCount: 20,
      likes: 50,
      createdAt: new Date().toISOString(),
    },
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    article: null,
    isLoading: true,
  },
};
