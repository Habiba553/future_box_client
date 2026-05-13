// src/components/StatsSection.jsx
import React, { useEffect, useState } from "react";
import { FaFilm, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion"; // Added for eye-soothing animations

const API_BASE = "http://localhost:3000";

// Simple Count-up component for the numbers
const CountUp = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let totalMiliseconds = 1500;
    let incrementTime = (totalMiliseconds / end) * 2;

    let timer = setInterval(() => {
      start += Math.ceil(end / 50); // Increment faster for larger numbers
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

const StatsSection = () => {
  const [stats, setStats] = useState({ totalMovies: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;

    const loadStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/stats`, { signal: ac.signal });
        if (!res.ok) throw new Error(`Failed: HTTP ${res.status}`);
        const data = await res.json();

        const finalStats = data.result ?? data.data ?? data ?? { totalMovies: 0, totalUsers: 0 };
        
        const totalMovies = finalStats.totalMovies ?? finalStats.movies ?? 0;
        const totalUsers = finalStats.totalUsers ?? finalStats.users ?? 0;

        if (!ac.signal.aborted && mounted) {
          setStats({
            totalMovies: Number(totalMovies),
            totalUsers: Number(totalUsers),
          });
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        if (mounted) setError("Failed to load statistics.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStats();
    return () => { mounted = false; ac.abort(); };
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-20 bg-base-100">
      <span className="loading loading-spinner loading-lg text-[#4285F4]"></span>
    </div>
  );

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="bg-base-100 py-16 px-6 transition-colors duration-500 overflow-hidden">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Section Heading */}
        <motion.div className="mb-12" variants={itemVariants}>
          <p className="text-[#4285F4] font-medium tracking-widest uppercase text-sm mb-2">Experience</p>
          <h2 className="text-4xl md:text-6xl font-black text-base-content tracking-tighter">
            Our Movies.
          </h2>
        </motion.div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Total Movies Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="group border border-base-content/10 p-12 flex flex-col items-center text-center hover:border-[#4285F4] transition-all duration-300 bg-base-200/30 rounded-sm backdrop-blur-sm"
          >
            <div className="mb-6 text-base-content/60 group-hover:text-[#4285F4] group-hover:scale-110 transition-all duration-300">
              <FaFilm size={48} />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-4">Total Movies</h3>
            <p className="text-base-content/60 text-sm max-w-xs mb-6 font-medium">
              Our library is constantly growing. Currently hosting a wide variety of cinematic experiences.
            </p>
            <div className="text-5xl font-black text-[#4285F4]">
              {!loading && <CountUp value={stats.totalMovies} />}
            </div>
          </motion.div>

          {/* Total Users Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="group border border-base-content/10 p-12 flex flex-col items-center text-center hover:border-[#4285F4] transition-all duration-300 bg-base-200/30 rounded-sm backdrop-blur-sm"
          >
            <div className="mb-6 text-base-content/60 group-hover:text-[#4285F4] group-hover:scale-110 transition-all duration-300">
              <FaUsers size={48} />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-4">Total Users</h3>
            <p className="text-base-content/60 text-sm max-w-xs mb-6 font-medium">
              Join our community of movie enthusiasts and contributors from all around the world.
            </p>
            <div className="text-5xl font-black text-[#4285F4]">
              {!loading && <CountUp value={stats.totalUsers} />}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default StatsSection;