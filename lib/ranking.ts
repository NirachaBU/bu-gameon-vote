import { getTally } from "@/lib/db";
import { projects, type Project } from "@/lib/projects";

export type Ranked = { p: Project; total: number; rank: number | null };

/**
 * เรียงอันดับทั้งงาน: คะแนนมากก่อน
 * คะแนนเท่ากัน → ทีมที่ถึงคะแนนนั้นก่อน (ได้โหวตสุดท้ายเร็วกว่า) อยู่อันดับดีกว่า
 * ทีมที่ยังไม่มีโหวต ไม่มีอันดับ (rank = null)
 */
export async function getRanking(): Promise<Ranked[]> {
  const tally = new Map((await getTally()).map((t) => [t.project_id, t]));
  const time = (id: string) => {
    const t = tally.get(id)?.reached_at;
    return t ? new Date(t).getTime() : Infinity;
  };
  const sorted = projects
    .map((p, i) => ({ p, i, total: tally.get(p.id)?.total ?? 0 }))
    .sort((a, b) => b.total - a.total || time(a.p.id) - time(b.p.id) || a.i - b.i);
  return sorted.map((r, i) => ({ p: r.p, total: r.total, rank: r.total > 0 ? i + 1 : null }));
}
