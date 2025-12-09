"use client";

import Navbar from "@/components/Navbar";
import { Upload } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Image Upload Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black z-10" />
          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center group cursor-pointer">
            <div className="text-center z-20">
              <Upload className="w-16 h-16 text-zinc-700 mx-auto mb-4 group-hover:text-zinc-600 transition-colors" />
              <p className="text-zinc-700 font-medium group-hover:text-zinc-600 transition-colors">
                Upload Hero Image
              </p>
              <p className="text-zinc-800 text-sm mt-2">1920x1080 recommended</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-20 text-center px-6 max-w-5xl">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
              UNLEASH YOUR
              <span className="block text-red-600">POTENTIAL</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your body and mind at the most advanced fitness facility
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-sm hover:bg-red-700 transition-all duration-300 hover:scale-105">
                START YOUR JOURNEY
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-sm hover:bg-white hover:text-black transition-all duration-300">
                LEARN MORE
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-black border-t border-zinc-800">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "5000+", label: "Members" },
                { number: "50+", label: "Expert Trainers" },
                { number: "100+", label: "Equipment" },
                { number: "24/7", label: "Access" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl md:text-6xl font-black text-red-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}