"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/fitness", label: "Fitness" },
  { href: "/amenities", label: "Amenities & Services" },
  { href: "/trainers", label: "Trainers" },
  { href: "/equipment", label: "Equipment" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        scrolled ? "bg-black/95 backdrop-blur-sm shadow-lg shadow-red-900/20" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-white">MUSCLE</span>
              <span className="text-red-600"> TECH</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300 relative group",
                  pathname === link.href
                    ? "text-red-600"
                    : "text-gray-300 hover:text-red-600"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-red-600 transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </div>

          <button className="hidden md:block px-6 py-2.5 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 transition-colors duration-300">
            JOIN NOW
          </button>
        </div>
      </div>
    </nav>
  );
}
