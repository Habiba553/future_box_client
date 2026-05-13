// src/components/GenreSection.jsx
import React, { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";
import { FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"; // Added for eye-soothing animations

const API_BASE = "http://localhost:3000";
const ALL_GENRES = [
  "Action", "Drama", "Comedy", "Crime Drama", "Sci-Fi", 
  "Horror", "Romance", "Documentary", "Thriller", "Animation", "Mystery",
];

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

  const toggleGenre = (g) => {
    setSelected((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
    setPage(1); // Reset to page 1 on filter change
  };

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="bg-base-100 py-16 transition-colors duration-500">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* --- Header Section --- */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p className="text-[#24BAEF] font-medium tracking-[0.2em] uppercase text-xs mb-2 flex items-center gap-2">
              <FaFilter size={10} /> Filtered Search
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-base-content tracking-tighter">
              Browse Genres.
            </h2>
          </div>
          
          <div className="flex items-center gap-3 bg-base-200 border border-base-content/10 p-2 px-4 rounded-sm transition-colors duration-300">
            <span className="text-[10px] font-black uppercase opacity-40 text-base-content">Sort By</span>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)} 
              className="bg-transparent text-sm font-bold text-base-content focus:outline-none cursor-pointer"
            >
              <option value="recent">Latest Releases</option>
              <option value="rating_desc">Rating: High to Low</option>
              <option value="rating_asc">Rating: Low to High</option>
              <option value="year_desc">Year: New to Old</option>
            </select>
          </div>
        </motion.div>

        {/* --- Static Genre Selection Bar (Animated) --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-2 mb-12"
        >
          {ALL_GENRES.map((g) => {
            const active = selected.includes(g);
            return (
              <motion.button
                key={g}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleGenre(g)}
                className={`px-5 py-2 text-xs font-black uppercase tracking-widest border transition-all duration-300 rounded-sm ${
                  active 
                    ? "bg-[#24BAEF] text-white border-[#24BAEF] shadow-lg shadow-[#24BAEF]/20" 
                    : "bg-transparent text-base-content border-base-content/20 hover:border-[#24BAEF]"
                }`}
              >
                {g}
              </motion.button>
            );
          })}
        </motion.div>

        {/* --- Content Display --- */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center"
            >
              <span className="loading loading-spinner loading-lg text-[#24BAEF]"></span>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center text-error font-bold"
            >
              Error: {error}
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MovieGrid movies={movies} />
              
              {/* Pagination */}
              <div className="mt-12 flex items-center justify-center gap-6">
                <button 
                  onClick={() => setPage((p) => Math.max(1, p - 1))} 
                  className="btn btn-ghost border border-base-content/10 btn-sm rounded-sm font-black uppercase text-[10px] hover:bg-base-content hover:text-base-100 transition-all" 
                  disabled={page === 1}
                >
                  Prev
                </button>
                <span className="text-xs font-black uppercase tracking-widest text-base-content">
                  Page <span className="text-[#24BAEF]">{page}</span>
                </span>
                <button 
                  onClick={() => setPage((p) => p + 1)} 
                  className="btn btn-ghost border border-base-content/10 btn-sm rounded-sm font-black uppercase text-[10px] hover:bg-base-content hover:text-base-100 transition-all"
                  disabled={movies.length < limit}
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}