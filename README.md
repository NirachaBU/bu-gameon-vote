# BU Game On Expo 2026 · ระบบโหวตผลงาน

สแกน QR ที่บูธ → ล็อกอิน Gmail มหาวิทยาลัย → โหวต
**1 อีเมลโหวตได้ 1 ผลงานเท่านั้น** (เฉพาะ @bumail.net และ @bu.ac.th)

| หน้า | ใช้ทำอะไร |
|---|---|
| `/p/ind-01` … `/p/rs-06` | หน้าโหวตของแต่ละผลงาน (ลิงก์ใน QR) |
| `/` | หน้าแรก บอกวิธีโหวต / ผลงานที่เราโหวตไป |
| `/results` | ผลโหวตแยก Industry / Rising Star (เฉพาะแอดมิน) |
| `/qr` | QR ทุกผลงาน กดพิมพ์ A4 ได้เลย (เฉพาะแอดมิน) |

ข้อมูลผลงานอยู่ที่ `lib/projects.ts` รูปอยู่ที่ `public/works/<id>.webp`

---

## ตั้งค่าครั้งแรก (ทำครั้งเดียว ~20 นาที)

### 1. Google login
1. เข้า [Google Cloud Console](https://console.cloud.google.com/) → สร้างโปรเจกต์ใหม่
2. **APIs & Services → OAuth consent screen** → เลือก **External** → ใส่ชื่อแอป อีเมลติดต่อ → **Publish app** (ถ้าค้างเป็น Testing จะล็อกอินได้แค่คนที่เพิ่มชื่อไว้)
3. **Credentials → Create credentials → OAuth client ID → Web application**
4. **Authorized redirect URIs** ใส่ทั้งสองอัน:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://<โดเมน-vercel>/api/auth/callback/google`
5. ได้ Client ID / Client secret → เอาไปใส่ `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`

> ขอแค่ scope email/profile พื้นฐาน จึงไม่ต้องรอ Google รีวิวแอป

### 2. Deploy บน Vercel
1. Push โค้ดขึ้น GitHub
2. Vercel → **Add New → Project** → เลือก repo → Deploy
3. **Storage → Create Database → Neon (Postgres)** → Connect กับโปรเจกต์ (จะได้ `DATABASE_URL` อัตโนมัติ)
4. **Settings → Environment Variables** ใส่ค่าตาม `.env.example`
   - `AUTH_SECRET` สุ่มด้วย `npx auth secret`
   - `ADMIN_EMAILS` อีเมลคนที่ดูผลได้
   - `VOTE_OPENS_AT` / `VOTE_CLOSES_AT` เช่น `2026-11-20T09:00:00+07:00`
   - `PUBLIC_URL` โดเมนจริง (ใส่ก่อนพิมพ์ QR)
5. **Deployments → Redeploy** ให้ค่าใหม่มีผล

### 3. สร้างตารางในฐานข้อมูล
เลือกวิธีใดก็ได้
- เปิด Neon Console → **SQL Editor** → วางเนื้อหาไฟล์ `db/schema.sql` → Run
- หรือในเครื่อง: ใส่ `DATABASE_URL` ใน `.env.local` แล้ว `npm run db:setup`

### 4. พิมพ์ QR
ล็อกอินด้วยอีเมลแอดมิน → เปิด `/qr` → กด **พิมพ์ / บันทึกเป็น PDF**
ตรวจให้แน่ใจว่าบรรทัดบนสุดแสดงโดเมนจริง ไม่ใช่ `localhost`

---

## ทำงานในเครื่อง

```bash
npm install
cp .env.example .env.local   # แล้วใส่ค่า
npm run dev                  # http://localhost:3000/p/ind-01
```

## ทำงานร่วมกันบน GitHub
- แตก branch → แก้ → เปิด Pull Request → Vercel สร้างลิงก์ preview ให้ลองก่อน merge
- **ห้าม commit `.env.local`** (อยู่ใน `.gitignore` แล้ว)
- Vercel แพลนฟรี + repo private: ให้เจ้าของบัญชี Vercel เป็นคนกด merge ไม่งั้นอาจไม่ deploy
- **ห้ามแก้ `id` ของผลงานหลังพิมพ์ QR** เพราะ QR ชี้ไปที่ id นั้น

## เพิ่ม / แก้ผลงาน
1. วางรูป (แนวตั้ง) ที่ `public/works/<id>.webp`
2. เพิ่มบรรทัดใน `lib/projects.ts`
   ```ts
   { id: "ind-39", team: "ชื่อทีม", track: "industry", partner: "ชื่อบริษัท", game: "ชื่อเกม" },
   ```
   `game` ไม่ใส่ก็ได้ ถ้าใส่จะแสดงเป็น “ชื่อเกม — ชื่อทีม”

## กันโกงยังไง
- ล็อกอินผ่าน Google เท่านั้น เช็กว่าอีเมลยืนยันแล้วและลงท้าย @bumail.net / @bu.ac.th ทั้งตอนล็อกอินและตอนโหวต
- ตาราง `votes` ใช้ `voter_email` เป็น PRIMARY KEY ฐานข้อมูลจึงไม่ยอมให้อีเมลเดียวมีสองโหวต แม้กดรัวหรือยิง API ตรง
- เปิด/ปิดโหวตตามเวลาฝั่ง server
- ผลโหวตเห็นเฉพาะแอดมิน

## ปัญหาที่เจอบ่อย
- **ล็อกอินแล้วขึ้น “Error 403: disallowed_useragent”** เปิดจาก LINE/Facebook/IG ให้เปิดใน Chrome/Safari (QR ใส่ `?openExternalBrowser=1` ไว้แล้ว LINE จะเปิดเบราว์เซอร์ให้เอง)
- **ขึ้น redirect_uri_mismatch** ยังไม่ได้ใส่ redirect URI ของโดเมนนั้นใน Google Cloud
- **ล็อกอินได้แค่บางคน** OAuth consent screen ยังเป็น Testing ให้กด Publish
- **อยากล้างคะแนนทดสอบก่อนวันงาน** Neon SQL Editor → `DELETE FROM votes;`
