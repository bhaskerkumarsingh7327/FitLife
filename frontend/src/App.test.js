import { render, screen } from '@testing-library/react';
import App from './App';

test('renders fitness portal header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Fitness Training Portal/i);
  expect(linkElement).toBeInTheDocument();
});
