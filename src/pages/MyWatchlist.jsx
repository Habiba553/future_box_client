// src/pages/MyWatchlist.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom"; // Added Link import
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const MyWatchlist = () => {
  const { user } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the user's specific watchlist
  useEffect(() => {
    if (user?.email) {
      fetch(`https://moviemaster-server-kappa.vercel.app/watchlist?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setWatchlist(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  // 2. Handle Delete from Watchlist
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this from your watchlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#24BAEF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      customClass: { popup: 'rounded-3xl' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`https://moviemaster-server-kappa.vercel.app/watchlist/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            setWatchlist(watchlist.filter((item) => item._id !== id));
            toast.success("Removed from watchlist");
          }
        } catch (error) {
          toast.error("Failed to remove movie");
        }
      }
    });
  };

  if (loading) return <div className="text-center py-20"><span className="loading loading-spinner loading-lg text-sky-400"></span></div>;

  return (
    <div className="py-10 px-4 min-h-screen container mx-auto">
      <div className="card bg-base-100 shadow-2xl rounded-3xl overflow-hidden border border-base-300">
        <div className="bg-gradient-to-r from-sky-400 to-cyan-500 p-8 text-white text-center">
          <h2 className="text-3xl font-bold">My Watchlist</h2>
          <p className="opacity-80 mt-1">You have {watchlist.length} movies saved to watch later</p>
        </div>

        <div className="p-6 overflow-x-auto">
          {watchlist.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Your watchlist is currently empty.</p>
            </div>
          ) : (
            <table className="table w-full">
              <thead>
                <tr className="text-gray-600 text-sm">
                  <th>Movie</th>
                  <th>Genre</th>
                  <th>Release</th>
                  <th>Rating</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((movie) => (
                  <tr key={movie._id} className="hover:bg-base-200 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        {/* Wrap the avatar/poster in a Link */}
                        <Link 
                        to={`/movie-details/${movie.movieId || movie._id}`} 
  className="avatar cursor-pointer hover:opacity-80 transition-opacity"  >
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={movie.poster} alt={movie.title} />
                          </div>
                        </Link>
                        <div>
                          {/* Wrap the title in a Link */}
                          <Link 
                            to={`/movie-details/${movie.movieId || movie._id}`} 
  className="font-bold hover:text-sky-500 transition-colors cursor-pointer block"
                          >
                            {movie.title}
                          </Link>
                          <div className="text-sm opacity-50">{movie.language}</div>
                        </div>
                      </div>
                    </td>
                    <td>{movie.genre}</td>
                    <td>{movie.releaseYear}</td>
                    <td>
                        <span className="badge badge-ghost font-semibold text-sky-600">
                            ⭐ {movie.rating}
                        </span>
                    </td>
                    <th className="text-center">
                      <button 
                        onClick={() => handleDelete(movie._id)}
                        className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 rounded-full"
                      >
                        Delete
                      </button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyWatchlist;
