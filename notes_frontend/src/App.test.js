import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Notes title and Add button', () => {
  render(<App />);
  expect(screen.getByText(/Notes/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
});
