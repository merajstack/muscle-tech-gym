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

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const { data: member, error } = await supabase
    .from("members")
    .select("id, status, password_hash")
    .eq("mobile", mobile)
    .single();

  if (error || !member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  if (member.status !== "active") {
    return NextResponse.json({ error: "Your membership is not active" }, { status: 403 });
  }

  if (member.password_hash) {
    return NextResponse.json({ error: "Password already set. Please login with your password." }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from("members")
    .update({ password_hash: hashPassword(password) })
    .eq("id", member.id);

  if (updateError) {
    return NextResponse.json({ error: "Failed to set password" }, { status: 500 });
  }

  return NextResponse.json({ message: "Password set successfully" });
}
