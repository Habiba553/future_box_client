// src/components/AboutSection.jsx
import React from "react";
import { FaArrowRight } from "react-icons/fa";

const AboutSection = () => {
  return (
    <section className="bg-base-100 py-20 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Side: Branding and Call to Action */}
          <div className="lg:w-1/3">
            <div className="mb-8">
              <p className="text-[#24BAEF] font-medium tracking-[0.2em] uppercase text-xs mb-2">Our Story</p>
              <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tighter leading-none mb-6">
                About the <br /> Platform.
              </h2>
              
            </div>
          </div>

          {/* Right Side: Descriptive Content */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-base-content/10 pt-10 lg:border-t-0 lg:pt-0">
            <div>
              <p className="text-base-content font-bold text-sm leading-relaxed mb-4">
                MovieMaster Pro is a high-performance, community-driven platform designed 
                to redefine how you explore cinematic content. By integrating advanced 
                MongoDB-backed data structures, we provide real-time access to a 
                vast library of global titles.
              </p>
              <p className="text-base-content/60 text-xs font-medium uppercase tracking-widest">
                — Daren Colman, Lead Director
              </p>
            </div>

            <div>
              <p className="text-base-content font-bold text-sm leading-relaxed mb-4 opacity-80">
                Our platform enables users to discover curated collections, manage 
                personal watchlists, and dive deep into movie metadata. Whether 
                you're seeking indie dramas or global blockbusters, our 
                bespoke service connects you to the best in digital entertainment.
              </p>
              <p className="text-base-content/60 text-xs font-medium uppercase tracking-widest">
                — John Illerstone, Creative Head
              </p>
            </div>
          </div>

        </div>
        
        {/* Subtle separator line to match the Eston aesthetic */}
        <div className="mt-20 border-b border-base-content/5 w-full"></div>
      </div>
    </section>
  );
};

export default AboutSection;