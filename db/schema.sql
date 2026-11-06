-- 1 คนโหวตได้หลายเกม แต่โหวตเกมเดิมได้ครั้งเดียว
-- PRIMARY KEY (voter_email, project_id) คือสิ่งที่กันโหวตซ้ำจริงๆ แม้จะกดรัวหรือยิง request พร้อมกัน
CREATE TABLE IF NOT EXISTS votes (
  voter_email TEXT NOT NULL,
  project_id  TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('student', 'staff', 'guest')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT votes_pkey PRIMARY KEY (voter_email, project_id)
);

CREATE INDEX IF NOT EXISTS votes_project_idx ON votes (project_id);

-- ตารางที่สร้างจากเวอร์ชันแรก แอปจะปรับให้อัตโนมัติตอนมีคนโหวตครั้งแรก
-- ถ้าอยากปรับเองล่วงหน้า รัน 4 บรรทัดนี้ใน Neon SQL Editor:
-- ALTER TABLE votes DROP CONSTRAINT votes_pkey;
-- ALTER TABLE votes ADD CONSTRAINT votes_pkey PRIMARY KEY (voter_email, project_id);
-- ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_role_check;
-- ALTER TABLE votes ADD CONSTRAINT votes_role_check CHECK (role IN ('student', 'staff', 'guest'));
