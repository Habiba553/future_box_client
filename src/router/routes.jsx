// src/router/routes.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";
// Layouts
import MainLayout from "../layouts/MainLayout";
// Pages
import Homepage from "../pages/Homepage";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllMovies from "../pages/AllMovies";
import MovieDetails from "../pages/MovieDetails";
import UpdateMovie from "../pages/UpdateMovie";
import AddMovie from "../pages/AddMovie";
import MyCollection from "../pages/MyCollection";
import Profile from "../pages/Profile"; // <-- added
import PrivateRoute from './PrivateRoute';
import MyWatchlist from "../pages/MyWatchlist";

/**
 * Loader: fetch all movies for the /movies route
 */
export const moviesLoader = async () => {
  const res = await fetch("https://moviemaster-server-kappa.vercel.app/movies");
  if (!res.ok) {
    throw new Response("Failed to load movies", { status: res.status });
  }
  const data = await res.json();
  return data;
};

/**
 * Loader: fetch a single movie by id for routes that need it
 */
export const movieLoader = async ({ params }) => {
  const { id } = params;
  const res = await fetch(`https://moviemaster-server-kappa.vercel.app/movies/${id}`);
  if (!res.ok) {
    throw new Response("Failed to load movie", { status: res.status });
  }
  const data = await res.json();
  return data;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Homepage /> },

      // Movies list (loader provides initial data to useLoaderData inside AllMovies)
      { path: "movies", element: <AllMovies />, loader: moviesLoader },

      // Movie details + update (loader fetches the movie by id)
      { path: "movie-details/:id", element:  <MovieDetails />, loader: movieLoader },
      { path: "update-movie/:id", element:
      <PrivateRoute>
      <UpdateMovie />
    </PrivateRoute>, loader: movieLoader },

      // Add and personal collection
      { path: "add-movie", element: <AddMovie /> },
      { path: "my-collection", element: <PrivateRoute>
      <MyCollection />
    </PrivateRoute> },
      { path: "/watchlist", element: <MyWatchlist /> },
      

      // Auth routes (canonical /auth/*)
      { path: "auth/login", element: <Login /> },
      { path: "auth/register", element: <Register /> },

    ],
  },
]);
