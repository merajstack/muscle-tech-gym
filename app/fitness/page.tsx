"use client";

import Navbar from "@/components/Navbar";
import { Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const allCategories = [
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
  { id: 4, title: "KICKBOXING", description: "Combat fitness training", image: "https://yokkao.com/cdn/shop/files/intro1.jpg?v=1626149693&width=1620" },
  { id: 5, title: "MARTIAL ARTS", description: "Discipline and strength", image: "https://cdn.britannica.com/07/145407-050-8DBD77E9/belts.jpg" },
  { id: 6, title: "YOGA", description: "Flexibility and mindfulness", image: "https://st.perplexity.ai/estatic/0b226c450798410ac541646c86ec31afd840e5beab817a5d84fa821e7db61981ec84c3b4a3f072a7a2e1899c9fb06c6e3b16ca281d983c1633625c9b220edc3f0f7852a42c0d8cc71f1f48adb86614461afb6f34723a8d0797425ebba482d75f" },
];

export default function FitnessPage() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [dispersed, setDispersed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted) {
            setAnimationStarted(true);
            allCategories.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 400);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [animationStarted]);

  const handleViewAll = () => {
    setDispersed(true);
  };

  const getDisperseTransform = (index: number) => {
    const angles = [
      { x: -150, y: -100, rotate: -25 },
      { x: 150, y: -80, rotate: 20 },
      { x: -200, y: 50, rotate: -15 },
      { x: 200, y: 30, rotate: 25 },
      { x: -100, y: 150, rotate: -20 },
      { x: 100, y: 180, rotate: 15 },
    ];
    return angles[index] || { x: 0, y: 0, rotate: 0 };
  };

  const topCardIndex = visibleCards.length > 0 ? visibleCards[visibleCards.length - 1] : -1;
  const topCard = topCardIndex >= 0 ? allCategories[topCardIndex] : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-20">
        {/* Hero Section */}
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

        {/* Card Stack Animation Section */}
        <section 
          ref={sectionRef}
          className="py-12 sm:py-16 md:py-20 min-h-screen md:bg-gradient-to-b md:from-zinc-900 md:via-black md:to-zinc-900 overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6">
            {!dispersed ? (
              <>
                <div className="flex items-center justify-center min-h-[600px] relative">
                  <div className="relative w-full max-w-md" style={{ height: '500px' }}>
                    {allCategories.map((category, index) => {
                      const isVisible = visibleCards.includes(index);
                      const stackPosition = visibleCards.indexOf(index);
                      const isFromLeft = index % 2 === 0;
                      const reverseStackPosition = isVisible ? visibleCards.length - 1 - stackPosition : 0;
                      const verticalOffset = reverseStackPosition * 12;
                      const horizontalOffset = reverseStackPosition % 2 === 0 ? reverseStackPosition * 2 : -reverseStackPosition * 2;
                      const rotation = reverseStackPosition % 2 === 0 ? reverseStackPosition * 0.5 : -reverseStackPosition * 0.5;
                      const zIndex = isVisible ? stackPosition + 1 : 0;

                      return (
                        <div
                          key={category.id}
                          className="absolute inset-0 transition-all ease-out"
                          style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible
                              ? `translateX(${horizontalOffset}px) translateY(${-verticalOffset}px) scale(${1 - reverseStackPosition * 0.02}) rotate(${rotation}deg)`
                              : `translateX(${isFromLeft ? '-100vw' : '100vw'}) scale(0.8) rotate(${isFromLeft ? -15 : 15}deg)`,
                            transitionDuration: '800ms',
                            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                            zIndex: zIndex,
                          }}
                        >
                          <div 
                            className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-600 transition-all duration-500 md:bg-gradient-to-br md:from-zinc-900 md:via-zinc-800/50 md:to-zinc-900 md:border-zinc-700/50"
                            style={{
                              boxShadow: isVisible 
                                ? `0 ${10 + reverseStackPosition * 5}px ${30 + reverseStackPosition * 10}px rgba(0, 0, 0, 0.5), 0 ${5 + reverseStackPosition * 2}px ${15 + reverseStackPosition * 5}px rgba(220, 38, 38, 0.1)`
                                : 'none',
                            }}
                          >
                            <div className="relative h-48 sm:h-56 md:h-64 bg-zinc-800 overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                              {'image' in category ? (
                                <Image
                                  src={category.image}
                                  alt={category.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                  sizes="(max-width: 768px) 100vw, 400px"
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
                            <div className="p-4 sm:p-6">
                              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-red-600 transition-colors duration-300">
                                {category.title}
                              </h3>
                              <p className="text-gray-400 mb-4 text-sm sm:text-base">{category.description}</p>
                              <button className="w-full py-2 sm:py-3 bg-red-600 text-white font-bold text-sm sm:text-base rounded-sm hover:bg-red-700 transition-colors duration-300">
                                LEARN MORE
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {visibleCards.length === allCategories.length && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleViewAll}
                      className="px-8 py-3 bg-red-600 text-white font-bold text-lg rounded-sm hover:bg-red-700 transition-all duration-300 hover:scale-105"
                    >
                      VIEW ALL
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {allCategories.map((category, index) => (
                  <div
                    key={category.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-600 transition-all duration-500 md:bg-gradient-to-br md:from-zinc-900 md:via-zinc-800/50 md:to-zinc-900 md:border-zinc-700/50 opacity-0 animate-fade-slide-up"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'forwards',
                    }}
                  >
                    <div className="relative h-48 sm:h-56 bg-zinc-800 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-red-600 transition-colors duration-300">
                        {category.title}
                      </h3>
                      <p className="text-gray-400 mb-4 text-sm sm:text-base">{category.description}</p>
                      <button className="w-full py-2 sm:py-3 bg-red-600 text-white font-bold text-sm sm:text-base rounded-sm hover:bg-red-700 transition-colors duration-300">
                        LEARN MORE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
        @keyframes fade-slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-slide-up {
          animation: fade-slide-up 0.6s ease-out;
        }
      `}</style>
    </>
  );
}