"use client";

import { useEffect, useState } from "react";
import { useMemberAuth } from "@/lib/auth/member-context";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  CreditCard,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberDetails {
  id: string;
  full_name: string;
  mobile: string;
  branch_id: string;
  membership_type: string;
  start_date: string;
  end_date: string;
  payment_amount: number;
  payment_mode: string;
  status: string;
  created_at: string;
  branches?: { name: string } | null;
}

export default function ProfilePage() {
  const { member, isAuthenticated } = useMemberAuth();
  const router = useRouter();
  const [details, setDetails] = useState<MemberDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/member-profile?mobile=${member?.mobile}`);
        const data = await res.json();
        if (res.ok) setDetails(data);
      } catch {} finally {
        setLoading(false);
      }
    };

    if (member?.mobile) fetchDetails();
  }, [isAuthenticated, member, router]);

  if (!isAuthenticated) return null;

  const isExpired = details ? new Date(details.end_date) < new Date() : false;
  const daysLeft = details
    ? Math.max(0, Math.ceil((new Date(details.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const statusColor = !details
    ? "text-zinc-500"
    : details.status === "pending"
    ? "text-yellow-500"
    : details.status === "rejected"
    ? "text-red-500"
    : isExpired
    ? "text-orange-500"
    : "text-green-500";

  const statusLabel = !details
    ? "Loading"
    : details.status === "pending"
    ? "Pending Approval"
    : details.status === "rejected"
    ? "Rejected"
    : isExpired
    ? "Expired"
    : "Active";

  const StatusIcon = !details
    ? Loader2
    : details.status === "pending"
    ? Clock
    : details.status === "rejected"
    ? AlertTriangle
    : isExpired
    ? AlertTriangle
    : CheckCircle;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
          ) : !details ? (
            <div className="text-center py-32 text-zinc-500">
              <p>Could not load profile details.</p>
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center"
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-red-600 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">
                    {details.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white">{details.full_name}</h1>
                <p className="text-zinc-500 text-sm mt-1">{details.mobile}</p>
                <div className={cn("flex items-center justify-center gap-2 mt-3", statusColor)}>
                  <StatusIcon className="h-4 w-4" />
                  <span className="text-sm font-semibold uppercase">{statusLabel}</span>
                </div>
              </motion.div>

              {/* Membership Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-red-600/20 via-zinc-900/50 to-zinc-900/50 border border-red-600/30 rounded-2xl p-6 space-y-4"
              >
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Membership Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem icon={<CreditCard className="h-4 w-4 text-red-500" />} label="Plan" value={details.membership_type} />
                  <InfoItem icon={<CreditCard className="h-4 w-4 text-red-500" />} label="Amount Paid" value={`₹${Number(details.payment_amount).toLocaleString()}`} />
                  <InfoItem
                    icon={<Calendar className="h-4 w-4 text-red-500" />}
                    label="Start Date"
                    value={new Date(details.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  />
                  <InfoItem
                    icon={<Calendar className="h-4 w-4 text-red-500" />}
                    label="End Date"
                    value={new Date(details.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  />
                </div>
                {details.status === "active" && !isExpired && (
                  <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3 text-center">
                    <p className="text-green-500 text-sm font-medium">{daysLeft} days remaining</p>
                  </div>
                )}
                {isExpired && details.status === "active" && (
                  <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-3 text-center">
                    <p className="text-orange-500 text-sm font-medium">Your membership has expired. Please visit the gym to renew.</p>
                  </div>
                )}
                {details.status === "pending" && (
                  <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-3 text-center">
                    <p className="text-yellow-500 text-sm font-medium">Your registration is pending staff approval.</p>
                  </div>
                )}
              </motion.div>

              {/* Account Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-3"
              >
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-red-600" />
                  Account Info
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-sm text-zinc-500">Branch</span>
                    <span className="text-sm text-white font-medium">{details.branches?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-sm text-zinc-500">Payment Mode</span>
                    <span className="text-sm text-white font-medium capitalize">{details.payment_mode}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-zinc-500">Member Since</span>
                    <span className="text-sm text-white font-medium">
                      {new Date(details.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}
