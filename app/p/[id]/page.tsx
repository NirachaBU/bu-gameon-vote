import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { login, logout } from "@/app/actions";
import { Brand } from "@/components/Brand";
import { InAppBrowserWarning } from "@/components/InAppBrowserWarning";
import { VoteButton } from "@/components/VoteButton";
import { PosterViewer } from "@/components/PosterViewer";
import { formatThaiTime, isAllowedEmail, votingStatus } from "@/lib/config";
import { getMyVote } from "@/lib/db";
import { TRACK_LABEL, getProject, projectImage, projectLabel } from "@/lib/projects";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).id);
  return { title: p ? `โหวต ${projectLabel(p)} · BU Game On` : "BU Game On" };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  const signedIn = !!email && isAllowedEmail(email);
  const myVote = signedIn ? await getMyVote(email) : null;
  const votedFor = myVote ? getProject(myVote.project_id) : null;
  const status = votingStatus();
  const here = `/p/${project.id}`;

  return (
    <main className="page">
      <Brand />
      <InAppBrowserWarning />

      <article className="card">
        <PosterViewer src={projectImage(project)} alt={`โปสเตอร์ผลงานทีม ${project.team}`} />
        <div className="card-body">
          <span className={`tag tag-${project.track}`}>{TRACK_LABEL[project.track]}</span>
          <h1>{projectLabel(project)}</h1>
          {project.partner && <p className="muted">ร่วมกับ {project.partner}</p>}

          <div className="vote-box">
            {status === "before" ? (
              <p className="notice">
                ยังไม่เปิดโหวต · เปิด {formatThaiTime(process.env.VOTE_OPENS_AT)}
              </p>
            ) : status === "closed" ? (
              <p className="notice">ปิดโหวตแล้ว ขอบคุณที่ร่วมสนุก</p>
            ) : !signedIn ? (
              <form action={login.bind(null, here)} className="stack">
                <button className="btn btn-google" type="submit">
                  <GoogleIcon /> เข้าสู่ระบบเพื่อโหวต
                </button>
                <p className="hint">ใช้อีเมล @bumail.net (นักศึกษา) หรือ @bu.ac.th (อาจารย์)</p>
              </form>
            ) : myVote?.project_id === project.id ? (
              <div className="done">
                <span className="done-icon">✓</span>
                <p>คุณโหวตผลงานนี้แล้ว</p>
                <Link href="/results" className="btn btn-ghost btn-sm results-link">
                  ดูผลโหวต →
                </Link>
              </div>
            ) : votedFor ? (
              <div className="notice">
                คุณโหวตให้ <Link href={`/p/${votedFor.id}`}>{projectLabel(votedFor)}</Link>{" "}
                ไปแล้ว
                <br />
                <span className="hint">โหวตได้คนละ 1 ผลงาน</span>
                <Link href="/results" className="btn btn-ghost btn-sm results-link">
                  ดูผลโหวต →
                </Link>
              </div>
            ) : (
              <VoteButton projectId={project.id} team={projectLabel(project)} />
            )}
          </div>

          {signedIn && (
            <form action={logout.bind(null, here)} className="account">
              <span>{email}</span>
              <button type="submit" className="link">
                ไม่ใช่บัญชีนี้?
              </button>
            </form>
          )}
        </div>
      </article>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
