import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { mobile } = await req.json();

  if (!mobile) {
    return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
  }

  const { data: member, error } = await supabase
    .from("members")
    .select("*")
    .eq("mobile", mobile)
    .single();

  if (error || !member) {
    return NextResponse.json({ error: "No member found with this mobile number" }, { status: 404 });
  }

  if (member.status !== "active") {
    return NextResponse.json({ error: "Your membership is not active. Please contact staff." }, { status: 403 });
  }

  // Check if membership expired
  if (new Date(member.end_date) < new Date()) {
    return NextResponse.json({ error: "Your membership has expired. Please renew." }, { status: 403 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  await supabase
    .from("members")
    .update({ otp_code: otp, otp_expires_at: expiresAt })
    .eq("id", member.id);

  // In production, send OTP via SMS. For now, return it directly.
  return NextResponse.json({ message: "OTP sent", otp, member_name: member.full_name });
}
