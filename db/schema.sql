-- 1 อีเมล = 1 แถว = โหวตได้ 1 ผลงานเท่านั้น
-- PRIMARY KEY บน voter_email คือสิ่งที่กันโหวตซ้ำจริงๆ แม้จะกดรัวหรือยิง request พร้อมกัน
CREATE TABLE IF NOT EXISTS votes (
  voter_email TEXT PRIMARY KEY,
  project_id  TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('student', 'staff')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS votes_project_idx ON votes (project_id);
