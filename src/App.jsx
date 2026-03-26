import { useState, useEffect } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';

import { db, collection, addDoc } from './firebase'; // Firebase integration

// TMDB API base and v3 key
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

console.log('API_KEY:', API_KEY);

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce search term to reduce API calls
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Save search history to Firebase Firestore
  const saveSearchToFirebase = async (query, movie) => {
    try {
      await addDoc(collection(db, "searches"), {
        query,
        movieTitle: movie.title,
        timestamp: new Date()
      });
    } catch (err) {
      console.error("Error saving search:", err);
    }
  };

  // Fetch movies from TMDB (search or popular)
  const fetchMovies = async (query = '') => {
  setIsLoading(true);
  setErrorMessage('');

  try {
    const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

      console.log('Fetching endpoint:', endpoint);
      const response = await fetch(endpoint);
      console.log('Response status:', response.status);
      if (!response.ok) throw new Error('Failed to fetch movies');

      const data = await response.json();
      setMovieList(data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };


  // Load trending movies from TMDB
  const loadTrendingMovies = async () => {
  try {
      const endpoint = `${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch trending movies');

      const data = await response.json();
      setTrendingMovies(data.results || []);
        console.log('Movies fetched:', data.results)
    } catch (error) {
      console.error(error);
    }
    
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id}>
                  <p>{index + 1}</p>
                  <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                  <p>{movie.title}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;