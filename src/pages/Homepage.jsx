import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import HeroSection from './../components/HeroSection';
import StatsSection from './../components/StatsSection';
import TopRated from './../components/TopRated';
import RecentlyAdded from './../components/RecentlyAdded';
import GenreSection from './../components/GenreSection';
import AboutSection from './../components/AboutSection';


const Homepage = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
      <HeroSection />
      <StatsSection />
      <TopRated />
      <RecentlyAdded />
      <GenreSection />
      <AboutSection />
      </div>
      <Toaster />
    </div>
  );
};

export default Homepage;
