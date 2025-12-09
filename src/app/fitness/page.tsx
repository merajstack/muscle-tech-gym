"use client";

import Navbar from "@/components/Navbar";
import { Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const initialCategories = [
  { id: 1, title: "GYM", description: "State-of-the-art equipment" },
  { id: 2, title: "CROSSFIT", description: "High-intensity functional training" },
  { id: 3, title: "CARDIO", description: "Burn calories effectively" },
];

const replacementCategories = [
  { id: 4, title: "KICKBOXING", description: "Combat fitness training" },
  { id: 5, title: "MARTIAL ARTS", description: "Discipline and strength" },
  { id: 6, title: "YOGA", description: "Flexibility and mindfulness" },
];

export default function FitnessPage() {
  const [showReplacement, setShowReplacement] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.6;
        const transitionRange = window.innerHeight * 0.4;
        
        // Calculate smooth transition progress
        const distanceFromTrigger = triggerPoint - rect.top;
        const progress = Math.max(0, Math.min(1, distanceFromTrigger / transitionRange));
        
        setTransitionProgress(progress);
        setShowReplacement(progress > 0.5);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayCategories = showReplacement ? replacementCategories : initialCategories;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-black to-zinc-900">
          <div className="container mx-auto px-6">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4">
              FITNESS <span className="text-red-600">PROGRAMS</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Discover our comprehensive range of fitness programs designed for every goal
            </p>
          </div>
        </section>

        {/* Staggered Triangle Layout with Card Replacement */}
        <section className="py-20 min-h-screen" ref={triggerRef}>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayCategories.map((category, index) => {
                const exitOpacity = showReplacement ? 0 : 1 - transitionProgress;
                const enterOpacity = showReplacement ? transitionProgress * 2 - 1 : 0;
                const currentOpacity = showReplacement ? Math.max(0, enterOpacity) : exitOpacity;
                
                const exitTransform = showReplacement ? -50 : transitionProgress * -50;
                const enterTransform = showReplacement ? (1 - transitionProgress) * 50 : 50;
                const currentTransform = showReplacement ? enterTransform : exitTransform;

                return (
                  <div
                    key={category.id}
                    className="transition-all duration-700 ease-out"
                    style={{
                      marginTop: `${index * 80}px`,
                      opacity: currentOpacity,
                      transform: `translateY(${currentTransform}px) scale(${0.95 + currentOpacity * 0.05})`,
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <div className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden group hover:border-red-600 transition-all duration-500">
                      {/* Image Upload Placeholder */}
                      <div className="relative h-64 bg-zinc-800 flex items-center justify-center cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <div className="text-center z-20">
                          <Upload className="w-12 h-12 text-zinc-600 mx-auto mb-2 group-hover:text-zinc-500 transition-colors" />
                          <p className="text-zinc-600 text-sm group-hover:text-zinc-500 transition-colors">
                            Upload Image
                          </p>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <h3 className="text-3xl font-black text-white mb-2 group-hover:text-red-600 transition-colors duration-300">
                          {category.title}
                        </h3>
                        <p className="text-gray-400 mb-4">{category.description}</p>
                        <button className="w-full py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-colors duration-300">
                          LEARN MORE
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-16">
              <p className="text-gray-500 text-sm">
                {showReplacement ? "Showing advanced programs" : "Scroll to see more programs"}
              </p>
            </div>
          </div>
        </section>

        {/* Additional Content for Scroll */}
        <section className="py-40 bg-zinc-900">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-black text-white mb-4">
              READY TO <span className="text-red-600">START?</span>
            </h2>
            <p className="text-gray-400 mb-8">Join thousands of members achieving their goals</p>
            <button className="px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-sm hover:bg-red-700 transition-colors duration-300">
              GET STARTED TODAY
            </button>
          </div>
        </section>
      </main>
    </>
  );
}