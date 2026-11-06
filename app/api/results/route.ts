import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canViewResults } from "@/components/AdminGate";
import { isAdmin, resultsHidden } from "@/lib/config";
import { getLiveData } from "@/lib/live";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? null;
  if (!(await canViewResults(email))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const headers = { "Cache-Control": "no-store" };
  // ช่วงซ่อนผล: คนทั่วไปไม่ได้คะแนนเลย (กันแอบดูผ่าน API)
  if (!isAdmin(email) && resultsHidden()) {
    return NextResponse.json({ total: 0, rows: [], hidden: true }, { headers });
  }
  return NextResponse.json(await getLiveData(), { headers });
}
