import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
} from '@mui/material';
import {
  Add,
  ArrowBack,
  Apps,
  Bookmark,
  BookmarkBorder,
  Close,
  DarkMode,
  Home,
  Favorite,
  FavoriteBorder,
  Login,
  MovieFilter,
  PlayArrow,
  QueueMusic,
  Search,
  Sunny,
  Tune,
  Whatshot,
} from '@mui/icons-material';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import './App.css';

const API_ROOT = 'https://api.themoviedb.org/3';
const IMAGE_ROOT = 'https://image.tmdb.org/t/p/';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const ACCESS_TOKEN = process.env.REACT_APP_TMDB_ACCESS_TOKEN;
const hasApiCredentials = Boolean(API_KEY || ACCESS_TOKEN);

const demoMovies = [
  { id: 458156, title: 'John Wick: Chapter 3 – Parabellum', display_title: 'John Wick', display_subtitle: 'Chapter 3 – Parabellum (2019)', release_date: '2019-05-17', vote_average: 7.4, genre_ids: [28, 53, 80], poster_path: '/ziEuG1essDuWuC5lpWUaw1uXY2O.jpg', backdrop_path: '/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg', overview: 'John Wick is on the run after killing a member of the international assassins’ guild, with a fourteen million dollar price tag on his head.', genres: ['Action', 'Thriller'], runtime: 131, cast: ['Keanu Reeves', 'Halle Berry', 'Ian McShane'], trailer: 'M7XM597XO94' },
  { id: 872585, title: 'Oppenheimer', release_date: '2023-07-19', vote_average: 8.1, genre_ids: [18, 36], poster_path: '/ptpr0kGAckfQkJeJIt8st5dglvd.jpg', backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', overview: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.', genres: ['Drama', 'History'], runtime: 181, cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon'], trailer: 'uYPbbksJxIg' },
  { id: 346698, title: 'Barbie', release_date: '2023-07-19', vote_average: 7.0, genre_ids: [35, 12], poster_path: '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', backdrop_path: '/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg', overview: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.', genres: ['Comedy', 'Adventure'], runtime: 114, cast: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera'], trailer: 'pBk4NYhWNMM' },
  { id: 693134, title: 'Dune: Part Two', release_date: '2024-02-27', vote_average: 8.2, genre_ids: [878, 12], poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', genres: ['Science Fiction', 'Adventure'], runtime: 167, cast: ['Timothee Chalamet', 'Zendaya', 'Rebecca Ferguson'], trailer: 'Way9Dexny3w' },
  { id: 666277, title: 'Past Lives', release_date: '2023-06-02', vote_average: 7.8, genre_ids: [18, 10749], poster_path: '/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg', backdrop_path: '/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg', overview: 'Two deeply connected childhood friends are wrested apart after one family emigrates from South Korea.', genres: ['Drama', 'Romance'], runtime: 106, cast: ['Greta Lee', 'Teo Yoo', 'John Magaro'], trailer: 'kA244xewjcI' },
  { id: 976893, title: 'Perfect Days', release_date: '2023-11-10', vote_average: 7.8, genre_ids: [18], poster_path: '/tvUHVSTJV9ITON3oyHaWp7oaAc8.jpg', backdrop_path: '/hjWxngV6tidwDkfJDEgMjHD2KEz.jpg', overview: 'Hirayama finds beauty in the ordinary rhythms of his carefully structured life in Tokyo.', genres: ['Drama'], runtime: 124, cast: ['Koji Yakusho', 'Tokio Emoto', 'Arisa Nakano'], trailer: 'QzZBbX5A1FA' },
  { id: 940721, title: 'Godzilla Minus One', release_date: '2023-11-03', vote_average: 7.6, genre_ids: [878, 28], poster_path: '/h7Z8a4e2VxiyB8C3bX4tLJZ9d.jpg', backdrop_path: '/bckxSN9ueOgm0gJpVJmPQrecWul.jpg', overview: 'In postwar Japan, a new terror rises from the sea and threatens a nation already brought to its knees.', genres: ['Science Fiction', 'Action'], runtime: 124, cast: ['Ryunosuke Kamiki', 'Minami Hamabe', 'Yuki Yamada'], trailer: 'r7DqccP1Q_4' },
  { id: 976734, title: 'The Holdovers', release_date: '2023-10-27', vote_average: 7.7, genre_ids: [35, 18], poster_path: '/VHSz6gaki8nKp8qW3QZ8pJ.jpg', backdrop_path: '/VHSz6gaki8nKp8qW3QZ8pJ.jpg', overview: 'A curmudgeonly instructor remains on campus during Christmas break with a troubled student and the head cook.', genres: ['Comedy', 'Drama'], runtime: 133, cast: ['Paul Giamatti', 'Da’Vine Joy Randolph', 'Dominic Sessa'], trailer: 'AhKLpJmHhIg' },
  { id: 1056360, title: 'American Fiction', release_date: '2023-12-15', vote_average: 7.4, genre_ids: [35, 18], poster_path: '/57MFWGHarg9jid7yfDTka4RmcMU.jpg', backdrop_path: '/57MFWGHarg9jid7yfDTka4RmcMU.jpg', overview: 'A novelist writes an outlandish satire to prove a point, only to have it become an unexpected success.', genres: ['Comedy', 'Drama'], runtime: 117, cast: ['Jeffrey Wright', 'Tracee Ellis Ross', 'Sterling K. Brown'], trailer: 'i0MbLCpYJPA' },
  { id: 1127166, title: 'The Taste of Things', release_date: '2023-11-08', vote_average: 7.2, genre_ids: [18, 10749], poster_path: '/zC2JeL8h1o5Z4g1n8J9Q2.jpg', backdrop_path: '/A4f7J8w3VvYh7hM1WzK2Z.jpg', overview: 'A cook and a gourmet share a deep bond shaped by their love of food and the quiet rituals of a life together.', genres: ['Drama', 'Romance'], runtime: 135, cast: ['Juliette Binoche', 'Benoit Magimel', 'Emmanuel Salinger'], trailer: 'U9J0y0mU9mQ' },
  { id: 693158, title: 'The Color Purple', release_date: '2023-12-25', vote_average: 7.0, genre_ids: [18, 10402], poster_path: '/nyy8Q6N5fMztgF0kGk3QZ9Y4.jpg', backdrop_path: '/nyy8Q6N5fMztgF0kGk3QZ9Y4.jpg', overview: 'A woman faces many hardships in her life, but ultimately finds extraordinary strength and hope.', genres: ['Drama', 'Music'], runtime: 141, cast: ['Fantasia Barrino', 'Taraji P. Henson', 'Danielle Brooks'], trailer: 'wPwzBUui1GA' },
];

const genres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'Thriller'];

const MovieContext = createContext(null);

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function MovieProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => readStored('filmclub-theme', false));
  const [favorites, setFavorites] = useState(() => readStored('filmclub-favorites', []));
  const [watchlist, setWatchlist] = useState(() => readStored('filmclub-watchlist', []));
  const [user, setUser] = useState(() => localStorage.getItem('filmclub-user') || '');
  const [toast, setToast] = useState('');
  const client = useMemo(() => axios.create({
    baseURL: API_ROOT,
    timeout: 12000,
    headers: ACCESS_TOKEN ? { Authorization: `Bearer ${ACCESS_TOKEN}` } : {},
    params: API_KEY && !ACCESS_TOKEN ? { api_key: API_KEY } : {},
  }), []);

  useEffect(() => localStorage.setItem('filmclub-theme', JSON.stringify(darkMode)), [darkMode]);
  useEffect(() => localStorage.setItem('filmclub-favorites', JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem('filmclub-watchlist', JSON.stringify(watchlist)), [watchlist]);

  const toggleFavorite = (movie) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === movie.id);
      setToast(exists ? 'Removed from your watchlist' : 'Saved to your watchlist');
      return exists ? current.filter((item) => item.id !== movie.id) : [...current, movie];
    });
  };

  const toggleWatchlist = (movie) => {
    setWatchlist((current) => {
      const exists = current.some((item) => item.id === movie.id);
      setToast(exists ? 'Removed from your watchlist' : 'Added to your watchlist');
      return exists ? current.filter((item) => item.id !== movie.id) : [...current, movie];
    });
  };

  const value = {
    client,
    darkMode,
    setDarkMode,
    favorites,
    toggleFavorite,
    watchlist,
    toggleWatchlist,
    user,
    setUser,
    toast,
    setToast,
    hasApiCredentials,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

function useMovies() {
  return useContext(MovieContext);
}

function posterUrl(path, size = 'w500') {
  return path ? `${IMAGE_ROOT}${size}${path}` : '';
}

function movieYear(movie) {
  return movie.release_date ? movie.release_date.slice(0, 4) : '—';
}

function appendUniqueMovies(current, incoming) {
  const ids = new Set(current.map((movie) => movie.id));
  const uniqueIncoming = incoming.filter((movie) => {
    if (ids.has(movie.id)) return false;
    ids.add(movie.id);
    return true;
  });
  return [...current, ...uniqueIncoming];
}

function apiErrorMessage(error, fallback) {
  const status = error.response?.status;
  if (status === 401 || status === 403) return 'TMDb rejected this API key. Check the key in .env.local and restart the app.';
  if (status === 429) return 'TMDb is receiving too many requests right now. Please wait a moment and try again.';
  if (status >= 500) return 'TMDb is temporarily unavailable. Please try again shortly.';
  if (!error.response) return 'Could not reach TMDb. Check your internet connection and try again.';
  return fallback;
}

function App() {
  return (
    <MovieProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppShell />
      </BrowserRouter>
    </MovieProvider>
  );
}

function AppShell() {
  const { darkMode, setDarkMode, user, setUser, toast, setToast } = useMovies();
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const location = useLocation().pathname;
  const isDiscover = location === '/';

  const handleLogin = (event) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setLoginError('Enter a username and password to continue.');
      return;
    }
    const name = username.trim();
    localStorage.setItem('filmclub-user', name);
    setUser(name);
    setPassword('');
    setLoginError('');
    setLoginOpen(false);
  };

  return (
    <main className={`app${darkMode ? ' app-dark' : ''}${isDiscover ? ' app-cinema' : ''}`}>
      {isDiscover && <aside className="icon-rail" aria-label="Quick navigation">
        <Link className="rail-brand" to="/" aria-label="Filmclub home"><Apps /></Link>
        <nav className="rail-links">
          <Link to="/" className="rail-link active" aria-label="Home" title="Home"><Home /></Link>
          <button type="button" className="rail-link" aria-label="Search movies" title="Search movies" onClick={() => document.querySelector('.cinema-search-input')?.focus()}><Search /></button>
          <Link to="/favorites" className="rail-link" aria-label="Watchlist" title="Watchlist"><Favorite /></Link>
          <a href="#filmclub-edit" className="rail-link" aria-label="Film collection" title="Film collection"><QueueMusic /></a>
        </nav>
        <div className="rail-bottom">
          <IconButton className="rail-tool" aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'} title="Toggle theme" onClick={() => setDarkMode((value) => !value)}>{darkMode ? <Sunny /> : <DarkMode />}</IconButton>
          <IconButton className="rail-tool" aria-label={user ? `Signed in as ${user}` : 'Sign in'} title={user || 'Sign in'} onClick={() => setLoginOpen(true)}>{user ? <Avatar className="rail-avatar">{user.slice(0, 1).toUpperCase()}</Avatar> : <Login />}</IconButton>
        </div>
      </aside>}
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Filmclub home">
          <span className="brand-mark"><MovieFilter /></span>
          <span>filmclub<span className="brand-period">.</span></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link className={location === '/' ? 'nav-link active' : 'nav-link'} to="/">Discover</Link>
          <Link className={location === '/favorites' ? 'nav-link active' : 'nav-link'} to="/favorites">My watchlist</Link>
        </nav>
        <div className="top-actions">
          <IconButton className="theme-toggle" aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setDarkMode((value) => !value)}>
            {darkMode ? <Sunny /> : <DarkMode />}
          </IconButton>
          <Button className="login-button" onClick={() => setLoginOpen(true)} startIcon={user ? <Avatar className="user-avatar">{user.slice(0, 1).toUpperCase()}</Avatar> : <Login />}>
            {user || 'Sign in'}
          </Button>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<DiscoverPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
        <Route path="*" element={<DiscoverPage />} />
      </Routes>

      <footer className="site-footer">
        <span>filmclub. &nbsp; A better night in starts here.</span>
        <a className="tmdb-attribution" href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
          <img src="https://www.themoviedb.org/assets/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg" alt="TMDB" />
          <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
        </a>
      </footer>

      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} fullWidth maxWidth="xs" slotProps={{ paper: { className: 'login-dialog' } }}>
        <form onSubmit={handleLogin}>
          <DialogTitle className="dialog-title">Welcome to filmclub<span className="brand-period">.</span></DialogTitle>
          <DialogContent className="login-fields">
            <p className="dialog-copy">Sign in to keep your watchlist close.</p>
            <TextField autoFocus fullWidth label="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            {loginError && <Alert severity="error">{loginError}</Alert>}
            <p className="auth-note">Demo sign-in is saved on this device only.</p>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => setLoginOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Continue</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar open={Boolean(toast)} autoHideDuration={2600} onClose={() => setToast('')} message={toast} />
    </main>
  );
}

function DiscoverPage() {
  const { client, hasApiCredentials, favorites, toggleFavorite, watchlist, toggleWatchlist } = useMovies();
  const [trending, setTrending] = useState(demoMovies.slice(0, 5));
  const [featuredId, setFeaturedId] = useState(458156);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState(() => localStorage.getItem('filmclub-last-search') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsFailed, setSuggestionsFailed] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [submittedQuery, setSubmittedQuery] = useState(() => localStorage.getItem('filmclub-last-search') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchRun, setSearchRun] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const sentinelRef = useRef(null);
  const fetchingPageRef = useRef(false);
  const searchBoxRef = useRef(null);
  const featuredMovie = trending.find((movie) => movie.id === featuredId) || trending[0] || demoMovies[0];
  const featuredTitle = featuredMovie.display_title || featuredMovie.title;
  const featuredGenres = (featuredMovie.genres || []).map((item) => typeof item === 'string' ? item : item.name);
  const genreLabels = { 28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction', 53: 'Thriller' };
  const visibleGenres = featuredGenres.length ? featuredGenres : (featuredMovie.genre_ids || []).map((id) => genreLabels[id]).filter(Boolean);
  const isFavorite = favorites.some((movie) => movie.id === featuredMovie.id);
  const isInWatchlist = watchlist.some((movie) => movie.id === featuredMovie.id);

  useEffect(() => {
    const search = query.trim();
    if (search.length < 2) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      setSuggestionsFailed(false);
      return undefined;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setSuggestionsLoading(true);
      setSuggestionsFailed(false);
      try {
        let matches;
        if (hasApiCredentials) {
          const { data } = await client.get('/search/movie', { params: { query: search, page: 1 } });
          matches = data.results || [];
        } else {
          matches = demoMovies.filter((movie) => movie.title.toLowerCase().includes(search.toLowerCase()));
        }
        if (!cancelled) setSuggestions(matches.slice(0, 6));
      } catch {
        if (!cancelled) {
          setSuggestions([]);
          setSuggestionsFailed(true);
        }
      } finally {
        if (!cancelled) setSuggestionsLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [client, hasApiCredentials, query]);

  useEffect(() => {
    const closeSuggestions = (event) => {
      if (!searchBoxRef.current?.contains(event.target)) setSuggestionsOpen(false);
    };
    document.addEventListener('pointerdown', closeSuggestions);
    return () => document.removeEventListener('pointerdown', closeSuggestions);
  }, []);

  useEffect(() => {
    if (!hasApiCredentials) return undefined;
    let cancelled = false;
    client.get('/trending/movie/week')
      .then(({ data }) => { if (!cancelled) setTrending(data.results || []); })
      .catch((requestError) => { if (!cancelled) setError(`${apiErrorMessage(requestError, 'We could not refresh trending titles.') } Showing a hand-picked selection instead.`); });
    return () => { cancelled = true; };
  }, [client, hasApiCredentials]);

  useEffect(() => {
    if (!submittedQuery) {
      setResults([]);
      setPage(1);
      setTotalPages(1);
      setError('');
      return undefined;
    }
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      fetchingPageRef.current = true;
      setLoading(true);
      setError('');
      try {
        if (hasApiCredentials) {
          const { data } = await client.get('/search/movie', { params: { query: submittedQuery, page } });
          if (!cancelled) {
            setResults((current) => page === 1 ? (data.results || []) : appendUniqueMovies(current, data.results || []));
            setTotalPages(Math.min(data.total_pages || 1, 500));
          }
        } else {
          const matches = demoMovies.filter((movie) => movie.title.toLowerCase().includes(submittedQuery.toLowerCase()));
          if (!cancelled) {
            setResults((current) => page === 1 ? matches.slice(0, 6) : [...current, ...matches.slice(6)]);
            setTotalPages(matches.length > 6 ? 2 : 1);
          }
        }
      } catch (requestError) {
        if (!cancelled) setError(apiErrorMessage(requestError, 'Search is having a moment. Please try again.'));
      } finally {
        if (!cancelled) {
          setLoading(false);
          fetchingPageRef.current = false;
        }
      }
    }, page === 1 ? 180 : 0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [client, hasApiCredentials, page, searchRun, submittedQuery]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !submittedQuery || loading || error || page >= totalPages || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !fetchingPageRef.current) {
        fetchingPageRef.current = true;
        setPage((current) => current + 1);
      }
    }, { rootMargin: '500px 0px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [error, loading, page, submittedQuery, totalPages]);

  const doSearch = (event) => {
    event.preventDefault();
    const search = query.trim();
    if (!search) return;
    localStorage.setItem('filmclub-last-search', search);
    fetchingPageRef.current = false;
    setResults([]);
    setTotalPages(1);
    setError('');
    setSubmittedQuery(search);
    setPage(1);
    setSearchRun((current) => current + 1);
    setSuggestionsOpen(false);
  };

  const retrySearch = () => {
    fetchingPageRef.current = false;
    setResults([]);
    setPage(1);
    setTotalPages(1);
    setError('');
    setSearchRun((current) => current + 1);
  };

  const selectSuggestion = (movie) => {
    setQuery(movie.title);
    setSuggestionsOpen(false);
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      setSuggestionsOpen(false);
      setActiveSuggestion(-1);
      return;
    }
    if (!suggestionsOpen || !suggestions.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSuggestion((current) => (current + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSuggestion((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
    } else if (event.key === 'Enter' && activeSuggestion >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeSuggestion]);
    }
  };

  const filteredResults = results.filter((movie) => {
    const movieGenres = [
      ...(movie.genres || []).map((item) => typeof item === 'string' ? item : item.name),
      ...(movie.genre_ids || []).map((id) => ({ 28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction', 53: 'Thriller' }[id] || '')),
    ];
    return (!genreFilter || movieGenres.includes(genreFilter))
      && (!yearFilter || movieYear(movie) === yearFilter)
      && (!ratingFilter || Number(movie.vote_average || 0) >= Number(ratingFilter));
  });

  const openMovie = (movie) => navigate(`/movie/${movie.id}`, { state: { movie } });

  return (
    <div className="page-wrap">
      <section className="hero cinema-hero" id="cinema-feature" style={featuredMovie.backdrop_path ? { '--feature-backdrop': `url(${posterUrl(featuredMovie.backdrop_path, 'original')})` } : undefined}>
        <div className="hero-art" aria-hidden="true" />
        <div className="hero-content cinema-content">
          <div className="cinema-meta"><span>{featuredMovie.release_date ? new Date(`${featuredMovie.release_date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : 'Featured film'}</span><span>{visibleGenres.join(', ').toLowerCase()}</span></div>
          <h1>{featuredTitle}</h1>
          <p className="cinema-subtitle">{featuredMovie.display_subtitle || `${featuredMovie.original_title && featuredMovie.original_title !== featuredMovie.title ? featuredMovie.original_title : featuredMovie.title} (${movieYear(featuredMovie)})`}</p>
          <p className="cinema-overview">{featuredMovie.overview}</p>
          <div className="cinema-actions">
            <Button className="watch-now" onClick={() => openMovie(featuredMovie)} startIcon={<PlayArrow />}>Watch now</Button>
            <Button className="trailer-button" onClick={() => openMovie(featuredMovie)}>Trailer</Button>
          </div>
          <div className="feature-thumbnails" aria-label="Featured movies">
            {trending.slice(0, 5).map((movie, index) => <button key={movie.id} type="button" className={movie.id === featuredMovie.id ? 'feature-thumb selected' : 'feature-thumb'} onClick={() => setFeaturedId(movie.id)} aria-label={`Feature ${movie.title}`} aria-pressed={movie.id === featuredMovie.id}>
              {movie.poster_path ? <img src={posterUrl(movie.poster_path, 'w185')} alt="" /> : <span className="thumb-fallback"><MovieFilter /></span>}
            </button>)}
          </div>
          <div className="feature-progress"><span style={{ width: `${Math.max(1, (trending.findIndex((movie) => movie.id === featuredMovie.id) + 1) / Math.max(trending.length, 1) * 100)}%` }} /></div>
          <div className="feature-quick-actions">
            <IconButton className={isFavorite ? 'feature-icon active' : 'feature-icon'} aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'} title="Favorite" onClick={() => toggleFavorite(featuredMovie)}>{isFavorite ? <Favorite /> : <FavoriteBorder />}</IconButton>
            <IconButton className={isInWatchlist ? 'feature-icon active' : 'feature-icon'} aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'} title="Watchlist" onClick={() => toggleWatchlist(featuredMovie)}>{isInWatchlist ? <Bookmark /> : <BookmarkBorder />}</IconButton>
            <IconButton className="feature-icon" aria-label="More movie details" title="More details" onClick={() => openMovie(featuredMovie)}><Add /></IconButton>
          </div>
          <div className="search-autocomplete cinema-search" ref={searchBoxRef}>
            <form className="search-form" onSubmit={doSearch} role="search">
              <button type="submit" className="search-submit-icon" aria-label="Search movies"><Search /></button>
              <input
                className="cinema-search-input"
                role="combobox"
                aria-label="Search movies"
                aria-autocomplete="list"
                aria-controls="movie-suggestions"
                aria-expanded={suggestionsOpen && query.trim().length >= 2}
                aria-activedescendant={activeSuggestion >= 0 ? `movie-suggestion-${suggestions[activeSuggestion]?.id}` : undefined}
                placeholder="Search a film, a feeling, a director..."
                value={query}
                onChange={(event) => {
                  const value = event.target.value;
                  setQuery(value);
                  setSuggestions([]);
                  setSuggestionsFailed(false);
                  setSuggestionsLoading(value.trim().length >= 2);
                  setSuggestionsOpen(true);
                  setActiveSuggestion(-1);
                }}
                onFocus={() => setSuggestionsOpen(true)}
                onKeyDown={handleSearchKeyDown}
              />
              <button type="button" className="search-filter-button" aria-label="Toggle search filters" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((value) => !value)}><Tune /></button>
            </form>
            {suggestionsOpen && query.trim().length >= 2 && <div className="suggestions-panel" id="movie-suggestions" role="listbox" aria-label="Movie suggestions">
              {suggestionsLoading ? <div className="suggestion-status">Finding films...</div>
                : suggestions.length ? suggestions.map((movie, index) => <button
                  id={`movie-suggestion-${movie.id}`}
                  className={index === activeSuggestion ? 'movie-suggestion active' : 'movie-suggestion'}
                  type="button"
                  role="option"
                  aria-selected={index === activeSuggestion}
                  key={movie.id}
                  onMouseEnter={() => setActiveSuggestion(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSuggestion(movie)}
                >
                  {movie.poster_path ? <img src={posterUrl(movie.poster_path, 'w92')} alt="" /> : <span className="suggestion-poster-empty"><MovieFilter /></span>}
                  <span className="suggestion-copy"><strong>{movie.title}</strong><small>{movieYear(movie)} {movie.vote_average ? `· ★ ${Number(movie.vote_average).toFixed(1)}` : ''}</small></span>
                  <ArrowBack className="suggestion-arrow" />
                </button>)
                  : suggestionsFailed ? <div className="suggestion-status">Suggestions unavailable. Press Enter to search instead.</div>
                    : <div className="suggestion-status">No matching films. Press Enter to search the full catalogue.</div>}
            </div>}
            {filtersOpen && <div className="hero-filter-panel"><FilterBar genre={genreFilter} setGenre={setGenreFilter} year={yearFilter} setYear={setYearFilter} rating={ratingFilter} setRating={setRatingFilter} /></div>}
          </div>
        </div>
      </section>

      {error && !submittedQuery && <Alert className="page-alert" severity="warning" onClose={() => setError('')}>{error}</Alert>}
      {!hasApiCredentials && <div className="preview-note"><span className="preview-dot" /> Preview mode <span>Connect a TMDb key to explore the full catalogue.</span></div>}

      {submittedQuery ? (
        <section className="catalog-section search-results-section">
          <div className="section-heading search-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> THE SEARCH IS ON</div><h2>Results for <em>“{submittedQuery}”</em></h2></div>
            <button className="text-button" onClick={() => { setSubmittedQuery(''); setQuery(''); localStorage.removeItem('filmclub-last-search'); }}>Clear search <Close /></button>
          </div>
          {!hasApiCredentials && <div className="preview-search-note"><span className="preview-dot" /><span><strong>Preview catalogue only.</strong> Full movie search needs a TMDb API key in <code>.env.local</code>, then restart <code>npm start</code>.</span><a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">Get a key ↗</a></div>}
          <FilterBar genre={genreFilter} setGenre={setGenreFilter} year={yearFilter} setYear={setYearFilter} rating={ratingFilter} setRating={setRatingFilter} />
          {loading && results.length === 0 ? <div className="loading-line">Finding your film<span>...</span></div>
            : error ? <EmptyState title="Couldn’t load search results" message={error} action={<Button onClick={retrySearch}>Try again</Button>} />
              : filteredResults.length ? <MovieGrid movies={filteredResults} onSelect={openMovie} />
                : <EmptyState title={hasApiCredentials ? 'No films found' : 'Not in the preview reel'} message={hasApiCredentials ? 'Try another title or loosen your filters.' : 'Only a few sample films are searchable until TMDb is connected.'} />}
          {submittedQuery && page < totalPages && <div ref={sentinelRef} className="scroll-sentinel" role="status" aria-live="polite">{loading ? 'Finding more films...' : 'Scroll to discover more'}</div>}
        </section>
      ) : (
        <>
          <section className="catalog-section picks-section" id="filmclub-edit">
            <div className="section-heading">
              <div><div className="eyebrow"><span className="eyebrow-line" /> THE FILMCLUB EDIT</div><h2>Worth your <em>time.</em></h2></div>
              <span className="section-count">A few good places to start <span>↘</span></span>
            </div>
            <MovieGrid movies={trending.slice(0, 8)} onSelect={openMovie} />
          </section>
        </>
      )}
    </div>
  );
}

function FilterBar({ genre, setGenre, year, setYear, rating, setRating }) {
  return (
    <div className="filter-bar" aria-label="Filter search results">
      <span className="filter-label"><MovieFilter /> FILTER BY</span>
      <TextField select size="small" value={genre} onChange={(event) => setGenre(event.target.value)} aria-label="Genre" className="filter-select">
        <MenuItem value="">Any genre</MenuItem>{genres.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
      </TextField>
      <TextField select size="small" value={year} onChange={(event) => setYear(event.target.value)} aria-label="Release year" className="filter-select">
        <MenuItem value="">Any year</MenuItem>{Array.from({ length: 2026 - 1970 }, (_, index) => String(2026 - index)).map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
      </TextField>
      <TextField select size="small" value={rating} onChange={(event) => setRating(event.target.value)} aria-label="Minimum rating" className="filter-select">
        <MenuItem value="">Any rating</MenuItem>{['6', '7', '8', '9'].map((item) => <MenuItem key={item} value={item}>{item}+ rating</MenuItem>)}
      </TextField>
      {(genre || year || rating) && <button className="reset-filters" onClick={() => { setGenre(''); setYear(''); setRating(''); }}>Reset</button>}
    </div>
  );
}

function MovieGrid({ movies, onSelect }) {
  const { watchlist, toggleWatchlist } = useMovies();
  return (
    <div className="movie-grid">
      {movies.map((movie, index) => {
        const saved = watchlist.some((item) => item.id === movie.id);
        return <article className="movie-card" key={movie.id} style={{ '--card-index': index }}>
          <button className="poster-button" onClick={() => onSelect(movie)} aria-label={`View details for ${movie.title}`}>
            {movie.poster_path ? <img className="movie-poster" src={posterUrl(movie.poster_path)} alt={`${movie.title} poster`} loading="lazy" /> : <div className="poster-placeholder"><MovieFilter /><span>{movie.title}</span></div>}
            <span className="poster-rating">★ {Number(movie.vote_average || 0).toFixed(1)}</span>
          </button>
          <div className="card-info"><button className="card-title" onClick={() => onSelect(movie)}>{movie.title}</button><span className="card-year">{movieYear(movie)}</span></div>
          <IconButton className={saved ? 'card-save saved' : 'card-save'} aria-label={saved ? `Remove ${movie.title} from watchlist` : `Save ${movie.title} to watchlist`} onClick={() => toggleWatchlist(movie)}>{saved ? <Bookmark /> : <BookmarkBorder />}</IconButton>
        </article>;
      })}
    </div>
  );
}

function FavoritesPage() {
  const { favorites, watchlist } = useMovies();
  const navigate = useNavigate();
  const savedMovies = [...favorites, ...watchlist.filter((movie) => !favorites.some((favorite) => favorite.id === movie.id))];
  return (
    <div className="page-wrap inner-page">
      <section className="inner-heading">
        <div className="eyebrow"><Favorite /> SAVED FOR LATER</div>
        <h1>Your <em>watchlist.</em></h1>
        <p>Good choices, all in one place.</p>
      </section>
      {savedMovies.length ? <MovieGrid movies={savedMovies} onSelect={(movie) => navigate(`/movie/${movie.id}`, { state: { movie } })} /> : <EmptyState title="A blank reel" message="Save films you want to see and they’ll show up here." action={<Link to="/" className="filled-link">Find something good</Link>} />}
    </div>
  );
}

function MovieDetails() {
  const { movieId } = useParams();
  const { client, hasApiCredentials, favorites, toggleFavorite } = useMovies();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(() => demoMovies.find((item) => String(item.id) === movieId) || null);
  const [credits, setCredits] = useState([]);
  const [trailer, setTrailer] = useState('');
  const [loading, setLoading] = useState(hasApiCredentials);
  const [error, setError] = useState('');
  const saved = favorites.some((item) => String(item.id) === movieId);

  useEffect(() => {
    if (!hasApiCredentials) {
      setLoading(false);
      if (!demoMovies.some((item) => String(item.id) === movieId)) setError('This title is not in the preview catalogue. Add a TMDb key to look it up.');
      return undefined;
    }
    let cancelled = false;
    Promise.all([
      client.get(`/movie/${movieId}`),
      client.get(`/movie/${movieId}/credits`),
      client.get(`/movie/${movieId}/videos`),
    ]).then(([details, cast, videos]) => {
      if (cancelled) return;
      setMovie(details.data);
      setCredits(cast.data.cast?.slice(0, 5) || []);
      const video = videos.data.results?.find((item) => item.site === 'YouTube' && item.type === 'Trailer') || videos.data.results?.find((item) => item.site === 'YouTube');
      setTrailer(video?.key || '');
      setError('');
    }).catch((requestError) => { if (!cancelled) setError(apiErrorMessage(requestError, 'We could not load this film right now. Please try again.')); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [client, hasApiCredentials, movieId]);

  if (loading && !movie) return <div className="detail-loading">Finding the good bits...</div>;
  if (error && !movie) return <div className="page-wrap inner-page"><EmptyState title="Film unavailable" message={error} action={<Button onClick={() => navigate(-1)}>Go back</Button>} /></div>;
  if (!movie) return null;
  const categories = (movie.genres || []).map((item) => typeof item === 'string' ? item : item.name);
  const castNames = credits.length ? credits.map((person) => person.name) : movie.cast || [];
  const trailerKey = trailer || movie.trailer;

  return (
    <div className="detail-page">
      <div className="detail-backdrop" style={{ backgroundImage: movie.backdrop_path ? `linear-gradient(90deg, var(--page) 0%, rgba(0,0,0,.58) 65%, rgba(0,0,0,.24)), url(${posterUrl(movie.backdrop_path, 'original')})` : undefined }} />
      <div className="detail-content">
        <button className="back-button" onClick={() => navigate(-1)}><ArrowBack /> Back to films</button>
        {error && <Alert severity="warning" className="detail-alert">{error}</Alert>}
        <div className="detail-main">
          <div className="detail-poster-wrap">{movie.poster_path && <img className="detail-poster" src={posterUrl(movie.poster_path)} alt={`${movie.title} poster`} />}</div>
          <div className="detail-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> THE FEATURE PRESENTATION</div>
            <h1>{movie.title}<span className="detail-year"> ({movieYear(movie)})</span></h1>
            <div className="detail-meta"><span className="detail-rating">★ {Number(movie.vote_average || 0).toFixed(1)} <small>/ 10</small></span><span>{movie.runtime ? `${movie.runtime} min` : 'Feature film'}</span><span>{categories.join(' · ')}</span></div>
            <p className="detail-overview">{movie.overview || 'An intriguing story, waiting to be discovered.'}</p>
            <div className="detail-buttons">
              <Button className="primary-action" onClick={() => toggleFavorite(movie)} startIcon={saved ? <Bookmark /> : <BookmarkBorder />}>{saved ? 'In your watchlist' : 'Add to watchlist'}</Button>
              {trailerKey && <Button className="trailer-action" component="a" href={`https://www.youtube.com/watch?v=${trailerKey}`} target="_blank" rel="noreferrer">Watch trailer ↗</Button>}
            </div>
            <div className="detail-cast"><span className="cast-label">THE CAST</span><div>{castNames.length ? castNames.map((name) => <span key={name}>{name}</span>) : <span>Cast information unavailable</span>}</div></div>
          </div>
        </div>
        {trailerKey && <section className="trailer-section"><div className="eyebrow"><span className="eyebrow-line" /> A LITTLE SNEAK PEEK</div><div className="trailer-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${trailerKey}`} title={`${movie.title} trailer`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></section>}
      </div>
    </div>
  );
}

function EmptyState({ title, message, action }) {
  return <div className="empty-state"><span className="empty-icon"><Whatshot /></span><h3>{title}</h3><p>{message}</p>{action}</div>;
}

export default App;
