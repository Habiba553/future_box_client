import React from "react";
import { Link } from "react-router-dom";

const TMDB_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieGrid({ movies = [] }) {
  return (
    <div className="pt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movies.map((m) => {
          const id = m._id ?? m.id ?? Math.random().toString(36).slice(2);

          // --- FIXED POSTER NORMALIZATION ---
          const posterRaw =
            m.posterUrl ??
            m.poster ??
            m.poster_path ??
            m.imageUrl ??
            "";

          let poster = "";

          if (posterRaw) {
            if (posterRaw.startsWith("/")) {
              // TMDB style poster path ("/abc123.jpg")
              poster = `${TMDB_BASE}${posterRaw}`;
            } else if (/^https?:\/\//i.test(posterRaw)) {
              // Already a full URL
              poster = posterRaw;
            } else {
              // Local filename like "poster.jpg"
              poster = `${window.location.origin}/${posterRaw.replace(/^\/+/, "")}`;
            }
          }
          // -------------------------------

          const title = m.title ?? "Untitled";
          const year = m.releaseYear ?? "—";
          const duration = m.duration ?? "";
          const rating = m.rating ?? "—";
          const genre = m.genre ?? "—";

          return (
            <div key={id} className="group h-full">
              <Link to={`/movie-details/${id}`} className="block h-full">
                <div className="relative overflow-hidden rounded-lg bg-gray-800 flex flex-col h-full">

                  {/* Poster */}
                  <figure className="h-48 overflow-hidden relative w-full bg-black">
                    {poster ? (
                      <img
                        src={poster}
                        alt={title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/placeholder-poster.png";
                        }}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </figure>

                  {/* Genre Badge */}
                  <div className="absolute top-2 left-2 text-black text-[11px] font-semibold px-2 py-0.5 rounded bg-gradient-to-r from-[#00C6FF] via-[#00DDBB] to-[#00E29F]">
                    {String(genre).split(" ")[0] ?? "HD"}
                  </div>

                  {/* Title + Info */}
                  <div className="p-3 flex flex-col justify-end gap-2">
                    <h3 className="text-sm font-semibold line-clamp-2 text-white flex items-center gap-1">
                      {title}
                      <span className="text-yellow-400 ml-1 text-xs">({rating})</span>
                    </h3>

                    <div className="mt-1 text-xs text-gray-300 flex items-center gap-2">
                      <span>{year}</span>
                      <span>•</span>
                      <span>{duration ? `${duration} min` : "—"}</span>
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
