import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const branchId = req.nextUrl.searchParams.get("branch_id");
  const status = req.nextUrl.searchParams.get("status");

  if (!branchId) {
    return NextResponse.json({ error: "branch_id is required" }, { status: 400 });
  }

  let query = supabase
    .from("members")
    .select("*, branches(name)")
    .eq("branch_id", branchId)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const memberId = req.nextUrl.searchParams.get("id");

  if (!memberId) {
    return NextResponse.json({ error: "Member id is required" }, { status: 400 });
  }

  // Delete any related notifications first
  await supabase
    .from("staff_notifications")
    .delete()
    .eq("member_id", memberId);

  // Delete the member
  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", memberId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Member removed" });
}
