"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LiveData } from "@/lib/live";

export type LiveMeta = { id: string; label: string; track: "industry" | "rising"; trackLabel: string; img: string };

const POLL_MS = 5000;

/** ตัวเลข % ที่วิ่งไปค่าใหม่แบบลื่นๆ */
function Num({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = performance.now(), a = from.current, b = value;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / 800), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (a + (b - a) * e).toFixed(2);
      if (k < 1) raf = requestAnimationFrame(step);
      else from.current = b;
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); from.current = b; };
  }, [value]);
  return <span ref={ref}>0.00</span>;
}

export function LiveResults({ initial, meta }: { initial: LiveData; meta: LiveMeta[] }) {
  const [data, setData] = useState(initial);
  const [rowH, setRowH] = useState(84);
  const [toast, setToast] = useState<string | null>(null);
  const prev = useRef<{ order: Map<string, number>; totals: Map<string, number>; leader: string | null }>({
    order: new Map(), totals: new Map(), leader: null,
  });
  const [flash, setFlash] = useState<{ up: Set<string>; bump: Map<string, number>; key: number }>({ up: new Set(), bump: new Map(), key: 0 });
  const byId = useMemo(() => new Map(meta.map((m) => [m.id, m])), [meta]);

  // ความสูงแถวตามขนาดจอ
  useEffect(() => {
    const mq = matchMedia("(max-width: 480px)");
    const set = () => setRowH(mq.matches ? 76 : 84);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // ดึงคะแนนใหม่ทุก 5 วินาที (หยุดเมื่อไม่ได้เปิดแท็บนี้อยู่)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    const tick = async () => {
      if (!document.hidden) {
        try {
          const r = await fetch("/api/results", { cache: "no-store" });
          if (r.ok) setData(await r.json());
        } catch {
          /* เน็ตหลุดชั่วคราว รอบหน้าค่อยลองใหม่ */
        }
      }
      if (!stopped) timer = setTimeout(tick, POLL_MS);
    };
    timer = setTimeout(tick, POLL_MS);
    return () => { stopped = true; clearTimeout(timer); };
  }, []);

  const rows = data.rows.filter((r) => byId.has(r.id));
  const top = rows[0]?.total ?? 0;
  const scale = top > 0 ? top * 1.12 : 1; // เว้นที่ไว้ ทีมนำจะไม่เต็มหลอด

  // เทียบกับรอบก่อน: ใครขึ้นอันดับ ใครได้โหวตเพิ่ม ผู้นำเปลี่ยนไหม
  useEffect(() => {
    const p = prev.current;
    const up = new Set<string>(), bump = new Map<string, number>();
    rows.forEach((r, i) => {
      const was = p.order.get(r.id);
      if (was !== undefined && i < was) up.add(r.id);
      const before = p.totals.get(r.id);
      if (before !== undefined && r.total > before) bump.set(r.id, r.total - before);
    });
    const leader = rows[0] && rows[0].total > 0 ? rows[0].id : null;
    if (p.leader && leader && leader !== p.leader && rows[0].total > (p.totals.get(p.leader) ?? 0)) {
      setToast(`🔥 ${byId.get(leader)?.label} ขึ้นนำแล้ว!`);
      setTimeout(() => setToast(null), 2600);
    }
    if (up.size || bump.size) {
      setFlash((f) => ({ up, bump, key: f.key + 1 }));
      setTimeout(() => setFlash((f) => ({ ...f, up: new Set(), bump: new Map() })), 1400);
    }
    p.order = new Map(rows.map((r, i) => [r.id, i]));
    p.totals = new Map(rows.map((r) => [r.id, r.total]));
    p.leader = leader;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <div className="lr-head">
        <span className="lr-live"><i />LIVE</span>
      </div>

      <div className="lr-list" style={{ height: rows.length * rowH }}>
        {rows.map((r, i) => {
          const m = byId.get(r.id)!;
          const share = data.total > 0 ? (r.total / data.total) * 100 : 0;
          const lead = top > 0 && r.total === top;
          const cls = ["lr-row", lead && "lead", flash.up.has(r.id) && "up", flash.bump.has(r.id) && "bump"].filter(Boolean).join(" ");
          return (
            <Link
              key={r.id}
              href={`/p/${r.id}`}
              className={cls}
              style={{ transform: `translateY(${i * rowH}px)`, height: rowH, zIndex: 100 - i }}
            >
              <span className="lr-rank">{r.total > 0 ? i + 1 : "–"}</span>
              <span className="lr-main">
                <span className={`lr-trk ${m.track}`}>{m.trackLabel}</span>
                <span className="lr-name">{m.label}</span>
                <span className="lr-bar">
                  <span className="lr-fill" style={{ width: `${(r.total / scale) * 100}%` }} />
                </span>
              </span>
              <span className="lr-pct">
                <Num value={share} />
                <small>%</small>
                {flash.bump.has(r.id) && <span key={flash.key} className="lr-plus">+{flash.bump.get(r.id)}</span>}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lr-img" src={m.img} alt="" />
            </Link>
          );
        })}
      </div>

      <div className={`lr-toast${toast ? " show" : ""}`} role="status">{toast}</div>
    </>
  );
}
