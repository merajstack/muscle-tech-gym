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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileScrollIndex, setMobileScrollIndex] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.4;
        setShowServices(rect.top < triggerPoint);

        if (isMobile) {
          const sectionTop = rect.top;
          const windowHeight = window.innerHeight;
          const scrollInSection = Math.max(0, windowHeight * 0.3 - sectionTop);
          const cardHeight = 300;
          const currentData = showServices ? servicesData : amenitiesData;
          const newIndex = Math.floor(scrollInSection / cardHeight);
          setMobileScrollIndex(Math.max(0, Math.min(newIndex, currentData.length - 1)));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, showServices]);

  const currentData = showServices ? servicesData : amenitiesData;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-20">
        {/* Hero Section - Desktop gradient */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-black to-zinc-900 md:bg-gradient-to-br md:from-black md:via-purple-950/20 md:to-zinc-900">
          <div className="container mx-auto px-4 sm:px-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:bg-gradient-to-r md:from-white md:via-purple-200 md:to-white md:bg-clip-text md:text-transparent">
              AMENITIES & <span className="text-red-600 md:bg-gradient-to-r md:from-red-500 md:to-pink-500 md:bg-clip-text md:text-transparent">SERVICES</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl">
              Everything you need for the ultimate fitness experience
            </p>
          </div>
        </section>

        {/* Z-Axis Replacement Animation Section */}
        <section className="py-12 sm:py-16 md:py-20 min-h-screen relative md:bg-gradient-to-b md:from-zinc-900 md:via-black md:to-zinc-900" ref={triggerRef}>
          <div className="container mx-auto px-4 sm:px-6">
            <div className="relative" style={{ perspective: "2000px" }}>
              {/* Amenities Cards - Slide Back */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 transition-all duration-1000 ease-out ${isMobile ? 'mobile-stack-container' : ''}`}
                style={{
                  transform: showServices
                    ? "translateZ(-400px) scale(0.8)"
                    : "translateZ(0) scale(1)",
                  opacity: showServices ? 0 : 1,
                  position: showServices ? "absolute" : "relative",
                  width: "100%",
                }}
              >
                {amenitiesData.map((item, index) => {
                  const isCardVisible = isMobile ? index <= mobileScrollIndex : true;
                  const mobileStackOffset = isMobile ? (mobileScrollIndex - index) * 8 : 0;

                  return (
                    <div
                      key={item.id}
                      className={`bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden group hover:border-red-600 transition-all duration-600 ease-out md:bg-gradient-to-br md:from-zinc-900 md:via-zinc-800/50 md:to-zinc-900 md:border-zinc-700/50 md:hover:shadow-lg md:hover:shadow-purple-600/20 ${isMobile ? 'mobile-stack-card' : ''}`}
                      style={{
                        transitionDelay: isMobile ? '0ms' : `${index * 100}ms`,
                        ...(isMobile && {
                          transform: `translateY(${isCardVisible ? mobileStackOffset : 100}px) scale(${isCardVisible ? 1 - (mobileScrollIndex - index) * 0.02 : 0.9})`,
                          zIndex: isCardVisible ? amenitiesData.length - index : 0,
                          opacity: isCardVisible ? 1 : 0,
                        }),
                      }}
                    >
                      <div className="relative h-40 sm:h-48 bg-zinc-800 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-red-600 transition-colors md:bg-gradient-to-r md:from-white md:to-gray-300 md:bg-clip-text md:text-transparent">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Services Cards - Slide Forward */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 transition-all duration-1000 ease-out ${isMobile ? 'mobile-stack-container' : ''}`}
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
                {servicesData.map((item, index) => {
                  const isCardVisible = isMobile ? index <= mobileScrollIndex : true;
                  const mobileStackOffset = isMobile ? (mobileScrollIndex - index) * 8 : 0;

                  return (
                    <div
                      key={item.id}
                      className={`bg-zinc-900 border border-red-900 rounded-sm overflow-hidden group hover:border-red-600 transition-all duration-600 ease-out md:bg-gradient-to-br md:from-zinc-900 md:via-red-950/30 md:to-zinc-900 md:border-red-800/50 md:hover:shadow-lg md:hover:shadow-red-600/30 ${isMobile ? 'mobile-stack-card' : ''}`}
                      style={{
                        transitionDelay: isMobile ? '0ms' : `${index * 100}ms`,
                        ...(isMobile && {
                          transform: `translateY(${isCardVisible ? mobileStackOffset : 100}px) scale(${isCardVisible ? 1 - (mobileScrollIndex - index) * 0.02 : 0.9})`,
                          zIndex: isCardVisible ? servicesData.length - index : 0,
                          opacity: isCardVisible ? 1 : 0,
                        }),
                      }}
                    >
                      <div className="relative h-40 sm:h-48 bg-zinc-800 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-red-950/50 to-transparent z-10" />
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3 className="text-xl sm:text-2xl font-black text-red-600 mb-2 group-hover:text-red-500 transition-colors md:bg-gradient-to-r md:from-red-500 md:to-orange-500 md:bg-clip-text md:text-transparent">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center mt-8 sm:mt-12">
              <p className="text-gray-500 text-xs sm:text-sm">
                {showServices ? "Viewing Professional Services" : "Viewing Amenities - Scroll to see services"}
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-32 md:py-40 bg-zinc-900 md:bg-gradient-to-b md:from-zinc-900 md:via-purple-950/10 md:to-black">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 md:bg-gradient-to-r md:from-white md:via-purple-200 md:to-white md:bg-clip-text md:text-transparent">
              EXPERIENCE THE <span className="text-red-600 md:bg-gradient-to-r md:from-red-500 md:to-pink-500 md:bg-clip-text md:text-transparent">DIFFERENCE</span>
            </h2>
            <p className="text-gray-400 mb-8 text-sm sm:text-base">Book a free tour of our facilities</p>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white font-bold text-base sm:text-lg rounded-sm hover:bg-red-700 transition-colors duration-300 md:bg-gradient-to-r md:from-red-600 md:to-pink-600 md:hover:from-red-500 md:hover:to-pink-500 md:shadow-lg md:shadow-red-600/30">
              SCHEDULE TOUR
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