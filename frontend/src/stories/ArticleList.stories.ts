// ArticleList.stories.tsx
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ArticleList from '../Components/HomePage/ArticleList';

const meta: Meta<typeof ArticleList> = {
  title: 'Components/ArticleList',
  component: ArticleList,
  argTypes: {
    articles: {
      control: 'object',
    },
    handleArticleClick: {
      action: 'clicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArticleList>;

export const Default: Story = {
  args: {
    articles: [
      {
        id: 1,
        title: 'Sample Article Title 1',
        summary: 'This is a summary of the sample article 1.',
        cover: 'https://via.placeholder.com/200',
        views: 100,
        commentsCount: 20,
        likes: 50,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Sample Article Title 2',
        summary: 'This is a summary of the sample article 2.',
        cover: 'https://via.placeholder.com/200',
        views: 150,
        commentsCount: 25,
        likes: 75,
        createdAt: new Date().toISOString(),
      },
    ],
  },
};
