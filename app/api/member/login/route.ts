import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
  const { mobile, password } = await req.json();

  if (!mobile || !password) {
    return NextResponse.json({ error: "Mobile and password are required" }, { status: 400 });
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

  // First login: no password set yet
  if (!member.password_hash) {
    return NextResponse.json({
      needs_password: true,
      member_name: member.full_name,
    });
  }

  // Verify password
  if (member.password_hash !== hashPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
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
