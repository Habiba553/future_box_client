// src/pages/UpdateMovie.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import { useNavigate } from "react-router-dom";

/**
 * UpdateMovie.jsx
 * - Form pre-filled with existing data
 * - Consistent assignment UI design
 * - Success Toast & SweetAlert2 notifications
 */

const UpdateMovie = () => {
  const loaderData = useLoaderData();
  
  // Robustly unwrap movie data
  const movie = loaderData?.result ?? loaderData?.movieDoc ?? loaderData;
  
  // Explicitly capture the ID and ensure it's a string
  const movieId = movie?._id?.toString() || movie?.id?.toString();
  
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (!movie || !movieId) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="card bg-base-100 w-full max-w-md shadow-2xl rounded-2xl p-8 border border-red-100">
          <div className="text-center text-error font-bold text-lg">
            No movie found to update.
          </div>
          <p className="text-center text-gray-500 mt-2">Please check the movie ID and try again.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Read values from form
    const rawTitle = e.target.title.value.trim();
    const rawPoster = e.target.poster.value.trim();
    const rawGenre = e.target.genre.value.trim();
    const rawReleaseYear = e.target.releaseYear.value.trim();
    const rawDirector = e.target.director.value.trim();
    const rawCast = e.target.cast.value.trim();
    const rawPlot = e.target.plotSummary.value.trim();
    const rawLanguage = e.target.language.value.trim();
    const rawCountry = e.target.country.value.trim();
    const rawRating = e.target.rating.value.trim();

    // Build payload
    const payload = {};
    if (rawTitle) payload.title = rawTitle;
    if (rawPoster) {
        payload.poster = rawPoster;
        payload.posterUrl = rawPoster; 
    }

    if (rawGenre) {
      payload.genre = rawGenre.includes(",")
        ? rawGenre.split(",").map((s) => s.trim()).filter(Boolean)
        : [rawGenre];
    }

    const ry = Number(rawReleaseYear);
    if (rawReleaseYear !== "" && Number.isFinite(ry)) {
      payload.releaseYear = ry;
    }

    if (rawDirector) payload.director = rawDirector;

    if (rawCast) {
      payload.cast = rawCast.includes(",")
        ? rawCast.split(",").map((s) => s.trim()).filter(Boolean)
        : [rawCast];
    }

    if (rawPlot) payload.plotSummary = rawPlot;
    if (rawLanguage) payload.language = rawLanguage;
    if (rawCountry) payload.country = rawCountry;

    if (rawRating !== "") {
      const r = parseFloat(rawRating);
      if (Number.isFinite(r)) payload.rating = r;
    }

    if (movie.addedBy) payload.addedBy = movie.addedBy;
    if (movie.addedByUid) payload.addedByUid = movie.addedByUid;

    try {
      const updateUrl = `http://localhost:3000/movies/${movieId}`;
      
      const res = await fetch(updateUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(responseData.error || responseData.message || `HTTP ${res.status}`);
      }

      // SUCCESS NOTIFICATIONS
      toast.success("Movie information updated successfully!"); // Toast Notification
      
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "The movie has been updated in the database.",
        timer: 2000,
        showConfirmButton: false,
        border: 'none',
        customClass: {
            popup: 'rounded-3xl'
        }
      });

      navigate("/movies", { replace: true });
    } catch (err) {
      console.error("Update movie error:", err);
      toast.error(`Update failed: ${err.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 min-h-screen bg-base-200/50">
      <div className="card bg-base-100 w-full max-w-3xl mx-auto shadow-2xl rounded-3xl overflow-hidden border border-base-300">
        {/* Header with Assignment Theme Gradient */}
        <div className="bg-gradient-to-r from-sky-400 to-cyan-500 p-8 text-white text-center">
            <h2 className="text-3xl font-bold">Update Movie Details</h2>
            <p className="opacity-80 mt-1">Refine the information for: <span className="font-semibold underline">{movie.title}</span></p>
        </div>

        <div className="card-body p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title Section */}
            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Movie Title</span></label>
              <input
                name="title"
                defaultValue={movie.title ?? ""}
                required
                className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-pink-500 transition-all"
                placeholder="Enter movie title"
              />
            </div>

            {/* Poster & Genre Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Poster URL</span></label>
                <input
                  name="poster"
                  type="url"
                  defaultValue={movie.poster ?? movie.posterUrl ?? ""}
                  required
                  className="input input-bordered w-full rounded-xl"
                  placeholder="https://image-link.com"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Genre</span></label>
                <input
                  name="genre"
                  defaultValue={Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre ?? ""}
                  className="input input-bordered w-full rounded-xl"
                  placeholder="Action, Drama, Sci-Fi"
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Release Year</span></label>
                <input
                  name="releaseYear"
                  type="number"
                  defaultValue={movie.releaseYear ?? ""}
                  className="input input-bordered w-full rounded-xl"
                  placeholder="2024"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Rating (0-10)</span></label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  defaultValue={movie.rating ?? ""}
                  className="input input-bordered w-full rounded-xl"
                  placeholder="8.5"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Language</span></label>
                <input
                  name="language"
                  defaultValue={movie.language ?? ""}
                  className="input input-bordered w-full rounded-xl"
                  placeholder="English"
                />
              </div>
            </div>

            {/* Production Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                <label className="label"><span className="label-text font-bold">Director</span></label>
                <input
                    name="director"
                    defaultValue={movie.director ?? ""}
                    className="input input-bordered w-full rounded-xl"
                    placeholder="Director name"
                />
                </div>

                <div className="form-control">
                <label className="label"><span className="label-text font-bold">Country</span></label>
                <input
                    name="country"
                    defaultValue={movie.country ?? ""}
                    className="input input-bordered w-full rounded-xl"
                    placeholder="e.g. USA"
                />
                </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Cast (comma separated)</span></label>
              <input
                name="cast"
                defaultValue={Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast ?? ""}
                className="input input-bordered w-full rounded-xl"
                placeholder="Actor name, Actor name..."
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Plot Summary</span></label>
              <textarea
                name="plotSummary"
                defaultValue={movie.plotSummary ?? movie.overview ?? ""}
                rows={4}
                className="textarea textarea-bordered w-full rounded-2xl"
                placeholder="Briefly describe the movie plot..."
              />
            </div>

            {/* Added By - read only visual feedback */}
            {movie.addedBy && (
              <div className="p-4 bg-base-200 rounded-2xl flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500">Contributed By</span>
                <span className="badge badge-ghost p-3">{movie.addedBy}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`btn btn-block text-white rounded-xl text-lg font-bold shadow-lg transition-all duration-300 border-none
  ${submitting ? 'loading' : 'bg-gradient-to-r from-sky-400 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 hover:scale-[1.02]'}`}
            >
              {submitting ? "Processing Update..." : "Update Movie Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateMovie;