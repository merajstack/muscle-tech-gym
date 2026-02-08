"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import JoinNowModal from "./JoinNowModal";
import MemberLoginModal from "./MemberLoginModal";
import { useMemberAuth } from "@/lib/auth/member-context";
import { User, LogOut, ShieldCheck, Sparkles } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/fitness", label: "Fitness" },
  { href: "/amenities", label: "Amenities & Services" },
  { href: "/trainers", label: "Trainers" },
  { href: "/equipment", label: "Equipment" },
];

const memberOnlyLinks = [
  { href: "/features", label: "Features" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { member, isAuthenticated, logout } = useMemberAuth();

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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black shadow-lg shadow-red-900/20 transition-all duration-500 ease-out">
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

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-6">
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
                        pathname === link.href
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      )}
                    />
                  </Link>
                ))}
                {isAuthenticated && memberOnlyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors duration-300 relative group flex items-center gap-1",
                      pathname === link.href
                        ? "text-red-600"
                        : "text-gray-300 hover:text-red-600"
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {link.label}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-0.5 bg-red-600 transition-all duration-300",
                        pathname === link.href
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      )}
                    />
                  </Link>
                ))}
              </div>

            {/* Desktop Right Actions */}
              <div className="hidden md:flex items-center space-x-3">
                {!isAuthenticated && (
                  <Link
                    href="/admin"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-sm transition-colors duration-300",
                      pathname === "/admin"
                        ? "text-red-600"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Staff</span>
                  </Link>
                )}

                {isAuthenticated && member ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm border border-zinc-700 hover:border-red-600 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                      {member.full_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-white font-medium max-w-[100px] truncate">
                      {member.full_name.split(" ")[0]}
                    </span>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-sm font-medium text-white truncate">{member.full_name}</p>
                        <p className="text-xs text-zinc-500">{member.mobile}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 border border-zinc-700 rounded-sm hover:border-red-600 hover:text-white transition-colors duration-300"
                >
                  Member Login
                </button>
              )}

                {!isAuthenticated && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 transition-colors duration-300"
                  >
                    JOIN NOW
                  </button>
                )}
              </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span
                  className={cn(
                    "w-full h-0.5 bg-white transition-all duration-300 origin-center",
                    mobileMenuOpen && "rotate-45 translate-y-2"
                  )}
                />
                <span
                  className={cn(
                    "w-full h-0.5 bg-white transition-all duration-300",
                    mobileMenuOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "w-full h-0.5 bg-white transition-all duration-300 origin-center",
                    mobileMenuOpen && "-rotate-45 -translate-y-2"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          mobileMenuOpen ? "visible" : "invisible"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300",
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={cn(
            "absolute top-16 left-0 right-0 bg-zinc-900 border-t border-zinc-800 transition-all duration-300",
            mobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          )}
        >
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

                  {/* Features - Members Only */}
                  {isAuthenticated && memberOnlyLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 text-lg font-medium py-3 border-b border-zinc-800 transition-colors duration-300",
                        pathname === link.href
                          ? "text-red-600"
                          : "text-gray-300 hover:text-red-600"
                      )}
                    >
                      <Sparkles className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}

                  {/* Staff Link */}
                {!isAuthenticated && (
                  <Link
                    href="/admin"
                    className={cn(
                      "flex items-center gap-2 text-lg font-medium py-3 border-b border-zinc-800 transition-colors duration-300",
                      pathname === "/admin"
                        ? "text-red-600"
                        : "text-gray-300 hover:text-red-600"
                    )}
                  >
                    <ShieldCheck className="h-5 w-5" />
                    Staff Dashboard
                  </Link>
                )}

              {/* Member Login / Profile */}
              {isAuthenticated && member ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 py-3 border-b border-zinc-800 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                      {member.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{member.full_name}</p>
                      <p className="text-xs text-zinc-500">View Profile</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-400 text-lg font-medium py-3 border-b border-zinc-800"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-lg font-medium py-3 border-b border-zinc-800 text-gray-300 hover:text-red-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  Member Login
                </button>
              )}

                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 transition-colors duration-300"
                  >
                    JOIN NOW
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>

      <JoinNowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <MemberLoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
