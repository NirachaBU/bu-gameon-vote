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

/**
 * ปรับตารางเดิมให้เป็นแบบ "1 อีเมลโหวตได้หลายเกม เกมละ 1 ครั้ง" อัตโนมัติ
 * (ตารางรุ่นแรกใช้ voter_email เป็น PRIMARY KEY = โหวตได้แค่ 1 เกม)
 * รันครั้งเดียวต่อ server instance และไม่ทำอะไรถ้าตารางเป็นแบบใหม่แล้ว
 */
let _schemaReady: Promise<void> | null = null;

function ensureSchema() {
  if (!_schemaReady) {
    _schemaReady = (async () => {
      const db = sql();
      const old = (await db`
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'votes'::regclass AND conname = 'votes_pkey'
          AND array_length(conkey, 1) = 1
      `) as unknown[];
      if (old.length > 0) {
        await db`ALTER TABLE votes DROP CONSTRAINT votes_pkey`;
        await db`ALTER TABLE votes ADD CONSTRAINT votes_pkey PRIMARY KEY (voter_email, project_id)`;
      }
      await db`ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_role_check`;
      await db`ALTER TABLE votes ADD CONSTRAINT votes_role_check CHECK (role IN ('student', 'staff', 'guest'))`;
    })().catch((e) => {
      _schemaReady = null;
      throw e;
    });
  }
  return _schemaReady;
}

/** รายการเกมที่อีเมลนี้โหวตไปแล้ว (เรียงตามเวลาที่โหวต) */
export async function getMyVotes(email: string): Promise<string[]> {
  const rows = (await sql()`
    SELECT project_id FROM votes WHERE voter_email = ${email} ORDER BY created_at
  `) as { project_id: string }[];
  return rows.map((r) => r.project_id);
}

/** โหวตเกมนี้ คืน true ถ้าบันทึกใหม่, false ถ้าเคยโหวตเกมนี้แล้ว */
export async function insertVote(email: string, projectId: string, role: string) {
  await ensureSchema();
  // PRIMARY KEY (voter_email, project_id) กันโหวตเกมเดิมซ้ำ แม้กดรัวหรือยิง request พร้อมกัน
  const rows = (await sql()`
    INSERT INTO votes (voter_email, project_id, role)
    VALUES (${email}, ${projectId}, ${role})
    ON CONFLICT (voter_email, project_id) DO NOTHING
    RETURNING project_id
  `) as { project_id: string }[];
  return rows.length === 1;
}

/** reached_at = เวลาที่ได้โหวตล่าสุด = เวลาที่ถึงคะแนนปัจจุบัน ใช้ตัดสินตอนคะแนนเท่ากัน */
export type Tally = { project_id: string; total: number; reached_at: string };

export async function getTally(): Promise<Tally[]> {
  return (await sql()`
    SELECT project_id, COUNT(*)::int AS total, MAX(created_at) AS reached_at
    FROM votes
    GROUP BY project_id
  `) as Tally[];
}

/** จำนวนคนที่โหวตแล้ว (นับอีเมลไม่ซ้ำ) */
export async function getVoterCount(): Promise<number> {
  const rows = (await sql()`SELECT COUNT(DISTINCT voter_email)::int AS n FROM votes`) as { n: number }[];
  return rows[0]?.n ?? 0;
}
