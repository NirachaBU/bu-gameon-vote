/**
 * รายชื่อผลงานที่เปิดให้โหวต (สร้างจากชื่อไฟล์โปสเตอร์)
 *
 * - รูปอยู่ที่ public/works/<id>.webp
 * - id คือส่วนท้ายของลิงก์ QR (/p/<id>) ห้ามแก้หลังพิมพ์ QR หรือเปิดโหวตแล้ว
 * - แก้ชื่อทีม หรือเติม game (ชื่อเกม) ได้ตามสบาย
 */
export type Track = "industry" | "rising";

export type Project = {
  id: string;
  team: string;
  track: Track;
  partner?: string;
  game?: string;
};

export const TRACK_LABEL: Record<Track, string> = {
  industry: "Industry Projects",
  rising: "Rising Star",
};

export const projects: Project[] = [
  { id: "ind-01", team: "Devsangluy", track: "industry", partner: "B2S" },
  { id: "ind-02", team: "HIGH HZ", track: "industry", partner: "B2S" },
  { id: "ind-03", team: "Unknown Archive", track: "industry", partner: "B2S" },
  { id: "ind-04", team: "มาโหรากา", track: "industry", partner: "B2S" },
  { id: "ind-05", team: "Octoburger", track: "industry", partner: "BarkingKitten" },
  { id: "ind-06", team: "Tom Kai", track: "industry", partner: "BarkingKitten" },
  { id: "ind-07", team: "นั่งเล่นคลอง 6", track: "industry", partner: "BarkingKitten" },
  { id: "ind-08", team: "Borderline | มะละกอภาษาอังกฤษ", track: "industry", partner: "BU" },
  { id: "ind-09", team: "Burning work | Hello World", track: "industry", partner: "BU" },
  { id: "ind-10", team: "ANOVA", track: "industry", partner: "Bugblio" },
  { id: "ind-11", team: "BlackSun", track: "industry", partner: "Bugblio" },
  { id: "ind-12", team: "Need Sugar", track: "industry", partner: "Bugblio" },
  { id: "ind-13", team: "Who let him cooked", track: "industry", partner: "Bugblio" },
  { id: "ind-14", team: "ในใจไม่เคยมีผู้ใด", track: "industry", partner: "Bugblio" },
  { id: "ind-15", team: "Vous La Zone", track: "industry", partner: "CDEM" },
  { id: "ind-16", team: "Fast Night", track: "industry", partner: "CorePolygon" },
  { id: "ind-17", team: "Group14", track: "industry", partner: "CorePolygon" },
  { id: "ind-18", team: "My Little Pony", track: "industry", partner: "CorePolygon" },
  { id: "ind-19", team: "ก๊กสุดท้าย", track: "industry", partner: "CorePolygon" },
  { id: "ind-20", team: "Create Lab", track: "industry", partner: "Fairplay" },
  { id: "ind-21", team: "JUSTCHILL PRODUCTION", track: "industry", partner: "Fairplay" },
  { id: "ind-22", team: "Nok E Koy Near Me", track: "industry", partner: "Fairplay" },
  { id: "ind-23", team: "Summer is back", track: "industry", partner: "Fairplay" },
  { id: "ind-24", team: "ThaGay", track: "industry", partner: "Fairplay" },
  { id: "ind-25", team: "Varderer", track: "industry", partner: "Fairplay" },
  { id: "ind-26", team: "Arumirite", track: "industry", partner: "Vermillion Digital" },
  { id: "ind-27", team: "Monoz", track: "industry", partner: "Vermillion Digital" },
  { id: "ind-28", team: "R Wang", track: "industry", partner: "Vermillion Digital" },
  { id: "ind-29", team: "Streamer ล้านซับ", track: "industry", partner: "Vermillion Digital" },
  { id: "ind-30", team: "บ้าน บ้าน", track: "industry", partner: "Vermillion Digital" },
  { id: "ind-31", team: "หอมบลูเบอรี่", track: "industry", partner: "Vermillion Digital" },
  { id: "ind-32", team: "Bug Is Feature", track: "industry", partner: "Novartis" },
  { id: "ind-33", team: "Snowdrop", track: "industry", partner: "Novartis" },
  { id: "ind-34", team: "STRANGER", track: "industry", partner: "Novartis" },
  { id: "ind-35", team: "X-Trail", track: "industry", partner: "Novartis" },
  { id: "ind-36", team: "น้ำมะปื๊ดดดด", track: "industry", partner: "Novartis" },
  { id: "ind-37", team: "ตี๋น้อยข้างมอกรุงเทพ", track: "industry", partner: "Okday" },
  { id: "ind-38", team: "เราอยู่ในเยเกอร์", track: "industry", partner: "Okday" },
  { id: "rs-01", team: "25บาท", track: "rising" },
  { id: "rs-02", team: "99% team", track: "rising" },
  { id: "rs-03", team: "Devsangluy", track: "rising" },
  { id: "rs-04", team: "Dog Eater", track: "rising" },
  { id: "rs-05", team: "twotime", track: "rising" },
  { id: "rs-06", team: "มะยังภัณเต", track: "rising" },
];

export function getProject(id: string) {
  return projects.find((p) => p.id === id);
}

export function projectImage(p: Project) {
  return `/works/${p.id}.webp`;
}

export function projectLabel(p: Project) {
  return p.game ? `${p.game} — ${p.team}` : p.team;
}
