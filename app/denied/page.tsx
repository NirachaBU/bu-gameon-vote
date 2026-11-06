import { login } from "@/app/actions";
import { Brand } from "@/components/Brand";
import { allowedDomains } from "@/lib/config";

export const dynamic = "force-dynamic";

export default function Denied() {
  return (
    <main className="page">
      <Brand />
      <section className="card card-body hero">
        <h1>เข้าสู่ระบบไม่สำเร็จ</h1>
        {allowedDomains().length > 0 ? (
          <p>
            ต้องใช้อีเมล{" "}
            {allowedDomains().map((d, i) => (
              <span key={d}>
                {i > 0 && " หรือ "}
                <strong>@{d}</strong>
              </span>
            ))}{" "}
            เท่านั้น
          </p>
        ) : (
          <p>ล็อกอินด้วยบัญชี Google ไม่สำเร็จ ลองใหม่อีกครั้ง</p>
        )}
        <p className="hint">ถ้าเปิดจาก LINE / Facebook / IG ให้เปิดใน Chrome หรือ Safari แทน</p>
        <form action={login.bind(null, "/")}>
          <button className="btn btn-primary" type="submit">
            ลองใหม่ด้วยบัญชีอื่น
          </button>
        </form>
        <p className="hint">หลังล็อกอินแล้ว สแกน QR ที่บูธอีกครั้งเพื่อโหวต</p>
      </section>
    </main>
  );
}
