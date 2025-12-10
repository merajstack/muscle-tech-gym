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

        {/* Why Choose Us Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-black border-t border-zinc-800">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="relative h-[400px] sm:h-[500px] md:h-[600px] rounded-lg overflow-hidden order-2 md:order-1">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/reciption-1765303353505.webp"
                  alt="Muscle Tech Gym Interior"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-red-600 font-bold text-xl sm:text-2xl mb-2">
                    Join the Gym That Invests in You
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Because here, it's not just about lifting weights —<br />
                    it's about lifting your entire life.
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 
                  className="text-4xl sm:text-5xl md:text-6xl text-white mb-8"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400 }}
                >
                  WHY <span className="text-red-600">CHOOSE US</span>
                </h2>
                <div className="space-y-5">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Elite Equipment, Built for Performance</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Train with commercial-grade machines, power racks, free weights, and functional tools designed for serious results. Every zone is optimized for strength, endurance, and mobility.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Personalized Coaching That Delivers</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Our certified trainers craft workout plans tailored to your goals — whether you want to lose fat, build muscle, improve stamina, or simply get healthier.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">A Motivating Environment That Pushes You Forward</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Step into a space where energy stays high, discipline is respected, and progress is celebrated. We've built a community where everyone works hard and grows together.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Results-Focused Training Programs</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Every training style — strength, cardio, HIIT, or functional — is backed by proven methods to help you see and feel real changes faster.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Clean, Safe & Comfortable Space</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Our gym is maintained daily, sanitized regularly, and equipped with proper ventilation to ensure a safe and comfortable workout experience.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Flexible Membership Plans</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Choose from a range of membership plans designed to fit your lifestyle, not the other way around.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Trackable Progress</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Monitor your improvements with trainer check-ins, body assessments, and progress-based adjustments. We help you stay accountable and motivated.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-black border-t border-zinc-800 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl text-white mb-12 text-center"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400 }}
            >
              SUCCESS <span className="text-red-600">STORIES</span>
            </h2>
          </div>
          
          {/* Sliding Images Container */}
          <div className="relative">
            <div className="flex gap-6 animate-slide-left">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] h-[350px] sm:h-[400px] md:h-[450px] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-red-600 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-zinc-700 text-6xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[...Array(8)].map((_, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] h-[350px] sm:h-[400px] md:h-[450px] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-red-600 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-zinc-700 text-6xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <style jsx>{`
            @keyframes slide-left {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-slide-left {
              animation: slide-left 30s linear infinite;
            }
            .animate-slide-left:hover {
              animation-play-state: paused;
            }
          `}</style>
        </section>
      </main>
    </>
  );
}