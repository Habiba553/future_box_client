// src/components/TopRated.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const API_BASE = "http://localhost:3000";

function pickPoster(m) {
  return m.poster ?? m.posterUrl ?? "";
}
function pickTitle(m) {
  return m.title ?? m.name ?? "Untitled";
}

const TopRated = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;

    const fetchTop = async () => {
      setLoading(true);
      setError(null);

      // 1) Try dedicated endpoint first
      try {
        const res = await fetch(`${API_BASE}/top-rated`, { signal: ac.signal });
        if (res.ok) {
          const json = await res.json();
          const arr = Array.isArray(json) ? json : json.data ?? json.result ?? [];
          if (!ac.signal.aborted && mounted) {
            setItems(arr.slice(0, 5));
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;
      }

      // 2) Fallback: fetch movies endpoint and compute top 5 locally
      try {
        const resAll = await fetch(`${API_BASE}/movies?limit=100&page=1`, { signal: ac.signal });
        if (!resAll.ok) throw new Error(`Failed to fetch movies: ${resAll.status}`);
        const allJson = await resAll.json();
        const arr = Array.isArray(allJson) ? allJson : (Array.isArray(allJson.data) ? allJson.data : []);
        const sorted = arr
          .slice()
          .sort((a, b) => (Number(b.rating ?? 0) - Number(a.rating ?? 0)))
          .slice(0, 5);
        if (!ac.signal.aborted && mounted) {
          setItems(sorted);
          setLoading(false);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("TopRated fetch error:", err);
        if (mounted) {
          setError(err.message || "Failed to load top rated movies.");
          setLoading(false);
        }
      }
    };

    fetchTop();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, []);

  if (loading) return <div className="py-20 text-center"><span className="loading loading-spinner text-[#4285F4] loading-lg"></span></div>;

  return (
    <section className="bg-base-100 py-16 transition-colors duration-300">
      <div className="max-w-full px-6 md:px-12">
        
        {/* Section Heading (Matching 'Production' image style) */}
        <div className="mb-10">
          <p className="text-[#4285F4] font-medium tracking-[0.2em] uppercase text-xs mb-1">Cinematic Excellence</p>
          <h2 className="text-4xl md:text-6xl font-black text-base-content tracking-tighter">
            Top Rated Movies.
          </h2>
        </div>

        {/* Top 5 Grid - Edge to Edge spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {items.map((m) => {
            const id = m._id ?? m.id;
            return (
              <Link 
                to={`/movie-details/${id}`} 
                key={id} 
                className="group relative flex flex-col bg-base-200 border border-base-content/10 overflow-hidden rounded-[2px] transition-all hover:border-[#4285F4]/50"
              >
                {/* Poster Area */}
                <div className="aspect-[2/3] relative overflow-hidden bg-base-300">
                  {pickPoster(m) ? (
                    <img 
                      src={pickPoster(m)} 
                      alt={pickTitle(m)} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">No Image</div>
                  )}

                  {/* Rating Badge (Always Visible per requirement) */}
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 flex items-center gap-1.5 rounded-sm">
                    <FaStar className="text-[#4285F4]" size={12} />
                    <span className="text-white text-xs font-bold">{m.rating ?? "0"}</span>
                  </div>
                </div>

                {/* Info Area (Adapts to Light/Dark) */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-base-content font-black text-sm uppercase tracking-tight line-clamp-1 mb-1">
                      {pickTitle(m)}
                    </h3>
                    <p className="text-base-content/50 text-[10px] font-bold uppercase tracking-widest">
                      {m.genre?.[0] || m.genre || "Drama"}
                    </p>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-base-content/5 flex justify-between items-center">
                    <span className="text-xs opacity-40 font-medium">{m.releaseYear || "2024"}</span>
                    <span className="text-[#4285F4] text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">Details +</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopRated;