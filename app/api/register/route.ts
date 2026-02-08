import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { full_name, mobile, branch_id, membership_type, start_date, end_date, payment_amount, payment_mode } = body;

  if (!full_name || !mobile || !branch_id || !membership_type || !start_date || !end_date || !payment_amount || !payment_mode) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const { data: member, error } = await supabase
    .from("members")
    .insert({
      full_name,
      mobile,
      branch_id,
      membership_type,
      start_date,
      end_date,
      payment_amount: parseFloat(payment_amount),
      payment_mode,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "A member with this mobile number already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create staff notification
  await supabase.from("staff_notifications").insert({
    branch_id,
    member_id: member.id,
    type: "new_registration",
    message: `New registration: ${full_name} (${mobile}) - ${membership_type} plan`,
  });

  return NextResponse.json({ member, message: "Registration submitted. Awaiting staff approval." });
}
