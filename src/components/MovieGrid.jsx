// src/components/MovieGrid.jsx
import React from "react";
import { Link } from "react-router-dom";

const TMDB_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieGrid({ movies = [] }) {
  return (
    <div className="pt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movies.map((m) => {
          // --- 1. UNWRAP NESTED DATA ---
          const doc = m?.movieDoc ?? m;

          const id = doc._id ?? doc.id ?? m._id ?? m.id ?? Math.random().toString(36).slice(2);

          // --- 2. ROBUST POSTER EXTRACTION ---
          
          const posterRaw =
            doc.poster ??
            doc.posterUrl ??
            doc.poster_path ??
            doc.imageUrl ??
            m.poster ??
            m.posterUrl ??
            "";

          let poster = "";
          if (posterRaw && typeof posterRaw === "string") {
            if (posterRaw.startsWith("/")) {
              poster = `${TMDB_BASE}${posterRaw}`;
            } else if (/^https?:\/\//i.test(posterRaw)) {
              poster = posterRaw;
            } else {
              poster = `${window.location.origin}/${posterRaw.replace(/^\/+/, "")}`;
            }
          }

          const title = doc.title ?? m.title ?? "Untitled";
          const year = doc.releaseYear ?? m.releaseYear ?? "—";
          const rating = doc.rating ?? m.rating ?? "—";
          const genre = doc.genre ?? m.genre ?? "HD";

          return (
            <div key={id} className="group h-full">
              <Link to={`/movie-details/${id}`} className="block h-full">
                <div className="relative overflow-hidden rounded-lg bg-gray-800 flex flex-col h-full shadow-lg">
                  {/* Poster */}
                  <figure className="aspect-[2/3] overflow-hidden relative w-full bg-black">
                    {poster ? (
                      <img
                        src={poster}
                        alt={title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          // Use a guaranteed external placeholder if local one is missing
                          e.currentTarget.src = "https://via.placeholder.com/500x750?text=No+Poster";
                        }}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                    
                    {/* Genre Badge */}
                    <div className="absolute top-2 left-2 text-black text-[10px] font-black px-2 py-0.5 rounded bg-gradient-to-r from-[#00C6FF] to-[#00E29F] uppercase">
                      {String(Array.isArray(genre) ? genre[0] : genre).split(" ")[0]}
                    </div>
                  </figure>

                  {/* Title + Info */}
                  <div className="p-3 flex flex-col justify-between flex-grow bg-gray-900">
                    <h3 className="text-sm font-bold line-clamp-1 text-white group-hover:text-[#00C6FF] transition-colors">
                      {title}
                    </h3>

                    <div className="mt-2 text-[11px] text-gray-400 flex justify-between items-center">
                      <span>{year}</span>
                      <span className="text-yellow-500 font-bold">⭐ {rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}