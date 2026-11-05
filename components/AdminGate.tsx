import { auth } from "@/auth";
import { login, logout } from "@/app/actions";
import { Brand } from "@/components/Brand";
import { isAdmin } from "@/lib/config";

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
