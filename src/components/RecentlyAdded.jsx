// src/components/RecentlyAdded.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

const API_BASE = "https://moviemaster-server-kappa.vercel.app";

function sortByDateDesc(items) {
  return items.slice().sort((a, b) => {
    const aDate = new Date(a.addedAt ?? a.createdAt ?? a.created_at ?? a._createdAt ?? 0).getTime();
    const bDate = new Date(b.addedAt ?? b.createdAt ?? b.created_at ?? b._createdAt ?? 0).getTime();
    return bDate - aDate;
  });
}

const RecentlyAdded = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;

    const fetchRecent = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/recently-added`, { signal: ac.signal });
        if (res.ok) {
          const json = await res.json();
          const arr = Array.isArray(json) ? json : json.data ?? json.result ?? [];
          if (!ac.signal.aborted && mounted) {
            setItems(arr.slice(0, 6));
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;
      }

      try {
        const resAll = await fetch(`${API_BASE}/movies?limit=100&page=1`, { signal: ac.signal });
        if (!resAll.ok) throw new Error(`Failed to fetch movies: ${resAll.status}`);
        const allJson = await resAll.json();
        const arr = Array.isArray(allJson) ? allJson : (Array.isArray(allJson.data) ? allJson.data : []);
        const sorted = sortByDateDesc(arr);
        if (!ac.signal.aborted && mounted) {
          setItems(sorted.slice(0, 6));
          setLoading(false);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        if (mounted) {
          setError(err.message || "Failed to load recently added movies.");
          setLoading(false);
        }
      }
    };

    fetchRecent();
    return () => { mounted = false; ac.abort(); };
  }, []);

  if (loading) return <div className="py-20 text-center"><span className="loading loading-bars loading-lg text-[#24BAEF]"></span></div>;
  if (error) return <div className="py-10 text-center text-red-500 font-bold">{error}</div>;

  return (
    <section className="bg-base-100 py-16 px-6 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Vodi Style Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[#24BAEF] font-bold tracking-[0.3em] uppercase text-xs mb-2">Streaming Now</p>
            <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tighter">
              Recently Added.
            </h2>
          </div>
          
        </div>

        {/* Grid Layout - 6 Movies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {items.map((m) => (
            <Link 
              to={`/movie-details/${m._id ?? m.id}`} 
              key={m._id ?? m.id} 
              className="group flex flex-col bg-base-200 rounded-[2px] overflow-hidden border border-base-content/5 hover:border-[#24BAEF]/40 transition-all duration-300 shadow-xl"
            >
              {/* Poster Container */}
              <div className="aspect-[2/3] overflow-hidden relative">
                {m.poster || m.posterUrl ? (
                  <img
                    src={m.poster ?? m.posterUrl}
                    alt={m.title ?? m.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                ) : (
                  <div className="w-full h-full bg-base-300 flex items-center justify-center text-base-content/20">No Image</div>
                )}
                
                {/* Visual Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="w-12 h-12 rounded-full bg-[#24BAEF] flex items-center justify-center text-white pl-1 shadow-2xl">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M8 5v14l11-7z" /></svg>
                   </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#24BAEF] text-[9px] text-white font-black px-2 py-0.5 rounded-sm uppercase">New</span>
                  <span className="text-[10px] text-base-content/40 font-bold flex items-center gap-1 uppercase">
                    <FaCalendarAlt size={8}/> 
                    {m.addedAt ? new Date(m.addedAt).getFullYear() : "2024"}
                  </span>
                </div>
                
                <h3 className="text-base-content font-bold text-sm uppercase tracking-tight group-hover:text-[#24BAEF] transition-colors truncate">
                  {m.title ?? m.name}
                </h3>
                
                <div className="mt-auto pt-3 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-bold text-base-content uppercase">{m.genre?.[0] || "Featured"}</span>
                   <span className="text-[10px] font-bold text-[#24BAEF]">{m.rating || "8.5"}/10</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyAdded;