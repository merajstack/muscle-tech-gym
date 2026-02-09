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

  if (new Date(member.end_date) < new Date()) {
    return NextResponse.json({ error: "Your membership has expired. Please renew." }, { status: 403 });
  }

  return NextResponse.json({
    message: "Login successful",
    member: {
      id: member.id,
      full_name: member.full_name,
      mobile: member.mobile,
      membership_type: member.membership_type,
      end_date: member.end_date,
    },
  });
}
