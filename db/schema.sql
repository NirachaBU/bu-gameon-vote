-- 1 อีเมล = 1 แถว = โหวตได้ 1 ผลงานเท่านั้น
-- PRIMARY KEY บน voter_email คือสิ่งที่กันโหวตซ้ำจริงๆ แม้จะกดรัวหรือยิง request พร้อมกัน
CREATE TABLE IF NOT EXISTS votes (
  voter_email TEXT PRIMARY KEY,
  project_id  TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('student', 'staff', 'guest')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS votes_project_idx ON votes (project_id);

-- อัปเดตตารางเดิม (ที่สร้างก่อนเปิดให้ Gmail ทั่วไปโหวต) ให้รับ role 'guest'
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_role_check;
ALTER TABLE votes ADD CONSTRAINT votes_role_check CHECK (role IN ('student', 'staff', 'guest'));
