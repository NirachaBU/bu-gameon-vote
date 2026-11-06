import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canViewResults } from "@/components/AdminGate";
import { getLiveData } from "@/lib/live";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? null;
  if (!(await canViewResults(email))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return NextResponse.json(await getLiveData(), { headers: { "Cache-Control": "no-store" } });
}
