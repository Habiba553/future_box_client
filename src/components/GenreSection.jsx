// src/components/GenreSection.jsx
import React, { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";
import { FaFilter, FaRedoAlt } from "react-icons/fa";

const API_BASE = "http://localhost:3000";
const ALL_GENRES = [
  "Action", "Drama", "Comedy", "Crime Drama", "Sci-Fi", 
  "Horror", "Romance", "Documentary", "Thriller", "Animation", "Mystery",
];

const ALL_LANGUAGES = ["English", "Spanish", "Hindi", "French", "German", "Japanese"];
const ALL_COUNTRIES = ["USA", "UK", "India", "Canada", "Australia"];

export default function GenreSection() {
  const [selected, setSelected] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState("recent");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(24);
  const [error, setError] = useState(null);

  const toggleGenre = (g) => setSelected((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (selected.length) params.set("genres", selected.join(","));
    if (minRating !== "" && !isNaN(minRating)) params.set("minRating", minRating);
    if (maxRating !== "" && !isNaN(maxRating)) params.set("maxRating", maxRating);
    if (language) params.set("language", language);
    if (country) params.set("country", country);
    if (sort) params.set("sort", sort);
    params.set("limit", limit);
    params.set("page", page);
    return params.toString();
  };

  useEffect(() => {
    const q = buildQuery();
    const abort = new AbortController();
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_BASE}/movies?${q}`;
        const res = await fetch(url, { signal: abort.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const arr = Array.isArray(json) ? json : json.data ?? json.movies ?? [];
        setMovies(arr);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
    return () => abort.abort();
  }, [selected, minRating, maxRating, language, country, sort, page]);

  return (
    <section className="bg-base-100 py-16 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* --- Header Section (Matching 'Production' image style) --- */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-[#24BAEF] font-medium tracking-[0.2em] uppercase text-xs mb-2 flex items-center gap-2">
              <FaFilter size={10} /> Filtered Search
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-base-content tracking-tighter">
              Browse Genres.
            </h2>
          </div>
          
          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 bg-base-200 border border-base-content/10 p-2 px-4 rounded-sm">
            <span className="text-[10px] font-black uppercase opacity-40">Sort By</span>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)} 
              className="bg-transparent text-sm font-bold text-base-content focus:outline-none"
            >
              <option value="recent">Latest Releases</option>
              <option value="rating_desc">Rating: High to Low</option>
              <option value="rating_asc">Rating: Low to High</option>
              <option value="year_desc">Year: New to Old</option>
            </select>
          </div>
        </div>

        {/* --- Static Genre Selection Bar --- */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ALL_GENRES.map((g) => {
            const active = selected.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={`px-5 py-2 text-xs font-black uppercase tracking-widest border transition-all duration-300 rounded-sm ${
                  active 
                    ? "bg-[#24BAEF] text-white border-[#24BAEF]" 
                    : "bg-transparent text-base-content border-base-content/20 hover:border-[#24BAEF]"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* --- Advanced Filters Area --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 p-6 bg-base-200 border border-base-content/5">
          {/* Rating Range */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase opacity-50">Rating Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number" min="0" max="10" step="0.1" value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full bg-base-100 border border-base-content/10 px-3 py-2 text-sm focus:border-[#24BAEF] outline-none"
              />
              <span className="opacity-30">-</span>
              <input
                type="number" min="0" max="10" step="0.1" value={maxRating}
                onChange={(e) => setMaxRating(Number(e.target.value))}
                className="w-full bg-base-100 border border-base-content/10 px-3 py-2 text-sm focus:border-[#24BAEF] outline-none"
              />
            </div>
          </div>

          {/* Language */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase opacity-50">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-base-100 border border-base-content/10 px-3 py-2 text-sm outline-none focus:border-[#24BAEF]">
              <option value="">Any Language</option>
              {ALL_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Country */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase opacity-50">Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="bg-base-100 border border-base-content/10 px-3 py-2 text-sm outline-none focus:border-[#24BAEF]">
              <option value="">Any Country</option>
              {ALL_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Controls */}
          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                setSelected([]); setMinRating(0); setMaxRating(10); setLanguage(""); setCountry(""); setPage(1);
              }}
              className="flex-1 bg-base-300 h-[42px] flex items-center justify-center gap-2 text-[10px] font-black uppercase hover:bg-error hover:text-white transition-colors"
            >
              <FaRedoAlt size={10} /> Reset
            </button>
            <button onClick={() => setPage(1)} className="flex-1 bg-[#24BAEF] text-white h-[42px] text-[10px] font-black uppercase hover:opacity-90 transition-opacity">
              Apply Filters
            </button>
          </div>
        </div>

        {/* --- Content Display --- */}
        {loading ? (
          <div className="py-24 text-center">
            <span className="loading loading-spinner loading-lg text-[#24BAEF]"></span>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-error font-bold">Error: {error}</div>
        ) : (
          <>
            <MovieGrid movies={movies} />
            
            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-4">
              <button 
                onClick={() => setPage((p) => Math.max(1, p - 1))} 
                className="btn btn-ghost border border-base-content/10 btn-sm rounded-sm font-black uppercase text-[10px]" 
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="text-xs font-black uppercase tracking-widest">Page {page}</span>
              <button 
                onClick={() => setPage((p) => p + 1)} 
                className="btn btn-ghost border border-base-content/10 btn-sm rounded-sm font-black uppercase text-[10px]"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}