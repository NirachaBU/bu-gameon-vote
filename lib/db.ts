import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;

export function sql() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("ยังไม่ได้ตั้งค่า DATABASE_URL");
    _sql = neon(url);
  }
  return _sql;
}

export type VoteRow = { project_id: string; created_at: string };

export async function getMyVote(email: string): Promise<VoteRow | null> {
  const rows = (await sql()`
    SELECT project_id, created_at FROM votes WHERE voter_email = ${email}
  `) as VoteRow[];
  return rows[0] ?? null;
}

/** คืน true ถ้าโหวตสำเร็จ, false ถ้าอีเมลนี้เคยโหวตแล้ว */
export async function insertVote(email: string, projectId: string, role: string) {
  const rows = (await sql()`
    INSERT INTO votes (voter_email, project_id, role)
    VALUES (${email}, ${projectId}, ${role})
    ON CONFLICT (voter_email) DO NOTHING
    RETURNING project_id
  `) as { project_id: string }[];
  return rows.length === 1;
}

export type Tally = { project_id: string; student: number; staff: number; total: number };

export async function getTally(): Promise<Tally[]> {
  return (await sql()`
    SELECT project_id,
           COUNT(*) FILTER (WHERE role = 'student')::int AS student,
           COUNT(*) FILTER (WHERE role = 'staff')::int   AS staff,
           COUNT(*)::int AS total
    FROM votes
    GROUP BY project_id
  `) as Tally[];
}
