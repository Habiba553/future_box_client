// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import TopRated from "../components/TopRated";
import RecentlyAdded from "../components/RecentlyAdded";
import GenreSection from "../components/GenreSection";
import AboutSection from "../components/AboutSection";
import NavBar from "../Components/Navbar";
import Footer from './../components/Footer';


const MainLayout = () => {
  return (
    <div>
    <NavBar />
      <div className="max-w-7xl mx-auto">
      <main className="flex-1">
        <Outlet /> {/* <-- THIS must be present for child routes to show */}
      </main>
      </div>
      <Footer/>
      <Toaster />
    </div>
  );
};

export default MainLayout;
