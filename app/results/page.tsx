import { Brand } from "@/components/Brand";
import { requireResultsAccess } from "@/components/AdminGate";
import { LiveResults, type LiveMeta } from "@/components/LiveResults";
import { formatThaiTime, votingStatus } from "@/lib/config";
import { getLiveData } from "@/lib/live";
import { TRACK_LABEL, projects, projectImage, projectLabel } from "@/lib/projects";

export const dynamic = "force-dynamic";
export const metadata = { title: "ผลโหวต · BU Game On" };

export default async function Results() {
  const { gate } = await requireResultsAccess("/results");
  if (gate) return gate;

  const initial = await getLiveData();
  const status = votingStatus();
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
        <LiveResults initial={initial} meta={meta} />
        <p className="hint lr-note">อัปเดตเองทุก 5 วินาที · คะแนนเท่ากัน ทีมที่ถึงคะแนนนั้นก่อนอยู่บนกว่า</p>
      </section>
    </main>
  );
}
