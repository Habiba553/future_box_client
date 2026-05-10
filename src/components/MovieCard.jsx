// src/components/MovieCard.jsx
import { Link } from "react-router-dom";

export const MovieCard = ({
  movie,
  onEdit,
  onDelete,
  deleting = false,
  showActions = true,
}) => {
  // prefer joined movie doc if server attached it (movie.movieDoc), otherwise use the item itself
  const doc = movie?.movieDoc ?? movie;

  const {
    _id,
    id,
    movieId,
    title: titleFromDoc,
    poster: posterFromDoc,
    genre: genreFromDoc,
    releaseYear: releaseYearFromDoc,
    director: directorFromDoc,
    cast: castFromDoc,
    plotSummary: plotSummaryFromDoc,
    language: languageFromDoc,
    country: countryFromDoc,
    rating: ratingFromDoc,
  } = doc || {};

  // fallback id/title/poster from top-level collection item if needed
  const title = titleFromDoc ?? movie.title ?? movie.name ?? "Untitled";
  const poster = posterFromDoc ?? movie.poster ?? movie.posterUrl ?? "";
  const releaseYear = releaseYearFromDoc ?? movie.releaseYear ?? "";
  const language = languageFromDoc ?? movie.language ?? "";
  const country = countryFromDoc ?? movie.country ?? "";
  const director = directorFromDoc ?? movie.director ?? "";
  const cast = castFromDoc ?? movie.cast ?? "";
  const plotSummary = plotSummaryFromDoc ?? movie.plotSummary ?? movie.overview ?? "";
  const ratingRaw = ratingFromDoc ?? movie.rating ?? null;

  // normalize id used for links (prefer original movie id if available)
  const movieIdFinal = movieId ?? (_id ?? id) ?? movie.movieId ?? movie._id ?? movie.id ?? "";

  // Normalize rating: only show when it's a finite number
  const rating = (ratingRaw === null || ratingRaw === undefined || ratingRaw === "")
    ? null
    : Number.isFinite(Number(ratingRaw))
    ? Number(ratingRaw)
    : null;

  // Normalize genre into array of strings (handles array, comma string, or single string)
  const rawGenre = genreFromDoc ?? movie.genre ?? null;
  let genreList = [];
  if (rawGenre) {
    if (Array.isArray(rawGenre)) {
      genreList = rawGenre.map((g) => String(g).trim()).filter(Boolean);
    } else if (typeof rawGenre === "string") {
      if (rawGenre.includes(",")) {
        genreList = rawGenre.split(",").map((g) => g.trim()).filter(Boolean);
      } else {
        const v = rawGenre.trim();
        if (v) genreList = [v];
      }
    } else {
      const v = String(rawGenre).trim();
      if (v) genreList = [v];
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Poster */}
      <figure className="h-48 overflow-hidden relative">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </figure>

      {/* Body */}
      <div className="card-body">
        {/* Title */}
        <h2 className="card-title text-lg font-semibold">{title}</h2>

        {/* Genres: render as multiple badges */}
        {genreList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {genreList.map((g) => (
              <span key={g} className="badge badge-secondary rounded-full text-xs">
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Meta line */}
        <div className="text-xs text-gray-500 mt-2">
          {(releaseYear || language || country)
            ? `${releaseYear || ""}${releaseYear && (language || country) ? " • " : ""}${language || ""}${language && country ? " • " : ""}${country || ""}`
            : null}
        </div>
  
   {/* ADDED BY */}
{(movie?.movieDoc?.addedBy || movie?.addedBy) && (
  <div className="text-xs text-gray-500 mt-1">
    <span className="font-medium">Added by:</span>{" "}
    <span className="text-sm">{movie?.movieDoc?.addedBy ?? movie?.addedBy}</span>
  </div>
)}

        {director && (
          <p className="text-sm mt-2">
            <span className="font-semibold">Director:</span> {director}
          </p>
        )}

        {cast && (
          <p className="text-sm">
            <span className="font-semibold">Cast:</span> {Array.isArray(cast) ? cast.join(", ") : cast}
          </p>
        )}

        {plotSummary && (
          <p className="text-sm line-clamp-2 mt-1">{plotSummary}</p>
        )}

        {/* ⭐ Rating + View (rating hidden when not present) */}
        <div className="card-actions justify-between items-center mt-4">
          <div className="flex gap-4 text-sm text-base-content/60">
            {rating !== null && <span className="font-semibold">⭐ {rating}</span>}
          </div>

          <Link
            to={`/movie-details/${movieIdFinal}`}
            className="btn rounded-full bg-gradient-to-r from-pink-500 to-red-600 hover:from-red-600 hover:to-pink-500 text-white btn-sm"
          >
            View Details
          </Link>
        </div>

        {/* Update + Delete Buttons (Only Visible When Props Are Provided) */}
        {showActions && (onEdit || onDelete) && (
          <div className="flex justify-end gap-2 mt-3">
            {onEdit && (
              <button
                onClick={() => onEdit(movie)}
                className="btn btn-outline btn-sm rounded-full"
              >
                Update
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(movie)}
                className="btn btn-error btn-sm rounded-full text-white"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
