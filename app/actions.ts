"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "@/auth";
import { isAllowedEmail, voterRole, votingStatus } from "@/lib/config";
import { getMyVote, insertVote } from "@/lib/db";
import { getProject } from "@/lib/projects";

export type VoteState = { error?: string } | null;

export async function castVote(projectId: string, _prev: VoteState): Promise<VoteState> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();

  // ตรวจซ้ำฝั่ง server ทุกครั้ง ไม่เชื่อหน้าเว็บ
  if (!email || !isAllowedEmail(email)) {
    return { error: "กรุณาเข้าสู่ระบบด้วยอีเมล @bumail.net หรือ @bu.ac.th" };
  }
  if (!getProject(projectId)) return { error: "ไม่พบผลงานนี้" };

  const status = votingStatus();
  if (status === "before") return { error: "ยังไม่เปิดโหวต" };
  if (status === "closed") return { error: "ปิดโหวตแล้ว" };

  try {
    const ok = await insertVote(email, projectId, voterRole(email));
    if (!ok) {
      const mine = await getMyVote(email);
      revalidatePath(`/p/${projectId}`);
      if (mine?.project_id === projectId) return null;
      return { error: "บัญชีนี้โหวตไปแล้ว (โหวตได้คนละ 1 ผลงาน)" };
    }
  } catch (e) {
    console.error("vote failed", e);
    return { error: "ระบบขัดข้อง ลองกดใหม่อีกครั้ง" };
  }

  revalidatePath(`/p/${projectId}`);
  revalidatePath("/");
  return null;
}

export async function login(redirectTo: string) {
  await signIn("google", { redirectTo: redirectTo.startsWith("/") ? redirectTo : "/" });
}

export async function logout(redirectTo: string) {
  await signOut({ redirectTo: redirectTo.startsWith("/") ? redirectTo : "/" });
}
