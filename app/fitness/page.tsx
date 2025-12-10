"use client";

import Navbar from "@/components/Navbar";
import { Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const initialCategories = [
  { 
    id: 1, 
    title: "GYM", 
    description: "State-of-the-art equipment",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/eqp1-1765287853827.avif"
  },
  { 
    id: 2, 
    title: "CROSSFIT", 
    description: "High-intensity functional training",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/eqp2-1765287854014.webp"
  },
  { 
    id: 3, 
    title: "CARDIO", 
    description: "Burn calories effectively",
    image: "https://fitgearsolutions.com/wp-content/uploads/2025/01/C1_JF_WithLogo-scaled.webp"
  },
];

const replacementCategories = [
  { id: 4, title: "KICKBOXING", description: "Combat fitness training", image: "https://yokkao.com/cdn/shop/files/intro1.jpg?v=1626149693&width=1620" },
  { id: 5, title: "MARTIAL ARTS", description: "Discipline and strength", image: "https://cdn.britannica.com/07/145407-050-8DBD77E9/belts.jpg" },
  { id: 6, title: "YOGA", description: "Flexibility and mindfulness", image: "https://st.perplexity.ai/estatic/0b226c450798410ac541646c86ec31afd840e5beab817a5d84fa821e7db61981ec84c3b4a3f072a7a2e1899c9fb06c6e3b16ca281d983c1633625c9b220edc3f0f7852a42c0d8cc71f1f48adb86614461afb6f34723a8d0797425ebba482d75f" },
];

export default function FitnessPage() {
  const [showReplacement, setShowReplacement] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [imageTransition, setImageTransition] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileScrollIndex, setMobileScrollIndex] = useState(0);
  const [scrollAnimationTriggered, setScrollAnimationTriggered] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      if (scrollPercent >= 20 && !scrollAnimationTriggered) {
        setScrollAnimationTriggered(true);
      }
      
      setImageTransition(scrollPercent >= 55);
      
      if (isMobile && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const sectionTop = rect.top;
        const windowHeight = window.innerHeight;
        const scrollInSection = Math.max(0, windowHeight * 0.3 - sectionTop);
        const cardHeight = 400;
        const newIndex = Math.floor(scrollInSection / cardHeight);
        setMobileScrollIndex(Math.max(0, Math.min(newIndex, displayCategories.length - 1)));
      }
      
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.4;
        const transitionRange = window.innerHeight * 0.5;
        
        const distanceFromTrigger = triggerPoint - rect.top;
        const progress = Math.max(0, Math.min(1, distanceFromTrigger / transitionRange));
        
        setTransitionProgress(progress);
        setShowReplacement(progress > 0.5);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, scrollAnimationTriggered]);

  const displayCategories = showReplacement ? replacementCategories : initialCategories;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-20">
        {/* Hero Section - Desktop gradient */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-black to-zinc-900 md:bg-gradient-to-br md:from-black md:via-red-950/20 md:to-zinc-900">
          <div className="container mx-auto px-4 sm:px-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4">
              FITNESS <span className="text-red-600">PROGRAMS</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl">
              Discover our comprehensive range of fitness programs designed for every goal
            </p>
          </div>
        </section>

        {/* Staggered Triangle Layout with Card Replacement */}
        <section className="py-12 sm:py-16 md:py-20 min-h-screen md:bg-gradient-to-b md:from-zinc-900 md:via-black md:to-zinc-900" ref={triggerRef}>
          <div className="container mx-auto px-4 sm:px-6">
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative ${isMobile ? 'mobile-stack-container' : ''}`}>
              {displayCategories.map((category, index) => {
                const exitOpacity = showReplacement ? 0 : 1 - transitionProgress;
                const enterOpacity = showReplacement ? transitionProgress * 2 - 1 : 0;
                const currentOpacity = showReplacement ? Math.max(0, enterOpacity) : exitOpacity;
                
                const exitTransform = showReplacement ? -50 : transitionProgress * -50;
                const enterTransform = showReplacement ? (1 - transitionProgress) * 50 : 50;
                const currentTransform = showReplacement ? enterTransform : exitTransform;

                const isCardVisible = isMobile ? index <= mobileScrollIndex : true;
                const mobileStackOffset = isMobile ? (mobileScrollIndex - index) * 8 : 0;

                return (
                  <div
                    key={category.id}
                    className={`transition-all ease-out ${isMobile ? 'mobile-stack-card' : ''}`}
                    style={{
                      opacity: isMobile 
                        ? (isCardVisible ? 1 : 0) 
                        : (scrollAnimationTriggered ? currentOpacity : 0),
                      transform: isMobile 
                        ? `translateY(${isCardVisible ? mobileStackOffset : 100}px) scale(${isCardVisible ? 1 - (mobileScrollIndex - index) * 0.02 : 0.9})` 
                        : `translateY(${scrollAnimationTriggered ? currentTransform : 60}px) scale(${scrollAnimationTriggered ? 0.95 + currentOpacity * 0.05 : 0.9})`,
                      transitionDuration: isMobile ? '600ms' : '800ms',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: isMobile ? (isCardVisible ? displayCategories.length - index : 0) : 1,
                      position: isMobile ? 'relative' : 'relative',
                      transitionDelay: isMobile ? '0ms' : `${index * 100}ms`,
                    }}
                  >
                    <div className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden group hover:border-red-600 transition-all duration-500 md:bg-gradient-to-br md:from-zinc-900 md:via-zinc-800/50 md:to-zinc-900 md:border-zinc-700/50 md:hover:shadow-lg md:hover:shadow-red-600/20">
                      {/* Image */}
                      <div className="relative h-48 sm:h-56 md:h-64 bg-zinc-800 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        {'image' in category ? (
                          <Image
                            src={category.image}
                            alt={category.title}
                            fill
                            className={`object-cover transition-all duration-1000 ease-out ${
                              imageTransition 
                                ? 'scale-110 brightness-125 saturate-150' 
                                : 'scale-100 brightness-100 saturate-100'
                            }`}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            style={{
                              transform: imageTransition 
                                ? `scale(1.1) translateY(-${index * 5}px)` 
                                : 'scale(1) translateY(0)',
                              filter: imageTransition 
                                ? 'brightness(1.25) saturate(1.5)' 
                                : 'brightness(1) saturate(1)',
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full cursor-pointer">
                            <div className="text-center z-20">
                              <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-600 mx-auto mb-2 group-hover:text-zinc-500 transition-colors" />
                              <p className="text-zinc-600 text-xs sm:text-sm group-hover:text-zinc-500 transition-colors">
                                Upload Image
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 sm:p-6">
                        <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-red-600 transition-colors duration-300 md:bg-gradient-to-r md:from-white md:to-gray-300 md:bg-clip-text md:text-transparent md:group-hover:from-red-500 md:group-hover:to-orange-500">
                          {category.title}
                        </h3>
                        <p className="text-gray-400 mb-4 text-sm sm:text-base">{category.description}</p>
                        <button className="w-full py-2 sm:py-3 bg-red-600 text-white font-bold text-sm sm:text-base rounded-sm hover:bg-red-700 transition-colors duration-300 md:bg-gradient-to-r md:from-red-600 md:to-red-700 md:hover:from-red-500 md:hover:to-red-600">
                          LEARN MORE
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12 sm:mt-16">
              <p className="text-gray-500 text-xs sm:text-sm">
                {showReplacement ? "Showing advanced programs" : "Scroll to see more programs"}
              </p>
            </div>
          </div>
        </section>

        {/* Additional Content for Scroll */}
        <section className="py-20 sm:py-32 md:py-40 bg-zinc-900 md:bg-gradient-to-b md:from-zinc-900 md:via-red-950/10 md:to-black">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              READY TO <span className="text-red-600">START?</span>
            </h2>
            <p className="text-gray-400 mb-8 text-sm sm:text-base">Join thousands of members achieving their goals</p>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white font-bold text-base sm:text-lg rounded-sm hover:bg-red-700 transition-colors duration-300 md:bg-gradient-to-r md:from-red-600 md:to-red-700 md:hover:from-red-500 md:hover:to-red-600 md:shadow-lg md:shadow-red-600/30">
              GET STARTED TODAY
            </button>
          </div>
        </section>
      </main>

      <style jsx>{`
        @media (max-width: 767px) {
          .mobile-stack-container {
            perspective: 1000px;
          }
          
          .mobile-stack-card {
            transform-origin: center bottom;
          }
        }
      `}</style>
    </>
  );
}