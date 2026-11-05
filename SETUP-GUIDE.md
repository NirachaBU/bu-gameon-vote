# คู่มือตั้งค่าระบบโหวต BU Game On (สำหรับมือใหม่)

ทำตามทีละขั้นจากบนลงล่าง ใช้เวลาประมาณ 30–45 นาที
ทุกอย่างใช้แพลนฟรี ไม่ต้องใส่บัตรเครดิต

**สิ่งที่ต้องมีก่อนเริ่ม**
- บัญชี GitHub ที่มี repo `NirachaBU/bu-gameon-vote` (มีแล้ว ✅)
- บัญชี Google สำหรับสร้าง Google Cloud (ใช้ Gmail ส่วนตัวได้)
- **อีเมลมหาวิทยาลัย** (@bumail.net หรือ @bu.ac.th) 1 อัน ไว้ทดสอบและเป็นแอดมิน
- คอมพิวเตอร์ Mac (ใช้ Terminal ครั้งเดียวตอนสร้างรหัสลับ)

> **ภาพรวม:** Vercel = ที่วางเว็บ · Neon = ฐานข้อมูลเก็บคะแนน · Google Cloud = ระบบล็อกอิน
> เราจะ deploy เว็บก่อนเพื่อให้ได้ชื่อโดเมน แล้วค่อยเอาโดเมนไปตั้งค่า Google

---

## ขั้นที่ 1 · Deploy เว็บขึ้น Vercel

1. เข้า **https://vercel.com** → กด **Sign Up**
2. เลือก **Hobby** (ฟรี) → ใส่ชื่อ → กด **Continue with GitHub** แล้วอนุญาตให้ Vercel เข้าถึง GitHub
3. ในหน้า Dashboard กด **Add New…** → **Project**
4. ในหัวข้อ **Import Git Repository** หา `bu-gameon-vote` แล้วกด **Import**
   - ถ้าไม่เห็น repo ให้กด **Adjust GitHub App Permissions** → เลือก repo `bu-gameon-vote` → Save
5. หน้าตั้งค่าโปรเจกต์:
   - **Project Name:** `bu-gameon-vote` (ชื่อนี้จะกลายเป็นโดเมน)
   - **Framework Preset:** ต้องขึ้นว่า **Next.js** (ระบบเลือกให้เอง)
   - ส่วนอื่นไม่ต้องแก้
6. กด **Deploy** แล้วรอ 1–2 นาที จนขึ้น 🎉 Congratulations
7. กด **Continue to Dashboard** → ดูช่อง **Domains** จดโดเมนไว้ เช่น
   ```
   bu-gameon-vote.vercel.app
   ```
   (ถ้าชื่อนี้มีคนใช้แล้ว Vercel จะเติมตัวอักษรต่อท้ายให้ ให้ใช้ชื่อที่ได้จริง)

✅ ตอนนี้เปิดเว็บได้แล้ว แต่ยังล็อกอินไม่ได้ เป็นเรื่องปกติ

### 1.1 ตั้งเซิร์ฟเวอร์ให้อยู่สิงคโปร์ (เว็บจะเร็วขึ้นสำหรับคนไทย)
1. ในโปรเจกต์ไปที่ **Settings** → **Functions**
2. **Function Region** เลือก **Singapore (sin1)** → Save

---

## ขั้นที่ 2 · สร้างฐานข้อมูล Neon

1. ในโปรเจกต์บน Vercel กดแท็บ **Storage**
2. กด **Create Database** → เลือก **Neon** (Serverless Postgres) → **Continue**
3. ยอมรับเงื่อนไข แล้วตั้งค่า:
   - **Region:** **Singapore** (`aws-ap-southeast-1`)
   - **Plan:** **Free**
   - **Database name:** `bu-gameon-vote`
4. กด **Create** → หน้าถัดไปกด **Connect** กับโปรเจกต์ `bu-gameon-vote`
   (ติ๊กทุก Environment: Production, Preview, Development)
5. Vercel จะใส่ค่า `DATABASE_URL` ให้อัตโนมัติ ✅

### 2.1 สร้างตารางเก็บคะแนน
1. ยังอยู่ในแท็บ **Storage** → กดชื่อฐานข้อมูล → กด **Open in Neon**
2. ในหน้า Neon เมนูซ้ายกด **SQL Editor**
3. ลบข้อความเดิมในช่อง แล้ววางโค้ดนี้ (คัดลอกจากไฟล์ `db/schema.sql` ก็ได้)
   ```sql
   CREATE TABLE IF NOT EXISTS votes (
     voter_email TEXT PRIMARY KEY,
     project_id  TEXT NOT NULL,
     role        TEXT NOT NULL CHECK (role IN ('student', 'staff')),
     created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
   );

   CREATE INDEX IF NOT EXISTS votes_project_idx ON votes (project_id);
   ```
4. กด **Run** → ขึ้นว่าสำเร็จ ✅
5. ตรวจ: เมนูซ้าย **Tables** ต้องเห็นตาราง `votes`

---

## ขั้นที่ 3 · ตั้งค่า Google Login

### 3.1 สร้างโปรเจกต์ใน Google Cloud
1. เข้า **https://console.cloud.google.com** แล้วล็อกอินด้วย Gmail
   - ครั้งแรกจะให้เลือกประเทศและยอมรับเงื่อนไข → **Agree and continue**
2. แถบบนสุดกดช่องเลือกโปรเจกต์ (ข้างโลโก้ Google Cloud) → **New Project**
3. **Project name:** `BU Game On Vote` → **Create**
4. รอสักครู่ แล้วกดช่องเลือกโปรเจกต์อีกครั้ง → เลือก `BU Game On Vote`
   (เช็กว่าแถบบนแสดงชื่อนี้ ก่อนทำขั้นต่อไป)

### 3.2 ตั้งค่าหน้าขอสิทธิ์ (Consent screen)
1. ช่องค้นหาด้านบน พิมพ์ **Google Auth Platform** แล้วกดเข้าไป
2. กด **Get started** แล้วกรอก:
   - **App name:** `BU Game On Vote`
   - **User support email:** เลือกอีเมลตัวเอง → **Next**
   - **Audience:** เลือก **External** → **Next**
   - **Contact information:** ใส่อีเมลตัวเอง → **Next**
   - ติ๊กยอมรับเงื่อนไข → **Continue** → **Create**

### 3.3 สร้าง Client ID
1. เมนูซ้ายกด **Clients** → **+ Create client**
2. **Application type:** **Web application**
3. **Name:** `BU Game On Vote Web`
4. หน้านี้มี **2 ช่องที่หน้าตาคล้ายกัน** ระวังใส่ผิดช่อง (เปลี่ยนโดเมนเป็นของเราจากขั้นที่ 1)

   **ช่องบน: Authorized JavaScript origins** (ไม่บังคับ ข้ามได้)
   ถ้าจะใส่ ให้ใส่แค่โดเมน **ห้ามมี path และห้ามมี `/` ปิดท้าย**
   ```
   https://bu-gameon-vote.vercel.app
   ```

   **ช่องล่าง: Authorized redirect URIs** (บังคับ) กด **+ Add URI** แล้วใส่แบบเต็ม
   ```
   https://bu-gameon-vote.vercel.app/api/auth/callback/google
   ```
   ⚠️ ต้องตรงทุกตัวอักษร ขึ้นต้น `https://` ไม่มี `/` ปิดท้าย

   > ถ้าขึ้น **"Invalid Origin: URIs must not contain a path or end with "/""**
   > แปลว่าเอาลิงก์ที่มี `/api/auth/callback/google` ไปใส่ในช่อง **JavaScript origins** (ช่องบน)
   > ให้ลบออกจากช่องบน แล้วไปใส่ในช่อง **Authorized redirect URIs** (ช่องล่าง) แทน
5. กด **Create**
6. จะมีหน้าต่างแสดง **Client ID** และ **Client secret**
   - กด **Download JSON** เก็บไว้ หรือคัดลอกทั้งสองค่าไปวางในโน้ต
   - ⚠️ Client secret อาจแสดงครั้งเดียว อย่าปิดหน้าต่างก่อนคัดลอก
   - ⚠️ ห้ามส่งค่านี้ในแชตกลุ่มหรือ commit ลง GitHub

### 3.4 กรอกข้อมูลแอป (Branding)
Google บังคับให้มีลิงก์หน้าแรกและนโยบายความเป็นส่วนตัวก่อน publish (เว็บเรามีหน้า `/privacy` ให้แล้ว)

1. เมนูซ้ายกด **Branding**
2. กรอก (เปลี่ยนโดเมนเป็นของเรา)
   - **App name:** `BU Game On Vote`
   - **User support email:** อีเมลตัวเอง
   - **App logo:** ไม่ต้องใส่ (ถ้าใส่ Google จะต้องตรวจสอบแอปก่อน รอนานหลายวัน)
   - **Application home page:** `https://bu-gameon-vote.vercel.app`
   - **Application privacy policy link:** `https://bu-gameon-vote.vercel.app/privacy`
   - **Application terms of service link:** ไม่ต้องใส่
   - **Authorized domains:** กด **+ Add domain** ใส่ `bu-gameon-vote.vercel.app`
   - **Developer contact information:** อีเมลตัวเอง
3. กด **Save**

### 3.5 เปิดให้ทุกคนล็อกอินได้ (สำคัญมาก)
1. เมนูซ้ายกด **Audience**
2. ตรง **Publishing status: Testing** กด **Publish app** → **Confirm**
3. ต้องขึ้นว่า **In production** ✅

> ถ้าขึ้นว่า **"Valid app name, support email, homepage url, and privacy policy url are required…"**
> แปลว่ายังไม่ได้ทำขั้น 3.4 หรือยังไม่ได้ Save หน้า Branding
> และต้องเปิด `https://bu-gameon-vote.vercel.app/privacy` ได้จริงก่อน (ถ้ายังไม่ขึ้น ให้รอ Vercel deploy เสร็จ)

> ถ้าค้างเป็น Testing จะล็อกอินได้แค่อีเมลที่เพิ่มไว้ในรายชื่อ Test users เท่านั้น
> แอปนี้ขอแค่อีเมลกับชื่อ จึงไม่ต้องส่งให้ Google ตรวจสอบ

---

## ขั้นที่ 4 · สร้างรหัสลับ AUTH_SECRET

1. บน Mac เปิด **Terminal** (กด `⌘ + Space` พิมพ์ Terminal → Enter)
2. พิมพ์คำสั่งนี้แล้วกด Enter
   ```bash
   openssl rand -base64 32
   ```
3. จะได้ข้อความยาวๆ เช่น `k3J9x...=` คัดลอกเก็บไว้ (ทุกคนจะได้ไม่ซ้ำกัน)

---

## ขั้นที่ 5 · ใส่ค่าตั้งค่าใน Vercel

1. Vercel → โปรเจกต์ → **Settings** → **Environment Variables**
2. กดปุ่ม **Add Environment Variable** (หรือถ้าเห็นช่อง Key/Value อยู่แล้วก็กรอกได้เลย)
3. ใส่ทีละตัว: พิมพ์ **Key** และ **Value** → Environments เลือก **All Environments** → กด **Save**
   - ถ้าจะใส่หลายตัวในรอบเดียว กด **Add Another** เพื่อเพิ่มแถว แล้วค่อยกด **Save** ทีเดียว

| Key | Value | หมายเหตุ |
|---|---|---|
| `AUTH_SECRET` | ข้อความจากขั้นที่ 4 | |
| `AUTH_GOOGLE_ID` | Client ID จากขั้น 3.3 | ลงท้ายด้วย `.apps.googleusercontent.com` |
| `AUTH_GOOGLE_SECRET` | Client secret จากขั้น 3.3 | ขึ้นต้นด้วย `GOCSPX-` |
| `ADMIN_EMAILS` | เช่น `6xxxxxxx@bumail.net,teacher@bu.ac.th` | ⚠️ **ต้องเป็นอีเมลมหาวิทยาลัย** เพราะระบบให้ล็อกอินได้แค่ 2 โดเมนนี้ หลายคนคั่นด้วย `,` ไม่เว้นวรรค |
| `PUBLIC_URL` | `https://bu-gameon-vote.vercel.app` | โดเมนจากขั้นที่ 1 ไม่มี `/` ปิดท้าย ใช้ตอนสร้าง QR |
| `VOTE_OPENS_AT` | (เว้นไว้ก่อน) | ใส่ตอนใกล้วันงาน ดูขั้นที่ 8 |
| `VOTE_CLOSES_AT` | (เว้นไว้ก่อน) | |

4. เช็กว่ามี `DATABASE_URL` อยู่ในรายการแล้ว (Neon ใส่ให้ในขั้นที่ 2)

### 5.1 Redeploy ให้ค่าใหม่มีผล
1. ไปแท็บ **Deployments**
2. อันบนสุด กดปุ่ม **⋯** ด้านขวา → **Redeploy** → **Redeploy**
3. รอจนสถานะเป็น **Ready** ✅

> ทุกครั้งที่แก้ Environment Variables ต้อง Redeploy ใหม่

---

## ขั้นที่ 6 · ทดสอบ

ใช้มือถือ เปิดด้วย **Chrome หรือ Safari** (ห้ามเปิดจาก LINE)

| ทดสอบ | ทำอะไร | ผลที่ควรได้ |
|---|---|---|
| หน้าผลงาน | เปิด `https://bu-gameon-vote.vercel.app/p/ind-01` | เห็นโปสเตอร์ทีม Devsangluy + ปุ่มเข้าสู่ระบบ |
| ล็อกอินด้วย Gmail ส่วนตัว | กดเข้าสู่ระบบ เลือก @gmail.com | ขึ้นหน้า "เข้าสู่ระบบไม่สำเร็จ" ✅ ถูกต้อง |
| ล็อกอินด้วยอีเมลมหาลัย | กดลองใหม่ เลือก @bumail.net | กลับมาหน้าผลงาน มีปุ่ม "โหวตผลงานนี้" |
| โหวต | กดโหวต → ยืนยัน | ขึ้น ✓ คุณโหวตผลงานนี้แล้ว |
| โหวตซ้ำ | เปิด `/p/ind-02` | ขึ้น "คุณโหวตให้ Devsangluy ไปแล้ว" ไม่มีปุ่มโหวต |
| หน้าผล (แอดมิน) | เปิด `/results` ด้วยอีเมลใน `ADMIN_EMAILS` | เห็น Devsangluy ได้ 1 คะแนน |
| หน้า QR (แอดมิน) | เปิด `/qr` | เห็น QR 44 ใบ ด้านบนแสดงโดเมนจริง |
| สแกนจาก LINE | ส่ง QR ให้ตัวเอง สแกนด้วยกล้อง LINE | เด้งออกไปเปิดใน Safari/Chrome |

### 6.1 ⚠️ เช็กว่ามหาวิทยาลัยบล็อกแอปภายนอกหรือไม่
ถ้าล็อกอินด้วย @bumail.net แล้วขึ้น **"Access blocked"** หรือ **"แอปนี้ถูกบล็อก"**
แปลว่าผู้ดูแลระบบอีเมลของมหาวิทยาลัยจำกัดแอปภายนอก ต้องติดต่อฝ่าย IT
ขอให้ **อนุญาต (allowlist) OAuth Client ID** ของเรา โดยส่ง `AUTH_GOOGLE_ID` ให้
→ **ควรทดสอบข้อนี้ให้เร็วที่สุด** เผื่อต้องรอ IT

### 6.2 ล้างคะแนนทดสอบ
Neon → **SQL Editor** → วางแล้วกด Run
```sql
DELETE FROM votes;
```

---

## ขั้นที่ 7 · พิมพ์ QR

1. ล็อกอินด้วยอีเมลแอดมิน → เปิด `https://bu-gameon-vote.vercel.app/qr`
2. เช็กบรรทัดบนว่าลิงก์ชี้ไปที่โดเมนจริง (ไม่ใช่ `localhost`)
3. กด **พิมพ์ / บันทึกเป็น PDF**
   - ใช้ Chrome บนคอมจะสวยที่สุด
   - Destination: **Save as PDF** · Paper: **A4** · ติ๊ก **Background graphics**
4. ได้หน้าละ 6 ใบ รวม 8 หน้า นำไปพิมพ์ตัดแปะบูธ
5. **ลองสแกน QR ที่พิมพ์ออกมาจริงอย่างน้อย 2–3 ใบ** ก่อนแปะ

⚠️ หลังพิมพ์ QR แล้ว **ห้ามเปลี่ยนโดเมนหรือ id ผลงาน** ไม่งั้น QR จะใช้ไม่ได้

---

## ขั้นที่ 8 · ก่อนวันงาน (Checklist)

- [ ] ล้างคะแนนทดสอบ `DELETE FROM votes;`
- [ ] ตั้งเวลาเปิด-ปิดโหวตใน Vercel Environment Variables แล้ว **Redeploy**
  ```
  VOTE_OPENS_AT  = 2026-11-20T09:00:00+07:00
  VOTE_CLOSES_AT = 2026-11-20T17:00:00+07:00
  ```
  รูปแบบ: `ปี-เดือน-วันTชั่วโมง:นาที:วินาที+07:00` (`+07:00` = เวลาไทย) **เปลี่ยนเป็นวันงานจริง**
- [ ] เปิด `/p/ind-01` เช็กว่าขึ้น "ยังไม่เปิดโหวต" พร้อมเวลาที่ถูกต้อง
- [ ] ทำป้ายเล็กที่บูธ: **"สแกนด้วยกล้องมือถือ · ใช้อีเมล @bumail.net"**
- [ ] แอดมินเปิด `/results` บนมือถือ/คอมไว้ดูผลระหว่างงาน (กดรีเฟรชเพื่ออัปเดต)

---

## แก้ปัญหาที่เจอบ่อย

| อาการ | สาเหตุ | วิธีแก้ |
|---|---|---|
| `Error 400: redirect_uri_mismatch` | Redirect URI ใน Google ไม่ตรงกับโดเมน | กลับไปขั้น 3.3 เช็ก `https://` และโดเมนให้ตรงเป๊ะ |
| `Error 403: disallowed_useragent` | เปิดในแอป LINE/Facebook/IG | เปิดลิงก์ใน Safari/Chrome |
| `Error 403: access_denied` | Consent screen ยังเป็น Testing | ขั้น 3.4–3.5 กรอก Branding แล้วกด Publish app |
| `Access blocked` ตอนใช้ @bumail.net | มหาลัยบล็อกแอปภายนอก | ขั้น 6.1 ติดต่อ IT |
| หน้าเว็บขึ้น `Server Error` / `Configuration` | ลืมใส่ env หรือยังไม่ Redeploy | ขั้น 5 เช็กครบทุกตัว แล้ว Redeploy |
| กดโหวตแล้ว "ระบบขัดข้อง" | ยังไม่สร้างตาราง หรือไม่มี `DATABASE_URL` | ทำขั้น 2.1 ใหม่ |
| เข้า `/results` แล้ว "ไม่มีสิทธิ์" | อีเมลไม่อยู่ใน `ADMIN_EMAILS` | เพิ่มอีเมล (ต้องเป็นอีเมลมหาลัย) แล้ว Redeploy |
| QR ชี้ไป `localhost` | ไม่ได้ตั้ง `PUBLIC_URL` | ขั้น 5 ใส่ `PUBLIC_URL` แล้ว Redeploy ก่อนพิมพ์ |

---

## แก้ข้อมูลผลงานภายหลัง

แก้ไฟล์บน GitHub ได้เลย ไม่ต้องลงโปรแกรม
1. เปิด repo บน github.com → ไฟล์ `lib/projects.ts` → กดไอคอน ✏️ (Edit)
2. แก้ชื่อทีม หรือเติมชื่อเกม เช่น
   ```ts
   { id: "ind-01", team: "Devsangluy", track: "industry", partner: "B2S", game: "สีสรรค์" },
   ```
3. กด **Commit changes** → Vercel จะ deploy ให้อัตโนมัติใน 1–2 นาที

⚠️ ห้ามแก้ `id` หลังพิมพ์ QR แล้ว
