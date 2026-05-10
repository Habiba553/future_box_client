// src/components/NavBar.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { FaUser, FaSearch, FaCloudUploadAlt, FaMoon, FaSun } from "react-icons/fa";
import { MdCollections } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Initialize theme from localStorage or default to dark to match the "Vodi" vibe
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
    <div className="sticky top-0 z-[100] w-full border-b border-base-content/10 bg-base-100/80 backdrop-blur-md transition-colors duration-300">
      <div className="navbar max-w-7xl mx-auto px-4 py-1 min-h-[64px]">
        
        {/* --- LEFT SIDE: Logo & Navigation --- */}
        <div className="navbar-start w-auto flex-1">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow border border-base-content/10">
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/movies">Movies</NavLink></li>
              <li><NavLink to="/my-collection">My Collection</NavLink></li>
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-1 mr-6">
            <span className="text-2xl font-black tracking-tighter text-[#4285F4]">MovieMaster</span>
            <span className="text-2xl font-black tracking-tighter text-base-content">Pro</span>
          </Link>

          <div className="hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-2 text-[14px] font-semibold opacity-90">
              <li><NavLink to="/" className={({ isActive }) => isActive ? "text-[#4285F4]" : ""}>Home</NavLink></li>
              <li><NavLink to="/movies" className={({ isActive }) => isActive ? "text-[#4285F4]" : ""}>Movies</NavLink></li>
              <li><NavLink to="/my-collection" className={({ isActive }) => isActive ? "text-[#4285F4]" : ""}>My Collection</NavLink></li>
            </ul>
          </div>
        </div>

        {/* --- RIGHT SIDE: Search, Theme Toggle, Auth --- */}
        <div className="navbar-end flex-none gap-3">
          
          {/* Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center group">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="bg-base-200 border border-base-content/10 text-sm rounded-full py-1.5 px-4 w-40 focus:w-56 focus:outline-none focus:ring-1 focus:ring-[#4285F4] transition-all duration-300"
            />
            <FaSearch className="absolute right-3 text-base-content/40 pointer-events-none" size={12} />
          </form>

          {/* Theme Toggle Button (The "Light On/Off" switch) */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-[#4285F4]"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-base-content/10">
                  <div className="w-8 rounded-full">
                    <img src={user.photoURL || "https://i.ibb.co/mR4cxYd/user.png"} alt="User Profile" />
                  </div>
                </label>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-[1] mt-3 w-52 p-3 shadow-xl border border-base-content/10">
                  <li className="px-3 py-2 border-b border-base-content/10 mb-2">
                    <p className="font-bold truncate">{user.displayName || "User"}</p>
                    <p className="text-[10px] opacity-60 truncate">{user.email}</p>
                  </li>
                  <li><Link to="/profile"><FaUser /> Profile</Link></li>
                  <li><Link to="/my-collection"><MdCollections /> My Collection</Link></li>
                  <li className="mt-2">
                    <button onClick={signOutUser} className="btn btn-error btn-sm text-white no-animation">
                      <IoLogOut /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/auth/login" className="btn btn-sm bg-[#4285F4] hover:bg-[#3367D6] border-none text-white px-4 lowercase first-letter:uppercase">
                Login
              </Link>
              <Link to="/auth/register" className="btn btn-sm btn-outline border-base-content/20 hover:bg-base-content hover:text-base-100 px-4 lowercase first-letter:uppercase">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;