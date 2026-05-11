// src/pages/UpdateMovie.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import { useNavigate } from "react-router-dom";

/**
 * UpdateMovie.jsx
 * Expects loader to provide the movie. Supports loader returning movie or { result: movie }.
 * - Form pre-filled with existing data
 * - All fields editable except `addedBy`
 * - Preserves addedBy and only sends normalized fields to the server
 */

const UpdateMovie = () => {
  const loaderData = useLoaderData();
  
  // FIX 1: Robustly unwrap movie data (checks result, movieDoc, or the object itself)
  const movie = loaderData?.result ?? loaderData?.movieDoc ?? loaderData;
  
  // FIX 2: Explicitly capture the ID and ensure it's a string to prevent "undefined" URLs
  const movieId = movie?._id?.toString() || movie?.id?.toString();
  
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (!movie || !movieId) {
    return (
      <div className="card bg-base-100 w-full max-w-md mx-auto shadow-2xl rounded-2xl p-6">
        <div className="text-center text-error font-bold">
          No movie found to update. (ID Missing or Data structure mismatch)
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

    // Build payload carefully
    const payload = {};

    if (rawTitle) payload.title = rawTitle;
    if (rawPoster) {
        payload.poster = rawPoster;
        payload.posterUrl = rawPoster; // Ensure compatibility with both field names
    }

    if (rawGenre) {
      const maybeArray = rawGenre.includes(",")
        ? rawGenre.split(",").map((s) => s.trim()).filter(Boolean)
        : [rawGenre];
      payload.genre = maybeArray;
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
      // FIX 3: Ensure the URL is constructed with a verified string ID
      const updateUrl = `http://localhost:3000/movies/${movieId}`;
      
      const res = await fetch(updateUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Specifically catch the "Movie not found" error from backend response
        throw new Error(responseData.error || responseData.message || `HTTP ${res.status}`);
      }

      toast.success("Movie updated successfully!");
      await Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Movie updated successfully.",
        timer: 1400,
        showConfirmButton: false,
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
    <div className="card bg-base-100 w-full max-w-2xl mx-auto shadow-2xl rounded-2xl">
      <div className="card-body p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Update Movie</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label font-medium">Title</label>
            <input
              name="title"
              defaultValue={movie.title ?? ""}
              required
              className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
              placeholder="Movie title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="label font-medium">Poster URL</label>
              <input
                name="poster"
                type="url"
                defaultValue={movie.poster ?? movie.posterUrl ?? ""}
                required
                className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="label font-medium">Genre</label>
              <input
                name="genre"
                defaultValue={
                  Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre ?? ""
                }
                className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
                placeholder="Action, Drama..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="label font-medium">Release Year</label>
              <input
                name="releaseYear"
                type="number"
                defaultValue={movie.releaseYear ?? ""}
                className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
                placeholder="2024"
              />
            </div>

            <div>
              <label className="label font-medium">Rating</label>
              <input
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                defaultValue={movie.rating ?? ""}
                className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
                placeholder="8.5"
              />
            </div>

            <div>
              <label className="label font-medium">Language</label>
              <input
                name="language"
                defaultValue={movie.language ?? ""}
                className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
                placeholder="English"
              />
            </div>
          </div>

          <div>
            <label className="label font-medium">Director</label>
            <input
              name="director"
              defaultValue={movie.director ?? ""}
              className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
              placeholder="Director name"
            />
          </div>

          <div>
            <label className="label font-medium">Cast (comma separated)</label>
            <input
              name="cast"
              defaultValue={Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast ?? ""}
              className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
              placeholder="Actor 1, Actor 2, ..."
            />
          </div>

          <div>
            <label className="label font-medium">Country</label>
            <input
              name="country"
              defaultValue={movie.country ?? ""}
              className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
              placeholder="Country"
            />
          </div>

          <div>
            <label className="label font-medium">Plot Summary</label>
            <textarea
              name="plotSummary"
              defaultValue={movie.plotSummary ?? movie.overview ?? ""}
              rows={6}
              className="textarea w-full rounded-2xl focus:border-0 focus:outline-gray-200"
              placeholder="Short synopsis"
            />
          </div>

          {movie.addedBy && (
            <div>
              <label className="label font-medium">Added By</label>
              <input
                type="text"
                value={movie.addedBy}
                disabled
                className="input w-full rounded-full bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn w-full text-white mt-2 rounded-full bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 border-none"
          >
            {submitting ? "Updating..." : "Update Movie"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateMovie;