// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { FaFacebookF, FaGooglePlusG, FaVimeoV, FaRss, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Modern X logo

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-300 text-base-content pt-12 pb-6 border-t border-base-content/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- TOP SECTION: Logo & Socials --- */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-base-content/10 pb-8 mb-10">
          <Link to="/" className="flex items-center gap-1 mb-6 md:mb-0">
            <span className="text-4xl font-black tracking-tighter text-[#4285F4]">MovieMaster</span>
            <span className="text-4xl font-black tracking-tighter">Pro</span>
          </Link>

          {/* Social Media Links - Opening in new tabs */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium opacity-80">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#4285F4] transition-colors">
              <FaFacebookF /> Facebook
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#4285F4] transition-colors">
              <FaXTwitter /> Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#4285F4] transition-colors">
              <FaInstagram /> Instagram
            </a>
            <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#4285F4] transition-colors">
              <FaGooglePlusG size={18} /> Google+
            </a>
            
          </div>
        </div>

        {/* --- MIDDLE SECTION: Links Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Movie Categories (Matches Image Layout) */}
          <div>
            <h3 className="text-lg font-bold mb-6">Movie Categories</h3>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="hover:text-[#4285F4] cursor-pointer transition-all">Action</li>
              <li className="hover:text-[#4285F4] cursor-pointer transition-all">Adventure</li>
              <li className="hover:text-[#4285F4] cursor-pointer transition-all">Animation</li>
              <li className="hover:text-[#4285F4] cursor-pointer transition-all">Comedy</li>
              <li className="hover:text-[#4285F4] cursor-pointer transition-all">Crime</li>
            </ul>
          </div>

          {/* Column 2 - Category overflow */}
          <div className="pt-12 md:pt-[52px]">
            <ul className="space-y-3 text-sm opacity-70">
              <li className="hover:text-[#4285F4] cursor-pointer transition-all">Drama</li>
              <li className="hover:text-[#4285F4] cursor-pointer transition-all">Fantasy</li>
              <li className="hover:text-[#4285F4] cursor-pointer transition-all">Horror</li>
              <li className="hover:text-[#4285F4] cursor-pointer transition-all">Mystery</li>
              <li className="hover:text-[#4285F4] cursor-pointer transition-all">Romance</li>
            </ul>
          </div>

          {/* Quick Links Section (Updated with your Routes) */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm opacity-70">
              <li>
                <Link to="/" className="hover:text-[#4285F4] transition-all">Home</Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-[#4285F4] transition-all">All Movies</Link>
              </li>
              <li>
                <Link to="/my-collection" className="hover:text-[#4285F4] transition-all">My Collection</Link>
              </li>
              
            </ul>
          </div>

          {/* Support Section */}
          <div className="border-l border-base-content/10 pl-8 hidden md:block">
            <h3 className="text-lg font-bold mb-6">Support</h3>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="/profile" className="hover:text-[#4285F4]">My Account</Link></li>
              <li><Link to="/faq" className="hover:text-[#4285F4]">FAQ</Link></li>
              <li className="hover:text-[#4285F4] cursor-pointer">Watch on TV</li>
              <li><Link to="/support" className="hover:text-[#4285F4]">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-[#4285F4]">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM SECTION: Copyright --- */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-base-content/5 text-xs opacity-50">
          <p>Copyright © {currentYear}, <span className="font-bold uppercase">MovieMaster Pro</span>. All Rights Reserved</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-base-content underline decoration-transparent hover:decoration-current transition-all">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-base-content underline decoration-transparent hover:decoration-current transition-all">Terms of Service</Link>
          </div>
        </div>
      </div>
      
      {/* Scroll to top button - Blue Square Style */}
      <button 
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        className="fixed bottom-6 right-6 bg-[#4285F4] text-white p-3 rounded-md shadow-lg hover:brightness-110 active:scale-95 transition-all z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;