"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";

const equipmentCategories = [
  {
    category: "Strength Training",
    items: [
      { name: "Free Weights", description: "Complete dumbbell sets 5-150 lbs", image: "https://barbellstandard.com/cdn/shop/files/hex-dumbbells-heavy-set_7fc8abc8-797c-4039-b61c-16377dd137fb.jpg?v=1762449507&width=1445" },
      { name: "Power Racks", description: "Olympic squat racks with safety bars", image: "https://ca.ironbullstrength.com/cdn/shop/articles/db4da12b94a1b9833a51fa1754156cd2.jpg?v=1722622944" },
      { name: "Cable Machines", description: "Multi-functional cable systems", image: "https://trainingstation.co.uk/cdn/shop/articles/matrix-aura-cable-crossover-for-exercises_59353af7-d3cc-46e7-8647-42327e0efc0a_1250x.png?v=1750422520" },
      { name: "Bench Press", description: "Flat, incline, and decline benches", image: "https://barbellstandard.com/cdn/shop/files/bench-bar-1.jpg?v=1762551320&width=1445" },
    ],
  },
  {
    category: "Cardio Equipment",
    items: [
      { name: "Treadmills", description: "Premium motorized treadmills", image: "https://st.depositphotos.com/29490188/54085/i/1600/depositphotos_540854964-stock-photo-row-of-treadmills-at-gym.jpg" },
      { name: "Rowing Machines", description: "Concept2 rowing ergometers", image: "https://hips.hearstapps.com/hmg-prod/images/dsc01737-1-jpg-68539980992c9.jpg?crop=0.652xw%3A0.976xh%3B0.330xw%2C0&resize=1200%3A%2A" },
      { name: "Assault Bikes", description: "Air resistance bikes", image: "https://shop.lifefitness.com/cdn/shop/products/hammer-strength-hd-air-bike-lined-up-lifestyle-1000x1000_1200x1200.jpg?v=1748945270" },
      { name: "Stair Climbers", description: "Vertical climbing machines", image: "https://www.treadmillreviewguru.com/wp-content/uploads/Best-Vertical-Climbers.jpg" },
    ],
  },
  {
    category: "Functional Training",
    items: [
      { name: "Battle Ropes", description: "Heavy-duty training ropes", image: "https://shop.lifefitness.com/cdn/shop/products/outdoor-workout-battle-rope-1000x1000_1200x1200.jpg?v=1748945255" },
      { name: "Kettlebells", description: "8 kg to 48 kg kettlebells", image: "https://braingain.fit/cdn/shop/articles/Choosing_the_Right_Kettlebell_a61de227-af63-4731-b2aa-82548d92ab83.webp?v=1755173608&width=1536" },
      { name: "Plyometric Boxes", description: "Adjustable jump boxes", image: "https://assets.roguefitness.com/f_auto,q_auto,c_limit,w_1600,b_rgb:ffffff/catalog/Conditioning/Plyo%20Boxes%20/Foam%20Plyoboxes/XX4095/XX4095-WEB2_vfqr2m.png" },
      { name: "Suspension Trainers", description: "TRX training systems", image: "https://www.eliteprofitca.com/wp-content/uploads/2021/01/20210313_061519.jpg" },
    ],
  },
];

export default function EquipmentPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-20">
        {/* Hero Section - Desktop gradient */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-black to-zinc-900 md:bg-gradient-to-br md:from-black md:via-emerald-950/20 md:to-zinc-900">
          <div className="container mx-auto px-4 sm:px-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4">
              STATE-OF-THE-ART <span className="text-red-600">EQUIPMENT</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl">
              Over 100 pieces of premium equipment for every training style
            </p>
          </div>
        </section>

        {/* Equipment Categories */}
        <section className="py-12 sm:py-16 md:py-20 bg-zinc-900 md:bg-gradient-to-b md:from-zinc-900 md:via-black md:to-zinc-900">
          <div className="container mx-auto px-4 sm:px-6">
            {equipmentCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="mb-12 sm:mb-16 last:mb-0"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${categoryIndex * 0.2}s both`,
                }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6 sm:mb-8 md:bg-gradient-to-r md:from-white md:to-gray-300 md:bg-clip-text md:text-transparent">
                  <span className="text-red-600 md:bg-gradient-to-r md:from-red-500 md:to-emerald-500 md:bg-clip-text md:text-transparent">//</span> {category.category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-black border border-zinc-800 rounded-sm overflow-hidden hover:border-red-600 transition-all duration-300 group md:bg-gradient-to-br md:from-zinc-900 md:via-zinc-800/50 md:to-zinc-900 md:border-zinc-700/50 md:hover:shadow-lg md:hover:shadow-emerald-600/20"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${
                          categoryIndex * 0.2 + itemIndex * 0.1
                        }s both`,
                      }}
                    >
                      <div className="relative h-40 sm:h-48 bg-zinc-900 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-black text-white mb-2 group-hover:text-red-600 transition-colors md:bg-gradient-to-r md:from-white md:to-gray-300 md:bg-clip-text md:text-transparent md:group-hover:from-red-500 md:group-hover:to-emerald-500">
                          {item.name}
                        </h3>
                        <p className="text-gray-500 text-xs sm:text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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