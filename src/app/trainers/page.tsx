"use client";

import Navbar from "@/components/Navbar";
import { Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const trainersData = [
  {
    id: 1,
    name: "MIKE JOHNSON",
    specialty: "Strength & Conditioning",
    experience: "15 Years Experience",
  },
  {
    id: 2,
    name: "SARAH WILLIAMS",
    specialty: "Yoga & Flexibility",
    experience: "10 Years Experience",
  },
];

export default function TrainersPage() {
  const [isPinned, setIsPinned] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = sectionRef.current.offsetHeight;
        const windowHeight = window.innerHeight;

        const shouldPin = rect.top <= 0 && rect.bottom > windowHeight;
        setIsPinned(shouldPin);

        if (shouldPin) {
          const scrolled = Math.abs(rect.top);
          const totalScroll = sectionHeight - windowHeight;
          const progress = Math.min(scrolled / totalScroll, 1);
          setScrollProgress(progress);
        } else if (rect.top > 0) {
          setScrollProgress(0);
        } else {
          setScrollProgress(1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-black">
        {/* Hero Section - Minimal centered design matching reference */}
        <section className="h-screen flex items-center justify-center bg-black">
          <div className="text-center">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter">
              TRAINERS
            </h1>
            <p className="text-gray-500 text-base sm:text-lg mt-6 tracking-wide">
              Scroll to reveal our elite team
            </p>
          </div>
        </section>

        {/* Scroll-Jacking Pinned Trainers Section */}
        <section
          ref={sectionRef}
          className="relative"
          style={{ height: `${300}vh` }}
        >
          <div
            className={`${
              isPinned ? "fixed top-0 left-0 right-0" : "absolute top-0 left-0 right-0"
            } h-screen bg-black flex items-center justify-center overflow-hidden`}
          >
            <div
              className="absolute inset-0 bg-black transition-opacity duration-1000"
              style={{
                opacity: 1 - scrollProgress * 0.3,
              }}
            />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                {trainersData.map((trainer, index) => {
                  const totalCards = trainersData.length;
                  const revealStart = index / (totalCards + 1);
                  const revealEnd = (index + 1.5) / (totalCards + 1);
                  const revealRange = revealEnd - revealStart;
                  
                  const cardProgress = Math.max(
                    0,
                    Math.min(1, (scrollProgress - revealStart) / revealRange)
                  );

                  return (
                    <div
                      key={trainer.id}
                      className="transition-all duration-[1200ms] ease-out"
                      style={{
                        opacity: cardProgress,
                        transform: `translateY(${(1 - cardProgress) * 80}px) scale(${0.85 + cardProgress * 0.15})`,
                        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                    >
                      <div className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden group hover:border-red-600 transition-all duration-300">
                        <div className="relative h-64 sm:h-72 md:h-80 bg-zinc-800 flex items-center justify-center cursor-pointer">
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                          <div className="text-center z-20">
                            <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-600 mx-auto mb-2 group-hover:text-zinc-500 transition-colors" />
                            <p className="text-zinc-600 text-xs sm:text-sm group-hover:text-zinc-500 transition-colors px-2">
                              Upload Trainer Photo
                            </p>
                          </div>
                        </div>

                        <div className="p-4 sm:p-6">
                          <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-red-600 transition-colors">
                            {trainer.name}
                          </h3>
                          <p className="text-red-600 font-semibold mb-1 text-sm sm:text-base">{trainer.specialty}</p>
                          <p className="text-gray-500 text-xs sm:text-sm">{trainer.experience}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2">
                  {trainersData.map((_, index) => {
                    const dotProgress = Math.max(
                      0,
                      Math.min(1, (scrollProgress * (trainersData.length + 1)) - index)
                    );
                    
                    return (
                      <div
                        key={index}
                        className="h-1.5 sm:h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${6 + dotProgress * 20}px`,
                          backgroundColor: dotProgress > 0 ? '#dc2626' : '#3f3f46',
                          opacity: 0.3 + dotProgress * 0.7,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content After Scroll Section */}
        <section className="py-20 sm:py-32 md:py-40 bg-zinc-900">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              TRAIN WITH THE <span className="text-red-600">BEST</span>
            </h2>
            <p className="text-gray-400 mb-8 text-sm sm:text-base">
              All our trainers are certified and passionate about helping you succeed
            </p>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white font-bold text-base sm:text-lg rounded-sm hover:bg-red-700 transition-colors duration-300">
              VIEW ALL TRAINERS
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
