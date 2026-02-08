"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { useMemberAuth } from "@/lib/auth/member-context";
import { cn } from "@/lib/utils";

interface MemberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberLoginModal({ isOpen, onClose }: MemberLoginModalProps) {
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [displayOtp, setDisplayOtp] = useState("");
  const [memberName, setMemberName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useMemberAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/otp/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }
      setMemberName(data.member_name);
      setDisplayOtp(data.otp);
      setStep("otp");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }
      login(data.member);
      setStep("success");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep("phone");
    setMobile("");
    setOtp("");
    setDisplayOtp("");
    setMemberName("");
    setError("");
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="text-center">
                <div className="mx-auto w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mb-3">
                  <Phone className="text-red-600 h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold text-white">Member Login</h2>
                <p className="text-sm text-gray-400 mt-1">Enter your registered mobile number</p>
              </div>

              {error && (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white text-center text-lg tracking-widest outline-none focus:border-red-600 transition-colors"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || mobile.length < 10}
                className="w-full rounded-lg bg-red-600 py-3 font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <div className="mx-auto w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mb-3">
                  <KeyRound className="text-red-600 h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold text-white">Enter OTP</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Welcome back, <span className="text-white font-medium">{memberName}</span>
                </p>
              </div>

              {displayOtp && (
                <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3 text-center">
                  <p className="text-xs text-green-400 mb-1">Your OTP (demo mode)</p>
                  <p className="text-2xl font-bold text-green-500 tracking-[0.3em]">{displayOtp}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white text-center text-lg tracking-[0.3em] outline-none focus:border-red-600 transition-colors"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full rounded-lg bg-red-600 py-3 font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Login"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                className="w-full text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Change number
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="py-6 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20 text-green-500"
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Welcome Back!</h2>
                <p className="text-gray-400 text-sm">You are now logged in</p>
              </div>
              <button
                onClick={handleClose}
                className="w-full rounded-lg border border-white/20 bg-white/5 py-3 font-bold text-white transition-all hover:bg-white/10"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
