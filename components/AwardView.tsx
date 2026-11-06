import Link from "next/link";
import { Fireworks } from "@/components/Fireworks";
import { TRACK_LABEL, projectImage, projectLabel, type Project } from "@/lib/projects";

export function AwardView({ winners, votes, preview }: { winners: Project[]; votes: number; preview?: boolean }) {
  const max = votes;
  const multi = winners.length > 1;

  return (
    <main className="aw">
      <div className="aw-rays" aria-hidden="true" />
      <Fireworks />
      <div className="aw-wrap">
        <Link href="/" className="aw-brand">
          <span className="brand-bu">BU</span> <span className="brand-game">GAME ON</span>{" "}
          <span className="aw-expo">EXPO 2026</span>
        </Link>

        <div className={`aw-list${multi ? " aw-multi" : ""}`}>
          {winners.map((p) => (
            <div className="aw-frame" key={p.id}>
              <div className="aw-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="aw-poster" src={projectImage(p)} alt={`โปสเตอร์ผลงานทีม ${p.team}`} />
                <div className="aw-info">
                  <svg className="aw-cup" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3V3Zm0 4H6v1a2 2 0 0 0 1 1.7V7Zm10 0v2.7A2 2 0 0 0 18 8V7h-1Z"
                    />
                  </svg>
                  <div className="aw-label">{multi ? "ผู้ได้รับรางวัลร่วม" : "ผู้ได้รับรางวัล"}</div>
                  <div className="aw-title">
                    AUDIENCE
                    <br />
                    AWARD
                  </div>
                  <div className="aw-team">{projectLabel(p)}</div>
                  <div className="aw-meta">
                    <span className={`aw-track aw-track-${p.track}`}>{TRACK_LABEL[p.track]}</span>
                    <span className="aw-votes">
                      <b>{max.toLocaleString("th-TH")}</b> โหวต
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="aw-thanks">ขอบคุณทุกคนที่ร่วมโหวต</div>
        {preview && (
          <p className="aw-note">ตัวอย่างสำหรับผู้จัดงาน · ยังไม่ถึงเวลาประกาศ คนทั่วไปยังไม่เห็นหน้านี้</p>
        )}
      </div>
    </main>
  );
}
