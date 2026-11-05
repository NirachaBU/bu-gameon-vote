import { login } from "@/app/actions";
import { Brand } from "@/components/Brand";

export default function Denied() {
  return (
    <main className="page">
      <Brand />
      <section className="card card-body hero">
        <h1>เข้าสู่ระบบไม่สำเร็จ</h1>
        <p>
          ต้องใช้อีเมลมหาวิทยาลัยเท่านั้น
          <br />
          <strong>@bumail.net</strong> (นักศึกษา) หรือ <strong>@bu.ac.th</strong> (อาจารย์)
        </p>
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
