// src/pages/UpdateMovie.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import { useNavigate } from "react-router-dom";

const UpdateMovie = () => {
  const loaderData = useLoaderData();
  
  /**
   * Robustly unwrap movie data. 
   */
  const movie = loaderData?.data ?? loaderData?.result ?? loaderData?.movieDoc ?? loaderData?.movie ?? loaderData;
  
  /**
   * FIX: Ensure the ID is captured. If your backend uses MongoDB, it is likely _id.
   */
  const movieId = movie?._id?.toString() || movie?.id?.toString();
  
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (!movie || !movieId) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="card bg-base-100 w-full max-w-md shadow-2xl rounded-2xl p-8 border border-red-100">
          <div className="text-center text-error font-bold text-lg">
            Movie Not Found
          </div>
          <p className="text-center text-gray-500 mt-2">
            The system couldn't find a valid Movie ID. Please ensure the URL is correct or the data is loading properly.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Final safety check for the ID before calling the API
    if (!movieId) {
      toast.error("Error: Could not find movie ID.");
      setSubmitting(false);
      return;
    }

    const form = e.target;
    const payload = {
      title: form.title.value.trim(),
      poster: form.poster.value.trim(),
      genre: form.genre.value.includes(",")
        ? form.genre.value.split(",").map((s) => s.trim()).filter(Boolean)
        : [form.genre.value.trim()],
      releaseYear: Number(form.releaseYear.value),
      rating: parseFloat(form.rating.value),
      director: form.director.value.trim(),
      cast: form.cast.value.includes(",")
        ? form.cast.value.split(",").map((s) => s.trim()).filter(Boolean)
        : [form.cast.value.trim()],
      plotSummary: form.plotSummary.value.trim(),
      language: form.language.value.trim(),
      country: form.country.value.trim(),
    };

    if (movie.addedBy) payload.addedBy = movie.addedBy;
    if (movie.addedByUid) payload.addedByUid = movie.addedByUid;

    try {
      /**
       * UPDATED: Using the verified movieId variable. 
       * Ensure your backend route is: router.put("/movies/:id", ...)
       */
      const updateUrl = `http://localhost:3000/movies/${movieId}`;
      
      const res = await fetch(updateUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        // This captures the "Movie not found" message coming from your server
        throw new Error(responseData.error || responseData.message || `HTTP ${res.status}`);
      }

      toast.success("Movie updated successfully!"); 
      
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "The movie has been updated.",
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-3xl' }
      });

      navigate("/movies", { replace: true });
    } catch (err) {
      console.error("Update error detail:", err);
      // This displays the error message sent by your backend
      toast.error(`Update failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 min-h-screen">
      <div className="card bg-base-100 w-full max-w-3xl mx-auto shadow-2xl rounded-3xl overflow-hidden border border-base-300">
        <div className="bg-gradient-to-r from-sky-400 to-cyan-500 p-8 text-white text-center">
            <h2 className="text-3xl font-bold">Update Movie Details</h2>
            <p className="opacity-80 mt-1">Refine the information for: <span className="font-semibold underline">{movie.title}</span></p>
        </div>

        <div className="card-body p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Movie Title</span></label>
              <input
                name="title"
                defaultValue={movie.title ?? ""}
                required
                className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-sky-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Poster URL</span></label>
                <input
                  name="poster"
                  type="url"
                  defaultValue={movie.poster ?? movie.posterUrl ?? ""}
                  required
                  className="input input-bordered w-full rounded-xl"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Genre</span></label>
                <input
                  name="genre"
                  defaultValue={Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre ?? ""}
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
                  defaultValue={movie.releaseYear ?? ""}
                  className="input input-bordered w-full rounded-xl"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Rating (0-10)</span></label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  defaultValue={movie.rating ?? ""}
                  className="input input-bordered w-full rounded-xl"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Language</span></label>
                <input
                  name="language"
                  defaultValue={movie.language ?? ""}
                  className="input input-bordered w-full rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                <label className="label"><span className="label-text font-bold">Director</span></label>
                <input
                    name="director"
                    defaultValue={movie.director ?? ""}
                    className="input input-bordered w-full rounded-xl"
                />
                </div>
                <div className="form-control">
                <label className="label"><span className="label-text font-bold">Country</span></label>
                <input
                    name="country"
                    defaultValue={movie.country ?? ""}
                    className="input input-bordered w-full rounded-xl"
                />
                </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Cast (comma separated)</span></label>
              <input
                name="cast"
                defaultValue={Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast ?? ""}
                className="input input-bordered w-full rounded-xl"
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Plot Summary</span></label>
              <textarea
                name="plotSummary"
                defaultValue={movie.plotSummary ?? movie.overview ?? ""}
                rows={4}
                className="textarea textarea-bordered w-full rounded-2xl"
              />
            </div>

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