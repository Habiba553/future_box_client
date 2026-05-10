// src/components/HeroSection.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";

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
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Register Swiper modules
  SwiperCore.use([Autoplay, EffectFade, Navigation, Pagination]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE}/movies`); // Adjust to your specific endpoint
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

  if (loading) return <div className="h-[500px] flex items-center justify-center">Loading...</div>;
  if (!slides.length) return null;

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <Swiper
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        pagination={{ clickable: true }}
        className="h-[450px] md:h-[600px]"
      >
        {slides.map((movie, idx) => (
          <SwiperSlide key={movie._id || idx}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <img
                src={movie.poster || movie.posterUrl}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              
              {/* Vodi Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

              <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12 flex flex-col md:flex-row items-center">
                
                {/* Left Side: Main Movie Content */}
                <div className="w-full md:w-1/2 pt-20 md:pt-0">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 leading-tight">
                    {movie.title}
                  </h1>
                  <div className="flex items-center gap-3 text-white/80 text-sm md:text-base mb-6 font-medium">
                    <span>{movie.releaseYear || movie.year}</span>
                    <span className="border-l border-white/30 h-4" />
                    <span>{movie.genre?.[0] || "Action"}</span>
                    <span className="border-l border-white/30 h-4" />
                    <span>{movie.duration || "1hr 55 mins"}</span>
                  </div>

                  {/* Vodi Style Buttons */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <Link
                      to={`/movie-details/${movie._id}`}
                      className="px-10 py-3 bg-[#24BAEF] hover:bg-[#1da1d1] text-white font-bold uppercase tracking-wider transition-all rounded-[3px]"
                    >
                      + Playlist
                    </Link>
                    
                  </div>
                </div>

                {/* Right Side: Todays Recommendation Grid (Visual only, syncs with images) */}
                <div className="hidden lg:block w-1/2 pl-12">
                   <h3 className="text-white text-lg font-medium mb-4 text-center">Todays Recomendation</h3>
                   <div className="grid grid-cols-3 gap-2">
                      {/* Using slice to show variety from the fetched data */}
                      {slides.slice(0, 6).map((rec, i) => (
                        <div key={i} className="aspect-video overflow-hidden border border-white/10 hover:border-[#24BAEF] transition-colors cursor-pointer">
                          <img src={rec.poster} className="w-full h-full object-cover" alt="rec" />
                        </div>
                      ))}
                   </div>
                </div>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <button ref={prevRef} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button ref={nextRef} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5l7 7-7 7" /></svg>
      </button>

      <style jsx global>{`
        .swiper-pagination-bullet { background: white !important; opacity: 0.3; }
        .swiper-pagination-bullet-active { opacity: 1; width: 25px; border-radius: 4px; transition: width 0.3s; }
      `}</style>
    </section>
  );
}