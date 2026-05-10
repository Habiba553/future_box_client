import React from "react";
import { useRouteError, Link } from "react-router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <>
      <Navbar />
      <div
        className="flex flex-col items-center justify-center h-[80vh] text-center px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/plants4.jpg')`,
        }}
      >
        <div className="bg-white/80 p-6 rounded-xl shadow-lg">
          <img
            src="/images/error4044.jpg"
            alt="Not Found"
            className="max-w-sm mb-6 mx-auto"
          />
          <h1 className="text-4xl text-gray-700 font-bold mb-2">Oops, page not found!</h1>
          <p className="text-gray-700 mb-4">
            {error?.message || "The page you are looking for is not available.."}
          </p>
          <Link
            to="/"
            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ErrorPage;
