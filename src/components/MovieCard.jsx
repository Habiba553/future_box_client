// src/components/MovieCard.jsx
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export const MovieCard = ({
  movie,
  onEdit,
  onDelete,
  deleting = false,
  showActions = true,
}) => {
  // --- STEP 1: UNWRAP NESTED DATA ---
  
  const doc = movie?.movieDoc ?? movie ?? {};

  // --- STEP 2: EXTRACT WITH FALLBACKS ---
  const {
    _id,
    id,
    movieId,
    title,
    name,
    poster,
    posterUrl,
    genre,
    releaseYear,
    rating,
  } = doc;

  // Final fallbacks to ensure nothing is undefined
  const displayTitle = title ?? name ?? movie.title ?? "Untitled";
  const displayYear = releaseYear ?? movie.releaseYear ?? "N/A";
  
  // --- STEP 3: IMAGE NORMALIZATION ---
  const TMDB_BASE = "https://image.tmdb.org/t/p/w500";
  
  
  const rawPoster = poster ?? posterUrl ?? movie.poster ?? movie.posterUrl ?? "";
  
  let finalPoster = "";
  if (typeof rawPoster === 'string' && rawPoster.length > 0) {
    finalPoster = rawPoster.startsWith("/") 
      ? `${TMDB_BASE}${rawPoster}` 
      : rawPoster;
  }

  const movieIdFinal = movieId ?? (_id ?? id ?? movie._id ?? movie.id ?? "");

  const displayGenre = Array.isArray(genre) 
    ? genre[0] 
    : (genre?.split(',')[0] ?? "Movie");

  return (
    <div className="group flex flex-col bg-base-100 transition-all duration-300">
      <div className="relative overflow-hidden aspect-[2/3] rounded-sm bg-base-300 shadow-lg mb-4">
        <img
          src={finalPoster || "https://via.placeholder.com/500x750?text=No+Poster"}
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://via.placeholder.com/500x750?text=No+Poster";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 bg-[#24BAEF] text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter z-10">
          {displayGenre}
        </div>

        {rating && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md text-yellow-400 text-[10px] font-bold px-2 py-1 rounded-sm z-10">
            <FaStar size={8} /> {rating}
          </div>
        )}

        {/* Hover Details Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <Link
            to={`/movie-details/${movieIdFinal}`}
            className="px-5 py-2 bg-[#24BAEF] text-white text-[10px] font-black uppercase tracking-widest rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
          >
            View Details
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-1">
        <span className="text-[10px] font-bold text-[#24BAEF] uppercase tracking-widest opacity-80">
          {displayYear}
        </span>
        <Link to={`/movie-details/${movieIdFinal}`}>
          <h3 className="text-sm font-black text-base-content uppercase tracking-tight line-clamp-1 group-hover:text-[#24BAEF] transition-colors duration-300">
            {displayTitle}
          </h3>
        </Link>
      </div>

      {showActions && (onEdit || onDelete) && (
        <div className="flex gap-2 mt-3 z-30">
          {onEdit && (
            <button onClick={() => onEdit(movie)} className="btn btn-xs btn-outline rounded-none border-base-content/20">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(movie)} className="btn btn-xs btn-error btn-outline rounded-none" disabled={deleting}>
              {deleting ? "..." : "Del"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieCard;