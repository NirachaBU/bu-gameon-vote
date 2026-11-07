import { Brand } from "@/components/Brand";
import { requireResultsAccess } from "@/components/AdminGate";
import { auth } from "@/auth";
import { LiveResults, type LiveMeta } from "@/components/LiveResults";
import { formatThaiTime, isAdmin, resultsHidden, revealTime, votingStatus } from "@/lib/config";
import { getLiveData } from "@/lib/live";
import { TRACK_LABEL, projects, projectImage, projectLabel } from "@/lib/projects";

export const dynamic = "force-dynamic";
export const metadata = { title: "ผลโหวต · BU Game On" };

export default async function Results() {
  const { gate } = await requireResultsAccess("/results");
  if (gate) return gate;

  const session = await auth();
  const admin = isAdmin(session?.user?.email?.toLowerCase());
  const hidden = resultsHidden();
  const initial = hidden && !admin ? { total: 0, rows: [], hidden: true } : await getLiveData();
  const status = votingStatus();
  const revealAt = revealTime();
  const revealText = revealAt ? formatThaiTime(revealAt.toISOString()) : "";
  const meta: LiveMeta[] = projects.map((p) => ({
    id: p.id,
    label: projectLabel(p),
    track: p.track,
    trackLabel: TRACK_LABEL[p.track],
    img: projectImage(p),
  }));

  return (
    <main className="page page-wide">
      <Brand />
      <section className="card card-body">
        <div className="results-head">
          <div>
            <h1>ผลโหวต</h1>
            <p className="muted">
              {status === "open" ? "กำลังเปิดโหวต" : status === "closed" ? "ปิดโหวตแล้ว" : "ยังไม่เปิดโหวต"}
              {process.env.VOTE_CLOSES_AT && ` · ปิด ${formatThaiTime(process.env.VOTE_CLOSES_AT)}`}
            </p>
          </div>
        </div>
        {admin && hidden && (
          <p className="lr-admin">🔒 ตอนนี้ซ่อนผลจากคนทั่วไปอยู่ · แอดมินเห็นผลสด</p>
        )}
        <LiveResults initial={initial} meta={meta} revealText={revealText} votingOpen={status === "open"} />
        <p className="hint lr-note">กดอัปเดตผลเพื่อดูคะแนนล่าสุด · คะแนนเท่ากัน ทีมที่ถึงคะแนนนั้นก่อนอยู่บนกว่า</p>
      </section>
    </main>
  );
}
