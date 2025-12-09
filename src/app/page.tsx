"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.log("Fullscreen request failed or was denied");
      }
    };
    
    const handleClick = () => {
      requestFullscreen();
      document.removeEventListener("click", handleClick);
    };
    
    document.addEventListener("click", handleClick, { once: true });
    
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/main-page-1765286459157.avif"
              alt="Muscle Tech Hero Background"
              fill
              className="object-cover"
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black z-10" />
          </div>

          {/* Hero Content */}
          <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl">
            <h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-4 sm:mb-6 tracking-tight"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400 }}
            >
              MUSCLE <span className="text-red-600">TECH</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Transform your body and mind at the most advanced fitness facility
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white font-bold text-base sm:text-lg rounded-sm hover:bg-red-700 transition-all duration-300 hover:scale-105">
                START YOUR JOURNEY
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg rounded-sm hover:bg-white hover:text-black transition-all duration-300">
                LEARN MORE
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 sm:h-3 bg-white rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-black border-t border-zinc-800">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h2 
                  className="text-4xl sm:text-5xl md:text-6xl text-white mb-6"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400 }}
                >
                  BRAND <span className="text-red-600">STORY</span>
                </h2>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                  At MuscleTech, we believe strength is built — not gifted.
                </p>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                  For over a decade, we've combined cutting-edge sports science, premium ingredients, and unmatched performance testing to create products trusted by athletes worldwide.
                </p>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                  Whether you're chasing muscle growth, fat loss, endurance, or total body transformation, we deliver innovations that help you push harder, recover faster, and achieve more.
                </p>
                <p className="text-red-600 font-bold text-lg sm:text-xl mt-6">
                  Stronger today. Unstoppable tomorrow.
                </p>
              </div>
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/friends-1765303075554.webp"
                  alt="MuscleTech Team"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
