"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Lock, KeyRound, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useMemberAuth } from "@/lib/auth/member-context";
import { cn } from "@/lib/utils";

interface MemberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberLoginModal({ isOpen, onClose }: MemberLoginModalProps) {
  const [step, setStep] = useState<"login" | "set-password" | "success">("login");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useMemberAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    if (!password) {
      setError("Enter your password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });
      const data = await res.json();
      if (data.needs_password) {
        setMemberName(data.member_name);
        setStep("set-password");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Login failed");
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

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/member/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to set password");
        return;
      }
      // Now login with the new password
      const loginRes = await fetch("/api/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password: newPassword }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setError(loginData.error || "Login failed after setting password");
        return;
      }
      login(loginData.member);
      setStep("success");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep("login");
    setMobile("");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowNewPassword(false);
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

          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="text-center">
                <div className="mx-auto w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mb-3">
                  <Phone className="text-red-600 h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold text-white">Member Login</h2>
                <p className="text-sm text-gray-400 mt-1">Enter your mobile number & password</p>
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

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white text-center text-lg outline-none focus:border-red-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || mobile.length < 10 || !password}
                className="w-full rounded-lg bg-red-600 py-3 font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
              </button>
            </form>
          )}

          {step === "set-password" && (
            <form onSubmit={handleSetPassword} className="space-y-5">
              <div className="text-center">
                <div className="mx-auto w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mb-3">
                  <KeyRound className="text-red-600 h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold text-white">Create Password</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Welcome, <span className="text-white font-medium">{memberName}</span>!
                  <br />Set a password for future logins.
                </p>
              </div>

              {error && (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white text-center text-lg outline-none focus:border-red-600 transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className={cn(
                    "w-full rounded-lg border bg-white/5 px-4 py-3 text-white text-center text-lg outline-none transition-colors",
                    confirmPassword && confirmPassword !== newPassword
                      ? "border-red-500"
                      : "border-white/10 focus:border-red-600"
                  )}
                />
              </div>

              <button
                type="submit"
                disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                className="w-full rounded-lg bg-red-600 py-3 font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Set Password & Login"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("login"); setError(""); setNewPassword(""); setConfirmPassword(""); }}
                className="w-full text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Back to login
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
