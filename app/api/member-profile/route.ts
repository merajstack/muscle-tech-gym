import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const mobile = req.nextUrl.searchParams.get("mobile");

  if (!mobile) {
    return NextResponse.json({ error: "mobile is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("members")
    .select("*, branches(name)")
    .eq("mobile", mobile)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
