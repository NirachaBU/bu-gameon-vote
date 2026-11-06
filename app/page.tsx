import Link from "next/link";
import { auth } from "@/auth";
import { login, logout } from "@/app/actions";
import { Brand } from "@/components/Brand";
import { InAppBrowserWarning } from "@/components/InAppBrowserWarning";
import { formatThaiTime, isAdmin, isAllowedEmail, loginHint, votingStatus } from "@/lib/config";
import { getMyVotes } from "@/lib/db";
import { getProject, projectImage, projectLabel } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  const signedIn = !!email && isAllowedEmail(email);
  const myVotes = signedIn ? await getMyVotes(email) : [];
  const voted = myVotes.map(getProject).filter((p) => p !== undefined);
  const status = votingStatus();

  return (
    <main className="page">
      <Brand />
      <InAppBrowserWarning />

      <section className="card card-body hero">
        {voted.length > 0 ? (
          <>
            <h1>คุณโหวตไปแล้ว {voted.length} เกม</h1>
            <ul className="voted-grid">
              {voted.map((p) => (
                <li key={p.id}>
                  <Link href={`/p/${p.id}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={projectImage(p)} alt="" />
                    <span>{projectLabel(p)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="hint">สแกน QR บูธอื่นเพื่อโหวตต่อได้ · เกมละ 1 ครั้ง</p>
            <Link href="/results" className="btn btn-primary">
              ดูผลโหวต →
            </Link>
          </>
        ) : (
          <>
            <h1>สแกน QR ที่บูธ แล้วโหวตเกมที่ชอบ</h1>
            <ol className="steps">
              <li>สแกน QR ที่บูธด้วย<strong>กล้องมือถือ</strong></li>
              <li>เข้าสู่ระบบ · {loginHint()}</li>
              <li>กดโหวต · โหวตได้หลายเกม เกมละ 1 ครั้ง</li>
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
