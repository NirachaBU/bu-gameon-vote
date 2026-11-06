import { auth } from "@/auth";
import { login } from "@/app/actions";
import { Brand } from "@/components/Brand";
import { AwardView } from "@/components/AwardView";
import { formatThaiTime, isAdmin, isRevealed, revealTime } from "@/lib/config";
import { getRanking } from "@/lib/ranking";

export const dynamic = "force-dynamic";
export const metadata = { title: "Audience Award · BU Game On Expo 2026" };

export default async function AwardPage() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? null;
  const admin = isAdmin(email);
  const revealed = isRevealed();

  // คนทั่วไปเห็นได้ตอนประกาศผล แอดมินเปิดได้ตลอด (ไว้ฉายจอตอนประกาศ)
  if (!admin && !revealed) {
    return (
      <main className="page">
        <Brand />
        <section className="card card-body hero">
          <h1>Audience Award</h1>
          <p className="muted">
            ประกาศผล{revealTime() ? ` ${formatThaiTime(revealTime()!.toISOString())}` : "หลังปิดโหวต"}
          </p>
          {!email && (
            <form action={login.bind(null, "/award")}>
              <button className="btn btn-ghost" type="submit">เข้าสู่ระบบ (ผู้จัดงาน)</button>
            </form>
          )}
        </section>
      </main>
    );
  }

  // อันดับ 1 ทีมเดียว (คะแนนเท่ากัน → ทีมที่ถึงคะแนนนั้นก่อนชนะ)
  const top = (await getRanking())[0];
  const winners = top && top.total > 0 ? [top.p] : [];
  const max = top?.total ?? 0;

  if (winners.length === 0) {
    return (
      <main className="page">
        <Brand />
        <section className="card card-body hero">
          <h1>Audience Award</h1>
          <p className="muted">ยังไม่มีผลโหวต</p>
        </section>
      </main>
    );
  }

  return <AwardView winners={winners} votes={max} preview={admin && !revealed} />;
}
