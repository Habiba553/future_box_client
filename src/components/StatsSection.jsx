// src/components/StatsSection.jsx
import React, { useEffect, useState } from "react";
import { FaFilm, FaUsers } from "react-icons/fa"; // Using icons to match the image style

const API_BASE = "http://localhost:3000";

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
        
        // Key mapping from your API requirements
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
    <div className="flex justify-center items-center py-20">
      <span className="loading loading-spinner loading-lg text-[#4285F4]"></span>
    </div>
  );

  return (
    <section className="bg-base-100 py-16 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading matching the "Expirience" image style */}
        <div className="mb-12">
          <p className="text-[#4285F4] font-medium tracking-widest uppercase text-sm mb-2">Expirience</p>
          <h2 className="text-4xl md:text-6xl font-black text-base-content tracking-tighter">
            Our Movies.
          </h2>
        </div>

        {/* Grid layout matching the image provided */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Total Movies Card */}
          <div className="group border border-base-content/10 p-12 flex flex-col items-center text-center hover:border-[#4285F4] transition-all duration-300 bg-base-200/30">
            <div className="mb-6 text-base-content/60 group-hover:text-[#4285F4] transition-colors">
              <FaFilm size={48} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-4">Total Movies</h3>
            <p className="text-base-content/60 text-sm max-w-xs mb-6">
              Our library is constantly growing. Currently hosting a wide variety of cinematic experiences.
            </p>
            <div className="text-5xl font-black text-[#4285F4]">
              {stats.totalMovies.toLocaleString()}
            </div>
          </div>

          {/* Total Users Card */}
          <div className="group border border-base-content/10 p-12 flex flex-col items-center text-center hover:border-[#4285F4] transition-all duration-300 bg-base-200/30">
            <div className="mb-6 text-base-content/60 group-hover:text-[#4285F4] transition-colors">
              <FaUsers size={48} />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-4">Total Users</h3>
            <p className="text-base-content/60 text-sm max-w-xs mb-6">
              Join our community of movie enthusiasts and contributors from all around the world.
            </p>
            <div className="text-5xl font-black text-[#4285F4]">
              {stats.totalUsers.toLocaleString()}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsSection;