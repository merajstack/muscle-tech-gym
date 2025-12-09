"use client";

import Navbar from "@/components/Navbar";
import { Upload } from "lucide-react";

const equipmentCategories = [
  {
    category: "Strength Training",
    items: [
      { name: "Free Weights", description: "Complete dumbbell sets 5-150 lbs" },
      { name: "Power Racks", description: "Olympic squat racks with safety bars" },
      { name: "Cable Machines", description: "Multi-functional cable systems" },
      { name: "Bench Press", description: "Flat, incline, and decline benches" },
    ],
  },
  {
    category: "Cardio Equipment",
    items: [
      { name: "Treadmills", description: "Premium motorized treadmills" },
      { name: "Rowing Machines", description: "Concept2 rowing ergometers" },
      { name: "Assault Bikes", description: "Air resistance bikes" },
      { name: "Stair Climbers", description: "Vertical climbing machines" },
    ],
  },
  {
    category: "Functional Training",
    items: [
      { name: "Battle Ropes", description: "Heavy-duty training ropes" },
      { name: "Kettlebells", description: "8 kg to 48 kg kettlebells" },
      { name: "Plyometric Boxes", description: "Adjustable jump boxes" },
      { name: "Suspension Trainers", description: "TRX training systems" },
    ],
  },
];

export default function EquipmentPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-black to-zinc-900">
          <div className="container mx-auto px-6">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4">
              STATE-OF-THE-ART <span className="text-red-600">EQUIPMENT</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Over 100 pieces of premium equipment for every training style
            </p>
          </div>
        </section>

        {/* Featured Equipment Showcase */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
              {/* Large Featured Image */}
              <div className="lg:col-span-2 h-96 bg-zinc-900 rounded-sm flex items-center justify-center cursor-pointer group border border-zinc-800 hover:border-red-600 transition-all duration-300">
                <div className="text-center">
                  <Upload className="w-16 h-16 text-zinc-600 mx-auto mb-4 group-hover:text-zinc-500 transition-colors" />
                  <p className="text-zinc-600 font-medium group-hover:text-zinc-500 transition-colors">
                    Upload Featured Equipment Image
                  </p>
                  <p className="text-zinc-700 text-sm mt-2">1920x600 recommended</p>
                </div>
              </div>

              {/* Two Medium Images */}
              <div className="h-64 bg-zinc-900 rounded-sm flex items-center justify-center cursor-pointer group border border-zinc-800 hover:border-red-600 transition-all duration-300">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-zinc-600 mx-auto mb-2 group-hover:text-zinc-500 transition-colors" />
                  <p className="text-zinc-600 text-sm group-hover:text-zinc-500 transition-colors">
                    Upload Image
                  </p>
                </div>
              </div>
              <div className="h-64 bg-zinc-900 rounded-sm flex items-center justify-center cursor-pointer group border border-zinc-800 hover:border-red-600 transition-all duration-300">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-zinc-600 mx-auto mb-2 group-hover:text-zinc-500 transition-colors" />
                  <p className="text-zinc-600 text-sm group-hover:text-zinc-500 transition-colors">
                    Upload Image
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Equipment Categories */}
        <section className="py-20 bg-zinc-900">
          <div className="container mx-auto px-6">
            {equipmentCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="mb-16 last:mb-0"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${categoryIndex * 0.2}s both`,
                }}
              >
                <h2 className="text-4xl font-black text-white mb-8">
                  <span className="text-red-600">//</span> {category.category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-black border border-zinc-800 rounded-sm p-6 hover:border-red-600 transition-all duration-300 group"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${
                          categoryIndex * 0.2 + itemIndex * 0.1
                        }s both`,
                      }}
                    >
                      <div className="h-40 bg-zinc-900 rounded-sm mb-4 flex items-center justify-center cursor-pointer">
                        <div className="text-center">
                          <Upload className="w-10 h-10 text-zinc-700 mx-auto mb-2 group-hover:text-zinc-600 transition-colors" />
                          <p className="text-zinc-700 text-xs group-hover:text-zinc-600 transition-colors">
                            Upload
                          </p>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-white mb-2 group-hover:text-red-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 bg-black border-t border-zinc-800">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-5xl font-black text-white mb-4">
              EXPERIENCE OUR <span className="text-red-600">FACILITIES</span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Visit us for a free trial and equipment tour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-sm hover:bg-red-700 transition-all duration-300 hover:scale-105">
                SCHEDULE FREE TRIAL
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-sm hover:bg-white hover:text-black transition-all duration-300">
                CONTACT US
              </button>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
