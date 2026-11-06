import Link from "next/link";
import { Brand } from "@/components/Brand";
import { requireResultsAccess } from "@/components/AdminGate";
import { formatThaiTime, votingStatus } from "@/lib/config";
import { getVoterCount } from "@/lib/db";
import { getRanking } from "@/lib/ranking";
import { TRACK_LABEL, projectImage, projectLabel } from "@/lib/projects";

export const dynamic = "force-dynamic";
export const metadata = { title: "ผลโหวต · BU Game On" };

export default async function Results() {
  const { gate } = await requireResultsAccess("/results");
  if (gate) return gate;

  const [ranked, voters] = await Promise.all([getRanking(), getVoterCount()]);
  const status = votingStatus();
  // หลอด = % ของคนที่โหวตแล้วที่เลือกเกมนี้ (คนหนึ่งโหวตได้หลายเกม จึงไม่มีทีมไหนเต็มเว้นแต่ทุกคนเลือก)
  const pct = (total: number) => (voters > 0 ? Math.round((total / voters) * 100) : 0);

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
        <p className="hint">
          หลอด = % ของคนที่โหวตแล้วที่เลือกเกมนี้ · รีเฟรชหน้าเพื่ออัปเดต · คะแนนเท่ากัน ทีมที่ถึงคะแนนนั้นก่อนอยู่อันดับดีกว่า
        </p>

        <section className="track">
          <h2>อันดับรวม · Industry Projects + Rising Star</h2>
          <ol className="board">
            {ranked.map((r, i) => (
              <li key={r.p.id}>
                <span className="rank">{r.rank ?? "–"}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={projectImage(r.p)} alt="" />
                <div className="board-main">
                  <Link href={`/p/${r.p.id}`}>{projectLabel(r.p)}</Link>
                  <div className="bar-row">
                    <div className="bar">
                      <span
                        className="bar-fill"
                        style={{ "--w": `${pct(r.total)}%`, animationDelay: `${Math.min(i, 20) * 40}ms` } as React.CSSProperties}
                      />
                    </div>
                    <span className="bar-pct">{pct(r.total)}%</span>
                  </div>
                  <small className="muted">
                    <span className={`tag-mini tag-${r.p.track}`}>{TRACK_LABEL[r.p.track]}</span>
                  </small>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </section>
    </main>
  );
}
