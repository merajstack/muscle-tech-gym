"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isMd, setIsMd] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const videos = [
    { id: 0, src: "https://videos.pexels.com/video-files/4761563/4761563-uhd_1440_2560_25fps.mp4" },
    { id: 1, src: "https://videos.pexels.com/video-files/4754029/4754029-uhd_1440_2560_25fps.mp4" },
    { id: 2, src: "https://videos.pexels.com/video-files/4761445/4761445-uhd_1440_2560_25fps.mp4" },
    { id: 3, src: "https://videos.pexels.com/video-files/4754021/4754021-uhd_1440_2560_25fps.mp4" },
  ];

  useEffect(() => {
    const checkWidth = () => setIsMd(window.innerWidth >= 768);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev < videos.length - 1 ? prev + 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, videos.length]);

  const handleVideoPlay = useCallback((index: number) => {
    videoRefs.current.forEach((video, i) => {
      if (video && video.src) {
        if (i === index) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, []);

  useEffect(() => {
    handleVideoPlay(activeIndex);
  }, [activeIndex, handleVideoPlay]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : videos.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < videos.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 30) {
      if (e.deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

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
            {/* Desktop gradient overlay */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-orange-950/20 z-10" />
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
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white font-bold text-base sm:text-lg rounded-sm hover:bg-red-700 transition-all duration-300 hover:scale-105 md:bg-gradient-to-r md:from-red-600 md:to-red-700 md:hover:from-red-500 md:hover:to-red-600 md:shadow-lg md:shadow-red-600/30">
                START YOUR JOURNEY
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg rounded-sm hover:bg-white hover:text-black transition-all duration-300 md:border-gradient-to-r md:hover:shadow-lg md:hover:shadow-white/20">
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
        <section className="py-12 sm:py-16 md:py-20 bg-black border-t border-zinc-800 md:bg-gradient-to-br md:from-black md:via-red-950/10 md:to-black">
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
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden md:shadow-2xl md:shadow-red-600/20">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/brand-story-1765373700107.png"
                  alt="MuscleTech Team"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-black border-t border-zinc-800 md:bg-gradient-to-b md:from-black md:via-orange-950/10 md:to-zinc-900">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="relative h-[400px] sm:h-[500px] md:h-[600px] rounded-lg overflow-hidden order-2 md:order-1 md:shadow-2xl md:shadow-orange-600/20">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/eqp2-1765427606311.webp"
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
                  <div className="md:p-4 md:rounded-lg md:bg-gradient-to-r md:from-zinc-900/50 md:to-transparent md:border-l-2 md:border-red-600/50">
                    <h3 className="text-white font-bold text-lg mb-1">Elite Equipment, Built for Performance</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Train with commercial-grade machines, power racks, free weights, and functional tools designed for serious results. Every zone is optimized for strength, endurance, and mobility.</p>
                  </div>
                  <div className="md:p-4 md:rounded-lg md:bg-gradient-to-r md:from-zinc-900/50 md:to-transparent md:border-l-2 md:border-orange-600/50">
                    <h3 className="text-white font-bold text-lg mb-1">Personalized Coaching That Delivers</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Our certified trainers craft workout plans tailored to your goals — whether you want to lose fat, build muscle, improve stamina, or simply get healthier.</p>
                  </div>
                  <div className="md:p-4 md:rounded-lg md:bg-gradient-to-r md:from-zinc-900/50 md:to-transparent md:border-l-2 md:border-red-600/50">
                    <h3 className="text-white font-bold text-lg mb-1">A Motivating Environment That Pushes You Forward</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Step into a space where energy stays high, discipline is respected, and progress is celebrated. We've built a community where everyone works hard and grows together.</p>
                  </div>
                  <div className="md:p-4 md:rounded-lg md:bg-gradient-to-r md:from-zinc-900/50 md:to-transparent md:border-l-2 md:border-orange-600/50">
                    <h3 className="text-white font-bold text-lg mb-1">Results-Focused Training Programs</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Every training style — strength, cardio, HIIT, or functional — is backed by proven methods to help you see and feel real changes faster.</p>
                  </div>
                  <div className="md:p-4 md:rounded-lg md:bg-gradient-to-r md:from-zinc-900/50 md:to-transparent md:border-l-2 md:border-red-600/50">
                    <h3 className="text-white font-bold text-lg mb-1">Clean, Safe & Comfortable Space</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Our gym is maintained daily, sanitized regularly, and equipped with proper ventilation to ensure a safe and comfortable workout experience.</p>
                  </div>
                  <div className="md:p-4 md:rounded-lg md:bg-gradient-to-r md:from-zinc-900/50 md:to-transparent md:border-l-2 md:border-orange-600/50">
                    <h3 className="text-white font-bold text-lg mb-1">Flexible Membership Plans</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Choose from a range of membership plans designed to fit your lifestyle, not the other way around.</p>
                  </div>
                  <div className="md:p-4 md:rounded-lg md:bg-gradient-to-r md:from-zinc-900/50 md:to-transparent md:border-l-2 md:border-red-600/50">
                    <h3 className="text-white font-bold text-lg mb-1">Trackable Progress</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Monitor your improvements with trainer check-ins, body assessments, and progress-based adjustments. We help you stay accountable and motivated.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-black border-t border-zinc-800 overflow-hidden md:bg-gradient-to-b md:from-zinc-900 md:via-red-950/10 md:to-black">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl text-white mb-12 text-center"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400 }}
            >
              SUCCESS <span className="text-red-600">STORIES</span>
            </h2>
          </div>
          
          {/* Video Cards Carousel */}
          <div 
            ref={containerRef}
            className="relative flex items-center justify-center h-[450px] sm:h-[500px] md:h-[550px] cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
              {videos.map((video, index) => {
                const isActive = index === activeIndex;
                const distance = Math.abs(index - activeIndex);
                const isVisible = distance <= 2;
                
                const translateX = (index - activeIndex) * (isMd ? 320 : 280);

                return (
                  <div
                    key={video.id}
                    onClick={() => setActiveIndex(index)}
                    className="absolute cursor-pointer"
                    style={{
                      transform: `translateX(${translateX}px) scale(${isActive ? 1.15 : 0.85}) translateZ(${isActive ? 50 : 0}px)`,
                      opacity: isActive ? 1 : isVisible ? 0.5 : 0,
                      zIndex: isActive ? 10 : 5 - distance,
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      pointerEvents: isVisible ? 'auto' : 'none',
                    }}
                  >
                    <div 
                      className={`w-[240px] sm:w-[280px] md:w-[320px] h-[320px] sm:h-[380px] md:h-[420px] rounded-xl overflow-hidden border-2 ${isActive ? 'border-red-600 shadow-2xl shadow-red-600/30' : 'border-zinc-700'} bg-zinc-900`}
                    >
                      {video.src ? (
                        <video
                          ref={(el) => { videoRefs.current[index] = el; }}
                          src={video.src}
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                          <div className="text-zinc-600 flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">Video {index + 1}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 md:left-16 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 md:bg-gradient-to-r md:from-red-600 md:to-red-700 md:hover:from-red-500 md:hover:to-red-600 md:shadow-lg md:shadow-red-600/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 sm:right-8 md:right-16 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 md:bg-gradient-to-r md:from-red-600 md:to-red-700 md:hover:from-red-500 md:hover:to-red-600 md:shadow-lg md:shadow-red-600/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${index === activeIndex ? 'bg-red-600 w-8' : 'bg-zinc-600 hover:bg-zinc-500'}`}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}