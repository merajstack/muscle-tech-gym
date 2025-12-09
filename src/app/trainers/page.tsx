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
  {
    id: 3,
    name: "DAVID CHEN",
    specialty: "CrossFit & HIIT",
    experience: "12 Years Experience",
  },
  {
    id: 4,
    name: "EMMA RODRIGUEZ",
    specialty: "Nutrition & Wellness",
    experience: "8 Years Experience",
  },
];

export default function TrainersPage() {
  const [revealedCards, setRevealedCards] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = sectionRef.current.offsetHeight;
        const windowHeight = window.innerHeight;

        // Pin when section enters viewport
        const shouldPin = rect.top <= 0 && rect.bottom > windowHeight;
        setIsPinned(shouldPin);

        if (shouldPin) {
          // Calculate scroll progress through the pinned section
          const scrolled = Math.abs(rect.top);
          const totalScroll = sectionHeight - windowHeight;
          const progress = Math.min(scrolled / totalScroll, 1);
          setScrollProgress(progress);

          // Reveal cards based on scroll progress
          const cardsToReveal = Math.floor(progress * trainersData.length);
          setRevealedCards(cardsToReveal);
        } else if (rect.top > 0) {
          // Before section
          setRevealedCards(0);
          setScrollProgress(0);
        } else {
          // After section
          setRevealedCards(trainersData.length);
          setScrollProgress(1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-black">
        {/* Hero Section */}
        <section className="min-h-screen pt-20 flex items-center bg-gradient-to-b from-black to-zinc-900">
          <div className="container mx-auto px-6">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4">
              EXPERT <span className="text-red-600">TRAINERS</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-8">
              Meet our certified professionals dedicated to your success
            </p>
            <p className="text-gray-500">Scroll down to meet the team</p>
          </div>
        </section>

        {/* Scroll-Jacking Pinned Trainers Section */}
        <section
          ref={sectionRef}
          className="relative"
          style={{ height: `${300}vh` }} // Extra height for scroll-jacking effect
        >
          <div
            className={`${
              isPinned ? "fixed top-0 left-0 right-0" : "absolute top-0 left-0 right-0"
            } h-screen bg-black flex items-center justify-center overflow-hidden`}
          >
            {/* Background overlay that fades */}
            <div
              className="absolute inset-0 bg-black transition-opacity duration-700"
              style={{
                opacity: 1 - scrollProgress * 0.3,
              }}
            />

            {/* Trainers Grid */}
            <div className="container mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trainersData.map((trainer, index) => {
                  const isRevealed = index < revealedCards;
                  const cardProgress = Math.max(
                    0,
                    Math.min(1, (scrollProgress * trainersData.length - index) / 1)
                  );

                  return (
                    <div
                      key={trainer.id}
                      className="transition-all duration-1000 ease-out"
                      style={{
                        opacity: isRevealed ? cardProgress : 0,
                        transform: `translateY(${isRevealed ? 0 : 50}px) scale(${
                          isRevealed ? 1 : 0.9
                        })`,
                      }}
                    >
                      <div className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden group hover:border-red-600 transition-all duration-300">
                        {/* Image Upload Placeholder */}
                        <div className="relative h-80 bg-zinc-800 flex items-center justify-center cursor-pointer">
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                          <div className="text-center z-20">
                            <Upload className="w-12 h-12 text-zinc-600 mx-auto mb-2 group-hover:text-zinc-500 transition-colors" />
                            <p className="text-zinc-600 text-sm group-hover:text-zinc-500 transition-colors">
                              Upload Trainer Photo
                            </p>
                          </div>
                        </div>

                        {/* Trainer Info */}
                        <div className="p-6">
                          <h3 className="text-2xl font-black text-white mb-2 group-hover:text-red-600 transition-colors">
                            {trainer.name}
                          </h3>
                          <p className="text-red-600 font-semibold mb-1">{trainer.specialty}</p>
                          <p className="text-gray-500 text-sm mb-4">{trainer.experience}</p>
                          <button className="w-full py-3 bg-transparent border border-red-600 text-red-600 font-bold rounded-sm hover:bg-red-600 hover:text-white transition-all duration-300">
                            BOOK SESSION
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2">
                  {trainersData.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index < revealedCards ? "w-8 bg-red-600" : "w-2 bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content After Scroll Section */}
        <section className="py-40 bg-zinc-900">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-black text-white mb-4">
              TRAIN WITH THE <span className="text-red-600">BEST</span>
            </h2>
            <p className="text-gray-400 mb-8">
              All our trainers are certified and passionate about helping you succeed
            </p>
            <button className="px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-sm hover:bg-red-700 transition-colors duration-300">
              VIEW ALL TRAINERS
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
