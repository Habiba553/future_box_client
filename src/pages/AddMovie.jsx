// src/pages/AddMovie.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

/**
 * AddMovie
 * Simple form to add a movie to your local API at http://localhost:3000/movies
 *
 * Adjust field names/endpoint if your backend expects different keys.
 */

const AddMovie = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: e.target.title.value.trim(),
      poster: e.target.poster.value.trim(),
      genre: e.target.genre.value.trim(),
      releaseYear: e.target.releaseYear.value ? Number(e.target.releaseYear.value) : null,
      director: e.target.director.value.trim(),
      cast: e.target.cast.value.trim(), // backend may accept string or array
      plotSummary: e.target.plotSummary.value.trim(),
      language: e.target.language.value.trim(),
      country: e.target.country.value.trim(),
      rating: e.target.rating.value ? parseFloat(e.target.rating.value) : null,
      addedAt: new Date().toISOString(),
      created_by: user?.email ?? "anonymous",
    };

    try {
      const res = await fetch("http://localhost:3000/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(text || `HTTP ${res.status}`);
      }

      const result = await res.json();
      console.log("Add movie result:", result);
      toast.success("Movie added successfully!");
      // navigate to movies list and pass the new movie in navigation state
      navigate("/movies", { replace: true, state: { newMovie: result } });
    } catch (err) {
      console.error("Failed to add movie:", err);
      toast.error(`Add failed: ${err.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card border border-gray-200 bg-base-100 w-full max-w-2xl mx-auto shadow-2xl rounded-2xl">
      <div className="card-body p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Add New Movie</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label font-medium">Title</label>
            <input
              name="title"
              type="text"
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
                required
                className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div>
              <label className="label font-medium">Genre</label>
              <input
                name="genre"
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
                className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
                placeholder="8.5"
              />
            </div>

            <div>
              <label className="label font-medium">Language</label>
              <input
                name="language"
                className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
                placeholder="English"
              />
            </div>
          </div>

          <div>
            <label className="label font-medium">Director</label>
            <input
              name="director"
              className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
              placeholder="Director name"
            />
          </div>

          <div>
            <label className="label font-medium">Cast (comma separated)</label>
            <input
              name="cast"
              className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
              placeholder="Actor 1, Actor 2, ..."
            />
          </div>

          <div>
            <label className="label font-medium">Country</label>
            <input
              name="country"
              className="input w-full rounded-full focus:border-0 focus:outline-gray-200"
              placeholder="Country"
            />
          </div>

          <div>
            <label className="label font-medium">Plot Summary</label>
            <textarea
              name="plotSummary"
              rows={5}
              className="textarea w-full rounded-2xl focus:border-0 focus:outline-gray-200"
              placeholder="Short synopsis"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn w-full text-white mt-2 rounded-full bg-linear-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700"
          >
            {submitting ? "Adding..." : "Add Movie"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
