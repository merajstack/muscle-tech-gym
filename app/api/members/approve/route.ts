import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { member_id, action, branch_id } = await req.json();

  if (!member_id || !action || !branch_id) {
    return NextResponse.json({ error: "member_id, action, and branch_id are required" }, { status: 400 });
  }

  if (action === "approve") {
    const { error } = await supabase
      .from("members")
      .update({ status: "active", approved_at: new Date().toISOString(), approved_by: branch_id })
      .eq("id", member_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Delete related notifications for this member
    await supabase
      .from("staff_notifications")
      .delete()
      .eq("member_id", member_id);

    return NextResponse.json({ message: "Member approved" });
  }

  if (action === "reject") {
    const { error } = await supabase
      .from("members")
      .update({ status: "rejected" })
      .eq("id", member_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Delete related notifications for this member
    await supabase
      .from("staff_notifications")
      .delete()
      .eq("member_id", member_id);

    return NextResponse.json({ message: "Member rejected" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
