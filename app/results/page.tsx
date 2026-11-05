import Link from "next/link";
import { Brand } from "@/components/Brand";
import { requireAdmin } from "@/components/AdminGate";
import { formatThaiTime, votingStatus } from "@/lib/config";
import { getTally } from "@/lib/db";
import { TRACK_LABEL, projects, projectImage, projectLabel, type Track } from "@/lib/projects";

export const dynamic = "force-dynamic";
export const metadata = { title: "ผลโหวต · BU Game On" };

export default async function Results() {
  const { gate } = await requireAdmin("/results");
  if (gate) return gate;

  const tally = new Map((await getTally()).map((t) => [t.project_id, t]));
  const rows = projects.map((p) => ({
    p,
    student: tally.get(p.id)?.student ?? 0,
    staff: tally.get(p.id)?.staff ?? 0,
    total: tally.get(p.id)?.total ?? 0,
  }));
  const totalVoters = rows.reduce((s, r) => s + r.total, 0);
  const totalStaff = rows.reduce((s, r) => s + r.staff, 0);
  const status = votingStatus();

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
          <div className="stat">
            <strong>{totalVoters.toLocaleString("th-TH")}</strong>
            <span>
              คนโหวต · นศ. {totalVoters - totalStaff} · อาจารย์ {totalStaff}
            </span>
          </div>
        </div>
        <p className="hint">รีเฟรชหน้าเพื่ออัปเดตคะแนน</p>

        {(["industry", "rising"] as Track[]).map((track) => {
          const list = rows.filter((r) => r.p.track === track).sort((a, b) => b.total - a.total);
          const max = Math.max(1, ...list.map((r) => r.total));
          return (
            <section key={track} className="track">
              <h2>{TRACK_LABEL[track]}</h2>
              <ol className="board">
                {list.map((r, i) => (
                  <li key={r.p.id}>
                    <span className="rank">{i + 1}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={projectImage(r.p)} alt="" />
                    <div className="board-main">
                      <Link href={`/p/${r.p.id}`}>{projectLabel(r.p)}</Link>
                      <div className="bar">
                        <span className="bar-student" style={{ width: `${(r.student / max) * 100}%` }} />
                        <span className="bar-staff" style={{ width: `${(r.staff / max) * 100}%` }} />
                      </div>
                      <small className="muted">
                        นศ. {r.student} · อาจารย์ {r.staff}
                      </small>
                    </div>
                    <strong className="score">{r.total}</strong>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </section>
    </main>
  );
}
