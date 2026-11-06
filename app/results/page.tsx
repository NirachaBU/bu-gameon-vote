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
  const pct = (total: number) => (voters > 0 ? (total / voters) * 100 : 0);

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
          % = สัดส่วนคนที่โหวตแล้วที่เลือกเกมนี้ (โหวตได้หลายเกม) · รีเฟรชเพื่ออัปเดต · คะแนนเท่ากัน ทีมที่ถึงคะแนนนั้นก่อนอยู่บนกว่า
        </p>

        <section className="track">
          <h2>อันดับรวม · Industry Projects + Rising Star</h2>
          <ol className="vl">
            {ranked.map((r, i) => {
              const v = pct(r.total);
              const lead = i === 0 && r.total > 0;
              return (
                <li key={r.p.id} className={lead ? "vl-lead" : undefined}>
                  <Link href={`/p/${r.p.id}`} className="vl-row">
                    <div className="vl-main">
                      <span className={`vl-track tag-${r.p.track}`}>{TRACK_LABEL[r.p.track]}</span>
                      <span className="vl-name">{projectLabel(r.p)}</span>
                      <span className="vl-bar">
                        <span
                          className="vl-fill"
                          style={{ "--w": `${v}%`, animationDelay: `${Math.min(i, 20) * 40}ms` } as React.CSSProperties}
                        />
                      </span>
                    </div>
                    <div className="vl-pct">
                      {v.toFixed(2)}
                      <small>%</small>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="vl-img" src={projectImage(r.p)} alt="" />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      </section>
    </main>
  );
}
