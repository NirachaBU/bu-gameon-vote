import { getRanking } from "@/lib/ranking";

export type LiveRow = { id: string; total: number };
export type LiveData = { total: number; rows: LiveRow[] };

/** ข้อมูลผลโหวตสำหรับหน้า /results (เรียงอันดับแล้ว) */
export async function getLiveData(): Promise<LiveData> {
  const ranked = await getRanking();
  return {
    total: ranked.reduce((s, r) => s + r.total, 0),
    rows: ranked.map((r) => ({ id: r.p.id, total: r.total })),
  };
}
