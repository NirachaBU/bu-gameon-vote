import { Brand } from "@/components/Brand";

export default function NotFound() {
  return (
    <main className="page">
      <Brand />
      <section className="card card-body hero">
        <h1>ไม่พบผลงานนี้</h1>
        <p className="muted">ลองสแกน QR ที่บูธอีกครั้ง</p>
      </section>
    </main>
  );
}
