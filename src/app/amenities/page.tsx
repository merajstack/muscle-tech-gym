"use client";

import Navbar from "@/components/Navbar";
import { Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const amenitiesData = [
  { id: 1, title: "Locker Rooms", description: "Premium facilities with showers" },
  { id: 2, title: "Sauna & Steam", description: "Relax and recover" },
  { id: 3, title: "Juice Bar", description: "Healthy refreshments" },
  { id: 4, title: "Parking", description: "Free member parking" },
];

const servicesData = [
  { id: 5, title: "Personal Training", description: "One-on-one expert guidance" },
  { id: 6, title: "Nutrition Plans", description: "Custom meal planning" },
  { id: 7, title: "Group Classes", description: "Community workouts" },
  { id: 8, title: "Recovery Therapy", description: "Massage and treatment" },
];

export default function AmenitiesPage() {
  const [showServices, setShowServices] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.4;
        setShowServices(rect.top < triggerPoint);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-black to-zinc-900">
          <div className="container mx-auto px-6">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4">
              AMENITIES & <span className="text-red-600">SERVICES</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Everything you need for the ultimate fitness experience
            </p>
          </div>
        </section>

        {/* Z-Axis Replacement Animation Section */}
        <section className="py-20 min-h-screen relative" ref={triggerRef}>
          <div className="container mx-auto px-6">
            <div className="relative" style={{ perspective: "2000px" }}>
              {/* Amenities Cards - Slide Back */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 ease-out"
                style={{
                  transform: showServices
                    ? "translateZ(-400px) scale(0.8)"
                    : "translateZ(0) scale(1)",
                  opacity: showServices ? 0 : 1,
                  position: showServices ? "absolute" : "relative",
                  width: "100%",
                }}
              >
                {amenitiesData.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden group hover:border-red-600 transition-all duration-300"
                    style={{
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="relative h-48 bg-zinc-800 flex items-center justify-center cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                      <div className="text-center z-20">
                        <Upload className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                        <p className="text-zinc-600 text-sm">Upload Image</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-black text-white mb-2 group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Services Cards - Slide Forward */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 ease-out"
                style={{
                  transform: showServices
                    ? "translateZ(0) scale(1)"
                    : "translateZ(-400px) scale(0.8)",
                  opacity: showServices ? 1 : 0,
                  position: showServices ? "relative" : "absolute",
                  top: 0,
                  width: "100%",
                }}
              >
                {servicesData.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900 border border-red-900 rounded-sm overflow-hidden group hover:border-red-600 transition-all duration-300"
                    style={{
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="relative h-48 bg-zinc-800 flex items-center justify-center cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-t from-red-950/50 to-transparent z-10" />
                      <div className="text-center z-20">
                        <Upload className="w-10 h-10 text-red-600 mx-auto mb-2" />
                        <p className="text-red-600 text-sm">Upload Image</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-black text-red-600 mb-2 group-hover:text-red-500 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-500 text-sm">
                {showServices ? "Viewing Professional Services" : "Viewing Amenities - Scroll to see services"}
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 bg-zinc-900">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-black text-white mb-4">
              EXPERIENCE THE <span className="text-red-600">DIFFERENCE</span>
            </h2>
            <p className="text-gray-400 mb-8">Book a free tour of our facilities</p>
            <button className="px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-sm hover:bg-red-700 transition-colors duration-300">
              SCHEDULE TOUR
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
