"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Clock,
  IndianRupee,
  MessageCircle,
  LogOut,
  Lock,
  ArrowRight,
  CheckCircle,
  XCircle,
  Bell,
  Loader2,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Branch {
  id: string;
  name: string;
  slug: string;
}

interface Member {
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
  approved_at: string | null;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  members: { full_name: string; mobile: string } | null;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetch("/api/branches")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBranches(data);
      })
      .catch(() => {});
  }, []);

  const fetchMembers = useCallback(async (branchId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/members?branch_id=${branchId}`);
      const data = await res.json();
      if (Array.isArray(data)) setMembers(data);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async (branchId: string) => {
    try {
      const res = await fetch(`/api/notifications?branch_id=${branchId}`);
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch {}
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      fetchMembers(selectedBranch.id);
      fetchNotifications(selectedBranch.id);
    }
  }, [selectedBranch, fetchMembers, fetchNotifications]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch) {
      setError("Please select a branch");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch_id: selectedBranch.id, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      setIsAuthenticated(true);
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (memberId: string, action: "approve" | "reject") => {
    if (!selectedBranch) return;
    setActionLoading(memberId);
    try {
      const res = await fetch("/api/members/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId, action, branch_id: selectedBranch.id }),
      });
      if (res.ok) {
        fetchMembers(selectedBranch.id);
        fetchNotifications(selectedBranch.id);
      }
    } catch {} finally {
      setActionLoading(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedBranch) return;
    setActionLoading(memberId);
    try {
      const res = await fetch(`/api/members?id=${memberId}`, { method: "DELETE" });
      if (res.ok) {
        fetchMembers(selectedBranch.id);
        fetchNotifications(selectedBranch.id);
      }
    } catch {} finally {
      setActionLoading(null);
    }
  };

  const handleRemind = (member: Member) => {
    const message = encodeURIComponent(
      `Dear ${member.full_name}, your membership at Muscle Tech Premium Gym has expired. Please renew to continue your fitness journey!`
    );
    window.open(`https://wa.me/91${member.mobile}?text=${message}`, "_blank");
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mobile.includes(searchTerm);
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "expired") return matchesSearch && isExpired(m.end_date) && m.status === "active";
    return matchesSearch && m.status === statusFilter;
  });

  const activeCount = members.filter((m) => m.status === "active" && !isExpired(m.end_date)).length;
  const pendingCount = members.filter((m) => m.status === "pending").length;
  const expiredCount = members.filter((m) => m.status === "active" && isExpired(m.end_date)).length;
  const totalRevenue = members
    .filter((m) => m.status === "active")
    .reduce((sum, m) => sum + Number(m.payment_amount), 0);
  const unreadNotifs = notifications.filter((n) => !n.is_read).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl"
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-red-600 h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Staff Login</h1>
            <p className="text-zinc-400 mt-2">Select branch and enter password</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">Branch</label>
              <div className="grid grid-cols-2 gap-2">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => setSelectedBranch(branch)}
                    className={cn(
                      "rounded-lg border p-3 text-sm transition-all text-left",
                      selectedBranch?.id === branch.id
                        ? "border-red-600 bg-red-600/20 text-white"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900"
                    )}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter staff password"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading || !selectedBranch}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pt-24 md:pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {selectedBranch?.name} <span className="text-red-600">Dashboard</span>
            </h1>
            <p className="text-zinc-400">Manage members and registrations</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <Bell className="h-6 w-6" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
                setSelectedBranch(null);
                setMembers([]);
              }}
              className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Notifications Panel */}
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3"
          >
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-zinc-500 text-sm">No notifications</p>
            ) : (
              notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "p-3 rounded-lg text-sm",
                    notif.is_read ? "bg-zinc-950/50 text-zinc-500" : "bg-red-600/10 border border-red-600/20 text-zinc-300"
                  )}
                >
                  <p>{notif.message}</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-green-600/10 rounded-lg">
                <Users className="text-green-500 h-5 w-5" />
              </div>
              <div>
                <p className="text-zinc-400 text-xs">Active</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-yellow-600/10 rounded-lg">
                <Clock className="text-yellow-500 h-5 w-5" />
              </div>
              <div>
                <p className="text-zinc-400 text-xs">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-red-600/10 rounded-lg">
                <XCircle className="text-red-500 h-5 w-5" />
              </div>
              <div>
                <p className="text-zinc-400 text-xs">Expired</p>
                <p className="text-2xl font-bold">{expiredCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-green-600/10 rounded-lg">
                <IndianRupee className="text-green-500 h-5 w-5" />
              </div>
              <div>
                <p className="text-zinc-400 text-xs">Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-zinc-950/50 border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Member</th>
                  <th className="px-5 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Plan</th>
                  <th className="px-5 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Period</th>
                  <th className="px-5 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Payment</th>
                  <th className="px-5 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const expired = member.status === "active" && isExpired(member.end_date);
                    const statusColor =
                      member.status === "pending"
                        ? "text-yellow-500"
                        : member.status === "rejected"
                        ? "text-red-500"
                        : expired
                        ? "text-orange-500"
                        : "text-green-500";
                    const statusLabel =
                      member.status === "pending"
                        ? "Pending"
                        : member.status === "rejected"
                        ? "Rejected"
                        : expired
                        ? "Expired"
                        : "Active";
                    const dotColor =
                      member.status === "pending"
                        ? "bg-yellow-500"
                        : member.status === "rejected"
                        ? "bg-red-500"
                        : expired
                        ? "bg-orange-500"
                        : "bg-green-500";

                    return (
                      <tr key={member.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className={cn("w-2 h-2 rounded-full", dotColor)} />
                            <span className={cn("text-xs font-medium uppercase", statusColor)}>
                              {statusLabel}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{member.full_name}</div>
                          <div className="text-xs text-zinc-500">{member.mobile}</div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-zinc-300">
                          {member.membership_type}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="text-sm text-zinc-300">
                            {new Date(member.start_date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-zinc-500">
                            to {new Date(member.end_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-white">
                          ₹{Number(member.payment_amount).toLocaleString()}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 capitalize">
                            {member.payment_mode}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {member.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(member.id, "approve")}
                                  disabled={actionLoading === member.id}
                                  className="flex items-center gap-1 text-green-500 hover:text-green-400 text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                  {actionLoading === member.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleApprove(member.id, "reject")}
                                  disabled={actionLoading === member.id}
                                  className="flex items-center gap-1 text-red-500 hover:text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}
                            {member.status === "rejected" && (
                                <button
                                  onClick={() => handleRemoveMember(member.id)}
                                  disabled={actionLoading === member.id}
                                  className="flex items-center gap-1 text-red-500 hover:text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                  {actionLoading === member.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                  <span>Remove</span>
                                </button>
                              )}
                              {expired && (
                              <button
                                onClick={() => handleRemind(member)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-500 font-medium transition-colors"
                              >
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-sm">Remind</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
