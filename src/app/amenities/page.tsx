"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const amenitiesData = [
  { id: 1, title: "Locker Rooms", description: "Premium facilities with showers", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
  { id: 2, title: "Sauna & Steam", description: "Relax and recover", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80" },
  { id: 3, title: "Juice Bar", description: "Healthy refreshments", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80" },
  { id: 4, title: "Parking", description: "Free member parking", image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80" },
];

const servicesData = [
  { id: 5, title: "Personal Training", description: "One-on-one expert guidance", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80" },
  { id: 6, title: "Nutrition Plans", description: "Custom meal planning", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80" },
  { id: 7, title: "Group Classes", description: "Community workouts", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80" },
  { id: 8, title: "Recovery Therapy", description: "Massage and treatment", image: "https://hips.hearstapps.com/hmg-prod/images/sauna-662273f329d77.jpeg?crop=0.668xw:1.00xh;0.332xw,0&resize=640:*" },
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
                    <div className="relative h-48 bg-zinc-800 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
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
                    <div className="relative h-48 bg-zinc-800 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-red-950/50 to-transparent z-10" />
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
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