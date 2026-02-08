"use client";

import Link from "next/link";
import { Phone, MapPin, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Don't show footer on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-black border-t border-zinc-800 pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-red-600 rounded-full"></span>
              Contact Us
            </h3>
            
            <div className="flex items-start gap-4 group">
              <div className="mt-1 p-2 rounded-lg bg-zinc-900 group-hover:bg-red-600/10 transition-colors duration-300">
                <MapPin className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-gray-400 leading-relaxed">
                <p className="font-semibold text-white mb-1">Our Location</p>
                <p>SHOP NO. 16, 113/15/1/A,</p>
                <p>Madhura Nagar, Beeramguda,</p>
                <p>Beside Vijetha Super Market,</p>
                <p>Near Shivalayam Gutta Kaman,</p>
                <p>Beeramguda, Hyderabad,</p>
                <p>Telangana – 502032</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="p-2 rounded-lg bg-zinc-900 group-hover:bg-red-600/10 transition-colors duration-300">
                <Phone className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Call Us</p>
                <a 
                  href="tel:09666043823"
                  className="text-gray-400 hover:text-red-600 transition-colors duration-300 font-medium"
                >
                  09666043823
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links or Branding */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                Muscle Tech Premium Gym
              </h3>
              <p className="text-gray-400 max-w-sm">
                Elevate your fitness journey with our premium equipment, expert trainers, and state-of-the-art facilities.
              </p>
            </div>
            
            <div className="mt-8 md:mt-0 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Member Support</p>
              <p className="text-sm text-zinc-400">Available from 5:00 AM to 9:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Muscle Tech Premium Gym. All rights reserved.
          </p>
          
          <Link 
            href="https://wfy.co.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-300"
          >
            <span>Designed & Developed by <span className="text-zinc-300 group-hover:text-red-500 transition-colors">WebForYou</span></span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
