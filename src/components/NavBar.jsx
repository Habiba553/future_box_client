// src/components/NavBar.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaSearch, FaMoon, FaSun, FaBars, FaHeart } from "react-icons/fa"; // Added FaHeart
import { MdCollections } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark"
  );

  const [query, setQuery] = useState("");

  useEffect(() => {
    const html = document.querySelector("html");
    if (html) {
      html.setAttribute("data-theme", theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = (query || "").trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="sticky top-0 z-[100] w-full border-b border-base-content/10 bg-base-100/80 backdrop-blur-md transition-all duration-300">
      <div className="navbar max-w-7xl mx-auto px-4 py-2 min-h-[64px]">
        
        {/* --- LEFT SIDE: Logo & Navigation --- */}
        <div className="navbar-start flex items-center lg:w-auto flex-1">
          {/* Mobile Menu Icon */}
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle mr-1">
              <FaBars size={20} />
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-64 p-4 shadow-2xl border border-base-content/10 space-y-2">
              <li className="mb-2 sm:hidden">
                 <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search movies..."
                      className="bg-base-200 border border-base-content/10 text-sm rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-1 focus:ring-[#4285F4]"
                    />
                    <FaSearch className="absolute right-3 top-3 text-base-content/40" size={14} />
                 </form>
              </li>
              <li><NavLink to="/" className="py-3">Home</NavLink></li>
              <li><NavLink to="/movies" className="py-3">Movies</NavLink></li>
              {/* Conditional My Wishlist for Mobile */}
              {user && (
                <li><NavLink to="/watchlist" className="py-3"> Watchlist</NavLink></li>
              )}
              <li><NavLink to="/my-collection" className="py-3">My Collection</NavLink></li>
            </ul>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group whitespace-nowrap">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-[#4285F4] group-hover:scale-105 transition-transform">MovieMaster</span>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-base-content">Pro</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex ml-8">
            <ul className="menu menu-horizontal px-1 gap-2 text-[15px] font-bold">
              <li><NavLink to="/" className={({ isActive }) => isActive ? "text-[#4285F4] bg-transparent" : "hover:text-[#4285F4] bg-transparent"}>Home</NavLink></li>
              <li><NavLink to="/movies" className={({ isActive }) => isActive ? "text-[#4285F4] bg-transparent" : "hover:text-[#4285F4] bg-transparent"}>Movies</NavLink></li>
              {/* Conditional My Wishlist for Desktop */}
              {user && (
                <li><NavLink to="/watchlist" className={({ isActive }) => isActive ? "text-[#4285F4] bg-transparent" : "hover:text-[#4285F4] bg-transparent"}>Watchlist</NavLink></li>
              )}
              <li><NavLink to="/my-collection" className={({ isActive }) => isActive ? "text-[#4285F4] bg-transparent" : "hover:text-[#4285F4] bg-transparent"}>My Collection</NavLink></li>
            </ul>
          </div>
        </div>

        {/* --- RIGHT SIDE: Search, Theme Toggle, Auth --- */}
        <div className="navbar-end flex-none gap-2 md:gap-4">
          
          {/* Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center group">
            <div className="relative">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies..."
                className="bg-base-200 border border-base-content/5 text-sm rounded-full py-2 px-5 w-32 md:w-48 lg:w-64 focus:w-40 md:focus:w-60 lg:focus:w-80 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/50 focus:bg-base-100 transition-all duration-500 shadow-inner"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-[#4285F4] transition-colors">
                <FaSearch size={14} />
              </button>
            </div>
          </form>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-ghost btn-circle btn-sm md:btn-md text-base-content/70 hover:text-[#4285F4] hover:bg-[#4285F4]/10 transition-all"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar online border-2 border-[#4285F4]/20 hover:border-[#4285F4]">
                  <div className="w-9 rounded-full">
                    <img src={user.photoURL || "https://i.ibb.co/mR4cxYd/user.png"} alt="User Profile" />
                  </div>
                </label>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-[1] mt-3 w-60 p-4 shadow-2xl border border-base-content/10">
                  <li className="px-3 py-3 border-b border-base-content/5 mb-3 bg-base-200/50 rounded-lg">
                    <p className="font-bold text-base truncate">{user.displayName || "User"}</p>
                    <p className="text-xs opacity-60 truncate font-medium">{user.email}</p>
                  </li>
                  {/* Added to Profile Dropdown as well */}
                  <li><Link to="/watchlist" className="py-2"><FaHeart /> My Watchlist</Link></li>
                  <li><Link to="/my-collection" className="py-2"><MdCollections /> Movie Collection</Link></li>
                  <li className="mt-4">
                    <button onClick={signOutUser} className="btn btn-error btn-sm w-full text-white bg-[#24BAEF] hover:bg-[#1da1d1] font-bold flex items-center justify-center gap-2 rounded-lg">
                      <IoLogOut size={18} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 md:gap-3">
              <Link to="/auth/login" className="btn btn-sm md:btn-md h-9 min-h-[36px] md:h-11 md:min-h-[44px] bg-[#24BAEF] hover:bg-[#1da1d1] border-none text-white px-3 md:px-6 rounded-lg font-bold transition-all shadow-md hover:shadow-lg active:scale-95 text-xs md:text-sm uppercase tracking-wider">
                Login In
              </Link>
              <Link to="/auth/register" className="hidden xs:flex btn btn-sm md:btn-md h-9 min-h-[36px] md:h-11 md:min-h-[44px] btn-outline border-base-content/20 hover:bg-base-content hover:text-base-100 px-3 md:px-6 rounded-lg font-bold transition-all active:scale-95 text-xs md:text-sm uppercase tracking-wider">
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;