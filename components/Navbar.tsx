"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navLinks = [
{ href: "/fitness", label: "Fitness" },
{ href: "/amenities", label: "Amenities & Services" },
{ href: "/trainers", label: "Trainers" },
{ href: "/equipment", label: "Equipment" }];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-black shadow-lg shadow-red-900/20 transition-all duration-500 ease-out">

        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/logo-1765285879734.avif"
                alt="Muscle Tech Logo"
                width={180}
                height={60}
                className="h-12 sm:h-16 w-auto object-contain"
                priority
              />
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) =>
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300 relative group",
                  pathname === link.href ?
                  "text-red-600" :
                  "text-gray-300 hover:text-red-600"
                )}>

                  {link.label}
                  <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-red-600 transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )} />

                </Link>
              )}
            </div>

            <button className="hidden md:block px-6 py-2.5 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 transition-colors duration-300">
              JOIN NOW
            </button>

            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={cn(
                  "w-full h-0.5 bg-white transition-all duration-300 origin-center",
                  mobileMenuOpen && "rotate-45 translate-y-2"
                )} />
                <span className={cn(
                  "w-full h-0.5 bg-white transition-all duration-300",
                  mobileMenuOpen && "opacity-0"
                )} />
                <span className={cn(
                  "w-full h-0.5 bg-white transition-all duration-300 origin-center",
                  mobileMenuOpen && "-rotate-45 -translate-y-2"
                )} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div className={cn(
        "fixed inset-0 z-40 md:hidden transition-all duration-300",
        mobileMenuOpen ? "visible" : "invisible"
      )}>
        <div 
          className={cn(
            "absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300",
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        <div className={cn(
          "absolute top-16 left-0 right-0 bg-zinc-900 border-t border-zinc-800 transition-all duration-300",
          mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        )}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-lg font-medium py-3 border-b border-zinc-800 transition-colors duration-300",
                    pathname === link.href
                      ? "text-red-600"
                      : "text-gray-300 hover:text-red-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <button className="w-full mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 transition-colors duration-300">
                JOIN NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}