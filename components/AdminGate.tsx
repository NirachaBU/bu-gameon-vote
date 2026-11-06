import { auth } from "@/auth";
import { login, logout } from "@/app/actions";
import { Brand } from "@/components/Brand";
import { isAdmin, isAllowedEmail } from "@/lib/config";
import { getMyVotes } from "@/lib/db";

/** คืน email ของแอดมิน หรือ null พร้อมหน้าให้ล็อกอิน */
export async function requireAdmin(path: string) {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? null;
  if (isAdmin(email)) return { email, gate: null };

  const gate = (
    <main className="page">
      <Brand />
      <section className="card card-body hero">
        <h1>สำหรับผู้จัดงานเท่านั้น</h1>
        {email ? (
          <>
            <p className="muted">{email} ไม่มีสิทธิ์ดูหน้านี้</p>
            <form action={logout.bind(null, path)}>
              <button className="btn btn-ghost" type="submit">เปลี่ยนบัญชี</button>
            </form>
          </>
        ) : (
          <form action={login.bind(null, path)}>
            <button className="btn btn-primary" type="submit">เข้าสู่ระบบ</button>
          </form>
        )}
      </section>
    </main>
  );
  return { email: null, gate };
}

/** ดูผลโหวตได้ถ้าเป็นแอดมิน หรือโหวตไปแล้ว (คนที่ยังไม่โหวตจะได้ไม่ถูกคะแนนสดชักจูง) */
export async function canViewResults(email: string | null) {
  if (isAdmin(email)) return true;
  return !!email && isAllowedEmail(email) && (await getMyVotes(email)).length > 0;
}

export async function requireResultsAccess(path: string) {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? null;
  if (await canViewResults(email)) return { gate: null };

  const gate = (
    <main className="page">
      <Brand />
      <section className="card card-body hero">
        <h1>โหวตก่อน แล้วค่อยดูผล</h1>
        <p className="muted">ผลโหวตเปิดให้ดูเฉพาะคนที่โหวตแล้ว สแกน QR ที่บูธที่ชอบเพื่อโหวตได้เลย</p>
        {email ? (
          <form action={logout.bind(null, path)} className="account">
            <span>{email}</span>
            <button type="submit" className="link">ไม่ใช่บัญชีนี้?</button>
          </form>
        ) : (
          <form action={login.bind(null, path)}>
            <button className="btn btn-ghost" type="submit">เข้าสู่ระบบ</button>
          </form>
        )}
      </section>
    </main>
  );
  return { gate };
}
