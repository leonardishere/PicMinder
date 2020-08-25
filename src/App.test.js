import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders buttons', () => {
  const { getByText } = render(<App />);
  const buttonElement1 = getByText(/Select Files/i);
  expect(buttonElement1).toBeInTheDocument();
  const buttonElement2 = getByText(/Upload Files/i);
  expect(buttonElement2).toBeInTheDocument();
});
