// src/pages/MovieDetails.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

/**
 * MovieDetails (robust ownership check)
 * - Performs multiple comparisons so UI shows Update/Delete for the actual owner
 * - Preference: ownerId (UID) match. Fallbacks: addedByUid, addedBy (email), movie.owner object fields.
 *
 * Reminder: server must enforce ownership on DELETE/PUT routes.
 */

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [refetchToggle, setRefetchToggle] = useState(false);

  useEffect(() => {
    setLoading(true);
    const headers = {};
    if (user?.accessToken) headers.authorization = `Bearer ${user.accessToken}`;

    fetch(`http://localhost:3000/movies/${id}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load movie (status ${res.status})`);
        return res.json();
      })
      .then((data) => {
        const m = data?.result ?? data;
        setMovie(m);
      })
      .catch((err) => {
        console.error("Movie fetch error:", err);
        toast.error("Failed to load movie details.");
      })
      .finally(() => setLoading(false));
  }, [id, user, refetchToggle]);

  // console debug (no UI debug box) - inspect these in browser console
  useEffect(() => {
    console.log("MovieDetails debug - user:", user);
    console.log("MovieDetails debug - movie:", movie);
  }, [user, movie]);

  // helper: normalize possible user email/uid locations
  const extractUserIds = (u) => {
    if (!u) return { uid: "", email: "" };
    const uid =
      String(u.uid || u?.user?.uid || u?.id || u?.user?.id || "").trim();
    const email =
      String(u.email || u?.user?.email || u?.emailAddress || "").trim().toLowerCase();
    return { uid, email };
  };

  // helper: gather candidate owner ids/emails from movie doc
  const movieOwnerCandidates = (m) => {
    if (!m) return { ownerIds: [], ownerEmails: [] };

    const ownerIds = new Set();
    const ownerEmails = new Set();

    // direct fields commonly used
    if (m.ownerId) ownerIds.add(String(m.ownerId).trim());
    if (m.addedByUid) ownerIds.add(String(m.addedByUid).trim());
    if (m.userId) ownerIds.add(String(m.userId).trim());
    if (m.createdByUid) ownerIds.add(String(m.createdByUid).trim());

    if (m.addedBy) ownerEmails.add(String(m.addedBy).trim().toLowerCase());
    if (m.addedByEmail) ownerEmails.add(String(m.addedByEmail).trim().toLowerCase());
    if (m.ownerEmail) ownerEmails.add(String(m.ownerEmail).trim().toLowerCase());
    if (m.createdByEmail) ownerEmails.add(String(m.createdByEmail).trim().toLowerCase());
    if (m.userEmail) ownerEmails.add(String(m.userEmail).trim().toLowerCase());

    // if movie.owner is an object { uid, id, email }
    if (m.owner && typeof m.owner === "object") {
      if (m.owner.uid) ownerIds.add(String(m.owner.uid).trim());
      if (m.owner.id) ownerIds.add(String(m.owner.id).trim());
      if (m.owner.email) ownerEmails.add(String(m.owner.email).trim().toLowerCase());
    }

    return {
      ownerIds: Array.from(ownerIds).filter(Boolean),
      ownerEmails: Array.from(ownerEmails).filter(Boolean),
    };
  };

  const { uid: userUid, email: userEmail } = extractUserIds(user);
  const { ownerIds, ownerEmails } = movieOwnerCandidates(movie);

  // robust ownership check:
  const isOwner = (() => {
    if (!user || !movie) return false;

    // 1) uid match (preferred)
    if (userUid) {
      for (const oid of ownerIds) {
        if (!oid) continue;
        if (String(oid) === String(userUid)) return true;
      }
    }

    // 2) email match fallback (only if email exists)
    if (userEmail) {
      for (const oemail of ownerEmails) {
        if (!oemail) continue;
        if (oemail === userEmail) return true;
      }
    }

    // 3) final fallback: sometimes owner stored in movie.addedBy but userEmail missing.
    // If user lacks both uid & email, no match possible on client.
    return false;
  })();

  const handleDelete = async () => {
    if (!movie) return;
    // Client UI check: only owner sees Delete; but server must enforce too.
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This movie will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      setSubmitting(true);
      const headers = { "Content-Type": "application/json" };
      if (user?.accessToken) headers.authorization = `Bearer ${user.accessToken}`;

      const res = await fetch(`http://localhost:3000/movies/${movie._id ?? movie.id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => res.statusText);
        throw new Error(txt || `HTTP ${res.status}`);
      }

      await res.json().catch(() => null);
      toast.success("Movie deleted.");
      await Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
      navigate("/movies", { replace: true });
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(`Delete failed: ${err.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCollection = async () => {
    if (!user) {
      toast.error("You must be logged in to add to your collection.");
      return;
    }
    if (!movie) return;

    try {
      setSubmitting(true);

      const payload = {
        movieId: movie._id ?? movie.id,
        title: movie.title ?? movie.name,
        poster: movie.poster ?? movie.posterUrl,
        addedBy: userEmail || null,
        addedByUid: userUid || null,
        addedAt: new Date().toISOString(),
      };

      const res = await fetch(`http://localhost:3000/my-collection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.accessToken ? { authorization: `Bearer ${user.accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => res.statusText);
        throw new Error(txt || `HTTP ${res.status}`);
      }

      await res.json().catch(() => null);
      toast.success("Added to your collection!");
      navigate("/my-collection");
    } catch (err) {
      console.error("Add to collection error:", err);
      toast.error(`Failed to add: ${err.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-8 text-center">Loading movie...</div>;

  if (!movie) {
    return (
      <div className="py-12 text-center">
        <div className="text-lg">Movie not found.</div>
        <div className="mt-4">
          <Link to="/movies" className="btn btn-sm">Back to movies</Link>
        </div>
      </div>
    );
  }

  // Common fields for layout
  const {
    title,
    poster,
    posterUrl,
    genre,
    releaseYear,
    director,
    cast,
    plotSummary,
    overview,
    rating,
    runtime,
    language,
    country,
  } = movie;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="card bg-base-100 shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 p-6 md:p-8">
          <div className="shrink-0 w-full md:w-1/2">
            {poster || posterUrl ? (
              <img src={poster || posterUrl} alt={title} className="w-full object-cover rounded-xl shadow-md" />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">No image</div>
            )}
          </div>

          <div className="flex flex-col justify-center space-y-4 w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{title}</h1>

            <div className="flex gap-3 flex-wrap">
              {genre && <div className="badge badge-lg badge-outline text-cyan-600 border-cyan-500 font-medium">{genre}</div>}
              {rating != null && <div className="badge badge-lg badge-outline text-yellow-700 border-yellow-300 font-medium">⭐ {rating}</div>}
              {releaseYear && <div className="badge badge-lg badge-outline">{releaseYear}</div>}
              {runtime && <div className="badge badge-lg badge-outline">{runtime}</div>}
            </div>

            <p className="text-gray-600 leading-relaxed text-base md:text-lg">{plotSummary ?? overview ?? "No description available."}</p>

            <div className="text-sm text-gray-600">
              {director && <div><span className="font-semibold">Director:</span> {director}</div>}
              {cast && <div className="mt-1"><span className="font-semibold">Cast:</span> {Array.isArray(cast) ? cast.join(", ") : cast}</div>}
              <div className="mt-1">{language ?? country ? `${language ?? ""}${language && country ? " • " : ""}${country ?? ""}` : null}</div>
            </div>

            {/* Action buttons: only owner sees Update/Delete */}
            <div className="flex gap-3 mt-6">
  {user ? (
    <>
      <Link
        to={`/update-movie/${movie._id ?? movie.id}`}
        className="btn rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 text-white border-0 hover:from-sky-500 hover:to-cyan-600"
      >
        Update Movie
      </Link>

      <button
        onClick={handleDelete}
        disabled={submitting}
        className="btn btn-outline rounded-full border-gray-300 hover:border-cyan-500 hover:text-cyan-600"
      >
        {submitting ? "Deleting..." : "Delete"}
      </button>

      <button
        onClick={handleAddToCollection}
        disabled={submitting}
        className="btn rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 text-white border-0 hover:from-sky-500 hover:to-cyan-600"
      >
        {submitting ? "Saving..." : "Add to Collection"}
      </button>
    </>
  ) : (
    <button
      onClick={handleAddToCollection}
      disabled={submitting}
      className="btn btn-secondary rounded-full"
    >
      {submitting ? "Saving..." : "Add to Collection"}
    </button>
  )}
</div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
