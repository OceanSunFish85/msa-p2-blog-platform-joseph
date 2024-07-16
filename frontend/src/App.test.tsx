import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Welcome To My Blog Website text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome To My Blog Website/i);
  expect(linkElement).toBeInTheDocument();
});
