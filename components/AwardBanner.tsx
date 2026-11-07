import Link from "next/link";
import { formatThaiTime, isRevealed, revealTime, votingStatus } from "@/lib/config";

/** ปุ่มไปหน้าประกาศรางวัล: ขึ้นเองเมื่อถึงเวลาประกาศผล · ปิดโหวตแล้วแต่ยังไม่ประกาศ = บอกเวลาประกาศ */
export function AwardBanner() {
  if (isRevealed()) {
    return (
      <Link href="/award" className="award-banner">
        <svg className="award-banner-cup" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3V3Zm0 4H6v1a2 2 0 0 0 1 1.7V7Zm10 0v2.7A2 2 0 0 0 18 8V7h-1Z"
          />
        </svg>
        <span className="award-banner-text">
          <small>ประกาศผลแล้ว!</small>
          <strong>ดูผู้ชนะ Audience Award</strong>
        </span>
        <span className="award-banner-go" aria-hidden="true">→</span>
      </Link>
    );
  }
  const reveal = revealTime();
  if (votingStatus() === "closed" && reveal) {
    return <p className="notice award-wait">🏆 ประกาศผล Audience Award {formatThaiTime(reveal.toISOString())}</p>;
  }
  return null;
}
