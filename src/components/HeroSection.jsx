import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion"; // Added for smooth animations

// Swiper Styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const API_BASE = "http://localhost:3000";
const MAX_SLIDES = 6;

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); // Track active slide for animations
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Register Swiper modules
  SwiperCore.use([Autoplay, EffectFade, Navigation, Pagination]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE}/movies`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.movies || data.data || [];
        setSlides(arr.slice(0, MAX_SLIDES));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <span className="loading loading-spinner loading-lg text-[#4285F4]"></span>
    </div>
  );

  return (
    <section className="relative w-full overflow-hidden bg-base-100 transition-colors duration-500">
      <Swiper
        effect="fade"
        speed={1200}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        pagination={{ clickable: true }}
        className="h-[450px] md:h-[600px]"
      >
        {slides.map((movie, idx) => (
          <SwiperSlide key={movie._id || idx}>
            <div className="relative w-full h-full">
              {/* Background Image with Zoom Animation */}
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: activeIndex === idx ? 1 : 1.1 }}
                transition={{ duration: 6, ease: "linear" }}
                src={movie.poster || movie.posterUrl}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-60 transition-opacity duration-500"
              />
              
              {/* Theme-aware Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-base-100 via-base-100/60 to-transparent" />

              <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12 flex flex-col md:flex-row items-center">
                
                {/* Left Side: Main Movie Content with Framer Motion */}
                <div className="w-full md:w-1/2 pt-20 md:pt-0">
                  <AnimatePresence mode="wait">
                    {activeIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <h1 className="text-5xl md:text-7xl font-bold text-base-content mb-2 leading-tight">
                          {movie.title}
                        </h1>
                        
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-center gap-3 text-base-content/80 text-sm md:text-base mb-6 font-medium"
                        >
                          <span>{movie.releaseYear || movie.year}</span>
                          <span className="border-l border-base-content/30 h-4" />
                          <span>{movie.genre?.[0] || "Action"}</span>
                          <span className="border-l border-base-content/30 h-4" />
                          <span>{movie.duration || "1hr 55 mins"}</span>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex flex-wrap gap-4 mt-8"
                        >
                          <Link
                            to={`/movie-details/${movie._id}`}
                            className="px-10 py-3 bg-[#24BAEF] hover:bg-[#1da1d1] text-white font-bold uppercase tracking-wider transition-all rounded-[3px] shadow-lg hover:shadow-[#24BAEF]/20 active:scale-95"
                          >
                            + Playlist
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Side: Todays Recommendation Grid */}
                <div className="hidden lg:block w-1/2 pl-12">
                   <h3 className="text-base-content text-lg font-medium mb-4 text-center opacity-80">Todays Recomendation</h3>
                   <div className="grid grid-cols-3 gap-2">
                     {slides.slice(0, 6).map((rec, i) => (
                       <motion.div 
                         key={i} 
                         whileHover={{ scale: 1.05 }}
                         className="aspect-video overflow-hidden border border-base-content/10 hover:border-[#24BAEF] transition-colors cursor-pointer rounded-sm"
                       >
                         <img src={rec.poster} className="w-full h-full object-cover" alt="rec" />
                       </motion.div>
                     ))}
                   </div>
                </div>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <button ref={prevRef} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-base-content/30 hover:text-[#24BAEF] transition-all hover:scale-110 active:scale-90">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button ref={nextRef} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-base-content/30 hover:text-[#24BAEF] transition-all hover:scale-110 active:scale-90">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5l7 7-7 7" /></svg>
      </button>

      <style jsx global>{`
        .swiper-pagination-bullet { 
            background: var(--fallback-bc,oklch(var(--bc)/1)) !important; 
            opacity: 0.2; 
        }
        .swiper-pagination-bullet-active { 
            opacity: 1 !important; 
            width: 30px !important; 
            border-radius: 4px; 
            transition: all 0.4s ease;
            background: #24BAEF !important;
        }
      `}</style>
    </section>
  );
}