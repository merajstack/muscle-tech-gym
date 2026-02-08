import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { mobile, otp } = await req.json();

  if (!mobile || !otp) {
    return NextResponse.json({ error: "Mobile and OTP are required" }, { status: 400 });
  }

  const { data: member, error } = await supabase
    .from("members")
    .select("*")
    .eq("mobile", mobile)
    .single();

  if (error || !member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  if (member.otp_code !== otp) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
  }

  if (new Date(member.otp_expires_at) < new Date()) {
    return NextResponse.json({ error: "OTP has expired" }, { status: 401 });
  }

  await supabase
    .from("members")
    .update({ is_authenticated: true, otp_code: null, otp_expires_at: null })
    .eq("id", member.id);

  return NextResponse.json({
    message: "Verified",
    member: {
      id: member.id,
      full_name: member.full_name,
      mobile: member.mobile,
      membership_type: member.membership_type,
      end_date: member.end_date,
    },
  });
}
