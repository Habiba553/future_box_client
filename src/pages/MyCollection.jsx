// src/pages/MyCollection.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";

const PAGE_SIZE = 8;

// Helper getters that prefer the joined movieDoc (server lookup) then fallback
const getMovieDocField = (m, field) => {
  return m?.movieDoc?.[field] ?? m?.[field] ?? m?.movie?.[field];
};

const safeNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const MyCollection = () => {
  const { user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]); // each item may include movieDoc
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);

  // UI states
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("alpha-asc");
  const [selectedGenres, setSelectedGenres] = useState([]); // array of genre strings
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  // fetch collection from server and pass advanced filter params
  useEffect(() => {
    if (!user?.email) {
      setMovies([]);
      setLoading(false);
      return;
    }

    const abort = new AbortController();
    setLoading(true);

    const params = { email: user.email };
    if (selectedGenres.length > 0) params.genres = selectedGenres.join(",");
    if (minRating !== "") params.minRating = minRating;
    if (maxRating !== "") params.maxRating = maxRating;

    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && String(v) !== "")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

    const url = `http://localhost:3000/my-collection${qs ? `?${qs}` : ""}`;

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
  }, [user, selectedGenres, minRating, maxRating]);

  // derive available genres from fetched collection (use movieDoc when present)
  const availableGenres = useMemo(() => {
    const set = new Set();
    for (const m of movies) {
      const g = getMovieDocField(m, "genre");
      if (!g) continue;
      if (Array.isArray(g)) {
        g.forEach((gg) => gg && set.add(String(gg).trim()));
      } else {
        // handle comma-separated strings
        String(g)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((gg) => set.add(gg));
      }
    }
    return Array.from(set).sort();
  }, [movies]);

  // client-side search + sort + pagination on server-filtered results
  const filtered = useMemo(() => {
    const q = String(query || "").trim().toLowerCase();

    let arr = movies.filter((m) => {
      if (!q) return true;
      const title = String(getMovieDocField(m, "title") ?? getMovieDocField(m, "name") ?? "").toLowerCase();
      return title.includes(q);
    });

    // Sorting:
    if (sortBy === "alpha-asc") {
      arr = arr.sort((a, b) => {
        const ta = String(getMovieDocField(a, "title") ?? "").localeCompare(String(getMovieDocField(b, "title") ?? ""));
        return ta;
      });
    } else if (sortBy === "alpha-desc") {
      arr = arr.sort((a, b) => {
        return String(getMovieDocField(b, "title") ?? "").localeCompare(String(getMovieDocField(a, "title") ?? ""));
      });
    } else if (sortBy === "newest") {
      arr = arr.sort((a, b) => safeNumber(getMovieDocField(b, "releaseYear")) - safeNumber(getMovieDocField(a, "releaseYear")));
    } else if (sortBy === "highest-rating") {
      arr = arr.sort((a, b) => safeNumber(getMovieDocField(b, "rating"), -Infinity) - safeNumber(getMovieDocField(a, "rating"), -Infinity));
    }

    return arr;
  }, [movies, query, sortBy]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageSafe = Math.min(Math.max(1, page), totalPages);

  const paged = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageSafe]);

  // delete handler (collection item)
  const handleDelete = async (collectionItem) => {
    if (!collectionItem) return;

    const confirm = await Swal.fire({
      title: "Remove this movie from your collection?",
      text: getMovieDocField(collectionItem, "title") ?? collectionItem.title ?? collectionItem.name ?? "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });

    if (!confirm.isConfirmed) return;

    // prefer the collection document _id
    const idToDelete = collectionItem._id ?? collectionItem.id ?? collectionItem.movieId;
    if (!idToDelete) {
      toast.error("Cannot delete: missing identifier.");
      return;
    }

    try {
      setSubmittingId(idToDelete);
      const res = await fetch(`http://localhost:3000/my-collection/${encodeURIComponent(idToDelete)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(user?.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {}),
        },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => res.statusText);
        throw new Error(txt || `HTTP ${res.status}`);
      }

      let payload = null;
      try {
        payload = await res.json();
      } catch (e) {
        payload = null;
      }

      if (payload && (payload.success === false || payload.deletedCount === 0)) {
        throw new Error(payload.message || "Delete failed on server");
      }

      setMovies((prev) => prev.filter((m) => String(m._id ?? m.id) !== String(idToDelete)));
      toast.success("Removed from collection");
    } catch (err) {
      console.error("Delete collection item error:", err);
      toast.error(`Failed to remove: ${err.message || "Unknown error"}`);
    } finally {
      setSubmittingId(null);
    }
  };

  // edit navigation - prefer movieId (original movie) if available
  const handleEdit = (collectionItem) => {
    // prefer the original movie id (movieId) so update page can load the movie doc
    const movieId = collectionItem.movieId ?? getMovieDocField(collectionItem, "_id") ?? collectionItem._id ?? collectionItem.id;
    if (!movieId) {
      toast.error("Cannot edit: missing movie id.");
      return;
    }
    navigate(`/update-movie/${encodeURIComponent(movieId)}`);
  };

  // UI handlers
  const onSearchChange = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };
  const onSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  // multi-genre selection handler (works for multiple select element)
  const onGenresChange = (e) => {
    const options = Array.from(e.target.options || []);
    const vals = options.filter((o) => o.selected).map((o) => o.value).filter(Boolean);
    setSelectedGenres(vals);
    setPage(1);
  };

  const onMinRatingChange = (e) => {
    const v = e.target.value;
    setMinRating(v);
    setPage(1);
  };

  const onMaxRatingChange = (e) => {
    const v = e.target.value;
    setMaxRating(v);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="px-6">
        <h2 className="text-3xl font-bold text-center mt-5 mb-6">🎥 My Movie Collection</h2>
        <div className="mb-4 text-center text-gray-600">Loading your collection…</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-56 bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">🎬 No movies in your collection</h2>
        <p className="text-gray-600">Browse and add some favorites to see them here!</p>
      </div>
    );
  }

  return (
    <div className="px-6">
      <h2 className="text-3xl font-bold text-center mt-5 mb-4">🎥 My Movie Collection</h2>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-2/3">
          <input
            aria-label="Search collection"
            value={query}
            onChange={onSearchChange}
            placeholder="Search by title..."
            className="input input-bordered w-full md:w-1/3"
          />

          <select value={sortBy} onChange={onSortChange} className="select select-bordered">
            <option value="alpha-asc">Sort: A → Z</option>
            <option value="alpha-desc">Sort: Z → A</option>
            <option value="newest">Sort: Newest → Oldest</option>
            <option value="highest-rating">Sort: Highest Rating</option>
          </select>

          {/* multi-select genres */}
          <select
            multiple
            value={selectedGenres}
            onChange={onGenresChange}
            className="select select-bordered"
            style={{ minWidth: 180 }}
            title="Hold Ctrl/Cmd to select multiple"
          >
            <option value="">All Genres</option>
            {availableGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* rating range */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={minRating}
              onChange={onMinRatingChange}
              placeholder="min rating"
              className="input input-bordered w-28"
            />
            <span className="text-gray-500">—</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={maxRating}
              onChange={onMaxRatingChange}
              placeholder="max rating"
              className="input input-bordered w-28"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 justify-end w-full md:w-auto">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{total}</span> {total === 1 ? "movie" : "movies"}
          </div>

          <div className="text-sm text-gray-500">per page: {PAGE_SIZE}</div>
        </div>
      </div>

      {/* Grid */}
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{(pageSafe - 1) * PAGE_SIZE + 1}</span> –
          <span className="font-semibold"> {Math.min(pageSafe * PAGE_SIZE, total)}</span> of{" "}
          <span className="font-semibold">{total}</span>
        </div>

        <div className="btn-group">
          <button className="btn btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageSafe === 1}>
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pnum = idx + 1;
            return (
              <button key={pnum} className={`btn btn-sm ${pnum === pageSafe ? "btn-primary" : ""}`} onClick={() => setPage(pnum)}>
                {pnum}
              </button>
            );
          })}

          <button className="btn btn-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageSafe === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyCollection;
