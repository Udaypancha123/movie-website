import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
  create: () => ({
    get: jest.fn((path) => Promise.resolve({
      data: {
        results: path === '/search/movie' ? [{ id: 1, title: 'Testing the Search', release_date: '2024-01-01', vote_average: 7.4, genre_ids: [18] }] : [],
        total_pages: 1,
      },
    })),
  }),
}));

beforeEach(() => {
  localStorage.clear();
});

test('renders the discovery experience', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /good films/i })).toBeInTheDocument();
  expect(screen.getByRole('search')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /on everyone’s/i })).toBeInTheDocument();
});

test('opens the sign-in form and validates required fields', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
  expect(screen.getByText(/enter a username and password/i)).toBeInTheDocument();
});

test('submits movie search and renders TMDb results', async () => {
  render(<App />);
  fireEvent.change(screen.getByRole('combobox', { name: /search movies/i }), { target: { value: 'Dune' } });
  fireEvent.click(screen.getByRole('button', { name: /find a film/i }));
  expect(await screen.findByRole('button', { name: 'Dune: Part Two' })).toBeInTheDocument();
});

test('shows poster suggestions and opens the selected movie', async () => {
  render(<App />);
  fireEvent.change(screen.getByRole('combobox', { name: /search movies/i }), { target: { value: 'Dune' } });
  const suggestion = await screen.findByRole('option', { name: /Dune: Part Two/ });
  expect(suggestion.querySelector('img')).toBeInTheDocument();
  fireEvent.click(suggestion);
  expect(await screen.findByRole('heading', { name: /Dune: Part Two/ })).toBeInTheDocument();
});
