// src/pages/AddMovie.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

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
      cast: e.target.cast.value.trim(),
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
      toast.success("Movie added successfully!");
      navigate("/movies", { replace: true, state: { newMovie: result } });
    } catch (err) {
      console.error("Failed to add movie:", err);
      toast.error(`Add failed: ${err.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 min-h-screen">
      <div className="card bg-base-100 w-full max-w-3xl mx-auto shadow-2xl rounded-3xl overflow-hidden border border-base-300">
        {/* Header with the sky-blue gradient matching UpdateMovie */}
        <div className="bg-gradient-to-r from-sky-400 to-cyan-500 p-8 text-white text-center">
          <h2 className="text-3xl font-bold">Add New Movie</h2>
          <p className="opacity-80 mt-1">Share a new cinematic masterpiece with the collection</p>
        </div>

        <div className="card-body p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Movie Title</span></label>
              <input
                name="title"
                type="text"
                required
                placeholder="Enter movie title"
                className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-sky-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Poster URL</span></label>
                <input
                  name="poster"
                  type="url"
                  required
                  placeholder="https://example.com/poster.jpg"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Genre</span></label>
                <input
                  name="genre"
                  placeholder="Action, Drama, Sci-Fi..."
                  className="input input-bordered w-full rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Release Year</span></label>
                <input
                  name="releaseYear"
                  type="number"
                  placeholder="2024"
                  className="input input-bordered w-full rounded-xl"
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
                  placeholder="8.5"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Language</span></label>
                <input
                  name="language"
                  placeholder="English"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Director</span></label>
                <input
                  name="director"
                  placeholder="Director name"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Country</span></label>
                <input
                  name="country"
                  placeholder="Country of origin"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Cast (comma separated)</span></label>
              <input
                name="cast"
                placeholder="Actor 1, Actor 2, Actor 3..."
                className="input input-bordered w-full rounded-xl"
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Plot Summary</span></label>
              <textarea
                name="plotSummary"
                rows={4}
                placeholder="Enter a brief synopsis of the movie..."
                className="textarea textarea-bordered w-full rounded-2xl"
              />
            </div>

            {user?.email && (
              <div className="p-4 bg-base-200 rounded-2xl flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500">Adding by</span>
                <span className="badge badge-ghost p-3">{user.email}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`btn btn-block text-white rounded-xl text-lg font-bold shadow-lg transition-all duration-300 border-none
                ${submitting ? 'loading' : 'bg-gradient-to-r from-sky-400 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 hover:scale-[1.02]'}`}
            >
              {submitting ? "Adding to Collection..." : "Add Movie Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMovie;