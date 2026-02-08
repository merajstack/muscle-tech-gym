"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Banknote, CheckCircle2, CreditCard, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Branch {
  id: string;
  name: string;
  slug: string;
}

interface JoinNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MEMBERSHIP_PLANS: Record<string, { label: string; months: number; price: number }> = {
  "1month": { label: "1 Month", months: 1, price: 1500 },
  "3months": { label: "3 Months", months: 3, price: 4000 },
  "6months": { label: "6 Months", months: 6, price: 7000 },
  "12months": { label: "12 Months", months: 12, price: 12000 },
};

export default function JoinNowModal({ isOpen, onClose }: JoinNowModalProps) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash" | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    branch_id: "",
    membership_type: "1month",
    startDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (isOpen) {
      fetch("/api/branches")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setBranches(data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const selectedPlan = MEMBERSHIP_PLANS[formData.membership_type];

  const getEndDate = () => {
    const start = new Date(formData.startDate);
    start.setMonth(start.getMonth() + selectedPlan.months);
    return start.toISOString().split("T")[0];
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.name,
          mobile: formData.phone,
          branch_id: formData.branch_id,
          membership_type: selectedPlan.label,
          start_date: formData.startDate,
          end_date: getEndDate(),
          payment_amount: selectedPlan.price,
          payment_mode: paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      setStep(3);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUPIPayment = () => {
    const upiId = "muscle_tech@upi";
    const upiLink = `upi://pay?pa=${upiId}&pn=MuscleTech%20Gym&am=${selectedPlan.price}&tn=Gym%20Membership&cu=INR`;
    window.open(upiLink, "_blank");
    setHasPaid(true);
  };

  const resetModal = () => {
    setStep(1);
    setPaymentMethod(null);
    setHasPaid(false);
    setError("");
    setFormData({
      name: "",
      phone: "",
      branch_id: "",
      membership_type: "1month",
      startDate: new Date().toISOString().split("T")[0],
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { onClose(); resetModal(); }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
        >
          <button
            onClick={() => { onClose(); resetModal(); }}
            className="absolute right-4 top-4 text-white/70 hover:text-white z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Join the Elite</h2>
                <p className="text-sm text-gray-400">Fill in your details to get started</p>
              </div>

              {error && (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-red-600 transition-colors"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-red-600 transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Branch</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {branches.map((branch) => (
                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, branch_id: branch.id })}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border p-3 text-sm transition-all text-left",
                          formData.branch_id === branch.id
                            ? "border-red-600 bg-red-600/20 text-white"
                            : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                        )}
                      >
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{branch.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Membership Plan</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {Object.entries(MEMBERSHIP_PLANS).map(([key, plan]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({ ...formData, membership_type: key })}
                        className={cn(
                          "rounded-lg border p-3 text-left transition-all",
                          formData.membership_type === key
                            ? "border-red-600 bg-red-600/20"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        )}
                      >
                        <div className="text-sm font-medium text-white">{plan.label}</div>
                        <div className="text-xs text-gray-400">₹{plan.price.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-red-600 transition-colors"
                  />
                </div>
              </div>

              <button
                disabled={!formData.name || !formData.phone || !formData.branch_id}
                onClick={() => { setError(""); setStep(2); }}
                className="w-full rounded-lg bg-red-600 py-3 font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Choose Payment Method
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={() => setStep(1)}
                  className="mb-2 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  &larr; Back to details
                </button>
                <h2 className="text-2xl font-bold text-white">Payment Method</h2>
                <p className="text-sm text-gray-400">
                  Pay ₹{selectedPlan.price.toLocaleString()} for {selectedPlan.label}
                </p>
              </div>

              {error && (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setPaymentMethod("upi"); setHasPaid(false); }}
                  className={cn(
                    "flex flex-col items-center justify-center space-y-2 rounded-xl border p-4 transition-all",
                    paymentMethod === "upi"
                      ? "border-red-600 bg-red-600/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  )}
                >
                  <Smartphone className="h-8 w-8 text-white" />
                  <span className="text-sm font-semibold text-white">UPI App</span>
                </button>

                <button
                  onClick={() => { setPaymentMethod("cash"); setHasPaid(false); }}
                  className={cn(
                    "flex flex-col items-center justify-center space-y-2 rounded-xl border p-4 transition-all",
                    paymentMethod === "cash"
                      ? "border-red-600 bg-red-600/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  )}
                >
                  <Banknote className="h-8 w-8 text-white" />
                  <span className="text-sm font-semibold text-white">Cash</span>
                </button>
              </div>

              {paymentMethod === "upi" && (
                <div className="space-y-4">
                  {!hasPaid ? (
                    <button
                      onClick={handleUPIPayment}
                      className="flex w-full items-center justify-center space-x-2 rounded-lg bg-red-600 py-4 font-bold text-white transition-all hover:bg-red-700"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Pay Now via UPI</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={loading}
                      className="w-full rounded-lg bg-green-600 py-4 font-bold text-white transition-all hover:bg-green-700 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                      Register Now
                    </button>
                  )}
                </div>
              )}

              {paymentMethod === "cash" && (
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full rounded-lg bg-red-600 py-4 font-bold text-white transition-all hover:bg-red-700 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  Register
                </button>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="py-10 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600/20 text-green-500"
              >
                <CheckCircle2 className="h-12 w-12" />
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Registration Submitted!</h2>
                <p className="text-gray-400">
                  Your registration is pending staff approval. You&apos;ll be notified once approved.
                </p>
              </div>
              <button
                onClick={() => { onClose(); resetModal(); }}
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
