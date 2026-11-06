export const STUDENT_DOMAIN = "bumail.net";
export const STAFF_DOMAIN = "bu.ac.th";

export function emailDomain(email: string) {
  return email.toLowerCase().split("@").pop() ?? "";
}

/**
 * โดเมนอีเมลที่ให้โหวตได้ ตั้งใน env ALLOWED_EMAIL_DOMAINS คั่นด้วยจุลภาค
 * เช่น ALLOWED_EMAIL_DOMAINS=bumail.net,bu.ac.th
 * ถ้าไม่ตั้ง = บัญชี Google ไหนก็โหวตได้
 */
export function allowedDomains() {
  return (process.env.ALLOWED_EMAIL_DOMAINS ?? "")
    .split(",")
    .map((d) => d.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean);
}

export function isAllowedEmail(email: string) {
  if (!email.includes("@")) return false;
  const domains = allowedDomains();
  return domains.length === 0 || domains.includes(emailDomain(email));
}

/** ข้อความบอกว่าใช้บัญชีอะไรล็อกอินได้ */
export function loginHint() {
  const domains = allowedDomains();
  if (domains.length === 0) return "ใช้บัญชี Google (Gmail)";
  return `ใช้อีเมล ${domains.map((d) => "@" + d).join(" หรือ ")}`;
}

export type VoterRole = "student" | "staff" | "guest";

export function voterRole(email: string): VoterRole {
  const d = emailDomain(email);
  if (d === STAFF_DOMAIN) return "staff";
  if (d === STUDENT_DOMAIN) return "student";
  return "guest";
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
