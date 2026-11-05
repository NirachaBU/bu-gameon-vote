import Link from "next/link";
import { auth } from "@/auth";
import { login, logout } from "@/app/actions";
import { Brand } from "@/components/Brand";
import { InAppBrowserWarning } from "@/components/InAppBrowserWarning";
import { formatThaiTime, isAdmin, isAllowedEmail, votingStatus } from "@/lib/config";
import { getMyVote } from "@/lib/db";
import { getProject, projectImage, projectLabel } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  const signedIn = !!email && isAllowedEmail(email);
  const myVote = signedIn ? await getMyVote(email) : null;
  const voted = myVote ? getProject(myVote.project_id) : null;
  const status = votingStatus();

  return (
    <main className="page">
      <Brand />
      <InAppBrowserWarning />

      <section className="card card-body hero">
        {voted ? (
          <>
            <p className="muted">คุณโหวตให้</p>
            <Link href={`/p/${voted.id}`} className="voted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={projectImage(voted)} alt="" />
              <strong>{projectLabel(voted)}</strong>
            </Link>
            <p className="hint">ขอบคุณที่ร่วมโหวต</p>
          </>
        ) : (
          <>
            <h1>สแกน QR ที่บูธ แล้วโหวตผลงานที่ชอบที่สุด</h1>
            <ol className="steps">
              <li>สแกน QR ที่บูธด้วย<strong>กล้องมือถือ</strong></li>
              <li>เข้าสู่ระบบด้วยอีเมล @bumail.net หรือ @bu.ac.th</li>
              <li>กดโหวต · ได้คนละ 1 ผลงาน</li>
            </ol>
            {status === "before" && (
              <p className="notice">เปิดโหวต {formatThaiTime(process.env.VOTE_OPENS_AT)}</p>
            )}
            {status === "closed" && <p className="notice">ปิดโหวตแล้ว</p>}
            {!signedIn && (
              <form action={login.bind(null, "/")}>
                <button className="btn btn-ghost" type="submit">
                  เข้าสู่ระบบไว้ก่อน
                </button>
              </form>
            )}
          </>
        )}

        {signedIn && (
          <form action={logout.bind(null, "/")} className="account">
            <span>{email}</span>
            <button type="submit" className="link">
              ออกจากระบบ
            </button>
          </form>
        )}

        {isAdmin(email) && (
          <nav className="admin-links">
            <Link href="/results">ดูผลโหวต</Link>
            <Link href="/qr">พิมพ์ QR</Link>
          </nav>
        )}
      </section>
      <footer className="site-footer">
        <Link href="/privacy">นโยบายความเป็นส่วนตัว</Link>
      </footer>
    </main>
  );
}
