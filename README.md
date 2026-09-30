# Filmclub Movie Explorer

A responsive React movie discovery app using TMDb for trending titles, search, details, cast, genres, ratings, and trailers. Includes a local preview catalogue so the interface remains usable before adding API credentials.

## Features

- Discover this week's trending movies and search the TMDb catalogue with debounced poster suggestions and keyboard selection.
- Movie detail pages with overview, genre, release year, rating, cast, runtime, and YouTube trailers.
- Infinite-scroll search with genre, release year, and minimum-rating filters.
- Locally saved watchlist, last search, theme preference, and demo username.
- Responsive light and dark themes.
- Friendly empty, loading, and API error states.

## Requirements

- Node.js 18 or newer
- npm
- A TMDb API key or API Read Access Token from [TMDb](https://www.themoviedb.org/settings/api)

## Setup

```sh
npm install
```

Create `.env.local` in the project root (copy `.env.example`) and add one credential:

```env
REACT_APP_TMDB_API_KEY=your_tmdb_api_key
```

Alternatively, use a TMDb API Read Access Token:

```env
REACT_APP_TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
```

Restart the development server after changing environment variables.

```sh
npm start
```

Without credentials, Filmclub uses a small curated preview catalogue. Preview search is limited to those titles; live search, current trending lists, and full detail lookups require TMDb credentials. The local `.env.local` file is git-ignored.

## Commands

- `npm start` starts the development server at `http://localhost:3000`.
- `npm test -- --watchAll=false` runs the tests once.
- `npm run build` creates the production build in `build/`.

## API and privacy notes

Requests use Axios against the TMDb v3 API: `/3/trending/movie/week`, `/3/search/movie`, `/3/movie/{id}`, `/3/movie/{id}/credits`, and `/3/movie/{id}/videos`. Search results load automatically as you scroll. TMDb search pagination is capped at 500 pages; the app stops when the API reports no more pages. User preferences and the watchlist are stored in browser local storage. Sign-in is a UI-only demo and does not authenticate against a server; the password is not saved.

Create React App embeds `REACT_APP_*` values into browser code. Treat these credentials as public in a deployed frontend. For a production service that requires a private credential, route API requests through a backend proxy and protect user accounts server-side.

This product uses the TMDb API but is not endorsed or certified by TMDb. The app displays TMDb's official logo and attribution in the footer. Movie data and poster artwork are supplied by TMDb and their respective studios. See [TMDb Logos & Attribution](https://www.themoviedb.org/about/logos-attribution).

## Deployment

Build with `npm run build`, then deploy the `build/` directory on Vercel or Netlify. Configure the TMDb environment variable in the host's project settings. For client-side routes, configure the host to serve `index.html` for unknown paths. No hosted deployment is configured by this repository yet.
