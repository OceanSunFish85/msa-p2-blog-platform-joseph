import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../Components/HomePage/Home';
import { createMockStore } from '../store/createMockStore';

const initialState = {
  article: {
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
    topArticles: [
      {
        id: 1,
        title: 'Top Article Title',
        summary: 'This is a summary of the top article.',
        cover: 'https://via.placeholder.com/400',
        views: 200,
        commentsCount: 50,
        likes: 100,
        createdAt: new Date().toISOString(),
      },
    ],
    loading: false,
    searchMessage: '',
  },
  user: {
    profile: {
      id: 1,
      name: 'John Doe',
    },
  },
};

const store = createMockStore(initialState);

const meta: Meta<typeof HomePage> = {
  title: 'Components/HomePage',
  component: HomePage,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </Provider>
    ),
  ],
  argTypes: {
    isLoading: { control: 'boolean' },
    articles: { control: 'object' },
    topArticles: { control: 'object' },
    tabValue: { control: 'number' },
    sortOrder: { control: { type: 'radio', options: ['asc', 'desc'] } },
  },
};

export default meta;

type Story = StoryObj<typeof HomePage>;

export const Default: Story = {
  args: {
    isLoading: false,
    articles: initialState.article.articles,
    topArticles: initialState.article.topArticles,
    tabValue: 0,
    sortOrder: 'asc',
  },
};
