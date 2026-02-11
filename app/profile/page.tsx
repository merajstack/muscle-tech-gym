"use client";

import { useEffect, useState } from "react";
import { useMemberAuth } from "@/lib/auth/member-context";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Calendar,
  CreditCard,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Calculator,
  Dumbbell,
  Activity,
  Target,
  ChevronRight,
  ArrowRight,
  Flame,
  Heart,
  Zap,
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

type Tab = "profile" | "bmi" | "exercises";

// --- Exercise Data ---
const bodyParts = [
  {
    id: "chest",
    name: "Chest",
    icon: "💪",
    color: "from-red-600/20 to-red-900/10",
    border: "border-red-600/30",
    exercises: [
      { name: "Flat Bench Press", sets: "4", reps: "8-12", level: "Beginner", tip: "Keep shoulder blades retracted and pinched together." },
      { name: "Incline Dumbbell Press", sets: "3", reps: "10-12", level: "Beginner", tip: "Set bench at 30-45 degrees for upper chest focus." },
      { name: "Cable Crossovers", sets: "3", reps: "12-15", level: "Intermediate", tip: "Squeeze at the bottom and control the negative." },
      { name: "Dumbbell Flyes", sets: "3", reps: "10-12", level: "Beginner", tip: "Keep a slight bend in elbows throughout." },
      { name: "Push-Ups (Weighted)", sets: "3", reps: "15-20", level: "Beginner", tip: "Add a plate on your back for progression." },
      { name: "Decline Bench Press", sets: "3", reps: "8-10", level: "Intermediate", tip: "Targets lower chest fibers effectively." },
    ],
  },
  {
    id: "back",
    name: "Back",
    icon: "🏋️",
    color: "from-blue-600/20 to-blue-900/10",
    border: "border-blue-600/30",
    exercises: [
      { name: "Deadlifts", sets: "4", reps: "5-8", level: "Intermediate", tip: "Maintain a neutral spine. Brace your core." },
      { name: "Barbell Rows", sets: "4", reps: "8-10", level: "Beginner", tip: "Pull to your lower chest, squeeze your lats." },
      { name: "Lat Pulldowns", sets: "3", reps: "10-12", level: "Beginner", tip: "Lean back slightly and pull to upper chest." },
      { name: "Seated Cable Rows", sets: "3", reps: "10-12", level: "Beginner", tip: "Focus on pulling elbows back, not wrists." },
      { name: "Pull-Ups", sets: "3", reps: "8-12", level: "Intermediate", tip: "Use full range of motion from dead hang." },
      { name: "T-Bar Rows", sets: "3", reps: "8-10", level: "Intermediate", tip: "Great for mid-back thickness." },
    ],
  },
  {
    id: "shoulders",
    name: "Shoulders",
    icon: "🦾",
    color: "from-purple-600/20 to-purple-900/10",
    border: "border-purple-600/30",
    exercises: [
      { name: "Overhead Press", sets: "4", reps: "8-10", level: "Beginner", tip: "Press directly overhead, lock out at top." },
      { name: "Lateral Raises", sets: "4", reps: "12-15", level: "Beginner", tip: "Lift to shoulder height, slight forward lean." },
      { name: "Face Pulls", sets: "3", reps: "15-20", level: "Beginner", tip: "Pull to face level, externally rotate hands." },
      { name: "Arnold Press", sets: "3", reps: "10-12", level: "Intermediate", tip: "Rotate palms during the press for full activation." },
      { name: "Rear Delt Flyes", sets: "3", reps: "12-15", level: "Beginner", tip: "Bend at hips, keep arms slightly bent." },
      { name: "Upright Rows", sets: "3", reps: "10-12", level: "Intermediate", tip: "Use wide grip to avoid shoulder impingement." },
    ],
  },
  {
    id: "arms",
    name: "Arms",
    icon: "💪",
    color: "from-yellow-600/20 to-yellow-900/10",
    border: "border-yellow-600/30",
    exercises: [
      { name: "Barbell Curls", sets: "3", reps: "10-12", level: "Beginner", tip: "Keep elbows pinned to sides." },
      { name: "Tricep Dips", sets: "3", reps: "10-15", level: "Beginner", tip: "Lean forward slightly to target triceps." },
      { name: "Hammer Curls", sets: "3", reps: "10-12", level: "Beginner", tip: "Targets brachialis for arm thickness." },
      { name: "Skull Crushers", sets: "3", reps: "10-12", level: "Intermediate", tip: "Lower to forehead, extend fully." },
      { name: "Cable Pushdowns", sets: "3", reps: "12-15", level: "Beginner", tip: "Keep elbows locked at your sides." },
      { name: "Concentration Curls", sets: "3", reps: "12-15", level: "Beginner", tip: "Isolate the bicep, slow negatives." },
    ],
  },
  {
    id: "legs",
    name: "Legs",
    icon: "🦵",
    color: "from-green-600/20 to-green-900/10",
    border: "border-green-600/30",
    exercises: [
      { name: "Barbell Squats", sets: "4", reps: "6-10", level: "Intermediate", tip: "Go to parallel or below. Drive through heels." },
      { name: "Romanian Deadlifts", sets: "3", reps: "8-12", level: "Intermediate", tip: "Feel the hamstring stretch, hinge at hips." },
      { name: "Leg Press", sets: "4", reps: "10-12", level: "Beginner", tip: "Don't lock knees at the top." },
      { name: "Walking Lunges", sets: "3", reps: "12 each", level: "Beginner", tip: "Keep torso upright, step far enough." },
      { name: "Leg Curls", sets: "3", reps: "12-15", level: "Beginner", tip: "Squeeze at the top of contraction." },
      { name: "Calf Raises", sets: "4", reps: "15-20", level: "Beginner", tip: "Full range of motion, pause at top." },
    ],
  },
  {
    id: "core",
    name: "Core & Abs",
    icon: "🎯",
    color: "from-orange-600/20 to-orange-900/10",
    border: "border-orange-600/30",
    exercises: [
      { name: "Hanging Leg Raises", sets: "3", reps: "12-15", level: "Intermediate", tip: "Control the movement, avoid swinging." },
      { name: "Cable Crunches", sets: "3", reps: "15-20", level: "Beginner", tip: "Crunch down bringing elbows to knees." },
      { name: "Plank Hold", sets: "3", reps: "45-60s", level: "Beginner", tip: "Keep hips level with shoulders." },
      { name: "Russian Twists", sets: "3", reps: "20 total", level: "Beginner", tip: "Rotate from the torso, not just arms." },
      { name: "Ab Wheel Rollouts", sets: "3", reps: "10-12", level: "Intermediate", tip: "Extend as far as you can control." },
      { name: "Dead Bugs", sets: "3", reps: "12 each", level: "Beginner", tip: "Keep lower back pressed to the floor." },
    ],
  },
];

// --- BMI Categories ---
function getBMICategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/30", advice: "Focus on caloric surplus with strength training. Aim for 300-500 calories above maintenance daily.", barColor: "bg-blue-500" };
  if (bmi < 25) return { label: "Normal", color: "text-green-400", bg: "bg-green-500/20 border-green-500/30", advice: "Great shape! Maintain with balanced nutrition and consistent training. Focus on progressive overload.", barColor: "bg-green-500" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-400", bg: "bg-yellow-500/20 border-yellow-500/30", advice: "Combine strength training with cardio. Aim for a 300-500 calorie deficit daily. Prioritize protein intake.", barColor: "bg-yellow-500" };
  return { label: "Obese", color: "text-red-400", bg: "bg-red-500/20 border-red-500/30", advice: "Start with low-impact cardio and bodyweight exercises. Consult a trainer for a personalized plan. Focus on sustainable habits.", barColor: "bg-red-500" };
}

export default function ProfilePage() {
  const { member, isAuthenticated } = useMemberAuth();
  const router = useRouter();
  const [details, setDetails] = useState<MemberDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // BMI State
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  // Exercise State
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

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

  // BMI Calculation
  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      setBmiResult(parseFloat((w / (h * h)).toFixed(1)));
    }
  };

  // BMR & TDEE
  const bmr = bmiResult && age
    ? gender === "male"
      ? 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age) + 5
      : 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age) - 161
    : null;

  const bmiCategory = bmiResult ? getBMICategory(bmiResult) : null;
  const selectedBodyPart = bodyParts.find((p) => p.id === selectedPart);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "bmi", label: "BMI Calculator", icon: <Calculator className="h-4 w-4" /> },
    { id: "exercises", label: "Exercises", icon: <Dumbbell className="h-4 w-4" /> },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-1 bg-zinc-900/80 border border-zinc-800 rounded-xl p-1.5 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap flex-1 justify-center",
                  activeTab === tab.id
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ===== PROFILE TAB ===== */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
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

                    {/* Quick Links to other tabs */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <button
                        onClick={() => setActiveTab("bmi")}
                        className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-red-600/50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                            <Calculator className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-white">BMI Calculator</p>
                            <p className="text-xs text-zinc-500">Check your body mass index</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-red-500 transition-colors" />
                      </button>
                      <button
                        onClick={() => setActiveTab("exercises")}
                        className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-red-600/50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                            <Dumbbell className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-white">Exercise Guide</p>
                            <p className="text-xs text-zinc-500">Workouts for every body part</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-red-500 transition-colors" />
                      </button>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}

            {/* ===== BMI CALCULATOR TAB ===== */}
            {activeTab === "bmi" && (
              <motion.div
                key="bmi"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* BMI Input Card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                      <Calculator className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">BMI Calculator</h2>
                      <p className="text-xs text-zinc-500">Calculate your Body Mass Index and daily calorie needs</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 uppercase tracking-wider">Height (cm)</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="170"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 uppercase tracking-wider">Weight (kg)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="70"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 uppercase tracking-wider">Age</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="25"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 uppercase tracking-wider">Gender</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setGender("male")}
                          className={cn(
                            "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
                            gender === "male"
                              ? "bg-red-600 text-white"
                              : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
                          )}
                        >
                          Male
                        </button>
                        <button
                          onClick={() => setGender("female")}
                          className={cn(
                            "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
                            gender === "female"
                              ? "bg-red-600 text-white"
                              : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
                          )}
                        >
                          Female
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={calculateBMI}
                    disabled={!height || !weight}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    Calculate BMI
                  </button>
                </div>

                {/* BMI Result */}
                {bmiResult && bmiCategory && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    {/* BMI Score Card */}
                    <div className={cn("border rounded-2xl p-6 text-center space-y-4", bmiCategory.bg)}>
                      <p className="text-sm text-zinc-400 uppercase tracking-wider">Your BMI</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-6xl font-black text-white">{bmiResult}</span>
                        <span className={cn("text-lg font-bold", bmiCategory.color)}>{bmiCategory.label}</span>
                      </div>

                      {/* BMI Scale Bar */}
                      <div className="space-y-2">
                        <div className="h-3 rounded-full bg-zinc-800 overflow-hidden relative">
                          <div className="absolute inset-0 flex">
                            <div className="h-full bg-blue-500/50 flex-1" />
                            <div className="h-full bg-green-500/50 flex-1" />
                            <div className="h-full bg-yellow-500/50 flex-1" />
                            <div className="h-full bg-red-500/50 flex-1" />
                          </div>
                          <div
                            className={cn("absolute top-0 h-full w-1.5 rounded-full", bmiCategory.barColor)}
                            style={{
                              left: `${Math.min(95, Math.max(2, ((bmiResult - 14) / (40 - 14)) * 100))}%`,
                              boxShadow: "0 0 8px currentColor",
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-zinc-500">
                          <span>Underweight</span>
                          <span>Normal</span>
                          <span>Overweight</span>
                          <span>Obese</span>
                        </div>
                      </div>

                      <p className="text-sm text-zinc-300 leading-relaxed">{bmiCategory.advice}</p>
                    </div>

                    {/* Calorie & Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center space-y-1">
                        <Flame className="h-5 w-5 text-orange-500 mx-auto" />
                        <p className="text-xs text-zinc-500">BMR (Base Calories)</p>
                        <p className="text-xl font-bold text-white">{bmr ? Math.round(bmr) : "—"}</p>
                        <p className="text-[10px] text-zinc-600">kcal / day</p>
                      </div>
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center space-y-1">
                        <Zap className="h-5 w-5 text-yellow-500 mx-auto" />
                        <p className="text-xs text-zinc-500">Moderate Activity</p>
                        <p className="text-xl font-bold text-white">{bmr ? Math.round(bmr * 1.55) : "—"}</p>
                        <p className="text-[10px] text-zinc-600">kcal / day</p>
                      </div>
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center space-y-1">
                        <Heart className="h-5 w-5 text-red-500 mx-auto" />
                        <p className="text-xs text-zinc-500">Ideal Weight Range</p>
                        <p className="text-xl font-bold text-white">
                          {height
                            ? `${(18.5 * (parseFloat(height) / 100) ** 2).toFixed(0)}-${(24.9 * (parseFloat(height) / 100) ** 2).toFixed(0)}`
                            : "—"}
                        </p>
                        <p className="text-[10px] text-zinc-600">kg</p>
                      </div>
                    </div>

                    {/* Recommended Macros */}
                    {bmr && (
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Target className="h-4 w-4 text-red-500" />
                          Recommended Daily Macros (Moderate Activity)
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                          <MacroCard label="Protein" value={`${Math.round(parseFloat(weight) * 1.8)}g`} pct="30%" color="bg-red-500" />
                          <MacroCard label="Carbs" value={`${Math.round((bmr * 1.55 * 0.45) / 4)}g`} pct="45%" color="bg-yellow-500" />
                          <MacroCard label="Fats" value={`${Math.round((bmr * 1.55 * 0.25) / 9)}g`} pct="25%" color="bg-blue-500" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ===== EXERCISES TAB ===== */}
            {activeTab === "exercises" && (
              <motion.div
                key="exercises"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Exercise Recommendations</h2>
                    <p className="text-xs text-zinc-500">Select a body part to see recommended exercises</p>
                  </div>
                </div>

                {/* Body Part Grid */}
                {!selectedPart ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {bodyParts.map((part) => (
                      <motion.button
                        key={part.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedPart(part.id)}
                        className={cn(
                          "bg-gradient-to-br border rounded-2xl p-5 text-center space-y-2 transition-all hover:shadow-lg",
                          part.color,
                          part.border
                        )}
                      >
                        <span className="text-3xl block">{part.icon}</span>
                        <p className="text-sm font-bold text-white">{part.name}</p>
                        <p className="text-xs text-zinc-400">{part.exercises.length} exercises</p>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Back Button */}
                    <button
                      onClick={() => setSelectedPart(null)}
                      className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-2"
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" />
                      Back to all body parts
                    </button>

                    {/* Selected Body Part Header */}
                    {selectedBodyPart && (
                      <div className={cn("bg-gradient-to-br border rounded-2xl p-5 flex items-center gap-4", selectedBodyPart.color, selectedBodyPart.border)}>
                        <span className="text-4xl">{selectedBodyPart.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold text-white">{selectedBodyPart.name} Exercises</h3>
                          <p className="text-xs text-zinc-400">{selectedBodyPart.exercises.length} recommended exercises</p>
                        </div>
                      </div>
                    )}

                    {/* Exercise List */}
                    <div className="space-y-3">
                      {selectedBodyPart?.exercises.map((ex, i) => (
                        <motion.div
                          key={ex.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3 hover:border-zinc-700 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                              <span
                                className={cn(
                                  "inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider",
                                  ex.level === "Beginner"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                )}
                              >
                                {ex.level}
                              </span>
                            </div>
                            <div className="flex gap-3 text-right">
                              <div>
                                <p className="text-xs text-zinc-500">Sets</p>
                                <p className="text-sm font-bold text-white">{ex.sets}</p>
                              </div>
                              <div>
                                <p className="text-xs text-zinc-500">Reps</p>
                                <p className="text-sm font-bold text-white">{ex.reps}</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-zinc-800/50 rounded-lg px-3 py-2">
                            <p className="text-xs text-zinc-400">
                              <span className="text-red-500 font-medium">Tip:</span> {ex.tip}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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

function MacroCard({ label, value, pct, color }: { label: string; value: string; pct: string; color: string }) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3 text-center space-y-2">
      <div className={cn("mx-auto w-2 h-2 rounded-full", color)} />
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] text-zinc-600">{pct} of calories</p>
    </div>
  );
}
