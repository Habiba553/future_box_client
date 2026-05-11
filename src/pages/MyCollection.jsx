// src/pages/MyCollection.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";

const PAGE_SIZE = 4;

const getMovieDocField = (m, field) => {
  return m?.movieDoc?.[field] ?? m?.[field] ?? m?.movie?.[field];
};

const MyCollection = () => {
  const { user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);

  // UI state - Kept Search and Pagination
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  // Fetch basic collection
  useEffect(() => {
    if (!user?.email) {
      setMovies([]);
      setLoading(false);
      return;
    }

    const abort = new AbortController();
    setLoading(true);

    const url = `http://localhost:3000/my-collection?email=${encodeURIComponent(user.email)}`;

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(user?.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {}),
      },
      signal: abort.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch collection");
        return res.json();
      })
      .then((data) => {
        setMovies(Array.isArray(data) ? data : []);
        setPage(1);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Error loading collection:", err);
        toast.error("Failed to load your collection.");
        setMovies([]);
      })
      .finally(() => setLoading(false));

    return () => abort.abort();
  }, [user]);

  // Client-side Search Logic
  const filtered = useMemo(() => {
    const q = String(query || "").trim().toLowerCase();
    return movies.filter((m) => {
      if (!q) return true;
      const title = String(getMovieDocField(m, "title") ?? getMovieDocField(m, "name") ?? "").toLowerCase();
      return title.includes(q);
    });
  }, [movies, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageSafe = Math.min(Math.max(1, page), totalPages);

  const paged = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageSafe]);

  const handleDelete = async (collectionItem) => {
    if (!collectionItem) return;
    const confirm = await Swal.fire({
      title: "Remove this movie?",
      text: getMovieDocField(collectionItem, "title") ?? "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });

    if (!confirm.isConfirmed) return;

    const idToDelete = collectionItem._id ?? collectionItem.id ?? collectionItem.movieId;
    try {
      setSubmittingId(idToDelete);
      const res = await fetch(`http://localhost:3000/my-collection/${encodeURIComponent(idToDelete)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(user?.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      setMovies((prev) => prev.filter((m) => String(m._id ?? m.id) !== String(idToDelete)));
      toast.success("Removed from collection");
    } catch (err) {
      toast.error("Failed to remove movie");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleEdit = (collectionItem) => {
    const movieId = collectionItem.movieId ?? getMovieDocField(collectionItem, "_id") ?? collectionItem._id;
    navigate(`/update-movie/${encodeURIComponent(movieId)}`);
  };

  const onSearchChange = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="px-6 text-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
        <p>Loading your collection...</p>
      </div>
    );
  }

  return (
    <div className="px-6">
      <h2 className="text-3xl font-bold text-center mt-5 mb-4"> My Movie Collection</h2>

      {/* Controls: Only Search remains */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
        <div className="w-full md:w-1/3">
          <input
            aria-label="Search collection"
            value={query}
            onChange={onSearchChange}
            placeholder="Search by title..."
            className="input input-bordered w-full"
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            <span className="font-semibold">{total}</span> {total === 1 ? "movie" : "movies"}
          </span>
          <span className="text-gray-400">|</span>
          <span>per page: {PAGE_SIZE}</span>
        </div>
      </div>

      {/* Grid */}
      {paged.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paged.map((movie) => {
            const key = movie._id ?? movie.id;
            return (
              <MovieCard
                key={key}
                movie={movie}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleting={submittingId === key}
                showActions={true}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No movies found matching "{query}"</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 border-t pt-4">
          <div className="text-sm text-gray-600">
            Showing <b>{(pageSafe - 1) * PAGE_SIZE + 1}</b> – <b>{Math.min(pageSafe * PAGE_SIZE, total)}</b> of <b>{total}</b>
          </div>

          <div className="join">
            <button 
              className="join-item btn btn-sm" 
              onClick={() => setPage((p) => p - 1)} 
              disabled={pageSafe === 1}
            >
              «
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button 
                key={idx} 
                className={`join-item btn btn-sm ${idx + 1 === pageSafe ? "btn-active" : ""}`} 
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button 
              className="join-item btn btn-sm" 
              onClick={() => setPage((p) => p + 1)} 
              disabled={pageSafe === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCollection;