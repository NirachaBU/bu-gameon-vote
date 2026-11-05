import { headers } from "next/headers";
import QRCode from "qrcode";
import { requireAdmin } from "@/components/AdminGate";
import { TRACK_LABEL, projects, projectLabel } from "@/lib/projects";
import { PrintButton } from "./PrintButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "QR สำหรับพิมพ์ · BU Game On" };

async function baseUrl() {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export default async function QrSheet() {
  const { gate } = await requireAdmin("/qr");
  if (gate) return gate;

  const base = await baseUrl();
  const cards = await Promise.all(
    projects.map(async (p) => {
      // openExternalBrowser=1 ทำให้ LINE เปิดลิงก์ในเบราว์เซอร์จริง ล็อกอิน Google ได้
      const url = `${base}/p/${p.id}?openExternalBrowser=1`;
      const svg = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M" });
      return { p, url, svg };
    }),
  );

  return (
    <main className="qr-page">
      <div className="qr-toolbar no-print">
        <div>
          <h1>QR ของทุกผลงาน ({projects.length})</h1>
          <p className="muted">ลิงก์ใน QR ชี้ไปที่ {base} · พิมพ์ A4 ได้ 6 ใบต่อหน้า</p>
        </div>
        <PrintButton />
      </div>
      <div className="qr-grid">
        {cards.map(({ p, url, svg }) => (
          <div className="qr-card" key={p.id}>
            <div className="qr-event">BU GAME ON EXPO 2026</div>
            <div className="qr-track">{TRACK_LABEL[p.track]}</div>
            <div className="qr-code" dangerouslySetInnerHTML={{ __html: svg }} />
            <div className="qr-team">{projectLabel(p)}</div>
            <div className="qr-cta">สแกนด้วยกล้องมือถือเพื่อโหวต</div>
            <div className="qr-url">{url.replace(/^https?:\/\//, "").replace(/\?.*$/, "")}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
