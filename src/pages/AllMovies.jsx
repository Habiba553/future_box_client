// src/pages/AllMovies.jsx
import React, { useEffect, useState, useCallback, useContext } from "react"; // Added useContext
import { useLocation, useNavigate } from "react-router-dom";
import { FaFilter, FaRedoAlt, FaSearch, FaPlayCircle, FaStar, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Added AuthContext import

const API_BASE = "http://localhost:3000";
const TMDB_BASE = "https://image.tmdb.org/p/w500";

const ALL_GENRES = ["Action", "Drama", "Comedy", "Crime Drama", "Sci-Fi", "Horror", "Romance", "Documentary", "Thriller", "Animation", "Mystery"];
const ALL_LANGUAGES = ["English", "Spanish", "Hindi", "French", "German", "Japanese"];
const ALL_COUNTRIES = ["USA", "UK", "India", "Canada", "Australia"];

export default function AllMovies() {
  const { user } = useContext(AuthContext); // Destructure user from context
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedGenres.length) params.set("genres", selectedGenres.join(","));
    if (minRating > 0) params.set("minRating", minRating);
    if (maxRating < 10) params.set("maxRating", maxRating);
    if (language) params.set("language", language);
    if (country) params.set("country", country);
    if (sort) params.set("sort", sort);
    params.set("page", page);
    params.set("limit", 24);

    try {
      const res = await fetch(`${API_BASE}/movies?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      
      const arr = Array.isArray(json) ? json : json.data ?? json.movies ?? [];
      setMovies(arr);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedGenres, minRating, maxRating, language, country, sort, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedGenres([]);
    setMinRating(0);
    setMaxRating(10);
    setLanguage("");
    setCountry("");
    setPage(1);
  };

  return (
    <div className="bg-base-100 min-h-screen pb-20 transition-colors duration-300">
      {/* Header & Search */}
      <div className="max-w-[1440px] mx-auto px-6 pt-16 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <p className="text-[#24BAEF] font-black tracking-[0.3em] uppercase text-[10px] mb-3 flex items-center gap-2">
              <FaFilter size={10} /> Cinema Collection
            </p>
            <h2 className="text-5xl md:text-6xl font-black text-base-content tracking-tighter leading-none">
              All <br /> Movies.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* --- CONDITIONALLY RENDERED: ADD MOVIE BUTTON --- */}
            {user && (
              <Link 
                to="/add-movie" 
                className="w-full sm:w-auto bg-[#24BAEF] text-white px-6 h-[50px] rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1da1d1] transition-all shadow-lg shadow-sky-100"
              >
                <FaPlus /> Add Movie
              </Link>
            )}

            <div className="relative w-full md:w-96 group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                placeholder="Search by title..."
                className="w-full bg-transparent border-b-2 border-base-content/20 py-4 pr-12 outline-none focus:border-[#24BAEF] text-base-content font-bold transition-all"
              />
              <FaSearch className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-[#24BAEF] group-focus-within:opacity-100 transition-all" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6">
        {/* Genre Bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ALL_GENRES.map((g) => (
            <button
              key={g}
              onClick={() => {
                setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
                setPage(1);
              }}
              className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest border transition-all duration-300 rounded-sm ${
                selectedGenres.includes(g) ? "bg-[#24BAEF] text-white border-[#24BAEF]" : "bg-transparent border-base-content/20 hover:border-[#24BAEF]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 p-6 bg-base-200 border border-base-content/5 rounded-sm shadow-sm">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black uppercase opacity-50">Sort Order</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-base-100 border border-base-content/10 px-3 py-2 text-xs font-bold outline-none focus:border-[#24BAEF]">
              <option value="recent">Recent Releases</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black uppercase opacity-50">Rating (0-10)</label>
            <div className="flex gap-2">
              <input type="number" value={minRating} onChange={(e) => setMinRating(e.target.value)} className="w-full bg-base-100 border border-base-content/10 px-2 py-2 text-xs outline-none focus:border-[#24BAEF]" placeholder="Min" />
              <input type="number" value={maxRating} onChange={(e) => setMaxRating(e.target.value)} className="w-full bg-base-100 border border-base-content/10 px-2 py-2 text-xs outline-none focus:border-[#24BAEF]" placeholder="Max" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black uppercase opacity-50">Region & Language</label>
            <div className="flex gap-2">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-base-100 border border-base-content/10 px-2 py-2 text-xs outline-none">
                <option value="">Language</option>
                {ALL_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-base-100 border border-base-content/10 px-2 py-2 text-xs outline-none">
                <option value="">Country</option>
                {ALL_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={resetFilters} className="flex-1 bg-base-300 h-[38px] text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-error hover:text-white transition-all">
              <FaRedoAlt size={10} /> Reset
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 text-center"><span className="loading loading-spinner loading-lg text-[#24BAEF]"></span></div>
        ) : error ? (
          <div className="py-12 text-center text-error font-bold">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12">
            {movies.map((m) => {
              const doc = m?.movieDoc ?? m;
              const id = doc._id ?? doc.id ?? m._id ?? m.id;
              const posterRaw = doc.poster || doc.posterUrl || doc.poster_path || doc.imageUrl || m.poster || "";

              let poster = "";
              if (posterRaw) {
                if (posterRaw.startsWith("/")) {
                  poster = `${TMDB_BASE}${posterRaw}`;
                } else if (posterRaw.startsWith("http")) {
                  poster = posterRaw;
                } else {
                  poster = posterRaw;
                }
              }

              return (
                <div key={id} className="group flex flex-col animate-in fade-in zoom-in duration-500">
                  <div className="relative overflow-hidden aspect-[2/3] bg-base-300 rounded-sm shadow-xl mb-4">
                    <img 
                      src={poster || "https://via.placeholder.com/500x750?text=No+Poster"} 
                      alt={doc.title || "Movie"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://via.placeholder.com/500x750?text=Poster+Error";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4">
                      <Link to={`/movie-details/${id}`} className="p-4 bg-[#24BAEF] rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-110">
                        <FaPlayCircle size={30} />
                      </Link>
                      <Link to={`/movie-details/${id}`} className="text-[9px] font-black uppercase tracking-[0.2em] text-white underline decoration-[#24BAEF] underline-offset-4">
                        Details
                      </Link>
                    </div>
                    
                    <div className="absolute top-3 left-3 bg-[#24BAEF] text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase">
                      {Array.isArray(doc.genre) ? doc.genre[0] : (doc.genre?.split(',')[0] ?? "Movie")}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-sm flex items-center gap-1 text-yellow-400 text-[10px] font-bold">
                      <FaStar size={8} /> {doc.rating || "N/A"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#24BAEF] uppercase tracking-widest">{doc.releaseYear || doc.year || "2024"}</span>
                    <h3 className="text-sm font-black text-base-content uppercase tracking-tight line-clamp-1 group-hover:text-[#24BAEF] transition-colors">
                      {doc.title || "Untitled"}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-16 flex items-center justify-center gap-6">
          <button 
            disabled={page === 1} 
            onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }} 
            className="text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 disabled:opacity-10 transition-all"
          >
            Prev
          </button>
          <span className="text-xs font-black bg-base-200 px-4 py-1 rounded-full border border-base-content/5">PAGE {page}</span>
          <button 
            onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }} 
            className="text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}