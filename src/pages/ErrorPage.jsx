import React from "react";
import { useRouteError, Link } from "react-router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    // "bg-base-200" ensures the whole page background matches the theme
    <div className="min-h-screen flex flex-col bg-base-200 transition-colors duration-300">
      <Navbar />
      
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-10">
        {/* 
            Changed "bg-white/80" to "bg-base-100/80" 
            Added "text-base-content" to ensure text switches between black/white 
            Added "border border-base-content/10" for subtle dark mode visibility
        */}
        <div className="bg-base-100/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-base-content/10 max-w-lg transition-all duration-300">
          <img
            src="https://media.istockphoto.com/id/1404059706/vector/website-page-not-found-error-404-oops-worried-robot-character-peeking-out-of-outer-space.jpg?s=612x612&w=0&k=20&c=DvPAUof9UsNuNqCJy2Z7ZLLk75qDA3bbLXOOW_50wAk="
            alt="Not Found"
            className="max-w-sm mb-6 mx-auto rounded-xl shadow-md"
          />
          
          {/* Changed "text-gray-700" to "text-base-content" */}
          <h1 className="text-4xl font-black mb-2 text-base-content tracking-tight">
            Oops, page not found!
          </h1>
          
          {/* Changed "text-gray-700" to "text-base-content/70" (for a softer secondary look) */}
          <p className="text-base-content/70 mb-6 font-medium">
            {error?.message || "The page you are looking for is not available.."}
          </p>
          
          <Link
            to="/"
            className="btn border-none text-white px-8 py-2 rounded-lg bg-[#24BAEF] hover:bg-[#1da1d1] transition-all hover:scale-105 shadow-lg uppercase tracking-wider font-bold"
          >
            Go Home
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ErrorPage;