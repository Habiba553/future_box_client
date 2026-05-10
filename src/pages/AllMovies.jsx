// src/pages/AllMovies.jsx
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { MovieCard } from "../components/MovieCard";
import { useEffect, useState } from "react";

const AllMovies = () => {
  // FIX: handle { data, total, page, limit }
  const loader = useLoaderData() ?? {};
  const data = Array.isArray(loader) ? loader : loader.data ?? [];

  const [movies, setMovies] = useState(data);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Merge any newly added movie passed via navigation state
  useEffect(() => {
    const newMovieRaw = location.state?.newMovie;
    const newMovie = newMovieRaw?.data ?? newMovieRaw; // handle possible backend wrapper
    if (!newMovie) return;

    setMovies((prev) => {
      const id = newMovie._id ?? newMovie.id;
      if (id && prev.some((m) => (m._id ?? m.id) === id)) return prev; // avoid dupes
      return [newMovie, ...prev];
    });

    // clear the navigation state so we don't re-apply on back/refresh
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.newMovie]);

  const handleSearch = (e) => {
    e.preventDefault();
    const search_text = e.target.search.value.trim();

    if (!search_text) {
      setMovies(data);
      return;
    }

    setLoading(true);

    fetch(`http://localhost:3000/movies?search=${encodeURIComponent(search_text)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to search movies");
        return res.json();
      })
      .then((result) => {
        // FIX: extract array safely
        const arr = Array.isArray(result) ? result : result.data ?? [];
        setMovies(arr);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setMovies([]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="px-6">
      <div className="text-3xl text-center font-bold mt-5">🎬 All Movies</div>
      <p className="text-center text-gray-600 mb-8">Explore upcoming and top-rated films.</p>

      <form onSubmit={handleSearch} className="mb-10 flex gap-2 justify-center">
        <label className="input rounded-full flex items-center gap-2 border p-2 w-80">
          <svg
            className="h-5 w-5 opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            name="search"
            type="search"
            placeholder="Search movies..."
            className="outline-none bg-transparent w-full"
          />
        </label>
        <button type="submit" className="btn btn-secondary rounded-full">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {movies.length === 0 ? (
        <p className="text-center text-gray-500">No movies found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie, index) => (
            <MovieCard key={movie._id || movie.id || index} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllMovies;
