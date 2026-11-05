// สร้างตาราง votes: DATABASE_URL=... node scripts/setup-db.mjs
// (หรือ npm run db:setup ถ้ามีไฟล์ .env.local)
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("ต้องตั้ง DATABASE_URL ก่อน");
  process.exit(1);
}
const sql = neon(url);
const statements = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8")
  .split(";")
  .map((s) => s.replace(/--.*$/gm, "").trim())
  .filter(Boolean);
for (const s of statements) await sql.query(s);
console.log("สร้างตาราง votes เรียบร้อย");
