export const STUDENT_DOMAIN = "bumail.net";
export const STAFF_DOMAIN = "bu.ac.th";

export function emailDomain(email: string) {
  return email.toLowerCase().split("@").pop() ?? "";
}

export function isAllowedEmail(email: string) {
  const d = emailDomain(email);
  return d === STUDENT_DOMAIN || d === STAFF_DOMAIN;
}

export function voterRole(email: string): "student" | "staff" {
  return emailDomain(email) === STAFF_DOMAIN ? "staff" : "student";
}

/** อีเมลที่ดูหน้าผลโหวตได้ ตั้งใน env ADMIN_EMAILS คั่นด้วยจุลภาค */
export function isAdmin(email?: string | null) {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

/**
 * ช่วงเวลาเปิดโหวต ตั้งใน env เป็นเวลา ISO เช่น
 * VOTE_OPENS_AT=2026-11-20T09:00:00+07:00
 * VOTE_CLOSES_AT=2026-11-20T17:00:00+07:00
 * ถ้าไม่ตั้ง ถือว่าเปิดตลอด
 */
export function votingStatus(now = new Date()): "before" | "open" | "closed" {
  const opens = process.env.VOTE_OPENS_AT ? new Date(process.env.VOTE_OPENS_AT) : null;
  const closes = process.env.VOTE_CLOSES_AT ? new Date(process.env.VOTE_CLOSES_AT) : null;
  if (opens && now < opens) return "before";
  if (closes && now >= closes) return "closed";
  return "open";
}

export function formatThaiTime(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
