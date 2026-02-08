import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcryptjs from "bcryptjs";

export async function POST(req: NextRequest) {
  const { branch_id, password } = await req.json();

  if (!branch_id || !password) {
    return NextResponse.json({ error: "Branch and password are required" }, { status: 400 });
  }

  const { data: branch, error } = await supabase
    .from("branches")
    .select("*")
    .eq("id", branch_id)
    .single();

  if (error || !branch) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 });
  }

  const valid = bcryptjs.compareSync(password, branch.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  return NextResponse.json({
    branch: { id: branch.id, name: branch.name, slug: branch.slug },
    message: "Login successful",
  });
}
